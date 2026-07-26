#!/usr/bin/env node
/**
 * gap-report.mjs — "Bekleyen is var mi?"
 *
 * DB'yi ve KITAP_HIKAYE_ENVANTERI.md kuyrugunu okur, uretilecek isleri
 * oncelik sirasina koyar. Hicbir seye yazmaz (staging/reports haric).
 *
 * Kullanim:
 *   node scripts/story-pipeline/gap-report.mjs
 *   node scripts/story-pipeline/gap-report.mjs --json
 *   node scripts/story-pipeline/gap-report.mjs --limit 20
 */
import { existsSync, readFileSync } from 'fs';
import {
  PATHS, LANGS, openDb, rows, readBooks, readStories, readCategories, writeReport,
} from './lib/store.mjs';

const argv = process.argv.slice(2);
const asJson = argv.includes('--json');
const limit = Number(argv[argv.indexOf('--limit') + 1]) || 15;

const db = await openDb();
const books = readBooks(db);
const stories = readStories(db);
const categories = readCategories(db);

/* Icerik sagligi — ucuz tarama.
   gap-report'u tek basina calistiran biri bu hatalari gormezse
   bozuk paylas karti olan hikayeler uzerine yeni uretim yigilir. */
const brokenMarkers = [];
for (const r of rows(db, "SELECT story_id, lang_code, content FROM story_translations WHERE content IS NOT NULL AND content <> ''")) {
  const bad = ['##', '$$', '&&'].filter(
    (m) => (r.content.match(new RegExp(m.replace(/[$]/g, '\\$'), 'g')) || []).length % 2
  );
  if (bad.length) brokenMarkers.push({ story_id: r.story_id, lang: r.lang_code, marks: bad });
}
db.close();

const split = (s) => (s ? s.split(',') : []);
const missing = (have) => LANGS.filter((l) => !have.includes(l));

/* --- 1. DB ici bosluklar ------------------------------------------- */

const missingTranslations = stories
  .map((s) => ({ ...s, gap: missing(split(s.langs)) }))
  .filter((s) => s.gap.length);

const missingVariants = stories
  .map((s) => ({ ...s, gap: missing(split(s.variant_langs)) }))
  .filter((s) => s.gap.length);

const missingHooks = stories
  .map((s) => ({ ...s, gap: missing(split(s.hook_langs)) }))
  .filter((s) => s.gap.length);

const durationMismatch = stories.filter(
  (s) => s.current_read_minutes !== s.possible_read_minutes
);

const booksMissingLangs = books.filter((b) => b.lang_count < LANGS.length);
const thinBooks = books.filter((b) => b.story_count < 10);

/* --- 2. Envanter kuyrugu ------------------------------------------- */

const QUEUE_RE =
  /^\s*\d+\.\s*\[ \]\s*\*\*(?<status>[^*]+)\*\*\s*—\s*(?<title>.+?)\s*—\s*\*\*Sure:\*\*\s*(?<min>\d)\s*dk/u;
const BOOK_RE = /^##\s*(?<no>\d+)\.\s*(?<title>.+?)\s*$/u;
const SCORE_RE = /\*\*Puan:\*\*\s*(?<score>\d+)/u;

const queue = [];
let inventoryMissing = false;

if (existsSync(PATHS.inventory)) {
  const lines = readFileSync(PATHS.inventory, 'utf8').split('\n');
  let currentBook = null;
  for (const line of lines) {
    const b = line.match(BOOK_RE);
    if (b) {
      currentBook = { list_no: Number(b.groups.no), title: b.groups.title.trim() };
      continue;
    }
    const q = line.match(QUEUE_RE);
    if (q && currentBook) {
      queue.push({
        book: currentBook.title,
        list_no: currentBook.list_no,
        status: q.groups.status.trim(),
        title: q.groups.title.trim(),
        minutes: Number(q.groups.min),
        score: Number(line.match(SCORE_RE)?.groups.score ?? 0),
      });
    }
  }
} else {
  inventoryMissing = true;
}

const pending = queue
  .filter((q) => /URETILECEK|ÜRETİLECEK/i.test(q.status))
  .sort((a, b) => b.score - a.score);

const inReview = queue.filter((q) => /INCELEMEDE|İNCELEMEDE/i.test(q.status));

/* --- 3. Karar ------------------------------------------------------ */

const totals = {
  books: books.length,
  stories: stories.length,
  storiesFullyTranslated: stories.length - missingTranslations.length,
  storiesWithVariants: stories.length - missingVariants.length,
  queuePending: pending.length,
  queueInReview: inReview.length,
  brokenMarkers: brokenMarkers.length,
  inventoryMissing,
};

let nextAction;
if (inventoryMissing) {
  nextAction = 'SYNC — KITAP_HIKAYE_ENVANTERI.md yok. Once `node scripts/story-pipeline/sync-inventory.mjs` calistir.';
} else if (brokenMarkers.length) {
  nextAction = `ONARIM — ${brokenMarkers.length} ceviri kaydinda isaret blogu kapanmamis; bu hikayelerin paylas karti bozuk cikiyor. ` +
    'Yeni uretimden once: `node scripts/story-pipeline/propose-marker-repair.mjs`';
} else if (missingVariants.length) {
  nextAction = `VARYANT — ${missingVariants.length} hikayenin sohbet varyanti eksik. En dusuk riskli is; story-producer'i variants_only modunda calistir.`;
} else if (pending.length) {
  nextAction = `URETIM — kuyrukta ${pending.length} baslik bekliyor. En yuksek puanli ${Math.min(limit, pending.length)} tanesiyle yeni batch ac.`;
} else if (thinBooks.length) {
  nextAction = `BASLIK — kuyruk bos ama ${thinBooks.length} kitabin 10'dan az hikayesi var. book-scout'u mevcut kitaplara baslik uretmesi icin cagir.`;
} else {
  nextAction = 'YENI KITAP — kuyruk ve kitaplar dolu. book-scout ile yeni kitap arastir.';
}

/* --- 4. Cikti ------------------------------------------------------ */

if (asJson) {
  // DIKKAT: process.exit() kullanma. Cikti buyuk oldugunda stdout bir pipe'a
  // yaziliyorsa Node exit'te bufferi bosaltmadan cikar ve JSON yarim kalir.
  process.stdout.write(
    `${JSON.stringify(
      {
        totals,
        nextAction,
        pending: pending.slice(0, limit),
        missingVariants: missingVariants.slice(0, limit),
        missingTranslations,
        durationMismatch,
        booksMissingLangs,
        thinBooks: thinBooks.slice(0, limit),
      },
      null,
      2
    )}\n`
  );
} else {

const bookCat = (b) => b.category_tr || categories[b.category_id]?.tr || `kategori#${b.category_id}`;
const L = [];
const p = (s = '') => L.push(s);

p('# Bekleyen Is Raporu');
p('');
p(`- Uretildi: ${new Date().toISOString().slice(0, 16).replace('T', ' ')}`);
p(`- DB: ${totals.books} kitap · ${totals.stories} hikaye`);
p(`- 4 dili tam hikaye: ${totals.storiesFullyTranslated}/${totals.stories}`);
p(`- Sohbet varyanti tam hikaye: ${totals.storiesWithVariants}/${totals.stories}`);
p(`- Kuyrukta bekleyen baslik: ${totals.queuePending}`);
p(`- Incelemede: ${totals.queueInReview}`);
p('');
p('## Sonraki adim');
p('');
p(`**${nextAction}**`);
p('');

if (brokenMarkers.length) {
  const affected = [...new Set(brokenMarkers.map((b) => b.story_id))];
  p(`## ⚠ Icerik sagligi — ${brokenMarkers.length} kayitta isaret blogu kapanmamis`);
  p('');
  p(`Etkilenen hikaye: **${affected.length}**. Bu hikayelerin paylas karti bozuk goruntulenir.`);
  p('');
  p('| story_id | Dil | Kapanmamis |');
  p('|---:|---|---|');
  for (const b of brokenMarkers.slice(0, limit)) {
    p(`| ${b.story_id} | ${b.lang} | ${b.marks.join(' ')} |`);
  }
  if (brokenMarkers.length > limit) p(`| … | | *+${brokenMarkers.length - limit} kayit daha* |`);
  p('');
  p('Tam denetim: `npm run story:audit` · Onarim onerisi: `npm run story:propose-markers`');
  p('');
}

if (missingVariants.length) {
  p(`## Sohbet varyanti eksik (${missingVariants.length})`);
  p('');
  p('| story_id | Kitap no | Baslik (tr) | Eksik dil |');
  p('|---:|---:|---|---|');
  for (const s of missingVariants.slice(0, limit)) {
    p(`| ${s.id} | ${s.book_no} | ${(s.title_tr || '—').slice(0, 50)} | ${s.gap.join(', ')} |`);
  }
  if (missingVariants.length > limit) p(`| … | | *+${missingVariants.length - limit} kayit daha* | |`);
  p('');
}

if (missingTranslations.length) {
  p(`## Ana metin cevirisi eksik (${missingTranslations.length})`);
  p('');
  p('| story_id | Kitap no | Baslik (tr) | Eksik dil |');
  p('|---:|---:|---|---|');
  for (const s of missingTranslations) {
    p(`| ${s.id} | ${s.book_no} | ${(s.title_tr || '—').slice(0, 50)} | ${s.gap.join(', ')} |`);
  }
  p('');
}

if (missingHooks.length) {
  p(`## Hook (paylas ekrani) eksik: ${missingHooks.length} hikaye`);
  p('');
  const byLang = {};
  for (const s of missingHooks) for (const l of s.gap) byLang[l] = (byLang[l] ?? 0) + 1;
  p(`Dil kirilimi: ${Object.entries(byLang).map(([l, n]) => `${l}=${n}`).join(' · ')}`);
  p('');
}

if (durationMismatch.length) {
  p(`## Sure uyumsuzlugu: ${durationMismatch.length} hikaye`);
  p('');
  p('`current_read_minutes` != `possible_read_minutes`. Hedef uzunlukta yeniden uretim bekliyor.');
  p('');
  p('| story_id | Mevcut | Olasi | Baslik (tr) |');
  p('|---:|---:|---:|---|');
  for (const s of durationMismatch.slice(0, limit)) {
    p(`| ${s.id} | ${s.current_read_minutes} dk | ${s.possible_read_minutes} dk | ${(s.title_tr || '—').slice(0, 50)} |`);
  }
  if (durationMismatch.length > limit) p(`| … | | | *+${durationMismatch.length - limit} kayit daha* |`);
  p('');
}

if (pending.length) {
  p(`## Kuyruk — en yuksek puanli ${Math.min(limit, pending.length)} baslik`);
  p('');
  p('| Puan | Sure | Kitap | Baslik |');
  p('|---:|---:|---|---|');
  for (const q of pending.slice(0, limit)) {
    p(`| ${q.score} | ${q.minutes} dk | ${q.book} | ${q.title} |`);
  }
  p('');
}

if (booksMissingLangs.length) {
  p(`## Kitap adi cevirisi eksik (${booksMissingLangs.length})`);
  p('');
  for (const b of booksMissingLangs.slice(0, limit)) {
    p(`- \`list_no:${b.list_no}\` ${b.title_tr ?? '(tr adi yok)'} — ${b.lang_count}/4 dil`);
  }
  p('');
}

if (thinBooks.length) {
  p(`## 10 hikayeye ulasmamis kitap: ${thinBooks.length}`);
  p('');
  const dist = {};
  for (const b of thinBooks) dist[b.story_count] = (dist[b.story_count] ?? 0) + 1;
  p(`Dagilim: ${Object.entries(dist).sort((a, b) => a[0] - b[0]).map(([n, c]) => `${n} hikaye=${c} kitap`).join(' · ')}`);
  p('');
  p('| list_no | Kitap | Kategori | Hikaye |');
  p('|---:|---|---|---:|');
  for (const b of thinBooks.slice(0, limit)) {
    p(`| ${b.list_no} | ${b.title_tr ?? '—'} | ${bookCat(b)} | ${b.story_count} |`);
  }
  if (thinBooks.length > limit) p(`| … | *+${thinBooks.length - limit} kitap daha* | | |`);
  p('');
}

  const out = L.join('\n');
  const path = writeReport('gap-report.md', out);
  process.stdout.write(`${out}\n`);
  process.stderr.write(`\n[gap-report] yazildi: ${path}\n`);
}

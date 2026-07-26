#!/usr/bin/env node
/**
 * sync-inventory.mjs — KITAP_HIKAYE_ENVANTERI.md'yi DB ile senkronlar.
 *
 * Kural: DB, "NE VAR" sorusunun tek dogruluk kaynagidir.
 *        Envanter md, "NE URETILECEK" kuyrugunun tek dogruluk kaynagidir.
 * Bu script ikisini birlestirir; kuyruk satirlarini asla silmez.
 *
 * Ilk calistirmada envanter yoksa MyStories/HIKAYE_BASLIKLARI.md'den
 * bekleyen basliklari devralir (bootstrap).
 *
 * Kullanim:
 *   node scripts/story-pipeline/sync-inventory.mjs            # yaz
 *   node scripts/story-pipeline/sync-inventory.mjs --dry-run  # sadece rapor
 */
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import {
  ROOT, PATHS, LANGS, openDb, readBooks, readStories, readCategories, wordRange,
} from './lib/store.mjs';

const dryRun = process.argv.includes('--dry-run');
const LEGACY = resolve(ROOT, '../MyStories/HIKAYE_BASLIKLARI.md');

/* ------------------------------------------------------------------ */
/* Yardimcilar                                                         */
/* ------------------------------------------------------------------ */

const norm = (s = '') =>
  s
    .toLocaleLowerCase('tr')
    .replace(/[’'`´]/g, "'")
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();

const STATUS = {
  registered: "DB'DE KAYITLI",
  pending: 'URETILECEK',
  review: 'INCELEMEDE',
};

/** Bekleyen kuyruk satirlarini herhangi bir envanter/legacy md'den cikarir. */
function parseQueue(text) {
  const bookRe = /^##\s*(?:\d+\.\s*)?(?<title>.+?)\s*$/u;
  /* Kunye alanlari: sistemde OLMAYAN kitaplar icin bu bilgiler md'de yasar.
     Yakalanmazsa her sync'te silinir — book-scout'un arastirmasi bosa gider. */
  const authorRe = /^\*\*Yazar:\*\*\s*(?<v>.+?)\s*$/u;
  const catRe = /^\*\*Kategori:\*\*\s*(?<v>.+?)\s*$/u;
  const yearRe = /^\*\*(?:Yil|Yıl):\*\*\s*(?<v>.+?)\s*$/u;
  const pendingRe =
    /^\s*\d+\.\s*\[ \]\s*\*\*(?<status>[^*]+)\*\*\s*—\s*(?<rest>.+)$/u;
  // Iki bicimi birden kabul et:
  //   yeni  : **Sure:** 3 dk        · **Puan:** 84/100
  //   legacy: **Mevcut süre: 3 dk** · **Sohbet puanı: 84/100**   (sayi bold ICINDE)
  const minRe = /\*\*(?:Sure|Süre|Mevcut süre|Olası süre):(?:\*\*)?\s*(?<min>\d)\s*dk/u;
  const possibleRe = /\*\*Olası süre:(?:\*\*)?\s*(?<min>\d)\s*dk/u;
  const scoreRe = /\*\*(?:Puan|Sohbet puanı):(?:\*\*)?\s*(?<score>\d+)/u;
  const storyIdRe = /`story_id:(?<id>\d+)`/u;

  const groups = new Map(); // normalized book title -> { title, author, items[] }
  let cur = null;

  for (const line of text.split('\n')) {
    if (line.startsWith('# ')) continue;
    const b = line.match(bookRe);
    if (b && line.startsWith('## ')) {
      const title = b.groups.title.replace(/\s*—.*$/, '').trim();
      const key = norm(title);
      if (!groups.has(key)) groups.set(key, { title, author: '', category: '', year: '', items: [] });
      cur = groups.get(key);
      continue;
    }
    if (cur) {
      const a = line.match(authorRe);
      if (a) { cur.author = a.groups.v.trim(); continue; }
      const ca = line.match(catRe);
      if (ca) { const v = ca.groups.v.trim(); if (v !== '—') cur.category = v; continue; }
      const y = line.match(yearRe);
      if (y) { const v = y.groups.v.trim(); if (v !== '—') cur.year = v; continue; }
    }
    const q = line.match(pendingRe);
    if (q && cur) {
      const status = q.groups.status.trim();
      // Zaten DB'de kayitli isaretlenmis satirlari kuyruk sayma
      if (/KAYITLI/i.test(status)) continue;
      const rest = q.groups.rest;
      // Yeni hikayede hedef sure "Olası süre"dir; yoksa mevcut sureye dus.
      const minutes = Number(
        rest.match(possibleRe)?.groups.min ?? rest.match(minRe)?.groups.min ?? 3
      );
      const score = Number(rest.match(scoreRe)?.groups.score ?? 0);
      const storyId = rest.match(storyIdRe)?.groups.id ?? null;
      // Baslik = ilk "—" ya kadar, meta alanlarindan once
      const title = rest.split(/\s*—\s*\*\*/)[0].replace(/`story_id:\d+`/, '').replace(/\s*—\s*$/, '').trim();
      if (!title) continue;
      cur.items.push({
        status: /INCELEMEDE|İNCELEMEDE/i.test(status) ? STATUS.review : STATUS.pending,
        title,
        minutes: [1, 3, 5].includes(minutes) ? minutes : 3,
        score,
        storyId,
      });
    }
  }
  return groups;
}

/* ------------------------------------------------------------------ */
/* Veri toplama                                                        */
/* ------------------------------------------------------------------ */

const db = await openDb();
const books = readBooks(db);
const stories = readStories(db);
const categories = readCategories(db);
const bookTitleIndex = new Map(); // norm(title, herhangi bir dil) -> list_no
for (const r of stories) void r;
for (const b of books) {
  const titles = db.exec(
    `SELECT title FROM book_translations WHERE book_id=${b.id} AND title IS NOT NULL`
  )[0];
  for (const [t] of titles?.values ?? []) {
    if (t) bookTitleIndex.set(norm(t), b.list_no);
  }
  if (b.author) bookTitleIndex.set(`${norm(b.title_tr ?? '')}|${norm(b.author)}`, b.list_no);
}
db.close();

const storiesByBook = new Map();
for (const s of stories) {
  if (!storiesByBook.has(s.book_no)) storiesByBook.set(s.book_no, []);
  storiesByBook.get(s.book_no).push(s);
}

/* Kuyruk kaynagi: mevcut envanter, yoksa legacy */
let source = 'yok';
let queueGroups = new Map();
if (existsSync(PATHS.inventory)) {
  source = 'KITAP_HIKAYE_ENVANTERI.md';
  queueGroups = parseQueue(readFileSync(PATHS.inventory, 'utf8'));
} else if (existsSync(LEGACY)) {
  source = '../MyStories/HIKAYE_BASLIKLARI.md (bootstrap)';
  queueGroups = parseQueue(readFileSync(LEGACY, 'utf8'));
}

/* Kuyruk gruplarini DB kitaplarina bagla */
const queueByListNo = new Map();
const orphanGroups = [];
for (const [key, g] of queueGroups) {
  const listNo = bookTitleIndex.get(key) ?? bookTitleIndex.get(`${key}|${norm(g.author)}`);
  if (listNo != null) {
    if (!queueByListNo.has(listNo)) queueByListNo.set(listNo, []);
    queueByListNo.get(listNo).push(...g.items);
  } else if (g.items.length) {
    orphanGroups.push(g);
  }
}

/* Kayitli hikaye basliklarini kuyruktan dus (ayni baslik iki kez cikmasin) */
for (const [listNo, items] of queueByListNo) {
  const have = new Set((storiesByBook.get(listNo) ?? []).map((s) => norm(s.title_tr ?? '')));
  queueByListNo.set(
    listNo,
    items.filter((i) => !have.has(norm(i.title)) && !(i.storyId && stories.some((s) => String(s.id) === i.storyId)))
  );
}

/* ------------------------------------------------------------------ */
/* Markdown uret                                                       */
/* ------------------------------------------------------------------ */

const L = [];
const p = (s = '') => L.push(s);
/** Ekranda gorunen kategori: book_translations once, sonra id cozumu. */
const bookCat = (b) => b.category_tr || categories[b.category_id]?.tr || `kategori#${b.category_id}`;
const langList = (csv) => (csv ? csv.split(',').join(',') : 'yok');
const gap = (csv) => LANGS.filter((l) => !(csv ?? '').split(',').includes(l));

/* Sayimlar TUM kuyruk uzerinden yapilir: kayitli kitaplar + sistemde olmayanlar.
   Orphan'lari toplama katmamak veya statuye gore ayirmamak yanlis rapor uretir
   (yasandi: baslikta "Incelemede: 0" yazarken dosyada INCELEMEDE satiri vardi). */
const linkedItems = [...queueByListNo.values()].flat();
const orphanItems = orphanGroups.flatMap((g) => g.items);
const allItems = [...linkedItems, ...orphanItems];

const totalPending = allItems.filter((i) => i.status === STATUS.pending).length;
const totalReview = allItems.filter((i) => i.status === STATUS.review).length;
const linkedPending = linkedItems.filter((i) => i.status === STATUS.pending).length;
const orphanPending = orphanItems.filter((i) => i.status === STATUS.pending).length;
const orphanCount = orphanItems.length;

p('# Kitap ve Hikâye Envanteri');
p('');
p('> **Bu dosya pipeline\'in tek kuyrugudur.** `[x]` satirlar DB\'den otomatik uretilir,');
p('> elle degistirilmez. `[ ]` satirlar uretim kuyrugudur; elle eklenip cikarilabilir.');
p('> Yeniden uretmek icin: `node scripts/story-pipeline/sync-inventory.mjs`');
p('');
p(`- Senkron: **${new Date().toISOString().slice(0, 16).replace('T', ' ')}**`);
p(`- Kuyruk kaynagi: ${source}`);
p(`- DB'de kitap: **${books.length}**`);
p(`- DB'de hikaye: **${stories.length}**`);
p(`- 4 dili tam hikaye: **${stories.filter((s) => gap(s.langs).length === 0).length}**`);
p(`- Sohbet varyanti tam hikaye: **${stories.filter((s) => gap(s.variant_langs).length === 0).length}**`);
p(`- Uretim kuyrugu: **${totalPending}** (${linkedPending} kayitli kitapta + ${orphanPending} sistemde olmayan kitapta)`);
p(`- Incelemede: **${totalReview}**`);
p(`- Sisteme eklenmemis kitap: **${orphanGroups.length}**`);
p('');
p('## Durum etiketleri');
p('');
p("- `[x] **DB'DE KAYITLI**` — Hikaye DB'de var. Satir DB'den uretilir.");
p('- `[ ] **URETILECEK**` — Kuyrukta. Kitapla iliskisi, olgulari ve kaynaklari dogrulanmali.');
p('- `[ ] **INCELEMEDE**` — Staging\'de uretildi, insan onayi bekliyor.');
p('- `**Diller:**` ana metin cevirisi olan diller · `**Varyant:**` sohbet varyanti olan diller');
p('');
p('---');
p('');
p('# DB\'de Kayitli Kitaplar');
p('');

for (const b of books) {
  const own = (storiesByBook.get(b.list_no) ?? []).slice().sort((x, y) => x.id - y.id);
  const q = queueByListNo.get(b.list_no) ?? [];
  p(`## ${b.list_no}. ${b.title_tr ?? '(baslik yok)'}`);
  p('');
  p(`**Yazar:** ${b.author ?? '—'}  `);
  p(`**Kategori:** ${bookCat(b)}  `);
  p(`**Yil:** ${b.publish_year ?? '—'}  `);
  p(`**Durum:** DB'DE KAYITLI · \`list_no:${b.list_no}\` · ${own.length}/10 hikaye · ${b.lang_count}/4 dil`);
  p('');
  let n = 0;
  for (const s of own) {
    n += 1;
    const r = wordRange(s.possible_read_minutes || 1);
    const flags = [];
    if (gap(s.langs).length) flags.push(`eksik dil: ${gap(s.langs).join('/')}`);
    if (gap(s.variant_langs).length) flags.push(`eksik varyant: ${gap(s.variant_langs).join('/')}`);
    if (s.current_read_minutes !== s.possible_read_minutes) flags.push(`sure uyumsuz: ${s.current_read_minutes}→${s.possible_read_minutes}`);
    p(
      `${n}. [x] **${STATUS.registered}** — ${s.title_tr ?? '(baslik yok)'} — ` +
        `**Sure:** ${s.current_read_minutes} dk · **Kelime:** ${r.target} ±${r.tolerance} — ` +
        `\`story_id:${s.id}\` · \`v:${s.version}\` — ` +
        `**Diller:** ${langList(s.langs)} — **Varyant:** ${langList(s.variant_langs)}` +
        (flags.length ? ` — ⚠ ${flags.join(' · ')}` : '')
    );
  }
  for (const i of q) {
    n += 1;
    const r = wordRange(i.minutes);
    p(
      `${n}. [ ] **${i.status}** — ${i.title} — ` +
        `**Sure:** ${i.minutes} dk · **Kelime:** ${r.target} ±${r.tolerance} — ` +
        `**Puan:** ${i.score}/100` +
        (i.storyId ? ` — \`story_id:${i.storyId}\`` : '')
    );
  }
  if (!own.length && !q.length) p('*Hikaye yok.*');
  p('');
}

if (orphanGroups.length) {
  p('---');
  p('');
  p('# Sisteme Eklenmemis Kitaplar');
  p('');
  p('Bu kitaplar kuyrukta baslik tasiyor ama `books` tablosunda yok.');
  p('`ingest-batch.mjs` yeni kitabi otomatik acar; `list_no` atanmamis alan bosluk isaretidir.');
  p('');
  for (const g of orphanGroups) {
    p(`## ${g.title}`);
    p('');
    p(`**Yazar:** ${g.author || '—'}  `);
    p(`**Kategori:** ${g.category || '—'}  `);
    p(`**Yil:** ${g.year || '—'}  `);
    p('**Durum:** SISTEMDE YOK · `list_no:` — · 0/10 hikaye · 0/4 dil');
    p('');
    let n = 0;
    for (const i of g.items) {
      n += 1;
      const r = wordRange(i.minutes);
      p(
        `${n}. [ ] **${i.status}** — ${i.title} — ` +
          `**Sure:** ${i.minutes} dk · **Kelime:** ${r.target} ±${r.tolerance} — ` +
          `**Puan:** ${i.score}/100`
      );
    }
    p('');
  }
}

const out = L.join('\n');

if (dryRun) {
  console.log(`[sync-inventory] DRY RUN — yazilmadi`);
  console.log(`  kaynak            : ${source}`);
  console.log(`  kitap             : ${books.length}`);
  console.log(`  hikaye            : ${stories.length}`);
  console.log(`  kuyruk (uretilecek): ${totalPending} (${linkedPending} kayitli + ${orphanPending} bagsiz)`);
  console.log(`  kuyruk (incelemede): ${totalReview}`);
  console.log(`  bagsiz kitap      : ${orphanGroups.length} (${orphanCount} baslik)`);
  console.log(`  cikti boyutu      : ${out.length} karakter`);
  process.exit(0);
}

writeFileSync(PATHS.inventory, out, 'utf8');
console.log(`[sync-inventory] yazildi: ${PATHS.inventory}`);
console.log(`  ${books.length} kitap · ${stories.length} hikaye · ${totalPending} kuyrukta · ${totalReview} incelemede`);
if (orphanGroups.length) {
  console.log(`  ⚠ ${orphanGroups.length} kitap sistemde yok (${orphanCount} baslik) — "Sisteme Eklenmemis Kitaplar" bolumune bak`);
}

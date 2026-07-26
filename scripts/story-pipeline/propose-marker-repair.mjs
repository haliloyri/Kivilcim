#!/usr/bin/env node
/**
 * propose-marker-repair.mjs — Isaret hatalari icin marker_repair batch'i onerir.
 *
 * Onarimi ELLE YAZMAK YERINE DB metninden hesaplar. Boylece
 * stripMarkers(yeni) === stripMarkers(eski) invaryanti yapisal olarak saglanir:
 * script yalnizca isaret karakteri ekler, siler veya tasir; harfe dokunmaz.
 *
 * Cozemedigi kaliplari batch'e KOYMAZ, "elle inceleme" listesine yazar.
 *
 * Kullanim:
 *   node scripts/story-pipeline/propose-marker-repair.mjs
 *   node scripts/story-pipeline/propose-marker-repair.mjs --out staging/batch-A1-002-markers.json
 */
import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { ROOT, LANGS, openDb, rows, stripMarkers } from './lib/store.mjs';

const argv = process.argv.slice(2);
const outPath = resolve(ROOT, argv[argv.indexOf('--out') + 1] ?? 'staging/batch-A1-002-markers.json');

const MARKS = ['##', '$$', '&&'];

function blocks(text, m) {
  const esc = m.replace(/[$]/g, '\\$');
  const at = [...text.matchAll(new RegExp(esc, 'g'))].map((x) => x.index);
  const pairs = [];
  for (let i = 0; i + 1 < at.length; i += 2) {
    pairs.push({ open: at[i], close: at[i + 1], content: text.slice(at[i] + m.length, at[i + 1]) });
  }
  return { pairs, at, count: at.length, dangling: at.length % 2 ? at[at.length - 1] : null };
}

/** pos'u iceren paragrafin [bas, son] sinirlari */
function paragraph(text, pos) {
  const before = text.slice(0, pos);
  const sepBefore = Math.max(before.lastIndexOf('\n\n'), before.lastIndexOf('\r\n\r\n'));
  let start = sepBefore === -1 ? 0 : sepBefore;
  while (start < text.length && /[\r\n]/.test(text[start])) start += 1;
  const afterIdx = text.slice(pos).search(/\r?\n\r?\n/);
  let end = afterIdx === -1 ? text.length : pos + afterIdx;
  while (end > start && /\s/.test(text[end - 1])) end -= 1;
  return [start, end];
}

const db = await openDb();
const all = rows(db, 'SELECT story_id, lang_code, content FROM story_translations WHERE content IS NOT NULL AND content <> \'\'');
const titles = Object.fromEntries(
  rows(db, `SELECT s.id, st.title FROM stories s
              JOIN story_translations st ON st.story_id = s.id AND st.lang_code = 'tr'`)
    .map((r) => [r.id, r.title])
);
db.close();

const repairs = new Map(); // story_id -> { lang: {content, notes[]} }
const manual = [];
const stats = { unclosed_open: 0, unclosed_close: 0, wrong_closer: 0, empty_block: 0, mid_sentence: 0 };

for (const row of all) {
  const orig = row.content;
  let text = orig;
  const notes = [];

  /* ---- 1. `$$X&&` : $$ acilmis, && ile kapatilmis ---------------- */
  /* Iceriği soru ise dogru tur &&; degilse $$ ile kapat. */
  {
    const d = blocks(text, '$$');
    const e = blocks(text, '&&');
    if (d.count === 1 && e.count === 1 && d.at[0] < e.at[0]) {
      const body = text.slice(d.at[0] + 2, e.at[0]).trim();
      if (/\?\s*$/.test(body)) {
        text = `${text.slice(0, d.at[0])}&&${text.slice(d.at[0] + 2)}`;
        notes.push('$$ ile acilip && ile kapatilan blok soru icerdigi icin && olarak duzeltildi; hikayede artik $$ ders blogu YOK (ayri icerik gorevi)');
      } else {
        text = `${text.slice(0, e.at[0])}$$${text.slice(e.at[0] + 2)}`;
        notes.push('$$ blogu && ile kapatilmisti, $$ ile kapatildi');
      }
      stats.wrong_closer += 1;
    }
  }

  /* ---- 2. `&&&&` : hem yanlis kapatici hem bos blok -------------- */
  if (text.includes('&&&&')) {
    const d = blocks(text, '$$');
    if (d.count === 1 && d.at[0] < text.indexOf('&&&&')) {
      /* DIKKAT: replace() ikinci argumaninda "$$" REPLACEMENT ESCAPE'idir ve
         literal tek "$" uretir. Fonksiyon replacer kullan; string kullanma. */
      text = text.replace('&&&&', () => '$$');
      notes.push('$$ blogu &&&& ile kapatilmisti; &&&& -> $$ (kapanis duzeldi, bos && blogu kalkti)');
      stats.empty_block += 1;
    }
  }

  /* ---- 3. Kapanmamis blok --------------------------------------- */
  for (const m of MARKS) {
    const b = blocks(text, m);
    if (b.dangling === null) continue;
    const pos = b.dangling;
    const [pStart, pEnd] = paragraph(text, pos);
    const isClosing = pos >= pEnd - m.length; // paragraf sonundaysa kapanistir, acilis eksik
    if (isClosing) {
      text = `${text.slice(0, pStart)}${m}${text.slice(pStart)}`;
      notes.push(`${m} kapanisi vardi, acilisi yoktu; paragraf basina ${m} eklendi`);
      stats.unclosed_open += 1;
    } else if (pos <= pStart + m.length) {
      text = `${text.slice(0, pEnd)}${m}${text.slice(pEnd)}`;
      notes.push(`${m} acilisi vardi, kapanisi yoktu; paragraf sonuna ${m} eklendi`);
      stats.unclosed_close += 1;
    } else {
      manual.push({ story_id: row.story_id, lang: row.lang_code, why: `${m} tek sayida ve paragraf ici konumu belirsiz` });
    }
  }

  /* ---- 4. Acilis isareti cumle ortasinda ------------------------ */
  for (const m of MARKS) {
    const b = blocks(text, m);
    for (const p of b.pairs) {
      const pre = text.slice(Math.max(0, p.open - 40), p.open);
      if (!/[a-zçğıöşü,][^\S\n]+$/u.test(pre)) continue;
      const [pStart] = paragraph(text, p.open);
      /* isareti kaldir, paragraf basina tasi */
      const without = text.slice(0, p.open) + text.slice(p.open + m.length);
      text = `${without.slice(0, pStart)}${m}${without.slice(pStart)}`;
      notes.push(`${m} acilisi cumle ortasindaydi, paragraf basina tasindi`);
      stats.mid_sentence += 1;
      break; // konumlar kaydi, sonraki turda yeniden bak
    }
  }

  if (text === orig) continue;

  /* ---- INVARYANT: harfe dokunulmadi mi -------------------------- */
  if (stripMarkers(text) !== stripMarkers(orig)) {
    manual.push({ story_id: row.story_id, lang: row.lang_code, why: 'INVARYANT IHLALI — onerilen onarim metni degistiriyor, batch\'e alinmadi' });
    continue;
  }
  /* ---- Onarim gercekten dengeledi mi ---------------------------- */
  const stillBroken = MARKS.filter((m) => blocks(text, m).dangling !== null);
  if (stillBroken.length) {
    manual.push({ story_id: row.story_id, lang: row.lang_code, why: `onarim sonrasi hala dengesiz: ${stillBroken.join(', ')}` });
    continue;
  }

  if (!repairs.has(row.story_id)) repairs.set(row.story_id, {});
  repairs.get(row.story_id)[row.lang_code] = { content: text, notes };
}

/* ------------------------------------------------------------------ */
/* Batch                                                              */
/* ------------------------------------------------------------------ */

const items = [...repairs.entries()]
  .sort((a, b) => a[0] - b[0])
  .map(([sid, langs]) => ({
    story: {
      story_id: sid,
      queue_title: titles[sid] ?? null,
      repair: [...new Set(Object.values(langs).flatMap((v) => v.notes))].join(' · '),
    },
    lang: Object.fromEntries(
      LANGS.filter((l) => langs[l]).map((l) => [l, { content: langs[l].content }])
    ),
  }));

const batch = {
  batch_id: 'A1-002-markers',
  kind: 'marker_repair',
  version: 'A1',
  created: new Date().toISOString().slice(0, 10),
  notes:
    'Agent 1 · isaret onarimi. Onarimlar DB metninden hesaplandi (propose-marker-repair.mjs); ' +
    'script yalnizca isaret karakteri ekler/siler/tasir, harfe dokunmaz. ' +
    'validate-batch.mjs stripMarkers(yeni)==stripMarkers(eski) invaryantini ayrica dogrular.',
  items,
};

writeFileSync(outPath, `${JSON.stringify(batch, null, 2)}\n`, 'utf8');

console.log(`[propose] ${items.length} hikaye · ${items.reduce((n, i) => n + Object.keys(i.lang).length, 0)} dil kaydi`);
console.log(`  yazildi: ${outPath}`);
console.log('\n  onarim turleri:');
for (const [k, v] of Object.entries(stats)) if (v) console.log(`    ${k}: ${v}`);
console.log('\n  hikaye basina:');
for (const it of items) {
  console.log(`    ${it.story.story_id} [${Object.keys(it.lang).join(',')}] ${titles[it.story.story_id]?.slice(0, 38) ?? ''}`);
  console.log(`      ${it.story.repair}`);
}
if (manual.length) {
  console.log(`\n  ⚠ ELLE INCELEME (${manual.length}) — batch'e alinmadi:`);
  for (const m of manual) console.log(`    ${m.story_id} [${m.lang}] ${m.why}`);
}

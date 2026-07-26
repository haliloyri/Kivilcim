#!/usr/bin/env node
/**
 * ingest-batch.mjs — Onaylanmis staging batch'ini kivilcim.db'ye yazar.
 *
 * GUVENLIK KAPILARI
 *  1. validate-batch.mjs otomatik calisir; hata varsa yazma yapilmaz.
 *  2. --confirm bayragi olmadan calismaz (varsayilan: dry-run).
 *  3. Yazmadan once assets/kivilcim.db.bak_<zaman> alinir.
 *
 * Kullanim:
 *   node scripts/story-pipeline/ingest-batch.mjs staging/batch-018.json            # dry-run
 *   node scripts/story-pipeline/ingest-batch.mjs staging/batch-018.json --confirm   # yaz
 */
import { execFileSync } from 'child_process';
import { existsSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { ROOT, LANGS, PATHS, openDb, saveDb, readJson, rows, one } from './lib/store.mjs';

const argv = process.argv.slice(2);
const file = argv.find((a) => !a.startsWith('--'));
const confirm = argv.includes('--confirm');

if (!file) {
  console.error('Kullanim: node scripts/story-pipeline/ingest-batch.mjs <staging/batch-NNN.json> [--confirm]');
  process.exit(2);
}
const path = resolve(ROOT, file);
if (!existsSync(path)) {
  console.error(`Dosya yok: ${path}`);
  process.exit(2);
}

/* --- Kapi 0: tekrar uygulama yasak ----------------------------------- */
/* validate-batch.mjs ingest edilmis batch'i "ZATEN INGEST EDILDI" deyip
   exit 0 dondurur. O yuzden ingest'in KENDI kapisi olmali; yoksa
   --confirm ikinci kez calisir ve marker_repair gibi turlerde sonraki
   batch'lerin isini geri alir. */
{
  const pre = readJson(path);
  if (pre.ingested_at && !argv.includes('--force')) {
    console.error(`[ingest] ABORT — bu batch zaten ingest edilmis: ${pre.ingested_at.slice(0, 16).replace('T', ' ')}`);
    console.error(`  Yazilan story_id'ler: ${(pre.ingested_story_ids ?? []).join(', ') || '—'}`);
    console.error('  Tekrar uygulamak sonraki batch\'lerin degisikliklerini geri alabilir.');
    console.error('  Gercekten gerekiyorsa: --force');
    process.exit(1);
  }
}

/* --- Kapi 1: dogrulama ---------------------------------------------- */

console.log('[ingest] dogrulama calisiyor…');
try {
  execFileSync('node', [resolve(ROOT, 'scripts/story-pipeline/validate-batch.mjs'), file, '--json'], {
    cwd: ROOT,
    stdio: ['ignore', 'pipe', 'inherit'],
  });
} catch {
  console.error('\n[ingest] ABORT — batch dogrulamadan gecmedi.');
  console.error('  Ayrinti: staging/reports/validate-*.md');
  process.exit(1);
}
console.log('[ingest] dogrulama gecti.');

const batch = readJson(path);
const db = await openDb({ readonly: !confirm });

/* --- Sema guvencesi ------------------------------------------------- */

const cols = db.exec('PRAGMA table_info(stories)')[0].values.map((r) => r[1]);
const ensure = (col, ddl) => {
  if (!cols.includes(col)) db.run(`ALTER TABLE stories ADD COLUMN ${ddl}`);
};
ensure('version', 'version INTEGER DEFAULT 1');
ensure('current_read_minutes', 'current_read_minutes INTEGER DEFAULT 1');
ensure('possible_read_minutes', 'possible_read_minutes INTEGER DEFAULT 1');
ensure('target_word_count', 'target_word_count INTEGER DEFAULT 160');
ensure('target_word_tolerance', 'target_word_tolerance INTEGER DEFAULT 40');
db.run(`CREATE TABLE IF NOT EXISTS story_conversation_variants (
  story_id INTEGER NOT NULL, lang_code TEXT NOT NULL,
  punchline TEXT, thirty_sec TEXT, question TEXT, key_contrast TEXT,
  PRIMARY KEY (story_id, lang_code), FOREIGN KEY (story_id) REFERENCES stories(id))`);
db.run(`CREATE INDEX IF NOT EXISTS idx_story_conversation_variants_lang
        ON story_conversation_variants(lang_code)`);

/* --- Kategori isim haritasi ---------------------------------------- */

const catNames = {};
for (const r of rows(db, 'SELECT id, name_tr, name_en, name_es, name_de FROM main_categories')) {
  catNames[r.id] = { tr: r.name_tr, en: r.name_en, es: r.name_es, de: r.name_de };
}

/* --- Yazma ---------------------------------------------------------- */

const log = [];
const nextListNo = () => (one(db, 'SELECT MAX(list_no) AS m FROM books')?.m ?? 0) + 1;

/* --- marker_repair: yalnizca content, baska hicbir sey ------------- */

if (batch.kind === 'hook_only') {
  /* Yalnizca story_translations.hook. story_conversation_variants'a DOKUNULMAZ. */
  for (const item of batch.items) {
    const sid = item.story.story_id;
    const done = [];
    for (const [l, d] of Object.entries(item.lang)) {
      db.run('UPDATE story_translations SET hook = ? WHERE story_id = ? AND lang_code = ?',
        [d.hook, sid, l]);
      done.push(l);
    }
    log.push({ story: sid, langs: done, action: [`hook yazildi (${item.story.reason ?? '—'})`] });
  }
} else if (batch.kind === 'marker_repair' || batch.kind === 'content_fix') {
  const what = batch.kind === 'marker_repair' ? 'isaret onarimi' : 'icerik duzeltmesi';
  for (const item of batch.items) {
    const sid = item.story.story_id;
    const done = [];
    for (const [l, d] of Object.entries(item.lang)) {
      db.run('UPDATE story_translations SET content = ? WHERE story_id = ? AND lang_code = ?',
        [d.content, sid, l]);
      done.push(l);
    }
    log.push({
      story: sid,
      langs: done,
      action: [`${what} (${item.story.repair ?? item.story.reason ?? '—'})`],
    });
  }
} else

for (const item of batch.items) {
  const entry = { book: null, story: null, langs: [], action: [] };

  /* 1. Kitap */
  let listNo = item.book?.list_no ?? null;
  let bookId = null;

  if (batch.kind !== 'variants_only') {
    if (item.book?.new && listNo == null) listNo = nextListNo();
    const found = one(db, 'SELECT id FROM books WHERE list_no = ?', [listNo]);
    if (found) {
      bookId = found.id;
      entry.action.push(`kitap mevcut (list_no:${listNo})`);
    } else {
      db.run(
        'INSERT INTO books (list_no, author, publish_year, category_id, sub_category_id) VALUES (?, ?, ?, ?, ?)',
        [listNo, item.book.author, item.book.publish_year ?? null, item.book.category_id, item.book.sub_category_id ?? null]
      );
      bookId = one(db, 'SELECT last_insert_rowid() AS id').id;
      entry.action.push(`KITAP EKLENDI (list_no:${listNo})`);
    }
    entry.book = `${item.book.titles?.tr ?? item.book.title_tr ?? ''} — list_no:${listNo}`;

    /* Kitap cevirileri — 4 dil */
    for (const l of LANGS) {
      const title = item.book.titles?.[l];
      if (!title) continue;
      const categoryName = item.book.category_names?.[l] ?? catNames[item.book.category_id]?.[l] ?? '';
      const bt = one(db, 'SELECT id FROM book_translations WHERE book_id = ? AND lang_code = ?', [bookId, l]);
      if (bt) db.run('UPDATE book_translations SET title = ?, category_name = ? WHERE id = ?', [title, categoryName, bt.id]);
      else db.run('INSERT INTO book_translations (book_id, lang_code, title, category_name) VALUES (?, ?, ?, ?)', [bookId, l, title, categoryName]);
    }
  }

  /* 2. Hikaye */
  let storyId = item.story?.story_id ?? null;

  if (batch.kind === 'variants_only') {
    entry.action.push(`varyant guncelleme (story_id:${storyId})`);
  } else {
    const s = item.story;
    if (storyId == null) {
      const dup = one(
        db,
        `SELECT s.id FROM stories s JOIN story_translations st ON st.story_id = s.id AND st.lang_code = 'tr'
          WHERE s.book_no = ? AND st.title = ? LIMIT 1`,
        [listNo, item.lang.tr.title]
      );
      storyId = dup?.id ?? null;
    }
    if (storyId == null) {
      db.run(
        `INSERT INTO stories (book_no, version, current_read_minutes, possible_read_minutes, target_word_count, target_word_tolerance)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [listNo, batch.version, s.current_read_minutes, s.possible_read_minutes, s.target_word_count, s.target_word_tolerance]
      );
      storyId = one(db, 'SELECT last_insert_rowid() AS id').id;
      entry.action.push(`HIKAYE EKLENDI (story_id:${storyId}, v:${batch.version})`);
    } else {
      db.run(
        `UPDATE stories SET version = ?, current_read_minutes = ?, possible_read_minutes = ?,
                            target_word_count = ?, target_word_tolerance = ? WHERE id = ?`,
        [batch.version, s.current_read_minutes, s.possible_read_minutes, s.target_word_count, s.target_word_tolerance, storyId]
      );
      entry.action.push(`hikaye guncellendi (story_id:${storyId}, v:${batch.version})`);
    }
  }
  entry.story = storyId;

  /* 3. Ceviriler + varyantlar */
  for (const l of LANGS) {
    const d = item.lang[l];
    if (!d) continue;

    if (batch.kind !== 'variants_only') {
      const description = d.description ?? d.punchline;
      const hook = d.hook ?? d.question;
      const st = one(db, 'SELECT id FROM story_translations WHERE story_id = ? AND lang_code = ?', [storyId, l]);
      if (st) {
        db.run('UPDATE story_translations SET title = ?, description = ?, content = ?, hook = ? WHERE id = ?',
          [d.title, description, d.content, hook, st.id]);
      } else {
        db.run('INSERT INTO story_translations (story_id, lang_code, title, description, content, hook) VALUES (?, ?, ?, ?, ?, ?)',
          [storyId, l, d.title, description, d.content, hook]);
      }
    } else if (d.hook) {
      db.run('UPDATE story_translations SET hook = ? WHERE story_id = ? AND lang_code = ?', [d.hook, storyId, l]);
    }

    /* DIKKAT: INSERT OR REPLACE eksik alanlari NULL yapar. Yalnizca hook
       tasiyan bir kayit icin bu satir calisirsa MEVCUT VARYANTLARI SILER.
       O yuzden varyant alani yoksa upsert'e hic girme. */
    const hasVariantFields = ['punchline', 'thirty_sec', 'question', 'key_contrast']
      .some((f) => d[f] != null && String(d[f]).trim() !== '');
    if (hasVariantFields) {
      db.run(
        `INSERT OR REPLACE INTO story_conversation_variants
           (story_id, lang_code, punchline, thirty_sec, question, key_contrast)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [storyId, l, d.punchline, d.thirty_sec, d.question, d.key_contrast]
      );
    }
    entry.langs.push(l);
  }

  log.push(entry);
}

/* --- Cikti ---------------------------------------------------------- */

console.log('');
for (const e of log) {
  console.log(`  story_id:${e.story ?? '-'} · ${e.langs.join(',')} · ${e.action.join(' · ')}`);
  if (e.book) console.log(`    ${e.book}`);
}
console.log('');

if (!confirm) {
  db.close();
  console.log(`[ingest] DRY RUN — DB'ye yazilmadi. ${log.length} kayit hazir.`);
  console.log('  Yazmak icin: --confirm ekle');
  process.exit(0);
}

saveDb(db, { backup: true });
db.close();
console.log(`[ingest] ${log.length} kayit yazildi -> assets/kivilcim.db (yedek alindi)`);

/* Batch dosyasini isaretle */
const stamp = new Date().toISOString();
writeFileSync(path, JSON.stringify({ ...batch, ingested_at: stamp, ingested_story_ids: log.map((e) => e.story) }, null, 2), 'utf8');

console.log('[ingest] siradaki adim: node scripts/story-pipeline/sync-inventory.mjs');

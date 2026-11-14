#!/usr/bin/env node
// Create the DB rows a NEW story needs before publish-local can fill in its text:
// book (+ 4 translations) when the book is new, the story row, and 4 empty
// story_translations rows. Prints the new story id. Text itself is written
// afterwards by publish-local.mjs.
//
//   node scripts/p1/add-story.mjs spec.json [--db path] [--dry-run]
//
// spec.json: { book: { list_no?, author, year, category_id, title: {tr,en,es,de},
//   category_name: {tr,en,es,de} },
//   story: { version?, title: {...}, description: {...}, one_minute_summary_tr?,
//            quality: 'strong'|'weak' (REQUIRED), sensitive?: 0|1, flag_note? } }
// quality 'weak' = thin/unverified/padded story; sensitive 1 = suicide, deaths of children,
// abuse, atrocity etc. Both are stored on the stories row; flag_note holds the reason.
// If book.list_no is given and exists, that book is reused; if omitted, a new
// book is created with list_no = max(list_no) + 1.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const argv = process.argv.slice(2);
const dbIdx = argv.indexOf('--db');
const dbPath = dbIdx >= 0 ? argv[dbIdx + 1] : path.join(ROOT, 'assets/albor.db');
const specFile = argv.find((a, i) => !a.startsWith('--') && i !== (dbIdx >= 0 ? dbIdx + 1 : -1));
const dryRun = argv.includes('--dry-run');
if (!specFile) { console.error('usage: add-story.mjs spec.json [--db path] [--dry-run]'); process.exit(2); }
const spec = JSON.parse(fs.readFileSync(specFile, 'utf8'));
const LANGS = ['tr', 'en', 'es', 'de'];
for (const l of LANGS) {
  if (!spec.story.title?.[l] || !spec.story.description?.[l]) { console.error(`story title/description missing for ${l}`); process.exit(2); }
}

if (!['strong', 'weak'].includes(spec.story.quality)) { console.error("story.quality must be 'strong' or 'weak'"); process.exit(2); }
if (spec.story.sensitive !== undefined && ![0, 1].includes(spec.story.sensitive)) { console.error('story.sensitive must be 0 or 1'); process.exit(2); }

const db = new DatabaseSync(dbPath);
{
  const have = db.prepare('PRAGMA table_info(stories)').all().map((c) => c.name);
  for (const [n, d] of [['sensitive', 'INTEGER DEFAULT 0'], ['quality', 'TEXT'], ['flag_note', 'TEXT']]) {
    if (!have.includes(n)) db.exec(`ALTER TABLE stories ADD COLUMN ${n} ${d}`);
  }
}
db.exec('BEGIN');
try {
  let listNo = spec.book.list_no;
  let book = listNo ? db.prepare('SELECT id FROM books WHERE list_no = ?').get(listNo) : null;
  if (!book) {
    if (!listNo) listNo = db.prepare('SELECT MAX(list_no) AS m FROM books').get().m + 1;
    for (const l of LANGS) {
      if (!spec.book.title?.[l] || !spec.book.category_name?.[l]) throw new Error(`book title/category_name missing for ${l}`);
    }
    const r = db.prepare('INSERT INTO books (list_no, author, publish_year, category_id) VALUES (?, ?, ?, ?)')
      .run(listNo, spec.book.author, String(spec.book.year), spec.book.category_id);
    const bookId = Number(r.lastInsertRowid);
    const insBT = db.prepare('INSERT INTO book_translations (book_id, lang_code, title, category_name) VALUES (?, ?, ?, ?)');
    for (const l of LANGS) insBT.run(bookId, l, spec.book.title[l], spec.book.category_name[l]);
    console.log(`new book list_no=${listNo} (books.id ${bookId})`);
  } else console.log(`reusing book list_no=${listNo}`);

  const version = spec.story.version ?? 'SON55';
  const s = db.prepare('INSERT INTO stories (book_no, version, sensitive, quality, flag_note) VALUES (?, ?, ?, ?, ?)')
    .run(listNo, version, spec.story.sensitive ?? 0, spec.story.quality, spec.story.flag_note ?? null);
  const storyId = Number(s.lastInsertRowid);
  const insST = db.prepare('INSERT INTO story_translations (story_id, lang_code, title, description, content, one_minute_summary) VALUES (?, ?, ?, ?, ?, ?)');
  for (const l of LANGS) insST.run(storyId, l, spec.story.title[l], spec.story.description[l], '', l === 'tr' ? (spec.story.one_minute_summary_tr ?? null) : null);
  console.log(`new story id=${storyId} (book_no ${listNo}, version ${version})`);
  if (dryRun) { db.exec('ROLLBACK'); console.log('--dry-run: rolled back'); }
  else db.exec('COMMIT');
} catch (e) {
  db.exec('ROLLBACK'); console.error(`failed, nothing changed: ${e.message}`); process.exit(1);
}
db.close();

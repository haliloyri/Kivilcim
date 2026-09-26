#!/usr/bin/env node
// Builds staging/p1/manifest.json from the bundled SQLite DB: one row per
// story with its book title/author and current TR text, used as the source
// material for the brief-generation batch (02-submit-briefs.mjs).
//
// Usage: node batch/01-build-manifest.mjs [--lang tr]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DB = path.join(ROOT, 'assets/kivilcim.db');
const srcLang = (process.argv.includes('--lang') ? process.argv[process.argv.indexOf('--lang') + 1] : 'tr');

const db = new DatabaseSync(DB);

const rows = db.prepare(`
  SELECT
    s.id AS story_id,
    b.id AS book_id,
    b.author AS author,
    b.publish_year AS publish_year,
    bt.title AS book_title,
    st.title AS story_title,
    st.content AS content
  FROM stories s
  JOIN books b ON b.list_no = s.book_no
  LEFT JOIN book_translations bt ON bt.book_id = b.id AND bt.lang_code = ?
  LEFT JOIN story_translations st ON st.story_id = s.id AND st.lang_code = ?
  ORDER BY s.id
`).all(srcLang, srcLang);

const manifest = rows
  .filter((r) => r.content)
  .map((r) => ({
    story_id: r.story_id,
    book: { title: r.book_title || '', author: r.author || '', year: r.publish_year || '' },
    story_title: r.story_title || '',
    source_lang: srcLang,
    source_content: r.content,
    status: 'pending_brief',
  }));

const outDir = path.join(ROOT, 'staging/p1');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`Wrote ${manifest.length} stories to staging/p1/manifest.json (source lang: ${srcLang}).`);

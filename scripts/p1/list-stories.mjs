#!/usr/bin/env node
// Lists stories from the local DB (assets/albor.db, read-only) as Koleksiyon / Sürüm / Hikâye.
// Usage:
//   node scripts/p1/list-stories.mjs                  per-Sürüm summary
//   node scripts/p1/list-stories.mjs --version SON55  every story of that Sürüm (table)
//   node scripts/p1/list-stories.mjs --version SON55 --ids   story ids only, space-separated
//   node scripts/p1/list-stories.mjs --version SON55 --by-book   one line per book: book_no<TAB>Koleksiyon<TAB>ids
import { openDb, rows } from '../story-pipeline/lib/store.mjs';

const args = process.argv.slice(2);
const vIdx = args.indexOf('--version');
const version = vIdx !== -1 ? args[vIdx + 1] : null;
const idsOnly = args.includes('--ids');
const byBook = args.includes('--by-book');

const db = await openDb();
try {
  if (!version) {
    console.log('| Sürüm | Koleksiyon sayısı | Hikâye sayısı |\n|---|---:|---:|');
    for (const r of rows(db, `SELECT CAST(version AS TEXT) surum, COUNT(DISTINCT book_no) koleksiyon, COUNT(*) hikaye
                               FROM stories GROUP BY 1 ORDER BY 1`)) {
      console.log(`| ${r.surum} | ${r.koleksiyon} | ${r.hikaye} |`);
    }
  } else {
    const list = rows(db, `SELECT COALESCE(bt.title, '?') koleksiyon, CAST(s.version AS TEXT) surum,
                                  COALESCE(st.title, '?') hikaye, s.id, s.book_no
                             FROM stories s
                             LEFT JOIN books b ON b.list_no = s.book_no
                             LEFT JOIN book_translations bt ON bt.book_id = b.id AND bt.lang_code = 'tr'
                             LEFT JOIN story_translations st ON st.story_id = s.id AND st.lang_code = 'tr'
                            WHERE CAST(s.version AS TEXT) = ?
                            ORDER BY koleksiyon, s.id`, [version]);
    if (byBook) {
      const books = new Map();
      for (const r of list) {
        if (!books.has(r.book_no)) books.set(r.book_no, { koleksiyon: r.koleksiyon, ids: [] });
        books.get(r.book_no).ids.push(r.id);
      }
      for (const [bookNo, b] of books) console.log(`${bookNo}\t${b.koleksiyon}\t${b.ids.join(' ')}`);
    } else if (idsOnly) console.log(list.map((r) => r.id).join(' '));
    else {
      console.log('| Koleksiyon | Sürüm | Hikâye | ID |\n|---|---|---|---:|');
      for (const r of list) console.log(`| ${r.koleksiyon} | ${r.surum} | ${r.hikaye} | ${r.id} |`);
      console.log(`\nToplam: ${list.length}`);
    }
  }
} finally {
  db.close();
}

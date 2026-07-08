import { createRequire } from 'module';
import { readFileSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { book, stories } from './batch-015-data.mjs';

const require = createRequire(import.meta.url);
const initSqlJs = require('sql.js');
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const paths = {
  db: resolve(root, 'assets/kivilcim.db'),
  catalog: resolve(root, 'YENI_KITAP_ONERILERI.md'),
  batch: resolve(root, 'HIKAYE_URETIM_BATCH_015.md'),
};

const STORY_VERSION = 'C2';
const LANGS = ['tr', 'en', 'es', 'de'];
const categoryNames = {
  11: { tr: 'Liderlik', en: 'Leadership', es: 'Liderazgo', de: 'Führung' },
};
const categoryLabelTr = { 11: 'Liderlik' };

const countWords = (t) => t.trim().split(/\s+/u).filter(Boolean).length;
const markerCount = (text, marker) => (text.match(new RegExp(marker, 'g')) || []).length;
const extractQuestion = (text) => {
  const match = /&&([^]+?)&&/.exec(text);
  return match ? match[1].trim() : '';
};

const violations = [];
for (const s of stories) {
  for (const lang of LANGS) {
    const d = s[lang];
    if (!d) {
      violations.push(`${s.key}/${lang}: eksik dil`);
      continue;
    }
    const cc = d.content.length;
    const tc = d.thirtySec.length;
    if (cc < 1050 || cc > 1700) violations.push(`${s.key}/${lang}: content ${cc}ch (${countWords(d.content)}w)`);
    if (tc < 300 || tc > 560) violations.push(`${s.key}/${lang}: thirty ${tc}ch (${countWords(d.thirtySec)}w)`);
    if (markerCount(d.content, '##') !== 2) violations.push(`${s.key}/${lang}: ## sayısı hatalı`);
    if (markerCount(d.content, '\\$\\$') !== 2) violations.push(`${s.key}/${lang}: $$ sayısı hatalı`);
    if (markerCount(d.content, '&&') !== 2) violations.push(`${s.key}/${lang}: && sayısı hatalı`);
    const cm = /~~([^]+?)~~/.exec(d.content);
    if (!cm) violations.push(`${s.key}/${lang}: ~~ zıtlık bloğu eksik`);
    else if (!cm[1].includes('::')) violations.push(`${s.key}/${lang}: ~~ bloğunda :: ayracı yok`);
    for (const f of ['punch', 'thirtySec', 'question', 'contrast']) {
      if (!d[f] || !String(d[f]).trim()) violations.push(`${s.key}/${lang}: ${f} boş`);
    }
    if (d.punch && d.punch.length > 280) violations.push(`${s.key}/${lang}: punch ${d.punch.length}ch`);
    if (extractQuestion(d.content) !== d.question) violations.push(`${s.key}/${lang}: question gövdeyle aynı değil`);
  }
}
if (violations.length) {
  console.error('LİMİT/FORMAT İHLALLERİ:\n' + violations.join('\n'));
  process.exit(1);
}
console.log('Ön doğrulama geçti: ' + (stories.length * LANGS.length) + ' hikaye-dil kombinasyonu.');

const SQL = await initSqlJs();
const db = new SQL.Database(readFileSync(paths.db));
db.run(`CREATE TABLE IF NOT EXISTS story_conversation_variants (
  story_id INTEGER NOT NULL, lang_code TEXT NOT NULL, punchline TEXT, thirty_sec TEXT,
  question TEXT, key_contrast TEXT, PRIMARY KEY (story_id, lang_code),
  FOREIGN KEY (story_id) REFERENCES stories(id))`);

let bookRow = db.exec(`SELECT id FROM books WHERE list_no=${book.listNo} LIMIT 1`)[0];
let bookId;
if (bookRow?.values?.length) {
  bookId = bookRow.values[0][0];
} else {
  db.run('INSERT INTO books (list_no, author, publish_year, category_id) VALUES (?, ?, ?, ?)',
    [book.listNo, book.author, book.year, book.categoryId]);
  bookId = db.exec('SELECT last_insert_rowid()')[0].values[0][0];
}

for (const lang of LANGS) {
  const categoryName = categoryNames[book.categoryId]?.[lang] || '';
  const bt = db.exec(`SELECT id FROM book_translations WHERE book_id=${bookId} AND lang_code='${lang}' LIMIT 1`)[0];
  if (bt?.values?.length) {
    db.run('UPDATE book_translations SET title=?, category_name=? WHERE book_id=? AND lang_code=?', [book.title, categoryName, bookId, lang]);
  } else {
    db.run('INSERT INTO book_translations (book_id, lang_code, title, category_name) VALUES (?, ?, ?, ?)', [bookId, lang, book.title, categoryName]);
  }
}

const created = [];
for (const s of stories) {
  const trTitle = s.tr.title.replaceAll("'", "''");
  const storyRow = db.exec(`SELECT s.id FROM stories s JOIN story_translations st ON st.story_id=s.id AND st.lang_code='tr' WHERE s.book_no=${book.listNo} AND st.title='${trTitle}' LIMIT 1`)[0];
  let storyId;
  if (storyRow?.values?.length) {
    storyId = storyRow.values[0][0];
    db.run('UPDATE stories SET version=? WHERE id=?', [STORY_VERSION, storyId]);
  } else {
    db.run('INSERT INTO stories (book_no, version) VALUES (?, ?)', [book.listNo, STORY_VERSION]);
    storyId = db.exec('SELECT last_insert_rowid()')[0].values[0][0];
  }
  for (const lang of LANGS) {
    const d = s[lang];
    const st = db.exec(`SELECT id FROM story_translations WHERE story_id=${storyId} AND lang_code='${lang}' LIMIT 1`)[0];
    if (st?.values?.length) {
      db.run('UPDATE story_translations SET title=?, description=?, content=?, hook=? WHERE story_id=? AND lang_code=?', [d.title, d.punch, d.content, d.question, storyId, lang]);
    } else {
      db.run('INSERT INTO story_translations (story_id, lang_code, title, description, content, hook) VALUES (?, ?, ?, ?, ?, ?)', [storyId, lang, d.title, d.punch, d.content, d.question]);
    }
    db.run('INSERT OR REPLACE INTO story_conversation_variants (story_id, lang_code, punchline, thirty_sec, question, key_contrast) VALUES (?, ?, ?, ?, ?, ?)',
      [storyId, lang, d.punch, d.thirtySec, d.question, d.contrast]);
  }
  created.push({ ...s, storyId });
}

writeFileSync(paths.db, Buffer.from(db.export()));
db.close();

let catalog = readFileSync(paths.catalog, 'utf8');
const label = categoryLabelTr[book.categoryId];
const rowBefore = `| ${book.catalogNo} | *${book.title}* | ${book.author} | ${label} | **YENİ ÖNERİ** | — | 0 |`;
const rowAfter = `| ${book.catalogNo} | *${book.title}* | ${book.author} | ${label} | **DB'DE KAYITLI / C2** | ${book.listNo} | ${stories.length} |`;
if (catalog.includes(rowBefore)) {
  catalog = catalog.replace(rowBefore, rowAfter);
  catalog = catalog.replace(
    'uygulama veritabanındaki 274 kitabı ve içerik üretimi için seçilen 26 yeni kitabı',
    'uygulama veritabanındaki 275 kitabı ve içerik üretimi için seçilen 25 yeni kitabı');
  writeFileSync(paths.catalog, catalog, 'utf8');
} else if (!catalog.includes(rowAfter)) {
  console.warn('UYARI: katalog satırı bulunamadı, elle güncelleyin: ' + book.title);
}

const lines = [
  '# Hikâye Üretim Batch 015',
  '',
  `- **Kitap:** *${book.title}* — ${book.author} (${label}, katalog no ${book.catalogNo}, DB list_no ${book.listNo})`,
  '- **Version:** C2 (zengin okuma formatı)',
  '- **Format:** C serisi; `~~önce :: sonra~~` zıtlık bloğu, görünür `$$ders$$` ve dokunulabilir `&&soru&&`.',
  '- **Diller:** tr/en/es/de — her biri bağımsız yazıldı.',
  '- **Depolama:** Local storage (assets/kivilcim.db); Supabase’e gönderilmedi.',
  '- **Status:** DB’YE EKLENDİ',
  '',
  '| # | Hikâye (TR) | Story ID | Kaynak |',
  '|---:|---|---:|---|',
  ...created.map((c, i) => `| ${i + 1} | *${c.tr.title}* | ${c.storyId} | ${c.source} |`),
  '',
];
writeFileSync(paths.batch, lines.join('\n'), 'utf8');

console.log('Eklendi (version=' + STORY_VERSION + ', book list_no=' + book.listNo + '):');
for (const c of created) console.log(`  ${c.tr.title} -> story_id ${c.storyId}`);

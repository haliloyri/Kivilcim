/**
 * story-pipeline/lib/store.mjs
 *
 * kivilcim.db icin paylasilan okuma/yazma yardimcilari.
 * Tum pipeline scriptleri DB'ye SADECE buradan erisir.
 */
import { createRequire } from 'module';
import { readFileSync, writeFileSync, copyFileSync, existsSync, mkdirSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const initSqlJs = require('sql.js');

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
export const LANGS = ['tr', 'en', 'es', 'de'];

export const PATHS = {
  db: resolve(ROOT, 'assets/kivilcim.db'),
  inventory: resolve(ROOT, 'KITAP_HIKAYE_ENVANTERI.md'),
  staging: resolve(ROOT, 'staging'),
  reports: resolve(ROOT, 'staging/reports'),
};

/** Sure -> kelime hedefi sozlesmesi. Tek dogruluk kaynagi. */
export const DURATION_SPEC = {
  1: { target: 160, tolerance: 40, emphasisMin: 1, emphasisMax: 2 },
  3: { target: 475, tolerance: 75, emphasisMin: 1, emphasisMax: 2 },
  5: { target: 800, tolerance: 100, emphasisMin: 2, emphasisMax: 3 },
};

export function wordRange(minutes) {
  const spec = DURATION_SPEC[minutes];
  if (!spec) throw new Error(`Gecersiz sure: ${minutes} (yalnizca 1, 3, 5)`);
  return { min: spec.target - spec.tolerance, max: spec.target + spec.tolerance, ...spec };
}

/* ------------------------------------------------------------------ */
/* DB acma / kapatma                                                   */
/* ------------------------------------------------------------------ */

export async function openDb({ readonly = true } = {}) {
  const SQL = await initSqlJs();
  const db = new SQL.Database(readFileSync(PATHS.db));
  db.__readonly = readonly;
  return db;
}

/** Yazmadan once zaman damgali .bak alir, sonra DB'yi diske yazar. */
export function saveDb(db, { backup = true } = {}) {
  if (db.__readonly) throw new Error('DB readonly modda acildi; saveDb cagrilamaz.');
  if (backup) {
    const stamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
    copyFileSync(PATHS.db, `${PATHS.db}.bak_${stamp}`);
  }
  writeFileSync(PATHS.db, Buffer.from(db.export()));
}

/** SELECT -> obje dizisi. */
export function rows(db, sql, params = []) {
  const stmt = db.prepare(sql);
  if (params.length) stmt.bind(params);
  const out = [];
  while (stmt.step()) out.push(stmt.getAsObject());
  stmt.free();
  return out;
}

export function one(db, sql, params = []) {
  return rows(db, sql, params)[0] ?? null;
}

export function scalar(db, sql, params = []) {
  const r = one(db, sql, params);
  return r ? Object.values(r)[0] : null;
}

/* ------------------------------------------------------------------ */
/* Envanter sorgulari                                                  */
/* ------------------------------------------------------------------ */

/** Tum kitaplar + cevirileri + hikaye sayilari. */
export function readBooks(db) {
  const books = rows(
    db,
    `SELECT b.id, b.list_no, b.author, b.publish_year, b.category_id, b.sub_category_id,
            (SELECT title FROM book_translations WHERE book_id = b.id AND lang_code = 'tr') AS title_tr,
            (SELECT category_name FROM book_translations WHERE book_id = b.id AND lang_code = 'tr') AS category_tr,
            (SELECT COUNT(DISTINCT lang_code) FROM book_translations WHERE book_id = b.id) AS lang_count,
            (SELECT COUNT(*) FROM stories WHERE book_no = b.list_no) AS story_count
       FROM books b
      ORDER BY b.list_no`
  );
  return books;
}

/** Tum hikayeler + dil/varyant kapsami. */
export function readStories(db) {
  return rows(
    db,
    `SELECT s.id, s.book_no, s.version,
            s.current_read_minutes, s.possible_read_minutes,
            s.target_word_count, s.target_word_tolerance,
            (SELECT title FROM story_translations WHERE story_id = s.id AND lang_code = 'tr') AS title_tr,
            (SELECT GROUP_CONCAT(lang_code) FROM (
               SELECT lang_code FROM story_translations
                WHERE story_id = s.id AND content IS NOT NULL AND content <> ''
                ORDER BY lang_code)) AS langs,
            (SELECT GROUP_CONCAT(lang_code) FROM (
               SELECT lang_code FROM story_conversation_variants
                WHERE story_id = s.id AND punchline IS NOT NULL AND punchline <> ''
                ORDER BY lang_code)) AS variant_langs,
            (SELECT GROUP_CONCAT(lang_code) FROM (
               SELECT lang_code FROM story_translations
                WHERE story_id = s.id AND hook IS NOT NULL AND hook <> ''
                ORDER BY lang_code)) AS hook_langs
       FROM stories s
      ORDER BY s.book_no, s.id`
  );
}

/**
 * Kategori id -> 4 dilli isim haritasi.
 * DIKKAT: `books.category_id` bu DB'de `sub_categories.id`'ye isaret eder,
 * `main_categories`/`categories`'e degil. Cozum sirasi:
 *   sub_categories -> main_categories -> categories
 * Kitabin ekranda gorunen kategorisi icin en guvenilir kaynak yine
 * `book_translations.category_name` alanidir (readBooks -> category_tr).
 */
export function readCategories(db) {
  const map = {};
  const add = (id, names) => {
    if (map[id]) return;
    map[id] = names;
  };
  for (const r of rows(db, 'SELECT id, name_tr, name_en, name_es, name_de, main_category_id FROM sub_categories')) {
    add(r.id, { tr: r.name_tr, en: r.name_en, es: r.name_es, de: r.name_de, main: r.main_category_id });
  }
  for (const r of rows(db, 'SELECT id, name_tr, name_en, name_es, name_de FROM main_categories')) {
    add(r.id, { tr: r.name_tr, en: r.name_en, es: r.name_es, de: r.name_de });
  }
  for (const r of rows(db, 'SELECT id, category_name FROM categories')) {
    add(r.id, { tr: r.category_name, en: r.category_name, es: r.category_name, de: r.category_name });
  }
  return map;
}

/* ------------------------------------------------------------------ */
/* Metin yardimcilari                                                  */
/* ------------------------------------------------------------------ */

export const MARKERS = {
  emphasis: /##([\s\S]*?)##/g, // paylas: quote
  lesson: /\$\$([\s\S]*?)\$\$/g, // paylas: lesson
  reflection: /&&([\s\S]*?)&&/g, // paylas: reflection
  contrast: /~~([\s\S]*?)~~/g, // rich format (F7+): "~~once :: sonra~~" iki sutunlu kart
};

/**
 * DIKKAT: `~~` DORDUNCU isaret turudur ve gec kesfedildi.
 * StoryDetailScreen.js `~~once :: sonra~~` bicimini iki sutunlu karsitlik
 * karti olarak render eder ve `::` ayiricisini ' — ' ile degistirir.
 * 34 hikayede (82 kayit) kullaniliyor. Denetimlerde unutulursa dengesiz
 * `~~` ya da `::` eksikligi gorunmez kalir.
 */
export function stripMarkers(text = '') {
  return text.replace(/##|\$\$|&&|~~/g, '').replace(/\s*::\s*/g, ' ');
}

export function countWords(text = '') {
  return stripMarkers(text).trim().split(/\s+/u).filter(Boolean).length;
}

export function countMarker(text = '', kind) {
  const re = new RegExp(MARKERS[kind].source, 'g');
  return (text.match(re) || []).length;
}

export function extractMarker(text = '', kind) {
  const re = new RegExp(MARKERS[kind].source, 'g');
  return [...text.matchAll(re)].map((m) => m[1].trim());
}

/** Olgu tutarliligi icin sayi/yil tokenlari. */
export function numberTokens(text = '') {
  return [...stripMarkers(text).matchAll(/\d[\d.,]*/g)]
    .map((m) => m[0].replace(/[.,]$/, ''))
    .map((n) => n.replace(/[.,]/g, ''))
    .filter((n) => n.length > 0)
    .sort();
}

export function sentenceCount(text = '') {
  return stripMarkers(text).split(/[.!?]+(?:\s|$)/u).filter((s) => s.trim().length > 2).length;
}

export function paragraphCount(text = '') {
  return text.split(/\n\s*\n/).filter((p) => p.trim()).length;
}

/* ------------------------------------------------------------------ */
/* IO                                                                  */
/* ------------------------------------------------------------------ */

export function ensureDir(p) {
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

export function writeReport(name, content) {
  ensureDir(PATHS.reports);
  const p = resolve(PATHS.reports, name);
  writeFileSync(p, content, 'utf8');
  return p;
}

export function readJson(p) {
  return JSON.parse(readFileSync(p, 'utf8'));
}

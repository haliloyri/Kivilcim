// Shared helpers for the Supabase content/backup scripts.
// Needs SUPABASE_SERVICE_ROLE_KEY in .env.local (never commit it). The URL is
// read from app.json → expo.extra.supabase.url.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const SQLITE_DB = path.join(ROOT, 'assets/albor.db');
export const ACTIVE_VERSION = 'Opus55';

// FK-safe insert order. `where` limits which SQLite rows are exported.
export const CONTENT_TABLES = [
  { name: 'main_categories', sql: 'SELECT id, name_tr, name_en, name_de, name_es FROM main_categories' },
  { name: 'sub_categories', sql: 'SELECT id, main_category_id, name_tr, name_en, name_de, name_es FROM sub_categories' },
  { name: 'categories', sql: 'SELECT id, category_name, "order" FROM categories' },
  { name: 'categories_translations', sql: 'SELECT id, category_id, language, translation FROM categories_translations' },
  { name: 'subcategories', sql: 'SELECT id, categori_id, subcategory_name FROM subcategories' },
  { name: 'books', sql: 'SELECT id, list_no, author, publish_year, category_id, sub_category_id FROM books' },
  { name: 'book_translations', sql: 'SELECT id, book_id, lang_code, title, category_name FROM book_translations' },
  {
    name: 'stories',
    sql: `SELECT id, book_no, CAST(version AS TEXT) AS version, current_read_minutes, possible_read_minutes,
                 target_word_count, target_word_tolerance
            FROM stories WHERE version = ?`,
    params: [ACTIVE_VERSION],
    map: (r) => ({ ...r, is_active: true }),
  },
  {
    name: 'story_translations',
    sql: `SELECT id, story_id, lang_code, title, description, content, hook, one_minute_summary
            FROM story_translations WHERE story_id IN (SELECT id FROM stories WHERE version = ?)`,
    params: [ACTIVE_VERSION],
  },
  {
    name: 'story_conversation_variants',
    sql: `SELECT story_id, lang_code, punchline, thirty_sec, question, key_contrast
            FROM story_conversation_variants WHERE story_id IN (SELECT id FROM stories WHERE version = ?)`,
    params: [ACTIVE_VERSION],
    onConflict: 'story_id,lang_code',
  },
  { name: 'content_seed_versions', sql: 'SELECT seed_key, version, applied_at FROM content_seed_versions', onConflict: 'seed_key' },
];

// sub_categories.name_tr is UNIQUE in Postgres; empty strings would collide.
const nullIfBlank = (row) => Object.fromEntries(Object.entries(row).map(([k, v]) => [k, v === '' ? null : v]));

export const readContentRows = () => {
  const db = new DatabaseSync(SQLITE_DB, { readOnly: true });
  try {
    return CONTENT_TABLES.map((t) => {
      const rows = db.prepare(t.sql).all(...(t.params || [])).map((r) => nullIfBlank({ ...r }));
      return { ...t, rows: t.map ? rows.map(t.map) : rows };
    });
  } finally {
    db.close();
  }
};

const readEnvLocal = () => {
  const file = path.join(ROOT, '.env.local');
  if (!fs.existsSync(file)) return {};
  return Object.fromEntries(fs.readFileSync(file, 'utf8').split('\n')
    .map((l) => l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)).filter(Boolean)
    .map(([, k, v]) => [k, v.replace(/^['"]|['"]$/g, '')]));
};

export const createServiceClient = async () => {
  const env = { ...readEnvLocal(), ...process.env };
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY missing (add it to .env.local).');
  const app = JSON.parse(fs.readFileSync(path.join(ROOT, 'app.json'), 'utf8'));
  const url = env.SUPABASE_URL || app.expo.extra.supabase.url;
  const { createClient } = await import('@supabase/supabase-js');
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
};

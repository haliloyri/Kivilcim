// Runs syncContentFromSupabase against a copy of the bundled SQLite DB
// (node:sqlite behind a minimal expo-sqlite-shaped adapter) and a fake
// Supabase client, to prove the sync SQL matches the real local schema.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const ROOT = path.resolve(__dirname, '../../..');
let mockDb;
let mockRemote;

const adapter = (db) => ({
  getFirstAsync: async (sql, params = []) => db.prepare(sql).get(...params),
  getAllAsync: async (sql, params = []) => db.prepare(sql).all(...params),
  runAsync: async (sql, params = []) => db.prepare(sql).run(...params),
  execAsync: async (sql) => db.exec(sql),
  prepareAsync: async (sql) => {
    const st = db.prepare(sql);
    return { executeAsync: async (params = []) => st.run(...params), finalizeAsync: async () => {} };
  },
  withTransactionAsync: async (fn) => {
    db.exec('BEGIN');
    try { await fn(); db.exec('COMMIT'); } catch (e) { db.exec('ROLLBACK'); throw e; }
  },
});

jest.mock('../../db/db', () => ({ getDb: () => mockDb, waitForDb: () => Promise.resolve() }));
jest.mock('../supabase', () => {
  const query = (table) => {
    const q = {
      select: () => q, order: () => q, eq: () => q,
      range: async (from, to) => ({ data: (mockRemote[table] || []).slice(from, to + 1), error: null }),
      maybeSingle: async () => ({ data: mockRemote.content_seed_versions?.[0] || null, error: null }),
    };
    return q;
  };
  return { SUPABASE_LIVE: true, supabase: { from: query } };
});

const { syncContentFromSupabase } = require('../contentSync');

let file;
let raw;
beforeEach(() => {
  file = path.join(os.tmpdir(), `contentSync-${process.pid}-${Date.now()}.db`);
  fs.copyFileSync(path.join(ROOT, 'assets/albor.db'), file);
  raw = new DatabaseSync(file);
  // Columns initDb adds at runtime.
  raw.exec(`ALTER TABLE stories ADD COLUMN sort_order INTEGER;
            UPDATE stories SET sort_order = id;
            CREATE UNIQUE INDEX idx_stories_sort_order ON stories(sort_order);
            ALTER TABLE stories ADD COLUMN thirty_sec TEXT;
            ALTER TABLE stories ADD COLUMN is_active INTEGER DEFAULT 0;
            UPDATE stories SET is_active = CASE WHEN version = 'Opus55' THEN 1 ELSE 0 END;`);
  mockDb = adapter(raw);
  const ids = raw.prepare(`SELECT id FROM stories WHERE version = 'Opus55' ORDER BY id LIMIT 3`).all().map((r) => r.id);
  const pick = (sql, ...p) => raw.prepare(sql).all(...p).map((r) => ({ ...r }));
  mockRemote = {
    content_seed_versions: [{ version: 1 }],
    categories: pick('SELECT * FROM categories'),
    books: pick('SELECT * FROM books'),
    stories: [
      ...pick(`SELECT id, book_no, version, current_read_minutes, possible_read_minutes, target_word_count, target_word_tolerance FROM stories WHERE id IN (${ids})`),
      { id: 999001, book_no: 1, version: 'Opus55', current_read_minutes: 4, possible_read_minutes: 4, target_word_count: 600, target_word_tolerance: 40 },
    ],
    story_translations: [
      { story_id: ids[0], lang_code: 'tr', title: 'Güncel başlık', description: '', content: 'Yeni metin', hook: '', one_minute_summary: '' },
      { story_id: 999001, lang_code: 'tr', title: 'Yeni hikâye', description: '', content: 'Metin', hook: '', one_minute_summary: '' },
    ],
    story_conversation_variants: [{ story_id: 999001, lang_code: 'tr', punchline: 'p', thirty_sec: 't', question: 'q', key_contrast: 'k' }],
  };
  mockRemote.ids = ids;
});
afterEach(() => { raw.close(); fs.rmSync(file, { force: true }); });

it('applies the remote catalogue and keeps every story active', async () => {
  await expect(syncContentFromSupabase()).resolves.toEqual({ changed: true, stories: 4 });
  expect(raw.prepare('SELECT COUNT(*) AS n FROM stories WHERE is_active = 0').get().n).toBe(0);
  const active = raw.prepare('SELECT id FROM stories WHERE is_active = 1').all().map((r) => r.id);
  expect(active).toEqual(expect.arrayContaining([...mockRemote.ids, 999001]));
  const tr = raw.prepare(`SELECT title, content FROM story_translations WHERE story_id = ? AND lang_code = 'tr'`).all(mockRemote.ids[0]);
  expect(tr).toEqual([{ title: 'Güncel başlık', content: 'Yeni metin' }]);
  expect(raw.prepare('SELECT sort_order FROM stories WHERE id = 999001').get().sort_order).toBeGreaterThan(0);
  // Same version again → no work.
  await expect(syncContentFromSupabase()).resolves.toEqual({ changed: false });
});

it('never hides every story when the server returns an empty catalogue', async () => {
  mockRemote.stories = [];
  await expect(syncContentFromSupabase()).resolves.toEqual({ changed: false });
  expect(raw.prepare('SELECT COUNT(*) AS n FROM stories WHERE is_active = 1').get().n).toBe(200);
});

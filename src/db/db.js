import * as SQLite from 'expo-sqlite'
import * as FileSystem from 'expo-file-system/legacy';
import { Asset } from 'expo-asset';

let dbInstance = null;
export const getDb = () => {
  if (!dbInstance) {
    dbInstance = SQLite.openDatabaseSync('kivilcim.db')
  }
  return dbInstance;
}

// Guard: prevent queries before tables exist
let _dbReady = false;
let _dbReadyResolve;
const _dbReadyPromise = new Promise(r => { _dbReadyResolve = r; });
export const waitForDb = () => _dbReadyPromise;
export const isDbReady = () => _dbReady;

let _dataReady = false;
let _dataReadyResolve;
const _dataReadyPromise = new Promise(r => { _dataReadyResolve = r; });
export const waitForData = () => _dataReadyPromise;

// ──────────────────────────────────────────────────────
//  DB VERSION - Bump this number to force a DB reset
//  on the next app launch. This deletes the old DB
//  and copies the fresh one from assets/kivilcim.db.
// ──────────────────────────────────────────────────────
const DB_VERSION = 16;
const DB_VERSION_KEY = 'db_version';

const getVersionFilePath = () =>
  FileSystem.documentDirectory + 'SQLite/.db_version';

const readStoredVersion = async () => {
  try {
    const path = getVersionFilePath();
    const info = await FileSystem.getInfoAsync(path);
    if (!info.exists) return 0;
    const raw = await FileSystem.readAsStringAsync(path);
    return parseInt(raw, 10) || 0;
  } catch {
    return 0;
  }
};

const writeStoredVersion = async (v) => {
  await FileSystem.writeAsStringAsync(getVersionFilePath(), String(v));
};

// ──────────────────────────────────────────────────────
//  INIT DB
// ──────────────────────────────────────────────────────
const populateCategoryMappings = async (db) => {
  // Legacy category_mappings discarded. New schema uses categories, subcategories directly via the DB file.
};

// Matches any run of leading whitespace, emoji, pictographs, symbols and the
// invisible joiners/variation-selectors that accompany them.
const LEADING_SYMBOL_RE = /^[\s←-⇿⌀-➿⬀-⯿︀-️‍\u{1F000}-\u{1FAFF}]+/u;

const stripLeadingSymbols = (value) =>
  String(value || '').replace(LEADING_SYMBOL_RE, '').trim();

/**
 * Removes emoji/symbol prefixes from category translations (e.g. the bundled
 * Admin DB ships English names like "💰 Finance"). Runs on every init — including
 * right after the DB is re-copied from assets on a force reset — so the emoji
 * never resurfaces. Keeps category labels consistent across all languages.
 */
const sanitizeCategoryTranslations = async (db) => {
  const rows = await db.getAllAsync(
    `SELECT id, translation FROM categories_translations`
  );
  let cleaned = 0;
  for (const row of rows) {
    const next = stripLeadingSymbols(row.translation);
    if (next && next !== row.translation) {
      await db.runAsync(
        `UPDATE categories_translations SET translation = ? WHERE id = ?`,
        [next, row.id]
      );
      cleaned += 1;
    }
  }
  if (cleaned > 0) {
    console.log('sanitizeCategoryTranslations: cleaned ' + cleaned + ' category labels.');
  }
};

const normalizeCategoryId = (value) => {
  if (value == null) return null;
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) return null;
  return Math.trunc(num);
};

const resolveCategoryId = async (db, input) => {
  const normalized = normalizeCategoryId(input);
  if (normalized) return normalized;

  const key = String(input || '').trim();
  if (!key) return null;

  const row = await db.getFirstAsync(
    `SELECT c.id
     FROM categories c
     LEFT JOIN categories_translations ct ON ct.category_id = c.id
     WHERE c.category_name = ? OR ct.translation = ?
     ORDER BY CASE WHEN c.category_name = ? THEN 0 ELSE 1 END
     LIMIT 1`,
    [key, key, key]
  );

  return normalizeCategoryId(row?.id);
};

const resolveCategoryIds = async (db, list = []) => {
  if (!Array.isArray(list) || list.length === 0) return [];
  const resolved = [];
  for (const item of list) {
    const categoryId = await resolveCategoryId(db, item);
    if (categoryId) resolved.push(categoryId);
  }
  return [...new Set(resolved)];
};

const migrateSortOrder = async (db) => {
  const columns = await db.getAllAsync(`PRAGMA table_info(stories)`);
  const hasSortOrder = columns.some((c) => c.name === 'sort_order');
  if (hasSortOrder) return;

  await db.execAsync(`ALTER TABLE stories ADD COLUMN sort_order INTEGER;`);

  await db.runAsync(`
    WITH ranked AS (
      SELECT id, ROW_NUMBER() OVER (ORDER BY RANDOM()) AS rn
      FROM stories
    )
    UPDATE stories
    SET sort_order = (SELECT rn FROM ranked WHERE ranked.id = stories.id);
  `);

  await db.execAsync(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_stories_sort_order ON stories(sort_order);
  `);

  console.log('migrateSortOrder: sort_order column added and populated.');
};

const migrateThirtySecColumn = async (db) => {
  const columns = await db.getAllAsync(`PRAGMA table_info(stories)`);
  const hasThirtySec = columns.some((c) => c.name === 'thirty_sec');
  if (hasThirtySec) return;

  await db.execAsync(`ALTER TABLE stories ADD COLUMN thirty_sec TEXT;`);

  console.log('migrateThirtySecColumn: thirty_sec column added.');
};

const migrateStoryVersion = async (db) => {
  const columns = await db.getAllAsync(`PRAGMA table_info(stories)`);
  const hasVersion = columns.some((c) => c.name === 'version');

  if (!hasVersion) {
    await db.execAsync(`ALTER TABLE stories ADD COLUMN version INTEGER DEFAULT 1;`);
  }

  await db.execAsync(`UPDATE stories SET version = 1 WHERE version IS NULL;`);
};

const migrateStoryDuration = async (db) => {
  const columns = await db.getAllAsync(`PRAGMA table_info(stories)`);
  const names = new Set(columns.map((column) => column.name));

  if (!names.has('current_read_minutes')) {
    await db.execAsync(`ALTER TABLE stories ADD COLUMN current_read_minutes INTEGER DEFAULT 1;`);
  }
  if (!names.has('possible_read_minutes')) {
    await db.execAsync(`ALTER TABLE stories ADD COLUMN possible_read_minutes INTEGER DEFAULT 1;`);
  }
  if (!names.has('target_word_count')) {
    await db.execAsync(`ALTER TABLE stories ADD COLUMN target_word_count INTEGER DEFAULT 160;`);
  }
  if (!names.has('target_word_tolerance')) {
    await db.execAsync(`ALTER TABLE stories ADD COLUMN target_word_tolerance INTEGER DEFAULT 40;`);
  }

  await db.execAsync(`
    UPDATE stories
    SET current_read_minutes = COALESCE(current_read_minutes, 1),
        possible_read_minutes = COALESCE(possible_read_minutes, 1),
        target_word_count = COALESCE(target_word_count, 160),
        target_word_tolerance = COALESCE(target_word_tolerance, 40);
  `);
};

const ensureStoryConversationVariants = async (db) => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS story_conversation_variants (
      story_id INTEGER NOT NULL,
      lang_code TEXT NOT NULL,
      punchline TEXT,
      thirty_sec TEXT,
      question TEXT,
      key_contrast TEXT,
      PRIMARY KEY (story_id, lang_code),
      FOREIGN KEY (story_id) REFERENCES stories(id)
    );

    CREATE INDEX IF NOT EXISTS idx_story_conversation_variants_lang
      ON story_conversation_variants(lang_code);
  `);
};

const migrateUserSelectedCategoriesToIds = async (db) => {
  const columns = await db.getAllAsync(`PRAGMA table_info(user_selected_categories)`);
  const hasCategoryId = columns.some((c) => c.name === 'category_id');
  const hasLegacyCategory = columns.some((c) => c.name === 'category');

  if (hasCategoryId && !hasLegacyCategory) return;

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS user_selected_categories_new (
      user_id TEXT,
      category_id INTEGER,
      PRIMARY KEY(user_id, category_id),
      FOREIGN KEY(category_id) REFERENCES categories(id)
    );
  `);

  if (hasCategoryId) {
    await db.execAsync(`
      INSERT OR IGNORE INTO user_selected_categories_new (user_id, category_id)
      SELECT user_id, category_id
      FROM user_selected_categories
      WHERE category_id IS NOT NULL;
    `);
  }

  if (hasLegacyCategory) {
    await db.execAsync(`
      INSERT OR IGNORE INTO user_selected_categories_new (user_id, category_id)
      SELECT usc.user_id, c.id
      FROM user_selected_categories usc
      JOIN categories c ON c.category_name = usc.category
      WHERE usc.category IS NOT NULL;

      INSERT OR IGNORE INTO user_selected_categories_new (user_id, category_id)
      SELECT usc.user_id, ct.category_id
      FROM user_selected_categories usc
      JOIN categories_translations ct ON ct.translation = usc.category
      WHERE usc.category IS NOT NULL;
    `);
  }

  await db.execAsync(`
    DROP TABLE IF EXISTS user_selected_categories;
    ALTER TABLE user_selected_categories_new RENAME TO user_selected_categories;
  `);
};

export const initDb = async () => {
  try {
    const dbDir = FileSystem.documentDirectory + 'SQLite';
    const dbPath = dbDir + '/kivilcim.db';

    // Ensure directory exists
    const dirInfo = await FileSystem.getInfoAsync(dbDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(dbDir, { intermediates: true });
    }

    // -- Force Reset Logic --
    // Compare stored version with current DB_VERSION.
    // If they differ the old DB file is deleted so the
    // fresh copy from assets takes its place.
    const storedVersion = await readStoredVersion();
    if (storedVersion < DB_VERSION) {
      console.log(
        'DB version mismatch (stored=' + storedVersion + ', current=' + DB_VERSION + '). ' +
        'Deleting old DB for force reset...'
      );
      // Close any existing connection first
      if (dbInstance) {
        try { dbInstance.closeSync(); } catch (_) { /* ignore */ }
        dbInstance = null;
      }
      await FileSystem.deleteAsync(dbPath, { idempotent: true });
      await writeStoredVersion(DB_VERSION);
      console.log('Old DB deleted. Will copy fresh DB from assets.');
    }

    // -- Copy from assets if DB does not exist --
    const copyAssetDb = async () => {
      console.log('Copying Admin DB from assets...');
      const asset = Asset.fromModule(require('../../assets/kivilcim.db'));
      await asset.downloadAsync();
      console.log('Asset localUri:', asset.localUri, 'uri:', asset.uri);
      await FileSystem.copyAsync({
        from: asset.localUri || asset.uri,
        to: dbPath,
      });
      const copied = await FileSystem.getInfoAsync(dbPath);
      console.log('Admin DB copy complete. Size:', copied.size, 'bytes');
    };

    const dbInfo = await FileSystem.getInfoAsync(dbPath);
    if (!dbInfo.exists) {
      await copyAssetDb();
    }

    let db = getDb();

    // Verify the DB has the expected tables.
    // If stories table is missing, the DB file is corrupt/empty — re-copy.
    try {
      const check = await db.getFirstAsync(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='stories'"
      );
      if (!check) {
        console.warn('stories table NOT found — forcing re-copy of Admin DB...');
        try { db.closeSync(); } catch (_) {}
        dbInstance = null;
        await FileSystem.deleteAsync(dbPath, { idempotent: true });
        await copyAssetDb();
        db = getDb();
      } else {
        console.log('DB verification OK: stories table exists.');
      }
    } catch (verifyErr) {
      console.warn('DB verification query failed:', verifyErr, '— forcing re-copy...');
      try { db.closeSync(); } catch (_) {}
      dbInstance = null;
      await FileSystem.deleteAsync(dbPath, { idempotent: true });
      await copyAssetDb();
      db = getDb();
    }

    // Ensure essential user-state tables exist (these are NOT in the Admin DB)
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS user_selected_categories (
        user_id TEXT,
        category_id INTEGER,
        PRIMARY KEY(user_id, category_id),
        FOREIGN KEY(category_id) REFERENCES categories(id)
      );
      CREATE TABLE IF NOT EXISTS user_reads (
        user_id TEXT,
        story_id TEXT,
        read_at TEXT,
        PRIMARY KEY(user_id, story_id)
      );
      CREATE TABLE IF NOT EXISTS user_likes (
        user_id TEXT,
        story_id TEXT,
        liked INTEGER,
        liked_at TEXT,
        PRIMARY KEY(user_id, story_id)
      );
      CREATE TABLE IF NOT EXISTS user_streak_freezes (
        user_id TEXT,
        freeze_date TEXT,
        used_at TEXT,
        PRIMARY KEY(user_id, freeze_date)
      );
    `);

    await migrateUserSelectedCategoriesToIds(db);

    await migrateSortOrder(db);

    await migrateThirtySecColumn(db);

    await migrateStoryVersion(db);

    await migrateStoryDuration(db);

    await ensureStoryConversationVariants(db);

    await populateCategoryMappings(db);

    await sanitizeCategoryTranslations(db);

  } catch (error) {
    console.error('Database initialization error:', error);
  } finally {
    _dbReady = true;
    if (_dbReadyResolve) _dbReadyResolve();
    // Since we use a pre-populated Admin DB (no JSON seeding),
    // data is ready as soon as the DB is initialised.
    _dataReady = true;
    if (_dataReadyResolve) _dataReadyResolve();
  }
}

// ──────────────────────────────────────────────────────
//  SEED DATA  (reads JSON files once -> populates DB)
// ──────────────────────────────────────────────────────

export const seedData = async () => {
  // Data is now marked ready inside initDb() itself,
  // but we still wait here so callers behave correctly.
  await waitForDb();
  console.log('Admin DB mode enabled. Skipping JSON seeding.');
}

// ──────────────────────────────────────────────────────
//  QUERY FUNCTIONS (language-aware)
// ──────────────────────────────────────────────────────

/**
 * Returns all stories with translations for the given language.
 * Joins with the books table using book_no vs list_no.
 * Falls back to Turkish ('tr') if target translation is missing.
 */
export const getStoriesForLang = async (lang = 'tr') => {
  await waitForData();
  const db = getDb();

  const rows = await db.getAllAsync(`
    SELECT
      s.id,
      COALESCE(s.version, 1) AS version,
      b.id AS source_book_id,
      b.author,
      b.publish_year AS publishDate,
      COALESCE(s.current_read_minutes, 1) AS min,
      COALESCE(s.possible_read_minutes, 1) AS possible_read_minutes,
      COALESCE(s.target_word_count, 160) AS target_word_count,
      COALESCE(s.target_word_tolerance, 40) AS target_word_tolerance,
      sub.subcategory_name AS cat,
      sub.subcategory_name AS cat_display,
      c.id AS parent_cat_id,
      COALESCE(NULLIF(bt.title, ''),         bt_tr.title,         '') AS source_book,
      COALESCE(NULLIF(st.title, ''),         st_tr.title,         '') AS title,
      COALESCE(NULLIF(st.description, ''),   st_tr.description,   '') AS description,
      COALESCE(NULLIF(st.content, ''),       st_tr.content,       '') AS body,
      COALESCE(NULLIF(st.hook, ''),          st_tr.hook,          '') AS hook,
      COALESCE(NULLIF(s.thirty_sec, ''),     '')                  AS thirty_sec,
      COALESCE(NULLIF(scv.punchline, ''),    scv_tr.punchline,    '') AS conversation_punchline,
      COALESCE(NULLIF(scv.thirty_sec, ''),   scv_tr.thirty_sec,   '') AS conversation_thirty_sec,
      COALESCE(NULLIF(scv.question, ''),     scv_tr.question,     '') AS conversation_question,
      COALESCE(NULLIF(scv.key_contrast, ''), scv_tr.key_contrast,'') AS conversation_key_contrast,
      COALESCE(ct.translation, ct_tr.translation, c.category_name, 'Tümü') AS parent_cat,
      c.category_name AS parent_cat_raw
    FROM stories s
    LEFT JOIN books b ON b.list_no = s.book_no
    -- Category Hierarchy
    LEFT JOIN subcategories sub ON sub.id = b.category_id
    LEFT JOIN categories c ON c.id = sub.categori_id
    LEFT JOIN categories_translations ct ON ct.category_id = c.id AND ct.language = ?
    LEFT JOIN categories_translations ct_tr ON ct_tr.category_id = c.id AND ct_tr.language = 'tr'
    -- Story Translations
    LEFT JOIN story_translations st    ON st.story_id = s.id AND st.lang_code = ?
    LEFT JOIN story_translations st_tr ON st_tr.story_id = s.id AND st_tr.lang_code = 'tr'
    LEFT JOIN story_conversation_variants scv    ON scv.story_id = s.id AND scv.lang_code = ?
    LEFT JOIN story_conversation_variants scv_tr ON scv_tr.story_id = s.id AND scv_tr.lang_code = 'tr'
    -- Book Translations
    LEFT JOIN book_translations bt    ON bt.book_id = b.id AND bt.lang_code = ?
    LEFT JOIN book_translations bt_tr ON bt_tr.book_id = b.id AND bt_tr.lang_code = 'tr'
    ORDER BY s.sort_order ASC
  `, [lang, lang, lang, lang]);

  return rows.map(r => ({
    ...r,
    story_id: String(r.id),
    title: r.title || '',
    body: r.body || '',
    hook: r.hook || '',
    thirty_sec: r.thirty_sec || '',
  }));
};

export const getStoryByLang = async (storyId, lang = 'tr') => {
  await waitForData();
  const db = getDb();
  const r = await db.getFirstAsync(`
    SELECT
      s.id,
      COALESCE(s.version, 1) AS version,
      b.id AS source_book_id,
      b.author,
      b.publish_year AS publishDate,
      COALESCE(s.current_read_minutes, 1) AS min,
      COALESCE(s.possible_read_minutes, 1) AS possible_read_minutes,
      COALESCE(s.target_word_count, 160) AS target_word_count,
      COALESCE(s.target_word_tolerance, 40) AS target_word_tolerance,
      sub.subcategory_name AS cat,
      sub.subcategory_name AS cat_display,
      c.id AS parent_cat_id,
      COALESCE(NULLIF(bt.title, ''),         bt_tr.title,         '') AS source_book,
      COALESCE(NULLIF(st.title, ''),         st_tr.title,         '') AS title,
      COALESCE(NULLIF(st.description, ''),   st_tr.description,   '') AS description,
      COALESCE(NULLIF(st.content, ''),       st_tr.content,       '') AS body,
      COALESCE(NULLIF(st.hook, ''),          st_tr.hook,          '') AS hook,
      COALESCE(NULLIF(s.thirty_sec, ''),     '')                  AS thirty_sec,
      COALESCE(NULLIF(scv.punchline, ''),    scv_tr.punchline,    '') AS conversation_punchline,
      COALESCE(NULLIF(scv.thirty_sec, ''),   scv_tr.thirty_sec,   '') AS conversation_thirty_sec,
      COALESCE(NULLIF(scv.question, ''),     scv_tr.question,     '') AS conversation_question,
      COALESCE(NULLIF(scv.key_contrast, ''), scv_tr.key_contrast,'') AS conversation_key_contrast,
      COALESCE(ct.translation, ct_tr.translation, c.category_name, 'Tümü') AS parent_cat,
      c.category_name AS parent_cat_raw
    FROM stories s
    LEFT JOIN books b ON b.list_no = s.book_no
    -- Category Hierarchy
    LEFT JOIN subcategories sub ON sub.id = b.category_id
    LEFT JOIN categories c ON c.id = sub.categori_id
    LEFT JOIN categories_translations ct ON ct.category_id = c.id AND ct.language = ?
    LEFT JOIN categories_translations ct_tr ON ct_tr.category_id = c.id AND ct_tr.language = 'tr'
    -- Story Translations
    LEFT JOIN story_translations st    ON st.story_id = s.id AND st.lang_code = ?
    LEFT JOIN story_translations st_tr ON st_tr.story_id = s.id AND st_tr.lang_code = 'tr'
    LEFT JOIN story_conversation_variants scv    ON scv.story_id = s.id AND scv.lang_code = ?
    LEFT JOIN story_conversation_variants scv_tr ON scv_tr.story_id = s.id AND scv_tr.lang_code = 'tr'
    -- Book Translations
    LEFT JOIN book_translations bt    ON bt.book_id = b.id AND bt.lang_code = ?
    LEFT JOIN book_translations bt_tr ON bt_tr.book_id = b.id AND bt_tr.lang_code = 'tr'
    WHERE s.id = ?
  `, [lang, lang, lang, lang, storyId]);

  if (!r) return null;
  return {
    ...r,
    story_id: String(r.id),
    title: r.title || '',
    body: r.body || '',
    hook: r.hook || '',
    thirty_sec: r.thirty_sec || '',
  }
};

export const searchStoriesForLang = async (query, lang = 'tr', limit = 40) => {
  await waitForData();
  const normalized = String(query || '').trim().toLowerCase();
  if (!normalized) return [];

  const db = getDb();
  const likeQuery = `%${normalized}%`;
  const safeLimit = Number.isFinite(limit) ? Math.max(1, Math.min(100, Number(limit))) : 40;

  const rows = await db.getAllAsync(`
    SELECT
      s.id,
      COALESCE(s.version, 1) AS version,
      b.id AS source_book_id,
      b.author,
      b.publish_year AS publishDate,
      COALESCE(s.current_read_minutes, 1) AS min,
      COALESCE(s.possible_read_minutes, 1) AS possible_read_minutes,
      COALESCE(s.target_word_count, 160) AS target_word_count,
      COALESCE(s.target_word_tolerance, 40) AS target_word_tolerance,
      sub.subcategory_name AS cat,
      sub.subcategory_name AS cat_display,
      c.id AS parent_cat_id,
      COALESCE(NULLIF(bt.title, ''),         bt_tr.title,         '') AS source_book,
      COALESCE(NULLIF(st.title, ''),         st_tr.title,         '') AS title,
      COALESCE(NULLIF(st.description, ''),   st_tr.description,   '') AS description,
      COALESCE(NULLIF(st.content, ''),       st_tr.content,       '') AS body,
      COALESCE(NULLIF(st.hook, ''),          st_tr.hook,          '') AS hook,
      COALESCE(NULLIF(s.thirty_sec, ''),     '')                  AS thirty_sec,
      COALESCE(NULLIF(scv.punchline, ''),    scv_tr.punchline,    '') AS conversation_punchline,
      COALESCE(NULLIF(scv.thirty_sec, ''),   scv_tr.thirty_sec,   '') AS conversation_thirty_sec,
      COALESCE(NULLIF(scv.question, ''),     scv_tr.question,     '') AS conversation_question,
      COALESCE(NULLIF(scv.key_contrast, ''), scv_tr.key_contrast,'') AS conversation_key_contrast,
      COALESCE(ct.translation, ct_tr.translation, c.category_name, 'Tümü') AS parent_cat,
      c.category_name AS parent_cat_raw,
      CASE WHEN LOWER(COALESCE(NULLIF(st.title, ''), st_tr.title, '')) LIKE ? THEN 0 ELSE 1 END AS rank_title,
      CASE WHEN LOWER(COALESCE(NULLIF(st.content, ''), st_tr.content, '')) LIKE ? THEN 0 ELSE 1 END AS rank_body,
      CASE WHEN LOWER(COALESCE(NULLIF(bt.title, ''), bt_tr.title, '')) LIKE ? THEN 0 ELSE 1 END AS rank_source
    FROM stories s
    LEFT JOIN books b ON b.list_no = s.book_no
    LEFT JOIN subcategories sub ON sub.id = b.category_id
    LEFT JOIN categories c ON c.id = sub.categori_id
    LEFT JOIN categories_translations ct ON ct.category_id = c.id AND ct.language = ?
    LEFT JOIN categories_translations ct_tr ON ct_tr.category_id = c.id AND ct_tr.language = 'tr'
    LEFT JOIN story_translations st    ON st.story_id = s.id AND st.lang_code = ?
    LEFT JOIN story_translations st_tr ON st_tr.story_id = s.id AND st_tr.lang_code = 'tr'
    LEFT JOIN story_conversation_variants scv    ON scv.story_id = s.id AND scv.lang_code = ?
    LEFT JOIN story_conversation_variants scv_tr ON scv_tr.story_id = s.id AND scv_tr.lang_code = 'tr'
    LEFT JOIN book_translations bt    ON bt.book_id = b.id AND bt.lang_code = ?
    LEFT JOIN book_translations bt_tr ON bt_tr.book_id = b.id AND bt_tr.lang_code = 'tr'
    WHERE
      LOWER(COALESCE(NULLIF(st.title, ''), st_tr.title, '')) LIKE ?
      OR LOWER(COALESCE(NULLIF(st.content, ''), st_tr.content, '')) LIKE ?
      OR LOWER(COALESCE(NULLIF(st.description, ''), st_tr.description, '')) LIKE ?
      OR LOWER(COALESCE(NULLIF(st.hook, ''), st_tr.hook, '')) LIKE ?
      OR LOWER(COALESCE(NULLIF(bt.title, ''), bt_tr.title, '')) LIKE ?
      OR LOWER(COALESCE(ct.translation, ct_tr.translation, c.category_name, '')) LIKE ?
      OR LOWER(COALESCE(sub.subcategory_name, '')) LIKE ?
    ORDER BY rank_title ASC, rank_body ASC, rank_source ASC, s.sort_order ASC
    LIMIT ${safeLimit}
  `, [
    likeQuery,
    likeQuery,
    likeQuery,
    lang,
    lang,
    lang,
    lang,
    likeQuery,
    likeQuery,
    likeQuery,
    likeQuery,
    likeQuery,
    likeQuery,
    likeQuery,
  ]);

  return rows.map((r) => ({
    ...r,
    story_id: String(r.id),
    title: r.title || '',
    body: r.body || '',
    hook: r.hook || '',
    thirty_sec: r.thirty_sec || '',
  }));
};

/**
 * Returns all unique categories from the book_translations table.
 */
export const getCategoriesFromDb = async (lang = 'tr') => {
  await waitForData();
  const db = getDb();
  const rows = await db.getAllAsync(`
    SELECT DISTINCT
      sub.subcategory_name AS cat
    FROM subcategories sub
    INNER JOIN books b ON b.category_id = sub.id
    ORDER BY cat
  `);
  return rows.map(r => r.cat);
};

/**
 * Returns parent categories with their details.
 */
export const getParentCategories = async (lang = 'tr') => {
  await waitForData();
  const db = getDb();
  return await db.getAllAsync(`
    SELECT 
      c.id,
      COALESCE(ct.translation, ct_tr.translation, c.category_name) AS name,
      c.category_name AS raw_name,
      COUNT(DISTINCT b.id) as count
    FROM categories c
    LEFT JOIN categories_translations ct ON ct.category_id = c.id AND ct.language = ?
    LEFT JOIN categories_translations ct_tr ON ct_tr.category_id = c.id AND ct_tr.language = 'tr'
    LEFT JOIN subcategories sub ON sub.categori_id = c.id
    LEFT JOIN books b ON b.category_id = sub.id
    GROUP BY c.id
    ORDER BY c.[order] ASC
  `, [lang]);
};

/**
 * Returns all sub-categories belonging to a parent category.
 */
export const getSubCategoriesByParent = async (parentCatId) => {
  await waitForData();
  const db = getDb();
  const rows = await db.getAllAsync(
    'SELECT subcategory_name FROM subcategories WHERE categori_id = ?',
    [parentCatId]
  );
  return rows.map(r => r.subcategory_name);
};

/**
 * Returns the parent category for a given sub-category.
 */
export const getParentForSubCategory = async (subName) => {
  await waitForData();
  const db = getDb();
  const row = await db.getFirstAsync(`
    SELECT c.category_name AS parent_category
    FROM subcategories sub
    JOIN categories c ON c.id = sub.categori_id
    WHERE sub.subcategory_name = ?
  `, [subName]);
  return row ? row.parent_category : null;
};

/**
 * Returns book info for a given book id in the requested language.
 */
export const getBookForLang = async (bookId, lang = 'tr') => {
  await waitForData();
  if (!bookId) return null;
  const db = getDb();

  const bt = await db.getFirstAsync(`
    SELECT
      b.id, b.publish_year,
      COALESCE(NULLIF(bt.title, ''),         bt_tr.title,  '')  AS title,
      COALESCE(NULLIF(b.author, ''),         '')               AS author,
      COALESCE(NULLIF(st_desc.description, ''), '')            AS summary,
      sub.subcategory_name AS category
    FROM books b
    LEFT JOIN subcategories sub ON sub.id = b.category_id
    LEFT JOIN book_translations bt    ON bt.book_id = b.id AND bt.lang_code = ?
    LEFT JOIN book_translations bt_tr ON bt_tr.book_id = b.id AND bt_tr.lang_code = 'tr'
    LEFT JOIN story_translations st_desc ON st_desc.story_id = (SELECT id FROM stories WHERE book_no = b.list_no LIMIT 1) AND st_desc.lang_code = ?
    WHERE b.id = ?
  `, [lang, lang, bookId]);

  if (!bt) return null;

  let links = await db.getAllAsync(
    'SELECT platform, url FROM book_links WHERE book_id = ?',
    [bookId]
  );

  const linksMap = {};
  (links || []).forEach(l => { linksMap[l.platform] = l.url; });

  return { ...bt, links: linksMap };
};

// ──────────────────────────────────────────────────────
//  USER CATEGORY HELPERS (unchanged interface)
// ──────────────────────────────────────────────────────
export const getSelectedCategories = async (userId = 'default') => {
  await waitForData();
  try {
    const db = getDb();
    const result = await db.getAllAsync(
      'SELECT category_id FROM user_selected_categories WHERE user_id = ? ORDER BY category_id ASC',
      [userId]
    );
    return result
      .map((row) => normalizeCategoryId(row.category_id))
      .filter(Boolean);
  } catch (error) {
    return [];
  }
}

export const setSelectedCategories = async (userId = 'default', list) => {
  await waitForDb();
  try {
    const db = getDb();
    const categoryIds = await resolveCategoryIds(db, list);
    await db.runAsync('DELETE FROM user_selected_categories WHERE user_id = ?', [userId]);
    if (categoryIds.length > 0) {
      for (const categoryId of categoryIds) {
        await db.runAsync(
          'INSERT OR REPLACE INTO user_selected_categories (user_id, category_id) VALUES (?, ?)',
          [userId, categoryId]
        );
      }
    }
  } catch (error) {
    // ignore
  }
}

export const toggleSelectedCategory = async (userId = 'default', category) => {
  await waitForDb();
  const db = getDb();
  const categoryId = await resolveCategoryId(db, category);
  if (!categoryId) return await getSelectedCategories(userId);
  const current = await getSelectedCategories(userId)
  let next
  if (current.includes(categoryId)) next = current.filter(c => c !== categoryId)
  else next = [...current, categoryId]
  await setSelectedCategories(userId, next)
  return next
}

// ─────────────────────────────────────────────
//  Reading stats — powered by user_reads table
// ─────────────────────────────────────────────

export const recordRead = async (storyId, userId = 'default') => {
  await waitForDb();
  const db = getDb();
  const now = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  await db.runAsync(
    `INSERT OR REPLACE INTO user_reads (user_id, story_id, read_at) VALUES (?, ?, ?)`,
    [userId, String(storyId), now]
  );
};

export const getTotalReads = async (userId = 'default') => {
  await waitForDb();
  const db = getDb();
  const row = await db.getFirstAsync(
    `SELECT COUNT(*) as cnt FROM user_reads WHERE user_id = ?`,
    [userId]
  );
  return row?.cnt || 0;
};

export const getTodayReadsCount = async (userId = 'default') => {
  await waitForDb();
  const db = getDb();
  const today = new Date().toISOString().split('T')[0];
  const row = await db.getFirstAsync(
    `SELECT COUNT(*) as cnt FROM user_reads WHERE user_id = ? AND read_at = ?`,
    [userId, today]
  );
  return row?.cnt || 0;
};

export const getReadHistory = async (days = 90, userId = 'default') => {
  await waitForDb();
  const db = getDb();
  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceStr = since.toISOString().split('T')[0];
  const rows = await db.getAllAsync(
    `SELECT read_at AS day, COUNT(*) AS cnt
     FROM user_reads
     WHERE user_id = ? AND read_at >= ?
     GROUP BY read_at
     ORDER BY read_at`,
    [userId, sinceStr]
  );
  // Build a map: date → count
  const map = {};
  for (const r of rows) map[r.day] = r.cnt;
  // Fill all days in range
  const result = [];
  const cursor = new Date(sinceStr);
  const today = new Date().toISOString().split('T')[0];
  while (cursor.toISOString().split('T')[0] <= today) {
    const d = cursor.toISOString().split('T')[0];
    result.push({ day: d, count: map[d] || 0 });
    cursor.setDate(cursor.getDate() + 1);
  }
  return result;
};

const getStreakProtectedDays = async (userId = 'default') => {
  await waitForDb();
  const db = getDb();
  const rows = await db.getAllAsync(
    `SELECT freeze_date AS day FROM user_streak_freezes WHERE user_id = ? ORDER BY freeze_date`,
    [userId]
  );
  return rows.map((row) => row.day).filter(Boolean);
};

export const recordStreakFreeze = async (dateStr, userId = 'default') => {
  await waitForDb();
  const db = getDb();
  const freezeDate = dateStr || new Date().toISOString().split('T')[0];
  const usedAt = new Date().toISOString();
  await db.runAsync(
    `INSERT OR IGNORE INTO user_streak_freezes (user_id, freeze_date, used_at) VALUES (?, ?, ?)`,
    [userId, freezeDate, usedAt]
  );
};

export const getStreakFreezes = async (userId = 'default') => {
  await waitForDb();
  const db = getDb();
  const rows = await db.getAllAsync(
    `SELECT freeze_date AS day, used_at AS usedAt FROM user_streak_freezes WHERE user_id = ? ORDER BY freeze_date DESC`,
    [userId]
  );
  return rows;
};

export const clearStreakFreezes = async (userId = 'default') => {
  await waitForDb();
  const db = getDb();
  await db.runAsync(`DELETE FROM user_streak_freezes WHERE user_id = ?`, [userId]);
};

// Wipes all reading records for a user. The progress stats (total reads,
// streak, longest streak, category breakdown, today's reads) are all derived
// from the user_reads table, so this must be called on a full data reset —
// otherwise progress survives the reset.
export const clearUserReads = async (userId = 'default') => {
  await waitForDb();
  const db = getDb();
  await db.runAsync(`DELETE FROM user_reads WHERE user_id = ?`, [userId]);
  await db.runAsync(`DELETE FROM user_likes WHERE user_id = ?`, [userId]);
};

export const getStreak = async (userId = 'default') => {
  await waitForDb();
  const db = getDb();
  // Get distinct reading days ordered descending
  const readRows = await db.getAllAsync(
    `SELECT DISTINCT read_at AS day FROM user_reads WHERE user_id = ? ORDER BY read_at DESC`,
    [userId]
  );
  const protectedDays = await getStreakProtectedDays(userId);
  const rows = Array.from(new Set([...readRows.map((row) => row.day), ...protectedDays]))
    .filter(Boolean)
    .sort((a, b) => (a < b ? 1 : -1))
    .map((day) => ({ day }));
  if (rows.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const firstDay = new Date(rows[0].day + 'T00:00:00');
  // Streak counts only if the most recent read is today or yesterday
  if (firstDay < yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < rows.length; i++) {
    const prev = new Date(rows[i - 1].day + 'T00:00:00');
    const curr = new Date(rows[i].day + 'T00:00:00');
    const diff = (prev - curr) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
};

export const getLongestStreak = async (userId = 'default') => {
  await waitForDb();
  const db = getDb();
  const readRows = await db.getAllAsync(
    `SELECT DISTINCT read_at AS day FROM user_reads WHERE user_id = ? ORDER BY read_at ASC`,
    [userId]
  );
  const protectedDays = await getStreakProtectedDays(userId);
  const rows = Array.from(new Set([...readRows.map((row) => row.day), ...protectedDays]))
    .filter(Boolean)
    .sort()
    .map((day) => ({ day }));
  if (rows.length === 0) return 0;

  let longest = 1;
  let current = 1;
  for (let i = 1; i < rows.length; i++) {
    const prev = new Date(rows[i - 1].day + 'T00:00:00');
    const curr = new Date(rows[i].day + 'T00:00:00');
    const diff = (curr - prev) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      current++;
      if (current > longest) longest = current;
    } else {
      current = 1;
    }
  }
  return longest;
};

export const getReadsPerCategory = async (userId = 'default') => {
  await waitForDb();
  const db = getDb();
  try {
    const rows = await db.getAllAsync(
      `SELECT c.category_name AS cat, COUNT(*) AS cnt
       FROM user_reads ur
       JOIN stories s ON s.id = ur.story_id
       JOIN books b ON b.list_no = s.book_no
       JOIN subcategories sub ON sub.id = b.category_id
       JOIN categories c ON c.id = sub.categori_id
       WHERE ur.user_id = ?
       GROUP BY c.category_name`,
      [userId]
    );
    const map = {};
    for (const r of rows) map[r.cat] = r.cnt;
    return map;
  } catch (e) {
    console.error('getReadsPerCategory error:', e);
    return {};
  }
};

export const getReadCountsByStory = async (userId = 'default') => {
  await waitForDb();
  const db = getDb();
  try {
    const rows = await db.getAllAsync(
      `SELECT story_id, COUNT(*) AS cnt
       FROM user_reads
       WHERE user_id = ?
       GROUP BY story_id`,
      [userId]
    );
    const map = {};
    for (const row of rows) {
      map[String(row.story_id)] = row.cnt || 0;
    }
    return map;
  } catch (error) {
    console.error('getReadCountsByStory error:', error);
    return {};
  }
};

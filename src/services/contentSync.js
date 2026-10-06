// contentSync — pulls the content catalogue (stories, translations, variants,
// books, categories) from Supabase into the local SQLite DB.
//
// Supabase is the source of truth for WHICH stories are active: after a sync,
// every local story that is not active on the server is hidden
// (stories.is_active = 0). The bundled DB stays the offline fallback, so the
// app still works on first launch without a connection.
//
// A sync only runs when the server's content_seed_versions('catalog') is newer
// than the version this device last applied; scripts/supabase/import-content.mjs
// bumps it after every upload.
import { supabase, SUPABASE_LIVE } from './supabase';
import { getDb, waitForDb } from '../db/db';

const LOCAL_SEED_KEY = 'supabase_catalog';
const PAGE = 1000;

const fetchAll = async (table, columns) => {
  const rows = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from(table)
      .select(columns)
      .order(table === 'story_conversation_variants' ? 'story_id' : 'id')
      .range(from, from + PAGE - 1);
    if (error) throw new Error(`${table}: ${error.message}`);
    rows.push(...data);
    if (data.length < PAGE) return rows;
  }
};

const getRemoteCatalogVersion = async () => {
  const { data, error } = await supabase
    .from('content_seed_versions')
    .select('version')
    .eq('seed_key', 'catalog')
    .maybeSingle();
  if (error) throw new Error(`content_seed_versions: ${error.message}`);
  return Number(data?.version || 0);
};

const getLocalCatalogVersion = async (db) => {
  const row = await db.getFirstAsync(
    'SELECT version FROM content_seed_versions WHERE seed_key = ?',
    [LOCAL_SEED_KEY]
  );
  return Number(row?.version || 0);
};

// INSERT OR REPLACE for tables whose rows are fully owned by the server.
const replaceRows = async (db, table, columns, rows) => {
  if (!rows.length) return;
  const quoted = columns.map((c) => `"${c}"`).join(', ');
  const statement = await db.prepareAsync(
    `INSERT OR REPLACE INTO ${table} (${quoted}) VALUES (${columns.map(() => '?').join(', ')})`
  );
  try {
    for (const row of rows) await statement.executeAsync(columns.map((c) => row[c] ?? null));
  } finally {
    await statement.finalizeAsync();
  }
};

/**
 * @returns {Promise<{ changed: boolean, stories?: number }>}
 */
export const syncContentFromSupabase = async () => {
  if (!SUPABASE_LIVE) return { changed: false };
  await waitForDb();
  const db = getDb();

  const remoteVersion = await getRemoteCatalogVersion();
  if (remoteVersion === 0 || remoteVersion <= (await getLocalCatalogVersion(db))) {
    return { changed: false };
  }

  // RLS only exposes active stories (and their translations/variants).
  const [
    mainCategories, subCategories, categories, categoryLabels, subcategories,
    books, bookTranslations, stories, storyTranslations, variants,
  ] = await Promise.all([
    fetchAll('main_categories', 'id, name_tr, name_en, name_de, name_es'),
    fetchAll('sub_categories', 'id, main_category_id, name_tr, name_en, name_de, name_es'),
    fetchAll('categories', '*'), // `order` is a reserved word in PostgREST selects
    fetchAll('categories_translations', 'id, category_id, language, translation'),
    fetchAll('subcategories', 'id, categori_id, subcategory_name'),
    fetchAll('books', 'id, list_no, author, publish_year, category_id, sub_category_id'),
    fetchAll('book_translations', 'id, book_id, lang_code, title, category_name'),
    fetchAll('stories', 'id, book_no, version, current_read_minutes, possible_read_minutes, target_word_count, target_word_tolerance'),
    fetchAll('story_translations', 'story_id, lang_code, title, description, content, hook, one_minute_summary'),
    fetchAll('story_conversation_variants', 'story_id, lang_code, punchline, thirty_sec, question, key_contrast'),
  ]);

  // An empty catalogue almost certainly means a broken upload — never let it
  // hide every story on the device.
  if (!stories.length) return { changed: false };

  await db.withTransactionAsync(async () => {
    await replaceRows(db, 'main_categories', ['id', 'name_tr', 'name_en', 'name_de', 'name_es'], mainCategories);
    await replaceRows(db, 'sub_categories', ['id', 'main_category_id', 'name_tr', 'name_en', 'name_de', 'name_es'], subCategories);
    await replaceRows(db, 'categories', ['id', 'category_name', 'order'], categories);
    await replaceRows(db, 'categories_translations', ['id', 'category_id', 'language', 'translation'], categoryLabels);
    await replaceRows(db, 'subcategories', ['id', 'categori_id', 'subcategory_name'], subcategories);
    await replaceRows(db, 'books', ['id', 'list_no', 'author', 'publish_year', 'category_id', 'sub_category_id'], books);
    await replaceRows(db, 'book_translations', ['id', 'book_id', 'lang_code', 'title', 'category_name'], bookTranslations);

    // Stories: keep device-only columns (sort_order, thirty_sec) on existing
    // rows; new rows get the next free sort_order (it has a UNIQUE index).
    const upsertStory = await db.prepareAsync(`
      INSERT INTO stories (id, book_no, version, current_read_minutes, possible_read_minutes,
                           target_word_count, target_word_tolerance, is_active, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM stories))
      ON CONFLICT(id) DO UPDATE SET
        book_no = excluded.book_no,
        version = excluded.version,
        current_read_minutes = excluded.current_read_minutes,
        possible_read_minutes = excluded.possible_read_minutes,
        target_word_count = excluded.target_word_count,
        target_word_tolerance = excluded.target_word_tolerance,
        is_active = 1
    `);
    try {
      for (const s of stories) {
        await upsertStory.executeAsync([
          s.id, s.book_no, s.version, s.current_read_minutes, s.possible_read_minutes,
          s.target_word_count, s.target_word_tolerance,
        ]);
      }
    } finally {
      await upsertStory.finalizeAsync();
    }

    // Local story_translations has no UNIQUE(story_id, lang_code): replace by key.
    const deleteTranslation = await db.prepareAsync(
      'DELETE FROM story_translations WHERE story_id = ? AND lang_code = ?'
    );
    const insertTranslation = await db.prepareAsync(`
      INSERT INTO story_translations (story_id, lang_code, title, description, content, hook, one_minute_summary)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    try {
      for (const t of storyTranslations) {
        await deleteTranslation.executeAsync([t.story_id, t.lang_code]);
        await insertTranslation.executeAsync([
          t.story_id, t.lang_code, t.title, t.description, t.content, t.hook, t.one_minute_summary,
        ]);
      }
    } finally {
      await deleteTranslation.finalizeAsync();
      await insertTranslation.finalizeAsync();
    }

    await replaceRows(db, 'story_conversation_variants',
      ['story_id', 'lang_code', 'punchline', 'thirty_sec', 'question', 'key_contrast'], variants);

    // Server decides what is visible.
    const activeIds = stories.map((s) => Number(s.id)).filter(Number.isFinite);
    await db.runAsync(
      `UPDATE stories SET is_active = CASE WHEN id IN (${activeIds.join(',')}) THEN 1 ELSE 0 END`
    );

    await db.runAsync(
      'INSERT OR REPLACE INTO content_seed_versions (seed_key, version, applied_at) VALUES (?, ?, ?)',
      [LOCAL_SEED_KEY, remoteVersion, new Date().toISOString()]
    );
  });

  return { changed: true, stories: stories.length };
};

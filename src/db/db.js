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
//  SCHEMA
// ──────────────────────────────────────────────────────
export const initDb = async () => {
  try {
    const dbDir = FileSystem.documentDirectory + 'SQLite';
    const dbPath = dbDir + '/kivilcim.db';

    // Klasörü kontrol et ve oluştur
    const dirInfo = await FileSystem.getInfoAsync(dbDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(dbDir, { intermediates: true });
    }

    // Admin DB dosyasının cihazda henüz var olup olmadığını kontrol et
    const dbInfo = await FileSystem.getInfoAsync(dbPath);
    if (!dbInfo.exists) {
      console.log('Admin DB kopyalanıyor...');
      const asset = Asset.fromModule(require('../../assets/kivilcim.db'));
      
      // Asset uri bazen null dönebilir, güvenli olan direkt downloadAsync kullanmaktır.
      await FileSystem.downloadAsync(asset.uri, dbPath);
      console.log('Admin DB başarıyla cihaza kopyalandı.');
    }

    // Dosyayı cihazın dizinine yerleştirdikten sonra açabiliriz
    const db = getDb();
    
    // Kullanıcı ile ilgili verilerin (beğeniler, okunanlar vb.) tutulduğu tabloların
    // Admin DB'sinde var olduğundan veya her ihtimale karşı yaratıldığından emin olalım:
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS user_selected_categories (
        user_id TEXT,
        category TEXT,
        PRIMARY KEY(user_id, category)
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
    `);

  } catch (error) {
    console.error('Veritabanı başlatma hatası:', error);
  } finally {
    _dbReady = true;
    if (_dbReadyResolve) _dbReadyResolve();
  }
}

// ──────────────────────────────────────────────────────
//  SEED DATA  (reads JSON files once → populates DB)
// ──────────────────────────────────────────────────────

export const seedData = async () => {
  await waitForDb();

  try {
    // Admin veritabanı doğrudan yüklendiği için artık stories.json'dan manuel ekleme yapmamıza gerek yok.
    // Bu fonksiyon geriye dönük uyumluluk ve arayüz sözleşmesi için bırakılmıştır.
    console.log('Admin DB kullanıldığı için JSON-seed işlemi atlanıyor.');
  } catch (error) {
    console.error('db.js seedData error:', error);
  } finally {
    _dataReady = true;
    if (_dataReadyResolve) _dataReadyResolve();
  }
}

// ──────────────────────────────────────────────────────
//  QUERY FUNCTIONS (language-aware)
// ──────────────────────────────────────────────────────

/**
 * Returns all stories with translations for the given language.
 * Falls back to Turkish ('tr') if the requested translation is missing.
 */
export const getStoriesForLang = async (lang = 'tr') => {
  await waitForData();
  const db = getDb();
  const rows = await db.getAllAsync(`
    SELECT
      s.id,
      s.story_id,
      s.cat,
      s.min,
      s.publish_date AS publishDate,
      s.author,
      s.source_book_id,
      COALESCE(NULLIF(st.title, ''),   st_tr.title,  '')  AS title,
      COALESCE(NULLIF(st.body, ''),    st_tr.body,   '')  AS body,
      COALESCE(NULLIF(st.description, ''), st_tr.description, '') AS description,
      COALESCE(NULLIF(st.lesson, ''),  st_tr.lesson, '')  AS lesson,
      COALESCE(NULLIF(st.quote, ''),   st_tr.quote,  '')  AS quote,
      COALESCE(NULLIF(st.reflection, ''), st_tr.reflection, '') AS reflection,
      COALESCE(NULLIF(st.src, ''),     st_tr.src,    '')  AS src,
      COALESCE(NULLIF(st.source_book_name, ''), st_tr.source_book_name, '') AS source_book,
      COALESCE(NULLIF(st.cat_display, ''), st_tr.cat_display, s.cat) AS cat_display
    FROM stories s
    LEFT JOIN story_translations st    ON st.story_id = s.id AND st.lang = ?
    LEFT JOIN story_translations st_tr ON st_tr.story_id = s.id AND st_tr.lang = 'tr'
    ORDER BY s.publish_date DESC
  `, [lang]);

  // COALESCE handles empty strings too — filter those out
  return rows.map(r => ({
    ...r,
    title: r.title || '',
    body: r.body || '',
    source_book: r.source_book || '',
  }));
};

/**
 * Returns all unique categories from the stories table.
 */
export const getCategoriesFromDb = async () => {
  await waitForData();
  const db = getDb();
  const rows = await db.getAllAsync(
    "SELECT DISTINCT cat FROM stories WHERE cat != '' ORDER BY cat"
  );
  return rows.map(r => r.cat);
};

/**
 * Returns book info for a given book id in the requested language.
 */
export const getBookForLang = async (bookId, lang = 'tr') => {
  await waitForData();
  if (!bookId) return null;
  const db = getDb();

  // Book translation
  const bt = await db.getFirstAsync(`
    SELECT
      b.id, b.publish_year,
      COALESCE(NULLIF(bt.title, ''),   bt_tr.title,  '')  AS title,
      COALESCE(NULLIF(bt.author, ''),  bt_tr.author, '')  AS author,
      COALESCE(NULLIF(bt.summary, ''), bt_tr.summary,'')  AS summary,
      COALESCE(NULLIF(bt.category, ''),bt_tr.category,'') AS category
    FROM books b
    LEFT JOIN book_translations bt    ON bt.book_id = b.id AND bt.lang = ?
    LEFT JOIN book_translations bt_tr ON bt_tr.book_id = b.id AND bt_tr.lang = 'tr'
    WHERE b.id = ?
  `, [lang, bookId]);

  if (!bt) return null;

  // Book links for this language (with fallback to tr)
  let links = await db.getAllAsync(
    'SELECT platform, url FROM book_links WHERE book_id = ? AND lang = ?',
    [bookId, lang]
  );
  if (!links || links.length === 0) {
    links = await db.getAllAsync(
      'SELECT platform, url FROM book_links WHERE book_id = ? AND lang = ?',
      [bookId, 'tr']
    );
  }

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
      'SELECT category FROM user_selected_categories WHERE user_id = ?',
      [userId]
    );
    return result.map(row => row.category);
  } catch (error) {
    return [];
  }
}

export const setSelectedCategories = async (userId = 'default', list) => {
  await waitForDb();
  try {
    const db = getDb();
    await db.runAsync('DELETE FROM user_selected_categories WHERE user_id = ?', [userId]);
    if (Array.isArray(list) && list.length) {
      const unique = [...new Set(list)];
      for (const category of unique) {
        await db.runAsync(
          'INSERT OR REPLACE INTO user_selected_categories (user_id, category) VALUES (?, ?)',
          [userId, category]
        );
      }
    }
  } catch (error) {
    // ignore
  }
}

export const toggleSelectedCategory = async (userId = 'default', category) => {
  await waitForDb();
  const current = await getSelectedCategories(userId)
  let next
  if (current.includes(category)) next = current.filter(c => c !== category)
  else next = [...current, category]
  await setSelectedCategories(userId, next)
  return next
}

// Expo SQLite DB wrapper for offline data (Updated for SDK 54)
import * as SQLite from 'expo-sqlite'

const db = SQLite.openDatabaseSync('kivilcim.db')

export const initDb = async () => {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        book_id TEXT UNIQUE,
        title_en TEXT,
        title_tr TEXT
      );
      CREATE TABLE IF NOT EXISTS stories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        story_id TEXT UNIQUE,
        cat TEXT,
        min INTEGER,
        title_en TEXT,
        title_tr TEXT,
        body_en TEXT,
        body_tr TEXT,
        lesson TEXT,
        quote TEXT,
        src TEXT,
        publishDate TEXT,
        source_book_id TEXT,
        links_json TEXT
      );
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
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Database initialization failed:", error);
    throw error;
  }
}

export const getSelectedCategories = async (userId = 'default') => {
  try {
    const result = await db.getAllAsync(
      'SELECT category FROM user_selected_categories WHERE user_id = ?',
      [userId]
    );
    return result.map(row => row.category);
  } catch (error) {
    console.error("Error getting selected categories:", error);
    return [];
  }
}

export const setSelectedCategories = async (userId = 'default', list) => {
  try {
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
    console.error("Error setting selected categories:", error);
  }
}

export const toggleSelectedCategory = async (userId = 'default', category) => {
  const current = await getSelectedCategories(userId)
  let next
  if (current.includes(category)) next = current.filter(c => c !== category)
  else next = [...current, category]
  await setSelectedCategories(userId, next)
  return next
}

export const seedData = async () => {
  let storiesData = []
  try {
    storiesData = require('../../data/stories.json')
  } catch (e) {
    // ignore if not present
  }

  try {
    // Clear old data first
    await db.execAsync(`
      DELETE FROM stories;
      DELETE FROM books;
    `);

    if (Array.isArray(storiesData)) {
      for (const [idx, s] of storiesData.entries()) {
        const story_id = s?.id ?? `story_${idx}`;
        const cat = s?.cat ?? '';
        const min = s?.min ?? 0;
        const title_en = s?.title ?? '';
        const title_tr = s?.title ?? '';
        const body_en = s?.body ?? '';
        const body_tr = s?.body ?? '';
        const lesson = s?.lesson ?? '';
        const quote = s?.quote ?? '';
        const src = s?.src ?? '';
        const publishDate = s?.publishDate ?? '';
        const source_book_id = s?.source_book ?? null;
        const links_json = JSON.stringify(s?.links ?? {});
        await db.runAsync(
          'INSERT OR IGNORE INTO stories (story_id, cat, min, title_en, title_tr, body_en, body_tr, lesson, quote, src, publishDate, source_book_id, links_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [story_id, cat, min, title_en, title_tr, body_en, body_tr, lesson, quote, src, publishDate, source_book_id, links_json]
        );
      }
    }
    console.log(`Data seeding completed: ${storiesData.length} stories`);
  } catch (error) {
    console.error("Data seeding failed:", error);
  }
}


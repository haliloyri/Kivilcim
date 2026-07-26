/**
 * storiesCache.js
 * AsyncStorage cache for Supabase-fetched stories.
 *
 * Strategy:
 *   - After a successful Supabase fetch, save stories to cache.
 *   - When Supabase is unreachable, serve from cache (up to TTL).
 *   - SQLite is the last-resort fallback (always available, but may be older data).
 *
 * Cache is keyed per-language so switching languages doesn't invalidate other langs.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_PREFIX = '@kivilcim_stories_cache_';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Persist stories for a language to AsyncStorage.
 * Fire-and-forget — call without await from the happy path.
 *
 * @param {string} lang — e.g. 'tr' | 'en' | 'de' | 'es'
 * @param {object[]} stories — mapped story objects (same shape as getStoriesForLang)
 */
export const saveStoriesToCache = async (lang, stories) => {
  try {
    const payload = JSON.stringify({ ts: Date.now(), stories });
    await AsyncStorage.setItem(CACHE_PREFIX + lang, payload);
  } catch (e) {
    console.warn('[storiesCache] save failed:', e.message);
  }
};

/**
 * Load cached stories for a language.
 * Returns null if cache is missing, corrupt, or older than TTL unless a caller
 * explicitly asks to use stale content while offline.
 *
 * @param {string} lang
 * @returns {Promise<object[]|null>}
 */
export const loadStoriesFromCache = async (lang, { allowStale = false } = {}) => {
  try {
    const raw = await AsyncStorage.getItem(CACHE_PREFIX + lang);
    if (!raw) return null;

    const { ts, stories } = JSON.parse(raw);
    if (!stories || !Array.isArray(stories) || stories.length === 0) return null;
    if (Date.now() - ts > CACHE_TTL_MS && !allowStale) return null;
    return stories;
  } catch (e) {
    console.warn('[storiesCache] load failed:', e.message);
    return null;
  }
};

/**
 * Wipe all language caches (e.g. on logout or force-refresh).
 */
export const clearStoriesCache = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter((k) => k.startsWith(CACHE_PREFIX));
    if (cacheKeys.length > 0) await AsyncStorage.multiRemove(cacheKeys);
  } catch (e) {
    console.warn('[storiesCache] clear failed:', e.message);
  }
};

// StoriesContext — loads stories from the bundled SQLite DB. The Supabase
// refresh only runs when EXPO_PUBLIC_STORIES_SOURCE=supabase (see featureFlags).
// Refreshes automatically when the language changes.
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useTheme } from './ThemeContext';
import { getStoriesForLang, getCategoriesFromDb, getParentCategories, waitForData } from '../db/db';
import { SUPABASE_LIVE, fetchStoriesFromSupabase } from '../services/supabase';
import { saveStoriesToCache, loadStoriesFromCache, clearStoriesCache } from '../services/storiesCache';
import { STORIES_SOURCE } from '../config/featureFlags';
import { cleanCategoryLabel } from '../utils/categoryImages';

const USE_REMOTE_STORIES = STORIES_SOURCE === 'supabase';
// In local mode the AsyncStorage cache only holds stale Supabase copies; drop it once.
let staleCacheCleared = false;

const StoriesContext = createContext();

/**
 * Derive categories and parentCategories from a flat mapped stories array.
 * Used when stories come from Supabase (which has no separate category tables).
 */
const deriveCategories = (stories) => {
  const catsSet = new Set();
  const parentMap = {};

  for (const s of stories) {
    if (s.cat) catsSet.add(s.cat);
    const pid = s.parent_cat_id;
    if (pid != null) {
      if (!parentMap[pid]) {
        parentMap[pid] = { id: pid, name: s.parent_cat ?? '', raw_name: s.parent_cat_raw ?? '', count: 0 };
      }
      parentMap[pid].count++;
    }
  }

  const categories = Array.from(catsSet).sort();
  const parentCategories = Object.values(parentMap).sort((a, b) => a.id - b.id);
  return { categories, parentCategories };
};

const cleanStoryCategoryLabels = (stories = []) => stories.map((story) => ({
  ...story,
  parent_cat: cleanCategoryLabel(story.parent_cat),
  cat: cleanCategoryLabel(story.cat),
}));

export const StoriesProvider = ({ children }) => {
  const { lang } = useTheme();
  const [stories, setStories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  const [contentLang, setContentLang] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [storiesSource, setStoriesSource] = useState('sqlite'); // 'supabase' | 'cache' | 'sqlite'
  const [isOffline, setIsOffline] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);

    const applyStories = (nextStories, source) => {
      const cleanedStories = cleanStoryCategoryLabels(nextStories);
      const orderedStories = [...cleanedStories].sort(
        (a, b) =>
          Number(b.min ?? b.possible_read_minutes ?? 1) - Number(a.min ?? a.possible_read_minutes ?? 1) ||
          Number(b.story_id ?? b.id) - Number(a.story_id ?? a.id)
      );
      const { categories: cats, parentCategories: parents } = deriveCategories(orderedStories);
      setStories(orderedStories);
      setCategories(cats);
      setParentCategories(parents);
      setStoriesSource(source);
    };

    // Render the latest local content first. This deliberately accepts a stale
    // cache: readers should still be able to browse on a flight or weak signal.
    let hasLocalStories = false;
    if (!USE_REMOTE_STORIES && !staleCacheCleared) {
      staleCacheCleared = true;
      clearStoriesCache().catch(() => {});
    }
    if (USE_REMOTE_STORIES) {
      try {
        const cached = await loadStoriesFromCache(lang, { allowStale: true });
        if (cached?.length) {
          applyStories(cached, 'cache');
          hasLocalStories = true;
        }
      } catch (e) {
        console.warn('[StoriesContext] Cache load failed:', e.message);
      }
    }

    let sqliteStories = [];
    try {
      await waitForData();
      const [storiesList, catsList, parents] = await Promise.all([
        getStoriesForLang(lang),
        getCategoriesFromDb(lang),
        getParentCategories(lang),
      ]);
      sqliteStories = cleanStoryCategoryLabels(storiesList);
      if (!hasLocalStories) {
        setStories(sqliteStories);
        setCategories(catsList.map((category) => cleanCategoryLabel(category)));
        setParentCategories(parents.map((category) => ({
          ...category,
          name: cleanCategoryLabel(category.name),
        })));
        setStoriesSource('sqlite');
        hasLocalStories = storiesList.length > 0;
      }
      setContentLang(lang);
    } catch (e) {
      console.error('[StoriesContext] SQLite fallback error:', e);
    }
    setLoading(false);

    if (!USE_REMOTE_STORIES) {
      if (!hasLocalStories) setErrorMsg('No local stories available.');
      return;
    }

    let online = true;
    try {
      const state = await NetInfo.fetch();
      online = Boolean(state.isConnected) && state.isInternetReachable !== false;
    } catch (e) {
      // If the reachability check is unavailable, let the fetch decide.
      online = true;
    }
    setIsOffline(!online);
    if (!online || !SUPABASE_LIVE) {
      if (!hasLocalStories) setErrorMsg('No local stories available.');
      return;
    }

    // Refresh in the background once local content is already visible.
    try {
      const sbStories = await fetchStoriesFromSupabase(lang);
      if (sbStories?.length) {
        // Supabase updates matching stories, but does not hide collection
        // entries that exist only in the bundled SQLite database.
        const mergedStories = new Map(sqliteStories.map((story) => [String(story.story_id ?? story.id), story]));
        sbStories.forEach((story) => mergedStories.set(String(story.story_id ?? story.id), story));
        const nextStories = [...mergedStories.values()];
        saveStoriesToCache(lang, nextStories).catch(() => {});
        applyStories(nextStories, 'supabase');
      }
    } catch (e) {
      console.warn('[StoriesContext] Supabase refresh failed:', e.message);
      if (!hasLocalStories) setErrorMsg(e.message || String(e));
    }
  }, [lang]);

  // Reload when language changes
  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(() => ({
    stories,
    categories,
    parentCategories,
    contentLang,
    storiesLoading: loading,
    errorMsg,
    refreshStories: refresh,
    storiesSource,
    isOffline,
  }), [stories, categories, parentCategories, contentLang, loading, errorMsg, refresh, storiesSource, isOffline]);

  return (
    <StoriesContext.Provider value={value}>
      {children}
    </StoriesContext.Provider>
  );
};

export const useStories = () => {
  const context = useContext(StoriesContext);
  if (!context) {
    throw new Error('useStories must be used within a StoriesProvider');
  }
  return context;
};

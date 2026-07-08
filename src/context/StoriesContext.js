// StoriesContext — loads stories from Supabase (Supabase-first, SQLite fallback).
// Refreshes automatically when the language changes.
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useTheme } from './ThemeContext';
import { getStoriesForLang, getCategoriesFromDb, getParentCategories, waitForData } from '../db/db';
import { SUPABASE_LIVE, fetchStoriesFromSupabase } from '../services/supabase';
import { saveStoriesToCache, loadStoriesFromCache } from '../services/storiesCache';

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

export const StoriesProvider = ({ children }) => {
  const { lang } = useTheme();
  const [stories, setStories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [storiesSource, setStoriesSource] = useState('sqlite'); // 'supabase' | 'cache' | 'sqlite'

  const refresh = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);

    // 1. Try Supabase first
    if (SUPABASE_LIVE) {
      try {
        const sbStories = await fetchStoriesFromSupabase(lang);
        if (sbStories && sbStories.length > 0) {
          // Save to cache in the background — don't block the render
          saveStoriesToCache(lang, sbStories).catch(() => {});
          const { categories: cats, parentCategories: parents } = deriveCategories(sbStories);
          setStories(sbStories);
          setCategories(cats);
          setParentCategories(parents);
          setStoriesSource('supabase');
          setLoading(false);
          return;
        }
      } catch (e) {
        console.warn('[StoriesContext] Supabase fetch failed:', e.message);
      }
    }

    // 2. Try AsyncStorage cache (populated by a previous Supabase fetch)
    try {
      const cached = await loadStoriesFromCache(lang);
      if (cached && cached.length > 0) {
        const { categories: cats, parentCategories: parents } = deriveCategories(cached);
        setStories(cached);
        setCategories(cats);
        setParentCategories(parents);
        setStoriesSource('cache');
        setLoading(false);
        return;
      }
    } catch (e) {
      console.warn('[StoriesContext] Cache load failed:', e.message);
    }

    // 3. SQLite fallback
    try {
      await waitForData();
      const [storiesList, catsList, parents] = await Promise.all([
        getStoriesForLang(lang),
        getCategoriesFromDb(lang),
        getParentCategories(lang),
      ]);
      setStories(storiesList);
      setCategories(catsList);
      setParentCategories(parents);
      setStoriesSource('sqlite');
    } catch (e) {
      console.error('[StoriesContext] SQLite fallback error (all sources failed):', e);
      setErrorMsg(e.message || String(e));
    } finally {
      setLoading(false);
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
    storiesLoading: loading,
    errorMsg,
    refreshStories: refresh,
    storiesSource,
  }), [stories, categories, parentCategories, loading, errorMsg, refresh, storiesSource]);

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

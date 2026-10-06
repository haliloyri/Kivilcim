// StoriesContext — renders stories from the local SQLite DB, then (when
// STORIES_SOURCE is 'supabase', the default) syncs the catalogue from Supabase
// into SQLite and reloads if anything changed. Supabase decides which stories
// are active; the bundled DB is the offline fallback.
// Refreshes automatically when the language changes.
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useTheme } from './ThemeContext';
import { getStoriesForLang, getCategoriesFromDb, getParentCategories, waitForData } from '../db/db';
import { SUPABASE_LIVE } from '../services/supabase';
import { syncContentFromSupabase } from '../services/contentSync';
import { isOnline, onConnectivityChange } from '../services/connectivity';
import { clearStoriesCache } from '../services/storiesCache';
import { STORIES_SOURCE } from '../config/featureFlags';
import { cleanCategoryLabel } from '../utils/categoryImages';

const USE_REMOTE_STORIES = STORIES_SOURCE === 'supabase';
// The old AsyncStorage story cache is superseded by the SQLite sync; drop it once.
let staleCacheCleared = false;

const StoriesContext = createContext();

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
  // Set while the catalogue still has to be pulled (offline at launch or a
  // failed sync); the reconnect listener below retries it.
  const remoteSyncPending = useRef(false);
  const syncingRef = useRef(false);
  const loadFromSqliteRef = useRef(null);

  // Pull the catalogue into SQLite in the background; reload only on change.
  const syncRemote = useCallback(async () => {
    if (!USE_REMOTE_STORIES || !SUPABASE_LIVE || syncingRef.current) return;
    syncingRef.current = true;
    try {
      const { changed } = await syncContentFromSupabase();
      remoteSyncPending.current = false;
      if (changed && loadFromSqliteRef.current && (await loadFromSqliteRef.current())) setErrorMsg(null);
      setStoriesSource('supabase');
    } catch (e) {
      remoteSyncPending.current = true;
      throw e;
    } finally {
      syncingRef.current = false;
    }
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    if (!staleCacheCleared) {
      staleCacheCleared = true;
      clearStoriesCache().catch(() => {});
    }

    const loadFromSqlite = async () => {
      await waitForData();
      const [storiesList, catsList, parents] = await Promise.all([
        getStoriesForLang(lang),
        getCategoriesFromDb(lang),
        getParentCategories(lang),
      ]);
      setStories(cleanStoryCategoryLabels(storiesList));
      setCategories(catsList.map((category) => cleanCategoryLabel(category)));
      setParentCategories(parents.map((category) => ({
        ...category,
        name: cleanCategoryLabel(category.name),
      })));
      setContentLang(lang);
      return storiesList.length > 0;
    };

    loadFromSqliteRef.current = loadFromSqlite;

    // Render local content first so readers can browse offline / on weak signal.
    let hasLocalStories = false;
    try {
      hasLocalStories = await loadFromSqlite();
      setStoriesSource('sqlite');
    } catch (e) {
      console.error('[StoriesContext] SQLite load error:', e);
    }
    setLoading(false);

    if (!USE_REMOTE_STORIES || !SUPABASE_LIVE) {
      if (!hasLocalStories) setErrorMsg('No local stories available.');
      return;
    }

    const online = await isOnline();
    setIsOffline(!online);
    if (!online) {
      remoteSyncPending.current = true;
      if (!hasLocalStories) setErrorMsg('No local stories available.');
      return;
    }

    try {
      await syncRemote();
    } catch (e) {
      console.warn('[StoriesContext] Supabase sync failed:', e.message);
      if (!hasLocalStories) setErrorMsg(e.message || String(e));
    }
  }, [lang, syncRemote]);

  // Reload when language changes
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Keep isOffline current and pull the catalogue as soon as we reconnect.
  useEffect(() => onConnectivityChange((online) => {
    setIsOffline(!online);
    if (online && remoteSyncPending.current) {
      syncRemote().catch((e) => console.warn('[StoriesContext] Supabase sync failed:', e.message));
    }
  }), [syncRemote]);

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

// StoriesContext — loads stories from SQLite and provides them app-wide.
// Refreshes automatically when the language changes.
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useTheme } from './ThemeContext';
import { getStoriesForLang, getCategoriesFromDb, getParentCategories, waitForData } from '../db/db';

const StoriesContext = createContext();

export const StoriesProvider = ({ children }) => {
  const { lang } = useTheme();
  const [stories, setStories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
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
    } catch (e) {
      console.error('StoriesContext refresh error:', e);
      setErrorMsg(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }, [lang]);

  // Reload when language changes or DB becomes ready
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
  }), [stories, categories, parentCategories, loading, refresh]);

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

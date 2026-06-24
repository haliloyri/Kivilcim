import React, { createContext, useContext, useState, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, typography, layout } from '../theme/theme';

const ThemeContext = createContext();
const THEME_MODE_STORAGE_KEY = 'themeMode';
const LANGUAGE_STORAGE_KEY = 'lang';
const SELECTED_CATEGORIES_STORAGE_KEY = 'selectedCategories';

const normalizeCategoryIds = (list) => {
  if (!Array.isArray(list)) return [];
  return [...new Set(
    list
      .map((item) => Number(item))
      .filter((num) => Number.isFinite(num) && num > 0)
      .map((num) => Math.trunc(num))
  )];
};

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const getSystemThemeMode = () => (systemColorScheme === 'dark' ? 'dark' : 'light');
  // Determine default language from device locale using Intl
  const getDeviceLang = () => {
    try {
      const locale = Intl.DateTimeFormat().resolvedOptions().locale || '';
      const prefix = locale.substring(0, 2).toLowerCase();
      if (['tr', 'es', 'de'].includes(prefix)) return prefix;
      return 'en';
    } catch {
      return 'en';
    }
  };

  // Start as null — render nothing until AsyncStorage preferences are loaded
  const [themeMode, setThemeModeState] = useState(null);
  const [lang, setLangState] = useState(null);

  React.useEffect(() => {
    (async () => {
      try {
        const savedThemeMode = await AsyncStorage.getItem(THEME_MODE_STORAGE_KEY);
        if (savedThemeMode === 'light' || savedThemeMode === 'dark') {
          setThemeModeState(savedThemeMode);
        } else {
          setThemeModeState(getSystemThemeMode());
        }
      } catch (e) {
        setThemeModeState(getSystemThemeMode());
      }
    })();
  }, [systemColorScheme]);
  
  // Load saved language on mount; fall back to device locale
  React.useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (['tr', 'en', 'es', 'de'].includes(saved)) {
          setLangState(saved);
        } else {
          setLangState(getDeviceLang());
        }
      } catch (e) {
        setLangState(getDeviceLang());
      }
    })();
  }, []);
  const setLang = (l) => {
    const supported = ['tr', 'en', 'es', 'de'];
    if (supported.includes(l)) {
      setLangState(l);
      AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, l).catch(() => { });
    }
  };

  // --- Category selections (multi-select) ---
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Load persisted selections (Search both SQLite and AsyncStorage for migration/safety)
  React.useEffect(() => {
    (async () => {
      try {
        const { getSelectedCategories } = require('../db/db');
        const dbList = await getSelectedCategories();
        if (dbList && dbList.length > 0) {
          setSelectedCategories(normalizeCategoryIds(dbList));
          return;
        }

        const raw = await AsyncStorage.getItem(SELECTED_CATEGORIES_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            // Sync to DB
            const { setSelectedCategories: setDbList } = require('../db/db');
            await setDbList('default', parsed);
            const synced = await getSelectedCategories();
            setSelectedCategories(normalizeCategoryIds(synced));
          }
        }
      } catch (e) {
        console.error("ThemeContext category load error:", e);
      }
    })();
  }, []);

  const updateSelectedCategories = async (list) => {
    const normalized = normalizeCategoryIds(list);
    setSelectedCategories(normalized);
    try {
      await AsyncStorage.setItem(SELECTED_CATEGORIES_STORAGE_KEY, JSON.stringify(normalized));
      const { setSelectedCategories: setDbList } = require('../db/db');
      await setDbList('default', normalized);
    } catch {
      // ignore
    }
  };

  const toggleSelectedCategory = async (cat) => {
    const normalizedCat = Number(cat);
    if (!Number.isFinite(normalizedCat) || normalizedCat <= 0) return;
    const categoryId = Math.trunc(normalizedCat);
    const exists = selectedCategories.includes(categoryId);
    let next = exists ? selectedCategories.filter(c => c !== categoryId) : [...selectedCategories, categoryId];
    next = Array.from(new Set(next));
    await updateSelectedCategories(next);
  };

  const setThemeMode = (nextMode) => {
    if (!['light', 'dark'].includes(nextMode)) return;
    setThemeModeState(nextMode);
    AsyncStorage.setItem(THEME_MODE_STORAGE_KEY, nextMode).catch(() => { });
  };

  const toggleTheme = () => {
    setThemeMode(themeMode === 'light' ? 'dark' : 'light');
  };

  const resetThemePreference = async () => {
    const systemThemeMode = getSystemThemeMode();
    setThemeModeState(systemThemeMode);
    try {
      await AsyncStorage.removeItem(THEME_MODE_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const resetAppSettings = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(THEME_MODE_STORAGE_KEY),
        AsyncStorage.removeItem(LANGUAGE_STORAGE_KEY),
        AsyncStorage.removeItem(SELECTED_CATEGORIES_STORAGE_KEY),
      ]);
    } catch {
      // ignore
    }

    setThemeModeState(getSystemThemeMode());
    setLangState(getDeviceLang());
    await updateSelectedCategories([]);
  };

  const activeColors = themeMode === 'light' ? colors.light : colors.dark;

  const themeValue = useMemo(() => ({
    colors: activeColors,
    typography,
    layout,
    isDark: themeMode === 'dark',
    themeMode,
    toggleTheme,
    setThemeMode,
    resetThemePreference,
    resetAppSettings,
    // language controls
    lang,
    setLang,
    // category selections
    selectedCategories,
    setSelectedCategories: updateSelectedCategories,
    toggleSelectedCategory,
  }), [themeMode, activeColors, lang, selectedCategories]);

  // Don't render children until both theme and language are loaded from storage
  // This prevents a flash of wrong theme/language on startup
  if (themeMode === null || lang === null) {
    return null;
  }

  return (
    <ThemeContext.Provider value={themeValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

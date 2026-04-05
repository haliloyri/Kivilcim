import React, { createContext, useContext, useState, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, typography, layout } from '../theme/theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState('light');
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

  const [lang, setLangState] = useState(getDeviceLang());
  
  // Load saved language on mount
  React.useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('lang');
        if (['tr', 'en', 'es', 'de'].includes(saved)) {
          setLangState(saved);
        }
      } catch (e) {
        // ignore
      }
    })();
  }, []);
  const setLang = (l) => {
    const supported = ['tr', 'en', 'es', 'de'];
    if (supported.includes(l)) {
      setLangState(l);
      AsyncStorage.setItem('lang', l).catch(() => { });
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
          setSelectedCategories(dbList);
          return;
        }

        const raw = await AsyncStorage.getItem('selectedCategories');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            setSelectedCategories(parsed);
            // Sync to DB
            const { setSelectedCategories: setDbList } = require('../db/db');
            await setDbList('default', parsed);
          }
        }
      } catch (e) {
        console.error("ThemeContext category load error:", e);
      }
    })();
  }, []);

  const updateSelectedCategories = async (list) => {
    setSelectedCategories(list);
    try {
      await AsyncStorage.setItem('selectedCategories', JSON.stringify(list));
      const { setSelectedCategories: setDbList } = require('../db/db');
      await setDbList('default', list);
    } catch {
      // ignore
    }
  };

  const toggleSelectedCategory = async (cat) => {
    const exists = selectedCategories.includes(cat);
    let next = exists ? selectedCategories.filter(c => c !== cat) : [...selectedCategories, cat];
    next = Array.from(new Set(next));
    await updateSelectedCategories(next);
  };

  const toggleTheme = () => {
    setThemeMode(prev => prev === 'light' ? 'dark' : 'light');
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
    // language controls
    lang,
    setLang,
    // category selections
    selectedCategories,
    setSelectedCategories: updateSelectedCategories,
    toggleSelectedCategory,
  }), [themeMode, activeColors, lang, selectedCategories]);

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

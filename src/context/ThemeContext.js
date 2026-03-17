import React, { createContext, useContext, useState, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, typography, layout } from '../theme/theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState('light');
  // Language support (tr | en). Default to Turkish but persist across restarts.
  const [lang, setLangState] = useState('tr');
  // Load saved language on mount
  React.useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('lang');
        if (saved === 'tr' || saved === 'en') {
          setLangState(saved);
        }
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  const setLang = (l) => {
    if (l === 'tr' || l === 'en') {
      setLangState(l);
      AsyncStorage.setItem('lang', l).catch(() => { });
    }
  };

  // --- Category selections (multi-select) ---
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Load persisted selections
  React.useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('selectedCategories');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            setSelectedCategories(parsed);
          }
        }
      } catch {
        // ignore
      }
    })();
  }, []);

  const updateSelectedCategories = async (list) => {
    setSelectedCategories(list);
    try {
      await AsyncStorage.setItem('selectedCategories', JSON.stringify(list));
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
  }), [themeMode, activeColors, lang]);

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

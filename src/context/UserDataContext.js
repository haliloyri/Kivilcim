import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from './ThemeContext';
import { recordRead, getTotalReads, getStreak, getLongestStreak, getReadsPerCategory } from '../db/db';
import { checkBadges } from '../utils/badges';

const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
  const { setSelectedCategories: setGlobalCategories } = useTheme();
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);
  const [preferences, setPreferences] = useState({ categories: [], time: null });
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [totalReads, setTotalReads] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [categoryStats, setCategoryStats] = useState([]);
  const [shareCount, setShareCount] = useState(0);

  // Güvenlik timeout'u: AsyncStorage 3 saniye içinde tamamlanmazsa devam et
  useEffect(() => {
    const safetyTimer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(safetyTimer);
  }, []);

  // Okuma istatistiklerini yükle
  const refreshStats = useCallback(async () => {
    try {
      const [total, s, longest, catStats] = await Promise.all([
        getTotalReads(),
        getStreak(),
        getLongestStreak(),
        getReadsPerCategory(),
      ]);
      setTotalReads(total);
      setStreak(s);
      setLongestStreak(longest);
      setCategoryStats(catStats);
    } catch (error) {
      console.error('İstatistik yükleme hatası:', error);
    }
  }, []);

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  // Verileri yükle
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('@kivilcim_favorites');
        const storedHistory = await AsyncStorage.getItem('@kivilcim_history');
        const storedPreferences = await AsyncStorage.getItem('@kivilcim_preferences');
        const storedOnboarding = await AsyncStorage.getItem('@kivilcim_onboarded');
        const storedPremium = await AsyncStorage.getItem('@kivilcim_premium');
        const storedShareCount = await AsyncStorage.getItem('@kivilcim_share_count');

        if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
        if (storedHistory) setHistory(JSON.parse(storedHistory));
        if (storedPreferences) setPreferences(JSON.parse(storedPreferences));
        if (storedOnboarding) setIsOnboarded(JSON.parse(storedOnboarding));
        if (storedPremium) setIsPremium(JSON.parse(storedPremium));
        if (storedShareCount) setShareCount(JSON.parse(storedShareCount));
      } catch (error) {
        console.error('AsyncStorage veri yükleme hatası:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Favoriler
  const toggleFavorite = async (storyId) => {
    try {
      setFavorites((prev) => {
        const strId = String(storyId);
        const newFavs = prev.some(id => String(id) === strId)
          ? prev.filter(id => String(id) !== strId) 
          : [...prev, strId];
        
        AsyncStorage.setItem('@kivilcim_favorites', JSON.stringify(newFavs));
        return newFavs;
      });
    } catch (error) {
      console.error('Favori kaydetme hatası:', error);
    }
  };

  const isFavorite = (storyId) => {
    return favorites.some(id => String(id) === String(storyId));
  };

  // Okuma Geçmişi (Son 20 Hikaye)
  const addToHistory = async (storyId) => {
    try {
      // SQLite'a okuma kaydı ekle
      await recordRead(storyId);
      
      setHistory((prev) => {
        const filtered = prev.filter(id => String(id) !== String(storyId));
        const newHist = [String(storyId), ...filtered].slice(0, 20); 
        AsyncStorage.setItem('@kivilcim_history', JSON.stringify(newHist));
        return newHist;
      });

      // İstatistikleri güncelle
      await refreshStats();
    } catch (error) {
      console.error('Okuma geçmişi kaydetme hatası:', error);
    }
  };

  // Onboarding Tamamlama
  const saveOnboarding = async (userCategories, userTimeObj) => {
    try {
      const prefs = { categories: userCategories, time: userTimeObj };
      setPreferences(prefs);
      setIsOnboarded(true);

      await AsyncStorage.setItem('@kivilcim_preferences', JSON.stringify(prefs));
      await AsyncStorage.setItem('@kivilcim_onboarded', JSON.stringify(true));
      
      // Sync to SQLite for discovery page compatibility
      try {
        const { setSelectedCategories: setDbList } = require('../db/db');
        await setDbList('default', userCategories);
        // Also update the global ThemeContext so HomeScreen reflects this immediately
        await setGlobalCategories(userCategories);
      } catch (dbErr) {
        console.error('Onboarding SQLite sync error:', dbErr);
      }
    } catch (error) {
      console.error('Onboarding kaydetme hatası:', error);
    }
  };

  // Abonelik Satın Al (Mock)
  const buyPremium = async () => {
    try {
      setIsPremium(true);
      await AsyncStorage.setItem('@kivilcim_premium', JSON.stringify(true));
    } catch (error) {
      console.error('Satın alma hatası:', error);
    }
  };

  // Paylaşım sayacı
  const incrementShareCount = async () => {
    try {
      setShareCount(prev => {
        const next = prev + 1;
        AsyncStorage.setItem('@kivilcim_share_count', JSON.stringify(next));
        return next;
      });
    } catch (error) {
      console.error('Paylaşım sayacı hatası:', error);
    }
  };

  // Verileri Sıfırla (Debug ve Çıkış için)
  const clearUserData = async () => {
    try {
      await AsyncStorage.multiRemove([
        '@kivilcim_favorites',
        '@kivilcim_history',
        '@kivilcim_preferences',
        '@kivilcim_onboarded',
        '@kivilcim_premium',
        '@kivilcim_share_count'
      ]);
      setFavorites([]);
      setHistory([]);
      setPreferences({ categories: [], time: null });
      setIsOnboarded(false);
      setIsPremium(false);
      setShareCount(0);
      // Clear global categories in ThemeContext too
      await setGlobalCategories([]);
    } catch (error) {
      console.error('Veri silme hatası:', error);
    }
  };

  // Rozetleri hesapla
  const earnedBadges = useMemo(() => 
    checkBadges({ totalReads, streak, longestStreak, categoryStats, favoritesCount: favorites.length, shareCount }),
    [totalReads, streak, longestStreak, categoryStats, favorites.length, shareCount]
  );

  const value = useMemo(() => ({
    favorites,
    history,
    preferences,
    isOnboarded,
    isPremium,
    isLoadingUserData: isLoading,
    streak,
    totalReads,
    longestStreak,
    categoryStats,
    shareCount,
    earnedBadges,
    toggleFavorite,
    isFavorite,
    addToHistory,
    saveOnboarding,
    buyPremium,
    incrementShareCount,
    clearUserData,
    refreshStats
  }), [favorites, history, preferences, isOnboarded, isPremium, isLoading, streak, totalReads, longestStreak, categoryStats, shareCount, earnedBadges]);

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};

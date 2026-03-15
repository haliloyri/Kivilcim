import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);
  const [preferences, setPreferences] = useState({ categories: [], time: null });
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Verileri yükle
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('@kivilcim_favorites');
        const storedHistory = await AsyncStorage.getItem('@kivilcim_history');
        const storedPreferences = await AsyncStorage.getItem('@kivilcim_preferences');
        const storedOnboarding = await AsyncStorage.getItem('@kivilcim_onboarded');
        const storedPremium = await AsyncStorage.getItem('@kivilcim_premium');

        if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
        if (storedHistory) setHistory(JSON.parse(storedHistory));
        if (storedPreferences) setPreferences(JSON.parse(storedPreferences));
        if (storedOnboarding) setIsOnboarded(JSON.parse(storedOnboarding));
        if (storedPremium) setIsPremium(JSON.parse(storedPremium));
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
        const newFavs = prev.includes(storyId) 
          ? prev.filter(id => id !== storyId) 
          : [...prev, storyId];
        
        AsyncStorage.setItem('@kivilcim_favorites', JSON.stringify(newFavs));
        return newFavs;
      });
    } catch (error) {
      console.error('Favori kaydetme hatası:', error);
    }
  };

  const isFavorite = (storyId) => {
    return favorites.includes(storyId);
  };

  // Okuma Geçmişi (Son 20 Hikaye)
  const addToHistory = async (storyId) => {
    try {
      setHistory((prev) => {
        const filtered = prev.filter(id => id !== storyId);
        const newHist = [storyId, ...filtered].slice(0, 20); 
        AsyncStorage.setItem('@kivilcim_history', JSON.stringify(newHist));
        return newHist;
      });
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

  // Verileri Sıfırla (Debug ve Çıkış için)
  const clearUserData = async () => {
    try {
      await AsyncStorage.multiRemove([
        '@kivilcim_favorites',
        '@kivilcim_history',
        '@kivilcim_preferences',
        '@kivilcim_onboarded',
        '@kivilcim_premium'
      ]);
      setFavorites([]);
      setHistory([]);
      setPreferences({ categories: [], time: null });
      setIsOnboarded(false);
      setIsPremium(false);
    } catch (error) {
      console.error('Veri silme hatası:', error);
    }
  };

  const value = useMemo(() => ({
    favorites,
    history,
    preferences,
    isOnboarded,
    isPremium,
    isLoadingUserData: isLoading,
    toggleFavorite,
    isFavorite,
    addToHistory,
    saveOnboarding,
    buyPremium,
    clearUserData
  }), [favorites, history, preferences, isOnboarded, isPremium, isLoading]);

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

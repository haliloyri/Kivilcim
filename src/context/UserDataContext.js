import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from './ThemeContext';
import { recordRead, getTotalReads, getStreak, getLongestStreak, getReadsPerCategory, getReadCountsByStory } from '../db/db';
import { checkBadges } from '../utils/badges';
import { scheduleDailyNotifications } from '../utils/notifications';
import { ANALYTICS_EVENTS, trackEvent } from '../utils/analytics';

const UserDataContext = createContext();
const SEEN_BADGES_STORAGE_KEY = '@kivilcim_seen_earned_badges';
const FIRST_SESSION_PROMPT_KEY = '@kivilcim_first_session_prompt';
const USER_PROFILE_STORAGE_KEY = '@kivilcim_user_profile';
const FAVORITE_COLLECTIONS_STORAGE_KEY = '@kivilcim_favorite_collections';
const COMPLETED_STORIES_STORAGE_KEY = '@kivilcim_completed_stories';
const VARIANT_USAGE_STORAGE_KEY = '@kivilcim_variant_usage';
const EMPTY_PREFERENCES = { categories: [], time: null, reminderWindow: 'evening', reminderHour: 21, reminderWindows: ['evening'] };
const EMPTY_USER_PROFILE = { displayName: null, email: null };
const EMPTY_FAVORITE_COLLECTIONS = { saved_for_later: [] };

const normalizeCategoryIds = (categories) => {
  if (!Array.isArray(categories)) return [];
  return [...new Set(
    categories
      .map((item) => Number(item))
      .filter((num) => Number.isFinite(num) && num > 0)
      .map((num) => Math.trunc(num))
  )];
};

const normalizeMinutes = (rawMinutes) => {
  if (rawMinutes == null) return null;

  const parsed = Number(rawMinutes);
  if (Number.isNaN(parsed)) return null;
  if (parsed <= 3) return 3;
  if (parsed <= 6) return 6;
  return 9;
};

const inferMinutesFromTimePreference = (timePreference) => {
  if (!timePreference) return null;

  if (typeof timePreference === 'number') {
    return normalizeMinutes(timePreference);
  }

  if (typeof timePreference === 'string') {
    const match = timePreference.match(/\d+/);
    return normalizeMinutes(match ? match[0] : null);
  }

  if (typeof timePreference === 'object') {
    if (timePreference.minutes != null) {
      return normalizeMinutes(timePreference.minutes);
    }

    const candidates = [timePreference.label, timePreference.value, timePreference.title];
    for (const candidate of candidates) {
      if (typeof candidate === 'string') {
        const match = candidate.match(/\d+/);
        if (match) return normalizeMinutes(match[0]);
      }
    }
  }

  return null;
};

const getDailyStoryTarget = (minutes) => {
  if (minutes === 3) return 1;
  if (minutes === 6) return 2;
  if (minutes === 9) return 3;
  return null;
};

const buildReminderPreference = (reminderPreference) => {
  if (!reminderPreference) {
    return { reminderWindow: 'evening', reminderHour: 21 };
  }

  if (typeof reminderPreference === 'string') {
    const reminderWindow = ['morning', 'noon', 'evening'].includes(reminderPreference)
      ? reminderPreference
      : 'evening';
    const reminderHour = reminderWindow === 'morning' ? 8 : reminderWindow === 'noon' ? 13 : 21;
    return { reminderWindow, reminderHour };
  }

  if (typeof reminderPreference === 'object') {
    const reminderWindow = ['morning', 'noon', 'evening'].includes(reminderPreference.reminderWindow)
      ? reminderPreference.reminderWindow
      : ['morning', 'noon', 'evening'].includes(reminderPreference.window)
        ? reminderPreference.window
        : 'evening';

    const parsedHour = Number(
      reminderPreference.reminderHour ?? reminderPreference.hour ?? reminderPreference.value
    );
    const reminderHour = !Number.isNaN(parsedHour) && parsedHour >= 0 && parsedHour <= 23
      ? parsedHour
      : reminderWindow === 'morning'
        ? 8
        : reminderWindow === 'noon'
          ? 13
          : 21;

    return { reminderWindow, reminderHour };
  }

  return { reminderWindow: 'evening', reminderHour: 21 };
};

const buildTimePreference = (timePreference) => {
  const minutes = inferMinutesFromTimePreference(timePreference);
  if (!minutes) return null;

  const dailyStoryTarget = getDailyStoryTarget(minutes);
  const icon = typeof timePreference === 'object' && timePreference?.icon
    ? timePreference.icon
    : minutes === 3
      ? '☕'
      : minutes === 6
        ? '📚'
        : '🚀';

  return {
    ...(typeof timePreference === 'object' && timePreference ? timePreference : {}),
    minutes,
    dailyStoryTarget,
    icon,
  };
};

const normalizePreferences = (storedPreferences) => {
  if (!storedPreferences || typeof storedPreferences !== 'object') {
    return EMPTY_PREFERENCES;
  }

  // Normalize reminderWindows: new array format or migrate from legacy single
  let reminderWindows;
  if (Array.isArray(storedPreferences.reminderWindows) && storedPreferences.reminderWindows.length > 0) {
    reminderWindows = storedPreferences.reminderWindows.filter(w => ['morning', 'noon', 'evening'].includes(w));
    if (reminderWindows.length === 0) reminderWindows = ['evening'];
  } else {
    const reminder = buildReminderPreference(storedPreferences.reminderWindow ? {
      reminderWindow: storedPreferences.reminderWindow,
      reminderHour: storedPreferences.reminderHour,
    } : storedPreferences.reminder || null);
    reminderWindows = [reminder.reminderWindow];
  }
  const primary = buildReminderPreference({ reminderWindow: reminderWindows[0] });

  return {
    categories: normalizeCategoryIds(storedPreferences.categories),
    time: buildTimePreference(storedPreferences.time),
    reminderWindow: primary.reminderWindow,
    reminderHour: primary.reminderHour,
    reminderWindows,
  };
};

const normalizeUserProfile = (storedProfile) => {
  if (!storedProfile || typeof storedProfile !== 'object') {
    return EMPTY_USER_PROFILE;
  }

  const displayName = typeof storedProfile.displayName === 'string' && storedProfile.displayName.trim()
    ? storedProfile.displayName.trim()
    : null;
  const email = typeof storedProfile.email === 'string' && storedProfile.email.trim()
    ? storedProfile.email.trim()
    : null;

  return {
    displayName,
    email,
  };
};

const normalizeFavoriteCollections = (storedCollections, favorites = []) => {
  const base = {
    ...EMPTY_FAVORITE_COLLECTIONS,
    ...(storedCollections && typeof storedCollections === 'object' ? storedCollections : {}),
  };
  const favoriteSet = new Set((favorites || []).map((id) => String(id)));

  return Object.fromEntries(
    Object.entries(base).map(([key, list]) => {
      const normalizedList = Array.isArray(list)
        ? [...new Set(list.map((id) => String(id)).filter((id) => favoriteSet.has(id)))]
        : [];
      return [key, normalizedList];
    })
  );
};

export const UserDataProvider = ({ children }) => {
  const { setSelectedCategories: setGlobalCategories, lang } = useTheme();
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);
  const [preferences, setPreferences] = useState(EMPTY_PREFERENCES);
  const [userProfile, setUserProfile] = useState(EMPTY_USER_PROFILE);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [totalReads, setTotalReads] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [categoryStats, setCategoryStats] = useState([]);
  const [readCountsByStory, setReadCountsByStory] = useState({});
  const [shareCount, setShareCount] = useState(0);
  const [favoriteCollections, setFavoriteCollections] = useState(EMPTY_FAVORITE_COLLECTIONS);
  const [completedStories, setCompletedStories] = useState([]);
  const [seenBadgeIds, setSeenBadgeIds] = useState([]);
  const [seenBadgesReady, setSeenBadgesReady] = useState(false);
  const [shouldBootstrapSeenBadges, setShouldBootstrapSeenBadges] = useState(false);
  const [activeBadgeModal, setActiveBadgeModal] = useState(null);
  const [pendingBadges, setPendingBadges] = useState([]);
  const [variantUsage, setVariantUsage] = useState([]);

  // Güvenlik timeout'u: AsyncStorage 3 saniye içinde tamamlanmazsa devam et
  useEffect(() => {
    const safetyTimer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(safetyTimer);
  }, []);

  // Okuma istatistiklerini yükle
  const refreshStats = useCallback(async () => {
    try {
      const [total, s, longest, catStats, storyReadCounts] = await Promise.all([
        getTotalReads(),
        getStreak(),
        getLongestStreak(),
        getReadsPerCategory(),
        getReadCountsByStory(),
      ]);
      setTotalReads(total);
      setStreak(s);
      setLongestStreak(longest);
      setCategoryStats(catStats);
      setReadCountsByStory(storyReadCounts);
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
        const storedUserProfile = await AsyncStorage.getItem(USER_PROFILE_STORAGE_KEY);
        const storedCollections = await AsyncStorage.getItem(FAVORITE_COLLECTIONS_STORAGE_KEY);
        const storedCompletedStories = await AsyncStorage.getItem(COMPLETED_STORIES_STORAGE_KEY);

        const parsedFavorites = storedFavorites ? JSON.parse(storedFavorites) : [];
        if (storedFavorites) setFavorites(parsedFavorites);
        if (storedHistory) setHistory(JSON.parse(storedHistory));
        if (storedPreferences) {
          const parsedPreferences = JSON.parse(storedPreferences);
          const normalizedPreferences = normalizePreferences(parsedPreferences);
          setPreferences(normalizedPreferences);

          if (JSON.stringify(parsedPreferences) !== JSON.stringify(normalizedPreferences)) {
            await AsyncStorage.setItem('@kivilcim_preferences', JSON.stringify(normalizedPreferences));
          }
        }
        if (storedOnboarding) setIsOnboarded(JSON.parse(storedOnboarding));
        if (storedPremium) setIsPremium(JSON.parse(storedPremium));
        if (storedShareCount) setShareCount(JSON.parse(storedShareCount));
        const parsedCollections = storedCollections ? JSON.parse(storedCollections) : EMPTY_FAVORITE_COLLECTIONS;
        const normalizedCollections = normalizeFavoriteCollections(parsedCollections, parsedFavorites);
        setFavoriteCollections(normalizedCollections);
        if (JSON.stringify(parsedCollections) !== JSON.stringify(normalizedCollections)) {
          await AsyncStorage.setItem(FAVORITE_COLLECTIONS_STORAGE_KEY, JSON.stringify(normalizedCollections));
        }
        if (storedUserProfile) {
          const parsedProfile = JSON.parse(storedUserProfile);
          const normalizedProfile = normalizeUserProfile(parsedProfile);
          setUserProfile(normalizedProfile);

          if (JSON.stringify(parsedProfile) !== JSON.stringify(normalizedProfile)) {
            await AsyncStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(normalizedProfile));
          }
        }
        if (storedCompletedStories) {
          const parsedCompleted = JSON.parse(storedCompletedStories);
          setCompletedStories(Array.isArray(parsedCompleted) ? parsedCompleted.map((id) => String(id)) : []);
        }
        const storedVariantUsage = await AsyncStorage.getItem(VARIANT_USAGE_STORAGE_KEY);
        if (storedVariantUsage) {
          const parsed = JSON.parse(storedVariantUsage);
          setVariantUsage(Array.isArray(parsed) ? parsed : []);
        }
      } catch (error) {
        console.error('AsyncStorage veri yükleme hatası:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const syncCollectionsWithFavorites = async () => {
      const normalized = normalizeFavoriteCollections(favoriteCollections, favorites);
      if (JSON.stringify(normalized) === JSON.stringify(favoriteCollections)) return;
      setFavoriteCollections(normalized);
      await AsyncStorage.setItem(FAVORITE_COLLECTIONS_STORAGE_KEY, JSON.stringify(normalized));
    };

    syncCollectionsWithFavorites();
  }, [favorites]);

  useEffect(() => {
    const loadSeenBadges = async () => {
      try {
        const raw = await AsyncStorage.getItem(SEEN_BADGES_STORAGE_KEY);
        if (raw == null) setShouldBootstrapSeenBadges(true);
        const parsed = raw ? JSON.parse(raw) : [];
        setSeenBadgeIds(Array.isArray(parsed) ? parsed : []);
      } catch (error) {
        console.error('Gorulen rozetler yuklenemedi:', error);
        setSeenBadgeIds([]);
      } finally {
        setSeenBadgesReady(true);
      }
    };

    loadSeenBadges();
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

  const toggleStoryInFavoriteCollection = async (storyId, collectionId = 'saved_for_later') => {
    const strId = String(storyId);
    if (!isFavorite(strId)) return;

    setFavoriteCollections((prev) => {
      const current = Array.isArray(prev?.[collectionId]) ? prev[collectionId] : [];
      const nextList = current.includes(strId)
        ? current.filter((id) => id !== strId)
        : [...current, strId];
      const next = {
        ...prev,
        [collectionId]: [...new Set(nextList)],
      };
      AsyncStorage.setItem(FAVORITE_COLLECTIONS_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const isStorySavedForLater = useCallback((storyId) => {
    const strId = String(storyId);
    return (favoriteCollections?.saved_for_later || []).includes(strId);
  }, [favoriteCollections]);

  const toggleReadLater = async (storyId) => {
    const strId = String(storyId);

    setFavorites((prev) => {
      if (prev.some((id) => String(id) === strId)) return prev;
      const nextFavorites = [...prev, strId];
      AsyncStorage.setItem('@kivilcim_favorites', JSON.stringify(nextFavorites));
      return nextFavorites;
    });

    setFavoriteCollections((prev) => {
      const current = Array.isArray(prev?.saved_for_later) ? prev.saved_for_later : [];
      const nextList = current.includes(strId)
        ? current.filter((id) => id !== strId)
        : [...current, strId];
      const next = {
        ...prev,
        saved_for_later: [...new Set(nextList)],
      };
      AsyncStorage.setItem(FAVORITE_COLLECTIONS_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const isStoryInFavoriteCollection = (storyId, collectionId = 'saved_for_later') => {
    const strId = String(storyId);
    return (favoriteCollections?.[collectionId] || []).includes(strId);
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

  const markStoryCompleted = async (storyId) => {
    const strId = String(storyId);
    setCompletedStories((prev) => {
      if (prev.includes(strId)) return prev;
      const next = [strId, ...prev].slice(0, 100);
      AsyncStorage.setItem(COMPLETED_STORIES_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const isStoryCompleted = useCallback((storyId) => {
    return completedStories.includes(String(storyId));
  }, [completedStories]);

  // Onboarding Tamamlama
  const saveOnboarding = async (userCategories, userTimeObj, userReminderParam = null) => {
    try {
      // Accept either a windows array ['morning','evening'] or a legacy single option object
      let reminderWindows;
      if (Array.isArray(userReminderParam)) {
        reminderWindows = userReminderParam.filter(w => ['morning', 'noon', 'evening'].includes(w));
        if (reminderWindows.length === 0) reminderWindows = ['evening'];
      } else {
        const reminder = buildReminderPreference(userReminderParam);
        reminderWindows = [reminder.reminderWindow];
      }
      const prefs = normalizePreferences({
        categories: normalizeCategoryIds(userCategories),
        time: userTimeObj,
        reminderWindows,
      });
      setPreferences(prefs);
      setIsOnboarded(true);

      await AsyncStorage.setItem('@kivilcim_preferences', JSON.stringify(prefs));
      await AsyncStorage.setItem('@kivilcim_onboarded', JSON.stringify(true));
      await AsyncStorage.setItem(FIRST_SESSION_PROMPT_KEY, JSON.stringify(true));

      await scheduleDailyNotifications({
        lang,
        reminderWindows: prefs.reminderWindows,
        reminderWindow: prefs.reminderWindow,
        reminderHour: prefs.reminderHour,
        dailyStoryTarget: prefs.time?.dailyStoryTarget || 2,
        totalReads,
        streak,
        shareCount,
        isPremium,
      });

      await trackEvent(ANALYTICS_EVENTS.ONBOARDING_TIME_BUDGET_SELECTED, {
        minutes: prefs.time?.minutes,
        dailyStoryTarget: prefs.time?.dailyStoryTarget,
        lang,
      });
      await trackEvent(ANALYTICS_EVENTS.ONBOARDING_NOTIFICATION_TIME_SELECTED, {
        reminderWindows: prefs.reminderWindows,
        reminderWindow: prefs.reminderWindow,
        reminderHour: prefs.reminderHour,
        lang,
      });
      
      // Sync to SQLite for discovery page compatibility
      try {
        const { setSelectedCategories: setDbList } = require('../db/db');
        await setDbList('default', prefs.categories);
        // Also update the global ThemeContext so HomeScreen reflects this immediately
        await setGlobalCategories(prefs.categories);
      } catch (dbErr) {
        console.error('Onboarding SQLite sync error:', dbErr);
      }
    } catch (error) {
      console.error('Onboarding kaydetme hatası:', error);
    }
  };

  const updatePreferences = async (partialPrefs = {}) => {
    try {
      const reminderChanged = Object.prototype.hasOwnProperty.call(partialPrefs, 'reminderWindows')
        || Object.prototype.hasOwnProperty.call(partialPrefs, 'reminderWindow')
        || Object.prototype.hasOwnProperty.call(partialPrefs, 'reminderHour');
      const candidate = {
        categories: partialPrefs.categories ?? preferences.categories,
        time: partialPrefs.time ?? preferences.time,
        reminderWindows: partialPrefs.reminderWindows ?? preferences.reminderWindows ?? [preferences.reminderWindow || 'evening'],
        reminderWindow: partialPrefs.reminderWindow ?? preferences.reminderWindow,
        reminderHour: partialPrefs.reminderHour ?? preferences.reminderHour,
      };

      const nextPrefs = normalizePreferences(candidate);
      setPreferences(nextPrefs);
      await AsyncStorage.setItem('@kivilcim_preferences', JSON.stringify(nextPrefs));

      await scheduleDailyNotifications({
        lang,
        reminderWindows: nextPrefs.reminderWindows,
        reminderWindow: nextPrefs.reminderWindow,
        reminderHour: nextPrefs.reminderHour,
        dailyStoryTarget: nextPrefs.time?.dailyStoryTarget || 2,
        totalReads,
        streak,
        shareCount,
        isPremium,
      });

      if (reminderChanged) {
        await trackEvent(ANALYTICS_EVENTS.REMINDER_TIME_CHANGED, {
          reminderWindows: nextPrefs.reminderWindows,
          reminderWindow: nextPrefs.reminderWindow,
          reminderHour: nextPrefs.reminderHour,
          previousReminderWindows: preferences.reminderWindows,
          previousReminderWindow: preferences.reminderWindow,
          previousReminderHour: preferences.reminderHour,
          lang,
        });
      }
    } catch (error) {
      console.error('Tercih güncelleme hatası:', error);
    }
  };

  // Abonelik Satın Al (Mock)
  const buyPremium = async () => {
    try {
      setIsPremium(true);
      await AsyncStorage.setItem('@kivilcim_premium', JSON.stringify(true));
      return true;
    } catch (error) {
      console.error('Satın alma hatası:', error);
      return false;
    }
  };

  useEffect(() => {
    if (!isOnboarded || isLoading) return;
    if (!preferences?.time?.dailyStoryTarget) return;

    scheduleDailyNotifications({
      lang,
      reminderWindow: preferences.reminderWindow,
      reminderHour: preferences.reminderHour,
      dailyStoryTarget: preferences.time.dailyStoryTarget,
      totalReads,
      streak,
      shareCount,
      isPremium,
    }).catch((error) => {
      console.error('Segment bazli bildirim guncelleme hatasi:', error);
    });
  }, [
    isOnboarded,
    isLoading,
    lang,
    preferences,
    totalReads,
    streak,
    shareCount,
    isPremium,
  ]);

  const updateUserProfile = async (partialProfile = {}) => {
    try {
      const candidate = {
        displayName: Object.prototype.hasOwnProperty.call(partialProfile, 'displayName')
          ? partialProfile.displayName
          : userProfile.displayName,
        email: Object.prototype.hasOwnProperty.call(partialProfile, 'email')
          ? partialProfile.email
          : userProfile.email,
      };

      const nextProfile = normalizeUserProfile(candidate);
      setUserProfile(nextProfile);
      await AsyncStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(nextProfile));
    } catch (error) {
      console.error('Profil bilgisi güncelleme hatası:', error);
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

  // Varyant kullanım kaydı (copy / share / mark-used)
  const recordVariantUsage = useCallback(async ({ storyId, storyTitle, storyCategory, variantType, variantId, action, feedbackRating = null }) => {
    try {
      const entry = {
        storyId: String(storyId),
        storyTitle: storyTitle || '',
        storyCategory: storyCategory || null,
        variantType,
        variantId,
        action, // 'copy' | 'share' | 'mark_used'
        feedbackRating,
        usedAt: new Date().toISOString(),
      };
      setVariantUsage(prev => {
        const next = [entry, ...prev].slice(0, 200); // keep last 200
        AsyncStorage.setItem(VARIANT_USAGE_STORAGE_KEY, JSON.stringify(next));
        return next;
      });
      trackEvent(ANALYTICS_EVENTS.STORY_VARIANT_USED, {
        storyId: String(storyId),
        storyCategory: storyCategory || null,
        variantType,
        variantId,
        action,
        feedbackRating,
        lang,
      });
    } catch (error) {
      console.error('Varyant kullanım kayıt hatası:', error);
    }
  }, [lang]);

  // Verileri Sıfırla (Debug ve Çıkış için)
  const clearUserData = async () => {
    try {
      await AsyncStorage.multiRemove([
        '@kivilcim_favorites',
        '@kivilcim_history',
        '@kivilcim_preferences',
        '@kivilcim_onboarded',
        '@kivilcim_premium',
        '@kivilcim_share_count',
        FAVORITE_COLLECTIONS_STORAGE_KEY,
        COMPLETED_STORIES_STORAGE_KEY,
        USER_PROFILE_STORAGE_KEY,
        FIRST_SESSION_PROMPT_KEY,
        SEEN_BADGES_STORAGE_KEY,
        VARIANT_USAGE_STORAGE_KEY,
      ]);
      setFavorites([]);
      setHistory([]);
      setPreferences(EMPTY_PREFERENCES);
      setFavoriteCollections(EMPTY_FAVORITE_COLLECTIONS);
      setCompletedStories([]);
      setUserProfile(EMPTY_USER_PROFILE);
      setIsOnboarded(false);
      setIsPremium(false);
      setShareCount(0);
      setSeenBadgeIds([]);
      setActiveBadgeModal(null);
      setVariantUsage([]);
      // Clear global categories in ThemeContext too
      await setGlobalCategories([]);
    } catch (error) {
      console.error('Veri silme hatası:', error);
    }
  };

  // Rozetleri hesapla
  const earnedBadges = useMemo(() => 
    checkBadges({
      totalReads,
      streak,
      longestStreak,
      categoryStats,
      favoritesCount: favorites.length,
      shareCount,
      variantUsage,
    }),
    [totalReads, streak, longestStreak, categoryStats, favorites.length, shareCount, variantUsage]
  );

  const markBadgesAsSeen = useCallback(async (badgeIds) => {
    if (!badgeIds?.length) return;

    const next = Array.from(new Set([...seenBadgeIds, ...badgeIds]));
    if (next.length === seenBadgeIds.length) return;

    setSeenBadgeIds(next);
    try {
      await AsyncStorage.setItem(SEEN_BADGES_STORAGE_KEY, JSON.stringify(next));
    } catch (error) {
      console.error('Rozet gorunme durumu kaydedilemedi:', error);
    }
  }, [seenBadgeIds]);

  useEffect(() => {
    if (!seenBadgesReady || !earnedBadges.length) return;

    if (shouldBootstrapSeenBadges) {
      const alreadyEarnedIds = earnedBadges.filter((badge) => badge.earned).map((badge) => badge.id);
      markBadgesAsSeen(alreadyEarnedIds);
      setShouldBootstrapSeenBadges(false);
      return;
    }

    const newlyEarned = earnedBadges.filter((badge) => badge.earned && !seenBadgeIds.includes(badge.id));
    if (!newlyEarned.length) return;

    // Rozetleri bekletme kuyruğuna ekle; hikaye okunup scroll tamamlandığında gösterilecek
    setPendingBadges(prev => [...prev, ...newlyEarned]);
    markBadgesAsSeen(newlyEarned.map((badge) => badge.id));
  }, [earnedBadges, seenBadgeIds, seenBadgesReady, markBadgesAsSeen, shouldBootstrapSeenBadges]);

  const openBadgeModal = useCallback((badge) => {
    if (!badge) return;
    setActiveBadgeModal(badge);
    if (badge.earned) {
      markBadgesAsSeen([badge.id]);
    }
  }, [markBadgesAsSeen]);

  const closeBadgeModal = useCallback(() => {
    setActiveBadgeModal(null);
  }, []);

  // Bekleyen ilk rozeti modal olarak göster (hikaye scroll tamamlandığında çağrılır)
  const releasePendingBadge = useCallback(() => {
    setPendingBadges(prev => {
      if (prev.length === 0) return prev;
      setActiveBadgeModal(prev[0]);
      return prev.slice(1);
    });
  }, []);

  const unseenEarnedBadgeCount = useMemo(
    () => earnedBadges.filter((b) => b.earned && !seenBadgeIds.includes(b.id)).length,
    [earnedBadges, seenBadgeIds]
  );

  const value = useMemo(() => ({
    favorites,
    history,
    preferences,
    userProfile,
    isOnboarded,
    isPremium,
    isLoadingUserData: isLoading,
    streak,
    totalReads,
    longestStreak,
    categoryStats,
    readCountsByStory,
    favoriteCollections,
    completedStories,
    shareCount,
    earnedBadges,
    activeBadgeModal,
    unseenEarnedBadgeCount,
    toggleFavorite,
    isFavorite,
    isStoryInFavoriteCollection,
    toggleStoryInFavoriteCollection,
    isStorySavedForLater,
    toggleReadLater,
    addToHistory,
    isStoryCompleted,
    markStoryCompleted,
    saveOnboarding,
    updatePreferences,
    buyPremium,
    updateUserProfile,
    incrementShareCount,
    recordVariantUsage,
    variantUsage,
    clearUserData,
    refreshStats,
    openBadgeModal,
    closeBadgeModal,
    releasePendingBadge,
  }), [favorites, history, preferences, userProfile, isOnboarded, isPremium, isLoading, streak, totalReads, longestStreak, categoryStats, readCountsByStory, favoriteCollections, completedStories, shareCount, earnedBadges, activeBadgeModal, unseenEarnedBadgeCount, variantUsage, isStorySavedForLater, toggleReadLater, isStoryCompleted, recordVariantUsage, openBadgeModal, closeBadgeModal, releasePendingBadge]);

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

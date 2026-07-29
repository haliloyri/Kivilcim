import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from './ThemeContext';
import { recordRead, getTotalReads, getStreak, getLongestStreak, getReadsPerCategory, getReadCountsByStory, recordStreakFreeze, getStreakFreezes, clearStreakFreezes, clearUserReads } from '../db/db';
import { checkBadges } from '../utils/badges';
import { scheduleDailyNotifications } from '../utils/notifications';
import { ANALYTICS_EVENTS, trackEvent, setAnalyticsContext } from '../utils/analytics';
import { BILLING_LIVE, purchasePackage, restorePurchases, getOfferingPackages, checkEntitlement } from '../services/billing';
import {
  SUPABASE_LIVE,
  getCurrentUser,
  getUserStatsFromServer,
  getStreakFreezesFromServer,
  recordVariantUsageOnServer,
  removeVariantUsageOnServer,
  getSeenBadgeIdsFromServer,
  markBadgesSeenOnServer,
} from '../services/supabase';
import { enqueueAndSync } from '../services/offlineQueue';
import { FEATURE_FLAGS } from '../config/featureFlags';
import { clearCareerData } from '../db/userDb';
import { notifyCareerDataChanged, recordCareerApplication, recordCareerInsightSaved, recordCareerStoryCompletion } from '../services/careerEvents';
import { migrateLegacyCareerPath } from '../services/migrateCareerPath';
import { updateCareerSparkPackage } from '../utils/careerSparkPackage';

const UserDataContext = createContext();
const SEEN_BADGES_STORAGE_KEY = '@kivilcim_seen_earned_badges';
const PENDING_BADGES_STORAGE_KEY = '@kivilcim_pending_badges';
const BADGE_COLLECTION_COMPLETION_STORAGE_KEY = '@kivilcim_badge_collection_completion_seen';
const FIRST_SESSION_PROMPT_KEY = '@kivilcim_first_session_prompt';
const USER_PROFILE_STORAGE_KEY = '@kivilcim_user_profile';
const FAVORITE_COLLECTIONS_STORAGE_KEY = '@kivilcim_favorite_collections';
const COMPLETED_STORIES_STORAGE_KEY = '@kivilcim_completed_stories';
const VARIANT_USAGE_STORAGE_KEY = '@kivilcim_variant_usage';
const CAREER_TAKEAWAYS_STORAGE_KEY = '@kivilcim_career_takeaways';
const CAREER_SPARK_PACKAGE_STORAGE_KEY = '@kivilcim_career_spark_package';
const STREAK_FREEZE_CREDITS_STORAGE_KEY = '@kivilcim_streak_freeze_credits';
const STORY_COLLECTION_IDS = ['classic', 'new', 'agent', 'focus', 'conversation', 'originals'];
const DEFAULT_STORY_COLLECTIONS = ['new'];
const EMPTY_PREFERENCES = {
  categories: [], time: null, reminderWindow: 'evening', reminderHour: 21,
  reminderWindows: ['evening'], storyVersion: 2, storyCollections: DEFAULT_STORY_COLLECTIONS,
};
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
  const storyCollections = Array.isArray(storedPreferences.storyCollections)
    ? storedPreferences.storyCollections.filter((id) => STORY_COLLECTION_IDS.includes(id))
    : [];
  // This preference did not previously have a visible control. Existing users
  // therefore move to the current collection instead of being trapped in V1.
  const selectedStoryCollections = storyCollections.length > 0
    ? [...new Set(storyCollections)]
    : DEFAULT_STORY_COLLECTIONS;

  return {
    categories: normalizeCategoryIds(storedPreferences.categories),
    time: buildTimePreference(storedPreferences.time),
    reminderWindow: primary.reminderWindow,
    reminderHour: primary.reminderHour,
    reminderWindows,
    storyVersion: selectedStoryCollections.includes('new') ? 2 : 1,
    storyCollections: selectedStoryCollections,
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
  const [hasPaidPremium, setHasPaidPremium] = useState(false);

  const isPremium = useMemo(() => {
    return hasPaidPremium;
  }, [hasPaidPremium]);
  const [isLoading, setIsLoading] = useState(true);

  // Segment every analytics event by subscription + onboarding state so the
  // paywall-conversion and retention funnels can be sliced by user type.
  useEffect(() => {
    setAnalyticsContext({ is_premium: isPremium, is_onboarded: isOnboarded });
  }, [isPremium, isOnboarded]);

  const [streak, setStreak] = useState(0);
  const [totalReads, setTotalReads] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [categoryStats, setCategoryStats] = useState([]);
  const [readCountsByStory, setReadCountsByStory] = useState({});
  const [todayReadsCount, setTodayReadsCount] = useState(0);
  const [shareCount, setShareCount] = useState(0);
  const [favoriteCollections, setFavoriteCollections] = useState(EMPTY_FAVORITE_COLLECTIONS);
  const [completedStories, setCompletedStories] = useState([]);
  const [seenBadgeIds, setSeenBadgeIds] = useState([]);
  const [seenBadgesReady, setSeenBadgesReady] = useState(false);
  const [shouldBootstrapSeenBadges, setShouldBootstrapSeenBadges] = useState(false);
  const [activeBadgeModal, setActiveBadgeModal] = useState(null);
  const [pendingBadgeIds, setPendingBadgeIds] = useState([]);
  const [pendingBadgesReady, setPendingBadgesReady] = useState(false);
  const [badgePresentationBlockers, setBadgePresentationBlockers] = useState({});
  const [badgeCollectionCompletionSeen, setBadgeCollectionCompletionSeen] = useState(false);
  const [isBadgeCollectionCompletionVisible, setIsBadgeCollectionCompletionVisible] = useState(false);
  const [variantUsage, setVariantUsage] = useState([]);
  const [careerTakeaways, setCareerTakeaways] = useState({});
  const [careerSparkPackage, setCareerSparkPackage] = useState([]);
  const [streakFreezeCredits, setStreakFreezeCredits] = useState(0);
  const [streakFreezeDates, setStreakFreezeDates] = useState([]);
  const [loadErrorMsg, setLoadErrorMsg] = useState(null);
  const [loadAttempt, setLoadAttempt] = useState(0);

  // Güvenlik timeout'u: AsyncStorage 3 saniye içinde tamamlanmazsa devam et
  useEffect(() => {
    const safetyTimer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(safetyTimer);
  }, [loadAttempt]);

  // Fire-and-forget helper for the local→server double-write phase (see
  // ToServerTasks.md §4/§5). Every mutation keeps writing to SQLite/
  // AsyncStorage as the source of truth for now (offline safety); this
  // additionally best-effort mirrors the write to Supabase so multi-device
  // sync/backup starts working without changing local behavior on failure.
  // Silently no-ops when Supabase isn't configured or there's no session yet.
  const serverSync = useCallback((fn) => {
    if (!SUPABASE_LIVE) return;
    (async () => {
      try {
        const user = await getCurrentUser();
        if (user?.id) await fn(user.id);
      } catch (error) {
        console.warn('[server sync] failed:', error?.message);
      }
    })();
  }, []);

  // Okuma istatistiklerini yükle — server-first (single get_user_stats RPC
  // round trip) with a local SQLite fallback when offline/unconfigured/erroring.
  //
  // `preferLocal` skips the server round trip entirely and reads straight
  // from SQLite. addToHistory() passes this right after recordRead() writes
  // the just-completed read locally: recordRead() is awaited (so SQLite is
  // already current), but the server write only happens via the async
  // enqueueAndSync() queue, which hasn't reached Supabase yet. If we asked
  // the server here, it would reply with the pre-read (stale) today_reads
  // and stomp the local count we just earned. All other callers (initial
  // mount, useStreakFreeze) keep the default server-first behavior.
  const refreshStats = useCallback(async ({ preferLocal = false } = {}) => {
    if (!preferLocal) {
      try {
        if (SUPABASE_LIVE) {
          const user = await getCurrentUser();
          if (user?.id) {
            const serverStats = await getUserStatsFromServer();
            if (serverStats) {
              setTotalReads(serverStats.total_reads ?? 0);
              setStreak(serverStats.streak ?? 0);
              setLongestStreak(serverStats.longest_streak ?? 0);
              setCategoryStats(serverStats.reads_per_category ?? {});
              setReadCountsByStory(serverStats.read_counts_by_story ?? {});
              setTodayReadsCount(serverStats.today_reads ?? 0);
              const freezes = await getStreakFreezesFromServer(user.id);
              setStreakFreezeDates(freezes.map((item) => item.day).filter(Boolean));
              return;
            }
          }
        }
      } catch (error) {
        console.warn('[server stats] falling back to local:', error?.message);
      }
    }

    try {
      const {
        getTotalReads,
        getStreak,
        getLongestStreak,
        getReadsPerCategory,
        getReadCountsByStory,
        getTodayReadsCount,
        getStreakFreezes
      } = require('../db/db');
      const [total, s, longest, catStats, storyReadCounts, todayReads] = await Promise.all([
        getTotalReads(),
        getStreak(),
        getLongestStreak(),
        getReadsPerCategory(),
        getReadCountsByStory(),
        getTodayReadsCount(),
      ]);
      setTotalReads(total);
      setStreak(s);
      setLongestStreak(longest);
      setCategoryStats(catStats);
      setReadCountsByStory(storyReadCounts);
      setTodayReadsCount(todayReads);
      const freezes = await getStreakFreezes();
      setStreakFreezeDates(freezes.map((item) => item.day).filter(Boolean));
    } catch (error) {
      console.error('İstatistik yükleme hatası:', error);
    }
  }, []);

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  useEffect(() => {
    if (isLoading) return;
    migrateLegacyCareerPath({
      variantUsage,
      badgeInput: { totalReads, streak, longestStreak, categoryStats, favoritesCount: favorites.length, shareCount },
      lang,
    }).catch((error) => console.warn('[careerMigration] failed:', error?.message));
  }, [isLoading, variantUsage, totalReads, streak, longestStreak, categoryStats, favorites.length, shareCount, lang]);

  // Verileri yükle
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setLoadErrorMsg(null);
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
        const storedStreakFreezeCredits = await AsyncStorage.getItem(STREAK_FREEZE_CREDITS_STORAGE_KEY);

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
        if (storedPremium) setHasPaidPremium(JSON.parse(storedPremium));
        if (storedStreakFreezeCredits) {
          setStreakFreezeCredits(Math.max(0, Number(JSON.parse(storedStreakFreezeCredits)) || 0));
        } else if (storedPremium && JSON.parse(storedPremium)) {
          setStreakFreezeCredits(1);
          await AsyncStorage.setItem(STREAK_FREEZE_CREDITS_STORAGE_KEY, JSON.stringify(1));
        }
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
        const storedCareerTakeaways = await AsyncStorage.getItem(CAREER_TAKEAWAYS_STORAGE_KEY);
        if (storedCareerTakeaways) {
          const parsed = JSON.parse(storedCareerTakeaways);
          const restoredTakeaways = parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
          setCareerTakeaways(restoredTakeaways);
          // Repair a save that happened while its completion event was still
          // being written. This is safe on every launch because D credits are
          // idempotent per story.
          Object.entries(restoredTakeaways).forEach(([storyId, takeaway]) => {
            recordCareerInsightSaved({
              storyId,
              categoryId: takeaway?.categoryId ?? null,
              eventSubtype: takeaway?.reference === 'story_reflection' ? 'story_saved' : 'takeaway_saved',
              metadata: { reference: takeaway?.reference || 'takeaway' },
            }).catch(() => {});
          });
        }
        const storedSparkPackage = await AsyncStorage.getItem(CAREER_SPARK_PACKAGE_STORAGE_KEY);
        if (storedSparkPackage) {
          const parsed = JSON.parse(storedSparkPackage);
          setCareerSparkPackage(Array.isArray(parsed) ? [...new Set(parsed.map((id) => String(id)).filter(Boolean))].slice(0, 5) : []);
        }
      } catch (error) {
        console.error('AsyncStorage veri yükleme hatası:', error);
        setLoadErrorMsg(error?.message || String(error));
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [loadAttempt]);

  const retryUserDataLoad = useCallback(() => {
    setLoadAttempt((attempt) => attempt + 1);
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
      let local = [];
      let shouldBootstrap = false;
      try {
        const raw = await AsyncStorage.getItem(SEEN_BADGES_STORAGE_KEY);
        shouldBootstrap = raw == null;
        const parsed = raw ? JSON.parse(raw) : [];
        local = Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        console.error('Gorulen rozetler yuklenemedi:', error);
      }

      // Merge in badges already marked "seen" on another device — union with
      // whatever's local so a badge already seen server-side never re-pops
      // as a new-badge modal here.
      if (SUPABASE_LIVE) {
        try {
          const user = await getCurrentUser();
          if (user?.id) {
            const serverSeen = await getSeenBadgeIdsFromServer(user.id);
            if (serverSeen.length) {
              const merged = Array.from(new Set([...local, ...serverSeen]));
              if (merged.length !== local.length) {
                await AsyncStorage.setItem(SEEN_BADGES_STORAGE_KEY, JSON.stringify(merged));
              }
              local = merged;
            }
          }
        } catch (error) {
          console.warn('[server badges] failed to fetch seen badges:', error?.message);
        }
      }

      setSeenBadgeIds(local);
      setShouldBootstrapSeenBadges(shouldBootstrap && local.length === 0);
      setSeenBadgesReady(true);
    };

    loadSeenBadges();
  }, []);

  useEffect(() => {
    const loadPendingBadgeState = async () => {
      try {
        const [pendingRaw, completionRaw] = await AsyncStorage.multiGet([
          PENDING_BADGES_STORAGE_KEY,
          BADGE_COLLECTION_COMPLETION_STORAGE_KEY,
        ]);
        const pending = pendingRaw?.[1] ? JSON.parse(pendingRaw[1]) : [];
        setPendingBadgeIds(Array.isArray(pending) ? [...new Set(pending.map(String))] : []);
        setBadgeCollectionCompletionSeen(completionRaw?.[1] === 'true');
      } catch (error) {
        console.warn('Bekleyen rozetler yuklenemedi:', error?.message);
      } finally {
        setPendingBadgesReady(true);
      }
    };

    loadPendingBadgeState();
  }, []);

  // Favoriler
  const toggleFavorite = async (storyId) => {
    try {
      setFavorites((prev) => {
        const strId = String(storyId);
        const wasFavorite = prev.some(id => String(id) === strId);
        const newFavs = wasFavorite
          ? prev.filter(id => String(id) !== strId)
          : [...prev, strId];

        AsyncStorage.setItem('@kivilcim_favorites', JSON.stringify(newFavs));
        enqueueAndSync(wasFavorite ? 'remove_favorite' : 'add_favorite', { storyId: strId });
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
      const willAdd = !current.includes(strId);
      const nextList = willAdd
        ? [...current, strId]
        : current.filter((id) => id !== strId);
      const next = {
        ...prev,
        [collectionId]: [...new Set(nextList)],
      };
      AsyncStorage.setItem(FAVORITE_COLLECTIONS_STORAGE_KEY, JSON.stringify(next));
      enqueueAndSync(willAdd ? 'add_to_collection' : 'remove_from_collection', { storyId: strId, collectionId });
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
      enqueueAndSync('add_favorite', { storyId: strId });
      return nextFavorites;
    });

    setFavoriteCollections((prev) => {
      const current = Array.isArray(prev?.saved_for_later) ? prev.saved_for_later : [];
      const willAdd = !current.includes(strId);
      const nextList = willAdd
        ? [...current, strId]
        : current.filter((id) => id !== strId);
      const next = {
        ...prev,
        saved_for_later: [...new Set(nextList)],
      };
      AsyncStorage.setItem(FAVORITE_COLLECTIONS_STORAGE_KEY, JSON.stringify(next));
      enqueueAndSync(willAdd ? 'add_to_collection' : 'remove_from_collection', { storyId: strId, collectionId: 'saved_for_later' });
      return next;
    });
  };

  const isStoryInFavoriteCollection = (storyId, collectionId = 'saved_for_later') => {
    const strId = String(storyId);
    return (favoriteCollections?.[collectionId] || []).includes(strId);
  };

  // Okuma Geçmişi (Son 20 Hikaye)
  const addToHistory = async (storyOrId, { completionMethod = 'read' } = {}) => {
    try {
      const storyId = typeof storyOrId === 'object' ? storyOrId?.story_id ?? storyOrId?.id : storyOrId;
      const categoryId = typeof storyOrId === 'object' ? storyOrId?.parent_cat_id : null;
      // SQLite'a okuma kaydı ekle
      await recordRead(storyId);
      await recordCareerStoryCompletion({
        storyId,
        categoryId,
        completionMethod,
        skipRevisit: Boolean(careerTakeaways[String(storyId)]),
      }).catch(() => {});
      // A save may happen while the H completion write above is in flight. Read
      // the durable value now (rather than the render-time state captured at
      // the start of this async function) so that order cannot lose the D
      // credit. The D event itself is idempotent per story.
      let savedTakeaway = careerTakeaways[String(storyId)];
      if (!savedTakeaway) {
        const storedTakeaways = await AsyncStorage.getItem(CAREER_TAKEAWAYS_STORAGE_KEY);
        const parsedTakeaways = storedTakeaways ? JSON.parse(storedTakeaways) : null;
        savedTakeaway = parsedTakeaways?.[String(storyId)] || null;
      }
      if (savedTakeaway) {
        await recordCareerInsightSaved({
          storyId,
          categoryId,
          eventSubtype: 'takeaway_saved',
          metadata: { reference: savedTakeaway.reference || 'takeaway' },
        }).catch(() => {});
      }
      // Capture today's date now — if this ends up queued offline and
      // flushed later, it must still record the day the read actually
      // happened, not the day connectivity came back.
      enqueueAndSync('record_read', { storyId, readAt: new Date().toISOString().split('T')[0] });

      setHistory((prev) => {
        const filtered = prev.filter(id => String(id) !== String(storyId));
        const newHist = [String(storyId), ...filtered].slice(0, 20); 
        AsyncStorage.setItem('@kivilcim_history', JSON.stringify(newHist));
        return newHist;
      });

      // İstatistikleri güncelle — recordRead() above already awaited the
      // SQLite write, so read the fresh counts straight from local (SQLite
      // COUNT is naturally dedup'd via the user_reads (user_id, story_id)
      // PK + INSERT OR REPLACE, so a same-day re-read doesn't double count).
      // Deliberately NOT server-first here: the server write is only queued
      // (enqueueAndSync above), so an immediate server refresh would read
      // back today's PRE-read count and clobber the local update we just made.
      await refreshStats({ preferLocal: true });
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

      enqueueAndSync('set_selected_categories', { categoryIds: prefs.categories });
      enqueueAndSync('upsert_profile', { patch: { onboarded: true, preferences: prefs } });
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
        storyVersion: partialPrefs.storyVersion ?? preferences.storyVersion ?? 1,
        storyCollections: partialPrefs.storyCollections ?? preferences.storyCollections ?? DEFAULT_STORY_COLLECTIONS,
      };

      const nextPrefs = normalizePreferences(candidate);
      setPreferences(nextPrefs);
      await AsyncStorage.setItem('@kivilcim_preferences', JSON.stringify(nextPrefs));
      enqueueAndSync('upsert_profile', { patch: { preferences: nextPrefs } });

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
  // Grants Premium locally (persisted) once an entitlement is confirmed —
  // or, when real billing isn't connected, for the dev/local activation flow.
  const activatePremiumLocally = async () => {
    setHasPaidPremium(true);
    setStreakFreezeCredits((prev) => {
      const next = Math.max(prev, 1);
      AsyncStorage.setItem(STREAK_FREEZE_CREDITS_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    await AsyncStorage.setItem('@kivilcim_premium', JSON.stringify(true));
  };

  // DEV-ONLY: force Premium on/off locally to test free vs premium flows
  // (e.g. ads). No-op in production builds.
  const devSetPremium = async (value) => {
    if (!__DEV__) return;
    const next = !!value;
    setHasPaidPremium(next);
    try {
      await AsyncStorage.setItem('@kivilcim_premium', JSON.stringify(next));
    } catch (e) {
      console.warn('[dev] devSetPremium failed:', e?.message);
    }
  };

  // Purchases Premium. With live billing, runs the store purchase via RevenueCat
  // and only unlocks on a confirmed entitlement. Without it, falls back to local
  // activation (dev builds). `pkg` is the RevenueCat package for the chosen plan.
  const buyPremium = async (pkg = null) => {
    try {
      if (!BILLING_LIVE) {
        await activatePremiumLocally();
        return { success: true, live: false };
      }
      const result = await purchasePackage(pkg);
      if (result.success && result.entitled) {
        await activatePremiumLocally();
        return { success: true, live: true };
      }
      return {
        success: false,
        live: true,
        userCancelled: !!result.userCancelled,
        error: result.error,
      };
    } catch (error) {
      console.error('Satın alma hatası:', error);
      return { success: false, error: error?.message };
    }
  };

  // Restores a previous purchase. With live billing, asks RevenueCat and unlocks
  // on a confirmed entitlement. Without it, there is nothing to restore.
  const restorePremium = async () => {
    if (!BILLING_LIVE) return { success: false, live: false };
    try {
      const result = await restorePurchases();
      if (result.success && result.entitled) {
        await activatePremiumLocally();
        return { success: true, live: true, entitled: true };
      }
      return { success: result.success, live: true, entitled: false, error: result.error };
    } catch (error) {
      console.error('Geri yükleme hatası:', error);
      return { success: false, live: true, error: error?.message };
    }
  };

  // Live store packages (localized prices) for the paywall, or null when billing
  // isn't connected — callers then show the built-in fallback prices.
  const getPremiumOfferings = async () => {
    if (!BILLING_LIVE) return null;
    return getOfferingPackages();
  };

  // On launch with live billing, reconcile local Premium with the store's
  // entitlement (handles refunds, lapses, and cross-device restores).
  useEffect(() => {
    if (!BILLING_LIVE || isLoading) return;
    let cancelled = false;
    (async () => {
      const entitled = await checkEntitlement();
      if (cancelled || entitled === null) return;
      setHasPaidPremium(entitled);
      AsyncStorage.setItem('@kivilcim_premium', JSON.stringify(entitled)).catch(() => {});
    })();
    return () => { cancelled = true; };
  }, [isLoading]);

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
      // Mirror both name and email to profiles.email/display_name (free-text
      // fields from the Edit Profile modal — see schema.sql comment on
      // profiles.email for why this is separate from Supabase Auth's own
      // auth.users.email / linkEmailToDeviceAccount()).
      enqueueAndSync('upsert_profile', { patch: { display_name: nextProfile.displayName, email: nextProfile.email } });
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
        enqueueAndSync('upsert_profile', { patch: { share_count: next } });
        return next;
      });
    } catch (error) {
      console.error('Paylaşım sayacı hatası:', error);
    }
  };

  // Varyant kullanım kaydını sil (mark-used geri alındığında)
  const removeVariantUsage = useCallback(async ({ storyId, variantId, variantKey = null }) => {
    try {
      setVariantUsage(prev => {
        const next = prev.filter(
          item =>
            !(
              String(item.storyId) === String(storyId) &&
              (variantKey ? item.variantKey === variantKey : item.variantId === variantId) &&
              item.action === 'mark_used'
            )
        );
        AsyncStorage.setItem(VARIANT_USAGE_STORAGE_KEY, JSON.stringify(next));
        serverSync((uid) => removeVariantUsageOnServer(uid, { storyId, variantId, variantKey }));
        return next;
      });
    } catch (error) {
      console.error('Varyant kullanım silme hatası:', error);
    }
  }, [serverSync]);

  // Varyant kullanım kaydı (copy / share / mark-used)
  const recordVariantUsage = useCallback(async ({ storyId, storyTitle, storyCategory, categoryId = null, variantType, variantId, variantKey = null, action, feedbackRating = null, careerEventSubtype = 'conversation_mark_used' }) => {
    try {
      const entry = {
        storyId: String(storyId),
        storyTitle: storyTitle || '',
        storyCategory: storyCategory || null,
        variantType,
        variantId,
        variantKey: variantKey || null,
        action, // 'copy' | 'share' | 'mark_used'
        feedbackRating,
        usedAt: new Date().toISOString(),
      };
      // `mark_used` is quota-controlled by the server. Do not create a local
      // U credit until that user-visible action was accepted remotely.
      if (action === 'mark_used') {
        const { error: serverError } = await recordVariantUsageOnServer({
          storyId, storyTitle, storyCategory, variantType, variantId, variantKey, action, feedbackRating,
        });
        if (serverError) {
          return { saved: false, reason: serverError.message === 'quota_exceeded' ? 'quota_exceeded' : 'sync_failed' };
        }
      }
      setVariantUsage(prev => {
        const next = [entry, ...prev].slice(0, 2000); // keep last 2000
        AsyncStorage.setItem(VARIANT_USAGE_STORAGE_KEY, JSON.stringify(next));
        return next;
      });
      if (action === 'mark_used') {
        recordCareerApplication({
          storyId,
          categoryId,
          completionMethod: 'use_in_conversation',
          eventSubtype: careerEventSubtype,
          metadata: { variantType, variantId, variantKey: variantKey || null },
        }).catch(() => {});
        // Using a story in a real conversation is both an application and a
        // meaningful way of processing it. D remains one credit per story,
        // so this cannot inflate the path by repeating variants.
        recordCareerInsightSaved({
          storyId,
          categoryId,
          completionMethod: 'use_in_conversation',
          eventSubtype: 'conversation_used',
          metadata: { source: 'conversation' },
        }).catch(() => {});
      }
      trackEvent(ANALYTICS_EVENTS.STORY_VARIANT_USED, {
        storyId: String(storyId),
        storyCategory: storyCategory || null,
        variantType,
        variantId,
        action,
        feedbackRating,
        lang,
      });

      if (action !== 'mark_used') {
        recordVariantUsageOnServer({
          storyId, storyTitle, storyCategory, variantType, variantId, variantKey, action, feedbackRating,
        }).catch(() => {});
      }
      return { saved: true };
    } catch (error) {
      console.error('Varyant kullanım kayıt hatası:', error);
      return { saved: false, reason: 'sync_failed' };
    }
  }, [lang]);

  const isCareerTakeawaySaved = useCallback((storyId) => Boolean(careerTakeaways[String(storyId)]), [careerTakeaways]);

  const saveCareerTakeaway = useCallback(async ({ storyId, categoryId = null, reference = 'takeaway' }) => {
    const normalizedStoryId = String(storyId ?? '').trim();
    if (!normalizedStoryId) return { saved: false, reason: 'invalid_story' };
    if (careerTakeaways[normalizedStoryId]) return { saved: false, reason: 'already_saved' };

    const takeaway = { categoryId, reference, savedAt: new Date().toISOString() };
    const next = { ...careerTakeaways, [normalizedStoryId]: takeaway };
    setCareerTakeaways(next);
    await AsyncStorage.setItem(CAREER_TAKEAWAYS_STORAGE_KEY, JSON.stringify(next));
    const credit = await recordCareerInsightSaved({
      storyId: normalizedStoryId,
      categoryId,
      eventSubtype: 'takeaway_saved',
      metadata: { reference },
    });
    return { saved: true, credit };
  }, [careerTakeaways]);

  // This shared entry point keeps future insight composers on the same
  // idempotent credit path without sending free-form user text to analytics.
  const recordCareerInsight = useCallback(({ storyId, categoryId = null, eventSubtype = 'insight_saved', metadata = null }) => (
    recordCareerInsightSaved({ storyId, categoryId, completionMethod: 'insight_saved', eventSubtype, metadata })
  ), []);

  const recordPrivateCareerApplication = useCallback(({ storyId, categoryId = null, context }) => (
    recordCareerApplication({
      storyId,
      categoryId,
      completionMethod: 'private_application',
      eventSubtype: 'private_application_plan',
      metadata: { context },
    })
  ), []);

  // A private, local-only collection for the Spark Carrier tool. This is a
  // presentation preference, deliberately independent from career events.
  const toggleCareerSparkPackageStory = useCallback((storyId) => {
    setCareerSparkPackage((prev) => {
      const result = updateCareerSparkPackage(prev, storyId);
      if (result.changed) AsyncStorage.setItem(CAREER_SPARK_PACKAGE_STORAGE_KEY, JSON.stringify(result.package));
      return result.package;
    });
  }, []);

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
        PENDING_BADGES_STORAGE_KEY,
        BADGE_COLLECTION_COMPLETION_STORAGE_KEY,
        VARIANT_USAGE_STORAGE_KEY,
        CAREER_TAKEAWAYS_STORAGE_KEY,
        CAREER_SPARK_PACKAGE_STORAGE_KEY,
        STREAK_FREEZE_CREDITS_STORAGE_KEY,
      ]);
      setFavorites([]);
      setHistory([]);
      setPreferences(EMPTY_PREFERENCES);
      setFavoriteCollections(EMPTY_FAVORITE_COLLECTIONS);
      setCompletedStories([]);
      setUserProfile(EMPTY_USER_PROFILE);
      setIsOnboarded(false);
      setHasPaidPremium(false);
      setShareCount(0);
      setSeenBadgeIds([]);
      setActiveBadgeModal(null);
      setPendingBadgeIds([]);
      setBadgeCollectionCompletionSeen(false);
      setIsBadgeCollectionCompletionVisible(false);
      setVariantUsage([]);
      setCareerTakeaways({});
      setCareerSparkPackage([]);
      setStreakFreezeCredits(0);
      setStreakFreezeDates([]);
      await clearStreakFreezes();
      // Progress stats live in the user_reads DB table, not AsyncStorage — wipe
      // them too, then reset the derived in-memory state so the UI updates.
      await clearUserReads();
      // Career events live in their own durable user DB, so reset them
      // explicitly instead of relying on the content DB reset mechanism.
      await clearCareerData('default');
      notifyCareerDataChanged();
      enqueueAndSync('reset_user_data', {});
      setTotalReads(0);
      setStreak(0);
      setLongestStreak(0);
      setCategoryStats([]);
      setReadCountsByStory({});
      setTodayReadsCount(0);
      // Clear global categories in ThemeContext too
      await setGlobalCategories([]);
    } catch (error) {
      console.error('Veri silme hatası:', error);
    }
  };

  // Rozetleri hesapla
  const earnedBadges = useMemo(() => {
    if (FEATURE_FLAGS.careerPathV1) return [];
    return checkBadges({
      totalReads,
      streak,
      longestStreak,
      categoryStats,
      favoritesCount: favorites.length,
      shareCount,
      variantUsage,
    });
  },
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

    // Mirror newly-seen badges to Supabase (user_badges) — best-effort, same
    // fire-and-forget pattern as the rest of this file's serverSync() calls,
    // so multi-device badge state and the "progress/achievements" data live
    // server-side going forward (not just via the one-time local migration).
    serverSync((uid) => markBadgesSeenOnServer(uid, badgeIds));
  }, [seenBadgeIds, serverSync]);

  const enqueuePendingBadges = useCallback((badgeIds) => {
    const normalizedIds = [...new Set((badgeIds || []).map(String).filter(Boolean))];
    if (!normalizedIds.length) return;

    setPendingBadgeIds((previous) => {
      const next = [...new Set([...previous, ...normalizedIds])];
      if (next.length !== previous.length) {
        AsyncStorage.setItem(PENDING_BADGES_STORAGE_KEY, JSON.stringify(next)).catch((error) => {
          console.warn('Bekleyen rozetler kaydedilemedi:', error?.message);
        });
      }
      return next;
    });
  }, []);

  const removePendingBadge = useCallback((badgeId) => {
    if (!badgeId) return;
    setPendingBadgeIds((previous) => {
      const next = previous.filter((id) => id !== String(badgeId));
      if (next.length !== previous.length) {
        AsyncStorage.setItem(PENDING_BADGES_STORAGE_KEY, JSON.stringify(next)).catch((error) => {
          console.warn('Bekleyen rozetler guncellenemedi:', error?.message);
        });
      }
      return next;
    });
  }, []);

  const setBadgePresentationBlocked = useCallback((key, blocked) => {
    if (!key) return;
    setBadgePresentationBlockers((previous) => {
      const next = { ...previous };
      if (blocked) next[key] = true;
      else delete next[key];
      return next;
    });
  }, []);

  useEffect(() => {
    if (FEATURE_FLAGS.careerPathV1) return;
    if (!seenBadgesReady || !pendingBadgesReady || !earnedBadges.length) return;

    if (shouldBootstrapSeenBadges) {
      const alreadyEarnedIds = earnedBadges.filter((badge) => badge.earned).map((badge) => badge.id);
      markBadgesAsSeen(alreadyEarnedIds);
      setShouldBootstrapSeenBadges(false);
      return;
    }

    const newlyEarned = earnedBadges.filter((badge) => (
      badge.earned
      && !seenBadgeIds.includes(badge.id)
      && !pendingBadgeIds.includes(badge.id)
    ));
    if (!newlyEarned.length) return;

    enqueuePendingBadges(newlyEarned.map((badge) => badge.id));
  }, [earnedBadges, seenBadgeIds, pendingBadgeIds, seenBadgesReady, pendingBadgesReady, enqueuePendingBadges, markBadgesAsSeen, shouldBootstrapSeenBadges]);

  const openBadgeModal = useCallback((badge) => {
    if (FEATURE_FLAGS.careerPathV1) return;
    if (!badge) return;
    setActiveBadgeModal({ ...badge, presentation: 'manual' });
  }, []);

  const closeBadgeModal = useCallback(() => {
    const closedBadge = activeBadgeModal;
    setActiveBadgeModal(null);
    if (closedBadge?.presentation === 'earned') {
      markBadgesAsSeen([closedBadge.id]);
      removePendingBadge(closedBadge.id);
    }
  }, [activeBadgeModal, markBadgesAsSeen, removePendingBadge]);

  // Legacy call-sites still invoke this after a read. Presentation is now
  // coordinated below so share sheets and other overlays can safely block it.
  const releasePendingBadge = useCallback(() => {
  }, []);

  const isBadgePresentationBlocked = Object.keys(badgePresentationBlockers).length > 0;

  useEffect(() => {
    if (FEATURE_FLAGS.careerPathV1) return;
    if (!pendingBadgesReady || !seenBadgesReady || activeBadgeModal || isBadgeCollectionCompletionVisible || isBadgePresentationBlocked) return;
    const nextId = pendingBadgeIds[0];
    if (!nextId) return;

    const nextBadge = earnedBadges.find((badge) => badge.id === nextId);
    if (!nextBadge?.earned) {
      removePendingBadge(nextId);
      return;
    }

    const timer = setTimeout(() => {
      setActiveBadgeModal({ ...nextBadge, presentation: 'earned' });
    }, 400);
    return () => clearTimeout(timer);
  }, [pendingBadgeIds, pendingBadgesReady, seenBadgesReady, earnedBadges, activeBadgeModal, isBadgeCollectionCompletionVisible, isBadgePresentationBlocked, removePendingBadge]);

  const allBadgesCompleted = earnedBadges.length > 0 && earnedBadges.every((badge) => badge.earned);

  useEffect(() => {
    if (FEATURE_FLAGS.careerPathV1) return;
    if (
      !allBadgesCompleted
      || badgeCollectionCompletionSeen
      || isBadgeCollectionCompletionVisible
      || activeBadgeModal
      || pendingBadgeIds.length > 0
      || isBadgePresentationBlocked
    ) return;

    const timer = setTimeout(() => setIsBadgeCollectionCompletionVisible(true), 400);
    return () => clearTimeout(timer);
  }, [allBadgesCompleted, badgeCollectionCompletionSeen, isBadgeCollectionCompletionVisible, activeBadgeModal, pendingBadgeIds.length, isBadgePresentationBlocked]);

  const closeBadgeCollectionCompletionModal = useCallback(() => {
    setIsBadgeCollectionCompletionVisible(false);
    setBadgeCollectionCompletionSeen(true);
    AsyncStorage.setItem(BADGE_COLLECTION_COMPLETION_STORAGE_KEY, 'true').catch((error) => {
      console.warn('Rozet koleksiyonu durumu kaydedilemedi:', error?.message);
    });
  }, []);

  const unseenEarnedBadgeCount = useMemo(
    () => earnedBadges.filter((b) => b.earned && !seenBadgeIds.includes(b.id)).length,
    [earnedBadges, seenBadgeIds]
  );

  const useStreakFreeze = useCallback(async (dateStr = new Date().toISOString().split('T')[0]) => {
    if (!isPremium || streakFreezeCredits <= 0 || streakFreezeDates.includes(dateStr)) {
      return { success: false };
    }

    try {
      await recordStreakFreeze(dateStr);
      const nextCredits = Math.max(0, streakFreezeCredits - 1);
      setStreakFreezeCredits(nextCredits);
      setStreakFreezeDates(prev => Array.from(new Set([dateStr, ...prev])));
      await AsyncStorage.setItem(STREAK_FREEZE_CREDITS_STORAGE_KEY, JSON.stringify(nextCredits));
      enqueueAndSync('record_streak_freeze', { dateStr });
      enqueueAndSync('upsert_profile', { patch: { streak_freeze_credits: nextCredits } });
      await refreshStats();
      await trackEvent(ANALYTICS_EVENTS.STREAK_FREEZE_ACTIVATED, {
        date: dateStr,
        remainingCredits: nextCredits,
        streak,
        lang,
      });
      return { success: true };
    } catch (error) {
      console.error('Streak freeze kullanilamadi:', error);
      return { success: false };
    }
  }, [isPremium, streakFreezeCredits, streakFreezeDates, refreshStats, streak, lang]);

  const value = useMemo(() => ({
    favorites,
    history,
    preferences,
    userProfile,
    isOnboarded,
    isPremium,
    isLoadingUserData: isLoading,
    loadErrorMsg,
    retryUserDataLoad,
    streak,
    totalReads,
    todayReadsCount,
    longestStreak,
    categoryStats,
    readCountsByStory,
    favoriteCollections,
    completedStories,
    shareCount,
    earnedBadges,
    activeBadgeModal,
    isBadgeCollectionCompletionVisible,
    unseenEarnedBadgeCount,
    streakFreezeCredits,
    streakFreezeDates,
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
    restorePremium,
    devSetPremium,
    getPremiumOfferings,
    billingLive: BILLING_LIVE,
    updateUserProfile,
    incrementShareCount,
    recordVariantUsage,
    saveCareerTakeaway,
    isCareerTakeawaySaved,
    recordCareerInsight,
    recordPrivateCareerApplication,
    removeVariantUsage,
    variantUsage,
    careerTakeaways,
    careerSparkPackage,
    toggleCareerSparkPackageStory,
    clearUserData,
    refreshStats,
    openBadgeModal,
    closeBadgeModal,
    releasePendingBadge,
    setBadgePresentationBlocked,
    closeBadgeCollectionCompletionModal,
    useStreakFreeze,
  }), [favorites, history, preferences, userProfile, isOnboarded, isPremium, isLoading, loadErrorMsg, retryUserDataLoad, streak, totalReads, todayReadsCount, longestStreak, categoryStats, readCountsByStory, favoriteCollections, completedStories, shareCount, earnedBadges, activeBadgeModal, isBadgeCollectionCompletionVisible, unseenEarnedBadgeCount, streakFreezeCredits, streakFreezeDates, variantUsage, careerTakeaways, careerSparkPackage, isStorySavedForLater, toggleReadLater, isStoryCompleted, recordVariantUsage, saveCareerTakeaway, isCareerTakeawaySaved, recordCareerInsight, recordPrivateCareerApplication, removeVariantUsage, toggleCareerSparkPackageStory, openBadgeModal, closeBadgeModal, releasePendingBadge, setBadgePresentationBlocked, closeBadgeCollectionCompletionModal, useStreakFreeze]);

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

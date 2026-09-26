import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from './ThemeContext';
import { recordRead, getTotalReads, getStreak, getLongestStreak, getReadsPerCategory, getReadCountsByStory, recordStreakFreeze, getStreakFreezes, clearStreakFreezes, clearUserReads } from '../db/db';
import { checkBadges } from '../utils/badges';
import { scheduleDailyNotifications } from '../utils/notifications';
import { ANALYTICS_EVENTS, trackEvent, setAnalyticsContext } from '../utils/analytics';
import { maybeRequestReview } from '../utils/review';
import {
  BILLING_LIVE,
  purchasePackage,
  restorePurchases,
  getOfferingPackages,
  fetchEntitlement,
  addCustomerInfoListener,
} from '../services/billing';
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
import { toLocalDay } from '../utils/localDate';
import {
  FREE_DAILY_STORY_QUOTA,
  normalizeRecord as normalizeFreeQuota,
  quotaUsed as freeQuotaUsedFor,
  quotaRemaining as freeQuotaRemainingFor,
  isUnlocked as isFreeUnlocked,
  spend as spendFreeQuota,
} from '../utils/freeQuota';
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
// Tracks the last calendar month ('YYYY-MM') a subscriber was granted their
// monthly streak-freeze credit, so the credit renews once a month instead of
// only once at the moment Premium first activates.
const STREAK_FREEZE_LAST_GRANT_MONTH_KEY = '@albor_streak_freeze_last_grant_month';
const STREAK_FREEZE_MAX_CREDITS = 3;
// Full entitlement snapshot (product, expiry, renewal intent, trial state).
// `@kivilcim_premium` stays as the boolean so existing installs keep Premium.
const ENTITLEMENT_STORAGE_KEY = '@albor_entitlement';
// A temporary, non-purchase Premium window granted by the referral reward
// (see claimReferral in supabase.js) — stored separately from the real
// subscription entitlement above so it can never be mistaken for one.
// Value is an ISO timestamp string, or null.
const PREMIUM_BONUS_STORAGE_KEY = '@albor_premium_bonus_until';

// The free tier's real daily cap.
//
// Stored as { day: 'YYYY-MM-DD', storyIds: [...] } rather than a bare number so
// that (a) it resets on the local calendar day, and (b) re-opening a story the
// user already spent quota on today doesn't spend it twice. Without a persisted,
// date-keyed record the "3 free stories" limit is not a limit at all — reading
// them just moves them out of the candidate pool and three more become free.
const FREE_READS_STORAGE_KEY = '@albor_free_reads';
const STORY_COLLECTION_IDS = ['classic', 'new', 'agent', 'focus', 'conversation', 'originals'];
const DEFAULT_STORY_COLLECTIONS = ['new'];
const EMPTY_PREFERENCES = {
  categories: [], time: null, reminderWindow: 'evening', reminderHour: 21,
  reminderWindows: ['evening'], storyVersion: 2, storyCollections: DEFAULT_STORY_COLLECTIONS,
  remindersEnabled: true,
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
    // Master reminder switch (Profile). Missing = on, so existing users keep reminders.
    remindersEnabled: storedPreferences.remindersEnabled !== false,
  };
};

// Grants one streak-freeze credit per calendar month to an active subscriber,
// capped at STREAK_FREEZE_MAX_CREDITS. Idempotent within a month: calling it
// repeatedly (e.g. on every app launch) only ever grants once per month key.
const grantMonthlyStreakFreezeCredit = async (currentCredits) => {
  const monthKey = new Date().toISOString().slice(0, 7); // 'YYYY-MM'
  try {
    const lastGrantMonth = await AsyncStorage.getItem(STREAK_FREEZE_LAST_GRANT_MONTH_KEY);
    if (lastGrantMonth === monthKey) return currentCredits;
    const next = Math.min(STREAK_FREEZE_MAX_CREDITS, Math.max(currentCredits, 0) + 1);
    await AsyncStorage.setItem(STREAK_FREEZE_LAST_GRANT_MONTH_KEY, monthKey);
    await AsyncStorage.setItem(STREAK_FREEZE_CREDITS_STORAGE_KEY, JSON.stringify(next));
    return next;
  } catch (e) {
    console.warn('[streak freeze] monthly grant failed:', e?.message);
    return currentCredits;
  }
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
  // Null when Premium came from a legacy boolean-only install or a dev
  // activation; otherwise the store's own view of the subscription.
  const [entitlement, setEntitlement] = useState(null);

  // Mirrors of the two values above. The customer-info listener needs to compare
  // the incoming state against the previous one, but must not re-subscribe every
  // time Premium changes — so it reads the latest values through these refs.
  // { day, storyIds } — see FREE_READS_STORAGE_KEY.
  const [freeReadsToday, setFreeReadsToday] = useState({ day: null, storyIds: [] });

  const hasPaidPremiumRef = useRef(false);
  const entitlementRef = useRef(null);
  useEffect(() => { hasPaidPremiumRef.current = hasPaidPremium; }, [hasPaidPremium]);
  useEffect(() => { entitlementRef.current = entitlement; }, [entitlement]);

  // Referral reward window (see applyReferralBonus / claimReferral). Distinct
  // from `hasPaidPremium` on purpose — it's a capped, server-granted
  // promotional unlock, never the "free premium" shortcut removed in Faz 0.
  const [premiumBonusUntil, setPremiumBonusUntil] = useState(null);

  const isPremium = useMemo(() => {
    if (hasPaidPremium) return true;
    return !!premiumBonusUntil && Date.now() < premiumBonusUntil;
  }, [hasPaidPremium, premiumBonusUntil]);
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
  const streakFreezeCreditsRef = useRef(0);
  useEffect(() => { streakFreezeCreditsRef.current = streakFreezeCredits; }, [streakFreezeCredits]);
  const [streakFreezeDates, setStreakFreezeDates] = useState([]);
  const [loadErrorMsg, setLoadErrorMsg] = useState(null);
  const [loadAttempt, setLoadAttempt] = useState(0);

  // Güvenlik timeout'u: AsyncStorage 3 saniye içinde tamamlanmazsa devam et
  useEffect(() => {
    const safetyTimer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(safetyTimer);
  }, [loadAttempt]);

  // Store-review prompt at another positive moment: a completed 3-day streak.
  // Fires once per streak crossing (not on every read while streak stays >=3);
  // `maybeRequestReview` itself caps this to once a year regardless.
  const reviewStreakPromptedRef = useRef(false);
  useEffect(() => {
    if (isLoading) return;
    if (streak >= 3) {
      if (!reviewStreakPromptedRef.current) {
        reviewStreakPromptedRef.current = true;
        maybeRequestReview({ isPremium, totalReads }).catch(() => {});
      }
    } else {
      reviewStreakPromptedRef.current = false;
    }
  }, [isLoading, streak, isPremium, totalReads]);

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
        const storedEntitlement = await AsyncStorage.getItem(ENTITLEMENT_STORAGE_KEY);
        const storedFreeReads = await AsyncStorage.getItem(FREE_READS_STORAGE_KEY);
        const storedPremiumBonusUntil = await AsyncStorage.getItem(PREMIUM_BONUS_STORAGE_KEY);

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
        if (storedEntitlement) {
          try { setEntitlement(JSON.parse(storedEntitlement)); } catch (e) { /* corrupt cache, ignore */ }
        }
        if (storedFreeReads) {
          try {
            setFreeReadsToday(normalizeFreeQuota(JSON.parse(storedFreeReads)));
          } catch (e) { /* corrupt cache, ignore */ }
        }
        if (storedPremiumBonusUntil) {
          const parsedBonusUntil = Number(storedPremiumBonusUntil);
          if (Number.isFinite(parsedBonusUntil) && parsedBonusUntil > Date.now()) {
            setPremiumBonusUntil(parsedBonusUntil);
          } else {
            await AsyncStorage.removeItem(PREMIUM_BONUS_STORAGE_KEY);
          }
        }
        const parsedStreakFreezeCredits = storedStreakFreezeCredits
          ? Math.max(0, Number(JSON.parse(storedStreakFreezeCredits)) || 0)
          : 0;
        if (storedPremium && JSON.parse(storedPremium)) {
          setStreakFreezeCredits(await grantMonthlyStreakFreezeCredit(parsedStreakFreezeCredits));
        } else if (storedStreakFreezeCredits) {
          setStreakFreezeCredits(parsedStreakFreezeCredits);
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
        remindersEnabled: prefs.remindersEnabled,
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
        || Object.prototype.hasOwnProperty.call(partialPrefs, 'reminderHour')
        || Object.prototype.hasOwnProperty.call(partialPrefs, 'remindersEnabled');
      const candidate = {
        categories: partialPrefs.categories ?? preferences.categories,
        time: partialPrefs.time ?? preferences.time,
        reminderWindows: partialPrefs.reminderWindows ?? preferences.reminderWindows ?? [preferences.reminderWindow || 'evening'],
        reminderWindow: partialPrefs.reminderWindow ?? preferences.reminderWindow,
        reminderHour: partialPrefs.reminderHour ?? preferences.reminderHour,
        storyVersion: partialPrefs.storyVersion ?? preferences.storyVersion ?? 1,
        storyCollections: partialPrefs.storyCollections ?? preferences.storyCollections ?? DEFAULT_STORY_COLLECTIONS,
        remindersEnabled: partialPrefs.remindersEnabled ?? preferences.remindersEnabled ?? true,
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
        remindersEnabled: nextPrefs.remindersEnabled,
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

  // ─── Free daily quota ─────────────────────────────────────────────────────
  // Premium is unlimited. For everyone else, opening a story that isn't already
  // read and isn't already in today's set spends one of FREE_DAILY_STORY_QUOTA.

  // The rules themselves live in utils/freeQuota.js so a UI change can't
  // silently redefine what "3 free stories a day" means.
  // Must never be null: `spentToday` treats an unknown day as "nothing spent",
  // so a null key would turn the cap into an unlimited tier. `toLocalDay` only
  // fails if Intl throws, and a UTC day is a correct-enough fallback (it is
  // already what db.js uses for read bookkeeping).
  const todayKey = () => toLocalDay(new Date(), {
    fallback: new Date().toISOString().split('T')[0],
  });

  const freeQuotaUsed = isPremium ? 0 : freeQuotaUsedFor(freeReadsToday, todayKey());
  const freeQuotaRemaining = isPremium
    ? Infinity
    : freeQuotaRemainingFor(freeReadsToday, todayKey());

  const isStoryUnlockedToday = useCallback((storyId) => {
    if (isPremium) return true;
    return isFreeUnlocked({
      record: freeReadsToday,
      today: todayKey(),
      history: history || [],
      storyId,
    });
  }, [isPremium, freeReadsToday, history]);

  /** True when the story can be opened right now without hitting the paywall. */
  const canOpenStoryFree = useCallback((storyId) => {
    if (isPremium) return true;
    if (isStoryUnlockedToday(storyId)) return true;
    return freeQuotaRemaining > 0;
  }, [isPremium, isStoryUnlockedToday, freeQuotaRemaining]);

  /**
   * Spends one unit of today's quota for `storyId`. Returns true when the story
   * may be opened, false when the caller should show the paywall instead.
   */
  const consumeFreeRead = useCallback(async (storyId) => {
    if (isPremium) return true;

    const result = spendFreeQuota({
      record: freeReadsToday,
      today: todayKey(),
      history: history || [],
      storyId,
    });

    if (result.spent) {
      setFreeReadsToday(result.record);
      try {
        await AsyncStorage.setItem(FREE_READS_STORAGE_KEY, JSON.stringify(result.record));
      } catch (e) {
        console.warn('[free quota] persist failed:', e?.message);
      }
    }
    return result.allowed;
  }, [isPremium, freeReadsToday, history]);

  // Applies a subscription state confirmed by the store. `snapshot` is the
  // normalized entitlement from billing.js (null for a legacy/dev unlock).
  //
  // This is the ONLY path that turns Premium on. It is never reachable from a
  // user tap unless the store confirmed an entitlement — see `buyPremium`.
  const applyEntitlement = useCallback(async (isEntitled, snapshot = null) => {
    setHasPaidPremium(isEntitled);
    setEntitlement(isEntitled ? snapshot : null);

    if (isEntitled) {
      const next = await grantMonthlyStreakFreezeCredit(streakFreezeCreditsRef.current);
      setStreakFreezeCredits(next);
    }

    try {
      await AsyncStorage.setItem('@kivilcim_premium', JSON.stringify(isEntitled));
      if (isEntitled && snapshot) {
        await AsyncStorage.setItem(ENTITLEMENT_STORAGE_KEY, JSON.stringify(snapshot));
      } else {
        await AsyncStorage.removeItem(ENTITLEMENT_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('[billing] persisting entitlement failed:', e?.message);
    }
  }, []);

  // Applies a referral reward window confirmed by the `claim_referral` server
  // RPC (see supabase.js#claimReferral). Never called with a client-guessed
  // value — the caller must have a `premiumBonusUntil` ISO string straight
  // from that RPC's response.
  const applyReferralBonus = useCallback(async (premiumBonusUntilIso, meta = {}) => {
    const untilMs = premiumBonusUntilIso ? new Date(premiumBonusUntilIso).getTime() : NaN;
    if (!Number.isFinite(untilMs) || untilMs <= Date.now()) return;

    setPremiumBonusUntil(untilMs);
    try {
      await AsyncStorage.setItem(PREMIUM_BONUS_STORAGE_KEY, String(untilMs));
    } catch (e) {
      console.warn('[referral] persisting bonus failed:', e?.message);
    }
    trackEvent(ANALYTICS_EVENTS.REFERRAL_REWARD_GRANTED, { ...meta, premiumBonusUntil: premiumBonusUntilIso });
  }, []);

  // DEV-ONLY: force Premium on/off locally to test free vs premium flows
  // (e.g. ads). No-op in production builds.
  const devSetPremium = async (value) => {
    if (!__DEV__) return;
    await applyEntitlement(!!value, null);
  };

  // Purchases Premium through the store and unlocks ONLY on a confirmed
  // entitlement. `pkg` is the RevenueCat package for the chosen plan.
  //
  // When billing isn't connected (`BILLING_LIVE === false`) this must NOT grant
  // anything: a dev-build convenience that unlocks the paid tier would ship as
  // a free app in production and would report fake purchases to analytics.
  // Dev builds get the local unlock explicitly via `devSetPremium`.
  const buyPremium = async (pkg = null) => {
    try {
      if (!BILLING_LIVE) {
        return { success: false, live: false, error: 'billing_not_live' };
      }
      const result = await purchasePackage(pkg);
      if (result.success && result.entitled) {
        await applyEntitlement(true, result.entitlement);
        return { success: true, live: true, entitlement: result.entitlement };
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
        await applyEntitlement(true, result.entitlement);
        return { success: true, live: true, entitled: true, entitlement: result.entitlement };
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
      const result = await fetchEntitlement();
      if (cancelled || !result) return;
      await applyEntitlement(result.entitled, result.entitlement);
    })();
    return () => { cancelled = true; };
  }, [isLoading, applyEntitlement]);

  // Subscription state can change without the user touching the paywall — a
  // renewal, a cancellation, a refund, or a purchase on another device. Without
  // this listener the app would keep showing Premium until the next cold start.
  //
  // Also the only place renewal / cancellation / refund telemetry can come from
  // on-device: `paywall_purchase_succeeded` alone can't tell churn from growth.
  useEffect(() => {
    if (!BILLING_LIVE || isLoading) return;
    const prevRef = { entitled: hasPaidPremiumRef.current, snapshot: entitlementRef.current };

    const unsubscribe = addCustomerInfoListener(({ entitled, entitlement: snapshot }) => {
      const was = prevRef.entitled;
      const wasSnapshot = prevRef.snapshot;
      prevRef.entitled = entitled;
      prevRef.snapshot = snapshot;

      applyEntitlement(entitled, snapshot).catch(() => {});

      const eventProps = {
        product_id: snapshot?.productId || wasSnapshot?.productId,
        period_type: snapshot?.periodType || wasSnapshot?.periodType,
        expires_at: snapshot?.expiresAt || wasSnapshot?.expiresAt,
        lang,
      };

      if (!was && entitled) {
        // Gained access outside the paywall flow (cross-device, or a trial that
        // converted while the app was backgrounded).
        trackEvent(
          snapshot?.isTrial ? ANALYTICS_EVENTS.TRIAL_STARTED : ANALYTICS_EVENTS.SUBSCRIPTION_RENEWED,
          eventProps,
        );
      } else if (was && !entitled) {
        trackEvent(ANALYTICS_EVENTS.SUBSCRIPTION_EXPIRED, eventProps);
      } else if (was && entitled) {
        if (wasSnapshot?.isTrial && !snapshot?.isTrial) {
          trackEvent(ANALYTICS_EVENTS.TRIAL_CONVERTED, eventProps);
        } else if (wasSnapshot?.willRenew && !snapshot?.willRenew) {
          // Cancelled but still inside the paid period — the earliest churn signal.
          trackEvent(ANALYTICS_EVENTS.SUBSCRIPTION_CANCELLED, eventProps);
        } else if (wasSnapshot?.expiresAt && snapshot?.expiresAt
          && snapshot.expiresAt !== wasSnapshot.expiresAt) {
          trackEvent(ANALYTICS_EVENTS.SUBSCRIPTION_RENEWED, eventProps);
        }
      }
    });

    return unsubscribe;
  }, [isLoading, applyEntitlement, lang]);

  // Reschedules the OS notifications at most once per day (or immediately
  // when a setting the copy/time actually depends on changes) instead of on
  // every read — `cancelAllScheduledNotificationsAsync` + a full reschedule
  // on every single read event needlessly hammers the OS scheduler.
  // `totalReads`/`streak`/`shareCount` still refresh the notification copy,
  // just only once the day (or the relevant settings) actually changes.
  const lastNotificationScheduleRef = useRef({ day: null, signature: null });
  useEffect(() => {
    if (!isOnboarded || isLoading) return;
    if (!preferences?.time?.dailyStoryTarget) return;

    const day = todayKey();
    const signature = JSON.stringify({
      lang,
      reminderWindows: preferences.reminderWindows,
      reminderWindow: preferences.reminderWindow,
      reminderHour: preferences.reminderHour,
      remindersEnabled: preferences.remindersEnabled,
      dailyStoryTarget: preferences.time.dailyStoryTarget,
      isPremium,
    });
    const last = lastNotificationScheduleRef.current;
    if (last.day === day && last.signature === signature) return;
    lastNotificationScheduleRef.current = { day, signature };

    scheduleDailyNotifications({
      lang,
      reminderWindows: preferences.reminderWindows,
      reminderWindow: preferences.reminderWindow,
      reminderHour: preferences.reminderHour,
      remindersEnabled: preferences.remindersEnabled,
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
      maybeRequestReview({ isPremium, totalReads }).catch(() => {});
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
        ENTITLEMENT_STORAGE_KEY,
        FREE_READS_STORAGE_KEY,
      ]);
      setFavorites([]);
      setHistory([]);
      setPreferences(EMPTY_PREFERENCES);
      setFavoriteCollections(EMPTY_FAVORITE_COLLECTIONS);
      setCompletedStories([]);
      setUserProfile(EMPTY_USER_PROFILE);
      setIsOnboarded(false);
      setHasPaidPremium(false);
      setEntitlement(null);
      setFreeReadsToday({ day: null, storyIds: [] });
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
      maybeRequestReview({ isPremium, totalReads }).catch(() => {});
    }
  }, [activeBadgeModal, markBadgesAsSeen, removePendingBadge, isPremium, totalReads]);

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
    entitlement,
    premiumBonusUntil,
    applyReferralBonus,
    freeDailyQuota: FREE_DAILY_STORY_QUOTA,
    freeQuotaUsed,
    freeQuotaRemaining,
    isStoryUnlockedToday,
    canOpenStoryFree,
    consumeFreeRead,
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
  }), [favorites, history, preferences, userProfile, isOnboarded, isPremium, entitlement, premiumBonusUntil,
    freeQuotaUsed, freeQuotaRemaining, isStoryUnlockedToday, canOpenStoryFree, consumeFreeRead, isLoading, loadErrorMsg, retryUserDataLoad, streak, totalReads, todayReadsCount, longestStreak, categoryStats, readCountsByStory, favoriteCollections, completedStories, shareCount, earnedBadges, activeBadgeModal, isBadgeCollectionCompletionVisible, unseenEarnedBadgeCount, streakFreezeCredits, streakFreezeDates, variantUsage, careerTakeaways, careerSparkPackage, isStorySavedForLater, toggleReadLater, isStoryCompleted, recordVariantUsage, saveCareerTakeaway, isCareerTakeawaySaved, recordCareerInsight, recordPrivateCareerApplication, removeVariantUsage, toggleCareerSparkPackageStory, openBadgeModal, closeBadgeModal, releasePendingBadge, setBadgePresentationBlocked, closeBadgeCollectionCompletionModal, useStreakFreeze]);

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

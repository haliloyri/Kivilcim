import React, { useState, useEffect, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  View, Text, ScrollView, TouchableOpacity, StyleSheet, 
  StatusBar, Platform, Dimensions, Animated, Modal, TextInput, Image, useWindowDimensions, FlatList
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useUserData } from '../context/UserDataContext';
import { useStories } from '../context/StoriesContext';
import { getSelectedCategories } from '../db/db';
import StoryCard from '../components/StoryCard';
import CategoryPill from '../components/CategoryPill';
import AdOrPremiumSheet from '../components/AdOrPremiumSheet';
import { Ionicons } from '@expo/vector-icons';
import { t, getGreeting } from '../locales/i18n';
import { ANALYTICS_EVENTS, trackEvent } from '../utils/analytics';
import { getCategoryImage, getCategoryTheme } from '../utils/categoryImages';
import { shouldShowAd, loadRewarded } from '../utils/ads';

const FIRST_SESSION_PROMPT_KEY = '@kivilcim_first_session_prompt';
const PERSONALIZED_MODULE_SNOOZE_KEY = '@kivilcim_personalized_module_snooze_until';
const PROFILE_INFO_PROMPT_SEEN_KEY = '@kivilcim_profile_info_prompt_seen';

const MODULE_TYPES = {
  CONTINUE: 'continue',
  PICKED: 'picked',
  FALLBACK: 'fallback',
};

const SkeletonCard = ({ colors, layout, isHero }) => (
  <View style={{
    width: isHero ? '100%' : (Dimensions.get('window').width - (layout.padding.horizontal * 2) - 12) / 2,
    height: isHero ? 200 : 160,
    backgroundColor: colors.backgroundDark,
    borderRadius: 12,
    marginBottom: 16,
    opacity: 0.5
  }} />
);

const toPascalCase = (value = '') => {
  const normalized = String(value || '').trim();
  if (!normalized) return '';

  return normalized
    .split(/\s+/)
    .map((part) => {
      const lower = part.toLocaleLowerCase('tr-TR');
      return lower.charAt(0).toLocaleUpperCase('tr-TR') + lower.slice(1);
    })
    .join(' ');
};

/** Circular daily progress ring shown in the home header */
const DailyProgressRing = ({ done, total, size = 42, colors, isDark, onPress }) => {
  const sw = 3;
  const pct = total > 0 ? Math.min(done / total, 1) : 0;
  const isDone = done >= total && total > 0;
  const inner = size - sw * 2;
  // Two-half clip trick: right half covers first 180┬░, left half covers next 180┬░
  const rightDeg = Math.min(pct * 360, 180) - 90;
  const leftDeg = (pct * 360 > 180 ? pct * 360 - 180 : 0) - 90;
  const trackColor = isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.09)';
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.75} style={{ width: size, height: size }}>
      {/* background track */}
      <View style={{ position: 'absolute', width: size, height: size, borderRadius: size / 2, borderWidth: sw, borderColor: trackColor }} />
      {/* right half progress (0 ÔåÆ 180┬░) */}
      {pct > 0 && (
        <View style={{ position: 'absolute', width: size / 2, height: size, left: size / 2, overflow: 'hidden' }}>
          <View style={{
            position: 'absolute', left: -(size / 2), width: size, height: size,
            borderRadius: size / 2, borderWidth: sw, borderColor: colors.primary,
            transform: [{ rotate: `${rightDeg}deg` }],
          }} />
        </View>
      )}
      {/* left half progress (180┬░ ÔåÆ 360┬░) */}
      {pct > 0.5 && (
        <View style={{ position: 'absolute', width: size / 2, height: size, left: 0, overflow: 'hidden' }}>
          <View style={{
            position: 'absolute', left: 0, width: size, height: size,
            borderRadius: size / 2, borderWidth: sw, borderColor: colors.primary,
            transform: [{ rotate: `${leftDeg}deg` }],
          }} />
        </View>
      )}
      {/* inner hole with label */}
      <View style={{
        position: 'absolute', top: sw, left: sw,
        width: inner, height: inner, borderRadius: inner / 2,
        backgroundColor: colors.background,
        alignItems: 'center', justifyContent: 'center',
      }}>
        {isDone
          ? <Ionicons name="checkmark" size={inner * 0.52} color={colors.primary} />
          : <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: size * 0.19, color: colors.text, textAlign: 'center', lineHeight: size * 0.22 }}>{`${done}\n${total}`}</Text>
        }
      </View>
    </TouchableOpacity>
  );
};

const HomeScreen = ({ navigation }) => {
  const { colors, typography, layout, isDark, lang, setLang, selectedCategories, setSelectedCategories } = useTheme();
  const { isPremium, history, earnedBadges, totalReads, streak, longestStreak, categoryStats, shareCount, favorites, preferences, userProfile, updateUserProfile, isStoryCompleted, markStoryCompleted } = useUserData();
  const { stories, storiesLoading, categories, parentCategories, errorMsg } = useStories();
  const insets = useSafeAreaInsets();
  const { width: viewportWidth } = useWindowDimensions();
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(11);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [badgeCardIndex, setBadgeCardIndex] = useState(0);
  const [showFirstSessionPrompt, setShowFirstSessionPrompt] = useState(false);
  const [isPersonalizedModuleDismissed, setIsPersonalizedModuleDismissed] = useState(false);
  const [isPersonalizedModuleSnoozed, setIsPersonalizedModuleSnoozed] = useState(false);
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);
  const [profileNameInput, setProfileNameInput] = useState('');
  const [profileEmailInput, setProfileEmailInput] = useState('');
  const [dailyClickedIds, setDailyClickedIds] = useState(new Set());
  const [isDailyPanelCollapsed, setIsDailyPanelCollapsed] = useState(false);
  const isFetchingRef = useRef(false);  // ref to avoid stale closure
  const visibleCountRef = useRef(11);   // ref to read latest value in callbacks
  const badgeScrollRef = useRef(null);
  const categoryScrollRef = useRef(null);
  const flipAnim = useRef(new Animated.Value(0)).current;
  const hasTrackedPersonalizedFeedRef = useRef(false);
  const trackedModuleShownKeyRef = useRef(null);
  const screenWidth = viewportWidth;
  const isTablet = screenWidth >= 768;
  const isSmallPhone = screenWidth < 380;
  const brandLogoWidth = isTablet ? 180 : isSmallPhone ? 124 : 156;
  const brandLogoHeight = isTablet ? 72 : isSmallPhone ? 52 : 62;
  const sectionHeadingFontSize = isTablet ? 44 : isSmallPhone ? 30 : 36;
  const readyTitleFontSize = isTablet ? 38 : isSmallPhone ? 28 : 32;
  const featuredCardColumns = isTablet ? 3.1 : isSmallPhone ? 2.05 : 2.25;
  const featuredCardGap = 12;
  const featuredCardWidth = (screenWidth - (layout.padding.horizontal * 2) - featuredCardGap) / featuredCardColumns;

  useEffect(() => {
    if (isFetchingMore) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(flipAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(flipAnim, { toValue: 0, duration: 300, useNativeDriver: true })
        ])
      ).start();
    } else {
      flipAnim.stopAnimation();
      flipAnim.setValue(0);
    }
  }, [isFetchingMore]);

  const spin = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });

  // Visible categories: all + user-selected parent category IDs
  const visibleCategoriesList = React.useMemo(() => {
    let filteredParents = parentCategories;
    if (selectedCategories && selectedCategories.length > 0) {
      filteredParents = parentCategories.filter((p) => selectedCategories.includes(Number(p.id)));
    }
    return [
      { key: 'all', label: t('Tümü', lang), rawName: 'Tümü' },
      ...filteredParents.map((p) => ({ key: Number(p.id), label: p.name, rawName: p.raw_name })),
    ];
  }, [parentCategories, selectedCategories, lang]);

  useEffect(() => {
    if (activeFilter !== 'all' && !visibleCategoriesList.some((item) => item.key === activeFilter)) {
      setActiveFilter('all');
    }
  }, [visibleCategoriesList, activeFilter]);

  // Scroll to active category when filter changes
  useEffect(() => {
    const activeIndex = visibleCategoriesList.findIndex((item) => item.key === activeFilter);
    if (activeIndex !== -1 && categoryScrollRef.current) {
      categoryScrollRef.current.scrollToIndex({ 
        index: activeIndex, 
        animated: true, 
        viewPosition: 0.5 
      });
    }
  }, [activeFilter, visibleCategoriesList]);

  // Language strings
  const greeting = getGreeting(lang);
  const categoriesLabel = t('categoriesLabel', lang);
  const todayLabel = t('todayLabel', lang);
  const forYouLabel = t('home_for_you', lang);
  const personalizedTarget = preferences?.time?.dailyStoryTarget || 2;
  const moduleStoryCount = Math.min(3, Math.max(1, personalizedTarget));
  const personalizedMinutes = preferences?.time?.minutes || 6;
  const forYouSubtitle = t('home_for_you_sub', lang)
    .replace('{{stories}}', String(personalizedTarget))
    .replace('{{minutes}}', String(personalizedMinutes));
  const firstSessionTitle = t('home_first_session_title', lang)
    .replace('{{stories}}', String(personalizedTarget));
  const firstSessionBody = t('home_first_session_sub', lang)
    .replace('{{stories}}', String(personalizedTarget))
    .replace('{{minutes}}', String(personalizedMinutes));
  const firstSessionIntro = t('home_first_session_intro', lang);
  const firstSessionRecoLabel = t('home_first_session_reco_label', lang);
  const firstSessionMiniSummaryLabel = t('home_first_session_summary_label', lang);
  const startQuicklyCta = t('home_start_quickly_cta', lang);
  const todayRecommendationCta = t('home_today_recommendation_cta', lang);
  const continueCta = t('home_continue_cta', lang);

  const checkIfRead = (id) => history.includes(id);

  const getUniqueCats = (stats) => (stats && typeof stats === 'object' ? Object.keys(stats).length : 0);
  const getMaxCatReads = (stats) => (stats && typeof stats === 'object' ? Math.max(0, ...Object.values(stats)) : 0);

  const badgeProgressInfo = React.useMemo(() => {
    const badges = earnedBadges || [];
    const total = badges.length;
    const earned = badges.filter((b) => b.earned).length;
    const uniqueCats = getUniqueCats(categoryStats);
    const maxCatReads = getMaxCatReads(categoryStats);
    const philosophyReads = (categoryStats?.Felsefe || 0) + (categoryStats?.Philosophy || 0);

    const metricById = {
      first_read: { current: totalReads, target: 1 },
      explorer: { current: totalReads, target: 10 },
      sage: { current: totalReads, target: 25 },
      bookworm: { current: totalReads, target: 50 },
      streak_7: { current: Math.max(streak, longestStreak), target: 7 },
      cat_variety_3: { current: uniqueCats, target: 3 },
      cat_variety_5: { current: uniqueCats, target: 5 },
      cat_variety_10: { current: uniqueCats, target: 10 },
      cat_master_5: { current: maxCatReads, target: 5 },
      cat_master_10: { current: maxCatReads, target: 10 },
      cat_master_25: { current: maxCatReads, target: 25 },
      cat_master_50: { current: maxCatReads, target: 50 },
      cat_master_100: { current: maxCatReads, target: 100 },
      philosopher: { current: philosophyReads, target: 5 },
      save_5: { current: favorites.length, target: 5 },
      save_10: { current: favorites.length, target: 10 },
      save_50: { current: favorites.length, target: 50 },
      save_100: { current: favorites.length, target: 100 },
      share_1: { current: shareCount, target: 1 },
      share_10: { current: shareCount, target: 10 },
      share_20: { current: shareCount, target: 20 },
      share_30: { current: shareCount, target: 30 },
      share_50: { current: shareCount, target: 50 },
    };

    const nextCandidates = badges
      .filter((b) => !b.earned && metricById[b.id])
      .map((b) => {
        const { current, target } = metricById[b.id];
        const ratio = target > 0 ? Math.min(current / target, 1) : 0;
        return {
          ...b,
          current,
          target,
          ratio,
          remaining: Math.max(target - current, 0),
        };
      })
      .sort((a, b) => {
        if (b.ratio !== a.ratio) return b.ratio - a.ratio;
        return a.remaining - b.remaining;
      });

    return {
      total,
      earned,
      completionRatio: total > 0 ? earned / total : 0,
      nextCandidates: nextCandidates.slice(0, 5),
    };
  }, [earnedBadges, totalReads, streak, longestStreak, categoryStats, shareCount, favorites.length]);

  const progressSegments = 7;
  const activeSegments = Math.max(1, Math.round(badgeProgressInfo.completionRatio * progressSegments));
  const completionLine = t('home_badge_completion_line', lang)
    .replace('{{earned}}', String(badgeProgressInfo.earned))
    .replace('{{total}}', String(badgeProgressInfo.total));
  const badgeCarouselItems = badgeProgressInfo.nextCandidates.length > 0
    ? badgeProgressInfo.nextCandidates
    : [null]; // null = "all completed" card
  const nextBadgeCandidate = badgeProgressInfo.nextCandidates[0] || null;
  const badgeLeadLine = nextBadgeCandidate
    ? t('home_badge_next_close', lang).replace('{{badge}}', t(nextBadgeCandidate.titleKey, lang))
    : t('home_badge_all_completed', lang);

  const handleLoadMore = (nativeEvent) => {
    const paddingToBottom = 200;
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    if (isCloseToBottom && !isFetchingRef.current && visibleCountRef.current < sortedStories.length) {
      isFetchingRef.current = true;
      setIsFetchingMore(true);
      setTimeout(() => {
        const next = visibleCountRef.current + 10;
        visibleCountRef.current = next;
        setVisibleCount(next);
        isFetchingRef.current = false;
        setIsFetchingMore(false);
      }, 1000);
    }
  };

  useEffect(() => {
    if (!storiesLoading) {
      const timer = setTimeout(() => setLoading(false), 400);
      return () => clearTimeout(timer);
    }
  }, [storiesLoading]);

  // Ask profile info once on first app use if user profile is incomplete.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const hasSeenPrompt = await AsyncStorage.getItem(PROFILE_INFO_PROMPT_SEEN_KEY);
        const hasName = Boolean(userProfile?.displayName);
        const hasEmail = Boolean(userProfile?.email);
        if (!active || hasSeenPrompt === 'true' || (hasName && hasEmail)) return;
        setProfileNameInput(userProfile?.displayName || '');
        setProfileEmailInput(userProfile?.email || '');
        setShowProfilePrompt(true);
      } catch {
        // no-op
      }
    })();

    return () => {
      active = false;
    };
  }, [userProfile?.displayName, userProfile?.email]);

  const saveProfilePrompt = async () => {
    await updateUserProfile({
      displayName: profileNameInput,
      email: profileEmailInput,
    });
    await AsyncStorage.setItem(PROFILE_INFO_PROMPT_SEEN_KEY, 'true');
    setShowProfilePrompt(false);
  };

  const skipProfilePrompt = async () => {
    await AsyncStorage.setItem(PROFILE_INFO_PROMPT_SEEN_KEY, 'true');
    setShowProfilePrompt(false);
  };

  // Refresh on focus to load latest selected categories from DB if changed elsewhere
  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      const todayKey = new Date().toISOString().split('T')[0];
      const DAILY_PANEL_KEY = `@spark_daily_panel_${todayKey}`;

      Promise.all([
        getSelectedCategories().catch(() => null),
        AsyncStorage.getItem(FIRST_SESSION_PROMPT_KEY).catch(() => null),
        AsyncStorage.getItem(PERSONALIZED_MODULE_SNOOZE_KEY).catch(() => null),
        AsyncStorage.getItem(DAILY_PANEL_KEY).catch(() => null),
      ]).then(([list, promptFlag, moduleSnoozeUntil, dailyPanelData]) => {
        if (!isActive) return;

        if (Array.isArray(list)) {
          setSelectedCategories(list);
        }

        setShowFirstSessionPrompt(promptFlag === 'true');

        const today = new Date().toISOString().split('T')[0];
        setIsPersonalizedModuleDismissed(false);
        setIsPersonalizedModuleSnoozed(Boolean(moduleSnoozeUntil && moduleSnoozeUntil >= today));

        if (dailyPanelData) {
          try {
            const parsed = JSON.parse(dailyPanelData);
            setDailyClickedIds(new Set((parsed.clickedIds || []).map(String)));
            setIsDailyPanelCollapsed(Boolean(parsed.collapsed));
          } catch {
            // ignore
          }
        } else {
          setDailyClickedIds(new Set());
          setIsDailyPanelCollapsed(false);
        }
      });

      return () => {
        isActive = false;
      };
    }, [])
  );
  
  // Bugünü al (dinamik)
  const todayStr = new Date().toISOString().split('T')[0];

  // 1. Yayın tarihi geçmiş veya bugün olanları filtrele
  const publishedStories = (stories || []).filter(s => s.publishDate <= todayStr);

  // 2. Preferences Filter: Sadece takip edilen Ebeveyn kategorileri gösteririz.
  let prefFiltered = publishedStories;
  if (selectedCategories && selectedCategories.length > 0) {
    prefFiltered = publishedStories.filter((s) => selectedCategories.includes(Number(s.parent_cat_id)));
    // If no stories found in selected categories, fallback to all published
    if (prefFiltered.length === 0) prefFiltered = publishedStories;
  }

  // 3. UI Filter: Ekranda tıklanan ebeveyn kategoriye göre filtreleme
  const categoryFiltered = activeFilter === 'all'
    ? prefFiltered
    : prefFiltered.filter((s) => Number(s.parent_cat_id) === Number(activeFilter));

  // 3. Sıralama
  const sortedStories = [...categoryFiltered].sort((a, b) => {
    // Sınırsız üyeler için okunmamış hikayeler (okunmadıysa false, history'de yok) önce gelsin
    if (isPremium) {
      const aRead = checkIfRead(a.story_id);
      const bRead = checkIfRead(b.story_id);
      if (aRead !== bRead) {
        return aRead ? 1 : -1; // Okunanları sona at
      }
    }
    // Geri kalan durumlar için id büyüktan küçüğe sırala (en son eklenen ilk)
    return parseInt(b.story_id, 10) - parseInt(a.story_id, 10);
  });

  const personalizedModule = React.useMemo(() => {
    const storyById = new Map(sortedStories.map((s) => [String(s.story_id), s]));
    const continueStory = (history || [])
      .map((id) => storyById.get(String(id)))
      .find(Boolean) || null;

    const recentStories = (history || [])
      .slice(0, 7)
      .map((id) => storyById.get(String(id)))
      .filter(Boolean);

    const categoryScoreMap = recentStories.reduce((acc, item) => {
      const cat = Number(item?.parent_cat_id);
      if (!cat) return acc;
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});

    const dominantCategory = Object.entries(categoryScoreMap)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || null;

    const pickedStories = dominantCategory
      ? sortedStories.filter((s) => Number(s.parent_cat_id) === Number(dominantCategory)).slice(0, moduleStoryCount)
      : [];

    if (continueStory) {
      const merged = [
        continueStory,
        ...sortedStories.filter((s) => String(s.story_id) !== String(continueStory.story_id)),
      ].slice(0, moduleStoryCount);

      return {
        type: MODULE_TYPES.CONTINUE,
        stories: merged,
        continueStory,
        dominantCategory,
        dataFields: ['history[0]', 'history[0..6]', 'story.parent_cat', 'preferences.time.dailyStoryTarget'],
      };
    }

    if (pickedStories.length > 0) {
      return {
        type: MODULE_TYPES.PICKED,
        stories: pickedStories,
        continueStory: null,
        dominantCategory,
        dataFields: ['history[0..6]', 'story.parent_cat', 'preferences.time.dailyStoryTarget'],
      };
    }

    return {
      type: MODULE_TYPES.FALLBACK,
      stories: sortedStories.slice(0, moduleStoryCount),
      continueStory: null,
      dominantCategory: null,
      dataFields: ['sortedStories', 'preferences.time.dailyStoryTarget'],
    };
  }, [sortedStories, history, moduleStoryCount]);

  const personalizedStories = personalizedModule.stories;
  const personalizedStoryIds = new Set(personalizedStories.map((story) => story.story_id));
  const remainingStories = sortedStories.filter((story) => !personalizedStoryIds.has(story.story_id));

  // Count actually-read stories from personalizedStories using history (#4 fix)
  const historySet = React.useMemo(() => new Set((history || []).map(id => String(id))), [history]);
  const doneCount = React.useMemo(() =>
    personalizedStories.filter(s => historySet.has(String(s.story_id))).length,
    [personalizedStories, historySet]
  );

  const firstSessionFocusCategories = React.useMemo(() => {
    const preferred = (selectedCategories || []).filter(Boolean);
    if (preferred.length > 0) return preferred.slice(0, 3);

    const fromStories = Array.from(
      new Set((personalizedStories || []).map((story) => Number(story.parent_cat_id)).filter(Boolean))
    );
    return fromStories.slice(0, 3);
  }, [selectedCategories, personalizedStories]);

  const firstSessionRecommendedTitle = personalizedStories[0]?.title || t('home_first_session_reco_fallback', lang);
  const firstSessionCategoryStoryCount = React.useMemo(() => {
    if (firstSessionFocusCategories.length === 0) return personalizedStories.length;
    return publishedStories.filter((story) => firstSessionFocusCategories.includes(Number(story.parent_cat_id))).length;
  }, [firstSessionFocusCategories, personalizedStories.length, publishedStories]);

  const firstSessionMiniSummary = t('home_first_session_summary', lang)
    .replace('{{categories}}', String(Math.max(1, firstSessionFocusCategories.length)))
    .replace('{{stories}}', String(Math.max(personalizedTarget, firstSessionCategoryStoryCount)));

  useEffect(() => {
    if (personalizedStories.length === 0 || hasTrackedPersonalizedFeedRef.current) {
      return;
    }

    hasTrackedPersonalizedFeedRef.current = true;
    trackEvent(ANALYTICS_EVENTS.PERSONALIZED_FEED_SHOWN, {
      dailyStoryTarget: personalizedTarget,
      personalizedStoriesCount: personalizedStories.length,
      filter: activeFilter,
      moduleType: personalizedModule.type,
      dominantCategory: personalizedModule.dominantCategory,
      lang,
    });
  }, [personalizedStories, personalizedTarget, activeFilter, lang, personalizedModule]);

  const openPersonalizedStory = (story, position) => {
    trackEvent(ANALYTICS_EVENTS.PERSONALIZED_STORY_OPENED, {
      storyId: story?.story_id,
      position,
      source: 'home_for_you',
      dailyStoryTarget: personalizedTarget,
      lang,
    });
    navigation.navigate('StoryDetail', { story });
  };

  // ─── Ad / Premium sheet state ──────────────────────────────────────────────
  const [adSheet, setAdSheet] = useState({ visible: false, source: null, storyId: null });
  const [isAdLoading, setIsAdLoading] = useState(false);

  const openAdOrPremiumSheet = (source, storyId = null) => {
    trackEvent(ANALYTICS_EVENTS.FREE_LIMIT_TO_PAYWALL, { source, storyId, lang });
    if (shouldShowAd({ isPremium, isOnboarded })) {
      setAdSheet({ visible: true, source, storyId });
    } else {
      navigation.navigate('Paywall', { reason: 'free_limit_reached', source });
    }
  };

  const handleWatchAd = async () => {
    setIsAdLoading(true);
    trackEvent(ANALYTICS_EVENTS.AD_OR_PREMIUM_CHOICE, { source: adSheet.source, choice: 'ad' });
    const ad = await loadRewarded();
    setIsAdLoading(false);
    if (!ad) {
      // Ad failed — fall back to paywall
      setAdSheet({ visible: false, source: null, storyId: null });
      navigation.navigate('Paywall', { reason: 'free_limit_reached', source: adSheet.source });
      return;
    }
    setAdSheet({ visible: false, source: null, storyId: null });
    ad.addAdEventListener('rewarded_loaded', () => {});
    const { RewardedAdEventType } = require('react-native-google-mobile-ads');
    ad.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
      trackEvent(ANALYTICS_EVENTS.REWARDED_AD_COMPLETED, { source: adSheet.source });
    });
    ad.show().catch(e => console.warn('[HomeScreen] rewarded show error:', e?.message));
  };

  const handleAdSheetGoPremium = () => {
    trackEvent(ANALYTICS_EVENTS.AD_OR_PREMIUM_CHOICE, { source: adSheet.source, choice: 'premium' });
    setAdSheet({ visible: false, source: null, storyId: null });
    navigation.navigate('Paywall', { reason: 'free_limit_reached', source: adSheet.source });
  };

  // Keep old name as alias so existing callsites work without change
  const openPaywallFromFreeLimit = openAdOrPremiumSheet;

  const paginatedStories = remainingStories.slice(0, visibleCount);

  // Free üyelikte 3 farklı kategoride 3 hikaye hakkı
  const selectFreeDailyStories = (stories, categoryCount = 3, storyCount = 3) => {
    if (isPremium) return stories;
    
    const categoryMap = new Map();
    const selected = [];
    
    for (const story of stories) {
      const catId = story.parent_cat_id;
      if (!categoryMap.has(catId)) {
        categoryMap.set(catId, true);
        selected.push(story);
        if (selected.length >= storyCount) break;
      }
    }
    
    return selected;
  };

  const freeDaily = selectFreeDailyStories(paginatedStories);
  const remainingFreeQuota = isPremium ? paginatedStories.length : freeDaily.length;
  const free = isPremium ? paginatedStories : freeDaily;
  const lockedRaw = isPremium ? [] : paginatedStories.slice(remainingFreeQuota);

  const today = new Date();
  const yearStart = new Date(today.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((today - yearStart) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.floor(dayOfYear / 7) + 1;
  const weekSeed = Number(`${today.getFullYear()}${weekNumber}`.slice(-6));

  const weeklyBonusStory = (!isPremium && lockedRaw.length > 0)
    ? lockedRaw[weekSeed % lockedRaw.length]
    : null;
  const lockedWithoutWeeklyBonus = weeklyBonusStory
    ? lockedRaw.filter((story) => String(story.story_id) !== String(weeklyBonusStory.story_id))
    : lockedRaw;
  const teaserStory = (!isPremium && lockedWithoutWeeklyBonus.length > 0) ? lockedWithoutWeeklyBonus[0] : null;
  const locked = teaserStory ? lockedWithoutWeeklyBonus.slice(1) : lockedWithoutWeeklyBonus;
  const dailyDeck = (personalizedStories.length > 0 ? personalizedStories : sortedStories).slice(0, 3);

  const dismissFirstSessionPrompt = async () => {
    setShowFirstSessionPrompt(false);
    try {
      await AsyncStorage.removeItem(FIRST_SESSION_PROMPT_KEY);
    } catch (error) {
      console.error('Failed to remove first session prompt:', error);
      console.error('Ilk oturum mesaji kaldirilamadi:', error);
    }
  };

  const openFirstRecommendedStory = async () => {
    const firstStory = personalizedStories[0];
    await dismissFirstSessionPrompt();

    if (firstStory) {
      trackEvent(ANALYTICS_EVENTS.PERSONALIZED_STORY_OPENED, {
        storyId: firstStory.story_id,
        position: 0,
        source: personalizedModule.type === MODULE_TYPES.CONTINUE ? 'home_continue' : 'first_session_prompt',
        dailyStoryTarget: personalizedTarget,
        lang,
      });
      navigation.navigate('StoryDetail', { story: firstStory });
      return;
    }

    navigation.navigate('Search');
  };

  const personalizedModuleCard = React.useMemo(() => {
    const firstStory = personalizedStories[0] || null;

    if (!firstStory) {
      return {
        title: forYouLabel,
        body: forYouSubtitle,
        cta: startQuicklyCta,
        story: null,
        source: 'home_module_fallback',
      };
    }

    if (personalizedModule.type === MODULE_TYPES.CONTINUE) {
      return {
        title: t('home_module_continue_title', lang),
        body: firstStory.title,
        cta: continueCta,
        story: firstStory,
        source: 'home_module_continue',
      };
    }

    if (personalizedModule.type === MODULE_TYPES.PICKED) {
      return {
        title: t('home_module_picked_title', lang),
        body: firstStory.title,
        cta: todayRecommendationCta,
        story: firstStory,
        source: 'home_module_picked',
      };
    }

    return {
      title: forYouLabel,
      body: forYouSubtitle,
      cta: startQuicklyCta,
      story: firstStory,
      source: 'home_module_fallback',
    };
  }, [personalizedStories, personalizedModule.type, forYouLabel, forYouSubtitle, startQuicklyCta, todayRecommendationCta, continueCta, lang]);

  useEffect(() => {
    const isVisible = !isPersonalizedModuleDismissed && !isPersonalizedModuleSnoozed && personalizedStories.length > 0;
    if (!isVisible) return;

    const moduleKey = `${personalizedModule.type}:${personalizedModuleCard.story?.story_id || 'none'}`;
    if (trackedModuleShownKeyRef.current === moduleKey) return;

    trackedModuleShownKeyRef.current = moduleKey;
    trackEvent(ANALYTICS_EVENTS.MODULE_SHOWN, {
      moduleType: personalizedModule.type,
      storyId: personalizedModuleCard.story?.story_id,
      dominantCategory: personalizedModule.dominantCategory,
      ctaLabel: personalizedModuleCard.cta,
      dailyStoryTarget: personalizedTarget,
      filter: activeFilter,
      lang,
    });
  }, [
    isPersonalizedModuleDismissed,
    isPersonalizedModuleSnoozed,
    personalizedStories,
    personalizedModule,
    personalizedModuleCard,
    personalizedTarget,
    activeFilter,
    lang,
  ]);

  const onPersonalizedModuleOpen = () => {
    trackEvent(ANALYTICS_EVENTS.MODULE_CLICKED, {
      moduleType: personalizedModule.type,
      storyId: personalizedModuleCard.story?.story_id,
      dominantCategory: personalizedModule.dominantCategory,
      ctaLabel: personalizedModuleCard.cta,
      dailyStoryTarget: personalizedTarget,
      filter: activeFilter,
      lang,
    });

    if (personalizedModuleCard.story) {
      trackEvent(ANALYTICS_EVENTS.PERSONALIZED_STORY_OPENED, {
        storyId: personalizedModuleCard.story.story_id,
        position: 0,
        source: personalizedModuleCard.source,
        dailyStoryTarget: personalizedTarget,
        lang,
      });
      navigation.navigate('StoryDetail', { story: personalizedModuleCard.story });
      return;
    }

    navigation.navigate('Search');
  };

  const dismissPersonalizedModule = () => {
    trackEvent(ANALYTICS_EVENTS.MODULE_DISMISSED, {
      moduleType: personalizedModule.type,
      storyId: personalizedModuleCard.story?.story_id,
      dominantCategory: personalizedModule.dominantCategory,
      dismissReason: 'close',
      dailyStoryTarget: personalizedTarget,
      filter: activeFilter,
      lang,
    });
    setIsPersonalizedModuleDismissed(true);
  };

  const snoozePersonalizedModule = async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    trackEvent(ANALYTICS_EVENTS.MODULE_DISMISSED, {
      moduleType: personalizedModule.type,
      storyId: personalizedModuleCard.story?.story_id,
      dominantCategory: personalizedModule.dominantCategory,
      dismissReason: 'snooze_until_tomorrow',
      snoozeUntil: tomorrowStr,
      dailyStoryTarget: personalizedTarget,
      filter: activeFilter,
      lang,
    });
    setIsPersonalizedModuleDismissed(true);
    setIsPersonalizedModuleSnoozed(true);
    try {
      await AsyncStorage.setItem(PERSONALIZED_MODULE_SNOOZE_KEY, tomorrowStr);
    } catch (error) {
      console.error('Failed to save personalized module snooze state:', error);
      console.error('Kisisellestirilmis modul erteleme kaydedilemedi:', error);
    }
  };

  const persistDailyPanelState = React.useCallback((clickedIds, collapsed) => {
    const todayKey = new Date().toISOString().split('T')[0];
    const DAILY_PANEL_KEY = `@spark_daily_panel_${todayKey}`;
    AsyncStorage.setItem(DAILY_PANEL_KEY, JSON.stringify({
      clickedIds: [...clickedIds],
      collapsed,
    })).catch(() => {});
  }, []);

  // Daily panel: handle story tap
  const handleDailyStoryPress = (story, totalDailyCount) => {
    const newIds = new Set(dailyClickedIds);
    newIds.add(String(story.story_id));
    setDailyClickedIds(newIds);
    const allClicked = newIds.size >= totalDailyCount;
    if (allClicked) {
      setIsDailyPanelCollapsed(true);
    }
    persistDailyPanelState(newIds, allClicked);
    trackEvent(ANALYTICS_EVENTS.PERSONALIZED_STORY_OPENED, {
      storyId: story.story_id,
      source: 'home_daily_panel',
      dailyStoryTarget: personalizedTarget,
      lang,
    });
    navigation.navigate('StoryDetail', { story });
  };

  useEffect(() => {
    if (personalizedStories.length === 0) return;
    const isComplete = doneCount >= personalizedStories.length;
    if (!isComplete || isDailyPanelCollapsed) return;

    setIsDailyPanelCollapsed(true);
    const clickedIds = new Set(personalizedStories.map((story) => String(story.story_id)));
    setDailyClickedIds(clickedIds);
    persistDailyPanelState(clickedIds, true);
  }, [doneCount, isDailyPanelCollapsed, personalizedStories, persistDailyPanelState]);

  const styles = StyleSheet.create({
    safe: { 
      flex: 1, 
      backgroundColor: colors.background
    },
    homeHeader: {
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      paddingHorizontal: layout.padding.horizontal, 
      paddingTop: 10,
      paddingBottom: 8,
    },
    brandLogo: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    brandLogoImage: {
      width: brandLogoWidth,
      height: brandLogoHeight,
    },
    headerBadgeWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 8,
    },
    headerBadgeIcon: {
      width: 42,
      height: 42,
      borderRadius: 21,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerBadgeInfo: {
      flex: 1,
    },
    headerBadgeTitle: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 14,
      color: colors.text,
      lineHeight: 18,
    },
    headerBadgeSub: {
      fontFamily: 'Inter_400Regular',
      fontSize: 12,
      color: colors.textSecondary,
      lineHeight: 15,
      marginTop: 1,
    },
    headerLeftSpacer: {
      width: 8,
    },
    streakCard: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      borderRadius: layout.radius.featuredCard, 
      paddingVertical: 20,
      paddingHorizontal: 20, 
      marginHorizontal: layout.padding.horizontal, 
      marginBottom: 32, 
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 5,
    },
    streakDays: { 
      fontFamily: 'PlayfairDisplay_700Bold', 
      fontSize: typography.sizes.headingSmall, 
      color: colors.text 
    },
    streakLabel: { 
      fontFamily: 'Inter_400Regular', 
      fontSize: typography.sizes.meta, 
      color: colors.textSecondary 
    },
    streakDot: { 
      width: 8, 
      height: 8, 
      borderRadius: 4 
    },
    sectionLabel: { 
      fontFamily: 'Inter_500Medium',
      fontSize: 12,
      color: colors.textSecondary,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
      marginHorizontal: layout.padding.horizontal,
      marginTop: 32,
      marginBottom: 16,
      display: 'none',
    },
    sectionHeading: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: sectionHeadingFontSize,
      color: '#4A3A2C',
      marginHorizontal: layout.padding.horizontal,
      marginTop: 16,
      marginBottom: 16,
    },
    sectionHeadingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginHorizontal: layout.padding.horizontal,
      marginTop: 16,
      marginBottom: 16,
      gap: 8,
    },
    miniProgressTrack: {
      width: 74,
      height: 8,
      borderRadius: 6,
      backgroundColor: colors.surfaceContainerHigh,
      overflow: 'hidden',
    },
    miniProgressFill: {
      height: 8,
      borderRadius: 6,
      backgroundColor: colors.primary,
    },
    miniProgressText: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 13,
      color: colors.textSecondary,
    },
    catPill: {
      paddingHorizontal: 18, 
      paddingVertical: 0, 
      height: 44,
      justifyContent: 'center',
      borderRadius: 14,
      borderWidth: 1.5, 
      backgroundColor: isDark ? colors.cardBackground : colors.surfaceContainerLowest,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0 : 0.06,
      shadowRadius: 6,
      elevation: isDark ? 0 : 2,
    },
    catPillActive: { 
      borderColor: 'transparent' 
    },
    catPillText: {
      fontFamily: 'Inter_600SemiBold', 
      fontSize: 13,
      color: '#FFFFFF'
    },
    catPillIconWrap: {
      width: 20,
      height: 20,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255,255,255,0.22)',
    },
    catPillTextActive: { 
      color: '#FFFFFF', 
      fontFamily: 'Inter_500Medium' 
    },
    featuredScroll: {
      paddingLeft: layout.padding.horizontal,
      paddingRight: 8,
      marginBottom: 16,
    },
    featuredCard: {
      width: featuredCardWidth,
      height: 300,
      borderRadius: 16,
      marginRight: featuredCardGap,
      padding: 10,
      justifyContent: 'space-between',
      overflow: 'hidden',
      shadowColor: colors.border,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    featuredCardInnerBorder: {
      ...StyleSheet.absoluteFillObject,
      top: 4,
      left: 4,
      right: 4,
      bottom: 4,
      borderRadius: 12,
      borderWidth: 1,
      opacity: 0.85,
    },
    featuredCategoryVisual: {
      width: '100%',
      height: 118,
      borderRadius: 12,
      overflow: 'hidden',
      marginBottom: 10,
      borderWidth: 1,
      borderColor: `${colors.border}80`,
      backgroundColor: 'rgba(255,255,255,0.35)',
      shadowColor: '#000000',
      shadowOffset: { width: 2, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 3,
    },
    featuredCategoryLabel: {
      position: 'absolute',
      top: 8,
      left: 8,
      right: 8,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.66)',
      borderRadius: 8,
      backgroundColor: 'rgba(18,17,15,0.38)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      color: '#FFFFFF',
      textAlign: 'center',
      fontFamily: 'Inter_600SemiBold',
      fontSize: 11,
    },
    featuredCategoryImage: {
      width: '100%',
      height: '100%',
    },
    featuredCardTitle: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: 17,
      color: isDark ? '#F6EDE1' : '#4A3A2C',
      lineHeight: 22,
    },
    featuredCardMeta: {
      fontFamily: 'Inter_400Regular',
      fontSize: 11,
      color: colors.textSecondary,
    },
    featuredCardMetaRow: {
      marginTop: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
    },
    featuredCardMetaLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      flexShrink: 1,
    },
    featuredCardMetaDot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.textSecondary,
      opacity: 0.8,
    },
    featuredCardCategoryMeta: {
      fontFamily: 'Inter_500Medium',
      fontSize: 11,
      color: colors.textSecondary,
      textAlign: 'right',
      flexShrink: 1,
    },
    featuredCardUseBtn: {
      marginTop: 14,
      marginBottom: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.primaryContainer,
      paddingVertical: 7,
      paddingHorizontal: 14,
      minWidth: 140,
      alignSelf: 'center',
      alignItems: 'center',
    },
    featuredCardUseBtnText: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 12,
      color: colors.text,
    },
    storyGrid: {
      flexDirection: 'column',
      gap: 12,
      marginTop: 12,
    },
    readyTitle: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: readyTitleFontSize,
      color: '#A17F6A',
      marginBottom: 12,
      marginTop: 14,
    },
    editorialUseCta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 8,
      paddingHorizontal: 14,
      marginTop: 6,
      marginBottom: 14,
      borderRadius: 10,
      alignSelf: 'flex-start',
      backgroundColor: isDark ? `${colors.primary}12` : `${colors.primary}0D`,
      borderWidth: 1,
      borderColor: `${colors.primary}30`,
    },
    editorialUseCtaText: {
      fontFamily: 'Inter_500Medium',
      fontSize: 13,
      color: colors.primary,
    },
    sectionTitle: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: typography.sizes.headingSmall,
      color: colors.text,
      marginBottom: 6,
    },
    sectionSub: {
      fontFamily: 'Inter_400Regular',
      fontSize: typography.sizes.body,
      color: colors.textSecondary,
      lineHeight: 22,
      marginBottom: 16,
    },
    firstSessionCard: {
      marginBottom: 20,
      borderRadius: layout.radius.card,
      borderWidth: 1,
      borderColor: `${colors.primary}55`,
      backgroundColor: `${colors.primary}12`,
      padding: 20,
    },
    firstSessionIntro: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 12,
      color: colors.primary,
      letterSpacing: 0.7,
      textTransform: 'uppercase',
      marginBottom: 8,
    },
    firstSessionTop: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: 10,
      gap: 12,
    },
    firstSessionTextWrap: {
      flex: 1,
    },
    firstSessionTitle: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: typography.sizes.headingSmall,
      color: colors.text,
      marginBottom: 4,
    },
    firstSessionSub: {
      fontFamily: 'Inter_400Regular',
      fontSize: typography.sizes.body,
      color: colors.textSecondary,
      lineHeight: 22,
    },
    firstSessionInfoBox: {
      borderRadius: 14,
      borderWidth: 1,
      borderColor: `${colors.primary}30`,
      backgroundColor: `${colors.background}AA`,
      paddingHorizontal: 14,
      paddingVertical: 12,
      marginBottom: 10,
      gap: 4,
    },
    firstSessionInfoLabel: {
      fontFamily: 'Inter_500Medium',
      fontSize: 12,
      color: colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    firstSessionInfoValue: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 14,
      color: colors.text,
      lineHeight: 20,
    },
    firstSessionCatRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
      marginBottom: 12,
    },
    firstSessionCatPill: {
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: `${colors.primary}20`,
      borderWidth: 1,
      borderColor: `${colors.primary}45`,
    },
    firstSessionCatText: {
      fontFamily: 'Inter_500Medium',
      fontSize: 12,
      color: colors.primary,
    },
    firstSessionClose: {
      width: 30,
      height: 30,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: `${colors.primary}18`,
    },
    firstSessionCta: {
      alignSelf: 'flex-start',
      marginTop: 4,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 999,
      backgroundColor: colors.primary,
    },
    firstSessionCtaText: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 14,
      color: colors.onPrimary,
      letterSpacing: 0.3,
      textTransform: 'uppercase',
    },
    personalizedModuleCard: {
      marginBottom: 16,
      borderRadius: layout.radius.card,
      borderWidth: 1,
      borderColor: `${colors.primary}55`,
      backgroundColor: `${colors.primary}12`,
      padding: 20,
    },
    personalizedModuleTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 12,
      marginBottom: 10,
    },
    personalizedModuleTextWrap: {
      flex: 1,
    },
    personalizedModuleTitle: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: typography.sizes.headingSmall,
      color: colors.text,
      marginBottom: 4,
    },
    personalizedModuleSub: {
      fontFamily: 'Inter_400Regular',
      fontSize: typography.sizes.body,
      color: colors.textSecondary,
      lineHeight: 22,
    },
    personalizedModuleActions: {
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center',
    },
    personalizedModuleSnoozeBtn: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.background,
    },
    personalizedModuleSnoozeText: {
      fontFamily: 'Inter_500Medium',
      fontSize: 13,
      color: colors.textSecondary,
    },
    personalizedModuleCta: {
      alignSelf: 'flex-start',
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 999,
      backgroundColor: colors.primary,
    },
    personalizedModuleCtaText: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 14,
      color: colors.onPrimary,
      letterSpacing: 0.3,
      textTransform: 'uppercase',
    },
    dailyPanelCard: {
      marginBottom: 20,
      borderRadius: layout.radius.card,
      borderWidth: 2,
      overflow: 'hidden',
    },
    dailyPanelHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 14,
      gap: 12,
    },
    dailyPanelHeaderMain: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flex: 1,
    },
    dailyPanelTitle: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 14,
      color: colors.text,
      letterSpacing: 0.5,
      textTransform: 'uppercase',
      marginBottom: 2,
    },
    dailyPanelSub: {
      fontFamily: 'Inter_400Regular',
      fontSize: 13,
      color: colors.textSecondary,
    },
    dailyPanelStoriesWrap: {
      paddingHorizontal: 12,
      paddingBottom: 12,
      gap: 8,
    },
    dailyStoryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 14,
      backgroundColor: colors.backgroundDark || colors.cardBackground,
      gap: 12,
    },
    dailyStoryRowClicked: {
      backgroundColor: isDark ? `${colors.primary}18` : `${colors.primary}0D`,
    },
    dailyStoryRowCollapsed: {
      paddingVertical: 12,
    },
  });

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safe}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        onScroll={({ nativeEvent }) => handleLoadMore(nativeEvent)}
        onMomentumScrollEnd={({ nativeEvent }) => handleLoadMore(nativeEvent)}
        scrollEventThrottle={100}
      >
        {/* ÔöÇÔöÇ Header ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ */}
        <View style={styles.homeHeader}>
          <View style={styles.headerLeftSpacer} />
          <View style={styles.brandLogo}>
            <Image
              source={require('../../assets/spark_shortcut_logo.png')}
              style={styles.brandLogoImage}
              resizeMode="contain"
            />
          </View>
          <TouchableOpacity
            style={styles.headerBadgeWrap}
            onPress={() => navigation.navigate('ProgressTab')}
            activeOpacity={0.85}
          >
            <View style={{ width: 42, height: 42, borderRadius: 21, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceContainerHigh }}>
              <Text style={{ fontSize: 24 }}>{nextBadgeCandidate?.icon || '🏆'}</Text>
            </View>
            <Text style={styles.headerBadgeSub}>{badgeProgressInfo.earned}/{badgeProgressInfo.total}</Text>
          </TouchableOpacity>
        </View>

        {/* ÔöÇÔöÇ Category Pills ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ */}
        <Text style={[styles.sectionLabel, { paddingHorizontal: layout.padding.horizontal }]}>
          {categoriesLabel}
        </Text>
        <FlatList
          ref={categoryScrollRef}
          horizontal
          scrollEnabled
          data={visibleCategoriesList}
          renderItem={({ item }) => (
            <CategoryPill
              label={item.label}
              categoryName={item.rawName || item.label}
              active={item.key === activeFilter}
              compact
              isDark={isDark}
              onPress={() => setActiveFilter(item.key)}
            />
          )}
          keyExtractor={(item) => String(item.key)}
          contentContainerStyle={{ gap: 10, paddingHorizontal: layout.padding.horizontal }}
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 20, marginBottom: 8 }}
          scrollToOverflowEnabled={true}
        />

        {/* ÔöÇÔöÇ Featured Story Cards (Horizontal Scroll) ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ */}
        {!loading && sortedStories.length > 0 && (() => {
          const featuredStories = personalizedStories.length > 0
            ? personalizedStories
            : sortedStories.slice(0, 4);
          return (
            <>
              <View style={styles.sectionHeadingRow}>
                 <Text style={[styles.sectionHeading, { marginHorizontal: 0, marginTop: 0, marginBottom: 0 }]}>{t('home_featured_section_title', lang)}</Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                decelerationRate="fast"
                snapToInterval={featuredCardWidth + featuredCardGap}
                snapToAlignment="start"
                contentContainerStyle={styles.featuredScroll}
              >
                {featuredStories.slice(0, 3).map((story, idx) => {
                  const catTheme = getCategoryTheme(story.parent_cat_raw || story.parent_cat || story.cat, isDark);
                  const catImg = getCategoryImage(story.parent_cat_raw || story.parent_cat || story.cat, isDark);
                  const displayCat = toPascalCase(t(story.parent_cat || story.cat, lang) || '');
                  const isRead = checkIfRead(story.story_id);
                  const isLocked = !isPremium;
                  return (
                    <TouchableOpacity
                      key={`featured-${story.story_id}`}
                      style={[
                        styles.featuredCard,
                        {
                          backgroundColor: isDark ? '#1F1A16' : '#F6F1E6',
                          borderWidth: 2.5,
                          borderColor: catTheme.borderColor,
                          opacity: isLocked ? 0.6 : 1,
                        },
                      ]}
                      activeOpacity={0.85}
                      onPress={() => {
                        if (isLocked) {
                          openPaywallFromFreeLimit('home_featured_story_locked', story.story_id);
                        } else {
                          openPersonalizedStory(story, idx);
                        }
                      }}
                    >
                      <View pointerEvents="none" style={[styles.featuredCardInnerBorder, { borderColor: catTheme.borderColor }]} />
                      <View>
                        <View style={styles.featuredCategoryVisual}>
                          {catImg.source ? (
                            <Image
                              source={catImg.source}
                              style={[
                                styles.featuredCategoryImage,
                                {
                                  opacity: isDark ? 0.8 : 0.95,
                                  transform: [
                                    { rotate: catImg.rotate || '0deg' },
                                    { scaleX: catImg.flip ? -1 : 1 },
                                  ],
                                },
                              ]}
                              resizeMode="cover"
                            />
                          ) : (
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                              <Ionicons name="book-outline" size={26} color={catTheme.accent} />
                            </View>
                          )}
                          <View style={[StyleSheet.absoluteFill, { backgroundColor: catImg.tint || 'transparent' }]} />
                          <Text numberOfLines={1} style={styles.featuredCategoryLabel}>{displayCat}</Text>
                        </View>
                        {isRead && <Ionicons name="checkmark-circle" size={18} color={colors.primary} style={{ position: 'absolute', top: 0, right: 0 }} />}
                        {isLocked && (
                          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
                            <Ionicons name="lock-closed" size={32} color="#FFFFFF" />
                          </View>
                        )}
                      </View>
                      <View style={{ flex: 1, justifyContent: 'space-between', position: 'relative' }}>
                        <View>
                          <Text numberOfLines={2} style={styles.featuredCardTitle}>
                            {story.title}
                          </Text>
                          <Text numberOfLines={2} style={[styles.featuredCardMeta, { marginTop: 12, lineHeight: 16 }]}>Nasıl Kullanılır: Kısa konuşma pratiği.</Text>
                        <View style={styles.featuredCardMetaRow}>
                          <View style={styles.featuredCardMetaLeft}>
                            <Ionicons name="time-outline" size={24} color={colors.textSecondary} />
                            <Text style={styles.featuredCardMeta}>{story.min} dk</Text>
                          </View>
                          <Text numberOfLines={1} style={[styles.featuredCardCategoryMeta, { color: catTheme.borderColor }]}>{displayCat}</Text>
                        </View>
                        </View>
                        <TouchableOpacity
                          style={[styles.featuredCardUseBtn, { marginTop: 12, opacity: isLocked ? 0.5 : 1 }]}
                          onPress={() => isLocked ? null : navigation.navigate('UseInConversation', { story })}
                          activeOpacity={isLocked ? 1 : 0.86}
                          disabled={isLocked}
                        >
                          <Text style={styles.featuredCardUseBtnText}>Sohbet İçin Kullan</Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </>
          );
        })()}

        <Text style={[styles.sectionLabel, { paddingHorizontal: layout.padding.horizontal }]}>{todayLabel}</Text>
        
        <View style={{ paddingHorizontal: layout.padding.horizontal }}>
          {loading ? (
            <>
              <SkeletonCard colors={colors} layout={layout} isHero />
              <View style={styles.storyGrid}>
                <SkeletonCard colors={colors} layout={layout} />
                <SkeletonCard colors={colors} layout={layout} />
              </View>
            </>
          ) : sortedStories.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 48, paddingHorizontal: 24 }}>
              <Text style={{ fontSize: 48, marginBottom: 16 }}>­şô¡</Text>
              <Text style={{
                fontFamily: 'PlayfairDisplay_600SemiBold',
                fontSize: typography.sizes.headingSmall,
                color: colors.text,
                textAlign: 'center',
                marginBottom: 8,
              }}>
                {t('noStoriesTitle', lang)}
              </Text>
              <Text style={{
                fontFamily: 'Inter_400Regular',
                fontSize: typography.sizes.body,
                color: colors.textSecondary,
                textAlign: 'center',
                lineHeight: 22,
              }}>
                {t('noStoriesBody', lang)}
              </Text>
            </View>
          ) : (
            <>
              {/* Daily recommendations panel hidden for this visual */}
              {false && personalizedStories.length > 0 && (() => {
                const panelStories = personalizedStories;
                const isDailyComplete = doneCount >= panelStories.length;
                const panelTheme = getCategoryTheme(panelStories[0]?.parent_cat_raw || panelStories[0]?.parent_cat || panelStories[0]?.cat, isDark);
                return (
                  <View style={[styles.dailyPanelCard, { borderColor: panelTheme.borderColor, backgroundColor: panelTheme.backgroundColor }]}>
                    <TouchableOpacity
                      style={styles.dailyPanelHeader}
                      onPress={() => {
                        const nextCollapsed = !isDailyPanelCollapsed;
                        setIsDailyPanelCollapsed(nextCollapsed);
                        persistDailyPanelState(dailyClickedIds, nextCollapsed);
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={styles.dailyPanelHeaderMain}>
                        <DailyProgressRing
                          done={doneCount}
                          total={panelStories.length}
                          colors={colors}
                          isDark={isDark}
                          size={50}
                          onPress={() => navigation.navigate('ProgressTab')}
                        />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.dailyPanelTitle} numberOfLines={1}>
                            {t('home_daily_cta', lang)}
                          </Text>
                          <Text style={styles.dailyPanelSub}>{doneCount} / {panelStories.length}</Text>
                        </View>
                      </View>
                      {isDailyComplete ? (
                        <Ionicons name="checkmark-circle" size={20} color={panelTheme.accent} style={{ marginLeft: 8 }} />
                      ) : (
                        <Ionicons
                          name={isDailyPanelCollapsed ? 'chevron-down-outline' : 'chevron-up-outline'}
                          size={18}
                          color={panelTheme.accent}
                          style={{ marginLeft: 8 }}
                        />
                      )}
                    </TouchableOpacity>

                    {isDailyPanelCollapsed && isDailyComplete && (
                      <View style={styles.dailyPanelStoriesWrap}>
                        {panelStories.map((story) => {
                          const storyTheme = getCategoryTheme(story.parent_cat_raw || story.parent_cat || story.cat, isDark);
                          return (
                            <TouchableOpacity
                              key={`collapsed-${story.story_id}`}
                              style={[
                                styles.dailyStoryRow,
                                styles.dailyStoryRowCollapsed,
                                styles.dailyStoryRowClicked,
                                { borderWidth: 1, borderColor: storyTheme.borderColor, backgroundColor: storyTheme.backgroundColor },
                              ]}
                              onPress={() => navigation.navigate('StoryDetail', { story })}
                              activeOpacity={0.75}
                            >
                              <Ionicons name="book-outline" size={16} color={storyTheme.accent} />
                              <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 14, color: colors.text, lineHeight: 20 }} numberOfLines={2}>
                                {story.title}
                              </Text>
                              <Ionicons name="checkmark-circle" size={16} color={storyTheme.accent} />
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    )}

                    {!isDailyPanelCollapsed && !isDailyComplete && (
                      <View style={styles.dailyPanelStoriesWrap}>
                        {panelStories.map((story, storyIdx) => {
                          const isClicked = dailyClickedIds.has(String(story.story_id)) || historySet.has(String(story.story_id));
                          const isLocked = !isPremium && !isClicked && personalizedStories.indexOf(story) >= 2;
                          const isFirst = storyIdx === 0;
                          return (
                            <View key={story.story_id}>
                              <TouchableOpacity
                                style={[styles.dailyStoryRow, isClicked && styles.dailyStoryRowClicked]}
                                onPress={() => isLocked
                                  ? openPaywallFromFreeLimit('home_daily_panel_locked', story.story_id)
                                  : handleDailyStoryPress(story, panelStories.length)
                                }
                                activeOpacity={0.7}
                              >
                                <Ionicons
                                  name={isClicked ? 'checkmark-circle' : 'chatbubbles-outline'}
                                  size={18}
                                  color={isClicked ? colors.primary : colors.primary}
                                />
                                <View style={{ flex: 1 }}>
                                  <Text style={{ fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 14, color: colors.text, lineHeight: 20 }} numberOfLines={2}>
                                    {story.title}
                                  </Text>
                                  <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: colors.textSecondary, marginTop: 2 }}>
                                    {t(story.parent_cat, lang)} ┬À {story.min} {t('minLabel', lang)}
                                  </Text>
                                </View>
                                {isLocked ? (
                                  <Ionicons name="lock-closed-outline" size={16} color={colors.textSecondary} />
                                ) : (
                                  <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
                                )}
                              </TouchableOpacity>
                              {isFirst && !isClicked && !isLocked && (
                                <TouchableOpacity
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 6,
                                    marginTop: 6,
                                    marginBottom: 4,
                                    paddingVertical: 10,
                                    borderRadius: 10,
                                    backgroundColor: colors.primary,
                                  }}
                                  onPress={() => {
                                    trackEvent(ANALYTICS_EVENTS.USE_IN_CONVO_OPENED, {
                                      storyId: story.story_id,
                                      source: 'home_daily_panel_quick',
                                      lang,
                                    });
                                    if (isPremium && !isStoryCompleted(story.story_id)) {
                                      markStoryCompleted(story.story_id);
                                    }
                                    navigation.navigate('UseInConversation', { story });
                                  }}
                                  activeOpacity={0.85}
                                >
                                  <Ionicons name="chatbubbles" size={15} color={colors.onPrimary} />
                                  <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: colors.onPrimary }}>
                                    {t('home_use_today_btn', lang)}
                                  </Text>
                                </TouchableOpacity>
                              )}
                            </View>
                          );
                        })}
                      </View>
                    )}
                  </View>
                );
              })()}

              <Text style={styles.readyTitle}>{t('home_ready_section_title', lang)}</Text>

              {false && free.length > 0 && (
                <>
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 8,
                    marginBottom: 20,
                    gap: 12,
                  }}>
                    <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
                    <Text style={{
                      fontFamily: 'Inter_500Medium',
                      fontSize: 11,
                      color: colors.textSecondary,
                      letterSpacing: 1.2,
                      textTransform: 'uppercase',
                    }}>
                      {t('home_more_stories', lang)}
                    </Text>
                    <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
                  </View>
                  <StoryCard 
                    story={free[0]} 
                    type="hero" 
                    hideCategory={activeFilter !== 'all'}
                    isRead={checkIfRead(free[0].story_id)}
                    onPress={() => navigation.navigate('StoryDetail', { story: free[0] })}
                    onUseInConversation={() => navigation.navigate('UseInConversation', { story: free[0] })}
                  />
                </>
              )}

              <View style={styles.storyGrid}>
                {free.map(story => (
                  <StoryCard
                    key={story.story_id}
                    story={story}
                    type="ready"
                    hideCategory={activeFilter !== 'all'}
                    isRead={checkIfRead(story.story_id)}
                    onPress={() => navigation.navigate('StoryDetail', { story })}
                    onUseInConversation={() => navigation.navigate('UseInConversation', { story })}
                  />
                ))}
                {weeklyBonusStory ? (
                  <StoryCard
                    key={`bonus-${weeklyBonusStory.story_id}`}
                    story={weeklyBonusStory}
                    type="ready"
                    hideCategory={activeFilter !== 'all'}
                    supportText={t('homeFreemiumWeeklyBonusHint', lang)}
                    isRead={checkIfRead(weeklyBonusStory.story_id)}
                    onPress={() => navigation.navigate('StoryDetail', { story: weeklyBonusStory })}
                  />
                ) : null}
                {teaserStory ? (
                  <StoryCard
                    key={`teaser-${teaserStory.story_id}`}
                    story={teaserStory}
                    type="ready"
                    locked
                    hideCategory={activeFilter !== 'all'}
                    supportText={t('homeFreemiumTeaserHint', lang)}
                    onPress={() => openPaywallFromFreeLimit('home_feed_teaser', teaserStory.story_id)}
                  />
                ) : null}
                {locked.map(story => (
                  <StoryCard
                    key={story.story_id}
                    story={story}
                    type="ready"
                    locked
                    supportText={t('homeFreemiumPremiumBenefit', lang)}
                    hideCategory={activeFilter !== 'all'}
                    onPress={() => openPaywallFromFreeLimit('home_feed_locked', story.story_id)}
                  />
                ))}
              </View>
            </>
          )}
        </View>

        {isFetchingMore && (
          <View style={{ alignItems: 'center', paddingVertical: 20 }}>
             <Animated.View style={{ transform: [{ rotateY: spin }] }}>
               <Ionicons name="book-outline" size={32} color={colors.primary} />
             </Animated.View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ÔöÇÔöÇ FAB: Pratik Yap ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ */}
      {(personalizedStories.length > 0 || (sortedStories && sortedStories.length > 0)) && (
          null
        )}

        <Modal
        visible={showProfilePrompt}
        transparent
        animationType="fade"
        onRequestClose={skipProfilePrompt}
      >
        <View style={{
          flex: 1,
          backgroundColor: colors.overlayDark,
          justifyContent: 'center',
          paddingHorizontal: layout.padding.horizontal,
        }}>
          <View style={{
            backgroundColor: colors.background,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.border,
            padding: 18,
            gap: 10,
          }}>
            <Text style={{ fontFamily: 'PlayfairDisplay_700Bold', fontSize: 22, color: colors.text }}>
              {t('home_profile_prompt_title', lang)}
            </Text>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 20, color: colors.textSecondary }}>
              {t('home_profile_prompt_body', lang)}
            </Text>

            <TextInput
              value={profileNameInput}
              onChangeText={setProfileNameInput}
              placeholder={t('home_profile_name_placeholder', lang)}
              placeholderTextColor={colors.textSecondary}
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 10,
                paddingHorizontal: 12,
                paddingVertical: 10,
                color: colors.text,
                fontFamily: 'Inter_400Regular',
                backgroundColor: colors.backgroundDark,
              }}
            />

            <TextInput
              value={profileEmailInput}
              onChangeText={setProfileEmailInput}
              placeholder="E-posta"
              placeholderTextColor={colors.textSecondary}
              autoCapitalize="none"
              keyboardType="email-address"
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 10,
                paddingHorizontal: 12,
                paddingVertical: 10,
                color: colors.text,
                fontFamily: 'Inter_400Regular',
                backgroundColor: colors.backgroundDark,
              }}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
              <TouchableOpacity onPress={skipProfilePrompt} style={{ paddingHorizontal: 12, paddingVertical: 10 }}>
                <Text style={{ fontFamily: 'Inter_500Medium', color: colors.textSecondary }}>
                  {t('home_profile_prompt_later', lang)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveProfilePrompt} style={{ backgroundColor: colors.primary, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10 }}>
                <Text style={{ fontFamily: 'Inter_500Medium', color: colors.onPrimary }}>
                  {t('home_profile_prompt_save', lang)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Ad or Premium Sheet */}
      <AdOrPremiumSheet
        visible={adSheet.visible}
        onClose={() => {
          trackEvent(ANALYTICS_EVENTS.AD_OR_PREMIUM_CHOICE, { source: adSheet.source, choice: 'dismiss' });
          setAdSheet({ visible: false, source: null, storyId: null });
        }}
        onWatchAd={handleWatchAd}
        onGoPremium={handleAdSheetGoPremium}
        isAdLoading={isAdLoading}
        lang={lang}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;

import React, { useState, useEffect, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  StatusBar, Platform, Animated, Modal, TextInput, Image, ImageBackground, useWindowDimensions, FlatList, ActivityIndicator
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
import { LinearGradient } from 'expo-linear-gradient';
import { t, getGreeting } from '../locales/i18n';
import { ANALYTICS_EVENTS, trackEvent } from '../utils/analytics';
import { getCategoryImage, getCategoryTheme, getCategoryBanner, getBadgeBanner } from '../utils/categoryImages';
import { shouldShowAd, loadRewarded, showRewarded } from '../utils/ads';
import BadgeIcon, { BADGE_MAP } from '../components/BadgeIcon';
import { readableTextOn } from '../theme/theme';

const FIRST_SESSION_PROMPT_KEY = '@kivilcim_first_session_prompt';
const PERSONALIZED_MODULE_SNOOZE_KEY = '@kivilcim_personalized_module_snooze_until';
const PROFILE_INFO_PROMPT_SEEN_KEY = '@kivilcim_profile_info_prompt_seen';

const MODULE_TYPES = {
  CONTINUE: 'continue',
  PICKED: 'picked',
  FALLBACK: 'fallback',
};

const HomeLoadingState = ({ colors, layout, isDark }) => {
  const cardBg = isDark ? colors.cardBackground : colors.surfaceContainerLowest;
  const lineBg = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)';
  const softLineBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.045)';

  return (
    <View style={{
      marginHorizontal: layout.padding.horizontal,
      marginTop: 18,
      marginBottom: 14,
      padding: 18,
      borderRadius: layout.radius.card,
      backgroundColor: cardBg,
      borderWidth: 1,
      borderColor: colors.border,
      minHeight: 260,
      justifyContent: 'space-between',
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
        }}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
        <View style={{ flex: 1, gap: 8 }}>
          <View style={{ width: '62%', height: 14, borderRadius: 999, backgroundColor: lineBg }} />
          <View style={{ width: '82%', height: 10, borderRadius: 999, backgroundColor: softLineBg }} />
        </View>
      </View>

      <View style={{ gap: 12 }}>
        <View style={{ height: 96, borderRadius: 16, backgroundColor: lineBg }} />
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1, height: 82, borderRadius: 14, backgroundColor: softLineBg }} />
          <View style={{ flex: 1, height: 82, borderRadius: 14, backgroundColor: softLineBg }} />
        </View>
      </View>
    </View>
  );
};

const normalizeSearchValue = (value = '') =>
  String(value || '').toLocaleLowerCase('tr-TR').trim();

const storyMatchesSearch = (story, query) => {
  const normalizedQuery = normalizeSearchValue(query);
  if (!normalizedQuery) return true;

  const searchable = [
    story?.title,
    story?.body,
    story?.quote,
    story?.lesson,
    story?.source_book,
    story?.cat,
    story?.cat_display,
    story?.parent_cat,
    story?.parent_cat_raw,
  ].map(normalizeSearchValue).join(' ');

  return searchable.includes(normalizedQuery);
};

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

// Blend two hex colours. t=0 → a, t=1 → b. Used to deepen badge gradients for
// dark mode so they sit in the charcoal palette and clear text contrast.
const mixHex = (a, b, t) => {
  const parse = (h) => {
    let x = String(h || '').replace('#', '');
    if (x.length === 3) x = x.split('').map((c) => c + c).join('');
    if (x.length !== 6) return [0, 0, 0];
    return [parseInt(x.slice(0, 2), 16), parseInt(x.slice(2, 4), 16), parseInt(x.slice(4, 6), 16)];
  };
  const [r1, g1, b1] = parse(a);
  const [r2, g2, b2] = parse(b);
  const m = (u, v) => Math.round(u + (v - u) * t);
  const hx = (n) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0');
  return `#${hx(m(r1, r2))}${hx(m(g1, g2))}${hx(m(b1, b2))}`;
};

const getBadgeColors = (badgeId, isDark) => {
  const meta = BADGE_MAP[badgeId];
  const base = meta?.colors
    ? { start: meta.colors[0], end: meta.colors[1] }
    : { start: isDark ? '#444444' : '#666666', end: isDark ? '#222222' : '#444444' };
  if (isDark) {
    // Light-mode badge gradients run bright→dark, so the card's single text
    // colour (derived from the lighter stop) fails WCAG AA over the dark
    // bottom-right where the progress counter sits. Deepen both stops toward the
    // dark canvas (#131311): the fill stays in the "Nocturnal Bibliophile"
    // palette, keeps the badge hue, and lets cream/white text clear contrast
    // across the whole gradient. The vibrant BadgeIcon glyph is unchanged.
    return {
      start: mixHex(base.start, '#131311', 0.6),
      end: mixHex(base.end, '#131311', 0.74),
      text: '#F2E9D8',
    };
  }
  return { start: base.start, end: base.end, text: '#FFFFFF' };
};

// Relative luminance (WCAG) for a hex colour — used to pick which gradient
// stop a card's on-fill text colour should be derived from. Same formula the
// primary action card uses for its own contrast derivation.
const relLum = (hex) => {
  if (typeof hex !== 'string' || hex[0] !== '#') return 1;
  let h = hex.slice(1);
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  if (h.length !== 6) return 1;
  const ch = (s) => {
    const v = parseInt(s, 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * ch(h.slice(0, 2)) + 0.7152 * ch(h.slice(2, 4)) + 0.0722 * ch(h.slice(4, 6));
};

// Per-card text-contrast derivation for the badge carousel (and its "See all"
// card). Never hardcode white/black text on a filled gold or accent surface —
// always derive it from the fill via readableTextOn(), same rule the single
// badge card used to apply once for the whole card, now computed per card.
const getBadgeCardTextColors = (startColor, endColor, useBannerImage, accentColor) => {
  const fillRef = relLum(startColor) >= relLum(endColor) ? startColor : endColor;
  const onFill = readableTextOn(fillRef);
  const isDarkText = onFill === '#1A1A1A';
  const onFillSoft = isDarkText ? 'rgba(26,26,26,0.72)' : 'rgba(255,255,255,0.85)';
  const onFillFaint = isDarkText ? 'rgba(26,26,26,0.6)' : 'rgba(255,255,255,0.8)';

  return {
    isDarkText,
    titleColor: useBannerImage ? '#2E2A22' : onFill,
    eyebrowColor: useBannerImage ? accentColor : onFillSoft,
    subColor: useBannerImage ? '#5A5246' : onFillSoft,
    progressColor: useBannerImage ? accentColor : onFillFaint,
    progressTrackBg: useBannerImage ? 'rgba(0,0,0,0.08)' : (isDarkText ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.2)'),
  };
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
  const { isPremium, isOnboarded, history, earnedBadges, totalReads, todayReadsCount, streak, longestStreak, categoryStats, shareCount, favorites, preferences, userProfile, updateUserProfile, isStoryCompleted, markStoryCompleted, openBadgeModal } = useUserData();
  const { stories, storiesLoading, categories, parentCategories, errorMsg } = useStories();
  const insets = useSafeAreaInsets();
  const { width: viewportWidth } = useWindowDimensions();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
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
  const [isFeaturedCollapsed, setIsFeaturedCollapsed] = useState(false);
  const featuredAutoCollapsedRef = useRef(false);
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
  const brandLogoSize = isTablet ? 32 : isSmallPhone ? 24 : 26;
  const sectionHeadingFontSize = 22;
  const readyTitleFontSize = 20;
  const featuredCardColumns = isTablet ? 3.1 : isSmallPhone ? 2.05 : 2.25;
  const featuredCardGap = 12;
  const featuredCardWidth = (screenWidth - (layout.padding.horizontal * 2) - featuredCardGap) / featuredCardColumns;
  // Badge carousel: card is ~88% of screen width so the next card's edge
  // peeks in; height is fixed so swiping never jumps the vertical ScrollView.
  const badgeCardGap = 12;
  const badgeCardWidth = Math.round(screenWidth * 0.88);
  const badgeCardHeight = 200;

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

  // Badge carousel data: first 3 next-closest candidates + a trailing
  // "See all" card (max 4 cards total).
  const badgeCarouselItems = React.useMemo(() => {
    const items = badgeProgressInfo.nextCandidates.slice(0, 3).map((badge) => ({
      type: 'badge',
      key: `badge-${badge.id}`,
      badge,
    }));
    items.push({ type: 'seeAll', key: 'badge-see-all' });
    return items;
  }, [badgeProgressInfo.nextCandidates]);

  // Tracks the active dot live while dragging (not just once momentum ends)
  // so the indicator keeps up with the swipe instead of lagging until the
  // card settles. scrollEventThrottle={16} (~60fps) makes onScroll cheap
  // enough to drive this; the functional setState form compares against the
  // latest committed index so a frame that lands on the same card is a no-op
  // (no redundant re-render every frame).
  const handleBadgeScroll = ({ nativeEvent }) => {
    const offsetX = nativeEvent?.contentOffset?.x || 0;
    const index = Math.round(offsetX / (badgeCardWidth + badgeCardGap));
    const clampedIndex = Math.max(0, Math.min(index, badgeCarouselItems.length - 1));
    setBadgeCardIndex((prev) => (prev === clampedIndex ? prev : clampedIndex));
  };

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
      const FEATURED_PANEL_KEY = `@spark_featured_panel_${todayKey}`;

      Promise.all([
        getSelectedCategories().catch(() => null),
        AsyncStorage.getItem(FIRST_SESSION_PROMPT_KEY).catch(() => null),
        AsyncStorage.getItem(PERSONALIZED_MODULE_SNOOZE_KEY).catch(() => null),
        AsyncStorage.getItem(DAILY_PANEL_KEY).catch(() => null),
        AsyncStorage.getItem(FEATURED_PANEL_KEY).catch(() => null),
      ]).then(([list, promptFlag, moduleSnoozeUntil, dailyPanelData, featuredPanelData]) => {
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

        if (featuredPanelData) {
          try {
            const parsed = JSON.parse(featuredPanelData);
            setIsFeaturedCollapsed(Boolean(parsed.collapsed));
            featuredAutoCollapsedRef.current = Boolean(parsed.auto);
          } catch {
            // ignore
          }
        } else {
          setIsFeaturedCollapsed(false);
          featuredAutoCollapsedRef.current = false;
        }
      });

      return () => {
        isActive = false;
      };
    }, [])
  );
  
  // Bugünü al (dinamik)
  const todayStr = new Date().toISOString().split('T')[0];

  // 1. Profilde seçilen içerik sürümünü ve yayın tarihini uygula.
  // 'F5' / 'F6' ve 'C1' / 'C2' gibi string sürümler Versiyon 2 koleksiyonunda gösterilir.
  const normalizeStoryVersion = (v) =>
    /^(F|C)\d+$/.test(String(v ?? '').trim().toUpperCase()) ? 2 : (Number(v) || 1);
  const selectedStoryVersion = Number(preferences?.storyVersion) === 2 ? 2 : 1;
  const versionStories = (stories || []).filter((story) => normalizeStoryVersion(story.version) === selectedStoryVersion);
  // publishDate may be a full date string ("2018-01-01") or just a year integer (2018 from Supabase).
  // Normalize to a 4-digit year string for safe comparison.
  const publishedStories = versionStories.filter(s => {
    const pd = s.publishDate;
    if (pd == null) return true;
    const yearStr = String(pd).slice(0, 4); // "2018-01-01" → "2018", 2018 → "2018"
    return yearStr <= todayStr.slice(0, 4);
  });

  // 2. Preferences Filter: Sadece takip edilen Ebeveyn kategorileri gösteririz.
  let prefFiltered = publishedStories;
  if (selectedCategories && selectedCategories.length > 0) {
    prefFiltered = publishedStories.filter((s) => selectedCategories.includes(Number(s.parent_cat_id)));
    // If no stories found in selected categories, fallback to all published
    if (prefFiltered.length === 0) prefFiltered = publishedStories;
  }

  // 3. UI Filter: Ekranda tıklanan ebeveyn kategoriye göre filtreleme
  const isSearchActive = searchQuery.trim().length > 0;
  const categoryFiltered = isSearchActive || activeFilter === 'all'
    ? prefFiltered
    : prefFiltered.filter((s) => Number(s.parent_cat_id) === Number(activeFilter));
  const searchFiltered = isSearchActive
    ? categoryFiltered.filter((story) => storyMatchesSearch(story, searchQuery))
    : categoryFiltered;

  const storiesReadToday = new Set((history || []).slice(0, Math.max(0, todayReadsCount || 0)).map(String));

  // 3. Sıralama
  const sortedStories = [...searchFiltered].sort((a, b) => {
    const aReadToday = storiesReadToday.has(String(a.story_id));
    const bReadToday = storiesReadToday.has(String(b.story_id));

    // Bugün okunanlar her zaman en üstte kalsın (Ekranda listelensin)
    if (aReadToday !== bReadToday) {
      return aReadToday ? -1 : 1;
    }
    
    // Eğer ikisi de bugün okunmuşsa, en son okunan (history'de üstte olan) önce gelsin
    if (aReadToday && bReadToday) {
      const idxA = (history || []).findIndex(id => String(id) === String(a.story_id));
      const idxB = (history || []).findIndex(id => String(id) === String(b.story_id));
      return idxA - idxB;
    }

    // Sınırsız üyeler için eskiden okunanları (bugün okunmayanları) en sona at
    if (isPremium) {
      const aRead = checkIfRead(a.story_id);
      const bRead = checkIfRead(b.story_id);
      if (aRead !== bRead) {
        return aRead ? 1 : -1; // Okunanları sona at
      }
    }

    // Tümü seçiliyse okunmamış hikayeleri pseudo-random sırala 
    // Okunmayanlar değişsin diye seed'e okuma sayısını ekliyoruz
    if (activeFilter === 'all') {
      const seed = parseInt(todayStr.replace(/-/g, ''), 10) + (todayReadsCount || 0);
      const pseudoRandom = (id) => {
        const val = parseInt(id, 10) * seed;
        return (val * 9301 + 49297) % 233280;
      };
      return pseudoRandom(b.story_id) - pseudoRandom(a.story_id);
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

  // Count actually-read stories today from DB directly
  const doneCount = Math.min(todayReadsCount || 0, personalizedTarget);
  const historySet = React.useMemo(() => new Set((history || []).map(id => String(id))), [history]);

  const remainingStories = isSearchActive
    ? sortedStories
    : sortedStories.filter((story) =>
      !personalizedStoryIds.has(story.story_id) && !historySet.has(String(story.story_id))
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
  const [adUnavailable, setAdUnavailable] = useState(false);
  // Holds a loaded rewarded ad to show only after the sheet Modal is fully
  // dismissed — showing it while the Modal is still presented makes iOS throw
  // "already presenting another view controller" and Android freeze.
  const pendingRewardedRef = useRef(null);
  const flushPendingRewarded = () => {
    const p = pendingRewardedRef.current;
    if (!p) return;
    pendingRewardedRef.current = null;
    showRewarded(p.ad, { onEarned: p.onEarned, onClosed: p.onClosed });
  };

  const openAdOrPremiumSheet = (source, storyId = null) => {
    trackEvent(ANALYTICS_EVENTS.FREE_LIMIT_TO_PAYWALL, { source, storyId, lang });
    setAdUnavailable(false);
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
      setAdUnavailable(true);
      trackEvent(ANALYTICS_EVENTS.AD_FAILED_TO_LOAD, { source: adSheet.source, storyId: adSheet.storyId, lang });
      return;
    }
    setAdUnavailable(false);
    const source = adSheet.source;
    const pendingStoryId = adSheet.storyId;
    // Queue the ad and close the sheet. It is shown from the Modal's onDismiss
    // (iOS) or a fallback timer (Android) — never while the Modal is presented.
    pendingRewardedRef.current = {
      ad,
      onEarned: () => trackEvent(ANALYTICS_EVENTS.REWARDED_AD_COMPLETED, { source }),
      onClosed: () => {
        if (pendingStoryId) {
          const story = sortedStories.find(s => String(s.story_id) === String(pendingStoryId));
          if (story) {
            trackEvent(ANALYTICS_EVENTS.PERSONALIZED_STORY_OPENED, { storyId: pendingStoryId, source: 'ad_unlocked', lang });
            navigation.navigate('StoryDetail', { story });
          }
        }
      },
    };
    setAdSheet({ visible: false, source: null, storyId: null });
    setTimeout(flushPendingRewarded, 600);
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
  const primaryHomeAction = React.useMemo(() => {
    const nextStory = personalizedStories.find((story) => !historySet.has(String(story.story_id))) || personalizedStories[0] || sortedStories[0] || null;
    const isComplete = doneCount >= personalizedTarget;

    if (isComplete) {
      if (badgeProgressInfo.nextCandidates.length > 0) {
        const nextBadge = badgeProgressInfo.nextCandidates[0];
        return {
          isBadgeCard: true,
          badge: nextBadge,
          eyebrow: t('home_badge_journey_label', lang),
          title: t(nextBadge.titleKey, lang),
          sub: t(nextBadge.descKey, lang),
          cta: null,
          icon: nextBadge.icon,
          source: 'home_primary_next_badge',
        };
      }

      return {
        eyebrow: t('home_primary_completed_eyebrow', lang),
        title: t('home_primary_completed_title', lang),
        sub: t('home_primary_completed_sub', lang),
        cta: t('home_primary_completed_cta', lang),
        icon: 'checkmark-circle',
        story: nextStory,
        source: 'home_primary_completed',
      };
    }

    if (historySet.size > 0) {
      return {
        eyebrow: t('home_primary_continue_eyebrow', lang),
        title: t('home_primary_continue_title', lang),
        sub: nextStory?.title || t('home_primary_empty_sub', lang),
        cta: t('home_primary_continue_cta', lang),
        icon: 'play-circle',
        story: nextStory,
        source: 'home_primary_continue',
      };
    }

    return {
      eyebrow: t('home_primary_new_eyebrow', lang),
      title: t('home_primary_new_title', lang),
      sub: nextStory?.title || t('home_primary_empty_sub', lang),
      cta: t('home_primary_new_cta', lang),
      icon: 'sparkles',
      story: nextStory,
      source: 'home_primary_new',
    };
  }, [personalizedStories, sortedStories, historySet, doneCount, lang, badgeProgressInfo, personalizedTarget]);

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

  const openPrimaryHomeAction = () => {
    if (primaryHomeAction.story) {
      trackEvent(ANALYTICS_EVENTS.PERSONALIZED_STORY_OPENED, {
        storyId: primaryHomeAction.story.story_id,
        position: 0,
        source: primaryHomeAction.source,
        dailyStoryTarget: personalizedTarget,
        lang,
      });
      navigation.navigate('StoryDetail', { story: primaryHomeAction.story });
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

  const persistFeaturedPanelState = React.useCallback((collapsed, auto) => {
    const todayKey = new Date().toISOString().split('T')[0];
    AsyncStorage.setItem(`@spark_featured_panel_${todayKey}`, JSON.stringify({ collapsed, auto })).catch(() => {});
  }, []);

  // "Bugünün Fikri" bölümü: gösterilen hikayeler ve okunma durumu
  const featuredStories = (personalizedStories.length > 0
    ? personalizedStories
    : sortedStories.slice(0, 4)
  ).slice(0, 3);
  const featuredReadCount = featuredStories.filter((s) => checkIfRead(s.story_id)).length;
  const allFeaturedRead = featuredStories.length > 0 && featuredReadCount >= featuredStories.length;

  // Tümü okununca bölümü bir kez otomatik katla (kullanıcı sonra açarsa tekrar kapatma)
  useEffect(() => {
    if (!allFeaturedRead || featuredAutoCollapsedRef.current) return;
    featuredAutoCollapsedRef.current = true;
    setIsFeaturedCollapsed(true);
    persistFeaturedPanelState(true, true);
  }, [allFeaturedRead, persistFeaturedPanelState]);

  const toggleFeaturedCollapsed = () => {
    const next = !isFeaturedCollapsed;
    setIsFeaturedCollapsed(next);
    persistFeaturedPanelState(next, featuredAutoCollapsedRef.current);
  };

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
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    brandLogoText: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: 28,
      color: colors.text,
      letterSpacing: 0.2,
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
    searchWrap: {
      marginHorizontal: layout.padding.horizontal,
      marginTop: 8,
      marginBottom: 4,
      minHeight: 46,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surfaceContainerLowest,
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: 14,
      paddingRight: 6,
    },
    searchInput: {
      flex: 1,
      minHeight: 46,
      paddingHorizontal: 10,
      fontFamily: 'Inter_400Regular',
      fontSize: 15,
      color: colors.text,
    },
    searchClearBtn: {
      width: 34,
      height: 34,
      borderRadius: 17,
      alignItems: 'center',
      justifyContent: 'center',
    },
    searchResultLine: {
      fontFamily: 'Inter_400Regular',
      fontSize: 12,
      color: colors.textSecondary,
      marginHorizontal: layout.padding.horizontal,
      marginTop: 6,
      marginBottom: 4,
    },
    searchEmptyButton: {
      marginTop: 16,
      minHeight: 44,
      borderRadius: 12,
      paddingHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
    },
    searchEmptyButtonText: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 13,
      color: colors.onPrimary,
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
      color: colors.text,
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
      height: 250,
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
      height: 80,
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
      color: isDark ? '#F6EDE1' : colors.text,
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
      marginTop: 8,
      marginBottom: 6,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.primaryContainer,
      paddingVertical: 7,
      paddingHorizontal: 8,
      alignSelf: 'stretch',
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
    insightRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      backgroundColor: colors.surfaceContainerLowest,
      borderRadius: 18,
      borderWidth: 1,
      padding: 12,
    },
    insightIcon: {
      width: 54,
      height: 54,
      borderRadius: 14,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    insightIconImg: {
      width: '100%',
      height: '100%',
    },
    insightTitle: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: 16,
      lineHeight: 21,
      color: colors.text,
    },
    insightMeta: {
      fontFamily: 'Inter_400Regular',
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 3,
    },
    insightAction: {
      flexShrink: 0,
      marginLeft: 10,
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    readyTitle: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: readyTitleFontSize,
      color: colors.text,
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
    primaryActionCard: {
      marginHorizontal: layout.padding.horizontal,
      marginTop: 12,
      marginBottom: 20,
      borderRadius: layout.radius.card,
      overflow: 'hidden',
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 6,
    },
    primaryActionGradient: {
      padding: 20,
    },
    primaryActionTop: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      marginBottom: 16,
    },
    primaryActionIconWrap: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
    },
    primaryActionTextWrap: {
      flex: 1,
    },
    primaryActionEyebrow: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 12,
      color: 'rgba(255, 255, 255, 0.9)',
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 4,
    },
    primaryActionTitle: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: isSmallPhone ? 22 : 24,
      color: '#FFFFFF',
      lineHeight: isSmallPhone ? 26 : 28,
    },
    primaryActionSub: {
      fontFamily: 'Inter_400Regular',
      fontSize: 14,
      color: 'rgba(255, 255, 255, 0.85)',
      lineHeight: 20,
      marginBottom: 16,
    },
    primaryActionFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    primaryActionProgress: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 13,
      color: 'rgba(255, 255, 255, 0.8)',
    },
    primaryActionCta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      borderRadius: 999,
      paddingHorizontal: 16,
      paddingVertical: 10,
      backgroundColor: '#FFFFFF',
    },
    primaryActionCtaText: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 14,
      color: colors.primary,
    },
    badgeCarouselWrap: {
      marginTop: 12,
      marginBottom: 20,
    },
    badgeCarouselCard: {
      width: badgeCardWidth,
      height: badgeCardHeight,
      borderRadius: layout.radius.card,
      overflow: 'hidden',
      marginRight: badgeCardGap,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 6,
    },
    badgeCarouselCardFill: {
      flex: 1,
      padding: 20,
    },
    badgeCarouselSeeAllFill: {
      flex: 1,
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badgeSeeAllIconWrap: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    badgeCarouselDotsRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 6,
      marginTop: 12,
    },
    badgeCarouselDot: {
      height: 6,
      borderRadius: 3,
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
        {/* Header */}
        <View style={styles.homeHeader}>
          <View style={styles.brandLogo}>
            <Text style={styles.brandLogoText}>Albor</Text>
          </View>
          {doneCount < personalizedTarget && (
            <TouchableOpacity
              style={styles.headerBadgeWrap}
              onPress={() => navigation.navigate('ProgressTab')}
              activeOpacity={0.85}
            >
              <View style={{ width: 42, height: 42, borderRadius: 21, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceContainerHigh }}>
                <Text style={{ fontSize: 24 }}>🏆</Text>
              </View>
              <Text style={styles.headerBadgeSub}>{badgeProgressInfo.earned}/{badgeProgressInfo.total}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.searchWrap}>
          <Ionicons name="search" size={18} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('searchPlaceholder', lang)}
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            accessibilityLabel={t('searchInputAccessibility', lang)}
          />
          {searchQuery.trim().length > 0 && (
            <TouchableOpacity
              style={styles.searchClearBtn}
              onPress={() => setSearchQuery('')}
              accessibilityRole="button"
              accessibilityLabel={t('searchClearAccessibility', lang)}
            >
              <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {!loading && isSearchActive && (
          <Text style={styles.searchResultLine}>
            {`${sortedStories.length} ${t('foundStories', lang)}`}
          </Text>
        )}

        {loading && <HomeLoadingState colors={colors} layout={layout} isDark={isDark} />}

        {/* Category Pills */}
        {!loading && !isSearchActive && (
          <>
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
                  vertical
                  isDark={isDark}
                  onPress={() => setActiveFilter(item.key)}
                />
              )}
              keyExtractor={(item) => String(item.key)}
              contentContainerStyle={{ gap: 8, paddingHorizontal: layout.padding.horizontal }}
              showsHorizontalScrollIndicator={false}
              style={{ marginTop: 12, marginBottom: 4 }}
              scrollToOverflowEnabled={true}
            />
          </>
        )}

        {!loading && !isSearchActive && sortedStories.length > 0 && !primaryHomeAction.isBadgeCard && (() => {
          // Banner takes the active category colour (B2). On "All" it keeps the
          // brand gold; on a category it shifts from a lighter tone (top-left)
          // to the accent (bottom-right) for soft depth.
          const isAllFilter = activeFilter === 'all';
          const activeCatItem = visibleCategoriesList.find((item) => item.key === activeFilter);
          const activeCatTheme = getCategoryTheme(activeCatItem?.rawName || activeCatItem?.label, isDark);
          const isBadge = primaryHomeAction.isBadgeCard;
          // Soft light banner artwork in light mode (badge or category); dark
          // mode falls back to a coloured gradient.
          const useBannerImage = !isDark;
          const badgeAccent = getBadgeColors(primaryHomeAction.badge?.id, isDark).end || colors.primary;
          const accentColor = isBadge
            ? badgeAccent
            : (isAllFilter ? (colors.ctaGradientStart || colors.primary) : activeCatTheme.accent);
          const bannerCtaColor = accentColor;
          const bannerColors = isBadge
            ? [getBadgeColors(primaryHomeAction.badge?.id, isDark).start, getBadgeColors(primaryHomeAction.badge?.id, isDark).end]
            : isAllFilter
              ? [colors.ctaGradientStart || colors.primary, colors.ctaGradientEnd || colors.primaryContainer]
              : [activeCatTheme.borderColor, activeCatTheme.accent];
          const bannerSource = isBadge
            ? getBadgeBanner(primaryHomeAction.badge?.id).source
            : getCategoryBanner(isAllFilter ? 'Tümü' : (activeCatItem?.rawName || activeCatItem?.label)).source;
          // Dark mode fills the card with a gradient (no banner image). The gold/
          // accent fills are light, so hardcoded white text fails contrast. Derive
          // the text colour from the lighter gradient stop via readableTextOn().
          const relLum = (hex) => {
            if (typeof hex !== 'string' || hex[0] !== '#') return 1;
            let h = hex.slice(1);
            if (h.length === 3) h = h.split('').map((c) => c + c).join('');
            if (h.length !== 6) return 1;
            const ch = (s) => {
              const v = parseInt(s, 16) / 255;
              return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
            };
            return 0.2126 * ch(h.slice(0, 2)) + 0.7152 * ch(h.slice(2, 4)) + 0.0722 * ch(h.slice(4, 6));
          };
          const fillRef = relLum(bannerColors[0]) >= relLum(bannerColors[1]) ? bannerColors[0] : bannerColors[1];
          const onFill = readableTextOn(fillRef);
          const isDarkText = onFill === '#1A1A1A';
          const onFillSoft = isDarkText ? 'rgba(26,26,26,0.72)' : 'rgba(255,255,255,0.85)';
          const onFillFaint = isDarkText ? 'rgba(26,26,26,0.6)' : 'rgba(255,255,255,0.8)';

          const titleColor = useBannerImage ? '#2E2A22' : onFill;
          const eyebrowColor = useBannerImage ? accentColor : onFillSoft;
          const subColor = useBannerImage ? '#5A5246' : onFillSoft;
          const progressColor = useBannerImage ? accentColor : onFillFaint;
          const progressTrackBg = useBannerImage ? 'rgba(0,0,0,0.08)' : (isDarkText ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.2)');
          const iconWrapBg = useBannerImage ? '#FFFFFF' : (isDarkText ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.25)');
          const iconColor = useBannerImage ? accentColor : onFill;

          const bannerInner = (
            <>
              <View style={styles.primaryActionTop}>
                {!primaryHomeAction.isBadgeCard && (
                  <View style={[styles.primaryActionIconWrap, { backgroundColor: iconWrapBg }]}>
                    <Ionicons name={primaryHomeAction.icon} size={26} color={iconColor} />
                  </View>
                )}
                <View style={[styles.primaryActionTextWrap, isBadge && { maxWidth: '50%' }]}>
                  <Text style={[styles.primaryActionEyebrow, { color: eyebrowColor }]}>{primaryHomeAction.eyebrow}</Text>
                  <Text style={[styles.primaryActionTitle, { color: titleColor }]}>{primaryHomeAction.title}</Text>
                </View>
              </View>
              <Text style={[styles.primaryActionSub, { color: subColor }, isBadge && { maxWidth: '50%' }]} numberOfLines={2}>{primaryHomeAction.sub}</Text>

              {primaryHomeAction.isBadgeCard ? (
                <View style={[styles.primaryActionFooter, { alignItems: 'center', justifyContent: 'flex-start' }]}>
                  <View style={{ width: '50%', marginRight: 6 }}>
                    <View style={{ height: 6, backgroundColor: progressTrackBg, borderRadius: 3, overflow: 'hidden' }}>
                      <View style={{ width: `${primaryHomeAction.badge.ratio * 100}%`, height: '100%', backgroundColor: progressColor }} />
                    </View>
                  </View>
                  <Text style={[styles.primaryActionProgress, { color: progressColor }]}>
                    {primaryHomeAction.badge.current} / {primaryHomeAction.badge.target}
                  </Text>
                </View>
              ) : (
                <View style={styles.primaryActionFooter}>
                  <Text style={[styles.primaryActionProgress, { color: progressColor }]}>{doneCount} / {Math.max(personalizedTarget, 1)}</Text>
                  <View style={[styles.primaryActionCta, isDark && { backgroundColor: '#1A1A1A' }]}>
                    <Text style={[styles.primaryActionCtaText, { color: bannerCtaColor }]}>{primaryHomeAction.cta}</Text>
                    <Ionicons name="arrow-forward" size={16} color={bannerCtaColor} />
                  </View>
                </View>
              )}
            </>
          );

          return (
          <TouchableOpacity
            style={styles.primaryActionCard}
            onPress={primaryHomeAction.isBadgeCard ? () => navigation.navigate('ProgressTab') : openPrimaryHomeAction}
            activeOpacity={0.86}
            accessibilityRole="button"
          >
            {useBannerImage ? (
              <ImageBackground
                source={bannerSource}
                resizeMode="cover"
                style={styles.primaryActionGradient}
                imageStyle={{ borderRadius: layout.radius.card }}
              >
                {bannerInner}
              </ImageBackground>
            ) : (
              <LinearGradient
                colors={bannerColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.primaryActionGradient}
              >
                {bannerInner}
              </LinearGradient>
            )}
          </TouchableOpacity>
          );
        })()}

        {/* Badge journey carousel — replaces the single primary card once the
            daily goal is complete. Peek carousel: each card is ~88% of the
            screen width so the next card's edge shows, inviting a swipe. */}
        {!loading && !isSearchActive && sortedStories.length > 0 && primaryHomeAction.isBadgeCard && (() => {
          const safeBadgeIndex = Math.min(badgeCardIndex, badgeCarouselItems.length - 1);
          return (
          <View style={styles.badgeCarouselWrap}>
            <ScrollView
              ref={badgeScrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={badgeCardWidth + badgeCardGap}
              decelerationRate="fast"
              onScroll={handleBadgeScroll}
              scrollEventThrottle={16}
              contentContainerStyle={{ paddingHorizontal: layout.padding.horizontal }}
            >
              {badgeCarouselItems.map((item, index) => {
                const isLast = index === badgeCarouselItems.length - 1;
                const cardStyle = [styles.badgeCarouselCard, isLast && { marginRight: 0 }];

                if (item.type === 'seeAll') {
                  const seeAllStart = colors.ctaGradientStart || colors.primary;
                  const seeAllEnd = colors.ctaGradientEnd || colors.primaryContainer;
                  const seeAllTextColors = getBadgeCardTextColors(seeAllStart, seeAllEnd, false, seeAllEnd);
                  const seeAllIconBg = seeAllTextColors.isDarkText ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.25)';
                  return (
                    <TouchableOpacity
                      key={item.key}
                      style={cardStyle}
                      activeOpacity={0.86}
                      onPress={() => navigation.navigate('ProgressTab')}
                      accessibilityRole="button"
                      accessibilityLabel={t('home_badge_see_all_title', lang)}
                    >
                      <LinearGradient
                        colors={[seeAllStart, seeAllEnd]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.badgeCarouselSeeAllFill}
                      >
                        <View style={[styles.badgeSeeAllIconWrap, { backgroundColor: seeAllIconBg }]}>
                          <Ionicons name="arrow-forward" size={24} color={seeAllTextColors.titleColor} />
                        </View>
                        <Text style={[styles.primaryActionTitle, { color: seeAllTextColors.titleColor, fontSize: isSmallPhone ? 18 : 20, textAlign: 'center' }]}>
                          {t('home_badge_see_all_title', lang)}
                        </Text>
                        <Text style={[styles.primaryActionSub, { color: seeAllTextColors.subColor, textAlign: 'center', marginBottom: 0 }]} numberOfLines={2}>
                          {t('home_badge_see_all_sub', lang)}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  );
                }

                const { badge } = item;
                const badgeCardColors = getBadgeColors(badge.id, isDark);
                const badgeCardAccent = badgeCardColors.end || colors.primary;
                const useBannerImageForCard = !isDark;
                const badgeCardBannerSource = getBadgeBanner(badge.id).source;
                const cardTextColors = getBadgeCardTextColors(badgeCardColors.start, badgeCardColors.end, useBannerImageForCard, badgeCardAccent);

                const cardInner = (
                  <>
                    <View style={styles.primaryActionTop}>
                      <View style={[styles.primaryActionTextWrap, { maxWidth: '50%' }]}>
                        <Text style={[styles.primaryActionEyebrow, { color: cardTextColors.eyebrowColor }]}>{t('home_badge_journey_label', lang)}</Text>
                        <Text style={[styles.primaryActionTitle, { color: cardTextColors.titleColor }]}>{t(badge.titleKey, lang)}</Text>
                      </View>
                    </View>
                    <Text style={[styles.primaryActionSub, { color: cardTextColors.subColor, maxWidth: '50%' }]} numberOfLines={2}>
                      {t(badge.descKey, lang)}
                    </Text>
                    <View style={[styles.primaryActionFooter, { alignItems: 'center', justifyContent: 'flex-start' }]}>
                      <View style={{ width: '50%', marginRight: 6 }}>
                        <View style={{ height: 6, backgroundColor: cardTextColors.progressTrackBg, borderRadius: 3, overflow: 'hidden' }}>
                          <View style={{ width: `${badge.ratio * 100}%`, height: '100%', backgroundColor: cardTextColors.progressColor }} />
                        </View>
                      </View>
                      <Text style={[styles.primaryActionProgress, { color: cardTextColors.progressColor }]}>
                        {badge.current} / {badge.target}
                      </Text>
                    </View>
                  </>
                );

                return (
                  <TouchableOpacity
                    key={item.key}
                    style={cardStyle}
                    activeOpacity={0.86}
                    onPress={() => openBadgeModal(badge)}
                    accessibilityRole="button"
                    accessibilityLabel={t(badge.titleKey, lang)}
                  >
                    {useBannerImageForCard ? (
                      <ImageBackground
                        source={badgeCardBannerSource}
                        resizeMode="cover"
                        style={styles.badgeCarouselCardFill}
                        imageStyle={{ borderRadius: layout.radius.card }}
                      >
                        {cardInner}
                      </ImageBackground>
                    ) : (
                      <LinearGradient
                        colors={[badgeCardColors.start, badgeCardColors.end]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.badgeCarouselCardFill}
                      >
                        {cardInner}
                      </LinearGradient>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {badgeCarouselItems.length > 1 && (
              <View style={styles.badgeCarouselDotsRow}>
                {badgeCarouselItems.map((item, idx) => {
                  const isActive = idx === safeBadgeIndex;
                  const activeColor = item.type === 'badge'
                    ? (getBadgeColors(item.badge.id, isDark).end || colors.primary)
                    : colors.primary;
                  const inactiveColor = isDark ? 'rgba(255,255,255,0.24)' : 'rgba(0,0,0,0.16)';
                  return (
                    <View
                      key={`dot-${item.key}`}
                      style={[
                        styles.badgeCarouselDot,
                        { width: isActive ? 18 : 6, backgroundColor: isActive ? activeColor : inactiveColor },
                      ]}
                    />
                  );
                })}
              </View>
            )}
          </View>
          );
        })()}

        {/* Featured Story Cards (Horizontal Scroll) */}
        {!loading && !isSearchActive && sortedStories.length > 0 && (() => {
          const featuredHidden = allFeaturedRead && isFeaturedCollapsed;
          return (
            <>
              <TouchableOpacity
                style={styles.sectionHeadingRow}
                onPress={allFeaturedRead ? toggleFeaturedCollapsed : undefined}
                activeOpacity={allFeaturedRead ? 0.7 : 1}
                disabled={!allFeaturedRead}
                accessibilityRole={allFeaturedRead ? 'button' : undefined}
                accessibilityLabel={t('home_featured_section_title', lang).replace('{{count}}', String(personalizedTarget))}
                accessibilityState={allFeaturedRead ? { expanded: !featuredHidden } : undefined}
              >
                 <Text style={[styles.sectionHeading, { marginHorizontal: 0, marginTop: 0, marginBottom: 0 }]}>{t('home_featured_section_title', lang).replace('{{count}}', String(personalizedTarget))}</Text>
                 {allFeaturedRead && (
                   <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                     <View style={{
                       flexDirection: 'row',
                       alignItems: 'center',
                       gap: 4,
                       backgroundColor: `${colors.success}1A`,
                       borderRadius: 999,
                       paddingHorizontal: 10,
                       paddingVertical: 4,
                     }}>
                       <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                       <Text style={{
                         fontFamily: 'Inter_600SemiBold',
                         fontSize: 13,
                         color: colors.success,
                       }}>{featuredReadCount}/{featuredStories.length}</Text>
                     </View>
                     <Ionicons
                       name={featuredHidden ? 'chevron-down' : 'chevron-up'}
                       size={18}
                       color={colors.textSecondary}
                     />
                   </View>
                 )}
              </TouchableOpacity>
              {!featuredHidden && (
              <View style={{ paddingHorizontal: layout.padding.horizontal, gap: 10 }}>
                {featuredStories.map((story, idx) => {
                  const catTheme = getCategoryTheme(story.parent_cat_raw || story.parent_cat || story.cat, isDark);
                  const catImg = getCategoryImage(story.parent_cat_raw || story.parent_cat || story.cat, isDark);
                  const displayCat = toPascalCase(t(story.parent_cat || story.cat, lang) || '');
                  const isRead = checkIfRead(story.story_id);
                  const isLocked = !isPremium && !free.some(freeStory => String(freeStory.story_id) === String(story.story_id));
                  const mins = Number(story.min || story.possible_read_minutes) || personalizedMinutes;
                  return (
                    <TouchableOpacity
                      key={`featured-${story.story_id}`}
                      style={[styles.insightRow, { borderColor: isRead ? `${colors.border}` : `${catTheme.borderColor}66`, opacity: isLocked ? 0.6 : 1 }]}
                      activeOpacity={0.85}
                      onPress={() => {
                        if (isLocked) {
                          openPaywallFromFreeLimit('home_featured_story_locked', story.story_id);
                        } else {
                          openPersonalizedStory(story, idx);
                        }
                      }}
                    >
                      <View style={[styles.insightIcon, { backgroundColor: catTheme.backgroundColor }]}>
                        {catImg.source ? (
                          <Image source={catImg.source} style={styles.insightIconImg} resizeMode="cover" />
                        ) : (
                          <Ionicons name="book-outline" size={24} color={catTheme.accent} />
                        )}
                      </View>
                      <View style={{ flex: 1, minWidth: 0 }}>
                        <Text numberOfLines={2} style={styles.insightTitle}>{story.title}</Text>
                        <Text numberOfLines={1} style={styles.insightMeta}>
                          <Text style={{ color: catTheme.accent, fontFamily: 'Inter_600SemiBold' }}>{displayCat}</Text>
                          {`  ·  ${mins} ${lang === 'tr' ? 'dk' : 'min'}`}
                        </Text>
                      </View>
                      {isLocked ? (
                        <Ionicons name="lock-closed" size={20} color={colors.textSecondary} style={{ marginLeft: 10 }} />
                      ) : isRead ? (
                        <Ionicons name="checkmark" size={22} color={colors.success} style={{ marginLeft: 10 }} />
                      ) : (
                        <TouchableOpacity
                          style={[styles.insightAction, { backgroundColor: `${catTheme.accent}1A` }]}
                          onPress={() => navigation.navigate('UseInConversation', { story })}
                          activeOpacity={0.86}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                          accessibilityRole="button"
                          accessibilityLabel={t('story_detail_use_cta', lang)}
                        >
                          <Ionicons name="chatbubble-ellipses-outline" size={20} color={catTheme.accent} />
                        </TouchableOpacity>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
              )}
            </>
          );
        })()}

        {!loading && !isSearchActive && <Text style={[styles.sectionLabel, { paddingHorizontal: layout.padding.horizontal }]}>{todayLabel}</Text>}
        
        <View style={{ paddingHorizontal: layout.padding.horizontal }}>
          {loading ? null : sortedStories.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 48, paddingHorizontal: 24 }}>
              <Text style={{ fontSize: 48, marginBottom: 16 }}>✨</Text>
              <Text style={{
                fontFamily: 'PlayfairDisplay_600SemiBold',
                fontSize: typography.sizes.headingSmall,
                color: colors.text,
                textAlign: 'center',
                marginBottom: 8,
              }}>
                {isSearchActive ? t('searchNoResultsTitle', lang) : t('noStoriesTitle', lang)}
              </Text>
              <Text style={{
                fontFamily: 'Inter_400Regular',
                fontSize: typography.sizes.body,
                color: colors.textSecondary,
                textAlign: 'center',
                lineHeight: 22,
              }}>
                {isSearchActive ? t('searchNoResultsSub', lang) : t('noStoriesBody', lang)}
              </Text>
              {isSearchActive ? (
                <TouchableOpacity
                  style={styles.searchEmptyButton}
                  onPress={() => setSearchQuery('')}
                  accessibilityRole="button"
                  accessibilityLabel={t('searchClearAccessibility', lang)}
                >
                  <Text style={styles.searchEmptyButtonText}>{t('searchClearAccessibility', lang)}</Text>
                </TouchableOpacity>
              ) : null}
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
                          const dailyStoryTheme = getCategoryTheme(story.parent_cat_raw || story.parent_cat || story.cat, isDark);
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
                                    <Text style={{ color: dailyStoryTheme.accent, fontFamily: 'Inter_600SemiBold' }}>{t(story.parent_cat, lang)}</Text>
                                    {` · ${story.min} ${t('minLabel', lang)}`}
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

              {!isSearchActive && (free.length > 0 || locked.length > 0 || teaserStory || weeklyBonusStory) ? (
                <Text style={styles.readyTitle}>{t('home_ready_section_title', lang)}</Text>
              ) : null}

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

      {/* FAB */}
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
          backgroundColor: colors.modalOverlay,
          justifyContent: 'center',
          paddingHorizontal: layout.padding.horizontal,
        }}>
          <View style={{
            backgroundColor: colors.modalSurface,
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
          setAdUnavailable(false);
          setAdSheet({ visible: false, source: null, storyId: null });
        }}
        onDismiss={flushPendingRewarded}
        onWatchAd={handleWatchAd}
        onGoPremium={handleAdSheetGoPremium}
        adUnavailable={adUnavailable}
        isAdLoading={isAdLoading}
        lang={lang}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;

import React, { useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  StatusBar, Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useUserData } from '../context/UserDataContext';
import { t } from '../locales/i18n';
import { getReadHistory } from '../db/db';
import { ANALYTICS_EVENTS, trackEvent } from '../utils/analytics';
import BadgeIcon, { BADGE_MAP, GradientIcon, ACTION_ICON_COLORS } from '../components/BadgeIcon';

const { width } = Dimensions.get('window');
const DAILY_TARGET_COMPLETED_KEY = '@kivilcim_analytics_daily_target_completed_day';

const ProgressScreen = ({ navigation }) => {
  const { colors, layout, isDark, lang } = useTheme();
  const {
    streak, totalReads, longestStreak, earnedBadges, openBadgeModal,
    preferences, categoryStats, variantUsage, shareCount, favorites,
    isPremium, streakFreezeCredits, streakFreezeDates, useStreakFreeze,
  } = useUserData();
  const [heatmapDays, setHeatmapDays] = useState([]);
  const [todayReads, setTodayReads] = useState(0);
  const [showAllBadges, setShowAllBadges] = useState(false);
  const dailyTarget = preferences?.time?.dailyStoryTarget || 2;
  const dailyProgress = Math.min(todayReads, dailyTarget);
  const isDailyGoalComplete = dailyProgress >= dailyTarget;
  const todayKey = new Date().toISOString().split('T')[0];
  const storiesLeftToday = Math.max(0, dailyTarget - dailyProgress);
  const isStreakAtRisk = streak > 0 && todayReads === 0;
  const isStreakProtectedToday = (streakFreezeDates || []).includes(todayKey);

  const handleStreakFreezePress = async () => {
    if (!isPremium) {
      trackEvent(ANALYTICS_EVENTS.STREAK_FREEZE_UPSELL_CLICKED, {
        source: 'progress_streak_freeze',
        streak,
        todayReads,
        lang,
      });
      navigation.navigate('Paywall', { source: 'progress_streak_freeze', reason: 'streak_freeze' });
      return;
    }

    await useStreakFreeze(todayKey);
  };

  const categoryAction = useMemo(() => {
    const statsEntries = Object.entries(categoryStats || {});
    if (statsEntries.length === 0) return null;

    const [bestCategory, bestCount] = statsEntries.sort((a, b) => b[1] - a[1])[0];
    const milestones = [5, 10, 25, 50, 100];
    const nextMilestone = milestones.find((m) => m > bestCount);
    if (!nextMilestone) return null;

    return {
      category: bestCategory,
      remaining: nextMilestone - bestCount,
    };
  }, [categoryStats]);

  const usedStoriesCount = useMemo(
    () => (variantUsage || []).filter((item) => item?.action === 'mark_used').length,
    [variantUsage]
  );

  const badgeProgressMeta = useMemo(() => {
    const uniqueCats = Object.keys(categoryStats || {}).length;
    const maxCatReads = Math.max(0, ...Object.values(categoryStats || {}));
    const philosopherCount = (categoryStats?.['Felsefe'] || categoryStats?.['Philosophy'] || 0);
    return {
      first_read: { current: totalReads, target: 1 },
      explorer: { current: totalReads, target: 10 },
      sage: { current: totalReads, target: 25 },
      bookworm: { current: totalReads, target: 50 },
      streak_7: { current: streak, target: 7 },
      cat_variety_3: { current: uniqueCats, target: 3 },
      cat_variety_5: { current: uniqueCats, target: 5 },
      cat_variety_10: { current: uniqueCats, target: 10 },
      cat_master_5: { current: maxCatReads, target: 5 },
      cat_master_10: { current: maxCatReads, target: 10 },
      cat_master_25: { current: maxCatReads, target: 25 },
      cat_master_50: { current: maxCatReads, target: 50 },
      cat_master_100: { current: maxCatReads, target: 100 },
      philosopher: { current: philosopherCount, target: 5 },
      save_5: { current: favorites.length, target: 5 },
      save_10: { current: favorites.length, target: 10 },
      save_50: { current: favorites.length, target: 50 },
      save_100: { current: favorites.length, target: 100 },
      share_1: { current: shareCount, target: 1 },
      share_10: { current: shareCount, target: 10 },
      share_20: { current: shareCount, target: 20 },
      share_30: { current: shareCount, target: 30 },
      share_50: { current: shareCount, target: 50 },
      storyteller: { current: usedStoriesCount, target: 10 },
      icebreaker: { current: (variantUsage || []).some((item) => item?.action === 'mark_used' && item?.variantType === 'QUESTION') ? 1 : 0, target: 1 },
    };
  }, [categoryStats, totalReads, streak, usedStoriesCount, variantUsage, shareCount, favorites.length]);

  // Analytics: Daily target completed
  useEffect(() => {
    if (!isDailyGoalComplete) return;

    const trackDailyCompletion = async () => {
      try {
        const trackedDay = await AsyncStorage.getItem(DAILY_TARGET_COMPLETED_KEY);
        if (trackedDay === todayKey) return;

        await trackEvent(ANALYTICS_EVENTS.DAILY_TARGET_COMPLETED, {
          date: todayKey,
          dailyTarget,
          dailyProgress,
          todayReads,
          lang,
        });
        await AsyncStorage.setItem(DAILY_TARGET_COMPLETED_KEY, todayKey);
      } catch (error) {
        console.error('Gunluk hedef analytics kaydi basarisiz:', error);
      }
    };

    trackDailyCompletion();
  }, [isDailyGoalComplete, todayKey, dailyTarget, dailyProgress, todayReads, lang]);

  // Heatmap: week-aligned last 8 weeks (56 days). Columns = weeks, rows = Mon→Sun.
  const HEATMAP_WEEKS = 8;
  useEffect(() => {
    const loadHeatmap = async () => {
      try {
        const historyRows = await getReadHistory(70);
        const map = {};
        historyRows.forEach(r => { map[r.day] = r.count; });
        setTodayReads(map[todayKey] || 0);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const mondayOffset = (today.getDay() + 6) % 7; // days since Monday
        const start = new Date(today);
        start.setDate(today.getDate() - mondayOffset - (HEATMAP_WEEKS - 1) * 7);

        const days = [];
        for (let i = 0; i < HEATMAP_WEEKS * 7; i++) {
          const d = new Date(start);
          d.setDate(start.getDate() + i);
          const key = d.toISOString().split('T')[0];
          const count = map[key] || 0;
          const level = count === 0 ? 0 : count === 1 ? 1 : count <= 3 ? 2 : 3;
          days.push({ id: i, key, level, future: d > today });
        }
        setHeatmapDays(days);
      } catch (e) {
        console.error('Heatmap yükleme hatası:', e);
        setHeatmapDays([]);
        setTodayReads(0);
      }
    };
    loadHeatmap();
  }, [totalReads, todayKey]);

  const badges = earnedBadges || [];

  // Badge groups: Near (top 3 with progress > 0), Earned, Locked
  const nearBadges = useMemo(() => {
    return badges
      .filter(b => !b.earned && badgeProgressMeta[b.id])
      .map(b => {
        const { current, target } = badgeProgressMeta[b.id];
        const ratio = target > 0 ? Math.min(current / target, 1) : 0;
        return { ...b, current, target, ratio, remaining: Math.max(target - current, 0) };
      })
      .filter(b => b.ratio > 0 && b.ratio < 1)
      .sort((a, b) => b.ratio - a.ratio)
      .slice(0, 3);
  }, [badges, badgeProgressMeta]);

  const earnedBadgesList = useMemo(() => badges.filter(b => b.earned), [badges]);

  const lockedBadges = useMemo(() => {
    const nearIds = new Set(nearBadges.map(b => b.id));
    return badges.filter(b => !b.earned && !nearIds.has(b.id));
  }, [badges, nearBadges]);

  // Spotlight = top near badge
  const closestBadge = nearBadges[0] || null;

  const nextBestAction = useMemo(() => {
    if (!isDailyGoalComplete) {
      return {
        icon: 'book-outline',
        title: storiesLeftToday === 1 ? t('progressNextDailyOneTitle', lang) : t('progressNextDailyManyTitle', lang).replace('{{count}}', String(storiesLeftToday)),
        subtitle: t('progressNextDailySub', lang),
        cta: t('progressActionOpenHome', lang),
        action: () => navigation.navigate('HomeTab'),
      };
    }

    if (isStreakProtectedToday) {
      return {
        icon: 'shield-checkmark-outline',
        title: t('progressNextProtectedTitle', lang),
        subtitle: t('progressNextProtectedSub', lang),
        cta: t('progressActionTomorrowCta', lang),
        action: null,
      };
    }

    if (closestBadge) {
      return {
        icon: 'trophy-outline',
        title: t('progressNextBadgeTitle', lang),
        subtitle: t('progressNextBadgeSub', lang).replace('{{badge}}', t(closestBadge.titleKey, lang)),
        cta: t('progressViewBadgeCta', lang),
        action: () => openBadgeModal(closestBadge),
      };
    }

    return {
      icon: 'checkmark-circle-outline',
      title: t('progressNextCompleteTitle', lang),
      subtitle: t('progressNextCompleteSub', lang),
      cta: t('progressActionTomorrowCta', lang),
      action: null,
    };
  }, [closestBadge, isDailyGoalComplete, isStreakProtectedToday, lang, navigation, openBadgeModal, storiesLeftToday]);

  // Active reading days count for heatmap KPI
  const activeDaysCount = useMemo(() => heatmapDays.filter(d => d.level > 0).length, [heatmapDays]);

  // Group days into week columns (each column = 7 days Mon→Sun)
  const heatmapWeeks = useMemo(() => {
    const cols = [];
    for (let w = 0; w < Math.ceil(heatmapDays.length / 7); w++) {
      cols.push(heatmapDays.slice(w * 7, w * 7 + 7));
    }
    return cols;
  }, [heatmapDays]);

  const totalBadges = badges.length;
  const heatmapCellColor = (cell) => {
    const lvl = cell ? cell.level : 0;
    if (lvl === 0) return isDark ? 'rgba(255,255,255,0.06)' : '#ECE6DA';
    if (lvl === 1) return '#F0D9A8';
    if (lvl === 2) return colors.primary;
    return '#8B6A30';
  };
  const weekdayLabels = lang === 'tr'
    ? ['Pzt', '', 'Çar', '', 'Cum', '', 'Paz']
    : ['Mon', '', 'Wed', '', 'Fri', '', 'Sun'];

  const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    homeHeader: {
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      paddingHorizontal: layout.padding.horizontal,
      paddingTop: 10,
      paddingBottom: 8,
    },
    greetName: { 
      fontFamily: 'PlayfairDisplay_700Bold', 
      fontSize: 28, 
      color: colors.text,
      letterSpacing: 0.2,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: layout.padding.horizontal,
      marginTop: 24,
      marginBottom: 12,
    },
    sectionLabel: {
      fontFamily: 'Inter_500Medium',
      fontSize: 11,
      color: colors.textSecondary,
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    // ── Hero Card ─────────────────────────────────────────────────
    heroCard: {
      backgroundColor: colors.backgroundDark,
      borderRadius: layout.radius.card,
      marginHorizontal: layout.padding.horizontal,
      padding: 10,
      marginBottom: 12,
      gap: 8,
    },
    heroTilesRow: { flexDirection: 'row', gap: 8 },
    heroTile: {
      flex: 1,
      backgroundColor: colors.background,
      borderRadius: 12,
      borderWidth: layout.borderWidth,
      borderColor: colors.border,
      padding: 12,
    },
    heroTileHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      marginBottom: 8,
    },
    heroTileLabel: {
      fontFamily: 'Inter_500Medium',
      fontSize: 10,
      color: colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    heroStreakBox: { alignItems: 'center' },
    heroStreakEmoji: { fontSize: 0 },
    heroStreakNum: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: 40,
      color: colors.text,
      lineHeight: 48,
    },
    heroStreakDays: {
      fontFamily: 'Inter_400Regular',
      fontSize: 12,
      color: colors.textSecondary,
    },
    heroGoalBox: {},
    heroGoalLabel: {
      fontFamily: 'Inter_500Medium',
      fontSize: 10,
      color: colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginBottom: 4,
    },
    heroGoalCounter: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: 26,
      color: colors.text,
      marginBottom: 6,
    },
    heroGoalBarTrack: {
      height: 6,
      borderRadius: 999,
      backgroundColor: colors.border,
      overflow: 'hidden',
      marginBottom: 6,
    },
    heroGoalBarFill: { height: '100%', borderRadius: 999, backgroundColor: colors.primary },
    heroReadCta: { fontFamily: 'Inter_500Medium', fontSize: 12, color: colors.primary },
    heroCompleteTag: { fontFamily: 'Inter_500Medium', fontSize: 12, color: colors.primary },
    heroRiskRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: `${colors.danger}18`,
      borderRadius: 8,
      paddingHorizontal: 8,
      paddingVertical: 5,
      marginTop: 8,
    },
    heroRiskText: {
      fontFamily: 'Inter_400Regular',
      fontSize: 11,
      color: colors.danger,
      flex: 1,
    },
    freezeCard: {
      marginHorizontal: layout.padding.horizontal,
      marginBottom: 10,
      borderRadius: layout.radius.card,
      borderWidth: 1,
      borderColor: isStreakProtectedToday ? `${colors.primary}66` : `${colors.danger}55`,
      backgroundColor: isStreakProtectedToday
        ? (isDark ? `${colors.primary}18` : `${colors.primary}10`)
        : (isDark ? 'rgba(186,26,26,0.14)' : '#FFF1EF'),
      padding: 14,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    freezeIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: isStreakProtectedToday ? `${colors.primary}55` : `${colors.danger}40`,
    },
    freezeTitle: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 14,
      color: colors.text,
      marginBottom: 2,
    },
    freezeSub: {
      fontFamily: 'Inter_400Regular',
      fontSize: 12,
      color: colors.textSecondary,
      lineHeight: 17,
    },
    freezeButton: {
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: isPremium ? colors.primary : colors.background,
      borderWidth: 1,
      borderColor: isPremium ? colors.primary : colors.border,
    },
    freezeButtonText: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 11,
      color: isPremium ? colors.onPrimary : colors.text,
      textAlign: 'center',
    },
    heroSpotlightTile: {
      backgroundColor: colors.background,
      borderRadius: 12,
      borderWidth: layout.borderWidth,
      borderColor: colors.border,
      padding: 12,
    },
    heroSpotlightRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginTop: 8,
    },
    heroSpotlightLabel: {
      fontFamily: 'Inter_500Medium',
      fontSize: 9,
      color: colors.primary,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    heroSpotlightTitle: {
      fontFamily: 'Inter_500Medium',
      fontSize: 13,
      color: colors.text,
      marginBottom: 4,
    },
    heroSpotlightBarTrack: {
      height: 3,
      borderRadius: 999,
      backgroundColor: colors.border,
      overflow: 'hidden',
    },
    heroSpotlightBarFill: { height: '100%', borderRadius: 999, backgroundColor: colors.primary },
    heroSpotlightPct: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: 16,
      color: colors.primary,
    },
    nextBestCard: {
      marginHorizontal: layout.padding.horizontal,
      marginBottom: 12,
      borderRadius: layout.radius.card,
      borderWidth: 1,
      borderColor: `${colors.primary}66`,
      backgroundColor: isDark ? `${colors.primary}18` : `${colors.primary}10`,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    nextBestLabel: {
      fontFamily: 'Inter_500Medium',
      fontSize: 10,
      color: colors.primary,
      letterSpacing: 0.8,
      textTransform: 'uppercase',
      marginBottom: 3,
    },
    nextBestTitle: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 15,
      color: colors.text,
      marginBottom: 3,
    },
    nextBestSub: {
      fontFamily: 'Inter_400Regular',
      fontSize: 12,
      color: colors.textSecondary,
      lineHeight: 17,
    },
    // ── Actions ───────────────────────────────────────────────────
    actionsWrap: { marginHorizontal: layout.padding.horizontal, marginBottom: 10, gap: 10 },
    actionCard: {
      backgroundColor: colors.background,
      borderWidth: layout.borderWidth,
      borderColor: colors.border,
      borderRadius: layout.radius.card,
      padding: 14,
      flexDirection: 'row',
      gap: 12,
      alignItems: 'center',
    },
    actionTitle: { fontFamily: 'Inter_500Medium', fontSize: 14, color: colors.text, marginBottom: 2 },
    actionSub: { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textSecondary, lineHeight: 18 },
    actionButton: {
      marginLeft: 'auto', borderRadius: 10, borderWidth: 1, borderColor: colors.border,
      paddingHorizontal: 10, paddingVertical: 6, backgroundColor: colors.backgroundDark,
    },
    actionButtonText: { fontFamily: 'Inter_500Medium', fontSize: 11, color: colors.text },
    // ── Stats ─────────────────────────────────────────────────────
    statsRow: {
      flexDirection: 'row', gap: 12,
      paddingHorizontal: layout.padding.horizontal,
      marginTop: 24,
    },
    statBox: {
      flex: 1, backgroundColor: colors.backgroundDark,
      borderRadius: layout.radius.card, padding: 16, alignItems: 'center',
    },
    statNum: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 24, color: colors.text },
    statLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, color: colors.textSecondary, textTransform: 'uppercase' },
    // ── Heatmap ───────────────────────────────────────────────────
    heatmapCard: {
      backgroundColor: colors.background,
      borderWidth: layout.borderWidth,
      borderColor: colors.border,
      borderRadius: layout.radius.card,
      marginHorizontal: layout.padding.horizontal,
      padding: 16,
    },
    heatmapKpiRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
    heatmapKpi: {
      flex: 1, backgroundColor: colors.backgroundDark,
      borderRadius: layout.radius.card, padding: 12, alignItems: 'center',
    },
    heatmapKpiNum: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 22, color: colors.text },
    heatmapKpiLabel: {
      fontFamily: 'Inter_400Regular', fontSize: 10, color: colors.textSecondary,
      textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2, textAlign: 'center',
    },
    heatmapGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, justifyContent: 'center' },
    heatmapSquare: { width: (width - 80) / 13 - 4, height: (width - 80) / 13 - 4, borderRadius: 999 },
    heatmapLegend: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 16 },
    heatmapLegendText: { fontFamily: 'Inter_400Regular', fontSize: 10, color: colors.textSecondary },
    // ── Badges ────────────────────────────────────────────────────
    badgeGroupHeader: {
      paddingHorizontal: layout.padding.horizontal,
      marginTop: 16,
      marginBottom: 8,
    },
    badgeGroupLabel: {
      fontFamily: 'Inter_500Medium', fontSize: 10, color: colors.textSecondary,
      textTransform: 'uppercase', letterSpacing: 1,
    },
    badgeContainer: {
      flexDirection: 'row', flexWrap: 'wrap', gap: 12,
      paddingHorizontal: layout.padding.horizontal,
    },
    badgeItem: {
      width: (width - (layout.padding.horizontal * 2) - 12) / 2,
      backgroundColor: colors.background,
      borderWidth: layout.borderWidth,
      borderColor: colors.border,
      borderRadius: layout.radius.card,
      padding: 16,
      alignItems: 'center',
    },
    badgeProgressTrack: {
      marginTop: 10, width: '100%', height: 3, borderRadius: 999,
      backgroundColor: colors.border, overflow: 'hidden',
    },
    badgeProgressFill: { height: '100%', borderRadius: 999, backgroundColor: colors.primary },
    badgeProgressText: { marginTop: 5, fontFamily: 'Inter_500Medium', fontSize: 10, color: colors.textSecondary },
    badgeItemTitle: { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 16, color: colors.text },
    badgeItemSub: { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textSecondary },

    // ── Redesign: focus card ──────────────────────────────────────
    focusCard: {
      flexDirection: 'row', alignItems: 'center', gap: 13,
      marginHorizontal: layout.padding.horizontal,
      backgroundColor: `${colors.primary}14`,
      borderWidth: layout.borderWidth, borderColor: `${colors.primary}33`,
      borderRadius: 20, padding: 16,
    },
    focusIcon: {
      width: 50, height: 50, borderRadius: 16,
      backgroundColor: colors.surfaceContainerLowest,
      alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    },
    focusEyebrow: {
      fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 0.8,
      color: colors.primary, textTransform: 'uppercase',
    },
    focusTitle: {
      fontFamily: 'PlayfairDisplay_700Bold', fontSize: 19, color: colors.text, marginTop: 1,
    },
    focusSub: { fontFamily: 'Inter_400Regular', fontSize: 12.5, color: colors.textSecondary, marginTop: 2 },
    focusTrack: {
      height: 8, borderRadius: 999, backgroundColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.07)',
      overflow: 'hidden', marginTop: 10,
    },
    focusFill: { height: '100%', borderRadius: 999, backgroundColor: colors.primary },
    focusPct: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: colors.primary, flexShrink: 0 },

    // ── Redesign: stat strip ──────────────────────────────────────
    statStrip: {
      flexDirection: 'row', gap: 8,
      paddingHorizontal: layout.padding.horizontal, marginTop: 16,
    },
    statCard: {
      flex: 1, backgroundColor: colors.backgroundDark,
      borderRadius: 14, paddingVertical: 12, paddingHorizontal: 4, alignItems: 'center',
    },
    statCardNum: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 20, color: colors.text },
    statCardLabel: { fontFamily: 'Inter_400Regular', fontSize: 10.5, color: colors.textSecondary, marginTop: 2 },

    // ── Redesign: heatmap (week-aligned) ──────────────────────────
    hmCard: {
      backgroundColor: colors.background, borderWidth: layout.borderWidth, borderColor: colors.border,
      borderRadius: layout.radius.card, marginHorizontal: layout.padding.horizontal, padding: 16,
    },
    hmDay: { fontFamily: 'Inter_400Regular', fontSize: 9, color: colors.textSecondary },
    hmLegend: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 4, marginTop: 12 },
    hmLegendText: { fontFamily: 'Inter_400Regular', fontSize: 10, color: colors.textSecondary },
    hmLegendCell: { width: 11, height: 11, borderRadius: 3 },

    // ── Redesign: flat badge tile ─────────────────────────────────
    flatBadge: {
      width: (width - (layout.padding.horizontal * 2) - 12) / 2,
      backgroundColor: colors.surfaceContainerLowest,
      borderWidth: layout.borderWidth, borderColor: colors.border,
      borderRadius: 16, padding: 12,
    },
    flatBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    flatBadgeIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    flatBadgeTitle: { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 14, color: colors.text },
    flatBadgeSub: { fontFamily: 'Inter_400Regular', fontSize: 11, color: colors.textSecondary, marginTop: 1 },
    flatBadgeTrack: { height: 5, borderRadius: 999, backgroundColor: colors.border, overflow: 'hidden', marginTop: 10 },
    flatBadgeFill: { height: '100%', borderRadius: 999 },
    flatBadgeProg: { fontFamily: 'Inter_500Medium', fontSize: 10.5, color: colors.textSecondary, marginTop: 5 },
    seeAllBtn: {
      marginHorizontal: layout.padding.horizontal, marginTop: 12,
      borderRadius: 12, borderWidth: layout.borderWidth, borderColor: colors.border,
      paddingVertical: 12, alignItems: 'center', backgroundColor: colors.backgroundDark,
    },
    seeAllText: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: colors.text },
    sectionHeaderRow: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: layout.padding.horizontal, marginTop: 24, marginBottom: 8,
    },
  });

  // Flat badge tile (replaces glossy 3D BadgeIcon to match the soft design)
  const renderBadgeItem = (badge, progressMeta) => {
    const meta = BADGE_MAP[badge.id] || { icon: 'trophy', colors: ['#C89B3C', '#8C701B'] };
    const accent = meta.colors[0];
    const earned = badge.earned;
    const iconBg = earned ? `${accent}1F` : (isDark ? 'rgba(255,255,255,0.06)' : '#ECE6DA');
    const pct = progressMeta ? Math.min(100, Math.round((progressMeta.current / Math.max(1, progressMeta.target)) * 100)) : 0;
    return (
      <TouchableOpacity
        key={badge.id}
        activeOpacity={0.8}
        onPress={() => openBadgeModal(badge)}
        style={styles.flatBadge}
      >
        <View style={styles.flatBadgeRow}>
          <View style={[styles.flatBadgeIcon, { backgroundColor: iconBg }]}>
            <Ionicons name={earned ? meta.icon : 'lock-closed'} size={20} color={earned ? accent : colors.textSecondary} />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text numberOfLines={1} style={styles.flatBadgeTitle}>{t(badge.titleKey, lang) || badge.titleKey}</Text>
            <Text numberOfLines={1} style={styles.flatBadgeSub}>{t(badge.subKey, lang) || badge.subKey}</Text>
          </View>
        </View>
        {!earned && progressMeta ? (
          <>
            <View style={styles.flatBadgeTrack}>
              <View style={[styles.flatBadgeFill, { width: `${pct}%`, backgroundColor: accent }]} />
            </View>
            <Text style={styles.flatBadgeProg}>
              {`${Math.min(progressMeta.current, progressMeta.target)}/${progressMeta.target}`}
            </Text>
          </>
        ) : null}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safe}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.homeHeader}>
          <Text style={styles.greetName}>{t('tabProgress', lang)}</Text>
        </View>

        {/* ── Focus card: the single "next step" (merges 3 old cards) ── */}
        <TouchableOpacity
          style={styles.focusCard}
          activeOpacity={0.85}
          onPress={nextBestAction.action || (closestBadge ? () => openBadgeModal(closestBadge) : undefined)}
          disabled={!nextBestAction.action && !closestBadge}
          accessibilityRole="button"
          accessibilityLabel={nextBestAction.title}
        >
          <View style={styles.focusIcon}>
            <Ionicons name={nextBestAction.icon} size={24} color={colors.primary} />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.focusEyebrow}>{t('progressNextBestLabel', lang)}</Text>
            <Text style={styles.focusTitle} numberOfLines={1}>{nextBestAction.title}</Text>
            <Text style={styles.focusSub} numberOfLines={2}>{nextBestAction.subtitle}</Text>
            {closestBadge && (
              <View style={styles.focusTrack}>
                <View style={[styles.focusFill, { width: `${Math.round(closestBadge.ratio * 100)}%` }]} />
              </View>
            )}
          </View>
          {closestBadge ? (
            <Text style={styles.focusPct}>{`${Math.round(closestBadge.ratio * 100)}%`}</Text>
          ) : nextBestAction.action ? (
            <Ionicons name="chevron-forward" size={18} color={colors.primary} />
          ) : null}
        </TouchableOpacity>

        {/* ── Stat strip (one row, no duplicated streak/reads) ──────── */}
        <View style={styles.statStrip}>
          <View style={styles.statCard}>
            <Text style={styles.statCardNum}>{streak}</Text>
            <Text style={styles.statCardLabel}>{t('statStreak', lang)}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statCardNum}>{totalReads}</Text>
            <Text style={styles.statCardLabel}>{t('statRead', lang)}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statCardNum}>
              {earnedBadgesList.length}
              <Text style={{ fontSize: 12, color: colors.textSecondary }}>{`/${totalBadges}`}</Text>
            </Text>
            <Text style={styles.statCardLabel}>{t('statEarned', lang)}</Text>
          </View>
          <View style={[styles.statCard, isDailyGoalComplete && { backgroundColor: `${colors.success}1A` }]}>
            {isDailyGoalComplete ? (
              <Ionicons name="checkmark" size={20} color={colors.success} style={{ marginTop: 2 }} />
            ) : (
              <Text style={styles.statCardNum}>{`${dailyProgress}/${dailyTarget}`}</Text>
            )}
            <Text style={[styles.statCardLabel, isDailyGoalComplete && { color: colors.success }]}>
              {lang === 'tr' ? 'Bugün' : 'Today'}
            </Text>
          </View>
        </View>

        {/* legacy hidden block kept out — replaced by focus card + stat strip */}
        {false && (
        <View style={styles.heroCard}>
          <View style={styles.heroTilesRow}>
            <View style={styles.heroTile}>
              <View style={styles.heroTileHeader}>
                <Ionicons name="flame" size={12} color={colors.textSecondary} />
                <Text style={styles.heroTileLabel}>{t('streakDays', lang)}</Text>
              </View>
              <View style={styles.heroStreakBox}>
                <Text style={styles.heroStreakNum}>{streak}</Text>
              </View>
              {/* Streak risk warning inside Streak tile */}
              {isStreakAtRisk && !isStreakProtectedToday && (
                <View style={styles.heroRiskRow}>
                  <Ionicons name="warning-outline" size={12} color={colors.danger} />
                  <Text style={styles.heroRiskText}>{t('streakRiskWarning', lang)}</Text>
                </View>
              )}
              {isStreakProtectedToday && (
                <View style={[styles.heroRiskRow, { backgroundColor: `${colors.primary}16` }]}>
                  <Ionicons name="shield-checkmark-outline" size={12} color={colors.primary} />
                  <Text style={[styles.heroRiskText, { color: colors.primary }]}>{t('streakProtectedToday', lang)}</Text>
                </View>
              )}
            </View>
            {/* Tile 2: Daily Goal */}
            <View style={styles.heroTile}>
              <View style={styles.heroTileHeader}>
                <Ionicons name="flag" size={12} color={colors.textSecondary} />
                <Text style={styles.heroTileLabel}>{t('dailyGoalTitle', lang)}</Text>
              </View>
              <View style={styles.heroGoalBox}>
                <Text style={styles.heroGoalCounter}>{`${dailyProgress}/${dailyTarget}`}</Text>
                <View style={styles.heroGoalBarTrack}>
                  <View style={[styles.heroGoalBarFill, { width: `${(dailyProgress / dailyTarget) * 100}%` }]} />
                </View>
                {isDailyGoalComplete ? (
                  <Text style={styles.heroCompleteTag}>✓ {t('dailyGoalComplete', lang)}</Text>
                ) : (
                  <TouchableOpacity
                    onPress={() => navigation.navigate('HomeTab')}
                    accessibilityRole="button"
                    accessibilityLabel={t('progressActionOpenHome', lang)}
                  >
                    <Text style={styles.heroReadCta}>{t('progressActionOpenHome', lang)} →</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          {/* Tile 3: Spotlight — full width, only when closestBadge exists */}
          {closestBadge && (
            <TouchableOpacity
              style={styles.heroSpotlightTile}
              onPress={() => openBadgeModal(closestBadge)}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={t(closestBadge.titleKey, lang)}
            >
              <View style={styles.heroTileHeader}>
                <Ionicons name="trophy-outline" size={12} color={colors.textSecondary} />
                <Text style={styles.heroTileLabel}>{t('progress_spotlight_label', lang)}</Text>
              </View>
              <View style={styles.heroSpotlightRow}>
                <BadgeIcon badge={closestBadge} earned={false} isDark={isDark} size={44} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.heroSpotlightTitle}>{t(closestBadge.titleKey, lang)}</Text>
                  <View style={styles.heroSpotlightBarTrack}>
                    <View style={[styles.heroSpotlightBarFill, { width: `${Math.round(closestBadge.ratio * 100)}%` }]} />
                  </View>
                </View>
                <Text style={styles.heroSpotlightPct}>{`${Math.round(closestBadge.ratio * 100)}%`}</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
              </View>
            </TouchableOpacity>
          )}
        </View>
        )}

        {(isStreakAtRisk || isStreakProtectedToday) && (
          <View style={styles.freezeCard}>
            <View style={styles.freezeIcon}>
              <Ionicons
                name={isStreakProtectedToday ? 'shield-checkmark' : 'shield-outline'}
                size={20}
                color={isStreakProtectedToday ? colors.primary : colors.danger}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.freezeTitle}>
                {t(isStreakProtectedToday ? 'streakFreezeProtectedTitle' : 'streakFreezeTitle', lang)}
              </Text>
              <Text style={styles.freezeSub}>
                {t(isStreakProtectedToday
                  ? 'streakFreezeProtectedSub'
                  : isPremium
                    ? 'streakFreezePremiumSub'
                    : 'streakFreezeLockedSub', lang)
                    .replace('{{credits}}', String(streakFreezeCredits || 0))}
              </Text>
            </View>
            {!isStreakProtectedToday && (
              <TouchableOpacity
                style={[styles.freezeButton, isPremium && streakFreezeCredits <= 0 && { opacity: 0.45 }]}
                onPress={handleStreakFreezePress}
                disabled={isPremium && streakFreezeCredits <= 0}
                accessibilityRole="button"
                accessibilityLabel={t(isPremium ? 'streakFreezeUseCta' : 'streakFreezePremiumCta', lang)}
              >
                <Text style={styles.freezeButtonText}>
                  {t(isPremium ? 'streakFreezeUseCta' : 'streakFreezePremiumCta', lang)}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* ── Heatmap (week-aligned: rows=Mon→Sun, cols=weeks) ───── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionLabel}>{t('readingHabit', lang)}</Text>
          <Text style={styles.hmLegendText}>
            {`${HEATMAP_WEEKS} ${lang === 'tr' ? 'hafta' : 'weeks'} · ${activeDaysCount} ${lang === 'tr' ? 'aktif gün' : 'active days'}`}
          </Text>
        </View>
        <View style={styles.hmCard}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ width: 26, marginRight: 6 }}>
              {weekdayLabels.map((d, i) => (
                <View key={i} style={{ height: 20, marginBottom: i < 6 ? 5 : 0, justifyContent: 'center' }}>
                  <Text style={styles.hmDay}>{d}</Text>
                </View>
              ))}
            </View>
            <View style={{ flex: 1 }}>
              {[0, 1, 2, 3, 4, 5, 6].map((row) => (
                <View key={row} style={{ flexDirection: 'row', gap: 5, marginBottom: row < 6 ? 5 : 0 }}>
                  {heatmapWeeks.map((col, ci) => {
                    const cell = col[row];
                    return (
                      <View
                        key={ci}
                        style={{
                          flex: 1, height: 20, borderRadius: 4,
                          backgroundColor: heatmapCellColor(cell),
                          opacity: cell && cell.future ? 0.3 : 1,
                        }}
                      />
                    );
                  })}
                </View>
              ))}
            </View>
          </View>
          <View style={styles.hmLegend}>
            <Text style={styles.hmLegendText}>{t('less', lang)}</Text>
            <View style={[styles.hmLegendCell, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#ECE6DA' }]} />
            <View style={[styles.hmLegendCell, { backgroundColor: '#F0D9A8' }]} />
            <View style={[styles.hmLegendCell, { backgroundColor: colors.primary }]} />
            <View style={[styles.hmLegendCell, { backgroundColor: '#8B6A30' }]} />
            <Text style={styles.hmLegendText}>{t('more', lang)}</Text>
          </View>
        </View>

        {/* ── Badges (near + earned; locked collapsed behind a toggle) ── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionLabel}>{t('achievementBadges', lang)}</Text>
          <Text style={styles.hmLegendText}>{`${earnedBadgesList.length}/${totalBadges}`}</Text>
        </View>

        {nearBadges.length > 0 && (
          <>
            <View style={styles.badgeGroupHeader}>
              <Text style={styles.badgeGroupLabel}>{t('badgesGroupNear', lang)}</Text>
            </View>
            <View style={styles.badgeContainer}>
              {nearBadges.map(b => renderBadgeItem(b, { current: b.current, target: b.target }))}
            </View>
          </>
        )}

        {earnedBadgesList.length > 0 && (
          <>
            <View style={styles.badgeGroupHeader}>
              <Text style={styles.badgeGroupLabel}>{t('badgesGroupEarned', lang)}</Text>
            </View>
            <View style={styles.badgeContainer}>
              {earnedBadgesList.map(b => renderBadgeItem(b, null))}
            </View>
          </>
        )}

        {lockedBadges.length > 0 && (
          showAllBadges ? (
            <>
              <View style={styles.badgeGroupHeader}>
                <Text style={styles.badgeGroupLabel}>{t('badgesGroupLocked', lang)}</Text>
              </View>
              <View style={styles.badgeContainer}>
                {lockedBadges.map(b => renderBadgeItem(b, badgeProgressMeta[b.id] || null))}
              </View>
            </>
          ) : (
            <TouchableOpacity
              style={styles.seeAllBtn}
              activeOpacity={0.8}
              onPress={() => setShowAllBadges(true)}
              accessibilityRole="button"
            >
              <Text style={styles.seeAllText}>
                {lang === 'tr'
                  ? `Kilitli rozetleri gör (${lockedBadges.length})`
                  : `Show locked badges (${lockedBadges.length})`}
              </Text>
            </TouchableOpacity>
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProgressScreen;


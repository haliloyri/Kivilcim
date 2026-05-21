import React, { useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  StatusBar, Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useUserData } from '../context/UserDataContext';
import { t } from '../locales/i18n';
import { getReadHistory } from '../db/db';
import { ANALYTICS_EVENTS, trackEvent } from '../utils/analytics';

const { width } = Dimensions.get('window');
const DAILY_TARGET_COMPLETED_KEY = '@kivilcim_analytics_daily_target_completed_day';

const BADGE_MAP = {
  first_read: { icon: 'star', colors: ['#E6A800', '#B38100'] },
  explorer: { icon: 'compass', colors: ['#0066CC', '#004B99'] },
  sage: { icon: 'leaf', colors: ['#7A19FF', '#5610B3'] },
  bookworm: { icon: 'library', colors: ['#38A169', '#246B46'] },
  streak_7: { icon: 'flame', colors: ['#E53E3E', '#992929'] },
  cat_variety_3: { icon: 'map', colors: ['#65A89E', '#215A52'] },
  cat_variety_5: { icon: 'earth', colors: ['#288CB3', '#0C4A61'] },
  cat_variety_10: { icon: 'globe', colors: ['#1F6A99', '#0A314D'] },
  cat_master_5: { icon: 'git-merge', colors: ['#A0A0A0', '#4A4A4A'] },
  cat_master_10: { icon: 'medal', colors: ['#D4AF37', '#8C701B'] },
  cat_master_25: { icon: 'ribbon', colors: ['#D4AF37', '#8C701B'] },
  cat_master_50: { icon: 'diamond', colors: ['#00E5FF', '#007A8C'] },
  cat_master_100: { icon: 'planet', colors: ['#FF5E99', '#8C1C45'] },
  philosopher: { icon: 'book', colors: ['#605B56', '#1F1E1C'] },
  save_5: { icon: 'bookmark', colors: ['#FFB6C1', '#A6557F'] },
  save_10: { icon: 'bookmarks', colors: ['#FF69B4', '#8A1B55'] },
  save_50: { icon: 'albums', colors: ['#C71585', '#6B0B47'] },
  save_100: { icon: 'archive', colors: ['#DB7093', '#711F4A'] },
  share_1: { icon: 'share-social', colors: ['#87CEFA', '#3A637F'] },
  share_10: { icon: 'share', colors: ['#1E90FF', '#0D4880'] },
  share_20: { icon: 'megaphone', colors: ['#00BFFF', '#005580'] },
  share_30: { icon: 'cellular', colors: ['#4682B4', '#153652'] },
  share_50: { icon: 'star', colors: ['#C0C0FF', '#5050B0'] },
  storyteller: { icon: 'mic', colors: ['#D97706', '#92400E'] },
  icebreaker: { icon: 'chatbubble-ellipses', colors: ['#2563EB', '#1E3A8A'] },
};

const ProfessionalBadgeIcon = ({ badge, earned, isDark }) => {
  const meta = BADGE_MAP[badge.id] || { icon: 'trophy', colors: ['#D4AF37', '#8C701B'] };
  const size = 60;
  
  const lockedColors = isDark ? ['#3A3A3A', '#1A1A1A'] : ['#E5E5E5', '#B0B0B0'];
  const lockedBorder = isDark ? '#4A4A4A' : '#CCCCCC';
  const earnedBorder = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)';
  const colors = earned ? meta.colors : lockedColors;
  const iconColor = earned ? '#FFFFFF' : (isDark ? '#555555' : '#999999');

  return (
    <View style={{
      width: size, height: size, borderRadius: size / 2,
      marginBottom: 12, elevation: earned ? 4 : 0,
      shadowColor: earned ? meta.colors[0] : '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3, shadowRadius: 6,
    }}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={{
          width: '100%', height: '100%', borderRadius: size / 2,
          justifyContent: 'center', alignItems: 'center',
          borderWidth: 1.5, borderColor: earned ? earnedBorder : lockedBorder,
        }}
      >
        <View style={{
          width: size - 8, height: size - 8, borderRadius: (size - 8) / 2,
          justifyContent: 'center', alignItems: 'center',
          backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)',
        }}>
          <Ionicons name={earned ? meta.icon : 'lock-closed'} size={size * 0.45} color={iconColor} />
        </View>
        {earned && (
          <LinearGradient
            colors={['rgba(255,255,255,0.45)', 'rgba(255,255,255,0.02)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              position: 'absolute',
              top: 3,
              left: 3,
              right: 3,
              height: size * 0.38,
              borderTopLeftRadius: size / 2,
              borderTopRightRadius: size / 2,
              borderBottomLeftRadius: size / 3,
              borderBottomRightRadius: size / 3,
            }}
          />
        )}
      </LinearGradient>
    </View>
  );
};

const ProgressScreen = ({ navigation }) => {
  const { colors, layout, isDark, lang } = useTheme();
  const {
    streak, totalReads, longestStreak, earnedBadges, openBadgeModal,
    preferences, categoryStats, variantUsage, shareCount, favorites,
    isPremium, streakFreezeCredits, streakFreezeDates, useStreakFreeze,
  } = useUserData();
  const [heatmapData, setHeatmapData] = useState([]);
  const [todayReads, setTodayReads] = useState(0);
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

  // Heatmap: Single DB call, derive todayReads from same dataset
  useEffect(() => {
    const loadHeatmap = async () => {
      try {
        const historyRows = await getReadHistory(91);
        const map = {};
        historyRows.forEach(r => { map[r.day] = r.count; });
        setTodayReads(map[todayKey] || 0);
        const data = [];
        for (let i = 90; i >= 0; i--) {
          const d = new Date();
          d.setHours(0, 0, 0, 0);
          d.setDate(d.getDate() - i);
          const key = d.toISOString().split('T')[0];
          const count = map[key] || 0;
          const level = count === 0 ? 0 : count === 1 ? 1 : count <= 3 ? 2 : 3;
          data.push({ id: 90 - i, level });
        }
        setHeatmapData(data);
      } catch (e) {
        console.error('Heatmap yükleme hatası:', e);
        setHeatmapData(Array.from({ length: 91 }, (_, i) => ({ id: i, level: 0 })));
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

  // Active reading days count for heatmap KPI
  const activeDaysCount = useMemo(() => heatmapData.filter(d => d.level > 0).length, [heatmapData]);

  const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    homeHeader: {
      paddingHorizontal: layout.padding.horizontal,
      paddingTop: 32,
      paddingBottom: 16,
    },
    greetName: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 32, color: colors.text },
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
    actionIcon: {
      width: 36, height: 36, borderRadius: 18,
      backgroundColor: colors.backgroundDark,
      justifyContent: 'center', alignItems: 'center',
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
  });

  const renderBadgeItem = (badge, progressMeta) => (
    <TouchableOpacity
      key={badge.id}
      activeOpacity={0.7}
      onPress={() => openBadgeModal(badge)}
      style={[styles.badgeItem, !badge.earned && { opacity: 0.55 }]}
    >
      <ProfessionalBadgeIcon badge={badge} earned={badge.earned} isDark={isDark} />
      <Text style={styles.badgeItemTitle}>{t(badge.titleKey, lang) || badge.titleKey}</Text>
      <Text style={styles.badgeItemSub}>{t(badge.subKey, lang) || badge.subKey}</Text>
      {!badge.earned && progressMeta ? (
        <>
          <View style={styles.badgeProgressTrack}>
            <View
              style={[
                styles.badgeProgressFill,
                { width: `${Math.min(100, Math.round((progressMeta.current / Math.max(1, progressMeta.target)) * 100))}%` },
              ]}
            />
          </View>
          <Text style={styles.badgeProgressText}>
            {`${Math.min(progressMeta.current, progressMeta.target)}/${progressMeta.target}`}
          </Text>
        </>
      ) : null}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safe}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.homeHeader}>
          <Text style={styles.greetName}>{t('yourSparks', lang)}</Text>
        </View>

        {/* ── Today Hero Card: Streak + Daily Goal + Spotlight ───── */}
        <View style={styles.heroCard}>
          {/* Row 1: Streak tile + Daily Goal tile side by side */}
          <View style={styles.heroTilesRow}>
            {/* Tile 1: Streak */}
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
                  <TouchableOpacity onPress={() => navigation.navigate('HomeTab')}>
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
            >
              <View style={styles.heroTileHeader}>
                <Ionicons name="trophy-outline" size={12} color={colors.textSecondary} />
                <Text style={styles.heroTileLabel}>{t('progress_spotlight_label', lang)}</Text>
              </View>
              <View style={styles.heroSpotlightRow}>
                <Text style={{ fontSize: 26 }}>{closestBadge.icon}</Text>
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
              >
                <Text style={styles.freezeButtonText}>
                  {t(isPremium ? 'streakFreezeUseCta' : 'streakFreezePremiumCta', lang)}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* ── Action Cards (daily + category; streak card removed) ─ */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>{t('progressActionsTitle', lang)}</Text>
        </View>
        <View style={styles.actionsWrap}>
          {!isDailyGoalComplete && (
            <View style={styles.actionCard}>
              <View style={styles.actionIcon}><Text style={{ fontSize: 16 }}>📖</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.actionTitle}>{t('progressActionDailyTitle', lang)}</Text>
                <Text style={styles.actionSub}>
                  {t('progressActionDailySub', lang).replace('{{count}}', String(Math.max(1, storiesLeftToday)))}
                </Text>
              </View>
              <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('HomeTab')}>
                <Text style={styles.actionButtonText}>{t('progressActionOpenHome', lang)}</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.actionCard}>
            <View style={styles.actionIcon}><Text style={{ fontSize: 16 }}>🏅</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.actionTitle}>{t('progressActionCategoryTitle', lang)}</Text>
              <Text style={styles.actionSub}>
                {categoryAction
                  ? t('progressActionCategorySub', lang)
                      .replace('{{count}}', String(categoryAction.remaining))
                      .replace('{{category}}', t(categoryAction.category, lang))
                  : t('progressActionCategoryFallback', lang)}
              </Text>
            </View>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('HomeTab')}>
              <Text style={styles.actionButtonText}>{t('progressActionOpenHome', lang)}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Stats Row ──────────────────────────────────────────── */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{totalReads}</Text>
            <Text style={styles.statLabel}>{t('statRead', lang)}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{earnedBadgesList.length}</Text>
            <Text style={styles.statLabel}>{t('statEarned', lang)}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{streak}</Text>
            <Text style={styles.statLabel}>{t('statStreak', lang)}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{usedStoriesCount}</Text>
            <Text style={styles.statLabel}>{t('statTold', lang)}</Text>
          </View>
        </View>

        {/* ── Heatmap + KPIs ─────────────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>{t('readingHabit', lang)}</Text>
        </View>
        <View style={styles.heatmapCard}>
          <View style={styles.heatmapKpiRow}>
            <View style={styles.heatmapKpi}>
              <Text style={styles.heatmapKpiNum}>{activeDaysCount}</Text>
              <Text style={styles.heatmapKpiLabel}>{t('heatmapReadingDays', lang)}</Text>
            </View>
            <View style={styles.heatmapKpi}>
              <Text style={styles.heatmapKpiNum}>{longestStreak}</Text>
              <Text style={styles.heatmapKpiLabel}>{t('longestStreak', lang)}</Text>
            </View>
          </View>
          <View style={styles.heatmapGrid}>
            {heatmapData.map(item => (
              <View
                key={item.id}
                style={[
                  styles.heatmapSquare,
                  {
                    backgroundColor: item.level === 0 ? `${colors.backgroundDark}88` :
                                     item.level === 1 ? '#DBCFA7' :
                                     item.level === 2 ? colors.primary : '#8B6A30',
                  },
                ]}
              />
            ))}
          </View>
          <View style={styles.heatmapLegend}>
            <Text style={styles.heatmapLegendText}>{t('less', lang)}</Text>
            <View style={[styles.heatmapSquare, { backgroundColor: colors.backgroundDark, marginHorizontal: 4 }]} />
            <View style={[styles.heatmapSquare, { backgroundColor: colors.primary, marginHorizontal: 4 }]} />
            <View style={[styles.heatmapSquare, { backgroundColor: '#8B6A30', marginHorizontal: 4 }]} />
            <Text style={styles.heatmapLegendText}>{t('more', lang)}</Text>
          </View>
        </View>

        {/* ── Badge Collection (Near / Earned / Locked) ──────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>{t('achievementBadges', lang)}</Text>
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
          <>
            <View style={styles.badgeGroupHeader}>
              <Text style={styles.badgeGroupLabel}>{t('badgesGroupLocked', lang)}</Text>
            </View>
            <View style={styles.badgeContainer}>
              {lockedBadges.map(b => renderBadgeItem(b, badgeProgressMeta[b.id] || null))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProgressScreen;


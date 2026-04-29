import React, { useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  StatusBar, Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, useAnimatedStyle, withSpring, withSequence, withTiming 
} from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';
import { useUserData } from '../context/UserDataContext';
import { useStories } from '../context/StoriesContext';
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
  share_30: { icon: 'cellular', colors: ['#4682B4', '#153652'] }
  , storyteller: { icon: 'mic', colors: ['#D97706', '#92400E'] }
  , icebreaker: { icon: 'chatbubble-ellipses', colors: ['#2563EB', '#1E3A8A'] }
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
  const { streak, totalReads, earnedBadges, openBadgeModal, preferences, categoryStats, history, completedStories, variantUsage } = useUserData();
  const { stories } = useStories();
  const badgeScale = useSharedValue(0);
  const badgeOpacity = useSharedValue(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [heatmapData, setHeatmapData] = useState([]);
  const [todayReads, setTodayReads] = useState(0);
  const dailyTarget = preferences?.time?.dailyStoryTarget || 2;
  const dailyProgress = Math.min(todayReads, dailyTarget);
  const isDailyGoalComplete = dailyProgress >= dailyTarget;
  const todayKey = new Date().toISOString().split('T')[0];
  const storiesLeftToday = Math.max(0, dailyTarget - dailyProgress);

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

  const activeStories = useMemo(() => {
    const byId = new Map((stories || []).map((story) => [String(story.story_id), story]));
    const completedSet = new Set((completedStories || []).map((id) => String(id)));
    return (history || [])
      .filter((id) => !completedSet.has(String(id)))
      .slice(0, 3)
      .map((id) => byId.get(String(id)))
      .filter(Boolean);
  }, [history, stories, completedStories]);

  const usedStoriesCount = useMemo(
    () => (variantUsage || []).filter((item) => item?.action === 'mark_used').length,
    [variantUsage]
  );

  const usedCategoryCount = useMemo(() => {
    const categories = (variantUsage || [])
      .filter((item) => item?.action === 'mark_used' && item?.storyCategory)
      .map((item) => String(item.storyCategory));
    return new Set(categories).size;
  }, [variantUsage]);

  const badgeProgressMeta = useMemo(() => {
    const uniqueCats = Object.keys(categoryStats || {}).length;
    const maxCatReads = Math.max(0, ...Object.values(categoryStats || {}));
    const map = {
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
      save_5: { current: 0, target: 5 },
      save_10: { current: 0, target: 10 },
      save_50: { current: 0, target: 50 },
      save_100: { current: 0, target: 100 },
      share_1: { current: 0, target: 1 },
      share_10: { current: 0, target: 10 },
      share_20: { current: 0, target: 20 },
      share_30: { current: 0, target: 30 },
      share_50: { current: 0, target: 50 },
      storyteller: { current: usedStoriesCount, target: 10 },
      icebreaker: { current: (variantUsage || []).some((item) => item?.action === 'mark_used' && item?.variantType === 'QUESTION') ? 1 : 0, target: 1 },
    };
    return map;
  }, [categoryStats, totalReads, streak, usedStoriesCount, variantUsage]);

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

  // Isı haritası verisini DB'den yükle
  useEffect(() => {
    const loadHeatmap = async () => {
      try {
        const [history, todayHistory] = await Promise.all([
          getReadHistory(91),
          getReadHistory(0),
        ]);
        const map = {};
        history.forEach(r => { map[r.day] = r.count; });
        setTodayReads(todayHistory[0]?.count || 0);
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
  }, [totalReads]);

  const badges = earnedBadges || [];

  const closestBadge = useMemo(() => {
    const notEarned = badges.filter((b) => !b.earned);
    if (!notEarned.length) return null;
    return notEarned
      .filter((b) => badgeProgressMeta[b.id])
      .map((b) => {
        const { current, target } = badgeProgressMeta[b.id];
        const ratio = target > 0 ? Math.min(current / target, 1) : 0;
        return { ...b, current, target, ratio, remaining: Math.max(target - current, 0) };
      })
      .sort((a, b) => b.ratio - a.ratio)[0] || null;
  }, [badges, badgeProgressMeta]);

  const triggerCelebration = () => {
    setShowCelebration(true);
    badgeScale.value = 0;
    badgeOpacity.value = 1;
    badgeScale.value = withSequence(
      withSpring(1.2),
      withSpring(1)
    );
    
    setTimeout(() => {
      badgeOpacity.value = withTiming(0, { duration: 500 });
      setTimeout(() => setShowCelebration(false), 500);
    }, 2000);
  };

  const animatedBadgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
    opacity: badgeOpacity.value,
  }));

  const styles = StyleSheet.create({
    safe: { 
      flex: 1, 
      backgroundColor: colors.background
    },
    homeHeader: { 
      paddingHorizontal: layout.padding.horizontal, 
      paddingTop: 32,
      paddingBottom: 16 
    },
    greetName: { 
      fontFamily: 'PlayfairDisplay_700Bold', 
      fontSize: 32, 
      color: colors.text 
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
      textTransform: 'uppercase' 
    },
    goalCard: {
      backgroundColor: colors.backgroundDark,
      borderRadius: layout.radius.card,
      marginHorizontal: layout.padding.horizontal,
      padding: 18,
      marginBottom: 12,
    },
    goalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    goalTitle: {
      fontFamily: 'PlayfairDisplay_600SemiBold',
      fontSize: 20,
      color: colors.text,
    },
    goalCounter: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: 28,
      color: colors.text,
    },
    goalSub: {
      fontFamily: 'Inter_400Regular',
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 20,
      marginBottom: 14,
    },
    goalBarTrack: {
      height: 10,
      borderRadius: 999,
      backgroundColor: colors.border,
      overflow: 'hidden',
      marginBottom: 12,
    },
    goalBarFill: {
      height: '100%',
      borderRadius: 999,
      backgroundColor: colors.primary,
    },
    goalStatus: {
      alignSelf: 'flex-start',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
    },
    goalStatusText: {
      fontFamily: 'Inter_500Medium',
      fontSize: 11,
      letterSpacing: 0.4,
      textTransform: 'uppercase',
    },
    actionsWrap: {
      marginHorizontal: layout.padding.horizontal,
      marginBottom: 10,
      gap: 10,
    },
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
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.backgroundDark,
      justifyContent: 'center',
      alignItems: 'center',
    },
    actionTitle: {
      fontFamily: 'Inter_500Medium',
      fontSize: 14,
      color: colors.text,
      marginBottom: 2,
    },
    actionSub: {
      fontFamily: 'Inter_400Regular',
      fontSize: 12,
      color: colors.textSecondary,
      lineHeight: 18,
    },
    actionButton: {
      marginLeft: 'auto',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 10,
      paddingVertical: 6,
      backgroundColor: colors.backgroundDark,
    },
    actionButtonText: {
      fontFamily: 'Inter_500Medium',
      fontSize: 11,
      color: colors.text,
    },
    activeStoryCard: {
      backgroundColor: colors.background,
      borderWidth: layout.borderWidth,
      borderColor: colors.border,
      borderRadius: layout.radius.card,
      padding: 14,
      marginHorizontal: layout.padding.horizontal,
      marginBottom: 10,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    activeStoryIcon: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: colors.backgroundDark,
      alignItems: 'center',
      justifyContent: 'center',
    },
    activeStoryTitle: {
      fontFamily: 'PlayfairDisplay_600SemiBold',
      fontSize: 16,
      color: colors.text,
      lineHeight: 21,
    },
    activeStorySub: {
      fontFamily: 'Inter_400Regular',
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 2,
    },
    heatmapCard: {
      backgroundColor: colors.background,
      borderWidth: layout.borderWidth,
      borderColor: colors.border,
      borderRadius: layout.radius.card,
      marginHorizontal: layout.padding.horizontal,
      padding: 16,
    },
    heatmapGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 4,
      justifyContent: 'center',
    },
    heatmapSquare: {
      width: (width - 80) / 13 - 4,
      height: (width - 80) / 13 - 4,
      borderRadius: 999,
    },
    heatmapLegend: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      marginTop: 16,
    },
    heatmapLegendText: {
      fontFamily: 'Inter_400Regular',
      fontSize: 10,
      color: colors.textSecondary,
    },
    badgeContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
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
      marginTop: 10,
      width: '100%',
      height: 3,
      borderRadius: 999,
      backgroundColor: colors.border,
      overflow: 'hidden',
    },
    badgeProgressFill: {
      height: '100%',
      borderRadius: 999,
      backgroundColor: colors.primary,
    },
    badgeProgressText: {
      marginTop: 5,
      fontFamily: 'Inter_500Medium',
      fontSize: 10,
      color: colors.textSecondary,
    },
    badgeIconCircle: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.backgroundDark,
      borderWidth: 1.5,
      borderColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    badgeItemTitle: {
      fontFamily: 'PlayfairDisplay_600SemiBold',
      fontSize: 16,
      color: colors.text,
    },
    badgeItemSub: {
      fontFamily: 'Inter_400Regular',
      fontSize: 12,
      color: colors.textSecondary,
    },
    statsRow: {
      flexDirection: 'row',
      gap: 12,
      paddingHorizontal: layout.padding.horizontal,
      marginTop: 24,
    },
    statBox: {
      flex: 1,
      backgroundColor: colors.backgroundDark,
      borderRadius: layout.radius.card,
      padding: 16,
      alignItems: 'center',
    },
    statNum: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: 24,
      color: colors.text,
    },
    statLabel: {
      fontFamily: 'Inter_400Regular',
      fontSize: 11,
      color: colors.textSecondary,
      textTransform: 'uppercase',
    },
    celebrationOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: isDark ? colors.overlayDark : 'rgba(18,17,15,0.16)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    congratsCircle: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 24,
      borderWidth: 3,
      borderColor: colors.danger,
    },
    congratsTitle: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: 32,
      color: colors.text,
      marginBottom: 8,
    },
    congratsSub: {
      fontFamily: 'Inter_400Regular',
      fontSize: 16,
      color: colors.textSecondary,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: isDark ? colors.overlayDark : 'rgba(18,17,15,0.24)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    modalCard: {
      backgroundColor: colors.background,
      borderRadius: layout.radius.card,
      padding: 28,
      width: '100%',
      maxWidth: 340,
      alignItems: 'center',
      borderWidth: layout.borderWidth,
      borderColor: colors.border,
    },
    modalIconCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    modalTitle: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: 22,
      color: colors.text,
      marginBottom: 4,
      textAlign: 'center',
    },
    modalSub: {
      fontFamily: 'Inter_400Regular',
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 16,
      textAlign: 'center',
    },
    modalDesc: {
      fontFamily: 'Inter_400Regular',
      fontSize: 14,
      color: colors.text,
      textAlign: 'center',
      lineHeight: 20,
      marginBottom: 16,
    },
    modalStatusBadge: {
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: 20,
      marginBottom: 20,
    },
    modalStatusText: {
      fontFamily: 'Inter_500Medium',
      fontSize: 12,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    modalCloseBtn: {
      paddingHorizontal: 32,
      paddingVertical: 10,
      borderRadius: layout.radius.card,
      borderWidth: 1,
      borderColor: colors.border,
    },
    modalCloseText: {
      fontFamily: 'Inter_500Medium',
      fontSize: 14,
      color: colors.text,
    },
  });

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safe}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.homeHeader}>
          <Text style={styles.greetName}>{t('yourSparks', lang)}</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>{t('dailyGoal', lang)}</Text>
        </View>

        {/* ── Sıradaki Hedef Spotlight ──────────────────────────────── */}
        {closestBadge && (
          <View style={{ marginHorizontal: layout.padding.horizontal, marginBottom: 14 }}>
            <LinearGradient
              colors={isDark ? ['#2A1F14', '#1E1814'] : ['#FBF5EA', '#F2E8D4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: layout.radius.card,
                padding: 16,
                borderWidth: 1,
                borderColor: `${colors.primary}55`,
              }}
            >
              <Text style={{
                fontFamily: 'Inter_500Medium',
                fontSize: 10,
                color: colors.primary,
                letterSpacing: 1.2,
                textTransform: 'uppercase',
                marginBottom: 10,
              }}>
                {t('progress_spotlight_label', lang)}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                <Text style={{ fontSize: 40 }}>{closestBadge.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontFamily: 'PlayfairDisplay_700Bold',
                    fontSize: 18,
                    color: colors.text,
                    marginBottom: 2,
                  }}>
                    {t(closestBadge.titleKey, lang)}
                  </Text>
                  <Text style={{
                    fontFamily: 'Inter_400Regular',
                    fontSize: 12,
                    color: colors.textSecondary,
                  }}>
                    {closestBadge.remaining > 0
                      ? t('progress_spotlight_badge_remaining', lang).replace('{{n}}', String(closestBadge.remaining))
                      : t('progress_spotlight_badge_almost', lang)}
                  </Text>
                </View>
                <Text style={{
                  fontFamily: 'PlayfairDisplay_700Bold',
                  fontSize: 22,
                  color: colors.primary,
                }}>
                  {`${Math.round(closestBadge.ratio * 100)}%`}
                </Text>
              </View>
              <View style={{
                height: 5, borderRadius: 999,
                backgroundColor: isDark ? colors.backgroundDark : colors.border,
                marginTop: 12, overflow: 'hidden',
              }}>
                <View style={{
                  height: '100%', borderRadius: 999,
                  backgroundColor: colors.primary,
                  width: `${Math.round(closestBadge.ratio * 100)}%`,
                }} />
              </View>
            </LinearGradient>
          </View>
        )}

        <View style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <Text style={styles.goalTitle}>{t('dailyGoalTitle', lang)}</Text>
            <Text style={styles.goalCounter}>{`${dailyProgress}/${dailyTarget}`}</Text>
          </View>
          <Text style={styles.goalSub}>
            {t('dailyGoalSub', lang)
              .replace('{{done}}', String(dailyProgress))
              .replace('{{target}}', String(dailyTarget))}
          </Text>
          <View style={styles.goalBarTrack}>
            <View style={[styles.goalBarFill, { width: `${(dailyProgress / dailyTarget) * 100}%` }]} />
          </View>
          <View style={[
            styles.goalStatus,
            { backgroundColor: isDailyGoalComplete ? `${colors.primary}22` : `${colors.border}66` },
          ]}>
            <Text style={[
              styles.goalStatusText,
              { color: isDailyGoalComplete ? colors.primary : colors.textSecondary },
            ]}>
              {isDailyGoalComplete ? t('dailyGoalComplete', lang) : t('dailyGoalInProgress', lang)}
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>{t('progressActionsTitle', lang)}</Text>
        </View>
        <View style={styles.actionsWrap}>
          <View style={styles.actionCard}>
            <View style={styles.actionIcon}>
              <Text style={{ fontSize: 16 }}>📖</Text>
            </View>
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

          <View style={styles.actionCard}>
            <View style={styles.actionIcon}>
              <Text style={{ fontSize: 16 }}>🏅</Text>
            </View>
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

          <View style={styles.actionCard}>
            <View style={styles.actionIcon}>
              <Text style={{ fontSize: 16 }}>🔥</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.actionTitle}>{t('progressActionStreakTitle', lang)}</Text>
              <Text style={styles.actionSub}>{t('progressActionStreakSub', lang)}</Text>
            </View>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('HomeTab')}>
              <Text style={styles.actionButtonText}>{t('progressActionTomorrowCta', lang)}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>{t('progressActiveStoriesTitle', lang)}</Text>
        </View>
        {activeStories.length > 0 ? activeStories.map((story) => (
          <View key={`active-${story.story_id}`} style={styles.activeStoryCard}>
            <View style={styles.activeStoryIcon}>
              <Text style={{ fontSize: 15 }}>📚</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.activeStoryTitle} numberOfLines={1}>{story.title || ''}</Text>
              <Text style={styles.activeStorySub} numberOfLines={1}>
                {`${t(story.parent_cat || story.cat, lang)} • ${story.min} ${t('minLabel', lang)}`}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                navigation.navigate('LibraryTab');
                navigation.navigate('StoryDetail', { story });
              }}
            >
              <Text style={styles.actionButtonText}>{t('progressOpenInLibrary', lang)}</Text>
            </TouchableOpacity>
          </View>
        )) : (
          <View style={[styles.heatmapCard, { marginBottom: 8, alignItems: 'center' }]}> 
            <Text style={{ fontSize: 28, marginBottom: 8 }}>✨</Text>
            <Text style={[styles.actionSub, { textAlign: 'center' }]}>{t('progressActiveStoriesEmpty', lang)}</Text>
          </View>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>{t('readingHabit', lang)}</Text>
        </View>
        <View style={styles.heatmapCard}>
          <View style={styles.heatmapGrid}>
            {heatmapData.map(item => (
              <View 
                key={item.id} 
                style={[
                  styles.heatmapSquare, 
                  { 
                    backgroundColor: item.level === 0 ? `${colors.backgroundDark}88` : 
                                     item.level === 1 ? '#DBCFA7' : 
                                     item.level === 2 ? colors.primary : '#8B6A30' 
                  }
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

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>{t('achievementBadges', lang)}</Text>
          <TouchableOpacity onPress={triggerCelebration}>
            <Text style={{ fontSize: 11, color: colors.primary, fontFamily: 'Inter_500Medium' }}>{t('testBtn', lang)}</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.badgeContainer}>
          {badges.map(badge => (
            <TouchableOpacity 
              key={badge.id} 
              activeOpacity={0.7}
              onPress={() => openBadgeModal(badge)}
              style={[styles.badgeItem, !badge.earned && { opacity: 0.4 }]}
            >
              <ProfessionalBadgeIcon badge={badge} earned={badge.earned} isDark={isDark} />
              <Text style={styles.badgeItemTitle}>{t(badge.titleKey, lang) || badge.titleKey}</Text>
              <Text style={styles.badgeItemSub}>{t(badge.subKey, lang) || badge.subKey}</Text>
              {!badge.earned && badgeProgressMeta[badge.id] ? (
                <>
                  <View style={styles.badgeProgressTrack}>
                    <View
                      style={[
                        styles.badgeProgressFill,
                        {
                          width: `${Math.min(100, Math.round((badgeProgressMeta[badge.id].current / Math.max(1, badgeProgressMeta[badge.id].target)) * 100))}%`,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.badgeProgressText}>
                    {`${Math.min(badgeProgressMeta[badge.id].current, badgeProgressMeta[badge.id].target)}/${badgeProgressMeta[badge.id].target}`}
                  </Text>
                </>
              ) : null}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{totalReads}</Text>
            <Text style={styles.statLabel}>{t('statRead', lang)}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{badges.filter(b => b.earned).length}</Text>
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

        <View style={[styles.heatmapCard, { marginTop: 16 }]}> 
          <Text style={styles.actionTitle}>{t('progressConversationStatTitle', lang)}</Text>
          <Text style={[styles.actionSub, { marginTop: 4 }]}>
            {t('progressConversationStatSub', lang)
              .replace('{{used}}', String(usedStoriesCount))
              .replace('{{cats}}', String(usedCategoryCount))}
          </Text>
        </View>
      </ScrollView>

      {showCelebration && (
        <View style={styles.celebrationOverlay} pointerEvents="none">
          <Animated.View style={[{ alignItems: 'center' }, animatedBadgeStyle]}>
            <View style={styles.congratsCircle}>
              <Text style={{ fontSize: 48 }}>🏆</Text>
            </View>
            <Text style={styles.congratsTitle}>{t('congratsTitle', lang)}</Text>
            <Text style={styles.congratsSub}>{t('congratsSub', lang)}</Text>
          </Animated.View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ProgressScreen;

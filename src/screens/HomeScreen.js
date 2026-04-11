import React, { useState, useEffect, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  View, Text, ScrollView, TouchableOpacity, StyleSheet, 
  StatusBar, Platform, Dimensions, Animated 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useUserData } from '../context/UserDataContext';
import { useStories } from '../context/StoriesContext';
import { getSelectedCategories } from '../db/db';
import StoryCard, { getCatIcon } from '../components/StoryCard';
import { Ionicons } from '@expo/vector-icons';
import { t, getGreeting } from '../locales/i18n';
import { ANALYTICS_EVENTS, trackEvent } from '../utils/analytics';

const FIRST_SESSION_PROMPT_KEY = '@kivilcim_first_session_prompt';

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

const HomeScreen = ({ navigation }) => {
  const { colors, typography, layout, isDark, lang, setLang, selectedCategories, setSelectedCategories } = useTheme();
  const { isPremium, history, earnedBadges, totalReads, streak, longestStreak, categoryStats, shareCount, favorites, preferences } = useUserData();
  const { stories, storiesLoading, categories, parentCategories, errorMsg } = useStories();
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Tümü');
  const [visibleCount, setVisibleCount] = useState(11);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [badgeCardIndex, setBadgeCardIndex] = useState(0);
  const [showFirstSessionPrompt, setShowFirstSessionPrompt] = useState(false);
  const isFetchingRef = useRef(false);  // ref to avoid stale closure
  const visibleCountRef = useRef(11);   // ref to read latest value in callbacks
  const badgeScrollRef = useRef(null);
  const flipAnim = useRef(new Animated.Value(0)).current;
  const hasTrackedPersonalizedFeedRef = useRef(false);
  const screenWidth = Dimensions.get('window').width;

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

  // Visible categories: Tümü + User Selected Categories
  const visibleCategoriesList = React.useMemo(() => {
    let filteredParents = parentCategories;
    if (selectedCategories && selectedCategories.length > 0) {
      filteredParents = parentCategories.filter(p => selectedCategories.includes(p.name));
    }
    return ['Tümü', ...filteredParents.map(p => p.name)];
  }, [parentCategories, selectedCategories]);

  useEffect(() => {
    if (activeFilter !== 'Tümü' && !visibleCategoriesList.includes(activeFilter)) {
      setActiveFilter('Tümü');
    }
  }, [visibleCategoriesList, activeFilter]);

  // Language strings
  const greeting = getGreeting(lang);
  const brandText = t('brandText', lang);

  const categoriesLabel = t('categoriesLabel', lang);
  const todayLabel = t('todayLabel', lang);
  const forYouLabel = t('home_for_you', lang);
  const personalizedTarget = preferences?.time?.dailyStoryTarget || 2;
  const personalizedMinutes = preferences?.time?.minutes || 6;
  const forYouSubtitle = t('home_for_you_sub', lang)
    .replace('{{stories}}', String(personalizedTarget))
    .replace('{{minutes}}', String(personalizedMinutes));
  const firstSessionTitle = t('home_first_session_title', lang)
    .replace('{{stories}}', String(personalizedTarget));
  const firstSessionBody = t('home_first_session_sub', lang)
    .replace('{{stories}}', String(personalizedTarget))
    .replace('{{minutes}}', String(personalizedMinutes));

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
  const completionLine = lang === 'tr'
    ? `${badgeProgressInfo.earned}/${badgeProgressInfo.total} rozet tamamlandı`
    : `${badgeProgressInfo.earned}/${badgeProgressInfo.total} badges completed`;
  const badgeCarouselItems = badgeProgressInfo.nextCandidates.length > 0
    ? badgeProgressInfo.nextCandidates
    : [null]; // null = "all completed" card

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

  // Refresh on focus to load latest selected categories from DB if changed elsewhere
  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      Promise.all([
        getSelectedCategories().catch(() => null),
        AsyncStorage.getItem(FIRST_SESSION_PROMPT_KEY).catch(() => null),
      ]).then(([list, promptFlag]) => {
        if (!isActive) return;

        if (Array.isArray(list)) {
          setSelectedCategories(list);
        }

        setShowFirstSessionPrompt(promptFlag === 'true');
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
    prefFiltered = publishedStories.filter(s => selectedCategories.includes(s.parent_cat));
    // If no stories found in selected categories, fallback to all published
    if (prefFiltered.length === 0) prefFiltered = publishedStories;
  }

  // 3. UI Filter: Ekranda tıklanan ebeveyn kategoriye göre filtreleme
  const categoryFiltered = activeFilter === 'Tümü'
    ? prefFiltered
    : prefFiltered.filter(s => s.parent_cat === activeFilter);

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
    // Geri kalan durumlar için id büyükten küçüğe sırala (en son eklenen ilk)
    return parseInt(b.story_id, 10) - parseInt(a.story_id, 10);
  });

  const personalizedStories = sortedStories.slice(0, personalizedTarget);
  const personalizedStoryIds = new Set(personalizedStories.map((story) => story.story_id));
  const remainingStories = sortedStories.filter((story) => !personalizedStoryIds.has(story.story_id));

  useEffect(() => {
    if (personalizedStories.length === 0 || hasTrackedPersonalizedFeedRef.current) {
      return;
    }

    hasTrackedPersonalizedFeedRef.current = true;
    trackEvent(ANALYTICS_EVENTS.PERSONALIZED_FEED_SHOWN, {
      dailyStoryTarget: personalizedTarget,
      personalizedStoriesCount: personalizedStories.length,
      filter: activeFilter,
      lang,
    });
  }, [personalizedStories, personalizedTarget, activeFilter, lang]);

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

  const paginatedStories = remainingStories.slice(0, visibleCount);

  const remainingFreeQuota = isPremium ? paginatedStories.length : Math.max(0, 2 - personalizedStories.length);
  const free = isPremium ? paginatedStories : paginatedStories.slice(0, remainingFreeQuota);
  const locked = isPremium ? [] : paginatedStories.slice(remainingFreeQuota);

  const dismissFirstSessionPrompt = async () => {
    setShowFirstSessionPrompt(false);
    try {
      await AsyncStorage.removeItem(FIRST_SESSION_PROMPT_KEY);
    } catch (error) {
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
        source: 'first_session_prompt',
        dailyStoryTarget: personalizedTarget,
        lang,
      });
      navigation.navigate('StoryDetail', { story: firstStory });
      return;
    }

    navigation.navigate('Search');
  };

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
      paddingTop: 32,
      paddingBottom: 16 
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    greetSub: { 
      fontFamily: 'PlayfairDisplay_400Regular', 
      fontSize: 24, 
      color: colors.text, 
      marginBottom: -4 
    },
    greetName: { 
      fontFamily: 'PlayfairDisplay_700Bold', 
      fontSize: 32, 
      color: colors.text 
    },
    searchIcon: {
      fontSize: 22,
      color: colors.textSecondary,
    },
    avatar: { 
      width: 38, 
      height: 38, 
      borderRadius: 12, 
      backgroundColor: isDark ? colors.backgroundDark : '#E6DEC8', 
      borderWidth: isDark ? 1 : 0,
      borderColor: colors.border,
      alignItems: 'center', 
      justifyContent: 'center' 
    },
    avatarText: { 
      fontFamily: 'Inter_500Medium', 
      fontSize: 14, 
      color: colors.text 
    },
    langBtn: {
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: 'transparent',
      marginLeft: 4
    },
    langBtnText: {
      fontFamily: 'Inter_500Medium',
      fontSize: 14,
      color: colors.text
    },
    streakCard: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      borderRadius: 16, 
      paddingVertical: 20,
      paddingHorizontal: 20, 
      marginHorizontal: layout.padding.horizontal, 
      marginBottom: 32, 
      // Shadow for lifted premium feel
      shadowColor: '#C5A059',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 5,
    },
    streakDays: { 
      fontFamily: 'PlayfairDisplay_700Bold', 
      fontSize: 24, 
      color: '#1A1A1A' 
    },
    streakLabel: { 
      fontFamily: 'Inter_400Regular', 
      fontSize: 14, 
      color: '#333333' 
    },
    streakDot: { 
      width: 8, 
      height: 8, 
      borderRadius: 4 
    },
    sectionLabel: { 
      fontFamily: 'Inter_500Medium',
      fontSize: 11,
      color: colors.textSecondary,
      letterSpacing: 1,
      textTransform: 'uppercase',
      marginHorizontal: layout.padding.horizontal,
      marginTop: 32,
      marginBottom: 16,
      display: 'none', // Staying hidden per previous mockup logic, but updating color if shown
    },
    catPill: { 
      paddingHorizontal: 18, 
      paddingVertical: 10, 
      borderRadius: 24, 
      borderWidth: 1, 
      borderColor: colors.border, 
      backgroundColor: 'transparent' 
    },
    catPillActive: { 
      backgroundColor: '#823b18', 
      borderColor: '#823b18' 
    },
    catPillText: { 
      fontFamily: 'Inter_600SemiBold', 
      fontSize: 14, 
      color: colors.primary
    },
    catPillTextActive: { 
      color: '#FFFFFF', 
      fontFamily: 'Inter_500Medium' 
    },
    storyGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginTop: 12,
    },
    sectionTitle: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: typography.sizes.headingSmall,
      color: colors.text,
      marginBottom: 6,
    },
    sectionSub: {
      fontFamily: 'Inter_400Regular',
      fontSize: typography.sizes.bodySmall,
      color: colors.textSecondary,
      lineHeight: 20,
      marginBottom: 16,
    },
    firstSessionCard: {
      marginBottom: 20,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: `${colors.primary}55`,
      backgroundColor: `${colors.primary}12`,
      padding: 16,
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
      fontSize: typography.sizes.bodySmall,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    firstSessionClose: {
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: `${colors.primary}18`,
    },
    firstSessionCta: {
      alignSelf: 'flex-start',
      marginTop: 4,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 999,
      backgroundColor: colors.primary,
    },
    firstSessionCtaText: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 13,
      color: colors.onPrimary,
      letterSpacing: 0.3,
      textTransform: 'uppercase',
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
        <View style={styles.homeHeader}>
          <View>
            <Text style={styles.greetSub}>{greeting}</Text>
            <Text style={styles.greetName}>{brandText}</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={() => navigation.navigate('Search')}>
              <Ionicons name="search" style={styles.searchIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('ProfileTab')} style={styles.avatar}>
              <Text style={styles.avatarText}>AY</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setLang(lang === 'en' ? 'tr' : 'en')} style={styles.langBtn}>
              <Text style={styles.langBtnText}>{lang.toUpperCase()}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ marginBottom: 32 }}>
          <ScrollView
            ref={badgeScrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
              setBadgeCardIndex(index);
            }}
          >
            {badgeCarouselItems.map((badge, i) => {
              const badgeTitle = badge ? t(badge.titleKey, lang) : null;
              const badgePercent = badge ? Math.round(badge.ratio * 100) : 100;
              const headerSub = badge
                ? (lang === 'tr' ? `Sıradaki rozete yakınsın: ${badgeTitle}` : `You are close to the next badge: ${badgeTitle}`)
                : (lang === 'tr' ? 'Tüm rozetler tamamlandı' : 'All badges completed');
              return (
                <View key={i} style={{ width: screenWidth, paddingHorizontal: layout.padding.horizontal }}>
                  <LinearGradient
                    colors={['#D8C08F', '#BE9347']}
                    style={[styles.streakCard, { marginHorizontal: 0, marginBottom: 0 }]}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                  >
                    <Text style={{ fontSize: 42 }}>{badge ? badge.icon : '🏆'}</Text>
                    <View style={{ marginLeft: 16, flex: 1 }}>
                      <Text style={styles.streakDays}>{`%${badgePercent}`}</Text>
                      <Text style={styles.streakLabel}>{lang === 'tr' ? 'Rozet Yolculuğun' : 'Badge Journey'}</Text>
                      <Text style={[styles.streakLabel, { marginTop: 2 }]} numberOfLines={1}>{headerSub}</Text>
                      <Text style={[styles.streakLabel, { marginTop: 2 }]}>{completionLine}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 6 }}>
                      {Array.from({ length: progressSegments }).map((_, j) => (
                        <View
                          key={j}
                          style={[
                            styles.streakDot,
                            j < activeSegments
                              ? { width: j === activeSegments - 1 ? 24 : 8, backgroundColor: isDark ? colors.text : '#fff' }
                              : { backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.4)' },
                          ]}
                        />
                      ))}
                    </View>
                  </LinearGradient>
                </View>
              );
            })}
          </ScrollView>
          {badgeCarouselItems.length > 1 && (
            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 10 }}>
              {badgeCarouselItems.map((_, i) => (
                <View
                  key={i}
                  style={{
                    width: badgeCardIndex === i ? 16 : 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: badgeCardIndex === i ? colors.primary : colors.textSecondary + '40',
                  }}
                />
              ))}
            </View>
          )}
        </View>

        <Text style={[styles.sectionLabel, { paddingHorizontal: layout.padding.horizontal }]}>
          {categoriesLabel}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: layout.padding.horizontal }}>
            {visibleCategoriesList.map(cat => {
              const parentInfo = parentCategories.find(p => p.name === cat);
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.catPill, cat === activeFilter ? styles.catPillActive : null, { flexDirection: 'row', alignItems: 'center', gap: 8 }]}
                  onPress={() => setActiveFilter(cat)}
                >
                  {parentInfo && <Ionicons name={getCatIcon(parentInfo.name)} size={14} color={cat === activeFilter ? '#FFF' : colors.primary} />}
                  <Text style={[styles.catPillText, cat === activeFilter ? styles.catPillTextActive : null]}>
                    {t(cat, lang)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

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
              <Text style={{ fontSize: 48, marginBottom: 16 }}>📭</Text>
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
              {showFirstSessionPrompt && (
                <View style={styles.firstSessionCard}>
                  <View style={styles.firstSessionTop}>
                    <View style={styles.firstSessionTextWrap}>
                      <Text style={styles.firstSessionTitle}>{firstSessionTitle}</Text>
                      <Text style={styles.firstSessionSub}>{firstSessionBody}</Text>
                    </View>
                    <TouchableOpacity style={styles.firstSessionClose} onPress={dismissFirstSessionPrompt}>
                      <Ionicons name="close" size={16} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity style={styles.firstSessionCta} onPress={openFirstRecommendedStory}>
                    <Text style={styles.firstSessionCtaText}>{t('home_open_first_story_cta', lang)}</Text>
                  </TouchableOpacity>
                </View>
              )}

              {personalizedStories.length > 0 && (
                <View style={{ marginBottom: 28 }}>
                  <Text style={styles.sectionTitle}>{forYouLabel}</Text>
                  <Text style={styles.sectionSub}>{forYouSubtitle}</Text>

                  <StoryCard
                    story={personalizedStories[0]}
                    type="hero"
                    hideCategory={activeFilter !== 'Tümü'}
                    isRead={checkIfRead(personalizedStories[0].story_id)}
                    onPress={() => openPersonalizedStory(personalizedStories[0], 0)}
                  />

                  {personalizedStories.length > 1 && (
                    <View style={styles.storyGrid}>
                      {personalizedStories.slice(1).map((story, index) => {
                        const isLocked = !isPremium && index + 1 >= 2;

                        return (
                          <StoryCard
                            key={story.story_id}
                            story={story}
                            type="compact"
                            locked={isLocked}
                            hideCategory={activeFilter !== 'Tümü'}
                            isRead={checkIfRead(story.story_id)}
                            onPress={() => isLocked ? navigation.navigate('Paywall') : openPersonalizedStory(story, index + 1)}
                          />
                        );
                      })}
                    </View>
                  )}
                </View>
              )}

              {free.length > 0 && (
                <StoryCard 
                  story={free[0]} 
                  type="hero" 
                  hideCategory={activeFilter !== 'Tümü'}
                  isRead={checkIfRead(free[0].story_id)}
                  onPress={() => navigation.navigate('StoryDetail', { story: free[0] })} 
                />
              )}

              <View style={styles.storyGrid}>
                {free.slice(1).map(story => (
                  <StoryCard 
                    key={story.story_id} 
                    story={story} 
                    type="compact" 
                    hideCategory={activeFilter !== 'Tümü'}
                    isRead={checkIfRead(story.story_id)}
                    onPress={() => navigation.navigate('StoryDetail', { story })} 
                  />
                ))}
                {locked.map(story => (
                  <StoryCard 
                    key={story.story_id} 
                    story={story} 
                    type="compact" 
                    locked 
                    hideCategory={activeFilter !== 'Tümü'}
                    onPress={() => navigation.navigate('Paywall')} 
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
    </SafeAreaView>
  );
};

export default HomeScreen;

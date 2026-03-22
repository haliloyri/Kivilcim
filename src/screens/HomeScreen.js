import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { 
  View, Text, ScrollView, TouchableOpacity, StyleSheet, 
  StatusBar, Platform, Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useUserData } from '../context/UserDataContext';
import { useStories } from '../context/StoriesContext';
import { getSelectedCategories } from '../db/db';
import StoryCard, { getCatIcon } from '../components/StoryCard';
import { Ionicons } from '@expo/vector-icons';
import { t, getGreeting } from '../locales/i18n';

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
  const { isPremium, history } = useUserData();
  const { stories, storiesLoading, categories, errorMsg } = useStories();
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Tümü');

  // Visible categories: Tümü + currently selected categories from preferences
  const visibleCategories = React.useMemo(() => {
    return ['Tümü', ...(selectedCategories || [])];
  }, [selectedCategories]);

  // Language strings
  const greeting = getGreeting(lang);
  const brandText = t('brandText', lang);

  const categoriesLabel = t('categoriesLabel', lang);
  const todayLabel = t('todayLabel', lang);

  const checkIfRead = (id) => history.includes(id);

  useEffect(() => {
    if (!storiesLoading) {
      const timer = setTimeout(() => setLoading(false), 400);
      return () => clearTimeout(timer);
    }
  }, [storiesLoading]);

  // Refresh on focus to load latest selected categories from DB if changed elsewhere
  useFocusEffect(
    React.useCallback(() => {
      getSelectedCategories()
        .then(list => {
          if (Array.isArray(list)) {
            setSelectedCategories(list);
          }
        })
        .catch(() => {});
    }, [])
  );
  
  // Bugünü al (dinamik)
  const todayStr = new Date().toISOString().split('T')[0];

  // 1. Yayın tarihi geçmiş veya bugün olanları filtrele
  const publishedStories = (stories || []).filter(s => s.publishDate <= todayStr);

  // 2. Preferences Filter: Sadece takip edilen kategorileri gösteririz.
  //    Eğer seçili kategorilerle eşleşen hikaye yoksa (veri değişikliği sonrası), tümünü göster.
  let prefFiltered = publishedStories;
  if (selectedCategories && selectedCategories.length > 0) {
    const matched = publishedStories.filter(s => selectedCategories.includes(s.cat));
    if (matched.length > 0) {
      prefFiltered = matched;
    }
  }

  // 2b. UI Filter: Ekranda tıklanan kategoriye göre filtreleme
  const categoryFiltered = activeFilter === 'Tümü'
    ? prefFiltered
    : prefFiltered.filter(s => s.cat === activeFilter);

  // 3. Sıralama: Önce okunmayanlar, sonra okunanlar. Kendi içinde tarihe göre (yeni olan önce)
  const sortedStories = [...categoryFiltered].sort((a, b) => {
    const aRead = checkIfRead(a.story_id);
    const bRead = checkIfRead(b.story_id);
    
    if (aRead !== bRead) {
      return aRead ? 1 : -1;
    }
    
    return (b.publishDate || '').localeCompare(a.publishDate || '');
  }).slice(0, 10);

  const free = isPremium ? sortedStories : sortedStories.slice(0, 2);
  const locked = isPremium ? [] : sortedStories.slice(2);

  const styles = StyleSheet.create({
    safe: { 
      flex: 1, 
      backgroundColor: colors.background, 
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 
    },
    homeHeader: { 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      paddingHorizontal: layout.padding.horizontal, 
      paddingVertical: 16 
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    greetSub: { 
      fontFamily: 'DMSans_400Regular', 
      fontSize: typography.sizes.ui - 1, 
      color: colors.textSecondary, 
      marginBottom: 2 
    },
    greetName: { 
      fontFamily: 'PlayfairDisplay_700Bold', 
      fontSize: typography.sizes.headingSmall, 
      color: colors.text 
    },
    searchIcon: {
      fontSize: 22,
      color: colors.textSecondary,
    },
    avatar: { 
      width: 36, 
      height: 36, 
      borderRadius: 18, 
      backgroundColor: colors.backgroundDark, 
      borderWidth: layout.borderWidth, 
      borderColor: colors.border, 
      alignItems: 'center', 
      justifyContent: 'center' 
    },
    avatarText: { 
      fontFamily: 'DMSans_500Medium', 
      fontSize: 12, 
      color: colors.textSecondary 
    },
    langBtn: {
      paddingHorizontal: 8,
      paddingVertical: 6,
      borderRadius: 6,
      borderWidth: layout.borderWidth,
      borderColor: colors.border,
      backgroundColor: colors.background,
      marginLeft: 4
    },
    langBtnText: {
      fontFamily: 'DMSans_500Medium',
      fontSize: 12,
      color: colors.text
    },
    streakCard: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      backgroundColor: colors.backgroundDark, 
      borderRadius: layout.radius.card, 
      padding: 14, 
      marginHorizontal: layout.padding.horizontal, 
      marginBottom: 20, 
      borderWidth: layout.borderWidth, 
      borderColor: colors.border 
    },
    streakDays: { 
      fontFamily: 'PlayfairDisplay_600SemiBold', 
      fontSize: typography.sizes.headingSmall, 
      color: colors.text 
    },
    streakLabel: { 
      fontFamily: 'DMSans_400Regular', 
      fontSize: typography.sizes.ui - 1, 
      color: colors.textSecondary 
    },
    streakDot: { 
      width: 8, 
      height: 8, 
      borderRadius: 4 
    },
    sectionLabel: { 
      fontFamily: 'DMSans_500Medium', 
      fontSize: typography.sizes.badge, 
      color: colors.textSecondary, 
      letterSpacing: 1, 
      textTransform: 'uppercase', 
      marginBottom: 10 
    },
    catPill: { 
      paddingHorizontal: 14, 
      paddingVertical: 7, 
      borderRadius: 20, 
      borderWidth: layout.borderWidth, 
      borderColor: colors.border, 
      backgroundColor: colors.background 
    },
    catPillActive: { 
      backgroundColor: colors.text, 
      borderColor: colors.text 
    },
    catPillText: { 
      fontFamily: 'DMSans_400Regular', 
      fontSize: typography.sizes.ui - 1, 
      color: colors.textSecondary 
    },
    catPillTextActive: { 
      color: colors.background, 
      fontFamily: 'DMSans_500Medium' 
    },
    storyGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginTop: 12,
    },
  });

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      <ScrollView showsVerticalScrollIndicator={false}>
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

        <View style={styles.streakCard}>
        <Text style={{ fontSize: 32 }}>🔥</Text>
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.streakDays}>7 {t('streakDays', lang)}</Text>
            <Text style={styles.streakLabel}>{t('streakLabel', lang)}</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 4 }}>
            {[0, 1, 2, 3, 4, 5, 6].map(i => (
              <View key={i} style={[styles.streakDot, { backgroundColor: colors.primary }]} />
            ))}
          </View>
        </View>

        <Text style={[styles.sectionLabel, { paddingHorizontal: layout.padding.horizontal }]}>
          {categoriesLabel}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: layout.padding.horizontal }}>
            {visibleCategories.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[styles.catPill, cat === activeFilter ? styles.catPillActive : null, { flexDirection: 'row', alignItems: 'center', gap: 6 }]}
                onPress={() => setActiveFilter(cat)}
              >
                <Ionicons name={getCatIcon(cat)} size={14} color={cat === activeFilter ? colors.background : colors.textSecondary} />
                <Text style={[styles.catPillText, cat === activeFilter ? styles.catPillTextActive : null]}>
                  {t(cat, lang)}
                </Text>
              </TouchableOpacity>
            ))}
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
                fontFamily: 'DMSans_400Regular',
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
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

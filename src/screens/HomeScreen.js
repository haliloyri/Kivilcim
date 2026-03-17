import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { 
  View, Text, ScrollView, TouchableOpacity, StyleSheet, 
  StatusBar, Platform, Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useUserData } from '../context/UserDataContext';
import { stories } from '../../data/stories';
import StoryCard from '../components/StoryCard';

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
  const { colors, typography, layout, isDark, lang, setLang, selectedCategories, toggleSelectedCategory, setSelectedCategories } = useTheme();
  const { isPremium, history } = useUserData();
  const [loading, setLoading] = useState(true);
  // Selected categories come from ThemeContext (multi-select)
  // Visible categories: Tümü + currently selected Turkish categories
  const visibleCategories = React.useMemo(() => {
    const base = ['Tümü', ...(selectedCategories || [])];
    return Array.from(new Set(base));
  }, [selectedCategories]);
  // Language strings
  const greeting = lang === 'en' ? 'Good morning' : 'Günaydın';
  const brandText = lang === 'en' ? 'Spark ✦' : 'Kıvılcım ✦';

  const categoriesLabel = lang === 'en' ? 'Categories' : 'Kategoriler';
  const todayLabel = lang === 'en' ? "Today's stories" : 'Bugünkü hikayeler';

  const checkIfRead = (id) => history.includes(id);

  useEffect(() => {
    // Simulate loading data for Skeleton UX
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);
  // Ensure the screen refreshes to reflect latest selectedCategories on focus
  const [refreshKey, setRefreshKey] = useState(0);
  useFocusEffect(
    React.useCallback(() => {
      setRefreshKey((k) => k + 1);
    }, [selectedCategories])
  );
  // (no extra) keep simple single source for visible categories
  
  // Bugünü al
  const todayStr = new Date('2026-03-16').toISOString().split('T')[0];

  // 1. Yayın tarihi geçmiş veya bugün olanları filtrele
  const publishedStories = stories.filter(s => s.publishDate <= todayStr);

  // 2. Kategori filtresi (multi-select: selectedCategories). If none selected, show all
  const categoryFiltered = selectedCategories && selectedCategories.length > 0
    ? publishedStories.filter((s) => selectedCategories.includes(s.cat))
    : publishedStories;

  // 3. Sıralama: Önce okunmayanlar, sonra okunanlar. Kendi içinde tarihe göre (yeni olan önce)
  const sortedStories = [...categoryFiltered].sort((a, b) => {
    const aRead = checkIfRead(a.id);
    const bRead = checkIfRead(b.id);
    
    if (aRead !== bRead) {
      return aRead ? 1 : -1; // Okunmayanlar (-1) önce gelir
    }
    
    // Aynı okuma durumundaysalar tarihe göre sırala (yeni olan önce)
    return b.publishDate.localeCompare(a.publishDate);
  });

  const free = isPremium ? sortedStories : sortedStories.slice(0, 2);
  const locked = isPremium ? [] : sortedStories.slice(2, 4);

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
              <Text style={styles.searchIcon}>🔍</Text>
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
            <Text style={styles.streakDays}>7 gün</Text>
            <Text style={styles.streakLabel}>Kesintisiz seri</Text>
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
                style={[styles.catPill, (cat === 'Tümü' && (selectedCategories == null || selectedCategories.length === 0)) || (cat !== 'Tümü' && selectedCategories?.includes(cat)) ? styles.catPillActive : null]}
                onPress={() => {
                  if (cat === 'Tümü') {
                    setSelectedCategories([]);
                  } else {
                    toggleSelectedCategory(cat);
                  }
                }}
              >
                <Text style={[styles.catPillText, (cat === 'Tümü' && (selectedCategories == null || selectedCategories.length === 0)) || (cat !== 'Tümü' && selectedCategories?.includes(cat)) ? styles.catPillTextActive : null]}>
                  {cat}
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
          ) : (
            <>
              {free.length > 0 && (
                <StoryCard 
                  story={free[0]} 
                  type="hero" 
                  isRead={checkIfRead(free[0].id)}
                  onPress={() => navigation.navigate('StoryDetail', { story: free[0] })} 
                />
              )}

              <View style={styles.storyGrid}>
                {free.slice(1).map(story => (
                  <StoryCard 
                    key={story.id} 
                    story={story} 
                    type="compact" 
                    isRead={checkIfRead(story.id)}
                    onPress={() => navigation.navigate('StoryDetail', { story })} 
                  />
                ))}
                {locked.map(story => (
                  <StoryCard 
                    key={story.id} 
                    story={story} 
                    type="compact" 
                    locked 
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

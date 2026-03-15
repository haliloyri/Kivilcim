import React, { useState, useEffect } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, StyleSheet, 
  StatusBar, Platform, Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useUserData } from '../context/UserDataContext';
import { stories } from '../../data/stories';
import StoryCard from '../components/StoryCard';

const SkeletonCard = ({ colors, isHero }) => (
  <View style={{
    width: isHero ? '100%' : (Dimensions.get('window').width - 48) / 2,
    height: isHero ? 200 : 160,
    backgroundColor: colors.backgroundDark,
    borderRadius: 12,
    marginBottom: 16,
    opacity: 0.5
  }} />
);

const HomeScreen = ({ navigation }) => {
  const { colors, typography, layout, isDark } = useTheme();
  const { isPremium, history } = useUserData();
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Tümü');

  const checkIfRead = (id) => history.includes(id);

  useEffect(() => {
    // Simulate loading data for Skeleton UX
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);
  const allCats = ['Tümü', 'Finans', 'Psikoloji', 'Tarih', 'Liderlik', 'Sağlık', 'Bilim', 'Felsefe', 'İş & Girişim'];
  
  const filtered = activeFilter === 'Tümü' ? stories : stories.filter(s => s.cat === activeFilter);
  const free = isPremium ? filtered : filtered.slice(0, 2);
  const locked = isPremium ? [] : filtered.slice(2, 4);

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
            <Text style={styles.greetSub}>Günaydın</Text>
            <Text style={styles.greetName}>Kıvılcım ✦</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={() => navigation.navigate('Search')}>
              <Text style={styles.searchIcon}>🔍</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('ProfileTab')} style={styles.avatar}>
              <Text style={styles.avatarText}>AY</Text>
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

        <Text style={[styles.sectionLabel, { paddingHorizontal: layout.padding.horizontal }]}>Kategoriler</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: layout.padding.horizontal }}>
            {allCats.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[styles.catPill, activeFilter === cat && styles.catPillActive]}
                onPress={() => setActiveFilter(cat)}
              >
                <Text style={[styles.catPillText, activeFilter === cat && styles.catPillTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <Text style={[styles.sectionLabel, { paddingHorizontal: layout.padding.horizontal }]}>Bugünkü hikayeler</Text>
        
        <View style={{ paddingHorizontal: layout.padding.horizontal }}>
          {loading ? (
            <>
              <SkeletonCard colors={colors} isHero />
              <View style={styles.storyGrid}>
                <SkeletonCard colors={colors} />
                <SkeletonCard colors={colors} />
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

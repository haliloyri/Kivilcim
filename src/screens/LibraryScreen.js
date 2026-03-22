import React from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, StyleSheet, 
  StatusBar, Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useUserData } from '../context/UserDataContext';
import { useStories } from '../context/StoriesContext';
import StoryCard from '../components/StoryCard';
import { t } from '../locales/i18n';

const LibraryScreen = ({ navigation }) => {
  const { colors, typography, layout, isDark, lang } = useTheme();
  const { favorites, history } = useUserData();
  const { stories } = useStories();

  const favoriteStories = [...new Map(
    favorites.map(id => {
      const s = (stories || []).find(st => st.story_id === String(id));
      return s ? [s.story_id, s] : null;
    }).filter(Boolean)
  ).values()];

  const historyStories = [...new Map(
    history.map(id => {
      const s = (stories || []).find(st => st.story_id === String(id));
      return s ? [s.story_id, s] : null;
    }).filter(Boolean)
  ).values()];

  const styles = StyleSheet.create({
    safe: { 
      flex: 1, 
      backgroundColor: colors.background, 
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 
    },
    header: { 
      paddingHorizontal: layout.padding.horizontal, 
      paddingVertical: 16 
    },
    title: { 
      fontFamily: 'PlayfairDisplay_700Bold', 
      fontSize: typography.sizes.headingSmall, 
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
      fontFamily: 'DMSans_500Medium', 
      fontSize: typography.sizes.badge, 
      color: colors.textSecondary, 
      letterSpacing: typography.spacing.badgeLetterSpacing, 
      textTransform: 'uppercase' 
    },
    emptyState: {
      padding: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyText: {
      fontFamily: 'DMSans_400Regular',
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 8,
    },
  });

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('libraryTitle', lang)}</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>{t('favStories', lang)}</Text>
        </View>

        <View style={{ paddingHorizontal: layout.padding.horizontal }}>
          {favoriteStories.length > 0 ? (
            favoriteStories.map(story => (
              <StoryCard
                key={story.story_id}
                story={story}
                isRead={false}
                onPress={() => navigation.navigate('StoryDetail', { story })}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={{ fontSize: 32 }}>🤍</Text>
              <Text style={styles.emptyText}>{t('noFavs', lang)}</Text>
            </View>
          )}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>{t('recentRead', lang)}</Text>
        </View>

        <View style={{ paddingHorizontal: layout.padding.horizontal }}>
          {historyStories.map(story => (
            <StoryCard
              key={`hist-${story.story_id}`}
              story={story}
              isRead={false}
              onPress={() => navigation.navigate('StoryDetail', { story })}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LibraryScreen;

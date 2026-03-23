import React from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, StyleSheet, 
  StatusBar, Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useUserData } from '../context/UserDataContext';
import { useStories } from '../context/StoriesContext';
import { getCatIcon } from '../components/StoryCard';
import { t } from '../locales/i18n';

// A deterministic pastel gradient generator based on ID
const getGradientColors = (idStr) => {
  const sum = String(idStr).split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const palettes = [
    ['#F1ECE0', '#DED3C4'],
    ['#EAE6E1', '#D4CCC5'],
    ['#F0E5DE', '#E3D2C8'],
    ['#EAECE1', '#CCD1C2'],
  ];
  return palettes[sum % palettes.length];
};

const FavoriteCard = ({ story, onPress, colors, typography, layout, lang }) => {
  const displayTitle = story.title || '';
  const displayCat = t(story.cat_display || story.cat, lang);
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={{ width: 154, marginRight: 12 }}>
      <View style={{
        backgroundColor: colors.backgroundLowest || '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: 'hidden',
        height: 200,
        justifyContent: 'space-between',
        paddingBottom: 16
      }}>
        {/* Mock Image Area */}
        <LinearGradient 
          colors={getGradientColors(story.story_id)} 
          style={{ height: 110, padding: 8 }}
          start={{x: 0, y: 0}} end={{x: 1, y: 1}}
        >
          {/* Glass pill */}
          <View style={{
            backgroundColor: 'rgba(255,255,255,0.6)',
            alignSelf: 'flex-start',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 6,
          }}>
            <Text style={{
              fontFamily: 'Inter_500Medium',
              fontSize: 10,
              color: '#333',
            }} numberOfLines={1}>{displayCat.replace(/\s+/g, '')}</Text>
          </View>
        </LinearGradient>

        <View style={{ paddingHorizontal: 12, flex: 1, justifyContent: 'space-between' }}>
          <Text style={{
            fontFamily: 'PlayfairDisplay_600SemiBold',
            fontSize: 16,
            color: colors.text,
            lineHeight: 20,
            marginTop: 10
          }} numberOfLines={2}>
            {displayTitle}
          </Text>
          <Text style={{
            fontFamily: 'Inter_400Regular',
            fontSize: 11,
            color: colors.textSecondary,
            alignSelf: 'flex-end',
          }}>
            {story.min} {t('minLabel', lang)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const HistoryCard = ({ story, onPress, colors, typography, layout, lang }) => {
  const displayTitle = story.title || '';
  const displayCat = t(story.cat_display || story.cat, lang);
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={{
      backgroundColor: colors.backgroundLowest || '#FFFFFF',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <View style={{ flex: 1, paddingRight: 16 }}>
        <View style={{
          backgroundColor: '#F2EFE8',
          alignSelf: 'flex-start',
          paddingHorizontal: 6,
          paddingVertical: 2,
          borderRadius: 4,
          marginBottom: 6,
        }}>
          <Text style={{
            fontFamily: 'Inter_500Medium',
            fontSize: 9,
            color: '#594238',
            letterSpacing: 0.5,
            textTransform: 'uppercase'
          }} numberOfLines={1}>{displayCat}</Text>
        </View>
        <Text style={{
          fontFamily: 'PlayfairDisplay_600SemiBold',
          fontSize: 18,
          color: colors.text,
          lineHeight: 24,
        }}>
          {displayTitle}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Text style={{
          fontFamily: 'Inter_400Regular',
          fontSize: 11,
          color: colors.textSecondary,
        }}>
          {story.min} {t('minLabel', lang)}
        </Text>
        <Ionicons name="arrow-forward" size={16} color={colors.text} />
      </View>
    </TouchableOpacity>
  );
};

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
      paddingTop: 32,
      paddingBottom: 16 
    },
    title: { 
      fontFamily: 'PlayfairDisplay_600SemiBold', 
      fontSize: 36, 
      color: colors.text 
    },
    sectionHeader: {
      paddingHorizontal: layout.padding.horizontal,
      marginTop: 24,
      marginBottom: 12,
    },
    sectionLabel: { 
      fontFamily: 'Inter_500Medium', 
      fontSize: 11, 
      color: '#1A1A1A', 
      letterSpacing: 1, 
      textTransform: 'uppercase' 
    },
    emptyState: {
      padding: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyText: {
      fontFamily: 'Inter_400Regular',
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

        <View>
          {favoriteStories.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: layout.padding.horizontal }}>
              {favoriteStories.map(story => (
                <FavoriteCard
                  key={story.story_id}
                  story={story}
                  onPress={() => navigation.navigate('StoryDetail', { story })}
                  colors={colors}
                  typography={typography}
                  layout={layout}
                  lang={lang}
                />
              ))}
            </ScrollView>
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
          {historyStories.length > 0 ? historyStories.map(story => (
            <HistoryCard
              key={`hist-${story.story_id}`}
              story={story}
              onPress={() => navigation.navigate('StoryDetail', { story })}
              colors={colors}
              typography={typography}
              layout={layout}
              lang={lang}
            />
          )) : (
            <View style={[styles.emptyState, { paddingTop: 20 }]}>
              <Text style={styles.emptyText}>{t('noHistory', lang) || "Henüz hiç okuma yapmadınız."}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LibraryScreen;

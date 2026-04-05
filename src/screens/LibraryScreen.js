import React from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, StyleSheet, 
  StatusBar, Platform, Image 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useUserData } from '../context/UserDataContext';
import { useStories } from '../context/StoriesContext';
import { getCatIcon } from '../components/StoryCard';
import { t } from '../locales/i18n';
import { getCategoryImage } from '../utils/categoryImages';

const FavoriteCard = ({ story, onPress, colors, typography, layout, lang }) => {
  const displayTitle = story.title || '';
  const rawDisplayCat = t(story.cat_display || story.cat, lang) || '';
  const displayCat = rawDisplayCat ? rawDisplayCat.charAt(0).toUpperCase() + rawDisplayCat.slice(1).toLocaleLowerCase('tr-TR') : '';
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={{ width: 154, marginRight: 12 }}>
      <View style={{
        backgroundColor: colors.backgroundDark,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: 'hidden',
        height: 200,
        justifyContent: 'space-between',
        paddingBottom: 16
      }}>
        {/* Category Image Area */}
        <View style={{ height: 110, position: 'relative' }}>
          {(() => {
            const catImg = getCategoryImage(story.parent_cat || story.cat);
            return (
              <>
                <Image 
                  source={catImg.source} 
                  style={{ 
                    width: '100%', 
                    height: '100%',
                    transform: [
                      { rotate: catImg.rotate },
                      { scaleX: catImg.flip ? -1 : 1 }
                    ]
                  }}
                  resizeMode="cover"
                />
                <View style={[StyleSheet.absoluteFill, { backgroundColor: catImg.tint, opacity: 0.15 }]} />
              </>
            );
          })()}
          {/* Glass pill */}
          <View style={{
            position: 'absolute',
            top: 8,
            left: 8,
            backgroundColor: 'rgba(255,255,255,0.75)',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 6,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
          }}>
            <Ionicons name={getCatIcon(story.cat)} size={10} color="#594238" />
            <Text style={{
              fontFamily: 'Inter_500Medium',
              fontSize: 10,
              color: '#594238',
            }} numberOfLines={1}>{displayCat}</Text>
          </View>
        </View>

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
            <Ionicons name="time-outline" size={10} color={colors.textSecondary} /> {story.min} {t('minLabel', lang)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const HistoryCard = ({ story, onPress, colors, typography, layout, lang }) => {
  const displayTitle = story.title || '';
  const rawDisplayCat = t(story.cat_display || story.cat, lang) || '';
  const displayCat = rawDisplayCat ? rawDisplayCat.charAt(0).toUpperCase() + rawDisplayCat.slice(1).toLocaleLowerCase('tr-TR') : '';
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={{
      backgroundColor: colors.backgroundDark,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 12,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
    }}>
      {/* Category Thumbnail */}
      <View style={{ width: 60, height: 60, borderRadius: 8, overflow: 'hidden', marginRight: 16 }}>
        {(() => {
          const catImg = getCategoryImage(story.parent_cat || story.cat);
          return (
            <>
              <Image 
                source={catImg.source} 
                style={{ 
                  width: '100%', 
                  height: '100%',
                  transform: [
                    { rotate: catImg.rotate },
                    { scaleX: catImg.flip ? -1 : 1 }
                  ]
                }}
                resizeMode="cover"
              />
              <View style={[StyleSheet.absoluteFill, { backgroundColor: catImg.tint, opacity: 0.1 }]} />
            </>
          );
        })()}
      </View>

      <View style={{ flex: 1, paddingRight: 8 }}>
        <View style={{
          backgroundColor: colors.background,
          alignSelf: 'flex-start',
          paddingHorizontal: 6,
          paddingVertical: 2,
          borderRadius: 4,
          marginBottom: 6,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
        }}>
          <Ionicons name={getCatIcon(story.cat)} size={10} color={colors.textSecondary} />
          <Text style={{
            fontFamily: 'Inter_500Medium',
            fontSize: 9,
            color: colors.textSecondary,
            letterSpacing: 0.5,
            textTransform: 'none'
          }} numberOfLines={1}>{displayCat}</Text>
        </View>
        <Text style={{
          fontFamily: 'PlayfairDisplay_600SemiBold',
          fontSize: 16,
          color: colors.text,
          lineHeight: 22,
        }} numberOfLines={2}>
          {displayTitle}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Text style={{
          fontFamily: 'Inter_400Regular',
          fontSize: 10,
          color: colors.textSecondary,
        }}>
          <Ionicons name="time-outline" size={10} color={colors.textSecondary} /> {story.min} {t('minLabel', lang)}
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
      backgroundColor: colors.background
    },
    header: { 
      paddingHorizontal: layout.padding.horizontal, 
      paddingTop: 32,
      paddingBottom: 16 
    },
    title: { 
      fontFamily: 'PlayfairDisplay_700Bold', 
      fontSize: 32, 
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
      color: colors.textSecondary, 
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
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safe}>
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

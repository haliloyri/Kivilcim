import React, { useCallback, useMemo, useState } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, StyleSheet, 
  StatusBar, Platform, Image 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useUserData } from '../context/UserDataContext';
import { useStories } from '../context/StoriesContext';
import { t } from '../locales/i18n';
import { getCategoryImage } from '../utils/categoryImages';

const FavoriteCard = ({ story, onPress, colors, typography, layout, isDark, lang, journeyLine, badgeChip, onBadgePress }) => {
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
        position: 'relative',
        overflow: 'hidden',
        height: 200,
        justifyContent: 'space-between',
        paddingBottom: 16
      }}>
        <View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, { backgroundColor: isDark ? 'transparent' : colors.overlaySoft }]}
        />
        {/* Category Image Area */}
        <View style={{ height: 110, position: 'relative' }}>
          {(() => {
            const catImg = getCategoryImage(story.parent_cat_raw || story.parent_cat || story.cat);
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
          }}>
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
            fontSize: 10,
            color: colors.textSecondary,
            marginTop: 6,
          }} numberOfLines={2}>
            {journeyLine}
          </Text>

          {badgeChip ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onBadgePress}
              style={{
                marginTop: 8,
                alignSelf: 'flex-start',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 8,
                backgroundColor: colors.primary + '20',
                borderWidth: 1,
                borderColor: colors.primary + '55',
              }}
            >
              <Text style={{
                fontFamily: 'Inter_500Medium',
                fontSize: 10,
                color: colors.primary,
              }} numberOfLines={1}>
                {`+ ${badgeChip.icon} ${t(badgeChip.titleKey, lang) || t('libraryBadgeNew', lang)}`}
              </Text>
            </TouchableOpacity>
          ) : null}

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

const HistoryCard = ({ story, onPress, colors, typography, layout, isDark, lang, journeyLine, badgeChip, onBadgePress }) => {
  const displayTitle = story.title || '';
  const rawDisplayCat = t(story.cat_display || story.cat, lang) || '';
  const displayCat = rawDisplayCat ? rawDisplayCat.charAt(0).toUpperCase() + rawDisplayCat.slice(1).toLocaleLowerCase('tr-TR') : '';
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={{
      backgroundColor: colors.backgroundDark,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      position: 'relative',
      overflow: 'hidden',
      padding: 12,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
    }}>
      <View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { backgroundColor: isDark ? 'transparent' : colors.overlaySoft }]}
      />
      {/* Category Thumbnail */}
      <View style={{ width: 60, height: 60, borderRadius: 8, overflow: 'hidden', marginRight: 16 }}>
        {(() => {
          const catImg = getCategoryImage(story.parent_cat_raw || story.parent_cat || story.cat);
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
        }}>
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
        <Text style={{
          fontFamily: 'Inter_400Regular',
          fontSize: 11,
          color: colors.textSecondary,
          marginTop: 6,
        }} numberOfLines={1}>
          {journeyLine}
        </Text>
        {badgeChip ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onBadgePress}
            style={{
              marginTop: 8,
              alignSelf: 'flex-start',
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 8,
              backgroundColor: colors.primary + '20',
              borderWidth: 1,
              borderColor: colors.primary + '55',
            }}
          >
            <Text style={{
              fontFamily: 'Inter_500Medium',
              fontSize: 10,
              color: colors.primary,
            }} numberOfLines={1}>
              {`+ ${badgeChip.icon} ${t(badgeChip.titleKey, lang) || t('libraryBadgeNew', lang)}`}
            </Text>
          </TouchableOpacity>
        ) : null}
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
  const {
    favorites,
    history,
    readCountsByStory,
    earnedBadges,
    openBadgeModal,
    isStoryInFavoriteCollection,
    toggleStoryInFavoriteCollection,
    isPremium,
    variantUsage,
  } = useUserData();
  const { stories } = useStories();
  const [sortBy, setSortBy] = useState('recent');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeCollection, setActiveCollection] = useState('all');

  const favoriteStoriesRaw = [...new Map(
    favorites.map(id => {
      const s = (stories || []).find(st => st.story_id === String(id));
      return s ? [s.story_id, s] : null;
    }).filter(Boolean)
  ).values()];

  const historyStoriesRaw = [...new Map(
    history.map(id => {
      const s = (stories || []).find(st => st.story_id === String(id));
      return s ? [s.story_id, s] : null;
    }).filter(Boolean)
  ).values()];

  const historyIndexMap = useMemo(() => {
    return history.reduce((acc, id, idx) => {
      acc[String(id)] = idx;
      return acc;
    }, {});
  }, [history]);

  const earnedBadgeById = useMemo(() => {
    return (earnedBadges || [])
      .filter((badge) => badge.earned)
      .reduce((acc, badge) => {
        acc[badge.id] = badge;
        return acc;
      }, {});
  }, [earnedBadges]);

  const getBadgeForStory = useCallback((story) => {
    if (!story) return null;
    const categoryRaw = String(story.parent_cat_raw || story.parent_cat || story.cat || '').toLocaleLowerCase('tr-TR');

    if ((categoryRaw.includes('felsefe') || categoryRaw.includes('philosophy')) && earnedBadgeById.philosopher) {
      return earnedBadgeById.philosopher;
    }

    const masteryPriority = ['cat_master_100', 'cat_master_50', 'cat_master_25', 'cat_master_10', 'cat_master_5'];
    for (const id of masteryPriority) {
      if (earnedBadgeById[id]) return earnedBadgeById[id];
    }

    return null;
  }, [earnedBadgeById]);

  const getStoryJourneyMeta = useCallback((story) => {
    const storyId = String(story.story_id);
    const readCount = Number(readCountsByStory?.[storyId] || 0);
    const step = Math.max(1, readCount + 1);
    const progressPct = Math.min(100, readCount * 25);
    const badgeChip = getBadgeForStory(story);

    const chapterText = t('libraryJourneyChapter', lang).replace('{{step}}', String(step));
    const progressText = t('libraryJourneyProgress', lang).replace('{{pct}}', String(progressPct));
    const badgeText = badgeChip ? t('libraryJourneyBadgeReady', lang) : t('libraryJourneyBadgeSoon', lang);

    const journeyLine = t('libraryJourneyLine', lang)
      .replace('{{chapter}}', chapterText)
      .replace('{{progress}}', progressText)
      .replace('{{badge}}', badgeText);

    return {
      journeyLine,
      badgeChip,
    };
  }, [getBadgeForStory, lang, readCountsByStory]);

  const categoryOptions = useMemo(() => {
    const map = new Map();
    [...favoriteStoriesRaw, ...historyStoriesRaw].forEach((story) => {
      const catId = Number(story.parent_cat_id);
      if (!catId) return;
      if (!map.has(catId)) {
        map.set(catId, {
          id: catId,
          label: String(story.parent_cat || story.cat || ''),
        });
      }
    });
    return [{ id: 'all', label: t('libraryFilterAll', lang) }, ...Array.from(map.values())];
  }, [favoriteStoriesRaw, historyStoriesRaw, lang]);

  const applyCategoryFilter = (list) => {
    if (activeCategory === 'all') return list;
    return list.filter((story) => Number(story.parent_cat_id) === Number(activeCategory));
  };

  const applySort = (list) => {
    if (sortBy === 'most_read') {
      return list.slice().sort((a, b) => {
        const readA = readCountsByStory?.[String(a.story_id)] || 0;
        const readB = readCountsByStory?.[String(b.story_id)] || 0;
        if (readA !== readB) return readB - readA;
        return Number(b.story_id) - Number(a.story_id);
      });
    }

    return list.slice().sort((a, b) => {
      const idxA = historyIndexMap[String(a.story_id)] ?? Number.MAX_SAFE_INTEGER;
      const idxB = historyIndexMap[String(b.story_id)] ?? Number.MAX_SAFE_INTEGER;
      if (idxA !== idxB) return idxA - idxB;
      return Number(b.story_id) - Number(a.story_id);
    });
  };

  const favoriteStories = useMemo(() => {
    const collectionFiltered = activeCollection === 'saved_for_later'
      ? favoriteStoriesRaw.filter((story) => isStoryInFavoriteCollection(story.story_id, 'saved_for_later'))
      : favoriteStoriesRaw;
    return applySort(applyCategoryFilter(collectionFiltered));
  }, [favoriteStoriesRaw, activeCollection, sortBy, activeCategory, readCountsByStory, historyIndexMap]);

  const historyStories = useMemo(() => {
    return applySort(applyCategoryFilter(historyStoriesRaw));
  }, [historyStoriesRaw, sortBy, activeCategory, readCountsByStory, historyIndexMap]);

  // "Son kullandıkların" — unique stories from variant usage (premium only)
  const recentlyUsedStories = useMemo(() => {
    if (!isPremium || !variantUsage || variantUsage.length === 0) return [];
    const seen = new Set();
    const result = [];
    for (const entry of variantUsage) {
      if (seen.has(entry.storyId)) continue;
      seen.add(entry.storyId);
      const s = (stories || []).find(st => String(st.story_id) === entry.storyId);
      if (s) result.push({ ...s, _lastUsedAt: entry.usedAt, _lastAction: entry.action, _lastVariantType: entry.variantType });
      if (result.length >= 20) break;
    }
    return result;
  }, [isPremium, variantUsage, stories]);

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
    controlWrap: {
      paddingHorizontal: layout.padding.horizontal,
      gap: 10,
      marginTop: 4,
    },
    chipRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    chip: {
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.backgroundDark,
      borderRadius: 18,
      paddingVertical: 7,
      paddingHorizontal: 12,
    },
    chipActive: {
      backgroundColor: isDark ? '#3A3020' : '#E6DEC8',
      borderColor: isDark ? '#6A5540' : '#E6DEC8',
    },
    chipText: {
      fontFamily: 'Inter_500Medium',
      fontSize: 12,
      color: colors.text,
    },
    subLabel: {
      fontFamily: 'Inter_500Medium',
      fontSize: 10,
      color: colors.textSecondary,
      letterSpacing: 1,
      textTransform: 'uppercase',
      marginBottom: 6,
    },
    collectionBtn: {
      marginTop: 10,
      alignSelf: 'flex-start',
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 5,
      backgroundColor: colors.background,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    collectionBtnText: {
      fontFamily: 'Inter_500Medium',
      fontSize: 11,
      color: colors.textSecondary,
    },
  });

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safe}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('libraryTitle', lang)}</Text>
        </View>

        <View style={styles.controlWrap}>
          <View>
            <Text style={styles.subLabel}>{t('librarySortLabel', lang)}</Text>
            <View style={styles.chipRow}>
              {[
                { id: 'recent', label: t('librarySortRecent', lang) },
                { id: 'most_read', label: t('librarySortMostRead', lang) },
              ].map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.chip, sortBy === item.id && styles.chipActive]}
                  onPress={() => setSortBy(item.id)}
                >
                  <Text style={styles.chipText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View>
            <Text style={styles.subLabel}>{t('libraryFilterCategory', lang)}</Text>
            <View style={styles.chipRow}>
              {categoryOptions.map((cat) => (
                <TouchableOpacity
                  key={String(cat.id)}
                  style={[styles.chip, activeCategory === cat.id && styles.chipActive]}
                  onPress={() => setActiveCategory(cat.id)}
                >
                  <Text style={styles.chipText}>{cat.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View>
            <Text style={styles.subLabel}>{t('libraryCollectionsLabel', lang)}</Text>
            <View style={styles.chipRow}>
              {[
                { id: 'all', label: t('libraryCollectionAll', lang) },
                { id: 'saved_for_later', label: t('libraryCollectionSavedForLater', lang) },
              ].map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.chip, activeCollection === item.id && styles.chipActive]}
                  onPress={() => setActiveCollection(item.id)}
                >
                  <Text style={styles.chipText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>{t('favStories', lang)}</Text>
        </View>

        <View>
          {favoriteStories.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: layout.padding.horizontal }}>
              {favoriteStories.map(story => (
                <View key={story.story_id}>
                  {(() => {
                    const meta = getStoryJourneyMeta(story);
                    return (
                  <FavoriteCard
                    story={story}
                    onPress={() => navigation.navigate('StoryDetail', { story })}
                    colors={colors}
                    typography={typography}
                    layout={layout}
                    isDark={isDark}
                    lang={lang}
                    journeyLine={meta.journeyLine}
                    badgeChip={meta.badgeChip}
                    onBadgePress={() => meta.badgeChip && openBadgeModal(meta.badgeChip)}
                  />
                    );
                  })()}
                  <TouchableOpacity
                    style={styles.collectionBtn}
                    onPress={() => toggleStoryInFavoriteCollection(story.story_id, 'saved_for_later')}
                  >
                    <Ionicons
                      name={isStoryInFavoriteCollection(story.story_id, 'saved_for_later') ? 'bookmark' : 'bookmark-outline'}
                      size={12}
                      color={colors.textSecondary}
                    />
                    <Text style={styles.collectionBtnText}>{t('libraryCollectionSavedForLater', lang)}</Text>
                  </TouchableOpacity>
                </View>
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

        {/* ── Recently Used Variants (Premium) ─────────────────────────── */}
        {isPremium && recentlyUsedStories.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>
                <Ionicons name="chatbubbles-outline" size={12} color={colors.textSecondary} />
                {'  '}{t('libraryRecentlyUsed', lang)}
              </Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: layout.padding.horizontal }}>
              {recentlyUsedStories.map(story => (
                <TouchableOpacity
                  key={`used-${story.story_id}`}
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate('UseInConversation', { story })}
                  style={{
                    width: 160,
                    marginRight: 12,
                    backgroundColor: isDark ? colors.backgroundDark : '#FFFFFF',
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: colors.border,
                    padding: 14,
                    justifyContent: 'space-between',
                  }}
                >
                  <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                      <Ionicons
                        name={story._lastAction === 'share' ? 'share-social-outline' : 'copy-outline'}
                        size={12}
                        color={colors.primary}
                      />
                      <Text style={{
                        fontFamily: 'Inter_500Medium',
                        fontSize: 10,
                        color: colors.primary,
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                      }}>
                        {story._lastAction === 'share' ? t('libraryUsedShared', lang) : t('libraryUsedCopied', lang)}
                      </Text>
                    </View>
                    <Text style={{
                      fontFamily: 'PlayfairDisplay_600SemiBold',
                      fontSize: 14,
                      color: colors.text,
                      lineHeight: 20,
                    }} numberOfLines={3}>
                      {story.title}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 10 }}>
                    <Ionicons name="chatbubbles" size={10} color={colors.textSecondary} />
                    <Text style={{
                      fontFamily: 'Inter_400Regular',
                      fontSize: 10,
                      color: colors.textSecondary,
                    }}>
                      {t('mv_use_in_convo', lang).replace(/💬\s*/, '')}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

        <View style={{ paddingHorizontal: layout.padding.horizontal }}>
          {historyStories.length > 0 ? historyStories.map(story => (
            (() => {
              const meta = getStoryJourneyMeta(story);
              return (
                <HistoryCard
                  key={`hist-${story.story_id}`}
                  story={story}
                  onPress={() => navigation.navigate('StoryDetail', { story })}
                  colors={colors}
                  typography={typography}
                  layout={layout}
                  isDark={isDark}
                  lang={lang}
                  journeyLine={meta.journeyLine}
                  badgeChip={meta.badgeChip}
                  onBadgePress={() => meta.badgeChip && openBadgeModal(meta.badgeChip)}
                />
              );
            })()
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

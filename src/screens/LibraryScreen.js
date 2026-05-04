import React, { useMemo, useState } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  StatusBar, Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useUserData } from '../context/UserDataContext';
import { useStories } from '../context/StoriesContext';
import { t } from '../locales/i18n';
import StoryRowCard from '../components/StoryRowCard';

const LibraryScreen = ({ navigation }) => {
  const { colors, layout, isDark, lang } = useTheme();
  const {
    favorites,
    history,
    readCountsByStory,
    isPremium,
    variantUsage,
  } = useUserData();
  const { stories } = useStories();
  const [sortBy, setSortBy] = useState('recent');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeCollection, setActiveCollection] = useState('read');
  const [sortModalVisible, setSortModalVisible] = useState(false);

  const safeFavorites = Array.isArray(favorites) ? favorites : [];
  const safeHistory = Array.isArray(history) ? history : [];
  const safeVariantUsage = Array.isArray(variantUsage) ? variantUsage : [];

  const favoriteStoriesRaw = [...new Map(
    safeFavorites.map(id => {
      const s = (stories || []).find(st => st.story_id === String(id));
      return s ? [s.story_id, s] : null;
    }).filter(Boolean)
  ).values()];

  const historyStoriesRaw = [...new Map(
    safeHistory.map(id => {
      const s = (stories || []).find(st => st.story_id === String(id));
      return s ? [s.story_id, s] : null;
    }).filter(Boolean)
  ).values()];

  const historyIndexMap = useMemo(
    () => safeHistory.reduce((acc, id, idx) => {
      acc[String(id)] = idx;
      return acc;
    }, {}),
    [safeHistory]
  );

  const favoriteOrderMap = useMemo(
    () => safeFavorites.reduce((acc, id, idx) => {
      acc[String(id)] = idx;
      return acc;
    }, {}),
    [safeFavorites]
  );

  const recentlyUsedStories = useMemo(() => {
    if (!isPremium || safeVariantUsage.length === 0) return [];
    const seen = new Set();
    const result = [];
    for (let idx = 0; idx < safeVariantUsage.length; idx += 1) {
      const entry = safeVariantUsage[idx];
      if (!entry || typeof entry !== 'object') continue;

      const entryStoryId = String(entry.storyId || '').trim();
      if (!entryStoryId) continue;
      if (seen.has(entryStoryId)) continue;

      seen.add(entryStoryId);
      const s = (stories || []).find(st => String(st.story_id) === entryStoryId);
      if (s) {
        result.push({
          ...s,
          _usageOrder: idx,
        });
      }
      if (result.length >= 20) break;
    }
    return result;
  }, [isPremium, safeVariantUsage, stories]);

  const categoryOptions = useMemo(() => {
    const map = new Map();
    [...favoriteStoriesRaw, ...historyStoriesRaw, ...recentlyUsedStories].forEach((story) => {
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
  }, [favoriteStoriesRaw, historyStoriesRaw, recentlyUsedStories, lang]);

  const applyCategoryFilter = (list) => {
    if (!Array.isArray(list)) return [];
    if (activeCategory === 'all') return list;
    return list.filter((story) => Number(story.parent_cat_id) === Number(activeCategory));
  };

  const applySort = (list, collectionType) => {
    if (!Array.isArray(list)) return [];
    if (sortBy === 'most_read') {
      return list.slice().sort((a, b) => {
        const readA = readCountsByStory?.[String(a.story_id)] || 0;
        const readB = readCountsByStory?.[String(b.story_id)] || 0;
        if (readA !== readB) return readB - readA;
        return Number(b.story_id) - Number(a.story_id);
      });
    }

    if (collectionType === 'favorites') {
      return list.slice().sort((a, b) => {
        const idxA = favoriteOrderMap[String(a.story_id)] ?? Number.MIN_SAFE_INTEGER;
        const idxB = favoriteOrderMap[String(b.story_id)] ?? Number.MIN_SAFE_INTEGER;
        if (idxA !== idxB) return idxB - idxA;
        return Number(b.story_id) - Number(a.story_id);
      });
    }

    if (collectionType === 'used') {
      return list.slice().sort((a, b) => {
        const idxA = a._usageOrder ?? Number.MAX_SAFE_INTEGER;
        const idxB = b._usageOrder ?? Number.MAX_SAFE_INTEGER;
        if (idxA !== idxB) return idxA - idxB;
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

  const collectionItems = useMemo(() => [
    { id: 'read', label: t('libraryCollectionRead', lang), title: t('recentRead', lang) },
    { id: 'favorites', label: t('libraryCollectionFavorites', lang), title: t('favStories', lang) },
    { id: 'used', label: t('libraryCollectionUsed', lang), title: t('libraryRecentlyUsed', lang) },
  ], [lang]);

  const baseCollectionStories = useMemo(() => {
    if (activeCollection === 'favorites') return favoriteStoriesRaw;
    if (activeCollection === 'used') return recentlyUsedStories;
    return historyStoriesRaw;
  }, [activeCollection, favoriteStoriesRaw, historyStoriesRaw, recentlyUsedStories]);

  const collectionStories = useMemo(
    () => applySort(applyCategoryFilter(baseCollectionStories), activeCollection),
    [baseCollectionStories, activeCategory, sortBy, historyIndexMap, favoriteOrderMap, readCountsByStory, activeCollection]
  );

  const dynamicTitle = useMemo(() => {
    const active = collectionItems.find((item) => item.id === activeCollection);
    return active?.title || t('recentRead', lang);
  }, [collectionItems, activeCollection, lang]);

  const emptyText = useMemo(() => {
    if (activeCollection === 'favorites') return t('noFavs', lang);
    if (activeCollection === 'used') return t('libraryNoUsedStories', lang);
    return t('noHistory', lang);
  }, [activeCollection, lang]);

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
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    sectionLabel: { 
      fontFamily: 'Inter_500Medium', 
      fontSize: 13,
      color: colors.text,
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
      gap: 14,
      marginTop: 4,
    },
    controlLine: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    controlLabel: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 13,
      color: colors.text,
      minWidth: 96,
    },
    chipRow: {
      flexDirection: 'row',
      gap: 8,
      paddingRight: 8,
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
    sortBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 14,
      paddingHorizontal: 10,
      paddingVertical: 7,
      backgroundColor: colors.backgroundDark,
    },
    sortBtnText: {
      fontFamily: 'Inter_500Medium',
      fontSize: 12,
      color: colors.textSecondary,
    },
    listWrap: {
      paddingHorizontal: layout.padding.horizontal,
      gap: 12,
    },
    sortOverlay: {
      flex: 1,
      backgroundColor: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(20,15,10,0.28)',
      justifyContent: 'flex-end',
    },
    sortSheet: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingHorizontal: 18,
      paddingTop: 16,
      paddingBottom: 24,
      borderTopWidth: 1,
      borderColor: colors.border,
    },
    sortTitle: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: 20,
      color: colors.text,
      marginBottom: 10,
    },
    sortOption: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderColor: colors.border,
    },
    sortOptionText: {
      fontFamily: 'Inter_500Medium',
      fontSize: 14,
      color: colors.text,
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
          <View style={styles.controlLine}>
            <Text style={styles.controlLabel}>{`${t('libraryCategoriesLabel', lang)}:`}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
              {categoryOptions.map((cat) => (
                <TouchableOpacity
                  key={String(cat.id)}
                  style={[styles.chip, activeCategory === cat.id && styles.chipActive]}
                  onPress={() => setActiveCategory(cat.id)}
                >
                  <Text style={styles.chipText}>{cat.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.controlLine}>
            <Text style={styles.controlLabel}>{`${t('libraryMyCollectionLabel', lang)}:`}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
              {collectionItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.chip, activeCollection === item.id && styles.chipActive]}
                  onPress={() => setActiveCollection(item.id)}
                >
                  <Text style={styles.chipText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>{dynamicTitle}</Text>
          <TouchableOpacity style={styles.sortBtn} onPress={() => setSortModalVisible(true)}>
            <Ionicons name="swap-vertical-outline" size={15} color={colors.textSecondary} />
            <Text style={styles.sortBtnText}>{t('librarySortAction', lang)}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listWrap}>
          {collectionStories.length > 0 ? collectionStories.map(story => (
            <StoryRowCard
              key={`${activeCollection}-${story.story_id}`}
              story={story}
              isRead={(readCountsByStory?.[String(story.story_id)] || 0) > 0}
              onPress={() => navigation.navigate('StoryDetail', { story })}
              onUseInConversation={() => navigation.navigate('UseInConversation', { story })}
            />
          )) : (
            <View style={[styles.emptyState, { paddingTop: 20 }]}>
              <Text style={styles.emptyText}>{emptyText}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <Modal
        transparent
        animationType="fade"
        visible={sortModalVisible}
        onRequestClose={() => setSortModalVisible(false)}
      >
        <TouchableOpacity activeOpacity={1} style={styles.sortOverlay} onPress={() => setSortModalVisible(false)}>
          <TouchableOpacity activeOpacity={1} style={styles.sortSheet} onPress={() => {}}>
            <Text style={styles.sortTitle}>{t('librarySortLabel', lang)}</Text>

            {[
              { id: 'recent', label: t('librarySortAddedOrder', lang) },
              { id: 'most_read', label: t('librarySortMostRead', lang) },
            ].map((opt) => (
              <TouchableOpacity
                key={opt.id}
                style={styles.sortOption}
                onPress={() => {
                  setSortBy(opt.id);
                  setSortModalVisible(false);
                }}
              >
                <Text style={styles.sortOptionText}>{opt.label}</Text>
                {sortBy === opt.id ? (
                  <Ionicons name="checkmark" size={20} color={colors.primary} />
                ) : null}
              </TouchableOpacity>
            ))}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default LibraryScreen;

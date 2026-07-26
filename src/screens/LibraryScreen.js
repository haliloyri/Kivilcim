import React, { useMemo, useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  StatusBar, Modal, TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { useUserData } from '../context/UserDataContext';
import { useStories } from '../context/StoriesContext';
import { t } from '../locales/i18n';
import StoryCard from '../components/StoryCard';
import CategoryPill from '../components/CategoryPill';

const normalizeSearchValue = (value = '') =>
  String(value || '').toLocaleLowerCase('tr-TR').trim();

const storyMatchesSearch = (story, query) => {
  const normalizedQuery = normalizeSearchValue(query);
  if (!normalizedQuery) return true;

  const searchable = [
    story?.title,
    story?.body,
    story?.quote,
    story?.lesson,
    story?.source_book,
    story?.cat,
    story?.cat_display,
    story?.parent_cat,
    story?.parent_cat_raw,
  ].map(normalizeSearchValue).join(' ');

  return searchable.includes(normalizedQuery);
};

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
  const [searchQuery, setSearchQuery] = useState('');
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [recordedStoryIds, setRecordedStoryIds] = useState(new Set());

  // Ses kaydı olan hikayeleri AsyncStorage'dan yükle
  useEffect(() => {
    const loadRecordedIds = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const recordingKeys = keys.filter(k => k.startsWith('story_audio_list_') || (k.startsWith('story_audio_') && !k.startsWith('story_audio_list_')));
        const ids = new Set();
        for (const key of recordingKeys) {
          const raw = await AsyncStorage.getItem(key);
          if (raw) {
            if (key.startsWith('story_audio_list_')) {
              try {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed) && parsed.length > 0) {
                  ids.add(key.replace('story_audio_list_', ''));
                }
              } catch (e) {}
            } else {
              ids.add(key.replace('story_audio_', ''));
            }
          }
        }
        setRecordedStoryIds(ids);
      } catch (e) {
        console.warn('Failed to load recorded story ids', e);
      }
    };

    const unsubscribe = navigation.addListener('focus', () => {
      loadRecordedIds();
    });

    loadRecordedIds();

    return unsubscribe;
  }, [navigation]);

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
          _usageDate: entry.usedAt,
        });
      }
    }
    return result;
  }, [isPremium, safeVariantUsage, stories]);

  const categoryOptions = useMemo(() => {
    const map = new Map();
    [...favoriteStoriesRaw, ...historyStoriesRaw, ...recentlyUsedStories, ...(stories || []).filter((story) => recordedStoryIds.has(String(story.story_id)))].forEach((story) => {
      const catId = Number(story.parent_cat_id);
      if (!catId) return;
      if (!map.has(catId)) {
        map.set(catId, {
          id: catId,
          label: String(story.parent_cat || story.cat || ''),
          rawName: String(story.parent_cat_raw || story.parent_cat || story.cat || ''),
        });
      }
    });
    return [{ id: 'all', label: t('libraryFilterAll', lang), rawName: 'Tümü' }, ...Array.from(map.values())];
  }, [favoriteStoriesRaw, historyStoriesRaw, recentlyUsedStories, stories, recordedStoryIds, lang]);

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
    { id: 'recordings', label: t('libraryCollectionRecordings', lang), title: t('libraryRecordingsTitle', lang) },
  ], [lang]);

  const recordedStories = useMemo(
    () => (stories || []).filter((story) => recordedStoryIds.has(String(story.story_id))),
    [stories, recordedStoryIds]
  );

  const baseCollectionStories = useMemo(() => {
    if (activeCollection === 'favorites') return favoriteStoriesRaw;
    if (activeCollection === 'used') return recentlyUsedStories;
    if (activeCollection === 'recordings') return recordedStories;
    return historyStoriesRaw;
  }, [activeCollection, favoriteStoriesRaw, historyStoriesRaw, recentlyUsedStories, recordedStories]);

  const collectionStories = useMemo(
    () => applySort(applyCategoryFilter(baseCollectionStories), activeCollection),
    [baseCollectionStories, activeCategory, sortBy, historyIndexMap, favoriteOrderMap, readCountsByStory, activeCollection]
  );

  const visibleCollectionStories = useMemo(
    () => searchQuery.trim()
      ? collectionStories.filter((story) => storyMatchesSearch(story, searchQuery))
      : collectionStories,
    [collectionStories, searchQuery]
  );

  const dynamicTitle = useMemo(() => {
    const active = collectionItems.find((item) => item.id === activeCollection);
    return active?.title || t('recentRead', lang);
  }, [collectionItems, activeCollection, lang]);

  const emptyText = useMemo(() => {
    if (searchQuery.trim()) return t('searchNoResultsTitle', lang);
    if (activeCategory !== 'all') return t('libraryFilteredEmptyTitle', lang);
    if (activeCollection === 'favorites') return t('noFavs', lang);
    if (activeCollection === 'used') return t('libraryNoUsedStories', lang);
    if (activeCollection === 'recordings') return t('libraryNoRecordings', lang);
    return t('noHistory', lang);
  }, [activeCategory, activeCollection, lang, searchQuery]);

  const emptyStateMeta = useMemo(() => {
    if (searchQuery.trim()) {
      return {
        subtitle: t('searchNoResultsSub', lang),
        cta: t('searchClearAccessibility', lang),
        action: () => setSearchQuery(''),
      };
    }

    if (activeCategory !== 'all') {
      return {
        subtitle: t('libraryFilteredEmptySub', lang),
        cta: t('libraryClearFilterCta', lang),
        action: () => setActiveCategory('all'),
      };
    }

    if (activeCollection === 'favorites') {
      return {
        subtitle: t('libraryEmptyFavoritesSub', lang),
        cta: t('libraryEmptyFavoritesCta', lang),
        action: () => navigation.navigate('HomeTab'),
      };
    }

    if (activeCollection === 'used') {
      return {
        subtitle: t('libraryEmptyUsedSub', lang),
        cta: t('libraryEmptyUsedCta', lang),
        action: () => navigation.navigate('HomeTab'),
      };
    }

    if (activeCollection === 'recordings') {
      return {
        subtitle: t('libraryEmptyRecordingsSub', lang),
        cta: t('libraryEmptyRecordingsCta', lang),
        action: () => navigation.navigate('HomeTab'),
      };
    }

    return {
      subtitle: t('libraryEmptyReadSub', lang),
      cta: t('libraryEmptyReadCta', lang),
      action: () => navigation.navigate('HomeTab'),
    };
  }, [activeCategory, activeCollection, lang, navigation, searchQuery]);

  // Shared neutral tokens — match CategoryPill's passive (B2) look so the
  // collection / sort / recording chips read as one calm system.
  const neutral = isDark
    ? { background: '#232326', border: '#34343A', text: '#B7B9BE' }
    : { background: '#F1ECE1', border: '#E4DBCB', text: '#857E6E' };

  const styles = StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.background
    },
    header: { 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      paddingHorizontal: layout.padding.horizontal, 
      paddingTop: 10,
      paddingBottom: 8,
    },
    title: { 
      fontFamily: 'PlayfairDisplay_700Bold', 
      fontSize: 28, 
      color: colors.text,
      letterSpacing: 0.2,
    },
    searchWrap: {
      marginHorizontal: layout.padding.horizontal,
      marginTop: 4,
      marginBottom: 12,
      minHeight: 46,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surfaceContainerLowest,
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: 14,
      paddingRight: 6,
    },
    searchInput: {
      flex: 1,
      minHeight: 46,
      paddingHorizontal: 10,
      fontFamily: 'Inter_400Regular',
      fontSize: 15,
      color: colors.text,
    },
    searchClearBtn: {
      width: 34,
      height: 34,
      borderRadius: 17,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sectionHeading: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: 22,
      color: colors.text,
      marginHorizontal: layout.padding.horizontal,
      marginTop: 24,
      marginBottom: 12,
    },
    sectionHeadingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginHorizontal: layout.padding.horizontal,
      marginTop: 24,
      marginBottom: 12,
    },
    sectionHeadingRowText: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: 22,
      color: colors.text,
      flex: 1,
    },
    pillListContent: {
      gap: 10,
      paddingHorizontal: layout.padding.horizontal,
    },
    collectionPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      borderWidth: 1,
      borderColor: neutral.border,
      borderRadius: 999,
      paddingVertical: 8,
      paddingHorizontal: 12,
      backgroundColor: neutral.background,
    },
    collectionPillActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    collectionPillText: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 13,
      color: neutral.text,
    },
    collectionPillTextActive: {
      color: colors.onPrimary,
    },
    segment: {
      flexDirection: 'row',
      gap: 3,
      marginHorizontal: layout.padding.horizontal,
      marginTop: 4,
      marginBottom: 12,
    },
    segmentItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      paddingHorizontal: 4,
      borderRadius: 14,
      backgroundColor: colors.surfaceContainerLowest,
      borderWidth: 1,
      borderColor: colors.border,
    },
    segmentItemActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    segmentText: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 13,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    segmentTextActive: {
      color: colors.onPrimary,
    },
    segmentCount: {
      fontFamily: 'Inter_500Medium',
      fontSize: 11,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 2,
      opacity: 0.8,
    },
    segmentCountActive: {
      color: colors.onPrimary,
      opacity: 0.85,
    },
    filterRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: layout.padding.horizontal,
      marginBottom: 12,
    },
    countLine: {
      fontFamily: 'Inter_400Regular',
      fontSize: 12,
      color: colors.textSecondary,
      marginHorizontal: layout.padding.horizontal,
      marginBottom: 10,
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
    emptyTitle: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 16,
      color: colors.text,
      textAlign: 'center',
    },
    emptyButton: {
      marginTop: 16,
      minHeight: 44,
      borderRadius: 12,
      paddingHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
    },
    emptyButtonText: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 13,
      color: colors.onPrimary,
    },
    sortBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      borderWidth: 1,
      borderColor: neutral.border,
      borderRadius: 14,
      paddingHorizontal: 10,
      paddingVertical: 7,
      backgroundColor: neutral.background,
    },
    sortBtnText: {
      fontFamily: 'Inter_500Medium',
      fontSize: 13,
      color: neutral.text,
    },
    listWrap: {
      paddingHorizontal: layout.padding.horizontal,
      gap: 12,
    },
    sortOverlay: {
      flex: 1,
      backgroundColor: colors.modalOverlay,
      justifyContent: 'flex-end',
    },
    sortSheet: {
      backgroundColor: colors.modalSurface,
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
          <Text style={styles.title}>{t('tabLibrary', lang)}</Text>
        </View>

        <View style={styles.searchWrap}>
          <Ionicons name="search" size={18} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('searchPlaceholder', lang)}
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            accessibilityLabel={t('searchInputAccessibility', lang)}
          />
          {searchQuery.trim().length > 0 && (
            <TouchableOpacity
              style={styles.searchClearBtn}
              onPress={() => setSearchQuery('')}
              accessibilityRole="button"
              accessibilityLabel={t('searchClearAccessibility', lang)}
            >
              <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* ── Koleksiyon segment kontrolü (birincil eksen) ─────── */}
        <View style={styles.segment}>
          {collectionItems.map((item) => {
            const active = activeCollection === item.id;
            const count = item.id === 'favorites'
              ? favoriteStoriesRaw.length
              : item.id === 'used'
                ? recentlyUsedStories.length
                : item.id === 'recordings'
                  ? recordedStories.length
                : historyStoriesRaw.length;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.segmentItem, active && styles.segmentItemActive]}
                onPress={() => setActiveCollection(item.id)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                <Text numberOfLines={1} style={[styles.segmentText, active && styles.segmentTextActive]}>
                  {item.label}
                </Text>
                {count > 0 ? (
                  <Text style={[styles.segmentCount, active && styles.segmentCountActive]}>
                    {count}
                  </Text>
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Kategori kartları: Ana ekrandaki dikey kart tasarımı/UX'i ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingHorizontal: layout.padding.horizontal }}
          style={{ marginBottom: 10 }}
        >
          {categoryOptions.map((item) => (
            <CategoryPill
              key={String(item.id)}
              label={item.label}
              categoryName={item.rawName || item.label}
              active={activeCategory === item.id}
              vertical
              isDark={isDark}
              onPress={() => setActiveCategory(item.id)}
            />
          ))}
        </ScrollView>

        {/* ── İkincil işlem satırı: sıralama ───── */}
        <View style={styles.filterRow}>
          <View style={{ flex: 1 }} />
          <TouchableOpacity
            style={styles.sortBtn}
            onPress={() => setSortModalVisible(true)}
            accessibilityRole="button"
            accessibilityLabel={t('librarySortAction', lang)}
          >
            <Ionicons name="swap-vertical-outline" size={16} color={neutral.text} />
          </TouchableOpacity>
        </View>

        <Text style={styles.countLine}>
          {`${visibleCollectionStories.length} ${lang === 'tr' ? 'hikaye' : 'stories'}`}
        </Text>

        <View style={styles.listWrap}>
          {visibleCollectionStories.length > 0 ? visibleCollectionStories.map(story => (
            <StoryCard
              key={`${activeCollection}-${story.story_id}`}
              story={story}
              type="ready"
              isRead={false}
              hasRecording={recordedStoryIds.has(String(story.story_id))}
              usageDate={activeCollection === 'used' ? story._usageDate : null}
              onPress={() => navigation.navigate('StoryDetail', { story })}
              onUseInConversation={() => navigation.navigate('UseInConversation', { story })}
            />
          )) : (
            <View style={[styles.emptyState, { paddingTop: 20 }]}>
              <Text style={styles.emptyTitle}>{emptyText}</Text>
              <Text style={styles.emptyText}>{emptyStateMeta.subtitle}</Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={emptyStateMeta.action}
                accessibilityRole="button"
                accessibilityLabel={emptyStateMeta.cta}
              >
                <Text style={styles.emptyButtonText}>{emptyStateMeta.cta}</Text>
              </TouchableOpacity>
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
                accessibilityRole="button"
                accessibilityLabel={opt.label}
                accessibilityState={{ selected: sortBy === opt.id }}
              >
                <Text style={[styles.sortOptionText, sortBy === opt.id && { color: colors.primary, fontFamily: 'Inter_600SemiBold' }]}>{opt.label}</Text>
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

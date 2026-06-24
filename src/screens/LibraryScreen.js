import React, { useMemo, useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  StatusBar, Modal, FlatList
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
  const [filterRecorded, setFilterRecorded] = useState(false);
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
    [...favoriteStoriesRaw, ...historyStoriesRaw, ...recentlyUsedStories].forEach((story) => {
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

  const applyRecordedFilter = (list) => {
    if (!filterRecorded) return list;
    return list.filter(s => recordedStoryIds.has(String(s.story_id)));
  };

  const collectionStories = useMemo(
    () => applySort(applyRecordedFilter(applyCategoryFilter(baseCollectionStories)), activeCollection),
    [baseCollectionStories, activeCategory, sortBy, historyIndexMap, favoriteOrderMap, readCountsByStory, activeCollection, filterRecorded, recordedStoryIds]
  );

  const dynamicTitle = useMemo(() => {
    const active = collectionItems.find((item) => item.id === activeCollection);
    return active?.title || t('recentRead', lang);
  }, [collectionItems, activeCollection, lang]);

  const emptyText = useMemo(() => {
    if (activeCategory !== 'all') return t('libraryFilteredEmptyTitle', lang);
    if (activeCollection === 'favorites') return t('noFavs', lang);
    if (activeCollection === 'used') return t('libraryNoUsedStories', lang);
    return t('noHistory', lang);
  }, [activeCollection, lang]);

  const emptyStateMeta = useMemo(() => {
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

    return {
      subtitle: t('libraryEmptyReadSub', lang),
      cta: t('libraryEmptyReadCta', lang),
      action: () => navigation.navigate('HomeTab'),
    };
  }, [activeCategory, activeCollection, lang, navigation]);

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
      color: '#FFFFFF',
    },
    segment: {
      flexDirection: 'row',
      gap: 4,
      backgroundColor: neutral.background,
      borderRadius: 14,
      padding: 4,
      marginHorizontal: layout.padding.horizontal,
      marginTop: 4,
      marginBottom: 12,
    },
    segmentItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 9,
      borderRadius: 11,
    },
    segmentItemActive: {
      backgroundColor: colors.primary,
    },
    segmentText: {
      fontFamily: 'Inter_500Medium',
      fontSize: 13,
      color: neutral.text,
    },
    segmentTextActive: {
      color: '#FFFFFF',
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
          <Text style={styles.title}>{t('tabLibrary', lang)}</Text>
        </View>

        {/* ── Koleksiyon segment kontrolü (birincil eksen) ─────── */}
        <View style={styles.segment}>
          {collectionItems.map((item) => {
            const active = activeCollection === item.id;
            const count = item.id === 'favorites'
              ? favoriteStoriesRaw.length
              : item.id === 'used'
                ? recentlyUsedStories.length
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
                  {count > 0 ? <Text style={{ opacity: active ? 0.85 : 0.6 }}>{`  ${count}`}</Text> : null}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── İkincil filtre satırı: kategori + ses + sırala ───── */}
        <View style={styles.filterRow}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ flex: 1 }}
            contentContainerStyle={{ gap: 8, alignItems: 'center', paddingRight: 4 }}
          >
            {categoryOptions.map((item) => (
              <CategoryPill
                key={String(item.id)}
                label={item.label}
                categoryName={item.rawName || item.label}
                active={activeCategory === item.id}
                compact
                isDark={isDark}
                onPress={() => setActiveCategory(item.id)}
              />
            ))}
            {recordedStoryIds.size > 0 && (
              <TouchableOpacity
                onPress={() => setFilterRecorded(f => !f)}
                style={{
                  flexDirection: 'row', alignItems: 'center', gap: 5, flexShrink: 0,
                  paddingHorizontal: 13, paddingVertical: 8, borderRadius: 999, borderWidth: 1,
                  borderColor: filterRecorded ? colors.primary : neutral.border,
                  backgroundColor: filterRecorded ? `${colors.primary}18` : neutral.background,
                }}
                accessibilityRole="button"
                accessibilityState={{ selected: filterRecorded }}
                accessibilityLabel={lang === 'tr' ? 'Ses kaydı olanlar' : 'With recordings'}
              >
                <Ionicons name="mic" size={14} color={filterRecorded ? colors.primary : neutral.text} />
                <Text style={{
                  fontFamily: filterRecorded ? 'Inter_600SemiBold' : 'Inter_500Medium',
                  fontSize: 12.5,
                  color: filterRecorded ? colors.primary : neutral.text,
                }}>
                  {lang === 'tr' ? 'Sesli' : 'Audio'}{` ${recordedStoryIds.size}`}
                </Text>
                {filterRecorded && <Ionicons name="close" size={13} color={colors.primary} />}
              </TouchableOpacity>
            )}
          </ScrollView>
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
          {`${collectionStories.length} ${lang === 'tr' ? 'hikaye' : 'stories'}`}
        </Text>

        <View style={styles.listWrap}>
          {collectionStories.length > 0 ? collectionStories.map(story => (
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

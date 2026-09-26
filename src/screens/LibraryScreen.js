import React, { useCallback, useMemo, useState } from 'react';
import {
  View, Text, ScrollView, FlatList, TouchableOpacity, StyleSheet,
  StatusBar, Modal, TextInput, ImageBackground, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useUserData } from '../context/UserDataContext';
import { useStories } from '../context/StoriesContext';
import { t } from '../locales/i18n';
import StoryCard from '../components/StoryCard';
import CategoryPill from '../components/CategoryPill';
import { getCategoryTheme, getCategoryBanner } from '../utils/categoryImages';
import { extractShareParts } from '../utils/storyMarkup';
import useRecordedStoryIds from '../hooks/useRecordedStoryIds';

// Library = "action on top, archive below":
//   1. Kaldığın yerden  – stories scrolled into but not finished (inProgressStories)
//   2. Sonra oku        – favoriteCollections.saved_for_later
//   3. Cebindekiler     – saved takeaways (careerTakeaways) as quote cards
//   4. Arşiv            – Okunanlar / Favoriler / Kayıtlar + category + sort
// The top sections hide while searching or when empty.

const READ_LATER_PREVIEW = 3;
const CONTINUE_MAX = 3;

const normalizeSearchValue = (value = '') =>
  String(value || '').toLocaleLowerCase('tr-TR').trim();

const storyMatchesSearch = (story, query) => {
  const normalizedQuery = normalizeSearchValue(query);
  if (!normalizedQuery) return true;
  const searchable = [
    story?.title, story?.body, story?.quote, story?.lesson, story?.source_book,
    story?.cat, story?.cat_display, story?.parent_cat, story?.parent_cat_raw,
  ].map(normalizeSearchValue).join(' ');
  return searchable.includes(normalizedQuery);
};

const categoryKeyOf = (story) => story?.parent_cat_raw || story?.parent_cat || story?.cat || '';

// Text shown on a "Cebindekiler" card: the story's pocket takeaway if the
// rich format has one, otherwise its lesson.
const getTakeawayText = (story) => {
  let parts = null;
  try {
    parts = story?.body ? extractShareParts(story.body) : null;
  } catch (e) {
    parts = null;
  }
  return String(parts?.pocket || parts?.lesson || story?.lesson || '').trim();
};

const LibraryScreen = ({ navigation }) => {
  const { colors, layout, isDark, lang } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const {
    favorites,
    history,
    readCountsByStory,
    isPremium,
    variantUsage,
    favoriteCollections,
    careerTakeaways,
    inProgressStories,
  } = useUserData();
  const { stories } = useStories();
  const recordedStoryIds = useRecordedStoryIds(navigation);

  const [sortBy, setSortBy] = useState('recent');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeCollection, setActiveCollection] = useState('read');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [showAllReadLater, setShowAllReadLater] = useState(false);

  const isSearching = searchQuery.trim().length > 0;
  const hPad = layout.padding.horizontal;

  // ── Lookups ────────────────────────────────────────────────────────────
  const storyById = useMemo(() => {
    const map = new Map();
    (stories || []).forEach((s) => map.set(String(s.story_id), s));
    return map;
  }, [stories]);

  const resolveIds = useCallback((ids) => {
    const seen = new Set();
    const out = [];
    (Array.isArray(ids) ? ids : []).forEach((id) => {
      const key = String(id);
      if (seen.has(key)) return;
      seen.add(key);
      const story = storyById.get(key);
      if (story) out.push(story);
    });
    return out;
  }, [storyById]);

  // `history` keeps only the 20 most recent reads; readCountsByStory (SQLite)
  // knows every story ever read. Recent first, then the rest newest-id first.
  const readIds = useMemo(() => {
    const recent = (Array.isArray(history) ? history : []).map(String);
    const recentSet = new Set(recent);
    const older = Object.keys(readCountsByStory || {})
      .filter((id) => (readCountsByStory[id] || 0) > 0 && !recentSet.has(String(id)))
      .sort((a, b) => Number(b) - Number(a));
    return [...recent, ...older];
  }, [history, readCountsByStory]);
  const readIdSet = useMemo(() => new Set(readIds), [readIds]);

  // Premium "Sohbette kullan" usage → shown inline on the row, not a tab.
  const usageDateById = useMemo(() => {
    const map = new Map();
    if (!isPremium || !Array.isArray(variantUsage)) return map;
    variantUsage.forEach((entry) => {
      const id = String(entry?.storyId || '').trim();
      if (id && !map.has(id)) map.set(id, entry.usedAt || null);
    });
    return map;
  }, [isPremium, variantUsage]);

  // ── Top sections ───────────────────────────────────────────────────────
  const continueItems = useMemo(() => (Array.isArray(inProgressStories) ? inProgressStories : [])
    .filter((entry) => !readIdSet.has(String(entry.id)))
    .map((entry) => {
      const story = storyById.get(String(entry.id));
      return story ? { story, progress: entry.progress || 0 } : null;
    })
    .filter(Boolean)
    .slice(0, CONTINUE_MAX), [inProgressStories, readIdSet, storyById]);

  const readLaterStories = useMemo(
    () => resolveIds(favoriteCollections?.saved_for_later).reverse(),
    [favoriteCollections, resolveIds]
  );

  const pocketItems = useMemo(() => Object.entries(careerTakeaways || {})
    .map(([id, meta]) => {
      const story = storyById.get(String(id));
      if (!story) return null;
      const text = getTakeawayText(story);
      return text ? { story, text, savedAt: meta?.savedAt || '' } : null;
    })
    .filter(Boolean)
    .sort((a, b) => String(b.savedAt).localeCompare(String(a.savedAt))), [careerTakeaways, storyById]);

  // ── Archive ────────────────────────────────────────────────────────────
  const readStories = useMemo(() => resolveIds(readIds), [readIds, resolveIds]);
  // Favorites are appended on toggle → newest last; show newest first.
  const favoriteStories = useMemo(() => resolveIds(favorites).reverse(), [favorites, resolveIds]);
  const recordedStories = useMemo(
    () => (stories || [])
      .filter((story) => recordedStoryIds.has(String(story.story_id)))
      .sort((a, b) => Number(b.story_id) - Number(a.story_id)),
    [stories, recordedStoryIds]
  );

  const collectionItems = useMemo(() => [
    { id: 'read', label: t('libraryCollectionRead', lang), count: readStories.length },
    { id: 'favorites', label: t('libraryCollectionFavorites', lang), count: favoriteStories.length },
    { id: 'recordings', label: t('libraryCollectionRecordings', lang), count: recordedStories.length },
  ], [lang, readStories.length, favoriteStories.length, recordedStories.length]);

  const baseArchive = activeCollection === 'favorites'
    ? favoriteStories
    : activeCollection === 'recordings'
      ? recordedStories
      : readStories;

  const categoryOptions = useMemo(() => {
    const map = new Map();
    baseArchive.forEach((story) => {
      const catId = Number(story.parent_cat_id);
      if (!catId || map.has(catId)) return;
      map.set(catId, {
        id: catId,
        label: String(story.parent_cat || story.cat || ''),
        rawName: String(categoryKeyOf(story)),
      });
    });
    return [{ id: 'all', label: t('libraryFilterAll', lang), rawName: 'Tümü' }, ...Array.from(map.values())];
  }, [baseArchive, lang]);

  // A filter left over from another collection that has no such category.
  const effectiveCategory = categoryOptions.some((c) => c.id === activeCategory) ? activeCategory : 'all';

  const visibleArchive = useMemo(() => {
    let list = effectiveCategory === 'all'
      ? baseArchive
      : baseArchive.filter((story) => Number(story.parent_cat_id) === Number(effectiveCategory));
    if (sortBy === 'most_read') {
      list = list.slice().sort((a, b) => {
        const diff = (readCountsByStory?.[String(b.story_id)] || 0) - (readCountsByStory?.[String(a.story_id)] || 0);
        return diff !== 0 ? diff : Number(b.story_id) - Number(a.story_id);
      });
    }
    if (isSearching) list = list.filter((story) => storyMatchesSearch(story, searchQuery));
    return list;
  }, [baseArchive, effectiveCategory, sortBy, readCountsByStory, isSearching, searchQuery]);

  const emptyState = useMemo(() => {
    const goHome = () => navigation.navigate('HomeTab');
    if (isSearching) {
      return {
        title: t('searchNoResultsTitle', lang), sub: t('searchNoResultsSub', lang),
        cta: t('searchClearAccessibility', lang), action: () => setSearchQuery(''),
      };
    }
    if (effectiveCategory !== 'all') {
      return {
        title: t('libraryFilteredEmptyTitle', lang), sub: t('libraryFilteredEmptySub', lang),
        cta: t('libraryClearFilterCta', lang), action: () => setActiveCategory('all'),
      };
    }
    if (activeCollection === 'favorites') {
      return { title: t('noFavs', lang), sub: t('libraryEmptyFavoritesSub', lang), cta: t('libraryEmptyFavoritesCta', lang), action: goHome };
    }
    if (activeCollection === 'recordings') {
      return { title: t('libraryNoRecordings', lang), sub: t('libraryEmptyRecordingsSub', lang), cta: t('libraryEmptyRecordingsCta', lang), action: goHome };
    }
    return { title: t('noHistory', lang), sub: t('libraryEmptyReadSub', lang), cta: t('libraryEmptyReadCta', lang), action: goHome };
  }, [activeCollection, effectiveCategory, isSearching, lang, navigation]);

  const openStory = useCallback((story) => navigation.navigate('StoryDetail', { story }), [navigation]);
  const openUseInConversation = useCallback((story) => navigation.navigate('UseInConversation', { story }), [navigation]);

  // Shared neutral tokens (B2 passive look).
  const neutral = isDark
    ? { background: '#232326', border: '#34343A', text: '#B7B9BE' }
    : { background: '#F1ECE1', border: '#E4DBCB', text: '#857E6E' };

  const styles = useMemo(() => StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    header: { paddingHorizontal: hPad, paddingTop: 10, paddingBottom: 8 },
    title: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 28, color: colors.text, letterSpacing: 0.2 },
    searchWrap: {
      marginHorizontal: hPad, marginTop: 4, marginBottom: 4, minHeight: 46, borderRadius: 18,
      borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceContainerLowest,
      flexDirection: 'row', alignItems: 'center', paddingLeft: 14, paddingRight: 6,
    },
    searchInput: {
      flex: 1, minHeight: 46, paddingHorizontal: 10,
      fontFamily: 'Inter_400Regular', fontSize: 15, color: colors.text,
    },
    searchClearBtn: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
    sectionRow: {
      flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between',
      marginHorizontal: hPad, marginTop: 22, marginBottom: 12,
    },
    sectionTitle: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 20, color: colors.text, flexShrink: 1 },
    sectionCount: { fontFamily: 'Inter_500Medium', fontSize: 13, color: colors.textSecondary },
    sectionAction: { fontFamily: 'Inter_500Medium', fontSize: 13, color: colors.primaryText },
    hList: { gap: 12, paddingHorizontal: hPad },
    // Kaldığın yerden
    continueCard: {
      borderRadius: layout.radius.card, overflow: 'hidden', minHeight: 150,
      padding: 18, justifyContent: 'space-between',
      borderWidth: isDark ? 1 : 0, borderColor: colors.border,
    },
    continueEyebrow: { fontFamily: 'Inter_500Medium', fontSize: 12, letterSpacing: 0.3 },
    continueTitle: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 19, lineHeight: 25, marginTop: 6 },
    continueFooter: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 18 },
    progressTrack: { flex: 1, height: 6, borderRadius: 3, overflow: 'hidden' },
    progressFill: { height: '100%', borderRadius: 3 },
    continueMeta: { fontFamily: 'Inter_500Medium', fontSize: 12 },
    continueCta: {
      flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 7,
      borderRadius: 999, backgroundColor: isDark ? colors.background : colors.surfaceContainerLowest,
    },
    continueCtaText: { fontFamily: 'Inter_500Medium', fontSize: 13 },
    // Sonra oku
    stackList: { paddingHorizontal: hPad, gap: 10 },
    // Cebindekiler
    pocketCard: {
      width: Math.min(280, windowWidth * 0.74), minHeight: 180, borderRadius: layout.radius.card,
      borderWidth: 1, padding: 16, justifyContent: 'space-between',
    },
    pocketEyebrow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    pocketEyebrowText: { fontFamily: 'Inter_500Medium', fontSize: 12 },
    pocketText: {
      fontFamily: 'PlayfairDisplay_400Regular_Italic', fontSize: 16, lineHeight: 23,
      color: colors.text, marginTop: 10,
    },
    pocketFooter: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 14 },
    pocketSource: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textSecondary },
    pocketUseBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
    // Arşiv
    segment: {
      flexDirection: 'row', marginHorizontal: hPad, marginBottom: 12, padding: 3,
      borderRadius: 16, backgroundColor: neutral.background, borderWidth: 1, borderColor: neutral.border,
    },
    segmentItem: {
      flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5,
      paddingVertical: 9, paddingHorizontal: 4, borderRadius: 13,
    },
    segmentItemActive: { backgroundColor: colors.primary },
    segmentText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: neutral.text, flexShrink: 1 },
    segmentTextActive: { color: colors.onPrimary },
    segmentCount: { fontFamily: 'Inter_400Regular', fontSize: 12, color: neutral.text, opacity: 0.85 },
    segmentCountActive: { color: colors.onPrimary },
    filterRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    sortBtn: {
      width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center',
      borderWidth: 1, borderColor: neutral.border, backgroundColor: neutral.background,
      marginLeft: 8, marginRight: hPad,
    },
    countLine: {
      fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textSecondary,
      marginHorizontal: hPad, marginBottom: 10,
    },
    rowWrap: { paddingHorizontal: hPad },
    emptyState: { paddingHorizontal: 40, paddingTop: 20, paddingBottom: 40, alignItems: 'center' },
    emptyTitle: { fontFamily: 'Inter_500Medium', fontSize: 16, color: colors.text, textAlign: 'center' },
    emptyText: {
      fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.textSecondary,
      textAlign: 'center', marginTop: 8,
    },
    emptyButton: {
      marginTop: 16, minHeight: 44, borderRadius: 12, paddingHorizontal: 16,
      alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary,
    },
    emptyButtonText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: colors.onPrimary },
    sortOverlay: { flex: 1, backgroundColor: colors.modalOverlay, justifyContent: 'flex-end' },
    sortSheet: {
      backgroundColor: colors.modalSurface, borderTopLeftRadius: 20, borderTopRightRadius: 20,
      paddingHorizontal: 18, paddingTop: 16, paddingBottom: 24, borderTopWidth: 1, borderColor: colors.border,
    },
    sortTitle: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 20, color: colors.text, marginBottom: 10 },
    sortOption: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingVertical: 14, borderBottomWidth: 1, borderColor: colors.border,
    },
    sortOptionText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: colors.text },
  }), [colors, layout, isDark, hPad, windowWidth, neutral.background, neutral.border, neutral.text]);

  // ── Pieces ─────────────────────────────────────────────────────────────
  const SectionHeader = ({ title, count, actionLabel, onAction }) => (
    <View style={styles.sectionRow}>
      <Text style={styles.sectionTitle} numberOfLines={1}>
        {title}
        {count ? <Text style={styles.sectionCount}>{`  ${count}`}</Text> : null}
      </Text>
      {actionLabel ? (
        <TouchableOpacity onPress={onAction} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} accessibilityRole="button">
          <Text style={styles.sectionAction}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );

  const renderContinueCard = ({ story, progress }, cardWidth) => {
    const catTheme = getCategoryTheme(categoryKeyOf(story), isDark);
    const accent = catTheme.accent || colors.primary;
    const pct = Math.round(Math.max(0, Math.min(1, progress)) * 100);
    const catLabel = t(story.parent_cat || story.cat, lang) || '';
    const mins = Number(story?.min || story?.possible_read_minutes) || null;
    const titleColor = colors.text;
    const subColor = colors.textSecondary;

    const inner = (
      <>
        <View>
          <Text style={[styles.continueEyebrow, { color: accent }]} numberOfLines={1}>
            {catLabel}{mins ? `  ·  ${mins} ${t('minLabel', lang)}` : ''}
          </Text>
          <Text style={[styles.continueTitle, { color: titleColor }]} numberOfLines={2}>{story.title}</Text>
        </View>
        <View style={styles.continueFooter}>
          <View style={{ flex: 1 }}>
            <View style={[styles.progressTrack, { backgroundColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)' }]}>
              <View style={[styles.progressFill, { width: `${Math.max(pct, 4)}%`, backgroundColor: accent }]} />
            </View>
            <Text style={[styles.continueMeta, { color: subColor, marginTop: 6 }]}>
              {t('libraryProgressRead', lang, { pct })}
            </Text>
          </View>
          <View style={styles.continueCta}>
            <Text style={[styles.continueCtaText, { color: accent }]}>{t('libraryContinueCta', lang)}</Text>
            <Ionicons name="arrow-forward" size={15} color={accent} />
          </View>
        </View>
      </>
    );

    return (
      <TouchableOpacity
        key={`continue-${story.story_id}`}
        activeOpacity={0.86}
        onPress={() => openStory(story)}
        accessibilityRole="button"
        accessibilityLabel={`${t('libraryContinueCta', lang)}: ${story.title}`}
        style={{ width: cardWidth }}
      >
        {isDark ? (
          <View style={[styles.continueCard, { backgroundColor: `${accent}22` }]}>{inner}</View>
        ) : (
          <ImageBackground
            source={getCategoryBanner(categoryKeyOf(story)).source}
            resizeMode="cover"
            imageStyle={{ borderRadius: layout.radius.card }}
            style={[styles.continueCard, { backgroundColor: catTheme.backgroundColor }]}
          >
            {inner}
          </ImageBackground>
        )}
      </TouchableOpacity>
    );
  };

  const renderPocketCard = ({ story, text }) => {
    const catTheme = getCategoryTheme(categoryKeyOf(story), isDark);
    const accent = catTheme.accent || colors.primary;
    return (
      <TouchableOpacity
        key={`pocket-${story.story_id}`}
        activeOpacity={0.86}
        onPress={() => openStory(story)}
        accessibilityRole="button"
        style={[styles.pocketCard, {
          backgroundColor: isDark ? colors.cardBackground : catTheme.backgroundColor,
          borderColor: `${catTheme.borderColor || accent}40`,
        }]}
      >
        <View>
          <View style={styles.pocketEyebrow}>
            <Ionicons name="bookmark" size={13} color={accent} />
            <Text style={[styles.pocketEyebrowText, { color: accent }]} numberOfLines={1}>
              {t(story.parent_cat || story.cat, lang) || ''}
            </Text>
          </View>
          <Text style={styles.pocketText} numberOfLines={5}>{text}</Text>
        </View>
        <View style={styles.pocketFooter}>
          <Text style={styles.pocketSource} numberOfLines={1}>{story.title}</Text>
          <TouchableOpacity
            onPress={() => openUseInConversation(story)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel={t('story_detail_use_cta', lang)}
            style={[styles.pocketUseBtn, { backgroundColor: `${accent}1A` }]}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={18} color={accent} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderStoryRow = (story, keyPrefix) => (
    <StoryCard
      key={`${keyPrefix}-${story.story_id}`}
      story={story}
      type="ready"
      isRead={false}
      hasRecording={recordedStoryIds.has(String(story.story_id))}
      usageDate={usageDateById.get(String(story.story_id)) || null}
      onPress={() => openStory(story)}
      onUseInConversation={() => openUseInConversation(story)}
    />
  );

  const showTopSections = !isSearching;
  const hasTopContent = showTopSections && (continueItems.length > 0 || readLaterStories.length > 0 || pocketItems.length > 0);
  const readLaterVisible = showAllReadLater ? readLaterStories : readLaterStories.slice(0, READ_LATER_PREVIEW);
  const singleCardWidth = windowWidth - hPad * 2;
  const continueCardWidth = continueItems.length === 1 ? singleCardWidth : Math.min(320, windowWidth * 0.8);

  const listHeader = (
    <View>
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
        {isSearching && (
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

      {/* ── 1. Kaldığın yerden ─────────────────────────────── */}
      {showTopSections && continueItems.length > 0 && (
        <>
          <SectionHeader title={t('libraryContinueTitle', lang)} />
          {continueItems.length === 1 ? (
            <View style={{ paddingHorizontal: hPad }}>{renderContinueCard(continueItems[0], singleCardWidth)}</View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hList}
              snapToInterval={continueCardWidth + 12}
              decelerationRate="fast"
            >
              {continueItems.map((item) => renderContinueCard(item, continueCardWidth))}
            </ScrollView>
          )}
        </>
      )}

      {/* ── 2. Sonra oku ───────────────────────────────────── */}
      {showTopSections && readLaterStories.length > 0 && (
        <>
          <SectionHeader
            title={t('libraryReadLaterTitle', lang)}
            count={readLaterStories.length}
            actionLabel={readLaterStories.length > READ_LATER_PREVIEW
              ? (showAllReadLater ? t('libraryShowLess', lang) : t('librarySeeAll', lang))
              : null}
            onAction={() => setShowAllReadLater((v) => !v)}
          />
          <View style={styles.stackList}>
            {readLaterVisible.map((story) => renderStoryRow(story, 'later'))}
          </View>
        </>
      )}

      {/* ── 3. Cebindekiler ────────────────────────────────── */}
      {showTopSections && pocketItems.length > 0 && (
        <>
          <SectionHeader title={t('libraryPocketTitle', lang)} count={pocketItems.length} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hList}>
            {pocketItems.map(renderPocketCard)}
          </ScrollView>
        </>
      )}

      {/* ── 4. Arşiv ───────────────────────────────────────── */}
      {hasTopContent ? <SectionHeader title={t('libraryArchiveTitle', lang)} /> : <View style={{ height: 12 }} />}

      <View style={styles.segment}>
        {collectionItems.map((item) => {
          const active = activeCollection === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.segmentItem, active && styles.segmentItemActive]}
              onPress={() => setActiveCollection(item.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <Text numberOfLines={1} style={[styles.segmentText, active && styles.segmentTextActive]}>{item.label}</Text>
              {item.count > 0 ? (
                <Text style={[styles.segmentCount, active && styles.segmentCountActive]}>{item.count}</Text>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.filterRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flex: 1 }}
          contentContainerStyle={{ gap: 8, paddingLeft: hPad, paddingRight: 4 }}
        >
          {categoryOptions.length > 2 && categoryOptions.map((item) => (
            <CategoryPill
              key={String(item.id)}
              label={item.label}
              categoryName={item.rawName || item.label}
              active={effectiveCategory === item.id}
              compact
              isDark={isDark}
              onPress={() => setActiveCategory(item.id)}
            />
          ))}
        </ScrollView>
        <TouchableOpacity
          style={styles.sortBtn}
          onPress={() => setSortModalVisible(true)}
          accessibilityRole="button"
          accessibilityLabel={t('librarySortAction', lang)}
        >
          <Ionicons name="swap-vertical-outline" size={17} color={sortBy === 'recent' ? neutral.text : colors.primary} />
        </TouchableOpacity>
      </View>

      <Text style={styles.countLine}>
        {`${visibleArchive.length} ${t('onboarding_stories', lang)}`}
      </Text>
    </View>
  );

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safe}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      <FlatList
        data={visibleArchive}
        keyExtractor={(story) => `${activeCollection}-${story.story_id}`}
        renderItem={({ item }) => <View style={styles.rowWrap}>{renderStoryRow(item, activeCollection)}</View>}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={(
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>{emptyState.title}</Text>
            <Text style={styles.emptyText}>{emptyState.sub}</Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={emptyState.action}
              accessibilityRole="button"
              accessibilityLabel={emptyState.cta}
            >
              <Text style={styles.emptyButtonText}>{emptyState.cta}</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        initialNumToRender={10}
        windowSize={7}
      />

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
                <Text style={[styles.sortOptionText, sortBy === opt.id && { color: colors.primaryText, fontFamily: 'Inter_500Medium' }]}>{opt.label}</Text>
                {sortBy === opt.id ? <Ionicons name="checkmark" size={20} color={colors.primaryText} /> : null}
              </TouchableOpacity>
            ))}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default LibraryScreen;

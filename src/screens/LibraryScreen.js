import React, { useCallback, useMemo, useState } from 'react';
import {
  View, Text, ScrollView, FlatList, TouchableOpacity, StyleSheet,
  StatusBar, Modal, TextInput, Image, useWindowDimensions,
} from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useUserData } from '../context/UserDataContext';
import { useStories } from '../context/StoriesContext';
import { t } from '../locales/i18n';
import CategoryPill from '../components/CategoryPill';
import ScreenHeader from '../components/ScreenHeader';
import LibraryEmptyArt from '../components/LibraryEmptyArt';
import { getCategoryTheme, getCategoryImage } from '../utils/categoryImages';
import { intlLocaleFor } from '../utils/locale';
import { extractShareParts } from '../utils/storyMarkup';
import useRecordedStoryIds from '../hooks/useRecordedStoryIds';

// Library = "action on top, archive below":
//   1. Kaldığın yerden  – stories scrolled into but not finished (inProgressStories)
//   2. Sonra oku        – favoriteCollections.saved_for_later
//   3. Cebimdekiler     – saved takeaways (careerTakeaways) as quote cards
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

// Text shown on a "Cebimdekiler" card: the story's pocket takeaway if the
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

// Brand motif: sun rising over a petrol card (same drawing as Home/Profile). Decorative only.
const HeroSun = ({ color }) => (
  <Svg
    width={150}
    height={116}
    viewBox="0 0 168 130"
    pointerEvents="none"
    style={{ position: 'absolute', right: -30, top: -26, transform: [{ scaleY: -1 }] }}
  >
    <Circle cx={96} cy={104} r={84} fill={color} opacity={0.08} />
    <Circle cx={96} cy={104} r={62} fill={color} opacity={0.14} />
    <Circle cx={96} cy={104} r={40} fill={color} opacity={0.95} />
    <Line x1={96} y1={40} x2={96} y2={22} stroke={color} strokeWidth={3} strokeLinecap="round" opacity={0.85} />
    <Line x1={60} y1={52} x2={50} y2={40} stroke={color} strokeWidth={3} strokeLinecap="round" opacity={0.85} />
    <Line x1={132} y1={52} x2={142} y2={40} stroke={color} strokeWidth={3} strokeLinecap="round" opacity={0.85} />
    <Line x1={40} y1={78} x2={24} y2={72} stroke={color} strokeWidth={3} strokeLinecap="round" opacity={0.85} />
    <Line x1={152} y1={78} x2={168} y2={72} stroke={color} strokeWidth={3} strokeLinecap="round" opacity={0.85} />
  </Svg>
);

const HERO_TEXT = '#F5F1E8';
const HERO_SUB = '#D5E4E0';

// "Kaldığın yerden" card. All cards are equal peers (same surface, same CTA):
// the reader may pick any of them, so none is visually preferred.
const ResumeCard = ({ story, progress, width, onPress }) => {
  const { colors, layout, lang } = useTheme();
  const pct = Math.round(Math.max(0, Math.min(1, progress)) * 100);
  const catLabel = t(story.parent_cat || story.cat, lang) || '';
  const mins = Number(story?.min || story?.possible_read_minutes) || null;
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${t('libraryContinueCta', lang)}: ${story.title}`}
      style={{
        width, padding: 20, borderRadius: layout.radius.card, overflow: 'hidden',
        backgroundColor: colors.heroSurface, borderWidth: 1, borderColor: colors.heroBorder,
      }}
    >
      <HeroSun color={colors.dawn} />
      <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 12, letterSpacing: 1, color: colors.dawn, textTransform: 'uppercase' }} numberOfLines={1}>
        {catLabel}{mins ? `  ·  ${mins} ${t('minLabel', lang)}` : ''}
      </Text>
      <Text style={{ fontFamily: 'PlayfairDisplay_700Bold', fontSize: 22, lineHeight: 26, color: HERO_TEXT, marginTop: 10, marginBottom: 18, maxWidth: '78%' }} numberOfLines={3}>
        {story.title}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View style={{ flex: 1, height: 6, borderRadius: 3, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.18)' }}>
          <View style={{ width: `${Math.max(pct, 4)}%`, height: '100%', borderRadius: 3, backgroundColor: colors.dawn }} />
        </View>
        <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: HERO_SUB }}>
          {t('libraryProgressRead', lang, { pct })}
        </Text>
      </View>
      <View style={{ minHeight: 48, marginTop: 16, borderRadius: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: HERO_TEXT }}>
        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#1B4B48' }}>{t('libraryContinueCta', lang)}</Text>
        <Ionicons name="arrow-forward" size={17} color="#1B4B48" />
      </View>
    </TouchableOpacity>
  );
};

// Archive / "Sonra oku" row: category artwork, serif title, quiet meta tags.
// Category colour lives only in the artwork and the small category label.
const LibraryRow = ({ story, readCount, hasRecording, usageDate, onPress, onUse }) => {
  const { colors, isDark, lang } = useTheme();
  const key = categoryKeyOf(story);
  const catTheme = getCategoryTheme(key, isDark);
  const img = getCategoryImage(key, isDark);
  const catLabel = t(story.parent_cat || story.cat, lang) || '';
  const mins = Number(story?.min || story?.possible_read_minutes) || null;
  const tile = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(36,33,30,0.05)';

  const tags = [];
  if (readCount > 0) tags.push({ id: 'read', icon: 'repeat', text: t('libraryReadCount', lang, { n: readCount }), accent: true });
  if (hasRecording) tags.push({ id: 'rec', icon: 'mic', text: t('libraryCollectionRecordings', lang) });
  if (usageDate) {
    tags.push({
      id: 'use', icon: 'chatbubble-ellipses-outline',
      text: t('storyCraftedLabel', lang, { date: new Date(usageDate).toLocaleDateString(intlLocaleFor(lang)) }),
    });
  }

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={story.title}
      style={{
        flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, minHeight: 92,
        borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.cardBackground,
      }}
    >
      <View style={{ width: 68, height: 68, borderRadius: 14, overflow: 'hidden', backgroundColor: catTheme.backgroundColor }}>
        {img.source ? <Image source={img.source} style={{ width: '100%', height: '100%' }} resizeMode="cover" /> : null}
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text numberOfLines={1} style={{ fontFamily: 'Inter_600SemiBold', fontSize: 11.5, color: catTheme.textColor }}>{catLabel}</Text>
        <Text numberOfLines={2} style={{ fontFamily: 'PlayfairDisplay_700Bold', fontSize: 16, lineHeight: 20, color: colors.text, marginTop: 3 }}>
          {story.title}
        </Text>
        {mins ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 }}>
            <Ionicons name="time-outline" size={12} color={colors.textSecondary} />
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textSecondary }}>{`${mins} ${t('minLabel', lang)}`}</Text>
          </View>
        ) : null}
        {tags.length ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 7 }}>
            {tags.map((tag) => (
              <View
                key={tag.id}
                style={{
                  flexDirection: 'row', alignItems: 'center', gap: 4, minHeight: 22, paddingHorizontal: 8,
                  borderRadius: 11, backgroundColor: tag.accent ? colors.primaryContainer : tile,
                }}
              >
                <Ionicons name={tag.icon} size={11} color={tag.accent ? colors.primaryText : colors.textSecondary} />
                <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 11, color: tag.accent ? colors.primaryText : colors.textSecondary }}>{tag.text}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>
      {onUse ? (
        <TouchableOpacity
          onPress={onUse}
          hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
          accessibilityRole="button"
          accessibilityLabel={t('story_detail_use_cta', lang)}
          style={{ width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primaryContainer }}
        >
          <Ionicons name="chatbubble-ellipses-outline" size={20} color={colors.primaryText} />
        </TouchableOpacity>
      ) : null}
    </TouchableOpacity>
  );
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
        icon: 'search', title: t('searchNoResultsTitle', lang), sub: t('searchNoResultsSub', lang),
        cta: t('searchClearAccessibility', lang), action: () => setSearchQuery(''),
      };
    }
    if (effectiveCategory !== 'all') {
      return {
        icon: 'search', title: t('libraryFilteredEmptyTitle', lang), sub: t('libraryFilteredEmptySub', lang),
        cta: t('libraryClearFilterCta', lang), action: () => setActiveCategory('all'),
      };
    }
    if (activeCollection === 'favorites') {
      return { hero: true, art: 'favorites', icon: 'heart-outline', title: t('noFavs', lang), sub: t('libraryEmptyFavoritesSub', lang), cta: t('libraryEmptyFavoritesCta', lang), action: goHome };
    }
    if (activeCollection === 'recordings') {
      return { hero: true, art: 'recordings', icon: 'mic-outline', title: t('libraryNoRecordings', lang), sub: t('libraryEmptyRecordingsSub', lang), cta: t('libraryEmptyRecordingsCta', lang), action: goHome };
    }
    return { hero: true, art: 'read', icon: 'book-outline', title: t('noHistory', lang), sub: t('libraryEmptyReadSub', lang), cta: t('libraryEmptyReadCta', lang), action: goHome };
  }, [activeCollection, effectiveCategory, isSearching, lang, navigation]);

  const openStory = useCallback((story) => navigation.navigate('StoryDetail', { story }), [navigation]);
  const openUseInConversation = useCallback((story) => navigation.navigate('UseInConversation', { story }), [navigation]);

  const styles = useMemo(() => StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    searchWrap: {
      marginHorizontal: hPad, marginTop: 16, minHeight: 48, borderRadius: 18,
      borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceContainerLowest,
      flexDirection: 'row', alignItems: 'center', paddingLeft: 14, paddingRight: 4,
    },
    searchInput: {
      flex: 1, minHeight: 48, paddingHorizontal: 10,
      fontFamily: 'Inter_400Regular', fontSize: 15, color: colors.text,
    },
    searchClearBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
    sectionRow: {
      flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between',
      marginHorizontal: hPad, marginTop: 28, marginBottom: 12,
    },
    sectionTitle: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 22, lineHeight: 26, color: colors.text, flexShrink: 1 },
    sectionCount: { fontFamily: 'Inter_500Medium', fontSize: 13, color: colors.textSecondary },
    sectionAction: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.primaryText },
    hList: { gap: 12, paddingHorizontal: hPad },
    stackList: { paddingHorizontal: hPad, gap: 10 },
    // Cebimdekiler
    pocketCard: {
      width: Math.min(286, windowWidth * 0.74), minHeight: 200, borderRadius: 20, overflow: 'hidden',
      borderWidth: 1, borderColor: colors.border, backgroundColor: colors.cardBackground, padding: 18,
    },
    pocketMark: {
      position: 'absolute', right: 14, top: -6, fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: 96, lineHeight: 110, opacity: 0.12,
    },
    pocketEyebrow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    pocketEyebrowText: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
    pocketText: {
      fontFamily: 'PlayfairDisplay_400Regular_Italic', fontSize: 17, lineHeight: 24,
      color: colors.text, marginTop: 12,
    },
    pocketFooter: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 'auto', paddingTop: 14 },
    pocketSource: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textSecondary },
    pocketUseBtn: {
      width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center',
      backgroundColor: colors.primaryContainer,
    },
    // Arşiv
    segment: {
      flexDirection: 'row', marginHorizontal: hPad, marginBottom: 14, padding: 3,
      borderRadius: 18, backgroundColor: colors.cardBackground, borderWidth: 1, borderColor: colors.border,
    },
    segmentItem: {
      flex: 1, minHeight: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
      paddingHorizontal: 4, borderRadius: 15,
    },
    segmentItemActive: { backgroundColor: colors.primary },
    segmentText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: colors.textSecondary, flexShrink: 1 },
    segmentTextActive: { color: colors.onPrimary },
    segmentCount: { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textSecondary, opacity: 0.85 },
    segmentCountActive: { color: colors.onPrimary },
    filterRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    sortBtn: {
      width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center',
      borderWidth: 1, borderColor: colors.border, backgroundColor: colors.cardBackground,
      marginLeft: 8, marginRight: hPad,
    },
    countLine: {
      fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textSecondary,
      marginHorizontal: hPad + 4, marginBottom: 10,
    },
    rowWrap: { paddingHorizontal: hPad },
    emptyState: { paddingHorizontal: 36, paddingTop: 28, paddingBottom: 44, alignItems: 'center' },
    emptyRing: {
      width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center',
      backgroundColor: colors.primaryContainer,
    },
    emptyTitle: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 21, color: colors.text, textAlign: 'center', marginTop: 18 },
    emptyText: {
      fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20, color: colors.textSecondary,
      textAlign: 'center', marginTop: 8,
    },
    emptyButton: {
      marginTop: 20, minHeight: 48, borderRadius: 24, paddingHorizontal: 24,
      alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary,
    },
    emptyButtonText: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors.onPrimary },
    heroEmpty: {
      marginHorizontal: hPad, marginTop: 8, borderRadius: layout.radius.card, padding: 22, paddingTop: 26,
      backgroundColor: colors.heroSurface, borderWidth: 1, borderColor: colors.heroBorder, overflow: 'hidden',
    },
    heroEmptyIcon: {
      width: 84, height: 84, borderRadius: 42, alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'rgba(245,241,232,0.10)',
    },
    heroEmptyTitle: {
      fontFamily: 'PlayfairDisplay_700Bold', fontSize: 24, lineHeight: 30, color: '#F5F1E8', marginTop: 28,
    },
    heroEmptyText: {
      fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 21, color: 'rgba(245,241,232,0.78)', marginTop: 8,
    },
    heroEmptyButton: {
      marginTop: 20, minHeight: 48, borderRadius: layout.radius.button, paddingHorizontal: 22,
      alignSelf: 'flex-start', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.dawn,
    },
    heroEmptyButtonText: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: '#2A1E08' },
    sortOverlay: { flex: 1, backgroundColor: colors.modalOverlay, justifyContent: 'flex-end' },
    sortSheet: {
      backgroundColor: colors.modalSurface, borderTopLeftRadius: 24, borderTopRightRadius: 24,
      paddingHorizontal: 20, paddingTop: 16, paddingBottom: 28, borderTopWidth: 1, borderColor: colors.border,
    },
    sortTitle: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 22, color: colors.text, marginBottom: 6 },
    sortOption: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      minHeight: 52, borderBottomWidth: 1, borderColor: colors.border,
    },
    sortOptionText: { fontFamily: 'Inter_500Medium', fontSize: 16, color: colors.text },
  }), [colors, layout, hPad, windowWidth]);

  // ── Pieces ─────────────────────────────────────────────────────────────
  const SectionHeader = ({ title, count, actionLabel, onAction }) => (
    <View style={styles.sectionRow}>
      <Text style={styles.sectionTitle} numberOfLines={1}>
        {title}
        {count ? <Text style={styles.sectionCount}>{`  ${count}`}</Text> : null}
      </Text>
      {actionLabel ? (
        <TouchableOpacity
          onPress={onAction}
          style={{ minHeight: 44, justifyContent: 'center' }}
          accessibilityRole="button"
        >
          <Text style={styles.sectionAction}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );

  const renderPocketCard = ({ story, text }) => {
    const catTheme = getCategoryTheme(categoryKeyOf(story), isDark);
    const accent = catTheme.textColor || colors.primaryText;
    return (
      <TouchableOpacity
        key={`pocket-${story.story_id}`}
        activeOpacity={0.86}
        onPress={() => openStory(story)}
        accessibilityRole="button"
        style={styles.pocketCard}
      >
        <Text style={[styles.pocketMark, { color: catTheme.accent || accent }]}>{'“'}</Text>
        <View style={styles.pocketEyebrow}>
          <Ionicons name="bookmark" size={13} color={accent} />
          <Text style={[styles.pocketEyebrowText, { color: accent }]} numberOfLines={1}>
            {t(story.parent_cat || story.cat, lang) || ''}
          </Text>
        </View>
        <Text style={styles.pocketText} numberOfLines={5}>{text}</Text>
        <View style={styles.pocketFooter}>
          <Text style={styles.pocketSource} numberOfLines={1}>{story.title}</Text>
          <TouchableOpacity
            onPress={() => openUseInConversation(story)}
            accessibilityRole="button"
            accessibilityLabel={t('story_detail_use_cta', lang)}
            style={styles.pocketUseBtn}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={20} color={colors.primaryText} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderStoryRow = (story, keyPrefix) => (
    <LibraryRow
      key={`${keyPrefix}-${story.story_id}`}
      story={story}
      readCount={readCountsByStory?.[String(story.story_id)] || 0}
      hasRecording={recordedStoryIds.has(String(story.story_id))}
      usageDate={usageDateById.get(String(story.story_id)) || null}
      onPress={() => openStory(story)}
      onUse={() => openUseInConversation(story)}
    />
  );

  const showTopSections = !isSearching;
  const hasTopContent = showTopSections && (continueItems.length > 0 || readLaterStories.length > 0 || pocketItems.length > 0);
  const readLaterVisible = showAllReadLater ? readLaterStories : readLaterStories.slice(0, READ_LATER_PREVIEW);
  const singleCardWidth = windowWidth - hPad * 2;
  const continueCardWidth = continueItems.length === 1 ? singleCardWidth : Math.min(330, windowWidth * 0.82);
  const continueOffsets = continueItems.map((_, i) => i * (continueCardWidth + 12));

  const listHeader = (
    <View>
      <ScreenHeader title={t('tabLibrary', lang)} subtitle={t('librarySubtitle', lang)} />
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
            <View style={{ paddingHorizontal: hPad }}>
              <ResumeCard {...continueItems[0]} width={singleCardWidth} onPress={() => openStory(continueItems[0].story)} />
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hList}
              snapToOffsets={continueOffsets}
              decelerationRate="fast"
            >
              {continueItems.map((item) => (
                <ResumeCard
                  key={`continue-${item.story.story_id}`}
                  {...item}
                  width={continueCardWidth}
                  onPress={() => openStory(item.story)}
                />
              ))}
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

      {/* ── 3. Cebimdekiler ────────────────────────────────── */}
      {showTopSections && pocketItems.length > 0 && (
        <>
          <SectionHeader title={t('libraryPocketTitle', lang)} count={pocketItems.length} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hList}>
            {pocketItems.map(renderPocketCard)}
          </ScrollView>
        </>
      )}

      {/* ── 4. Arşiv ───────────────────────────────────────── */}
      {hasTopContent ? <SectionHeader title={t('libraryArchiveTitle', lang)} /> : <View style={{ height: 16 }} />}

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
              inline
              label={item.label}
              categoryName={item.rawName || item.label}
              active={effectiveCategory === item.id}
              isDark={isDark}
              onPress={() => setActiveCategory(item.id)}
            />
          ))}
        </ScrollView>
        {visibleArchive.length > 0 && (
          <TouchableOpacity
            style={styles.sortBtn}
            onPress={() => setSortModalVisible(true)}
            accessibilityRole="button"
            accessibilityLabel={t('librarySortAction', lang)}
          >
            <Ionicons name="swap-vertical-outline" size={18} color={sortBy === 'recent' ? colors.textSecondary : colors.primaryText} />
          </TouchableOpacity>
        )}
      </View>

      {visibleArchive.length > 0 && (
        <Text style={styles.countLine}>
          {`${visibleArchive.length} ${t(visibleArchive.length === 1 ? 'onboarding_story' : 'onboarding_stories', lang)}`}
        </Text>
      )}
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
        ListEmptyComponent={emptyState.hero ? (
          <View style={styles.heroEmpty}>
            <HeroSun color={colors.dawn} />
            <View style={styles.heroEmptyIcon}>
              <LibraryEmptyArt kind={emptyState.art} accent={colors.dawn} size={52} />
            </View>
            <Text style={styles.heroEmptyTitle}>{emptyState.title}</Text>
            <Text style={styles.heroEmptyText}>{emptyState.sub}</Text>
            <TouchableOpacity
              style={styles.heroEmptyButton}
              onPress={emptyState.action}
              accessibilityRole="button"
              accessibilityLabel={emptyState.cta}
            >
              <Text style={styles.heroEmptyButtonText}>{emptyState.cta}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyRing}>
              <Ionicons name={emptyState.icon} size={32} color={colors.primaryText} />
            </View>
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

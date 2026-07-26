import React, { useMemo } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useUserData } from '../context/UserDataContext';
import { useStories } from '../context/StoriesContext';
import { useCareerPath } from '../context/CareerPathContext';
import { PATH_IDS } from '../constants/careerPath';
import { t } from '../locales/i18n';
import { getCategoryImage } from '../utils/categoryImages';
import { selectWeeklyRoute } from '../utils/careerToolkit';
import CareerPathArtwork from '../components/career/CareerPathArtwork';

const iconByPath = { exploration: 'compass-outline', depth: 'bulb-outline', transfer: 'chatbubbles-outline' };

const categoryFor = (story) => story?.parent_cat_raw || story?.parent_cat || story?.cat || '';
const storyIdFor = (story) => String(story?.story_id ?? story?.id ?? '');

const ToolkitRow = ({ row, colors, isDark, onPress, trailingIcon = 'chevron-forward' }) => {
  const image = row.category ? getCategoryImage(row.category, isDark).source : null;
  const content = (
    <>
      {image ? <Image accessible={false} source={image} style={styles.rowImage} /> : <View accessible={false} style={[styles.rowImage, styles.rowFallback, { backgroundColor: `${colors.primary}24` }]}><Ionicons name={row.icon || 'sparkles-outline'} size={20} color={colors.primary} /></View>}
      <View style={styles.rowCopy}>
        <Text selectable numberOfLines={2} style={[styles.rowTitle, { color: colors.text }]}>{row.title}</Text>
        {row.meta ? <Text selectable numberOfLines={2} style={[styles.rowMeta, { color: colors.textSecondary }]}>{row.meta}</Text> : null}
      </View>
      {trailingIcon ? <Ionicons name={trailingIcon} size={20} color={colors.textSecondary} /> : null}
    </>
  );

  const sharedStyle = [styles.row, { borderColor: colors.border, backgroundColor: colors.backgroundDark }];
  if (!onPress) return <View style={sharedStyle}>{content}</View>;
  return <TouchableOpacity accessibilityRole="button" accessibilityLabel={row.title} activeOpacity={0.78} onPress={onPress} style={sharedStyle}>{content}</TouchableOpacity>;
};

const ToolkitLock = ({ colors, lang, title }) => (
  <View style={[styles.lock, { borderColor: colors.border, backgroundColor: colors.backgroundDark }]}>
    <Ionicons name="lock-closed-outline" size={18} color={colors.textSecondary} />
    <Text selectable style={[styles.rowMeta, { color: colors.textSecondary }]}>{t('career.toolkit.lockedTool', lang, { title })}</Text>
  </View>
);

const CareerToolkitScreen = ({ navigation, route }) => {
  const { colors, layout, lang, isDark } = useTheme();
  const { career } = useCareerPath();
  const {
    categoryStats, careerTakeaways, variantUsage, completedStories, history, isPremium,
    careerSparkPackage, toggleCareerSparkPackageStory,
  } = useUserData();
  const { stories, parentCategories } = useStories();
  const pathId = route.params?.pathId || PATH_IDS.EXPLORATION;
  const hasAccess = Object.values(PATH_IDS).includes(pathId) && career?.activePath === pathId;
  const completedNodeOrders = useMemo(() => new Set((career?.paths?.[pathId] || []).filter((node) => node.status === 'completed').map((node) => node.order)), [career, pathId]);
  const hasUnlocked = (order) => completedNodeOrders.has(order);
  const storyById = useMemo(() => new Map((stories || []).map((story) => [storyIdFor(story), story])), [stories]);
  const categoryRows = useMemo(() => Object.entries(categoryStats || {}).sort(([, a], [, b]) => Number(a) - Number(b)), [categoryStats]);
  const leastCategory = useMemo(() => {
    const names = (parentCategories || []).map((item) => item.raw_name || item.name).filter(Boolean);
    return names.sort((a, b) => Number(categoryStats?.[a] || 0) - Number(categoryStats?.[b] || 0))[0] || null;
  }, [categoryStats, parentCategories]);
  const takeawayStories = useMemo(() => Object.keys(careerTakeaways || {}).map((id) => storyById.get(String(id))).filter(Boolean), [careerTakeaways, storyById]);
  const usedStories = useMemo(() => [...new Set((variantUsage || []).filter((item) => item?.action === 'mark_used').map((item) => String(item.storyId)).filter(Boolean))].map((id) => storyById.get(id)).filter(Boolean), [variantUsage, storyById]);
  const weeklyRoute = useMemo(() => selectWeeklyRoute({ stories, isPremium }), [isPremium, stories]);
  const completedStoryList = useMemo(() => (completedStories || []).map((id) => storyById.get(String(id))).filter(Boolean), [completedStories, storyById]);
  const packageCandidates = useMemo(() => {
    const source = completedStoryList.length ? completedStoryList : (history || []).map((id) => storyById.get(String(id))).filter(Boolean);
    return [...new Map(source.map((story) => [storyIdFor(story), story])).values()];
  }, [completedStoryList, history, storyById]);
  const sparkPackageStories = useMemo(() => (careerSparkPackage || []).map((id) => storyById.get(String(id))).filter(Boolean), [careerSparkPackage, storyById]);
  const synthesisPair = useMemo(() => {
    const first = completedStoryList[0];
    if (!first) return null;
    const second = completedStoryList.find((story) => categoryFor(story) !== categoryFor(first));
    return second ? [first, second] : null;
  }, [completedStoryList]);
  const insightCategoryCount = useMemo(() => new Set(takeawayStories.map(categoryFor).filter(Boolean)).size, [takeawayStories]);
  const titleKey = `careerPath.${pathId}.title`;

  const data = useMemo(() => {
    if (pathId === PATH_IDS.EXPLORATION) {
      return {
        heading: 'career.toolkit.exploration.heading',
        copy: leastCategory ? t('career.toolkit.exploration.suggestion', lang, { category: t(leastCategory, lang) }) : t('career.toolkit.exploration.empty', lang),
        rows: hasUnlocked(1) ? categoryRows.map(([name, count]) => ({ title: t(name, lang), meta: `${count}`, icon: 'pie-chart-outline' })) : [],
        routeRows: hasUnlocked(2) ? weeklyRoute.map((story) => ({ story, title: story.title || story.name, category: categoryFor(story), meta: `${completedStories?.includes(storyIdFor(story)) ? '✓' : '○'} ${t(categoryFor(story), lang)}` })) : [],
        notes: hasUnlocked(3) ? [{ titleKey: 'career.toolkit.exploration.atlasTitle', copyKey: 'career.toolkit.exploration.atlasSummary', values: { categories: categoryRows.filter(([, count]) => Number(count) > 0).length, stories: completedStoryList.length }, rows: completedStoryList.slice(0, 3).map((story) => ({ title: story.title || story.name, meta: t(categoryFor(story), lang) })) }] : [],
      };
    }
    if (pathId === PATH_IDS.DEPTH) {
      return {
        heading: 'career.toolkit.depth.heading',
        copy: takeawayStories.length ? t('career.toolkit.depth.ready', lang) : t('career.toolkit.depth.empty', lang),
        rows: hasUnlocked(1) ? takeawayStories.map((story) => ({ story, title: story.title || story.name, category: categoryFor(story), meta: t(categoryFor(story), lang) })) : [],
        notes: hasUnlocked(2) ? [
          { titleKey: 'career.toolkit.depth.synthesisTitle', copyKey: synthesisPair ? 'career.toolkit.depth.synthesisQuestion' : 'career.toolkit.depth.synthesisEmpty', values: synthesisPair ? { first: synthesisPair[0].title || synthesisPair[0].name, second: synthesisPair[1].title || synthesisPair[1].name } : {} },
        ] : [],
        dossier: hasUnlocked(3) ? { titleKey: 'career.toolkit.depth.dossierTitle', copyKey: takeawayStories.length ? 'career.toolkit.depth.dossierSummary' : 'career.toolkit.depth.dossierEmpty', values: { count: takeawayStories.length, categories: insightCategoryCount } } : null,
      };
    }
    return {
      heading: 'career.toolkit.transfer.heading',
      copy: usedStories.length ? t('career.toolkit.transfer.ready', lang) : t('career.toolkit.transfer.empty', lang),
      rows: hasUnlocked(1) ? usedStories.map((story) => ({ story, title: story.title || story.name, category: categoryFor(story), meta: t(categoryFor(story), lang) })) : [],
    };
  }, [categoryRows, completedStories, completedStoryList, hasUnlocked, insightCategoryCount, lang, leastCategory, pathId, synthesisPair, takeawayStories, usedStories, weeklyRoute]);

  const openStory = (story) => navigation.navigate('StoryDetail', { story });
  const openConversation = (story) => navigation.navigate('UseInConversation', { story });

  const renderHero = (locked = false) => (
    <View style={[styles.hero, { borderColor: colors.border }]}>
      <CareerPathArtwork pathId={locked ? PATH_IDS.EXPLORATION : pathId} style={styles.artwork} />
      <View style={styles.heroContent}>
        <View style={styles.iconPill}><Ionicons name={locked ? 'lock-closed-outline' : iconByPath[pathId]} size={23} color="#FFFFFF" /></View>
        <Text selectable style={[styles.path, { color: '#FFFFFF' }]}>{t(locked ? 'career.toolkit.unavailableTitle' : titleKey, lang)}</Text>
        <Text selectable style={[styles.copy, { color: 'rgba(255,255,255,0.80)' }]}>{t(locked ? 'career.toolkit.unavailableBody' : data.heading, lang)}</Text>
      </View>
    </View>
  );

  if (!hasAccess) {
    return <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentInsetAdjustmentBehavior="automatic" contentContainerStyle={[styles.content, { paddingHorizontal: layout.padding.horizontal, paddingBottom: 36 }]}><TouchableOpacity accessibilityRole="button" accessibilityLabel={t('career.close', lang)} onPress={() => navigation.goBack()} style={[styles.back, { borderColor: colors.border, backgroundColor: colors.backgroundDark }]}><Ionicons name="chevron-back" size={20} color={colors.text} /></TouchableOpacity>{renderHero(true)}</ScrollView>;
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentInsetAdjustmentBehavior="automatic" contentContainerStyle={[styles.content, { paddingHorizontal: layout.padding.horizontal, paddingBottom: 36 }]}>
      <TouchableOpacity accessibilityRole="button" accessibilityLabel={t('career.close', lang)} onPress={() => navigation.goBack()} style={[styles.back, { borderColor: colors.border, backgroundColor: colors.backgroundDark }]}><Ionicons name="chevron-back" size={20} color={colors.text} /></TouchableOpacity>
      {renderHero()}
      <View style={styles.section}>
        <Text selectable style={[styles.copy, { color: colors.textSecondary }]}>{data.copy}</Text>
        {hasUnlocked(1) ? (data.rows.length ? data.rows.map((row, index) => <ToolkitRow key={`${row.title}-${index}`} row={row} colors={colors} isDark={isDark} onPress={pathId === PATH_IDS.TRANSFER && row.story ? () => openConversation(row.story) : row.story ? () => openStory(row.story) : undefined} />) : <View style={[styles.empty, { borderColor: colors.border }]}><Text selectable style={[styles.rowMeta, { color: colors.textSecondary }]}>{t('career.toolkit.emptyList', lang)}</Text></View>) : <ToolkitLock colors={colors} lang={lang} title={t('career.toolkit.firstTool', lang)} />}
      </View>
      {pathId === PATH_IDS.EXPLORATION ? <View style={styles.section}><Text selectable style={[styles.sectionTitle, { color: colors.text }]}>{t('career.toolkit.exploration.weeklyRoute', lang)}</Text>{hasUnlocked(2) ? data.routeRows?.map((row, index) => <ToolkitRow key={`${row.title}-${index}`} row={row} colors={colors} isDark={isDark} onPress={() => openStory(row.story)} trailingIcon={row.meta.startsWith('✓') ? 'checkmark-circle' : 'arrow-forward-circle-outline'} />) : <ToolkitLock colors={colors} lang={lang} title={t('career.toolkit.secondTool', lang)} />}</View> : null}
      {data.notes?.map((note) => <View key={note.titleKey} style={[styles.note, { borderColor: colors.border, backgroundColor: colors.backgroundDark }]}><Text selectable style={[styles.sectionTitle, { color: colors.text }]}>{t(note.titleKey, lang)}</Text><Text selectable style={[styles.copy, { color: colors.textSecondary }]}>{t(note.copyKey, lang, note.values)}</Text>{note.rows?.map((item, index) => <Text key={`${item.title}-${index}`} selectable style={[styles.rowMeta, { color: colors.textSecondary }]}>{`• ${item.title} · ${item.meta}`}</Text>)}</View>)}
      {pathId === PATH_IDS.DEPTH ? <View style={styles.section}>{data.dossier ? <View style={[styles.note, { borderColor: colors.border, backgroundColor: colors.backgroundDark }]}><Text selectable style={[styles.sectionTitle, { color: colors.text }]}>{t(data.dossier.titleKey, lang)}</Text><Text selectable style={[styles.copy, { color: colors.textSecondary }]}>{t(data.dossier.copyKey, lang, data.dossier.values)}</Text></View> : <ToolkitLock colors={colors} lang={lang} title={t('career.toolkit.thirdTool', lang)} />}</View> : null}
      {pathId === PATH_IDS.TRANSFER ? <View style={styles.section}>
        <View style={[styles.note, { borderColor: colors.border, backgroundColor: colors.backgroundDark }]}><Text selectable style={[styles.sectionTitle, { color: colors.text }]}>{t('career.toolkit.transfer.packageTitle', lang)}</Text><Text selectable style={[styles.copy, { color: colors.textSecondary }]}>{t('career.toolkit.transfer.packageCopy', lang, { count: sparkPackageStories.length })}</Text></View>
        {!hasUnlocked(3) ? <ToolkitLock colors={colors} lang={lang} title={t('career.toolkit.thirdTool', lang)} /> : packageCandidates.length ? packageCandidates.map((story) => {
          const id = storyIdFor(story);
          const selected = (careerSparkPackage || []).includes(id);
          const atLimit = !selected && (careerSparkPackage || []).length >= 5;
          const row = { story, title: story.title || story.name, category: categoryFor(story), meta: selected ? t('career.toolkit.transfer.packageSelected', lang) : atLimit ? t('career.toolkit.transfer.packageLimit', lang) : t('career.toolkit.transfer.packageAdd', lang) };
          return <ToolkitRow key={id} row={row} colors={colors} isDark={isDark} trailingIcon={selected ? 'checkmark-circle' : 'add-circle-outline'} onPress={atLimit ? undefined : () => toggleCareerSparkPackageStory(id)} />;
        }) : <View style={[styles.empty, { borderColor: colors.border }]}><Text selectable style={[styles.rowMeta, { color: colors.textSecondary }]}>{t('career.toolkit.transfer.packageEmpty', lang)}</Text></View>}
      </View> : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: { gap: 20 },
  back: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  hero: { minHeight: 224, borderWidth: 1, borderRadius: 24, overflow: 'hidden', justifyContent: 'flex-end' },
  artwork: { ...StyleSheet.absoluteFillObject, borderRadius: 23 },
  heroContent: { padding: 20, gap: 8, zIndex: 1 },
  iconPill: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', marginBottom: 2, backgroundColor: 'rgba(255,255,255,0.16)' },
  path: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 29 },
  copy: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 21 },
  section: { gap: 10 },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 16 },
  note: { borderWidth: 1, borderRadius: 18, padding: 16, gap: 7 },
  lock: { minHeight: 52, borderWidth: 1, borderRadius: 16, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 10 },
  row: { minHeight: 76, borderWidth: 1, borderRadius: 18, padding: 8, flexDirection: 'row', alignItems: 'center', gap: 11 },
  rowImage: { width: 56, height: 56, borderRadius: 14 },
  rowFallback: { alignItems: 'center', justifyContent: 'center' },
  rowCopy: { flex: 1, gap: 3 },
  rowTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 15 },
  rowMeta: { fontFamily: 'Inter_400Regular', fontSize: 13 },
  empty: { borderWidth: 1, borderStyle: 'dashed', borderRadius: 16, padding: 16 },
});

export default CareerToolkitScreen;

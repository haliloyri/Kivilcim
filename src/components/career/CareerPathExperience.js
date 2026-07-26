import React, { useEffect, useRef, useState } from 'react';
import { ANALYTICS_EVENTS, trackEvent } from '../../utils/analytics';
import { AccessibilityInfo, findNodeHandle, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useUserData } from '../../context/UserDataContext';
import { useCareerPath } from '../../context/CareerPathContext';
import { PATH_DEFINITIONS } from '../../constants/careerPath';
import { getLegacyBadgeIds } from '../../db/userDb';
import { t } from '../../locales/i18n';
import { resolveCareerActionDestination } from '../../utils/careerNavigation';
import BadgeIcon from '../BadgeIcon';
import CareerNodeSheet from './CareerNodeSheet';
import CareerPathSwitchSheet from './CareerPathSwitchSheet';
import CareerNodeMark from './CareerNodeMark';
import CareerRhythmSection from './CareerRhythmSection';

const KIVILCIM_HERO = require('../../../assets/career/kivilcim-yolu-hero-v1.png');

const REQUIREMENT_ICONS = {
  stories: 'book-outline',
  categories: 'compass-outline',
  deepInteractions: 'bulb-outline',
  applications: 'chatbubbles-outline',
  activeDays: 'calendar-outline',
};

const CareerPathExperience = ({ navigation }) => {
  const { colors, layout, isDark, lang } = useTheme();
  const { todayReadsCount, preferences, streak, totalReads, longestStreak, isPremium, streakFreezeCredits, streakFreezeDates, useStreakFreeze } = useUserData();
  const { loading, error, isOffline, career, refreshCareer, selectPath, switchPath, pathSwitchRequested, consumePathSwitchRequest } = useCareerPath();
  const [showPathChoices, setShowPathChoices] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [pendingPath, setPendingPath] = useState(null);
  const [legacyBadgeIds, setLegacyBadgeIds] = useState([]);
  const [showLegacyBadges, setShowLegacyBadges] = useState(false);
  const nodeButtonRefs = useRef(new Map());
  const hasTrackedView = useRef(false);
  const hasTrackedExposure = useRef(false);
  const dailyTarget = preferences?.time?.dailyStoryTarget || 2;
  const dailyComplete = todayReadsCount >= dailyTarget;

  useEffect(() => {
    if (!pathSwitchRequested || !career?.activePath) return;
    setShowPathChoices(true);
    consumePathSwitchRequest();
  }, [career?.activePath, consumePathSwitchRequest, pathSwitchRequested]);

  useEffect(() => {
    if (!career || hasTrackedView.current) return;
    hasTrackedView.current = true;
    trackEvent(ANALYTICS_EVENTS.CAREER_PATH_VIEWED, { careerVersion: 1, pathId: career.activePath, source: 'progress_tab' });
    if (career.isPathSelectionDue) trackEvent(ANALYTICS_EVENTS.CAREER_PATH_INTRO_VIEWED, { careerVersion: 1, source: 'progress_tab' });
  }, [career]);

  useEffect(() => {
    getLegacyBadgeIds('default').then((ids) => setLegacyBadgeIds(ids || [])).catch(() => setLegacyBadgeIds([]));
  }, [career]);

  useEffect(() => {
    if (!career || hasTrackedExposure.current) return;
    hasTrackedExposure.current = true;
    trackEvent(ANALYTICS_EVENTS.CAREER_PATH_EXPOSURE, { careerVersion: 1, pathId: career.activePath, source: 'career_path_v1_render' });
  }, [career]);

  const openNextAction = () => {
    trackEvent(ANALYTICS_EVENTS.CAREER_NEXT_ACTION_CLICKED, { careerVersion: 1, pathId: career?.activePath, actionType: career?.nextAction?.type, missingRequirement: career?.nextAction?.missingRequirement, source: 'progress_tab' });
    const destination = resolveCareerActionDestination({ nextAction: career?.nextAction, dailyComplete });
    if (destination) navigation.navigate(destination.route);
  };

  const closeNodeSheet = () => {
    const nodeId = selectedNode?.id;
    setSelectedNode(null);
    requestAnimationFrame(() => {
      const nodeHandle = findNodeHandle(nodeButtonRefs.current.get(nodeId));
      if (nodeHandle) AccessibilityInfo.setAccessibilityFocus(nodeHandle);
    });
  };

  if (loading || !career) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}> 
        <Ionicons name="sparkles-outline" size={28} color={colors.primary} />
        <Text selectable style={[styles.loading, { color: colors.textSecondary }]}>{t('career.loading', lang)}</Text>
        {error ? <Text selectable style={[styles.error, { color: colors.textSecondary }]}>{t('career.unavailable', lang)}</Text> : null}
        {error ? <TouchableOpacity accessibilityRole="button" accessibilityLabel={t('career.retry', lang)} onPress={() => refreshCareer()} style={[styles.retryButton, { borderColor: colors.border, backgroundColor: colors.backgroundDark }]}><Ionicons name="refresh-outline" size={17} color={colors.primary} /><Text selectable style={[styles.retryText, { color: colors.text }]}>{t('career.retry', lang)}</Text></TouchableOpacity> : null}
      </View>
    );
  }

  const activePathDefinition = PATH_DEFINITIONS.find((path) => path.id === career.activePath);
  const timeline = [...career.commonNodes, ...(career.activePath ? career.paths[career.activePath] : [])];
  const journeySummary = [
    ['career.summary.stories', career.metrics?.stories],
    ['career.summary.categories', career.metrics?.categories],
    ['career.summary.insights', career.metrics?.deepInteractions],
    ['career.summary.applications', career.metrics?.applications],
    ['career.summary.activeDays', career.metrics?.activeDays],
  ];
  const actionLabel = !dailyComplete
    ? t('career.finishDailyGoal', lang)
    : career.nextAction?.type === 'path_complete'
      ? t('career.pathComplete', lang)
      : t(career.nextAction?.ctaKey || 'career.continue', lang);
  const completedNodeCount = timeline.filter((node) => node.status === 'completed').length;
  const showsDeepInteractionHelp = career.nextNode?.requirementRows?.some((requirement) => requirement.type === 'deepInteractions');

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={[styles.content, { paddingHorizontal: layout.padding.horizontal, paddingBottom: 36 }]}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View style={styles.heading}>
        <View>
          <Text selectable style={[styles.title, { color: colors.text }]}>{t('career.title', lang)}</Text>
          <Text selectable style={[styles.subtitle, { color: colors.textSecondary }]}>{t('career.subtitle', lang)}</Text>
        </View>
      </View>

      {isOffline ? <View accessibilityRole="alert" style={[styles.offlineBanner, { borderColor: `${colors.primary}55`, backgroundColor: `${colors.primary}12` }]}><Ionicons name="cloud-offline-outline" size={18} color={colors.primary} /><Text selectable style={[styles.offlineCopy, { color: colors.textSecondary }]}>{t('career.offline', lang)}</Text></View> : null}

      <ImageBackground source={KIVILCIM_HERO} imageStyle={styles.heroImage} style={styles.hero}>
        <View style={styles.heroScrim} />
        <View style={styles.heroContent}>
          <View style={styles.heroKicker}><Ionicons name="sparkles-outline" size={14} color="#F9D783" /><Text selectable style={styles.heroKickerText}>{activePathDefinition ? t(activePathDefinition.titleKey, lang) : t('career.sharedPath', lang)}</Text></View>
          <Text selectable style={styles.rank}>{t(career.displayedTitle, lang)}</Text>
          <Text selectable style={styles.heroCopy}>{career.isPathSelectionDue ? t('career.choosePathCopy', lang) : t('career.heroCopy', lang)}</Text>
          <View style={styles.heroProgress}><Ionicons name="map-outline" size={15} color="#F9D783" /><Text selectable style={styles.heroProgressText}>{`${completedNodeCount}/${timeline.length} · ${t('career.timeline', lang)}`}</Text></View>
        </View>
      </ImageBackground>

      {career.activePath ? <TouchableOpacity accessibilityRole="button" accessibilityLabel={t('career.toolkit.open', lang)} onPress={() => navigation.navigate('CareerToolkit', { pathId: career.activePath })} style={[styles.toolkitLink, { borderColor: colors.border, backgroundColor: colors.background }]}><Ionicons name="construct-outline" size={18} color={colors.primary} /><Text selectable style={[styles.smallAction, { color: colors.text }]}>{t('career.toolkit.open', lang)}</Text><Ionicons name="chevron-forward" size={17} color={colors.textSecondary} /></TouchableOpacity> : null}

      {career.isPathSelectionDue ? (
        <View style={styles.section}>
          <Text selectable style={[styles.sectionTitle, { color: colors.text }]}>{t('career.choosePathTitle', lang)}</Text>
          <Text selectable style={[styles.sectionCopy, { color: colors.textSecondary }]}>{t('career.choosePathCopy', lang)}</Text>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel={t('career.choosePathTitle', lang)} onPress={() => navigation.navigate('CareerPathSelection')} style={[styles.cta, { backgroundColor: colors.primary }]}>
            <Text selectable style={styles.ctaText}>{t('career.choosePathTitle', lang)}</Text>
            <Ionicons name="arrow-forward" size={17} color={isDark ? colors.backgroundDark : '#FFFFFF'} />
          </TouchableOpacity>
        </View>
      ) : showPathChoices ? (
        <View style={styles.section}>
          <Text selectable style={[styles.sectionTitle, { color: colors.text }]}>{t('career.switchPath', lang)}</Text>
          <Text selectable style={[styles.sectionCopy, { color: colors.textSecondary }]}>{t('career.choosePathCopy', lang)}</Text>
          {PATH_DEFINITIONS.map((path) => (
            <TouchableOpacity
              key={path.id}
              accessibilityRole="button"
              accessibilityLabel={t(path.titleKey, lang)}
              onPress={async () => {
                if (career.activePath && path.id !== career.activePath) setPendingPath(path);
                else { await selectPath(path.id); setShowPathChoices(false); }
              }}
              style={[styles.pathOption, { borderColor: colors.border, backgroundColor: colors.background }]}
            >
              <View style={[styles.pathIcon, { backgroundColor: `${colors.primary}18` }]}>
                <Ionicons name={path.id === 'exploration' ? 'compass-outline' : path.id === 'depth' ? 'bulb-outline' : 'chatbubbles-outline'} size={19} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text selectable style={[styles.pathName, { color: colors.text }]}>{t(path.titleKey, lang)}</Text>
                <Text selectable style={[styles.pathDescription, { color: colors.textSecondary }]}>{t(path.descriptionKey, lang)}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.section}>
          <Text selectable style={[styles.sectionTitle, { color: colors.text }]}>{t('career.nextStep', lang)}</Text>
          <View style={[styles.nextCard, { backgroundColor: colors.background, borderColor: colors.border }]}> 
            <Text selectable style={[styles.nextTitle, { color: colors.text }]}>{career.nextNode ? t(career.nextNode.titleKey, lang) : t('career.pathComplete', lang)}</Text>
            {career.nextNode?.requirementRows?.map((requirement) => (
              <View key={requirement.type} style={styles.requirement}>
                <Ionicons name={REQUIREMENT_ICONS[requirement.type]} size={16} color={requirement.completed ? colors.primary : colors.textSecondary} />
                <Text selectable style={[styles.requirementLabel, { color: colors.textSecondary }]}>{t(requirement.labelKey, lang)}</Text>
                <Text selectable style={[styles.requirementValue, { color: requirement.completed ? colors.primary : colors.text }]}>{`${requirement.current}/${requirement.target}`}</Text>
              </View>
            ))}
            {showsDeepInteractionHelp ? (
              <View style={[styles.requirementHelp, { backgroundColor: colors.backgroundDark }]}> 
                <Ionicons name="bulb-outline" size={17} color={colors.primary} />
                <Text selectable style={[styles.requirementHelpCopy, { color: colors.textSecondary }]}>{t('career.requirementHelp.deepInteractions', lang)}</Text>
              </View>
            ) : null}
            {!['path_complete', 'today_complete'].includes(career.nextAction?.type) ? (
              <TouchableOpacity accessibilityRole="button" accessibilityLabel={actionLabel} onPress={openNextAction} style={[styles.cta, { backgroundColor: colors.primary }]}>
                <Text selectable style={styles.ctaText}>{actionLabel}</Text>
                <Ionicons name="arrow-forward" size={17} color={isDark ? colors.backgroundDark : '#FFFFFF'} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.sectionHeading}>
          <Text selectable style={[styles.sectionTitle, { color: colors.text }]}>{t('career.timeline', lang)}</Text>
          {career.activePath ? (
            <TouchableOpacity accessibilityRole="button" accessibilityLabel={t('career.switchPath', lang)} onPress={() => setShowPathChoices(true)}>
              <Text selectable style={[styles.smallAction, { color: colors.primary }]}>{t('career.switchPath', lang)}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={[styles.timeline, { borderColor: colors.border, backgroundColor: colors.background }]}> 
          {timeline.map((node) => (
            <TouchableOpacity ref={(instance) => { if (instance) nodeButtonRefs.current.set(node.id, instance); else nodeButtonRefs.current.delete(node.id); }} key={node.id} accessibilityRole="button" accessibilityLabel={`${t(node.titleKey, lang)}. ${t(`career.nodeState.${node.status}`, lang)}.`} accessibilityHint={node.requirementRows?.map((requirement) => `${t(requirement.labelKey, lang)} ${requirement.current}/${requirement.target}`).join(', ')} onPress={() => { trackEvent(ANALYTICS_EVENTS.CAREER_NODE_OPENED, { careerVersion: 1, pathId: node.pathId, nodeId: node.id, nodeState: node.status, source: 'timeline' }); setSelectedNode(node); }} style={styles.timelineRow}>
              <CareerNodeMark node={node} status={node.status} isDark={isDark} size={28} />
              <View style={{ flex: 1 }}>
                <Text selectable style={[styles.nodeName, { color: node.status === 'future' ? colors.textSecondary : colors.text }]}>{t(node.titleKey, lang)}</Text>
                <Text selectable style={[styles.nodeState, { color: colors.textSecondary }]}>{t(`career.nodeState.${node.status}`, lang)}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.section}>
        <Text selectable style={[styles.sectionTitle, { color: colors.text }]}>{t('career.summary.title', lang)}</Text>
        <Text selectable style={[styles.sectionCopy, { color: colors.textSecondary }]}>{t('career.summary.copy', lang)}</Text>
        <View style={[styles.summaryGrid, { borderColor: colors.border, backgroundColor: colors.background }]}> 
          {journeySummary.map(([labelKey, value]) => <View key={labelKey} style={styles.summaryItem}><Text selectable style={[styles.summaryValue, { color: colors.primary }]}>{String(value || 0)}</Text><Text selectable style={[styles.summaryLabel, { color: colors.textSecondary }]}>{t(labelKey, lang)}</Text></View>)}
        </View>
      </View>
      <CareerRhythmSection totalReads={totalReads} streak={streak} longestStreak={longestStreak} todayReadsCount={todayReadsCount} isPremium={isPremium} streakFreezeCredits={streakFreezeCredits} streakFreezeDates={streakFreezeDates} onUseFreeze={useStreakFreeze} onOpenPaywall={() => navigation.navigate('Paywall', { source: 'career_rhythm_streak_freeze', reason: 'streak_freeze' })} />
      {legacyBadgeIds.length ? <View style={styles.section}>
        <TouchableOpacity accessibilityRole="button" accessibilityState={{ expanded: showLegacyBadges }} accessibilityLabel={t('career.legacy.title', lang)} onPress={() => setShowLegacyBadges((visible) => !visible)} style={[styles.legacyHeader, { borderColor: colors.border, backgroundColor: colors.backgroundDark }]}>
          <View style={{ flex: 1 }}><Text selectable style={[styles.sectionTitle, { color: colors.text }]}>{t('career.legacy.title', lang)}</Text><Text selectable style={[styles.sectionCopy, { color: colors.textSecondary }]}>{t('career.legacy.copy', lang, { count: legacyBadgeIds.length })}</Text></View><Ionicons name={showLegacyBadges ? 'chevron-up' : 'chevron-down'} size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        {showLegacyBadges ? <View style={[styles.legacyGrid, { borderColor: colors.border, backgroundColor: colors.background }]}>{legacyBadgeIds.map((id) => <View key={id} accessible accessibilityLabel={t('career.legacy.badgeLabel', lang)} style={styles.legacyBadge}><BadgeIcon badge={{ id }} earned isDark={isDark} size={44} /></View>)}</View> : null}
      </View> : null}
      <CareerNodeSheet node={selectedNode} onClose={closeNodeSheet} />
      <CareerPathSwitchSheet path={pendingPath} currentTitleKey={career.profileTitle} nextTitleKey={career.paths[pendingPath?.id]?.filter((node) => node.status === 'completed').slice(-1)[0]?.titleKey || 'careerNode.traveler.title'} onCancel={() => setPendingPath(null)} onConfirm={async () => { await switchPath(pendingPath.id); setPendingPath(null); setShowPathChoices(false); }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, padding: 24 },
  loading: { fontFamily: 'Inter_500Medium', fontSize: 14 },
  error: { fontFamily: 'Inter_400Regular', fontSize: 13, textAlign: 'center' },
  retryButton: { minHeight: 44, borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 7 },
  retryText: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  content: { gap: 22 },
  heading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8 },
  title: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 28 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 13, marginTop: 3 },
  offlineBanner: { minHeight: 48, borderWidth: 1, borderRadius: 15, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', gap: 9 },
  offlineCopy: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 13, lineHeight: 18 },
  hero: { minHeight: 242, borderRadius: 24, overflow: 'hidden', justifyContent: 'flex-end' },
  heroImage: { borderRadius: 24, resizeMode: 'cover' },
  heroScrim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(4, 12, 35, 0.18)' },
  heroContent: { padding: 20, gap: 8 },
  heroKicker: { alignSelf: 'flex-start', minHeight: 28, paddingHorizontal: 10, borderRadius: 14, backgroundColor: 'rgba(8, 18, 45, 0.52)', borderWidth: 1, borderColor: 'rgba(249, 215, 131, 0.44)', flexDirection: 'row', alignItems: 'center', gap: 5 },
  heroKickerText: { color: '#FFFFFF', fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 0.7, textTransform: 'uppercase' },
  rank: { color: '#FFFFFF', fontFamily: 'PlayfairDisplay_700Bold', fontSize: 31 },
  heroCopy: { color: 'rgba(255,255,255,0.87)', fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20, maxWidth: '93%' },
  heroProgress: { alignSelf: 'flex-start', minHeight: 29, paddingHorizontal: 10, borderRadius: 15, backgroundColor: 'rgba(8, 18, 45, 0.52)', flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 },
  heroProgressText: { color: '#FFFFFF', fontFamily: 'Inter_600SemiBold', fontSize: 11, fontVariant: ['tabular-nums'] },
  toolkitLink: { minHeight: 50, borderRadius: 15, borderWidth: 1, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 9 },
  section: { gap: 10 },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 17 },
  sectionCopy: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20 },
  pathOption: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, borderWidth: 1 },
  pathIcon: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center', borderRadius: 19 },
  pathName: { fontFamily: 'Inter_600SemiBold', fontSize: 15 },
  pathDescription: { fontFamily: 'Inter_400Regular', fontSize: 12, marginTop: 2 },
  nextCard: { borderWidth: 1, borderRadius: 18, padding: 16, gap: 11 },
  nextTitle: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 21 },
  requirement: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  requirementLabel: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 13 },
  requirementValue: { fontFamily: 'Inter_600SemiBold', fontSize: 13, fontVariant: ['tabular-nums'] },
  requirementHelp: { borderRadius: 12, padding: 11, flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  requirementHelpCopy: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 18 },
  cta: { minHeight: 46, marginTop: 4, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 13 },
  ctaText: { color: '#FFFFFF', fontFamily: 'Inter_700Bold', fontSize: 14 },
  smallAction: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  summaryGrid: { borderWidth: 1, borderRadius: 18, padding: 14, flexDirection: 'row', flexWrap: 'wrap', rowGap: 16 },
  summaryItem: { width: '33.333%', gap: 2 },
  summaryValue: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 24, fontVariant: ['tabular-nums'] },
  summaryLabel: { fontFamily: 'Inter_500Medium', fontSize: 11, lineHeight: 15 },
  legacyHeader: { minHeight: 76, borderWidth: 1, borderRadius: 18, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', gap: 12 },
  legacyGrid: { borderWidth: 1, borderRadius: 18, padding: 14, flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  legacyBadge: { width: 44, height: 44 },
  timeline: { borderWidth: 1, borderRadius: 18, padding: 16, gap: 16 },
  timelineRow: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  nodeName: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  nodeState: { fontFamily: 'Inter_400Regular', fontSize: 12, marginTop: 1 },
});

export default CareerPathExperience;

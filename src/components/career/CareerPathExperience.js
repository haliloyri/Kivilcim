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
import { buildCareerPreview, CAREER_PREVIEW_SCENARIOS } from '../../utils/careerPreview';
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
  const { todayReadsCount, streak, totalReads, longestStreak, isPremium, streakFreezeCredits, streakFreezeDates, useStreakFreeze } = useUserData();
  const { loading, error, isOffline, career: persistedCareer, refreshCareer, selectPath, switchPath, pathSwitchRequested, consumePathSwitchRequest, conditionsRequested, consumeConditionsRequest } = useCareerPath();
  const [showPathChoices, setShowPathChoices] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [pendingPath, setPendingPath] = useState(null);
  const [legacyBadgeIds, setLegacyBadgeIds] = useState([]);
  const [showLegacyBadges, setShowLegacyBadges] = useState(false);
  const [showConditions, setShowConditions] = useState(false);
  const [showPreviewControls, setShowPreviewControls] = useState(false);
  const [previewScenarioId, setPreviewScenarioId] = useState(null);
  const nodeButtonRefs = useRef(new Map());
  const scrollRef = useRef(null);
  const conditionsTitleRef = useRef(null);
  const conditionsSectionY = useRef(0);
  const hasTrackedView = useRef(false);
  const hasTrackedExposure = useRef(false);
  const previewCareer = __DEV__ ? buildCareerPreview(previewScenarioId) : null;
  const isPreviewing = Boolean(previewCareer);
  const career = previewCareer || persistedCareer;

  useEffect(() => navigation.addListener('blur', () => {
    setPreviewScenarioId(null);
    setShowPreviewControls(false);
    setShowConditions(false);
  }), [navigation]);

  useEffect(() => {
    if (isPreviewing || !pathSwitchRequested || !persistedCareer?.activePath) return;
    setShowPathChoices(true);
    consumePathSwitchRequest();
  }, [persistedCareer?.activePath, consumePathSwitchRequest, isPreviewing, pathSwitchRequested]);

  const focusConditions = () => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ y: Math.max(0, conditionsSectionY.current - 12), animated: true });
      const nodeHandle = findNodeHandle(conditionsTitleRef.current);
      if (nodeHandle) AccessibilityInfo.setAccessibilityFocus(nodeHandle);
    });
  };

  const toggleConditions = () => {
    setShowConditions((visible) => !visible);
  };

  useEffect(() => {
    if (showConditions) focusConditions();
  }, [showConditions]);

  useEffect(() => {
    if (isPreviewing || !conditionsRequested || !career?.nextNode) return;
    // If a promotion lands during navigation, the current next node is the
    // only useful target; open that rather than leaving the request invisible.
    setShowConditions(true);
    consumeConditionsRequest();
  }, [career?.nextNode, conditionsRequested, consumeConditionsRequest, isPreviewing]);

  useEffect(() => {
    if (!career || isPreviewing || hasTrackedView.current) return;
    hasTrackedView.current = true;
    trackEvent(ANALYTICS_EVENTS.CAREER_PATH_VIEWED, { careerVersion: 1, pathId: career.activePath, source: 'progress_tab' });
    if (career.isPathSelectionDue) trackEvent(ANALYTICS_EVENTS.CAREER_PATH_INTRO_VIEWED, { careerVersion: 1, source: 'progress_tab' });
  }, [career, isPreviewing]);

  useEffect(() => {
    getLegacyBadgeIds('default').then((ids) => setLegacyBadgeIds(ids || [])).catch(() => setLegacyBadgeIds([]));
  }, [persistedCareer]);

  useEffect(() => {
    if (!career || isPreviewing || hasTrackedExposure.current) return;
    hasTrackedExposure.current = true;
    trackEvent(ANALYTICS_EVENTS.CAREER_PATH_EXPOSURE, { careerVersion: 1, pathId: career.activePath, source: 'career_path_v1_render' });
  }, [career, isPreviewing]);

  const openNextAction = () => {
    if (isPreviewing) return;
    trackEvent(ANALYTICS_EVENTS.CAREER_NEXT_ACTION_CLICKED, { careerVersion: 1, pathId: career?.activePath, actionType: career?.nextAction?.type, missingRequirement: career?.nextAction?.missingRequirement, source: 'progress_tab' });
    const destination = resolveCareerActionDestination({ nextAction: career?.nextAction });
    if (destination) navigation.navigate(destination.route, destination.params);
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
  const actionLabel = career.nextAction?.type === 'path_complete'
      ? t('career.pathComplete', lang)
      : career.nextAction?.type === 'advance'
        ? t(`career.primaryAction.${career.nextAction?.missingRequirement || 'stories'}`, lang)
        : t(career.nextAction?.ctaKey || 'career.continue', lang);
  const completedCommonNodes = career.commonNodes.filter((node) => node.status === 'completed').length;
  const completedActiveNodes = career.activePath ? career.paths[career.activePath].filter((node) => node.status === 'completed').length : 0;
  const heroProgressLabel = career.activePath && completedCommonNodes === career.commonNodes.length
    ? t('career.heroProgress.path', lang, { path: t(activePathDefinition.titleKey, lang), completed: completedActiveNodes, total: career.paths[career.activePath].length })
    : t('career.heroProgress.common', lang, { completed: completedCommonNodes, total: career.commonNodes.length });
  const showsDeepInteractionHelp = career.nextNode?.requirementRows?.some((requirement) => requirement.type === 'deepInteractions');

  return (
    <ScrollView
      ref={scrollRef}
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

      {__DEV__ ? <View style={[styles.previewPanel, { borderColor: `${colors.primary}66`, backgroundColor: `${colors.primary}10` }]}>
        <TouchableOpacity accessibilityRole="button" accessibilityState={{ expanded: showPreviewControls }} accessibilityLabel={t('career.preview.toggle', lang)} onPress={() => setShowPreviewControls((visible) => !visible)} style={styles.previewToggle}>
          <View style={{ flex: 1 }}><Text selectable style={[styles.previewTitle, { color: colors.text }]}>{t('career.preview.toggle', lang)}</Text><Text selectable style={[styles.previewCopy, { color: colors.textSecondary }]}>{t(isPreviewing ? 'career.preview.activeNotice' : 'career.preview.copy', lang)}</Text></View><Ionicons name={showPreviewControls ? 'chevron-up' : 'chevron-down'} size={20} color={colors.primary} />
        </TouchableOpacity>
        {showPreviewControls ? <View style={styles.previewChoices}>
          {CAREER_PREVIEW_SCENARIOS.map((scenario) => <TouchableOpacity key={scenario.id} accessibilityRole="button" accessibilityState={{ selected: previewScenarioId === scenario.id }} accessibilityLabel={t(scenario.labelKey, lang)} onPress={() => { setPreviewScenarioId(scenario.id); setShowConditions(false); setShowPathChoices(false); setSelectedNode(null); }} style={[styles.previewChoice, { borderColor: previewScenarioId === scenario.id ? colors.primary : colors.border, backgroundColor: previewScenarioId === scenario.id ? `${colors.primary}18` : colors.background }]}><Text selectable style={[styles.previewChoiceText, { color: previewScenarioId === scenario.id ? colors.primary : colors.text }]}>{t(scenario.labelKey, lang)}</Text></TouchableOpacity>)}
          {isPreviewing ? <TouchableOpacity accessibilityRole="button" accessibilityLabel={t('career.preview.exit', lang)} onPress={() => setPreviewScenarioId(null)} style={[styles.previewExit, { borderColor: colors.border }]}><Text selectable style={[styles.smallAction, { color: colors.textSecondary }]}>{t('career.preview.exit', lang)}</Text></TouchableOpacity> : null}
        </View> : null}
      </View> : null}

      {isOffline ? <View accessibilityRole="alert" style={[styles.offlineBanner, { borderColor: `${colors.primary}55`, backgroundColor: `${colors.primary}12` }]}><Ionicons name="cloud-offline-outline" size={18} color={colors.primary} /><Text selectable style={[styles.offlineCopy, { color: colors.textSecondary }]}>{t('career.offline', lang)}</Text></View> : null}

      <ImageBackground source={KIVILCIM_HERO} imageStyle={styles.heroImage} style={styles.hero}>
        <View style={styles.heroScrim} />
        <View style={styles.heroContent}>
          <View style={styles.heroKicker}><Ionicons name="sparkles-outline" size={14} color="#F9D783" /><Text selectable style={styles.heroKickerText}>{activePathDefinition ? t(activePathDefinition.titleKey, lang) : t('career.sharedPath', lang)}</Text></View>
          <Text selectable style={styles.rank}>{t(career.displayedTitle, lang)}</Text>
          <Text selectable style={styles.heroCopy}>{career.isPathSelectionDue ? t('career.choosePathCopy', lang) : t('career.heroCopy', lang)}</Text>
          <View style={styles.heroProgress}><Ionicons name="map-outline" size={15} color="#F9D783" /><Text selectable style={styles.heroProgressText}>{heroProgressLabel}</Text></View>
        </View>
      </ImageBackground>

      {career.activePath ? <TouchableOpacity accessibilityRole="button" accessibilityState={{ disabled: isPreviewing }} accessibilityLabel={t('career.toolkit.open', lang)} onPress={() => { if (!isPreviewing) navigation.navigate('CareerToolkit', { pathId: career.activePath }); }} style={[styles.toolkitLink, { borderColor: colors.border, backgroundColor: colors.background, opacity: isPreviewing ? 0.55 : 1 }]}><Ionicons name="construct-outline" size={18} color={colors.primary} /><Text selectable style={[styles.smallAction, { color: colors.text }]}>{t('career.toolkit.open', lang)}</Text><Ionicons name="chevron-forward" size={17} color={colors.textSecondary} /></TouchableOpacity> : null}

      {career.isPathSelectionDue ? (
        <View style={styles.section}>
          <Text selectable style={[styles.sectionTitle, { color: colors.text }]}>{t('career.choosePathTitle', lang)}</Text>
          <Text selectable style={[styles.sectionCopy, { color: colors.textSecondary }]}>{t('career.choosePathCopy', lang)}</Text>
          <TouchableOpacity accessibilityRole="button" accessibilityState={{ disabled: isPreviewing }} accessibilityLabel={t('career.choosePathTitle', lang)} onPress={() => { if (!isPreviewing) navigation.navigate('CareerPathSelection'); }} style={[styles.cta, { backgroundColor: colors.primary, opacity: isPreviewing ? 0.55 : 1 }]}>
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
                if (isPreviewing) return;
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
        <View style={styles.section} onLayout={(event) => { conditionsSectionY.current = event.nativeEvent.layout.y; }}>
          <Text selectable style={[styles.sectionTitle, { color: colors.text }]}>{t('career.nextStep', lang)}</Text>
          <View style={[styles.nextCard, { backgroundColor: colors.background, borderColor: colors.border }]}> 
            <Text selectable style={[styles.nextTitle, { color: colors.text }]}>{career.nextNode ? t(career.nextNode.titleKey, lang) : t('career.pathComplete', lang)}</Text>
            <TouchableOpacity accessibilityRole="button" accessibilityState={{ expanded: showConditions }} accessibilityLabel={t(showConditions ? 'career.hideConditions' : 'career.showConditions', lang)} onPress={toggleConditions} style={[styles.conditionsToggle, { borderColor: colors.border, backgroundColor: colors.backgroundDark }]}>
              <Ionicons name={showConditions ? 'chevron-up' : 'information-circle-outline'} size={17} color={colors.primary} />
              <Text selectable style={[styles.smallAction, { color: colors.text }]}>{t(showConditions ? 'career.hideConditions' : 'career.showConditions', lang)}</Text>
            </TouchableOpacity>
            {showConditions ? <View style={styles.conditionsContent}>
              <Text ref={conditionsTitleRef} accessible accessibilityRole="header" selectable style={[styles.conditionsTitle, { color: colors.text }]}>{t('career.conditionsForRank', lang, { rank: t(career.nextNode?.titleKey, lang) })}</Text>
              <Text selectable style={[styles.conditionsCopy, { color: colors.textSecondary }]}>{t('career.conditionsAllRequired', lang)}</Text>
              <Text selectable style={[styles.conditionsCopy, { color: colors.textSecondary }]}>{t('career.conditionsSaved', lang)}</Text>
              {career.nextNode?.requirementRows?.map((requirement) => (
                <View key={requirement.type} style={[styles.requirementDetail, { borderColor: colors.border, backgroundColor: colors.backgroundDark }]}>
                  <Ionicons name={REQUIREMENT_ICONS[requirement.type]} size={18} color={requirement.completed ? colors.primary : colors.textSecondary} />
                  <View style={{ flex: 1 }}>
                    <View style={styles.requirementDetailHeader}><Text selectable style={[styles.requirementLabel, { color: colors.text }]}>{t(requirement.labelKey, lang)}</Text><Text selectable style={[styles.requirementValue, { color: requirement.completed ? colors.primary : colors.text }]}>{`${requirement.current}/${requirement.target}`}</Text></View>
                    <Text selectable style={[styles.requirementHelpCopy, { color: colors.textSecondary }]}>{t(`career.requirementHow.${requirement.type}`, lang)}</Text>
                  </View>
                </View>
              ))}
              {showsDeepInteractionHelp ? <Text selectable style={[styles.requirementHelpCopy, { color: colors.textSecondary }]}>{t('career.requirementHelp.deepInteractions', lang)}</Text> : null}
              {career.nextNode?.identityKey ? <Text selectable style={[styles.rankReward, { color: colors.primary }]}>{t('career.rankReward', lang, { reward: t(career.nextNode.unlockKey, lang), identity: t(career.nextNode.identityKey, lang) })}</Text> : null}
            </View> : null}
            {!['path_complete', 'today_complete'].includes(career.nextAction?.type) ? (
              <TouchableOpacity accessibilityRole="button" accessibilityState={{ disabled: isPreviewing }} accessibilityLabel={actionLabel} onPress={openNextAction} style={[styles.cta, { backgroundColor: colors.primary, opacity: isPreviewing ? 0.55 : 1 }]}>
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
            <TouchableOpacity accessibilityRole="button" accessibilityState={{ disabled: isPreviewing }} accessibilityLabel={t('career.switchPath', lang)} onPress={() => { if (!isPreviewing) setShowPathChoices(true); }}>
              <Text selectable style={[styles.smallAction, { color: colors.primary }]}>{t('career.switchPath', lang)}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={[styles.timeline, { borderColor: colors.border, backgroundColor: colors.background }]}> 
          <Text selectable style={[styles.pathGroupLabel, { color: colors.primary }]}>{t('career.sharedPath', lang)}</Text>
          {timeline.map((node, index) => (
            <React.Fragment key={node.id}>
              {career.activePath && index === career.commonNodes.length ? <Text selectable style={[styles.pathGroupLabel, { color: colors.primary }]}>{t('career.selectedPath', lang)}</Text> : null}
              <TouchableOpacity ref={(instance) => { if (instance) nodeButtonRefs.current.set(node.id, instance); else nodeButtonRefs.current.delete(node.id); }} accessibilityRole="button" accessibilityLabel={`${t(node.titleKey, lang)}. ${t(`career.nodeState.${node.status}`, lang)}.`} accessibilityHint={`${t(node.descriptionKey, lang)} ${node.requirementRows?.map((requirement) => `${t(requirement.labelKey, lang)} ${requirement.current}/${requirement.target}`).join(', ')}`} onPress={() => { if (!isPreviewing) trackEvent(ANALYTICS_EVENTS.CAREER_NODE_OPENED, { careerVersion: 1, pathId: node.pathId, nodeId: node.id, nodeState: node.status, source: 'timeline' }); setSelectedNode(node); }} style={styles.timelineRow}>
                <View style={styles.nodeRail}>{index < timeline.length - 1 ? <View style={[styles.nodeLine, { backgroundColor: node.status === 'completed' ? colors.primary : colors.border }]} /> : null}<CareerNodeMark node={node} status={node.status} isDark={isDark} size={28} /></View>
                <View style={{ flex: 1 }}>
                  <Text selectable style={[styles.nodeName, { color: node.status === 'future' ? colors.textSecondary : colors.text }]}>{t(node.titleKey, lang)}</Text>
                  <Text selectable style={[styles.nodeState, { color: colors.textSecondary }]}>{t(`career.nodeState.${node.status}`, lang)}</Text>
                  {node.status === 'future' || node.status === 'next' ? <><Text selectable numberOfLines={2} style={[styles.nodeDescription, { color: colors.textSecondary }]}>{t(node.descriptionKey, lang)}</Text><Text selectable style={[styles.nodeUnlock, { color: colors.textSecondary }]}>{t(node.unlockKey, lang)}</Text></> : null}
                </View>
              </TouchableOpacity>
            </React.Fragment>
          ))}
        </View>
      </View>
      {!career.activePath ? <View style={styles.section}>
        <Text selectable style={[styles.sectionTitle, { color: colors.text }]}>{t('career.pathsAhead', lang)}</Text>
        <Text selectable style={[styles.sectionCopy, { color: colors.textSecondary }]}>{t('career.pathsAheadCopy', lang)}</Text>
        {PATH_DEFINITIONS.map((path) => <TouchableOpacity key={path.id} accessibilityRole="button" accessibilityLabel={t(path.titleKey, lang)} onPress={() => setShowPathChoices(true)} style={[styles.pathPreview, { borderColor: colors.border, backgroundColor: colors.backgroundDark }]}><Ionicons name="lock-closed-outline" size={16} color={colors.textSecondary} /><View style={{ flex: 1 }}><Text selectable style={[styles.pathName, { color: colors.textSecondary }]}>{t(path.titleKey, lang)}</Text><Text selectable numberOfLines={1} style={[styles.pathDescription, { color: colors.textSecondary }]}>{career.paths[path.id].map((node) => t(node.titleKey, lang)).join(' · ')}</Text></View></TouchableOpacity>)}
      </View> : null}
      <View style={styles.section}>
        <Text selectable style={[styles.sectionTitle, { color: colors.text }]}>{t('career.summary.title', lang)}</Text>
        <Text selectable style={[styles.sectionCopy, { color: colors.textSecondary }]}>{t('career.summary.copy', lang)}</Text>
        <View style={[styles.summaryGrid, { borderColor: colors.border, backgroundColor: colors.background }]}> 
          {journeySummary.map(([labelKey, value]) => <View key={labelKey} style={styles.summaryItem}><Text selectable style={[styles.summaryValue, { color: colors.primary }]}>{String(value || 0)}</Text><Text selectable style={[styles.summaryLabel, { color: colors.textSecondary }]}>{t(labelKey, lang)}</Text></View>)}
        </View>
      </View>
      <CareerRhythmSection totalReads={totalReads} streak={streak} longestStreak={longestStreak} todayReadsCount={todayReadsCount} isPremium={isPremium} streakFreezeCredits={streakFreezeCredits} streakFreezeDates={streakFreezeDates} onUseFreeze={(date) => { if (!isPreviewing) useStreakFreeze(date); }} onOpenPaywall={() => { if (!isPreviewing) navigation.navigate('Paywall', { source: 'career_rhythm_streak_freeze', reason: 'streak_freeze' }); }} />
      {legacyBadgeIds.length ? <View style={styles.section}>
        <TouchableOpacity accessibilityRole="button" accessibilityState={{ expanded: showLegacyBadges }} accessibilityLabel={t('career.legacy.title', lang)} onPress={() => setShowLegacyBadges((visible) => !visible)} style={[styles.legacyHeader, { borderColor: colors.border, backgroundColor: colors.backgroundDark }]}>
          <View style={{ flex: 1 }}><Text selectable style={[styles.sectionTitle, { color: colors.text }]}>{t('career.legacy.title', lang)}</Text><Text selectable style={[styles.sectionCopy, { color: colors.textSecondary }]}>{t('career.legacy.copy', lang, { count: legacyBadgeIds.length })}</Text></View><Ionicons name={showLegacyBadges ? 'chevron-up' : 'chevron-down'} size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        {showLegacyBadges ? <View style={[styles.legacyGrid, { borderColor: colors.border, backgroundColor: colors.background }]}>{legacyBadgeIds.map((id) => <View key={id} accessible accessibilityLabel={t('career.legacy.badgeLabel', lang)} style={styles.legacyBadge}><BadgeIcon badge={{ id }} earned isDark={isDark} size={44} /></View>)}</View> : null}
      </View> : null}
      <CareerNodeSheet node={selectedNode} onClose={closeNodeSheet} />
      <CareerPathSwitchSheet path={pendingPath} currentTitleKey={career.profileTitle} nextTitleKey={career.paths[pendingPath?.id]?.filter((node) => node.status === 'completed').slice(-1)[0]?.titleKey || 'careerNode.traveler.title'} onCancel={() => setPendingPath(null)} onConfirm={async () => { if (isPreviewing) return; await switchPath(pendingPath.id); setPendingPath(null); setShowPathChoices(false); }} />
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
  previewPanel: { borderWidth: 1, borderRadius: 16, padding: 12, gap: 10 },
  previewToggle: { minHeight: 42, flexDirection: 'row', alignItems: 'center', gap: 10 },
  previewTitle: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  previewCopy: { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 17, marginTop: 2 },
  previewChoices: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  previewChoice: { minHeight: 36, justifyContent: 'center', borderWidth: 1, borderRadius: 11, paddingHorizontal: 10 },
  previewChoiceText: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  previewExit: { minHeight: 36, justifyContent: 'center', borderWidth: 1, borderRadius: 11, paddingHorizontal: 10 },
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
  conditionsToggle: { minHeight: 42, alignSelf: 'flex-start', borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 6 },
  conditionsContent: { gap: 9, paddingTop: 2 },
  conditionsTitle: { fontFamily: 'Inter_700Bold', fontSize: 16 },
  conditionsCopy: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 19 },
  requirementDetail: { borderWidth: 1, borderRadius: 13, padding: 11, flexDirection: 'row', alignItems: 'flex-start', gap: 9 },
  requirementDetailHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rankReward: { fontFamily: 'Inter_600SemiBold', fontSize: 13, lineHeight: 19 },
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
  timeline: { borderWidth: 1, borderRadius: 18, padding: 16, gap: 12 },
  pathGroupLabel: { fontFamily: 'Inter_700Bold', fontSize: 11, letterSpacing: 0.6, textTransform: 'uppercase', paddingTop: 2 },
  timelineRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 11, minHeight: 42 },
  nodeRail: { width: 28, alignItems: 'center', alignSelf: 'stretch' },
  nodeLine: { position: 'absolute', top: 28, bottom: -16, width: 2, borderRadius: 1 },
  nodeName: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  nodeState: { fontFamily: 'Inter_400Regular', fontSize: 12, marginTop: 1 },
  nodeDescription: { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 17, marginTop: 4 },
  nodeUnlock: { fontFamily: 'Inter_500Medium', fontSize: 11, lineHeight: 16, marginTop: 3 },
  pathPreview: { minHeight: 66, borderWidth: 1, borderRadius: 15, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
});

export default CareerPathExperience;

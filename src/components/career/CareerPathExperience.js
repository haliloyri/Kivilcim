import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ANALYTICS_EVENTS, trackEvent } from '../../utils/analytics';
import { AccessibilityInfo, findNodeHandle, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useUserData } from '../../context/UserDataContext';
import { useCareerPath } from '../../context/CareerPathContext';
import { CAREER_NODES, PATH_DEFINITIONS } from '../../constants/careerPath';
import { useStories } from '../../context/StoriesContext';
import { buildLearningSummary } from '../../utils/careerLearning';
import { t } from '../../locales/i18n';
import { resolveCareerActionDestination } from '../../utils/careerNavigation';
import { getCareerPathIconName } from '../../utils/careerProgress';
import { buildCareerPreview, CAREER_PREVIEW_SCENARIOS } from '../../utils/careerPreview';
import CareerNodeSheet from './CareerNodeSheet';
import CareerPathSwitchSheet from './CareerPathSwitchSheet';
import CareerHero from './CareerHero';
import CareerMap from './CareerMap';
import CareerNodeMark from './CareerNodeMark';
import { getCareerHeroImage } from '../../constants/careerVisuals';
import CareerRhythmSection from './CareerRhythmSection';
import CareerLearnedSection from './CareerLearnedSection';
import { MilestoneReviewModal } from './LearningMilestoneModal';
import BadgeShareSheet from '../BadgeShareSheet';
import ScreenHeader from '../ScreenHeader';
import { buildBooksMilestoneShare, buildRankShare, buildWeeklyShare } from '../../utils/careerShare';


const REQUIREMENT_ICONS = {
  stories: 'book-outline',
  categories: 'compass-outline',
  deepInteractions: 'bulb-outline',
  applications: 'chatbubbles-outline',
  activeDays: 'calendar-outline',
};

const REMAINING_PRIORITY = ['stories', 'categories', 'deepInteractions', 'applications', 'activeDays'];
const IDENTITY_BY_TITLE = Object.fromEntries(CAREER_NODES.map((node) => [node.titleKey, node.identityKey]));
const NODE_BY_TITLE = Object.fromEntries(CAREER_NODES.map((node) => [node.titleKey, node]));
IDENTITY_BY_TITLE['careerTitle.renaissance'] = 'careerTitle.renaissanceIdentity';

const nodeProgress = (node) => {
  const rows = node?.requirementRows || [];
  if (!rows.length) return 0;
  return rows.reduce((sum, row) => sum + Math.min(1, row.target > 0 ? row.current / row.target : 1), 0) / rows.length;
};

const CareerPathExperience = ({ navigation, route }) => {
  const { colors, layout, isDark, lang } = useTheme();
  const { userProfile, todayReadsCount, streak, totalReads, longestStreak, isPremium, streakFreezeCredits, streakFreezeDates, useStreakFreeze, setBadgePresentationBlocked } = useUserData();
  const { stories } = useStories();
  const { loading, error, isOffline, careerEvents, career: persistedCareer, refreshCareer, selectPath, switchPath, pathSwitchRequested, consumePathSwitchRequest, conditionsRequested, consumeConditionsRequest } = useCareerPath();
  const [showPathChoices, setShowPathChoices] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [pendingPath, setPendingPath] = useState(null);
  const [segment, setSegment] = useState('journey');
  const [shareAchievement, setShareAchievement] = useState(null);
  const [reviewMilestone, setReviewMilestone] = useState(null);
  const reviewShareTimer = useRef(null);
  const [showConditions, setShowConditions] = useState(false);
  const [showPreviewControls, setShowPreviewControls] = useState(false);
  const [previewScenarioId, setPreviewScenarioId] = useState(null);
  const nodeButtonRefs = useRef(new Map());
  const conditionsTitleRef = useRef(null);
  const hasTrackedView = useRef(false);
  const hasTrackedExposure = useRef(false);
  const previewCareer = __DEV__ ? buildCareerPreview(previewScenarioId) : null;
  const isPreviewing = Boolean(previewCareer);
  const career = previewCareer || persistedCareer;
  const learning = useMemo(() => buildLearningSummary({ events: careerEvents, stories }), [careerEvents, stories]);
  const openTitleShare = () => {
    if (isPreviewing || !career?.displayedTitle) return;
    const node = NODE_BY_TITLE[career.displayedTitle];
    const share = buildRankShare({ titleKey: career.displayedTitle, pathId: node?.pathId, visualKey: node?.visualKey, learning, name: userProfile?.displayName, lang });
    if (!node) share.icon = 'trophy-outline';
    trackEvent(ANALYTICS_EVENTS.CAREER_TITLE_SHARE_OPENED, { careerVersion: 1, pathId: node?.pathId || null, nodeId: node?.id || 'capstone', source: 'progress_hero', hasStats: Boolean(share.stats) });
    setShareAchievement(share);
  };
  const openWeeklyShare = () => {
    if (isPreviewing) return;
    trackEvent(ANALYTICS_EVENTS.WEEKLY_RECAP_SHARE_OPENED, { source: 'progress_week', stories: learning.week.stories, books: learning.week.books, minutes: learning.week.minutes });
    setShareAchievement(buildWeeklyShare({ learning, currentTitleKey: career?.displayedTitle, name: userProfile?.displayName, lang }));
  };
  const weeklyRecapRequest = route?.params?.openWeeklyRecap;
  useEffect(() => {
    if (!weeklyRecapRequest || !career) return;
    navigation.setParams?.({ openWeeklyRecap: undefined });
    trackEvent(ANALYTICS_EVENTS.WEEKLY_RECAP_NOTIFICATION_OPENED, { stories: learning.week.stories, hasRecap: learning.week.stories > 0 });
    if (learning.week.stories > 0) trackEvent(ANALYTICS_EVENTS.WEEKLY_RECAP_SHARE_OPENED, { source: 'notification', stories: learning.week.stories, books: learning.week.books, minutes: learning.week.minutes });
    if (learning.week.stories > 0) setShareAchievement(buildWeeklyShare({ learning, currentTitleKey: career.displayedTitle, name: userProfile?.displayName, lang }));
  }, [weeklyRecapRequest, career]);
  // Re-opening a milestone from "Öğrendiklerin" must hold back the live
  // celebration queue so two RN modals never stack.
  useEffect(() => {
    setBadgePresentationBlocked('milestone_review', !!reviewMilestone);
    return () => setBadgePresentationBlocked('milestone_review', false);
  }, [reviewMilestone, setBadgePresentationBlocked]);
  useEffect(() => () => clearTimeout(reviewShareTimer.current), []);
  const shareReviewedMilestone = () => {
    if (isPreviewing || reviewMilestone?.type !== 'books') return;
    const { id, type, count } = reviewMilestone;
    trackEvent(ANALYTICS_EVENTS.LEARNING_MILESTONE_SHARE_OPENED, { milestoneId: id, type, count });
    setReviewMilestone(null);
    // Never stack two RN modals: open the share sheet after this one closes.
    reviewShareTimer.current = setTimeout(() => setShareAchievement(buildBooksMilestoneShare({ count, learning, name: userProfile?.displayName, lang })), 320);
  };
  const openStoryById = (storyId) => {
    const story = (stories || []).find((item) => String(item?.story_id ?? item?.id) === String(storyId));
    if (story) navigation.navigate('StoryDetail', { story });
  };

  useEffect(() => navigation.addListener('blur', () => {
    setPreviewScenarioId(null);
    setShowPreviewControls(false);
    setShowConditions(false);
  }), [navigation]);

  useEffect(() => {
    if (isPreviewing || !pathSwitchRequested || !persistedCareer?.activePath) return;
    setSegment('journey');
    setShowPathChoices(true);
    consumePathSwitchRequest();
  }, [persistedCareer?.activePath, consumePathSwitchRequest, isPreviewing, pathSwitchRequested]);

  const focusConditions = () => {
    requestAnimationFrame(() => {
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
    setSegment('journey');
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
        <Ionicons name="sparkles-outline" size={28} color={colors.primaryText} />
        <Text selectable style={[styles.loading, { color: colors.textSecondary }]}>{t('career.loading', lang)}</Text>
        {error ? <Text selectable style={[styles.error, { color: colors.textSecondary }]}>{t('career.unavailable', lang)}</Text> : null}
        {error ? <TouchableOpacity accessibilityRole="button" accessibilityLabel={t('career.retry', lang)} onPress={() => refreshCareer()} style={[styles.retryButton, { borderColor: colors.border, backgroundColor: colors.backgroundDark }]}><Ionicons name="refresh-outline" size={17} color={colors.primaryText} /><Text selectable style={[styles.retryText, { color: colors.text }]}>{t('career.retry', lang)}</Text></TouchableOpacity> : null}
      </View>
    );
  }


  const activePathDefinition = PATH_DEFINITIONS.find((path) => path.id === career.activePath);
  const actionType = career.nextAction?.type;
  const actionLabel = actionType === 'path_complete'
      ? t('career.pathComplete', lang)
      : actionType === 'advance'
        ? t(`career.primaryAction.${career.nextAction?.missingRequirement || 'stories'}`, lang)
        : t(career.nextAction?.ctaKey || 'career.continue', lang);
  const isNewUser = !career.displayedTitle;
  const summitReached = !!career.capstone?.earned;
  const heroTitle = career.displayedTitle ? t(career.displayedTitle, lang) : t('career.hero.startTitle', lang);
  const heroIdentity = career.isPathSelectionDue
    ? t('career.choosePathCopy', lang)
    : career.displayedTitle
      ? t(IDENTITY_BY_TITLE[career.displayedTitle] || 'career.heroCopy', lang)
      : t('career.hero.startCopy', lang);
  const heroEyebrow = summitReached
    ? t('career.hero.eyebrow.summit', lang)
    : career.isPathSelectionDue
      ? t('career.hero.eyebrow.promoted', lang)
      : isNewUser
        ? t('career.hero.eyebrow.new', lang)
        : activePathDefinition
          ? t(activePathDefinition.titleKey, lang)
          : t('career.hero.eyebrow.current', lang);
  const nextProgress = career.nextNode ? nodeProgress(career.nextNode) : 1;
  const incompleteRows = (career.nextNode?.requirementRows || [])
    .filter((row) => !row.completed)
    .sort((a, b) => REMAINING_PRIORITY.indexOf(a.type) - REMAINING_PRIORITY.indexOf(b.type));
  const remainingItems = incompleteRows.slice(0, 2).map((row) => t(`career.remaining.${row.type}`, lang, { count: row.remaining }));
  const heroNext = career.nextNode ? {
    label: t('career.hero.nextTitle', lang, { title: t(career.nextNode.titleKey, lang) }),
    pct: Math.round(nextProgress * 100),
    remaining: remainingItems.length ? t('career.remaining.lead', lang, { items: remainingItems.join(' · ') }) : null,
  } : null;
  const stepNodes = summitReached
    ? []
    : career.activePath
      ? [career.commonNodes[career.commonNodes.length - 1], ...career.paths[career.activePath]].filter(Boolean)
      : career.commonNodes;
  const heroSteps = stepNodes.map((node) => ({
    id: node.id,
    node,
    label: t(node.titleKey, lang),
    accessibilityLabel: `${t(node.titleKey, lang)}. ${t(`career.nodeState.${node.status}`, lang)}.`,
    state: node.status === 'completed' ? 'done' : career.nextNode?.id === node.id ? 'next' : 'future',
    setRef: (instance) => { if (instance) nodeButtonRefs.current.set(node.id, instance); else nodeButtonRefs.current.delete(node.id); },
    onPress: () => {
      if (!isPreviewing) trackEvent(ANALYTICS_EVENTS.CAREER_NODE_OPENED, { careerVersion: 1, pathId: node.pathId, nodeId: node.id, nodeState: node.status, source: 'hero_steps' });
      setSelectedNode(node);
    },
  }));
  let heroCta = null;
  if (career.isPathSelectionDue) heroCta = { label: t('career.choosePathTitle', lang), disabled: isPreviewing, onPress: () => { if (!isPreviewing) navigation.navigate('CareerPathSelection'); } };
  else if (summitReached || actionType === 'path_complete') heroCta = career.displayedTitle ? { label: t('career.share.title', lang), disabled: isPreviewing, onPress: openTitleShare } : null;
  else if (actionType !== 'today_complete') heroCta = { label: isNewUser ? t('career.hero.startCta', lang) : actionLabel, disabled: isPreviewing, onPress: openNextAction };
  const summitLabel = summitReached
    ? t('career.hero.summitEarned', lang)
    : t('career.hero.summit', lang, { title: t(career.capstone?.titleKey || 'careerTitle.renaissance', lang), done: career.capstone?.completedPaths || 0, total: career.capstone?.requiredPaths || 2 });
  const instantUnlocks = (pathId) => (career.paths[pathId] || []).filter((node) => node.status !== 'completed' && node.isEligible).length;
  const showsDeepInteractionHelp = career.nextNode?.requirementRows?.some((requirement) => requirement.type === 'deepInteractions');
  const weekLine = learning.week.stories > 0
    ? t('career.rhythm.week', lang, { stories: learning.week.stories, minutes: learning.week.minutes })
    : t('career.weekStrip.empty', lang);
  const card = { borderColor: colors.border, backgroundColor: colors.cardBackground || colors.background };
  // Dev preview only: tapping a path row jumps the preview to that path.
  const previewPath = (pathId) => { setPreviewScenarioId(`path_${pathId}`); setShowPathChoices(false); setShowConditions(false); setSelectedNode(null); };
  const pathIconName = getCareerPathIconName;
  const SEGMENTS = [['journey', 'career.seg.journey'], ['learned', 'career.seg.learned'], ['rhythm', 'career.seg.rhythm']];

  const requirementRow = (requirement) => {
    const current = Math.min(requirement.current, requirement.target);
    const ratio = requirement.target > 0 ? Math.min(1, current / requirement.target) : 1;
    return (
      <View key={requirement.type} style={[styles.requirement, { borderColor: colors.border }]}>
        <View style={[styles.requirementIcon, { backgroundColor: requirement.completed ? colors.primary : colors.primaryContainer || `${colors.primary}18` }]}>
          <Ionicons name={requirement.completed ? 'checkmark' : REQUIREMENT_ICONS[requirement.type]} size={18} color={requirement.completed ? colors.onPrimary : colors.primaryText || colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.requirementHeader}>
            <Text selectable style={[styles.requirementLabel, { color: colors.text }]}>{t(requirement.labelKey, lang)}</Text>
            <Text selectable style={[styles.requirementValue, { color: requirement.completed ? colors.primaryText || colors.primary : colors.text }]}>{`${current}/${requirement.target}`}</Text>
          </View>
          {requirement.completed ? null : <View style={[styles.miniTrack, { backgroundColor: colors.surfaceContainerHigh || colors.border }]}><View style={[styles.miniFill, { width: `${Math.round(ratio * 100)}%`, backgroundColor: colors.primary }]} /></View>}
          {requirement.completed ? null : <Text selectable style={[styles.requirementHelpCopy, { color: colors.textSecondary }]}>{t(`career.requirementHow.${requirement.type}`, lang)}</Text>}
        </View>
      </View>
    );
  };

  const renderConditions = () => {
    if (!career.nextNode) return null;
    const rows = career.nextNode.requirementRows || [];
    const top = incompleteRows.slice(0, 2);
    const rest = rows.filter((row) => !top.includes(row));
    return (
      <View style={styles.section}>
        <Text ref={conditionsTitleRef} accessible accessibilityRole="header" selectable style={[styles.sectionTitle, { color: colors.text }]}>{t('career.nextStep', lang)}</Text>
        <View style={[styles.card, card]}>
          <View style={styles.nextHead}>
            <CareerNodeMark node={career.nextNode} status="future" isDark={isDark} size={64} />
            <View style={{ flex: 1 }}>
              {activePathDefinition ? <Text selectable style={[styles.nextEyebrow, { color: colors.primaryText || colors.primary }]}>{t(activePathDefinition.titleKey, lang)}</Text> : null}
              <Text selectable style={[styles.nextTitle, { color: colors.text }]}>{t(career.nextNode.titleKey, lang)}</Text>
            </View>
          </View>
          {career.nextNode.descriptionKey ? <Text selectable style={[styles.requirementHelpCopy, { color: colors.textSecondary, marginTop: 12, marginBottom: 4, fontSize: 14, lineHeight: 21 }]}>{t(career.nextNode.descriptionKey, lang)}</Text> : null}
          {top.map(requirementRow)}
          {showConditions ? rest.map(requirementRow) : null}
          {showConditions && showsDeepInteractionHelp ? <Text selectable style={[styles.requirementHelpCopy, { color: colors.textSecondary }]}>{t('career.requirementHelp.deepInteractions', lang)}</Text> : null}
          {rest.length ? (
            <TouchableOpacity accessibilityRole="button" accessibilityState={{ expanded: showConditions }} accessibilityLabel={t(showConditions ? 'career.hideConditions' : 'career.conditions.all', lang, { count: rows.length })} onPress={toggleConditions} style={styles.moreRow}>
              <Text selectable style={[styles.moreText, { color: colors.primaryText || colors.primary }]}>{t(showConditions ? 'career.hideConditions' : 'career.conditions.all', lang, { count: rows.length })}</Text>
              <Ionicons name={showConditions ? 'chevron-up' : 'chevron-forward'} size={16} color={colors.primaryText || colors.primary} />
            </TouchableOpacity>
          ) : null}
          {career.nextNode.unlockKey ? <View style={[styles.reward, { borderColor: colors.mutedText }]}><Ionicons name="sparkles-outline" size={18} color={colors.dawnText} /><Text selectable style={[styles.rewardText, { color: colors.textSecondary, flex: 1 }]}>{t(career.nextNode.unlockKey, lang)}</Text></View> : null}
        </View>
      </View>
    );
  };

  const pathRow = ({ path, onPress, trailing, subtitle, hint, highlighted }) => (
    <TouchableOpacity key={path.id} accessibilityRole="button" disabled={!onPress} accessibilityLabel={t(path.titleKey, lang)} onPress={onPress} style={[styles.pathRow, card, highlighted && { borderColor: colors.primary, backgroundColor: colors.primaryContainer || card.backgroundColor }]}>
      <View style={[styles.pathIcon, { backgroundColor: colors.primaryContainer || `${colors.primary}18` }]}>
        <Ionicons name={pathIconName(path.id)} size={21} color={colors.primaryText || colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text selectable style={[styles.pathName, { color: colors.text }]}>{t(path.titleKey, lang)}</Text>
        <Text selectable style={[styles.pathDescription, { color: colors.textSecondary }]}>{subtitle || t(path.descriptionKey, lang)}</Text>
        {hint ? <Text selectable style={[styles.pathHint, { color: colors.primaryText || colors.primary }]}>{hint}</Text> : null}
      </View>
      {trailing}
    </TouchableOpacity>
  );

  const renderJourney = () => (
    <>
      {career.activePath ? <TouchableOpacity accessibilityRole="button" accessibilityState={{ disabled: isPreviewing }} accessibilityLabel={t('career.toolkit.open', lang)} onPress={() => { if (!isPreviewing) navigation.navigate('CareerToolkit', { pathId: career.activePath }); }} style={[styles.toolkitLink, card, { opacity: isPreviewing ? 0.55 : 1 }]}><Ionicons name="construct-outline" size={18} color={colors.primaryText || colors.primary} /><Text selectable style={[styles.smallAction, { color: colors.text }]}>{t('career.toolkit.open', lang)}</Text><Ionicons name="chevron-forward" size={17} color={colors.textSecondary} /></TouchableOpacity> : null}

      {career.isPathSelectionDue ? (
        <View style={styles.section}>
          <Text selectable style={[styles.sectionTitle, { color: colors.text }]}>{t('career.selection.title', lang)}</Text>
          <Text selectable style={[styles.sectionCopy, { color: colors.textSecondary }]}>{t('career.selection.free', lang)}</Text>
          {PATH_DEFINITIONS.map((path) => pathRow({
            path,
            onPress: () => { if (isPreviewing) previewPath(path.id); else navigation.navigate('CareerPathSelection'); },
            hint: instantUnlocks(path.id) > 0 ? t('career.selection.instantUnlock', lang, { count: instantUnlocks(path.id) }) : null,
            trailing: <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />,
          }))}
        </View>
      ) : showPathChoices ? (
        <View style={styles.section}>
          <Text selectable style={[styles.sectionTitle, { color: colors.text }]}>{t('career.switchPath', lang)}</Text>
          <Text selectable style={[styles.sectionCopy, { color: colors.textSecondary }]}>{t('career.choosePathCopy', lang)}</Text>
          {PATH_DEFINITIONS.map((path) => pathRow({
            path,
            highlighted: path.id === career.activePath,
            onPress: async () => {
              if (isPreviewing) { previewPath(path.id); return; }
              if (career.activePath && path.id !== career.activePath) setPendingPath(path);
              else { await selectPath(path.id); setShowPathChoices(false); }
            },
            hint: path.id !== career.activePath && instantUnlocks(path.id) > 0 ? t('career.selection.instantUnlock', lang, { count: instantUnlocks(path.id) }) : null,
            trailing: <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />,
          }))}
        </View>
      ) : (
        renderConditions()
      )}

      {!career.activePath && !career.isPathSelectionDue ? (
        <View style={styles.section}>
          <Text selectable style={[styles.sectionTitle, { color: colors.text }]}>{t('career.pathsAhead', lang)}</Text>
          <Text selectable style={[styles.sectionCopy, { color: colors.textSecondary }]}>{t('career.pathsAheadCopy', lang)}</Text>
          {PATH_DEFINITIONS.map((path) => pathRow({
            path,
            subtitle: t(path.descriptionKey, lang),
            hint: null,
            onPress: isPreviewing ? () => previewPath(path.id) : undefined,
            trailing: <Ionicons name={isPreviewing ? 'chevron-forward' : 'lock-closed-outline'} size={16} color={colors.textSecondary} />,
          }))}
          <View style={[styles.summitCard, { borderColor: colors.textSecondary }]}>
            <Ionicons name="trophy-outline" size={22} color={colors.rewardText || colors.textSecondary} />
            <Text selectable style={[styles.sectionCopy, { color: colors.textSecondary, flex: 1 }]}>{summitLabel}</Text>
          </View>
        </View>
      ) : null}

      {career.activePath && !summitReached && !showPathChoices && !career.isPathSelectionDue ? (
        <CareerMap
          career={career}
          activePathDefinition={activePathDefinition}
          colors={colors}
          isDark={isDark}
          lang={lang}
          summitLabel={summitLabel}
          onOpenNode={(node) => {
            if (!isPreviewing) trackEvent(ANALYTICS_EVENTS.CAREER_NODE_OPENED, { careerVersion: 1, pathId: node.pathId, nodeId: node.id, nodeState: node.status, source: 'career_map' });
            setSelectedNode(node);
          }}
          onSwitchPath={() => setShowPathChoices(true)}
        />
      ) : null}

      {career.activePath && summitReached ? (
        <View style={styles.section}>
          <View style={styles.sectionHeading}>
            <Text selectable style={[styles.sectionTitle, { color: colors.text }]}>{t(summitReached ? 'career.paths.completedTitle' : 'career.paths.summitTitle', lang)}</Text>
            <TouchableOpacity accessibilityRole="button" accessibilityLabel={t('career.switchPath', lang)} style={styles.linkButton} onPress={() => setShowPathChoices(true)}>
              <Text selectable style={[styles.smallAction, { color: colors.primaryText || colors.primary }]}>{t('career.switchPath', lang)}</Text>
            </TouchableOpacity>
          </View>
          {summitReached ? PATH_DEFINITIONS.map((path) => {
            const nodes = career.paths[path.id] || [];
            const done = nodes.length > 0 && nodes.every((node) => node.status === 'completed');
            return pathRow({
              path,
              highlighted: done,
              subtitle: done ? t(nodes[nodes.length - 1].titleKey, lang) : t('career.paths.continueHint', lang),
              onPress: done ? undefined : () => { if (!isPreviewing) setPendingPath(path); },
              trailing: <Ionicons name={done ? 'checkmark' : 'chevron-forward'} size={18} color={done ? colors.primaryText || colors.primary : colors.textSecondary} />,
            });
          }) : (
            <View style={[styles.summitCard, { borderColor: colors.textSecondary }]}>
              <Ionicons name="trophy-outline" size={22} color={colors.rewardText || colors.textSecondary} />
              <Text selectable style={[styles.sectionCopy, { color: colors.textSecondary, flex: 1 }]}>{summitLabel}</Text>
            </View>
          )}
        </View>
      ) : null}
    </>
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={[styles.content, { paddingHorizontal: layout.padding.horizontal, paddingBottom: 36 }]}
      contentInsetAdjustmentBehavior="automatic"
    >
      <ScreenHeader
        style={styles.screenHeader}
        title={t('career.title', lang)}
        subtitle={t('career.subtitle', lang)}
        right={(
          <View style={styles.headerActions}>
        {__DEV__ ? <TouchableOpacity accessibilityRole="button" accessibilityState={{ expanded: showPreviewControls }} accessibilityLabel={t('career.preview.toggle', lang)} onPress={() => setShowPreviewControls((visible) => !visible)} style={[styles.iconButton, card, (showPreviewControls || isPreviewing) && { backgroundColor: colors.primaryContainer || `${colors.primary}18`, borderColor: colors.primary }]}><Ionicons name="eye-outline" size={20} color={colors.primaryText || colors.primary} /></TouchableOpacity> : null}
        <View accessible accessibilityLabel={`${streak || 0} ${t('streakDays', lang)}`} style={[styles.streakPill, card]}>
          <Ionicons name="flame" size={16} color={colors.reward || colors.primary} />
          <Text style={[styles.streakText, { color: colors.rewardText || colors.text }]}>{String(streak || 0)}</Text>
        </View>
          </View>
        )}
      />

      {__DEV__ && showPreviewControls ? <View style={[styles.previewPanel, { borderColor: `${colors.primary}66`, backgroundColor: `${colors.primary}10` }]}>
        <View><Text selectable style={[styles.previewTitle, { color: colors.text }]}>{t('career.preview.toggle', lang)}</Text><Text selectable style={[styles.previewCopy, { color: colors.textSecondary }]}>{t(isPreviewing ? 'career.preview.activeNotice' : 'career.preview.copy', lang)}</Text></View>
        <View style={styles.previewChoices}>
          {CAREER_PREVIEW_SCENARIOS.map((scenario) => <TouchableOpacity key={scenario.id} accessibilityRole="button" accessibilityState={{ selected: previewScenarioId === scenario.id }} accessibilityLabel={t(scenario.labelKey, lang)} onPress={() => { setPreviewScenarioId(scenario.id); setShowConditions(false); setShowPathChoices(false); setSelectedNode(null); }} style={[styles.previewChoice, { borderColor: previewScenarioId === scenario.id ? colors.primary : colors.border, backgroundColor: previewScenarioId === scenario.id ? `${colors.primary}18` : colors.background }]}><Text selectable style={[styles.previewChoiceText, { color: previewScenarioId === scenario.id ? colors.primary : colors.text }]}>{t(scenario.labelKey, lang)}</Text></TouchableOpacity>)}
          {isPreviewing ? <TouchableOpacity accessibilityRole="button" accessibilityLabel={t('career.preview.exit', lang)} onPress={() => setPreviewScenarioId(null)} style={[styles.previewExit, { borderColor: colors.border }]}><Text selectable style={[styles.smallAction, { color: colors.textSecondary }]}>{t('career.preview.exit', lang)}</Text></TouchableOpacity> : null}
        </View>
      </View> : null}

      {isOffline ? <View accessibilityRole="alert" style={[styles.offlineBanner, { borderColor: `${colors.primary}55`, backgroundColor: `${colors.primary}12` }]}><Ionicons name="cloud-offline-outline" size={18} color={colors.primaryText || colors.primary} /><Text selectable style={[styles.offlineCopy, { color: colors.textSecondary }]}>{t('career.offline', lang)}</Text></View> : null}

      <CareerHero
        colors={colors}
        background={getCareerHeroImage({ pathId: career.activePath, isDark, summit: summitReached, start: isNewUser })}
        eyebrow={heroEyebrow}
        title={heroTitle}
        copy={heroIdentity}
        next={heroNext}
        pathChip={activePathDefinition && !summitReached && !career.isPathSelectionDue ? { icon: pathIconName(activePathDefinition.id), label: t(activePathDefinition.titleKey, lang) } : null}
        cta={heroCta}
        onShare={career.displayedTitle && !isNewUser ? openTitleShare : null}
        shareLabel={t('career.share.title', lang)}
      />

      <TouchableOpacity accessibilityRole="button" accessibilityLabel={weekLine} onPress={() => setSegment('rhythm')} style={[styles.weekStrip, card]}>
        <Ionicons name="calendar-outline" size={18} color={colors.primaryText || colors.primary} />
        <Text selectable style={[styles.weekText, { color: colors.text }]}>{weekLine}</Text>
        <Ionicons name="chevron-forward" size={17} color={colors.textSecondary} />
      </TouchableOpacity>

      <View accessibilityRole="tablist" style={[styles.segments, { backgroundColor: colors.surfaceContainerHigh || colors.border }]}>
        {SEGMENTS.map(([id, labelKey]) => (
          <TouchableOpacity key={id} accessibilityRole="tab" accessibilityState={{ selected: segment === id }} accessibilityLabel={t(labelKey, lang)} onPress={() => setSegment(id)} style={[styles.segment, segment === id && { backgroundColor: colors.cardBackground || colors.background }]}>
            <Text style={[styles.segmentText, { color: segment === id ? colors.primaryText || colors.primary : colors.textSecondary }]}>{t(labelKey, lang)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {segment === 'journey' ? renderJourney() : null}
      {segment === 'learned' ? <CareerLearnedSection summary={learning} onOpenStory={isPreviewing ? null : openStoryById} onOpenMilestone={setReviewMilestone} /> : null}
      {segment === 'rhythm' ? <CareerRhythmSection onShareWeek={learning.week.stories > 0 ? openWeeklyShare : null} shareWeekLabel={t('career.share.weekCta', lang)} weekLine={t('career.rhythm.week', lang, { stories: learning.week.stories, minutes: learning.week.minutes })} totalReads={totalReads} streak={streak} longestStreak={longestStreak} todayReadsCount={todayReadsCount} isPremium={isPremium} streakFreezeCredits={streakFreezeCredits} streakFreezeDates={streakFreezeDates} onUseFreeze={(date) => { if (!isPreviewing) useStreakFreeze(date); }} onOpenPaywall={() => { if (!isPreviewing) navigation.navigate('Paywall', { source: 'career_rhythm_streak_freeze', reason: 'streak_freeze' }); }} /> : null}

      <CareerNodeSheet node={selectedNode} onClose={closeNodeSheet} />
      <MilestoneReviewModal milestone={reviewMilestone} onClose={() => setReviewMilestone(null)} onShare={isPreviewing ? null : shareReviewedMilestone} />
      <BadgeShareSheet visible={!!shareAchievement} achievement={shareAchievement} name={userProfile?.displayName} onClose={() => setShareAchievement(null)} />
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
  content: { gap: 14 },
  screenHeader: { paddingHorizontal: 0 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  streakPill: { minWidth: 44, height: 44, paddingHorizontal: 12, borderRadius: 22, borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
  streakText: { fontFamily: 'Inter_600SemiBold', fontSize: 15, fontVariant: ['tabular-nums'] },
  previewPanel: { borderWidth: 1, borderRadius: 16, padding: 12, gap: 10 },
  iconButton: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  previewTitle: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  previewCopy: { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 17, marginTop: 2 },
  previewChoices: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  previewChoice: { minHeight: 36, justifyContent: 'center', borderWidth: 1, borderRadius: 11, paddingHorizontal: 10 },
  previewChoiceText: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  previewExit: { minHeight: 36, justifyContent: 'center', borderWidth: 1, borderRadius: 11, paddingHorizontal: 10 },
  offlineBanner: { minHeight: 48, borderWidth: 1, borderRadius: 15, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', gap: 9 },
  offlineCopy: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 13, lineHeight: 18 },
  weekStrip: { minHeight: 52, borderRadius: 16, borderWidth: 1, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10 },
  weekText: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 14, fontVariant: ['tabular-nums'] },
  segments: { flexDirection: 'row', gap: 4, padding: 4, borderRadius: 22, marginTop: 6 },
  segment: { flex: 1, minHeight: 44, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  segmentText: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  toolkitLink: { minHeight: 52, borderRadius: 16, borderWidth: 1, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10 },
  section: { gap: 10, marginTop: 8 },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 17 },
  sectionCopy: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20 },
  linkButton: { minHeight: 44, justifyContent: 'center' },
  smallAction: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  card: { borderWidth: 1, borderRadius: 18, paddingHorizontal: 16, paddingVertical: 6 },
  requirement: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  requirementIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  requirementHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  requirementLabel: { flex: 1, fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  requirementValue: { fontFamily: 'Inter_600SemiBold', fontSize: 14, fontVariant: ['tabular-nums'] },
  requirementHelpCopy: { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 18, marginTop: 4 },
  miniTrack: { height: 4, borderRadius: 2, overflow: 'hidden', marginTop: 8 },
  miniFill: { height: '100%', borderRadius: 2 },
  moreRow: { minHeight: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  moreText: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  reward: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, borderWidth: 1, borderStyle: 'dashed', borderRadius: 14, padding: 12, marginTop: 4, marginBottom: 4 },
  nextHead: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  nextEyebrow: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 0.8, textTransform: 'uppercase' },
  nextTitle: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 24, lineHeight: 28, marginTop: 3 },
  rewardText: { fontFamily: 'Inter_500Medium', fontSize: 13, lineHeight: 19 },
  pathRow: { minHeight: 72, borderWidth: 1, borderRadius: 18, paddingHorizontal: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', gap: 14 },
  pathIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  pathName: { fontFamily: 'Inter_600SemiBold', fontSize: 15 },
  pathDescription: { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 17, marginTop: 2 },
  pathHint: { fontFamily: 'Inter_600SemiBold', fontSize: 12, marginTop: 4 },
  summitCard: { borderWidth: 1, borderStyle: 'dashed', borderRadius: 18, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
});

export default CareerPathExperience;

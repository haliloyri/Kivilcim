import { COMMON_PATH_ID, PATH_IDS, getNodesForPath } from '../constants/careerPath';
import { buildCareerNextAction } from './careerNextAction';
import { toLocalDay } from './localDate';

export const CAREER_REQUIREMENT_TYPES = Object.freeze([
  'stories', 'categories', 'deepInteractions', 'applications', 'activeDays',
]);

const LABEL_KEYS = {
  stories: 'careerRequirement.stories',
  categories: 'careerRequirement.categories',
  deepInteractions: 'careerRequirement.deepInteractions',
  applications: 'careerRequirement.applications',
  activeDays: 'careerRequirement.activeDays',
};

export const emptyCareerMetrics = () => ({
  stories: 0,
  categories: 0,
  deepInteractions: 0,
  applications: 0,
  activeDays: 0,
});

export const normalizeCareerMetrics = (metrics = {}) => Object.fromEntries(
  CAREER_REQUIREMENT_TYPES.map((type) => [type, Math.max(0, Number(metrics[type]) || 0)])
);

const EVENT_TYPES = new Set(['H', 'D', 'U']);
const eventValue = (event, camelKey, snakeKey) => event?.[camelKey] ?? event?.[snakeKey];
const stableEvent = (event) => ({
  eventId: String(eventValue(event, 'eventId', 'event_id') || ''),
  creditType: String(eventValue(event, 'creditType', 'credit_type') || ''),
  storyId: String(eventValue(event, 'storyId', 'story_id') || ''),
  categoryId: eventValue(event, 'categoryId', 'category_id'),
  occurredAt: String(eventValue(event, 'occurredAt', 'occurred_at') || ''),
  localDay: eventValue(event, 'localDay', 'local_day') || toLocalDay(eventValue(event, 'occurredAt', 'occurred_at')),
  original: event,
});

const chronologicalEvents = (events) => (events || [])
  .map(stableEvent)
  .filter((event) => EVENT_TYPES.has(event.creditType) && event.eventId && event.storyId && event.occurredAt && event.localDay)
  .sort((a, b) => a.occurredAt.localeCompare(b.occurredAt) || a.eventId.localeCompare(b.eventId));

/**
 * Applies rank credits without discarding the raw event log. H and U limits are
 * calendar-day limits; D has a one-credit-per-story rule. D/U only qualify
 * after a credited H for the same story, preventing orphaned events from
 * inflating a rank.
 */
export const calculateCareerMetrics = (events = []) => {
  const ordered = chronologicalEvents(events);
  const credited = [];
  const creditedHByStory = new Map();
  const hCountByDay = new Map();
  const acceptedHStories = new Set();

  ordered.filter((event) => event.creditType === 'H').forEach((event) => {
    if (acceptedHStories.has(event.storyId)) return;
    const count = hCountByDay.get(event.localDay) || 0;
    if (count >= 3) return;
    acceptedHStories.add(event.storyId);
    creditedHByStory.set(event.storyId, event);
    hCountByDay.set(event.localDay, count + 1);
    credited.push(event);
  });

  const acceptedDStories = new Set();
  const acceptedUStories = new Set();
  const uCountByDay = new Map();
  ordered.filter((event) => event.creditType !== 'H').forEach((event) => {
    const storyH = creditedHByStory.get(event.storyId);
    if (!storyH || storyH.occurredAt > event.occurredAt) return;
    if (event.creditType === 'D') {
      if (acceptedDStories.has(event.storyId)) return;
      acceptedDStories.add(event.storyId);
      credited.push(event);
      return;
    }
    if (acceptedUStories.has(event.storyId)) return;
    const count = uCountByDay.get(event.localDay) || 0;
    if (count >= 1) return;
    acceptedUStories.add(event.storyId);
    uCountByDay.set(event.localDay, count + 1);
    credited.push(event);
  });

  const creditedH = credited.filter((event) => event.creditType === 'H');
  const categoryIds = new Set(creditedH.map((event) => event.categoryId).filter((value) => value != null && value !== ''));
  const activeDays = new Set(credited.map((event) => event.localDay));
  return {
    metrics: {
      stories: creditedH.length,
      categories: categoryIds.size,
      deepInteractions: credited.filter((event) => event.creditType === 'D').length,
      applications: credited.filter((event) => event.creditType === 'U').length,
      activeDays: activeDays.size,
    },
    creditedEventIds: credited.map((event) => event.eventId),
    rawEventCount: ordered.length,
    hasMeaningfulActivityToday: activeDays.has(toLocalDay(new Date())),
  };
};

export const getCareerRecommendation = (metricsInput = {}, { nearTieThreshold = 0.12 } = {}) => {
  const metrics = normalizeCareerMetrics(metricsInput);
  if (metrics.stories < 1) return { recommendedPath: null, kind: 'insufficient_data', scores: {}, reasonKey: 'careerRecommendation.insufficientData' };
  const denominator = Math.max(1, metrics.stories);
  const scores = {
    [PATH_IDS.EXPLORATION]: Math.min(1, (metrics.categories / denominator) * 3),
    [PATH_IDS.DEPTH]: Math.min(1, (metrics.deepInteractions / denominator) * 3),
    [PATH_IDS.TRANSFER]: Math.min(1, (metrics.applications / denominator) * 3),
  };
  const ranked = Object.entries(scores).sort(([, a], [, b]) => b - a || 0);
  if (ranked[0][1] - ranked[1][1] <= nearTieThreshold) {
    return { recommendedPath: null, kind: 'balanced', scores, reasonKey: 'careerRecommendation.balanced' };
  }
  const [recommendedPath] = ranked[0];
  return { recommendedPath, kind: 'suggestion', scores, reasonKey: `careerRecommendation.${recommendedPath}` };
};

export const getEffectiveCategoryTarget = (target, availableCategoryCount) => {
  if (!Number.isFinite(availableCategoryCount) || availableCategoryCount < 0) return target;
  return Math.min(target, Math.floor(availableCategoryCount));
};

export const buildRequirementRows = (node, metrics, availableCategoryCount) => {
  const normalizedMetrics = normalizeCareerMetrics(metrics);
  return CAREER_REQUIREMENT_TYPES
    .filter((type) => node.requirements[type] > 0)
    .map((type) => {
      const target = type === 'categories'
        ? getEffectiveCategoryTarget(node.requirements[type], availableCategoryCount)
        : node.requirements[type];
      const current = normalizedMetrics[type];
      return {
        type,
        current,
        target,
        remaining: Math.max(0, target - current),
        completed: current >= target,
        labelKey: LABEL_KEYS[type],
      };
    });
};

const asEarnedNodeIds = (earnedNodes) => new Set((earnedNodes || []).map((node) => typeof node === 'string' ? node : node?.nodeId).filter(Boolean));

const buildPathNodes = ({ pathId, metrics, earnedNodeIds, availableCategoryCount, meaningfulActivityToday }) => {
  let hasIncompleteNode = false;
  let hasNextNode = false;
  return getNodesForPath(pathId).map((node) => {
    const requirementRows = buildRequirementRows(node, metrics, availableCategoryCount);
    const earned = earnedNodeIds.has(node.id);
    const eligible = requirementRows.every((row) => row.completed);
    let status = 'future';
    if (earned) status = 'completed';
    else if (!hasIncompleteNode) {
      status = 'current';
      hasIncompleteNode = true;
    } else if (!hasNextNode) {
      status = 'next';
      hasNextNode = true;
    }
    return { ...node, status, isEligible: eligible, requirementRows, hasMeaningfulActivityToday: Boolean(meaningfulActivityToday) };
  });
};

const highestCompletedNode = (nodes) => [...nodes].reverse().find((node) => node.status === 'completed') || null;

/**
 * Pure UI model shared by Home and Kıvılcım Yolu. Callers can pass raw career
 * events or a persisted metric snapshot; components never calculate credits.
 */
export const buildCareerViewModel = ({
  metrics,
  events,
  earnedNodes = [],
  activePath = null,
  availableCategoryCount,
  meaningfulActivityToday = false,
  unseenPromotionCount = 0,
} = {}) => {
  const calculation = Array.isArray(events) ? calculateCareerMetrics(events) : null;
  const normalizedMetrics = normalizeCareerMetrics(calculation?.metrics || metrics);
  const earnedNodeIds = asEarnedNodeIds(earnedNodes);
  const commonNodes = buildPathNodes({ pathId: COMMON_PATH_ID, metrics: normalizedMetrics, earnedNodeIds, availableCategoryCount, meaningfulActivityToday });
  const paths = Object.fromEntries(Object.values(PATH_IDS).map((pathId) => [
    pathId,
    buildPathNodes({ pathId, metrics: normalizedMetrics, earnedNodeIds, availableCategoryCount, meaningfulActivityToday }),
  ]));
  const safeActivePath = Object.values(PATH_IDS).includes(activePath) ? activePath : null;
  const activePathNodes = safeActivePath ? paths[safeActivePath] : [];
  const currentNode = commonNodes.find((node) => node.status === 'current') || activePathNodes.find((node) => node.status === 'current') || null;
  const nextNode = commonNodes.find((node) => node.status !== 'completed') || activePathNodes.find((node) => node.status !== 'completed') || null;
  const activeTitleNode = highestCompletedNode(activePathNodes);
  const commonTitleNode = highestCompletedNode(commonNodes);
  const travelerEarned = earnedNodeIds.has('common_traveler');
  const completedPathIds = Object.entries(paths).filter(([, nodes]) => nodes.length > 0 && nodes.every((node) => node.status === 'completed')).map(([pathId]) => pathId);
  const nextAction = buildCareerNextAction({ commonNodes, pathNodes: activePathNodes, activePath: safeActivePath });

  return {
    metrics: normalizedMetrics,
    creditedEventIds: calculation?.creditedEventIds || [],
    rawEventCount: calculation?.rawEventCount || 0,
    commonNodes,
    paths,
    activePath: safeActivePath,
    currentNode,
    nextNode,
    displayedTitle: activeTitleNode?.titleKey || (travelerEarned ? 'careerNode.traveler.title' : commonTitleNode?.titleKey || 'careerNode.traveler.title'),
    // Profile identity intentionally reflects only the selected route. Common
    // progress is still visible on the path itself, but never becomes a title.
    profileTitle: activeTitleNode?.titleKey || 'careerNode.traveler.title',
    nextAction,
    unseenPromotionCount: Math.max(0, Number(unseenPromotionCount) || 0),
    isPathSelectionDue: travelerEarned && !safeActivePath,
    completedPathIds,
    recommendation: getCareerRecommendation(normalizedMetrics),
  };
};

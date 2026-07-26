import { getAllUserReads, getStoryByLang } from '../db/db';
import { awardCareerNodes, getCareerState, recordCareerEvent, replaceLegacyBadgeIds, upsertCareerState, markCareerNodeSeen } from '../db/userDb';
import { RULE_VERSION } from '../constants/careerPath';
import { buildCareerViewModel } from '../utils/careerProgress';
import { ANALYTICS_EVENTS, trackEvent } from '../utils/analytics';
import { checkBadges } from '../utils/badges';
import { getTimezoneOffsetMinutes, toLocalDay } from '../utils/localDate';
import { notifyCareerDataChanged } from './careerEvents';
import { enqueueAndSync } from './offlineQueue';

export const CAREER_MIGRATION_VERSION = 1;

const occurredAtForDay = (day) => `${String(day).slice(0, 10)}T12:00:00.000Z`;
const migrationEvent = ({ creditType, subtype, storyId, categoryId, occurredAt }) => ({
  eventId: `career:${RULE_VERSION}:${creditType}:${String(storyId)}`,
  userId: 'default',
  creditKey: `career:${RULE_VERSION}:${creditType}:${String(storyId)}`,
  creditType,
  eventSubtype: subtype,
  storyId: String(storyId),
  categoryId: categoryId ?? null,
  occurredAt,
  localDay: toLocalDay(occurredAt),
  timezoneOffsetMinutes: getTimezoneOffsetMinutes(occurredAt),
  ruleVersion: RULE_VERSION,
  metadata: { migration: 'legacy_v1' },
});

export const migrateLegacyCareerPath = async ({ userId = 'default', variantUsage = [], badgeInput = {}, lang = 'tr' } = {}) => {
  const state = await getCareerState(userId);
  if (state.migrationVersion >= CAREER_MIGRATION_VERSION) return { migrated: false, reason: 'already_migrated' };

  const reads = await getAllUserReads(userId);
  const categoryCache = new Map();
  const categoryFor = async (storyId) => {
    if (categoryCache.has(String(storyId))) return categoryCache.get(String(storyId));
    const story = await getStoryByLang(storyId, lang).catch(() => null);
    const categoryId = story?.parent_cat_id ?? null;
    categoryCache.set(String(storyId), categoryId);
    return categoryId;
  };

  const events = [];
  for (const read of reads) {
    if (!read?.storyId || !read?.readAt) continue;
    const occurredAt = occurredAtForDay(read.readAt);
    events.push(migrationEvent({ creditType: 'H', subtype: 'legacy_read', storyId: read.storyId, categoryId: await categoryFor(read.storyId), occurredAt }));
  }

  const earliestUsage = new Map();
  (variantUsage || []).filter((item) => item?.action === 'mark_used' && item?.storyId && item?.usedAt)
    .forEach((item) => {
      const key = String(item.storyId);
      if (!earliestUsage.has(key) || String(item.usedAt) < String(earliestUsage.get(key).usedAt)) earliestUsage.set(key, item);
    });
  for (const usage of earliestUsage.values()) {
    events.push(migrationEvent({ creditType: 'U', subtype: 'legacy_mark_used', storyId: usage.storyId, categoryId: usage.categoryId ?? await categoryFor(usage.storyId), occurredAt: usage.usedAt }));
  }

  for (const event of events) {
    const result = await recordCareerEvent({ ...event, userId });
    if (result.inserted) enqueueAndSync('record_career_event', { event: result.event });
  }
  const legacyBadgeIds = checkBadges({ ...badgeInput, variantUsage }).filter((badge) => badge.earned).map((badge) => badge.id);
  await replaceLegacyBadgeIds(userId, legacyBadgeIds);
  enqueueAndSync('upsert_legacy_badges', { badgeIds: legacyBadgeIds });

  const model = buildCareerViewModel({ events, earnedNodes: [], activePath: null });
  const awardedAt = new Date().toISOString();
  const eligibleCommon = model.commonNodes.filter((node) => node.isEligible).map((node) => ({
    nodeId: node.id, pathId: node.pathId, ruleVersion: RULE_VERSION, earnedAt: awardedAt,
    awardSource: 'legacy_migration_v1', requirementsSnapshot: node.requirementRows,
  }));
  if (eligibleCommon.length) {
    await awardCareerNodes(userId, eligibleCommon);
    await Promise.all(eligibleCommon.map((node) => markCareerNodeSeen(userId, node.nodeId)));
    enqueueAndSync('award_career_nodes', { nodes: eligibleCommon });
    eligibleCommon.forEach((node) => enqueueAndSync('mark_career_node_seen', { nodeId: node.nodeId }));
  }
  await upsertCareerState(userId, { migrationVersion: CAREER_MIGRATION_VERSION });
  enqueueAndSync('upsert_career_migration_state', { migrationVersion: CAREER_MIGRATION_VERSION });
  trackEvent(ANALYTICS_EVENTS.CAREER_MIGRATION_COMPLETED, {
    careerVersion: RULE_VERSION,
    source: 'legacy_migration_v1',
    backfilled: true,
  });
  notifyCareerDataChanged();
  return { migrated: true, readEvents: reads.length, usageEvents: earliestUsage.size, legacyBadgeIds, awardedNodeIds: eligibleCommon.map((node) => node.nodeId) };
};

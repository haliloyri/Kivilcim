import { FEATURE_FLAGS } from '../config/featureFlags';
import { RULE_VERSION } from '../constants/careerPath';
import { getCareerEventForStory, recordCareerEvent } from '../db/userDb';
import { getTimezoneOffsetMinutes, isAtLeastHoursAfter, toLocalDay } from '../utils/localDate';
import { enqueueAndSync } from './offlineQueue';

const DEFAULT_USER_ID = 'default';
const careerEventListeners = new Set();

export const subscribeToCareerEvents = (listener) => {
  careerEventListeners.add(listener);
  return () => careerEventListeners.delete(listener);
};

const notifyCareerEvent = (event) => {
  careerEventListeners.forEach((listener) => {
    try { listener(event); } catch (_) { /* observers must not affect capture */ }
  });
};

// Some state changes (for example reset) do not create a credit event but
// still need every derived career view to reload from the durable store.
export const notifyCareerDataChanged = () => notifyCareerEvent({ type: 'career_data_changed' });

const normalizeStoryId = (value) => String(value ?? '').trim();
const normalizeCategoryId = (value) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

export const makeCareerCreditKey = ({ creditType, storyId, ruleVersion = RULE_VERSION }) =>
  `career:${ruleVersion}:${creditType}:${normalizeStoryId(storyId)}`;

export const buildCareerEvent = ({
  userId = DEFAULT_USER_ID,
  creditType,
  eventSubtype,
  storyId,
  categoryId = null,
  completionMethod = null,
  occurredAt = new Date().toISOString(),
  metadata = null,
}) => {
  const normalizedStoryId = normalizeStoryId(storyId);
  const creditKey = makeCareerCreditKey({ creditType, storyId: normalizedStoryId });
  const localDay = toLocalDay(occurredAt);
  const timezoneOffsetMinutes = getTimezoneOffsetMinutes(occurredAt);
  if (!normalizedStoryId || !localDay || timezoneOffsetMinutes == null) return null;
  return {
    // Idempotency must survive a retry: do not use a random UUID here.
    eventId: creditKey,
    userId,
    creditKey,
    creditType,
    eventSubtype,
    storyId: normalizedStoryId,
    categoryId: normalizeCategoryId(categoryId),
    completionMethod,
    occurredAt,
    localDay,
    timezoneOffsetMinutes,
    ruleVersion: RULE_VERSION,
    metadata,
  };
};

const capture = async (input) => {
  if (!FEATURE_FLAGS.careerEventCaptureV1) return { captured: false, reason: 'flag_disabled' };
  const event = buildCareerEvent(input);
  if (!event) return { captured: false, reason: 'invalid_event' };
  try {
    const result = await recordCareerEvent(event);
    if (result.inserted) {
      enqueueAndSync('record_career_event', { event });
      notifyCareerEvent(event);
    }
    return { captured: result.inserted, event };
  } catch (error) {
    // Career telemetry is additive. A write fault must never block reading.
    console.warn('[careerEvents] capture failed:', error?.message);
    return { captured: false, reason: 'storage_error' };
  }
};

export const recordCareerStoryCompletion = async ({ userId = DEFAULT_USER_ID, storyId, categoryId, completionMethod, skipRevisit = false }) => {
  const occurredAt = new Date().toISOString();
  const storyResult = await capture({ userId, creditType: 'H', eventSubtype: 'story_completed', storyId, categoryId, completionMethod, occurredAt });
  if (!FEATURE_FLAGS.careerEventCaptureV1 || storyResult.captured || skipRevisit) return storyResult;

  // A repeat completion can earn one D, but only after the first completion
  // has been stored for at least 24 hours. The H write remains idempotent.
  try {
    const firstCompletion = await getCareerEventForStory(userId, 'H', storyId);
    if (!firstCompletion || !isAtLeastHoursAfter(firstCompletion.occurredAt, occurredAt, 24)) return storyResult;
    return capture({ userId, creditType: 'D', eventSubtype: 'revisit_24h', storyId, categoryId, completionMethod, occurredAt });
  } catch (error) {
    console.warn('[careerEvents] revisit lookup failed:', error?.message);
    return storyResult;
  }
};

export const recordCareerInsightSaved = async (input) => {
  const userId = input?.userId || DEFAULT_USER_ID;
  const firstCompletion = await getCareerEventForStory(userId, 'H', input?.storyId);
  if (!firstCompletion) return { captured: false, reason: 'story_not_completed' };
  return capture({ ...input, creditType: 'D', eventSubtype: input?.eventSubtype || 'insight_saved' });
};

export const recordCareerApplication = async (input) => {
  const userId = input?.userId || DEFAULT_USER_ID;
  const firstCompletion = await getCareerEventForStory(userId, 'H', input?.storyId);
  if (!firstCompletion) return { captured: false, reason: 'story_not_completed' };
  return capture({
    ...input,
    userId,
    creditType: 'U',
    eventSubtype: input?.eventSubtype || 'conversation_mark_used',
  });
};

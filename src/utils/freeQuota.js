// freeQuota.js — the free tier's daily story cap.
//
// Kept as pure functions, deliberately separate from UserDataContext, for the
// same reason storyCompletion.js is separate from StoryDetailScreen: this is a
// commercial rule, and a UI refactor must not be able to change what it means.
//
// The record shape is { day: 'YYYY-MM-DD', storyIds: [string] } rather than a
// bare counter so that:
//   - it resets on the local calendar day, and
//   - re-opening a story the user already spent quota on today is free.
//
// A positional rule ("the first 3 of the unread pool are open") looks identical
// on screen but is not a cap at all: reading those three removes them from the
// pool, so three more become open, forever.

export const FREE_DAILY_STORY_QUOTA = 3;

const EMPTY = Object.freeze({ day: null, storyIds: Object.freeze([]) });

/** A normalized, safe record from whatever was in storage. */
export const normalizeRecord = (value) => {
  if (!value || typeof value !== 'object') return EMPTY;
  const { day, storyIds } = value;
  if (typeof day !== 'string' || !Array.isArray(storyIds)) return EMPTY;
  // De-duplicate: a double-tap must not spend two units.
  return { day, storyIds: Array.from(new Set(storyIds.map(String))) };
};

/** Today's spent story ids. A record from an earlier day reads as empty. */
export const spentToday = (record, today) => {
  const normalized = normalizeRecord(record);
  if (!today || normalized.day !== today) return [];
  return normalized.storyIds;
};

export const quotaUsed = (record, today) => spentToday(record, today).length;

export const quotaRemaining = (record, today, quota = FREE_DAILY_STORY_QUOTA) =>
  Math.max(0, quota - quotaUsed(record, today));

/**
 * True when `storyId` is already open today — either quota was spent on it, or
 * the user has read it before. Already-read stories stay open permanently: the
 * cap gates new material, it never revokes what was already given.
 */
export const isUnlocked = ({ record, today, history = [], storyId }) => {
  const id = String(storyId);
  if (spentToday(record, today).includes(id)) return true;
  return history.some((entry) => String(entry) === id);
};

/**
 * Decides whether `storyId` may be opened, and what the record becomes.
 *
 * Returns { allowed, record, spent } — `record` is unchanged unless `spent` is
 * true, so callers only need to persist when something actually changed.
 */
export const spend = ({ record, today, history = [], storyId, quota = FREE_DAILY_STORY_QUOTA }) => {
  const current = normalizeRecord(record);

  if (isUnlocked({ record: current, today, history, storyId })) {
    return { allowed: true, record: current, spent: false };
  }
  if (quotaRemaining(current, today, quota) <= 0) {
    return { allowed: false, record: current, spent: false };
  }
  return {
    allowed: true,
    spent: true,
    record: { day: today, storyIds: [...spentToday(current, today), String(storyId)] },
  };
};

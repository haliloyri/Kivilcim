import {
  FREE_DAILY_STORY_QUOTA,
  isUnlocked,
  normalizeRecord,
  quotaRemaining,
  quotaUsed,
  spend,
  spentToday,
} from '../freeQuota';

const TODAY = '2026-09-09';
const YESTERDAY = '2026-09-08';

describe('free daily quota', () => {
  it('keeps the commercial cap explicit', () => {
    expect(FREE_DAILY_STORY_QUOTA).toBe(3);
  });

  it('treats a record from an earlier day as spent-nothing', () => {
    const stale = { day: YESTERDAY, storyIds: ['1', '2', '3'] };
    expect(spentToday(stale, TODAY)).toEqual([]);
    expect(quotaRemaining(stale, TODAY)).toBe(3);
  });

  it('normalizes junk and de-duplicates so a double tap spends one unit', () => {
    expect(normalizeRecord(null)).toEqual({ day: null, storyIds: [] });
    expect(normalizeRecord({ day: 5, storyIds: ['1'] })).toEqual({ day: null, storyIds: [] });
    expect(normalizeRecord({ day: TODAY, storyIds: [1, '1', 2] }))
      .toEqual({ day: TODAY, storyIds: ['1', '2'] });
    expect(quotaUsed({ day: TODAY, storyIds: ['7', '7'] }, TODAY)).toBe(1);
  });

  it('spends exactly three stories and then refuses', () => {
    let record = { day: null, storyIds: [] };
    for (const id of ['a', 'b', 'c']) {
      const result = spend({ record, today: TODAY, storyId: id });
      expect(result.allowed).toBe(true);
      expect(result.spent).toBe(true);
      record = result.record;
    }
    expect(quotaRemaining(record, TODAY)).toBe(0);

    const denied = spend({ record, today: TODAY, storyId: 'd' });
    expect(denied.allowed).toBe(false);
    expect(denied.spent).toBe(false);
    expect(denied.record).toEqual(record);
  });

  it('re-opening a story already spent today is free', () => {
    const record = { day: TODAY, storyIds: ['a', 'b', 'c'] };
    const result = spend({ record, today: TODAY, storyId: 'a' });
    expect(result.allowed).toBe(true);
    expect(result.spent).toBe(false);
  });

  // The old positional rule failed exactly here: reading a story removed it
  // from the candidate pool, which handed the user a fresh set of free ones.
  it('does not hand out more free stories as history grows', () => {
    const record = { day: TODAY, storyIds: ['a', 'b', 'c'] };
    const history = ['a', 'b', 'c'];
    expect(spend({ record, today: TODAY, history, storyId: 'd' }).allowed).toBe(false);
    expect(spend({ record, today: TODAY, history: [...history, 'x', 'y'], storyId: 'd' }).allowed)
      .toBe(false);
  });

  it('keeps previously read stories open without spending quota', () => {
    const record = { day: TODAY, storyIds: ['a', 'b', 'c'] };
    const history = ['old-1'];
    expect(isUnlocked({ record, today: TODAY, history, storyId: 'old-1' })).toBe(true);
    const result = spend({ record, today: TODAY, history, storyId: 'old-1' });
    expect(result.allowed).toBe(true);
    expect(result.spent).toBe(false);
    expect(quotaRemaining(result.record, TODAY)).toBe(0);
  });

  it('resets at the local calendar day', () => {
    const record = { day: YESTERDAY, storyIds: ['a', 'b', 'c'] };
    const result = spend({ record, today: TODAY, storyId: 'd' });
    expect(result.allowed).toBe(true);
    expect(result.record).toEqual({ day: TODAY, storyIds: ['d'] });
  });

  it('compares ids as strings so numeric story ids behave', () => {
    const record = { day: TODAY, storyIds: ['1809'] };
    expect(isUnlocked({ record, today: TODAY, storyId: 1809 })).toBe(true);
    expect(isUnlocked({ record, today: TODAY, history: [1810], storyId: '1810' })).toBe(true);
  });

  // A null `today` makes `spentToday` return [] on every call, so the cap would
  // never accumulate — an unlimited free tier. The rule can't defend against
  // that on its own (the day is an input), so callers must never pass null:
  // UserDataContext.todayKey falls back to a UTC day. This test documents the
  // hazard so the guarantee doesn't get dropped.
  it('cannot enforce a cap without a calendar day, which is why callers must supply one', () => {
    let record = { day: null, storyIds: [] };
    for (const id of ['a', 'b', 'c', 'd', 'e']) {
      record = spend({ record, today: null, storyId: id }).record;
    }
    expect(quotaUsed(record, null)).toBe(0);

    // With any non-null day, the same sequence caps at three.
    let capped = { day: null, storyIds: [] };
    const allowed = [];
    for (const id of ['a', 'b', 'c', 'd', 'e']) {
      const result = spend({ record: capped, today: TODAY, storyId: id });
      if (result.allowed) allowed.push(id);
      capped = result.record;
    }
    expect(allowed).toEqual(['a', 'b', 'c']);
  });
});

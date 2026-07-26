import { getTimezoneOffsetMinutes, hoursBetween, isAtLeastHoursAfter, toLocalDay } from '../localDate';

describe('local career dates', () => {
  it('uses the event timezone instead of UTC day boundaries', () => {
    expect(toLocalDay('2026-07-01T21:30:00.000Z', { timeZone: 'Europe/Istanbul' })).toBe('2026-07-02');
  });

  it('handles DST offsets at the event instant', () => {
    expect(getTimezoneOffsetMinutes('2026-07-01T12:00:00.000Z', { timeZone: 'America/New_York' })).toBe(-240);
  });

  it('does not count a 23:59 revisit as a 24 hour revisit', () => {
    const first = '2026-07-01T10:00:00.000Z';
    const early = '2026-07-02T09:59:00.000Z';
    expect(hoursBetween(first, early)).toBeCloseTo(23 + (59 / 60));
    expect(isAtLeastHoursAfter(first, early, 24)).toBe(false);
    expect(isAtLeastHoursAfter(first, '2026-07-02T10:00:00.000Z', 24)).toBe(true);
  });
});

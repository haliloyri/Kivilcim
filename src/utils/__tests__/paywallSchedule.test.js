import { shouldOfferPaywall, isOfferWindow, OFFER_GAP_DAYS } from '../paywallSchedule';

const DAY = 24 * 60 * 60 * 1000;
const at = (hour, dayOffset = 0) => new Date(2026, 10, 17 + dayOffset, hour, 30).getTime();
const base = { isPremium: false, isOnboarded: true };

describe('offer window', () => {
  it.each([6, 9, 11, 18, 21, 23])('%i:30 is inside the window', (h) => {
    expect(isOfferWindow(at(h))).toBe(true);
  });
  it.each([12, 14, 17])('%i:30 is outside the window', (h) => {
    expect(isOfferWindow(at(h))).toBe(false);
  });
});

describe('shouldOfferPaywall', () => {
  it('waits the full gap after the last offer', () => {
    const last = at(10);
    expect(shouldOfferPaywall({ ...base, now: at(10, OFFER_GAP_DAYS - 1), lastOfferAt: last })).toBe(false);
    expect(shouldOfferPaywall({ ...base, now: at(10, OFFER_GAP_DAYS), lastOfferAt: last })).toBe(true);
  });

  it('offers only in the morning or evening window', () => {
    const last = at(10);
    expect(shouldOfferPaywall({ ...base, now: at(14, OFFER_GAP_DAYS), lastOfferAt: last })).toBe(false);
    expect(shouldOfferPaywall({ ...base, now: at(20, OFFER_GAP_DAYS), lastOfferAt: last })).toBe(true);
  });

  it('never offers to Premium users or before onboarding', () => {
    const last = at(10);
    const now = at(10, OFFER_GAP_DAYS + 2);
    expect(shouldOfferPaywall({ ...base, isPremium: true, now, lastOfferAt: last })).toBe(false);
    expect(shouldOfferPaywall({ ...base, isOnboarded: false, now, lastOfferAt: last })).toBe(false);
  });

  it('does nothing without a reference time', () => {
    expect(shouldOfferPaywall({ ...base, now: at(10, 10), lastOfferAt: null })).toBe(false);
  });

  it('stays quiet within a single day however often the app opens', () => {
    const last = at(9);
    expect(shouldOfferPaywall({ ...base, now: at(20), lastOfferAt: last })).toBe(false);
    expect(shouldOfferPaywall({ ...base, now: last + DAY, lastOfferAt: last })).toBe(false);
  });
});

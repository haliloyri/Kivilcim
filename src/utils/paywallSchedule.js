// Scheduled Premium offer: at most one automatic paywall per OFFER_GAP_DAYS,
// and only when the app is opened before noon or in the evening. The first
// offer of an install is the one right after onboarding; it also starts the gap.
export const LAST_OFFER_KEY = '@albor_last_paywall_offer_at';
export const OFFER_GAP_DAYS = 3;
export const MORNING_END_HOUR = 12;
export const EVENING_START_HOUR = 18;

const DAY_MS = 24 * 60 * 60 * 1000;

export const isOfferWindow = (now = Date.now()) => {
  const hour = new Date(now).getHours();
  return hour < MORNING_END_HOUR || hour >= EVENING_START_HOUR;
};

// `lastOfferAt` is the last automatic offer, or the install time when none has
// been shown yet (so a reader who skipped setup is not offered Premium at once).
export const shouldOfferPaywall = ({ now = Date.now(), lastOfferAt, isPremium, isOnboarded }) => {
  if (isPremium || !isOnboarded) return false;
  if (lastOfferAt == null) return false;
  if (!isOfferWindow(now)) return false;
  return now - lastOfferAt >= OFFER_GAP_DAYS * DAY_MS;
};

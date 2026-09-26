// adRegion.js — where ads may be requested at all.
//
// Kept separate from ads.js so the rule can be read and tested without pulling
// in the native AdMob module.
//
// Ads are off in the EEA and the UK. Two reasons, and the first alone decides
// it:
//
//   1. Serving ads to users in the EEA or the UK requires a Google-certified
//      consent management platform (IAB TCF v2.2). There isn't one in this app,
//      and without it Google restricts or refuses to fill the request anyway.
//   2. In a paid-content product, banners and interstitials lower perceived
//      quality — and so the price the product can hold. Germany and Spain are
//      the markets where that price matters most.
//
// Turkey and the rest of the world keep the existing behaviour. If ads are ever
// switched on for the EEA, a certified CMP and (on iOS) an ATT prompt have to
// land in the same change.

export const NO_ADS_REGIONS = Object.freeze([
  // EU 27
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR',
  'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK',
  'SI', 'ES', 'SE',
  // Rest of the EEA
  'IS', 'LI', 'NO',
  // United Kingdom
  'GB',
]);

const RESTRICTED = new Set(NO_ADS_REGIONS);

/**
 * True when `regionCode` is a region where ads must not be requested.
 *
 * An unknown or malformed region counts as restricted: it is better to show one
 * fewer ad than to make an unconsented ad request from inside the EEA.
 */
export const isRestrictedRegion = (regionCode) => {
  if (typeof regionCode !== 'string' || regionCode.length !== 2) return true;
  return RESTRICTED.has(regionCode.toUpperCase());
};

/**
 * How to gate a Premium feature that a free user could otherwise unlock by
 * watching a rewarded ad. Returns one of:
 *
 *   'allow'   — already entitled (Premium, or unlocked earlier in this session)
 *   'ad'      — offer the rewarded-ad-or-Premium sheet
 *   'paywall' — no ad inventory is available here, so Premium is the only route
 *
 * The third case is the one that matters. Call sites used to read
 * `!shouldShowAd(...)` as "let them through", which quietly handed the paid
 * feature to every free user in any region where ads don't run — including the
 * whole EEA and the UK once ads were switched off there.
 */
export const resolveRewardedGate = ({ adsAvailable, isPremium, alreadyUnlocked = false }) => {
  if (isPremium || alreadyUnlocked) return 'allow';
  return adsAvailable ? 'ad' : 'paywall';
};

// RevenueCat billing service.
//
// This wraps `react-native-purchases` so the rest of the app never imports the
// SDK directly. Which key is used depends on the build (see PLATFORM_API_KEY);
// with no usable key `BILLING_LIVE` stays false and the paywall runs in a
// read-only state (it does NOT hand out Premium — see UserDataContext.buyPremium).
//
// SETUP (see BILLING_SETUP.md):
//   1. Create products in App Store Connect + Google Play Console.
//   2. Create the entitlement in RevenueCat and attach the products.
//   3. Paste the RevenueCat public SDK keys + product/entitlement IDs into
//      app.json -> expo.extra.revenuecat.
//   4. Rebuild the native app (expo prebuild / EAS build). RevenueCat needs
//      native code and will NOT work in Expo Go.

import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { MONETIZATION_LIVE } from '../config/monetization';

const RC_CONFIG = Constants.expoConfig?.extra?.revenuecat
  ?? Constants.manifest?.extra?.revenuecat
  ?? {};

const STORE_API_KEY =
  Platform.OS === 'ios' ? RC_CONFIG.iosApiKey : RC_CONFIG.androidApiKey;

// A store key counts only if it's a real, non-placeholder appl_/goog_ value.
//
// `test_...` keys are RevenueCat's *Test Store* API keys (Project Settings →
// API Keys → Test Store). They work in debug builds (simulator or device), but
// configuring the SDK with one in a RELEASE build throws a native error ("this
// app is using a test API key...") that isn't catchable from JS and crashes the
// app right after startup — so they are only ever used when __DEV__.
export const isPlaceholderKey = (key) =>
  !key || typeof key !== 'string' || key.trim() === '' || key.startsWith('REPLACE_') || key.startsWith('test_');

const isTestStoreKey = (key) => typeof key === 'string' && key.startsWith('test_');

// LIVE (production, real device) → real store key.
// Debug build (Metro / dev client, incl. simulator) → Test Store demo purchases.
// Anything else (preview/apk release builds, simulators) → no billing.
const PLATFORM_API_KEY = (() => {
  if (MONETIZATION_LIVE) return isPlaceholderKey(STORE_API_KEY) ? null : STORE_API_KEY;
  if (__DEV__ && isTestStoreKey(RC_CONFIG.testStoreApiKey)) return RC_CONFIG.testStoreApiKey;
  return null;
})();

// True when this build can run purchases (real or Test Store).
export const BILLING_LIVE = !!PLATFORM_API_KEY;
// True when purchases are Test Store demos, not real money.
export const BILLING_DEMO = BILLING_LIVE && !MONETIZATION_LIVE;

export const ENTITLEMENT_ID = RC_CONFIG.entitlementId || 'premium';
export const OFFERING_ID = RC_CONFIG.offeringId || 'default';
export const PRODUCT_IDS = RC_CONFIG.products || {};

// Plan keys the paywall renders, in display order. `yearly` is the canonical
// key (it matches app.json -> extra.revenuecat.products); `annual` is accepted
// as an alias so older configs and RevenueCat's `offering.annual` package type
// both keep resolving.
export const PLAN_KEYS = ['monthly', 'yearly', 'lifetime'];

const productIdFor = (planKey) =>
  planKey === 'yearly'
    ? (PRODUCT_IDS.yearly || PRODUCT_IDS.annual)
    : PRODUCT_IDS[planKey];

// Lazy-load the native SDK. Returns null if the module isn't available
// (e.g. Expo Go or before the native rebuild), so callers can fall back safely.
let _Purchases = null;
let _loadAttempted = false;
const getPurchases = () => {
  if (_loadAttempted) return _Purchases;
  _loadAttempted = true;
  try {
    // eslint-disable-next-line global-require
    _Purchases = require('react-native-purchases').default;
  } catch (e) {
    _Purchases = null;
  }
  return _Purchases;
};

let _configured = false;

export const initBilling = async () => {
  if (!BILLING_LIVE) return false;
  const Purchases = getPurchases();
  if (!Purchases) return false;
  if (_configured) return true;
  try {
    if (typeof Purchases.setLogLevel === 'function' && Purchases.LOG_LEVEL) {
      Purchases.setLogLevel(__DEV__ ? Purchases.LOG_LEVEL.DEBUG : Purchases.LOG_LEVEL.ERROR);
    }
    await Purchases.configure({ apiKey: PLATFORM_API_KEY });
    _configured = true;
    return true;
  } catch (e) {
    console.error('[billing] configure failed:', e);
    return false;
  }
};

const activeEntitlement = (customerInfo) =>
  customerInfo?.entitlements?.active?.[ENTITLEMENT_ID] || null;

const hasEntitlement = (customerInfo) => !!activeEntitlement(customerInfo);

/**
 * Normalized entitlement snapshot. Everything the app needs to reason about
 * Premium — including expiry, renewal intent and trial state — without any
 * caller having to know RevenueCat's shape.
 *
 * Returns null when the entitlement isn't active.
 */
export const entitlementSnapshot = (customerInfo) => {
  const ent = activeEntitlement(customerInfo);
  if (!ent) return null;
  return {
    active: true,
    productId: ent.productIdentifier || null,
    expiresAt: ent.expirationDate || null,   // null for lifetime / non-expiring
    willRenew: !!ent.willRenew,
    periodType: ent.periodType || null,      // NORMAL | TRIAL | INTRO
    isTrial: ent.periodType === 'TRIAL',
    store: ent.store || null,
    latestPurchaseAt: ent.latestPurchaseDate || null,
  };
};

/**
 * Revenue attributes for analytics, read off a RevenueCat product. PostHog
 * needs a NUMERIC amount and an ISO currency code — a display string like
 * "349₺" makes LTV and ROAS impossible to compute.
 */
export const revenueAttrs = (pkg) => {
  const product = pkg?.product;
  if (!product) return {};
  const amount = typeof product.price === 'number' ? product.price : null;
  return {
    ...(amount !== null ? { revenue: amount } : {}),
    ...(product.currencyCode ? { currency: product.currencyCode } : {}),
    ...(product.identifier ? { product_id: product.identifier } : {}),
    ...(product.priceString ? { price_string: product.priceString } : {}),
  };
};

// Returns the available packages for the active offering, mapped by plan key
// ('monthly' / 'yearly' / 'lifetime') so the paywall can read live localized
// prices. Returns null when billing isn't live or the offering is empty.
export const getOfferingPackages = async () => {
  if (!(await initBilling())) return null;
  const Purchases = getPurchases();
  try {
    const offerings = await Purchases.getOfferings();
    const offering = offerings?.all?.[OFFERING_ID] || offerings?.current;
    if (!offering?.availablePackages?.length) return null;

    const byPlan = {};
    for (const pkg of offering.availablePackages) {
      const productId = pkg.product?.identifier;
      const match = PLAN_KEYS.find((key) => productIdFor(key) === productId);
      if (match) byPlan[match] = pkg;
    }
    // Fallbacks via RevenueCat's standard package types, for configs whose
    // store product IDs don't match `extra.revenuecat.products`.
    if (!byPlan.monthly && offering.monthly) byPlan.monthly = offering.monthly;
    if (!byPlan.yearly && (offering.annual || offering.yearly)) {
      byPlan.yearly = offering.annual || offering.yearly;
    }
    if (!byPlan.lifetime && offering.lifetime) byPlan.lifetime = offering.lifetime;

    return Object.keys(byPlan).length ? byPlan : null;
  } catch (e) {
    console.error('[billing] getOfferings failed:', e);
    return null;
  }
};

// Free trials the store will really give THIS user, per plan: only plans whose
// product has a FREE introductory phase the user is still eligible for.
// iOS asks RevenueCat (Apple decides eligibility on-device); Google Play only
// returns offers the user is eligible for, so a free intro phase is enough.
// Returns { [planKey]: { days } } — empty when no trial applies.
const PERIOD_DAYS = { DAY: 1, WEEK: 7, MONTH: 30, YEAR: 365 };
export const getTrialEligibility = async (packagesByPlan) => {
  if (!packagesByPlan || !(await initBilling())) return {};
  const Purchases = getPurchases();
  const candidates = Object.entries(packagesByPlan).filter(([plan, pkg]) =>
    plan !== 'lifetime' && pkg?.product?.introPrice && Number(pkg.product.introPrice.price) === 0);
  if (!candidates.length) return {};

  let eligibility = null;
  if (Platform.OS === 'ios') {
    if (typeof Purchases.checkTrialOrIntroductoryPriceEligibility !== 'function') return {};
    try {
      eligibility = await Purchases.checkTrialOrIntroductoryPriceEligibility(
        candidates.map(([, pkg]) => pkg.product.identifier)
      );
    } catch (e) {
      console.warn('[billing] trial eligibility check failed:', e?.message);
      return {}; // unknown → never promise a trial
    }
  }
  const ELIGIBLE = Purchases.INTRO_ELIGIBILITY_STATUS?.INTRO_ELIGIBILITY_STATUS_ELIGIBLE ?? 2;

  const trials = {};
  for (const [plan, pkg] of candidates) {
    if (eligibility && eligibility[pkg.product.identifier]?.status !== ELIGIBLE) continue;
    const intro = pkg.product.introPrice;
    const days = (Number(intro.periodNumberOfUnits) || 0) * (PERIOD_DAYS[intro.periodUnit] || 0);
    if (days > 0) trials[plan] = { days };
  }
  return trials;
};

// Purchases a package. Returns { success, entitled, entitlement, userCancelled, error }.
export const purchasePackage = async (pkg) => {
  if (!(await initBilling())) return { success: false, error: 'billing_not_live' };
  const Purchases = getPurchases();
  if (!pkg) return { success: false, error: 'no_package' };
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return {
      success: true,
      entitled: hasEntitlement(customerInfo),
      entitlement: entitlementSnapshot(customerInfo),
    };
  } catch (e) {
    if (e?.userCancelled) return { success: false, userCancelled: true };
    console.error('[billing] purchase failed:', e);
    return { success: false, error: e?.message || 'purchase_failed' };
  }
};

// Restores previous purchases. Returns { success, entitled, entitlement, error }.
export const restorePurchases = async () => {
  if (!(await initBilling())) return { success: false, error: 'billing_not_live' };
  const Purchases = getPurchases();
  try {
    const customerInfo = await Purchases.restorePurchases();
    return {
      success: true,
      entitled: hasEntitlement(customerInfo),
      entitlement: entitlementSnapshot(customerInfo),
    };
  } catch (e) {
    console.error('[billing] restore failed:', e);
    return { success: false, error: e?.message || 'restore_failed' };
  }
};

// Full entitlement snapshot from cached customer info, or null when it can't
// be determined. Carries expiry, trial and renewal state alongside the boolean.
export const fetchEntitlement = async () => {
  if (!(await initBilling())) return null;
  const Purchases = getPurchases();
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return { entitled: hasEntitlement(customerInfo), entitlement: entitlementSnapshot(customerInfo) };
  } catch (e) {
    console.error('[billing] getCustomerInfo failed:', e);
    return null;
  }
};

/**
 * Listen for CustomerInfo updates — a renewal, a cancellation, a refund, or a
 * purchase made on another device. This is the only way the app learns about a
 * subscription state change it didn't itself initiate.
 *
 * Returns an unsubscribe function (a no-op when billing isn't live).
 */
export const addCustomerInfoListener = (callback) => {
  if (!BILLING_LIVE) return () => {};
  const Purchases = getPurchases();
  if (!Purchases || typeof Purchases.addCustomerInfoUpdateListener !== 'function') {
    return () => {};
  }
  const listener = Purchases.addCustomerInfoUpdateListener((customerInfo) => {
    callback({
      entitled: hasEntitlement(customerInfo),
      entitlement: entitlementSnapshot(customerInfo),
    });
  });
  return () => {
    if (listener && typeof listener.remove === 'function') listener.remove();
  };
};

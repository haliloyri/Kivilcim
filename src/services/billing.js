// RevenueCat billing service.
//
// This wraps `react-native-purchases` so the rest of the app never imports the
// SDK directly. Until real API keys are added in app.json -> extra.revenuecat,
// `BILLING_LIVE` stays false and the app uses local (dev) Premium activation.
//
// SETUP (see BILLING_SETUP.md):
//   1. Create products in App Store Connect + Google Play Console.
//   2. Create an entitlement (e.g. "premium") in RevenueCat and attach products.
//   3. Paste the RevenueCat public SDK keys + product/entitlement IDs into
//      app.json -> expo.extra.revenuecat.
//   4. Rebuild the native app (expo prebuild / EAS build). RevenueCat needs
//      native code and will NOT work in Expo Go.

import { Platform } from 'react-native';
import Constants from 'expo-constants';

const RC_CONFIG = Constants.expoConfig?.extra?.revenuecat
  ?? Constants.manifest?.extra?.revenuecat
  ?? {};

const PLATFORM_API_KEY =
  Platform.OS === 'ios' ? RC_CONFIG.iosApiKey : RC_CONFIG.androidApiKey;

// A key counts as "live" only if it's a real, non-placeholder value.
const isPlaceholder = (key) =>
  !key || typeof key !== 'string' || key.trim() === '' || key.startsWith('REPLACE_');

export const BILLING_LIVE = !isPlaceholder(PLATFORM_API_KEY);

export const ENTITLEMENT_ID = RC_CONFIG.entitlementId || 'premium';
export const OFFERING_ID = RC_CONFIG.offeringId || 'default';
export const PRODUCT_IDS = RC_CONFIG.products || {};

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

const hasEntitlement = (customerInfo) =>
  !!customerInfo?.entitlements?.active?.[ENTITLEMENT_ID];

// Returns the available packages for the active offering, mapped by plan id
// ('monthly' / 'annual') so the paywall can read live localized prices.
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
      if (productId === PRODUCT_IDS.monthly) byPlan.monthly = pkg;
      else if (productId === PRODUCT_IDS.annual) byPlan.annual = pkg;
    }
    // Fallbacks via RevenueCat's standard package types.
    if (!byPlan.monthly && offering.monthly) byPlan.monthly = offering.monthly;
    if (!byPlan.annual && offering.annual) byPlan.annual = offering.annual;
    return byPlan;
  } catch (e) {
    console.error('[billing] getOfferings failed:', e);
    return null;
  }
};

// Purchases a package. Returns { success, entitled, userCancelled, error }.
export const purchasePackage = async (pkg) => {
  if (!(await initBilling())) return { success: false, error: 'billing_not_live' };
  const Purchases = getPurchases();
  if (!pkg) return { success: false, error: 'no_package' };
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return { success: true, entitled: hasEntitlement(customerInfo) };
  } catch (e) {
    if (e?.userCancelled) return { success: false, userCancelled: true };
    console.error('[billing] purchase failed:', e);
    return { success: false, error: e?.message || 'purchase_failed' };
  }
};

// Restores previous purchases. Returns { success, entitled, error }.
export const restorePurchases = async () => {
  if (!(await initBilling())) return { success: false, error: 'billing_not_live' };
  const Purchases = getPurchases();
  try {
    const customerInfo = await Purchases.restorePurchases();
    return { success: true, entitled: hasEntitlement(customerInfo) };
  } catch (e) {
    console.error('[billing] restore failed:', e);
    return { success: false, error: e?.message || 'restore_failed' };
  }
};

// Current entitlement status from cached customer info. Returns boolean | null
// (null = couldn't determine).
export const checkEntitlement = async () => {
  if (!(await initBilling())) return null;
  const Purchases = getPurchases();
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return hasEntitlement(customerInfo);
  } catch (e) {
    console.error('[billing] getCustomerInfo failed:', e);
    return null;
  }
};

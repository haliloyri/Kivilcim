/**
 * revenuecat.js
 * Central RevenueCat service for Albor.
 *
 * Wraps react-native-purchases and react-native-purchases-ui so nothing
 * else in the app imports either SDK directly.
 *
 * Products expected in RevenueCat dashboard:
 *   lifetime  – PACKAGE_TYPE.LIFETIME
 *   yearly    – PACKAGE_TYPE.ANNUAL
 *   monthly   – PACKAGE_TYPE.MONTHLY
 *
 * Entitlement: "Albor Pro"
 */

import { Platform } from 'react-native';
import Constants from 'expo-constants';

// ─── Config ──────────────────────────────────────────────────────────────────

const RC_CONFIG = Constants.expoConfig?.extra?.revenuecat ?? {};

// Single key or split iOS / Android — both patterns work.
const API_KEY =
  Platform.OS === 'ios'
    ? (RC_CONFIG.iosApiKey ?? RC_CONFIG.apiKey)
    : (RC_CONFIG.androidApiKey ?? RC_CONFIG.apiKey);

const isPlaceholder = (key) =>
  !key || typeof key !== 'string' || key.trim() === '' || key.startsWith('REPLACE_');

export const RC_LIVE = !isPlaceholder(API_KEY);

export const ENTITLEMENT_ID = RC_CONFIG.entitlementId ?? 'Albor Pro';

export const PRODUCT_IDS = {
  lifetime: RC_CONFIG.products?.lifetime ?? 'lifetime',
  yearly:   RC_CONFIG.products?.yearly   ?? 'yearly',
  monthly:  RC_CONFIG.products?.monthly  ?? 'monthly',
};

// ─── Lazy SDK loaders ────────────────────────────────────────────────────────

let _Purchases = null;
let _RevenueCatUI = null;
let _PAYWALL_RESULT = null;

const getPurchases = () => {
  if (_Purchases) return _Purchases;
  try {
    _Purchases = require('react-native-purchases').default;
  } catch {
    _Purchases = null;
  }
  return _Purchases;
};

const getUI = () => {
  if (_RevenueCatUI) return _RevenueCatUI;
  try {
    const mod = require('react-native-purchases-ui');
    _RevenueCatUI = mod.default ?? mod.RevenueCatUI ?? mod;
    _PAYWALL_RESULT = mod.PAYWALL_RESULT;
  } catch {
    _RevenueCatUI = null;
  }
  return _RevenueCatUI;
};

const getPaywallResult = () => {
  if (!_PAYWALL_RESULT) getUI(); // trigger load
  return _PAYWALL_RESULT;
};

// ─── Initialisation ──────────────────────────────────────────────────────────

let _configured = false;

/**
 * Call once on app startup (before any other RC method).
 * Safe to call multiple times — idempotent.
 */
export const initRevenueCat = async (userId = null) => {
  if (!RC_LIVE) {
    console.log('[RC] Not live — running in dev mode (no-op)');
    return false;
  }
  if (_configured) return true;

  const Purchases = getPurchases();
  if (!Purchases) {
    console.warn('[RC] react-native-purchases not available (Expo Go?)');
    return false;
  }

  try {
    if (__DEV__ && Purchases.LOG_LEVEL) {
      Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
    }

    await Purchases.configure({ apiKey: API_KEY, appUserID: userId ?? undefined });
    _configured = true;
    console.log('[RC] Configured successfully');
    return true;
  } catch (e) {
    console.error('[RC] configure failed:', e);
    return false;
  }
};

// ─── User identity ───────────────────────────────────────────────────────────

/**
 * Identify a logged-in user. Call after login / on app boot when you have a userId.
 * RevenueCat merges anonymous + identified customer info automatically.
 */
export const identifyUser = async (userId) => {
  if (!RC_LIVE || !userId) return null;
  const Purchases = getPurchases();
  if (!Purchases) return null;
  try {
    const { customerInfo } = await Purchases.logIn(userId);
    return customerInfo;
  } catch (e) {
    console.error('[RC] logIn failed:', e);
    return null;
  }
};

/**
 * Call on logout. Resets to a new anonymous user so entitlements don't leak
 * between accounts on shared devices.
 */
export const logOutUser = async () => {
  if (!RC_LIVE) return;
  const Purchases = getPurchases();
  if (!Purchases) return;
  try {
    await Purchases.logOut();
  } catch (e) {
    console.error('[RC] logOut failed:', e);
  }
};

// ─── Customer info & entitlements ────────────────────────────────────────────

/**
 * Fetch the latest CustomerInfo from RevenueCat.
 * Returns null on failure or when not live.
 */
export const getCustomerInfo = async () => {
  if (!RC_LIVE) return null;
  const Purchases = getPurchases();
  if (!Purchases) return null;
  try {
    return await Purchases.getCustomerInfo();
  } catch (e) {
    console.error('[RC] getCustomerInfo failed:', e);
    return null;
  }
};

/**
 * Returns true when the "Albor Pro" entitlement is active.
 * Returns null when RC is unavailable (treat as unknown).
 */
export const checkAlborPro = async () => {
  const info = await getCustomerInfo();
  if (!info) return null;
  return !!info.entitlements.active[ENTITLEMENT_ID];
};

/**
 * Convenience helper — synchronously read entitlement from a customerInfo object.
 */
export const isEntitled = (customerInfo) =>
  !!customerInfo?.entitlements?.active?.[ENTITLEMENT_ID];

/**
 * Listen for CustomerInfo updates (e.g. after a purchase elsewhere or
 * a subscription renewal in the background). Returns an unsubscribe fn.
 */
export const addCustomerInfoListener = (callback) => {
  const Purchases = getPurchases();
  if (!Purchases || !RC_LIVE) return () => {};
  const listener = Purchases.addCustomerInfoUpdateListener(callback);
  // react-native-purchases returns a subscription object with .remove()
  return () => {
    if (listener && typeof listener.remove === 'function') listener.remove();
  };
};

// ─── Offerings & products ────────────────────────────────────────────────────

/**
 * Fetch all offerings. Returns the packages mapped by plan key:
 * { monthly, yearly, lifetime } — each is a RevenueCat Package object.
 *
 * Returns null if offerings are unavailable.
 */
export const getOfferings = async () => {
  if (!RC_LIVE) return null;
  const Purchases = getPurchases();
  if (!Purchases) return null;

  try {
    const offerings = await Purchases.getOfferings();
    const current = offerings?.current;
    if (!current?.availablePackages?.length) return null;

    const byPlan = {};

    for (const pkg of current.availablePackages) {
      const id = pkg.product?.identifier;
      if (id === PRODUCT_IDS.monthly)  byPlan.monthly  = pkg;
      if (id === PRODUCT_IDS.yearly)   byPlan.yearly   = pkg;
      if (id === PRODUCT_IDS.lifetime) byPlan.lifetime = pkg;
    }

    // Fallback to RC's standard package types if IDs don't match
    if (!byPlan.monthly  && current.monthly)  byPlan.monthly  = current.monthly;
    if (!byPlan.yearly   && current.annual)   byPlan.yearly   = current.annual;
    if (!byPlan.lifetime && current.lifetime) byPlan.lifetime = current.lifetime;

    return Object.keys(byPlan).length ? byPlan : null;
  } catch (e) {
    console.error('[RC] getOfferings failed:', e);
    return null;
  }
};

// ─── Purchasing ──────────────────────────────────────────────────────────────

/**
 * Purchase a RevenueCat Package object (returned from getOfferings).
 *
 * Returns:
 *   { success: true,  entitled: boolean, customerInfo }
 *   { success: false, userCancelled: true }
 *   { success: false, error: string }
 */
export const purchasePackage = async (pkg) => {
  if (!RC_LIVE) return { success: false, error: 'billing_not_live' };
  const Purchases = getPurchases();
  if (!Purchases) return { success: false, error: 'sdk_unavailable' };
  if (!pkg)       return { success: false, error: 'no_package' };

  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return {
      success:      true,
      entitled:     isEntitled(customerInfo),
      customerInfo,
    };
  } catch (e) {
    if (e?.userCancelled) return { success: false, userCancelled: true };
    console.error('[RC] purchasePackage failed:', e);
    return { success: false, error: e?.message ?? 'purchase_failed' };
  }
};

/**
 * Restore previous purchases.
 *
 * Returns:
 *   { success: true,  entitled: boolean, customerInfo }
 *   { success: false, error: string }
 */
export const restorePurchases = async () => {
  if (!RC_LIVE) return { success: false, error: 'billing_not_live' };
  const Purchases = getPurchases();
  if (!Purchases) return { success: false, error: 'sdk_unavailable' };

  try {
    const customerInfo = await Purchases.restorePurchases();
    return {
      success:      true,
      entitled:     isEntitled(customerInfo),
      customerInfo,
    };
  } catch (e) {
    console.error('[RC] restorePurchases failed:', e);
    return { success: false, error: e?.message ?? 'restore_failed' };
  }
};

// ─── RevenueCat Paywall UI ───────────────────────────────────────────────────

/**
 * Present the RevenueCat-configured paywall (full-screen, native UI).
 * This uses the paywall you design in the RC dashboard — no custom UI needed.
 *
 * @param {object} [offering] — optional specific Offering from getOfferings()
 * @returns {boolean} true if the user purchased or restored
 */
export const presentPaywall = async (offering = undefined) => {
  const UI = getUI();
  const PAYWALL_RESULT = getPaywallResult();
  if (!UI || !RC_LIVE) return false;

  try {
    const result = await UI.presentPaywall(
      offering ? { offering } : undefined
    );

    switch (result) {
      case PAYWALL_RESULT?.PURCHASED:
      case PAYWALL_RESULT?.RESTORED:
        return true;
      default:
        return false;
    }
  } catch (e) {
    console.error('[RC] presentPaywall failed:', e);
    return false;
  }
};

/**
 * Present the paywall only when the user does NOT have "Albor Pro".
 * Automatically skipped if the entitlement is already active.
 *
 * @param {object} [offering] — optional specific Offering
 * @returns {boolean} true if the user purchased or restored
 */
export const presentPaywallIfNeeded = async (offering = undefined) => {
  const UI = getUI();
  const PAYWALL_RESULT = getPaywallResult();
  if (!UI || !RC_LIVE) return false;

  try {
    const options = {
      requiredEntitlementIdentifier: ENTITLEMENT_ID,
      ...(offering ? { offering } : {}),
    };
    const result = await UI.presentPaywallIfNeeded(options);

    switch (result) {
      case PAYWALL_RESULT?.PURCHASED:
      case PAYWALL_RESULT?.RESTORED:
        return true;
      case PAYWALL_RESULT?.NOT_PRESENTED:
        // User already has Albor Pro — treat as success
        return true;
      default:
        return false;
    }
  } catch (e) {
    console.error('[RC] presentPaywallIfNeeded failed:', e);
    return false;
  }
};

// ─── Customer Center ─────────────────────────────────────────────────────────

/**
 * Present the RevenueCat Customer Center — self-service subscription
 * management (cancel, restore, refund request, manage plan).
 *
 * Best placed behind a "Manage subscription" button in your profile/settings.
 * Requires react-native-purchases-ui >= 8.7.0 and RC Pro/Enterprise plan.
 *
 * @param {object} [callbacks] — optional event callbacks
 */
export const presentCustomerCenter = async (callbacks = {}) => {
  const UI = getUI();
  if (!UI || !RC_LIVE) return;

  try {
    await UI.presentCustomerCenter({ callbacks });
  } catch (e) {
    console.error('[RC] presentCustomerCenter failed:', e);
  }
};

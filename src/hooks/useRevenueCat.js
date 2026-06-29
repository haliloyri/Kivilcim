/**
 * useRevenueCat.js
 * React hook for subscription state + actions in Albor.
 *
 * Usage:
 *   const { isPro, isLoading, showPaywall, showCustomerCenter, refresh } = useRevenueCat();
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  RC_LIVE,
  ENTITLEMENT_ID,
  initRevenueCat,
  getCustomerInfo,
  isEntitled,
  addCustomerInfoListener,
  getOfferings,
  purchasePackage,
  restorePurchases,
  presentPaywall,
  presentPaywallIfNeeded,
  presentCustomerCenter,
  identifyUser,
  logOutUser,
} from '../services/revenuecat';

/**
 * Primary hook — manages subscription state and exposes purchase actions.
 *
 * @param {string|null} userId — pass your app's user ID to identify the customer
 *                               in RevenueCat. Pass null for anonymous users.
 */
export const useRevenueCat = (userId = null) => {
  const [customerInfo, setCustomerInfo] = useState(null);
  const [offerings, setOfferings]       = useState(null);
  const [isLoading, setIsLoading]       = useState(true);
  const [error, setError]               = useState(null);
  const initialized = useRef(false);

  // ── Derived state ──────────────────────────────────────────────────────────
  const isPro = isEntitled(customerInfo);

  // ── Initialise & load ──────────────────────────────────────────────────────
  const init = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const ok = await initRevenueCat(userId);
      if (!ok) {
        // Not live (dev mode) — stop loading, leave isPro false
        setIsLoading(false);
        return;
      }

      // If userId provided, identify the user
      if (userId) {
        const info = await identifyUser(userId);
        if (info) setCustomerInfo(info);
      } else {
        const info = await getCustomerInfo();
        if (info) setCustomerInfo(info);
      }

      const pkgs = await getOfferings();
      setOfferings(pkgs);
    } catch (e) {
      console.error('[useRevenueCat] init error:', e);
      setError(e?.message ?? 'init_failed');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    init();
  }, [init]);

  // ── Live CustomerInfo listener ─────────────────────────────────────────────
  // Keeps isPro in sync when a subscription renews or is cancelled remotely.
  useEffect(() => {
    const unsubscribe = addCustomerInfoListener((info) => {
      setCustomerInfo(info);
    });
    return unsubscribe;
  }, []);

  // ── Actions ────────────────────────────────────────────────────────────────

  /** Manually refresh CustomerInfo from RevenueCat (e.g. after app foreground) */
  const refresh = useCallback(async () => {
    const info = await getCustomerInfo();
    if (info) setCustomerInfo(info);
  }, []);

  /**
   * Show the RevenueCat paywall.
   * Pass `{ ifNeeded: true }` to only show when user lacks Albor Pro.
   *
   * @param {object} [opts]
   * @param {boolean} [opts.ifNeeded=false] — skip if already Pro
   * @param {object}  [opts.offering]       — specific offering to present
   * @returns {boolean} true if purchased or restored
   */
  const showPaywall = useCallback(async ({ ifNeeded = false, offering } = {}) => {
    const purchased = ifNeeded
      ? await presentPaywallIfNeeded(offering)
      : await presentPaywall(offering);

    if (purchased) {
      // Refresh so isPro updates immediately
      await refresh();
    }
    return purchased;
  }, [refresh]);

  /**
   * Purchase a specific package from the current offerings.
   * @param {'monthly'|'yearly'|'lifetime'} plan
   */
  const purchase = useCallback(async (plan) => {
    if (!offerings?.[plan]) {
      return { success: false, error: 'package_not_found' };
    }
    const result = await purchasePackage(offerings[plan]);
    if (result.success) await refresh();
    return result;
  }, [offerings, refresh]);

  /**
   * Restore previous purchases (required button for App Store / Play Store).
   */
  const restore = useCallback(async () => {
    const result = await restorePurchases();
    if (result.success) await refresh();
    return result;
  }, [refresh]);

  /**
   * Open the RevenueCat Customer Center — self-service subscription management.
   * Best placed in your profile / settings screen.
   *
   * @param {object} [callbacks] — RC Customer Center event callbacks
   *   - onRestoreCompleted({ customerInfo })
   *   - onFeedbackSurveyCompleted({ feedbackSurveyOptionId })
   *   - onShowingManageSubscriptions()
   *   - onRestoreStarted()
   *   - onRestoreFailed({ error })
   *   - onRefundRequestStarted({ productIdentifier })   // iOS only
   *   - onRefundRequestCompleted({ productIdentifier, refundRequestStatus }) // iOS only
   *   - onManagementOptionSelected({ option, url })
   */
  const showCustomerCenter = useCallback(async (callbacks = {}) => {
    const enrichedCallbacks = {
      ...callbacks,
      onRestoreCompleted: async (param) => {
        // Sync local state when user restores inside Customer Center
        if (param?.customerInfo) setCustomerInfo(param.customerInfo);
        callbacks.onRestoreCompleted?.(param);
      },
    };
    await presentCustomerCenter(enrichedCallbacks);
    // Always refresh after Customer Center is dismissed
    await refresh();
  }, [refresh]);

  /** Log out the current user (call on sign-out) */
  const logOut = useCallback(async () => {
    await logOutUser();
    setCustomerInfo(null);
    setOfferings(null);
  }, []);

  // ── Returned API ───────────────────────────────────────────────────────────
  return {
    // State
    isPro,
    customerInfo,
    offerings,       // { monthly, yearly, lifetime } — Package objects
    isLoading,
    error,
    isLive: RC_LIVE,
    entitlementId: ENTITLEMENT_ID,

    // Actions
    showPaywall,        // showPaywall() or showPaywall({ ifNeeded: true })
    purchase,           // purchase('monthly' | 'yearly' | 'lifetime')
    restore,            // restore()
    showCustomerCenter, // showCustomerCenter(callbacks?)
    refresh,            // refresh()
    logOut,             // logOut()
  };
};

export default useRevenueCat;

/**
 * ads.js — Centralized AdMob service
 *
 * Usage:
 *   initAds()               → call once on app boot (after DB ready)
 *   shouldShowAd(opts)      → gating check before any ad
 *   loadRewarded(source)    → returns a loaded RewardedAd (or null on error)
 *   loadInterstitial()      → returns a loaded InterstitialAd (or null on error)
 *
 * Test Ad Unit IDs are used automatically in __DEV__ mode.
 * Replace PROD_* constants with real AdMob unit IDs from console.
 */
import { Platform } from 'react-native';
import MobileAds, {
  RewardedAd,
  RewardedAdEventType,
  InterstitialAd,
  AdEventType,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';

// ─── Ad Unit IDs ─────────────────────────────────────────────────────────────
// Replace these with real IDs obtained from AdMob console.
const PROD_ANDROID_REWARDED  = 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX';
const PROD_IOS_REWARDED      = 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX';
const PROD_ANDROID_INTERSTITIAL = 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX';
const PROD_IOS_INTERSTITIAL  = 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX';
const PROD_ANDROID_BANNER    = 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX';
const PROD_IOS_BANNER        = 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX';

const isAndroid = Platform.OS === 'android';

export const AD_UNITS = {
  rewarded: __DEV__
    ? TestIds.REWARDED
    : (isAndroid ? PROD_ANDROID_REWARDED : PROD_IOS_REWARDED),
  interstitial: __DEV__
    ? TestIds.INTERSTITIAL
    : (isAndroid ? PROD_ANDROID_INTERSTITIAL : PROD_IOS_INTERSTITIAL),
  banner: __DEV__
    ? TestIds.BANNER
    : (isAndroid ? PROD_ANDROID_BANNER : PROD_IOS_BANNER),
};

export { BannerAdSize };

// ─── Session-level interstitial frequency cap ────────────────────────────────
let _sessionInterstitialCount = 0;
let _lastInterstitialTimestamp = 0;
const SESSION_INTERSTITIAL_MAX = 1;         // max per session
const INTERSTITIAL_COOLDOWN_MS = 2 * 60 * 1000; // 2 min between showings

// ─── Init ────────────────────────────────────────────────────────────────────
export const initAds = async () => {
  try {
    await MobileAds().initialize();
  } catch (e) {
    console.warn('[ads] initAds failed:', e?.message);
  }
};

// ─── Gating ──────────────────────────────────────────────────────────────────
/**
 * Returns true if ads should be shown for this user.
 * @param {{ isPremium: boolean, isOnboarded: boolean }} opts
 */
export const shouldShowAd = ({ isPremium, isOnboarded }) => {
  if (isPremium) return false;
  if (!isOnboarded) return false;
  return true;
};

// ─── Rewarded Ad ─────────────────────────────────────────────────────────────
/**
 * Loads and returns a RewardedAd ready to show.
 * Returns null if loading fails.
 */
export const loadRewarded = () => {
  return new Promise((resolve) => {
    try {
      const ad = RewardedAd.createForAdRequest(AD_UNITS.rewarded, {
        requestNonPersonalizedAdsOnly: false,
      });

      const unsubscribeLoaded = ad.addAdEventListener(RewardedAdEventType.LOADED, () => {
        unsubscribeLoaded();
        unsubscribeError();
        resolve(ad);
      });

      const unsubscribeError = ad.addAdEventListener(AdEventType.ERROR, (e) => {
        unsubscribeLoaded();
        unsubscribeError();
        console.warn('[ads] rewarded load error:', e?.message);
        resolve(null);
      });

      ad.load();
    } catch (e) {
      console.warn('[ads] loadRewarded exception:', e?.message);
      resolve(null);
    }
  });
};

// ─── Interstitial Ad ─────────────────────────────────────────────────────────
/**
 * Loads and returns an InterstitialAd ready to show.
 * Respects session frequency cap. Returns null if cap reached or load fails.
 */
export const loadInterstitial = () => {
  return new Promise((resolve) => {
    const now = Date.now();
    if (_sessionInterstitialCount >= SESSION_INTERSTITIAL_MAX) {
      resolve(null);
      return;
    }
    if (now - _lastInterstitialTimestamp < INTERSTITIAL_COOLDOWN_MS) {
      resolve(null);
      return;
    }

    try {
      const ad = InterstitialAd.createForAdRequest(AD_UNITS.interstitial, {
        requestNonPersonalizedAdsOnly: false,
      });

      const unsubscribeLoaded = ad.addAdEventListener(AdEventType.LOADED, () => {
        unsubscribeLoaded();
        unsubscribeError();
        resolve(ad);
      });

      const unsubscribeError = ad.addAdEventListener(AdEventType.ERROR, (e) => {
        unsubscribeLoaded();
        unsubscribeError();
        console.warn('[ads] interstitial load error:', e?.message);
        resolve(null);
      });

      ad.load();
    } catch (e) {
      console.warn('[ads] loadInterstitial exception:', e?.message);
      resolve(null);
    }
  });
};

/**
 * Show a pre-loaded InterstitialAd and update frequency counters.
 * Call this with the ad returned by loadInterstitial().
 * @param {InterstitialAd} ad
 * @param {function} onClosed - called when ad closes or on error
 */
export const showInterstitial = (ad, onClosed) => {
  if (!ad) {
    onClosed?.();
    return;
  }
  const unsubscribeClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
    unsubscribeClosed();
    _sessionInterstitialCount += 1;
    _lastInterstitialTimestamp = Date.now();
    onClosed?.();
  });
  try {
    ad.show();
  } catch (e) {
    console.warn('[ads] showInterstitial error:', e?.message);
    onClosed?.();
  }
};

/** Reset session counters (call on app foreground or fresh session). */
export const resetSessionAdCounters = () => {
  _sessionInterstitialCount = 0;
};

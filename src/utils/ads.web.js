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
 * Native app IDs are configured in app.json through the
 * react-native-google-mobile-ads config plugin. Debug builds intentionally use
 * Google's sample app IDs there so the native SDK can initialize safely.
 */
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { resolveRewardedGate } from './adRegion';

// react-native-google-mobile-ads is a native module — not available in Expo Go.
// We provide no-op stubs so the app doesn't crash during development.
// appOwnership is deprecated; executionEnvironment is the current signal.
const isExpoGo = Constants.executionEnvironment === 'storeClient'
  || Constants.appOwnership === 'expo';
const hasNativeAds = false;

let MobileAds, RewardedAd, RewardedAdEventType, InterstitialAd, AdEventType, BannerAdSize, TestIds;

const noop = () => {};
const noopAd = {
  addAdEventListener: () => noop,
  load: noop,
  show: noop,
};
MobileAds = () => ({ initialize: async () => {} });
RewardedAd = { createForAdRequest: () => noopAd };
InterstitialAd = { createForAdRequest: () => noopAd };
RewardedAdEventType = { LOADED: 'loaded', EARNED_REWARD: 'earned_reward' };
AdEventType = { LOADED: 'loaded', ERROR: 'error', CLOSED: 'closed' };
BannerAdSize = { BANNER: 'BANNER' };
TestIds = { REWARDED: '', INTERSTITIAL: '', BANNER: '' };

// ─── Ad Unit IDs ─────────────────────────────────────────────────────────────
// Replace these with real IDs obtained from AdMob console.
const PROD_ANDROID_REWARDED  = 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX';
const PROD_IOS_REWARDED      = 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX';
const PROD_ANDROID_INTERSTITIAL = 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX';
const PROD_IOS_INTERSTITIAL  = 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX';
const PROD_ANDROID_BANNER    = 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX';
const PROD_IOS_BANNER        = 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX';

const isAndroid = Platform.OS === 'android';

// ⚠️ TEMPORARY: force Google sample test ads even in release builds so ads can be
// verified on a physical device before real AdMob unit IDs exist.
// Set to false (and fill in the PROD_* constants above) before shipping real ads.
const USE_TEST_ADS = true;

const useTest = __DEV__ || USE_TEST_ADS;

export const AD_UNITS = {
  rewarded: useTest
    ? TestIds.REWARDED
    : (isAndroid ? PROD_ANDROID_REWARDED : PROD_IOS_REWARDED),
  interstitial: useTest
    ? TestIds.INTERSTITIAL
    : (isAndroid ? PROD_ANDROID_INTERSTITIAL : PROD_IOS_INTERSTITIAL),
  banner: useTest
    ? TestIds.BANNER
    : (isAndroid ? PROD_ANDROID_BANNER : PROD_IOS_BANNER),
};

export { BannerAdSize };

// ─── Interstitial frequency: every 3 stories AND 3-min cooldown ─────────────
let _storiesReadSinceLastAd = 0;
let _lastInterstitialTimestamp = 0;
const AD_EVERY_N_STORIES = 3;
// Per-session cap for capped interstitials. These two were referenced in
// loadInterstitial() but never declared, so any capped call threw a
// ReferenceError instead of loading an ad.
let _sessionInterstitialCount = 0;
const SESSION_INTERSTITIAL_MAX = 6;
const INTERSTITIAL_COOLDOWN_MS = 3 * 60 * 1000; // 3 min between showings

/**
 * Call once each time a story is opened (for free, onboarded users).
 * Returns true when both conditions are met: ≥3 stories read AND ≥3 min elapsed.
 */
export const recordStoryRead = () => {
  _storiesReadSinceLastAd += 1;
  const enoughStories = _storiesReadSinceLastAd >= AD_EVERY_N_STORIES;
  const enoughTime    = Date.now() - _lastInterstitialTimestamp >= INTERSTITIAL_COOLDOWN_MS;
  return enoughStories && enoughTime;
};

// ─── Init ────────────────────────────────────────────────────────────────────
export const initAds = async () => {
  if (!hasNativeAds) {
    // Expo Go / web: the AdMob native module isn't there, every request would
    // just time out. Ads need a development or release build.
    console.warn('[ads] native AdMob module unavailable (Expo Go or web) — ads disabled');
    return;
  }
  try {
    const statuses = await MobileAds().initialize();
    if (__DEV__) console.log('[ads] initialized', JSON.stringify(statuses));
    preloadRewarded();
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

/**
 * See resolveRewardedGate in utils/adRegion.js. Returns 'allow' | 'ad' | 'paywall'.
 */
export const rewardedGate = ({ isPremium, isOnboarded = true, alreadyUnlocked = false }) =>
  resolveRewardedGate({
    adsAvailable: shouldShowAd({ isPremium, isOnboarded }),
    isPremium,
    alreadyUnlocked,
  });

// ─── Rewarded Ad ─────────────────────────────────────────────────────────────
// A rewarded ad is requested ahead of time and kept ready, instead of being
// requested only when the user taps "Watch ad". The first request after app
// start routinely takes longer than the old 8 s limit (the SDK is still warming
// up), so the tap timed out and the user got "ad not ready" even though the ad
// would have arrived a few seconds later. Now:
//   • preloadRewarded() starts a request (sheet opens, app start, after a show)
//   • loadRewarded() hands over the ready ad, or waits for the in-flight
//     request — one request, never discarded on a UI timeout.
const REWARDED_LOAD_TIMEOUT_MS = 20000;
// Google: a loaded ad is valid for one hour. Drop it a bit earlier.
const REWARDED_MAX_AGE_MS = 50 * 60 * 1000;

let _rewardedReady = null;     // { ad, loadedAt }
let _rewardedInFlight = null;  // Promise<{ ad, loadedAt } | null>

const requestRewarded = () => new Promise((resolve) => {
  let settled = false;
  let fallbackTimer = null;
  let unsubscribeLoaded = null;
  let unsubscribeError = null;
  const finish = (ad) => {
    if (settled) return;
    settled = true;
    if (fallbackTimer) clearTimeout(fallbackTimer);
    unsubscribeLoaded?.();
    unsubscribeError?.();
    resolve(ad ? { ad, loadedAt: Date.now() } : null);
  };

  try {
    const ad = RewardedAd.createForAdRequest(AD_UNITS.rewarded, {
      requestNonPersonalizedAdsOnly: false,
    });
    const startedAt = Date.now();
    unsubscribeLoaded = ad.addAdEventListener(RewardedAdEventType.LOADED, () => {
      if (__DEV__) console.log(`[ads] rewarded loaded in ${Date.now() - startedAt} ms`);
      finish(ad);
    });
    unsubscribeError = ad.addAdEventListener(AdEventType.ERROR, (e) => {
      console.warn('[ads] rewarded load error:', e?.code, e?.message);
      finish(null);
    });
    fallbackTimer = setTimeout(() => {
      console.warn(`[ads] rewarded load timeout (${REWARDED_LOAD_TIMEOUT_MS} ms, native=${hasNativeAds}, unit=${AD_UNITS.rewarded || 'none'})`);
      finish(null);
    }, REWARDED_LOAD_TIMEOUT_MS);
    ad.load();
  } catch (e) {
    console.warn('[ads] loadRewarded exception:', e?.message);
    finish(null);
  }
});

/** Start loading a rewarded ad in the background if none is ready or loading. */
export const preloadRewarded = () => {
  if (isAdRestrictedRegion()) return null;
  if (_rewardedReady && Date.now() - _rewardedReady.loadedAt < REWARDED_MAX_AGE_MS) return null;
  _rewardedReady = null;
  if (_rewardedInFlight) return _rewardedInFlight;
  _rewardedInFlight = requestRewarded().then((result) => {
    _rewardedInFlight = null;
    _rewardedReady = result;
    return result;
  });
  return _rewardedInFlight;
};

/**
 * Returns a loaded RewardedAd ready to show, or null if none could be loaded.
 * Uses the preloaded ad when there is one; otherwise waits for the request.
 */
export const loadRewarded = async () => {
  if (isAdRestrictedRegion()) return null;
  if (!_rewardedReady) await preloadRewarded();
  const ready = _rewardedReady;
  _rewardedReady = null;
  if (!ready || Date.now() - ready.loadedAt >= REWARDED_MAX_AGE_MS) return null;
  return ready.ad;
};

// ─── Interstitial Ad ─────────────────────────────────────────────────────────
/**
 * Loads and returns an InterstitialAd ready to show.
 * Respects session frequency cap. Returns null if cap reached or load fails.
 */
export const loadInterstitial = ({ ignoreCap = false } = {}) => {
  return new Promise((resolve) => {
    const now = Date.now();
    // Frequency cap (skippable for test/"every story" flows via ignoreCap).
    if (!ignoreCap) {
      if (_sessionInterstitialCount >= SESSION_INTERSTITIAL_MAX) {
        resolve(null);
        return;
      }
      if (now - _lastInterstitialTimestamp < INTERSTITIAL_COOLDOWN_MS) {
        resolve(null);
        return;
      }
    }

    let settled = false;
    let fallbackTimer = null;
    const finish = (ad) => {
      if (settled) return;
      settled = true;
      if (fallbackTimer) clearTimeout(fallbackTimer);
      resolve(ad);
    };

    try {
      const ad = InterstitialAd.createForAdRequest(AD_UNITS.interstitial, {
        requestNonPersonalizedAdsOnly: false,
      });

      const unsubscribeLoaded = ad.addAdEventListener(AdEventType.LOADED, () => {
        unsubscribeLoaded();
        unsubscribeError();
        finish(ad);
      });

      const unsubscribeError = ad.addAdEventListener(AdEventType.ERROR, (e) => {
        unsubscribeLoaded();
        unsubscribeError();
        console.warn('[ads] interstitial load error:', e?.message);
        finish(null);
      });

      // Never block the UI forever if the SDK neither loads nor errors.
      fallbackTimer = setTimeout(() => {
        unsubscribeLoaded();
        unsubscribeError();
        console.warn('[ads] interstitial load timeout');
        finish(null);
      }, 8000);

      ad.load();
    } catch (e) {
      console.warn('[ads] loadInterstitial exception:', e?.message);
      finish(null);
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
  let finished = false;
  const finishOnce = () => {
    if (finished) return;
    finished = true;
    unsubscribeClosed?.();
    unsubscribeError?.();
    onClosed?.();
  };
  const unsubscribeClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
    _storiesReadSinceLastAd = 0;
    _lastInterstitialTimestamp = Date.now();
    _sessionInterstitialCount += 1;
    finishOnce();
  });
  const unsubscribeError = ad.addAdEventListener(AdEventType.ERROR, (e) => {
    console.warn('[ads] interstitial show error:', e?.message);
    finishOnce();
  });
  // show() returns a Promise in react-native-google-mobile-ads. A rejected
  // show (ad expired, another screen already presenting, …) never reaches a
  // try/catch and never fires CLOSED, so it has to be caught here — otherwise
  // the caller waits forever (e.g. the story's loading overlay never lifts).
  try {
    Promise.resolve(ad.show()).catch((e) => {
      console.warn('[ads] showInterstitial rejected:', e?.message);
      finishOnce();
    });
  } catch (e) {
    console.warn('[ads] showInterstitial error:', e?.message);
    finishOnce();
  }
};

/**
 * Show a pre-loaded RewardedAd with proper listener cleanup.
 *
 * IMPORTANT: A full-screen ad must NOT be presented while a React Native
 * <Modal> is still mounted/animating — on Android this causes the ad to flash
 * for ~1s and then the app to freeze (window/focus conflict). Callers should
 * close any open Modal first and only then call this helper (e.g. after a short
 * delay so the dismiss animation completes).
 *
 * @param {RewardedAd} ad        - ad returned by loadRewarded()
 * @param {object} handlers
 * @param {function} handlers.onEarned  - called when the reward is earned
 * @param {function} handlers.onClosed  - called once when the ad closes or errors
 */
export const showRewarded = (ad, { onEarned, onClosed } = {}) => {
  if (!ad) {
    onClosed?.();
    return;
  }

  let finished = false;
  const cleanup = () => {
    unsubscribeEarned?.();
    unsubscribeClosed?.();
    unsubscribeError?.();
  };
  const finishOnce = () => {
    if (finished) return;
    finished = true;
    cleanup();
    onClosed?.();
  };

  const unsubscribeEarned = ad.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
    onEarned?.();
  });
  const unsubscribeClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
    // A rewarded ad just played — don't follow it with an interstitial on the
    // very next story.
    _storiesReadSinceLastAd = 0;
    _lastInterstitialTimestamp = Date.now();
    finishOnce();
    // Have the next one ready for the next gate.
    setTimeout(preloadRewarded, 1000);
  });
  const unsubscribeError = ad.addAdEventListener(AdEventType.ERROR, (e) => {
    console.warn('[ads] rewarded show error:', e?.message);
    finishOnce();
  });

  // show() returns a Promise; a rejection (ad expired, a Modal still on
  // screen, …) is neither thrown synchronously nor reported as an ERROR
  // event, so without this catch the tap silently did nothing.
  try {
    Promise.resolve(ad.show()).catch((e) => {
      console.warn('[ads] showRewarded rejected:', e?.message);
      finishOnce();
    });
  } catch (e) {
    console.warn('[ads] showRewarded exception:', e?.message);
    finishOnce();
  }
};

/** Reset session counters (call on app foreground or fresh session). */
export const resetSessionAdCounters = () => {
  _storiesReadSinceLastAd = 0;
  _lastInterstitialTimestamp = 0;
  _sessionInterstitialCount = 0;
};

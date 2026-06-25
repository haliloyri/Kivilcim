// analytics.js — PostHog product analytics
//
// Pattern mirrors billing.js / ads.js: the SDK is lazy-required so the app
// never crashes in Expo Go or before the native rebuild, and analytics stays a
// no-op (logs only) until a real PostHog key is configured.
//
// SETUP:
//   1. Create a free PostHog project (EU host recommended for KVKK/GDPR).
//   2. Put the project API key in either:
//        - app.json -> expo.extra.posthog.apiKey, or
//        - an EXPO_PUBLIC_POSTHOG_API_KEY env var.
//   3. `npx expo install posthog-react-native expo-file-system expo-application
//       expo-device expo-localization`
//   4. Rebuild the native app (expo prebuild / EAS). Not available in Expo Go.
import Constants from 'expo-constants';

const PH_CONFIG =
  Constants.expoConfig?.extra?.posthog ??
  Constants.manifest?.extra?.posthog ??
  {};

const API_KEY =
  process.env.EXPO_PUBLIC_POSTHOG_API_KEY || PH_CONFIG.apiKey || '';
const HOST =
  process.env.EXPO_PUBLIC_POSTHOG_HOST ||
  PH_CONFIG.host ||
  'https://eu.i.posthog.com';

// A key counts as "live" only if it's a real, non-placeholder PostHog token.
const isPlaceholder = (key) =>
  !key ||
  typeof key !== 'string' ||
  key.trim() === '' ||
  key.startsWith('REPLACE_') ||
  key.startsWith('phc_xxx') ||
  key.startsWith('<');

export const ANALYTICS_LIVE = !isPlaceholder(API_KEY);

// Lazy-load the native SDK. Returns null if the module isn't available
// (e.g. Expo Go or before the native rebuild) so callers fall back safely.
let _PostHog = null;
let _loadAttempted = false;
const getPostHogClass = () => {
  if (_loadAttempted) return _PostHog;
  _loadAttempted = true;
  try {
    // eslint-disable-next-line global-require
    _PostHog = require('posthog-react-native').default;
  } catch (e) {
    _PostHog = null;
  }
  return _PostHog;
};

let _client = null;

/**
 * Create the PostHog client once. Safe to call multiple times.
 * Call early in app startup (App.js), after reading saved language.
 */
export const initAnalytics = () => {
  if (_client) return _client;
  if (!ANALYTICS_LIVE) return null;
  const PostHog = getPostHogClass();
  if (!PostHog) return null;
  try {
    _client = new PostHog(API_KEY, {
      host: HOST,
      // App lifecycle (install/open/update) captured by default in v4.39+.
      flushAt: 20,
      flushInterval: 10000,
    });
  } catch (e) {
    console.warn('[analytics] init failed:', e?.message);
    _client = null;
  }
  return _client;
};

/**
 * Register super properties that get attached to EVERY future event
 * (e.g. lang, is_premium). Used for segmenting the 8 success metrics.
 */
export const setAnalyticsContext = (props = {}) => {
  if (!_client || !props || typeof props !== 'object') return;
  try {
    _client.register(sanitizePayload(props));
  } catch (e) {
    console.warn('[analytics] setContext failed:', e?.message);
  }
};

/**
 * Tie events to a stable user id (use only if/when you add accounts).
 */
export const identifyUser = (distinctId, props = {}) => {
  if (!_client || !distinctId) return;
  try {
    _client.identify(String(distinctId), sanitizePayload(props));
  } catch (e) {
    console.warn('[analytics] identify failed:', e?.message);
  }
};

/** Clear identity (e.g. on logout / data reset). */
export const resetAnalytics = () => {
  if (!_client) return;
  try {
    _client.reset();
  } catch (e) {}
};

/** Force-send queued events (e.g. before backgrounding). */
export const flushAnalytics = async () => {
  if (!_client) return;
  try {
    await _client.flush();
  } catch (e) {}
};

const ANALYTICS_EVENTS = {
  ONBOARDING_TIME_BUDGET_SELECTED: 'onboarding_time_budget_selected',
  ONBOARDING_NOTIFICATION_TIME_SELECTED: 'onboarding_notification_time_selected',
  PERSONALIZED_FEED_SHOWN: 'personalized_feed_shown',
  PERSONALIZED_STORY_OPENED: 'personalized_story_opened',
  PAYWALL_VIEWED: 'paywall_viewed',
  PAYWALL_PLAN_SELECTED: 'paywall_plan_selected',
  PAYWALL_PURCHASE_STARTED: 'paywall_purchase_started',
  PAYWALL_PURCHASE_SUCCEEDED: 'paywall_purchase_succeeded',
  PAYWALL_PURCHASE_FAILED: 'paywall_purchase_failed',
  FREE_LIMIT_TO_PAYWALL: 'free_limit_to_paywall',
  DAILY_TARGET_COMPLETED: 'daily_target_completed',
  STREAK_FREEZE_ACTIVATED: 'streak_freeze_activated',
  STREAK_FREEZE_UPSELL_CLICKED: 'streak_freeze_upsell_clicked',
  NOTIFICATION_SCHEDULED: 'notification_scheduled',
  NOTIFICATION_OPENED: 'notification_opened',
  REMINDER_TIME_CHANGED: 'reminder_time_changed',
  MODULE_SHOWN: 'module_shown',
  MODULE_CLICKED: 'module_clicked',
  MODULE_DISMISSED: 'module_dismissed',
  STORY_SHARED: 'story_shared',
  // Conversation-use success signals
  USE_IN_CONVO_OPENED: 'use_in_convo_opened',
  MICRO_VARIANT_COPIED: 'micro_variant_copied',
  MICRO_VARIANT_FAVORITED: 'micro_variant_favorited',
  STORY_VARIANT_USED: 'story_variant_used',
  STORYTELLER_MODE_OPENED: 'storyteller_mode_opened',
  STORYTELLER_PRACTICE_COMPLETED: 'storyteller_practice_completed',
  SOCIAL_SHARE_PLATFORM: 'social_share_platform',
  // Ads
  AD_IMPRESSION: 'ad_impression',
  AD_CLICKED: 'ad_clicked',
  AD_FAILED_TO_LOAD: 'ad_failed_to_load',
  REWARDED_AD_COMPLETED: 'rewarded_ad_completed',
  AD_OR_PREMIUM_CHOICE: 'ad_or_premium_choice',
};

const sanitizePayload = (payload) => {
  if (!payload || typeof payload !== 'object') return {};

  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined)
  );
};

export const trackEvent = async (eventName, payload = {}) => {
  if (!eventName) return;

  const safePayload = sanitizePayload(payload);

  // Send to PostHog when configured + available.
  if (_client) {
    try {
      _client.capture(eventName, safePayload);
    } catch (e) {
      console.warn('[analytics] capture failed:', e?.message);
    }
  }

  // Keep a dev log so events are visible locally even without a live key.
  if (__DEV__ || !_client) {
    console.log(
      '[analytics]',
      JSON.stringify({
        event: eventName,
        payload: safePayload,
        timestamp: new Date().toISOString(),
      })
    );
  }
};

export { ANALYTICS_EVENTS };

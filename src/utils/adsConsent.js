// adsConsent — privacy consent before any ad request, in Google's order:
//   1. UMP (Google User Messaging Platform): asks for GDPR consent where the law
//      requires it (EEA/UK/CH). Elsewhere it returns at once without UI. The
//      messages themselves are configured in AdMob → Privacy & messaging.
//   2. ATT (iOS App Tracking Transparency): Apple's system prompt, all countries.
//   3. Only then MobileAds().initialize() (see utils/ads.js).
//
// Personalized ads are requested only when UMP allows personalization AND, on
// iOS, the user granted tracking. Native modules are loaded lazily so Expo Go,
// web and tests degrade to "non-personalized, can request ads".
import { Platform } from 'react-native';

const state = {
  canRequestAds: true,
  personalized: false,
  privacyOptionsRequired: false,
};

const loadAdsModule = () => {
  try {
    // eslint-disable-next-line global-require
    return require('react-native-google-mobile-ads');
  } catch {
    return null;
  }
};
const loadAdsConsent = () => loadAdsModule()?.AdsConsent || null;

const loadTracking = () => {
  try {
    // eslint-disable-next-line global-require
    return require('expo-tracking-transparency');
  } catch {
    return null;
  }
};

const requestTracking = async () => {
  if (Platform.OS !== 'ios') return true;
  const tracking = loadTracking();
  if (!tracking?.requestTrackingPermissionsAsync) return false;
  try {
    const current = await tracking.getTrackingPermissionsAsync();
    if (current?.granted) return true;
    if (current?.canAskAgain === false) return false;
    const { granted } = await tracking.requestTrackingPermissionsAsync();
    return !!granted;
  } catch (e) {
    console.warn('[consent] ATT request failed:', e?.message);
    return false;
  }
};

/**
 * Runs UMP then ATT. Never throws; on any failure ads stay non-personalized.
 * @returns {Promise<{ canRequestAds: boolean, personalized: boolean, privacyOptionsRequired: boolean }>}
 */
export const gatherAdsConsent = async () => {
  const AdsConsent = loadAdsConsent();
  let umpAllowsPersonalized = true;

  if (AdsConsent?.gatherConsent) {
    try {
      const ads = loadAdsModule();
      const OBTAINED = ads?.AdsConsentStatus?.OBTAINED ?? 'OBTAINED';
      const OPTIONS_REQUIRED = ads?.AdsConsentPrivacyOptionsRequirementStatus?.REQUIRED ?? 'REQUIRED';
      const info = await AdsConsent.gatherConsent();
      state.canRequestAds = info?.canRequestAds !== false;
      state.privacyOptionsRequired = info?.privacyOptionsRequirementStatus === OPTIONS_REQUIRED;
      // Where consent isn't required, UMP reports no choices → personalization OK.
      if (info?.status === OBTAINED && AdsConsent.getUserChoices) {
        const choices = await AdsConsent.getUserChoices();
        umpAllowsPersonalized = !!choices?.selectPersonalisedAds;
      }
    } catch (e) {
      // A UMP failure (offline, form misconfigured) must not block the app;
      // Google still lets us request ads when consent info is unavailable,
      // but never personalized ones.
      console.warn('[consent] UMP failed:', e?.message);
      umpAllowsPersonalized = false;
    }
  }

  const trackingGranted = state.canRequestAds ? await requestTracking() : false;
  state.personalized = state.canRequestAds && umpAllowsPersonalized && trackingGranted;
  return { ...state };
};

/** Ad request options reflecting the current consent. */
export const adRequestOptions = () => ({
  requestNonPersonalizedAdsOnly: !state.personalized,
});

export const canRequestAds = () => state.canRequestAds;

/** True when UMP requires an in-app entry point to change the privacy choice. */
export const isPrivacyOptionsRequired = () => state.privacyOptionsRequired;

/** Re-opens the UMP privacy options form (Profile → Ad privacy settings). */
export const showPrivacyOptions = async () => {
  const AdsConsent = loadAdsConsent();
  if (!AdsConsent?.showPrivacyOptionsForm) return;
  try {
    await AdsConsent.showPrivacyOptionsForm();
    await gatherAdsConsent();
  } catch (e) {
    console.warn('[consent] privacy options failed:', e?.message);
  }
};

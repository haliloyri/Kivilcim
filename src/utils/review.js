import AsyncStorage from '@react-native-async-storage/async-storage';
import * as StoreReview from 'expo-store-review';
import { ANALYTICS_EVENTS, trackEvent } from './analytics';

// Store rating is the single strongest lever on store-page conversion, and
// today nothing in the app ever asks for one. Ask only at genuinely positive
// moments (a completed streak, an earned badge, a share) — never right after
// a paywall or an error.
const LAST_REQUESTED_STORAGE_KEY = '@albor_review_last_requested_at';
// At most once a year per install, per Apple/Google review-prompt guidelines
// (the OS itself also caps how often it will actually show the native sheet).
const MIN_INTERVAL_MS = 365 * 24 * 60 * 60 * 1000;
// Free users need a couple of real reads before being asked; paying users
// have already shown commitment, so they can be asked at the very first
// positive moment without this extra gate.
const MIN_TOTAL_READS_FREE = 2;

/**
 * Ask the OS for an in-app store review, at most once a year per install and
 * only at a positive moment. No-ops safely if the native module/store review
 * API isn't available (Expo Go, unsupported platform, or the OS has already
 * exhausted its own internal quota).
 *
 * @returns {Promise<boolean>} true if the prompt was actually requested
 */
export const maybeRequestReview = async ({ isPremium = false, totalReads = 0 } = {}) => {
  try {
    if (!isPremium && totalReads < MIN_TOTAL_READS_FREE) return false;

    const available = await StoreReview.isAvailableAsync();
    if (!available) return false;

    const lastRequestedRaw = await AsyncStorage.getItem(LAST_REQUESTED_STORAGE_KEY);
    const lastRequestedAt = lastRequestedRaw ? Number(lastRequestedRaw) : 0;
    if (Number.isFinite(lastRequestedAt) && Date.now() - lastRequestedAt < MIN_INTERVAL_MS) {
      return false;
    }

    await AsyncStorage.setItem(LAST_REQUESTED_STORAGE_KEY, String(Date.now()));
    await StoreReview.requestReview();
    trackEvent(ANALYTICS_EVENTS.REVIEW_PROMPT_SHOWN, { isPremium, totalReads });
    return true;
  } catch (e) {
    console.warn('[review] requestReview failed:', e?.message);
    return false;
  }
};

// Ads grace period: a new install sees no in-page ads (full-screen ads between
// stories, in-feed native cards) for its first AD_FREE_DAYS days. The opt-in
// rewarded ad ("watch an ad or go Premium") is not part of this: it stays.
import AsyncStorage from '@react-native-async-storage/async-storage';

export const INSTALL_AT_KEY = '@albor_install_at';
export const AD_FREE_DAYS = 3;

const DAY_MS = 24 * 60 * 60 * 1000;

let installAt = null;

// Reads the install time, writing it on the first run. Call once at boot,
// before any ad can be requested.
export const initInstallGrace = async () => {
  try {
    const stored = Number(await AsyncStorage.getItem(INSTALL_AT_KEY));
    if (Number.isFinite(stored) && stored > 0) {
      installAt = stored;
    } else {
      installAt = Date.now();
      await AsyncStorage.setItem(INSTALL_AT_KEY, String(installAt));
    }
  } catch (e) {
    // Storage unavailable: no grace, ads follow their normal rules.
  }
  return installAt;
};

export const getInstallAt = () => installAt;

export const isInAdGrace = (now = Date.now()) =>
  installAt != null && now - installAt < AD_FREE_DAYS * DAY_MS;

export const __setInstallAtForTests = (value) => { installAt = value; };

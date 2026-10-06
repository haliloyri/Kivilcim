// Single switch for real money: real ads + real store purchases.
//
//   LIVE  → EAS `production` profile, release JS (!__DEV__), physical device.
//   DEMO  → everything else: Metro/dev client, `development` / `preview` / `apk`
//           profiles, and any simulator/emulator. Demo shows Google TEST ads
//           and (in debug builds only) uses RevenueCat's Test Store.
//
// EXPO_PUBLIC_APP_ENV is set per profile in eas.json and inlined at build time.
import * as Device from 'expo-device';

export const APP_ENV = String(process.env.EXPO_PUBLIC_APP_ENV || 'development').trim().toLowerCase();

export const IS_PHYSICAL_DEVICE = Device.isDevice === true;

export const MONETIZATION_LIVE = APP_ENV === 'production' && !__DEV__ && IS_PHYSICAL_DEVICE;

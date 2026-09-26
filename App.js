import React, { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import * as Linking from 'expo-linking';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { setupNotificationHandler, registerAndSavePushToken, WEEKLY_RECAP_NOTIFICATION_TYPE } from './src/utils/notifications';
import { ANALYTICS_EVENTS, trackEvent, initAnalytics, setAnalyticsContext } from './src/utils/analytics';
import { initAds } from './src/utils/ads';

setupNotificationHandler();

// Fontlar
import {
  useFonts,
  PlayfairDisplay_400Regular,
  PlayfairDisplay_600SemiBold,
  PlayfairDisplay_700Bold,
  PlayfairDisplay_400Regular_Italic,
} from '@expo-google-fonts/playfair-display';
import {
  DMSans_400Regular,
  DMSans_500Medium,
} from '@expo-google-fonts/dm-sans';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_400Regular_Italic,
  Inter_500Medium_Italic,
  Inter_700Bold_Italic,
} from '@expo-google-fonts/inter';

// Tema ve Data
import { ThemeProvider } from './src/context/ThemeContext';
import { UserDataProvider, useUserData } from './src/context/UserDataContext';
import { StoriesProvider } from './src/context/StoriesContext';
import { CareerPathProvider } from './src/context/CareerPathContext';
import CareerPromotionModal from './src/components/career/CareerPromotionModal';
import LearningMilestoneModal from './src/components/career/LearningMilestoneModal';
import { appNavigationRef } from './src/navigation/AppNavigator';
import CareerMigrationSummary from './src/components/career/CareerMigrationSummary';

// Keep the native launch screen visible until the bundled fonts are ready.
SplashScreen.preventAutoHideAsync().catch(() => {});
import { initDb, seedData } from './src/db/db';
import { initUserDb } from './src/db/userDb';
import { ensureDeviceSession, claimReferral, getCachedDeviceUserId } from './src/services/supabase';
import { migrateLocalToServer } from './src/services/migrateLocalToServer';
import { initOfflineQueueFlush } from './src/services/offlineQueue';

// Share links (see src/utils/share.js) carry `?s={referrerDeviceId}&st={storyId}&l={lang}`.
// A universal-link tap while the app is installed — or a custom `albor://`
// link — lands here; a store-redirect "cold" install can't deliver these
// params without the website's own deferred-deep-link piece (out of scope
// for this repo), so this only captures attribution for opens that carry them.
const FIRST_OPEN_RECORDED_KEY = '@albor_first_open_recorded';
const REFERRAL_CLAIMED_KEY = '@albor_referral_claimed';

const parseShareAttribution = (url) => {
  if (!url) return null;
  try {
    const { queryParams } = Linking.parse(url);
    const referrerId = queryParams?.s ? String(queryParams.s) : null;
    if (!referrerId) return null;
    return {
      referrerId,
      storyId: queryParams?.st != null ? String(queryParams.st) : null,
      lang: queryParams?.l != null ? String(queryParams.l) : null,
    };
  } catch (e) {
    return null;
  }
};

function Main() {
  const { applyReferralBonus } = useUserData();

  // Capture share-link attribution: track the open, and (once per device)
  // claim the referral reward through the server RPC — never granted
  // client-side, see applyReferralBonus / claim_referral.
  useEffect(() => {
    const handleIncomingUrl = async (url, { isColdStart = false } = {}) => {
      const attribution = parseShareAttribution(url);
      if (!attribution) return;

      trackEvent(ANALYTICS_EVENTS.SHARE_LINK_OPENED, attribution);

      try {
        const firstOpenAlreadyRecorded = await AsyncStorage.getItem(FIRST_OPEN_RECORDED_KEY);
        if (!firstOpenAlreadyRecorded) {
          await AsyncStorage.setItem(FIRST_OPEN_RECORDED_KEY, '1');
          if (isColdStart) {
            trackEvent(ANALYTICS_EVENTS.INSTALL_FROM_SHARE, attribution);
          }
        }
      } catch (e) {}

      try {
        const alreadyClaimed = await AsyncStorage.getItem(REFERRAL_CLAIMED_KEY);
        if (alreadyClaimed) return;

        const myId = getCachedDeviceUserId() || (await ensureDeviceSession())?.id;
        if (!myId) return; // session not ready yet — retry on the next link open

        if (myId === attribution.referrerId) {
          await AsyncStorage.setItem(REFERRAL_CLAIMED_KEY, '1'); // can't refer yourself, don't keep retrying
          return;
        }

        const result = await claimReferral(attribution);
        await AsyncStorage.setItem(REFERRAL_CLAIMED_KEY, '1');
        if (result.claimed && result.premiumBonusUntil) {
          await applyReferralBonus(result.premiumBonusUntil, attribution);
        }
      } catch (e) {
        console.warn('[referral] claim failed:', e?.message);
      }
    };

    Linking.getInitialURL().then((url) => handleIncomingUrl(url, { isColdStart: true }));
    const subscription = Linking.addEventListener('url', ({ url }) => handleIncomingUrl(url, { isColdStart: false }));
    return () => subscription.remove();
  }, [applyReferralBonus]);

  // Initialize DB and seed data on first run
  useEffect(() => {
    const startup = async () => {
      let savedLang = 'tr';
      try {
        const stored = await AsyncStorage.getItem('lang');
        if (stored) {
          savedLang = stored;
        }
      } catch (e) {}
      // Analytics: init as early as possible, then tag every event with lang.
      initAnalytics();
      setAnalyticsContext({ lang: savedLang });
      await initDb();
      await seedData();
      await initUserDb();
      initAds().catch(e => console.warn('initAds error:', e?.message));

      // Online membership: reuse the device session or create an anonymous one.
      // Non-blocking — local data still works if Supabase is offline/unconfigured.
      ensureDeviceSession()
        .then((user) => {
          if (!user) return;
          setAnalyticsContext({ userId: user.id });
          // One-time backfill of pre-existing local data (favorites, reads,
          // streak, preferences, ...) up to Supabase. No-ops after the first
          // successful run (see migrateLocalToServer.js). Non-blocking.
          migrateLocalToServer().catch((e) => console.warn('migrateLocalToServer error:', e?.message));
          // Retry any writes that got stranded offline last session, then
          // again every time the app comes back to the foreground.
          initOfflineQueueFlush();
          // Register this device for server-side (Supabase) push notifications
          // and save the Expo push token — no-ops on simulator/Expo Go.
          registerAndSavePushToken(user.id).catch((e) => console.warn('registerAndSavePushToken error:', e?.message));
        })
        .catch((e) => console.warn('ensureDeviceSession error:', e?.message));

      // UserDataProvider schedules reminders after preferences and reading
      // statistics have loaded. Keeping scheduling there prevents a second,
      // incomplete startup pass that can cancel and recreate notifications.
    };
    startup().catch(e => console.error('App.js startup error:', e));
  }, []);

  useEffect(() => {
    const openWeeklyRecap = (response) => {
      if (response?.notification?.request?.content?.data?.type !== WEEKLY_RECAP_NOTIFICATION_TYPE) return;
      const go = (attempt = 0) => {
        if (appNavigationRef.current?.isReady?.()) {
          appNavigationRef.current.navigate('MainTabs', { screen: 'ProgressTab', params: { openWeeklyRecap: Date.now() } });
        } else if (attempt < 20) {
          setTimeout(() => go(attempt + 1), 250);
        }
      };
      go();
    };
    // Cold start: the app was opened by tapping the weekly recap.
    Notifications.getLastNotificationResponseAsync?.().then(openWeeklyRecap).catch(() => {});
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      openWeeklyRecap(response);
      const notification = response?.notification;
      trackEvent(ANALYTICS_EVENTS.NOTIFICATION_OPENED, {
        identifier: notification?.request?.identifier,
        title: notification?.request?.content?.title,
        triggerType: notification?.request?.trigger?.type,
      });
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
    PlayfairDisplay_400Regular_Italic,
    DMSans_400Regular,
    DMSans_500Medium,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    // Real italic faces: iOS does not synthesize italics for custom fonts.
    Inter_400Regular_Italic,
    Inter_500Medium_Italic,
    Inter_700Bold_Italic,
  });

  const [fontTimeout, setFontTimeout] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFontTimeout(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const appReady = fontsLoaded || fontTimeout;

  useEffect(() => {
    if (appReady) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [appReady]);

  if (!appReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <AppNavigator />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <UserDataProvider>
          <StoriesProvider>
            <CareerPathProvider>
              <Main />
              <CareerPromotionModal />
              <LearningMilestoneModal />
              <CareerMigrationSummary />
            </CareerPathProvider>
          </StoriesProvider>
        </UserDataProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

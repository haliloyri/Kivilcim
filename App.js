import React, { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { setupNotificationHandler, registerAndSavePushToken } from './src/utils/notifications';
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
  Inter_700Bold
} from '@expo-google-fonts/inter';

// Tema ve Data
import { ThemeProvider } from './src/context/ThemeContext';
import { UserDataProvider } from './src/context/UserDataContext';
import { StoriesProvider } from './src/context/StoriesContext';
import { CareerPathProvider } from './src/context/CareerPathContext';
import CareerPromotionModal from './src/components/career/CareerPromotionModal';
import CareerMigrationSummary from './src/components/career/CareerMigrationSummary';

// Keep the native launch screen visible until the bundled fonts are ready.
SplashScreen.preventAutoHideAsync().catch(() => {});
import { initDb, seedData } from './src/db/db';
import { initUserDb } from './src/db/userDb';
import { ensureDeviceSession } from './src/services/supabase';
import { migrateLocalToServer } from './src/services/migrateLocalToServer';
import { initOfflineQueueFlush } from './src/services/offlineQueue';

function Main() {
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
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
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
              <CareerMigrationSummary />
            </CareerPathProvider>
          </StoriesProvider>
        </UserDataProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

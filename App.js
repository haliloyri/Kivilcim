import React, { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import { View, Text, Image, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { t } from './src/locales/i18n';

import { setupNotificationHandler, scheduleDailyNotifications, registerAndSavePushToken } from './src/utils/notifications';
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

// Splash screen'i dondur
SplashScreen.preventAutoHideAsync();
import { initDb, seedData } from './src/db/db';
import { ensureDeviceSession } from './src/services/supabase';
import { migrateLocalToServer } from './src/services/migrateLocalToServer';
import { initOfflineQueueFlush } from './src/services/offlineQueue';

// Splash designer component (in-app splash screen)
const SplashDesign = () => {
  return (
    <View style={stylesSplash.container}>
      <Image
        source={require('./assets/spark_logo_dark.png')}
        style={stylesSplash.launchImage}
        resizeMode="contain"
      />
      <View style={stylesSplash.loaderContainer}>
        <ActivityIndicator size="small" color="#FFD700" />
      </View>
    </View>
  );
};

const stylesSplash = {
  container: {
    flex: 1,
    backgroundColor: '#131311',
    justifyContent: 'center',
    alignItems: 'center',
  },
  launchImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  loaderContainer: {
    position: 'absolute',
    bottom: 100,
  },
};


function Main() {
  const [splashLang, setSplashLang] = React.useState('tr');
  // Initialize DB and seed data on first run
  useEffect(() => {
    const startup = async () => {
      let savedLang = 'tr';
      try {
        const stored = await AsyncStorage.getItem('lang');
        if (stored) {
          savedLang = stored;
          setSplashLang(stored);
        }
      } catch (e) {}
      // Analytics: init as early as possible, then tag every event with lang.
      initAnalytics();
      setAnalyticsContext({ lang: savedLang });
      await initDb();
      await seedData();
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

      let savedPreferences = null;
      try {
        const storedPreferences = await AsyncStorage.getItem('@kivilcim_preferences');
        savedPreferences = storedPreferences ? JSON.parse(storedPreferences) : null;
      } catch (e) {}

      await scheduleDailyNotifications({
        lang: savedLang,
        reminderWindow: savedPreferences?.reminderWindow,
        reminderHour: savedPreferences?.reminderHour,
        dailyStoryTarget: savedPreferences?.time?.dailyStoryTarget || 2,
      });
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

  const { grantPromotionalPremium } = require('./src/context/UserDataContext').useUserData();

  useEffect(() => {
    const handleDeepLink = async (event) => {
      if (!event.url) return;
      const { path } = require('expo-linking').parse(event.url);
      if (path && path.startsWith('invite/')) {
        const inviterId = path.split('/')[1];
        if (inviterId) {
           const alreadyClaimed = await AsyncStorage.getItem('@kivilcim_invite_claimed');
           if (!alreadyClaimed) {
             await grantPromotionalPremium(7);
             await AsyncStorage.setItem('@kivilcim_invite_claimed', 'true');
             trackEvent('invite_link_claimed', { inviterId });
             // Optionally show an alert or toast here
           }
        }
      }
    };

    require('expo-linking').getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    const subscription = require('expo-linking').addEventListener('url', handleDeepLink);
    return () => {
      subscription.remove();
    };
  }, [grantPromotionalPremium]);

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
    // Splash design while fonts load
    return <SplashDesign lang={splashLang} />;
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
            <Main />
          </StoriesProvider>
        </UserDataProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

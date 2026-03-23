import React, { useCallback, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { View, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { t } from './src/locales/i18n';
import { setupNotificationHandler, scheduleDailyNotifications } from './src/utils/notifications';

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

// Splash designer component (in-app splash screen)
const SplashDesign = ({ lang = 'tr' }) => {
  return (
    <View style={stylesSplash.container}>
      <LinearGradient colors={["#131311", "#1E1C18"]} style={stylesSplash.gradient} />
      <View style={stylesSplash.brandRow}>
        <Text style={stylesSplash.brandText}>{t('brandText', lang).replace(' ✦', '')}</Text>
      </View>
      <Text style={stylesSplash.tag}>{t('launch_tagline', lang)}</Text>
      <ActivityIndicator size="large" color="#FFB783" style={stylesSplash.spinner} />
    </View>
  );
};

const stylesSplash = {
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  brandRow: {
    marginTop: -40,
    alignItems: 'center',
  },
  brandText: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 40,
    color: 'white',
  },
  tag: {
    marginTop: 8,
    fontFamily: 'Inter_400Regular',
    color: 'white',
    fontSize: 14,
  },
  spinner: {
    marginTop: 24,
  },
};

function Main() {
  const [splashLang, setSplashLang] = React.useState('tr');
  // Initialize DB and seed data on first run
  useEffect(() => {
    const startup = async () => {
      try {
        const savedLang = await AsyncStorage.getItem('lang');
        if (savedLang) setSplashLang(savedLang);
      } catch (e) {}
      await initDb();
      await seedData();
      await scheduleDailyNotifications(savedLang || 'tr');
    };
    startup().catch(e => console.error('App.js startup error:', e));
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

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    // Splash design while fonts load
    return <SplashDesign lang={splashLang} />;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
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

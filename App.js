import React, { useCallback, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { View, Text, Image, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
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
const SplashDesign = () => {
  return (
    <View style={stylesSplash.container}>
      <Image 
        source={require('./assets/spark_launch.png')} 
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
      await initDb();
      await seedData();
      await scheduleDailyNotifications(savedLang);
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

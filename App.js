import React, { useCallback } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { View, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

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

// Tema ve Data
import { ThemeProvider } from './src/context/ThemeContext';
import { UserDataProvider } from './src/context/UserDataContext';

// Splash screen'i dondur
SplashScreen.preventAutoHideAsync();

// Splash designer component (in-app splash screen)
const SplashDesign = () => {
  return (
    <View style={stylesSplash.container}>
      <LinearGradient colors={["#4c669f", "#3b5998", "#192f6a"]} style={stylesSplash.gradient} />
      <View style={stylesSplash.brandRow}>
        <Text style={stylesSplash.brandText}>Kıvılcım</Text>
      </View>
      <Text style={stylesSplash.tag}>Daily sparks of wisdom</Text>
      <ActivityIndicator size="large" color="white" style={stylesSplash.spinner} />
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
    fontFamily: 'DMSans_400Regular',
    color: 'white',
    fontSize: 14,
  },
  spinner: {
    marginTop: 24,
  },
};

function Main() {
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
    PlayfairDisplay_400Regular_Italic,
    DMSans_400Regular,
    DMSans_500Medium,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    // Splash design while fonts load
    return <SplashDesign />;
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
          <Main />
        </UserDataProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

import React, { useEffect, useRef } from 'react';
import { Platform, Modal, View, Text, Pressable, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../context/ThemeContext';
import { useUserData } from '../context/UserDataContext';
import { t } from '../locales/i18n';

import OnboardingScreen from '../screens/OnboardingScreen';
import HomeScreen from '../screens/HomeScreen';
import StoryDetailScreen from '../screens/StoryDetailScreen';
import PaywallScreen from '../screens/PaywallScreen';
import ProgressScreen from '../screens/ProgressScreen';
import LibraryScreen from '../screens/LibraryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SearchScreen from '../screens/SearchScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const CONFETTI_COLORS = ['#FFD166', '#FF6B6B', '#06D6A0', '#4D96FF', '#F4A261', '#B8E1FF'];
const BADGE_SOUND_ASSET = require('../../assets/sounds/badge.wav');

function MainTabs() {
  const { colors, typography, layout, isDark, lang } = useTheme();
  const insets = useSafeAreaInsets();
  const androidBottomInset = Platform.OS === 'android' ? Math.max(insets.bottom, 18) : insets.bottom;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? '#131311' : '#fcf9f4',
          borderTopWidth: layout.borderWidth,
          borderTopColor: isDark ? '#4A3F33' : '#e0c0b2',
          height: 62 + androidBottomInset,
          paddingBottom: androidBottomInset,
          paddingTop: 10,
          marginBottom: Platform.OS === 'android' ? 6 : 0,
        },
        tabBarActiveTintColor: '#823b18',
        tabBarInactiveTintColor: isDark ? '#A89A84' : '#594238',
        tabBarLabelStyle: {
          fontFamily: 'Inter_600SemiBold',
          fontSize: 12,
          textTransform: 'capitalize',
          letterSpacing: 0.5,
        },
      }}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen} 
        options={{ 
          tabBarLabel: t('tabHome', lang), 
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons name={focused ? 'compass' : 'compass-outline'} size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="LibraryTab" 
        component={LibraryScreen} 
        options={{ 
          tabBarLabel: t('tabLibrary', lang), 
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons name={focused ? 'book' : 'book-outline'} size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="ProgressTab" 
        component={ProgressScreen} 
        options={{ 
          tabBarLabel: t('tabProgress', lang), 
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons name={focused ? 'trending-up' : 'trending-up-outline'} size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen} 
        options={{ 
          tabBarLabel: t('tabProfile', lang), 
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={26} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

import LaunchScreen from '../screens/LaunchScreen';

export default function AppNavigator() {
  const { isOnboarded, isLoadingUserData, activeBadgeModal, closeBadgeModal } = useUserData();
  const { colors, layout, lang } = useTheme();
  const modalAnim = useRef(new Animated.Value(0)).current;
  const iconAnim = useRef(new Animated.Value(0.7)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;
  const soundRef = useRef(null);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
      }
    };
  }, []);

  useEffect(() => {
    const triggerCelebrationFeedback = async () => {
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (error) {
        console.warn('Haptic feedback failed:', error);
      }

      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
        });

        if (soundRef.current) {
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }

        const { sound } = await Audio.Sound.createAsync(
          BADGE_SOUND_ASSET,
          { shouldPlay: true, volume: 0.35 }
        );

        soundRef.current = sound;
        sound.setOnPlaybackStatusUpdate((status) => {
          if (!status.isLoaded) return;
          if (status.didJustFinish) {
            sound.unloadAsync().catch(() => {});
            if (soundRef.current === sound) soundRef.current = null;
          }
        });
      } catch (error) {
        console.warn('Badge sound playback failed:', error);
      }
    };

    if (!activeBadgeModal) {
      modalAnim.setValue(0);
      iconAnim.setValue(0.7);
      confettiAnim.setValue(0);
      return;
    }

    triggerCelebrationFeedback();

    Animated.parallel([
      Animated.timing(modalAnim, {
        toValue: 1,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.spring(iconAnim, {
          toValue: 1.18,
          speed: 16,
          bounciness: 9,
          useNativeDriver: true,
        }),
        Animated.spring(iconAnim, {
          toValue: 1,
          speed: 14,
          bounciness: 6,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(confettiAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, [activeBadgeModal, modalAnim, iconAnim, confettiAnim]);

  const cardScale = modalAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.88, 1],
  });

  const cardOpacity = modalAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  if (isLoadingUserData) {
    return <LaunchScreen />; 
  }

  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: colors.background,
    },
  };

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    modalCard: {
      backgroundColor: colors.background,
      borderRadius: layout.radius.card,
      padding: 28,
      width: '100%',
      maxWidth: 340,
      alignItems: 'center',
      borderWidth: layout.borderWidth,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    confettiLayer: {
      ...StyleSheet.absoluteFillObject,
      pointerEvents: 'none',
    },
    confettiPiece: {
      position: 'absolute',
      top: 8,
      width: 8,
      height: 14,
      borderRadius: 2,
    },
    modalIconCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
      borderWidth: 2,
    },
    modalTitle: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: 22,
      color: colors.text,
      marginBottom: 4,
      textAlign: 'center',
    },
    modalSub: {
      fontFamily: 'Inter_400Regular',
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 16,
      textAlign: 'center',
    },
    modalDesc: {
      fontFamily: 'Inter_400Regular',
      fontSize: 14,
      color: colors.text,
      textAlign: 'center',
      lineHeight: 20,
      marginBottom: 16,
    },
    modalStatusBadge: {
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: 20,
      marginBottom: 20,
    },
    modalStatusText: {
      fontFamily: 'Inter_500Medium',
      fontSize: 12,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    modalCloseBtn: {
      paddingHorizontal: 32,
      paddingVertical: 10,
      borderRadius: layout.radius.card,
      borderWidth: 1,
      borderColor: colors.border,
    },
    modalCloseText: {
      fontFamily: 'Inter_500Medium',
      fontSize: 14,
      color: colors.text,
    },
  });

  return (
    <>
      <NavigationContainer theme={navTheme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!isOnboarded ? (
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          ) : (
            <>
              <Stack.Screen name="MainTabs" component={MainTabs} />
              <Stack.Screen name="StoryDetail" component={StoryDetailScreen} />
              <Stack.Screen name="Search" component={SearchScreen} />
              <Stack.Screen 
                name="Paywall" 
                component={PaywallScreen} 
                options={{ presentation: 'modal' }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>

      <Modal
        visible={!!activeBadgeModal}
        transparent
        animationType="fade"
        onRequestClose={closeBadgeModal}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closeBadgeModal} />
          {activeBadgeModal && (
            <Animated.View style={[styles.modalCard, { opacity: cardOpacity, transform: [{ scale: cardScale }] }]}> 
              <View style={styles.confettiLayer}>
                {[0, 1, 2, 3, 4, 5].map((i) => {
                  const startX = 26 + i * 44;
                  const drift = (i % 2 === 0 ? -1 : 1) * (10 + i * 2);
                  const translateY = confettiAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-18, 130 + i * 8],
                  });
                  const translateX = confettiAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, drift],
                  });
                  const rotate = confettiAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', i % 2 === 0 ? '-190deg' : '190deg'],
                  });
                  const opacity = confettiAnim.interpolate({
                    inputRange: [0, 0.7, 1],
                    outputRange: [0, 1, 0],
                  });

                  return (
                    <Animated.View
                      key={`confetti-${i}`}
                      style={[
                        styles.confettiPiece,
                        {
                          left: startX,
                          backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                          opacity,
                          transform: [{ translateY }, { translateX }, { rotate }],
                        },
                      ]}
                    />
                  );
                })}
              </View>

              <Animated.View
                style={[
                  styles.modalIconCircle,
                  {
                    backgroundColor: activeBadgeModal.earned ? colors.primary : colors.backgroundDark,
                    borderColor: activeBadgeModal.earned ? colors.primary : colors.border,
                    transform: [{ scale: iconAnim }],
                  },
                ]}
              >
                <Text style={{ fontSize: 36 }}>{activeBadgeModal.icon}</Text>
              </Animated.View>
              <Text style={styles.modalTitle}>{t(activeBadgeModal.titleKey, lang) || activeBadgeModal.titleKey}</Text>
              <Text style={styles.modalSub}>{t(activeBadgeModal.subKey, lang) || activeBadgeModal.subKey}</Text>
              <Text style={styles.modalDesc}>{t(activeBadgeModal.descKey, lang) || ''}</Text>
              <View
                style={[
                  styles.modalStatusBadge,
                  { backgroundColor: activeBadgeModal.earned ? '#2E7D3220' : colors.backgroundDark },
                ]}
              >
                <Text
                  style={[
                    styles.modalStatusText,
                    { color: activeBadgeModal.earned ? '#2E7D32' : colors.textSecondary },
                  ]}
                >
                  {activeBadgeModal.earned ? t('badgeModalEarned', lang) : t('badgeModalLocked', lang)}
                </Text>
              </View>
              <TouchableOpacity style={styles.modalCloseBtn} onPress={closeBadgeModal}>
                <Text style={styles.modalCloseText}>{t('badgeModalClose', lang)}</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </Modal>
    </>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import { Platform, Modal, View, Text, Pressable, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../context/ThemeContext';
import { useUserData } from '../context/UserDataContext';
import { useStories } from '../context/StoriesContext';
import { t } from '../locales/i18n';
import BadgeIcon, { BADGE_MAP } from '../components/BadgeIcon';
import BadgeShareSheet from '../components/BadgeShareSheet';

import OnboardingScreen from '../screens/OnboardingScreen';
import HomeScreen from '../screens/HomeScreen';
import StoryDetailScreen from '../screens/StoryDetailScreen';
import PaywallScreen from '../screens/PaywallScreen';
import ProgressScreen from '../screens/ProgressScreen';
import LibraryScreen from '../screens/LibraryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SearchScreen from '../screens/SearchScreen';
import UseInConversationScreen from '../screens/UseInConversationScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const CONFETTI_COLORS = ['#FFD166', '#FF6B6B', '#06D6A0', '#4D96FF', '#F4A261', '#B8E1FF'];
const BADGE_SOUND_ASSET = require('../../assets/sounds/badge.wav');

// Famous quote per badge — shown softly at the bottom of the badge modal and
// appended to the share text. { q: quote, a: author }
const BADGE_QUOTES = {
  first_read:     { q: 'Bin millik yolculuk tek bir adımla başlar.', a: 'Lao Tzu' },
  explorer:       { q: 'Gerçek keşif, yeni manzaralar aramak değil, yeni gözlere sahip olmaktır.', a: 'Marcel Proust' },
  sage:           { q: 'Tek bildiğim, hiçbir şey bilmediğimdir.', a: 'Sokrates' },
  bookworm:       { q: 'Okumak zihne, egzersizin bedene yaptığını yapar.', a: 'Joseph Addison' },
  streak_7:       { q: 'Biz tekrar tekrar yaptığımız şeyiz; mükemmellik bir eylem değil, alışkanlıktır.', a: 'Aristoteles' },
  cat_variety_3:  { q: 'Özel bir yeteneğim yok; sadece tutkuyla meraklıyım.', a: 'Albert Einstein' },
  cat_variety_5:  { q: 'Ne kadar çok okursan o kadar çok bilirsin; ne kadar öğrenirsen o kadar çok yere gidersin.', a: 'Dr. Seuss' },
  cat_variety_10: { q: 'Dünya bir kitaptır; seyahat etmeyenler yalnızca bir sayfasını okur.', a: 'Aziz Augustinus' },
  cat_master_5:   { q: 'Bir şeyi basitçe anlatamıyorsan, onu yeterince anlamamışsındır.', a: 'Albert Einstein' },
  cat_master_10:  { q: 'Mükemmellik küçük şeylerin toplamıdır, ama küçük bir şey değildir.', a: 'Michelangelo' },
  cat_master_25:  { q: 'Ne yaparsan yap, iyi yap.', a: 'Abraham Lincoln' },
  cat_master_50:  { q: 'Dehanın yüzde biri ilham, yüzde doksan dokuzu terdir.', a: 'Thomas Edison' },
  cat_master_100: { q: 'Başarı, küçük çabaların gün be gün tekrarıdır.', a: 'Robert Collier' },
  philosopher:    { q: 'Sorgulanmamış bir hayat yaşanmaya değmez.', a: 'Sokrates' },
  save_5:         { q: 'Kitaplığı olmayan ev, ruhu olmayan bedene benzer.', a: 'Cicero' },
  save_10:        { q: 'Kitaplar, en sessiz ve en sadık dostlardır.', a: 'Charles W. Eliot' },
  save_50:        { q: 'Bir kütüphaneniz ve bir bahçeniz varsa, her şeyiniz var demektir.', a: 'Cicero' },
  save_100:       { q: 'İyi bir kitap, ruhun damıtılmış özüdür.', a: 'Thomas Carlyle' },
  share_1:        { q: 'Bir mum, başka bir mumu yakmakla ışığından bir şey yitirmez.', a: 'Atasözü' },
  share_10:       { q: 'Bilgi, paylaştıkça çoğalan tek hazinedir.', a: 'Atasözü' },
  share_20:       { q: 'Başkalarını aydınlatan, kendi yolunu da aydınlatır.', a: 'Atasözü' },
  share_30:       { q: 'İyi bir fikir, anlatıldıkça büyür.', a: 'Atasözü' },
  share_50:       { q: 'Paylaşılmayan bilgi, yakılmamış bir mum gibidir.', a: 'Atasözü' },
  storyteller:    { q: 'İnsanlar gerçekleri unutur ama iyi bir hikâyeyi asla.', a: 'Atasözü' },
  icebreaker:     { q: 'Her büyük dostluk basit bir merhaba ile başlar.', a: 'Atasözü' },
};

// Animated tab icon with a soft "pill" highlight behind the active tab.
// Subtle by design: the pill fades + scales in using a low-opacity tint of the
// primary gold, so the active tab reads clearly without dominating the bar.
function TabBarIcon({ focused, color, name, badge }) {
  const { colors, isDark } = useTheme();
  const anim = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: focused ? 1 : 0,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [focused, anim]);

  const pillScale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] });

  return (
    <View style={{ width: 58, height: 32, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          width: 58,
          height: 32,
          borderRadius: 16,
          backgroundColor: isDark ? `${colors.primary}26` : `${colors.primary}22`,
          opacity: anim,
          transform: [{ scale: pillScale }],
        }}
      />
      <Ionicons name={name} size={23} color={color} />
      {badge}
    </View>
  );
}

function MainTabs() {
  const { colors, typography, layout, isDark, lang } = useTheme();
  const { unseenEarnedBadgeCount } = useUserData();
  const insets = useSafeAreaInsets();
  const androidBottomInset = Platform.OS === 'android' ? Math.max(insets.bottom, 12) : insets.bottom;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? 'rgba(20,20,22,0.92)' : '#FBF7F0',
          borderTopWidth: isDark ? StyleSheet.hairlineWidth : layout.borderWidth,
          borderTopColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
          height: 84 + androidBottomInset,
          paddingBottom: androidBottomInset + 6,
          paddingTop: 8,
          marginBottom: Platform.OS === 'android' ? 4 : 0,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: isDark ? '#9A9AA2' : '#8A7E6B',
        tabBarLabelStyle: {
          fontFamily: 'Inter_500Medium',
          fontSize: 11.5,
          textTransform: 'none',
          letterSpacing: 0.2,
          marginTop: 5,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen} 
        options={{ 
          tabBarLabel: t('tabHome', lang),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon focused={focused} color={color} name="compass" />
          ),
        }}
      />
      <Tab.Screen 
        name="LibraryTab" 
        component={LibraryScreen} 
        options={{ 
          tabBarLabel: t('tabLibrary', lang),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon focused={focused} color={color} name="library" />
          ),
        }}
      />
      <Tab.Screen 
        name="ProgressTab" 
        component={ProgressScreen} 
        options={{ 
          tabBarLabel: t('tabProgress', lang),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              focused={focused}
              color={color}
              name="stats-chart"
              badge={unseenEarnedBadgeCount > 0 ? (
                <View style={{
                  position: 'absolute', top: 4, right: 14,
                  width: 9, height: 9, borderRadius: 5,
                  backgroundColor: colors.primary,
                  borderWidth: 1.5, borderColor: isDark ? 'rgba(20,20,22,0.88)' : '#FBF7F0',
                }} />
              ) : null}
            />
          ),
        }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen} 
        options={{ 
          tabBarLabel: t('tabProfile', lang),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon focused={focused} color={color} name="person" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

import LaunchScreen from '../screens/LaunchScreen';

export default function AppNavigator() {
  const { isOnboarded, isPremium, isLoadingUserData, userDataErrorMsg, retryUserDataLoad, activeBadgeModal, closeBadgeModal, userProfile } = useUserData();
  const { errorMsg, refreshStories } = useStories();
  const { colors, layout, lang, isDark } = useTheme();
  const [isNavigationReady, setIsNavigationReady] = useState(false);
  const navigationRef = useRef(null);
  const modalAnim = useRef(new Animated.Value(0)).current;
  const iconAnim = useRef(new Animated.Value(0.7)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;
  const soundRef = useRef(null);
  const [shareSheetBadge, setShareSheetBadge] = useState(null);

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
    return (
      <LaunchScreen
        status="user"
        errorMessage={userDataErrorMsg || errorMsg}
        onRetry={() => {
          retryUserDataLoad?.();
          refreshStories?.();
        }}
      />
    ); 
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
    modalBadgeIcon: {
      width: 80, height: 80, borderRadius: 40,
      alignItems: 'center', justifyContent: 'center',
    },
    modalQuoteWrap: {
      marginTop: 18, paddingTop: 16, width: '100%',
      borderTopWidth: layout.borderWidth, borderTopColor: colors.border,
      alignItems: 'center',
    },
    modalQuoteText: {
      fontFamily: 'PlayfairDisplay_400Regular_Italic',
      fontSize: 14, lineHeight: 21, color: colors.text,
      textAlign: 'center',
    },
    modalQuoteAuthor: {
      fontFamily: 'Inter_500Medium', fontSize: 12,
      color: colors.textSecondary, marginTop: 6,
    },
    modalBtnRow: {
      flexDirection: 'row', alignItems: 'center', gap: 10,
      alignSelf: 'stretch',
    },
    modalShareBtn: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
      paddingHorizontal: 20, paddingVertical: 12, borderRadius: layout.radius.card,
      backgroundColor: colors.primary,
    },
    modalShareText: {
      fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.onPrimary,
    },
    modalCloseBtn: {
      paddingHorizontal: 32,
      paddingVertical: 12,
      borderRadius: layout.radius.card,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
    },
    modalCloseText: {
      fontFamily: 'Inter_500Medium',
      fontSize: 14,
      color: colors.text,
    },
  });

  const modalMeta = activeBadgeModal
    ? (BADGE_MAP[activeBadgeModal.id] || { icon: 'trophy', colors: ['#C89B3C', '#8C701B'] })
    : null;
  const modalQuote = activeBadgeModal ? BADGE_QUOTES[activeBadgeModal.id] : null;


  return (
    <>
      <NavigationContainer
        ref={navigationRef}
        theme={navTheme}
        onReady={() => setIsNavigationReady(true)}
      >
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!isOnboarded ? (
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          ) : (
            <>
              <Stack.Screen name="MainTabs" component={MainTabs} />
              <Stack.Screen name="StoryDetail" component={StoryDetailScreen} />
              <Stack.Screen name="UseInConversation" component={UseInConversationScreen} />
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

              <Animated.View style={[{ marginBottom: 16 }, { transform: [{ scale: iconAnim }] }]}>
                <View style={[
                  styles.modalBadgeIcon,
                  { backgroundColor: activeBadgeModal.earned ? `${modalMeta.colors[0]}1F` : colors.backgroundDark },
                ]}>
                  <Ionicons
                    name={activeBadgeModal.earned ? modalMeta.icon : 'lock-closed'}
                    size={38}
                    color={activeBadgeModal.earned ? modalMeta.colors[0] : colors.textSecondary}
                  />
                </View>
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

              {modalQuote && (
                <View style={styles.modalQuoteWrap}>
                  <Text style={styles.modalQuoteText}>{`“${modalQuote.q}”`}</Text>
                  <Text style={styles.modalQuoteAuthor}>{`— ${modalQuote.a}`}</Text>
                </View>
              )}

              {activeBadgeModal.earned ? (
                <View style={[styles.modalBtnRow, { marginTop: 20 }]}>
                  <TouchableOpacity
                    style={[styles.modalShareBtn, { flex: 1 }]}
                    onPress={() => {
                      const b = activeBadgeModal;
                      closeBadgeModal();
                      setTimeout(() => setShareSheetBadge(b), 320);
                    }}
                    accessibilityRole="button"
                  >
                    <Ionicons name="share-social-outline" size={16} color={colors.onPrimary} />
                    <Text style={styles.modalShareText}>{lang === 'tr' ? 'Paylaş' : 'Share'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.modalCloseBtn, { flex: 1 }]} onPress={closeBadgeModal}>
                    <Text style={styles.modalCloseText}>{t('badgeModalClose', lang)}</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={[styles.modalCloseBtn, { alignSelf: 'stretch', marginTop: 20 }]} onPress={closeBadgeModal}>
                  <Text style={styles.modalCloseText}>{t('badgeModalClose', lang)}</Text>
                </TouchableOpacity>
              )}
            </Animated.View>
          )}
        </View>
      </Modal>

      <BadgeShareSheet
        visible={!!shareSheetBadge}
        badge={shareSheetBadge}
        name={userProfile?.displayName}
        quote={shareSheetBadge ? BADGE_QUOTES[shareSheetBadge.id] : null}
        onClose={() => setShareSheetBadge(null)}
      />
    </>
  );
}

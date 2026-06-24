import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  StatusBar, Animated, Platform, Dimensions, Image, TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useUserData } from '../context/UserDataContext';
import { useStories } from '../context/StoriesContext';
import { t } from '../locales/i18n';
import { getCategoryImage } from '../utils/categoryImages';
import { ensureNotificationPermission } from '../utils/notifications';

const PROFILE_INFO_PROMPT_SEEN_KEY = '@kivilcim_profile_info_prompt_seen';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Category names arrive from the DB with a leading emoji (e.g. "💰 Finance").
// Split it so we can render a single icon slot + a clean, non-truncating label.
const splitLeadingEmoji = (label = '') => {
  const cps = Array.from(String(label).trim());
  let i = 0;
  while (i < cps.length) {
    const cp = cps[i].codePointAt(0);
    if (cps[i] === ' ' || cp >= 0x2000) { i++; continue; } // emoji/symbols/VS/ZWJ + spaces
    break;
  }
  return {
    emoji: cps.slice(0, i).join('').trim(),
    text: cps.slice(i).join('').trim() || String(label).trim(),
  };
};

const OnboardingScreen = ({ navigation }) => {
  const { colors, typography, layout, isDark, lang } = useTheme();
  const { isPremium, saveOnboarding, updateUserProfile } = useUserData();
  const { stories, storiesLoading, categories, parentCategories, errorMsg } = useStories();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [selectedCats, setSelectedCats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(1);
  const [selectedReminders, setSelectedReminders] = useState(['evening']);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const breatheAnim = useRef(new Animated.Value(1.0)).current;

  // Logo breathe animation on welcome screen
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, { toValue: 1.04, duration: 1300, useNativeDriver: true }),
        Animated.timing(breatheAnim, { toValue: 1.0, duration: 1300, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const allCats = parentCategories.map((p) => Number(p.id));
  const timeOptions = [
    { label: t('time_3min', lang), sub: t('time_3min_sub', lang), iconName: 'cafe-outline', icon: '\u2615', minutes: 3, dailyStoryTarget: 1 },
    { label: t('time_6min', lang), sub: t('time_6min_sub', lang), iconName: 'book-outline', icon: '\uD83D\uDCDA', minutes: 6, dailyStoryTarget: 2 },
    { label: t('time_9min', lang), sub: t('time_9min_sub', lang), iconName: 'rocket-outline', icon: '\uD83D\uDE80', minutes: 9, dailyStoryTarget: 3 },
  ];
  const reminderOptions = [
    { label: t('reminder_morning', lang), sub: t('reminder_morning_sub', lang), iconName: 'sunny-outline', icon: '\uD83C\uDF05', reminderWindow: 'morning', reminderHour: 8 },
    { label: t('reminder_noon', lang), sub: t('reminder_noon_sub', lang), iconName: 'partly-sunny-outline', icon: '\u2600\uFE0F', reminderWindow: 'noon', reminderHour: 13 },
    { label: t('reminder_evening', lang), sub: t('reminder_evening_sub', lang), iconName: 'moon-outline', icon: '\uD83C\uDF19', reminderWindow: 'evening', reminderHour: 21 },
  ];
  const selectedTimeOption = timeOptions[selectedTime];
  const storyWord = t(selectedTimeOption.dailyStoryTarget === 1 ? 'onboarding_story' : 'onboarding_stories', lang);
  const readyPlanSummary = t('onboarding_ready_plan', lang)
    .replace('{{minutes}}', selectedTimeOption.label)
    .replace('{{stories}}', `${selectedTimeOption.dailyStoryTarget} ${storyWord}`);

  // Step 0: Welcome, 1: How it works, 2: Categories, 3: Time, 4: Reminders, 5: Name, 6: Summary
  const TOTAL_STEPS = 7;
  const isPhone = SCREEN_WIDTH < 768;
  const isSmallPhone = SCREEN_WIDTH < 390;
  const catGridGap = isPhone ? 8 : 10;
  const catTileWidth = (SCREEN_WIDTH - 64 - catGridGap) / 2;

  const animateStep = (direction, cb) => {
    const outOffset = direction === 'forward' ? -30 : 30;
    const inOffset = direction === 'forward' ? 30 : -30;
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: outOffset, duration: 180, useNativeDriver: true }),
    ]).start(() => {
      cb();
      slideAnim.setValue(inOffset);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start();
    });
  };

  const next = async () => {
    Haptics.selectionAsync().catch(() => {});
    // Reminder step (4): prime the OS notification permission in-context, right after
    // the user has chosen when to be nudged — higher opt-in than a cold prompt at the end.
    if (step === 4) {
      ensureNotificationPermission().catch(() => {});
    }
    if (step < TOTAL_STEPS - 1) {
      animateStep('forward', () => setStep(s => s + 1));
    } else {
      await handleFinish();
    }
  };

  const goBack = () => {
    if (step === 0) return;
    Haptics.selectionAsync().catch(() => {});
    animateStep('back', () => setStep(s => s - 1));
  };

  const goToStep = (targetStep) => {
    if (targetStep >= step) return;
    Haptics.selectionAsync().catch(() => {});
    animateStep('back', () => setStep(targetStep));
  };

  const skip = async () => {
    await saveOnboarding([], timeOptions[1], reminderOptions[2]);
    await AsyncStorage.setItem(PROFILE_INFO_PROMPT_SEEN_KEY, 'true').catch(() => {});
  };

  const toggleCat = (cat) => {
    Haptics.selectionAsync().catch(() => {});
    setSelectedCats(prev => {
      if (prev.includes(cat)) return prev.filter(c => c !== cat);
      return [...prev, cat];
    });
  };

  const toggleReminder = (windowValue) => {
    Haptics.selectionAsync().catch(() => {});
    setSelectedReminders(prev => {
      if (prev.includes(windowValue)) {
        if (prev.length === 1) return prev;
        return prev.filter(w => w !== windowValue);
      }
      return [...prev, windowValue];
    });
  };

  const handleFinish = async () => {
    const name = userName.trim();
    const email = userEmail.trim();
    if (name || email) {
      await updateUserProfile({
        ...(name ? { displayName: name } : {}),
        ...(email ? { email } : {}),
      });
    }
    await saveOnboarding(selectedCats, timeOptions[selectedTime], selectedReminders);
    await AsyncStorage.setItem(PROFILE_INFO_PROMPT_SEEN_KEY, 'true').catch(() => {});
  };

  /* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ STYLES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  const cardBg = isDark
    ? (colors.surfaceContainerHigh || colors.backgroundDark)
    : (colors.cardBackground || '#FFFDF9');

  // CTA contrast & elevation differ per mode.
  // Light: onPrimary (#FFFFFF) over gold (#C89B3C) fails WCAG AA, so use dark text token.
  // Shadow: a gold "glow" reads well on dark, but on light a soft neutral shadow is cleaner.
  const ctaTextColor = isDark ? colors.onPrimary : colors.text;
  const ctaShadowColor = isDark ? colors.primary : colors.text;
  const ctaShadowOpacity = isDark ? 0.25 : 0.12;
  // Gold-as-text fails WCAG AA on light surfaces (#C89B3C → 2.31:1). Use a deeper
  // bronze-gold for small accent text in light mode; gold stays for fills/borders/icons.
  const primaryText = isDark ? colors.primary : '#7A5E1C';

  const s = StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.background,
    },

    /* â”€â”€ Reading progress bar (top 2px line) â”€â”€ */
    readingProgress: {
      position: 'absolute',
      top: 0,
      left: 0,
      height: 2,
      backgroundColor: colors.primary,
      zIndex: 60,
    },

    /* â”€â”€ Header â”€â”€ */
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 24,
      height: 56,
    },
    headerLogoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    headerLogoImg: {
      width: isSmallPhone ? 28 : 32,
      height: isSmallPhone ? 28 : 32,
    },
    headerBrand: {
      fontFamily: 'PlayfairDisplay_400Regular_Italic',
      fontSize: 22,
      color: colors.primary,
      letterSpacing: -0.5,
    },
    headerAction: {
      fontFamily: 'Inter_500Medium',
      fontSize: 14,
      color: colors.textSecondary,
    },

    /* â”€â”€ Content area â”€â”€ */
    contentScroll: {
      flexGrow: 1,
      paddingHorizontal: 32,
      justifyContent: 'center',
    },

    /* â”€â”€ Step 0: Welcome hero â”€â”€ */
    heroContainer: {
      width: '100%',
      aspectRatio: 1,
      marginBottom: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroOuterRing: {
      position: 'absolute',
      width: '92%',
      height: '92%',
      borderRadius: 999,
      borderWidth: 1,
      borderColor: `${colors.primary}14`,
    },
    heroInnerRing: {
      position: 'absolute',
      width: '76%',
      height: '76%',
      borderRadius: 999,
      borderWidth: 1,
      borderColor: `${colors.primary}22`,
    },
    heroGlowBlob: {
      position: 'absolute',
      width: '52%',
      height: '52%',
      borderRadius: 999,
      backgroundColor: colors.primary,
      opacity: 0.07,
    },
    heroLogoWrapper: {
      width: '44%',
      aspectRatio: 1,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.18,
      shadowRadius: 20,
      elevation: 4,
    },
    heroLogoImg: {
      width: '100%',
      height: '100%',
    },
    welcomeTitle: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: 36,
      color: colors.text,
      textAlign: 'center',
      lineHeight: 44,
      letterSpacing: -0.5,
      marginBottom: 20,
    },
    welcomeSubtitle: {
      fontFamily: 'Inter_400Regular',
      fontSize: 17,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 26,
      maxWidth: 320,
      alignSelf: 'center',
    },

    /* â”€â”€ Section titles (steps 1+) â”€â”€ */
    sectionTitle: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: 30,
      color: colors.text,
      lineHeight: 38,
      marginBottom: 8,
      letterSpacing: -0.3,
    },
    sectionSubtitle: {
      fontFamily: 'Inter_400Regular',
      fontSize: 16,
      color: colors.textSecondary,
      lineHeight: 24,
      marginBottom: 28,
    },

    /* â”€â”€ Step 1: How it works cards â”€â”€ */
    hiwCard: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 18,
      borderRadius: 16,
      backgroundColor: cardBg,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 10,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 8,
      elevation: 1,
    },
    hiwIconBox: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: `${colors.primary}12`,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
      flexShrink: 0,
    },
    hiwIcon: {
      width: 24,
      textAlign: 'center',
    },
    hiwCardTitle: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 14,
      color: colors.text,
      marginBottom: 2,
    },
    hiwCardSub: {
      fontFamily: 'Inter_400Regular',
      fontSize: 12,
      color: colors.textSecondary,
      lineHeight: 18,
    },

    /* â”€â”€ Step 2: Category Selection â”€â”€ */
    catGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: catGridGap,
      marginBottom: 16,
    },
    catTile: {
      width: catTileWidth,
      minHeight: isSmallPhone ? 56 : 60,
      paddingVertical: isSmallPhone ? 12 : isPhone ? 14 : 16,
      paddingHorizontal: isSmallPhone ? 10 : isPhone ? 12 : 16,
      borderRadius: 16,
      backgroundColor: cardBg,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    catTileSelected: {
      backgroundColor: `${colors.primary}1F`,
      borderColor: colors.primary,
    },
    catTileText: {
      fontFamily: 'Inter_400Regular',
      fontSize: isSmallPhone ? 12 : isPhone ? 13 : 14,
      color: colors.text,
      lineHeight: isSmallPhone ? 16 : 18,
    },
    catTileTextSelected: {
      fontFamily: 'Inter_500Medium',
      color: primaryText,
    },
    catCheckCircle: {
      width: isSmallPhone ? 20 : 22,
      height: isSmallPhone ? 20 : 22,
      borderRadius: isSmallPhone ? 10 : 11,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    catCheckSlot: {
      width: isSmallPhone ? 20 : 22,
      height: isSmallPhone ? 20 : 22,
      marginLeft: isSmallPhone ? 6 : 8,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    catHint: {
      fontFamily: 'Inter_400Regular',
      fontSize: 13,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 8,
    },

    /* â”€â”€ Steps 3 & 4: Time / Reminder tiles â”€â”€ */
    timeTile: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 18,
      paddingHorizontal: 18,
      borderRadius: 16,
      backgroundColor: cardBg,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 10,
    },
    timeTileSelected: {
      backgroundColor: `${colors.primary}1F`,
      borderColor: colors.primary,
    },
    timeTileIcon: {
      marginRight: 16,
      width: 28,
      textAlign: 'center',
    },
    timeTileName: {
      fontFamily: 'Inter_500Medium',
      fontSize: 15,
      color: colors.text,
    },
    timeTileSub: {
      fontFamily: 'Inter_400Regular',
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    timeRadio: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    timeRadioSelected: {
      borderColor: colors.primary,
    },
    timeRadioInner: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.primary,
    },

    /* â”€â”€ Step 5: Name â”€â”€ */
    nameInput: {
      backgroundColor: colors.surfaceContainerHigh || cardBg,
      borderRadius: 16,
      paddingVertical: 16,
      paddingHorizontal: 18,
      fontFamily: 'Inter_400Regular',
      fontSize: 16,
      color: colors.text,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    nameInputFocused: {
      borderColor: colors.primary,
    },
    emailNote: {
      fontFamily: 'Inter_400Regular',
      fontSize: 12,
      color: colors.textSecondary,
      lineHeight: 17,
      marginTop: 2,
      marginBottom: 4,
      paddingHorizontal: 4,
    },
    nameSkipHint: {
      fontFamily: 'Inter_400Regular',
      fontSize: 13,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 8,
    },

    /* â”€â”€ Step 6: Summary â”€â”€ */
    readyArt: {
      backgroundColor: cardBg,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      paddingVertical: 16,
      paddingHorizontal: 20,
      marginBottom: 12,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.04,
      shadowRadius: 16,
      elevation: 1,
    },
    readyArtHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    editLink: {
      fontFamily: 'Inter_500Medium',
      fontSize: 12,
      color: primaryText,
      letterSpacing: 0.2,
    },
    selCats: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      justifyContent: 'center',
      marginTop: 8,
    },
    selCatPill: {
      backgroundColor: `${colors.primary}12`,
      borderRadius: 20,
      paddingHorizontal: 14,
      paddingVertical: 6,
    },

    /* â”€â”€ Footer â”€â”€ */
    footer: {
      paddingHorizontal: 32,
      paddingBottom: Math.max(insets.bottom + 16, Platform.OS === 'android' ? 32 : 24),
      paddingTop: 16,
      alignItems: 'center',
      gap: 20,
    },

    /* â”€â”€ Step Dots â”€â”€ */
    stepDots: {
      flexDirection: 'row',
      gap: 8,
      alignItems: 'center',
    },
    stepDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.border,
    },
    stepDotActive: {
      width: 32,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.primary,
    },
    stepDotCompleted: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: `${colors.primary}55`,
    },

    /* â”€â”€ Primary Button â”€â”€ */
    btnPrimary: {
      width: '100%',
      height: 60,
      borderRadius: 999,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 8,
      shadowColor: ctaShadowColor,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: ctaShadowOpacity,
      shadowRadius: 24,
      elevation: 4,
    },
    btnPrimaryText: {
      fontFamily: 'Inter_500Medium',
      fontSize: 17,
      color: ctaTextColor,
      letterSpacing: 0.3,
    },
    btnPrimaryArrow: {
      fontSize: 18,
      color: ctaTextColor,
    },
    btnDisabled: {
      opacity: 0.45,
    },
  });

  /* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ STEP CONTENT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  const steps = [
    /* â”€â”€ Step 0: Welcome â”€â”€ */
    <View style={{ flex: 1, justifyContent: 'center' }} key="s0">
      <Animated.View style={[s.heroContainer, { transform: [{ scale: breatheAnim }] }]}>
        <View style={s.heroOuterRing} />
        <View style={s.heroInnerRing} />
        <View style={s.heroGlowBlob} />
        <View style={s.heroLogoWrapper}>
          <Image
            source={isDark
              ? require('../../assets/spark_logo_dark.png')
              : require('../../assets/spark_logo.png')}
            style={s.heroLogoImg}
            resizeMode="contain"
          />
        </View>
      </Animated.View>
      <Text style={s.welcomeTitle}>{t('onboarding_welcome', lang)}</Text>
      <Text style={s.welcomeSubtitle}>{t('onboarding_welcome_sub', lang)}</Text>
    </View>,

    /* â”€â”€ Step 1: How it works â”€â”€ */
    <View style={{ flex: 1, justifyContent: 'center' }} key="s1">
      <Text style={s.sectionTitle} numberOfLines={2} adjustsFontSizeToFit>
        {t('onboarding_how_it_works', lang)}
      </Text>
      <Text style={s.sectionSubtitle}>{t('onboarding_how_it_works_sub', lang)}</Text>
      <View style={s.hiwCard}>
        <View style={s.hiwIconBox}><Ionicons name="book-outline" size={22} color={colors.primary} style={s.hiwIcon} /></View>
        <View style={{ flex: 1 }}>
          <Text style={s.hiwCardTitle}>{t('onboarding_hiw_stories_title', lang)}</Text>
          <Text style={s.hiwCardSub}>{t('onboarding_hiw_stories_sub', lang)}</Text>
        </View>
      </View>
      <View style={s.hiwCard}>
        <View style={s.hiwIconBox}><Ionicons name="flame-outline" size={22} color={colors.primary} style={s.hiwIcon} /></View>
        <View style={{ flex: 1 }}>
          <Text style={s.hiwCardTitle}>{t('onboarding_hiw_spark_title', lang)}</Text>
          <Text style={s.hiwCardSub}>{t('onboarding_hiw_spark_sub', lang)}</Text>
        </View>
      </View>
      <View style={s.hiwCard}>
        <View style={s.hiwIconBox}><Ionicons name="notifications-outline" size={22} color={colors.primary} style={s.hiwIcon} /></View>
        <View style={{ flex: 1 }}>
          <Text style={s.hiwCardTitle}>{t('onboarding_hiw_reminder_title', lang)}</Text>
          <Text style={s.hiwCardSub}>{t('onboarding_hiw_reminder_sub', lang)}</Text>
        </View>
      </View>
    </View>,

    /* â”€â”€ Step 2: Category Selection â”€â”€ */
    <View style={{ flex: 1, justifyContent: 'center' }} key="s2">
      <Text style={s.sectionTitle} numberOfLines={2} adjustsFontSizeToFit>
        {t('onboarding_why', lang)}
      </Text>
      <Text style={s.sectionSubtitle}>{t('onboarding_why_sub', lang)}</Text>
      <View style={s.catGrid}>
        {allCats.map(cat => {
          const category = parentCategories.find((p) => Number(p.id) === Number(cat));
          const categoryRawName = category?.raw_name || '';
          const { emoji: catEmoji, text: catLabel } = splitLeadingEmoji(category?.name || '');
          const imgSource = getCategoryImage(categoryRawName, isDark).source;
          const iconTileSize = isSmallPhone ? 28 : 32;
          const sel = selectedCats.includes(cat);
          return (
            <TouchableOpacity
              key={cat}
              style={[s.catTile, sel && s.catTileSelected]}
              onPress={() => toggleCat(cat)}
              activeOpacity={0.7}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: isSmallPhone ? 6 : 8, flex: 1 }}>
                {(imgSource || catEmoji) ? (
                  <View style={{
                    width: iconTileSize,
                    height: iconTileSize,
                    borderRadius: 8,
                    backgroundColor: sel ? `${colors.primary}16` : `${colors.primary}08`,
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}>
                    {imgSource ? (
                      <Image
                        source={imgSource}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode="cover"
                      />
                    ) : (
                      <Text style={{ fontSize: isSmallPhone ? 15 : 17 }}>{catEmoji}</Text>
                    )}
                  </View>
                ) : null}
                <Text
                  style={[s.catTileText, sel && s.catTileTextSelected, { flex: 1 }]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.75}
                >
                  {catLabel}
                </Text>
              </View>
              <View style={s.catCheckSlot}>
                {sel && (
                  <View style={s.catCheckCircle}>
                    <Ionicons name="checkmark" size={isSmallPhone ? 12 : 14} color={colors.onPrimary} />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
      <Text style={s.catHint}>
        {selectedCats.length >= 2
          ? `${selectedCats.length} ${t('onboarding_cat_selected', lang)}`
          : t('onboarding_cat_more', lang).replace('{{count}}', 2 - selectedCats.length)}
      </Text>
    </View>,

    /* â”€â”€ Step 3: Time Selection â”€â”€ */
    <View style={{ flex: 1, justifyContent: 'center' }} key="s3">
      <Text style={s.sectionTitle} numberOfLines={2} adjustsFontSizeToFit>
        {t('onboarding_how_long', lang)}
      </Text>
      <Text style={s.sectionSubtitle}>{t('onboarding_how_long_sub', lang)}</Text>
      {timeOptions.map((option, i) => (
        <TouchableOpacity
          key={i}
          style={[s.timeTile, selectedTime === i && s.timeTileSelected]}
          onPress={() => { Haptics.selectionAsync().catch(() => {}); setSelectedTime(i); }}
          activeOpacity={0.7}
        >
          <Ionicons name={option.iconName} size={24} color={selectedTime === i ? colors.primary : colors.textSecondary} style={s.timeTileIcon} />
          <View style={{ flex: 1 }}>
            <Text style={s.timeTileName}>{option.label}</Text>
            <Text style={s.timeTileSub}>{option.sub}</Text>
          </View>
          <View style={[s.timeRadio, selectedTime === i && s.timeRadioSelected]}>
            {selectedTime === i && <View style={s.timeRadioInner} />}
          </View>
        </TouchableOpacity>
      ))}
    </View>,

    /* â”€â”€ Step 4: Reminder Selection â”€â”€ */
    <View style={{ flex: 1, justifyContent: 'center' }} key="s4">
      <Text style={s.sectionTitle} numberOfLines={2} adjustsFontSizeToFit>
        {t('onboarding_when_remind', lang)}
      </Text>
      <Text style={s.sectionSubtitle}>{t('onboarding_when_remind_sub', lang)}</Text>
      {reminderOptions.map((option, i) => {
        const isSelected = selectedReminders.includes(option.reminderWindow);
        return (
          <TouchableOpacity
            key={i}
            style={[s.timeTile, isSelected && s.timeTileSelected]}
            onPress={() => toggleReminder(option.reminderWindow)}
            activeOpacity={0.7}
          >
            <Ionicons name={option.iconName} size={24} color={isSelected ? colors.primary : colors.textSecondary} style={s.timeTileIcon} />
            <View style={{ flex: 1 }}>
              <Text style={s.timeTileName}>{option.label}</Text>
              <Text style={s.timeTileSub}>{option.sub}</Text>
            </View>
            <View style={[s.timeRadio, isSelected && s.timeRadioSelected]}>
              {isSelected && <View style={s.timeRadioInner} />}
            </View>
          </TouchableOpacity>
        );
      })}
      <Text style={s.catHint}>{t('onboarding_reminder_permission_note', lang)}</Text>
    </View>,

    /* â”€â”€ Step 5: Name (optional) â”€â”€ */
    <View style={{ flex: 1, justifyContent: 'center' }} key="s5">
      <Text style={s.sectionTitle} numberOfLines={2} adjustsFontSizeToFit>
        {t('onboarding_name_title', lang)}
      </Text>
      <Text style={s.sectionSubtitle}>{t('onboarding_name_sub', lang)}</Text>
      <TextInput
        style={[s.nameInput, focusedField === 'name' && s.nameInputFocused]}
        placeholder={t('onboarding_name_placeholder', lang)}
        placeholderTextColor={colors.mutedText || colors.textSecondary}
        value={userName}
        onChangeText={setUserName}
        onFocus={() => setFocusedField('name')}
        onBlur={() => setFocusedField(null)}
        autoCapitalize="words"
        autoCorrect={false}
        returnKeyType="next"
      />
      <TextInput
        style={[s.nameInput, focusedField === 'email' && s.nameInputFocused]}
        placeholder={t('onboarding_email_placeholder', lang)}
        placeholderTextColor={colors.mutedText || colors.textSecondary}
        value={userEmail}
        onChangeText={setUserEmail}
        onFocus={() => setFocusedField('email')}
        onBlur={() => setFocusedField(null)}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        returnKeyType="done"
      />
      <Text style={s.emailNote}>{t('onboarding_email_note', lang)}</Text>
      <Text style={s.nameSkipHint}>{t('onboarding_name_skip_hint', lang)}</Text>
    </View>,

    /* â”€â”€ Step 6: Summary / Ready â”€â”€ */
    <View style={{ flex: 1, justifyContent: 'center' }} key="s6">
      <Text style={[s.sectionTitle, { textAlign: 'center', marginBottom: 6 }]}>
        {userName.trim()
          ? t('onboarding_ready_greeting', lang).replace('{{name}}', userName.trim())
          : t('onboarding_ready', lang)}
      </Text>
      <Text style={[s.sectionSubtitle, { textAlign: 'center', marginBottom: 24 }]}>
        {readyPlanSummary}
      </Text>

      {/* Selected categories */}
      <View style={s.readyArt}>
        <View style={s.readyArtHeaderRow}>
          <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 11, color: colors.textSecondary, letterSpacing: 1, textTransform: 'uppercase' }}>
            {t('onboarding_cat', lang)} ({(selectedCats.length || 2)})
          </Text>
          <TouchableOpacity onPress={() => goToStep(2)} activeOpacity={0.6} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={s.editLink}>{t('onboarding_edit', lang)}</Text>
          </TouchableOpacity>
        </View>
        <View style={s.selCats}>
          {(selectedCats.length ? selectedCats : allCats.slice(0, 2)).map(c => (
            <View key={c} style={s.selCatPill}>
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: primaryText }}>
                {(parentCategories.find((p) => Number(p.id) === Number(c))?.name) || ''}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Reading plan + reminder */}
      <View style={s.readyArt}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>
              {t('readingPlan', lang)}
            </Text>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.text }}>
              {selectedTimeOption.label} - {selectedTimeOption.dailyStoryTarget} {t(selectedTimeOption.dailyStoryTarget === 1 ? 'onboarding_story' : 'onboarding_stories', lang)}
            </Text>
            <TouchableOpacity onPress={() => goToStep(3)} activeOpacity={0.6} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} style={{ marginTop: 6 }}>
              <Text style={s.editLink}>{t('onboarding_edit', lang)}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, paddingLeft: 12 }}>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>
              {t('reminderTime', lang)}
            </Text>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.text }}>
              {reminderOptions.filter(o => selectedReminders.includes(o.reminderWindow)).map(o => o.label).join(', ')}
            </Text>
            <TouchableOpacity onPress={() => goToStep(4)} activeOpacity={0.6} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} style={{ marginTop: 6 }}>
              <Text style={s.editLink}>{t('onboarding_edit', lang)}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>,
  ];

  const canNext = step === 2 ? selectedCats.length >= 2 : true;

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={s.safe}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* â”€â”€ Reading Progress Bar â”€â”€ */}
      <View style={[s.readingProgress, { width: `${((step + 1) / TOTAL_STEPS) * 100}%` }]} />

      {/* â”€â”€ Header â”€â”€ */}
      <View style={s.header}>
        {/* Left: logo + brand name */}
        <View style={s.headerLogoRow}>
          <Image
            source={isDark
              ? require('../../assets/spark_logo_dark.png')
              : require('../../assets/spark_shortcut_logo.png')}
            style={s.headerLogoImg}
            resizeMode="contain"
          />
          <Text style={s.headerBrand}>Spark</Text>
        </View>

        {/* Right: Skip (steps 0 & 5) or Back chevron (other steps) */}
        {(step === 0 || step === 5) ? (
          <TouchableOpacity onPress={step === 0 ? skip : next} activeOpacity={0.7}>
            <Text style={s.headerAction}>{t('onboarding_skip', lang)}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={goBack} activeOpacity={0.7} style={{ padding: 4 }}>
            <Ionicons name="chevron-back" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* â”€â”€ Animated Content â”€â”€ */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <ScrollView
            contentContainerStyle={s.contentScroll}
            showsVerticalScrollIndicator={false}
            bounces={false}
            keyboardShouldPersistTaps="handled"
          >
            {steps[step]}
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>

      {/* â”€â”€ Footer â”€â”€ */}
      <View style={s.footer}>
        {/* Step Dots â€” tap completed dots to navigate back */}
        <View style={s.stepDots}>
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
            if (i === step) return <View key={i} style={s.stepDotActive} />;
            if (i < step) {
              return (
                <TouchableOpacity key={i} onPress={() => goToStep(i)} activeOpacity={0.6}>
                  <View style={s.stepDotCompleted} />
                </TouchableOpacity>
              );
            }
            return <View key={i} style={s.stepDot} />;
          })}
        </View>

        {/* Primary CTA Button */}
        <TouchableOpacity
          style={[s.btnPrimary, !canNext && s.btnDisabled]}
          onPress={canNext ? next : null}
          activeOpacity={0.85}
        >
          <Text style={s.btnPrimaryText}>
            {step < TOTAL_STEPS - 1
              ? t('next', lang)
              : t('onboarding_start_journey', lang)}
          </Text>
          <Ionicons name="arrow-forward" size={18} color={ctaTextColor} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;

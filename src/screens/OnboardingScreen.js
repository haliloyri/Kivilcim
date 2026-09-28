import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  StatusBar, Animated, Platform, Dimensions, Image,
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
import { ensureNotificationPermission, registerAndSavePushToken } from '../utils/notifications';
import { getCachedDeviceUserId } from '../services/supabase';
import { ANALYTICS_EVENTS, trackEvent } from '../utils/analytics';
import useReducedMotion from '../hooks/useReducedMotion';

const PROFILE_INFO_PROMPT_SEEN_KEY = '@kivilcim_profile_info_prompt_seen';
// Read and cleared once by AppNavigator, after the reader finishes their first
// story (not when the main stack mounts).
export const PENDING_ONBOARDING_PAYWALL_KEY = '@albor_pending_onboarding_paywall';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// Readable names in the funnel, so a step index change doesn't silently
// reinterpret historical events.
const STEP_NAMES = ['welcome', 'categories', 'plan'];

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
  const { saveOnboarding } = useUserData();
  const { stories, storiesLoading, categories, parentCategories, errorMsg } = useStories();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const [selectedCats, setSelectedCats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(1);
  const [selectedReminders, setSelectedReminders] = useState(['evening']);
  // Set when the reader taps a CTA that can't advance yet, so the requirement
  // hint can answer the tap instead of the screen looking broken.
  const [hintAlert, setHintAlert] = useState(false);
  const hintTimerRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const breatheAnim = useRef(new Animated.Value(1.0)).current;

  // Logo breathe animation, welcome step only: it used to keep looping behind
  // every other step, and ignored the system "reduce motion" preference.
  useEffect(() => {
    if (reduceMotion || step !== 0) {
      breatheAnim.setValue(1);
      return undefined;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, { toValue: 1.04, duration: 1300, useNativeDriver: true }),
        Animated.timing(breatheAnim, { toValue: 1.0, duration: 1300, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [reduceMotion, step, breatheAnim]);

  // Step-level funnel + the hint timer's cleanup.
  useEffect(() => {
    trackEvent(ANALYTICS_EVENTS.ONBOARDING_STEP_VIEWED, {
      step,
      stepName: STEP_NAMES[step] || String(step),
      lang,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  useEffect(() => () => clearTimeout(hintTimerRef.current), []);

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
  // Step 0: Welcome + one real story, 1: Categories, 2: Daily plan (time budget
  // + reminder window).
  //
  // Down from 8. The separate "how it works" step described what the welcome
  // card now simply shows; the name was never needed to read anything (Profile
  // still takes it); and the summary only restated two choices the reader had
  // made one screen earlier. Ten screens before the first story is a funnel, not
  // a setup.
  const TOTAL_STEPS = 3;
  const isPhone = SCREEN_WIDTH < 768;
  const isSmallPhone = SCREEN_WIDTH < 390;
  const catGridGap = isPhone ? 8 : 10;
  const catTileWidth = (SCREEN_WIDTH - 64 - catGridGap) / 2;

  const animateStep = (direction, cb) => {
    if (reduceMotion) {
      cb();
      return;
    }
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
    if (step < TOTAL_STEPS - 1) {
      animateStep('forward', () => setStep(s => s + 1));
      return;
    }
    // The last step is the plan step, so this tap is the in-context moment for
    // the OS notification prompt: the reader has just said when to nudge them.
    // Awaited, so saveOnboarding below schedules the reminders with permission
    // already decided instead of racing it. Skipped entirely when every window
    // is off — there is nothing to deliver, so there is nothing to ask for.
    if (selectedReminders.length) {
      const granted = await ensureNotificationPermission().catch(() => false);
      trackEvent(ANALYTICS_EVENTS.NOTIFICATION_PERMISSION_RESULT, {
        granted,
        source: 'onboarding_plan_step',
        lang,
      });
      if (granted) {
        // Startup only registers a device that already had permission, so the
        // token has to be claimed here — otherwise this install gets no
        // server-side push until the next cold start.
        registerAndSavePushToken(getCachedDeviceUserId()).catch(() => {});
      }
    }
    await handleFinish();
  };

  const goBack = () => {
    if (step === 0) return;
    Haptics.selectionAsync().catch(() => {});
    animateStep('back', () => setStep(s => s - 1));
  };

  const skip = async () => {
    trackEvent(ANALYTICS_EVENTS.ONBOARDING_SKIPPED, {
      step,
      stepName: STEP_NAMES[step] || String(step),
      lang,
    });
    // Deliberately does NOT arm the trial paywall: a user who skipped has seen
    // no value yet, and a paywall without context reads as an ambush.
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
    // Deselecting the last window used to be silently ignored, which left no way
    // to say "don't remind me" — the reader had to accept a reminder to finish
    // setup. An empty selection is a valid answer; saveOnboarding turns reminders
    // off for it.
    setSelectedReminders(prev => (
      prev.includes(windowValue)
        ? prev.filter(w => w !== windowValue)
        : [...prev, windowValue]
    ));
  };

  const handleFinish = async () => {
    // Arm the trial offer before completing onboarding.
    //
    // It can't be pushed from here: `saveOnboarding` flips `isOnboarded`, which
    // swaps the navigator's screen set and unmounts this component. AppNavigator
    // picks the flag up once the reader has finished their first story.
    await AsyncStorage.setItem(PENDING_ONBOARDING_PAYWALL_KEY, 'true').catch(() => {});
    await saveOnboarding(selectedCats, timeOptions[selectedTime], selectedReminders);
    trackEvent(ANALYTICS_EVENTS.ONBOARDING_COMPLETED, {
      categoryCount: selectedCats.length,
      minutes: timeOptions[selectedTime]?.minutes,
      dailyStoryTarget: timeOptions[selectedTime]?.dailyStoryTarget,
      reminderWindows: selectedReminders,
      lang,
    });
    // Setup no longer asks for a name, so mark the profile prompt seen: Home
    // must not open a name modal over the reader's first session. Profile still
    // takes it whenever they want.
    await AsyncStorage.setItem(PROFILE_INFO_PROMPT_SEEN_KEY, 'true').catch(() => {});
  };

  /* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ STYLES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  const cardBg = isDark
    ? (colors.surfaceContainerHigh || colors.backgroundDark)
    : (colors.cardBackground || '#FFFDF9');

  // CTA contrast & elevation: primary is now Albor Navy (#142A4A), dark enough in
  // both modes that white onPrimary text clears WCAG AA — no per-mode override needed.
  const ctaTextColor = colors.onPrimary;
  const ctaShadowColor = colors.primary;
  const ctaShadowOpacity = isDark ? 0.25 : 0.12;
  // Navy has plenty of contrast as small accent text on light surfaces too, unlike
  // the old gold (#C89B3C → 2.31:1), so no bronze fallback is needed anymore.
  const primaryText = colors.primary;

  const s = StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.background,
    },

    /* -- Progress: one segment per step -- */
    progressRow: {
      flexDirection: 'row',
      gap: 6,
      paddingHorizontal: 32,
      paddingTop: 10,
    },
    progressSegment: {
      flex: 1,
      height: 3,
      borderRadius: 2,
      backgroundColor: colors.border,
    },
    progressSegmentDone: {
      backgroundColor: colors.primary,
    },

    /* â”€â”€ Header â”€â”€ */
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 24,
      height: 56,
    },
    headerSide: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    headerBackBtn: {
      padding: 4,
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
      color: colors.primaryText,
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
      // Smaller than the old full-width mark: the welcome step now also carries
      // a real story card, which must not fall below the fold behind it.
      width: isSmallPhone ? '52%' : '58%',
      alignSelf: 'center',
      aspectRatio: 1,
      marginBottom: 24,
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
      fontSize: 32,
      color: colors.text,
      textAlign: 'center',
      lineHeight: 40,
      letterSpacing: -0.5,
      marginBottom: 14,
    },
    welcomeSubtitle: {
      fontFamily: 'Inter_400Regular',
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
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

    /* -- Step 0: the welcome step's story card -- */
    firstValueCard: {
      padding: 20,
      borderRadius: 16,
      backgroundColor: cardBg,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 8,
      elevation: 1,
    },
    firstValueCategory: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 12,
      color: colors.primaryText,
      textTransform: 'uppercase',
      letterSpacing: 0.4,
      marginBottom: 8,
    },
    firstValueTitle: {
      fontFamily: 'PlayfairDisplay_600SemiBold',
      fontSize: 19,
      color: colors.text,
      lineHeight: 26,
      marginBottom: 10,
    },
    firstValuePunchline: {
      fontFamily: 'Inter_400Regular',
      fontSize: 15,
      color: colors.textSecondary,
      lineHeight: 22,
    },

    /* -- Step 1: Category selection -- */
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
    catHintAlert: {
      fontFamily: 'Inter_500Medium',
      color: colors.primary,
    },

    /* -- Step 2: Plan tiles (time budget + reminder window) -- */
    timeTile: {
      flexDirection: 'row',
      alignItems: 'center',
      // Tighter than before: the time budget and the reminder window are six
      // tiles on one screen now, not three on each of two.
      paddingVertical: 14,
      paddingHorizontal: 18,
      borderRadius: 16,
      backgroundColor: cardBg,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 8,
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
    // Square + tick for the reminder rows: they are multi-select and now share a
    // screen with the single-select time rows, so they must not look identical.
    timeCheck: {
      width: 22,
      height: 22,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    timeCheckSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primary,
    },

    groupLabel: {
      fontFamily: 'Inter_500Medium',
      fontSize: 11,
      color: colors.textSecondary,
      letterSpacing: 1,
      textTransform: 'uppercase',
      marginBottom: 10,
    },

    /* â”€â”€ Footer â”€â”€ */
    footer: {
      paddingHorizontal: 32,
      paddingBottom: Math.max(insets.bottom + 16, Platform.OS === 'android' ? 32 : 24),
      paddingTop: 16,
      alignItems: 'center',
      gap: 20,
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

  // First-value moment, now on the welcome step (0): one real story, punchline
  // first — value before we ask for anything. It can't be personalized there
  // (nothing is picked yet), and depending on `stories` alone also keeps the
  // card from reshuffling every time the reader steps back to the welcome.
  const firstValueStory = React.useMemo(() => {
    if (!Array.isArray(stories) || !stories.length) return null;
    // A punchline the DB filled in from the Turkish fallback is worse than no
    // punchline: 163 of 318 have no es/de copy yet, and this card is the first
    // real content a new reader sees. `!== false` keeps the Supabase path (which
    // has no such flag) working.
    const hasPunchline = (st) => !!st.conversation_punchline && st.conversation_punchline_localized !== false;
    const withPunchline = stories.filter(hasPunchline);
    const pool = withPunchline.length ? withPunchline : stories;
    return pool[Math.floor(Math.random() * pool.length)] || null;
  }, [stories]);

  // The fallback pool above can still hand back a story whose punchline only
  // exists in Turkish; fall through to the localized hook/description then.
  const firstValueText = firstValueStory
    ? ((firstValueStory.conversation_punchline_localized !== false && firstValueStory.conversation_punchline)
      || firstValueStory.hook
      || firstValueStory.description
      || '')
    : '';

  useEffect(() => {
    if (step !== 0 || !firstValueStory) return;
    trackEvent(ANALYTICS_EVENTS.ONBOARDING_FIRST_STORY_SHOWN, {
      storyId: firstValueStory.story_id,
      lang,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, firstValueStory?.story_id]);

  /* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ STEP CONTENT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  const steps = [
    /* -- Step 0: Welcome + one real story as proof of value -- */
    <View style={{ flex: 1, justifyContent: 'center' }} key="step0">
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
      {/* This card is what the separate "how it works" step used to claim in
          words: a real story, in the reader's language, before we ask for
          anything. */}
      {firstValueStory ? (
        <View style={[s.firstValueCard, { marginTop: 28 }]}>
          <Text style={s.firstValueCategory} numberOfLines={1}>
            {t('onboarding_first_value_title', lang)}
          </Text>
          <Text style={s.firstValueTitle} numberOfLines={2}>{firstValueStory.title}</Text>
          <Text style={s.firstValuePunchline} numberOfLines={4}>{firstValueText}</Text>
        </View>
      ) : null}
    </View>,

    /* -- Step 1: Category selection (min. 2) -- */
    <View style={{ flex: 1, justifyContent: 'center' }} key="step1">
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
              accessibilityRole="checkbox"
              accessibilityState={{ checked: sel }}
              accessibilityLabel={catLabel}
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
                  minimumFontScale={0.85}
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
      <Text style={[s.catHint, hintAlert && s.catHintAlert]}>
        {selectedCats.length >= 2
          ? `${selectedCats.length} ${t('onboarding_cat_selected', lang)}`
          : t('onboarding_cat_more', lang).replace('{{count}}', 2 - selectedCats.length)}
      </Text>
    </View>,

    /* -- Step 2: Daily plan - time budget and reminder window on one screen.
       Two taps that used to be two screens; neither needs a screen of its own,
       and the summary step that restated them is gone. -- */
    <View style={{ flex: 1, justifyContent: 'center' }} key="step2">
      <Text style={s.sectionTitle} numberOfLines={2} adjustsFontSizeToFit>
        {t('onboarding_plan_title', lang)}
      </Text>
      <Text style={[s.sectionSubtitle, { marginBottom: 18 }]}>{t('onboarding_how_long_sub', lang)}</Text>

      <Text style={s.groupLabel}>{t('readingPlan', lang)}</Text>
      {timeOptions.map((option, i) => (
        <TouchableOpacity
          key={i}
          style={[s.timeTile, selectedTime === i && s.timeTileSelected]}
          onPress={() => { Haptics.selectionAsync().catch(() => {}); setSelectedTime(i); }}
          activeOpacity={0.7}
          accessibilityRole="radio"
          accessibilityState={{ checked: selectedTime === i }}
          accessibilityLabel={`${option.label} — ${option.sub}`}
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

      <Text style={[s.groupLabel, { marginTop: 18 }]}>{t('reminderTime', lang)}</Text>
      {reminderOptions.map((option, i) => {
        const isSelected = selectedReminders.includes(option.reminderWindow);
        return (
          <TouchableOpacity
            key={i}
            style={[s.timeTile, isSelected && s.timeTileSelected]}
            onPress={() => toggleReminder(option.reminderWindow)}
            activeOpacity={0.7}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: isSelected }}
            accessibilityLabel={`${option.label} — ${option.sub}`}
          >
            <Ionicons name={option.iconName} size={24} color={isSelected ? colors.primary : colors.textSecondary} style={s.timeTileIcon} />
            <View style={{ flex: 1 }}>
              <Text style={s.timeTileName}>{option.label}</Text>
              <Text style={s.timeTileSub}>{option.sub}</Text>
            </View>
            <View style={[s.timeCheck, isSelected && s.timeCheckSelected]}>
              {isSelected && <Ionicons name="checkmark" size={14} color={colors.onPrimary} />}
            </View>
          </TouchableOpacity>
        );
      })}
      <Text style={s.catHint}>
        {selectedReminders.length
          ? t('onboarding_reminder_permission_note', lang)
          : t('profileRemindersDisabledSub', lang)}
      </Text>
    </View>,
  ];

  const canNext = step === 1 ? selectedCats.length >= 2 : true;

  // A CTA that does nothing on press reads as a broken screen, so an unmet
  // requirement gets a warning tap and pushes the hint below the grid.
  const onPrimaryPress = () => {
    if (canNext) {
      next();
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
    setHintAlert(true);
    clearTimeout(hintTimerRef.current);
    hintTimerRef.current = setTimeout(() => setHintAlert(false), 1800);
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={s.safe}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* One segment per step. The footer dots are gone: two progress
          indicators for three steps was one indicator too many. */}
      <View
        style={s.progressRow}
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 1, max: TOTAL_STEPS, now: step + 1 }}
      >
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <View key={i} style={[s.progressSegment, i <= step && s.progressSegmentDone]} />
        ))}
      </View>

      {/* Header: Back always on the left (platform convention), Skip always on
          the right — they used to swap sides between steps. */}
      <View style={s.header}>
        <View style={s.headerSide}>
          {step > 0 ? (
            <>
              <TouchableOpacity
                onPress={goBack}
                activeOpacity={0.7}
                style={s.headerBackBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityRole="button"
                accessibilityLabel={t('back', lang)}
              >
                <Ionicons name="chevron-back" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
              {/* Only after the welcome step: there the hero already carries the
                  mark, and showing it twice on one screen just read as clutter. */}
              <View style={s.headerLogoRow}>
                <Image
                  source={isDark
                    ? require('../../assets/spark_logo_dark.png')
                    : require('../../assets/spark_logo.png')}
                  style={s.headerLogoImg}
                  resizeMode="contain"
                />
                <Text style={s.headerBrand}>Albor</Text>
              </View>
            </>
          ) : null}
        </View>

        {step === 0 ? (
          <TouchableOpacity
            onPress={skip}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
          >
            <Text style={s.headerAction}>{t('onboarding_skip', lang)}</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* â”€â”€ Animated Content â”€â”€ */}
      <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <ScrollView
          contentContainerStyle={s.contentScroll}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {steps[step]}
        </ScrollView>
      </Animated.View>

      {/* â”€â”€ Footer â”€â”€ */}
      <View style={s.footer}>
        <TouchableOpacity
          style={[s.btnPrimary, !canNext && s.btnDisabled]}
          onPress={onPrimaryPress}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityState={{ disabled: !canNext }}
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

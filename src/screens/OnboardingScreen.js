import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  StatusBar, Animated, Platform, Image, TextInput, useWindowDimensions,
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
import { getStoryByLang } from '../db/db';
import { SUPPORTED_LANGS } from '../utils/locale';

const PROFILE_INFO_PROMPT_SEEN_KEY = '@kivilcim_profile_info_prompt_seen';
// Read and cleared once by AppNavigator, after the reader finishes their first
// story (not when the main stack mounts).
export const PENDING_ONBOARDING_PAYWALL_KEY = '@albor_pending_onboarding_paywall';

// Readable names in the funnel, so a step index change doesn't silently
// reinterpret historical events.
const STEP_NAMES = ['welcome', 'categories', 'plan'];
const LANGUAGE_OPTIONS = [
  { code: 'tr', label: 'Türkçe' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'de', label: 'Deutsch' },
];

const OnboardingScreen = ({ navigation }) => {
  const { colors, typography, layout, isDark, lang, setLang } = useTheme();
  const { saveOnboarding, updateUserProfile, userProfile } = useUserData();
  const { stories, storiesLoading, categories, parentCategories, errorMsg, contentLang } = useStories();
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const [selectedCats, setSelectedCats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(1);
  const [selectedReminders, setSelectedReminders] = useState(['evening']);
  const [name, setName] = useState(userProfile?.displayName || '');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [languageChangePending, setLanguageChangePending] = useState(false);
  const [storyVariants, setStoryVariants] = useState({});
  const [storyVariantsLoading, setStoryVariantsLoading] = useState(false);
  // Set when the reader taps a CTA that can't advance yet, so the requirement
  // hint can answer the tap instead of the screen looking broken.
  const [hintAlert, setHintAlert] = useState(false);
  const hintTimerRef = useRef(null);
  const firstValueStoryIdRef = useRef(null);
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

  useEffect(() => {
    if (!name && userProfile?.displayName) setName(userProfile.displayName);
  }, [name, userProfile?.displayName]);

  useEffect(() => {
    if (contentLang === lang) setLanguageChangePending(false);
  }, [contentLang, lang]);

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
  const isPhone = screenWidth < 768;
  const isSmallPhone = screenWidth < 390;
  const isCompactPhone = isSmallPhone || screenHeight < 740;
  const catGridGap = isPhone ? 8 : 10;
  const catTileWidth = (screenWidth - (isCompactPhone ? 40 : 64) - catGridGap) / 2;

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
    // A language change causes StoriesContext to reload categories and the
    // following setup screen. Keep the transition behind that reload so the
    // reader never sees the previous language's category labels.
    if (step === 0 && (languageChangePending || storiesLoading || (contentLang && contentLang !== lang))) {
      setHintAlert(true);
      clearTimeout(hintTimerRef.current);
      hintTimerRef.current = setTimeout(() => setHintAlert(false), 1800);
      return;
    }
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
    await updateUserProfile({ displayName: name.trim() || null });
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
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    languageButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingVertical: 7,
      paddingHorizontal: 9,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: cardBg,
    },
    languageButtonText: {
      fontFamily: 'Inter_500Medium',
      fontSize: 12,
      color: colors.text,
    },
    languageMenu: {
      position: 'absolute',
      top: 66,
      right: 24,
      zIndex: 30,
      minWidth: 150,
      paddingVertical: 6,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.modalSurface || cardBg,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 5,
    },
    languageMenuRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 11,
      paddingHorizontal: 14,
    },
    nameBlock: {
      marginTop: isCompactPhone ? 10 : 20,
      gap: isCompactPhone ? 4 : 7,
    },
    nameLabel: {
      fontFamily: 'Inter_500Medium',
      fontSize: isCompactPhone ? 12 : 13,
      color: colors.text,
    },
    nameHint: {
      fontFamily: 'Inter_400Regular',
      fontSize: isCompactPhone ? 10 : 12,
      color: colors.textSecondary,
    },
    nameInput: {
      minHeight: isCompactPhone ? 46 : 54,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: cardBg,
      color: colors.text,
      paddingHorizontal: isCompactPhone ? 13 : 16,
      paddingVertical: isCompactPhone ? 8 : 12,
      fontFamily: 'Inter_400Regular',
      fontSize: isCompactPhone ? 15 : 16,
    },

    /* â”€â”€ Content area â”€â”€ */
    contentScroll: {
      flexGrow: 1,
      paddingHorizontal: isCompactPhone ? 20 : 32,
      justifyContent: 'center',
    },
    welcomeStep: {
      flex: 1,
      justifyContent: 'flex-start',
      paddingTop: isCompactPhone ? 4 : 8,
    },

    /* â”€â”€ Step 0: Welcome hero â”€â”€ */
    heroContainer: {
      // The logo is a compact brand mark on the welcome step. The story card,
      // name field, and CTA are the content that must remain visible on small
      // phones, so the old full-width hero ring no longer owns the screen.
      width: isCompactPhone ? 68 : 78,
      height: isCompactPhone ? 68 : 78,
      alignSelf: 'center',
      marginBottom: isCompactPhone ? 10 : 14,
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
      fontSize: isCompactPhone ? 27 : 32,
      color: colors.text,
      textAlign: 'center',
      height: isCompactPhone ? 66 : 80,
      lineHeight: isCompactPhone ? 33 : 40,
      letterSpacing: -0.5,
      marginBottom: isCompactPhone ? 8 : 14,
    },
    welcomeSubtitle: {
      fontFamily: 'Inter_400Regular',
      fontSize: isCompactPhone ? 14 : 16,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: isCompactPhone ? 20 : 24,
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
      padding: isCompactPhone ? 13 : 20,
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
      fontSize: isCompactPhone ? 10 : 12,
      color: colors.primaryText,
      textTransform: 'uppercase',
      letterSpacing: 0.4,
      marginBottom: isCompactPhone ? 5 : 8,
    },
    firstValueTitle: {
      fontFamily: 'PlayfairDisplay_600SemiBold',
      fontSize: isCompactPhone ? 16 : 19,
      color: colors.text,
      lineHeight: isCompactPhone ? 21 : 26,
      marginBottom: isCompactPhone ? 6 : 10,
    },
    firstValuePunchline: {
      fontFamily: 'Inter_400Regular',
      fontSize: isCompactPhone ? 13 : 15,
      color: colors.textSecondary,
      lineHeight: isCompactPhone ? 18 : 22,
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
    // OH-only stories are intentionally Turkish-only in the data layer, so do
    // not choose one for a card that promises a four-language preview.
    const crossLanguageStories = stories.filter((story) => String(story.version) !== 'OH');
    const eligibleStories = crossLanguageStories.length ? crossLanguageStories : stories;
    const localizedPool = eligibleStories.filter(hasPunchline);
    const pool = localizedPool.length ? localizedPool : eligibleStories;
    const preferredId = firstValueStoryIdRef.current;
    const existing = preferredId && stories.find((story) => String(story.story_id) === String(preferredId));
    if (existing) return existing;
    const selected = pool[Math.floor(Math.random() * pool.length)] || null;
    firstValueStoryIdRef.current = selected?.story_id || null;
    return selected;
  }, [stories]);

  // The welcome card is deliberately independent from StoriesContext's active
  // language reload. We prepare the same story in every supported language once,
  // then render only the selected language's ready variant.
  useEffect(() => {
    const storyId = firstValueStory?.story_id;
    if (!storyId) return undefined;
    let active = true;
    setStoryVariantsLoading(true);
    Promise.all(SUPPORTED_LANGS.map(async (language) => {
      try {
        return [language, await getStoryByLang(storyId, language)];
      } catch (error) {
        return [language, null];
      }
    })).then((entries) => {
      if (!active) return;
      setStoryVariants(Object.fromEntries(entries));
    }).finally(() => {
      if (active) setStoryVariantsLoading(false);
    });
    return () => { active = false; };
  }, [firstValueStory?.story_id]);

  // The fallback pool above can still hand back a story whose punchline only
  // exists in Turkish; fall through to the localized hook/description then.
  const localizedFirstValueStory = storyVariants[lang];
  const hasLocalizedFirstValue = Boolean(
    localizedFirstValueStory?.title_localized
      && (localizedFirstValueStory?.conversation_punchline_localized
        || localizedFirstValueStory?.hook_localized
        || localizedFirstValueStory?.description_localized
        || localizedFirstValueStory?.body_localized)
  );
  const firstValueText = hasLocalizedFirstValue
    ? (localizedFirstValueStory.conversation_punchline
      || localizedFirstValueStory.hook
      || localizedFirstValueStory.description
      || localizedFirstValueStory.body
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
    <View style={s.welcomeStep} key="step0">
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
      <View style={s.nameBlock}>
        <Text style={s.nameLabel}>{t('onboarding_name_label', lang)}</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder={t('onboarding_name_placeholder', lang)}
          placeholderTextColor={colors.textSecondary}
          style={s.nameInput}
          maxLength={40}
          returnKeyType="done"
          accessibilityLabel={t('onboarding_name_label', lang)}
        />
        <Text style={s.nameHint}>{t('onboarding_name_hint', lang)}</Text>
      </View>
      <View style={[s.firstValueCard, { marginTop: isCompactPhone ? 12 : 28 }]}>
          <Text style={s.firstValueCategory} numberOfLines={1}>
            {t('onboarding_first_value_title', lang)}
          </Text>
          {firstValueStory && hasLocalizedFirstValue ? (
            <>
              <Text style={s.firstValueTitle} numberOfLines={2}>{localizedFirstValueStory.title}</Text>
              <Text style={s.firstValuePunchline} numberOfLines={isCompactPhone ? 3 : 4}>{firstValueText}</Text>
            </>
          ) : (
            <Text style={s.firstValuePunchline}>
              {!firstValueStory || storyVariantsLoading || storiesLoading
                ? t('onboarding_story_loading', lang)
                : t('onboarding_story_unavailable', lang)}
            </Text>
          )}
      </View>
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
          const imgSource = getCategoryImage(category?.raw_name || '', isDark).source;
          const imageSize = isSmallPhone ? 28 : 32;
          const catLabel = String(category?.name || '').replace(/^[^\p{L}\p{N}]+/u, '').trim();
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
                {imgSource ? (
                  <View style={{
                    width: imageSize,
                    height: imageSize,
                    borderRadius: 8,
                    backgroundColor: sel ? `${colors.primary}16` : `${colors.primary}08`,
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}>
                    <Image
                      source={imgSource}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode="cover"
                    />
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

  const contentReady = !(step === 0 && (languageChangePending || storiesLoading || (contentLang && contentLang !== lang)));
  const canNext = contentReady && (step === 1 ? selectedCats.length >= 2 : true);

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

      {/* Header: Back stays on the left; language selection stays on the right. */}
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

        <View style={s.headerRight}>
          <TouchableOpacity
            onPress={() => setShowLanguageMenu((visible) => !visible)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={t('languageLabel', lang)}
            style={s.languageButton}
          >
            <Ionicons name="globe-outline" size={15} color={colors.textSecondary} />
            <Text style={s.languageButtonText}>
              {LANGUAGE_OPTIONS.find((option) => option.code === lang)?.label || 'English'}
            </Text>
            <Ionicons name={showLanguageMenu ? 'chevron-up' : 'chevron-down'} size={13} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {showLanguageMenu ? (
        <View style={s.languageMenu}>
          {LANGUAGE_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.code}
              style={s.languageMenuRow}
              onPress={() => {
                if (option.code !== lang) setLanguageChangePending(true);
                setLang(option.code);
                setShowLanguageMenu(false);
              }}
              accessibilityRole="radio"
              accessibilityState={{ selected: lang === option.code }}
            >
              <Text style={[s.languageButtonText, lang === option.code && { color: colors.primaryText }]}>
                {option.label}
              </Text>
              {lang === option.code ? <Ionicons name="checkmark" size={18} color={colors.primaryText} /> : null}
            </TouchableOpacity>
          ))}
        </View>
      ) : null}

      {/* â”€â”€ Animated Content â”€â”€ */}
      <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <ScrollView
          contentContainerStyle={s.contentScroll}
          showsVerticalScrollIndicator={false}
          bounces={false}
          scrollEnabled={step !== 0}
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

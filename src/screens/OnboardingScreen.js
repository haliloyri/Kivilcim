import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  StatusBar, Animated, Platform, Dimensions, Image
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useUserData } from '../context/UserDataContext';
import { useStories } from '../context/StoriesContext';
import { t } from '../locales/i18n';
import { getCatIcon } from '../components/StoryCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const OnboardingScreen = ({ navigation }) => {
  const { colors, typography, layout, isDark, lang } = useTheme();
  const { isPremium, saveOnboarding } = useUserData();
  const { stories, storiesLoading, categories, parentCategories, errorMsg } = useStories();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [selectedCats, setSelectedCats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(1);
  const [selectedReminders, setSelectedReminders] = useState(['evening']);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const allCats = parentCategories.map(p => p.raw_name);
  const timeOptions = [
    { label: t('time_3min', lang), sub: t('time_3min_sub', lang), icon: '☕', minutes: 3, dailyStoryTarget: 1 },
    { label: t('time_6min', lang), sub: t('time_6min_sub', lang), icon: '📚', minutes: 6, dailyStoryTarget: 2 },
    { label: t('time_9min', lang), sub: t('time_9min_sub', lang), icon: '🚀', minutes: 9, dailyStoryTarget: 3 },
  ];
  const reminderOptions = [
    { label: t('reminder_morning', lang), sub: t('reminder_morning_sub', lang), icon: '🌅', reminderWindow: 'morning', reminderHour: 8 },
    { label: t('reminder_noon', lang), sub: t('reminder_noon_sub', lang), icon: '☀️', reminderWindow: 'noon', reminderHour: 13 },
    { label: t('reminder_evening', lang), sub: t('reminder_evening_sub', lang), icon: '🌙', reminderWindow: 'evening', reminderHour: 21 },
  ];
  const selectedTimeOption = timeOptions[selectedTime];
  const selectedReminderOption = reminderOptions.find(o => selectedReminders.includes(o.reminderWindow)) || reminderOptions[2];
  const readyPlanSummary = t('onboarding_ready_plan', lang)
    .replace('{{minutes}}', selectedTimeOption.label)
    .replace('{{stories}}', String(selectedTimeOption.dailyStoryTarget));

  const TOTAL_STEPS = 5;
  const isPhone = SCREEN_WIDTH < 768;
  const isSmallPhone = SCREEN_WIDTH < 390;
  const catGridGap = isPhone ? 8 : 10;
  const catTileWidth = (SCREEN_WIDTH - 64 - catGridGap) / 2;

  const next = async () => {
    // Animate out
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: -30, duration: 180, useNativeDriver: true }),
    ]).start(async () => {
      if (step < TOTAL_STEPS - 1) {
        setStep(step + 1);
      } else {
        await handleFinish();
        return;
      }
      // Animate in
      slideAnim.setValue(30);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start();
    });
  };

  const skip = async () => {
    await saveOnboarding([], timeOptions[1], reminderOptions[2]);
  };

  const toggleCat = (cat) => {
    setSelectedCats(prev => {
      if (prev.includes(cat)) return prev.filter(c => c !== cat);
      return [...prev, cat];
    });
  };

  const toggleReminder = (windowValue) => {
    setSelectedReminders(prev => {
      if (prev.includes(windowValue)) {
        if (prev.length === 1) return prev; // en az bir seçim zorunlu
        return prev.filter(w => w !== windowValue);
      }
      return [...prev, windowValue];
    });
  };

  const handleFinish = async () => {
    await saveOnboarding(selectedCats, timeOptions[selectedTime], selectedReminders);
  };

  /* ─────────────── STYLES ─────────────── */
  const s = StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.background,
    },

    /* ── Reading progress bar (top 2px line) ── */
    readingProgress: {
      position: 'absolute',
      top: 0,
      left: 0,
      height: 2,
      backgroundColor: colors.primary,
      zIndex: 60,
    },

    /* ── Header ── */
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 24,
      height: 56,
    },
    headerBrand: {
      fontFamily: 'PlayfairDisplay_400Regular_Italic',
      fontSize: 24,
      color: colors.primary,
      letterSpacing: -0.5,
    },
    headerSkip: {
      fontFamily: 'Inter_500Medium',
      fontSize: 14,
      color: colors.textSecondary,
    },

    /* ── Content area ── */
    contentScroll: {
      flexGrow: 1,
      paddingHorizontal: 32,
      justifyContent: 'center',
    },

    /* ── Step 0: Welcome ── */
    heroContainer: {
      width: '100%',
      aspectRatio: 1,
      marginBottom: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroGlow: {
      position: 'absolute',
      width: '90%',
      height: '90%',
      borderRadius: 999,
      backgroundColor: colors.primary,
      opacity: 0.06,
    },
    heroCard: {
      width: '100%',
      height: '100%',
      borderRadius: 20,
      backgroundColor: isDark ? colors.backgroundDark : '#ffffff',
      alignItems: 'center',
      justifyContent: 'center',
      // Ambient shadow – soft, natural gallery lighting
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.04,
      shadowRadius: 24,
      elevation: 3,
      overflow: 'hidden',
    },
    heroInnerGlow: {
      position: 'absolute',
      width: 200,
      height: 200,
      borderRadius: 100,
      backgroundColor: colors.primary,
      opacity: 0.08,
    },
    heroBookIcon: {
      fontSize: 80,
      color: colors.primary,
      marginBottom: 8,
    },
    heroSparkle: {
      position: 'absolute',
      top: -8,
      right: -8,
      fontSize: 36,
      color: '#cca730', // tertiary gold accent
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

    /* ── Step 1: Category Selection ── */
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
    catGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: catGridGap,
      marginBottom: 16,
    },
    catTile: {
      width: catTileWidth,
      paddingVertical: isSmallPhone ? 12 : isPhone ? 14 : 16,
      paddingHorizontal: isSmallPhone ? 10 : isPhone ? 12 : 16,
      borderRadius: 16,
      backgroundColor: colors.backgroundDark,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    catTileSelected: {
      backgroundColor: `${colors.primary}18`,
    },
    catTileText: {
      fontFamily: 'Inter_400Regular',
      fontSize: isSmallPhone ? 12 : isPhone ? 13 : 14,
      color: colors.text,
    },
    catTileTextSelected: {
      fontFamily: 'Inter_500Medium',
      color: colors.primary,
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

    /* ── Step 2: Time ── */
    timeTile: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 18,
      paddingHorizontal: 18,
      borderRadius: 16,
      backgroundColor: colors.backgroundDark,
      marginBottom: 10,
    },
    timeTileSelected: {
      backgroundColor: `${colors.primary}18`,
    },
    timeTileIcon: {
      fontSize: 24,
      marginRight: 16,
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

    /* ── Step 3: Ready ── */
    readyArt: {
      backgroundColor: colors.backgroundDark,
      borderRadius: 20,
      paddingVertical: 40,
      paddingHorizontal: 24,
      alignItems: 'center',
      marginBottom: 32,
      // Ambient shadow
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.04,
      shadowRadius: 24,
      elevation: 2,
    },
    readySparkIcon: {
      fontSize: 52,
      color: colors.primary,
      marginBottom: 24,
    },
    readyStats: {
      flexDirection: 'row',
      gap: 48,
    },
    readyStat: {
      alignItems: 'center',
    },
    readyNum: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: 32,
      color: colors.text,
    },
    readyLabel: {
      fontFamily: 'Inter_400Regular',
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 4,
    },
    selCats: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      justifyContent: 'center',
      marginTop: 8,
    },
    selCatPill: {
      backgroundColor: colors.backgroundDark,
      borderRadius: 20,
      paddingHorizontal: 14,
      paddingVertical: 6,
    },
    selCatText: {
      fontFamily: 'Inter_400Regular',
      fontSize: 13,
      color: colors.text,
    },

    /* ── Footer ── */
    footer: {
      paddingHorizontal: 32,
      paddingBottom: Math.max(insets.bottom + 16, Platform.OS === 'android' ? 32 : 24),
      paddingTop: 16,
      alignItems: 'center',
      gap: 20,
    },

    /* ── Step Dots ── */
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

    /* ── Primary Button ── */
    btnPrimary: {
      width: '100%',
      height: 60,
      borderRadius: 999,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 8,
      // Button shadow – warm glow
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 24,
      elevation: 4,
    },
    btnPrimaryText: {
      fontFamily: 'Inter_500Medium',
      fontSize: 17,
      color: colors.onPrimary,
      letterSpacing: 0.3,
    },
    btnPrimaryArrow: {
      fontSize: 18,
      color: colors.onPrimary,
    },
    btnDisabled: {
      opacity: 0.45,
    },
  });

  /* ─────────────── STEP CONTENT ─────────────── */
  const steps = [
    /* ── Step 0: Welcome ── */
    <View style={{ flex: 1, justifyContent: 'center' }} key="s0">
      {/* Hero visual */}
      <View style={s.heroContainer}>
        <View style={s.heroGlow} />
        <View style={s.heroCard}>
          <View style={s.heroInnerGlow} />
          <View style={{ position: 'relative' }}>
            <Text style={s.heroBookIcon}>📖</Text>
            <Text style={s.heroSparkle}>✦</Text>
          </View>
        </View>
      </View>

      {/* Text */}
      <Text style={s.welcomeTitle}>
        {t('onboarding_welcome', lang)}
      </Text>
      <Text style={s.welcomeSubtitle}>
        {t('onboarding_welcome_sub', lang)}
      </Text>
    </View>,

    /* ── Step 1: Category Selection ── */
    <View style={{ flex: 1, justifyContent: 'center' }} key="s1">
      <Text style={s.sectionTitle} numberOfLines={1} adjustsFontSizeToFit>{t('onboarding_why', lang)}</Text>
      <Text style={s.sectionSubtitle}>{t('onboarding_why_sub', lang)}</Text>
      <View style={s.catGrid}>
        {allCats.map(cat => {
          const sel = selectedCats.includes(cat);
          return (
            <TouchableOpacity
              key={cat}
              style={[s.catTile, sel && s.catTileSelected]}
              onPress={() => toggleCat(cat)}
              activeOpacity={0.7}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: isSmallPhone ? 6 : 8, flex: 1 }}>
                <View style={{
                  width: isSmallPhone ? 28 : 32,
                  height: isSmallPhone ? 28 : 32,
                  borderRadius: 8,
                  backgroundColor: sel ? `${colors.primary}20` : colors.background,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Ionicons
                    name={getCatIcon(cat)}
                    size={isSmallPhone ? 14 : 16}
                    color={sel ? colors.primary : colors.textSecondary}
                  />
                </View>
                <Text
                  style={[s.catTileText, sel && s.catTileTextSelected, { flex: 1 }]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {t(cat, lang)}
                </Text>
              </View>
              <View style={s.catCheckSlot}>
                {sel && (
                  <View style={s.catCheckCircle}>
                    <Text style={{ fontSize: isSmallPhone ? 11 : 12, color: '#fff', fontWeight: '700' }}>✓</Text>
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

    /* ── Step 2: Time Selection ── */
    <View style={{ flex: 1, justifyContent: 'center' }} key="s2">
      <Text style={s.sectionTitle} numberOfLines={1} adjustsFontSizeToFit>{t('onboarding_how_long', lang)}</Text>
      <Text style={s.sectionSubtitle}>{t('onboarding_how_long_sub', lang)}</Text>
      {timeOptions.map((option, i) => (
        <TouchableOpacity
          key={i}
          style={[s.timeTile, selectedTime === i && s.timeTileSelected]}
          onPress={() => setSelectedTime(i)}
          activeOpacity={0.7}
        >
          <Text style={s.timeTileIcon}>{option.icon}</Text>
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

    /* ── Step 3: Ready ── */
    <View style={{ flex: 1, justifyContent: 'center' }} key="s4">
      <Text style={s.sectionTitle} numberOfLines={1} adjustsFontSizeToFit>{t('onboarding_when_remind', lang)}</Text>
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
            <Text style={s.timeTileIcon}>{option.icon}</Text>
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
    </View>,

    /* ── Step 4: Summary / Ready ── */
    <View style={{ flex: 1, justifyContent: 'center' }} key="s3">
      <Text style={[s.sectionTitle, { textAlign: 'center', marginBottom: 6 }]}>
        {t('onboarding_ready', lang)}
      </Text>
      <Text style={[s.sectionSubtitle, { textAlign: 'center', marginBottom: 24 }]}>
        {readyPlanSummary}
      </Text>

      {/* Selected categories */}
      <View style={[s.readyArt, { paddingVertical: 20, paddingHorizontal: 20, marginBottom: 16 }]}>
        <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 11, color: colors.textSecondary, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>
          {t('onboarding_cat', lang)} ({(selectedCats.length || 2)})
        </Text>
        <View style={s.selCats}>
          {(selectedCats.length ? selectedCats : allCats.slice(0, 2)).map(c => (
            <View key={c} style={s.selCatPill}>
              <Text style={[s.selCatText, { color: colors.primary }]}>{t(c, lang)}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Reading plan + reminder summary */}
      <View style={[s.readyArt, { paddingVertical: 16, paddingHorizontal: 20 }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>
              {t('readingPlan', lang)}
            </Text>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.text }}>
              {selectedTimeOption.icon} {selectedTimeOption.label} · {selectedTimeOption.dailyStoryTarget} {t('onboarding_story', lang)}
            </Text>
          </View>
          <View style={{ flex: 1, paddingLeft: 12 }}>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>
              {t('reminderTime', lang)}
            </Text>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.text }}>
              {reminderOptions.filter(o => selectedReminders.includes(o.reminderWindow)).map(o => `${o.icon} ${o.label}`).join(', ')}
            </Text>
          </View>
        </View>
      </View>
    </View>,
  ];

  const canNext = step === 1 ? selectedCats.length >= 2 : true;

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={s.safe}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.background}
      />

      {/* ── Reading Progress Bar (signature element from DESIGN.md) ── */}
      <View style={[s.readingProgress, { width: `${((step + 1) / TOTAL_STEPS) * 100}%` }]} />

      {/* ── Header ── */}
      <View style={s.header}>
        <Text style={s.headerBrand}>{t('brandText', lang).replace(' ✦', '')}</Text>
        {step === 0 && (
          <TouchableOpacity onPress={skip} activeOpacity={0.7}>
            <Text style={s.headerSkip}>{t('onboarding_skip', lang)}</Text>
          </TouchableOpacity>
        )}
        {step > 0 && (
          <TouchableOpacity
            onPress={() => {
              fadeAnim.setValue(0);
              slideAnim.setValue(-30);
              setStep(step - 1);
              Animated.parallel([
                Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
                Animated.timing(slideAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
              ]).start();
            }}
            activeOpacity={0.7}
          >
            <Text style={s.headerSkip}>← {t('backBtn', lang).replace('← ', '')}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── Animated Content ── */}
      <Animated.View style={{
        flex: 1,
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}>
        <ScrollView
          contentContainerStyle={s.contentScroll}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {steps[step]}
        </ScrollView>
      </Animated.View>

      {/* ── Footer ── */}
      <View style={s.footer}>
        {/* Step Dots */}
        <View style={s.stepDots}>
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <View key={i} style={step === i ? s.stepDotActive : s.stepDot} />
          ))}
        </View>

        {/* Primary CTA Button */}
        <TouchableOpacity
          style={[s.btnPrimary, !canNext && s.btnDisabled]}
          onPress={canNext ? next : null}
          activeOpacity={0.85}
        >
          <Text style={s.btnPrimaryText}>
            {step < TOTAL_STEPS - 1 ? t('next', lang) : t('onboarding_show_recommendations', lang)}
          </Text>
          <Text style={s.btnPrimaryArrow}>→</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;

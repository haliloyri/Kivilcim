import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  StatusBar, Animated, Platform, Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useUserData } from '../context/UserDataContext';
import { useStories } from '../context/StoriesContext';
import { t } from '../locales/i18n';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const OnboardingScreen = ({ navigation }) => {
  const { colors, typography, layout, isDark, lang } = useTheme();
  const { saveOnboarding } = useUserData();
  const { categories } = useStories();
  const [step, setStep] = useState(0);
  const [selectedCats, setSelectedCats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(1);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const allCats = categories;
  const timeOptions = [
    { label: t('time_3min', lang), sub: t('time_3min_sub', lang), icon: '☕' },
    { label: t('time_5min', lang), sub: t('time_5min_sub', lang), icon: '📖' },
    { label: t('time_10min', lang), sub: t('time_10min_sub', lang), icon: '🚀' },
  ];

  const TOTAL_STEPS = 4;

  const next = async () => {
    // Animate out
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: -30, duration: 180, useNativeDriver: true }),
    ]).start(() => {
      if (step < TOTAL_STEPS - 1) {
        setStep(step + 1);
      } else {
        saveOnboarding(selectedCats, timeOptions[selectedTime]);
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
    await saveOnboarding([], timeOptions[1]);
  };

  const toggleCat = (cat) => {
    setSelectedCats(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
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
      fontFamily: 'DMSans_500Medium',
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
      backgroundColor: '#ffffff',
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
      fontFamily: 'DMSans_400Regular',
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
      fontFamily: 'DMSans_400Regular',
      fontSize: 16,
      color: colors.textSecondary,
      lineHeight: 24,
      marginBottom: 28,
    },
    catGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      marginBottom: 16,
    },
    catTile: {
      width: (SCREEN_WIDTH - 64 - 10) / 2,
      paddingVertical: 16,
      paddingHorizontal: 16,
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
      fontFamily: 'DMSans_400Regular',
      fontSize: 14,
      color: colors.text,
    },
    catTileTextSelected: {
      fontFamily: 'DMSans_500Medium',
      color: colors.primary,
    },
    catCheckCircle: {
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    catHint: {
      fontFamily: 'DMSans_400Regular',
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
      fontFamily: 'DMSans_500Medium',
      fontSize: 15,
      color: colors.text,
    },
    timeTileSub: {
      fontFamily: 'DMSans_400Regular',
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
      fontFamily: 'DMSans_400Regular',
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
      fontFamily: 'DMSans_400Regular',
      fontSize: 13,
      color: colors.text,
    },

    /* ── Footer ── */
    footer: {
      paddingHorizontal: 32,
      paddingBottom: Platform.OS === 'android' ? 32 : 24,
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
      fontFamily: 'DMSans_500Medium',
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
      <Text style={s.sectionTitle}>{t('onboarding_why', lang)}</Text>
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
              <Text style={[s.catTileText, sel && s.catTileTextSelected]}>{t(cat, lang)}</Text>
              {sel && (
                <View style={s.catCheckCircle}>
                  <Text style={{ fontSize: 12, color: '#fff', fontWeight: '700' }}>✓</Text>
                </View>
              )}
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
      <Text style={s.sectionTitle}>{t('onboarding_how_long', lang)}</Text>
      <Text style={s.sectionSubtitle}>{t('onboarding_how_long_sub', lang)}</Text>
      {timeOptions.map((t, i) => (
        <TouchableOpacity
          key={i}
          style={[s.timeTile, selectedTime === i && s.timeTileSelected]}
          onPress={() => setSelectedTime(i)}
          activeOpacity={0.7}
        >
          <Text style={s.timeTileIcon}>{t.icon}</Text>
          <View style={{ flex: 1 }}>
            <Text style={s.timeTileName}>{t.label}</Text>
            <Text style={s.timeTileSub}>{t.sub}</Text>
          </View>
          <View style={[s.timeRadio, selectedTime === i && s.timeRadioSelected]}>
            {selectedTime === i && <View style={s.timeRadioInner} />}
          </View>
        </TouchableOpacity>
      ))}
    </View>,

    /* ── Step 3: Ready ── */
    <View style={{ flex: 1, justifyContent: 'center' }} key="s3">
      <View style={s.readyArt}>
        <Text style={s.readySparkIcon}>✦</Text>
        <View style={s.readyStats}>
          <View style={s.readyStat}>
            <Text style={s.readyNum}>{selectedCats.length || 2}</Text>
            <Text style={s.readyLabel}>{t('onboarding_cat', lang)}</Text>
          </View>
          <View style={s.readyStat}>
            <Text style={s.readyNum}>20</Text>
            <Text style={s.readyLabel}>{t('onboarding_story', lang)}</Text>
          </View>
          <View style={s.readyStat}>
            <Text style={s.readyNum}>∞</Text>
            <Text style={s.readyLabel}>{t('onboarding_curiosity', lang)}</Text>
          </View>
        </View>
      </View>
      <Text style={[s.sectionTitle, { textAlign: 'center' }]}>{t('onboarding_ready', lang)}</Text>
      <Text style={[s.sectionSubtitle, { textAlign: 'center', marginBottom: 20 }]}>
        {t('onboarding_ready_sub', lang)}
      </Text>
      <View style={s.selCats}>
        {(selectedCats.length ? selectedCats : ['Finans', 'Psikoloji']).map(c => (
          <View key={c} style={s.selCatPill}>
            <Text style={s.selCatText}>{t(c, lang)}</Text>
          </View>
        ))}
      </View>
    </View>,
  ];

  const canNext = step === 1 ? selectedCats.length >= 2 : true;

  return (
    <SafeAreaView style={s.safe}>
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
            {step < TOTAL_STEPS - 1 ? t('next', lang) : t('onboarding_start_reading', lang)}
          </Text>
          <Text style={s.btnPrimaryArrow}>→</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;

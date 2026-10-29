import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Pressable, Animated, PanResponder,
  StatusBar, Linking, Alert, Image, ActivityIndicator, useWindowDimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Line } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';
import { useUserData } from '../context/UserDataContext';
import { getLegalUrls } from '../constants/externalLinks';
import { t } from '../locales/i18n';
import { ANALYTICS_EVENTS, trackEvent } from '../utils/analytics';
import { revenueAttrs, getTrialEligibility } from '../services/billing';
import { formatCurrency } from '../utils/locale';
import { getLogo } from '../constants/logos';

// Trial copy (paywallTrial*, paywallEarlyTrialTrial*) says "7 days".
const TRIAL_COPY_DAYS = 7;

// Text on the hero surface and the dawn-gold CTA (DESIGN.md §5).
const HERO_TEXT = '#F5F1E8';
const HERO_TEXT_SOFT = '#D5E4E0';
const DAWN_CTA_INK = '#2A1E08';

// Brand motif: sun rising over the hero card (same drawing as the home hero).
const HeroSun = ({ color }) => (
  <Svg
    width={168}
    height={130}
    viewBox="0 0 168 130"
    pointerEvents="none"
    style={{ position: 'absolute', right: -34, top: -30, transform: [{ scaleY: -1 }] }}
  >
    <Circle cx={96} cy={104} r={84} fill={color} opacity={0.08} />
    <Circle cx={96} cy={104} r={62} fill={color} opacity={0.14} />
    <Circle cx={96} cy={104} r={40} fill={color} opacity={0.95} />
    <Line x1={96} y1={40} x2={96} y2={22} stroke={color} strokeWidth={3} strokeLinecap="round" opacity={0.85} />
    <Line x1={60} y1={52} x2={50} y2={40} stroke={color} strokeWidth={3} strokeLinecap="round" opacity={0.85} />
    <Line x1={132} y1={52} x2={142} y2={40} stroke={color} strokeWidth={3} strokeLinecap="round" opacity={0.85} />
    <Line x1={40} y1={78} x2={24} y2={72} stroke={color} strokeWidth={3} strokeLinecap="round" opacity={0.85} />
    <Line x1={152} y1={78} x2={168} y2={72} stroke={color} strokeWidth={3} strokeLinecap="round" opacity={0.85} />
  </Svg>
);

// Prices come from the store, always — never from a constant in here.
//
// A hardcoded price is wrong in every market but the one it was written for,
// and Apple/Google already return the correct localized amount and currency
// for the user's storefront. When the store hasn't answered yet (or billing
// isn't connected) we show a placeholder rather than inventing a number.
const PLAN_ORDER = ['monthly', 'yearly'];
const DEFAULT_PLAN_ID = 'yearly';

const PLAN_SPECS = {
  monthly: {
    nameKey: 'planMonthly',
    perKey: 'perMo',
  },
  yearly: {
    nameKey: 'planAnnual',
    perKey: 'perYr',
    popular: true,
    badgeKey: 'paywallAnnualBestValue',
  },
  lifetime: {
    nameKey: 'planLifetime',
    perKey: 'perLifetime',
  },
};

const FEATURES = [
  { key: 'feat1', icon: 'book-outline' },
  { key: 'feat2', icon: 'mic-outline' },
  { key: 'feat3', icon: 'share-social-outline' },
  { key: 'feat4', icon: 'journal-outline' },
  { key: 'feat5', icon: 'ban-outline' },
];

const PaywallScreen = ({ navigation, route }) => {
  const { colors, typography, layout, isDark, lang } = useTheme();
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const [planId, setPlanId] = useState(DEFAULT_PLAN_ID);
  const [purchaseConfirmed, setPurchaseConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [livePackages, setLivePackages] = useState(null);
  // Plans with a free trial this user can really get from the store: { plan: { days } }.
  const [trialPlans, setTrialPlans] = useState({});
  const paywallReason = route?.params?.reason || 'none';
  const isFreeLimitReached = paywallReason === 'free_limit_reached';
  const isEarlyTrial = paywallReason === 'early_trial';
  const paywallSource = route?.params?.source || 'direct';
  const hasTrackedViewRef = useRef(false);
  const isLockedStorySource = [
    'home_featured_story_locked',
    'home_daily_panel_locked',
    'home_feed_teaser',
    'home_feed_locked',
    'story_detail_next',
  ].includes(paywallSource);
  const isStorytellerSource = paywallReason === 'storyteller_mode' || paywallSource === 'use_in_conversation';
  const isImageCardSource = paywallReason === 'image_card' || paywallSource === 'story_detail_card';
  const isOneMinuteSummarySource = paywallReason === 'one_minute_summary' || paywallSource === 'story_detail_one_minute_summary';
  const isProfileSource = paywallSource === 'profile_upsell';
  const isStreakFreezeSource = paywallReason === 'streak_freeze' || paywallSource === 'progress_streak_freeze';
  const paywallVariant = React.useMemo(() => {
    if (isEarlyTrial) {
      return {
        titleKey: 'paywallEarlyTrialHeroTitle',
        subKey: 'paywallEarlyTrialHeroSub',
      };
    }

    if (isOneMinuteSummarySource) {
      return {
        titleKey: 'paywallOneMinuteHeroTitle',
        subKey: 'paywallOneMinuteHeroSub',
      };
    }

    if (isImageCardSource) {
      return {
        titleKey: 'paywallImageCardHeroTitle',
        subKey: 'paywallImageCardHeroSub',
      };
    }

    if (isStorytellerSource) {
      return {
        titleKey: 'paywallStorytellerHeroTitle',
        subKey: 'paywallStorytellerHeroSub',
      };
    }

    if (isStreakFreezeSource) {
      return {
        titleKey: 'paywallStreakFreezeHeroTitle',
        subKey: 'paywallStreakFreezeHeroSub',
      };
    }

    if (isLockedStorySource) {
      return {
        titleKey: 'paywallLockedHeroTitle',
        subKey: 'paywallLockedHeroSub',
      };
    }

    if (isProfileSource) {
      return {
        titleKey: 'paywallProfileHeroTitle',
        subKey: 'paywallProfileHeroSub',
      };
    }

    return {
      titleKey: 'paywallTitle',
      subKey: 'paywallSub',
    };
  }, [isEarlyTrial, isImageCardSource, isLockedStorySource, isOneMinuteSummarySource, isProfileSource, isStorytellerSource, isStreakFreezeSource]);
  const priceUnavailable = t('paywallPriceUnavailable', lang);

  // The store's own localized price string ("49,99 €", "$49.99", "₺349") —
  // already formatted for the user's storefront, so never re-format it.
  const livePriceString = (id) =>
    livePackages?.[id]?.product?.priceString || priceUnavailable;

  // Savings % and the monthly-equivalent are derived from the LIVE store
  // amounts. They can only be shown once both the monthly and the yearly
  // package have arrived — a percentage computed from a placeholder would be a
  // made-up claim next to a real price.
  const priceMeta = React.useMemo(() => {
    const m = livePackages?.monthly?.product;
    const y = livePackages?.yearly?.product;
    if (typeof m?.price !== 'number' || typeof y?.price !== 'number' || m.price <= 0) {
      return { savingsPct: null, monthlyEquivalent: null };
    }
    const currency = y.currencyCode || m.currencyCode;
    return {
      savingsPct: Math.max(0, Math.floor((1 - y.price / (m.price * 12)) * 100)),
      monthlyEquivalent: formatCurrency(y.price / 12, currency, lang),
    };
  }, [livePackages, lang]);

  // Only render plans the store actually offers. Before the offering loads (or
  // when billing isn't connected) show monthly + yearly as priceless shells so
  // the layout doesn't jump; `lifetime` appears only once it's really there.
  const plans = React.useMemo(() => {
    const available = livePackages
      ? PLAN_ORDER.filter((id) => livePackages[id])
      : ['monthly', 'yearly'];

    return available.map((id) => {
      const spec = PLAN_SPECS[id];
      const plan = {
        id,
        name: t(spec.nameKey, lang),
        price: livePriceString(id),
        per: t(spec.perKey, lang),
        popular: !!spec.popular,
        badge: spec.badgeKey ? t(spec.badgeKey, lang) : null,
        save: null,
        effectivePrice: null,
        package: livePackages?.[id] || null,
      };
      if (id === 'yearly' && priceMeta.savingsPct !== null) {
        plan.save = t('save40', lang).replace('{{pct}}', String(priceMeta.savingsPct));
        plan.effectivePrice = t('paywallAnnualMonthlyEquivalent', lang)
          .replace('{{price}}', priceMeta.monthlyEquivalent);
      }
      return plan;
    });
  }, [livePackages, lang, priceMeta]);

  // Keep the selection valid when the offering loads and changes the plan set.
  const selectedPlan = plans.find((p) => p.id === planId) || plans[0] || null;
  useEffect(() => {
    if (plans.length && !plans.some((p) => p.id === planId)) {
      setPlanId(plans.some((p) => p.id === DEFAULT_PLAN_ID) ? DEFAULT_PLAN_ID : plans[0].id);
    }
  }, [plans, planId]);
  const { buyPremium, restorePremium, getPremiumOfferings, billingLive } = useUserData();

  // Store-payment and restore reassurance belong on every build — they describe
  // how the purchase works, not whether this build can take one.
  const trustPoints = [
    { icon: 'lock-closed-outline', text: t('paywallTrust2', lang) },
    { icon: 'refresh-outline', text: t('paywallTrust3', lang) },
  ];

  // App Store / Play require auto-renewable subscription terms next to the CTA.
  const autoRenewDisclosure = t('paywallAutoRenewDisclosure', lang)
    .replace('{{monthlyPrice}}', livePriceString('monthly'))
    .replace('{{annualPrice}}', livePriceString('yearly'));

  // Promise a trial only when the store has a free intro offer on this plan, the
  // user is still eligible for it, and its length matches the copy (7 days).
  const showsTrial = billingLive && trialPlans[selectedPlan?.id]?.days === TRIAL_COPY_DAYS;
  const trialBadge = showsTrial
    ? t('paywallTrialBadge', lang).replace('{{price}}', selectedPlan?.price || priceUnavailable)
    : null;

  // The offer right after the first finished story leads with the free trial
  // instead of "unlock Premium": that reader has seen one story, and the ask is
  // 7 free days, not a purchase. Only when a trial really applies — `lifetime`
  // is a one-off and an unreachable store has no trial to promise.
  const heroTitleKey = isEarlyTrial && showsTrial ? 'paywallEarlyTrialTrialTitle' : paywallVariant.titleKey;
  const heroSubKey = isEarlyTrial && showsTrial ? 'paywallEarlyTrialTrialSub' : paywallVariant.subKey;

  // Load live store prices when billing is connected.
  useEffect(() => {
    if (!billingLive) return;
    let cancelled = false;
    (async () => {
      const pkgs = await getPremiumOfferings();
      if (cancelled || !pkgs) return;
      setLivePackages(pkgs);
      const trials = await getTrialEligibility(pkgs);
      if (!cancelled) setTrialPlans(trials);
    })();
    return () => { cancelled = true; };
  }, [billingLive, getPremiumOfferings]);

  const legalLinks = [
    { label: t('paywallLegalPrivacy', lang), url: getLegalUrls(lang).privacy },
    { label: t('paywallLegalTerms', lang), url: getLegalUrls(lang).terms },
    { label: t('paywallLegalRefund', lang), url: getLegalUrls(lang).refund },
  ];

  const handleSelectPlan = (nextId) => {
    if (nextId === planId) return;
    const next = plans.find((p) => p.id === nextId);

    trackEvent(ANALYTICS_EVENTS.PAYWALL_PLAN_SELECTED, {
      previousPlan: selectedPlan?.name,
      previousPlanId: selectedPlan?.id,
      selectedPlan: next?.name,
      selectedPlanId: next?.id,
      selectedPrice: next?.price,
      ...revenueAttrs(next?.package),
      source: paywallSource,
      reason: paywallReason,
      lang,
    });

    setPlanId(nextId);
  };

  useEffect(() => {
    if (hasTrackedViewRef.current) return;
    hasTrackedViewRef.current = true;

    trackEvent(ANALYTICS_EVENTS.PAYWALL_VIEWED, {
      reason: paywallReason,
      source: paywallSource,
      selectedPlan: selectedPlan?.name,
      selectedPlanId: selectedPlan?.id,
      billing_live: billingLive,
      lang,
    });

    if (isFreeLimitReached) {
      trackEvent(ANALYTICS_EVENTS.FREE_LIMIT_TO_PAYWALL, {
        source: paywallSource,
        selectedPlan: selectedPlan?.name,
        lang,
      });
    }
  }, [billingLive, isFreeLimitReached, lang, paywallReason, paywallSource, selectedPlan]);

  const handlePurchase = async () => {
    if (isProcessing) return;

    // Billing not connected: say so and record it. Granting Premium here would
    // ship a free app and report purchases that never happened.
    if (!billingLive) {
      await trackEvent(ANALYTICS_EVENTS.PAYWALL_UNAVAILABLE, {
        source: paywallSource,
        reason: paywallReason,
        selectedPlanId: selectedPlan?.id,
        lang,
      });
      Alert.alert(t('paywallUnavailableTitle', lang), t('paywallUnavailableSub', lang));
      return;
    }

    // Revenue attributes are numeric (`revenue` + ISO `currency` + `product_id`).
    // A display string like "349₺" can't be summed, so LTV and ROAS would be
    // impossible to compute downstream.
    const planProps = {
      selectedPlan: selectedPlan?.name,
      selectedPlanId: selectedPlan?.id,
      selectedPrice: selectedPlan?.price,
      ...revenueAttrs(selectedPlan?.package),
      source: paywallSource,
      reason: paywallReason,
      lang,
    };

    await trackEvent(ANALYTICS_EVENTS.PAYWALL_PURCHASE_STARTED, planProps);

    setIsProcessing(true);
    try {
      const result = await buyPremium(selectedPlan?.package || null);
      if (result?.success) {
        await trackEvent(ANALYTICS_EVENTS.PAYWALL_PURCHASE_SUCCEEDED, {
          ...planProps,
          period_type: result?.entitlement?.periodType,
          is_trial_conversion: !!result?.entitlement?.isTrial,
          expires_at: result?.entitlement?.expiresAt,
        });
        setPurchaseConfirmed(true);
        return;
      }

      // User dismissed the store sheet — not an error, stay silent.
      if (result?.userCancelled) return;

      await trackEvent(ANALYTICS_EVENTS.PAYWALL_PURCHASE_FAILED, {
        ...planProps,
        failureReason: result?.error || 'buy_premium_failed',
      });
      Alert.alert(t('alert_error', lang), t('paywallPurchaseFailed', lang));
    } finally {
      setIsProcessing(false);
    }
  };

  const openLegalLink = async (url) => {
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (!canOpen) {
        Alert.alert(t('alert_error', lang), t('paywallLegalUnavailable', lang));
        return;
      }
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert(t('alert_error', lang), t('paywallLegalUnavailable', lang));
    }
  };

  const handleRestorePress = async () => {
    if (!billingLive) {
      Alert.alert(t('paywallRestoreUnavailableTitle', lang), t('paywallRestoreUnavailableSub', lang));
      return;
    }
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const result = await restorePremium();
      if (result?.success && result?.entitled) {
        setPurchaseConfirmed(true);
        Alert.alert(t('paywallRestoreSuccessTitle', lang), t('paywallRestoreSuccessSub', lang));
      } else {
        Alert.alert(t('paywallRestoreNoneTitle', lang), t('paywallRestoreNoneSub', lang));
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Bottom sheet: slides up on mount, closes by backdrop tap, close button or
  // a drag down on the grab zone. All paths go through closeSheet.
  const slide = useRef(new Animated.Value(windowHeight)).current;
  const closingRef = useRef(false);

  useEffect(() => {
    Animated.timing(slide, { toValue: 0, duration: 260, useNativeDriver: true }).start();
  }, [slide]);

  const closeSheet = React.useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    Animated.timing(slide, { toValue: windowHeight, duration: 200, useNativeDriver: true })
      .start(() => navigation.goBack());
  }, [slide, windowHeight, navigation]);

  const panResponder = React.useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => g.dy > 6 && Math.abs(g.dy) > Math.abs(g.dx),
    onPanResponderMove: (_, g) => { if (g.dy > 0) slide.setValue(g.dy); },
    onPanResponderRelease: (_, g) => {
      if (g.dy > 110 || g.vy > 0.9) {
        closeSheet();
      } else {
        Animated.spring(slide, { toValue: 0, useNativeDriver: true, bounciness: 0 }).start();
      }
    },
    onPanResponderTerminate: () => {
      Animated.spring(slide, { toValue: 0, useNativeDriver: true, bounciness: 0 }).start();
    },
  }), [slide, closeSheet]);

  const gutter = 20;

  const styles = StyleSheet.create({
    root: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.modalOverlay,
    },
    sheet: {
      maxHeight: '92%',
      backgroundColor: colors.background,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      overflow: 'hidden',
    },
    handle: {
      alignSelf: 'center',
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.border,
      marginTop: 10,
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: gutter,
      paddingTop: 6,
      paddingBottom: 4,
    },
    brandRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    brandLogo: {
      width: 28,
      height: 28,
    },
    brandName: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: 18,
      color: colors.text,
    },
    closeBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.cardBackground,
      borderWidth: layout.borderWidth,
      borderColor: colors.border,
    },
    hero: {
      marginHorizontal: gutter,
      marginTop: 6,
      paddingHorizontal: 18,
      paddingTop: 20,
      paddingBottom: 18,
      borderRadius: layout.radius.card,
      backgroundColor: colors.heroSurface,
      borderWidth: layout.borderWidth,
      borderColor: colors.heroBorder,
      overflow: 'hidden',
    },
    heroEyebrow: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 11.5,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
      color: colors.dawn,
    },
    heroTitle: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: 24,
      lineHeight: 29,
      color: HERO_TEXT,
      marginTop: 8,
      maxWidth: '78%',
    },
    heroSub: {
      fontFamily: 'Inter_400Regular',
      fontSize: 14,
      lineHeight: 20,
      color: HERO_TEXT_SOFT,
      marginTop: 8,
    },
    features: {
      marginHorizontal: gutter + 2,
      marginTop: 16,
      gap: 10,
    },
    featureRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    featureIcon: {
      width: 28,
      height: 28,
      borderRadius: 9,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primaryContainer,
    },
    featureText: {
      flex: 1,
      fontFamily: 'Inter_400Regular',
      fontSize: 14.5,
      lineHeight: 20,
      color: colors.text,
    },
    plansRow: {
      flexDirection: 'row',
      gap: 10,
      marginHorizontal: gutter,
      marginTop: 22,
    },
    planCard: {
      flex: 1,
      minWidth: 0,
      alignItems: 'center',
      paddingTop: 26,
      paddingBottom: 14,
      paddingHorizontal: 10,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.cardBackground,
    },
    planCardSelected: {
      borderWidth: 2,
      borderColor: colors.primary,
      backgroundColor: colors.primaryContainer,
      paddingTop: 25,
      paddingBottom: 13,
      paddingHorizontal: 9,
    },
    planRadio: {
      position: 'absolute',
      top: 10,
      right: 10,
      width: 18,
      height: 18,
      borderRadius: 9,
      borderWidth: 1.5,
      borderColor: colors.mutedText,
      alignItems: 'center',
      justifyContent: 'center',
    },
    planRadioSelected: {
      borderColor: colors.primary,
    },
    planRadioDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.primary,
    },
    popularBadge: {
      position: 'absolute',
      top: -11,
      alignSelf: 'center',
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    popularText: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 11.5,
      color: colors.onPrimary,
    },
    planName: {
      fontFamily: 'Inter_500Medium',
      fontSize: 13.5,
      color: colors.textSecondary,
    },
    planPrice: {
      fontFamily: 'PlayfairDisplay_600SemiBold',
      fontSize: 24,
      color: colors.text,
      marginTop: 4,
    },
    planPer: {
      fontFamily: 'Inter_400Regular',
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    planEffectivePrice: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 12.5,
      lineHeight: 17,
      color: colors.primaryText,
      marginTop: 6,
      textAlign: 'center',
    },
    planSave: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 12.5,
      color: colors.success,
      marginTop: 4,
    },
    buy: {
      marginTop: 18,
      paddingHorizontal: gutter,
    },
    ctaBtn: {
      height: 56,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.dawn,
      shadowColor: colors.dawn,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 10,
      elevation: 4,
    },
    ctaText: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 17,
      color: DAWN_CTA_INK,
    },
    trialBadgeText: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 13.5,
      color: colors.primaryText,
      textAlign: 'center',
      marginTop: 8,
    },
    disclosureText: {
      fontFamily: 'Inter_400Regular',
      fontSize: 11,
      lineHeight: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      marginHorizontal: gutter + 4,
      marginTop: 10,
    },
    trustWrap: {
      marginHorizontal: gutter + 2,
      marginTop: 16,
      gap: 8,
    },
    trustRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
    },
    trustText: {
      flex: 1,
      fontFamily: 'Inter_400Regular',
      fontSize: 12.5,
      lineHeight: 18,
      color: colors.textSecondary,
    },
    refundText: {
      fontFamily: 'Inter_400Regular',
      fontSize: 12,
      lineHeight: 18,
      color: colors.textSecondary,
      textAlign: 'center',
      marginHorizontal: gutter,
      marginTop: 12,
    },
    footerRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: gutter,
      marginTop: 4,
    },
    footerLink: {
      minHeight: 44,
      justifyContent: 'center',
      paddingHorizontal: 10,
    },
    footerLinkText: {
      fontFamily: 'Inter_500Medium',
      fontSize: 12.5,
      color: colors.textSecondary,
      textDecorationLine: 'underline',
    },
    restoreText: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 13,
      color: colors.primaryText,
      textDecorationLine: 'underline',
    },
    successCard: {
      borderWidth: 1,
      borderColor: `${colors.primary}66`,
      borderRadius: 18,
      backgroundColor: colors.primaryContainer,
      padding: 16,
      marginBottom: 12,
      alignItems: 'center',
      gap: 4,
    },
    successTitle: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 16,
      color: colors.text,
    },
    successSub: {
      fontFamily: 'Inter_400Regular',
      fontSize: 13,
      lineHeight: 19,
      color: colors.textSecondary,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.root}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      {/* Dimmed backdrop — tap to dismiss */}
      <Pressable
        style={styles.backdrop}
        onPress={closeSheet}
        accessibilityRole="button"
        accessibilityLabel={t('close', lang)}
      />

      <Animated.View style={[styles.sheet, { transform: [{ translateY: slide }] }]}>
        {/* Grab zone: handle + top bar. Drag down to dismiss. */}
        <View {...panResponder.panHandlers}>
          <View style={styles.handle} />
          <View style={styles.topBar}>
            <View style={styles.brandRow} accessibilityRole="image" accessibilityLabel="Albor">
              <Image source={getLogo(isDark)} style={styles.brandLogo} resizeMode="contain" />
              <Text style={styles.brandName}>Albor</Text>
            </View>
            <TouchableOpacity
              onPress={closeSheet}
              style={styles.closeBtn}
              hitSlop={{ top: 4, right: 4, bottom: 4, left: 4 }}
              accessibilityRole="button"
              accessibilityLabel={t('close', lang)}
            >
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 12) + 12 }}
        >
          <View style={styles.hero}>
            <HeroSun color={colors.dawn} />
            <Text style={styles.heroEyebrow}>{t('paywallEyebrow', lang)}</Text>
            <Text style={styles.heroTitle} accessibilityRole="header">{t(heroTitleKey, lang)}</Text>
            <Text style={styles.heroSub}>{t(heroSubKey, lang)}</Text>
          </View>

          <View style={styles.features}>
            {FEATURES.map((f) => (
              <View key={f.key} style={styles.featureRow}>
                <View style={styles.featureIcon}>
                  <Ionicons name={f.icon} size={16} color={colors.primaryText} />
                </View>
                <Text style={styles.featureText}>{t(f.key, lang)}</Text>
              </View>
            ))}
          </View>

          <View style={styles.plansRow}>
            {plans.map((p) => {
              const selected = planId === p.id;
              return (
                <TouchableOpacity
                  key={p.id}
                  style={[styles.planCard, selected && styles.planCardSelected]}
                  onPress={() => handleSelectPlan(p.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`${p.name} ${p.price}${p.per}`}
                  accessibilityState={{ selected }}
                >
                  {p.popular && (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularText}>{p.badge || t('popular', lang)}</Text>
                    </View>
                  )}
                  <View style={[styles.planRadio, selected && styles.planRadioSelected]}>
                    {selected && <View style={styles.planRadioDot} />}
                  </View>
                  <Text style={styles.planName}>{p.name}</Text>
                  <Text style={styles.planPrice}>{p.price}</Text>
                  <Text style={styles.planPer}>{p.per}</Text>
                  {p.effectivePrice && <Text style={styles.planEffectivePrice}>{p.effectivePrice}</Text>}
                  {p.save && <Text style={styles.planSave}>{p.save}</Text>}
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.buy}>
            {purchaseConfirmed && (
              <View style={styles.successCard} accessibilityRole="summary">
                <Text style={styles.successTitle}>{t('paywallPurchaseSuccessTitle', lang)}</Text>
                <Text style={styles.successSub}>{t('paywallPurchaseSuccessSub', lang)}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.ctaBtn, isProcessing && { opacity: 0.6 }]}
              onPress={purchaseConfirmed ? closeSheet : handlePurchase}
              disabled={isProcessing}
              accessibilityRole="button"
              accessibilityState={{ disabled: isProcessing, busy: isProcessing }}
              accessibilityLabel={purchaseConfirmed ? t('paywallContinueCta', lang) : t('subscribe', lang)}
            >
              {isProcessing ? (
                <ActivityIndicator color={DAWN_CTA_INK} />
              ) : (
                <Text style={styles.ctaText}>{t(purchaseConfirmed ? 'paywallContinueCta' : 'subscribe', lang)}</Text>
              )}
            </TouchableOpacity>

            {trialBadge && !purchaseConfirmed && (
              <Text style={styles.trialBadgeText}>{trialBadge}</Text>
            )}
          </View>

          {billingLive && !purchaseConfirmed && (
            <Text style={styles.disclosureText}>{autoRenewDisclosure}</Text>
          )}

          <View style={styles.trustWrap}>
            {trustPoints.map((item) => (
              <View key={item.icon} style={styles.trustRow}>
                <Ionicons name={item.icon} size={15} color={colors.primaryText} style={{ marginTop: 1 }} />
                <Text style={styles.trustText}>{item.text}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.refundText}>{t('paywallRefundText', lang)}</Text>

          <View style={styles.footerRow}>
            <TouchableOpacity
              style={styles.footerLink}
              onPress={handleRestorePress}
              disabled={isProcessing}
              accessibilityRole="button"
              accessibilityLabel={billingLive ? t('paywallRestoreCta', lang) : t('restore', lang)}
            >
              <Text style={styles.restoreText}>
                {billingLive ? t('paywallRestoreCta', lang) : t('restore', lang)}
              </Text>
            </TouchableOpacity>
            {legalLinks.map((item) => (
              <TouchableOpacity
                key={item.label}
                style={styles.footerLink}
                onPress={() => openLegalLink(item.url)}
                accessibilityRole="link"
                accessibilityLabel={item.label}
              >
                <Text style={styles.footerLinkText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
};

export default PaywallScreen;

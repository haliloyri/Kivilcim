import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  StatusBar, Platform, Linking, Alert, Image, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useUserData } from '../context/UserDataContext';
import { t } from '../locales/i18n';
import { ANALYTICS_EVENTS, trackEvent } from '../utils/analytics';

// Single source of truth for pricing. Update these and every derived label
// (monthly-equivalent, savings %, months-free) recomputes automatically.
const SPARK_LOGO = require('../../assets/spark_logo.png');
const SPARK_LOGO_DARK = require('../../assets/spark_logo_dark.png');

const PRICING = { currency: '₺', monthly: 49, annual: 349 };
const formatPrice = (amount) => `${amount}${PRICING.currency}`;
const ANNUAL_MONTHLY_EQUIVALENT = Math.round(PRICING.annual / 12);
const ANNUAL_SAVINGS_PCT = Math.floor((1 - PRICING.annual / (PRICING.monthly * 12)) * 100);
const ANNUAL_MONTHS_FREE = Math.round((PRICING.monthly * 12 - PRICING.annual) / PRICING.monthly);

const PaywallScreen = ({ navigation, route }) => {
  const { colors, typography, layout, isDark, lang } = useTheme();
  const [plan, setPlan] = useState(1);
  const [purchaseConfirmed, setPurchaseConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [livePackages, setLivePackages] = useState(null);
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
  const isProfileSource = paywallSource === 'profile_upsell';
  const isStreakFreezeSource = paywallReason === 'streak_freeze' || paywallSource === 'progress_streak_freeze';
  const paywallVariant = React.useMemo(() => {
    if (isEarlyTrial) {
      return {
        bannerTitleKey: 'paywallEarlyTrialTitle',
        bannerSubKey: 'paywallEarlyTrialSub',
        titleKey: 'paywallEarlyTrialHeroTitle',
        subKey: 'paywallEarlyTrialHeroSub',
        whyTitleKey: 'paywallWhyNowTrialTitle',
        whySubKey: 'paywallWhyNowTrialSub',
        valueKeys: ['paywallTrialValue1', 'paywallTrialValue2', 'paywallTrialValue3'],
      };
    }

    if (isStorytellerSource) {
      return {
        bannerTitleKey: 'paywallStorytellerTitle',
        bannerSubKey: 'paywallStorytellerSub',
        titleKey: 'paywallStorytellerHeroTitle',
        subKey: 'paywallStorytellerHeroSub',
        whyTitleKey: 'paywallWhyNowStorytellerTitle',
        whySubKey: 'paywallWhyNowStorytellerSub',
        valueKeys: ['paywallStorytellerValue1', 'paywallStorytellerValue2', 'paywallStorytellerValue3'],
      };
    }

    if (isStreakFreezeSource) {
      return {
        bannerTitleKey: 'paywallStreakFreezeTitle',
        bannerSubKey: 'paywallStreakFreezeSub',
        titleKey: 'paywallStreakFreezeHeroTitle',
        subKey: 'paywallStreakFreezeHeroSub',
        whyTitleKey: 'paywallWhyNowStreakFreezeTitle',
        whySubKey: 'paywallWhyNowStreakFreezeSub',
        valueKeys: ['paywallStreakFreezeValue1', 'paywallStreakFreezeValue2', 'paywallStreakFreezeValue3'],
      };
    }

    if (isLockedStorySource) {
      return {
        bannerTitleKey: 'paywallLockedTitle',
        bannerSubKey: 'paywallLockedSub',
        titleKey: 'paywallLockedHeroTitle',
        subKey: 'paywallLockedHeroSub',
        whyTitleKey: 'paywallWhyNowLockedTitle',
        whySubKey: 'paywallWhyNowLockedSub',
        valueKeys: ['paywallLockedValue1', 'paywallLockedValue2', 'paywallLockedValue3'],
      };
    }

    if (isProfileSource) {
      return {
        bannerTitleKey: 'paywallProfileTitle',
        bannerSubKey: 'paywallProfileSub',
        titleKey: 'paywallProfileHeroTitle',
        subKey: 'paywallProfileHeroSub',
        whyTitleKey: 'paywallWhyNowProfileTitle',
        whySubKey: 'paywallWhyNowProfileSub',
        valueKeys: ['paywallProfileValue1', 'paywallProfileValue2', 'paywallProfileValue3'],
      };
    }

    return {
      bannerTitleKey: null,
      bannerSubKey: null,
      titleKey: 'paywallTitle',
      subKey: 'paywallSub',
      whyTitleKey: 'paywallWhyNowTitle',
      whySubKey: 'paywallWhyNowSub',
      valueKeys: ['paywallValue1', 'paywallValue2', 'paywallValue3'],
    };
  }, [isEarlyTrial, isLockedStorySource, isProfileSource, isStorytellerSource, isStreakFreezeSource]);
  // When live billing is connected, prices/currency come from the store
  // (localized, regionally correct). Otherwise fall back to the built-in values.
  const livePriceString = (planId, fallback) =>
    livePackages?.[planId]?.product?.priceString || fallback;
  const plans = [
    {
      id: 'monthly',
      name: t('planMonthly', lang),
      price: livePriceString('monthly', formatPrice(PRICING.monthly)),
      per: t('perMo', lang),
      save: null,
      detail: t('paywallMonthlyDetail', lang),
      package: livePackages?.monthly || null,
    },
    {
      id: 'annual',
      name: t('planAnnual', lang),
      price: livePriceString('annual', formatPrice(PRICING.annual)),
      per: t('perYr', lang),
      save: t('save40', lang).replace('{{pct}}', String(ANNUAL_SAVINGS_PCT)),
      popular: true,
      badge: t('paywallAnnualBestValue', lang),
      detail: t('paywallAnnualDetail', lang),
      effectivePrice: t('paywallAnnualMonthlyEquivalent', lang).replace('{{price}}', String(ANNUAL_MONTHLY_EQUIVALENT)),
      package: livePackages?.annual || null,
    },
  ];
  const features = [
    t('feat1', lang),
    t('feat2', lang),
    t('feat3', lang),
    t('feat4', lang),
    t('feat5', lang),
  ];
  const { buyPremium, restorePremium, getPremiumOfferings, billingLive } = useUserData();

  const valuePoints = paywallVariant.valueKeys.map((key) => t(key, lang));
  // Trust1 (social proof) always shows. Trust2/3 explain that billing isn't
  // connected yet — only relevant in dev/local builds.
  const trustPoints = billingLive
    ? [t('paywallTrust1', lang)]
    : [t('paywallTrust1', lang), t('paywallTrust2', lang), t('paywallTrust3', lang)];

  // App Store / Play require auto-renewable subscription terms next to the CTA.
  const autoRenewDisclosure = t('paywallAutoRenewDisclosure', lang)
    .replace('{{monthlyPrice}}', plans[0].price)
    .replace('{{annualPrice}}', plans[1].price);

  // Load live store prices when billing is connected.
  useEffect(() => {
    if (!billingLive) return;
    let cancelled = false;
    (async () => {
      const pkgs = await getPremiumOfferings();
      if (!cancelled && pkgs) setLivePackages(pkgs);
    })();
    return () => { cancelled = true; };
  }, [billingLive, getPremiumOfferings]);

  const legalLinks = [
    { label: t('paywallLegalPrivacy', lang), url: 'https://sparkapp.co/privacy' },
    { label: t('paywallLegalTerms', lang), url: 'https://sparkapp.co/terms' },
    { label: t('paywallLegalRefund', lang), url: 'https://sparkapp.co/refund' },
  ];

  const handleSelectPlan = (nextPlan) => {
    if (nextPlan === plan) return;

    trackEvent(ANALYTICS_EVENTS.PAYWALL_PLAN_SELECTED, {
      previousPlan: plans[plan]?.name,
      previousPlanId: plans[plan]?.id,
      selectedPlan: plans[nextPlan]?.name,
      selectedPlanId: plans[nextPlan]?.id,
      selectedPrice: plans[nextPlan]?.price,
      source: paywallSource,
      reason: paywallReason,
      lang,
    });

    setPlan(nextPlan);
  };

  useEffect(() => {
    if (hasTrackedViewRef.current) return;
    hasTrackedViewRef.current = true;

    trackEvent(ANALYTICS_EVENTS.PAYWALL_VIEWED, {
      reason: paywallReason,
      source: paywallSource,
      selectedPlan: plans[plan]?.name,
      selectedPlanId: plans[plan]?.id,
      lang,
    });

    if (isFreeLimitReached) {
      trackEvent(ANALYTICS_EVENTS.FREE_LIMIT_TO_PAYWALL, {
        source: paywallSource,
        selectedPlan: plans[plan]?.name,
        lang,
      });
    }
  }, [isFreeLimitReached, lang, paywallReason, paywallSource, plan, plans]);

  const handlePurchase = async () => {
    const selectedPlan = plans[plan];
    await trackEvent(ANALYTICS_EVENTS.PAYWALL_PURCHASE_STARTED, {
      selectedPlan: selectedPlan?.name,
      selectedPlanId: selectedPlan?.id,
      selectedPrice: selectedPlan?.price,
      source: paywallSource,
      reason: paywallReason,
      lang,
    });

    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const result = await buyPremium(selectedPlan?.package || null);
      if (result?.success) {
        await trackEvent(ANALYTICS_EVENTS.PAYWALL_PURCHASE_SUCCEEDED, {
          selectedPlan: selectedPlan?.name,
          selectedPlanId: selectedPlan?.id,
          selectedPrice: selectedPlan?.price,
          source: paywallSource,
          reason: paywallReason,
          lang,
        });
        setPurchaseConfirmed(true);
        return;
      }

      // User dismissed the store sheet — not an error, stay silent.
      if (result?.userCancelled) return;

      await trackEvent(ANALYTICS_EVENTS.PAYWALL_PURCHASE_FAILED, {
        selectedPlan: selectedPlan?.name,
        selectedPlanId: selectedPlan?.id,
        selectedPrice: selectedPlan?.price,
        source: paywallSource,
        reason: paywallReason,
        lang,
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

  const styles = StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.background
    },
    brandLogo: {
      width: 64,
      height: 64,
      alignSelf: 'center',
      marginBottom: 12,
    },
    paywallTitle: { 
      fontFamily: 'PlayfairDisplay_700Bold', 
      fontSize: typography.sizes.headingLarge - 2, 
      color: colors.text, 
      textAlign: 'center', 
      marginBottom: 10, 
      lineHeight: 34 
    },
    paywallSub: { 
      fontFamily: 'Inter_400Regular', 
      fontSize: typography.sizes.body - 1, 
      color: colors.textSecondary, 
      textAlign: 'center', 
      lineHeight: typography.spacing.bodyLineHeight, 
      marginBottom: 18 
    },
    limitBanner: {
      borderWidth: 1,
      borderColor: colors.primary,
      backgroundColor: isDark ? 'rgba(200, 150, 80, 0.14)' : '#FFF6E8',
      borderRadius: layout.radius.card,
      padding: 12,
      marginBottom: 14,
    },
    limitBannerTitle: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: typography.sizes.ui,
      color: colors.text,
      marginBottom: 4,
    },
    limitBannerSub: {
      fontFamily: 'Inter_400Regular',
      fontSize: typography.sizes.badge + 1,
      color: colors.textSecondary,
      lineHeight: 18,
    },
    modelCard: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: layout.radius.card,
      backgroundColor: colors.backgroundDark,
      padding: 14,
      marginBottom: 14,
    },
    modelTitle: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: typography.sizes.ui,
      color: colors.text,
      marginBottom: 6,
    },
    modelSub: {
      fontFamily: 'Inter_400Regular',
      fontSize: typography.sizes.badge + 1,
      color: colors.textSecondary,
      lineHeight: 18,
      marginBottom: 10,
    },
    modelRow: {
      flexDirection: 'row',
      gap: 10,
    },
    modelCol: {
      flex: 1,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 10,
      backgroundColor: colors.background,
    },
    modelColTitle: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: typography.sizes.badge + 1,
      color: colors.text,
      marginBottom: 2,
    },
    modelColText: {
      fontFamily: 'Inter_400Regular',
      fontSize: typography.sizes.badge,
      color: colors.textSecondary,
      lineHeight: 16,
    },
    whyNowCard: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: layout.radius.card,
      padding: 14,
      marginBottom: 16,
      backgroundColor: colors.background,
    },
    whyNowTitle: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: typography.sizes.ui,
      color: colors.text,
      marginBottom: 6,
    },
    whyNowSub: {
      fontFamily: 'Inter_400Regular',
      fontSize: typography.sizes.badge + 1,
      color: colors.textSecondary,
      marginBottom: 8,
      lineHeight: 18,
    },
    whyNowRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 8,
      marginTop: 6,
    },
    whyNowBullet: {
      color: colors.primary,
      marginTop: 1,
      fontSize: 12,
    },
    whyNowText: {
      flex: 1,
      fontFamily: 'Inter_400Regular',
      fontSize: typography.sizes.badge + 1,
      lineHeight: 18,
      color: colors.text,
    },
    planCard: { 
      flex: 1, 
      borderWidth: layout.borderWidth, 
      borderColor: colors.border, 
      borderRadius: layout.radius.card, 
      padding: 16, 
      alignItems: 'center', 
      backgroundColor: colors.backgroundDark 
    },
    planCardSelected: { 
      borderWidth: 1.5, 
      borderColor: colors.primary,
      backgroundColor: isDark ? 'rgba(200, 150, 80, 0.12)' : '#FFF8EC',
    },
    popularBadge: { 
      backgroundColor: colors.danger, 
      borderRadius: 10, 
      paddingHorizontal: 8, 
      paddingVertical: 3, 
      marginBottom: 8 
    },
    popularText: { 
      fontFamily: 'Inter_500Medium', 
      fontSize: typography.sizes.badge, 
      color: '#FFFFFF' 
    },
    planName: { 
      fontFamily: 'Inter_400Regular', 
      fontSize: typography.sizes.ui, 
      color: colors.text, 
      marginBottom: 4 
    },
    planPrice: { 
      fontFamily: 'PlayfairDisplay_600SemiBold', 
      fontSize: 24, 
      color: colors.text 
    },
    planPer: { 
      fontFamily: 'Inter_400Regular', 
      fontSize: typography.sizes.badge, 
      color: colors.textSecondary 
    },
    planSave: { 
      fontFamily: 'Inter_500Medium', 
      fontSize: typography.sizes.badge, 
      color: colors.success, 
      marginTop: 4 
    },
    planDetail: {
      fontFamily: 'Inter_400Regular',
      fontSize: typography.sizes.badge,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 16,
      marginTop: 6,
    },
    planEffectivePrice: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: typography.sizes.badge + 1,
      color: colors.primary,
      marginTop: 6,
      textAlign: 'center',
    },
    annualNudge: {
      borderWidth: 1,
      borderColor: `${colors.primary}55`,
      borderRadius: layout.radius.card,
      backgroundColor: isDark ? 'rgba(200, 150, 80, 0.10)' : '#FFF6E8',
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginTop: -8,
      marginBottom: 16,
    },
    annualNudgeText: {
      fontFamily: 'Inter_500Medium',
      fontSize: typography.sizes.badge + 1,
      color: colors.text,
      textAlign: 'center',
      lineHeight: 18,
    },
    featureRow: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      gap: 12, 
      paddingVertical: 10, 
      borderBottomWidth: layout.borderWidth, 
      borderBottomColor: colors.border 
    },
    featCheck: { 
      width: 20, 
      height: 20, 
      borderRadius: 10, 
      backgroundColor: colors.backgroundDark, 
      borderWidth: layout.borderWidth, 
      borderColor: colors.border, 
      alignItems: 'center', 
      justifyContent: 'center' 
    },
    featText: { 
      fontFamily: 'Inter_400Regular', 
      fontSize: typography.sizes.body - 1, 
      color: colors.text, 
      flex: 1 
    },
    btnPrimary: { 
      backgroundColor: colors.primary, 
      borderRadius: layout.radius.button, 
      height: layout.heights.buttonPrimary, 
      justifyContent: 'center', 
      alignItems: 'center' 
    },
    btnPrimaryText: { 
      fontFamily: 'Inter_500Medium', 
      color: colors.onPrimary, 
      fontSize: typography.sizes.ui + 1 
    },
    trustWrap: {
      marginTop: 12,
      gap: 6,
    },
    socialProofCard: {
      marginTop: 14,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: layout.radius.card,
      backgroundColor: colors.backgroundDark,
      padding: 12,
    },
    socialProofTitle: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: typography.sizes.badge + 1,
      color: colors.text,
      marginBottom: 2,
    },
    socialProofSub: {
      fontFamily: 'Inter_400Regular',
      fontSize: typography.sizes.badge,
      color: colors.textSecondary,
      lineHeight: 16,
    },
    policyCard: {
      marginTop: 12,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: layout.radius.card,
      backgroundColor: colors.background,
      padding: 12,
      gap: 6,
    },
    policyTitle: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: typography.sizes.badge + 1,
      color: colors.text,
      marginBottom: 2,
    },
    policyText: {
      fontFamily: 'Inter_400Regular',
      fontSize: typography.sizes.badge,
      color: colors.textSecondary,
      lineHeight: 16,
    },
    legalWrap: {
      marginTop: 12,
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      justifyContent: 'center',
    },
    legalChip: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 6,
      backgroundColor: colors.backgroundDark,
    },
    legalChipText: {
      fontFamily: 'Inter_500Medium',
      fontSize: typography.sizes.badge,
      color: colors.text,
    },
    trustText: {
      fontFamily: 'Inter_400Regular',
      fontSize: typography.sizes.badge,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 16,
    },
    disclosureText: {
      fontFamily: 'Inter_400Regular',
      fontSize: typography.sizes.badge - 1,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 15,
      marginTop: 12,
      paddingHorizontal: 4,
    },
    successCard: {
      borderWidth: 1,
      borderColor: `${colors.primary}66`,
      borderRadius: layout.radius.card,
      backgroundColor: isDark ? `${colors.primary}18` : `${colors.primary}10`,
      padding: 16,
      marginBottom: 16,
      alignItems: 'center',
      gap: 8,
    },
    successTitle: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: typography.sizes.ui,
      color: colors.text,
    },
    successSub: {
      fontFamily: 'Inter_400Regular',
      fontSize: typography.sizes.badge + 1,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 18,
    },
  });

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safe}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: Platform.OS === 'android' ? 48 : 24 }} showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ alignSelf: 'flex-end', marginBottom: 8, minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' }}
          accessibilityRole="button"
          accessibilityLabel={t('close', lang)}
        >
          <Text style={{ fontSize: 22, color: colors.textSecondary }}>✕</Text>
        </TouchableOpacity>

        <Image
          source={isDark ? SPARK_LOGO_DARK : SPARK_LOGO}
          style={styles.brandLogo}
          resizeMode="contain"
          accessibilityRole="image"
          accessibilityLabel="Spark"
        />


        {paywallVariant.bannerTitleKey && (
          <View style={styles.limitBanner}>
            <Text style={styles.limitBannerTitle}>{t(paywallVariant.bannerTitleKey, lang)}</Text>
            <Text style={styles.limitBannerSub}>{t(paywallVariant.bannerSubKey, lang)}</Text>
          </View>
        )}

        <Text style={styles.paywallTitle}>{t(paywallVariant.titleKey, lang)}</Text>
        <Text style={styles.paywallSub}>{t(paywallVariant.subKey, lang)}</Text>

        <View style={styles.modelCard}>
          <Text style={styles.modelTitle}>{t('paywallModelTitle', lang)}</Text>
          <Text style={styles.modelSub}>{t('paywallModelSub', lang)}</Text>
          <View style={styles.modelRow}>
            <View style={styles.modelCol}>
              <Text style={styles.modelColTitle}>{t('paywallFreeLabel', lang)}</Text>
              <Text style={styles.modelColText}>{t('paywallFreeValue', lang)}</Text>
            </View>
            <View style={styles.modelCol}>
              <Text style={styles.modelColTitle}>{t('paywallPremiumLabel', lang)}</Text>
              <Text style={styles.modelColText}>{t('paywallPremiumValue', lang)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.whyNowCard}>
          <Text style={styles.whyNowTitle}>{t(paywallVariant.whyTitleKey, lang)}</Text>
          <Text style={styles.whyNowSub}>{t(paywallVariant.whySubKey, lang)}</Text>
          {valuePoints.map((point, idx) => (
            <View key={idx} style={styles.whyNowRow}>
              <Text style={styles.whyNowBullet}>●</Text>
              <Text style={styles.whyNowText}>{point}</Text>
            </View>
          ))}
        </View>

        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
          {plans.map((p, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.planCard, plan === i && styles.planCardSelected]}
              onPress={() => handleSelectPlan(i)}
              accessibilityRole="button"
              accessibilityLabel={`${p.name} ${p.price}${p.per}`}
              accessibilityState={{ selected: plan === i }}
            >
              {p.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>{p.badge || t('popular', lang)}</Text>
                </View>
              )}
              {!p.popular && <View style={{ height: 22 }} />}
              <Text style={[styles.planName, plan === i && { fontFamily: 'Inter_500Medium' }]}>{p.name}</Text>
              <Text style={styles.planPrice}>{p.price}</Text>
              <Text style={styles.planPer}>{p.per}</Text>
              {p.effectivePrice && <Text style={styles.planEffectivePrice}>{p.effectivePrice}</Text>}
              {p.save && <Text style={styles.planSave}>{p.save}</Text>}
              <Text style={styles.planDetail}>{p.detail}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {plans[plan]?.id === 'annual' && (
          <View style={styles.annualNudge}>
            <Text style={styles.annualNudgeText}>
              {t('paywallAnnualNudge', lang)
                .replace('{{months}}', String(ANNUAL_MONTHS_FREE))}
            </Text>
          </View>
        )}

        <View style={{ marginBottom: 20 }}>
          {features.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={styles.featCheck}>
                <Text style={{ fontSize: 10, color: colors.success }}>✓</Text>
              </View>
              <Text style={styles.featText}>{f}</Text>
            </View>
          ))}
        </View>

        {purchaseConfirmed && (
          <View style={styles.successCard} accessibilityRole="summary">
            <Text style={styles.successTitle}>{t('paywallPurchaseSuccessTitle', lang)}</Text>
            <Text style={styles.successSub}>{t('paywallPurchaseSuccessSub', lang)}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.btnPrimary, isProcessing && { opacity: 0.6 }]}
          onPress={purchaseConfirmed ? () => navigation.goBack() : handlePurchase}
          disabled={isProcessing}
          accessibilityRole="button"
          accessibilityState={{ disabled: isProcessing, busy: isProcessing }}
          accessibilityLabel={purchaseConfirmed ? t('paywallContinueCta', lang) : t('subscribe', lang)}
        >
          {isProcessing ? (
            <ActivityIndicator color={colors.onPrimary} />
          ) : (
            <Text style={styles.btnPrimaryText}>{t(purchaseConfirmed ? 'paywallContinueCta' : 'subscribe', lang)}</Text>
          )}
        </TouchableOpacity>

        {billingLive && !purchaseConfirmed && (
          <Text style={styles.disclosureText}>{autoRenewDisclosure}</Text>
        )}

        <View style={styles.trustWrap}>
          {trustPoints.map((item, idx) => (
            <Text key={idx} style={styles.trustText}>{item}</Text>
          ))}
        </View>

        <View style={styles.socialProofCard}>
          <Text style={styles.socialProofTitle}>{t('paywallSocialProofTitle', lang)}</Text>
          <Text style={styles.socialProofSub}>{t('paywallSocialProofSub', lang)}</Text>
        </View>

        <View style={styles.policyCard}>
          {billingLive ? (
            <>
              <Text style={styles.policyTitle}>{t('paywallManageTitle', lang)}</Text>
              <Text style={styles.policyText}>{t('paywallManageSub', lang)}</Text>
              <Text style={styles.policyText}>{t('paywallManageCancel', lang)}</Text>
            </>
          ) : (
            <>
              <Text style={styles.policyTitle}>{t('paywallTrialTitle', lang)}</Text>
              <Text style={styles.policyText}>{t('paywallTrialSub', lang)}</Text>
              <Text style={styles.policyText}>{t('paywallRefundText', lang)}</Text>
            </>
          )}
        </View>

        <View style={styles.legalWrap}>
          {legalLinks.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.legalChip}
              onPress={() => openLegalLink(item.url)}
              accessibilityRole="link"
              accessibilityLabel={item.label}
            >
              <Text style={styles.legalChipText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={{ marginTop: 12, alignItems: 'center', minHeight: 44, justifyContent: 'center' }}
          onPress={handleRestorePress}
          disabled={isProcessing}
          accessibilityRole="button"
          accessibilityLabel={billingLive ? t('paywallRestoreCta', lang) : t('restore', lang)}
        >
          <Text style={{ fontSize: 12, color: colors.textSecondary, fontFamily: 'Inter_400Regular' }}>
            {billingLive ? t('paywallRestoreCta', lang) : t('restore', lang)}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PaywallScreen;

import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  StatusBar, Platform, Linking, Alert, Image, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useUserData } from '../context/UserDataContext';
import { getLegalUrls } from '../constants/externalLinks';
import { t } from '../locales/i18n';
import { ANALYTICS_EVENTS, trackEvent } from '../utils/analytics';
import { revenueAttrs } from '../services/billing';
import { formatCurrency } from '../utils/locale';

const SPARK_LOGO = require('../../assets/spark_logo.png');
const SPARK_LOGO_DARK = require('../../assets/spark_logo_dark.png');

// Prices come from the store, always — never from a constant in here.
//
// A hardcoded price is wrong in every market but the one it was written for,
// and Apple/Google already return the correct localized amount and currency
// for the user's storefront. When the store hasn't answered yet (or billing
// isn't connected) we show a placeholder rather than inventing a number.
const PLAN_ORDER = ['monthly', 'yearly', 'lifetime'];
const DEFAULT_PLAN_ID = 'yearly';

const PLAN_SPECS = {
  monthly: {
    nameKey: 'planMonthly',
    perKey: 'perMo',
    detailKey: 'paywallMonthlyDetail',
  },
  yearly: {
    nameKey: 'planAnnual',
    perKey: 'perYr',
    detailKey: 'paywallAnnualDetail',
    popular: true,
    badgeKey: 'paywallAnnualBestValue',
  },
  lifetime: {
    nameKey: 'planLifetime',
    perKey: 'perLifetime',
    detailKey: 'paywallLifetimeDetail',
  },
};

const PaywallScreen = ({ navigation, route }) => {
  const { colors, typography, layout, isDark, lang } = useTheme();
  const [planId, setPlanId] = useState(DEFAULT_PLAN_ID);
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
  const isImageCardSource = paywallReason === 'image_card' || paywallSource === 'story_detail_card';
  const isOneMinuteSummarySource = paywallReason === 'one_minute_summary' || paywallSource === 'story_detail_one_minute_summary';
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

    if (isOneMinuteSummarySource) {
      return {
        bannerTitleKey: 'paywallOneMinuteTitle',
        bannerSubKey: 'paywallOneMinuteSub',
        titleKey: 'paywallOneMinuteHeroTitle',
        subKey: 'paywallOneMinuteHeroSub',
        whyTitleKey: 'paywallWhyNowOneMinuteTitle',
        whySubKey: 'paywallWhyNowOneMinuteSub',
        valueKeys: ['paywallOneMinuteValue1', 'paywallOneMinuteValue2', 'paywallOneMinuteValue3'],
      };
    }

    if (isImageCardSource) {
      return {
        bannerTitleKey: 'paywallImageCardTitle',
        bannerSubKey: 'paywallImageCardSub',
        titleKey: 'paywallImageCardHeroTitle',
        subKey: 'paywallImageCardHeroSub',
        whyTitleKey: 'paywallWhyNowImageCardTitle',
        whySubKey: 'paywallWhyNowImageCardSub',
        valueKeys: ['paywallImageCardValue1', 'paywallImageCardValue2', 'paywallImageCardValue3'],
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
  }, [isEarlyTrial, isImageCardSource, isLockedStorySource, isOneMinuteSummarySource, isProfileSource, isStorytellerSource, isStreakFreezeSource]);
  const priceUnavailable = t('paywallPriceUnavailable', lang);

  // The store's own localized price string ("49,99 €", "$49.99", "₺349") —
  // already formatted for the user's storefront, so never re-format it.
  const livePriceString = (id) =>
    livePackages?.[id]?.product?.priceString || priceUnavailable;

  // Savings %, months-free and the monthly-equivalent are all derived from the
  // LIVE store amounts. They can only be shown once both the monthly and the
  // yearly package have arrived — a percentage computed from a placeholder
  // would be a made-up claim next to a real price.
  const priceMeta = React.useMemo(() => {
    const m = livePackages?.monthly?.product;
    const y = livePackages?.yearly?.product;
    if (typeof m?.price !== 'number' || typeof y?.price !== 'number' || m.price <= 0) {
      return { savingsPct: null, monthsFree: null, monthlyEquivalent: null };
    }
    const currency = y.currencyCode || m.currencyCode;
    return {
      savingsPct: Math.max(0, Math.floor((1 - y.price / (m.price * 12)) * 100)),
      monthsFree: Math.max(0, Math.round((m.price * 12 - y.price) / m.price)),
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
        detail: t(spec.detailKey, lang),
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
  const features = [
    t('feat1', lang),
    t('feat2', lang),
    t('feat3', lang),
    t('feat4', lang),
    t('feat5', lang),
  ];
  const { buyPremium, restorePremium, getPremiumOfferings, billingLive } = useUserData();

  const valuePoints = paywallVariant.valueKeys.map((key) => t(key, lang));
  // Store-payment and restore reassurance belong on every build — they describe
  // how the purchase works, not whether this build can take one.
  const trustPoints = [
    t('paywallTrust1', lang),
    t('paywallTrust2', lang),
    t('paywallTrust3', lang),
  ];

  // App Store / Play require auto-renewable subscription terms next to the CTA.
  const autoRenewDisclosure = t('paywallAutoRenewDisclosure', lang)
    .replace('{{monthlyPrice}}', livePriceString('monthly'))
    .replace('{{annualPrice}}', livePriceString('yearly'));

  // A trial only applies to the auto-renewing plans; `lifetime` is a one-off.
  const showsTrial = billingLive && selectedPlan?.id !== 'lifetime';
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
      if (!cancelled && pkgs) setLivePackages(pkgs);
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
      color: colors.primaryText,
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
      color: colors.primaryText,
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
    trialBadgeText: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: typography.sizes.badge + 1,
      color: colors.primaryText,
      textAlign: 'center',
      marginTop: 10,
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
          accessibilityLabel="Albor"
        />


        {paywallVariant.bannerTitleKey && (
          <View style={styles.limitBanner}>
            <Text style={styles.limitBannerTitle}>{t(paywallVariant.bannerTitleKey, lang)}</Text>
            <Text style={styles.limitBannerSub}>{t(paywallVariant.bannerSubKey, lang)}</Text>
          </View>
        )}

        <Text style={styles.paywallTitle}>{t(heroTitleKey, lang)}</Text>
        <Text style={styles.paywallSub}>{t(heroSubKey, lang)}</Text>

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
          {plans.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={[styles.planCard, planId === p.id && styles.planCardSelected]}
              onPress={() => handleSelectPlan(p.id)}
              accessibilityRole="button"
              accessibilityLabel={`${p.name} ${p.price}${p.per}`}
              accessibilityState={{ selected: planId === p.id }}
            >
              {p.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>{p.badge || t('popular', lang)}</Text>
                </View>
              )}
              {!p.popular && <View style={{ height: 22 }} />}
              <Text style={[styles.planName, planId === p.id && { fontFamily: 'Inter_500Medium' }]}>{p.name}</Text>
              <Text style={styles.planPrice}>{p.price}</Text>
              <Text style={styles.planPer}>{p.per}</Text>
              {p.effectivePrice && <Text style={styles.planEffectivePrice}>{p.effectivePrice}</Text>}
              {p.save && <Text style={styles.planSave}>{p.save}</Text>}
              <Text style={styles.planDetail}>{p.detail}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedPlan?.id === 'yearly' && priceMeta.monthsFree !== null && (
          <View style={styles.annualNudge}>
            <Text style={styles.annualNudgeText}>
              {t('paywallAnnualNudge', lang)
                .replace('{{months}}', String(priceMeta.monthsFree))}
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

        {trialBadge && !purchaseConfirmed && (
          <Text style={styles.trialBadgeText}>{trialBadge}</Text>
        )}

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
          <Text style={styles.policyTitle}>{t('paywallTrialTitle', lang)}</Text>
          <Text style={styles.policyText}>{t('paywallTrialSub', lang)}</Text>
          <Text style={styles.policyText}>{t('paywallRefundText', lang)}</Text>
          {billingLive && (
            <>
              <Text style={styles.policyText}>{t('paywallManageSub', lang)}</Text>
              <Text style={styles.policyText}>{t('paywallManageCancel', lang)}</Text>
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

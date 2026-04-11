import React, { useEffect, useRef, useState } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, StyleSheet, 
  StatusBar, Platform, Linking, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useUserData } from '../context/UserDataContext';
import { t } from '../locales/i18n';
import { ANALYTICS_EVENTS, trackEvent } from '../utils/analytics';

const PaywallScreen = ({ navigation, route }) => {
  const { colors, typography, layout, isDark, lang } = useTheme();
  const [plan, setPlan] = useState(1);
  const isFreeLimitReached = route?.params?.reason === 'free_limit_reached';
  const paywallSource = route?.params?.source || 'direct';
  const hasTrackedViewRef = useRef(false);
  const plans = [
    { name: t('planMonthly', lang), price: '49₺', per: t('perMo', lang), save: null },
    { name: t('planAnnual', lang), price: '349₺', per: t('perYr', lang), save: t('save40', lang), popular: true },
  ];
  const features = [
    t('feat1', lang),
    t('feat2', lang),
    t('feat3', lang),
    t('feat4', lang),
    t('feat5', lang),
  ];
  const valuePoints = [
    t('paywallValue1', lang),
    t('paywallValue2', lang),
    t('paywallValue3', lang),
  ];
  const trustPoints = [
    t('paywallTrust1', lang),
    t('paywallTrust2', lang),
    t('paywallTrust3', lang),
  ];

  const { buyPremium } = useUserData();

  const legalLinks = [
    { label: t('paywallLegalPrivacy', lang), url: 'https://sparkapp.co/privacy' },
    { label: t('paywallLegalTerms', lang), url: 'https://sparkapp.co/terms' },
    { label: t('paywallLegalRefund', lang), url: 'https://sparkapp.co/refund' },
  ];

  const handleSelectPlan = (nextPlan) => {
    if (nextPlan === plan) return;

    trackEvent(ANALYTICS_EVENTS.PAYWALL_PLAN_SELECTED, {
      previousPlan: plans[plan]?.name,
      selectedPlan: plans[nextPlan]?.name,
      selectedPrice: plans[nextPlan]?.price,
      source: paywallSource,
      reason: route?.params?.reason || 'none',
      lang,
    });

    setPlan(nextPlan);
  };

  useEffect(() => {
    if (hasTrackedViewRef.current) return;
    hasTrackedViewRef.current = true;

    trackEvent(ANALYTICS_EVENTS.PAYWALL_VIEWED, {
      reason: route?.params?.reason || 'none',
      source: paywallSource,
      selectedPlan: plans[plan]?.name,
      lang,
    });

    if (isFreeLimitReached) {
      trackEvent(ANALYTICS_EVENTS.FREE_LIMIT_TO_PAYWALL, {
        source: paywallSource,
        selectedPlan: plans[plan]?.name,
        lang,
      });
    }
  }, [isFreeLimitReached, lang, paywallSource, plan, plans, route?.params?.reason]);

  const handlePurchase = async () => {
    const selectedPlan = plans[plan];
    await trackEvent(ANALYTICS_EVENTS.PAYWALL_PURCHASE_STARTED, {
      selectedPlan: selectedPlan?.name,
      selectedPrice: selectedPlan?.price,
      source: paywallSource,
      reason: route?.params?.reason || 'none',
      lang,
    });

    const success = await buyPremium();
    if (success) {
      await trackEvent(ANALYTICS_EVENTS.PAYWALL_PURCHASE_SUCCEEDED, {
        selectedPlan: selectedPlan?.name,
        selectedPrice: selectedPlan?.price,
        source: paywallSource,
        reason: route?.params?.reason || 'none',
        lang,
      });
      navigation.goBack();
      return;
    }

    await trackEvent(ANALYTICS_EVENTS.PAYWALL_PURCHASE_FAILED, {
      selectedPlan: selectedPlan?.name,
      selectedPrice: selectedPlan?.price,
      source: paywallSource,
      reason: route?.params?.reason || 'none',
      lang,
      failureReason: 'buy_premium_returned_false',
    });
    Alert.alert(t('alert_error', lang), t('paywallPurchaseFailed', lang));
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

  const styles = StyleSheet.create({
    safe: { 
      flex: 1, 
      backgroundColor: colors.background
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
      borderColor: colors.primary 
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
  });

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safe}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: Platform.OS === 'android' ? 48 : 24 }} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ alignSelf: 'flex-end', marginBottom: 8 }}>
          <Text style={{ fontSize: 22, color: colors.textSecondary }}>✕</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 44, textAlign: 'center', marginBottom: 12, color: colors.primary }}>✦</Text>

        {isFreeLimitReached && (
          <View style={styles.limitBanner}>
            <Text style={styles.limitBannerTitle}>{t('paywallLimitReachedTitle', lang)}</Text>
            <Text style={styles.limitBannerSub}>{t('paywallLimitReachedSub', lang)}</Text>
          </View>
        )}

        <Text style={styles.paywallTitle}>{t('paywallTitle', lang)}</Text>
        <Text style={styles.paywallSub}>{t('paywallSub', lang)}</Text>

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
          <Text style={styles.whyNowTitle}>{t('paywallWhyNowTitle', lang)}</Text>
          <Text style={styles.whyNowSub}>{t('paywallWhyNowSub', lang)}</Text>
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
            >
              {p.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>{t('popular', lang)}</Text>
                </View>
              )}
              {!p.popular && <View style={{ height: 22 }} />}
              <Text style={[styles.planName, plan === i && { fontFamily: 'Inter_500Medium' }]}>{p.name}</Text>
              <Text style={styles.planPrice}>{p.price}</Text>
              <Text style={styles.planPer}>{p.per}</Text>
              {p.save && <Text style={styles.planSave}>{p.save}</Text>}
            </TouchableOpacity>
          ))}
        </View>

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

        <TouchableOpacity style={styles.btnPrimary} onPress={handlePurchase}>
          <Text style={styles.btnPrimaryText}>{t('subscribe', lang)}</Text>
        </TouchableOpacity>
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
        </View>

        <View style={styles.legalWrap}>
          {legalLinks.map((item) => (
            <TouchableOpacity key={item.label} style={styles.legalChip} onPress={() => openLegalLink(item.url)}>
              <Text style={styles.legalChipText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={{ marginTop: 12, alignItems: 'center' }}>
          <Text style={{ fontSize: 12, color: colors.textSecondary, fontFamily: 'Inter_400Regular' }}>{t('restore', lang)}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PaywallScreen;

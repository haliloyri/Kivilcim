/**
 * AdOrPremiumSheet
 *
 * Bottom-sheet modal shown at every "gated content" point for free users.
 * Presents two choices:
 *   1. Watch a rewarded ad → unlock content
 *   2. Go Premium → navigate to PaywallScreen (unlimited, ad-free)
 *
 * Props:
 *   visible        {boolean}
 *   onClose        {function}
 *   onWatchAd      {function}  — called when user taps "Watch Ad"; parent handles ad logic
 *   onGoPremium    {function}  — called when user taps "Go Premium"
 *   title          {string}    — e.g. t('adSheetTitle', lang)
 *   subtitle       {string}    — optional context line
 *   watchAdLabel   {string}    — override button label
 *   adUnavailable  {boolean}   — show not-ready fallback copy after a failed ad load
 *   isAdLoading    {boolean}   — show spinner on Watch Ad button while ad preloads
 *   lang           {string}
 */
import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { t } from '../locales/i18n';

const AdOrPremiumSheet = ({
  visible,
  onClose,
  onWatchAd,
  onGoPremium,
  title,
  subtitle,
  watchAdLabel,
  adUnavailable = false,
  isAdLoading = false,
  lang = 'tr',
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const resolvedTitle    = title    || t('adSheetTitle', lang);
  const resolvedSubtitle = subtitle || t('adSheetSubtitle', lang);
  const resolvedWatchLabel = watchAdLabel || (adUnavailable ? t('adTryAgainLater', lang) : t('adWatchCta', lang));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      {/* Dimmed backdrop — tap to dismiss */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <View style={styles.sheet}>
        {/* Drag handle */}
        <View style={styles.handle} />

        {/* Close button */}
        <TouchableOpacity style={styles.closeBtn} onPress={onClose} hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}>
          <Ionicons name="close" size={22} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* Lock icon */}
        <View style={styles.iconRow}>
          <View style={styles.iconCircle}>
            <Ionicons name="lock-closed" size={28} color={colors.primary} />
          </View>
        </View>

        {/* Title & subtitle */}
        <Text style={styles.title}>{resolvedTitle}</Text>
        {resolvedSubtitle ? (
          <Text style={styles.subtitle}>{resolvedSubtitle}</Text>
        ) : null}

        {/* Divider */}
        <View style={styles.divider} />

        {/* CTA 1 — Watch Ad */}
        <TouchableOpacity
          style={[styles.watchAdBtn, isAdLoading && styles.watchAdBtnDisabled]}
          onPress={onWatchAd}
          disabled={isAdLoading}
          activeOpacity={0.8}
        >
          {isAdLoading ? (
            <ActivityIndicator size="small" color={colors.onPrimary} />
          ) : (
            <Ionicons name="play-circle-outline" size={22} color={colors.onPrimary} style={styles.btnIcon} />
          )}
          <Text style={styles.watchAdLabel}>{resolvedWatchLabel}</Text>
        </TouchableOpacity>

        <Text style={styles.watchAdHint}>{adUnavailable ? t('adNotReady', lang) : t('adWatchSubtitle', lang)}</Text>

        {/* Separator */}
        <View style={styles.separatorRow}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorText}>{t('adOrLabel', lang)}</Text>
          <View style={styles.separatorLine} />
        </View>

        {/* CTA 2 — Go Premium */}
        <TouchableOpacity
          style={styles.premiumBtn}
          onPress={onGoPremium}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[colors.ctaGradientStart, colors.ctaGradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.premiumBtnGradient}
          >
            <Ionicons name="star" size={20} color={colors.onPrimary} style={styles.btnIcon} />
            <Text style={styles.premiumBtnLabel}>{t('premiumUpgradeCta', lang)}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.premiumHint}>{t('premiumUpgradeSubtitle', lang)}</Text>

        <View style={styles.bottomSpacer} />
      </View>
    </Modal>
  );
};

const makeStyles = (colors) => StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  sheet: {
    backgroundColor: colors.surfaceContainerLowest,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 0,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginBottom: 12,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 20,
    zIndex: 10,
  },
  iconRow: {
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 4,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.backgroundDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 4,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 20,
  },
  watchAdBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundDark,
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  watchAdBtnDisabled: {
    opacity: 0.6,
  },
  watchAdLabel: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text,
  },
  watchAdHint: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  separatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  separatorText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: colors.textSecondary,
    marginHorizontal: 12,
  },
  premiumBtn: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  premiumBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 24,
  },
  premiumBtnLabel: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: colors.onPrimary,
  },
  premiumHint: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  btnIcon: {
    marginRight: 8,
  },
  bottomSpacer: {
    height: 32,
  },
});

export default AdOrPremiumSheet;

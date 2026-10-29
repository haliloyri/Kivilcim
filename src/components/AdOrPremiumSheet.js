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
 *
 * Layout follows design/limit-doldu-uzun.html: message, daily-quota strip,
 * Premium hero (the single primary action), then the ad option.
 * The quota strip only shows for the default "daily limit" title.
 */
import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { t } from '../locales/i18n';
import { preloadRewarded } from '../utils/ads';
import { FREE_DAILY_STORY_QUOTA } from '../utils/freeQuota';

const HERO_TEXT = '#F5F1E8';
const HERO_COPY = '#D5E4E0';
const HERO_PERK = '#E6EFEC';
const ON_DAWN = '#2A1E08';

const HeroSun = ({ color }) => (
  <Svg width={168} height={130} viewBox="0 0 168 130" style={styles.sun} pointerEvents="none">
    <Circle cx={96} cy={104} r={84} fill={color} opacity={0.08} />
    <Circle cx={96} cy={104} r={62} fill={color} opacity={0.14} />
    <Circle cx={96} cy={104} r={40} fill={color} opacity={0.95} />
    {[[96, 40, 96, 22], [60, 52, 50, 40], [132, 52, 142, 40], [40, 78, 24, 72], [152, 78, 168, 72]].map(([x1, y1, x2, y2], i) => (
      <Line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={3} strokeLinecap="round" opacity={0.85} />
    ))}
  </Svg>
);

const AdOrPremiumSheet = ({
  visible,
  onClose,
  onDismiss,
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
  const cs = makeStyles(colors);

  // Start fetching the ad as soon as the sheet appears, so it is usually ready
  // by the time the user taps "Watch ad".
  React.useEffect(() => {
    if (visible) preloadRewarded();
  }, [visible]);

  const isLimit = !title;
  const resolvedTitle    = title    || t('adSheetTitle', lang);
  const resolvedSubtitle = subtitle || t('adSheetSubtitle', lang);
  const resolvedWatchLabel = watchAdLabel || (adUnavailable ? t('adTryAgainLater', lang) : t('adWatchCta', lang));
  const perks = ['adSheetPerk1', 'adSheetPerk2', 'adSheetPerk3'];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
      onDismiss={onDismiss}
    >
      <View style={cs.container}>
        {/* Dimmed backdrop — tap to dismiss */}
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={cs.backdrop} />
        </TouchableWithoutFeedback>

        <View style={cs.sheet}>
          <View style={cs.handle} />
          <TouchableOpacity
            style={cs.closeBtn}
            onPress={onClose}
            accessibilityRole="button"
            hitSlop={{ top: 4, right: 4, bottom: 4, left: 4 }}
          >
            <Ionicons name="close" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <ScrollView contentContainerStyle={cs.scroll} showsVerticalScrollIndicator={false} bounces={false}>
            {/* 1 · Message */}
            <View style={cs.msg}>
              <View style={cs.iconCircle}>
                <Ionicons name="moon" size={28} color={colors.primaryText} />
              </View>
              {isLimit ? <Text style={cs.eyebrow}>{t('adSheetEyebrow', lang)}</Text> : null}
              <Text style={cs.title}>{resolvedTitle}</Text>
              {resolvedSubtitle ? <Text style={cs.subtitle}>{resolvedSubtitle}</Text> : null}
            </View>

            {/* 2 · Daily quota strip */}
            {isLimit ? (
              <View style={cs.strip}>
                <View style={cs.stripRow}>
                  <Text style={cs.stripText}>
                    {t('adSheetQuota', lang, { used: FREE_DAILY_STORY_QUOTA, total: FREE_DAILY_STORY_QUOTA })}
                  </Text>
                  <View style={cs.resetRow}>
                    <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                    <Text style={cs.resetText}>{t('adSheetReset', lang)}</Text>
                  </View>
                </View>
                <View style={cs.segs}>
                  {Array.from({ length: FREE_DAILY_STORY_QUOTA }).map((_, i) => (
                    <View key={i} style={cs.seg} />
                  ))}
                </View>
              </View>
            ) : null}

            {/* 3 · Premium hero — the single primary action */}
            <View style={cs.hero}>
              <HeroSun color={colors.dawn} />
              <Text style={cs.heroEyebrow}>Albor Premium</Text>
              <Text style={cs.heroTitle}>{t('adSheetPremiumTitle', lang)}</Text>
              <Text style={cs.heroCopy}>{t('premiumUpgradeSubtitle', lang)}</Text>
              <View style={cs.perks}>
                {perks.map((k) => (
                  <View key={k} style={cs.perk}>
                    <Ionicons name="checkmark" size={16} color={colors.dawn} />
                    <Text style={cs.perkText}>{t(k, lang)}</Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity style={cs.cta} onPress={onGoPremium} activeOpacity={0.85} accessibilityRole="button">
                <Ionicons name="star-outline" size={18} color={ON_DAWN} style={cs.btnIcon} />
                <Text style={cs.ctaLabel}>{t('premiumUpgradeCta', lang)}</Text>
              </TouchableOpacity>
            </View>

            {/* 4 · or */}
            <View style={cs.orRow}>
              <View style={cs.orLine} />
              <Text style={cs.orText}>{t('adOrLabel', lang)}</Text>
              <View style={cs.orLine} />
            </View>

            {/* 5 · Watch ad — secondary */}
            <View style={cs.adCard}>
              <TouchableOpacity
                style={[cs.adBtn, adUnavailable && cs.adBtnOff, isAdLoading && cs.adBtnLoading]}
                onPress={onWatchAd}
                disabled={isAdLoading}
                activeOpacity={0.8}
                accessibilityRole="button"
              >
                {isAdLoading ? (
                  <ActivityIndicator size="small" color={colors.primaryText} />
                ) : (
                  <Ionicons
                    name="play-circle-outline"
                    size={22}
                    color={adUnavailable ? colors.mutedText : colors.primaryText}
                  />
                )}
                <Text style={[cs.adLabel, adUnavailable && cs.adLabelOff]}>{resolvedWatchLabel}</Text>
              </TouchableOpacity>
              <Text style={cs.adHint}>{adUnavailable ? t('adNotReady', lang) : t('adWatchSubtitle', lang)}</Text>
            </View>

            {/* 6 · Footer */}
            <TouchableOpacity style={cs.later} onPress={onClose} accessibilityRole="button">
              <Text style={cs.laterText}>{t('adSheetLater', lang)}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  sun: { position: 'absolute', right: -34, top: -30, transform: [{ scaleY: -1 }] },
});

const makeStyles = (colors) => StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.modalOverlay },
  sheet: {
    maxHeight: '94%',
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
  closeBtn: {
    position: 'absolute',
    top: 8,
    right: 16,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardBackground,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  scroll: { paddingHorizontal: 20, paddingTop: 36, paddingBottom: 28 },
  msg: { alignItems: 'center' },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryContainer,
  },
  eyebrow: {
    marginTop: 18,
    fontSize: 12,
    letterSpacing: 1,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase',
    color: colors.dawnText,
  },
  title: {
    marginTop: 8,
    fontSize: 28,
    lineHeight: 33,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 12,
    maxWidth: 320,
    fontSize: 15,
    lineHeight: 22,
    fontFamily: 'Inter_400Regular',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  strip: {
    marginTop: 24,
    padding: 16,
    borderRadius: 18,
    backgroundColor: colors.cardBackground,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  stripRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  stripText: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: colors.text },
  resetRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  resetText: { fontSize: 13, fontFamily: 'Inter_400Regular', color: colors.textSecondary },
  segs: { flexDirection: 'row', gap: 6, marginTop: 12 },
  seg: { flex: 1, height: 6, borderRadius: 3, backgroundColor: colors.primary },
  hero: {
    marginTop: 20,
    padding: 20,
    paddingTop: 22,
    borderRadius: 24,
    backgroundColor: colors.heroSurface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.heroBorder,
    overflow: 'hidden',
  },
  heroEyebrow: {
    fontSize: 12,
    letterSpacing: 1,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase',
    color: colors.dawn,
  },
  heroTitle: {
    marginTop: 10,
    marginBottom: 6,
    maxWidth: '66%',
    fontSize: 26,
    lineHeight: 30,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: HERO_TEXT,
  },
  heroCopy: {
    maxWidth: '86%',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Inter_400Regular',
    color: HERO_COPY,
  },
  perks: { marginTop: 16, gap: 10 },
  perk: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  perkText: { fontSize: 14, fontFamily: 'Inter_400Regular', color: HERO_PERK },
  cta: {
    marginTop: 20,
    minHeight: 52,
    borderRadius: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dawn,
  },
  ctaLabel: { fontSize: 16, fontFamily: 'Inter_700Bold', color: ON_DAWN },
  btnIcon: { marginRight: 8 },
  orRow: { flexDirection: 'row', alignItems: 'center', marginTop: 22, marginHorizontal: 20 },
  orLine: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: colors.border },
  orText: { marginHorizontal: 12, fontSize: 12, fontFamily: 'Inter_400Regular', color: colors.textSecondary },
  adCard: {
    marginTop: 18,
    padding: 16,
    borderRadius: 18,
    backgroundColor: colors.cardBackground,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  adBtn: {
    minHeight: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  adBtnOff: { borderColor: colors.border },
  adBtnLoading: { opacity: 0.6 },
  adLabel: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: colors.primaryText },
  adLabelOff: { color: colors.mutedText },
  adHint: {
    marginTop: 10,
    fontSize: 12,
    lineHeight: 17,
    fontFamily: 'Inter_400Regular',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  later: { alignSelf: 'center', minHeight: 44, justifyContent: 'center', marginTop: 10 },
  laterText: { fontSize: 14, fontFamily: 'Inter_500Medium', color: colors.textSecondary },
});

export default AdOrPremiumSheet;

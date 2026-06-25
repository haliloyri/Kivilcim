/**
 * MicroVariantCard
 *
 * A single variant card in the "Sohbette Kullan" screen.
 *
 * PUNCHLINE is always expanded (no accordion chrome).
 * THIRTY_SEC / QUESTION / ONE_WORD have a collapse-able accordion.
 *
 * Props:
 *   variant         – { id, type, title, body, toneTag?, useCaseTag? }
 *   isExpanded      – accordion state (parent manages it)
 *   isSelected      – border highlight when this card was last touched
 *   isCopied        – shows ✓ checkmark for 2 s after copy
 *   isMarkedUsed    – toggle state
 *   onToggle()      – called when the header row is pressed
 *   onCopy()        – called when the Copy button is pressed
 *   onSharePlatform(platform) – platform: 'x'|'threads'|'linkedin'|'whatsapp'|'instagram'|'native'
 *   onMarkUsed()    – single-tap toggle
 *   onStoryteller() – open storyteller overlay
 *   colors / typography / layout / isDark / lang  – from ThemeContext
 */
import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { t } from '../locales/i18n';
import { readableTextOn } from '../theme/theme';

// ─── constants ───────────────────────────────────────────────────────────────

/** Accent colour per variant type */
const TYPE_ACCENT = {
  ONE_LINER: '#5B8DEF',
  THIRTY_SEC: '#E8A838',
  PUNCHLINE: '#D06A1B',
  QUESTION: '#7C6EAA',
  ONE_WORD: '#44A882',
};

/** Icon per variant type */
const TYPE_ICON = {
  ONE_LINER: 'flash-outline',
  THIRTY_SEC: 'time-outline',
  PUNCHLINE: 'flame-outline',
  QUESTION: 'help-circle-outline',
  ONE_WORD: 'key-outline',
};

/**
 * Types that skip the accordion and always show their body.
 * The header is still tappable so it marks the card as "selected".
 */
const ALWAYS_EXPANDED_TYPES = new Set(['PUNCHLINE']);

/** Platform pills config (order matters for display) */
const PLATFORMS = [
  { key: 'x',        icon: 'logo-twitter',    i18nKey: 'mv_share_on_x' },
  { key: 'threads',  icon: 'at-circle-outline', i18nKey: 'mv_share_on_threads' },
  { key: 'linkedin', icon: 'logo-linkedin',   i18nKey: 'mv_share_on_linkedin' },
  { key: 'whatsapp', icon: 'logo-whatsapp',   i18nKey: 'mv_share_on_whatsapp' },
  { key: 'instagram',icon: 'logo-instagram',  i18nKey: 'mv_share_on_instagram' },
  { key: 'native',   icon: 'share-social-outline', i18nKey: 'mv_share_native' },
];

// ─── component ───────────────────────────────────────────────────────────────

const MicroVariantCard = ({
  variant,
  isExpanded,
  isSelected,
  isCopied,
  isMarkedUsed,
  locked,
  onToggle,
  onCopy,
  onSharePlatform,
  onMarkUsed,
  onStoryteller,
  onPremiumTap,
  colors,
  typography,
  layout,
  isDark,
  lang,
}) => {
  const accent = TYPE_ACCENT[variant.type] ?? colors.primary;
  const iconName = TYPE_ICON[variant.type] ?? 'chatbox-outline';
  const alwaysExpanded = ALWAYS_EXPANDED_TYPES.has(variant.type);
  const bodyVisible = alwaysExpanded || isExpanded;

  const handleLongPress = useCallback(async () => {
    if (!alwaysExpanded) return;
    try {
      const Haptics = require('expo-haptics');
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (_) {}
    onCopy();
  }, [alwaysExpanded, onCopy]);

  const styles = buildStyles(colors, typography, layout, isDark, accent, isSelected);

  return (
    <View style={styles.card} accessible={false}>

      {/* ── Header row (tappable) ────────────────────────────────────── */}
      <TouchableOpacity
        style={styles.header}
        onPress={onToggle}
        onLongPress={alwaysExpanded ? handleLongPress : undefined}
        delayLongPress={380}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={variant.title}
        accessibilityState={alwaysExpanded ? undefined : { expanded: isExpanded }}
      >
        <View style={styles.headerLeft}>
          {/* Coloured icon badge */}
          <View style={[styles.iconCircle, { backgroundColor: `${accent}22` }]}>
            <Ionicons name={iconName} size={15} color={accent} />
          </View>

          <View style={styles.headerText}>
            <Text style={styles.variantTitle}>{variant.title}</Text>
            {variant.useCaseTag ? (
              <Text style={styles.toneTag}>{variant.useCaseTag}</Text>
            ) : variant.toneTag ? (
              <Text style={styles.toneTag}>{variant.toneTag}</Text>
            ) : null}
          </View>
        </View>

        {/* Chevron */}
        {!alwaysExpanded ? (
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={colors.textSecondary}
          />
        ) : null}
      </TouchableOpacity>

      {/* ── Body + Actions ───────────────────────────────────────────── */}
      {bodyVisible && (
        <>
          <View style={styles.divider} />

          <Text style={styles.body}>{variant.body}</Text>

          {/* Platform share pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pillsRow}
          >
            {PLATFORMS.map(p => (
              <TouchableOpacity
                key={p.key}
                style={styles.platformPill}
                onPress={() => onSharePlatform(p.key)}
                accessibilityRole="button"
                accessibilityLabel={t(p.i18nKey, lang)}
              >
                <Ionicons name={p.icon} size={13} color={accent} />
                <Text style={[styles.pillText, { color: accent }]}>{t(p.i18nKey, lang)}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.actionsContainer}>
            <View style={styles.actions}>
              {/* Copy button */}
              <TouchableOpacity
                style={[styles.actionBtn, styles.actionBtnFlex, isCopied && { backgroundColor: accent, borderColor: accent }]}
                onPress={onCopy}
                accessibilityRole="button"
                accessibilityLabel={isCopied ? t('mv_copied', lang) : t('mv_copy', lang)}
              >
                <Ionicons
                  name={isCopied ? 'checkmark' : 'copy-outline'}
                  size={15}
                  color={isCopied ? readableTextOn(accent) : colors.text}
                />
                <Text style={[styles.actionBtnText, isCopied && { color: readableTextOn(accent) }]}>
                  {isCopied ? t('mv_copied', lang) : t('mv_copy', lang)}
                </Text>
              </TouchableOpacity>

              {/* Storyteller button */}
              <TouchableOpacity
                style={[styles.actionBtn, styles.actionBtnFlex]}
                onPress={onStoryteller}
                accessibilityRole="button"
                accessibilityLabel={t('mv_storyteller_cta', lang)}
              >
                <Text style={{ fontSize: 14 }}>🎤</Text>
                <Text style={styles.actionBtnText}>{t('mv_storyteller_cta', lang)}</Text>
              </TouchableOpacity>
            </View>

            {/* Mark as Used toggle */}
            <TouchableOpacity
              style={[
                styles.markUsedBtn,
                isMarkedUsed
                  ? { borderColor: colors.primary, backgroundColor: isDark ? 'transparent' : `${colors.primary}15` }
                  : { borderColor: `${accent}66`, backgroundColor: isDark ? colors.backgroundDark : 'transparent' },
              ]}
              onPress={onMarkUsed}
              accessibilityRole="button"
              accessibilityLabel={t('mv_mark_used', lang)}
            >
              {isMarkedUsed && <Ionicons name="checkmark" size={16} color={colors.primary} />}
              <Text style={[styles.actionBtnText, { color: isMarkedUsed ? colors.primary : accent }]}>
                {t('mv_mark_used', lang)}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

// ─── styles ──────────────────────────────────────────────────────────────────

const buildStyles = (colors, typography, layout, isDark, accent, isSelected) =>
  StyleSheet.create({
    card: {
      backgroundColor: isDark ? colors.backgroundDark : '#FFFFFF',
      borderRadius: layout.radius.card,
      marginBottom: 12,
      // Highlight selected card with accent colour border
      borderWidth: 1.5,
      borderColor: isSelected ? accent : colors.border,
      overflow: 'hidden',
      // Subtle shadow on light mode
      shadowColor: '#000',
      shadowOpacity: isDark ? 0 : 0.05,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: isDark ? 0 : 2,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 13,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      gap: 12,
    },
    iconCircle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerText: {
      flex: 1,
    },
    variantTitle: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 14,
      color: colors.text,
    },
    toneTag: {
      fontFamily: 'Inter_400Regular',
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 2,
    },
    contextRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
      paddingHorizontal: 16,
      paddingBottom: 10,
    },
    contextTag: {
      borderWidth: 1,
      borderRadius: 999,
      paddingHorizontal: 8,
      paddingVertical: 3,
    },
    contextTagText: {
      fontFamily: 'Inter_500Medium',
      fontSize: 10,
      letterSpacing: 0.3,
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.border,
    },
    body: {
      fontFamily: 'Inter_400Regular',
      fontSize: typography.sizes.body,
      color: colors.text,
      lineHeight: 26,
      paddingHorizontal: 16,
      paddingTop: 14,
      paddingBottom: 10,
    },
    actionsContainer: {
      paddingHorizontal: 16,
      paddingBottom: 14,
      gap: 8,
    },
    actions: {
      flexDirection: 'row',
      gap: 8,
    },
    pillsRow: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      gap: 6,
      flexDirection: 'row',
    },
    platformPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: `${accent}44`,
      backgroundColor: `${accent}0D`,
    },
    pillText: {
      fontFamily: 'Inter_500Medium',
      fontSize: 11,
    },
    actionBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: 20,
      backgroundColor: isDark ? '#2A2520' : '#F0EAE1',
      borderWidth: 1,
      borderColor: colors.border,
    },
    actionBtnFlex: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 12,
    },
    markUsedBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      alignSelf: 'flex-end',
    },
    actionBtnText: {
      fontFamily: 'Inter_500Medium',
      fontSize: 12,
      color: colors.text,
    },
  });

export default MicroVariantCard;

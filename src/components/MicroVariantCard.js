/**
 * MicroVariantCard
 *
 * A single variant card in the "Sohbette Kullan" screen.
 *
 * ONE_LINER / PUNCHLINE / ONE_WORD are always expanded (no accordion chrome).
 * THIRTY_SEC / QUESTION have a collapse-able accordion.
 *
 * Props:
 *   variant        – { id, type, title, body, toneTag? }
 *   isExpanded     – accordion state (parent manages it)
 *   isSelected     – border highlight when this card was last touched
 *   isCopied       – shows ✓ checkmark for 2 s after copy
 *   onToggle()     – called when the header row is pressed
 *   onCopy()       – called when the Copy button is pressed
 *   onShare()      – called when the Share button is pressed
 *   colors / typography / layout / isDark / lang  – from ThemeContext
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { t } from '../locales/i18n';

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
const ALWAYS_EXPANDED_TYPES = new Set(['ONE_LINER', 'PUNCHLINE', 'ONE_WORD']);

// ─── component ───────────────────────────────────────────────────────────────

const MicroVariantCard = ({
  variant,
  isExpanded,
  isSelected,
  isCopied,
  onToggle,
  onCopy,
  onShare,
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

  const styles = buildStyles(colors, typography, layout, isDark, accent, isSelected);

  return (
    <View style={styles.card} accessible={false}>

      {/* ── Header row (tappable) ────────────────────────────────────── */}
      <TouchableOpacity
        style={styles.header}
        onPress={onToggle}
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
            {variant.toneTag ? (
              <Text style={styles.toneTag}>{variant.toneTag}</Text>
            ) : null}
          </View>
        </View>

        {/* Context usage tags */}
        {variant.contextTags && variant.contextTags.length > 0 && (
          <View style={styles.contextRow}>
            {variant.contextTags.map((tag) => (
              <View key={tag} style={[styles.contextTag, { borderColor: `${accent}55`, backgroundColor: `${accent}12` }]}>
                <Text style={[styles.contextTagText, { color: accent }]}>{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Chevron — only shown on accordion types */}
        {!alwaysExpanded && (
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={colors.textSecondary}
          />
        )}
      </TouchableOpacity>

      {/* ── Body + Actions ───────────────────────────────────────────── */}
      {bodyVisible && (
        <>
          <View style={styles.divider} />

          <Text style={styles.body}>{variant.body}</Text>

          <View style={styles.actions}>
            {/* Copy button */}
            <TouchableOpacity
              style={[styles.actionBtn, isCopied && { backgroundColor: accent, borderColor: accent }]}
              onPress={onCopy}
              accessibilityRole="button"
              accessibilityLabel={isCopied ? t('mv_copied', lang) : t('mv_copy', lang)}
            >
              <Ionicons
                name={isCopied ? 'checkmark' : 'copy-outline'}
                size={13}
                color={isCopied ? '#fff' : colors.text}
              />
              <Text style={[styles.actionBtnText, isCopied && { color: '#fff' }]}>
                {isCopied ? t('mv_copied', lang) : t('mv_copy', lang)}
              </Text>
            </TouchableOpacity>

            {/* Share button */}
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={onShare}
              accessibilityRole="button"
              accessibilityLabel={t('shareBtn', lang)}
            >
              <Ionicons name="share-social-outline" size={13} color={colors.text} />
              <Text style={styles.actionBtnText}>{t('shareBtn', lang)}</Text>
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
    actions: {
      flexDirection: 'row',
      gap: 8,
      paddingHorizontal: 16,
      paddingBottom: 14,
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
    actionBtnText: {
      fontFamily: 'Inter_500Medium',
      fontSize: 12,
      color: colors.text,
    },
  });

export default MicroVariantCard;

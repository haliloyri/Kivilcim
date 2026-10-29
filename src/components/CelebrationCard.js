import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { t } from '../locales/i18n';

// DESIGN.md: petrol band + dawn sun on top, paper body below. Gold only for light/reward.
const ON_DAWN = '#2A1E08';
const BAND_H = 142;
const EMBLEM = 116;
const DOTS = [[34, 30, 7], [74, 18, 5], [112, 46, 7], [20, 78, 5], [150, 26, 7], [62, 64, 5]];

const Sun = ({ color }) => (
  <Svg width={168} height={130} viewBox="0 0 168 130" style={styles.sun} pointerEvents="none">
    <Circle cx={96} cy={26} r={84} fill={color} opacity={0.08} />
    <Circle cx={96} cy={26} r={62} fill={color} opacity={0.14} />
    <Circle cx={96} cy={26} r={40} fill={color} opacity={0.95} />
    {[[96, 90, 96, 108], [60, 78, 50, 90], [132, 78, 142, 90], [40, 52, 24, 58], [152, 52, 168, 58]].map(([x1, y1, x2, y2], i) => (
      <Line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={3} strokeLinecap="round" opacity={0.85} />
    ))}
  </Svg>
);

/**
 * Shared celebration modal card (badge earned, title promotion, milestones).
 *
 * `emblem` is rendered inside a 116 pt paper-ringed circle that overlaps the band.
 * `locked` swaps the petrol band for a neutral one with no sun.
 * `bandChildren` lets a caller animate its own confetti inside the band.
 */
export const CelebrationCard = ({
  locked = false,
  emblem,
  emblemStyle,
  kicker,
  title,
  subtitle,
  description,
  onClose,
  closeLabel,
  bandChildren,
  stats,
  children,
  actions,
}) => {
  const { colors, lang } = useTheme();
  const bandBg = locked ? colors.surfaceContainerHigh : colors.heroSurface;
  return (
    <View style={[styles.card, { backgroundColor: colors.modalSurface, borderColor: colors.border }]}>
      <View style={[styles.band, { backgroundColor: bandBg }]}>
        {locked ? null : <Sun color={colors.dawn} />}
        {locked ? null : bandChildren || DOTS.map(([left, top, size], i) => (
          <View
            key={i}
            style={{
              position: 'absolute', left, top, width: size, height: size,
              borderRadius: i % 2 ? size / 2 : 2,
              backgroundColor: i % 2 ? '#F5F1E8' : colors.dawn,
              opacity: i % 2 ? 0.55 : 0.8,
            }}
          />
        ))}
      </View>
      {onClose ? (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={closeLabel || t('career.close', lang)}
          onPress={onClose}
          style={[
            styles.close,
            locked
              ? { backgroundColor: colors.cardBackground, borderColor: colors.border, borderWidth: StyleSheet.hairlineWidth }
              : { backgroundColor: 'rgba(255,255,255,0.14)' },
          ]}
        >
          <Ionicons name="close" size={20} color={locked ? colors.text : '#F5F1E8'} />
        </TouchableOpacity>
      ) : null}
      <View
        style={[
          styles.emblem,
          { backgroundColor: colors.modalSurface, borderColor: `${colors.dawn}8C` },
          emblemStyle,
        ]}
      >
        {emblem}
      </View>
      <View style={styles.body}>
        {kicker ? <Text style={[styles.kicker, { color: locked ? colors.textSecondary : colors.dawnText }]}>{kicker}</Text> : null}
        {title ? <Text accessibilityRole="header" style={[styles.title, { color: colors.text }]}>{title}</Text> : null}
        {subtitle ? <Text style={[styles.subtitle, { color: colors.primaryText }]}>{subtitle}</Text> : null}
        {description ? <Text style={[styles.desc, { color: colors.textSecondary }]}>{description}</Text> : null}
        {stats ? <CelebrationStats items={stats} /> : null}
        {children}
        {actions ? <View style={styles.actions}>{actions}</View> : null}
      </View>
    </View>
  );
};

/** Pill chip: tone "success" | "muted" | "reward". */
export const CelebrationChip = ({ tone = 'success', icon, label }) => {
  const { colors } = useTheme();
  const palette = {
    success: { bg: `${colors.success}22`, fg: colors.success },
    muted: { bg: colors.surfaceContainerHigh, fg: colors.textSecondary },
    reward: { bg: `${colors.dawn}38`, fg: colors.dawnText },
  }[tone];
  return (
    <View style={[styles.chip, { backgroundColor: palette.bg }]}>
      {icon ? <Ionicons name={icon} size={14} color={palette.fg} /> : null}
      <Text style={[styles.chipText, { color: palette.fg }]}>{label}</Text>
    </View>
  );
};

/** Stat row: [{ value, label }]. */
export const CelebrationStats = ({ items }) => {
  const { colors } = useTheme();
  const shown = (items || []).filter((item) => Number(item.value) > 0);
  if (!shown.length) return null;
  return (
    <View style={[styles.stats, { backgroundColor: colors.primaryContainer }]}>
      {shown.map((item, i) => (
        <View key={item.label} style={[styles.stat, i > 0 && { borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: colors.border }]}>
          <Text style={[styles.statValue, { color: colors.text }]}>{String(item.value)}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
};

/** Buttons. variant: "primary" (dawn fill, the single main action) | "secondary" (outlined) | "text". */
export const CelebrationButton = ({ variant = 'primary', icon, label, onPress, tone = 'neutral', disabled }) => {
  const { colors } = useTheme();
  const isPrimary = variant === 'primary';
  const isText = variant === 'text';
  const accent = tone === 'primary' ? colors.primaryText : colors.text;
  const fg = isPrimary ? ON_DAWN : isText ? colors.textSecondary : accent;
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        styles.btn,
        isPrimary && { backgroundColor: colors.dawn, minHeight: 52 },
        variant === 'secondary' && { borderWidth: 1, borderColor: tone === 'primary' ? colors.primary : colors.border },
        isText && { minHeight: 44 },
        disabled && { opacity: 0.6 },
      ]}
    >
      {icon ? <Ionicons name={icon} size={17} color={fg} /> : null}
      <Text style={[styles.btnText, { color: fg }, !isPrimary && { fontFamily: 'Inter_600SemiBold', fontSize: 15 }]}>{label}</Text>
    </TouchableOpacity>
  );
};

/** Quote block with a petrol bar. */
export const CelebrationQuote = ({ quote, author }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.quote, { backgroundColor: colors.primaryContainer, borderLeftColor: colors.primary }]}>
      <Text style={[styles.quoteText, { color: colors.text }]}>{`“${quote}”`}</Text>
      <Text style={[styles.quoteAuthor, { color: colors.textSecondary }]}>{`— ${author}`}</Text>
    </View>
  );
};

/** Shared backdrop wrapper style for the modals that host a CelebrationCard. */
export const celebrationBackdrop = (isDark) => ({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 20,
  paddingVertical: 24,
  backgroundColor: isDark ? 'rgba(0,0,0,0.66)' : 'rgba(36,33,30,0.56)',
});

export const CELEBRATION_EMBLEM = EMBLEM;

const styles = StyleSheet.create({
  card: { width: '100%', maxWidth: 380, borderRadius: 28, borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden' },
  band: { height: BAND_H, overflow: 'hidden' },
  sun: { position: 'absolute', right: -30, top: -34 },
  close: { position: 'absolute', top: 10, right: 10, width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', zIndex: 3 },
  emblem: {
    width: EMBLEM, height: EMBLEM, borderRadius: EMBLEM / 2, marginTop: -EMBLEM / 2, alignSelf: 'center',
    borderWidth: 1, padding: 5, overflow: 'hidden', alignItems: 'center', justifyContent: 'center',
  },
  body: { paddingHorizontal: 22, paddingTop: 16, paddingBottom: 22, alignItems: 'center' },
  kicker: { fontFamily: 'Inter_600SemiBold', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', textAlign: 'center' },
  title: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 30, lineHeight: 35, textAlign: 'center', marginTop: 8 },
  subtitle: { fontFamily: 'Inter_600SemiBold', fontSize: 15, textAlign: 'center', marginTop: 6 },
  desc: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: 10, maxWidth: 300 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 32, paddingHorizontal: 14, borderRadius: 16, marginTop: 14 },
  chipText: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  stats: { flexDirection: 'row', alignSelf: 'stretch', marginTop: 16, paddingVertical: 12, borderRadius: 14 },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 24, lineHeight: 28, fontVariant: ['tabular-nums'] },
  statLabel: { fontFamily: 'Inter_500Medium', fontSize: 11, marginTop: 2 },
  actions: { alignSelf: 'stretch', gap: 10, marginTop: 20 },
  btn: { minHeight: 48, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnText: { fontFamily: 'Inter_700Bold', fontSize: 16 },
  quote: { alignSelf: 'stretch', marginTop: 18, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 14, borderLeftWidth: 3 },
  quoteText: { fontFamily: 'PlayfairDisplay_400Regular_Italic', fontSize: 15, lineHeight: 22 },
  quoteAuthor: { fontFamily: 'Inter_500Medium', fontSize: 12, marginTop: 6 },
});

export default CelebrationCard;

import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCategoryPillIcon, getCategoryTheme } from '../utils/categoryImages';
import { colors as themeColors, readableTextOn, darkenHex } from '../theme/theme';

const CategoryPill = ({
  label,
  categoryName,
  active = false,
  isDark = false,
  compact = false,
  vertical = false,
  onPress,
  disabled = false,
  activeColor,
  activeTextColor,
  showIcon = true,
}) => {
  const displayLabel = label || categoryName || '';
  const pillIcon = showIcon
    ? getCategoryPillIcon(categoryName || label, isDark)
    : { source: null, name: null };

  // Each category carries its own accent. When selected, the pill is filled
  // with that category's colour instead of a single shared gold. An explicit
  // `activeColor` prop still overrides it if a caller needs to.
  const catTheme = getCategoryTheme(categoryName || label, isDark);
  const baseActiveColor = activeColor || catTheme.accent || '#C29B4C';

  // A few lighter/warmer accents (gold "Tümü", orange "Büyüme"/"İletişim") sit
  // right on the luminance tie-break line, so readableTextOn() picks dark text
  // for them while every other (cooler/darker) category reads white — visually
  // inconsistent. When the caller isn't already forcing its own colours, nudge
  // the fill a shade richer so the *same* contrast check reliably lands on
  // white, instead of hardcoding white on a fill that wouldn't support it.
  const autoTextColorMode = !activeColor && !activeTextColor;
  const resolvedActiveColor = autoTextColorMode && readableTextOn(baseActiveColor) === '#1A1A1A'
    ? darkenHex(baseActiveColor, 0.35)
    : baseActiveColor;

  const neutral = isDark
    ? { background: '#232326', border: '#34343A', text: '#B7B9BE' }
    : { background: '#F1ECE1', border: '#E4DBCB', text: '#857E6E' };

  const backgroundColor = active ? resolvedActiveColor : neutral.background;
  const borderColor = active ? resolvedActiveColor : neutral.border;
  // The filled colour varies per category (gold/blue/green…), so derive the
  // label colour from contrast instead of hardcoding white — light accents
  // (e.g. dark-mode gold #E5C27A) get dark text, dark accents get white.
  // Callers using a single shared accent (e.g. Profile's gold pills) can pass an
  // explicit `activeTextColor` (typically the theme's onPrimary token) to force it.
  const onActiveColor = activeTextColor || readableTextOn(resolvedActiveColor);
  const labelColor = active ? onActiveColor : neutral.text;
  const iconWrapBg = active
    ? (onActiveColor === '#FFFFFF' ? 'rgba(255,255,255,0.20)' : 'rgba(0,0,0,0.12)')
    : 'transparent';

  // Vertical (home category) cards: selected card fills with the category's
  // own Ana Renk (resolvedActiveColor); unselected cards use that same
  // category's Arka Plan tint as background and Detay/İkon tone as text —
  // per the "Kategori Görselleri Renk Kodları" reference sheet, so every
  // card (active or not) reads in its own category colour.
  const themePalette = isDark ? themeColors.dark : themeColors.light;
  const verticalBackground = active ? resolvedActiveColor : (catTheme.backgroundColor || themePalette.cardBackground);
  const verticalBorder = active ? resolvedActiveColor : `${catTheme.borderColor || themePalette.border}40`;
  const verticalTextColor = active ? onActiveColor : (catTheme.borderColor || themePalette.text);

  if (vertical) {
    return (
      <TouchableOpacity
        activeOpacity={0.82}
        disabled={disabled}
        onPress={onPress}
        style={[
          styles.verticalBase,
          { borderColor: verticalBorder, backgroundColor: verticalBackground },
          active && styles.activeElevation,
          active && {
            shadowColor: resolvedActiveColor,
            transform: [{ scale: 1.03 }],
          },
        ]}
      >
        <View style={styles.verticalIconWrap}>
          {pillIcon.source ? (
            <Image source={pillIcon.source} style={styles.verticalIconImage} resizeMode="contain" />
          ) : (
            <Ionicons name={pillIcon.name || 'apps-outline'} size={20} color={verticalTextColor} />
          )}
        </View>
        <Text
          numberOfLines={2}
          style={[styles.verticalLabel, { color: verticalTextColor }]}
        >
          {displayLabel}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.base,
        compact ? styles.compact : styles.regular,
        { borderColor, backgroundColor },
        active && styles.activeElevation,
        active && {
          shadowColor: resolvedActiveColor,
          transform: [{ scale: 1.03 }],
        },
      ]}
    >
      {pillIcon.source ? (
        <View
          style={[
            styles.iconWrap,
            compact ? styles.iconWrapCompact : null,
            { backgroundColor: iconWrapBg },
          ]}
        >
          <Image source={pillIcon.source} style={styles.iconImage} resizeMode="cover" />
        </View>
      ) : null}
      <Text
        numberOfLines={1}
        style={[
          styles.label,
          compact ? styles.labelCompact : null,
          { color: labelColor },
        ]}
      >
        {displayLabel}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  activeElevation: {
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  regular: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  compact: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  iconWrap: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginLeft: -3,
  },
  iconWrapCompact: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  iconImage: {
    width: '100%',
    height: '100%',
    transform: [{ scale: 1.3 }],
  },
  label: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
  },
  labelCompact: {
    fontSize: 12,
  },
  verticalBase: {
    minWidth: 72,
    minHeight: 66,
    borderWidth: 1,
    borderRadius: 18,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    gap: 2,
  },
  verticalIconWrap: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verticalIconImage: {
    width: '100%',
    height: '100%',
  },
  verticalLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 13,
  },
});

export default CategoryPill;
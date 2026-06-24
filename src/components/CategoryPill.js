import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCategoryPillIcon, getCategoryTheme } from '../utils/categoryImages';

const CategoryPill = ({
  label,
  categoryName,
  active = false,
  isDark = false,
  compact = false,
  onPress,
  disabled = false,
  activeColor,
  showIcon = true,
}) => {
  const displayLabel = label || categoryName || '';
  const pillIcon = showIcon ? getCategoryPillIcon(categoryName || label) : { source: null };

  // Each category carries its own accent. When selected, the pill is filled
  // with that category's colour instead of a single shared gold. An explicit
  // `activeColor` prop still overrides it if a caller needs to.
  const catTheme = getCategoryTheme(categoryName || label, isDark);
  const resolvedActiveColor = activeColor || catTheme.accent || '#C29B4C';

  const neutral = isDark
    ? { background: '#232326', border: '#34343A', text: '#B7B9BE' }
    : { background: '#F1ECE1', border: '#E4DBCB', text: '#857E6E' };

  const backgroundColor = active ? resolvedActiveColor : neutral.background;
  const borderColor = active ? resolvedActiveColor : neutral.border;
  const labelColor = active ? '#FFFFFF' : neutral.text;
  const iconWrapBg = active ? 'rgba(255,255,255,0.20)' : 'transparent';

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
          <Image source={pillIcon.source} style={styles.iconImage} resizeMode="contain" />
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
    gap: 8,
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
  },
  iconWrapCompact: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  iconImage: {
    width: '100%',
    height: '100%',
  },
  label: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
  },
  labelCompact: {
    fontSize: 12,
  },
});

export default CategoryPill;
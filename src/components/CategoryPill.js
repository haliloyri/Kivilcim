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
}) => {
  const displayLabel = label || categoryName || '';
  const theme = getCategoryTheme(categoryName || label, isDark);
  const pillIcon = getCategoryPillIcon(categoryName || label);

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.base,
        compact ? styles.compact : styles.regular,
        {
          borderColor: theme.borderColor,
          backgroundColor: active ? theme.accent : theme.backgroundColor,
        },
      ]}
    >
      <View
        style={[
          styles.iconWrap,
          compact ? styles.iconWrapCompact : null,
          {
            backgroundColor: active ? 'rgba(255,255,255,0.18)' : `${theme.accent}18`,
          },
        ]}
      >
        {pillIcon.source ? (
          <Image source={pillIcon.source} style={styles.iconImage} resizeMode="cover" />
        ) : (
          <Ionicons
            name="ellipse"
            size={compact ? 10 : 12}
            color={active ? '#FFFFFF' : theme.accent}
          />
        )}
      </View>
      <Text
        numberOfLines={1}
        style={[
          styles.label,
          compact ? styles.labelCompact : null,
          { color: active ? '#FFFFFF' : theme.accent },
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
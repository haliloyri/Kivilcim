import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { typography, layout as baseLayout } from '../theme/theme';

const ScreenHeader = ({ title, subtitle, left, right, style }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.wrap, style]}>
      <View style={styles.row}>
        {left ? <View style={styles.side}>{left}</View> : null}
        <Text
          style={[styles.title, { color: colors.text }]}
          numberOfLines={1}
          accessibilityRole="header"
        >
          {title}
        </Text>
        {right ? <View style={styles.side}>{right}</View> : null}
      </View>
      {subtitle ? (
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: baseLayout.padding.horizontal,
    paddingTop: baseLayout.padding.screenTop,
  },
  row: { flexDirection: 'row', alignItems: 'center', minHeight: 44, gap: 12 },
  side: { alignItems: 'center', justifyContent: 'center' },
  title: {
    flex: 1,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: typography.sizes.screenTitle,
    lineHeight: typography.spacing.screenTitleLineHeight,
  },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 13, marginTop: 4 },
});

export default ScreenHeader;

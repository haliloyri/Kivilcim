import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { useAnimatedReaction, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { t } from '../../locales/i18n';

function ConversationButton({ onPress, lang, colors }) {
  return <TouchableOpacity onPress={onPress} activeOpacity={0.85} accessibilityRole="button" accessibilityLabel={t('story_detail_use_cta', lang)}>
    <View style={[styles.primary, { backgroundColor: colors.primary }]}>
      <Ionicons name="chatbubbles-outline" size={20} color={colors.onPrimary} />
      <Text style={[styles.primaryText, { color: colors.onPrimary }]}>{t('story_detail_use_cta', lang)}</Text>
      <Ionicons name="arrow-forward" size={18} color={colors.onPrimary} />
    </View>
  </TouchableOpacity>;
}

function FloatingActions({ scrollOffset, viewportHeight, endActionsY, hidden, onConversation, lang }) {
  const { colors, layout } = useTheme();
  const insets = useSafeAreaInsets();
  const directionAnchor = useSharedValue(0);
  const lastOffset = useSharedValue(0);
  const direction = useSharedValue(0);
  const visible = useSharedValue(false);
  useAnimatedReaction(
    () => ({ y: Math.max(0, scrollOffset.get()), viewport: viewportHeight.get(), end: endActionsY.get() }),
    ({ y, viewport, end }) => {
      const delta = y - lastOffset.get();
      const nextDirection = delta === 0 ? direction.get() : delta > 0 ? 1 : -1;
      if (nextDirection !== direction.get()) directionAnchor.set(lastOffset.get());
      direction.set(nextDirection);
      lastOffset.set(y);
      // Ignore bounce at the top; hide when the full end-of-story action is visible.
      if (y < 80 || y + viewport >= end) {
        visible.set(false);
        directionAnchor.set(y);
      } else if (Math.abs(y - directionAnchor.get()) > 12) {
        visible.set(nextDirection < 0);
      }
    },
  );
  // This frequent scroll response is immediate, with no extra motion or layout
  // changes to the reader. display:none also removes hidden actions from focus.
  const visibilityStyle = useAnimatedStyle(() => ({ display: visible.get() && !hidden ? 'flex' : 'none' }));
  return <Animated.View style={[styles.floating, visibilityStyle]}>
    <LinearGradient pointerEvents="none" colors={[`${colors.background}00`, colors.background]} style={{ height: 28 }} />
    <View style={{ backgroundColor: colors.background, paddingHorizontal: layout.padding.horizontal, paddingTop: 4, paddingBottom: Math.max(insets.bottom, 12) }}>
      <ConversationButton onPress={onConversation} lang={lang} colors={colors} />
    </View>
  </Animated.View>;
}

export default function ReaderActions(props) {
  const { colors } = useTheme();
  if (props.compact) return <FloatingActions {...props} />;
  return <View style={{ gap: 14 }}>
    <Text style={[styles.heading, { color: colors.text }]}>{t('story_detail_use_cta', props.lang)}</Text>
    <Text style={[styles.description, { color: colors.textSecondary }]}>{t('story_detail_use_cta_sub', props.lang)}</Text>
    <ConversationButton onPress={props.onConversation} lang={props.lang} colors={colors} />
    <TouchableOpacity onPress={props.onRecord} style={styles.record} accessibilityRole="button">
      <Ionicons name="mic-outline" size={20} color={colors.readerAccent} />
      <Text style={[styles.description, { color: colors.readerAccentText }]}>{t('readerRecord', props.lang)}</Text>
    </TouchableOpacity>
  </View>;
}

const styles = StyleSheet.create({
  floating: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  primary: { minHeight: 48, paddingVertical: 13, paddingHorizontal: 16, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  primaryText: { fontFamily: 'Inter_600SemiBold', fontSize: 16, flexShrink: 1 },
  heading: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 26 },
  description: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 21 },
  record: { minHeight: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
});

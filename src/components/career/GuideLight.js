import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import useReducedMotion from '../../hooks/useReducedMotion';

const CONFIG = {
  idle: { icon: 'sparkles-outline', pulse: false, intensity: 0.34 },
  guide: { icon: 'navigate-outline', pulse: true, intensity: 0.42 },
  celebrate: { icon: 'sparkles', pulse: true, intensity: 0.58 },
  gentleReturn: { icon: 'return-down-back-outline', pulse: false, intensity: 0.28 },
};

/**
 * Sessiz, soyut yön işareti. Kişilik veya metin taşımaz; erişilebilir açıklama
 * ilgili başlık/CTA tarafından sağlanır. Home ve normal hikâye yüzeylerinde
 * kullanılmaması, kariyer bileşenleri dışındaki call-site'ların olmamasıyla korunur.
 */
const GuideLight = ({ state = 'idle', size = 48, style }) => {
  const { colors } = useTheme();
  const reduceMotion = useReducedMotion();
  const scale = useRef(new Animated.Value(1)).current;
  const config = CONFIG[state] || CONFIG.idle;

  useEffect(() => {
    scale.stopAnimation();
    if (reduceMotion || !config.pulse) {
      scale.setValue(1);
      return undefined;
    }
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(scale, { toValue: 1.06, duration: 1450, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 1450, useNativeDriver: true }),
    ]));
    animation.start();
    return () => animation.stop();
  }, [config.pulse, reduceMotion, scale]);

  const coreSize = Math.max(10, Math.round(size * 0.29));
  return (
    <Animated.View accessible={false} importantForAccessibility="no-hide-descendants" style={[styles.wrap, { width: size, height: size, borderRadius: size / 2, backgroundColor: `${colors.primary}${Math.round(config.intensity * 255).toString(16).padStart(2, '0')}`, borderColor: `${colors.primary}70`, transform: [{ scale }] }, style]}>
      <View style={[styles.halo, { width: size * 0.58, height: size * 0.58, borderRadius: size / 2, borderColor: `${colors.primary}58` }]} />
      <View style={[styles.core, { width: coreSize, height: coreSize, borderRadius: coreSize / 2, backgroundColor: colors.primary }]} />
      <Ionicons name={config.icon} size={Math.round(size * 0.42)} color={colors.primary} style={styles.icon} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrap: { borderWidth: 1, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  halo: { position: 'absolute', borderWidth: 1 },
  core: { position: 'absolute', opacity: 0.28 },
  icon: { position: 'absolute' },
});

export default GuideLight;

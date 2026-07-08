import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Dimensions, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedProps, withTiming, Easing, interpolate, Extrapolation } from 'react-native-reanimated';
import Svg, { Defs, RadialGradient, Stop, G, Path, Circle, Line } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';
import { t } from '../locales/i18n';

const AG = Animated.createAnimatedComponent(G);

// Emblem drawn in the same coordinate space as the design preview.
// Spine (book hinge) sits at x=340; sun rests centered at (340, 225).
const SPINE_X = 340;
const SPINE_Y = 345;
const SUN_CX = 340;
const SUN_CY = 225;

// Master timeline runs once (~4.2s) then holds on the final frame:
// closed book -> opens -> a few pages flip -> sun rises from the spine.
const ANIM_MS = 4200;

const getEmblemWidth = () => {
  const { width, height } = Dimensions.get('window');
  const shortSide = Math.min(width, height);
  const isTablet = shortSide >= 600;
  return isTablet ? shortSide * 0.42 : shortSide * 0.64;
};

const clamp = Extrapolation.CLAMP;

const LaunchScreen = ({ status = 'stories', errorMessage = null, onRetry }) => {
  const { colors, lang } = useTheme();
  const [elapsedMs, setElapsedMs] = useState(0);

  const emblemW = getEmblemWidth();
  const emblemH = emblemW * (270 / 310);

  const p = useSharedValue(0);

  useEffect(() => {
    p.value = 0;
    p.value = withTiming(1, { duration: ANIM_MS, easing: Easing.inOut(Easing.ease) });
  }, [p]);

  useEffect(() => {
    setElapsedMs(0);
    const start = Date.now();
    const timer = setInterval(() => setElapsedMs(Date.now() - start), 1000);
    return () => clearInterval(timer);
  }, [status, errorMessage]);

  const phaseMessage = useMemo(() => {
    if (errorMessage || elapsedMs >= 12000) return t('launch_loading_failed', lang);
    if (elapsedMs >= 5000) return t('launch_taking_longer', lang);
    if (status === 'user') return t('launch_preparing_plan', lang);
    if (status === 'stories') return t('launch_loading_stories', lang);
    return t('launch_preparing_library', lang);
  }, [elapsedMs, errorMessage, lang, status]);

  const showRetry = Boolean(onRetry) && (Boolean(errorMessage) || elapsedMs >= 12000);

  const closedProps = useAnimatedProps(() => ({
    opacity: interpolate(p.value, [0, 0.18, 0.26], [1, 1, 0], clamp),
    scale: interpolate(p.value, [0, 0.14], [0.9, 1], clamp),
    originX: 340,
    originY: 273,
  }));

  const leftProps = useAnimatedProps(() => ({
    opacity: interpolate(p.value, [0.16, 0.24], [0, 1], clamp),
    rotation: interpolate(p.value, [0.2, 0.42], [22, 0], clamp),
    originX: SPINE_X,
    originY: SPINE_Y,
  }));

  const rightProps = useAnimatedProps(() => ({
    opacity: interpolate(p.value, [0.16, 0.24], [0, 1], clamp),
    rotation: interpolate(p.value, [0.2, 0.42], [-22, 0], clamp),
    originX: SPINE_X,
    originY: SPINE_Y,
  }));

  const flip1Props = useAnimatedProps(() => ({
    opacity: interpolate(p.value, [0.4, 0.44, 0.56, 0.6], [0, 1, 1, 0], clamp),
    scaleX: interpolate(p.value, [0.44, 0.56], [1, -1], clamp),
    originX: SPINE_X,
    originY: 300,
  }));

  const flip2Props = useAnimatedProps(() => ({
    opacity: interpolate(p.value, [0.5, 0.54, 0.66, 0.7], [0, 1, 1, 0], clamp),
    scaleX: interpolate(p.value, [0.54, 0.66], [1, -1], clamp),
    originX: SPINE_X,
    originY: 300,
  }));

  const sunProps = useAnimatedProps(() => ({
    opacity: interpolate(p.value, [0.6, 0.72], [0, 1], clamp),
    y: interpolate(p.value, [0.6, 0.9], [74, 0], clamp),
  }));

  const raysProps = useAnimatedProps(() => ({
    opacity: interpolate(p.value, [0.7, 0.82], [0, 0.9], clamp),
  }));

  const glowProps = useAnimatedProps(() => ({
    opacity: interpolate(p.value, [0.62, 0.92], [0, 0.8], clamp),
    scale: interpolate(p.value, [0.62, 0.92], [0.5, 1], clamp),
    originX: SUN_CX,
    originY: SUN_CY,
  }));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Svg width={emblemW} height={emblemH} viewBox="185 95 310 270">
          <Defs>
            <RadialGradient id="sunGrad" cx="50%" cy="45%" r="60%">
              <Stop offset="0" stopColor="#ffe9a8" />
              <Stop offset="0.55" stopColor="#f6c65a" />
              <Stop offset="1" stopColor="#eaa93a" />
            </RadialGradient>
            <RadialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
              <Stop offset="0" stopColor="#f7c860" stopOpacity="0.85" />
              <Stop offset="0.45" stopColor="#e9a63c" stopOpacity="0.35" />
              <Stop offset="1" stopColor="#e9a63c" stopOpacity="0" />
            </RadialGradient>
          </Defs>

          <AG animatedProps={glowProps}>
            <Circle cx={SUN_CX} cy={SUN_CY} r={120} fill="url(#glowGrad)" />
          </AG>

          <AG animatedProps={sunProps}>
            <AG animatedProps={raysProps}>
              <G stroke="#f4c65a" strokeWidth={3} strokeLinecap="round">
                <Line x1="340" y1="171" x2="340" y2="137" />
                <Line x1="363" y1="176" x2="377" y2="145" />
                <Line x1="317" y1="176" x2="303" y2="145" />
                <Line x1="381" y1="190" x2="404" y2="171" />
                <Line x1="299" y1="190" x2="276" y2="171" />
                <Line x1="392" y1="211" x2="419" y2="204" />
                <Line x1="288" y1="211" x2="261" y2="204" />
                <Line x1="392" y1="239" x2="415" y2="245" />
                <Line x1="288" y1="239" x2="265" y2="245" />
              </G>
            </AG>
            <Circle cx={SUN_CX} cy={SUN_CY} r={50} fill="url(#sunGrad)" />
          </AG>

          <AG animatedProps={leftProps}>
            <Path d="M340,345 L206,315 L206,296 L340,326 Z" fill="#24365f" />
            <Path d="M340,345 L212,312 L232,250 L340,260 Z" fill="#f6e7c8" />
            <Path d="M340,338 L250,318 L262,272 L340,282 Z" fill="#efd9a8" fillOpacity={0.7} />
          </AG>
          <AG animatedProps={rightProps}>
            <Path d="M340,345 L474,315 L474,296 L340,326 Z" fill="#24365f" />
            <Path d="M340,345 L468,312 L448,250 L340,260 Z" fill="#f6e7c8" />
            <Path d="M340,338 L430,318 L418,272 L340,282 Z" fill="#efd9a8" fillOpacity={0.7} />
          </AG>

          <AG animatedProps={flip1Props}>
            <Path d="M340,345 L462,313 L444,255 L340,262 Z" fill="#f3e2b8" />
          </AG>
          <AG animatedProps={flip2Props}>
            <Path d="M340,345 L462,313 L444,255 L340,262 Z" fill="#f6e7c8" />
          </AG>

          <AG animatedProps={closedProps}>
            <Path d="M292,209 L388,209 L388,337 Q388,346 379,346 L301,346 Q292,346 292,337 Z" fill="#1c2b4e" />
            <Path d="M292,209 L306,209 L306,346 L301,346 Q292,346 292,337 Z" fill="#152039" />
            <Path d="M380,206 L387,206 L387,340 L380,340 Z" fill="#f6e7c8" fillOpacity={0.85} />
            <Circle cx={343} cy={273} r={17} fill="url(#sunGrad)" fillOpacity={0.9} />
          </AG>
        </Svg>
      </View>

      <View style={styles.loaderContainer}>
        {showRetry ? null : <ActivityIndicator size="small" color={colors.primary || '#FFD700'} />}
        <Text style={[styles.statusText, { color: colors.textSecondary || '#D8D1C7' }]}>
          {phaseMessage}
        </Text>
        {showRetry ? (
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.primary || '#FFD700' }]}
            onPress={onRetry}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={t('launch_try_again', lang)}
          >
            <Text style={[styles.retryButtonText, { color: colors.onPrimary || '#131311' }]}>{t('launch_try_again', lang)}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131311',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    position: 'absolute',
    bottom: 86,
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  statusText: {
    marginTop: 14,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    minHeight: 44,
    minWidth: 132,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  retryButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
});

export default LaunchScreen;

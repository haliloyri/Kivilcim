import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  AccessibilityInfo,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { t } from '../locales/i18n';
import AnimatedLogo, { LOGO_BACKGROUND } from '../components/AnimatedLogo';

// Must match expo-splash-screen imageWidth in app.json so the native splash
// (book only) hands over seamlessly to the animated mark.
const LOGO_SIZE = 200;
const FEEDBACK_DELAY_MS = 1500;

const LaunchScreen = ({ status = 'stories', errorMessage = null, onRetry }) => {
  const { colors, lang } = useTheme();
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    setElapsedMs(0);
    const start = Date.now();
    const timer = setInterval(() => setElapsedMs(Date.now() - start), 500);
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
  const showFeedback = Boolean(errorMessage) || elapsedMs >= FEEDBACK_DELAY_MS;

  const horizon = useRef(new Animated.Value(0)).current;
  const wordmark = useRef(new Animated.Value(0)).current;
  const tagline = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let cancelled = false;
    const run = (reduceMotion) => {
      if (cancelled) return;
      if (reduceMotion) {
        horizon.setValue(1);
        wordmark.setValue(1);
        tagline.setValue(1);
        return;
      }
      Animated.parallel([
        Animated.timing(horizon, {
          toValue: 1,
          duration: 1600,
          delay: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(wordmark, {
          toValue: 1,
          duration: 700,
          delay: 1000,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(tagline, {
          toValue: 1,
          duration: 700,
          delay: 1350,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    };
    AccessibilityInfo.isReduceMotionEnabled()
      .then(run)
      .catch(() => run(false));
    return () => {
      cancelled = true;
      horizon.stopAnimation();
      wordmark.stopAnimation();
      tagline.stopAnimation();
    };
  }, [horizon, wordmark, tagline]);

  const wordmarkStyle = {
    opacity: wordmark,
    transform: [
      { translateY: wordmark.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) },
    ],
  };
  const horizonStyle = {
    opacity: horizon,
    transform: [
      { translateY: horizon.interpolate({ inputRange: [0, 1], outputRange: [80, 0] }) },
    ],
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.horizon, horizonStyle]} pointerEvents="none">
        <LinearGradient
          colors={['rgba(233,169,75,0)', 'rgba(233,169,75,0.16)']}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <View style={styles.content}>
        <AnimatedLogo size={LOGO_SIZE} />
      </View>

      <View style={styles.brandBlock} pointerEvents="none">
        <Animated.Text style={[styles.wordmark, wordmarkStyle]} accessibilityRole="header">
          Albor
        </Animated.Text>
        <Animated.Text style={[styles.tagline, { opacity: tagline }]}>
          {t('launch_tagline', lang)}
        </Animated.Text>
      </View>

      {showFeedback ? (
        <View style={styles.feedbackContainer}>
          {showRetry ? null : <ActivityIndicator size="small" color={colors.primary} />}
          <Text
            style={[styles.statusText, { color: 'rgba(253, 239, 208, 0.72)' }]}
            accessibilityLiveRegion="polite"
          >
            {phaseMessage}
          </Text>
          {showRetry ? (
            <TouchableOpacity
              style={[styles.retryButton, { backgroundColor: colors.primary }]}
              onPress={onRetry}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel={t('launch_try_again', lang)}
            >
              <Text style={[styles.retryButtonText, { color: colors.onPrimary }]}>
                {t('launch_try_again', lang)}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LOGO_BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizon: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '45%',
  },
  // Logo is centred; the brand block hangs below it so the mark does not shift
  // from the native splash position.
  brandBlock: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    marginTop: LOGO_SIZE / 2 + 20,
    alignItems: 'center',
  },
  wordmark: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 38,
    lineHeight: 46,
    letterSpacing: 0.5,
    color: '#F5F1E8',
  },
  tagline: {
    marginTop: 4,
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    letterSpacing: 1.2,
    color: '#F0C170',
  },
  feedbackContainer: {
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

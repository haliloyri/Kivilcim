import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
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

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <AnimatedLogo size={LOGO_SIZE} />
      </View>

      {showFeedback ? (
        <View style={styles.feedbackContainer}>
          {showRetry ? null : <ActivityIndicator size="small" color={colors.primary || '#C89B3C'} />}
          <Text
            style={[styles.statusText, { color: 'rgba(253, 239, 208, 0.72)' }]}
            accessibilityLiveRegion="polite"
          >
            {phaseMessage}
          </Text>
          {showRetry ? (
            <TouchableOpacity
              style={[styles.retryButton, { backgroundColor: colors.primary || '#C89B3C' }]}
              onPress={onRetry}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel={t('launch_try_again', lang)}
            >
              <Text style={[styles.retryButtonText, { color: colors.onPrimary || '#FFFFFF' }]}>
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

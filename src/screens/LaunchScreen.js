import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Image, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { t } from '../locales/i18n';

const LAUNCH_MARK = require('../../assets/splash/albor-splash-mark.png');
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
        <Image
          source={LAUNCH_MARK}
          style={styles.launchMark}
          resizeMode="contain"
          accessible={false}
        />
      </View>

      {showFeedback ? (
        <View style={styles.feedbackContainer}>
          {showRetry ? null : <ActivityIndicator size="small" color={colors.primary || '#FFD700'} />}
          <Text
            style={[styles.statusText, { color: colors.textSecondary || '#D8D1C7' }]}
            accessibilityLiveRegion="polite"
          >
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
              <Text style={[styles.retryButtonText, { color: colors.onPrimary || '#131311' }]}>
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
    backgroundColor: '#131311',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  launchMark: {
    width: 184,
    height: 184,
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

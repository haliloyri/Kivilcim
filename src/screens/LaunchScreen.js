import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Image, ActivityIndicator, Dimensions, useColorScheme, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { t } from '../locales/i18n';

const LIGHT_LOGO = require('../../assets/spark_logo.png');
const DARK_LOGO = require('../../assets/spark_logo_dark.png');

/**
 * Returns logo size based on screen dimensions.
 * Tablets (short side >= 600dp) get a smaller percentage to avoid oversized logos.
 * Keep the logo within the screen bounds by using a fraction of the short side.
 */
const getLogoSize = () => {
  const { width, height } = Dimensions.get('window');
  const shortSide = Math.min(width, height);
  const isTablet = shortSide >= 600;
  const size = isTablet ? shortSide * 0.4 : shortSide * 0.6;
  return size;
};

const LaunchScreen = ({ status = 'stories', errorMessage = null, onRetry }) => {
  const { colors, lang } = useTheme();
  const colorScheme = useColorScheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const [elapsedMs, setElapsedMs] = useState(0);

  const logoSize = getLogoSize();
  const logoSource = colorScheme === 'dark' ? DARK_LOGO : LIGHT_LOGO;

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

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Image
          source={logoSource}
          style={{ width: logoSize, height: logoSize }}
          resizeMode="contain"
        />
      </Animated.View>

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


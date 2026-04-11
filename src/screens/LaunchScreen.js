import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Image, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Static logo map — React Native requires static paths at build time
const LOGO_MAP = {
  de: require('../../assets/spark_logo_de.png'),
  en: require('../../assets/spark_logo_en.png'),
  tr: require('../../assets/spark_logo_tr.png'),
  es: require('../../assets/spark_logo_es.png'),
};

/**
 * Detect device locale and map to a supported logo language.
 * Falls back to 'de' (German) as the default.
 */
const getLogoLang = () => {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale || '';
    const prefix = locale.substring(0, 2).toLowerCase();
    if (prefix in LOGO_MAP) return prefix;
  } catch {
    // ignore
  }
  return 'de';
};

/**
 * Returns logo size based on screen dimensions.
 * Tablets (short side >= 600dp) get a smaller percentage to avoid oversized logos.
 */
const getLogoSize = () => {
  const { width, height } = Dimensions.get('window');
  const shortSide = Math.min(width, height);
  const isTablet = shortSide >= 600;
  const size = isTablet ? shortSide * 0.42 : shortSide * 0.72;
  return size;
};

const LaunchScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  const logoLang = getLogoLang();
  const logoSize = getLogoSize();

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
          source={LOGO_MAP[logoLang]}
          style={{ width: logoSize, height: logoSize }}
          resizeMode="contain"
        />
      </Animated.View>

      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color="#FFD700" />
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
    bottom: 100,
  },
});

export default LaunchScreen;


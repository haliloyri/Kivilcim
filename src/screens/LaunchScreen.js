import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Image, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const LANGUAGE_LOGO = require('../../assets/spark_logo_de.png');

/**
 * Returns logo size based on screen dimensions.
 * Tablets (short side >= 600dp) get a smaller percentage to avoid oversized logos.
 * Size is 2x larger than original (100% bigger).
 */
const getLogoSize = () => {
  const { width, height } = Dimensions.get('window');
  const shortSide = Math.min(width, height);
  const isTablet = shortSide >= 600;
  const size = isTablet ? shortSide * 1.16 : shortSide * 1.76;
  return size;
};

const LaunchScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

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
          source={LANGUAGE_LOGO}
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


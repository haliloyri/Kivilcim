import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

// Custom Spark Logo using pure React Native Views
const SparkLogo = ({ color = '#FFB783', size = 60 }) => {
  const centerSize = size * 0.25;
  const rayWidth = size * 0.08;
  const rayLength = size * 0.2;
  const diagonalRayLength = size * 0.12;
  
  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      {/* Center Circle */}
      <View style={{
        width: centerSize,
        height: centerSize,
        borderRadius: centerSize / 2,
        backgroundColor: color,
        position: 'absolute'
      }} />
      
      {/* Top, Bottom, Left, Right Rays */}
      {[0, 90, 180, 270].map((deg, i) => (
        <View key={`straight-${i}`} style={{
          position: 'absolute',
          width: rayWidth,
          height: rayLength,
          backgroundColor: color,
          transform: [
            { rotate: `${deg}deg` },
            { translateY: -(size * 0.35) }
          ],
          borderRadius: rayWidth / 2
        }} />
      ))}
      
      {/* Diagonal Rays */}
      {[45, 135, 225, 315].map((deg, i) => (
        <View key={`diag-${i}`} style={{
          position: 'absolute',
          width: rayWidth,
          height: diagonalRayLength,
          backgroundColor: color,
          transform: [
            { rotate: `${deg}deg` },
            { translateY: -(size * 0.3) }
          ],
          borderRadius: rayWidth / 2
        }} />
      ))}
    </View>
  );
};

const DotGrid = () => {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={{ flex: 1, flexWrap: 'wrap', flexDirection: 'row', overflow: 'hidden', opacity: 0.1 }}>
        {Array.from({ length: 400 }).map((_, i) => (
          <View key={i} style={{
            width: 2, height: 2, backgroundColor: '#A89A84', borderRadius: 1,
            marginHorizontal: 19, marginVertical: 19
          }} />
        ))}
      </View>
    </View>
  );
};

const LaunchScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <DotGrid />
      
      <View style={styles.centerContent}>
        <Animated.View style={styles.logoContainer}>
          <SparkLogo color="#FFB783" size={54} />
        </Animated.View>
        
        <Text style={styles.brandText}>Kıvılcım</Text>
        
        <View style={styles.divider} />
      </View>
      
      {/* Dark Arch shape at bottom right */}
      <View style={styles.bottomShape} />
      
      <View style={styles.bottomContent}>
        <Text style={styles.tagline}>
          Her gün bir kıvılcım. <Text style={{ fontSize: 14 }}>✦</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131311', // Dark background from theme
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -80, // slightly above center
  },
  logoContainer: {
    marginBottom: 24,
  },
  brandText: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 56,
    color: '#E8E0D0', // Cream text
    letterSpacing: -1,
  },
  divider: {
    width: 60,
    height: 1,
    backgroundColor: '#4A3F33',
    marginTop: 40,
  },
  bottomShape: {
    position: 'absolute',
    bottom: -height * 0.1,
    right: -width * 0.15,
    width: width * 0.6,
    height: height * 0.4,
    backgroundColor: '#1C1A14',
    borderTopLeftRadius: 100,
    borderTopRightRadius: 40,
    transform: [{ rotate: '-10deg' }],
    zIndex: 0,
  },
  bottomContent: {
    position: 'absolute',
    bottom: 80,
    zIndex: 1,
  },
  tagline: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 20,
    color: '#A89A84',
    letterSpacing: 0.5,
  }
});

export default LaunchScreen;

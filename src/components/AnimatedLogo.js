import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View, AccessibilityInfo } from 'react-native';
import Svg, { Circle, Defs, G, Line, LinearGradient, Path, RadialGradient, Stop } from 'react-native-svg';

// Vector version of the Albor/Spark mark (book + rising sun), split into layers
// so each part can be animated independently. The viewBox is centred on the sun
// (512, 540) so scale transforms pivot around it.
const VIEW_BOX = '112 140 800 800';
const VB_SIZE = 800;

// Deep Petrol night behind the rising gold sun (was navy #1D2F4C).
export const LOGO_BACKGROUND = '#1D4A47';
// Deprecated alias kept for older imports.
export const LOGO_NAVY = LOGO_BACKGROUND;

const Glow = () => (
  <Svg width="100%" height="100%" viewBox={VIEW_BOX}>
    <Defs>
      <RadialGradient id="alGlow" cx="512" cy="530" r="320" gradientUnits="userSpaceOnUse">
        <Stop offset="0" stopColor="#F7B24F" stopOpacity="0.7" />
        <Stop offset="0.45" stopColor="#E39A45" stopOpacity="0.28" />
        <Stop offset="1" stopColor="#E39A45" stopOpacity="0" />
      </RadialGradient>
    </Defs>
    <Circle cx="512" cy="530" r="320" fill="url(#alGlow)" />
  </Svg>
);

const RAY = '#F0BE72';
const Rays = () => (
  <Svg width="100%" height="100%" viewBox={VIEW_BOX}>
    <G stroke={RAY} strokeLinecap="round">
      <Line x1="512" y1="175" x2="512" y2="400" strokeWidth="8" />
      <Line x1="342" y1="310" x2="436" y2="416" strokeWidth="9" />
      <Line x1="682" y1="310" x2="588" y2="416" strokeWidth="9" />
      <Line x1="282" y1="412" x2="384" y2="468" strokeWidth="8" />
      <Line x1="742" y1="412" x2="640" y2="468" strokeWidth="8" />
      <Line x1="216" y1="498" x2="356" y2="528" strokeWidth="7" />
      <Line x1="808" y1="498" x2="668" y2="528" strokeWidth="7" />
    </G>
    <G fill={RAY}>
      <Circle cx="330" cy="262" r="5" />
      <Circle cx="694" cy="262" r="5" />
      <Circle cx="459" cy="358" r="5" />
      <Circle cx="565" cy="358" r="5" />
      <Circle cx="384" cy="442" r="4.5" />
      <Circle cx="640" cy="442" r="4.5" />
    </G>
  </Svg>
);

const Sun = () => (
  <Svg width="100%" height="100%" viewBox={VIEW_BOX}>
    <Defs>
      <RadialGradient id="alSun" cx="500" cy="495" r="135" gradientUnits="userSpaceOnUse">
        <Stop offset="0" stopColor="#FFF1CC" />
        <Stop offset="0.6" stopColor="#FEDC94" />
        <Stop offset="1" stopColor="#F7B85C" />
      </RadialGradient>
    </Defs>
    <Circle cx="512" cy="540" r="103" fill="url(#alSun)" />
  </Svg>
);

export const Book = () => (
  <Svg width="100%" height="100%" viewBox={VIEW_BOX}>
    <Defs>
      <LinearGradient id="alPageL" x1="200" y1="570" x2="512" y2="760" gradientUnits="userSpaceOnUse">
        <Stop offset="0" stopColor="#FDEFD0" />
        <Stop offset="1" stopColor="#F7D39A" />
      </LinearGradient>
      <LinearGradient id="alPageR" x1="824" y1="570" x2="512" y2="760" gradientUnits="userSpaceOnUse">
        <Stop offset="0" stopColor="#FDEFD0" />
        <Stop offset="1" stopColor="#F7D39A" />
      </LinearGradient>
      <LinearGradient id="alCover" x1="0" y1="660" x2="0" y2="806" gradientUnits="userSpaceOnUse">
        <Stop offset="0" stopColor="#3B8C88" />
        <Stop offset="1" stopColor="#226763" />
      </LinearGradient>
    </Defs>
    <Path d="M130,700 C300,665 455,700 512,752 C569,700 724,665 894,700 L894,772 C735,738 580,758 520,806 L504,806 C444,758 289,738 130,772 Z" fill="url(#alCover)" />
    <Path d="M130,700 C300,668 455,705 512,760 L512,776 C455,722 300,702 130,730 Z" fill="#2A706C" opacity={0.8} />
    <Path d="M894,700 C724,668 569,705 512,760 L512,776 C569,722 724,702 894,730 Z" fill="#2A706C" opacity={0.8} />
    <Path d="M142,690 L210,600 C330,560 460,570 512,662 L512,775 C455,700 300,665 142,690 Z" fill="#E4AE68" />
    <Path d="M882,690 L814,600 C694,560 564,570 512,662 L512,775 C569,700 724,665 882,690 Z" fill="#E4AE68" />
    <Path d="M150,672 L214,588 C334,550 462,560 512,650 L512,760 C455,690 300,652 150,672 Z" fill="url(#alPageL)" />
    <Path d="M874,672 L810,588 C690,550 562,560 512,650 L512,760 C569,690 724,652 874,672 Z" fill="url(#alPageR)" />
  </Svg>
);

/**
 * Animated brand mark for the loading screen.
 * Intro: the book is already there (matches the native splash image), the sun
 * rises from behind the pages, the glow blooms and the rays fan out.
 * Then it idles with a slow "breathing" glow/ray shimmer while loading.
 */
const AnimatedLogo = ({ size = 200 }) => {
  const sunRise = useRef(new Animated.Value(0)).current;
  const raysIn = useRef(new Animated.Value(0)).current;
  const glowIn = useRef(new Animated.Value(0)).current;
  const breath = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let loop;
    let cancelled = false;

    const run = (reduceMotion) => {
      if (cancelled) return;
      if (reduceMotion) {
        sunRise.setValue(1);
        raysIn.setValue(1);
        glowIn.setValue(1);
        return;
      }
      Animated.parallel([
        Animated.timing(sunRise, {
          toValue: 1,
          duration: 1100,
          delay: 150,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(glowIn, {
          toValue: 1,
          duration: 900,
          delay: 650,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(raysIn, {
          toValue: 1,
          duration: 800,
          delay: 850,
          easing: Easing.out(Easing.back(1.4)),
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (!finished || cancelled) return;
        loop = Animated.loop(
          Animated.sequence([
            Animated.timing(breath, {
              toValue: 1,
              duration: 1800,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(breath, {
              toValue: 0,
              duration: 1800,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
          ]),
        );
        loop.start();
      });
    };

    AccessibilityInfo.isReduceMotionEnabled()
      .then(run)
      .catch(() => run(false));

    return () => {
      cancelled = true;
      loop?.stop();
      sunRise.stopAnimation();
      raysIn.stopAnimation();
      glowIn.stopAnimation();
      breath.stopAnimation();
    };
  }, [sunRise, raysIn, glowIn, breath]);

  const unit = size / VB_SIZE;

  const sunStyle = {
    opacity: sunRise.interpolate({ inputRange: [0, 0.25, 1], outputRange: [0, 1, 1] }),
    transform: [
      { translateY: sunRise.interpolate({ inputRange: [0, 1], outputRange: [150 * unit, 0] }) },
      { scale: breath.interpolate({ inputRange: [0, 1], outputRange: [1, 1.03] }) },
    ],
  };

  const glowStyle = {
    opacity: Animated.multiply(
      glowIn,
      breath.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }),
    ),
    transform: [
      {
        scale: Animated.add(
          glowIn.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }),
          breath.interpolate({ inputRange: [0, 1], outputRange: [0, 0.1] }),
        ),
      },
    ],
  };

  const raysStyle = {
    opacity: Animated.multiply(
      raysIn,
      breath.interpolate({ inputRange: [0, 1], outputRange: [1, 0.65] }),
    ),
    transform: [
      {
        scale: Animated.add(
          raysIn.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1] }),
          breath.interpolate({ inputRange: [0, 1], outputRange: [0, 0.035] }),
        ),
      },
    ],
  };

  return (
    <View style={{ width: size, height: size }} accessible={false} pointerEvents="none">
      <Animated.View style={[StyleSheet.absoluteFill, glowStyle]}>
        <Glow />
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, raysStyle]}>
        <Rays />
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, sunStyle]}>
        <Sun />
      </Animated.View>
      <View style={StyleSheet.absoluteFill}>
        <Book />
      </View>
    </View>
  );
};

export default AnimatedLogo;

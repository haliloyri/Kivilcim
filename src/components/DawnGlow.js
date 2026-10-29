import React from 'react';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';

// Soft dawn-gold light behind the top-right of a screen (DESIGN.md: gold is for
// light). Decorative and fixed; place it first inside the screen root, before
// the scrolling content. Kept to the Home and Paywall screens on purpose.
const OPACITY_LIGHT = 0.34;
const OPACITY_DARK = 0.22;

const DawnGlow = ({ strength = 1, top = 0, height = 380 }) => {
  const { colors, isDark } = useTheme();
  const opacity = (isDark ? OPACITY_DARK : OPACITY_LIGHT) * strength;

  return (
    <Svg
      width="100%"
      height={height}
      pointerEvents="none"
      style={{ position: 'absolute', top, left: 0, right: 0 }}
    >
      <Defs>
        <RadialGradient id="dawnGlow" cx="0.85" cy="-0.1" rx="0.72" ry="0.62" fx="0.85" fy="-0.1">
          <Stop offset="0" stopColor={colors.dawn} stopOpacity={opacity} />
          <Stop offset="1" stopColor={colors.dawn} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill="url(#dawnGlow)" />
    </Svg>
  );
};

export default DawnGlow;

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getCareerVisualState } from '../../constants/careerVisuals';

/** Decorative rank mark. Parent controls the accessible title/state. */
const CareerNodeMark = ({ node, status = 'future', isDark = false, size = 48, style }) => {
  const state = getCareerVisualState(node?.visualKey, status, isDark);
  const iconSize = Math.max(12, Math.round(size * 0.42));
  const completed = status === 'completed';
  return (
    <View accessible={false} importantForAccessibility="no-hide-descendants" style={[styles.frame, { width: size, height: size, borderRadius: size / 2, borderColor: completed || status === 'current' ? `${state.visual.accent}88` : isDark ? '#4B4A4F' : '#D6D0C9' }, style]}>
      <LinearGradient colors={state.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.fill, { borderRadius: size / 2 }]}>
        <Ionicons name={state.icon} size={iconSize} color={state.iconColor} />
      </LinearGradient>
      {completed ? <View style={[styles.check, { width: Math.max(12, size * 0.31), height: Math.max(12, size * 0.31), borderRadius: size / 2, backgroundColor: state.visual.accent }]}><Ionicons name="checkmark" size={Math.max(9, size * 0.2)} color="#FFFFFF" /></View> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  frame: { borderWidth: 1.5, padding: 2 },
  fill: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  check: { position: 'absolute', right: -2, bottom: -2, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.65)' },
});

export default CareerNodeMark;

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const ART = {
  exploration: { icon: 'compass-outline', start: '#202D62', end: '#59418C', glow: '#F5C96B', accent: '#9AC8FF' },
  depth: { icon: 'bulb-outline', start: '#263D42', end: '#285A56', glow: '#EBC77E', accent: '#A9E4CB' },
  transfer: { icon: 'chatbubbles-outline', start: '#5C3149', end: '#A45B42', glow: '#FFD28A', accent: '#FFC1AE' },
};

const CareerPathArtwork = ({ pathId, compact = false, style }) => {
  const art = ART[pathId] || ART.exploration;
  return (
    <LinearGradient accessible={false} importantForAccessibility="no-hide-descendants" colors={[art.start, art.end]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.canvas, compact && styles.compact, style]}>
      <View style={[styles.orb, styles.orbOne, { backgroundColor: `${art.glow}2E` }]} />
      <View style={[styles.orb, styles.orbTwo, { borderColor: `${art.accent}55` }]} />
      <View style={[styles.route, { borderColor: `${art.accent}99` }]} />
      <View style={[styles.moon, { backgroundColor: `${art.glow}2E`, borderColor: `${art.glow}A8` }]}>
        <Ionicons name={art.icon} size={compact ? 23 : 40} color={art.glow} />
      </View>
      <View style={[styles.star, styles.starOne, { backgroundColor: art.glow }]} />
      <View style={[styles.star, styles.starTwo, { backgroundColor: art.accent }]} />
      <View style={[styles.star, styles.starThree, { backgroundColor: art.glow }]} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  canvas: { minHeight: 224, overflow: 'hidden', borderRadius: 24 },
  compact: { minHeight: 76, borderRadius: 18 },
  orb: { position: 'absolute', borderRadius: 999 },
  orbOne: { width: 240, height: 240, top: -90, right: -65 },
  orbTwo: { width: 144, height: 144, left: -65, bottom: -64, borderWidth: 1 },
  route: { position: 'absolute', width: 260, height: 136, right: -72, bottom: -42, borderWidth: 1.5, borderRadius: 150, transform: [{ rotate: '-22deg' }] },
  moon: { position: 'absolute', width: 92, height: 92, borderRadius: 46, borderWidth: 1, alignItems: 'center', justifyContent: 'center', right: 26, bottom: 29 },
  star: { position: 'absolute', width: 5, height: 5, borderRadius: 3 },
  starOne: { left: '21%', top: '23%' },
  starTwo: { left: '37%', top: '47%' },
  starThree: { right: '31%', top: '22%' },
});

export default CareerPathArtwork;

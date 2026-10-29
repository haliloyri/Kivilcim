import React from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import CareerNodeMark from './CareerNodeMark';

const ON_HERO = '#F5F1E8';
const ON_HERO_SOFT = '#D5E4E0';
const ON_DAWN = '#2A1E08';
const MARK_SIZE = 44;

// Brand motif: sun rising over the hero card (same as Home). Decorative only.
const HeroSun = ({ color }) => (
  <Svg width={168} height={130} viewBox="0 0 168 130" pointerEvents="none" style={{ position: 'absolute', right: -34, top: -30, transform: [{ scaleY: -1 }] }}>
    <Circle cx={96} cy={104} r={84} fill={color} opacity={0.08} />
    <Circle cx={96} cy={104} r={62} fill={color} opacity={0.14} />
    <Circle cx={96} cy={104} r={40} fill={color} opacity={0.95} />
    <Line x1={96} y1={40} x2={96} y2={22} stroke={color} strokeWidth={3} strokeLinecap="round" opacity={0.85} />
    <Line x1={60} y1={52} x2={50} y2={40} stroke={color} strokeWidth={3} strokeLinecap="round" opacity={0.85} />
    <Line x1={132} y1={52} x2={142} y2={40} stroke={color} strokeWidth={3} strokeLinecap="round" opacity={0.85} />
    <Line x1={40} y1={78} x2={24} y2={72} stroke={color} strokeWidth={3} strokeLinecap="round" opacity={0.85} />
    <Line x1={152} y1={78} x2={168} y2={72} stroke={color} strokeWidth={3} strokeLinecap="round" opacity={0.85} />
  </Svg>
);

/**
 * "Yolum" hero: current title, progress to the next one, a compact step
 * indicator and the screen's single primary action.
 * steps: [{ id, node, label, state: 'done' | 'next' | 'future', onPress, setRef }]
 */
const CareerHero = ({ colors, background, pathChip, eyebrow, title, copy, next, steps = [], cta, onShare, shareLabel }) => {
  const surface = colors.heroSurface || colors.primary;
  const dawn = colors.dawn || '#E9A94B';

  return (
    <View style={[styles.card, { backgroundColor: surface, borderColor: colors.heroBorder || surface }]}>
      {background ? (
        <>
          <ImageBackground source={background} resizeMode="cover" imageStyle={styles.bgImage} style={StyleSheet.absoluteFill} pointerEvents="none" />
          <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.scrim]} />
        </>
      ) : <HeroSun color={dawn} />}
      {onShare ? (
        <TouchableOpacity accessibilityRole="button" accessibilityLabel={shareLabel} onPress={onShare} style={styles.share}>
          <Ionicons name="share-outline" size={19} color={ON_HERO} />
        </TouchableOpacity>
      ) : null}
      {pathChip ? (
        <View style={[styles.chip, { borderColor: dawn }]}>
          <Ionicons name={pathChip.icon} size={15} color={dawn} />
          <Text selectable style={[styles.chipText, { color: dawn }]}>{pathChip.label}</Text>
        </View>
      ) : <Text selectable style={[styles.eyebrow, { color: dawn }]}>{eyebrow}</Text>}
      <Text selectable style={styles.title}>{title}</Text>
      <Text selectable style={styles.copy}>{copy}</Text>

      {next ? (
        <View style={styles.next}>
          <View style={styles.nextHeader}>
            <Text selectable numberOfLines={1} style={styles.nextLabel}>{next.label}</Text>
            <Text selectable style={[styles.nextPct, { color: dawn }]}>{`${next.pct}%`}</Text>
          </View>
          <View style={styles.track}><View style={[styles.fill, { width: `${Math.max(4, next.pct)}%`, backgroundColor: dawn }]} /></View>
          {next.remaining ? <Text selectable style={styles.remaining}>{next.remaining}</Text> : null}
        </View>
      ) : null}

      {steps.length ? (
        <View style={styles.steps}>
          {steps.map((step, index) => (
            <TouchableOpacity
              key={step.id}
              ref={step.setRef}
              accessibilityRole="button"
              accessibilityLabel={step.accessibilityLabel || step.label}
              onPress={step.onPress}
              activeOpacity={0.8}
              style={styles.step}
            >
              {index < steps.length - 1 ? <View style={[styles.link, { backgroundColor: step.state === 'done' ? ON_HERO : 'rgba(255,255,255,0.3)' }]} /> : null}
              {step.node ? (
                <View style={[styles.mark, step.state === 'next' && { borderColor: dawn }]}>
                  <CareerNodeMark node={step.node} status={step.state === 'done' ? 'completed' : step.state === 'next' ? 'current' : 'future'} isDark size={MARK_SIZE} showCheck={false} />
                </View>
              ) : (
              <View style={[
                  styles.dot,
                  step.state === 'done' && { backgroundColor: ON_HERO },
                  step.state === 'next' && { borderWidth: 2, borderColor: dawn, backgroundColor: surface },
                  step.state === 'future' && { backgroundColor: 'rgba(255,255,255,0.14)' },
                ]}>
                  <Ionicons
                    name={step.state === 'done' ? 'checkmark' : step.state === 'next' ? 'sparkles' : 'lock-closed'}
                    size={step.state === 'future' ? 11 : 13}
                    color={step.state === 'done' ? surface : step.state === 'next' ? dawn : '#BFD6D1'}
                  />
                </View>
              )}
              <Text numberOfLines={2} style={[styles.stepLabel, step.state === 'future' && { color: '#BFD6D1', fontFamily: 'Inter_500Medium' }]}>{step.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}

      {cta ? (
        <TouchableOpacity accessibilityRole="button" accessibilityLabel={cta.label} accessibilityState={{ disabled: !!cta.disabled }} onPress={cta.onPress} style={[styles.cta, { backgroundColor: dawn, opacity: cta.disabled ? 0.55 : 1 }]}>
          <Text selectable style={styles.ctaText}>{cta.label}</Text>
          <Ionicons name="arrow-forward" size={18} color={ON_DAWN} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: { borderRadius: 24, borderWidth: StyleSheet.hairlineWidth, padding: 20, overflow: 'hidden' },
  bgImage: { borderRadius: 24 },
  scrim: { backgroundColor: 'rgba(8,24,28,0.28)' },
  share: { position: 'absolute', right: 12, top: 12, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.14)', alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  chip: { alignSelf: 'flex-start', minHeight: 32, borderWidth: 1, borderRadius: 16, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: 'rgba(233,169,75,0.16)' },
  chipText: { fontFamily: 'Inter_700Bold', fontSize: 13 },
  eyebrow: { fontFamily: 'Inter_600SemiBold', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' },
  title: { marginTop: 10, maxWidth: '78%', color: ON_HERO, fontFamily: 'PlayfairDisplay_700Bold', fontSize: 30, lineHeight: 35 },
  copy: { marginTop: 6, maxWidth: '88%', color: ON_HERO_SOFT, fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20 },
  next: { marginTop: 18, gap: 8 },
  nextHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  nextLabel: { flex: 1, color: ON_HERO, fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  nextPct: { fontFamily: 'Inter_700Bold', fontSize: 12, fontVariant: ['tabular-nums'] },
  track: { height: 6, borderRadius: 3, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.2)' },
  fill: { height: '100%', borderRadius: 3 },
  remaining: { color: '#BFD6D1', fontFamily: 'Inter_400Regular', fontSize: 12 },
  steps: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 16 },
  step: { flex: 1, minHeight: 44, alignItems: 'center', gap: 6 },
  link: { position: 'absolute', top: MARK_SIZE / 2 + 2, left: '50%', width: '100%', height: 2 },
  mark: { borderRadius: MARK_SIZE / 2 + 3, borderWidth: 2, borderColor: 'transparent', padding: 1, backgroundColor: 'rgba(8,24,28,0.45)' },
  dot: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  stepLabel: { paddingHorizontal: 2, textAlign: 'center', color: ON_HERO, fontFamily: 'Inter_600SemiBold', fontSize: 11, lineHeight: 14 },
  cta: { minHeight: 52, marginTop: 18, paddingHorizontal: 18, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  ctaText: { color: ON_DAWN, fontFamily: 'Inter_600SemiBold', fontSize: 16 },
});

export default CareerHero;

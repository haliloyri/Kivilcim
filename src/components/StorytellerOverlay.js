/**
 * StorytellerOverlay
 *
 * Full-screen modal for "Storyteller Mode".
 * Shows talking points from the story, a context selector,
 * and a 30-second practice timer. No audio recording.
 *
 * Props:
 *   visible       – boolean
 *   story         – story object (title, body, parent_cat, cat, min)
 *   variant       – currently selected MicroVariant
 *   isPremium     – if false, shows paywall gate
 *   onClose()     – dismiss overlay
 *   onDone()      – user tapped "I told it!" — triggers mark_used
 *   onPremiumTap()
 *   colors / layout / isDark / lang
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { t } from '../locales/i18n';

const TIMER_SECONDS = 30;

const CONTEXT_KEYS = [
  { key: 'meeting',  i18nKey: 'mv_storyteller_context_meeting',  icon: 'briefcase-outline' },
  { key: 'oneonone', i18nKey: 'mv_storyteller_context_oneonone', icon: 'person-outline' },
  { key: 'family',   i18nKey: 'mv_storyteller_context_family',   icon: 'home-outline' },
  { key: 'social',   i18nKey: 'mv_storyteller_context_social',   icon: 'people-outline' },
];

/** Extract up to 3 talking points from a variant or story body */
const buildTalkingPoints = (variant, story) => {
  if (!variant) return [];
  const points = [];
  const body = variant.body || '';

  // Point 1: variant body (punchline / main idea)
  if (body) points.push(body);

  // Point 2: 30-sec version if different
  const thirtySec = (story?.thirty_sec || '').trim();
  if (thirtySec && thirtySec !== body) points.push(thirtySec);

  // Point 3: reflection/question marker fallback
  const match = (story?.body || '').match(/&&([\s\S]*?)&&/);
  const reflection = match ? match[1].trim() : '';
  if (reflection && reflection !== body && reflection !== thirtySec) {
    points.push(reflection);
  }

  return points.slice(0, 3);
};

const StorytellerOverlay = ({
  visible,
  story,
  variant,
  isPremium,
  onClose,
  onDone,
  onPremiumTap,
  colors,
  layout,
  isDark,
  lang,
}) => {
  const [selectedContext, setSelectedContext] = useState('social');
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [timerDone, setTimerDone] = useState(false);
  const intervalRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const talkingPoints = buildTalkingPoints(variant, story);

  // Reset state on open
  useEffect(() => {
    if (visible) {
      setSelectedContext('social');
      setTimerActive(false);
      setTimeLeft(TIMER_SECONDS);
      setTimerDone(false);
    }
  }, [visible]);

  // Timer logic
  useEffect(() => {
    if (!timerActive) {
      clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setTimerActive(false);
          setTimerDone(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [timerActive]);

  // Pulse animation while timer is active
  useEffect(() => {
    if (timerActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.08, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
  }, [timerActive, pulseAnim]);

  const handleStartTimer = useCallback(() => {
    setTimeLeft(TIMER_SECONDS);
    setTimerDone(false);
    setTimerActive(true);
  }, []);

  const handleRestart = useCallback(() => {
    setTimeLeft(TIMER_SECONDS);
    setTimerDone(false);
    setTimerActive(true);
  }, []);

  const styles = buildStyles(colors, layout, isDark);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={styles.safe}>
        {/* ── Header ────────────────────────────────────────────── */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} accessibilityRole="button">
            <Ionicons name="chevron-down" size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('mv_storyteller_title', lang)}</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* ── Premium gate ──────────────────────────────────────── */}
        {!isPremium ? (
          <View style={styles.premiumGate}>
            <Text style={{ fontSize: 48, marginBottom: 16 }}>🎤</Text>
            <Text style={styles.gateTitle}>{t('mv_premium_locked_storyteller', lang)}</Text>
            <Text style={styles.gateSub}>{t('mv_unlock_premium', lang)}</Text>
            <TouchableOpacity style={styles.gateBtn} onPress={onPremiumTap}>
              <Ionicons name="sparkles" size={14} color="#E8A838" />
              <Text style={styles.gateBtnText}>Premium</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            {/* Story title */}
            <Text style={styles.storyTitle} numberOfLines={2}>{story?.title || ''}</Text>

            {/* Context selector */}
            <Text style={styles.sectionLabel}>{t('mv_storyteller_context_social', lang)}</Text>
            <View style={styles.contextRow}>
              {CONTEXT_KEYS.map(ctx => (
                <TouchableOpacity
                  key={ctx.key}
                  style={[
                    styles.contextChip,
                    selectedContext === ctx.key && { borderColor: colors.primary, backgroundColor: `${colors.primary}18` },
                  ]}
                  onPress={() => setSelectedContext(ctx.key)}
                >
                  <Ionicons
                    name={ctx.icon}
                    size={13}
                    color={selectedContext === ctx.key ? colors.primary : colors.textSecondary}
                  />
                  <Text style={[
                    styles.contextChipText,
                    { color: selectedContext === ctx.key ? colors.primary : colors.textSecondary },
                  ]}>
                    {t(ctx.i18nKey, lang)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Talking points */}
            {talkingPoints.length > 0 && (
              <View style={styles.pointsCard}>
                {talkingPoints.map((point, idx) => (
                  <View key={idx} style={[styles.pointRow, idx > 0 && styles.pointDivider]}>
                    <View style={[styles.pointBadge, { backgroundColor: `${colors.primary}22` }]}>
                      <Text style={[styles.pointBadgeText, { color: colors.primary }]}>{idx + 1}</Text>
                    </View>
                    <Text style={styles.pointText}>{point}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* 30s Timer */}
            <View style={styles.timerSection}>
              <Text style={styles.timerLabel}>{t('mv_storyteller_practice_30s', lang)}</Text>
              <Animated.View style={[styles.timerCircle, { transform: [{ scale: pulseAnim }] },
                timerDone && { borderColor: colors.primary },
              ]}>
                <Text style={[styles.timerNum, timerDone && { color: colors.primary }]}>
                  {timerDone ? '✓' : String(timeLeft)}
                </Text>
                <Text style={styles.timerSec}>{timerDone ? '' : 's'}</Text>
              </Animated.View>
              {!timerActive && !timerDone && (
                <TouchableOpacity style={styles.timerStartBtn} onPress={handleStartTimer}>
                  <Ionicons name="play" size={16} color={colors.primary} />
                  <Text style={[styles.timerBtnText, { color: colors.primary }]}>Başla</Text>
                </TouchableOpacity>
              )}
              {timerActive && (
                <TouchableOpacity style={styles.timerStartBtn} onPress={() => setTimerActive(false)}>
                  <Ionicons name="stop" size={16} color={colors.textSecondary} />
                  <Text style={[styles.timerBtnText, { color: colors.textSecondary }]}>Dur</Text>
                </TouchableOpacity>
              )}
              {timerDone && (
                <TouchableOpacity style={styles.timerStartBtn} onPress={handleRestart}>
                  <Ionicons name="refresh" size={16} color={colors.textSecondary} />
                  <Text style={[styles.timerBtnText, { color: colors.textSecondary }]}>Tekrar</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Done CTA */}
            <TouchableOpacity style={styles.doneBtn} onPress={onDone}>
              <Ionicons name="checkmark-circle" size={18} color="#fff" />
              <Text style={styles.doneBtnText}>{t('mv_storyteller_done', lang)}</Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );
};

const buildStyles = (colors, layout, isDark) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: layout.padding.horizontal,
      paddingVertical: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    closeBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.backgroundDark,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitle: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 16,
      color: colors.text,
      letterSpacing: 0.2,
    },
    content: {
      paddingHorizontal: layout.padding.horizontal,
      paddingTop: 20,
    },
    storyTitle: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: 20,
      color: colors.text,
      lineHeight: 28,
      marginBottom: 20,
    },
    sectionLabel: {
      fontFamily: 'Inter_500Medium',
      fontSize: 10,
      color: colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 10,
    },
    contextRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 24,
    },
    contextChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: isDark ? colors.backgroundDark : '#F7F3EC',
    },
    contextChipText: {
      fontFamily: 'Inter_500Medium',
      fontSize: 12,
    },
    pointsCard: {
      backgroundColor: isDark ? colors.backgroundDark : '#FAFAF8',
      borderRadius: layout.radius.card,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 24,
      overflow: 'hidden',
    },
    pointRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    pointDivider: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
    },
    pointBadge: {
      width: 24,
      height: 24,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 1,
    },
    pointBadgeText: {
      fontFamily: 'Inter_700Bold',
      fontSize: 12,
    },
    pointText: {
      flex: 1,
      fontFamily: 'Inter_400Regular',
      fontSize: 15,
      color: colors.text,
      lineHeight: 24,
    },
    timerSection: {
      alignItems: 'center',
      marginBottom: 28,
    },
    timerLabel: {
      fontFamily: 'Inter_500Medium',
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 16,
      textAlign: 'center',
    },
    timerCircle: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 3,
      borderColor: colors.border,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 14,
      flexDirection: 'row',
      alignItems: 'center',
    },
    timerNum: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: 36,
      color: colors.text,
    },
    timerSec: {
      fontFamily: 'Inter_400Regular',
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 8,
      marginLeft: 2,
    },
    timerStartBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 20,
      paddingVertical: 9,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: isDark ? colors.backgroundDark : '#F7F3EC',
    },
    timerBtnText: {
      fontFamily: 'Inter_500Medium',
      fontSize: 13,
    },
    doneBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: colors.primary,
      borderRadius: layout.radius.card,
      paddingVertical: 14,
      marginBottom: 12,
    },
    doneBtnText: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 15,
      color: '#fff',
    },
    // Premium gate
    premiumGate: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: layout.padding.horizontal,
    },
    gateTitle: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: 22,
      color: colors.text,
      textAlign: 'center',
      marginBottom: 8,
    },
    gateSub: {
      fontFamily: 'Inter_400Regular',
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 24,
    },
    gateBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: isDark ? '#3A2E1A' : '#FFF8ED',
      borderRadius: 999,
      borderWidth: 1,
      borderColor: '#E8A83844',
      paddingHorizontal: 24,
      paddingVertical: 12,
    },
    gateBtnText: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 14,
      color: '#E8A838',
    },
  });

export default StorytellerOverlay;

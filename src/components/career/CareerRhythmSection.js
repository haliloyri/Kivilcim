import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getReadHistory } from '../../db/db';
import { useTheme } from '../../context/ThemeContext';
import { t } from '../../locales/i18n';

const HEATMAP_WEEKS = 8;

const CareerRhythmSection = ({ totalReads, streak, longestStreak, todayReadsCount, isPremium, streakFreezeCredits, streakFreezeDates, onUseFreeze, onOpenPaywall }) => {
  const { colors, isDark, lang } = useTheme();
  const { width } = useWindowDimensions();
  const [days, setDays] = useState([]);
  const todayKey = new Date().toISOString().slice(0, 10);
  const protectedToday = (streakFreezeDates || []).includes(todayKey);
  const atRisk = Number(streak) > 0 && Number(todayReadsCount) === 0 && !protectedToday;
  const activeDays = useMemo(() => days.filter((day) => day.level > 0).length, [days]);
  const cellSize = Math.max(10, Math.min(17, Math.floor((width - 118) / HEATMAP_WEEKS)));

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const history = await getReadHistory(70);
        const byDay = Object.fromEntries(history.map((row) => [row.day, Number(row.count) || 0]));
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const mondayOffset = (today.getDay() + 6) % 7;
        const start = new Date(today);
        start.setDate(today.getDate() - mondayOffset - (HEATMAP_WEEKS - 1) * 7);
        const next = Array.from({ length: HEATMAP_WEEKS * 7 }, (_, index) => {
          const date = new Date(start);
          date.setDate(start.getDate() + index);
          const key = date.toISOString().slice(0, 10);
          const count = byDay[key] || 0;
          return { key, future: date > today, level: count === 0 ? 0 : count === 1 ? 1 : count <= 3 ? 2 : 3 };
        });
        if (active) setDays(next);
      } catch (error) {
        if (active) setDays([]);
      }
    };
    load();
    return () => { active = false; };
  }, [totalReads]);

  const columns = useMemo(() => Array.from({ length: HEATMAP_WEEKS }, (_, week) => days.slice(week * 7, week * 7 + 7)), [days]);
  const colorFor = (day) => {
    if (day?.future) return 'transparent';
    if (!day?.level) return isDark ? 'rgba(255,255,255,0.07)' : '#E9E3DA';
    if (day.level === 1) return `${colors.primary}70`;
    if (day.level === 2) return colors.primary;
    return isDark ? '#E8C26D' : '#966E25';
  };
  const showFreeze = atRisk || protectedToday;
  const freezeAction = () => {
    if (protectedToday) return;
    if (isPremium) onUseFreeze?.(todayKey);
    else onOpenPaywall?.();
  };

  return (
    <View style={styles.section}>
      <Text selectable style={[styles.title, { color: colors.text }]}>{t('career.rhythm.title', lang)}</Text>
      <Text selectable style={[styles.copy, { color: colors.textSecondary }]}>{t('career.rhythm.copy', lang)}</Text>
      <View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.background }]}> 
        <View style={styles.stats}>
          <View style={styles.stat}><Text selectable style={[styles.value, { color: colors.primary }]}>{String(streak || 0)}</Text><Text selectable style={[styles.label, { color: colors.textSecondary }]}>{t('streakDays', lang)}</Text></View>
          <View style={styles.stat}><Text selectable style={[styles.value, { color: colors.text }]}>{String(longestStreak || 0)}</Text><Text selectable style={[styles.label, { color: colors.textSecondary }]}>{t('longestStreak', lang)}</Text></View>
          <View style={styles.stat}><Text selectable style={[styles.value, { color: colors.text }]}>{String(activeDays)}</Text><Text selectable style={[styles.label, { color: colors.textSecondary }]}>{t('career.summary.activeDays', lang)}</Text></View>
        </View>
        <Text selectable style={[styles.period, { color: colors.textSecondary }]}>{t('career.rhythm.heatmapLabel', lang, { weeks: HEATMAP_WEEKS, days: activeDays })}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.grid} accessibilityLabel={t('career.rhythm.heatmapLabel', lang, { weeks: HEATMAP_WEEKS, days: activeDays })}>
          {columns.map((week, weekIndex) => <View key={weekIndex} style={styles.column}>{week.map((day) => <View key={day.key} style={{ width: cellSize, height: cellSize, borderRadius: cellSize / 2, backgroundColor: colorFor(day) }} />)}</View>)}
        </ScrollView>
        <View style={styles.legend}><Text selectable style={[styles.legendText, { color: colors.textSecondary }]}>{t('career.rhythm.less', lang)}</Text>{[0, 1, 2, 3].map((level) => <View key={level} style={[styles.legendDot, { backgroundColor: colorFor({ level }) }]} />)}<Text selectable style={[styles.legendText, { color: colors.textSecondary }]}>{t('career.rhythm.more', lang)}</Text></View>
      </View>
      {showFreeze ? <View style={[styles.freeze, { borderColor: colors.border, backgroundColor: colors.backgroundDark }]}><Ionicons name={protectedToday ? 'shield-checkmark-outline' : 'shield-outline'} size={20} color={colors.primary} /><View style={{ flex: 1 }}><Text selectable style={[styles.freezeTitle, { color: colors.text }]}>{t(protectedToday ? 'streakFreezeProtectedTitle' : 'streakFreezeTitle', lang)}</Text><Text selectable style={[styles.freezeCopy, { color: colors.textSecondary }]}>{t(protectedToday ? 'streakFreezeProtectedSub' : isPremium ? 'streakFreezePremiumSub' : 'streakFreezeLockedSub', lang).replace('{{credits}}', String(streakFreezeCredits || 0))}</Text></View>{!protectedToday ? <TouchableOpacity accessibilityRole="button" accessibilityLabel={t(isPremium ? 'streakFreezeUseCta' : 'streakFreezePremiumCta', lang)} onPress={freezeAction} style={[styles.freezeButton, { borderColor: colors.border }]}><Text selectable style={[styles.freezeButtonText, { color: colors.primary }]}>{t(isPremium ? 'streakFreezeUseCta' : 'streakFreezePremiumCta', lang)}</Text></TouchableOpacity> : null}</View> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  section: { gap: 10 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 17 },
  copy: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20 },
  card: { borderWidth: 1, borderRadius: 18, padding: 15, gap: 12 },
  stats: { flexDirection: 'row' },
  stat: { width: '33.333%', gap: 2 },
  value: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 24, fontVariant: ['tabular-nums'] },
  label: { fontFamily: 'Inter_500Medium', fontSize: 11, lineHeight: 15 },
  period: { fontFamily: 'Inter_500Medium', fontSize: 12 },
  grid: { gap: 5, paddingVertical: 2 },
  column: { gap: 5 },
  legend: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 5 },
  legendText: { fontFamily: 'Inter_400Regular', fontSize: 10 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  freeze: { minHeight: 72, borderWidth: 1, borderRadius: 17, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  freezeTitle: { fontFamily: 'Inter_700Bold', fontSize: 13 },
  freezeCopy: { fontFamily: 'Inter_400Regular', fontSize: 11, lineHeight: 15, marginTop: 2 },
  freezeButton: { minHeight: 44, maxWidth: 110, borderWidth: 1, borderRadius: 12, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  freezeButtonText: { fontFamily: 'Inter_700Bold', fontSize: 11, textAlign: 'center' },
});

export default CareerRhythmSection;

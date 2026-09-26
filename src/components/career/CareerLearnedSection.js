import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { t } from '../../locales/i18n';
import { getCategoryTheme } from '../../utils/categoryImages';

/**
 * "Öğrendiklerin" — answers "what did I actually get from this?" with books,
 * ideas, minutes, the strongest area, a small mind map and the latest ideas.
 */
const CareerLearnedSection = ({ summary, onOpenStory }) => {
  const { colors, isDark, lang } = useTheme();
  if (!summary) return null;
  const isEmpty = summary.ideas === 0;
  const maxCount = Math.max(1, ...summary.categories.map((category) => category.count));
  const kpis = [
    [summary.books, 'career.learned.books'],
    [summary.ideas, 'career.learned.ideas'],
    [summary.minutes, 'career.learned.minutes'],
  ];

  return (
    <View style={styles.section}>
      <Text accessibilityRole="header" style={[styles.sectionTitle, { color: colors.text }]}>{t('career.learned.title', lang)}</Text>
      <View style={[styles.card, { backgroundColor: `${colors.primary}10`, borderColor: `${colors.primary}2E` }]}>
        {isEmpty ? (
          <View style={styles.emptyRow}>
            <View style={[styles.emptyIcon, { backgroundColor: `${colors.primary}1F` }]}>
              <Ionicons name="sparkles-outline" size={20} color={colors.primaryText} />
            </View>
            <Text style={[styles.body, { color: colors.textSecondary, flex: 1 }]}>{t('career.learned.empty', lang)}</Text>
          </View>
        ) : (
          <>
            <View style={styles.kpiRow}>
              {kpis.map(([value, labelKey]) => (
                <View key={labelKey} style={styles.kpi}>
                  <Text style={[styles.kpiValue, { color: colors.text }]}>{String(value)}</Text>
                  <Text style={[styles.kpiLabel, { color: colors.textSecondary }]}>{t(labelKey, lang)}</Text>
                </View>
              ))}
            </View>

            {summary.nextBookMilestone ? (
              <View style={styles.milestone}>
                <View style={[styles.track, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#ECE6DA' }]}>
                  <View style={[styles.fill, { backgroundColor: colors.primary, width: `${Math.round((summary.books / summary.nextBookMilestone.target) * 100)}%` }]} />
                </View>
                <Text style={[styles.caption, { color: colors.textSecondary }]}>
                  {t('career.learned.nextBooks', lang, { target: summary.nextBookMilestone.target, remaining: summary.nextBookMilestone.remaining })}
                </Text>
              </View>
            ) : null}

            {summary.strongest ? (
              <View style={[styles.divider, { backgroundColor: `${colors.primary}26` }]} />
            ) : null}

            {summary.strongest ? (
              <View style={styles.block}>
                <Text style={[styles.blockTitle, { color: colors.text }]}>
                  {t('career.learned.strongest', lang, { category: summary.strongest.name })}
                </Text>
                <Text style={[styles.eyebrow, { color: colors.textSecondary }]}>{t('career.learned.map', lang)}</Text>
                {summary.categories.map((category) => {
                  const accent = getCategoryTheme(category.rawName || category.name, isDark).accent;
                  return (
                    <View key={category.name} style={styles.barRow}>
                      <Text numberOfLines={1} style={[styles.barLabel, { color: colors.text }]}>{category.name}</Text>
                      <View style={[styles.barTrack, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#F1ECE1' }]}>
                        <View style={[styles.fill, { backgroundColor: accent, width: `${Math.max(8, Math.round((category.count / maxCount) * 100))}%` }]} />
                      </View>
                      <Text style={[styles.barValue, { color: colors.textSecondary }]}>{category.count}</Text>
                    </View>
                  );
                })}
              </View>
            ) : null}

            {summary.recent.length ? (
              <View style={styles.block}>
                <Text style={[styles.eyebrow, { color: colors.textSecondary }]}>{t('career.learned.recent', lang)}</Text>
                {summary.recent.map((item) => {
                  const accent = getCategoryTheme(item.categoryRaw || item.category, isDark).accent;
                  return (
                    <TouchableOpacity
                      key={item.storyId}
                      accessibilityRole="button"
                      accessibilityLabel={item.title}
                      activeOpacity={0.75}
                      disabled={!onOpenStory}
                      onPress={() => onOpenStory?.(item.storyId)}
                      style={styles.recentRow}
                    >
                      <View style={[styles.recentDot, { backgroundColor: `${accent}1F` }]}>
                        <Ionicons name="bulb-outline" size={15} color={accent} />
                      </View>
                      <View style={{ flex: 1, minWidth: 0 }}>
                        <Text numberOfLines={2} style={[styles.recentTitle, { color: colors.text }]}>{item.title}</Text>
                        {item.book ? <Text numberOfLines={1} style={[styles.caption, { color: colors.textSecondary }]}>{item.book}</Text> : null}
                      </View>
                      {onOpenStory ? <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} /> : null}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: { gap: 10 },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 17 },
  card: { borderWidth: 1, borderRadius: 22, padding: 16, gap: 14 },
  emptyRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  emptyIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  body: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20 },
  kpiRow: { flexDirection: 'row' },
  kpi: { flex: 1, gap: 1 },
  kpiValue: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 30, fontVariant: ['tabular-nums'] },
  kpiLabel: { fontFamily: 'Inter_500Medium', fontSize: 12 },
  milestone: { gap: 6 },
  track: { height: 6, borderRadius: 999, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 999 },
  caption: { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 16 },
  divider: { height: 1 },
  block: { gap: 8 },
  blockTitle: { fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 17 },
  eyebrow: { fontFamily: 'Inter_500Medium', fontSize: 11, letterSpacing: 0.8, textTransform: 'uppercase', marginTop: 2 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  barLabel: { width: 96, fontFamily: 'Inter_500Medium', fontSize: 12 },
  barTrack: { flex: 1, height: 8, borderRadius: 999, overflow: 'hidden' },
  barValue: { width: 22, textAlign: 'right', fontFamily: 'Inter_500Medium', fontSize: 12, fontVariant: ['tabular-nums'] },
  recentRow: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 44 },
  recentDot: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  recentTitle: { fontFamily: 'Inter_500Medium', fontSize: 14, lineHeight: 19 },
});

export default CareerLearnedSection;

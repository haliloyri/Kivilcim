import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PATH_DEFINITIONS } from '../../constants/careerPath';
import { t } from '../../locales/i18n';
import CareerNodeMark from './CareerNodeMark';

const MARK = 50;

const nodeProgress = (node) => {
  const rows = node?.requirementRows || [];
  if (!rows.length) return 0;
  return rows.reduce((sum, row) => sum + Math.min(1, row.target > 0 ? row.current / row.target : 1), 0) / rows.length;
};

/**
 * "Haritam": one vertical line that shows where I came from (shared path,
 * finished ranks), where I am (current rank) and what is ahead (locked ranks
 * and the summit). Replaces the old text-only summit card.
 */
const CareerMap = ({ career, activePathDefinition, colors, isDark, lang, summitLabel, onOpenNode, onSwitchPath, disabled }) => {
  const [showCommon, setShowCommon] = useState(false);
  const pathNodes = activePathDefinition ? career.paths[activePathDefinition.id] || [] : [];
  const nodes = activePathDefinition ? pathNodes : career.commonNodes;
  const commonNodes = career.commonNodes || [];
  const doneCount = nodes.filter((node) => node.status === 'completed').length;
  const accent = colors.primaryText || colors.primary;
  const line = colors.primary;
  const muted = colors.border;
  const otherPaths = PATH_DEFINITIONS.filter((path) => path.id !== activePathDefinition?.id);

  const row = (node, index, list) => {
    const done = node.status === 'completed';
    const current = !done && career.nextNode?.id === node.id;
    const progress = Math.round(nodeProgress(node) * 100);
    const last = index === list.length - 1;
    return (
      <TouchableOpacity
        key={node.id}
        accessibilityRole="button"
        accessibilityLabel={`${t(node.titleKey, lang)}. ${t(done ? 'career.map.done' : current ? 'career.map.current' : 'career.map.ahead', lang)}.`}
        onPress={() => onOpenNode(node)}
        activeOpacity={0.8}
        style={styles.row}
      >
        {!last ? <View style={[styles.link, done ? { backgroundColor: line } : { backgroundColor: muted }]} /> : null}
        <View style={[styles.markRing, current && { borderColor: colors.dawn || '#E9A94B' }]}>
          <CareerNodeMark node={node} status={done ? 'completed' : current ? 'current' : 'future'} isDark={isDark} size={MARK} showCheck={false} />
        </View>
        <View style={styles.rowText}>
          <Text selectable style={[styles.rowTitle, { color: done || current ? colors.text : colors.textSecondary }]}>{t(node.titleKey, lang)}</Text>
          <Text selectable style={[styles.rowSub, { color: colors.textSecondary }]}>{t(done ? 'career.map.done' : current ? 'career.map.current' : 'career.map.ahead', lang)}</Text>
          {current ? <View style={[styles.track, { backgroundColor: colors.surfaceContainerHigh || colors.border }]}><View style={[styles.fill, { width: `${Math.max(4, progress)}%`, backgroundColor: colors.primary }]} /></View> : null}
        </View>
        {current ? <View style={[styles.here, { backgroundColor: colors.dawn || '#E9A94B' }]}><Text style={styles.hereText}>{t('career.map.here', lang)}</Text></View> : null}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.cardBackground || colors.background }]}>
      <Text accessibilityRole="header" selectable style={[styles.title, { color: colors.text }]}>{t('career.map.title', lang)}</Text>
      <Text selectable style={[styles.subtitle, { color: colors.textSecondary }]}>
        {activePathDefinition
          ? t('career.map.progress', lang, { path: t(activePathDefinition.titleKey, lang), done: doneCount, total: nodes.length })
          : t('career.map.progressCommon', lang, { done: doneCount, total: nodes.length })}
      </Text>

      {activePathDefinition && commonNodes.length ? (
        <>
          <TouchableOpacity accessibilityRole="button" accessibilityState={{ expanded: showCommon }} onPress={() => setShowCommon((open) => !open)} style={[styles.fold, { borderColor: colors.border }]}>
            <Ionicons name={showCommon ? 'chevron-down' : 'chevron-forward'} size={16} color={colors.textSecondary} />
            <Text selectable style={[styles.foldText, { color: colors.textSecondary }]}>{t('career.map.common', lang, { count: commonNodes.filter((node) => node.status === 'completed').length })}</Text>
          </TouchableOpacity>
          {showCommon ? commonNodes.map(row) : null}
          <View style={[styles.fork, { borderColor: `${colors.primary}55`, backgroundColor: `${colors.primary}12` }]}>
            <Text selectable style={[styles.forkTitle, { color: accent }]}>{t('career.map.fork', lang, { path: t(activePathDefinition.titleKey, lang) })}</Text>
            <Text selectable style={[styles.forkCopy, { color: colors.textSecondary }]}>{t('career.map.forkOthers', lang, { paths: otherPaths.map((path) => t(path.titleKey, lang)).join(' · ') })}</Text>
            <TouchableOpacity accessibilityRole="button" accessibilityLabel={t('career.switchPath', lang)} onPress={onSwitchPath} style={styles.forkAction}>
              <Text selectable style={[styles.forkActionText, { color: accent }]}>{t('career.switchPath', lang)}</Text>
              <Ionicons name="chevron-forward" size={15} color={accent} />
            </TouchableOpacity>
          </View>
        </>
      ) : null}

      <View style={{ marginTop: 6 }}>{nodes.map(row)}</View>

      <View style={[styles.summit, { borderColor: colors.textSecondary }]}>
        <Ionicons name="trophy-outline" size={22} color={colors.rewardText || colors.textSecondary} />
        <Text selectable style={[styles.summitText, { color: colors.textSecondary }]}>{summitLabel}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 16 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 17 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 13, marginTop: 2, marginBottom: 12 },
  fold: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 6, borderBottomWidth: StyleSheet.hairlineWidth, paddingHorizontal: 4 },
  foldText: { fontFamily: 'Inter_500Medium', fontSize: 13 },
  fork: { borderWidth: 1, borderRadius: 14, padding: 12, marginTop: 10, gap: 3 },
  forkTitle: { fontFamily: 'Inter_700Bold', fontSize: 13 },
  forkCopy: { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 17 },
  forkAction: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 2, alignSelf: 'flex-start' },
  forkActionText: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  row: { minHeight: 68, flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 9, paddingHorizontal: 4 },
  link: { position: 'absolute', left: 4 + MARK / 2 + 1, top: 9 + MARK + 3, bottom: -9, width: 3, borderRadius: 2 },
  markRing: { width: MARK + 6, height: MARK + 6, borderRadius: (MARK + 6) / 2, borderWidth: 2, borderColor: 'transparent', alignItems: 'center', justifyContent: 'center' },
  rowText: { flex: 1, gap: 2 },
  rowTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 15 },
  rowSub: { fontFamily: 'Inter_400Regular', fontSize: 12 },
  track: { height: 5, borderRadius: 3, overflow: 'hidden', marginTop: 5 },
  fill: { height: '100%', borderRadius: 3 },
  here: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4 },
  hereText: { color: '#2A1E08', fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 0.5 },
  summit: { borderWidth: 1, borderStyle: 'dashed', borderRadius: 16, padding: 12, marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 12 },
  summitText: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 19 },
});

export default CareerMap;

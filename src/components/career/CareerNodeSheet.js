import React, { useEffect, useRef } from 'react';
import { AccessibilityInfo, findNodeHandle, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { t } from '../../locales/i18n';
import useReducedMotion from '../../hooks/useReducedMotion';
import CareerNodeMark from './CareerNodeMark';
import { getCareerVisual } from '../../constants/careerVisuals';

const ICONS = {
  stories: 'book-outline',
  categories: 'compass-outline',
  deepInteractions: 'bulb-outline',
  applications: 'chatbubbles-outline',
  activeDays: 'calendar-outline',
};

const CareerNodeSheet = ({ node, onClose }) => {
  const { colors, isDark, lang } = useTheme();
  const reduceMotion = useReducedMotion();
  const titleRef = useRef(null);

  useEffect(() => {
    if (!node) return undefined;
    const timeout = setTimeout(() => {
      const nodeHandle = findNodeHandle(titleRef.current);
      if (nodeHandle) AccessibilityInfo.setAccessibilityFocus(nodeHandle);
    }, 250);
    return () => clearTimeout(timeout);
  }, [node?.id]);

  if (!node) return null;
  const accent = isDark ? getCareerVisual(node.visualKey).accentDark : getCareerVisual(node.visualKey).accent;
  const isDone = node.status === 'completed';
  return (
    <Modal visible transparent animationType={reduceMotion ? 'fade' : 'slide'} onRequestClose={onClose} accessibilityViewIsModal>
      <View style={[styles.backdrop, { backgroundColor: isDark ? 'rgba(0,0,0,0.66)' : 'rgba(36,33,30,0.56)' }]}>
        <View style={[styles.sheet, { backgroundColor: colors.modalSurface, borderColor: colors.border }]}>
          <View style={[styles.handle, { backgroundColor: colors.border }]} />
          <View style={styles.header}>
            <CareerNodeMark node={node} status={node.status} isDark={isDark} size={72} showCheck={false} />
            <View style={{ flex: 1 }}>
              <Text selectable style={[styles.eyebrow, { color: isDone ? accent : colors.dawnText }]}>{t(`career.nodeState.${node.status}`, lang)}</Text>
              <Text ref={titleRef} accessible accessibilityRole="header" selectable style={[styles.title, { color: colors.text }]}>{t(node.titleKey, lang)}</Text>
            </View>
            <TouchableOpacity accessibilityRole="button" accessibilityLabel={t('career.close', lang)} onPress={onClose} style={[styles.close, { backgroundColor: colors.surfaceContainerHigh }]}>
              <Ionicons name="close" size={19} color={colors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
            <View style={[styles.identity, { backgroundColor: `${accent}1A`, borderLeftColor: accent }]}>
              <Text selectable style={[styles.identityText, { color: colors.text }]}>{t(node.identityKey, lang)}</Text>
            </View>
            <Text selectable style={[styles.copy, { color: colors.textSecondary }]}>{t(node.descriptionKey, lang)}</Text>
            {isDone ? null : (
              <>
                <Text selectable style={[styles.requirementsTitle, { color: colors.text }]}>{t('career.requirements', lang)}</Text>
                {node.requirementRows.map((requirement) => {
                  const current = Math.min(requirement.current, requirement.target);
                  const done = requirement.completed || current >= requirement.target;
                  return (
                    <View key={requirement.type} accessibilityLabel={`${t(requirement.labelKey, lang)} ${current}/${requirement.target}`} style={[styles.requirement, { borderColor: colors.border, backgroundColor: colors.cardBackground }]}>
                      <View style={[styles.reqIcon, { backgroundColor: done ? colors.primary : `${accent}22` }]}>
                        <Ionicons name={done ? 'checkmark' : ICONS[requirement.type]} size={18} color={done ? colors.onPrimary : accent} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <View style={styles.reqRow}>
                          <Text selectable style={[styles.requirementName, { color: colors.text }]}>{t(requirement.labelKey, lang)}</Text>
                          <Text selectable style={[styles.requirementValue, { color: done ? colors.primaryText : colors.text }]}>{`${current}/${requirement.target}`}</Text>
                        </View>
                        <View style={[styles.track, { backgroundColor: colors.surfaceContainerHigh }]}>
                          <View style={[styles.fill, { width: `${Math.round((current / Math.max(1, requirement.target)) * 100)}%`, backgroundColor: done ? colors.primary : accent }]} />
                        </View>
                        <Text selectable style={[styles.requirementHow, { color: colors.textSecondary }]}>{t(`career.requirementHow.${requirement.type}`, lang)}</Text>
                      </View>
                    </View>
                  );
                })}
              </>
            )}
            <View style={[styles.reward, { borderColor: colors.mutedText }]}>
              <Ionicons name="sparkles-outline" size={18} color={colors.dawnText} />
              <Text selectable style={[styles.rewardCopy, { color: colors.textSecondary }]}>{t(node.unlockKey, lang)}</Text>
            </View>
            {isDone ? null : <Text selectable style={[styles.footnote, { color: colors.mutedText }]}>{t('career.conditionsSaved', lang)}</Text>}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end' },
  sheet: { maxHeight: '86%', borderTopLeftRadius: 28, borderTopRightRadius: 28, borderWidth: StyleSheet.hairlineWidth, paddingHorizontal: 20, paddingBottom: 28 },
  handle: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, marginVertical: 10 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingBottom: 14 },
  eyebrow: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 0.8, textTransform: 'uppercase' },
  title: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 26, lineHeight: 30, marginTop: 3 },
  close: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 22 },
  content: { gap: 12, paddingBottom: 4 },
  identity: { borderLeftWidth: 3, borderRadius: 14, paddingVertical: 12, paddingHorizontal: 14 },
  identityText: { fontFamily: 'PlayfairDisplay_400Regular_Italic', fontSize: 15, lineHeight: 22 },
  copy: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 21 },
  requirementsTitle: { fontFamily: 'Inter_700Bold', fontSize: 16, marginTop: 4 },
  requirement: { borderWidth: StyleSheet.hairlineWidth, borderRadius: 16, padding: 12, flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  reqIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  reqRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  requirementName: { flex: 1, fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  requirementValue: { fontFamily: 'Inter_700Bold', fontSize: 14, fontVariant: ['tabular-nums'] },
  track: { height: 4, borderRadius: 2, overflow: 'hidden', marginTop: 8 },
  fill: { height: '100%', borderRadius: 2 },
  requirementHow: { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 18, marginTop: 8 },
  reward: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, borderWidth: 1, borderStyle: 'dashed', borderRadius: 14, padding: 12 },
  rewardCopy: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 13, lineHeight: 19 },
  footnote: { fontFamily: 'Inter_400Regular', fontSize: 12, textAlign: 'center' },
});

export default CareerNodeSheet;

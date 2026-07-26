import React, { useEffect, useRef } from 'react';
import { AccessibilityInfo, findNodeHandle, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCareerPath } from '../../context/CareerPathContext';
import { useTheme } from '../../context/ThemeContext';
import { t } from '../../locales/i18n';
import useReducedMotion from '../../hooks/useReducedMotion';
import GuideLight from './GuideLight';

const CareerMigrationSummary = () => {
  const { colors, lang } = useTheme();
  const { showMigrationSummary, markMigrationSummarySeen } = useCareerPath();
  const reduceMotion = useReducedMotion();
  const titleRef = useRef(null);
  useEffect(() => {
    if (!showMigrationSummary) return undefined;
    const timeout = setTimeout(() => {
      const nodeHandle = findNodeHandle(titleRef.current);
      if (nodeHandle) AccessibilityInfo.setAccessibilityFocus(nodeHandle);
    }, 250);
    return () => clearTimeout(timeout);
  }, [showMigrationSummary]);
  if (!showMigrationSummary) return null;
  return <Modal visible transparent animationType={reduceMotion ? 'fade' : 'slide'} onRequestClose={markMigrationSummarySeen} accessibilityViewIsModal><View style={styles.backdrop}><View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}><GuideLight state="gentleReturn" size={56} /><Text ref={titleRef} accessible accessibilityRole="header" selectable style={[styles.title, { color: colors.text }]}>{t('career.migration.title', lang)}</Text><Text selectable style={[styles.copy, { color: colors.textSecondary }]}>{t('career.migration.reads', lang)}</Text><Text selectable style={[styles.copy, { color: colors.textSecondary }]}>{t('career.migration.future', lang)}</Text><Text selectable style={[styles.copy, { color: colors.textSecondary }]}>{t('career.migration.legacy', lang)}</Text><TouchableOpacity accessibilityRole="button" accessibilityLabel={t('career.migration.continue', lang)} onPress={markMigrationSummarySeen} style={[styles.button, { backgroundColor: colors.primary }]}><Text style={styles.buttonText}>{t('career.migration.continue', lang)}</Text></TouchableOpacity></View></View></Modal>;
};
const styles = StyleSheet.create({ backdrop: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: 'rgba(0,0,0,0.5)' }, card: { borderRadius: 22, borderWidth: 1, padding: 24, gap: 12 }, title: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 25 }, copy: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 21 }, button: { marginTop: 6, minHeight: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' }, buttonText: { color: '#FFFFFF', fontFamily: 'Inter_700Bold', fontSize: 15 } });
export default CareerMigrationSummary;

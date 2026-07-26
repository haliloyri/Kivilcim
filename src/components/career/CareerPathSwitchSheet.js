import React, { useEffect, useRef } from 'react';
import { AccessibilityInfo, findNodeHandle, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { t } from '../../locales/i18n';
import useReducedMotion from '../../hooks/useReducedMotion';

const CareerPathSwitchSheet = ({ path, currentTitleKey, nextTitleKey, onCancel, onConfirm }) => {
  const { colors, lang } = useTheme();
  const reduceMotion = useReducedMotion();
  const titleRef = useRef(null);
  useEffect(() => {
    if (!path) return undefined;
    const timeout = setTimeout(() => {
      const nodeHandle = findNodeHandle(titleRef.current);
      if (nodeHandle) AccessibilityInfo.setAccessibilityFocus(nodeHandle);
    }, 250);
    return () => clearTimeout(timeout);
  }, [path?.id]);
  if (!path) return null;
  return <Modal visible transparent animationType={reduceMotion ? 'fade' : 'slide'} onRequestClose={onCancel} accessibilityViewIsModal><View style={styles.backdrop}><View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}><View accessible={false} importantForAccessibility="no-hide-descendants" style={[styles.icon, { backgroundColor: `${colors.primary}1E` }]}><Ionicons name="swap-horizontal-outline" size={24} color={colors.primary} /></View><Text ref={titleRef} accessible accessibilityRole="header" selectable style={[styles.title, { color: colors.text }]}>{t('career.switchConfirm.title', lang)}</Text><Text selectable style={[styles.copy, { color: colors.textSecondary }]}>{t('career.switchConfirm.body', lang, { path: t(path.titleKey, lang) })}</Text><Text selectable style={[styles.assurance, { color: colors.primary }]}>{t('career.switchConfirm.assurance', lang)}</Text><Text selectable style={[styles.preview, { color: colors.textSecondary }]}>{`${t('career.switchConfirm.titlePreview', lang)}: ${t(currentTitleKey, lang)} → ${t(nextTitleKey, lang)}`}</Text><View style={styles.actions}><TouchableOpacity accessibilityRole="button" accessibilityLabel={t('career.switchConfirm.cancel', lang)} onPress={onCancel} style={[styles.secondary, { borderColor: colors.border }]}><Text style={[styles.secondaryText, { color: colors.text }]}>{t('career.switchConfirm.cancel', lang)}</Text></TouchableOpacity><TouchableOpacity accessibilityRole="button" accessibilityLabel={t('career.switchConfirm.confirm', lang)} onPress={onConfirm} style={[styles.primary, { backgroundColor: colors.primary }]}><Text style={styles.primaryText}>{t('career.switchConfirm.confirm', lang)}</Text></TouchableOpacity></View></View></View></Modal>;
};
const styles = StyleSheet.create({ backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.45)' }, card: { borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 1, padding: 24, gap: 12 }, icon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' }, title: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 24 }, copy: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 21 }, assurance: { fontFamily: 'Inter_700Bold', fontSize: 14 }, preview: { fontFamily: 'Inter_500Medium', fontSize: 13 }, actions: { flexDirection: 'row', gap: 10, marginTop: 6 }, secondary: { flex: 1, minHeight: 46, borderWidth: 1, borderRadius: 13, alignItems: 'center', justifyContent: 'center' }, primary: { flex: 1, minHeight: 46, borderRadius: 13, alignItems: 'center', justifyContent: 'center' }, secondaryText: { fontFamily: 'Inter_600SemiBold', fontSize: 14 }, primaryText: { color: '#FFFFFF', fontFamily: 'Inter_700Bold', fontSize: 14 } });
export default CareerPathSwitchSheet;

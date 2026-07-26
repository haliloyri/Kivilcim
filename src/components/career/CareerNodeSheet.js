import React, { useEffect, useRef } from 'react';
import { AccessibilityInfo, findNodeHandle, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { t } from '../../locales/i18n';
import useReducedMotion from '../../hooks/useReducedMotion';
import CareerNodeMark from './CareerNodeMark';

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
  return (
    <Modal visible transparent animationType={reduceMotion ? 'fade' : 'slide'} onRequestClose={onClose} accessibilityViewIsModal>
      <View style={styles.backdrop}>
        <View style={[styles.sheet, { backgroundColor: colors.background, borderColor: colors.border }]}> 
          <View style={[styles.handle, { backgroundColor: colors.border }]} />
          <View style={styles.header}>
            <CareerNodeMark node={node} status={node.status} isDark={isDark} size={46} />
            <View style={{ flex: 1 }}>
              <Text selectable style={[styles.eyebrow, { color: colors.textSecondary }]}>{t(`career.nodeState.${node.status}`, lang)}</Text>
              <Text ref={titleRef} accessible accessibilityRole="header" selectable style={[styles.title, { color: colors.text }]}>{t(node.titleKey, lang)}</Text>
            </View>
            <TouchableOpacity accessibilityRole="button" accessibilityLabel={t('career.close', lang)} onPress={onClose} style={[styles.close, { backgroundColor: isDark ? `${colors.border}66` : `${colors.border}80` }]}>
              <Ionicons name="close" size={19} color={colors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
            <Text selectable style={[styles.copy, { color: colors.textSecondary }]}>{t('career.nodeDetailsCopy', lang)}</Text>
            <Text selectable style={[styles.requirementsTitle, { color: colors.text }]}>{t('career.requirements', lang)}</Text>
            {node.requirementRows.map((requirement) => (
              <View key={requirement.type} accessibilityLabel={`${t(requirement.labelKey, lang)} ${requirement.current}/${requirement.target}`} style={[styles.requirement, { borderColor: colors.border, backgroundColor: colors.backgroundDark }]}>
                <Ionicons name={ICONS[requirement.type]} size={18} color={requirement.completed ? colors.primary : colors.textSecondary} />
                <Text selectable style={[styles.requirementName, { color: colors.text }]}>{t(requirement.labelKey, lang)}</Text>
                <Text selectable style={[styles.requirementValue, { color: requirement.completed ? colors.primary : colors.textSecondary }]}>{`${requirement.current}/${requirement.target}`}</Text>
              </View>
            ))}
            {node.requirementRows.some((requirement) => requirement.type === 'deepInteractions') ? (
              <View style={[styles.requirementHelp, { backgroundColor: colors.backgroundDark }]}> 
                <Ionicons name="bulb-outline" size={17} color={colors.primary} />
                <Text selectable style={[styles.requirementHelpCopy, { color: colors.textSecondary }]}>{t('career.requirementHelp.deepInteractions', lang)}</Text>
              </View>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.42)' },
  sheet: { maxHeight: '78%', borderTopLeftRadius: 26, borderTopRightRadius: 26, borderWidth: 1, paddingHorizontal: 20, paddingBottom: 26 },
  handle: { alignSelf: 'center', width: 38, height: 4, borderRadius: 2, marginVertical: 10 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingBottom: 14 },
  eyebrow: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 0.8, textTransform: 'uppercase' },
  title: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 27, marginTop: 3 },
  close: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 22 },
  content: { gap: 10, paddingBottom: 4 },
  copy: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20, marginBottom: 6 },
  requirementsTitle: { fontFamily: 'Inter_700Bold', fontSize: 16 },
  requirement: { minHeight: 48, borderWidth: 1, borderRadius: 13, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', gap: 9 },
  requirementName: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 14 },
  requirementValue: { fontFamily: 'Inter_700Bold', fontSize: 14, fontVariant: ['tabular-nums'] },
  requirementHelp: { borderRadius: 13, padding: 12, flexDirection: 'row', alignItems: 'flex-start', gap: 9 },
  requirementHelpCopy: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 19 },
});

export default CareerNodeSheet;

import React from 'react';
import { Modal, Pressable, ScrollView, Text, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { t } from '../../locales/i18n';

// Match the app's existing modal presentation without adding a native dependency.
export default function ReaderPanels({
  settingsVisible, onCloseSettings, summaryVisible, onCloseSummary, summary, title,
  fontSize, setFontSize, lineSpacing, setLineSpacing, themePreference, setThemePreference, lang,
}) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = makeStyles(colors);
  const button = (label, onPress, { selected, disabled = false, accessibilityLabel = label } = {}) => (
    <Pressable key={label} onPress={onPress} disabled={disabled} accessibilityRole="button"
      accessibilityLabel={accessibilityLabel} accessibilityState={{ selected, disabled }}
      style={[styles.option, selected && { borderColor: colors.readerAccentText }, disabled && { opacity: 0.4 }]}>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
  const sheet = (visible, onClose, heading, children) => (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityRole="button" accessibilityLabel={t('career.close', lang)} />
        <View accessibilityViewIsModal style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 20), marginTop: insets.top + 16 }]}>
          <View style={styles.headingRow}>
            <Text accessibilityRole="header" style={styles.heading}>{heading}</Text>
            <Pressable onPress={onClose} style={styles.close} accessibilityRole="button" accessibilityLabel={t('career.close', lang)}>
              <Ionicons name="close" size={24} color={colors.text} />
            </Pressable>
          </View>
          <ScrollView style={{ flexShrink: 1 }} contentContainerStyle={{ gap: 16, paddingBottom: 8 }}>
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
  return <>
    {sheet(settingsVisible, onCloseSettings, t('readerSettings', lang), <>
      <Text style={styles.label}>{t('readerFontSize', lang)}</Text>
      <View style={styles.row}>
        {button('A−', () => setFontSize(size => Math.max(12, size - 1)), { disabled: fontSize <= 12, accessibilityLabel: t('readerSmaller', lang) })}
        <Text accessibilityLiveRegion="polite" style={styles.value}>{fontSize}</Text>
        {button('A+', () => setFontSize(size => Math.min(24, size + 1)), { disabled: fontSize >= 24, accessibilityLabel: t('readerLarger', lang) })}
      </View>
      <Text style={styles.label}>{t('readerLineSpacing', lang)}</Text>
      <View style={styles.row}>
        {[['readerSpacingCompact', 1.4], ['readerSpacingNormal', 1.55], ['readerSpacingRelaxed', 1.8]].map(([key, value]) =>
          button(t(key, lang), () => setLineSpacing(value), { selected: lineSpacing === value }))}
      </View>
      <Text style={styles.label}>{t('readerTheme', lang)}</Text>
      <View style={styles.row}>
        {[['themeModeLight', 'light'], ['themeModeDark', 'dark'], ['themeModeSystem', 'system']].map(([key, value]) =>
          button(t(key, lang), () => setThemePreference(value), { selected: themePreference === value }))}
      </View>
    </>)}
    {sheet(summaryVisible, onCloseSummary, t('oneMinuteSummaryCta', lang), <>
      <Text selectable style={[styles.heading, { fontSize: 22 }]}>{title}</Text>
      <Text style={styles.secondary}>{t('oneMinuteSummarySubtitle', lang)}</Text>
      <Text selectable style={{ fontFamily: 'Inter_400Regular', fontSize, lineHeight: Math.round(fontSize * lineSpacing), color: colors.text }}>{summary}</Text>
      {button(t('oneMinuteSummaryFullStory', lang), onCloseSummary)}
    </>)}
  </>;
}

const makeStyles = colors => StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: colors.modalOverlay },
  sheet: { backgroundColor: colors.background, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '90%' },
  headingRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  heading: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 24, color: colors.text, flexShrink: 1 },
  close: { marginLeft: 'auto', minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' },
  option: { minHeight: 44, paddingVertical: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: colors.border, borderRadius: 12, backgroundColor: colors.backgroundDark },
  label: { fontFamily: 'Inter_500Medium', fontSize: 14, color: colors.text },
  value: { fontFamily: 'Inter_600SemiBold', fontSize: 18, color: colors.text, minWidth: 36, textAlign: 'center' },
  secondary: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 20, color: colors.textSecondary },
});

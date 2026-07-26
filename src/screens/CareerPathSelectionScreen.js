import React, { useMemo, useState } from 'react';
import { ActivityIndicator, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useCareerPath } from '../context/CareerPathContext';
import { getNodesForPath, PATH_DEFINITIONS } from '../constants/careerPath';
import { t } from '../locales/i18n';
import CareerPathArtwork from '../components/career/CareerPathArtwork';

const PATH_ICONS = {
  exploration: 'compass-outline',
  depth: 'bulb-outline',
  transfer: 'chatbubbles-outline',
};

const KIVILCIM_HERO = require('../../assets/career/kivilcim-yolu-hero-v1.png');

const CareerPathSelectionScreen = ({ navigation }) => {
  const { colors, layout, isDark, lang } = useTheme();
  const { career, selectPath } = useCareerPath();
  const [selectedPathId, setSelectedPathId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const recommendation = career?.recommendation;
  const recommendedPathId = recommendation?.recommendedPath || null;

  const selectedPath = useMemo(
    () => PATH_DEFINITIONS.find((path) => path.id === selectedPathId) || null,
    [selectedPathId]
  );

  const persistSelection = async () => {
    if (!selectedPath || isSaving) return;
    setIsSaving(true);
    try {
      await selectPath(selectedPath.id);
      navigation.goBack();
    } catch (error) {
      console.warn('[CareerPathSelection] Could not persist path:', error?.message);
      setIsSaving(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={[styles.content, { paddingHorizontal: layout.padding.horizontal, paddingBottom: 36 }]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={t('career.selection.later', lang)}
          onPress={() => navigation.goBack()}
          style={[styles.closeButton, { backgroundColor: colors.backgroundDark, borderColor: colors.border }]}
        >
          <Ionicons name="close" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ImageBackground source={KIVILCIM_HERO} imageStyle={styles.introImage} style={styles.intro}>
        <View style={styles.introScrim} />
        <View style={styles.introContent}>
          <View style={styles.introKicker}><Ionicons name="sparkles-outline" size={15} color="#F9D783" /><Text selectable style={styles.introKickerText}>{t('career.selection.free', lang)}</Text></View>
          <Text selectable style={styles.title}>{t('career.selection.title', lang)}</Text>
          <Text selectable style={styles.subtitle}>{t('career.selection.subtitle', lang)}</Text>
        </View>
      </ImageBackground>

      <View style={[styles.eligibility, { backgroundColor: `${colors.primary}12`, borderColor: `${colors.primary}42` }]}>
        <Ionicons name="information-circle-outline" size={19} color={colors.primary} />
        <Text selectable style={[styles.eligibilityCopy, { color: colors.textSecondary }]}>{t('career.selection.eligibility', lang)}</Text>
      </View>

      {recommendedPathId ? (
        <View style={[styles.recommendation, { backgroundColor: `${colors.primary}14`, borderColor: `${colors.primary}52` }]}>
          <Ionicons name="sparkles-outline" size={18} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <Text selectable style={[styles.recommendationTitle, { color: colors.text }]}>{t('career.selection.recommendationTitle', lang)}</Text>
            <Text selectable style={[styles.recommendationCopy, { color: colors.textSecondary }]}>{t(recommendation.reasonKey, lang)}</Text>
          </View>
        </View>
      ) : null}

      <View style={styles.pathList}>
        {PATH_DEFINITIONS.map((path) => {
          const isSelected = selectedPathId === path.id;
          const isRecommended = recommendedPathId === path.id;
          const nodes = getNodesForPath(path.id);
          return (
            <TouchableOpacity
              key={path.id}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={t(path.titleKey, lang)}
              accessibilityHint={t(path.descriptionKey, lang)}
              onPress={() => setSelectedPathId(path.id)}
              style={[
                styles.pathCard,
                {
                  backgroundColor: colors.background,
                  borderColor: isSelected || isRecommended ? colors.primary : colors.border,
                },
              ]}
            >
              <View style={styles.pathVisual}>
                <CareerPathArtwork pathId={path.id} compact style={styles.pathArtwork} />
                <View style={styles.pathVisualOverlay} />
                <View style={styles.pathHeader}>
                  <View style={styles.pathIcon}>
                    <Ionicons name={PATH_ICONS[path.id]} size={21} color="#FFFFFF" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text selectable style={styles.pathTitle}>{t(path.titleKey, lang)}</Text>
                    <Text selectable style={styles.pathPurpose}>{t(path.descriptionKey, lang)}</Text>
                  </View>
                  <Ionicons name={isSelected ? 'radio-button-on' : 'radio-button-off'} size={22} color="#FFFFFF" />
                </View>
              </View>

              {isRecommended ? <Text selectable style={[styles.recommendedLabel, { color: colors.primary }]}>{t('career.selection.recommended', lang)}</Text> : null}

              <View style={[styles.detailBlock, { borderColor: colors.border }]}>
                <Text selectable style={[styles.detailLabel, { color: colors.textSecondary }]}>{t('career.selection.behaviorLabel', lang)}</Text>
                <Text selectable style={[styles.detailCopy, { color: colors.text }]}>{t(`careerPath.${path.id}.behavior`, lang)}</Text>
              </View>

              <View style={styles.previewBlock}>
                <Text selectable style={[styles.detailLabel, { color: colors.textSecondary }]}>{t('career.selection.rankPreviewLabel', lang)}</Text>
                <View style={styles.rankList}>
                  {nodes.map((node, index) => (
                    <View key={node.id} style={[styles.rankPill, { backgroundColor: isDark ? `${colors.border}6E` : colors.backgroundDark }]}>
                      <Text selectable style={[styles.rankNumber, { color: colors.primary }]}>{index + 1}</Text>
                      <Text selectable style={[styles.rankName, { color: colors.text }]}>{t(node.titleKey, lang)}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={[styles.toolkit, { backgroundColor: `${colors.primary}10` }]}>
                <Ionicons name="construct-outline" size={16} color={colors.primary} />
                <Text selectable style={[styles.toolkitCopy, { color: colors.textSecondary }]}>{t(`careerPath.${path.id}.toolkit`, lang)}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        accessibilityRole="button"
        accessibilityState={{ disabled: !selectedPath || isSaving }}
        accessibilityLabel={t('career.selection.choose', lang)}
        disabled={!selectedPath || isSaving}
        onPress={persistSelection}
        style={[styles.primaryCta, { backgroundColor: colors.primary, opacity: selectedPath && !isSaving ? 1 : 0.48 }]}
      >
        {isSaving ? <ActivityIndicator color={isDark ? colors.backgroundDark : '#FFFFFF'} /> : <Text selectable style={styles.primaryCtaText}>{t('career.selection.choose', lang)}</Text>}
      </TouchableOpacity>
      <TouchableOpacity accessibilityRole="button" onPress={() => navigation.goBack()} style={styles.laterButton}>
        <Text selectable style={[styles.laterText, { color: colors.textSecondary }]}>{t('career.selection.later', lang)}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: { gap: 18 },
  header: { alignItems: 'flex-end', paddingTop: 8 },
  closeButton: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  intro: { minHeight: 226, borderRadius: 24, overflow: 'hidden', justifyContent: 'flex-end' },
  introImage: { borderRadius: 24, resizeMode: 'cover' },
  introScrim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(4, 12, 35, 0.18)' },
  introContent: { padding: 20, gap: 8 },
  introKicker: { alignSelf: 'flex-start', paddingHorizontal: 10, minHeight: 29, borderRadius: 15, backgroundColor: 'rgba(8, 18, 45, 0.52)', borderWidth: 1, borderColor: 'rgba(249, 215, 131, 0.44)', flexDirection: 'row', alignItems: 'center', gap: 5 },
  introKickerText: { color: '#FFFFFF', fontFamily: 'Inter_700Bold', fontSize: 11, letterSpacing: 0.45, textTransform: 'uppercase' },
  title: { color: '#FFFFFF', fontFamily: 'PlayfairDisplay_700Bold', fontSize: 30 },
  subtitle: { color: 'rgba(255,255,255,0.86)', fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 21, maxWidth: '92%' },
  recommendation: { flexDirection: 'row', gap: 10, borderWidth: 1, borderRadius: 16, padding: 14 },
  eligibility: { flexDirection: 'row', alignItems: 'flex-start', gap: 9, borderWidth: 1, borderRadius: 16, padding: 13 },
  eligibilityCopy: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 19 },
  recommendationTitle: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  recommendationCopy: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 19, marginTop: 2 },
  pathList: { gap: 12 },
  pathCard: { borderWidth: 1.5, borderRadius: 22, padding: 8, gap: 13, overflow: 'hidden' },
  pathVisual: { height: 108, borderRadius: 16, overflow: 'hidden', justifyContent: 'flex-end' },
  pathArtwork: { ...StyleSheet.absoluteFillObject, minHeight: 108, borderRadius: 16 },
  pathVisualOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(5, 14, 38, 0.18)' },
  pathHeader: { padding: 14, flexDirection: 'row', alignItems: 'center', gap: 11 },
  pathIcon: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.17)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.32)', alignItems: 'center', justifyContent: 'center' },
  pathTitle: { color: '#FFFFFF', fontFamily: 'Inter_700Bold', fontSize: 18 },
  pathPurpose: { color: 'rgba(255,255,255,0.84)', fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 17, marginTop: 2 },
  recommendedLabel: { fontFamily: 'Inter_700Bold', fontSize: 12, marginTop: -4 },
  detailBlock: { borderTopWidth: 1, marginHorizontal: 8, paddingTop: 11, gap: 3 },
  detailLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 0.6, textTransform: 'uppercase' },
  detailCopy: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 19 },
  previewBlock: { gap: 7, paddingHorizontal: 8 },
  rankList: { gap: 6 },
  rankPill: { minHeight: 33, borderRadius: 10, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 8 },
  rankNumber: { fontFamily: 'Inter_700Bold', fontSize: 12, width: 14, fontVariant: ['tabular-nums'] },
  rankName: { fontFamily: 'Inter_500Medium', fontSize: 13 },
  toolkit: { borderRadius: 12, padding: 11, marginHorizontal: 8, marginBottom: 8, flexDirection: 'row', gap: 8, alignItems: 'center' },
  toolkitCopy: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 12, lineHeight: 17 },
  primaryCta: { minHeight: 50, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  primaryCtaText: { color: '#FFFFFF', fontFamily: 'Inter_700Bold', fontSize: 15 },
  laterButton: { minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  laterText: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
});

export default CareerPathSelectionScreen;

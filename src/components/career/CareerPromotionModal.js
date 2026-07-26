import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { CAREER_NODES } from '../../constants/careerPath';
import { useCareerPath } from '../../context/CareerPathContext';
import { useTheme } from '../../context/ThemeContext';
import { useUserData } from '../../context/UserDataContext';
import { appNavigationRef } from '../../navigation/AppNavigator';
import { t } from '../../locales/i18n';
import { ANALYTICS_EVENTS, trackEvent } from '../../utils/analytics';
import BadgeShareSheet from '../BadgeShareSheet';
import useReducedMotion from '../../hooks/useReducedMotion';
import CareerNodeMark from './CareerNodeMark';
import GuideLight from './GuideLight';

const nodeIndex = new Map(CAREER_NODES.map((node, index) => [node.id, index]));

const CareerPromotionModal = () => {
  const { colors, isDark, lang } = useTheme();
  const { career, unseenPromotions, markPromotionsSeen, requestPathSwitch } = useCareerPath();
  const { isLoadingUserData, activeBadgeModal, setBadgePresentationBlocked, userProfile } = useUserData();
  const [shareAchievement, setShareAchievement] = useState(null);
  const reduceMotion = useReducedMotion();
  const promotions = useMemo(() => [...(unseenPromotions || [])].sort((a, b) => (nodeIndex.get(a.nodeId) || 0) - (nodeIndex.get(b.nodeId) || 0)), [unseenPromotions]);
  const promotion = promotions[promotions.length - 1] || null;
  const node = promotion ? CAREER_NODES.find((item) => item.id === promotion.nodeId) : null;
  const isCapstone = Boolean(node?.pathId && node.pathId !== 'common' && node.order === 3 && node.pathId === career?.activePath);
  const visible = Boolean(node) && !isLoadingUserData && !activeBadgeModal;

  useEffect(() => {
    setBadgePresentationBlocked('career_promotion', visible || !!shareAchievement);
    return () => setBadgePresentationBlocked('career_promotion', false);
  }, [visible, setBadgePresentationBlocked, shareAchievement]);

  useEffect(() => {
    if (!visible) return;
    if (!reduceMotion) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    trackEvent(ANALYTICS_EVENTS.CAREER_PROMOTION_SHOWN, {
      nodeId: node?.id,
      additionalPromotionCount: Math.max(0, promotions.length - 1),
    });
  }, [visible, node?.id, reduceMotion]);

  const dismiss = async () => {
    trackEvent(ANALYTICS_EVENTS.CAREER_PROMOTION_DISMISSED, { careerVersion: 1, pathId: node?.pathId, nodeId: node?.id, source: 'dismiss' });
    await markPromotionsSeen(promotions.map((item) => item.nodeId));
    trackEvent(ANALYTICS_EVENTS.CAREER_PROMOTION_SEEN, { careerVersion: 1, pathId: node?.pathId, nodeId: node?.id });
  };

  const focusAnotherPath = async () => {
    await dismiss();
    requestPathSwitch();
    appNavigationRef.current?.navigate('MainTabs', { screen: 'ProgressTab' });
  };

  const openShare = async () => {
    if (!node) return;
    const evidenceCount = Array.isArray(promotion?.requirementsSnapshot) ? promotion.requirementsSnapshot.length : 0;
    const achievement = {
      rankTitle: t(node.titleKey, lang),
      pathLabel: t(`careerPath.${node.pathId}.title`, lang),
      evidenceSummary: evidenceCount ? t('career.share.evidenceCount', lang, { count: evidenceCount }) : t('career.share.evidence', lang),
      visualKey: node.visualKey,
      earnedDate: promotion?.earnedAt,
    };
    await dismiss();
    trackEvent(ANALYTICS_EVENTS.CAREER_PROMOTION_SHARED, { careerVersion: 1, pathId: node.pathId, nodeId: node.id });
    setShareAchievement(achievement);
  };

  if (!node && !shareAchievement) return null;
  return (
    <>
      {node ? <Modal visible={visible} transparent animationType="fade" onRequestClose={dismiss} accessibilityViewIsModal>
        <View style={styles.backdrop}>
          <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}> 
            <TouchableOpacity accessibilityRole="button" accessibilityLabel={t('career.close', lang)} onPress={dismiss} style={[styles.closeButton, { backgroundColor: colors.backgroundDark, borderColor: colors.border }]}>
              <Ionicons name="close" size={18} color={colors.text} />
            </TouchableOpacity>
            <CareerNodeMark node={node} status="completed" isDark={isDark} size={72} style={styles.light} />
            <GuideLight state={isCapstone ? "celebrate" : "idle"} size={32} style={styles.guideLight} />
            <Text selectable style={[styles.kicker, { color: colors.textSecondary }]}>{t(isCapstone ? 'career.capstone.title' : 'career.promotion.title', lang)}</Text>
            <Text selectable style={[styles.rank, { color: colors.text }]}>{t(node.titleKey, lang)}</Text>
            <Text selectable style={[styles.body, { color: colors.textSecondary }]}>{t(isCapstone ? 'career.capstone.body' : 'career.promotion.body', lang)}</Text>
            {isCapstone ? <Text selectable style={[styles.summary, { color: colors.textSecondary }]}>{t('career.capstone.periodSummary', lang, { path: t(`careerPath.${node.pathId}.title`, lang) })}</Text> : null}
            {promotions.length > 1 ? <Text selectable style={[styles.summary, { color: colors.textSecondary }]}>{`${promotions.length - 1} ${t('career.promotion.more', lang)}`}</Text> : null}
            <View style={isCapstone ? styles.capstoneActions : null}>
              <TouchableOpacity accessibilityRole="button" accessibilityLabel={t(isCapstone ? 'career.capstone.stay' : 'career.promotion.continue', lang)} onPress={dismiss} style={[styles.button, isCapstone ? styles.capstoneButton : null, { backgroundColor: colors.primary }]}> 
                <Text selectable style={[styles.buttonText, { color: isDark ? colors.backgroundDark : '#FFFFFF' }]}>{t(isCapstone ? 'career.capstone.stay' : 'career.promotion.continue', lang)}</Text>
              </TouchableOpacity>
              {isCapstone ? <TouchableOpacity accessibilityRole="button" accessibilityLabel={t('career.capstone.focusAnother', lang)} onPress={focusAnotherPath} style={[styles.secondaryButton, { borderColor: colors.border }]}><Text selectable style={[styles.secondaryButtonText, { color: colors.text }]}>{t('career.capstone.focusAnother', lang)}</Text></TouchableOpacity> : null}
              <TouchableOpacity accessibilityRole="button" accessibilityLabel={t('career.share.title', lang)} onPress={openShare} style={[styles.secondaryButton, { borderColor: colors.border }]}><Ionicons name="share-social-outline" size={16} color={colors.text} /><Text selectable style={[styles.secondaryButtonText, { color: colors.text }]}>{t('career.share.title', lang)}</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal> : null}
      <BadgeShareSheet visible={!!shareAchievement} achievement={shareAchievement} name={userProfile?.displayName} onClose={() => setShareAchievement(null)} />
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: 'rgba(0,0,0,0.5)' },
  card: { width: '100%', maxWidth: 380, alignItems: 'center', padding: 24, borderRadius: 24, borderWidth: 1, gap: 10 },
  closeButton: { position: 'absolute', top: 13, right: 13, width: 44, height: 44, borderRadius: 22, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  light: { marginBottom: 4 },
  guideLight: { marginTop: -20, marginBottom: 1, marginLeft: 52 },
  kicker: { fontFamily: 'Inter_600SemiBold', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 },
  rank: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 29, textAlign: 'center' },
  body: { fontFamily: 'Inter_400Regular', fontSize: 14, textAlign: 'center', lineHeight: 20 },
  summary: { fontFamily: 'Inter_500Medium', fontSize: 13, textAlign: 'center' },
  button: { alignSelf: 'stretch', minHeight: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  capstoneActions: { alignSelf: 'stretch', gap: 9, marginTop: 8 },
  capstoneButton: { marginTop: 0 },
  secondaryButton: { minHeight: 46, borderWidth: 1, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 7 },
  secondaryButtonText: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  buttonText: { fontFamily: 'Inter_700Bold', fontSize: 15 },
});

export default CareerPromotionModal;

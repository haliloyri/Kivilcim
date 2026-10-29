import React, { useEffect, useMemo, useState } from 'react';
import { Image, Modal, Text, View, StyleSheet } from 'react-native';
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
import { useStories } from '../../context/StoriesContext';
import { buildLearningSummary } from '../../utils/careerLearning';
import { buildRankShare } from '../../utils/careerShare';
import useReducedMotion from '../../hooks/useReducedMotion';
import { getCareerVisual } from '../../constants/careerVisuals';
import { CelebrationCard, CelebrationButton, CelebrationChip, celebrationBackdrop } from '../CelebrationCard';

const nodeIndex = new Map(CAREER_NODES.map((node, index) => [node.id, index]));

const CareerPromotionModal = () => {
  const { colors, isDark, lang } = useTheme();
  const { career, careerEvents, unseenPromotions, markPromotionsSeen, requestPathSwitch, milestoneVisible } = useCareerPath();
  const { stories } = useStories();
  const { isLoadingUserData, activeBadgeModal, setBadgePresentationBlocked, userProfile } = useUserData();
  const [shareAchievement, setShareAchievement] = useState(null);
  const reduceMotion = useReducedMotion();
  const promotions = useMemo(() => [...(unseenPromotions || [])].sort((a, b) => (nodeIndex.get(a.nodeId) || 0) - (nodeIndex.get(b.nodeId) || 0)), [unseenPromotions]);
  const promotion = promotions[promotions.length - 1] || null;
  const node = promotion ? CAREER_NODES.find((item) => item.id === promotion.nodeId) : null;
  const isCapstone = Boolean(node?.pathId && node.pathId !== 'common' && node.order === 3 && node.pathId === career?.activePath);
  const visible = Boolean(node) && !isLoadingUserData && !activeBadgeModal && !milestoneVisible;

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
    const achievement = buildRankShare({
      titleKey: node.titleKey,
      pathId: node.pathId,
      visualKey: node.visualKey,
      learning: buildLearningSummary({ events: careerEvents, stories }),
      name: userProfile?.displayName,
      lang,
      earnedAt: promotion?.earnedAt,
    });
    await dismiss();
    trackEvent(ANALYTICS_EVENTS.CAREER_PROMOTION_SHARED, { careerVersion: 1, pathId: node.pathId, nodeId: node.id });
    trackEvent(ANALYTICS_EVENTS.CAREER_TITLE_SHARE_OPENED, { careerVersion: 1, pathId: node.pathId, nodeId: node.id, source: 'promotion', hasStats: Boolean(achievement.stats) });
    setShareAchievement(achievement);
  };

  if (!node && !shareAchievement) return null;
  return (
    <>
      {node ? <Modal visible={visible} transparent animationType="fade" onRequestClose={dismiss} accessibilityViewIsModal>
        <View style={celebrationBackdrop(isDark)}>
          <CelebrationCard
            onClose={dismiss}
            closeLabel={t('career.close', lang)}
            emblem={<Image accessible={false} source={getCareerVisual(node.visualKey).image} resizeMode="cover" style={styles.emblemImage} />}
            kicker={t(isCapstone ? 'career.capstone.title' : 'career.promotion.title', lang)}
            title={t(node.titleKey, lang)}
            subtitle={node.pathId && node.pathId !== 'common' ? t(`careerPath.${node.pathId}.title`, lang) : undefined}
            description={t(isCapstone ? 'career.capstone.body' : 'career.promotion.body', lang)}
            actions={(
              <>
                <CelebrationButton variant="primary" label={t(isCapstone ? 'career.capstone.stay' : 'career.promotion.continue', lang)} onPress={dismiss} />
                {isCapstone ? <CelebrationButton variant="secondary" tone="primary" label={t('career.capstone.focusAnother', lang)} onPress={focusAnotherPath} /> : null}
                <CelebrationButton variant="secondary" icon="share-social-outline" label={t('career.share.title', lang)} onPress={openShare} />
              </>
            )}
          >
            {isCapstone ? <CelebrationChip tone="reward" icon="sparkles-outline" label={t('career.capstone.profileBadge', lang, { title: t(node.titleKey, lang) })} /> : null}
            {isCapstone ? (
              <View style={[styles.pathNote, { borderColor: colors.mutedText }]}>
                <Text selectable style={[styles.pathNoteText, { color: colors.textSecondary }]}>{t('career.capstone.periodSummary', lang, { path: t(`careerPath.${node.pathId}.title`, lang) })}</Text>
              </View>
            ) : null}
            {promotions.length > 1 ? (
              <View style={styles.more}>
                <Ionicons name="add" size={16} color={colors.dawnText} />
                <Text selectable style={[styles.moreText, { color: colors.textSecondary }]}>{`${promotions.length - 1} ${t('career.promotion.more', lang)}`}</Text>
              </View>
            ) : null}
          </CelebrationCard>
        </View>
      </Modal> : null}
      <BadgeShareSheet visible={!!shareAchievement} achievement={shareAchievement} name={userProfile?.displayName} onClose={() => setShareAchievement(null)} />
    </>
  );
};

const styles = StyleSheet.create({
  emblemImage: { width: '100%', height: '100%', borderRadius: 55 },
  pathNote: { alignSelf: 'stretch', marginTop: 14, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1, borderStyle: 'dashed' },
  pathNoteText: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 19, textAlign: 'left' },
  more: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 12 },
  moreText: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
});

export default CareerPromotionModal;

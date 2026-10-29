import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Image, Modal, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useCareerPath } from '../../context/CareerPathContext';
import { useStories } from '../../context/StoriesContext';
import { useTheme } from '../../context/ThemeContext';
import { useUserData } from '../../context/UserDataContext';
import { t } from '../../locales/i18n';
import { ANALYTICS_EVENTS, trackEvent } from '../../utils/analytics';
import { buildLearningSummary } from '../../utils/careerLearning';
import { buildBooksMilestoneShare } from '../../utils/careerShare';
import { getCategoryImage } from '../../utils/categoryImages';
import { nextMilestoneState, pickMilestoneCelebration } from '../../utils/learningMilestones';
import useReducedMotion from '../../hooks/useReducedMotion';
import BadgeShareSheet from '../BadgeShareSheet';
import { CelebrationCard, CelebrationButton, celebrationBackdrop } from '../CelebrationCard';

const STORAGE_KEY = '@albor_learning_milestones_v1';

/**
 * Small celebrations between titles: 5/10/25/50… books and the first idea
 * from a new category. Waits for title promotions and badge modals so two
 * RN modals are never open at once.
 */
const LearningMilestoneModal = () => {
  const { lang } = useTheme();
  const { career, careerEvents, unseenPromotionCount, showMigrationSummary, setMilestoneVisible } = useCareerPath();
  const { stories, storiesLoading } = useStories();
  const { isLoadingUserData, activeBadgeModal, setBadgePresentationBlocked, badgePresentationBlockers, userProfile } = useUserData();
  const reduceMotion = useReducedMotion();
  const [stored, setStored] = useState(undefined);
  const [celebration, setCelebration] = useState(null);
  const [pendingIds, setPendingIds] = useState([]);
  const [shareAchievement, setShareAchievement] = useState(null);
  const shareTimer = useRef(null);

  const summary = useMemo(
    () => (career && !storiesLoading && stories?.length ? buildLearningSummary({ events: careerEvents, stories }) : null),
    [career, careerEvents, stories, storiesLoading]
  );

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => setStored(raw ? JSON.parse(raw) : null))
      .catch(() => setStored(null));
    return () => clearTimeout(shareTimer.current);
  }, []);

  const persist = (next) => {
    setStored(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
  };

  const otherSurfaceOpen = Object.keys(badgePresentationBlockers || {}).some((key) => key !== 'learning_milestone');
  const blocked = isLoadingUserData || !!activeBadgeModal || unseenPromotionCount > 0 || showMigrationSummary || otherSurfaceOpen || !!shareAchievement;

  useEffect(() => {
    if (stored === undefined || !summary || celebration || blocked) return;
    const { state, newIds } = nextMilestoneState(stored, summary);
    if (state !== stored) { persist(state); return; }
    if (!newIds.length) return;
    const pick = pickMilestoneCelebration(newIds, summary);
    if (!pick) { persist({ ...stored, seen: [...(stored.seen || []), ...newIds] }); return; }
    setPendingIds(newIds);
    setCelebration(pick);
    if (!reduceMotion) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    trackEvent(ANALYTICS_EVENTS.LEARNING_MILESTONE_SHOWN, { milestoneId: pick.id, type: pick.type, count: pick.count ?? null, category: pick.categoryRaw ?? null, silentlySeen: newIds.length - 1 });
  }, [stored, summary, celebration, blocked, reduceMotion]);

  const visible = Boolean(celebration);
  useEffect(() => {
    setBadgePresentationBlocked('learning_milestone', visible || !!shareAchievement);
    setMilestoneVisible(visible || !!shareAchievement);
    return () => { setBadgePresentationBlocked('learning_milestone', false); setMilestoneVisible(false); };
  }, [visible, shareAchievement, setBadgePresentationBlocked, setMilestoneVisible]);

  const dismiss = () => {
    persist({ ...(stored || { initialized: true }), seen: [...new Set([...(stored?.seen || []), ...pendingIds])] });
    setCelebration(null);
    setPendingIds([]);
  };

  const share = () => {
    const achievement = buildBooksMilestoneShare({ count: celebration.count, learning: summary, name: userProfile?.displayName, lang });
    trackEvent(ANALYTICS_EVENTS.LEARNING_MILESTONE_SHARE_OPENED, { milestoneId: celebration.id, type: celebration.type, count: celebration.count ?? null });
    dismiss();
    // Never stack two RN modals: open the share sheet after this one closes.
    shareTimer.current = setTimeout(() => setShareAchievement(achievement), 320);
  };

  return (
    <>
      <MilestoneModalView milestone={celebration} kickerKey="career.milestone.kicker" primaryKey="career.continue" onClose={dismiss} onShare={share} />
      <BadgeShareSheet visible={!!shareAchievement} achievement={shareAchievement} name={userProfile?.displayName} onClose={() => setShareAchievement(null)} />
    </>
  );
};

/** The milestone card itself; shared by the live celebration and the review from "Öğrendiklerin". */
export const MilestoneModalView = ({ milestone, kickerKey, primaryKey, onClose, onShare }) => {
  const { colors, isDark, lang } = useTheme();
  if (!milestone) return null;
  const isBooks = milestone.type === 'books';
  const categoryArt = isBooks ? null : getCategoryImage(milestone.categoryRaw || milestone.category, isDark).source;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose} accessibilityViewIsModal>
      <View style={celebrationBackdrop(isDark)}>
        <CelebrationCard
          onClose={onClose}
          closeLabel={t('career.close', lang)}
          emblem={categoryArt ? (
            <Image accessible={false} source={categoryArt} resizeMode="cover" style={styles.emblemImage} />
          ) : (
            <View accessible={false} style={[styles.emblemDisc, { backgroundColor: colors.heroSurface }]}>
              <Ionicons name={isBooks ? 'library-outline' : 'compass-outline'} size={46} color={colors.dawn} />
            </View>
          )}
          kicker={t(kickerKey, lang)}
          title={isBooks
            ? t('career.milestone.booksTitle', lang, { count: milestone.count })
            : t('career.milestone.categoryTitle', lang, { category: milestone.category })}
          description={isBooks
            ? t('career.milestone.booksBody', lang, { count: milestone.count })
            : t('career.milestone.categoryBody', lang)}
          actions={(
            <>
              <CelebrationButton variant="primary" label={t(primaryKey, lang)} onPress={onClose} />
              {isBooks && onShare ? <CelebrationButton variant="secondary" icon="share-social-outline" label={t('badgeShare.share', lang)} onPress={onShare} /> : null}
            </>
          )}
        />
      </View>
    </Modal>
  );
};

/** Re-opens an already reached milestone. No haptics, no "shown" analytics, no seen-state writes. */
export const MilestoneReviewModal = ({ milestone, onClose, onShare }) => (
  <MilestoneModalView milestone={milestone} kickerKey="career.milestone.reviewKicker" primaryKey="career.close" onClose={onClose} onShare={onShare} />
);

const styles = StyleSheet.create({
  emblemImage: { width: '100%', height: '100%', borderRadius: 55 },
  emblemDisc: { flex: 1, alignSelf: 'stretch', borderRadius: 55, alignItems: 'center', justifyContent: 'center' },
});

export default LearningMilestoneModal;

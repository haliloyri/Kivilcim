import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
import { getCategoryTheme } from '../../utils/categoryImages';
import { nextMilestoneState, pickMilestoneCelebration } from '../../utils/learningMilestones';
import useReducedMotion from '../../hooks/useReducedMotion';
import BadgeShareSheet from '../BadgeShareSheet';

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
  const accent = isBooks ? colors.primary : getCategoryTheme(milestone.categoryRaw || milestone.category, isDark).accent;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose} accessibilityViewIsModal>
      <View style={styles.backdrop}>
        <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel={t('career.close', lang)} onPress={onClose} style={[styles.closeButton, { backgroundColor: colors.backgroundDark, borderColor: colors.border }]}>
            <Ionicons name="close" size={18} color={colors.text} />
          </TouchableOpacity>
          <View style={[styles.icon, { backgroundColor: `${accent}1F` }]}>
            <Ionicons name={isBooks ? 'library-outline' : 'compass-outline'} size={34} color={accent} />
          </View>
          <Text style={[styles.kicker, { color: colors.textSecondary }]}>{t(kickerKey, lang)}</Text>
          <Text style={[styles.title, { color: colors.text }]}>
            {isBooks
              ? t('career.milestone.booksTitle', lang, { count: milestone.count })
              : t('career.milestone.categoryTitle', lang, { category: milestone.category })}
          </Text>
          <Text style={[styles.body, { color: colors.textSecondary }]}>
            {isBooks
              ? t('career.milestone.booksBody', lang, { count: milestone.count })
              : t('career.milestone.categoryBody', lang)}
          </Text>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel={t(primaryKey, lang)} onPress={onClose} style={[styles.button, { backgroundColor: colors.primary }]}>
            <Text style={[styles.buttonText, { color: isDark ? colors.backgroundDark : '#FFFFFF' }]}>{t(primaryKey, lang)}</Text>
          </TouchableOpacity>
          {isBooks && onShare ? (
            <TouchableOpacity accessibilityRole="button" accessibilityLabel={t('badgeShare.share', lang)} onPress={onShare} style={[styles.secondaryButton, { borderColor: colors.border }]}>
              <Ionicons name="share-social-outline" size={16} color={colors.text} />
              <Text style={[styles.secondaryButtonText, { color: colors.text }]}>{t('badgeShare.share', lang)}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </Modal>
  );
};

/** Re-opens an already reached milestone. No haptics, no "shown" analytics, no seen-state writes. */
export const MilestoneReviewModal = ({ milestone, onClose, onShare }) => (
  <MilestoneModalView milestone={milestone} kickerKey="career.milestone.reviewKicker" primaryKey="career.close" onClose={onClose} onShare={onShare} />
);

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: 'rgba(0,0,0,0.5)' },
  card: { width: '100%', maxWidth: 380, alignItems: 'center', padding: 24, borderRadius: 24, borderWidth: 1, gap: 10 },
  closeButton: { position: 'absolute', top: 13, right: 13, width: 44, height: 44, borderRadius: 22, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  icon: { width: 76, height: 76, borderRadius: 38, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  kicker: { fontFamily: 'Inter_600SemiBold', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 },
  title: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 29, textAlign: 'center' },
  body: { fontFamily: 'Inter_400Regular', fontSize: 14, textAlign: 'center', lineHeight: 20 },
  button: { alignSelf: 'stretch', minHeight: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  buttonText: { fontFamily: 'Inter_700Bold', fontSize: 15 },
  secondaryButton: { alignSelf: 'stretch', minHeight: 46, borderWidth: 1, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 7 },
  secondaryButtonText: { fontFamily: 'Inter_700Bold', fontSize: 14 },
});

export default LearningMilestoneModal;

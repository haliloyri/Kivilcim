jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));
jest.mock('react-native-view-shot', () => ({ captureRef: jest.fn() }));
jest.mock('expo-sharing', () => ({ isAvailableAsync: jest.fn(() => Promise.resolve(false)), shareAsync: jest.fn() }));
jest.mock('expo-haptics', () => ({ notificationAsync: jest.fn(() => Promise.resolve()), NotificationFeedbackType: { Success: 'success' } }));
jest.mock('../../../context/ThemeContext', () => ({ useTheme: () => ({ colors: { primary: '#C89B3C', text: '#222', textSecondary: '#777', background: '#FFF', backgroundDark: '#F5F0E6', border: '#E4DBCB', onPrimary: '#FFF' }, isDark: false, lang: 'tr' }) }));
jest.mock('../../../context/UserDataContext', () => ({ useUserData: () => ({ isLoadingUserData: false, activeBadgeModal: null, setBadgePresentationBlocked: jest.fn(), badgePresentationBlockers: {}, userProfile: { displayName: 'Halil' } }) }));
jest.mock('../../../context/CareerPathContext', () => ({ useCareerPath: () => ({ career: {}, careerEvents: mockEvents, unseenPromotionCount: 0, showMigrationSummary: false, setMilestoneVisible: jest.fn() }) }));
jest.mock('../../../context/StoriesContext', () => ({ useStories: () => ({ stories: mockStories, storiesLoading: false }) }));
jest.mock('../../../utils/analytics', () => ({ ANALYTICS_EVENTS: {}, trackEvent: jest.fn() }));

const mockStories = Array.from({ length: 10 }, (_, i) => ({ story_id: String(i), title: `S${i}`, source_book_id: i, source_book: `B${i}`, min: 2, parent_cat: i < 5 ? 'Psikoloji' : 'Felsefe', parent_cat_raw: i < 5 ? 'Psychology' : 'Philosophy' }));
const mockEvents = mockStories.map((s, i) => ({ creditType: 'H', storyId: s.story_id, occurredAt: `2026-09-${10 + i}T08:00:00Z`, localDay: `2026-09-${10 + i}` }));

import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TestRenderer, { act } from 'react-test-renderer';
import LearningMilestoneModal from '../LearningMilestoneModal';

const texts = (tree) => tree.root.findAll((n) => n.type === 'Text' && typeof n.props.children === 'string').map((n) => n.props.children);

it('celebrates a newly reached 10-book milestone', async () => {
  await AsyncStorage.setItem('@albor_learning_milestones_v1', JSON.stringify({ initialized: true, seen: ['books_5', 'cat_psychology', 'cat_philosophy'] }));
  let tree; await act(async () => { tree = TestRenderer.create(<LearningMilestoneModal />); });
  await act(async () => {});
  expect(texts(tree)).toContain('10 kitap!');
  expect(texts(tree)).toContain('10 farklı kitaptan fikir topladın. Kütüphanen zihninde büyüyor.');
  await act(async () => { tree.unmount(); });
});

it('stays silent on first run and records a baseline', async () => {
  await AsyncStorage.clear();
  let tree; await act(async () => { tree = TestRenderer.create(<LearningMilestoneModal />); });
  await act(async () => {});
  expect(texts(tree)).not.toContain('10 kitap!');
  const saved = JSON.parse(await AsyncStorage.getItem('@albor_learning_milestones_v1'));
  expect(saved.seen).toEqual(expect.arrayContaining(['books_5', 'books_10', 'cat_psychology']));
  await act(async () => { tree.unmount(); });
});

it('re-opens a reached milestone in review mode without writing seen state', async () => {
  const { MilestoneReviewModal } = require('../LearningMilestoneModal');
  const onClose = jest.fn();
  let tree; await act(async () => { tree = TestRenderer.create(<MilestoneReviewModal milestone={{ id: 'cat_science', type: 'category', category: 'Bilim', categoryRaw: 'Science' }} onClose={onClose} />); });
  expect(texts(tree)).toContain('Kilometre taşı');
  expect(texts(tree)).toContain('İlk Bilim fikrin');
  expect(texts(tree)).toContain('Kapat');
  expect(texts(tree)).not.toContain('Yeni kilometre taşı');
  await act(async () => { tree.unmount(); });
});

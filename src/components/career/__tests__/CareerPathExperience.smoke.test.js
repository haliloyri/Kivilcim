jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));
jest.mock('@expo/vector-icons', () => ({ Ionicons: 'Ionicons' }));
jest.mock('react-native-view-shot', () => ({ captureRef: jest.fn() }));
jest.mock('expo-sharing', () => ({ isAvailableAsync: jest.fn(() => Promise.resolve(false)), shareAsync: jest.fn() }));
jest.mock('../../../context/ThemeContext', () => ({ useTheme: () => ({ colors: { primary: '#C89B3C', text: '#222', textSecondary: '#777', background: '#FFF', backgroundDark: '#F5F0E6', border: '#E4DBCB', onPrimary: '#FFF', danger: '#c00', success: '#2C8068' }, layout: { padding: { horizontal: 20 } }, isDark: false, lang: 'tr' }) }));
jest.mock('../../../context/UserDataContext', () => ({ useUserData: () => ({ todayReadsCount: 1, streak: 3, totalReads: 9, longestStreak: 4, isPremium: false, streakFreezeCredits: 0, streakFreezeDates: [], useStreakFreeze: jest.fn(), setBadgePresentationBlocked: jest.fn(), userProfile: { displayName: 'Halil' } }) }));
let mockCareer = null;
jest.mock('../../../context/CareerPathContext', () => ({ useCareerPath: () => ({ loading: false, error: null, isOffline: false, careerEvents: [{ creditType: 'H', storyId: '1', occurredAt: '2026-09-24T08:00:00Z', localDay: '2026-09-24' }], career: mockCareer, refreshCareer: jest.fn(), selectPath: jest.fn(), switchPath: jest.fn(), pathSwitchRequested: false, consumePathSwitchRequest: jest.fn(), conditionsRequested: false, consumeConditionsRequest: jest.fn() }) }));
jest.mock('../../../context/StoriesContext', () => ({ useStories: () => ({ stories: [{ story_id: '1', title: 'Hikaye A', source_book_id: 1, source_book: 'Kitap', min: 3, parent_cat: 'Psikoloji', parent_cat_raw: 'Psychology' }] }) }));
jest.mock('../../../db/userDb', () => ({ getLegacyBadgeIds: () => Promise.resolve([]) }));
jest.mock('../../../db/db', () => ({ getReadHistory: () => Promise.resolve([]) }));
jest.mock('../../../utils/analytics', () => ({ ANALYTICS_EVENTS: {}, trackEvent: jest.fn() }));
// The native ad card pulls in utils/ads, whose AdMob native module does not exist in Jest.
jest.mock('../../../utils/ads', () => ({ shouldShowAd: () => false, loadNativeAd: async () => null }));
// First render pays the cold-start transform cost; give the file headroom.
jest.setTimeout(20000);
import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import CareerPathExperience from '../CareerPathExperience';
import { CAREER_PREVIEW_SCENARIOS, buildCareerPreview } from '../../../utils/careerPreview';
import { buildCareerViewModel } from '../../../utils/careerProgress';

const texts = (tree) => [...new Set(tree.root.findAll((n) => typeof n.props.children === 'string' && n.type === 'Text').map((n) => n.props.children))];
const nav = { addListener: () => () => {}, navigate: jest.fn() };
const all = [...CAREER_PREVIEW_SCENARIOS.map((s) => [s.id, buildCareerPreview(s.id)]),
  ['summit', buildCareerViewModel({ metrics: {}, activePath: 'depth', earnedNodes: ['common_first_light','common_curious','common_traveler','exploration_route_seeker','exploration_horizon_traveler','exploration_wisdom_cartographer','depth_thinker','depth_synthesizer','depth_insight_curator'] })],
  ['switch_hint', buildCareerViewModel({ metrics: { stories: 20, categories: 4, deepInteractions: 12, applications: 2, activeDays: 18 }, activePath: 'exploration', earnedNodes: ['common_first_light','common_curious','common_traveler'] })]];
it.each(all)('renders %s', async (id, vm) => {
  mockCareer = vm;
  let tree; await act(async () => { tree = TestRenderer.create(<CareerPathExperience navigation={nav} />); });
  const shown = texts(tree);
  expect(shown).toContain('Öğrendiklerim');
  expect(shown).toContain(EXPECTED_TITLE[id]);
  await act(async () => { tree.unmount(); });
});

const EXPECTED_TITLE = {
  new_user: 'Yolunun başındasın',
  common_progress: 'İlk Işık',
  path_selection: 'Fikir Avcısı',
  active_path: 'Derin Düşünür',
  path_exploration: 'Kâşif',
  path_depth: 'Derin Düşünür',
  path_transfer: 'Hikâye Anlatıcısı',
  final_rank: 'Bilgelik Haritacısı',
  summit: 'Rönesans Zihni',
  switch_hint: 'Fikir Avcısı',
};

it('opens the title share card', async () => {
  mockCareer = buildCareerViewModel({ metrics: {}, activePath: 'exploration', earnedNodes: ['common_first_light','common_curious','common_traveler','exploration_route_seeker'] });
  let tree; await act(async () => { tree = TestRenderer.create(<CareerPathExperience navigation={nav} />); });
  const press = async (label) => { const btn = tree.root.findAll((n) => n.props.accessibilityLabel === label && typeof n.props.onPress === 'function')[0]; await act(async () => { btn.props.onPress(); }); };
  await press('Unvanını paylaş');
  expect(texts(tree)).toContain('Halil yeni bir unvan kazandı: Kâşif.');
  expect(texts(tree)).toContain('Sıradaki Kâşif sen misin?');
  await act(async () => { await new Promise((resolve) => setTimeout(resolve, 300)); tree.unmount(); });
});

jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));
jest.mock('expo-haptics', () => ({ selectionAsync: jest.fn().mockResolvedValue() }));
jest.mock('@expo/vector-icons', () => ({ Ionicons: 'Ionicons' }));
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: 'SafeAreaView',
  useSafeAreaInsets: () => ({ top: 0, bottom: 0 }),
}));
jest.mock('../../hooks/useReducedMotion', () => () => true);
jest.mock('../../context/ThemeContext', () => ({
  useTheme: () => ({
    colors: { primary: '#142A4A', background: '#FFF', text: '#222' },
    lang: 'tr',
    setSelectedCategories: jest.fn().mockResolvedValue(),
  }),
}));
jest.mock('../../context/StoriesContext', () => ({
  useStories: () => ({
    stories: [], categories: [], storiesLoading: false,
    parentCategories: [{ id: 1, name: 'Bilim' }, { id: 2, name: 'Tarih' }],
  }),
}));
jest.mock('../../utils/categoryImages', () => ({ getCategoryImage: () => ({ source: null }) }));
jest.mock('../../utils/analytics', () => ({
  ANALYTICS_EVENTS: {}, trackEvent: jest.fn(), setAnalyticsContext: jest.fn(),
}));
jest.mock('../../services/billing', () => ({ BILLING_LIVE: false }));
jest.mock('../../services/supabase', () => ({ SUPABASE_LIVE: false, getCachedDeviceUserId: () => null }));
jest.mock('../../services/offlineQueue', () => ({ enqueueAndSync: jest.fn() }));
jest.mock('../../services/migrateCareerPath', () => ({ migrateLegacyCareerPath: jest.fn().mockResolvedValue() }));
jest.mock('../../services/careerEvents', () => ({}));
jest.mock('../../db/userDb', () => ({}));
jest.mock('../../db/db', () => ({
  getTotalReads: jest.fn().mockResolvedValue(0),
  getStreak: jest.fn().mockResolvedValue(0),
  getLongestStreak: jest.fn().mockResolvedValue(0),
  getReadsPerCategory: jest.fn().mockResolvedValue({}),
  getReadCountsByStory: jest.fn().mockResolvedValue({}),
  getTodayReadsCount: jest.fn().mockResolvedValue(0),
  getStreakFreezes: jest.fn().mockResolvedValue([]),
  getReadHistory: jest.fn().mockResolvedValue([]),
  setSelectedCategories: jest.fn().mockResolvedValue(),
}));
jest.mock('expo-notifications', () => ({
  getPermissionsAsync: jest.fn().mockResolvedValue({ status: 'undetermined' }),
  requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'denied' }),
  cancelAllScheduledNotificationsAsync: jest.fn().mockResolvedValue(),
  scheduleNotificationAsync: jest.fn().mockResolvedValue('notification-id'),
}));

import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import TestRenderer, { act } from 'react-test-renderer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { UserDataProvider, useUserData } from '../../context/UserDataContext';
import { translations } from '../../locales/i18n';
import OnboardingScreen from '../OnboardingScreen';

let tree;
let userData;
const Probe = () => { userData = useUserData(); return null; };
const App = () => (
  <UserDataProvider>
    <Probe />
    <OnboardingScreen navigation={{}} />
  </UserDataProvider>
);
const press = async (button) => { await act(async () => { await button.props.onPress(); }); };
const primary = () => tree.root.findAllByType(TouchableOpacity).find(
  (node) => node.props.accessibilityRole === 'button' && node.props.accessibilityState,
);
const checkbox = (label) => tree.root.findAllByType(TouchableOpacity).find(
  (node) => node.props.accessibilityRole === 'checkbox' && node.props.accessibilityLabel.startsWith(label),
);
const mount = async () => { await act(async () => { tree = TestRenderer.create(<App />); }); };
const goToPlan = async () => {
  await press(primary());
  await press(checkbox('Bilim'));
  await press(checkbox('Tarih'));
  await press(primary());
};

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
  await mount();
}, 15000);
afterEach(async () => { await act(async () => { tree.unmount(); }); });

it('completes with no reminders or permission prompt and preserves opt-out after reload', async () => {
  await goToPlan();
  await press(checkbox('Akşam'));
  expect(checkbox('Akşam').props.accessibilityState.checked).toBe(false);
  expect(tree.root.findAllByType(Text).map((node) => node.props.children))
    .toContain('Hatırlatma gönderilmeyecek.');
  expect(primary().props.accessibilityState.disabled).toBe(false);

  await press(primary());
  expect(userData.isOnboarded).toBe(true);
  expect(userData.preferences).toMatchObject({
    categories: [1, 2], time: { minutes: 6, dailyStoryTarget: 2 },
    remindersEnabled: false, reminderWindows: [],
  });
  const writes = AsyncStorage.setItem.mock.calls
    .filter(([key]) => key === '@kivilcim_preferences')
    .map(([, value]) => JSON.parse(value));
  expect(writes.length).toBeGreaterThan(0);
  expect(writes.every((prefs) => prefs.remindersEnabled === false)).toBe(true);
  expect(Notifications.cancelAllScheduledNotificationsAsync).toHaveBeenCalled();

  await act(async () => { tree.unmount(); });
  await mount();
  expect(userData.preferences).toMatchObject({ remindersEnabled: false, reminderWindows: [] });
  expect(Notifications.getPermissionsAsync).not.toHaveBeenCalled();
  expect(Notifications.requestPermissionsAsync).not.toHaveBeenCalled();
  expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
});

it('lets a reader reselect a window and keeps their plan when permission is denied', async () => {
  await goToPlan();
  await press(checkbox('Akşam'));
  await press(checkbox('Sabah'));
  expect(checkbox('Sabah').props.accessibilityState.checked).toBe(true);
  await press(primary());
  expect(Notifications.requestPermissionsAsync).toHaveBeenCalled();
  expect(userData.preferences).toMatchObject({
    categories: [1, 2], time: { minutes: 6 }, remindersEnabled: true,
    reminderWindows: ['morning'], reminderHour: 8,
  });
  expect(userData.isOnboarded).toBe(true);
});

it('keeps the legacy default when onboarding has no explicit reminder answer', async () => {
  await act(async () => { await userData.saveOnboarding([], { minutes: 6 }); });
  expect(userData.preferences).toMatchObject({
    remindersEnabled: true, reminderWindows: ['evening'], reminderHour: 21,
  });
});

it.each(['en', 'tr', 'es', 'de'])('has the disabled reminder hint in %s', (lang) => {
  expect(translations[lang].profileRemindersDisabledSub).toEqual(expect.any(String));
  expect(translations[lang].profileRemindersDisabledSub.length).toBeGreaterThan(0);
});

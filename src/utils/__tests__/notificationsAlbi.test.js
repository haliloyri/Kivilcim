const mockAttachmentImpl = async (pose) => {
  mockAttachmentCount += 1;
  return [{
    identifier: `${pose}-${mockAttachmentCount}`,
    url: `file:///t/${pose}-${mockAttachmentCount}.png`,
    typeHint: 'public.png',
  }];
};
let mockAttachmentCount = 0;

jest.mock('expo-notifications', () => ({
  getPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  requestPermissionsAsync: jest.fn(),
  cancelAllScheduledNotificationsAsync: jest.fn().mockResolvedValue(),
  scheduleNotificationAsync: jest.fn().mockResolvedValue('id'),
  setNotificationChannelAsync: jest.fn().mockResolvedValue(),
  AndroidImportance: { HIGH: 4 },
}));
jest.mock('expo-constants', () => ({ __esModule: true, default: { expoConfig: {} } }));
jest.mock('../../db/db', () => ({ getReadHistory: jest.fn().mockResolvedValue([]) }));
jest.mock('../analytics', () => ({
  ANALYTICS_EVENTS: { NOTIFICATION_SCHEDULED: 'notification_scheduled' },
  trackEvent: jest.fn().mockResolvedValue(),
}));
jest.mock('../../services/supabase', () => ({ upsertPushToken: jest.fn(), removePushToken: jest.fn() }));
jest.mock('../notificationImages', () => ({
  getNotificationAttachments: jest.fn((pose) => mockAttachmentImpl(pose)),
  clearNotificationImageCache: jest.fn(),
}));

import * as Notifications from 'expo-notifications';
import { scheduleDailyNotifications } from '../notifications';
import { getNotificationAttachments, clearNotificationImageCache } from '../notificationImages';

beforeEach(() => {
  jest.clearAllMocks();
  mockAttachmentCount = 0;
  getNotificationAttachments.mockImplementation(mockAttachmentImpl);
});

const run = (options = {}) => scheduleDailyNotifications({
  lang: 'tr', reminderWindows: ['evening'], streak: 3, totalReads: 5, ...options,
});
const scheduled = () => Notifications.scheduleNotificationAsync.mock.calls.map(([request]) => request);
const withPose = (pose) => scheduled().filter(
  (request) => request.content.attachments?.[0]?.url.includes(`/${pose}-`),
);

test('gives each notification type its own pose', async () => {
  await run();
  const weekly = scheduled().filter((request) => request.content.data?.type === 'weekly_recap');
  expect(weekly).toHaveLength(1);
  expect(weekly[0].content.attachments[0].url).toContain('/hedef_tamam-');
  expect(withPose('okuma').length).toBeGreaterThan(0);
  expect(withPose('dark_mode').length).toBeGreaterThan(0);
});

test('uses a different attachment url for every scheduled notification', async () => {
  await run();
  const urls = scheduled().map((request) => request.content.attachments[0].url);
  expect(urls.length).toBeGreaterThan(1);
  expect(new Set(urls).size).toBe(urls.length);
});

test('still schedules when no image is available', async () => {
  getNotificationAttachments.mockImplementation(async () => []);
  await run();
  expect(scheduled().length).toBeGreaterThan(0);
  scheduled().forEach((request) => expect('attachments' in request.content).toBe(false));
});

test('clears the image cache after cancelling and before scheduling', async () => {
  await run();
  const [cancelled] = Notifications.cancelAllScheduledNotificationsAsync.mock.invocationCallOrder;
  const [cleared] = clearNotificationImageCache.mock.invocationCallOrder;
  const [firstScheduled] = Notifications.scheduleNotificationAsync.mock.invocationCallOrder;
  expect(cancelled).toBeLessThan(cleared);
  expect(cleared).toBeLessThan(firstScheduled);
});

test('skips the streak reminder when streak is below 2', async () => {
  await run({ streak: 1 });
  expect(getNotificationAttachments.mock.calls.map(([pose]) => pose)).not.toContain('dark_mode');
});

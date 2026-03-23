import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { t } from '../locales/i18n';

export async function scheduleDailyNotifications(lang = 'tr') {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    const { status: askStatus } = await Notifications.requestPermissionsAsync();
    if (askStatus !== 'granted') return;
  }

  // Clear existing scheduled notifications to avoid duplicates
  await Notifications.cancelAllScheduledNotificationsAsync();

  const times = [
    { hour: 8, minute: 0, key: 'notif_8' },
    { hour: 13, minute: 0, key: 'notif_13' },
    { hour: 16, minute: 0, key: 'notif_16' },
    { hour: 21, minute: 0, key: 'notif_21' },
  ];

  for (const time of times) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: t('brandText', lang),
        body: t(time.key, lang),
        sound: true,
      },
      trigger: {
        hour: time.hour,
        minute: time.minute,
        repeats: true,
      },
    });
  }
}

export function setupNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

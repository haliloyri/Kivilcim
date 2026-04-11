import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { t } from '../locales/i18n';
import { ANALYTICS_EVENTS, trackEvent } from './analytics';

const REMINDER_WINDOW_HOURS = {
  morning: 8,
  noon: 13,
  evening: 21,
};

const getReminderHour = (windowKey, explicitHour) => {
  const parsedHour = Number(explicitHour);
  if (!Number.isNaN(parsedHour) && parsedHour >= 0 && parsedHour <= 23) {
    return parsedHour;
  }
  return REMINDER_WINDOW_HOURS[windowKey] ?? REMINDER_WINDOW_HOURS.evening;
};

const getPlanNotificationKey = (dailyStoryTarget) => {
  if (dailyStoryTarget <= 1) return 'notif_plan_1';
  if (dailyStoryTarget === 2) return 'notif_plan_2';
  return 'notif_plan_3';
};

export async function scheduleDailyNotifications(options = 'tr') {
  const normalized = typeof options === 'string' ? { lang: options } : (options || {});
  const lang = normalized.lang || 'tr';
  const reminderWindow = normalized.reminderWindow || 'evening';
  const reminderHour = getReminderHour(reminderWindow, normalized.reminderHour);
  const dailyStoryTarget = Number(normalized.dailyStoryTarget) || 2;

  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    const { status: askStatus } = await Notifications.requestPermissionsAsync();
    if (askStatus !== 'granted') {
      await trackEvent(ANALYTICS_EVENTS.NOTIFICATION_SCHEDULED, {
        success: false,
        reason: 'permission_denied',
        platform: Platform.OS,
        lang,
        reminderWindow,
        reminderHour,
        dailyStoryTarget,
      });
      return;
    }
  }

  // Clear existing scheduled notifications to avoid duplicates
  await Notifications.cancelAllScheduledNotificationsAsync();

  const planKey = getPlanNotificationKey(dailyStoryTarget);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: t('brandText', lang),
      body: t(planKey, lang),
      sound: true,
    },
    trigger: {
      hour: reminderHour,
      minute: 0,
      repeats: true,
    },
  });

  await trackEvent(ANALYTICS_EVENTS.NOTIFICATION_SCHEDULED, {
    success: true,
    platform: Platform.OS,
    lang,
    reminderWindow,
    reminderHour,
    dailyStoryTarget,
    planKey,
  });
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

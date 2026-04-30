import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { getReadHistory } from '../db/db';
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

const NOTIFICATION_SEGMENTS = {
  NEW_USER: 'new_user',
  ACTIVE_3D: 'active_3d',
  CHURN_RISK: 'churn_risk',
  SHARER_NON_PREMIUM: 'sharer_non_premium',
  DEFAULT: 'default',
};

const getDaysSinceLastRead = async () => {
  try {
    const history = await getReadHistory(30);
    for (let i = history.length - 1; i >= 0; i -= 1) {
      if ((history[i]?.count || 0) > 0) {
        const lastReadDate = new Date(`${history[i].day}T00:00:00`);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return Math.floor((today - lastReadDate) / (1000 * 60 * 60 * 24));
      }
    }
    return null;
  } catch (error) {
    console.warn('Read history could not be loaded for notification segmentation:', error);
    return null;
  }
};

const resolveNotificationSegment = async ({
  totalReads = 0,
  streak = 0,
  isPremium = false,
  shareCount = 0,
}) => {
  const daysSinceLastRead = await getDaysSinceLastRead();

  if (!isPremium && shareCount > 0) {
    return {
      segment: NOTIFICATION_SEGMENTS.SHARER_NON_PREMIUM,
      daysSinceLastRead,
    };
  }

  if (daysSinceLastRead != null && daysSinceLastRead >= 3) {
    return {
      segment: NOTIFICATION_SEGMENTS.CHURN_RISK,
      daysSinceLastRead,
    };
  }

  if (streak >= 3) {
    return {
      segment: NOTIFICATION_SEGMENTS.ACTIVE_3D,
      daysSinceLastRead,
    };
  }

  if (totalReads <= 3) {
    return {
      segment: NOTIFICATION_SEGMENTS.NEW_USER,
      daysSinceLastRead,
    };
  }

  return {
    segment: NOTIFICATION_SEGMENTS.DEFAULT,
    daysSinceLastRead,
  };
};

const getSegmentTemplateKey = (segment) => {
  if (segment === NOTIFICATION_SEGMENTS.NEW_USER) return 'notif_seg_new_user';
  if (segment === NOTIFICATION_SEGMENTS.ACTIVE_3D) return 'notif_seg_active_3d';
  if (segment === NOTIFICATION_SEGMENTS.CHURN_RISK) return 'notif_seg_churn_risk';
  if (segment === NOTIFICATION_SEGMENTS.SHARER_NON_PREMIUM) return 'notif_seg_sharer_non_premium';
  return null;
};

const buildNotificationBody = ({
  segment,
  lang,
  dailyStoryTarget,
  streak,
  daysSinceLastRead,
}) => {
  const templateKey = getSegmentTemplateKey(segment);
  const fallbackPlanKey = getPlanNotificationKey(dailyStoryTarget);

  if (!templateKey) {
    return {
      body: t(fallbackPlanKey, lang),
      bodyKey: fallbackPlanKey,
    };
  }

  const template = t(templateKey, lang);
  const body = template
    .replace('{{target}}', String(dailyStoryTarget))
    .replace('{{streak}}', String(Math.max(3, streak || 0)))
    .replace('{{daysAway}}', String(Math.max(1, daysSinceLastRead || 1)));

  return {
    body,
    bodyKey: templateKey,
  };
};

export async function scheduleDailyNotifications(options = 'tr') {
  const normalized = typeof options === 'string' ? { lang: options } : (options || {});
  const lang = normalized.lang || 'tr';
  // Support multi-window array or legacy single window
  const reminderWindows = Array.isArray(normalized.reminderWindows) && normalized.reminderWindows.length > 0
    ? normalized.reminderWindows.filter(w => ['morning', 'noon', 'evening'].includes(w))
    : [normalized.reminderWindow || 'evening'];
  const reminderWindow = reminderWindows[0];
  const reminderHour = getReminderHour(reminderWindow, normalized.reminderHour);
  const dailyStoryTarget = Number(normalized.dailyStoryTarget) || 2;
  const totalReads = Number(normalized.totalReads) || 0;
  const streak = Number(normalized.streak) || 0;
  const shareCount = Number(normalized.shareCount) || 0;
  const isPremium = Boolean(normalized.isPremium);

  const { segment, daysSinceLastRead } = await resolveNotificationSegment({
    totalReads,
    streak,
    isPremium,
    shareCount,
  });
  const { body, bodyKey } = buildNotificationBody({
    segment,
    lang,
    dailyStoryTarget,
    streak,
    daysSinceLastRead,
  });

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
        segment,
        bodyKey,
      });
      return;
    }
  }

  // Clear existing scheduled notifications to avoid duplicates
  await Notifications.cancelAllScheduledNotificationsAsync();

  // Android requires a notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Daily Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#D06A1B',
    });
  }

  const planKey = getPlanNotificationKey(dailyStoryTarget);

  // Schedule one notification per selected reminder window
  for (const window of reminderWindows) {
    const windowHour = getReminderHour(window, null);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: t('brandText', lang),
        body,
        sound: true,
        ...(Platform.OS === 'android' ? { channelId: 'default' } : {}),
      },
      trigger: {
        type: 'daily',
        hour: windowHour,
        minute: 0,
      },
    });
  }

  await trackEvent(ANALYTICS_EVENTS.NOTIFICATION_SCHEDULED, {
    success: true,
    platform: Platform.OS,
    lang,
    reminderWindows,
    reminderWindow,
    reminderHour,
    dailyStoryTarget,
    totalReads,
    streak,
    shareCount,
    isPremium,
    segment,
    bodyKey,
    daysSinceLastRead,
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

  // Register default Android channel immediately at app launch
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'Daily Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#D06A1B',
    }).catch(() => {});
  }
}

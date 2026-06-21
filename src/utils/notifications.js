import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { getReadHistory } from '../db/db';
import { t } from '../locales/i18n';
import { ANALYTICS_EVENTS, trackEvent } from './analytics';

const REMINDER_WINDOW_HOURS = {
  morning: 7,
  noon: 12,
  evening: 19,
};

const REMINDER_WINDOW_MINUTES = {
  morning: 42,
  noon: 35,
  evening: 45,
};

// Weekend (Sat/Sun) shifted hours — later start, relaxed schedule
const REMINDER_WINDOW_HOURS_WEEKEND = {
  morning: 9,
  noon: 13,
  evening: 20,
};

const REMINDER_WINDOW_MINUTES_WEEKEND = {
  morning: 30,
  noon: 5,
  evening: 15,
};

// expo-notifications weekday: 1=Sunday, 2=Monday, ..., 7=Saturday
const WEEKDAYS = [2, 3, 4, 5, 6]; // Mon–Fri
const WEEKEND_DAYS = [7, 1]; // Sat, Sun

const getReminderHour = (windowKey, explicitHour, isWeekend = false) => {
  const parsedHour = Number(explicitHour);
  if (!Number.isNaN(parsedHour) && parsedHour >= 0 && parsedHour <= 23) {
    return parsedHour;
  }
  if (isWeekend) {
    return REMINDER_WINDOW_HOURS_WEEKEND[windowKey] ?? REMINDER_WINDOW_HOURS_WEEKEND.evening;
  }
  return REMINDER_WINDOW_HOURS[windowKey] ?? REMINDER_WINDOW_HOURS.evening;
};

const getReminderMinute = (windowKey, isWeekend = false) => {
  if (isWeekend) {
    return REMINDER_WINDOW_MINUTES_WEEKEND[windowKey] ?? REMINDER_WINDOW_MINUTES_WEEKEND.evening;
  }
  return REMINDER_WINDOW_MINUTES[windowKey] ?? REMINDER_WINDOW_MINUTES.evening;
};

/**
 * Schedule a single notification for each day in `days` array at the given hour/minute.
 * Returns a promise that resolves when all are scheduled.
 */
const scheduleWeeklyForDays = async ({ days, hour, minute, content }) => {
  for (const weekday of days) {
    await Notifications.scheduleNotificationAsync({
      content,
      trigger: {
        type: 'weekly',
        weekday,
        hour,
        minute,
      },
    });
  }
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
  STREAK_RISK: 'streak_risk',
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
  if (segment === NOTIFICATION_SEGMENTS.STREAK_RISK) return 'notif_seg_streak_risk';
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
        reminderHourWeekday: getReminderHour(reminderWindow, null, false),
        reminderHourWeekend: getReminderHour(reminderWindow, null, true),
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

  const notifContent = (bodyText) => ({
    title: t('brandText', lang),
    body: bodyText,
    sound: true,
    ...(Platform.OS === 'android' ? { channelId: 'default' } : {}),
  });

  // Schedule weekday (Mon–Fri) and weekend (Sat–Sun) notifications per window
  for (const window of reminderWindows) {
    const weekdayHour = getReminderHour(window, null, false);
    const weekdayMinute = getReminderMinute(window, false);
    const weekendHour = getReminderHour(window, null, true);
    const weekendMinute = getReminderMinute(window, true);

    await scheduleWeeklyForDays({
      days: WEEKDAYS,
      hour: weekdayHour,
      minute: weekdayMinute,
      content: notifContent(body),
    });

    await scheduleWeeklyForDays({
      days: WEEKEND_DAYS,
      hour: weekendHour,
      minute: weekendMinute,
      content: notifContent(body),
    });
  }

  // Streak-risk night reminder if streak >= 2
  // Weekday: 22:30 — Weekend: 21:45 (earlier, people sleep earlier on weekends)
  if (streak >= 2) {
    const { body: streakRiskBody } = buildNotificationBody({
      segment: NOTIFICATION_SEGMENTS.STREAK_RISK,
      lang,
      dailyStoryTarget,
      streak,
      daysSinceLastRead,
    });
    const streakContent = notifContent(streakRiskBody);

    await scheduleWeeklyForDays({
      days: WEEKDAYS,
      hour: 22,
      minute: 30,
      content: streakContent,
    });

    await scheduleWeeklyForDays({
      days: WEEKEND_DAYS,
      hour: 21,
      minute: 45,
      content: streakContent,
    });
  }

  await trackEvent(ANALYTICS_EVENTS.NOTIFICATION_SCHEDULED, {
    success: true,
    platform: Platform.OS,
    lang,
    reminderWindows,
    reminderWindow,
    reminderHourWeekday: getReminderHour(reminderWindow, null, false),
    reminderHourWeekend: getReminderHour(reminderWindow, null, true),
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

/**
 * Get next scheduled notification time for a reminder window.
 * @param {string} window - 'morning' | 'noon' | 'evening'
 * @returns {Date} Next scheduled notification date/time
 */
export const getNextNotificationTime = (window) => {
  const hour = REMINDER_WINDOW_HOURS[window] ?? REMINDER_WINDOW_HOURS.evening;
  const now = new Date();
  const next = new Date();
  next.setHours(hour, 0, 0, 0);

  // If time has already passed today, schedule for tomorrow
  if (next <= now) {
    next.setDate(next.getDate() + 1);
  }

  return next;
};

/**
 * Check if current local time falls within notification display windows.
 * Shows notification if within 1 hour before/after scheduled time.
 * @param {string} window - 'morning' | 'noon' | 'evening'
 * @returns {boolean}
 */
export const shouldShowNotificationNow = (window) => {
  const hour = REMINDER_WINDOW_HOURS[window] ?? REMINDER_WINDOW_HOURS.evening;
  const now = new Date();
  const currentHour = now.getHours();

  // Show notification 1 hour before to 2 hours after scheduled time
  const startHour = (hour - 1 + 24) % 24;
  const endHour = (hour + 2) % 24;

  if (startHour < endHour) {
    return currentHour >= startHour && currentHour < endHour;
  } else {
    // Wraps around midnight
    return currentHour >= startHour || currentHour < endHour;
  }
};

/**
 * Get formatted display time for a notification window.
 * @param {string} window - 'morning' | 'noon' | 'evening'
 * @param {string} lang - Language code ('tr', 'en', etc.)
 * @returns {string} Formatted time string (e.g., "08:00" or "8:00 AM")
 */
export const getNotificationWindowDisplayTime = (window, lang = 'tr') => {
  const hour = REMINDER_WINDOW_HOURS[window] ?? REMINDER_WINDOW_HOURS.evening;
  const pad = (n) => String(n).padStart(2, '0');

  if (lang === 'en') {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:00 ${ampm}`;
  }

  // Turkish 24-hour format
  return `${pad(hour)}:00`;
};

/**
 * Get human-readable window label.
 * @param {string} window - 'morning' | 'noon' | 'evening'
 * @param {string} lang - Language code
 * @returns {string} Window label (e.g., "Sabah", "Morning")
 */
export const getNotificationWindowLabel = (window, lang = 'tr') => {
  const labels = {
    tr: { morning: 'Sabah', noon: 'Öğlen', evening: 'Akşam' },
    en: { morning: 'Morning', noon: 'Noon', evening: 'Evening' },
  };

  const langLabels = labels[lang] || labels.en;
  return langLabels[window] || langLabels.evening;
};

/**
 * Cancel all scheduled notifications.
 */
export async function cancelAllNotifications() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.warn('Failed to cancel notifications:', error);
  }
}

/**
 * Get all scheduled notifications.
 * @returns {Promise<Array>} Array of scheduled notification objects
 */
export async function getScheduledNotifications() {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.warn('Failed to get scheduled notifications:', error);
    return [];
  }
}

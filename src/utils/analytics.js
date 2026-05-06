const ANALYTICS_EVENTS = {
  ONBOARDING_TIME_BUDGET_SELECTED: 'onboarding_time_budget_selected',
  ONBOARDING_NOTIFICATION_TIME_SELECTED: 'onboarding_notification_time_selected',
  PERSONALIZED_FEED_SHOWN: 'personalized_feed_shown',
  PERSONALIZED_STORY_OPENED: 'personalized_story_opened',
  PAYWALL_VIEWED: 'paywall_viewed',
  PAYWALL_PLAN_SELECTED: 'paywall_plan_selected',
  PAYWALL_PURCHASE_STARTED: 'paywall_purchase_started',
  PAYWALL_PURCHASE_SUCCEEDED: 'paywall_purchase_succeeded',
  PAYWALL_PURCHASE_FAILED: 'paywall_purchase_failed',
  FREE_LIMIT_TO_PAYWALL: 'free_limit_to_paywall',
  DAILY_TARGET_COMPLETED: 'daily_target_completed',
  NOTIFICATION_SCHEDULED: 'notification_scheduled',
  NOTIFICATION_OPENED: 'notification_opened',
  REMINDER_TIME_CHANGED: 'reminder_time_changed',
  MODULE_SHOWN: 'module_shown',
  MODULE_CLICKED: 'module_clicked',
  MODULE_DISMISSED: 'module_dismissed',
  STORY_SHARED: 'story_shared',
  // Conversation-use success signals
  USE_IN_CONVO_OPENED: 'use_in_convo_opened',
  MICRO_VARIANT_COPIED: 'micro_variant_copied',
  MICRO_VARIANT_FAVORITED: 'micro_variant_favorited',
  STORY_VARIANT_USED: 'story_variant_used',
  STORYTELLER_MODE_OPENED: 'storyteller_mode_opened',
  STORYTELLER_PRACTICE_COMPLETED: 'storyteller_practice_completed',
  SOCIAL_SHARE_PLATFORM: 'social_share_platform',
};

const sanitizePayload = (payload) => {
  if (!payload || typeof payload !== 'object') return {};

  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined)
  );
};

export const trackEvent = async (eventName, payload = {}) => {
  if (!eventName) return;

  const safePayload = sanitizePayload(payload);
  const logPayload = {
    event: eventName,
    payload: safePayload,
    timestamp: new Date().toISOString(),
  };

  // Centralized logging point so a real analytics SDK can be attached later.
  console.log('[analytics]', JSON.stringify(logPayload));
};

export { ANALYTICS_EVENTS };

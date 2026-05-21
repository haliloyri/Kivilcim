# Spark Analytics Events

This document defines analytics event names and payload fields implemented in the app.

## onboarding_time_budget_selected
When: On onboarding completion after the user confirms the reading-time budget.

Payload:
- minutes: number (3 | 6 | 9)
- dailyStoryTarget: number (1 | 2 | 3)
- lang: string (e.g. tr, en)

## onboarding_notification_time_selected
When: On onboarding completion after reminder window selection is saved.

Payload:
- reminderWindow: string (morning | noon | evening)
- reminderHour: number (0-23)
- lang: string

## personalized_feed_shown
When: Home personalized module is shown for the first time after screen mount.

Payload:
- dailyStoryTarget: number
- personalizedStoriesCount: number
- filter: string (active category filter)
- lang: string

## personalized_story_opened
When: User opens a story from the personalized feed area.

Payload:
- storyId: string | number
- position: number (0-based index in personalized module)
- source: string (home_for_you | first_session_prompt)
- dailyStoryTarget: number
- lang: string

## paywall_viewed
When: Paywall screen is opened.

Payload:
- reason: string (none | free_limit_reached | early_trial | storyteller_mode | profile_upgrade | streak_freeze)
- source: string (direct | onboarding_complete | profile_upsell | use_in_conversation | progress_streak_freeze | home_featured_story_locked | home_daily_panel_locked | home_feed_teaser | home_feed_locked | story_detail_next)
- selectedPlan: string
- selectedPlanId: string (monthly | annual)
- lang: string

## paywall_plan_selected
When: User changes selected subscription plan on paywall.

Payload:
- previousPlan: string
- previousPlanId: string (monthly | annual)
- selectedPlan: string
- selectedPlanId: string (monthly | annual)
- selectedPrice: string
- source: string (for example direct | onboarding_complete | profile_upsell | use_in_conversation | home_feed_locked)
- reason: string (none | free_limit_reached | early_trial | storyteller_mode | profile_upgrade | streak_freeze)
- lang: string

## paywall_purchase_started
When: User taps purchase CTA on paywall.

Payload:
- selectedPlan: string
- selectedPlanId: string (monthly | annual)
- selectedPrice: string
- source: string (for example direct | onboarding_complete | profile_upsell | use_in_conversation | home_feed_locked)
- reason: string (none | free_limit_reached | early_trial | storyteller_mode | profile_upgrade | streak_freeze)
- lang: string

## paywall_purchase_succeeded
When: Premium purchase flow succeeds.

Payload:
- selectedPlan: string
- selectedPlanId: string (monthly | annual)
- selectedPrice: string
- source: string (for example direct | onboarding_complete | profile_upsell | use_in_conversation | home_feed_locked)
- reason: string (none | free_limit_reached | early_trial | storyteller_mode | profile_upgrade | streak_freeze)
- lang: string

## paywall_purchase_failed
When: Premium purchase flow fails.

Payload:
- selectedPlan: string
- selectedPlanId: string (monthly | annual)
- selectedPrice: string
- source: string (for example direct | onboarding_complete | profile_upsell | use_in_conversation | home_feed_locked)
- reason: string (none | free_limit_reached | early_trial | storyteller_mode | profile_upgrade | streak_freeze)
- lang: string
- failureReason: string

## free_limit_to_paywall
When: User hits free limit and transitions to paywall after first 2 accessible stories.

Payload:
- source: string (home_featured_story_locked | home_daily_panel_locked | home_feed_teaser | home_feed_locked | story_detail_next)
- storyId: string | number (optional)
- selectedPlan: string (when tracked on paywall open)
- lang: string

## daily_target_completed
When: Daily reading goal is completed in Progress screen. Tracked once per day.

Payload:
- date: string (YYYY-MM-DD)
- dailyTarget: number
- dailyProgress: number
- todayReads: number
- lang: string

## streak_freeze_activated
When: Premium user spends a streak-freeze credit from Progress while their streak is at risk.

Payload:
- date: string (YYYY-MM-DD)
- remainingCredits: number
- streak: number
- lang: string

## streak_freeze_upsell_clicked
When: Free user taps the locked streak-freeze CTA and is sent to paywall.

Payload:
- source: string (progress_streak_freeze)
- streak: number
- todayReads: number
- lang: string

## notification_scheduled
When: Daily reminder scheduling attempt finishes.

Payload:
- success: boolean
- reason: string (permission_denied when failed by permission)
- platform: string (ios | android)
- lang: string
- reminderWindow: string
- reminderHour: number
- dailyStoryTarget: number
- planKey: string (notif_plan_1 | notif_plan_2 | notif_plan_3) when success is true

## notification_opened
When: User taps a notification and app receives response.

Payload:
- identifier: string
- title: string
- triggerType: string

## reminder_time_changed
When: User updates reminder window or hour from preferences.

Payload:
- reminderWindow: string
- reminderHour: number
- previousReminderWindow: string
- previousReminderHour: number
- lang: string

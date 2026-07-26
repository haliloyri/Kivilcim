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

## career_path_selected
When: User selects an initial Kıvılcım Yolu path or switches the active path.

Payload:
- pathId: string (exploration | depth | transfer)
- selectionSource: string (user | user_switch)

## career_promotion_shown
When: The user is shown the highest newly earned Kıvılcım Yolu rank.

Payload:
- nodeId: string
- additionalPromotionCount: number

## Kıvılcım Yolu ek olayları

Tüm kariyer payload’ları `careerVersion` (number) taşır; isteğe göre `pathId`,
`nodeId`, `nodeState`, `actionType`, `missingRequirement` ve `source` eklenir.
Display name, email, hikâye gövdesi ve serbest kullanıcı metni gönderilmez.

- `career_path_exposure`: Yeni yol deneyimi gerçekten görünür olduğunda.
- `career_path_viewed`: Yolum sekmesi bir oturumda ilk kez açıldığında.
- `career_path_intro_viewed`: Yol seçimi gerektiğinde intro görünür olduğunda.
- `career_path_selected`: İlk yol kalıcı olarak seçildiğinde (`pathId`, `selectionSource`).
- `career_path_focus_changed`: Aktif yol değiştirildiğinde (`pathId`, `source`).
- `career_node_opened`: Timeline’dan düğüm ayrıntısı açıldığında.
- `career_next_action_clicked`: Sıradaki aksiyon CTA’sına basıldığında.
- `career_node_completed`: Yerel award transaction düğümü ilk kez yazdığında
  (`pathId`, `nodeId`, `source`, `backfilled`).
- `career_promotion_seen`, `career_promotion_dismissed`, `career_promotion_shared`:
  promotion yaşam döngüsü için ayrılmış olaylar.
- `career_path_completed`: Aktif yol capstone’a ulaştığında.
- `career_migration_completed`, `career_migration_summary_seen`: Legacy geçişinin
  kalıcı tamamlanması ve özetin görülmesi.

### Kıvılcım Yolu kredi sözlüğü ve gizlilik

- `H` (hikâye): Okuma veya sesli dinleme ile anlamlı biçimde tamamlanan benzersiz hikâye.
- `K` (kategori): Günlük kredi sınırı sonrası kabul edilen `H` olaylarının farklı ana kategorileri.
- `D` (derin etkileşim): Bir çıkarımı kaydetme veya ilk tamamlamadan en az 24 saat sonra anlamlı yeniden tamamlama.
- `U` (uygulama): Sohbette Kullan, prova veya sabit seçenekli özel uygulama planı.
- `G` (aktif gün): En az bir anlamlı `H`, `D` veya `U` içeren yerel gün; streak değildir.

Ham olaylar analitik kullanıcı profiline değil, yerel kariyer deposuna yazılır. Analytics payload’ı display name, e-posta, hikâye gövdesi veya serbest çıkarım/uygulama metni içermez. Özel uygulama planı yalnız sabit bağlam seçeneği gönderir.

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

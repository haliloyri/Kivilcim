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
- reason: string (none | free_limit_reached | early_trial | storyteller_mode | one_minute_summary | image_card | profile_upgrade | streak_freeze)
- source: string (direct | onboarding_complete | profile_upsell | use_in_conversation | story_detail_one_minute_summary | story_detail_card | progress_streak_freeze | home_featured_story_locked | home_daily_panel_locked | home_feed_teaser | home_feed_locked | home_for_you_locked | home_first_session_locked | home_primary_action_locked | home_module_card_locked | search_locked | career_toolkit_locked | story_detail_next)
- selectedPlan: string
- selectedPlanId: string (monthly | yearly | lifetime)
- lang: string

## paywall_plan_selected
When: User changes selected subscription plan on paywall.

Payload:
- previousPlan: string
- previousPlanId: string (monthly | yearly | lifetime)
- selectedPlan: string
- selectedPlanId: string (monthly | yearly | lifetime)
- selectedPrice: string
- source: string (for example direct | onboarding_complete | profile_upsell | use_in_conversation | home_feed_locked)
- reason: string (none | free_limit_reached | early_trial | storyteller_mode | image_card | profile_upgrade | streak_freeze)
- lang: string

## paywall_purchase_started
When: User taps purchase CTA on paywall.

Payload:
- selectedPlan: string
- selectedPlanId: string (monthly | yearly | lifetime)
- selectedPrice: string
- source: string (for example direct | onboarding_complete | profile_upsell | use_in_conversation | home_feed_locked)
- reason: string (none | free_limit_reached | early_trial | storyteller_mode | image_card | profile_upgrade | streak_freeze)
- lang: string

## paywall_purchase_succeeded
When: The store confirms a purchase **and** the entitlement is active. Never
fires when billing isn't connected — see `paywall_unavailable`.

Payload:
- selectedPlan: string
- selectedPlanId: string (monthly | yearly | lifetime)
- selectedPrice: string — the store's display string, for reading only
- **revenue: number** — the numeric amount, for summing
- **currency: string** — ISO 4217, e.g. EUR
- **product_id: string** — the store product identifier
- price_string: string
- period_type: string (NORMAL | TRIAL | INTRO)
- is_trial_conversion: boolean
- expires_at: string | null (null for lifetime)
- source: string (for example direct | onboarding_complete | profile_upsell | use_in_conversation | home_feed_locked)
- reason: string (none | free_limit_reached | early_trial | storyteller_mode | image_card | profile_upgrade | streak_freeze)
- lang: string

> `revenue` / `currency` / `product_id` are what make LTV and ROAS computable.
> This event used to carry only `selectedPrice` as a display string like
> `"349₺"`, which cannot be summed — so no revenue analysis was possible and
> paid acquisition could not be evaluated.

## paywall_unavailable
When: A user taps Subscribe while `BILLING_LIVE` is false (no real RevenueCat
key). Nothing is charged and **nothing is unlocked**; the user sees an alert.

A non-zero count of this event in production means a build shipped without live
billing keys.

Payload:
- source: string
- reason: string
- selectedPlanId: string
- lang: string

## paywall_purchase_failed
When: Premium purchase flow fails.

Payload:
- selectedPlan: string
- selectedPlanId: string (monthly | yearly | lifetime)
- selectedPrice: string
- source: string (for example direct | onboarding_complete | profile_upsell | use_in_conversation | home_feed_locked)
- reason: string (none | free_limit_reached | early_trial | storyteller_mode | image_card | profile_upgrade | streak_freeze)
- lang: string
- failureReason: string

## free_limit_to_paywall
When: A free user hits the daily cap and is routed to the paywall.

The cap is **3 stories per local calendar day**, persisted per story id
(`@albor_free_reads`, rules in `src/utils/freeQuota.js`). Re-opening a story
already spent today, or one read on an earlier day, does not count again and
does not fire this event.

> Previously documented as "after first 2 accessible stories". Both numbers were
> wrong: the code granted 3, and the limit did not persist — reading the free
> three removed them from the candidate pool, so three more became free
> indefinitely.

Payload:
- source: string (home_featured_story_locked | home_daily_panel_locked | home_feed_teaser | home_feed_locked | home_for_you_locked | home_first_session_locked | home_primary_action_locked | home_module_card_locked | search_locked | career_toolkit_locked | story_detail_card | story_detail_next | use_in_conversation_share)
- storyId: string | number (optional)
- selectedPlan: string (when tracked on paywall open)
- lang: string

## Subscription lifecycle
Emitted from the RevenueCat customer-info listener in `UserDataContext`, so they
fire for changes the user did not make on the paywall — a renewal, a
cancellation, a refund, a trial converting in the background, or a purchase on
another device. `paywall_purchase_succeeded` on its own measures acquisition and
cannot distinguish growth from churn.

| Event | When |
|---|---|
| `trial_started` | Entitlement became active with `periodType: TRIAL` |
| `trial_converted` | A trial entitlement became a paid one |
| `subscription_renewed` | Entitlement stayed active and the expiry moved forward |
| `subscription_cancelled` | `willRenew` went true → false while still entitled. The earliest churn signal — the user still has access |
| `subscription_expired` | Entitlement is no longer active (lapse or refund) |

Payload (all five):
- product_id: string
- period_type: string (NORMAL | TRIAL | INTRO)
- expires_at: string | null
- lang: string

> Requires the RevenueCat webhook to be pointed at
> `supabase/functions/revenuecat-webhook` for the server-side half. The
> on-device listener only fires while the app is running.

## One-minute Premium story summary

The precomputed summary contains story text, but analytics never sends that
text. Only identifiers, language, entitlement state, and length metadata are
captured.

- `one_minute_summary_cta_viewed`: CTA is rendered for an available summary.
- `one_minute_summary_clicked`: CTA is tapped (`isPremium`, `contentLength`).
- `one_minute_summary_paywall_viewed`: A free reader is routed to the dedicated paywall.
- `one_minute_summary_opened`: A Premium reader opens the short retelling modal.
- `one_minute_summary_completed`: The retelling stays visible in foreground for 20 seconds (`dwellMs`).
- `one_minute_summary_full_story_clicked`: The reader returns to the full story.

Shared payload:
- storyId: string | number
- source: string (`story_detail`)
- lang: string
- contentLength: number (where applicable)

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

## İlerleme: paylaşım ve küçük kutlamalar

Paylaşım hunisi iki adımdır: kart **açıldı** (`*_share_opened`) → kart görseli üretilip sistem paylaşım menüsü gösterildi (`share_card_exported`). Sistem menüsü, kullanıcının gerçekten bir uygulamaya gönderip göndermediğini bildirmez; bu yüzden `share_card_exported` "paylaşım menüsüne kadar gitti" anlamına gelir.

- `career_title_share_opened`: Unvan paylaşım kartı açıldığında. `source`: `promotion` (yeni unvan penceresi) veya `progress_hero` (İlerleme hero kartındaki "Unvanını paylaş"). Alanlar: `pathId`, `nodeId` (zirve unvanı için `capstone`), `hasStats` (kartta kitap/fikir rakamları var mı).
  - `career_promotion_shared` eski panolar için yalnızca `promotion` kaynağında gönderilmeye devam eder.
- `weekly_recap_share_opened`: "Haftam" kartı açıldığında. `source`: `progress_week` (Ritim bölümündeki düğme) veya `notification` (Pazar bildirimi). Alanlar: `stories`, `books`, `minutes` (o haftanın sayıları).
- `weekly_recap_notification_opened`: Pazar 18:30 haftalık özet bildirimine dokunulup İlerleme açıldığında. Alanlar: `stories`, `hasRecap` (o hafta okuma yoksa kart açılmaz).
- `learning_milestone_shown`: Kitap kilometre taşı veya kategori ilki penceresi gösterildiğinde. Alanlar: `milestoneId` (`books_10`, `cat_philosophy`), `type` (`books` | `category`), `count`, `category` (ham kategori adı), `silentlySeen` (aynı anda ulaşılıp gösterilmeden işaretlenen diğer taş sayısı). İlk açılıştaki sessiz başlangıç kaydı olay üretmez.
- `learning_milestone_share_opened`: Kitap kilometre taşı penceresinden "Paylaş"a basıldığında. Alanlar: `milestoneId`, `type`, `count`.
- `share_card_exported`: Herhangi bir paylaşım kartı (unvan, haftalık, kilometre taşı, eski rozet) görsele dönüştürülüp sistem paylaşım menüsü gösterildiğinde. Alanlar: `kind` (`rank` | `weekly` | `milestone` | `badge`), `format` (`square` | `story`), `theme`, `accent`, `hasStats`, `badgeId`.

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

## review_prompt_shown
When: The native store-review sheet was actually requested (`src/utils/review.js#maybeRequestReview`).
Fires from three positive moments: closing an "earned" badge celebration, completing a share,
and reaching a 3-day streak. Gated to at most once a year per install (free users also need
>=2 real reads first — premium users are asked immediately).

Payload:
- isPremium: boolean
- totalReads: number

## share_link_opened
When: The app is opened (or resumed) via a share link carrying `?s=&st=&l=` attribution
params — see `src/utils/share.js#getShareUrl` and `App.js`'s Linking handling.

Payload:
- referrerId: string (the sharer's anonymous Supabase device id)
- storyId: string|null
- lang: string|null

## install_from_share
When: The very first app open ever was via a share link (subset of `share_link_opened`
opens where this device had never opened the app before).

Payload: same as `share_link_opened`.

## referral_reward_granted
When: The `claim_referral` Supabase RPC actually granted a referral bonus (see
`supabase/migrations/20260910000000_referral_attribution.sql`) and the client applied it
locally via `UserDataContext#applyReferralBonus`. Fires on the invited device only — the
referrer's own bonus is granted server-side in the same call but isn't observed locally
until their own app reads their profile.

Payload:
- referrerId: string
- storyId: string|null
- lang: string|null
- premiumBonusUntil: string (ISO timestamp)

# GPT-5.5 UX Tasks

This file turns the UX and user-flow analysis for the Spark / Kivilcim mobile app into actionable work packages. Tasks are grouped into phases based on critical impact, user risk, and development cost.

## Overall Goals

- Reduce launch/loading risks that make users feel the app is stuck.
- Make the first-use experience more trustworthy, clean, and aligned with standard mobile UX.
- Make discovery, reading, saving, library, and progress loops easier to understand.
- Make the premium/paywall flow more trustworthy, clearer, and less aggressive.
- Strengthen localization, accessibility, and theme consistency as a baseline quality level.

---

## Phase 0 - Critical Stability and Trust Fixes

This phase targets risks that can prevent users from opening the app, show broken screens, or create trust issues around purchases/ads. Polishing the UI is not efficient before these are resolved.

### 0.1 Make Launch / Loading Experience Recoverable

**Priority:** Critical  
**Affected areas:** App.js, LaunchScreen, AppNavigator, UserDataContext, StoriesContext  
**Problem:** The app waits on the launch screen with a spinner, but it does not explain what is happening, how long it may take, or what the user can do in an error state. If DB, font, AsyncStorage, or story seeding is delayed, the user may think the app is frozen.

**Tasks:**

- Add short status messages to the launch screen:
  - `Preparing your library...`
  - `Loading stories...`
  - `Preparing your personal plan...`
- Add a calm delay message after 5-8 seconds:
  - `This is taking a little longer, we are still working...`
- Add a recovery state after 12-15 seconds:
  - `Loading could not be completed.`
  - `Try again` button
- Consider a simple readiness/status model that can surface `StoriesContext` and `UserDataContext` error states to LaunchScreen.
- Handle startup errors with a generic, non-alarming user-facing status message instead of only logging them to the console.

**Why:** In standard mobile UX, long waits should provide feedback and a recovery path. A silent spinner reinforces the perception that the app is frozen.

**Expected outcome:**

- The user understands that the app is still working on the launch screen.
- In real error or delay cases, the user is not forced to close and reopen the app.
- Support/bug reports like `stuck on launch screen` decrease.

**Acceptance criteria:**

- When font, DB, or stories loading delay is simulated, the launch screen shows a status message.
- A retry action appears during long delays.
- The normal startup flow reaches the home screen without adding extra wait time.

### 0.2 Fix Onboarding Icon / Encoding Corruption

**Priority:** Critical  
**Affected areas:** OnboardingScreen, ProfileScreen, related translation/copy areas  
**Problem:** Icons such as coffee, book, rocket, sun/moon appear as garbled characters in onboarding. This makes the app feel broken at first impression.

**Tasks:**

- Fix corrupted emoji strings using UTF-8 compatible characters or Unicode escapes.
- Check the same icon set in onboarding time selection, reminder selection, and profile settings.
- Verify icons display correctly on Android devices.
- If needed, use an icon library such as Ionicons/lucide instead of emoji to reduce platform differences.

**Why:** Encoding corruption on first-run screens immediately reduces user trust and harms the premium/trust flow.

**Expected outcome:**

- Onboarding looks professional and clean.
- Users do not get a `broken app` impression in the first minute.

**Acceptance criteria:**

- Icons are readable/visible across all onboarding steps.
- No corrupted characters appear when switching between TR/EN/ES/DE.
- No corrupted characters appear in an Android debug APK.

### 0.3 Close AdMob Native Startup Risk

**Priority:** Critical  
**Affected areas:** app.json, src/utils/ads.js, App.js, Android build config  
**Problem:** Build output contains the warning `react-native-google-mobile-ads requires android_app_id`. If the SDK is not configured correctly, there is a risk of a native startup crash. This can create a symptom similar to being unable to progress past the launch screen.

**Tasks:**

- Verify `react-native-google-mobile-ads` config plugin settings in `app.json`.
- Clarify the correct Android app ID values for debug and release.
- If needed, make the debug build safe with a test AdMob app ID.
- Verify that `initAds()` does not block app boot even if it fails.
- Check user-friendly fallback behavior in `AdOrPremiumSheet` when an ad cannot be loaded.

**Why:** Native SDK crashes cannot be caught with JS-side try/catch. They are one of the highest-risk causes of startup crashes or splash-screen hangs.

**Expected outcome:**

- The Ads SDK does not break app startup.
- Startup becomes reliable in debug and release builds.
- Even when ads cannot be loaded, the user is guided to a clear next action.

**Acceptance criteria:**

- The Android debug APK warning is no longer critical or is consciously documented.
- After a clean install, the app progresses from launch to the main flow.
- The app does not crash when ads are disabled or unavailable.

---

## Phase 1 - First Use and Core Flow UX

This phase strengthens the user's first 5 minutes: onboarding, first story, first save, and the main discovery flow.

### 1.1 Make the Onboarding Flow Clearer and Less Aggressive

**Priority:** High  
**Affected areas:** OnboardingScreen, AppNavigator, PaywallScreen  
**Problem:** Onboarding is well structured, but showing a trial/paywall immediately after completion may feel too aggressive before the user experiences value.

**Tasks:**

- Consider routing the user to the first story/value experience after onboarding.
- Consider moving the early trial paywall to one of these triggers:
  - After the first story is completed
  - After the 2 free stories limit is reached
  - When the user taps a premium feature
- Make the plan summary + `Open my first story` CTA more prominent on the final onboarding step.
- Make the skip flow clearer: users who skip should still start with a meaningful default plan.

**Why:** In mobile onboarding, users usually want to feel value first. An early paywall can hurt trust and retention, especially in a new app.

**Expected outcome:**

- The first-session story open rate increases.
- The paywall feels more contextual.
- Users better understand what to do after onboarding ends.

**Acceptance criteria:**

- A new user sees a meaningful next step directly after onboarding.
- The paywall trigger is tied to user behavior and is understandable.
- Onboarding skip/default plan flow works without errors.

### 1.2 Clarify the Primary Action on Home / Discover

**Priority:** High  
**Affected areas:** HomeScreen, StoryCard  
**Problem:** The Home screen has rich modules, but feeds with many modules may not quickly answer the user's question: `what should I do today?`

**Tasks:**

- Highlight one strong CTA tied to the daily goal on the Home screen:
  - `Open today's first story`
  - `Continue my plan`
  - `Complete the goal`
- Use `Continue`, `Read again`, and `Completed` consistently for previously read stories.
- Make it clearer that the daily progress ring is tappable.
- In empty/error states, Home should route users toward category selection or search.

**Why:** In standard mobile UX, the home screen should support the user's most likely intent at a glance.

**Expected outcome:**

- Users choose their first action faster after opening the app.
- The daily reading loop becomes stronger.
- Home feels less complex.

**Acceptance criteria:**

- The main CTA differs appropriately for new and returning users.
- StoryCard states are consistent.
- Users are not left on a dead empty screen when there are no stories or an error occurs.

### 1.3 Localize and Standardize the Search Experience

**Priority:** High  
**Affected areas:** SearchScreen, i18n  
**Problem:** Default suggestions in Search are hard-coded in Turkish. The back button is text-based and weak compared with platform standards.

**Tasks:**

- Move `DEFAULT_SUGGESTIONS` into language-based translation keys.
- Keep the empty search hierarchy of `Recent searches`, `Popular categories`, and `Suggested searches`, but verify copy across all languages.
- Standardize the back button with Ionicons and add an accessibility label.
- Add a more actionable CTA for the no-results state:
  - tap a suggested category
  - return to home
- Consider `returnKeyType="search"`, a clear button, and an accessibility label for the search input.

**Why:** Search is central to the discovery flow. Language mismatch and non-standard controls slow users down.

**Expected outcome:**

- EN/ES/DE users see search suggestions in their own language.
- The Search screen feels more platform-native.
- No-result searches provide a way forward.

**Acceptance criteria:**

- The default suggestion list appears correctly in every language.
- The back button works as an icon with an accessibility label.
- The no-results screen provides at least one meaningful continuation action.

---

## Phase 2 - Library, Progress, and Habit Loop

This phase strengthens the reasons users return to the app: saving, revisiting history, progress, and streaks.

### 2.1 Make Library Empty States More Actionable

**Priority:** Medium-High  
**Affected areas:** LibraryScreen, StoryCard, i18n  
**Problem:** Library collections make sense, but empty-state copy alone may not be enough. The user needs a clear answer to `how do I fill this?`

**Tasks:**

- Use title + subtitle + CTA for each collection:
  - Read: `Read your first story`
  - Favorites: `Tap the heart icon on stories`
  - Used: `Mark a variant from the Use in Conversation screen`
- CTAs should navigate to the relevant screen.
- If there are no results while a category filter is active, add a `Clear filter` action.
- Make the active selection more visible in sort modal options.

**Why:** Empty states should not only inform users; they should move users to the next valuable action.

**Expected outcome:**

- Library does not feel like an empty/dead-end area during first use.
- Users better understand saving and rereading loops.

**Acceptance criteria:**

- All library collections show a CTA when empty.
- Filtered empty states include filter clearing.
- CTA navigation works correctly.

### 2.2 Highlight the Next Best Action on Progress

**Priority:** Medium-High  
**Affected areas:** ProgressScreen, UserDataContext  
**Problem:** The Progress screen is rich, but the primary next action can get lost between badges, heatmap, streak, and goals.

**Tasks:**

- Highlight a single `next best action` card at the top of the screen:
  - If today's goal is incomplete: `Read 1 more story`
  - If the streak is at risk: `Protect today's streak`
  - If a badge is close: `You are close to a badge`
- Explain streak freeze without creating pressure:
  - `You can use a break day today`
  - `Your streak is protected`
- After the badge modal closes, provide context back to the related Progress section.

**Why:** Habit UX is not only about showing stats; it should make the user's next behavior easier.

**Expected outcome:**

- Users clearly understand what to do from the Progress screen.
- The streak mechanic feels motivating, not punitive.
- The badge system becomes easier to understand and tied to behavior.

**Acceptance criteria:**

- The Progress screen shows a contextually appropriate main action in every state.
- Premium/free streak freeze states are clearly separated.
- If the daily goal is completed, the screen celebrates it and avoids excessive repeated calls to action.

### 2.3 Make the Story Detail Reading Flow More Standard

**Priority:** Medium  
**Affected areas:** StoryDetailScreen, StoryCard, UseInConversationScreen  
**Problem:** Story detail carries many features: reading, audio, favorite, read later, share, next story, and use in conversation. This is powerful but can feel crowded.

**Tasks:**

- Group top actions:
  - back
  - save/read later
  - audio
  - share/use in conversation
- Create a clearer completion area at the end of the story:
  - `Mark as completed`
  - `Next story`
  - `Use in conversation`
- Before showing a free limit/paywall or ad sheet, clearly explain why the user is being interrupted.
- Check the accessibility and readability impact of the font size setting.

**Why:** The reading screen is the app's main value moment. Too many actions can distract users from the reading experience.

**Expected outcome:**

- The reading experience becomes more focused.
- Story completion and next-story rates increase.
- Premium/ad interruptions feel less abrupt.

**Acceptance criteria:**

- Main actions on story detail are consistent and easy to find.
- The completion area is clear at the end of a story.
- In free-limit states, the user understands why they are seeing a paywall/ad.

---

## Phase 3 - Premium, Ads, and Trust Flow

This phase aligns monetization with user trust.

### 3.1 Align Paywall Messaging With Real Product State

**Priority:** High  
**Affected areas:** PaywallScreen, UserDataContext, app store billing integration  
**Problem:** The paywall shows price, trial, restore, and premium benefits. If these do not exactly match real IAP/billing behavior, user trust and store compliance are at risk.

**Tasks:**

- Pull prices from store product data when possible instead of static prices.
- Show `Try 7 days free` only if a real trial is configured.
- Connect `Restore purchase` to the real restore flow; if it is a placeholder, use different copy.
- After a successful purchase, show a short confirmation state instead of only `goBack`:
  - `Premium active`
  - `All stories unlocked`
- Add a more helpful error state for failed purchases.

**Why:** Trust in paywall UX matters as much as conversion. Incorrect promises create refund, complaint, and store review risk.

**Expected outcome:**

- Users clearly understand what they get before/after payment.
- Restore/purchase experience moves closer to standard mobile expectations.
- Premium conversion quality improves.

**Acceptance criteria:**

- Price/trial/restoration copy is compatible with real billing state.
- Premium state is visibly confirmed after purchase success.
- Restore action works or is clearly not presented as a real placeholder flow.

### 3.2 Make Ad or Premium Decision Points Clearer

**Priority:** Medium-High  
**Affected areas:** AdOrPremiumSheet, StoryDetailScreen, UseInConversationScreen, ads.js  
**Problem:** Free users are sometimes sent to an ad-or-premium choice. If the ad cannot load, or the reason for the ad is unclear, the flow feels interrupted.

**Tasks:**

- Explain the reason in the sheet title:
  - `Today's free limit is reached`
  - `You can try this tool by watching an ad`
- Provide a clear fallback when an ad cannot load:
  - `Ad is not ready right now`
  - `View Premium` or `Try again later`
- Premium users should never see the ad sheet.
- Ad event analytics should separate success/failure states.

**Why:** Ad-based monetization becomes frustrating if it does not give users a sense of control.

**Expected outcome:**

- Users understand why they are stopped and what options they have.
- Ad errors do not create dead ends.
- The premium value proposition appears in a more natural context.

**Acceptance criteria:**

- If an ad cannot load, there is no crash or silent close.
- Sheet copy is meaningful based on the source screen.
- Analytics distinguish ad choice, ad load failed, and ad completed.

### 3.3 Audit Premium Feature Consistency

**Priority:** Medium  
**Affected areas:** StoryDetailScreen, LibraryScreen, ProgressScreen, UseInConversationScreen, copy.en/tr  
**Problem:** Some copy files describe favorites, history, sharing, or stats as premium; in code, some of these features may be free. This inconsistency reduces trust.

**Tasks:**

- Document premium gates in a single table:
  - Which features are free?
  - Which features are premium?
  - Which features can be temporarily unlocked with ads?
- Update UI copy based on this table.
- Align Library/Progress/UseInConversation free/premium behavior under the same logic.

**Why:** When users wonder `why can/can't I access this?`, distrust replaces conversion intent.

**Expected outcome:**

- Free and Premium experiences are clearly separated.
- The paywall feels fairer and easier to understand.
- Copy and behavior no longer contradict each other.

**Acceptance criteria:**

- A premium feature matrix is documented.
- Copy in all related screens matches the matrix.
- Free/Premium test scenarios produce consistent results.

---

## Phase 4 - Localization, Theme, and Accessibility Quality

This phase moves the app closer to a mature, standard mobile quality level.

### 4.1 Complete Localization Coverage

**Priority:** Medium-High  
**Affected areas:** i18n.js, copy.en.json, copy.tr.json, screens  
**Problem:** Most text comes from `t(...)`, but some hard-coded text remains. Some areas may not feel natural or local when the language changes.

**Tasks:**

- Scan for hard-coded user-facing text.
- Move Search default suggestions, language display names, and fallback CTAs to translation keys.
- Verify that TR/EN/ES/DE language blocks are complete.
- Use Turkish locale casing (`toLocaleLowerCase('tr-TR')`) only where needed; avoid side effects in other languages.

**Why:** In a multilingual app, a partially translated experience lowers perceived quality.

**Expected outcome:**

- Screens feel consistent and natural when the language changes.
- The rule for adding new copy becomes clear.

**Acceptance criteria:**

- New/old user-facing text comes through translation keys.
- There are no missing keys across languages.
- Search and Profile language compatibility is verified.

### 4.2 Audit Theme Tokens and Contrast

**Priority:** Medium  
**Affected areas:** theme.js, StoryCard, LaunchScreen, PaywallScreen, shared components  
**Problem:** Some screens use hard-coded colors. With dark/light mode and category themes, this can create contrast issues.

**Tasks:**

- Scan hard-coded colors and identify which can move to theme tokens.
- Check contrast ratios for critical text/buttons.
- Make LaunchScreen background and loader color compatible with light/dark theme.
- Test fixed text colors inside StoryCard together with category themes.

**Why:** Theme consistency is not only aesthetic; it is also important for readability and accessibility.

**Expected outcome:**

- Text remains readable in dark/light mode.
- Brand visuals are preserved while system consistency improves.

**Acceptance criteria:**

- Main screens are readable in light/dark mode.
- Critical CTAs have sufficient contrast.
- Hard-coded colors remain only as intentional exceptions.

### 4.3 Add an Accessibility Baseline

**Priority:** Medium  
**Affected areas:** All screens, StoryCard, CategoryPill, tab/navigation, modals/sheets  
**Problem:** Custom TouchableOpacity/Pressable usage is common. Without accessibility labels/roles, screen reader and motor accessibility are weak.

**Tasks:**

- Add `accessibilityRole="button"` and meaningful `accessibilityLabel` to main actions.
- Icon-only buttons must always have labels:
  - back
  - search
  - save
  - favorite
  - read aloud
  - share
- Check focus behavior when modals/sheets open.
- Target a minimum tap size of 44x44 dp.
- Test dynamic type / font scaling impact on critical screens.

**Why:** Standard mobile UX is not only for visual users; accessibility is an expected baseline quality.

**Expected outcome:**

- Screen reader users can complete the main flows.
- Icon-only UI gains meaning.
- App store quality perception improves.

**Acceptance criteria:**

- Main navigation, story actions, and paywall CTAs carry labels/roles.
- No critical tap target below 44x44 remains, or exceptions are consciously documented.
- A basic VoiceOver/TalkBack smoke test is performed.

---

## Phase 5 - Information Architecture and Long-Term UX Improvements

This phase moves the product experience toward maturity without rewriting the current system.

### 5.1 Make Search Entry More Visible

**Priority:** Medium  
**Affected areas:** HomeScreen, AppNavigator, SearchScreen  
**Problem:** Search exists as a stack screen, but how users reach search from Home may not be standard or visible enough.

**Tasks:**

- Add a standard search icon or search-bar-like entry point to the Home header.
- Make Search transition animation and back behavior feel platform-standard.
- Consider adding an option to clear search history.

**Why:** In content apps, discovery should not be limited to the feed; search should be easy to find.

**Expected outcome:**

- Users discover search faster when they want to find a specific topic/story.
- Discovery depth increases.

**Acceptance criteria:**

- Search can be reached from Home with one tap.
- Search back behavior feels natural.
- Recent search privacy/control option is evaluated.

### 5.2 Make the Use In Conversation Flow Easier to Learn

**Priority:** Medium  
**Affected areas:** UseInConversationScreen, MicroVariantCard, StoryDetailScreen  
**Problem:** `Use in Conversation` is a strong differentiating feature, but users may not immediately understand what it is for.

**Tasks:**

- Clarify the value of the `Use in conversation` CTA at the end of StoryDetail.
- Consider a short, non-intrusive first-use hint on UseInConversation:
  - `Copy, share, or mark as used`
- Make the connection between `Marked as used` behavior and Library/Progress more visible.
- If premium storyteller mode exists, clearly separate its gate and benefit.

**Why:** Unique features can remain undiscovered if they are not explained well.

**Expected outcome:**

- Users understand the practical value of this screen faster.
- Copy/share/mark-used loop usage increases.

**Acceptance criteria:**

- The reason for moving from StoryDetail to UseInConversation is clear.
- The screen's purpose is understandable on first use.
- Mark-used action produces a visible result in Library/Progress.

### 5.3 Connect Analytics Events to UX Decisions

**Priority:** Medium-Low  
**Affected areas:** analytics.js, docs/ANALYTICS_EVENTS.md, all flows  
**Problem:** There are many events, but flow-based metrics should be clarified to measure the impact of UX improvements.

**Tasks:**

- Verify or add the following funnel events:
  - launch_started
  - launch_ready
  - launch_timeout_shown
  - onboarding_started/completed/skipped
  - first_story_opened
  - first_story_completed
  - first_save_action
  - search_started/result_opened/no_results
  - paywall_viewed/purchase_started/purchase_succeeded/restore_started
- Update `docs/ANALYTICS_EVENTS.md`.
- Define success metrics for Phase 0-3 changes.

**Why:** UX improvements start with qualitative judgment, but they need measurement to become product decisions.

**Expected outcome:**

- Launch stuck, onboarding drop-off, paywall conversion, and search success can be tracked.
- Data can inform later design decisions.

**Acceptance criteria:**

- Critical funnel events are documented.
- Event payloads are consistent.
- At least 3 baseline metrics are trackable for the new UX changes.

---

## Recommended Implementation Order

1. Phase 0.1 - Launch/loading recovery UX
2. Phase 0.2 - Onboarding encoding/icon fix
3. Phase 0.3 - AdMob startup config verification
4. Phase 1.3 - Search localization and standard back/search controls
5. Phase 1.1 - Paywall timing after onboarding
6. Phase 1.2 - Clarify Home main CTA
7. Phase 3.1 - Paywall billing/copy alignment
8. Phase 2.1 - Library empty states
9. Phase 2.2 - Progress next-best-action
10. Phase 4.3 - Accessibility baseline

---

## Success Metrics

- The rate of sessions staying on the launch screen for 10+ seconds decreases.
- First-story open rate in the first session increases.
- App exit rate after onboarding completion decreases.
- Search usage and story opens from search results increase.
- Transitions from Library empty states to Home/Story actions increase.
- The transition from paywall view to purchase/restore action becomes more consistent.
- Error/feedback related to premium or ad flows decreases.

---

## Notes

- This file was prepared for incremental improvements that can be applied to the current codebase; it does not propose a full redesign.
- Early paywall display before showing value to new users should be tested carefully.
- All new user-facing text should be managed through `src/locales/i18n.js` or the existing copy files.
- JDK 17 usage should be preserved for Android builds.

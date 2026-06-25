# Premium Billing Setup (RevenueCat)

Spark's paywall is wired to **RevenueCat** (`react-native-purchases`). Until the
steps below are complete, the app runs with **local Premium activation** for
development — `BILLING_LIVE` stays `false` and "Activate Premium" just flips a
local flag. **An app submitted in this state will be rejected by Apple and
Google.** Complete every step before submitting to the stores.

## How the code is structured

| File | Role |
|------|------|
| `src/services/billing.js` | All RevenueCat calls (configure, offerings, purchase, restore, entitlement). The only file that imports the SDK. |
| `src/context/UserDataContext.js` | `buyPremium(pkg)`, `restorePremium()`, `getPremiumOfferings()`, `billingLive`. Unlocks Premium only on a confirmed entitlement; reconciles entitlement on launch (handles refunds/lapses). |
| `src/screens/PaywallScreen.js` | Live prices from offerings, real purchase, working Restore, and the App Store / Play required auto-renew disclosure. |
| `app.json → extra.revenuecat` | Your API keys, entitlement, offering, and product IDs. |

`BILLING_LIVE` becomes `true` automatically once the platform's API key in
`app.json` is a real value (not the `REPLACE_WITH_...` placeholder).

## What you must do

### 1. App Store Connect (iOS)
1. Agreements, Tax, and Banking → sign the **Paid Applications** agreement.
2. Create two **auto-renewable subscriptions** in a subscription group:
   - Monthly — product ID `spark_premium_monthly`, price ₺49.
   - Annual — product ID `spark_premium_annual`, price ₺349.
3. Add localized display name, description, and a **review screenshot** for each.
4. Note the **App-Specific Shared Secret** (for RevenueCat).

### 2. Google Play Console (Android)
1. Set up a **merchant account** (Payments profile).
2. Monetize → Subscriptions → create:
   - `spark_premium_monthly` with a monthly base plan, ₺49.
   - `spark_premium_annual` with a yearly base plan, ₺349.
3. Activate both, and (for RevenueCat) create a service account credential JSON
   and grant it access in Play Console.

### 3. RevenueCat
1. Create a project; add an **iOS app** (bundle `com.kivilcim.app`) and an
   **Android app** (package `com.kivilcim.app`).
2. Paste the App Store shared secret and upload the Google service account JSON.
3. Create an **Entitlement** called `premium`.
4. Create **Products** matching the store product IDs and attach them to `premium`.
5. Create an **Offering** named `default` with a Monthly and an Annual package.
6. Copy the **public SDK keys** (one for Apple, one for Google).

### 4. Put the keys in the app
Edit `app.json → expo.extra.revenuecat`:
```json
"revenuecat": {
  "iosApiKey": "appl_xxxxxxxxxxxxxxxx",
  "androidApiKey": "goog_xxxxxxxxxxxxxxxx",
  "entitlementId": "premium",
  "offeringId": "default",
  "products": { "monthly": "spark_premium_monthly", "annual": "spark_premium_annual" }
}
```
Keep the product IDs identical to the store + RevenueCat IDs.

### 5. Install & rebuild (native — not Expo Go)
```bash
npm install
npx expo prebuild --clean      # regenerates ios/ and android/ with the plugin
# then a dev/prod build, e.g.
eas build --profile production --platform all
```
RevenueCat needs native code; it will not work in Expo Go.

## Verify before submitting
- [ ] Sandbox purchase (monthly **and** annual) unlocks Premium.
- [ ] **Restore purchase** works on a fresh install / second device.
- [ ] Prices on the paywall come from the store (localized currency).
- [ ] The auto-renew disclosure shows under the CTA, and Terms + Privacy links open.
- [ ] Refunding the sandbox purchase removes Premium on next launch.

## Compliance notes
- Apple Guideline 3.1.1: digital unlocks **must** use Apple IAP. ✅ (RevenueCat → StoreKit)
- Auto-renew disclosure (term, price, renewal, cancel) is shown next to the CTA. ✅
- Functional Restore is required by both stores. ✅ (once `BILLING_LIVE`)
- Terms of Use (EULA) + Privacy Policy links are present. ✅ (verify the URLs resolve)

# Premium Billing Setup (RevenueCat)

Albor's paywall is wired to **RevenueCat** (`react-native-purchases`). Until the
steps below are complete, `BILLING_LIVE` stays `false` and the paywall **cannot
take money and does not unlock anything** — tapping Subscribe shows
`paywallUnavailableTitle` / `paywallUnavailableSub` and records a
`paywall_unavailable` event.

> It used to grant Premium locally in that state. That meant a release build
> shipped as a free app *and* reported `paywall_purchase_succeeded` for
> purchases that never happened, poisoning the conversion funnel. The local
> unlock now exists only behind `devSetPremium`, which is a no-op unless
> `__DEV__`.

## How the code is structured

| File | Role |
|------|------|
| `src/services/billing.js` | All RevenueCat calls (configure, offerings, purchase, restore, entitlement snapshot, customer-info listener). The only file that imports the SDK. |
| `src/context/UserDataContext.js` | `buyPremium(pkg)`, `restorePremium()`, `getPremiumOfferings()`, `billingLive`, `entitlement`. Unlocks Premium only on a confirmed entitlement; reconciles on launch and via the customer-info listener (handles refunds, lapses, renewals, cross-device). |
| `src/screens/PaywallScreen.js` | Live store prices only, real purchase, working Restore, and the auto-renew disclosure. |
| `app.json → extra.revenuecat` | API keys, entitlement, offering, and product IDs. **Canonical** — the docs follow this file, not the other way round. |

`BILLING_LIVE` becomes `true` automatically once the platform's API key in
`app.json` is a real value. A `test_…` key (RevenueCat's **Test Store**) counts
as unset: configuring the native SDK with one on a device throws an uncatchable
native error. See `isPlaceholderKey` in `src/services/billing.js`.

## The IDs this app actually uses

Read these off `app.json → expo.extra.revenuecat` and use them **verbatim** in
both stores and in RevenueCat:

| Thing | Value |
|---|---|
| Entitlement ID | `Albor Pro` |
| Offering ID | `default` |
| Monthly product ID | `monthly` |
| Yearly product ID | `yearly` |
| Lifetime product ID | `lifetime` |

`src/services/billing.js` maps store products onto the plan keys
`monthly` / `yearly` / `lifetime`, and falls back to RevenueCat's standard
package types (`offering.monthly` / `offering.annual` / `offering.lifetime`) if a
product ID doesn't match.

## Pricing — set it per market, by hand

**Do not** let the store auto-convert from a ₺ base price. Albor's launch
markets are Germany and Spain, and a TRY-derived price lands at roughly €2/€10
there — which both earns almost nothing and reads as low quality. (RevenueCat's
2026 benchmarks: high-priced apps convert download→trial about twice as well as
low-priced ones.)

Set country prices manually, with auto-convert **off**:

| Market | Yearly | Monthly | Notes |
|---|---|---|---|
| DE / AT / NL | €49,99 | €8,99 | Under Blinkist's €79,99; above the Education median (~$44.99) |
| ES / IT / PT | €39,99 | €7,99 | Lower ARPU market, still near the median |
| US / UK / CA / AU | $49.99 | $9.99 | Category median plus the EU pricing index |
| TR | current ₺ level | ₺ | Local purchasing power |

Yearly is the headline plan (59–66% of Education subscribers pick annual);
monthly is the anchor; `lifetime` is a third, higher anchor.

## Free trial

**7 days**, as an Introductory Offer → Free on every auto-renewing product.
Half of Education apps use a 5–9 day trial, and the hard-paywall conversion peak
sits at the 7-day expiry. `lifetime` gets no trial — the paywall hides the trial
badge when it's selected.

The paywall copy already assumes the trial exists (`paywallTrialSub`,
`paywallTrialBadge`, `paywallTrialNote` in all four languages). If you ship
without configuring it in the stores, that copy becomes a false claim.

## What you must do

### 1. App Store Connect (iOS)
1. Agreements, Tax, and Banking → sign the **Paid Applications** agreement.
2. Create a **Subscription Group** (e.g. "Albor Premium") with two
   **auto-renewable subscriptions**: `monthly` (1 month) and `yearly` (1 year).
3. Create `lifetime` as a **non-consumable** in-app purchase.
4. Set prices per country from the table above (auto-convert off).
5. Add an **Introductory Offer → Free, 7 days** to `monthly` and `yearly`.
6. Add localized display name + description for **tr / en / es / de**, and a
   review screenshot for each product.
7. Note the **App-Specific Shared Secret** (for RevenueCat).
8. Declare and verify **DSA trader status** — since 18 Feb 2025 an app without
   it is not distributable in the EU.

### 2. Google Play Console (Android)
1. Set up a **merchant account** (Payments profile).
2. Monetize → Subscriptions → create `monthly` (monthly base plan) and `yearly`
   (yearly base plan), both auto-renewing.
3. Monetize → In-app products → create `lifetime`.
4. Set regional prices from the table above.
5. Add a **free-trial offer (7 days)** to each subscription base plan.
6. Activate everything.
7. Create a service-account credential JSON and grant it Play Console access
   (for RevenueCat).

### 3. RevenueCat
1. Create a project; add an **iOS app** (bundle `com.kivilcim.app`) and an
   **Android app** (package `com.kivilcim.app`).
2. Paste the App Store shared secret and upload the Google service account JSON.
3. Create the entitlement **`Albor Pro`**.
4. Import `monthly`, `yearly`, `lifetime` from both stores and attach all three
   to `Albor Pro`.
5. Create an **Offering** named `default` with a Monthly, an Annual and a
   Lifetime package.
6. Copy the **public SDK keys** (`appl_…` for Apple, `goog_…` for Google).
7. Point the RevenueCat **webhook** at
   `supabase/functions/revenuecat-webhook` so renewals, cancellations and
   refunds reach analytics (`docs/ANALYTICS_EVENTS.md`).

### 4. Put the keys in the app
Edit `app.json → expo.extra.revenuecat` — replace all three `test_…` values and
delete the `_comment` placeholder note:
```json
"revenuecat": {
  "apiKey": "appl_xxxxxxxxxxxxxxxx",
  "iosApiKey": "appl_xxxxxxxxxxxxxxxx",
  "androidApiKey": "goog_xxxxxxxxxxxxxxxx",
  "entitlementId": "Albor Pro",
  "offeringId": "default",
  "products": { "monthly": "monthly", "yearly": "yearly", "lifetime": "lifetime" }
}
```

### 5. Install & rebuild (native — not Expo Go)
```bash
npm install
npx expo prebuild --clean      # regenerates ios/ and android/ with the plugin
eas build --profile production --platform all
```
RevenueCat needs native code; it will not work in Expo Go.

## Verify before submitting
- [ ] With a `test_…` key still in place: Subscribe shows the "purchases aren't
      available" alert, Premium stays **off**, and **no**
      `paywall_purchase_succeeded` event fires.
- [ ] Sandbox purchase of monthly, yearly **and** lifetime unlocks Premium.
- [ ] `paywall_purchase_succeeded` carries a numeric `revenue`, an ISO
      `currency` and a `product_id`.
- [ ] **Restore purchase** works on a fresh install / second device.
- [ ] Paywall prices come from the store: DE shows `49,99 €`, ES `39,99 €`,
      US `$49.99`, TR `₺…`. No hardcoded currency anywhere.
- [ ] The 7-day trial badge shows for monthly/yearly and **not** for lifetime.
- [ ] The auto-renew disclosure shows under the CTA, and Terms + Privacy links open.
- [ ] Refunding the sandbox purchase removes Premium — via the customer-info
      listener while the app is open, and on next launch.

## Compliance notes
- Apple Guideline 3.1.1: digital unlocks **must** use Apple IAP. ✅ (RevenueCat → StoreKit)
- Auto-renew disclosure (term, price, renewal, cancel) is shown next to the CTA. ✅
- Functional Restore is required by both stores. ✅ (once `BILLING_LIVE`)
- Terms of Use (EULA) + Privacy Policy links are present. ✅ (verify the URLs resolve)
- Because Apple/Google are the merchant of record for IAP, they also carry most
  of Germany's §312k cancellation-button obligation. That changes the moment
  anything is sold directly from the web.
- Still open for an EU launch, and **not** covered by this file: DSA trader
  status verification, a German **Impressum**, a Spanish **aviso legal**, and a
  GDPR **Art. 27 EU representative**.

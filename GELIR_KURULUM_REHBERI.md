# Albor — Gelir & Ölçüm Kurulum Rehberi (Madde 2 · 4 · 1)

_Hazırlanma: 25 Haziran 2026 · Kod hazır; bu rehber yalnızca dış hesap adımlarını içerir._

Bu rehber kodda zaten yazılı olan RevenueCat + AdMob + PostHog entegrasyonunu **canlıya almak** içindir. Her adımda hangi dosyaya ne yazacağın açıkça belirtildi.

**Koddaki sabit değerler (bunları stores'ta birebir aynı kullan):**

| Şey | Değer | Nerede tanımlı |
|---|---|---|
| Aylık ürün ID | `spark_premium_monthly` | `app.json → extra.revenuecat.products.monthly` |
| Yıllık ürün ID | `spark_premium_annual` | `app.json → extra.revenuecat.products.annual` |
| Entitlement ID | `premium` | `app.json → extra.revenuecat.entitlementId` |
| Offering ID | `default` | `app.json → extra.revenuecat.offeringId` |

> `BILLING_LIVE` otomatik olarak `true` olur (gerçek RevenueCat anahtarı girilince). `ANALYTICS_LIVE` ise gerçek `phc_...` PostHog anahtarı varsa `true`. Kodda elle bayrak değiştirmene gerek yok.

---

## 1. RevenueCat Kurulumu (Madde 2 & 4)

Canlı ortamda App Store / Google Play satın alımları RevenueCat üzerinden yönetilir. `UserDataContext.js` içinde RevenueCat SDK bağlantısı altyapısı mevcuttur.

### Adım 1.1: RevenueCat Hesabı & Proje
1. [RevenueCat Dashboard](https://app.revenuecat.com/)'a gir ve yeni proje oluştur.
2. Proje ayarlarında iOS ve Android uygulamalarını ekle.

### Adım 1.2: App Store Connect & Play Console Ürün Tanımları
1. **App Store Connect:**
   - Uygulamanız → **App In-Purchase / Subscriptions**.
   - Bir **Subscription Group** oluştur (ör. "Albor Subscriptions").
   - 2 Ürün ekle:
     - `spark_premium_monthly`: Aylık abonelik.
     - `spark_premium_annual`: Yıllık abonelik.
2. **Google Play Console:**
   - Uygulamanız → **Monetize** → **Subscriptions**.
   - Aynı ürün ID'leri ile (`spark_premium_monthly`, `spark_premium_annual`) abonelikleri tanımla.

### Adım 1.3: RevenueCat Entitlement & Offering Yapılandırması
1. RevenueCat Dashboard → **Entitlements** → **+ New entitlement**:
   - Identifier: `premium`.
2. Sol menü → **Subscriptions** → bir **Subscription Group** oluştur (ör. "Albor Premium").
3. [ ] Grup içine 2 **auto-renewable** abonelik ekle — Product ID'ler birebir:
   - [ ] `spark_premium_monthly` (1 ay)
   - [ ] `spark_premium_annual` (1 yıl)
4. [ ] Her ürün için **fiyatları** ayarla. Apple'ın fiyat matrisinden bir baz fiyat seç; Apple diğer ülkelere otomatik bölgesel fiyat üretir (Madde 3'ün mağaza tarafı budur).
5. [ ] Her ürüne yerelleştirilmiş ad/açıklama gir (tr/en/es/de).
6. [ ] **Free trial (Madde 4):** her ürüne **Introductory Offer → Free** (ör. 3 gün) ekle.
7. [ ] Ürünler "Ready to Submit" durumuna gelsin (ilk app review ile birlikte onaylanır).

## 2. Play Console — abonelikler (Android)

1. [ ] Play Console → uygulamayı oluştur (paket: `com.kivilcim.app`).
2. [ ] **Monetize → Products → Subscriptions** → 2 abonelik:
   - [ ] `spark_premium_monthly` → bir **base plan** (aylık, auto-renewing)
   - [ ] `spark_premium_annual` → bir **base plan** (yıllık, auto-renewing)
3. [ ] Base plan'lara fiyat ata (bölgeler için Play otomatik dönüştürür).
4. [ ] **Free trial (Madde 4):** her base plan'a bir **offer → free trial** (ör. 3 gün) ekle.
5. [ ] Abonelikleri **activate** et.

> İpucu: iOS ve Android'de Product ID'leri **birebir aynı** tuttuğun için RevenueCat eşleştirmesi sorunsuz olur.

## 3. RevenueCat — bağlama ve anahtarlar

1. [ ] RevenueCat → yeni **Project** oluştur.
2. [ ] **Project Settings → Apps**: iki uygulama ekle
   - [ ] Apple App Store app (App Store Connect shared secret / in-app purchase key'i iste).
   - [ ] Google Play app (Play service account JSON bağla).
3. [ ] **Products**: `spark_premium_monthly` ve `spark_premium_annual`'ı her iki platformdan import et.
4. [ ] **Entitlements**: `premium` adında entitlement oluştur → iki ürünü de ona bağla.
5. [ ] **Offerings**: `default` adında offering oluştur → içine 2 **package** ekle:
   - [ ] Monthly package → `spark_premium_monthly`
   - [ ] Annual package → `spark_premium_annual`
6. [ ] **API Keys → Public SDK keys**: iOS anahtarı `appl_...`, Android anahtarı `goog_...` ile başlar. Bunları kopyala.
7. [ ] `app.json` içine yapıştır:
   ```json
   "revenuecat": {
     "iosApiKey": "appl_XXXXXXXXXXXXXXXX",
     "androidApiKey": "goog_XXXXXXXXXXXXXXXX",
     "entitlementId": "premium",
     "offeringId": "default",
     "products": { "monthly": "spark_premium_monthly", "annual": "spark_premium_annual" }
   }
   ```
   > Gerçek anahtar girilince `BILLING_LIVE` otomatik `true` olur; paywall canlı yerel fiyatları (`priceString`) gösterir.

## 4. AdMob — reklam birimleri (iki yer birden!)

> **Dikkat:** Şu an hem reklam birimi ID'leri hem de **uygulama ID'leri test değerinde**. İkisini de değiştir.

1. [ ] AdMob → 2 uygulama oluştur (biri iOS, biri Android).
2. [ ] Her platform için reklam birimleri oluştur ve ID'lerini al:
   - [ ] Rewarded (ödüllü)
   - [ ] Interstitial (geçiş)
   - [ ] Banner
3. [ ] **Reklam birimi ID'leri** → `src/utils/ads.js` içindeki `PROD_*` sabitlerini gerçek `ca-app-pub-…/…` değerleriyle değiştir (6 sabit: ANDROID/IOS × REWARDED/INTERSTITIAL/BANNER).
4. [ ] **Uygulama ID'leri** → `app.json` içindeki `react-native-google-mobile-ads` eklentisinde:
   ```json
   "androidAppId": "ca-app-pub-GERÇEK~ANDROID",
   "iosAppId": "ca-app-pub-GERÇEK~IOS"
   ```
   (Şu an Google'ın test ID'leri yazılı — `~3347511713` / `~1458002511`.)
5. [ ] iOS: kişiselleştirilmiş reklam için **App Tracking Transparency** izni gerekir; `app.json`/Info.plist'te `NSUserTrackingUsageDescription` olduğundan emin ol.
6. [ ] `app-ads.txt` dosyanı yayıncı sitene koy (AdMob → app-ads.txt talimatları).

> `__DEV__` modunda otomatik **test reklamları** kullanılır; yayın build'inde `PROD_*` devreye girer. Gerçek reklamlara kendi cihazından **tıklama** — hesabın askıya alınabilir; AdMob'da test cihazı tanımla.

## 5. PostHog — doğrulama (Madde 1'i kapatmak)

1. [ ] `app.json → extra.posthog.apiKey` zaten dolu (`phc_...`). 
2. [ ] **KVKK/GDPR notu:** host şu an `https://us.i.posthog.com`. TR/AB kullanıcıların için **EU host** (`https://eu.i.posthog.com`) önerilir — projeni EU Cloud'da açtıysan host'u da EU yap (bkz. `POSTHOG_SETUP.md`). US projesi anahtarı EU host ile çalışmaz; ikisi tutarlı olmalı.
3. [ ] Native build'de uygulamayı aç → PostHog → **Activity (Live events)**: `paywall_viewed`, `personalized_story_opened`, `story_shared` vb. olayların aktığını gör.
4. [ ] `POSTHOG_SETUP.md`'deki tabloyu izleyerek **8 başarı metriği** funnel/retention raporlarını kur.

## 6. EAS native rebuild + cihazda test

RevenueCat, AdMob ve PostHog native modüldür — **Expo Go'da çalışmaz**.

1. [ ] `npx expo install posthog-react-native expo-file-system expo-application expo-device expo-localization` (gerekirse).
2. [ ] `npx expo prebuild`
3. [ ] Android: `npm run build:apk` · iOS: `eas build -p ios`
4. [ ] **Sandbox/Test satın alma:** App Store sandbox test kullanıcısı + Play "license testing" hesabıyla gerçek satın alma ve free trial akışını dene.
5. [ ] **Test reklamı:** ödüllü/geçiş reklamının yüklenip gösterildiğini doğrula.

---

## Kabul kriterleri (bittiğinde işaretle)

- [ ] **Madde 2:** Test cihazında gerçek (sandbox) satın alma başarılı + gerçek reklam gösterimi doğrulandı.
- [ ] **Madde 3:** Farklı App Store bölgesinde yerel para/fiyat görünüyor (örn. ABD'de `$…`, Almanya'da `€…`).
- [ ] **Madde 4:** 3 günlük free trial tanımlı; trial→ücretli dönüşümü analytics'te izlenebiliyor.
- [ ] **Madde 1:** 8 metrik PostHog dashboard'unda görünüyor (onboarding tamamlama, ilk okuma, 3/7 gün retention, paywall→premium funnel).

## Sıra (en hızlı gelir yolu)

1. App Store Connect + Play Console ürünleri (Adım 1–2)
2. RevenueCat bağla + anahtarları gir (Adım 3) → satın alma çalışır
3. AdMob ID'leri (Adım 4) → reklam geliri çalışır
4. Free trial (Adım 1.6 / 2.4)
5. EAS rebuild + sandbox test (Adım 6)
6. PostHog doğrulama + funnel'lar (Adım 5)

## Kaynaklar

- [RevenueCat — Getting Started](https://www.revenuecat.com/docs/getting-started)
- [RevenueCat — Entitlements & Offerings](https://www.revenuecat.com/docs/entitlements)
- [Apple — Auto-renewable subscriptions](https://developer.apple.com/app-store/subscriptions/)
- [Google Play — Create subscriptions](https://support.google.com/googleplay/android-developer/answer/140504)
- [AdMob — Get started](https://support.google.com/admob/answer/7356431)

# PostHog Analytics — Kurulum

Kod entegrasyonu tamam. Canlıya almak için 4 adım kaldı.

## Yapılan kod değişiklikleri

- `src/utils/analytics.js` — `trackEvent` artık PostHog'a `capture` gönderiyor. Eklenenler: `initAnalytics`, `setAnalyticsContext` (süper özellik), `identifyUser`, `resetAnalytics`, `flushAnalytics`, `ANALYTICS_LIVE`. SDK lazy-require ile yükleniyor; anahtar girilene kadar uygulama yalnızca log'lar (no-op), Expo Go'da çökmez.
- `App.js` — startup'ta `initAnalytics()` çağrılıyor ve `lang` süper özelliği ayarlanıyor.
- `src/context/UserDataContext.js` — `is_premium` ve `is_onboarded` her olaya otomatik ekleniyor (funnel'ları kullanıcı tipine göre dilimlemek için).
- `app.json` — `extra.posthog` anahtarı (EU host, KVKK için).
- `package.json` — `posthog-react-native` bağımlılığı.

## Kalan 4 adım

### 1. PostHog projesi aç
[posthog.com](https://posthog.com) → ücretsiz hesap → **EU Cloud** seç (KVKK/GDPR). Project Settings'ten **Project API Key**'i (`phc_...` ile başlar) kopyala.

### 2. Anahtarı gir
İki yoldan biri:

- `app.json → expo.extra.posthog.apiKey` içindeki `REPLACE_WITH_POSTHOG_PROJECT_API_KEY` yerine yapıştır, **veya**
- `.env` dosyasına: `EXPO_PUBLIC_POSTHOG_API_KEY=phc_...` (env, app.json'ı ezer)

### 3. Paketleri kur
```bash
npx expo install posthog-react-native expo-file-system expo-application expo-device expo-localization
```
(`expo-file-system` ve `expo-device` zaten kurulu; expo install doğru sürümleri hizalar.)

### 4. Native rebuild
RevenueCat/AdMob gibi PostHog da native modül — Expo Go'da çalışmaz.
```bash
npx expo prebuild
npm run build:apk      # Android
# veya: eas build -p ios
```

## Doğrulama

1. Uygulamayı gerçek build'de aç, onboarding'i tamamla, bir hikaye oku, paywall'ı gör.
2. PostHog → **Activity** (Live events): `paywall_viewed`, `personalized_story_opened`, `story_shared` vb. olayların `lang` / `is_premium` özellikleriyle aktığını gör.
3. Anahtar henüz placeholder ise: `ANALYTICS_LIVE=false` kalır, olaylar yalnızca konsola yazılır — uygulama normal çalışır.

## 8 başarı metriği nasıl kurulur

Olaylar akmaya başlayınca PostHog'da:

| Metrik | PostHog'da nasıl |
|---|---|
| Onboarding tamamlama | Funnel: `app_open` → `onboarding_time_budget_selected` → ilk `personalized_story_opened` |
| İlk hikaye okuma | Trends: ilk `personalized_story_opened` (yeni kullanıcı) |
| 3 / 7 gün retention | Retention raporu: başlangıç `app_open`, dönüş `app_open` |
| Favoriye ekleme | Trends: favori olayı / aktif kullanıcı |
| Paylaşım | Trends: `story_shared` + `social_share_platform` |
| Paywall öncesi terk | Funnel: oturum → `paywall_viewed` (dönüşmeyen) |
| Paywall → premium | Funnel: `paywall_viewed` → `paywall_purchase_succeeded` |
| Bildirimden dönüş | Trends: `notification_opened` |

İpucu: `is_premium` süper özelliğiyle her funnel'ı free/premium diye ayır.

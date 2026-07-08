# Apple App Store — Eksik Maddeler Checklist

_Oluşturulma: 3 Temmuz 2026 · Kaynak: app.json, eas.json, src/utils/ads.js, BILLING_SETUP.md, GELIR_KURULUM_REHBERI.md taraması_

## 1. Uygulama İkonu
- [x] `assets/icon.png` oluşturuldu (1024×1024, RGB, alfa kanalsız — `spark_shortcut_logo.png` kaynak alındı).

## 2. RevenueCat (satın alma) canlı değil
- [ ] App Store Connect → Paid Applications sözleşmesi imzala.
- [ ] `spark_premium_monthly` ve `spark_premium_annual` abonelik ürünlerini oluştur (fiyat, yerelleştirilmiş ad/açıklama, review screenshot).
- [ ] RevenueCat'te entitlement (`premium`) + offering (`default`) kur.
- [ ] Gerçek `appl_...` / `goog_...` API key'lerini `app.json → extra.revenuecat` içine yaz (şu an `test_zQNQaEomhNzTWshNkFgryXpMoSk`).
- [ ] `BILLING_LIVE` otomatik `true` olduğunu doğrula.

## 3. AdMob canlı reklam ID'leri eksik
- [ ] AdMob'da iOS + Android için gerçek uygulama oluştur.
- [ ] Rewarded / Interstitial / Banner reklam birimlerini oluştur.
- [ ] `src/utils/ads.js` içindeki 6 `PROD_*` sabitini gerçek `ca-app-pub-…/…` ID'leriyle değiştir.
- [ ] `app.json` içindeki `react-native-google-mobile-ads.androidAppId` / `iosAppId` değerlerini gerçek ID ile değiştir (şu an test ID).
- [ ] `src/utils/ads.js → USE_TEST_ADS`'i `false` yap.
- [ ] `app-ads.txt` dosyasını yayıncı sitesine koy.

## 4. Privacy / Terms / Refund sayfaları
- [ ] `https://sparkapp.co/privacy`, `/terms`, `/refund` sayfalarının canlı ve güncel olduğunu doğrula (App Review kontrol ediyor).

## 5. Satın alma / free trial testi
- [ ] Sandbox test kullanıcısıyla aylık + yıllık satın alma dene.
- [ ] Restore purchase (yeni cihaz/temiz kurulum) çalışıyor mu kontrol et.
- [ ] 3 günlük free trial tanımlı ve trial→ücretli dönüşü analytics'te görünüyor mu kontrol et.
- [ ] Sandbox satın alımı iade edince Premium bir sonraki açılışta kalkıyor mu kontrol et.

## 6. PostHog KVKK/GDPR host
- [ ] TR/AB kullanıcılar için EU host (`eu.i.posthog.com`) mu yoksa mevcut US host (`us.i.posthog.com`) mu kullanılacak karar ver; PostHog projesinin bulunduğu bölgeyle host'u tutarlı yap.

## 7. EAS submit ayarları
- [ ] `eas.json → submit.production` boş. Apple ID, ASC App ID, Team ID bilgilerini ekle (yoksa `eas submit` interaktif soracak).

## 8. iOS build numarası
- [ ] `app.json`'da yalnızca `version: "1.0.0"` var, ayrı `ios.buildNumber` yok. `appVersionSource: "remote"` olduğu için EAS otomatik yönetebilir ama ilk submit öncesi doğrula.

## 9. Mağaza görselleri
- [ ] `scripts/generate-screenshots.mjs` ile üretilen ekran görüntülerinin App Store Connect'e yüklendiğini doğrula (tüm gerekli cihaz boyutları için).

---

**Not:** En kritik 3 engel — eksik icon dosyası, RevenueCat'in test modunda kalması, AdMob production ID'lerinin girilmemiş olması. Bunlar çözülmeden build ya hata verir ya da Apple review'da reddedilir.

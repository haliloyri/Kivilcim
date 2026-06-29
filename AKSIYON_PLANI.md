# Spark (Kıvılcım) — Öncelikli Aksiyon Planı

_Hazırlanma tarihi: 24 Haziran 2026 · Kaynak: kod tabanı, veritabanı ve akışların incelenmesi_
_Hedefler: (1) gelir, (2) indirilme, (3) düzenli kullanım_

---

## Mevcut Durum — Net Tablo

Ürün teknik olarak olgun. Elimizdeki gerçek varlıklar:

- **İçerik:** 684 hikaye × 4 dil (tr/en/es/de) = 2.736 çeviri, 227 kitap kaynağı, 204 "sohbette kullan" varyantı.
- **Monetizasyon iskeleti:** RevenueCat + AdMob entegrasyonu yazılmış; freemium modeli (günde 3 ücretsiz + haftalık bonus + teaser), bağlama göre 8+ paywall varyantı.
- **UX & retention:** 7 adımlı kişiselleştirilmiş onboarding, TTS, dark mode, paylaşım kartları, rozet/seri/heatmap oyunlaştırması, segmentli bildirim metinleri.
- P0/P1 ürün backlog'unun neredeyse tamamı kapatılmış.

**Ana sorun:** Gelir ve ölçüm katmanı gerçekte bağlı değil. Asıl iş kalan ~%20'de.

---

## P0 — Lansman Öncesi Şart (gelir & ölçüm)

### 1. Gerçek analytics bağla — 🟡 Kod tamam, dashboard doğrulaması kaldı
- **Durum (25 Haz 2026):** PostHog kodu entegre (`src/utils/analytics.js`), `app.json`'da gerçek `phc_...` anahtarı var. Kalan: native build'de olay akışını PostHog dashboard'unda doğrulamak ve 8 metrik funnel'larını kurmak (bkz. `POSTHOG_SETUP.md`).
- **Sorun:** `trackEvent` yalnızca `console.log` yapıyor; hiçbir backend yok. TODO'daki 8 başarı metriğinin hiçbiri ölçülemiyor.
- **Etki:** Veri olmadan paywall dönüşümü, fiyat, freemium dengesi optimize edilemez — körlemesine tahmin.
- **Yapılacak:** Firebase Analytics / PostHog / Amplitude (ücretsiz kademe) bağla. `src/utils/analytics.js` içindeki merkezî `trackEvent` noktasına SDK çağrısı ekle.
- **Ölçülmesi gereken 8 başarı metriği (TODO'dan):**
  1. Onboarding tamamlama oranı
  2. İlk hikaye okuma oranı
  3. 3 gün ve 7 gün retention
  4. Favoriye ekleme oranı
  5. Paylaşım oranı
  6. Paywall görülmeden önce terk oranı
  7. Paywall görülüp premium'a geçiş oranı
  8. Bildirimden geri dönüş oranı
- **Kabul kriteri:** Yukarıdaki 8 metrik bir dashboard'da görünüyor (özellikle onboarding tamamlama, ilk okuma, 3/7 gün retention ve paywall görüntüleme→dönüşüm funnel'ı).

### 2. Gelir musluklarını gerçekten bağla — ⬜ Senin tarafın · Rehber hazır → `GELIR_KURULUM_REHBERI.md`
- **Not (25 Haz 2026):** Kod hazır. Adım adım kopyala-yapıştır kurulum rehberi hazırlandı (RevenueCat anahtarları, AdMob hem birim hem **uygulama** ID'leri, App Store/Play ürünleri, EAS rebuild, sandbox test). AdMob uygulama ID'lerinin de hâlâ Google test değerinde olduğu tespit edildi.
- **Sorun:** AdMob prod ID'leri `ca-app-pub-XXXX/XXXX`; RevenueCat anahtarları `REPLACE_WITH_...`. `BILLING_LIVE=false` — canlıda ne reklam ne abonelik geliri var.
- **Yapılacak:**
  - App Store Connect + Play Console'da ürünleri oluştur (`spark_premium_monthly`, `spark_premium_annual`).
  - RevenueCat'te `premium` entitlement + `default` offering kur, ürünleri bağla.
  - Gerçek public SDK anahtarlarını `app.json → extra.revenuecat`'a gir.
  - `src/utils/ads.js` içindeki `PROD_*` reklam birimi ID'lerini gerçek değerlerle değiştir.
  - EAS ile native rebuild (RevenueCat ve AdMob Expo Go'da çalışmaz).
- **Kabul kriteri:** Test cihazında gerçek satın alma ve gerçek reklam gösterimi doğrulandı.

### 3. Lokalize fiyatlandırma — 🟡 Kod tamam, mağaza tarafı kaldı (25 Haz 2026)
- **Sorun:** Fiyat ₺49/ay, ₺349/yıl olarak sabit. 4 dilli uygulamada diğer pazarlar absürt/yanlış fiyat görür.
- **Yapılan (kod):** Paywall'daki türetilmiş etiketler (aylık eşdeğer, tasarruf %, bedava ay) artık canlı paket fiyatlarından ve doğru para biriminden hesaplanıyor (`priceMeta`). `paywallAnnualMonthlyEquivalent` metnindeki sabit `₺` 4 dilden de kaldırıldı; canlı fiyat yokken `₺` fallback'i korunuyor. Ana fiyatlar zaten `livePackages.priceString` (yerel para) gösteriyordu.
- **Kaldı (senin tarafın):** RevenueCat'te bölgesel offering/fiyatlar (USD/EUR vb.) tanımla; native build'de farklı App Store bölgesinde doğrula.
- **Kabul kriteri:** Farklı App Store bölgelerinde yerel para ve uygun fiyat görünüyor.

### 4. Free-trial'ı doğrula — ⬜ Senin tarafın · Rehber hazır → `GELIR_KURULUM_REHBERI.md` (Adım 1.6 / 2.4)
- **Sorun:** Kodda `early_trial` paywall varyantı var ama gerçek trial RevenueCat'te tanımlı mı belirsiz.
- **Yapılacak:** 3 günlük (veya test edilecek) ücretsiz deneme tanımla; trial→ücretli dönüşümünü analytics'le izle.

---

## P1 — İndirilme (acquisition)

### 5. Paylaşım kartında viral döngüyü kapat — ✅ Tamamlandı (25 Haz 2026)
- **Sorun:** Kart altında "Spark'ı keşfet ✦" yazıyor ama gerçek indirme linki / @handle yok. Kartı gören kullanıcı uygulamayı bulamıyor.
- **Yapılan:**
  - Hikaye paylaşım kartı footer'ına erişim linki eklendi (`app.json → extra.shareLink`, şu an `kivilcim.app`). Link boşsa hiç gösterilmiyor.
  - Rozet paylaşım kartına da (`BadgeShareSheet.js`) aynı erişim linki eklendi.
  - Hikaye kartındaki metin logo (`✦ Albor`) gerçek marka logosuyla değiştirildi (tema duyarlı: koyu/açık).
  - Sosyal paylaşıma premium/reklam kapısı eklendi (önceden sadece üst menüde vardı).
  - "Kart oluştur" modalı `ShareCardModal` bileşenine taşındı; Sohbette Kullan'dan açılınca artık StoryDetail'e yönlenmeden aynı ekranın üzerinde açılıyor.
- **Not / kaldı:** `shareLink`'i yayına çıkışta gerçek store/landing URL'i ya da sosyal handle ile değiştir.
- **Yapılacak:** Karta kısa bir URL veya store linki / sosyal handle ekle (`StoryDetailScreen.js` footer strip). En ucuz büyüme kaldıracı.

### 6. Referans / davet mekanizması
- **Yapılacak:** "Arkadaşını davet et → 1 hafta premium" döngüsü. Hem acquisition hem retention besler.

### 7. ASO + store listing — 🟡 Metin taslağı hazır, mağazaya giriş + görseller kaldı (25 Haz 2026)
- **Yapılan:** 4 dilde (tr/en/es/de) mağaza metni hazırlandı → `ASO_STORE_LISTING.md`. App adı/alt başlık/anahtar kelime/kısa+uzun açıklama, karakter limitleri içinde; tohum anahtar kelime listesi dahil. App adı varsayımı: **Albor**.
- **Kaldı (senin tarafın):** Metinleri App Store Connect + Play Console'a gir; her dil için ekran görüntüsü seti hazırla; yayından 2–4 hafta sonra arama verisiyle anahtar kelimeleri revize et.
- **Yapılacak:** Anahtar kelime araştırması; store listing mesajlarını ekran gerçeğiyle birebir hizala; her dil için ekran görüntüsü seti.
- **Mesaj önerisi (tek cümle değer önerisi):** "Her gün birkaç dakikada uygulanabilir fikirler, hikayeler ve ilham."

---

## P2 — Düzenli Kullanım (retention)

### 8. Sunucu push bildirimi
- **Sorun:** Bildirimler lokal; OS uygulamayı öldürünce zincir kopar, geri çağırma kırılgan.
- **Yapılacak:** Sunucu taraflı push (Expo Push / FCM) ekle; mevcut segment metinlerini bağla.

### 9. İçerik üretim kadansı
- **Sorun:** "Günün Kıvılcımı" 684 hikayeyi döndürüyor; ağır kullanıcı birkaç ayda tüketir → churn.
- **Yapılacak:** Haftalık düzenli yeni hikaye yayını planı (mevcut batch üretim script'leri kullanılabilir).

### 10. Freemium dengesini test et
- **Sorun:** Teaser sonrası sert kilit erken kopuş yaratabilir (kendi TODO'nda da işaretli).
- **Yapılacak:** Günde 3 ücretsiz mi, daha yumuşak mı? A/B test — ancak analytics (madde 1) bağlandıktan sonra anlamlı.

---

## Önerilen Uygulama Sırası

1. Analytics SDK'sını bağla (ölçemediğini optimize edemezsin)
2. RevenueCat + AdMob gerçek anahtarları + trial
3. Lokalize fiyatlandırma
4. Paylaşım kartına link + referans döngüsü
5. ASO + store listing
6. Sunucu push + içerik kadansı
7. Freemium A/B testleri

---

## İzlenecek Başarı Metrikleri

Onboarding tamamlama · ilk hikaye okuma · 3 ve 7 gün retention · favoriye ekleme · paylaşım oranı · paywall öncesi terk · paywall→premium dönüşüm · bildirimden geri dönüş · trial→ücretli dönüşüm · ARPU / ARPPU.

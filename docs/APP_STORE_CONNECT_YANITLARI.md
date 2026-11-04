# App Store Connect yanıtları ve gizlilik politikası düzeltmeleri (iOS)

**Hazırlanma:** 4 Kasım 2026 · `com.albor.app` 1.0.0 · kaynak: bu repodaki kod ve `ios/Pods` gizlilik manifestleri.

Bu dosya App Store Connect (ASC) formlarına girilecek yanıtları ve alborapp.com gizlilik politikasında değişmesi gereken yerleri toplar. Panel ve web sitesi bu repodan değiştirilmez; aşağıdakiler elle girilmeli.

---

## 1. Gizlilik politikası (alborapp.com/privacy) — düzeltilecek yerler

15 Ağustos 2026 tarihli canlı metin uygulamanın bugünkü davranışıyla çelişiyor. Kaynak web sitesi reposu (`../Spark-Website`) bu oturumun dışında; metni orada güncelleyip yayınlayın, sonra 4 dilde tarihi değiştirin.

| Canlı politikada | Gerçek davranış (kod) | Yapılacak |
|---|---|---|
| Ad soyad "yalnızca cihazınızda" | Profil adı `upsert_profile` ile Supabase `profiles.display_name` alanına gidiyor (`UserDataContext.js:1224`) | "Profil adı, okuma geçmişinle birlikte Supabase'de hesabına bağlı saklanır" de |
| Uygulama içi e-posta cihazda | E-posta alanı artık sunucuya gitmiyor (`20261029000000_drop_profiles_email.sql`); uygulamada e-posta girişi yok | Uygulama içi e-posta satırını kaldır |
| Parolalı hesap yok | Doğru. Ama ilk açılışta otomatik **anonim Supabase hesabı** açılıyor (`ensureDeviceSession`) | "Kurulumda sana rastgele bir hesap kimliği atanır" cümlesini ekle |
| Reklam/analitik kullanılmıyor | **Google AdMob** var (UMP + ATT, AB/İngiltere/İsviçre'de reklam kapalı). PostHog kapalı | Google AdMob bölümü ekle: cihaz reklam kimliği (yalnız izin verilirse), kaba konum (IP), reklam etkileşimi, çökme/performans verisi; Google'ın gizlilik politikasına link |
| Ödeme anılmıyor | **RevenueCat** + Apple satın alma: satın alma geçmişi, anonim RevenueCat kimliği | RevenueCat bölümü ekle; ödeme bilgisini Albor'un görmediğini yaz |
| Push anılmıyor | Expo push token Supabase `push_tokens` tablosunda (`notifications.js:543`), gönderim Expo Push Service üzerinden | Push bildirim token'ı ve Expo bölümü ekle |
| Silme yalnız e-postayla | Uygulamada **Profil → Hesabımı sil** var: `delete_my_account()` hesabı ve tüm bulut verisini kalıcı siler | Önce uygulama içi yolu yaz, e-postayı alternatif bırak |
| Ses kayıtları cihazda | Doğru (kod kayıt yüklemiyor) | Değişmez |

Destek ve veri silme sayfaları (`/support`, `/delete-data` vb.) da aynı uygulama içi silme yolunu anlatmalı.

---

## 2. App Privacy formu (ASC → App Privacy)

**"Bu uygulamadan veri topluyor musunuz?" → Evet.**

| Apple veri türü | Kim topluyor | Kullanıcıya bağlı | Takip | Amaç |
|---|---|---|---|---|
| Contact Info → **Name** | Albor (profil adı, isteğe bağlı) | Evet | Hayır | App Functionality |
| Identifiers → **User ID** | Albor (Supabase anonim kimlik) | Evet | Hayır | App Functionality |
| Identifiers → **Device ID** | Albor (push token) + Google AdMob (IDFA, yalnız ATT izniyle) | Evet | **Evet** (AdMob) | App Functionality; Third-Party Advertising; Developer's Advertising; Analytics |
| Usage Data → **Product Interaction** | Albor (okuma, beğeni, favori, kariyer ilerlemesi) + AdMob | Evet | Hayır | App Functionality; Third-Party Advertising; Analytics |
| Usage Data → **Advertising Data** | Google AdMob | Evet | Hayır | Third-Party Advertising; Developer's Advertising; Analytics |
| Location → **Coarse Location** | Google AdMob (IP) | Evet | Hayır | Third-Party Advertising; Analytics |
| Purchases → **Purchase History** | RevenueCat | Hayır | Hayır | App Functionality |
| Diagnostics → **Crash Data**, **Performance Data**, **Other Diagnostic Data** | Google AdMob | Hayır | Hayır | Third-Party Advertising; Analytics |

Toplanmayanlar: e-posta, telefon, adres, sağlık, finans bilgisi, kişiler, ses kayıtları (cihazda kalıyor), fotoğraflar (yalnız kaydetme izni), arama/tarama geçmişi.

Kaynaklar: AdMob ve RevenueCat satırları `ios/Pods/Google-Mobile-Ads-SDK/.../PrivacyInfo.xcprivacy` ve `ios/Pods/RevenueCat/Sources/PrivacyInfo.xcprivacy` manifestlerinden; Albor satırları `ios/Albor/PrivacyInfo.xcprivacy` içinde (4 Kasım 2026'da eklendi). Yeni archive'dan sonra Xcode → Organizer → **Generate Privacy Report** çıktısı bu tabloyla karşılaştırılmalı.

**Gizlilik politikası URL'si:** `https://alborapp.com/privacy` (1. bölüm güncellendikten sonra).

---

## 3. Yaş derecelendirmesi anketi (ASC → App Information → Age Rating)

Önerilen yanıtlar (son karar sizde):

- Şiddet, cinsellik/çıplaklık, küfür, korku, uyuşturucu/alkol/tütün, kumar, yarışma: **Yok**
- Tıbbi/tedavi bilgisi veya sağlık/zindelik konuları: **Seyrek/hafif** — Sağlık kategorisindeki kitap özetleri genel bilgi veriyor, teşhis/tedavi önermiyor
- Kullanıcı üretimi içerik, mesajlaşma/sohbet: **Yok** (paylaşım kartları yalnız sistem paylaşım menüsüyle dışarı çıkıyor)
- Sınırsız web erişimi: **Hayır** (kitap linkleri Safari'de açılıyor, uygulama içi tarayıcı yok)
- Reklam: **Evet** (Google AdMob)
- Uygulama içi ebeveyn denetimi / yaş doğrulama: **Hayır**

---

## 4. App Review bilgileri (ASC → App Review Information)

**Giriş gerekli mi:** Hayır. Demo hesap gerekmez.

**Notes (İngilizce, olduğu gibi yapıştırılabilir):**

```
Albor does not require sign-in. On first launch the app creates an anonymous account automatically, so reviewers can use every feature without credentials.

- Stories: complete the short onboarding, then open any story from Home.
- Premium: Profile > Go Premium (or any locked story) opens the paywall. Subscriptions (monthly, yearly) and the lifetime purchase are handled by Apple In-App Purchase via RevenueCat; use a Sandbox account.
- Restore purchases: on the paywall.
- Account deletion (5.1.1(v)): Profile > Delete account. This permanently deletes the anonymous account and all synced data on our server, then resets the app.
- Ads: Google AdMob with Google UMP consent and App Tracking Transparency. Ads are disabled in the EEA, UK and Switzerland.
- Photo library: add-only permission, used only to save share cards the user creates.
- Microphone: used only to record and play back the user's own reading; recordings stay on the device.
```

**İletişim:** ad, telefon, e-posta alanlarını doldurun (`info@alborapp.com` destek adresi olarak kullanılabilir).

---

## 5. DSA trader beyanı (ASC → Business → Digital Services Act)

Karar sizin: uygulama ücretli ürün ve reklam içerdiği için Apple'ın tanımında büyük ihtimalle **trader** sayılırsınız. Trader seçerseniz adres, telefon ve e-posta AB App Store sayfasında görünür; telefon ve e-posta Apple tarafından doğrulanır. AB'de yayınlamayacaksanız bu adım AB ülkelerini kapatarak ertelenebilir.

---

## 6. Hâlâ panel/kişi gerektiren maddeler

- `supabase/migrations/20261002000000_delete_my_account.sql` ve `20261104000000_delete_my_account_push_tokens.sql` canlı Supabase'e uygulanmalı (CLI ile, elle). Uygulanmadan silme düğmesi `profileDeleteAccountFailed` hatası verir.
- Gerçek iPhone ekran görüntüleri (6.9 inç, 1320×2868): `scripts/generate-screenshots.mjs` çıktıları SVG taslak, mağazaya uygun değil.
- İçerik hakları: kitaplardan türetilen metinler, kapaklar ve seslendirmeler için kullanım dayanağı.

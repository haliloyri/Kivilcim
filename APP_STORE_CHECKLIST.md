# Albor — App Store yayın hazırlığı kontrol listesi

**Kontrol tarihi:** 30 Eylül 2026 (Europe/Istanbul)

**İncelenen uygulama:** Albor · `com.kivilcim.app` · sürüm `1.0.0` · Expo SDK 57

**Sonuç:** Mevcut durumuyla App Review'a gönderilmeye hazır değil. Aşağıdaki teknik eksikler giderilmeli ve Apple panelindeki belirsiz maddeler doğrulanmalı.

**İşaretler:** `[x]` kontrol edilen kapsamda tamam · `[ ] EKSİK` somut eksik/hata · `[ ] KISMİ` altyapı var, sonuç tamam değil · `[ ] DOĞRULANMADI` hesap/cihaz/mağaza kanıtı gerekiyor · `[ ] KOŞULLU` özelliğin yayın kararına bağlı.

Bu rapor kaynak kodu, mevcut native iOS projesi, EAS'ın son 10 iOS build kaydı, yerel testler, canlı web sayfaları ve güncel Apple belgelerine dayanır. App Store Connect ve RevenueCat panelleri incelenmedi. Yeni ücretli build, upload, yayın, satın alma veya Supabase işlemi yapılmadı. Uygulama kodu ve mevcut kullanıcı değişiklikleri değiştirilmedi; yalnızca bu belge güncellendi.

## Önce çözülmesi gerekenler

| Öncelik | Durum | Bulgu | Tamamlanma ölçütü |
|---|---|---|---|
| 1 | EKSİK | App Store production build imzalama aşamasında başarısız. | Distribution sertifikası + App Store provisioning profile ile yeni `production / STORE` build başarılı olmalı. |
| 1 | EKSİK | Otomatik oluşturulan misafir hesabını silme akışı yok. | Uygulama içinden hesap ve ilişkili verilerin silinmesi başlatılabilmeli; yalnızca sıfırlama veya e-posta yönlendirmesi yeterli değil. |
| 1 | EKSİK | Canlı gizlilik/koşullar metni kodun veri aktarımıyla çelişiyor. | Sunucuya giden ad, e-posta, cihaz kimliği, etkinlikler ve kullanılan SDK'lar politika ve App Privacy beyanlarıyla eşleşmeli. |
| 1 | EKSİK | Varsayılan iOS ikon PNG'sinde alfa kanalı var. | Mevcut düz PNG ikon akışında 1024×1024 opak ikon kullanılmalı; son archive upload doğrulamasından geçmeli. |
| 1 | EKSİK | Premium satışı kapalı; paywall mevcut. | Gerçek iOS mağaza bağlantısı ve sandbox testleri tamamlanmalı veya ilk sürümün ücretsiz kapsamı buna göre düzenlenmeli. |
| 1 | EKSİK | Release sürümünde test reklamları açık. | Gerçek reklam kurulumu + gerekli izinler tamamlanmalı veya ilk sürümde reklam akışları kapatılmalı. |
| 2 | EKSİK | Mağazaya hazır gerçek iPhone ekran görüntüsü seti repoda bulunamadı. | Güncel Albor ekranları uygun PNG/JPEG ölçülerinde hazırlanıp ASC'ye yüklenmeli. |
| 2 | KISMİ | Testlerde bir ekran testi tekrarlanabilir zaman aşımı veriyor. | Neden ayrıştırılmalı, test geçmeli ve gerçek iPhone açılışı doğrulanmalı. |

Öncelikler bu denetimin yayın hazırlığı değerlendirmesidir; Apple'ın kesin ret kararı olarak yorumlanmamalıdır.

## 1. Uygulama kimliği ve iOS hazırlığı

- [x] **Marka ve bundle ID tanımlı.** `app.json` adı Albor; native `Info.plist` görünen adı Albor; Xcode bundle ID'si `com.kivilcim.app`. ASC kaydı da aynı ID ile eşleşmeli.
- [x] **iPhone hedefi tutarlı.** `supportsTablet: false`, Xcode `TARGETED_DEVICE_FAMILY = 1`. iOS minimum sürümü `16.4`. iPad uygulaması hedeflenmiyor; ayrı iPad screenshot seti mevcut hedef için koşullu.
- [x] **Yerel Xcode/SDK minimumu karşılıyor.** Xcode `26.6 (17F113)`, iOS SDK `26.5` bulundu. Apple 28 Nisan 2026'dan beri iOS 26 SDK veya üzerini istiyor. Son dağıtım arşivinin SDK'sı ayrıca doğrulanmalı. [Apple SDK koşulu](https://developer.apple.com/news/?id=ueeok6yw)
- [x] **İkon dosyaları var ve boyutları doğru.** `assets/spark_shortcut_logo.png`, `assets/icon.png`, native `App-Icon-1024x1024@1x.png`: hepsi 1024×1024.
- [ ] **EKSİK — İkonun alfa kanalı kaldırılmalı.** `sips` üç dosyada da `hasAlpha: yes` verdi. Kullanılan varsayılan native ikon, `ios/Albor/Images.xcassets/AppIcon.appiconset/Contents.json` içindeki tek PNG. Eski checklist'in “RGB, alfa kanalsız” notu artık doğru değil. Yeni Icon Composer katmanları bu projede kullanılmıyor. [Apple ikon doğrulama örneği](https://developer.apple.com/forums/thread/96003)
- [ ] **KISMİ — Sürüm/build numarası yönetimi tamamlanmalı.** `Info.plist`: `1.0.0 (1)`; Xcode `CURRENT_PROJECT_VERSION=1`, `MARKETING_VERSION=1.0`. EAS `appVersionSource=remote`, fakat `autoIncrement` yok. Remote kullanımı tek başına her yüklemede artış garantilemez; son archive içindeki değerler kontrol edilmeli ve her yeni yüklemede benzersiz build kullanılmalı.
- [ ] **KISMİ — Native ve Expo ayarları birlikte yönetilmeli.** `ios/` Git'te takip ediliyor. Yalnızca `app.json` değiştirmek mevcut Xcode projesini kendiliğinden güncellemez. İkon, izin, AdMob ve sürüm değişiklikleri native dosyalara kontrollü yansıtılmalı.
- [x] **Şifreleme beyanı mevcut.** Expo ve native plist içinde `ITSAppUsesNonExemptEncryption=false`. Beyanın kullanılan şifreleme için doğruluğu ve ASC export compliance durumu ayrıca onaylanmalı.

## 2. Apple hesabı, imzalama ve EAS

- [x] **EAS hesabı/proje bağlantısı doğrulandı.** CLI giriş yapılmış; proje `hoyri/spark`, ID `73e8e4f4-f966-42cd-9c4e-3ffb9799314e`.
- [x] **iOS production profili mevcut.** `eas.json` içinde Release ve remote credentials tanımlı. Profilin varlığı başarılı imzalama anlamına gelmez.
- [x] **Daha önce başarılı native iOS preview build alınmış.** Son kayıt 29 Eylül 2026, `1.0.0 (1)`, `FINISHED`, `preview / INTERNAL`. [EAS build](https://expo.dev/accounts/hoyri/projects/spark/builds/4eed88a8-1626-4a79-81ed-37f7bf0654e9)
- [ ] **EKSİK — Başarılı App Store dağıtım build'i doğrulanamadı.** Son 10 kayıt içinde görülen production denemeleri başarısız. Sonuncusu 26 Eylül 2026: `b23c56f7-92e1-45df-8bc8-3b6da15abe57`, `production / STORE`, `ERRORED`. Günlük: `Failed to set up credentials. Credentials are not set up. Run this command again in interactive mode.` Sertifika/profil kurulumu tamamlanıp yeni build alınmalı. [Başarısız EAS build](https://expo.dev/accounts/hoyri/projects/spark/builds/b23c56f7-92e1-45df-8bc8-3b6da15abe57)
- [ ] **DOĞRULANMADI — Apple Developer üyeliği ve ekip yetkileri.** Aktif üyelik, doğru Team, güncel sözleşmeler ve gerekli rol Apple hesabından kontrol edilmeli. Preview build geçmişi güncel App Store yetkisini kanıtlamaz.
- [ ] **DOĞRULANMADI — App Store Connect uygulama kaydı.** Bundle ID, SKU, Apple ID (`ascAppId`), ana dil ve görünen isim kontrol edilmeli.
- [ ] **KISMİ — Submit yapılandırması boş.** `submit.production={}`. Bu tek başına yayın engeli değildir; interaktif submit yapılabilir. Tekrarlanabilir yükleme için ASC app/team seçimi ve kimlik doğrulaması netleştirilmeli; özel anahtarlar repoya konmamalı.
- [ ] **DOĞRULANMADI — Push entitlement.** Yerel `Albor.entitlements` içinde `aps-environment=development`. Dağıtım imzasının son IPA'da uygun production yetkisiyle eşleştiği kontrol edilmeli; kaynak dosyayı tek başına esas alıp hatalı imza sonucu çıkarılmamalı.
- [ ] **DOĞRULANMADI — TestFlight kabulü.** INTERNAL IPA, TestFlight/App Store build'i değildir. Store build'in upload sonrası Apple tarafından işlenmesi, seçilebilir olması ve test cihazına TestFlight üzerinden kurulması doğrulanmalı.

## 3. Satın alma, abonelik ve Premium

- [x] **RevenueCat entegrasyon kodu mevcut.** Ürün/paket okuma, mağaza fiyatları, purchase, restore ve entitlement güncelleme yolları `src/services/billing.js` içinde var.
- [x] **Restore ve abonelik yönetimi arayüzü mevcut.** Profilde restore; `src/constants/externalLinks.js` içinde Apple abonelik yönetimi bağlantısı var. Bu yalnızca kod varlığı kontrolüdür.
- [x] **Paywall'da yasal bağlantılar ve otomatik yenileme açıklaması var.** `PaywallScreen.js` gizlilik/koşullar/iade linklerini ve yerelleştirilmiş yenileme açıklamasını içeriyor.
- [ ] **EKSİK — Gerçek iOS RevenueCat anahtarı yok.** `app.json` içindeki `iosApiKey` bir `test_*` anahtarı. Kod bunu boş sayıyor; `BILLING_LIVE=false`, gerçek satış yapılamıyor. Premium yayımlanacaksa Apple mağazasına bağlı `appl_*` public SDK anahtarı gerekli.
- [ ] **DOĞRULANMADI — ASC ürünleri ve RevenueCat eşlemesi.** Mevcut konfigürasyon: entitlement `Albor Pro`, offering `default`, ürünler `monthly`, `yearly`, `lifetime`. Bunların panelde birebir eşleştiği doğrulanmalı. Eski checklist'teki `premium` ve `spark_premium_*` değerleri güncel konfigürasyonu temsil etmiyor.
- [ ] **KOŞULLU — Ücretli ürün hazırlığı.** Premium sunulacaksa Paid Applications sözleşmesi, banka/vergi bilgileri, aylık/yıllık abonelik grubu, fiyatlar, ürün yerelleştirmeleri ve review görselleri tamamlanmalı. Lifetime sunulacaksa non-consumable ürün olarak eşlenmeli. İlk IAP/aboneliklerin sürümle incelemeye eklenmesi kontrol edilmeli.
- [ ] **EKSİK — Deneme süresi/uygunluğu mağazadan doğrulanmıyor.** `PaywallScreen.js` içindeki `showsTrial`, yalnızca `billingLive` ve lifetime olmamasına bakıyor. Metinler 7 gün vaat ediyor; kullanıcı uygunluğu ve ürünün gerçek introductory offer bilgisi kontrol edilmiyor. Canlı satıştan önce uygun olmayan kullanıcıya deneme vaat edilmemeli. Eski listedeki 3 gün bilgisi güncel değil.
- [ ] **DOĞRULANMADI — Sandbox senaryoları.** Aylık/yıllık/lifetime, satın alma iptali, başarısız ödeme, restore, başka cihaz, yenileme, süre dolması ve iade sonrası erişim test edilmeli. Ücretsiz deneme sunmak zorunlu değil; sunuluyorsa metin ve gerçek ürün koşulları eşleşmeli.
- [ ] **KOŞULLU — Ücretsiz ilk sürüm alternatifi.** Satış ertelenecekse erişilemeyen satın alma ekranları ve Premium vaatleri yayın kapsamına göre düzenlenmeli. RevenueCat kullanmak başlı başına Apple şartı değil; mevcut ücretli akışın çalışması önemli.

## 4. Reklamlar ve takip

- [ ] **EKSİK — Release test reklamları açık.** `src/utils/ads.js`: `USE_TEST_ADS=true`; production reklam birimleri placeholder. Expo ve native plist'teki iOS AdMob app ID'si Google örnek ID'si. Gerçek reklamla çıkılacaksa iOS app/unit ID'leri tamamlanmalı; reklamsız çıkılacaksa reklam gösterme/kilit açma yolları düzenlenmeli.
- [ ] **EKSİK — Takip/izin stratejisi tamamlanmalı.** Kişiselleştirilmiş reklam isteğine izin veren `requestNonPersonalizedAdsOnly:false` var; kod taramasında ATT isteği/izin sonucu yönetimi veya AdsConsent/UMP akışı bulunmadı. Plist'te izin cümlesi bulunması izin alındığı anlamına gelmez. Takip yapılacaksa ATT'den önce başlamamalı; takip yapılmayacaksa SDK davranışı ve beyanlar bunu desteklemeli. [Apple takip kuralları](https://developer.apple.com/app-store/user-privacy-and-data-use/)
- [x] **EEA/UK için reklam engelleme kontrolü kodda var.** `adRegion.js` ve `ads.js`; bilinmeyen bölge de kısıtlı sayılıyor.
- [ ] **KISMİ — Bölge kontrolü fiziksel konum doğrulaması değil.** Karar cihaz locale bölgesinden geliyor; bu tek başına kullanıcı konumunu veya gerekli rızayı kanıtlamaz. Canlı reklam açılmadan önce hedef ülkeler, SDK başlatma davranışı ve izin gereksinimleri değerlendirilip test edilmeli.
- [ ] **KOŞULLU — AdMob operasyonel hazırlığı.** Reklam yayımlanacaksa hesap/onay, app-ads.txt ve reklam sağlayıcısının gerektirdiği güncel ayarlar tamamlanmalı. Bunlar tüm uygulamalar için genel Apple yayın zorunluluğu değildir.

## 5. Gizlilik, hesap silme ve izinler

- [x] **Uygulama içi gizlilik/koşullar bağlantıları mevcut.** Profil ve paywall, dile göre `alborapp.com` bağlantılarını açıyor.
- [x] **Türkçe gizlilik, koşullar, destek ve veri silme sayfaları tarayıcıda açıldı.** `/privacy/tr`, `/terms/tr`, `/support/tr`, `/data-deletion/tr` içerikleri görüldü. HTTP otomasyon istekleri 403 verse de tarayıcı kontrolü başarılı; bu nedenle site “kapalı” olarak işaretlenmedi.
- [ ] **DOĞRULANMADI — İade sayfası ve bütün dil varyantları.** `/refund/tr` tarayıcı aracında `ERR_BLOCKED_BY_CLIENT` verdi; sayfanın gerçekten bozuk olduğu kanıtlanmadı. EN/ES/DE sayfaları ve uygulama içi Safari açılışları ayrıca kontrol edilmeli. HTTP taramasında 16 yol 403 döndü; bu tek başına kullanıcı erişim hatası kanıtı değil.
- [ ] **EKSİK — Canlı politika ile kod çelişiyor.** 15 Ağustos tarihli gizlilik sayfası ad/e-postanın cihazda kaldığını ve ayrı reklam hizmeti kullanılmadığını söylüyor. `UserDataContext.js` profil değişiminde `display_name` ve `email` alanlarını `upsert_profile` kuyruğuna gönderiyor; `supabase.js` cihaz kimliğiyle anonim hesap oluşturuyor; `App.js` reklam servisini başlatıyor. Politika, destek/veri silme açıklamaları ve gerçek yayın davranışı aynı olmalı. [Canlı gizlilik sayfası](https://alborapp.com/privacy/tr)
- [ ] **EKSİK — Tam hesap silme akışı yok.** `ensureDeviceSession()` otomatik Supabase anonim hesabı oluşturuyor. Profildeki `clearUserData()` / `resetUserDataOnServer()` bazı tabloları temizleyip profili güncelliyor; `auth.users` hesabını ve profil kaydını silmiyor. Web veri silme sayfası da e-posta talebine yönlendiriyor. Apple otomatik misafir hesaplarını da silme şartına dahil ediyor. [Apple hesap silme şartı](https://developer.apple.com/support/offering-account-deletion-in-your-app/)
- [ ] **DOĞRULANMADI — App Privacy formu.** Mevcut kod en az ad/e-posta (girildiyse), kullanıcı/cihaz tanımlayıcıları ve okuma/etkileşim verilerinin incelenmesini gerektiriyor. Reklam ve satın alma verileri son yayın kapsamına göre eklenmeli. “Veri toplanmıyor” varsayımı yapılamaz; üçüncü taraf SDK davranışı da dahil edilmeli. ASC formu görülmedi. [Apple gizlilik beyanı](https://developer.apple.com/app-store/app-privacy-details/)
- [x] **Privacy manifest dosyası mevcut.** Native manifest required-reason API kategorileri ve gerekçeleri içeriyor; Pod ayarında privacy manifest aggregation açık.
- [ ] **KISMİ — Manifestin bütünlüğü doğrulanmalı.** Uygulama manifestinde collected data listesi boş, tracking `false`. Bu tek başına otomatik ret kanıtı değildir; paketlenen SDK manifestleri, gerçek veri kullanımı ve ASC beyanıyla birlikte archive privacy report üzerinden kontrol edilmeli.
- [x] **PostHog mevcut konfigürasyonda kapalı.** Placeholder anahtar ve `ANALYTICS_LIVE` koruması var; EU host tanımlı. PostHog'u etkinleştirmek yayın için zorunlu değil. EAS ortam değişkenleriyle override edilmediği son build'de doğrulanmalı. PostHog'un kapalı olması Supabase veri aktarımını durdurmuyor.
- [x] **Mikrofon/fotoğraf izin açıklamaları mevcut.** Native plist ve TR/EN/ES/DE yerelleştirme dosyaları var; Xcode kaynaklarına eklenmişler.
- [ ] **KISMİ — İzinlerin cihaz testi.** Mikrofon, fotoğrafa kaydetme, bildirim ve gerekiyorsa takip: kabul/ret/sonradan iptal durumları test edilmeli. `NSPhotoLibraryUsageDescription` tam kitaplık okuma açıklaması dört dil JSON'unda yok; kod tam okuma izni istiyorsa açıklama yerelleştirilmeli, yalnız kaydetme gerekiyorsa en dar izin kullanılmalı.
- [ ] **KOŞULLU — Sign in with Apple.** Kullanıcıya açık üçüncü taraf sosyal giriş akışı bu taramada doğrulanmadı; servis yardımcılarının bulunması tek başına zorunluluk yaratmaz. Google/Facebook gibi giriş açılırsa Apple'ın 4.8 şartı ayrıca değerlendirilmeli.

## 6. Mağaza sayfası ve içerik

- [x] **Dört dilde mağaza metni taslağı var.** `ASO_STORE_LISTING.md`: TR/EN/ES/DE. Taslak olması ASC'ye girildiği veya güncel özelliklerle eşleştiği anlamına gelmez.
- [ ] **KISMİ — Metadata son kontrolü.** Uygulama adı/alt başlık/açıklama/anahtar kelimeler, kategori, telif satırı, support/privacy URL'leri ve ülke seçimi ASC'de tamamlanmalı. Özellik ve Premium/deneme vaatleri çalışan sürümle eşleştirilmeli.
- [ ] **EKSİK — Gerçek ekran görüntüsü seti.** `scripts/generate-screenshots.mjs` gerçek uygulama ekranı yakalamıyor: 1080×2340 SVG çiziyor ve “Spark” yazıyor. Repodaki bu taslaklar doğrudan App Store screenshot'u olarak kullanılamaz. Güncel Albor iPhone ekranlarını PNG/JPEG olarak hazırlayın; örneğin kabul edilen 6.9 inç setindeki 1320×2868 ölçüsü kullanılabilir. 6.9 seti verilmezse 6.5 seti gereklidir; her iPhone boyutu için ayrı set zorunlu değildir. [Apple screenshot ölçüleri](https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications/)
- [ ] **DOĞRULANMADI — Yaş derecelendirmesi.** Güncel ASC anketi; kitap/hikâye içerikleri, sağlık konuları, reklamlar ve web erişimi dikkate alınarak doldurulmalı. Otomatik olarak “4+” varsayılmamalı. [Apple yaş anketi](https://developer.apple.com/help/app-store-connect/manage-app-information/set-an-app-age-rating)
- [ ] **DOĞRULANMADI — İçerik hakları.** Kitaplardan türetilen metinler, alıntılar, kapaklar, seslendirmeler ve görseller için kullanım hakları/izin dayanakları ve kaynak doğruluğu gözden geçirilmeli. Kaynak göstermek tek başına izin belgesi değildir; bu denetimde içeriklerin tamamı/hak belgeleri incelenmedi.
- [ ] **DOĞRULANMADI — DSA trader beyanı.** ASC'de trader statüsü beyan edilmeli; AB'de trader olarak dağıtımda gereken iletişim doğrulaması tamamlanmalı. [Apple DSA hazırlığı](https://developer.apple.com/help/app-store-connect/manage-compliance-information/manage-european-union-digital-services-act-trader-requirements/)
- [ ] **DOĞRULANMADI — İnceleme bilgileri.** Review iletişim kişisi/telefon/e-posta, özelliklere erişim adımları, gerekiyorsa demo hesap ve satın alma notları girilmeli. Giriş zorunlu değilse bu belirtilmeli; inceleyici ücret ödemeden gereken özellikleri değerlendirebilmeli.

## 7. Gerçekten çalıştırılan kontroller

| Kontrol | Sonuç | Not |
|---|---|---|
| `xcodebuild -version`, `xcodebuild -showsdks` | GEÇTİ | Xcode 26.6, iOS SDK 26.5. |
| `eas whoami`, `eas build:list --platform ios --limit 10 --json --non-interactive` | GEÇTİ | Hesap ve build geçmişi okundu. Son production hatasının günlüğü ayrıca incelendi. |
| `CI=1 EXPO_OFFLINE=1 npx expo install --check` | SINIRLI GEÇTİ | “Dependencies are up to date”; araç offline doğrulamanın sınırlı olduğunu belirtti. Online Expo Doctor ve archive derlemesi yerine geçmez. |
| `CI=1 EXPO_OFFLINE=1 npx expo export --platform ios --output-dir /tmp/spark-appstore-ios-export` | GEÇTİ | iOS Hermes bundle ve asset export başarılı. İmzalı native archive veya cihaz çalışması kanıtı değil. |
| `npm test -- --watchman=false` | TAM GEÇMEDİ | 33 suite: 32 geçti, 1 başarısız. 194 test: 193 geçti, 1 başarısız. |
| Başarısız suite'in tek başına tekrarı | TAM GEÇMEDİ | `CareerPathExperience.smoke.test.js`: 7 geçti, `renders new_user` 5000 ms timeout. Tam koşuda da aynı test başarısızdı. Bu tek başına üretimde crash kanıtı değil; test/runtime nedeni ayrıştırılmalı. |
| İkon `sips` kontrolü | TAM GEÇMEDİ | 1024×1024 doğru; üç ikon dosyasında alfa kanalı var. |
| Canlı web kontrolü | KISMİ | TR privacy/terms/support/data-deletion tarayıcıda açıldı; içerik çelişkileri bulundu. Refund ve diğer diller tamamlanmadı. |

Geçici çıktı/günlükler: `/tmp/spark-appstore-tests.log`, `/tmp/spark-appstore-smoke-recheck.log`, `/tmp/spark-appstore-export.log`. Bunlar kalıcı CI kayıtları değildir.

- [ ] **DOĞRULANMADI — Yeni Release archive.** Bu denetimde yeni native archive oluşturulmadı. Kaynak ağacında önceden bulunan 9 değiştirilmiş dosya vardı; geçmiş EAS build'in bu çalışma ağacını kapsadığı varsayılamaz.
- [ ] **DOĞRULANMADI — Gerçek iPhone/TestFlight uçtan uca testi.** Temiz kurulum, onboarding, dil değişimi, hikâye açma/bitirme, yerel DB hazırlığı, favoriler, kariyer ilerlemesi, internet kesilmesi/geri gelmesi ve yeniden başlatmada veri korunması.
- [ ] **DOĞRULANMADI — Medya ve paylaşım.** Ses oynatma/kayıt, arka plan sesi, kesinti/kulaklık, fotoğrafa kaydetme, paylaşım kartları, paylaşım linki ve bildirimden doğru ekrana açılma.
- [ ] **DOĞRULANMADI — Görünüm ve erişilebilirlik.** Küçük/büyük iPhone, açık/koyu tema, dört dilde taşma, büyük yazı, VoiceOver ve izin reddinden sonra kullanılabilirlik.
- [ ] **DOĞRULANMADI — Canlı backend hazırlığı.** RLS, anonim giriş, senkronizasyon, migration ve silme davranışları release ortamında doğrulanmalı. Kullanıcı talimatına uygun olarak bu denetimde Supabase'e bağlanılmadı ve veri yazılmadı.

## 8. Eksikler kapandıktan sonraki yayın sırası

1. Hesap silme ve gizlilik çelişkisini çöz; ikon ve başarısız testi düzelt.
2. İlk sürümde Premium/reklam kararını uygula. Aktif olacaksa gerçek mağaza/SDK ayarlarını ve satın alma/izin testlerini tamamla.
3. Apple üyeliği, ASC kaydı ve distribution imzalama kurulumunu doğrula; benzersiz build numarasıyla production STORE build al.
4. IPA'yı ASC'ye yükle, Apple processing/export compliance durumunu kontrol et; TestFlight'ta gerçek cihaz testlerini tamamla.
5. Metadata, screenshot, App Privacy, yaş anketi, trader beyanı ve review bilgilerini tamamla; doğru build ve varsa ilk IAP ürünlerini sürüme bağla.
6. App Review'a gönder. Onay ve seçilen yayın zamanından sonra hedef ülkelerde gerçek mağaza erişimini doğrula. Upload, TestFlight'a çıkış, review onayı ve halka açık yayın ayrı aşamalardır. [Apple inceleme rehberi](https://developer.apple.com/app-store/review/)

**Eski checklist'ten düzeltilen varsayımlar:** İkon mevcut ama alfa kanallı; PostHog bilinçli kapalı; gerçek AdMob/RevenueCat kullanımı her ücretsiz uygulama için genel yayın şartı değil; boş submit profili tek başına engel değil; remote build sürümü otomatik artış garantisi değil; deneme metni 3 değil 7 gün; ürün/entitlement isimleri güncel konfigürasyona göre değişmiş.

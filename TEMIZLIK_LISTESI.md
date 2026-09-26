# Silinecek / Temizlenecekler

Profil yeniden tasarımı (25 Eylül 2026) sırasında kullanılmadığı tespit edilenler. Hiçbiri şu an hataya yol açmıyor. Silmeden önce `grep -rn "<ad>" src App.js` ile son bir kontrol yap.

## 1. Kullanılmayan çeviri anahtarları (`src/locales/i18n.js`, 4 dilde)

Kaynak kodda hiçbir yerde çağrılmıyorlar:

- **Eski profil / hesap:** `account`, `settings`, `editInfo`, `logout`, `profileLogoutTitle`, `profileLogoutSub`, `profileLogoutHint`, `profileGuestEmail`, `profileEmailPlaceholder`, `profileCompletePrompt`, `profileResetDataHint`
- **Eski premium kartı:** `profilePremiumUpsellTitle`, `profilePremiumUpsellSub`, `profilePremiumUpsellCta`, `premiumMember`
- **Eski profil istatistik/rozet bölümleri:** `profileStatsTotalReads`, `profileStatsStreak`, `profileStatsLongest`, `profileActivitySection`, `profileBadgesTitle`, `profileSeeAll`, `profileRecentTitle`
- **Eski ayar satırları:** `darkMode`, `test`, `dailyTargetSummary`, `reminderSummary`, `themeSummary`, `languageSummary`, `languageEnglish`, `languageTurkish`, `languageSpanish`, `languageGerman`, `storyVersion1`, `storyVersion2`
- **Onboarding e-posta alanı (kaldırıldı):** `onboarding_email_placeholder`, `onboarding_email_note`

## 2. Kullanılmayan bileşenler (`src/components/`)

Hiçbir dosya import etmiyor:

- `MicroVariantCard.js`
- `NotificationPreferences.js` (hatırlatma ayarları artık Profil'de)
- `StoryRowCard.js` (yerini `StoryCard type="ready"` aldı)

## 3. E-posta verisi (hesap sistemi gelene kadar)

Arayüzden e-posta girişi tamamen kalktı ama veri katmanı hâlâ taşıyor:

- `UserDataContext.js`: `userProfile.email` alanı ve Supabase `profiles.email` senkronu (`upsert_profile`). Eski kullanıcıların daha önce girdiği e-postalar burada duruyor.
- Karar: Gerçek giriş (`linkEmailToDeviceAccount`) devreye girene kadar alanı bırak **ya da** kaldır ve Supabase tarafında kolonu temizle. KVKK/GDPR açısından kullanılmayan e-postayı tutmamak daha doğru.

## 4. Eski dokümanlar / görseller

- `docs/screenshots/profile.svg`: Eski profil tasarımını gösteriyor, yeni ekran görüntüsüyle değiştirilmeli.
- `docs/screenshots/progress-legacy.svg`: Eski rozet/ısı haritası ekranı artık yok.
- `EKRANLAR.md` §8 (ProgressScreen): Hâlâ eski rozet/istatistik ekranını anlatıyor; İlerleme sekmesi artık Kıvılcım Yolu (`CareerPathExperience`).

## 5. Sonra yapılacak (silme değil)

- `app.json` → `ios.appStoreUrl` ekle (App Store ID alınınca). Şu an "Albor'u değerlendir" yedek olarak `alborapp.com/{dil}` açıyor.
- `alborapp.com/refund/{dil}` sayfalarının dört dilde de yayında olduğunu doğrula (privacy/terms/support doğrulandı).

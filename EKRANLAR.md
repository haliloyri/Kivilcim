# Spark — Ekran & Özellik Dokümantasyonu

> **Spark**, kişisel gelişim ve farkındalık hikayeleri sunan bir React Native (Expo) mobil uygulamasıdır. Kullanıcılar kısa hikayeler okur, ilerleme takip eder ve hikayeleri sosyal ortamlarda kullanmak için kısa versiyonlarına dönüştürür.

---

## Navigasyon Yapısı

```
LaunchScreen           → Yükleme ekranı (uygulama açılışında)
OnboardingScreen       → İlk açılışta (7 adımlı kurulum)
└─ MainTabs (Alt sekme çubuğu)
   ├─ HomeTab          → Ana Sayfa
   ├─ LibraryTab       → Kütüphane
   ├─ ProgressTab      → İlerleme
   └─ ProfileTab       → Profil
   
Stack (Modal/Tam ekran):
   ├─ StoryDetail      → Hikaye okuma ekranı
   ├─ UseInConversation → Sohbette kullan
   ├─ Search           → Arama
   └─ Paywall          → Premium abonelik (modal)
```

---

## 1. LaunchScreen — Başlangıç / Yükleme Ekranı

Uygulama açıldığında gösterilen splash ekranıdır.

**Özellikler:**
- Logo animasyonu (fade-in + scale spring)
- Yükleme durumuna göre değişen durum mesajları:
  - Hikayeler yükleniyor
  - Plan hazırlanıyor
  - Kütüphane hazırlanıyor
  - 5 saniye sonra "biraz daha uzun sürüyor" mesajı
  - 12 saniye sonra hata mesajı + "Tekrar Dene" butonu
- Karanlık/aydınlık mod için ayrı logo
- Tablet ve telefon için adaptif logo boyutu

---

## 2. OnboardingScreen — İlk Kurulum (7 Adım)

Uygulamayı ilk kez açan kullanıcıya gösterilen kurulum akışı. Üst kısımda ilerleme çubuğu ve adım noktaları bulunur.

| Adım | İçerik |
|------|--------|
| 0 | **Hoş Geldin** — Logo animasyonu + karşılama metni |
| 1 | **Nasıl Çalışır** — 3 kart: Hikayeler, Spark streaki, Hatırlatmalar |
| 2 | **Kategori Seçimi** — İlgi alanları (min. 2 seçim zorunlu) |
| 3 | **Günlük Süre** — 3dk / 6dk / 9dk okuma planı seçimi |
| 4 | **Hatırlatma Zamanı** — Sabah / Öğle / Akşam (çoklu seçim) |
| 5 | **Profil Bilgisi** — Ad ve e-posta (opsiyonel, atlanabilir) |
| 6 | **Özet** — Seçilen plan, kategoriler ve hatırlatma özeti |

**Özellikler:**
- Adımlar arası animasyonlu geçiş (fade + slide)
- Haptic feedback (dokunsal geri bildirim)
- Tamamlanan adım noktalarına tıklayarak geri gidebilme
- Adım 0 ve 5'te "Atla" butonu

---

## 3. HomeScreen — Ana Sayfa

Uygulamanın ana içerik akışı. (Alt sekme: 🧭 Keşfet)

**Bölümler:**
- Öne çıkan / günün hikayesi
- Kategoriye göre filtrelenmiş hikaye akışı
- Günlük hedef paneli (bugün kaç hikaye okundu)
- Premium kullanıcılar için ek içerik

**Özellikler:**
- Kategori bazlı filtreleme (CategoryPill bileşeni)
- Kilitli hikayeler → Paywall yönlendirmesi
- Hikayeye tıklayınca StoryDetailScreen'e geçiş

---

## 4. StoryDetailScreen — Hikaye Okuma Ekranı

Bir hikayelerin tam içeriğinin okunduğu ekran.

**Özellikler:**
- Animasyonlu başlık girişi (scroll ile parallax efekti)
- **Yazı boyutu ayarı** — kullanıcı font büyüklüğünü değiştirebilir
- **Favori** ekleme / çıkarma
- **Sonraya kaydet** (read later) özelliği
- **Paylaşım — "Kart Oluştur":**
  - **İçerik tipi** (çoklu seçim, Story/Reel'de birden fazla): Alıntı, Ders, Sorgula (yansıma), Hook
  - **6 tema (birleşik palet):** Ink (koyu), Paper (açık), Gold, Slate, Forest, Plum. Gold/Slate/Forest/Plum aksanları ve marka gold'u (`#C89B3C` / dark `#E5C27A`), rozet paylaşım ekranıyla (`BadgeShareSheet`) aynı renk dilini paylaşır — iki ekran arasında görsel tutarlılık sağlanır. (Eski Sun/Night/Emerald/Rose gradientleri kaldırıldı.)
  - **3 format:** Post (1:1), Story (9:16), Reel (9:16). Reel görsel olarak Story ile aynıdır; ek olarak panoya hazır bir reel senaryosu (`+script` rozetiyle belirtilir) ekler.
  - **Kart düzeni:** üç bölgeli (marka şeridi / dikeyde ortalı içerik / tek satır kaynak künyesi + CTA)
  - Paylaş butonu görsel hazırlanırken yükleniyor durumu gösterir
  - Pano'ya açıklama metni (caption + hashtag) kopyalama
  - Sistem paylaşım diyaloğu ile PNG paylaşımı
  - **Carousel — "Tüm kareleri kaydet":** Birden fazla içerik tipi seçildiğinde görünen ikincil buton. Her seçili mesajı **ayrı bir kart** olarak üretip galeriye kaydeder (`expo-media-library`), böylece kullanıcı Instagram'da çoklu seçimle carousel gönderisi oluşturur. Kanonik kare sırası: **Hook → Ders → Alıntı → Sorgula** (hook scroll'u durdurur, değer hemen ardından gelir, soru en sonda etkileşim tetikler). Kendi yükleniyor durumu vardır (paylaş butonundan bağımsız); caption otomatik panoya kopyalanır. iOS'ta yalnızca yazma izni (`NSPhotoLibraryAddUsageDescription`) istenir.
  - **Erişim:** Premium kullanıcılar serbest; ücretsiz kullanıcılar ödüllü reklam izleyerek veya Premium'a geçerek açar (oturum içinde bir kez)
- **Text-to-Speech** — Hikayeyi sesli dinleme
- **Ses kaydı** — Kullanıcı kendi sesini kaydedebilir (maks. 3 dk), kaydı yeniden dinleyebilir
- **Dil değiştirme** — Hikayeyi farklı dilde okuma
- **"Sohbette Kullan"** butonu → UseInConversationScreen'e geçiş
- **Reklam / Premium kapısı** — Ücretsiz hikaye limitine ulaşınca reklam izleme veya premium yönlendirmesi
- Hikaye tamamlandığında otomatik işaretleme ve rozet kontrolü

---

## 5. UseInConversationScreen — Sohbette Kullan

Hikayelerin sosyal ortamlarda kullanılmak üzere kısa versiyonlarına erişim ekranı.

**Micro-Variant Tipleri:**

| Tip | Açıklama |
|-----|----------|
| **Punchline** | En çarpıcı tek cümle çıkarım |
| **30 Saniye** | Hikayenin 30 saniyelik özeti |
| **Soru** | Düşündürücü soru formatı |
| **Anahtar Kontrast** | Hikayenin kilit karşıtlığı |

**Özellikler:**
- Her variant için tek tıkla kopyalama
- Platform bazlı paylaşım mesajı (hashtag, hook metni)
- **Storyteller Modu** (Premium) — Hikayeleri anlatmak için interaktif pratik modu
- **Instagram görsel kartı** (Premium) — Paylaşıma hazır görsel oluşturma
- Tüm variant'lar ücretsiz; Storyteller Modu ve görsel kart premium gerektirir
- Reklam izleme ile premium özellik kilidi açma seçeneği

---

## 6. LibraryScreen — Kütüphane

Kullanıcının kişisel hikaye koleksiyonunu görüntülediği ekran. (Alt sekme: 📚 Kütüphane)

**Koleksiyonlar:**

| Koleksiyon | İçerik |
|------------|--------|
| **Okunanlar** | Geçmişte okunan hikayeler |
| **Favoriler** | Yıldızlanan hikayeler |
| **Kullanılanlar** | "Sohbette kullan" ile kullanılan hikayeler (Premium) |

**Özellikler:**
- Koleksiyonlar arası sekme geçişi
- **Kategori filtresi** — Koleksiyonu kategoriye göre daraltma
- **Sıralama:** Son okunan / En çok okunan
- Sıralama modal diyaloğu
- Boş durum gösterimi

---

## 7. SearchScreen — Arama

Hikayeler arasında metin araması yapılan ekran. (Stack üzerinden açılır, Home'dan erişilir)

**Özellikler:**
- Gerçek zamanlı arama (180ms debounce)
- Yerel veritabanında tam metin araması
- **Son aramalar** — Kalıcı olarak saklanır (maks. 8 adet)
- **Popüler kategoriler** — Arama yapılmadan gösterilen kategori kısayolları
- **Öneri etiketleri** — 4 adet hazır arama önerisi
- Son aramalarda tek tek silme veya tümünü temizleme

---

## 8. ProgressScreen — İlerleme

Kullanıcının okuma istatistiklerini ve başarımlarını gösteren ekran. (Alt sekme: 📈 İlerleme)

**Bölümler:**

### Günlük Hedef
- Bugün kaç hikaye okunduğu
- Günlük hedefe ilerleme
- Hedefe ulaşıldığında kutlama gösterimi

### Streak (Seri)
- Güncel okuma serisi (gün sayısı)
- En uzun streak rekoru
- Streak risk uyarısı (bugün hiç okuma yoksa)
- **Streak Freeze** (Premium) — Bir günü dondurup seriyi koruma hakkı
- Isı haritası (okuma geçmişi takvimi)

### Rozet Sistemi (25+ rozet)

| Kategori | Rozetler |
|----------|---------|
| **Okuma** | first_read, bookworm, philosopher |
| **Streak** | streak_7 |
| **Keşif** | explorer, sage, cat_variety_3/5/10 |
| **Kategori Ustası** | cat_master_5/10/25/50/100 |
| **Kaydetme** | save_5/10/50/100 |
| **Paylaşım** | share_1/10/20/30/50 |
| **Özel** | storyteller, icebreaker |

- Kazanılan rozetler renkli gradient ikonlarla gösterilir
- Kilitli rozetler gri ve asma kilit ikonuyla gösterilir
- Rozet kazanıldığında konfetti animasyonu + ses efekti + haptic feedback içeren kutlama modalı
- **Rozet paylaş (`BadgeShareSheet`):** Rozeti paylaşıma hazır karta dönüştürür. Renk seçenekleri (Gold `#C89B3C` / Slate `#3F5A73` / Teal `#2C8068` / Plum `#6E3B52`) "Kart Oluştur" temalarıyla aynı paleti paylaşır; tek vurgu rengi + yumuşak tonlu zemin mantığıyla çalışır. Format: Post / Story.

### İstatistikler
- Toplam okunan hikaye sayısı
- Kategori bazlı okuma dağılımı
- Paylaşım sayısı
- Sonraki milestone için kalan hikaye sayısı

---

## 9. ProfileScreen — Profil & Ayarlar

Kullanıcı ayarlarının yönetildiği ekran. (Alt sekme: 👤 Profil)

**Bölümler:**

### Profil Kartı
- Avatar (ad baş harfleri)
- Ad ve e-posta gösterimi
- Profil düzenleme (ad, e-posta güncelleme)
- Misafir kullanıcı için giriş teşviki

### Okuma Planı
- Günlük süre seçimi (3/6/9 dk)
- Hatırlatma zamanı seçimi (Sabah/Öğle/Akşam, çoklu)

### Görünüm & Dil
- Tema: Açık / Koyu mod
- Dil: Türkçe / İngilizce / İspanyolca / Almanca
- İlgi alanı kategorileri yönetimi

### Son Hikayeler
- Son 3 okunan hikayenin özeti

### İstatistikler
- Streak, toplam okuma sayısı, en uzun streak

### Rozetler
- Kazanılan en son rozet gösterimi

### Hesap İşlemleri
- Gizlilik politikası bağlantısı
- Test bildirimi gönderme
- **Çıkış yap** (profil bilgilerini temizler)
- **Tüm verileri sıfırla** (tehlikeli işlem, onay ister)

---

## 10. PaywallScreen — Premium Abonelik

Premium satın alma ekranı. Farklı bağlamlara göre değişen içerikle gelir. (Modal)

**Tetiklendiği Durumlar:**

| Kaynak | Mesaj Odağı |
|--------|-------------|
| Ücretsiz hikaye limiti | Daha fazla hikaye okuma |
| Erken deneme | Özel deneme teklifi |
| Storyteller Modu | Anlatıcı özellikleri |
| Görsel kart (image_card) | Paylaşılabilir kart oluşturma |
| Streak Freeze | Seriyi koruma |
| Kilitli hikaye | İçeriğe erişim |
| Profil | Genel premium değer önerisi |

**Özellikler:**
- Bağlama özel başlık, alt başlık ve değer listesi
- Plan seçimi (aylık / yıllık)
- Gizlilik politikası ve kullanım koşulları bağlantısı

---

## Desteklenen Diller

- 🇹🇷 Türkçe
- 🇬🇧 İngilizce
- 🇪🇸 İspanyolca
- 🇩🇪 Almanca

---

## Teknik Altyapı

| Bileşen | Teknoloji |
|---------|-----------|
| Framework | React Native + Expo |
| Navigasyon | React Navigation (Stack + Bottom Tab) |
| Veritabanı | Yerel SQLite (`expo-sqlite`) |
| Tema | Context API (açık/koyu mod, dinamik renkler) |
| Bildirimler | `expo-notifications` |
| TTS | `expo-speech` |
| Ses Kaydı | `expo-av` |
| Görsel Yakalama | `react-native-view-shot` (kartı PNG'ye çevirir) |
| Galeriye Kaydetme | `expo-media-library` (carousel kareleri) |
| Analizler | Özel `trackEvent` utility |
| Reklamlar | Rewarded ad sistemi (`ads.js`) |
| Yazı Tipleri | Inter + Playfair Display |

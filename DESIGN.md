# Albor Tasarım Sistemi (Ana Sayfa Referansı)

Bu belge, yeniden tasarlanan **ana sayfanın** UI, UX ve renk kararlarını toplar. Diğer ekranları (Kütüphane, İlerleme, Profil, Hikâye Detay, Paywall, Onboarding) aynı dile getirirken tek referans olarak kullanılır.

Kaynak kod: `src/theme/theme.js` (renk tokenları), `src/screens/HomeScreen.js`, `src/components/CategoryPill.js`, `src/utils/categoryImages.js`.
Eski palet belgeleri (Digital Hearth, Nocturnal Bibliophile, kategori gradyanları) artık geçerli değil: `arsiv/tasarim-eski/`.

---

## 1. Marka kimliği

| | |
|---|---|
| Ad | Albor (şafak) |
| Duygu | Sakin, güvenilir, günün başında küçük bir ışık. Kalabalık değil, editoryal |
| Ana renk | **Derin petrol** `#1F5F5B` |
| Işık rengi | **Şafak altını** `#E9A94B` (koyu tema `#F0C170`) |
| Zemin | **Kâğıt** `#F7F3EC`, mürekkep `#24211E` |
| Yazı tipleri | Başlık: **Playfair Display**. Gövde ve arayüz: **Inter** |
| İmza motifi | Petrol kart üzerinde altın güneş (`HeroSun`) |

**Altın kuralı:** Altın yalnızca *ışık, ritüel ve ödül* içindir: hero kartın güneşi, birincil CTA, seri (alev), rozet, hedef tamamlandı. Kategori ikonlarında, kenarlıklarda ya da genel vurguda kullanılmaz.

**Yasaklar:** mercan/turuncu vurgu, soğuk gri, mor-mavi "tech" gradyanları, kategoriye göre boyanan ana kartlar.

---

## 2. Renk tokenları

Tokenlar `NEUTRALS` (kâğıt, mürekkep, yüzeyler) ve `ACCENTS` (petrol, lacivert, koyu sarı) olarak ayrılır. Varsayılan ve marka her zaman **petrol**. Bileşenlerde sabit hex yerine `useTheme().colors` kullanılır.

### 2.1 Nötrler

| Rol | Token | Açık | Koyu |
|---|---|---|---|
| Sayfa zemini | `background` | `#F7F3EC` | `#141413` |
| Kart | `cardBackground` | `#FFFDF9` | `#201F1D` |
| En açık yüzey | `surfaceContainerLowest` | `#FFFFFF` | `#1C1B1A` |
| Yüksek yüzey | `surfaceContainerHigh` | `#E4DDD2` | `#2A2927` |
| Yazı | `text` | `#24211E` | `#F2EEE8` |
| İkincil yazı | `textSecondary` | `#6B625A` | `#A8A29A` |
| Soluk yazı | `mutedText` | `#8C837A` | `#7E7870` |
| Kenarlık / ayraç | `border`, `divider` | `#E6DED3` | `#2F2E2B`, `#3A3936` |
| Hata | `danger` | `#B3261E` | `#F06A4A` |
| Başarı | `success` | `#3A5F3C` | `#6FBF73` |
| Tab bar | `tabBarBackground` | `#FBF8F2` | `rgba(20,20,19,0.94)` |

### 2.2 Marka ve ışık

| Rol | Token | Açık | Koyu |
|---|---|---|---|
| Hero kart zemini | `heroSurface` | `#1B4B48` | `#1F3A37` |
| Hero kenarı | `heroBorder` | `#1B4B48` | `#2E5A55` |
| Şafak altını | `dawn` | `#E9A94B` | `#F0C170` |
| Altın yazı | `dawnText` | `#8A5A0E` (5,3:1) | `#F0C170` |
| Ödül | `reward`, `rewardText` | `#C89B3C`, `#8A6418` | `#E5C27A` |

### 2.3 Petrol vurgusu (varsayılan)

| Rol | Açık | Koyu |
|---|---|---|
| `primary` (dolu yüzey, seçili pill) | `#1F5F5B` | `#7CC0B6` |
| `onPrimary` | `#FFFFFF` | `#1A1A1A` |
| `primaryText` | `#1F5F5B` | `#7CC0B6` |
| `primaryContainer` | `#E2EDEA` | `#1F3634` |

Lacivert (`#1F3A5C`) ve koyu sarı (`#D4952A`) kullanıcıya sonradan sunulabilecek seçenekler. Marka (mağaza varlıkları, paylaşım kartı, bildirim) her zaman petrol.

### 2.4 Kontrast kuralı
Metin ≥ 4,5:1, ikon ve grafik ≥ 3:1. Hero üzerindeki beyaz yazı 9,5:1. Yeni bir renk eklerken önce kontrastı hesapla, sonra token olarak `theme.js`'e ekle.

---

## 3. Tipografi

| Kullanım | Yazı tipi | Not |
|---|---|---|
| Ekran/hero/bölüm başlığı, hikâye başlığı | `PlayfairDisplay_700Bold` / `_600SemiBold` | Bölüm başlığı 22 pt (hero'da kart genişliğine göre küçülür) |
| Gövde, butonlar, etiketler | `Inter_400Regular`, `Inter_500Medium`, `Inter_600SemiBold` | Buton 15–17 pt, etiket 12–14 pt |
| Eyebrow ("SONRAKİ ADIM") | `Inter_600SemiBold`, büyük harf, geniş harf aralığı | Hero üzerinde `dawn` renginde |

Başlıklarda `adjustsFontSizeToFit` yalnızca hero'da kullanılır.

---

## 4. Ana sayfa yapısı (yukarıdan aşağıya)

1. **Üst alan:** tarih (küçük, ikincil) + selamlama (Playfair) solda. Sağda seri hapı (alev + sayı) ve Albor Yolu girişi.
2. **Arama:** tek satır alan, "Hikâye veya kategori ara…".
3. **Birincil kart** (ekranın tek baskın nesnesi):
   - Yarım kalan hikâye varsa **"Kaldığın yerden"** kartı: başlık, kalan süre, kategori rozeti ve adı, yazar, `Devam et` ve `Dinle` butonları.
   - Yoksa **"Sonraki adım"** petrol hero kartı (Albor Yolu / günün hikâyesi), altın güneş, altın CTA.
   - Her ikisi de petrol yüzeyde. **Kategori filtresinden etkilenmez.**
4. **Günlük şerit:** "Bugün 1/3 hikâye" + üç segmentli ilerleme + seri satırı + "Albor Yolu" bağlantısı.
5. **"Senin için seçtiklerimiz":** yatay kaydırmalı kartlar (genişlik 216), ilk kart sola hizalı, kilitli kartlar sona yerleşir.
6. **Kategori pill'leri:** görsel + ad yan yana, yatay kaydırma. Filtre, altındaki akışı ve seçtiklerimizi değiştirir; birincil kartı değiştirmez.
7. **"Daha Fazla Hikâye":** dikey liste, kategori görselli satır kartı.

**UX ilkeleri**
- Ekranda **tek** birincil eylem vardır: petrol hero kartın CTA'sı.
- Kullanıcının kaldığı yer her zaman en üstte. Filtre onu kapatmaz.
- Filtre, filtrelediği içeriğin hemen üstünde durur.
- Tüm dokunma hedefleri ≥ 44 pt.
- Kilitli içerik görsel olarak soluk, ama okunur ve nedeni (kota/Premium) açık.
- Kota dolunca engel değil seçenek: "Reklam izle" ya da "Premium".

---

## 5. Bileşen kalıpları

| Bileşen | Kural |
|---|---|
| **Hero / resume kartı** | `heroSurface` zemin, köşe `layout.radius.card`, iç boşluk 20, yatay kenar `layout.padding.horizontal`, altın güneş sağ üstte (içeriği örtmez), yazı `#F5F1E8` |
| **Birincil buton (hero üstü)** | `dawn` dolgu, koyu kahve yazı `#2A1E08` |
| **İkincil buton (hero üstü)** | Yarı saydam açık dolgu ya da çerçeveli, aynı yükseklik |
| **Kart (açık yüzey)** | `cardBackground`, 1 px `border`, köşe 16–18, hafif gölge |
| **Kategori pill (`inline`)** | Yükseklik ≥ 44, köşe 22, solda 28×28 nötr karoda ikon, sağda ad. Seçili: `primary` dolgu + `onPrimary` yazı. Karo nötr (açık: `rgba(36,33,30,.05)`, koyu: `rgba(255,255,255,.06)`), kategori renginde boyanmaz |
| **İlerleme çubuğu** | Segment, `primaryContainer` iz + `primary` dolgu |
| **Seri hapı** | Alev `reward` renginde, sayı `rewardText` |
| **Kategori rozeti (kartta)** | Kategori adı yazısı kategori ailesinin rengi, çerçevesi nötr |

---

## 6. Kategori ikon ve görsel sistemi

Her kategori için aynı çizimden iki çıktı vardır: **küçük ikon** (pill) ve **kart görseli** (liste/öne çıkan kartlar). Açık ve koyu temada ayrı dosya.

### 6.1 Aileler ve kategoriler

| Aile | Açık | Koyu | Kategoriler (simge) |
|---|---|---|---|
| Yeşil | `#2F7D5B` | `#6FCB9F` | Finans (para kesesi), Gelişim (filiz) |
| Çivit | `#5B5FB5` | `#A5A9F0` | Psikoloji (ampullü profil), Felsefe (baykuş) |
| Mor | `#8650A8` | `#CFA0E8` | Bilim (deney şişesi) |
| Mavi | `#1F7FA8` | `#7CC3E3` | İletişim (iki konuşma balonu) |
| Toprak | `#A5623A` | `#E0A27C` | Tarih (amfora), Liderlik (dağ ve bayrak) |
| Gül | `#C0507A` | `#F29AB8` | Sağlık (artılı elma) |
| Arduvaz | `#4C5B7A` | `#A9B7D6` | İş (evrak çantası), Üretkenlik (kum saati) |
| Petrol | `#1F5F5B` | `#7CC0B6` | Tümü (dört kare) |

### 6.2 Çizim kuralları
- Yalnızca dolgulu şekil; çizgi ikon yok. Ana ton + ikinci ton + iç detay (açık).
- Her glifin dolu alanı eşit (kanvasın ~%32,6'sı). Boyutu elle değil `generate.py` ayarlar.
- Altın yok. Kırmızı ve amber yok (hata ve ödül renkleriyle karışmasın).
- Komşu kategoriler farklı ailede; aynı aileyi paylaşanların silüeti belirgin farklı.
- Anlam çakışması yok: tik işareti (tamamlandı), kalp (favori), kalkan (güvenlik) kullanılmaz.
- 20 px'te okunur olmalı. Önce 20 px'te kontrol et.

### 6.3 Dosyalar ve üretim
- Küçük ikon: `assets/categories/pill_icons/<Ad>.png` ve `<Ad>-dark.png` (360 px, şeffaf).
- Kart görseli: `assets/categories/<Ad>.png` ve `<Ad>-dark.png` (1024 px, düz aile tonu zemin + glif).
- Kaynak ve üretici: `design/icons-src/generate.py` (ikonlar), `design/icons-src/generate_cards.py` (kart görselleri). Yeni sürüm üretmeden önce çalıştır, çıktıyı ilgili `assets/` klasörüne kopyala.
- `getCategoryImage` artık döndürme, aynalama ve renk katmanı uygulamaz.

---

## 7. Diğer ekranlara uygulama kontrol listesi

- [ ] Zemin `background`, kartlar `cardBackground`. Saf beyaz ve saf siyah yok.
- [ ] Başlıklar Playfair, geri kalan her şey Inter.
- [ ] Ekranda tek birincil eylem; altın yalnızca ışık/ödül.
- [ ] Sabit hex yok; `useTheme().colors` token'ları.
- [ ] Kategori renkleri yalnızca ikon/görselde ve küçük etiketlerde. Büyük yüzeyleri kategori boyamaz.
- [ ] Açık ve koyu temada ayrı bak. Kontrast ≥ 4,5:1.
- [ ] Dokunma hedefi ≥ 44 pt, boş durum ve kilitli durum tasarlandı.
- [ ] Yeni metin `src/locales/i18n.js` içinde 4 dilde (tr, en, es, de), `t(...)` ile.
- [ ] Analitik olayları `docs/ANALYTICS_EVENTS.md` ile tutarlı.

---

## 8. Bilinen açık konular

- **Kategori tema paleti:** `getCategoryTheme` artık §6.1 ailelerini kullanır (ikonla aynı ton). Banner görselleri hâlâ eski stilde (aşağıda).
- **Banner görselleri eski stilde:** `assets/banner/*` yeni ikon diliyle uyumlu değil.
- **Koyu tema ekran doğrulaması yok:** yeni ikonlar ve kart görselleri koyu temada uygulama içinde test edilmedi.
- **İspanyolca ve Almanca çeviri:** "Albor Yolu" karşılıkları ("Camino Albor", "Albor-Weg") doğrulanmadı.
- **Kaldığın yerden kartı:** kayıtlı okuma konumuna kaydırma yok.

---

## 9. Referans prototipler

- `design/home-top-albor.html`: onaylı ana sayfa üst tasarımı (iPhone 17 Pro, 402×874).
- `design/home-deniz.html`: bölümlenmiş uzun sayfa denemesi.
- Eski denemeler ve ikon iterasyonları: `arsiv/tasarim-eski/design-prototipleri/`.

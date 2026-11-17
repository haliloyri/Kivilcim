# App Store ekran görüntüleri ve önizleme videosu — tasarım

_17 Kasım 2026 · Durum: onay bekliyor_

## Amaç

`APP_STORE_CHECKLIST.md` içindeki "Gerçek ekran görüntüsü seti — EKSİK" maddesini kapatmak ve mağaza sayfasına bir önizleme videosu (App Preview) eklemek. Hedef: aramada ilk üç karede Albor'un ne işe yaradığı okunmalı; sayfa markanın sakin, editoryal diliyle (petrol, şafak altını, kâğıt, Playfair) uyumlu olmalı.

## Bugünkü durum

- `docs/website-screenshots/` içindeki 9 PNG gerçek ekran ama **eski tasarım** (açık yeşil hero, "Yolum" sekmesi, geliştirici paneli görünüyor). Kullanılamaz, yeniden çekilecek.
- `scripts/generate-screenshots.mjs` gerçek ekran yakalamıyor, SVG çiziyor. Kullanılmayacak.
- Uygulama yalnızca iPhone (`supportsTablet: false`). iPad seti gerekmiyor.
- Mağaza metni 4 dilde hazır: `ASO_STORE_LISTING.md` (tr/en/es/de).
- Simülatörde iPhone 17 Pro Max var: doğrudan 1320×2868 verir.
- Albi görselleri 512×512 (`assets/albi/`): büyük kullanımda bulanıklaşır.

## Hedefler

1. Panoramik bağlı 6 karelik ekran görüntüsü seti, 4 dilde.
2. 15–30 sn'lik tek önizleme videosu, önce TR, sonra EN.
3. Yeniden üretilebilir hat: ekran değişince aynı komutlarla set yenilenir.

## Kapsam dışı

- iPad, Google Play görselleri, Instagram/web tanıtım videosu.
- iPhone Duo seti (Apple'a göre Nisan 2027'de, iOS 27.1 SDK ile zorunlu olacak).
- Uygulama içi tasarım değişikliği.

## Olmaması gerekenler

- Uygulamada olmayan bir özelliği ima eden kare ya da geçiş.
- Karede reklam, kilitli içerik uyarısı, geliştirici kontrolü, gerçek kullanıcı adı.
- Kare sınırında bölünen başlık metni.
- Altının dekor olarak kullanılması (`DESIGN.md`: altın yalnızca ışık, ritüel, ödül).

## Kısıtlar (Apple)

Aşağıdaki sayılar 17 Kasım 2026'da Apple sayfalarından özetlenerek alındı; yüklemeden önce App Store Connect'te bir kez daha doğrulanmalı.

| | Ekran görüntüsü | Önizleme videosu |
|---|---|---|
| Ölçü (dikey) | 6.9": 1320×2868 · orta Dynamic Island: 1206×2622 | 886×1920 |
| Adet | cihaz boyutu başına 1–10 | cihaz boyutu ve dil başına en çok 3 |
| Biçim | PNG/JPEG, alfa kanalı yok | H.264 (.mov/.mp4), en çok 30 fps, en çok 500 MB |
| Süre | — | 15–30 sn |
| Ses | — | stereo ses izi gerekli (AAC 256 kbps, 44.1/48 kHz) |

Video içerik kuralları: yalnızca uygulamanın kendi ekran kaydı; el, cihaz, insan çekimi yok; metin katmanı ve basit geçiş serbest; mağazada sessiz oynar, bu yüzden mesaj ekrandaki yazıyla verilir; abonelik gerekiyorsa videoda ya da son karede belirtilir; fiyat ve tarih gösterilmez.

Hangi cihaz boyutunun zorunlu olduğu konusunda iki kaynak çelişiyor (checklist: 6.9" ya da 6.5"; Apple özeti: orta Dynamic Island'dan en az bir kare). Bu yüzden iki ölçü de üretilir. Oranları neredeyse aynı (0,4603 ve 0,4600), aynı şerit yeniden boyutlanarak çıkar.

## Yaklaşımlar

**Görsel tarz** (kullanıcı seçti): panoramik bağlı set. Ham ekran görüntüsü ve tek tek başlıklı kompozit seçenekleri elendi.

**Üretim yolu:**

| Yol | Artı | Eksi |
|---|---|---|
| HTML/CSS şerit şablonu, başsız tarayıcıyla PNG, sonra dilimleme | 4 dilde aynı şablon; repo zaten `design/*.html` ve Node betikleri kullanıyor; fontlar aynı | Şablonu kurmak ilk seferde emek |
| Figma'da elle | Görsel kontrol kolay | 4 dil × 6 kare elle; ekran değişince baştan |
| fastlane snapshot + frameit | Çekim otomatik | Panoramik yerleşimi desteklemiyor; RN projesinde UI testi kurulumu ağır |

Seçim: **HTML/CSS şablonu** (benim kararım; kullanıcı üretim yolunu bana bıraktı).

## Ekran görüntüsü seti

### Şerit

- Tek tuval: 7920×2868 (6 × 1320). Dilimlenince 6 kare.
- Zemin: kâğıt `#F7F3EC`. Kare 1 ve kare 6 petrol `#1B4B48` zeminli (açılış ve kapanış).
- Bağlayıcı öğeler: şafak güneşi kare 1'in sağ üstünden kare 2'ye taşar; ince altın yol çizgisi tüm şerit boyunca cihazların arkasından akar ve kare 5'teki Okuma Yolu ekranına bağlanır.
- Cihazlar: 2|3 ve 4|5 sınırlarında birer cihaz iki kareye taşar. Diğerleri kare içinde.
- **Kural:** başlık metni hiçbir zaman sınırı geçmez; yalnızca cihaz ve dekor geçer. Her kare tek başına da okunur olmalı (aramada yalnızca ilk üçü görünür).
- Başlık: Playfair Display Bold, en çok 2 satır. Alt satır: Inter, en çok 1 satır.

### Kareler

| # | Ekran | TR başlık (öneri) | Not |
|---|---|---|---|
| 1 | Keşfet (ana sayfa) | Kitapların özü, günde 3 dakika | Petrol zemin, güneş. Değer önerisi. |
| 2 | Hikâye okuma | Her hikâye tek bir fikir | Başlık + vurgu cümlesi görünen kaydırma konumu |
| 3 | Dinle (ses açık) | Yürürken dinle | Oynatıcı görünür |
| 4 | Sohbette Kullan | Fikri sohbete taşı | "Tek cümle" sekmesi, güçlü bir punchline |
| 5 | Okuma Yolu | Okudukça büyüyen yolun | Unvan kartı; altın çizgi burada biter |
| 6 | Kütüphane + Albi (selamlama) | Kendi ritminde, 4 dilde | Petrol zemin, kapanış |

Başlıklar benim önerim. EN/ES/DE karşılıkları `ASO_STORE_LISTING.md` diliyle uyumlu yazılır ve uzunluk kontrolünden geçer (Almanca en uzun; taşarsa punto değil metin kısaltılır).

Albi yalnızca kare 6'da, en çok ~400 px genişlikte (benim kararım; kaynak 512 px). Daha büyük kullanılacaksa yüksek çözünürlüklü kaynak gerekir.

### Çekim

- Cihaz: iPhone 17 Pro Max simülatörü, açık tema.
- Debug derlemesi, `EXPO_PUBLIC_STORE_SHOTS=1` bayrağıyla: geliştirici göz ikonu ve "Yolu önizle" paneli gizlenir. (Release'de Premium anahtarı olmadığı için Debug seçildi.)
- Durum çubuğu: `xcrun simctl status_bar booted override --time 9:41 --batteryState charged --batteryLevel 100 --cellularBars 4 --wifiBars 3`.
- Hazır durum: Premium açık (reklam ve kilit görünmesin), seri gerçek kullanım değeriyle, bugün 2/3 hikâye, kütüphanede 6+ okunan hikâye, ad boş ya da nötr.
- Hikâye seçimi: 4 dilde özgün metni olan, başlığı güçlü 1 ana hikâye + listelerde görünecek 5–6 hikâye. Başka yapay zekâya ayrılmış id'ler (1300-1302, 1438-1440, 1480-1482, 1651) kullanılmaz.
- Her dil için uygulama dili değiştirilip aynı 6 ekran aynı sırayla çekilir. Ham çekimler `docs/app-store/raw/<dil>/`.

### Çıktı

`docs/app-store/screenshots/<dil>/6.9/01..06.png` (1320×2868) ve `.../6.3/01..06.png` (1206×2622). PNG, alfa yok.

Sıra: TR → EN → ES → DE. Ana dil varsayımı TR (kullanıcı doğrulamalı; ASC'de eksik dil ana dilin görsellerine düşer).

## Önizleme videosu

Tek video, ~27 sn, 886×1920, 30 fps, H.264. Kayıt: `xcrun simctl io booted recordVideo --codec h264`, iPhone 17 Pro Max'te; sonra ffmpeg ile 886×1920'ye ölçekleme (oran farkı ~%0,3, kenardan kırpılır). Ekran görüntüleriyle aynı derleme ve hazır durum.

| Sn | Ekranda | Üst yazı (TR) |
|---|---|---|
| 0–3 | Keşfet; hero kart ve günlük şerit | Kitapların özü, günde 3 dakika |
| 3–9 | Hikâyeye dokun, aç, yavaş kaydır | Her hikâye tek bir fikir |
| 9–13 | "Dinle"ye bas, oynatıcı çalışır | Yürürken dinle |
| 13–19 | Sohbette Kullan: Tek cümle → 30 sn → Kopyala | Fikri sohbete taşı |
| 19–24 | Okuma Yolu sekmesi, unvan kartı | Okudukça büyüyen yolun |
| 24–27 | Bitiş kartı: logo, "Albor", "Bazı içerikler Premium abonelik gerektirir" | — |

- Dokunma noktaları küçük yarı saydam daireyle gösterilir (Apple izin veriyor).
- Geçişler: yalnızca kesme ve kısa çözülme.
- Poster karesi: 0–3 sn aralığından, başlık okunurken.
- Ses: zorunlu stereo iz için sakin, hakları bizde olan bir müzik (benim kararım: yeni üretilecek ya da lisansı net bir parça; kaynağı kullanıcı onaylar). Mağazada sessiz oynadığı için mesaj müziğe bağlı değil.
- Kurgu: ffmpeg ile yeterli; yazı katmanları için aynı HTML şablon fontları PNG olarak basılıp bindirilir.
- Çıktı: `docs/app-store/preview/<dil>/albor-preview.mp4`. Önce TR, sonra EN. ES/DE ilk sürümde yok.

Video gönderimi engellemez: ekran görüntüleri önce biter, video ardından eklenir.

## Doğrulama

- Her PNG: `sips` ile ölçü doğru, `hasAlpha: no`.
- 6 kare yan yana dizildiğinde sınırlar kesintisiz; ilk 3 kare küçük önizlemede (≈ %20 ölçek) tek başına okunuyor.
- 4 dilde başlık taşması yok.
- Video: `ffprobe` ile 886×1920, ≤ 30 fps, 15–30 sn, stereo ses izi, < 500 MB.
- ASC'ye yükleme denemesi hatasız (kullanıcı yapar).

## Kullanıcıya kalan kararlar

1. ASC ana dili TR mi, EN mi?
2. Kare başlıkları (yukarıdaki TR öneriler).
3. Albi kare 6'da kalsın mı?
4. Video müziğinin kaynağı.

## Uygulayana bırakılanlar

Şablonun CSS ayrıntıları, cihaz çerçevesi çizimi (düz, markasız çerçeve), altın çizginin tam eğrisi, hazır durumu kuran yöntem (geliştirici menüsü mü, DB tohumlama mı), dilimleme aracı (`sips` ya da `sharp`).

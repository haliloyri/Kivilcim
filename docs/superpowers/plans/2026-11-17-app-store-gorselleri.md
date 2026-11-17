# App Store Görselleri Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** App Store için 4 dilde panoramik 6 karelik ekran görüntüsü seti ve TR/EN önizleme videosu üretmek.

**Architecture:** Simülatörden alınan ham ekranlar bir HTML/CSS şerit şablonuna (7920×2868) yerleşir. Başsız Chrome şeridi PNG'ye basar, ffmpeg 6 kareye dilimler ve ikinci ölçüye küçültür. Video, aynı simülatörde `simctl recordVideo` ile kaydedilir; ffmpeg ölçekler, üst yazıları ve bitiş kartını bindirir.

**Tech Stack:** Node (ESM betikleri, repo kalıbı `scripts/*.mjs`), Google Chrome başsız mod (`/Applications/Google Chrome.app`), ffmpeg/ffprobe (`/opt/homebrew/bin`), `xcrun simctl`, Jest (`jest-expo`), fontlar `node_modules/@expo-google-fonts/{playfair-display,inter}`.

**Spec:** `docs/superpowers/specs/2026-11-17-app-store-gorselleri-design.md`

## Global Constraints

- Ekran görüntüsü: 1320×2868 ve 1206×2622, PNG, alfa kanalı yok, kare başına tek dosya, set başına 6 kare.
- Şerit tuvali 7920×2868. Başlık metni kare sınırını (her 1320 px) geçmez; yalnızca cihaz ve dekor geçer.
- Renkler: kâğıt `#F7F3EC`, petrol `#1B4B48`, şafak altını `#E9A94B`, mürekkep `#24211E`, hero üstü yazı `#F5F1E8`. Altın yalnızca güneş ve yol çizgisinde.
- Başlık Playfair Display Bold, en çok 2 satır. Uzun gelen dilde punto küçültülmez, metin kısaltılır.
- Çekim: iPhone 17 Pro Max simülatörü, açık tema, durum çubuğu 9:41, Premium açık, karede reklam/kilit/geliştirici kontrolü/gerçek ad yok.
- Kullanılmayacak hikâye id'leri: 1300-1302, 1438-1440, 1480-1482, 1651.
- Video: 886×1920, H.264, 30 fps, 15–30 sn, stereo AAC ses izi, < 500 MB; yalnızca uygulama içi kayıt; fiyat ve tarih görünmez; bitiş kartında Premium notu.
- Dil sırası: TR → EN → ES → DE. Video yalnızca TR ve EN.
- Uygulama davranışı değişmez. Tek kod değişikliği: geliştirici kontrolünü gizleyen bayrak (Task 1).
- Kullanıcı istemedikçe commit atılmaz; adımlarda commit yok.

## Review Focus

- Almanca/İspanyolca başlık 2 satırı aşar ya da komşu kareye taşar → şerit yine de üretilmemeli, betik hata vermeli. Test: Task 2 (`validateCaptions`) ve Task 3 (taşma denetimi).
- Ham çekim eksik ya da yanlış ölçüde (ör. iPhone 17 Pro'dan 1206×2622) → betik hangi dosyanın yanlış olduğunu söyleyip durmalı. Test: Task 3.
- Chrome ekran görüntüsü RGBA çıkar → ASC alfa kanalını reddeder. Test: Task 3 doğrulama adımı (`hasAlpha: no`).
- İlk 3 kare küçük önizlemede okunmaz → Task 4'teki %20 ölçekli göz kontrolü.
- Kayıtta tarih ("16 Kasım Pazartesi") ya da fiyat görünür → Task 5 kayıt kontrol listesi.

---

### Task 1: Geliştirici kontrolünü gizleyen bayrak

Debug derlemesinde Okuma Yolu başlığındaki göz ikonu ve "Yolu önizle" paneli görünür. Çekimde gizlenmeli.

**Files:**
- Modify: `src/components/career/CareerPathExperience.js:71,442,451`
- Test: `src/components/career/__tests__/CareerPathExperience.smoke.test.js`

**Interfaces:**
- Produces: ortam değişkeni `EXPO_PUBLIC_STORE_SHOTS=1`. Açıkken üç `__DEV__` dalı da kapalı davranır.

- [ ] **Step 1: Failing test.** Mevcut smoke testine ekle: `process.env.EXPO_PUBLIC_STORE_SHOTS = '1'` iken render sonucunda `accessibilityLabel` değeri `t('career.preview.toggle', lang)` olan düğme **bulunmaz**; değişken yokken bulunur.
- [ ] **Step 2:** `npx jest src/components/career/__tests__/CareerPathExperience.smoke.test.js` → yeni test FAIL.
- [ ] **Step 3:** Dosyanın başına `const SHOW_CAREER_PREVIEW = __DEV__ && process.env.EXPO_PUBLIC_STORE_SHOTS !== '1';` ekle; 71, 442, 451. satırlardaki `__DEV__` yerine bunu kullan. Başka satıra dokunma.
- [ ] **Step 4:** Aynı komut → PASS. Ardından `npm run test:career` → tümü PASS.

### Task 2: Başlık metinleri ve denetimi

**Files:**
- Create: `scripts/store-shots/captions.json`
- Create: `scripts/store-shots/captions.mjs`
- Test: `scripts/store-shots/__tests__/captions.test.js`

**Interfaces:**
- Produces: `captions.json` biçimi `{ "<dil>": { "frames": [string × 6], "disclosure": string } }`, diller `tr,en,es,de`.
- Produces: `validateCaptions(captions) -> string[]` (hata listesi; boşsa geçerli). Kurallar: 4 dil var, her dilde tam 6 başlık, her başlık 1–42 karakter, `disclosure` boş değil.

`captions.json` içeriği (kullanıcı onayına kadar öneri):

| # | tr | en | es | de |
|---|---|---|---|---|
| 1 | Kitapların özü, günde 3 dakika | The best of books, 3 minutes a day | Lo mejor de los libros, 3 minutos al día | Das Beste aus Büchern, 3 Minuten am Tag |
| 2 | Her hikâye tek bir fikir | Every story, one idea | Cada historia, una idea | Jede Geschichte, eine Idee |
| 3 | Yürürken dinle | Listen on the go | Escucha donde sea | Unterwegs hören |
| 4 | Fikri sohbete taşı | Bring it into conversation | Llévalo a la conversación | Bring es ins Gespräch |
| 5 | Okudukça büyüyen yolun | A path that grows as you read | Un camino que crece contigo | Ein Weg, der mit dir wächst |
| 6 | Kendi ritminde, 4 dilde | At your pace, in 4 languages | A tu ritmo, en 4 idiomas | In deinem Tempo, in 4 Sprachen |

`disclosure`: tr `Bazı içerikler Premium abonelik gerektirir` · en `Some content requires a Premium subscription` · es `Parte del contenido requiere suscripción Premium` · de `Einige Inhalte erfordern ein Premium-Abo`.

- [ ] **Step 1: Failing tests.** `validateCaptions(gerçek dosya)` → `[]`; bir dili silince, bir dilde 5 başlık bırakınca, 43 karakterlik başlıkta ve boş `disclosure`'da hata listesi boş değil ve ilgili dil kodunu içeriyor.
- [ ] **Step 2:** `npx jest scripts/store-shots` → FAIL (modül yok). Jest `scripts/` altını toplamıyorsa `package.json` jest `testMatch`/`roots` ayarına bak; gerekiyorsa testi `src/utils/__tests__/storeShotCaptions.test.js` olarak taşı ve yolu buna göre düzelt.
- [ ] **Step 3:** `captions.json` ve `validateCaptions` yaz.
- [ ] **Step 4:** Aynı komut → PASS.

### Task 3: Şerit şablonu ve üretim betiği

**Files:**
- Create: `scripts/store-shots/strip.html` (tek dosya, CSS içinde)
- Create: `scripts/store-shots/build.mjs`
- Modify: `package.json` (script: `"store:shots": "node scripts/store-shots/build.mjs"`)
- Modify: `.gitignore` (`docs/app-store/build/`)

**Interfaces:**
- Consumes: `captions.json`, `validateCaptions` (Task 2); ham çekimler `docs/app-store/raw/<dil>/01.png … 06.png`, her biri 1320×2868.
- Produces: `npm run store:shots -- <dil>` → `docs/app-store/screenshots/<dil>/6.9/01..06.png` (1320×2868) ve `.../6.3/01..06.png` (1206×2622). Ara şerit: `docs/app-store/build/<dil>-strip.png`.

Şablon kararları:
- `strip.html`, `?lang=<dil>` sorgusunu okur; başlıkları ve ham görsel yollarını `build.mjs`'in yazdığı `docs/app-store/build/<dil>-data.js` dosyasından alır (`window.STRIP = { frames, shots }`).
- Gövde 7920×2868, `overflow: hidden`. 6 bölüm, her biri 1320 px. Kare 1 ve 6 zemin `#1B4B48` (başlık `#F5F1E8`), diğerleri `#F7F3EC` (başlık `#24211E`).
- Başlık kutusu: bölüm içinde, yatay iç boşluk 96 px, üstten 200 px, Playfair Display Bold 112 px, satır yüksekliği 1.1, `max-height` 2 satır.
- Cihaz: düz, markasız çerçeve (köşe 120 px, 16 px mürekkep kenar), ekran genişliği 960 px, üstü y=760. Kare 2 ve 4'ün cihazı sağa kaydırılır, sınırı 180 px aşar (2|3 ve 4|5); komşu karenin başlığı sola hizalı kalır ve cihazla çakışmaz.
- Güneş: kare 1 sağ üst, merkez x=1320 (sınırda), y=260, yarıçap 300, `#E9A94B`; kare 2'ye yarısı taşar.
- Yol çizgisi: tek SVG `<path>`, 7920 genişlik, `#E9A94B`, kalınlık 10, cihazların arkasında (`z-index` altında), kare 5 cihazının üst kenarında biter.
- Kare 6: cihazın sol altında `assets/albi/selamlama.png`, genişlik 400 px.
- Fontlar `@font-face` ile `node_modules/@expo-google-fonts/...` içindeki `.ttf` dosyalarından (dosya adlarını klasörde doğrula).

`build.mjs` akışı:
1. `validateCaptions` hata döndürürse yazdır, `process.exit(1)`.
2. 6 ham dosyanın varlığını ve ölçüsünü `ffprobe` ile denetle; eksik/yanlışsa dosya adını ve bulunan ölçüyü yazıp çık.
3. `<dil>-data.js` yaz; Chrome'u çalıştır: `--headless=new --hide-scrollbars --force-device-scale-factor=1 --window-size=7920,2868 --screenshot=<strip.png> file://…/strip.html?lang=<dil>`.
4. Taşma denetimi: Chrome'u ikinci kez `--dump-dom` ile çalıştır; şablon yükleme sonunda her başlık için `scrollHeight > clientHeight` ya da sağ kenarı bölüm sınırını aşıyorsa `<body data-overflow="kare no">` yazar. Öznitelik varsa çık.
5. Dilimle: kare `i` için `ffmpeg -y -i strip.png -vf "crop=1320:2868:${i*1320}:0" -pix_fmt rgb24 01..06.png`.
6. Küçült: `-vf scale=1206:2622 -pix_fmt rgb24` ile `6.3/`.

- [ ] **Step 1:** Geçici düz renkli 6 PNG üret (`ffmpeg -f lavfi -i color=c=gray:s=1320x2868 -frames:v 1`) ve `docs/app-store/raw/tr/` altına koy.
- [ ] **Step 2:** `strip.html` ve `build.mjs` yaz.
- [ ] **Step 3: Doğrula.** `npm run store:shots -- tr` → 12 dosya. `sips -g pixelWidth -g pixelHeight -g hasAlpha docs/app-store/screenshots/tr/6.9/*.png` → hepsi 1320×2868, `hasAlpha: no`; `6.3/` → 1206×2622.
- [ ] **Step 4: Hata yolları.** `raw/tr/03.png` silinince betik `03.png` adını yazıp çıkış kodu 1 veriyor. `STORE_SHOTS_FORCE_OVERFLOW=1 npm run store:shots -- tr` (betik bu değişkenle 1. başlığı üç kez tekrarlayarak şablona verir) → betik `data-overflow` hatasıyla, çıkış kodu 1 ile duruyor.
- [ ] **Step 5:** `strip.png`'yi aç, sınırların kesintisiz olduğunu ve hiçbir başlığın cihazla çakışmadığını gözle doğrula.

### Task 4: Gerçek çekim ve 4 dilde set

**Files:**
- Create: `scripts/store-shots/capture.sh`
- Create: `docs/app-store/README.md` (çekim adımları, hikâye id'leri, komutlar)
- Create: `docs/app-store/raw/<dil>/01..06.png`, `docs/app-store/screenshots/**`

**Interfaces:**
- Consumes: Task 1 bayrağı, Task 3 betiği.
- Produces: `bash scripts/store-shots/capture.sh <dil> <01-06>` → açılmış simülatörden `docs/app-store/raw/<dil>/<no>.png`. Betik başta `xcrun simctl status_bar booted override --time 9:41 --batteryState charged --batteryLevel 100 --cellularBars 4 --wifiBars 3` çalıştırır, sonra `xcrun simctl io booted screenshot`.

- [ ] **Step 1:** iPhone 17 Pro Max simülatörünü aç; `EXPO_PUBLIC_STORE_SHOTS=1 npm run ios` ile kur (cihaz seçimi için `-- --device "iPhone 17 Pro Max"`).
- [ ] **Step 2: Hazır durum** (uygulamayı elle kullanarak): onboarding'i tamamla, Profil → Geliştirici → Premium anahtarını aç, tema Aydınlık, ad boş. Ana hikâyeyi ve 5 hikâyeyi daha bitir (kütüphane dolsun), bugünkü sayaç 2/3'te kalsın. Seri gerçek değeriyle kalır (spec'te ≥ 5 yazıyordu; tohumlama kodu yazmamak için gevşetildi).
- [ ] **Step 3: Hikâye seç.** `sqlite3 assets/albor.db` ile 4 dilde `story_translations` satırı olan, yasak id'lerde olmayan, başlığı kısa ve güçlü 1 ana hikâye seç; id'yi README'ye yaz. Kare 2, 3, 4 aynı hikâyeden çekilir.
- [ ] **Step 4: TR çekimi.** Sırayla: 01 Keşfet (en üst) · 02 hikâye, başlık ve vurgu cümlesi görünür · 03 aynı hikâye, "Dinle" çalışırken · 04 Sohbette Kullan, "Tek cümle" · 05 Okuma Yolu, unvan kartı · 06 Kütüphane, "Okunanlar". Her karede kontrol: reklam yok, kilit yok, göz ikonu yok.
- [ ] **Step 5:** `npm run store:shots -- tr`; `strip.png`'yi %20 ölçekte (`sips -Z 574`) aç: ilk 3 karenin başlığı okunuyor mu. Okunmuyorsa Task 3'teki punto/konumu düzelt, yeniden üret.
- [ ] **Step 6:** TR setini kullanıcıya göster, onay al. Onaydan sonra Profil → Dil ile EN, ES, DE için Step 4–5'i tekrarla.
- [ ] **Step 7:** `xcrun simctl status_bar booted clear`.

### Task 5: Önizleme videosu (TR, sonra EN)

**Files:**
- Create: `scripts/store-shots/preview.sh`
- Create: `docs/app-store/preview/<dil>/raw.mov`, `docs/app-store/preview/<dil>/albor-preview.mp4`

**Interfaces:**
- Consumes: `captions.json` (ilk 5 başlık üst yazı, `disclosure` bitiş kartı), Task 4'teki hazır durum.
- Produces: `bash scripts/store-shots/preview.sh <dil> [muzik.m4a]` → `albor-preview.mp4`. Müzik verilmezse sessiz stereo iz (`anullsrc=r=48000:cl=stereo`) eklenir.

Zaman çizelgesi (ham kayıt bu sürelere göre çekilir, toplam 24 sn + 3 sn kart):

| Sn | Eylem | Üst yazı |
|---|---|---|
| 0–3 | Keşfet, bekle | başlık 1 |
| 3–9 | ana hikâyeye dokun, yavaş kaydır | başlık 2 |
| 9–13 | "Dinle" | başlık 3 |
| 13–19 | Sohbette Kullan: Tek cümle → 30 sn → Kopyala | başlık 4 |
| 19–24 | Okuma Yolu | başlık 5 |
| 24–27 | bitiş kartı: `#1B4B48` zemin, `assets/logo` logosu, "Albor", `disclosure` | — |

`preview.sh` kararları: girdi `raw.mov` ilk 24 sn'ye kırpılır; `scale=886:-2,crop=886:1920`; üst yazılar `drawtext` ile Playfair Bold, üstten 150 px, arkasında yarı saydam `#1B4B48` şerit, her biri kendi aralığında `enable='between(t,a,b)'`; bitiş kartı Task 3'teki gibi başsız Chrome'la 886×1920 PNG basılıp 3 sn'lik klip olarak eklenir, geçiş 0,3 sn `xfade=fade`; çıktı `-c:v libx264 -profile:v high -level 4.0 -r 30 -b:v 10M -pix_fmt yuv420p -c:a aac -b:a 256k -ar 48000 -ac 2`.

- [ ] **Step 1:** `preview.sh` yaz.
- [ ] **Step 2: Kayıt.** Keşfet'in üstündeki tarih satırı videoda görünmemeli: üst yazı şeridi çıktıda y=0–330 px'i örter, tarih satırı bu alanda kalır. Kayıttan önce Keşfet en üste kaydırılmış olmalı. `xcrun simctl io booted recordVideo --codec h264 docs/app-store/preview/tr/raw.mov`, akışı çizelgeye göre oynat, Ctrl+C.
- [ ] **Step 3:** `bash scripts/store-shots/preview.sh tr`.
- [ ] **Step 4: Doğrula.** `ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate,channels:format=duration,size albor-preview.mp4` → `h264`, 886×1920, `30/1`, `aac` 2 kanal, süre 15–30, boyut < 500 MB.
- [ ] **Step 5: İzle.** Tarih ve fiyat görünmüyor; üst yazılar okunuyor; bitiş kartında Premium notu var. Poster karesi için 2. saniyeyi README'ye not et.
- [ ] **Step 6:** Kullanıcı onayından sonra EN için Step 2–5. Müzik kaynağı onaylanırsa betiği müzik dosyasıyla yeniden çalıştır.

### Task 6: Kapanış

**Files:**
- Modify: `APP_STORE_CHECKLIST.md` (ekran görüntüsü maddesi: dosya yolları ve tarih; ASC'ye yükleme hâlâ açık)
- Modify: `docs/app-store/README.md`

- [ ] **Step 1:** `npm test` → tümü PASS.
- [ ] **Step 2:** Checklist maddesini "KISMİ — set hazır, ASC'ye yüklenmedi" olarak güncelle; bundle ID satırındaki `com.albor.app` değerine dokunma, kullanıcıya ayrıca bildir.
- [ ] **Step 3:** Kullanıcıya yükleme listesi ver: her dil için `6.9/` (gerekirse `6.3/`) ve TR/EN video. Yükleme ve zorunlu cihaz boyutunun ASC'deki son hali kullanıcıda.

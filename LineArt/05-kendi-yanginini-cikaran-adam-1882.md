# VİDEO ÜRETİM PROMPTU — "Kendi yangınını çıkaran adam"

Kaynak: Albor `story_id 1882`, viral puanı 87, hassas (13 ölü). Kitap *Think Again* (Adam Grant, 2021). Kategori Kişisel Gelişim → yeşil `#2F7D5B`, kart görseli `assets/categories/Growth.png`.

## 1. Format
- 1080×1920, 9:16, 30 fps, 55 s hedef, 60 s tavan.
- Açık tema. Zemin her sahnede kağıt `#F7F3EC`. Gradient, glow, gölge blob yok.
- Güvenli bant: tüm yazı ve görsel 168–1330 px arasında. 1330 px altı boş kağıt.
- Hard cut geçişler. Her sahne alttan 0,5 s `power3.out` ile girer. Bounce, pulse, yoyo yok.
- Kamera hiç durmaz: yavaş pan veya en fazla 1,1× zoom.

## 2. Marka renkleri ve logo
| Rol | Hex | Kullanım |
|---|---|---|
| Kağıt | `#F7F3EC` | Zemin |
| Mürekkep | `#24211E` | Başlık, okunmuş altyazı |
| Petrol | `#1F5F5B` | Vurgu çizgileri, el çizimi daire, okunmakta olan kelime, kicker |
| Soluk | `#8C837A` | Henüz okunmamış altyazı |
| Yeşil | `#2F7D5B` | Yalnızca kicker "KİŞİSEL GELİŞİM", kitap sırtı, 4 px ince şerit. Büyük yüzeyde asla |
| Altın | `#E9A94B` + yazı `#2A1E08` | Yalnızca son kart CTA butonu |

- Logo: `assets/logo/albor_logo.png`. Sahne 1'den itibaren sol üst, x 80 / y 180, yükseklik 56 px. Son kartta ortada 160 px.
- Kategori görseli: `assets/categories/Growth.png` yalnızca son kartta kitap kartının yanında, 120 px.
- Yasak: turuncu/kırmızı/mercan vurgu (yangın hikâyesi olmasına rağmen alev rengi yok; ateş mürekkep siyahı çizgi + petrol dolgu ile stilize edilir), emoji, sahte UI, uydurma sayı.

## 3. Tipografi
- Başlık ve hook: Playfair Display 700, sola hizalı, son satır petrol.
- Kicker: Inter 600, 30 px, büyük harf, letter-spacing 0.18em.
- Altyazı: Inter 800, 66 px, x 80 / y 1150, karaoke: cümle soluk, okunan kelime petrol, okunmuş kelimeler mürekkep.
- 28 px altında hiçbir yazı yok.

## 4. Görsel dil
Kağıt üzerine mürekkep çizgi illüstrasyon (ince kalem, az dolgu). Figürler silüet. Yamaç, ot, kibrit, alev stilize. Gerçekçi yanık, ceset, acı görüntüsü yok (hikâye hassas: 13 ölü). Gerçek uygulama ekranı yalnızca son iki sahnede.

## 5. Seslendirme
Türkçe, sakin, anlatıcı tonu, hız 1,06. Satırlar bağlamlı okunur (önceki + sonraki satır birlikte gönderilir). Altyazı ElevenLabs kelime zamanlamasından üretilir.

Müzik: düşük, tek enstrüman (çello veya piyano), sahne 5'e kadar yükselen gerilim, sahne 6'da kesilir, sahne 7'den sonra yumuşak tema. SFX: kibrit çakma (sahne 2), uzaktan uğultu (sahne 1–5), sessizlik (sahne 6).

## 6. Sahne planı

**S1 · 0,0–4,5 s · HOOK (kare 0 = thumbnail)**
- VO: "1949, Montana. Arkasında kendisinden hızlı koşan bir yangın var... ve adam duruyor."
- Ekran yazısı (Playfair, 3 satır, kare 0'da tam görünür):
  Arkasında yangın var.
  Herkes kaçıyor.
  **O duruyor.** ← son satır petrol
- Görsel: yamaçta koşan 15 silüet, en öndeki tek figür dik durmuş. Arkada ufku kaplayan mürekkep dalga (yangın). Kamera figüre yavaş zoom 1,0→1,08.
- Vurgu: "duruyor" kelimesi okunurken figürün etrafına el çizimi petrol daire çizilir.

**S2 · 4,5–9,0 s**
- VO: "Cebinden bir kibrit çıkarıyor. Önündeki otları ateşe veriyor."
- Görsel: yakın plan el + kibrit. Kibrit SFX. Otlar mürekkep çizgiden petrol dolguya dönüşür (yanma).
- Kicker sağ üst: KİŞİSEL GELİŞİM (yeşil `#2F7D5B`).
- Vurgu: yok. Sahne tek fikir: kibrit.

**S3 · 9,0–14,0 s**
- VO: "Ekibi çılgınlık sanıyor. Koşmaya devam ediyorlar. Çünkü eğitimleri hep bunu söyledi."
- Ekran yazısı: "Plan: koş." (Playfair, sola)
- Görsel: silüetler kadrajdan sağa akıp çıkar, adam solda yalnız kalır. Kamera sola pan.
- Vurgu: "koş." kelimesinin altı petrol çizgi, el çizimi.

**S4 · 14,0–21,0 s**
- VO: "Ekip şefi Wagner Dodge'un sorusu farklıydı. Yangın yakıt ister. O, yakıtı kendi eliyle yaktı ve küllerin üstüne uzandı."
- Ekran yazısı: "Yangın yakıt ister." → "yakıt" petrol.
- Görsel: adamın önünde yanmış siyah leke büyür, adam lekenin içine uzanır. Üstten bakış.
- Vurgu: "yakıt" kelimesine petrol daire. Bu sahne hikâyenin mantık kilidi, en net okunmalı.

**S5 · 21,0–27,0 s**
- VO: "Ana yangın geldi, üzerinden geçti... ve yakacak hiçbir şey bulamadı."
- Görsel: mürekkep dalga soldan sağa tüm kadrajı geçer, siyah leke ve içindeki figür olduğu gibi kalır. Müzik tepe noktası, sonra kesilir.
- Vurgu: yok. Sessizlik 0,6 s.

**S6 · 27,0–33,0 s · SAYILAR**
- VO: "O gün 13 kişi öldü. Üç kişi hayatta kaldı. Biri Dodge'du."
- Ekran yazısı (Playfair, büyük, iki satır):
  13 öldü.
  **3 hayatta kaldı.** ← petrol
- Görsel: beyaz kağıt, yalnızca yazı. Yazı 0,5 s alttan girer, kamera 1,03× zoom.
- Ton: saygılı. Hiçbir süsleme yok.

**S7 · 33,0–41,0 s · DÖNÜŞ**
- VO: "Dodge'u kurtaran hız değildi. Sorusuydu. 'Nasıl daha hızlı koşarım?' yerine 'Yangın bana ulaşmak için neye ihtiyaç duyuyor?'"
- Ekran yazısı iki blok, üst üste, sola hizalı:
  ~~Nasıl daha hızlı koşarım?~~ (soluk `#8C837A`, üstü petrol çizgiyle çizilir)
  **Yangın neye ihtiyaç duyuyor?** (mürekkep, son iki kelime petrol)
- Vurgu: üstü çizme animasyonu VO "yerine" kelimesinde tetiklenir. Bu sahne videonun paylaşılma sebebi, 8 s ver.

**S8 · 41,0–49,0 s · NEDEN ZOR**
- VO: "Yıllarca işe yaramış bir plan, tehlikeye dönüştüğü gün bile güvenli hissettirir. Herkes hâlâ koşarken durmak işte bu yüzden zordur."
- Görsel: ilk kez gerçek uygulama ekranı: hikâyenin okuma ekranı (hikâye 1882), 920×790 çerçeve, y 270, köşe 36, 2 px `#E6DED3` kenar, bezel yok. Yavaş yukarı pan. `SON55` rozeti kağıt rengi maske ile kapatılır.
- Vurgu: ekrandaki "güvenlik gibi hissettirir" cümlesine petrol el çizimi daire.

**S9 · 49,0–55,0 s · KAPANIŞ MESAJI**
- VO: "Hep işe yarayan plan tıkanıyorsa... yenisini denemeye yer varken onu bırakın."
- Ekran yazısı (Playfair, 3 satır, cep cümlesi):
  Hep işe yarayan plan
  tıkanıyorsa,
  **onu bırakın.** ← petrol
- Görsel: beyaz kağıt, altta 4 px yeşil `#2F7D5B` şerit kısa.
- Vurgu: "bırakın" altı çizilir.

**S10 · 55,0–60,0 s · SON KART**
- VO: "Hikâyenin tamamı Albor'da."
- Ortada Albor logosu 160 px. Altında kitap kartı: sırt yeşil `#2F7D5B`, yazı "Think Again · Adam Grant". Yanında `Growth.png` 120 px.
- Soru satırı (Inter 600, 34 px, soluk): "Sen hangi alışkanlığı daha hızlı koşarak sürdürüyorsun?"
- CTA butonu: altın `#E9A94B`, yazı `#2A1E08`, Inter 700: **"Bugünün hikâyesini oku"**. Tek tap halkası 57. saniyede. "İndir" yazmaz.
- 2 s sabit tutulur, kamera 1,02× zoom.

## 7. Vurgu özeti
1. S1 "duruyor" daire. Hook.
2. S4 "yakıt" daire. Mantık.
3. S6 "13 / 3" tipografik, süssüz. Ağırlık.
4. S7 soru değişimi, üstü çizme. Paylaşım anı.
5. S9 "bırakın" altı çizgi. Ders.
Her sahnede en fazla bir vurgu.

## 8. Sınırlar
- Sayılar sabit: 5 Ağustos 1949, Mann Gulch, ~10 dakikada ~3.000 akr, 13 ölü, 3 sağ (Dodge, Sallee, Rumsey). Başka sayı eklenmez.
- Metinler yukarıdaki gibi birebir. Üçlü liste, retorik soru, slogan eklenmez.
- Dodge suçlanmadı; videoda kimse suçlanmaz.

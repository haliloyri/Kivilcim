# Albor sosyal medya tasarımı (reels ve carousel)

Bu dosya Instagram reels ve carousel içeriği için geçerlidir. Uygulamanın `DESIGN.md` dosyası uygulamaya özeldir ve sosyal içerik için bağlayıcı değildir: oradaki "turuncu yasak", "büyük yüzeyleri kategori boyamaz" ve "altın yalnız ışık" kuralları burada uygulanmaz. Sosyal içerik uygulamadan yalnızca marka kimliğini (krem kâğıt, mürekkep, logo, kategori renkleri) alır.

Hangi skill ne yapar: `albor-reel` (tanıtım reel'i, Remotion), `albor-story-lemo` (hikâye reel'i, lemo-opuscar), `albor-carousel` (carousel). Üçü de bu dosyadaki renk ve kategori kurallarını kullanır.

## 1. Sabit marka kimliği (her içerikte aynı)

| Öğe | Değer |
|---|---|
| Zemin (kâğıt) | `#F4EEE1` (lemo) ya da `#F7F3EC` (Remotion), hafif kâğıt dokusu |
| Mürekkep | `#2B2620` (lemo) ya da `#24211E` (Remotion) |
| Yumuşak yazı | `#8A7F70` (lemo) ya da `#6B625A` (Remotion) |
| Nötr gri (boş nesne) | `#D2C9B8`, çizgi `#B9AD98` |
| Kart | `#FBF7EE` ya da `#FFFDF9` |
| Marka petrolü | `#1F5F5B` (kategori belli değilse varsayılan vurgu) |
| Logo | `albor-promo/assets/logo.png`. Reels: sol üstte 56 px, yanında "Albor". Son kartta 160 px logo, "Albor", "Hikâyeyi oku" |
| Altın CTA | `#E9A94B` zemin, `#2A1E08` yazı. Yalnız Remotion reel'lerinin son kartındaki düğmede |

Yazı tipleri: Remotion reel ve carousel için Fraunces (başlık) ve Manrope (gövde). Lemo hikâye reel'i için Newsreader (başlık, altyazı), Caveat (el yazısı notlar), IBM Plex Mono (etiket). Hepsi OFL, projeye indirilip kullanılır.

## 2. Kategori rengi

Hikâyenin kategorisi içerik rengini belirler. Kaynak: uygulamadaki `src/utils/categoryImages.js` içinde `CATEGORY_THEME_MAP` (tek doğru kaynak; renk değişirse oradan alın, bu tablo ona uymalıdır). Reels ve carousel yalnızca açık tema tonunu kullanır.

| Kategori (TR, puan listesindeki `main_category`) | Anahtar | Vurgu rengi |
|---|---|---|
| Finans | Finance | `#2F7D5B` |
| Büyüme | Growth | `#2F7D5B` |
| Psikoloji | Psychology | `#5B5FB5` |
| Felsefe | Philosophy | `#5B5FB5` |
| Bilim | Science | `#8650A8` |
| İletişim | Communication | `#1F7FA8` |
| Liderlik | Leadership | `#A5623A` |
| Tarih | History | `#A5623A` |
| Sağlık | Health | `#C0507A` |
| Verimlilik | Productivity | `#4C5B7A` |
| İş | Business | `#4C5B7A` |
| Kategori yok ya da tanıtım içeriği | Tümü | `#1F5F5B` (petrol) |

Hikâyenin kategorisi: `hikaye_viral_puanlari.csv` içindeki `main_category` (alt kategori değil). Karar verilemeyen durumda ("Alışkanlıklar" gibi alt kategoriler) ana kategoriyi kullan ve `albor.db` ile doğrula.

### Rengin kullanıldığı yerler

- Başlığın son satırı.
- Ortadaki nesnede "eklenen", "artan", "doğru" kısım (dolgu).
- Vurgulanan kelime ve el yazısı notlar.
- Yorum sorusundaki çizgi ya da kesikli boş hücre.
- Kategori adı etiketi (küçük mono ya da Manrope, kategori rengi).
- Arka plan deseni (aşağıda).

Rengin kullanılmadığı yerler: kâğıt zemin, logo, altyazı metni (mürekkep), kart zemini, kenarlıklar (mürekkep). Böylece her video aynı seriye ait görünür.

### Arka plan deseni (kategoriye göre)

- Zemin hep krem kâğıt kalır. Desen yalnızca kategori renginin %10–14 opaklıklı tonudur.
- **Nokta ızgarası:** lemo stilinin kâğıt ızgarası kategori renginde (60 px aralık, 2 px nokta).
- **Kategori silueti:** `assets/categories/<Anahtar>.png` (şeffaf, uygulamanın kategori ikonu) kadrajın alt boş bölgesinde (y 1400–1900) büyük (700–900 px) ve %10–14 opaklıkta. Instagram arayüzü alt kısmı örter, bu yüzden ana içerik orada değil.
- Carousel'de silüet sağ alt köşede, slayt yüksekliğinin %45'i kadar, %10–14 opaklıkta.
- Desen hiçbir zaman metnin arkasında okunurluğu düşürmez; metin üstünde kontrast ≥ 4,5:1 kalır.

### İkinci renk (düşüş, mücadele, kaybolan)

Sıcak turuncu `#C9801E`. İstisna: kategori **Liderlik ya da Tarih** ise vurgu `#A5623A` turuncuya çok yakındır; o zaman düşüş için mürekkep (`#2B2620`) kesikli çizgi kullan. Düşen kısım her zaman kesikli çerçeve olarak kalır, dolgu yok.

### Kontrast

Açık ailelerin bir kısmı (Gül `#C0507A`, Mor `#8650A8`, Yeşil `#2F7D5B`) krem zeminde büyük yazıda (≥ 48 px) yeterlidir. Küçük yazıyı (mono etiket, 28–32 px) mürekkep renginde bırak. Gerekirse `readableCategoryText` mantığıyla koyulaştır (uygulama kodunda mevcut).

## 3. Yerleşim

| | Reels | Carousel |
|---|---|---|
| Boyut | 1080×1920 | 1080×1350 |
| Güvenli bölge | y 168–1330 | kenarlardan 80 px |
| Üstte | logo (80, 60), 56 px | alt bilgide logo |
| Kategori etiketi | sağ üstte, logo satırıyla aynı hizada (y 60–116), sağa hizalı, sağ kenardan 80 px | sağ üstte, aynı kural |
| Altyazı | y 1196 çizgisinin altı, Newsreader 54 px / Fraunces 66 px | slayt altında kısa satır |
| Başlık | kare 0'da tam okunur, 78 px, en çok 3 satır | slayt başına tek fikir |

### Kategori etiketi

Her hikâye içeriğinde kategorinin adı sağ üstte yazılır. Altta yazılmaz: alt bölgeyi altyazı bandı ve Instagram arayüzü kaplar.

- Metin: kategorinin Türkçe tek kelimelik adı (Psikoloji, Liderlik, İletişim, Sağlık, Finans, Büyüme, Felsefe, Tarih, Bilim, Verimlilik, İş). Alt kategori ("Alışkanlıklar") yazılmaz.
- Biçim: büyük harf, hafif harf aralığı, 28 px. Lemo reel'inde IBM Plex Mono, Remotion reel ve carousel'de Manrope 700.
- Renk: kategori vurgu rengi. Küçük yazıda kontrast ≥ 4,5:1 sağlanmıyorsa (Gül, Mor, Yeşil) koyulaştırılmış ton kullanılır (uygulamadaki `readableCategoryText` mantığı).
- Solunda 28 px kategori ikonu (`assets/categories/<Anahtar>.png`) olabilir. İkon ve metin arası 12 px.
- İlk karede görünür ve hareket etmez; başlıkla yarışmaması için küçük kalır. Tanıtım içeriğinde (kategori yok) etiket konmaz.

Hikâye reel'inde ortadaki nesne tek ve tanınır bir gerçek nesnedir (kutu, şişe, oy kutusu, fotoğraf çerçevesi, konuşma balonu). Çok parçalı görsel (yüzlerce nokta) kullanılmaz. Kalem ya da harf harf yazma efekti kullanılmaz.

## 4. Seri tutarlılığı

Sabit kalan: kâğıt zemin, yerleşim, logo, yazı tipleri, ses, süre (35–42 s), kapanış kartı. Değişen: kategori rengi ve desen, ortadaki nesne, hook cümlesi, kapanış hareketi. Aynı nesne ve aynı hook kalıbı ardışık videolarda tekrar etmez.

### Aynı hikâyenin reel'i ve carousel'i

Bir hikâye hem reel hem carousel olarak, farklı zamanlarda yayınlanacaksa ikisi aynı hikâyeyi anlatır ama aynı görselleri kullanmaz.

Aynı kalır: kategori rengi, desen, kategori etiketi, kâğıt zemin, logo, yazı tipleri, hikâyenin olguları, kitap ve yazar adı, ortadaki ana nesne (örn. kutu ve şişe).

Farklı olur:
- **Hook:** aynı cümle iki kere kullanılmaz. Reel'de kısa kişisel soru, carousel'de çelişki, rakam ya da sonuç kancası.
- **Derinlik:** reel hızlı ve tek fikirdir. Carousel yavaş okunur, her slaytta tek adım; reel'de olmayan ayrıntı (olgu, yazarın cümlesi, düşünme sorusu) taşır. İkisi birbirini tamamlar.
- **Görsel:** reel'in animasyon karelerini carousel slaytı yapma. Nesne aynı çizimle ama carousel'de büyük, sade ve slayt başına tek nesne olarak gösterilir.
- **Kapanış sorusu:** ikisi de yorum sorusuyla bitebilir ama soru farklıdır.
- **Açıklama (caption):** iki içerikte farklı yazılır, kopyalanmaz.

Sıra: önce reel (geniş erişim, merak), birkaç gün sonra carousel (kaydetme ve paylaşma için ayrıntı). İkinci içerik birincisine atıf yapabilir ama zorunlu değil. Üretimde önce hangisi yapılıyorsa onun metinleri ve nesne seçimi `SCENARIO.md` içine yazılır; ikinci içerik oradan farklı bir kanca ve slayt akışı çıkarır.

## 5. Dosya ve adlandırma

Teslim: `/Users/hoyri/Documents/Projects/Albor-Reels/hikaye/tr/` (hikâye reel'leri), `Tanıtım/` (tanıtım). Dosya adı kısaca konuyu anlatır: boşluksuz, küçük harf, Türkçe karakter yok, en çok 20 harf, sayı yok; aynı adlı `.txt` Instagram açıklamasıdır.

## 6. Kontrol listesi

- [ ] Hikâyenin kategorisi puan listesinden ya da DB'den alındı, renk yukarıdaki tablodan.
- [ ] Vurgu rengi yalnız izin verilen yerlerde; kâğıt ve metin rengi değişmedi.
- [ ] Desen %10–14 opaklıkta ve metnin okunurluğunu bozmuyor.
- [ ] Liderlik ve Tarih'te düşüş mürekkep kesikli çizgiyle gösterildi.
- [ ] Logo her karede, ilk karede başlık tam okunur, sağ üstte kategori etiketi var.
- [ ] Güvenli bölge dışında içerik yok.
- [ ] Aynı hikâyenin reel ve carousel'i varsa hook, kapanış sorusu ve caption farklı.
- [ ] Rakamlar hikâye metninden; indeks kullanıldıysa "başlangıç = 100" notu var.

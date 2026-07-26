# Spark Hikâyeleri İçin Instagram Video Rehberi

Bu belge, `assets/kivilcim.db` içindeki bütün Türkçe hikâyeleri aynı kalite standardıyla Instagram Reels videosuna dönüştürmek için ortak üretim sistemidir. Her hikâyede konu değişebilir; marka hissi, anlatı ritmi, teknik format ve onay süreci değişmez.

Bu rehberin güncel üretim ilkesi şudur: kullanıcı tek bir sesli ve altyazılı video alır; fakat yayın kalitesini korumak için görüntü, Türkçe seslendirme ve tipografi içeride ayrı katmanlarda üretilir. Seedance temiz hareketli görüntü ve ortam sesini, ElevenLabs Türkçe anlatımı, yerel render ise doğrulanmış altyazı ve açılış/kapanış tipografisini sağlar.

Üretimde pahalı görsel aşaması en sona bırakılır. Önce ortam, araçlar ve izinler kontrol edilir; sonra onaylı TTS'nin gerçek süresi ölçülüp ses, altyazı ve hedef video süresi kesinleştirilir. Seedance ancak bu süre kapısı geçildikten sonra çalıştırılır. Bu sıra hem senkron hatasını hem de aynı dosyanın gereksiz yere yeniden üretilmesini önler.

## 1. Amaç

Her video şu dört sonucu birlikte hedefler:

1. İlk iki saniyede izleyicinin dikkatini kazanmak.
2. Hikâyeyi kısa, doğru ve kolay takip edilir biçimde anlatmak.
3. İzleyicinin kendi hayatıyla bağ kurmasını sağlamak.
4. Zorlama bir etkileşim tuzağı kullanmadan kaydetme veya paylaşma isteği uyandırmak.

Başarı ölçütü yalnızca izlenme değildir. Tamamlama oranı, yeniden izleme, kaydetme, paylaşma ve anlamlı yorumlar birlikte değerlendirilir.

## 2. Değişmeyen yayın formatı

| Özellik | Standart |
|---|---|
| Dil | Türkçe |
| Platform | Instagram Reels |
| En-boy oranı | 9:16 |
| Çözünürlük | 1080 × 1920 |
| Hedef süre | 40–50 saniye |
| Kabul edilen süre | 35–55 saniye |
| Kare hızı | 30 fps |
| Video | H.264, `yuv420p` |
| Ses | AAC, 48 kHz |
| Sahne sayısı | 7–8 |
| Seslendirme | Hedef 38–47 sn; 90–120 kelime yalnız planlama aralığıdır |
| Altyazı | Videoya gömülü ve ayrıca `.srt` |
| Marka görünümü | Yalnızca son 1–2 saniyede sade Spark/Kıvılcım imzası |

Videonun merkez bölgesini metin için güvenli tut. Arayüz öğeleriyle çakışmaması için önemli yazıları üstten yaklaşık yüzde 12, alttan yüzde 20 içeri taşı.

### Üretim profilleri

İki profil desteklenir; dosyada hangisinin kullanıldığı `project.production.mode` ile açıkça belirtilmelidir.

| Profil | Kullanım | Video süresi | Seslendirme | Görsel yapı |
|---|---|---:|---:|---|
| `story-reel` | Hikâyeyi bağlamıyla anlatan standart video | Hedef 40–50 sn; kabul 35–55 sn | Hedef 38–47 sn; kelime sayısı seçilen sese göre | 7–8 sahne/görsel |
| `short-rerender` | İlk 20 prompt gibi hızlı, tek fikirli Reels | Hedef 15 sn; teknik uyarlama 12–20 sn | Hedef 12,8–14,2 sn; geçmiş ölçüm yoksa yaklaşık 22–26 kelime | Tek Seedance klibi, 4–5 referans veya kısa çok planlı video |

Kısa profilde 15 saniye varsayılan hedeftir, zorunlu sabit değildir. Kullanıcı özellikle “tam 15 saniye” demediyse Aşama A'da 12–20 saniyelik teknik uyarlama aralığını brief'e yaz; bu aralık içindeki süre düzeltmesi için yeniden onay gerekmez. Seslendirme metni veya ana mesaj değişirse yeniden onay gerekir.

Kelime sayısı yalnız taslak bütçesidir. Önce aynı sesin daha önce ölçülen gerçek hızını kullan. Ölçüm yoksa kısa Türkçe anlatım için güvenli başlangıç değeri `110 kelime/dakika`dır:

```text
tahmini süre (sn) = kelime sayısı / ölçülmüş kelime-dakika × 60
```

Nihai karar her zaman üretilmiş sesin gerçek süresine göre verilir. Sesi sırf videoyu doldurmak için yavaşlatma. Anlatımdan sonra varsayılan olarak 0,6–1,2 saniye, bilinçli bir final gerekiyorsa en fazla 2 saniye yazısız görsel nefes bırak. Daha büyük boşlukta videoyu kısalt veya metni onay aşamasında güçlendir.

### Dil ve Instagram hesap yönetimi

- Güncel üretim dili Türkçedir. Seslendirme, gömülü altyazı, kapak metni ve paylaşım açıklaması aynı dilde olmalıdır.
- Dört dili tek Reels içinde veya aynı yayın akışında rastgele karıştırma. Önce Türkçe hesabın formatını ve izleyici tepkisini doğrula.
- Diğer diller düzenli üretim hacmine ulaştığında her dil için ayrı Instagram hesabı tercih et. Aynı `story_id`, görsel kimlik ve yayın takvimi korunabilir; anlatım, altyazı, kapak ve açıklama her dilde yeniden yerelleştirilir.
- Ayrı hesapların sürdürülemeyeceği erken aşamada tek Türkçe hesapla ilerle; tek videoda dört dilli altyazı kullanma.

## 3. Veritabanını kullanma

Tek doğruluk kaynağı `assets/kivilcim.db` dosyasıdır. Üretimde öncelikle şu alanları kullan:

- `story_translations.title`: hikâye kimliği ve konu.
- `story_translations.description`: tek cümlelik özet.
- `story_translations.content`: anlatının ana kaynağı.
- `story_translations.hook`: doluysa kanca adayı.
- `story_conversation_variants`: varsa kısa anlatım, soru ve karşıtlık için yardımcı kaynak.
- `books` ve `book_translations`: yazar, kitap ve bağlam doğrulaması.

Kaynak metindeki işaretleri son çıktıda gösterme. İşlevleri şunlardır:

| İşaret | İşlev | Videodaki karşılığı |
|---|---|---|
| `##...##` | Vurucu olay veya alıntı | Dönüm noktası ya da güçlü altyazı |
| `$$...$$` | Ana ders | Son üçte birlik bölümde içgörü |
| `&&...&&` | Düşünme sorusu | Kapanış sorusu |
| `~~...~~`, `::...::` | Eski/özel vurgu işaretleri | Anlamı koru, işareti kaldır |

Kaynakta bulunmayan sayı, unvan, olay, diyalog veya kesin alıntı ekleme. Bir düşünceyi akıcılaştırmak için yeniden yazabilirsin; anlamı güçlendirmek adına yeni bir gerçek icat edemezsin.

## 4. Anlatı omurgası

Her video aşağıdaki altı vuruşu izler:

| Zaman | İşlev | Örnek yaklaşım |
|---:|---|---|
| 0–2 sn | Kanca | İzleyicinin varsayımını bozan kısa cümle |
| 2–8 sn | Ayna | “Belki sen de...” hissi veren tanıdık durum |
| 8–20 sn | Somut hikâye | Kişi, problem ve görünür davranış |
| 20–31 sn | Dönüm noktası | Soruyu, deneyi veya fark edişi göster |
| 31–41 sn | İçgörü | Hikâyenin ana dersini sadeleştir |
| 41–50 sn | Yansıma ve CTA | Tek soru + tek doğal kaydetme/paylaşma çağrısı |

Bu yapı kronometre değil, ritim kılavuzudur. Ancak kancayı geciktirme ve ana dersi ilk cümlede tamamen açıklama.

### 15 saniyelik kısa profil omurgası

| Zaman | İşlev | Uygulama |
|---:|---|---|
| 0–1,5 sn | Kanca | İlk karede soru veya varsayımı bozan kısa afiş |
| 1,5–5,5 sn | Zihinsel çatışma | İzleyicinin iç sesini 2–3 kısa blokla görünür kıl |
| 5,5–8 sn | Dönüş | Gerçeğin farklı olabileceğini göster |
| 8–10 sn | Ana ders | İki aşamalı güçlü kapanış tipografisi |
| 10–15 sn | Görsel sonuç | Yazısız çözülme, sıcaklık veya düşünme alanı |

Bu zamanlar nihai ses oluşmadan kesinleştirilmez. Gerçek cümle başlangıçları, üretilmiş ses dosyasından ölçülür.

### Kanca kuralları

İyi kanca:

- 6–12 kelimedir.
- İzleyicinin kendini savunmaya geçmesini değil, merak etmesini sağlar.
- Hikâyenin gerçek vaadini karşılar.
- Ses açık olmasa bile ekranda anlaşılır.

Uygun kalıplar:

- “Belki sorun sandığın şey, aslında başka bir şeydir.”
- “Bu küçük karar, bütün sonucu değiştirdi.”
- “Herkes onu tembel sandı. Gerçek neden başkaydı.”
- “Başarısızlığın nedeni yetenek eksikliği olmayabilir.”

Kaçınılacak kalıplar:

- “Bunu sadece yüzde bir biliyor.”
- “Sonunu duyunca şok olacaksın.”
- Hikâyenin desteklemediği başarı, servet veya sağlık vaadi.
- İzleyiciyi küçümseyen ya da utandıran dil.

### Kapanış kuralları

Kapanışta en fazla iki unsur kullan:

1. İzleyicinin kendi hayatına uygulayabileceği tek, açık soru.
2. “Bunu ihtiyacı olan birine gönder” veya “Sonra düşünmek için kaydet” gibi tek bir CTA.

“Yorum yap, beğen, takip et, kaydet ve paylaş” gibi üst üste çağrılar kullanma.

## 5. Seslendirme metni

Seslendirme, yazılı makale gibi değil, bir kişinin karşısındaki tek kişiye anlattığı hikâye gibi duyulmalıdır.

- `story-reel` için 90–120 kelimeyi ilk taslak aralığı kabul et; seçilen ses bu metni hedef sürede doğal okuyamıyorsa süre hedefi kelime sayısından üstündür.
- `short-rerender` için geçmiş ses ölçümü yoksa 22–26 kelimeyle başla. Daha uzun metni yalnız seçilen sesin ölçülmüş hızı 12,8–14,2 saniyelik anlatım bütçesine sığdırıyorsa kullan.
- Cümlelerin çoğunu 6–14 kelime arasında tut.
- İlk kişiye ancak kaynak gerçekten birinci kişi anlatıyorsa geç.
- Ana kişinin adını ilk kullanımda ver; sonraki cümlelerde gereksiz tekrar etme.
- Bir cümlede tek düşünce taşı.
- Yabancı isimlerin Türkçe seslendirmede okunabilirliğini kontrol et.
- Parantez, başlık işareti, emoji ve veritabanı işaretlerini seslendirme dosyasına koyma.
- Önemli dönüşten önce kısa duraklama için ayrı paragraf kullan.

Sabit `150 kelime/dakika` varsayımına güvenme. Sesler, model ayarları, noktalama ve Türkçe telaffuz süreyi ciddi biçimde değiştirebilir. Aynı sesin önceki üretimlerinden ölçülmüş hız varsa onu kullan; yoksa Aşama A'da muhafazakâr `110 kelime/dakika` hesabıyla taslak hazırla. Bu hesap yalnız ilk TTS'nin hedefe yakın çıkmasını sağlar; nihai süreyi belirlemez.

### Ses süresini videoya uydurma standardı

Süre uyarlamasını Seedance'ten önce, nihai TTS dosyası üzerinde yap. `short-rerender` için 15 saniyelik hedefte ideal ses süresi 12,8–14,2 saniyedir. `story-reel` için son cümleden sonra yaklaşık 0,6–1,2 saniye bırakacak şekilde 38–47 saniyelik anlatım hedefle.

Şu sırayı bozma:

1. Baştaki ve sondaki sessizliği kırp.
2. `250 ms` üzerindeki iç durakları, kelimelerin başını/sonunu ve doğal nefesi kesmeden yaklaşık `120–180 ms` aralığına sıkıştır.
3. Ses hâlâ uzunsa perdeyi koruyan tempo düzeltmesi uygula. Tercih edilen aralık `1.02–1.12×`, mutlak üst sınır `1.15×` olmalıdır.
4. Ses hâlâ hedefe sığmıyorsa kısa videonun nihai süresini `tavan(ses süresi + 0,6 sn)` olarak belirle; kullanıcı süreyi sabitlemediyse 20 saniyeyi aşma. 15 saniyelik Seedance klibini en fazla 2–3 saniye son kare tutma/yavaş yakınlaşma ile, daha uzun farkı onaylı final görselini yerel canlandırarak tamamla. İkinci ücretli Seedance üretimini varsayılan çözüm yapma.
5. Doğal anlatım 20 saniyeye ya da `story-reel` için 55 saniyeye hâlâ sığmıyorsa tekrarları kaldırıp metni kısalt. Metin değiştiği için projeyi yeniden onaya gönder; yeni TTS'yi onaydan önce üretme.

Ses hedefe göre kısaysa yavaşlatma. Çıktı süresini ses süresi + 0,6–2 saniye olacak şekilde kısalt. Kısa profilde kullanıcı tam 15 saniye istemiş ve boşluk 3 saniyeyi aşıyorsa metni Aşama A'da güçlendirip yeniden onay al.

Son üretimde 36 kelimelik Türkçe metnin seçilen seste 19,879 saniye sürmesi, kelime sayısının tek başına yeterli olmadığını doğrulamıştır. Bu kayıt acil çözüm olarak `1.35×` hızlandırılmıştır; bu değer yeni üretimlerde normal çözüm olarak kullanılamaz. Yeni üst sınır `1.15×`tir; daha büyük fark video süresi veya metinle çözülür.

## 6. Altyazı sistemi

Altyazı, seslendirme metnini anlam bakımından izler fakat her kelimeyi tek blokta göstermez.

- Blok başına en fazla iki satır kullan.
- Satır başına yaklaşık 28–34 karakter hedefle.
- Bir blokta 3–8 kelime göster.
- Blokları doğal cümle ve nefes yerlerinden böl.
- Ekranda 0,8 saniyeden kısa metin bırakma.
- Kancayı ilk karede göster.
- Anahtar kelimeleri renk veya ağırlıkla vurgulayabilirsin; bütün cümleyi büyük harfle yazma.
- Noktalama ve Türkçe karakterleri koru.

Varsayılan stil:

- Yazı: beyaz veya sıcak kırık beyaz.
- Vurgu: Spark'ın sıcak turuncu/altın tonu.
- Zemin: yüzde 55–70 opak koyu gölge veya yumuşak kontur.
- Hizalama: orta-alt, güvenli alanın içinde.
- Font: okunaklı, kalın sans serif; uygulamadaki Inter/DM Sans ailesiyle uyumlu.

### Metin hiyerarşisi: açılış ve kapanış vurgusu

Altyazının bütün videoda aynı büyüklükte ve aynı kutuda kalması, en güçlü iki cümleyi sıradanlaştırır. Bu nedenle metni üç seviyede kullan:

| Bölüm | Uygulama | Kaçınılacak şey |
|---|---|---|
| 0–2 sn: kanca | Metni üst-orta güvenli alanda 2–3 kısa satıra böl. En yüklü kelimeyi diğerlerinden yaklaşık yüzde 35–45 daha büyük, Spark'ın sıcak vurgu rengiyle göster. Satırlar ardışık, hızlı ama okunabilir biçimde gelsin. | Kancayı küçük bir altyazı ya da geniş, koyu bir kutunun içine sıkıştırmak. |
| Orta bölüm | Tek seferde 3–7 kelime; beyaz/kırık beyaz, sakin hareket, mümkünse görselin boş alanına yerleşim. | Her kelimeyi zıplatmak, aynı anda birden çok renk veya sürekli efekt kullanmak. |
| Son 1,5–2 sn: ana ders | Son kısa cümleyi ekranın merkezinde iki satıra ayır. İlk satır koyu zeminde açık renk, ikinci satır vurgu renginde ya da vurgu renkli bir şerit üzerinde görünür. Son kelime ekranda en az 0,8 sn tek başına nefes alır. | Son dersi orta-alt altyazı kutusunda, önceki cümlelerle aynı ağırlıkta bırakmak. |

Örnek, “Ya sana kızgın değilse?” kancası için:

```text
YA SANA
KIZGIN
DEĞİLSE?
```

`KIZGIN` en büyük sözcüktür; diğer satırlar onu çerçeveler. Kapanışta aynı ritim tersine döner:

```text
Varsayma.
SOR.
```

İlk ve son cümlede en fazla iki giriş animasyonu kullan: örneğin kısa maske açılması + hafif ölçeklenme. Metin, yüzleri ve kritik görsel bilgiyi kapatmamalı; ilk kanca üst-orta, kapanış ise merkez güvenli alanda kalmalıdır.

### Ses–altyazı senkron standardı

Altyazı zamanları storyboard süresinden değil, sessizlik/duraklama/tempo düzeltmeleri tamamlanmış nihai ses dosyasından türetilir. Özellikle kısa videoda altyazıları otomatik olarak bütün video süresine eşit dağıtmak yasaktır; bu yaklaşım sesin yazıdan önde gitmesine neden olur.

1. Önce onaylı metinden nihai `audio/narration.mp3` dosyasını üret.
2. Gerçek süreyi ölç, gerekiyorsa süre uyarlamasını yap ve renderda kullanılacak son ses dosyasını proje kaydına ekle.
3. `ELEVENLABS_ALIGNMENT_MODE=forced` açıkça ayarlanmışsa ElevenLabs Forced Alignment ile kelime zamanlarını çıkar. Bu ayar yoksa varsayılan `local`dır; gereksiz bir yetki denemesi yapma.
4. Yerel modda nihai ses dalgasındaki konuşma ve duraklama aralıklarını analiz et; bu sonucun kelime düzeyinde yaklaşık olduğunu açıkça belirt. Forced Alignment çağrısı `401 missing_permissions` döndürürse aynı çağrıyı tekrar etmeden yerel moda geç.
5. `.srt` bloklarının başlangıcını ilgili cümlenin başlangıcıyla eşleştir. Okuma kolaylığı için blok, cümle bittikten kısa süre sonra kapanabilir.
6. Son vurgu kelimesi konuşulduğu anda görünmeli ve en az 0,8 saniye ekranda kalmalıdır.
7. Altyazı bittikten sonra görüntü devam ediyorsa yazısız final kabul edilir; `.srt` dosyasını video süresine zorla uzatma.

Senkron kontrolünde yalnız başlangıç ve son kareye bakma. Kanca, her ara blok, dönüş, kapanış kelimesi ve yazısız finalden en az birer kare çıkarıp görsel olarak doğrula.

## 7. Görsel dil

Varsayılan görsel kimlik:

- Sinematik editoryal gerçekçilik.
- Lacivert, kömür, sıcak kehribar ve doğal ten tonları.
- Hafif film dokusu, kontrollü kontrast, yumuşak alan derinliği.
- Duyguyu anlatan eller, beden dili, nesneler ve mekân ayrıntıları.
- Her sahnede tek belirgin odak.
- Altyazı için negatif alan.
- Dikey kadrajda mobil ekranda okunabilir büyük formlar.

### Stil kataloğu ve seçim kuralı

Her hikâyeyi fotogerçekçi drama yapmak zorunlu değildir. Konuya göre aşağıdaki stillerden biri seçilir; aynı videoda en fazla iki yakın stil birleştirilir.

| Stil | En uygun konu | Görsel işaretler |
|---|---|---|
| Sinematik editoryal gerçekçilik | İlişkiler, iş hayatı, gerçek olaylar | Doğal oyunculuk, kontrollü kamera, lacivert–kehribar ışık |
| Metaforik psikolojik gerçekçilik | Korku, varsayım, erteleme, iç çatışma | Ayna, kırık yansıma, gölge, sembolik geçiş |
| Dokunsal nesne metaforu | Müzakere, bileşik büyüme, kontrol listesi | Eller, nesneler, makro planlar, net eylem |
| Şiirsel/temkinli sürrealizm | Hafıza, rüya, değişim, anlam arayışı | Mekân dönüşümü, eşleşen kesmeler, ölçülü gerçeküstülük |
| Grafik editoryal kolaj | Soyut bilgi ve hızlı açıklama | Kâğıt dokusu, güçlü şekiller, sınırlı palet; tipografi yine post-prodüksiyonda |

Varsayılan tercih, hipergerçekçilik yerine `metaforik sinematik editoryal gerçekçilik`tir. Bu yaklaşım duyguyu korur, yapay yüz hissini azaltır ve kişisel gelişim içeriğinin sıradan stok video gibi görünmesini önler. Görsel referans dili marka, yönetmen veya yaşayan sanatçı taklidi istememeli; ışık, kamera, doku, tempo ve kompozisyon üzerinden tarif edilmelidir.

### Görsel prompt formülü

Her sahne promptunu şu sırayla kur:

1. Özne ve eylem.
2. Mekân ve zaman.
3. Duygu ve beden dili.
4. Kamera açısı, lens hissi ve hareket için boşluk.
5. Işık ve renk paleti.
6. Tutarlı görsel stil.
7. `9:16 dikey kadraj, yazısız, logosuz, filigransız` şartı.

Promptu yaklaşık 80–180 kelime arasında, somut ve duyusal tut. “Güzel”, “etkileyici” gibi soyut sıfatlar yerine ışık, yüzey, renk, kadraj ve eylem tarif et.

### Karakter tutarlılığı

Aynı kişi birden fazla sahnede görünüyorsa brief'e kısa bir karakter kartı ekle:

- yaklaşık yaş,
- saç ve kıyafet,
- belirgin ama hassas olmayan fiziksel özellik,
- duygu çizgisi,
- değişmeyen aksesuar.

Bu tanımı her ilgili promptta aynen koru. Mümkünse ilk görseli sonraki sahnelerde karakter referansı olarak kullan.

### Gerçek kişiler ve güvenli temsil

Kitaplarda yazarlar, yöneticiler, sporcular veya kamuya mal olmuş kişiler geçebilir. Tanınabilir yüz taklidi üretme. Şunlardan birini kullan:

- arkadan veya omuz üstünden anonim kişi,
- yüzü kadraj dışında kalan eller ve çalışma masası,
- sembolik nesne veya mekân,
- döneme uygun fakat belirli kişiye benzemeyen karakter.

Kişinin adı anlatımda verilebilir; görselin o kişiyi birebir temsil ettiği iddia edilmez.

## 8. Sahne planı

Her sahne planında şu alanlar bulunmalıdır:

| Alan | Açıklama |
|---|---|
| Sahne | Sıra numarası |
| Süre | Başlangıç, bitiş ve toplam saniye |
| Amaç | Kanca, bağlam, çatışma, dönüş, ders veya CTA |
| Seslendirme | Bu sahnede duyulan cümleler |
| Altyazı | Ekranda görünen kısa metin |
| Görsel | Kadrajın özeti |
| Hareket | Yakınlaşma, kaydırma, parallax veya konu hareketi |
| Ses | Ortam, vurgu veya geçiş efekti |

Sahneleri yalnızca cümle bittiği için değiştirme. Yeni bilgi, yeni duygu veya yeni görsel metafor geldiğinde kes.

## 9. Ses ve müzik

Seslendirme daima en öndedir.

- Ses tonu: sakin, içten, düşünceli; reklam spikeri gibi değil.
- Ses üretim hızı: seçilen sesin doğal ayarı. Süre düzeltmesi gerekiyorsa perde korumalı `1.02–1.12×`, en fazla `1.15×` yerel tempo kullan.
- Müzik: düşük tempolu, sözsüz, merakı taşıyan minimal doku.
- Müzik seviyesi: konuşmanın yaklaşık 15–20 dB altında.
- Geçiş efektleri: yalnızca anlamlı dönüşlerde ve düşük seviyede.
- İlk 0,2 saniyeyi sessiz bırakma; kanca hemen başlasın.
- Son cümleden sonra 0,5–1 saniye nefes alanı bırak.

Telif durumu belirsiz müzik kullanma. Lisanslı kütüphane veya özgün üretim tercih et.

### Seedance ile ElevenLabs görev ayrımı

- Seedance: hareketli görüntü, oyunculuk, kamera, ışık ve gerekiyorsa ortam sesi.
- ElevenLabs: yalnız Türkçe anlatım.
- Yerel render: doğrulanmış Türkçe tipografi, altyazı, ses karışımı, kapak ve nihai dosya.

Seedance promptunda varsayılan negatif şart şudur: `No readable text, subtitles, dialogue, music, voiceover, logos or brands.` `--generate_audio true` yalnız yağmur, saat, oda tonu ve nefes gibi ortam sesleri için kullanılabilir. Üretilen ortam sesi, anlatımın altında yaklaşık yüzde 10–15 seviyesinde tutulur; anlatım seviyesi yüzde 100'dür.

Seedance aynı üretimde Türkçe ses ve yazı oluşturabilse de bu, yayın standardı değildir. Testlerde Türkçe yazım bozulabildiği ve ses kalitesi tutarsız olabildiği için tek sağlayıcılı çıktı yalnız taslak kabul edilir.

Seedance ücretli ve en yavaş aşamadır; şu dört değer kesinleşmeden başlatılmaz:

1. renderda kullanılacak nihai ses dosyası ve gerçek süresi,
2. nihai video süresi,
3. `.srt`/ASS altyazı zamanları,
4. çalışan yerel `ffmpeg` yolu ve final render planı.

### Higgsfield yükleme ve bekleme standardı

4–6 MB PNG referanslarını Seedance'e doğrudan vermek yükleme zaman aşımına yol açabilir. Onaylanan ana görselleri değiştirmeden, yalnız yükleme için `images/upload/` altında şu türevleri oluştur:

- 1080×1920 JPEG,
- yaklaşık kalite 85,
- tercihen 1 MB'tan küçük,
- aynı sahne sırası ve kadraj.

Her JPEG'i `higgsfield upload create` ile yalnız bir kez yükle. Dönen yükleme kimliklerini `generation-state.json` içinde sahne dosyasıyla eşleştir ve Seedance çağrısında yerel dosya yerine bu kimlikleri kullan. Başlangıç/bitiş görsellerini ve ara referansları aynı kayıttan yeniden kullan.

Video üretiminde tek bir `higgsfield generate create ... --wait` çağrısı kullan; ayrı create/poll döngüsü kurma. Bekleme komutu yanıt vermeden kesilirse bunun başarısızlık olduğunu varsayıp yeniden ücretli çağrı başlatma. Önce:

```bash
higgsfield generate list --video --size 3 --json
higgsfield account status
```

Yeni video işi görünüyorsa aynı işi bekle veya sonucunu indir. Yalnızca yeni iş yoksa ve kredi bakiyesi değişmediyse bir kez yeniden dene. Filtresiz `higgsfield generate list --json` kullanma; gereksiz uzun çıktı üretir ve sorunu teşhis etmeyi yavaşlatır. Mevcut `images/seedance-clean.mp4` girdiler değişmediyse tekrar Seedance çalıştırma.

### ElevenLabs seslendirme standardı

ElevenLabs yapılandırılmışsa, yerel macOS sesi yerine onu kullan. Anahtar yalnızca Git tarafından izlenmeyen `.env.local` dosyasında tutulur; hiçbir prompt, kaynak kodu veya mobil istemciye yazılmaz.

İlk kurulumda repo kökünde `.env.local.example` dosyasını `.env.local` olarak kopyala. Gerçek anahtarı yalnızca `.env.local` içine yaz:

```bash
cp .env.local.example .env.local
```

API anahtarı ElevenLabs yönetim panelinde oluşturulur. Anahtarda metinden sese üretim ve kullanım bilgisini okuma izinleri bulunmalıdır. Kelime düzeyinde senkron kullanılacaksa ayrıca `forced_alignment` izni açık olmalıdır. Varsayılan hizalama modu `local`dır; `ELEVENLABS_ALIGNMENT_MODE=forced` açıkça yazılmadıkça ücretli hizalama uç noktasını deneme. `401 missing_permissions` yanıtında aynı çağrıyı tekrarlama; yerel hizalamaya geç, eksik izni raporla ve üretime devam et. Anahtarı ekranda gösterme, loglama veya Git'e ekleme.

```env
ELEVENLABS_API_KEY=...
ELEVENLABS_VOICE_ID=...
ELEVENLABS_MODEL_ID=eleven_multilingual_v2
ELEVENLABS_ALIGNMENT_MODE=local
FFMPEG_BIN=ffmpeg
```

Ücretli üretimden önce yapılandırmayı ve otomatik ses seçimini `--dry-run` ile kontrol et. Bu komut API anahtarını kullanarak ses üretmez ve anahtarın kendisini yazdırmaz:

```bash
node --env-file=.env.local .agents/skills/create-video/scripts/create-voiceover.mjs \
  --project "PROJE_KLASÖRÜ" \
  --provider elevenlabs --dry-run
```

Çıktıda `apiKeyConfigured: true`, `voiceSelection`, `modelId` ve `outputPath` alanları görülmelidir. Ayrıntılı kurulum notları için [`docs/ELEVENLABS_SESLENDIRME.md`](ELEVENLABS_SESLENDIRME.md) dosyasına bak.

Ses kimliği elle sabitlenmez. `create-voiceover.mjs`, hikâyenin kitap kategorisini `.agents/skills/create-video/voice-library.json` içindeki `categoryMap` ile eşleştirip sekiz Türkçe ElevenLabs sesinden (Adam, Serhat, Deniz S., Kemal Ozgen, İrgi/John, Eyyup Okan, Feronia, Engin Daglı) uygun olanı otomatik seçer; eşleşme yoksa kütüphanenin varsayılan sesi (Eyyup Okan) kullanılır. `ELEVENLABS_VOICE_ID` yalnızca kütüphane okunamadığında son çare olarak devreye girer; belirli bir ses zorlanacaksa `--voice-id SES_KİMLİĞİ` kullan. Anahtarı ve ses kimliklerini yalnızca `.env.local` içinde tut; mobil uygulama kaynak koduna gömme. Kategori–ses eşlemesini değiştirmek için `voice-library.json` dosyasını güncelle.

Türkçe anlatımda varsayılan model `eleven_multilingual_v2` olmalıdır. Ses, tek tek cümleler yerine anlatım metninin tamamı olarak tek kayıtta üretilir. Onaylı proje için komut:

```bash
node --env-file=.env.local .agents/skills/create-video/scripts/create-voiceover.mjs --project "PROJE_KLASÖRÜ" --provider elevenlabs
```

Üretilen `audio/narration.mp3` dosyası otomatik olarak proje ve render planına kaydedilir. Betik, üretimden önce ve sonra ElevenLabs kullanım sayacını okuyup harcanan kredi miktarını raporlar; bu uç nokta kısıtlıysa metin karakteri üzerinden açıkça “tahmin” olarak bildirir. Onaylı metin ve ses dosyası değişmediyse TTS'yi yeniden üretme; yerel süre/senkron/render düzeltmelerinin ek ElevenLabs kredisi `0`dır.

Forced Alignment için ElevenLabs API anahtarında `forced_alignment` izni ve `.env.local` içinde `ELEVENLABS_ALIGNMENT_MODE=forced` ayarı birlikte bulunmalıdır. Süre uyarlaması tamamlandıktan sonra yalnız nihai ses dosyasında aşağıdaki komutu bir kez çalıştır; bu hizmet Speech-to-Text ile aynı fiyatlandırılır ve kullanım sonucu raporlanır:

```bash
node --env-file=.env.local .agents/skills/create-video/scripts/align-voiceover-elevenlabs.mjs --project "PROJE_KLASÖRÜ"
```

Çıktıdaki kelime zamanlarını `audio/forced-alignment.json` altında sakla ve `.srt` ile render katmanlarını buna göre güncelle. Mod `local` ise veya izin kapalıysa yeni ses üretme ve süreleri rastgele bölme; nihai ses dalgasındaki konuşma/duraklama noktalarından zamanlama çıkar, `local-waveform-estimate` olarak kaydet ve bunun yaklaşık olduğunu belirt.

Her ücretli ElevenLabs çağrısından önce ve sonra kullanım sayacını oku. Kullanıcıya TTS, Forced Alignment ve tekrar üretim maliyetlerini ayrı ayrı bildir. Mevcut sesi yalnızca yeniden render etmek kredi harcamaz; ses dosyası yeniden üretilirse yeni TTS kredisi oluşur.

## 10. Paylaşım metni

Instagram açıklaması videoyu kelimesi kelimesine tekrar etmemelidir. Şu yapı kullanılabilir:

1. Bir cümlelik farklı kanca.
2. İki veya üç kısa paragrafta ana içgörü.
3. Tek düşünme sorusu.
4. Doğal kaydetme veya paylaşma çağrısı.
5. Konuyla ilgili 3–6 hashtag.

Genel ve kalabalık hashtag listeleri yerine hikâyenin konusuna yakın etiketler kullan. Marka etiketi sabit olabilir: `#Kıvılcım` veya yayın hesabında kullanılan karşılığı.

## 11. İki aşamalı üretim ve onay

### Aşama A — Onay paketi

Bu aşamada oluştur:

- yaratıcı brief,
- seslendirme metni,
- sahne planı,
- görsel promptları,
- paylaşım metni,
- `.srt` altyazı,
- render planı,
- `story-reel` için 7–8, `short-rerender` için 4–5 sahne/referans görseli.

Bu aşamada oluşturma:

- nihai ses dosyası,
- görüntüden videoya sahne animasyonları,
- birleştirilmiş video,
- yayın veya dış sisteme yükleme.

Paket tamamlanınca kullanıcıya görünür bir özet sun ve açık onay iste.

Durum betiğinin kabul ettiği açık onay ifadeleri şunlardır:

- “Onaylıyorum”
- “Bu paketi onaylıyorum”
- “Taslağı onaylıyorum”
- “Videoyu oluştur”

Nokta veya ünlem gibi sondaki noktalama işaretleri kabul edilir. “Tamam”, “güzel” ve “devam” onay değildir.

### Aşama B — Onaylı video

Yalnızca açık onaydan sonra:

1. Onayı proje durumuna kaydet.
2. Veritabanı hash'ini ve bütün girdileri doğrula. Node, Higgsfield CLI, `.env.local` değişkenleri ve `FFMPEG_BIN`/`ffmpeg` yolunu ücretli çağrıdan önce kontrol et. Eksik yerel aracı TTS veya Seedance sonrasına bırakma.
3. Proje klasörünü tarayıp değişmemiş `narration`, hizalama, Higgsfield yükleme kimlikleri, `seedance-clean.mp4` ve final çıktıları yeniden kullan. Tamamlanmış adımı tekrar çalıştırma.
4. Türkçe seslendirmeyi bir kez üret ve gerçek süresini ölç.
5. Sessizlik kırpma → uzun durakları sıkıştırma → en fazla `1.15×` perde korumalı tempo → 12–20 saniye içinde video süresini uyarlama sırasını uygula. Metin değişecekse üretimi durdurup yeniden onay al.
6. Altyazıları süreye uydurulmuş nihai sesten çıkar. Forced Alignment yalnız açıkça etkinse denensin; izin yoksa tek seferde yerel yaklaşık hizalamaya düş.
7. Ses ve video süresi kesinleştikten sonra onaylı görselleri yükleme için küçük JPEG türevlerine çevir, bir kez yükle ve Seedance'i tek `--wait` çağrısıyla üret. Yanıtsız çağrıda yeni iş/kredi kontrolü yapmadan yeniden deneme.
8. İsteğe bağlı telif açısından güvenli müzik yatağını üret veya seç.
9. Ses, görüntü, isteğe bağlı müzik ve ASS/SRT tipografisini yerel olarak birleştir.
10. Teknik decode kontrolü ile kanca, her ara blok, kapanış, güvenli alan ve logoyu ayrı karelerde doğrula.
11. `final/reel.mp4`, `final/cover.jpg`, `.srt` ve üretim/kredi raporunu bırak.

Kullanıcı açısından Aşama B tek komuttur: “Videoyu oluştur.” Bu komut içeride gerekirse ses, hizalama ve render adımlarını ayrı çalıştırır; sonuçta kullanıcıya tek bir altyazılı ve sesli video, kapak görseli ve `.srt` dosyası verilir.

Onaydan sonra metin veya görsel içerik değişirse renderı durdur, proje durumunu taslağa çevir ve yeniden onay al. Brief'te onaylanmış teknik aralık içindeki süre uyarlaması yeni içerik onayı gerektirmez.

## 12. Çıktı klasörü sözleşmesi

Her çalışma şu yapıyı kullanır:

```text
artifacts/story-videos/<story-id>-<slug>/<run-id>/
├── project.json
├── source.json
├── STATUS.md
├── 01-yaratici-brief.md
├── 02-seslendirme.txt
├── 03-sahne-plani.md
├── 04-gorsel-promptlar.md
├── 05-paylasim-metni.md
├── 06-altyazilar.srt
├── 06-altyazilar.ass (gelişmiş tipografi varsa)
├── 07-render-plani.json
├── 08-uretim-raporu.md
├── generation-state.json (Higgsfield yükleme/üretim kimlikleri)
├── images/
│   ├── scene-01.png
│   ├── upload/scene-01.jpg
│   ├── seedance-clean.mp4
│   └── ...
├── audio/
│   ├── narration.mp3 (ElevenLabs) veya narration.aiff (macOS yedeği)
│   ├── narration-fit.mp3 (süre uyarlaması gerekiyorsa)
│   ├── local-alignment.json veya forced-alignment.json
│   └── music.wav (isteğe bağlı)
└── final/
    ├── reel.mp4
    ├── cover.jpg
    └── qc/
```

`artifacts/story-videos/` Git tarafından izlenmez. Kaynak koduna veya veritabanına video üretim çıktısı yazma.

## 13. Render planı şeması

`07-render-plani.json` aşağıdaki yapıyı kullanır:

```json
{
  "profile": "story-reel",
  "width": 1080,
  "height": 1920,
  "fps": 30,
  "targetDurationSeconds": 45,
  "voiceover": "audio/narration.mp3",
  "voiceoverDurationSeconds": 43.8,
  "voiceoverTempo": 1,
  "alignmentMode": "local-waveform-estimate",
  "music": null,
  "subtitles": "06-altyazilar.srt",
  "output": "final/reel.mp4",
  "coverScene": 1,
  "scenes": [
    {
      "image": "images/scene-01.png",
      "duration": 5.5,
      "motion": "slow_push_in"
    }
  ]
}
```

Toplam sahne süresi 35–55 saniye arasında olmalıdır. Her sahne 3–8 saniye sürmelidir. Varsayılan hareketler `slow_push_in`, `slow_pull_out`, `pan_left`, `pan_right` veya `static` değerlerinden biridir.

`short-rerender` için süre uydurulmuş ses ve temiz Seedance klibi açıkça kaydedilir:

```json
{
  "profile": "short-rerender",
  "width": 1080,
  "height": 1920,
  "fps": 30,
  "targetDurationSeconds": 15,
  "adaptiveDurationSeconds": { "min": 12, "max": 20 },
  "durationSeconds": 18,
  "sourceVideo": "images/seedance-clean.mp4",
  "voiceoverOriginal": "audio/narration.mp3",
  "voiceover": "audio/narration-fit.mp3",
  "voiceoverDurationSeconds": 17.3,
  "voiceoverTempo": 1.1,
  "alignmentMode": "local-waveform-estimate",
  "subtitles": "06-altyazilar.srt",
  "burnInSubtitles": "06-altyazilar.ass",
  "ambientSourceAudio": true,
  "ambientVolume": 0.12,
  "voiceoverVolume": 1,
  "output": "final/reel.mp4"
}
```

`durationSeconds`, nihai ses ölçülmeden önce sabitlenmez. `voiceoverTempo` `1.15` değerini aşamaz. `voiceoverOriginal` denetim ve kredi kaydı için korunur; render yalnız `voiceover` alanındaki nihai dosyayı kullanır.

## 14. Yayın öncesi kontrol listesi

- [ ] Hikâye adı ve `story_id` doğru.
- [ ] Metindeki her olgu `source.json` tarafından destekleniyor.
- [ ] Kanca ilk iki saniyede anlaşılıyor.
- [ ] Seslendirme doğal Türkçe; kelime sayısından bağımsız olarak hedef süreye uyuyor.
- [ ] `short-rerender` taslağı, ses ölçümü yoksa 22–26 kelimeyle ve 110 kelime/dakika güvenli tahminiyle hazırlandı.
- [ ] Ekran metinleri mobilde okunabilir.
- [ ] Görseller tutarlı; istenmeyen yazı, logo, filigran veya bozuk anatomi yok.
- [ ] Gerçek kişi tanınabilir biçimde taklit edilmemiş.
- [ ] Tek bir yansıma sorusu ve tek bir CTA var.
- [ ] Kullanıcının açık onayı kaydedilmiş.
- [ ] Node, Higgsfield, ElevenLabs ayarları ve `ffmpeg` yolu herhangi bir ücretli çağrıdan önce doğrulandı.
- [ ] `story-reel` videosu 1080 × 1920, H.264/AAC ve 35–55 saniye.
- [ ] `short-rerender` profilinde hedef 15 saniye; kullanıcı sabitlemediyse nihai süre 12–20 saniye ve gerçek anlatıma göre ayarlı.
- [ ] Baştaki/sondaki sessizlik kırpıldı; uzun duraklar kontrol edildi; tempo `1.15×` değerini aşmıyor.
- [ ] Altyazılar sesle uyumlu ve güvenli alanda.
- [ ] Altyazı zamanları storyboarddan değil, süreye uydurulmuş nihai sesten çıkarıldı; yerel hizalama kullanıldıysa `yaklaşık` olarak etiketlendi.
- [ ] Seedance, ses ve video süresi kesinleşmeden başlatılmadı; JPEG yükleme kimlikleri ve üretim kimliği yeniden kullanım için kaydedildi.
- [ ] Higgsfield yanıtsız kaldıysa yalnız son üç video işi ve kredi hareketi kontrol edildi; körlemesine ücretli tekrar yapılmadı.
- [ ] Kanca, ara bloklar, kapanış ve yazısız final ayrı karelerden görsel olarak kontrol edildi.
- [ ] ElevenLabs TTS ve hizalama kredileri ayrı raporlandı; mevcut sesle render yapıldıysa ek kredi `0` olarak belirtildi.
- [ ] Higgsfield görsel, Seedance video ve yerel render maliyetleri ayrı raporlandı; yeniden kullanılan adımlar `0 ek kredi` olarak belirtildi.
- [ ] Son karede sade marka imzası var.
- [ ] Nihai video baştan sona izlenmiş.

## 15. Doğrulanmış referans — story_id 1410

“Varsayımda bulunmamak — üçüncü anlaşma” videosu, kısa profil için doğrulanmış referanstır.

| Blok | Zaman | Ekran metni |
|---|---:|---|
| Kanca | 0,00–1,35 sn | `YA SANA` / `KIZGIN` / `DEĞİLSE?` |
| Ayna 1 | 1,36–3,18 sn | `Zihnin boşluğu hemen doldurur.` |
| Ayna 2 | 3,19–4,00 sn | `Bana kızgın.` |
| Ayna 3 | 4,01–5,28 sn | `Benden uzaklaşıyor.` |
| Dönüş | 5,29–7,48 sn | `Gerçek, bambaşka olabilir.` |
| Ders | 7,49–8,40 sn | `Varsayma.` |
| Son vurgu | 8,41–9,45 sn | `SOR.` |
| Görsel nefes | 9,45–15,00 sn | Yazı yok |

Bu örnekte ElevenLabs anlatımı 9,221 saniyedir. İlk TTS üretimi kullanım sayacına göre 69 kredi harcamış, mevcut sesle yapılan senkron düzeltmesi ve yeniden render ise 0 ek ElevenLabs kredisi kullanmıştır. Forced Alignment yetkisi kapalı olduğundan bloklar yerel ses dalgası/duraklama analiziyle ayarlanmıştır. 9,45–15,00 arasındaki uzun yazısız final bu videoya özgü bilinçli bir tercihtir; yeni kısa videolarda varsayılan boşluk değildir.

## 16. Son üretimden doğrulanan dersler — story_id 1534

“Havacılıktan öğrenmek” üretiminde yaşanan sorunlar aşağıdaki kalıcı kurallara dönüştürülmüştür:

| Gözlem | Kalıcı karar |
|---|---|
| 36 kelimelik metin seçilen ElevenLabs sesinde 19,879 sn sürdü. | Kelime sayısı tek başına süre ölçüsü değildir. TTS gerçek süresi Seedance'ten önce ölçülür; 15 sn hedefte 22–26 kelime ve 12,8–14,2 sn anlatım bütçesiyle başlanır. |
| Sesi 15 sn'ye sığdırmak için acil olarak `1.35×` tempo gerekti. | Yeni normal üst sınır `1.15×`tir. Daha büyük fark önce video süresini 20 sn'ye kadar uzatarak, bu da yetmezse metni kısaltıp yeniden onay alarak çözülür. |
| 4,5–5,5 MB PNG referansları doğrudan yüklenirken yanıt/yükleme hataları oluştu. | Ana PNG'ler korunur; Seedance için 1080×1920, kalite yaklaşık 85, 1 MB'tan küçük JPEG türevleri bir kez yüklenir ve yükleme kimlikleri saklanır. |
| Higgsfield komutunun yanıtsız kalması yeniden üretim riski yarattı. | Kör yeniden deneme yoktur. Önce `generate list --video --size 3 --json` ve kredi durumu kontrol edilir; yalnız iş oluşmamış ve kredi değişmemişse bir kez tekrar edilir. |
| `ffmpeg` eksikliği ücretli üretimlerden sonra fark edildi. | FFmpeg yolu ve final render kabiliyeti bütün ücretli çağrılardan önce doğrulanır. |
| Forced Alignment çağrısı izin olmadığı için `401` döndürdü. | Varsayılan mod `local`dır. Forced Alignment yalnız ortam ayarıyla açıkça etkinleştirilir; 401 sonrasında tekrar denenmeden yerel yaklaşık hizalamaya geçilir. |
| ASS güvenli alanı ilk renderda ayar gerektirdi. | Kanca üstten en az yüzde 12, gövde yazıları alttan en az yüzde 20 içeride tutulur; logo ve her metin geçişi ayrı QC karesinde kontrol edilir. Yerel yeniden render dış servis kredisi harcamaz. |

Bu üretimin maliyeti referans olarak ayrı kaydedilmiştir: storyboard görselleri 42 Higgsfield kredisi, Seedance 135 Higgsfield kredisi, ElevenLabs TTS 142 kredi; başarısız yetki kontrolü ve yerel yeniden render 0 ek kredi. Bu sayılar fiyat garantisi değil, gereksiz tekrarın maliyet etkisini gösteren geçmiş ölçümdür.

# İlk 20 Hikâye — Video Üretim Promptları

Bu dosya, puanı en yüksek ilk 20 hikâye için **Seedance 2.0** ile doğrudan video üretiminde kullanılacak promptları içerir. Varsayılan çıktı: **15 saniye, dikey 9:16, metaforik sinematik editoryal gerçekçilik**. Promptlar İngilizce verildi; seslendirme ve ekrana gelecek kısa metinler Türkçedir.

## Üretim akışı

1. Her bölümdeki `Seedance prompt` metnini sırayla video üretim aracına gönder.
2. Seedance ile temiz görüntü ve ortam sesi üret; Türkçe anlatımı veya okunabilir altyazıyı Seedance'e bırakma. Promptta `No readable text, subtitles, dialogue, music or voiceover` kullan. Ortam sesi isteniyorsa `--generate_audio true` açık kalabilir.
3. Türkçe anlatımı `eleven_multilingual_v2` modeli ve `.env.local` içindeki ElevenLabs sesiyle tek parça olarak üret. API anahtarını prompta veya komuta yazma.
4. Altyazı zamanlarını 15 saniyelik sahne planından tahmin etme. Önce nihai ses dosyasının gerçek süresini ölç; mümkünse ElevenLabs Forced Alignment, izin yoksa yerel ses dalgası/duraklama analizi kullan.
5. Ses ve zamanları doğrulandıktan sonra tipografiyi yerel render aşamasında videoya göm. Kullanıcı tek bir sesli ve altyazılı `reel.mp4` alır; üretim katmanlarının ayrı olması yalnızca kalite kontrol içindir.
6. Kancayı ilk karede başlat; onu orta-alt altyazı kutusuna koyma. İlk 2 saniyede üst-orta güvenli alanda 2–3 satırlık bir başlık düzeni kullan; yüklü kelime yüzde 35–45 daha büyük ve sıcak vurgu renginde olsun. Son ana ders merkezde iki aşamalı bir kilit görüntüye dönüşsün; son kelime en az 0,8 saniye tek başına görünsün. Ara caption beat’leri orta-alt güvenli alanda sade kalır.
7. Caption beat’lerini sesin cümle başlangıçlarıyla eşleşen kısa altyazı geçişleri olarak kullan. Anlatım videodan erken biterse yazıyı zorla son kareye uzatma; son sahneyi metinsiz nefes alanı olarak bırakabilirsin.
8. Dosya adını `01_1410_varsayimda_bulunmamak.mp4` biçiminde sakla.

> Bunlar doğrudan video promptlarıdır; önce görsel üretmek zorunlu değildir. Görsel üretimi yalnızca karakter/kompozisyon referansı gerektiğinde eklenebilir. Seedance 2.0 çok planlı hareketli videoyu doğrudan üretir.

> **Tek üretim uyarısı:** Seedance 2.0 ses kanalı ve ekranda yazı üretebilir; ancak Türkçe altyazının birebir yazımı garanti edilmez. 19 Temmuz 2026 tarihli ilk 1080p testte altyazı bozuk üretildi. Bu nedenle tek üretim çıktısı mutlaka kontrol edilmeli; yayın kalitesi için güvenilir varsayılan, Seedance videosuna doğrulanmış Türkçe seslendirme ve `.srt` altyazıyı otomatik olarak sonradan gömmektir.

## 1. Varsayımda bulunmamak — üçüncü anlaşma (ID 1410, 95/100)

**Seedance prompt — yazısız görüntü ve ortam sesi; Türkçe ses ile tipografi sonradan eklenir**

```text
15-second vertical 9:16 stylized cinematic editorial realism with the same anonymous fictional couple, navy and charcoal shadows, warm amber highlights, subtle film grain and symbolic surreal transitions. 0–2s: anxious eye reflected in three fractured mirror panels, immediate hook. 2–8s: in a dim apartment, one partner holds their temple while the other imagines rejection and becomes defensive. 8–12s: reveal migraine, not anger; the defensive partner pauses and approaches gently. 12–15s: they sit together as cold blue becomes warm amber. Smooth camera, restrained acting, consistent faces and clothing, clean negative space reserved for post-production typography. Soft rain, clock, room tone and breathing only. No readable text, subtitles, dialogue, music, voiceover, logos, brands, extra text or recognizable public figures.
```

**Seslendirme:** Ya sana kızgın değilse? Zihnin boşluğu hemen doldurur: Bana kızgın. Benden uzaklaşıyor. Oysa gerçek bambaşka olabilir. Varsayma. Sor.

**Metin tasarımı ve zamanlaması:**

- **0,00–1,35 sn — açılış afişi:** Üst-orta güvenli alanda, geniş koyu kutu olmadan üç satır: `YA SANA` / `KIZGIN` / `DEĞİLSE?`. `KIZGIN` diğer satırlardan yüzde 40 daha büyük, sıcak kehribar; diğerleri kırık beyaz. Hafif ölçeklenme ve kısa görünme animasyonu kullanılır.
- **1,36–7,48 sn — anlatım:** Orta-alt güvenli alanda temiz bloklar: `Zihnin boşluğu hemen doldurur.` (1,36–3,18) · `Bana kızgın.` (3,19–4,00) · `Benden uzaklaşıyor.` (4,01–5,28) · `Gerçek, bambaşka olabilir.` (5,29–7,48). Kırık beyaz yazı, yüzde 70'e yakın koyu panel; `Bana kızgın.` ve `olabilir.` sıcak kehribarla vurgulanır.
- **7,49–9,45 sn — kapanış kilidi:** Merkezde iki aşama: `Varsayma.` (7,49–8,40) ardından `SOR.` (8,41–9,45). `SOR.` geniş sıcak kehribar şerit üzerinde koyu yazıdır ve seslendirmedeki “Sor” ile aynı anda başlar.
- **9,45–15,00 sn — görsel nefes:** Yazı kapanır; çiftin yaklaşmasını ve ışığın ısınmasını gösteren temiz final sahnesi devam eder. 9,22 saniyelik anlatım yapay olarak yavaşlatılmaz ve altyazı 15. saniyeye zorla uzatılmaz.

**ElevenLabs ve senkron notu:** Seçilen Türkçe ses `.env.local` içindeki `ELEVENLABS_VOICE_ID=xtRkbnxYnwjKaWVz8eCm`, model `eleven_multilingual_v2` değeridir. Bu hikâyenin anlatımı 9,221 saniye sürdü ve ilk başarılı üretimde ElevenLabs kullanım sayacına göre 69 kredi harcandı. Sonraki altyazı düzeltmesi mevcut sesi tekrar kullandığı için 0 ek kredi harcadı. Forced Alignment izni kapalı olduğunda zamanlar ses dalgasındaki gerçek konuşma ve duraklama aralıklarından çıkarıldı; bu yöntem kelime düzeyinde Forced Alignment kadar kesin kabul edilmez.

**Higgsfield CLI**

```bash
higgsfield generate create seedance_2_0 \
  --prompt '15-second vertical 9:16 stylized cinematic editorial realism with the same anonymous fictional couple, navy and charcoal shadows, warm amber highlights, subtle film grain and symbolic surreal transitions. 0–2s: anxious eye reflected in three fractured mirror panels, immediate hook. 2–8s: in a dim apartment, one partner holds their temple while the other imagines rejection and becomes defensive. 8–12s: reveal migraine, not anger; the defensive partner pauses and approaches gently. 12–15s: they sit together as cold blue becomes warm amber. Smooth camera, restrained acting, consistent faces and clothing, clean negative space reserved for post-production typography. Soft rain, clock, room tone and breathing only. No readable text, subtitles, dialogue, music, voiceover, logos, brands, extra text or recognizable public figures.' \
  --duration 15 \
  --aspect_ratio 9:16 \
  --resolution 1080p \
  --mode std \
  --bitrate_mode high \
  --genre drama \
  --generate_audio true \
  --wait \
  --wait-timeout 20m
```

## 2. Havacılıktan öğrenmek — başarı kültürü vs öğrenme kültürü (ID 1534, 94/100)

```text
15-second vertical 9:16 historical cinematic realism. Hook: two passenger-aircraft landing lights converge through dense runway fog and cut to black before contact. Suggest the 1977 Tenerife collision with rain, silhouettes and sudden darkness, without impact or injury. Show an orange flight recorder under an inspection lamp as anonymous investigators examine failures together. Transition to a bright modern hangar where a crew openly reviews a near miss; end with an aircraft lifting safely into sunrise. Respectful archival-to-warm color transition. No readable text, screens, logos, airline branding or public figures. Rain, turbines, recorder clicks and paper sounds only; no music, dialogue or voiceover.
```

**Seslendirme:** Havacılık felaketi saklamak yerine hataları incelemeyi seçti. Kara kutunun gücü yalnız kayıt değil, öğrenmektir. Hata gizlenirse ders de kaybolur.

**Caption beat’leri:** Hata saklanmadı · Kara kutu öğrenmek içindi · Gizlenen hata tekrarlanır.

## 3. Columbia uzay mekiği ve sessizlik bedeli (ID 1483, 93/100)

```text
15-second vertical 9:16 cinematic space-drama realism. Hook: a pale insulation fragment silently strikes a shuttle wing in extreme slow motion during launch. Anonymous engineers study indistinct imagery; one raises a hand but is ignored. A distant shuttle enters glowing atmosphere and disappears behind cloud; cut to an empty mission-control chair and untouched headset. Restrained, respectful, no destruction, bodies or injury. No readable text, insignia, logos or real people. Launch rumble, ventilation, pencil taps and radio static only; no music, dialogue or voiceover.
```

**Seslendirme:** Bir işaret vardı ama endişe yeterince duyulmadı. Psikolojik güvenlik, kritik gerçeği geç kalmadan söyleyebilme özgürlüğüdür.

**Caption beat’leri:** Bir işaret vardı · Endişe duyulmadı · Sessizlik riski büyütür.

## 4. Huffington’ın çöküşü (ID 1339, 92/100)

```text
15-second vertical 9:16 cinematic realism with an anonymous digital-media founder. Hook: coffee cup tips toward camera as the exhausted founder slumps beside a glowing laptop. Show several cold-blue nights, repeated coffee and deteriorating focus. The founder closes the laptop, leaves the phone outside the bedroom, sleeps, and wakes in warm sunrise light. No injury, blood, readable text, logos or public figures. Keyboard, cup, room tone, birds and morning breeze only; no music, dialogue or voiceover.
```

**Seslendirme:** Başarı büyürken uykusu dört-beş saate düşmüştü. Yorgunluğu övmek verimlilik değil; kararları, yaratıcılığı ve sağlığı tüketen bir yanılgıdır.

**Caption beat’leri:** Başarı mı, tükeniş mi? · Dört-beş saat uyku · Yorgunluk madalya değil.

## 5. FBI rehine müzakeresi (ID 1369, 92/100)

```text
15-second vertical 9:16 tense cinematic realism with anonymous characters. Hook: red telephone rings in a dark negotiation room; an agent’s hand freezes above it. Through frosted glass, a distressed silhouette paces. The negotiator stops pushing offers, listens, matches breathing and names the emotion through calm posture. The silhouette stops pacing; the locked door indicator changes and tension eases. No weapons, violence, text, insignia, logos or public figures. Telephone, footsteps, breathing and lock sounds only; no music, dialogue or voiceover.
```

**Seslendirme:** Taktiksel empati: Duyguyu fark et, adını koy, anlaşıldığını hissettir. Gerçek müzakere savunma duvarı düşünce başlar.

**Caption beat’leri:** Mantık neden yetmedi? · Önce duyguyu gör · Anlaşılmak kapıyı açar.

## 6. Phantom limb — hayalet uzuv (ID 1456, 92/100)

```text
15-second vertical 9:16 respectful medical realism. Hook: one real hand beside a mirror box creates the illusion of two moving hands. An anonymous adult with an empty sleeve watches in disbelief. The healthy hand opens and closes; the reflection appears to free the absent hand as tension eases. Abstract neural pathways reorganize, then the patient breathes calmly beside a therapist. No wounds, readable text, medical logos or public figures. Room tone, hand movement, mirror slide and breathing only; no music, dialogue or voiceover.
```

**Seslendirme:** Beyin kayıp uzvun hareket ettiğini algıladı ve ağrı azaldı. Beyin gerçeği yalnızca görmez; onu sürekli yeniden kurar.

**Caption beat’leri:** Kol yoktu, ağrı vardı · Bir ayna beyni kandırdı · Beyin gerçeği kurar.

## 7. Değişim istemek ile değişmek istemek (ID 1430, 92/100)

```text
15-second vertical 9:16 cinematic psychological realism with restrained surrealism. Hook: therapy client remains fixed while the room and outside world slide and change around them. The client gestures for partner, job and city to change. Therapist turns a full-length mirror toward them; the room becomes still. The reflection steps forward and the client follows. Warm neutral light, smooth dolly, natural acting. No readable text, logos or public figures. Room tone, city noise, breathing and one footstep only; no music, dialogue or voiceover.
```

**Seslendirme:** Her şey değişsin istiyordu; kendisi aynı kalsın. Değişmek, tanıdık hikâyeni bırakıp aynaya bakmayı gerektirir.

**Caption beat’leri:** Her şey değişsin · Ama ben aynı kalayım · Hazır mısın?

## 8. Mevzisel müzakere tuzağı (ID 1504, 92/100)

```text
15-second vertical 9:16 cinematic realism, warm domestic lighting. Hook: one orange pulled in opposite directions by two pairs of hands. A neutral hand cuts it in half. One person squeezes juice; the other needs the peel. Reveal the better solution: juice flows into one glass while peel ribbons fall into the other bowl. End with relieved hands sharing the workspace. Tactile macro realism, no readable text, logos or public figures. Knife, peel, juice and glass sounds only; no dialogue or music.
```

**Seslendirme:** Pozisyonu değil, ihtiyacın nedenini sorarsan bazen herkes kazanır.

**Caption beat’leri:** Aynı portakal, iki talep · Sorun pozisyonlardaydı · “Neden?” herkesi kazandırabilir.

## 9. Basit bir kontrol listesi kaç hayat kurtarabilir? (ID 1701, 91/100)

```text
15-second vertical 9:16 clinical realism, no surgery shown. Hook: marker hovers over one unchecked icon-only box as a monitor beeps. Gloved hands pause; the team confirms identity, equipment and instrument count with gestures and eye contact. Final count is completed around a safely covered patient; waveform stays steady. No blood, injury, readable text, logos or public figures. Monitor, paper, gloves and instrument sounds only; no dialogue or music.
```

**Seslendirme:** Karmaşık işlerde hafıza yetmez; kritik adımları görünür kıl.

**Caption beat’leri:** Küçük adım, büyük sonuç · 19 maddelik kontrol · Hafızaya değil, sisteme güven.

## 10. Uyku ve yaratıcı problem çözme (ID 1472, 91/100)

```text
15-second vertical 9:16 mysterious 1920s cinematic realism. Hook: sleeping scientist opens his eyes and reaches for a pencil in darkness. He scribbles a blurred idea, cannot understand it in morning, then wakes again and runs to a dim laboratory. Glass vessels and abstract chemical ripples match-cut to neural connections forming during sleep. No readable text, logos or real-person likeness. Pencil, clock, footsteps, glass and dawn birds only; no dialogue, music or voiceover.
```

**Seslendirme:** Uyku bazen dinlenmekten fazlasıdır; beyin uzak fikirleri sessizce birleştirir.

**Caption beat’leri:** Fikir gece geldi · Notlar okunamadı · Beyin uyurken bağ kurar.

## 11. Moore Yasası ve bileşik büyüme (ID 1547, 91/100)

```text
15-second vertical 9:16 cinematic macro realism. Hook: one wheat grain lands on a chessboard and becomes two, then four. Grains double across the board until they overflow; an anonymous royal hand freezes in realization. Match-cut the grid to a microchip circuit where points of light multiply rapidly. Gold shifts to electric blue. No readable text, numbers, logos or public figures. Grain taps and electronic pulses only; no dialogue or music.
```

**Seslendirme:** Bileşik büyüme önce sessiz görünür, sonra hızlanır. Geleceği doğrusal değil, üstel düşünerek anlamak gerekir.

**Caption beat’leri:** Bir taneyle başlar · Her karede iki kat · Üstel büyümeyi gör.

## 12. İtfaiyecinin ölümcül sezgisi (ID 1161, 91/100)

```text
15-second vertical 9:16 tense firefighter realism. Hook: commander freezes in a smoke-hazed room before an unnaturally quiet flame. Heat distortion is visible on the visor; he signals evacuation. The team retreats in formation. Outside, a low rumble reveals the interior floor collapsing after they escape. No injury or graphic destruction, text, logos or public figures. Breathing, gear, siren, crackling and rumble only; no dialogue or music.
```

**Seslendirme:** Uzman sezgisi, yılların sıkıştırılmış deneyimidir.

**Caption beat’leri:** Bir şey yanlıştı · Sessizlik + aşırı sıcak · Sezgi, kodlanmış deneyim.

## 13. Hazinenin geri dönüşü (ID 1205, 91/100)

```text
15-second vertical 9:16 poetic cinematic realism. Hook: shovel strikes empty sand beneath distant pyramids. An anonymous shepherd finds nothing; wind erases the hole. Match-cut blowing sand to leaves beneath a fig tree beside a weathered Spanish chapel. Back under the tree, the shovel reaches a small wooden chest; he pauses, realizing the journey led home. Golden-hour realism, no readable text, logos or public figures. Wind, shovel, leaves and wooden knock only; no dialogue or music.
```

**Seslendirme:** Hazine evindeydi; onu tanıyabilmesi için önce yolculuğun kendisini değiştirmesi gerekiyordu.

**Caption beat’leri:** Hazine uzakta mıydı? · Yol onu değiştirdi · Cevap başladığı yerdeydi.

## 14. Harvard’ın 85 yıllık mutluluk araştırması (ID 1219, 91/100)

```text
15-second vertical 9:16 emotionally warm cinematic realism. Hook: clasped young hands match-cut into the same hands aged by decades. Follow an anonymous participant through youth, adulthood and old age while neutral researchers conduct interviews. Career objects pass in the background; relationships remain central. End with elderly friends or family sharing a kitchen table and warm eye contact. No readable text, university emblems, logos or public figures. Clock, paper, cups and laughter only; no dialogue or music.
```

**Seslendirme:** En değerli yatırım bazen başarıya değil, yanında kalan insanlara ayırdığın zamandır.

**Caption beat’leri:** 85 yıl, aynı soru · Cevap: kaliteli ilişkiler · Zamanını kime veriyorsun?

## 15. H.M.’nin sonsuz şimdisi (ID 1118, 91/100)

```text
15-second vertical 9:16 cinematic realism, cool 1950s hospital palette. Hook: fictional patient reaches for a handshake; whip-pan loops to the same handshake again as if meeting the researcher for the first time. Repeat the testing room across changing daylight and seasons while objects reset. End on a blank road reflected in his eyes, visualizing memory as a bridge to the future. Respectful, no surgery, text, logos or recognizable people. Clock, chair and room sounds only; no narration in generated video.
```

**Seslendirme:** Yeni anılar oluşmadı. Hafıza yalnız geçmişi saklamaz; geleceği hayal etmek için de temeldir.

**Caption beat’leri:** Her gün yeniden tanıştı · Yeni anılar oluşmadı · Geçmiş, geleceği kurar.

## 16. 24 reçel neden 6 reçelden daha az sattı? (ID 1720, 90/100)

```text
15-second vertical 9:16 cinematic social video, vivid supermarket colors. Hook: snap-zoom onto a table packed with 24 unlabeled jam jars; shoppers stop but freeze indecisively. Match-cut to a clean table with six jars; one shopper quickly samples, chooses and places a jar in a basket. Overhead contrast shows attention versus decisive action. No readable labels, numbers, text, logos or public figures. Store rustle, footsteps, basket and glass sounds only; no dialogue or music.
```

**Seslendirme:** Daha fazla seçenek dikkat çeker; karar vermeyi ise zorlaştırabilir.

**Caption beat’leri:** 24 seçenek: daha çok ilgi · 6 seçenek: daha çok karar · Bolluk özgürlük mü?

## 17. Aslandan kaçan zebra (ID 1788, 90/100)

```text
15-second vertical 9:16 cinematic Serengeti realism. Hook: zebra eye reflects a distant lion, then explosive tracking through tall grass; the zebra remains unharmed. Lion stops, hoofbeats slow and zebra returns to grazing. Match-cut to a person safe at a desk at night, shoulders tense beside a vibrating phone and unopened envelope. No attack, injury, readable text, logos or public figures. Hoofbeats, breathing, grass, phone vibration and room hum only; no dialogue or music.
```

**Seslendirme:** Tehlike geçtiğinde zebra normale döner; insan ise kapanmayan alarmı saatlerce açık tutabilir.

**Caption beat’leri:** Tehlike geçti · Beden hâlâ alarmda · Kafandaki aslan ne?

## 18. Seabiscuit büyük buhran’a nasıl umut oldu? (ID 1694, 90/100)

```text
15-second vertical 9:16 historical cinematic realism, 1930s atmosphere. Hook: undersized racehorse bursts from the gate but falls behind. Show patient training at dawn with an anonymous team. At the 1938 match race, the small horse surges ahead of the favored rival; cut to an emotionally cheering Depression-era crowd and vibrating vintage radio. No injury, readable text, logos or public figures. Hoofbeats, gate clang, radio static and crowd swell only; no dialogue or music.
```

**Seslendirme:** İlk 17 yarışını kaybetti; doğru ekip vazgeçmedi. Küçük at, Büyük Buhran’ın ortasında büyük umut oldu.

**Caption beat’leri:** İlk 17 yarış: yenilgi · Doğru ekip vazgeçmedi · Küçük at, büyük umut.

## 19. Hazine hep başladığın yerde (ID 1284, 90/100)

```text
15-second vertical 9:16 grounded magical realism. Hook: shovel strikes bare stone beneath pyramids; a fictional traveler stares into an empty hole. A stranger gestures and a fast transition carries him across desert, sea and countryside to an abandoned Spanish chapel with a fig tree. He digs under the roots and uncovers treasure, then looks back toward the road with quiet understanding. No readable text, logos, subtitles or public figures. Wind, shovel, footsteps, birds and chest latch only; no dialogue or music.
```

**Seslendirme:** Hazine hep oradaydı; onu görebilmesi için önce yolculuğu yapması gerekiyordu.

**Caption beat’leri:** Hazine uzakta sandı · Başladığı yere döndü · Yolculuk gözünü açtı.

## 20. Hindinin yanlış öğrenimi (ID 1303, 90/100)

```text
15-second vertical 9:16 cinematic parable, rustic farm realism. Hook: identical full feed bowls snap into place morning after morning before a curious turkey. The turkey approaches familiar boots as the routine repeats and a visual pattern grows. On a different morning the barn door opens, light turns cold and the expected bowl never appears; cut to an empty field before any harm. Turkey remains unharmed. No text, logos or public figures. Farm ambience, grain, footsteps and sudden quiet only; no dialogue or music.
```

**Seslendirme:** Geçmişin düzeni, geleceğin garantisi değildir.

**Caption beat’leri:** Her gün aynı kanıt · Güven çizgisi yükseldi · Sonra düzen bozuldu.

## Seslendirme ve üretim notu

Seedance promptlarında özellikle “no dialogue or voiceover” ifadesi görsel üretimin temiz kalması içindir. Türkçe anlatımı ElevenLabs ile, doğrulanmış altyazıyı yerel render ile sonradan eklemek yayın standardıdır.

Tek hikâye için önerilen çağrı:

```text
/create-video "HİKÂYE ADI"
```

İlk çağrı anlatım, sahne, prompt, altyazı ve görsel taslağını hazırlar; render başlatmaz. Kullanıcı açıkça `Videoyu oluştur` dediğinde onay kaydedilir, Seedance görüntüsü, ElevenLabs sesi ve doğrulanmış tipografi birleştirilir. Revizyon istenirse eski onay geçersiz olur ve düzeltilmiş paket yeniden onaya sunulur.

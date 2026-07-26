---
name: create-video
description: Spark veritabanındaki bir hikâye adını veya story_id değerini kullanarak Türkçe, 9:16 Instagram Reels üretim paketi hazırla; ilk aşamada anlatım metni, altyazı, sahne planı, görsel promptları ve sahne görsellerini üret; yalnızca kullanıcının açık onayından sonra seslendirme ile nihai videoyu birleştir. Kullanıcı `$create-video "hikâye adı"`, `/create-video hikâye adı`, “bu hikâyeden video oluştur” veya benzeri bir istek verdiğinde kullan. Veritabanını değiştirmek ya da onay almadan video render etmek için kullanma.
---

# Hikâyeden Instagram Videosu

Spark hikâyelerini tutarlı, Türkçe ve onay kapılı Instagram Reels paketlerine dönüştür.

## Çağırma biçimi

Tercih edilen açık çağrı:

```text
$create-video "Ertelemenin gerçek kökü: korku"
```

`/create-video ...` ifadesini de aynı niyeti belirten doğal dil girdisi olarak kabul et. Hikâye adı veya `story_id` yoksa yalnızca bunu sor.

## Başlamadan önce

1. Repo kökündeki `docs/INSTAGRAM_VIDEO_REHBERI.md` dosyasını tamamen oku ve tüm üretim kararlarında uygula.
2. `assets/kivilcim.db` dosyasını tek kaynak kabul et; hiçbir aşamada veritabanını değiştirme.
3. Kullanıcı aksini açıkça istemedikçe dili `tr` ve formatı `9:16` kullan. Standart hikâye anlatımında `story-reel` profiliyle 40–50 saniye; ilk 20 prompt, mevcut kısa video veya açık kısa Reels isteğinde `short-rerender` profiliyle varsayılan 15 saniye kullan. Kısa profil için kullanıcı süreyi sabitlemediyse teknik uyarlama aralığı 12–20 saniyedir.
4. Her çalışmayı `artifacts/story-videos/` altında ayrı bir proje klasörüne yaz; önceki çalışmanın üzerine yazma.

## Değiştirilemez onay kapısı

- İlk çağrıda yalnızca Aşama A'yı tamamla ve dur.
- Aşama A tamamlanınca proje durumunu `ONAY_BEKLIYOR` yap, dosya ve görselleri kullanıcıya özetle, ardından açık onay iste.
- “Onaylıyorum”, “Bu paketi onaylıyorum” veya “Videoyu oluştur” gibi açık bir kullanıcı mesajı olmadan seslendirme, animasyon, birleştirme veya render başlatma.
- “Tamam”, “güzel”, “devam” veya sessizliği onay sayma; açık onay iste.
- Kullanıcı metin veya görsel revizyonu isterse durumu yeniden `HAZIRLANIYOR` yap, yalnızca istenen parçaları düzelt ve tekrar onay iste.
- Onaydan sonra seslendirme metni, görsel içerik veya ana mesaj değişirse eski onayı geçersiz say ve tekrar onay al. Onay paketinde açıkça yazılan süre aralığında yapılan sessizlik kırpma, duraklama sıkıştırma, en fazla `1.15×` tempo düzeltmesi ve video süresi uyarlaması içerik değişikliği sayılmaz.

## Aşama A — Metinleri ve görselleri hazırla

1. Hikâyeyi çözümle ve proje klasörünü oluştur:

   ```bash
   node .agents/skills/create-video/scripts/prepare-story-video.mjs --title "HİKÂYE ADI" --lang tr --profile "PROFİL"
   ```

   `PROFİL` yerine yukarıdaki kurala göre `story-reel` veya `short-rerender` yaz. `story_id` verilmişse `--story-id ID` kullan. Eşleşme belirsizse betiğin gösterdiği adayları kullanıcıya sun; seçim yapılmadan üretme. Betik kısa profilde hedef 15 saniyeyi, 12–20 saniyelik teknik aralığı ve 5 referans sahnesini proje kaydına otomatik ekler.

2. Betiğin döndürdüğü proje klasöründe şu dosyaları oluştur:

   - `01-yaratici-brief.md`
   - `02-seslendirme.txt`
   - `03-sahne-plani.md`
   - `04-gorsel-promptlar.md`
   - `05-paylasim-metni.md`
   - `06-altyazilar.srt`
   - `07-render-plani.json`

3. Hikâyenin olgu, kişi, neden-sonuç ve ana dersini `source.json` ile karşılaştır. Kaynakta olmayan alıntı, sayı, unvan veya olay ekleme. Veritabanı işaretlerini (`##`, `$$`, `&&`, `~~`, `::`) anlatım metnine taşıma; anlamlarını rehberdeki işleve dönüştür.
4. İlk iki saniyede merak veya özdeşleşme yaratan tek cümlelik kanca kullan. Kancayı sıradan altyazı gibi verme: üst-orta güvenli alanda 2–3 kısa satıra böl; en yüklü sözcüğü yaklaşık yüzde 35–45 daha büyük ve sıcak vurgu rengiyle göster. Son ana ders de son 1,5–2 saniyede merkezde iki satırlı bir kilit görüntü olarak gelsin; son kelime en az 0,8 saniye tek başına ekranda kalsın. Ara altyazıları daha sakin, 3–7 kelimelik bloklar halinde tut. Anlatımı suçlama yerine farkındalık diliyle kur. Sonu bir düşünme sorusu ve tek bir doğal paylaşma/kaydetme çağrısıyla bitir.

   `short-rerender` metnini seçilecek sesin son ölçülmüş hızına göre bütçele. Ölçüm yoksa güvenli başlangıç olarak `110 kelime/dakika` ve 22–26 kelime kullan; 15 saniyelik videoda nihai anlatım hedefi 12,8–14,2 saniyedir. `01-yaratici-brief.md` içine hedef süreyi, izin verilen 12–20 saniyelik teknik aralığı ve azami `1.15×` tempo düzeltmesini yaz. Kullanıcı tam 15 saniye isterse bu aralığı kullanma.
5. `story-reel` için tercihen 7–8, `short-rerender` için 4–5 dikey görsel üret. Dosyaları `images/scene-01.png` biçiminde sırala; araç yalnızca JPEG veya WebP veriyorsa gerçek uzantıyı render planına yaz. Kullanılabilir ortamda görüntü üretme aracını kullan; Higgsfield kullanılabiliyorsa genel görsellerde GPT Image 2'yi, karakter tutarlılığı gereken sahnelerde referans destekli modeli tercih et. Görsellerin içine yazı, altyazı, logo veya filigran üretme.
6. Gerçek kişileri taklit eden tanınabilir yüzler üretme. Gerçek kişi geçen hikâyelerde anonim, sembolik veya arkadan görünen bir karakter kullan; adı anlatım ve altyazıda doğru biçimde ver.
7. Taslağı doğrula:

   ```bash
   node .agents/skills/create-video/scripts/validate-video-package.mjs --project "PROJE_KLASÖRÜ" --phase draft
   ```

8. Doğrulama geçince durumu değiştir:

   ```bash
   node .agents/skills/create-video/scripts/set-project-status.mjs --project "PROJE_KLASÖRÜ" --status ONAY_BEKLIYOR
   ```

9. Kullanıcıya kancayı, seslendirme metnini, sahne listesini, görselleri ve paylaşım metnini göster. “Bu taslak paketini onaylıyor musunuz?” diye sor ve dur.

## Aşama B — Yalnızca açık onaydan sonra videoyu oluştur

1. Güncel kullanıcı mesajında açık onay bulunduğunu doğrula. Birden fazla bekleyen proje varsa hangisinin onaylandığını sor.
2. Onayı kaydet:

   ```bash
   node .agents/skills/create-video/scripts/set-project-status.mjs --project "PROJE_KLASÖRÜ" --status ONAYLANDI --approval "KULLANICININ ONAY MESAJI"
   ```

3. Ücretli çağrı yapmadan önce tek seferlik ön kontrol uygula:

   - `project.json` içindeki veritabanı SHA-256 değerini güncel `assets/kivilcim.db` ile karşılaştır. Kaynak değişmişse hikâyeyi yeniden çözümle ve onayı yenile.
   - Node, Higgsfield CLI ve `FFMPEG_BIN` ile gösterilen ya da `PATH` içinde bulunan `ffmpeg` çalıştırılabilir mi kontrol et. `ffmpeg` yoksa TTS veya Seedance üretmeden önce dur ve kurulum için izin iste.
   - `.env.local` içinde yalnız gerekli değişkenlerin varlığını kontrol et; değerleri loglama. Ses seçimini `create-voiceover.mjs --dry-run` ile doğrula.
   - Projede değişmemiş ses, hizalama, Higgsfield yükleme kimliği, kaynak video veya final varsa yeniden üretme. İşlem kaldığı yerden devam etmeli; mevcut dosyanın üzerine ancak açık `--force` gerekçesiyle yazılmalıdır.

4. Türkçe seslendirmeyi bir kez üret. `ELEVENLABS_API_KEY` yapılandırılmışsa ElevenLabs birincil sağlayıcıdır; aksi hâlde macOS yerel sesi yalnızca yedektir. ElevenLabs çağrısında anahtarı komuta yazma; dosyayı Node ile yükle. Onaylı ve değişmemiş bir `audio/narration.mp3` zaten varsa mevcut sesi kullan ve ek TTS kredisini `0` olarak bildir.

   ```bash
   node --env-file=.env.local .agents/skills/create-video/scripts/create-voiceover.mjs --project "PROJE_KLASÖRÜ" --provider elevenlabs
   ```

   Ses kimliğini elle vermeye gerek yok: `--voice-id` verilmezse betik, hikâyenin kitap kategorisini (`source.json` → `story.book.category`) `.agents/skills/create-video/voice-library.json` içindeki `categoryMap` ile eşleştirip uygun sesi otomatik seçer; eşleşme yoksa kütüphanenin `defaultVoiceId` değerini, o da yoksa `.env.local` içindeki `ELEVENLABS_VOICE_ID` değerini kullanır. Farklı bir ses zorlanacaksa `--voice-id SES_KİMLİĞİ` ekle. Ayrıntılar için aşağıdaki "Ses kütüphanesi ve otomatik seçim" bölümüne bak.

5. Seedance üretmeden önce sesin gerçek süresini ölç ve aşağıdaki süre kapısını tamamla. Kelime sayısını veya storyboard zamanlarını gerçek ses süresinin yerine kullanma.

   1. Baştaki ve sondaki sessizliği kırp.
   2. `250 ms` üzerindeki iç durakları, kelime ve nefesleri kesmeden yaklaşık `120–180 ms` aralığına indir.
   3. Hâlâ uzunsa perdeyi koruyarak önce `1.02–1.12×`, zorunlu durumda en fazla `1.15×` hızlandır.
   4. Hâlâ hedefi aşıyorsa kısa videoyu `tavan(ses süresi + 0,6 sn)` hesabıyla en fazla 20 saniyeye uzat. Seedance klibi 15 saniyeyse son 2–3 saniyeyi yerel yavaş yakınlaşma/son kare tutma ile; daha uzun farkı onaylı bir final görselini yerel canlandırarak tamamla. İkinci ücretli Seedance üretimini varsayılan çözüm yapma.
   5. Doğal ses 20 saniyeye de sığmıyorsa seslendirme metnini kısalt, projeyi yeniden `ONAY_BEKLIYOR` yap ve yeni TTS'den önce onay al.

   Ses kısa kalırsa sesi yavaşlatma. En fazla 1–2 saniye yazısız görsel nefes bırak; daha büyük boşlukta videoyu kısalt veya metni onay aşamasında güçlendir. Nihai ses yolunu, gerçek süreyi ve uygulanan işlemleri render planına kaydet.

6. Altyazı hizalamasını yalnız nihai, süreye uydurulmuş ses üzerinden çıkar. `.env.local` içindeki `ELEVENLABS_ALIGNMENT_MODE` değeri açıkça `forced` değilse yerel dalga formu/duraklama analizini kullan ve sonucu `yaklaşık` olarak etiketle. `forced` seçilmişse aşağıdaki komutu bir kez çalıştır; `401 missing_permissions` gelirse aynı çağrıyı tekrarlama, modu yerel hizalamaya düşür ve rendera devam et.

   ```bash
   node --env-file=.env.local .agents/skills/create-video/scripts/align-voiceover-elevenlabs.mjs --project "PROJE_KLASÖRÜ"
   ```

   `audio/forced-alignment.json` sonucundaki zamanlara göre `06-altyazilar.srt` ve render katmanlarını güncelle. Her altyazının başlangıcı, sesli cümlenin başlangıcıyla eşleşmeli; kapanış kelimesi ses kesildikten sonra en az 0,8 saniye görünür kalabilir.

7. Ses süresi, video süresi ve altyazı zamanları kesinleştikten sonra Seedance üret. Onaylanan ana görselleri değiştirme; yükleme için `images/upload/` altında 1080×1920, yaklaşık kalite 85 ve tercihen 1 MB'tan küçük JPEG türevleri oluştur. Büyük PNG dosyalarını doğrudan tekrar tekrar yükleme. JPEG'leri bir kez yükle, dönen yükleme kimliklerini proje içindeki `generation-state.json` dosyasına kaydet ve üretimde bu kimlikleri kullan.

   Tek bir `higgsfield generate create ... --wait` çağrısı kullan; elle create/poll döngüsü kurma. Komut yanıt vermeden kesilirse körlemesine yeniden üretme. Önce yalnız son video işlerini `higgsfield generate list --video --size 3 --json` ile, ardından krediyi `higgsfield account status` ile kontrol et. Yeni iş varsa onu bekle/indir. Yalnızca yeni iş yoksa ve kredi değişmediyse bir kez yeniden dene. Filtresiz uzun `generate list --json` çağrısı kullanma.

   Seedance temiz görüntü ve yalnız ortam sesi üretmelidir; okunabilir metin, altyazı, diyalog, müzik veya seslendirme isteme. Türkçe ses ElevenLabs'ten, tipografi yerel render aşamasından gelir.
8. İstenirse telif açısından güvenli, sözsüz bir müzik yatağı üret veya seç; `audio/music.wav` ya da `audio/music.m4a` olarak kaydet ve render planındaki `music` alanına yaz. Müzik yoksa alanı `null` bırak.
9. Ön kontrolde doğrulanmış `ffmpeg` ile videoyu birleştir:

   ```bash
   node .agents/skills/create-video/scripts/render-story-video.mjs --project "PROJE_KLASÖRÜ"
   ```

10. Son çıktıyı görsel ve teknik olarak doğrula: `1080×1920`, H.264/AAC, ses anlaşılır, altyazı güvenli alanda, profil süresi doğru ve bozuk kare yok. `story-reel` için 35–55 saniye; `short-rerender` için hedef 15, izin verilen uyarlanabilir aralık 12–20 saniyedir. Kanca, bütün ara bloklar, kapanış kelimesi ve yazısız finalden ayrı kareler çıkar; ardından videoyu baştan sona decode ederek hata olmadığını doğrula.
11. Nihai dosyayı `final/reel.mp4`, kapak karesini `final/cover.jpg` olarak bırak. Durumu `TAMAMLANDI` yap; kullanıcıya video, kapak ve `.srt` bağlantılarıyla birlikte TTS, hizalama, Higgsfield ve yerel yeniden render kredi kullanımını ayrı ayrı bildir. Yeniden kullanılan adımları `0 ek kredi` olarak açıkça yaz.

## Ses kütüphanesi ve otomatik seçim

`.agents/skills/create-video/voice-library.json` dosyası 8 Türkçe ElevenLabs sesini ve hikâyenin kitap kategorisine göre hangi sesin kullanılacağını belirleyen bir `categoryMap` tutar. `create-voiceover.mjs`, `--voice-id` verilmediği sürece bu dosyayı otomatik okur; elle ses kimliği belirtmeye gerek yoktur.

| Ses | Kimlik | Ton | Öncelikli kategoriler |
|---|---|---|---|
| Adam | `17lijyP1BHYcM7ld0Rg` | Derin, profesyonel, ciddi | Strateji, Finans, Yönetim, Müzakere, Güvenlik, İş Dünyası, Satış, Liderlik, Verimlilik |
| Serhat | `vhKOmda0rMxo3o60S4G5` | Samimi, dürüst, sıcak | İlişkiler, Mutluluk, İletişim, Topluluk, Toplum |
| Deniz S. | `UpM1SC0tOQ73AkE88QP4` | Bariton, İstanbul aksanlı, yayın kalitesi | Teknoloji, Bilim, Nörobilim, Ürün, Tasarım, Öğrenme |
| Kemal Ozgen | `vaEnYHWYjRyVpJdI8PJT` | Doğal, kendinden emin, otantik | Sosyoloji, Kariyer, Girişimcilik, Güncel, Gelecek, Değişim |
| İrgi (John) | `84vR5lT8vWD68RuPLWmO` | Derin, sakin, yumuşak | Farkındalık, Düşünme, Kişisel Gelişim, Bağımlılık, Sağlık, Psikoloji |
| Eyyup Okan | `sqN4QwtcnanCCWx6TTYj` | Dinamik, otantik, çok yönlü | İlham, Yaratıcılık, Yazarlık, Alışkanlıklar, Büyüme — **kütüphane varsayılanı** |
| Feronia | `i8Jufpy1xhR8l79QgGse` | Enerjik, coşkulu, yüksek tempo | Motivasyon, Başarı, Pazarlama, Hedefler, Dayanıklılık |
| Engin Daglı | `d4mBiAx6EANE3h8cZN5a` | Zengin bariton, dikşiyonlu, duygusal derinlik | Tarih, Felsefe, Duygular |

Seçim sırası: `--voice-id` (elle zorlama) → kategori eşleşmesi (`categoryMap`) → kütüphane varsayılanı (`defaultVoiceId`, Eyyup Okan) → `.env.local` içindeki `ELEVENLABS_VOICE_ID`. `create-voiceover.mjs --dry-run` çıktısındaki `voiceSelection` alanı hangi sesin, hangi gerekçeyle (`kategori-eslesmesi`, `kutuphane-varsayilani`, `ortam-degiskeni` veya `komut-satiri-parametresi`) seçildiğini gösterir; kullanıcıya seslendirme özetiyle birlikte bildir. Kategori eşlemesini değiştirmek için yalnızca `voice-library.json` dosyasını güncelle; kaynak kodu veya mobil istemciyi değiştirme.

## Dahil edilen betikler

- `scripts/prepare-story-video.mjs`: Hikâyeyi güvenli biçimde bulur; `--profile` değerine göre süre/sahne hedeflerini yazar ve yeni proje klasörü oluşturur.
- `scripts/validate-video-package.mjs`: Taslak dosyaları, görselleri, süreyi ve onay durumunu kontrol eder.
- `scripts/set-project-status.mjs`: İzin verilen durum geçişlerini ve açık onayı kalıcı kaydeder.
- `voice-library.json`: Türkçe ElevenLabs seslerinin kataloğu ve kitap kategorisine göre otomatik ses seçim eşlemesi (`categoryMap`).
- `scripts/create-voiceover.mjs`: Onaylı metinden ElevenLabs ile `audio/narration.mp3` üretir; sesi `voice-library.json` üzerinden hikâye kategorisine göre otomatik seçer; anahtar yoksa macOS Türkçe sesiyle `audio/narration.aiff` yedek üretir.
- `scripts/align-voiceover-elevenlabs.mjs`: Mevcut ElevenLabs sesini metne göre kelime düzeyinde zamanlar; `forced_alignment` izni gerektirir.
- `scripts/render-story-video.mjs`: `story-reel` sahne görsellerini veya `short-rerender` içindeki `sourceVideo` + ASS/SRT katmanlarını `FFMPEG_BIN`/`ffmpeg` ile birleştirir; kısa klip gerektiğinde son kareyi yerel olarak uzatabilir.

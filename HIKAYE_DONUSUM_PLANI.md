# Hikâye Dönüşüm Planı — Podcast Formatı (P1)

Durum: **Onaylandı, uygulanıyor** · Tarih: 2026-09-23 (son güncelleme: 2026-09-24) · Dal: `feature/story-p1-format`
Referans denemeler: `PODCAST_FORMAT_DENEME_1731.md`, `PODCAST_FORMAT_DENEME_1707.md`
Ek plan: `SOHBETTE_KULLAN_ENTEGRASYON_PLANI.md` — hikâye sonu `[[use]]` kartları ile
"Sohbette kullan" ekranının ilişkisi, context etiketleri, `conversation_variants`
yeniden yazımı. 1707 ve 1731'de uygulandı; aşağıdaki §3.2, §5 ve §6 bu kararı
yansıtacak şekilde güncellendi.

---

## 1. Bugünkü durum (koddan tespit)

### Uygulama hikâyeleri nereden çekiyor?
`src/context/StoriesContext.js` şu sırayla çalışıyor:

1. **AsyncStorage önbelleği** (`@kivilcim_stories_cache_<lang>`). Varsa ve süresi geçmiş olsa bile ilk olarak bu gösteriliyor.
2. **Yerel SQLite** (`assets/kivilcim.db`, uygulamayla birlikte paketleniyor, `DB_VERSION = 22`).
3. **Supabase** (`fetchStoriesFromSupabase`). İnternet varsa arka planda çekiliyor ve aynı `story_id`'li yerel hikâyelerin **üzerine yazıyor**. Sonuç tekrar AsyncStorage'a kaydediliyor.

Hikâye detayı (`getStoryByLang`) zaten SQLite'tan geliyor. Ama liste Supabase'den geldiği için ekranda Supabase içeriği görünüyor.

### Veri hacmi
| Dil | Kayıt | Ortalama uzunluk |
|---|---:|---:|
| tr | 770 | ~160 kelime (~1,2 dk okuma) |
| en / es / de | 750'şer | benzer |
| **Toplam** | **3.020 dil kaydı**, 278 kitap | |

### Mevcut işaretleme sistemi
| İşaret | Anlamı | Ekranda |
|---|---|---|
| `##…##` | Öne çıkan cümle | Sol çizgili alıntı kutusu |
| `$$…$$` | Ders | "Ders" kartı (sadece F7+/C/OH sürümlerinde) |
| `&&…&&` | Düşünme sorusu | Tıklanabilir kutu → "Sohbette kullan" ekranı |
| `~~a::b~~` | Önce / sonra karşıtlığı | İki sütun |

Parser `StoryDetailScreen.js` içinde satır içi yazılmış (~satır 2427). Aynı işaretleri ayrıca `ShareCardModal.js`, `UseInConversationScreen.js` ve sesli okuma (TTS) temizleyicisi de kendi kopyalarıyla ayrıştırıyor. **Kalın yazı, başlık ve madde işareti desteği yok.**

### Tespit edilen sorunlar
- 29 Türkçe hikâyede (story_id 1703–1732) jenerik dolgu paragrafları var; 15'inde aynı paragraflar 3 kez veya daha fazla tekrar ediyor.
- 42 hikâyenin paketlenmiş MP3 seslendirmesi var (`seslendirmeler/`). Metin değişince bu kayıtlar eski metinle uyuşmayacak.

---

## 2. Kararlar (onayınıza sunulan)

| # | Karar | Öneri |
|---|---|---|
| K1 | "Local" kaynak ne olsun? | **Paketlenmiş SQLite (`assets/kivilcim.db`)** tek kaynak olsun. Supabase'den hikâye çekme bir bayrakla kapatılsın (`EXPO_PUBLIC_STORIES_SOURCE=local`, varsayılan). AsyncStorage önbelleği temizlensin, yoksa eski Supabase metni ilk açılışta görünmeye devam eder. |
| K2 | Diller nasıl üretilsin? | **Çeviri yok.** Her hikâye için önce dilden bağımsız bir **içerik özeti** çıkarılır (kitaptaki olaylar, isim/tarih/sayılar, 2–3 dersin fikri, kullanım durumları, cebe konacak cümlenin fikri). Olaylar bu özet üzerinde bir kez kontrol edilir. Sonra TR, EN, ES ve DE metinleri **bu özetten, her biri kendi dilinde sıfırdan** yazılır. Hiçbir dil başka bir dilin metnini görmez. Böylece olaylar dört dilde aynı kalır, ama metin çeviri gibi durmaz. |
| K2a | Dil sırası (2026-09-23 kararı) | **İlk pazar global, ilk dil İngilizce.** 1. aşamada sadece içerik özeti + EN metin yazılır (750 hikâye, Batch API ile ~90 $). TR, ES ve DE daha sonra aynı özetlerden yazılır; özetler bir kez hazırlandığı için tekrar maliyeti olmaz. Pilot da EN yapılır. |
| K2b | Hitap | TR: "siz" · EN: "you" · ES: "tú", bölgesel kalıplardan kaçınan tarafsız İspanyolca · DE: "du" (Almanca uygulama ve podcast dilinde yaygın) |
| K3 | Kitaba sadakat | Kitaplar elimizde değil; metin modelin kitap bilgisine dayanıyor. Her hikâyeye **güven seviyesi** (yüksek/orta/düşük) verilsin. "Düşük" olanlar otomatik yayına girmesin, inceleme listesine düşsün. **Kitapta olmayan detay uydurulmaz.** |
| K4 | Kavram hikâyeleri | Bazı kayıtlar anekdot değil kavram ("mTOR ve AMPK", "Bütçe — paranın patronu olmak"). Bunlarda "Hikâye" bölümü, kitabın o kavram için verdiği örnek/vaka olsun. Kitapta böyle bir vaka yoksa uydurulmasın, kavram net anlatılsın ve hikâye "kavram" diye etiketlensin. |
| K5 | Okuma süresi | ~160 kelimeden ~800–1.000 kelimeye (4–6 dk) çıkıyor. **1 dakikalık özet** hızlı mod olarak kalsın ve üstte gösterilsin. Liste kartlarındaki süre (`current_read_minutes`) güncellensin. |
| K6 | MP3 seslendirmeler | Bu 42 kayıt P1'e geçince mevcut MP3'ler devre dışı kalsın (TTS'e düşsün). Yeniden seslendirme ayrı iş olarak ele alınsın. |
| K7 | Pilot | Önce **20 hikâye** (4 dil) dönüştürülüp cihazda gösterilsin. Onayınızdan sonra kalanlar yapılsın. |

---

## 3. P1 yazım formatı (metin işaretleri)

Kurallar: Mevcut 4 işaret **aynen korunuyor** (paylaşım ve "Sohbette kullan" ekranı bozulmasın diye). Bölüm başlıkları metne yazılmıyor, **dilden bağımsız bölüm etiketiyle** gösteriliyor. Başlık metni `i18n.js`'ten dört dilde geliyor. Böylece çeviride başlıklar kaymıyor ve tasarım tek yerden değişiyor.

### 3.1 Bölüm etiketleri (satır başında, tek başına)
| Etiket | Ekranda başlık (tr) | Zorunlu |
|---|---|---|
| `[[open]]` | *(başlık yok, giriş paragrafı italik)* | ✔ |
| `[[story]]` | Hikâye | ✔ |
| `[[lessons]]` | Bu hikâyeden ne çıkarıyoruz? | ✔ |
| `[[reflect]]` | Şimdi size dönelim | ✔ |
| `[[use]]` | Bu hikâyeyi nerede kullanabilirsiniz? | ✔ |
| `[[pocket]]` | Cebinize koyun | ✔ |

### 3.2 Blok işaretleri
| İşaret | Anlamı | Ekranda |
|---|---|---|
| `$$**Başlık.** Açıklama$$` | Ders (lessons bölümünde 2–3 tane) | Numaralı ders kartı: kalın başlık, sol renk çizgisi, "Kaydet" düğmesi (mevcut) |
| `- metin` | Madde | Madde işaretli satır |
| `> metin` | Hikâye içindeki doğrudan alıntı/replik | Girintili, italik, ince sol çizgi |
| `%%context:<durum> \| Durum :: "Söylenecek cümle"%%` | Kullanım senaryosu (use bölümünde **tam 3 tane**, her biri farklı bir `context` ile) | Kart: üstte kalın durum etiketi, altta tırnaklı cümle, **"Prova et →"** düğmesi → o `context` ile "Sohbette kullan" ekranını açar |
| `@@cümle@@` | Cebinize koyun cümlesi (tek) | Büyük punto, **sol kalın çizgi + alt çizgi**, paylaş düğmesi |
| `&&soru&&` | Ana düşünme sorusu (reflect bölümünün sonunda, tek) | Mevcut tıklanabilir kutu → Sohbette kullan |
| `##cümle##` | Hikâye içinde öne çıkan an (en fazla 1) | Mevcut alıntı kutusu |
| `~~a :: b~~` | Önce/sonra karşıtlığı (isteğe bağlı) | Mevcut iki sütun |

`context` değeri şu 5 değerden biri olmalı: `meeting`, `oneonone`, `family`,
`social`, `self` (Storyteller modundaki durum seçenekleriyle birebir aynı).
Üç kart en az 2 farklı `context` kullanmalı; "kendime" (`self`) bir kart zaten
`[[reflect]]`in kapanış sorusuyla örtüşür, o yüzden zorunlu değil. Ayrıntılar
ve gerekçe: `SOHBETTE_KULLAN_ENTEGRASYON_PLANI.md` §A.

### 3.3 Satır içi
| İşaret | Anlamı |
|---|---|
| `**metin**` | Kalın (paragraf içinde en fazla 1–2 yer; not alınacak kavramlar) |
| `*metin*` | İtalik (kitap adı, iç ses, vurgulu kısa ifade). iOS için gerçek italik fontlar (Inter *_Italic) App.js'te yükleniyor. |

### 3.4 Örnek (kısaltılmış)
```
[[open]]
Bugün size bu hafta sinir olduğunuz birini düşündürerek başlayacağım…

[[story]]
Bir pazar sabahı New York'ta metrodadır. Vagon sakin…
> Ah, haklısınız. Hastaneden geliyoruz. Anneleri yaklaşık bir saat önce öldü.
##Çocuklar hâlâ bağırıyordu; değişen sadece Covey'in baktığı yerdi.##

[[lessons]]
$$**Gördüğümüz davranış değil, taktığımız gözlük.** Covey aynı çocuklara bakıyordu…$$
$$**Vagondaki herkes aynı hikâyeyi yazmıştı, kimse sormamıştı.** …$$
$$**Bu, "kimseye bir şey söyleme" hikâyesi değil.** …$$

[[reflect]]
Başta düşündüğünüz o kişiye geri dönün.
- Onun hakkında kafanızda hangi hikâyeyi yazdınız?
- O hikâyenin ne kadarını gerçekten biliyorsunuz?
&&Siz hiç o vagondaki baba oldunuz mu?&&

[[use]]
%%context:meeting | Toplantıda, biri teslim tarihini kaçırdığında :: "Bir hüküm vermeden önce konuşalım; belki bilmediğimiz bir şey vardır."%%
%%context:oneonone | Birebir görüşmede :: "Son zamanlarda seni biraz farklı görüyorum. Her şey yolunda mı?"%%
%%context:family | Evde, biri size sert çıktığında :: "Bugün bir şey mi oldu?"%%

[[pocket]]
@@Vagonda değişen çocuklar değildi; Covey'in baktığı yerdi.@@
```

Aynı yazım isteminde, `.md` dosyasıyla birlikte küçük bir `.variants.json` da
üretilir — "Sohbette kullan" ekranındaki 4 formatın (Tek cümle / 30 saniye /
Soru / Karşıtlık) metni. Aynı özetten geldiği için olaylar tutarlı kalır, ama
`[[pocket]]`/`[[reflect]]` cümleleriyle birebir aynı olmaması istenir:

```json
{
  "punchline": "Bir cümle, tek başına — hikâyenin en keskin çıkarımı.",
  "thirty_sec": "Hikâyenin 30 saniyelik, kendi başına anlaşılan özeti.",
  "question": "Sohbeti açacak tek soru.",
  "key_contrast": "İki-üç kelimelik önce/sonra etiketi."
}
```

### 3.5 Bölüm uzunlukları (TR)
| Bölüm | Kelime |
|---|---|
| open | 40–70 |
| story | 350–500 |
| lessons | 2–3 ders, toplam 150–220 |
| reflect | 3–4 madde + 1 `&&` soru, 70–120 |
| use | 3–4 senaryo, 100–160 |
| pocket | 1 cümle, ≤ 20 kelime |

Yasak: hikâyeye atıf yapmayan jenerik cümleler ("mekanik bir reçete değildir", "tek vaka kanıt değildir" vb.; tam liste doğrulayıcıda), aynı paragrafın tekrarı, kitapta olmayan isim/tarih/sayı.

---

## 4. Kod değişiklikleri

| # | Dosya | Değişiklik |
|---|---|---|
| C1 | **yeni** `src/utils/storyMarkup.js` | Tek parser: `parseStoryMarkup(text, {version})` → `[{type, section, content, …}]`. Yardımcılar: `toPlainText()` (TTS/paylaşım), `extractShareParts()` (quote/lesson/reflection/pocket). Eski sürümlerde bugünkü davranışı birebir korur. |
| C2 | **yeni** `src/utils/__tests__/storyMarkup.test.js` | İşaret eşleşmesi, iç içe kalın, eksik kapanış, eski sürüm uyumu, iki örnek hikâyenin tam ayrıştırılması. |
| C3 | **yeni** `src/components/story/StoryBody.js` | Segment → bileşen eşlemesi: `SectionHeading`, `LessonCard` (numaralı), `BulletItem`, `QuoteLine`, `UseCaseCard` (kopyala), `PocketCard` (sol + alt çizgi, paylaş), mevcut highlight/reflection/contrast. Tema token'ları ve `categoryTheme` kullanılır; font boyutu ayarı korunur. |
| C4 | `StoryDetailScreen.js` | ~200 satırlık satır içi parser çıkarılıp `<StoryBody>` konur. `richFormat` koşuluna `P1` eklenir. TTS ve paylaşım metni `toPlainText()`'ten gelir. |
| C5 | `ShareCardModal.js`, `UseInConversationScreen.js` | Kendi `extractContent`/`cleanBodyText` kopyaları yerine `storyMarkup` yardımcıları. Pocket cümlesi paylaşımda "alıntı" seçeneği olur. |
| C6 | `i18n.js` | 6 bölüm başlığı + "Kopyala/Kopyalandı" metni, 4 dilde (locale parity testi geçmeli). |
| C7 | `StoriesContext.js` + `featureFlags.js` | `storiesSource: 'local'` bayrağı: Supabase çekme atlanır, önbellek okunmaz. |
| C8 | `db.js` | `DB_VERSION` 22 → 23 (yeni DB kopyalansın); açılışta eski hikâye önbelleği bir kez temizlenir. |
| C9 | `storyAudio.js` | P1 sürümlü hikâyelerde paketli MP3 kullanılmaz (K6). |
| C10 | `storyMarkup.js`, `StoryBody.js`, `StoryDetailScreen.js` | ✅ Yapıldı (2026-09-24). `%%` kartları `context:<durum> \|` etiketini ayrıştırıyor (`splitUseCase` → `{context,label,line}`). Kart düğmesi "Kopyala"dan **"Prova et →"**'a döndü; basınca `onTryUseCase(seg)` ile "Sohbette kullan"a `initialContext` göndererek yönlendiriyor. |
| C11 | `UseInConversationScreen.js` | ✅ Yapıldı. Hikâyeden `initialContext` ile gelince üstte "◀ Hikâyeye dön · <durum>" rozeti çıkıyor; context'e göre en uygun format (Tek cümle/30sn/Soru) otomatik seçiliyor. Durum etiketleri mevcut Storyteller `mv_storyteller_context_*` anahtarlarını kullanıyor. |
| C12 | `i18n.js` | ✅ Yapıldı. `useCaseTry`, `convoBackToStory`, `convoContextTitle/Subtitle`, `convoContextSelf` eklendi (4 dilde, parity testi geçti). |
| C13 | `db.js` | ✅ Yapıldı. `DB_VERSION` 23 → 24. |

---

## 5. Veri dönüşüm hattı

Tüm çıktı önce dosyaya yazılır, DB'ye en son ve toplu yazılır.

```
staging/p1/
  manifest.json          # story_id, kitap, tür (anekdot/kavram), durum, güven
  brief/<story_id>.json  # dilden bağımsız içerik özeti (olaylar + fikirler +
                          # use_cases[].context + conversation_variants fikirleri)
  tr|en|es|de/<story_id>.md            # her dilde ayrı yazılmış P1 metni
  tr|en|es|de/<story_id>.variants.json # "Sohbette kullan" metinleri — .md ile AYNI istemde üretilir
  review/<story_id>.md   # güveni düşük / doğrulayıcıdan geçemeyenler
```

`brief/<story_id>.json`'a iki alan eklendi (2026-09-24, `SOHBETTE_KULLAN_ENTEGRASYON_PLANI.md`
kararı): `use_cases[]` öğelerine `context` (`meeting|oneonone|family|social|self`),
ve ayrı bir `conversation_variants` bloğu — `{punchline_idea, thirty_sec_idea,
question_idea, key_contrast_idea}`. Böylece hikâye metni ile "Sohbette kullan"
metni aynı olaylardan, ama yine her biri kendi çerçevesinden yazılıyor.

| Adım | İş | Araç |
|---|---|---|
| V1 | Envanter: 770 hikâye için kitap, yazar, mevcut metin, anekdot/kavram sınıfı → `manifest.json` | `scripts/p1/build-manifest.mjs` |
| V2 | İçerik özeti: 10'arlı partiler; her hikâye için kitap bilgisi + mevcut metin → `brief/<id>.json` (olay akışı, doğrulanabilir detaylar, dersler, kullanım durumları, güven notu) | Opus 5.5 |
| V3 | Bağımsız denetim **özet üzerinde**: yazandan ayrı bir oturum; olay/isim/tarihleri kitap bilgisine göre kontrol eder. Olaylar dört dilde tek kaynaktan geldiği için denetim bir kez yapılır. "Düşük" güven → `review/` → Fable 5.1 ikinci görüş | Opus 5.5 / Fable 5.1 |
| V4 | Her dilde yerli yazım: TR, EN, ES, DE ayrı ayrı yazılır. Girdi sadece özet + o dilin yazım kılavuzu. Kullanım senaryoları o ülkenin iş ve sohbet kültürüne göre uyarlanır; her biri bir `context` etiketiyle. "Cebinize koyun" cümlesi o dilde söylenişi doğal bir vecize olarak yazılır. **Aynı istemde**, aynı çağrıda `<id>.variants.json` (Sohbette kullan metinleri) de üretilir — ayrı bir çağrı yapmak brief+talimatları ikinci kez yükletir, hikâye başına ~1,5–2,5k token boşa gider (2026-09-24 kararı, bkz. §6). | Opus 5.5 |
| V5 | Doğrulayıcı (dil başına): bölümler, işaretler, kelime aralıkları, tekrar + **dile özel "yapay zekâ kokusu" listesi**. Örnekler: EN'de "delve", "tapestry", "in today's fast-paced world", "it's not just X, it's Y" kalıbı, aşırı uzun tire kullanımı. TR'de "unutmayın ki", "günümüz dünyasında". DE ve ES için benzer listeler. Özetteki olayın metinde eksiksiz geçip geçmediği de kontrol edilir. `[[use]]`'de tam 3 kart ve her birinde geçerli `context:` etiketi zorunlu (2026-09-24). | `scripts/p1/validate.mjs` |
| V5b | Doğallık kontrolü: ayrı bir model geçişi metni o dilin anadil editörü gözüyle okur, çeviri gibi ya da yapay duran cümleleri işaretler, işaretlenenler yeniden yazılır. Pilotta her dilden 5 hikâyeyi mümkünse gerçek bir anadil okuru da okur. | Sonnet 5 |
| V6 | DB'ye yazma: yedek al → `story_translations.content` güncelle, `stories.version='P1'`, okuma süresi ve kelime sayısı güncelle; `<id>.variants.json` varsa `story_conversation_variants`'ı da aynı işlemde upsert eder (2026-09-24) | `scripts/p1/apply-to-db.mjs` |
| V7 | Cihaz kontrolü: pilot hikâyeler iOS/Android'de açık ve koyu temada, farklı font boyutlarında | Siz + ekran görüntüleri |
| V8 | **En son** Supabase: `stories` tablosuna aynı içerik upsert edilir (dil başına), sayım karşılaştırılır | `scripts/p1/push-supabase.mjs` |

Sıra: **C1–C9 kod → 2 örnek hikâye (1731, 1707) ile ekran testi → 20 hikâyelik pilot → onay → kalan özetler → 4 dilde yazım → DB → Supabase.**

---

## 6. Token tahmini

Hikâye başına (4 dil):

| Kalem | Girdi | Çıktı | Toplam |
|---|---:|---:|---:|
| İçerik özeti (kurallar + mevcut metin + kitap bağlamı) | ~5k | ~3k | ~8k |
| Bağımsız denetim (özet üzerinde, bir kez) | ~4k | ~1k | ~5k |
| 4 dilde yerli yazım (her biri: özet + dil kılavuzu ~4k girdi, ~3k metin + ~2k düşünme) | ~16k | ~20k | ~36k |
| Doğallık kontrolü (4 dil) | ~14k | ~2k | ~16k |
| Yeniden deneme / düzeltme payı (%15) | | | ~9k |
| **Toplam** | | | **~70–75k** |

| Kapsam | Yaklaşık token |
|---|---:|
| Pilot (20 hikâye × 4 dil) | ~1,5M |
| Özet + denetim (770) | ~10M |
| Yerli yazım (770 TR + 750 × 3) | ~28M |
| Doğallık kontrolü | ~12M |
| **Tamamı** | **~50–55M** (bunun ~20M'u çıktı) |

Çeviri yaklaşımına göre toplam token yaklaşık 20M artıyor. Bunun karşılığında her dil kendi dilinde yazılmış oluyor ve olay kontrolü tek yerde yapılıyor.

**2026-09-24 kararı — "Sohbette kullan" metinleri ayrı çağrı yerine aynı pasta:**
`conversation_variants` (punchline/30sn/soru/karşıtlık) her dilde ayrı bir
üretim çağrısıyla yazılsaydı, brief + yazım talimatları o çağrının girdisine
tekrar yüklenirdi (~1,5–2,5k token/hikâye/dil fazladan girdi → 750 EN hikâyede
toplam ~1–1,5M token, Batch'te birkaç dolar). Bunun yerine `.md` ile aynı
istemde, aynı çağrıda üretiliyor: brief zaten context'te yüklü olduğu için ek
maliyet sadece ~150–250 token/hikâye çıktı. Yukarıdaki "4 dilde yerli yazım"
satırındaki ~36k/hikâye tahmine bu ek çıktı zaten dahil, ayrı bir kalem
gerekmiyor.

Not: Bu oturumda ~15M token alanı var. Tamamı tek oturuma sığmıyor; iş partilere bölünüp birkaç oturumda yürütülmeli (her oturum ~150–200 hikâyenin TR yazımı veya çevirisi). Alternatif olarak aynı promptlar bir betikle Anthropic API'nin Batch modunda çalıştırılabilir (standart fiyatın yarısı, API anahtarı gerekir). Dolar karşılığı seçilen modele göre değişir.

---

## 7. Riskler

| Risk | Önlem |
|---|---|
| Metin çeviri gibi ya da yapay zekâ yazmış gibi durabilir | Her dil özetten ayrı yazılır; dile özel yasaklı kalıp listesi + doğallık kontrolü + pilotta anadil okuru |
| Kitaba sadakat ("birebir") modelin hafızasına bağlı | Güven etiketi, bağımsız denetim, düşük güven → insan incelemesi; uydurma detay yasağı doğrulayıcıda |
| 5–6 dakikalık metin "mikro öğrenme" vaadini zayıflatabilir | 1 dk özet üstte kalır; bölümler başlıklarla taranabilir |
| Eski önbellek / Supabase eski metni gösterir | C7 + C8 (bayrak + önbellek temizliği + DB sürümü) |
| Paylaşım/sohbet ekranları yeni işaretleri ham gösterir | C5: tüm tüketiciler tek parser'a bağlanır, testle korunur |
| Video/karusel hattı (`artifacts/story-videos`) eski `content`'i kullanıyor | P1 içerikten `toPlainText()` ile beslenir; ayrı iş olarak güncellenir |
| MP3 uyumsuzluğu | C9 |

---

## 8. Onaydan sonra ilk adımlar
1. Git'te `feature/story-p1-format` dalı açılır, DB yedeği alınır.
2. C1–C3 + testler yazılır; 1731 ve 1707 P1 formatına çevrilip yerel DB'ye yazılır.
3. Uygulamada iki hikâyenin ekran görüntüleri size gönderilir → tasarım onayı.
4. 20 hikâyelik pilot.

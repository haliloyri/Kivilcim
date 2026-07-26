# Üretim Kuralları

Bu dosya `MyStories/HIKAYE_URETIM_TASK.md`'nin makine tarafından uygulanan
özetidir. Çelişki olursa HIKAYE_URETIM_TASK.md bağlayıcıdır.

## 1. Süre ve uzunluk

| Süre | Hedef | Kabul aralığı | `##` sayısı |
|---:|---:|---|---:|
| 1 dk | 160 ±40 | 120–200 | 1–2 |
| 3 dk | 475 ±75 | 400–550 | 1–2 |
| 5 dk | 800 ±100 | 700–900 | 2–3 |

- Ölçüm yalnızca `content` üzerinde; başlık ve açıklama sayılmaz.
- İşaret karakterleri (`##`, `$$`, `&&`) kelime sayımına girmez.
- Yeni hikâyede `current_read_minutes == possible_read_minutes`.
- Süre yalnızca `1`, `3` veya `5` olabilir.

## 2. İşaretler

`content` içinde bulunması gerekenler:

- `##…##` — çarpıcı sonuç / dönüm noktası. Alıntılanabilir, ortamda söylenebilir cümle.
- `$$…$$` — genellenebilir ana ders. **Tam 1 adet.**
- `&&…&&` — sohbet açan düşünme sorusu. **Tam 1 adet**, soru işaretiyle biter.

Kurallar:

- İşaretler metnin sonuna yığılmaz. 5 dk hikâyede `##` blokları metin içinde dağılır.
- `$$` ders cümlesi ayrı bir slogan gibi kopuk durmaz; önceki paragrafın anlamını toplar.
- Metnin tek özel formatlı bölümü soru olamaz.
- Her blok paylaş kartında tek başına okunabilir olmalı (bkz. `batch-semasi.md`).

## 3. Sohbet varyantları

| Alan | Uzunluk | Kural |
|---|---|---|
| `punchline` | 8–20 kelime | Tek cümle. "Bu hikâyenin mesajı…" gibi yapay giriş yasak. |
| `thirty_sec` | **55–80 kelime** (zorunlu) | Merak girişi + olayın özü + net sonuç. Ana metinden kesit değil. Yarım cümle yasak. |
| `question` | 8–22 kelime | Tek, açık uçlu. Evet/hayır'a sıkışmaz. Yargılayıcı veya kişisel veri isteyen olmaz. |
| `key_contrast` | 2–8 kelime | İki fikir arasındaki gerilim. `punchline` ile aynı olamaz. |

- Dört varyant farklı işlev görür; aynı mesajı tekrar etmez.
- Yüksek sesle okunduğunda doğal duyulmalı.
- Ana hikâyedeki cümleler aynen kopyalanmaz.
- Paylaşılabilirlik uğruna olgu abartılmaz, kesin olmayan iddia kesinleştirilmez.

## 4. Dört dilde bağımsız üretim

Sıra **bağlayıcıdır**:

1. Olay için dilden bağımsız, doğrulanmış **olgu paketi** (`story.fact_pack`) hazırla.
2. Türkçe metni olgu paketinden doğrudan yaz.
3. İngilizce metni **Türkçe metne bakmadan** aynı olgu paketinden yaz.
4. İspanyolca metni diğer dillere bakmadan aynı olgu paketinden yaz.
5. Almanca metni diğer dillere bakmadan aynı olgu paketinden yaz.
6. Her dilde 4 varyantı o dildeki ana hikâyeden bağımsız üret.
7. Her dilde uzunluk, doğallık, sayı ve olgu tutarlılığını ayrı ayrı doğrula.

Yasak: çeviri, makine çevirisi, kelime kelime yeniden yazım, bir dildeki cümle
yapısını diğer dilde takip etmek.

Dört metin **aynı olguları** taşır; anlatım sırası, vurgu ve cümle yapısı hedef
dilde doğal olacak şekilde bağımsız kurulur.

`validate-batch.mjs` şunları yakalar:

- Diller arası sayı/yıl tutarsızlığı → **hata**
- Dört dilde paragraf/cümle yapısının birebir aynı olması → **uyarı** (birebir çeviri şüphesi)
- İki dil arasında %50'den fazla uzun kelime ortaklığı → **uyarı** (kopyala-yapıştır şüphesi)

Uyarı aldıysan metni yeniden kur; uyarıyı kapatmak için sayı silmek yasaktır.

## 5. Araştırma ve güvenlik

- Kitap özeti tek başına doğrulama kaynağı değildir.
- Gerçek olaylar **en az iki bağımsız güvenilir kaynakla** doğrulanır; mümkünse birincil kaynak.
- Doğrudan kitap metni, uzun alıntı veya yazara özgü anlatım kopyalanmaz.
- Tartışmalı deney ve tezler kesin gerçek gibi sunulmaz; gerekli eleştiri belirtilir.
- Sağlık, psikoloji ve finans içerikleri kişisel tavsiye vermez.
- Yaşayan kişiler hakkındaki olumsuz iddialar için güçlü kaynak ve tarafsız dil zorunlu.
- Konunun kitapta gerçekten yer aldığı doğrulanır.

## 6. Sürüm politikası

- `version = 1` — bu üretim çalışmasından önce DB'de bulunan hikâyeler.
- `version = 2` — bu görev kapsamında yeni üretilenler.
- **Sorma kuralı:** Her batch başında hangi `version` değerinin yazılacağı
  kullanıcıya SORULUR. Agent kendi varsaymaz.
- Mevcut hikâyeye yalnızca varyant eklemek sürümü değiştirmez (`kind: variants_only`).
- DB'de `version` kolonunda `C1`, `C2`, `F5`, `F6`, `F7`, `OH` gibi metin etiketleri de
  var. Yeni batch'te metin etiketi kullanılacaksa kullanıcı açıkça onaylamalıdır.

## 7. Mevcut 633 hikâye

Ana metin **yeniden yazılmaz**. Her dildeki mevcut `story_translations.content`
okunarak yalnızca sohbet varyantları hazırlanır (`kind: variants_only`).

## 8. Kabul kriterleri

`validate-batch.mjs` bunları otomatik denetler. Manuel kalan editoryal maddeler:

- [ ] Olay kitapla gerçekten ilişkili.
- [ ] Kaynaklar bağımsız ve erişilebilir.
- [ ] Dört dildeki metinler çeviri değil, bağımsız yazım ürünü.
- [ ] Riskli iddialar dengeli ve kaynaklı.
- [ ] Telifli metin veya uzun doğrudan alıntı yok.
- [ ] DB'ye ekleme öncesi insan onayı alındı.

# Hikâye ve Sohbet Varyantları Üretim Görevi

## Amaç

`HIKAYE_BASLIKLARI.md` içindeki `[ ] ÜRETİLECEK / DOĞRULANACAK` başlıkları araştırarak Spark mobil uygulamasına uygun hikâyeler üretmek ve her hikâye için “Sohbette Kullan” ekranında doğrudan konuşulabilecek dört özel metin hazırlamak.

Bu görev iki ayrı çıktı üretir:

1. Ana hikâye metni
2. Hikâyeye özel konuşma varyantları: `punchline`, `thirty_sec`, `question`, `key_contrast`

## Kapsam

- Girdi kataloğu: `YENI_KITAP_ONERILERI.md`
- İş kuyruğu: `HIKAYE_BASLIKLARI.md` içindeki `[ ] ÜRETİLECEK / DOĞRULANACAK` satırları
- Mevcut biçim referansı: `assets/kivilcim.db` içindeki `story_translations.content` kayıtları
- Toplam plan: **300 kitap için 3.000 hikâye başlığı**
- Yeni ana hikâye kapsamı: **2.367 Türkçe hikâye**
- DB’deki **633** ana hikâye yeniden üretilmez; yalnızca eksik konuşma varyantları üretilir.
- Desteklenen diller: `tr`, `en`, `es`, `de`
- Her dildeki ana hikâye ve konuşma varyantları doğrulanmış kaynak paketinden bağımsız yazılır; bir dildeki metin diğer dile çevrilmez.

## İlerleme

- Batch 001-006: **51** yeni V2 hikâye tamamlandı (`story_id:1692-1742`)
- Batch 003: **10** hikâye; 5×1 dk, 4×3 dk, 1×5 dk
- Batch 004: **10** hikâye; 4×1 dk, 5×3 dk, 1×5 dk
- Batch 005: **10** hikâye; 2×1 dk, 5×3 dk, 3×5 dk
- Batch 006: **10** hikâye; 1×1 dk, 9×3 dk, 0×5 dk
- 90+ puanlı bekleyen başlık: **345**
- Yeni ana hikâye genel kuyruğu: **2.367** başlıktan **51** tamamlandı, **2.316** bekliyor

## Sürüm Politikası

- `stories.version = 1`: Bu üretim çalışmasından önce DB’de bulunan hikâyeler
- `stories.version = 2`: Bu görev kapsamında yeni üretilen hikâyeler
- Yeni kayıt oluşturulurken `version` açıkça yazılmalıdır; varsayılan değere güvenilmemelidir.
- Mevcut hikâyeye yalnızca konuşma varyantı eklemek ana hikâyenin sürümünü değiştirmez.

## Ana Hikâye Çıktısı

Her yeni hikâye şu alanları içermelidir:

```yaml
book_title: "Özgün kitap adı"
author: "Yazar"
category: "Uygulamadaki ana kategori"
title: "Hikâye başlığı"
description: "Tek cümlelik kısa açıklama"
current_read_minutes: 3
possible_read_minutes: 3
target_word_count: 475
target_word_tolerance: 75
content: |-
  Süre hedefine uygun özgün hikâye metni.
source_notes:
  - "Doğrulamada kullanılan güvenilir kaynak URL'si"
verification_status: "verified"
```

### Ana Hikâye Süresi ve Uzunluğu

- **1 dakika:** `160 ±40` kelime; kabul aralığı **120-200**
- **3 dakika:** `475 ±75` kelime; kabul aralığı **400-550**
- **5 dakika:** `800 ±100` kelime; kabul aralığı **700-900**
- Başlık ve açıklama ölçüme dahil değildir; yalnızca `content` ölçülür.
- `HIKAYE_BASLIKLARI.md` üzerindeki süre ve kelime hedefi üretim için bağlayıcıdır.
- Yeni üretilen hikâyelerde `current_read_minutes` ile `possible_read_minutes` aynı olmalıdır.
- Eski hikâye yeniden üretilene kadar ekranda `current_read_minutes` gösterilir.
- Eski hikâye hedef uzunlukta yeniden üretilip onaylandığında `current_read_minutes`, `possible_read_minutes` değerine yükseltilir.

### Ana Hikâye İşaretleri

Her `content` alanında tam olarak birer tane bulunmalıdır:

- `##...##`: Çarpıcı sonuç veya dönüm noktası
- `$$...$$`: Genellenebilir ana ders
- `&&...&&`: Sohbet açan düşünme sorusu

Bu işaretler metnin sonuna yığılmamalıdır. Hikâye uzunluğuna göre özel format yoğunluğu artırılmalıdır:

- **1 dk hikâye:** En az 1 adet `##...##` vurgu kutusu yeterlidir.
- **3 dk hikâye:** 1-2 adet `##...##` vurgu kutusu kullanılmalıdır.
- **5 dk hikâye:** Metin içinde 2 adet ara `##...##` vurgu kutusu kullanılmalıdır. Final cümlesi gerçekten vurucuysa ayrıca finalde 1 adet `##...##` kapanış vurgusu kullanılabilir.
- `##...##` olayın ortasında, kırılma anında veya finalde "alıntılanabilir / ortamda söylenebilir" güçlü cümle gibi çalışmalıdır.
- `$$...$$` ders cümlesi sona yakın olabilir, ancak ayrı bir final sloganı gibi kopuk durmamalı; önceki paragrafın anlamını toplamalıdır.
- `&&...&&` sohbet sorusu finalde kalabilir; ama metnin tek özel formatlı bölümü soru olmamalıdır.

Bu işaretler yeni konuşma varyantları bulunmadığında geriye dönük fallback olarak kullanılmaya devam eder.

## Sohbet Varyantları Çıktısı

Her onaylanmış hikâye ve dil için aşağıdaki alanlar ayrıca üretilmelidir:

```yaml
story_id: 1059
lang_code: "tr"
punchline: "Tek nefeste söylenebilen vurucu çıkarım."
thirty_sec: "Konuşma dilinde kısa giriş, gelişme ve sonuç içeren anlatım."
question: "Karşı tarafın fikrini veya deneyimini açan doğal soru?"
key_contrast: "Kısa ama akılda kalıcı zıtlık."
```

### `punchline`

- Tek cümle olmalıdır.
- Tercihen **8-20 kelime** olmalıdır.
- Hikâyenin en şaşırtıcı sonucunu veya çıkarımını taşımalıdır.
- Yazı özeti gibi değil, ortamda doğal biçimde söylenebilir olmalıdır.
- “Bu hikâyenin mesajı...” gibi yapay girişler kullanılmamalıdır.

### `thirty_sec`

- Konuşma dilinde **55-80 kelime** olmalıdır.
- Yaklaşık 25-35 saniyede anlatılabilmelidir.
- Kısa bir merak girişi, olayın özü ve net bir sonuç içermelidir.
- Ana hikâyenin ilk 320 karakterinin kesilmiş hâli olmamalıdır.
- Cümle yarım bırakılmamalı; metin tek başına anlaşılmalıdır.

### `question`

- Tek, açık uçlu soru olmalıdır.
- Tercihen **8-22 kelime** olmalıdır.
- “Evet/hayır” cevabına sıkışmamalıdır.
- Karşı tarafın görüşünü, deneyimini veya benzer bir örneği anlatmasını teşvik etmelidir.
- Yargılayıcı, kişisel veri isteyen veya rahatsız edici olmamalıdır.

### `key_contrast`

- Tercihen **2-8 kelime** olmalıdır.
- İki fikir arasındaki gerilimi kısa biçimde göstermelidir.
- Örnek biçimler: “Güçlü ama yönetilemez”, “Meşgul değil, üretken”, “Kontrol değil, güven”.
- Tek kelime zorunlu değildir; kart başlığı “Anahtar Zıtlık” olarak kalır.

### Konuşma Dili İlkeleri

- Metinler yüksek sesle okunduğunda doğal duyulmalıdır.
- Akademik terimler gerekiyorsa kısa ve gündelik biçimde açıklanmalıdır.
- Ana hikâyedeki cümleler aynen kopyalanmamalı; konuşmaya uygun yeniden yazılmalıdır.
- Her varyant farklı bir işlev görmeli; dört alan aynı mesajı tekrar etmemelidir.
- Paylaşılabilirlik uğruna olgular abartılmamalı veya kesin olmayan iddialar kesinleştirilmemelidir.

## Veritabanı Tasarımı

Hikâyenin gerçek ve hedeflenen okuma süresi `stories` tablosunda ayrı tutulmalıdır:

```sql
ALTER TABLE stories ADD COLUMN current_read_minutes INTEGER DEFAULT 1;
ALTER TABLE stories ADD COLUMN possible_read_minutes INTEGER DEFAULT 1;
ALTER TABLE stories ADD COLUMN target_word_count INTEGER DEFAULT 160;
ALTER TABLE stories ADD COLUMN target_word_tolerance INTEGER DEFAULT 40;
```

- `current_read_minutes`: Ekranda gösterilecek, mevcut metnin gerçek süresi
- `possible_read_minutes`: Yeniden üretim veya yeni üretim için editoryal hedef
- `target_word_count`: Hedef kelime sayısının merkezi
- `target_word_tolerance`: Hedefin iki yönlü `±` sapma payı
- Süre değerleri yalnızca `1`, `3` veya `5` olmalıdır.

Konuşma varyantları ana hikâye ve çeviri tablolarından ayrı tutulmalıdır:

```sql
CREATE TABLE IF NOT EXISTS story_conversation_variants (
  story_id INTEGER NOT NULL,
  lang_code TEXT NOT NULL,
  punchline TEXT,
  thirty_sec TEXT,
  question TEXT,
  key_contrast TEXT,
  PRIMARY KEY (story_id, lang_code),
  FOREIGN KEY (story_id) REFERENCES stories(id)
);

CREATE INDEX IF NOT EXISTS idx_story_conversation_variants_lang
  ON story_conversation_variants(lang_code);
```

Bir hikâye ve dil için en fazla bir satır bulunmalıdır. Boş string yerine `NULL` kullanılmalıdır.

## Dil ve Fallback Sırası

“Sohbette Kullan” ekranı her alanı bağımsız olarak şu sırayla çözmelidir:

1. `story_conversation_variants` içinde seçili `story_id + lang_code` alanı
2. Aynı hikâyenin Türkçe (`tr`) varyantındaki alan
3. Mevcut işaretli hikâye metninden türetilen değer

İşaretli metin fallback eşlemesi:

- `punchline`: `$$...$$`, yoksa `##...##`
- `thirty_sec`: mevcut `stories.thirty_sec`, yoksa işaretlerden temizlenmiş metnin ilk 320 karakteri
- `question`: `&&...&&`
- `key_contrast`: `##...##`; `punchline` ile aynıysa gösterilmez

Yeni tablo devreye alındığında mevcut fallback kodu silinmemelidir.

## Dört Dilde Bağımsız Üretim

1. Olay için dilden bağımsız, doğrulanmış bir olgu ve kaynak paketi hazırla.
2. Türkçe metni bu kaynak paketinden doğrudan yaz.
3. İngilizce metni Türkçe metne bakmadan aynı kaynak paketinden doğrudan yaz.
4. İspanyolca metni diğer dil metinlerine bakmadan aynı kaynak paketinden doğrudan yaz.
5. Almanca metni diğer dil metinlerine bakmadan aynı kaynak paketinden doğrudan yaz.
6. Her dilde `punchline`, `thirty_sec`, `question` ve `key_contrast` alanlarını o dildeki ana hikâyeden bağımsız konuşma metinleri olarak üret.
7. Her dilde uzunluk, doğallık, sayı ve olgu tutarlılığını ayrı ayrı doğrula.
8. Sonuçları staging çıktısına yaz; insan onayı olmadan DB’ye aktarma.

Çeviri, makine çevirisi, kelime kelime yeniden yazım veya bir dildeki cümle yapısını diğer dilde takip etmek kabul edilmez. Dört metin aynı olguları taşıyabilir; anlatım sırası, vurgu ve cümle yapısı hedef dilde doğal olacak şekilde bağımsız kurulmalıdır.

Mevcut 633 hikâye için ana metin yeniden yazılmaz. Her dildeki mevcut `story_translations.content` okunarak yalnızca konuşma varyantları hazırlanır.

## Araştırma ve Güvenlik

- Kitap özeti tek başına doğrulama kaynağı sayılmaz.
- Gerçek olaylar en az iki güvenilir kaynakla doğrulanmalıdır; mümkünse birincil kaynak kullanılmalıdır.
- Doğrudan kitap metni, uzun alıntı veya yazara özgü anlatım kopyalanmamalıdır.
- Tartışmalı deney ve tezler kesin gerçek gibi sunulmamalı; gerekli eleştiriler belirtilmelidir.
- Sağlık, psikoloji ve finans içerikleri kişisel tavsiye vermemelidir.
- Yaşayan kişiler hakkındaki olumsuz iddialar için güçlü kaynak ve tarafsız dil zorunludur.

## Çalışma Akışı

1. Kuyruktan bir `ÜRETİLECEK / DOĞRULANACAK` başlık seç.
2. Konunun kitapta gerçekten yer aldığını doğrula.
3. Olayı bağımsız kaynaklarla araştır.
4. Dört dildeki ana hikâyeleri aynı kaynak paketinden birbirinden bağımsız üret.
5. Süreye ait kelime aralığını, işaretleri ve varyant uzunluklarını otomatik doğrula.
6. Editoryal ve olgusal kontrolden geçir.
7. Dört dildeki konuşma varyantlarını bağımsız üret ve kontrol et.
8. Staging çıktısına ekle; doğrudan DB’ye yazma.
9. Başlık durumunu `İNCELEMEDE` veya `ONAYLANDI` olarak güncelle.

## Kabul Kriterleri

- [ ] Kitap ve yazar katalogla eşleşiyor.
- [ ] Olay kitapla ilişkili ve bağımsız kaynaklarla doğrulanmış.
- [ ] Ana içerik seçilen 1/3/5 dakika hedefine ait kelime aralığında.
- [ ] Yeni hikâyede mevcut ve olası süre aynı değerde.
- [ ] Eski hikâyede ekran etiketi yeniden üretim tamamlanana kadar mevcut süreyi kullanıyor.
- [ ] `##`, `$$` ve `&&` blokları doğru ve birer kez kullanılmış.
- [ ] `punchline` tek cümle ve konuşma dilinde.
- [ ] `thirty_sec` 55-80 kelime, tamamlanmış ve yaklaşık 30 saniyelik.
- [ ] `question` açık uçlu ve doğal bir sohbet başlatıyor.
- [ ] `key_contrast` kısa, anlaşılır ve gerçekten iki fikri karşılaştırıyor.
- [ ] Dört varyant birbirini tekrar etmiyor.
- [ ] `tr`, `en`, `es`, `de` sürümleri anlam ve olgu bakımından tutarlı.
- [ ] Dört dildeki metinler çeviri değil, ortak kaynak paketinden bağımsız yazım ürünüdür.
- [ ] Yeni hikâyede `stories.version = 2` açıkça set edilmiştir.
- [ ] Telifli metin veya uzun doğrudan alıntı bulunmuyor.
- [ ] Riskli iddialar dengeli ve kaynaklı.
- [ ] DB’ye ekleme öncesinde insan onayı alınmış.

## Tamamlanma Tanımı

Görev şu koşullarda tamamlanır:

- 2.367 yeni ana hikâye kabul kriterlerini geçen staging kayıtlarına dönüşmüştür.
- Yeni hikâyelerin Türkçe konuşma varyantları hazırlanmıştır.
- Mevcut 633 hikâyenin eksik konuşma varyantları hazırlanmıştır.
- Onaylanan tüm hikâyeler için `tr`, `en`, `es`, `de` varyant satırları hazırlanmıştır.
- DB aktarımı ve ekran entegrasyonu ayrı migration/uygulama görevi olarak yürütülür.

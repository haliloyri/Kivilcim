# Hikâye Üretim İş Planı

**Durum:** 2026-07-25 · 278 kitap · 770 hikâye · audit 0 hata

Bu plan sıraya göre yazılmıştır. Sıra keyfi değil: **işler birbirini bloke ediyor.**
Yanlış sırada yapılırsa aynı iş iki kez yapılır.

---

## Sıralamayı belirleyen üç bağımlılık

Bunlar ölçüldü, tahmin değil.

**1. Uzunluk yeniden üretimi varyantı geçersiz kılar.**
124 hikâyede `current_read_minutes ≠ possible_read_minutes` (107 tanesi 1→3 dk, 17 tanesi 1→5 dk).
Bunların **121'inin varyantı da eksik.** Önce varyant yazarsak, sonra hikâye üç katına
çıkarıldığında `thirty_sec` ve `punchline` metinle uyumsuz kalır — 121 × 4 dil × 4 alan
yeniden yazılır. **Uzunluk önce.**

**2. Çeviri olmadan varyant yazılamaz.**
20 hikâye (`story_id` 1809-1828) yalnızca Türkçe. en/es/de ana metni olmadan o dillerde
varyant üretilemez. **Çeviri önce.**

**3. Almanca hook temizliği ayrı iş değil.**
346 Almanca hook şablon kalıbında. Bunların **340'ı varyantı eksik hikâyelerde.** Her
varyant partisi 4 dilde `hook` yazdığı için şablon kendiliğinden üzerine yazılıyor.
Ayrı bir temizlik hattı kurmaya gerek yok — sadece 6 hikâye artakalıyor.

Bu üçü çıkarılınca 633'lük varyant kuyruğu şöyle ayrışıyor:

| Grup | Adet | Durum |
|---|---:|---|
| **A** — hemen üretilebilir | **492** | Bloke değil |
| **B** — önce uzunluk | 121 | Adım 2'den sonra |
| **C** — önce çeviri | 20 | Adım 3'ten sonra |

---

## Adım 1 — Artakalan hook boşluğu

**Kapsam:** 16 kayıt · **Süre:** tek parti

- 10 hikâye (`1059-1068`, A1-001 partisi) varyantı var ama `hook` alanı boş kaldı;
  o parti `hook` desteği eklenmeden önce üretildi
- 6 hikâye varyantı var ama Almanca `hook` hâlâ şablon

Tek `variants_only` batch'i, yalnızca `hook` alanı. Küçük ama açık bir eksik;
kapatılmazsa bu 16 hikâyenin paylaş kartında "🎬 Hook" ya boş ya anlamsız.

**Çıktı:** `batch-A1-005-hooks.json`

---

## Adım 2 — Uzunluk yeniden üretimi

**Kapsam:** 124 hikâye × 4 dil · **Süre:** ~30 parti (3-5'erli)

`current_read_minutes` ekranda gösterilen gerçek süre, `possible_read_minutes`
editoryal hedef. 124 hikâye hedefinin altında:

| Geçiş | Adet | Kelime hedefi |
|---|---:|---|
| 1 dk → 3 dk | 107 | 160 → 475 ±75 |
| 1 dk → 5 dk | 17 | 160 → 800 ±100 |

Bu **yeniden yazım**, düzeltme değil: hikâye üç-beş katına çıkıyor, yeni olgu ve
bağlam gerekiyor. Yani araştırma + `uretim-kurallari.md` bölüm 4 (dört dilde bağımsız
yazım) tam olarak uygulanmalı.

**Parti boyutu 3-5 hikâye, 10 değil.** İlk parti (A2-001) bunu gösterdi: üç hikâyenin
üçünde de olgu hatası çıktı ve her biri ayrı web araştırması gerektirdi. Uzatmak,
mevcut metni şişirmek değil; çoğu durumda hikâyeyi yeniden kurmak demek. 10'arlı
parti bu adımda dolgu üretmeye zorlar — DB'deki eski `add-v2-story-batch` script'leri
tam olarak bunu yapmış, kelime saymak için `fillers` dizileri tutmuştu.

Onaylandıkça `current_read_minutes` `possible`'a yükseltilir.

**Batch türü:** `new_story` (mevcut `story_id` üzerine, `version` sorulacak)
**Not:** Bu 124'ün 121'i Adım 4-B'yi açar.

---

## Adım 3 — Eksik çeviriler

**Kapsam:** 20 hikâye × 3 dil (en/es/de) · **Süre:** 2 parti

`story_id` 1809-1828 — Range (kitap 277) ve Give and Take (kitap 278). Türkçe metin
var, diğer üç dil yok. Yarım kalmış bir ingest'ten kalma.

Çeviri değil: Türkçe metinden olgu paketi çıkarılıp her dil bağımsız yazılacak.

**Batch türü:** `new_story`
**Not:** Adım 4-C'yi açar.

---

## Adım 4 — Sohbet varyantı + hook

**Kapsam:** 633 hikâye × 4 dil × 5 alan = 12.660 metin · **Süre:** ~63 parti

Üç alt gruba bölünür ve **bu sırayla** yapılır:

- **4-A · 492 hikâye** — hemen başlanabilir, Adım 2 ve 3'ü beklemez
- **4-B · 121 hikâye** — Adım 2 bittikten sonra
- **4-C · 20 hikâye** — Adım 3 bittikten sonra

Her parti 10 hikâye, 4 dil, beş alan: `punchline`, `thirty_sec`, `question`,
`key_contrast`, `hook`. Araştırma gerektirmez — ana metin zaten var.

Bu adım aynı anda üç boşluğu birden kapatır: sohbet ekranı, paylaş kartı hook'u ve
340 Almanca şablon hook.

**Batch türü:** `variants_only`

---

## Adım 5 — Kuyruk başlıklarının çeşitlendirilmesi

**Kapsam:** 2305 başlığın 1313'ü (**%57**) · **Süre:** book-scout, birkaç oturum

Bekleyen başlıkların yarıdan fazlası yedi kalıbın kopyası:

| Adet | Kalıp |
|---:|---|
| 198 | …İçindeki En Şaşırtıcı Gerçek Hayat Deneyi |
| 194 | Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — … |
| 192 | … Bu Kitabı Yazmaya Hangi Soruyla Başladı? |
| 191 | Başarısız Görünen Bir Denemenin Gizli Kazancı — … |
| 189 | …: Yazarın Fikrini Değiştiren Kırılma Anı |
| 179 | … Fikrini Gerçek Hayatta Sınayan Vaka |
| 170 | Yaygın Bir İnanışı Tersine Çeviren Bulgu — … |

Bu başlıklar kitaba özgü değil; herhangi bir kitaba yapıştırılabilir. Adım 6'ya
dokunulmadan geçilirse 1313 hikâye aynı kalıptan çıkar ve uygulama tekrara düşer.

**Neden Adım 6'dan önce:** başlık düzeltmek ucuz, yazılmış hikâyeyi atmak pahalı.

**Agent:** `book-scout`

---

## Adım 6 — Yeni hikâye üretimi

**Kapsam:** 2305 başlık × 4 dil · **Süre:** en büyük iş

Her hikâye için: kitapta geçtiğinin doğrulanması, en az iki bağımsız kaynak, olgu
paketi, dört dilde bağımsız yazım, işaretler, beş varyant alanı.

Kitap başına 10 hikâye hedefi: şu an 278 kitabın 276'sı hedefin altında.

**Agent:** `story-producer` → `quality-reviewer`
**Batch türü:** `new_story`

---

## Adım 7 — Sistemde olmayan kitaplar

**Kapsam:** 24 kitap · 240 başlık

Envanterin "Sisteme Eklenmemiş Kitaplar" bölümünde. Kategorileri var, yayın yılları
yok. `books` + `book_translations`'a 4 dilde girmeleri gerekiyor.

Adım 6 ile paralel yürüyebilir; bloke etmiyor.

**Batch türü:** `new_book`

---

## Olgusal denetim — `npm run story:audit-facts`

A2-001..004 partilerinde 12 hikâyenin 11'inde olgu hatası çıktı. Tipoloji altı
başlıkta toplandı ve her biri için dedektör yazıldı (`audit-facts.mjs`):

| Tip | Ne arar |
|---|---|
| `quotes` | Atıflı alıntı — kaynakla doğrulanmalı |
| `causality` | İki tarih + nedensellik bağlacı — sıra hatası riski |
| `attribution` | Kitabın yazarı metinde yok, başka DB yazarı var |
| `unsourced` | "araştırmalar gösteriyor" tipi kaynaksız iddia |
| `contested` | Bilinen tartışmalı tez, çekince yok |
| `misfiled` | İçerik başka bir DB kitabına ait görünüyor |

**Script bir iddianın doğru olup olmadığını bilemez.** Yaptığı iş, insan
doğrulaması gereken yeri sonlu bir listeye indirmektir. Her bulgu bir hata
değil, bir doğrulama görevidir.

**Sonuç (ilk tam tur):** 34 hata → **3**. Düzeltilen: 8 çekincesiz tez (A2-005),
18 kaynaksız iddia (A2-006). Kalan 3 çekince Adım 2 kuyruğundaki hikâyelerde;
onlar baştan yazılırken çözülecek. `misfiled` denetimi iki kez sıkılaştırıldıktan
sonra sıfır gerçek bulgu verdi — tek gerçek yanlış kitap vakası (1113) elle
okurken bulunmuştu, dedektör onu yapısal olarak yakalayamazdı.

### Atıflı alıntı doğrulaması — risk sıralaması

170 alıntıyı tek tek aratmak mümkün değil. Risk sıralaması yapıldı:

| Sınıf | Adet | Neden |
|---|---:|---|
| Kitabın kendi yazarına atıf | 140 | Düşük risk — kendi kitabından alıntı |
| Üçüncü kişi, blok dışında | 15 | Orta |
| **Üçüncü kişi, `##` bloğu içinde** | **5** | **Yüksek — paylaş kartında görünür** |

Yüksek riskli 5'in 2'si parser gürültüsüydü. Kalan 3 araştırıldı: 1'i temiz
(Betsy Sparrow deneyi), 2'si düzeltildi (A2-007).

**Bu sıralama mantığı tekrar kullanılabilir:** bir alıntının tehlikesi, kime
atfedildiği ve nerede göründüğüyle ölçülür. Kitabın yazarının kendi kitabından
alıntılanması düşük risk; tarihî bir figüre atfedilip paylaş kartında
gösterilmesi en yüksek risk.

**Tekrarlanan tuzak:** `contested` denetimi, metinde çekince dili ararken bir
kelime listesine bakar. Yeni bir çekince ifadesi yazarsan onu `HEDGE` listesine
de eklemelisin; yoksa düzelttiğin hikâye hatalı görünmeye devam eder. Bu iki kez
yaşandı (story 1537 ve A2-005 partisinin tamamı).

---

## Sıra özeti

```
1. hook artakalani (16)          ── tek parti, hemen
2. uzunluk yeniden uretimi (124) ──┐
3. eksik ceviriler (20)          ──┤
                                   │
4A. varyant + hook (492)         ──┼── 4A bagimsiz, hemen baslayabilir
4B. varyant + hook (121)         ←──┘ 2 bittikten sonra
4C. varyant + hook (20)          ←──── 3 bittikten sonra
                                   │
5. baslik cesitlendirme (1313)   ──┤
6. yeni hikaye (2305)            ←──┘ 5 bittikten sonra
7. yeni kitaplar (24)            ──── paralel
```

**Paralel yürüyebilecekler:** 4A ile 2/3 aynı anda ilerleyebilir; 7 her zaman ayrı.
**Kesin sıralı olanlar:** 2→4B, 3→4C, 5→6.

---

## Her parti için değişmeyen döngü

```bash
node scripts/story-pipeline/gap-report.mjs          # ne bekliyor
# … üretim …
node scripts/story-pipeline/validate-batch.mjs staging/batch-XXX.json
node scripts/story-pipeline/ingest-batch.mjs staging/batch-XXX.json          # dry-run
node scripts/story-pipeline/ingest-batch.mjs staging/batch-XXX.json --confirm  # insan onayi
node scripts/story-pipeline/sync-inventory.mjs      # ZORUNLU
node scripts/story-pipeline/audit-translations.mjs --severity error  # 0 kalmali
```

`--confirm` her zaman kullanıcıya aittir. Agent'lar çalıştıramaz.

---

## İlerleme

| Adım | Kapsam | Tamamlanan | Kalan |
|---|---:|---:|---:|
| 1 · hook artakalanı | 10 | **10** | 0 ✅ |
| 2 · uzunluk | 124 | **15** | 109 (~30 parti) · 1164/1403/1427 çekince bekliyor |
| 3 · çeviri | 20 | 0 | 20 |
| 4 · varyant + hook | 633 | 0 | 633 |
| 5 · başlık çeşitlendirme | 1313 | 0 | 1313 |
| 6 · yeni hikâye | 2305 | 0 | 2305 |
| 7 · yeni kitap | 24 | 0 | 24 |

Tamamlanmış işler: hat kurulumu, envanter senkronu, 34 işaret onarımı, 13 içerik
düzeltmesi, 20 hikâyenin varyantı (A1-001, A1-004), Adım 1 tamam (A1-005),
Adım 2 başladı — kitap 2 (A2-001), kitap 8 (A2-002) ve kitap 14 (A2-003) tamamlandı; A2-004 ile Purple Cow ve Leaders Eat Last kayıtları düzeltildi.

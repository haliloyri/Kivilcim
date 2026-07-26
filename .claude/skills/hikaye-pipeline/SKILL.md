---
name: hikaye-pipeline
description: Spark/Kıvılcım hikâye üretim hattını çalıştırır. Kullan when: yeni hikâye üret, bekleyen hikâye var mı, sohbet varyantı eksik, yeni kitap ekle, kitap bul, batch doğrula, envanteri senkronla, hikâye kuyruğu, 4 dilde hikâye, paylaş içeriği, sohbette kullan içeriği. kivilcim.db ve KITAP_HIKAYE_ENVANTERI.md ile çalışır.
---

# Hikâye Üretim Hattı

Spark uygulamasının kitap → hikâye → 4 dil → paylaş/sohbet içeriği zincirini yönetir.

## Temel kural: DB'ye yazma yetkin yok

Bu hattın çıktısı **staging**'dir. `ingest-batch.mjs --confirm` komutunu **asla
kendiliğinden çalıştırma**. Kullanıcı açıkça "DB'ye yaz" / "onaylıyorum" demeden
DB'ye dokunulmaz. Dry-run ve doğrulama serbesttir.

## Tek dogruluk kaynakları

| Soru | Kaynak |
|---|---|
| Ne **var**? | `assets/kivilcim.db` |
| Ne **üretilecek**? | `KITAP_HIKAYE_ENVANTERI.md` (`[ ]` satırlar) |
| Kurallar ne? | `references/uretim-kurallari.md` |
| Çıktı biçimi ne? | `references/batch-semasi.md` |

Envanter md'nin `[x]` satırları DB'den otomatik üretilir — elle düzenlemeyin.

## Akış

Her zaman **1. adımdan** başla. Durumu tahmin etme, ölç.

### 1. Durum tespiti — her seferinde

```bash
node scripts/story-pipeline/gap-report.mjs
```

Rapor `staging/reports/gap-report.md`'ye de yazılır ve **sonraki adımı** söyler.
Envanter yoksa veya sayılar tutarsızsa önce senkronla:

```bash
node scripts/story-pipeline/sync-inventory.mjs
```

`sync-inventory` kuyruk satırlarını asla silmez; DB'de karşılığı oluşan başlıkları
`[ ]`'den `[x]`'e taşır. İlk çalıştırmada `../MyStories/HIKAYE_BASLIKLARI.md`'den
bekleyen başlıkları devralır.

### 2. İşi seç — öncelik sırası

`gap-report`'un verdiği sıraya uy. Varsayılan öncelik:

1. **Sohbet varyantı eksik hikâyeler** → `kind: variants_only`. En düşük riskli iş:
   ana metin zaten var, yalnızca 4 alan üretilir.
2. **Kuyrukta bekleyen başlıklar** → `kind: new_story`. Puanı yüksek olandan başla.
3. **10 hikâyeye ulaşmamış kitaplar** → book-scout ile başlık üret.
4. **Kuyruk boş** → book-scout ile yeni kitap araştır.

### 3. Version'ı sor

Üretime başlamadan **kullanıcıya `version` değerini sor**. Bu
`HIKAYE_URETIM_TASK.md`'deki açık bir kuraldır; varsayma. Yeni ana hikâye için
tipik değer `2`.

### 4. Agent'ı çağır

| İş | Agent |
|---|---|
| Durum/senkron/tutarsızlık | `queue-auditor` |
| Yeni kitap + 10 başlık araştırması | `book-scout` |
| Hikâye + 4 dil + varyant üretimi | `story-producer` |
| Kabul kriterleri + editoryal denetim | `quality-reviewer` |

Tek bir iş için tek agent yeterliyse tek agent çağır. Üretim zinciri:
`story-producer` → `quality-reviewer` → (kullanıcı onayı) → ingest.

### 5. Doğrula

```bash
node scripts/story-pipeline/validate-batch.mjs staging/batch-NNN.json
```

Hata varsa ingest engellenir. Uyarılar insan kararına bırakılır ama
**birebir çeviri şüphesi** uyarısı geldiyse metni yeniden kur.

### 6. Kullanıcıya sun

Rapor + batch dosyasını göster. Şu formatta özetle:

- Kaç kayıt, hangi kitaplar, hangi süreler
- Doğrulama sonucu: kaç hata / kaç uyarı
- Kaynaklar
- Onay komutu: `node scripts/story-pipeline/ingest-batch.mjs staging/batch-NNN.json --confirm`

### 7. Onaydan sonra

Kullanıcı onaylarsa ingest'i çalıştır, ardından **mutlaka**:

```bash
node scripts/story-pipeline/sync-inventory.mjs
```

Bu adım atlanırsa envanter ile DB ayrışır.

## Script referansı

| Script | Ne yapar | DB'ye yazar? |
|---|---|---|
| `gap-report.mjs` | Bekleyen işi listeler, sonraki adımı söyler | ✗ |
| `sync-inventory.mjs` | Envanter md'yi DB ile senkronlar | ✗ (md yazar) |
| `validate-batch.mjs` | Yeni batch'i kabul kriterlerine göre denetler | ✗ |
| `audit-translations.mjs` | **Mevcut** çevirilerdeki kusurları tarar | ✗ |
| `ingest-batch.mjs` | Staging → DB | ✓ yalnızca `--confirm` ile, yedek alarak |

Bayraklar: `--json` (gap-report, validate, audit), `--dry-run` (sync), `--limit N`,
`--confirm` (ingest), `--severity error|warn|info` / `--lang` / `--story` / `--check` /
`--emit-sql` (audit).

`npm run story:gap` / `story:sync` / `story:validate` / `story:audit` / `story:ingest`.

## Çeviri denetimi

`validate-batch.mjs` **yeni** üretimi denetler; `audit-translations.mjs` DB'de **hâlâ duran**
kusurları bulur. 13 denetim: işaret bütünlüğü, tr ile blok sayısı uyumu, diller arası
sayı/yıl kayması, riskli terim, çevrilmemiş Türkçe parça, aynı metin iki dilde, özne
düşmesi, cinsiyet tutarsızlığı, hitap kipi karışımı, zaman kayması, başlık biçimi,
uzunluk sapması, boşluk artifaktları.

Onarım yolu üç sınıfa ayrılır:

1. **Mekanik** (boşluk, başlık biçimi) → `--emit-sql`, gözden geçir, elle uygula.
2. **İşaret ve olgu hataları** → ana metin düzeltmesi; `kind: new_story` batch'i.
3. **Çeviri kusurları** (cinsiyet, özne, hitap) → o dilin metni bağımsız yeniden yazılmalı.

Riskli terim sözlüğüne **bağlamsız homograf eklemeyin.** Almanca `bald` (yakında),
`Roman` (roman), `Gift` (zehir) hedef dilde doğru kelimelerdir; bağlamsız kural bunları
hatalı işaretler. Denendi, 12 yanlış pozitif üretti. Kalıba `baglamKalibi` şartı ekleyin.

## Sık karşılaşılan durumlar

**"Bekleyen bir şey var mı?"** → `gap-report.mjs` çalıştır, çıktısını özetle. Agent çağırma.

**"Yeni hikâye üret"** → gap-report → version'ı sor → `story-producer` → `quality-reviewer` → sun.

**"Bu kitabı ekle"** → `book-scout` ile araştır, sonra `story-producer` ile
`kind: new_book` batch'i üret. Kitap `books` + `book_translations`'a 4 dilde girer.

**"Sayılar tutmuyor"** → `queue-auditor`. Envanter md ile DB arasındaki farkı çözer.

**"Paylaş kartı boş görünüyor"** → `content` içinde `##`/`$$`/`&&` blokları eksik ya da
`story_translations.hook` boş. gap-report'un "Hook eksik" bölümüne bak.

## Bilinen veri sorunları

- `story_translations.hook`: `de` dilinde 750/750 dolu, `tr`/`en`/`es` 117/770. Eski bir
  script yalnızca Almanca'ya yazmış görünüyor. Varyant üretirken `hook` alanını da doldur.
- `books.category_id` bu DB'de `sub_categories.id`'ye işaret eder, `main_categories`'e
  değil. Kitabın ekranda görünen kategorisi için `book_translations.category_name`
  kullanılmalıdır.
- 124 hikâyede `current_read_minutes != possible_read_minutes` — hedef uzunlukta
  yeniden üretim bekliyor. Yeniden üretilip onaylandığında `current` `possible`'a yükseltilir.

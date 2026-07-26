# Staging Batch JSON Şeması

`staging/batch-NNN.json` — story-producer'ın tek çıktısı, validate-batch ve ingest-batch'in tek girdisi.

## Tam şema

```json
{
  "batch_id": "018",
  "kind": "new_story",
  "version": 2,
  "created": "2026-07-25",
  "notes": "Kapsam ve yöntem notu. Hangi kitaplar, neden bu başlıklar.",
  "items": [
    {
      "book": {
        "list_no": 279,
        "new": true,
        "author": "Jared Diamond",
        "publish_year": "1997",
        "category_id": 6,
        "sub_category_id": null,
        "titles": {
          "tr": "Tüfek, Mikrop ve Çelik",
          "en": "Guns, Germs, and Steel",
          "es": "Armas, gérmenes y acero",
          "de": "Arm und Reich"
        },
        "category_names": {
          "tr": "Tarih", "en": "History", "es": "Historia", "de": "Geschichte"
        }
      },
      "story": {
        "story_id": null,
        "queue_title": "Zebralar Neden Ata Dönüşmedi?",
        "chat_score": 88,
        "current_read_minutes": 3,
        "possible_read_minutes": 3,
        "target_word_count": 475,
        "target_word_tolerance": 75,
        "sources": [
          "https://birincil-kaynak.example/...",
          "https://ikinci-bagimsiz-kaynak.example/..."
        ],
        "verification_status": "verified",
        "fact_pack": [
          "Dilden bağımsız doğrulanmış olgu 1",
          "Dilden bağımsız doğrulanmış olgu 2"
        ]
      },
      "lang": {
        "tr": {
          "title": "Hikâye başlığı",
          "description": "Tek cümlelik kısa açıklama (paylaş kartında görünür)",
          "content": "Paragraflar. İçinde ##vurgu##, $$ders$$ ve &&soru&& blokları.",
          "hook": "Video/paylaşım için 1 cümlelik kanca",
          "punchline": "Tek nefeste söylenebilen vurucu çıkarım.",
          "thirty_sec": "55-80 kelime konuşma dilinde anlatım.",
          "question": "Karşı tarafın fikrini açan açık uçlu soru?",
          "key_contrast": "Kısa zıtlık"
        },
        "en": { "…": "aynı alanlar" },
        "es": { "…": "aynı alanlar" },
        "de": { "…": "aynı alanlar" }
      }
    }
  ]
}
```

## `kind` değerleri

| Değer | Ne yapar | Zorunlu alanlar |
|---|---|---|
| `new_story` | Yeni ana hikâye + 4 dil + varyantlar | `book`, `story` (tam), `lang.*` (tam) |
| `variants_only` | Mevcut hikâyeye sohbet varyantı ekler; ana metne dokunmaz | `story.story_id`, `lang.*.punchline/thirty_sec/question/key_contrast` |
| `new_book` | Yeni kitabı sisteme açar + ilk hikâyeleri | `book.new = true`, `book.titles` 4 dil, `book.author`, `book.category_id` |
| `marker_repair` | Yalnızca `##`/`$$`/`&&` konumunu düzeltir | `story.story_id`, `lang.<l>.content` |

### `marker_repair` güvenlik invaryantı

`validate-batch.mjs` şunu **zorunlu** tutar:

```
stripMarkers(yeni content) === stripMarkers(DB'deki content)
```

Yani metnin tek bir harfi değişmemiş olmalı; yalnızca işaret karakteri eklenmiş,
silinmiş veya taşınmış olabilir. Bu şart onarımın gizli bir yeniden yazıma
dönüşmesini imkânsız kılar. İhlal edilirse ilk farkın konumu ve iki yandaki metin
raporlanır.

Onarımı **elle yazmayın**: `propose-marker-repair.mjs` batch'i DB metninden hesaplar,
böylece invaryant yapısal olarak sağlanır. Script çözemediği kalıbı batch'e koymaz,
"elle inceleme" listesine yazar.

```bash
node scripts/story-pipeline/propose-marker-repair.mjs
node scripts/story-pipeline/validate-batch.mjs staging/batch-A1-002-markers.json
node scripts/story-pipeline/ingest-batch.mjs staging/batch-A1-002-markers.json --confirm
```

`ingest-batch.mjs` bu türde yalnızca `story_translations.content` yazar; `stories`,
`book_translations` ve `story_conversation_variants` tablolarına dokunmaz.

**Uyarı — JavaScript tuzağı:** `String.replace()` ikinci argümanında `"$$"` bir
*replacement escape*'idir ve literal tek `$` üretir. İşaret yazarken string yerine
fonksiyon replacer kullanın: `text.replace('&&&&', () => '$$')`. Bu hata yaşandı;
invaryant kontrolü yakaladı.

## DB alan eşlemesi

| JSON | Tablo.kolon |
|---|---|
| `book.list_no` | `books.list_no` — `stories.book_no` bu değere bakar |
| `book.titles[lang]` | `book_translations.title` |
| `book.category_names[lang]` | `book_translations.category_name` |
| `story.*` | `stories.*` (`version` batch kökünden gelir) |
| `lang[l].title/description/content/hook` | `story_translations.*` |
| `lang[l].punchline/thirty_sec/question/key_contrast` | `story_conversation_variants.*` |

`description` verilmezse `punchline`'a, `hook` verilmezse `question`'a düşer.

## Ekran eşlemesi — hangi alan nerede görünüyor

| Ekran / bileşen | Kullandığı alan |
|---|---|
| Hikâye detayı | `story_translations.content` |
| Paylaş kartı — `quote` | `content` içindeki `##…##` |
| Paylaş kartı — `lesson` | `content` içindeki `$$…$$` |
| Paylaş kartı — `reflection` | `content` içindeki `&&…&&` |
| Paylaş kartı — `hook` | `story_translations.hook` |
| Sohbette Kullan — 4 kart | `story_conversation_variants.*` |

Bu yüzden `##`, `$$`, `&&` bloklarının **her biri** paylaş kartında tek başına
okunabilir olmalıdır; cümlenin ortasından kesilmiş bir parça olmamalıdır.

## Fallback zinciri (`src/db/db.js`)

Sohbette Kullan ekranı her alanı bağımsız çözer:

1. `story_conversation_variants` — seçili `story_id + lang_code`
2. Aynı hikâyenin `tr` varyantı
3. İşaretli metinden türetilen değer: `punchline ← $$` / `question ← &&` / `key_contrast ← ##`

Yeni varyant yazmak fallback'i devre dışı bırakmaz; sadece önüne geçer.

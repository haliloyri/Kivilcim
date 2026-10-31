# Sürüm 1 İngilizce Hikâye Yazım ve Dil Kontrolü

- Denetim zamanı: 2026-10-30 18:53 +03
- Veri kaynağı: `assets/albor.db` (dışa aktarım: `proof-en-s1.json`)
- Veri tabanı SHA-256: `18d6ba89589616348273cb719a832681332b2df6b48caf9a8fdf6e300f2727de`
- Dil: `en`
- Kapsam: 20 hikâye (story_id 1276, 1282, 1284, 1291, 1292, 1294, 1295, 1303, 1327, 1417, 1474, 1483, 1513, 1552, 1553, 1554, 1568, 1569, 1603, 1612)
- Denetim durumu: Tamamlandı
- Sonuç: 14 bekleyen öneri (Yazım: 6, Dil: 8)

## İlerleme

| Dil | Durum | Tamamlanan parça | İncelenen | Bulgu | Son story_id |
|---|---|---:|---:|---:|---:|
| en | Tamamlandı | 1 | 20 | 14 | 1612 |

## Parça günlüğü

| Dil | Parça | Story ID aralığı | Kayıt | Bulgu | Durum |
|---|---:|---|---:|---:|---|
| en | 1 | 1276–1612 (seçili 20 id) | 20 | 14 | Tamamlandı |

## Kapsam sorunları

- `story_conversation_variants.question` alanı 20 hikâyenin tamamında boş (kapsam notu, yazım bulgusu değil).
- İncelenen alanlar: `title`, `description`, `content`, `hook`, `punchline`, `thirty_sec`, `key_contrast`.
- US/UK yazımı hikâye içinde tutarlı olduğu için dokunulmadı (ör. 1284 `traveller`/`recognise`, 1612 `neighbors`). Kitaptaki terimler (`under accumulator`, `gypsy woman`, `Renee Mauborgne`) korundu.

## Öneriler

### YK-EN-001 — en — story_id 1276

- Durum: Bekliyor
- Tür: Dil
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/en/1276.md`
- Mevcut: `*Zero to One* (*Sıfır'dan Bir'e*):`
- Öneri: `*Zero to One*:`
- Gerekçe: Kitabın Türkçe baskı adı İngilizce metne sızmış; diğer en hikâyelerinde (ör. 1282, 1292) yalnızca özgün kitap adı veriliyor. İngilizce okur için anlamsız.
- Güven: Yüksek

### YK-EN-002 — en — story_id 1291

- Durum: Bekliyor
- Tür: Yazım
- Alan hedefleri: `story_conversation_variants.thirty_sec`
- Kaynak dosya: `staging/p1-writer/en/1291.variants.json`
- Mevcut: `banned the phrase I can't afford it and asked`
- Öneri: `banned the phrase "I can't afford it" and asked`
- Gerekçe: Alıntılanan cümle tırnaksız olunca söz dizimi çözülemiyor ("banned the phrase I can't afford it and asked how he..."); içerikte aynı cümle tırnak içinde.
- Güven: Yüksek

### YK-EN-003 — en — story_id 1295

- Durum: Bekliyor
- Tür: Yazım
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/en/1295.md`
- Mevcut: `in ten, if nothing changes.`
- Öneri: `in ten, if nothing changes?`
- Gerekçe: İki noktadan sonra gelen doğrudan soru ("where will you be ... if nothing changes") soru işaretiyle bitmeli.
- Güven: Yüksek

### YK-EN-004 — en — story_id 1327

- Durum: Bekliyor
- Tür: Yazım
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/en/1327.md`
- Mevcut: `three lists of thirty, do, have and be, and`
- Öneri: `three lists of thirty (do, have and be), and`
- Gerekçe: Virgüllerle sıralanan başlıklar ana cümleyle karışıyor; açıklayıcı liste ayraç içine alınmalı.
- Güven: Yüksek

### YK-EN-005 — en — story_id 1417

- Durum: Bekliyor
- Tür: Dil
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/en/1417.md`
- Mevcut: `and no several rings running at once`
- Öneri: `and no multiple rings running at once`
- Gerekçe: "no several" İngilizcede kullanılmaz; olumsuz "no" ile "multiple" gelir.
- Güven: Yüksek

### YK-EN-006 — en — story_id 1417

- Durum: Bekliyor
- Tür: Dil
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/en/1417.md`
- Mevcut: `within less than twenty years`
- Öneri: `in less than twenty years`
- Gerekçe: "within less than" gereksiz çift sınırlama; doğal kullanım "in less than".
- Güven: Yüksek

### YK-EN-007 — en — story_id 1483

- Durum: Bekliyor
- Tür: Yazım
- Alan hedefleri: `story_translations.description`
- Kaynak dosya: `staging/p1-writer/meta/1483.json`
- Mevcut: `At Columbia's launch foam struck`
- Öneri: `At Columbia's launch, foam struck`
- Gerekçe: Giriş öbeğinden sonra virgül yokken "launch foam" tek öbek gibi okunuyor; virgül gerekli.
- Güven: Yüksek

### YK-EN-008 — en — story_id 1483

- Durum: Bekliyor
- Tür: Dil
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/en/1483.md`
- Mevcut: `makes a point of what psychological safety`
- Öneri: `makes a point about what psychological safety`
- Gerekçe: "make a point of" 'bir şeyi özellikle yapmak' demek ve ardından fiil ister; burada kastedilen "make a point about".
- Güven: Yüksek

### YK-EN-009 — en — story_id 1513

- Durum: Bekliyor
- Tür: Dil
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/en/1513.md`
- Mevcut: `*The Innovator's Dilemma* (*Yıkıcı İnovasyon*),`
- Öneri: `*The Innovator's Dilemma*,`
- Gerekçe: Kitabın Türkçe baskı adı İngilizce metne sızmış; diğer en hikâyelerinde (ör. 1282, 1292) yalnızca özgün kitap adı veriliyor. İngilizce okur için anlamsız.
- Güven: Yüksek

### YK-EN-010 — en — story_id 1552

- Durum: Bekliyor
- Tür: Yazım
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/en/1552.md`
- Mevcut: `a team that cannot admit a mistake in front of each other`
- Öneri: `a team whose members cannot admit mistakes to each other`
- Gerekçe: Tekil "a team" öznesiyle karşılıklı "each other" uyumsuz; özne çoğul üyelere bağlanmalı.
- Güven: Yüksek

### YK-EN-011 — en — story_id 1554

- Durum: Bekliyor
- Tür: Yazım
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/en/1554.md`
- Mevcut: `but the team's isn't.`
- Öneri: `but the team's aren't.`
- Gerekçe: Elips "the team's [targets]" çoğul; fiil "aren't" olmalı.
- Güven: Yüksek

### YK-EN-012 — en — story_id 1554

- Durum: Bekliyor
- Tür: Dil
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/en/1554.md`
- Mevcut: `a perfectly reasonable reason`
- Öneri: `a perfectly good reason`
- Gerekçe: "reasonable reason" rahatsız edici kök tekrarı; ana dili İngilizce editör düzeltir.
- Güven: Yüksek

### YK-EN-013 — en — story_id 1568

- Durum: Bekliyor
- Tür: Dil
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/en/1568.md`
- Mevcut: `*The Talent Code* (*Yetenek Kodu*),`
- Öneri: `*The Talent Code*,`
- Gerekçe: Kitabın Türkçe baskı adı İngilizce metne sızmış; diğer en hikâyelerinde (ör. 1282, 1292) yalnızca özgün kitap adı veriliyor. İngilizce okur için anlamsız.
- Güven: Yüksek

### YK-EN-014 — en — story_id 1603

- Durum: Bekliyor
- Tür: Dil
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/en/1603.md`
- Mevcut: `*The Wim Hof Method* (*Soğuk Yöntem*),`
- Öneri: `*The Wim Hof Method*,`
- Gerekçe: Kitabın Türkçe baskı adı İngilizce metne sızmış; diğer en hikâyelerinde (ör. 1282, 1292) yalnızca özgün kitap adı veriliyor. İngilizce okur için anlamsız.
- Güven: Yüksek

## Uygulama günlüğü

- Henüz değişiklik uygulanmadı; kullanıcı onayı bekleniyor.

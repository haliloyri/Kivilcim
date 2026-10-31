# Hikâye Yazım Kontrolü — Sürüm 1 — Almanca (de)

- Denetim zamanı: 2026-10-30 18:54 +03
- Veri kaynağı: `assets/albor.db` (dışa aktarım: `proof-de-s1.json`, 20 hikâye, sürüm etiketi `SON55`)
- Dışa aktarımdaki veri tabanı SHA-256: `18d6ba89589616348273cb719a832681332b2df6b48caf9a8fdf6e300f2727de`
- Denetim anındaki veri tabanı SHA-256: `80309d0efe40f3e85d9e0ab2fa2a83fdf98aaac8a9c0920cdc9f9f6789f2cb6c` (farklı; uygulamadan önce hedef alanlar yeniden doğrulanmalı)
- Dil: `de`
- Story ID'ler: 1276, 1282, 1284, 1291, 1292, 1294, 1295, 1303, 1327, 1417, 1474, 1483, 1513, 1552, 1553, 1554, 1568, 1569, 1603, 1612
- İncelenen alanlar: `title`, `description`, `content`, `hook`, `punchline`, `thirty_sec`, `key_contrast` (doldurulmuş olanların tümü)
- Denetim durumu: Tamamlandı
- Sonuç: 21 bekleyen öneri (5 Yazım, 16 Dil)

## Kapsam sorunları

- 20 hikâyenin tamamında `story_conversation_variants.question` boş (kapsam notu, yazım bulgusu değil).
- Her `Mevcut` parçası ilgili DB alanında ve kaynak dosyada tam bir kez geçiyor (betikle doğrulandı).
- Markup token'ları (`##`, `~~`, `::`, `$$`, `&&`, `%%`, `@@`, `[[...]]`) hiçbir öneride değişmiyor.
- Hitap: 8 hikâyenin `hook` alanı "Sie" kullanıyor (1276, 1327, 1553, 1554, 1568, 1569, 1603, 1612); diğer alanlar ve `lang-config.mjs` "du". Her biri ayrı bulgu.

## Öneriler

### YK-DE-001 — de — story_id 1276

- Durum: Bekliyor
- Tür: Dil
- Alan hedefleri: `story_translations.hook`
- Kaynak dosya: `staging/p1-writer/meta/1276.json` (alan `de.hook`)
- Mevcut: `Wählen Sie frühe Teamkollegen`
- Öneri: `Wählst du frühe Teamkollegen`
- Gerekçe: Hikâyenin geri kalanı ve `scripts/p1/lang-config.mjs` Almanca hitap olarak "du" tanımlıyor; bu alandaki "Sie" hitabı tutarsız.
- Güven: Yüksek

### YK-DE-002 — de — story_id 1276

- Durum: Bekliyor
- Tür: Yazım
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/de/1276.md`
- Mevcut: `den Spitznamen PayPal Mafia bekommen`
- Öneri: `den Spitznamen PayPal-Mafia bekommen`
- Gerekçe: Almanca bileşikte özel isim + ortak isim tire ile bağlanır (Durchkopplung); `one_minute_summary` de `PayPal-Mafia` yazıyor.
- Güven: Yüksek

### YK-DE-003 — de — story_id 1284

- Durum: Bekliyor
- Tür: Yazım
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/de/1284.md`
- Mevcut: `Der Schatz ist nie fortgewesen.`
- Öneri: `Der Schatz ist nie fort gewesen.`
- Gerekçe: 2006 imla reformundan beri "fort sein" ayrı yazılır; Partizip: "fort gewesen".
- Güven: Yüksek

### YK-DE-004 — de — story_id 1292

- Durum: Bekliyor
- Tür: Dil
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/de/1292.md`
- Mevcut: `Frag, was deine Arbeit dir zu eigen macht.`
- Öneri: `Frag, was dir deine Arbeit an Eigentum bringt.`
- Gerekçe: "sich etwas zu eigen machen" "benimsemek" demektir; burada kastedilen "sahip olunan şey" anlamını vermiyor (İngilizce "make yours" aktarımı).
- Güven: Yüksek

### YK-DE-005 — de — story_id 1327

- Durum: Bekliyor
- Tür: Dil
- Alan hedefleri: `story_translations.hook`
- Kaynak dosya: `staging/p1-writer/meta/1327.json` (alan `de.hook`)
- Mevcut: `würde Sie auf dem Blatt`
- Öneri: `würde dich auf dem Blatt`
- Gerekçe: Hikâyenin geri kalanı ve `scripts/p1/lang-config.mjs` Almanca hitap olarak "du" tanımlıyor; bu alandaki "Sie" hitabı tutarsız. Aynı soru `[[reflect]]` içinde "dich" ile geçiyor.
- Güven: Yüksek

### YK-DE-006 — de — story_id 1417

- Durum: Bekliyor
- Tür: Yazım
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/de/1417.md`
- Mevcut: `Renee Mauborgne`
- Öneri: `Renée Mauborgne`
- Gerekçe: Yazarın adı "Renée Mauborgne" (aksanlı é); es sürümü de böyle yazıyor.
- Güven: Yüksek

### YK-DE-007 — de — story_id 1417

- Durum: Bekliyor
- Tür: Dil
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/de/1417.md`
- Mevcut: `und keine mehreren Manegen`
- Öneri: `und nicht mehrere Manegen`
- Gerekçe: "keine mehreren" dilbilgisel değil; "mehrere" olumsuzlamada "nicht mehrere" ister.
- Güven: Yüksek

### YK-DE-008 — de — story_id 1483

- Durum: Bekliyor
- Tür: Dil
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/de/1483.md`
- Mevcut: `um zu beurteilen, ob er beschädigt war`
- Öneri: `um zu klären, ob er beschädigt war`
- Gerekçe: Önceki cümle de "ließ sich der Schaden nicht beurteilen" ile bitiyor; art arda iki "beurteilen" rahatsız edici tekrar.
- Güven: Yüksek

### YK-DE-009 — de — story_id 1483

- Durum: Bekliyor
- Tür: Dil
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/de/1483.md`
- Mevcut: `beim Verteidigungspersonal`
- Öneri: `beim Verteidigungsministerium`
- Gerekçe: "Verteidigungspersonal" İngilizce "Department of Defense personnel" kalıbının birebir aktarımı; Almancada kurum adı "Verteidigungsministerium" ile kurulur.
- Güven: Yüksek

### YK-DE-010 — de — story_id 1513

- Durum: Bekliyor
- Tür: Dil
- Alan hedefleri: `story_conversation_variants.punchline`
- Kaynak dosya: `staging/p1-writer/de/1513.variants.json`
- Mevcut: `genau das Zuhören auf sie kostete`
- Öneri: `genau das Hören auf sie kostete`
- Gerekçe: "zuhören" dativ alır ("ihnen zuhören"); "Zuhören auf" yanlış edat. Doğru kalıp "auf jemanden hören" → "das Hören auf sie".
- Güven: Yüksek

### YK-DE-011 — de — story_id 1552

- Durum: Bekliyor
- Tür: Dil
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/de/1552.md`
- Mevcut: `würde dort gern ein zweites Augenpaar draufsetzen`
- Öneri: `würde dort gern ein zweites Augenpaar draufschauen lassen`
- Gerekçe: "Augenpaar draufsetzen" anlamsız bir eşdizim; "draufschauen lassen" doğal ifade.
- Güven: Yüksek

### YK-DE-012 — de — story_id 1553

- Durum: Bekliyor
- Tür: Dil
- Alan hedefleri: `story_translations.hook`
- Kaynak dosya: `staging/p1-writer/meta/1553.json` (alan `de.hook`)
- Mevcut: `aus Ihrer letzten Besprechung haben Sie erst danach`
- Öneri: `aus deiner letzten Besprechung hast du erst danach`
- Gerekçe: Hikâyenin geri kalanı ve `scripts/p1/lang-config.mjs` Almanca hitap olarak "du" tanımlıyor; bu alandaki "Sie" hitabı tutarsız.
- Güven: Yüksek

### YK-DE-013 — de — story_id 1554

- Durum: Bekliyor
- Tür: Dil
- Alan hedefleri: `story_translations.hook`
- Kaynak dosya: `staging/p1-writer/meta/1554.json` (alan `de.hook`)
- Mevcut: `wie Ihre Arbeit gemessen wird, Sie zu den eigenen Zahlen`
- Öneri: `wie deine Arbeit gemessen wird, dich zu den eigenen Zahlen`
- Gerekçe: Hikâyenin geri kalanı ve `scripts/p1/lang-config.mjs` Almanca hitap olarak "du" tanımlıyor; bu alandaki "Sie" hitabı tutarsız.
- Güven: Yüksek

### YK-DE-014 — de — story_id 1568

- Durum: Bekliyor
- Tür: Yazım
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/de/1568.md`
- Mevcut: `Wer erzählt, sie wolle ihren Enkeln`
- Öneri: `Wer erzählt, er wolle seinen Enkeln`
- Gerekçe: Genel "wer" zamiri eril uyum ister ("wer …, er"); "wer … sie" Kongruenz hatası.
- Güven: Yüksek

### YK-DE-015 — de — story_id 1568

- Durum: Bekliyor
- Tür: Dil
- Alan hedefleri: `story_translations.hook`
- Kaynak dosya: `staging/p1-writer/meta/1568.json` (alan `de.hook`)
- Mevcut: `von Ihrem künftigen Ich hielt Sie jahrelang`
- Öneri: `von deinem künftigen Ich hielt dich jahrelang`
- Gerekçe: Hikâyenin geri kalanı ve `scripts/p1/lang-config.mjs` Almanca hitap olarak "du" tanımlıyor; bu alandaki "Sie" hitabı tutarsız.
- Güven: Yüksek

### YK-DE-016 — de — story_id 1569

- Durum: Bekliyor
- Tür: Dil
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/de/1569.md`
- Mevcut: `in die Top 20 der Frauen hervor als`
- Öneri: `in die Top 20 der Frauen als`
- Gerekçe: "hervorbringen" ile "in die Top 20 bringen" karışmış; "in die Top 20 … hervorbringen" bozuk yapı. "hervor" atılınca cümle düzgün.
- Güven: Yüksek

### YK-DE-017 — de — story_id 1569

- Durum: Bekliyor
- Tür: Dil
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/de/1569.md`
- Mevcut: `nur für ein paar jüngere Jahre`
- Öneri: `nur für ein paar zurückliegende Jahre`
- Gerekçe: "jüngere Jahre" Almancada "gençlik yılları" demek; kastedilen "yakın geçmişteki yıllar" (İngilizce "recent years" aktarımı).
- Güven: Yüksek

### YK-DE-018 — de — story_id 1569

- Durum: Bekliyor
- Tür: Dil
- Alan hedefleri: `story_translations.hook`
- Kaynak dosya: `staging/p1-writer/meta/1569.json` (alan `de.hook`)
- Mevcut: `würden Sie langsam proben`
- Öneri: `würdest du langsam proben`
- Gerekçe: Hikâyenin geri kalanı ve `scripts/p1/lang-config.mjs` Almanca hitap olarak "du" tanımlıyor; bu alandaki "Sie" hitabı tutarsız.
- Güven: Yüksek

### YK-DE-019 — de — story_id 1603

- Durum: Bekliyor
- Tür: Dil
- Alan hedefleri: `story_translations.hook`
- Kaynak dosya: `staging/p1-writer/meta/1603.json` (alan `de.hook`)
- Mevcut: `Behauptung, die Sie geglaubt haben`
- Öneri: `Behauptung, die du geglaubt hast`
- Gerekçe: Hikâyenin geri kalanı ve `scripts/p1/lang-config.mjs` Almanca hitap olarak "du" tanımlıyor; bu alandaki "Sie" hitabı tutarsız. Not: Aynı hook içinde "Beruhte" fiili değişmez.
- Güven: Yüksek

### YK-DE-020 — de — story_id 1612

- Durum: Bekliyor
- Tür: Yazım
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/de/1612.md`
- Mevcut: `viel besitzen, und kann trotzdem`
- Öneri: `viel besitzen und kann trotzdem`
- Gerekçe: Aynı özneye bağlı iki yüklemi bağlayan "und" önüne virgül konmaz.
- Güven: Yüksek

### YK-DE-021 — de — story_id 1612

- Durum: Bekliyor
- Tür: Dil
- Alan hedefleri: `story_translations.hook`
- Kaynak dosya: `staging/p1-writer/meta/1612.json` (alan `de.hook`)
- Mevcut: `Haben Sie schon einmal gegenübergestellt, was Sie verdient und was Sie behalten haben?`
- Öneri: `Hast du schon einmal gegenübergestellt, was du verdient und was du behalten hast?`
- Gerekçe: Hikâyenin geri kalanı ve `scripts/p1/lang-config.mjs` Almanca hitap olarak "du" tanımlıyor; bu alandaki "Sie" hitabı tutarsız.
- Güven: Yüksek

## Uygulama günlüğü

- Henüz değişiklik uygulanmadı; kullanıcı onayı bekleniyor.

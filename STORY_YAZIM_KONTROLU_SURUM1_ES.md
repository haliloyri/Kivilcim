# İspanyolca Hikâye Yazım/Dil Kontrolü — Sürüm 1 (SON55)

- Denetim zamanı: 2026-10-30 18:54 +03
- Veri kaynağı: `assets/albor.db` (dışa aktarım: `proof-es-s1.json`)
- Veri tabanı SHA-256: `18d6ba89589616348273cb719a832681332b2df6b48caf9a8fdf6e300f2727de`
- Diller: `es`
- Kapsam: 20 hikâye (story_id 1276, 1282, 1284, 1291, 1292, 1294, 1295, 1303, 1327, 1417, 1474, 1483, 1513, 1552, 1553, 1554, 1568, 1569, 1603, 1612)
- Denetim durumu: Tamamlandı
- İncelenen kayıt: 20 / 20 dil kaydı
- Sonuç: 12 bekleyen öneri (Yazım: 4, Dil: 8)

## İlerleme

| Dil | Durum | Tamamlanan parça | İncelenen | Bulgu | Son story_id |
|---|---|---:|---:|---:|---:|
| es | Tamamlandı | 1 | 20 | 12 | 1612 |

## Parça günlüğü

| Dil | Parça | Story ID aralığı | Kayıt | Bulgu | Durum |
|---|---:|---|---:|---:|---|
| es | 1 | 1276–1612 (20 seçili id) | 20 | 12 | Tamamlandı |

## Kapsam sorunları

- `story_conversation_variants.question` 20 kaydın tamamında boş (p1v2 formatında beklenen durum); bulgu sayılmadı.
- Alan → kaynak eşlemesi: `content` → `es/<id>.md`; `title`/`description`/`hook` → `meta/<id>.json` (`es` anahtarı); `punchline`/`thirty_sec`/`key_contrast` → `es/<id>.variants.json`.
- Her "Mevcut" parçası ilgili alanda tam bir kez geçtiği betikle doğrulandı. Markup token'larına (`##`, `$$`, `&&`, `%%`, `@@`, `[[...]]`) dokunan öneri yok.

## Öneriler

### YK-ES-001 — es — story_id 1276

- Durum: Bekliyor
- Tür: Yazım
- Alan hedefleri: `story_translations.description`
- Kaynak dosya: `staging/p1-writer/meta/1276.json`
- Mevcut: `y otras remontan a una pequeña startup`
- Öneri: `y otras se remontan a una pequeña startup`
- Gerekçe: "Remontar" en el sentido de "tener origen en" es pronominal: "remontarse a".
- Güven: Yüksek

### YK-ES-002 — es — story_id 1284

- Durum: Bekliyor
- Tür: Yazım
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/es/1284.md`
- Mevcut: `ya lo han robado en Tánger`
- Öneri: `ya le han robado en Tánger`
- Gerekçe: Con "robar", la persona despojada es complemento indirecto ("le"); "lo han robado" significa que lo robaron a él como objeto.
- Güven: Yüksek

### YK-ES-003 — es — story_id 1291

- Durum: Bekliyor
- Tür: Dil
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/es/1291.md`
- Mevcut: `Casi siempre estaba en la acera de enfrente.`
- Öneri: `Padre Rico casi siempre estaba en la acera de enfrente.`
- Gerekçe: La oración no tiene sujeto recuperable (el párrafo anterior habla de los dos chicos); hay que explicitar a quién se refiere.
- Güven: Yüksek

### YK-ES-004 — es — story_id 1474

- Durum: Bekliyor
- Tür: Yazım
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/es/1474.md`
- Mevcut: `de la misma clase, por eso pueden`
- Öneri: `de la misma clase; por eso pueden`
- Gerekçe: Dos oraciones independientes unidas por coma ante "por eso"; la norma pide punto y coma (o punto).
- Güven: Yüksek

### YK-ES-005 — es — story_id 1483

- Durum: Bekliyor
- Tür: Dil
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/es/1483.md`
- Mevcut: `donde las malas noticias cuesten de subir hacia arriba`
- Öneri: `donde a las malas noticias les cueste llegar arriba`
- Gerekçe: "Costar de + infinitivo" no es estándar (se dice "costarle a algo + infinitivo") y "subir hacia arriba" es redundante.
- Güven: Yüksek

### YK-ES-006 — es — story_id 1513

- Durum: Bekliyor
- Tür: Dil
- Alan hedefleri: `story_translations.description`
- Kaynak dosya: `staging/p1-writer/meta/1513.json`
- Mevcut: `a sus clientes y se encogieron de hombros`
- Öneri: `a sus clientes, y estos se encogieron de hombros`
- Gerekçe: Sin sujeto explícito, "se encogieron de hombros" se atribuye a los ingenieros; quienes se encogen de hombros son los clientes.
- Güven: Yüksek

### YK-ES-007 — es — story_id 1552

- Durum: Bekliyor
- Tür: Dil
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/es/1552.md`
- Mevcut: `usa un ejercicio de personal muy sencillo`
- Öneri: `usa un sencillo ejercicio de historias personales`
- Gerekçe: "Ejercicio de personal" significa "ejercicio de plantilla/RR. HH."; el ejercicio de Lencioni es de historias personales (calco de "personal histories").
- Güven: Yüksek

### YK-ES-008 — es — story_id 1568

- Durum: Bekliyor
- Tür: Yazım
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/es/1568.md`
- Mevcut: `y la ignición lo que lleva al niño`
- Öneri: `y la ignición, lo que lleva al niño`
- Gerekçe: Elipsis verbal ("pone"): la RAE exige coma en el lugar del verbo omitido.
- Güven: Yüksek

### YK-ES-009 — es — story_id 1568

- Durum: Bekliyor
- Tür: Dil
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/es/1568.md`
- Mevcut: `empieza a parecerle valer la pena`
- Öneri: `empieza a parecerle que vale la pena`
- Gerekçe: "Parecerle valer" es un calco forzado; en español se construye "parecerle que vale la pena".
- Güven: Yüksek

### YK-ES-010 — es — story_id 1569

- Durum: Bekliyor
- Tür: Dil
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/es/1569.md`
- Mevcut: `una pista cubierta, según su descripción deteriorada, en un clima helado`
- Öneri: `una pista cubierta, deteriorada según su descripción, en un clima helado`
- Gerekçe: El orden actual hace que "deteriorada" califique a "descripción"; debe calificar a la pista.
- Güven: Yüksek

### YK-ES-011 — es — story_id 1569

- Durum: Bekliyor
- Tür: Dil
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/es/1569.md`
- Mevcut: `La cifra abarca solo unos pocos años recientes`
- Öneri: `La cifra abarca solo ese breve periodo reciente`
- Gerekçe: Repite literalmente "unos pocos años recientes" de la oración anterior.
- Güven: Yüksek

### YK-ES-012 — es — story_id 1569

- Durum: Bekliyor
- Tür: Dil
- Alan hedefleri: `story_conversation_variants.punchline`
- Kaynak dosya: `staging/p1-writer/es/1569.variants.json`
- Mevcut: `formó más top 20 femeninas que`
- Öneri: `formó más jugadoras del top 20 que`
- Gerekçe: "Top 20" no funciona como sustantivo contable ("más top 20 femeninas"); se dice "jugadoras del top 20".
- Güven: Yüksek

## Uygulama günlüğü

- Henüz değişiklik uygulanmadı; kullanıcı onayı bekleniyor.

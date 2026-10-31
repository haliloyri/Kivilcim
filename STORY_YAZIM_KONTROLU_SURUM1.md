# Türkçe Hikâye Yazım ve Dil Kontrolü — Sürüm 1 (20 hikâye)

- Denetim zamanı: 2026-10-30 18:42 +03
- Veri kaynağı: `assets/albor.db` (dışa aktarım: `proof-tr-s1.json`)
- Veri tabanı SHA-256: `0eb07ea9662643c629384d1af2661dc7c13707c18b3526774c2034fad7371a9d`
- Diller: yalnızca `tr`
- Kapsam: 20 story_id — `1276`, `1282`, `1284`, `1291`, `1292`, `1294`, `1295`, `1303`, `1327`, `1417`, `1474`, `1483`, `1513`, `1552`, `1553`, `1554`, `1568`, `1569`, `1603`, `1612`
- İncelenen alanlar: `title`, `description`, `content`, `hook`, `punchline`, `thirty_sec`, `question`, `key_contrast` (dolu olanlar)
- Denetim durumu: Tamamlandı
- İncelenen kayıt: 20 / 20 tr kaydı
- Sonuç: 32 bekleyen öneri (7 Yazım, 25 Dil)

## İlerleme

| Dil | Durum | Tamamlanan parça | İncelenen | Bulgu | Son story_id |
|---|---|---:|---:|---:|---:|
| tr | Tamamlandı | 1 | 20 | 32 | 1612 |

## Parça günlüğü

| Dil | Parça | Story ID aralığı | Kayıt | Bulgu | Durum |
|---|---:|---|---:|---:|---|
| tr | 1 | 1276–1612 (seçili 20 id) | 20 | 32 | Tamamlandı |

## Kapsam sorunları

- `question` alanı 20 kaydın tamamında boş (dışa aktarım `emptyFields`); yazım bulgusu değil, kapsam notu.
- Mevcut `STORY_YAZIM_KONTROLU.md` raporuna dokunulmadı; bu rapor ayrı tutuldu (ID öneki `YK-S1-`).
- Hikâye 1303 `content` alanı yakın zamanda düzeltilmiş olsa da yeniden tarandı.
- `thirty_sec` metni `staging/p1-writer/meta/<id>.json` içinde `one_minute_summary` olarak da yer alabilir; uygulamada senkron tutulmalı.

## Öneriler

### YK-S1-001 — tr — story_id 1276

- Durum: Uygulandı
- Tür: Dil
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/tr/1276.md`
- Mevcut: `isimlerin ne kadar çoğu bu tek kökten`
- Öneri: `isimlerin ne kadar çoğunun bu tek kökten`
- Gerekçe: Yan cümlede özne iyelik/ilgi eki almalı ("-nın ... çıktığını"); mevcut hâli söz dizimini bozuyor.
- Güven: Yüksek

### YK-S1-002 — tr — story_id 1282

- Durum: Uygulandı
- Tür: Dil
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/tr/1282.md`
- Mevcut: `bırakmadan önce işin hangi yanını tutup neyi önce deneyebileceğimize`
- Öneri: `bırakmadan önce neyi deneyebileceğimize`
- Gerekçe: "işin hangi yanını tutup" anlamsız/devrik; cümle akmıyor. Sadeleştirme olgu değiştirmiyor.
- Güven: Yüksek

### YK-S1-003 — tr — story_id 1284

- Durum: Reddedildi (içerik siliyor)
- Tür: Dil
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/tr/1284.md`
- Mevcut: `rehberliğinde yürümüştür. Fatima vahada beklemektedir. Şimdi`
- Öneri: `rehberliğinde yürümüştür. Şimdi`
- Gerekçe: Önceki cümle zaten "Fatima'yı bekler halde bırakmış" diyor; hemen ardından aynı bilginin tekrarı rahatsız edici.
- Güven: Yüksek

### YK-S1-004 — tr — story_id 1292

- Durum: Uygulandı
- Tür: Dil
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/tr/1292.md`
- Mevcut: `Yani bir restoranın ne sattığından`
- Öneri: `Bir restoranın ne sattığından`
- Gerekçe: Bir önceki cümle de "yani" içeriyor; art arda iki "yani" tekrarı.
- Güven: Yüksek

### YK-S1-005 — tr — story_id 1294

- Durum: Uygulandı
- Tür: Dil
- Alan hedefleri: `story_conversation_variants.punchline`
- Kaynak dosya: `staging/p1-writer/tr/1294.variants.json`
- Mevcut: `birinin istemediği bir ürünü`
- Öneri: `kimsenin istemediği bir ürünü`
- Gerekçe: "birinin istemediği" = "birisinin istemediği"; kastedilen "hiç kimsenin istemediği". Anlam bozuluyor.
- Güven: Yüksek

### YK-S1-006 — tr — story_id 1295

- Durum: Uygulandı
- Tür: Yazım
- Alan hedefleri: `story_conversation_variants.key_contrast`
- Kaynak dosya: `staging/p1-writer/tr/1295.variants.json`
- Mevcut: `Hiçbir şey yapmanın bedeli`
- Öneri: `Hiçbir şey yapmamanın bedeli`
- Gerekçe: Yanlış kelime: hikâyenin tamamı "yapmamanın bedeli"ni anlatıyor; olumsuzluk eki düşmüş, anlam tersine dönüyor.
- Güven: Yüksek

### YK-S1-007 — tr — story_id 1295

- Durum: Uygulandı
- Tür: Dil
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/tr/1295.md`
- Mevcut: `artık somut bir durum durur`
- Öneri: `artık somut bir durum vardır`
- Gerekçe: "durum durur" ses ve kelime tekrarı; editörce mutlaka düzeltilir.
- Güven: Yüksek

### YK-S1-008 — tr — story_id 1303

- Durum: Uygulandı
- Tür: Dil
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/tr/1303.md`
- Mevcut: `Sonra Şükran Günü'nden önceki çarşamba gelir. Hindinin başına beklenmedik bir şey gelir`
- Öneri: `Sonra Şükran Günü'nden önceki çarşamba gelir. Hindi beklenmedik bir şeyle karşılaşır`
- Gerekçe: Art arda iki cümle "gelir" ile bitiyor; rahatsız edici tekrar.
- Güven: Yüksek

### YK-S1-009 — tr — story_id 1303

- Durum: Uygulandı
- Tür: Dil
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/tr/1303.md`
- Mevcut: `o müşteriye bağımlılığı gözden uzak tutar`
- Öneri: `o müşteriye bağımlılığını gözden kaçırır`
- Gerekçe: "gözden uzak tutmak" (saklamak) kastedilen anlamı (fark etmemek) vermiyor; iyelik eki de eksik.
- Güven: Yüksek

### YK-S1-010 — tr — story_id 1303

- Durum: Uygulandı
- Tür: Dil
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/tr/1303.md`
- Mevcut: `Hindi en güvende, son günde hissetti`
- Öneri: `Hindi kendini en güvende son gününde hissetti`
- Gerekçe: "hissetmek" nesnesiz kalmış ("kendini"); virgül cümleyi bölüyor.
- Güven: Yüksek

### YK-S1-011 — tr — story_id 1327

- Durum: Uygulandı
- Tür: Dil
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/tr/1327.md`
- Mevcut: `Bunu kâğıtta kendi el yazınızla görmek soruyu`
- Öneri: `Bunu kâğıtta kendi el yazısıyla görmek, soruyu`
- Gerekçe: Örnek üçüncü tekil kişiyle (tezgâhtar) anlatılırken "el yazınızla" ikinci çoğula kayıyor, cümle sonu yine üçüncü kişi ("edeceğine"); kişi uyumsuzluğu.
- Güven: Yüksek

### YK-S1-012 — tr — story_id 1327

- Durum: Uygulandı
- Tür: Dil
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/tr/1327.md`
- Mevcut: `otuzarlık üç sütun`
- Öneri: `otuzar satırlık üç sütun`
- Gerekçe: "otuzarlık" Türkçede yerleşik bir kullanım değil; metnin geri kalanı "otuzar satır" diyor.
- Güven: Yüksek

### YK-S1-013 — tr — story_id 1417

- Durum: Uygulandı
- Tür: Yazım
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/tr/1417.md`
- Mevcut: `Sektör düşüştedeydi.`
- Öneri: `Sektör düşüşteydi.`
- Gerekçe: Fazladan hece: "düşüşte" + "-ydi". (Cümle bir önceki cümleyle de anlamca örtüşüyor; tamamen çıkarılması da düşünülebilir.)
- Güven: Yüksek

### YK-S1-014 — tr — story_id 1417

- Durum: Uygulandı
- Tür: Yazım
- Alan hedefleri: `story_translations.description`, `story_conversation_variants.thirty_sec`
- Kaynak dosya: `staging/p1-writer/meta/1417.json`, `staging/p1-writer/tr/1417.variants.json` (meta dosyasında parça 2 kez geçer: `description` ve `one_minute_summary`)
- Mevcut: `Quebec'li`
- Öneri: `Quebecli`
- Gerekçe: Özel isimlere gelen yapım eki (-li) kesmeyle ayrılmaz (TDK: Ankaralı, Londralı).
- Güven: Yüksek

### YK-S1-015 — tr — story_id 1417

- Durum: Uygulandı
- Tür: Dil
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/tr/1417.md`
- Mevcut: `bir asırdan uzun sürede ulaştığı gelir düzeyine ulaştı`
- Öneri: `bir asırdan uzun sürede ulaştığı gelir düzeyini yakaladı`
- Gerekçe: Aynı cümlede "sürede ... sürede" ve "ulaştığı ... ulaştı" çift tekrarı.
- Güven: Yüksek

### YK-S1-016 — tr — story_id 1417

- Durum: Uygulandı
- Tür: Dil
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/tr/1417.md`
- Mevcut: `Rakibi kopyalamaya giden çaba, böylece farklı`
- Öneri: `Rakibi kopyalamaya harcanacak çaba, farklı`
- Gerekçe: Bir önceki cümle de "Böylece" ile başlıyor; art arda tekrar.
- Güven: Yüksek

### YK-S1-017 — tr — story_id 1474

- Durum: Uygulandı
- Tür: Dil
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/tr/1474.md`
- Mevcut: `İş dünyasından örneği, Peugeot`
- Öneri: `İş dünyasından verdiği örnek Peugeot`
- Gerekçe: "örneği," öznesi belirsiz ve virgül yanlış; doğal kuruluş "verdiği örnek".
- Güven: Yüksek

### YK-S1-018 — tr — story_id 1474

- Durum: Uygulandı
- Tür: Dil
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/tr/1474.md`
- Mevcut: `herkes değerli olduğunda anlaştığı için`
- Öneri: `herkes değerli olduğu konusunda anlaştığı için`
- Gerekçe: "olduğunda" (-dığı zaman) yanlış ek; kastedilen "değerli olduğu konusunda". Anlam bozuluyor.
- Güven: Yüksek

### YK-S1-019 — tr — story_id 1483

- Durum: Uygulandı
- Tür: Dil
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/tr/1483.md`
- Mevcut: `kararın önünde sorulduğunda`
- Öneri: `kararın öncesinde sorulduğunda`
- Gerekçe: "kararın önünde" mekânsal; zaman için "öncesinde" doğal Türkçe.
- Güven: Yüksek

### YK-S1-020 — tr — story_id 1513

- Durum: Reddedildi (anlam değiştiriyor)
- Tür: Dil
- Alan hedefleri: `story_conversation_variants.thirty_sec`
- Kaynak dosya: `staging/p1-writer/tr/1513.variants.json`
- Mevcut: `sektörün her küçülmesinde`
- Öneri: `sürücülerin her küçülüşünde`
- Gerekçe: Kastedilen sürücü boyutunun küçülmesi; "sektörün küçülmesi" pazarın daralması anlamına geliyor, anlam bozuluyor.
- Güven: Yüksek

### YK-S1-021 — tr — story_id 1552

- Durum: Uygulandı
- Tür: Dil
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/tr/1552.md`
- Mevcut: `size az pahalıya mal olacak`
- Öneri: `size pek pahalıya mal olmayacak`
- Gerekçe: "az pahalıya mal olmak" doğal değil; deyim "pahalıya mal olmak".
- Güven: Yüksek

### YK-S1-022 — tr — story_id 1553

- Durum: Uygulandı
- Tür: Yazım
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/tr/1553.md`
- Mevcut: `bir ekibi, sonrasında bekleyen`
- Öneri: `bir ekibin, sonrasında bekleyen`
- Gerekçe: Ek hatası: iyelik kuruluşu için ilgi eki gerekli ("ekibin ... bekleyen tartışma").
- Güven: Yüksek

### YK-S1-023 — tr — story_id 1553

- Durum: Uygulandı
- Tür: Dil
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/tr/1553.md`
- Mevcut: `ekibe anında izin verebilir, yani yapılanın`
- Öneri: `araya girip ekibe yapılanın`
- Gerekçe: "anında izin vermek" çeviri kokuyor ("real-time permission") ve Türkçede anlamsız; ardından gelen açıklama zaten anlamı veriyor.
- Güven: Yüksek

### YK-S1-024 — tr — story_id 1554

- Durum: Uygulandı
- Tür: Dil
- Alan hedefleri: `story_translations.description`
- Kaynak dosya: `staging/p1-writer/meta/1554.json`
- Mevcut: `Bir ekip üyelerinin kişisel hedefleri tutarken`
- Öneri: `Bir ekip, üyeleri kişisel hedeflerini tuttururken`
- Gerekçe: "Bir ekip üyelerinin" tamlama gibi okunuyor, özne kayboluyor; söz dizimi bozuk.
- Güven: Yüksek

### YK-S1-025 — tr — story_id 1554

- Durum: Uygulandı
- Tür: Yazım
- Alan hedefleri: `story_conversation_variants.thirty_sec`
- Kaynak dosya: `staging/p1-writer/tr/1554.variants.json`
- Mevcut: `iki çare önerir. Ekibin`
- Öneri: `iki çare önerir: ekibin`
- Gerekçe: Ardından gelen "... yazmak ve ... bağlamak." yüklemsiz bir parça; açıklama için iki nokta gerekli.
- Güven: Yüksek

### YK-S1-026 — tr — story_id 1568

- Durum: Uygulandı
- Tür: Dil
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/tr/1568.md`
- Mevcut: `Yine de verilen cevap`
- Öneri: `Ama verilen cevap`
- Gerekçe: Kısa paragrafta "Yine de" iki kez cümle başında.
- Güven: Yüksek

### YK-S1-027 — tr — story_id 1569

- Durum: Uygulandı
- Tür: Dil
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/tr/1569.md`
- Mevcut: `yavaş yavaş tekrar tekrar kesebilir`
- Öneri: `yavaşça ve tekrar tekrar kesebilir`
- Gerekçe: İki ikileme art arda; akışı bozuyor.
- Güven: Yüksek

### YK-S1-028 — tr — story_id 1603

- Durum: Uygulandı
- Tür: Yazım
- Alan hedefleri: `story_translations.description`
- Kaynak dosya: `staging/p1-writer/meta/1603.json`
- Mevcut: `çalışma var, ve ikisi`
- Öneri: `çalışma var ve ikisi`
- Gerekçe: "ve" bağlacından önce virgül konmaz.
- Güven: Yüksek

### YK-S1-029 — tr — story_id 1603

- Durum: Uygulandı
- Tür: Dil
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/tr/1603.md`
- Mevcut: `*The Wim Hof Method* kitabında bu tür`
- Öneri: `Hof, *The Wim Hof Method* kitabında bu tür`
- Gerekçe: Önceki cümlenin öznesi "Hava"; özne belirtilmeyince cümle havaya bağlanıyor.
- Güven: Yüksek

### YK-S1-030 — tr — story_id 1603

- Durum: Uygulandı
- Tür: Dil
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/tr/1603.md`
- Mevcut: `Bu çalışma yayımlanmış bir araştırmaya dayanır. Küçük bir çalışmada`
- Öneri: `Yayımlanmış küçük bir çalışmada`
- Gerekçe: Çalışma tanıtılmadan "Bu çalışma" deniyor; üç cümlede "çalışma/araştırma" tekrarı.
- Güven: Yüksek

### YK-S1-031 — tr — story_id 1603

- Durum: Uygulandı (değiştirilmiş öneri: `Bu sana neyin işe yaradığını söylüyor?`)
- Tür: Dil
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `staging/p1-writer/tr/1603.md`
- Mevcut: `Sana ne yaptığını söylüyor?`
- Öneri: `Sana tam olarak ne iyi geliyor?`
- Gerekçe: "What does it do for you" kalıbının birebir çevirisi; Türkçede anlamsız.
- Güven: Yüksek

### YK-S1-032 — tr — story_id 1612

- Durum: Uygulandı
- Tür: Yazım
- Alan hedefleri: `story_translations.content`, `story_conversation_variants.thirty_sec`
- Kaynak dosya: `staging/p1-writer/tr/1612.md`, `staging/p1-writer/tr/1612.variants.json`
- Mevcut: `yarısından azı olanlar`
- Öneri: `yarısından az olanlar`
- Gerekçe: "azı" iyelik eki yanlış; "beklenenin yarısından az olan" doğru kuruluş.
- Güven: Yüksek

## Uygulama günlüğü

- 2026-10-30: Kullanıcı onayı ("önerdiğin gibi"): 30 öneri uygulandı, YK-S1-003 ve YK-S1-020 reddedildi, YK-S1-031 değiştirilmiş metinle uygulandı. Betik `YK-\d{3}` biçimi istediği için plan ID'leri YK-901…YK-932 olarak eşlendi.
- Yedek: `/tmp/albor.db.before-proofread-2026-10-30T15-44-51-905Z`.
- Not: `apply-approved-fixes.mjs` aynı alana düşen birden çok düzeltmede yalnızca sonuncusunu yazdı (YK-908, 909, 911, 913, 915, 917, 922, 929, 930 kayboldu). Düzeltmeler staging dosyalarına (`staging/p1-writer/tr`, variants, meta) işlendi ve 20 hikâyenin tr `content` alanı staging md'den yeniden yazıldı.
- 1303 ve 1603 kısalıp 230 alt sınırının altına düştüğü için birer cümle uzatıldı (1303: "bin birinci gün"; 1603: "ise hiçbir eğitim"). `validate-dir.mjs tr`: 20/20 passed.

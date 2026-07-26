# Dört Dilde Hikâye Yazım Kontrolü

- Denetim zamanı: 2026-07-17 23:39 +03
- Veri kaynağı: `assets/kivilcim.db`
- Veri tabanı SHA-256: `5ca451052986d774faee47156b659a0935107b6d317279e7674f915e570596c8`
- Diller: `tr`, `en`, `es`, `de`
- Dil sırası: `tr → en → es → de`
- Parça büyüklüğü: 100 hikâye (ilk iki Türkçe parça önceki 25'lik ayarla tamamlandı)
- Denetim durumu: Devam ediyor
- Sıradaki: `tr`, `after_story_id: 1208`, parça 4
- İncelenen kayıt: 150 / 3000 dil kaydı
- Sonuç: 134 bekleyen öneri

## İlerleme

| Dil | Durum | Tamamlanan parça | İncelenen | Bulgu | Son story_id |
|---|---|---:|---:|---:|---:|
| tr | Devam ediyor | 3 | 150 | 134 | 1208 |
| en | Bekliyor | 0 | 0 | 0 | — |
| es | Bekliyor | 0 | 0 | 0 | — |
| de | Bekliyor | 0 | 0 | 0 | — |

## Parça günlüğü

| Dil | Parça | Story ID aralığı | Kayıt | Bulgu | Durum |
|---|---:|---|---:|---:|---|
| tr | 1 | 1059–1083 | 25 | 14 | Tamamlandı |
| tr | 2 | 1084–1108 | 25 | 27 | Tamamlandı |
| tr | 3 | 1109–1208 | 100 | 93 | Tamamlandı |

## Kapsam sorunları

- `story_id 1059–1083`: `hook` alanı 25 kayıtta; `punchline`, `thirty_sec`, `question` ve `key_contrast` alanlarının her biri 25 kayıtta boş. Eski katalog kapsam eksikliği olarak kaydedildi, yazım bulgusu sayılmadı.
- `story_id 1084–1108`: `hook` alanı 25 kayıtta; `punchline`, `thirty_sec`, `question` ve `key_contrast` alanlarının her biri 25 kayıtta boş. Eski katalog kapsam eksikliği olarak kaydedildi, yazım bulgusu sayılmadı.
- `story_id 1109–1208`: `hook` alanı 100 kayıtta; `punchline`, `thirty_sec`, `question` ve `key_contrast` alanlarının her biri 100 kayıtta boş. Eski katalog kapsam eksikliği olarak kaydedildi, yazım bulgusu sayılmadı.

## Öneriler

### YK-001 — tr — story_id 1059

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `milli`
- Öneri: `millî`
- Gerekçe: “Ulusal” anlamındaki kelimenin standart yazımı “millî”dir.
- Güven: Yüksek

### YK-002 — tr — story_id 1060

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.description`, `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `haline`
- Öneri: `hâline`
- Gerekçe: “Durum/biçim” anlamındaki “hâl” kelimesi düzeltme işaretiyle yazılır.
- Güven: Yüksek

### YK-003 — tr — story_id 1062

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `hale`
- Öneri: `hâle`
- Gerekçe: “Duruma/biçime getirmek” kullanımındaki “hâl” kelimesi düzeltme işaretiyle yazılır.
- Güven: Yüksek

### YK-004 — tr — story_id 1065

- Durum: Bekliyor
- Tür: Ayrı yazım
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `geribildirim`
- Öneri: `geri bildirim`
- Gerekçe: Birleşik terimin standart yazımı ayrıdır.
- Güven: Yüksek

### YK-005 — tr — story_id 1067

- Durum: Bekliyor
- Tür: Yazım
- Alan hedefleri: `story_translations.description`, `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `embelllik`
- Öneri: `tembellik`
- Gerekçe: “Tembellik” kelimesinde fazladan bir `l` bulunuyor; kısa parça hem küçük hem büyük harfle başlayan kullanımı güvenle kapsıyor.
- Güven: Yüksek

### YK-006 — tr — story_id 1068

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `hikayesi`
- Öneri: `hikâyesi`
- Gerekçe: “Hikâye” kelimesinin standart yazımında düzeltme işareti bulunur.
- Güven: Yüksek

### YK-007 — tr — story_id 1069

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.description`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `hale`
- Öneri: `hâle`
- Gerekçe: “Duruma/biçime getirmek” kullanımındaki “hâl” kelimesi düzeltme işaretiyle yazılır.
- Güven: Yüksek

### YK-008 — tr — story_id 1071

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `hale`
- Öneri: `hâle`
- Gerekçe: “Duruma/biçime getirmek” kullanımındaki “hâl” kelimesi düzeltme işaretiyle yazılır.
- Güven: Yüksek

### YK-009 — tr — story_id 1074

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `hikayeyi`
- Öneri: `hikâyeyi`
- Gerekçe: “Hikâye” kelimesinin standart yazımında düzeltme işareti bulunur.
- Güven: Yüksek

### YK-010 — tr — story_id 1074

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `zeka`
- Öneri: `zekâ`
- Gerekçe: Kelimenin standart yazımı “zekâ”dır.
- Güven: Yüksek

### YK-011 — tr — story_id 1076

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.description`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `halde`
- Öneri: `hâlde`
- Gerekçe: “Durumda/biçimde” anlamındaki “hâlde” düzeltme işaretiyle yazılır.
- Güven: Yüksek

### YK-012 — tr — story_id 1076

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `hikayede`
- Öneri: `hikâyede`
- Gerekçe: “Hikâye” kelimesinin standart yazımında düzeltme işareti bulunur.
- Güven: Yüksek

### YK-013 — tr — story_id 1077

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `hikayeyi`
- Öneri: `hikâyeyi`
- Gerekçe: “Hikâye” kelimesinin standart yazımında düzeltme işareti bulunur.
- Güven: Yüksek

### YK-014 — tr — story_id 1082

- Durum: Bekliyor
- Tür: Kesme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `"iyi'den mükemmel'e"`
- Öneri: `"iyiden mükemmele"`
- Gerekçe: Özel ad olmayan kelimelere gelen durum ekleri kesme işaretiyle ayrılmaz.
- Güven: Yüksek

### YK-015 — tr — story_id 1084

- Durum: Bekliyor
- Tür: Kesme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `İyi'den mükemmel'e`
- Öneri: `İyiden mükemmele`
- Gerekçe: Özel ad olmayan kelimelere gelen durum ekleri kesme işaretiyle ayrılmaz.
- Güven: Yüksek

### YK-016 — tr — story_id 1085

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `dükkan`
- Öneri: `dükkân`
- Gerekçe: Kelimenin standart yazımı “dükkân”dır; ek bu kökün üzerine gelir.
- Güven: Yüksek

### YK-017 — tr — story_id 1085

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `hikaye`
- Öneri: `hikâye`
- Gerekçe: “Hikâye” kökü standart yazımda düzeltme işareti taşır.
- Güven: Yüksek

### YK-018 — tr — story_id 1088

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `hikaye`
- Öneri: `hikâye`
- Gerekçe: “Hikâye” kökü standart yazımda düzeltme işareti taşır.
- Güven: Yüksek

### YK-019 — tr — story_id 1088

- Durum: Bekliyor
- Tür: Ondalık ayırıcı
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `1.2 milyar`
- Öneri: `1,2 milyar`
- Gerekçe: Türkçe sayı yazımında ondalık ayırıcı virgüldür.
- Güven: Yüksek

### YK-020 — tr — story_id 1091

- Durum: Bekliyor
- Tür: Yazım
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `retikular`
- Öneri: `retiküler`
- Gerekçe: Türkçe bilimsel terim “retiküler aktivasyon sistemi” biçimindedir.
- Güven: Yüksek

### YK-021 — tr — story_id 1092

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `imkansız`
- Öneri: `imkânsız`
- Gerekçe: Kelimenin standart yazımı “imkânsız”dır.
- Güven: Yüksek

### YK-022 — tr — story_id 1092

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `kağıda`
- Öneri: `kâğıda`
- Gerekçe: “Kâğıt” kökü standart yazımda düzeltme işareti taşır.
- Güven: Yüksek

### YK-023 — tr — story_id 1093

- Durum: Bekliyor
- Tür: Yazım
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `ferahliyor`
- Öneri: `ferahlıyor`
- Gerekçe: Şimdiki zaman ekinden önce eksik olan `l` harfi tamamlanmalıdır.
- Güven: Yüksek

### YK-024 — tr — story_id 1095

- Durum: Bekliyor
- Tür: Yazım
- Alan hedefleri: `story_translations.description`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `cenazenlerinde`
- Öneri: `cenazelerinde`
- Gerekçe: “Cenaze” kelimesinin çoğul iyelikli çekiminde fazladan `n` bulunuyor.
- Güven: Yüksek

### YK-025 — tr — story_id 1095

- Durum: Bekliyor
- Tür: Bitişik yazım
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `siz siniz`
- Öneri: `sizsiniz`
- Gerekçe: Ek fiil kişi eki kelimeye bitişik yazılır.
- Güven: Yüksek

### YK-026 — tr — story_id 1096

- Durum: Bekliyor
- Tür: Kesme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `Hitlerin`
- Öneri: `Hitler'in`
- Gerekçe: Kişi adına gelen iyelik eki kesme işaretiyle ayrılır.
- Güven: Yüksek

### YK-027 — tr — story_id 1097

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `hale`
- Öneri: `hâle`
- Gerekçe: “Duruma/biçime gelmek” kullanımındaki “hâl” kelimesi düzeltme işaretiyle yazılır.
- Güven: Yüksek

### YK-028 — tr — story_id 1098

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.description`, `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `zeka`
- Öneri: `zekâ`
- Gerekçe: “Zekâ” kökü standart yazımda düzeltme işareti taşır; iki çekimli kullanımı birlikte kapsar.
- Güven: Yüksek

### YK-029 — tr — story_id 1099

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.title`, `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `hikaye`
- Öneri: `hikâye`
- Gerekçe: “Hikâye” kökü standart yazımda düzeltme işareti taşır; başlık ve içerikteki çekimli kullanımları birlikte kapsar.
- Güven: Yüksek

### YK-030 — tr — story_id 1100

- Durum: Bekliyor
- Tür: Yazım
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `aldıklar çocuklar`
- Öneri: `aldıkları çocuklar`
- Gerekçe: Sıfat-fiilde üçüncü çoğul iyelik eki eksiktir.
- Güven: Yüksek

### YK-031 — tr — story_id 1100

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `Zeka`
- Öneri: `Zekâ`
- Gerekçe: “Zekâ” kelimesinin standart yazımında düzeltme işareti bulunur; içerikteki iki büyük harfli kullanımı kapsar.
- Güven: Yüksek

### YK-032 — tr — story_id 1100

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `zeka`
- Öneri: `zekâ`
- Gerekçe: “Zekâ” kökünün çekimli kullanımında düzeltme işareti korunur.
- Güven: Yüksek

### YK-033 — tr — story_id 1101

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `hale`
- Öneri: `hâle`
- Gerekçe: “Duruma/biçime gelmek” kullanımındaki “hâl” kelimesi düzeltme işaretiyle yazılır.
- Güven: Yüksek

### YK-034 — tr — story_id 1104

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `halindeydi`
- Öneri: `hâlindeydi`
- Gerekçe: “Durumda/biçimde” anlamındaki “hâl” kelimesi düzeltme işaretiyle yazılır.
- Güven: Yüksek

### YK-035 — tr — story_id 1105

- Durum: Bekliyor
- Tür: Özel ad yazımı
- Alan hedefleri: `story_translations.description`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `Napoleon'a`
- Öneri: `Napolyon'a`
- Gerekçe: Türkçe metinde kişi adının yerleşik yazımı “Napolyon”dur; içerikte de bu biçim kullanılmıştır.
- Güven: Yüksek

### YK-036 — tr — story_id 1105

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `hikaye`
- Öneri: `hikâye`
- Gerekçe: “Hikâye” kökü standart yazımda düzeltme işareti taşır.
- Güven: Yüksek

### YK-037 — tr — story_id 1105

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `hale`
- Öneri: `hâle`
- Gerekçe: “Duruma/biçime getirmek” kullanımındaki “hâl” kelimesi düzeltme işaretiyle yazılır.
- Güven: Yüksek

### YK-038 — tr — story_id 1107

- Durum: Bekliyor
- Tür: Tarihî dönem adı
- Alan hedefleri: `story_translations.description`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `ortaçağ`
- Öneri: `Orta Çağ`
- Gerekçe: Tarihî dönem adı ayrı yazılır ve iki kelimesi de büyük harfle başlar.
- Güven: Yüksek

### YK-039 — tr — story_id 1107

- Durum: Bekliyor
- Tür: Tarihî dönem adı
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `Ortaçağ`
- Öneri: `Orta Çağ`
- Gerekçe: Tarihî dönem adı ayrı yazılır.
- Güven: Yüksek

### YK-040 — tr — story_id 1108

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `Zeka`
- Öneri: `Zekâ`
- Gerekçe: Eser adındaki “zekâ” kelimesinin standart yazımında düzeltme işareti bulunur.
- Güven: Yüksek

### YK-041 — tr — story_id 1108

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `zeka`
- Öneri: `zekâ`
- Gerekçe: “Zekâ” kökünün çekimli kullanımında düzeltme işareti korunur.
- Güven: Yüksek

### YK-042 — tr — story_id 1109

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.description`, `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `zeka`
- Öneri: `zekâ`
- Gerekçe: Kelimenin standart yazımında gerekli düzeltme işareti korunur.
- Güven: Yüksek

### YK-043 — tr — story_id 1110

- Durum: Bekliyor
- Tür: Kesme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `sen'i`
- Öneri: `seni`
- Gerekçe: Özel ad olmayan sözcüğe gelen ek kesme işaretiyle ayrılmaz.
- Güven: Yüksek

### YK-044 — tr — story_id 1111

- Durum: Bekliyor
- Tür: Yazım
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `durdurulurak`
- Öneri: `durdurularak`
- Gerekçe: Metindeki açık harf, ek veya sözcük yazımı hatası düzeltilir.
- Güven: Yüksek

### YK-045 — tr — story_id 1111

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `haline`
- Öneri: `hâline`
- Gerekçe: Kelimenin standart yazımında gerekli düzeltme işareti korunur.
- Güven: Yüksek

### YK-046 — tr — story_id 1112

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `haline`
- Öneri: `hâline`
- Gerekçe: Kelimenin standart yazımında gerekli düzeltme işareti korunur.
- Güven: Yüksek

### YK-047 — tr — story_id 1112

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `hikaye`
- Öneri: `hikâye`
- Gerekçe: Kelimenin standart yazımında gerekli düzeltme işareti korunur.
- Güven: Yüksek

### YK-048 — tr — story_id 1114

- Durum: Bekliyor
- Tür: Yazım
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `Imkansız`
- Öneri: `İmkânsız`
- Gerekçe: Metindeki açık harf, ek veya sözcük yazımı hatası düzeltilir.
- Güven: Yüksek

### YK-049 — tr — story_id 1114

- Durum: Bekliyor
- Tür: Özel ad yazımı
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `Brookyn'in`
- Öneri: `Brooklyn'in`
- Gerekçe: Özel adın doğru ve tutarlı yazımı kullanılır.
- Güven: Yüksek

### YK-050 — tr — story_id 1115

- Durum: Bekliyor
- Tür: Dil bilgisi
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `tuttuğunuzla`
- Öneri: `tuttuğunla`
- Gerekçe: Cümledeki açık ek, kişi veya sözcük uyumsuzluğu düzeltilir.
- Güven: Yüksek

### YK-051 — tr — story_id 1116

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `zekanın`
- Öneri: `zekânın`
- Gerekçe: Kelimenin standart yazımında gerekli düzeltme işareti korunur.
- Güven: Yüksek

### YK-052 — tr — story_id 1117

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `mahkum`
- Öneri: `mahkûm`
- Gerekçe: Kelimenin standart yazımında gerekli düzeltme işareti korunur.
- Güven: Yüksek

### YK-053 — tr — story_id 1118

- Durum: Bekliyor
- Tür: Kesme işareti
- Alan hedefleri: `story_translations.title`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `şimdi'si`
- Öneri: `şimdisi`
- Gerekçe: Özel ad olmayan sözcüğe gelen ek kesme işaretiyle ayrılmaz.
- Güven: Yüksek

### YK-054 — tr — story_id 1118

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.description`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `hale`
- Öneri: `hâle`
- Gerekçe: Kelimenin standart yazımında gerekli düzeltme işareti korunur.
- Güven: Yüksek

### YK-055 — tr — story_id 1118

- Durum: Bekliyor
- Tür: Yazım
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `lakaplıyla`
- Öneri: `lakabıyla`
- Gerekçe: Metindeki açık harf, ek veya sözcük yazımı hatası düzeltilir.
- Güven: Yüksek

### YK-056 — tr — story_id 1118

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `hikaye`
- Öneri: `hikâye`
- Gerekçe: Kelimenin standart yazımında gerekli düzeltme işareti korunur.
- Güven: Yüksek

### YK-057 — tr — story_id 1120

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `hikaye`
- Öneri: `hikâye`
- Gerekçe: Kelimenin standart yazımında gerekli düzeltme işareti korunur.
- Güven: Yüksek

### YK-058 — tr — story_id 1124

- Durum: Bekliyor
- Tür: Birleşik yazım
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `Hiç biri`
- Öneri: `Hiçbiri`
- Gerekçe: Kelimenin standart yazımı bitişiktir.
- Güven: Yüksek

### YK-059 — tr — story_id 1128

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.description`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `kağıtlarına`
- Öneri: `kâğıtlarına`
- Gerekçe: Kelimenin standart yazımında gerekli düzeltme işareti korunur.
- Güven: Yüksek

### YK-060 — tr — story_id 1129

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.description`, `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `zeka`
- Öneri: `zekâ`
- Gerekçe: Kelimenin standart yazımında gerekli düzeltme işareti korunur.
- Güven: Yüksek

### YK-061 — tr — story_id 1129

- Durum: Bekliyor
- Tür: Özel ad yazımı
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `London'ın`
- Öneri: `Londra'nın`
- Gerekçe: Özel adın doğru ve tutarlı yazımı kullanılır.
- Güven: Yüksek

### YK-062 — tr — story_id 1132

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `hikaye`
- Öneri: `hikâye`
- Gerekçe: Kelimenin standart yazımında gerekli düzeltme işareti korunur.
- Güven: Yüksek

### YK-063 — tr — story_id 1136

- Durum: Bekliyor
- Tür: Yazım
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `ikincinde`
- Öneri: `ikincisinde`
- Gerekçe: Metindeki açık harf, ek veya sözcük yazımı hatası düzeltilir.
- Güven: Yüksek

### YK-064 — tr — story_id 1136

- Durum: Bekliyor
- Tür: Dil bilgisi
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `doğru kararlar bilmekle`
- Öneri: `doğru kararları bilmekle`
- Gerekçe: Cümledeki açık ek, kişi veya sözcük uyumsuzluğu düzeltilir.
- Güven: Yüksek

### YK-065 — tr — story_id 1136

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `hale`
- Öneri: `hâle`
- Gerekçe: Kelimenin standart yazımında gerekli düzeltme işareti korunur.
- Güven: Yüksek

### YK-066 — tr — story_id 1137

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `resmi`
- Öneri: `resmî`
- Gerekçe: Kelimenin standart yazımında gerekli düzeltme işareti korunur.
- Güven: Yüksek

### YK-067 — tr — story_id 1139

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `imkansız`
- Öneri: `imkânsız`
- Gerekçe: Kelimenin standart yazımında gerekli düzeltme işareti korunur.
- Güven: Yüksek

### YK-068 — tr — story_id 1140

- Durum: Bekliyor
- Tür: Yazım
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `reddedilrsem`
- Öneri: `reddedilirsem`
- Gerekçe: Metindeki açık harf, ek veya sözcük yazımı hatası düzeltilir.
- Güven: Yüksek

### YK-069 — tr — story_id 1141

- Durum: Bekliyor
- Tür: Yazım
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `küçülter`
- Öneri: `küçültür`
- Gerekçe: Metindeki açık harf, ek veya sözcük yazımı hatası düzeltilir.
- Güven: Yüksek

### YK-070 — tr — story_id 1144

- Durum: Bekliyor
- Tür: Yazım
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `korkuyum`
- Öneri: `korkuyorum`
- Gerekçe: Metindeki açık harf, ek veya sözcük yazımı hatası düzeltilir.
- Güven: Yüksek

### YK-071 — tr — story_id 1146

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.description`, `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `hikaye`
- Öneri: `hikâye`
- Gerekçe: Kelimenin standart yazımında gerekli düzeltme işareti korunur.
- Güven: Yüksek

### YK-072 — tr — story_id 1146

- Durum: Bekliyor
- Tür: Dil bilgisi
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `önemlisiniz`
- Öneri: `önemliyiz`
- Gerekçe: Cümledeki açık ek, kişi veya sözcük uyumsuzluğu düzeltilir.
- Güven: Yüksek

### YK-073 — tr — story_id 1147

- Durum: Bekliyor
- Tür: Soru eki
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `enerji mü`
- Öneri: `enerji mi`
- Gerekçe: Soru eki ünlü uyumuna göre “mi” biçiminde yazılır.
- Güven: Yüksek

### YK-074 — tr — story_id 1148

- Durum: Bekliyor
- Tür: Dil bilgisi
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `sizi için`
- Öneri: `sizin için`
- Gerekçe: Cümledeki açık ek, kişi veya sözcük uyumsuzluğu düzeltilir.
- Güven: Yüksek

### YK-075 — tr — story_id 1149

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.description`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `zeka`
- Öneri: `zekâ`
- Gerekçe: Kelimenin standart yazımında gerekli düzeltme işareti korunur.
- Güven: Yüksek

### YK-076 — tr — story_id 1149

- Durum: Bekliyor
- Tür: Dil bilgisi
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `kalmanızı`
- Öneri: `kalmanı`
- Gerekçe: Cümledeki açık ek, kişi veya sözcük uyumsuzluğu düzeltilir.
- Güven: Yüksek

### YK-077 — tr — story_id 1151

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `hikaye`
- Öneri: `hikâye`
- Gerekçe: Kelimenin standart yazımında gerekli düzeltme işareti korunur.
- Güven: Yüksek

### YK-078 — tr — story_id 1153

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `hale`
- Öneri: `hâle`
- Gerekçe: Kelimenin standart yazımında gerekli düzeltme işareti korunur.
- Güven: Yüksek

### YK-079 — tr — story_id 1154

- Durum: Bekliyor
- Tür: Sözcük kullanımı
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `Sorumluluktan koşanlar`
- Öneri: `Sorumluluktan kaçanlar`
- Gerekçe: Bağlamdaki açık yanlış sözcük kullanımı düzeltilir.
- Güven: Yüksek

### YK-080 — tr — story_id 1156

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.title`, `story_translations.description`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `zeka`
- Öneri: `zekâ`
- Gerekçe: Kelimenin standart yazımında gerekli düzeltme işareti korunur.
- Güven: Yüksek

### YK-081 — tr — story_id 1156

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.description`, `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `Zeka`
- Öneri: `Zekâ`
- Gerekçe: Kelimenin standart yazımında gerekli düzeltme işareti korunur.
- Güven: Yüksek

### YK-082 — tr — story_id 1156

- Durum: Bekliyor
- Tür: Yazım
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `Yüzü yetmiş yedi`
- Öneri: `Yüz yetmiş yedi`
- Gerekçe: Metindeki açık harf, ek veya sözcük yazımı hatası düzeltilir.
- Güven: Yüksek

### YK-083 — tr — story_id 1157

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.description`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `zekanın`
- Öneri: `zekânın`
- Gerekçe: Kelimenin standart yazımında gerekli düzeltme işareti korunur.
- Güven: Yüksek

### YK-084 — tr — story_id 1157

- Durum: Bekliyor
- Tür: Yazım
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `Chamine'nin araştırmadığı PQ liderleri`
- Öneri: `Chamine'nin araştırdığı PQ liderleri`
- Gerekçe: Metindeki açık harf, ek veya sözcük yazımı hatası düzeltilir.
- Güven: Yüksek

### YK-085 — tr — story_id 1158

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.description`, `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `hikaye`
- Öneri: `hikâye`
- Gerekçe: Kelimenin standart yazımında gerekli düzeltme işareti korunur.
- Güven: Yüksek

### YK-086 — tr — story_id 1158

- Durum: Bekliyor
- Tür: Sözcük kullanımı
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `Uçak inmede sorun yaşadı.`
- Öneri: `Uçak inişte sorun yaşadı.`
- Gerekçe: Bağlamdaki açık yanlış sözcük kullanımı düzeltilir.
- Güven: Yüksek

### YK-087 — tr — story_id 1160

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.title`, `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `Hikaye`
- Öneri: `Hikâye`
- Gerekçe: Kelimenin standart yazımında gerekli düzeltme işareti korunur.
- Güven: Yüksek

### YK-088 — tr — story_id 1160

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.description`, `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `hikaye`
- Öneri: `hikâye`
- Gerekçe: Kelimenin standart yazımında gerekli düzeltme işareti korunur.
- Güven: Yüksek

### YK-089 — tr — story_id 1161

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `hikaye`
- Öneri: `hikâye`
- Gerekçe: Kelimenin standart yazımında gerekli düzeltme işareti korunur.
- Güven: Yüksek

### YK-090 — tr — story_id 1162

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.description`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `hikaye`
- Öneri: `hikâye`
- Gerekçe: Kelimenin standart yazımında gerekli düzeltme işareti korunur.
- Güven: Yüksek

### YK-091 — tr — story_id 1162

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `haline`
- Öneri: `hâline`
- Gerekçe: Kelimenin standart yazımında gerekli düzeltme işareti korunur.
- Güven: Yüksek

### YK-092 — tr — story_id 1163

- Durum: Bekliyor
- Tür: Yazım
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `yanıltttığı`
- Öneri: `yanılttığı`
- Gerekçe: Metindeki açık harf, ek veya sözcük yazımı hatası düzeltilir.
- Güven: Yüksek

### YK-093 — tr — story_id 1163

- Durum: Bekliyor
- Tür: Dil bilgisi
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `sorgulaması gerektiğini`
- Öneri: `sorgulaman gerektiğini`
- Gerekçe: Cümledeki açık ek, kişi veya sözcük uyumsuzluğu düzeltilir.
- Güven: Yüksek

### YK-094 — tr — story_id 1164

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `hikaye`
- Öneri: `hikâye`
- Gerekçe: Kelimenin standart yazımında gerekli düzeltme işareti korunur.
- Güven: Yüksek

### YK-095 — tr — story_id 1164

- Durum: Bekliyor
- Tür: Yazım
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `dünya standartında`
- Öneri: `dünya standardında`
- Gerekçe: Metindeki açık harf, ek veya sözcük yazımı hatası düzeltilir.
- Güven: Yüksek

### YK-096 — tr — story_id 1165

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `hikaye`
- Öneri: `hikâye`
- Gerekçe: Kelimenin standart yazımında gerekli düzeltme işareti korunur.
- Güven: Yüksek

### YK-097 — tr — story_id 1165

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `imkansız`
- Öneri: `imkânsız`
- Gerekçe: Kelimenin standart yazımında gerekli düzeltme işareti korunur.
- Güven: Yüksek

### YK-098 — tr — story_id 1166

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.description`, `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `milli`
- Öneri: `millî`
- Gerekçe: Kelimenin standart yazımında gerekli düzeltme işareti korunur.
- Güven: Yüksek

### YK-099 — tr — story_id 1167

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.description`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `halini`
- Öneri: `hâlini`
- Gerekçe: Kelimenin standart yazımında gerekli düzeltme işareti korunur.
- Güven: Yüksek

### YK-100 — tr — story_id 1168

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.description`, `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `hali`
- Öneri: `hâli`
- Gerekçe: Kelimenin standart yazımında gerekli düzeltme işareti korunur.
- Güven: Yüksek

### YK-101 — tr — story_id 1168

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `hale`
- Öneri: `hâle`
- Gerekçe: Kelimenin standart yazımında gerekli düzeltme işareti korunur.
- Güven: Yüksek

### YK-102 — tr — story_id 1168

- Durum: Bekliyor
- Tür: Dil bilgisi
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `sadece el, göz ve beyin varım`
- Öneri: `sadece el, göz ve beyinden ibaretim`
- Gerekçe: Cümledeki açık ek, kişi veya sözcük uyumsuzluğu düzeltilir.
- Güven: Yüksek

### YK-103 — tr — story_id 1169

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `halleri`
- Öneri: `hâlleri`
- Gerekçe: Kelimenin standart yazımında gerekli düzeltme işareti korunur.
- Güven: Yüksek

### YK-104 — tr — story_id 1169

- Durum: Bekliyor
- Tür: Yazım
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `Televisyon`
- Öneri: `Televizyon`
- Gerekçe: Metindeki açık harf, ek veya sözcük yazımı hatası düzeltilir.
- Güven: Yüksek

### YK-105 — tr — story_id 1170

- Durum: Bekliyor
- Tür: Ondalık ayıracı
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `1.05`
- Öneri: `1,05`
- Gerekçe: Türkçe metinde ondalık ayıracı olarak virgül kullanılır.
- Güven: Yüksek

### YK-106 — tr — story_id 1170

- Durum: Bekliyor
- Tür: Ondalık ayıracı
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `0.05`
- Öneri: `0,05`
- Gerekçe: Türkçe metinde ondalık ayıracı olarak virgül kullanılır.
- Güven: Yüksek

### YK-107 — tr — story_id 1170

- Durum: Bekliyor
- Tür: Ondalık ayıracı
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `1.10`
- Öneri: `1,10`
- Gerekçe: Türkçe metinde ondalık ayıracı olarak virgül kullanılır.
- Güven: Yüksek

### YK-108 — tr — story_id 1171

- Durum: Bekliyor
- Tür: Dil bilgisi
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `İlk sayı kim söyledi?`
- Öneri: `İlk sayıyı kim söyledi?`
- Gerekçe: Cümledeki açık ek, kişi veya sözcük uyumsuzluğu düzeltilir.
- Güven: Yüksek

### YK-109 — tr — story_id 1172

- Durum: Bekliyor
- Tür: Yazım
- Alan hedefleri: `story_translations.title`, `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `konjunksiyon`
- Öneri: `konjonksiyon`
- Gerekçe: Metindeki açık harf, ek veya sözcük yazımı hatası düzeltilir.
- Güven: Yüksek

### YK-110 — tr — story_id 1172

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.description`, `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `imkansız`
- Öneri: `imkânsız`
- Gerekçe: Kelimenin standart yazımında gerekli düzeltme işareti korunur.
- Güven: Yüksek

### YK-111 — tr — story_id 1172

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `hikaye`
- Öneri: `hikâye`
- Gerekçe: Kelimenin standart yazımında gerekli düzeltme işareti korunur.
- Güven: Yüksek

### YK-112 — tr — story_id 1173

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `hikaye`
- Öneri: `hikâye`
- Gerekçe: Kelimenin standart yazımında gerekli düzeltme işareti korunur.
- Güven: Yüksek

### YK-113 — tr — story_id 1174

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `hizmetkar`
- Öneri: `hizmetkâr`
- Gerekçe: Kelimenin standart yazımında gerekli düzeltme işareti korunur.
- Güven: Yüksek

### YK-114 — tr — story_id 1175

- Durum: Bekliyor
- Tür: Kesme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `ego'yu`
- Öneri: `egoyu`
- Gerekçe: Özel ad olmayan sözcüğe gelen ek kesme işaretiyle ayrılmaz.
- Güven: Yüksek

### YK-115 — tr — story_id 1175

- Durum: Bekliyor
- Tür: Dil bilgisi
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `Çocuğuna, partnere, arkadaşa`
- Öneri: `Çocuğuna, partnerine, arkadaşına`
- Gerekçe: Cümledeki açık ek, kişi veya sözcük uyumsuzluğu düzeltilir.
- Güven: Yüksek

### YK-116 — tr — story_id 1176

- Durum: Bekliyor
- Tür: Dil bilgisi
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `daha fazlası elde etmenin`
- Öneri: `daha fazlasını elde etmenin`
- Gerekçe: Cümledeki açık ek, kişi veya sözcük uyumsuzluğu düzeltilir.
- Güven: Yüksek

### YK-117 — tr — story_id 1178

- Durum: Bekliyor
- Tür: Dil bilgisi
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `sen için`
- Öneri: `senin için`
- Gerekçe: Cümledeki açık ek, kişi veya sözcük uyumsuzluğu düzeltilir.
- Güven: Yüksek

### YK-118 — tr — story_id 1179

- Durum: Bekliyor
- Tür: Dil bilgisi
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `Ya bir daha o iyi olmasa?`
- Öneri: `Ya bir daha o kadar iyi olmasa?`
- Gerekçe: Cümledeki açık ek, kişi veya sözcük uyumsuzluğu düzeltilir.
- Güven: Yüksek

### YK-119 — tr — story_id 1180

- Durum: Bekliyor
- Tür: Yazım
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `Eleştirilersem`
- Öneri: `Eleştirilirsem`
- Gerekçe: Metindeki açık harf, ek veya sözcük yazımı hatası düzeltilir.
- Güven: Yüksek

### YK-120 — tr — story_id 1180

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `halinde`
- Öneri: `hâlinde`
- Gerekçe: Kelimenin standart yazımında gerekli düzeltme işareti korunur.
- Güven: Yüksek

### YK-121 — tr — story_id 1181

- Durum: Bekliyor
- Tür: Yazım
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `yaramazsanız`
- Öneri: `yaratmazsanız`
- Gerekçe: Metindeki açık harf, ek veya sözcük yazımı hatası düzeltilir.
- Güven: Yüksek

### YK-122 — tr — story_id 1181

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `hikaye`
- Öneri: `hikâye`
- Gerekçe: Kelimenin standart yazımında gerekli düzeltme işareti korunur.
- Güven: Yüksek

### YK-123 — tr — story_id 1182

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.description`, `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `hikaye`
- Öneri: `hikâye`
- Gerekçe: Kelimenin standart yazımında gerekli düzeltme işareti korunur.
- Güven: Yüksek

### YK-124 — tr — story_id 1184

- Durum: Bekliyor
- Tür: Yazım
- Alan hedefleri: `story_translations.description`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `kaybetmemey`
- Öneri: `kaybetmemeye`
- Gerekçe: Metindeki açık harf, ek veya sözcük yazımı hatası düzeltilir.
- Güven: Yüksek

### YK-125 — tr — story_id 1184

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `zeka`
- Öneri: `zekâ`
- Gerekçe: Kelimenin standart yazımında gerekli düzeltme işareti korunur.
- Güven: Yüksek

### YK-126 — tr — story_id 1185

- Durum: Bekliyor
- Tür: Büyük harf
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `Izafiyet`
- Öneri: `İzafiyet`
- Gerekçe: Türkçe büyük harf kullanımında “İ” harfi gereklidir.
- Güven: Yüksek

### YK-127 — tr — story_id 1185

- Durum: Bekliyor
- Tür: Yazım
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `Madde maddeler.`
- Öneri: `Madde işaretleri.`
- Gerekçe: Metindeki açık harf, ek veya sözcük yazımı hatası düzeltilir.
- Güven: Yüksek

### YK-128 — tr — story_id 1189

- Durum: Bekliyor
- Tür: Dil bilgisi
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `ne kadar beklediğin?`
- Öneri: `ne kadar bekledin?`
- Gerekçe: Cümledeki açık ek, kişi veya sözcük uyumsuzluğu düzeltilir.
- Güven: Yüksek

### YK-129 — tr — story_id 1192

- Durum: Bekliyor
- Tür: Dil bilgisi
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `not defterle giriyorum`
- Öneri: `not defteriyle giriyorum`
- Gerekçe: Cümledeki açık ek, kişi veya sözcük uyumsuzluğu düzeltilir.
- Güven: Yüksek

### YK-130 — tr — story_id 1193

- Durum: Bekliyor
- Tür: Yazım
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `Tanrışükür`
- Öneri: `Tanrı'ya şükür`
- Gerekçe: Metindeki açık harf, ek veya sözcük yazımı hatası düzeltilir.
- Güven: Yüksek

### YK-131 — tr — story_id 1198

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `hikaye`
- Öneri: `hikâye`
- Gerekçe: Kelimenin standart yazımında gerekli düzeltme işareti korunur.
- Güven: Yüksek

### YK-132 — tr — story_id 1201

- Durum: Bekliyor
- Tür: Dil bilgisi
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `kim kâr edemez`
- Öneri: `kimse kâr edemez`
- Gerekçe: Cümledeki açık ek, kişi veya sözcük uyumsuzluğu düzeltilir.
- Güven: Yüksek

### YK-133 — tr — story_id 1203

- Durum: Bekliyor
- Tür: Dil bilgisi
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `yapabildiğin bir şey`
- Öneri: `yapabileceğin bir şey`
- Gerekçe: Cümledeki açık ek, kişi veya sözcük uyumsuzluğu düzeltilir.
- Güven: Yüksek

### YK-134 — tr — story_id 1205

- Durum: Bekliyor
- Tür: Düzeltme işareti
- Alan hedefleri: `story_translations.content`
- Kaynak dosya: `Bulunamadı`
- Mevcut: `hikaye`
- Öneri: `hikâye`
- Gerekçe: Kelimenin standart yazımında gerekli düzeltme işareti korunur.
- Güven: Yüksek


## Uygulama günlüğü

- Henüz değişiklik uygulanmadı; kullanıcı onayı bekleniyor.

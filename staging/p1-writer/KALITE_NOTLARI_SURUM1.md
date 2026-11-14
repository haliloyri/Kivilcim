# Sürüm 1 (ilk 41 hikâye) kalite notları

Kapsam: kitap 134, 184, 122, 132, 172, 192, 135, 158, 106, 171, 107, 195, 109, 108, 136. Hedef etiket SON55. Yazar: Sonnet 5.5, editör: Opus 5.5. DB'ye yazılmadı.

## Kullanıcı kararları

- Kitap 192: "Konsantrasyon Gücü" Deep Work'ün kopyasıydı (Deep Work DB'de kitap 4, "Derin Çalışma"). Kitap ve 1672-1674 DB'den silindi (2026-11-06, yedek: assets/_db_backups/albor.db.pre-kitap192-sil-20261106-001928). 1672-1674 staging dosyaları diskte duruyor, yazıma dahil değil.
- Kitap 109: DB'deki "Mindfulness" kitabı Kabat-Zinn'in "Wherever You Go, There You Are" (1994) kitabı olarak eşlendi. Eşleme doğru.
- Kitap 108: DB'deki "Mucize Sabah 2" aslında Hal Elrod'un "The Miracle Equation" (2019, Harmony) kitabıdır, Türkçesi "Mucize Denklem". 1420-1422 silinmedi, bu kitaptan yeniden yazıldı.

## DB'de yapılan kitap künyesi düzeltmeleri (2026-11-06)

- 192: kitap, çevirileri ve 1672-1674 silindi.
- 108: yıl 2019 (önce yanlışlıkla 2016 yazılmıştı, yayıncı kaydıyla düzeltildi). Başlıklar: tr Mucize Denklem, en The Miracle Equation, es La ecuación milagrosa, de The Miracle Equation.
- es başlığı doğrulanmadı, "ecuación milagrosa" yayınevi kaydı bulunamadı, düz çeviri. de için Alman perakendecilerde yalnızca İngilizce başlık görüldü. İstersen değiştir.

## 1420-1422 (Mucize Denklem) sonucu

- Yazıldı ve editörden geçti, `validate-dir` 4 dilde 3/3, uyarısız. 3 hikâye `keep`, hepsi `confidence: medium`.
- en, es, de hikâyeleri aynı paragraf sırasını izliyor, birbirinin çevirisi gibi okunuyor. Yeniden kurmak 4 `Edit` sınırını aşardı.
- es/de 1422, tr 1422 kartları ve cep cümlesi ile `tr/1422.variants.json` çevrilmiş "can't change it" ifadesini tırnak içinde veriyor.
- 1421 ve 1422 derslerinde ayrı ilke cümlesi yok, ilkeyi kalın başlık taşıyor.
- 1422: "kapanış sözleri beş dakikadan önemlidir" yazarın yorumu, kitap iddiası değil, 4 dilde duruyor.
- 1421: Donnie Register anlatısı iki özetten, kısa. Editör eklediği bir cümlenin kendi çerçevesi olduğunu bildirdi.

## Genel sorunlar

- Hiçbir kitabın tam metni okunamadı. Olgular ikincil kaynaklardan geldi. Brief güveni çoğunlukla `medium`.
- `confidence: low` brief'ler: 1464, 1502, 1572.
- Çoğu hikâye hedef uzunluğun altında, sert alt sınırın üstünde. Nedeni ince kaynak malzeme, metin şişirilmedi. Hikâye payı çoğunlukla %55'in altında.
- Brief'lerdeki başlıklar İngilizce. `staging/p1-writer/inputs/<id>.brief-user.md` dosyalarında hâlâ Türkçe başlık var, yeniden üretimde Türkçe başlık geri gelebilir.

## Editör sonrası açık maddeler

- tr 1501, tr 1613, tr 1570: editör 4 `Edit` sınırını aştı (6, 5, 5). Silinen olgular hikâyeleri sert eşiğin altına düşürdü, brief'e dayalı cümle eklendi. Okuma geçişi gerekiyor.
- 1571: dört dil aynı paragraf sırasını izliyor, bağımsız yazım kuralı çiğnenmiş.
- tr 1414, de 1414: açılış Maxwell'i anıyor, `[[open]]` kuralına aykırı.
- 1414 en/es ve 1415 en/es aynı açılış hamlesini kullanıyor. 1610 tr, es, de aynı alıntıyla açılıyor.
- tr 1419, es 1419: "Southwest'in çizgisi arabanın çizgisine diğer havayollarından daha yakın" cümlesi kitaptan doğrulanmadı, çıkarım.
- 1614: Taleb eleştirisi yalnızca brief'teki `confidence_note`'a dayanıyor. 1614 ve 1674'teki zamanlama tarzı tanımları brief'te yok, yalnızca adları var.
- en 1494: "not X, it's Y" kalıbı iki kez geçiyor.
- 1463, 1464, 1492, 1493, 1494, 1501, 1502, 1570: sert alt sınıra yakın.
- tr 1680: açılış 24 kelime (hedef 32-64), cümle uzunluğu tekdüze uyarısı. 1425 (en hariç) ve 1506'da aynı uyarı.
- 1423-1425, 1504-1506: tr ve en dersleri çoğu id'de aynı örneği paylaşıyor, es ve de'ye ayrı örnek verildi.
- 1423-1425: kitabın tam metni okunamadı. 1425 ve 1506'da cümle uzunluğu uyarısı kaldı.

## Eski metinden atılan iddialar (kitaba bağlanamadı)

Ayrıntı her kitabın `facts/<kitap no>.json` dosyasında, `rejected` alanında. Öne çıkanlar: 1501 asansör sahnesi, 1494 traktör kazası (kaynaklarda mayın), 1493 Londralı bankacı anekdotu, 1650 "öfke canlı, kin ölü" çerçevesi, 1674 Marx ve Woody Allen, 1609 40 yıllık %7 senaryosu, 1610 SPIVA iddiası, 1414-1416 iki kurucu, Teksaslı vaiz ve bina çökmesi sahneleri, 1572 CEO sözü ve 31 milyon şişe.

## Kitap yılı farkları

- 107: DB 2004, kütüphane kayıtları 2005 (metinde 2005).
- 106: 1998. 171: 2007. 195: 2017.
- Kroc anlaşma yılı kaynaklarda 1954 veya 1961, metinde yıl verilmedi (1414).

## Sıradaki

- 1420-1422 yeniden yazım ve editör geçişi sonucu bu dosyaya eklenecek.
- DB yazımı onay bekliyor. `DB_VERSION` artışı (`src/db/db.js`) elle yapılacak.

# Parti 2 (Sürüm 1, sıradaki 13 kitap, 41 hikâye)

Kitaplar: 140, 103, 168, 119, 143, 148, 138, 199, 154, 145, 116, 113, 161, 163. Yazar Sonnet 5.5, editör Opus 5.5. DB'ye yazılmadı. Yazılan 40 hikâye, 1445 karar bekliyor.

## Karar bekleyen

- 1445 (Sadakat Etkisi, NPS) KARAR: silindi (2026-11-07, yedek assets/_db_backups/albor.db.pre-writer-SON55-20261106210542). Kitap 116'da 2 hikâye kaldı. Gerekçe: Net Promoter Score The Loyalty Effect'te (1996) yok, Reichheld 2003 HBR makalesi ve 2006 The Ultimate Question ile getirdi. `meta/1445.json` verdict `delete`, brief ve metin yok. Sil ya da kitaptaki bir konudan yeniden yaz. Karar verilene kadar yazım listesinde değil.
- Tracy (113) kitap yılı: DB 2006, ilk baskı daha eski olabilir, doğrulanamadı.
- 163 The Circadian Code: DB yılı 2019, Rodale ciltli baskı Haziran 2018. Brief'te 2018 kullanıldı, DB'ye dokunulmadı.

## Güven

- `low`: 1407, 1602, 1540, 1542, 1688, 1587, 1435, 1436, 1437.
- `high`: 1558, 1559, 1560 (Brach, tam metin okundu), 1581.
- Diğerleri `medium`. Hiçbir kitabın (Brach hariç) tam metni okunamadı.

## Açık maddeler

- 1602: Christian Bohr'un Niels Bohr'un babası olduğu cümlesi brief'te var, kitaptan değil, genel kaynaktan.
- 1600: sonuç rakamları (horlama, apne) basın kaynaklı, kaynaklar arasında farklı, hakemli makale yok. Metin bunu söylüyor.
- 1542: Southwest peçetesi anlatısı için editoryal uyarı var (Wikipedia ve Texas Co-op Power'a göre hikâye tam doğru değil). Kaynak ikincil.
- 1587: derse "uyku sorunu haftalarca sürerse hekime danışın" 4 dilde eklendi, varyantlarda yok.
- 1437: %95 kıyafet iddiası şüpheli diye işaretli. 1531: %17 eğitim sonucu ikinci el diye işaretli. tr 1579: "yüzde kırk" anket rakamı kaynaklı.
- 1435: Damasio ve Elliot, 1437: Willis-Todorov 2006 dış bağlam, kitaba atfedilmiyor.
- 1558 tr/es/de: "sıcak, tanıdık ev" havası kaynaksız olabilir. 1437: "her deney tek bir özellik üzerine" kaynaksız olabilir.
- 1525 es/de: adlandıran arkadaş kadın olarak yazılmış, brief belirtmiyor.
- Editör 4 `Edit` sınırını aştı: es 1581, de 1585, tr/en/es/de 1587, tr 1601, tr 1455, tr 1525, tr 1527, tr/de 1542. Sert alt sınır için brief'e dayalı cümleler eklendi. Okuma geçişi gerekiyor.
- en/es/de paragraf sırası ve ders örnekleri çoğu id'de birbirinin çevirisi gibi: 1531 (en/es açılışı), 1405-1407, 1600-1602, 1453-1455, 1516-1518, 1510-1512, 1525, 1526. 1527 ve 1687'de sıra doğal olarak benzer.
- Uzunluk: çoğu hikâye hedefin altında, hikâye payı %55'in altında. Alt sınıra yakın: tr 1455 (231/230), tr 1527 (235/230), de 1542 (273/270), es 1542 (303/300), 1587.
- 1455 en/es/de "not only… but" gerçek Dalai Lama alıntısı, bilerek bırakıldı.

## Eski metinden atılanlar

Ayrıntı `facts/<kitap no>.json` `rejected` alanında. Öne çıkanlar: 1453 ziyaret ters anlatılmıştı (Tutu, Dalai Lama'nın evine gitti), 1454 yanlış sekiz sütun, 1455 uydurma "Tutu sorar, Dalai Lama susar" sahnesi, Mom Test alıntıları ve taahhüt merdiveni, GTD müşteri anekdotu, 1601 "om mani padme hum 5-6 saniye", 1581 iki satıcı grubu deneyi, 1586 18 haftalık fare çalışması (100 gün), 1540 200 kişi 15 el ve 40.000 yıl iddiaları, 1688 "yetersizim" egzersizi.

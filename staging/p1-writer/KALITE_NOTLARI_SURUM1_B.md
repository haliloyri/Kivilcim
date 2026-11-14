# Sürüm 1 (ikinci parti, 50 hikâye) kalite notları

Kapsam: kitap 105, 100, 169, 147, 111, 129, 196, 177, 164, 165, 186, 99, 194, 189, 188, 157, 139, 101, 170. Hedef etiket SON55. Yazar: Sonnet 5.5, editör: Opus 5.5. DB'ye yazılmadı (2026-11-07).

## Sonuç

- 50 id: 40 keep, 10 delete.
- `validate-dir`: 4 dilde 39/40 passed. Tek FAIL: 1655 (story hard-min, 4 dilde).
- DB'ye hazır (39): 1411 1412 1396 1397 1398 1604 1605 1537 1538 1539 1429 1484 1681 1628 1588 1589 1590 1591 1592 1593 1654 1656 1393 1394 1395 1678 1679 1663 1664 1665 1660 1661 1662 1567 1514 1515 1399 1606 1607
- Delete (yalnızca `meta/<id>.json`, verdict + verify_note): 1413, 1430, 1431, 1485, 1682, 1627, 1629, 1400, 1401, 1608

## Delete gerekçeleri

- 1413: Grant ambivert satıcı çalışması 2013, Quiet (2012) sonrası.
- 1400: Wikipedia-Britannica karşılaştırması (2005) Smart Mobs (2002) içinde yok.
- 1401: flash mob (2003) ve Arap Baharı kitaptan sonra; kalan malzeme ~150 kelime.
- 1608: "Rich Life" çerçevesi 2009 baskısında doğrulanamadı.
- 1682: Sparrow çalışması (Science, 2011) 2010 kitabında yok.
- 1629: "Charcot istismarı gördü" kaynağın tersi (dinleyen Janet ve Freud).
- 1430, 1431, 1485, 1627: eski çekirdek iddia kaynaksız, yedek konu ikincil kaynaklarla sert alt sınırın altında kaldı.
- Grup B'de oran yüksek (10'da 6). Kitaplar iyi bilinen kitaplar; tam metne erişimle yeniden denenebilir.

## Kullanıcı kararı bekleyen

1. 1655: temizlik sonrası story tr 185 / en 185 / es 218 / de 199 kelime (min 230/280/300/270). Facts'te ek malzeme yok. Seçenekler: delete, yeni kaynakla yeniden yaz, alt sınır istisnası. Eski sürüm yedeği yok (staging git'te izlenmiyor).
2. 1398: 2019 ABD Ordusu konuşmasından alıntılar ("biyolojik ve antropolojik kavram", "yeterlilik korkusu", "güven dostlukların kökü") kitaptan değil, açıkça konuşmaya atfedili. Çıkarılırsa hikâye hard floor'un altına düşer.
3. 10 delete id'nin DB'den silinmesi.

## Kitap künyesi sorunları (DB'de düzeltilmedi)

- 99: tr "Yeme Bozukluğu", es "Trastorno alimentario", de "Essstörung" yanlış. Kitap *Eat That Frog!* (Brian Tracy).
- 194: DB en başlık "The Headspace Guide to Meditation", yıl 2012. İlk UK baskısı *Get Some Headspace* (2011). tr/es/de başlıkları doğrulanmadı.
- 189: es "Nueva Tierra", de "Neues Land" doğrulanmadı.
- 188: tr "Yeniden Doğmak", es "Renacido", de "Wiedergeboren" doğrulanmadı.
- 165: ortak yazar Bill Gifford DB'de yok.
- 101: eski 1400/1401 Smart Mobs kapsamında değil; başka kitaptan (ör. The Wisdom of Crowds) kaymış olabilir.
- 164 ve 165 kopya değil (Lifespan 2019, Outlive 2023).

## Kaynak notu

- Gruplar A, B, C, E: hiçbir kitabın tam metnine ulaşılmadı, olgular ikincil kaynaklardan. archive.org çekme denemesi izin sisteminde reddedildi.
- Grup D: yazar doğrulama için resmi olmayan barındırılmış kopyaları okudu (Tracy PDF ocf.berkeley.edu, Tolle PDF ikhtyar.org, Brooks archive.org). Telif açısından gri alan.
- `confidence: low`: 1398, 1539, 1607, 1679. medium-low: 1655.

## Ana orkestratörün yaptığı düzeltmeler

- 35 dosyada (1429, 1484, 1681, 1588-1593, 1654-1656) kitap atfındaki çevrilmiş başlık parantezi kaldırıldı: `*Lifespan* (Uzun Yaşam Bilimi, 2019)` → `*Lifespan* (2019)`. Kural: `inputs/story-system.md` "add no translated title".
- Bu, tr 1590/1654/1656 ve es 1656'yı 1-5 kelimeyle hard-min altına itti. Brief künyesiyle kapatıldı: 1654/1656'da brief'teki tam başlık (*Creativity: Flow and the Psychology of Discovery and Invention*), tr 1590'da facts'teki ortak yazar (Matthew D. LaPlante).
- `meta/1567.json`: `*Yetenek Kodu*` → `*The Talent Code*`.
- Kaynak: `inputs/<id>.brief-user.md` `Book:` satırı Türkçe DB başlığı veriyor; yazarlar başlığı oradan alıyor. Düzeltilmezse sonraki partide tekrar eder.

## Editör sonrası açık maddeler

- Bağımsız yazım ihlali (gövde paragraf sırası dillerde aynı, açılışlar ayrıştırıldı): 1514, 1515, 1588-1593, 1654, 1656, 1663, 1665, 1661. Use kartları paralel: 1514, 1515, 1606, 1607.
- 4 Edit sınırı aşıldı, okuma önerilir: 1396 es/de, 1397 tr/en/es/de, 1590 en/de, 1592 en/de, 1654 es/de, 1656 4 dil, 1393 tr/es/de, 1663 de, 1660 en/es/de, 1681 tr.
- Hikâye uzunluğu tabanda veya altında (uyarı): 1606, 1607 (4 dil), de 1412 (270), de 1396 (271).
- 1660: tr ve en açılışı aynı "insanely lucky" alıntısı; en/es/de ders örneği aynı (dükkân sahibi). 1665 en/es açılışları benzer. 1661 en/tr ders örneği koşucu.
- 1484 en: "not X. It's Y." kalıbı iki kez.
- 1662: premise değişti (mezuniyet konuşmasındaki dört boş kutu), başlık ve hook yeni içeriğe uyumlu.
- Grup D editörü kaynaksız diye birçok ayrıntıyı sildi (1660, 1663, 1664, 1665 vb.); yazar bunları tam metinde gördüğünü söylüyor. Facts dosyasına eklenirse geri konabilir.

# Çeviri taraması: SON55, 1693–1782 dışı (55 hikâye)

Tarih: 2026-11-03. Salt okunur tarama. DB'ye ve staging metinlerine dokunulmadı. 1693–1782 aralığı için bkz. `CEVIRI_TARAMA_SURUM2.md`.

## Yöntem

1. `assets/albor.db` içindeki 283 SON55 hikâyesinin her dilinde `[[story]]` bölümü EN ile ölçüldü. Paragraf sayısı ve cümle sayısı eşit, cümle uzunluğu oranının değişkenliği (CV) 0,2'nin altındaysa dil işaretlendi.
2. 1693–1782 dışında 55 hikâye, 95 dil işaretlendi.
3. İşaretli her dil için `[[open]]` ilk iki cümle, `[[story]]` ilk paragrafın ilk iki cümlesi ve orta paragrafın ilk cümlesi EN ile yan yana okundu.

Ciddiyet ölçütü (önceki raporla aynı):
- **yüksek**: açılış ve gövde ikisi de EN'ye cümle cümle paralel. Öneri: yeniden yaz.
- **orta**: açılış bağımsız, gövde EN'ye paralel. Öneri: gövdeyi yeniden yaz, açılış kalabilir.
- **düşük**: tabloda yok; okunan hiçbir dil bu seviyede çıkmadı.

## Genel bulgu

- Okunan 95 dilin hepsinde gövde EN'nin çevirisi. Paragraf sırası, cümle sırası ve geçiş cümleleri birebir aynı (ör. 1442 EN "The book breaks action into seven stages." / ES "El libro divide la acción en siete etapas." / DE "Das Buch teilt Handeln in sieben Stufen.").
- Fark açılışta: bazı dillerde açılış bağımsız yazılmış ama gövde yine çeviri.
- 1784–1828 (p1-claude çıktısı, *Being Mortal*, *Range*, *Give and Take*, Sapolsky, Burkeman vb.) neredeyse tamamen çeviri; tr dahil.
- 1561'de tr/es/de açılışları birbirine benziyor, EN'den farklı. EN sonradan değişmiş olabilir; gövde yine EN'ye paralel.
- 1357–1366'da EN hâlâ `legacy` formatta; 1360 tr bu eski EN'nin çevirisi.

## Tablo

| id | yüksek (açılış + gövde) | orta (yalnız gövde) |
|---|---|---|
| 1288 | | es |
| 1321 | es | |
| 1322 | de | |
| 1335 | es, de | |
| 1352 | | de |
| 1360 | tr | |
| 1402 | | es, de |
| 1410 | | de |
| 1426 | es | |
| 1428 | es, de | |
| 1433 | | es, de |
| 1441 | es, de (açılış cümleleri ters sırada) | |
| 1442 | es, de | |
| 1467 | de | |
| 1474 | es | |
| 1495 | es | |
| 1496 | es, de | |
| 1507 | | es, de |
| 1508 | | es |
| 1544 | | tr, de |
| 1561 | | tr, es, de |
| 1582 | es, de | |
| 1583 | | es |
| 1615 | es | |
| 1616 | es, de | |
| 1617 | es, de | |
| 1625 | es, de | |
| 1626 | | es |
| 1685 | | de |
| 1784 | es, de | |
| 1785 | de | |
| 1786 | de | |
| 1787 | de | |
| 1788 | es, de | |
| 1790 | es, de | |
| 1791 | es, de | |
| 1792 | es, de | |
| 1810 | es, de | |
| 1811 | es | |
| 1812 | tr, es | |
| 1813 | tr, es, de | |
| 1814 | es, de | |
| 1815 | es, de | |
| 1816 | es, de | |
| 1817 | tr, es, de | |
| 1818 | de | |
| 1819 | tr, de | |
| 1820 | tr, es, de | |
| 1821 | de | |
| 1822 | es, de | tr |
| 1824 | es, de | |
| 1825 | de | |
| 1826 | es, de | |
| 1827 | es, de | tr |
| 1828 | es, de | tr |

## Sınırlar

- Ölçüt yalnız paragraf ve cümle sayısı eşit olan dilleri yakaladı. Cümleleri birleştirip bölen çeviriler (önceki raporda tr'de sık) bu listede olmayabilir.
- Her dilde metnin tamamı değil, açılış ve gövdeden üç örnek okundu.

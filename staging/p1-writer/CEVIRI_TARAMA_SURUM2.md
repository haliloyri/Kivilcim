# Çeviri taraması: SON55, id 1693–1782 (86 hikâye)

Tarih: 2026-10-30. Salt okunur tarama. DB'ye ve staging metinlerine dokunulmadı.

## Yöntem

1. Betik (`python3`) ile her id ve her dil için şunlar ölçüldü: `[[open]]` cümle sayısı, `[[story]]` paragraf sayısı, paragraf başına cümle sayısı, EN ile cümle cümle kelime uzunluğu oranının değişkenliği (CV). Cümle sayısı eşit ve CV < 0,15 olunca metin büyük olasılıkla cümle cümle çevrilmiştir.
2. 86 id'nin dört dildeki `[[open]]` bölümleri tek tek okundu. `[[story]]` ilk paragrafı yaklaşık 35 id'de okundu, geri kalanı ölçümle değerlendirildi.
3. Kaynak dil hemen her yerde **EN**. TR/ES/DE metinleri EN'nin cümle sırasını, imgelerini ve söz dizimini izliyor. Birkaç yerde DE, ES'yi ya da TR'yi izliyor (1694 DE→TR, 1713 DE→ES, 1727 ES↔DE). EN kaynak kabul edildi ve tabloya alınmadı.

## Genel bulgu

- **Asıl sorun gövde, açılış değil.** `[[story]]` gövdesi 1693–1782 aralığında hemen her id'de EN'nin çevirisi. Paragraf sayısı, cümle sırası ve olgu sırası birebir aynı. Tipik örnek, 1757: EN "He was told that every equation he put in would cut the sales in half." / TR "Kendisine, kitaba koyacağı her denklemin satışları yarıya indireceği söylendi." / ES "Le advirtieron que cada ecuación que incluyera reduciría las ventas a la mitad." / DE "Man warnte ihn, dass jede Gleichung, die er einfügte, die Verkäufe halbieren würde."
- **Açılışlar:** 1693–1762 aralığında ES ve DE açılışlarının çoğu EN'nin cümle cümle çevirisi. TR'de bu daha seyrek: TR çoğu zaman cümleleri birleştiriyor ya da kısaltıyor, ama sırayı koruyor. 1763–1782 aralığında açılışlar büyük ölçüde bağımsız (1779 ES/DE, 1780 tüm diller ve 1775 DE hariç).
- **Gövdesi de bağımsız olanlar:** 1710 ve 1734 (önceden düzeltilmişti), 1711, 1745 (TR/ES), 1763, 1778, 1775 (TR/ES), 1781 (DE) ve 1780 (yalnız TR gövde).
- TR gövdeleri çoğu zaman EN'nin kısaltılmış çevirisi (örnek 1749, 1750, 1752, 1753). Cümle eşleşmesi daha gevşek, ama sıra ve imgeler aynı.

Ciddiyet ölçütü:
- **yüksek**: açılış ve gövde ikisi de EN'ye (ya da başka bir dile) cümle cümle paralel. Öneri: yeniden yaz.
- **orta**: yalnız biri paralel. Ya açılış bağımsız ama gövde çeviri (öneri: yeniden yaz, gövde; açılış kalabilir), ya da gövde bağımsız ama açılış çeviri (öneri: yalnız açılış).
- **düşük**: aynı sıra ama söz dizimi ve imgeler dile özgü, ya da gevşek bir kısaltma. Öneri: dokunma.

## Tablo

| id | dil | ciddiyet | kanıt (kısa alıntı) | öneri |
|---|---|---|---|---|
| 1693 | de | yüksek | DE "Worsley hob den Sextanten, und wie so oft hatten sich die Wolken…" = EN "Worsley raised the sextant, and the clouds, as usual…" | yeniden yaz |
| 1693 | tr, es | orta | açılış bağımsız; gövde EN'ye paralel (ES 7/7 paragraf, CV 0,17) | yeniden yaz (gövde) |
| 1694 | es | yüksek | ES "Años después, ese caballo se enfrentó a un campeón de la Triple Corona" = EN "A few years later that horse stood against a Triple Crown champion" | yeniden yaz |
| 1694 | de | yüksek | DE açılışı TR'nin çevirisi ("Tom Smith brachte seinem Pferd bei…" = TR "Tom Smith atına zil sesiyle koşmayı öğretti"); gövde EN'nin çevirisi | yeniden yaz |
| 1694 | tr | orta | gövde: TR "Efsanevi Man o' War'un torunuydu ama küçüktü, dizleri çıkıntılıydı…" = EN p1 | yeniden yaz (gövde) |
| 1695 | tr, es, de | yüksek | "The button was supposed to shut the reactor down." = TR "Düğme reaktörü durdurmak içindi." = ES "El botón servía para apagarlo." = DE "Der Knopf sollte den Reaktor abschalten." | yeniden yaz |
| 1696 | tr, es, de | yüksek | 3 cümle birebir; DE "ließen den Abstand zwischen ihnen unangetastet" = EN "left the gap between them exactly where it was" | yeniden yaz |
| 1697 | es, de | yüksek | ES "La diferencia no estaba en la medalla. Estaba en la cabeza de cada atleta" = EN "…had nothing to do with the medals. It sat in the head…" | yeniden yaz |
| 1697 | tr | orta | açılış gevşek; gövde paralel | yeniden yaz (gövde) |
| 1698 | tr, es, de | yüksek | TR "On yıl sonra bir bilgisayarın içinde buldu." = EN "About ten years later he found it inside a computer." (TR'de nesne düşmüş, doğal değil) | yeniden yaz |
| 1699 | tr, es, de | yüksek | TR "aynı çatı altında birleştiler ve asıl kavga ondan sonra başladı" = EN "merged under one roof, and the real fighting started after that" | yeniden yaz |
| 1700 | es, de | yüksek | ES "Cara subía el precio de una acción, cruz lo bajaba" = EN "Heads moved a stock's price up, tails moved it down" | yeniden yaz |
| 1700 | tr | orta | açılış birleştirilmiş; gövde paralel | yeniden yaz (gövde) |
| 1701 | tr, es, de | yüksek | tüm gövde 6/6 paragraf, cümle sayıları eşit; TR "havacılığın bir uçak kazasından çıkardığı derse bakmıştı" = EN "had looked at what aviation learned from a plane crash" | yeniden yaz |
| 1702 | tr, es, de | orta | açılışlar farklı kurulmuş; gövde: ES "La idea de Michael Easter era sencilla…" = EN "The idea behind Michael Easter's book was simple…" | yeniden yaz (gövde) |
| 1703 | es, de | yüksek | DE "Die Nase brach, die Knochen um die Augen zersplitterten." = EN "His nose broke and the bones around his eyes shattered." | yeniden yaz |
| 1703 | tr | yüksek | TR "Burnu kırıldı, gözlerinin çevresindeki kemikler parçalandı." aynı; gövde paralel | yeniden yaz |
| 1704 | es, de | yüksek | ES "Uno de esos carteles se había escrito para frenar los robos." = EN "One of the signs had been written to stop the stealing." | yeniden yaz |
| 1704 | tr | orta | açılış dolgu eklenmiş ama sıra aynı; gövde paralel | yeniden yaz (gövde) |
| 1705 | es, de | yüksek | DE "Ein Piepser ging zu einem zufälligen Zeitpunkt des Tages los" = EN "A pager went off at a random moment of the day" | yeniden yaz |
| 1705 | tr | orta | açılış sırayı koruyor; gövde paralel | yeniden yaz (gövde) |
| 1706 | es, de | yüksek | ES "Paul Bloom ve en esa diferencia un punto ciego" = EN "Paul Bloom sees a blind spot in that difference" | yeniden yaz |
| 1706 | tr | yüksek | TR "Yüzü ve adı olmayan daha büyük zararlar bu kadar ilgi görmedi." = EN; gövde paralel | yeniden yaz |
| 1708 | es, de | yüksek | DE "Ein kurzer Ast läuft direkt zur Amygdala, der lange Weg führt weiter zum denkenden Gehirn." = EN | yeniden yaz |
| 1708 | tr | orta | açılış kısaltılmış; gövde 7/8 paragraf eşleşme | yeniden yaz (gövde) |
| 1709 | es, de | yüksek | DE "und darüber, was die Autos wirklich zeigten" = EN "and about what the cars really showed" | yeniden yaz |
| 1709 | tr | orta | açılış bölünmüş ama aynı sıra; gövde paralel | yeniden yaz (gövde) |
| 1710 | tr, es, de | düşük | önceden bağımsız yeniden yazıldı; ölçümde paralellik yok | dokunma |
| 1711 | tr, es, de | düşük | açılış ve gövde dört dilde ayrı kurulmuş (TR bakanla, DE keşişle, ES bakanın sözüyle başlıyor) | dokunma |
| 1712 | es, de | yüksek | ES "Sócrates nombra una pena para los buenos que se niegan a gobernar" = EN "Socrates names a penalty for good people who refuse to rule" | yeniden yaz |
| 1712 | tr | orta | açılış bağımsız; gövde paralel | yeniden yaz (gövde) |
| 1713 | tr | yüksek | TR "Bunu ancak bir adım geri çekilince gördü." = EN "He only saw it once he stepped back."; gövde paralel | yeniden yaz |
| 1713 | de | yüksek | DE açılışı ES'nin çevirisi ("Leitende Stelle bei American Apparel, eine Firma von Krise zu Krise" = ES "Un puesto de ejecutivo… de crisis en crisis") | yeniden yaz |
| 1713 | es | orta | açılış bağımsız; gövde paralel | yeniden yaz (gövde) |
| 1714 | es, de | yüksek | DE "Das Aufnahmegerät läuft, und das Gegenüber ist verstummt." = EN "The recorder is running and the person across the table has gone quiet." | yeniden yaz |
| 1714 | tr | orta | açılış birleştirilmiş; gövde paralel | yeniden yaz (gövde) |
| 1715 | tr | yüksek | TR "Hangi süper gücü isterdin?… Kızı cevabını düşünürken Nir Eyal'in eli cebindeki telefona gitti." = EN | yeniden yaz |
| 1715 | es, de | orta | ES ve DE açılışları birbirinin çevirisi ("Una tarde de verano, un libro de actividades…" = "Ein Sommernachmittag, ein Beschäftigungsbuch…"); gövde EN'ye paralel | yeniden yaz |
| 1716 | tr, es, de | yüksek | 3 dil EN ile kelime kelime: DE "das Rauschen im Kopf" = EN "the noise in a person's head" | yeniden yaz |
| 1717 | es, de | yüksek | ES "A las pocas páginas de un libro, la mente de Nicholas Carr se iba del texto." = EN | yeniden yaz |
| 1717 | tr | orta | açılış genişletilmiş; gövde paralel | yeniden yaz (gövde) |
| 1718 | es, de | yüksek | DE "Entscheidend war nicht das Wasser, sondern das Gesetz dahinter." = EN "What mattered was not the water but the law behind it." | yeniden yaz |
| 1718 | tr | orta | açılış aynı 3 vuruş; gövde paralel | yeniden yaz (gövde) |
| 1719 | tr, es, de | yüksek | ES "llevan encima el peso del cansancio" = EN "carry the weight of tiredness"; TR aynı cümleye dolgu eklemiş ("önce bir insan gibi konuşuyordu") | yeniden yaz |
| 1720 | tr, es, de | yüksek | DE "Ein Probiertisch auf einem Markt zeigte an einem Tag 24 Sorten…" = EN; ES "tras ver la pequeña" calque | yeniden yaz |
| 1721 | tr, es, de | yüksek | TR "teorisi jeologlar tarafından reddedildi" (edilgen, EN "the geologists turned the theory down" calque) | yeniden yaz |
| 1722 | tr, es, de | yüksek | TR "Ed Catmull'a göre Pixar'ın filmlerini kurtaran toplantının tam da bu yönü vardı" = EN; doğal değil | yeniden yaz |
| 1723 | de | yüksek | DE "Eine Hand dreht den Hahn in einer Sekunde auf. Die Wanne braucht Minuten…" = EN | yeniden yaz |
| 1723 | es | yüksek | ES "La mano gira el grifo en un segundo. La bañera tarda minutos…" = EN; gövde CV 0,44, kısmen serbest | yeniden yaz |
| 1723 | tr | orta | açılış bağımsız; gövde paralel | yeniden yaz (gövde) |
| 1724 | tr, es, de | orta | açılışlar bağımsız; gövde: TR "işe alışmak için çok vakti olmadı" = EN "he had little time to settle in" | yeniden yaz (gövde) |
| 1725 | es, de | yüksek | DE "Er wollte ihnen nicht seine Meinung zu den Märkten erzählen" = ES "No iba a contarles su opinión sobre los mercados" = EN | yeniden yaz |
| 1725 | tr | orta | açılış birleştirilmiş; gövde paralel | yeniden yaz (gövde) |
| 1726 | tr, es, de | orta | açılışlar bağımsız; gövde: DE "der Erbsenpflanzen zog und einzelne Merkmale beobachtete, etwa ob ein Samen rund oder runzelig war" = EN | yeniden yaz (gövde) |
| 1727 | es, de | yüksek | ES ve DE açılışları aynı sırada ("Cuarenta y ocho suscriptores…" = "Achtundvierzig Underwriter…"); gövde EN'ye paralel | yeniden yaz |
| 1727 | tr | yüksek | TR açılış EN sırası (yöneticiler → ölçüm → kırk sekiz kişi) + dolgu; gövde paralel | yeniden yaz |
| 1728 | de | yüksek | DE "Zwischen diesen beiden Tatsachen lag ein weiter Weg… mit einem Spiegel und einem Notizblock" = EN "closing the distance between those two facts with a mirror and a pad of notes" | yeniden yaz |
| 1728 | tr, es | yüksek | TR "Bu iki gerçek arasındaki mesafeyi… bir ayna ve birkaç not kâğıdı kapatmaya başladı" (EN calque, özne kaymış) | yeniden yaz |
| 1729 | tr, es, de | yüksek | ES "Los investigadores habían preparado ese silencio a propósito" = EN "The researchers had set up the silence on purpose" | yeniden yaz |
| 1730 | tr, es, de | yüksek | TR "Bavuluna e-postayla ilgili bir deney de koymuştu." = EN "He packed an experiment with email as well." (TR'de imge zorlama) | yeniden yaz |
| 1732 | tr, es, de | yüksek | DE "Sie hatten versucht, ihm den Treibstoff zu sagen" = EN "They had tried to tell him about the fuel" (DE'de doğal değil) | yeniden yaz |
| 1733 | tr, es, de | yüksek | 9/9 paragraf, cümle sayıları eşit; DE "Hundertvierundvierzig Verlage sagten Nein zu demselben Buch." = EN | yeniden yaz |
| 1734 | tr, es, de | düşük | önceden bağımsız yeniden yazıldı | dokunma |
| 1735 | es | yüksek | ES "Nada avanza, y la razón está alrededor de la mesa, no en las diapositivas." = EN | yeniden yaz |
| 1735 | tr, de | orta | açılış bağımsız; gövde paralel (TR "bir liderlik masalıdır ve şirket de ekip de kurgusaldır" = EN) | yeniden yaz (gövde) |
| 1736 | es | yüksek | ES "Sus números parecían señalar en la dirección equivocada." = EN | yeniden yaz |
| 1736 | tr, de | orta | açılış bağımsız; gövde paralel | yeniden yaz (gövde) |
| 1737 | es, de | yüksek | DE "Ihre Frage zeigte in die falsche Richtung, und jahrelang sah sie es nicht." = EN | yeniden yaz |
| 1737 | tr | orta | açılış aynı sıra; gövde paralel | yeniden yaz (gövde) |
| 1738 | tr, es | yüksek | ES "Las dos puntuaciones no salen iguales." = EN "The two ratings do not come out alike." | yeniden yaz |
| 1738 | de | orta | açılış eksiltili ama aynı sıra; gövde paralel | yeniden yaz (gövde) |
| 1739 | es | yüksek | ES "Ese pequeño desinterés se convirtió en una pregunta sobre marketing y en el título de un libro." = EN | yeniden yaz |
| 1739 | tr, de | orta | açılış serbest; gövde paralel | yeniden yaz (gövde) |
| 1740 | tr, es, de | yüksek | TR "Seattle'a döndüğünde bu manzarayı patronlarına anlatması gerekecekti." = EN | yeniden yaz |
| 1741 | tr | orta | açılış bağımsız; gövde EN'ye paralel | yeniden yaz (gövde) |
| 1741 | es, de | düşük | açılış ve gövde ilk paragrafı yeniden kurulmuş; sonrası EN'ye yakın | dokunma |
| 1742 | tr, es, de | yüksek | ES "destacaba algo que no gritaba" = EN "it did not shout" (calque) | yeniden yaz |
| 1743 | es, de | yüksek | DE "Bis zum Abend war der Herrscher ein Gefangener." = EN "By nightfall the emperor was a prisoner." | yeniden yaz |
| 1743 | tr | orta | açılış bağımsız ama "duruyordu" 3 kez tekrarlanıyor (kalite); gövde paralel | yeniden yaz (gövde + açılış dili) |
| 1744 | de | yüksek | DE "Niemand zwang sie dazu." = EN "Nobody forced them to."; gövde paralel | yeniden yaz |
| 1744 | tr, es | orta | açılış serbest; gövde: TR "Jared Diamond'ın *Collapse* kitabında iki Pasifik adası yan yana durur." = EN | yeniden yaz (gövde) |
| 1745 | tr, es | düşük | açılış ve gövde bağımsız | dokunma |
| 1745 | de | orta | gövde ES'nin yeniden sıralanmış hâli ("Der Schah wusste, wie man einen Preis verlangt" = ES "El sah sabía cómo cobrar") | yeniden yaz (gövde) |
| 1746 | tr, es, de | yüksek | TR "Roma, kendi düşmanlarının torunlarına koltuk veriyordu." = EN | yeniden yaz |
| 1747 | tr, es, de | yüksek | DE "Sie waren keine Flugzeugingenieure. Sie reparierten Fahrräder" = EN | yeniden yaz |
| 1748 | tr, es, de | yüksek | DE "Wer nicht auf dem Gipfel ist, kehrt um." = EN; TR "İki ekip aynı dağda, aynı sabahın içindeydi" calque | yeniden yaz |
| 1749 | tr, es, de | yüksek | "And the hardest part would begin only after…" = TR "Üstelik asıl zor kısım…" = ES "Y lo más duro empezaría…" = DE "Und das Schwerste begann erst…" | yeniden yaz |
| 1750 | es, de | yüksek | DE "Sie war Mathematikerin, deren Name in Berichten oft fehlte." = EN | yeniden yaz |
| 1750 | tr | orta | açılış EN'nin birleştirilmişi; gövde kısaltılmış çeviri | yeniden yaz |
| 1751 | tr, es, de | yüksek | ES "Prefirió caminar, con sus propios pies, por las calles que Londres acababa de perder." = EN "on his own feet, the streets London had just lost" | yeniden yaz |
| 1752 | es, de | yüksek | DE "Ihre Kinder sahen die Nacht, in der man sie mitnahm." = EN "Her children saw the night she was taken." (doğal değil) | yeniden yaz |
| 1752 | tr | yüksek | TR "Komşuları sustu, örgüt sustu." = EN; gövde kısaltılmış çeviri | yeniden yaz |
| 1753 | es, de | yüksek | ES "¿Quién decía la verdad, y quién iba a decidirlo?" = EN | yeniden yaz |
| 1753 | tr | orta | açılış EN'ye paralel ("ve bunu kim ölçecekti?"); gövde daha serbest | yalnız açılış |
| 1754 | es, de | yüksek | DE "In der Lücke, die diese Regel ließ, begannen die Todesfälle" = EN "The deaths began inside the gap that rule left" | yeniden yaz |
| 1754 | tr | orta | açılış aynı sıra; gövde kısaltılmış çeviri | yeniden yaz (gövde) |
| 1755 | tr, es, de | yüksek | DE "Es war das letzte Wort, das man von ihm hatte." = EN. TR "bir yaz sonunda" diyor, EN "end of one May": olgu kayması, kontrol edilmeli | yeniden yaz |
| 1756 | tr, es, de | orta | açılışlar bağımsız; gövde: ES "Era astrónomo, historiador, geógrafo…" = EN cümle cümle | yeniden yaz (gövde) |
| 1757 | tr, es, de | yüksek | bkz. "Genel bulgu"; açılış: TR "O, yine de bir tanesini bıraktı." = EN "He kept just one." | yeniden yaz |
| 1758 | tr, es, de | yüksek | DE "Diese Neugier brachte am Ende ein Werkzeug hervor" = EN "That curiosity ended up producing a tool" | yeniden yaz |
| 1759 | tr, es, de | yüksek | ES "y no le pidió permiso" = EN "and did not ask her permission"; gövde: DE "Damals verlangte die Praxis keine Einwilligung." = EN (calque) | yeniden yaz |
| 1760 | tr, es, de | orta | açılışlar bağımsız; gövde: DE "In einem Schutzgebiet alter Buchen lagen bemooste Steine, sanft geschwungen, mit ausgehöhlten Stellen." = EN | yeniden yaz (gövde) |
| 1761 | tr, es, de | yüksek | DE "leisten Arbeit, die dich erstaunen würde" = EN "do work that would amaze you" | yeniden yaz |
| 1762 | es, de | yüksek | ES "mientras un artesano de la madera iba en una dirección totalmente distinta" = EN | yeniden yaz |
| 1762 | tr | yüksek | TR "Bir gemi kayalıklara çarptı, çünkü… kimse bilmiyordu." = EN | yeniden yaz |
| 1763 | tr, es, de | düşük | açılış ve gövde bağımsız | dokunma |
| 1764 | tr, es, de | orta | açılışlar bağımsız; gövde EN'ye paralel ("ein System, das sie als korrupt und oft unfähig beschreibt") | yeniden yaz (gövde) |
| 1765 | tr, es, de | orta | açılışlar bağımsız; gövde: ES/DE 5/5 paragraf, CV 0,20–0,27, EN p1 cümle cümle | yeniden yaz (gövde) |
| 1766 | tr, es, de | orta | açılışlar bağımsız; gövde paralel (ES/DE aynı ek yapı: "un cirujano famoso por su velocidad" = "einem für seine Schnelligkeit berühmten Chirurgen") | yeniden yaz (gövde) |
| 1767 | tr, es, de | orta | açılışlar bağımsız; gövde: DE "kommt Feynman ausgebrannt nach Cornell" = EN "Feynman arrives at Cornell burned out" | yeniden yaz (gövde) |
| 1768 | tr, es, de | orta | açılışlar bağımsız; gövde: DE "Große Neuverdrahtung" = EN "Great Rewiring" (sıra aynı) | yeniden yaz (gövde) |
| 1769 | tr, es, de | orta | açılışlar bağımsız; gövde: ES "toma una sola conducta, un acto violento, y pregunta por qué ocurrió" = EN | yeniden yaz (gövde) |
| 1770 | tr, es, de | orta | açılışlar bağımsız; gövde paralel | yeniden yaz (gövde) |
| 1772 | tr, es, de | orta | açılışlar bağımsız; gövde: ES/DE = EN "uses Whitman's case to ask how much of a decision belongs to the conscious self" | yeniden yaz (gövde) |
| 1774 | tr, es, de | orta | açılışlar bağımsız; gövde: TR "Bir pusudan çıkan… bir cunk, bayrak çekerek gemiye yaklaştı" (EN calque, "cunk") | yeniden yaz (gövde) |
| 1775 | de | yüksek | DE açılış ve gövde = EN ("Die Ergebnisse passten nicht zusammen." = "The two sets of scores did not match.") | yeniden yaz |
| 1775 | tr, es | düşük | açılış ve gövde başka deneylerle bağımsız başlıyor | dokunma |
| 1776 | tr, es, de | orta | açılışlar bağımsız; gövde 6/6 paragraf, CV 0,16–0,21 | yeniden yaz (gövde) |
| 1777 | tr, es, de | orta | açılışlar bağımsız; gövde: TR "Böyle bir şirket henüz yoktu." = EN "The company did not exist yet." | yeniden yaz (gövde) |
| 1778 | tr, es, de | düşük | açılış ve gövde bağımsız | dokunma |
| 1779 | es | yüksek | açılış EN'nin çevirisi (aşağıda ayrıntı); gövde: ES "La sala casi explotó. El consejo le dejó explorar la idea de todos modos." = EN | yeniden yaz |
| 1779 | de | yüksek | açılış EN açılışı + EN p1 yeniden sıralanmış (aşağıda); gövde paralel | yeniden yaz |
| 1779 | tr | orta | açılış bağımsız (Jobs'un beyaz tahtası); gövde: TR "Oda neredeyse patladı." = EN | yeniden yaz (gövde) |
| 1780 | tr | orta | açılış EN'nin çevirisi (aşağıda); gövde bağımsız sırayla kurulmuş | yalnız açılış |
| 1780 | es, de | yüksek | açılış çeviri; gövde: DE "Er folgerte, dass das Entfernen weniger starker Kräfte die Talentdichte erhöhte." = EN | yeniden yaz |
| 1781 | tr, es | orta | açılışlar bağımsız; gövde EN'ye paralel ("Tyler Shultz, graduado de Stanford, entró en la empresa en 2013…") | yeniden yaz (gövde) |
| 1781 | de | düşük | açılış ve gövde bağımsız | dokunma |
| 1782 | tr, es, de | orta | açılışlar bağımsız (TR olgular aynı ama kendi sırasıyla); gövde: 3 dil EN p1 cümle cümle ("…als wäre Kapital umsonst") | yeniden yaz (gövde) |

## Sayılar (id×dil, EN hariç, 86 id × 3 dil = 258)

| ciddiyet | sayı |
|---|---|
| yüksek | 147 |
| orta | 89 |
| düşük | 22 |

Öneri dağılımı: yeniden yaz (tam) 150 · yeniden yaz (gövde) 84 · yalnız açılış 2 (1753 tr, 1780 tr) · dokunma 22. Tam yeniden yazılacak 150 satırın 3'ü orta ciddiyette: 1715 es/de ve 1750 tr.

Not: 1755 TR'de "bir yaz sonunda" ifadesi EN'deki "end of one May" ile çelişiyor. Bu bir olgu hatası olabilir, ayrı kontrol edilmeli.

---

## 1779 ve 1780: açılış ayrıntısı ve öneriler

### 1779 (Iger / Pixar)

EN kaynak açılış (43 kelime):
> The board room nearly exploded when the new CEO put his fourth option on the table: buy the studio that had overtaken his own. The board still let him explore it. The man who would have to sell it kept a longer list of objections.

**TR: bağımsız.** Steve Jobs'un beyaz tahtadaki artı/eksi listesiyle açılıyor; EN'de bu sahne yok. Dokunma.

**ES: çeviri kokuyor (yüksek).**
- ES "la cuarta opción de la lista casi provoca una explosión: comprar el estudio que había superado al suyo" = EN "nearly exploded … fourth option … buy the studio that had overtaken his own". İki noktalı kalıp ve "el estudio que había superado al suyo" sırası EN'den.
- ES "Aun así, el nuevo director ejecutivo consiguió permiso para explorarla." = EN "The board still let him explore it."
- "casi provoca una explosión" ifadesi İngilizce "nearly exploded" deyiminin karşılığı ve İspanyolcada yapay duruyor.

**DE: çeviri kokuyor (yüksek).** Metin EN açılışı ile EN gövde p1'in yeniden sıralanmış çevirisi.
- DE "Mütter mit Kindern unter zwölf Jahren nannten Pixar inzwischen die bessere Marke für die Familie als Disney" = EN p1 "the brand mothers with children under twelve called good for their family". "die bessere Marke für die Familie als Disney" sırası kurgusal ve doğal değil.
- DE "die vierte war, das Studio zu kaufen, das ihn überholt hatte" = EN "buy the studio that had overtaken his own". Ayrıca "ihn" yanlış referans: stüdyo Disney'i geçti, CEO'yu değil.
- DE "Im Aufsichtsrat wäre der Raum fast explodiert." = EN "The room nearly exploded." Almancada "Raum explodiert" deyimi yok.

Öneri ES (~40 kelime, olgular aynı: yeni CEO, kurul, dördüncü/son seçenek, stüdyoyu satın almak, kendi stüdyosunu geçmiş olması, kurulun incelemeye izin vermesi):
> Iger llegó al consejo de Disney con cuatro propuestas y guardó la más atrevida para el final: comprar Pixar, el estudio que ya les había tomado la delantera. La sala estuvo a punto de estallar. Aun así, salió de allí con luz verde para estudiarla.

Öneri DE (~42 kelime, olgular aynı: 12 yaş altı çocuklu anneler Pixar'ı daha iyi aile markası sayıyor, yeni CEO, dört seçenekten sonuncusu stüdyoyu satın almak, kurulda neredeyse patlama):
> Mütter mit Kindern unter zwölf sahen in Pixar längst die bessere Familienmarke, nicht mehr in Disney. Als letzte von vier Optionen schlug der neue Konzernchef dem Aufsichtsrat vor, genau dieses Studio zu kaufen. Im Saal kochte die Stimmung beinahe über.

### 1780 (Netflix / No Rules Rules)

EN kaynak açılış (44 kelime):
> Netflix's expense policy is five words long, and its vacation policy is shorter still: there is none. Behind both is a company that once cut about a third of its people and expected the rest to slump. They did not.

Üç dil de cümle cümle EN: 3 cümle, aynı sıra, aynı kapanış ritmi ("They did not.").

**TR: çeviri kokuyor (orta; gövde bağımsız olduğu için yalnız açılış).**
- TR "Netflix'in harcama politikası beş kelimeden oluşuyor, izin politikası ise daha da kısa: yok." = EN "…is five words long, and its vacation policy is shorter still: there is none." "Daha da kısa: yok" İngilizce espri kalıbının birebir aktarımı.
- TR "İkisinin arkasında … bir şirket var." = EN "Behind both is a company…". Türkçede doğal değil.
- TR "Çökmediler." = EN "They did not." Ayrıca "slump" için "çökmek" fazla ağır.
- Ek not: TR gövdesindeki kural cümlesi ("Netflix'in çıkarına göre davran") Türkçede dört kelime. "Beş kelime" iddiası yalnız İngilizce özgün cümle için doğru.

**ES: çeviri kokuyor (yüksek).**
- ES "La política de gastos de Netflix cabe en cinco palabras, y la de vacaciones es todavía más corta: no existe." = EN.
- ES "Detrás de las dos hay una empresa que…" = EN "Behind both is a company…".
- ES "No decayó." = EN "They did not." Özne de tekile kaymış ("el resto … No decayó").

**DE: çeviri kokuyor (yüksek).**
- DE "Dahinter steht eine Firma, die sich einmal von etwa einem Drittel ihrer Leute trennte und erwartete, dass der Rest abfällt. Er fiel nicht ab." = EN. "der Rest abfällt / Er fiel nicht ab" Almancada doğal değil ("abfallen" burada performans düşüşünü anlatmıyor).

Öneri TR (~40 kelime, olgular aynı: masraf kuralı çok kısa, izin kuralı yok, çalışanların yaklaşık üçte biri çıkarıldı, kalanların moralinin çökmesi beklendi, çökmedi):
> Netflix'te masrafları beş kelimelik tek bir İngilizce cümle belirliyor, izin günlerini sayan bir kural ise hiç yok. Bu rahatlığın kökü, şirketin çalışanlarının üçte birine yakınını çıkardığı günlere uzanıyor. Hastings kalanların moralinin dibe vuracağını sanıyordu, tersi oldu.

Öneri ES (~47 kelime):
> En Netflix, los gastos se rigen por una frase de cinco palabras y las vacaciones, por nada: nadie cuenta los días. Todo arranca cuando la empresa prescindió de casi un tercio de la plantilla y Hastings dio por hecho que el ánimo de los demás se hundiría. Se equivocó.

Öneri DE (~45 kelime):
> Bei Netflix passen die Spesenvorgaben in fünf Wörter, und Urlaubstage zählt dort niemand. Angefangen hatte das mit einem harten Schnitt: Etwa ein Drittel der Belegschaft musste gehen, und Hastings rechnete fest damit, dass die Stimmung bei den Übrigen kippt. Sie kippte nicht.

Not: "Hastings" adı EN açılışında geçmiyor ama gövdede var. "nadie cuenta los días" / "Urlaubstage zählt niemand" gövdedeki "neither allots vacation days nor tracks them" olgusundan geliyor. Yeni olgu eklenmedi. "Beş kelime" iddiası İngilizce özgün kural için geçerli; TR öneride bu yüzden "İngilizce cümle" dendi. ES/DE'de de istenirse aynı açıklama eklenebilir.

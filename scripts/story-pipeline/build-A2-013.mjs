#!/usr/bin/env node
/**
 * build-A2-013.mjs — Is plani Adim 2, yedinci parti. Kitap 110 (Talent Is
 * Overrated / Yetenek Yanilgisi, Geoff Colvin). Uc hikaye 1 dk -> 3 dk;
 * kitap tamamlaniyor.
 *
 * BU PARTI SON `contested` BULGUSUNUN BIRINI KAPATIYOR (1427).
 *
 * DUZELTMELER:
 *
 * 1426 — Mozart. Hikaye dogru yondeydi ama Colvin'in EN GUCLU KANITLARI
 *        eksikti ve onlar olmadan iddia bos kaliyordu:
 *          (a) Erken bestelerin el yazisi Mozart'in DEGIL, Leopold'un;
 *              cocuk henuz nota yazamiyordu.
 *          (b) Leopold, oglu "beste yapmaya basladiginda" kendi beste
 *              yapmayi birakti.
 *          (c) On bir yasinda yazdigi ilk dort piyano konsertosunda OZGUN
 *              MUZIK YOK; baska bestecilerden derlenmis duzenlemeler.
 *          (d) Bugun basyapit sayilan ilk eseri Dokuzuncu Piyano Konsertosu
 *              (K. 271) ve onu YIRMI BIR yasinda yazdi — 18+ yil egitimden
 *              sonra.
 *        Ayrica eski $$ dersi ("Deha dogustan gelmez — binlerce saatlik
 *        pratikten dogar") 1164'un eski dersiyle neredeyse aynıydi; iki ayri
 *        kitapta ayni cumle. Degistirildi.
 *
 * 1427 — audit-facts `contested` bulgusu. Metin "10.000 saat" tartismasinin
 *        tam ortasinda durup hicbir cekince tasimiyordu. Ayrica hekim
 *        karsilastirmasi kaynaksizdi; gercek kaynak Choudhry, Fletcher &
 *        Soumerai 2005 (Annals of Internal Medicine) sistematik derlemesi:
 *        meslekte gecen yil sayisi ile bakim kalitesi arasinda cogu olcutte
 *        TERS iliski.
 *
 * 1428 — IKI KUSUR:
 *        (a) YANLIS ORNEK LISTESI. Metin "Tiger Woods, Serena Williams,
 *            Yo-Yo Ma, Warren Buffett, Jack Welch" diyordu. Colvin'in kitapta
 *            kullandigi isimler Tiger Woods, Winston Churchill, Warren Buffett
 *            ve Jack Welch. Serena Williams ve Yo-Yo Ma Colvin'in ornekleri
 *            degil; listeye sonradan girmis.
 *        (b) DOGRULANAMAYAN ATIFLI ALINTI, ustelik ## PAYLAS BLOGUNUN ICINDE
 *            — kendi risk siralamama gore en yuksek sinif. "Dunyanin en buyuk
 *            yeteneklerinden hicbiri basarilarini tamamen kendi basina
 *            gelistirmedi" cumlesi Colvin'e tirnak icinde atfediliyordu ve
 *            hicbir kaynakta bulunamadi. Tirnak kaldirildi, savi aktarilan
 *            bicime cevrildi.
 *        (c) CEKINCE EKLENDI: Colvin'in inceledigi isimlerin hepsi zaten
 *            basarili olmus kisiler. Basarisiz olanlarda koc var miydi,
 *            kitap bunu olcmuyor. Bu bir SAGKALIM YANLILIGI ve metinde
 *            hic yoktu.
 *
 * ORTAK CEKINCE (1426 + 1427): Colvin'in kitabi 2008'de cikti ve merkezi tezi
 * sonradan zayiflatildi. Macnamara, Hambrick & Oswald 2014 (Psychological
 * Science) meta-analizi kasitli pratigin performans farkinin ne kadarini
 * acikladigini alan alan olctu: oyunlar %26, muzik %21, spor %18, egitim %4,
 * meslekler %1'in altinda.
 * DIKKAT: Yaygin dolasan "%12" toplam rakami dogrulanamadi; bu yuzden
 * kullanilmadi. Alan bazli rakamlar hem dogrulandi hem daha bilgilendirici.
 */
import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { ROOT } from './lib/store.mjs';

const OUT = resolve(ROOT, 'staging/batch-A2-013.json');

/* ================================================================== 1426 */

const S1426 = {
  tr: {
    title: 'Notaları kim yazdı',
    description:
      "Mozart efsanesinin en can alıcı ayrıntısı el yazısında: erken bestelerin notalarını çocuk değil babası yazmıştı.",
    hook: "Mozart'ın ilk bestelerinin el yazısı Mozart'ın değil. Babasının.",
    content: `Geoff Colvin bir efsaneyle başlıyor.

Mozart. Doğuştan dâhi. Üç yaşında piyanoya oturdu, beş yaşında beste yaptı, sekiz yaşında senfoni yazdı.

Doğuştan gelen bir armağan, değil mi?

Colvin dosyayı açıyor ve içinden başka bir hikâye çıkıyor.

Babası Leopold Mozart, dönemin tanınmış keman pedagoglarından biriydi. Wolfgang'ın doğduğu yıl, 1756'da, keman eğitimi üzerine kapsamlı bir kitap yayımladı. Yani oğlu doğduğunda elinde hem bir yöntem hem de bir kariyer hırsı vardı.

Sistematik eğitim en geç üç yaşında başladı. Günde saatlerce, yıl boyunca, aralıksız. Leopold çocukları altı yaşından itibaren Avrupa turlarına çıkardı; Wolfgang çocukluğunun büyük bölümünü sahnede ve yolda geçirdi.

##Colvin'in en can alıcı ayrıntısı şu: Mozart'ın o erken bestelerinin el yazısı Mozart'ın değil. Notaları kâğıda geçiren Leopold'du — çocuk henüz kendi yazamıyordu.##

Ve Leopold, oğlu "beste yapmaya başladığında" kendi beste yapmayı bıraktı.

İkinci ayrıntı daha da rahatsız edici. Mozart'ın on bir yaşında yazdığı ilk dört piyano konçertosunda özgün müzik yok. Başka bestecilerin parçalarından derlenmiş düzenlemeler.

Bugün başyapıt sayılan ilk eseri Dokuzuncu Piyano Konçertosu. Onu yirmi bir yaşında yazdı — on sekiz yılı aşan bir eğitimin ardından. Yani erken üretim vardı, ama erken ustalık yoktu.

Colvin'in sorusu şu: Leopold aynı programı başka bir çocuğa uygulasaydı benzer bir sonuç çıkar mıydı?

Kesin cevap yok ve Colvin de kesin cevap vermiyor. Argümanı daha ölçülü: "deha"yı açıklamak için pratikten bağımsız bir yetenek faktörü varsaymak zorunlu değil.

Bu, Wolfgang'ın olağanüstü olmadığı anlamına gelmiyor. Colvin'in söylediği daha ince bir şey: olağanüstülüğün başladığı yeri kimse görmüyor, çünkü o yer bir salonda değil, evin içinde ve yıllar boyunca.

Aynı örüntü bugün her alanda görünüyor. Satrançta, jimnastikte, teniste, kemanda "harika çocuk" diye anılanların neredeyse tamamı üç ile altı yaş arasında yoğun ve yönlendirilmiş bir eğitime girmiş oluyor. Erken yaş bir armağan işareti değil; erken başlangıç işareti.

Burada bir çekince gerekiyor. Colvin'in kitabı 2008'de çıktı ve merkezi tezi o zamandan beri zayıflatıldı. Macnamara, Hambrick ve Oswald'ın 2014'te Psychological Science'ta yayımladığı meta-analiz, kasıtlı pratiğin performans farkının ne kadarını açıkladığını alan alan ölçtü: oyunlarda yüzde yirmi altı, müzikte yüzde yirmi bir, sporda yüzde on sekiz, eğitimde yüzde dört, mesleklerde yüzde birin altında.

Yani müzikte pratik çok şey açıklıyor, her şeyi açıklamıyor. Mozart'ı yalnızca saatlerle kurmak, yalnızca armağanla kurmak kadar eksik.

Ama pratik tarafı hikâyenin ihmal edilen tarafı. Mozart anlatılırken üç yaşındaki çocuk anlatılıyor, o çocuğun arkasındaki kitap yazmış öğretmen anlatılmıyor. Kimse Leopold'u anlatmıyor.

$$Erken başlangıç deha gibi görünür — çünkü başlangıcı kimse görmemiştir.$$

&&"Bunda yeteneğim yok" dediğin ama hiç ciddi ve yönlendirilmiş pratik yapmadığın bir alan var mı?&&`,
    punchline:
      "Mozart'ın erken bestelerinin notalarını babası yazdı; başyapıt sayılan ilk eseri yirmi bir yaşında geldi.",
    thirty_sec:
      "Mozart efsanesi üç yaşında başlayan bir armağan anlatır. Colvin dosyayı açıyor: babası Leopold dönemin tanınmış keman pedagoglarındandı ve oğlunu en geç üç yaşında sistematik eğitime aldı. Erken bestelerin el yazısı Wolfgang'ın değil, Leopold'un. On bir yaşındaki ilk dört konçertoda özgün müzik yok. Başyapıt sayılan ilk eseri yirmi bir yaşında, on sekiz yılı aşan eğitimin ardından geldi.",
    question:
      '"Yeteneğim yok" dediğin ama hiç yönlendirilmiş pratik yapmadığın bir alan var mı?',
    key_contrast: 'Erken üretim, geç ustalık',
  },
  en: {
    title: 'Whose handwriting was it',
    description:
      "The sharpest detail in the Mozart legend is the handwriting: the notes of the early compositions were written by the father, not the child.",
    hook: "The handwriting on Mozart's earliest compositions is not Mozart's. It is his father's.",
    content: `Geoff Colvin opens with a legend.

Mozart. Born a genius. Sat at the keyboard at three, composed at five, wrote a symphony at eight.

An innate gift, surely.

Colvin opens the file and a different story comes out.

His father, Leopold Mozart, was one of the best-known violin teachers of the period. In 1756, the year Wolfgang was born, he published a comprehensive treatise on violin instruction. So when his son arrived he had both a method and a career ambition in hand.

Systematic training began by age three at the latest. Hours a day, year round. From the age of six Leopold took the children on tours of Europe; Wolfgang spent most of his childhood on stage and on the road.

##Colvin's sharpest detail: the handwriting on Mozart's early compositions is not Mozart's. Leopold put the notes on paper — the child could not yet write them himself.##

And Leopold stopped composing himself around the time his son supposedly started.

The second detail is more uncomfortable. The first four piano concertos, written at eleven, contain no original music. They are arrangements assembled from other composers' works.

The first piece now regarded as a masterwork is the Ninth Piano Concerto. He wrote it at twenty-one — after more than eighteen years of training. There was early output, but not early mastery.

Colvin's question is whether Leopold would have got a comparable result running the same programme on some other child.

There is no definite answer and Colvin does not give one. His argument is more measured: explaining "genius" does not require positing a talent factor independent of practice.

None of this means Wolfgang was ordinary. Colvin's point is finer: nobody sees where the extraordinary began, because it began indoors and across years rather than on a stage.

The same pattern shows up everywhere now. In chess, gymnastics, tennis, violin, almost everyone called a prodigy entered intensive guided training between three and six. Young age is not a sign of a gift; it is a sign of an early start.

A caveat belongs here. Colvin's book appeared in 2008 and its central claim has been weakened since. The meta-analysis by Macnamara, Hambrick and Oswald in Psychological Science in 2014 measured how much of the performance difference deliberate practice accounts for, domain by domain: twenty-six percent in games, twenty-one in music, eighteen in sports, four in education, under one percent in the professions.

So in music practice explains a great deal, but not everything. Building Mozart out of hours alone is as incomplete as building him out of gift alone.

But the practice side is the neglected side of the story. Nobody tells you about Leopold.

$$An early start looks like genius — because nobody was watching the start.$$

&&Is there a field where you say you have no talent, but where you have never done serious, guided practice?&&`,
    punchline:
      "Mozart's father wrote out the notes of the early compositions; the first work regarded as a masterwork came at twenty-one.",
    thirty_sec:
      "The Mozart legend describes a gift that arrived at three. Colvin opens the file: his father Leopold was one of the best-known violin teachers of the period and had his son in systematic training by three at the latest. The handwriting on the early compositions is Leopold's, not Wolfgang's. The first four concertos, at eleven, contain no original music. The first work regarded as a masterwork came at twenty-one.",
    question:
      'Is there a field where you claim no talent but have never practised in a guided way?',
    key_contrast: 'Early output, late mastery',
  },
  es: {
    title: 'De quién era la letra',
    description:
      'El detalle más agudo de la leyenda de Mozart está en la letra: las notas de las primeras composiciones las escribió el padre, no el niño.',
    hook: 'La letra de las primeras composiciones de Mozart no es de Mozart. Es de su padre.',
    content: `Geoff Colvin empieza con una leyenda.

Mozart. Genio de nacimiento. Se sentó al teclado a los tres años, compuso a los cinco, escribió una sinfonía a los ocho.

Un don innato, ¿verdad?

Colvin abre el expediente y sale otra historia.

Su padre, Leopold Mozart, era uno de los profesores de violín más conocidos de la época. En 1756, el año en que nació Wolfgang, publicó un tratado exhaustivo sobre enseñanza del violín. Así que cuando llegó su hijo tenía en la mano un método y una ambición de carrera.

La formación sistemática empezó a los tres años como muy tarde. Horas al día, todo el año. Desde los seis Leopold llevó a los niños de gira por Europa; Wolfgang pasó buena parte de su infancia en escena y en camino.

##El detalle más agudo de Colvin: la letra de las primeras composiciones de Mozart no es de Mozart. Leopold pasaba las notas al papel; el niño aún no podía escribirlas.##

Y Leopold dejó de componer por su cuenta hacia la época en que su hijo supuestamente empezó.

El segundo detalle es más incómodo. Los primeros cuatro conciertos para piano, escritos a los once, no contienen música original. Son arreglos armados con obras de otros compositores.

La primera pieza que hoy se considera una obra maestra es el Noveno Concierto para Piano. Lo escribió a los veintiuno, tras más de dieciocho años de formación. Hubo producción temprana, pero no maestría temprana.

La pregunta de Colvin es si Leopold habría obtenido un resultado comparable aplicando el mismo programa a otro niño.

No hay respuesta definitiva y Colvin no la da. Su argumento es más medido: explicar el "genio" no exige postular un factor de talento independiente de la práctica.

Nada de esto significa que Wolfgang fuera corriente. El punto de Colvin es más fino: nadie ve dónde empezó lo extraordinario, porque empezó dentro de casa y a lo largo de años, no en un escenario.

El mismo patrón aparece hoy en todas partes. En ajedrez, gimnasia, tenis o violín, casi todos los llamados prodigios entraron en formación intensiva y guiada entre los tres y los seis años. La edad temprana no es señal de un don; es señal de un comienzo temprano.

Aquí corresponde una advertencia. El libro de Colvin es de 2008 y su tesis central se ha debilitado desde entonces. El metaanálisis de Macnamara, Hambrick y Oswald en Psychological Science en 2014 midió cuánto de la diferencia de rendimiento explica la práctica deliberada, dominio por dominio: veintiséis por ciento en juegos, veintiuno en música, dieciocho en deportes, cuatro en educación, menos del uno por ciento en las profesiones.

Así que en música la práctica explica mucho, no todo. Construir a Mozart solo con horas es tan incompleto como construirlo solo con un don.

Pero el lado de la práctica es el lado olvidado de la historia. Nadie te cuenta nada de Leopold.

$$Un comienzo temprano parece genio, porque nadie estaba mirando el comienzo.$$

&&¿Hay algún campo en el que dices no tener talento pero en el que nunca has practicado en serio y con guía?&&`,
    punchline:
      'El padre de Mozart escribía las notas de las primeras composiciones; la primera obra maestra llegó a los veintiuno.',
    thirty_sec:
      'La leyenda de Mozart habla de un don que apareció a los tres años. Colvin abre el expediente: su padre Leopold era uno de los profesores de violín más conocidos de la época y lo tenía en formación sistemática a los tres como muy tarde. La letra de las primeras composiciones es de Leopold. Los primeros cuatro conciertos, a los once, no tienen música original. La primera obra maestra llegó a los veintiuno.',
    question:
      '¿Hay un campo donde dices no tener talento pero nunca has practicado con guía?',
    key_contrast: 'Producción temprana, maestría tardía',
  },
  de: {
    title: 'Von wem war die Handschrift',
    description:
      'Das schärfste Detail der Mozart-Legende steckt in der Handschrift: Die Noten der frühen Kompositionen schrieb der Vater, nicht das Kind.',
    hook: 'Die Handschrift auf Mozarts frühesten Kompositionen ist nicht Mozarts. Sie ist die seines Vaters.',
    content: `Geoff Colvin beginnt mit einer Legende.

Mozart. Als Genie geboren. Mit drei am Klavier, mit fünf komponiert, mit acht eine Sinfonie geschrieben.

Eine angeborene Gabe, nicht wahr?

Colvin öffnet die Akte, und eine andere Geschichte kommt heraus.

Sein Vater, Leopold Mozart, war einer der bekanntesten Violinpädagogen der Zeit. 1756, im Geburtsjahr Wolfgangs, veröffentlichte er eine umfassende Violinschule. Als sein Sohn kam, hatte er also eine Methode und einen Karriereehrgeiz in der Hand.

Die systematische Ausbildung begann spätestens mit drei Jahren. Stunden am Tag, das ganze Jahr. Ab dem sechsten Lebensjahr nahm Leopold die Kinder auf Europatourneen mit; Wolfgang verbrachte einen großen Teil seiner Kindheit auf der Bühne und auf Reisen.

##Colvins schärfstes Detail: Die Handschrift auf Mozarts frühen Kompositionen ist nicht Mozarts. Leopold brachte die Noten zu Papier – das Kind konnte sie noch nicht selbst schreiben.##

Und Leopold hörte etwa dann auf, selbst zu komponieren, als sein Sohn angeblich anfing.

Das zweite Detail ist unangenehmer. Die ersten vier Klavierkonzerte, mit elf geschrieben, enthalten keine eigene Musik. Es sind Bearbeitungen, zusammengesetzt aus Werken anderer Komponisten.

Das erste Stück, das heute als Meisterwerk gilt, ist das Neunte Klavierkonzert. Er schrieb es mit einundzwanzig – nach mehr als achtzehn Jahren Ausbildung. Es gab frühe Produktion, aber keine frühe Meisterschaft.

Colvins Frage ist, ob Leopold mit demselben Programm bei einem anderen Kind ein vergleichbares Ergebnis erzielt hätte.

Es gibt keine sichere Antwort, und Colvin gibt keine. Sein Argument ist zurückhaltender: Um „Genie“ zu erklären, muss man keinen von der Übung unabhängigen Talentfaktor annehmen.

Das heißt nicht, dass Wolfgang gewöhnlich war. Colvins Punkt ist feiner: Niemand sieht, wo das Außergewöhnliche begann, denn es begann im Haus und über Jahre, nicht auf einer Bühne.

Dasselbe Muster zeigt sich heute überall. Im Schach, im Turnen, im Tennis, an der Geige – fast alle, die Wunderkind genannt werden, kamen zwischen drei und sechs in intensive, angeleitete Ausbildung. Ein junges Alter ist kein Zeichen für eine Gabe, sondern für einen frühen Anfang.

Hier gehört ein Vorbehalt hin. Colvins Buch erschien 2008, und seine zentrale Behauptung wurde seither geschwächt. Die Metaanalyse von Macnamara, Hambrick und Oswald in Psychological Science von 2014 maß domänenweise, wie viel des Leistungsunterschieds bewusstes Üben erklärt: sechsundzwanzig Prozent bei Spielen, einundzwanzig in der Musik, achtzehn im Sport, vier in der Bildung, unter einem Prozent in den Berufen.

In der Musik erklärt Übung also sehr viel, aber nicht alles. Mozart allein aus Stunden zu bauen, ist so unvollständig wie ihn allein aus einer Gabe zu bauen.

Doch die Übungsseite ist die vernachlässigte Seite der Geschichte. Von Leopold erzählt niemand.

$$Ein früher Anfang sieht wie Genie aus – weil niemand beim Anfang zugesehen hat.$$

&&Gibt es ein Feld, in dem Sie sagen, Sie hätten kein Talent, in dem Sie aber nie ernsthaft und angeleitet geübt haben?&&`,
    punchline:
      'Mozarts Vater schrieb die Noten der frühen Kompositionen; das erste als Meisterwerk geltende Stück kam mit einundzwanzig.',
    thirty_sec:
      'Die Mozart-Legende erzählt von einer Gabe, die mit drei erschien. Colvin öffnet die Akte: Sein Vater Leopold war einer der bekanntesten Violinpädagogen der Zeit und nahm den Sohn spätestens mit drei in systematische Ausbildung. Die Handschrift der frühen Kompositionen ist Leopolds. Die ersten vier Konzerte, mit elf, enthalten keine eigene Musik. Das erste Meisterwerk kam mit einundzwanzig.',
    question:
      'Gibt es ein Feld, in dem Sie kein Talent behaupten, aber nie angeleitet geübt haben?',
    key_contrast: 'Frühe Produktion, späte Meisterschaft',
  },
};

/* ================================================================== 1427 */

const S1427 = {
  tr: {
    title: 'Yirmi yıllık hekim, beş yıllık hekim',
    description:
      'Meslekte geçen yıl sayısı ile bakım kalitesi arasında ters bir ilişki var. Colvin bunu rutin pratik ile kasıtlı pratik ayrımıyla açıklıyor.',
    hook: 'Yirmi yıllık hekim beş yıllık hekimden daha iyi teşhis koymuyor. Derleme bunu ölçtü.',
    content: `Geoff Colvin şaşırtıcı bir bulguyla başlıyor.

Yirmi yıllık deneyimli bir hekimle beş yıllık genç bir hekim karşılaştırılıyor. Hangisi daha iyi teşhis koyar?

Sezgisel cevap belli: yirmi yıllık.

Bulgu ters yönde. Choudhry, Fletcher ve Soumerai'nin 2005'te Annals of Internal Medicine'da yayımladığı sistematik derleme, hekimin meslekte geçirdiği yıl sayısı ile verdiği bakımın kalitesi arasında çoğu ölçütte ters bir ilişki buldu. Kıdemli hekimler güncel kanıttan daha uzak kalma eğilimindeydi.

Yani deneyim otomatik olarak yetkinlik üretmiyor.

Nedeni de tahmin edilebilir. Tıp bilgisi hızla yenileniyor; eğitimde öğrenilen şey on yıl içinde kısmen geçersiz hale geliyor. Rutin ise eski alışkanlığı pekiştiriyor. Yıllar geçtikçe hekim daha çok hasta görüyor ama çoğu zaman aynı yöntemi tekrar ediyor.

Bulgunun kapsamı tıpla sınırlı değil. Bilginin yenilendiği her alanda aynı mekanizma çalışıyor: mühendislikte, hukukta, yazılımda, eğitimde. "Yirmi yıllık deneyim" bazen yirmi yıl öğrenmek, bazen bir yılı yirmi kez yaşamak anlamına geliyor.

##Colvin ayrımı şöyle kuruyor: rutin pratik tekrardır. Kasıtlı pratik zor noktayı hedef alan, geri bildirimle yönlendirilen, sınırı sürekli zorlayan çalışmadır. Yıllar ikisini birbirinden ayırt etmez.##

Örnek havacılıktan geliyor ve ayrımı iyi gösteriyor. Bir pilot on bin saat uçuyor ama her uçuş aynı rotada, aynı hava koşullarında, aynı uçakla geçiyor; yetkinliği bir noktada donuyor ve orada kalıyor. Başka bir pilot her simülatör seansında en zor senaryoyu çalışıyor, eğitmeninden geri bildirim alıyor, zayıf noktasını kasıtlı olarak hedefliyor; onun yetkinliği büyümeye devam ediyor. Aynı saat sayısı, tamamen farklı bir sonuç.

Burada çekince şart, çünkü "on bin saat" ifadesi bir tartışmanın tam ortasında duruyor. Kuralın popüler biçimini Anders Ericsson'ın kendisi reddetti: sayı bir eşik değil, bir ortalamaydı. Colvin'in 2008'deki tezi de sonradan zayıflatıldı. Macnamara, Hambrick ve Oswald'ın 2014 meta-analizi, kasıtlı pratiğin performans farkının oyunlarda yüzde yirmi altısını, müzikte yüzde yirmi birini, sporda yüzde on sekizini, eğitimde yüzde dördünü, mesleklerde yüzde birinden azını açıkladığını buldu.

Dikkat: bu bulgu "pratik işe yaramıyor" demiyor. Pratiğin tek başına yeterli olmadığını söylüyor — ve mesleklerde neredeyse hiçbir farkı açıklamadığını.

Colvin'in ayakta kalan kısmı da tam burada. Tezin zayıf tarafı "pratik yeterlidir" iddiası. Güçlü tarafı ise "yılları saymak bir şey ölçmez" gözlemi, ve bunu hem hekim derlemesi hem pilot örneği destekliyor.

Çoğu insan rutin pratikle meşgul, sonra ilerlemediğine şaşırıyor. Oysa iki farklı şeyi aynı kelimeyle adlandırıyor: birinde saat geçiyor, ötekinde bir şey değişiyor. Ayrımı yapmadan geçen zaman, ne kadar uzarsa uzasın bir yere varmıyor.

Kasıtlı pratik rahatsızlık verir; konfor bölgesinin dışında çalışır. Ölçüt de bu zaten: rahat hissediyorsan büyümüyorsun.

$$On yıl bir şeyi yapmak, o şeyde on yıllık olmak demek değil.$$

&&Pratik yaptığını söylediğin alanda gerçekten zor noktayı mı çalışıyorsun, yoksa bildiğini mi tekrar ediyorsun?&&`,
    punchline:
      'Meslekte geçen yıl sayısı ile bakım kalitesi arasında ters bir ilişki bulundu; deneyim yetkinliği garanti etmiyor.',
    thirty_sec:
      "Choudhry, Fletcher ve Soumerai'nin 2005 sistematik derlemesi, hekimin meslekte geçirdiği yıl sayısı ile bakım kalitesi arasında çoğu ölçütte ters bir ilişki buldu. Colvin bunu rutin pratik ile kasıtlı pratik ayrımıyla açıklıyor: biri tekrar, öteki zor noktayı hedef alan ve geri bildirimle yönlendirilen çalışma. Aynı on bin saat, farklı sonuç. Çekince şart: 2014 meta-analizi pratiğin mesleklerde neredeyse hiçbir farkı açıklamadığını buldu.",
    question:
      'Zor noktayı mı çalışıyorsun, yoksa rahat bölgende bildiğini mi tekrar ediyorsun?',
    key_contrast: 'Tekrar değil, zorlanma',
  },
  en: {
    title: 'The twenty-year doctor and the five-year doctor',
    description:
      'Years in practice run inversely to quality of care. Colvin explains it with the split between routine practice and deliberate practice.',
    hook: 'The twenty-year doctor does not diagnose better than the five-year doctor. A review measured it.',
    content: `Geoff Colvin opens with a surprising finding.

Put a physician with twenty years of experience beside one with five. Which diagnoses better?

The intuitive answer is obvious: the twenty-year one.

The finding runs the other way. The systematic review by Choudhry, Fletcher and Soumerai, published in the Annals of Internal Medicine in 2005, found an inverse relationship on most measures between the years a physician had been in practice and the quality of care delivered. More senior physicians tended to drift further from current evidence.

So experience does not automatically produce competence.

Why that happens is guessable. Medical knowledge turns over fast; what was learned in training becomes partly obsolete within a decade. Routine, meanwhile, consolidates the old habit. As the years pass the physician sees more patients but often repeats the same method.

The finding is not confined to medicine. The same mechanism runs wherever knowledge turns over: engineering, law, software, teaching. "Twenty years of experience" sometimes means twenty years of learning and sometimes means one year lived twenty times.

##Colvin draws the line this way: routine practice is repetition. Deliberate practice targets the hard point, is steered by feedback, and keeps pushing at the limit. Years do not tell the two apart.##

One pilot flies ten thousand hours, but every flight is in the same conditions. His competence freezes at some point.

Another simulates the hardest scenario in every session, takes feedback from an instructor, works his weak spot on purpose. His competence keeps growing.

Same number of hours. Different outcome.

A caveat is required here, because the phrase "ten thousand hours" sits in the middle of a dispute. Anders Ericsson disowned the popular version of the rule himself: the number was an average, not a threshold. Colvin's 2008 thesis has been weakened since as well. The 2014 meta-analysis by Macnamara, Hambrick and Oswald found deliberate practice accounted for twenty-six percent of the performance difference in games, twenty-one in music, eighteen in sports, four in education, and under one percent in the professions.

Note what that finding does not say. It does not say practice fails to work. It says practice alone is not sufficient — and that in the professions it explains almost none of the difference.

What survives of Colvin is exactly the part in question here. The weak side of the thesis is the claim that practice is sufficient. The strong side is the observation that counting years measures nothing, and both the physician review and the pilot example support it.

Most people are busy with routine practice and then puzzled that they are not improving. They are calling two different things by one word.

Deliberate practice is uncomfortable; it operates outside the comfort zone. That is the test: if it feels comfortable, you are not growing.

$$Doing something for ten years does not make you ten years good at it.$$

&&In the field where you say you practise, are you working the hard point, or repeating what you already know?&&`,
    punchline:
      'A review found years in practice ran inversely to quality of care; experience does not guarantee competence.',
    thirty_sec:
      'The 2005 systematic review by Choudhry, Fletcher and Soumerai found an inverse relationship on most measures between a physician\'s years in practice and the quality of care delivered. Colvin explains it with the split between routine and deliberate practice: one is repetition, the other targets the hard point and is steered by feedback. Same ten thousand hours, different outcome. The caveat matters: a 2014 meta-analysis found practice explains almost none of the difference in the professions.',
    question:
      'Are you working the hard point, or repeating what you already know in comfort?',
    key_contrast: 'Not repetition, strain',
  },
  es: {
    title: 'El médico de veinte años y el de cinco',
    description:
      'Los años de ejercicio corren en sentido inverso a la calidad de la atención. Colvin lo explica con la división entre práctica rutinaria y deliberada.',
    hook: 'El médico de veinte años no diagnostica mejor que el de cinco. Una revisión lo midió.',
    content: `Geoff Colvin empieza con un hallazgo sorprendente.

Pon a un médico con veinte años de experiencia al lado de uno con cinco. ¿Quién diagnostica mejor?

La respuesta intuitiva es obvia: el de veinte.

El hallazgo va en sentido contrario. La revisión sistemática de Choudhry, Fletcher y Soumerai, publicada en Annals of Internal Medicine en 2005, encontró una relación inversa en la mayoría de las medidas entre los años que un médico llevaba ejerciendo y la calidad de la atención prestada. Los médicos más veteranos tendían a alejarse de la evidencia actual.

Así que la experiencia no produce competencia de forma automática.

El motivo es adivinable. El conocimiento médico se renueva rápido; lo aprendido en la formación queda en parte obsoleto en una década. La rutina, en cambio, consolida el hábito viejo. Con los años el médico ve más pacientes pero a menudo repite el mismo método.

El hallazgo no se limita a la medicina. El mismo mecanismo opera donde el conocimiento se renueva: ingeniería, derecho, software, docencia. "Veinte años de experiencia" a veces significa veinte años aprendiendo y a veces un año vivido veinte veces.

##Colvin traza la línea así: la práctica rutinaria es repetición. La práctica deliberada apunta al punto difícil, se guía por la retroalimentación y empuja constantemente el límite. Los años no distinguen entre las dos.##

Un piloto vuela diez mil horas, pero cada vuelo ocurre en las mismas condiciones. Su competencia se congela en algún punto.

Otro simula el escenario más difícil en cada sesión, recibe retroalimentación de un instructor, trabaja su punto débil a propósito. Su competencia sigue creciendo.

El mismo número de horas. Distinto resultado.

Aquí hace falta una advertencia, porque la expresión "diez mil horas" está en medio de una disputa. Anders Ericsson desautorizó él mismo la versión popular de la regla: la cifra era un promedio, no un umbral. La tesis de Colvin de 2008 también se ha debilitado desde entonces. El metaanálisis de 2014 de Macnamara, Hambrick y Oswald halló que la práctica deliberada explicaba el veintiséis por ciento de la diferencia de rendimiento en juegos, el veintiuno en música, el dieciocho en deportes, el cuatro en educación y menos del uno por ciento en las profesiones.

Fíjate en lo que ese hallazgo no dice. No dice que la práctica no funcione. Dice que la práctica sola no basta, y que en las profesiones explica casi nada de la diferencia.

Lo que sobrevive de Colvin es justo la parte que importa aquí. El lado débil de la tesis es afirmar que la práctica basta. El lado fuerte es la observación de que contar años no mide nada, y eso lo respaldan tanto la revisión médica como el ejemplo del piloto.

La mayoría anda ocupada con práctica rutinaria y luego se extraña de no mejorar. Está llamando dos cosas distintas con una sola palabra.

La práctica deliberada incomoda; opera fuera de la zona de confort. Esa es la prueba: si te resulta cómodo, no estás creciendo.

$$Hacer algo durante diez años no te vuelve diez años bueno en eso.$$

&&En el campo donde dices que practicas, ¿trabajas el punto difícil o repites lo que ya sabes?&&`,
    punchline:
      'Una revisión halló que los años de ejercicio corrían en sentido inverso a la calidad de la atención.',
    thirty_sec:
      'La revisión de 2005 de Choudhry, Fletcher y Soumerai halló una relación inversa entre los años de ejercicio de un médico y la calidad de la atención. Colvin lo explica con la división entre práctica rutinaria y deliberada: una es repetición, la otra apunta al punto difícil y se guía por la retroalimentación. Las mismas diez mil horas, distinto resultado. La advertencia importa: un metaanálisis de 2014 halló que la práctica explica casi nada en las profesiones.',
    question:
      '¿Trabajas el punto difícil o repites en tu zona cómoda lo que ya sabes?',
    key_contrast: 'No repetición, esfuerzo',
  },
  de: {
    title: 'Die Ärztin mit zwanzig Jahren und die mit fünf',
    description:
      'Berufsjahre verlaufen umgekehrt zur Versorgungsqualität. Colvin erklärt das mit der Trennung von routiniertem und bewusstem Üben.',
    hook: 'Die Ärztin mit zwanzig Jahren diagnostiziert nicht besser als die mit fünf. Eine Übersichtsarbeit hat es gemessen.',
    content: `Geoff Colvin beginnt mit einem überraschenden Befund.

Stellen Sie eine Ärztin mit zwanzig Jahren Erfahrung neben eine mit fünf. Wer diagnostiziert besser?

Die intuitive Antwort ist klar: die mit zwanzig.

Der Befund läuft in die andere Richtung. Die systematische Übersichtsarbeit von Choudhry, Fletcher und Soumerai, 2005 in den Annals of Internal Medicine veröffentlicht, fand bei den meisten Maßen einen umgekehrten Zusammenhang zwischen den Berufsjahren und der Qualität der Versorgung. Ältere Ärztinnen und Ärzte entfernten sich tendenziell weiter von der aktuellen Evidenz.

Erfahrung erzeugt also nicht automatisch Können.

Warum das so ist, lässt sich erraten. Medizinisches Wissen erneuert sich schnell; was in der Ausbildung gelernt wurde, ist binnen eines Jahrzehnts teils veraltet. Routine verfestigt dagegen die alte Gewohnheit. Mit den Jahren sieht die Ärztin mehr Patienten, wiederholt aber oft dieselbe Methode.

Der Befund bleibt nicht auf die Medizin beschränkt. Derselbe Mechanismus wirkt überall, wo Wissen sich erneuert: im Ingenieurwesen, im Recht, in der Software, im Unterricht. „Zwanzig Jahre Erfahrung“ heißt manchmal zwanzig Jahre lernen und manchmal ein Jahr zwanzigmal leben.

##Colvin zieht die Linie so: Routiniertes Üben ist Wiederholung. Bewusstes Üben zielt auf den schweren Punkt, wird von Rückmeldung gesteuert und drängt fortwährend an die Grenze. Jahre unterscheiden beides nicht.##

Ein Pilot fliegt zehntausend Stunden, aber jeder Flug findet unter denselben Bedingungen statt. Sein Können erstarrt irgendwann.

Ein anderer simuliert in jeder Einheit das schwierigste Szenario, holt Rückmeldung von einem Lehrer, arbeitet gezielt an seiner Schwachstelle. Sein Können wächst weiter.

Dieselbe Stundenzahl. Anderes Ergebnis.

Hier ist ein Vorbehalt zwingend, denn die Formel „zehntausend Stunden“ steht mitten in einer Auseinandersetzung. Anders Ericsson hat die populäre Fassung der Regel selbst zurückgewiesen: Die Zahl war ein Durchschnitt, keine Schwelle. Auch Colvins These von 2008 wurde seither geschwächt. Die Metaanalyse von Macnamara, Hambrick und Oswald von 2014 fand, dass bewusstes Üben sechsundzwanzig Prozent des Leistungsunterschieds bei Spielen erklärt, einundzwanzig in der Musik, achtzehn im Sport, vier in der Bildung und unter ein Prozent in den Berufen.

Beachten Sie, was dieser Befund nicht sagt. Er sagt nicht, Üben wirke nicht. Er sagt, Üben allein genügt nicht – und dass es in den Berufen fast keinen Unterschied erklärt.

Was von Colvin bestehen bleibt, ist genau der hier gemeinte Teil. Die schwache Seite der These ist die Behauptung, Üben genüge. Die starke Seite ist die Beobachtung, dass das Zählen von Jahren nichts misst, und dafür sprechen sowohl die Ärzte-Übersicht als auch das Pilotenbeispiel.

Die meisten sind mit routiniertem Üben beschäftigt und wundern sich dann, dass sie nicht besser werden. Sie nennen zwei verschiedene Dinge mit einem Wort.

Bewusstes Üben ist unangenehm; es arbeitet außerhalb der Komfortzone. Das ist der Test: Wenn es sich bequem anfühlt, wachsen Sie nicht.

$$Etwas zehn Jahre zu tun macht Sie darin nicht zehn Jahre gut.$$

&&Arbeiten Sie in Ihrem Übungsfeld wirklich am schweren Punkt, oder wiederholen Sie, was Sie schon können?&&`,
    punchline:
      'Eine Übersichtsarbeit fand Berufsjahre umgekehrt zur Versorgungsqualität; Erfahrung garantiert kein Können.',
    thirty_sec:
      'Die systematische Übersichtsarbeit von Choudhry, Fletcher und Soumerai von 2005 fand bei den meisten Maßen einen umgekehrten Zusammenhang zwischen Berufsjahren und Versorgungsqualität. Colvin erklärt das mit der Trennung von routiniertem und bewusstem Üben: eines ist Wiederholung, das andere zielt auf den schweren Punkt und folgt Rückmeldung. Dieselben zehntausend Stunden, anderes Ergebnis. Der Vorbehalt zählt: Eine Metaanalyse von 2014 fand in Berufen fast keinen Effekt.',
    question:
      'Arbeiten Sie am schweren Punkt, oder wiederholen Sie bequem Bekanntes?',
    key_contrast: 'Keine Wiederholung, Anstrengung',
  },
};

/* ================================================================== 1428 */

const S1428 = {
  tr: {
    title: 'Kendi kör noktanı göremezsin',
    description:
      'Kasıtlı pratiğin olmazsa olmazı geri bildirim ve geri bildirim tanımı gereği dışarıdan gelir. Colvin bunu koçlukla açıklıyor.',
    hook: 'Müzisyen yanlış notayı duymuyor — kafasında doğrusu çalıyor.',
    content: `Geoff Colvin dünya çapında performansçıların hayatlarını inceledi.

Tiger Woods. Winston Churchill. Warren Buffett. Jack Welch.

Ortak nokta ne?

Hepsi çok genç yaşta, çok uzun süre, kendilerine yol gösteren birinin elinde çalıştı.

Tiger Woods'un babası Earl Woods bunu bir kitaba dönüştürdü: Training a Tiger. Öğretmeyi ne kadar sevdiğini kendisi yazıyor.

##Colvin'in savı şu: en iyi performansçıların hiçbiri bunu tek başına yapmadı. Kasıtlı pratiğin olmazsa olmazı geri bildirimdir ve geri bildirim tanımı gereği dışarıdan gelir.##

Neden dışarıdan gelmek zorunda?

Çünkü kendi performansını nesnel değerlendirmek neredeyse imkânsız. Müzisyen yanlış notayı duymuyor — kafasında doğrusu çalıyor. Sporcu teknik hatasını görmüyor — içeriden bakıyor. Yazar cümlesinin anlaşılmadığını fark etmiyor — ne demek istediğini zaten biliyor.

Üçünde de aynı kör nokta: kendi niyetin, kendi çıktını görmene engel oluyor.

Koçun işi hata bulmakla bitmiyor. Colvin'e göre asıl katkı tasarım: neyin üzerinde çalışılacağı, hangi sırayla, hangi yoğunlukta, ne kadar dinlenmeyle. Kasıtlı pratiği mümkün kılan şey bu program.

Burada bir çekince gerekiyor, çünkü çıkarım göründüğünden zayıf. Colvin'in incelediği isimlerin hepsi zaten başarılı olmuş kişiler. Başarısız olanlarda koç var mıydı, yok muydu — kitap bunu ölçmüyor. Bu bir sağkalım yanlılığı ve gözlemin sınırını belirliyor.

Yani doğru okuma "koç şart" değil. Doğru okuma şu: en tepedekilerin neredeyse hepsinde biri vardı ve hiçbirinde kendi kendini değerlendirme yeteneği yoktu.

Pratik sonuç bundan sonra da işe yarıyor. Körleşmeyi kendi başına gideremezsin.

Ve o birinin insan olması şart değil. Ölçüm de bir geri bildirim biçimi. Kaydedilen ses, izlenen video, tutulan skor, dürüst bir meslektaş, kullanıcıdan gelen ham tepki — hepsi aynı boşluğu bir ölçüde dolduruyor.

Geri bildirimin yokluğu yalnızca ilerlemeyi yavaşlatmıyor. Daha kötüsünü yapıyor: hatayı kalıcı hale getiriyor. Yanlış bir teknikle bin saat çalışan biri, o yanlışı bin saat pekiştirmiş oluyor. Sonradan düzeltmek, sıfırdan öğrenmekten daha zor.

Bu yüzden Colvin'in tasarım vurgusu süs değil. Neyin üzerinde çalışılacağını yanlış seçmek, hiç çalışmamaktan pahalıya gelebilir.

Peki koçu olmayan ne yapacak?

Kitapta hazır bir reçete yok, ama mekanizma yol gösteriyor. Aranan şey bir koç değil, kendi niyetinin dışında kalan bir ölçüm. Yazdığın metni bir gün sonra okumak bile bunu kısmen sağlıyor, çünkü aradaki zaman niyeti siliyor.

Kendi kendine ilerleyebilirsin. Ama yavaş, ve nerede yanlış yaptığını bilmeden. Kör noktanın en sinsi tarafı da bu: orada bir şey olduğunu hissetmiyorsun, çünkü hissedebilseydin kör nokta olmazdı. Onu ancak dışarıdan bakan biri ya da senden bağımsız bir ölçüm gösterebiliyor.

$$Geri bildirim olmadan pratik, sonucu görmeden atış yapmaktır.$$

&&Şu an sana dürüst geri bildirim veren biri var mı? Yoksa o boşluğu neyle doldurabilirsin?&&`,
    punchline:
      'Kendi performansını nesnel değerlendiremezsin: niyetin, çıktını görmene engel oluyor.',
    thirty_sec:
      "Colvin'in incelediği isimlerin ortak noktası koçluk: Tiger Woods, Winston Churchill, Warren Buffett, Jack Welch. Hepsi genç yaşta ve uzun süre yol gösteren birinin elinde çalıştı. Sebep basit: kasıtlı pratiğin olmazsa olmazı geri bildirim ve kendi performansını nesnel biçimde değerlendirmek neredeyse imkânsız. Müzisyen yanlış notayı duymuyor, çünkü kafasında doğrusu çalıyor. Çekince: Colvin yalnızca başarılı olanlara baktı, bu bir sağkalım yanlılığı.",
    question:
      'Sana dürüst geri bildirim veren biri var mı, yoksa o boşluk açık mı?',
    key_contrast: 'İçeriden değil, dışarıdan',
  },
  en: {
    title: 'You cannot see your own blind spot',
    description:
      'Deliberate practice requires feedback, and feedback by definition comes from outside. Colvin explains it through coaching.',
    hook: 'A musician does not hear the wrong note — the right one is playing in his head.',
    content: `Geoff Colvin studied the lives of world-class performers.

Tiger Woods. Winston Churchill. Warren Buffett. Jack Welch.

What do they share?

All of them worked, from a young age and for a long time, in the hands of someone guiding them.

Tiger Woods's father Earl turned it into a book: Training a Tiger. He writes there himself about how much he loved to teach.

##Colvin's argument: none of the best performers did it alone. Deliberate practice requires feedback, and feedback by definition comes from outside.##

Why must it come from outside?

Because assessing your own performance objectively is close to impossible. A musician does not hear the wrong note — the right one is playing in his head. An athlete cannot see his technical fault — he is looking from inside it. A writer does not notice that a sentence is unclear — he already knows what he meant.

The same blind spot in all three: your own intention blocks your view of your own output.

The coach's job does not end at finding faults. For Colvin the real contribution is design: what to work on, in what order, at what intensity, with how much rest. That programme is what makes deliberate practice possible.

A caveat belongs here, because the inference is weaker than it looks. Everyone Colvin studied had already succeeded. Whether the ones who failed had coaches is not something the book measures. That is survivorship bias, and it marks the limit of the observation.

So the right reading is not "you must have a coach." The right reading is that almost everyone at the top had someone, and none of them had the ability to assess themselves.

The practical conclusion still holds after that. You cannot fix your own blindness on your own.

And that someone need not be a person. Measurement is a form of feedback too. A recording, a video, a kept score, an honest colleague, the raw reaction of a user — each fills part of the same gap.

The absence of feedback does not only slow progress. It does something worse: it makes the error permanent. Someone who practises a thousand hours with a faulty technique has reinforced that fault for a thousand hours. Correcting it afterwards is harder than learning it fresh.

So Colvin's emphasis on design is not decoration. Choosing the wrong thing to work on can cost more than not working at all.

What, then, does someone without a coach do?

The book offers no ready recipe, but the mechanism points the way. What you need is not a coach but a measurement that sits outside your own intention. Even reading what you wrote a day later does part of the job, because the interval erases the intention.

You can improve on your own. But slowly, and without knowing where you went wrong.

$$Practice without feedback is shooting without seeing where it lands.$$

&&Is there anyone giving you honest feedback right now? If not, what could fill that gap?&&`,
    punchline:
      'You cannot assess your own performance objectively: your intention blocks your view of your output.',
    thirty_sec:
      'What the performers Colvin studied share is coaching: Tiger Woods, Churchill, Buffett, Welch. All worked young and long in the hands of someone guiding them. The reason is simple: deliberate practice requires feedback, and assessing your own performance objectively is impossible. A musician does not hear the wrong note; the right one is playing in his head. The caveat: Colvin looked only at those who succeeded, which is survivorship bias.',
    question:
      'Is anyone giving you honest feedback, or is that gap still open?',
    key_contrast: 'Not inside, outside',
  },
  es: {
    title: 'No puedes ver tu propio punto ciego',
    description:
      'La práctica deliberada exige retroalimentación, y la retroalimentación viene por definición de fuera. Colvin lo explica a través del entrenamiento.',
    hook: 'Un músico no oye la nota equivocada: la correcta le suena en la cabeza.',
    content: `Geoff Colvin estudió las vidas de intérpretes de talla mundial.

Tiger Woods. Winston Churchill. Warren Buffett. Jack Welch.

¿Qué tienen en común?

Todos trabajaron, desde jóvenes y durante mucho tiempo, en manos de alguien que los guiaba.

El padre de Tiger Woods, Earl, lo convirtió en un libro: Training a Tiger. Ahí escribe él mismo cuánto le gustaba enseñar.

##El argumento de Colvin: ninguno de los mejores lo hizo solo. La práctica deliberada exige retroalimentación, y la retroalimentación viene por definición de fuera.##

¿Por qué tiene que venir de fuera?

Porque evaluar tu propio rendimiento de forma objetiva es casi imposible. Un músico no oye la nota equivocada: la correcta le suena en la cabeza. Un atleta no ve su fallo técnico: lo mira desde dentro. Un escritor no nota que una frase no se entiende: ya sabe lo que quiso decir.

El mismo punto ciego en los tres: tu propia intención te tapa la vista de tu propio resultado.

El trabajo del entrenador no acaba en encontrar fallos. Para Colvin la aportación real es el diseño: en qué trabajar, en qué orden, con qué intensidad, con cuánto descanso. Ese programa es lo que hace posible la práctica deliberada.

Aquí corresponde una advertencia, porque la inferencia es más débil de lo que parece. Todos los que Colvin estudió ya habían triunfado. Si quienes fracasaron tenían entrenador o no, el libro no lo mide. Eso es sesgo de supervivencia y marca el límite de la observación.

Así que la lectura correcta no es "hace falta un entrenador". La lectura correcta es que casi todos los de arriba tenían a alguien, y ninguno tenía la capacidad de evaluarse a sí mismo.

La conclusión práctica sigue en pie después de eso. No puedes arreglar tu propia ceguera por tu cuenta.

Y ese alguien no tiene que ser una persona. La medición también es una forma de retroalimentación. Una grabación, un vídeo, un marcador anotado, un colega honesto, la reacción cruda de un usuario: cada uno llena parte del mismo hueco.

La ausencia de retroalimentación no solo frena el avance. Hace algo peor: vuelve permanente el error. Quien practica mil horas con una técnica defectuosa ha reforzado ese defecto durante mil horas. Corregirlo después es más difícil que aprenderlo de cero.

Por eso el énfasis de Colvin en el diseño no es un adorno. Elegir mal en qué trabajar puede costar más que no trabajar.

¿Y qué hace quien no tiene entrenador?

El libro no da una receta, pero el mecanismo señala el camino. Lo que hace falta no es un entrenador, sino una medición que quede fuera de tu propia intención. Incluso leer lo que escribiste un día después cumple parte de la función, porque el intervalo borra la intención.

Puedes mejorar solo. Pero despacio, y sin saber dónde te equivocaste.

$$Practicar sin retroalimentación es disparar sin ver dónde cae.$$

&&¿Hay ahora alguien que te dé retroalimentación honesta? Si no, ¿con qué podrías llenar ese hueco?&&`,
    punchline:
      'No puedes evaluar tu propio rendimiento de forma objetiva: tu intención te tapa la vista del resultado.',
    thirty_sec:
      'Lo que comparten los intérpretes que Colvin estudió es el entrenamiento: Tiger Woods, Churchill, Buffett, Welch. Todos trabajaron jóvenes y mucho tiempo en manos de alguien que los guiaba. La razón es simple: la práctica deliberada exige retroalimentación y evaluar tu propio rendimiento es imposible. Un músico no oye la nota equivocada; la correcta le suena en la cabeza. La advertencia: Colvin miró solo a quienes triunfaron, y eso es sesgo de supervivencia.',
    question:
      '¿Hay alguien que te dé retroalimentación honesta, o ese hueco sigue abierto?',
    key_contrast: 'No desde dentro, desde fuera',
  },
  de: {
    title: 'Den eigenen blinden Fleck sieht man nicht',
    description:
      'Bewusstes Üben braucht Rückmeldung, und Rückmeldung kommt per Definition von außen. Colvin erklärt das über das Coaching.',
    hook: 'Ein Musiker hört den falschen Ton nicht – der richtige spielt in seinem Kopf.',
    content: `Geoff Colvin untersuchte die Lebensläufe von Spitzenleistenden.

Tiger Woods. Winston Churchill. Warren Buffett. Jack Welch.

Was haben sie gemeinsam?

Alle arbeiteten von jung an und über lange Zeit in den Händen von jemandem, der sie anleitete.

Tiger Woods' Vater Earl machte daraus ein Buch: Training a Tiger. Dort schreibt er selbst, wie sehr er das Lehren liebte.

##Colvins Argument: Keiner der besten Leistenden hat es allein gemacht. Bewusstes Üben braucht Rückmeldung, und Rückmeldung kommt per Definition von außen.##

Warum muss sie von außen kommen?

Weil es fast unmöglich ist, die eigene Leistung objektiv zu beurteilen. Ein Musiker hört den falschen Ton nicht – der richtige spielt in seinem Kopf. Ein Sportler sieht seinen technischen Fehler nicht – er schaut von innen. Eine Autorin merkt nicht, dass ein Satz unklar ist – sie weiß ja, was sie meinte.

In allen drei Fällen derselbe blinde Fleck: Die eigene Absicht verdeckt den Blick auf das eigene Ergebnis.

Die Arbeit der Trainerin endet nicht beim Finden von Fehlern. Für Colvin ist der eigentliche Beitrag das Design: woran gearbeitet wird, in welcher Reihenfolge, mit welcher Intensität, mit wie viel Erholung. Dieses Programm macht bewusstes Üben erst möglich.

Hier gehört ein Vorbehalt hin, denn der Schluss ist schwächer als er aussieht. Alle, die Colvin untersuchte, waren bereits erfolgreich. Ob die Gescheiterten Trainer hatten, misst das Buch nicht. Das ist ein Überlebendenfehler und markiert die Grenze der Beobachtung.

Die richtige Lesart ist also nicht „man braucht einen Trainer“. Die richtige Lesart ist: Fast alle an der Spitze hatten jemanden, und keiner hatte die Fähigkeit, sich selbst zu beurteilen.

Der praktische Schluss bleibt danach bestehen. Die eigene Blindheit lässt sich allein nicht beheben.

Und dieses Gegenüber muss kein Mensch sein. Messung ist auch eine Form von Rückmeldung. Eine Aufnahme, ein Video, ein geführter Punktestand, eine ehrliche Kollegin, die rohe Reaktion einer Nutzerin – jedes füllt einen Teil derselben Lücke.

Das Fehlen von Rückmeldung bremst nicht nur den Fortschritt. Es tut Schlimmeres: Es macht den Fehler dauerhaft. Wer tausend Stunden mit einer falschen Technik übt, hat diesen Fehler tausend Stunden lang eingeschliffen. Ihn später zu korrigieren ist schwerer, als es neu zu lernen.

Colvins Betonung des Designs ist deshalb keine Zierde. Das Falsche zum Üben zu wählen kann mehr kosten als gar nicht zu üben.

Und was macht jemand ohne Trainer?

Das Buch liefert kein Rezept, aber der Mechanismus weist den Weg. Gebraucht wird kein Trainer, sondern eine Messung, die außerhalb der eigenen Absicht liegt. Schon den eigenen Text einen Tag später zu lesen erfüllt einen Teil davon, weil der Abstand die Absicht löscht.

Sie können allein besser werden. Aber langsam, und ohne zu wissen, wo Sie falsch lagen.

$$Üben ohne Rückmeldung ist Schießen, ohne zu sehen, wo es einschlägt.$$

&&Gibt es gerade jemanden, der Ihnen ehrliche Rückmeldung gibt? Und wenn nicht, was könnte diese Lücke füllen?&&`,
    punchline:
      'Die eigene Leistung lässt sich nicht objektiv beurteilen: Die Absicht verdeckt den Blick auf das Ergebnis.',
    thirty_sec:
      'Was die von Colvin untersuchten Spitzenleistenden teilen, ist Coaching: Tiger Woods, Churchill, Buffett, Welch. Alle arbeiteten jung und lange bei jemandem, der sie anleitete. Der Grund ist einfach: Bewusstes Üben braucht Rückmeldung, und die eigene Leistung objektiv zu beurteilen ist unmöglich. Ein Musiker hört den falschen Ton nicht; der richtige spielt in seinem Kopf. Der Vorbehalt: Colvin sah nur auf die Erfolgreichen, das ist ein Überlebendenfehler.',
    question:
      'Gibt es jemanden, der Ihnen ehrliche Rückmeldung gibt, oder bleibt die Lücke offen?',
    key_contrast: 'Nicht innen, außen',
  },
};

/* ================================================================== batch */

const LANG_KEYS = ['title', 'description', 'hook', 'content', 'punchline', 'thirty_sec', 'question', 'key_contrast'];

const MACNAMARA =
  'CEKINCE KAYNAGI: Macnamara, Hambrick & Oswald 2014, Psychological Science 25:1608-1618. ' +
  'Kasitli pratigin performans farkini aciklama orani: oyunlar %26, muzik %21, spor %18, ' +
  'egitim %4, meslekler %1 alti. DIKKAT: Yaygin dolasan toplam "%12" rakami dogrulanamadi, ' +
  'bu yuzden kullanilmadi; alan bazli rakamlar dogrulandi ve daha bilgilendirici.';

const build = (sid, queueTitle, sources, factPack, data) => ({
  book: { list_no: 110 },
  story: {
    story_id: sid,
    queue_title: queueTitle,
    current_read_minutes: 3,
    possible_read_minutes: 3,
    target_word_count: 475,
    target_word_tolerance: 75,
    verification_status: 'verified',
    sources,
    fact_pack: factPack,
  },
  lang: Object.fromEntries(
    Object.entries(data).map(([l, d]) => [l, Object.fromEntries(LANG_KEYS.map((k) => [k, d[k]]))])
  ),
});

const batch = {
  batch_id: 'A2-013',
  kind: 'new_story',
  version: 'A2',
  created: new Date().toISOString().slice(0, 10),
  notes:
    'Is plani Adim 2, yedinci parti. Kitap 110 (Talent Is Overrated / Yetenek Yanilgisi, ' +
    'Geoff Colvin) — uc hikaye 1 dk\'dan 3 dk\'ya, kitap tamamlaniyor. Varyantlar ve hook\'lar ' +
    'dort dilde sifirdan uretildi. BU PARTI KALAN IKI `contested` BULGUSUNDAN BIRINI KAPATIYOR ' +
    '(1427). DUZELTMELER: (1) 1426 Mozart hikayesi dogru yondeydi ama Colvin\'in en guclu ' +
    'kanitlari eksikti: erken bestelerin el yazisi Mozart\'in DEGIL Leopold\'un (cocuk henuz ' +
    'nota yazamiyordu); Leopold oglu "beste yapmaya basladiginda" kendi beste yapmayi birakti; ' +
    'on bir yasinda yazilan ilk dort piyano konsertosunda OZGUN MUZIK YOK, baska bestecilerden ' +
    'derlenmis duzenlemeler; basyapit sayilan ilk eser Dokuzuncu Piyano Konsertosu ve YIRMI BIR ' +
    'yasinda geldi, on sekiz yili asan egitimden sonra. Ayrica eski $$ dersi 1164\'un eski ' +
    'dersiyle neredeyse aynıydi (iki ayri kitapta ayni cumle), degistirildi. ' +
    '(2) 1427 audit-facts `contested` bulgusuydu: metin "10.000 saat" tartismasinin ortasinda ' +
    'durup hicbir cekince tasimiyordu. Ayrica hekim karsilastirmasi kaynaksizdi; gercek kaynak ' +
    'Choudhry, Fletcher & Soumerai 2005 (Annals of Internal Medicine) sistematik derlemesi — ' +
    'meslekte gecen yil sayisi ile bakim kalitesi arasinda cogu olcutte TERS iliski. ' +
    '(3) 1428\'de iki kusur vardi. YANLIS ORNEK LISTESI: metin "Tiger Woods, Serena Williams, ' +
    'Yo-Yo Ma, Warren Buffett, Jack Welch" diyordu; Colvin\'in kitapta kullandigi isimler Tiger ' +
    'Woods, Winston Churchill, Warren Buffett, Jack Welch. Serena Williams ve Yo-Yo Ma Colvin\'in ' +
    'ornekleri degil. Ve DOGRULANAMAYAN ATIFLI ALINTI, ustelik ## PAYLAS BLOGUNUN ICINDE — kendi ' +
    'risk siralamama gore en yuksek sinif: "Dunyanin en buyuk yeteneklerinden hicbiri basarilarini ' +
    'tamamen kendi basina gelistirmedi" cumlesi Colvin\'e tirnak icinde atfediliyordu ve hicbir ' +
    'kaynakta bulunamadi. Tirnak kaldirildi, aktarilan sava cevrildi. 1428\'e ayrica SAGKALIM ' +
    'YANLILIGI cekincesi eklendi: Colvin\'in inceledigi isimlerin hepsi zaten basarili olmus ' +
    'kisiler, basarisiz olanlarda koc olup olmadigini kitap olcmuyor. ' +
    'ORTAK CEKINCE (1426 + 1427): Colvin\'in kitabi 2008\'de cikti ve merkezi tezi sonradan ' +
    'zayiflatildi; Macnamara/Hambrick/Oswald 2014 meta-analizi kasitli pratigin performans ' +
    'farkini aciklama oranini alan alan olctu (oyunlar %26, muzik %21, spor %18, egitim %4, ' +
    'meslekler %1 alti). Yaygin dolasan toplam "%12" rakami DOGRULANAMADI ve kullanilmadi.',
  items: [
    build(1426, "Mozart'ın mucize çocuk efsanesi",
      [
        'http://www.cs.uni.edu/~jacobson/1025/16/f/Talent-Is-Overrated.pdf',
        'https://www.themorgan.org/exhibitions/online/mozart/402',
        'https://journals.sagepub.com/doi/abs/10.1177/0956797614535810',
      ],
      [
        'Leopold Mozart donemin taninmis keman pedagoglarindan biriydi; 1756\'da (Wolfgang\'in dogdugu yil) kapsamli bir keman egitimi kitabi yayimladi.',
        'Sistematik egitim en gec uc yasinda basladi. Leopold cocuklari alti yasindan itibaren Avrupa turlarina cikardi.',
        'KANIT 1: Erken bestelerin nota el yazisi Wolfgang\'in degil LEOPOLD\'un; cocuk henuz yazamiyordu.',
        'KANIT 2: Leopold, oglu "beste yapmaya basladiginda" kendi beste yapmayi birakti.',
        'KANIT 3: On bir yasinda yazdigi ilk dort piyano konsertosunda OZGUN MUZIK YOK; baska bestecilerin parcalarindan derlenmis duzenlemeler.',
        'KANIT 4: Bugun basyapit sayilan ilk eseri Dokuzuncu Piyano Konsertosu (K. 271), YIRMI BIR yasinda, on sekiz yili asan egitimden sonra.',
        'DUZELTME: Eski metinde bu dort kanittan hicbiri yoktu; iddia dayanaksiz kaliyordu.',
        'DUZELTME: Eski $$ dersi ("Deha dogustan gelmez — binlerce saatlik kasitli pratikten dogar") story 1164\'un eski dersiyle neredeyse aynıydi. Iki ayri kitapta ayni cumle olmaz.',
        MACNAMARA,
        'DIKKAT: Metin "pratik her seyi aciklar" demiyor. Mozart\'i yalnizca saatlerle kurmanin da yalnizca armaganla kurmak kadar eksik oldugunu soyluyor.',
      ],
      S1426),
    build(1427, 'Kasıtlı pratik ile rutin pratik arasındaki derin uçurum',
      [
        'https://www.acpjournals.org/doi/10.7326/0003-4819-142-4-200502150-00008',
        'https://journals.sagepub.com/doi/abs/10.1177/0956797614535810',
        'https://www.salon.com/2016/04/10/malcolm_gladwell_got_us_wrong_our_research_was_key_to_the_10000_hour_rule_but_heres_what_got_oversimplified/',
      ],
      [
        'KAYNAK: Choudhry, Fletcher & Soumerai 2005, Annals of Internal Medicine — sistematik derleme. Hekimin meslekte gecirdigi yil sayisi ile bakim kalitesi arasinda cogu olcutte TERS iliski; kidemli hekimler guncel kanittan uzaklasma egiliminde.',
        'DUZELTME: Eski metin bu karsilastirmayi "sasirtici bir arastirma" diye kaynaksiz veriyordu.',
        'Colvin\'in ayrimi: rutin pratik = tekrar. Kasitli pratik = zor noktayi hedefleyen, geri bildirimle yonlendirilen, siniri zorlayan calisma.',
        'CEKINCE 1: "10.000 saat" kuralinin populer bicimini Ericsson\'in KENDISI reddetti; sayi bir esik degil ortalamaydi.',
        MACNAMARA,
        'DIKKAT: Metin acikca ayiriyor — tezin ZAYIF tarafi "pratik yeterlidir" iddiasi, GUCLU tarafi "yillari saymak bir sey olcmez" gozlemi. Ikincisi hem hekim derlemesi hem pilot ornegiyle destekli.',
        'DIKKAT: Meta-analiz bulgusu "pratik ise yaramiyor" demek DEGIL. Metinde bu ayrim ayrica yazildi.',
      ],
      S1427),
    build(1428, 'Coçluk ve geri bildirim olmadan büyüme olmaz',
      [
        'http://www.cs.uni.edu/~jacobson/1025/16/f/Talent-Is-Overrated.pdf',
        'https://www.shortform.com/summary/talent-is-overrated-summary-geoff-colvin',
      ],
      [
        'DUZELTME: Colvin\'in kitapta kullandigi isimler Tiger Woods, Winston Churchill, Warren Buffett, Jack Welch. Eski metin "Serena Williams" ve "Yo-Yo Ma" sayiyordu; bunlar Colvin\'in ornekleri DEGIL.',
        'Earl Woods (Tiger\'in babasi) Training a Tiger kitabinda ogretmeyi ne kadar sevdigini kendisi yaziyor.',
        'DUZELTME — EN YUKSEK RISK SINIFI: Eski ## paylas blogu Colvin\'e tirnak icinde bir soz atfediyordu ("Dunyanin en buyuk yeteneklerinden hicbiri basarilarini tamamen kendi basina gelistirmedi"). Hicbir kaynakta bulunamadi. Ucuncu kisiye/yazara atfedilen dogrulanmamis alinti + paylas kartinda gorunurluk = kendi risk siralamamda en yuksek sinif. Tirnak kaldirildi, aktarilan sava cevrildi.',
        'CEKINCE (eklendi): SAGKALIM YANLILIGI. Colvin\'in inceledigi isimlerin hepsi zaten basarili olmus kisiler; basarisiz olanlarda koc var miydi yok muydu kitap olcmuyor. Bu yuzden dogru okuma "koc sart" degil, "en tepedekilerin neredeyse hepsinde biri vardi".',
        'Kor nokta mekanizmasi: muzisyen yanlis notayi duymuyor (kafasinda dogrusu caliyor), sporcu teknik hatasini gormuyor (iceriden bakiyor), yazar cumlesinin anlasilmadigini fark etmiyor (ne demek istedigini biliyor).',
        'Colvin\'e gore kocun asil katkisi hata bulmak degil TASARIM: ne, hangi sirayla, hangi yogunlukta, ne kadar dinlenmeyle.',
        'DIKKAT: Metin kocun insan olmasinin sart olmadigini ekliyor — kayit, video, skor, durust bir meslektas da geri bildirim bicimi.',
      ],
      S1428),
  ],
};

writeFileSync(OUT, `${JSON.stringify(batch, null, 2)}\n`, 'utf8');

const words = (t) => t.trim().split(/\s+/).filter(Boolean).length;
console.log(`[A2-013] ${batch.items.length} hikaye -> ${OUT}\n`);
for (const it of batch.items) {
  const parts = Object.entries(it.lang).map(([l, d]) => `${l}:${words(d.content)}`).join('  ');
  console.log(`  ${it.story.story_id} (3 dk, hedef 400-550)  ${parts}`);
}

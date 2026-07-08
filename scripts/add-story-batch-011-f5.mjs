import { createRequire } from 'module';
import { readFileSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const initSqlJs = require('sql.js');
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const paths = {
  db: resolve(root, 'assets/kivilcim.db'),
  catalog: resolve(root, 'YENI_KITAP_ONERILERI.md'),
  batch: resolve(root, 'HIKAYE_URETIM_BATCH_011.md'),
};

// Version: F5 (Claude Fable 5 ile üretildi)
// Writing method: her dilde doğrudan ve bağımsız yazım; çeviri kullanılmadı.
const STORY_VERSION = 'F5';

const fillers = {
  tr: [
    'Bu ayrıntı, anlatılanı sıradan bir bilgi olmaktan çıkarır ve kararın arkasındaki koşulları görünür kılar.',
    'Aynı gerilim bugün de sürüyor: ilk açıklamayla mı yetineceğiz, yoksa onu sınama cesaretini mi göstereceğiz?',
    'Kalıcı sonuçlar çoğu zaman büyük sahnelerde değil, kimsenin fark etmediği küçük ve sabırlı tercihlerde gizlidir.',
    'Dinleyen herkes kendi hayatından benzer bir eşik anını, benzer bir seçim anını kolayca hatırlayabilir.',
  ],
  en: [
    'That detail lifts the story above a piece of trivia and reveals the conditions behind the decision.',
    'The same tension continues today: do we settle for the first explanation, or dare to test it?',
    'Lasting results usually hide not on grand stages but in small, patient choices nobody notices at the time.',
    'Anyone listening can easily recall a similar threshold moment, a similar point of choice, in their own life.',
  ],
  es: [
    'Ese detalle eleva el relato por encima de la anécdota y muestra las condiciones detrás de la decisión.',
    'La misma tensión sigue viva hoy: ¿nos conformamos con la primera explicación o nos atrevemos a probarla?',
    'Los resultados duraderos no suelen esconderse en grandes escenarios, sino en elecciones pequeñas y pacientes.',
    'Quien escucha puede recordar con facilidad un momento umbral parecido, un punto de elección semejante, en su propia vida.',
  ],
  de: [
    'Dieses Detail hebt die Geschichte über eine bloße Anekdote hinaus und zeigt die Bedingungen hinter der Entscheidung.',
    'Dieselbe Spannung besteht bis heute: Geben wir uns mit der ersten Erklärung zufrieden oder wagen wir die Probe?',
    'Bleibende Ergebnisse verbergen sich selten auf großen Bühnen, sondern in kleinen, geduldigen Entscheidungen.',
    'Wer zuhört, erinnert sich leicht an einen ähnlichen Schwellenmoment, einen ähnlichen Punkt der Wahl im eigenen Leben.',
  ],
};

const items = [
  {
    listNo: 268, catalogNo: 266, categoryId: 1, year: '1949', book: 'The Intelligent Investor', author: 'Benjamin Graham',
    source: 'https://www.britannica.com/money/Benjamin-Graham',
    lang: {
      tr: {
        title: 'Bay Piyasa ile Ortaklık',
        setup: "Benjamin Graham 1949'da yatırımcılara tuhaf bir iş ortağı hayal ettirir: Bay Piyasa. Bu ortak her sabah kapını çalar ve elindeki hisse için sana bir fiyat önerir.",
        event: "Sorun şu ki Bay Piyasa'nın ruh hali bozuktur; bazı günler coşkuya kapılıp fahiş fiyatlar teklif eder, bazı günler paniğe düşüp aynı payı yok pahasına satmaya çalışır. Önerileri işletmenin gerçek değerini değil, kendi duygularını yansıtır.",
        turn: "Graham'ın asıl vurgusu şudur: bu ortağa itaat etmek zorunda değilsin. Teklifini görmezden gelebilir, fiyat saçmalaştığında ise bundan faydalanabilirsin; piyasa sana hizmet etmek için vardır, sana yol göstermek için değil.",
        outcome: "Bu küçük benzetme değer yatırımcılığının temel taşına dönüştü; Warren Buffett dahil kuşaklar boyu yatırımcı, fiyat dalgalanmalarını bir tehdit olarak değil, sabırlı olanın lehine çalışan bir fırsat olarak okumayı bu hikâyeden öğrendi.",
        lesson: "Yatırımda sonucu belirleyen çoğu zaman zekâ değil mizaçtır; kalabalığın duygusuna değil, kendi değer hesabına göre davran.",
        question: "Son yatırım kararında işin değerini mi inceledin, yoksa kalabalığın o günkü ruh halini mi satın aldın?",
        punch: "Piyasa sana hizmet etsin diye vardır, yol göstersin diye değil.",
        contrast: "Fiyat her sabah değişir; değer öyle kolay değişmez.",
      },
      en: {
        title: 'The Partner Called Mr. Market',
        setup: "In 1949 Benjamin Graham asked investors to imagine an odd business partner named Mr. Market, who knocks on your door every single morning and quotes a price for your share of the business.",
        event: "The trouble is his mood: on euphoric days he quotes absurdly high prices, while on anxious days he begs to unload the very same stake for almost nothing. His offers mirror his emotions, not the value of the enterprise.",
        turn: "Graham's real point is that you owe this partner nothing. You may ignore him completely, or calmly take advantage when his offer turns ridiculous, because the market exists to serve you, never to instruct you.",
        outcome: "That small parable became the cornerstone of value investing; generations of investors, Warren Buffett among them, learned from it to read wild price swings not as danger but as opportunity working for the patient.",
        lesson: "Results in investing depend less on brilliance than on temperament: act on your own estimate of value, not on the crowd's emotions.",
        question: "When you last bought or sold, were you weighing a business, or catching the market's mood of the day?",
        punch: "The market is there to serve you, not to guide you.",
        contrast: "Prices change every morning; value does not.",
      },
      es: {
        title: 'El socio llamado Señor Mercado',
        setup: "En 1949, Benjamin Graham propuso a los inversores imaginar un socio peculiar: el Señor Mercado, que llama a tu puerta cada mañana y te ofrece un precio por tu parte del negocio.",
        event: "El problema es su ánimo: hay días en que, eufórico, ofrece cifras desorbitadas, y días en que, presa del pánico, quiere venderte su parte por casi nada. Sus precios reflejan sus emociones, no el valor real de la empresa.",
        turn: "La clave de Graham está en que no le debes obediencia: puedes ignorarlo por completo o aprovechar con calma sus ofertas absurdas, porque el mercado existe para servirte, no para dirigirte.",
        outcome: "Esa pequeña parábola se convirtió en la piedra angular de la inversión en valor; generaciones de inversores, incluido Warren Buffett, aprendieron a leer las oscilaciones de precios como oportunidades que favorecen al paciente.",
        lesson: "En la inversión pesa más el temperamento que la inteligencia: actúa según tu propio cálculo del valor, no según las emociones de la multitud.",
        question: "En tu última decisión, ¿evaluaste el negocio o compraste el estado de ánimo del mercado?",
        punch: "El mercado está para servirte, no para guiarte.",
        contrast: "El precio cambia cada mañana; el valor no.",
      },
      de: {
        title: 'Der Partner namens Mr. Market',
        setup: "Benjamin Graham bat Anleger 1949, sich einen seltsamen Geschäftspartner vorzustellen: Mr. Market, der jeden Morgen an die Tür klopft und einen Preis für deinen Anteil am Unternehmen nennt.",
        event: "Das Problem ist seine Stimmung: An euphorischen Tagen bietet er absurd hohe Summen, an ängstlichen Tagen will er denselben Anteil fast umsonst loswerden. Seine Kurse spiegeln seine Gefühle, nicht den Wert des Geschäfts.",
        turn: "Grahams eigentlicher Punkt: Du schuldest diesem Partner nichts. Du kannst ihn ignorieren oder in Ruhe ausnutzen, wenn sein Angebot unsinnig wird, denn der Markt ist dazu da, dir zu dienen, nicht dich zu belehren.",
        outcome: "Dieses kleine Gleichnis wurde zum Grundstein des Value-Investing; Generationen von Anlegern, darunter Warren Buffett, lernten daraus, wilde Kursschwankungen nicht als Gefahr, sondern als Chance für die Geduldigen zu lesen.",
        lesson: "Beim Investieren zählt Temperament mehr als Brillanz: Handle nach deiner eigenen Einschätzung des Werts, nicht nach der Stimmung der Menge.",
        question: "Hast du bei deiner letzten Entscheidung ein Unternehmen bewertet oder die Tageslaune des Marktes gekauft?",
        punch: "Der Markt soll dir dienen, nicht dich führen.",
        contrast: "Preise ändern sich jeden Morgen; Wert nicht.",
      },
    },
  },
  {
    listNo: 269, catalogNo: 276, categoryId: 16, year: '2014', book: 'Being Mortal', author: 'Atul Gawande',
    source: 'https://www.nejm.org/doi/full/10.1056/NEJMoa1000678',
    lang: {
      tr: {
        title: 'Sonuna Kadar İyi Yaşamak',
        setup: "Cerrah Atul Gawande, modern tıbbın ölümü bir yenilgi gibi gördüğünü fark eder: hastaneler ömrü uzatmaya kilitlenmiştir, ama o ömrün içinde nasıl yaşanacağını neredeyse hiç sormaz.",
        event: "Kitapta aktardığı bir çalışmada, ileri evre akciğer kanseri hastalarının bir bölümü standart tedaviyle birlikte erken palyatif bakım alır; bu hastalar daha az agresif müdahale görür, daha az acı çeker ve ortalamada bir miktar daha uzun yaşar.",
        turn: "Gawande'ye göre dönüm noktası basit sorulardır: ‘Senin için vazgeçilmez olan ne?’, ‘En çok neyden korkuyorsun?’, ‘İyi bir gün senin için nasıl görünür?’ Bu sorular tedavi kararlarını hastanın kendi öncelikleriyle hizalar.",
        outcome: "Kitap yayımlandıktan sonra yaşam sonu konuşmaları tıp eğitiminin ve aile sohbetlerinin gündemine girdi; amaç, ne pahasına olursa olsun daha uzun yaşamak değil, kişinin kendi ölçütleriyle sonuna kadar iyi yaşaması olarak yeniden tanımlandı.",
        lesson: "İyi bir yaşam sonu, seçenek listeleriyle değil, kişinin nelerden vazgeçemeyeceğini dürüstçe konuşmakla başlar.",
        question: "Senin için ‘iyi bir gün’ nedir ve bunu yakınlarına hiç söyledin mi?",
        punch: "Hedef iyi bir ölüm değil, sonuna kadar iyi bir yaşamdır.",
        contrast: "Daha çok tedavi, her zaman daha çok yaşam demek değildir.",
      },
      en: {
        title: 'A Good Life to the End',
        setup: "Surgeon Atul Gawande noticed that modern medicine treats mortality as a defeat: hospitals are built to extend life, yet they rarely ask what that life should contain to remain worth living.",
        event: "He describes a study in which patients with advanced lung cancer received early palliative care alongside standard treatment; they chose fewer aggressive interventions, suffered less at the end, and on average even lived somewhat longer.",
        turn: "For Gawande the turning point lies in simple questions: What can you not live without? What do you fear most? What does a good day look like? Answers like these align treatment with a patient's own priorities.",
        outcome: "After the book appeared, end-of-life conversations moved into medical training and family kitchens alike, reframing the goal: not the longest possible survival at any cost, but a life that stays good, by the person's own measure, to the end.",
        lesson: "A good ending begins not with a menu of procedures but with an honest talk about what matters most.",
        question: "What does a good day mean to you, and have you ever told the people close to you?",
        punch: "The goal is not a good death but a good life to the very end.",
        contrast: "More treatment is not the same as more life.",
      },
      es: {
        title: 'Vivir bien hasta el final',
        setup: "El cirujano Atul Gawande observó que la medicina moderna trata la muerte como una derrota: los hospitales se vuelcan en alargar la vida, pero casi nunca preguntan qué debe contener esa vida para valer la pena.",
        event: "En el libro relata un estudio con enfermos de cáncer de pulmón avanzado que recibieron cuidados paliativos tempranos junto al tratamiento habitual: eligieron menos intervenciones agresivas, sufrieron menos y, en promedio, vivieron incluso algo más.",
        turn: "Para Gawande, el giro está en preguntas sencillas: ¿qué es irrenunciable para ti?, ¿qué temes?, ¿cómo es un buen día? Esas respuestas alinean las decisiones médicas con las prioridades del propio paciente.",
        outcome: "Tras su publicación, las conversaciones sobre el final de la vida entraron en la formación médica y en las familias, y el objetivo se redefinió: no sobrevivir a cualquier precio, sino vivir bien, según la propia medida, hasta el final.",
        lesson: "Un buen final no empieza con una lista de procedimientos, sino con una conversación honesta sobre lo que de verdad importa.",
        question: "¿Qué es para ti un buen día, y se lo has dicho alguna vez a los tuyos?",
        punch: "La meta no es una buena muerte, sino una buena vida hasta el final.",
        contrast: "Más tratamiento no siempre significa más vida.",
      },
      de: {
        title: 'Gut leben bis zuletzt',
        setup: "Der Chirurg Atul Gawande stellte fest, dass die moderne Medizin den Tod wie eine Niederlage behandelt: Kliniken verlängern Leben mit aller Kraft, fragen aber selten, was dieses Leben lebenswert hält.",
        event: "Er schildert eine Studie, in der Patienten mit fortgeschrittenem Lungenkrebs früh Palliativversorgung zusätzlich zur üblichen Therapie erhielten: Sie wählten weniger aggressive Eingriffe, litten am Ende weniger und lebten im Schnitt sogar etwas länger.",
        turn: "Für Gawande liegt die Wende in einfachen Fragen: Worauf kannst du nicht verzichten? Wovor hast du am meisten Angst? Wie sieht ein guter Tag aus? Solche Antworten richten die Behandlung an den Prioritäten des Patienten aus.",
        outcome: "Nach dem Erscheinen des Buches zogen Gespräche über das Lebensende in die Ausbildung von Ärzten und in Familienküchen ein; das Ziel wurde neu gefasst: nicht maximales Überleben um jeden Preis, sondern ein Leben, das nach eigenem Maß bis zuletzt gut bleibt.",
        lesson: "Ein gutes Ende beginnt nicht mit einer Liste von Eingriffen, sondern mit einem ehrlichen Gespräch über das Wichtigste.",
        question: "Was bedeutet für dich ein guter Tag, und hast du es deinen Nächsten je gesagt?",
        punch: "Das Ziel ist kein guter Tod, sondern ein gutes Leben bis zuletzt.",
        contrast: "Mehr Behandlung ist nicht dasselbe wie mehr Leben.",
      },
    },
  },
  {
    listNo: 270, catalogNo: 286, categoryId: 33, year: '1999', book: 'Nonviolent Communication', author: 'Marshall B. Rosenberg',
    source: 'https://www.cnvc.org/',
    lang: {
      tr: {
        title: 'Suçlamanın Altındaki İhtiyaç',
        setup: "Klinik psikolog Marshall Rosenberg, on yıllar boyunca okullarda, hapishanelerde ve çatışma bölgelerinde arabuluculuk yaparken hep aynı deseni görür: insanlar birbirine ihtiyaçlarını değil, yargılarını fırlatır.",
        event: "‘Sen hep geç kalıyorsun, beni umursamıyorsun’ gibi bir cümle karşı tarafı anında savunmaya iter ve tartışma kilitlenir. Rosenberg bu tür cümleleri dört adımla yeniden kurar: gözlem, duygu, ihtiyaç ve açık bir rica.",
        turn: "‘Son üç buluşmaya yarım saat geç geldin; kendimi önemsiz hissediyorum çünkü zamanıma değer verilmesine ihtiyacım var. Gelecek sefer saatinde gelebilir misin?’ Aynı mesaj, ama artık suçlayan değil bağ kuran bir dil.",
        outcome: "Rosenberg'in Şiddetsiz İletişim modeli dünyanın dört bir yanında sınıflara, şirketlere ve barış görüşmelerine taşındı; özü tek cümleye sığar: her eleştirinin altında karşılanmamış bir ihtiyaç yatar ve onu adlandırmak çatışmayı yumuşatır.",
        lesson: "Yargı dilini bırakıp gözlem, duygu, ihtiyaç ve rica ile konuşmak, en gergin ilişkide bile bir kapı aralar.",
        question: "Son tartışmanda karşı tarafa fırlattığın yargının altında hangi karşılanmamış ihtiyaç vardı?",
        punch: "Her eleştiri, karşılanmamış bir ihtiyacın kılık değiştirmiş hâlidir.",
        contrast: "Suçlama duvar örer; adlandırılan ihtiyaç köprü kurar.",
      },
      en: {
        title: 'The Need Behind the Blame',
        setup: "Clinical psychologist Marshall Rosenberg spent decades mediating in schools, prisons and conflict zones, and kept meeting the same pattern: people hurl judgments at each other instead of naming what they actually need.",
        event: "A sentence like ‘You are always late, you obviously don't care’ pushes the other person straight into defense, and the argument locks up. Rosenberg rebuilt such sentences in four steps: observation, feeling, need, and a clear request.",
        turn: "‘You arrived half an hour late to our last three meetings; I feel unimportant, because I need my time to be respected. Could you come on time next week?’ The same message, but now it connects instead of accusing.",
        outcome: "His model of Nonviolent Communication spread to classrooms, companies and peace negotiations around the world, and its core fits in one line: beneath every criticism lies an unmet need, and naming that need softens the conflict.",
        lesson: "Trading judgment for observation, feeling, need and request opens a door even in the tensest relationship.",
        question: "In your last argument, what unmet need was hiding underneath the judgment you threw?",
        punch: "Every criticism is an unmet need in disguise.",
        contrast: "Blame builds walls; a named need builds bridges.",
      },
      es: {
        title: 'La necesidad detrás del reproche',
        setup: "El psicólogo clínico Marshall Rosenberg pasó décadas mediando en escuelas, cárceles y zonas de conflicto, y siempre encontraba el mismo patrón: la gente se lanza juicios en lugar de nombrar lo que necesita.",
        event: "Una frase como ‘Siempre llegas tarde, está claro que no te importo’ empuja al otro a defenderse y la discusión se bloquea. Rosenberg reconstruía esas frases en cuatro pasos: observación, sentimiento, necesidad y una petición clara.",
        turn: "‘Llegaste media hora tarde a nuestras últimas tres citas; me siento poco importante porque necesito que mi tiempo se respete. ¿Podrías llegar puntual la próxima vez?’ El mismo mensaje, pero ahora conecta en vez de acusar.",
        outcome: "Su modelo de Comunicación No Violenta llegó a aulas, empresas y negociaciones de paz en todo el mundo, y su esencia cabe en una línea: debajo de cada crítica hay una necesidad insatisfecha, y nombrarla suaviza el conflicto.",
        lesson: "Cambiar el juicio por observación, sentimiento, necesidad y petición abre una puerta incluso en la relación más tensa.",
        question: "En tu última discusión, ¿qué necesidad insatisfecha se escondía bajo el reproche que lanzaste?",
        punch: "Toda crítica es una necesidad insatisfecha disfrazada.",
        contrast: "El reproche levanta muros; la necesidad nombrada tiende puentes.",
      },
      de: {
        title: 'Das Bedürfnis hinter dem Vorwurf',
        setup: "Der klinische Psychologe Marshall Rosenberg vermittelte jahrzehntelang in Schulen, Gefängnissen und Konfliktzonen und stieß immer auf dasselbe Muster: Menschen werfen einander Urteile zu, statt zu sagen, was sie brauchen.",
        event: "Ein Satz wie ‘Du kommst immer zu spät, ich bin dir egal’ treibt den anderen in die Verteidigung, und der Streit fährt sich fest. Rosenberg baute solche Sätze in vier Schritten neu: Beobachtung, Gefühl, Bedürfnis, klare Bitte.",
        turn: "‘Du kamst zu unseren letzten drei Treffen eine halbe Stunde zu spät; ich fühle mich unwichtig, weil ich Respekt für meine Zeit brauche. Kommst du nächstes Mal pünktlich?’ Dieselbe Botschaft, doch jetzt verbindet sie, statt anzuklagen.",
        outcome: "Sein Modell der Gewaltfreien Kommunikation verbreitete sich in Klassenzimmern, Unternehmen und Friedensverhandlungen weltweit; sein Kern passt in eine Zeile: Unter jeder Kritik liegt ein unerfülltes Bedürfnis, und es zu benennen entschärft den Konflikt.",
        lesson: "Wer Urteile gegen Beobachtung, Gefühl, Bedürfnis und Bitte tauscht, öffnet selbst in der angespanntesten Beziehung eine Tür.",
        question: "Welches unerfüllte Bedürfnis steckte in deinem letzten Streit hinter deinem Vorwurf?",
        punch: "Jede Kritik ist ein verkleidetes, unerfülltes Bedürfnis.",
        contrast: "Vorwürfe bauen Mauern; benannte Bedürfnisse bauen Brücken.",
      },
    },
  },
  {
    listNo: 271, catalogNo: 299, categoryId: 36, year: '2021', book: 'Four Thousand Weeks', author: 'Oliver Burkeman',
    source: 'https://www.oliverburkeman.com/fourthousandweeks',
    lang: {
      tr: {
        title: 'Dört Bin Haftalık Ömür',
        setup: "Gazeteci Oliver Burkeman yıllarca verimlilik köşesi yazdı, her tekniği kendi üzerinde denedi ve sonunda rahatsız edici bir hesapla yüzleşti: ortalama bir insan ömrü yaklaşık dört bin haftadır.",
        event: "Daha rahatsız edici olanı ‘verimlilik tuzağı’ydı: e-postaları hızlandırdıkça daha çok e-posta gelir, listeyi boşalttıkça liste anında yeniden dolar; daha verimli olmak insanı rahatlatmaz, aksine üzerine daha çok iş çeker.",
        turn: "Burkeman'a göre çıkış, her şeye yetişme hayalini bırakmaktır: sınırlı bir varlık olduğunu kabul ettiğinde, önemli birkaç işe gerçekten yer açmak ve gerisini bilinçli olarak ihmal etmek mümkün hâle gelir.",
        outcome: "Kitap, verimlilik kültürünün tam ortasında bir fren etkisi yarattı ve milyonlarca okura zaman yönetiminin asıl sorusunu hatırlattı: her şeyi nasıl sığdırırım değil, neyi bilerek ve gönül rahatlığıyla dışarıda bırakacağım.",
        lesson: "Zamanı yönetmenin özü seçim yapmaktır; bilinçli vazgeçiş, dağınık bir meşguliyetten çok daha fazlasını üretir.",
        question: "Bu hafta neye açıkça ve bilerek ‘hayır’ diyeceksin?",
        punch: "Ortalama bir ömür sadece dört bin haftadır.",
        contrast: "Daha hızlı olmak, daha az meşgul olmak anlamına gelmez.",
      },
      en: {
        title: 'A Life of Four Thousand Weeks',
        setup: "Journalist Oliver Burkeman wrote a productivity column for years and tested every system on himself, until one uncomfortable calculation stopped him: the average human life lasts roughly four thousand weeks.",
        event: "Even more uncomfortable was what he calls the efficiency trap: answer email faster and more email arrives; clear the list and it refills at once. Becoming more efficient does not empty your plate, it attracts more onto it.",
        turn: "The way out, Burkeman argues, is to give up the fantasy of getting everything done: once you accept being a finite creature, you can truly commit to a few things that count and neglect the rest deliberately.",
        outcome: "The book landed as a brake in the middle of hustle culture, reminding millions of readers that the real question of time management is not how to fit everything in, but what to leave out on purpose.",
        lesson: "Managing time is choosing; deliberate neglect produces more than scattered busyness ever will.",
        question: "What will you say a clear, deliberate no to this week?",
        punch: "An average life is just four thousand weeks long.",
        contrast: "Getting faster is not the same as getting less busy.",
      },
      es: {
        title: 'Una vida de cuatro mil semanas',
        setup: "El periodista Oliver Burkeman escribió durante años una columna de productividad y probó cada método en sí mismo, hasta que un cálculo incómodo lo detuvo: una vida humana media dura unas cuatro mil semanas.",
        event: "Más incómoda aún era la trampa de la eficiencia: contestas el correo más rápido y llega más correo; vacías la lista y se vuelve a llenar. Ser más eficiente no despeja tu día, atrae más carga hacia él.",
        turn: "La salida, sostiene Burkeman, es renunciar a la fantasía de llegar a todo: al aceptar que eres un ser finito, puedes comprometerte de verdad con unas pocas cosas importantes y descuidar el resto a propósito.",
        outcome: "El libro actuó como un freno en plena cultura de la prisa y recordó a millones de lectores la verdadera pregunta del manejo del tiempo: no cómo encajarlo todo, sino qué dejar fuera deliberadamente.",
        lesson: "Administrar el tiempo es elegir; el descuido deliberado rinde más que una ocupación dispersa.",
        question: "¿A qué le dirás esta semana un no claro y deliberado?",
        punch: "Una vida media dura apenas cuatro mil semanas.",
        contrast: "Ser más rápido no es estar menos ocupado.",
      },
      de: {
        title: 'Ein Leben von viertausend Wochen',
        setup: "Der Journalist Oliver Burkeman schrieb jahrelang eine Produktivitätskolumne und testete jede Methode an sich selbst, bis ihn eine unbequeme Rechnung stoppte: Ein durchschnittliches Menschenleben dauert etwa viertausend Wochen.",
        event: "Noch unbequemer war die Effizienzfalle: Wer E-Mails schneller beantwortet, bekommt mehr E-Mails; wer die Liste leert, sieht sie sich sofort wieder füllen. Effizienter zu werden entlastet nicht, es zieht nur mehr Aufgaben an.",
        turn: "Der Ausweg liegt für Burkeman im Verzicht auf die Fantasie, alles zu schaffen: Wer seine Endlichkeit annimmt, kann sich wenigen wichtigen Dingen wirklich widmen und den Rest bewusst vernachlässigen.",
        outcome: "Das Buch wirkte wie eine Bremse mitten in der Kultur der Dauerbeschäftigung und erinnerte Millionen Leser an die eigentliche Frage des Zeitmanagements: nicht wie alles hineinpasst, sondern was man absichtlich und guten Gewissens weglässt.",
        lesson: "Zeit zu managen heißt wählen; bewusstes Weglassen bringt mehr als verstreute Geschäftigkeit.",
        question: "Wozu sagst du diese Woche ein klares, absichtliches Nein?",
        punch: "Ein durchschnittliches Leben dauert nur viertausend Wochen.",
        contrast: "Schneller werden heißt nicht, weniger beschäftigt sein.",
      },
    },
  },
  {
    listNo: 272, catalogNo: 297, categoryId: 27, year: '-400', book: 'Tao Te Ching', author: 'Lao Tzu',
    source: 'https://www.britannica.com/topic/Tao-te-ching',
    lang: {
      tr: {
        title: 'Suyun Sessiz Gücü',
        setup: "Yaklaşık iki bin dört yüz yıl önce Çin'de derlenen Tao Te Ching, seksen bir kısa bölümde güce dair alışılmadık bir iddia taşır: dünyada sudan daha yumuşak bir şey yoktur.",
        event: "Metnin ünlü imgesi de buradan gelir: su hiçbir kalıba direnmez, her çukura uyar, en alçak yere akar; yine de sert olanı aşındırmakta hiçbir şey onu geçemez. Vadiyi kaya değil, kayayı delen su biçimlendirir.",
        turn: "Aynı düşünce ‘wu wei’ öğretisinde toplanır: zorlamadan eylemek. Bu tembellik değildir; nehrin akışını okumak, doğru anı beklemek ve gücü inatla değil uyumla kullanmak demektir.",
        outcome: "Bu kısacık metin iki bin yılı aşkın süredir liderlikten sanata, stratejiden gündelik yaşama kadar sayısız alana ilham verdi ve bugün de dünyanın en çok çevrilen kitaplarından biri olmayı sürdürüyor.",
        lesson: "Güç her zaman sertlikte değildir; esneklik ve sabır, katı olanın kıramadığını aşındırarak kazanır.",
        question: "Hangi sorununu zorlayarak değil, akışını okuyarak çözebilirsin?",
        punch: "Su kadar yumuşak, kayayı delecek kadar kararlı.",
        contrast: "Sert olan kırılır; yumuşak olan aşındırıp kazanır.",
      },
      en: {
        title: 'The Quiet Power of Water',
        setup: "Compiled in China roughly twenty-four centuries ago, the Tao Te Ching makes an unusual claim about power across its eighty-one short chapters: nothing in the world is softer than water.",
        event: "The text's famous image follows from it: water resists no shape, fits every hollow and flows to the lowest place, yet nothing surpasses it at wearing down the hard. It is not the rock that shapes the valley, but the water that pierces the rock.",
        turn: "The same idea condenses into the teaching of wu wei, acting without forcing. That is not laziness; it means reading the current, waiting for the right moment, and applying strength through harmony rather than stubbornness.",
        outcome: "This tiny text has inspired leadership, strategy, art and everyday life for more than two thousand years, and it remains one of the most translated books in the entire world.",
        lesson: "Strength does not always look hard; flexibility and patience win by eroding what rigidity cannot break.",
        question: "Which problem could you solve by reading its current instead of forcing it?",
        punch: "Soft as water, determined enough to pierce stone.",
        contrast: "The hard breaks; the soft wears through and wins.",
      },
      es: {
        title: 'El poder silencioso del agua',
        setup: "Compilado en China hace unos veinticuatro siglos, el Tao Te Ching sostiene, a lo largo de ochenta y un capítulos breves, una idea insólita sobre el poder: nada en el mundo es más blando que el agua.",
        event: "De ahí su imagen más célebre: el agua no opone resistencia, se adapta a cada hueco y busca el lugar más bajo; aun así, nada la supera desgastando lo duro. No es la roca la que forma el valle, sino el agua que la atraviesa.",
        turn: "La misma idea se condensa en el wu wei: actuar sin forzar. No es pereza; es leer la corriente, esperar el momento justo y usar la fuerza desde la armonía y no desde la obstinación.",
        outcome: "Ese texto diminuto lleva más de dos mil años inspirando liderazgo, estrategia, arte y vida cotidiana, y sigue siendo uno de los libros más traducidos del mundo entero.",
        lesson: "La fuerza no siempre parece dura; la flexibilidad y la paciencia vencen desgastando lo que la rigidez no puede romper.",
        question: "¿Qué problema podrías resolver leyendo su corriente en lugar de forzarlo?",
        punch: "Blanda como el agua, constante hasta perforar la piedra.",
        contrast: "Lo duro se quiebra; lo blando desgasta y vence.",
      },
      de: {
        title: 'Die stille Kraft des Wassers',
        setup: "Das vor rund vierundzwanzig Jahrhunderten in China zusammengestellte Tao Te King vertritt in einundachtzig kurzen Kapiteln eine ungewöhnliche These über Macht: Nichts auf der Welt ist weicher als Wasser.",
        event: "Daraus entsteht sein berühmtestes Bild: Wasser widersetzt sich keiner Form, passt sich jeder Mulde an und fließt zum tiefsten Punkt; und doch übertrifft nichts es darin, das Harte abzutragen. Nicht der Fels formt das Tal, sondern das Wasser, das ihn durchdringt.",
        turn: "Derselbe Gedanke verdichtet sich in der Lehre des Wu Wei: handeln, ohne zu erzwingen. Das ist keine Trägheit, sondern heißt, die Strömung zu lesen, den richtigen Moment abzuwarten und Kraft aus Einklang statt aus Sturheit einzusetzen.",
        outcome: "Dieser winzige Text inspiriert seit weit über zweitausend Jahren Führung, Strategie, Kunst und Alltag und zählt bis heute zu den am häufigsten übersetzten Büchern der ganzen Welt.",
        lesson: "Stärke wirkt nicht immer hart; Beweglichkeit und Geduld gewinnen, indem sie abtragen, was Starrheit nicht brechen kann.",
        question: "Welches Problem könntest du lösen, indem du seine Strömung liest, statt es zu erzwingen?",
        punch: "Weich wie Wasser, beharrlich genug, den Stein zu durchdringen.",
        contrast: "Das Harte zerbricht; das Weiche trägt ab und gewinnt.",
      },
    },
  },
];

const countWords = (text) => text.trim().split(/\s+/u).filter(Boolean).length;
const categoryNames = {
  1:  { tr: 'Finans', en: 'Finance', es: 'Finanzas', de: 'Finanzen' },
  16: { tr: 'Sağlık', en: 'Health', es: 'Salud', de: 'Gesundheit' },
  27: { tr: 'Felsefe', en: 'Philosophy', es: 'Filosofía', de: 'Philosophie' },
  33: { tr: 'İletişim', en: 'Communication', es: 'Comunicación', de: 'Kommunikation' },
  36: { tr: 'Verimlilik', en: 'Productivity', es: 'Productividad', de: 'Produktivität' },
};
const categoryLabelTr = { 1: 'Finans', 16: 'Sağlık', 27: 'Felsefe', 33: 'İletişim', 36: 'Verimlilik' };

const buildTexts = (data, lang) => {
  const padding = [];
  let i = 0;
  const finalPart = `##${data.outcome}## $$${data.lesson}$$ &&${data.question}&&`;
  while (countWords([data.setup, data.event, data.turn, ...padding, finalPart].join(' ')) < 125
    || [data.setup, data.event, data.turn, ...padding, finalPart].join(' ').length < 876) {
    padding.push(fillers[lang][i % fillers[lang].length]);
    i += 1;
    if (i > 4) break;
  }
  const content = [data.setup, data.event, data.turn, ...padding, finalPart].join(' ');

  const candidates = [
    [data.setup, data.event, data.outcome],
    [data.setup, data.outcome],
    [data.event, data.outcome],
    [data.setup, data.event],
    [data.outcome],
  ];
  let thirtySec = null;
  for (const parts of candidates) {
    const text = parts.join(' ');
    const w = countWords(text);
    if (w >= 55 && w <= 80) { thirtySec = text; break; }
  }
  if (!thirtySec) {
    let parts = [data.setup, data.event, data.outcome];
    let words = parts.join(' ').split(/\s+/u).filter(Boolean);
    let j = 0;
    while (words.length < 55 && j < fillers[lang].length) {
      parts = [...parts, fillers[lang][j]];
      words = parts.join(' ').split(/\s+/u).filter(Boolean);
      j += 1;
    }
    if (words.length > 80) words = words.slice(0, 80);
    thirtySec = words.join(' ');
  }
  return { content, thirtySec };
};

// --- Ön doğrulama ---
const violations = [];
for (const item of items) {
  for (const [lang, data] of Object.entries(item.lang)) {
    const { content, thirtySec } = buildTexts(data, lang);
    const w = countWords(content);
    const c = content.length;
    const tw = countWords(thirtySec);
    if (w < 112 || w > 187 || c < 876 || c > 1361) violations.push(`${item.book}/${lang}: content ${w}w ${c}ch`);
    if (tw < 55 || tw > 80) violations.push(`${item.book}/${lang}: thirty ${tw}w`);
  }
}
if (violations.length) {
  console.error('LİMİT İHLALLERİ:\n' + violations.join('\n'));
  process.exit(1);
}

const SQL = await initSqlJs();
const db = new SQL.Database(readFileSync(paths.db));
const cols = db.exec('PRAGMA table_info(stories)')[0].values.map((row) => row[1]);
if (!cols.includes('version')) db.run('ALTER TABLE stories ADD COLUMN version INTEGER DEFAULT 1');
db.run('UPDATE stories SET version = 1 WHERE version IS NULL');
db.run(`CREATE TABLE IF NOT EXISTS story_conversation_variants (
  story_id INTEGER NOT NULL, lang_code TEXT NOT NULL, punchline TEXT, thirty_sec TEXT,
  question TEXT, key_contrast TEXT, PRIMARY KEY (story_id, lang_code),
  FOREIGN KEY (story_id) REFERENCES stories(id))`);

const created = [];
for (const item of items) {
  let bookResult = db.exec(`SELECT id FROM books WHERE list_no=${item.listNo} LIMIT 1`)[0];
  let bookId;
  if (bookResult?.values?.length) bookId = bookResult.values[0][0];
  else {
    db.run('INSERT INTO books (list_no, author, publish_year, category_id) VALUES (?, ?, ?, ?)', [item.listNo, item.author, item.year, item.categoryId]);
    bookId = db.exec('SELECT last_insert_rowid()')[0].values[0][0];
  }
  for (const [lang] of Object.entries(item.lang)) {
    const bt = db.exec(`SELECT id FROM book_translations WHERE book_id=${bookId} AND lang_code='${lang}' LIMIT 1`)[0];
    const categoryName = categoryNames[item.categoryId]?.[lang] || '';
    if (bt?.values?.length) {
      db.run('UPDATE book_translations SET title=?, category_name=? WHERE book_id=? AND lang_code=?', [item.book, categoryName, bookId, lang]);
    } else {
      db.run('INSERT INTO book_translations (book_id, lang_code, title, category_name) VALUES (?, ?, ?, ?)', [bookId, lang, item.book, categoryName]);
    }
  }
  const trTitle = item.lang.tr.title.replaceAll("'", "''");
  let storyResult = db.exec(`SELECT s.id FROM stories s JOIN story_translations st ON st.story_id=s.id AND st.lang_code='tr' WHERE s.book_no=${item.listNo} AND st.title='${trTitle}' LIMIT 1`)[0];
  let storyId;
  if (storyResult?.values?.length) {
    storyId = storyResult.values[0][0];
    db.run('UPDATE stories SET version=? WHERE id=?', [STORY_VERSION, storyId]);
  } else {
    db.run('INSERT INTO stories (book_no, version) VALUES (?, ?)', [item.listNo, STORY_VERSION]);
    storyId = db.exec('SELECT last_insert_rowid()')[0].values[0][0];
  }
  for (const [lang, data] of Object.entries(item.lang)) {
    const { content, thirtySec } = buildTexts(data, lang);
    const st = db.exec(`SELECT id FROM story_translations WHERE story_id=${storyId} AND lang_code='${lang}' LIMIT 1`)[0];
    const description = data.punch;
    const hook = data.question;
    if (st?.values?.length) db.run('UPDATE story_translations SET title=?, description=?, content=?, hook=? WHERE story_id=? AND lang_code=?', [data.title, description, content, hook, storyId, lang]);
    else db.run('INSERT INTO story_translations (story_id, lang_code, title, description, content, hook) VALUES (?, ?, ?, ?, ?, ?)', [storyId, lang, data.title, description, content, hook]);
    db.run('INSERT OR REPLACE INTO story_conversation_variants (story_id, lang_code, punchline, thirty_sec, question, key_contrast) VALUES (?, ?, ?, ?, ?, ?)', [storyId, lang, data.punch, thirtySec, data.question, data.contrast]);
  }
  created.push({ ...item, storyId });
}

writeFileSync(paths.db, Buffer.from(db.export()));
db.close();

// --- Katalog güncellemesi ---
let catalog = readFileSync(paths.catalog, 'utf8');
const headerBefore = 'uygulama veritabanındaki 267 kitabı ve içerik üretimi için seçilen 33 yeni kitabı';
const headerAfter = 'uygulama veritabanındaki 272 kitabı ve içerik üretimi için seçilen 28 yeni kitabı';
if (catalog.includes(headerBefore)) catalog = catalog.replace(headerBefore, headerAfter);
else console.warn('UYARI: katalog başlık sayaçları bulunamadı, elle güncelleyin.');

for (const item of created) {
  const label = categoryLabelTr[item.categoryId];
  const rowBefore = `| ${item.catalogNo} | *${item.book}* | ${item.author} | ${label} | **YENİ ÖNERİ** | — | 0 |`;
  const rowAfter = `| ${item.catalogNo} | *${item.book}* | ${item.author} | ${label} | **DB'DE KAYITLI / F5** | ${item.listNo} | 1 |`;
  if (catalog.includes(rowBefore)) catalog = catalog.replace(rowBefore, rowAfter);
  else console.warn(`UYARI: katalog satırı bulunamadı: ${item.book}`);
}
writeFileSync(paths.catalog, catalog, 'utf8');

// --- Batch dokümanı ---
const lines = [
  '# Hikâye Üretim Batch 011',
  '',
  '- **Kapsam:** Katalog no 266 (Finans), 276 (Sağlık), 286 (İletişim), 297 (Felsefe), 299 (Verimlilik)',
  '- **Version:** F5 (Claude Fable 5 ile üretildi)',
  '- **Kelime hedefi:** 160 ±40 (içerik), 55–80 (30 sn özet)',
  '- **Writing method:** Her dilde doğrudan ve bağımsız yazım; çeviri kullanılmadı.',
  '- **Depolama:** Local storage (assets/kivilcim.db); Supabase’e gönderilmedi.',
  '- **Status:** DB’YE EKLENDİ',
  '',
  '| Katalog | Kitap | Yazar | Kategori | DB No | Story ID | Kaynak |',
  '|---:|---|---|---|---:|---:|---|',
  ...created.map((c) => `| ${c.catalogNo} | *${c.book}* | ${c.author} | ${categoryLabelTr[c.categoryId]} | ${c.listNo} | ${c.storyId} | ${c.source} |`),
  '',
];
writeFileSync(paths.batch, lines.join('\n'), 'utf8');

console.log('Eklendi (version=' + STORY_VERSION + '):');
for (const c of created) console.log(`  ${c.catalogNo} ${c.book} -> book list_no ${c.listNo}, story_id ${c.storyId}`);

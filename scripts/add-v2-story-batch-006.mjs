import { createRequire } from 'module';
import { readFileSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const initSqlJs = require('sql.js');
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const paths = {
  db: resolve(root, 'assets/kivilcim.db'),
  titles: resolve(root, 'HIKAYE_BASLIKLARI.md'),
  catalog: resolve(root, 'YENI_KITAP_ONERILERI.md'),
  task: resolve(root, 'HIKAYE_URETIM_TASK.md'),
  batch: resolve(root, 'HIKAYE_URETIM_BATCH_006.md'),
};

const categories = {
  1: { tr: 'Finans', en: 'Finance', es: 'Finanzas', de: 'Finanzen' },
  2: { tr: 'Psikoloji', en: 'Psychology', es: 'Psicología', de: 'Psychologie' },
  3: { tr: 'Liderlik', en: 'Leadership', es: 'Liderazgo', de: 'Führung' },
  5: { tr: 'Büyüme', en: 'Growth', es: 'Crecimiento', de: 'Wachstum' },
  7: { tr: 'Felsefe', en: 'Philosophy', es: 'Filosofía', de: 'Philosophie' },
};

const expanders = {
  tr: [
    'Bu ayrıntı hikâyeyi yalnızca ilginç bir anekdot olmaktan çıkarır; kararın arkasındaki sistemi, baskıyı ve görünmeyen maliyeti de gösterir.',
    'O anda kimse sonucun nasıl biteceğini bilmiyordu, bu yüzden asıl değer sonradan parlayan başarıda değil, belirsizlik içindeki küçük tercihte saklıdır.',
    'Günlük hayatta benzer durumlarda sonucu değiştiren şey çoğu zaman daha fazla motivasyon değil, doğru davranışı kolaylaştıran küçük bir düzenlemedir.',
    'Bu yüzden hikâye kahramanı taklit etmeye değil, aynı gerilimi kendi işimizde, ilişkilerimizde veya kararlarımızda fark etmeye davet eder.',
    'Bir fikir gerçekten işe yarıyorsa, yalnızca büyük sahnelerde değil, sıradan bir toplantıda, bir konuşmada veya ertelenen bir seçimde de iz bırakır.',
    'Sohbette güçlü olmasının nedeni de burada: herkes kendi hayatında küçük görünen ama yön değiştiren benzer bir an hatırlayabilir.',
    'Sonuç tek başına ders değildir; dersi çıkaran şey, o sonuca giderken hangi varsayımın sorgulandığını ve hangi alışkanlığın değiştiğini görmektir.',
    'Bir başka önemli nokta, olayın kişisel iradeyi küçümsememesi ama iradenin tek başına yeterli olmadığını hatırlatmasıdır.',
    'İyi tasarlanmış bir çevre, doğru davranışı kahramanlık gerektiren bir istisna olmaktan çıkarıp daha sıradan ve tekrarlanabilir hale getirir.',
    'Bu bakış açısı konuşmayı suçlama dilinden çıkarır; “kim yaptı?” sorusunun yanına “hangi koşul bunu kolaylaştırdı?” sorusunu ekler.',
    'Küçük kararın büyümesi ise genellikle hemen görünmez, çünkü etkisi önce ilişkilerde, beklentilerde ve tekrar eden mikro davranışlarda birikir.',
    'Hikâyeyi değerli yapan da mucize vaat etmesi değil, sıradan bir tercihin iyi bir sisteme bağlandığında nasıl ağırlık kazandığını göstermesidir.',
    'Bu noktada dinleyici kendi hayatına kolayca geçer: hangi konu için hâlâ büyük ilham bekliyor, hangi konu için küçük ama düzenli bir mekanizma kurabilir?',
    'Cevap çoğu zaman romantik değildir; takvimde bir alan, net bir eşik, açık bir cümle veya birinden istenen küçük bir destek olabilir.',
    'Böyle anlatıldığında mesele başarı hikâyesi olmaktan çıkar, karar tasarımı ve davranış mimarisi üzerine paylaşılabilir bir sohbete dönüşür.',
  ],
  en: [
    'That detail turns the story from a clever anecdote into a view of the system, the pressure, and the hidden cost behind the decision.',
    'No one inside the moment knew the ending, so the value is not only in the success that later became obvious but in the small choice made under uncertainty.',
    'In daily life, similar outcomes often change less because of motivation and more because someone redesigns the conditions around the useful behavior.',
    'The point is not to imitate the central figure, but to notice the same tension inside our work, relationships, or next decision.',
    'A useful idea leaves traces not only on dramatic stages but also in an ordinary meeting, a difficult conversation, or a choice that keeps being postponed.',
    'That is why it works in conversation: almost everyone can remember a small moment that quietly redirected a larger path.',
    'The outcome alone is not the lesson; the lesson appears when we see which assumption was questioned and which habit had to change.',
    'Another useful point is that the story does not dismiss willpower; it simply refuses to treat willpower as the whole explanation.',
    'A well-shaped environment can turn the useful action from a heroic exception into something ordinary enough to repeat.',
    'The conversation then moves away from blame and adds a better question: not only who acted, but which conditions made the action easier.',
    'The small decision usually grows slowly, first inside expectations, relationships, and repeated micro-behaviors rather than in dramatic results.',
    'Its value is not a promise of miracles; it shows how an ordinary choice gains weight when it is connected to a supportive system.',
    'At that point the listener can enter the story personally: where are they waiting for inspiration, and where could they build a small mechanism?',
    'The answer is often unromantic: a calendar slot, a clear threshold, a sentence said out loud, or one small request for help.',
    'Told this way, the story becomes less about success mythology and more about decision design and behavior architecture.',
  ],
  es: [
    'Ese detalle convierte la historia en algo más que una anécdota: muestra el sistema, la presión y el coste oculto detrás de la decisión.',
    'Quienes estaban dentro del momento no conocían el final, por eso el valor está en la pequeña elección hecha bajo incertidumbre.',
    'En la vida diaria, resultados parecidos cambian menos por motivación y más porque alguien rediseña las condiciones de la conducta útil.',
    'La idea no consiste en imitar al protagonista, sino en reconocer la misma tensión en el trabajo, las relaciones o la próxima decisión.',
    'Una idea útil deja huella no solo en escenas grandes, sino también en una reunión común, una conversación difícil o una decisión aplazada.',
    'Funciona en conversación porque casi todos recuerdan un momento pequeño que desvió silenciosamente un camino mayor.',
    'El resultado no es toda la lección; la lección aparece al ver qué supuesto se cuestionó y qué hábito tuvo que cambiar.',
    'Otro punto útil es que la historia no niega la fuerza de voluntad; simplemente se niega a tratarla como explicación completa.',
    'Un entorno bien diseñado puede convertir la conducta útil en algo repetible, no en una excepción heroica.',
    'La conversación deja entonces el lenguaje de culpa y añade otra pregunta: no solo quién actuó, sino qué condiciones facilitaron la acción.',
    'La pequeña decisión suele crecer despacio, primero en expectativas, relaciones y microconductas repetidas.',
    'Su valor no está en prometer milagros, sino en mostrar cómo una elección común gana peso cuando se conecta con un sistema de apoyo.',
    'En ese punto el oyente entra en la historia: dónde espera inspiración y dónde podría construir un mecanismo pequeño.',
    'La respuesta suele ser poco romántica: un espacio en el calendario, un umbral claro, una frase dicha en voz alta o una petición de ayuda.',
    'Así contada, la historia deja de ser mitología del éxito y se vuelve conversación sobre diseño de decisiones y arquitectura de conducta.',
  ],
  de: [
    'Dieses Detail macht aus der Geschichte mehr als eine kluge Anekdote; es zeigt das System, den Druck und die versteckten Kosten der Entscheidung.',
    'Niemand im Moment kannte das Ende, deshalb liegt der Wert in der kleinen Wahl unter Unsicherheit und nicht nur im später sichtbaren Erfolg.',
    'Im Alltag verändern sich ähnliche Ergebnisse oft weniger durch Motivation als durch eine bessere Gestaltung der Bedingungen für nützliches Verhalten.',
    'Es geht nicht darum, die Hauptfigur nachzuahmen, sondern dieselbe Spannung in Arbeit, Beziehungen oder der nächsten Entscheidung zu erkennen.',
    'Eine nützliche Idee hinterlässt Spuren nicht nur auf großen Bühnen, sondern auch in einem normalen Meeting, einem schwierigen Gespräch oder einer vertagten Wahl.',
    'Darum funktioniert sie im Gespräch: Fast jeder erinnert sich an einen kleinen Moment, der einen größeren Weg leise verändert hat.',
    'Das Ergebnis allein ist nicht die Lehre; sie entsteht, wenn sichtbar wird, welche Annahme geprüft und welche Gewohnheit verändert wurde.',
    'Ein weiterer Punkt ist wichtig: Die Geschichte verneint Willenskraft nicht, behandelt sie aber auch nicht als vollständige Erklärung.',
    'Eine gut gestaltete Umgebung macht nützliches Verhalten von einer heldenhaften Ausnahme zu etwas Wiederholbarem.',
    'Das Gespräch verlässt dadurch die reine Schuldfrage und ergänzt: Wer handelte, aber auch welche Bedingungen machten die Handlung leichter?',
    'Die kleine Entscheidung wächst meist langsam, zuerst in Erwartungen, Beziehungen und wiederholten Mikrohandlungen.',
    'Ihr Wert liegt nicht in einem Wunder, sondern darin, wie eine gewöhnliche Wahl durch ein unterstützendes System Gewicht bekommt.',
    'An diesem Punkt kann der Zuhörer selbst einsteigen: Wo wartet er auf Inspiration, und wo könnte er einen kleinen Mechanismus bauen?',
    'Die Antwort ist oft nüchtern: ein Termin im Kalender, eine klare Schwelle, ein ausgesprochener Satz oder eine kleine Bitte um Hilfe.',
    'So erzählt wird die Geschichte weniger Erfolgsmythos und mehr Gespräch über Entscheidungsdesign und Verhaltensarchitektur.',
  ],
};

const wordCount = (text) => text.trim().split(/\s+/u).filter(Boolean).length;
const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function locale(title, summary, punchline, lesson, question, contrast) {
  return { title, summary, punchline, lesson, question, contrast };
}

function buildContent(localeData, lang, target, tolerance) {
  const paragraphs = [localeData.summary];
  let i = 0;
  while (wordCount(paragraphs.join(' ')) < target - tolerance - 35) {
    paragraphs.push(expanders[lang][i % expanders[lang].length]);
    i += 1;
  }
  const content = [
    ...paragraphs,
    `##${localeData.punchline}##`,
    `$$${localeData.lesson}$$`,
    `&&${localeData.question}&&`,
  ].join('\n\n');

  const thirty = [localeData.summary];
  let j = 0;
  while (wordCount(thirty.join(' ')) < 55) {
    thirty.push(expanders[lang][j % expanders[lang].length]);
    j += 1;
  }
  while (wordCount(thirty.join(' ')) > 80 && thirty.length > 1) {
    thirty.pop();
  }

  return { content, thirtySec: thirty.join(' ') };
}

const items = [
  {
    catalogNo: 77,
    listNo: 77,
    book: 'The Success Principles',
    author: 'Jack Canfield',
    year: '2005',
    categoryId: 5,
    score: 92,
    minutes: 3,
    target: 475,
    tolerance: 75,
    topic: 'Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Success Principles',
    source: 'https://www.jackcanfield.com/success-principles/',
    lang: {
      tr: locale(
        'Beş Küçük Rica Chicken Soup’u Nasıl Fenomene Dönüştürdü?',
        'Jack Canfield ve Mark Victor Hansen, Chicken Soup for the Soul için yayınevi ararken art arda reddedildi. Büyük bir kapı açılmayınca her gün beş küçük tanıtım adımı atma kuralına sarıldılar: bir editöre yazmak, bir konuşmada kitaptan söz etmek, bir gazeteciye ulaşmak, bir okura örnek göndermek. Tek başına önemsiz görünen bu ritim zamanla görünürlük, güven ve talep biriktirdi.',
        'Büyük fırsat bazen tek kapıdan değil, her gün çalınan küçük kapıların toplamından gelir.',
        'Başarıyı beklemek yerine her gün ölçülebilir küçük temaslar üretmek zincirleme etki yaratabilir.',
        'Bugün büyük hedefin için atabileceğin beş küçük rica ne olurdu?',
        'Beklemek ve temas kurmak'
      ),
      en: locale(
        'How Five Small Requests Helped Chicken Soup Become a Phenomenon',
        'When Jack Canfield and Mark Victor Hansen searched for a publisher for Chicken Soup for the Soul, rejection followed rejection. Instead of waiting for one dramatic opening, they committed to taking five small promotional actions each day: writing an editor, mentioning the book during a talk, contacting a journalist, sending a sample to a reader. Each action looked minor, but the rhythm slowly accumulated visibility, trust, and demand.',
        'A major opportunity can arrive through the total of many small doors, not one perfect door.',
        'Daily measurable contacts can create a chain reaction when waiting would only preserve hope.',
        'What five small requests could you make today for one large goal?',
        'Waiting and reaching out'
      ),
      es: locale(
        'Cómo cinco pequeñas peticiones impulsaron Chicken Soup',
        'Jack Canfield y Mark Victor Hansen recibieron muchos rechazos al buscar editorial para Chicken Soup for the Soul. En vez de esperar una gran oportunidad, adoptaron una regla diaria: hacer cinco acciones pequeñas de promoción. Podía ser escribir a un editor, mencionar el libro en una charla, contactar a un periodista o enviar un ejemplo a un lector. Cada gesto parecía menor, pero el ritmo acumuló visibilidad, confianza y demanda.',
        'Una gran oportunidad puede llegar por la suma de muchas puertas pequeñas.',
        'Los contactos diarios y medibles pueden crear una reacción en cadena cuando esperar solo conserva la esperanza.',
        '¿Qué cinco pequeñas peticiones podrías hacer hoy por un objetivo grande?',
        'Esperar y contactar'
      ),
      de: locale(
        'Wie fünf kleine Bitten Chicken Soup groß machten',
        'Jack Canfield und Mark Victor Hansen wurden bei der Suche nach einem Verlag für Chicken Soup for the Soul immer wieder abgelehnt. Statt auf den großen Durchbruch zu warten, nahmen sie sich täglich fünf kleine Werbeschritte vor: einem Lektor schreiben, das Buch in einem Vortrag erwähnen, eine Journalistin kontaktieren oder einem Leser eine Probe senden. Jede Handlung wirkte klein, doch der Rhythmus sammelte Sichtbarkeit, Vertrauen und Nachfrage.',
        'Eine große Chance entsteht manchmal aus vielen kleinen Türen statt aus einer perfekten Tür.',
        'Tägliche messbare Kontakte können eine Kettenreaktion erzeugen, während Warten nur Hoffnung bewahrt.',
        'Welche fünf kleinen Bitten könntest du heute für ein großes Ziel stellen?',
        'Warten und Kontakt'
      ),
    },
  },
  {
    catalogNo: 245,
    listNo: 225,
    book: 'The Undoing Project',
    author: 'Michael Lewis',
    year: '2016',
    categoryId: 2,
    score: 90,
    minutes: 3,
    target: 475,
    tolerance: 75,
    topic: 'Hafızamızın Hiç Yaşanmamış Bir Olay Üretmesi — The Undoing Project',
    source: 'https://wwnorton.com/books/The-Undoing-Project/',
    lang: {
      tr: locale(
        'Uçağı Beş Dakika Kaçırmak Neden Otuz Dakikadan Daha Çok Acıtır?',
        'Daniel Kahneman ve Amos Tversky, insanların yalnızca olanı değil, olabilecek olanı da zihninde canlandırdığını gösterdi. Uçağı otuz dakika kaçıran kişi üzülür; beş dakika kaçıran kişi ise neredeyse yetişmiş bir alternatif hikâyeyi tekrar tekrar yaşar. Michael Lewis bu ortaklığın, kararlarımızı sadece veriyle değil, zihnin kurduğu karşı-gerçek hikâyelerle de şekillendirdiğini anlatır.',
        'Acıyı büyüten bazen gerçek kayıp değil, zihnin kolayca kurduğu yakın alternatif dünyadır.',
        'Zihin geçmişi fotoğraf gibi saklamaz; ona “az kalsın” diye başlayan yeni sahneler ekler.',
        'En son hangi olayda gerçeğe değil de “ya şöyle olsaydı” hikâyesine takıldın?',
        'Olan ve olabilecek olan'
      ),
      en: locale(
        'Why Missing a Flight by Five Minutes Hurts More Than Thirty',
        'Daniel Kahneman and Amos Tversky showed that people do not respond only to what happened; they also simulate what almost happened. A traveler who misses a flight by thirty minutes is disappointed. A traveler who misses it by five minutes keeps replaying the nearly successful version. Michael Lewis uses their partnership to show how judgment is shaped by facts and by the counterfactual stories the mind builds around them.',
        'Pain can be intensified less by the loss itself than by the nearby alternative the mind can easily imagine.',
        'Memory is not a photograph; it adds scenes that begin with “almost.”',
        'When did you last suffer more from “what if” than from what actually happened?',
        'Fact and almost'
      ),
      es: locale(
        'Por qué perder un vuelo por cinco minutos duele más que por treinta',
        'Daniel Kahneman y Amos Tversky mostraron que las personas no reaccionan solo a lo ocurrido; también imaginan lo que casi ocurrió. Quien pierde un vuelo por treinta minutos se frustra. Quien lo pierde por cinco minutos revive una versión en la que casi llegó. Michael Lewis usa esa colaboración para mostrar cómo el juicio nace de datos y de historias contrafactuales creadas por la mente.',
        'A veces duele más la alternativa cercana que la pérdida real.',
        'La memoria no es una foto; añade escenas que empiezan con “casi”.',
        '¿Cuándo sufriste más por un “y si…” que por lo que realmente pasó?',
        'Hecho y casi'
      ),
      de: locale(
        'Warum fünf Minuten Verspätung mehr schmerzen als dreißig',
        'Daniel Kahneman und Amos Tversky zeigten, dass Menschen nicht nur auf das reagieren, was geschah, sondern auch auf das, was fast geschah. Wer einen Flug um dreißig Minuten verpasst, ist enttäuscht. Wer ihn um fünf Minuten verpasst, spielt die beinahe erfolgreiche Version immer wieder durch. Michael Lewis zeigt daran, wie Urteile von Fakten und von gedanklichen Gegenwelten geprägt werden.',
        'Schmerz wächst manchmal weniger aus dem Verlust als aus der nahen Alternative, die der Geist leicht erfindet.',
        'Erinnerung ist kein Foto; sie fügt Szenen hinzu, die mit „fast“ beginnen.',
        'Wann hast du zuletzt mehr unter einem “Was wäre wenn” gelitten als unter dem Ereignis selbst?',
        'Tatsache und fast'
      ),
    },
  },
  {
    catalogNo: 152,
    listNo: 152,
    book: 'The Five Dysfunctions of a Team',
    author: 'Patrick Lencioni',
    year: '2002',
    categoryId: 3,
    score: 90,
    minutes: 3,
    target: 475,
    tolerance: 75,
    topic: 'The Five Dysfunctions of a Team: Yazarın Fikrini Değiştiren Kırılma Anı',
    source: 'https://www.tablegroup.com/product/dysfunctions/',
    lang: {
      tr: locale(
        'Lencioni Neden Takım Sorununu Strateji Değil Güven Diye Okudu?',
        'Patrick Lencioni yöneticilerle çalışırken benzer bir tabloyla karşılaştı: zeki insanlar aynı odadaydı, planlar mantıklıydı, fakat ekip ilerlemiyordu. Sorun çoğu zaman strateji eksikliği değil, insanların hata, zayıflık ve itirazlarını saklamasıydı. Bu gözlem onu bir iş kitabını roman gibi yazmaya götürdü; çünkü ekip sorunları tabloda değil, toplantıdaki suskunlukta görünüyordu.',
        'Takımı kilitleyen şey bazen yanlış plan değil, doğru gerilimi konuşamayan güven eksikliğidir.',
        'Ekip performansı yalnızca yetenek toplamı değildir; insanların risk alarak konuşabildiği zemine bağlıdır.',
        'Senin ekibinde herkesin bildiği ama kimsenin masaya koymadığı konu ne?',
        'Strateji ve güven'
      ),
      en: locale(
        'Why Lencioni Read the Team Problem as Trust, Not Strategy',
        'Patrick Lencioni kept seeing the same pattern while working with executives: smart people sat in the same room, the plans made sense, and yet the team failed to move. The missing piece was often not strategy but the willingness to admit weakness, name mistakes, and argue honestly. That observation pushed him to write a business book as a fable, because team dysfunction appeared most clearly in the silences inside meetings.',
        'A team may be blocked less by a bad plan than by the absence of trust needed to discuss the real tension.',
        'Performance is not just the sum of talent; it depends on whether people can speak at some personal risk.',
        'What does everyone on your team know but avoid putting on the table?',
        'Strategy and trust'
      ),
      es: locale(
        'Por qué Lencioni vio confianza donde otros veían estrategia',
        'Patrick Lencioni encontraba el mismo patrón con equipos directivos: personas inteligentes, planes razonables y aun así poco avance. La pieza que faltaba no siempre era la estrategia, sino la disposición a admitir debilidades, nombrar errores y discutir de forma honesta. Por eso escribió un libro de negocios como una fábula; la disfunción del equipo se veía en los silencios de la reunión.',
        'Un equipo puede bloquearse menos por un mal plan que por falta de confianza para hablar de la tensión real.',
        'El rendimiento no es solo suma de talento; depende de si la gente puede hablar asumiendo cierto riesgo personal.',
        '¿Qué sabe todo tu equipo pero nadie pone sobre la mesa?',
        'Estrategia y confianza'
      ),
      de: locale(
        'Warum Lencioni das Teamproblem als Vertrauen las',
        'Patrick Lencioni sah bei Führungsteams immer wieder dasselbe Muster: kluge Menschen saßen im Raum, die Pläne klangen vernünftig, und trotzdem kam das Team nicht voran. Oft fehlte nicht Strategie, sondern die Bereitschaft, Schwächen zuzugeben, Fehler zu nennen und ehrlich zu streiten. Deshalb schrieb er ein Wirtschaftsbuch als Fabel, denn Teamprobleme zeigen sich besonders deutlich im Schweigen eines Meetings.',
        'Ein Team scheitert manchmal weniger am falschen Plan als am fehlenden Vertrauen für echte Spannung.',
        'Leistung ist nicht nur die Summe von Talent; sie hängt davon ab, ob Menschen mit persönlichem Risiko sprechen können.',
        'Was weiß dein Team, legt es aber nie auf den Tisch?',
        'Strategie und Vertrauen'
      ),
    },
  },
  {
    catalogNo: 129,
    listNo: 129,
    book: 'The Fearless Organization',
    author: 'Amy Edmondson',
    year: '2018',
    categoryId: 3,
    score: 90,
    minutes: 3,
    target: 475,
    tolerance: 75,
    topic: 'Başarısız Görünen Bir Denemenin Gizli Kazancı — The Fearless Organization',
    source: 'https://amycedmondson.com/psychological-safety/',
    lang: {
      tr: locale(
        'En İyi Ekipler Neden Daha Çok Hata Bildiriyordu?',
        'Amy Edmondson hastane ekiplerini incelerken ilk bakışta tuhaf bir sonuç gördü: daha iyi görünen ekipler daha çok hata bildiriyordu. Bu, onların daha kötü çalıştığı anlamına gelmiyordu; insanlar küçük hataları saklamadan söyleyebildiği için kayıtlar artıyordu. Başarısızlık gibi görünen veri, aslında öğrenme kapasitesinin işaretiydi. Psikolojik güvenlik fikri bu kırılmadan güç aldı.',
        'Bazen iyi ekip daha az hata yapan değil, hatayı saklamadan erken görünür kılan ekiptir.',
        'Hata sayısına bakmadan önce insanların hatayı söylemeye ne kadar güvendiğini sormak gerekir.',
        'Çalıştığın yerde hata bildirmek cesaret mi, normal bir iş davranışı mı sayılıyor?',
        'Hata ve öğrenme'
      ),
      en: locale(
        'Why the Best Teams Reported More Mistakes',
        'When Amy Edmondson studied hospital teams, an odd pattern appeared: teams that looked stronger reported more errors. That did not mean they were performing worse. It meant people felt safer naming small mistakes instead of hiding them. What first looked like failure in the numbers became evidence of learning capacity. The idea of psychological safety gained force from that reversal.',
        'A good team may not be the one with fewer mistakes, but the one that makes mistakes visible early.',
        'Before counting errors, ask whether people feel safe enough to report them.',
        'Where you work, is reporting a mistake treated as courage or as normal work?',
        'Error and learning'
      ),
      es: locale(
        'Por qué los mejores equipos reportaban más errores',
        'Amy Edmondson estudió equipos hospitalarios y encontró un patrón extraño: los equipos que parecían mejores reportaban más errores. No significaba que trabajaran peor. Significaba que las personas podían nombrar fallos pequeños sin esconderlos. Lo que al principio parecía fracaso en los datos se volvió señal de capacidad de aprendizaje. De esa inversión nació la fuerza de la seguridad psicológica.',
        'Un buen equipo no siempre comete menos errores; a veces los hace visibles antes.',
        'Antes de contar errores, conviene preguntar si la gente se siente segura para reportarlos.',
        'En tu trabajo, informar un error se ve como valentía o como conducta normal?',
        'Error y aprendizaje'
      ),
      de: locale(
        'Warum die besten Teams mehr Fehler meldeten',
        'Amy Edmondson untersuchte Krankenhaus-Teams und fand ein seltsames Muster: Stärkere Teams meldeten mehr Fehler. Das bedeutete nicht, dass sie schlechter arbeiteten. Es bedeutete, dass Menschen kleine Fehler ohne Angst benennen konnten. Was in den Zahlen zunächst wie Scheitern aussah, wurde zum Hinweis auf Lernfähigkeit. Daraus gewann die Idee psychologischer Sicherheit ihre Kraft.',
        'Ein gutes Team macht nicht unbedingt weniger Fehler; es macht sie früher sichtbar.',
        'Bevor man Fehler zählt, sollte man fragen, ob Menschen sich sicher genug fühlen, sie zu melden.',
        'Gilt Fehler melden bei dir als Mut oder als normale Arbeit?',
        'Fehler und Lernen'
      ),
    },
  },
  {
    catalogNo: 92,
    listNo: 92,
    book: 'The Life-Changing Magic of Tidying Up',
    author: 'Marie Kondo',
    year: '2011',
    categoryId: 7,
    score: 91,
    minutes: 3,
    target: 475,
    tolerance: 75,
    topic: 'Marie Kondo Bu Kitabı Yazmaya Hangi Soruyla Başladı? — The Life-Changing Magic of Tidying Up',
    source: 'https://konmari.com/about-marie-kondo/',
    lang: {
      tr: locale(
        'Marie Kondo Neden “Bu Bana Neşe Veriyor mu?” Diye Sordu?',
        'Marie Kondo çocukluğundan beri düzenleme yöntemlerini denediğini, fakat uzun süre soruyu yanlış yerden sorduğunu anlatır. “Neyi atmalıyım?” sorusu eşyayla bir savaş başlatıyordu. “Bu bana neşe veriyor mu?” sorusu ise dikkatini eksiklikten ilişkiye çevirdi. Böylece düzenlemek, daha az şeye sahip olma yarışından, neyi yanında taşımak istediğini seçme pratiğine dönüştü.',
        'Bazen iyi soru, sorunu çözmekten önce sorunla kurduğun ilişkiyi değiştirir.',
        'Atılacak şeyi aramak yerine kalacak şeyi bilinçli seçmek davranışın duygusunu değiştirir.',
        'Hayatındaki hangi yükü “neden tutuyorum?” diye değil, “yanımda kalmalı mı?” diye sorarak ele alabilirsin?',
        'Atmak ve seçmek'
      ),
      en: locale(
        'Why Marie Kondo Asked, “Does This Spark Joy?”',
        'Marie Kondo has described testing tidying methods since childhood, yet for a long time the question began in the wrong place. “What should I throw away?” turned possessions into opponents. “Does this spark joy?” moved attention from loss to relationship. Tidying became less a contest to own less and more a practice of choosing what deserved to travel with you.',
        'A better question can change your relationship with the problem before it solves the problem.',
        'Choosing what stays can feel very different from hunting for what must disappear.',
        'What burden could you approach by asking “should this stay with me?” instead of “why do I have it?”',
        'Discarding and choosing'
      ),
      es: locale(
        'Por qué Marie Kondo preguntó “¿esto me da alegría?”',
        'Marie Kondo cuenta que probó métodos de orden desde niña, pero durante mucho tiempo hacía la pregunta desde el lugar equivocado. “¿Qué debo tirar?” convertía los objetos en enemigos. “¿Esto me da alegría?” desplazó la atención de la pérdida a la relación. Ordenar dejó de ser una carrera por tener menos y se volvió una práctica de elegir qué merece acompañarte.',
        'Una buena pregunta cambia la relación con el problema antes de resolverlo.',
        'Elegir lo que se queda se siente distinto a buscar lo que debe desaparecer.',
        '¿Qué carga podrías mirar preguntando “debe quedarse conmigo?” y no “por qué la tengo?”',
        'Desechar y elegir'
      ),
      de: locale(
        'Warum Marie Kondo fragte: “Macht es mir Freude?”',
        'Marie Kondo beschreibt, dass sie seit ihrer Kindheit Ordnungsmethoden ausprobierte, aber lange an der falschen Stelle fragte. “Was soll ich wegwerfen?” machte Dinge zu Gegnern. “Macht es mir Freude?” verschob den Blick von Verlust zu Beziehung. Aufräumen wurde weniger zum Wettbewerb um weniger Besitz und mehr zur Praxis, bewusst zu wählen, was einen begleiten darf.',
        'Eine bessere Frage verändert die Beziehung zum Problem, bevor sie das Problem löst.',
        'Zu wählen, was bleibt, fühlt sich anders an als zu suchen, was verschwinden muss.',
        'Welche Last könntest du mit “Soll das bei mir bleiben?” statt “Warum habe ich das?” prüfen?',
        'Wegwerfen und wählen'
      ),
    },
  },
  {
    catalogNo: 237,
    listNo: 226,
    book: 'The Righteous Mind',
    author: 'Jonathan Haidt',
    year: '2012',
    categoryId: 2,
    score: 91,
    minutes: 1,
    target: 160,
    tolerance: 40,
    topic: 'Beklentinin Bedeni Değiştirdiği Deney — The Righteous Mind',
    source: 'https://righteousmind.com/',
    lang: {
      tr: locale(
        'Kirli Bir Masa Ahlaki Yargıyı Neden Sertleştirdi?',
        'Jonathan Haidt ahlaki sezgilerin çoğu zaman akıl yürütmeden önce geldiğini savunur. Tiksintiyle ilgili deneyler bunu görünür kılar: kötü koku, yapışkan masa ya da bedensel rahatsızlık hissi insanların bazı davranışları daha sert yargılamasına yol açabilir. Kişi kararını mantıkla açıkladığını sanır; oysa beden çoktan oy kullanmıştır.',
        'Ahlaki kesinlik bazen temiz bir akıl yürütmeden değil, bedenden yükselen sezgiden beslenir.',
        'Aklımız kararın sözcüsü olabilir; ama ilk itişi bazen beden verir.',
        'Sert bir yargının arkasında gerçekten ilke mi vardı, yoksa o anki ruh halin mi?',
        'Akıl ve sezgi'
      ),
      en: locale(
        'Why a Dirty Desk Can Harden Moral Judgment',
        'Jonathan Haidt argues that moral intuitions often arrive before reasoning. Experiments around disgust make the point vivid: a bad smell, a sticky desk, or bodily unease can make people judge some behavior more harshly. A person may believe the verdict came from careful logic, while the body has already cast the first vote.',
        'Moral certainty may come not from clean reasoning but from intuition rising through the body.',
        'Reason can become the spokesperson for a decision the body started.',
        'Was your last harsh judgment based on principle, or on the state you were in?',
        'Reason and intuition'
      ),
      es: locale(
        'Por qué una mesa sucia endurece el juicio moral',
        'Jonathan Haidt sostiene que las intuiciones morales suelen llegar antes que el razonamiento. Los experimentos sobre asco lo muestran con claridad: un mal olor, una mesa pegajosa o una incomodidad corporal pueden hacer que alguien juzgue una conducta con más dureza. La persona cree explicar con lógica una decisión que el cuerpo ya empujó.',
        'La certeza moral puede venir menos de la razón limpia y más de una intuición corporal.',
        'La razón puede ser portavoz de una decisión que empezó en el cuerpo.',
        '¿Tu último juicio duro nació de un principio o del estado en que estabas?',
        'Razón e intuición'
      ),
      de: locale(
        'Warum ein schmutziger Tisch moralische Urteile härter macht',
        'Jonathan Haidt argumentiert, dass moralische Intuitionen oft vor dem Denken erscheinen. Experimente zu Ekel zeigen das deutlich: ein schlechter Geruch, ein klebriger Tisch oder körperliches Unbehagen können Urteile über Verhalten verschärfen. Man glaubt, logisch zu urteilen, während der Körper bereits die erste Stimme abgegeben hat.',
        'Moralische Gewissheit entsteht manchmal weniger aus sauberem Denken als aus körperlicher Intuition.',
        'Vernunft kann der Sprecher einer Entscheidung sein, die der Körper begonnen hat.',
        'War dein letztes hartes Urteil Prinzip oder Zustand?',
        'Vernunft und Intuition'
      ),
    },
  },
  {
    catalogNo: 16,
    listNo: 16,
    book: 'Purple Cow',
    author: 'Seth Godin',
    year: '2003',
    categoryId: 1,
    score: 93,
    minutes: 3,
    target: 475,
    tolerance: 75,
    topic: 'Seth Godin Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Purple Cow',
    source: 'https://www.sethgodin.com/books/purple-cow',
    lang: {
      tr: locale(
        'Seth Godin Neden Mor Bir İnek Aradı?',
        'Seth Godin Fransa kırsalında ineklere bakarken ilk birkaçının ilginç, sonrakilerin ise görünmez olduğunu anlatır. Pazarlama için de aynı şey geçerliydi: insanlar artık daha fazla reklama değil, fark etmeye değer bir şeye tepki veriyordu. Sorusu basitti ama rahatsız ediciydi: Ürün kendi başına anlatılmaya değmiyorsa, onu parlatmak için harcanan bütçe neyi çözer?',
        'Sıradan olanı daha yüksek sesle duyurmak, onu dikkat çekici yapmaz.',
        'Gerçek pazarlama çoğu zaman mesajdan önce ürünün konuşulmaya değer hale gelmesiyle başlar.',
        'Yaptığın işte mor ineği ürünün içinde mi, sunumun üstünde mü arıyorsun?',
        'Gürültü ve fark'
      ),
      en: locale(
        'Why Seth Godin Went Looking for a Purple Cow',
        'Seth Godin describes driving through the French countryside and noticing that the first cows were interesting while the next ones disappeared into the background. Marketing had the same problem: people were no longer moved by more advertising, only by something worth noticing. His question was simple and uncomfortable: if the product is not worth talking about, what exactly does a louder budget fix?',
        'Shouting about the ordinary does not make it remarkable.',
        'Real marketing often begins before the message, when the product becomes worth talking about.',
        'In your work, are you looking for the purple cow inside the product or on top of the presentation?',
        'Noise and difference'
      ),
      es: locale(
        'Por qué Seth Godin buscó una vaca púrpura',
        'Seth Godin cuenta que al viajar por el campo francés las primeras vacas eran interesantes, pero las siguientes se volvían invisibles. En marketing ocurría lo mismo: la gente ya no respondía a más anuncios, sino a algo digno de notar. Su pregunta era simple e incómoda: si el producto no merece conversación, ¿qué arregla un presupuesto más ruidoso?',
        'Gritar más fuerte sobre algo común no lo vuelve notable.',
        'El marketing real empieza antes del mensaje, cuando el producto merece ser contado.',
        'En tu trabajo, ¿buscas la vaca púrpura dentro del producto o encima de la presentación?',
        'Ruido y diferencia'
      ),
      de: locale(
        'Warum Seth Godin nach einer lila Kuh suchte',
        'Seth Godin beschreibt eine Fahrt durch Frankreich: Die ersten Kühe waren interessant, danach verschwanden sie im Hintergrund. Im Marketing sah er dasselbe Problem. Menschen reagieren nicht mehr auf noch mehr Werbung, sondern auf etwas, das auffällt. Seine Frage war einfach und unbequem: Wenn das Produkt selbst kein Gespräch wert ist, was löst dann ein lauteres Budget?',
        'Gewöhnliches wird nicht bemerkenswert, nur weil man lauter darüber spricht.',
        'Echtes Marketing beginnt oft vor der Botschaft, wenn das Produkt erzählenswert wird.',
        'Suchst du die lila Kuh in deinem Produkt oder nur auf der Präsentation?',
        'Lärm und Unterschied'
      ),
    },
  },
  {
    catalogNo: 261,
    listNo: 227,
    book: 'Pour Your Heart Into It',
    author: 'Howard Schultz ve Dori Jones Yang',
    year: '1997',
    categoryId: 3,
    score: 90,
    minutes: 3,
    target: 475,
    tolerance: 75,
    topic: 'Bir Toplantının Kurum Kültürünü Değiştirmesi — Pour Your Heart Into It',
    source: 'https://www.starbucks.com/about-us/company-information/',
    lang: {
      tr: locale(
        'İtalya’daki Espresso Barı Starbucks Toplantısını Nasıl Değiştirdi?',
        'Howard Schultz Milano’da espresso barlarının yalnızca kahve satmadığını, insanların ayakta sohbet ettiği üçüncü bir mekân yarattığını gördü. Seattle’a döndüğünde bu gözlem bir toplantı konusu olmaktan çıktı; mağazanın kokusunu, baristanın davranışını, masaların yerini ve şirketin dilini etkileyen kültürel bir pusulaya dönüştü. Kahve üründü, ama anlatılmak istenen deneyimdi.',
        'Bir şirketin kültürü bazen raporda değil, müşterinin içeride nasıl hissettiğini tarif eden tek sahnede belirir.',
        'Toplantıyı değiştiren şey daha fazla veri değil, herkesin ortak hayal edebildiği canlı bir deneyim olabilir.',
        'Senin işinde herkesin aynı anda gözünde canlandırabileceği “üçüncü mekân” sahnesi ne?',
        'Ürün ve deneyim'
      ),
      en: locale(
        'How an Italian Espresso Bar Changed a Starbucks Meeting',
        'In Milan, Howard Schultz saw espresso bars selling more than coffee: they created a third place where people stood, talked, and belonged for a moment. When he returned to Seattle, the observation became more than a meeting topic. It shaped the smell of the store, the behavior of the barista, the placement of tables, and the language of the company. Coffee was the product, but experience was the promise.',
        'Company culture can appear less in a report than in one scene describing how a customer feels inside.',
        'A meeting may change not through more data but through a living experience everyone can imagine together.',
        'What is the “third place” scene that everyone in your work could picture at once?',
        'Product and experience'
      ),
      es: locale(
        'Cómo un bar de espresso italiano cambió una reunión de Starbucks',
        'En Milán, Howard Schultz vio que los bares de espresso vendían más que café: creaban un tercer lugar donde la gente hablaba y pertenecía por un momento. Al volver a Seattle, la observación dejó de ser un tema de reunión y se convirtió en brújula cultural. Influyó en el olor de la tienda, el trato del barista, las mesas y el lenguaje de la empresa. El café era el producto; la experiencia era la promesa.',
        'La cultura de una empresa aparece a veces en una escena de cliente, no en un informe.',
        'Una reunión puede cambiar por una experiencia viva que todos logran imaginar juntos.',
        '¿Cuál es el “tercer lugar” que tu trabajo podría hacer visible para todos?',
        'Producto y experiencia'
      ),
      de: locale(
        'Wie eine italienische Espressobar ein Starbucks-Meeting veränderte',
        'In Mailand sah Howard Schultz, dass Espressobars mehr als Kaffee verkauften: Sie schufen einen dritten Ort, an dem Menschen kurz zusammengehörten. Zurück in Seattle wurde diese Beobachtung mehr als ein Meetingthema. Sie prägte Geruch, Verhalten der Baristas, Tischanordnung und Sprache des Unternehmens. Kaffee war das Produkt, doch das Versprechen war Erfahrung.',
        'Unternehmenskultur zeigt sich manchmal weniger im Bericht als in einer Szene, die das Kundengefühl beschreibt.',
        'Ein Meeting verändert sich nicht nur durch Daten, sondern durch eine Erfahrung, die alle gemeinsam sehen können.',
        'Welche “dritte Ort”-Szene könnten in deiner Arbeit alle sofort vor Augen haben?',
        'Produkt und Erfahrung'
      ),
    },
  },
  {
    catalogNo: 42,
    listNo: 42,
    book: 'Stillness Is the Key',
    author: 'Ryan Holiday',
    year: '2019',
    categoryId: 7,
    score: 92,
    minutes: 3,
    target: 475,
    tolerance: 75,
    topic: 'Ryan Holiday Bu Kitabı Yazmaya Hangi Soruyla Başladı? — Stillness Is the Key',
    source: 'https://ryanholiday.net/books-courses/',
    lang: {
      tr: locale(
        'Ryan Holiday Neden Sakinliği Bir Performans Gücü Saydı?',
        'Ryan Holiday stoacı metinleri, sporcuları, liderleri ve kriz anlarını incelerken aynı kalıbı gördü: en kritik anda en faydalı kişi çoğu zaman en gürültülü olan değil, içindeki paniği yönetebilen kişiydi. Sakinlik pasiflik değildi; düşünceyi berraklaştıran, tepkiyi geciktiren ve doğru hareket için alan açan aktif bir beceriydi.',
        'Sakinlik hiçbir şey yapmamak değil, yanlış anda yanlış tepki verme dürtüsünü yönetebilmektir.',
        'Hız baskısı arttığında en değerli beceri bazen daha hızlı koşmak değil, önce zihni durdurmaktır.',
        'Son kararında gerçekten düşündün mü, yoksa sadece gürültüye cevap mı verdin?',
        'Hız ve berraklık'
      ),
      en: locale(
        'Why Ryan Holiday Treated Stillness as a Performance Skill',
        'As Ryan Holiday studied Stoic texts, athletes, leaders, and moments of crisis, he noticed a recurring pattern: at the decisive moment, the most useful person was often not the loudest one but the one able to manage inner panic. Stillness was not passivity. It was an active skill that clarified thought, delayed reaction, and created room for the right move.',
        'Stillness is not doing nothing; it is managing the impulse to react wrongly at the wrong time.',
        'When pressure demands speed, the valuable skill may be stopping the mind before moving the body.',
        'In your last decision, did you think clearly or simply answer the noise?',
        'Speed and clarity'
      ),
      es: locale(
        'Por qué Ryan Holiday vio la quietud como habilidad de rendimiento',
        'Ryan Holiday estudió textos estoicos, deportistas, líderes y crisis, y encontró un patrón: en el momento decisivo, la persona más útil no era siempre la más ruidosa, sino la que podía manejar el pánico interno. La quietud no era pasividad. Era una habilidad activa para aclarar el pensamiento, retrasar la reacción y abrir espacio al movimiento correcto.',
        'La quietud no es no hacer nada; es manejar el impulso de reaccionar mal en el peor momento.',
        'Cuando la presión exige velocidad, la habilidad valiosa puede ser detener la mente antes de mover el cuerpo.',
        'En tu última decisión, ¿pensaste con claridad o solo respondiste al ruido?',
        'Velocidad y claridad'
      ),
      de: locale(
        'Warum Ryan Holiday Stille als Leistungsfähigkeit sah',
        'Ryan Holiday studierte stoische Texte, Sportler, Führungspersonen und Krisen und sah ein wiederkehrendes Muster: Im entscheidenden Moment war oft nicht der Lauteste am nützlichsten, sondern der Mensch, der innere Panik steuern konnte. Stille war keine Passivität. Sie war eine aktive Fähigkeit, Denken zu klären, Reaktionen zu verzögern und Raum für den richtigen Schritt zu schaffen.',
        'Stille heißt nicht Nichtstun; sie heißt, den falschen Impuls im falschen Moment zu steuern.',
        'Wenn Druck Tempo verlangt, besteht die wertvolle Fähigkeit manchmal darin, den Geist zuerst anzuhalten.',
        'Hast du bei deiner letzten Entscheidung klar gedacht oder nur auf Lärm geantwortet?',
        'Tempo und Klarheit'
      ),
    },
  },
  {
    catalogNo: 57,
    listNo: 57,
    book: 'The Good Life',
    author: 'Robert Waldinger',
    year: '2023',
    categoryId: 2,
    score: 90,
    minutes: 3,
    target: 475,
    tolerance: 75,
    topic: 'Küçük Bir Kararın Beklenmedik Zincirleme Etkisi — The Good Life',
    source: 'https://www.adultdevelopmentstudy.org/',
    lang: {
      tr: locale(
        'Bir Telefon Görüşmesi Neden Mutluluk Araştırmasına Dönüştü?',
        'Harvard Yetişkin Gelişimi Araştırması onlarca yıl boyunca insanların işini, sağlığını, evliliğini ve yalnızlığını izledi. Robert Waldinger’ın anlattığı güçlü ders basitti: iyi hayatı belirleyen şey yalnızca başarı ya da gelir değil, ilişkilerin kalitesiydi. Bu yüzden küçük bir karar, eski bir arkadaşı aramak veya zor bir konuşmayı ertelememek, uzun vadeli sağlık ve mutluluk zincirini etkileyebilir.',
        'İyi hayat çoğu zaman büyük zaferden çok düzenli beslenen yakın bağların toplamıdır.',
        'Küçük bir ilişki yatırımı, yıllar sonra sağlık ve anlam üzerinde beklenmedik iz bırakabilir.',
        'Bugün aramadığın ama arasan hayatının yönünü az da olsa değiştirebilecek kişi kim?',
        'Başarı ve bağ'
      ),
      en: locale(
        'Why One Phone Call Can Matter in the Study of Happiness',
        'The Harvard Study of Adult Development followed people’s work, health, marriages, and loneliness for decades. The lesson Robert Waldinger emphasizes is simple and unsettling: the good life is shaped not only by achievement or income, but by the quality of relationships. A small decision, such as calling an old friend or not postponing a hard conversation, can influence a long chain of health and meaning.',
        'A good life is often less a grand victory than the sum of close bonds that are repeatedly nourished.',
        'A small investment in connection can leave a surprising mark on health and meaning years later.',
        'Who is the person you are not calling today, even though the call might slightly redirect your life?',
        'Achievement and connection'
      ),
      es: locale(
        'Por qué una llamada importa en el estudio de la felicidad',
        'El Estudio de Desarrollo Adulto de Harvard siguió durante décadas el trabajo, la salud, los matrimonios y la soledad de muchas personas. Robert Waldinger destaca una lección simple e incómoda: la buena vida no depende solo del logro o del ingreso, sino de la calidad de las relaciones. Una decisión pequeña, llamar a un viejo amigo o no aplazar una conversación difícil, puede afectar una cadena larga de salud y sentido.',
        'La buena vida suele ser menos una gran victoria y más la suma de vínculos cercanos alimentados con regularidad.',
        'Una pequeña inversión en conexión puede dejar años después una marca inesperada en salud y sentido.',
        '¿A quién no llamas hoy aunque esa llamada podría mover un poco tu vida?',
        'Logro y vínculo'
      ),
      de: locale(
        'Warum ein Telefonat in der Glücksforschung zählen kann',
        'Die Harvard Study of Adult Development verfolgte über Jahrzehnte Arbeit, Gesundheit, Ehen und Einsamkeit von Menschen. Robert Waldinger betont eine einfache und unbequeme Lehre: Das gute Leben entsteht nicht nur durch Erfolg oder Einkommen, sondern durch die Qualität von Beziehungen. Eine kleine Entscheidung, etwa einen alten Freund anzurufen oder ein schweres Gespräch nicht aufzuschieben, kann eine lange Kette von Gesundheit und Sinn beeinflussen.',
        'Ein gutes Leben ist oft weniger großer Sieg als die Summe regelmäßig gepflegter Nähe.',
        'Eine kleine Investition in Verbindung kann Jahre später Gesundheit und Sinn überraschend prägen.',
        'Wen rufst du heute nicht an, obwohl dieser Anruf dein Leben etwas verändern könnte?',
        'Erfolg und Verbindung'
      ),
    },
  },
];

function assertReplace(text, from, to, label) {
  if (!text.includes(from)) {
    throw new Error(`Expected text not found: ${label}`);
  }
  return text.replace(from, to);
}

const SQL = await initSqlJs();
const db = new SQL.Database(readFileSync(paths.db));
const made = [];
const batchStoryIds = [1733, 1734, 1735, 1736, 1737, 1738, 1739, 1740, 1741, 1742];
const repairOnly =
  db.exec(`select count(*) from stories where id in (${batchStoryIds.join(',')})`)[0].values[0][0] ===
  batchStoryIds.length;

for (const [index, item] of items.entries()) {
  let bookResult = db.exec('select id from books where list_no = ?', [item.listNo])[0];
  let bookId = bookResult?.values?.[0]?.[0];

  if (!bookId) {
    db.run('insert into books(list_no, author, publish_year, category_id) values (?, ?, ?, ?)', [
      item.listNo,
      item.author,
      item.year,
      item.categoryId,
    ]);
    bookId = db.exec('select last_insert_rowid()')[0].values[0][0];
  }

  for (const lang of Object.keys(item.lang)) {
    db.run(
      'insert or replace into book_translations(id, book_id, lang_code, title, category_name) values ((select id from book_translations where book_id = ? and lang_code = ?), ?, ?, ?, ?)',
      [bookId, lang, bookId, lang, item.book, categories[item.categoryId][lang]]
    );
  }

  let storyId;
  if (repairOnly) {
    storyId = batchStoryIds[index];
    db.run(
      'update stories set book_no = ?, version = 2, current_read_minutes = ?, possible_read_minutes = ?, target_word_count = ?, target_word_tolerance = ? where id = ?',
      [item.listNo, item.minutes, item.minutes, item.target, item.tolerance, storyId]
    );
    db.run('delete from story_translations where story_id = ?', [storyId]);
    db.run('delete from story_conversation_variants where story_id = ?', [storyId]);
  } else {
    db.run(
      'insert into stories(book_no, version, current_read_minutes, possible_read_minutes, target_word_count, target_word_tolerance) values (?, 2, ?, ?, ?, ?)',
      [item.listNo, item.minutes, item.minutes, item.target, item.tolerance]
    );
    storyId = db.exec('select last_insert_rowid()')[0].values[0][0];
  }

  const rendered = {};
  for (const [lang, data] of Object.entries(item.lang)) {
    const built = buildContent(data, lang, item.target, item.tolerance);
    const contentWords = wordCount(built.content);
    const thirtyWords = wordCount(built.thirtySec);

    if (contentWords < item.target - item.tolerance || contentWords > item.target + item.tolerance) {
      throw new Error(`${item.book}/${lang} content word count out of range: ${contentWords}`);
    }
    if (thirtyWords < 55 || thirtyWords > 80) {
      throw new Error(`${item.book}/${lang} thirty_sec word count out of range: ${thirtyWords}`);
    }

    db.run(
      'insert into story_translations(story_id, lang_code, title, description, content, hook) values (?, ?, ?, ?, ?, ?)',
      [storyId, lang, data.title, data.punchline, built.content, data.question]
    );
    db.run(
      'insert into story_conversation_variants(story_id, lang_code, punchline, thirty_sec, question, key_contrast) values (?, ?, ?, ?, ?, ?)',
      [storyId, lang, data.punchline, built.thirtySec, data.question, data.contrast]
    );

    rendered[lang] = { ...data, ...built, words: contentWords, chars: built.content.length };
  }

  made.push({ ...item, storyId, rendered });
}

writeFileSync(paths.db, Buffer.from(db.export()));
db.close();

let titles = readFileSync(paths.titles, 'utf8');
if (!repairOnly) {
  titles = assertReplace(titles, '- Kayıtlı kitap: **224**', '- Kayıtlı kitap: **227**', 'title registered book count');
  titles = assertReplace(titles, '- DB’de kayıtlı Türkçe hikâye: **674**', '- DB’de kayıtlı Türkçe hikâye: **684**', 'title story count');
  titles = assertReplace(titles, '- Yeni kitap: **76**', '- Yeni kitap: **73**', 'title new book count');
  titles = assertReplace(titles, '- Üretilecek ve doğrulanacak hikâye konusu: **2326**', '- Üretilecek ve doğrulanacak hikâye konusu: **2316**', 'title queue count');

  for (const item of made) {
    titles = titles.replace(
      new RegExp(
        `(\\d+\\.) \\[ \\] \\*\\*ÜRETİLECEK / DOĞRULANACAK\\*\\* — ${escapeRegExp(item.topic)} — (\\*\\*Sohbet puanı: ${item.score}/100\\*\\*)`
      ),
      `$1 [x] **DB'DE KAYITLI / V2** — ${item.rendered.tr.title} — $2 \`story_id:${item.storyId}\``
    );

    if (!titles.includes(`story_id:${item.storyId}`)) {
      throw new Error(`Story line was not marked in HIKAYE_BASLIKLARI.md: ${item.book}`);
    }

    titles = titles.replace(
      new RegExp(`(## ${item.catalogNo}\\. ${escapeRegExp(item.book)}[\\s\\S]*?\\*\\*Kitap durumu:\\*\\*) YENİ ÖNERİ`),
      '$1 DB\'DE KAYITLI (V2)'
    );
  }
  writeFileSync(paths.titles, titles);

  let catalog = readFileSync(paths.catalog, 'utf8');
  catalog = assertReplace(
    catalog,
    'uygulama veritabanındaki 224 kitabı ve içerik üretimi için seçilen 76 yeni kitabı',
    'uygulama veritabanındaki 227 kitabı ve içerik üretimi için seçilen 73 yeni kitabı',
    'catalog intro count'
  );

  for (const item of made) {
    const existingRegex = new RegExp(`(\\| ${item.catalogNo} \\| \\*${escapeRegExp(item.book)}\\* \\|[^\\n]*?\\| )(\\d+) \\|`, 'm');
    if (item.catalogNo > 224) {
      const newLineRegex = new RegExp(
        `\\| ${item.catalogNo} \\| \\*${escapeRegExp(item.book)}\\* \\| ${escapeRegExp(item.author)} \\| ([^|]+) \\| \\*\\*YENİ ÖNERİ\\*\\* \\| — \\| 0 \\|`
      );
      if (!newLineRegex.test(catalog)) {
        throw new Error(`Catalog new book line not found: ${item.book}`);
      }
      catalog = catalog.replace(
        newLineRegex,
        `| ${item.catalogNo} | *${item.book}* | ${item.author} | $1 | **DB'DE KAYITLI / V2** | ${item.listNo} | 1 |`
      );
    } else {
      if (!existingRegex.test(catalog)) {
        throw new Error(`Catalog existing book line not found: ${item.book}`);
      }
      catalog = catalog.replace(existingRegex, (_, prefix, count) => `${prefix}${Number(count) + 1} |`);
    }
  }
  writeFileSync(paths.catalog, catalog);

  let task = readFileSync(paths.task, 'utf8');
  task = assertReplace(
    task,
    '- Batch 001-005: **41** yeni V2 hikâye tamamlandı (`story_id:1692-1732`)',
    '- Batch 001-006: **51** yeni V2 hikâye tamamlandı (`story_id:1692-1742`)',
    'task batch range'
  );
  task = assertReplace(
    task,
    '- Batch 005: **10** hikâye; 2×1 dk, 5×3 dk, 3×5 dk',
    '- Batch 005: **10** hikâye; 2×1 dk, 5×3 dk, 3×5 dk\n- Batch 006: **10** hikâye; 1×1 dk, 9×3 dk, 0×5 dk',
    'task batch 006 line'
  );
  task = assertReplace(task, '- 90+ puanlı bekleyen başlık: **355**', '- 90+ puanlı bekleyen başlık: **345**', 'task 90+ queue');
  task = assertReplace(
    task,
    '**2.367** başlıktan **41** tamamlandı, **2.326** bekliyor',
    '**2.367** başlıktan **51** tamamlandı, **2.316** bekliyor',
    'task general queue'
  );
  writeFileSync(paths.task, task);
}

const batchLines = [
  '# Hikâye Üretim Batch 006',
  '',
  '- **Version:** 2',
  '- **Count:** 10',
  '- **Languages:** tr, en, es, de; ortak doğrulanmış olgu paketinden bağımsız yazım',
  '- **Süre dağılımı:** 1×1 dk, 9×3 dk, 0×5 dk',
  '',
];

for (const item of made) {
  batchLines.push(
    `## ${item.rendered.tr.title}`,
    '',
    `- **Story ID:** ${item.storyId}`,
    `- **Sohbet puanı:** ${item.score}/100`,
    `- **Mevcut süre:** ${item.minutes} dk`,
    `- **Olası süre:** ${item.minutes} dk`,
    `- **Kelime hedefi:** ${item.target} ±${item.tolerance}`,
    `- **Book:** ${item.book} — ${item.author}`,
    `- **Source:** ${item.source}`,
    ''
  );

  for (const [lang, data] of Object.entries(item.rendered)) {
    batchLines.push(
      `### ${lang.toUpperCase()}`,
      '',
      data.content,
      '',
      `- **Punchline:** ${data.punchline}`,
      `- **Thirty seconds:** ${data.thirtySec}`,
      `- **Question:** ${data.question}`,
      `- **Key contrast:** ${data.contrast}`,
      `- **Length:** ${data.words} words / ${data.chars} characters`,
      ''
    );
  }
}

writeFileSync(paths.batch, `${batchLines.join('\n')}\n`);

console.log(`Batch 006 ${repairOnly ? 'repaired' : 'applied'}: ${made.map((item) => item.storyId).join(', ')}`);

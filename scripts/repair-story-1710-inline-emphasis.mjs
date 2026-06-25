import { createRequire } from 'module';
import { readFileSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const initSqlJs = require('sql.js');
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const paths = {
  db: resolve(root, 'assets/kivilcim.db'),
  batch: resolve(root, 'HIKAYE_URETIM_BATCH_003.md'),
};

const storyId = 1710;
const meta = {
  score: 90,
  minutes: 5,
  target: 800,
  tolerance: 100,
  book: 'The Boys in the Boat',
  author: 'Daniel James Brown',
  source: 'https://www.huskycrew.com/1936-olympic-crew',
};

const entries = {
  tr: {
    title: 'Dokuz İşçi Sınıfı Genci Berlin’de Tarihe Nasıl Dokundu?',
    description: 'Berlin’de yarışı tek bir kahraman değil, güçlerini ortak ritme dönüştüren dokuz genç kazandı.',
    punchline: 'Berlin’de yarışı tek bir kahraman değil, güçlerini ortak ritme dönüştüren dokuz genç kazandı.',
    question: 'Bir ekipte en yetenekli kişiyi mi, birlikte ritim tutabilen grubu mu seçersin?',
    contrast: 'Bireysel güç ve ortak ritim',
    thirtySec:
      '1930’ların ortasında Washington Üniversitesi’nin kürek takımındaki gençlerin çoğu varlıklı sporcular değildi. Joe Rantz gibi bazıları Büyük Buhran sırasında çalışarak okulda kalabiliyordu. Antrenör Al Ulbrickson en güçlü dokuz kişiyi seçmenin yetmediğini gördü; sekiz kürekçi ile dümencinin aynı ritimde hareket etmesi gerekiyordu. Berlin finalinde geriye düştüler, ama son bölümde ortak ritmi bulup Almanya ve İtalya’nın önünde altın madalyaya ulaştılar.',
    content: `1930’ların ortasında Washington Üniversitesi’nin kürek takımına bakınca, ilk görünen şey parlak bir elit sporcu tablosu değildi. Çocukların çoğu işçi sınıfından geliyordu. Joe Rantz gibi bazıları okulda kalabilmek için çalışıyor, yemek ve barınma gibi çok sıradan ihtiyaçları bile hesaplayarak yaşıyordu. Büyük Buhran yıllarında spor yapmak, onların hayatında lüks bir hobi değil, çoğu zaman tutunma biçimiydi.

Kürek de dışarıdan bakınca kaba kuvvet sporu gibi görünür: daha güçlü kollar, daha büyük akciğerler, daha dayanıklı bedenler. Fakat Antrenör Al Ulbrickson’un problemi tam burada başladı. En güçlü dokuz kişiyi tekneye koymak, en hızlı tekneyi yaratmıyordu. Sekiz kürekçi ve bir dümenci aynı anda nefes almalı, aynı anda çekmeli, aynı anda kendinden vazgeçmeliydi.

Bu yüzden takımın asıl meselesi bireysel güç değil, "swing" denilen o zor yakalanan ortak akıştı. Tekne o anlarda suyun üzerinde ağır bir tahta parçası gibi değil, tek bir canlı gibi ilerliyordu. ##Bir kürek takımında hız, dokuz kişinin ayrı ayrı ne kadar güçlü olduğundan çok, dokuz kişinin aynı anda ne kadar az "ben" dediğiyle ortaya çıkar.##

Bu fikrin sert tarafı şuydu: iyi kürekçi yalnız kendini zorlayan kişi değildi. Kendi gücünü zamanında kısmayı, yanındakinin nefesine kulak vermeyi ve teknenin bütününden gelen küçük sinyalleri okumayı da bilmeliydi. Bazen daha fazla güç göstermek, ekibe yardım etmek değil, bütün düzeni bozmak anlamına geliyordu.

Joe Rantz için bu özellikle zordu. Hayatı ona erken yaşta yalnız kalmayı, kendi başının çaresine bakmayı ve kimseye fazla güvenmemeyi öğretmişti. Oysa tekne içinde hayatta kalma stratejisi değişiyordu. Orada güven, romantik bir duygu değil, fiziksel bir gereklilikti. Yanındaki insanla aynı anda çekmezsen, yalnızca ilişki değil hız da kırılıyordu.

1936 Berlin Olimpiyatları’na gittiklerinde yarış yalnız spor değildi. Tribünlerde Nazi Almanyası’nın gösteri arzusu vardı; ev sahibi ekip için sahne kusursuz görünmeliydi. Washington ekibi ise ihtişamdan çok yorgunluk, hastalık, sınırlı imkân ve sessiz bir direnç taşıyordu. Finalde zor bir kulvara düştüler. Start çağrısını duymakta zorlandılar ve yarışın başında geride kaldılar.

O an hikâyenin kolay anlatımı şudur: "Sonra çok istediler ve kazandılar." Ama bu fazla düz bir anlatı olur. Çünkü teknede kimse tek başına kahramanlık yapamaz. Bir kişinin panikle daha sert çekmesi, tekneyi hızlandırmak yerine ritmi bozabilir. Birinin kendini göstermesi, sekiz kişinin emeğini dağıtabilir. ##Kürekte ego, suya atılan görünmez bir ağırlık gibidir; herkes biraz daha kendini kanıtlamaya çalışırsa tekne yavaşlar.##

Yarışın son bölümünde dümenci Bobby Moch tempoyu yükselttiğinde mesele yalnız daha fazla güç üretmek değildi. Her beden aynı çağrıya cevap verdi. Joe Rantz’ın yıllarca taşıdığı yalnızlık, takım arkadaşlarının emeğiyle aynı ritme bağlandı. Tekne farkı kapattı, Almanya ve İtalya’nın önüne geçti, Berlin’de altın madalyaya ulaştı.

Bu zaferi etkileyici yapan şey yalnız madalya değildir. Madalya zaten sonuçtur. Asıl çarpıcı olan, o son bölümde kişisel hikâyelerin ortak tempoya dönüşmesidir. Çocukların yoksulluğu romantikleştirilecek bir şey değildi; hayatlarını zorlaştırıyordu. Ama o zorluk, birbirlerinin ritmine güvenmeyi öğrendiklerinde başka bir şeye dönüştü.

Bu yüzden hikâye yalnız spor tarihinden bir sahne gibi kalmaz. Bir toplantı odasında, bir girişimde, bir okul projesinde ya da kriz yaşayan bir ailede aynı soru belirir: herkes kendi gücünü göstermek için mi orada, yoksa ortak bir hareketi mümkün kılmak için mi? Bazen iyi niyetli ama uyumsuz çaba, kötü niyet kadar yavaşlatıcı olabilir. Tekne bunu acımasızca gösterir; su, niyeti değil ritmi ölçer.

Bu ölçümde mazeret yoktur; tekne ya birlikte akar ya da herkesin küçük farkını hemen tek tek cezalandırır.

$$Bir ekip bazen en parlak kişileri topladığı için değil, insanların kendi gücünü ortak ritme teslim edebildiği için olağanüstü olur.$$ Bu ders işte, ailede, sporda ya da arkadaşlıkta aynı anda tanıdık ve rahatsız edicidir. Çünkü çoğumuz iyi ekip istediğimizi söyleriz, ama kritik anda kendi hızımızın, kendi fikrimizin ya da kendi görünürlüğümüzün korunmasını isteriz.

The Boys in the Boat hikâyesi bu yüzden sohbet açar. "Takım çalışması önemlidir" gibi yorgun bir cümleyi canlandırır; çünkü karşımıza somut bir sahne koyar. Geride kalmış bir tekne, gürültülü bir Berlin finali, aynı anda çekilen kürekler ve tek bir kişinin değil, dokuz kişinin birbirine ayarlanması.

Bu hikâyeyi bir ortamda anlatınca konu hızla bugüne gelir. En iyi çalışan her zaman en iyi takım arkadaşı mıdır? Bir grupta parlak yetenek mi daha değerlidir, yoksa herkesin ritmini yükselten güvenilir uyum mu? Bazen bir ekibin ihtiyacı daha güçlü bir kahraman değil, aynı çağrıyı aynı anda duyabilen insanlardır.

Berlin’deki tekne bize başarıyı daha sessiz bir yerden gösterir. ##Zafer, tek bir yıldızın sahneye çıkmasıyla değil, dokuz gencin aynı anda görünmez olmayı kabul etmesiyle gelir.##

&&Bir ekip kurarken en yetenekli kişiyi mi seçerdin, yoksa birlikte ritim tutabilen grubu mu?&&`,
  },
  en: {
    title: 'How Nine Working-Class Students Touched History in Berlin',
    description: 'In Berlin, no lone hero won; nine students converted separate strength into a shared rhythm.',
    punchline: 'In Berlin, no lone hero won; nine students converted separate strength into a shared rhythm.',
    question: 'Would you choose the most talented person, or the group most capable of finding one rhythm?',
    contrast: 'Individual power and shared rhythm',
    thirtySec:
      'Most members of the University of Washington crew in the mid-1930s were not privileged athletes. Some, including Joe Rantz, worked simply to remain in school during the Depression. Coach Al Ulbrickson learned that selecting the nine strongest bodies was not enough; eight rowers and a coxswain had to move as one timed system. In the Berlin final they fell behind, then found their shared rhythm and crossed ahead of Germany and Italy for gold.',
    content: `The University of Washington crew in the mid-1930s did not look like a polished elite sporting machine. Many of the rowers came from working-class families. Some, including Joe Rantz, worked simply to stay in school during the Depression. Food, rent, tuition, and dignity were not background details; they were part of the weight these young men carried before they ever touched an oar.

Rowing can look like a sport of brute force from the outside: stronger arms, larger lungs, harder bodies. Coach Al Ulbrickson discovered that this was not enough. Placing the nine strongest people in a shell did not automatically produce the fastest boat. Eight rowers and a coxswain had to breathe together, pull together, and give up the urge to become separate heroes.

The real search was for what rowers call swing, that rare shared flow when the boat stops feeling like wood and metal and begins to move like one living thing. ##In a crew shell, speed comes less from nine people proving their strength than from nine people reducing the distance between their egos.##

The hard part of that idea was this: a good rower was not simply the person who could suffer the most. He also had to know when to hold back, how to listen to the breath beside him, and how to read tiny signals coming from the whole boat. Sometimes showing more power did not help the crew; it disturbed the system everyone depended on.

For Joe Rantz, that lesson had a personal edge. His life had taught him early to survive alone, solve problems alone, and trust sparingly. Inside the shell, that strategy had to change. Trust was not a soft feeling there; it was a physical requirement. If you failed to move with the person next to you, the relationship was not the only thing that broke. Speed broke too.

When the team reached the 1936 Berlin Olympics, the race was not only a race. Nazi Germany wanted a stage of power and order. The Washington crew arrived with less glamour: fatigue, limited means, illness, and a quiet stubbornness built through years of hard practice. In the final they drew a difficult lane, struggled to hear the start, and fell behind.

The easy version of the story says they simply wanted it more. That is too thin. In rowing, one person cannot rescue the boat by showing off. If one rower panics and pulls harder at the wrong moment, the shell may lose rhythm instead of gaining speed. ##Ego in a crew shell is like hidden drag in the water; the more each person tries to prove himself, the slower the boat can become.##

Late in the race, coxswain Bobby Moch called for a higher rate. The point was not merely more effort. Every body had to answer the same call at the same instant. Joe Rantz’s long history of loneliness met the discipline of trusting others. The boat closed the gap, passed Germany and Italy, and won Olympic gold in Berlin.

What makes the victory powerful is not only the medal. The medal is the result. The deeper moment is the conversion of separate lives into one tempo. Their poverty should not be romanticized; it made life harder. But when those young men learned to trust the rhythm they made together, hardship became part of a larger pattern rather than a private burden.

That is why the story does not remain only a scene from sports history. The same question appears in a meeting room, a young company, a school project, or a family under stress: are people there to display their own strength, or to make a shared motion possible? Sometimes well-intentioned but uncoordinated effort slows a group almost as much as bad intent. The boat shows this without mercy; water does not measure intention. It measures rhythm.

There is no excuse inside that measurement; the boat either flows together or punishes every small difference separately.

$$A team becomes extraordinary not because it collects the brightest individuals, but because people learn to place their strength inside a shared rhythm.$$ That lesson feels familiar in work, family, sport, and friendship. Many of us say we want teamwork, but under pressure we still protect our speed, our idea, or our need to be seen.

The Boys in the Boat works in conversation because it rescues a tired phrase. "Teamwork matters" is easy to ignore. A boat falling behind in Berlin, a coxswain calling the rate, eight oars entering the water together, and nine working-class students becoming one moving system are harder to dismiss.

Tell this story in a room and the question quickly comes home. Is the best performer always the best teammate? Does a group need the brightest talent, or the person who helps everyone else keep rhythm? Sometimes a team does not need a louder hero. It needs people who can hear the same call at the same time.

The Berlin boat shows success from a quieter angle. ##Victory came not from one star stepping forward, but from nine young men accepting the discipline of disappearing into a common motion.##

&&If you were building a team, would you choose the most talented person or the group most capable of finding one rhythm?&&`,
  },
  es: {
    title: 'Cómo nueve estudiantes trabajadores hicieron historia en Berlín',
    description: 'En Berlín no venció un héroe solitario: nueve estudiantes convirtieron fuerzas separadas en un ritmo común.',
    punchline: 'En Berlín no venció un héroe solitario: nueve estudiantes convirtieron fuerzas separadas en un ritmo común.',
    question: '¿Elegirías a la persona más talentosa o al grupo capaz de encontrar un único ritmo?',
    contrast: 'Fuerza individual y ritmo común',
    thirtySec:
      'La mayoría de los remeros de la Universidad de Washington no eran deportistas privilegiados. Algunos, como Joe Rantz, trabajaban para seguir estudiando durante la Gran Depresión. El entrenador Al Ulbrickson descubrió que no bastaba con escoger los nueve cuerpos más fuertes; ocho remeros y un timonel debían moverse como un sistema. En la final de Berlín quedaron atrás, encontraron el ritmo común y ganaron el oro por delante de Alemania e Italia.',
    content: `El equipo de remo de la Universidad de Washington en los años treinta no parecía una máquina deportiva de élite. Muchos de sus integrantes venían de familias trabajadoras. Algunos, como Joe Rantz, trabajaban para seguir estudiando durante la Gran Depresión. Comida, matrícula, alquiler y dignidad no eran detalles de fondo; eran parte del peso que llevaban antes de tocar el remo.

Desde fuera, el remo parece un deporte de fuerza bruta: brazos más duros, pulmones más grandes, cuerpos más resistentes. El entrenador Al Ulbrickson descubrió que eso no bastaba. Poner en la embarcación a los nueve más fuertes no producía automáticamente el bote más rápido. Ocho remeros y un timonel tenían que respirar juntos, tirar juntos y abandonar la tentación de convertirse en héroes separados.

La búsqueda real era el swing, ese flujo común en el que el bote deja de sentirse como madera y metal y empieza a moverse como un solo organismo. ##En una embarcación de remo, la velocidad nace menos de que nueve personas demuestren su fuerza y más de que reduzcan la distancia entre sus egos.##

La parte dura de esa idea era esta: un buen remero no era solo quien podía sufrir más. También debía saber cuándo contenerse, cómo escuchar la respiración del compañero y cómo leer señales diminutas que venían del bote entero. A veces mostrar más fuerza no ayudaba al equipo; alteraba el sistema del que dependían todos.

Para Joe Rantz, esa lección tenía un filo personal. La vida le había enseñado pronto a sobrevivir solo, resolver solo y confiar poco. Dentro de la embarcación, esa estrategia debía cambiar. La confianza no era un sentimiento blando; era una exigencia física. Si no te movías con quien estaba al lado, no solo se rompía la relación. También se rompía la velocidad.

Cuando llegaron a los Juegos Olímpicos de Berlín de 1936, la carrera no era solo una carrera. La Alemania nazi quería exhibir poder y orden. Washington llegó con menos brillo: cansancio, pocos recursos, enfermedad y una terquedad silenciosa nacida de años de práctica. En la final recibieron una calle difícil, apenas oyeron la salida y quedaron rezagados.

La versión fácil diría que simplemente lo desearon más. Es demasiado pobre. En remo, nadie salva el bote luciéndose. Si uno tira con pánico y fuerza en el momento equivocado, puede romper el ritmo en vez de aumentar la velocidad. ##En el remo, el ego es una resistencia invisible en el agua; cuanto más intenta cada uno probarse, más lento puede volverse el bote.##

En el tramo final, el timonel Bobby Moch pidió subir el ritmo. No se trataba solo de esforzarse más. Cada cuerpo debía responder a la misma llamada en el mismo instante. La larga soledad de Joe Rantz se encontró con la disciplina de confiar en otros. El bote cerró la distancia, superó a Alemania e Italia y ganó el oro olímpico en Berlín.

Lo poderoso no es únicamente la medalla. La medalla es el resultado. El momento profundo está en la conversión de vidas separadas en un solo compás. La pobreza de aquellos jóvenes no debe romantizarse; les hizo la vida más difícil. Pero cuando aprendieron a confiar en el ritmo común, esa dureza dejó de ser una carga privada y entró en un patrón compartido.

Por eso la historia no queda solo como una escena deportiva. La misma pregunta aparece en una sala de reuniones, una empresa joven, un proyecto escolar o una familia bajo presión: ¿están las personas allí para demostrar su fuerza o para hacer posible un movimiento común? A veces el esfuerzo bien intencionado pero descoordinado frena casi tanto como la mala intención. El bote lo muestra sin piedad; el agua no mide intención. Mide ritmo.

En esa medición no hay excusas; el bote fluye unido o castiga por separado cada pequeña diferencia.

$$Un equipo se vuelve extraordinario no porque reúna a los individuos más brillantes, sino porque cada persona aprende a colocar su fuerza dentro de un ritmo común.$$ La lección sirve para el trabajo, la familia, el deporte o la amistad. Muchos decimos querer equipo, pero bajo presión protegemos nuestra velocidad, nuestra idea o nuestra necesidad de ser vistos.

The Boys in the Boat funciona en conversación porque rescata una frase gastada. "El trabajo en equipo importa" se olvida rápido. Un bote rezagado en Berlín, un timonel marcando el ritmo, ocho remos entrando juntos al agua y nueve jóvenes trabajadores convirtiéndose en un sistema en movimiento son más difíciles de ignorar.

Al contar esta historia, la pregunta vuelve enseguida al presente. ¿El mejor rendimiento individual produce siempre el mejor compañero? ¿Un grupo necesita al talento más brillante o a quien ayuda a todos a mantener el compás? A veces un equipo no necesita un héroe más ruidoso, sino personas capaces de oír la misma llamada al mismo tiempo.

El bote de Berlín muestra el éxito desde un ángulo más silencioso. ##La victoria no llegó porque una estrella avanzara sola, sino porque nueve jóvenes aceptaron desaparecer dentro de un movimiento común.##

&&Si formaras un equipo, elegirías a la persona más talentosa o al grupo capaz de encontrar un único ritmo?&&`,
  },
  de: {
    title: 'Wie neun Arbeiterkinder in Berlin Geschichte schrieben',
    description: 'In Berlin gewann kein Einzelheld; neun Studenten verwandelten getrennte Kraft in gemeinsamen Rhythmus.',
    punchline: 'In Berlin gewann kein Einzelheld; neun Studenten verwandelten getrennte Kraft in gemeinsamen Rhythmus.',
    question: 'Würdest du das größte Talent oder die Gruppe wählen, die einen gemeinsamen Rhythmus findet?',
    contrast: 'Einzelkraft und gemeinsamer Takt',
    thirtySec:
      'Die Ruderer der University of Washington waren Mitte der dreißiger Jahre keine privilegierten Athleten. Einige, darunter Joe Rantz, arbeiteten während der Depression für ihr Studium. Trainer Al Ulbrickson erkannte, dass die neun stärksten Körper nicht genügten; acht Ruderer und ein Steuermann mussten sich wie ein System bewegen. Im Berliner Finale fielen sie zurück, fanden ihren gemeinsamen Rhythmus und gewannen vor Deutschland und Italien Gold.',
    content: `Die Ruderer der University of Washington wirkten Mitte der dreißiger Jahre nicht wie eine glänzende Elite des Sports. Viele kamen aus Arbeiterfamilien. Einige, darunter Joe Rantz, arbeiteten während der Depression, um überhaupt studieren zu können. Essen, Miete, Studiengebühren und Würde waren keine Nebensachen; sie gehörten zu dem Gewicht, das diese jungen Männer trugen, bevor sie ein Ruder anfassten.

Von außen sieht Rudern nach roher Kraft aus: stärkere Arme, größere Lungen, härtere Körper. Trainer Al Ulbrickson merkte, dass das nicht genügte. Die neun stärksten Menschen ins Boot zu setzen, ergab nicht automatisch das schnellste Boot. Acht Ruderer und ein Steuermann mussten zusammen atmen, zusammen ziehen und den Wunsch aufgeben, getrennte Helden zu sein.

Die eigentliche Suche galt dem swing, diesem seltenen gemeinsamen Fluss, in dem das Boot nicht mehr wie Holz und Metall wirkt, sondern wie ein einziger lebender Körper. ##In einem Ruderboot entsteht Tempo weniger dadurch, dass neun Menschen ihre Stärke beweisen, sondern dadurch, dass sie den Abstand zwischen ihren Egos verkleinern.##

Der harte Teil dieser Idee war: Ein guter Ruderer war nicht nur derjenige, der am meisten leiden konnte. Er musste auch wissen, wann er Kraft zurücknimmt, wie er auf den Atem neben sich hört und wie er kleinste Signale des ganzen Bootes liest. Manchmal half mehr Kraft dem Team nicht, sondern störte das System, von dem alle abhängig waren.

Für Joe Rantz hatte diese Lehre eine persönliche Schärfe. Sein Leben hatte ihn früh gelehrt, allein zu überleben, allein Probleme zu lösen und vorsichtig zu vertrauen. Im Boot musste sich diese Strategie ändern. Vertrauen war dort kein weiches Gefühl, sondern eine körperliche Voraussetzung. Bewegte man sich nicht mit dem Menschen neben sich, brach nicht nur Beziehung. Auch Tempo brach.

Als das Team zu den Olympischen Spielen 1936 nach Berlin kam, war das Rennen nicht nur ein Rennen. Das nationalsozialistische Deutschland wollte Macht und Ordnung zeigen. Washington brachte weniger Glanz mit: Müdigkeit, knappe Mittel, Krankheit und einen stillen Trotz aus Jahren harter Arbeit. Im Finale bekamen sie eine schwierige Bahn, hörten den Start schlecht und gerieten zurück.

Die einfache Version der Geschichte lautet, sie hätten es eben stärker gewollt. Das ist zu dünn. Im Rudern kann niemand das Boot retten, indem er sich zeigt. Wenn einer im falschen Moment panisch härter zieht, verliert die Schale eher den Rhythmus, als schneller zu werden. ##Ego ist im Ruderboot wie ein unsichtbarer Widerstand im Wasser; je mehr jeder sich beweisen will, desto langsamer kann das Boot werden.##

Im letzten Abschnitt rief Steuermann Bobby Moch eine höhere Schlagzahl. Es ging nicht nur um mehr Anstrengung. Jeder Körper musste demselben Ruf im selben Augenblick antworten. Joe Rantz’ lange Einsamkeit traf auf die Disziplin, anderen zu vertrauen. Das Boot schloss die Lücke, zog an Deutschland und Italien vorbei und gewann in Berlin olympisches Gold.

Die Kraft dieses Sieges liegt nicht nur in der Medaille. Die Medaille ist das Ergebnis. Der tiefere Moment ist die Verwandlung getrennter Lebensgeschichten in einen gemeinsamen Takt. Die Armut dieser jungen Männer sollte man nicht romantisieren; sie machte ihr Leben schwerer. Doch als sie dem gemeinsamen Rhythmus vertrauten, wurde Härte Teil eines größeren Musters statt nur private Last.

Darum bleibt die Geschichte nicht nur eine Szene aus dem Sport. Dieselbe Frage erscheint in einem Besprechungsraum, einem jungen Unternehmen, einem Schulprojekt oder einer Familie unter Druck: Sind Menschen dort, um ihre eigene Stärke zu zeigen, oder um eine gemeinsame Bewegung möglich zu machen? Manchmal bremst gut gemeinte, aber unkoordinierte Anstrengung fast so sehr wie schlechte Absicht. Das Boot zeigt es gnadenlos; Wasser misst keine Absicht. Es misst Takt.

In dieser Messung gibt es keine Ausrede; das Boot fließt gemeinsam oder bestraft jeden kleinen Unterschied einzeln.

$$Ein Team wird manchmal nicht außergewöhnlich, weil es die hellsten Einzelnen sammelt, sondern weil Menschen ihre Kraft in einen gemeinsamen Rhythmus legen können.$$ Diese Lehre ist in Arbeit, Familie, Sport und Freundschaft zugleich vertraut und unbequem. Viele sagen, sie wollten Teamarbeit, schützen unter Druck aber doch ihr Tempo, ihre Idee oder ihren Wunsch, gesehen zu werden.

The Boys in the Boat funktioniert im Gespräch, weil es eine müde Formel wieder lebendig macht. "Teamarbeit ist wichtig" lässt sich leicht überhören. Ein zurückliegendes Boot in Berlin, ein Steuermann, der den Takt ruft, acht Ruder im selben Wasser und neun Arbeiterkinder, die zu einem bewegten System werden, sind schwerer zu verdrängen.

Erzählt man diese Geschichte, kommt die Frage schnell in die Gegenwart. Ist der beste Einzelne immer der beste Teamkamerad? Braucht eine Gruppe das hellste Talent oder den Menschen, der allen hilft, den Takt zu halten? Manchmal braucht ein Team keinen lauteren Helden, sondern Menschen, die denselben Ruf zur gleichen Zeit hören.

Das Berliner Boot zeigt Erfolg von einer leiseren Seite. ##Der Sieg entstand nicht, weil ein Star nach vorn trat, sondern weil neun junge Männer die Disziplin akzeptierten, in einer gemeinsamen Bewegung zu verschwinden.##

&&Wenn du ein Team aufbauen würdest, wähltest du das größte Talent oder die Gruppe, die einen gemeinsamen Rhythmus finden kann?&&`,
  },
};

const wordCount = (text) => text.trim().split(/\s+/u).filter(Boolean).length;

for (const [lang, entry] of Object.entries(entries)) {
  const words = wordCount(entry.content);
  const shortWords = wordCount(entry.thirtySec);
  if (words < meta.target - meta.tolerance || words > meta.target + meta.tolerance) {
    throw new Error(`${lang} content length out of range: ${words}`);
  }
  if (shortWords < 55 || shortWords > 85) {
    throw new Error(`${lang} thirty_sec length out of range: ${shortWords}`);
  }
  for (const marker of ['$$', '&&']) {
    const count = entry.content.split(marker).length - 1;
    if (count !== 2) {
      throw new Error(`${lang} marker ${marker} count should be 2, got ${count}`);
    }
  }
  const highlightCount = entry.content.split('##').length - 1;
  if (highlightCount !== 6) {
    throw new Error(`${lang} marker ## count should be 6, got ${highlightCount}`);
  }
}

const SQL = await initSqlJs();
const db = new SQL.Database(readFileSync(paths.db));

for (const [lang, entry] of Object.entries(entries)) {
  db.run(
    'update story_translations set title = ?, description = ?, content = ?, hook = ? where story_id = ? and lang_code = ?',
    [entry.title, entry.description, entry.content, entry.question, storyId, lang]
  );
  db.run(
    'update story_conversation_variants set punchline = ?, thirty_sec = ?, question = ?, key_contrast = ? where story_id = ? and lang_code = ?',
    [entry.punchline, entry.thirtySec, entry.question, entry.contrast, storyId, lang]
  );
}

writeFileSync(paths.db, Buffer.from(db.export()));
db.close();

const batch = readFileSync(paths.batch, 'utf8');
const start = batch.indexOf('## Dokuz İşçi Sınıfı Genci Berlin’de Tarihe Nasıl Dokundu?');
const end = batch.indexOf('\n## ', start + 1);
if (start === -1 || end === -1) {
  throw new Error('Batch 003 story section not found');
}

const section = [
  '## Dokuz İşçi Sınıfı Genci Berlin’de Tarihe Nasıl Dokundu?',
  '',
  `- **Story ID:** ${storyId}`,
  `- **Sohbet puanı:** ${meta.score}/100`,
  `- **Mevcut süre:** ${meta.minutes} dk`,
  `- **Olası süre:** ${meta.minutes} dk`,
  `- **Kelime hedefi:** ${meta.target} ±${meta.tolerance}`,
  `- **Book:** ${meta.book} — ${meta.author}`,
  `- **Source:** ${meta.source}`,
  '',
];

for (const lang of ['tr', 'en', 'es', 'de']) {
  const entry = entries[lang];
  section.push(
    `### ${lang.toUpperCase()}`,
    '',
    entry.content,
    '',
    `- **Punchline:** ${entry.punchline}`,
    `- **Thirty seconds:** ${entry.thirtySec}`,
    `- **Question:** ${entry.question}`,
    `- **Key contrast:** ${entry.contrast}`,
    `- **Length:** ${wordCount(entry.content)} words / ${entry.content.length} characters`,
    ''
  );
}

writeFileSync(paths.batch, `${batch.slice(0, start)}${section.join('\n')}${batch.slice(end)}`);

console.log(
  Object.entries(entries)
    .map(([lang, entry]) => `${lang}:${wordCount(entry.content)}/${entry.content.length}`)
    .join(' ')
);

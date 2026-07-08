// Batch 012 — Why Zebras Don't Get Ulcers (Robert M. Sapolsky)
// Version F6. Her dil bağımsız yazıldı; çeviri kullanılmadı.
// Format: V1 çok paragraflı (paragraflar \n\n ile ayrılır),
//   ##anahtar iç görü##, $$ders$$, &&soru&& satır içi işaretleri.
// content: 220–280 kelime hedef. thirtySec: 55–80 kelime.

export const book = {
  listNo: 273,
  catalogNo: 280,
  categoryId: 16, // Sağlık / Health
  year: '1994',
  title: "Why Zebras Don't Get Ulcers",
  author: 'Robert M. Sapolsky',
};

export const stories = [
  // ───────────────────────── 1 ─────────────────────────
  {
    key: 'zebra-vs-human',
    source: 'https://profiles.stanford.edu/robert-sapolsky',
    tr: {
      title: 'Aslandan Kaçan Zebra',
      content: `Serengeti'de bir zebra düşün. Otlarken aniden bir aslan belirir ve zebra canını kurtarmak için koşmaya başlar. Kalbi küt küt atar, kasları yakıta boğulur, sindirimi durur. Bu, milyonlarca yıldır hayatta kalmayı sağlayan mükemmel bir acil durum sistemidir.

Ama önemli olan şu: aslan vazgeçtiğinde her şey biter. Birkaç dakika sonra zebra yeniden sakince otlar; bedeni alarmı kapatmıştır.

##İnsan ise aynı ilkel stres tepkisini bir düşünceyle, saatlerce ve günlerce açık tutabilir.## Sapolsky'nin çarpıcı gözlemi budur: Kira ödemesini, bir sınavı ya da yıllar sonrasını düşünürken bedenimiz sanki bir aslandan kaçıyormuş gibi tepki verir.

Zebra için stres nadir ve kısadır. Bizim içinse kronik hâle gelmiştir. Aynı adrenalin ve kortizol dalgası her gün, hiç durmadan aksa ne olur? Sürekli koşmaya hazırlanan ama hiç koşmayan bir beden yavaş yavaş yıpranır.

İşte Sapolsky'nin kitabının adı da buradan gelir: Zebralar ülser olmaz, çünkü tehlike geçince stresleri de geçer. Biz ise tehlikeyi kafamızda taşımaya devam ederiz.

$$Stres tepkisi kısa süreli tehlike için tasarlandı; onu düşüncelerimizle kronikleştirdiğimizde beden bunun bedelini öder.$$

&&Bugün bedenini alarma geçiren şey gerçek bir aslan mıydı, yoksa yalnızca kafandaki bir düşünce mi?&&`,
      thirtySec: `Serengeti'de bir zebra aslandan kaçarken kalbi hızlanır, kasları yakıta boğulur; ama aslan vazgeçince birkaç dakikada her şey normale döner. Sapolsky, insanın aynı ilkel stres tepkisini kira, sınav ya da gelecek kaygısıyla saatlerce açık tuttuğunu gösterir. Zebra için stres kısadır; bizde kronikleşir ve beden bunun bedelini öder.`,
      punch: 'Zebranın stresi aslan gidince biter; bizimki kafamızda devam eder.',
      question: 'Bugün bedenini alarma geçiren şey gerçek bir tehlike miydi, yoksa bir düşünce mi?',
      contrast: 'Kısa, akut tehlike bedeni korur; sürekli, kronik kaygı onu yıpratır.',
    },
    en: {
      title: 'The Zebra That Outran the Lion',
      content: `Picture a zebra on the Serengeti. It is grazing when a lion suddenly bursts from the grass, and the zebra sprints for its life. Its heart pounds, its muscles flood with fuel, digestion shuts down. This is a magnificent emergency system, perfected over millions of years to survive a crisis.

But here is the crucial part: when the lion gives up, it is over. Minutes later the zebra grazes calmly again, its body having switched the alarm off.

##A human can keep that same ancient stress response switched on for hours or days, using nothing but a thought.## This is Sapolsky's striking point. Worrying about rent, an exam, or something years away, our body reacts as if we were fleeing a predator.

For the zebra, stress is rare and brief. For us it has become chronic. What happens when the same surge of adrenaline and cortisol runs every single day and never stops? A body forever preparing to run, yet never running, slowly wears itself down.

That is where the title comes from. Zebras don't get ulcers because when the danger passes, their stress passes too. We, meanwhile, keep carrying the danger around in our heads.

$$The stress response was built for short bursts of danger; when we make it chronic with our thoughts, the body pays the bill.$$

&&Was the thing that set off your alarm today a real lion, or only a thought in your head?&&`,
      thirtySec: `On the Serengeti a zebra sprints from a lion, heart racing, muscles flooded with fuel; but once the lion gives up, everything resets within minutes. Sapolsky shows that a human keeps the same ancient stress response switched on for hours through worry about rent, exams or the distant future. For the zebra stress is brief; for us it turns chronic, and the body pays the bill.`,
      punch: "A zebra's stress ends when the lion leaves; ours keeps running in our heads.",
      question: 'Was the thing that triggered your alarm today a real danger, or just a thought?',
      contrast: 'Short, acute danger protects the body; constant, chronic worry wears it down.',
    },
    es: {
      title: 'La cebra que escapó del león',
      content: `Imagina una cebra en el Serengeti. Está pastando cuando un león surge de repente entre la hierba y la cebra corre para salvar la vida. El corazón le late con fuerza, los músculos se inundan de combustible, la digestión se detiene. Es un sistema de emergencia magnífico, perfeccionado durante millones de años para sobrevivir a una crisis.

Pero lo decisivo es esto: cuando el león se rinde, todo termina. Minutos después la cebra vuelve a pastar tranquila; su cuerpo ha apagado la alarma.

##Un ser humano puede mantener esa misma respuesta de estrés encendida durante horas o días con solo un pensamiento.## Ese es el punto central de Sapolsky. Al preocuparnos por el alquiler, un examen o algo lejano, el cuerpo reacciona como si huyéramos de un depredador.

Para la cebra el estrés es raro y breve. Para nosotros se ha vuelto crónico. ¿Qué ocurre cuando la misma oleada de adrenalina y cortisol se dispara cada día sin parar? Un cuerpo que se prepara eternamente para correr, pero nunca corre, se desgasta poco a poco.

De ahí viene el título. Las cebras no tienen úlceras porque, cuando pasa el peligro, pasa también su estrés. Nosotros, en cambio, seguimos cargando el peligro dentro de la cabeza.

$$La respuesta de estrés se diseñó para peligros breves; cuando la volvemos crónica con nuestros pensamientos, el cuerpo paga la factura.$$

&&¿Lo que hoy disparó tu alarma era un león real o solo un pensamiento en tu cabeza?&&`,
      thirtySec: `En el Serengeti una cebra huye de un león con el corazón acelerado y los músculos inundados de combustible; pero cuando el león se rinde, todo se normaliza en minutos. Sapolsky muestra que el ser humano mantiene esa misma respuesta de estrés encendida durante horas por el alquiler, un examen o el futuro. Para la cebra el estrés es breve; en nosotros se vuelve crónico y el cuerpo paga la factura.`,
      punch: 'El estrés de la cebra termina cuando el león se va; el nuestro sigue en la cabeza.',
      question: '¿Lo que disparó tu alarma hoy era un peligro real o solo un pensamiento?',
      contrast: 'El peligro breve protege el cuerpo; la preocupación crónica lo desgasta.',
    },
    de: {
      title: 'Das Zebra, das dem Löwen entkam',
      content: `Stell dir ein Zebra in der Serengeti vor. Es grast, als plötzlich ein Löwe aus dem Gras bricht, und das Zebra rennt um sein Leben. Das Herz hämmert, die Muskeln werden mit Brennstoff geflutet, die Verdauung schaltet ab. Das ist ein großartiges Notfallsystem, über Millionen Jahre perfektioniert, um eine Krise zu überleben.

Doch entscheidend ist: Wenn der Löwe aufgibt, ist es vorbei. Minuten später grast das Zebra wieder ruhig; sein Körper hat den Alarm ausgeschaltet.

##Ein Mensch kann dieselbe uralte Stressreaktion stunden- oder tagelang eingeschaltet lassen, allein durch einen Gedanken.## Das ist Sapolskys treffende Beobachtung. Wenn wir uns um Miete, eine Prüfung oder etwas in ferner Zukunft sorgen, reagiert der Körper, als flöhen wir vor einem Raubtier.

Für das Zebra ist Stress selten und kurz. Für uns ist er chronisch geworden. Was geschieht, wenn dieselbe Welle aus Adrenalin und Cortisol jeden Tag läuft und nie aufhört? Ein Körper, der sich ewig aufs Rennen vorbereitet, aber nie rennt, verschleißt langsam.

Daher kommt der Titel. Zebras bekommen keine Geschwüre, weil mit der Gefahr auch ihr Stress vergeht. Wir dagegen tragen die Gefahr weiter im Kopf herum.

$$Die Stressreaktion war für kurze Gefahren gedacht; machen wir sie mit Gedanken chronisch, zahlt der Körper die Rechnung.$$

&&War das, was heute deinen Alarm auslöste, ein echter Löwe oder nur ein Gedanke im Kopf?&&`,
      thirtySec: `In der Serengeti flieht ein Zebra vor einem Löwen, das Herz rast, die Muskeln sind voller Brennstoff; doch sobald der Löwe aufgibt, normalisiert sich binnen Minuten alles. Sapolsky zeigt, dass der Mensch dieselbe uralte Stressreaktion stundenlang eingeschaltet lässt, aus Sorge um Miete, Prüfungen oder die Zukunft. Für das Zebra ist Stress kurz; bei uns wird er chronisch, und der Körper zahlt.`,
      punch: 'Der Stress des Zebras endet mit dem Löwen; unserer läuft im Kopf weiter.',
      question: 'War das, was heute deinen Alarm auslöste, eine echte Gefahr oder nur ein Gedanke?',
      contrast: 'Kurze, akute Gefahr schützt den Körper; chronische Sorge zermürbt ihn.',
    },
  },

  // ───────────────────────── 2 ─────────────────────────
  {
    key: 'what-stress-does',
    source: 'https://www.apa.org/topics/stress/body',
    tr: {
      title: 'Bedenin Yakıtı Yanlış Yere Akınca',
      content: `Stres tepkisi aslında dâhice bir kaynak yönetimidir. Beyin tehlikeyi algıladığı an bir komut zinciri başlar: adrenalin ve kortizol salgılanır, kalp hızlanır, şeker ve yağ kana pompalanır, kaslar hazır hâle gelir.

Aynı anda beden acil olmayan her şeyi askıya alır. Sindirim yavaşlar. Büyüme durur. Üreme sistemi beklemeye geçer. Bağışıklık gücü öne çıkan tehdide yönlendirilir. Kısa bir kaçış için bu muhteşemdir; enerjinin tamamı hayatta kalmaya akar.

##Sorun, sistemin haftalarca açık kalmasıdır. O zaman aynı mekanizma korumaktan çıkıp yıkmaya başlar.## Sapolsky bunu tek tek gösterir: kronik yüksek kortizol tansiyonu yükseltir, damarları zorlar, bağışıklığı baskılar, hafızayı bozar ve mide savunmasını zayıflatır.

Yani ülser, kalp hastalığı ya da sık enfeksiyon çoğu zaman doğrudan "stresten" değil, bedeni koruyan sistemin sürekli çalışıp kaynakları yanlış yere akıtmasından doğar. Bugünkü hayatı asıl bozan tehlikeler artık aslanlar değil, bitmeyen küçük baskılardır.

Sapolsky'nin verdiği mesaj karamsar değil: Bu tepki geçici olduğunda hayat kurtarır. Mesele onu sürekli tetikte tutmamayı öğrenmektir.

$$Stres tepkisi seni öldürmez; onu asla kapatmamak öldürür.$$

&&Bedenin sürekli "acil durum" modundaysa, hangi uzun vadeli onarımları erteliyor olabilir?&&`,
      thirtySec: `Stres tepkisi zekice bir kaynak yönetimidir: adrenalin ve kortizol enerjiyi kaslara akıtır, sindirim, büyüme ve bağışıklık askıya alınır. Kısa bir kaçış için mükemmeldir. Ama Sapolsky sistem haftalarca açık kalınca aynı mekanizmanın tansiyonu yükselttiğini, bağışıklığı baskıladığını ve mideyi zayıflattığını gösterir. Hastalık çoğu zaman stresten değil, koruyucu sistemin hiç kapanmamasından doğar.`,
      punch: 'Enerjiyi kaslara akıtan sistem sürekli açık kalınca bedeni onarım için kaynaksız bırakır.',
      question: 'Bedenin sürekli acil durum modundaysa hangi onarımları erteliyor olabilir?',
      contrast: 'Kısa süreli stres kaynağı doğru yere yönlendirir; kronik stres onu tüketir.',
    },
    en: {
      title: 'When the Body Burns Fuel in the Wrong Place',
      content: `The stress response is really a brilliant act of resource management. The moment the brain senses danger, a chain of commands fires: adrenaline and cortisol pour out, the heart speeds up, sugar and fat flood the blood, the muscles stand ready.

At the same time the body suspends everything non-urgent. Digestion slows. Growth stops. The reproductive system waits. Immune power is redirected toward the immediate threat. For a brief escape this is magnificent: all the energy flows straight into survival.

##The problem is when the system stays switched on for weeks. Then the same machinery stops protecting and starts damaging.## Sapolsky lays it out case by case: chronically high cortisol raises blood pressure, strains vessels, suppresses immunity, impairs memory, and weakens the stomach's own defenses.

So ulcers, heart disease, or frequent infection usually come not straight from "stress" but from a protective system running non-stop and pouring resources into the wrong place. What wrecks modern life is no longer lions but an endless drip of small pressures.

Sapolsky's message is not grim: when this response is temporary, it saves lives. The task is learning not to keep it permanently on guard.

$$The stress response doesn't kill you; never switching it off does.$$

&&If your body is stuck in permanent emergency mode, which long-term repairs might it be postponing?&&`,
      thirtySec: `The stress response is brilliant resource management: adrenaline and cortisol pour energy into the muscles while digestion, growth and immunity are suspended. For a brief escape it is magnificent. But Sapolsky shows that when the system stays on for weeks, the same machinery raises blood pressure, suppresses immunity and weakens the stomach. Illness usually comes not from stress itself but from a protective system that never switches off.`,
      punch: 'A system that floods the muscles with fuel, left permanently on, starves the body of repair.',
      question: 'If your body stays in emergency mode, which repairs might it be postponing?',
      contrast: 'Brief stress aims resources at the right place; chronic stress drains them.',
    },
    es: {
      title: 'Cuando el cuerpo quema combustible donde no debe',
      content: `La respuesta de estrés es en realidad una brillante gestión de recursos. En cuanto el cerebro detecta peligro, se dispara una cadena de órdenes: se liberan adrenalina y cortisol, el corazón se acelera, azúcar y grasa inundan la sangre, los músculos se preparan.

Al mismo tiempo el cuerpo suspende todo lo no urgente. La digestión se frena. El crecimiento se detiene. El sistema reproductivo espera. La fuerza inmunitaria se redirige hacia la amenaza inmediata. Para una huida breve esto es magnífico: toda la energía va directa a la supervivencia.

##El problema aparece cuando el sistema queda encendido durante semanas. Entonces la misma maquinaria deja de proteger y empieza a dañar.## Sapolsky lo detalla caso por caso: un cortisol crónicamente alto sube la tensión, fuerza los vasos, suprime la inmunidad, deteriora la memoria y debilita las defensas del estómago.

Así, la úlcera, la enfermedad cardíaca o las infecciones frecuentes no vienen directamente del "estrés", sino de un sistema protector que funciona sin parar y vierte recursos donde no debe. Lo que daña la vida moderna ya no son los leones, sino un goteo interminable de pequeñas presiones.

El mensaje de Sapolsky no es sombrío: cuando esta respuesta es temporal, salva vidas. La tarea es aprender a no mantenerla en guardia permanente.

$$La respuesta de estrés no te mata; lo que mata es no apagarla nunca.$$

&&Si tu cuerpo vive en emergencia permanente, ¿qué reparaciones a largo plazo podría estar aplazando?&&`,
      thirtySec: `La respuesta de estrés es una brillante gestión de recursos: adrenalina y cortisol vierten energía en los músculos mientras se suspenden digestión, crecimiento e inmunidad. Para una huida breve es magnífica. Pero Sapolsky muestra que si el sistema queda encendido semanas, esa misma maquinaria sube la tensión, suprime la inmunidad y debilita el estómago. La enfermedad no viene del estrés, sino de un sistema protector que nunca se apaga.`,
      punch: 'Un sistema que inunda de combustible los músculos, si no se apaga, deja al cuerpo sin reparación.',
      question: 'Si tu cuerpo vive en emergencia, ¿qué reparaciones podría estar aplazando?',
      contrast: 'El estrés breve dirige los recursos bien; el crónico los agota.',
    },
    de: {
      title: 'Wenn der Körper Brennstoff am falschen Ort verbrennt',
      content: `Die Stressreaktion ist eigentlich ein geniales Ressourcenmanagement. Sobald das Gehirn Gefahr wittert, feuert eine Befehlskette: Adrenalin und Cortisol strömen aus, das Herz beschleunigt, Zucker und Fett fluten das Blut, die Muskeln stehen bereit.

Zugleich stellt der Körper alles Unwichtige zurück. Die Verdauung verlangsamt sich. Das Wachstum stoppt. Das Fortpflanzungssystem wartet. Die Immunkraft wird auf die akute Bedrohung gelenkt. Für eine kurze Flucht ist das großartig: Alle Energie fließt direkt ins Überleben.

##Das Problem entsteht, wenn das System wochenlang eingeschaltet bleibt. Dann schützt dieselbe Maschinerie nicht mehr, sondern schadet.## Sapolsky zeigt es Fall für Fall: chronisch hohes Cortisol steigert den Blutdruck, belastet die Gefäße, unterdrückt die Immunabwehr, schwächt das Gedächtnis und die Schutzschicht des Magens.

So kommen Geschwüre, Herzkrankheit oder häufige Infekte meist nicht direkt vom "Stress", sondern von einem Schutzsystem, das ununterbrochen läuft und Ressourcen an den falschen Ort schüttet. Was das moderne Leben ruiniert, sind keine Löwen mehr, sondern ein endloses Tröpfeln kleiner Belastungen.

Sapolskys Botschaft ist nicht düster: Ist diese Reaktion vorübergehend, rettet sie Leben. Die Aufgabe ist, sie nicht dauerhaft in Alarmbereitschaft zu halten.

$$Die Stressreaktion tötet dich nicht; sie nie abzuschalten tötet dich.$$

&&Wenn dein Körper im Dauer-Notfallmodus steckt, welche langfristigen Reparaturen schiebt er womöglich auf?&&`,
      thirtySec: `Die Stressreaktion ist geniales Ressourcenmanagement: Adrenalin und Cortisol pumpen Energie in die Muskeln, während Verdauung, Wachstum und Immunabwehr pausieren. Für eine kurze Flucht ist sie großartig. Doch Sapolsky zeigt: Bleibt das System wochenlang an, steigert dieselbe Maschinerie den Blutdruck, unterdrückt die Abwehr und schwächt den Magen. Krankheit kommt nicht vom Stress, sondern von einem Schutzsystem, das nie abschaltet.`,
      punch: 'Ein System, das die Muskeln flutet, lässt den Körper ohne Reparatur, wenn es nie abschaltet.',
      question: 'Wenn dein Körper im Notfallmodus bleibt, welche Reparaturen schiebt er auf?',
      contrast: 'Kurzer Stress lenkt Ressourcen richtig; chronischer Stress erschöpft sie.',
    },
  },

  // ───────────────────────── 3 ─────────────────────────
  {
    key: 'baboon-rank',
    source: 'https://journals.plos.org/plosbiology/article?id=10.1371/journal.pbio.0020106',
    tr: {
      title: "Serengeti'de Bir Pavyan Sürüsü",
      content: `Sapolsky sıradan bir laboratuvar bilimcisi değildi. Otuz yılın yazlarını Doğu Afrika'da, vahşi pavyanlar arasında geçirdi. Nedeni basitti: bu maymunlar, tıpkı insanlar gibi, günün büyük kısmını fiziksel tehlikeyle değil, birbirleriyle uğraşarak geçirir. Yani stresleri sosyaldir.

Sürüde kim kimi ittiriyor, kim kime yem kaptırıyor, kim kimden korkuyor — tüm bunları izledi ve aynı anda hayvanların kanındaki stres hormonlarını ölçtü.

##Bulgu netti: Hiyerarşinin dibindeki pavyanlar, hiçbir aslan onları kovalamasa da dinlenirken bile daha yüksek kortizol taşıyordu.## Sürekli tetikte olmak, taciz edilmek ve kontrolün başkasında olması bedene bir bedel yazıyordu; yüksek tansiyon ve baskılanmış bağışıklık gibi.

Ama Sapolsky basit bir "alttakiler hep kaybeder" tablosu çizmedi. Asıl belirleyici olan salt rütbe değil, o rütbenin nasıl yaşandığıydı: Sürü istikrarlı mı yoksa kaotik mi, bireyin dostları var mı, gerginliğini boşaltacak bir yolu var mı.

Aynı sosyal basınç iki pavyanı çok farklı etkileyebiliyordu. Ders insan için de aynı: Bizi yıpratan çoğu zaman olayın kendisi değil, o olay içindeki yerimizi nasıl deneyimlediğimizdir.

$$Sağlığı belirleyen çoğu zaman hiyerarşideki yerin değil, o yeri nasıl yaşadığındır.$$

&&Kendi "süründe" gerginliğini boşaltabildiğin ve güvendiğin biri var mı?&&`,
      thirtySec: `Sapolsky otuz yılın yazlarını vahşi pavyanlar arasında geçirdi, çünkü onların stresi de insanınki gibi sosyaldir. Sürüdeki ilişkileri izleyip kan hormonlarını ölçtü. Hiyerarşinin dibindeki pavyanlar, hiçbir tehlike yokken dinlenirken bile daha yüksek kortizol taşıyordu. Ama belirleyici olan salt rütbe değil, o rütbenin nasıl yaşandığıydı; istikrar, dostluk ve boşalma yolu her şeyi değiştiriyordu.`,
      punch: 'Alttaki pavyanlar tehlike yokken bile daha yüksek stres hormonu taşıyordu.',
      question: 'Kendi çevrende gerginliğini boşaltabildiğin ve güvendiğin biri var mı?',
      contrast: 'Rütbenin kendisi değil, o rütbeyi nasıl yaşadığın sağlığı belirler.',
    },
    en: {
      title: 'A Troop of Baboons on the Serengeti',
      content: `Sapolsky was no ordinary lab scientist. He spent the summers of thirty years in East Africa, living among wild baboons. The reason was simple: like humans, these primates spend most of the day not fleeing physical danger but dealing with each other. Their stress is social.

He watched who shoved whom, who stole whose food, who feared whom, and at the same time measured the stress hormones in their blood.

##The finding was clear: baboons at the bottom of the hierarchy carried higher cortisol even while resting, with no lion anywhere in sight.## Being permanently on guard, being harassed, having control rest with someone else, all wrote a bill on the body: higher blood pressure, suppressed immunity.

But Sapolsky did not paint a simple picture of "the low-ranking always lose." What really mattered was not rank alone but how that rank was lived: whether the troop was stable or chaotic, whether the individual had allies, whether there was any outlet for frustration.

The same social pressure could affect two baboons very differently. The lesson holds for us too: what wears us down is often not the event itself but how we experience our place within it.

$$Health is shaped less by your rank in the hierarchy than by how you live that rank.$$

&&In your own "troop," is there someone you trust and with whom you can vent your tension?&&`,
      thirtySec: `Sapolsky spent thirty summers among wild baboons, because their stress, like ours, is social. He tracked who dominated whom and measured the hormones in their blood. Baboons at the bottom of the hierarchy carried higher cortisol even at rest, with no predator in sight. Yet what mattered was not rank alone but how it was lived; stability, allies and an outlet for frustration changed everything.`,
      punch: 'Low-ranking baboons carried higher stress hormones even with no danger present.',
      question: 'In your own circle, is there someone you trust and can vent your tension to?',
      contrast: 'Not rank itself but how you live that rank shapes your health.',
    },
    es: {
      title: 'Una tropa de babuinos en el Serengeti',
      content: `Sapolsky no era un científico de laboratorio corriente. Pasó los veranos de treinta años en África Oriental, viviendo entre babuinos salvajes. La razón era simple: como los humanos, estos primates dedican la mayor parte del día no a huir del peligro físico, sino a lidiar entre ellos. Su estrés es social.

Observó quién empujaba a quién, quién robaba la comida de quién, quién temía a quién, y a la vez medía las hormonas del estrés en su sangre.

##El hallazgo fue claro: los babuinos del fondo de la jerarquía tenían más cortisol incluso en reposo, sin ningún león a la vista.## Estar siempre en guardia, ser acosado, que el control esté en manos ajenas, todo le pasaba factura al cuerpo: más tensión arterial, inmunidad suprimida.

Pero Sapolsky no dibujó un cuadro simple de "los de abajo siempre pierden". Lo decisivo no era el rango en sí, sino cómo se vivía ese rango: si la tropa era estable o caótica, si el individuo tenía aliados, si había alguna salida para la frustración.

La misma presión social podía afectar a dos babuinos de forma muy distinta. La lección vale también para nosotros: lo que nos desgasta no suele ser el hecho, sino cómo vivimos nuestro lugar dentro de él.

$$La salud depende menos de tu rango en la jerarquía que de cómo vives ese rango.$$

&&En tu propia "tropa", ¿hay alguien de confianza con quien puedas descargar la tensión?&&`,
      thirtySec: `Sapolsky pasó treinta veranos entre babuinos salvajes, porque su estrés, como el nuestro, es social. Observó quién dominaba a quién y midió las hormonas en su sangre. Los babuinos del fondo de la jerarquía tenían más cortisol incluso en reposo, sin depredador a la vista. Pero lo decisivo no era el rango, sino cómo se vivía; la estabilidad, los aliados y una salida para la frustración lo cambiaban todo.`,
      punch: 'Los babuinos de bajo rango tenían más hormonas de estrés incluso sin peligro.',
      question: 'En tu círculo, ¿hay alguien de confianza con quien descargar la tensión?',
      contrast: 'No el rango en sí, sino cómo lo vives, define tu salud.',
    },
    de: {
      title: 'Eine Pavianhorde in der Serengeti',
      content: `Sapolsky war kein gewöhnlicher Laborwissenschaftler. Er verbrachte die Sommer von dreißig Jahren in Ostafrika, mitten unter wilden Pavianen. Der Grund war einfach: Wie Menschen verbringen diese Primaten den größten Teil des Tages nicht mit der Flucht vor körperlicher Gefahr, sondern miteinander. Ihr Stress ist sozial.

Er beobachtete, wer wen wegstieß, wer wem das Futter raubte, wer wen fürchtete, und maß zugleich die Stresshormone in ihrem Blut.

##Der Befund war eindeutig: Paviane am unteren Ende der Hierarchie trugen selbst in Ruhe höheres Cortisol, ohne dass ein Löwe in Sicht war.## Ständig auf der Hut zu sein, schikaniert zu werden, die Kontrolle bei anderen zu wissen, all das schrieb dem Körper eine Rechnung: höherer Blutdruck, geschwächte Abwehr.

Doch Sapolsky zeichnete kein simples Bild von "die Rangniedrigen verlieren immer". Entscheidend war nicht der Rang allein, sondern wie er gelebt wurde: ob die Horde stabil oder chaotisch war, ob das Tier Verbündete hatte, ob es ein Ventil für Frust gab.

Derselbe soziale Druck konnte zwei Paviane völlig unterschiedlich treffen. Die Lehre gilt auch für uns: Was uns zermürbt, ist oft nicht das Ereignis, sondern wie wir unseren Platz darin erleben.

$$Gesundheit hängt weniger vom Rang in der Hierarchie ab als davon, wie du diesen Rang lebst.$$

&&Gibt es in deiner eigenen "Horde" jemanden, dem du vertraust und bei dem du Spannung ablassen kannst?&&`,
      thirtySec: `Sapolsky verbrachte dreißig Sommer unter wilden Pavianen, weil ihr Stress wie unserer sozial ist. Er beobachtete, wer wen dominierte, und maß die Hormone im Blut. Paviane am unteren Ende der Hierarchie trugen selbst in Ruhe höheres Cortisol, ohne Raubtier in Sicht. Doch entscheidend war nicht der Rang, sondern wie er gelebt wurde; Stabilität, Verbündete und ein Ventil für Frust änderten alles.`,
      punch: 'Rangniedrige Paviane trugen selbst ohne Gefahr höhere Stresshormone.',
      question: 'Gibt es in deinem Umfeld jemanden, dem du vertraust und bei dem du Spannung ablässt?',
      contrast: 'Nicht der Rang selbst, sondern wie du ihn lebst, prägt die Gesundheit.',
    },
  },

  // ───────────────────────── 4 ─────────────────────────
  {
    key: 'control-and-predictability',
    source: 'https://www.apa.org/topics/stress',
    tr: {
      title: 'Aynı Elektrik, İki Farklı Sıçan',
      content: `Klasik bir deney düşün. İki sıçana tıpatıp aynı hafif elektrik şoku, aynı sıklıkta veriliyor. Fiziksel olarak yaşadıkları birebir aynı. Ama aralarında tek bir fark var.

Birinci sıçan, şok gelmeden önce kısa bir uyarı sesi duyuyor; ne zaman geleceğini biliyor. İkincisi ise hiçbir uyarı almıyor; şok her an, rastgele gelebilir.

##Sonuç şaşırtıcıdır: Ne zaman geleceğini bilen sıçan çok daha az ülser geliştirir. Stresi belirleyen tek başına şok değil, öngörülemezliktir.## Sapolsky bu tür deneyleri üst üste koyarak gösterir ki bedenin stres yükünü aynı olay değil, o olayın etrafındaki psikolojik koşullar belirler.

Dört şey her şeyi değiştirir: öngörülebilirlik, kontrol duygusu, gerginliği boşaltacak bir çıkış ve durumun daha kötüye değil iyiye gittiği hissi. Bir sıçana çevirebileceği bir tekerlek verin ya da bir insana "işini ne zaman yapacağına sen karar ver" deyin; aynı yük çok daha az yıpratıcı hâle gelir.

İşte bu yüzden trafikte sıkışmak ile maraton koşmak bedene bambaşka gelir; ikisinde de kalp hızlanır ama yalnızca birinde kontrol sendedir.

$$Bir olayın seni ne kadar yıprattığını çoğu zaman olay değil, ne kadar öngörebildiğin ve kontrol edebildiğin belirler.$$

&&Seni en çok yoran durumda gerçekten çaresiz misin, yoksa küçük bir kontrol alanı yaratabilir misin?&&`,
      thirtySec: `İki sıçana aynı elektrik şoku veriliyor; tek fark, birinin şoku önceden haber alması. Sonuç çarpıcı: ne zaman geleceğini bilen sıçan çok daha az ülser geliştirir. Sapolsky bununla gösterir ki stresi belirleyen olayın kendisi değil, öngörülebilirlik, kontrol duygusu ve boşalma yoludur. Bu yüzden trafik ile maraton bedene bambaşka gelir; ikisinde de kalp hızlanır ama kontrol farklıdır.`,
      punch: 'Aynı şok, önceden haber verilince çok daha az ülser yapar.',
      question: 'Seni en çok yoran durumda çaresiz misin, yoksa küçük bir kontrol alanı yaratabilir misin?',
      contrast: 'Olayın kendisi değil, öngörülebilirliği ve kontrolü stresi belirler.',
    },
    en: {
      title: 'The Same Shock, Two Different Rats',
      content: `Picture a classic experiment. Two rats receive exactly the same mild electric shock, at exactly the same frequency. What their bodies undergo is physically identical. But there is one difference between them.

The first rat hears a short warning tone before each shock; it knows when the shock is coming. The second gets no warning at all; the shock can strike at any moment, at random.

##The result is striking: the rat that knows when the shock is coming develops far fewer ulcers. What drives stress is not the shock alone but its unpredictability.## Stacking such experiments together, Sapolsky shows that the body's stress load is set not by the event itself but by the psychological conditions around it.

Four things change everything: predictability, a sense of control, an outlet for frustration, and the feeling that things are getting better rather than worse. Give a rat a wheel it can turn, or tell a person "you decide when to do the task," and the same load becomes far less corrosive.

That is why sitting in traffic and running a marathon feel utterly different to the body; in both the heart races, but only in one are you in control.

$$How much an event wears you down is usually set not by the event but by how much you can predict and control it.$$

&&In the situation that drains you most, are you truly helpless, or could you carve out a small zone of control?&&`,
      thirtySec: `Two rats receive the same electric shock; the only difference is that one hears a warning first. The result is striking: the rat that knows when the shock is coming develops far fewer ulcers. Sapolsky uses this to show that stress is driven not by the event but by predictability, a sense of control and an outlet. That is why traffic and a marathon feel utterly different, though in both the heart races.`,
      punch: 'The same shock, when it is announced in advance, causes far fewer ulcers.',
      question: 'In the situation that drains you most, are you helpless, or could you carve out some control?',
      contrast: 'Not the event itself but its predictability and control set the stress.',
    },
    es: {
      title: 'La misma descarga, dos ratas distintas',
      content: `Imagina un experimento clásico. Dos ratas reciben exactamente la misma descarga eléctrica leve, con la misma frecuencia. Lo que viven sus cuerpos es físicamente idéntico. Pero hay una diferencia entre ellas.

La primera oye un breve tono de aviso antes de cada descarga; sabe cuándo llega. La segunda no recibe aviso alguno; la descarga puede golpear en cualquier momento, al azar.

##El resultado es sorprendente: la rata que sabe cuándo llega la descarga desarrolla muchas menos úlceras. Lo que impulsa el estrés no es la descarga, sino su imprevisibilidad.## Al apilar experimentos así, Sapolsky muestra que la carga de estrés del cuerpo no la fija el suceso, sino las condiciones psicológicas que lo rodean.

Cuatro cosas lo cambian todo: previsibilidad, sensación de control, una salida para la frustración y la sensación de que las cosas mejoran en vez de empeorar. Dale a una rata una rueda que pueda girar, o dile a una persona "decide tú cuándo hacer la tarea", y la misma carga se vuelve mucho menos corrosiva.

Por eso estar en un atasco y correr un maratón le resultan al cuerpo del todo distintos; en ambos se acelera el corazón, pero solo en uno tienes el control.

$$Cuánto te desgasta un suceso lo fija casi siempre no el suceso, sino cuánto puedes preverlo y controlarlo.$$

&&En la situación que más te agota, ¿estás de verdad indefenso o podrías crear una pequeña zona de control?&&`,
      thirtySec: `Dos ratas reciben la misma descarga eléctrica; la única diferencia es que una oye un aviso antes. El resultado sorprende: la rata que sabe cuándo llega desarrolla muchas menos úlceras. Sapolsky lo usa para mostrar que el estrés no lo impulsa el suceso, sino la previsibilidad, el control y una salida. Por eso un atasco y un maratón se sienten distintos, aunque en ambos se acelere el corazón.`,
      punch: 'La misma descarga, si se anuncia antes, causa muchas menos úlceras.',
      question: 'En la situación que más te agota, ¿estás indefenso o podrías crear algo de control?',
      contrast: 'No el suceso en sí, sino su previsibilidad y control fijan el estrés.',
    },
    de: {
      title: 'Derselbe Schock, zwei verschiedene Ratten',
      content: `Stell dir ein klassisches Experiment vor. Zwei Ratten erhalten genau denselben leichten Elektroschock, in genau derselben Häufigkeit. Was ihre Körper erleben, ist physisch identisch. Aber es gibt einen Unterschied zwischen ihnen.

Die erste Ratte hört vor jedem Schock einen kurzen Warnton; sie weiß, wann er kommt. Die zweite bekommt keine Warnung; der Schock kann jederzeit zufällig zuschlagen.

##Das Ergebnis ist verblüffend: Die Ratte, die weiß, wann der Schock kommt, entwickelt weit weniger Geschwüre. Was Stress treibt, ist nicht der Schock allein, sondern seine Unvorhersehbarkeit.## Indem er solche Experimente aufeinanderlegt, zeigt Sapolsky, dass die Stresslast des Körpers nicht vom Ereignis selbst bestimmt wird, sondern von den psychischen Bedingungen darum herum.

Vier Dinge ändern alles: Vorhersehbarkeit, ein Gefühl von Kontrolle, ein Ventil für Frust und das Gefühl, dass es besser wird statt schlechter. Gib einer Ratte ein Rad, das sie drehen kann, oder sag einem Menschen "entscheide selbst, wann du die Aufgabe machst", und dieselbe Last wird weit weniger zermürbend.

Darum fühlen sich ein Stau und ein Marathon für den Körper völlig verschieden an; in beiden rast das Herz, doch nur in einem hast du die Kontrolle.

$$Wie sehr ein Ereignis dich zermürbt, bestimmt meist nicht das Ereignis, sondern wie sehr du es vorhersehen und steuern kannst.$$

&&Bist du in der Lage, die dich am meisten auslaugt, wirklich hilflos, oder könntest du dir eine kleine Zone der Kontrolle schaffen?&&`,
      thirtySec: `Zwei Ratten erhalten denselben Elektroschock; der einzige Unterschied ist, dass eine vorher einen Warnton hört. Das Ergebnis verblüfft: Die Ratte, die weiß, wann der Schock kommt, entwickelt weit weniger Geschwüre. Sapolsky zeigt damit, dass Stress nicht vom Ereignis getrieben wird, sondern von Vorhersehbarkeit, Kontrolle und einem Ventil. Darum fühlen sich Stau und Marathon völlig verschieden an, obwohl in beiden das Herz rast.`,
      punch: 'Derselbe Schock verursacht weit weniger Geschwüre, wenn er vorher angekündigt wird.',
      question: 'Bist du in der Lage, die dich auslaugt, hilflos, oder könntest du dir etwas Kontrolle schaffen?',
      contrast: 'Nicht das Ereignis, sondern seine Vorhersehbarkeit und Kontrolle bestimmen den Stress.',
    },
  },

  // ───────────────────────── 5 ─────────────────────────
  {
    key: 'forest-troop',
    source: 'https://journals.plos.org/plosbiology/article?id=10.1371/journal.pbio.0020106',
    tr: {
      title: 'Barışı Öğrenen Sürü',
      content: `Sapolsky yıllarca "Orman Sürüsü" adını verdiği bir pavyan grubunu izledi. Her sürü gibi burayı da en agresif, en kabadayı erkekler yönetiyordu; alttakilere hayatı dar ediyorlardı.

Sonra beklenmedik bir şey oldu. Sürünün en saldırgan erkekleri, komşu bir turist lokantasının çöplüğünden bulaşan hastalıklı etle beslenip tüberkülozdan topluca öldü. Geriye daha yumuşak huylu erkekler ve dişiler kaldı.

##Sürünün kültürü değişti: Daha az zorbalık, daha çok tımarlaşma, gerginlik yerine yakınlık. Ve en çarpıcısı, bu barışçıl kültür yıllarca, hatta yeni erkekler dışarıdan katıldıktan sonra bile sürdü.## Dışarıdan gelen sert erkekler bile birkaç ay içinde sürünün sakin tarzını öğreniyordu.

Ölçümler bunu doğruladı: alttaki bireyler artık çok daha düşük stres hormonları taşıyordu; beden yükten kurtulmuştu.

Sapolsky'nin bundan çıkardığı sonuç kitabın en umut veren mesajıdır: Stres kültürü, biyolojik bir kader değildir. Bir grup, hatta bir birey, tepki verme biçimini değiştirebilir — ve bu değişim bedene kadar iner.

$$Stres tepkimiz sabit bir yazgı değildir; bir topluluğun kültürü gibi, o da yeniden öğrenilebilir.$$

&&İçinde bulunduğun grupta gerginliği azaltan bir alışkanlığı sen başlatabilir misin?&&`,
      thirtySec: `Sapolsky "Orman Sürüsü" adlı pavyan grubunu izledi; onu en agresif erkekler yönetiyordu. Bu erkekler bir çöplükten bulaşan tüberkülozdan topluca ölünce, geriye yumuşak huylu bireyler kaldı ve sürünün kültürü kalıcı biçimde barışçıllaştı; dışarıdan gelen sert erkekler bile bu tarzı öğreniyordu. Alttakilerin stres hormonları düştü. Ders: stres kültürü kader değildir, yeniden öğrenilebilir.`,
      punch: 'En agresif erkekler ölünce sürünün kültürü kalıcı biçimde barışçıllaştı.',
      question: 'İçinde bulunduğun grupta gerginliği azaltan bir alışkanlığı sen başlatabilir misin?',
      contrast: 'Stres tepkisi sabit bir biyoloji değil, değiştirilebilir bir kültürdür.',
    },
    en: {
      title: 'The Troop That Learned Peace',
      content: `For years Sapolsky watched a group of baboons he called the Forest Troop. Like any troop, it was ruled by the most aggressive, most bullying males, who made life miserable for those below them.

Then something unexpected happened. The most aggressive males fed on diseased meat from the garbage dump of a nearby tourist lodge and died together of tuberculosis. What remained were the gentler males and the females.

##The troop's culture changed: less bullying, more grooming, closeness instead of tension. Most striking of all, this peaceful culture lasted for years, even after new males arrived from outside.## Even harsh newcomers learned the troop's calmer style within a few months.

The measurements confirmed it: the low-ranking individuals now carried far lower stress hormones; the body had been relieved of its load.

The conclusion Sapolsky drew is the most hopeful message in the book: a culture of stress is not a biological fate. A group, and even an individual, can change how it responds, and that change reaches all the way down into the body.

$$Our stress response is not a fixed destiny; like a community's culture, it can be relearned.$$

&&In the group you belong to, could you be the one to start a habit that lowers the tension?&&`,
      thirtySec: `Sapolsky watched a baboon group he called the Forest Troop, ruled by the most aggressive males. When those males died together of tuberculosis from a garbage dump, gentler individuals remained and the troop's culture turned lastingly peaceful; even harsh newcomers learned the calmer style. The low-ranking baboons' stress hormones fell. The lesson: a culture of stress is not fate, it can be relearned.`,
      punch: "When the most aggressive males died, the troop's culture turned lastingly peaceful.",
      question: 'In your group, could you start a habit that lowers the tension?',
      contrast: 'The stress response is not fixed biology but a culture that can change.',
    },
    es: {
      title: 'La tropa que aprendió la paz',
      content: `Durante años Sapolsky observó un grupo de babuinos al que llamó la Tropa del Bosque. Como cualquier tropa, la gobernaban los machos más agresivos y matones, que amargaban la vida a los de abajo.

Entonces ocurrió algo inesperado. Los machos más agresivos comieron carne enferma del basurero de un albergue turístico cercano y murieron juntos de tuberculosis. Quedaron los machos más apacibles y las hembras.

##La cultura de la tropa cambió: menos abusos, más acicalamiento, cercanía en lugar de tensión. Y lo más asombroso: esa cultura pacífica se mantuvo durante años, incluso tras la llegada de machos nuevos de fuera.## Hasta los recién llegados más ásperos aprendían el estilo más calmado de la tropa en pocos meses.

Las mediciones lo confirmaron: los individuos de bajo rango ahora tenían hormonas de estrés mucho más bajas; el cuerpo se había librado de la carga.

La conclusión de Sapolsky es el mensaje más esperanzador del libro: una cultura de estrés no es un destino biológico. Un grupo, e incluso un individuo, puede cambiar cómo responde, y ese cambio llega hasta el cuerpo.

$$Nuestra respuesta de estrés no es un destino fijo; como la cultura de una comunidad, puede reaprenderse.$$

&&En el grupo al que perteneces, ¿podrías ser tú quien inicie un hábito que baje la tensión?&&`,
      thirtySec: `Sapolsky observó un grupo de babuinos, la Tropa del Bosque, gobernado por los machos más agresivos. Cuando esos machos murieron juntos de tuberculosis por un basurero, quedaron individuos apacibles y la cultura de la tropa se volvió pacífica de forma duradera; hasta los recién llegados ásperos aprendían el estilo calmado. Las hormonas de estrés de los de bajo rango bajaron. La lección: la cultura de estrés no es destino, puede reaprenderse.`,
      punch: 'Al morir los machos más agresivos, la cultura de la tropa se volvió pacífica de forma duradera.',
      question: 'En tu grupo, ¿podrías iniciar tú un hábito que baje la tensión?',
      contrast: 'La respuesta de estrés no es biología fija, sino una cultura que puede cambiar.',
    },
    de: {
      title: 'Die Horde, die den Frieden lernte',
      content: `Jahrelang beobachtete Sapolsky eine Pavianhorde, die er die Waldhorde nannte. Wie jede Horde wurde sie von den aggressivsten, tyrannischsten Männchen beherrscht, die den Rangniedrigen das Leben schwer machten.

Dann geschah etwas Unerwartetes. Die aggressivsten Männchen fraßen verdorbenes Fleisch aus dem Müll einer nahen Touristenlodge und starben gemeinsam an Tuberkulose. Übrig blieben die sanfteren Männchen und die Weibchen.

##Die Kultur der Horde änderte sich: weniger Schikane, mehr Fellpflege, Nähe statt Spannung. Am erstaunlichsten: Diese friedliche Kultur hielt jahrelang, sogar nachdem neue Männchen von außen dazukamen.## Selbst raue Neuankömmlinge lernten den ruhigeren Stil der Horde binnen weniger Monate.

Die Messungen bestätigten es: Die rangniedrigen Tiere trugen nun weit geringere Stresshormone; der Körper war von seiner Last befreit.

Sapolskys Schluss ist die hoffnungsvollste Botschaft des Buches: Eine Kultur des Stresses ist kein biologisches Schicksal. Eine Gruppe, ja sogar ein Einzelner, kann ändern, wie sie reagiert, und diese Änderung reicht bis in den Körper hinein.

$$Unsere Stressreaktion ist kein festes Schicksal; wie die Kultur einer Gemeinschaft lässt sie sich neu erlernen.$$

&&Könntest du in deiner Gruppe derjenige sein, der eine Gewohnheit beginnt, die die Spannung senkt?&&`,
      thirtySec: `Sapolsky beobachtete eine Pavianhorde, die Waldhorde, beherrscht von den aggressivsten Männchen. Als diese gemeinsam an Tuberkulose aus einem Müllplatz starben, blieben sanftere Tiere, und die Kultur der Horde wurde dauerhaft friedlich; selbst raue Neuankömmlinge lernten den ruhigeren Stil. Die Stresshormone der Rangniedrigen sanken. Die Lehre: Eine Kultur des Stresses ist kein Schicksal, sie lässt sich neu erlernen.`,
      punch: 'Als die aggressivsten Männchen starben, wurde die Kultur der Horde dauerhaft friedlich.',
      question: 'Könntest du in deiner Gruppe eine Gewohnheit beginnen, die die Spannung senkt?',
      contrast: 'Die Stressreaktion ist keine feste Biologie, sondern eine veränderbare Kultur.',
    },
  },
];

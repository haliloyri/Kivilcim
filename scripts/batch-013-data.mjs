// Batch 013 — The Intelligent Investor (Benjamin Graham) · "Bay Piyasa"
// Version F7 — zengin okuma formatı.
// F5'teki hikâye (Bay Piyasa ile Ortaklık) daha ilgi çekici bir okuma akışına uyarlandı.
//
// Yeni işaretler (yalnızca F7+ okuma ekranında zengin render edilir):
//   ##vurgu##            → alıntı kutusu (mevcut)
//   ~~önce :: sonra~~    → iki sütunlu zıtlık bloğu (YENİ)
//   $$ders$$             → görünür "Çıkarım" kartı (F7+; eski sürümlerde gizli)
//   &&soru&&             → dokunulabilir "Düşün" kutusu (F7+; eski sürümlerde gizli)
//
// Her dil bağımsız yazıldı; çeviri kullanılmadı.

export const book = {
  listNo: 268, // The Intelligent Investor — F5'te zaten eklenmişti
  catalogNo: 266,
  categoryId: 1, // Finans
  year: '1949',
  title: 'The Intelligent Investor',
  author: 'Benjamin Graham',
};

// Tek hikâye (F5 muadilinin zengin uyarlaması). storyKey ile F5'ten ayrışır.
export const stories = [
  {
    key: 'mr-market-rich',
    source: 'https://www.britannica.com/money/Benjamin-Graham',
    tr: {
      title: 'Kapını Her Sabah Çalan Ortak',
      content: `Bir işi yarı yarıya bir ortakla kurduğunu düşün. Adı Bay Piyasa. Diğer ortaklardan tek farkı var: her sabah kapını çalar ve elindeki payı ya senden almak ya da sana satmak için bir fiyat söyler.

Sorun şu ki Bay Piyasa'nın ruh hali dengesizdir. Bazı sabahlar geleceğe dair coşkuyla dolar ve fahiş bir fiyat teklif eder. Başka sabahlar paniğe kapılır, her şeyin batacağını sanır ve aynı payı yok pahasına elden çıkarmaya çalışır.

##Bay Piyasa'nın sana söylediği fiyat, işin gerçek değerini değil, o günkü ruh halini yansıtır.##

İşte Benjamin Graham'ın 1949'da yatırımcılara öğrettiği kritik ayrım budur. Çünkü bir hissenin iki ayrı yüzü vardır ve onları karıştırmak en pahalı hatadır:

~~Fiyat: Bay Piyasa'nın her sabah bağırdığı, duygularıyla zıplayan rakam. :: Değer: İşletmenin gerçekte ne kazandığı; yavaş, sabırlı, kolay kolay değişmeyen gerçek.~~

Graham'ın vurgusu nettir: bu ortağa itaat etmek zorunda değilsin. Teklifini duymazdan gelebilirsin. Ama fiyat gerçek değerin çok altına düştüğünde, işte o zaman Bay Piyasa'nın paniği senin fırsatına dönüşür. Warren Buffett dahil kuşaklar boyu yatırımcı bunu tam da bu benzetmeden öğrendi.

$$Piyasa sana hizmet etmek için vardır, sana yol göstermek için değil; fiyatı sat, değeri satın al.$$

&&Son yatırım kararında işin değerini mi incelemiştin, yoksa o günkü kalabalığın ruh halini mi satın almıştın?&&`,
      thirtySec: `Benjamin Graham yatırımcılara Bay Piyasa'yı hayal ettirir: her sabah kapını çalıp bir fiyat söyleyen dengesiz bir ortak. Bazı gün coşkuyla fahiş fiyat verir, bazı gün panikle her şeyi yok pahasına satmak ister. Verdiği rakam işin değerini değil ruh halini yansıtır. Ders: fiyat duygularla zıplar, değer sabittir; panik anını fırsata çevir.`,
      punch: 'Piyasa sana hizmet etsin diye vardır, yol göstersin diye değil.',
      question: 'Son yatırım kararında değeri mi incelemiştin, kalabalığın ruh halini mi satın almıştın?',
      contrast: 'Fiyat her sabah değişir; değer öyle kolay değişmez.',
    },
    en: {
      title: 'The Partner Who Knocks Every Morning',
      content: `Imagine you built a business fifty-fifty with a partner named Mr. Market. He differs from other partners in just one way: every single morning he knocks on your door and names a price, either to buy your share or to sell you his.

The trouble is that Mr. Market is emotionally unstable. On some mornings he brims with optimism about the future and quotes an absurdly high price. On others he panics, convinced everything is about to collapse, and begs to dump the very same share for almost nothing.

##The price Mr. Market quotes reflects not the true worth of the business but his mood that day.##

This is the crucial distinction Benjamin Graham taught investors in 1949. A share has two separate faces, and confusing them is the most expensive mistake there is:

~~Price: the number Mr. Market shouts each morning, jumping around with his emotions. :: Value: what the business actually earns; slow, patient, and not easily changed.~~

Graham's point is clear: you owe this partner no obedience. You can ignore his offer entirely. But when the price falls far below real value, that is when Mr. Market's panic becomes your opportunity. Generations of investors, Warren Buffett among them, learned exactly this from the parable.

$$The market exists to serve you, not to instruct you; sell the price, buy the value.$$

&&When you last invested, were you weighing the value of a business, or buying the crowd's mood of the day?&&`,
      thirtySec: `Benjamin Graham asks investors to imagine Mr. Market: an unstable partner who knocks every morning and names a price. Some days he quotes absurdly high in euphoria, other days he panics and begs to sell for almost nothing. His number reflects his mood, not the value of the business. The lesson: price jumps with emotion, value stays steady; turn his panic into your opportunity.`,
      punch: 'The market is there to serve you, not to instruct you.',
      question: 'When you last invested, were you weighing value, or buying the crowd\'s mood?',
      contrast: 'Price changes every morning; value does not.',
    },
    es: {
      title: 'El socio que llama cada mañana',
      content: `Imagina que montaste un negocio al cincuenta por ciento con un socio llamado Señor Mercado. Se distingue de los demás en una sola cosa: cada mañana llama a tu puerta y dice un precio, para comprarte tu parte o venderte la suya.

El problema es que el Señor Mercado es emocionalmente inestable. Algunas mañanas rebosa optimismo sobre el futuro y ofrece un precio disparatadamente alto. Otras entra en pánico, convencido de que todo va a hundirse, y suplica deshacerse de esa misma parte por casi nada.

##El precio que dice el Señor Mercado no refleja el valor real del negocio, sino su humor de ese día.##

Esta es la distinción crucial que Benjamin Graham enseñó a los inversores en 1949. Una acción tiene dos caras distintas, y confundirlas es el error más caro que existe:

~~Precio: el número que el Señor Mercado grita cada mañana, saltando con sus emociones. :: Valor: lo que el negocio gana de verdad; lento, paciente y difícil de alterar.~~

El punto de Graham es claro: no le debes obediencia a este socio. Puedes ignorar su oferta por completo. Pero cuando el precio cae muy por debajo del valor real, ahí el pánico del Señor Mercado se vuelve tu oportunidad. Generaciones de inversores, Warren Buffett entre ellos, aprendieron justo esto de la parábola.

$$El mercado existe para servirte, no para dirigirte; vende el precio, compra el valor.$$

&&En tu última inversión, ¿sopesabas el valor de un negocio o comprabas el humor de la multitud?&&`,
      thirtySec: `Benjamin Graham pide imaginar al Señor Mercado: un socio inestable que llama cada mañana y dice un precio. Unos días ofrece cifras disparatadas por euforia, otros entra en pánico y suplica vender por casi nada. Su número refleja su humor, no el valor del negocio. La lección: el precio salta con la emoción, el valor es estable; convierte su pánico en tu oportunidad.`,
      punch: 'El mercado está para servirte, no para dirigirte.',
      question: 'En tu última inversión, ¿sopesabas el valor o comprabas el humor de la multitud?',
      contrast: 'El precio cambia cada mañana; el valor no.',
    },
    de: {
      title: 'Der Partner, der jeden Morgen klopft',
      content: `Stell dir vor, du hast ein Geschäft halbe-halbe mit einem Partner namens Mr. Market aufgebaut. Von anderen Partnern unterscheidet er sich nur in einem: Jeden Morgen klopft er an deine Tür und nennt einen Preis, um deinen Anteil zu kaufen oder dir seinen zu verkaufen.

Das Problem ist, dass Mr. Market emotional unbeständig ist. An manchen Morgen strotzt er vor Optimismus über die Zukunft und nennt einen absurd hohen Preis. An anderen gerät er in Panik, überzeugt, dass alles zusammenbricht, und fleht darum, denselben Anteil für fast nichts loszuwerden.

##Der Preis, den Mr. Market nennt, spiegelt nicht den wahren Wert des Geschäfts, sondern seine Laune an diesem Tag.##

Das ist die entscheidende Unterscheidung, die Benjamin Graham Anlegern 1949 beibrachte. Eine Aktie hat zwei getrennte Gesichter, und sie zu verwechseln ist der teuerste Fehler überhaupt:

~~Preis: die Zahl, die Mr. Market jeden Morgen ausruft, springend mit seinen Gefühlen. :: Wert: was das Geschäft wirklich verdient; langsam, geduldig und kaum veränderlich.~~

Grahams Punkt ist klar: Du schuldest diesem Partner keinen Gehorsam. Du kannst sein Angebot völlig ignorieren. Doch wenn der Preis weit unter den wahren Wert fällt, wird Mr. Markets Panik zu deiner Chance. Generationen von Anlegern, Warren Buffett darunter, lernten genau das aus dem Gleichnis.

$$Der Markt ist da, um dir zu dienen, nicht um dich zu belehren; verkaufe den Preis, kaufe den Wert.$$

&&Hast du bei deiner letzten Anlage den Wert eines Geschäfts abgewogen oder die Tageslaune der Menge gekauft?&&`,
      thirtySec: `Benjamin Graham lässt Anleger sich Mr. Market vorstellen: einen unbeständigen Partner, der jeden Morgen klopft und einen Preis nennt. Mal bietet er in Euphorie absurd hoch, mal gerät er in Panik und will für fast nichts verkaufen. Seine Zahl spiegelt seine Laune, nicht den Wert des Geschäfts. Die Lehre: Der Preis springt mit Gefühlen, der Wert bleibt; mach aus seiner Panik deine Chance.`,
      punch: 'Der Markt ist da, um dir zu dienen, nicht um dich zu belehren.',
      question: 'Hast du bei deiner letzten Anlage den Wert abgewogen oder die Laune der Menge gekauft?',
      contrast: 'Der Preis ändert sich jeden Morgen; der Wert nicht.',
    },
  },
];

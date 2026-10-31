# Albor — Kategori Başına Demo Hikâye Okuma Sayfası

Web sitesindeki "hikâye okuma" demo ekranı için içerik. Her kategoriden bir hikâye seçildi.

- **Kaynak:** `assets/albor.db`, yalnızca `stories.version = 'SON55'` hikâyeleri.
- **Seçim ölçütü:** Spark-Reels viral puanlama listesi (`analysis/viral-scoring/outputs/current/hikaye_viral_puanlari.csv`). Her kategoride en yüksek puanlı SON55 hikâyesi alındı. Puanlar hikâyenin önceki metin sürümüne göre verildi; aşağıdaki metinler güncel SON55 metnidir.
- **Diller:** tr, en, es, de (web sitesinin 4 dili).
- **Metin:** Uygulamadaki ham işaretlemeyle aynen verildi. Aşağıdaki işaretleme kuralına göre render edin; işaretler ekranda görünmemeli.

## İşaretleme kuralı (uygulamadaki `src/utils/storyMarkup.js` ile aynı)

| İşaret | Anlamı | Okuma ekranında görünüm |
|---|---|---|
| `[[open]]` | Açılış bölümü | Giriş paragrafı, büyük ve dikkat çekici |
| `[[story]]` | Hikâye bölümü | Normal gövde metni |
| `[[lessons]]` | Ders bölümü | "Ders" başlığı altında kart |
| `[[reflect]]` | Düşün bölümü | Soru kartı |
| `[[use]]` | Sohbette kullan bölümü | Bağlam etiketli kullanım kartları |
| `[[pocket]]` | Cebe at bölümü | Kısa özet kartı |
| `$$**Başlık.** gövde$$` | Ders kartı | Kalın başlık + gövde |
| `&&soru&&` | Düşünme sorusu | Vurgulu soru kartı |
| `##cümle##` | Vurgulanan an | Vurgu rengiyle öne çıkan cümle |
| `~~önce :: sonra~~` | Karşıtlık | İki satırlık önce/sonra kartı |
| `%%context:<tür> \| durum :: "replik"%%` | Kullanım kartı | Bağlam rozeti (meeting, oneonone, family, social, self) + durum + tırnaklı replik |
| `@@cümle@@` | Cep kartı | Tek cümlelik özet kartı |
| `**kalın**`, `*italik*` | Satır içi biçim | Kalın / italik |
| `- metin`, `> metin` | Madde / alıntı | Madde işareti / alıntı satırı |

## Seçilen hikâyeler

| Kategori | Story ID | Hikâye (tr) | Kitap | Viral puan | Sıra (750 içinde) | Okuma |
|---|---:|---|---|---:|---:|---|
| Felsefe | 1410 | Alışveriş Merkezindeki Gülümseme | Dört Anlaşma — Don Miguel Ruiz | 95 | 1 | 3 dk |
| Liderlik | 1483 | Columbia Toplantısındaki Sessizlik | The Fearless Organization — Amy Edmondson | 93 | 3 | 3 dk |
| Psikoloji | 1456 | Ayna kutusu | Beynin Sırları — V.S. Ramachandran | 92 | 6 | 3 dk |
| Sağlık | 1701 | Basit Bir Kontrol Listesi Kaç Hayat Kurtarabilir? | The Checklist Manifesto — Atul Gawande | 91 | 9 | 3 dk |
| Tarih | 1694 | Seabiscuit Büyük Buhran'a Nasıl Umut Oldu? | Seabiscuit — Laura Hillenbrand | 90 | 18 | 3 dk |
| Büyüme | 1284 | Yabani İncirin Altında Kazmak | Simyacı — Paulo Coelho | 90 | 19 | 3 dk |
| Finans | 1734 | Aynı Limuzin, Aynı Trafik: Kim Daha Çok Üzülür? | The Undoing Project — Michael Lewis | 87 | 55 | 3 dk |
| Verimlilik | 1584 | Paranın ötesinde anlam | Bütün Beyin — Daniel Pink | 89 | 35 | 3 dk |
| İletişim | 1785 | Suçlamanın Altındaki İhtiyaç | Nonviolent Communication — Marshall B. Rosenberg | 79 | 280 | 2 dk |
| Bilim | 1717 | Nicholas Carr Neden Bir Kitabı Bitiremez Oldu? | The Shallows — Nicholas Carr | 84 | 97 | 3 dk |

---

## Felsefe / Philosophy — #1410

- **Yazar:** Don Miguel Ruiz (1997)
- **Okuma süresi:** 3 dk
- **Viral puan:** 95 / 100 (750 hikâye içinde 1. sıra)

### Türkçe (`tr`)

- **Kategori:** Felsefe
- **Kitap:** Dört Anlaşma
- **Başlık:** Alışveriş Merkezindeki Gülümseme
- **Kanca (hook):** Hangi sessizliği tahminle dolduruyorsunuz?

**1 dakikalık özet:**

> Don Miguel Ruiz üçüncü anlaşmayı, varsayımda bulunmamayı, bir sahneyle anlatıyor: alışveriş merkezinde sevdiğiniz biri gülümsüyor, siz onun sizi sevdiğini varsayıp bir ilişki, hatta bir düğün kuruyorsunuz. Aynısını eşimizden aklımızı okumasını bekleyerek de yapıyoruz. Varsayım yanlış anlamaya, kişisel almaya ve boşuna bir drama dönüşüyor. Ruiz'in çaresi, net olana kadar soru sormaya cesaret etmek ve anlamadığınızda sormak. Kendimiz hakkında da sormadan varsayım yapıyoruz, diyor.

**Okuma sayfası metni (ham işaretleme):**

````text
[[open]]
Alışveriş merkezinde sevdiğiniz biri size gülümsüyor. Yanından geçene kadar kafanızda bir ilişki kuruyorsunuz, belki bir düğün bile. O kişiye tek kelime etmediniz ve ona hiçbir şey sormadınız.

[[story]]
Don Miguel Ruiz *The Four Agreements* kitabında üçüncü anlaşmayı, yani varsayımda bulunmamayı bu tür anlarla açıklıyor. Her şey hakkında varsayım yapma eğilimindeyiz, diyor, sorun da varsayımları doğru sanmamız: yemin edebilecek kadar gerçek görüyoruz onları. Alışveriş merkezinde sevdiğiniz biri size gülümsüyor. Siz de onun sizi sevdiğini varsayıyor, yani hiç konuşmadan bir şeyin doğru olduğuna karar veriyor, aranızda bir ilişki hayal ediyor, düğününüzü bile kurabiliyorsunuz. Ruiz buna benzer şeyi hep yaptığımızı söylüyor ve bunun sonucunu da yazıyor: uydurduğumuz bir gerçeğe fazla güç vermiş oluyoruz.

Bu eğilim en çok yakınlarımızla ortaya çıkıyor. Ruiz'e göre ilişkilerdeki sorunların çoğu varsayımla başlıyor. Eşimizin ne düşündüğünü ya da ne istediğini bilmesini bekliyor, bilmeyince kızıyoruz. Arkadaşlarımızın ve ailemizin bizi o kadar iyi tanıdığını sanıyor, konuşmaya gerek duymuyor, sonra akıllarımızı okumadıkları için içerliyoruz. İlişkinin başında sevdiğimiz yanları görüp sevmediklerimizi atlıyor, onları değiştirebileceğimizi varsayıyor ve değişmeyince hayal kırıklığına uğruyoruz. Ruiz'e göre gerçek sevgi, birini olduğu gibi kabul etmek. Biri sizi değiştirmek istiyorsa, diye ekliyor, sizi gerçekten sevmiyordur. Kalmak ya da gitmek, karşı tarafın sizi olduğunuz gibi kabul edip etmemesine bağlı.

Zincirin işleyişini de tek paragrafta özetliyor. Başkalarının ne yaptığı ya da düşündüğü konusunda varsayımda bulunuyoruz ve bunlara doğru gözüyle bakıyoruz, kişisel alıyoruz, onları suçluyor, sözcüklerimizle duygusal zehir yolluyoruz. Bir varsayım yapıyoruz, yanlış anlıyoruz, kişisel alıyoruz ve sonunda boşuna kocaman bir dram yaratıyoruz. Kendimiz hakkında da varsayım yapıyoruz, kendimizi olduğumuzdan büyük ya da küçük görüyoruz, çünkü kendimize soru sormuyoruz.

Ruiz'in çaresi kısa: soru sormak. İletişimin açık olduğundan emin olun, anlamıyorsanız sorun ve olabildiğince net olana kadar soru sormaya cesaret edin.

[[lessons]]
$$**Boşluğu bir soruyla doldur.** Ruiz'in alışveriş merkezindeki gülümseyen kişisi hakkında hiçbir şey bilmiyorsunuz, kafanızdaki hikâye yalnızca sizin. Taslağına tek kelimelik bir yanıt alan bir yönetici, hepsini sezgisel olarak baştan yazmak yerine iş arkadaşına hangi bölümün işe yaradığını ve hangisinin yaramadığını sorabilir. Kısa bir soru, yanlış bir tahminin büyüteceği dramdan çok daha ucuza gelir ve yanıtı ne olursa olsun elinizde bir gerçek bırakır.$$

[[reflect]]
&&Bu hafta hangi sessizliği ya da kısa yanıtı, tek bir soruyla çözülebilecekken bir tahminle doldurup duruyorsunuz?&&

[[use]]
%%context:meeting | Bir iş arkadaşınız planınıza yalnızca "idare eder" diye yanıt verdi :: "'İdare eder' çok şey demek olabilir. Değiştirebilseydin neyi değiştirirdin?"%%

%%context:family | Partneriniz akşam yemeğinde sessiz :: "Bugün sessiz görünüyorsun. Aklında bir şey mi var, yoksa yalnızca yorgun musun?"%%

%%context:self | Bir arkadaşınızın cevap vermemesi hakkında bir hikâye kuruyorsunuz :: "Bir şey varsayıyorum ve doğru olup olmadığını bilmiyorum. Doğrudan sorayım."%%

[[pocket]]
@@Alışveriş merkezindeki bir gülümseme kafanızda düğüne dönüşebilir. Bir tahmin fark ettiğinizde onu tek bir soruya çevirin.@@
````

### English (`en`)

- **Kategori:** Philosophy
- **Kitap:** The Four Agreements
- **Başlık:** The Smile at the Mall
- **Kanca (hook):** Which silence are you filling with a guess this week?

**1 dakikalık özet:**

> Don Miguel Ruiz explains the third agreement, do not make assumptions, with a scene: someone you like smiles at you at the mall, and you assume they like you and picture a relationship, even a wedding. We do the same when we expect partners to read our minds. An assumption becomes a misunderstanding, taking it personally, and a big drama for nothing. Ruiz's remedy is to have the courage to ask until you are clear.

**Okuma sayfası metni (ham işaretleme):**

````text
[[open]]
Someone you like smiles at you across the mall. By the time you walk past, you have a relationship in your head, and perhaps a wedding. You have not said a word to them.

[[story]]
Don Miguel Ruiz uses scenes like this one to explain the third agreement in *The Four Agreements*, don't make assumptions. You see someone you like, and the person smiles. You assume the person likes you, picture a relationship, and may even fantasize about the wedding. Ruiz says we do this sort of thing all the time, and the cost is that we give too much power to a reality we have invented.

It gets worse with the people closest to us. Many relationship problems, Ruiz writes, start with an assumption. We expect a partner to know what we think and want, then get upset when they do not. We take it for granted that friends and family know us so well that we need not explain, and then resent them for not reading our minds. Early in a relationship we notice what we like in someone and overlook what we do not, assume we can change the rest, and are upset when we cannot. Real love, he says, is accepting someone just as they are.

He lays out the chain in one passage. We make assumptions about what others are doing or thinking, believe them true, take it personally, blame the others and send emotional poison with our word. We make an assumption, misunderstand, take it personally, and end up creating a whole big drama for nothing. We do it to ourselves as well, overrating or underrating what we can do because we never asked ourselves a question about the situation.

Ruiz's remedy is brief. Ask questions, make sure the communication is clear, and if you do not understand, ask. Have the courage to keep asking until you are as clear as you can be.

[[lessons]]
$$**Fill a gap with a question instead of a guess.** The person smiling at the mall is someone you know nothing about, so the story you build is yours alone. A manager who gets a one-word reply to her draft can ask the colleague which part worked and which did not, before rewriting everything on a hunch. A short question costs far less than the drama a wrong guess would grow.$$

[[reflect]]
&&Which silence or short reply are you filling this week with a guess, when one question to the person would settle it?&&

[[use]]
%%context:meeting | A colleague answers your plan with just "fine" :: "'Fine' can mean a lot of things. What would you change if you could?"%%

%%context:family | Your partner is quiet at dinner :: "You seem quiet tonight. Is something on your mind, or are you just tired?"%%

%%context:self | You are building a story about a friend who has not replied :: "I'm assuming something and I don't know if it's true. I'll just ask."%%

[[pocket]]
@@A smile at the mall can become a wedding in your head. Turn a guess into one question.@@
````

### Español (`es`)

- **Kategori:** Filosofía
- **Kitap:** Cuatro acuerdos
- **Başlık:** La sonrisa en el centro comercial
- **Kanca (hook):** ¿Qué silencio estás llenando con una suposición esta semana?

**1 dakikalık özet:**

> Don Miguel Ruiz explica el tercer acuerdo, no hacer suposiciones, con una escena: alguien que te gusta te sonríe en un centro comercial, supones que le gustas y te imaginas una relación, incluso una boda. Lo mismo hacemos al esperar que la pareja nos lea la mente. La suposición se vuelve malentendido, lo tomamos personal y se arma un drama por nada. El remedio de Ruiz es tener el valor de preguntar hasta estar claro.

**Okuma sayfası metni (ham işaretleme):**

````text
[[open]]
El tercer acuerdo cabe en una frase corta: si no entiendes, pregunta. El problema que resuelve tarda más en contarse, y empieza casi siempre con alguien que no ha dicho nada, o que ha dicho muy poco, mientras nosotros ya hemos rellenado el resto.

[[story]]
Don Miguel Ruiz explica en *The Four Agreements* que tendemos a suponer cosas sobre todo, y que el problema de las suposiciones es que las creemos verdad. Podríamos jurar que son reales. Su escena favorita transcurre en un centro comercial: ves a alguien que te gusta y esa persona te sonríe. Supones que le gustas, te imaginas una relación y puede que hasta fantasees con la boda. Ruiz dice que hacemos eso todo el tiempo y que el precio es dar demasiado poder a una realidad que nos hemos inventado.

Con las personas más cercanas ocurre más. Muchos problemas de pareja, según Ruiz, nacen de una suposición. Esperamos que nuestra pareja sepa lo que pensamos y queremos, y nos molestamos cuando no lo sabe. Damos por hecho que amigos y familia nos conocen tan bien que no hace falta explicar, y luego les guardamos rencor por no leernos la mente. Al empezar una relación vemos lo que nos gusta del otro y pasamos por alto lo que no, suponemos que podremos cambiar el resto y nos disgustamos cuando no es así. El amor de verdad, dice, es aceptar a alguien tal como es. Si alguien quiere cambiarte, añade, en realidad no te quiere. Quedarse o irse depende de si el otro te acepta como eres.

La cadena, la resume en un párrafo: suponemos lo que otros hacen o piensan, lo tomamos personal, los culpamos y reaccionamos enviando veneno emocional con la palabra. Hacemos una suposición, nos malinterpretamos, nos lo tomamos personal y acabamos montando un gran drama por nada. También lo hacemos con nosotros mismos, sobrestimándonos o subestimándonos porque nunca nos hicimos preguntas sobre la situación.

El remedio de Ruiz es breve: pregunta. La lección completa del acuerdo cabe ahí, y para él es la forma de no vivir dentro de dramas inventados. Asegúrate de que la comunicación sea clara, y si no entiendes, pregunta. Ten el valor de seguir preguntando hasta estar todo lo claro que puedas.

[[lessons]]
$$**Llena un vacío con una pregunta y no con una suposición.** De la persona que sonríe en el centro comercial no sabes nada, así que la historia que construyes solo es tuya. Una jefa que recibe una respuesta de una sola palabra a su borrador puede preguntar a su colega qué parte funcionó y cuál no, antes de reescribirlo todo por intuición. Una pregunta corta cuesta mucho menos que el drama que una suposición equivocada acaba haciendo crecer, y te deja con un dato real en lugar de una historia tuya.$$

[[reflect]]
&&¿Qué silencio o respuesta corta estás llenando esta semana con una suposición, cuando una pregunta a esa persona lo aclararía?&&

[[use]]
%%context:meeting | Un colega responde a tu plan solo con «bien» :: "«Bien» puede significar muchas cosas. ¿Qué cambiarías si pudieras?"%%

%%context:family | Tu pareja está callada en la cena :: "Te noto callado esta noche. ¿Tienes algo en la cabeza o solo estás cansado?"%%

%%context:self | Estás montando una historia porque una amiga no ha contestado :: "Estoy suponiendo algo y no sé si es verdad. Mejor se lo pregunto directamente, sin más vueltas."%%

[[pocket]]
@@Una sonrisa en un centro comercial puede ser una boda en tu cabeza. Convierte una suposición en una pregunta.@@
````

### Deutsch (`de`)

- **Kategori:** Philosophie
- **Kitap:** Vier Vereinbarungen
- **Başlık:** Das Lächeln im Einkaufszentrum
- **Kanca (hook):** Welches Schweigen füllst du diese Woche mit einer Vermutung?

**1 dakikalık özet:**

> Don Miguel Ruiz erklärt das dritte Abkommen, keine Annahmen zu treffen, mit einer Szene: Jemand, der dir gefällt, lächelt dich im Einkaufszentrum an, du nimmst an, er mag dich, und malst dir eine Beziehung, sogar eine Hochzeit aus. Genauso erwarten wir, dass Partner Gedanken lesen. Aus der Annahme wird Missverständnis, persönliches Nehmen und ein Drama um nichts. Ruiz rät, den Mut zu haben, so lange zu fragen, bis alles klar ist.

**Okuma sayfası metni (ham işaretleme):**

````text
[[open]]
Er lächelt dich im Einkaufszentrum an, und du bist überzeugt, dass er dich mag. Gefragt hast du nicht. Gesprochen habt ihr auch nicht.

[[story]]
Don Miguel Ruiz erklärt das dritte Abkommen in *The Four Agreements*, keine Annahmen zu treffen, unter anderem mit dieser Szene. Du siehst im Einkaufszentrum jemanden, der dir gefällt, und der lächelt dich an. Du nimmst an, die Person mag dich, stellst dir eine Beziehung vor und vielleicht sogar die Hochzeit. Ruiz sagt, so etwas täten wir ständig, und der Preis sei, dass wir einer erfundenen Wirklichkeit zu viel Macht geben.

Am deutlichsten wird es bei den Nächsten. Viele Beziehungsprobleme beginnen nach Ruiz mit einer Annahme. Wir erwarten, dass der Partner weiß, was wir denken und wollen, und sind verärgert, wenn er es nicht weiß. Wir nehmen an, Freunde und Familie kennten uns so gut, dass wir nichts erklären müssten, und nehmen ihnen dann übel, dass sie keine Gedanken lesen. Am Anfang einer Beziehung sehen wir, was wir an jemandem mögen, übersehen den Rest, glauben, ihn ändern zu können, und sind enttäuscht, wenn es nicht klappt. Wahre Liebe, sagt er, nimmt einen Menschen so, wie er ist.

Die Kette beschreibt er in einem Absatz. Wir treffen Annahmen darüber, was andere tun oder denken, halten sie für wahr, nehmen es persönlich, beschuldigen die anderen und schicken mit unseren Worten emotionales Gift. Wir nehmen etwas an, missverstehen es, nehmen es persönlich und schaffen am Ende ein riesiges Drama um nichts. Auch über uns selbst nehmen wir etwas an und überschätzen oder unterschätzen uns, weil wir uns nie Fragen zur Lage gestellt haben.

Ruiz' Gegenmittel ist kurz. Stell Fragen, sorge für klare Verständigung, und wenn du etwas nicht verstehst, frag. Hab den Mut, so lange zu fragen, bis du so klar siehst, wie du kannst.

[[lessons]]
$$**Füll eine Lücke mit einer Frage statt mit einer Vermutung.** Über den Menschen, der im Einkaufszentrum lächelt, weißt du nichts, die Geschichte in deinem Kopf gehört nur dir. Eine Abteilungsleiterin, die auf ihren Entwurf nur eine einzige Wortantwort bekommt, kann den Kollegen fragen, welcher Teil funktioniert hat und welcher nicht, bevor sie nach Gefühl alles neu schreibt. Eine kurze Frage kostet weit weniger als das Drama, das eine falsche Vermutung wachsen lässt.$$

[[reflect]]
&&Welches Schweigen oder welche kurze Antwort füllst du diese Woche mit einer Vermutung, obwohl eine einzige Frage an die Person es klären würde?&&

[[use]]
%%context:meeting | Ein Kollege antwortet auf deinen Plan nur mit "passt schon" :: "'Passt schon' kann vieles heißen. Was würdest du ändern, wenn du könntest?"%%

%%context:family | Dein Partner ist beim Abendessen still :: "Du wirkst heute ruhig. Beschäftigt dich etwas, oder bist du nur müde?"%%

%%context:self | Du baust dir eine Geschichte darüber, dass ein Freund nicht geantwortet hat :: "Ich nehme etwas an und weiß nicht, ob es stimmt. Ich frage einfach nach."%%

[[pocket]]
@@Ein Lächeln im Einkaufszentrum kann in deinem Kopf zur Hochzeit werden. Mach aus einer Vermutung eine Frage.@@
````

---

## Liderlik / Leadership — #1483

- **Yazar:** Amy Edmondson (2018)
- **Okuma süresi:** 3 dk
- **Viral puan:** 93 / 100 (750 hikâye içinde 3. sıra)

### Türkçe (`tr`)

- **Kategori:** Liderlik
- **Kitap:** The Fearless Organization
- **Başlık:** Columbia Toplantısındaki Sessizlik
- **Kanca (hook):** Bir toplantıda içinde tuttuğun son kaygıyı söylemeyi neyin değişmesi kolaylaştırırdı?

**1 dakikalık özet:**

> Edmondson, Columbia'nın kaybını sessizliğin bedeli olarak anlatır. 2003'te fırlatma sırasında bir köpük parçası mekiğin kanadına çarptı. Mühendisler daha net görüntü istedi, ama talep yaklaşık doksan dakika sonra iptal edildi. Kopan parçaları değerlendiren ekibin başındaki Rodney Rocha sonradan toplantıda konuşmadığına pişman olduğunu söyledi. Mekik fırlatmadan on altı gün sonra parçalandı ve yedi astronot öldü.

**Okuma sayfası metni (ham işaretleme):**

````text
[[open]]
Fırlatma videosunda bir köpük parçası uzay mekiğinin sol kanadına çarpıyor. Mühendisler daha net görüntü istiyor. İstek doğru kişilere ulaşıyor ve yaklaşık doksan dakika sonra iptal ediliyor. Odada kimin ne söylediği, kimin susmayı seçtiği ise ayrı bir hikâye.

[[story]]
Amy Edmondson *The Fearless Organization* kitabında Columbia uzay mekiğinin kaybını, insanların konuşmayı güvenli hissetmediği bir durumun örneği olarak kullanır. Olayın ayrıntıları kamuya açık kaza kayıtlarından gelir, Edmondson'ın payı onu sessizlik ve psikolojik güvenlik çerçevesinde okumasıdır. Tarih 16 Ocak 2003'tür. Columbia'nın fırlatılması sırasında, dış yakıt tankından kopan bir köpük yalıtım parçası mekiğin sol kanadına çarpar.

Mühendisler çarpmayı, fırlatma videosunu izlerken gördü. Bazıları hasarın boyutunu anlayabilmek için kanadın daha net görüntülerini istedi. Rodney Rocha da endişelenenlerden biriydi. Kopan parçaları değerlendiren mühendislerin başındaydı, yani konuya en yakın kişilerden biriydi.

NASA dışından yapılan bir görüntü talebi savunma alanındaki doğru kişilere ulaştı, ama NASA yaklaşık doksan dakika sonra bu talebi iptal etti. Görev Yönetim Ekibi ek görüntülerin peşine düşmedi. Endişe vardı, görüntü talebi vardı, ama talep bir yere varmadı.

##Rocha sonradan, o ekibin toplantısında sesini çıkarmadığına pişman olduğunu söyledi.##

Columbia görevinin tamamı boyunca yörüngede kaldı ve içinde yedi astronot vardı. Fırlatmadan on altı gün sonra, 1 Şubat 2003'te, mekik atmosfere yeniden girişte parçalandı. Yedisi de öldü.

Edmondson bunu psikolojik güvenlik eksikliği olarak okur. Ona göre bir endişeyi dile getirmek riskli göründüğünde insanlar onu içlerinde tutar. Bir mühendisin endişesi olabilir, ama toplantı gündemine girmedikçe karar vericiye ulaşmaz. Odada herkes aynı kararı dinler ve itiraz gelmezse, bu sessizlik onay gibi görünür, oysa kişinin konuşmanın riskini fazla bulduğu anlamına da gelebilir.

Edmondson bunun yalnızca NASA'ya özgü olmadığını özellikle belirtir. Psikolojik güvenlik onun için birbirine nazik davranmak demek değildir, açık sözlülüğün güvenli olması demektir.

[[lessons]]
$$**Sessizliği onay saymayın.** Bir ekip lideri riskli bir karardan önce "sizi en çok ne endişelendiriyor?" diye sorup ilk cevap verene teşekkür ederse, sonraki kişi için konuşmayı kolaylaştırmış olur ve toplantı odasındaki havayı da değiştirir. Sorulmadığında susan biri bazen bir şey bilmediği için değil, söylemenin bedelini ağır bulduğu için susar. Toplantıdaki sessizliği bu ihtimalle birlikte okumak, kararın verilmesinden önce o sorunun sorulmasını sağlar. Bu soru, kararın ardından değil, kararın öncesinde sorulduğunda işe yarar.$$

[[reflect]]
&&Bir toplantıda bir kaygınızı içinizde tuttuğunuz son seferi düşünün: neyin değişmesi onu yüksek sesle söylemenizi kolaylaştırırdı?&&

[[use]]
%%context:meeting | Riskli bir karardan önce toplantıyı yönetiyorsunuz :: "Karar vermeden önce herkesten en büyük endişesini duymak istiyorum. İlkini söyleyene şimdiden teşekkür ederim."%%
%%context:oneonone | Ekipten gelen raporlar fazla sessiz :: "Fark ettiğin ama henüz dile getirmediğin bir şey var mı? Hoşuma gitmese bile duymak istiyorum."%%
%%context:self | Dile getirmediğiniz bir şüpheniz var :: "Kaygıyı tek cümleyle yazıyorum ve kime, nerede söyleyeceğime karar veriyorum."%%

[[pocket]]
@@Columbia'da görüntü talebi iptal edildi ve mühendis sustu: toplantıdaki sessizlik onay anlamına gelmez.@@
````

### English (`en`)

- **Kategori:** Leadership
- **Kitap:** The Fearless Organization
- **Başlık:** The Request Nobody Pushed
- **Kanca (hook):** What would have made it easier to say the last concern you kept to yourself in a meeting?

**1 dakikalık özet:**

> Edmondson uses the loss of Columbia as a case of silence. During the 2003 launch a piece of foam hit the shuttle's wing. Engineers wanted better images, but the request was cancelled about ninety minutes later. Rodney Rocha, who led the team assessing the debris, said afterwards he regretted not speaking up at the meeting. The shuttle broke apart sixteen days after launch and all seven astronauts died.

**Okuma sayfası metni (ham işaretleme):**

````text
[[open]]
A piece of foam breaks off the shuttle's external tank and strikes a wing during the launch, and engineers watching the video see it happen. One of them wants a better look at the damage. A request goes out for pictures, and about ninety minutes later it is cancelled.

[[story]]
Amy Edmondson uses the loss of the space shuttle Columbia in *The Fearless Organization* as a case of what happens when people do not feel safe speaking up. On 16 January 2003, during Columbia's launch, a piece of foam insulation broke off the external tank and hit the shuttle's left wing.

Engineers saw it on the launch video. Some of them wanted better images of the wing to judge whether it had been damaged. Rodney Rocha, who led the debris assessment team, the group whose job was to judge exactly this kind of damage, was among those who were worried.

A request for imagery from outside NASA did reach the right defence personnel. NASA cancelled it about ninety minutes later. The Mission Management Team, which was running the flight, did not pursue the extra images.

##Afterwards, Rocha said he regretted not speaking up at that team's meeting.##

Columbia stayed in orbit for its full mission, with seven astronauts aboard. Sixteen days after launch, on 1 February 2003, the shuttle broke apart during reentry, and none of the seven survived.

Edmondson reads this as a failure of psychological safety. When raising a concern feels risky, she argues, people often hold it back. Silence in the meeting room then looks like agreement, though it may only mean that someone has decided the risk of speaking is too high.

She is careful to say this is not unique to NASA. The same pattern, she writes, can occur in any organization where bad news is hard to carry upward. And she makes a point about what psychological safety does not mean. It does not mean being nice to one another. It means candour is safe.

[[lessons]]
$$**Treat a quiet room as a question, not an answer.** A team lead about to approve a risky product launch could go around the table and ask each person for the biggest worry they have about it. If the first person to answer is thanked for the concern, the next one will usually find it easier to speak. You learn what the room was holding back before the decision is made, while the answer can still change the plan, and you show the team, by what you do and not by what you say, that bad news is welcome here.$$

[[reflect]]
&&When did you last keep a concern to yourself in a meeting, and what would have made it easier to say out loud?&&

[[use]]
%%context:meeting | You chair a meeting before a risky decision :: "Before we decide, I want each person to name the one thing that worries them most about this. I'll start."%%
%%context:oneonone | The team feels too quiet to you :: "What have you noticed this month that you haven't brought up? It doesn't need to be polished."%%
%%context:self | You have a doubt you haven't voiced :: "I'll write the concern in one sentence and decide where I'm going to say it, before the next meeting."%%

[[pocket]]
@@At Columbia, a worried engineer stayed quiet and an imagery request was cancelled. Silence is not agreement.@@
````

### Español (`es`)

- **Kategori:** Liderazgo
- **Kitap:** The Fearless Organization
- **Başlık:** Silencio en la sala del Columbia
- **Kanca (hook):** ¿Qué habría hecho más fácil decir la última preocupación que te callaste en una reunión?

**1 dakikalık özet:**

> Edmondson usa la pérdida del Columbia como un caso de silencio. En el despegue de 2003, un trozo de espuma golpeó el ala del transbordador. Los ingenieros querían imágenes mejores, pero la petición se canceló unos noventa minutos después. Rodney Rocha, que dirigía a los ingenieros que evaluaban los desprendimientos, dijo luego que lamentaba no haber hablado en la reunión. El transbordador se desintegró dieciséis días después y murieron los siete astronautas.

**Okuma sayfası metni (ham işaretleme):**

````text
[[open]]
Un trozo de espuma se desprende del tanque externo de un transbordador y golpea un ala durante el despegue, y los ingenieros que miran el vídeo ven cómo ocurre. Uno de ellos quiere examinar mejor el daño. Se pide una imagen y, unos noventa minutos después, la petición se cancela.

[[story]]
Amy Edmondson usa en *The Fearless Organization* la pérdida del transbordador espacial Columbia como un caso de lo que pasa cuando la gente no se siente a salvo para hablar. El 16 de enero de 2003, durante el despegue del Columbia, un trozo de espuma aislante se desprendió del tanque externo y golpeó el ala izquierda de la nave.

Los ingenieros lo vieron en el vídeo del lanzamiento, el golpe contra el ala izquierda, y nadie sabía todavía qué daño había hecho. Algunos querían mejores imágenes del ala para juzgar si estaba dañada, porque sin ellas solo se podía suponer. Rodney Rocha, que dirigía el equipo de evaluación de los restos, el grupo cuyo trabajo era valorar justo ese tipo de daño, estaba entre los preocupados.

Una solicitud de imágenes desde fuera de la NASA llegó al personal de defensa adecuado. La NASA la canceló unos noventa minutos más tarde, y la petición no volvió a salir adelante. El Equipo de Gestión de la Misión, que dirigía el vuelo, no insistió en conseguir las imágenes adicionales. La duda de los ingenieros siguió sin respuesta mientras la nave daba vueltas a la Tierra.

##Rocha dijo después que lamentaba no haber hablado en la reunión de ese equipo.##

El Columbia siguió en órbita durante toda su misión, con siete astronautas a bordo. El 1 de febrero de 2003, la nave se desintegró durante el reingreso en la atmósfera y no sobrevivió ninguno de los siete.

Edmondson interpreta lo ocurrido como un fallo de seguridad psicológica. Cuando plantear una preocupación parece arriesgado, sostiene, la gente suele callársela. El silencio en la sala se parece entonces a un acuerdo, aunque quizá solo signifique que alguien ha decidido que hablar cuesta demasiado.

Ella aclara que esto no es exclusivo de la NASA. El mismo patrón, escribe, puede darse en cualquier organización donde a las malas noticias les cueste llegar arriba. Y precisa qué no significa la seguridad psicológica: no es ser amable los unos con los otros. Significa que decir las cosas con franqueza no tiene riesgo.

[[lessons]]
$$**Trata una sala callada como una pregunta, no como una respuesta.** Un jefe de equipo a punto de aprobar un lanzamiento arriesgado puede recorrer la mesa y pedir a cada persona la mayor preocupación que tenga. Si agradece la preocupación a quien habla primero, al siguiente le resultará más fácil hablar, y al tercero también. Así te enteras de lo que la sala callaba antes de decidir, cuando la respuesta aún puede cambiar el plan, y muestras al equipo, con hechos y no con palabras, que aquí las malas noticias son bienvenidas.$$

[[reflect]]
&&¿Cuándo fue la última vez que te guardaste una preocupación en una reunión, y qué te habría facilitado decirla en voz alta?&&

[[use]]
%%context:meeting | Diriges una reunión antes de una decisión arriesgada :: "Antes de decidir, quiero que cada uno diga lo que más le preocupa de esto. Empiezo yo."%%
%%context:oneonone | Notas al equipo demasiado callado :: "¿Qué has notado este mes que no hayas comentado? No hace falta que lo traigas pulido."%%
%%context:self | Tienes una duda que no has dicho :: "Voy a escribir la preocupación en una frase y decidir dónde la diré, antes de la próxima reunión."%%

[[pocket]]
@@En el Columbia, un ingeniero preocupado calló y se canceló una petición de imágenes. Silencio no es acuerdo.@@
````

### Deutsch (`de`)

- **Kategori:** Führung
- **Kitap:** The Fearless Organization
- **Başlık:** Das Schweigen vor der Columbia
- **Kanca (hook):** Was hätte es dir leichter gemacht, die letzte Sorge auszusprechen, die du in einer Besprechung für dich behalten hast?

**1 dakikalık özet:**

> Edmondson nutzt den Verlust der Columbia als Fall von Schweigen. Beim Start 2003 traf ein Stück Schaumstoff den Flügel des Shuttles. Die Ingenieure wollten bessere Bilder, doch die Anfrage wurde etwa neunzig Minuten später abgesagt. Rodney Rocha, der das Team zur Bewertung der abgelösten Teile leitete, sagte später, er bedaure, in der Sitzung nicht gesprochen zu haben. Das Shuttle zerbrach sechzehn Tage nach dem Start, alle sieben Astronauten starben.

**Okuma sayfası metni (ham işaretleme):**

````text
[[open]]
Auf dem Startvideo sehen Ingenieure, wie ein Stück Schaumstoff gegen den Flügel des Shuttles prallt. Einer von ihnen will ein besseres Bild vom Schaden. Eine Anfrage nach Aufnahmen geht hinaus, und etwa neunzig Minuten später wird sie abgesagt.

[[story]]
Amy Edmondson nutzt in *The Fearless Organization* den Verlust des Spaceshuttles Columbia als Fall dafür, was geschieht, wenn Menschen sich nicht sicher fühlen, den Mund aufzumachen. Am 16. Januar 2003, beim Start der Columbia, löste sich ein Stück Schaumstoffisolierung vom Außentank und traf den linken Flügel des Shuttles.

Ingenieure sahen den Einschlag auf dem Startvideo. Auf dem Video allein ließ sich der Schaden nicht beurteilen. Einige wollten bessere Aufnahmen des Flügels, um zu klären, ob er beschädigt war. Rodney Rocha, der die Gruppe leitete, die solche Trümmerschäden bewerten sollte, gehörte zu den Besorgten.

Eine Anfrage nach Aufnahmen von außerhalb der NASA erreichte die zuständigen Stellen beim Verteidigungsministerium. Die NASA sagte sie etwa neunzig Minuten später ab. Der Wunsch nach den Bildern war also nicht aus der Luft gegriffen. Das Mission Management Team, das den Flug leitete, verfolgte die zusätzlichen Bilder nicht weiter.

##Hinterher sagte Rocha, er bereue, in der Sitzung dieses Teams nicht den Mund aufgemacht zu haben.##

Die Columbia blieb ihre volle Missionszeit im Orbit, mit sieben Astronauten an Bord. Sechzehn Tage nach dem Start, am 1. Februar 2003, brach das Shuttle beim Wiedereintritt auseinander, und keiner der sieben überlebte.

Edmondson liest das als Versagen psychologischer Sicherheit. Wenn es riskant wirkt, ein Bedenken zu äußern, behalten Menschen es oft für sich. Eine Sorge ist da und wird nicht ausgesprochen. Schweigen im Besprechungsraum sieht dann nach Zustimmung aus, obwohl es nur heißen kann, dass jemand das Risiko des Sprechens zu hoch fand.

Sie betont, dass das kein Problem allein der NASA ist. Und sie stellt klar, was psychologische Sicherheit nicht heißt: Es geht nicht darum, nett zueinander zu sein, sondern darum, dass Offenheit ungefährlich ist.

[[lessons]]
$$**Nimm einen stillen Raum als Frage, nicht als Antwort.** Ein Teamleiter, der kurz vor einem riskanten Produktstart steht und ihn absegnen soll, kann reihum jeden bitten, die größte Sorge dazu zu nennen. Bedankt er sich bei der ersten Person, die eine Sorge äußert, fällt es der nächsten meist leichter zu sprechen. So erfährst du, was der Raum zurückgehalten hat, bevor entschieden ist und die Antwort den Plan noch ändern kann, und das Team sieht an deinem Handeln, nicht an deinen Worten, dass schlechte Nachrichten willkommen sind, auch wenn sie den Zeitplan stören.$$

[[reflect]]
&&Wann hast du zuletzt in einer Besprechung ein Bedenken für dich behalten, und was hätte es dir leichter gemacht, es auszusprechen?&&

[[use]]
%%context:meeting | Du leitest eine Besprechung vor einer riskanten Entscheidung :: "Bevor wir entscheiden, nennt bitte jeder das, was ihm an der Sache am meisten Sorge macht. Ich fange an."%%
%%context:oneonone | Das Team kommt dir zu still vor :: "Was ist dir in diesem Monat aufgefallen, das du noch nicht angesprochen hast? Es muss nicht ausgefeilt sein."%%
%%context:self | Du hast einen Zweifel, den du nicht ausgesprochen hast :: "Ich schreibe das Bedenken in einem Satz auf und lege fest, wo ich es sage, noch vor der nächsten Besprechung."%%

[[pocket]]
@@Bei der Columbia schwieg ein besorgter Ingenieur, und eine Bildanfrage wurde abgesagt. Schweigen heißt nicht Zustimmung.@@
````

---

## Psikoloji / Psychology — #1456

- **Yazar:** V.S. Ramachandran (2011)
- **Okuma süresi:** 3 dk
- **Viral puan:** 92 / 100 (750 hikâye içinde 6. sıra)

### Türkçe (`tr`)

- **Kategori:** Psikoloji
- **Kitap:** Beynin Sırları
- **Başlık:** Ayna kutusu
- **Kanca (hook):** Gözün gördüğü, hissettiğin acıyı değiştirebilir mi?

**1 dakikalık özet:**

> Kolunu ya da bacağını kaybedenler çoğu zaman o uzvu hâlâ hisseder. Nörobilimci V.S. Ramachandran, The Tell-Tale Brain kitabında hayalet elin sıkılı bir yumruk gibi takılı kaldığı hastaları anlatıyor. Çözümü ortasında ayna olan bir kutuda aradı: hasta sağlam elinin yansımasını kayıp elin yerinde görüyordu. Anlattığına göre bazı hastalar kayıp elin hareket ettiğini hissetti ve acıları hafifledi. Aynalı terapinin sonraki denemeleri karışık sonuç verdi. Ramachandran bunu her hasta için bir tedavi olarak sunmuyor, acının ve algının beyinde kurulduğunu gösteren bir vaka olarak anlatıyor.

**Okuma sayfası metni (ham işaretleme):**

````text
[[open]]
Kolunu kaybetmiş bir adam, olmayan elinin sıkılı bir yumruk gibi kaldığını ve açılmadığını söylüyor. Çok acıtıyor. Elinde ağrıyacak bir şey yok, ama ağrı var. Bir nörobilimci bu sorunu çözmek için karton bir kutu kullandı.

[[story]]
Kolunu ya da bacağını kaybeden insanlar çoğu zaman o uzvu hâlâ hissederler. Buna hayalet uzuv deniyor. Nörobilimci V.S. Ramachandran, *The Tell-Tale Brain* kitabında bu hastalarla yaptığı çalışmaları anlatıyor.

Bazı hastalarda hayalet uzuv rahatsız bir konumda takılı kalmıştı. Örneğin el sıkı bir yumruk gibi duruyor ve hasta onu açamıyordu. Açmak istiyor, ama olmayan el emir dinlemiyordu. Ramachandran bunu şöyle açıklamayı önerdi: Kayıptan sonra da beyin kolun haritasını koruyor ve kolun artık hareket etmediğini öğrenmiş olabilir.

Çözümü pahalı bir cihazda değil, basit bir düzenekte aradı: Ortasında ayna olan bir kutu. Hasta sağlam elini kutunun bir yanına koyuyor ve elinin yansımasını, kayıp elin olması gereken yerde görüyordu. Böylece gözüne iki el görünüyordu. Sağlam elini oynattığında yansıma, hayalet eli de oynatıyormuş gibi görünüyordu, tıpkı iki eli de yerindeymiş gibi.

##Gözün gördüğü, hayalet kolun hissini değiştirebiliyordu.## Ramachandran'ın anlattığına göre bazı hastalar kayıp elin hareket ettiğini hissetti ve acıları hafifledi. Karton, ayna ve tek bir sağlam el, yıllardır kıpırdamayan bir hissi harekete geçirmişti, en azından anlatıldığına göre.

Burada bir not düşmek gerekiyor. Aynalı terapinin sonraki denemeleri karışık sonuç verdi. Kimi hastaya iyi geldi, kimine etki etmedi. Ramachandran bu örneği, acının ve algının beyinde kurulduğunu gösteren bir vaka olarak anlatıyor. Bunun her hasta için bir tedavi olduğunu söylemiyor.

Yine de düzeneğin sadeliği dikkat çekici. Pahalı bir cihaz ya da ilaç yok. Beyin, kolun hareket etmediğine dair eski bilgisiyle yaşıyordu ve ona dışarıdan, gözle görülebilen yeni bir bilgi verildi.

[[lessons]]
$$**Bir inancı tartışmak yerine denemeyle sınayın.** Duyduğunuz şey beyninizin girdilerinden kurduğu bir modelse, girdiyi değiştirmek hissi de değiştirebilir. Örneğin "Ben sunum yapamam" diye düşünen biri, bu cümleyle içinden tartışmak yerine küçük bir ekip toplantısında iki dakika konuşup ne olduğuna bakabilir. Ortaya çıkan sonuç, aynı düşünceyi bir kez daha tekrarlamaktan çok daha net bir bilgi verir ve bir sonraki adımı da belirler.$$

[[reflect]]
&&Kendinize sürekli tekrarladığınız hangi inancı, onunla tartışmak yerine gözünüzün önüne yeni bir veri koyarak sınayabilirsiniz?&&

[[use]]
%%context:social | Bir arkadaşınızın uzun süredir geçmeyen bir ağrısı var :: "Ayna kutusuyla hayalet ağrıyı hafifletmeye çalışan bir nörobilimci okudum. Bir uzmana yeni yöntemleri sorsan iyi olabilir."%%

%%context:self | Bir başarısızlık hakkında hep aynı hikâyeyi anlatıyorsunuz :: "Olayı bir de kanıtlara göre yazıyorum: ne oldu, ne olmadı."%%

%%context:meeting | Bir meslektaşınız planın işlemeyeceğinden emin :: "Küçük bir sürümünü deneyelim, ne olduğuna bakalım."%%

[[pocket]]
@@Algı beyinde kurulur; gözün gördüğünü değiştirmek bazen hissi de değiştirir.@@
````

### English (`en`)

- **Kategori:** Psychology
- **Kitap:** The Tell-Tale Brain
- **Başlık:** The mirror box
- **Kanca (hook):** Can what you see change what you feel?

**1 dakikalık özet:**

> People who lose a limb often go on feeling it. Neuroscientist V.S. Ramachandran describes in The Tell-Tale Brain patients whose phantom hand was stuck in a tight fist. He used a box with a mirror down the middle, so the patient saw the reflection of the healthy hand where the missing one would be. By his account, some patients felt the missing hand move and their pain eased. Later trials of mirror therapy gave mixed results. He presents the case as showing that pain and perception are built in the brain, and claims no cure for everyone.

**Okuma sayfası metni (ham işaretleme):**

````text
[[open]]
A patient has lost an arm, yet the hand is still there, clenched into a fist that will not open. It hurts. There is no hand to hurt, and the pain is real. A neuroscientist tried to fix it with a cardboard box.

[[story]]
People who lose an arm or a leg often go on feeling the missing limb. This is called a phantom limb. Neuroscientist V.S. Ramachandran describes his work with such patients in *The Tell-Tale Brain*.

In some of them the phantom was stuck in an uncomfortable position. A hand might sit in a tight fist, and the patient could not open it. Wanting to was no use, because the hand that no longer existed would not obey. Ramachandran proposed an explanation: after the loss the brain keeps its map of the limb, and it may have learned that the limb stays still.

He looked for a solution in a simple device: a box with a mirror down the middle. The patient put the intact hand on one side and saw its reflection where the missing hand would be, so two hands appeared in front of them. When the real hand moved, the reflection seemed to move the phantom as well, just as if both hands were in place.

##What the eyes saw could change what the phantom felt.## According to Ramachandran, some patients felt the missing hand move, and their pain eased. A bit of cardboard, a mirror and one healthy hand had set a sensation moving that had been stuck for years, at least as he tells it.

A note is needed here. Later trials of mirror therapy have given mixed results. Some patients benefit and others do not. Ramachandran presents the case as showing that pain and perception are built in the brain, and he claims no cure for every patient.

Even so, the plainness of it stands out. A box, a mirror and a few minutes of practice replaced a machine or a drug. The brain had been living with old information that the limb does not move, and it was handed new information it could see.

[[lessons]]
$$**Test a belief instead of arguing with it.** If what you feel is a model your brain builds from its inputs, then changing the input can sometimes change the feeling. Someone who keeps thinking "I can't give presentations" could stop debating the sentence in their head and speak for two minutes at a small team meeting to see what happens. The result tells you far more than repeating the thought one more time, and it shows you what to try next.$$

[[reflect]]
&&Which belief that you keep repeating to yourself could you test by putting new evidence in front of you, instead of arguing with it?&&

[[use]]
%%context:social | A friend has had a lingering pain for a long time and feels hopeless :: "I read about a neuroscientist who used a mirror box on phantom pain. Maybe it's worth asking a specialist about newer approaches."%%

%%context:self | You keep telling yourself the same story about a failure :: "I'll write it down again, this time only what actually happened and what didn't."%%

%%context:meeting | A colleague is sure the plan cannot work :: "Can we try a small version of it and see what happens?"%%

[[pocket]]
@@Pain and perception are built by the brain, so changing what it sees can change what it feels.@@
````

### Español (`es`)

- **Kategori:** Psicología
- **Kitap:** Secretos del cerebro
- **Başlık:** La caja de espejos
- **Kanca (hook):** ¿Puede lo que ves cambiar lo que sientes?

**1 dakikalık özet:**

> Una caja con un espejo en el centro fue la herramienta con la que V.S. Ramachandran trabajó con pacientes amputados, según cuenta en The Tell-Tale Brain. El paciente veía el reflejo de su mano sana donde estaría la ausente, y así aparecían dos manos. Según Ramachandran, algunos sintieron que la mano ausente se movía y su dolor disminuyó. Los ensayos posteriores con terapia de espejo dan resultados dispares: a unos les ayuda y a otros no. Él lo presenta como muestra de que el dolor y la percepción se construyen en el cerebro, sin sostener que sea una cura universal.

**Okuma sayfası metni (ham işaretleme):**

````text
[[open]]
Un fantasma que duele: así describen muchas personas la mano que ya no tienen. Un neurocientífico decidió tratarlo con algo muy poco sofisticado, una caja, y acabó mostrando algo sobre cómo el cerebro fabrica lo que sentimos.

[[story]]
Una caja con un espejo en el centro: esa es la herramienta con la que V.S. Ramachandran trabajó con pacientes amputados, según cuenta en *The Tell-Tale Brain*. El paciente metía la mano sana en un lado y veía su reflejo en el lugar donde estaría la mano ausente. Delante de sus ojos aparecían dos manos.

Las personas que pierden un brazo o una pierna suelen seguir notando el miembro que falta. Es el miembro fantasma. En algunos casos, el fantasma queda atascado en una postura incómoda, por ejemplo con el puño cerrado, y no hay forma de abrirlo. El paciente quiere, pero la mano que ya no existe no obedece.

Ramachandran propuso una explicación. Tras la pérdida, el cerebro conserva el mapa del miembro y puede haber aprendido que ese miembro no se mueve. Si es así, hacía falta una información nueva que contradijera la antigua, y el espejo la proporcionaba por la vista.

Cuando el paciente movía la mano real, el reflejo parecía mover también el fantasma, como si las dos manos estuvieran donde debían. ##La vista le daba al cerebro la noticia que le faltaba.## Según lo que cuenta Ramachandran, algunos pacientes sintieron que la mano ausente se movía y que su dolor disminuía.

Hay que añadir que los ensayos posteriores con terapia de espejo arrojan resultados dispares: a unos les ayuda y a otros no. Ramachandran presenta el caso como muestra de que el dolor y la percepción se construyen en el cerebro, sin sostener que sea una cura universal.

Aun así, destaca la sencillez del recurso. Una caja, un espejo y unos minutos de práctica ocuparon el lugar de una máquina o un medicamento. El cerebro vivía con una información antigua, que el miembro no se mueve, y recibió otra nueva que podía ver con sus propios ojos.

[[lessons]]
$$**Convierte tu creencia en una prueba pequeña.** Si lo que sientes se construye con la información que recibe tu cerebro, otra información puede cambiar la sensación. Alguien que se repite "no sé hablar en público" puede dejar de discutir consigo mismo y presentar durante dos minutos un tema que domina ante tres compañeros. Lo que ocurra le dirá más que otra repetición de la frase y le dará una pista de lo siguiente que ensayar.$$

[[reflect]]
&&¿Qué idea fija sobre ti o sobre tu trabajo podrías contrastar esta semana con un dato concreto, en vez de seguir dándole vueltas?&&

[[use]]
%%context:social | Una amiga lleva meses con un dolor que no remite y se desanima :: "Leí sobre un caso de dolor fantasma tratado con una caja con espejo. Quizá un especialista conozca enfoques nuevos."%%

%%context:self | Te repites la misma versión de un tropiezo :: "Voy a escribir qué ocurrió realmente, sin adornos, y mirar si coincide con lo que me digo."%%

%%context:meeting | Un colega está convencido de que la propuesta no servirá :: "Hagamos una prueba pequeña y decidimos con lo que veamos."%%

[[pocket]]
@@Tu cerebro construye lo que sientes con lo que ve: cambiar lo visto puede cambiar lo sentido.@@
````

### Deutsch (`de`)

- **Kategori:** Psychologie
- **Kitap:** Geheimnisse des Gehirns
- **Başlık:** Die Spiegelbox
- **Kanca (hook):** Kann das, was du siehst, verändern, was du spürst?

**1 dakikalık özet:**

> Wer ein Glied verliert, spürt es oft weiter. V.S. Ramachandran berichtet in The Tell-Tale Brain von Patienten, deren Phantomhand als Faust feststeckte. Er baute eine Kiste mit einem Spiegel in der Mitte: Der Patient sah das Spiegelbild der gesunden Hand dort, wo die fehlende wäre. Nach seinem Bericht spürten einige, dass sich die fehlende Hand bewegte, und der Schmerz ließ nach. Spätere Studien zur Spiegeltherapie fielen unterschiedlich aus. Er stellt den Fall als Beleg dar, dass Schmerz und Wahrnehmung im Gehirn entstehen, und beansprucht keine Heilung für alle.

**Okuma sayfası metni (ham işaretleme):**

````text
[[open]]
Ein Phantom, das wehtut: So beschreiben viele Menschen die Hand, die sie nicht mehr haben. Ein Neurowissenschaftler wollte das mit etwas sehr Schlichtem behandeln, mit einer Kiste, und zeigte dabei, wie das Gehirn macht, was wir empfinden.

[[story]]
Am Anfang steht eine Annahme. V.S. Ramachandran, der in *The Tell-Tale Brain* von seiner Arbeit mit Amputierten berichtet, vermutete, dass das Gehirn nach dem Verlust eines Gliedes dessen Landkarte behält und womöglich gelernt hat, dass sich das Glied nicht bewegt.

Das passte zu dem, was manche seiner Patienten schilderten. Wer einen Arm oder ein Bein verliert, spürt es oft weiter, als Phantomglied. Bei einigen steckt es in einer unbequemen Haltung fest, etwa als geballte Faust, die sich nicht öffnen lässt. Der Patient will, aber die Hand, die es nicht mehr gibt, gehorcht nicht.

Wenn das Gehirn die alte Information festhält, braucht es eine neue, die dagegenhält. Ramachandran baute dafür eine Kiste mit einem Spiegel in der Mitte. Der Patient legt die gesunde Hand auf die eine Seite und sieht ihr Spiegelbild dort, wo die fehlende Hand wäre, sodass vor seinen Augen zwei Hände erscheinen. Bewegt er die echte Hand, scheint das Spiegelbild das Phantom mitzubewegen. ##Die Augen lieferten dem Gehirn die Nachricht, die ihm fehlte.##

Nach Ramachandrans Bericht spürten einige Patienten, dass sich die fehlende Hand bewegte, und der Schmerz ließ nach. Dazu gehört eine Einschränkung: Spätere Studien zur Spiegeltherapie fielen unterschiedlich aus, manchen hilft sie, anderen nicht. Ramachandran stellt den Fall, wie er ihn erzählt, als Beleg dafür dar, dass Schmerz und Wahrnehmung im Gehirn entstehen, und beansprucht keine Heilung für alle.

Bemerkenswert bleibt die Schlichtheit des Aufbaus. Eine Kiste, ein Spiegel und ein paar Minuten Übung standen an der Stelle einer Maschine oder eines Medikaments. Das Gehirn hatte mit einer alten Information gelebt, dass sich das Glied nicht bewegt, und bekam eine neue, die es mit eigenen Augen sah.

[[lessons]]
$$**Mach aus einer Überzeugung einen kleinen Test.** Wenn dein Empfinden aus dem entsteht, was dein Gehirn an Informationen bekommt, kann eine andere Information das Gefühl verändern. Wer sich ständig sagt „Ich kann nicht vor Leuten sprechen“, könnte aufhören, mit sich zu diskutieren, und zwei Minuten lang vor drei Kollegen ein Thema vortragen, das er beherrscht. Was dabei geschieht, sagt ihm mehr als die hundertste Wiederholung des Satzes und liefert einen Hinweis für den nächsten Versuch.$$

[[reflect]]
&&Welche feste Annahme über dich oder deine Arbeit könntest du diese Woche mit einer konkreten Beobachtung prüfen, statt weiter darüber zu grübeln?&&

[[use]]
%%context:social | Eine Freundin hat seit Monaten einen Schmerz, der nicht weggeht, und verliert den Mut :: "Ich habe von einem Fall gelesen, bei dem Phantomschmerz mit einem Spiegelkasten behandelt wurde. Vielleicht kennt ein Facharzt neue Ansätze."%%

%%context:self | Du erzählst dir immer dieselbe Version eines Fehlschlags :: "Ich schreibe auf, was wirklich geschah, ohne Ausschmückung, und sehe, ob es zu dem passt, was ich mir sage."%%

%%context:meeting | Ein Kollege ist sicher, dass der Vorschlag nicht funktioniert :: "Probieren wir eine kleine Version aus und entscheiden nach dem, was wir sehen."%%

[[pocket]]
@@Dein Gehirn baut Empfindung aus dem, was es sieht: Ändere das Gesehene, und das Gefühl kann sich ändern.@@
````

---

## Sağlık / Health — #1701

- **Yazar:** Atul Gawande (2009)
- **Okuma süresi:** 3 dk
- **Viral puan:** 91 / 100 (750 hikâye içinde 9. sıra)

### Türkçe (`tr`)

- **Kategori:** Sağlık
- **Kitap:** The Checklist Manifesto
- **Başlık:** Basit Bir Kontrol Listesi Kaç Hayat Kurtarabilir?
- **Kanca (hook):** Senin işinde kısa bir kontrol listesi hangi pahalı ya da tehlikeli hatayı önleyebilir?

**1 dakikalık özet:**

> Dünya Sağlık Örgütü ekibi, ameliyathanelerde unutulan küçük adımların ciddi sonuçlar doğurduğunu görünce yalnızca 19 maddelik bir kontrol listesi hazırladı. Liste; hastanın kimliğini, ameliyat bölgesini, antibiyotiği, ekip üyelerinin birbirini tanımasını ve operasyon sonunda alet sayımını yüksek sesle doğrulatıyordu. Çalışmada komplikasyon oranı yüzde 11'den 7'ye, hastane içi ölüm oranı yüzde 1,5'tan 0,8'e düştü; araştırma bunun liste uygulamasıyla ilişkili olduğunu bildirdi.

**Okuma sayfası metni (ham işaretleme):**

````text
[[open]]
Bir ameliyathanede ilk kesiden önce ekibin herkesi sırayla adını ve görevini yüksek sesle söyledi. Bu, 19 maddelik bir listenin sıradan satırlarından biriydi. O listeyi yazanlar, havacılığın bir uçak kazasından çıkardığı derse bakmıştı.

[[story]]
Atul Gawande'nin *The Checklist Manifesto* kitabında bir cerrah, ameliyathanelerde unutulan küçük adımların ciddi sonuçlar doğurduğunu anlatıyor. Gawande, Dünya Sağlık Örgütü'nün güvenli cerrahi çalışmasında ekibe liderlik etti ve çareyi havacılıkta aradı. Dünyada her yıl yüz milyonlarca ameliyat yapılıyordu ve bu ameliyatların bir kısmı önlenebilir hatalar yüzünden hastaya zarar veriyordu.

Havacılık bu yola 1935'te girmişti. Boeing'in yeni bombardıman uçağı Model 299, bir gazetede "tek bir adamın uçurması için fazla uçak" diye anılmıştı ve deneme uçuşunda düştü. Kumandalardaki bir kilit açılmamıştı. Pilotlar buna daha fazla eğitimle değil, kısa bir kontrol listesiyle karşılık verdi. Sonrasında uçak, tek bir kaza yapmadan 1,8 milyon mil uçtu.

Dünya Sağlık Örgütü ekibi 19 maddelik bir ameliyat listesi hazırladı. Liste üç duraklamaya bölünmüştü: anestezi öncesi, kesi öncesi ve hasta ameliyathaneden çıkmadan önce. Maddeler arasında hastanın kimliğinin ve ameliyat yerinin doğrulanması, antibiyotiğin verildiğinin teyidi, ekip üyelerinin adlarını ve görevlerini yüksek sesle söylemesi ve işlem sonunda aletlerle spançların sayımı vardı.

Liste sekiz kentteki sekiz hastanede denendi: Toronto, Yeni Delhi, Amman, Auckland, Manila, Ifakara, Londra ve Seattle. Liste öncesinde 3.733 hasta, liste uygulanmaya başladıktan sonra ise 3.955 hasta izlendi.

##Büyük komplikasyonlar yüzde 11'den yüzde 7'ye, hastane içi ölümler yüzde 1,5'ten yüzde 0,8'e düştü.##

Bu, listeden önce ve sonrasını karşılaştıran bir çalışmaydı ve ayrı bir kontrol grubu yoktu. Sonraki bazı büyük çalışmalar, Ontario hastanelerindekine benzer biçimde, aynı düşüşü bulamadı. Yine de ameliyathanede bildik adımların bile yüksek sesle doğrulanması, bir deneyimli ekibin yaşayabileceği unutkanlığa karşı basit bir sigorta olarak denendi.

[[lessons]]
$$**Kritik adımları hafızaya bırakmayın, görünür kılın.** Bir bisiklet tamircisi teslimden önce fren ve somunları kısa bir listeyle, yanındaki çırağa sesli okuyarak kontrol edebilir. Yıllarca iş yapmış olması bir somunu atlama ihtimalini sıfırlamaz ve en deneyimli kişi bile günün sonunda aynı hızla, aynı dikkatle çalışamaz. Liste yeteneğin yerine geçmez, yorgun bir günde de yetenek aynı adımları atsın diye yanında durur.$$

[[reflect]]
&&Kendi işinizde hangi pahalı ya da tehlikeli hata, yanınızdaki biriyle birlikte yüksek sesle okuyacağınız kısa bir listeyle önlenebilir?&&

[[use]]
%%context:meeting | Aynı teslim öncesi hata iki kez yaşandı. :: "Ameliyathanede bildik adımlar bile yüksek sesle doğrulanıyordu. Biz de her teslimden önce beş maddelik bir listeyi sesli okuyalım."%%

%%context:oneonone | Deneyimli bir iş arkadaşınız listeyi gereksiz buluyor. :: "Listeyi seni sınamak için değil, yorgun bir günde ikimizi korumak için istiyorum. Hangi üç adım hiç atlanmamalı?"%%

%%context:self | Hep aynı adımı atlıyorsunuz. :: "Bu adımı bir karta yazıyorum ve işe başlamadan önce yüksek sesle okuyorum."%%

[[pocket]]
@@Ameliyathanede bildik adımlar bile yüksek sesle okundu: unutulunca en pahalıya patlayan adımları yazın.@@
````

### English (`en`)

- **Kategori:** Health
- **Kitap:** The Checklist Manifesto
- **Başlık:** How Many Lives Can a Simple Checklist Save?
- **Kanca (hook):** Which expensive or dangerous mistake in your work could a short checklist prevent?

**1 dakikalık özet:**

> A World Health Organization team saw that missed routine steps in operating rooms could produce severe consequences, so it designed a nineteen-item checklist. Teams confirmed patient identity, surgical site, antibiotics, names and roles, and the final count of instruments aloud rather than trusting memory. Complications fell from 11 percent to 7 percent and in-hospital deaths from 1.5 percent to 0.8 percent; the study reported an association with checklist use.

**Okuma sayfası metni (ham işaretleme):**

````text
[[open]]
In one operating room, everyone on the team said their name and role aloud before the first cut. It was one ordinary line on a 19-item list. The people who wrote that list had looked at what aviation learned from a plane crash.

[[story]]
In Atul Gawande's *The Checklist Manifesto*, a surgeon describes how small steps forgotten in operating rooms can have serious consequences. Gawande led a World Health Organization surgical safety effort, and the team looked to aviation for a remedy. Hundreds of millions of operations are performed worldwide each year, and some of them harm patients through avoidable mistakes.

Aviation had set out on that road in 1935. Boeing's new Model 299 bomber, which a newspaper had called too much airplane for one man to fly, crashed on a test flight. A lock on the controls had not been released. The pilots answered with a short checklist, not with more training. The plane then flew 1.8 million miles without a single accident.

The WHO team made a 19-item surgical list. It was split into three pauses: before anaesthesia, before the incision, and before the patient leaves the operating room. Among the items were confirming the patient's identity and the surgical site, confirming that antibiotics had been given, team members saying their names and roles aloud, and counting instruments and sponges at the end.

The list was tried in eight hospitals in eight cities: Toronto, New Delhi, Amman, Auckland, Manila, Ifakara, London and Seattle. Before the list, 3,733 patients were followed, and after it came into use, 3,955.

##Major complications fell from 11 percent to 7 percent, and inpatient deaths from 1.5 percent to 0.8 percent.##

This was a comparison of before and after, with no separate control group. Some later large studies, such as one in Ontario hospitals, did not find the same drop. Still, having a team read even familiar steps aloud was tried as a plain insurance against the forgetfulness that experienced people are prone to.

[[lessons]]
$$**Make the critical steps visible instead of trusting memory.** A bicycle mechanic might check brakes and wheel nuts against a short list, reading it aloud to the apprentice beside him before hand-over. Years in the trade do not reduce the chance of skipping a nut to zero, and even the most experienced person is not equally sharp at the end of a long day. The list does not replace skill, it stands beside it so that on a tired day skill takes the same steps.$$

[[reflect]]
&&In your own work, which expensive or dangerous mistake could a short list, read aloud with someone beside you, prevent?&&

[[use]]
%%context:meeting | The same pre-delivery mistake has happened twice. :: "In the operating room even familiar steps were read aloud. Let's read a five-item list out loud before every delivery."%%

%%context:oneonone | An experienced colleague thinks a checklist is beneath them. :: "I'm not asking for the list to test you, but to protect both of us on a tired day. Which three steps must never be skipped?"%%

%%context:self | You keep skipping the same step. :: "I'm writing that step on a card and reading it aloud before I start."%%

[[pocket]]
@@In the operating room even familiar steps were read aloud: write down the steps that cost the most when forgotten.@@
````

### Español (`es`)

- **Kategori:** Salud
- **Kitap:** The Checklist Manifesto
- **Başlık:** ¿Cuántas vidas puede salvar una lista sencilla?
- **Kanca (hook):** ¿Qué error caro o peligroso de tu trabajo podría evitar una lista breve?

**1 dakikalık özet:**

> Un equipo de la Organización Mundial de la Salud observó que pequeños pasos olvidados en el quirófano podían tener consecuencias graves y diseñó una lista de diecinueve puntos. El personal confirmaba en voz alta la identidad, la zona de operación, los antibióticos, los nombres del equipo y el recuento final de instrumentos. Las complicaciones bajaron del 11 al 7 por ciento y las muertes hospitalarias del 1,5 al 0,8; el estudio encontró una asociación con el uso de la lista.

**Okuma sayfası metni (ham işaretleme):**

````text
[[open]]
En un quirófano, antes del primer corte, todo el equipo dijo en voz alta su nombre y su función. Era una línea corriente de una lista de 19 puntos. Quienes la escribieron habían mirado lo que la aviación aprendió de un accidente aéreo.

[[story]]
En *The Checklist Manifesto*, de Atul Gawande, un cirujano cuenta cómo los pequeños pasos olvidados en los quirófanos pueden tener consecuencias graves. Gawande dirigió un esfuerzo de seguridad quirúrgica de la Organización Mundial de la Salud, y el equipo buscó el remedio en la aviación. Cada año se realizan cientos de millones de operaciones en el mundo, y algunas de ellas dañan a los pacientes por errores evitables.

La aviación había emprendido ese camino en 1935. El nuevo bombardero Model 299 de Boeing, que un periódico había calificado de demasiado avión para un solo hombre, se estrelló en un vuelo de prueba. No se había soltado un bloqueo de los mandos. Los pilotos respondieron con una lista de comprobación breve, no con más entrenamiento. El avión voló luego 1,8 millones de millas sin un solo accidente.

El equipo de la OMS hizo una lista quirúrgica de 19 puntos. Estaba dividida en tres pausas: antes de la anestesia, antes de la incisión y antes de que el paciente salga del quirófano. Entre los puntos estaban confirmar la identidad del paciente y la zona operatoria, confirmar que se habían administrado antibióticos, que los miembros del equipo dijeran en voz alta sus nombres y funciones, y contar instrumentos y gasas al final.

La lista se probó en ocho hospitales de ocho ciudades: Toronto, Nueva Delhi, Amán, Auckland, Manila, Ifakara, Londres y Seattle. Antes de la lista se siguió a 3.733 pacientes y, cuando entró en uso, a 3.955.

##Las complicaciones graves bajaron del 11 por ciento al 7 por ciento, y las muertes hospitalarias, del 1,5 por ciento al 0,8 por ciento.##

Fue una comparación de antes y después, sin un grupo de control aparte. Algunos estudios grandes posteriores, como uno en hospitales de Ontario, no encontraron el mismo descenso. Aun así, que el equipo leyera en voz alta incluso los pasos conocidos se probó como un seguro sencillo contra el olvido al que están expuestas las personas con experiencia.

[[lessons]]
$$**Haz visibles los pasos críticos en lugar de fiarte de la memoria.** Un mecánico de bicicletas puede comprobar frenos y tuercas de las ruedas con una lista corta, leyéndosela en voz alta al aprendiz que tiene al lado antes de entregar la bici. Los años de oficio no reducen a cero la posibilidad de saltarse una tuerca, y ni la persona más experimentada está igual de despierta al final de una jornada larga. La lista no sustituye a la destreza, la acompaña para que un día de cansancio la destreza dé los mismos pasos.$$

[[reflect]]
&&En tu propio trabajo, ¿qué error caro o peligroso podría evitar una lista corta leída en voz alta con alguien a tu lado?&&

[[use]]
%%context:meeting | El mismo error previo a la entrega ha ocurrido dos veces. :: "En el quirófano hasta los pasos conocidos se leían en voz alta. Leamos una lista de cinco puntos en voz alta antes de cada entrega."%%

%%context:oneonone | Un compañero con experiencia cree que una lista no es para él. :: "No te pido la lista para examinarte, sino para protegernos a los dos en un día cansado. ¿Qué tres pasos no se pueden saltar nunca?"%%

%%context:self | Siempre te saltas el mismo paso. :: "Escribo ese paso en una tarjeta y lo leo en voz alta antes de empezar."%%

[[pocket]]
@@En el quirófano se leyeron en voz alta hasta los pasos conocidos: anota los que más cuestan cuando se olvidan.@@
````

### Deutsch (`de`)

- **Kategori:** Gesundheit
- **Kitap:** The Checklist Manifesto
- **Başlık:** Wie viele Leben kann eine einfache Checkliste retten?
- **Kanca (hook):** Welchen teuren oder gefährlichen Fehler könnte eine kurze Checkliste in deiner Arbeit verhindern?

**1 dakikalık özet:**

> Ein Team der Weltgesundheitsorganisation erkannte, dass vergessene Routinepunkte im Operationssaal schwere Folgen haben konnten, und entwickelte eine Liste mit neunzehn Punkten. Die Teams bestätigten Identität, Eingriffsstelle, Antibiotika, Namen und Rollen sowie die Instrumentenzählung laut, statt sich nur auf das Gedächtnis zu verlassen. Komplikationen sanken von 11 auf 7 Prozent, Todesfälle im Krankenhaus von 1,5 auf 0,8 Prozent; die Studie berichtete einen Zusammenhang mit der Checkliste.

**Okuma sayfası metni (ham işaretleme):**

````text
[[open]]
In einem Operationssaal sagte vor dem ersten Schnitt das ganze Team reihum seinen Namen und seine Aufgabe laut. Es war eine gewöhnliche Zeile einer Liste mit 19 Punkten. Wer diese Liste geschrieben hatte, hatte sich angesehen, was die Luftfahrt aus einem Flugzeugabsturz gelernt hatte.

[[story]]
In Atul Gawandes *The Checklist Manifesto* beschreibt ein Chirurg, wie vergessene kleine Schritte in Operationssälen ernste Folgen haben können. Gawande leitete eine Initiative der Weltgesundheitsorganisation für sichere Chirurgie, und das Team suchte in der Luftfahrt nach einem Mittel. Jedes Jahr werden weltweit Hunderte Millionen Operationen durchgeführt, und manche schaden Patienten durch vermeidbare Fehler.

Die Luftfahrt hatte diesen Weg 1935 eingeschlagen. Boeings neuer Bomber Model 299, den eine Zeitung als zu viel Flugzeug für einen einzelnen Mann bezeichnet hatte, stürzte bei einem Testflug ab. Eine Sperre an den Steuerorganen war nicht gelöst worden. Die Piloten antworteten darauf mit einer kurzen Checkliste statt mit mehr Training. Das Flugzeug flog danach 1,8 Millionen Meilen ohne einen einzigen Unfall.

Das WHO-Team entwarf eine chirurgische Liste mit 19 Punkten. Sie war in drei Pausen gegliedert: vor der Narkose, vor dem Hautschnitt und bevor der Patient den Operationssaal verlässt. Zu den Punkten gehörten die Bestätigung von Identität und Operationsstelle des Patienten, die Bestätigung, dass Antibiotika gegeben wurden, das laute Nennen von Namen und Aufgaben durch die Teammitglieder und am Ende das Zählen von Instrumenten und Tupfern.

Die Liste wurde in acht Krankenhäusern in acht Städten erprobt: Toronto, Neu-Delhi, Amman, Auckland, Manila, Ifakara, London und Seattle. Vor der Liste wurden 3.733 Patienten beobachtet, nach ihrer Einführung 3.955.

##Schwere Komplikationen sanken von 11 Prozent auf 7 Prozent, die Sterblichkeit im Krankenhaus von 1,5 Prozent auf 0,8 Prozent.##

Es war ein Vorher-nachher-Vergleich ohne eigene Kontrollgruppe. Einige spätere große Studien, etwa eine in Krankenhäusern in Ontario, fanden denselben Rückgang nicht. Dennoch wurde erprobt, das Team selbst vertraute Schritte laut vorlesen zu lassen, als einfache Versicherung gegen die Vergesslichkeit, der auch erfahrene Menschen unterliegen.

[[lessons]]
$$**Mach die entscheidenden Schritte sichtbar, statt dem Gedächtnis zu trauen.** Ein Fahrradmechaniker kann Bremsen und Radmuttern vor der Übergabe anhand einer kurzen Liste prüfen und sie dem Lehrling neben sich laut vorlesen. Jahre im Beruf senken die Chance, eine Mutter zu übersehen, nicht auf null, und auch der erfahrenste Mensch ist am Ende eines langen Tages nicht mehr gleich wach. Die Liste ersetzt das Können nicht, sie steht daneben, damit das Können an einem müden Tag dieselben Schritte geht.$$

[[reflect]]
&&Welchen teuren oder gefährlichen Fehler in deiner eigenen Arbeit könnte eine kurze Liste verhindern, die du gemeinsam mit jemandem laut vorliest?&&

[[use]]
%%context:meeting | Derselbe Fehler vor der Übergabe ist schon zweimal passiert. :: "Im Operationssaal wurden sogar vertraute Schritte laut vorgelesen. Lesen wir vor jeder Übergabe eine Liste mit fünf Punkten laut vor."%%

%%context:oneonone | Ein erfahrener Kollege hält eine Checkliste für unter seiner Würde. :: "Ich will die Liste nicht, um dich zu prüfen, sondern um uns beide an einem müden Tag zu schützen. Welche drei Schritte dürfen nie fehlen?"%%

%%context:self | Du lässt immer denselben Schritt aus. :: "Ich schreibe diesen Schritt auf eine Karte und lese ihn vor dem Anfangen laut vor."%%

[[pocket]]
@@Im Operationssaal wurden sogar vertraute Schritte laut gelesen: Schreib die auf, die am meisten kosten, wenn man sie vergisst.@@
````

---

## Tarih / History — #1694

- **Yazar:** Laura Hillenbrand (2001)
- **Okuma süresi:** 3 dk
- **Viral puan:** 90 / 100 (750 hikâye içinde 18. sıra)

### Türkçe (`tr`)

- **Kategori:** Tarih
- **Kitap:** Seabiscuit
- **Başlık:** Seabiscuit Büyük Buhran'a Nasıl Umut Oldu?
- **Kanca (hook):** İnsanların erken vazgeçtiği hangi yeteneğin doğru ortamda yeniden parlayabileceğini düşünüyorsun?

**1 dakikalık özet:**

> Seabiscuit yarış kariyerine 17 yenilgiyle başladı; küçük, huysuz ve büyük beklenti yaratmayan bir attı. Otomobil satıcılığından gelen sahibi Charles Howard, sessiz eğitmen Tom Smith ve sakatlıklarla boğuşan jokey Red Pollard onda başkalarının göremediği bir direnç gördü. Dışarıdan bakıldığında sonuç ani görünse de arkasında uzun hazırlık, belirsizlik ve peş peşe verilen küçük kararlar vardı. Seabiscuit yarışı açık farkla kazanarak Büyük Buhran yıllarında sıradan insanların bağ kurduğu bir umut simgesine dönüştü.

**Okuma sayfası metni (ham işaretleme):**

````text
[[open]]
Tom Smith atına zil sesiyle koşmayı öğretti. Karşısındaki, Triple Crown şampiyonu bir atın sahibiydi ve yarışın zille başlamasını Seabiscuit'in tarafı şart koşmuştu. Küçük, dizleri çıkıntılı bir at için bu, sahadaki en büyük pazarlıktı.

[[story]]
Laura Hillenbrand'ın *Seabiscuit* kitabında bu at, şampiyon görünümünden çok uzaktı. Efsanevi Man o' War'un torunuydu ama küçüktü, dizleri çıkıntılıydı ve uyumayı da yemeyi de severdi. Sunny Jim Fitzsimmons'un çalıştırdığı ilk yıllarında yarışları çoğunlukla kaybetti.

Charles Howard onu 8.000 dolara satın aldı. Howard, bisiklet tamirciliğinden otomobil satıcılığına geçmiş bir adamdı. Atı, pek tanınmayan ve az konuşan eğitmen Tom Smith'e verdi. Seabiscuit'in sırtına ise bir gözü görmeyen jokey Red Pollard bindi.

Seabiscuit kazanmaya başladı. Kısa sürede halkın en çok görmek istediği karşılaşma belli oldu: 1937 Triple Crown şampiyonu War Admiral'a karşı özel bir yarış. Rakip de Man o' War'un oğluydu. War Admiral favoriydi ve bahislerde 1'e 4 oynanıyordu. Bütün ülke bu yarışı bekliyordu.

Yarış 1 Kasım 1938'de Pimlico'da, yaklaşık bir mil ve on altıda üç mesafede koşulacaktı. Seabiscuit'in tarafı, yarışın start kapısından değil zil sesiyle başlaması şartıyla kabul etti ve karşı taraf bunu onayladı. Pazarlığı Howard yürüttü. Smith atı çalıştırırken onu zile alıştırdı. Böylece Seabiscuit, çıkış anında tam olarak ne bekleyeceğini bilerek yarışa girecekti.

Pollard'ın bacağı kırıktı, bu yüzden Seabiscuit'e George Woolf bindi. Pollard ona bir yol tarif etmişti: hemen öne geç, sonra atı dizginle ve War Admiral'ın yetişmesine izin ver.

##Zil çaldığı anda Seabiscuit öne fırladı.## War Admiral yetişti, yan yana koştular. Sonra düzlükte Seabiscuit açıldı ve yarışı dört boy farkla kazandı. Büyük Buhran yıllarında bütün ülke bu karşılaşmayı radyodan dinlemişti. Birkaç yıl önce yarışları çoğunlukla kaybeden, kimsenin üzerinde durmadığı at, bir anda herkesin tuttuğu at olmuştu.

[[lessons]]
$$**Güçlü olduğunuz koşulları pazarlıkta isteyin.** Serbest çalışan bir tasarımcı, küçük parçalarda iyi iş çıkarıyor ama tek bir büyük teslim tarihinde bunalıyorsa, müşteriye işi haftalık teslimlere bölmeyi önerebilir. Bu istek bir kayırma talebi olmaz, işin hangi biçimde yürüyeceğine dair makul bir şarttır. Müşteri kabul etmese bile tasarımcı hangi düzende daha iyi çalıştığını açıkça söylemiş olur ve bu bilgiyi bir sonraki sözleşmede de kullanabilir. Üstelik kendi güçlü yanını bilmek, ilk teklifi kabul etmeden önce durup sormayı kolaylaştırır.$$

[[reflect]]
&&Önümüzdeki işte hangi çalışma biçimi sizi en iyi sonuca götürür ve bunu şartları belirleyen kişiye nasıl söylerdiniz?&&

[[use]]
%%context:meeting | Bir ay sonraki büyük teslim tarihi ekibi bunaltıyor. :: "Seabiscuit'in tarafı yarışın zille başlamasını istemişti. Biz de teslimi iki haftalık parçalara bölelim, çünkü ekip kısa turlarda daha iyi çalışıyor."%%

%%context:oneonone | Bir arkadaşınız çalışma şekline uymayan bir işi kabul etmek üzere. :: "En iyi hangi koşulda çalışıyorsun? Teklifi kabul etmeden önce tam olarak onu iste."%%

%%context:self | Bir tür işten hep çekiniyorsunuz. :: "Bu hafta o işe, en iyi başladığım saatte oturacağım ve takvimde o saati isteyeceğim."%%

[[pocket]]
@@Seabiscuit'in tarafı yarışın zille başlamasını istedi: nerede güçlü olduğunuzu bilin, o koşulu isteyin.@@
````

### English (`en`)

- **Kategori:** History
- **Kitap:** Seabiscuit
- **Başlık:** How Seabiscuit Became a Depression-Era Symbol of Hope
- **Kanca (hook):** What overlooked ability do you think could flourish if it finally found the right environment?

**1 dakikalık özet:**

> Seabiscuit opened his racing life with seventeen straight losses and looked too small and difficult to become a champion. Owner Charles Howard, quiet trainer Tom Smith, and injury-plagued jockey Red Pollard saw resilience where others saw an ordinary horse. The result looked sudden from the outside, but it rested on preparation, uncertainty, and a chain of small decisions. Seabiscuit won decisively and became a hopeful underdog for Americans living through the Great Depression.

**Okuma sayfası metni (ham işaretleme):**

````text
[[open]]
Charles Howard paid $8,000 for a small, knobby-kneed horse that mostly lost. A few years later that horse stood against a Triple Crown champion, and the one thing his side insisted on was how the race would start: with a bell instead of a gate.

[[story]]
In Laura Hillenbrand's *Seabiscuit*, the horse looks nothing like a champion. He was a grandson of the great Man o' War, yet he was small, his knees were knobby, and he liked sleeping and eating. In his early years under trainer Sunny Jim Fitzsimmons, he mostly lost.

Howard had moved from repairing bicycles to selling cars. He bought the horse for $8,000 and handed him to Tom Smith, a trainer who was little known and said little. On Seabiscuit's back sat Red Pollard, a jockey who was blind in one eye.

Seabiscuit began to win. Soon the race the public wanted was clear: a match against War Admiral, the Triple Crown winner of 1937. His rival was also a son of Man o' War, and he was the favourite at odds of 1 to 4. The whole country was waiting.

It was to be run at Pimlico on November 1, 1938, over about a mile and three sixteenths. Seabiscuit's side agreed to it on one condition: a walk-up start, begun by a bell instead of a starter's flag. The other side accepted. Smith got his horse used to breaking at the sound of that bell, so that Seabiscuit would know exactly what to listen for at the start.

Pollard had a broken leg, so George Woolf rode instead. Pollard gave him a plan: take the lead fast, then hold Seabiscuit in check and let War Admiral catch up.

##When the bell rang, Seabiscuit lunged ahead at once.## War Admiral caught up and the two ran level. Then, in the stretch, Seabiscuit pulled clear and won by four lengths. The country followed it on the radio in the middle of the Depression, and a horse nobody had looked at twice became the one everybody was cheering for.

[[lessons]]
$$**Ask for the conditions where your strength shows.** A freelance designer who does good work in short stretches but freezes at a single big deadline can propose splitting the job into weekly deliveries. That request is a reasonable term for how the work gets done, not a favour. Even if the client says no, the designer has stated plainly which arrangement brings out their best work, and can ask for it again when the next contract comes. Knowing your own strong conditions also makes it easier to pause before accepting the first offer.$$

[[reflect]]
&&Which working arrangement on your next task would show your strengths best, and how would you put the request to whoever sets the terms?&&

[[use]]
%%context:meeting | A big deadline a month away is overwhelming the team. :: "Seabiscuit's side insisted the race start with a bell. Let's split this into two-week deliveries too, because this team does its best work in short rounds."%%

%%context:oneonone | A friend is about to accept a job on terms that don't suit how they work. :: "Under which conditions do you do your best work? Ask for exactly that before you say yes."%%

%%context:self | You always dread one kind of task. :: "This week I'll sit down to it at the hour I start best, and I'll ask for that slot in my calendar."%%

[[pocket]]
@@Seabiscuit's side asked for a bell start: know where you are strong, and ask for that condition.@@
````

### Español (`es`)

- **Kategori:** Historia
- **Kitap:** Seabiscuit
- **Başlık:** Cómo Seabiscuit dio esperanza durante la Gran Depresión
- **Kanca (hook):** ¿Qué talento ignorado podría destacar si encontrara por fin el ambiente adecuado?

**1 dakikalık özet:**

> Seabiscuit comenzó su carrera con diecisiete derrotas consecutivas y parecía demasiado pequeño e indócil para ser campeón. El propietario Charles Howard, el reservado entrenador Tom Smith y el jinete Red Pollard, marcado por las lesiones, descubrieron una resistencia que otros habían ignorado. Seabiscuit ganó con claridad y se convirtió en el símbolo del perdedor que todavía podía levantarse durante la Gran Depresión.

**Okuma sayfası metni (ham işaretleme):**

````text
[[open]]
Red Pollard, jockey ciego de un ojo, montaba a un caballo pequeño de rodillas nudosas que casi siempre perdía. Años después, ese caballo se enfrentó a un campeón de la Triple Corona, y su equipo puso una sola condición sobre cómo empezaría la carrera: una campana en lugar de una puerta de salida.

[[story]]
En *Seabiscuit*, de Laura Hillenbrand, el caballo no tiene nada de campeón. Era nieto del legendario Man o' War, pero pequeño, de rodillas nudosas, y le gustaba dormir y comer. En sus primeros años, con el entrenador Sunny Jim Fitzsimmons, perdió casi todas las carreras.

Charles Howard había pasado de reparar bicicletas a vender coches. Compró al caballo por 8.000 dólares y se lo confió a Tom Smith, un entrenador poco conocido y de pocas palabras. Sobre el lomo de Seabiscuit iba Red Pollard, que no veía de un ojo.

Seabiscuit empezó a ganar. Pronto quedó claro qué carrera quería ver el público: un duelo con War Admiral, ganador de la Triple Corona de 1937. Su rival también era hijo de Man o' War y el favorito, con una cuota de 1 a 4. Todo el país esperaba la carrera.

Se correría en Pimlico el 1 de noviembre de 1938, sobre algo más de una milla. El equipo de Seabiscuit la aceptó con una condición: una salida lanzada, dada por una campana y no por una bandera de salida. La otra parte lo aceptó. Smith acostumbró a su caballo a arrancar al sonido de esa campana, de modo que Seabiscuit supiera exactamente qué escuchar en la salida.

Pollard tenía una pierna rota, así que montó George Woolf. Pollard le dio un plan: tomar la delantera rápido, después contener a Seabiscuit y dejar que War Admiral lo alcanzara.

##Cuando sonó la campana, Seabiscuit se lanzó de inmediato hacia delante.## War Admiral lo alcanzó y corrieron a la par. Luego, en la recta final, Seabiscuit se despegó y ganó por cuatro cuerpos. El país siguió la carrera por la radio en plena Gran Depresión, y un caballo en el que nadie se había fijado se convirtió en aquel por el que todos animaban.

[[lessons]]
$$**Pide las condiciones en las que tu fuerza se nota.** Una diseñadora autónoma que rinde bien en tramos cortos, pero se bloquea ante una única fecha de entrega enorme, puede proponer dividir el encargo en entregas semanales. Esa petición es una condición razonable sobre cómo se hace el trabajo, no un favor. Aunque el cliente la rechace, ella ya ha dicho con claridad qué formato saca lo mejor de su trabajo y podrá volver a pedirlo cuando llegue el siguiente contrato. Conocer tus propias condiciones fuertes también te ayuda a detenerte antes de aceptar la primera oferta.$$

[[reflect]]
&&¿Qué forma de trabajar en tu próxima tarea mostraría mejor tus puntos fuertes, y cómo se lo pedirías a quien fija las condiciones?&&

[[use]]
%%context:meeting | Una entrega enorme dentro de un mes está agobiando al equipo. :: "El equipo de Seabiscuit exigió que la carrera empezara con una campana. Dividamos esto en entregas de dos semanas, porque este equipo rinde mejor en tramos cortos."%%

%%context:oneonone | Un amigo va a aceptar un trabajo con condiciones que no encajan con su forma de trabajar. :: "¿En qué condiciones trabajas mejor? Pídelo tal cual antes de decir que sí."%%

%%context:self | Siempre te da pereza un tipo concreto de tarea. :: "Esta semana me pondré con ella a la hora en que mejor arranco, y reservaré ese hueco en el calendario."%%

[[pocket]]
@@El equipo de Seabiscuit pidió una salida con campana: sabe dónde eres fuerte y pide esa condición.@@
````

### Deutsch (`de`)

- **Kategori:** Geschichte
- **Kitap:** Seabiscuit
- **Başlık:** Wie Seabiscuit in der Depression Hoffnung gab
- **Kanca (hook):** Welches übersehene Talent könnte deiner Meinung nach in der richtigen Umgebung aufblühen?

**1 dakikalık özet:**

> Seabiscuit begann seine Laufbahn mit siebzehn Niederlagen in Folge und galt als zu klein und schwierig für einen großen Champion. Besitzer Charles Howard, der ruhige Trainer Tom Smith und der verletzungsgeplagte Jockey Red Pollard erkannten eine Ausdauer, die andere übersahen. Seabiscuit gewann deutlich und wurde während der Großen Depression zum Symbol eines Außenseiters, der doch noch aufsteigen konnte.

**Okuma sayfası metni (ham işaretleme):**

````text
[[open]]
Tom Smith brachte seinem Pferd bei, beim Klang einer Glocke loszulaufen. Der Gegner war ein Triple-Crown-Sieger, und dass das Rennen mit einer Glocke beginnen würde, hatte Seabiscuits Seite zur Bedingung gemacht. Für ein kleines Pferd mit knotigen Knien war das die wichtigste Verhandlung.

[[story]]
In Laura Hillenbrands *Seabiscuit* sieht das Pferd zunächst nicht nach einem Champion aus. Es war ein Enkel des großen Man o' War, aber klein, hatte knotige Knie und schlief und fraß gern. In seinen ersten Jahren unter dem Trainer Sunny Jim Fitzsimmons verlor es die meisten Rennen.

Charles Howard war vom Fahrradmechaniker zum Autoverkäufer geworden. Er kaufte das Pferd für 8.000 Dollar und übergab es Tom Smith, einem wenig bekannten und schweigsamen Trainer. Im Sattel saß Red Pollard, ein Jockey, der auf einem Auge blind war.

Seabiscuit begann zu gewinnen. Bald stand fest, welches Rennen das Publikum sehen wollte: ein Duell mit War Admiral, dem Triple-Crown-Sieger von 1937. Der Gegner war ebenfalls ein Sohn von Man o' War und der Favorit mit einer Quote von 1 zu 4. Das ganze Land wartete.

Es sollte am 1. November 1938 in Pimlico über gut eine Meile stattfinden. Seabiscuits Seite stimmte unter einer Bedingung zu: ein Start aus der Bewegung, der von einer Glocke ausgelöst wird und nicht von einer Startflagge. Die Gegenseite willigte ein. Smith gewöhnte sein Pferd daran, beim Ton dieser Glocke loszulaufen, damit Seabiscuit am Start genau wusste, worauf er zu hören hatte.

Pollard hatte ein gebrochenes Bein, deshalb ritt George Woolf. Pollard gab ihm einen Plan mit: schnell in Führung gehen, dann Seabiscuit zurückhalten und War Admiral herankommen lassen.

##Als die Glocke läutete, schoss Seabiscuit sofort nach vorn.## War Admiral holte auf, und beide liefen auf gleicher Höhe. Dann, auf der Zielgeraden, zog Seabiscuit davon und gewann mit vier Längen. Das Land verfolgte das Rennen mitten in der Weltwirtschaftskrise im Radio, und ein Pferd, auf das kaum jemand geachtet hatte, wurde zu dem, dem alle zujubelten.

[[lessons]]
$$**Verlange die Bedingungen, unter denen deine Stärke sichtbar wird.** Eine freiberufliche Designerin, die in kurzen Abschnitten gute Arbeit liefert, bei einem einzigen großen Abgabetermin aber blockiert, kann vorschlagen, den Auftrag in wöchentliche Lieferungen zu teilen. Das ist eine vernünftige Bedingung dafür, wie die Arbeit abläuft, und keine Gefälligkeit. Selbst wenn der Kunde ablehnt, hat sie klar benannt, welche Form das Beste aus ihr herausholt, und kann beim nächsten Vertrag erneut darum bitten. Wer seine starken Bedingungen kennt, hält vor der ersten Zusage leichter kurz inne.$$

[[reflect]]
&&Welche Arbeitsweise bei deiner nächsten Aufgabe würde deine Stärken am besten zeigen, und wie würdest du sie bei dem verlangen, der die Bedingungen festlegt?&&

[[use]]
%%context:meeting | Ein großer Abgabetermin in einem Monat überfordert das Team. :: "Seabiscuits Seite bestand darauf, dass das Rennen mit einer Glocke beginnt. Teilen wir das hier auch in Lieferungen alle zwei Wochen, denn dieses Team arbeitet in kurzen Runden am besten."%%

%%context:oneonone | Ein Freund will einen Job annehmen, dessen Bedingungen nicht zu seiner Arbeitsweise passen. :: "Unter welchen Bedingungen arbeitest du am besten? Verlang genau das, bevor du zusagst."%%

%%context:self | Vor einer bestimmten Art von Aufgabe drückst du dich immer. :: "Diese Woche setze ich mich zu der Uhrzeit daran, zu der ich am besten loskomme, und trage mir diesen Slot in den Kalender ein."%%

[[pocket]]
@@Seabiscuits Seite verlangte einen Start mit Glocke: Wisse, wo du stark bist, und verlang diese Bedingung.@@
````

---

## Büyüme / Growth — #1284

- **Yazar:** Paulo Coelho (1988)
- **Okuma süresi:** 3 dk
- **Viral puan:** 90 / 100 (750 hikâye içinde 19. sıra)

### Türkçe (`tr`)

- **Kategori:** Büyüme
- **Kitap:** Simyacı
- **Başlık:** Yabani İncirin Altında Kazmak
- **Kanca (hook):** Aradığın şey, yola çıktığın yerin yanında olsaydı, bunu yolculuk olmadan anlar mıydın?

**1 dakikalık özet:**

> Santiago uzun bir yolculuktan sonra Mısır piramitlerine varır ve kumu kazmaya başlar, ama hiçbir şey çıkmaz. Altın arayan bir grup adam onu döver. Elebaşı, kendi rüyasında hazinenin İspanya'da terk edilmiş bir kilisede, bir yabani incirin yanında yattığını söyler ve bir rüya için çöl geçmeyeceğini ekler. Santiago koyunlarıyla uyuduğu kiliseye döner, ağacın altını kazar ve hazineyi bulur.

**Okuma sayfası metni (ham işaretleme):**

````text
[[open]]
Santiago bir denizi ve bir çölü aşıp piramitlerin dibinde elinde kazmayla duruyor. Kum kazdıkça hiçbir şey vermiyor. Sonra onu bulan adamlar, rüyasındaki hiç kimsenin söylemediği bir şeyi söylüyor ve konuşmanın yönü değişiyor.

[[story]]
Santiago Mısır piramitlerine varana kadar çok şey yaşamıştır. Tanca'da soyulmuş, bir kristal tüccarının dükkânında çalışmıştır. Bir kervanla çölü geçmiş, bir vahada Fatima'yı bekler halde bırakmış ve bir simyacının rehberliğinde yürümüştür. Fatima vahada beklemektedir. Şimdi piramitlerin dibinde bir yer seçer ve kumu kazmaya başlar. Kum hiçbir şey vermez.

Kazarken bir grup adam onu bulur. Santiago'yu döverler ve yanında olduğunu sandıkları altını isterler. Cebinde altın yoktur. Santiago doğruyu söyler: rüyasında gördüğü bir hazineyi aramaktadır.

Adamların elebaşı, kendisinin de tekrar tekrar gördüğü bir rüyası olduğunu söyler. Rüyada hazine İspanya'da terk edilmiş bir kilisede, eski sakristinin içinde bir yabani incir ağacının yanında gömülüdür. Tarif ettiği yer, Santiago'nun koyunlarıyla uyuduğu kilisedir. Böylece aynı hazine için iki ayrı rüya görülmüş olur: Santiago'nunki Mısır'ı, elebaşınınki İspanya'daki kiliseyi gösterir.

Elebaşı, tekrar eden bir rüya yüzünden hiçbir zaman bir çölü geçmeyeceğini de söyler. Rüyasını izlemeye değer bulmaz ve Santiago'yu salıverir.

##Santiago piramitlerden, nerede kazacağını bilerek ayrılır.##

Önünde yine uzun bir yol vardır ama bu kez nereye gideceğini bilir. İspanya'ya, koyunlarıyla uyuyup ilk rüyasını gördüğü terk edilmiş kiliseye döner. Çatısından yabani incir geçen aynı sakristiyi bulur, elindeki küreği ağacın dibine batırır ve kazar. Hazine oradadır. Aklına ilk gelen kişi, vahada bekleyen Fatima olur.

Coelho kitabın neredeyse tamamını Mısır yoluna ayırır, sonu ise yolculuğu başa döndürür. Hazine hiç yer değiştirmemiştir. Yolculuk Santiago'ya hazineyi değil, hazinenin yerini kazandırmıştır. Santiago onun bulunduğu kilisede uyumuş, yerini bilen adam ise onu aramak için evinden hiç çıkmamıştır.

[[lessons]]
$$**Başladığınız yere yeni gözlerle dönün.** Küçük kasabasından büyük bir şehre iş için giden biri, yıllar sonra aynı meydanda durup orada kendisine neler verildiğini ancak o zaman anlayabilir. Orada yaşarken bunu göremezdi, hiç ayrılmasaydı da öğrenemezdi. Cevabın uzakta olduğuna karar vermeden önce onun hangi kısmının zaten elinizin altında olduğuna bakın ve yolun size neyi öğretmesi gerektiğini düşünün. Bazı şeyleri tanımak için önce uzaklaşmak gerekebilir, ama dönüşte neye baktığınızı da bilmeniz gerekir.$$

[[reflect]]
&&Bir yerden ya da birinden uzaklaştıktan sonra değerini ancak anladığınız hangi şey, bugün size neyi farklı gösteriyor?&&

[[use]]
%%context:social | Bir arkadaşınız huzursuz ve cevabın başka bir yerde olduğundan emin :: "Orada tam olarak ne bulmayı umuyorsun? Bunun bir kısmı şimdiden yakınında olabilir mi?"%%
%%context:self | Uzun bir yolculuktan ya da işten döndünüz ve içiniz tuhaf :: "Evde, gitmeden önce fark etmediğim üç şeyi yazıyorum."%%
%%context:meeting | Bir meslektaş bir fikri seyahat ya da taşınma gerektiriyor diye reddediyor :: "Eleyip atmadan önce en ucuz parçasını buradan deneyip ne öğrendiğimize bakalım mı?"%%

[[pocket]]
@@Santiago nerede kazacağını öğrenmek için çölü geçti; hazine, yola çıktığı ağacın altındaydı.@@
````

### English (`en`)

- **Kategori:** Growth
- **Kitap:** The Alchemist
- **Başlık:** Digging Under the Sycamore
- **Kanca (hook):** If what you were looking for lay near where you started, would you have seen it without the journey?

**1 dakikalık özet:**

> After a long journey Santiago reaches the Egyptian pyramids and digs, but the sand gives him nothing. A band of men looking for gold beats him. Their leader says he has dreamed of a treasure in an abandoned church in Spain, beside a sycamore, and that he would never cross a desert for a dream. Santiago goes back to the church where he slept with his sheep, digs under the sycamore and finds the treasure.

**Okuma sayfası metni (ham işaretleme):**

````text
[[open]]
Santiago has crossed a sea and a desert to stand at the pyramids with a spade in his hands. He digs, and the sand gives him nothing. Then the men who find him say something that no one in his dream ever did.

[[story]]
By the time Santiago reaches the Egyptian pyramids, he has been robbed in Tangier and worked in a crystal merchant's shop. He has crossed the desert with a caravan, left a woman named Fatima behind at an oasis, and been guided by an alchemist. Now he picks a spot at the foot of the pyramids and starts to dig in the sand.

Men come upon him while he works. They beat him and demand the gold they assume a traveller must be carrying. He tells them the truth, that he is digging for a treasure he saw in a dream.

Their leader says he has had a dream of his own, and he has had it more than once. In it, a treasure lies buried in an abandoned church in Spain, in the old sacristy where a sycamore grows.

He tells Santiago that he would never cross a desert on the strength of a recurring dream. The sacristy and the sycamore he describes are the ones in the church where Santiago slept with his sheep. Then the leader lets him go.

##Santiago walks away from the pyramids knowing exactly where to dig.##

The church is the one where he used to sleep with his sheep. The sycamore is the one growing through the roof, and he had dreamed his first dream beside it.

He goes back to Spain and finds the church, with its broken roof and its sycamore. He digs under the tree, and the treasure is there. Fatima, still waiting at her oasis, is the first person he thinks of.

Coelho spends the whole book on the road to Egypt, so the ending turns the journey around. The treasure never moved. A shepherd had slept a few steps from it, and a man who had never left home had known where it lay without ever going to look.

[[lessons]]
$$**Go back to the place you started with new eyes.** A woman who left her small hometown for a job in a big city may come back years later, stand in the same square, and finally understand what the people there had given her. She could not see that while she lived inside it every day, and she could not have learned it by staying. Before you decide the answer is somewhere far away, ask which part of it you already hold, and what you might have to learn elsewhere before you can see it.$$

[[reflect]]
&&What did you only recognise as valuable after you had spent time away from it, and how did the distance change what you saw?&&

[[use]]
%%context:social | A friend is restless and sure the answer is somewhere else :: "What exactly do you hope to find there? Is any of it already close to where you are?"%%
%%context:self | You came back from a long trip and feel unsettled :: "I'll write down three things I notice about home that I never noticed before I left."%%
%%context:meeting | A colleague dismisses an idea because it means travel or a move :: "Before we rule it out, can we test the cheapest piece of it from here and see what we learn?"%%

[[pocket]]
@@Santiago crossed a desert to learn where to dig, and the treasure lay under the tree where he began.@@
````

### Español (`es`)

- **Kategori:** Crecimiento
- **Kitap:** El alquimista
- **Başlık:** El tesoro estaba bajo el sicomoro
- **Kanca (hook):** Si lo que buscabas estuviera cerca de donde empezaste, ¿lo habrías visto sin el viaje?

**1 dakikalık özet:**

> Tras un largo viaje, Santiago llega a las pirámides de Egipto y cava, pero la arena no le da nada. Unos hombres que buscan oro lo golpean. Su jefe cuenta que ha soñado con un tesoro en una iglesia abandonada de España, junto a un sicomoro, y que nunca cruzaría un desierto por un sueño. Santiago vuelve a la iglesia donde durmió con sus ovejas, cava bajo el sicomoro y encuentra el tesoro.

**Okuma sayfası metni (ham işaretleme):**

````text
[[open]]
Santiago ha cruzado un mar y un desierto para plantarse ante las pirámides con una pala entre las manos. Cava, y la arena no le da nada. Entonces los hombres que lo encuentran le dicen algo que nadie le dijo en el sueño.

[[story]]
Cuando Santiago llega por fin a las pirámides de Egipto, ya le han robado en Tánger, ha trabajado en la tienda de un mercader de cristales y ha cruzado el desierto con una caravana. Ha dejado a Fátima esperándolo en un oasis y se ha dejado guiar por un alquimista. Ahora elige un lugar al pie de las pirámides, hunde la pala y empieza a cavar en la arena. Pasa el tiempo, el hoyo se hace más hondo y no sale nada.

Unos hombres lo sorprenden mientras trabaja. Lo golpean y le exigen el oro que suponen que lleva encima, porque a un viajero que llega tan lejos se le presume una bolsa llena. Santiago no tiene oro que darles. Les dice la verdad: está buscando un tesoro que vio en un sueño.

El jefe de la banda cuenta que él también ha tenido un sueño, y no una sola vez. En él, un tesoro yace enterrado en una iglesia abandonada de España, en la vieja sacristía donde crece un sicomoro. Lo cuenta como quien refiere una rareza, sin ninguna intención de ir tras ella.

Añade que jamás cruzaría un desierto por un sueño que se repite. La sacristía y el sicomoro que describe son los de la iglesia donde Santiago durmió con sus ovejas. Después lo deja marchar, y Santiago se levanta con los golpes todavía en el cuerpo y la arena pegada a las manos.

##Santiago se aleja de las pirámides sabiendo por fin dónde cavar.##

Vuelve a España y llega a la iglesia donde antes dormía con las ovejas, con su sicomoro creciendo en la sacristía. Hunde otra vez la pala, ahora al pie del árbol, y esta vez el tesoro está allí. Fátima, que sigue esperando en su oasis, es la primera persona en quien piensa.

Coelho dedica el libro entero al camino hacia Egipto, y el final le da la vuelta al viaje. Todo lo que Santiago atravesó, el puerto, la tienda de cristales, la caravana, el oasis, quedó entre la iglesia y el lugar donde por fin supo qué buscar. El tesoro nunca se movió. Un pastor había dormido a pocos pasos de él, y un hombre que jamás salió de su tierra sabía dónde estaba enterrado sin haber ido nunca a buscarlo.

[[lessons]]
$$**Vuelve al lugar de origen con otros ojos.** Una mujer que dejó su pueblo para trabajar en una gran ciudad puede regresar años después, pararse en la misma plaza y entender por fin lo que aquella gente le dio. Mientras vivía allí cada día no podía verlo, y quedándose tampoco habría aprendido a verlo. Antes de decidir que la respuesta está lejos, pregúntate qué parte de ella ya tienes y qué te falta aprender fuera para poder reconocerla. Quizá el viaje no sirva para encontrar algo nuevo, sino para estar listo cuando lo tengas delante, y eso solo se sabe después de haberlo hecho.$$

[[reflect]]
&&¿Qué cosa solo valoraste de verdad después de haber estado lejos de ella, y cómo cambió la distancia tu manera de mirarla?&&

[[use]]
%%context:social | Un amigo está inquieto y cree que la respuesta está en otro sitio :: "¿Qué esperas encontrar allí, exactamente? ¿Hay algo de eso que ya tengas cerca?"%%
%%context:self | Acabas de volver de un viaje largo y te sientes descolocado :: "Voy a apuntar qué cosas de casa noto ahora que antes no veía."%%
%%context:meeting | Un colega descarta una idea porque exige viajar o mudarse :: "Antes de descartarla, ¿probamos desde aquí la parte más barata y vemos qué aprendemos?"%%

[[pocket]]
@@Santiago cruzó un desierto para saber dónde cavar, y el tesoro estaba bajo el árbol donde empezó.@@
````

### Deutsch (`de`)

- **Kategori:** Wachstum
- **Kitap:** Der Alchimist
- **Başlık:** Der Schatz unter der Sykomore
- **Kanca (hook):** Hättest du ohne die Reise erkannt, was du suchst, wenn es nah bei deinem Ausgangspunkt gelegen hätte?

**1 dakikalık özet:**

> Nach einer langen Reise erreicht Santiago die ägyptischen Pyramiden und gräbt, doch der Sand gibt nichts her. Eine Gruppe von Männern, die Gold sucht, schlägt ihn. Ihr Anführer erzählt, er habe von einem Schatz in einer verlassenen Kirche in Spanien geträumt, neben einer Sykomore, würde aber für einen Traum nie eine Wüste durchqueren. Santiago kehrt zu der Kirche zurück, in der er mit seinen Schafen schlief, gräbt unter der Sykomore und findet den Schatz.

**Okuma sayfası metni (ham işaretleme):**

````text
[[open]]
Santiago gräbt am Fuß der Pyramiden im Sand, und nichts kommt zum Vorschein. Männer finden ihn dabei, schlagen ihn und wollen sein Gold. Was ihr Anführer ihm danach erzählt, handelt von einem Traum, den nicht Santiago geträumt hat.

[[story]]
Bis Santiago die ägyptischen Pyramiden erreicht, hat man ihn in Tanger ausgeraubt, er hat im Laden eines Kristallhändlers gearbeitet, mit einer Karawane die Wüste durchquert, eine Frau namens Fatima an einer Oase zurückgelassen und sich von einem Alchimisten führen lassen. Jetzt beginnt er zu graben. Der Sand ist trocken und gibt nichts her.

Während er arbeitet, tauchen Männer auf. Sie schlagen ihn und verlangen das Gold, das er ihrer Meinung nach bei sich trägt. Santiago sagt ihnen die Wahrheit: Er sucht einen Schatz, den er im Traum gesehen hat.

Ihr Anführer sagt, er habe selbst einen Traum, und zwar immer wieder denselben. Darin liegt ein Schatz in einer verlassenen Kirche in Spanien, in der alten Sakristei, wo eine Sykomore wächst.

Wegen eines Traums, der immer wiederkehrt, würde er nie eine Wüste durchqueren, erklärt der Mann und lässt Santiago laufen. Die Sakristei und der Baum, die er beschrieben hat, stehen in der Kirche, in der Santiago mit seinen Schafen geschlafen hat.

Santiago hat einen weiten Weg hinter sich und steht mit leeren Händen da. Der Mann, der ihm den entscheidenden Hinweis gibt, hat sein Leben lang nichts anderes getan, als von zu Hause aus zu träumen.

##Santiago geht von den Pyramiden fort und weiß nun genau, wo er graben muss.##

Er reist nach Spanien zurück, zu der verlassenen Kirche, in der er mit seinen Schafen übernachtet und seinen ersten Traum gehabt hat. Er gräbt unter der Sykomore und findet den Schatz. Der erste Mensch, an den er dabei denkt, ist Fatima, die an ihrer Oase wartet.

Coelho schickt seinen Hirten ein ganzes Buch lang nach Ägypten, und das Ende dreht diese Reise um. Der Schatz ist nie fort gewesen. Ein Hirte hat in der Kirche geschlafen, und ein Mann, der nie von zu Hause weggegangen ist, wusste, wo er liegt, ohne je nachzusehen.

[[lessons]]
$$**Kehre mit neuen Augen an deinen Ausgangspunkt zurück.** Eine Frau, die ihre kleine Heimatstadt für einen Job in der Großstadt verlassen hat, steht Jahre später wieder auf dem alten Marktplatz und begreift erst jetzt, was ihr die Leute dort mitgegeben haben. Solange sie mittendrin lebte, konnte sie das nicht sehen, und ohne den Weg hinaus hätte sie es nicht gelernt. Bevor du entscheidest, die Antwort liege weit weg, frag dich, welchen Teil davon du schon in der Hand hältst und was du vielleicht erst anderswo lernen musst, um ihn zu erkennen.$$

[[reflect]]
&&Was hast du erst als wertvoll erkannt, nachdem du eine Zeit lang weg warst, und wie hat die Distanz verändert, was du gesehen hast?&&

[[use]]
%%context:social | Ein Freund ist rastlos und glaubt, die Antwort liege woanders :: "Was genau hoffst du dort zu finden? Ist davon vielleicht schon etwas in deiner Nähe?"%%
%%context:self | Du bist von einer langen Reise zurück und fühlst dich unruhig :: "Ich schreibe auf, was mir zu Hause jetzt auffällt und was ich vor der Abreise nie bemerkt habe."%%
%%context:meeting | Ein Kollege winkt eine Idee ab, weil sie Reisen oder einen Umzug bedeutet :: "Bevor wir sie verwerfen: Können wir das günstigste Stück davon von hier aus testen und sehen, was wir lernen?"%%

[[pocket]]
@@Santiago musste durch eine Wüste, um zu erfahren, wo er graben soll: unter dem Baum, bei dem alles begann.@@
````

---

## Finans / Finance — #1734

- **Yazar:** Michael Lewis (2016)
- **Okuma süresi:** 3 dk
- **Viral puan:** 87 / 100 (750 hikâye içinde 55. sıra)

### Türkçe (`tr`)

- **Kategori:** Finans
- **Kitap:** The Undoing Project
- **Başlık:** Aynı Limuzin, Aynı Trafik: Kim Daha Çok Üzülür?
- **Kanca (hook):** En son hangi olayda gerçeğe değil de “ya şöyle olsaydı” hikâyesine takıldın?

**1 dakikalık özet:**

> İki yolcu aynı limuzinde, aynı trafikte kalıp havalimanına uçuşlarının kalkış saatinden otuz dakika sonra varır. Birine uçağın zamanında gittiği söylenir, ötekine uçağın rötar yapıp beş dakika önce kalktığı. Kahneman ve Tversky'nin 1982'deki bölümünde sorulanların yüzde 96'sı ikincisinin daha çok üzüleceğini söyledi. Kayıp aynıydı, yalnızca yetişmeyi hayal etmek ona daha kolaydı.

**Okuma sayfası metni (ham işaretleme):**

````text
[[open]]
Bay Tees'in uçağı, o havalimanına varmadan yalnızca beş dakika önce kalkmıştı. Bay Crane'inki ise yarım saat önce. İki adam aynı limuzine binmiş, aynı trafikte beklemişti ve ikisi de uçağı kaçırmıştı. İkisinin sabahı arasındaki tek fark, bu yirmi beş dakikaydı.

[[story]]
Daniel Kahneman ile Amos Tversky'nin ortaya koyduğu örnekte iki yolcu var: Bay Crane ve Bay Tees. İkisi de aynı limuzine biner ve yol boyunca aynı trafik sıkışıklığında bekler. Havalimanına uçuşlarının planlanan kalkış saatinden otuz dakika sonra varırlar. Araç, trafik ve varış saati aynıdır.

Bay Crane'e uçağının zamanında kalktığı söylenir. Bay Tees'e ise uçuşunun rötar yaptığı ve uçağın yalnızca beş dakika önce havalandığı bildirilir. İki haber arasında yirmi beş dakika vardır ve başka hiçbir fark yoktur.

Psikologlar insanlara hangi adamın daha çok üzüleceğini sordu. İkilinin 1982'de yayımladığı bölümde, sorulanların yüzde 96'sı, yani neredeyse hepsi Bay Tees dedi. Aynı kayıp için neredeyse herkes farklı bir acı bekledi.

##İki adam da uçağı kaçırdı. Aralarındaki tek fark, yetişmeyi hayal etmenin ne kadar kolay olduğuydu.##

Michael Lewis, *The Undoing Project* kitabında, bu iki psikoloğun zihnin olayların nasıl farklı sonuçlanabileceğini nasıl canlandırdığını incelediğini anlatır. İkili bu eğilime simülasyon sezgisi adını verdi, Kahneman da onu "geri alma kuralı" diye andı. Bir olayı kafanızda geri almak, onu başa sarıp tek bir şeyi değiştirmek demektir. Beş dakika geri vermesi kolay bir süredir, bu yüzden beş dakika önce kalkmış bir uçağa yetişmek kolayca hayal edilir ve Bay Tees kendini yetişirken görebilir. Bay Crane'in uçağı yarım saat önce, tam zamanında gitmiştir ve onun için kafada tutulacak yakın bir son yoktur. İkisi de aynı nedenle aynı kaybı yaşamıştı.

Lewis bunu ikilinin daha geniş bulgusunun bir parçası olarak sunar: zihin bir sonucu yalnızca olanla değil, hayal edebildiği alternatiflerle de tartar.

[[lessons]]
$$**Üzüntünüzün büyüklüğünü kaybın büyüklüğüyle karıştırmayın.** Kıl payı kaçan şey, yetişme resmi yakın durduğu için daha çok yakar ve bu, kaybın büyüklüğünü değil resmin netliğini gösterir. Sınavdan çok az farkla kalan bir öğrenci haftalarca cevap kâğıdını düşünür, farkın büyük olduğu arkadaşı ise konuyu kapatır, oysa ikisinin sonucu aynıdır. Bu ayrımı yaptığınızda acının ne kadarının kayıptan, ne kadarının kafanızdaki yakın bir sondan geldiğine bakabilir ve gerçekten değişebilecek şeyle ilgilenebilirsiniz, değişemeyeni de bırakabilirsiniz.$$

[[reflect]]
&&Son zamanlarda kafanızda sürekli tekrarladığınız hangi "keşke", yalnızca olguları yazdığınızda gerçekte ne kadar yakın görünüyor?&&

[[use]]
%%context:oneonone | Bir iş arkadaşı kıl payı kaybettiği teklifi anlatıp duruyor. :: "Çok farkla kaybetseydin aynı şeyi kaybedecektin, yalnızca sonu daha yakın görünüyor. Sana gerçekte ne kaybettirdi?"%%

%%context:family | Eşiniz bir randevuyu birkaç dakikayla kaçırdığı için hâlâ kendini yiyor. :: "Geç kalan da erken çıkan da aynı randevuyu kaçırır. Şimdi hangi kısmı düzeltebiliriz?"%%

%%context:self | Gece bir kararı kafanızda yeniden oynatıyorsunuz. :: "Bunu o gün biri bilebilir miydi? Olguları yazıp sabah bakacağım."%%

[[pocket]]
@@Bay Tees ile Bay Crane aynı kaybı yaşadı; Tees'i daha çok yakan, yetişme resminin yakınlığıydı.@@
````

### English (`en`)

- **Kategori:** Finance
- **Kitap:** The Undoing Project
- **Başlık:** Same Limousine, Same Traffic: Who Hurts More?
- **Kanca (hook):** When did you last suffer more from “what if” than from what actually happened?

**1 dakikalık özet:**

> Two travelers share a limousine and a traffic jam and reach the airport thirty minutes after their flights were due to leave. One hears his plane left on time. The other hears his was delayed and took off five minutes ago. In Kahneman and Tversky's 1982 chapter, 96 percent of the people asked said the second man would be more upset. The facts matched. His flight was simply easier to picture catching.

**Okuma sayfası metni (ham işaretleme):**

````text
[[open]]
Two men reach the airport in one limousine, thirty minutes after their flights were due to leave. One is told his plane left on time. The other hears that his was delayed and took off only five minutes ago. Between the two pieces of news lie twenty-five minutes, and nothing else.

[[story]]
Ninety-six percent. That is how many of the people Daniel Kahneman and Amos Tversky questioned gave the same answer, in the chapter they published in 1982. They had asked which of two travelers, Mr. Crane or Mr. Tees, would be more upset, and nearly everyone named Mr. Tees.

Michael Lewis tells in *The Undoing Project* how the two psychologists studied the way the mind pictures how things might have turned out differently. They called this the simulation heuristic, and Kahneman linked it to what he named the rule of undoing. Their example was a pair of men in a limousine.

The limousine was the same, and so was the traffic jam it sat in. Both men reached the airport thirty minutes after their flights were scheduled to leave, so by the clock they were exactly equally late. Mr. Crane was told his flight had left on time. Mr. Tees was told his had been delayed and gone only five minutes ago. Neither caught his plane. Between what each man was told lay twenty-five minutes, and that gap was the only difference in their mornings.

##Nothing in the facts separated them. What separated them was how easily each could picture catching the flight.##

To undo an event in your head, you rewind it and change one thing. Five minutes is a small thing to give back, so a flight that left five minutes ago is easy to imagine catching, and Mr. Tees can see himself making it. Mr. Crane's plane had left half an hour before, on schedule, and there is no close version of that morning for him to picture. His loss and Mr. Tees's loss were the same plane missed for the same reason.

Lewis presents the pair as one strand of the partners' larger work: the mind judges an outcome against the alternatives it can imagine, not only against what actually happened.

[[lessons]]
$$**Measure the loss separately from the near miss.** When something slips away by a hair, part of the hurt comes from how clearly you can picture the other ending, and that is a different thing from how much you actually lost. A designer whose pitch narrowly loses may feel far worse than a colleague whose pitch was never close, although both end up with the same empty calendar. Once you spot the picture, you can ask what the loss itself comes to, and then decide what, if anything, is worth doing about it.$$

[[reflect]]
&&What does the "if only" you keep replaying look like once you list only the facts of what happened?&&

[[use]]
%%context:social | A friend keeps replaying a deadline that was missed by an hour. :: "You lost exactly what the person who missed it by a week lost. The ending just looks closer to you. What actually changed?"%%

%%context:meeting | A project nearly worked and the team is sour. :: "Which of our 'if onlys' did we actually control, and which one is only a picture of a closer ending?"%%

%%context:self | You are replaying a decision late at night. :: "Could anyone have known that then? I'll write down the facts and look at them in the morning."%%

[[pocket]]
@@Both men missed their flights; the one who could picture catching it was the one who hurt more.@@
````

### Español (`es`)

- **Kategori:** Finanzas
- **Kitap:** The Undoing Project
- **Başlık:** La misma limusina, el mismo atasco: ¿quién sufre más?
- **Kanca (hook):** ¿Cuándo sufriste más por un “y si…” que por lo que realmente pasó?

**1 dakikalık özet:**

> Kahneman y Tversky imaginaron a dos viajeros en la misma limusina, atascados en el mismo tráfico, que llegan al aeropuerto treinta minutos después de la hora de salida. Al primero le dicen que su avión salió puntual; al segundo, que se retrasó y despegó hace cinco minutos. En su capítulo de 1982, el 96 por ciento de los encuestados dijo que el segundo se disgustaría más. Los hechos eran iguales: a él le resultaba más fácil imaginarse alcanzándolo.

**Okuma sayfası metni (ham işaretleme):**

````text
[[open]]
Hay una sola limusina atrapada en un atasco y, dentro, dos pasajeros que van al mismo aeropuerto y a la misma hora. Cuando lleguen, a cada uno le espera una noticia distinta, y la diferencia entre las dos es de apenas veinticinco minutos. Nada más los separa.

[[story]]
Al señor Tees le informan de que su vuelo se retrasó y despegó hace solo cinco minutos. Al señor Crane, en cambio, le dicen que el suyo salió puntual. Ninguno de los dos llega a tiempo, y entre una noticia y otra solo hay veinticinco minutos.

Los dos habían compartido la limusina y el mismo atasco, y los dos llegaron al aeropuerto treinta minutos después de la hora a la que debían salir sus vuelos. Son los viajeros de un ejemplo que inventaron Daniel Kahneman y Amos Tversky. Hasta ahí todo coincide: el coche, el atasco, la hora de llegada y el aeropuerto.

Los psicólogos preguntaron a la gente cuál de los dos se disgustaría más. Casi todos, el 96 por ciento en el capítulo que publicaron en 1982, señalaron al señor Tees. Pasó lo mismo con los dos: perdieron su avión.

##Los hechos eran iguales; lo que cambiaba era lo fácil que resultaba imaginar que lo alcanzaba.##

Michael Lewis cuenta en *The Undoing Project* que Kahneman y Tversky estudiaron cómo imagina la mente las otras maneras en que las cosas podrían haber salido. Lo llamaron heurística de simulación, y Kahneman lo relacionó con lo que llamó la regla de deshacer. Deshacer un suceso en la cabeza consiste en rebobinarlo y cambiar una sola cosa. Cinco minutos son poco que devolver, así que un vuelo que salió hace cinco minutos se imagina alcanzado con facilidad, y el señor Tees puede verse llegando a tiempo. El de Crane se fue media hora antes, a su hora, y no hay ningún final cercano que él pueda figurarse. Los dos habían perdido el avión por el mismo motivo.

Lewis lo presenta como parte de lo que mostró la pareja: la mente juzga lo ocurrido frente a las alternativas imaginadas, no solo frente a lo que pasó.

[[lessons]]
$$**Cuando algo sale por poco, separa lo que perdiste de lo que imaginas.** Una derrota ajustada duele más porque el otro final se ve cerca, aunque en la práctica deje el mismo resultado que una derrota amplia. Piensa en alguien que se queda sin un puesto por muy poco y repasa la entrevista durante días, mientras otra persona que quedó lejos del puesto da el asunto por cerrado. Si distingues una cosa de la otra, puedes dedicar tu energía a lo que de verdad quedó fuera de tu alcance y a aquello que puedes aprender de ello, sin darle más peso del debido.$$

[[reflect]]
&&¿Qué "si hubiera" llevas repitiendo últimamente que, mirado solo con los hechos, estaba menos cerca de lo que parecía?&&

[[use]]
%%context:family | Tu hermana no deja de contar cómo perdió por un momento un tren que ya se iba. :: "Sé que dolió más por lo cerca que quedó. Pero el tren se fue igual. ¿Qué parte de esto sí puedes cambiar?"%%

%%context:oneonone | Un compañero sigue molesto por una propuesta que perdió por poco. :: "Perdiste lo mismo que si hubieras quedado lejos. Lo que escuece es lo cerca que se ve el final. ¿Lo hablamos?"%%

%%context:self | Das vueltas a una decisión cuando ya no puedes dormir. :: "¿Podía alguien saberlo entonces? Voy a anotar los hechos y mirarlos mañana."%%

[[pocket]]
@@El señor Tees perdió el mismo avión que Crane, pero su "casi" estaba tan cerca que le dolió más.@@
````

### Deutsch (`de`)

- **Kategori:** Finanzen
- **Kitap:** The Undoing Project
- **Başlık:** Dieselbe Limousine, derselbe Stau: Wer leidet mehr?
- **Kanca (hook):** Wann hast du zuletzt mehr unter einem “Was wäre wenn” gelitten als unter dem Ereignis selbst?

**1 dakikalık özet:**

> Zwei Reisende teilen sich eine Limousine und stecken im selben Stau. Sie erreichen den Flughafen dreißig Minuten nach der Abflugzeit. Dem einen sagt man, sein Flug sei pünktlich gestartet, dem anderen, er sei vor fünf Minuten abgehoben. Im Kapitel von Kahneman und Tversky aus dem Jahr 1982 sagten 96 Prozent der Befragten, der zweite ärgere sich mehr. Die Lage war gleich, aber ihm fiel es leichter, sich das Erreichen auszumalen.

**Okuma sayfası metni (ham işaretleme):**

````text
[[open]]
Herr Crane erfährt, dass sein Flugzeug pünktlich abgehoben ist. Herr Tees erfährt, dass seines Verspätung hatte und erst vor fünf Minuten gestartet ist. Beide sitzen im selben Auto und kommen gleich spät an. Zwischen den beiden Nachrichten liegen fünfundzwanzig Minuten, mehr nicht.

[[story]]
Was Daniel Kahneman später die Regel des Rückgängigmachens nannte, lässt sich gut an einer Limousine zeigen. In ihr sitzen Herr Crane und Herr Tees, im selben Stau, auf dem Weg zum selben Flughafen. Die beiden stammen aus einem Beispiel, das Kahneman und Amos Tversky sich ausdachten.

Beide erreichen den Flughafen dreißig Minuten nach der planmäßigen Abflugzeit. Herrn Crane sagt man, sein Flugzeug sei pünktlich gestartet. Herrn Tees sagt man, sein Flug sei verspätet gewesen und erst fünf Minuten zuvor abgehoben.

Die Psychologen fragten Leute, wer von beiden sich mehr ärgern würde. In dem Kapitel von 1982 nannten fast alle, nämlich 96 Prozent, Herrn Tees. Dabei hatten beide ihr Flugzeug verpasst, und zwischen dem, was man ihnen sagte, lagen nur fünfundzwanzig Minuten.

##Die Tatsachen waren dieselben. Verschieden war nur, wie leicht sich vorstellen ließ, den Flug noch zu erreichen.##

Michael Lewis erzählt in *The Undoing Project*, wie die beiden Forscher untersuchten, wie der Kopf sich ausmalt, was auch anders hätte ausgehen können. Sie nannten das die Simulationsheuristik. Ein Ereignis im Kopf rückgängig zu machen heißt, es zurückzuspulen und eine Sache zu ändern. Fünf Minuten sind wenig, was man sich zurückdenken muss, also lässt sich ein Flug, der vor fünf Minuten startete, leicht als erreichbar denken, und Herr Tees kann sich selbst dabei sehen, wie er es schafft. Für Herrn Crane war das Flugzeug eine halbe Stunde vorher planmäßig weg, eine nahe Version des Morgens gibt es für ihn nicht. Beide hatten aus demselben Grund denselben Flug verpasst.

Lewis stellt das als Teil ihrer Arbeit dar: Der Kopf misst ein Ergebnis an den Alternativen, die er sich vorstellen kann, nicht nur an dem, was geschah.

[[lessons]]
$$**Frag bei einem Beinahe, was wirklich verloren ging.** Der Schmerz hängt auch daran, wie leicht sich das andere Ende ausmalen lässt, und das sagt wenig über die tatsächliche Größe des Verlusts. Wer ein Vorstellungsgespräch knapp nicht besteht, grübelt oft länger darüber als jemand, der klar abgelehnt wurde, obwohl beide am Ende ohne Stelle dastehen. Wenn du das erkennst, kannst du trennen, was sich ändern lässt und was nur ein Bild im Kopf ist, und deine Kraft auf das Erste richten.$$

[[reflect]]
&&Wie nah wirkt das "hätte ich nur", das du zurzeit immer wieder durchspielst, wenn du nur die Tatsachen aufschreibst?&&

[[use]]
%%context:meeting | Ein Projekt wäre fast gelungen, und die Stimmung im Team ist schlecht. :: "Welches unserer 'hätten wir nur' lag wirklich in unserer Hand, und welches ist nur ein Bild von einem näheren Ende?"%%

%%context:social | Eine Freundin ärgert sich ständig über einen Zug, den sie knapp verpasst hat. :: "Verpasst ist verpasst, ob um fünf Minuten oder um dreißig. Nur sieht das Ende bei dir so nah aus. Was würdest du jetzt anders machen?"%%

%%context:self | Du spielst nachts eine Entscheidung wieder und wieder durch. :: "Konnte das damals jemand wissen? Ich schreibe die Tatsachen auf und sehe morgen nach."%%

[[pocket]]
@@Herr Tees verlor nicht mehr als Herr Crane, aber sein Beinahe ließ sich leichter ausmalen.@@
````

---

## Verimlilik / Productivity — #1584

- **Yazar:** Daniel Pink (2005)
- **Okuma süresi:** 3 dk
- **Viral puan:** 89 / 100 (750 hikâye içinde 35. sıra)

### Türkçe (`tr`)

- **Kategori:** Verimlilik
- **Kitap:** Bütün Beyin
- **Başlık:** Paranın ötesinde anlam
- **Kanca (hook):** Yaptığınız işin neye yaradığını bir cümleyle söyleyebilir misiniz?

**1 dakikalık özet:**

> Pink, anlamı altı duyunun sonuncusu sayar ve Viktor Frankl'a başvurur. Frankl 1942'de sürgün edilen, 1945'te serbest kalan Viyanalı bir psikiyatristti. Önünde bir amacı olanların zor koşullara daha iyi dayandığını gözlemledi ve logoterapiyi kurdu. Pink fikri bugüne taşır: ihtiyaçlar karşılanınca insanlar bir işin işe yarayıp yaramadığına değil, önemli olup olmadığına bakmaya başlar. Frankl'ın kitabının serbest kalışından günler sonra yazıldığı anlatılır, bu bilgi kesin olarak sunulmuyor. Pink sol ve sağ beyin ayrımının bir benzetme olduğunu kabul eder.

**Okuma sayfası metni (ham işaretleme):**

````text
[[open]]
Viyanalı bir psikiyatrist, Nazi kamplarından sağ çıktıktan sonra kitabını günler içinde yazdı. Kitabın konusu bir hayatta kalma tekniği değildi, hayatta kalmayı mümkün kılan bir nedendi ve bu neden bugün işyerinde bile aranıyor.

[[story]]
Daniel Pink, *A Whole New Mind* (2005) kitabında anlamı altı "duyu"nun sonuncusu olarak koyar. Bu bölümde Viktor Frankl'ın gözlemleri yer alır. Frankl, Viyanalı bir psikiyatristti. 1942'de sürgün edildi, Auschwitz'in de aralarında olduğu birkaç kampta tutuldu ve 1945'te serbest kaldı. Kitabı 1946'da çıktı ve kurtuluşundan hemen sonra, günler içinde yazıldığı anlatılır.

Frankl şunu gözlemledi: önünde bir amacı ve yapmak istediği bir iş olanlar, zor koşullara daha iyi dayanıyordu. Bunu kendi gözüyle, kampın içinde gördü ve cevabı kısa tuttu: bir amaç. Kitabında Nietzsche'den bir sözü anar: yaşamak için bir "neden"i olan, hemen her "nasıl"a katlanabilir. Bu düşünceden yola çıkarak, insanın temel arayışının anlam olduğunu savunan logoterapiyi kurdu. Adı, Yunancada anlam anlamına da gelen logos sözcüğünden gelir.

Pink bu fikri bugüne taşır ve işyerinin kapısına getirir. Maddi ihtiyaçlar karşılandığında insanlar yeni bir soru sormaya başlıyor: Ne için yaşıyorum, ne için çalışıyorum? Bolluğun içinde bir şeyin işe yarayıp yaramadığı kolayca cevaplanıyor, ama o işin neden önemli olduğu cevapsız kalabiliyor.

Pink'e göre bu soru işyerine de giriyor: insanlar yalnız maaş için değil, yaptıkları işte bir anlam görmek için de çalışmak istiyor. Pink soruyu iki cümleyle ayırır. Mantıklı düşünme, bir iş teklifine ya da bir projeye bakarken "Bu işe yarıyor mu?" diye sorar. Anlam arayışı ise "Bu önemli mi?" diye. Pink'e göre ikinci soru, ihtiyaçlar karşılandıkça daha ağır basıyor. Sol ve sağ beyin ayrımının sinirbilimde bu kadar keskin olmadığını, bunun iki düşünme biçimi için bir benzetme olduğunu da kendisi kabul eder.

[[lessons]]
$$**Yaptığınız işin neye yaradığını bir cümleyle yazın.** Bir hemşire, bu mesleği neden seçtiğini kısa bir notla yazıp cebinde taşırsa, zor bir gece vardiyasında o nota dönüp bakabilir. Frankl önünde bir amacı olanların zorluğa daha iyi dayandığını gözlemledi ve Pink de bugün "bu önemli mi" sorusunun daha ağır bastığını söyler. Böylece görev listesinin tek başına taşıyamadığı sıkıcı dönemleri, işinizin neye yaradığını hatırlayarak geçebilirsiniz.$$

[[reflect]]
&&Şu anda yaptığınız işin neye yaradığını bir arkadaşınıza söyleyebileceğiniz tek bir cümleyle nasıl anlatırdınız ve bu cümle sizi neden motive eder?&&

[[use]]
%%context:meeting | Ekip uzun bir projeden yoruldu. :: "Bu işin kime yaradığını herkes bir cümleyle söylesin, cevapları proje sayfasına yazalım."%%

%%context:social | Bir arkadaşın işten bunaldı. :: "İşin hangi kısmı hâlâ yapmaya değer geliyor? Oradan başlayalım."%%

%%context:self | İki iş teklifi arasında kararsızsın. :: "Her teklifin yanına neye yarayacağını bir cümleyle yazıyorum."%%

[[pocket]]
@@Frankl amacın insanı zorlukta ayakta tuttuğunu yazdı; işinin neye yaradığını tek cümleyle yaz.@@
````

### English (`en`)

- **Kategori:** Productivity
- **Kitap:** A Whole New Mind
- **Başlık:** Meaning beyond money
- **Kanca (hook):** Can you say in one sentence what your work is for?

**1 dakikalık özet:**

> Pink treats meaning as the sixth of his six senses and turns to Viktor Frankl, a Viennese psychiatrist deported in 1942 and freed in 1945. Frankl observed that people with something ahead of them endured harsh conditions better, and he went on to found logotherapy. Pink carries the idea into the present: when basic needs are met, people ask a new question, does it matter? His book is reported to have been written within days of his release, which the story passes on as reported. Pink admits the left and right brain split is a metaphor.

**Okuma sayfası metni (ham işaretleme):**

````text
[[open]]
Whoever has a why to live can bear almost any how. A psychiatrist who survived Nazi camps quoted that line in a book he is reported to have written within days of his release. Daniel Pink later pulled it into the age of abundance.

[[story]]
In the meaning chapter of *A Whole New Mind* (2005), the sixth of his six senses, Daniel Pink points to Viktor Frankl. Frankl was a Viennese psychiatrist who was deported in 1942 and held in several camps, Auschwitz among them, and who was freed in 1945. His book appeared in 1946, and it is reported to have been written within days of his release.

What Frankl saw was that people who had an aim ahead of them, something they still wanted to do, endured harsh conditions better. In the book he cites a line from Nietzsche to the same effect: whoever has a why to live can bear almost any how. He went on to found logotherapy, a school of therapy built around the search for meaning, and its name comes from the Greek logos, which can also mean meaning.

Pink carries the idea into the present. When basic needs are met, people start asking a new question: what am I living for, and what am I working for? In a time of abundance it is easy to answer whether something works. It is much harder to say why it matters, and that question can go unanswered.

Pink says it reaches the workplace too: people want a sense of meaning in their work as well as a paycheck. He puts the contrast in two questions. The logical mind looks at a project or a job offer and asks, does this work? The meaning-seeking mind asks, does this matter? In Pink's view, the second question carries more weight as needs are met.

He also admits that the split between left and right brain is a simplified picture, a metaphor for two styles of thinking.

[[lessons]]
$$**Write down in one sentence what your work is for.** A nurse who keeps a short note on why she chose the job can pull it out during a hard night shift and read it again. Frankl observed that people with something ahead of them endured more, and Pink says the question of whether something matters now weighs more than it used to. When you can say what your work is for, you can get through the dull stretches that a task list alone cannot carry, and you can notice sooner when a task has drifted away from that purpose.$$

[[reflect]]
&&What would you tell a friend your current work is for, in a single sentence, and why does that sentence matter to you?&&

[[use]]
%%context:meeting | The team is tired after a long project. :: "Let everyone say in one sentence who this work helps, and we'll put the answers on the project page."%%

%%context:social | A friend is burned out at work. :: "Which part of the job still feels worth doing? Let's start with that."%%

%%context:self | You are torn between two job offers. :: "I'm writing one sentence next to each offer saying what it would be for."%%

[[pocket]]
@@Frankl found that purpose carries people through hardship: write one sentence naming what your work is for.@@
````

### Español (`es`)

- **Kategori:** Productividad
- **Kitap:** Cerebro completo
- **Başlık:** Sentido más allá del dinero
- **Kanca (hook):** ¿Sabrías decir en una frase para qué sirve tu trabajo?

**1 dakikalık özet:**

> Pink trata el sentido como el sexto de sus seis sentidos y se apoya en Viktor Frankl, psiquiatra vienés deportado en 1942 y liberado en 1945. Frankl observó que quienes tenían algo por delante soportaban mejor las condiciones duras, y fundó la logoterapia. Pink lleva la idea al presente: cubiertas las necesidades básicas, la gente se pregunta si algo importa. Se cuenta que Frankl escribió su libro a los pocos días de su liberación, dato que se da como referido. Pink admite que la división entre hemisferios es una metáfora.

**Okuma sayfası metni (ham işaretleme):**

````text
[[open]]
Quien tiene un porqué para vivir soporta casi cualquier cómo. Un psiquiatra que sobrevivió a los campos nazis citó esa frase en un libro que, según se cuenta, escribió a los pocos días de su liberación. Daniel Pink la trasladó después a la era de la abundancia.

[[story]]
En el capítulo sobre el sentido de *A Whole New Mind* (2005), el sexto de sus seis sentidos, Daniel Pink se apoya en Viktor Frankl. Frankl era un psiquiatra vienés, deportado en 1942 y recluido en varios campos, Auschwitz entre ellos, que fue liberado en 1945. Su libro apareció en 1946, y se cuenta que lo escribió a los pocos días de salir, con la experiencia todavía reciente.

Lo que Frankl observó, con la autoridad de quien lo vivió, fue que las personas con una meta por delante, algo que aún querían hacer, soportaban mejor las condiciones duras. En el libro cita una frase de Nietzsche en esa línea: quien tiene un porqué para vivir soporta casi cualquier cómo. Fundó después la logoterapia, una escuela terapéutica centrada en la búsqueda de sentido, cuyo nombre viene del griego logos, que también puede significar sentido.

Pink lleva la idea al presente y a la vida corriente de quien ya tiene lo básico cubierto. Cuando las necesidades básicas están cubiertas, la gente empieza a hacerse una pregunta nueva: para qué vivo y para qué trabajo. En una época de abundancia es fácil responder si algo funciona. Es mucho más difícil decir por qué importa, y esa pregunta puede quedarse sin respuesta, porque ni una lista de tareas ni un sueldo la contestan por sí solos.

Según Pink, la pregunta llega también al trabajo: la gente quiere sentir que su labor tiene sentido además de cobrar. Él resume el contraste en dos preguntas. La mente lógica mira un proyecto o una oferta de trabajo y pregunta si funciona. La mente que busca sentido pregunta si importa. En opinión de Pink, la segunda pregunta pesa más a medida que se cubren las necesidades.

Reconoce además que la división entre cerebro izquierdo y derecho es una imagen simplificada, una metáfora de dos maneras de pensar.

[[lessons]]
$$**Escribe en una frase para qué sirve tu trabajo.** Una enfermera que guarda una nota breve con las razones por las que eligió su oficio puede sacarla en un turno de noche difícil y volver a leerla. Frankl observó que quienes tenían algo por delante aguantaban más, y Pink dice que hoy la pregunta de si algo importa pesa más que antes. Cuando sabes decir para qué sirve tu trabajo, atraviesas los tramos aburridos que una lista de tareas por sí sola no sostiene, y notas antes cuándo una tarea se ha alejado de ese propósito.$$

[[reflect]]
&&¿Qué le dirías a un amigo que sirve tu trabajo actual, en una sola frase, y por qué te importa esa frase?&&

[[use]]
%%context:meeting | El equipo está cansado tras un proyecto largo. :: "Que cada uno diga en una frase a quién ayuda este trabajo, y ponemos las respuestas en la página del proyecto."%%

%%context:social | Un amigo está quemado en el trabajo. :: "¿Qué parte del trabajo te sigue pareciendo que merece la pena? Empecemos por ahí."%%

%%context:self | Dudas entre dos ofertas de empleo. :: "Escribo junto a cada oferta una frase sobre para qué serviría."%%

[[pocket]]
@@Frankl vio que el propósito sostiene en la adversidad: escribe en una frase para qué sirve tu trabajo.@@
````

### Deutsch (`de`)

- **Kategori:** Produktivität
- **Kitap:** Ganzes Gehirn
- **Başlık:** Sinn jenseits des Geldes
- **Kanca (hook):** Kannst du in einem Satz sagen, wofür deine Arbeit da ist?

**1 dakikalık özet:**

> Pink macht den Sinn zum sechsten seiner sechs Sinne und beruft sich auf Viktor Frankl, einen Wiener Psychiater, der 1942 deportiert und 1945 befreit wurde. Frankl beobachtete, dass Menschen mit etwas vor sich harte Bedingungen besser durchstanden, und begründete die Logotherapie. Pink überträgt das in die Gegenwart: Sind die Grundbedürfnisse gedeckt, fragen Menschen, ob etwas wichtig ist. Sein Buch soll er innerhalb weniger Tage nach der Entlassung geschrieben haben, das wird nur als überliefert wiedergegeben. Pink nennt die Trennung der Gehirnhälften eine Metapher.

**Okuma sayfası metni (ham işaretleme):**

````text
[[open]]
Wer ein Warum zum Leben hat, erträgt fast jedes Wie. Ein Psychiater, der die Lager der Nationalsozialisten überlebte, zitierte diesen Satz in einem Buch, das er nach den Berichten innerhalb weniger Tage nach seiner Befreiung schrieb. Daniel Pink holte ihn später ins Zeitalter des Überflusses.

[[story]]
Im Kapitel über den Sinn in *A Whole New Mind* (2005), dem sechsten seiner sechs Sinne, beruft sich Daniel Pink auf Viktor Frankl. Frankl war ein Wiener Psychiater, der 1942 deportiert und in mehreren Lagern festgehalten wurde, darunter Auschwitz, und 1945 befreit wurde. Sein Buch erschien 1946, und es heißt, er habe es innerhalb weniger Tage nach seiner Entlassung geschrieben.

Frankl beobachtete, dass Menschen mit einem Ziel vor Augen, mit etwas, das sie noch tun wollten, harte Bedingungen besser durchstanden. In dem Buch zitiert er in diesem Sinn einen Satz von Nietzsche: Wer ein Warum zum Leben hat, erträgt fast jedes Wie. Später begründete er die Logotherapie, eine Therapierichtung, die um die Suche nach Sinn kreist, und ihr Name kommt vom griechischen Logos, das auch Sinn bedeuten kann.

Pink überträgt den Gedanken in die Gegenwart. Sind die Grundbedürfnisse gedeckt, stellen sich Menschen eine neue Frage: Wofür lebe ich, und wofür arbeite ich? In einer Zeit des Überflusses lässt sich leicht beantworten, ob etwas funktioniert. Viel schwerer ist zu sagen, warum es wichtig ist, und diese Frage kann unbeantwortet bleiben, weil weder eine Aufgabenliste noch ein Gehalt sie von allein beantwortet.

Nach Pink erreicht die Frage auch die Arbeit: Die Leute wollen das Gefühl haben, dass ihre Arbeit einen Sinn hat, und nicht nur ein Gehalt bekommen. Er fasst den Gegensatz in zwei Fragen. Der logische Verstand sieht sich ein Projekt oder ein Stellenangebot an und fragt, ob es funktioniert. Der sinnsuchende Verstand fragt, ob es wichtig ist. Pinks Ansicht nach wiegt die zweite Frage schwerer, je mehr Bedürfnisse gedeckt sind.

Er räumt außerdem ein, dass die Trennung in linke und rechte Gehirnhälfte ein vereinfachtes Bild ist, eine Metapher für zwei Arten zu denken.

[[lessons]]
$$**Schreibe in einem Satz auf, wofür deine Arbeit da ist.** Eine Krankenschwester, die eine kurze Notiz mit den Gründen bei sich trägt, warum sie diesen Beruf gewählt hat, kann sie in einer harten Nachtschicht hervorholen und noch einmal lesen. Frankl beobachtete, dass Menschen mit etwas vor sich mehr aushielten, und Pink sagt, dass die Frage, ob etwas wichtig ist, heute schwerer wiegt als früher. Kannst du sagen, wofür deine Arbeit da ist, kommst du durch die langweiligen Strecken, die eine Aufgabenliste allein nicht trägt, und merkst früher, wenn eine Aufgabe sich von diesem Zweck entfernt hat.$$

[[reflect]]
&&Was würdest du einem Freund in einem einzigen Satz antworten, wofür deine jetzige Arbeit da ist, und warum ist dir dieser Satz wichtig?&&

[[use]]
%%context:meeting | Das Team ist nach einem langen Projekt müde. :: "Jeder sagt in einem Satz, wem diese Arbeit hilft, und wir schreiben die Antworten auf die Projektseite."%%

%%context:social | Ein Freund ist in seinem Job ausgebrannt. :: "Welcher Teil der Arbeit fühlt sich noch lohnend an? Fangen wir dort an."%%

%%context:self | Du schwankst zwischen zwei Jobangeboten. :: "Ich schreibe neben jedes Angebot einen Satz dazu, wofür es gut wäre."%%

[[pocket]]
@@Frankl sah, dass Sinn Menschen durch Härten trägt: Schreib in einem Satz auf, wofür deine Arbeit da ist.@@
````

---

## İletişim / Communication — #1785

- **Yazar:** Marshall B. Rosenberg (1999)
- **Okuma süresi:** 2 dk
- **Viral puan:** 79 / 100 (750 hikâye içinde 280. sıra)

### Türkçe (`tr`)

- **Kategori:** İletişim
- **Kitap:** Nonviolent Communication
- **Başlık:** Suçlamanın Altındaki İhtiyaç
- **Kanca (hook):** Son tartışmanda karşı tarafa fırlattığın yargının altında hangi karşılanmamış ihtiyaç vardı?

**1 dakikalık özet:**

> ‘Sen hep geç kalıyorsun, beni umursamıyorsun’ gibi bir cümle karşı tarafı anında savunmaya iter ve tartışma kilitlenir. Rosenberg bu tür cümleleri dört adımla yeniden kurar: gözlem, duygu, ihtiyaç ve açık bir rica. Rosenberg'in Şiddetsiz İletişim modeli dünyanın dört bir yanında sınıflara, şirketlere ve barış görüşmelerine taşındı; özü tek cümleye sığar: her eleştirinin altında karşılanmamış bir ihtiyaç yatar ve onu adlandırmak çatışmayı yumuşatır.

**Okuma sayfası metni (ham işaretleme):**

````text
[[open]]
Kavga ederken en hızlı çıkan cümle çoğu zaman en işe yaramaz olandır. Klinik psikolog Marshall Rosenberg, bu cümlenin konuşmayı neden kapattığını ve yerine ne söylenebileceğini dört adımda anlattı.

[[story]]
Klinik psikolog Marshall Rosenberg, 1999 tarihli *Nonviolent Communication* kitabında çatışmalarda tekrar eden bir şeyi görür: insanlar neye ihtiyaç duyduklarını söylemek yerine karşısındakini yargılar. Yargılanan kişi kendini savunmaya geçer, çünkü söylenen şey bir ihtiyaç değil, onun hakkında verilmiş bir hükümdür. Konuşma da asıl meseleye gelmeden orada takılır.

Rosenberg'in önerdiği yol dört parçadır ve sırayla söylenir. Önce gözlem gelir: olanı, değerlendirme katmadan anlatırsınız. Sonra duygu: o sırada ne hissettiğinizi söylersiniz. Üçüncüsü ihtiyaçtır, yani o duygunun altındaki karşılanmamış şey. Dördüncüsü rica: karşı tarafın yapabileceği, net ve uygulanabilir bir istek. Dört adımın hiçbirinde karşınızdakinin karakteri hakkında bir cümle yoktur.

##Rosenberg'e göre her yargı, karşılanmamış bir ihtiyacın dolaylı ifadesidir.## Bu yüzden suçlayan cümlenin içinde asıl derdinizi aramak gerekir. Onu bulup adıyla söylediğinizde, yani "şunu yaptın" yerine "şuna ihtiyacım var" dediğinizde karşınızdaki kişi artık bir etiketle değil, bir ihtiyaçla karşılaşır.

İhtiyaçlar ona göre herkeste ortak, temel şeylerdir: anlaşılmak, güvende olmak, saygı görmek gibi. Herkes bunların ne olduğunu bildiği için ihtiyaç cümlesi karşı tarafa yabancı gelmez. Bir yargı cümlesi ise tartışılır, çünkü kimin haklı olduğu sorusunu açar.

Rica ile talep arasındaki fark da kitaptaki önemli ayrımlardan biridir. Karşı taraf hayır diyebiliyorsa bu bir ricadır. Hayır dediği için suçlanıyorsa, söylediğiniz şey talep olmuştur.

Dört adım dinlerken de işe yarar. Karşınızdaki biri size sert bir şey söylediğinde onun neyi gözlemlediğini, ne hissettiğini ve neye ihtiyaç duyduğunu anlamaya çalışırsınız. Karşınızdaki kişi öfkeli konuşuyorsa bile cümlesinin altında bir ihtiyaç aranır. Böylece konuşma suçlamadan ihtiyaçlara doğru yön değiştirir.

[[lessons]]
$$**Eleştiriyi söylemeden önce altındaki ihtiyacı arayın.** Ev arkadaşınız bulaşıkları yine lavaboda bıraktıysa "dağınıksın" demek kolaydır ama karşınızdaki hemen savunmaya geçer. Önce gördüğünüzü söyleyip ardından düzenli bir mutfağa ihtiyacınız olduğunu belirtirseniz, ondan ne istediğinizi de açıkça sorabilirsiniz. Bu sırayla konuştuğunuzda, daha ağzınızı açmadan neye ihtiyacınız olduğunu kendinize de söylemiş olursunuz. Hem kendi derdinizi netleştirir hem de karşınızdakine tartışmak yerine cevap verebileceği bir cümle bırakırsınız.$$

[[reflect]]
&&Son tartışmanızda karşınızdakine söylediğiniz yargının altında sizin için hangi karşılanmamış ihtiyaç saklıydı ve bunu ona nasıl söyleyebilirdiniz?&&

[[use]]
%%context:meeting | Bir iş arkadaşınız ortak dosyayı hep son anda gönderiyor :: "Dosya bu hafta teslimden bir saat önce geldi. Bu beni geriyor, çünkü kontrol etmeye vakit istiyorum. Perşembe akşamına kadar gönderebilir misin?"%%

%%context:family | Eşiniz yine geç kaldı :: "Bugün yemeğe yarım saat geç geldin ve beklerken yalnız hissettim. Birlikte yemek benim için önemli. Bir dahaki sefere geç kalacaksan mesaj atar mısın?"%%

%%context:oneonone | Biri size sert bir eleştiri yöneltti :: "Bunu söylerken bir şey seni mi zorluyor? Cevap vermeden önce neye ihtiyacın olduğunu anlamak istiyorum."%%

[[pocket]]
@@Yargıyı söylemeden önce olanı, hissettiğinizi, ihtiyacınızı ve tek bir ricayı sırayla söyleyin.@@
````

### English (`en`)

- **Kategori:** Communication
- **Kitap:** Nonviolent Communication
- **Başlık:** The Need Behind the Blame
- **Kanca (hook):** In your last argument, what unmet need was hiding underneath the judgment you threw?

**1 dakikalık özet:**

> Clinical psychologist Marshall Rosenberg spent decades mediating in schools, prisons and conflict zones, and kept meeting the same pattern: people hurl judgments at each other instead of naming what they actually need. His model of Nonviolent Communication spread to classrooms, companies and peace negotiations around the world, and its core fits in one line: beneath every criticism lies an unmet need, and naming that need softens the conflict.

**Okuma sayfası metni (ham işaretleme):**

````text
[[open]]
"You never listen to me." It is the quickest sentence in an argument, and the one that most reliably shuts the conversation down. A clinical psychologist spent years looking at what could be said instead.

[[story]]
In *Nonviolent Communication* (1999), the clinical psychologist Marshall Rosenberg describes something he saw again and again in conflicts: people judge instead of saying what they need. The person judged moves to defend himself, because what he hears is a verdict about him, not a need. The conversation gets stuck there, long before it reaches the real issue.

Rosenberg offers a way out in four parts, said in order. First comes an observation: you describe what happened without adding an evaluation. Then a feeling: you say what you feel. The third is a need, the unmet thing underneath the feeling. The fourth is a request, a clear and doable ask of the other person. None of the four steps says anything about the other person's character.

##For Rosenberg, every judgment is an indirect expression of an unmet need.## So a critical sentence is where you look for your real concern. Once you find it and name it, the other person meets a need, not a label.

Needs, in his view, are basic and shared by everyone: to be understood, to feel safe, to be respected. Because everyone knows what these are, a sentence about a need does not sound foreign to the listener. A judgment, on the other hand, can be argued with, because it opens the question of who is right.

The difference between a request and a demand matters as well. If the other person is free to say no, it is a request. If saying no gets him blamed, what you voiced was a demand.

The four steps work for listening too. When someone says something harsh to you, you try to hear what they observe, what they feel and what they need. Even an angry sentence has a need under it. The conversation then shifts from accusation toward needs.

[[lessons]]
$$**Look for the need under a criticism before you say it.** If a flatmate leaves the dishes in the sink again, "you are messy" is the easy sentence and the other person immediately defends himself. Say what you saw, then say you need a tidy kitchen, and you can ask for something specific. In that order you also clarify your own concern before opening your mouth, and you give the other person a sentence he can answer instead of one he has to fight.$$

[[reflect]]
&&In your last argument, what unmet need of yours was sitting under the judgment you said out loud?&&

[[use]]
%%context:meeting | A colleague always sends the shared file at the last minute :: "The file arrived an hour before the deadline this week. That worries me because I need time to check it. Could you send it Thursday evening?"%%

%%context:family | Your partner is late again :: "You arrived half an hour late and I felt alone waiting. Eating together matters to me. Next time, could you text me if you'll be late?"%%

%%context:oneonone | Someone aimed a sharp criticism at you :: "Is something weighing on you as you say this? Before I answer, I want to understand what you need."%%

[[pocket]]
@@Before you voice the judgment, say what happened, what you feel, what you need, and one request.@@
````

### Español (`es`)

- **Kategori:** Comunicación
- **Kitap:** Nonviolent Communication
- **Başlık:** La necesidad detrás del reproche
- **Kanca (hook):** En tu última discusión, ¿qué necesidad insatisfecha se escondía bajo el reproche que lanzaste?

**1 dakikalık özet:**

> El psicólogo clínico Marshall Rosenberg pasó décadas mediando en escuelas, cárceles y zonas de conflicto, y siempre encontraba el mismo patrón: la gente se lanza juicios en lugar de nombrar lo que necesita. Su modelo de Comunicación No Violenta llegó a aulas, empresas y negociaciones de paz en todo el mundo, y su esencia cabe en una línea: debajo de cada crítica hay una necesidad insatisfecha, y nombrarla suaviza el conflicto.

**Okuma sayfası metni (ham işaretleme):**

````text
[[open]]
"Nunca me escuchas." Es la frase más rápida en una discusión y la que con más seguridad cierra la conversación. Un psicólogo clínico pasó años mirando qué se podría decir en su lugar.

[[story]]
En *Nonviolent Communication* (1999), el psicólogo clínico Marshall Rosenberg describe algo que vio una y otra vez en los conflictos: la gente juzga en lugar de decir lo que necesita. La persona juzgada se pone a la defensiva, porque lo que oye es un veredicto sobre ella, no una necesidad. La conversación se atasca ahí, mucho antes de llegar al asunto real.

Rosenberg propone una salida en cuatro partes, dichas en orden. Primero, una observación: describes lo que pasó sin añadir una valoración. Luego, un sentimiento: dices lo que sientes. La tercera es una necesidad, aquello que no está cubierto y que hay debajo del sentimiento. La cuarta es una petición, algo claro y posible que le pides a la otra persona. Ninguno de los cuatro pasos dice nada del carácter del otro.

##Para Rosenberg, todo juicio es la expresión indirecta de una necesidad insatisfecha.## Así que una frase crítica es donde buscar tu preocupación real. Cuando la encuentras y la nombras, la otra persona se topa con una necesidad, no con una etiqueta.

Las necesidades, en su opinión, son básicas y comunes a todos: ser comprendido, sentirse seguro, ser respetado. Como todos sabemos qué son, una frase sobre una necesidad no suena extraña a quien la oye. Un juicio, en cambio, se puede discutir, porque abre la cuestión de quién tiene razón.

También importa la diferencia entre una petición y una exigencia. Si la otra persona es libre de decir que no, es una petición. Si decir que no le acarrea reproches, lo que expresaste fue una exigencia.

Los cuatro pasos sirven también para escuchar. Cuando alguien te dice algo duro, intentas oír qué observa, qué siente y qué necesita. Hasta una frase enfadada tiene una necesidad debajo, y preguntarla con calma suele ser más útil que defenderse de ella. La conversación pasa entonces de la acusación hacia las necesidades.

[[lessons]]
$$**Busca la necesidad bajo la crítica antes de decirla.** Si un compañero de piso vuelve a dejar los platos en el fregadero, "eres un desordenado" es la frase fácil, y el otro se pone enseguida a la defensiva. Di lo que viste y luego que necesitas una cocina ordenada, y podrás pedir algo concreto. En ese orden, además, aclaras tu propia preocupación antes de abrir la boca y das al otro una frase a la que puede responder en vez de una contra la que tiene que defenderse.$$

[[reflect]]
&&En tu última discusión, ¿qué necesidad tuya sin cubrir se escondía bajo el juicio que dijiste en voz alta?&&

[[use]]
%%context:meeting | Un colega envía siempre el archivo compartido a última hora :: "El archivo llegó una hora antes de la entrega esta semana. Eso me inquieta, porque necesito tiempo para revisarlo. ¿Podrías enviarlo el jueves por la tarde?"%%

%%context:family | Tu pareja ha llegado tarde otra vez :: "Llegaste media hora tarde y me sentí sola esperando. Cenar juntos me importa. La próxima vez, ¿puedes avisarme si vas a tardar?"%%

%%context:oneonone | Alguien te lanzó una crítica dura :: "¿Te pesa algo mientras lo dices? Antes de responder, quiero entender qué necesitas."%%

[[pocket]]
@@Antes de decir el juicio, di qué pasó, qué sientes, qué necesitas y una petición.@@
````

### Deutsch (`de`)

- **Kategori:** Kommunikation
- **Kitap:** Nonviolent Communication
- **Başlık:** Das Bedürfnis hinter dem Vorwurf
- **Kanca (hook):** Welches unerfüllte Bedürfnis steckte in deinem letzten Streit hinter deinem Vorwurf?

**1 dakikalık özet:**

> Der klinische Psychologe Marshall Rosenberg vermittelte jahrzehntelang in Schulen, Gefängnissen und Konfliktzonen und stieß immer auf dasselbe Muster: Menschen werfen einander Urteile zu, statt zu sagen, was sie brauchen. Sein Modell der Gewaltfreien Kommunikation verbreitete sich in Klassenzimmern, Unternehmen und Friedensverhandlungen weltweit; sein Kern passt in eine Zeile: Unter jeder Kritik liegt ein unerfülltes Bedürfnis, und es zu benennen entschärft den Konflikt.

**Okuma sayfası metni (ham işaretleme):**

````text
[[open]]
"Du hörst mir nie zu." Es ist der schnellste Satz in einem Streit und der, der das Gespräch am zuverlässigsten beendet. Ein klinischer Psychologe verbrachte Jahre damit, zu betrachten, was man stattdessen sagen könnte.

[[story]]
In *Nonviolent Communication* (1999) beschreibt der klinische Psychologe Marshall Rosenberg etwas, das er in Konflikten immer wieder sah: Menschen urteilen, statt zu sagen, was sie brauchen. Der Beurteilte geht in die Verteidigung, weil er ein Urteil über sich hört, kein Bedürfnis. Das Gespräch bleibt dort stecken, lange bevor es zur eigentlichen Sache kommt.

Rosenberg bietet einen Ausweg in vier Teilen, der Reihe nach gesagt. Zuerst eine Beobachtung: Du beschreibst, was geschehen ist, ohne eine Bewertung hinzuzufügen. Dann ein Gefühl: Du sagst, was du empfindest. Das dritte ist ein Bedürfnis, das Unerfüllte unter dem Gefühl. Das vierte ist eine Bitte, etwas Klares und Machbares, um das du den anderen bittest. Keiner der vier Schritte sagt etwas über den Charakter des anderen.

##Für Rosenberg ist jedes Urteil der indirekte Ausdruck eines unerfüllten Bedürfnisses.## Ein kritischer Satz ist also der Ort, an dem du nach deinem eigentlichen Anliegen suchst. Hast du es gefunden und benannt, begegnet der andere einem Bedürfnis statt einem Etikett.

Bedürfnisse sind seiner Auffassung nach grundlegend und allen gemeinsam: verstanden zu werden, sich sicher zu fühlen, respektiert zu werden. Weil jeder weiß, was das ist, klingt ein Satz über ein Bedürfnis dem Zuhörer nicht fremd. Ein Urteil dagegen lässt sich bestreiten, weil es die Frage aufwirft, wer recht hat.

Auch der Unterschied zwischen Bitte und Forderung zählt. Ist der andere frei, Nein zu sagen, ist es eine Bitte. Wird er dafür getadelt, dass er Nein sagt, war es eine Forderung.

Die vier Schritte taugen auch zum Zuhören. Wenn dir jemand etwas Hartes sagt, versuchst du zu hören, was er beobachtet, was er fühlt und was er braucht. Selbst ein wütender Satz hat ein Bedürfnis darunter. Das Gespräch verschiebt sich dann von der Anklage hin zu den Bedürfnissen.

[[lessons]]
$$**Suche das Bedürfnis unter der Kritik, bevor du sie sagst.** Wenn ein Mitbewohner schon wieder das Geschirr in der Spüle lässt, ist "du bist unordentlich" der leichte Satz, und der andere verteidigt sich sofort. Sag, was du gesehen hast, und dann, dass du eine aufgeräumte Küche brauchst, so kannst du um etwas Konkretes bitten. In dieser Reihenfolge klärst du außerdem dein eigenes Anliegen, bevor du den Mund aufmachst, und gibst dem anderen einen Satz, den er beantworten kann, statt eines, gegen den er sich wehren muss.$$

[[reflect]]
&&Welches unerfüllte Bedürfnis von dir steckte in deinem letzten Streit unter dem Urteil, das du laut ausgesprochen hast?&&

[[use]]
%%context:meeting | Ein Kollege schickt die gemeinsame Datei immer in letzter Minute :: "Die Datei kam diese Woche eine Stunde vor dem Abgabetermin. Das beunruhigt mich, weil ich Zeit zum Prüfen brauche. Könntest du sie Donnerstagabend schicken?"%%

%%context:family | Dein Partner kommt schon wieder zu spät :: "Du bist eine halbe Stunde zu spät gekommen, und ich habe mich beim Warten allein gefühlt. Gemeinsames Essen ist mir wichtig. Könntest du mir nächstes Mal schreiben, wenn du später kommst?"%%

%%context:oneonone | Jemand hat dir eine scharfe Kritik an den Kopf geworfen :: "Belastet dich gerade etwas, während du das sagst? Bevor ich antworte, will ich verstehen, was du brauchst."%%

[[pocket]]
@@Sag vor dem Urteil, was geschehen ist, was du fühlst, was du brauchst und eine Bitte.@@
````

---

## Bilim / Science — #1717

- **Yazar:** Nicholas Carr (2010)
- **Okuma süresi:** 3 dk
- **Viral puan:** 84 / 100 (750 hikâye içinde 97. sıra)

### Türkçe (`tr`)

- **Kategori:** Bilim
- **Kitap:** The Shallows
- **Başlık:** Nicholas Carr Neden Bir Kitabı Bitiremez Oldu?
- **Kanca (hook):** Son yıllarda hangi zihinsel becerin güçlenirken hangisi zayıfladı?

**1 dakikalık özet:**

> Nicholas Carr yıllarca yoğun okuyan bir yazardı; sonra birkaç sayfadan sonra zihninin kaçtığını fark etti. İnternet ona hızla tarama, bağlantı seçme ve yeni uyarana geçme becerisi kazandırmıştı. Aynı alışkanlık uzun bir metnin içinde kalmayı zorlaştırıyordu. Carr soruyu “İnternet bize ne veriyor?”dan “Kullandığımız araç dikkat biçimimizi nasıl yeniden kuruyor?”a çevirdi. Bu ayrıntı sonucu tek bir kişilik özelliğiyle açıklamanın neden yetersiz kaldığını gösterir.

**Okuma sayfası metni (ham işaretleme):**

````text
[[open]]
Üçüncü sayfaya geldiğinde Nicholas Carr'ın zihni metinden çıkıp gitti. Yıllarca derinlemesine okumuş biri, elindeki kitapta birkaç sayfa ilerlemeden huzursuzlaşıyor, konunun ipini kaybediyor ve yapacak başka bir şey arıyordu. Nedenini önce kendisi de bilmiyordu.

[[story]]
Nicholas Carr yıllarca yoğun okuyan bir yazardı. Sonra bir şey değişti: bir kitapta ya da uzun bir yazıda birkaç sayfa ilerledikten sonra zihni kaçmaya başladı. Huzursuzlanıyor, konunun ipini kaybediyor ve yapacak başka bir iş arıyordu. Ona göre bu, kaçan bir zihni metne geri çekmeye çalışmak gibiydi.

Kitabın girişinde bunu şöyle dile getirir: zihnine biri ya da bir şey dokunuyor, onun sinir bağlantılarını yeniden düzenliyor ve belleğini yeniden programlıyordu. Zihnini kaybetmiyordu, ama değiştiğini hissediyordu. Giriş, filmlerden tanıdığımız bir sahneye, 2001'de HAL adlı bilgisayarın devre dışı bırakılışına da gönderme yapar.

İnternet ona hızla tarama, bağlantı seçme ve yeni uyarana geçme alışkanlığı kazandırmıştı. Aynı alışkanlık, uzun bir metnin içinde kalmayı zorlaştırıyordu. Carr bunu bir imgeyle anlatır: eskiden kelimelerin denizinde dalıcıydı, şimdi yüzeyde bir deniz motoruyla kayıyordu.

Önce yaşa bağladığı bu değişimi, sonra bilgiyi artık alış biçiminin bir sonucu olarak gördü. Zihni, internetin sunduğu hızlı akışa göre ayarlanmıştı. Çevresinde de benzer şeyleri yaşayan insanlar vardı.

Carr soruyu çevirdi. "İnternet bize ne veriyor?" yerine, "Kullandığımız araç dikkat biçimimizi nasıl yeniden kuruyor?" diye sordu. Bunun için Marshall McLuhan'a yaslanır: medya yalnızca ne okuduğumuzu değil, nasıl düşündüğümüzü de biçimlendirir.

Bir öncül de gösterir: Friedrich Nietzsche, hastalık el yazısını zorlaştırınca 1882'de daktiloya geçti ve yazısının niteliği değişti. Araç yalnızca yazmayı kolaylaştırmamış, yazanı da etkilemişti.

##Carr'ın dikkati bir anda kaybolmadı; kullandığı araç onu yavaş yavaş başka bir okuma biçimine alıştırmıştı.## Kitabın başlığı bu yüzden "sığlık" der: derin dalış yerine yüzeyde süzülmek.

[[lessons]]
$$**Hangi aracın dikkatinizi hızlandırdığını fark edin.** Ders çalışırken her yeni bilgi için tarayıcıda yeni bir sekme açan bir öğrenci, ödevini bitirse de metne hiç dalmamış olabilir. Okumaya ayırdığınız bir saatte telefonu başka odaya koymak, hangi alışkanlığın sizi yüzeye çektiğini görmenizi sağlar ve sorunu kendinizde değil, aracın düzeninde aramanıza yardım eder. Böylece derin okumayı korumak istediğiniz yeri kendiniz seçer, bir sonraki kitabı hangi koşulda açacağınıza önceden karar verirsiniz.$$

[[reflect]]
&&Günlük düzeninde hangi araç dikkatini sessizce hızlanmaya alıştırıyor ve bir metni baştan sona hâlâ ne zaman okuyorsun?&&

[[use]]
%%context:self | Uzun bir yazıyı bitirmek istiyorsunuz. :: "Telefonu yan odaya koyuyorum ve yalnızca ilk bölümü okuyacağım."%%

%%context:meeting | Ekip e-postaları hızlıca tarıyor ve ayrıntıyı kaçırıyor. :: "Toplantıdan önce tek bir belgeyi baştan sona okuyalım."%%

%%context:social | Bir arkadaşınız artık kitap bitiremediğini söylüyor. :: "Carr'ın deniz motoru benzetmesi geldi aklıma; en son neyi baştan sona okudun?"%%

[[pocket]]
@@Carr kelimelerin denizinde dalıcıydı, sonra yüzeyde kaymaya başladı: hızlandıran araç okuyuşu da değiştirir.@@
````

### English (`en`)

- **Kategori:** Science
- **Kitap:** The Shallows
- **Başlık:** Why Nicholas Carr Could No Longer Finish a Book
- **Kanca (hook):** Which mental ability has strengthened recently, and which has weakened?

**1 dakikalık özet:**

> Nicholas Carr had long been an intensive reader, then noticed his mind wandering after a few pages. The internet had trained useful skills: scanning quickly, choosing links, and moving to fresh information. The same habits made staying inside a long argument harder. Carr changed his question from what the internet gives us to how a frequently used tool rebuilds the form of attention itself.

**Okuma sayfası metni (ham işaretleme):**

````text
[[open]]
A few pages into a book, Nicholas Carr's mind would leave the text. He had read deeply for years, yet now he grew restless, lost the thread and went looking for something else to do. He did not know at first what had changed.

[[story]]
Nicholas Carr was for years a heavy reader. Then something shifted: a few pages into a book or a long article, his mind began to slip away. He turned restless, lost the thread of the argument and looked for something else to do. To him it felt like dragging a wayward mind back to the text.

He describes it in the book's opening as an uncomfortable sense that someone, or something, had been tinkering with his brain, remapping its circuits and reprogramming its memory. His mind was not going, he says, but it was changing. The opening also nods to a scene from the film 2001, in which the computer HAL is disconnected.

The internet had given him a habit of fast scanning, picking links and moving to the next stimulus. The same habit made it hard to stay inside a long text. Carr gives it an image: he used to be a diver in a sea of words, and now he skims along the surface on a Jet Ski.

At first he put it down to age. Later he saw it as a result of how he now took in information, since his mind had been tuned to the quick stream the internet offers. People around him described much the same thing.

Carr then turned the question around. Instead of "What does the internet give us?", he asked, "How does the tool we use rebuild the way we pay attention?" He leans on Marshall McLuhan here: media shape not only what we read but how we think.

He points to a precedent as well. Friedrich Nietzsche began using a typewriter in 1882, when illness made writing by hand hard, and his writing changed. The tool had not only made writing easier, it had also affected the writer.

##Carr's attention did not vanish in an instant; the tool he used had slowly accustomed him to another way of reading.## That is why the book's title speaks of shallows: skimming the surface instead of diving deep.

[[lessons]]
$$**Notice which tool is speeding up your attention.** A student who opens a new browser tab for every fresh fact while studying may finish the assignment without ever sinking into the text. Putting the phone in another room for one hour of reading helps you see which habit pulls you to the surface, and it points you to the setup of the tool instead of to a flaw in yourself. You can then decide ahead of time under what conditions you will open your next book.$$

[[reflect]]
&&Which tool in your daily routine is quietly teaching your attention to move faster, and when do you still read something all the way through?&&

[[use]]
%%context:self | You want to finish a long article. :: "I'm putting my phone in the next room and reading just the first section."%%

%%context:meeting | Your team scans emails and misses details. :: "Before the meeting, let's all read one document from start to finish."%%

%%context:social | A friend says they can't finish books anymore. :: "Carr's Jet Ski image comes to mind. What was the last thing you read all the way through?"%%

[[pocket]]
@@Carr dived through words, then found himself skimming: a tool that speeds you up changes how you read.@@
````

### Español (`es`)

- **Kategori:** Ciencia
- **Kitap:** The Shallows
- **Başlık:** Por qué Nicholas Carr dejó de poder terminar un libro
- **Kanca (hook):** ¿Qué capacidad mental se fortaleció y cuál se debilitó en los últimos años?

**1 dakikalık özet:**

> Nicholas Carr había sido un lector intenso, pero descubrió que su mente escapaba después de pocas páginas. Internet le había enseñado a recorrer, elegir enlaces y buscar estímulos nuevos con rapidez. Esos mismos hábitos dificultaban permanecer dentro de un argumento largo. Cambió la pregunta desde lo que internet ofrece hacia cómo una herramienta frecuente reconstruye la forma de atención.

**Okuma sayfası metni (ham işaretleme):**

````text
[[open]]
A las pocas páginas de un libro, la mente de Nicholas Carr se iba del texto. Había leído a fondo durante años, pero ahora se inquietaba, perdía el hilo y buscaba otra cosa que hacer. Al principio no sabía qué había cambiado.

[[story]]
Nicholas Carr fue durante años un lector intenso. Luego algo cambió: unas páginas después de empezar un libro o un artículo largo, su mente empezaba a escaparse. Se ponía inquieto, perdía el hilo del argumento y buscaba otra cosa que hacer. Le parecía que tenía que arrastrar de vuelta al texto a una mente descarriada.

Lo describe al comienzo del libro como una incómoda sensación de que alguien, o algo, había estado manipulando su cerebro, reorganizando sus circuitos y reprogramando su memoria. Su mente no se estaba yendo, dice, pero sí estaba cambiando. El comienzo hace además un guiño a una escena de la película 2001, en la que se desconecta al ordenador HAL.

Internet le había dado el hábito de escanear rápido, elegir enlaces y pasar al siguiente estímulo. Ese mismo hábito hacía difícil quedarse dentro de un texto largo. Carr lo explica con una imagen: antes era un buzo en un mar de palabras, y ahora se desliza por la superficie en una moto de agua.

Al principio lo atribuyó a la edad. Más tarde lo vio como resultado de la manera en que ahora tomaba la información, porque su mente se había ajustado al flujo rápido que ofrece internet. A su alrededor, otras personas describían algo muy parecido.

Entonces Carr dio la vuelta a la pregunta. En lugar de "¿qué nos da internet?", preguntó "¿cómo reconstruye la herramienta que usamos nuestra forma de prestar atención?". Aquí se apoya en Marshall McLuhan: los medios no solo moldean lo que leemos, sino también cómo pensamos.

Señala además un antecedente. Friedrich Nietzsche empezó a usar una máquina de escribir en 1882, cuando la enfermedad le dificultó escribir a mano, y su escritura cambió. La herramienta no solo había facilitado la escritura, también había influido en quien escribía.

##La atención de Carr no desapareció de golpe: la herramienta que usaba lo fue acostumbrando poco a poco a otra forma de leer.## Por eso el título del libro habla de aguas poco profundas: deslizarse por la superficie en lugar de bucear.

[[lessons]]
$$**Fíjate en qué herramienta acelera tu atención.** Un estudiante que abre una pestaña nueva del navegador por cada dato mientras estudia puede terminar la tarea sin haberse hundido nunca en el texto. Dejar el teléfono en otra habitación durante una hora de lectura te ayuda a ver qué hábito te arrastra a la superficie, y te lleva a mirar cómo está montada la herramienta en lugar de buscar un defecto en ti. Después puedes decidir de antemano en qué condiciones abrirás tu próximo libro.$$

[[reflect]]
&&¿Qué herramienta de tu rutina diaria enseña a tu atención, sin que lo notes, a moverse más rápido, y cuándo sigues leyendo algo de principio a fin?&&

[[use]]
%%context:self | Quieres terminar un artículo largo. :: "Dejo el teléfono en la habitación de al lado y leo solo la primera sección."%%

%%context:meeting | Tu equipo escanea los correos y se le escapan los detalles. :: "Antes de la reunión, leamos todos un documento de principio a fin."%%

%%context:social | Un amigo dice que ya no puede terminar libros. :: "Me acuerdo de la moto de agua de Carr. ¿Qué fue lo último que leíste entero?"%%

[[pocket]]
@@Carr buceaba entre palabras y se vio rozándolas: lo que te acelera cambia cómo lees.@@
````

### Deutsch (`de`)

- **Kategori:** Wissenschaft
- **Kitap:** The Shallows
- **Başlık:** Warum Nicholas Carr kein Buch mehr beenden konnte
- **Kanca (hook):** Welche geistige Fähigkeit wurde stärker und welche schwächer?

**1 dakikalık özet:**

> Nicholas Carr war lange ein intensiver Leser, bemerkte dann aber, dass seine Gedanken nach wenigen Seiten abschweiften. Das Internet hatte nützliche Fähigkeiten trainiert: schnelles Überfliegen, Linkauswahl und Wechsel zu neuen Reizen. Dieselben Gewohnheiten erschwerten lange Argumente. Carr fragte nun, wie ein häufig genutztes Werkzeug die Form der Aufmerksamkeit selbst umbaut. Dieses Detail zeigt, warum ein einzelner Charakterzug das Ergebnis nicht erklären kann.

**Okuma sayfası metni (ham işaretleme):**

````text
[[open]]
Ein paar Seiten in ein Buch hinein, und Nicholas Carrs Gedanken verließen den Text. Jahrelang hatte er tief gelesen, nun wurde er unruhig, verlor den Faden und suchte nach etwas anderem. Was sich verändert hatte, wusste er zunächst nicht.

[[story]]
Nicholas Carr war jahrelang ein intensiver Leser. Dann veränderte sich etwas: Wenige Seiten nach dem Beginn eines Buchs oder langen Artikels begann sein Geist abzuschweifen. Er wurde unruhig, verlor den Faden der Argumentation und suchte nach etwas anderem zu tun. Es fühlte sich für ihn an, als müsse er einen widerspenstigen Geist zum Text zurückzerren.

Zu Beginn des Buchs beschreibt er es als unangenehmes Gefühl, jemand oder etwas habe an seinem Gehirn herumgebastelt, seine Schaltkreise neu verdrahtet und sein Gedächtnis umprogrammiert. Sein Verstand schwinde nicht, sagt er, aber er verändere sich. Der Anfang spielt außerdem auf eine Szene aus dem Film 2001 an, in der der Computer HAL abgeschaltet wird.

Das Internet hatte ihm die Gewohnheit gegeben, schnell zu überfliegen, Links auszuwählen und zum nächsten Reiz zu springen. Dieselbe Gewohnheit machte es schwer, in einem langen Text zu bleiben. Carr fasst es in ein Bild: Früher war er ein Taucher im Meer der Wörter, jetzt gleite er auf einem Jetski über die Oberfläche.

Zuerst schob er es auf das Alter. Später sah er darin die Folge davon, wie er Informationen inzwischen aufnahm, denn sein Geist hatte sich auf den schnellen Strom eingestellt, den das Internet bietet. Menschen um ihn herum beschrieben Ähnliches.

Dann drehte Carr die Frage um. Statt "Was gibt uns das Internet?" fragte er: "Wie baut das Werkzeug, das wir benutzen, unsere Art der Aufmerksamkeit um?" Dabei stützt er sich auf Marshall McLuhan: Medien prägen nicht nur, was wir lesen, sondern auch, wie wir denken.

Er verweist auch auf einen Vorläufer. Friedrich Nietzsche begann 1882 mit einer Schreibmaschine zu arbeiten, als Krankheit das Schreiben von Hand erschwerte, und sein Schreiben veränderte sich. Das Werkzeug hatte das Schreiben nicht nur erleichtert, es hatte auch den Schreibenden beeinflusst.

##Carrs Aufmerksamkeit verschwand nicht auf einmal; das Werkzeug, das er benutzte, hatte ihn langsam an eine andere Art des Lesens gewöhnt.## Darum spricht der Buchtitel von seichten Gewässern: an der Oberfläche gleiten, statt tief zu tauchen.

[[lessons]]
$$**Achte darauf, welches Werkzeug deine Aufmerksamkeit beschleunigt.** Eine Studentin, die beim Lernen für jede neue Information einen neuen Browser-Tab öffnet, kann die Aufgabe beenden, ohne je in den Text eingetaucht zu sein. Das Handy für eine Lesestunde in einen anderen Raum zu legen, zeigt dir, welche Gewohnheit dich an die Oberfläche zieht, und lenkt den Blick auf den Aufbau des Werkzeugs statt auf einen Fehler in dir. Danach kannst du im Voraus entscheiden, unter welchen Bedingungen du dein nächstes Buch aufschlägst.$$

[[reflect]]
&&Welches Werkzeug in deinem Alltag gewöhnt deine Aufmerksamkeit leise an mehr Tempo, und wann liest du noch etwas von Anfang bis Ende?&&

[[use]]
%%context:self | Du willst einen langen Artikel zu Ende lesen. :: "Ich lege das Handy ins Nebenzimmer und lese nur den ersten Abschnitt."%%

%%context:meeting | Dein Team überfliegt E-Mails und übersieht Details. :: "Lasst uns vor dem Meeting alle ein Dokument von vorn bis hinten lesen."%%

%%context:social | Eine Freundin sagt, sie schaffe keine Bücher mehr bis zum Ende. :: "Mir fällt Carrs Jetski-Bild ein. Was hast du zuletzt ganz gelesen?"%%

[[pocket]]
@@Carr war Taucher im Meer der Wörter und glitt plötzlich an der Oberfläche: Was beschleunigt, verändert auch das Lesen.@@
````


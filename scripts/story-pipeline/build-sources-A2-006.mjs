#!/usr/bin/env node
/**
 * build-sources-A2-006.mjs — Tek seferlik: kaynaksiz iddialara kaynak/atif ekler.
 *
 * audit-facts.mjs `unsourced` denetiminin buldugu 18 hikaye. Cogunun arkasinda
 * GERCEK bir kaynak var, sadece adi yazilmamis (Kahneman-Tversky, Killingsworth
 * & Gilbert, S&P SPIVA, Lazar & Holzel). Bir kismi ise kitabin kendi gozlemi;
 * o durumda "arastirmalar" yerine yazara atfedildi.
 *
 * Yontem: her dilde belirsiz-kaynak CUMLESI regex ile bulunur ve komple
 * degistirilir. 72 ayri "find" dizesi elle yazilmaz.
 *
 * Saglik iceren ikisinde (1630, 1633) uretim-kurallari.md bolum 5 geregi
 * kisisel tavsiye vermeme ve hekime yonlendirme dili eklendi.
 */
import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { ROOT, LANGS, openDb, rows } from './lib/store.mjs';

const OUT = resolve(ROOT, 'staging/batch-A2-006-sources.json');

/* DIKKAT: Basdaki [^.!?\n] sinifina isaret karakterleri DAHIL EDILMEZ.
   Bazi belirsiz-kaynak cumleleri bir ## blogunun ICINDE (`##Arastirmalar gosteriyor ki ...`).
   Isaret karakteri yutulursa replace acilis ##'ini siler ve blok kapanmamis olur;
   dogrulayici 17 hata verdi. Bu yuzden bas kisim #$&~ karakterlerini disliyor. */
const PAT = {
  tr: /[^.!?\n#$&~]*(?:[Aa]raştırmalar\s+(?:gösteriyor|gösterdi|defalarca)|bir araştırmaya göre)[^.!?\n]*[.!?]/,
  en: /[^.!?\n#$&~]*(?:[Ss]tudies\s+(?:show|have shown|repeatedly|consistently)|[Rr]esearch (?:shows|showed|has repeatedly shown|has shown)|[Aa]ccording to (?:one|a) study)[^.!?\n]*[.!?]/,
  es: /[^.!?\n#$&~]*(?:[Ll]as investigaciones\s+(?:muestran|demostraron|demuestran|lo han demostrado|han demostrado)|[Ll]os estudios\s+(?:muestran|demuestran)|[Ss]egún un estudio|[Ll]a investigación (?:psicológica )?(?:muestra|demuestra))[^.!?\n]*[.!?]/,
  de: /[^.!?\n#$&~]*(?:Studien\s+(?:zeigen|zeigten|haben gezeigt|belegen)|(?:Untersuchungen|Forschungen)\s+(?:zeigen|zeigten|haben (?:immer wieder )?gezeigt)|laut einer Studie|Die Forschung zeigt)[^.!?\n]*[.!?]/i,
};

/** story_id -> dil -> yerine gecen kaynakli cumle */
const FIX = {
  1092: {
    tr: "Canfield'ın aktardığına göre liste yazmayanlar yılda ortalama bir iki anlamlı hedefe ulaşıyor; rakam kitabın kendi gözlemi, bağımsız bir çalışma değil.",
    en: 'Canfield reports that people who do not write lists reach one or two meaningful goals a year; the figure is his own observation, not an independent study.',
    es: 'Canfield señala que quienes no escriben listas logran uno o dos objetivos significativos al año; la cifra es su propia observación, no un estudio independiente.',
    de: 'Canfield berichtet, dass Menschen ohne Listen ein bis zwei bedeutsame Ziele pro Jahr erreichen; die Zahl ist seine eigene Beobachtung, keine unabhängige Studie.',
  },
  1097: {
    tr: "Covey'e göre çoğu insan dinlerken aslında cevabını hazırlıyor; bu kitabın gözlemi, ölçülmüş bir oran değil.",
    en: "Covey's point is that most people prepare their reply while listening; this is his observation, not a measured percentage.",
    es: 'Covey sostiene que la mayoría prepara su respuesta mientras escucha; es su observación, no un porcentaje medido.',
    de: 'Covey zufolge bereiten die meisten ihre Antwort vor, während sie zuhören; das ist seine Beobachtung, kein gemessener Anteil.',
  },
  1109: {
    tr: "Goleman'ın tezi bu: duygusal beceriler teknik ustalıktan daha iyi öngörücü. İddia kitabın merkezinde ve tartışması sürüyor.",
    en: "That is Goleman's thesis: emotional skills predict outcomes better than technical mastery. The claim is central to his book and still debated.",
    es: 'Esa es la tesis de Goleman: las habilidades emocionales predicen mejor que la maestría técnica. La afirmación sigue discutiéndose.',
    de: 'Das ist Golemans These: Emotionale Fähigkeiten sagen mehr voraus als technisches Können. Die Behauptung wird weiter diskutiert.',
  },
  1134: {
    tr: 'Brooks kararların büyük bölümünün bilinçdışı süreçlerle alındığını savunuyor; sık aktarılan yüzde doksan gibi oranların ampirik dayanağı zayıf.',
    en: 'Brooks argues most decisions come from unconscious processes; the widely quoted ninety percent figure has weak empirical grounding.',
    es: 'Brooks sostiene que la mayoría de las decisiones surgen de procesos inconscientes; la cifra del noventa por ciento tiene poco respaldo empírico.',
    de: 'Brooks argumentiert, die meisten Entscheidungen entstünden unbewusst; die oft zitierte Neunzig-Prozent-Zahl ist empirisch schwach belegt.',
  },
  1158: {
    tr: 'Kitabın yazarları bu anlarda insanların çoğunlukla ya sustuğunu ya da patladığını söylüyor; gözlem kendi saha çalışmalarına dayanıyor.',
    en: "The book's authors say people in these moments mostly go silent or explode; the observation comes from their own fieldwork.",
    es: 'Los autores del libro dicen que en esos momentos la gente calla o estalla; la observación viene de su propio trabajo de campo.',
    de: 'Die Autoren des Buches sagen, Menschen schweigen in solchen Momenten meist oder explodieren; die Beobachtung stammt aus ihrer eigenen Feldarbeit.',
  },
  1184: {
    tr: "Kahneman ve Tversky'nin beklenti kuramı bunu ölçtü: kayıp acısı, aynı büyüklükteki kazancın sevincinden yaklaşık iki kat ağır basıyor.",
    en: 'Kahneman and Tversky measured this in prospect theory: the pain of a loss weighs roughly twice the pleasure of an equal gain.',
    es: 'Kahneman y Tversky lo midieron en la teoría prospectiva: el dolor de una pérdida pesa unas dos veces más que el placer de una ganancia igual.',
    de: 'Kahneman und Tversky maßen das in der Prospect Theory: Der Schmerz eines Verlusts wiegt etwa doppelt so schwer wie die Freude über einen gleich großen Gewinn.',
  },
  1351: {
    tr: 'Kortizolün uyanmadan hemen sonra yükselmesi belgeli bir ritim; Sharma bunu beşte kalkma önerisine bağlıyor, o bağlantı ise kendi yorumu.',
    en: 'The rise of cortisol shortly after waking is a documented rhythm; Sharma ties it to rising at five, and that link is his own interpretation.',
    es: 'El aumento del cortisol justo tras despertar es un ritmo documentado; Sharma lo vincula a levantarse a las cinco, y ese vínculo es su interpretación.',
    de: 'Der Cortisolanstieg kurz nach dem Aufwachen ist ein belegter Rhythmus; Sharma verknüpft ihn mit dem Aufstehen um fünf, und das ist seine Deutung.',
  },
  1364: {
    tr: "Sandberg'e bu çerçeveyi anlatan psikolog Martin Seligman'dı; üç P kalıcılık, yaygınlık ve kişiselleştirme demek.",
    en: 'The psychologist who gave Sandberg this frame was Martin Seligman; the three Ps are permanence, pervasiveness and personalization.',
    es: 'El psicólogo que dio a Sandberg ese marco fue Martin Seligman; las tres P son permanencia, omnipresencia y personalización.',
    de: 'Der Psychologe, der Sandberg diesen Rahmen gab, war Martin Seligman; die drei P stehen für Permanenz, Pervasivität und Personalisierung.',
  },
  1405: {
    tr: 'Allen bu sayıyı kendi danışmanlık deneyiminden aktarıyor; ölçülmüş bir araştırma sonucu değil.',
    en: 'Allen reports this number from his own consulting experience; it is not a measured research finding.',
    es: 'Allen aporta esa cifra desde su experiencia como consultor; no es el resultado de una investigación medida.',
    de: 'Allen nennt diese Zahl aus seiner Beratungspraxis; sie ist kein gemessenes Forschungsergebnis.',
  },
  1423: {
    tr: "Killingsworth ve Gilbert'in 2010'da Science'ta yayımladığı çalışma bunu ölçtü: insanlar uyanık zamanlarının yaklaşık yüzde kırk yedisinde başka bir şey düşünüyor.",
    en: 'Killingsworth and Gilbert measured this in Science in 2010: people think about something else roughly forty-seven percent of their waking hours.',
    es: 'Killingsworth y Gilbert lo midieron en Science en 2010: la gente piensa en otra cosa cerca del cuarenta y siete por ciento de sus horas de vigilia.',
    de: 'Killingsworth und Gilbert maßen das 2010 in Science: Menschen denken etwa siebenundvierzig Prozent ihrer wachen Zeit an etwas anderes.',
  },
  1435: {
    tr: "Tracy'ye göre satın alma kararlarının çoğu duyguyla alınıp sonradan mantıkla gerekçelendiriliyor; bu satış literatüründe yaygın bir gözlem.",
    en: "Tracy's view is that most purchases are decided emotionally and justified afterwards; this is a common observation in sales literature.",
    es: 'Para Tracy, la mayoría de las compras se deciden emocionalmente y se justifican después; es una observación común en la literatura de ventas.',
    de: 'Für Tracy werden die meisten Käufe emotional entschieden und danach begründet; das ist eine gängige Beobachtung in der Verkaufsliteratur.',
  },
  1610: {
    tr: "S&P'nin düzenli SPIVA raporları bunu yıllardır gösteriyor: on yıllık dönemlerde aktif fon yöneticilerinin büyük çoğunluğu endeksin gerisinde kalıyor.",
    en: "S&P's regular SPIVA reports have shown this for years: over ten-year periods the large majority of active managers trail the index.",
    es: 'Los informes SPIVA de S&P lo muestran desde hace años: en periodos de diez años la gran mayoría de los gestores activos queda por detrás del índice.',
    de: 'Die regelmäßigen SPIVA-Berichte von S&P zeigen das seit Jahren: über Zehnjahreszeiträume bleibt die große Mehrheit aktiver Manager hinter dem Index.',
  },
  1630: {
    tr: 'Maté kronik stres ile bağışıklık arasında bağ kuruyor; bu bağın gücü ve yönü tıpta hâlâ tartışmalı ve buradaki anlatım kişisel bir teşhis ya da tedavi önerisi değil.',
    en: 'Maté links chronic stress to immune function; the strength and direction of that link remain debated in medicine, and none of this is diagnostic or treatment advice.',
    es: 'Maté vincula el estrés crónico con la función inmune; la fuerza y la dirección de ese vínculo siguen debatiéndose en medicina, y esto no es un consejo médico.',
    de: 'Maté verknüpft chronischen Stress mit der Immunfunktion; Stärke und Richtung dieses Zusammenhangs sind medizinisch weiter umstritten, und dies ist kein ärztlicher Rat.',
  },
  1633: {
    tr: "Maté DEHB'yi büyük ölçüde erken çevre koşullarına bağlıyor; bu görüş klinik literatürde azınlıkta ve kalıtımın rolünü gösteren güçlü kanıtlar var. Tanı ve tedavi hekime aittir.",
    en: 'Maté attributes ADHD largely to early environment; this is a minority position in the clinical literature, where strong evidence supports a heritable component. Diagnosis and treatment belong with a clinician.',
    es: 'Maté atribuye el TDAH sobre todo al entorno temprano; es una posición minoritaria en la literatura clínica, que aporta pruebas sólidas de un componente hereditario. El diagnóstico corresponde a un profesional.',
    de: 'Maté führt ADHS vor allem auf frühe Umweltbedingungen zurück; das ist in der klinischen Literatur eine Minderheitsposition, es gibt starke Belege für eine erbliche Komponente. Diagnose und Behandlung gehören in ärztliche Hände.',
  },
  1640: {
    tr: "Brown'ın kendi araştırması bu ayrımı ortaya koydu: suçluluk davranışa, utanç kimliğe yöneliyor.",
    en: "Brown's own research produced this distinction: guilt targets behaviour, shame targets identity.",
    es: 'La propia investigación de Brown produjo esta distinción: la culpa apunta a la conducta, la vergüenza a la identidad.',
    de: 'Browns eigene Forschung brachte diese Unterscheidung hervor: Schuld zielt auf Verhalten, Scham auf Identität.',
  },
  1679: {
    tr: 'Puddicombe kısa sürelerin bile işe yaradığını savunuyor; meditasyon çalışmalarının çoğu küçük örneklemli ve etki büyüklükleri tartışmalı.',
    en: 'Puddicombe argues even short sessions work; most meditation studies use small samples and their effect sizes are debated.',
    es: 'Puddicombe sostiene que incluso las sesiones cortas funcionan; la mayoría de los estudios sobre meditación usan muestras pequeñas y sus efectos se discuten.',
    de: 'Puddicombe hält schon kurze Einheiten für wirksam; die meisten Meditationsstudien haben kleine Stichproben und ihre Effektstärken sind umstritten.',
  },
  1684: {
    tr: "Harvard'da Sara Lazar ve Britta Hölzel'in çalışmaları sekiz haftalık programlardan sonra beyin yapısında değişim bildirdi; örneklemler küçük ve bulgular sınanmaya devam ediyor.",
    en: 'Work by Sara Lazar and Britta Hölzel at Harvard reported structural brain changes after eight-week programmes; the samples were small and the findings are still being retested.',
    es: 'Los trabajos de Sara Lazar y Britta Hölzel en Harvard informaron cambios estructurales tras programas de ocho semanas; las muestras eran pequeñas y los hallazgos siguen a prueba.',
    de: 'Arbeiten von Sara Lazar und Britta Hölzel in Harvard berichteten strukturelle Veränderungen nach Achtwochenprogrammen; die Stichproben waren klein und die Befunde werden weiter geprüft.',
  },
  1689: {
    tr: "Bu oran Bradberry'nin şirketi TalentSmart'ın kendi verisinden geliyor; bağımsız olarak doğrulanmış bir bulgu değil.",
    en: "That figure comes from TalentSmart, Bradberry's own company; it is not an independently verified finding.",
    es: 'Esa cifra procede de TalentSmart, la empresa del propio Bradberry; no es un hallazgo verificado de forma independiente.',
    de: 'Diese Zahl stammt von TalentSmart, Bradberrys eigenem Unternehmen; sie ist kein unabhängig geprüfter Befund.',
  },
};

const db = await openDb();
const current = new Map();
for (const r of rows(db, 'SELECT story_id, lang_code, content FROM story_translations')) {
  current.set(`${r.story_id}|${r.lang_code}`, r.content ?? '');
}
const titles = Object.fromEntries(
  rows(db, "SELECT story_id, title FROM story_translations WHERE lang_code='tr'").map((r) => [r.story_id, r.title])
);
db.close();

const items = [];
const skipped = [];

for (const [sidStr, byLang] of Object.entries(FIX)) {
  const sid = Number(sidStr);
  const langOut = {};
  for (const l of LANGS) {
    const text = current.get(`${sid}|${l}`);
    if (text == null) { skipped.push(`${sid}/${l}: kayit yok`); continue; }
    const m = text.match(PAT[l]);
    if (!m) { skipped.push(`${sid}/${l}: belirsiz-kaynak cumlesi bulunamadi`); continue; }
    langOut[l] = { content: text.replace(PAT[l], byLang[l]) };
  }
  if (Object.keys(langOut).length) {
    items.push({
      story: {
        story_id: sid,
        queue_title: titles[sid] ?? null,
        reason: 'kaynaksiz iddia — kaynak adlandirildi ya da yazara atfedildi',
        allow_overflow:
          'Kaynak adi eklemek cumleyi uzatiyor. Kaynaksiz iddia birakmak, kelime hedefini ' +
          'birkac kelime asmaktan daha kotu. Uzunluk ayri bir gorev.',
      },
      lang: langOut,
    });
  }
}

writeFileSync(OUT, `${JSON.stringify({
  batch_id: 'A2-006-sources',
  kind: 'content_fix',
  version: 'A2',
  created: new Date().toISOString().slice(0, 10),
  notes:
    'audit-facts.mjs `unsourced` denetiminin buldugu 18 hikaye. Cogunun arkasinda gercek kaynak ' +
    'vardi, sadece adi yazilmamisti: Kahneman-Tversky (1184), Killingsworth & Gilbert Science 2010 (1423), ' +
    'S&P SPIVA (1610), Lazar & Holzel (1684), Seligman (1364). Digerlerinde iddia kitabin kendi ' +
    'gozlemiydi; "arastirmalar gosteriyor" yerine yazara atfedildi. 1630 ve 1633 saglik iceriyor; ' +
    'uretim-kurallari.md bolum 5 geregi tartisma notu ve hekime yonlendirme eklendi. ' +
    '1689 TalentSmart verisi yazarin kendi sirketinden geliyor, bu belirtildi.',
  items,
}, null, 2)}\n`, 'utf8');

console.log(`[sources] ${items.length} hikaye · ${items.reduce((n, i) => n + Object.keys(i.lang).length, 0)} dil kaydi`);
if (skipped.length) {
  console.log(`\n  atlanan ${skipped.length} kayit (elle bakilmali):`);
  for (const s of skipped) console.log(`    ${s}`);
}

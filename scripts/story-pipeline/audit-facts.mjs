#!/usr/bin/env node
/**
 * audit-facts.mjs — Olgusal kusur tarayicisi.
 *
 * audit-translations.mjs BICIMSEL kusurlari bulur (isaret, uzunluk, sizinti).
 * Bu script ICERIKSEL kusur ADAYLARINI bulur. Fark onemli: bir iddianin dogru
 * olup olmadigini script bilemez. Yaptigi sey, insan dogrulamasi gereken
 * yerleri sonlu bir listeye indirmektir.
 *
 * Alti tip, A2-001..004 partilerinde ELLE bulunan 11 hatadan cikarildi:
 *   quotes     — kaynaksiz atifli alinti (uydurma alinti riski)
 *   causality  — iki tarih + nedensellik baglaci (ters nedensellik riski)
 *   attribution— hikayedeki yazar ile kitabin yazari uyusmuyor
 *   unsourced  — "arastirmalar gosteriyor" tipi kaynaksiz iddia
 *   contested  — bilinen tartismali tez, elestiri notu olmadan
 *   misfiled   — icerik baska bir DB kitabina ait gorunuyor
 *
 * SALT OKUNUR.
 *
 * Kullanim:
 *   node scripts/story-pipeline/audit-facts.mjs
 *   node scripts/story-pipeline/audit-facts.mjs --check contested,misfiled
 *   node scripts/story-pipeline/audit-facts.mjs --story 1113 --json
 *   node scripts/story-pipeline/audit-facts.mjs --limit 40
 */
import { openDb, rows, writeReport, stripMarkers } from './lib/store.mjs';

const argv = process.argv.slice(2);
const flag = (n) => { const i = argv.indexOf(`--${n}`); return i === -1 ? null : argv[i + 1]; };
const asJson = argv.includes('--json');
const limit = Number(flag('limit')) || 15;
const checkFilter = flag('check')?.split(',').map((s) => s.trim());
const storyFilter = flag('story')?.split(',').map((s) => Number(s.trim()));

/* ------------------------------------------------------------------ */
/* Sozlukler                                                           */
/* ------------------------------------------------------------------ */

/** Kaynaksiz iddia kaliplari — yanina somut kaynak gelmezse supheli. */
const VAGUE_SOURCE = [
  /\bara[sş]t[ıi]rmalar\s+(g[oö]steriyor|defalarca|s[uü]rekli)/i,
  /* "Birlesme-satin alma ARASTIRMALARI SUNU gosteriyor" gibi araya kelime giren
     bicimler ilk surumde kacti (story 1138). Aradaki kelimeye izin ver.
     DIKKAT: \w KULLANMA. JavaScript'te \w yalnizca ASCII eslesir; "sunu"
     kelimesindeki s harfi yuzunden kalip tutmadi. Turkce harfler acikca yazilmali. */
  /\bara[sş]t[ıi]rmalar[ıi]?\s+(?:[\wçğıöşüÇĞİÖŞÜ]+\s+){0,2}g[oö]steriyor/i,
  /\bveriler\s+(?:[\wçğıöşüÇĞİÖŞÜ]+\s+){0,2}g[oö]steriyor/i,
  /\bbir\s+ara[sş]t[ıi]rmaya\s+g[oö]re\b/i,
  /\bbilim\s+insanlar[ıi]\s+(diyor|s[oö]yl[uü]yor|buldu)/i,
  /\buzmanlar\s+(diyor|s[oö]yl[uü]yor)/i,
  /\bstudies\s+(show|have shown|repeatedly)/i,
  /\bresearch\s+shows\b/i,
  /\bscientists\s+(say|found)\b/i,
  /\blos\s+estudios\s+(muestran|demuestran)/i,
  /\bseg[uú]n\s+un\s+estudio\b/i,
  /\bStudien\s+zeigen\b/i,
  /\bForscher\s+(sagen|fanden)\b/i,
];

/** Somut kaynak isareti — bunlardan biri varsa iddia kaynakli sayilir. */
const CONCRETE_SOURCE = /\b(Gallup|Harvard|Stanford|MIT|Yale|Princeton|Oxford|Cambridge|Nature|Science|Lancet|APA|NASA|Pew|McKinsey|Deloitte|OECD|WHO|D[üu]nya Sa[gğ]l[ıi]k|Massachusetts|Carnegie Mellon|Berkeley|Columbia|Chicago|Michigan|\d{4}\s*(y[ıi]l[ıi]nda|de yay[ıi]mlanan)|Universit[eäy])/i;

/**
 * Bilinen tartismali tezler. Metin bunlardan birini iceriyorsa VE
 * elestiri/cekince dili tasimiyorsa isaretlenir.
 * uretim-kurallari.md bolum 5: tartismali tez kesin gercek gibi sunulamaz.
 */
const CONTESTED = [
  [/Stanford\s+(Hapishane|Prison)|hapishane deneyi/i, 'Stanford Hapishane Deneyi — metodolojisi ciddi bicimde elestirildi, yonlendirme iddialari var'],
  [/Milgram/i, 'Milgram deneyi — verilerin sunumu ve etik acidan elestirildi'],
  [/limbik sistem|limbic system|Neokorteks|neocortex/i, 'limbik sistem / neokorteks ayrimi — guncel sinirbilimde asiri basitlestirme sayiliyor'],
  [/[oö][gğ]renme stil|learning styles|estilos de aprendizaje|Lernstile/i, 'ogrenme stilleri — deneysel destegi yok'],
  [/10\.?000\s*saat|10,000\s*hours|10\.000\s*Stunden/i, '10.000 saat kurali — Ericsson bu populer formulasyonu reddetti'],
  [/power pos|g[üu][cç] duru[sş]u/i, 'power posing — hormon etkisi tekrarlanamadi'],
  [/ego t[üu]kenmesi|ego depletion/i, 'ego tukenmesi — buyuk replikasyon calismalarinda dogrulanamadi'],
  [/Mozart etkisi|Mozart effect/i, 'Mozart etkisi — genis kabul goren bir etki degil'],
  [/sa[gğ]\s*beyin|sol\s*beyin|left.brain|right.brain/i, 'sag beyin / sol beyin ayrimi — populer mit'],
  [/Mehrabian|y[üu]zde\s*7.*y[üu]zde\s*38|7-38-55/i, 'Mehrabian 7-38-55 — cok dar bir deney kosulundan genellenmis'],
  [/k[ıi]r[ıi]k camlar|broken windows/i, 'kirik camlar teorisi — nedensellik tartismali'],
  [/marshmallow|lokum testi/i, 'Marshmallow testi — uzun vadeli iddialar buyuk orneklemde zayifladi'],
  [/Maslow.{0,20}(piramit|hiyerarsi|hierarchy)/i, 'Maslow piramidi — Maslow boyle bir piramit cizmedi, ampirik destegi tartismali'],
  [/Dunning.?Kruger/i, 'Dunning-Kruger — populer yorumu istatistiksel olarak elestiriliyor'],
];

/**
 * Cekince / elestiri dili — varsa tartismali tez dengelenmis sayilir.
 *
 * DIKKAT: Bu liste dar tutulursa yanlis pozitif uretir. Ilk surumde
 * "itiraz etti", "reddetti", "efsane" gibi Turkce ifadeler yoktu ve
 * story 1537 ("Ericsson itiraz etti: Ben bunu soylemedim") hatali
 * isaretlendi. Yeni cekince ifadesi gorursen buraya ekle.
 */
const HEDGE = new RegExp([
  'tart[ıi][sş]mal[ıi]', 'ele[sş]tiril', 'kabul g[oö]rm[uü]yor', 'apokrif', 'kesin de[gğ]il',
  'replikasyon', 'yinelenemedi', 'do[gğ]rulanamad[ıi]', 'basitle[sş]tirme', 'iddia edil',
  'efsane', 'yanl[ıi][sş] anla[sş][ıi]l', 's[oö]ylemedim', 'abart[ıi]l',
  'ancak', 'oysa', 'ne var ki', 'atfedil',

  /* TURKCE EDILGEN CATI — UCUNCU KEZ AYNI TUZAK.
     Liste etken fiil govdeleriyle yazilmis ve edilgen bicimleri kacirdi:
       'reddett' -> "reddetti" tutar, "reddedil-di" TUTMAZ (govde d ile degisiyor)
       'itiraz et' -> "itiraz etti" tutar, "itiraz edildi" TUTMAZ
     A2-012'de 1164'e "Kuralin kendisi de sahibi tarafindan REDDEDILDI" yazdim ve
     denetim hikayeyi hala hatali gosterdi. Sorun kelime eksigi degil, BICIM
     eksigi. Bundan sonra bir fiil eklerken etken VE edilgen govdesini birlikte
     yaz; Turkce'de edilgenlik govdeyi degistirir. */
  'reddet', 'reddedil', 'itiraz et', 'itiraz edil', 'kar[sş][ıi] c[ıi]k',
  /* A2-005 cekincelerinde fiilen kullanilan ifadeler. Bunlar listede yoktu ve
     eklenen cekinceler taninmadi; kural: yeni cekince yazarken kelimesini
     buraya da ekle, yoksa denetim duzeltilmis hikayeyi hatali gostermeye devam eder. */
  'zay[ıi]flat', 'benzetme', 'k[ıi]saltma', 'genel kabul de[gğ]il', 'metafor',
  'weakened', 'shorthand', 'metaphor', 'no longer accepts',
  'debilitaron', 'atajo', 'met[aá]fora', 'ya no acepta',
  'schw[aä]chten', 'Abk[uü]rzung', 'Metapher', 'nicht mehr',
  'contested', 'criticized', 'disputed', 'not accepted', 'oversimplif', 'failed to replicate',
  'myth', 'pushed back', 'objected', 'misread', 'overstat',
  'cuestionad', 'criticad', 'no se acepta', 'mito', 'refut', 'matiz',
  'umstritten', 'kritisiert', 'nicht anerkannt', 'vereinfach', 'Mythos', 'widersprach',

  /* A2-012 cekincelerinde fiilen kullanilan ifadeler. Ayni kural: yeni cekince
     yazdikca buraya ekle. Bu grup "esik degil / ortalama" ve "karistirmis"
     kaliplarini kapsiyor — 10.000 saat kuralinin dogru cerceveleme bicimi bu. */
  'd[uü]zeltt', 'e[sş]ik de[gğ]il', 'kar[ıi][sş]t[ıi]rm', 'esik bulmad', 'e[sş]ik bulmad',
  'corrected', 'not a threshold', 'conflat', 'disowned',
  'corrigi[oó]', 'no es un umbral', 'no encontr[oó] un umbral', 'confundi', 'desautoriz',
  'korrigierte', 'keine Schwelle', 'verwechselt', 'zur[uü]ckgewiesen',
].join('|'), 'i');

/** Nedensellik baglaclari — iki tarihle birlikte sira hatasi riski. */
const CAUSAL = /(bunun [üu]zerine|duyunca|[oö][gğ]renince|okuyunca|ard[ıi]ndan|sonras[ıi]nda|bu y[üu]zden|after (hearing|learning|reading)|upon hearing|as a result|tras (enterarse|saber)|nachdem er (h[oö]rte|erfuhr))/i;

/* ------------------------------------------------------------------ */
/* Veri                                                                */
/* ------------------------------------------------------------------ */

const db = await openDb();
let stories = rows(db, `
  SELECT s.id, s.book_no,
         (SELECT title FROM story_translations WHERE story_id = s.id AND lang_code='tr') AS title,
         (SELECT content FROM story_translations WHERE story_id = s.id AND lang_code='tr') AS content,
         (SELECT bt.title FROM books b JOIN book_translations bt ON bt.book_id=b.id AND bt.lang_code='tr'
           WHERE b.list_no = s.book_no) AS book_title,
         (SELECT b.author FROM books b WHERE b.list_no = s.book_no) AS book_author
    FROM stories s`);
const allBooks = rows(db, `
  SELECT b.list_no, b.author,
         (SELECT bt.title FROM book_translations bt WHERE bt.book_id=b.id AND bt.lang_code='en') AS title_en,
         (SELECT bt.title FROM book_translations bt WHERE bt.book_id=b.id AND bt.lang_code='tr') AS title_tr
    FROM books b`);
db.close();

if (storyFilter) stories = stories.filter((s) => storyFilter.includes(s.id));
stories = stories.filter((s) => s.content);

/* Yazar soyadi -> kitap listesi (misfiled ve attribution icin) */
const surnameToBooks = new Map();
for (const b of allBooks) {
  for (const raw of String(b.author ?? '').split(/\s+ve\s+|,|&/)) {
    const parts = raw.trim().split(/\s+/).filter(Boolean);
    if (parts.length < 2) continue;
    const sn = parts[parts.length - 1];
    if (sn.length < 4) continue;
    if (!surnameToBooks.has(sn)) surnameToBooks.set(sn, []);
    surnameToBooks.get(sn).push(b);
  }
}

const findings = [];
const add = (check, severity, s, message, evidence = null) =>
  findings.push({ check, severity, story_id: s.id, book_no: s.book_no, book: s.book_title, title: s.title, message, evidence });

/* ------------------------------------------------------------------ */
/* Denetimler                                                          */
/* ------------------------------------------------------------------ */

const CHECKS = {
  /* --- 1. Atifli alinti: dogrulanmasi gereken sonlu liste ---------- */
  quotes(s) {
    const t = stripMarkers(s.content);
    /* "..." bicimindeki alintilar; yakininda ozel isim varsa atifli sayilir */
    const re = /["“„«]([^"“”„«»]{25,300})["”»]/g;
    for (const m of [...t.matchAll(re)]) {
      const around = t.slice(Math.max(0, m.index - 90), m.index + m[0].length + 60);
      const person = around.match(/\b([A-ZÇĞİÖŞÜ][a-zçğıöşü]+(?:\s+[A-ZÇĞİÖŞÜ][a-zçğıöşü]+){0,2})\s*(?:şöyle|dedi|diyor|söyledi|sordu|yazdı|yanıtladı)/);
      if (!person) continue;
      add('quotes', 'warn', s,
        `atifli alinti — "${person[1]}" adina; kaynakla dogrulanmali`,
        `"${m[1].slice(0, 110)}"`);
    }
  },

  /* --- 2. Ters nedensellik riski ---------------------------------- */
  causality(s) {
    const t = stripMarkers(s.content);
    const years = [...new Set((t.match(/\b1[6-9]\d{2}\b|\b20[0-2]\d\b/g) || []))];
    if (years.length < 2) return;
    const m = t.match(CAUSAL);
    if (!m) return;
    add('causality', 'warn', s,
      `iki veya daha fazla tarih (${years.join(', ')}) ve nedensellik baglaci ("${m[0]}") — olay sirasi dogrulanmali`,
      t.slice(Math.max(0, t.indexOf(m[0]) - 70), t.indexOf(m[0]) + 90));
  },

  /* --- 3. Yazar uyusmazligi --------------------------------------- */
  attribution(s) {
    const t = stripMarkers(s.content);
    const own = String(s.book_author ?? '').split(/\s+/).filter(Boolean).pop() ?? '';
    const ownMentioned = own.length > 3 && new RegExp(`\\b${own}`, 'i').test(t);
    const others = [];
    for (const [sn, books] of surnameToBooks) {
      if (sn === own) continue;
      if (new RegExp(`\\b${sn}\\b`).test(t)) others.push({ sn, books });
    }
    if (!ownMentioned && others.length) {
      add('attribution', 'warn', s,
        `kitabin yazari (${s.book_author}) metinde gecmiyor ama baska DB yazar(lar)i geciyor: ${others.map((o) => o.sn).join(', ')}`);
    }
  },

  /* --- 4. Kaynaksiz iddia ----------------------------------------- */
  unsourced(s) {
    const t = stripMarkers(s.content);
    for (const re of VAGUE_SOURCE) {
      const m = t.match(re);
      if (!m) continue;
      const window = t.slice(Math.max(0, m.index - 160), m.index + 220);
      if (CONCRETE_SOURCE.test(window)) continue;
      add('unsourced', 'error', s,
        `kaynaksiz iddia kalibi: "${m[0]}" — yakininda somut kaynak yok`,
        window.replace(/\n+/g, ' ').trim().slice(0, 170));
      return;
    }
  },

  /* --- 5. Tartismali tez, cekincesiz ------------------------------ */
  contested(s) {
    const t = stripMarkers(s.content);
    for (const [re, why] of CONTESTED) {
      if (!re.test(t)) continue;
      if (HEDGE.test(t)) continue;
      add('contested', 'error', s, `cekincesiz tartismali tez — ${why}`,
        t.slice(Math.max(0, t.search(re) - 60), t.search(re) + 130).replace(/\n+/g, ' ').trim());
    }
  },

  /* --- 6. Yanlis kitap -------------------------------------------- */
  misfiled(s) {
    const t = stripMarkers(s.content);
    const own = String(s.book_author ?? '').split(/\s+/).filter(Boolean).pop() ?? '';

    /**
     * Bir baslik eslesmesinin gercekten KITAP REFERANSI olup olmadigini anlar.
     *
     * Uzunluk filtresi yetmiyor: "Mindfulness" (11) ve "Antikirilgan" (12)
     * ayni zamanda gundelik kelimeler ve sirasiyla bir program adinda
     * ("Mindfulness-Based Stress Reduction") ve bir sifat olarak
     * ("antikirilgan oruntu") geciyorlardi. Uc yanlis pozitif uretti.
     * Simdi ya tirnak icinde ya da kitap belirten bir kelimenin yaninda
     * olmasi sart.
     */
    const looksLikeTitleRef = (title) => {
      const i = t.indexOf(title);
      if (i === -1) return false;
      /* Tek kelimelik baslik + tirnak yetmiyor: "Sessizlik" (list_no:105) ve
         "Meditasyon" (82) gundelik kelimeler ve tirnakli metinlerde rastgele
         eslesiyorlar. Alti yanlis pozitif daha uretti. Tek kelimelik basliklarda
         ARTIK yalnizca acik kitap ipucu kabul ediliyor, tirnak degil. */
      const multiWord = /\s/.test(title.trim());
      const around = t.slice(Math.max(0, i - 25), i + title.length + 25);
      const cue = /(kitab[ıi]|kitab[ıi]nda|adl[ıi]|isimli|book|libro|Buch)/i.test(around);
      if (!multiWord) return cue;
      const quoted = new RegExp(`["“„«']\\s*${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(around);
      return cue || quoted;
    };

    for (const b of allBooks) {
      if (b.list_no === s.book_no) continue;
      for (const title of [b.title_en, b.title_tr]) {
        if (!title || title.length < 6) continue;
        if (!looksLikeTitleRef(title)) continue;
        const sameAuthor = own.length > 3 && String(b.author ?? '').endsWith(own);
        add('misfiled', sameAuthor ? 'error' : 'warn', s,
          sameAuthor
            ? `ayni yazarin BASKA kitabina referans: "${title}" (list_no:${b.list_no}) — icerik o kitaba ait olabilir`
            : `baska bir DB kitabina referans: "${title}" (list_no:${b.list_no}) — hikaye dogru kitapta mi?`);
      }
    }
  },
};

const active = Object.keys(CHECKS).filter((k) => !checkFilter || checkFilter.includes(k));
for (const s of stories) for (const k of active) CHECKS[k](s);

/* ------------------------------------------------------------------ */
/* Cikti                                                              */
/* ------------------------------------------------------------------ */

const counts = { error: 0, warn: 0 };
for (const f of findings) counts[f.severity] += 1;
const byCheck = {};
for (const f of findings) (byCheck[f.check] ??= []).push(f);

if (asJson) {
  process.stdout.write(`${JSON.stringify({
    summary: { stories: stories.length, counts, checks: active },
    findings,
  }, null, 2)}\n`);
  process.exitCode = counts.error ? 1 : 0;
} else {
  const TITLES = {
    quotes: 'Atifli alinti — kaynakla dogrulanmali',
    causality: 'Ters nedensellik riski — olay sirasi',
    attribution: 'Yazar uyusmazligi',
    unsourced: 'Kaynaksiz iddia',
    contested: 'Cekincesiz tartismali tez',
    misfiled: 'Yanlis kitap suphesi',
  };
  const L = [];
  const p = (x = '') => L.push(x);
  p('# Olgusal Kusur Taramasi');
  p('');
  p(`- Uretildi: ${new Date().toISOString().slice(0, 16).replace('T', ' ')}`);
  p(`- Taranan: **${stories.length}** hikaye (tr metni)`);
  p(`- Bulgu: **${counts.error} hata** · **${counts.warn} inceleme**`);
  p('');
  p('> Bu script bir iddianin DOGRU olup olmadigini bilemez. Yaptigi is, insan');
  p('> dogrulamasi gereken yerleri sonlu bir listeye indirmektir. Tipler,');
  p('> A2-001..004 partilerinde elle bulunan 11 hatadan cikarildi.');
  p('');
  p('| Denetim | Hata | Inceleme |');
  p('|---|---:|---:|');
  for (const k of active) {
    const f = byCheck[k] ?? [];
    p(`| ${TITLES[k]} | ${f.filter((x) => x.severity === 'error').length} | ${f.filter((x) => x.severity === 'warn').length} |`);
  }
  p('');
  for (const k of active) {
    const f = byCheck[k] ?? [];
    if (!f.length) continue;
    p(`## ${TITLES[k]} — ${f.length}`);
    p('');
    for (const x of f.slice(0, limit)) {
      p(`- ${x.severity === 'error' ? '❌' : '⚠'} \`story_id:${x.story_id}\` **${x.book ?? '?'}** — ${x.title ?? ''}`);
      p(`  ${x.message}`);
      if (x.evidence) p(`  > …${x.evidence.replace(/\n+/g, ' ')}…`);
    }
    if (f.length > limit) p(`- … *+${f.length - limit} bulgu (\`--limit ${f.length}\`)*`);
    p('');
  }
  p('## Onarim yolu');
  p('');
  p('Her bulgu bir HATA degil, bir DOGRULAMA GOREVIDIR. Sirasiyla:');
  p('');
  p('1. Kaynagi ac, iddiayi kontrol et.');
  p('2. Dogruysa metne kaynak/atif ekle (`content_fix`).');
  p('3. Yanlissa hikayeyi yeniden kur (`new_story`).');
  p('4. Tartismaliysa cekince cumlesi ekle (`content_fix`).');
  p('');
  p('`contested` bulgulari en yuksek oncelikli: bunlar bilinen tartismali tezler ve');
  p('metinde hicbir cekince yok. `uretim-kurallari.md` bolum 5 bunu yasakliyor.');

  const out = L.join('\n');
  const path = writeReport('fact-audit.md', out);
  process.stdout.write(`${out}\n`);
  process.stderr.write(`\n[audit-facts] yazildi: ${path}\n`);
  process.exitCode = counts.error ? 1 : 0;
}

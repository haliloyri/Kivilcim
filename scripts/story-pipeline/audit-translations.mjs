#!/usr/bin/env node
/**
 * audit-translations.mjs — Mevcut story_translations kayitlarini denetler.
 *
 * Amac: makine cevirisi kaynakli, ekrana ve paylas kartina sizan kusurlari bulmak.
 * SALT OKUNUR. DB'ye yazmaz. Onarim normal batch akisindan gecer.
 *
 * Kullanim:
 *   node scripts/story-pipeline/audit-translations.mjs
 *   node scripts/story-pipeline/audit-translations.mjs --severity error
 *   node scripts/story-pipeline/audit-translations.mjs --lang de --check markers,terms
 *   node scripts/story-pipeline/audit-translations.mjs --story 1059,1062 --json
 *   node scripts/story-pipeline/audit-translations.mjs --emit-sql
 *
 * Bayraklar:
 *   --severity error|warn|info   Bu seviye ve uzerini goster (varsayilan: info)
 *   --lang tr,en,es,de           Yalnizca bu diller
 *   --story 1059,1060            Yalnizca bu story_id'ler
 *   --check a,b,c                Yalnizca bu denetimler (asagidaki CHECKS anahtarlari)
 *   --limit N                    Denetim basina gosterilecek bulgu sayisi (varsayilan 12)
 *   --json                       Makine okunur cikti
 *   --emit-sql                   Mekanik duzeltmeler icin gozden gecirilebilir SQL uret
 */
import { LANGS, PATHS, openDb, rows, writeReport, countWords, stripMarkers } from './lib/store.mjs';

/* ------------------------------------------------------------------ */
/* Argumanlar                                                          */
/* ------------------------------------------------------------------ */

const argv = process.argv.slice(2);
const flag = (name) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? null : argv[i + 1];
};
const has = (name) => argv.includes(`--${name}`);

const SEV_ORDER = { error: 3, warn: 2, info: 1 };
const minSev = SEV_ORDER[flag('severity') ?? 'info'] ?? 1;
const langFilter = flag('lang')?.split(',').map((s) => s.trim());
const storyFilter = flag('story')?.split(',').map((s) => Number(s.trim()));
const checkFilter = flag('check')?.split(',').map((s) => s.trim());
const limit = Number(flag('limit')) || 12;
const asJson = has('json');
const emitSql = has('emit-sql');

/* ------------------------------------------------------------------ */
/* Riskli terim sozlugu                                                */
/*                                                                     */
/* Bicim: [kalip, baglamKalibi|null, aciklama, oneri]                  */
/*                                                                     */
/* baglamKalibi verilirse kalip YALNIZCA o baglam ayni metinde varsa   */
/* tetiklenir. Bu sart homograf gurultusunu engeller.                  */
/*                                                                     */
/* ONEMLI: Buraya baglamsiz homograf EKLEMEYIN. Almanca "bald"         */
/* (yakinda), "Roman" (roman), "Gift" (zehir) hedef dilde DOGRU        */
/* kelimelerdir; baglamsiz kural bunlari hatali isaretler. Denendi,    */
/* 12 yanlis pozitif uretti, kaldirildi.                              */
/* ------------------------------------------------------------------ */

const RISKY_TERMS = {
  de: [
    [/\bKoks\b/, /Wasser|Cafeteria|Kantine|Getränk|Limonade|trink/i,
      'Almanca "Koks" gundelik dilde kokain demektir; icecek baglaminda yanlis',
      'Cola / Limonade'],
  ],
  en: [
    [/\bsuffered every day\b/i, null,
      'Turkce "cekmek" (fotograf cekmek) yanlis cevrilmis olabilir', 'shot every day'],
    [/\b(?:he|she|it) piled up\b/i, null,
      'Turkce oznesiz cumleye yanlis ozne eklenmis olabilir', 'the team went on to win'],
    [/\bbrain stuffing\b/i, null,
      'deyim birebir cevrilmis', 'imagined / made up'],
  ],
  es: [
    [/\bla coca\b/i, /agua|cafetería|refresco|bebida|beb[eí]/i,
      'Ispanyolca "la coca" kokain anlamina gelebilir; icecek baglaminda yanlis',
      'el refresco / la cola'],
    [/\bembarazad[ao]\b/i, /verg[üu]enza|t[ií]mid|inc[óo]modo/i,
      '"embarrassed" yerine "embarazada" (hamile) kullanilmis olabilir', 'avergonzado/a'],
  ],
  tr: [],
};

/* Turkce'ye ozgu harfler — tr disi metinde bulunmasi sizinti demektir */
const TR_CHARS = /[ışğİĞŞ]/;

/* ------------------------------------------------------------------ */
/* Veri                                                                */
/* ------------------------------------------------------------------ */

const db = await openDb();

let translations = rows(
  db,
  `SELECT st.story_id, st.lang_code, st.title, st.description, st.content, st.hook,
          s.book_no, s.version, s.current_read_minutes, s.possible_read_minutes
     FROM story_translations st
     JOIN stories s ON s.id = st.story_id
    ORDER BY st.story_id, st.lang_code`
);
const bookTitles = Object.fromEntries(
  rows(db, `SELECT b.list_no, bt.title FROM books b
              JOIN book_translations bt ON bt.book_id = b.id AND bt.lang_code = 'tr'`)
    .map((r) => [r.list_no, r.title])
);
const hookCoverage = rows(
  db,
  `SELECT lang_code,
          SUM(CASE WHEN hook IS NOT NULL AND hook <> '' THEN 1 ELSE 0 END) AS filled,
          COUNT(*) AS total
     FROM story_translations GROUP BY lang_code`
);
db.close();

if (storyFilter) translations = translations.filter((t) => storyFilter.includes(t.story_id));

/* story_id -> { lang: row } */
const byStory = new Map();
for (const t of translations) {
  if (!byStory.has(t.story_id)) byStory.set(t.story_id, {});
  byStory.get(t.story_id)[t.lang_code] = t;
}

/* ------------------------------------------------------------------ */
/* Bulgu toplayici                                                     */
/* ------------------------------------------------------------------ */

const findings = [];
const add = (check, severity, story, lang, message, evidence = null, fix = null) => {
  findings.push({ check, severity, story_id: story, lang, message, evidence, fix });
};

const norm = (s = '') => s.replace(/\s+/g, ' ').trim().toLocaleLowerCase('tr');
const markerCount = (t = '', m) => (t.match(new RegExp(m.replace(/[$]/g, '\\$'), 'g')) || []).length;

/**
 * Isaretleri CIFT olarak ayristir: 0. gecis acilis, 1. gecis kapanis, 2. acilis...
 *
 * Neden gerekli: naif `/##\s*##/` kalibi yan yana duran iki blogun
 * (`##A##\n##B##`) kapanisi ile acilisini "bos blok" sanir. Ayni sekilde
 * naif "cumle ortasinda" kontrolu KAPANIS isaretini de yakalar ve
 * `...Wiederholung schafft $$` gibi mesru kapanislari hatali isaretler.
 * Ikisi de yasandi (story 1291 ve 1537), bu yuzden ciftleme zorunlu.
 */
function markerBlocks(text = '', m) {
  const esc = m.replace(/[$]/g, '\\$');
  const at = [...text.matchAll(new RegExp(esc, 'g'))].map((x) => x.index);
  const pairs = [];
  for (let i = 0; i + 1 < at.length; i += 2) {
    pairs.push({
      open: at[i],
      close: at[i + 1],
      content: text.slice(at[i] + m.length, at[i + 1]),
    });
  }
  return { pairs, count: at.length, dangling: at.length % 2 ? at[at.length - 1] : null };
}
/**
 * Sayi tokenlarini dil-notr bicime indirger.
 *
 * ZORUNLU: binlik ayiricilarini kaldir. Ayni sayi tr'de "1800", en'de "1,800",
 * es/de'de "1.800" yazilir. Normalize edilmezse 14 sahte "yil tutarsizligi"
 * uretir (yasandi). Ondalik ayirici olarak kullanilan tek basamakli son grup
 * korunur: "3,5" -> "3.5".
 */
const numberTokens = (t = '') =>
  [...stripMarkers(t).matchAll(/\d[\d.,]*/g)]
    .map((m) => m[0].replace(/[.,]+$/, ''))
    .map((n) => {
      const dec = n.match(/^([\d.,]+)[.,](\d{1,2})$/);
      if (dec && !/^\d{3}$/.test(dec[2])) return `${dec[1].replace(/[.,]/g, '')}.${dec[2]}`;
      return n.replace(/[.,]/g, '');
    });

const years = (t = '') => numberTokens(t).filter((n) => /^\d{4}$/.test(n) && +n >= 1000 && +n <= 2100);

/**
 * Donem ifadeleri. Hedef dil on yili/yuzyili KELIMEYLE yazdiginda tr'deki
 * rakam eslesmez ama olgu aynidir: "1900'lerin basinda" = "a principios del
 * siglo XX" = "Zu Beginn des 20. Jahrhunderts". Bu ifadeler varsa yil
 * farki olgu kaymasi sayilmaz.
 */
const PERIOD_HINTS = {
  tr: /\b(\d{2,4}'?l[ae]r|yüzyıl|başlarında|ortalarında|sonlarında)\b/i,
  en: /\b(\d{4}s|'\d0s|centur(?:y|ies)|early|mid|late)\b/i,
  es: /\b(siglo|años?\s+(?:veinte|treinta|cuarenta|cincuenta|sesenta|setenta|ochenta|noventa)|principios|mediados|finales)\b/i,
  de: /\b(Jahrhunderts?|(?:zwanziger|dreißiger|vierziger|fünfziger|sechziger|siebziger|achtziger|neunziger)\s+Jahre|Anfang|Mitte|Ende)\b/i,
};

/* ------------------------------------------------------------------ */
/* Denetimler                                                          */
/* ------------------------------------------------------------------ */

const CHECKS = {
  /* --- 1. Isaret butunlugu: paylas kartini dogrudan bozar --------- */
  markers() {
    for (const t of translations) {
      const c = t.content ?? '';
      for (const m of ['##', '$$', '&&', '~~']) {
        const { pairs, count, dangling } = markerBlocks(c, m);

        /* kapanmamis blok */
        if (dangling !== null) {
          add('markers', 'error', t.story_id, t.lang_code,
            `${m} isareti tek sayida (${count}) — blok kapanmamis, paylas karti bozuk cikar`,
            c.slice(Math.max(0, dangling - 60), dangling + 40));
        }

        for (const p of pairs) {
          /* bos blok */
          if (!p.content.trim()) {
            add('markers', 'error', t.story_id, t.lang_code,
              `bos ${m} blogu — paylas karti bos gorunur`,
              c.slice(Math.max(0, p.open - 60), p.close + 20));
            continue;
          }
          /* ~~ blogu iki sutunlu karsitlik kartidir; "once :: sonra" olmali */
          if (m === '~~') {
            if (!p.content.includes('::')) {
              add('markers', 'error', t.story_id, t.lang_code,
                '~~ blogunda :: ayiricisi yok — iki sutunlu kart render edilemez', p.content.slice(0, 80));
            } else {
              const [a2, b2] = p.content.split('::');
              if (!a2.trim() || !b2.trim()) {
                add('markers', 'error', t.story_id, t.lang_code, '~~ blogunun bir tarafi bos', p.content.slice(0, 80));
              }
            }
            continue;
          }
          /* YALNIZCA acilis isareti cumle ortasinda mi.
             Yatay bosluk kullan: \s newline'i da yakalar ve paragraf basindaki
             mesru isaretleri (story 1150) hatali isaretler. */
          const before = c.slice(Math.max(0, p.open - 40), p.open);
          if (/[a-zçğıöşü,][^\S\n]+$/u.test(before)) {
            add('markers', 'error', t.story_id, t.lang_code,
              `${m} isareti cumle ortasinda aciliyor — bloktan onceki kelimeler metinde kalir`,
              c.slice(Math.max(0, p.open - 55), p.close + 15));
          }
        }
      }
    }
  },

  /* --- Blok icerigi yarim kalmis mi -------------------------------- */
  truncation() {
    for (const t of translations) {
      const c = t.content ?? '';
      /* ~~ HARIC: karsitlik karti "once :: sonra" etiket ciftidir,
         cumle degildir ve noktalamayla bitmesi beklenmez. */
      for (const m of ['##', '$$', '&&']) {
        for (const p of markerBlocks(c, m).pairs) {
          const body = p.content.trim();
          if (!body) continue;
          /* Paylas kartinda tek basina gorunur; yarim cumle kabul edilemez.
             Kabul edilen bitisler:
               - noktalama: . ! ? … :
               - kapanis tirnaklari: " ' ’ » ” ve ALMANCA kapanis „…“ icin “
                 (Almanca'da “ KAPANIS tirnagidir; listeye alinmazsa 206 yanlis pozitif verir)
               - parantez: ) ]
               - ustsimge/formul: ² ³ ¹ ° (story 1150 gibi denklem satirlari) */
          if (!/[.!?…:"»”“'’)\]²³¹°]$/u.test(body)) {
            add('truncation', 'error', t.story_id, t.lang_code,
              `${m} blogu noktalama olmadan bitiyor — metin kesilmis olabilir`,
              `…${body.slice(-70)}`);
          }
        }
      }
    }
  },

  /* --- 2. Isaret sayisi tr ile ayni mi ---------------------------- */
  parity() {
    for (const [sid, langs] of byStory) {
      const tr = langs.tr;
      if (!tr?.content) continue;
      for (const l of LANGS) {
        if (l === 'tr' || !langs[l]?.content) continue;
        for (const m of ['##', '$$', '&&', '~~']) {
          const a = markerCount(tr.content, m);
          const b = markerCount(langs[l].content, m);
          /* Tek sayi = kapanmamis blok; bunu 'markers' zaten hata olarak bildirdi.
             Burada tekrar etmeyelim, yoksa ayni kusur iki kez sayilir. */
          if (a % 2 || b % 2) continue;
          if (a !== b) {
            add('parity', 'error', sid, l,
              `${m} blok sayisi tr ile uyusmuyor (tr=${a / 2}, ${l}=${b / 2}) — paylas kartinda farkli icerik cikar`);
          }
        }
      }
    }
  },

  /* --- 3. Olgu kaymasi: yillar diller arasi tutarli mi ------------ */
  numbers() {
    for (const [sid, langs] of byStory) {
      const tr = langs.tr;
      if (!tr?.content) continue;
      const trY = [...new Set(years(tr.content))].sort();
      for (const l of LANGS) {
        if (l === 'tr' || !langs[l]?.content) continue;
        const lY = [...new Set(years(langs[l].content))].sort();
        const missing = trY.filter((y) => !lY.includes(y));
        const extra = lY.filter((y) => !trY.includes(y));
        if (missing.length || extra.length) {
          /* Hedef dil donemi kelimeyle yaziyorsa olgu kaymasi degildir.
             Bu durumda hata degil bilgi seviyesinde raporla. */
          const spelled = PERIOD_HINTS[l]?.test(langs[l].content);
          add('numbers', spelled ? 'info' : 'warn', sid, l,
            `yil kumesi farkli — tr:[${trY.join(',')}] ${l}:[${lY.join(',')}]` +
            (missing.length ? ` · eksik: ${missing.join(',')}` : '') +
            (extra.length ? ` · fazla: ${extra.join(',')}` : '') +
            (spelled ? ' — hedef dilde donem kelimeyle yazilmis, olgu kaymasi degil' : ''));
        }
        /* yil disi sayilar: uyari seviyesi (bir dilde yaziyla yazilmis olabilir) */
        const trN = numberTokens(tr.content).filter((n) => !/^\d{4}$/.test(n)).sort();
        const lN = numberTokens(langs[l].content).filter((n) => !/^\d{4}$/.test(n)).sort();
        if (trN.join(',') !== lN.join(',')) {
          add('numbers', 'warn', sid, l,
            `sayi kumesi farkli — tr:[${trN.join(',')}] ${l}:[${lN.join(',')}] (bir dilde yaziyla yazilmis olabilir)`);
        }
      }
    }
  },

  /* --- 4. Riskli terim sozlugu ------------------------------------ */
  terms() {
    for (const t of translations) {
      for (const [re, ctx, why, suggest] of RISKY_TERMS[t.lang_code] ?? []) {
        /* Baglam sarti: kalip yalnizca baglam ayni kayitta varsa tetiklenir */
        if (ctx && !ctx.test(`${t.title ?? ''} ${t.content ?? ''}`)) continue;
        for (const field of ['title', 'description', 'content', 'hook']) {
          const v = t[field];
          if (!v) continue;
          const m = v.match(re);
          if (m) {
            add('terms', 'error', t.story_id, t.lang_code,
              `${field}: "${m[0]}" — ${why}`,
              v.slice(Math.max(0, m.index - 45), m.index + 55),
              suggest ? `oneri: ${suggest}` : null);
          }
        }
      }
    }
  },

  /* --- 5. Turkce sizintisi ---------------------------------------- */
  leaks() {
    for (const t of translations) {
      if (t.lang_code === 'tr') continue;
      for (const field of ['title', 'description', 'content', 'hook']) {
        const v = t[field];
        if (!v || !TR_CHARS.test(v)) continue;
        const m = v.match(new RegExp(`\\S*${TR_CHARS.source}\\S*`, 'u'));
        add('leaks', 'error', t.story_id, t.lang_code,
          `${field}: cevrilmemis Turkce parca — "${m?.[0] ?? '?'}"`,
          v.slice(Math.max(0, (m?.index ?? 0) - 40), (m?.index ?? 0) + 60));
      }
    }
  },

  /* --- 6. Ayni metin iki dilde ------------------------------------ */
  duplicates() {
    for (const [sid, langs] of byStory) {
      for (const a of LANGS) {
        for (const b of LANGS) {
          if (a >= b || !langs[a] || !langs[b]) continue;
          if (langs[a].content && norm(langs[a].content) === norm(langs[b].content)) {
            add('duplicates', 'error', sid, `${a}/${b}`, 'content iki dilde birebir ayni — ceviri yapilmamis');
          }
          if (langs[a].title && norm(langs[a].title) === norm(langs[b].title)) {
            add('duplicates', 'warn', sid, `${a}/${b}`, `title iki dilde ayni: "${langs[a].title}"`);
          }
        }
      }
    }
  },

  /* --- 7. Ozne dusmesi / kisi kaymasi ---------------------------- */
  subjects() {
    for (const t of translations) {
      const c = t.content ?? '';
      if (t.lang_code === 'en') {
        const m = c.match(/(?:^|[.!?]\s+)((?:Didn't|Did not|Wasn't|Was not|Doesn't|Don't|Hasn't|Haven't|Couldn't|Wouldn't)\s+\w+[^.!?]*)/);
        if (m) {
          add('subjects', 'warn', t.story_id, t.lang_code,
            'oznesiz cumle — Turkce oznesiz yapinin birebir aktarimi olabilir', m[1].slice(0, 90));
        }
      }
      if (t.lang_code === 'es') {
        const m = c.match(/(?:^|[.!?]\s+)(No\s+(?:cambié|aumenté|puse|hice|coloqué|dije|pensé)\b[^.!?]*)/);
        if (m) {
          add('subjects', 'warn', t.story_id, t.lang_code,
            'anlatici ucuncu tekilken birinci tekil fiil — kisi kaymasi', m[1].slice(0, 90));
        }
      }
    }
  },

  /* --- 8. Cinsiyet tutarsizligi ---------------------------------- */
  gender() {
    const PRON = {
      en: [/\b(he|him|his)\b/gi, /\b(she|her|hers)\b/gi],
      de: [/\b(er|ihn|ihm|sein|seine|seinem|seinen|seiner)\b/g, /\b(sie|ihr|ihre|ihrem|ihren|ihrer)\b/g],
      es: [/\b(él|suyo)\b/gi, /\b(ella|suya)\b/gi],
    };
    for (const t of translations) {
      const pair = PRON[t.lang_code];
      if (!pair || !t.content) continue;
      const m = (t.content.match(pair[0]) || []).length;
      const f = (t.content.match(pair[1]) || []).length;
      if (m >= 2 && f >= 2) {
        add('gender', 'warn', t.story_id, t.lang_code,
          `eril (${m}) ve disil (${f}) zamir bir arada — ayni kisiye farkli cinsiyetle atif olabilir`);
      }
    }
  },

  /* --- 9. Hitap kipi karisimi ------------------------------------ */
  register() {
    for (const t of translations) {
      const c = t.content ?? '';
      if (t.lang_code === 'de') {
        const du = (c.match(/\b(du|dich|dir|dein|deine|deinem|deinen)\b/g) || []).length;
        const sie = (c.match(/\b(Sie|Ihnen|Ihr|Ihre|Ihrem|Ihren)\b/g) || []).length;
        if (du >= 2 && sie >= 2) {
          add('register', 'warn', t.story_id, t.lang_code,
            `du (${du}) ve Sie (${sie}) ayni metinde — hitap kipi tutarsiz`);
        }
      }
      if (t.lang_code === 'es') {
        const tu = (c.match(/\b(tú|te|ti|tu|tus|tienes|puedes|quieres)\b/g) || []).length;
        const ud = (c.match(/\b(usted|le|su|sus|tiene|puede|quiere)\b/g) || []).length;
        if (tu >= 3 && ud >= 3) {
          add('register', 'warn', t.story_id, t.lang_code,
            `tú (${tu}) ve usted (${ud}) ayni metinde — hitap kipi tutarsiz`);
        }
      }
    }
  },

  /* --- 10. Zaman kaymasi: gecmis anlatida simdiki zaman ---------- */
  tense() {
    for (const t of translations) {
      if (t.lang_code !== 'en' || !t.content) continue;
      const past = (t.content.match(/\b\w+ed\b|\bwas\b|\bwere\b|\bsaid\b|\bwent\b|\bgave\b/g) || []).length;
      const m = t.content.match(/(?:^|[.!?]\s+)(The\s+\w+\s+is\s+(?:over|finished|done)\.)/);
      if (past >= 5 && m) {
        add('tense', 'warn', t.story_id, t.lang_code,
          'gecmis zaman anlatisinin icinde simdiki zaman cumlesi', m[1]);
      }
    }
  },

  /* --- 11. Baslik bicimi ----------------------------------------- */
  titles() {
    for (const t of translations) {
      const v = t.title;
      if (!v) {
        add('titles', 'error', t.story_id, t.lang_code, 'title bos');
        continue;
      }
      if (v[0] === v[0].toLocaleLowerCase(t.lang_code) && /\p{L}/u.test(v[0])) {
        add('titles', 'warn', t.story_id, t.lang_code, `title kucuk harfle basliyor: "${v}"`, null, `oneri: "${v[0].toLocaleUpperCase(t.lang_code)}${v.slice(1)}"`);
      }
      if (/\.\s*$/.test(v)) {
        add('titles', 'warn', t.story_id, t.lang_code, `title noktayla bitiyor: "${v}"`, null, `oneri: "${v.replace(/\.\s*$/, '')}"`);
      }
      if (v !== v.trim()) {
        add('titles', 'info', t.story_id, t.lang_code, 'title basinda/sonunda bosluk');
      }
    }
  },

  /* --- 12. Uzunluk sismesi --------------------------------------- */
  length() {
    for (const [sid, langs] of byStory) {
      const tr = langs.tr;
      if (!tr?.content) continue;
      const base = countWords(tr.content);
      if (!base) continue;
      for (const l of LANGS) {
        if (l === 'tr' || !langs[l]?.content) continue;
        const w = countWords(langs[l].content);
        const ratio = w / base;
        /* tr sondan eklemeli oldugu icin diger dillerde %10-40 artis normaldir */
        if (ratio > 1.6) {
          add('length', 'warn', sid, l, `${w} kelime, tr ${base} kelime (x${ratio.toFixed(2)}) — ceviri sismesi, sure hedefini asabilir`);
        } else if (ratio < 0.75) {
          add('length', 'warn', sid, l, `${w} kelime, tr ${base} kelime (x${ratio.toFixed(2)}) — icerik dusmus olabilir`);
        }
      }
    }
  },

  /* --- 13. Bosluk artifaktlari ----------------------------------- */
  whitespace() {
    for (const t of translations) {
      const c = t.content ?? '';
      if (/[ \t]+\n/.test(c)) {
        add('whitespace', 'info', t.story_id, t.lang_code, 'satir sonlarinda bosluk (ceviri artifakti)', null, 'mekanik duzeltilebilir');
      }
      if (/ {2,}/.test(c.replace(/\n/g, ''))) {
        add('whitespace', 'info', t.story_id, t.lang_code, 'metin icinde cift bosluk', null, 'mekanik duzeltilebilir');
      }
      if (/ |​/.test(c)) {
        add('whitespace', 'info', t.story_id, t.lang_code, 'kirilmayan bosluk veya sifir genislikli karakter', null, 'mekanik duzeltilebilir');
      }
    }
  },
};

/* ------------------------------------------------------------------ */
/* Calistir                                                           */
/* ------------------------------------------------------------------ */

const active = Object.keys(CHECKS).filter((k) => !checkFilter || checkFilter.includes(k));
for (const k of active) CHECKS[k]();

let visible = findings.filter((f) => SEV_ORDER[f.severity] >= minSev);
if (langFilter) visible = visible.filter((f) => langFilter.some((l) => f.lang.includes(l)));

const byCheck = {};
for (const f of visible) {
  byCheck[f.check] ??= { error: [], warn: [], info: [] };
  byCheck[f.check][f.severity].push(f);
}
const counts = {
  error: visible.filter((f) => f.severity === 'error').length,
  warn: visible.filter((f) => f.severity === 'warn').length,
  info: visible.filter((f) => f.severity === 'info').length,
};
const affectedStories = new Set(visible.map((f) => f.story_id)).size;

/* ------------------------------------------------------------------ */
/* SQL onerisi (yalnizca mekanik sinif)                                */
/* ------------------------------------------------------------------ */

if (emitSql) {
  const L = [
    '-- audit-translations.mjs --emit-sql',
    '-- YALNIZCA MEKANIK DUZELTMELER. Insan onayi olmadan calistirmayin.',
    '-- Once yedek alin:  cp assets/kivilcim.db assets/kivilcim.db.bak_manual',
    '',
    'BEGIN TRANSACTION;',
    '',
    '-- 1. Satir sonu bosluklari ve cift bosluklar',
    "UPDATE story_translations SET content = REPLACE(content, ' ' || char(10), char(10))",
    "  WHERE content LIKE '% ' || char(10) || '%';",
    "UPDATE story_translations SET content = REPLACE(content, '  ', ' ')",
    "  WHERE content LIKE '%  %';",
    '',
    '-- 2. Baslik bas/son bosluklari',
    'UPDATE story_translations SET title = TRIM(title) WHERE title <> TRIM(title);',
    '',
    '-- 3. Noktayla biten basliklar (tek tek, gozle kontrol icin)',
  ];
  for (const f of findings.filter((x) => x.check === 'titles' && /noktayla/.test(x.message))) {
    const t = translations.find((x) => x.story_id === f.story_id && x.lang_code === f.lang);
    if (!t) continue;
    const fixed = t.title.replace(/\.\s*$/, '').replace(/'/g, "''");
    L.push(`UPDATE story_translations SET title = '${fixed}' WHERE story_id = ${f.story_id} AND lang_code = '${f.lang}';`);
  }
  L.push('', '-- 4. Kucuk harfle baslayan basliklar');
  for (const f of findings.filter((x) => x.check === 'titles' && /kucuk harfle/.test(x.message))) {
    const t = translations.find((x) => x.story_id === f.story_id && x.lang_code === f.lang);
    if (!t) continue;
    const fixed = (t.title[0].toLocaleUpperCase(f.lang) + t.title.slice(1)).replace(/'/g, "''");
    L.push(`UPDATE story_translations SET title = '${fixed}' WHERE story_id = ${f.story_id} AND lang_code = '${f.lang}';`);
  }
  L.push('', '-- ROLLBACK; -- once bunu deneyin', 'COMMIT;', '');
  const p = writeReport('mechanical-fixes.sql', L.join('\n'));
  process.stderr.write(`[audit] SQL yazildi: ${p}\n`);
}

/* ------------------------------------------------------------------ */
/* Cikti                                                              */
/* ------------------------------------------------------------------ */

if (asJson) {
  process.stdout.write(`${JSON.stringify({
    summary: { records: translations.length, stories: byStory.size, affectedStories, counts, checks: active },
    hookCoverage,
    findings: visible,
  }, null, 2)}\n`);
  process.exitCode = counts.error ? 1 : 0;
} else {
  const CHECK_TITLES = {
    markers: 'Isaret butunlugu — paylas kartini dogrudan bozar',
    truncation: 'Yarim kalmis blok icerigi',
    parity: 'Isaret sayisi tr ile uyumu',
    numbers: 'Olgu kaymasi — diller arasi sayi ve yil',
    terms: 'Riskli terim — makine cevirisi tuzaklari',
    leaks: 'Cevrilmemis Turkce parca',
    duplicates: 'Ayni metin iki dilde',
    subjects: 'Ozne dusmesi / kisi kaymasi',
    gender: 'Cinsiyet tutarsizligi',
    register: 'Hitap kipi karisimi',
    tense: 'Zaman kaymasi',
    titles: 'Baslik bicimi',
    length: 'Uzunluk sapmasi',
    whitespace: 'Bosluk artifaktlari',
  };
  const SEV_ICON = { error: '❌', warn: '⚠', info: 'ℹ' };

  const L = [];
  const p = (s = '') => L.push(s);
  const book = (sid) => bookTitles[byStory.get(sid)?.tr?.book_no] ?? '?';

  p('# Ceviri Denetim Raporu');
  p('');
  p(`- Uretildi: ${new Date().toISOString().slice(0, 16).replace('T', ' ')}`);
  p(`- Denetlenen: **${translations.length}** ceviri kaydi · **${byStory.size}** hikaye`);
  p(`- Bulgu: **${counts.error} hata** · **${counts.warn} uyari** · **${counts.info} bilgi**`);
  p(`- Etkilenen hikaye: **${affectedStories}**`);
  p(`- Aktif denetim: ${active.join(', ')}`);
  p('');
  p('| Seviye | Anlami |');
  p('|---|---|');
  p('| ❌ hata | Ekranda veya paylas kartinda gorunur bozukluk, ya da olgu celiskisi |');
  p('| ⚠ uyari | Muhtemel ceviri kusuru; insan gozu gerekir |');
  p('| ℹ bilgi | Kozmetik; mekanik duzeltilebilir |');
  p('');
  p('## Ozet');
  p('');
  p('| Denetim | ❌ | ⚠ | ℹ |');
  p('|---|---:|---:|---:|');
  for (const k of active) {
    const b = byCheck[k];
    if (!b) continue;
    p(`| ${CHECK_TITLES[k] ?? k} | ${b.error.length} | ${b.warn.length} | ${b.info.length} |`);
  }
  p('');
  p('## Hook kapsami');
  p('');
  p('| Dil | Dolu | Toplam |');
  p('|---|---:|---:|');
  for (const h of hookCoverage) p(`| ${h.lang_code} | ${h.filled} | ${h.total} |`);
  p('');
  p('Paylas kartindaki dorduncu icerik turu `hook` alanindan gelir. Dil basina buyuk fark');
  p('varsa tek dile yazan bir script kalmis demektir.');
  p('');

  for (const k of active) {
    const b = byCheck[k];
    if (!b) continue;
    const all = [...b.error, ...b.warn, ...b.info];
    if (!all.length) continue;
    p(`## ${CHECK_TITLES[k] ?? k}`);
    p('');
    p(`${all.length} bulgu${all.length > limit ? ` (ilk ${limit})` : ''}`);
    p('');
    for (const f of all.slice(0, limit)) {
      p(`- ${SEV_ICON[f.severity]} \`story_id:${f.story_id}\` **[${f.lang}]** ${book(f.story_id)} — ${f.message}`);
      if (f.evidence) p(`  > …${f.evidence.replace(/\n+/g, ' ⏎ ').trim()}…`);
      if (f.fix) p(`  → ${f.fix}`);
    }
    if (all.length > limit) p(`- … *+${all.length - limit} bulgu daha (\`--limit ${all.length}\` ile hepsini gor)*`);
    p('');
  }

  p('## Onarim yolu');
  p('');
  p('1. **Mekanik sinif** (bosluk, baslik bicimi): `--emit-sql` ile gozden gecirilebilir SQL uret.');
  p('2. **Isaret ve olgu hatalari**: ana metin duzeltmesi gerekir. `kind: new_story` batch\'i ile');
  p('   ilgili dili yeniden yaz, `validate-batch.mjs`\'den gecir, insan onayiyla ingest et.');
  p('3. **Ceviri kusurlari** (cinsiyet, ozne, hitap): o dilin metni bagimsiz yeniden yazilmali.');
  p('   `uretim-kurallari.md` bolum 4 — ceviri degil, olgu paketinden bagimsiz yazim.');
  p('');
  p('Bu script DB\'ye yazmaz. Tum onarimlar staging + insan onayi akisindan gecer.');

  const out = L.join('\n');
  const path = writeReport('translation-audit.md', out);
  process.stdout.write(`${out}\n`);
  process.stderr.write(`\n[audit] yazildi: ${path}\n`);
  process.exitCode = counts.error ? 1 : 0;
}

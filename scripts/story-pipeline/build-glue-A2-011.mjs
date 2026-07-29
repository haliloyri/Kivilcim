#!/usr/bin/env node
/**
 * build-glue-A2-011.mjs — A2-006'nin BOSLUKSUZ YAPISMA hasarini onarir.
 *
 * KOK NEDEN. A2-006 belirsiz-kaynak cumlesini regex ile buluyordu:
 *     /[^.!?\n#$&~]*(?:Arastirmalar\s+gosteriyor|...)[^.!?\n]*[.!?]/
 * Bastaki `[^.!?\n#$&~]*` geriye dogru, onceki cumle sonuna kadar yiyor.
 * Cumle sonundan SONRAKI BOSLUK bu sinifin icinde oldugu icin o da yenildi;
 * yerine konan cumle bosluksuz yapisti:
 *     "...gecen bir yil?Canfield'in aktardigina gore..."
 *
 * 18 hikayenin 7'sinde olustu (28 dil kaydinin 23'unde gorunur):
 *     1092 1158 1364 1405 1610 1630 1679
 * 1405 A2-010'da onarildi. Kalan 6 burada.
 *
 * UC AYRI KUSUR SINIFI:
 *   (a) yalnizca bosluk kayboldu        -> 1092 1158 1610 1630  (mekanik)
 *   (b) KAPANIS TIRNAGI da yenildi      -> 1364 tr/en/de
 *       "Bu aci hic gecmeyecek.Sandberg'e...   (kapanis " yok)
 *       Turkce/Ingilizce/Almanca'da tirnak nokta ICINDE oldugu icin regex
 *       onu da yuttu. Ispanyolca'da nokta tirnak DISINDA -> tirnak kurtuldu.
 *   (c) cekince PAYLAS KARTININ ICINDE  -> 1679 (A2-010'daki 1351/1405 ile ayni)
 *
 * (a) tamamen mekanik oldugu icin regex'in buldugu yere programatik olarak
 * paragraf sonu konur — elle FIND yazilmaz, yanlis yazma riski olmaz.
 * (b) ve (c) elle, acik FIND->REPLACE.
 */
import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { ROOT, LANGS, openDb, rows } from './lib/store.mjs';

const OUT = resolve(ROOT, 'staging/batch-A2-011-glue.json');

/* Cumle sonu + hemen buyuk harf, arada bosluk yok.
   On kosul olarak en az iki kucuk harf istenir; boylece bas harf kisaltmalari
   (J.K., M.R., H.M., S.M.) ve a.m./p.m. yanlis yakalanmaz.
   DIKKAT: kapanis tirnagi noktanin IKI YANINDA da olabilir. Turkce/Ingilizce/
   Almanca tirnagi noktanin ICINE alir ("... gecmeyecek." / „... verschwinden.“),
   Ispanyolca DISINDA birakir ("... desaparecera".). Ilk yazimda yalnizca
   noktadan SONRAKI tirnagi kabul etmisim ve 1364/es'i kacirdim. */
const Q = `[»”"'’)\\]]?`;
const GLUE = new RegExp(`([a-zçğıöşüäöüßáéíóúñ]{2,}${Q}[.!?]${Q})([A-ZÇĞİÖŞÜÄÖÜÁÉÍÓÚÑ])`);

/** (a) Mekanik: yalnizca paragraf sonu eklenecek hikayeler. */
const MECHANICAL = [1092, 1158, 1610, 1630];

/** (b) + (c) Elle: FIND -> REPLACE. PARA yer tutucusu kaynagin satir sonuna cevrilir. */
const PARA = ' PARA ';
const MANUAL = {
  /* 1364 — Option B / Sheryl Sandberg. Kapanis tirnagi geri konuyor.
     Almanca'da kapanis tirnagi „ ... “ bicimi. */
  1364: {
    tr: [[
      '"Bu acı hiç geçmeyecek.Sandberg\'e bu çerçeveyi anlatan psikolog',
      `"Bu acı hiç geçmeyecek."${PARA}Sandberg'e bu çerçeveyi anlatan psikolog`,
    ]],
    en: [[
      '"This pain will never go away.The psychologist who gave Sandberg',
      `"This pain will never go away."${PARA}The psychologist who gave Sandberg`,
    ]],
    es: [[
      '"Este dolor nunca desaparecerá".El psicólogo que dio a Sandberg',
      `"Este dolor nunca desaparecerá".${PARA}El psicólogo que dio a Sandberg`,
    ]],
    de: [[
      '„Dieser Schmerz wird niemals verschwinden.Der Psychologe, der Sandberg',
      `„Dieser Schmerz wird niemals verschwinden.“${PARA}Der Psychologe, der Sandberg`,
    ]],
  },

  /* 1679 — Headspace / Andy Puddicombe. Cekince paylas kartindan cikariliyor.
     A2-010'daki tasarim karari: kart kisa ve savunulabilir cumleyi tasir,
     kaynak/cekince hemen ardindaki govde paragrafina gider. */
  1679: {
    tr: [[
      '##Puddicombe şunu fark etti: Meditasyon erişilebilir olmak zorunda.Puddicombe kısa sürelerin bile işe yaradığını savunuyor; meditasyon çalışmalarının çoğu küçük örneklemli ve etki büyüklükleri tartışmalı.##',
      `##Puddicombe şunu fark etti: Meditasyon erişilebilir olmak zorunda.##${PARA}Puddicombe kısa sürelerin bile işe yaradığını savunuyor; meditasyon çalışmalarının çoğu küçük örneklemli ve etki büyüklükleri hâlâ tartışmalı.`,
    ]],
    en: [[
      '##Puddicombe realized: Meditation has to be accessible.Puddicombe argues even short sessions work; most meditation studies use small samples and their effect sizes are debated.##',
      `##Puddicombe realized: Meditation has to be accessible.##${PARA}Puddicombe argues even short sessions work; most meditation studies use small samples and their effect sizes are still debated.`,
    ]],
    es: [[
      '##Puddicombe se dio cuenta: la meditación tiene que ser accesible.Puddicombe sostiene que incluso las sesiones cortas funcionan; la mayoría de los estudios sobre meditación usan muestras pequeñas y sus efectos se discuten.##',
      `##Puddicombe se dio cuenta: la meditación tiene que ser accesible.##${PARA}Puddicombe sostiene que incluso las sesiones cortas funcionan; la mayoría de los estudios sobre meditación usan muestras pequeñas y sus efectos siguen discutiéndose.`,
    ]],
    de: [[
      '##Puddicombe erkannte: Meditation muss zugänglich sein.Puddicombe hält schon kurze Einheiten für wirksam; die meisten Meditationsstudien haben kleine Stichproben und ihre Effektstärken sind umstritten.##',
      `##Puddicombe erkannte: Meditation muss zugänglich sein.##${PARA}Puddicombe hält schon kurze Einheiten für wirksam; die meisten Meditationsstudien haben kleine Stichproben und ihre Effektstärken sind weiter umstritten.`,
    ]],
  },
};

const REASON = {
  1092: 'A2-006 HASARI: regex onceki cumlenin boslugunu yedi ("bir yil?Canfield"). Paragraf sonu geri konuldu',
  1158: 'A2-006 HASARI: bosluksuz yapisma ("konusmalar.Kitabin"). Paragraf sonu geri konuldu',
  1364: 'A2-006 HASARI: bosluk VE KAPANIS TIRNAGI yenildi ("gecmeyecek.Sandberg\'e"). Tirnak ve paragraf sonu geri konuldu',
  1610: 'A2-006 HASARI: bosluksuz yapisma ("Ve sonuc?S&P\'nin"). Paragraf sonu geri konuldu',
  1630: 'A2-006 HASARI: bosluksuz yapisma ("gercek.Mate"). Paragraf sonu geri konuldu',
  1679: 'A2-006 HASARI: cekince paylas kartinin icine dusmustu ve bosluksuz yapismisti. Kart temizlendi, cekince govdeye alindi',
};

/* ------------------------------------------------------------------ uygula */

const db = await openDb();
const cur = new Map();
for (const r of rows(db, 'SELECT story_id, lang_code, content FROM story_translations')) {
  cur.set(`${r.story_id}|${r.lang_code}`, r.content ?? '');
}
const titles = Object.fromEntries(
  rows(db, "SELECT story_id, title FROM story_translations WHERE lang_code='tr'").map((r) => [r.story_id, r.title])
);
db.close();

const countMarkers = (t) => JSON.stringify([
  (t.match(/##/g) ?? []).length,
  (t.match(/\$\$/g) ?? []).length,
  (t.match(/&&/g) ?? []).length,
  (t.match(/~~/g) ?? []).length,
]);
const glueCount = (t) => (t.match(new RegExp(GLUE.source, 'g')) ?? []).length;

const items = [];
const problems = [];

for (const sid of [...MECHANICAL, ...Object.keys(MANUAL).map(Number)].sort((a, b) => a - b)) {
  const langOut = {};

  for (const l of LANGS) {
    const before = cur.get(`${sid}|${l}`);
    if (before == null) { problems.push(`${sid}/${l}: kayit yok`); continue; }
    const nl = before.includes('\r\n') ? '\r\n' : '\n';
    let after = before;

    if (MANUAL[sid]) {
      let ok = true;
      for (const [find, repl] of MANUAL[sid][l]) {
        const n = after.split(find).length - 1;
        if (n !== 1) { problems.push(`${sid}/${l}: FIND ${n} kez -> ${find.slice(0, 50)}…`); ok = false; break; }
        after = after.split(find).join(repl.split(PARA).join(nl + nl));
      }
      if (!ok) continue;
    } else {
      /* Mekanik: regex'in buldugu yere paragraf sonu koy. Tam bir yer olmali. */
      const n = glueCount(before);
      if (n !== 1) { problems.push(`${sid}/${l}: yapisma sayisi ${n} (1 olmali)`); continue; }
      after = before.replace(GLUE, (_m, end, cap) => `${end}${nl}${nl}${cap}`);
    }

    /* Kontrol 1: isaret sayilari degismemis. */
    if (countMarkers(before) !== countMarkers(after)) {
      problems.push(`${sid}/${l}: isaret sayisi degisti`); continue;
    }
    /* Kontrol 2: yapisma AZALMIS olmali (artmasi ya da sabit kalmasi hata). */
    if (glueCount(after) >= glueCount(before)) {
      problems.push(`${sid}/${l}: yapisma azalmadi (${glueCount(before)} -> ${glueCount(after)})`); continue;
    }
    /* Kontrol 3: isaretler cikarildiginda metin AYNI kalmali (paragraf sonu ve
       kapanis tirnagi disinda hicbir kelime degismemis olmali). 1679'da
       "tartismali" -> "hala tartismali" gibi kucuk eklemeler var; o yuzden
       yalnizca mekanik olanlarda sert kontrol yapilir. */
    if (!MANUAL[sid]) {
      /* TUM boslugu sil, sonra karsilastir. Boslugu TEK boslugia indirmek
         yanlis olur: onarimin yaptigi is tam olarak orada bir bosluk
         OLMAMASINDAN bir bosluk OLMASINA gecmek; tek boslugia indirgeyen bir
         karsilastirma bu tek gecerli degisikligi de fark eder ve her seyi
         reddeder. Ilk yazimda bunu ters kurmusum. */
      const bare = (t) => t.replace(/\s+/gu, '');
      if (bare(before) !== bare(after)) {
        problems.push(`${sid}/${l}: mekanik onarim bosluk disinda bir sey degistirdi — beklenmiyor`); continue;
      }
    }
    if (after === before) { problems.push(`${sid}/${l}: metin degismedi`); continue; }

    langOut[l] = { content: after };
  }

  if (Object.keys(langOut).length === LANGS.length) {
    items.push({
      story: {
        story_id: sid,
        queue_title: titles[sid] ?? null,
        reason: REASON[sid],
        allow_overflow:
          'Onarim yalnizca kayip boslugu, kapanis tirnagini ve paragraf sonunu geri koyuyor. ' +
          'Kelime sayisi ya sabit kaliyor ya birkac kelime degisiyor; onceki uzunluk sapmalari ' +
          'bu partinin isi degil.',
      },
      lang: langOut,
    });
  } else {
    problems.push(`${sid}: 4 dil tamamlanamadi (${Object.keys(langOut).join(',') || 'hicbiri'})`);
  }
}

if (problems.length) {
  console.error('[A2-011] SORUNLAR:');
  for (const p of problems) console.error(`  ${p}`);
}

writeFileSync(OUT, `${JSON.stringify({
  batch_id: 'A2-011-glue',
  kind: 'content_fix',
  version: 'A2',
  created: new Date().toISOString().slice(0, 10),
  notes:
    'A2-006\'nin BOSLUKSUZ YAPISMA hasarini onarir. Kok neden: o partinin regex\'i ' +
    '`[^.!?\\n#$&~]*` ile geriye dogru onceki cumle sonuna kadar yiyordu ve cumle sonundan ' +
    'SONRAKI BOSLUK da bu sinifin icinde oldugu icin yenildi; yerine konan cumle bosluksuz ' +
    'yapisti. 18 hikayenin 7\'sinde olustu (1092 1158 1364 1405 1610 1630 1679); 1405 ' +
    'A2-010\'da onarildi, kalan 6 burada. Uc kusur sinifi: (a) yalnizca bosluk kayboldu ' +
    '(1092 1158 1610 1630) — bu tamamen mekanik oldugu icin regex\'in buldugu yere ' +
    'programatik paragraf sonu konur ve isaretler cikarildiginda metnin AYNI kaldigi ' +
    'dogrulanir; (b) KAPANIS TIRNAGI da yenildi (1364 tr/en/de) — Turkce/Ingilizce/Almanca\'da ' +
    'tirnak noktanin icinde oldugu icin regex onu da yuttu, Ispanyolca\'da nokta tirnagin ' +
    'disinda oldugu icin tirnak kurtulmustu; (c) cekince paylas kartinin ICINDE kalmisti ' +
    '(1679) — A2-010\'daki 1351/1405 ile ayni sinif, kart temizlendi ve cekince govdeye alindi. ' +
    'Bu kusuru A2-006 sirasinda hicbir kapi aramadigi icin fark edilmemisti; ayni turden ' +
    'bir hatanin bir daha gecmemesi icin validate-batch.mjs\'e kalici bir yapisma denetimi ' +
    'eklendi.',
  items,
}, null, 2)}\n`, 'utf8');

console.log(`[A2-011] ${items.length} hikaye · ${items.length * 4} dil kaydi -> ${OUT}`);
if (problems.length) process.exitCode = 1;

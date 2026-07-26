#!/usr/bin/env node
/**
 * build-quotes-A2-007.mjs — Tek seferlik: dogrulanan iki atifli alintiyi duzeltir.
 *
 * audit-facts.mjs 170 atifli alinti buldu. Risk siralamasi yapildi:
 *   - kitabin KENDI yazarina atif  -> 140 (dusuk risk)
 *   - ucuncu kisi, blok disinda    -> 15  (orta)
 *   - ucuncu kisi, ## blogu icinde -> 5   (yuksek: paylas kartinda gorunur)
 * Yuksek riskli 5'in 2'si parser gurultusuydu. Kalan 3 arastirildi:
 *
 *   1116 Gates   — soz GERCEK ama sozcukler kaymis. Asli 2005 Lakeside
 *                  konusmasi: "Lakeside olmasaydi Microsoft olmazdi."
 *                  DB "o bilgisayar" diyor; okul yerine cihaza baglamis.
 *   1260 Napoleon— UYGULAMA gercek (kendi anilari), ama tirnak icindeki soz
 *                  ve "asistanina acikladi" sahnesi belgeli degil. Yaygin
 *                  bicim Emerson'in 1850 denemesinden geliyor. Dogrudan
 *                  alinti kaldirildi, aktarilan uygulamaya cevrildi.
 *   1682 Kay     — parser gurultusu. Betsy Sparrow deneyi (Science 2011),
 *                  tirnaklar deney talimati; uydurma alinti degil.
 */
import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { ROOT, LANGS, openDb, rows } from './lib/store.mjs';

const OUT = resolve(ROOT, 'staging/batch-A2-007-quotes.json');

const BLOCK = {
  1116: {
    tr: 'Gates 2005\'te Lakeside\'ın mezuniyet töreninde şöyle dedi: "Lakeside olmasaydı, Microsoft olmazdı."',
    en: 'Speaking at Lakeside\'s graduation in 2005, Gates said: "If there had been no Lakeside, there would have been no Microsoft."',
    es: 'En la graduación de Lakeside en 2005, Gates dijo: "Si no hubiera existido Lakeside, no habría existido Microsoft".',
    de: 'Bei der Abschlussfeier von Lakeside sagte Gates 2005: „Ohne Lakeside hätte es Microsoft nicht gegeben.“',
  },
  1260: {
    tr: 'Napoleon kendi anılarında bu düzeni anlatır: üç haftanın sonunda gelen yazışmaların büyük bölümüne cevap vermek gereksiz hale geliyordu.',
    en: 'Napoleon describes the arrangement in his own memoirs: after three weeks it had become unnecessary to reply to most of the correspondence.',
    es: 'Napoleón describe esa práctica en sus propias memorias: al cabo de tres semanas ya no hacía falta responder a la mayor parte de la correspondencia.',
    de: 'Napoleon beschreibt diese Praxis in seinen eigenen Memoiren: Nach drei Wochen war es unnötig geworden, den größten Teil der Post zu beantworten.',
  },
};

/* 1260: dogrudan alinti kaldirildigi icin blok sonrasi bir cumle de eklenir. */
const AFTER = {
  1260: {
    tr: '\n\nBu uygulamanın bugün dolaşan cümle hâli Ralph Waldo Emerson\'ın 1850 tarihli denemesinden gelir; Napoleon\'a atfedilen doğrudan alıntının kaynağı yoktur.',
    en: "\n\nThe sentence version circulating today comes from Ralph Waldo Emerson's 1850 essay; the direct quotation attributed to Napoleon has no source.",
    es: '\n\nLa versión en forma de frase que circula hoy proviene del ensayo de Ralph Waldo Emerson de 1850; la cita directa atribuida a Napoleón no tiene fuente.',
    de: '\n\nDie heute kursierende Satzfassung stammt aus Ralph Waldo Emersons Essay von 1850; das Napoleon zugeschriebene wörtliche Zitat hat keine Quelle.',
  },
};

const db = await openDb();
const cur = new Map();
for (const r of rows(db, 'SELECT story_id, lang_code, content FROM story_translations')) {
  cur.set(`${r.story_id}|${r.lang_code}`, r.content ?? '');
}
const titles = Object.fromEntries(
  rows(db, "SELECT story_id, title FROM story_translations WHERE lang_code='tr'").map((r) => [r.story_id, r.title])
);
db.close();

const items = [];
const problems = [];

for (const [sidStr, byLang] of Object.entries(BLOCK)) {
  const sid = Number(sidStr);
  const langOut = {};
  for (const l of LANGS) {
    const text = cur.get(`${sid}|${l}`);
    if (text == null) { problems.push(`${sid}/${l}: kayit yok`); continue; }
    const at = [...text.matchAll(/##/g)].map((m) => m.index);
    if (at.length !== 2) { problems.push(`${sid}/${l}: ## sayisi ${at.length}`); continue; }
    let next = text.slice(0, at[0] + 2) + byLang[l] + text.slice(at[1]);
    if (AFTER[sid]) {
      const close = next.indexOf('##', next.indexOf('##') + 2) + 2;
      next = next.slice(0, close) + AFTER[sid][l] + next.slice(close);
    }
    langOut[l] = { content: next };
  }
  if (Object.keys(langOut).length === LANGS.length) {
    items.push({
      story: {
        story_id: sid,
        queue_title: titles[sid] ?? null,
        reason: sid === 1116
          ? 'atifli alinti: soz gercek ama sozcukler kaymisti; 2005 Lakeside konusmasindaki asli kondu'
          : 'atifli alinti: uygulama gercek, dogrudan alinti belgesiz. Alinti kaldirildi, Emerson kaynagi belirtildi',
        allow_overflow:
          'Kaynak ve cekince eklemek metni birkac kelime uzatiyor. Belgesiz alintiyi ' +
          'tirnak icinde birakmak, kelime hedefini asmaktan daha kotu.',
      },
      lang: langOut,
    });
  } else problems.push(`${sid}: 4 dil tamamlanamadi`);
}

if (problems.length) { console.error('[quotes] SORUNLAR:'); for (const p of problems) console.error(`  ${p}`); }
writeFileSync(OUT, `${JSON.stringify({
  batch_id: 'A2-007-quotes',
  kind: 'content_fix',
  version: 'A2',
  created: new Date().toISOString().slice(0, 10),
  notes:
    '170 atifli alintinin risk siralamasi sonucu arastirilan 3 yuksek riskli vakadan 2 duzeltme. ' +
    '1116: Gates sozu gercek (2005 Lakeside mezuniyet konusmasi) ama DB "o bilgisayar" diyerek okul ' +
    'yerine cihaza baglamisti. 1260: Napoleon\'un uc hafta bekleme uygulamasi kendi anilarinda ' +
    'belgeli, ama tirnak icindeki soz ve "asistanina acikladi" sahnesi belgesiz; yaygin bicim ' +
    'Emerson 1850. Dogrudan alinti kaldirildi. 1682 parser gurultusuydu (Betsy Sparrow deneyi, gercek).',
  items,
}, null, 2)}\n`, 'utf8');
console.log(`[quotes] ${items.length} hikaye · ${items.length * 4} dil kaydi -> ${OUT}`);

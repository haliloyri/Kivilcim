#!/usr/bin/env node
/**
 * build-caveats-A2-005.mjs — Tek seferlik: cekincesiz tartismali tezlere cekince ekler.
 *
 * audit-facts.mjs `contested` denetiminin bulduklarindan, HEDEF UZUNLUKTA olan
 * 8 hikaye. 1164 / 1403 / 1427 haric tutuldu: onlar Adim 2 kuyrugunda (1->3 dk)
 * ve zaten bastan yazilacak; simdi cekince eklemek bosa is olur.
 *
 * Cekince, $$ ders blogundan HEMEN ONCE ayri bir paragraf olarak eklenir.
 * Konum programatik bulunur; 32 ayri capa elle yazilmaz.
 */
import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { ROOT, LANGS, openDb, rows } from './lib/store.mjs';

const OUT = resolve(ROOT, 'staging/batch-A2-005-caveats.json');

/* story_id -> tartismali tez konusu */
const TOPIC = {
  1108: 'marshmallow',
  1254: 'hemisphere',
  1299: 'tenthousand',
  1336: 'limbic',
  1337: 'limbic',
  1467: 'mehrabian',
  1582: 'hemisphere',
  1584: 'hemisphere',
};

/* Kisa tutuldu: bu hikayelerin cogu 1 dk (120-200 kelime) ve bir kismi
   zaten ust sinira yakin. Cekince 14-22 kelime araliginda. */
const CAVEAT = {
  marshmallow: {
    tr: 'Daha büyük örneklemli sonraki çalışmalar bu uzun vadeli bağı belirgin biçimde zayıflattı.',
    en: 'Later studies with larger samples weakened this long-term link considerably.',
    es: 'Estudios posteriores con muestras mayores debilitaron bastante este vínculo a largo plazo.',
    de: 'Spätere Studien mit größeren Stichproben schwächten diesen langfristigen Zusammenhang deutlich ab.',
  },
  hemisphere: {
    tr: 'Sinirbilim bugün beynin bu kadar keskin ikiye ayrılmadığını söylüyor; ayrım bir benzetme.',
    en: 'Neuroscience today rejects such a clean split; the division is a metaphor.',
    es: 'La neurociencia actual rechaza esa división tan limpia; es una metáfora.',
    de: 'Die heutige Hirnforschung lehnt eine so saubere Trennung ab; sie ist eine Metapher.',
  },
  tenthousand: {
    tr: 'Ericsson bu popüler formülasyonu kendisi reddetti; bulgusu saat değil nitelikti.',
    en: 'Ericsson himself rejected that popular formulation; his finding was quality, not hours.',
    es: 'El propio Ericsson rechazó esa fórmula; su hallazgo era la calidad, no las horas.',
    de: 'Ericsson selbst wies diese Formel zurück; sein Befund betraf Qualität, nicht Stunden.',
  },
  limbic: {
    tr: 'Beynin duygu ve akıl diye keskin bölünmediği bugün genel kabul; bu bir kısaltma.',
    en: 'Neuroscience no longer accepts a clean emotion and reason split; this is shorthand.',
    es: 'La neurociencia ya no acepta esa división limpia; esto es un atajo.',
    de: 'Die Hirnforschung akzeptiert diese saubere Trennung nicht mehr; das ist eine Abkürzung.',
  },
  mehrabian: {
    tr: 'Bu oranlar çok dar bir deneyden çıktı; Mehrabian genellenmesine itiraz etti.',
    en: 'These figures came from a narrow experiment; Mehrabian objected to generalizing them.',
    es: 'Estas cifras salieron de un experimento estrecho; Mehrabian objetó generalizarlas.',
    de: 'Diese Zahlen stammen aus einem engen Experiment; Mehrabian widersprach der Verallgemeinerung.',
  },
};

const db = await openDb();
const current = new Map();
for (const r of rows(db, 'SELECT story_id, lang_code, content FROM story_translations')) {
  current.set(`${r.story_id}|${r.lang_code}`, r.content ?? '');
}
const titles = Object.fromEntries(
  rows(db, "SELECT story_id, title FROM story_translations WHERE lang_code = 'tr'").map((r) => [r.story_id, r.title])
);
db.close();

const items = [];
const problems = [];

for (const [sidStr, topic] of Object.entries(TOPIC)) {
  const sid = Number(sidStr);
  const langOut = {};
  for (const l of LANGS) {
    const text = current.get(`${sid}|${l}`);
    if (text == null) { problems.push(`${sid}/${l}: kayit yok`); continue; }

    /* $$ ders blogunun ACILIS konumunu bul (ilk gecis) */
    const at = [...text.matchAll(/\$\$/g)].map((m) => m.index);
    if (at.length !== 2) { problems.push(`${sid}/${l}: $$ sayisi ${at.length}, beklenen 2`); continue; }
    const open = at[0];

    /* Acilistan geriye dogru paragraf basina git */
    const before = text.slice(0, open);
    const cut = Math.max(before.lastIndexOf('\n\n'), before.lastIndexOf('\r\n\r\n'));
    if (cut === -1) { problems.push(`${sid}/${l}: $$ oncesi paragraf siniri yok`); continue; }

    const sep = text.slice(cut, open).startsWith('\r\n') ? '\r\n\r\n' : '\n\n';
    const caveat = CAVEAT[topic][l];
    const next = `${text.slice(0, cut)}${sep}${caveat}${text.slice(cut)}`;

    if (next.includes(`${caveat}${sep}${caveat}`)) { problems.push(`${sid}/${l}: cekince zaten var`); continue; }
    langOut[l] = { content: next };
  }
  if (Object.keys(langOut).length === LANGS.length) {
    items.push({
      story: {
        story_id: sid,
        queue_title: titles[sid] ?? null,
        reason: `cekincesiz tartismali tez (${topic}) — uretim-kurallari.md bolum 5 geregi cekince eklendi`,
        allow_overflow:
          'Cekince cumlesi bazi kayitlarda kelime hedefini birkac kelime asiyor. ' +
          'Yanlis bilgiyi duzeltmeden birakmak, hedefi asmaktan daha kotu. ' +
          'Bu hikayelerin uzunlugu ayri bir yeniden uretim gorevi olarak siraya girmeli.',
      },
      lang: langOut,
    });
  } else {
    problems.push(`${sid}: 4 dil tamamlanamadi, batch'e alinmadi`);
  }
}

if (problems.length) {
  console.error('[caveats] SORUNLAR:');
  for (const p of problems) console.error(`  ${p}`);
}
if (!items.length) { console.error('[caveats] uretilecek kayit yok'); process.exitCode = 1; }
else {
  writeFileSync(OUT, `${JSON.stringify({
    batch_id: 'A2-005-caveats',
    kind: 'content_fix',
    version: 'A2',
    created: new Date().toISOString().slice(0, 10),
    notes:
      'audit-facts.mjs `contested` denetiminin bulduklarina cekince eklenmesi. ' +
      'uretim-kurallari.md bolum 5: tartismali tez kesin gercek gibi sunulamaz. ' +
      'Cekince $$ ders blogundan hemen once ayri paragraf olarak eklendi, konum programatik bulundu. ' +
      '1164 / 1403 / 1427 HARIC TUTULDU: onlar Adim 2 kuyrugunda (1->3 dk) ve bastan yazilacak.',
    items,
  }, null, 2)}\n`, 'utf8');
  console.log(`[caveats] ${items.length} hikaye · ${items.length * 4} dil kaydi -> ${OUT}`);
  for (const it of items) console.log(`  ${it.story.story_id} ${titles[it.story.story_id]?.slice(0, 46) ?? ''}`);
}

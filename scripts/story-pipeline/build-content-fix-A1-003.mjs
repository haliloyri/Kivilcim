#!/usr/bin/env node
/**
 * build-content-fix-A1-003.mjs — Tek seferlik onarim batch'i uretici.
 *
 * Metinleri elden yeniden yazmak yerine NOKTA HEDEFLI find/replace uygular.
 * Her kalibin metinde TAM BIR KEZ eslesmesi zorunlu; eslesmezse veya birden
 * fazla eslesirse script durur. Boylece yanlis yere yazma imkansiz.
 *
 * Kullanim: node scripts/story-pipeline/build-content-fix-A1-003.mjs
 */
import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { ROOT, openDb, rows } from './lib/store.mjs';

const OUT = resolve(ROOT, 'staging/batch-A1-003-content.json');

/* ------------------------------------------------------------------ */
/* Duzeltme tanimlari                                                  */
/*                                                                     */
/* Her dil icin: { find, replace } ciftleri + reason.                   */
/* Diller BAGIMSIZ yazildi; birbirinin cevirisi degil.                  */
/* ------------------------------------------------------------------ */

const FIXES = [
  /* ---- 1. Riskli terim: makine cevirisi tuzaklari ---------------- */
  {
    story_id: 1059,
    reason: 'terim: Turkce oznesiz cumleye ("zaferlerini pes pese dizdi") yanlis ozne eklenmis — "he piled up"',
    lang: {
      en: [{
        find: 'Then he piled up Tour de France victories one after another.',
        replace: 'Then came a run of Tour de France victories, one after another.',
      }],
    },
  },
  {
    story_id: 1061,
    reason: 'terim: "her gun cekmis" (fotograf cekmek) -> "suffered every day" (aci cekmek) olarak cevrilmis',
    lang: {
      en: [{
        find: 'The quantity group suffered every day, made mistakes every day,',
        replace: 'The quantity group shot every day, made mistakes every day,',
      }],
    },
  },
  {
    story_id: 1062,
    reason: 'terim: Almanca "Koks" kokain demek; Ispanyolca "la coca" ayni riski tasiyor. Ayrica Almanca cumlede ozne "Es" (o/sey) yerine Anne Thorndike icin "Sie" olmali',
    lang: {
      de: [{
        find: 'Es hat einfach Folgendes bewirkt: Es hat Koks unzugänglicher und Wasser zugänglicher gemacht.',
        replace: 'Sie tat nur eines: Sie machte Cola schwerer erreichbar und Wasser leichter erreichbar.',
      }],
      es: [{
        find: 'Simplemente hizo esto: hizo que la coca fuera más inaccesible y el agua más accesible.',
        replace: 'Simplemente hizo esto: hizo que el refresco fuera menos accesible y el agua más accesible.',
      }],
    },
  },

  /* ---- 2. Eksik $$ ders blogu + deyim cevirisi ------------------- */
  {
    story_id: 1160,
    reason: 'isaret onariminda $$ ders blogu kalmadi (metin soruydu, && oldu); dort dile ders blogu eklendi. Ayrica en\'de "brain stuffing" birebir ceviri',
    lang: {
      tr: [{
        find: '\r\n\r\n&&Olaylarla ilgili',
        replace: '\r\n\r\n$$Çatışma çoğu zaman olaydan değil, olayın üstüne kurduğun hikâyeden doğar.$$\r\n\r\n&&Olaylarla ilgili',
      }],
      en: [
        {
          find: 'and how much are just brain stuffing?&&',
          replace: 'and how much did your brain fill in?&&',
        },
        {
          find: '\r\n\r\n&&How much of your stories',
          replace: '\r\n\r\n$$Conflict rarely starts with what happened; it starts with the story you built on top of it.$$\r\n\r\n&&How much of your stories',
        },
      ],
      es: [{
        find: '\r\n\r\n&&¿Cuántas de tus historias',
        replace: '\r\n\r\n$$El conflicto casi nunca nace de lo ocurrido, sino de la historia que construiste encima.$$\r\n\r\n&&¿Cuántas de tus historias',
      }],
      de: [{
        find: '\r\n\r\n&&Wie viele Ihrer Geschichten',
        replace: '\r\n\r\n$$Konflikte entstehen selten aus dem Geschehen, sondern aus der Geschichte, die du darüber legst.$$\r\n\r\n&&Wie viele Ihrer Geschichten',
      }],
    },
  },

  /* ---- 3. Kirpilmis cumle: yuklem eksik ------------------------- */
  {
    story_id: 1537,
    reason: 'kirpilma: $$ ders blogu yuklemsiz kesilmis ("...repetition creates" / "...crea" / "...schafft")',
    lang: {
      en: [{
        find: 'conscious, analytical, challenging repetition creates',
        replace: 'conscious, analytical, challenging repetition creates it.',
      }],
      es: [{
        find: 'la repetición consciente, analítica y desafiante crea',
        replace: 'la repetición consciente, analítica y desafiante sí lo crea.',
      }],
      de: [{
        find: 'bewusste, analytische, herausfordernde Wiederholung schafft ',
        replace: 'bewusste, analytische, herausfordernde Wiederholung schafft sie.',
      }],
    },
  },

  /* ---- 4. Eksik nokta: cumle tam, noktalama yok ----------------- */
  {
    story_id: 1601,
    reason: 'noktalama: $$ ders blogu tam ama nokta yok; paylas kartinda cumle yarim gorunuyor',
    lang: {
      en: [{
        find: 'five breaths per minute alone restores balance',
        replace: 'five breaths per minute alone restores balance.',
      }],
      es: [{
        find: 'solo cinco respiraciones por minuto restablecen el equilibrio',
        replace: 'solo cinco respiraciones por minuto restablecen el equilibrio.',
      }],
      de: [{
        find: 'allein fünf Atemzüge pro Minute stellen das Gleichgewicht wieder her',
        replace: 'allein fünf Atemzüge pro Minute stellen das Gleichgewicht wieder her.',
      }],
    },
  },

  /* ---- 5. Cevrilmemis Turkce parca ------------------------------ */
  {
    story_id: 1508,
    reason: 'sizinti: bir cumle hic cevrilmemis, Turkce kalmis. Ayrica sonraki cumlenin basindaki kacak bosluk temizlendi',
    lang: {
      en: [{
        find: 'Birincisi yeterli pozisyonel güç: Değişimi fiilen hayata geçirebilecek pozisyonlarda insanlar.\n\n Second,',
        replace: 'First, enough positional power: people in roles that can actually put the change into practice.\n\nSecond,',
      }],
    },
  },
  {
    story_id: 1677,
    reason: 'sizinti: iki ic alinti Turkce kalmis; Ispanyolca tirnak isaretleri de tutarsizdi',
    lang: {
      es: [{
        find: '«Bugün egzersiz yapmadım, ne fark eder?" «Bu hafta kitap okumadım, hayatım değişmez."',
        replace: '«Hoy no hice ejercicio, ¿qué más da?» «Esta semana no leí nada, mi vida no va a cambiar.»',
      }],
    },
  },
];

/* ------------------------------------------------------------------ */
/* Uygula                                                              */
/* ------------------------------------------------------------------ */

const db = await openDb();
const current = new Map();
for (const r of rows(db, 'SELECT story_id, lang_code, content FROM story_translations')) {
  current.set(`${r.story_id}|${r.lang_code}`, r.content ?? '');
}
const titles = Object.fromEntries(
  rows(db, `SELECT story_id, title FROM story_translations WHERE lang_code = 'tr'`)
    .map((r) => [r.story_id, r.title])
);
db.close();

const items = [];
const problems = [];

for (const fix of FIXES) {
  const langOut = {};
  for (const [l, edits] of Object.entries(fix.lang)) {
    const key = `${fix.story_id}|${l}`;
    let text = current.get(key);
    if (text == null) { problems.push(`${key}: DB'de kayit yok`); continue; }

    for (const [i, e] of edits.entries()) {
      const hits = text.split(e.find).length - 1;
      if (hits !== 1) {
        problems.push(`${key} edit#${i}: kalip ${hits} kez eslesti (tam 1 olmali) — "${e.find.slice(0, 55)}…"`);
        text = null;
        break;
      }
      text = text.replace(e.find, () => e.replace);
    }
    if (text == null) continue;
    langOut[l] = { content: text };
  }
  if (Object.keys(langOut).length) {
    items.push({
      story: { story_id: fix.story_id, queue_title: titles[fix.story_id] ?? null, reason: fix.reason },
      lang: langOut,
    });
  }
}

if (problems.length) {
  console.error('[build] KALIP ESLESME HATASI — batch yazilmadi:');
  for (const p of problems) console.error(`  ${p}`);
  process.exitCode = 1;
} else {
  const batch = {
    batch_id: 'A1-003-content',
    kind: 'content_fix',
    version: 'A1',
    created: new Date().toISOString().slice(0, 10),
    notes:
      'Agent 1 · icerik duzeltmeleri. 5 riskli terim, 1160 icin eksik $$ ders blogu (4 dil), ' +
      '1537 kirpilmis yuklem, 1601 eksik nokta, 2 cevrilmemis Turkce parca. ' +
      'Duzeltmeler nokta hedefli find/replace ile uygulandi; her kalip tam bir kez eslesti. ' +
      'Diller bagimsiz yazildi, birbirinin cevirisi degil.',
    items,
  };
  writeFileSync(OUT, `${JSON.stringify(batch, null, 2)}\n`, 'utf8');
  const n = items.reduce((a, i) => a + Object.keys(i.lang).length, 0);
  console.log(`[build] ${items.length} hikaye · ${n} dil kaydi`);
  console.log(`  yazildi: ${OUT}\n`);
  for (const it of items) {
    console.log(`  ${it.story.story_id} [${Object.keys(it.lang).join(',')}] ${titles[it.story.story_id]?.slice(0, 40) ?? ''}`);
    console.log(`    ${it.story.reason}`);
  }
}

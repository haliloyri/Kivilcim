#!/usr/bin/env node
/**
 * validate-batch.mjs — Staging batch'ini kabul kriterlerine gore denetler.
 *
 * DB'ye hicbir sey yazmaz. ingest-batch.mjs bu scripti gecmeyen batch'i almaz.
 *
 * Kullanim:
 *   node scripts/story-pipeline/validate-batch.mjs staging/batch-018.json
 *   node scripts/story-pipeline/validate-batch.mjs staging/batch-018.json --json
 */
import { existsSync } from 'fs';
import { resolve } from 'path';
import {
  ROOT, LANGS, openDb, readJson, writeReport, wordRange, stripMarkers,
  countWords, countMarker, extractMarker, numberTokens, sentenceCount, paragraphCount,
} from './lib/store.mjs';

const argv = process.argv.slice(2);
const file = argv.find((a) => !a.startsWith('--'));
const asJson = argv.includes('--json');

if (!file) {
  console.error('Kullanim: node scripts/story-pipeline/validate-batch.mjs <staging/batch-NNN.json>');
  process.exit(2);
}
const path = resolve(ROOT, file);
if (!existsSync(path)) {
  console.error(`Dosya yok: ${path}`);
  process.exit(2);
}

const batch = readJson(path);

/* Zaten ingest edilmis batch'i yeniden dogrulamak yaniltici bir hata duvari
   uretir: content_fix "DB ile ayni" der, marker_repair invaryant ihlali verir
   (cunku sonraki bir batch ayni kaydi degistirmis olabilir). Ikisi de guvenlik
   sisteminin dogru calistigi anlamina gelir — tekrar uygulama engellenir.
   Kullaniciyi bu duvarla karsilastirmak yerine durumu acikca soyle. */
if (batch.ingested_at) {
  const msg = [
    `# Batch Dogrulama — ${batch.batch_id ?? '?'}`,
    '',
    `- Dosya: \`${file}\``,
    `- Tur: ${batch.kind} · ${batch.items?.length ?? 0} kayit`,
    `- Sonuc: **ZATEN INGEST EDILDI** — ${batch.ingested_at.slice(0, 16).replace('T', ' ')}`,
    '',
    'Bu batch DB\'ye uygulanmis. Yeniden dogrulama calistirilmadi.',
    '',
    'Tekrar uygulamaya calisirsan `ingest-batch.mjs` seni durdurur:',
    '',
    '- `content_fix` -> "content DB ile ayni" hatasi',
    '- `marker_repair` -> invaryant ihlali (sonraki bir batch ayni kaydi degistirmis olabilir;',
    '  yeniden uygulamak o isi geri alirdi)',
    '',
    'Icerigi gozden gecirmek istiyorsan dosyayi dogrudan ac.',
  ].join('\n');
  writeReport(`validate-${batch.batch_id ?? 'batch'}.md`, msg);
  process.stdout.write(`${msg}\n`);
  process.exit(0);
}

const errors = [];
const warnings = [];

const err = (where, msg) => errors.push(`${where}: ${msg}`);
const warn = (where, msg) => warnings.push(`${where}: ${msg}`);

/* ------------------------------------------------------------------ */
/* Sema                                                                */
/* ------------------------------------------------------------------ */

if (!batch.batch_id) err('batch', '`batch_id` zorunlu');
if (batch.version === undefined || batch.version === null) err('batch', '`version` zorunlu (HIKAYE_URETIM_TASK.md sorma kurali: kullaniciya sorulmali)');
const KINDS = ['new_story', 'variants_only', 'new_book', 'marker_repair', 'content_fix', 'hook_only'];
if (!KINDS.includes(batch.kind)) {
  err('batch', `\`kind\` su degerlerden biri olmali: ${KINDS.join(' | ')}`);
}
if (!Array.isArray(batch.items) || !batch.items.length) err('batch', '`items` bos olamaz');

/* ------------------------------------------------------------------ */
/* DB baglami                                                          */
/* ------------------------------------------------------------------ */

const db = await openDb();
const existingListNos = new Set(
  (db.exec('SELECT list_no FROM books')[0]?.values ?? []).map(([n]) => n)
);
const existingStoryIds = new Set(
  (db.exec('SELECT id FROM stories')[0]?.values ?? []).map(([n]) => n)
);
/* marker_repair icin: mevcut content'ler (invaryant kontrolu) */
const existingContent = new Map();
for (const [sid, lang, content] of db.exec(
  'SELECT story_id, lang_code, content FROM story_translations'
)[0]?.values ?? []) {
  existingContent.set(`${sid}|${lang}`, content ?? '');
}
const storyMinutes = new Map();
for (const [id, pos] of db.exec('SELECT id, possible_read_minutes FROM stories')[0]?.values ?? []) {
  storyMinutes.set(id, pos);
}

const existingTrTitles = new Map();
for (const [bookNo, title] of db.exec(
  `SELECT s.book_no, st.title FROM stories s
     JOIN story_translations st ON st.story_id = s.id AND st.lang_code = 'tr'`
)[0]?.values ?? []) {
  const key = `${bookNo}|${(title ?? '').toLocaleLowerCase('tr').trim()}`;
  existingTrTitles.set(key, true);
}

/* hook_only icin: mevcut question ve hook. DB kapanmadan once okunmali. */
const existingQuestion = new Map();
for (const [sid, lang, q] of db.exec(
  'SELECT story_id, lang_code, question FROM story_conversation_variants'
)[0]?.values ?? []) {
  existingQuestion.set(`${sid}|${lang}`, q ?? '');
}
const existingHook = new Map();
for (const [sid, lang, h] of db.exec(
  'SELECT story_id, lang_code, hook FROM story_translations'
)[0]?.values ?? []) {
  existingHook.set(`${sid}|${lang}`, h ?? '');
}

db.close();

/* ------------------------------------------------------------------ */
/* Item denetimi                                                       */
/* ------------------------------------------------------------------ */

/**
 * Isaretleri CIFT olarak ayristir. Naif regex yan yana duran iki blogun
 * kapanisi ile acilisini bos blok sanar; kapanis isaretini de "cumle
 * ortasinda acilis" sanar. Ikisi de yasandi.
 */
function markerBlocks(text = '', m) {
  const esc = m.replace(/[$]/g, '\\$');
  const at = [...text.matchAll(new RegExp(esc, 'g'))].map((x) => x.index);
  const pairs = [];
  for (let i = 0; i + 1 < at.length; i += 2) {
    pairs.push({ open: at[i], close: at[i + 1], content: text.slice(at[i] + m.length, at[i + 1]) });
  }
  return { pairs, count: at.length, dangling: at.length % 2 ? at[at.length - 1] : null };
}

/**
 * BOSLUKSUZ YAPISMA — cumle sonundan sonra bosluk yok, hemen buyuk harf var:
 *   "...gecen bir yil?Canfield'in aktardigina gore..."
 *
 * NEDEN VAR: A2-006 partisi cumleleri regex ile degistiriyordu ve kalibin
 * bastaki `[^.!?\n#$&~]*` kismi geriye dogru onceki cumle sonuna kadar yiyordu.
 * Cumle sonundan SONRAKI BOSLUK da o sinifin icinde oldugu icin yenildi.
 * 18 hikayenin 7'sinde olustu ve HICBIR KAPI ARAMADIGI ICIN fark edilmedi;
 * ancak sonradan elle tarama yapildiginda ortaya cikti (A2-011 onardi).
 *
 * DIKKAT — kapanis tirnagi noktanin IKI YANINDA da olabilir:
 *   tr/en/de tirnagi noktanin ICINE alir : "... gecmeyecek."  / „... verschwinden.“
 *   es      DISINDA birakir              : "... desaparecera".
 * Ilk yazimda yalnizca noktadan SONRAKI tirnagi kabul etmisim ve 1364/es'i
 * kacirmisim. Ikisi de kabul edilmeli.
 *
 * En az iki kucuk harf on kosulu, bas harf kisaltmalarini (J.K., M.R., H.M.)
 * ve a.m./p.m. gibi bicimleri yanlis yakalamamak icin.
 */
const GLUE_Q = `[»”"'’)\\]]?`;
const GLUE_RE = new RegExp(
  `[a-zçğıöşüäöüßáéíóúñ]{2,}${GLUE_Q}[.!?]${GLUE_Q}[A-ZÇĞİÖŞÜÄÖÜÁÉÍÓÚÑ]`, 'g'
);

/**
 * Yapisma denetimi. Onceki metin de biliniyorsa (content_fix) yalnizca YENI
 * olusanlar hata sayilir; eski metinde zaten varsa uyari verilir, cunku o
 * ayri bir onarim gorevidir ve bu batch'i bloklamasi yanlis olur.
 */
function checkGlue(at, text, before, err, warn) {
  const now = [...text.matchAll(GLUE_RE)].map((m) => m[0]);
  if (!now.length) return;
  const had = before ? [...before.matchAll(GLUE_RE)].map((m) => m[0]) : [];
  const hadSet = new Set(had);
  const fresh = now.filter((h) => !hadSet.has(h));
  for (const h of fresh) {
    err(at, `bosluksuz yapisma olustu: "${h}" — cumle sonundan sonra bosluk yok`);
  }
  const stale = now.filter((h) => hadSet.has(h));
  if (stale.length) {
    warn(at, `${stale.length} eski bosluksuz yapisma duruyor (${stale.join(', ')}) — bu duzeltmenin urunu degil, ayri gorev`);
  }
}

/* ------------------------------------------------------------------ */
/* marker_repair: yalnizca isaret konumu degisir                       */
/*                                                                     */
/* GUVENLIK INVARYANTI: stripMarkers(yeni) === stripMarkers(eski).      */
/* Yani metnin tek bir harfi degismemis olmali. Bu sart onarimin        */
/* gizli bir yeniden yazima donusmesini imkansiz kilar.                */
/* ------------------------------------------------------------------ */

if (batch.kind === 'marker_repair') {
  for (const [idx, item] of (batch.items ?? []).entries()) {
    const sid = item.story?.story_id;
    const label = `item[${idx}] story_id:${sid ?? '?'}`;
    if (sid == null) {
      err(label, '`story.story_id` zorunlu');
      continue;
    }
    if (!existingStoryIds.has(sid)) {
      err(label, `story_id ${sid} DB'de yok`);
      continue;
    }
    const langs = item.lang ?? {};
    if (!Object.keys(langs).length) err(label, 'en az bir dil verilmeli');

    for (const [l, d] of Object.entries(langs)) {
      const at = `${label} [${l}]`;
      if (!LANGS.includes(l)) {
        err(at, `bilinmeyen dil kodu`);
        continue;
      }
      const before = existingContent.get(`${sid}|${l}`);
      if (before === undefined) {
        err(at, `DB'de bu dil icin kayit yok`);
        continue;
      }
      if (!d.content) {
        err(at, '`content` zorunlu');
        continue;
      }

      /* --- INVARYANT --- */
      const a = stripMarkers(before);
      const b = stripMarkers(d.content);
      if (a !== b) {
        /* ilk farki bul ve gozle gorulur bicimde bildir */
        let i = 0;
        while (i < a.length && i < b.length && a[i] === b[i]) i += 1;
        err(at,
          'INVARYANT IHLALI — isaret disinda metin degismis. marker_repair yalnizca ' +
          `isaret tasir. Ilk fark ${i}. karakterde: DB="${a.slice(Math.max(0, i - 25), i + 25)}" ` +
          `vs BATCH="${b.slice(Math.max(0, i - 25), i + 25)}"`);
        continue;
      }

      /* --- Onarim gercekten duzeltti mi --- */
      const minutes = storyMinutes.get(sid) ?? 1;
      const spec = wordRange([1, 3, 5].includes(minutes) ? minutes : 1);
      for (const m of ['##', '$$', '&&']) {
        const { pairs, count, dangling } = markerBlocks(d.content, m);
        if (dangling !== null) err(at, `${m} hala tek sayida (${count}) — blok kapanmamis`);
        for (const p of pairs) {
          if (!p.content.trim()) err(at, `${m} blogu bos`);
          const pre = d.content.slice(Math.max(0, p.open - 40), p.open);
          if (/[a-zçğıöşü,][^\S\n]+$/u.test(pre)) {
            err(at, `${m} isareti hala cumle ortasinda aciliyor: "…${pre.slice(-30)}${m}…"`);
          }
        }
        const blocks = pairs.length;
        if (m === '$$' && blocks !== 1) {
          (blocks === 0 ? warn : err)(at, `$$ blok sayisi ${blocks} (beklenen 1)` +
            (blocks === 0 ? ' — ders blogu eksik, ayri bir icerik gorevi' : ''));
        }
        if (m === '&&' && blocks !== 1) err(at, `&& blok sayisi ${blocks} (beklenen 1)`);
        if (m === '##' && (blocks < spec.emphasisMin || blocks > spec.emphasisMax)) {
          warn(at, `## blok sayisi ${blocks} — ${minutes} dk icin ${spec.emphasisMin}-${spec.emphasisMax}`);
        }
      }
      const refl = markerBlocks(d.content, '&&').pairs[0]?.content.trim();
      if (refl && !/\?\s*$/.test(refl)) warn(at, '&& blogu soru isaretiyle bitmiyor');
      checkGlue(at, d.content, existingContent.get(`${sid}|${l}`), err, warn);
    }
  }
}

/* ------------------------------------------------------------------ */
/* content_fix: mevcut metinde cerrahi duzeltme                        */
/*                                                                     */
/* marker_repair harfe dokunmayi yasaklar; content_fix tam tersine      */
/* harf duzeltmek icindir. O yuzden invaryant yok, ama duzeltilmis      */
/* kaydin TEMIZ olmasi zorunlu: isaretler dengeli, bloklar dolu ve      */
/* noktalamayla bitiyor, kelime araligi tutuyor, Turkce sizinti yok.    */
/* ------------------------------------------------------------------ */

const TR_CHARS = /[ışğİĞŞ]/;

/**
 * DB'de 633 eski Almanca hook bu sekiz kalibin kopyasi. Hikayeye dair
 * hicbir sey soylemiyorlar; paylas kartinda "Hook" diye bos yer kapliyorlar.
 * Yeni uretimde tekrar etmesin diye kalip listesi burada tutulur.
 */
const HOOK_TEMPLATES = [
  /^(Das hat mein Denken|Diese Erkenntnis hat mein|Diese Lektion hat mich)/i,
  /^(Der Unterschied zwischen denen|Der eine Satz, der)/i,
  /^(Das untersch[aä]tzte Buch|Was die erfolgreichsten Menschen|Was ich mir gew[uü]nscht)/i,
  /^(Wie eine einzige Gewohnheit dein Leben)/i,
  /^(Dieses Buch ver[aä]ndert alles|Warum du dieses Wissen)/i,
  /^Das steckt wirklich hinter/i,
  /^(Bu kitap|Bu hikaye|Bu ders) (her ?sey|hayat)/i,
  /^(This book|This story|This lesson) (changes|will change)/i,
  /^(Este libro|Esta historia) (cambia|cambiar[aá])/i,
  /dein Leben (ver[aä]ndert|transformiert|transformed)/i,
  /niemand sagt dir das|aber noch nie geh[oö]rt/i,
];

if (batch.kind === 'content_fix') {
  for (const [idx, item] of (batch.items ?? []).entries()) {
    const sid = item.story?.story_id;
    const label = `item[${idx}] story_id:${sid ?? '?'}`;
    if (sid == null) { err(label, '`story.story_id` zorunlu'); continue; }
    if (!existingStoryIds.has(sid)) { err(label, `story_id ${sid} DB'de yok`); continue; }
    if (!item.story?.reason) warn(label, '`story.reason` yok — hangi kusurun duzeltildigi kayitli olmali');

    const langs = item.lang ?? {};
    if (!Object.keys(langs).length) err(label, 'en az bir dil verilmeli');

    for (const [l, d] of Object.entries(langs)) {
      const at = `${label} [${l}]`;
      if (!LANGS.includes(l)) { err(at, 'bilinmeyen dil kodu'); continue; }
      const before = existingContent.get(`${sid}|${l}`);
      if (before === undefined) { err(at, `DB'de bu dil icin kayit yok`); continue; }
      if (!d.content) { err(at, '`content` zorunlu'); continue; }
      if (d.content === before) { err(at, 'content DB ile ayni — bu kayit batch\'te olmamali'); continue; }

      /* --- isaret sagligi --- */
      const minutes = storyMinutes.get(sid) ?? 1;
      const spec = wordRange([1, 3, 5].includes(minutes) ? minutes : 1);
      for (const m of ['##', '$$', '&&']) {
        const { pairs, count, dangling } = markerBlocks(d.content, m);
        if (dangling !== null) err(at, `${m} tek sayida (${count}) — blok kapanmamis`);
        for (const p of pairs) {
          if (!p.content.trim()) { err(at, `bos ${m} blogu`); continue; }
          const pre = d.content.slice(Math.max(0, p.open - 40), p.open);
          if (/[a-zçğıöşü,][^\S\n]+$/u.test(pre)) err(at, `${m} isareti cumle ortasinda aciliyor`);
          /* yarim kalmis blok — kirpilma onarimlarinin asil hedefi */
          if (!/[.!?…:"»”“'’)\]²³¹°]$/u.test(p.content.trim())) {
            err(at, `${m} blogu noktalama olmadan bitiyor: "…${p.content.trim().slice(-45)}"`);
          }
        }
        const n = pairs.length;
        if (m === '$$' && n !== 1) err(at, `$$ blok sayisi ${n} (beklenen 1)`);
        if (m === '&&' && n !== 1) err(at, `&& blok sayisi ${n} (beklenen 1)`);
        if (m === '##' && (n < spec.emphasisMin || n > spec.emphasisMax)) {
          warn(at, `## blok sayisi ${n} — ${minutes} dk icin ${spec.emphasisMin}-${spec.emphasisMax}`);
        }
      }

      checkGlue(at, d.content, before, err, warn);

      /* --- uzunluk ---
         ONEMLI: Aralik disi olmak tek basina bu duzeltmenin sucu degil. Cogu
         eski kayit zaten aralik disiydi. Sucu duzeltmeye yikmak yanlis yonlendirir;
         onceki degerle karsilastirip hangisi oldugunu ayirt et. */
      const w = countWords(d.content);
      const w0 = countWords(before);
      const out = (n) => n < spec.min || n > spec.max;
      if (out(w)) {
        if (out(w0)) {
          warn(at, `content ${w} kelime — ${minutes} dk hedefi ${spec.min}-${spec.max}. ` +
            `Duzeltme ONCESI de aralik disiydi (${w0}); bu duzeltmenin yol actigi bir sapma degil, ` +
            'ayri bir yeniden uretim isi.');
        } else if (item.story?.allow_overflow) {
          /* Gerekceli istisna. Dogruluk duzeltmesi bazen uzunluk hedefiyle carpisir:
             cekince cumlesi eklemek metni birkac kelime tasirabilir. Yanlis bilgiyi
             oldugu gibi birakmak, hedefi 10 kelime asmaktan daha kotudur. Ama bu
             sessiz bir bypass olmamali; gerekce yazilmak zorunda ve uyari kalir. */
          warn(at, `content ${w} kelime — ${minutes} dk hedefi ${spec.min}-${spec.max} (once ${w0}). ` +
            `ISTISNA KABUL EDILDI: ${item.story.allow_overflow}. Uzunluk ayri bir gorev olarak siraya girmeli.`);
        } else {
          err(at, `content ${w} kelime — ${minutes} dk hedefi ${spec.min}-${spec.max}. ` +
            `DUZELTME ARALIGIN DISINA CIKARDI (once ${w0}, simdi ${w}). ` +
            'Kisalt, ya da gerekce yazarak `story.allow_overflow` kullan.');
        }
      }

      /* --- cevrilmemis Turkce parca --- */
      if (l !== 'tr' && TR_CHARS.test(d.content)) {
        const m = d.content.match(new RegExp(`\\S*${TR_CHARS.source}\\S*`, 'u'));
        err(at, `hala cevrilmemis Turkce parca var: "${m?.[0] ?? '?'}"`);
      }

      /* --- degisim ozeti (insan incelemesi icin) --- */
      const dw = w - w0;
      if (Math.abs(dw) > 25) {
        warn(at, `kelime sayisi ${dw > 0 ? '+' : ''}${dw} degisti — cerrahi duzeltme icin buyuk, gozden gecir`);
      }
    }
  }
}

/* ------------------------------------------------------------------ */
/* hook_only: yalnizca reel/paylas acilisi yazilir                     */
/*                                                                     */
/* Varyantlar zaten DB'de. Bu tur onlara DOKUNMAZ — ingest tarafinda   */
/* variant upsert'i atlanir, yoksa INSERT OR REPLACE eksik alanlari    */
/* NULL yapip mevcut varyantlari siler.                                */
/* hook, DB'deki mevcut question ile karsilastirilir (batch'te yok).   */
/* ------------------------------------------------------------------ */

if (batch.kind === 'hook_only') {
  const seen = new Set();

  for (const [idx, item] of (batch.items ?? []).entries()) {
    const sid = item.story?.story_id;
    const label = `item[${idx}] story_id:${sid ?? '?'}`;
    if (sid == null) { err(label, '`story.story_id` zorunlu'); continue; }
    if (!existingStoryIds.has(sid)) { err(label, `story_id ${sid} DB'de yok`); continue; }

    for (const [l, d] of Object.entries(item.lang ?? {})) {
      const at = `${label} [${l}]`;
      if (!LANGS.includes(l)) { err(at, 'bilinmeyen dil kodu'); continue; }
      const h = String(d.hook ?? '').trim();
      if (!h) { err(at, '`hook` bos olamaz'); continue; }

      /* varyant alani sizmis mi — bu tur onlara dokunmamali */
      for (const f of ['punchline', 'thirty_sec', 'question', 'key_contrast', 'content']) {
        if (d[f] != null) err(at, `hook_only turunde \`${f}\` bulunamaz; mevcut veriyi bozar`);
      }

      const hw = countWords(h);
      if (hw < 8 || hw > 20) warn(at, `hook ${hw} kelime (tercih: 8-20)`);
      if (sentenceCount(h) > 2) warn(at, `hook ${sentenceCount(h)} cumle — reel acilisi icin uzun`);

      const q = existingQuestion.get(`${sid}|${l}`) ?? '';
      const same = (a, b) => a.trim().toLocaleLowerCase('tr') === (b ?? '').trim().toLocaleLowerCase('tr');
      if (q && same(h, q)) err(at, 'hook, DB\'deki question ile birebir ayni — karusel ayni metni iki kez gosterir');
      if (same(h, existingHook.get(`${sid}|${l}`))) err(at, 'hook DB\'dekiyle ayni — bu kayit batch\'te olmamali');
      if (HOOK_TEMPLATES.some((re) => re.test(h))) {
        err(at, `hook jenerik sablon kalibi tasiyor: "${h.slice(0, 60)}"`);
      }
      if (/\b(transformed|mindset|life-?changing|amazing|secret)\b/i.test(h) && l !== 'en') {
        err(at, `hook icinde Ingilizce kelime var (${l} metninde)`);
      }
      const key = `${l}|${h.toLocaleLowerCase('tr')}`;
      if (seen.has(key)) err(at, 'hook batch icinde tekrar ediyor');
      seen.add(key);
    }
  }
}

const punchlines = new Set();

for (const [idx, item] of (['marker_repair', 'content_fix', 'hook_only'].includes(batch.kind) ? [] : batch.items ?? []).entries()) {
  const label = `item[${idx}] ${item.story?.queue_title ?? item.lang?.tr?.title ?? '?'}`;

  /* --- kitap --- */
  const book = item.book ?? {};
  if (batch.kind !== 'variants_only') {
    if (book.list_no == null) err(label, '`book.list_no` zorunlu');
    else if (book.new && existingListNos.has(book.list_no)) {
      err(label, `book.new=true ama list_no ${book.list_no} DB'de zaten var`);
    } else if (!book.new && !existingListNos.has(book.list_no)) {
      err(label, `list_no ${book.list_no} DB'de yok; yeni kitapsa book.new=true olmali`);
    }
    if (book.new) {
      if (!book.author) err(label, 'yeni kitapta `book.author` zorunlu');
      if (book.category_id == null) err(label, 'yeni kitapta `book.category_id` zorunlu');
      for (const l of LANGS) {
        if (!book.titles?.[l]) err(label, `yeni kitapta \`book.titles.${l}\` zorunlu`);
      }
    }
  }

  /* --- hikaye metadatasi --- */
  const st = item.story ?? {};
  if (batch.kind === 'variants_only') {
    if (st.story_id == null) err(label, 'variants_only modunda `story.story_id` zorunlu');
    else if (!existingStoryIds.has(st.story_id)) err(label, `story_id ${st.story_id} DB'de yok`);
  } else {
    const cur = st.current_read_minutes;
    const pos = st.possible_read_minutes;
    if (![1, 3, 5].includes(cur)) err(label, `current_read_minutes 1/3/5 olmali (gelen: ${cur})`);
    if (![1, 3, 5].includes(pos)) err(label, `possible_read_minutes 1/3/5 olmali (gelen: ${pos})`);
    if (cur !== pos) err(label, `yeni hikayede mevcut ve olasi sure ayni olmali (${cur} != ${pos})`);
    if (!Array.isArray(st.sources) || st.sources.length < 2) {
      err(label, 'en az 2 bagimsiz kaynak URL\'si zorunlu (`story.sources`)');
    }
    if (st.verification_status !== 'verified') {
      err(label, "`story.verification_status` 'verified' olmali");
    }
    if (st.story_id == null && book.list_no != null) {
      const key = `${book.list_no}|${(item.lang?.tr?.title ?? '').toLocaleLowerCase('tr').trim()}`;
      if (existingTrTitles.has(key)) warn(label, 'ayni kitapta ayni tr basligi DB\'de zaten var — mukerrer olabilir');
    }
  }

  /* --- dil kapsami --- */
  const langs = item.lang ?? {};
  for (const l of LANGS) {
    if (!langs[l]) {
      err(label, `\`lang.${l}\` eksik — 4 dil zorunlu`);
      continue;
    }
    const d = langs[l];
    const at = `${label} [${l}]`;

    /* varyantlar — her modda zorunlu */
    for (const f of ['punchline', 'thirty_sec', 'question', 'key_contrast']) {
      if (!d[f] || !String(d[f]).trim()) err(at, `\`${f}\` bos olamaz`);
    }

    /* --- hook: reel/paylas karti acilisi ---
       Uygulamada karusel sirasi hook -> lesson -> quote -> reflection.
       hook, reflection sorusuyla ayni olursa karusel ayni metni iki kez gosterir.
       DB'deki 633 eski Almanca hook tam olarak sablon tuzagina dusmus
       ("Das hat mein Denken...", "Diese Lektion hat mich...") — o yuzden
       sablon tespiti zorunlu. */
    if (d.hook) {
      const h = String(d.hook).trim();
      const hw = countWords(h);
      if (hw < 8 || hw > 20) warn(at, `hook ${hw} kelime (tercih: 8-20)`);
      if (sentenceCount(h) > 2) warn(at, `hook ${sentenceCount(h)} cumle — reel acilisi icin uzun`);
      const same = (a, b) => (a ?? '').trim().toLocaleLowerCase('tr') === (b ?? '').trim().toLocaleLowerCase('tr');
      if (same(h, d.question)) {
        err(at, 'hook, question ile birebir ayni — karusel ayni metni iki kez gosterir');
      }
      if (same(h, d.punchline)) err(at, 'hook, punchline ile birebir ayni');
      if (HOOK_TEMPLATES.some((re) => re.test(h))) {
        err(at, `hook jenerik sablon kalibi tasiyor: "${h.slice(0, 60)}" — hikayeye ozgu olmali`);
      }
      if (/\b(transformed|mindset|life-?changing|amazing|secret|success)\b/i.test(h) && l !== 'en') {
        warn(at, `hook icinde Ingilizce kelime var (${l} metninde) — DB'de bu hata 50 kayitta mevcut`);
      }
    }

    if (d.punchline) {
      const w = countWords(d.punchline);
      if (w < 8 || w > 20) warn(at, `punchline ${w} kelime (tercih: 8-20)`);
      if (sentenceCount(d.punchline) > 1) err(at, 'punchline tek cumle olmali');
      if (/^(bu hikayenin|bu hikâyenin|the message of|el mensaje|die botschaft)/i.test(d.punchline.trim())) {
        err(at, 'punchline yapay giris kalibiyla basliyor');
      }
      const key = `${l}|${d.punchline.trim().toLocaleLowerCase('tr')}`;
      if (punchlines.has(key)) err(at, 'punchline batch icinde tekrar ediyor');
      punchlines.add(key);
    }
    if (d.thirty_sec) {
      const w = countWords(d.thirty_sec);
      if (w < 55 || w > 80) err(at, `thirty_sec ${w} kelime (zorunlu: 55-80)`);
      if (!/[.!?]\s*$/.test(d.thirty_sec.trim())) err(at, 'thirty_sec yarim cumleyle bitiyor');
      if (d.content && d.content.replace(/\s+/g, ' ').includes(d.thirty_sec.replace(/\s+/g, ' ').slice(0, 120))) {
        err(at, 'thirty_sec ana metinden birebir kopyalanmis');
      }
    }
    if (d.question) {
      const w = countWords(d.question);
      if (w < 8 || w > 22) warn(at, `question ${w} kelime (tercih: 8-22)`);
      if (!/\?\s*$/.test(d.question.trim())) err(at, 'question soru isaretiyle bitmeli');
    }
    if (d.key_contrast) {
      const w = countWords(d.key_contrast);
      if (w < 2 || w > 8) warn(at, `key_contrast ${w} kelime (tercih: 2-8)`);
      if (d.punchline && d.key_contrast.trim().toLocaleLowerCase('tr') === d.punchline.trim().toLocaleLowerCase('tr')) {
        err(at, 'key_contrast punchline ile ayni — ekranda gizlenir');
      }
    }
    /* varyantlar birbirini tekrar etmesin (hook dahil) */
    const vals = ['punchline', 'thirty_sec', 'question', 'key_contrast', 'hook']
      .map((f) => (d[f] ?? '').trim().toLocaleLowerCase('tr'))
      .filter(Boolean);
    if (new Set(vals).size !== vals.length) err(at, 'varyantlardan ikisi ayni metin');

    /* ana metin — yalnizca yeni hikayede */
    if (batch.kind === 'variants_only') continue;

    if (!d.title) err(at, '`title` zorunlu');
    if (!d.description) err(at, '`description` zorunlu (paylas kartinda kullanilir)');
    if (!d.content) {
      err(at, '`content` zorunlu');
      continue;
    }

    const spec = wordRange(st.possible_read_minutes ?? 1);
    const w = countWords(d.content);
    if (w < spec.min || w > spec.max) {
      err(at, `content ${w} kelime — ${st.possible_read_minutes} dk hedefi ${spec.min}-${spec.max}`);
    }

    /* --- paylas / sohbet isaretleri --- */
    const nEmph = countMarker(d.content, 'emphasis');
    const nLesson = countMarker(d.content, 'lesson');
    const nRefl = countMarker(d.content, 'reflection');
    if (nEmph < spec.emphasisMin || nEmph > spec.emphasisMax) {
      err(at, `##...## sayisi ${nEmph} — ${st.possible_read_minutes} dk icin ${spec.emphasisMin}-${spec.emphasisMax}`);
    }
    if (nLesson !== 1) err(at, `$$...$$ tam 1 olmali (gelen: ${nLesson}) — paylas kartindaki "ders" alani`);
    if (nRefl !== 1) err(at, `&&...&& tam 1 olmali (gelen: ${nRefl}) — paylas kartindaki "dusun" alani`);

    for (const [kind, list] of Object.entries({
      emphasis: extractMarker(d.content, 'emphasis'),
      lesson: extractMarker(d.content, 'lesson'),
      reflection: extractMarker(d.content, 'reflection'),
    })) {
      for (const t of list) {
        if (!t) err(at, `bos ${kind} blogu`);
        else if (countWords(t) > 40) warn(at, `${kind} blogu ${countWords(t)} kelime — paylas karti icin uzun`);
      }
    }
    const refl = extractMarker(d.content, 'reflection')[0];
    if (refl && !/\?\s*$/.test(refl)) err(at, '&&...&& blogu soru olmali');

    /* isaretler sona yigilmasin */
    const tail = d.content.slice(Math.floor(d.content.length * 0.75));
    const tailMarks = countMarker(tail, 'emphasis') + countMarker(tail, 'lesson') + countMarker(tail, 'reflection');
    if (nEmph + nLesson + nRefl >= 3 && tailMarks === nEmph + nLesson + nRefl) {
      warn(at, 'tum isaretler metnin son ceyregine yigilmis');
    }

    if (paragraphCount(d.content) < 3) warn(at, `${paragraphCount(d.content)} paragraf — okunabilirlik icin az`);
  }

  /* --- diller arasi tutarlilik --- */
  if (batch.kind !== 'variants_only' && LANGS.every((l) => langs[l]?.content)) {
    const nums = Object.fromEntries(LANGS.map((l) => [l, numberTokens(langs[l].content).join(',')]));
    const uniq = new Set(Object.values(nums));
    if (uniq.size > 1) {
      err(label, `diller arasi sayi/yil tutarsizligi — ${LANGS.map((l) => `${l}:[${nums[l]}]`).join(' ')}`);
    }
    const shapes = LANGS.map((l) => `${paragraphCount(langs[l].content)}/${sentenceCount(langs[l].content)}`);
    if (new Set(shapes).size === 1) {
      warn(label, `dort dilde paragraf/cumle yapisi birebir ayni (${shapes[0]}) — birebir ceviri olabilir, bagimsiz yazim dogrulanmali`);
    }
    for (const a of LANGS) {
      for (const b of LANGS) {
        if (a >= b) continue;
        const A = new Set(langs[a].content.toLowerCase().match(/\b[\p{L}]{6,}\b/gu) ?? []);
        const B = langs[b].content.toLowerCase().match(/\b[\p{L}]{6,}\b/gu) ?? [];
        if (!A.size || !B.length) continue;
        const shared = B.filter((t) => A.has(t)).length / B.length;
        if (shared > 0.5) warn(label, `${a}/${b} arasinda %${Math.round(shared * 100)} kelime ortakligi — kopyala-yapistir olabilir`);
      }
    }
  }
}

/* ------------------------------------------------------------------ */
/* Rapor                                                               */
/* ------------------------------------------------------------------ */

const ok = errors.length === 0;
const summary = {
  file,
  batch_id: batch.batch_id,
  kind: batch.kind,
  version: batch.version,
  items: batch.items?.length ?? 0,
  errors: errors.length,
  warnings: warnings.length,
  ok,
};

// DIKKAT: process.exit() yerine process.exitCode. Cikti buyuk oldugunda
// process.exit() stdout bufferini bosaltmadan cikar ve JSON yarim kalir.
if (asJson) {
  process.stdout.write(`${JSON.stringify({ ...summary, errorList: errors, warningList: warnings }, null, 2)}\n`);
  process.exitCode = ok ? 0 : 1;
} else {

const L = [];
L.push(`# Batch Dogrulama — ${batch.batch_id ?? '?'}`);
L.push('');
L.push(`- Dosya: \`${file}\``);
L.push(`- Tur: ${batch.kind} · Version: ${batch.version} · ${summary.items} kayit`);
L.push(`- Sonuc: **${ok ? 'GECTI' : 'BASARISIZ'}** — ${errors.length} hata, ${warnings.length} uyari`);
L.push('');
if (errors.length) {
  L.push(`## Hatalar (${errors.length}) — ingest engellenir`);
  L.push('');
  for (const e of errors) L.push(`- ❌ ${e}`);
  L.push('');
}
if (warnings.length) {
  L.push(`## Uyarilar (${warnings.length}) — insan karari`);
  L.push('');
  for (const w of warnings) L.push(`- ⚠ ${w}`);
  L.push('');
}
if (ok && !warnings.length) L.push('Tum kabul kriterleri gecti.');

  const out = L.join('\n');
  writeReport(`validate-${batch.batch_id ?? 'batch'}.md`, out);
  process.stdout.write(`${out}\n`);
  process.exitCode = ok ? 0 : 1;
}

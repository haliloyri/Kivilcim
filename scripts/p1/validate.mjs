#!/usr/bin/env node
// P1 story validator.
// Usage: node scripts/p1/validate.mjs <lang> [storyId ...]
//   Reads staging/p1/<lang>/<id>.md (all files when no id given) and prints
//   a report. Exit code 1 when any story has errors.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const SECTIONS = ['open', 'story', 'lessons', 'reflect', 'use', 'pocket'];
const PAIRS = ['##', '$$', '&&', '~~', '%%', '@@'];

// Word ranges per section. Turkish is agglutinative, so it needs fewer words.
// The story minimum is deliberately low: a short anecdote told faithfully beats padding.
const RANGES = {
  en: { open: [35, 90], story: [280, 700], lessons: [140, 300], reflect: [50, 160], use: [80, 240], pocket: [4, 22] },
  es: { open: [35, 95], story: [300, 740], lessons: [150, 320], reflect: [50, 170], use: [80, 250], pocket: [4, 24] },
  de: { open: [30, 90], story: [270, 680], lessons: [130, 290], reflect: [45, 155], use: [75, 230], pocket: [4, 22] },
  tr: { open: [30, 75], story: [230, 560], lessons: [110, 240], reflect: [40, 130], use: [70, 190], pocket: [3, 18] },
};

// Phrases that make text read as machine-written or padded. Case-insensitive.
const BANNED = {
  en: [
    'delve', 'tapestry', "in today's fast-paced world", 'in today’s fast-paced world', 'it is important to note',
    "it's important to note", 'it’s important to note', 'in conclusion', 'navigate the complexities', 'a testament to',
    'unlock the power', 'embark on a journey', 'let that sink in', 'game-changer', 'at the end of the day',
    'not a mechanical recipe', 'a single case does not prove',
  ],
  tr: [
    'günümüz dünyasında', 'unutmayın ki', 'unutmamak gerekir', 'sonuç olarak', 'mekanik bir reçete',
    'tek bir karakter özelliğiyle', 'tek bir kişilik özelliğiyle', 'kahramanı taklit etmek',
  ],
  es: ['en el mundo actual', 'en conclusión', 'es importante destacar', 'cabe destacar', 'sumergirnos'],
  de: ['in der heutigen schnelllebigen welt', 'zusammenfassend lässt sich sagen', 'es ist wichtig zu beachten', 'eintauchen'],
};

const words = (s) => s.replace(/[*#$&%@~>\-•]/g, ' ').split(/\s+/).filter(Boolean).length;

export const validateP1 = (text, lang) => {
  const errors = [];
  const warnings = [];
  const lines = text.replace(/\r\n?/g, '\n').split('\n');

  // Sections: all present, once, in order.
  const found = [];
  lines.forEach((l) => {
    const m = /^\s*\[\[(\w+)\]\]\s*$/.exec(l);
    if (m) found.push(m[1]);
  });
  const unknown = found.filter((s) => !SECTIONS.includes(s));
  if (unknown.length) errors.push(`unknown section tags: ${unknown.join(', ')}`);
  if (found.join(',') !== SECTIONS.join(',')) errors.push(`sections must be exactly ${SECTIONS.join(' → ')}; got ${found.join(' → ') || 'none'}`);

  // Split text by section.
  const bySection = {};
  let cur = null;
  lines.forEach((l) => {
    const m = /^\s*\[\[(\w+)\]\]\s*$/.exec(l);
    if (m) { cur = m[1]; bySection[cur] = []; return; }
    if (cur) bySection[cur].push(l);
  });
  const sectionText = Object.fromEntries(Object.entries(bySection).map(([k, v]) => [k, v.join('\n').trim()]));

  // Paired markers balanced.
  PAIRS.forEach((m) => {
    const n = text.split(m).length - 1;
    if (n % 2 !== 0) errors.push(`unbalanced marker ${m} (${n})`);
  });
  const boldCount = (text.match(/\*\*/g) || []).length;
  if (boldCount % 2 !== 0) errors.push('unbalanced ** (bold)');

  const count = (re, s = text) => (s.match(re) || []).length;
  const lessons = count(/\$\$[\s\S]*?\$\$/g, sectionText.lessons || '');
  if (lessons < 2 || lessons > 3) errors.push(`lessons: expected 2–3 $$ cards, got ${lessons}`);
  if (count(/\$\$\*\*[^*]+\*\*/g, sectionText.lessons || '') !== lessons) errors.push('every lesson must start with a **bold title**');
  const USE_CONTEXTS = ['meeting', 'oneonone', 'family', 'social', 'self'];
  const uses = count(/%%[\s\S]*?%%/g, sectionText.use || '');
  if (uses !== 3) errors.push(`use: expected exactly 3 %% cards, got ${uses}`);
  [...(sectionText.use || '').matchAll(/%%([\s\S]*?)%%/g)].forEach((m) => {
    const body = m[1];
    if (!body.includes('::')) errors.push(`use card without "::" separator: ${body.slice(0, 50)}…`);
    const ctxMatch = /^\s*context:([a-z0-9]+)\s*\|/i.exec(body);
    if (!ctxMatch) errors.push(`use card missing "context:<${USE_CONTEXTS.join('|')}> | " prefix: ${body.slice(0, 50)}…`);
    else if (!USE_CONTEXTS.includes(ctxMatch[1].toLowerCase())) errors.push(`use card has unknown context "${ctxMatch[1]}" (allowed: ${USE_CONTEXTS.join(', ')})`);
  });
  if (count(/@@[\s\S]*?@@/g) !== 1) errors.push('exactly one @@pocket@@ line required');
  if (count(/@@[\s\S]*?@@/g, sectionText.pocket || '') !== 1) errors.push('@@pocket@@ must be inside [[pocket]]');
  if (count(/&&[\s\S]*?&&/g) !== 1) errors.push('exactly one &&reflection&& required');
  if (count(/&&[\s\S]*?&&/g, sectionText.reflect || '') !== 1) errors.push('&&reflection&& must be inside [[reflect]]');
  if (count(/##[\s\S]*?##/g) > 1) errors.push('at most one ##highlight##');
  const bullets = count(/^\s*- /gm, sectionText.reflect || '');
  if (bullets < 2 || bullets > 5) warnings.push(`reflect: 2–5 bullets recommended, got ${bullets}`);

  // Lengths.
  const range = RANGES[lang] || RANGES.en;
  Object.entries(range).forEach(([sec, [min, max]]) => {
    const n = words(sectionText[sec] || '');
    if (n < min || n > max) (sec === 'pocket' || sec === 'story' ? errors : warnings)
      .push(`${sec}: ${n} words (target ${min}–${max})`);
  });

  // Repetition: identical paragraphs.
  const paras = text.split(/\n\s*\n/).map((p) => p.trim()).filter((p) => p.length > 40);
  const dup = paras.filter((p, i) => paras.indexOf(p) !== i);
  if (dup.length) errors.push(`repeated paragraph(s): ${dup.length}`);

  // Banned phrases.
  const lower = text.toLowerCase();
  (BANNED[lang] || []).forEach((b) => { if (lower.includes(b)) errors.push(`banned phrase: "${b}"`); });

  // Em-dash density (a common machine-writing tell in English).
  if (lang === 'en') {
    const dashes = count(/—/g);
    const per1000 = (dashes / Math.max(1, words(text))) * 1000;
    if (per1000 > 4) warnings.push(`em-dash density ${per1000.toFixed(1)}/1000 words (keep ≤ 4)`);
  }

  return { errors, warnings, words: words(text) };
};

const main = () => {
  const [lang, ...ids] = process.argv.slice(2);
  if (!lang) {
    console.error('usage: node scripts/p1/validate.mjs <lang> [storyId ...]');
    process.exit(2);
  }
  const dir = path.join(ROOT, 'staging/p1', lang);
  const files = ids.length ? ids.map((id) => `${id}.md`) : fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
  let failed = 0;
  files.forEach((f) => {
    const text = fs.readFileSync(path.join(dir, f), 'utf8');
    const { errors, warnings, words: n } = validateP1(text, lang);
    const status = errors.length ? 'FAIL' : 'OK  ';
    if (errors.length) failed += 1;
    console.log(`${status} ${lang}/${f} (${n} words)`);
    errors.forEach((e) => console.log(`   ✗ ${e}`));
    warnings.forEach((w) => console.log(`   ! ${w}`));
  });
  console.log(`\n${files.length - failed}/${files.length} passed`);
  process.exit(failed ? 1 : 0);
};

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();

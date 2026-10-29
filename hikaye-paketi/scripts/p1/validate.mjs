#!/usr/bin/env node
// P1 story validator.
// Usage: node scripts/p1/validate.mjs <lang> [storyId ...]
//   Reads staging/p1/<lang>/<id>.md (all files when no id given) and prints
//   a report. Exit code 1 when any story has errors.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { scanAiTells } from './ai-tells.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const SECTIONS = ['open', 'story', 'lessons', 'reflect', 'use', 'pocket'];
const PAIRS = ['##', '$$', '&&', '~~', '%%', '@@'];

// Target word ranges per section (3–5 minute read; story carries >= 55%).
// Turkish is agglutinative, so it needs fewer words. Keep in sync with
// batch/05-submit-stories.mjs (LANG_CONFIG.len). Outside the target = warning.
const RANGES = {
  en: { open: [40, 80], story: [340, 520], lessons: [100, 180], reflect: [40, 90], use: [70, 150], pocket: [4, 22] },
  es: { open: [43, 86], story: [365, 555], lessons: [107, 193], reflect: [43, 96], use: [75, 160], pocket: [4, 24] },
  de: { open: [38, 77], story: [325, 500], lessons: [96, 173], reflect: [38, 86], use: [67, 144], pocket: [4, 22] },
  tr: { open: [32, 64], story: [270, 415], lessons: [80, 145], reflect: [32, 72], use: [56, 120], pocket: [3, 18] },
};
// Hard story limits (error). Deliberately wide: a short anecdote told
// faithfully beats padding, and older entries were written to wider ranges.
const STORY_HARD = {
  en: [280, 700], es: [300, 740], de: [270, 680], tr: [230, 560],
};
// Whole-entry word target (about 3–5 minutes of reading).
const TOTAL = { en: [600, 1000], es: [650, 1070], de: [580, 960], tr: [480, 800] };

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

// Announcer-style transitions: warning only (older entries use them).
const SOFT_BANNED = {
  en: ['here is the catch', "here's the catch", 'then something striking happened', 'what happened next surprised'],
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
    if (n < min || n > max) {
      const [hmin, hmax] = sec === 'story' ? (STORY_HARD[lang] || STORY_HARD.en) : [min, max];
      const hard = sec === 'pocket' || (sec === 'story' && (n < hmin || n > hmax));
      (hard ? errors : warnings).push(`${sec}: ${n} words (target ${min}–${max})`);
    }
  });
  const [tmin, tmax] = TOTAL[lang] || TOTAL.en;
  const totalWords = words(text);
  if (totalWords < tmin || totalWords > tmax) warnings.push(`total: ${totalWords} words (3–5 min target ${tmin}–${tmax})`);
  if (words(sectionText.story || '') < totalWords * 0.5) warnings.push('story is under 50% of the entry; trim lessons/reflect/use');

  // "Not X. It's Y." contrast pattern (English): at most one.
  if (lang === 'en') {
    const contrast = count(/\b(?:isn't|aren't|wasn't|weren't|doesn't|didn't|not)\b[^.!?\n]{0,80}[.!?]\s+(?:It's|It is|They're|That's|That was|It was|He|She|They)\b/g);
    if (contrast > 1) warnings.push(`"not X. It's Y." pattern ×${contrast} (keep ≤ 1)`);
  }

  // Repetition: identical paragraphs.
  const paras = text.split(/\n\s*\n/).map((p) => p.trim()).filter((p) => p.length > 40);
  const dup = paras.filter((p, i) => paras.indexOf(p) !== i);
  if (dup.length) errors.push(`repeated paragraph(s): ${dup.length}`);

  // Banned phrases.
  const lower = text.toLowerCase();
  (BANNED[lang] || []).forEach((b) => { if (lower.includes(b)) errors.push(`banned phrase: "${b}"`); });
  (SOFT_BANNED[lang] || []).forEach((b) => { if (lower.includes(b)) warnings.push(`announcer phrase: "${b}"`); });

  // Em-dash density (a common machine-writing tell in English).
  if (lang === 'en') {
    const dashes = count(/—/g);
    const per1000 = (dashes / Math.max(1, words(text))) * 1000;
    if (per1000 > 4 || dashes > 2) warnings.push(`em-dash ×${dashes} (${per1000.toFixed(1)}/1000 words; keep ≤ 2)`);
  }

  // AI-writing tells (humanizer-derived rules, see ai-tells.mjs).
  const ai = scanAiTells(text, lang);
  errors.push(...ai.errors);
  warnings.push(...ai.warnings);

  return { errors, warnings, words: words(text), aiScore: ai.per100 };
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

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

// All length targets, banned phrases and hard limits live in lang-config.mjs so
// the prompts, the validator and the docs can never disagree again.
import {
  RANGES, LEGACY_RANGES, STORY_HARD, TOTAL, STORY_SHARE, LESSON_SENTENCES,
  SEMICOLON_MAX, BANNED, SOFT_BANNED, META_IN_STORY,
} from './lang-config.mjs';

const words = (s) => s.replace(/[*#$&%@~>\-•]/g, ' ').split(/\s+/).filter(Boolean).length;

// Two formats coexist in the catalogue:
//   p1v2   — reading-page redesign (2026-10-28): exactly ONE lesson, ONE question.
//   legacy — 2–3 lesson cards and a bulleted reflect block.
// Detected per file, so the existing catalogue keeps passing while every new
// story is held to the redesign.
export const detectFormat = (sectionText) => {
  const lessons = ((sectionText.lessons || '').match(/\$\$/g) || []).length / 2;
  if (lessons === 1) return 'p1v2';
  if (lessons >= 2 && lessons <= 3) return 'legacy';
  return 'unknown';
};

const sentences = (s) => s.replace(/\s+/g, ' ')
  .split(/(?<=[.!?…])\s+/).map((x) => x.trim())
  .filter((x) => x.split(/\s+/).length >= 2);

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
  const format = detectFormat(sectionText);

  // Paired markers balanced.
  PAIRS.forEach((m) => {
    const n = text.split(m).length - 1;
    if (n % 2 !== 0) errors.push(`unbalanced marker ${m} (${n})`);
  });
  const boldCount = (text.match(/\*\*/g) || []).length;
  if (boldCount % 2 !== 0) errors.push('unbalanced ** (bold)');

  const count = (re, s = text) => (s.match(re) || []).length;
  const lessons = count(/\$\$[\s\S]*?\$\$/g, sectionText.lessons || '');
  if (format === 'unknown') errors.push(`lessons: expected 1 $$ card (new format) or 2–3 (legacy), got ${lessons}`);
  if (format === 'legacy' && (lessons < 2 || lessons > 3)) errors.push(`lessons: expected 2–3 $$ cards (legacy), got ${lessons}`);
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
  if (count(/~~[\s\S]*?~~/g) > 1) warnings.push('more than one ~~contrast~~ block (rarely needed)');

  // Reflection: the redesign wants ONE question, no bullets.
  const reflectText = sectionText.reflect || '';
  const bullets = count(/^\s*- /gm, reflectText);
  const qMarks = (reflectText.match(/\?/g) || []).length;
  if (format === 'p1v2') {
    if (bullets) errors.push(`reflect: new format holds one &&question&& only; found ${bullets} bullet(s)`);
    if (qMarks !== 1) errors.push(`reflect: exactly one question mark expected, found ${qMarks}`);
    if (sentences(reflectText.replace(/&/g, '')).length > 1) warnings.push('reflect: more than one sentence; ask a single question');
    if (lang === 'tr' && /\b(mi|mı|mu|mü)\s*,\s*[^?]*\b(ne|neydi|nasıl|neden|niçin|hangi|kim|nerede|kaç)\b[^?]*\?/i.test(reflectText)) {
      warnings.push('reflect: a second question hides after the comma; keep one question');
    }
    const body = (sectionText.lessons || '').replace(/\$\$/g, '').replace(/\*\*[^*]+\*\*/g, '');
    const [smin, smax] = LESSON_SENTENCES;
    const lessonSentences = sentences(body).length;
    if (lessonSentences < smin || lessonSentences > smax) warnings.push(`lesson: ${lessonSentences} sentences (want ${smin}–${smax}: principle, everyday example, what it enables)`);
    const title = /\$\$\s*\*\*([^*]+)\*\*/.exec(sectionText.lessons || '');
    if (title && /\b(değil|değildir|not a|isn't|no es|kein)\b/i.test(title[1])) warnings.push(`lesson title is an "X is not Y" aphorism: "${title[1].trim()}"`);
  } else if (bullets && (bullets < 2 || bullets > 5)) {
    warnings.push(`reflect: 2–5 bullets recommended, got ${bullets}`);
  }

  // Lengths: p1v2 targets, with the legacy lesson/reflect ranges for old entries.
  const range = { ...(RANGES[lang] || RANGES.en), ...(format === 'legacy' ? (LEGACY_RANGES[lang] || LEGACY_RANGES.en) : {}) };
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
  // p1v2 asks for 55%; legacy entries were written to the old 50% bar.
  const shareTarget = format === 'p1v2' ? STORY_SHARE : 0.5;
  if (words(sectionText.story || '') < totalWords * shareTarget) {
    const share = (words(sectionText.story || '') / Math.max(1, totalWords)) * 100;
    warnings.push(`story is ${share.toFixed(1)}% of the entry (want ≥ ${(shareTarget * 100).toFixed(0)}%); trim lessons/reflect/use`);
  }

  // [[open]] is a hook, not a citation: no year and no book title in italics.
  const openText = sectionText.open || '';
  const openCite = [];
  if (/\b(1[5-9]\d{2}|20\d{2})\b/.test(openText)) openCite.push('a year');
  if (/\*[^*\n]+\*/.test(openText)) openCite.push('an italic book title');
  if (openCite.length) {
    (format === 'p1v2' ? errors : warnings).push(`open cites ${openCite.join(' and ')}; start inside the scene and keep the citation for [[story]]`);
  }

  // Story must tell the story, not talk about the writing.
  const storyText = sectionText.story || '';
  (META_IN_STORY[lang] || []).forEach((m) => {
    if (storyText.toLowerCase().includes(m)) {
      (format === 'p1v2' ? errors : warnings).push(`story discusses the writing: "${m}" (an illustration belongs in [[lessons]])`);
    }
  });

  if (lang === 'tr') {
    const semi = count(/;/g);
    if (semi > SEMICOLON_MAX) warnings.push(`Turkish: ${semi} semicolons (keep ≤ ${SEMICOLON_MAX})`);
    const degil = count(/\bdeğil\b/gi);
    if (degil > 3) warnings.push(`"değil" ×${degil}: the "not X but Y" move keeps repeating`);
  }

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

  // Em-dash density: at most 2 in the whole entry, in every language.
  {
    const dashes = count(/—/g);
    if (dashes > 2) warnings.push(`em-dash ×${dashes} (keep ≤ 2 in the whole entry)`);
  }

  // AI-writing tells (humanizer-derived rules, see ai-tells.mjs).
  const ai = scanAiTells(text, lang);
  errors.push(...ai.errors);
  warnings.push(...ai.warnings);

  const counts = Object.fromEntries(SECTIONS.map((s) => [s, words(sectionText[s] || '')]));
  return { errors, warnings: [...new Set(warnings)], words: words(text), counts, aiScore: ai.per100, format };
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

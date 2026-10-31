#!/usr/bin/env node
// Model / prompt comparison scorecard for P1 stories.
//
// Runs the real validator and AI-tell scanner on one or more model folders and
// prints the numbers that actually differ between two drafts: length targets,
// story share, rhythm (sentence-length variation), aphorism endings, AI tells,
// semicolons and hard errors. It never writes or edits a story file.
//
// Usage:
//   node scripts/p1/score-models.mjs tr staging/p1-claude/tr staging/p1-argon/tr --ids 1783
//   node scripts/p1/score-models.mjs tr staging/p1-claude/tr staging/p1-argon/tr --md
//
// The composite "clean" score is a machine heuristic, not a taste judgement:
//   10 − 1.5·errors − 0.2·warnings − 1 (if AI-tell score ≥ 0.7), floored at 0.
import fs from 'node:fs';
import path from 'node:path';
import { validateP1 } from './validate.mjs';
import { scanAiTells } from './ai-tells.mjs';
import { RANGES, TOTAL, VOICE } from './lang-config.mjs';

const args = process.argv.slice(2);
const idsIdx = args.indexOf('--ids');
const onlyIds = idsIdx !== -1 ? args[idsIdx + 1].split(',').filter(Boolean) : [];
const md = args.includes('--md');
const rest = args.filter((_, i) => idsIdx === -1 || (i !== idsIdx && i !== idsIdx + 1)).filter((a) => a !== '--md');
const [lang, ...dirs] = rest;
if (!lang || !dirs.length) {
  console.error('usage: node scripts/p1/score-models.mjs <lang> <dir> [<dir> ...] [--ids 1,2] [--md]');
  process.exit(2);
}

const wc = (s) => s.replace(/[*#$&%@~>•|:;]/g, ' ').split(/\s+/).filter(Boolean).length;
const strip = (s) => s.replace(/^\[\[\w+\]\]\s*$/gm, '')
  .replace(/%%context:\w+\s*\|/g, '')
  .replace(/(\$\$|##|&&|@@|%%|~~|\*\*|::)/g, ' ')
  .replace(/^\s*-\s+/gm, '')
  .replace(/\s+/g, ' ').trim();
const section = (text, name) => {
  const m = new RegExp(`\\[\\[${name}\\]\\]\\s*\\n([\\s\\S]*?)(?=\\n\\s*\\[\\[\\w+\\]\\]\\s*\\n|$)`).exec(text);
  return m ? m[1].trim() : '';
};
const sentences = (s) => s.replace(/\s+/g, ' ').split(/(?<=[.!?…])\s+/).map((x) => x.trim()).filter((x) => x.split(/\s+/).length >= 2);

const voiceStats = (text) => {
  const story = strip(section(text, 'story'));
  const lens = sentences(story).map((s) => s.split(/\s+/).length);
  const mean = lens.reduce((a, b) => a + b, 0) / Math.max(1, lens.length);
  const sd = Math.sqrt(lens.reduce((a, b) => a + (b - mean) ** 2, 0) / Math.max(1, lens.length));
  const paras = section(text, 'story').split(/\n\s*\n/).map(strip).filter((p) => wc(p) >= 12);
  const aphorismEnds = paras.filter((p) => {
    const ss = sentences(p);
    return ss.length >= 2 && ss[ss.length - 1].split(/\s+/).length <= 7;
  }).length;
  const longSents = lens.filter((n) => n >= VOICE.longMin).length;
  const shortSents = lens.filter((n) => n <= VOICE.shortMax).length;
  return {
    mean: mean || 0,
    cv: mean ? sd / mean : 0,
    aphorismEnds,
    paras: paras.length,
    longSents,
    shortSents,
  };
};

const rowFor = (dir, id) => {
  const mdPath = path.join(dir, `${id}.md`);
  if (!fs.existsSync(mdPath)) return null;
  const text = fs.readFileSync(mdPath, 'utf8');
  const vPath = path.join(dir, `${id}.variants.json`);
  const variants = fs.existsSync(vPath) ? fs.readFileSync(vPath, 'utf8') : '';
  const v = validateP1(text, lang);
  const ai = scanAiTells(text, lang, variants);
  // Use the validator's own counts so the scorecard and the validator agree.
  const storyWords = v.counts.story;
  const total = v.counts.total || v.words;
  const vs = voiceStats(text);
  const lessonWords = v.counts.lessons;
  const reflectWords = v.counts.reflect;
  const reflectQ = (section(text, 'reflect').match(/\?/g) || []).length;
  const clean = Math.max(0, 10 - v.errors.length * 1.5 - Math.min(3, v.warnings.length * 0.15) - (ai.per100 >= 0.7 ? 1 : 0));
  return {
    id,
    model: path.basename(dir) === lang ? path.basename(path.dirname(dir)) : path.basename(dir),
    format: v.format,
    total,
    story: storyWords,
    share: total ? (storyWords / total) * 100 : 0,
    lesson: lessonWords,
    reflect: reflectWords,
    reflectQ,
    ai: ai.per100,
    cv: vs.cv,
    aph: vs.aphorismEnds,
    paras: vs.paras,
    errors: v.errors.length,
    warnings: v.warnings.length,
    clean,
    inRange: total >= (TOTAL[lang] || TOTAL.en)[0] && total <= (TOTAL[lang] || TOTAL.en)[1]
      && storyWords >= (RANGES[lang] || RANGES.en).story[0] - 40,
  };
};

const ids = onlyIds.length
  ? onlyIds
  : [...new Set(dirs.flatMap((d) => fs.readdirSync(d).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''))))];

const rows = [];
for (const id of ids) {
  for (const dir of dirs) {
    const r = rowFor(dir, id);
    if (r) rows.push(r);
  }
}

if (!rows.length) { console.error('No matching .md files.'); process.exit(1); }

const fmt = (r) => {
  if (md) {
    return `| ${r.id} | ${r.model} | ${r.format} | ${r.total} | ${r.story} | ${r.share.toFixed(0)}% | ${r.lesson} | ${r.reflect}${r.reflectQ > 1 ? ' ⚠' : ''} | ${r.ai.toFixed(2)} | ${r.cv.toFixed(2)} | ${r.aph}/${r.paras} | ${r.errors} | ${r.warnings} | ${r.clean.toFixed(1)} |`;
  }
  const cells = [r.id, r.model, r.format, r.total, r.story, `${r.share.toFixed(0)}%`, r.lesson, `${r.reflect}${r.reflectQ > 1 ? '(!)' : ''}`, r.ai.toFixed(2), r.cv.toFixed(2), `${r.aph}/${r.paras}`, r.errors, r.warnings, r.clean.toFixed(1)];
  return cells.map((c, i) => String(c).padEnd([6, 14, 8, 5, 5, 5, 5, 7, 5, 5, 6, 4, 4, 5][i])).join(' ');
};

if (md) {
  console.log('| id | model | format | kelime | story | pay | ders | soru | AI-tell | ritim cv | özdeyiş | hata | uyarı | skor |');
  console.log('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
} else {
  console.log(['id'.padEnd(6), 'model'.padEnd(14), 'format'.padEnd(8), 'total'.padEnd(5), 'story'.padEnd(5), 'share'.padEnd(5), 'lesson'.padEnd(5), 'soru'.padEnd(7), 'ai'.padEnd(5), 'rhythm'.padEnd(5), 'aph'.padEnd(6), 'err'.padEnd(4), 'warn'.padEnd(4), 'clean'].join(' '));
}
rows.forEach((r) => console.log(fmt(r)));

console.log('\nHedefler (lang-config.mjs):', `toplam ${TOTAL[lang].join('–')}`, '| hikâye', (RANGES[lang]).story.join('–'), '| ders', RANGES[lang].lessons.join('–'), '| soru', RANGES[lang].reflect.join('–'), '| ritim cv ≥ 0.45');
console.log('Ritim cv = cümle uzunluğu değişkenliği (sd/mean). Özdeyiş = paragrafı ≤7 kelimeyle biten paragraf sayısı.');
console.log('"clean" otomatik bir temizlik puanıdır (hata/uyarı/AI-tell); zevk ya da sadakat yargısı değildir — onu sen puanla.');

const byModel = {};
rows.forEach((r) => { (byModel[r.model] ||= []).push(r); });
console.log('\nÖzet:');
for (const [model, list] of Object.entries(byModel)) {
  const avg = (k) => list.reduce((a, r) => a + r[k], 0) / list.length;
  console.log(`  ${model.padEnd(16)} n=${list.length}  clean=${avg('clean').toFixed(1)}  ai=${avg('ai').toFixed(2)}  cv=${avg('cv').toFixed(2)}  özdeyiş=${(avg('aph')).toFixed(1)}  kelime=${avg('total').toFixed(0)}  hata=${avg('errors').toFixed(1)}`);
}
process.exit(0);

#!/usr/bin/env node
// Turns predictions.<name>.jsonl into the two deliverables of Öncelik 1:
//   reels-ranking.csv  every story ranked for the video pipeline (best first)
//   themes.csv         primary + secondary theme per story, plus per-theme counts in the console
//   tags.json          the same data machine-readable, keyed by story_id (for Yolum / home / search later)
// The ranking uses Laya's expected level per score (finer than the 1-5 argmax); falls back to argmax.
// Nothing is written to the DB.
// Usage:
//   node scripts/tagging/build-outputs.mjs                     set "full", predictions.laya.jsonl
//   node scripts/tagging/build-outputs.mjs --set gold --pred laya
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { TAG_DIR, SCORE_KEYS, THEMES, REELS_WEIGHTS, reelsScore, toCsv } from './schema.mjs';

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(`--${name}`); return i !== -1 ? args[i + 1] : def; };
const set = opt('set', 'full');
const name = opt('pred', 'laya');
const dir = resolve(TAG_DIR, set);

const stories = new Map(JSON.parse(readFileSync(resolve(dir, 'sample.json'), 'utf8')).stories.map((s) => [s.story_id, s]));
const preds = new Map();
for (const line of readFileSync(resolve(dir, `predictions.${name}.jsonl`), 'utf8').split('\n').filter(Boolean)) {
  const r = JSON.parse(line);
  if (!r.error) preds.set(r.story_id, r);
}

const r2 = (x) => Math.round(x * 100) / 100;
const rows = [...preds.values()].map((p) => {
  const s = stories.get(p.story_id);
  const fine = Object.fromEntries(SCORE_KEYS.map((k) => [k, p.expected?.[k] ?? p[k]]));
  const themeP = p.probs?.primary_theme ?? {};
  return {
    story_id: p.story_id,
    title: s?.title ?? '?',
    book: s?.book_title ?? '?',
    category: s?.category ?? '?',
    words: s?.words ?? '',
    reels_score: r2(reelsScore(fine)),
    ...Object.fromEntries(SCORE_KEYS.map((k) => [k, p[k]])),
    primary_theme: p.primary_theme,
    primary_theme_tr: THEMES[p.primary_theme]?.tr ?? '',
    theme_confidence: themeP[p.primary_theme] ?? '',
    secondary_themes: p.secondary_themes.join(';'),
  };
});

rows.sort((a, b) => b.reels_score - a.reels_score || a.story_id - b.story_id);
rows.forEach((r, i) => { r.rank = i + 1; });

writeFileSync(resolve(dir, 'reels-ranking.csv'), toCsv(
  ['rank', 'story_id', 'title', 'book', 'category', 'words', 'reels_score', ...SCORE_KEYS, 'primary_theme'], rows));
writeFileSync(resolve(dir, 'themes.csv'), toCsv(
  ['story_id', 'title', 'book', 'category', 'primary_theme', 'primary_theme_tr', 'theme_confidence', 'secondary_themes'],
  [...rows].sort((a, b) => a.story_id - b.story_id)));
writeFileSync(resolve(dir, 'tags.json'), JSON.stringify({
  model: name,
  weights: REELS_WEIGHTS,
  created: new Date().toISOString(),
  stories: Object.fromEntries([...rows].sort((a, b) => a.story_id - b.story_id).map((r) => [r.story_id, {
    reels_score: r.reels_score, rank: r.rank,
    ...Object.fromEntries(SCORE_KEYS.map((k) => [k, r[k]])),
    primary_theme: r.primary_theme, secondary_themes: r.secondary_themes ? r.secondary_themes.split(';') : [],
  }])),
}, null, 2));

const count = (key) => rows.reduce((m, r) => m.set(r[key], (m.get(r[key]) ?? 0) + 1), new Map());
console.log(`${rows.length} hikâye (${stories.size - rows.length} tahminsiz) -> ${dir}`);
for (const k of SCORE_KEYS) console.log(`${k}: ${[...count(k)].sort((a, b) => a[0] - b[0]).map(([v, n]) => `${v}=${n}`).join(' ')}`);
console.log('\nAna temalar:');
console.log([...count('primary_theme')].sort((a, b) => b[1] - a[1]).map(([t, n]) => `  ${t}: ${n}`).join('\n'));
console.log('\nReels ilk 10:');
console.log(rows.slice(0, 10).map((r) => `  ${r.rank}. [${r.story_id}] ${r.reels_score} ${r.title}`).join('\n'));

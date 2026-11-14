#!/usr/bin/env node
// Picks a stratified, reproducible sample of stories for hand-labelling and writes the labelling kit.
// Reads assets/albor.db read-only. Output: staging/tagging/<set>/
//   sample.json    story data (input for the model runner)
//   labels.csv     empty label sheet to fill by hand (never overwritten unless --force)
//   reading.md     full texts to read while labelling
//   prompts.jsonl  one {story_id, system, user} line per story, for a chat model
//   laya-questions.json  typed questions for Laya (scripts/tagging/run-laya.py)
// Usage:
//   node scripts/tagging/export-sample.mjs                       80 stories, tr, seed 1, set "gold"
//   node scripts/tagging/export-sample.mjs --n 100 --seed 7
//   node scripts/tagging/export-sample.mjs --n 300 --seed 2 --set train --exclude gold   fine-tune set, no overlap with gold
//   node scripts/tagging/export-sample.mjs --all --set full      every story (for the full run, no labels.csv)
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { openDb, rows, countWords, ensureDir } from '../story-pipeline/lib/store.mjs';
import {
  TAG_DIR, SCHEMA_VERSION, SCORE_KEYS, THEMES, WORDS_PER_SEC, LAYA_QUESTIONS,
  buildSystemPrompt, buildUserPrompt, toCsv,
} from './schema.mjs';

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(`--${name}`); return i !== -1 ? args[i + 1] : def; };
const n = Number(opt('n', 80));
const seed = Number(opt('seed', 1));
const lang = opt('lang', 'tr');
const all = args.includes('--all');
const set = opt('set', all ? 'full' : 'gold');
const force = args.includes('--force');
const exclude = (opt('exclude', '') || '').split(',').filter(Boolean);

// mulberry32: small seeded PRNG so the same seed always gives the same sample.
function rng(a) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const shuffle = (list, rand) => {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};

const db = await openDb();
let stories;
try {
  stories = rows(db, `SELECT s.id story_id, CAST(s.version AS TEXT) version,
                             COALESCE(bt.category_name, '?') category, COALESCE(bt.title, '?') book_title,
                             COALESCE(b.author, '?') author, st.title, COALESCE(st.hook, '') opening_hook, CAST(st.content AS TEXT) content
                        FROM stories s
                        JOIN story_translations st ON st.story_id = s.id AND st.lang_code = ?
                        LEFT JOIN books b ON b.list_no = s.book_no
                        LEFT JOIN book_translations bt ON bt.book_id = b.id AND bt.lang_code = ?
                       WHERE st.content IS NOT NULL AND st.content <> ''
                       ORDER BY s.id`, [lang, lang]);
} finally {
  db.close();
}

// Ids already in other sets (e.g. the gold evaluation set) are never picked again.
const excluded = new Set(exclude.flatMap((name) =>
  JSON.parse(readFileSync(resolve(TAG_DIR, name, 'sample.json'), 'utf8')).stories.map((s) => s.story_id)));
if (excluded.size) stories = stories.filter((s) => !excluded.has(s.story_id));

for (const s of stories) {
  s.words = countWords(s.content);
  s.est_sec = Math.round(s.words / (WORDS_PER_SEC[lang] ?? 2));
}

let picked = stories;
if (!all) {
  // Proportional allocation per book category (min 1 each), then seeded pick inside each category.
  const rand = rng(seed);
  const byCat = new Map();
  for (const s of stories) (byCat.get(s.category) ?? byCat.set(s.category, []).get(s.category)).push(s);
  const quota = new Map([...byCat].map(([c, list]) => [c, Math.max(1, Math.round((n * list.length) / stories.length))]));
  let total = [...quota.values()].reduce((a, b) => a + b, 0);
  const bySize = [...byCat.keys()].sort((a, b) => byCat.get(b).length - byCat.get(a).length);
  for (let i = 0; total !== n && i < 1000; i++) {
    const c = bySize[i % bySize.length];
    if (total > n && quota.get(c) > 1) { quota.set(c, quota.get(c) - 1); total--; }
    else if (total < n && quota.get(c) < byCat.get(c).length) { quota.set(c, quota.get(c) + 1); total++; }
  }
  picked = [...byCat].flatMap(([c, list]) => shuffle(list, rand).slice(0, quota.get(c)));
  picked = shuffle(picked, rand); // mixed order so labelling is not done category by category
}

const outDir = resolve(TAG_DIR, set);
ensureDir(outDir);
const meta = { schema_version: SCHEMA_VERSION, lang, seed: all ? null : seed, created: new Date().toISOString() };
writeFileSync(resolve(outDir, 'sample.json'), JSON.stringify({ ...meta, stories: picked }, null, 2));

const system = buildSystemPrompt();
writeFileSync(resolve(outDir, 'prompts.jsonl'),
  picked.map((s) => JSON.stringify({ story_id: s.story_id, system, user: buildUserPrompt(s) })).join('\n') + '\n');
writeFileSync(resolve(outDir, 'laya-questions.json'), JSON.stringify(LAYA_QUESTIONS, null, 2));

if (!all) {
  writeFileSync(resolve(outDir, 'reading.md'), [
    `# Etiketleme okuma paketi (${picked.length} hikâye, ${lang}, seed ${seed})`,
    '',
    'Kurallar: staging/tagging/README.md. Etiketleri labels.csv dosyasına yaz.',
    '',
    ...picked.map((s, i) => [
      `---`, '', `## ${i + 1}. [${s.story_id}] ${s.title}`, '',
      `*${s.book_title} — ${s.author} · ${s.category} · ${s.words} kelime ≈ ${s.est_sec} sn*`, '',
      s.opening_hook ? `> Kanca: ${s.opening_hook}\n` : '', s.content, '',
    ].join('\n')),
  ].join('\n'));

  const labelsPath = resolve(outDir, 'labels.csv');
  if (existsSync(labelsPath) && !force) {
    console.log(`labels.csv zaten var, korunuyor (üzerine yazmak için --force): ${labelsPath}`);
  } else {
    const header = ['story_id', 'title', 'category', 'words', 'est_sec', ...SCORE_KEYS, 'primary_theme', 'secondary_themes', 'note'];
    writeFileSync(labelsPath, toCsv(header, picked));
  }
}

const counts = picked.reduce((m, s) => m.set(s.category, (m.get(s.category) ?? 0) + 1), new Map());
console.log(`${picked.length} hikâye -> ${outDir}`);
console.log([...counts].sort((a, b) => b[1] - a[1]).map(([c, k]) => `  ${c}: ${k}`).join('\n'));
console.log(`Tema anahtarları: ${Object.keys(THEMES).join(', ')}`);

#!/usr/bin/env node
// Shows how far the P1 rewrite has progressed, per language.
// Reads only local files + the bundled DB — no API calls, no cost.
//
// Usage:
//   node batch/07-status.mjs            # summary for en
//   node batch/07-status.mjs en,tr      # several languages
//   node batch/07-status.mjs en --list  # also list the ids in each bucket
//
// Buckets per story:
//   no_brief    → brief not generated yet
//   brief_only  → brief exists, story text not written yet
//   failed      → story written but fails validate.mjs (fix / re-submit)
//   ready       → story passes validation, not yet in the local DB
//   in_db       → the DB already holds exactly this text (apply-to-db done)
// Also writes staging/p1/status-<lang>.csv (story_id, book, title, status, confidence).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateP1 } from '../scripts/p1/validate.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const P1 = path.join(ROOT, 'staging/p1');
const args = process.argv.slice(2);
const list = args.includes('--list');
const langs = (args.find((a) => !a.startsWith('--')) || 'en').split(',');

const manifest = JSON.parse(fs.readFileSync(path.join(P1, 'manifest.json'), 'utf8'));

let db = null;
try {
  const { DatabaseSync } = await import('node:sqlite');
  db = new DatabaseSync(path.join(ROOT, 'assets/kivilcim.db'), { readOnly: true });
} catch {
  console.log('(node:sqlite unavailable — "in_db" cannot be detected; needs Node >= 22.5)\n');
}

const readJson = (f) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return null; } };
const csvCell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;

for (const lang of langs) {
  const buckets = { no_brief: [], brief_only: [], failed: [], ready: [], in_db: [] };
  const lowConf = [];
  const rows = [['story_id', 'book', 'story_title', 'status', 'confidence']];
  const dbText = db
    ? db.prepare('SELECT content FROM story_translations WHERE story_id = ? AND lang_code = ?')
    : null;

  for (const s of manifest) {
    const id = String(s.story_id);
    const brief = readJson(path.join(P1, 'brief', `${id}.json`));
    const mdFile = path.join(P1, lang, `${id}.md`);
    let status;
    if (!brief) status = 'no_brief';
    else if (!fs.existsSync(mdFile)) status = 'brief_only';
    else {
      const text = fs.readFileSync(mdFile, 'utf8').trim();
      if (validateP1(text, lang).errors.length) status = 'failed';
      else if (dbText && (dbText.get(Number(id), lang)?.content || '').trim() === text) status = 'in_db';
      else status = 'ready';
    }
    buckets[status].push(id);
    if (brief?.confidence === 'low') lowConf.push(id);
    rows.push([id, s.book?.title, s.story_title, status, brief?.confidence || '']);
  }

  const total = manifest.length;
  const done = buckets.ready.length + buckets.in_db.length;
  console.log(`=== ${lang.toUpperCase()} — ${done}/${total} written & valid (${((done / total) * 100).toFixed(1)}%)`);
  const labels = {
    in_db: 'in local DB', ready: 'valid, not in DB yet', failed: 'failed validation',
    brief_only: 'brief only (story pending)', no_brief: 'not started',
  };
  for (const k of ['in_db', 'ready', 'failed', 'brief_only', 'no_brief']) {
    const ids = buckets[k];
    console.log(`  ${labels[k].padEnd(28)} ${String(ids.length).padStart(4)}` + (list && ids.length ? `  ${ids.join(' ')}` : ''));
  }
  if (lowConf.length) console.log(`  low-confidence briefs (review by hand): ${lowConf.join(' ')}`);
  const remaining = buckets.no_brief.length + buckets.brief_only.length;
  console.log(`  remaining to generate: ${remaining}  (~$${(remaining * 0.061).toFixed(0)} at Opus batch prices)\n`);

  fs.writeFileSync(path.join(P1, `status-${lang}.csv`), rows.map((r) => r.map(csvCell).join(',')).join('\n') + '\n');
}
console.log('Details per story: staging/p1/status-<lang>.csv');

#!/usr/bin/env node
// Submits a Batch API job that turns each manifest story into a
// language-agnostic brief (staging/p1/brief/<id>.json, after 04-fetch-briefs.mjs).
//
// Usage:
//   node batch/02-submit-briefs.mjs --all
//   node batch/02-submit-briefs.mjs 1707 1731
//   node batch/02-submit-briefs.mjs --all --model claude-sonnet-5
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { submitBatch } from './lib/anthropic.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const modelIdx = args.indexOf('--model');
const model = modelIdx !== -1 ? args[modelIdx + 1] : (process.env.ANTHROPIC_MODEL || 'claude-opus-5-5');
const wantAll = args.includes('--all');
const ids = args.filter((a) => /^\d+$/.test(a)).map(Number);
const limitIdx = args.indexOf('--limit');
const limit = limitIdx !== -1 ? Number(args[limitIdx + 1]) : null;

const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'staging/p1/manifest.json'), 'utf8'));
const briefDir = path.join(ROOT, 'staging/p1/brief');
fs.mkdirSync(briefDir, { recursive: true });
const alreadyDone = new Set(fs.readdirSync(briefDir).filter((f) => f.endsWith('.json')).map((f) => Number(f.replace(/\.json$/, ''))));

let targets = manifest.filter((m) => (wantAll ? !alreadyDone.has(m.story_id) : ids.includes(m.story_id)));
if (limit) targets = targets.slice(0, limit);
if (!targets.length) {
  console.log('Nothing to submit (use --all or pass story ids). Run 01-build-manifest.mjs first if manifest.json is missing.');
  process.exit(0);
}

const instructions = fs.readFileSync(path.join(ROOT, 'batch/prompts/brief-instructions.md'), 'utf8');

const requests = targets.map((m) => ({
  customId: `brief-${m.story_id}`,
  model,
  maxTokens: 8000,
  system: instructions,
  messages: [{
    role: 'user',
    content: `story_id: ${m.story_id}\nBook: "${m.book.title}" by ${m.book.author}${m.book.year ? ` (${m.book.year})` : ''}\n\nExisting ${m.source_lang.toUpperCase()} text (for reference only — the brief must reflect the BOOK, not just reword this text):\n"""\n${m.source_content}\n"""`,
  }],
}));

const batch = await submitBatch(requests);
console.log(`Submitted ${requests.length} brief requests. Batch id: ${batch.id}`);
console.log(`Model: ${model}`);
console.log(`\nCheck status:   node batch/03-check-batch.mjs ${batch.id}`);
console.log(`Fetch results:  node batch/04-fetch-briefs.mjs ${batch.id}`);

fs.writeFileSync(path.join(ROOT, 'staging/p1/.last-brief-batch.json'), JSON.stringify({ id: batch.id, model, count: requests.length, submitted_at: new Date().toISOString() }, null, 2));

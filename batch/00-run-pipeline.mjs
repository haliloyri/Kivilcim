#!/usr/bin/env node
// Runs the whole pipeline end-to-end, unattended: manifest → briefs →
// (poll) → fetch briefs → per-language stories → (poll) → fetch+validate →
// optionally apply to the local DB. One command instead of babysitting each
// step from batch/README.md.
//
// Usage:
//   node batch/00-run-pipeline.mjs --langs en --apply
//   node batch/00-run-pipeline.mjs --langs en,tr,es,de --limit 20
//   node batch/00-run-pipeline.mjs --langs en --model claude-sonnet-5 --apply
//
// Meant to be left running unattended, e.g.:
//   nohup node batch/00-run-pipeline.mjs --langs en --apply > batch.log 2>&1 &
//   tail -f batch.log
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { getBatch } from './lib/anthropic.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(name);
  return i !== -1 ? args[i + 1] : fallback;
};
const langs = (flag('--langs', 'en')).split(',').map((s) => s.trim()).filter(Boolean);
const model = flag('--model', process.env.ANTHROPIC_MODEL || 'claude-opus-5-5');
const limit = flag('--limit', null);
const doApply = args.includes('--apply');
const pollSeconds = Number(flag('--poll-seconds', '30'));
const maxWaitHours = Number(flag('--max-wait-hours', '20'));

const log = (msg) => console.log(`[${new Date().toISOString()}] ${msg}`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Run a step script and return its stdout (also streamed to our own stdout). */
const run = (scriptArgs) => {
  log(`$ node ${scriptArgs.join(' ')}`);
  const out = execFileSync('node', scriptArgs, { cwd: ROOT, encoding: 'utf8' });
  process.stdout.write(out);
  return out;
};

/** Poll a batch until it ends (or we give up). Returns the final batch object, or null if never submitted. */
const waitForBatch = async (batchId) => {
  if (!batchId) return null;
  const deadline = Date.now() + maxWaitHours * 3600 * 1000;
  for (;;) {
    const batch = await getBatch(batchId);
    log(`batch ${batchId}: ${batch.processing_status} ${JSON.stringify(batch.request_counts)}`);
    if (batch.ended_at) return batch;
    if (Date.now() > deadline) {
      throw new Error(`batch ${batchId} did not finish within ${maxWaitHours}h — check it manually: node batch/03-check-batch.mjs ${batchId}`);
    }
    await sleep(pollSeconds * 1000);
  }
};

const extractBatchId = (stdout) => {
  const m = /Batch id: (\S+)/.exec(stdout);
  return m ? m[1] : null;
};

// ── 0. manifest ─────────────────────────────────────────────────────────
if (!fs.existsSync(path.join(ROOT, 'staging/p1/manifest.json'))) {
  run(['batch/01-build-manifest.mjs']);
} else {
  log('manifest.json already exists — skipping (delete it to rebuild).');
}

// ── 1. briefs (shared across languages, so --limit applies here too) ─────
const briefArgs = ['batch/02-submit-briefs.mjs', '--all', '--model', model];
if (limit) briefArgs.push('--limit', String(limit));
const briefOut = run(briefArgs);
const briefBatchId = extractBatchId(briefOut);
if (briefBatchId) {
  const batch = await waitForBatch(briefBatchId);
  run(['batch/04-fetch-briefs.mjs', batch.id]);
} else {
  log('No new briefs to submit.');
}

// ── 2. stories + variants, per language ────────────────────────────────
for (const lang of langs) {
  const storyArgs = ['batch/05-submit-stories.mjs', lang, '--all', '--model', model];
  if (limit) storyArgs.push('--limit', String(limit));
  const storyOut = run(storyArgs);
  const storyBatchId = extractBatchId(storyOut);
  if (!storyBatchId) {
    log(`[${lang}] No new stories to submit.`);
    continue;
  }
  const batch = await waitForBatch(storyBatchId);
  run(['batch/06-fetch-stories.mjs', batch.id, lang]);

  if (doApply) {
    log(`[${lang}] Applying validated stories to the local DB…`);
    try {
      run(['scripts/p1/apply-to-db.mjs', lang]);
    } catch (e) {
      log(`[${lang}] apply-to-db.mjs failed: ${e.message}`);
    }
  }
}

log('Pipeline finished.');

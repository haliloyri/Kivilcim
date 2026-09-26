#!/usr/bin/env node
// Downloads a finished story batch and writes staging/p1/<lang>/<id>.md and
// staging/p1/<lang>/<id>.variants.json, then runs the validator on them.
//
// Usage: node batch/06-fetch-stories.mjs <batch_id> <lang>
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { getBatch, fetchBatchResults } from './lib/anthropic.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [batchId, lang] = process.argv.slice(2);
if (!batchId || !lang) {
  console.error('usage: node batch/06-fetch-stories.mjs <batch_id> <lang>');
  process.exit(2);
}

const batch = await getBatch(batchId);
if (!batch.ended_at) {
  console.error(`Batch ${batchId} has not finished yet (status: ${batch.processing_status}). Run 03-check-batch.mjs first.`);
  process.exit(1);
}

const results = await fetchBatchResults(batch);
const outDir = path.join(ROOT, 'staging/p1', lang);
fs.mkdirSync(outDir, { recursive: true });

let ok = 0, failed = 0;
const writtenIds = [];
for (const r of results) {
  const id = r.customId.replace(new RegExp(`^story-${lang}-`), '');
  if (r.status !== 'succeeded') {
    console.log(`FAIL story-${lang}-${id}: ${r.status} — ${r.error || ''}`);
    failed += 1;
    continue;
  }
  const storyMatch = /```story\s*([\s\S]*?)```/.exec(r.text);
  const variantsMatch = /```variants\s*([\s\S]*?)```/.exec(r.text);
  if (!storyMatch || !variantsMatch) {
    console.log(`FAIL story-${lang}-${id}: missing \`\`\`story or \`\`\`variants block`);
    failed += 1;
    continue;
  }
  try {
    JSON.parse(variantsMatch[1]); // validate before writing
  } catch (e) {
    console.log(`FAIL story-${lang}-${id}: invalid variants JSON — ${e.message}`);
    failed += 1;
    continue;
  }
  fs.writeFileSync(path.join(outDir, `${id}.md`), storyMatch[1].trim() + '\n');
  fs.writeFileSync(path.join(outDir, `${id}.variants.json`), variantsMatch[1].trim() + '\n');
  writtenIds.push(id);
  ok += 1;
}
console.log(`\n${ok} stor${ok === 1 ? 'y' : 'ies'} written to staging/p1/${lang}/, ${failed} failed.`);

if (writtenIds.length) {
  console.log('\nValidating…');
  try {
    execFileSync('node', ['scripts/p1/validate.mjs', lang, ...writtenIds], { cwd: ROOT, stdio: 'inherit' });
  } catch {
    console.log('\nSome stories failed validation — see ✗ lines above. Fix or re-submit those ids before applying to the DB.');
  }
}

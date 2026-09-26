#!/usr/bin/env node
// Downloads a finished brief batch and writes staging/p1/brief/<id>.json.
//
// Usage: node batch/04-fetch-briefs.mjs <batch_id>
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getBatch, fetchBatchResults } from './lib/anthropic.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const batchId = process.argv[2];
if (!batchId) {
  console.error('usage: node batch/04-fetch-briefs.mjs <batch_id>');
  process.exit(2);
}

const batch = await getBatch(batchId);
if (!batch.ended_at) {
  console.error(`Batch ${batchId} has not finished yet (status: ${batch.processing_status}). Run 03-check-batch.mjs first.`);
  process.exit(1);
}

const results = await fetchBatchResults(batch);
const briefDir = path.join(ROOT, 'staging/p1/brief');
fs.mkdirSync(briefDir, { recursive: true });

let ok = 0, failed = 0;
for (const r of results) {
  const id = r.customId.replace(/^brief-/, '');
  if (r.status !== 'succeeded') {
    console.log(`FAIL brief-${id}: ${r.status} — ${r.error || ''}`);
    failed += 1;
    continue;
  }
  const match = /```json\s*([\s\S]*?)```/.exec(r.text);
  if (!match) {
    console.log(`FAIL brief-${id}: no \`\`\`json block in response`);
    failed += 1;
    continue;
  }
  try {
    const json = JSON.parse(match[1]);
    fs.writeFileSync(path.join(briefDir, `${id}.json`), JSON.stringify(json, null, 2));
    ok += 1;
  } catch (e) {
    console.log(`FAIL brief-${id}: invalid JSON — ${e.message}`);
    failed += 1;
  }
}
console.log(`\n${ok} brief(s) written to staging/p1/brief/, ${failed} failed.`);

#!/usr/bin/env node
// Polls a batch's status. Batches typically finish within minutes to a few
// hours; Anthropic's SLA is under 24h. Re-run this until "ended_at" is set.
//
// Usage: node batch/03-check-batch.mjs <batch_id>
import { getBatch } from './lib/anthropic.mjs';

const batchId = process.argv[2];
if (!batchId) {
  console.error('usage: node batch/03-check-batch.mjs <batch_id>');
  process.exit(2);
}

const batch = await getBatch(batchId);
console.log(`status: ${batch.processing_status}`);
console.log(`counts: ${JSON.stringify(batch.request_counts)}`);
if (batch.ended_at) {
  console.log(`ended_at: ${batch.ended_at}`);
  console.log('\nBatch finished — fetch its results now (04-fetch-briefs.mjs or 06-fetch-stories.mjs).');
} else {
  console.log('\nStill running. Re-run this command in a bit.');
}

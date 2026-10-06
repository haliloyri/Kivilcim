#!/usr/bin/env node
// Load the content catalogue from assets/albor.db into Supabase.
// Only stories with version = 'Opus55' (and their translations/variants) are
// exported; books and categories are exported in full.
//
//   node scripts/supabase/import-content.mjs            # dry run: counts only, no network
//   node scripts/supabase/import-content.mjs --apply    # upsert into Supabase (service role)
//
// Afterwards bump content_seed_versions('catalog') so devices re-sync — this
// script does it automatically on --apply.
import { readContentRows, createServiceClient, ACTIVE_VERSION } from './lib.mjs';

const apply = process.argv.includes('--apply');
const CHUNK = 100;

const tables = readContentRows();
let bytes = 0;
console.log(`${apply ? 'APPLY' : 'DRY RUN'} — active version: ${ACTIVE_VERSION}\n`);
for (const t of tables) {
  const size = Buffer.byteLength(JSON.stringify(t.rows));
  bytes += size;
  console.log(`${t.name.padEnd(28)} ${String(t.rows.length).padStart(5)} rows  ${(size / 1024).toFixed(0).padStart(6)} KB`);
}
console.log(`${'total'.padEnd(28)} ${''.padStart(5)}       ${(bytes / 1024).toFixed(0).padStart(6)} KB`);
if (!apply) {
  console.log('\nNothing written. Re-run with --apply to upload.');
  process.exit(0);
}

const sb = await createServiceClient();
for (const t of tables) {
  for (let i = 0; i < t.rows.length; i += CHUNK) {
    const chunk = t.rows.slice(i, i + CHUNK);
    const { error } = await sb.from(t.name).upsert(chunk, { onConflict: t.onConflict || 'id' });
    if (error) throw new Error(`${t.name} [${i}..${i + chunk.length}]: ${error.message}`);
  }
  console.log(`uploaded ${t.name}`);
}

// Catalog version → devices compare it with their local copy and re-sync.
const { data: cur } = await sb.from('content_seed_versions').select('version').eq('seed_key', 'catalog').maybeSingle();
const next = Number(cur?.version || 0) + 1;
const { error } = await sb.from('content_seed_versions')
  .upsert({ seed_key: 'catalog', version: next, applied_at: new Date().toISOString() }, { onConflict: 'seed_key' });
if (error) throw new Error(`content_seed_versions: ${error.message}`);
console.log(`\ncatalog version → ${next}`);

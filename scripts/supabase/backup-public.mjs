#!/usr/bin/env node
// Dump every row of every user/content table in Supabase `public` to
// supabase/_backups/public-<timestamp>.json (git-ignored: contains user data).
// Run before any destructive migration. Usage: node scripts/supabase/backup-public.mjs
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, createServiceClient } from './lib.mjs';

const TABLES = [
  'profiles', 'push_tokens', 'user_reads', 'user_likes', 'user_selected_categories',
  'user_streak_freezes', 'user_favorites', 'user_collections', 'user_variant_usage', 'user_badges',
  'user_career_events', 'user_career_state', 'user_career_nodes', 'user_legacy_badges', 'referrals',
  'stories', 'categories', 'main_categories', 'sub_categories', 'sub_category_translations',
  'books', 'book_translations',
];
const PAGE = 1000;

const sb = await createServiceClient();
const out = { taken_at: new Date().toISOString(), tables: {} };
for (const table of TABLES) {
  const rows = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await sb.from(table).select('*').range(from, from + PAGE - 1);
    if (error) {
      // Missing table → nothing to back up; anything else must stop the run.
      if (/does not exist|schema cache/i.test(error.message)) { rows.push(null); break; }
      throw new Error(`${table}: ${error.message}`);
    }
    rows.push(...data);
    if (data.length < PAGE) break;
  }
  if (rows[0] === null) { console.log(`skip  ${table} (not present)`); continue; }
  out.tables[table] = rows;
  console.log(`ok    ${table}: ${rows.length}`);
}
const dir = path.join(ROOT, 'supabase/_backups');
fs.mkdirSync(dir, { recursive: true });
const file = path.join(dir, `public-${out.taken_at.replace(/[:.]/g, '-')}.json`);
fs.writeFileSync(file, JSON.stringify(out, null, 2));
console.log(`\nBackup written: ${path.relative(ROOT, file)}`);

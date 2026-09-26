#!/usr/bin/env node
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { ROOT, openDb, rows } from './lib/store.mjs';

const asset = JSON.parse(readFileSync(resolve(ROOT, 'assets/one-minute-summaries.json'), 'utf8'));
const db = await openDb();
const errors = [];
const columns = rows(db, 'PRAGMA table_info(story_translations)').map((column) => column.name);

if (!columns.includes('one_minute_summary')) errors.push('story_translations.one_minute_summary eksik');

const translationRows = columns.includes('one_minute_summary')
  ? rows(db, `SELECT story_id, lang_code, one_minute_summary FROM story_translations ORDER BY story_id, lang_code`)
  : [];
const storyRows = rows(db, 'SELECT id FROM stories ORDER BY id');
db.close();

const byKey = new Map(translationRows.map((row) => [`${row.story_id}:${row.lang_code}`, row.one_minute_summary || '']));
const wordCount = (value) => String(value || '').trim().split(/\s+/u).filter(Boolean).length;

for (const row of translationRows) {
  const label = `${row.story_id}/${row.lang_code}`;
  const summary = String(row.one_minute_summary || '').trim();
  const words = wordCount(summary);
  if (!summary) errors.push(`${label}: ozet bos`);
  if (/##|\$\$|&&|~~/u.test(summary)) errors.push(`${label}: okuma isareti sizdi`);
  if (words < 35 || words > 110) errors.push(`${label}: kelime sayisi ${words}`);
}

for (const story of storyRows) {
  if (!byKey.get(`${story.id}:tr`)) errors.push(`${story.id}/tr: zorunlu Turkce fallback yok`);
}

let seedEntries = 0;
for (const [storyId, localized] of Object.entries(asset.summaries || {})) {
  for (const [lang, summary] of Object.entries(localized || {})) {
    seedEntries += 1;
    if (byKey.get(`${storyId}:${lang}`) !== summary) errors.push(`${storyId}/${lang}: seed ile DB farkli`);
  }
}

if (asset.translationCount !== seedEntries) {
  errors.push(`seed translationCount ${asset.translationCount}, gercek ${seedEntries}`);
}
if (translationRows.length !== seedEntries) {
  errors.push(`DB dil kaydi ${translationRows.length}, seed kaydi ${seedEntries}`);
}
if (asset.storyCount !== storyRows.length) {
  errors.push(`DB hikaye ${storyRows.length}, seed hikaye ${asset.storyCount}`);
}

if (errors.length) {
  console.error(`[one-minute] FAIL (${errors.length})`);
  errors.slice(0, 40).forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`[one-minute] PASS — ${storyRows.length} hikaye, ${translationRows.length} dil kaydi, seed v${asset.version}`);

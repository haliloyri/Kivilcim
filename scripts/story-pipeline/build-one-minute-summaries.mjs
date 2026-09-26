#!/usr/bin/env node
/**
 * Builds the localized, precomputed one-minute story summaries used by the
 * Premium reader. Existing editorial conversation_thirty_sec copy is kept as
 * the source for the first story set; uncovered translations receive a
 * conservative extractive summary from the story narrative.
 *
 * The extractor deliberately removes lesson ($$), reflection (&&), and
 * contrast (~~) blocks so this surface tells only the story. It never invents
 * facts or calls a paid/runtime AI service.
 *
 * Usage:
 *   node scripts/story-pipeline/build-one-minute-summaries.mjs          # dry run
 *   node scripts/story-pipeline/build-one-minute-summaries.mjs --write  # update asset + DB
 */
import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { LANGS, ROOT, openDb, rows, saveDb } from './lib/store.mjs';

const WRITE = process.argv.includes('--write');
const SEED_VERSION = 1;
const TARGET_MIN_WORDS = 55;
const TARGET_MAX_WORDS = 105;
const ASSET_PATH = resolve(ROOT, 'assets/one-minute-summaries.json');

const wordCount = (value = '') => String(value).trim().split(/\s+/u).filter(Boolean).length;
const normalize = (value = '') => String(value ?? '')
  .replace(/\r\n?/g, '\n')
  .replace(/\s+/gu, ' ')
  .replace(/\s+([,.;!?])/gu, '$1')
  .trim();

const narrativeOnly = (value = '') => normalize(
  String(value)
    .replace(/\$\$[\s\S]*?\$\$/gu, ' ')
    .replace(/&&[\s\S]*?&&/gu, ' ')
    .replace(/~~[\s\S]*?~~/gu, ' ')
    .replace(/##/gu, '')
    .replace(/\s*::\s*/gu, ' — ')
);

const segmentSentences = (value, lang) => {
  const clean = narrativeOnly(value);
  if (!clean) return [];
  try {
    const segmenter = new Intl.Segmenter(lang, { granularity: 'sentence' });
    return [...segmenter.segment(clean)]
      .map(({ segment }) => normalize(segment))
      .filter((sentence) => wordCount(sentence) >= 3);
  } catch {
    return clean.split(/(?<=[.!?])\s+/u).map(normalize).filter(Boolean);
  }
};

const buildExtractiveSummary = ({ content, description, lang }) => {
  const sentences = segmentSentences(content, lang);
  if (!sentences.length) return normalize(description);

  const selected = new Set();
  let selectedWords = 0;

  const add = (index) => {
    if (index < 0 || index >= sentences.length || selected.has(index)) return false;
    const count = wordCount(sentences[index]);
    if (selectedWords > 0 && selectedWords + count > TARGET_MAX_WORDS) return false;
    selected.add(index);
    selectedWords += count;
    return true;
  };

  // Establish the situation first.
  for (let index = 0; index < sentences.length && selectedWords < 42; index += 1) add(index);

  // Preserve the outcome by filling from the end. Final indices are sorted
  // before joining, so the resulting account stays chronological.
  for (let index = sentences.length - 1; index >= 0 && selectedWords < TARGET_MIN_WORDS; index -= 1) add(index);

  // If the story has very short sentences, bridge the middle rather than
  // returning an underfilled summary.
  for (let index = 0; index < sentences.length && selectedWords < TARGET_MIN_WORDS; index += 1) add(index);

  const result = [...selected]
    .sort((a, b) => a - b)
    .map((index) => sentences[index])
    .join(' ');

  if (wordCount(result) >= 35) return normalize(result);
  return normalize(description || result);
};

const db = await openDb({ readonly: !WRITE });
const translations = rows(db, `
  SELECT st.story_id, st.lang_code, st.description, st.content,
         scv.thirty_sec AS editorial_summary
    FROM story_translations st
    LEFT JOIN story_conversation_variants scv
      ON scv.story_id = st.story_id AND scv.lang_code = st.lang_code
   WHERE st.lang_code IN ('tr', 'en', 'es', 'de')
   ORDER BY st.story_id, st.lang_code
`);

const summaries = {};
let editorialCount = 0;
let extractiveCount = 0;

for (const row of translations) {
  const editorial = normalize(row.editorial_summary);
  const summary = editorial || buildExtractiveSummary(row);
  if (!summary) throw new Error(`Bos bir dakikalik anlatim: ${row.story_id}/${row.lang_code}`);

  summaries[String(row.story_id)] ??= {};
  summaries[String(row.story_id)][row.lang_code] = summary;
  if (editorial) editorialCount += 1;
  else extractiveCount += 1;
}

const flatEntries = Object.entries(summaries).flatMap(([storyId, localized]) =>
  LANGS.flatMap((lang) => localized[lang]
    ? [{ storyId: Number(storyId), lang, summary: localized[lang] }]
    : [])
);

const counts = flatEntries.map(({ summary }) => wordCount(summary));
const payload = {
  version: SEED_VERSION,
  translationCount: flatEntries.length,
  storyCount: Object.keys(summaries).length,
  summaries,
};

console.log(`[one-minute] ${payload.storyCount} hikaye / ${payload.translationCount} dil kaydi`);
console.log(`[one-minute] editorial=${editorialCount}, extractive=${extractiveCount}`);
console.log(`[one-minute] kelime min=${Math.min(...counts)}, max=${Math.max(...counts)}, ort=${(counts.reduce((a, b) => a + b, 0) / counts.length).toFixed(1)}`);

if (!WRITE) {
  db.close();
  console.log('[one-minute] DRY RUN — yazmak icin --write kullan.');
  process.exit(0);
}

const columns = rows(db, 'PRAGMA table_info(story_translations)').map((column) => column.name);
if (!columns.includes('one_minute_summary')) {
  db.run('ALTER TABLE story_translations ADD COLUMN one_minute_summary TEXT');
}
db.run(`CREATE TABLE IF NOT EXISTS content_seed_versions (
  seed_key TEXT PRIMARY KEY,
  version INTEGER NOT NULL,
  applied_at TEXT NOT NULL
)`);

db.run('BEGIN');
try {
  const statement = db.prepare(`
    UPDATE story_translations
       SET one_minute_summary = ?
     WHERE story_id = ? AND lang_code = ?
  `);
  for (const entry of flatEntries) {
    statement.run([entry.summary, entry.storyId, entry.lang]);
  }
  statement.free();
  db.run(`
    INSERT OR REPLACE INTO content_seed_versions (seed_key, version, applied_at)
    VALUES ('one_minute_summaries', ?, datetime('now'))
  `, [SEED_VERSION]);
  db.run('COMMIT');
} catch (error) {
  db.run('ROLLBACK');
  throw error;
}

saveDb(db, { backup: true });
db.close();
writeFileSync(ASSET_PATH, `${JSON.stringify(payload)}\n`, 'utf8');

console.log(`[one-minute] DB ve ${ASSET_PATH} guncellendi.`);
console.log(`[one-minute] seed version=${SEED_VERSION}`);

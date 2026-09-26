#!/usr/bin/env node
// Write validated P1 stories into the bundled SQLite DB (assets/kivilcim.db).
// Usage: node scripts/p1/apply-to-db.mjs <lang> [storyId ...] [--dry-run]
//
// - Refuses stories that fail validation.
// - Backs up the DB once per run to assets/_db_backups/.
// - Updates story_translations.content for that language only.
// - Updates stories.current_read_minutes / possible_read_minutes from the
//   longest P1 text of the story (≈ 200 words per minute).
//
// Uses Node's built-in `node:sqlite` (Node ≥ 22.5) and falls back to the
// `sqlite3` CLI, so no native npm module is needed.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { validateP1 } from './validate.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const DB = path.join(ROOT, 'assets/kivilcim.db');
const WPM = 200;

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const [lang, ...rest] = args.filter((a) => a !== '--dry-run');
if (!lang) {
  console.error('usage: node scripts/p1/apply-to-db.mjs <lang> [storyId ...] [--dry-run]');
  process.exit(2);
}

const dir = path.join(ROOT, 'staging/p1', lang);
const ids = rest.length ? rest : fs.readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''));

const sql = (s) => `'${String(s).replace(/'/g, "''")}'`;
const statements = ['BEGIN;'];
let applied = 0;

ids.forEach((id) => {
  const file = path.join(dir, `${id}.md`);
  const text = fs.readFileSync(file, 'utf8').trim();
  const { errors, words } = validateP1(text, lang);
  if (errors.length) {
    console.log(`SKIP ${lang}/${id}: ${errors.length} validation error(s)`);
    return;
  }
  const minutes = Math.max(1, Math.round(words / WPM));
  statements.push(
    `UPDATE story_translations SET content = ${sql(text)} WHERE story_id = ${Number(id)} AND lang_code = ${sql(lang)};`,
    `UPDATE stories SET current_read_minutes = MAX(COALESCE(current_read_minutes, 1), ${minutes}), possible_read_minutes = MAX(COALESCE(possible_read_minutes, 1), ${minutes}), target_word_count = MAX(COALESCE(target_word_count, 160), ${words}) WHERE id = ${Number(id)};`,
  );
  console.log(`OK   ${lang}/${id}: ${words} words, ~${minutes} min`);
  applied += 1;

  // Optional companion file: <id>.variants.json — the four "Use in
  // Conversation" strings (punchline / thirty_sec / question / key_contrast),
  // written independently from the same content brief. Upserted into
  // story_conversation_variants alongside the story body.
  const variantsFile = path.join(dir, `${id}.variants.json`);
  if (fs.existsSync(variantsFile)) {
    const v = JSON.parse(fs.readFileSync(variantsFile, 'utf8'));
    statements.push(
      `INSERT INTO story_conversation_variants (story_id, lang_code, punchline, thirty_sec, question, key_contrast)
       VALUES (${Number(id)}, ${sql(lang)}, ${sql(v.punchline || '')}, ${sql(v.thirty_sec || '')}, ${sql(v.question || '')}, ${sql(v.key_contrast || '')})
       ON CONFLICT(story_id, lang_code) DO UPDATE SET
         punchline = excluded.punchline,
         thirty_sec = excluded.thirty_sec,
         question = excluded.question,
         key_contrast = excluded.key_contrast;`,
    );
    console.log(`OK   ${lang}/${id}: conversation variants updated`);
  }
});
statements.push('COMMIT;');

if (!applied) {
  console.log('Nothing to apply.');
  process.exit(0);
}
if (dryRun) {
  console.log(`\n--dry-run: ${applied} stor${applied === 1 ? 'y' : 'ies'} would be written.`);
  process.exit(0);
}

const backupDir = path.join(ROOT, 'assets/_db_backups');
fs.mkdirSync(backupDir, { recursive: true });
const stamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
fs.copyFileSync(DB, path.join(backupDir, `kivilcim.db.${stamp}`));

const script = statements.join('\n');
let nodeSqlite = null;
try {
  nodeSqlite = await import('node:sqlite');
} catch {
  nodeSqlite = null;
}
if (nodeSqlite?.DatabaseSync) {
  const db = new nodeSqlite.DatabaseSync(DB);
  try {
    db.exec(script);
  } finally {
    db.close();
  }
} else {
  const tmp = path.join(ROOT, 'staging/p1/.apply.sql');
  fs.writeFileSync(tmp, script);
  try {
    execFileSync('sqlite3', [DB, `.read ${tmp}`], { stdio: 'inherit' });
  } finally {
    fs.unlinkSync(tmp);
  }
}
console.log(`\nApplied ${applied} stor${applied === 1 ? 'y' : 'ies'} to ${path.relative(ROOT, DB)} (backup: kivilcim.db.${stamp}).`);

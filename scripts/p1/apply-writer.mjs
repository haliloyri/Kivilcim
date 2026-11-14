#!/usr/bin/env node
// Writes the hikaye-yazari agent's stories (staging/p1-writer/<lang>/) into assets/albor.db.
// Overwrites existing story text and conversation variants, and sets stories.version to the label.
// Usage: node scripts/p1/apply-writer.mjs <label> <lang,lang,...> [storyId ...] [--dry-run]
//   node scripts/p1/apply-writer.mjs SON55 tr,en,es,de 1059 1060
//   node scripts/p1/apply-writer.mjs SON55 tr,en,es,de            (every id found in the folder)
//
// - Skips a story/language that fails validation; the stories.version label is only set
//   for a story when at least one of its languages was written.
// - Only existing stories (numeric id present in `stories`) are written; slug-named new
//   stories are reported and skipped.
// - Also applies staging/p1-writer/meta/<id>.json when present: description, hook and
//   one_minute_summary per language; title only when title_changed[lang] is true.
//   A meta with verdict "delete" deletes that story (stories, story_translations,
//   story_conversation_variants) instead of writing it.
// - Backs up the DB once per run to assets/_db_backups/albor.db.pre-writer-<label>-<stamp>.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import { validateP1 } from './validate.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const DB = path.join(ROOT, 'assets/albor.db');
const WPM = 200;

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const [label, langArg, ...idArgs] = args.filter((a) => a !== '--dry-run');
if (!label || !langArg) {
  console.error('usage: node scripts/p1/apply-writer.mjs <label> <lang,lang,...> [storyId ...] [--dry-run]');
  process.exit(2);
}
const langs = langArg.split(',');

const listIds = (lang) => {
  const d = path.join(ROOT, 'staging/p1-writer', lang);
  return fs.existsSync(d) ? fs.readdirSync(d).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, '')) : [];
};
const ids = idArgs.length ? idArgs : [...new Set(langs.flatMap(listIds))];

const db = new DatabaseSync(DB);
const known = new Set(db.prepare('SELECT id FROM stories').all().map((r) => String(r.id)));

const readMeta = (id) => {
  const f = path.join(ROOT, 'staging/p1-writer/meta', `${id}.json`);
  return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null;
};

const plan = [];
const touched = new Set();
const deletes = [];
const metas = new Map();
for (const id of ids) {
  if (!known.has(String(id))) {
    console.log(`SKIP ${id}: not an existing story id (new stories need ingest by hand)`);
    continue;
  }
  const meta = readMeta(id);
  if (meta?.verdict === 'delete') {
    deletes.push(Number(id));
    console.log(`DEL  ${id}: meta verdict delete (${meta.verify_note || 'no note'})`);
    continue;
  }
  if (meta) metas.set(Number(id), meta);
  for (const lang of langs) {
    const file = path.join(ROOT, 'staging/p1-writer', lang, `${id}.md`);
    if (!fs.existsSync(file)) { console.log(`MISS ${lang}/${id}: no file`); continue; }
    const text = fs.readFileSync(file, 'utf8').trim();
    const { errors, words } = validateP1(text, lang);
    if (errors.length) { console.log(`SKIP ${lang}/${id}: ${errors.length} validation error(s)`); continue; }
    let variants = null;
    const vFile = path.join(ROOT, 'staging/p1-writer', lang, `${id}.variants.json`);
    if (fs.existsSync(vFile)) variants = JSON.parse(fs.readFileSync(vFile, 'utf8'));
    plan.push({ id: Number(id), lang, text, words, variants });
    touched.add(Number(id));
    console.log(`OK   ${lang}/${id}: ${words} words`);
  }
}

if (!plan.length && !deletes.length) { console.log('Nothing to apply.'); db.close(); process.exit(0); }
if (dryRun) {
  console.log(`\n--dry-run: ${plan.length} story texts across ${touched.size} stories would be written, version -> ${label}; meta for ${[...touched].filter((i) => metas.has(i)).length} stories; ${deletes.length} deleted.`);
  db.close();
  process.exit(0);
}

const backupDir = path.join(ROOT, 'assets/_db_backups');
fs.mkdirSync(backupDir, { recursive: true });
const stamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
const backup = `albor.db.pre-writer-${label}-${stamp}`;
fs.copyFileSync(DB, path.join(backupDir, backup));

const updText = db.prepare('UPDATE story_translations SET content = ? WHERE story_id = ? AND lang_code = ?');
const updMeta = db.prepare('UPDATE stories SET version = ?, current_read_minutes = ?, possible_read_minutes = ?, target_word_count = ? WHERE id = ?');
const upVar = db.prepare(`INSERT INTO story_conversation_variants (story_id, lang_code, punchline, thirty_sec, question, key_contrast)
  VALUES (?, ?, ?, ?, ?, ?)
  ON CONFLICT(story_id, lang_code) DO UPDATE SET punchline = excluded.punchline,
    thirty_sec = excluded.thirty_sec, question = excluded.question, key_contrast = excluded.key_contrast`);

const updInfo = db.prepare(`UPDATE story_translations SET
    title = COALESCE(?, title), description = COALESCE(?, description),
    hook = COALESCE(?, hook), one_minute_summary = COALESCE(?, one_minute_summary)
  WHERE story_id = ? AND lang_code = ?`);
const delVar = db.prepare('DELETE FROM story_conversation_variants WHERE story_id = ?');
const delTr = db.prepare('DELETE FROM story_translations WHERE story_id = ?');
const delStory = db.prepare('DELETE FROM stories WHERE id = ?');
const nz = (v) => (typeof v === 'string' && v.trim() ? v.trim() : null);
let metaRows = 0;

db.exec('BEGIN');
try {
  const maxWords = new Map();
  for (const p of plan) {
    const r = updText.run(p.text, p.id, p.lang);
    if (!r.changes) console.log(`WARN ${p.lang}/${p.id}: no story_translations row to overwrite`);
    if (p.variants) upVar.run(p.id, p.lang, p.variants.punchline || '', p.variants.thirty_sec || '', p.variants.question || '', p.variants.key_contrast || '');
    maxWords.set(p.id, Math.max(maxWords.get(p.id) || 0, p.words));
    const m = metas.get(p.id);
    const ml = m?.[p.lang];
    if (ml) {
      const title = m.title_changed?.[p.lang] ? nz(ml.title) : null;
      metaRows += updInfo.run(title, nz(ml.description), nz(ml.hook), nz(ml.one_minute_summary), p.id, p.lang).changes;
    }
  }
  for (const id of deletes) {
    delVar.run(id);
    delTr.run(id);
    delStory.run(id);
  }
  for (const [id, words] of maxWords) {
    const minutes = Math.max(1, Math.round(words / WPM));
    updMeta.run(label, minutes, minutes, words, id);
  }
  db.exec('COMMIT');
} catch (e) {
  db.exec('ROLLBACK');
  throw e;
} finally {
  db.close();
}
console.log(`\nWrote ${plan.length} story texts across ${touched.size} stories, version -> ${label}; meta rows ${metaRows}; deleted ${deletes.length}. Backup: assets/_db_backups/${backup}`);

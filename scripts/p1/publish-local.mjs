#!/usr/bin/env node
// Publish the finished P1 stories (staging/p1/<lang>/) into the app's bundled
// local database (assets/kivilcim.db) and save it as a new content version.
//
//   npm run story:publish                 # en + tr, only changed stories
//   npm run story:publish -- --dry-run    # show what would change, write nothing
//   npm run story:publish -- --langs tr   # a single language
//   npm run story:publish -- --ids 1059,1060 --note "fix typo"
//
// What it does, in order (no AI / no network involved):
//   1. Reads staging/p1/<lang>/<id>.md (+ <id>.variants.json) for each language.
//   2. Validates every story with scripts/p1/validate.mjs; invalid ones are skipped.
//   3. Compares with what the DB already holds; unchanged stories are skipped.
//   4. Backs up the DB to assets/_db_backups/kivilcim.db.<timestamp>
//      (keeps the 10 newest timestamped backups).
//   5. Writes story text, reading minutes and conversation variants in ONE transaction.
//   6. Bumps DB_VERSION in src/db/db.js, so on next launch the app deletes its old
//      local copy and copies the new DB from assets (this is the "new version").
//   7. Appends a line to staging/p1/publish-log.jsonl.
//
// Every published story also gets stories.version = 'Opus55' (override with
// --version <name>), so it shows under the "Opus 5.5" collection in Settings.
//
// If nothing changed, nothing is written and DB_VERSION is not bumped.
// Test options: --db <path> and --dbjs <path> point at copies instead of the real files.
// Requires Node >= 22.5 (built-in node:sqlite).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateP1 } from './validate.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const WPM = 200;
const KEEP_BACKUPS = 10;
const VARIANT_KEYS = ['punchline', 'thirty_sec', 'question', 'key_contrast'];

// ── args ────────────────────────────────────────────────
const argv = process.argv.slice(2);
const opt = (name, def = null) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : def;
};
const dryRun = argv.includes('--dry-run');
const DB = path.resolve(ROOT, opt('db', 'assets/kivilcim.db'));
const DBJS = path.resolve(ROOT, opt('dbjs', 'src/db/db.js'));
const note = opt('note', '');
const onlyIds = opt('ids') ? new Set(opt('ids').split(',').map((s) => s.trim())) : null;
const STORY_VERSION = opt('version', 'Opus55');
const langs = (opt('langs', 'en,tr')).split(',').map((s) => s.trim()).filter(Boolean);

let DatabaseSync;
try {
  ({ DatabaseSync } = await import('node:sqlite'));
} catch {
  console.error(`node:sqlite is not available (Node ${process.version}). Install Node >= 22.5.`);
  process.exit(2);
}
if (!fs.existsSync(DB)) { console.error(`DB not found: ${DB}`); process.exit(2); }
if (!fs.existsSync(DBJS)) { console.error(`db.js not found: ${DBJS}`); process.exit(2); }

const readJson = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const norm = (s) => String(s ?? '').trim();

// ── 1–3: collect, validate, diff ───────────────────────
const db = new DatabaseSync(DB, dryRun ? { readOnly: true } : {});
const getText = db.prepare('SELECT content FROM story_translations WHERE story_id = ? AND lang_code = ?');
const getStoryVer = db.prepare('SELECT version FROM stories WHERE id = ?');
const getVar = db.prepare('SELECT punchline, thirty_sec, question, key_contrast FROM story_conversation_variants WHERE story_id = ? AND lang_code = ?');

const plan = []; // { lang, id, text, words, variants, textChanged, varChanged }
const summary = {};
for (const lang of langs) {
  const dir = path.join(ROOT, 'staging/p1', lang);
  const s = (summary[lang] = { changed: 0, unchanged: 0, invalid: [], noRow: [] });
  if (!fs.existsSync(dir)) { console.log(`(no folder staging/p1/${lang}, skipped)`); continue; }
  const ids = fs.readdirSync(dir)
    .filter((f) => /^\d+\.md$/.test(f)).map((f) => f.replace(/\.md$/, ''))
    .filter((id) => !onlyIds || onlyIds.has(id))
    .sort((a, b) => a - b);

  for (const id of ids) {
    const text = fs.readFileSync(path.join(dir, `${id}.md`), 'utf8').trim();
    const { errors, words } = validateP1(text, lang);
    if (errors.length) { s.invalid.push(`${id} (${errors[0]})`); continue; }

    const row = getText.get(Number(id), lang);
    if (!row) { s.noRow.push(id); continue; }

    let variants = null;
    const vf = path.join(dir, `${id}.variants.json`);
    if (fs.existsSync(vf)) {
      try {
        const v = readJson(vf);
        variants = Object.fromEntries(VARIANT_KEYS.map((k) => [k, norm(v[k])]));
      } catch (e) { s.invalid.push(`${id} (variants.json: ${e.message})`); continue; }
    }
    const textChanged = norm(row.content) !== text;
    const cur = getVar.get(Number(id), lang);
    const varChanged = !!variants && (!cur || VARIANT_KEYS.some((k) => norm(cur[k]) !== variants[k]));

    const verChanged = String(getStoryVer.get(Number(id))?.version ?? '') !== STORY_VERSION;

    if (textChanged || varChanged || verChanged) {
      plan.push({ lang, id: Number(id), text, words, variants, textChanged, varChanged, verChanged });
      s.changed += 1;
    } else s.unchanged += 1;
  }
}

// ── report ─────────────────────────────────────────────
console.log('\n=== P1 → local DB ===');
for (const [lang, s] of Object.entries(summary)) {
  console.log(`${lang.toUpperCase()}: ${s.changed} to publish, ${s.unchanged} already up to date` +
    (s.invalid.length ? `, ${s.invalid.length} INVALID (skipped)` : '') +
    (s.noRow.length ? `, ${s.noRow.length} without a DB row (skipped)` : ''));
  s.invalid.forEach((x) => console.log(`   ✗ ${x}`));
  if (s.noRow.length) console.log(`   ? no story_translations row: ${s.noRow.join(', ')}`);
}

const dbjsSrc = fs.readFileSync(DBJS, 'utf8');
const verRe = /const DB_VERSION = (\d+);[^\n]*/;
const m = verRe.exec(dbjsSrc);
if (!m) { console.error('\nCould not find "const DB_VERSION = <n>;" in db.js'); process.exit(2); }
const oldVer = Number(m[1]);
const newVer = oldVer + 1;

if (!plan.length) {
  console.log('\nNothing changed. DB and DB_VERSION left as they are.');
  db.close();
  process.exit(0);
}
if (dryRun) {
  console.log(`\n--dry-run: ${plan.length} stor${plan.length === 1 ? 'y' : 'ies'} would be written; DB_VERSION ${oldVer} → ${newVer}.`);
  db.close();
  process.exit(0);
}

// ── 4: backup ──────────────────────────────────────────
const stamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
const backupDir = path.join(path.dirname(DB), '_db_backups');
fs.mkdirSync(backupDir, { recursive: true });
db.exec('PRAGMA wal_checkpoint(TRUNCATE);');
const backupFile = path.join(backupDir, `kivilcim.db.${stamp}`);
fs.copyFileSync(DB, backupFile);
const old = fs.readdirSync(backupDir).filter((f) => /^kivilcim\.db\.\d{14}$/.test(f)).sort();
old.slice(0, Math.max(0, old.length - KEEP_BACKUPS)).forEach((f) => fs.unlinkSync(path.join(backupDir, f)));

// ── 5: write in one transaction ────────────────────────
const updText = db.prepare('UPDATE story_translations SET content = ? WHERE story_id = ? AND lang_code = ?');
const updMin = db.prepare(`UPDATE stories SET
  current_read_minutes = MAX(COALESCE(current_read_minutes, 1), ?),
  possible_read_minutes = MAX(COALESCE(possible_read_minutes, 1), ?),
  target_word_count = MAX(COALESCE(target_word_count, 160), ?)
  WHERE id = ?`);
const updVer = db.prepare('UPDATE stories SET version = ? WHERE id = ?');
const upVar = db.prepare(`INSERT INTO story_conversation_variants (story_id, lang_code, punchline, thirty_sec, question, key_contrast)
  VALUES (?, ?, ?, ?, ?, ?)
  ON CONFLICT(story_id, lang_code) DO UPDATE SET
    punchline = excluded.punchline, thirty_sec = excluded.thirty_sec,
    question = excluded.question, key_contrast = excluded.key_contrast`);

db.exec('BEGIN');
try {
  for (const p of plan) {
    if (p.verChanged) updVer.run(STORY_VERSION, p.id);
    if (p.textChanged) {
      updText.run(p.text, p.id, p.lang);
      const minutes = Math.max(1, Math.round(p.words / WPM));
      updMin.run(minutes, minutes, p.words, p.id);
    }
    if (p.varChanged) {
      const v = p.variants;
      upVar.run(p.id, p.lang, v.punchline, v.thirty_sec, v.question, v.key_contrast);
    }
  }
  db.exec('COMMIT');
} catch (e) {
  db.exec('ROLLBACK');
  db.close();
  console.error(`\nWrite failed, nothing changed (rolled back): ${e.message}`);
  process.exit(1);
}

// verify
const bad = plan.filter((p) => p.textChanged && norm(getText.get(p.id, p.lang)?.content) !== p.text);
db.exec('PRAGMA wal_checkpoint(TRUNCATE);');
db.close();
if (bad.length) {
  fs.copyFileSync(backupFile, DB);
  console.error(`\nVerification failed for ${bad.length} stories; DB restored from backup.`);
  process.exit(1);
}

// ── 6: bump DB_VERSION ─────────────────────────────────
const counts = Object.entries(summary).filter(([, s]) => s.changed).map(([l, s]) => `${l} ${s.changed}`).join(', ');
const day = new Date().toISOString().slice(0, 10);
const comment = `// ${newVer}: P1 publish ${day} (${counts}, version ${STORY_VERSION})${note ? ` - ${note.replace(/\n/g, ' ')}` : ''}`;
fs.writeFileSync(DBJS, dbjsSrc.replace(verRe, `const DB_VERSION = ${newVer}; ${comment}`));

// ── 7: log ─────────────────────────────────────────────
const logLine = {
  at: new Date().toISOString(), db_version: newVer, story_version: STORY_VERSION, note,
  backup: path.relative(ROOT, backupFile),
  stories: plan.map((p) => ({ lang: p.lang, id: p.id, text: p.textChanged, variants: p.varChanged, version: p.verChanged })),
};
fs.appendFileSync(path.join(ROOT, 'staging/p1/publish-log.jsonl'), JSON.stringify(logLine) + '\n');

console.log(`\n✓ ${plan.length} stor${plan.length === 1 ? 'y' : 'ies'} written to ${path.relative(ROOT, DB)} (${counts}).`);
console.log(`✓ DB_VERSION ${oldVer} → ${newVer} in ${path.relative(ROOT, DBJS)}.`);
console.log(`  Backup: ${path.relative(ROOT, backupFile)}`);
console.log('  Next: rebuild / reload the app; on launch it copies the new DB to the device.');

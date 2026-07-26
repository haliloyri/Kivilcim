import { createHash } from 'crypto';
import { createRequire } from 'module';
import { copyFileSync, readFileSync, writeFileSync } from 'fs';
import { basename, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const initSqlJs = require('sql.js');
const skillDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = resolve(skillDir, '../../..');
const LANGS = new Set(['tr', 'en', 'es', 'de']);
const ALLOWED_TARGETS = new Map([
  ['story_translations', new Set(['title', 'description', 'content', 'hook'])],
  ['story_conversation_variants', new Set(['punchline', 'thirty_sec', 'question', 'key_contrast'])],
]);

const args = process.argv.slice(2);
const valueOf = (flag) => {
  const index = args.indexOf(flag);
  if (index === -1) return null;
  if (!args[index + 1] || args[index + 1].startsWith('--')) {
    throw new Error(`${flag} requires a value`);
  }
  return args[index + 1];
};

const planArg = valueOf('--plan');
if (!planArg) throw new Error('Usage: --plan <approved-fixes.json> [--db <path>] [--apply]');
const planPath = resolve(planArg);
const dbPath = resolve(valueOf('--db') || resolve(repoRoot, 'assets/kivilcim.db'));
const shouldApply = args.includes('--apply');
const plan = JSON.parse(readFileSync(planPath, 'utf8'));
if (!plan || typeof plan !== 'object' || !Array.isArray(plan.fixes) || !plan.fixes.length) {
  throw new Error('Plan must contain a non-empty fixes array');
}
if (!/^[a-f0-9]{64}$/i.test(plan.databaseSha256 || '')) {
  throw new Error('Plan must contain the audited databaseSha256');
}

const dbBytes = readFileSync(dbPath);
const currentSha256 = createHash('sha256').update(dbBytes).digest('hex');
if (currentSha256 !== plan.databaseSha256) {
  throw new Error(`Database changed since audit: expected ${plan.databaseSha256}, got ${currentSha256}`);
}

const ids = new Set();
for (const fix of plan.fixes) {
  if (!/^YK-\d{3,}$/u.test(fix.id || '')) throw new Error(`Invalid fix id: ${fix.id}`);
  if (ids.has(fix.id)) throw new Error(`Duplicate fix id: ${fix.id}`);
  ids.add(fix.id);
  if (!Number.isSafeInteger(fix.storyId) || fix.storyId <= 0) throw new Error(`${fix.id}: invalid storyId`);
  if (!LANGS.has(fix.lang)) throw new Error(`${fix.id}: unsupported language ${fix.lang}`);
  if (typeof fix.old !== 'string' || !fix.old.length) throw new Error(`${fix.id}: old must be non-empty`);
  if (typeof fix.new !== 'string' || fix.old === fix.new) throw new Error(`${fix.id}: new must differ from old`);
  if (!Number.isSafeInteger(fix.expectedOccurrences) || fix.expectedOccurrences <= 0) {
    throw new Error(`${fix.id}: expectedOccurrences must be a positive integer`);
  }
  if (!Array.isArray(fix.targets) || !fix.targets.length) throw new Error(`${fix.id}: targets are required`);
  const targetKeys = new Set();
  for (const target of fix.targets) {
    if (!ALLOWED_TARGETS.get(target.table)?.has(target.field)) {
      throw new Error(`${fix.id}: target ${target.table}.${target.field} is not allowed`);
    }
    const targetKey = `${target.table}.${target.field}`;
    if (targetKeys.has(targetKey)) throw new Error(`${fix.id}: duplicate target ${targetKey}`);
    targetKeys.add(targetKey);
  }
}

const countOccurrences = (text, needle) => text.split(needle).length - 1;
const markerCounts = (text) => Object.fromEntries(
  ['##', '~~', '::', '$$', '&&'].map((marker) => [marker, countOccurrences(text, marker)]),
);
const SQL = await initSqlJs();
const db = new SQL.Database(dbBytes);
const changes = [];

for (const fix of plan.fixes) {
  for (const target of fix.targets) {
    const select = db.prepare(
      `SELECT ${target.field} AS value FROM ${target.table} WHERE story_id = ? AND lang_code = ?`,
    );
    select.bind([fix.storyId, fix.lang]);
    if (!select.step()) {
      select.free();
      throw new Error(`${fix.id}: no row for ${target.table}, story ${fix.storyId}, ${fix.lang}`);
    }
    const current = select.getAsObject().value;
    select.free();
    if (typeof current !== 'string') throw new Error(`${fix.id}: ${target.table}.${target.field} is not text`);
    const occurrences = countOccurrences(current, fix.old);
    if (occurrences !== fix.expectedOccurrences) {
      throw new Error(
        `${fix.id}: expected ${fix.expectedOccurrences} occurrence(s) in ${target.table}.${target.field}, found ${occurrences}`,
      );
    }
    const updated = current.split(fix.old).join(fix.new);
    if (JSON.stringify(markerCounts(current)) !== JSON.stringify(markerCounts(updated))) {
      throw new Error(`${fix.id}: replacement changes protected story markup tokens`);
    }
    changes.push({ fix, target, updated });
  }
}

console.log(`${shouldApply ? 'Applying' : 'Dry run for'} ${plan.fixes.length} approved item(s):`);
for (const { fix, target } of changes) {
  console.log(`- ${fix.id}: story ${fix.storyId}/${fix.lang} ${target.table}.${target.field}`);
  console.log(`  ${JSON.stringify(fix.old)} -> ${JSON.stringify(fix.new)}`);
}

if (!shouldApply) {
  db.close();
  console.log('Dry run passed. Re-run with --apply only after confirming this exact list.');
  process.exit(0);
}

const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupPath = resolve('/tmp', `${basename(dbPath)}.before-proofread-${stamp}`);
copyFileSync(dbPath, backupPath);

db.run('BEGIN');
try {
  for (const { fix, target, updated } of changes) {
    db.run(
      `UPDATE ${target.table} SET ${target.field} = ? WHERE story_id = ? AND lang_code = ?`,
      [updated, fix.storyId, fix.lang],
    );
  }
  db.run('COMMIT');
} catch (error) {
  db.run('ROLLBACK');
  db.close();
  throw error;
}

const exported = Buffer.from(db.export());
db.close();
writeFileSync(dbPath, exported);
const updatedSha256 = createHash('sha256').update(exported).digest('hex');

console.log(`Applied ${plan.fixes.length} item(s).`);
console.log(`Backup: ${backupPath}`);
console.log(`Updated database SHA-256: ${updatedSha256}`);

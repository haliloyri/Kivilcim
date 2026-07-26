import { createHash } from 'crypto';
import { createRequire } from 'module';
import { readFileSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const initSqlJs = require('sql.js');
const skillDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = resolve(skillDir, '../../..');
const LANGS = ['tr', 'en', 'es', 'de'];

const args = process.argv.slice(2);
const valueOf = (flag) => {
  const index = args.indexOf(flag);
  if (index === -1) return null;
  if (!args[index + 1] || args[index + 1].startsWith('--')) {
    throw new Error(`${flag} requires a value`);
  }
  return args[index + 1];
};

const dbPath = resolve(valueOf('--db') || resolve(repoRoot, 'assets/kivilcim.db'));
const outputPath = valueOf('--output');
const requestedLangs = (valueOf('--langs') || LANGS.join(','))
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);
if (!requestedLangs.length) throw new Error('--langs must contain at least one language');
const unknownLangs = requestedLangs.filter((lang) => !LANGS.includes(lang));
if (unknownLangs.length) throw new Error(`Unsupported languages: ${unknownLangs.join(', ')}`);

const requestedIds = valueOf('--story-ids');
const storyIds = requestedIds
  ? requestedIds.split(',').map((value) => Number.parseInt(value.trim(), 10))
  : [];
if (storyIds.some((value) => !Number.isSafeInteger(value) || value <= 0)) {
  throw new Error('--story-ids must be a comma-separated list of positive integers');
}

const integerValueOf = (flag, { allowZero = false, max = Number.MAX_SAFE_INTEGER } = {}) => {
  const raw = valueOf(flag);
  if (raw == null) return null;
  const value = Number(raw);
  const minimum = allowZero ? 0 : 1;
  if (!Number.isSafeInteger(value) || value < minimum || value > max) {
    throw new Error(`${flag} must be an integer between ${minimum} and ${max}`);
  }
  return value;
};
const afterStoryId = integerValueOf('--after-story-id', { allowZero: true }) ?? 0;
const batchLimit = integerValueOf('--limit', { max: 500 });
if (storyIds.length && (args.includes('--after-story-id') || args.includes('--limit'))) {
  throw new Error('--story-ids cannot be combined with --after-story-id or --limit');
}

const bytes = readFileSync(dbPath);
const databaseSha256 = createHash('sha256').update(bytes).digest('hex');
const SQL = await initSqlJs();
const db = new SQL.Database(bytes);
const catalogStoryCount = Number(db.exec('SELECT COUNT(*) FROM stories')[0]?.values?.[0]?.[0] ?? 0);

const hasVariants = Boolean(db.exec(
  "SELECT 1 FROM sqlite_master WHERE type='table' AND name='story_conversation_variants' LIMIT 1",
)[0]?.values?.length);

const placeholders = (values) => values.map(() => '?').join(', ');
const inventoryConditions = [];
const inventoryParams = [];
if (storyIds.length) {
  inventoryConditions.push(`id IN (${placeholders(storyIds)})`);
  inventoryParams.push(...storyIds);
} else if (afterStoryId > 0) {
  inventoryConditions.push('id > ?');
  inventoryParams.push(afterStoryId);
}
const inventoryLimit = !storyIds.length && batchLimit != null ? ` LIMIT ${batchLimit + 1}` : '';
const inventoryQuery = `SELECT id FROM stories${
  inventoryConditions.length ? ` WHERE ${inventoryConditions.join(' AND ')}` : ''
} ORDER BY id${inventoryLimit}`;
const inventoryStatement = db.prepare(inventoryQuery);
if (inventoryParams.length) inventoryStatement.bind(inventoryParams);
const inventoryCandidates = [];
while (inventoryStatement.step()) {
  inventoryCandidates.push(Number(inventoryStatement.getAsObject().id));
}
inventoryStatement.free();

const hasMore = !storyIds.length && batchLimit != null && inventoryCandidates.length > batchLimit;
const allStoryIds = hasMore ? inventoryCandidates.slice(0, batchLimit) : inventoryCandidates;
const conditions = [`st.lang_code IN (${placeholders(requestedLangs)})`];
const params = [...requestedLangs];
if (allStoryIds.length) {
  conditions.push(`s.id IN (${placeholders(allStoryIds)})`);
  params.push(...allStoryIds);
} else {
  conditions.push('1 = 0');
}

const variantColumns = hasVariants
  ? `scv.punchline, scv.thirty_sec, scv.question, scv.key_contrast`
  : `NULL AS punchline, NULL AS thirty_sec, NULL AS question, NULL AS key_contrast`;
const variantJoin = hasVariants
  ? `LEFT JOIN story_conversation_variants scv ON scv.story_id = s.id AND scv.lang_code = st.lang_code`
  : '';

const query = `
  SELECT
    s.id AS story_id,
    s.book_no,
    s.version,
    st.lang_code,
    st.title,
    st.description,
    st.content,
    st.hook,
    ${variantColumns}
  FROM stories s
  JOIN story_translations st ON st.story_id = s.id
  ${variantJoin}
  WHERE ${conditions.join(' AND ')}
  ORDER BY s.id,
    CASE st.lang_code WHEN 'tr' THEN 1 WHEN 'en' THEN 2 WHEN 'es' THEN 3 WHEN 'de' THEN 4 ELSE 5 END
`;

const statement = db.prepare(query);
statement.bind(params);
const records = [];
while (statement.step()) records.push(statement.getAsObject());
statement.free();

const countsByLanguage = Object.fromEntries(
  requestedLangs.map((lang) => [lang, records.filter((record) => record.lang_code === lang).length]),
);
const presentByStory = new Map();
for (const record of records) {
  const id = Number(record.story_id);
  if (!presentByStory.has(id)) presentByStory.set(id, new Set());
  presentByStory.get(id).add(record.lang_code);
}
const missingLanguages = [];
for (const storyId of allStoryIds) {
  const present = presentByStory.get(storyId) || new Set();
  const missing = requestedLangs.filter((lang) => !present.has(lang));
  if (missing.length) missingLanguages.push({ storyId, missing });
}

const textFields = [
  'title', 'description', 'content', 'hook',
  'punchline', 'thirty_sec', 'question', 'key_contrast',
];
const emptyFields = [];
for (const record of records) {
  for (const field of textFields) {
    if (record[field] == null || String(record[field]).trim() === '') {
      emptyFields.push({ storyId: Number(record.story_id), lang: record.lang_code, field });
    }
  }
}

const result = {
  metadata: {
    database: dbPath,
    databaseSha256,
    languages: requestedLangs,
    catalogStoryCount,
    storyCount: allStoryIds.length,
    recordCount: records.length,
    countsByLanguage,
    batch: {
      mode: storyIds.length ? 'explicit' : 'sequential',
      afterStoryId: storyIds.length ? null : afterStoryId,
      limit: storyIds.length ? null : batchLimit,
      firstStoryId: allStoryIds[0] ?? null,
      lastStoryId: allStoryIds.at(-1) ?? null,
      hasMore,
      nextAfterStoryId: hasMore ? allStoryIds.at(-1) : null,
    },
    missingLanguages,
    emptyFields,
  },
  records,
};

db.close();
const serialized = `${JSON.stringify(result, null, 2)}\n`;
if (outputPath) {
  writeFileSync(resolve(outputPath), serialized, 'utf8');
  const emptyFieldsByField = Object.fromEntries(
    textFields.map((field) => [field, emptyFields.filter((item) => item.field === field).length]),
  );
  console.log(JSON.stringify({
    database: result.metadata.database,
    databaseSha256: result.metadata.databaseSha256,
    languages: result.metadata.languages,
    catalogStoryCount: result.metadata.catalogStoryCount,
    storyCount: result.metadata.storyCount,
    recordCount: result.metadata.recordCount,
    countsByLanguage: result.metadata.countsByLanguage,
    batch: result.metadata.batch,
    missingLanguageStoryCount: missingLanguages.length,
    emptyFieldCount: emptyFields.length,
    emptyFieldsByField,
  }, null, 2));
  console.log(`Exported ${records.length} records to ${resolve(outputPath)}`);
} else {
  process.stdout.write(serialized);
}

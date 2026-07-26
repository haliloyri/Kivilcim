import { createRequire } from 'node:module';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const require = createRequire(import.meta.url);
const initSqlJs = require('sql.js');

const root = resolve(import.meta.dirname, '..');
const scoreDir = resolve(root, '.tmp_story_scores');
const outputDir = resolve(root, 'outputs/019f7658-2a53-7d03-a6cd-c328470495f5');
const scoreFiles = [
  'score_1059_1245.json',
  'score_1246_1432.json',
  'score_1433_1619.json',
  'score_1620_1808.json',
];
const scoreKeys = ['hook', 'emotion', 'share', 'save', 'voice', 'arc', 'video', 'trust'];
const caps = { hook: 15, emotion: 10, share: 15, save: 15, voice: 10, arc: 10, video: 20, trust: 5 };

const scores = scoreFiles.flatMap((file) => JSON.parse(readFileSync(resolve(scoreDir, file), 'utf8')));
const ids = scores.map((row) => Number(row.story_id));
const uniqueIds = new Set(ids);
const expectedIds = Array.from({ length: 750 }, (_, index) => 1059 + index);
const missingIds = expectedIds.filter((id) => !uniqueIds.has(id));
const extraIds = [...uniqueIds].filter((id) => id < 1059 || id > 1808);
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);

if (scores.length !== 750 || uniqueIds.size !== 750 || missingIds.length || extraIds.length || duplicateIds.length) {
  throw new Error(`Score coverage failed: rows=${scores.length}, unique=${uniqueIds.size}, missing=${missingIds}, extra=${extraIds}, duplicate=${duplicateIds}`);
}

for (const row of scores) {
  for (const key of scoreKeys) {
    const value = row[key];
    if (!Number.isInteger(value) || value < 0 || value > caps[key]) {
      throw new Error(`Invalid ${key}=${value} for story ${row.story_id}`);
    }
  }
  if (!row.reason || typeof row.reason !== 'string') {
    throw new Error(`Missing reason for story ${row.story_id}`);
  }
}

const SQL = await initSqlJs();
const db = new SQL.Database(readFileSync(resolve(root, 'assets/kivilcim.db')));
const result = db.exec(`
  SELECT
    s.id,
    CAST(COALESCE(s.version, 1) AS TEXT) AS version,
    COALESCE(ct.translation, c.category_name, '') AS main_category,
    COALESCE(sub.subcategory_name, '') AS subcategory,
    COALESCE(bt.title, '') AS book_title,
    COALESCE(b.author, '') AS author,
    COALESCE(b.publish_year, '') AS publish_year,
    st.title,
    st.description,
    st.content,
    COALESCE(st.hook, '') AS hook_text,
    COALESCE(v.punchline, '') AS punchline,
    COALESCE(v.thirty_sec, '') AS thirty_sec,
    COALESCE(v.question, '') AS question,
    COALESCE(v.key_contrast, '') AS key_contrast
  FROM stories s
  JOIN story_translations st ON st.story_id = s.id AND st.lang_code = 'tr'
  LEFT JOIN books b ON b.list_no = s.book_no
  LEFT JOIN book_translations bt ON bt.book_id = b.id AND bt.lang_code = 'tr'
  LEFT JOIN subcategories sub ON sub.id = b.category_id
  LEFT JOIN categories c ON c.id = sub.categori_id
  LEFT JOIN categories_translations ct ON ct.category_id = c.id AND ct.language = 'tr'
  LEFT JOIN story_conversation_variants v ON v.story_id = s.id AND v.lang_code = 'tr'
  ORDER BY s.id
`)[0];

const metadata = new Map(result.values.map((values) => {
  const [storyId, version, mainCategory, subcategory, bookTitle, author, publishYear, title, description, content, hookText, punchline, thirtySec, question, keyContrast] = values;
  return [storyId, {
    story_id: storyId,
    version,
    main_category: mainCategory,
    subcategory,
    book_title: bookTitle,
    author,
    publish_year: publishYear,
    title,
    description,
    content,
    hook_text: hookText,
    punchline,
    thirty_sec: thirtySec,
    question,
    key_contrast: keyContrast,
    readiness: hookText && punchline && thirtySec && question && keyContrast ? 'Zengin' : 'Temel',
  }];
}));

const decisionFor = (total) => {
  if (total >= 90) return 'Öncelikli video';
  if (total >= 85) return 'Video kuyruğu';
  if (total >= 78) return 'Revize et';
  if (total >= 70) return 'Kartla test';
  return 'Düşük öncelik';
};

const formatFor = (row, total) => {
  if (total >= 85 && row.video >= 16 && row.save >= 12 && row.share >= 12) return 'Reel + Carousel';
  if (total >= 85 && row.video >= 16 && row.voice >= 8) return 'Soru odaklı Reel';
  if (total >= 85 && row.video >= 16) return 'Reel / Short';
  if (row.save >= 11) return 'Carousel';
  return 'Kart testi';
};

const merged = scores.map((score) => {
  const meta = metadata.get(Number(score.story_id));
  if (!meta) throw new Error(`Missing metadata for story ${score.story_id}`);
  const total = scoreKeys.reduce((sum, key) => sum + score[key], 0);
  return {
    ...meta,
    ...score,
    total,
    decision: decisionFor(total),
    recommended_format: formatFor(score, total),
    fact_check_note: score.trust <= 3 ? 'Kaynak kontrolü şart' : score.trust === 4 ? 'Kaynak kontrolü önerilir' : 'Standart doğrulama',
  };
}).sort((a, b) => b.total - a.total || b.video - a.video || b.share - a.share || a.story_id - b.story_id);

mkdirSync(outputDir, { recursive: true });
writeFileSync(resolve(outputDir, 'all_story_viral_scores.json'), `${JSON.stringify(merged, null, 2)}\n`);

const csvEscape = (value) => {
  const text = String(value ?? '');
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};
const csvColumns = [
  'rank', 'story_id', 'title', 'main_category', 'subcategory', 'book_title', 'author', 'version', 'readiness',
  'hook', 'emotion', 'share', 'save', 'voice', 'arc', 'video', 'trust', 'total', 'decision',
  'recommended_format', 'reason', 'fact_check_note',
];
const csvRows = merged.map((row, index) => csvColumns.map((column) => csvEscape(column === 'rank' ? index + 1 : row[column])).join(','));
writeFileSync(resolve(outputDir, 'hikaye_viral_puanlari.csv'), `${csvColumns.join(',')}\n${csvRows.join('\n')}\n`);

const totals = merged.map((row) => row.total);
console.log(JSON.stringify({
  rows: merged.length,
  min: Math.min(...totals),
  max: Math.max(...totals),
  average: Number((totals.reduce((a, b) => a + b, 0) / totals.length).toFixed(2)),
  median: totals.slice().sort((a, b) => a - b)[Math.floor(totals.length / 2)],
  atLeast90: totals.filter((value) => value >= 90).length,
  atLeast85: totals.filter((value) => value >= 85).length,
  enriched: merged.filter((row) => row.readiness === 'Zengin').length,
}, null, 2));

import { createRequire } from 'module';
import { readFileSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const initSqlJs = require('sql.js');
const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dbPath = resolve(rootDir, 'assets/kivilcim.db');
const titlesPath = resolve(rootDir, 'HIKAYE_BASLIKLARI.md');

const targets = {
  1: { words: 160, tolerance: 40 },
  3: { words: 475, tolerance: 75 },
  5: { words: 800, tolerance: 100 },
};

const shortSignals = /deney|kural|tek kelime|tek soru|alışkanlık|yanılsama|önyargı|bedava|madalya|farkı|neden|nasıl|mit|ders|prensip|formül/i;
const longSignals = /savaş|imparatorluk|yolculuk|felaket|çöküş|kriz|devrim|kurtuluş|fetih|salgın|tarih|şirket|kurucu|toplum|uygarlık|medeniyet|keşif|operasyon|ekip|lider|şehir|ülke|dünya/i;
const complexCategories = new Set(['Tarih', 'Bilim', 'Liderlik']);

const classifyDuration = (title, category) => {
  let complexity = 0;
  if (complexCategories.has(category)) complexity += 1;
  if (longSignals.test(title)) complexity += 2;
  if (title.length >= 58) complexity += 1;
  if (shortSignals.test(title)) complexity -= 2;

  if (complexity >= 3) return 5;
  if (complexity <= 0) return 1;
  return 3;
};

const SQL = await initSqlJs();
const db = new SQL.Database(readFileSync(dbPath));
const columns = db.exec('PRAGMA table_info(stories)')[0].values.map((row) => row[1]);

if (!columns.includes('current_read_minutes')) {
  db.run('ALTER TABLE stories ADD COLUMN current_read_minutes INTEGER DEFAULT 1');
}
if (!columns.includes('possible_read_minutes')) {
  db.run('ALTER TABLE stories ADD COLUMN possible_read_minutes INTEGER DEFAULT 1');
}
if (!columns.includes('target_word_count')) {
  db.run('ALTER TABLE stories ADD COLUMN target_word_count INTEGER DEFAULT 160');
}
if (!columns.includes('target_word_tolerance')) {
  db.run('ALTER TABLE stories ADD COLUMN target_word_tolerance INTEGER DEFAULT 40');
}

const storyVersions = new Map();
const versionRows = db.exec('SELECT id, COALESCE(version, 1) FROM stories')[0].values;
for (const [storyId, version] of versionRows) storyVersions.set(Number(storyId), Number(version));

const lines = readFileSync(titlesPath, 'utf8').split('\n');
let currentCategory = '';
let dbUpdates = 0;
let topicCount = 0;
const durationCounts = { 1: 0, 3: 0, 5: 0 };

const updatedLines = lines.map((rawLine) => {
  const categoryMatch = rawLine.match(/^\*\*Kategori:\*\*\s*(.+?)\s{0,2}$/);
  if (categoryMatch) {
    currentCategory = categoryMatch[1].trim();
    return rawLine;
  }

  if (!/^\d+\. \[[ x]\]/.test(rawLine)) return rawLine;

  const line = rawLine.replace(/\s+— \*\*Mevcut süre:.*$/, '');
  const titleMatch = line.match(/\*\* — (.+?) — \*\*Sohbet puanı:/);
  if (!titleMatch) return rawLine;

  const title = titleMatch[1].trim();
  const storyIdMatch = line.match(/`story_id:(\d+)`/);
  const storyId = storyIdMatch ? Number(storyIdMatch[1]) : null;
  const plannedDuration = classifyDuration(title, currentCategory);
  let currentDuration = plannedDuration;
  let possibleDuration = plannedDuration;

  if (storyId) {
    const version = storyVersions.get(storyId) || 1;
    currentDuration = 1;
    possibleDuration = version >= 2 ? 1 : plannedDuration;
    const target = targets[possibleDuration];
    db.run(
      `UPDATE stories
       SET current_read_minutes = ?, possible_read_minutes = ?,
           target_word_count = ?, target_word_tolerance = ?
       WHERE id = ?`,
      [currentDuration, possibleDuration, target.words, target.tolerance, storyId]
    );
    dbUpdates += 1;
  }

  const target = targets[possibleDuration];
  durationCounts[possibleDuration] += 1;
  topicCount += 1;
  return `${line} — **Mevcut süre: ${currentDuration} dk** · **Olası süre: ${possibleDuration} dk** · **Kelime hedefi: ${target.words} ±${target.tolerance}**`;
});

writeFileSync(titlesPath, `${updatedLines.join('\n').replace(/\n+$/, '')}\n`, 'utf8');
writeFileSync(dbPath, Buffer.from(db.export()));
db.close();

console.log(JSON.stringify({ topicCount, dbUpdates, durationCounts }));

import { createHash } from 'crypto';
import { createRequire } from 'module';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const initSqlJs = require('sql.js');
const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, '../../../..');

const args = process.argv.slice(2);
const hasFlag = (flag) => args.includes(flag);
const valueOf = (flag) => {
  const index = args.indexOf(flag);
  if (index === -1) return null;
  const value = args[index + 1];
  if (!value || value.startsWith('--')) throw new Error(`${flag} için bir değer gerekli.`);
  return value;
};

if (hasFlag('--help')) {
  console.log(`Kullanım:
  node prepare-story-video.mjs --title "Hikâye adı" [--lang tr] [--profile story-reel|short-rerender] [--output-root KLASÖR] [--dry-run]
  node prepare-story-video.mjs --story-id 1067 [--lang tr] [--profile story-reel|short-rerender] [--output-root KLASÖR] [--dry-run]`);
  process.exit(0);
}

const lang = valueOf('--lang') || 'tr';
if (lang !== 'tr') throw new Error('Bu üretim akışı yalnızca Türkçe (tr) için yapılandırılmıştır.');
const profile = valueOf('--profile') || 'story-reel';
if (!['story-reel', 'short-rerender'].includes(profile)) {
  throw new Error('--profile story-reel veya short-rerender olmalıdır.');
}
const isShortRerender = profile === 'short-rerender';

const rawStoryId = valueOf('--story-id');
const storyId = rawStoryId == null ? null : Number.parseInt(rawStoryId, 10);
if (rawStoryId != null && (!Number.isSafeInteger(storyId) || storyId <= 0)) {
  throw new Error('--story-id pozitif bir tam sayı olmalıdır.');
}

const requestedTitle = valueOf('--title');
if (storyId == null && !requestedTitle) {
  throw new Error('--title veya --story-id parametrelerinden biri gereklidir.');
}
if (storyId != null && requestedTitle) {
  throw new Error('--title ve --story-id aynı anda kullanılamaz.');
}

const dbPath = resolve(valueOf('--db') || resolve(repoRoot, 'assets/kivilcim.db'));
const outputRoot = resolve(valueOf('--output-root') || resolve(repoRoot, 'artifacts/story-videos'));
const dbBytes = readFileSync(dbPath);
const databaseSha256 = createHash('sha256').update(dbBytes).digest('hex');
const SQL = await initSqlJs();
const db = new SQL.Database(dbBytes);

const query = `
  SELECT
    s.id AS story_id,
    s.book_no,
    s.version,
    s.current_read_minutes,
    s.possible_read_minutes,
    st.lang_code,
    st.title,
    st.description,
    st.content,
    st.hook,
    scv.punchline,
    scv.thirty_sec,
    scv.question,
    scv.key_contrast,
    b.id AS book_id,
    b.author,
    b.publish_year,
    bt.title AS book_title,
    bt.category_name
  FROM stories s
  JOIN story_translations st
    ON st.story_id = s.id AND st.lang_code = ?
  LEFT JOIN story_conversation_variants scv
    ON scv.story_id = s.id AND scv.lang_code = st.lang_code
  LEFT JOIN books b ON b.list_no = s.book_no
  LEFT JOIN book_translations bt
    ON bt.book_id = b.id AND bt.lang_code = st.lang_code
  ORDER BY s.id
`;

const statement = db.prepare(query);
statement.bind([lang]);
const stories = [];
while (statement.step()) stories.push(statement.getAsObject());
statement.free();
db.close();

const normalize = (value) => String(value || '')
  .toLocaleLowerCase('tr-TR')
  .replaceAll('ı', 'i')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim()
  .replace(/\s+/g, ' ');

const levenshtein = (left, right) => {
  const a = normalize(left);
  const b = normalize(right);
  const row = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    let previous = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const saved = row[j];
      const substitution = previous + (a[i - 1] === b[j - 1] ? 0 : 1);
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, substitution);
      previous = saved;
    }
  }
  return row[b.length];
};

const similarity = (candidate, requested) => {
  const left = normalize(candidate);
  const right = normalize(requested);
  if (!left || !right) return 0;
  if (left === right) return 1;
  const maxLength = Math.max(left.length, right.length);
  const editScore = 1 - (levenshtein(left, right) / maxLength);
  const leftTokens = new Set(left.split(' '));
  const rightTokens = new Set(right.split(' '));
  const intersection = [...leftTokens].filter((token) => rightTokens.has(token)).length;
  const union = new Set([...leftTokens, ...rightTokens]).size;
  const tokenScore = union ? intersection / union : 0;
  const containment = left.includes(right) || right.includes(left) ? 0.95 : 0;
  return Math.max(containment, (editScore * 0.7) + (tokenScore * 0.3));
};

let story = null;
if (storyId != null) {
  story = stories.find((item) => Number(item.story_id) === storyId) || null;
} else {
  const normalizedRequest = normalize(requestedTitle);
  const exactMatches = stories.filter((item) => normalize(item.title) === normalizedRequest);
  if (exactMatches.length === 1) story = exactMatches[0];
}

if (!story) {
  const candidates = stories
    .map((item) => ({
      storyId: Number(item.story_id),
      title: item.title,
      score: requestedTitle ? similarity(item.title, requestedTitle) : 0,
    }))
    .sort((a, b) => b.score - a.score || a.storyId - b.storyId)
    .slice(0, 5);

  console.error(JSON.stringify({
    error: storyId != null ? 'story_id bulunamadı' : 'Başlık tam olarak eşleşmedi',
    requested: storyId != null ? { storyId } : { title: requestedTitle },
    candidates,
    nextStep: 'Adaylardan doğru story_id değerini seçip komutu --story-id ile yeniden çalıştırın.',
  }, null, 2));
  process.exit(2);
}

const slugify = (value) => normalize(value).replaceAll(' ', '-').slice(0, 72) || `story-${story.story_id}`;
const createdAt = new Date().toISOString();
const runId = createdAt.replace(/\D/g, '').slice(0, 17);
const projectDir = resolve(
  outputRoot,
  `${Number(story.story_id)}-${slugify(story.title)}`,
  runId,
);

const source = {
  schemaVersion: 1,
  database: dbPath,
  databaseSha256,
  extractedAt: createdAt,
  story: {
    storyId: Number(story.story_id),
    language: story.lang_code,
    title: story.title || '',
    description: story.description || '',
    content: story.content || '',
    hook: story.hook || '',
    conversation: {
      punchline: story.punchline || '',
      thirtySec: story.thirty_sec || '',
      question: story.question || '',
      keyContrast: story.key_contrast || '',
    },
    book: {
      listNo: Number(story.book_no),
      bookId: story.book_id == null ? null : Number(story.book_id),
      title: story.book_title || '',
      author: story.author || '',
      publishYear: story.publish_year || '',
      category: story.category_name || '',
    },
  },
};

const project = {
  schemaVersion: 1,
  projectDir,
  createdAt,
  updatedAt: createdAt,
  status: 'HAZIRLANIYOR',
  language: 'tr',
  platform: 'instagram-reels',
  story: {
    storyId: source.story.storyId,
    title: source.story.title,
  },
  source: {
    database: dbPath,
    databaseSha256,
  },
  production: {
    mode: profile,
    reuseExistingVisuals: false,
    aspectRatio: '9:16',
    width: 1080,
    height: 1920,
    fps: 30,
    targetDurationSeconds: isShortRerender ? 15 : 45,
    adaptiveDurationSeconds: isShortRerender
      ? { min: 12, max: 20 }
      : { min: 35, max: 55 },
    targetSceneCount: isShortRerender ? 5 : 8,
  },
  files: {
    source: 'source.json',
    status: 'STATUS.md',
    creativeBrief: '01-yaratici-brief.md',
    voiceover: '02-seslendirme.txt',
    shotList: '03-sahne-plani.md',
    visualPrompts: '04-gorsel-promptlar.md',
    socialCaption: '05-paylasim-metni.md',
    subtitles: '06-altyazilar.srt',
    renderPlan: '07-render-plani.json',
    imagesDir: 'images',
    narration: 'audio/narration.aiff',
    finalVideo: 'final/reel.mp4',
    cover: 'final/cover.jpg',
  },
  approval: null,
  history: [
    { status: 'HAZIRLANIYOR', at: createdAt, note: 'Proje oluşturuldu.' },
  ],
};

const summary = {
  storyId: source.story.storyId,
  title: source.story.title,
  language: source.story.language,
  book: source.story.book.title,
  author: source.story.book.author,
  databaseSha256,
  projectDir,
  profile,
  targetDurationSeconds: project.production.targetDurationSeconds,
  adaptiveDurationSeconds: project.production.adaptiveDurationSeconds,
  dryRun: hasFlag('--dry-run'),
};

if (hasFlag('--dry-run')) {
  console.log(JSON.stringify(summary, null, 2));
  process.exit(0);
}

mkdirSync(resolve(projectDir, 'images'), { recursive: true });
mkdirSync(resolve(projectDir, 'audio'), { recursive: true });
mkdirSync(resolve(projectDir, 'final'), { recursive: true });
writeFileSync(resolve(projectDir, 'source.json'), `${JSON.stringify(source, null, 2)}\n`, 'utf8');
writeFileSync(resolve(projectDir, 'project.json'), `${JSON.stringify(project, null, 2)}\n`, 'utf8');
writeFileSync(resolve(projectDir, 'STATUS.md'), `# Video Proje Durumu\n\n- Durum: \`HAZIRLANIYOR\`\n- Hikâye: ${source.story.title}\n- story_id: ${source.story.storyId}\n- Dil: \`tr\`\n- Oluşturulma: ${createdAt}\n- Kaynak SHA-256: \`${databaseSha256}\`\n- Onay: Henüz alınmadı\n`, 'utf8');

console.log(JSON.stringify(summary, null, 2));

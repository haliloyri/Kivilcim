#!/usr/bin/env node
// Submits a Batch API job that writes the P1 story .md AND the
// conversation_variants .json for each story, IN ONE request per story
// (cheaper than two separate calls — see HIKAYE_DONUSUM_PLANI.md §6).
//
// Usage:
//   node batch/05-submit-stories.mjs en --all
//   node batch/05-submit-stories.mjs en 1707 1731
//   node batch/05-submit-stories.mjs tr --all --model claude-sonnet-5
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { submitBatch } from './lib/anthropic.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const lang = args[0];

// Keep these in sync with scripts/p1/validate.mjs (RANGES / BANNED).
const LANG_CONFIG = {
  en: {
    name: 'English', address: '"you"',
    len: { open: '35–90', story: '280–700', lessons: '140–300', reflect: '50–160', use: '80–240' },
    banned: ['delve', 'tapestry', "in today's fast-paced world", 'embark on a journey', 'game-changer', 'let that sink in'],
  },
  tr: {
    name: 'Turkish', address: '"siz"',
    len: { open: '30–75', story: '230–560', lessons: '110–240', reflect: '40–130', use: '70–190' },
    banned: ['günümüz dünyasında', 'unutmayın ki', 'sonuç olarak', 'mekanik bir reçete'],
  },
  es: {
    name: 'Spanish (neutral, avoid regional slang)', address: '"tú"',
    len: { open: '35–95', story: '300–740', lessons: '150–320', reflect: '50–170', use: '80–250' },
    banned: ['en el mundo actual', 'en conclusión', 'es importante destacar', 'sumergirnos'],
  },
  de: {
    name: 'German', address: '"du"',
    len: { open: '30–90', story: '270–680', lessons: '130–290', reflect: '45–155', use: '75–230' },
    banned: ['in der heutigen schnelllebigen welt', 'zusammenfassend lässt sich sagen', 'eintauchen'],
  },
};

if (!lang || !LANG_CONFIG[lang]) {
  console.error(`usage: node batch/05-submit-stories.mjs <${Object.keys(LANG_CONFIG).join('|')}> --all | <story_id ...>`);
  process.exit(2);
}
const cfg = LANG_CONFIG[lang];

const modelIdx = args.indexOf('--model');
const model = modelIdx !== -1 ? args[modelIdx + 1] : (process.env.ANTHROPIC_MODEL || 'claude-opus-5-5');
const wantAll = args.includes('--all');
const ids = args.filter((a) => /^\d+$/.test(a)).map(Number);
const limitIdx = args.indexOf('--limit');
const limit = limitIdx !== -1 ? Number(args[limitIdx + 1]) : null;

const briefDir = path.join(ROOT, 'staging/p1/brief');
const outDir = path.join(ROOT, 'staging/p1', lang);
fs.mkdirSync(outDir, { recursive: true });

const briefIds = fs.readdirSync(briefDir).filter((f) => f.endsWith('.json')).map((f) => Number(f.replace(/\.json$/, '')));
const doneIds = new Set(fs.existsSync(outDir) ? fs.readdirSync(outDir).filter((f) => f.endsWith('.md')).map((f) => Number(f.replace(/\.md$/, ''))) : []);
let targetIds = (wantAll ? briefIds.filter((id) => !doneIds.has(id)) : ids.filter((id) => briefIds.includes(id)));
if (limit) targetIds = targetIds.slice(0, limit);

if (!targetIds.length) {
  console.log('Nothing to submit. Make sure staging/p1/brief/<id>.json exists first (02/04 scripts), and pass --all or explicit ids.');
  process.exit(0);
}

const template = fs.readFileSync(path.join(ROOT, 'batch/prompts/story-instructions.md'), 'utf8');
const instructions = template
  .replaceAll('{LANG_NAME}', cfg.name)
  .replaceAll('{ADDRESS_FORM}', cfg.address)
  .replaceAll('{BANNED_PHRASES}', cfg.banned.map((p) => `"${p}"`).join(', '))
  .replaceAll('{LEN_OPEN}', cfg.len.open)
  .replaceAll('{LEN_STORY}', cfg.len.story)
  .replaceAll('{LEN_LESSONS}', cfg.len.lessons)
  .replaceAll('{LEN_REFLECT}', cfg.len.reflect)
  .replaceAll('{LEN_USE}', cfg.len.use);

const requests = targetIds.map((id) => {
  const brief = JSON.parse(fs.readFileSync(path.join(briefDir, `${id}.json`), 'utf8'));
  return {
    customId: `story-${lang}-${id}`,
    model,
    maxTokens: 8000,
    system: instructions,
    messages: [{ role: 'user', content: `Content brief:\n\`\`\`json\n${JSON.stringify(brief, null, 2)}\n\`\`\`` }],
  };
});

const batch = await submitBatch(requests);
console.log(`Submitted ${requests.length} story requests (lang: ${lang}). Batch id: ${batch.id}`);
console.log(`Model: ${model}`);
console.log(`\nCheck status:   node batch/03-check-batch.mjs ${batch.id}`);
console.log(`Fetch results:  node batch/06-fetch-stories.mjs ${batch.id} ${lang}`);

fs.writeFileSync(
  path.join(ROOT, `staging/p1/.last-story-batch-${lang}.json`),
  JSON.stringify({ id: batch.id, lang, model, count: requests.length, submitted_at: new Date().toISOString() }, null, 2),
);

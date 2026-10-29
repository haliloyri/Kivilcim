#!/usr/bin/env node
// Submits a Batch API job that writes the P1 story .md AND the
// conversation_variants .json for each story, IN ONE request per story
// (cheaper than two separate calls — see HIKAYE_DONUSUM_PLANI.md §6).
//
// Usage:
//   node batch/05-submit-stories.mjs en --all
//   node batch/05-submit-stories.mjs en 1707 1731
//   node batch/05-submit-stories.mjs tr --all --model claude-sonnet-5
//   node batch/05-submit-stories.mjs en,tr,es,de 1059 1060     (all languages of a story in ONE batch)
//
// Prompt caching (on by default): the instructions and the brief are sent as
// cacheable blocks BEFORE the language-specific settings, so every language of
// the same story, and every story, shares one cached prefix. Submit all
// languages in one batch (comma list) to maximise cache hits.
// Flags: --no-cache (old per-language prompt, no sharing), --cache-1h (1-hour TTL),
//        --dry (build requests, print stats, do not call the API)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { submitBatch } from './lib/anthropic.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const langArg = args[0];

// Keep these in sync with scripts/p1/validate.mjs (RANGES / BANNED).
const LANG_CONFIG = {
  en: {
    name: 'English', address: '"you"',
    len: { open: '40–80', story: '340–520', lessons: '100–180', reflect: '40–90', use: '70–150', total: '650–950' },
    banned: ['delve', 'tapestry', "in today's fast-paced world", 'embark on a journey', 'game-changer', 'let that sink in'],
  },
  tr: {
    name: 'Turkish', address: '"siz"',
    len: { open: '32–64', story: '270–415', lessons: '80–145', reflect: '32–72', use: '56–120', total: '520–760' },
    banned: ['günümüz dünyasında', 'unutmayın ki', 'sonuç olarak', 'mekanik bir reçete'],
  },
  es: {
    name: 'Spanish (neutral, avoid regional slang)', address: '"tú"',
    len: { open: '43–86', story: '365–555', lessons: '107–193', reflect: '43–96', use: '75–160', total: '700–1010' },
    banned: ['en el mundo actual', 'en conclusión', 'es importante destacar', 'sumergirnos'],
  },
  de: {
    name: 'German', address: '"du"',
    len: { open: '38–77', story: '325–500', lessons: '96–173', reflect: '38–86', use: '67–144', total: '620–910' },
    banned: ['in der heutigen schnelllebigen welt', 'zusammenfassend lässt sich sagen', 'eintauchen'],
  },
};

const langs = (langArg || '').split(',').filter(Boolean);
if (!langs.length || langs.some((l) => !LANG_CONFIG[l])) {
  console.error(`usage: node batch/05-submit-stories.mjs <${Object.keys(LANG_CONFIG).join('|')}[,...]> --all | <story_id ...> [--no-cache] [--cache-1h] [--dry]`);
  process.exit(2);
}

const modelIdx = args.indexOf('--model');
const model = modelIdx !== -1 ? args[modelIdx + 1] : (process.env.ANTHROPIC_MODEL || 'claude-opus-5-5');
const wantAll = args.includes('--all');
const noCache = args.includes('--no-cache');
const dry = args.includes('--dry');
const cacheControl = { type: 'ephemeral', ...(args.includes('--cache-1h') ? { ttl: '1h' } : {}) };
const ids = args.filter((a) => /^\d+$/.test(a)).map(Number);
const limitIdx = args.indexOf('--limit');
const limit = limitIdx !== -1 ? Number(args[limitIdx + 1]) : null;

const briefDir = path.join(ROOT, 'staging/p1/brief');
const briefIds = fs.readdirSync(briefDir).filter((f) => f.endsWith('.json')).map((f) => Number(f.replace(/\.json$/, '')));
const doneFor = (lang) => {
  const dir = path.join(ROOT, 'staging/p1', lang);
  fs.mkdirSync(dir, { recursive: true });
  return new Set(fs.readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => Number(f.replace(/\.md$/, ''))));
};
const todo = {}; // lang -> Set(ids)
langs.forEach((lang) => {
  const done = doneFor(lang);
  let list = wantAll ? briefIds.filter((id) => !done.has(id)) : ids.filter((id) => briefIds.includes(id));
  if (limit) list = list.slice(0, limit);
  todo[lang] = new Set(list);
});
const storyOrder = [...new Set(langs.flatMap((l) => [...todo[l]]))].sort((a, b) => a - b);

if (!storyOrder.length) {
  console.log('Nothing to submit. Make sure staging/p1/brief/<id>.json exists first (02/04 scripts), and pass --all or explicit ids.');
  process.exit(0);
}

const template = fs.readFileSync(path.join(ROOT, 'batch/prompts/story-instructions.md'), 'utf8');
const fillTemplate = (cfg) => template
  .replaceAll('{LANG_NAME}', cfg.name)
  .replaceAll('{ADDRESS_FORM}', cfg.address)
  .replaceAll('{BANNED_PHRASES}', cfg.banned.map((p) => `"${p}"`).join(', '))
  .replaceAll('{LEN_OPEN}', cfg.len.open)
  .replaceAll('{LEN_STORY}', cfg.len.story)
  .replaceAll('{LEN_LESSONS}', cfg.len.lessons)
  .replaceAll('{LEN_REFLECT}', cfg.len.reflect)
  .replaceAll('{LEN_USE}', cfg.len.use)
  .replaceAll('{LEN_TOTAL}', cfg.len.total);

// Cached mode: the template is sent with its {PLACEHOLDERS} intact so the
// system block is identical for every language and story.
const PREAMBLE = 'The {PLACEHOLDERS} used in the instructions below (LANG_NAME, ADDRESS_FORM, BANNED_PHRASES, LEN_OPEN, LEN_STORY, LEN_LESSONS, LEN_REFLECT, LEN_USE, LEN_TOTAL) are defined in the "Target language settings" block that comes after the content brief. Apply those values, and write the story ONLY in that target language.\n\n';
const settingsText = (cfg) => [
  'Target language settings:',
  `- {LANG_NAME} = ${cfg.name}`,
  `- {ADDRESS_FORM} = ${cfg.address}`,
  `- {BANNED_PHRASES} = ${cfg.banned.map((p) => `"${p}"`).join(', ')}`,
  `- {LEN_OPEN} = ${cfg.len.open} words`,
  `- {LEN_STORY} = ${cfg.len.story} words`,
  `- {LEN_LESSONS} = ${cfg.len.lessons} words`,
  `- {LEN_REFLECT} = ${cfg.len.reflect} words`,
  `- {LEN_USE} = ${cfg.len.use} words`,
  `- {LEN_TOTAL} = ${cfg.len.total} words`,
].join('\n');

const requests = [];
storyOrder.forEach((id) => { // story-major order keeps one story's languages adjacent
  const brief = JSON.parse(fs.readFileSync(path.join(briefDir, `${id}.json`), 'utf8'));
  const briefText = `Content brief:\n\`\`\`json\n${JSON.stringify(brief, null, 2)}\n\`\`\``;
  langs.filter((l) => todo[l].has(id)).forEach((lang) => {
    const cfg = LANG_CONFIG[lang];
    requests.push(noCache
      ? {
        customId: `story-${lang}-${id}`, model, maxTokens: 8000,
        system: fillTemplate(cfg),
        messages: [{ role: 'user', content: briefText }],
      }
      : {
        customId: `story-${lang}-${id}`, model, maxTokens: 8000,
        system: [{ type: 'text', text: PREAMBLE + template, cache_control: cacheControl }],
        messages: [{ role: 'user', content: [
          { type: 'text', text: briefText, cache_control: cacheControl },
          { type: 'text', text: settingsText(cfg) },
        ] }],
      });
  });
});

const estTok = (s) => Math.round(s.length / 4);
const sample = requests[0];
const sysChars = typeof sample.system === 'string' ? sample.system.length : sample.system[0].text.length;
console.log(`${requests.length} requests (${storyOrder.length} stories × ${langs.join(',')}), model ${model}, caching ${noCache ? 'OFF' : 'ON'}`);
console.log(`Shared prefix per request: ~${estTok(PREAMBLE + template)} tokens instructions (+ brief); system chars ${sysChars}`);
if (dry) {
  console.log('\n--dry: nothing sent. First request shape:');
  console.log(JSON.stringify({ ...sample, system: typeof sample.system === 'string' ? sample.system.slice(0, 80) + '…' : sample.system.map((b) => ({ ...b, text: b.text.slice(0, 80) + '…' })), messages: sample.messages.map((m) => ({ ...m, content: typeof m.content === 'string' ? m.content.slice(0, 80) + '…' : m.content.map((b) => ({ ...b, text: b.text.slice(0, 60) + '…' })) })) }, null, 2));
  process.exit(0);
}

const batch = await submitBatch(requests);
console.log(`Submitted ${requests.length} story requests (langs: ${langs.join(',')}). Batch id: ${batch.id}`);
console.log(`Model: ${model}`);
langs.forEach((lang) => {
  console.log(`\nCheck status:   node batch/03-check-batch.mjs ${batch.id}`);
  console.log(`Fetch results:  node batch/06-fetch-stories.mjs ${batch.id} ${lang}`);
  fs.writeFileSync(
    path.join(ROOT, `staging/p1/.last-story-batch-${lang}.json`),
    JSON.stringify({ id: batch.id, lang, model, count: requests.filter((r) => r.customId.startsWith(`story-${lang}-`)).length, submitted_at: new Date().toISOString() }, null, 2),
  );
});

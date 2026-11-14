#!/usr/bin/env node
// Exports the EXACT inputs the Batch pipeline sends to the model, so another
// agent (e.g. Codex) can produce the same stories by hand for a fair comparison.
// Nothing is sent to any API.
//
// Usage: node batch/08-export-agent-inputs.mjs <lang> <story_id ...> [--out staging/p1-codex]
//        node batch/08-export-agent-inputs.mjs all [<story_id ...>] --compact [--out staging/p1-writer]
//
// Writes into <out>/inputs/:
//   brief-system.md            = system prompt for the brief step (batch/prompts/brief-instructions.md)
//   story-system.<lang>.md     = system prompt for the story step, placeholders filled exactly like 05-submit-stories.mjs
//   <id>.brief-user.md         = user message for the brief step (book + existing source text)
//
// --compact (hand-writing agents that write all four languages in one run):
//   story-system.md            = the story prompt ONCE, placeholders kept, plus a per-language
//                                settings table and the reference stories in batch/prompts/examples/.
//                                Replaces the four near-identical story-system.<lang>.md files.
//                                The Batch pipeline never reads this file.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// Same settings object the Batch pipeline uses (single source of truth).
import { LANG_CONFIG, LANGS } from '../scripts/p1/lang-config.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const outIdx = args.indexOf('--out');
const compact = args.includes('--compact');
const outRoot = path.join(ROOT, outIdx !== -1 ? args[outIdx + 1] : 'staging/p1-codex');
const rest = args.filter((_, i) => outIdx === -1 || (i !== outIdx && i !== outIdx + 1)).filter((a) => a !== '--compact');
const [lang, ...idArgs] = rest;
const ids = idArgs.filter((a) => /^\d+$/.test(a)).map(Number);
if (!lang || (!ids.length && !compact)) {
  console.error('usage: node batch/08-export-agent-inputs.mjs <lang> <story_id ...> [--out dir]\n       node batch/08-export-agent-inputs.mjs all [<story_id ...>] --compact [--out dir]');
  process.exit(2);
}

// Settings come from scripts/p1/lang-config.mjs (also used by validate.mjs).
if (lang === 'all' && !compact) { console.error('lang "all" needs --compact'); process.exit(2); }
const langs = lang === 'all' ? LANGS : [lang];
for (const l of langs) if (!LANG_CONFIG[l]) { console.error(`unknown lang ${l}`); process.exit(2); }

const inDir = path.join(outRoot, 'inputs');
fs.mkdirSync(inDir, { recursive: true });

// Placeholder -> value for one language. Same values 05-submit-stories.mjs uses.
const placeholders = (cfg) => ({
  '{LANG_NAME}': cfg.name,
  '{ADDRESS_FORM}': cfg.address,
  '{BANNED_PHRASES}': cfg.banned.map((p) => `"${p}"`).join(', '),
  '{LEN_OPEN}': cfg.len.open,
  '{LEN_STORY}': cfg.len.story,
  '{LEN_LESSONS}': cfg.len.lessons,
  '{LEN_REFLECT}': cfg.len.reflect,
  '{LEN_USE}': cfg.len.use,
  '{LEN_TOTAL}': cfg.len.total,
  '{VOICE_LONG}': String(cfg.voice.long),
  '{VOICE_SHORT}': String(cfg.voice.short),
});

fs.copyFileSync(path.join(ROOT, 'batch/prompts/brief-instructions.md'), path.join(inDir, 'brief-system.md'));
const template = fs.readFileSync(path.join(ROOT, 'batch/prompts/story-instructions.md'), 'utf8');
if (compact) {
  const keys = Object.keys(placeholders(LANG_CONFIG.en));
  const table = [
    `| Placeholder | ${langs.join(' | ')} |`,
    `|---|${langs.map(() => '---').join('|')}|`,
    ...keys.map((k) => `| \`${k}\` | ${langs.map((l) => placeholders(LANG_CONFIG[l])[k].replaceAll('|', '\\|')).join(' | ')} |`),
  ].join('\n');
  const exDir = path.join(ROOT, 'batch/prompts/examples');
  const examples = langs
    .map((l) => path.join(exDir, `${l}.md`))
    .filter((f) => fs.existsSync(f))
    .map((f) => fs.readFileSync(f, 'utf8').trim())
    .join('\n\n');
  const out = [
    '> Compact form: one prompt for every language. Each `{PLACEHOLDER}` below takes the value of the language you are writing now, from "Language settings" at the end.\n',
    template.trim(),
    '\n## Language settings\n',
    table,
    examples ? `\n## Reference stories\n\nApproved stories in the house voice. Match their rhythm, story share and lesson shape. Do not reuse their opening move, sentences, structure order or book facts.\n\n${examples}` : '',
  ].join('\n');
  fs.writeFileSync(path.join(inDir, 'story-system.md'), `${out}\n`);
} else {
  let storySystem = template;
  for (const [k, v] of Object.entries(placeholders(LANG_CONFIG[lang]))) storySystem = storySystem.replaceAll(k, v);
  fs.writeFileSync(path.join(inDir, `story-system.${lang}.md`), storySystem);
}

const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'staging/p1/manifest.json'), 'utf8'));
for (const id of ids) {
  const m = manifest.find((x) => x.story_id === id);
  if (!m) { console.log(`skip ${id}: not in manifest`); continue; }
  // Same text 02-submit-briefs.mjs sends as the user message.
  const user = `story_id: ${m.story_id}\nBook: "${m.book.title}" by ${m.book.author}${m.book.year ? ` (${m.book.year})` : ''}\n\nExisting ${m.source_lang.toUpperCase()} text (for reference only — the brief must reflect the BOOK, not just reword this text):\n"""\n${m.source_content}\n"""\n`;
  fs.writeFileSync(path.join(inDir, `${id}.brief-user.md`), user);
  console.log(`wrote ${path.relative(ROOT, inDir)}/${id}.brief-user.md`);
}
for (const d of ['brief', ...langs]) fs.mkdirSync(path.join(outRoot, d), { recursive: true });
console.log(`wrote ${path.relative(ROOT, inDir)}/brief-system.md and ${compact ? 'story-system.md' : `story-system.${lang}.md`}`);

#!/usr/bin/env node
// Exports the EXACT inputs the Batch pipeline sends to the model, so another
// agent (e.g. Codex) can produce the same stories by hand for a fair comparison.
// Nothing is sent to any API.
//
// Usage: node batch/08-export-agent-inputs.mjs <lang> <story_id ...> [--out staging/p1-codex]
//
// Writes into <out>/inputs/:
//   brief-system.md            = system prompt for the brief step (batch/prompts/brief-instructions.md)
//   story-system.<lang>.md     = system prompt for the story step, placeholders filled exactly like 05-submit-stories.mjs
//   <id>.brief-user.md         = user message for the brief step (book + existing source text)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const outIdx = args.indexOf('--out');
const outRoot = path.join(ROOT, outIdx !== -1 ? args[outIdx + 1] : 'staging/p1-codex');
const rest = args.filter((_, i) => outIdx === -1 || (i !== outIdx && i !== outIdx + 1));
const [lang, ...idArgs] = rest;
const ids = idArgs.filter((a) => /^\d+$/.test(a)).map(Number);
if (!lang || !ids.length) {
  console.error('usage: node batch/08-export-agent-inputs.mjs <lang> <story_id ...> [--out dir]');
  process.exit(2);
}

// Pull LANG_CONFIG out of 05-submit-stories.mjs so the two never drift apart.
const src05 = fs.readFileSync(path.join(ROOT, 'batch/05-submit-stories.mjs'), 'utf8');
const cfgSrc = /const LANG_CONFIG = (\{[\s\S]*?\n\});/.exec(src05)[1];
const LANG_CONFIG = new Function(`return ${cfgSrc}`)();
const cfg = LANG_CONFIG[lang];
if (!cfg) { console.error(`unknown lang ${lang}`); process.exit(2); }

const inDir = path.join(outRoot, 'inputs');
fs.mkdirSync(inDir, { recursive: true });

fs.copyFileSync(path.join(ROOT, 'batch/prompts/brief-instructions.md'), path.join(inDir, 'brief-system.md'));
const storySystem = fs.readFileSync(path.join(ROOT, 'batch/prompts/story-instructions.md'), 'utf8')
  .replaceAll('{LANG_NAME}', cfg.name)
  .replaceAll('{ADDRESS_FORM}', cfg.address)
  .replaceAll('{BANNED_PHRASES}', cfg.banned.map((p) => `"${p}"`).join(', '))
  .replaceAll('{LEN_OPEN}', cfg.len.open)
  .replaceAll('{LEN_STORY}', cfg.len.story)
  .replaceAll('{LEN_LESSONS}', cfg.len.lessons)
  .replaceAll('{LEN_REFLECT}', cfg.len.reflect)
  .replaceAll('{LEN_USE}', cfg.len.use);
fs.writeFileSync(path.join(inDir, `story-system.${lang}.md`), storySystem);

const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'staging/p1/manifest.json'), 'utf8'));
for (const id of ids) {
  const m = manifest.find((x) => x.story_id === id);
  if (!m) { console.log(`skip ${id}: not in manifest`); continue; }
  // Same text 02-submit-briefs.mjs sends as the user message.
  const user = `story_id: ${m.story_id}\nBook: "${m.book.title}" by ${m.book.author}${m.book.year ? ` (${m.book.year})` : ''}\n\nExisting ${m.source_lang.toUpperCase()} text (for reference only — the brief must reflect the BOOK, not just reword this text):\n"""\n${m.source_content}\n"""\n`;
  fs.writeFileSync(path.join(inDir, `${id}.brief-user.md`), user);
  console.log(`wrote ${path.relative(ROOT, inDir)}/${id}.brief-user.md`);
}
for (const d of ['brief', lang]) fs.mkdirSync(path.join(outRoot, d), { recursive: true });
console.log(`wrote ${path.relative(ROOT, inDir)}/brief-system.md and story-system.${lang}.md`);

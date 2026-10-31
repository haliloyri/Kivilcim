#!/usr/bin/env node
// Drift guard: the story prompts, the plan docs and lang-config.mjs must agree.
//
// The repo has shipped three different sets of numbers (prompt body, prompt
// settings block, validator) and a format example that still showed 2–3
// lessons. This script fails fast instead of letting a model discover the
// contradiction. Run it before any batch submission and after editing a prompt.
//
//   node scripts/p1/check-docs.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { RANGES, TOTAL, VOICE, STORY_SHARE } from './lang-config.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');

let fails = 0;
const check = (name, ok, detail = '') => {
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${name}${ok ? '' : ` — ${detail}`}`);
  if (!ok) fails += 1;
};

const story = read('batch/prompts/story-instructions.md');
const brief = read('batch/prompts/brief-instructions.md');
const plan = read('HIKAYE_DONUSUM_PLANI.md');
const convo = read('SOHBETTE_KULLAN_ENTEGRASYON_PLANI.md');

// ── prompts ────────────────────────────────────────────────────────────────
check('prompt: length placeholders are used, not hardcoded', ['{LEN_LESSONS}', '{LEN_REFLECT}', '{VOICE_LONG}', '{VOICE_SHORT}'].every((p) => story.includes(p)), 'a hardcoded range crept back into story-instructions.md');
check('prompt: no old hardcoded lesson range', !/55[–-]90 words/.test(story), '"55–90 words" should be {LEN_LESSONS}');
check('prompt: no old hardcoded reflect range', !/15[–-]30 words\)/.test(story), '"15–30 words)" should be {LEN_REFLECT}');
check('prompt: one lesson + one question', /EXACTLY ONE lesson/.test(story) && /EXACTLY ONE reflection question/.test(story));
check(`prompt: story share is ${Math.round(STORY_SHARE * 100)}%`, story.includes(`${Math.round(STORY_SHARE * 100)}%`));
check('prompt: no "soft target" escape hatch', !/lower word bound is a soft target/.test(story), 'thin drafts were licensed by this line');
check('prompt: illustrations are banned inside [[story]]', /never in \[\[story\]\]\./.test(story) && !/unless clearly marked as an illustration/.test(story));
check('prompt: scene_details is referenced', story.includes('`scene_details`'));
check('prompt: voice section exists', /## Voice: how a paragraph earns its place/.test(story));
check('prompt: no second story-share figure (50%)', !/at least 50% of the entry/.test(story), 'the story-length rule must say 55%, like the config');
check('prompt: story length cites {LEN_STORY}', !/Target roughly 300[–-]400 words/.test(story), 'hardcoded story target crept back in');

check('brief prompt: scene_details is required', brief.includes('scene_details'));
check('brief prompt: JSON shape has scene_details', /"scene_details":/.test(brief));
check('brief prompt: no fabricated props', /fabricated prop is not/.test(brief));

// ── plan doc ───────────────────────────────────────────────────────────────
const example = /### 3\.4[^\n]*\n[\s\S]*?```([\s\S]*?)```/.exec(plan);
check('plan: 3.4 example block found', Boolean(example));
if (example) {
  const body = example[1];
  const lessons = (body.match(/\$\$/g) || []).length / 2;
  const questions = (body.match(/&&/g) || []).length / 2;
  check('plan: example has exactly one lesson', lessons === 1, `found ${lessons}`);
  check('plan: example has exactly one question', questions === 1, `found ${questions}`);
  check('plan: example has no reflect bullets', !/^\s*-\s/m.test(body), 'bullet list still in the example');
}
check('plan: variants question is empty', /"question":\s*""/.test(plan));

const tableCell = (label) => {
  const m = new RegExp(`\\|\\s*${label}\\s*\\|\\s*([^|\\n]+)\\|`).exec(plan);
  return m ? m[1].trim() : '';
};
const tr = RANGES.tr;
check('plan: 3.5 open range matches lang-config', tableCell('open').includes(`${tr.open[0]}–${tr.open[1]}`), `table says "${tableCell('open')}"`);
check('plan: 3.5 story range matches lang-config', tableCell('story').includes(`${tr.story[0]}–${tr.story[1]}`), `table says "${tableCell('story')}"`);
check('plan: 3.5 lessons is one card', /1 ders/.test(tableCell('lessons')), `table says "${tableCell('lessons')}"`);
check('plan: 3.5 reflect is one question', /1 `&&` soru/.test(tableCell('reflect')), `table says "${tableCell('reflect')}"`);
check('plan: 3.5 total matches lang-config', plan.includes(`${TOTAL.tr[0]}–${TOTAL.tr[1]}`), 'total range missing from the plan');

// ── conversation plan ──────────────────────────────────────────────────────
check('conversation plan: question format no longer listed', !/30 saniye \/ Soru/.test(convo), 'the screen shows punchline + thirty_sec only');

// ── config sanity ──────────────────────────────────────────────────────────
check('config: reflect range is 15–30 in every language', Object.values(RANGES).every((r) => r.reflect[0] === 15 && r.reflect[1] === 30));
check('config: voice budget is long ≥ 15 and short ≤ 9', VOICE.longMin >= 15 && VOICE.shortMax <= 9);

console.log(`\n${fails === 0 ? 'PASS' : 'FAIL'} — ${fails} problem(s)`);
process.exit(fails ? 1 : 0);

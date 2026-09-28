#!/usr/bin/env node
// Validate P1 stories that live outside staging/p1/<lang>/ (e.g. an agent's pilot folder).
// Usage: node scripts/p1/validate-dir.mjs <lang> <dir> [storyId ...]
//   node scripts/p1/validate-dir.mjs en staging/p1-codex/en 1059 1060 1061
import fs from 'node:fs';
import path from 'node:path';
import { validateP1 } from './validate.mjs';

const [lang, dir, ...ids] = process.argv.slice(2);
if (!lang || !dir) { console.error('usage: node scripts/p1/validate-dir.mjs <lang> <dir> [id ...]'); process.exit(2); }
const list = ids.length ? ids : fs.readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''));
let bad = 0;
for (const id of list) {
  const file = path.join(dir, `${id}.md`);
  if (!fs.existsSync(file)) { console.log(`MISSING ${file}`); bad += 1; continue; }
  const { errors, words } = validateP1(fs.readFileSync(file, 'utf8').trim(), lang);
  const vFile = path.join(dir, `${id}.variants.json`);
  try { JSON.parse(fs.readFileSync(vFile, 'utf8')); } catch (e) { errors.push(`variants file missing or invalid JSON: ${e.message}`); }
  console.log(`${errors.length ? 'FAIL' : 'OK  '} ${path.join(dir, id)}.md (${words} words)`);
  errors.forEach((e) => console.log(`   ✗ ${e}`));
  if (errors.length) bad += 1;
}
console.log(`\n${list.length - bad}/${list.length} passed`);
process.exit(bad ? 1 : 0);

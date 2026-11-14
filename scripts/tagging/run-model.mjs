#!/usr/bin/env node
// Runs a local model over staging/tagging/<set>/prompts.jsonl and writes predictions.<name>.jsonl.
// Talks to any OpenAI-compatible /v1/chat/completions server (llama.cpp server, Ollama, vLLM, LM Studio).
// Resumable: ids with a valid line are skipped; failed ids are retried. The last line per id wins.
// Usage:
//   node scripts/tagging/run-model.mjs --endpoint http://localhost:8080/v1 --model laya --name laya
//   node scripts/tagging/run-model.mjs --set full --endpoint ... --model laya --name laya
// A model that is not a chat model can write predictions.<name>.jsonl itself, one line per story:
//   {"story_id":1500,"fit_45s":4,"hook":3,"visual":2,"primary_theme":"leadership","secondary_themes":["communication"]}
import { existsSync, readFileSync, appendFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { TAG_DIR, normaliseLabel, validateLabel } from './schema.mjs';

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(`--${name}`); return i !== -1 ? args[i + 1] : def; };
const set = opt('set', 'gold');
const endpoint = opt('endpoint', process.env.TAG_ENDPOINT || 'http://localhost:8080/v1').replace(/\/$/, '');
const model = opt('model', process.env.TAG_MODEL || 'laya');
const name = opt('name', model.replace(/[^\w.-]/g, '_'));
const limit = Number(opt('limit', Infinity));

const dir = resolve(TAG_DIR, set);
const prompts = readFileSync(resolve(dir, 'prompts.jsonl'), 'utf8').trim().split('\n').map((l) => JSON.parse(l));
const outPath = resolve(dir, `predictions.${name}.jsonl`);
const done = new Set(existsSync(outPath)
  ? readFileSync(outPath, 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l)).filter((r) => !r.error).map((r) => r.story_id)
  : []);

const extractJson = (text) => {
  const m = String(text).match(/\{[\s\S]*\}/);
  return m ? JSON.parse(m[0]) : null;
};

let ok = 0, bad = 0;
for (const p of prompts.filter((x) => !done.has(x.story_id)).slice(0, limit)) {
  const started = Date.now();
  let line;
  try {
    const res = await fetch(`${endpoint}/chat/completions`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        model, temperature: 0, max_tokens: 200,
        messages: [{ role: 'system', content: p.system }, { role: 'user', content: p.user }],
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
    const raw = (await res.json()).choices?.[0]?.message?.content ?? '';
    const label = normaliseLabel(extractJson(raw) ?? {});
    const errors = validateLabel(label);
    line = { story_id: p.story_id, ...label, ms: Date.now() - started, ...(errors.length ? { error: errors.join('; '), raw } : {}) };
  } catch (e) {
    line = { story_id: p.story_id, error: e.message, ms: Date.now() - started };
  }
  appendFileSync(outPath, JSON.stringify(line) + '\n');
  if (line.error) { bad++; console.log(`✗ ${p.story_id}: ${line.error}`); } else { ok++; console.log(`✓ ${p.story_id} (${line.ms} ms)`); }
}
console.log(`\n${ok} geçerli, ${bad} hatalı, ${done.size} önceden vardı -> ${outPath}`);

#!/usr/bin/env node
// Measures how well a model (or a second labeller) agrees with the hand labels.
// Gold: staging/tagging/<set>/labels.csv (only fully filled rows count).
// Pred: predictions.<name>.jsonl (last valid line per id wins) or another labels CSV.
// Writes staging/tagging/<set>/report.<name>.md and prints a GO / NO-GO verdict per task.
// Usage:
//   node scripts/tagging/evaluate.mjs --pred laya
//   node scripts/tagging/evaluate.mjs --pred staging/tagging/gold/labels.second.csv
//   node scripts/tagging/evaluate.mjs --check            only validate labels.csv (how many filled, errors)
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, basename } from 'node:path';
import {
  TAG_DIR, SCORE_KEYS, SCORE_MIN, SCORE_MAX, THEME_KEYS, REELS_WEIGHTS, reelsScore,
  normaliseLabel, validateLabel, parseCsv,
} from './schema.mjs';

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(`--${name}`); return i !== -1 ? args[i + 1] : def; };
const set = opt('set', 'gold');
const dir = resolve(TAG_DIR, set);
const goldPath = resolve(opt('gold', resolve(dir, 'labels.csv')));
const predArg = opt('pred', null);
const checkOnly = args.includes('--check');

// Go/no-go bars. Start here; tighten once you know the human-human agreement.
const BARS = { qwk: 0.6, spearman: 0.6, topOverlap: 0.6, primaryAcc: 0.7, jaccard: 0.5 };

function loadLabels(path) {
  const map = new Map(), problems = [];
  if (path.endsWith('.jsonl')) {
    for (const line of readFileSync(path, 'utf8').split('\n').filter(Boolean)) {
      const r = JSON.parse(line);
      if (r.error) { if (!map.has(r.story_id)) problems.push(`${r.story_id}: ${r.error}`); continue; }
      map.set(Number(r.story_id), normaliseLabel(r));
    }
    return { map, problems, empty: 0 };
  }
  let empty = 0;
  for (const r of parseCsv(readFileSync(path, 'utf8'))) {
    const filled = [...SCORE_KEYS, 'primary_theme'].filter((k) => r[k] !== '');
    if (filled.length === 0) { empty++; continue; }
    const label = normaliseLabel(r);
    const errors = validateLabel(label);
    if (errors.length) { problems.push(`${r.story_id}: ${errors.join('; ')}`); continue; }
    map.set(Number(r.story_id), label);
  }
  return { map, problems, empty };
}

const gold = loadLabels(goldPath);
console.log(`Gold: ${gold.map.size} geçerli, ${gold.empty} boş, ${gold.problems.length} hatalı (${goldPath})`);
gold.problems.forEach((p) => console.log(`  ✗ ${p}`));
if (checkOnly) process.exit(gold.problems.length ? 1 : 0);
if (!predArg) { console.error('--pred <name|path> gerekli'); process.exit(1); }

const predPath = existsSync(predArg) ? resolve(predArg) : resolve(dir, `predictions.${predArg}.jsonl`);
const pred = loadLabels(predPath);
const name = predArg.includes('/') ? basename(predPath).replace(/\.(jsonl|csv)$/, '') : predArg;
const ids = [...gold.map.keys()].filter((id) => pred.map.has(id));
const missing = [...gold.map.keys()].filter((id) => !pred.map.has(id));
if (ids.length < 10) { console.error(`Ortak geçerli hikâye sayısı çok az: ${ids.length}`); process.exit(1); }

/* ---------- metrics ---------- */
const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length;
const r2 = (x) => Math.round(x * 100) / 100;

function quadraticKappa(a, b) {
  const k = SCORE_MAX - SCORE_MIN + 1;
  const O = Array.from({ length: k }, () => Array(k).fill(0));
  a.forEach((x, i) => O[x - SCORE_MIN][b[i] - SCORE_MIN]++);
  const ha = Array(k).fill(0), hb = Array(k).fill(0);
  a.forEach((x) => ha[x - SCORE_MIN]++); b.forEach((x) => hb[x - SCORE_MIN]++);
  let num = 0, den = 0;
  for (let i = 0; i < k; i++) for (let j = 0; j < k; j++) {
    const w = ((i - j) ** 2) / ((k - 1) ** 2);
    num += w * O[i][j];
    den += w * (ha[i] * hb[j]) / a.length;
  }
  return den === 0 ? 1 : 1 - num / den;
}

function ranks(values) {
  const order = values.map((v, i) => [v, i]).sort((x, y) => x[0] - y[0]);
  const r = Array(values.length);
  for (let i = 0; i < order.length;) {
    let j = i;
    while (j + 1 < order.length && order[j + 1][0] === order[i][0]) j++;
    for (let t = i; t <= j; t++) r[order[t][1]] = (i + j) / 2 + 1;
    i = j + 1;
  }
  return r;
}
function spearman(a, b) {
  const ra = ranks(a), rb = ranks(b), ma = mean(ra), mb = mean(rb);
  let num = 0, da = 0, db = 0;
  ra.forEach((x, i) => { num += (x - ma) * (rb[i] - mb); da += (x - ma) ** 2; db += (rb[i] - mb) ** 2; });
  return da && db ? num / Math.sqrt(da * db) : 0;
}

function cohenKappa(a, b) {
  const po = mean(a.map((x, i) => (x === b[i] ? 1 : 0)));
  const cats = [...new Set([...a, ...b])];
  const pe = cats.reduce((s, c) => s + (a.filter((x) => x === c).length / a.length) * (b.filter((x) => x === c).length / b.length), 0);
  return pe === 1 ? 1 : (po - pe) / (1 - pe);
}

const G = ids.map((id) => gold.map.get(id)), P = ids.map((id) => pred.map.get(id));

const scoreRows = SCORE_KEYS.map((k) => {
  const a = G.map((x) => x[k]), b = P.map((x) => x[k]);
  return {
    key: k,
    exact: mean(a.map((x, i) => (x === b[i] ? 1 : 0))),
    within1: mean(a.map((x, i) => (Math.abs(x - b[i]) <= 1 ? 1 : 0))),
    mae: mean(a.map((x, i) => Math.abs(x - b[i]))),
    bias: mean(b) - mean(a),
    qwk: quadraticKappa(a, b),
  };
});

const ga = G.map(reelsScore), pa = P.map(reelsScore);
const rho = spearman(ga, pa);
const topK = Math.max(1, Math.round(ids.length * 0.2));
const topIds = (scores) => new Set(ids.map((id, i) => [id, scores[i]]).sort((x, y) => y[1] - x[1]).slice(0, topK).map((x) => x[0]));
const goldTop = topIds(ga), predTop = topIds(pa);
const topOverlap = [...goldTop].filter((id) => predTop.has(id)).length / topK;

const primaryAcc = mean(G.map((g, i) => (g.primary_theme === P[i].primary_theme ? 1 : 0)));
const primaryKappa = cohenKappa(G.map((g) => g.primary_theme), P.map((p) => p.primary_theme));
const tagSet = (x) => new Set([x.primary_theme, ...x.secondary_themes]);
const jaccard = mean(G.map((g, i) => {
  const a = tagSet(g), b = tagSet(P[i]);
  const inter = [...a].filter((t) => b.has(t)).length;
  return inter / new Set([...a, ...b]).size;
}));
const primaryInPredSet = mean(G.map((g, i) => (tagSet(P[i]).has(g.primary_theme) ? 1 : 0)));

const perTheme = THEME_KEYS.map((t) => {
  let tp = 0, fp = 0, fn = 0;
  G.forEach((g, i) => {
    const inG = tagSet(g).has(t), inP = tagSet(P[i]).has(t);
    if (inG && inP) tp++; else if (inP) fp++; else if (inG) fn++;
  });
  const prec = tp + fp ? tp / (tp + fp) : null, rec = tp + fn ? tp / (tp + fn) : null;
  return { t, support: tp + fn, prec, rec, f1: prec != null && rec != null && prec + rec ? (2 * prec * rec) / (prec + rec) : null };
}).filter((r) => r.support > 0 || r.prec != null);

const confusions = new Map();
G.forEach((g, i) => {
  if (g.primary_theme !== P[i].primary_theme) {
    const key = `${g.primary_theme} → ${P[i].primary_theme}`;
    confusions.set(key, (confusions.get(key) ?? 0) + 1);
  }
});

const reelsGo = scoreRows.every((r) => r.qwk >= BARS.qwk) && rho >= BARS.spearman && topOverlap >= BARS.topOverlap;
const themeGo = primaryAcc >= BARS.primaryAcc && jaccard >= BARS.jaccard;
const mark = (ok) => (ok ? '✅' : '❌');
const pct = (x) => (x == null ? '—' : `${Math.round(x * 100)}%`);

const worst = ids.map((id, i) => ({ id, diff: SCORE_KEYS.reduce((s, k) => s + Math.abs(G[i][k] - P[i][k]), 0), g: G[i], p: P[i] }))
  .sort((a, b) => b.diff - a.diff).slice(0, 10);

const report = `# Etiket uyumu: ${name} vs el etiketi (${set})

${ids.length} ortak hikâye · ${missing.length} hikâyede tahmin yok · ${pred.problems.length} hatalı tahmin satırı

## Karar
- Reels skoru: ${reelsGo ? '**GO** — tüm veritabanına çalıştırılabilir' : '**NO-GO** — rubrik/prompt düzeltilmeli'}
- Tema etiketi: ${themeGo ? '**GO** — tüm veritabanına çalıştırılabilir' : '**NO-GO** — rubrik/prompt düzeltilmeli'}

## Reels skorları
| Skor | Birebir | ±1 | MAE | Sapma (tahmin−el) | QWK (≥${BARS.qwk}) |
|---|---:|---:|---:|---:|---:|
${scoreRows.map((r) => `| ${r.key} | ${pct(r.exact)} | ${pct(r.within1)} | ${r2(r.mae)} | ${r.bias >= 0 ? '+' : ''}${r2(r.bias)} | ${r2(r.qwk)} ${mark(r.qwk >= BARS.qwk)} |`).join('\n')}

Birleşik Reels skoru (${SCORE_KEYS.map((k) => `${k} ${REELS_WEIGHTS[k]}`).join(', ')}):
- Sıralama uyumu, Spearman: ${r2(rho)} ${mark(rho >= BARS.spearman)} (≥${BARS.spearman})
- İlk %20 örtüşmesi (${topK} hikâye): ${pct(topOverlap)} ${mark(topOverlap >= BARS.topOverlap)} (≥${pct(BARS.topOverlap)})

## Temalar
- Ana tema birebir: ${pct(primaryAcc)} ${mark(primaryAcc >= BARS.primaryAcc)} (≥${pct(BARS.primaryAcc)}) · Cohen κ ${r2(primaryKappa)}
- El ana teması tahmin setinde var: ${pct(primaryInPredSet)}
- Etiket seti Jaccard ortalaması: ${r2(jaccard)} ${mark(jaccard >= BARS.jaccard)} (≥${BARS.jaccard})

| Tema | Destek | Kesinlik | Duyarlılık | F1 |
|---|---:|---:|---:|---:|
${perTheme.map((r) => `| ${r.t} | ${r.support} | ${pct(r.prec)} | ${pct(r.rec)} | ${pct(r.f1)} |`).join('\n')}

En sık ana tema karışıklıkları (el → tahmin):
${[...confusions].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, v]) => `- ${k}: ${v}`).join('\n') || '- yok'}

## En çok ayrışan 10 hikâye (skor farkı toplamı)
| id | fark | el (fit/hook/visual · tema) | tahmin |
|---|---:|---|---|
${worst.map((w) => `| ${w.id} | ${w.diff} | ${SCORE_KEYS.map((k) => w.g[k]).join('/')} · ${w.g.primary_theme} | ${SCORE_KEYS.map((k) => w.p[k]).join('/')} · ${w.p.primary_theme} |`).join('\n')}
`;

const reportPath = resolve(dir, `report.${name}.md`);
writeFileSync(reportPath, report);
console.log(report);
console.log(`Rapor: ${reportPath}`);

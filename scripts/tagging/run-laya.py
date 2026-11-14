#!/usr/bin/env python3
"""Runs Laya (convaiinnovations/laya, multilingual checkpoint) over staging/tagging/<set>/sample.json.

Writes predictions.<name>.jsonl in the same shape evaluate.mjs reads:
  {"story_id":1500,"fit_45s":4,"hook":3,"visual":2,"primary_theme":"leadership","secondary_themes":[...],"probs":{...}}
Questions come from laya-questions.json (built from scripts/tagging/schema.mjs by export-sample.mjs).
Each question runs as its own predict_batch call so its options get the whole token budget.

Setup (once):
  python3 -m venv .venv-laya && .venv-laya/bin/pip install laya
Usage:
  USE_TF=0 .venv-laya/bin/python scripts/tagging/run-laya.py --dump          # print raw output of 1 story, check shape
  USE_TF=0 .venv-laya/bin/python scripts/tagging/run-laya.py                 # gold set -> predictions.laya.jsonl
  USE_TF=0 .venv-laya/bin/python scripts/tagging/run-laya.py --set full --model path/to/finetuned --name laya-ft
"""
import argparse
import json
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from laya_common import MAX_SECONDARY, to_state  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
TAG_DIR = ROOT / "staging" / "tagging"

ap = argparse.ArgumentParser()
ap.add_argument("--set", default="gold")
ap.add_argument("--model", default="convaiinnovations/laya")
ap.add_argument("--subfolder", default="multilingual", help="'' for the English root checkpoint")
ap.add_argument("--name", default="laya")
ap.add_argument("--max-len", type=int, default=2048, help="multilingual supports up to 8192")
ap.add_argument("--batch-size", type=int, default=8)
ap.add_argument("--device", default=None)
ap.add_argument("--secondary-min", type=float, default=0.15, help="min probability for a secondary theme")
ap.add_argument("--limit", type=int, default=None)
ap.add_argument("--dump", action="store_true", help="print raw Laya output for the first story and exit")
args = ap.parse_args()

set_dir = TAG_DIR / args.set
stories = json.loads((set_dir / "sample.json").read_text())["stories"][: args.limit]
questions = json.loads((set_dir / "laya-questions.json").read_text())

def probs_of(answer):
    """Per-option probabilities, whatever the key is called in this laya version."""
    for key in ("probabilities", "probs", "distribution", "scores"):
        p = answer.get(key) if isinstance(answer, dict) else None
        if isinstance(p, dict) and p:
            return {str(k): float(v) for k, v in p.items()}
        if isinstance(p, list) and p:
            return {str(i): float(v) for i, v in enumerate(p)}
    return None


def score_level(answer, criteria):
    """Maps a Laya score answer to 1..len(criteria)."""
    p = probs_of(answer)
    if p:
        best = max(p, key=p.get)
        if best in criteria:
            return criteria.index(best) + 1, p
        if best.isdigit():
            return int(best) + 1, p
    for key in ("score", "level", "value", "choice"):
        v = answer.get(key) if isinstance(answer, dict) else None
        if isinstance(v, str) and v in criteria:
            return criteria.index(v) + 1, p
        if isinstance(v, str) and v.isdigit():
            v = int(v)
        if isinstance(v, int):
            return v + 1, p  # level indices are 0-based
    raise ValueError(f"score answer not understood: {answer!r}")


def choice_of(answer):
    p = probs_of(answer)
    v = answer.get("choice") if isinstance(answer, dict) else None
    if v is None and p:
        v = max(p, key=p.get)
    if v is None:
        raise ValueError(f"choice answer not understood: {answer!r}")
    return str(v), p


try:
    import laya
except ImportError:
    sys.exit("laya paketi yok. Kurulum: python3 -m venv .venv-laya && .venv-laya/bin/pip install laya")

load_kwargs = {"device": args.device} if args.device else {}
if args.subfolder:
    load_kwargs["subfolder"] = args.subfolder
print(f"Laya yükleniyor: {args.model} {args.subfolder or '(english root)'}", flush=True)
agent = laya.load(args.model, **load_kwargs)

states = [to_state(s) for s in stories]

if args.dump:
    for q_id, q in questions.items():
        res = agent.predict_batch(states[:1], {q_id: q}, max_len=args.max_len)[0]
        print(f"\n=== {q_id} ===")
        print(json.dumps(res, ensure_ascii=False, indent=2, default=str))
    sys.exit(0)

results = {s["story_id"]: {"story_id": s["story_id"], "probs": {}, "truncated": False} for s in stories}
started = time.time()
for q_id, q in questions.items():
    t0 = time.time()
    out = agent.predict_batch(states, {q_id: q}, max_len=args.max_len, batch_size=args.batch_size)
    for s, res in zip(stories, out):
        row = results[s["story_id"]]
        answer = res.get("answers", {}).get(q_id, {})
        usage = res.get("usage") or {}
        row["truncated"] = row["truncated"] or bool(usage.get("truncated"))
        try:
            if q["type"] == "score":
                row[q_id], p = score_level(answer, q["criteria"])
                if isinstance(answer.get("score"), (int, float)):  # expected level, 0-based
                    row.setdefault("expected", {})[q_id] = round(float(answer["score"]) + 1, 3)
            else:
                row[q_id], p = choice_of(answer)
            if p:
                row["probs"][q_id] = {k: round(v, 4) for k, v in p.items()}
            if isinstance(answer, dict) and "confidence" in answer:
                row.setdefault("confidence", {})[q_id] = round(float(answer["confidence"]), 4)
        except ValueError as e:
            row["error"] = f"{row.get('error', '')} {q_id}: {e}".strip()
    print(f"{q_id}: {len(stories)} hikâye, {time.time() - t0:.1f} sn", flush=True)

# Secondary themes: next most likely themes above a probability floor (Laya has no multi-label output).
for row in results.values():
    theme_p = row["probs"].get("primary_theme") or {}
    ranked = sorted((k for k in theme_p if k != row.get("primary_theme")), key=theme_p.get, reverse=True)
    row["secondary_themes"] = [k for k in ranked if theme_p[k] >= args.secondary_min][:MAX_SECONDARY]

out_path = set_dir / f"predictions.{args.name}.jsonl"
with out_path.open("w") as f:
    for row in results.values():
        f.write(json.dumps(row, ensure_ascii=False) + "\n")

bad = sum(1 for r in results.values() if "error" in r)
trunc = sum(1 for r in results.values() if r["truncated"])
print(f"\n{len(results) - bad} geçerli, {bad} hatalı, {trunc} kesildi (max_len {args.max_len}), "
      f"{time.time() - started:.0f} sn -> {out_path}")

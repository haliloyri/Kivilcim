#!/usr/bin/env python3
"""Fine-tunes Laya (multilingual checkpoint) on the hand labels, then saves a checkpoint run-laya.py can load.

Training data: labels.csv of the training set(s) (default staging/tagging/train/).
Evaluation data: staging/tagging/gold/labels.csv, held out (export-sample.mjs --exclude gold keeps them apart).
Targets are soft so the model learns order and second choices:
  score questions: 0.7 on the labelled level, 0.15 on each neighbour
  primary_theme:   0.7 on the primary theme, 0.3 split over the secondary themes (1.0 if none)
Writes staging/tagging/finetune/{train,eval}.jsonl and the checkpoint to models/<name>/ (gitignored).

Usage:
  .venv-laya/bin/python scripts/tagging/finetune-laya.py --dry-run          # data check, no training
  .venv-laya/bin/python scripts/tagging/finetune-laya.py --train gold --eval '' --limit 16 --epochs 1 --name smoke   # timing check
  .venv-laya/bin/python scripts/tagging/finetune-laya.py                    # full run -> models/laya-albor
Then:
  npm run tag:laya -- --model models/laya-albor --subfolder '' --name laya-albor
  npm run tag:eval -- --pred laya-albor
"""
import argparse
import csv
import io
import json
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from laya_common import SCORE_KEYS, to_state  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
TAG_DIR = ROOT / "staging" / "tagging"

ap = argparse.ArgumentParser()
ap.add_argument("--train", default="train", help="comma-separated training sets")
ap.add_argument("--eval", default="gold", help="'' to skip evaluation (smoke tests only)")
ap.add_argument("--base", default="multilingual", help="base checkpoint: alias, hub id or local dir")
ap.add_argument("--name", default="laya-albor")
ap.add_argument("--epochs", type=int, default=4)
ap.add_argument("--micro-batch", type=int, default=1, help="1 fits 24 GB Apple Silicon at max_len 1536")
ap.add_argument("--grad-accum", type=int, default=16)
ap.add_argument("--max-len", type=int, default=1536, help="covers ~90% of stories (p50 889, p90 1386 tokens)")
ap.add_argument("--loss", default="soft-ce", choices=["soft-ce", "rlcd"])
ap.add_argument("--device", default="auto")
ap.add_argument("--limit", type=int, default=None, help="use only the first N training stories")
ap.add_argument("--dry-run", action="store_true")
args = ap.parse_args()


def read_labels(path):
    """labels.csv -> {story_id: row}, only fully filled rows (same rule as evaluate.mjs)."""
    text = path.read_text(encoding="utf-8-sig")
    first = text.split("\n", 1)[0]
    delim = ";" if first.count(";") >= first.count(",") else ","
    out = {}
    for r in csv.DictReader(io.StringIO(text), delimiter=delim):
        r = {k.strip(): (v or "").strip() for k, v in r.items() if k}
        if all(r.get(k) for k in [*SCORE_KEYS, "primary_theme"]):
            out[int(r["story_id"])] = r
    return out


def soft_level(level, k):
    """1-based level -> soft distribution over k levels keyed '0'..'k-1'."""
    i = level - 1
    p = [0.0] * k
    p[i] = 0.7
    for j in (i - 1, i + 1):
        if 0 <= j < k:
            p[j] = 0.15
    total = sum(p)
    return {str(n): round(v / total, 4) for n, v in enumerate(p)}


def soft_theme(primary, secondary):
    secondary = [t for t in secondary if t and t != primary]
    if not secondary:
        return {primary: 1.0}
    return {primary: 0.7, **{t: round(0.3 / len(secondary), 4) for t in secondary}}


def build_rows(set_name, questions, limit=None):
    set_dir = TAG_DIR / set_name
    stories = {s["story_id"]: s for s in json.loads((set_dir / "sample.json").read_text())["stories"]}
    labels = read_labels(set_dir / "labels.csv")
    ids = [i for i in stories if i in labels][:limit]
    rows = []
    for sid in ids:
        lab = labels[sid]
        gold = {k: {"probabilities": soft_level(int(lab[k]), len(questions[k]["criteria"]))} for k in SCORE_KEYS}
        sec = [t.strip() for t in lab.get("secondary_themes", "").replace(",", ";").split(";")]
        gold["primary_theme"] = {"probabilities": soft_theme(lab["primary_theme"], sec)}
        rows.append({"story_id": sid, "state": to_state(stories[sid]), "questions": questions, "gold": gold})
    return rows, len(stories)


def write_jsonl(path, rows):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w") as f:
        for r in rows:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")


questions = json.loads((TAG_DIR / args.train.split(",")[0] / "laya-questions.json").read_text())
train_rows, n_total = [], 0
for name in args.train.split(","):
    rows, n = build_rows(name, questions, args.limit)
    train_rows += rows
    n_total += n
eval_rows, n_eval = build_rows(args.eval, questions) if args.eval else ([], 0)
overlap = {r["story_id"] for r in train_rows} & {r["story_id"] for r in eval_rows}

print(f"Eğitim: {len(train_rows)}/{n_total} etiketli hikâye ({args.train}) · "
      f"Değerlendirme: {len(eval_rows)}/{n_eval} ({args.eval}) · çakışma: {len(overlap)}")
if overlap:
    sys.exit(f"Eğitim ve değerlendirme setleri çakışıyor: {sorted(overlap)[:10]}")
if not train_rows:
    sys.exit(f"Eğitim seti etiketsiz: staging/tagging/{args.train}/labels.csv dosyasını doldur.")
if len(train_rows) < 150 and not args.limit:
    print("Uyarı: 150'den az etiketli hikâye; model büyük ihtimalle ezberler ya da sınıf dağılımına çöker.")

data_dir = TAG_DIR / "finetune"
train_path, eval_path = data_dir / "train.jsonl", data_dir / "eval.jsonl"
write_jsonl(train_path, train_rows)
if eval_rows:
    write_jsonl(eval_path, eval_rows)

try:
    from laya.train import TrainConfig, dry_run, finetune, resolve_checkpoint_dir
except ImportError:
    sys.exit("laya paketi yok. Kurulum: uv venv --python 3.12 .venv-laya && uv pip install --python .venv-laya/bin/python laya")

config = TrainConfig(
    epochs=args.epochs, micro_batch=args.micro_batch, grad_accum=args.grad_accum,
    max_len=args.max_len, loss=args.loss, gradient_checkpointing=True, log_every=10, shuffle_options=("choice",), eval_data=str(eval_path) if eval_rows else None,
)
base_dir = resolve_checkpoint_dir(args.base)

if args.dry_run:
    print(json.dumps(dry_run(str(train_path), base_dir, config), indent=2, default=str))
    sys.exit(0)

out_dir = ROOT / "models" / args.name
started = time.time()
summary = finetune(str(train_path), base_dir, str(out_dir), config=config, device=args.device)
(out_dir / "albor-finetune.json").write_text(json.dumps(
    {"train_sets": args.train, "eval_set": args.eval, "train_stories": len(train_rows),
     "args": vars(args), "minutes": round((time.time() - started) / 60, 1), "summary": summary},
    ensure_ascii=False, indent=2, default=str))
print(f"\nBitti: {out_dir} ({(time.time() - started) / 60:.1f} dk)")

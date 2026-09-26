#!/usr/bin/env bash
# otomatize-batch/run-pipeline.sh
#
# batch/00-run-pipeline.mjs'i güvenli şekilde çalıştırır:
#  - .env.local'dan ANTHROPIC_API_KEY'i (ve varsa diğer değişkenleri) yükler
#  - aynı anda iki kopya çalışmasın diye kilit dosyası kullanır
#  - her çalışmayı zaman damgalı bir log dosyasına yazar
#  - ayarları otomatize-batch/config.sh'ten okur
#
# Elle çalıştırma:  bash otomatize-batch/run-pipeline.sh
# launchd ile:       install-launchd.sh bunu otomatik tetikler.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
LOCK_FILE="$SCRIPT_DIR/.pipeline.lock"
LOG_DIR="$SCRIPT_DIR/logs"
LOG_FILE="$LOG_DIR/pipeline-$(date +%Y%m%d-%H%M%S).log"

mkdir -p "$LOG_DIR"

# --- Kilit: aynı anda ikinci bir çalışmayı engelle ---------------------------
if [ -f "$LOCK_FILE" ]; then
  OLD_PID="$(cat "$LOCK_FILE" 2>/dev/null || echo '')"
  if [ -n "$OLD_PID" ] && kill -0 "$OLD_PID" 2>/dev/null; then
    echo "[$(date)] Zaten çalışan bir pipeline var (pid $OLD_PID). Çıkılıyor." | tee -a "$LOG_FILE"
    exit 0
  fi
  echo "[$(date)] Eski kilit dosyası bulundu ama süreç ölü (pid $OLD_PID). Devam ediliyor." >> "$LOG_FILE"
fi
echo $$ > "$LOCK_FILE"
trap 'rm -f "$LOCK_FILE"' EXIT

# --- Ayarlar ------------------------------------------------------------------
# shellcheck source=/dev/null
source "$SCRIPT_DIR/config.sh"

# --- API anahtarı: .env.local'dan yükle (varsa) -------------------------------
if [ -f "$REPO_ROOT/.env.local" ]; then
  set -a
  # shellcheck source=/dev/null
  source "$REPO_ROOT/.env.local"
  set +a
fi

if [ -z "${ANTHROPIC_API_KEY:-}" ]; then
  echo "[$(date)] HATA: ANTHROPIC_API_KEY tanımlı değil (ne ortamda ne .env.local'de)." | tee -a "$LOG_FILE"
  echo "Bkz: batch/README.md — \"API anahtarını nereden alırım?\"." | tee -a "$LOG_FILE"
  exit 1
fi

# --- node argümanlarını config.sh'ten kur -------------------------------------
ARGS=(batch/00-run-pipeline.mjs --langs "$LANGS" --model "$MODEL" --poll-seconds "$POLL_SECONDS" --max-wait-hours "$MAX_WAIT_HOURS")
if [ -n "${LIMIT:-}" ]; then
  ARGS+=(--limit "$LIMIT")
fi
if [ "${APPLY:-false}" = "true" ]; then
  ARGS+=(--apply)
fi

echo "[$(date)] Başlıyor: node ${ARGS[*]}" | tee -a "$LOG_FILE"
cd "$REPO_ROOT"
node "${ARGS[@]}" >> "$LOG_FILE" 2>&1
STATUS=$?
echo "[$(date)] Bitti (çıkış kodu: $STATUS). Log: $LOG_FILE"
exit $STATUS

#!/usr/bin/env bash
# otomatize-batch/install-launchd.sh
# Günlük otomatik çalışmayı kurar (macOS launchd). Kurulduktan sonra Mac her
# gün saat 03:00'te (bilgisayar açıksa) otomatize-batch/run-pipeline.sh'i
# tetikler; run-pipeline.sh de config.sh'teki ayarlarla batch/00-run-pipeline.mjs'i
# çalıştırır.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
LABEL="com.spark.storypipeline"
DEST="$HOME/Library/LaunchAgents/$LABEL.plist"

mkdir -p "$HOME/Library/LaunchAgents"
sed "s|__REPO_ROOT__|$REPO_ROOT|g" "$SCRIPT_DIR/com.spark.storypipeline.plist" > "$DEST"
chmod +x "$SCRIPT_DIR/run-pipeline.sh"

launchctl unload "$DEST" >/dev/null 2>&1 || true
launchctl load "$DEST"

echo "Kuruldu: $DEST"
echo "Her gün 03:00'te $SCRIPT_DIR/run-pipeline.sh çalışacak (Mac o an açıksa)."
echo
echo "Şimdi test etmek isterseniz (kurulumu beklemeden):"
echo "  launchctl start $LABEL"
echo "  tail -f $SCRIPT_DIR/logs/launchd.out.log"
echo
echo "Durdurmak için: bash $SCRIPT_DIR/uninstall-launchd.sh"

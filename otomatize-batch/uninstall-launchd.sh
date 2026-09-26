#!/usr/bin/env bash
# otomatize-batch/uninstall-launchd.sh — günlük otomatik çalışmayı kaldırır.
set -euo pipefail
LABEL="com.spark.storypipeline"
DEST="$HOME/Library/LaunchAgents/$LABEL.plist"

launchctl unload "$DEST" >/dev/null 2>&1 || true
rm -f "$DEST"
echo "Kaldırıldı: $DEST"
echo "(Zaten başlamış bir batch varsa Anthropic tarafında çalışmaya devam eder — bu sadece yeni otomatik tetiklemeleri durdurur.)"

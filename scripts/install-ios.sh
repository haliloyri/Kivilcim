#!/usr/bin/env bash
# Kablolu iPhone'a uygulamanın son halini (Release, JS gömülü) yükler.
# Kullanım: ./scripts/install-ios.sh [cihaz-adı-veya-UDID]
set -euo pipefail
cd "$(dirname "$0")/.."

DEVICE="${1:-}"

if [ ! -d ios/Pods ]; then
  (cd ios && pod install)
fi

if [ -n "$DEVICE" ]; then
  exec npx expo run:ios --device "$DEVICE" --configuration Release --no-bundler
else
  # Cihaz verilmezse Expo bağlı cihazları listeler/seçtirir
  exec npx expo run:ios --device --configuration Release --no-bundler
fi

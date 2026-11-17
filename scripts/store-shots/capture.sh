#!/usr/bin/env bash
# Açık simülatörün ekranını App Store ham çekimi olarak kaydeder.
# Kullanım: bash scripts/store-shots/capture.sh <tr|en|es|de> <01-06>
# Durum çubuğu: 9:41, tam pil, tam çekim gücü. Bittiğinde: xcrun simctl status_bar booted clear
set -euo pipefail
lang="${1:?dil ver: tr|en|es|de}"
no="${2:?kare no ver: 01-06}"
[[ "$lang" =~ ^(tr|en|es|de)$ ]] || { echo "geçersiz dil: $lang" >&2; exit 1; }
[[ "$no" =~ ^0[1-6]$ ]] || { echo "geçersiz kare: $no (01-06)" >&2; exit 1; }
root="$(cd "$(dirname "$0")/../.." && pwd)"
out="$root/docs/app-store/raw/$lang/$no.png"
mkdir -p "$(dirname "$out")"
xcrun simctl status_bar booted override --time 9:41 --dataNetwork wifi --wifiMode active --wifiBars 3 \
  --cellularMode active --cellularBars 4 --batteryState charged --batteryLevel 100
sleep 1
# Simülatör servisi yalnızca geçici klasöre yazabiliyor; çekim oradan taşınır.
tmp="${TMPDIR:-/tmp}/albor-shot-$$.png"
xcrun simctl io booted screenshot --type=png "$tmp" >/dev/null 2>&1
mv "$tmp" "$out"
size="$(ffprobe -v error -show_entries stream=width,height -of csv=p=0:s=x "$out")"
[[ "$size" == "1320x2868" ]] || { echo "uyarı: $out ölçüsü $size (beklenen 1320x2868, iPhone 17 Pro Max)" >&2; exit 1; }
echo "$out ($size)"

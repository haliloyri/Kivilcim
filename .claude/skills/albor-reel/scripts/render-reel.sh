#!/usr/bin/env bash
# render-reel.sh — check, render and loudness-normalize one Albor reel.
# Usage: bash .claude/skills/albor-reel/scripts/render-reel.sh reels/<id>
# Output: reels/<id>/out/<id>.final.mp4  (1080×1920, about -15 LUFS, true peak -1.5 dB)
set -euo pipefail
DIR="${1:?usage: render-reel.sh reels/<id>}"
NAME="$(basename "$DIR")"
HF="hyperframes@0.8.222"
cd "$DIR"
mkdir -p out
npx --yes "$HF" check
npx --yes "$HF" render --output "out/$NAME.mp4" 2>&1 | grep -v '^\[INFO\]' || true
# the ElevenLabs voice lands near -20 LUFS; social feeds expect -16 to -14
ffmpeg -hide_banner -loglevel error -y -i "out/$NAME.mp4" -c:v copy \
  -af loudnorm=I=-15:TP=-1.5:LRA=11 -ar 48000 -c:a aac -b:a 192k "out/$NAME.final.mp4"
ffmpeg -hide_banner -nostats -i "out/$NAME.final.mp4" -af ebur128=peak=true -f null - 2>&1 \
  | grep -A14 Summary | grep -E 'I:|Peak:' || true
echo "Done: $DIR/out/$NAME.final.mp4"

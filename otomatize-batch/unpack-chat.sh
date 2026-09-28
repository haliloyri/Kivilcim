#!/bin/bash
# Unpacks a chat-produced story bundle into staging/p1 without overwriting anything.
# usage: bash otomatize-batch/unpack-chat.sh otomatize-batch/logs/<bundle>.tgz
set -e; cd "$(dirname "$0")/.."
T=$(mktemp -d); tar xzf "$1" -C "$T"; n=0; s=0
for d in brief en tr; do mkdir -p staging/p1/$d; [ -d "$T/$d" ] || continue; for f in "$T"/$d/*; do b=staging/p1/$d/$(basename "$f"); if [ -e "$b" ]; then s=$((s+1)); else cp "$f" "$b"; n=$((n+1)); fi; done; done
echo "copied $n, skipped (already existed) $s"

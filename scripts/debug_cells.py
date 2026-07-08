#!/usr/bin/env python3
"""
Debug: Save a full cell to understand the layout
"""
from PIL import Image
import os

SRC = '/Users/hoyri/Downloads/hf_20260706_202316_eca78661-9e92-478a-a0c5-caa731c389dc.png'
OUT = '/Users/hoyri/Documents/Projects/Spark/assets/badges/_debug'
os.makedirs(OUT, exist_ok=True)

img = Image.open(SRC)
w, h = img.size  # 1520 x 2688

COLS = 5
ROWS = 5
cell_w = w // COLS  # 304
cell_h = h // ROWS  # 537

# Save a few full cells for inspection
for r in range(ROWS):
    for c in range(COLS):
        if (r, c) in [(0,0), (0,1), (1,0), (2,0), (4,0)]:
            left = c * cell_w
            top = r * cell_h
            cell = img.crop((left, top, left + cell_w, top + cell_h))
            cell.save(f'{OUT}/cell_r{r}_c{c}.png')
            print(f'Saved cell [{r},{c}]: {cell_w}x{cell_h}')

print("Done - check _debug folder")

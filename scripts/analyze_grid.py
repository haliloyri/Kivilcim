#!/usr/bin/env python3
"""
Analyze the vertical structure of the badge grid image.
Find where the text rows and icon rows are by looking at pixel density.
"""
from PIL import Image

SRC = '/Users/hoyri/Downloads/hf_20260706_202316_eca78661-9e92-478a-a0c5-caa731c389dc.png'

img = Image.open(SRC).convert('RGB')
w, h = img.size
pixels = img.load()

# For the first column (x=76..228), scan vertically
# and count non-background pixels per row
col_center = 152  # center of first column
half = 130

print(f"Vertical density profile for column 0 (x={col_center-half}..{col_center+half}):")
print(f"{'Y':>5} {'Density':>8} {'Bar'}")
print("-" * 60)

for y in range(0, h, 8):  # sample every 8 pixels
    count = 0
    for x in range(col_center - half, col_center + half):
        r, g, b = pixels[x, y]
        if r < 235 or g < 230 or b < 220:
            count += 1
    bar = '#' * (count // 4)
    if y % 32 == 0:
        print(f"{y:>5} {count:>8} {bar}")

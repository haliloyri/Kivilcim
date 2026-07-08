#!/usr/bin/env python3
"""
Split the 5x5 badge grid image into individual circular badge icons.
Uses manually determined icon centers based on density analysis.
"""
from PIL import Image
import os

SRC = '/Users/hoyri/Downloads/hf_20260706_202316_eca78661-9e92-478a-a0c5-caa731c389dc.png'
BADGES_DIR = '/Users/hoyri/Documents/Projects/Spark/assets/badges'

BADGE_GRID = [
    ('first_read',     'İlk Kıvılcım'),
    ('explorer',       'Kaşif'),
    ('sage',           'Bilge'),
    ('bookworm',       'Kitap Kurdu'),
    ('streak_7',       '7 Gün'),
    ('cat_variety_3',  'Meraklı'),
    ('cat_variety_5',  'Çok Yönlü'),
    ('cat_variety_10', 'Bilge Gezgin'),
    ('cat_master_5',   'Odaklı'),
    ('cat_master_10',  'Uzman'),
    ('cat_master_25',  'Otorite'),
    ('cat_master_50',  'Usta'),
    ('cat_master_100', 'Efsane'),
    ('philosopher',    'Filozof'),
    ('save_5',         'Koleksiyoncu'),
    ('save_10',        'Küratör'),
    ('save_50',        'Arşivci'),
    ('save_100',       'Kütüphaneci'),
    ('share_1',        'Paylaşımcı'),
    ('share_10',       'Tanıtıcı'),
    ('share_20',       'Bağlayıcı'),
    ('share_30',       'Yayıncı'),
    ('share_50',       'Fenomen'),
    ('icebreaker',     'Icebreaker'),
    ('storyteller',    'Storyteller'),
]

COLS = 5
ROWS = 5

def find_icon_center_y(img, col_cx, approx_cy, search_range=120):
    """
    Refine the Y center for a specific column by finding the 
    densest 240px window around the approximate center.
    """
    pixels = img.load()
    half_w = 130
    scan_left = max(0, col_cx - half_w)
    scan_right = min(img.width, col_cx + half_w)
    
    top = max(0, approx_cy - search_range)
    bottom = min(img.height, approx_cy + search_range)
    
    densities = []
    for y in range(top, bottom):
        count = 0
        for x in range(scan_left, scan_right):
            r, g, b = pixels[x, y][:3]
            if r < 235 or g < 230 or b < 220:
                count += 1
        densities.append(count)
    
    # Find center of mass of densest 240px window
    window = 240
    if len(densities) < window:
        return approx_cy
    
    best_sum = 0
    best_start = 0
    for i in range(len(densities) - window):
        s = sum(densities[i:i+window])
        if s > best_sum:
            best_sum = s
            best_start = i
    
    return top + best_start + window // 2

def main():
    img = Image.open(SRC).convert('RGB')
    w, h = img.size
    print(f'Source image: {w}x{h}')
    
    cell_w = w / COLS  # 304
    
    # Approximate Y centers for each row (from density analysis)
    # These are the vertical centers of the circular icon regions
    ROW_CENTERS_Y = [400, 880, 1330, 1790, 2200]
    
    ICON_SIZE = 252  # crop size
    
    os.makedirs(BADGES_DIR, exist_ok=True)
    
    for idx, (badge_id, tr_name) in enumerate(BADGE_GRID):
        col = idx % COLS
        row = idx // COLS
        
        cx = int(col * cell_w + cell_w / 2)
        approx_cy = ROW_CENTERS_Y[row]
        
        # Refine center for this specific column
        cy = find_icon_center_y(img, cx, approx_cy, search_range=100)
        
        half = ICON_SIZE // 2
        
        crop_left = max(0, cx - half)
        crop_top = max(0, cy - half)
        crop_right = min(w, cx + half)
        crop_bottom = min(h, cy + half)
        
        badge_icon = img.crop((crop_left, crop_top, crop_right, crop_bottom))
        
        out_path = os.path.join(BADGES_DIR, f'{badge_id}.png')
        badge_icon.save(out_path, 'PNG', optimize=True)
        print(f'  [{row},{col}] {badge_id:20s} ({tr_name:15s}) center=({cx},{cy})')
    
    print(f'\nDone! {len(BADGE_GRID)} badges saved to {BADGES_DIR}')

if __name__ == '__main__':
    main()

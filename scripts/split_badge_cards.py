#!/usr/bin/env python3
"""
Split composite badge card images into individual badge card backgrounds.
Each source image contains 5 cards stacked vertically with ~12px white gaps.
Output: 1080x460 PNG files matching existing badge naming convention.

Detects card boundaries by finding white gap rows between cards.
"""

from PIL import Image
import os

MEDIA_DIR = '/Users/hoyri/.gemini/antigravity-ide/brain/80f70d1c-1f77-4b8a-b02c-d01e0d0bf67e'
OUTPUT_DIR = '/Users/hoyri/Documents/Projects/Spark/assets/banner/badge'

# Source files sorted by timestamp (matching the order user attached them)
SOURCE_FILES = sorted([
    f for f in os.listdir(MEDIA_DIR) 
    if f.startswith('media__') and f.endswith('.png')
])

# Badge name mapping: [file_index][card_index] -> badge_id
BADGE_NAMES = [
    # Image 1: book+sun, mountain+flag path, tree+bench, book stack, calendar+check
    ['first_read', 'explorer', 'sage', 'bookworm', 'streak_7'],
    # Image 2: photo frame+star, file box, temple+book, paper plane, megaphone
    ['cat_variety_3', 'cat_variety_5', 'cat_variety_10', 'share_1', 'share_20'],
    # Image 3: magnifying glass?, compass, signpost, target, purple mountain+flag
    ['philosopher', 'cat_master_5', 'cat_master_10', 'cat_master_25', 'cat_master_50'],
    # Image 4: greek column, trophy+star, golden mountain+flag, thinking bust, file archive
    ['cat_master_100', 'save_5', 'save_10', 'save_50', 'save_100'],
    # Image 5: molecule, antenna tower, gold star podium, crystal ice, quill+book
    ['share_10', 'share_30', 'share_50', 'storyteller', 'icebreaker'],
]

TARGET_WIDTH = 1080
TARGET_HEIGHT = 460
CARDS_PER_IMAGE = 5
BRIGHTNESS_THRESHOLD = 252.0  # rows above this are considered "gap"


def get_row_brightness(img, y, step=3):
    """Calculate average brightness for a row."""
    w = img.size[0]
    total = 0
    count = 0
    for x in range(0, w, step):
        r, g, b = img.getpixel((x, y))[:3]
        total += (r + g + b) / 3
        count += 1
    return total / count


def find_card_regions(img):
    """
    Detect the 5 card regions by finding white gap rows.
    Returns list of (y_start, y_end) tuples for each card's content area.
    """
    w, h = img.size
    
    # Find all gap rows (nearly white)
    is_gap = []
    for y in range(h):
        brightness = get_row_brightness(img, y)
        is_gap.append(brightness > BRIGHTNESS_THRESHOLD)
    
    # Group consecutive gap rows into gap regions
    gaps = []
    in_gap = False
    gap_start = 0
    for y in range(h):
        if is_gap[y] and not in_gap:
            gap_start = y
            in_gap = True
        elif not is_gap[y] and in_gap:
            gaps.append((gap_start, y - 1))
            in_gap = False
    if in_gap:
        gaps.append((gap_start, h - 1))
    
    # Extract card regions from gaps
    # First card starts at top gap's end, last card ends at bottom gap's start
    cards = []
    
    if len(gaps) >= 6:
        # Expected: top-padding gap, 4 inter-card gaps, bottom-padding gap = 6 gaps
        for i in range(CARDS_PER_IMAGE):
            card_start = gaps[i][1] + 1       # after the gap before this card
            card_end = gaps[i + 1][0] - 1     # before the gap after this card
            cards.append((card_start, card_end))
    elif len(gaps) >= 5:
        # 5 gaps: might not have bottom padding
        for i in range(CARDS_PER_IMAGE):
            card_start = gaps[i][1] + 1 if i < len(gaps) else 0
            card_end = gaps[i + 1][0] - 1 if i + 1 < len(gaps) else h - 1
            cards.append((card_start, card_end))
    else:
        # Fallback: divide equally
        card_h = h / CARDS_PER_IMAGE
        for i in range(CARDS_PER_IMAGE):
            cards.append((int(i * card_h), int((i + 1) * card_h) - 1))
    
    return cards


def split_and_save():
    """Split each source image into 5 individual badge cards."""
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    processed = 0
    for file_idx, filename in enumerate(SOURCE_FILES):
        filepath = os.path.join(MEDIA_DIR, filename)
        img = Image.open(filepath).convert('RGBA')
        src_w, src_h = img.size
        print(f'\nProcessing {filename} ({src_w}x{src_h})')
        
        if file_idx >= len(BADGE_NAMES):
            print(f'  WARNING: No badge mapping for image index {file_idx}, skipping')
            continue
        
        badge_names = BADGE_NAMES[file_idx]
        
        # Find card regions
        card_regions = find_card_regions(img)
        print(f'  Found {len(card_regions)} card regions:')
        for i, (ys, ye) in enumerate(card_regions):
            print(f'    Card {i+1}: y={ys}..{ye} (height={ye-ys+1})')
        
        for card_idx in range(min(CARDS_PER_IMAGE, len(card_regions))):
            badge_id = badge_names[card_idx]
            y_start, y_end = card_regions[card_idx]
            
            # Crop the card
            card = img.crop((0, y_start, src_w, y_end + 1))
            
            # Resize to target dimensions (1080x460) to match existing cards
            card_resized = card.resize((TARGET_WIDTH, TARGET_HEIGHT), Image.LANCZOS)
            
            # Convert to RGB (remove alpha)
            card_rgb = card_resized.convert('RGB')
            
            output_path = os.path.join(OUTPUT_DIR, f'{badge_id}.png')
            card_rgb.save(output_path, 'PNG', optimize=True)
            
            file_size = os.path.getsize(output_path)
            print(f'  [{card_idx+1}] {badge_id}.png -> {TARGET_WIDTH}x{TARGET_HEIGHT} ({file_size:,} bytes)')
            processed += 1
    
    print(f'\n✅ Done! {processed} badge card backgrounds saved to {OUTPUT_DIR}')
    
    # Verify all 25 badges are covered
    all_badges = set()
    for names in BADGE_NAMES:
        all_badges.update(names)
    
    existing = set(f.replace('.png', '') for f in os.listdir(OUTPUT_DIR) if f.endswith('.png'))
    missing = all_badges - existing
    if missing:
        print(f'⚠️  Missing badges: {missing}')
    else:
        print(f'✅ All {len(all_badges)} badge backgrounds present')


if __name__ == '__main__':
    split_and_save()

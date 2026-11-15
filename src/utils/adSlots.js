// adSlots — where native ads go inside lists and the story reader.
// Pure helpers, no native modules, so they can be tested without AdMob.

/**
 * Adds an ad slot after every `every`-th item, at most `max` slots. No slot goes
 * after the last item: an ad belongs between content, never at the very end.
 * Slots are `{ adSlot: true, key: 'ad-1' }`, `'ad-2'`, … in order.
 */
export const insertAdSlots = (items, every, max) => {
  if (!Array.isArray(items) || every < 1 || max < 1) return items;
  const out = [];
  let slots = 0;
  items.forEach((item, i) => {
    out.push(item);
    const isLast = i === items.length - 1;
    if ((i + 1) % every === 0 && !isLast && slots < max) {
      slots += 1;
      out.push({ adSlot: true, key: `ad-${slots}` });
    }
  });
  return out;
};

export const isAdSlot = (entry) => entry?.adSlot === true;

// [[open]] and [[use]] sections draw no heading of their own in the reader.
const HEADINGLESS_SECTIONS = new Set(['open', 'use']);

/**
 * Index of the segment the reader ad goes right before: the section heading
 * nearest the middle of the story, never one of the first two segments.
 * Returns -1 when the story has no such heading (no ad then). A tie goes to
 * the earlier heading.
 */
export const pickReaderAdIndex = (segments) => {
  if (!Array.isArray(segments)) return -1;
  const middle = segments.length / 2;
  let best = -1;
  segments.forEach((seg, idx) => {
    if (idx < 2 || seg?.type !== 'section' || HEADINGLESS_SECTIONS.has(seg.section)) return;
    if (best === -1 || Math.abs(idx - middle) < Math.abs(best - middle)) best = idx;
  });
  return best;
};

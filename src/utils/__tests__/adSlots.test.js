import { insertAdSlots, isAdSlot, pickReaderAdIndex } from '../adSlots';

const range = (n) => Array.from({ length: n }, (_, i) => i + 1);
const slot = (n) => ({ adSlot: true, key: `ad-${n}` });

describe('insertAdSlots', () => {
  it('inserts a slot after every Nth item', () => {
    expect(insertAdSlots(range(12), 5, 3)).toEqual([
      1, 2, 3, 4, 5, slot(1), 6, 7, 8, 9, 10, slot(2), 11, 12,
    ]);
  });

  it('adds no trailing slot when the list ends on a multiple', () => {
    expect(insertAdSlots(range(10), 5, 3)).toEqual([1, 2, 3, 4, 5, slot(1), 6, 7, 8, 9, 10]);
  });

  it('adds nothing to a list shorter than every', () => {
    expect(insertAdSlots([1, 2, 3], 5, 3)).toEqual([1, 2, 3]);
  });

  it('caps the number of slots', () => {
    const out = insertAdSlots(range(30), 5, 2);
    expect(out.filter(isAdSlot)).toHaveLength(2);
    expect(out).toHaveLength(32);
  });

  it('returns the input unchanged for every < 1, max < 1 and an empty list', () => {
    expect(insertAdSlots(range(8), 0, 3)).toEqual(range(8));
    expect(insertAdSlots(range(8), 5, 0)).toEqual(range(8));
    expect(insertAdSlots([], 5, 3)).toEqual([]);
  });
});

describe('isAdSlot', () => {
  it('is true only for slot entries', () => {
    expect(isAdSlot(slot(1))).toBe(true);
    expect(isAdSlot(7)).toBe(false);
    expect(isAdSlot({ story_id: 'a' })).toBe(false);
    expect(isAdSlot(undefined)).toBe(false);
  });
});

describe('pickReaderAdIndex', () => {
  const text = { type: 'text' };
  const section = (name) => ({ type: 'section', section: name });

  it('picks the heading closest to the middle', () => {
    const segments = [
      section('story'), text, text, text,
      section('lessons'), { type: 'lesson' }, { type: 'lesson' },
      section('reflect'), text, text,
    ];
    expect(pickReaderAdIndex(segments)).toBe(4);
  });

  it('ignores open and use sections', () => {
    const segments = [section('open'), text, section('use'), text, text, section('story'), text, text];
    expect(pickReaderAdIndex(segments)).toBe(5);
  });

  it('ignores headings before index 2', () => {
    expect(pickReaderAdIndex([text, section('story'), text, text, text, text])).toBe(-1);
  });

  it('returns -1 with no eligible heading', () => {
    expect(pickReaderAdIndex([])).toBe(-1);
    expect(pickReaderAdIndex([text, text, text])).toBe(-1);
  });

  it('prefers the earlier heading on a tie', () => {
    const segments = [text, text, text, section('story'), text, section('lessons'), text, text];
    expect(pickReaderAdIndex(segments)).toBe(3);
  });
});

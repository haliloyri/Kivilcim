import { hasReachedReadingCompletion, isShortStoryFullyVisible, READ_COMPLETE_RATIO, SHORT_STORY_DWELL_MS } from '../storyCompletion';

describe('story completion guards', () => {
  it('requires 90% of a scrollable story before an H can be created', () => {
    expect(READ_COMPLETE_RATIO).toBe(0.9);
    expect(hasReachedReadingCompletion({ contentOffsetY: 599, viewportHeight: 300, contentHeight: 1000 })).toBe(false);
    expect(hasReachedReadingCompletion({ contentOffsetY: 600, viewportHeight: 300, contentHeight: 1000 })).toBe(true);
  });

  it('identifies only genuinely fully visible short stories for the five-second dwell guard', () => {
    expect(SHORT_STORY_DWELL_MS).toBe(5_000);
    expect(isShortStoryFullyVisible({ contentHeight: 500, viewportHeight: 500 })).toBe(true);
    expect(isShortStoryFullyVisible({ contentHeight: 502, viewportHeight: 500 })).toBe(false);
  });
});

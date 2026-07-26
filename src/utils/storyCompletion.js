// Reading completion is shared by StoryDetail's scroll and short-story paths.
// Keep these values independent from the Kıvılcım rank engine so a UI change
// cannot quietly alter the meaning of an H evidence event.
export const READ_COMPLETE_RATIO = 0.9;
export const SHORT_STORY_DWELL_MS = 5_000;

export const hasReachedReadingCompletion = ({ contentOffsetY = 0, contentHeight = 0, viewportHeight = 0 } = {}) => {
  const safeContentHeight = Number(contentHeight) || 0;
  if (safeContentHeight <= 0) return false;
  return ((Number(contentOffsetY) || 0) + (Number(viewportHeight) || 0)) / safeContentHeight >= READ_COMPLETE_RATIO;
};

export const isShortStoryFullyVisible = ({ contentHeight = 0, viewportHeight = 0 } = {}) => {
  const safeContentHeight = Number(contentHeight) || 0;
  const safeViewportHeight = Number(viewportHeight) || 0;
  return safeViewportHeight > 0 && safeContentHeight > 0 && safeContentHeight <= safeViewportHeight + 1;
};

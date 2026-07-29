import { getStoryAudioAsset, hasStoryAudio, STORY_AUDIO_IDS } from '../storyAudio';

describe('story audio asset mapping', () => {
  it('maps every packaged narration to its database story id', () => {
    expect(STORY_AUDIO_IDS).toHaveLength(42);
    expect(new Set(STORY_AUDIO_IDS).size).toBe(STORY_AUDIO_IDS.length);
    expect(STORY_AUDIO_IDS[0]).toBe(1059);
    expect(STORY_AUDIO_IDS.at(-1)).toBe(1108);
    expect(STORY_AUDIO_IDS).not.toContain(1069);
  });

  it('returns an asset only when that story has a packaged narration', () => {
    expect(getStoryAudioAsset(1059)).toBeTruthy();
    expect(getStoryAudioAsset('1070')).toBeTruthy();
    expect(hasStoryAudio(1108)).toBe(true);
    expect(getStoryAudioAsset(1069)).toBeNull();
    expect(hasStoryAudio('not-a-story-id')).toBe(false);
  });
});

const mockInvoke = jest.fn();

jest.mock('../../services/supabase', () => ({
  SUPABASE_LIVE: true,
  supabase: { functions: { invoke: (...args) => mockInvoke(...args) } },
}));

const { getStoryAudioUrl, hasStoryAudio, __resetStoryAudioCache } = require('../storyAudio');

describe('storyAudio', () => {
  beforeEach(() => {
    mockInvoke.mockReset();
    __resetStoryAudioCache();
  });

  it('returns the presigned URL when the narration exists', async () => {
    mockInvoke.mockResolvedValue({
      data: { available: true, url: 'https://r2.example/1059-en-seslendirme.mp3?sig', expiresAt: Date.now() + 3600000 },
      error: null,
    });

    await expect(getStoryAudioUrl(1059, 'en')).resolves.toBe('https://r2.example/1059-en-seslendirme.mp3?sig');
    expect(mockInvoke).toHaveBeenCalledWith('audio-url', { body: { storyId: 1059, lang: 'en' } });
  });

  it('caches results per story and language', async () => {
    mockInvoke.mockResolvedValue({ data: { available: false }, error: null });

    await expect(hasStoryAudio('1069', 'tr')).resolves.toBe(false);
    await expect(hasStoryAudio(1069, 'tr')).resolves.toBe(false);
    expect(mockInvoke).toHaveBeenCalledTimes(1);
  });

  it('refetches when the cached URL is close to expiry', async () => {
    mockInvoke.mockResolvedValue({
      data: { available: true, url: 'https://r2.example/a', expiresAt: Date.now() + 60000 },
      error: null,
    });

    await getStoryAudioUrl(1060, 'en');
    await getStoryAudioUrl(1060, 'en');
    expect(mockInvoke).toHaveBeenCalledTimes(2);
  });

  it('does not cache failed lookups', async () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    mockInvoke.mockResolvedValueOnce({ data: null, error: new Error('offline') });
    mockInvoke.mockResolvedValueOnce({ data: { available: true, url: 'https://r2.example/b', expiresAt: Date.now() + 3600000 }, error: null });

    await expect(getStoryAudioUrl(1061, 'en')).resolves.toBeNull();
    await expect(getStoryAudioUrl(1061, 'en')).resolves.toBe('https://r2.example/b');
    console.warn.mockRestore();
  });

  it('rejects invalid ids and languages without calling the function', async () => {
    await expect(getStoryAudioUrl('not-a-story-id', 'en')).resolves.toBeNull();
    await expect(getStoryAudioUrl(1059, 'fr')).resolves.toBeNull();
    expect(mockInvoke).not.toHaveBeenCalled();
  });
});

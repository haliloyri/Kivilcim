const mockStorage = {};

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn((key) => Promise.resolve(mockStorage[key] ?? null)),
  setItem: jest.fn((key, value) => {
    mockStorage[key] = value;
    return Promise.resolve();
  }),
}));

jest.mock('expo-store-review', () => ({
  isAvailableAsync: jest.fn(),
  requestReview: jest.fn(),
}));

jest.mock('../analytics', () => ({
  ANALYTICS_EVENTS: { REVIEW_PROMPT_SHOWN: 'review_prompt_shown' },
  trackEvent: jest.fn(),
}));

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as StoreReview from 'expo-store-review';
import { trackEvent } from '../analytics';
import { maybeRequestReview } from '../review';

describe('maybeRequestReview', () => {
  beforeEach(() => {
    Object.keys(mockStorage).forEach((key) => delete mockStorage[key]);
    jest.clearAllMocks();
    StoreReview.isAvailableAsync.mockResolvedValue(true);
    StoreReview.requestReview.mockResolvedValue();
  });

  it('does not prompt a free user before they have a couple of real reads', async () => {
    const shown = await maybeRequestReview({ isPremium: false, totalReads: 1 });
    expect(shown).toBe(false);
    expect(StoreReview.requestReview).not.toHaveBeenCalled();
  });

  it('prompts a free user once they clear the minimum reads', async () => {
    const shown = await maybeRequestReview({ isPremium: false, totalReads: 2 });
    expect(shown).toBe(true);
    expect(StoreReview.requestReview).toHaveBeenCalledTimes(1);
    expect(trackEvent).toHaveBeenCalledWith('review_prompt_shown', { isPremium: false, totalReads: 2 });
  });

  it('prompts a premium user immediately, with no minimum-reads gate', async () => {
    const shown = await maybeRequestReview({ isPremium: true, totalReads: 0 });
    expect(shown).toBe(true);
  });

  it('never prompts twice within a year', async () => {
    await maybeRequestReview({ isPremium: true, totalReads: 0 });
    StoreReview.requestReview.mockClear();
    const shown = await maybeRequestReview({ isPremium: true, totalReads: 0 });
    expect(shown).toBe(false);
    expect(StoreReview.requestReview).not.toHaveBeenCalled();
  });

  it('does nothing when the native review API is unavailable', async () => {
    StoreReview.isAvailableAsync.mockResolvedValue(false);
    const shown = await maybeRequestReview({ isPremium: true, totalReads: 10 });
    expect(shown).toBe(false);
    expect(StoreReview.requestReview).not.toHaveBeenCalled();
  });
});

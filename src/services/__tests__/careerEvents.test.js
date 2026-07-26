jest.mock('../../db/userDb', () => ({
  getCareerEventForStory: jest.fn(),
  recordCareerEvent: jest.fn(),
}));

jest.mock('../offlineQueue', () => ({
  enqueueAndSync: jest.fn(),
}));

jest.mock('../../config/featureFlags', () => ({
  FEATURE_FLAGS: { careerEventCaptureV1: true },
}));

import { buildCareerEvent, makeCareerCreditKey, notifyCareerDataChanged, recordCareerApplication, recordCareerInsightSaved, recordCareerStoryCompletion, subscribeToCareerEvents } from '../careerEvents';
import { getCareerEventForStory, recordCareerEvent } from '../../db/userDb';

describe('career event identities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    recordCareerEvent.mockResolvedValue({ inserted: true });
  });

  it('gives reading and audio completion the same H credit identity', () => {
    const common = { storyId: 42, categoryId: 3, occurredAt: '2026-07-02T10:00:00.000Z' };
    const read = buildCareerEvent({ ...common, creditType: 'H', eventSubtype: 'story_completed', completionMethod: 'read' });
    const audio = buildCareerEvent({ ...common, creditType: 'H', eventSubtype: 'story_completed', completionMethod: 'audio' });
    expect(read.creditKey).toBe(audio.creditKey);
    expect(read.eventId).toBe(audio.eventId);
    expect(read.localDay).toBe('2026-07-02');
  });

  it('uses a deterministic credit key across retries', () => {
    expect(makeCareerCreditKey({ creditType: 'U', storyId: 'story-9' })).toBe('career:1:U:story-9');
  });

  it('notifies derived career views when stored data is reset', () => {
    const listener = jest.fn();
    const unsubscribe = subscribeToCareerEvents(listener);
    notifyCareerDataChanged();
    unsubscribe();
    expect(listener).toHaveBeenCalledWith({ type: 'career_data_changed' });
  });

  it('does not issue a deep-interaction credit before the story is completed', async () => {
    getCareerEventForStory.mockResolvedValueOnce(null);
    await expect(recordCareerInsightSaved({ storyId: 'story-9', eventSubtype: 'takeaway_saved' }))
      .resolves.toEqual({ captured: false, reason: 'story_not_completed' });
  });

  it('does not issue an application credit before the story is completed', async () => {
    getCareerEventForStory.mockResolvedValueOnce(null);
    await expect(recordCareerApplication({ storyId: 'story-9', eventSubtype: 'private_application_plan' }))
      .resolves.toEqual({ captured: false, reason: 'story_not_completed' });
  });

  it('records the plan-specific mark-used subtype after its H prerequisite exists', async () => {
    getCareerEventForStory.mockResolvedValueOnce({ occurredAt: '2026-07-01T10:00:00.000Z' });

    await recordCareerApplication({ storyId: 'story-9', eventSubtype: 'conversation_mark_used' });

    expect(recordCareerEvent).toHaveBeenCalledWith(expect.objectContaining({
      creditType: 'U', eventSubtype: 'conversation_mark_used', storyId: 'story-9',
    }));
  });

  it('records a voice reflection as a deep-connection credit after its H prerequisite exists', async () => {
    getCareerEventForStory.mockResolvedValueOnce({ occurredAt: '2026-07-01T10:00:00.000Z' });

    await recordCareerInsightSaved({ storyId: 'story-9', eventSubtype: 'voice_recording' });

    expect(recordCareerEvent).toHaveBeenCalledWith(expect.objectContaining({
      creditType: 'D', eventSubtype: 'voice_recording', storyId: 'story-9',
    }));
  });

  it('uses the 24-hour revisit subtype only after an existing H was not inserted again', async () => {
    recordCareerEvent.mockResolvedValueOnce({ inserted: false }).mockResolvedValueOnce({ inserted: true });
    getCareerEventForStory.mockResolvedValueOnce({ occurredAt: '2020-01-01T10:00:00.000Z' });

    await recordCareerStoryCompletion({ storyId: 'story-9', categoryId: 3, completionMethod: 'read' });

    expect(recordCareerEvent).toHaveBeenLastCalledWith(expect.objectContaining({
      creditType: 'D', eventSubtype: 'revisit_24h', storyId: 'story-9',
    }));
  });
});

const mockStorage = {};

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn((key) => Promise.resolve(mockStorage[key] ?? null)),
  setItem: jest.fn((key, value) => {
    mockStorage[key] = value;
    return Promise.resolve();
  }),
}));

jest.mock('../supabase', () => ({
  SUPABASE_LIVE: true,
  getCurrentUser: jest.fn(),
  supabase: { rpc: jest.fn(), from: jest.fn() },
}));

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentUser, supabase } from '../supabase';
import { enqueueAndSync, flushOfflineQueue } from '../offlineQueue';

const QUEUE_KEY = '@kivilcim_offline_queue_v1';

describe('offline career queue', () => {
  let warnSpy;

  beforeEach(() => {
    Object.keys(mockStorage).forEach((key) => delete mockStorage[key]);
    jest.clearAllMocks();
    getCurrentUser.mockResolvedValue({ id: 'current-user' });
    supabase.rpc.mockResolvedValue({ error: null });
    supabase.from.mockImplementation(() => ({
      delete: () => ({ eq: () => Promise.resolve({ error: null }) }),
      upsert: () => Promise.resolve({ error: null }),
    }));
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => warnSpy.mockRestore());

  it('stamps queued operations with the authenticated owner after a network failure', async () => {
    supabase.rpc.mockResolvedValueOnce({ error: new TypeError('Network request failed') });

    await enqueueAndSync('upsert_legacy_badges', { badgeIds: ['first_read'] });

    expect(JSON.parse(mockStorage[QUEUE_KEY])).toEqual([
      expect.objectContaining({
        type: 'upsert_legacy_badges',
        payload: { badgeIds: ['first_read'] },
        ownerUserId: 'current-user',
        queuedAt: expect.any(String),
      }),
    ]);
  });

  it('never replays another session’s queued career write', async () => {
    mockStorage[QUEUE_KEY] = JSON.stringify([
      { type: 'upsert_legacy_badges', payload: { badgeIds: ['first_read'] }, ownerUserId: 'former-user', queuedAt: '2026-07-25T09:00:00.000Z' },
    ]);

    await flushOfflineQueue();

    expect(supabase.rpc).not.toHaveBeenCalled();
    expect(JSON.parse(mockStorage[QUEUE_KEY])).toEqual([
      expect.objectContaining({ ownerUserId: 'former-user', type: 'upsert_legacy_badges' }),
    ]);
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });

  it('includes every career replica in the durable reset operation', async () => {
    await enqueueAndSync('reset_user_data');

    const clearedTables = supabase.from.mock.calls.map(([table]) => table);
    expect(clearedTables).toEqual(expect.arrayContaining([
      'user_career_events',
      'user_career_state',
      'user_career_nodes',
      'user_legacy_badges',
    ]));
  });
});

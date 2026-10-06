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
  supabase: { rpc: jest.fn(), from: jest.fn(), auth: { getSession: jest.fn() } },
}));

jest.mock('../connectivity', () => ({
  isOnline: jest.fn(),
  onReconnect: jest.fn(() => () => {}),
}));

import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../supabase';
import { isOnline } from '../connectivity';
import {
  enqueueAndSync, flushOfflineQueue, hasPendingSync, getPendingSyncCount,
} from '../offlineQueue';

const QUEUE_KEY = '@albor_offline_queue_v1';

describe('offline career queue', () => {
  let warnSpy;

  beforeEach(() => {
    Object.keys(mockStorage).forEach((key) => delete mockStorage[key]);
    jest.clearAllMocks();
    supabase.auth.getSession.mockResolvedValue({ data: { session: { user: { id: 'current-user' } } } });
    isOnline.mockResolvedValue(true);
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

  it('marks writes pending without touching the network while offline', async () => {
    isOnline.mockResolvedValue(false);

    await enqueueAndSync('upsert_legacy_badges', { badgeIds: ['a'] });
    await enqueueAndSync('upsert_legacy_badges', { badgeIds: ['b'] });

    expect(supabase.rpc).not.toHaveBeenCalled();
    expect(JSON.parse(mockStorage[QUEUE_KEY]).map((i) => i.payload.badgeIds[0])).toEqual(['a', 'b']);
    expect(await hasPendingSync()).toBe(true);
    expect(await getPendingSyncCount()).toBe(2);
  });

  it('does not lose writes fired back to back', async () => {
    isOnline.mockResolvedValue(false);

    await Promise.all(['a', 'b', 'c'].map((id) => enqueueAndSync('upsert_legacy_badges', { badgeIds: [id] })));

    expect(JSON.parse(mockStorage[QUEUE_KEY])).toHaveLength(3);
  });

  it('queues behind pending writes when back online, then sends them in order', async () => {
    isOnline.mockResolvedValue(false);
    await enqueueAndSync('upsert_legacy_badges', { badgeIds: ['first'] });

    isOnline.mockResolvedValue(true);
    await enqueueAndSync('upsert_legacy_badges', { badgeIds: ['second'] });
    await flushOfflineQueue();

    expect(supabase.rpc.mock.calls.map(([, args]) => args.p_badge_ids[0])).toEqual(['first', 'second']);
    expect(JSON.parse(mockStorage[QUEUE_KEY])).toEqual([]);
    expect(await hasPendingSync()).toBe(false);
  });

  it('keeps items pending when the reconnect turns out to be offline', async () => {
    isOnline.mockResolvedValue(false);
    await enqueueAndSync('upsert_legacy_badges', { badgeIds: ['a'] });
    supabase.rpc.mockResolvedValueOnce({ error: new TypeError('Network request failed') });

    await flushOfflineQueue();

    expect(JSON.parse(mockStorage[QUEUE_KEY])).toHaveLength(1);
  });

  it('skips queueing when the device has no session yet', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });
    isOnline.mockResolvedValue(false);

    await enqueueAndSync('upsert_legacy_badges', { badgeIds: ['a'] });

    expect(mockStorage[QUEUE_KEY]).toBeUndefined();
  });
});

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
  supabase: { from: jest.fn() },
}));

jest.mock('../../db/db', () => ({
  getSelectedCategories: jest.fn(),
  getAllUserReads: jest.fn(),
  getAllUserLikes: jest.fn(),
  getStreakFreezes: jest.fn(),
}));

import { getCurrentUser, supabase } from '../supabase';
import { getSelectedCategories, getAllUserReads, getAllUserLikes, getStreakFreezes } from '../../db/db';
import { migrateLocalToServer } from '../migrateLocalToServer';

const FLAG = '@albor_local_migrated_v1';

describe('migrateLocalToServer', () => {
  let upserts;
  let failTable;
  let warnSpy;

  beforeEach(() => {
    Object.keys(mockStorage).forEach((key) => delete mockStorage[key]);
    jest.clearAllMocks();
    upserts = [];
    failTable = null;
    getCurrentUser.mockResolvedValue({ id: 'u1' });
    getSelectedCategories.mockResolvedValue([3, 3, 5]);
    getAllUserReads.mockResolvedValue([
      { storyId: 7, readAt: '2026-09-01' },
      { storyId: 7, readAt: '2026-09-03' },
      { storyId: 'bad', readAt: '2026-09-02' },
    ]);
    getAllUserLikes.mockResolvedValue([{ storyId: 7, liked: true }]);
    getStreakFreezes.mockResolvedValue([{ day: '2026-09-02' }]);
    mockStorage['@albor_favorites'] = JSON.stringify([7, 7, 8]);
    const result = (table) => Promise.resolve({ error: table === failTable ? { message: 'Network request failed' } : null });
    supabase.from.mockImplementation((table) => ({
      upsert: (rows) => {
        upserts.push({ table, rows });
        return result(table);
      },
      insert: () => result(table),
      delete: () => ({ eq: () => result(table) }),
    }));
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => warnSpy.mockRestore());

  it('marks itself done only after every write succeeded', async () => {
    await expect(migrateLocalToServer()).resolves.toEqual({ migrated: true });
    expect(JSON.parse(mockStorage[FLAG])).toEqual(expect.objectContaining({ userId: 'u1' }));
  });

  it('does not mark itself done when the connection drops midway', async () => {
    failTable = 'user_favorites';

    const result = await migrateLocalToServer();

    expect(result).toEqual(expect.objectContaining({ migrated: false, reason: 'error' }));
    expect(mockStorage[FLAG]).toBeUndefined();
    expect(upserts.map((u) => u.table)).not.toContain('profiles');
  });

  it('sends everything again on the retry after a failed run', async () => {
    failTable = 'user_reads';
    await migrateLocalToServer();
    failTable = null;

    await expect(migrateLocalToServer()).resolves.toEqual({ migrated: true });
    expect(upserts.filter((u) => u.table === 'user_reads')).toHaveLength(2);
  });

  it('de-duplicates rows and skips invalid story ids', async () => {
    await migrateLocalToServer();

    const rowsOf = (table) => upserts.find((u) => u.table === table).rows;
    expect(rowsOf('user_reads')).toEqual([{ user_id: 'u1', story_id: 7, read_at: '2026-09-03' }]);
    expect(rowsOf('user_favorites').map((r) => r.story_id)).toEqual([7, 8]);
  });

  it('is a no-op without a session', async () => {
    getCurrentUser.mockResolvedValue(null);

    await expect(migrateLocalToServer()).resolves.toEqual({ migrated: false, reason: 'no_session' });
    expect(supabase.from).not.toHaveBeenCalled();
  });
});

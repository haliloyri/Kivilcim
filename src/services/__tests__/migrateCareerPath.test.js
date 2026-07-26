jest.mock('../../db/db', () => ({
  getAllUserReads: jest.fn(),
  getStoryByLang: jest.fn(),
}));
jest.mock('../../db/userDb', () => ({
  awardCareerNodes: jest.fn(),
  getCareerState: jest.fn(),
  recordCareerEvent: jest.fn(),
  replaceLegacyBadgeIds: jest.fn(),
  upsertCareerState: jest.fn(),
  markCareerNodeSeen: jest.fn(),
}));
jest.mock('../../utils/badges', () => ({ checkBadges: jest.fn() }));
jest.mock('../../utils/analytics', () => ({ ANALYTICS_EVENTS: { CAREER_MIGRATION_COMPLETED: 'career_migration_completed' }, trackEvent: jest.fn() }));
jest.mock('../careerEvents', () => ({ notifyCareerDataChanged: jest.fn() }));
jest.mock('../offlineQueue', () => ({ enqueueAndSync: jest.fn() }));

import { getAllUserReads, getStoryByLang } from '../../db/db';
import { awardCareerNodes, getCareerState, markCareerNodeSeen, recordCareerEvent, replaceLegacyBadgeIds, upsertCareerState } from '../../db/userDb';
import { checkBadges } from '../../utils/badges';
import { enqueueAndSync } from '../offlineQueue';
import { migrateLegacyCareerPath } from '../migrateCareerPath';

describe('legacy career migration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getCareerState.mockResolvedValue({ migrationVersion: 0 });
    getAllUserReads.mockResolvedValue([{ storyId: '42', readAt: '2026-07-01' }]);
    getStoryByLang.mockResolvedValue({ parent_cat_id: 7 });
    recordCareerEvent.mockResolvedValue({ inserted: true, event: { eventId: 'legacy-h', creditKey: 'legacy-h' } });
    checkBadges.mockReturnValue([{ id: 'first_read', earned: true }]);
    awardCareerNodes.mockResolvedValue([]);
    markCareerNodeSeen.mockResolvedValue();
    replaceLegacyBadgeIds.mockResolvedValue(['first_read']);
    upsertCareerState.mockResolvedValue();
  });

  it('queues complete, idempotent legacy event and award payloads after local persistence', async () => {
    await migrateLegacyCareerPath({ lang: 'tr' });

    expect(recordCareerEvent).toHaveBeenCalledWith(expect.objectContaining({ creditType: 'H', eventSubtype: 'legacy_read', storyId: '42' }));
    expect(enqueueAndSync).toHaveBeenCalledWith('record_career_event', { event: expect.objectContaining({ eventId: 'legacy-h' }) });
    expect(enqueueAndSync).toHaveBeenCalledWith('upsert_legacy_badges', { badgeIds: ['first_read'] });
    expect(enqueueAndSync).toHaveBeenCalledWith('upsert_career_migration_state', { migrationVersion: 1 });
    expect(enqueueAndSync).toHaveBeenCalledWith('award_career_nodes', {
      nodes: [expect.objectContaining({ nodeId: 'common_first_spark', pathId: 'common', ruleVersion: 1, awardSource: 'legacy_migration_v1' })],
    });
  });
});

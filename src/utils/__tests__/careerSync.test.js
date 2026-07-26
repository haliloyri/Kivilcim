import { mergeCareerEvents, mergeCareerNodes, mergeCareerState } from '../careerSync';

describe('career sync merge', () => {
  it('keeps local event projections for the same immutable credit key', () => {
    const result = mergeCareerEvents(
      [{ creditKey: 'H:42', eventId: 'local', occurredAt: '2026-07-02T10:00:00.000Z', metadata: { local: true } }],
      [{ creditKey: 'H:42', eventId: 'remote', occurredAt: '2026-07-01T10:00:00.000Z' }]
    );
    expect(result).toEqual([expect.objectContaining({ eventId: 'local', metadata: { local: true } })]);
  });

  it('never regresses an earned node from seen to unseen during a replica merge', () => {
    const result = mergeCareerNodes(
      [{ nodeId: 'common_first_spark', earnedAt: '2026-07-03T10:00:00.000Z', seenAt: '2026-07-04T10:00:00.000Z', requirementsSnapshot: [{ type: 'stories' }] }],
      [{ nodeId: 'common_first_spark', earnedAt: '2026-07-01T10:00:00.000Z', seenAt: null, requirementsSnapshot: [] }]
    );
    expect(result).toEqual([expect.objectContaining({ nodeId: 'common_first_spark', earnedAt: '2026-07-01T10:00:00.000Z', seenAt: '2026-07-04T10:00:00.000Z' })]);
  });

  it('uses the latest explicit path selection without discarding local migration state', () => {
    const result = mergeCareerState(
      { activePath: 'depth', selectedAt: '2026-07-01T10:00:00.000Z', migrationVersion: 1 },
      { active_path: 'transfer', selected_at: '2026-07-02T10:00:00.000Z', selection_source: 'user_switch' }
    );
    expect(result).toMatchObject({ activePath: 'transfer', migrationVersion: 1, selectionSource: 'user_switch' });
  });

  it('keeps migration progress monotonic even when the local path selection is newer', () => {
    const result = mergeCareerState(
      { activePath: 'depth', selectedAt: '2026-07-03T10:00:00.000Z', migrationVersion: 0, migrationSummarySeenAt: null },
      { active_path: 'exploration', selected_at: '2026-07-02T10:00:00.000Z', migration_version: 1, migration_summary_seen_at: '2026-07-01T10:00:00.000Z' }
    );
    expect(result).toMatchObject({ activePath: 'depth', migrationVersion: 1, migrationSummarySeenAt: '2026-07-01T10:00:00.000Z' });
  });
});

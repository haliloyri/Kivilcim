const toTime = (value) => {
  const time = Date.parse(value || '');
  return Number.isFinite(time) ? time : null;
};

const earliest = (...values) => values.filter(Boolean).sort((a, b) => (toTime(a) ?? Infinity) - (toTime(b) ?? Infinity))[0] || null;

/** Credit key is immutable: a local event is the freshest complete projection. */
export const mergeCareerEvents = (local = [], remote = []) => Array.from(
  new Map([...(remote || []), ...(local || [])].filter(Boolean).map((event) => [String(event.creditKey), event])).values()
).sort((a, b) => String(a.occurredAt).localeCompare(String(b.occurredAt)) || String(a.eventId).localeCompare(String(b.eventId)));

/**
 * Node earning is monotonic. Preserve the first earning timestamp and any seen
 * transition from either replica; no conflict can turn a seen rank unseen.
 */
export const mergeCareerNodes = (local = [], remote = []) => {
  const nodes = new Map();
  [...(remote || []), ...(local || [])].filter(Boolean).forEach((node) => {
    const id = String(node.nodeId || '');
    if (!id) return;
    const previous = nodes.get(id);
    if (!previous) {
      nodes.set(id, node);
      return;
    }
    const localLike = node;
    nodes.set(id, {
      ...previous,
      ...localLike,
      nodeId: id,
      earnedAt: earliest(previous.earnedAt, localLike.earnedAt) || previous.earnedAt || localLike.earnedAt,
      seenAt: earliest(previous.seenAt, localLike.seenAt),
      requirementsSnapshot: localLike.requirementsSnapshot || previous.requirementsSnapshot || [],
    });
  });
  return Array.from(nodes.values()).sort((a, b) => String(a.earnedAt).localeCompare(String(b.earnedAt)) || String(a.nodeId).localeCompare(String(b.nodeId)));
};

/** Latest explicit active-path selection wins while monotonic migration state survives. */
export const mergeCareerState = (localState, remoteState) => {
  if (!remoteState) return localState;
  const remoteSelectedAt = remoteState.selectedAt ?? remoteState.selected_at;
  const remoteActivePath = remoteState.activePath ?? remoteState.active_path;
  const remoteSelectionSource = remoteState.selectionSource ?? remoteState.selection_source;
  const remoteMigrationVersion = Number(remoteState.migrationVersion ?? remoteState.migration_version ?? 0);
  const localMigrationVersion = Number(localState?.migrationVersion ?? 0);
  const merged = {
    ...localState,
    introSeenAt: earliest(localState?.introSeenAt, remoteState.introSeenAt ?? remoteState.intro_seen_at),
    migrationVersion: Math.max(localMigrationVersion, remoteMigrationVersion),
    migrationSummarySeenAt: earliest(localState?.migrationSummarySeenAt, remoteState.migrationSummarySeenAt ?? remoteState.migration_summary_seen_at),
  };
  if (!remoteSelectedAt || (toTime(remoteSelectedAt) ?? 0) <= (toTime(localState?.selectedAt) ?? 0)) return merged;
  return { ...merged, activePath: remoteActivePath, selectedAt: remoteSelectedAt, selectionSource: remoteSelectionSource };
};

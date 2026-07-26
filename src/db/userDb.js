import * as SQLite from 'expo-sqlite';
import { PATH_IDS, COMMON_PATH_ID, RULE_VERSION, getCareerNode } from '../constants/careerPath';

const USER_DB_NAME = 'kivilcim_user.db';
const USER_SCHEMA_VERSION = 1;
const CREDIT_TYPES = new Set(['H', 'D', 'U']);
const VALID_PATH_IDS = new Set([COMMON_PATH_ID, ...Object.values(PATH_IDS)]);

let userDbInstance = null;
let userDbReady = false;
let resolveUserDbReady;
const userDbReadyPromise = new Promise((resolve) => { resolveUserDbReady = resolve; });

export const getUserDb = () => {
  if (!userDbInstance) userDbInstance = SQLite.openDatabaseSync(USER_DB_NAME);
  return userDbInstance;
};

export const isUserDbReady = () => userDbReady;
export const waitForUserDb = () => userDbReadyPromise;

const nowIso = () => new Date().toISOString();
const asString = (value) => value == null ? '' : String(value);

const migrateToVersion1 = async (db) => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS user_career_events (
      event_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      credit_key TEXT NOT NULL,
      credit_type TEXT NOT NULL,
      event_subtype TEXT NOT NULL,
      story_id TEXT NOT NULL,
      category_id INTEGER,
      completion_method TEXT,
      occurred_at TEXT NOT NULL,
      local_day TEXT NOT NULL,
      timezone_offset_minutes INTEGER NOT NULL,
      rule_version INTEGER NOT NULL,
      metadata_json TEXT,
      created_at TEXT NOT NULL,
      PRIMARY KEY (user_id, event_id)
    );
    CREATE UNIQUE INDEX IF NOT EXISTS idx_career_events_credit_key
      ON user_career_events (user_id, credit_key);
    CREATE INDEX IF NOT EXISTS idx_career_events_day_type
      ON user_career_events (user_id, local_day, credit_type);
    CREATE INDEX IF NOT EXISTS idx_career_events_occurred_at
      ON user_career_events (user_id, occurred_at);

    CREATE TABLE IF NOT EXISTS user_career_state (
      user_id TEXT PRIMARY KEY,
      active_path TEXT,
      rule_version INTEGER NOT NULL,
      selected_at TEXT,
      selection_source TEXT,
      intro_seen_at TEXT,
      migration_version INTEGER NOT NULL DEFAULT 0,
      migration_summary_seen_at TEXT,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS user_career_nodes (
      user_id TEXT NOT NULL,
      node_id TEXT NOT NULL,
      path_id TEXT NOT NULL,
      rule_version INTEGER NOT NULL,
      earned_at TEXT NOT NULL,
      seen_at TEXT,
      award_source TEXT NOT NULL,
      requirements_snapshot_json TEXT NOT NULL,
      PRIMARY KEY (user_id, node_id)
    );
    CREATE INDEX IF NOT EXISTS idx_career_nodes_seen
      ON user_career_nodes (user_id, seen_at);

    CREATE TABLE IF NOT EXISTS user_legacy_badges (
      user_id TEXT NOT NULL,
      badge_id TEXT NOT NULL,
      earned_at TEXT,
      PRIMARY KEY (user_id, badge_id)
    );
  `);
};

export const initUserDb = async () => {
  try {
    const db = getUserDb();
    await db.execAsync('CREATE TABLE IF NOT EXISTS user_schema_version (version INTEGER NOT NULL);');
    const row = await db.getFirstAsync('SELECT version FROM user_schema_version ORDER BY version DESC LIMIT 1;');
    const currentVersion = Number(row?.version) || 0;
    if (currentVersion < 1) {
      await db.withExclusiveTransactionAsync(async (txn) => {
        await migrateToVersion1(txn);
        await txn.runAsync('DELETE FROM user_schema_version;');
        await txn.runAsync('INSERT INTO user_schema_version (version) VALUES (?);', [1]);
      });
    }
    if (currentVersion > USER_SCHEMA_VERSION) {
      console.warn(`[userDb] schema ${currentVersion} is newer than this app (${USER_SCHEMA_VERSION}).`);
    }
  } catch (error) {
    console.error('[userDb] initialization failed:', error);
  } finally {
    userDbReady = true;
    resolveUserDbReady?.();
  }
};

const validateEvent = (event) => {
  const normalized = {
    eventId: asString(event?.eventId ?? event?.event_id),
    userId: asString(event?.userId ?? event?.user_id),
    creditKey: asString(event?.creditKey ?? event?.credit_key),
    creditType: asString(event?.creditType ?? event?.credit_type),
    eventSubtype: asString(event?.eventSubtype ?? event?.event_subtype),
    storyId: asString(event?.storyId ?? event?.story_id),
    categoryId: event?.categoryId ?? event?.category_id ?? null,
    completionMethod: event?.completionMethod ?? event?.completion_method ?? null,
    occurredAt: asString(event?.occurredAt ?? event?.occurred_at),
    localDay: asString(event?.localDay ?? event?.local_day),
    timezoneOffsetMinutes: Number(event?.timezoneOffsetMinutes ?? event?.timezone_offset_minutes),
    ruleVersion: Number(event?.ruleVersion ?? event?.rule_version ?? RULE_VERSION),
    metadata: event?.metadata ?? event?.metadata_json ?? null,
  };
  if (!normalized.eventId || !normalized.userId || !normalized.creditKey || !normalized.storyId || !normalized.eventSubtype || !normalized.occurredAt || !normalized.localDay) {
    throw new Error('[userDb] Career event is missing an immutable identity or timestamp.');
  }
  if (!CREDIT_TYPES.has(normalized.creditType)) throw new Error(`[userDb] Unsupported career credit type: ${normalized.creditType}.`);
  if (!Number.isFinite(normalized.timezoneOffsetMinutes)) throw new Error('[userDb] Career event timezone offset is required.');
  if (!Number.isInteger(normalized.ruleVersion) || normalized.ruleVersion < 1) throw new Error('[userDb] Invalid career rule version.');
  return normalized;
};

export const recordCareerEvent = async (event) => {
  await waitForUserDb();
  const value = validateEvent(event);
  const db = getUserDb();
  const result = await db.runAsync(
    `INSERT OR IGNORE INTO user_career_events
      (event_id, user_id, credit_key, credit_type, event_subtype, story_id, category_id, completion_method, occurred_at, local_day, timezone_offset_minutes, rule_version, metadata_json, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [value.eventId, value.userId, value.creditKey, value.creditType, value.eventSubtype, value.storyId, value.categoryId, value.completionMethod, value.occurredAt, value.localDay, value.timezoneOffsetMinutes, value.ruleVersion, value.metadata == null ? null : JSON.stringify(value.metadata), nowIso()]
  );
  return { inserted: (result.changes || 0) === 1, event: value };
};

const mapEventRow = (row) => ({
  eventId: row.event_id,
  userId: row.user_id,
  creditKey: row.credit_key,
  creditType: row.credit_type,
  eventSubtype: row.event_subtype,
  storyId: row.story_id,
  categoryId: row.category_id,
  completionMethod: row.completion_method,
  occurredAt: row.occurred_at,
  localDay: row.local_day,
  timezoneOffsetMinutes: row.timezone_offset_minutes,
  ruleVersion: row.rule_version,
  metadata: row.metadata_json ? JSON.parse(row.metadata_json) : null,
  createdAt: row.created_at,
});

export const getCareerEvents = async (userId) => {
  await waitForUserDb();
  const rows = await getUserDb().getAllAsync('SELECT * FROM user_career_events WHERE user_id = ? ORDER BY occurred_at ASC, event_id ASC;', [userId]);
  return rows.map(mapEventRow);
};

export const getCareerEventForStory = async (userId, creditType, storyId) => {
  await waitForUserDb();
  const row = await getUserDb().getFirstAsync(
    'SELECT * FROM user_career_events WHERE user_id = ? AND credit_type = ? AND story_id = ? ORDER BY occurred_at ASC LIMIT 1;',
    [userId, creditType, String(storyId)]
  );
  return row ? mapEventRow(row) : null;
};

const emptyState = (userId) => ({ userId, activePath: null, ruleVersion: RULE_VERSION, selectedAt: null, selectionSource: null, introSeenAt: null, migrationVersion: 0, migrationSummarySeenAt: null });
const mapStateRow = (row) => row ? ({ userId: row.user_id, activePath: row.active_path, ruleVersion: row.rule_version, selectedAt: row.selected_at, selectionSource: row.selection_source, introSeenAt: row.intro_seen_at, migrationVersion: row.migration_version, migrationSummarySeenAt: row.migration_summary_seen_at, updatedAt: row.updated_at }) : null;

export const getCareerState = async (userId) => {
  await waitForUserDb();
  const row = await getUserDb().getFirstAsync('SELECT * FROM user_career_state WHERE user_id = ?;', [userId]);
  return mapStateRow(row) || emptyState(userId);
};

const STATE_FIELDS = { activePath: 'active_path', ruleVersion: 'rule_version', selectedAt: 'selected_at', selectionSource: 'selection_source', introSeenAt: 'intro_seen_at', migrationVersion: 'migration_version', migrationSummarySeenAt: 'migration_summary_seen_at' };

export const upsertCareerState = async (userId, patch = {}) => {
  await waitForUserDb();
  if (patch.activePath != null && !VALID_PATH_IDS.has(patch.activePath)) throw new Error(`[userDb] Invalid active path: ${patch.activePath}.`);
  const allowedEntries = Object.entries(patch).filter(([key]) => STATE_FIELDS[key]);
  const db = getUserDb();
  const existing = await getCareerState(userId);
  const next = { ...existing, ...Object.fromEntries(allowedEntries) };
  const updatedAt = nowIso();
  await db.runAsync(
    `INSERT INTO user_career_state (user_id, active_path, rule_version, selected_at, selection_source, intro_seen_at, migration_version, migration_summary_seen_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET active_path = excluded.active_path, rule_version = excluded.rule_version, selected_at = excluded.selected_at, selection_source = excluded.selection_source, intro_seen_at = excluded.intro_seen_at, migration_version = excluded.migration_version, migration_summary_seen_at = excluded.migration_summary_seen_at, updated_at = excluded.updated_at;`,
    [userId, next.activePath, next.ruleVersion, next.selectedAt, next.selectionSource, next.introSeenAt, next.migrationVersion, next.migrationSummarySeenAt, updatedAt]
  );
  return { ...next, updatedAt };
};

const mapNodeRow = (row) => ({ nodeId: row.node_id, pathId: row.path_id, ruleVersion: row.rule_version, earnedAt: row.earned_at, seenAt: row.seen_at, awardSource: row.award_source, requirementsSnapshot: JSON.parse(row.requirements_snapshot_json) });

export const getEarnedCareerNodes = async (userId) => {
  await waitForUserDb();
  const rows = await getUserDb().getAllAsync('SELECT * FROM user_career_nodes WHERE user_id = ? ORDER BY earned_at ASC;', [userId]);
  return rows.map(mapNodeRow);
};

export const awardCareerNodes = async (userId, nodes = []) => {
  await waitForUserDb();
  const normalized = nodes.map((node) => {
    const definition = getCareerNode(node.nodeId ?? node.id);
    if (!definition) throw new Error(`[userDb] Unknown career node: ${node.nodeId ?? node.id}.`);
    return { definition, ruleVersion: Number(node.ruleVersion) || RULE_VERSION, earnedAt: node.earnedAt || nowIso(), awardSource: node.awardSource || 'local', requirementsSnapshot: node.requirementsSnapshot || node.requirementRows || [] };
  });
  if (!normalized.length) return [];
  const db = getUserDb();
  await db.withExclusiveTransactionAsync(async (txn) => {
    for (const node of normalized) {
      await txn.runAsync(
        `INSERT OR IGNORE INTO user_career_nodes (user_id, node_id, path_id, rule_version, earned_at, seen_at, award_source, requirements_snapshot_json)
         VALUES (?, ?, ?, ?, ?, NULL, ?, ?);`,
        [userId, node.definition.id, node.definition.pathId, node.ruleVersion, node.earnedAt, node.awardSource, JSON.stringify(node.requirementsSnapshot)]
      );
    }
  });
  return getEarnedCareerNodes(userId);
};

export const markCareerNodeSeen = async (userId, nodeId) => {
  await waitForUserDb();
  await getUserDb().runAsync('UPDATE user_career_nodes SET seen_at = COALESCE(seen_at, ?) WHERE user_id = ? AND node_id = ?;', [nowIso(), userId, nodeId]);
};

export const getUnseenCareerNodes = async (userId) => {
  await waitForUserDb();
  const rows = await getUserDb().getAllAsync('SELECT * FROM user_career_nodes WHERE user_id = ? AND seen_at IS NULL ORDER BY earned_at ASC;', [userId]);
  return rows.map(mapNodeRow);
};

export const getLegacyBadgeIds = async (userId) => {
  await waitForUserDb();
  const rows = await getUserDb().getAllAsync('SELECT badge_id FROM user_legacy_badges WHERE user_id = ? ORDER BY badge_id ASC;', [userId]);
  return rows.map((row) => row.badge_id);
};

export const replaceLegacyBadgeIds = async (userId, badgeIds = []) => {
  await waitForUserDb();
  const ids = [...new Set(badgeIds.map(String).filter(Boolean))];
  const db = getUserDb();
  await db.withExclusiveTransactionAsync(async (txn) => {
    await txn.runAsync('DELETE FROM user_legacy_badges WHERE user_id = ?;', [userId]);
    for (const badgeId of ids) await txn.runAsync('INSERT INTO user_legacy_badges (user_id, badge_id, earned_at) VALUES (?, ?, ?);', [userId, badgeId, nowIso()]);
  });
  return ids;
};

export const clearCareerData = async (userId) => {
  await waitForUserDb();
  const db = getUserDb();
  await db.withExclusiveTransactionAsync(async (txn) => {
    await txn.runAsync('DELETE FROM user_career_events WHERE user_id = ?;', [userId]);
    await txn.runAsync('DELETE FROM user_career_nodes WHERE user_id = ?;', [userId]);
    await txn.runAsync('DELETE FROM user_career_state WHERE user_id = ?;', [userId]);
    await txn.runAsync('DELETE FROM user_legacy_badges WHERE user_id = ?;', [userId]);
  });
};

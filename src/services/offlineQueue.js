/**
 * offlineQueue.js
 *
 * ToServerTasks.md §9 — "Ağ yokken kuyruğa al, bağlanınca flush et."
 *
 * Why this exists: every `*OnServer` helper in supabase.js is intentionally
 * "best-effort" — on any error (including a dead network) it just
 * `console.error`s and returns, because postgrest-js resolves network
 * failures as `{ data: null, error }` rather than rejecting the promise
 * (see @supabase/postgrest-js PostgrestBuilder — a failed `fetch()` is
 * caught internally and turned into a normal, non-throwing error response
 * unless you opt into `.throwOnError()`). That's the right default for
 * UserDataContext's fire-and-forget double-writes — one failed sync
 * shouldn't crash the UI — but it also means a write made while offline is
 * silently dropped forever, never retried once connectivity returns.
 *
 * This module is a thin, *throwing* layer purpose-built for the queue: each
 * handler below re-does the same simple Supabase call as its `*OnServer`
 * counterpart in supabase.js, but throws on error instead of swallowing it,
 * so `enqueueAndSync` can tell "didn't happen, try again later" apart from
 * "happened" or "failed for a real (non-network) reason, don't retry."
 *
 * Persistence: operations are stored as plain serializable
 * `{ id, type, payload, ownerUserId, queuedAt }` descriptors in AsyncStorage
 * (not closures), so the queue survives an app kill/restart while offline —
 * the common real-world case for a mobile app, not just a flaky-request retry.
 * A queued item IS the "pending sync" mark: it stays until the server accepts
 * it (see getPendingSyncCount / hasPendingSync).
 *
 * Offline behavior: when the device is known to be offline, or this user
 * already has queued items, a write goes straight to the queue (no network
 * timeout, and the server sees operations in the order they happened). The
 * queue flushes on startup, on foreground and on every reconnect.
 *
 * Writes made before this device has any Supabase session (first launch
 * offline) are not queued: migrateLocalToServer backfills the local data once
 * the first session is created.
 *
 * Deliberately NOT queued: variant usage ("Sohbette kullan" copy/share/
 * mark-used). It goes through the quota-enforcing `record_variant_usage`
 * RPC which stamps `used_at = now()` server-side — replaying a queued item
 * later would misdate it and skew the daily quota window. It's a usage log,
 * not user-owned state, so best-effort (see UserDataContext's `serverSync`)
 * is an acceptable trade-off there.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { SUPABASE_LIVE, supabase } from './supabase';
import { isOnline, onReconnect } from './connectivity';

const QUEUE_KEY = '@albor_offline_queue_v1';

// type -> (userId, payload) => Promise<void>. Must throw on failure.
const HANDLERS = {
  add_favorite: async (uid, { storyId }) => {
    const { error } = await supabase
      .from('user_favorites')
      .upsert({ user_id: uid, story_id: Number(storyId) }, { onConflict: 'user_id,story_id', ignoreDuplicates: true });
    if (error) throw error;
  },

  remove_favorite: async (uid, { storyId }) => {
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', uid)
      .eq('story_id', Number(storyId));
    if (error) throw error;
  },

  add_to_collection: async (uid, { storyId, collectionId }) => {
    const { error } = await supabase
      .from('user_collections')
      .upsert(
        { user_id: uid, collection_id: collectionId, story_id: Number(storyId) },
        { onConflict: 'user_id,collection_id,story_id', ignoreDuplicates: true }
      );
    if (error) throw error;
  },

  remove_from_collection: async (uid, { storyId, collectionId }) => {
    const { error } = await supabase
      .from('user_collections')
      .delete()
      .eq('user_id', uid)
      .eq('collection_id', collectionId)
      .eq('story_id', Number(storyId));
    if (error) throw error;
  },

  record_read: async (uid, { storyId, readAt }) => {
    const { error } = await supabase
      .from('user_reads')
      .upsert(
        { user_id: uid, story_id: Number(storyId), read_at: readAt || new Date().toISOString().split('T')[0] },
        { onConflict: 'user_id,story_id' }
      );
    if (error) throw error;
  },

  record_career_event: async (uid, { event }) => {
    if (!event) return;
    const { error } = await supabase.rpc('record_career_event', {
      p_event_id: event.eventId,
      p_credit_key: event.creditKey,
      p_credit_type: event.creditType,
      p_event_subtype: event.eventSubtype,
      p_story_id: String(event.storyId),
      p_category_id: event.categoryId ?? null,
      p_completion_method: event.completionMethod ?? null,
      p_occurred_at: event.occurredAt,
      p_local_day: event.localDay,
      p_timezone_offset_minutes: event.timezoneOffsetMinutes,
      p_rule_version: event.ruleVersion,
      p_metadata_json: event.metadata ?? null,
    });
    if (error) throw error;
  },

  upsert_career_state: async (uid, { patch }) => {
    const { error } = await supabase.rpc('upsert_career_state', {
      p_active_path: patch?.activePath ?? null,
      p_rule_version: patch?.ruleVersion ?? 1,
      p_selected_at: patch?.selectedAt ?? null,
      p_selection_source: patch?.selectionSource ?? null,
    });
    if (error) throw error;
  },

  upsert_career_migration_state: async (uid, { migrationVersion, migrationSummarySeenAt }) => {
    const { error } = await supabase.rpc('upsert_career_migration_state', {
      p_migration_version: migrationVersion ?? null,
      p_migration_summary_seen_at: migrationSummarySeenAt ?? null,
    });
    if (error) throw error;
  },

  award_career_nodes: async (uid, { nodes }) => {
    const { error } = await supabase.rpc('award_career_nodes', { p_nodes: nodes || [] });
    if (error) throw error;
  },

  mark_career_node_seen: async (uid, { nodeId }) => {
    const { error } = await supabase.rpc('mark_career_node_seen', { p_node_id: nodeId });
    if (error) throw error;
  },

  upsert_legacy_badges: async (uid, { badgeIds }) => {
    const { error } = await supabase.rpc('upsert_legacy_badges', { p_badge_ids: badgeIds || [] });
    if (error) throw error;
  },

  set_selected_categories: async (uid, { categoryIds }) => {
    const { error: deleteError } = await supabase.from('user_selected_categories').delete().eq('user_id', uid);
    if (deleteError) throw deleteError;
    const rows = [...new Set(categoryIds || [])].map((category_id) => ({ user_id: uid, category_id }));
    if (rows.length === 0) return;
    const { error: insertError } = await supabase.from('user_selected_categories').insert(rows);
    if (insertError) throw insertError;
  },

  upsert_profile: async (uid, { patch }) => {
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: uid, ...patch, updated_at: new Date().toISOString() });
    if (error) throw error;
  },

  record_streak_freeze: async (uid, { dateStr }) => {
    const { error } = await supabase
      .from('user_streak_freezes')
      .upsert({ user_id: uid, freeze_date: dateStr }, { onConflict: 'user_id,freeze_date', ignoreDuplicates: true });
    if (error) throw error;
  },

  reset_user_data: async (uid) => {
    const tables = [
      'user_reads', 'user_likes', 'user_selected_categories', 'user_streak_freezes',
      'user_favorites', 'user_collections', 'user_variant_usage', 'user_badges',
      'user_career_events', 'user_career_state', 'user_career_nodes', 'user_legacy_badges',
    ];
    for (const table of tables) {
      const { error } = await supabase.from(table).delete().eq('user_id', uid);
      if (error) throw error;
    }
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: uid,
        onboarded: false,
        preferences: {},
        streak_freeze_credits: 0,
        share_count: 0,
        updated_at: new Date().toISOString(),
      });
    if (profileError) throw profileError;
  },
};

// React Native's fetch throws a bare `TypeError: Network request failed` (iOS/
// Android) with no connection; postgrest-js also surfaces aborts/timeouts and
// DNS-ish failures with these keywords in the message. Anything else (RLS
// violation, bad input, constraint violation, quota_exceeded, ...) is a real
// failure that retrying verbatim won't fix.
const isNetworkError = (error) => {
  const msg = String(error?.message || error || '').toLowerCase();
  return (
    msg.includes('network request failed') ||
    msg.includes('failed to fetch') ||
    msg.includes('fetch failed') ||
    msg.includes('network error') ||
    msg.includes('timed out') ||
    msg.includes('timeout') ||
    error?.name === 'AbortError'
  );
};

const readQueue = async () => {
  try {
    const raw = await AsyncStorage.getItem(QUEUE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeQueue = async (queue) => {
  try {
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch (e) {
    console.warn('[offlineQueue] failed to persist queue:', e?.message);
  }
};

// Serializes every read-modify-write of the stored queue, so two writes fired
// back to back (or a write landing mid-flush) can't overwrite each other.
let queueLock = Promise.resolve();
const withQueue = (fn) => {
  const run = queueLock.then(fn, fn);
  queueLock = run.catch(() => {});
  return run;
};

let itemSeq = 0;
const newItemId = () => `${Date.now().toString(36)}-${(itemSeq++).toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

// Local session only — no network call, so it works offline. (getCurrentUser
// in supabase.js calls auth.getUser(), which needs the server.)
const getSessionUserId = async () => {
  const { data } = await supabase.auth.getSession();
  return data?.session?.user?.id ?? null;
};

const queueItem = (type, payload, ownerUserId) => withQueue(async () => {
  const queue = await readQueue();
  queue.push({ id: newItemId(), type, payload, ownerUserId, queuedAt: new Date().toISOString() });
  await writeQueue(queue);
});

/** Number of writes still waiting to reach Supabase (all owners). */
export const getPendingSyncCount = async () => (await readQueue()).length;

/** True while the current session has writes that haven't reached Supabase. */
export const hasPendingSync = async () => {
  if (!SUPABASE_LIVE) return false;
  try {
    const uid = await getSessionUserId();
    if (!uid) return false;
    return (await readQueue()).some((item) => item.ownerUserId === uid);
  } catch {
    return false;
  }
};

/**
 * Sends a write to Supabase, or marks it pending in the durable queue when
 * the device is offline, the request fails for a connectivity reason, or
 * earlier writes are still pending. Other failures are logged and dropped
 * (retrying wouldn't help). Safe to call without awaiting — never throws.
 */
export const enqueueAndSync = async (type, payload = {}) => {
  if (!SUPABASE_LIVE) return;
  const handler = HANDLERS[type];
  if (!handler) {
    console.warn('[offlineQueue] unknown operation type:', type);
    return;
  }
  let uid = null;
  try {
    uid = await getSessionUserId();
    if (!uid) return; // no session yet — migrateLocalToServer backfills later

    const queue = await readQueue();
    const hasPending = queue.some((item) => item.ownerUserId === uid);
    const online = await isOnline();
    if (hasPending || !online) {
      await queueItem(type, payload, uid);
      if (online) flushOfflineQueue();
      return;
    }
    await handler(uid, payload);
  } catch (error) {
    if (isNetworkError(error) && uid) {
      await queueItem(type, payload, uid);
      console.warn('[offlineQueue] offline — queued for later:', type);
    } else {
      console.warn('[offlineQueue] failed (not retried):', type, error?.message);
    }
  }
};

let flushPromise = null;
let flushAgain = false;

/**
 * Replays queued operations in order (oldest first). Stops at the first
 * item that still fails with a connectivity-looking error — keeps it and
 * everything after it queued, since we're probably still offline — but
 * drops individual items that fail for a different reason so one bad item
 * can't block the rest forever. A call made while a flush is running waits
 * for it and schedules one more pass for items queued in the meantime.
 */
export const flushOfflineQueue = () => {
  if (!SUPABASE_LIVE) return Promise.resolve();
  if (flushPromise) {
    flushAgain = true;
    return flushPromise;
  }
  flushPromise = runFlush().then((stillOffline) => {
    flushPromise = null;
    if (flushAgain) {
      flushAgain = false;
      if (!stillOffline) return flushOfflineQueue();
    }
    return undefined;
  });
  return flushPromise;
};

// Returns true when it stopped because the network is still down.
const runFlush = async () => {
  let stillOffline = false;
  try {
    const uid = await getSessionUserId();
    if (!uid) return;

    // Snapshot (giving ids to items queued by older app versions).
    const queue = await withQueue(async () => {
      const stored = await readQueue();
      let changed = false;
      stored.forEach((item) => {
        if (!item.id) { item.id = newItemId(); changed = true; }
      });
      if (changed) await writeQueue(stored);
      return stored;
    });
    if (!queue.length) return;

    const done = new Set();
    for (const item of queue) {
      const handler = HANDLERS[item.type];
      if (!handler) { done.add(item.id); continue; } // leftover from an older app version
      // Never replay an operation captured under another authenticated user.
      // Older queue rows without an owner are also retained for manual/session
      // recovery instead of guessing who should receive them.
      if (!item.ownerUserId || item.ownerUserId !== uid) continue;
      try {
        await handler(uid, item.payload);
        done.add(item.id);
      } catch (error) {
        if (isNetworkError(error)) {
          stillOffline = true;
          break;
        }
        console.warn('[offlineQueue] dropping failed item:', item.type, error?.message);
        done.add(item.id);
      }
    }

    // Remove only what was handled; keep anything queued during the flush.
    await withQueue(async () => {
      const stored = await readQueue();
      await writeQueue(stored.filter((item) => !done.has(item.id)));
    });
    if (done.size > 0) console.log('[offlineQueue] synced', done.size, 'pending write(s)');
  } catch (error) {
    console.warn('[offlineQueue] flush failed:', error?.message);
  }
  return stillOffline;
};

let appStateSubscription = null;
let reconnectUnsubscribe = null;

/**
 * Call once at app startup (after a session exists). Flushes immediately,
 * then again every time the app comes back to the foreground or the device
 * reconnects.
 */
export const initOfflineQueueFlush = () => {
  flushOfflineQueue();
  if (!reconnectUnsubscribe) reconnectUnsubscribe = onReconnect(() => flushOfflineQueue());
  if (appStateSubscription) return; // already listening
  // AppState is only needed when startup wiring is enabled. Deferring this
  // require keeps the durable queue usable by non-UI consumers and tests.
  const { AppState } = require('react-native');
  appStateSubscription = AppState.addEventListener('change', (state) => {
    if (state === 'active') flushOfflineQueue();
  });
};

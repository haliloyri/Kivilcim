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
 * `{ type, payload }` descriptors in AsyncStorage (not closures), so the
 * queue survives an app kill/restart while offline — the common real-world
 * case for a mobile app, not just a flaky-request retry.
 *
 * Deliberately NOT queued: variant usage ("Sohbette kullan" copy/share/
 * mark-used). It goes through the quota-enforcing `record_variant_usage`
 * RPC which stamps `used_at = now()` server-side — replaying a queued item
 * later would misdate it and skew the daily quota window. It's a usage log,
 * not user-owned state, so best-effort (see UserDataContext's `serverSync`)
 * is an acceptable trade-off there.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';
import { SUPABASE_LIVE, supabase, getCurrentUser } from './supabase';

const QUEUE_KEY = '@kivilcim_offline_queue_v1';

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

/**
 * Attempts a write immediately. On a connectivity-looking failure, persists
 * `{ type, payload }` to the durable queue for `flushOfflineQueue()` to
 * retry later. On any other failure, logs and drops it (retrying wouldn't
 * help). Safe to call without awaiting — never throws.
 */
export const enqueueAndSync = async (type, payload = {}) => {
  if (!SUPABASE_LIVE) return;
  const handler = HANDLERS[type];
  if (!handler) {
    console.warn('[offlineQueue] unknown operation type:', type);
    return;
  }
  try {
    const user = await getCurrentUser();
    if (!user?.id) return; // no session yet — nothing to sync or queue
    await handler(user.id, payload);
  } catch (error) {
    if (isNetworkError(error)) {
      const queue = await readQueue();
      queue.push({ type, payload, queuedAt: new Date().toISOString() });
      await writeQueue(queue);
      console.warn('[offlineQueue] offline — queued for later:', type);
    } else {
      console.warn('[offlineQueue] failed (not retried):', type, error?.message);
    }
  }
};

let flushing = false;

/**
 * Replays queued operations in order (oldest first). Stops at the first
 * item that still fails with a connectivity-looking error — keeps it and
 * everything after it queued, since we're probably still offline — but
 * drops individual items that fail for a different reason so one bad item
 * can't block the rest forever.
 */
export const flushOfflineQueue = async () => {
  if (!SUPABASE_LIVE || flushing) return;
  flushing = true;
  try {
    const queue = await readQueue();
    if (!queue.length) return;

    const user = await getCurrentUser();
    if (!user?.id) return;

    let stoppedAt = -1;
    for (let i = 0; i < queue.length; i++) {
      const item = queue[i];
      const handler = HANDLERS[item.type];
      if (!handler) continue; // drop unknown (e.g. leftover from an older app version)
      try {
        await handler(user.id, item.payload);
      } catch (error) {
        if (isNetworkError(error)) {
          stoppedAt = i;
          break;
        }
        console.warn('[offlineQueue] dropping failed item:', item.type, error?.message);
      }
    }

    const remaining = stoppedAt === -1 ? [] : queue.slice(stoppedAt);
    await writeQueue(remaining);
    if (remaining.length === 0 && queue.length > 0) {
      console.log('[offlineQueue] flushed', queue.length, 'queued write(s)');
    }
  } catch (error) {
    console.warn('[offlineQueue] flush failed:', error?.message);
  } finally {
    flushing = false;
  }
};

let appStateSubscription = null;

/**
 * Call once at app startup (after a session exists). Flushes immediately,
 * then again every time the app comes back to the foreground — the
 * pragmatic proxy for "we might have reconnected" without adding a native
 * connectivity-detection dependency (no NetInfo/expo-network in this repo
 * yet). A future upgrade could subscribe to real connectivity change
 * events for instant flushing instead of foreground-triggered polling.
 */
export const initOfflineQueueFlush = () => {
  flushOfflineQueue();
  if (appStateSubscription) return; // already listening
  appStateSubscription = AppState.addEventListener('change', (state) => {
    if (state === 'active') flushOfflineQueue();
  });
};

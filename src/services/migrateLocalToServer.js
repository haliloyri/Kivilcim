/**
 * migrateLocalToServer.js
 *
 * ToServerTasks.md §8 — "migrateLocalToServer() tek seferlik migrasyonu
 * yaz ve test et". One-time, idempotent push of a device's existing
 * SQLite (albor.db) + AsyncStorage data up to Supabase, so a user who
 * already has local history doesn't lose it when the app starts writing
 * server-side (UserDataContext's double-write phase only mirrors *new*
 * writes going forward — this backfills everything that existed before).
 *
 * Idempotency: guarded by the `@albor_local_migrated_v1` AsyncStorage
 * flag. Once set, this is a no-op — call it as often as you like (e.g. on
 * every app start right after ensureDeviceSession()).
 *
 * All-or-nothing: the writes below throw on any Supabase error (unlike the
 * best-effort `*OnServer` helpers in supabase.js, which only log). If the
 * connection drops midway, the flag is NOT set and the next run (App.js
 * retries on reconnect) sends everything again — every write is an
 * idempotent upsert, so repeating it is safe.
 *
 * Deliberately NOT migrated:
 *   - `@albor_premium` (is_premium) — server-authoritative via the
 *     RevenueCat webhook (see supabase/functions/revenuecat-webhook). A
 *     stale/spoofable local flag must never overwrite the real entitlement.
 *   - `@albor_variant_usage` history — writes now go through the
 *     `record_variant_usage` RPC, which stamps `used_at = now()` and
 *     enforces the free-tier daily quota against that timestamp. Replaying
 *     old local entries through the RPC would misdate them (they'd count
 *     against *today's* quota instead of the day they actually happened),
 *     so old variant-usage history simply isn't backfilled. It's a usage
 *     log, not user-owned state, so nothing is lost that matters.
 *   - `RECENT_SEARCHES_KEY`, `THEME_MODE` — explicitly local-only per
 *     ToServerTasks.md §6.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { SUPABASE_LIVE, supabase, getCurrentUser } from './supabase';
import { getSelectedCategories, getAllUserReads, getAllUserLikes, getStreakFreezes } from '../db/db';

const MIGRATED_FLAG_KEY = '@albor_local_migrated_v1';
const CHUNK = 500;

// Throwing upsert in chunks. Postgres rejects an upsert batch that hits the
// same conflict key twice, so callers pass de-duplicated rows.
const upsertRows = async (table, rows, options) => {
  for (let i = 0; i < rows.length; i += CHUNK) {
    const { error } = await supabase.from(table).upsert(rows.slice(i, i + CHUNK), options);
    if (error) throw new Error(`${table}: ${error.message}`);
  }
};

// Last value per key wins, as in the old one-request-per-row loop.
const uniqueBy = (rows, keyOf) => [...new Map(rows.map((r) => [keyOf(r), r])).values()];

// A non-numeric story id would fail the whole batch on every retry; skip it.
const hasStoryId = (row) => Number.isFinite(row.story_id);

const readJson = async (key, fallback) => {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

/**
 * Runs the one-time local→server backfill for the currently signed-in
 * device session. Safe to call on every app start — it checks the
 * migrated flag first and returns immediately if already done.
 *
 * @returns {Promise<{ migrated: boolean, reason?: string, error?: string }>}
 */
export const migrateLocalToServer = async () => {
  if (!SUPABASE_LIVE) return { migrated: false, reason: 'not_live' };

  try {
    const already = await AsyncStorage.getItem(MIGRATED_FLAG_KEY);
    if (already) return { migrated: false, reason: 'already_migrated' };

    const user = await getCurrentUser();
    if (!user?.id) return { migrated: false, reason: 'no_session' };
    const userId = user.id;

    // ── SQLite → Supabase ──

    const categoryIds = await getSelectedCategories('default');
    if (categoryIds.length) {
      const { error: deleteError } = await supabase.from('user_selected_categories').delete().eq('user_id', userId);
      if (deleteError) throw new Error(`user_selected_categories: ${deleteError.message}`);
      const { error: insertError } = await supabase
        .from('user_selected_categories')
        .insert([...new Set(categoryIds)].map((category_id) => ({ user_id: userId, category_id })));
      if (insertError) throw new Error(`user_selected_categories: ${insertError.message}`);
    }

    const reads = await getAllUserReads('default');
    const sortedReads = [...reads].sort((a, b) => String(a.readAt || '').localeCompare(String(b.readAt || '')));
    await upsertRows('user_reads', uniqueBy(sortedReads.map((r) => ({
      user_id: userId,
      story_id: Number(r.storyId),
      read_at: r.readAt || new Date().toISOString().split('T')[0],
    })).filter(hasStoryId), (r) => r.story_id), { onConflict: 'user_id,story_id' });

    const likes = await getAllUserLikes('default');
    const likedAt = new Date().toISOString();
    await upsertRows('user_likes', uniqueBy(likes.map((l) => ({
      user_id: userId, story_id: Number(l.storyId), liked: l.liked, liked_at: likedAt,
    })).filter(hasStoryId), (r) => r.story_id), { onConflict: 'user_id,story_id' });

    const freezes = await getStreakFreezes('default');
    await upsertRows('user_streak_freezes', uniqueBy(freezes.filter((f) => f.day).map((f) => ({
      user_id: userId, freeze_date: f.day,
    })), (r) => r.freeze_date), { onConflict: 'user_id,freeze_date', ignoreDuplicates: true });

    // ── AsyncStorage → Supabase ──

    const [favorites, collections, preferences, onboarded, shareCount, profile, streakFreezeCredits, seenBadges] =
      await Promise.all([
        readJson('@albor_favorites', []),
        readJson('@albor_favorite_collections', {}),
        readJson('@albor_preferences', null),
        readJson('@albor_onboarded', false),
        readJson('@albor_share_count', 0),
        readJson('@albor_user_profile', null),
        readJson('@albor_streak_freeze_credits', 0),
        readJson('@albor_seen_earned_badges', []),
      ]);

    await upsertRows('user_favorites', uniqueBy((Array.isArray(favorites) ? favorites : [])
      .filter((storyId) => storyId != null)
      .map((storyId) => ({ user_id: userId, story_id: Number(storyId) }))
      .filter(hasStoryId), (r) => r.story_id),
    { onConflict: 'user_id,story_id', ignoreDuplicates: true });

    const collectionRows = Object.entries(collections || {}).flatMap(([collectionId, storyIds]) =>
      (Array.isArray(storyIds) ? storyIds : [])
        .filter((storyId) => storyId != null)
        .map((storyId) => ({ user_id: userId, collection_id: collectionId, story_id: Number(storyId) }))
        .filter(hasStoryId));
    await upsertRows('user_collections', uniqueBy(collectionRows, (r) => `${r.collection_id}:${r.story_id}`),
      { onConflict: 'user_id,collection_id,story_id', ignoreDuplicates: true });

    const { error: profileError } = await supabase.from('profiles').upsert({
      id: userId,
      onboarded: !!onboarded,
      preferences: preferences || {},
      share_count: Number(shareCount) || 0,
      streak_freeze_credits: Number(streakFreezeCredits) || 0,
      ...(profile?.displayName ? { display_name: profile.displayName } : {}),
      // is_premium intentionally omitted — see module doc comment above.
      updated_at: new Date().toISOString(),
    });
    if (profileError) throw new Error(`profiles: ${profileError.message}`);

    if (Array.isArray(seenBadges) && seenBadges.length) {
      await upsertRows('user_badges', [...new Set(seenBadges)].map((badge_id) => ({ user_id: userId, badge_id })),
        { onConflict: 'user_id,badge_id', ignoreDuplicates: true });
    }

    await AsyncStorage.setItem(
      MIGRATED_FLAG_KEY,
      JSON.stringify({ migratedAt: new Date().toISOString(), userId })
    );
    return { migrated: true };
  } catch (e) {
    console.warn('[migrateLocalToServer] not finished, will retry:', e?.message);
    return { migrated: false, reason: 'error', error: e?.message };
  }
};

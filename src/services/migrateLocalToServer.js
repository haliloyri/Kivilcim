/**
 * migrateLocalToServer.js
 *
 * ToServerTasks.md §8 — "migrateLocalToServer() tek seferlik migrasyonu
 * yaz ve test et". One-time, idempotent push of a device's existing
 * SQLite (kivilcim.db) + AsyncStorage data up to Supabase, so a user who
 * already has local history doesn't lose it when the app starts writing
 * server-side (UserDataContext's double-write phase only mirrors *new*
 * writes going forward — this backfills everything that existed before).
 *
 * Idempotency: guarded by the `@kivilcim_local_migrated_v1` AsyncStorage
 * flag. Once set, this is a no-op — call it as often as you like (e.g. on
 * every app start right after ensureDeviceSession()).
 *
 * Deliberately NOT migrated:
 *   - `@kivilcim_premium` (is_premium) — server-authoritative via the
 *     RevenueCat webhook (see supabase/functions/revenuecat-webhook). A
 *     stale/spoofable local flag must never overwrite the real entitlement.
 *   - `@kivilcim_variant_usage` history — writes now go through the
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
import {
  SUPABASE_LIVE,
  getCurrentUser,
  setSelectedCategoriesOnServer,
  recordReadOnServer,
  setLikeOnServer,
  recordStreakFreezeOnServer,
  addFavoriteOnServer,
  addToCollectionOnServer,
  upsertProfile,
  markBadgesSeenOnServer,
} from './supabase';
import { getSelectedCategories, getAllUserReads, getAllUserLikes, getStreakFreezes } from '../db/db';

const MIGRATED_FLAG_KEY = '@kivilcim_local_migrated_v1';

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
      await setSelectedCategoriesOnServer(userId, categoryIds);
    }

    const reads = await getAllUserReads('default');
    for (const r of reads) {
      await recordReadOnServer(userId, r.storyId, r.readAt);
    }

    const likes = await getAllUserLikes('default');
    for (const l of likes) {
      await setLikeOnServer(userId, l.storyId, l.liked);
    }

    const freezes = await getStreakFreezes('default');
    for (const f of freezes) {
      if (f.day) await recordStreakFreezeOnServer(userId, f.day);
    }

    // ── AsyncStorage → Supabase ──

    const [favorites, collections, preferences, onboarded, shareCount, profile, streakFreezeCredits, seenBadges] =
      await Promise.all([
        readJson('@kivilcim_favorites', []),
        readJson('@kivilcim_favorite_collections', {}),
        readJson('@kivilcim_preferences', null),
        readJson('@kivilcim_onboarded', false),
        readJson('@kivilcim_share_count', 0),
        readJson('@kivilcim_user_profile', null),
        readJson('@kivilcim_streak_freeze_credits', 0),
        readJson('@kivilcim_seen_earned_badges', []),
      ]);

    for (const storyId of Array.isArray(favorites) ? favorites : []) {
      await addFavoriteOnServer(userId, storyId);
    }

    for (const [collectionId, storyIds] of Object.entries(collections || {})) {
      for (const storyId of Array.isArray(storyIds) ? storyIds : []) {
        await addToCollectionOnServer(userId, storyId, collectionId);
      }
    }

    await upsertProfile(userId, {
      onboarded: !!onboarded,
      preferences: preferences || {},
      share_count: Number(shareCount) || 0,
      streak_freeze_credits: Number(streakFreezeCredits) || 0,
      ...(profile?.displayName ? { display_name: profile.displayName } : {}),
      // is_premium intentionally omitted — see module doc comment above.
    });

    if (Array.isArray(seenBadges) && seenBadges.length) {
      await markBadgesSeenOnServer(userId, seenBadges);
    }

    await AsyncStorage.setItem(
      MIGRATED_FLAG_KEY,
      JSON.stringify({ migratedAt: new Date().toISOString(), userId })
    );
    return { migrated: true };
  } catch (e) {
    console.error('[migrateLocalToServer] failed:', e?.message);
    return { migrated: false, reason: 'error', error: e?.message };
  }
};

/**
 * supabase.js
 * Supabase client + auth + push token helpers for Albor.
 *
 * Setup (once):
 *   1. supabase.com → new project → copy URL + anon key
 *   2. Paste into app.json → expo.extra.supabase.url / .anonKey
 *   3. Run the SQL schema in supabase/schema.sql in the SQL Editor
 *   4. npx expo prebuild --clean && eas build
 *
 * Tables used:
 *   profiles    – one row per auth.users entry (id, display_name, is_premium, lang)
 *   push_tokens – Expo push tokens per user (user_id, token, platform)
 */

import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as Application from 'expo-application';
import { Platform } from 'react-native';

// ─── Config ──────────────────────────────────────────────────────────────────

const SB_CONFIG = Constants.expoConfig?.extra?.supabase ?? {};
const SUPABASE_URL  = SB_CONFIG.url     ?? '';
const SUPABASE_ANON = SB_CONFIG.anonKey ?? '';

const isPlaceholder = (v) => !v || v.startsWith('REPLACE_') || v === '';

export const SUPABASE_LIVE = !isPlaceholder(SUPABASE_URL) && !isPlaceholder(SUPABASE_ANON);

// ─── Client ──────────────────────────────────────────────────────────────────

export const supabase = createClient(
  SUPABASE_LIVE ? SUPABASE_URL  : 'https://placeholder.supabase.co',
  SUPABASE_LIVE ? SUPABASE_ANON : 'placeholder',
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

// ─── Auth helpers ─────────────────────────────────────────────────────────────

/**
 * Get the currently signed-in user (from cached session — no network call).
 * Returns null when not signed in.
 */
export const getCurrentUser = async () => {
  if (!SUPABASE_LIVE) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user ?? null;
};

/**
 * Sign up with email and password.
 * Returns { user, error }.
 */
export const signUpWithEmail = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { user: data?.user ?? null, error };
};

/**
 * Sign in with email and password.
 * Returns { user, session, error }.
 */
export const signInWithEmail = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { user: data?.user ?? null, session: data?.session ?? null, error };
};

/**
 * Sign in with a third-party OAuth provider (e.g. 'apple', 'google').
 * On React Native you need expo-auth-session or a deep-link redirect.
 * Returns { data, error } — data.url is the OAuth URL to open.
 */
export const signInWithOAuth = async (provider) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: 'albor://auth/callback',
    },
  });
  return { data, error };
};

/**
 * Sign out the current user and clear the session.
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

/**
 * Subscribe to auth state changes (sign in / sign out / token refresh).
 * Returns an unsubscribe function.
 *
 * @param {(event: string, session: Session|null) => void} callback
 */
export const onAuthStateChange = (callback) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
  return () => subscription?.unsubscribe();
};

/**
 * Send a password reset email.
 */
export const sendPasswordReset = async (email) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'albor://auth/reset-password',
  });
  return { error };
};

// ─── Device session (anonymous membership) ───────────────────────────────────
//
// Every install gets a stable device id and a Supabase *anonymous* user.
// The persisted auth session IS the device token: it lives in AsyncStorage,
// auto-refreshes, and gives us a real `auth.uid()` so all per-user RLS tables
// work without forcing the user to sign up. On app open we reuse the session
// if it exists, otherwise we create one and stamp the device id onto the
// profile so server data can always be matched back to this device.

const DEVICE_ID_KEY = 'device_id';

// RFC4122-v4-shaped fallback id (no crypto dependency).
const generateFallbackId = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

/**
 * Get a stable, device-specific id. Prefers the OS vendor id
 * (Android ID / iOS idForVendor), persisted in AsyncStorage. Falls back to a
 * generated UUID when the OS id is unavailable. Cached after first call.
 *
 * @returns {Promise<string>}
 */
export const getDeviceId = async () => {
  try {
    const cached = await AsyncStorage.getItem(DEVICE_ID_KEY);
    if (cached) return cached;
  } catch {}

  let id = null;
  try {
    if (Platform.OS === 'android') {
      id = Application.getAndroidId?.() ?? null;
    } else if (Platform.OS === 'ios') {
      id = await Application.getIosIdForVendorAsync?.();
    }
  } catch {}
  if (!id) id = generateFallbackId();

  try { await AsyncStorage.setItem(DEVICE_ID_KEY, id); } catch {}
  return id;
};

/**
 * Ensure there is an active membership tied to this device.
 *
 * - If a session already exists (returning user), reuse it — no network sign-in.
 * - Otherwise create an anonymous Supabase user (the "device token") and write
 *   the device id onto the profile so data is matchable.
 *
 * Call this once during app startup, before reading/writing per-user data.
 * Returns the user, or null when Supabase isn't configured / sign-in failed.
 *
 * Requires "Anonymous sign-ins" to be enabled in the Supabase project
 * (Authentication → Providers → Anonymous).
 *
 * @returns {Promise<import('@supabase/supabase-js').User|null>}
 */
export const ensureDeviceSession = async () => {
  if (!SUPABASE_LIVE) return null;
  try {
    // Reuse the persisted session — this is the device token.
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) return session.user;

    // No session yet → create an anonymous membership for this device.
    const deviceId = await getDeviceId();
    const { data, error } = await supabase.auth.signInAnonymously({
      options: { data: { device_id: deviceId } },
    });
    if (error) {
      console.warn('[supabase] ensureDeviceSession signInAnonymously:', error.message);
      return null;
    }

    const user = data?.user ?? null;
    if (user) {
      // Stamp device id so server data can always be matched to this device.
      await upsertProfile(user.id, { device_id: deviceId });
    }
    return user;
  } catch (e) {
    console.warn('[supabase] ensureDeviceSession exception:', e?.message);
    return null;
  }
};

/**
 * Upgrade the current anonymous (device) membership to a permanent account by
 * attaching an email + password. The user id — and therefore all synced data —
 * is preserved. Call this when an anonymous user decides to register.
 *
 * @returns {Promise<{ user: object|null, error: any }>}
 */
export const linkEmailToDeviceAccount = async (email, password) => {
  if (!SUPABASE_LIVE) return { user: null, error: new Error('Supabase not configured') };
  const { data, error } = await supabase.auth.updateUser({ email, password });
  return { user: data?.user ?? null, error };
};

// ─── Profiles ────────────────────────────────────────────────────────────────

/**
 * Fetch the profile row for a given user ID.
 * Returns null if not found or not live.
 */
export const getProfile = async (userId) => {
  if (!SUPABASE_LIVE || !userId) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) console.error('[supabase] getProfile:', error.message);
  return data ?? null;
};

/**
 * Upsert profile data (display_name, lang, is_premium, etc.).
 * Creates the row if it doesn't exist yet.
 */
export const upsertProfile = async (userId, updates) => {
  if (!SUPABASE_LIVE || !userId) return null;
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ id: userId, ...updates, updated_at: new Date().toISOString() })
    .select()
    .single();
  if (error) console.error('[supabase] upsertProfile:', error.message);
  return data ?? null;
};

// ─── Push tokens ─────────────────────────────────────────────────────────────

/**
 * Save or update an Expo push token for the current user.
 * Call this after getting the token via registerForPushNotifications().
 *
 * @param {string} userId  — auth user ID (or null for anonymous)
 * @param {string} token   — Expo push token (ExponentPushToken[...])
 * @param {string} platform — 'ios' | 'android'
 */
export const upsertPushToken = async (userId, token, platform) => {
  if (!SUPABASE_LIVE || !token) return;
  const { error } = await supabase
    .from('push_tokens')
    .upsert(
      {
        token,
        user_id:    userId ?? null,
        platform,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'token' }   // token is unique — update on collision
    );
  if (error) console.error('[supabase] upsertPushToken:', error.message);
};

/**
 * Remove a push token (e.g. when user logs out and should stop receiving pushes).
 */
export const removePushToken = async (token) => {
  if (!SUPABASE_LIVE || !token) return;
  const { error } = await supabase
    .from('push_tokens')
    .delete()
    .eq('token', token);
  if (error) console.error('[supabase] removePushToken:', error.message);
};

// ─── User data (reads / likes / categories / streaks / favorites / etc.) ─────
//
// Server-side mirror of src/db/db.js + UserDataContext.js's AsyncStorage
// state — see ToServerTasks.md. All of these are per-user, RLS-protected
// tables (auth.uid() = user_id), so every call here is scoped to `userId`
// and will simply return nothing / fail silently if `userId` doesn't match
// the caller's session.

// ── Reads / stats ──

/**
 * Upsert today's (or a given date's) read for a story — mirrors db.js's
 * `INSERT OR REPLACE` semantics (one row per user+story, last read date wins).
 */
export const recordReadOnServer = async (userId, storyId, dateStr = null) => {
  if (!SUPABASE_LIVE || !userId || storyId == null) return;
  const read_at = dateStr || new Date().toISOString().split('T')[0];
  const { error } = await supabase
    .from('user_reads')
    .upsert({ user_id: userId, story_id: Number(storyId), read_at }, { onConflict: 'user_id,story_id' });
  if (error) console.error('[supabase] recordReadOnServer:', error.message);
};

/**
 * Single round-trip stats snapshot (total reads, today's reads, streak,
 * longest streak, reads-per-category, read-counts-by-story) computed by the
 * `get_user_stats` RPC — the server is the single source of truth, matching
 * db.js's getTotalReads/getStreak/getLongestStreak/getReadsPerCategory/
 * getReadCountsByStory/getTodayReadsCount combined.
 *
 * Returns null on failure/offline so callers fall back to local SQLite stats.
 */
export const getUserStatsFromServer = async () => {
  if (!SUPABASE_LIVE) return null;
  try {
    const { data, error } = await supabase.rpc('get_user_stats');
    if (error) {
      console.warn('[supabase] getUserStatsFromServer:', error.message);
      return null;
    }
    return data ?? null;
  } catch (e) {
    console.warn('[supabase] getUserStatsFromServer exception:', e.message);
    return null;
  }
};

/** Wipes all reads + likes for a user (mirrors db.js#clearUserReads). */
export const clearUserReadsOnServer = async (userId) => {
  if (!SUPABASE_LIVE || !userId) return;
  const [{ error: readsError }, { error: likesError }] = await Promise.all([
    supabase.from('user_reads').delete().eq('user_id', userId),
    supabase.from('user_likes').delete().eq('user_id', userId),
  ]);
  if (readsError) console.error('[supabase] clearUserReadsOnServer (reads):', readsError.message);
  if (likesError) console.error('[supabase] clearUserReadsOnServer (likes):', likesError.message);
};

// ── Likes ──

export const setLikeOnServer = async (userId, storyId, liked = true) => {
  if (!SUPABASE_LIVE || !userId || storyId == null) return;
  const { error } = await supabase
    .from('user_likes')
    .upsert(
      { user_id: userId, story_id: Number(storyId), liked, liked_at: new Date().toISOString() },
      { onConflict: 'user_id,story_id' }
    );
  if (error) console.error('[supabase] setLikeOnServer:', error.message);
};

export const getLikedStoryIdsFromServer = async (userId) => {
  if (!SUPABASE_LIVE || !userId) return [];
  const { data, error } = await supabase
    .from('user_likes')
    .select('story_id')
    .eq('user_id', userId)
    .eq('liked', true);
  if (error) {
    console.error('[supabase] getLikedStoryIdsFromServer:', error.message);
    return [];
  }
  return (data ?? []).map((r) => String(r.story_id));
};

// ── Selected categories (onboarding) ──

export const getSelectedCategoriesFromServer = async (userId) => {
  if (!SUPABASE_LIVE || !userId) return [];
  const { data, error } = await supabase
    .from('user_selected_categories')
    .select('category_id')
    .eq('user_id', userId)
    .order('category_id', { ascending: true });
  if (error) {
    console.error('[supabase] getSelectedCategoriesFromServer:', error.message);
    return [];
  }
  return (data ?? []).map((r) => r.category_id);
};

/** Replaces the full selected-categories set (delete + re-insert, like db.js#setSelectedCategories). */
export const setSelectedCategoriesOnServer = async (userId, categoryIds = []) => {
  if (!SUPABASE_LIVE || !userId) return;
  const { error: deleteError } = await supabase
    .from('user_selected_categories')
    .delete()
    .eq('user_id', userId);
  if (deleteError) {
    console.error('[supabase] setSelectedCategoriesOnServer (delete):', deleteError.message);
    return;
  }
  const rows = [...new Set(categoryIds)].map((category_id) => ({ user_id: userId, category_id }));
  if (rows.length === 0) return;
  const { error: insertError } = await supabase.from('user_selected_categories').insert(rows);
  if (insertError) console.error('[supabase] setSelectedCategoriesOnServer (insert):', insertError.message);
};

// ── Streak freezes ──

export const recordStreakFreezeOnServer = async (userId, dateStr = null) => {
  if (!SUPABASE_LIVE || !userId) return;
  const freeze_date = dateStr || new Date().toISOString().split('T')[0];
  const { error } = await supabase
    .from('user_streak_freezes')
    .upsert({ user_id: userId, freeze_date }, { onConflict: 'user_id,freeze_date', ignoreDuplicates: true });
  if (error) console.error('[supabase] recordStreakFreezeOnServer:', error.message);
};

export const getStreakFreezesFromServer = async (userId) => {
  if (!SUPABASE_LIVE || !userId) return [];
  const { data, error } = await supabase
    .from('user_streak_freezes')
    .select('freeze_date, used_at')
    .eq('user_id', userId)
    .order('freeze_date', { ascending: false });
  if (error) {
    console.error('[supabase] getStreakFreezesFromServer:', error.message);
    return [];
  }
  return (data ?? []).map((r) => ({ day: r.freeze_date, usedAt: r.used_at }));
};

export const clearStreakFreezesOnServer = async (userId) => {
  if (!SUPABASE_LIVE || !userId) return;
  const { error } = await supabase.from('user_streak_freezes').delete().eq('user_id', userId);
  if (error) console.error('[supabase] clearStreakFreezesOnServer:', error.message);
};

// ── Favorites ──

export const getFavoritesFromServer = async (userId) => {
  if (!SUPABASE_LIVE || !userId) return [];
  const { data, error } = await supabase
    .from('user_favorites')
    .select('story_id')
    .eq('user_id', userId);
  if (error) {
    console.error('[supabase] getFavoritesFromServer:', error.message);
    return [];
  }
  return (data ?? []).map((r) => String(r.story_id));
};

export const addFavoriteOnServer = async (userId, storyId) => {
  if (!SUPABASE_LIVE || !userId || storyId == null) return;
  const { error } = await supabase
    .from('user_favorites')
    .upsert({ user_id: userId, story_id: Number(storyId) }, { onConflict: 'user_id,story_id', ignoreDuplicates: true });
  if (error) console.error('[supabase] addFavoriteOnServer:', error.message);
};

export const removeFavoriteOnServer = async (userId, storyId) => {
  if (!SUPABASE_LIVE || !userId || storyId == null) return;
  const { error } = await supabase
    .from('user_favorites')
    .delete()
    .eq('user_id', userId)
    .eq('story_id', Number(storyId));
  if (error) console.error('[supabase] removeFavoriteOnServer:', error.message);
};

// ── Favorite collections (e.g. "saved_for_later") ──

export const getCollectionsFromServer = async (userId) => {
  if (!SUPABASE_LIVE || !userId) return {};
  const { data, error } = await supabase
    .from('user_collections')
    .select('collection_id, story_id')
    .eq('user_id', userId);
  if (error) {
    console.error('[supabase] getCollectionsFromServer:', error.message);
    return {};
  }
  const map = {};
  for (const row of data ?? []) {
    const key = row.collection_id;
    if (!map[key]) map[key] = [];
    map[key].push(String(row.story_id));
  }
  return map;
};

export const addToCollectionOnServer = async (userId, storyId, collectionId = 'saved_for_later') => {
  if (!SUPABASE_LIVE || !userId || storyId == null) return;
  const { error } = await supabase
    .from('user_collections')
    .upsert(
      { user_id: userId, collection_id: collectionId, story_id: Number(storyId) },
      { onConflict: 'user_id,collection_id,story_id', ignoreDuplicates: true }
    );
  if (error) console.error('[supabase] addToCollectionOnServer:', error.message);
};

export const removeFromCollectionOnServer = async (userId, storyId, collectionId = 'saved_for_later') => {
  if (!SUPABASE_LIVE || !userId || storyId == null) return;
  const { error } = await supabase
    .from('user_collections')
    .delete()
    .eq('user_id', userId)
    .eq('collection_id', collectionId)
    .eq('story_id', Number(storyId));
  if (error) console.error('[supabase] removeFromCollectionOnServer:', error.message);
};

// ── Variant usage ("Sohbette kullan" copy/share/mark-used) ──
//
// Writes go through the `record_variant_usage` RPC (not a direct table
// insert) — it's a SECURITY DEFINER function that enforces the free-tier
// daily quota for 'mark_used' server-side, so a modified client can't bypass
// the AsyncStorage-only limit that used to be the only gate. See
// supabase/schema.sql "Variant usage quota enforcement" for the quota logic.
//
// Throws with `error.message === 'quota_exceeded'` when the free daily limit
// is hit — callers should catch that specifically and show the paywall.

export const recordVariantUsageOnServer = async ({
  storyId,
  storyTitle,
  storyCategory,
  variantType,
  variantId,
  variantKey,
  action,
  feedbackRating = null,
}) => {
  if (!SUPABASE_LIVE) return { error: null, skipped: true };
  const { data, error } = await supabase.rpc('record_variant_usage', {
    p_story_id: storyId != null ? Number(storyId) : null,
    p_story_title: storyTitle ?? null,
    p_story_category: storyCategory ?? null,
    p_variant_type: variantType ?? null,
    p_variant_id: variantId ?? null,
    p_variant_key: variantKey ?? null,
    p_action: action,
    p_feedback_rating: feedbackRating,
  });
  if (error) {
    if (error.message !== 'quota_exceeded') {
      console.error('[supabase] recordVariantUsageOnServer:', error.message);
    }
    return { error, id: null };
  }
  return { error: null, id: data };
};

/**
 * Deletes a specific variant-usage log row (used when a "mark used" is
 * undone client-side). Unlike inserts, deletes still go through normal
 * table RLS (auth.uid() = user_id) — no RPC needed since there's no quota
 * concern on delete.
 */
export const removeVariantUsageOnServer = async (userId, { storyId, variantId, variantKey = null }) => {
  if (!SUPABASE_LIVE || !userId) return;
  let query = supabase
    .from('user_variant_usage')
    .delete()
    .eq('user_id', userId)
    .eq('story_id', Number(storyId))
    .eq('action', 'mark_used');
  query = variantKey ? query.eq('variant_key', variantKey) : query.eq('variant_id', variantId);
  const { error } = await query;
  if (error) console.error('[supabase] removeVariantUsageOnServer:', error.message);
};

export const getVariantUsageFromServer = async (userId, limit = 2000) => {
  if (!SUPABASE_LIVE || !userId) return [];
  const { data, error } = await supabase
    .from('user_variant_usage')
    .select('story_id, story_title, story_category, variant_type, variant_id, variant_key, action, feedback_rating, used_at')
    .eq('user_id', userId)
    .order('used_at', { ascending: false })
    .limit(limit);
  if (error) {
    console.error('[supabase] getVariantUsageFromServer:', error.message);
    return [];
  }
  return (data ?? []).map((r) => ({
    storyId: String(r.story_id),
    storyTitle: r.story_title,
    storyCategory: r.story_category,
    variantType: r.variant_type,
    variantId: r.variant_id,
    variantKey: r.variant_key,
    action: r.action,
    feedbackRating: r.feedback_rating,
    usedAt: r.used_at,
  }));
};

// ── Badges (seen state) ──

export const getSeenBadgeIdsFromServer = async (userId) => {
  if (!SUPABASE_LIVE || !userId) return [];
  const { data, error } = await supabase
    .from('user_badges')
    .select('badge_id')
    .eq('user_id', userId);
  if (error) {
    console.error('[supabase] getSeenBadgeIdsFromServer:', error.message);
    return [];
  }
  return (data ?? []).map((r) => r.badge_id);
};

export const markBadgesSeenOnServer = async (userId, badgeIds = []) => {
  if (!SUPABASE_LIVE || !userId || !badgeIds.length) return;
  const rows = [...new Set(badgeIds)].map((badge_id) => ({ user_id: userId, badge_id }));
  const { error } = await supabase
    .from('user_badges')
    .upsert(rows, { onConflict: 'user_id,badge_id', ignoreDuplicates: true });
  if (error) console.error('[supabase] markBadgesSeenOnServer:', error.message);
};

/**
 * Full reset — mirrors UserDataContext#clearUserData (debug / logout / data
 * reset). Wipes every per-user table plus the profile fields that used to
 * live only in AsyncStorage. Best-effort: logs but doesn't throw, since this
 * runs alongside a local reset that must succeed regardless of server state.
 */
export const resetUserDataOnServer = async (userId) => {
  if (!SUPABASE_LIVE || !userId) return;
  const deletes = [
    supabase.from('user_reads').delete().eq('user_id', userId),
    supabase.from('user_likes').delete().eq('user_id', userId),
    supabase.from('user_selected_categories').delete().eq('user_id', userId),
    supabase.from('user_streak_freezes').delete().eq('user_id', userId),
    supabase.from('user_favorites').delete().eq('user_id', userId),
    supabase.from('user_collections').delete().eq('user_id', userId),
    supabase.from('user_variant_usage').delete().eq('user_id', userId),
    supabase.from('user_badges').delete().eq('user_id', userId),
  ];
  const results = await Promise.allSettled(deletes);
  results.forEach((r) => {
    if (r.status === 'rejected') console.error('[supabase] resetUserDataOnServer:', r.reason);
    else if (r.value?.error) console.error('[supabase] resetUserDataOnServer:', r.value.error.message);
  });
  await upsertProfile(userId, {
    onboarded: false,
    preferences: {},
    streak_freeze_credits: 0,
    share_count: 0,
  });
};

// ─── Stories (online) ────────────────────────────────────────────────────────

/**
 * Maps a raw Supabase stories row to the shape that StoriesContext consumers
 * expect — same shape as getStoriesForLang() from SQLite.
 */
const mapSupabaseStory = (r) => ({
  id:                        r.story_id,
  story_id:                  String(r.story_id),
  version:                   r.version ?? 1,
  source_book_id:            r.book_id ?? null,
  author:                    r.author ?? '',
  publishDate:               r.publish_year ?? null,
  min:                       r.read_time_minutes ?? 1,
  possible_read_minutes:     1,
  target_word_count:         160,
  target_word_tolerance:     40,
  cat:                       r.parent_cat ?? '',
  cat_display:               r.parent_cat ?? '',
  parent_cat_id:             r.parent_cat_id ?? null,
  source_book:               r.source_book ?? '',
  title:                     r.title ?? '',
  description:               r.description ?? '',
  body:                      r.content ?? '',
  hook:                      r.hook ?? '',
  thirty_sec:                '',
  conversation_punchline:    r.conv_punchline ?? '',
  conversation_thirty_sec:   r.conv_thirty_sec ?? '',
  conversation_question:     r.conv_question ?? '',
  conversation_key_contrast: r.conv_key_contrast ?? '',
  parent_cat:                r.parent_cat ?? '',
  parent_cat_raw:            r.parent_cat ?? '',
  sort_order:                r.sort_order ?? 0,
});

/**
 * Fetch all stories from Supabase for a given language.
 * Returns a mapped array on success, or null on failure/offline
 * so the caller can fall back to SQLite.
 *
 * @param {string} lang — e.g. 'tr' | 'en' | 'de' | 'es'
 * @returns {Promise<object[]|null>}
 */
export const fetchStoriesFromSupabase = async (lang) => {
  if (!SUPABASE_LIVE) return null;
  try {
    const { data, error } = await supabase
      .from('stories')
      .select(
        'story_id, lang, title, description, content, hook, ' +
        'parent_cat_id, parent_cat, book_id, author, publish_year, source_book, ' +
        'read_time_minutes, version, conv_punchline, conv_thirty_sec, ' +
        'conv_question, conv_key_contrast, sort_order'
      )
      .eq('lang', lang)
      .order('sort_order', { ascending: true });

    if (error) {
      console.warn('[supabase] fetchStoriesFromSupabase:', error.message);
      return null;
    }
    return (data ?? []).map(mapSupabaseStory);
  } catch (e) {
    console.warn('[supabase] fetchStoriesFromSupabase exception:', e.message);
    return null;
  }
};

/**
 * Realtime subscription — calls `callback` whenever a new story is inserted.
 * Returns an unsubscribe function.
 *
 * @param {string} lang
 * @param {(story: object) => void} callback
 */
export const subscribeToNewStories = (lang, callback) => {
  if (!SUPABASE_LIVE) return () => {};
  const channel = supabase
    .channel('new-stories')
    .on(
      'postgres_changes',
      {
        event:  'INSERT',
        schema: 'public',
        table:  'stories',
        filter: `lang=eq.${lang}`,
      },
      (payload) => callback(mapSupabaseStory(payload.new))
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
};

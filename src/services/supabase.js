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

// ─── Stories (online) ────────────────────────────────────────────────────────

/**
 * Fetch active stories from Supabase for a given language.
 * Falls back gracefully when Supabase is not live (returns empty array).
 *
 * @param {string} lang — language code, e.g. 'tr' | 'en'
 * @param {object} [opts]
 * @param {number} [opts.limit=50]
 * @param {number} [opts.offset=0]
 */
export const fetchStoriesFromSupabase = async (lang, { limit = 50, offset = 0 } = {}) => {
  if (!SUPABASE_LIVE) return [];
  const { data, error } = await supabase
    .from('stories')
    .select('id, title, content, summary, category_id, read_time_seconds, created_at')
    .eq('lang', lang)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('[supabase] fetchStories:', error.message);
    return [];
  }
  return data ?? [];
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
      (payload) => callback(payload.new)
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
};

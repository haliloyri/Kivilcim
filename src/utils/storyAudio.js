import { supabase, SUPABASE_LIVE } from '../services/supabase';

// Narrations live in a private Cloudflare R2 bucket as `<story_id>-<lang>-seslendirme.mp3`.
// The `audio-url` Edge Function checks the object and returns a short-lived presigned URL.
const SUPPORTED_LANGS = new Set(['tr', 'en', 'es', 'de']);
// Refresh a cached URL this long before it expires so playback never starts on a dead link.
const URL_REFRESH_MARGIN_MS = 5 * 60 * 1000;

const cache = new Map();
const inFlight = new Map();

const cacheKey = (storyId, lang) => `${storyId}:${lang}`;

const isFresh = (entry) =>
  entry && (!entry.available || entry.expiresAt - URL_REFRESH_MARGIN_MS > Date.now());

/**
 * Resolve the streaming URL for a story narration.
 * @returns {Promise<string|null>} presigned URL, or null when no narration exists
 *   (or the lookup failed — the listen button stays disabled in that case).
 */
export const getStoryAudioUrl = async (storyId, lang) => {
  const normalizedId = Number(storyId);
  const normalizedLang = String(lang || '').toLowerCase();
  if (!SUPABASE_LIVE || !Number.isSafeInteger(normalizedId) || !SUPPORTED_LANGS.has(normalizedLang)) {
    return null;
  }

  const key = cacheKey(normalizedId, normalizedLang);
  const cached = cache.get(key);
  if (isFresh(cached)) return cached.available ? cached.url : null;
  if (inFlight.has(key)) return inFlight.get(key);

  const request = (async () => {
    try {
      const { data, error } = await supabase.functions.invoke('audio-url', {
        body: { storyId: normalizedId, lang: normalizedLang },
      });
      if (error || !data) throw error || new Error('empty response');

      if (data.available && data.url) {
        cache.set(key, { available: true, url: data.url, expiresAt: Number(data.expiresAt) || 0 });
        return data.url;
      }
      cache.set(key, { available: false });
      return null;
    } catch (error) {
      // Do not cache failures: a later open retries once the network is back.
      console.warn('[storyAudio] narration lookup failed:', error?.message);
      return null;
    } finally {
      inFlight.delete(key);
    }
  })();

  inFlight.set(key, request);
  return request;
};

export const hasStoryAudio = async (storyId, lang) => Boolean(await getStoryAudioUrl(storyId, lang));

export const __resetStoryAudioCache = () => {
  cache.clear();
  inFlight.clear();
};

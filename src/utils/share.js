import Constants from 'expo-constants';
import { WEBSITE_URL } from '../constants/externalLinks';
import { getCachedDeviceUserId } from '../services/supabase';

const config = Constants.expoConfig?.extra ?? Constants.manifest?.extra ?? {};
const DEFAULT_SHARE_BASE_URL = WEBSITE_URL;
const SUPPORTED_LANGUAGES = new Set(['tr', 'en', 'de', 'es']);

export const normalizeShareLanguage = (lang) => {
  const candidate = String(lang || 'tr').toLowerCase();
  return SUPPORTED_LANGUAGES.has(candidate) ? candidate : 'tr';
};

/**
 * Builds the shareable link, tagged with attribution query params when a
 * device/story is known:
 *   - `s`  the sharer's anonymous device id (referral attribution)
 *   - `st` the story that was shared (k-factor measurement per story)
 *   - `l`  the language shared from (redundant with the path, but keeps the
 *          query string self-describing for the website's own analytics)
 *
 * `s`/`st` are omitted whenever unavailable (e.g. Supabase not yet signed in,
 * or no specific story) — the link still works, it just carries no
 * attribution.
 */
export const getShareUrl = (lang, { storyId } = {}) => {
  const baseUrl = String(config.shareBaseUrl || config.shareLink || DEFAULT_SHARE_BASE_URL)
    .replace(/\/+$/, '');
  const normalizedLang = normalizeShareLanguage(lang);
  const url = `${baseUrl}/${normalizedLang}`;

  const params = new URLSearchParams();
  const referrerId = getCachedDeviceUserId();
  if (referrerId) params.set('s', referrerId);
  if (storyId != null && String(storyId).trim() !== '') params.set('st', String(storyId));
  params.set('l', normalizedLang);

  const query = params.toString();
  return query ? `${url}?${query}` : url;
};

export const getShareLabel = (lang) => getShareUrl(lang).replace(/^https?:\/\//, '').split('?')[0];

import Constants from 'expo-constants';

const config = Constants.expoConfig?.extra ?? Constants.manifest?.extra ?? {};
const DEFAULT_SHARE_BASE_URL = 'https://alborapp.com';
const SUPPORTED_LANGUAGES = new Set(['tr', 'en', 'de', 'es']);

export const normalizeShareLanguage = (lang) => {
  const candidate = String(lang || 'tr').toLowerCase();
  return SUPPORTED_LANGUAGES.has(candidate) ? candidate : 'tr';
};

export const getShareUrl = (lang) => {
  const baseUrl = String(config.shareBaseUrl || config.shareLink || DEFAULT_SHARE_BASE_URL)
    .replace(/\/+$/, '');
  return `${baseUrl}/${normalizeShareLanguage(lang)}`;
};

export const getShareLabel = (lang) => getShareUrl(lang).replace(/^https?:\/\//, '');

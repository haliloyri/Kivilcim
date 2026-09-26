export const WEBSITE_URL = 'https://alborapp.com';

const SITE_LANGS = ['en', 'tr', 'es', 'de'];
const siteLang = (lang) => (SITE_LANGS.includes(lang) ? lang : 'en');

// Site pages are localized by a trailing language segment: /privacy/tr, /terms/de …
export const localizedSiteUrl = (path, lang) => `${WEBSITE_URL}/${path}/${siteLang(lang)}`;
export const localizedHomeUrl = (lang) => `${WEBSITE_URL}/${siteLang(lang)}`;

// Language-less fallbacks (kept for callers without a lang).
export const LEGAL_URLS = Object.freeze({
  privacy: `${WEBSITE_URL}/privacy`,
  terms: `${WEBSITE_URL}/terms`,
  refund: `${WEBSITE_URL}/refund`,
});

export const getLegalUrls = (lang) => Object.freeze({
  privacy: localizedSiteUrl('privacy', lang),
  terms: localizedSiteUrl('terms', lang),
  refund: localizedSiteUrl('refund', lang),
  support: localizedSiteUrl('support', lang),
});

// Public support address (also listed on alborapp.com/support).
// Empty = Profile hides the "Send feedback" row.
export const SUPPORT_EMAIL = 'info@alborapp.com';

// Mağazanın kendi abonelik yönetim sayfaları (iptal/değişiklik burada yapılır).
export const SUBSCRIPTION_URLS = Object.freeze({
  ios: 'https://apps.apple.com/account/subscriptions',
  android: 'https://play.google.com/store/account/subscriptions?package=com.kivilcim.app',
});

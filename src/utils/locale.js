// Maps the app's selected language to a BCP-47 locale for Intl formatting.
//
// Why this exists: `Intl.NumberFormat(undefined, …)` keys off the *device*
// locale, not the language the user picked in the app — so someone on a German
// phone who chose Spanish would get German number formatting. Currency and
// date output must follow the in-app language.
import * as Localization from 'expo-localization';

const APP_LANG_TO_LOCALE = {
  tr: 'tr-TR',
  en: 'en-US',
  es: 'es-ES',
  de: 'de-DE',
};

export const DEFAULT_INTL_LOCALE = 'en-US';

export const SUPPORTED_LANGS = Object.keys(APP_LANG_TO_LOCALE);
export const DEFAULT_LANG = 'en';

/**
 * The language to start in before the user has picked one, read from the device
 * locale (`Intl.DateTimeFormat().resolvedOptions().locale` is unreliable on
 * Hermes/Android). Anything we don't ship falls back to English.
 *
 * Shared so that ThemeContext and the startup analytics context cannot drift
 * apart — a hardcoded default in one of them mislabels every first-run event.
 */
export const getDeviceLang = () => {
  try {
    const locales = Localization.getLocales?.() || [];
    const prefix = (locales[0]?.languageCode || '').toLowerCase();
    return SUPPORTED_LANGS.includes(prefix) ? prefix : DEFAULT_LANG;
  } catch (e) {
    return DEFAULT_LANG;
  }
};

export const intlLocaleFor = (lang) => APP_LANG_TO_LOCALE[lang] || DEFAULT_INTL_LOCALE;

/**
 * Uppercases text for the in-app language. iOS applies `textTransform:
 * 'uppercase'` without a locale, so Turkish "i" becomes "I" instead of "İ"
 * ("LIDERLIK"). Map the Turkish pair by hand (Hermes locale support varies);
 * the native transform is then a no-op on the already-uppercased string.
 */
export const toUpperFor = (text, lang) => {
  const value = String(text ?? '');
  if (lang === 'tr') return value.replace(/i/g, 'İ').replace(/ı/g, 'I').toUpperCase();
  return value.toUpperCase();
};

/**
 * Percent formatter driven by the in-app language ("%67" in Turkish,
 * "67%" in English). `value` is a whole-number percentage (67, not 0.67).
 */
export const formatPercent = (value, lang) => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '';
  try {
    return new Intl.NumberFormat(intlLocaleFor(lang), { style: 'percent', maximumFractionDigits: 0 }).format(value / 100);
  } catch (e) {
    return lang === 'tr' ? `%${Math.round(value)}` : `${Math.round(value)}%`;
  }
};

/**
 * Currency formatter driven by the in-app language. Falls back to
 * "<amount> <CODE>" when Intl or the currency code is unavailable.
 */
export const formatCurrency = (amount, currencyCode, lang) => {
  if (typeof amount !== 'number' || !Number.isFinite(amount)) return '';
  try {
    return new Intl.NumberFormat(intlLocaleFor(lang), {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (e) {
    return `${amount.toFixed(2)} ${currencyCode || ''}`.trim();
  }
};

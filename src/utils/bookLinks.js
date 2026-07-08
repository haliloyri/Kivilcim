// Region-aware book purchase links with affiliate (commission) tokens.
//
// Behaviour:
//  - Detects the device country via expo-localization.
//  - Sends the user to the matching Amazon marketplace (amazon.com.tr,
//    amazon.de, amazon.com ...), falling back to amazon.com.
//  - In Turkey the buy buttons are Hepsiburada + Kitapyurdu (the partnered
//    book stores) instead of Amazon.
//  - Every link carries the affiliate tag/token so book sales earn commission.
//  - Search links use the book title + author as keywords so the right book
//    is found.
//
// Configure the real IDs in app.json -> expo.extra.affiliate. Placeholder
// values ("SET_..." ) still produce working search links; they just don't
// earn commission until replaced.

import Constants from 'expo-constants';
import * as Localization from 'expo-localization';

const extra =
  Constants.expoConfig?.extra ??
  Constants.manifest?.extra ??
  {};

const affiliate = extra.affiliate ?? {};

// Country (ISO 3166-1 alpha-2) -> Amazon marketplace domain.
// Countries without their own Amazon fall back to DEFAULT_MARKETPLACE.
const AMAZON_MARKETPLACES = {
  TR: 'amazon.com.tr',
  US: 'amazon.com',
  CA: 'amazon.ca',
  MX: 'amazon.com.mx',
  BR: 'amazon.com.br',
  GB: 'amazon.co.uk',
  UK: 'amazon.co.uk',
  IE: 'amazon.co.uk',
  DE: 'amazon.de',
  AT: 'amazon.de',
  CH: 'amazon.de',
  FR: 'amazon.fr',
  ES: 'amazon.es',
  IT: 'amazon.it',
  NL: 'amazon.nl',
  BE: 'amazon.com.be',
  SE: 'amazon.se',
  PL: 'amazon.pl',
  AE: 'amazon.ae',
  SA: 'amazon.sa',
  EG: 'amazon.eg',
  IN: 'amazon.in',
  JP: 'amazon.co.jp',
  AU: 'amazon.com.au',
  SG: 'amazon.sg',
};

const DEFAULT_MARKETPLACE = 'amazon.com';

// Detect the device's country code (e.g. "TR", "US", "DE"). Null if unknown.
export function getRegion() {
  try {
    const locales = Localization.getLocales?.() || [];
    const region = locales[0]?.regionCode;
    if (region) return String(region).toUpperCase();
  } catch (e) {
    // ignore and try legacy API
  }
  try {
    if (Localization.region) return String(Localization.region).toUpperCase();
  } catch (e) {
    // ignore
  }
  return null;
}

export function getAmazonDomain(region = getRegion()) {
  if (!region) return DEFAULT_MARKETPLACE;
  return AMAZON_MARKETPLACES[region] || DEFAULT_MARKETPLACE;
}

function amazonTagForDomain(domain) {
  const tags = affiliate.amazon || {};
  return tags[domain] || affiliate.amazonDefaultTag || '';
}

// Build clean search keywords: book title first, then author.
export function buildBookKeywords(bookTitle, author) {
  const title = (bookTitle || '').split(' — ')[0].trim();
  return [title, (author || '').trim()].filter(Boolean).join(' ').trim();
}

// Append a store's affiliate tracking param, if configured.
function appendTracking(url, storeKey) {
  const cfg = affiliate[storeKey];
  if (!cfg || !cfg.token) return url;
  const sep = url.includes('?') ? '&' : '?';
  const param = encodeURIComponent(cfg.param || 'ref');
  return `${url}${sep}${param}=${encodeURIComponent(cfg.token)}`;
}

export function buildAmazonLink(keywords, region = getRegion()) {
  const domain = getAmazonDomain(region);
  const tag = amazonTagForDomain(domain);
  const q = encodeURIComponent(keywords);
  const tagParam = tag ? `&tag=${encodeURIComponent(tag)}` : '';
  return `https://www.${domain}/s?k=${q}${tagParam}`;
}

export function buildHepsiburadaLink(keywords) {
  const url = `https://www.hepsiburada.com/ara?q=${encodeURIComponent(keywords)}`;
  return appendTracking(url, 'hepsiburada');
}

export function buildKitapyurduLink(keywords) {
  const url =
    'https://www.kitapyurdu.com/index.php?route=product/search&filter_name=' +
    encodeURIComponent(keywords);
  return appendTracking(url, 'kitapyurdu');
}

// Region-aware list of buy buttons to render.
// TR -> Hepsiburada + Kitapyurdu. Elsewhere -> the local Amazon.
export function getBookBuyLinks(bookTitle, author) {
  const region = getRegion();
  const keywords = buildBookKeywords(bookTitle, author);
  if (!keywords) return [];

  if (region === 'TR') {
    return [
      { id: 'hepsiburada', label: 'Hepsiburada', icon: 'cart-outline', url: buildHepsiburadaLink(keywords) },
      { id: 'kitapyurdu', label: 'Kitapyurdu', icon: 'book-outline', url: buildKitapyurduLink(keywords) },
    ];
  }

  return [
    { id: 'amazon', label: 'Amazon', icon: 'cart-outline', url: buildAmazonLink(keywords, region) },
  ];
}

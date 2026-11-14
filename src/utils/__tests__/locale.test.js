// Currency and date formatting must follow the language the user picked IN THE
// APP, not the device locale. `Intl.NumberFormat(undefined, …)` reads the device
// — so someone on a German phone who chose Spanish got German formatting.

import { DEFAULT_INTL_LOCALE, formatCurrency, intlLocaleFor, toUpperFor } from '../locale';

describe('toUpperFor', () => {
  it('keeps the Turkish dotted and dotless i apart', () => {
    expect(toUpperFor('Liderlik', 'tr')).toBe('LİDERLİK');
    expect(toUpperFor('Okuma ritmi', 'tr')).toBe('OKUMA RİTMİ');
    expect(toUpperFor('Kaldığın yerden', 'tr')).toBe('KALDIĞIN YERDEN');
  });

  it('uses plain uppercasing for other languages', () => {
    expect(toUpperFor('Leadership', 'en')).toBe('LEADERSHIP');
    expect(toUpperFor('Liderazgo', 'es')).toBe('LIDERAZGO');
  });

  it('returns an empty string for missing text', () => {
    expect(toUpperFor(undefined, 'tr')).toBe('');
    expect(toUpperFor(null, 'en')).toBe('');
  });
});

describe('intlLocaleFor', () => {
  it('maps every supported app language', () => {
    expect(intlLocaleFor('tr')).toBe('tr-TR');
    expect(intlLocaleFor('en')).toBe('en-US');
    expect(intlLocaleFor('es')).toBe('es-ES');
    expect(intlLocaleFor('de')).toBe('de-DE');
  });

  it('falls back for an unknown language rather than returning undefined', () => {
    expect(intlLocaleFor('fr')).toBe(DEFAULT_INTL_LOCALE);
    expect(intlLocaleFor(undefined)).toBe(DEFAULT_INTL_LOCALE);
  });
});

describe('formatCurrency', () => {
  it('formats German the German way: comma decimal, symbol last', () => {
    const out = formatCurrency(49.99, 'EUR', 'de');
    expect(out).toContain('49,99');
    expect(out).toContain('€');
    expect(out.indexOf('€')).toBeGreaterThan(out.indexOf('49,99'));
  });

  it('formats Spanish with a comma decimal too', () => {
    expect(formatCurrency(39.99, 'EUR', 'es')).toContain('39,99');
  });

  it('formats US English with a leading symbol and a dot decimal', () => {
    expect(formatCurrency(49.99, 'USD', 'en')).toBe('$49.99');
  });

  it('does not follow the device locale for a different app language', () => {
    expect(formatCurrency(49.99, 'EUR', 'de')).not.toBe(formatCurrency(49.99, 'EUR', 'en'));
  });

  it('returns an empty string for a non-amount instead of "NaN"', () => {
    for (const value of [undefined, null, NaN, Infinity, '49.99']) {
      expect(formatCurrency(value, 'EUR', 'de')).toBe('');
    }
  });

  it('degrades to "<amount> <CODE>" when the currency code is unusable', () => {
    expect(formatCurrency(49.99, 'NOT_A_CODE', 'en')).toBe('49.99 NOT_A_CODE');
  });
});

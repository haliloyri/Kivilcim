import { translations } from '../i18n';

describe('locale key parity', () => {
  const enKeys = Object.keys(translations.en);

  it.each(['tr', 'es', 'de'])('every en key exists in %s', (lang) => {
    const missing = enKeys.filter((key) => !(key in translations[lang]));
    expect(missing).toEqual([]);
  });
});

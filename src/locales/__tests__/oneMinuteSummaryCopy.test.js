import { translations } from '../i18n';

const keys = [
  'oneMinuteSummaryCta',
  'oneMinuteSummarySubtitle',
  'oneMinuteSummaryPremium',
  'oneMinuteSummaryTitle',
  'oneMinuteSummaryDuration',
  'oneMinuteSummaryFullStory',
  'paywallOneMinuteTitle',
  'paywallOneMinuteSub',
  'paywallOneMinuteHeroTitle',
  'paywallOneMinuteHeroSub',
  'paywallWhyNowOneMinuteTitle',
  'paywallWhyNowOneMinuteSub',
  'paywallOneMinuteValue1',
  'paywallOneMinuteValue2',
  'paywallOneMinuteValue3',
];

describe('one-minute summary translations', () => {
  it.each(['en', 'tr', 'es', 'de'])('%s includes every visible key', (lang) => {
    keys.forEach((key) => {
      expect(translations[lang][key]).toEqual(expect.any(String));
      expect(translations[lang][key].trim()).not.toBe('');
    });
  });
});

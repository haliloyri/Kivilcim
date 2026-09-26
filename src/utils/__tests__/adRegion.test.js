import { isRestrictedRegion, NO_ADS_REGIONS, resolveRewardedGate } from '../adRegion';

describe('ad region restriction', () => {
  it.each(['DE', 'ES', 'FR', 'IT', 'NL', 'GB', 'NO', 'IS', 'LI', 'SE', 'PL'])(
    'refuses ads in %s',
    (region) => expect(isRestrictedRegion(region)).toBe(true),
  );

  it.each(['TR', 'US', 'BR', 'JP', 'IN', 'CA', 'AU', 'CH'])(
    'allows ads in %s',
    (region) => expect(isRestrictedRegion(region)).toBe(false),
  );

  it('is case-insensitive', () => {
    expect(isRestrictedRegion('de')).toBe(true);
    expect(isRestrictedRegion('tr')).toBe(false);
  });

  // Better one fewer ad than an unconsented ad request from inside the EEA.
  it('fails closed on a missing or malformed region', () => {
    for (const value of [undefined, null, '', 'D', 'DEU', 42, {}]) {
      expect(isRestrictedRegion(value)).toBe(true);
    }
  });

  it('covers all 27 EU members plus the rest of the EEA and the UK', () => {
    expect(NO_ADS_REGIONS).toHaveLength(31);
    // Switzerland is neither EU nor EEA — it must not be swept in by mistake.
    expect(NO_ADS_REGIONS).not.toContain('CH');
  });
});

describe('rewardedGate — a region without ads must not give premium away', () => {
  it('lets entitled users straight through', () => {
    expect(resolveRewardedGate({ adsAvailable: false, isPremium: true })).toBe('allow');
    expect(resolveRewardedGate({ adsAvailable: false, isPremium: false, alreadyUnlocked: true }))
      .toBe('allow');
  });

  it('offers the rewarded sheet where ads run', () => {
    expect(resolveRewardedGate({ adsAvailable: true, isPremium: false })).toBe('ad');
  });

  // The regression the EU ads-off decision would otherwise have caused: call
  // sites read `!shouldShowAd(...)` as "let them through", which handed the paid
  // share card to every free user in Germany and Spain.
  it('routes a free user with no ad inventory to the paywall, not to the feature', () => {
    expect(resolveRewardedGate({ adsAvailable: false, isPremium: false })).toBe('paywall');
  });
});

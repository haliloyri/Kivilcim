// Which RevenueCat key / AdMob units each build uses, and when a free trial
// may be promised. Each case loads the modules fresh with a given mode.
const EXTRA = {
  revenuecat: { testStoreApiKey: 'test_abc', iosApiKey: 'appl_real', androidApiKey: 'goog_real', products: { monthly: 'monthly', yearly: 'yearly' } },
  admob: {
    ios: { rewarded: 'ca-app-pub-1/2', interstitial: 'ca-app-pub-1/3', banner: 'ca-app-pub-1/4', native: 'ca-app-pub-1/8' },
    android: { rewarded: 'ca-app-pub-1/5', interstitial: 'ca-app-pub-1/6', banner: 'ca-app-pub-1/7', native: 'ca-app-pub-1/9' },
  },
};

// Ads are off in the EEA/UK and when the region is unknown (utils/adRegion.js),
// so ad cases run from a region where ads are allowed unless told otherwise.
const load = ({ live, dev, extra = EXTRA, purchases, regionCode = 'TR' }) => {
  let mods;
  jest.isolateModules(() => {
    global.__DEV__ = dev;
    jest.doMock('../../config/monetization', () => ({ MONETIZATION_LIVE: live }));
    jest.doMock('expo-constants', () => ({ __esModule: true, default: { expoConfig: { extra }, executionEnvironment: 'bare' } }));
    jest.doMock('react-native', () => ({ Platform: { OS: 'ios', select: (o) => o.ios } }));
    jest.doMock('expo-localization', () => ({ getLocales: () => [{ regionCode }] }));
    jest.doMock('@react-native-async-storage/async-storage', () => ({
      __esModule: true, default: { getItem: async () => null, setItem: async () => {} },
    }));
    jest.doMock('react-native-purchases', () => ({ __esModule: true, default: purchases || {} }));
    jest.doMock('react-native-google-mobile-ads', () => ({
      __esModule: true,
      default: () => ({ initialize: async () => [] }),
      TestIds: { REWARDED: 'test-rewarded', INTERSTITIAL: 'test-interstitial', BANNER: 'test-banner', NATIVE: 'test-native' },
      RewardedAd: {}, InterstitialAd: {}, RewardedAdEventType: {}, AdEventType: {}, BannerAdSize: {},
    }));
    jest.doMock('../../utils/adsConsent', () => ({
      gatherAdsConsent: async () => ({ canRequestAds: true }), adRequestOptions: () => ({}), canRequestAds: () => true,
    }));
    mods = { billing: require('../billing'), ads: require('../../utils/ads'), grace: require('../../utils/installGrace') };
  });
  return mods;
};

afterEach(() => { global.__DEV__ = true; jest.resetModules(); });

describe('billing key per build', () => {
  it('live production build uses the real store key', () => {
    const { billing } = load({ live: true, dev: false });
    expect(billing.BILLING_LIVE).toBe(true);
    expect(billing.BILLING_DEMO).toBe(false);
  });
  it('debug build (simulator or device) uses Test Store demo purchases', () => {
    const { billing } = load({ live: false, dev: true });
    expect(billing.BILLING_LIVE).toBe(true);
    expect(billing.BILLING_DEMO).toBe(true);
  });
  it('preview release build has no billing (test keys crash release builds)', () => {
    const { billing } = load({ live: false, dev: false });
    expect(billing.BILLING_LIVE).toBe(false);
  });
  it('live build with placeholder store keys has no billing', () => {
    const extra = { ...EXTRA, revenuecat: { ...EXTRA.revenuecat, iosApiKey: 'REPLACE_WITH_APPL_KEY' } };
    const { billing } = load({ live: true, dev: false, extra });
    expect(billing.BILLING_LIVE).toBe(false);
  });
});

describe('ad units per build', () => {
  it('demo builds use Google test units', () => {
    const { ads } = load({ live: false, dev: false });
    expect(ads.AD_UNITS.rewarded).toBe('test-rewarded');
    expect(ads.shouldShowAd({ isPremium: false, isOnboarded: true })).toBe(true);
  });
  it('live builds use the real units from app.json', () => {
    const { ads } = load({ live: true, dev: false });
    expect(ads.AD_UNITS.rewarded).toBe('ca-app-pub-1/2');
    expect(ads.shouldShowAd({ isPremium: false, isOnboarded: true })).toBe(true);
  });
  it('live build with only a real interstitial unit shows interstitials but sends rewarded gates to the paywall', () => {
    const extra = { ...EXTRA, admob: { ios: { rewarded: 'REPLACE_WITH_IOS_REWARDED_UNIT', interstitial: 'ca-app-pub-1/3', banner: 'REPLACE_WITH_IOS_BANNER_UNIT' } } };
    const { ads } = load({ live: true, dev: false, extra });
    const user = { isPremium: false, isOnboarded: true };
    expect(ads.shouldShowAd({ ...user, kind: 'interstitial' })).toBe(true);
    expect(ads.shouldShowAd(user)).toBe(false);
    expect(ads.rewardedGate(user)).toBe('paywall');
  });
  it('live builds without real units show no ads at all', () => {
    const extra = { ...EXTRA, admob: { ios: { rewarded: 'REPLACE_WITH_IOS_REWARDED_UNIT' } } };
    const { ads } = load({ live: true, dev: false, extra });
    expect(ads.shouldShowAd({ isPremium: false, isOnboarded: true })).toBe(false);
    expect(ads.shouldShowAd({ isPremium: false, isOnboarded: true, kind: 'interstitial' })).toBe(false);
  });
  it("demo builds use Google's test native unit", () => {
    const { ads } = load({ live: false, dev: false });
    expect(ads.AD_UNITS.native).toBe('test-native');
    expect(ads.shouldShowAd({ isPremium: false, isOnboarded: true, kind: 'native' })).toBe(true);
  });
  it('live builds use the real native unit', () => {
    const { ads } = load({ live: true, dev: false });
    expect(ads.AD_UNITS.native).toBe('ca-app-pub-1/8');
    expect(ads.shouldShowAd({ isPremium: false, isOnboarded: true, kind: 'native' })).toBe(true);
    expect(ads.shouldShowAd({ isPremium: true, isOnboarded: true, kind: 'native' })).toBe(false);
  });
  it('live build with a placeholder native unit shows no native ad but keeps rewarded', () => {
    const extra = { ...EXTRA, admob: { ios: { ...EXTRA.admob.ios, native: 'REPLACE_WITH_IOS_NATIVE_UNIT' } } };
    const { ads } = load({ live: true, dev: false, extra });
    const user = { isPremium: false, isOnboarded: true };
    expect(ads.shouldShowAd({ ...user, kind: 'native' })).toBe(false);
    expect(ads.shouldShowAd(user)).toBe(true);
  });
  it('native ads are off in restricted regions', () => {
    const { ads } = load({ live: true, dev: false, regionCode: 'DE' });
    expect(ads.shouldShowAd({ isPremium: false, isOnboarded: true, kind: 'native' })).toBe(false);
  });
});

describe('ad-free first days after install', () => {
  const DAY = 24 * 60 * 60 * 1000;
  const user = { isPremium: false, isOnboarded: true };

  it('hides interstitial and native ads for 3 days but keeps the rewarded ad', () => {
    const { ads, grace } = load({ live: false, dev: false });
    grace.__setInstallAtForTests(Date.now() - DAY);
    expect(ads.shouldShowAd({ ...user, kind: 'interstitial' })).toBe(false);
    expect(ads.shouldShowAd({ ...user, kind: 'native' })).toBe(false);
    expect(ads.shouldShowAd(user)).toBe(true);
  });

  it('shows interstitial and native ads once 3 days have passed', () => {
    const { ads, grace } = load({ live: false, dev: false });
    grace.__setInstallAtForTests(Date.now() - 3 * DAY - 1000);
    expect(ads.shouldShowAd({ ...user, kind: 'interstitial' })).toBe(true);
    expect(ads.shouldShowAd({ ...user, kind: 'native' })).toBe(true);
  });
});

describe('free trial eligibility', () => {
  const pkg = (id, introPrice) => ({ product: { identifier: id, introPrice } });
  const week = { price: 0, periodNumberOfUnits: 1, periodUnit: 'WEEK' };

  it('returns only plans with a free intro offer the user is eligible for', async () => {
    const purchases = {
      configure: async () => {},
      INTRO_ELIGIBILITY_STATUS: { INTRO_ELIGIBILITY_STATUS_ELIGIBLE: 2 },
      checkTrialOrIntroductoryPriceEligibility: async () => ({ monthly: { status: 2 }, yearly: { status: 1 } }),
    };
    const { billing } = load({ live: true, dev: false, purchases });
    const trials = await billing.getTrialEligibility({
      monthly: pkg('monthly', week),
      yearly: pkg('yearly', week),
    });
    expect(trials).toEqual({ monthly: { days: 7 } });
  });

  it('promises nothing when products have no free intro phase', async () => {
    const purchases = { configure: async () => {}, checkTrialOrIntroductoryPriceEligibility: async () => ({}) };
    const { billing } = load({ live: true, dev: false, purchases });
    const trials = await billing.getTrialEligibility({ monthly: pkg('monthly', { price: 1.99, periodNumberOfUnits: 1, periodUnit: 'MONTH' }) });
    expect(trials).toEqual({});
  });
});

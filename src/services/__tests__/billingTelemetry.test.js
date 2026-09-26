// Revenue telemetry has to be numeric. `paywall_purchase_succeeded` used to
// carry `selectedPrice: "349₺"` — a display string, which can't be summed, so
// LTV and ROAS were impossible to compute and paid acquisition couldn't be run
// safely. These tests pin the shape.

import { entitlementSnapshot, isPlaceholderKey, revenueAttrs } from '../billing';

const pkg = (product) => ({ product });

describe('revenueAttrs', () => {
  it('emits a numeric amount, an ISO currency and the product id', () => {
    expect(revenueAttrs(pkg({
      price: 49.99,
      currencyCode: 'EUR',
      identifier: 'yearly',
      priceString: '49,99 €',
    }))).toEqual({
      revenue: 49.99,
      currency: 'EUR',
      product_id: 'yearly',
      price_string: '49,99 €',
    });
  });

  it('never emits a non-numeric revenue', () => {
    const attrs = revenueAttrs(pkg({ price: '49.99', currencyCode: 'EUR', identifier: 'yearly' }));
    expect(attrs).not.toHaveProperty('revenue');
    expect(attrs).toEqual({ currency: 'EUR', product_id: 'yearly' });
  });

  it('keeps a genuinely free intro price rather than dropping it', () => {
    expect(revenueAttrs(pkg({ price: 0, currencyCode: 'EUR', identifier: 'yearly' })))
      .toMatchObject({ revenue: 0 });
  });

  it('is safe on a missing package or product', () => {
    expect(revenueAttrs(null)).toEqual({});
    expect(revenueAttrs({})).toEqual({});
    expect(revenueAttrs(pkg({}))).toEqual({});
  });
});

describe('entitlementSnapshot', () => {
  // ENTITLEMENT_ID falls back to 'premium' when app.json has no override; the
  // test builds customerInfo around whatever the module resolved.
  // eslint-disable-next-line global-require
  const { ENTITLEMENT_ID } = require('../billing');

  const customerInfo = (entitlement) => ({
    entitlements: { active: entitlement ? { [ENTITLEMENT_ID]: entitlement } : {} },
  });

  it('returns null when the entitlement is not active', () => {
    expect(entitlementSnapshot(customerInfo(null))).toBeNull();
    expect(entitlementSnapshot(null)).toBeNull();
    expect(entitlementSnapshot({})).toBeNull();
  });

  it('normalizes expiry, renewal intent and trial state', () => {
    const snapshot = entitlementSnapshot(customerInfo({
      productIdentifier: 'yearly',
      expirationDate: '2027-09-09T00:00:00Z',
      willRenew: true,
      periodType: 'TRIAL',
      store: 'APP_STORE',
      latestPurchaseDate: '2026-09-09T00:00:00Z',
    }));

    expect(snapshot).toEqual({
      active: true,
      productId: 'yearly',
      expiresAt: '2027-09-09T00:00:00Z',
      willRenew: true,
      periodType: 'TRIAL',
      isTrial: true,
      store: 'APP_STORE',
      latestPurchaseAt: '2026-09-09T00:00:00Z',
    });
  });

  it('marks a normal paid period as not a trial', () => {
    const snapshot = entitlementSnapshot(customerInfo({ periodType: 'NORMAL', willRenew: true }));
    expect(snapshot.isTrial).toBe(false);
  });

  // A lifetime purchase has no expiry — treating a missing date as "expired"
  // would revoke Premium from someone who paid once.
  it('carries a null expiry for a non-expiring entitlement', () => {
    const snapshot = entitlementSnapshot(customerInfo({
      productIdentifier: 'lifetime',
      periodType: 'NORMAL',
    }));
    expect(snapshot.active).toBe(true);
    expect(snapshot.expiresAt).toBeNull();
    expect(snapshot.willRenew).toBe(false);
  });
});

describe('isPlaceholderKey — what counts as a live RevenueCat key', () => {
  it('rejects unset and placeholder values', () => {
    for (const key of [undefined, null, '', '   ', 42, {}, 'REPLACE_WITH_YOUR_KEY']) {
      expect(isPlaceholderKey(key)).toBe(true);
    }
  });

  // `test_...` keys are RevenueCat's Test Store keys. Configuring the native SDK
  // with one on a real device throws an uncatchable native error, so they must
  // never count as live — and, more importantly, a build carrying one must not
  // behave as if purchases work.
  it('rejects Test Store keys', () => {
    expect(isPlaceholderKey('test_zQNQaEomhNzTWshNkFgryXpMoSk')).toBe(true);
  });

  it('accepts real Apple and Google public SDK keys', () => {
    expect(isPlaceholderKey('appl_AbCdEfGhIjKlMnOpQrStUvWxYz')).toBe(false);
    expect(isPlaceholderKey('goog_AbCdEfGhIjKlMnOpQrStUvWxYz')).toBe(false);
  });
});

jest.mock('../../context/ThemeContext', () => ({
  useTheme: () => ({ colors: require('../../theme/theme').colors.light, isDark: false }),
}));
jest.mock('@expo/vector-icons', () => ({ Ionicons: 'Icon' }));
jest.mock('../../utils/ads', () => {
  const React = require('react');
  const passthrough = ({ children }) => React.createElement(React.Fragment, null, children);
  return {
    loadNativeAd: jest.fn(),
    NativeAdView: passthrough,
    NativeAsset: passthrough,
    NativeMediaView: () => null,
    NativeAssetType: {
      HEADLINE: 'headline', BODY: 'body', ICON: 'icon', CALL_TO_ACTION: 'callToAction', ADVERTISER: 'advertiser',
    },
  };
});

import React from 'react';
import { StyleSheet, Text } from 'react-native';
import TestRenderer, { act } from 'react-test-renderer';
import NativeAdCard from '../NativeAdCard';
import { loadNativeAd, NativeAdView, NativeMediaView } from '../../utils/ads';

const makeAd = () => ({
  headline: 'Örnek reklam',
  body: 'Gövde metni',
  callToAction: 'Yükle',
  advertiser: 'Marka',
  icon: { url: 'https://example.com/i.png' },
  mediaContent: { aspectRatio: 1.5 },
  destroy: jest.fn(),
});

let tree;
beforeEach(() => { loadNativeAd.mockReset(); });
afterEach(() => { if (tree) act(() => tree.unmount()); tree = null; });

const mount = async (props = {}) => {
  await act(async () => { tree = TestRenderer.create(<NativeAdCard lang="tr" {...props} />); });
};
const allText = () => tree.root.findAllByType(Text).flatMap((n) => [].concat(n.props.children)).join('|');

describe('NativeAdCard', () => {
  it('renders nothing while the ad is loading', async () => {
    loadNativeAd.mockReturnValue(new Promise(() => {}));
    await mount();
    expect(tree.toJSON()).toBeNull();
  });

  it('renders nothing when loading fails', async () => {
    loadNativeAd.mockResolvedValue(null);
    await mount();
    expect(tree.toJSON()).toBeNull();
  });

  it('shows the Reklam label, headline and call to action once loaded', async () => {
    loadNativeAd.mockResolvedValue(makeAd());
    await mount();
    const text = allText();
    expect(text).toContain('Reklam');
    expect(text).toContain('Örnek reklam');
    expect(text).toContain('Yükle');
  });

  // On iOS the native ad view applies its own padding and border on top of
  // Yoga's, which shifted every asset right and out of the view (AdMob's
  // validator: "Advertiser assets outside native ad view"). The card's padding
  // and border live on plain views around and inside it instead.
  it('keeps padding and border off the native ad view', async () => {
    loadNativeAd.mockResolvedValue(makeAd());
    await mount();
    const style = StyleSheet.flatten(tree.root.findByType(NativeAdView).props.style) || {};
    expect(style.padding).toBeUndefined();
    expect(style.borderWidth).toBeUndefined();
  });

  // Between stories the ad must stay about two story rows tall, so it lays out
  // as one row: a fixed 120x120 media view (AdMob's minimum for video) beside
  // the text. The full layout stacks a media view as wide as the card.
  it('compact lays the media view out at a fixed 120x120', async () => {
    loadNativeAd.mockResolvedValue(makeAd());
    await mount({ compact: true });
    const media = StyleSheet.flatten(tree.root.findByType(NativeMediaView).props.style);
    expect(media.width).toBe(120);
    expect(media.height).toBe(120);
  });

  it('compact keeps the label, headline and call to action', async () => {
    loadNativeAd.mockResolvedValue(makeAd());
    await mount({ compact: true });
    const text = allText();
    expect(text).toContain('Reklam');
    expect(text).toContain('Örnek reklam');
    expect(text).toContain('Yükle');
  });

  it('the full layout keeps a card-wide media view', async () => {
    loadNativeAd.mockResolvedValue(makeAd());
    await mount();
    const media = StyleSheet.flatten(tree.root.findByType(NativeMediaView).props.style);
    expect(media.width).toBe('100%');
  });

  it('destroys the ad on unmount', async () => {
    const ad = makeAd();
    loadNativeAd.mockResolvedValue(ad);
    await mount();
    expect(ad.destroy).not.toHaveBeenCalled();
    act(() => tree.unmount());
    tree = null;
    expect(ad.destroy).toHaveBeenCalledTimes(1);
  });

  it('destroys an ad that arrives after unmount', async () => {
    const ad = makeAd();
    let resolveLoad;
    loadNativeAd.mockReturnValue(new Promise((resolve) => { resolveLoad = resolve; }));
    await mount();
    act(() => tree.unmount());
    tree = null;
    await act(async () => { resolveLoad(ad); });
    expect(ad.destroy).toHaveBeenCalledTimes(1);
  });
});

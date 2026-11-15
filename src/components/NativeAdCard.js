// NativeAdCard — one in-feed native ad (AdMob). Loads its own ad, because a
// NativeAd can back only one view at a time. It draws nothing while loading
// and when no ad could be had, so a missing ad never leaves a gap.
// The "Reklam" label and the SDK-registered assets keep it clearly an ad
// (AdMob native ad policy): it must never read as story content.
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { t } from '../locales/i18n';
import {
  loadNativeAd, NativeAdView, NativeAsset, NativeAssetType, NativeMediaView,
} from '../utils/ads';

// compact: one row (media beside the text), about two story rows tall, for the
// lists between stories. The default stacks a card-wide media view.
const NativeAdCard = ({ lang, style, compact = false }) => {
  const { colors } = useTheme();
  const [ad, setAd] = useState(null);

  useEffect(() => {
    let active = true;
    let loaded = null;
    loadNativeAd().then((result) => {
      if (!result) return;
      if (!active) {
        // The screen went away while the ad was loading.
        result.destroy();
        return;
      }
      loaded = result;
      setAd(result);
    });
    return () => {
      active = false;
      loaded?.destroy();
    };
  }, []);

  if (!ad) return null;

  const styles = makeStyles(colors);
  // The card's border and padding sit on plain views around and inside the
  // native ad view, never on it: on iOS the native view adds its own on top of
  // Yoga's, which pushed every asset right and out of the view.
  if (compact) {
    return (
      <View style={style}>
        <View style={styles.card}>
          <NativeAdView nativeAd={ad}>
            <View style={styles.compactContent}>
              <NativeMediaView resizeMode="cover" style={styles.compactMedia} />
              <View style={styles.compactText}>
                <View style={styles.topRow}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{t('adLabel', lang)}</Text>
                  </View>
                  {ad.advertiser ? (
                    <NativeAsset assetType={NativeAssetType.ADVERTISER}>
                      <Text style={styles.advertiser} numberOfLines={1}>{ad.advertiser}</Text>
                    </NativeAsset>
                  ) : null}
                </View>
                <NativeAsset assetType={NativeAssetType.HEADLINE}>
                  <Text style={styles.headline} numberOfLines={2}>{ad.headline}</Text>
                </NativeAsset>
                {ad.body ? (
                  <NativeAsset assetType={NativeAssetType.BODY}>
                    <Text style={styles.compactBody} numberOfLines={1}>{ad.body}</Text>
                  </NativeAsset>
                ) : null}
                {ad.callToAction ? (
                  <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
                    <Text style={[styles.cta, styles.compactCta]} numberOfLines={1}>{ad.callToAction}</Text>
                  </NativeAsset>
                ) : null}
              </View>
            </View>
          </NativeAdView>
        </View>
      </View>
    );
  }

  return (
    <View style={style}>
      <View style={styles.card}>
        <NativeAdView nativeAd={ad}>
          <View style={styles.content}>
            <View style={styles.topRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{t('adLabel', lang)}</Text>
              </View>
              {ad.advertiser ? (
                <NativeAsset assetType={NativeAssetType.ADVERTISER}>
                  <Text style={styles.advertiser} numberOfLines={1}>{ad.advertiser}</Text>
                </NativeAsset>
              ) : null}
            </View>

            <View style={styles.headRow}>
              {ad.icon ? (
                <NativeAsset assetType={NativeAssetType.ICON}>
                  <Image source={{ uri: ad.icon.url }} style={styles.icon} />
                </NativeAsset>
              ) : null}
              <NativeAsset assetType={NativeAssetType.HEADLINE}>
                <Text style={styles.headline} numberOfLines={2}>{ad.headline}</Text>
              </NativeAsset>
            </View>

            {ad.body ? (
              <NativeAsset assetType={NativeAssetType.BODY}>
                <Text style={styles.body} numberOfLines={3}>{ad.body}</Text>
              </NativeAsset>
            ) : null}

            <NativeMediaView resizeMode="cover" style={styles.media} />

            {ad.callToAction ? (
              <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
                <Text style={styles.cta} numberOfLines={1}>{ad.callToAction}</Text>
              </NativeAsset>
            ) : null}
          </View>
        </NativeAdView>
      </View>
    </View>
  );
};

const makeStyles = (colors) => StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
  },
  content: { padding: 14, gap: 10 },
  compactContent: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  // 120x120 is AdMob's minimum media size for video ads.
  compactMedia: { width: 120, height: 120, borderRadius: 12, overflow: 'hidden' },
  compactText: { flex: 1, gap: 6 },
  compactBody: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 18, color: colors.textSecondary },
  compactCta: { paddingVertical: 8 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badge: {
    borderWidth: 1,
    borderColor: colors.textSecondary,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  badgeText: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: colors.textSecondary },
  advertiser: { flexShrink: 1, fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textSecondary },
  headRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  icon: { width: 36, height: 36, borderRadius: 8 },
  headline: { flexShrink: 1, fontFamily: 'Inter_600SemiBold', fontSize: 16, color: colors.text },
  body: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20, color: colors.textSecondary },
  media: { width: '100%', borderRadius: 12, overflow: 'hidden' },
  cta: {
    alignSelf: 'stretch',
    textAlign: 'center',
    overflow: 'hidden',
    borderRadius: 12,
    paddingVertical: 12,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: colors.onPrimary,
    backgroundColor: colors.primary,
  },
});

export default NativeAdCard;

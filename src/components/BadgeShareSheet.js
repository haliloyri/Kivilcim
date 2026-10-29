import React, { useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo, findNodeHandle, View, Text, Modal, Pressable, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { useTheme } from '../context/ThemeContext';
import { t } from '../locales/i18n';
import { BADGE_MAP, BADGE_IMAGES } from './BadgeIcon';
import { getCareerVisual } from '../constants/careerVisuals';
import { getShareLabel } from '../utils/share';
import useReducedMotion from '../hooks/useReducedMotion';
import { ANALYTICS_EVENTS, trackEvent } from '../utils/analytics';
import { getLogo } from '../constants/logos';
import { buildPalette } from '../theme/theme';
import Svg, { Circle, Line } from 'react-native-svg';

const buildLines = ({ badge, achievement }, name, lang) => {
  const title = achievement?.rankTitle || t(badge.titleKey, lang);
  const safeName = String(name || '').trim().slice(0, 30);
  const nameStr = safeName || t('badgeShareReaderFallback', lang);
  const l1 = achievement?.line
    ? achievement.line
    : achievement
    ? t('career.share.line', lang, { name: nameStr, title, path: achievement.pathLabel })
    : t('badgeShare.legacyLine', lang, { name: nameStr, title });
  const hook = safeName
    ? t('badgeShareMilestoneNamed', lang, { name: safeName })
    : t('badgeShareMilestoneFallback', lang);
  return { l1, hook: achievement?.hook || achievement?.evidenceSummary || hook, title };
};

// Design size of the shareable card. The preview renders the exact same card
// at this size and scales it down, so preview and exported PNG always match
// (fixed font sizes on a smaller preview box used to overflow and overlap).
const CARD_W = 360;
const CARD_H = { square: 450, story: 640 };

// The shareable card follows the in-app celebration card (DESIGN.md): petrol
// band with the dawn sun, paper body, emblem ring overlapping the band.
//   band   : Albor logo (top-left) · sun
//   body   : emblem, kicker, serif title, path, line, stats panel (+quote in story)
//   footer : hairline, hook (max 2 lines), link — own reserved space
// Brand rule: share cards are always petrol, light or dark only.
const SUN_DOTS = [[34, 56, 7], [78, 40, 5], [124, 62, 7], [22, 94, 5], [170, 44, 7]];

const Sun = ({ color }) => (
  <Svg width={168} height={130} viewBox="0 0 168 130" style={s.sun} pointerEvents="none">
    <Circle cx={96} cy={26} r={84} fill={color} opacity={0.08} />
    <Circle cx={96} cy={26} r={62} fill={color} opacity={0.14} />
    <Circle cx={96} cy={26} r={40} fill={color} opacity={0.95} />
    {[[96, 90, 96, 108], [60, 78, 50, 90], [132, 78, 142, 90], [40, 52, 24, 58], [152, 52, 168, 58]].map(([x1, y1, x2, y2], i) => (
      <Line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={3} strokeLinecap="round" opacity={0.85} />
    ))}
  </Svg>
);

const ShareCard = ({ badge, achievement, theme, lang, name, quote, tall, shareLink }) => {
  const dark = theme === 'dark';
  const c = buildPalette(dark ? 'dark' : 'light');
  const { l1, hook, title } = buildLines({ badge, achievement }, name, lang);
  const visual = achievement ? getCareerVisual(achievement.visualKey) : null;
  const emblemImage = achievement ? (achievement.icon ? null : visual.image) : BADGE_IMAGES[badge?.id];
  const emblemIcon = achievement ? (achievement.icon || visual.icon) : (BADGE_MAP[badge?.id]?.icon || 'trophy');
  const earnedDate = achievement?.earnedDate ? String(achievement.earnedDate).slice(0, 10) : null;
  const stats = (achievement?.stats || []).filter((stat) => Number(stat.value) > 0);
  const kicker = achievement?.kicker || null;
  const emblemSize = tall ? 108 : 92;
  const bandH = tall ? 120 : 92;
  const upper = (v) => String(v).toLocaleUpperCase(lang === 'tr' ? 'tr-TR' : undefined);

  return (
    <View style={[s.card, { backgroundColor: c.modalSurface, height: tall ? CARD_H.story : CARD_H.square }]}>
      <View style={[s.band, { backgroundColor: c.heroSurface, height: bandH }]}>
        <Sun color={c.dawn} />
        {SUN_DOTS.map(([left, top, size], i) => (
          <View
            key={i}
            style={{
              position: 'absolute', left, top: top - (tall ? 24 : 40), width: size, height: size,
              borderRadius: i % 2 ? size / 2 : 2,
              backgroundColor: i % 2 ? '#F5F1E8' : c.dawn, opacity: i % 2 ? 0.5 : 0.75,
            }}
          />
        ))}
        <View style={s.brand}>
          <Image source={getLogo(true)} style={s.brandLogo} resizeMode="contain" />
          <Text style={s.brandText}>Albor</Text>
        </View>
      </View>

      <View
        style={[
          s.emblem,
          { width: emblemSize, height: emblemSize, borderRadius: emblemSize / 2, marginTop: -emblemSize / 2, backgroundColor: c.modalSurface, borderColor: `${c.dawn}8C` },
        ]}
      >
        {emblemImage ? (
          <Image source={emblemImage} resizeMode="cover" style={{ width: '100%', height: '100%', borderRadius: emblemSize / 2 }} />
        ) : (
          <View style={[s.emblemIcon, { backgroundColor: c.heroSurface }]}>
            <Ionicons name={emblemIcon} size={emblemSize * 0.42} color={c.dawn} />
          </View>
        )}
      </View>

      <View style={[s.body, tall && { justifyContent: 'center' }]}>
        {kicker ? <Text style={[s.kicker, { color: c.dawnText }]} numberOfLines={1}>{upper(kicker)}</Text> : null}
        <Text
          style={[s.title, { color: c.text }]}
          numberOfLines={2}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
        >
          {title}
        </Text>
        {achievement?.pathLabel ? <Text style={[s.sub, { color: c.primaryText }]} numberOfLines={1}>{achievement.pathLabel}</Text> : null}
        {achievement?.subLabel ? <Text style={[s.sub, { color: c.textSecondary }]} numberOfLines={1}>{achievement.subLabel}</Text> : null}

        <Text style={[s.line, { color: c.textSecondary }]} numberOfLines={stats.length ? 2 : 3}>{l1}</Text>

        {stats.length ? (
          <View style={[s.panel, { backgroundColor: c.primaryContainer }]}>
            {stats.map((stat, index) => (
              <View key={stat.label} style={[s.stat, index > 0 && { borderLeftWidth: 1, borderLeftColor: c.border }]}>
                <Text style={[s.statValue, { color: c.text }]}>{String(stat.value)}</Text>
                <Text style={[s.statLabel, { color: c.textSecondary }]} numberOfLines={1}>{stat.label}</Text>
              </View>
            ))}
          </View>
        ) : earnedDate ? (
          <Text style={[s.date, { color: c.textSecondary }]}>{t('career.share.earnedDate', lang, { date: earnedDate })}</Text>
        ) : null}

        {tall && quote ? (
          <View style={[s.quoteWrap, { backgroundColor: c.primaryContainer, borderLeftColor: c.primary }]}>
            <Text style={[s.quote, { color: c.text }]} numberOfLines={4}>{`“${quote.q}”`}</Text>
            <Text style={[s.author, { color: c.textSecondary }]}>{`— ${quote.a}`}</Text>
          </View>
        ) : null}
      </View>

      <View style={[s.footer, { borderTopColor: c.border }]}>
        <Text
          style={[s.hook, { color: c.primaryText }]}
          numberOfLines={2}
          adjustsFontSizeToFit
          minimumFontScale={0.8}
        >
          {hook}
        </Text>
        {shareLink ? <Text style={[s.link, { color: c.textSecondary }]}>{shareLink}</Text> : null}
      </View>
    </View>
  );
};

// Preview = the real card at design size, scaled to fit `boxWidth`.
const ScaledCard = ({ boxWidth, tall, ...props }) => {
  const h = tall ? CARD_H.story : CARD_H.square;
  const scale = boxWidth / CARD_W;
  return (
    <View style={{ width: boxWidth, height: h * scale, borderRadius: 22, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(36,33,30,0.14)' }}>
      <View
        style={{
          position: 'absolute', width: CARD_W, height: h,
          left: (boxWidth - CARD_W) / 2, top: (h * scale - h) / 2,
          transform: [{ scale }],
        }}
      >
        <ShareCard tall={tall} {...props} />
      </View>
    </View>
  );
};

const BadgeShareSheet = ({ visible, badge, achievement = null, name, quote, onClose }) => {
  const { colors, lang, isDark } = useTheme();
  const [theme, setTheme] = useState('light');
  const [capFmt, setCapFmt] = useState('square');
  const [busy, setBusy] = useState(false);
  const captureRefView = useRef(null);
  const titleRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const shareLink = getShareLabel(lang);

  useEffect(() => {
    if (!visible) return undefined;
    const timeout = setTimeout(() => {
      const nodeHandle = findNodeHandle(titleRef.current);
      if (nodeHandle) AccessibilityInfo.setAccessibilityFocus(nodeHandle);
    }, 250);
    return () => clearTimeout(timeout);
  }, [visible]);

  if (!badge && !achievement) return null;
  const shareTitle = achievement?.rankTitle || (badge ? t(badge.titleKey, lang) : t('career.title', lang));

  const neutral = { bg: colors.surfaceContainerHigh, text: colors.textSecondary };

  const share = async (format) => {
    if (busy) return;
    setCapFmt(format);
    setBusy(true);
    try {
      await new Promise((r) => setTimeout(r, 100));
      const dims = format === 'story' ? { width: 1080, height: 1920 } : { width: 1080, height: 1350 };
      const uri = await captureRef(captureRefView, { format: 'png', quality: 1, ...dims });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: shareTitle });
        trackEvent(ANALYTICS_EVENTS.SHARE_CARD_EXPORTED, {
          kind: achievement?.kind || (achievement ? 'rank' : 'badge'),
          format,
          theme,
          hasStats: Boolean(achievement?.stats),
          badgeId: badge?.id,
        });
      }
    } catch (e) {
      console.warn('Badge share failed:', e?.message);
    } finally {
      setBusy(false);
    }
  };

  const Chip = ({ active, label, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      style={{ flex: 1, minHeight: 44, justifyContent: 'center', alignItems: 'center', borderRadius: 12, paddingVertical: 9, backgroundColor: active ? colors.primary : neutral.bg }}
    >
      <Text style={{ fontFamily: active ? 'Inter_600SemiBold' : 'Inter_500Medium', fontSize: 14, color: active ? colors.onPrimary : neutral.text }}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} transparent animationType={reduceMotion ? 'fade' : 'slide'} onRequestClose={onClose} accessibilityViewIsModal>
      <View style={[st.overlay, { backgroundColor: isDark ? 'rgba(0,0,0,0.66)' : 'rgba(36,33,30,0.56)' }]} testID="badge-share-overlay">
        <Pressable accessible={false} style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={[st.sheet, { backgroundColor: colors.modalSurface }]}>
          <View style={st.handle} />
          <View style={st.headerRow}>
            <Text ref={titleRef} accessible accessibilityRole="header" style={[st.title, { color: colors.text }]}>{t(achievement?.kind === 'weekly' ? 'career.share.weekCta' : achievement ? 'career.share.title' : 'badgeShare.title', lang)}</Text>
            <TouchableOpacity accessibilityRole="button" accessibilityLabel={t('career.close', lang)} onPress={onClose} style={st.closeButton}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={[st.previewWrap, { backgroundColor: colors.surfaceContainerHigh }]}>
<ScaledCard boxWidth={capFmt === 'story' ? 226 : 268} badge={badge} achievement={achievement} theme={theme} lang={lang} name={name} quote={quote} tall={capFmt === 'story'} shareLink={shareLink} />
            </View>

            <Text style={[st.label, { color: colors.textSecondary }]}>{t('badgeShare.format', lang)}</Text>
            <View style={st.row}>
              <Chip active={capFmt === 'square'} label={t('badgeShare.post', lang)} onPress={() => setCapFmt('square')} />
              <Chip active={capFmt === 'story'} label={t('badgeShare.story', lang)} onPress={() => setCapFmt('story')} />
            </View>

            <Text style={[st.label, { color: colors.textSecondary, marginTop: 14 }]}>{t('badgeShare.theme', lang)}</Text>
            <View style={st.row}>
              <Chip active={theme === 'light'} label={t('badgeShare.light', lang)} onPress={() => setTheme('light')} />
              <Chip active={theme === 'dark'} label={t('badgeShare.dark', lang)} onPress={() => setTheme('dark')} />
            </View>

            <TouchableOpacity accessibilityRole="button" accessibilityLabel={t('badgeShare.share', lang)} accessibilityState={{ disabled: busy }} style={[st.shareBtn, { backgroundColor: colors.dawn, marginTop: 22, marginBottom: 8 }, busy && { opacity: 0.6 }]} onPress={() => share(capFmt)} disabled={busy}>
              <Ionicons name="share-social-outline" size={17} color="#2A1E08" />
              <Text style={[st.shareText, { color: '#2A1E08' }]}>{t('badgeShare.share', lang)}</Text>
            </TouchableOpacity>
            {busy ? <ActivityIndicator color={colors.primaryText} style={{ marginTop: 6 }} /> : null}
          </ScrollView>
        </View>
      </View>

      <View style={st.captureHost} pointerEvents="none">
        <View
          ref={captureRefView}
          collapsable={false}
          style={{ width: CARD_W, height: capFmt === 'story' ? CARD_H.story : CARD_H.square }}
        >
          <ShareCard badge={badge} achievement={achievement} theme={theme} lang={lang} name={name} quote={quote} tall={capFmt === 'story'} shareLink={shareLink} />
        </View>
      </View>
    </Modal>
  );
};

const s = StyleSheet.create({
  card: { width: CARD_W, overflow: 'hidden' },
  band: { overflow: 'hidden' },
  sun: { position: 'absolute', right: -30, top: -34 },
  brand: { position: 'absolute', left: 22, top: 18, flexDirection: 'row', alignItems: 'center', gap: 6 },
  brandLogo: { width: 18, height: 18 },
  brandText: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 16, color: '#F5F1E8' },
  emblem: { alignSelf: 'center', borderWidth: 1, padding: 4, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  emblemIcon: { width: '100%', height: '100%', borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  body: { flex: 1, paddingHorizontal: 26, paddingTop: 10, paddingBottom: 8, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  kicker: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 1.2, textAlign: 'center' },
  title: { alignSelf: 'stretch', fontFamily: 'PlayfairDisplay_700Bold', fontSize: 30, lineHeight: 36, textAlign: 'center', marginTop: 6 },
  sub: { fontFamily: 'Inter_600SemiBold', fontSize: 13, textAlign: 'center', marginTop: 3 },
  line: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 19, textAlign: 'center', marginTop: 8 },
  panel: { flexDirection: 'row', alignSelf: 'stretch', borderRadius: 14, paddingVertical: 10, marginTop: 12 },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 22, lineHeight: 26, fontVariant: ['tabular-nums'] },
  statLabel: { fontFamily: 'Inter_500Medium', fontSize: 11, marginTop: 2 },
  date: { fontFamily: 'Inter_500Medium', fontSize: 11, marginTop: 10 },
  quoteWrap: { alignSelf: 'stretch', marginTop: 18, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 14, borderLeftWidth: 3 },
  quote: { fontFamily: 'PlayfairDisplay_400Regular_Italic', fontSize: 14, lineHeight: 20 },
  author: { fontFamily: 'Inter_500Medium', fontSize: 11, marginTop: 6 },
  footer: { borderTopWidth: 1, marginHorizontal: 26, paddingTop: 12, paddingBottom: 18, alignItems: 'center' },
  hook: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 17, lineHeight: 22, textAlign: 'center' },
  link: { fontFamily: 'Inter_500Medium', fontSize: 11, letterSpacing: 0.6, marginTop: 6 },
});

const st = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 18, paddingTop: 10, paddingBottom: 28, maxHeight: '92%' },
  handle: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(128,128,128,0.45)', marginBottom: 10 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  title: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 22 },
  closeButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  previewWrap: { alignItems: 'center', marginVertical: 14, paddingVertical: 18, borderRadius: 20 },
  label: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 0.9, marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  shareBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 14, minHeight: 52 },
  shareText: { fontFamily: 'Inter_700Bold', fontSize: 16 },
  captureHost: { position: 'absolute', top: -10000, left: 0 },
});

export default BadgeShareSheet;

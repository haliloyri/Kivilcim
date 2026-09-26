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

// Shared accent language with the card creator (gold / slate / teal / plum)
const ACCENTS = ['#C89B3C', '#3F5A73', '#2C8068', '#6E3B52'];
const LOGO_LIGHT = require('../../assets/spark_logo.png');
const LOGO_DARK = require('../../assets/spark_logo_dark.png');

const hx = (h) => { h = h.replace('#', ''); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; };
const mix = (c1, c2, t2) => { const a = hx(c1), b = hx(c2); return `rgb(${Math.round(a[0] + (b[0] - a[0]) * t2)},${Math.round(a[1] + (b[1] - a[1]) * t2)},${Math.round(a[2] + (b[2] - a[2]) * t2)})`; };

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

const getShareVisual = ({ badge, achievement }) => {
  if (achievement) {
    const visual = getCareerVisual(achievement.visualKey);
    return { meta: { icon: achievement.icon || visual.icon, colors: visual.light, shareBackground: visual.shareBackground }, image: null };
  }
  return { meta: BADGE_MAP[badge.id] || { icon: 'trophy', colors: ['#C89B3C', '#8C701B'] }, image: BADGE_IMAGES[badge.id] };
};

// Design size of the shareable card. The preview renders the exact same card
// at this size and scales it down, so preview and exported PNG always match
// (fixed font sizes on a smaller preview box used to overflow and overlap).
const CARD_W = 360;
const CARD_H = { square: 450, story: 640 };

// The shareable card — three fixed zones, so nothing can collide:
//   header : eyebrow (path) left · Albor logo pinned top-right
//   body   : small icon chip, big serif title, line, stats panel (+quote in story)
//   footer : hairline, accent hook (max 2 lines), link — own reserved space
const ShareCard = ({ badge, achievement, accent, theme, lang, name, quote, tall, shareLink }) => {
  const dark = theme === 'dark';
  const { meta, image: badgeImage } = getShareVisual({ badge, achievement });
  const { l1, hook, title } = buildLines({ badge, achievement }, name, lang);
  const earnedDate = achievement?.earnedDate ? String(achievement.earnedDate).slice(0, 10) : null;
  const stats = (achievement?.stats || []).filter((stat) => Number(stat.value) > 0);
  const eyebrow = achievement ? (achievement.pathLabel || t('career.title', lang)) : null;

  const bg = dark ? '#15171A' : mix(accent, '#FFFFFF', 0.9);
  const ink = dark ? '#F4F1EA' : '#2E2A22';
  const soft = dark ? '#B9B3A8' : '#6B5A48';
  const faint = dark ? '#7D7870' : '#8C8172';
  const accStrong = dark ? mix(accent, '#FFFFFF', 0.4) : mix(accent, '#000000', 0.12);
  const chipBg = dark ? '#23262B' : '#FFFFFF';
  const iconC = dark ? mix(accent, '#FFFFFF', 0.25) : accent;
  const panelBg = dark ? '#1E2125' : 'rgba(255,255,255,0.62)';
  const hairline = dark ? '#2C3036' : mix(accent, '#FFFFFF', 0.68);

  return (
    <View style={[s.card, { backgroundColor: bg, height: tall ? CARD_H.story : CARD_H.square }]}>
      {/* Header */}
      <View style={s.header}>
        <Text style={[s.eyebrow, { color: accStrong }]} numberOfLines={1}>
          {eyebrow ? eyebrow.toLocaleUpperCase(lang === 'tr' ? 'tr-TR' : undefined) : ''}
        </Text>
        <View style={s.brand}>
          <Image source={dark ? LOGO_DARK : LOGO_LIGHT} style={s.brandLogo} resizeMode="contain" />
          <Text style={[s.brandText, { color: ink }]}>Albor</Text>
        </View>
      </View>

      {/* Body */}
      <View style={[s.body, tall && { justifyContent: 'center' }]}>
        <View style={[s.chip, tall && s.chipTall, { backgroundColor: chipBg, borderWidth: dark ? 1 : 0, borderColor: '#3A3F46' }]}>
          {badgeImage ? (
            <Image source={badgeImage} resizeMode="cover" style={{ width: '100%', height: '100%' }} />
          ) : (
            <Ionicons name={meta.icon} size={26} color={iconC} />
          )}
        </View>

        <Text
          style={[s.title, { color: ink }]}
          numberOfLines={2}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
        >
          {title}
        </Text>
        {achievement?.subLabel ? <Text style={[s.sub, { color: soft }]} numberOfLines={1}>{achievement.subLabel}</Text> : null}

        <Text style={[s.line, { color: soft }]} numberOfLines={stats.length ? 2 : 3}>{l1}</Text>

        {stats.length ? (
          <View style={[s.panel, { backgroundColor: panelBg }]}>
            {stats.map((stat, index) => (
              <View key={stat.label} style={[s.stat, index > 0 && { borderLeftWidth: 1, borderLeftColor: hairline }]}>
                <Text style={[s.statValue, { color: ink }]}>{String(stat.value)}</Text>
                <Text style={[s.statLabel, { color: faint }]} numberOfLines={1}>{stat.label}</Text>
              </View>
            ))}
          </View>
        ) : earnedDate ? (
          <Text style={[s.date, { color: faint }]}>{t('career.share.earnedDate', lang, { date: earnedDate })}</Text>
        ) : null}

        {tall && quote ? (
          <View style={[s.quoteWrap, { borderLeftColor: accent }]}>
            <Text style={[s.quote, { color: soft }]} numberOfLines={4}>{`“${quote.q}”`}</Text>
            <Text style={[s.author, { color: faint }]}>{`— ${quote.a}`}</Text>
          </View>
        ) : null}
      </View>

      {/* Footer */}
      <View style={[s.footer, { borderTopColor: hairline }]}>
        <Text
          style={[s.hook, { color: accStrong }]}
          numberOfLines={2}
          adjustsFontSizeToFit
          minimumFontScale={0.8}
        >
          {hook}
        </Text>
        {shareLink ? <Text style={[s.link, { color: faint }]}>{shareLink}</Text> : null}
      </View>
    </View>
  );
};

// Preview = the real card at design size, scaled to fit `boxWidth`.
const ScaledCard = ({ boxWidth, tall, ...props }) => {
  const h = tall ? CARD_H.story : CARD_H.square;
  const scale = boxWidth / CARD_W;
  return (
    <View style={{ width: boxWidth, height: h * scale, borderRadius: 22, overflow: 'hidden' }}>
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
  const [accent, setAccent] = useState('#C89B3C');
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

  const neutral = isDark
    ? { bg: '#232326', border: '#34343A', text: '#B7B9BE' }
    : { bg: '#F1ECE1', border: '#E4DBCB', text: '#857E6E' };

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
          accent,
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
      style={{ flex: 1, minHeight: 44, justifyContent: 'center', alignItems: 'center', borderRadius: 10, paddingVertical: 9, backgroundColor: active ? colors.primary : neutral.bg }}
    >
      <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12.5, color: active ? colors.onPrimary : neutral.text }}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} transparent animationType={reduceMotion ? 'fade' : 'slide'} onRequestClose={onClose} accessibilityViewIsModal>
      <View style={[st.overlay, { backgroundColor: colors.modalOverlay }]} testID="badge-share-overlay">
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
            <View style={st.previewWrap}>
<ScaledCard boxWidth={capFmt === 'story' ? 226 : 268} badge={badge} achievement={achievement} accent={accent} theme={theme} lang={lang} name={name} quote={quote} tall={capFmt === 'story'} shareLink={shareLink} />
            </View>

            <Text style={[st.label, { color: colors.textSecondary }]}>{t('badgeShare.format', lang)}</Text>
            <View style={st.row}>
              <Chip active={capFmt === 'square'} label={t('badgeShare.post', lang)} onPress={() => setCapFmt('square')} />
              <Chip active={capFmt === 'story'} label={t('badgeShare.story', lang)} onPress={() => setCapFmt('story')} />
            </View>

            <View style={{ flexDirection: 'row', gap: 16, marginTop: 14 }}>
              <View style={{ flex: 1 }}>
                <Text style={[st.label, { color: colors.textSecondary }]}>{t('badgeShare.theme', lang)}</Text>
                <View style={st.row}>
                  <Chip active={theme === 'light'} label={t('badgeShare.light', lang)} onPress={() => setTheme('light')} />
                  <Chip active={theme === 'dark'} label={t('badgeShare.dark', lang)} onPress={() => setTheme('dark')} />
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[st.label, { color: colors.textSecondary }]}>{t('badgeShare.color', lang)}</Text>
                <View style={[st.row, { gap: 10, paddingTop: 4 }]}>
                  {ACCENTS.map((c, index) => (
                    <TouchableOpacity
                      key={c}
                      onPress={() => setAccent(c)}
                      style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: c, borderWidth: accent === c ? 2 : 0, borderColor: colors.text }}
                      accessibilityRole="button"
                      accessibilityLabel={`${t('badgeShare.color', lang)} ${index + 1}`}
                      accessibilityState={{ selected: accent === c }}
                    />
                  ))}
                </View>
              </View>
            </View>

            <TouchableOpacity accessibilityRole="button" accessibilityLabel={t('badgeShare.share', lang)} accessibilityState={{ disabled: busy }} style={[st.shareBtn, { backgroundColor: colors.primary, marginTop: 22, marginBottom: 8 }, busy && { opacity: 0.6 }]} onPress={() => share(capFmt)} disabled={busy}>
              <Ionicons name="share-social-outline" size={16} color={colors.onPrimary} />
              <Text style={[st.shareText, { color: colors.onPrimary }]}>{t('badgeShare.share', lang)}</Text>
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
          <ShareCard badge={badge} achievement={achievement} accent={accent} theme={theme} lang={lang} name={name} quote={quote} tall={capFmt === 'story'} shareLink={shareLink} />
        </View>
      </View>
    </Modal>
  );
};

const s = StyleSheet.create({
  card: { width: CARD_W, paddingHorizontal: 28, paddingTop: 26, paddingBottom: 22 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 22 },
  eyebrow: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 11, letterSpacing: 1.4, marginRight: 12 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  brandLogo: { width: 17, height: 17 },
  brandText: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 15 },
  body: { flex: 1, justifyContent: 'center', paddingVertical: 12, overflow: 'hidden' },
  chipTall: { width: 56, height: 56, borderRadius: 18 },
  chip: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  title: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 36, lineHeight: 42, marginTop: 16 },
  sub: { fontFamily: 'Inter_500Medium', fontSize: 12, marginTop: 4 },
  line: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20, marginTop: 10 },
  panel: { flexDirection: 'row', borderRadius: 16, paddingVertical: 12, marginTop: 18 },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 24, lineHeight: 28, fontVariant: ['tabular-nums'] },
  statLabel: { fontFamily: 'Inter_500Medium', fontSize: 11, marginTop: 2 },
  date: { fontFamily: 'Inter_500Medium', fontSize: 11, marginTop: 12 },
  quoteWrap: { marginTop: 22, borderLeftWidth: 2, paddingLeft: 12 },
  quote: { fontFamily: 'PlayfairDisplay_400Regular_Italic', fontSize: 14, lineHeight: 20 },
  author: { fontFamily: 'Inter_500Medium', fontSize: 11, marginTop: 6 },
  footer: { borderTopWidth: 1, paddingTop: 14 },
  hook: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 19, lineHeight: 24 },
  link: { fontFamily: 'Inter_500Medium', fontSize: 11, letterSpacing: 0.6, marginTop: 8 },
});

const st = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 18, paddingTop: 10, paddingBottom: 28, maxHeight: '92%' },
  handle: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(128,128,128,0.35)', marginBottom: 10 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  title: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 20 },
  closeButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  previewWrap: { alignItems: 'center', marginVertical: 14 },
  label: { fontFamily: 'Inter_500Medium', fontSize: 11, letterSpacing: 0.5, marginBottom: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  shareBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 14, paddingVertical: 13 },
  shareText: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  captureHost: { position: 'absolute', top: -10000, left: 0 },
});

export default BadgeShareSheet;

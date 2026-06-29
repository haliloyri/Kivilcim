import React, { useRef, useState } from 'react';
import {
  View, Text, Modal, Pressable, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import Constants from 'expo-constants';
import { useTheme } from '../context/ThemeContext';
import { t } from '../locales/i18n';
import { BADGE_MAP } from './BadgeIcon';

// First line per badge (TR). {ad} = user name. EN uses a generic fallback.
const BADGE_LINE1_TR = {
  first_read:     '{ad} ilk hikâyesini okudu.',
  explorer:       '{ad} 10 hikâye okuyup Kaşif oldu.',
  sage:           '{ad} 25 hikâyeyle Bilge oldu.',
  bookworm:       '{ad} 50 hikâye devirdi.',
  streak_7:       '{ad} 7 gün hiç aksatmadı.',
  cat_variety_3:  '{ad} 3 farklı konuya daldı.',
  cat_variety_5:  '{ad} 5 farklı alanı keşfetti.',
  cat_variety_10: '{ad} 10 farklı konuda ufkunu açtı.',
  cat_master_5:   '{ad} bir konuda derinleşti.',
  cat_master_10:  '{ad} bir konuda ustalaştı.',
  cat_master_25:  '{ad} bir konunun otoritesi oldu.',
  cat_master_50:  '{ad} bir konuda usta oldu.',
  cat_master_100: '{ad} bir konuda efsane oldu.',
  philosopher:    '{ad} derin sorular sormaya başladı.',
  save_5:         '{ad} en sevdiği fikirleri biriktirdi.',
  save_10:        '{ad} bir fikir koleksiyonu kurdu.',
  save_50:        '{ad} koca bir arşiv oluşturdu.',
  save_100:       '{ad} dev bir kütüphane kurdu.',
  share_1:        '{ad} öğrendiğini paylaştı.',
  share_10:       '{ad} fikirleri yaymaya başladı.',
  share_20:       '{ad} ilhamı başkalarına taşıdı.',
  share_30:       '{ad} bir fikir yayıcısı oldu.',
  share_50:       '{ad} ışığı çoğalttı.',
  storyteller:    '{ad} bir fikri gerçek sohbete taşıdı.',
  icebreaker:     '{ad} buzları tek soruyla kırdı.',
};

// Shared accent language with the card creator (gold / slate / teal / plum)
const ACCENTS = ['#C89B3C', '#3F5A73', '#2C8068', '#6E3B52'];
const LOGO_LIGHT = require('../../assets/spark_logo.png');
const LOGO_DARK = require('../../assets/spark_logo_dark.png');

// Where people who see a shared card can find the app.
// Set in app.json -> expo.extra.shareLink (store URL, landing page, or @handle).
const SHARE_LINK =
  Constants.expoConfig?.extra?.shareLink ??
  Constants.manifest?.extra?.shareLink ??
  '';

const hx = (h) => { h = h.replace('#', ''); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; };
const mix = (c1, c2, t2) => { const a = hx(c1), b = hx(c2); return `rgb(${Math.round(a[0] + (b[0] - a[0]) * t2)},${Math.round(a[1] + (b[1] - a[1]) * t2)},${Math.round(a[2] + (b[2] - a[2]) * t2)})`; };

const buildLines = (badge, name, lang) => {
  const title = t(badge.titleKey, lang) || badge.titleKey;
  const nameStr = (name || '').trim() || (lang === 'tr' ? 'Bir okur' : 'A reader');
  let l1;
  if (lang === 'tr') l1 = (BADGE_LINE1_TR[badge.id] || '{ad} bir rozet kazandı.').replace('{ad}', nameStr);
  else l1 = `${nameStr} earned the ${title} badge.`;
  let hook;
  if (badge.id === 'first_read') hook = lang === 'tr' ? 'İlk kıvılcımı sen çak.' : 'Spark yours now.';
  else if (badge.id === 'streak_7') hook = lang === 'tr' ? 'Seriyi sen başlat.' : 'Start your streak.';
  else hook = lang === 'tr' ? `Sıradaki ${title} sensin.` : `You're next.`;
  return { l1, hook, title };
};

// The shareable card. `tall` = story (9:16) — shows the quote; square hides it.
const ShareCard = ({ badge, accent, theme, lang, name, quote, tall }) => {
  const dark = theme === 'dark';
  const meta = BADGE_MAP[badge.id] || { icon: 'trophy', colors: ['#C89B3C', '#8C701B'] };
  const { l1, hook, title } = buildLines(badge, name, lang);

  const bg = dark ? '#15171A' : mix(accent, '#FFFFFF', 0.88);
  const nameC = dark ? '#FFFFFF' : '#2E2A22';
  const l1C = dark ? '#B9B3A8' : '#6B5A48';
  const accStrong = dark ? mix(accent, '#FFFFFF', 0.4) : mix(accent, '#000000', 0.1);
  const circleBg = dark ? '#23262B' : '#FFFFFF';
  const iconC = dark ? mix(accent, '#FFFFFF', 0.25) : accent;
  const quoteC = dark ? '#9AA6B0' : '#5E6E7C';
  const authorC = dark ? '#6F7B85' : '#8295A4';

  const iconSize = tall ? 42 : 48;
  const titleSize = tall ? 26 : 30;
  const hookSize = tall ? 17 : 19;
  const logoSize = tall ? 16 : 18;
  const sigSize = tall ? 13 : 15;

  return (
    <View style={[s.card, { backgroundColor: bg, paddingHorizontal: tall ? 26 : 30 }]}>
      {/* Sağ üst: marka — bir satır boşlukla başlar */}
      <View style={s.sigRow}>
        <Image
          source={dark ? LOGO_DARK : LOGO_LIGHT}
          style={{ width: logoSize, height: logoSize, marginTop: 2 }}
          resizeMode="contain"
        />
        <Text style={[s.sig, { color: nameC, fontSize: sigSize }]}>Albor</Text>
      </View>

      {/* İçerik merkezi */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View style={[s.circle, { backgroundColor: circleBg, borderWidth: dark ? 1 : 0, borderColor: '#3A3F46' }]}>
          <Ionicons name={meta.icon} size={iconSize} color={iconC} />
        </View>
        <Text
          style={[s.name, { color: nameC, fontSize: titleSize }]}
          adjustsFontSizeToFit
          numberOfLines={2}
          minimumFontScale={0.65}
        >
          {title}
        </Text>
        <Text style={[s.l1, { color: l1C }]}>{l1}</Text>
        <Text style={[s.hook, { color: accStrong, fontSize: hookSize }]}>{hook}</Text>
        {tall && quote ? (
          <View style={{ marginTop: 18, paddingHorizontal: 4 }}>
            <Text style={[s.quote, { color: quoteC }]}>{`”${quote.q}”`}</Text>
            <Text style={[s.author, { color: authorC }]}>{`— ${quote.a}`}</Text>
          </View>
        ) : null}
      </View>

      {/* Alt: uygulama erişim adresi */}
      <View style={{ height: 40, alignItems: 'center', justifyContent: 'center' }}>
        {SHARE_LINK ? (
          <Text style={[s.link, { color: dark ? '#8C8579' : authorC }]}>{SHARE_LINK}</Text>
        ) : null}
      </View>
    </View>
  );
};

const BadgeShareSheet = ({ visible, badge, name, quote, onClose }) => {
  const { colors, lang, isDark } = useTheme();
  const [theme, setTheme] = useState('light');
  const [accent, setAccent] = useState('#C89B3C');
  const [capFmt, setCapFmt] = useState('square');
  const [busy, setBusy] = useState(false);
  const captureRefView = useRef(null);

  if (!badge) return null;

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
        await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: t(badge.titleKey, lang) || badge.titleKey });
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
      style={{ flex: 1, alignItems: 'center', borderRadius: 10, paddingVertical: 9, backgroundColor: active ? colors.primary : neutral.bg }}
    >
      <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12.5, color: active ? colors.onPrimary : neutral.text }}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={st.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={[st.sheet, { backgroundColor: colors.background }]}>
          <View style={st.handle} />
          <View style={st.headerRow}>
            <Text style={[st.title, { color: colors.text }]}>{lang === 'tr' ? 'Rozetini paylaş' : 'Share your badge'}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={st.previewWrap}>
              <View style={{ width: capFmt === 'story' ? 226 : 268, height: capFmt === 'story' ? 402 : 335, borderRadius: 22, overflow: 'hidden' }}>
                <ShareCard badge={badge} accent={accent} theme={theme} lang={lang} name={name} quote={quote} tall={capFmt === 'story'} />
              </View>
            </View>

            <Text style={[st.label, { color: colors.textSecondary }]}>{lang === 'tr' ? 'FORMAT' : 'FORMAT'}</Text>
            <View style={st.row}>
              <Chip active={capFmt === 'square'} label={lang === 'tr' ? 'Gönderi' : 'Post'} onPress={() => setCapFmt('square')} />
              <Chip active={capFmt === 'story'} label={lang === 'tr' ? 'Hikaye' : 'Story'} onPress={() => setCapFmt('story')} />
            </View>

            <View style={{ flexDirection: 'row', gap: 16, marginTop: 14 }}>
              <View style={{ flex: 1 }}>
                <Text style={[st.label, { color: colors.textSecondary }]}>{lang === 'tr' ? 'TEMA' : 'THEME'}</Text>
                <View style={st.row}>
                  <Chip active={theme === 'light'} label={lang === 'tr' ? 'Açık' : 'Light'} onPress={() => setTheme('light')} />
                  <Chip active={theme === 'dark'} label={lang === 'tr' ? 'Koyu' : 'Dark'} onPress={() => setTheme('dark')} />
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[st.label, { color: colors.textSecondary }]}>{lang === 'tr' ? 'RENK' : 'COLOR'}</Text>
                <View style={[st.row, { gap: 10, paddingTop: 4 }]}>
                  {ACCENTS.map((c) => (
                    <TouchableOpacity
                      key={c}
                      onPress={() => setAccent(c)}
                      style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: c, borderWidth: accent === c ? 2 : 0, borderColor: colors.text }}
                      accessibilityRole="button"
                    />
                  ))}
                </View>
              </View>
            </View>

            <TouchableOpacity style={[st.shareBtn, { backgroundColor: colors.primary, marginTop: 22, marginBottom: 8 }, busy && { opacity: 0.6 }]} onPress={() => share(capFmt)} disabled={busy}>
              <Ionicons name="share-social-outline" size={16} color={colors.onPrimary} />
              <Text style={[st.shareText, { color: colors.onPrimary }]}>{lang === 'tr' ? 'Paylaş' : 'Share'}</Text>
            </TouchableOpacity>
            {busy ? <ActivityIndicator color={colors.primary} style={{ marginTop: 6 }} /> : null}
          </ScrollView>
        </View>
      </View>

      <View style={st.captureHost} pointerEvents="none">
        <View
          ref={captureRefView}
          collapsable={false}
          style={capFmt === 'story' ? { width: 360, height: 640 } : { width: 360, height: 450 }}
        >
          <ShareCard badge={badge} accent={accent} theme={theme} lang={lang} name={name} quote={quote} tall={capFmt === 'story'} />
        </View>
      </View>
    </Modal>
  );
};

const s = StyleSheet.create({
  card: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', paddingTop: 20, paddingBottom: 0, position: 'relative' },
  circle: { width: 90, height: 90, borderRadius: 45, alignItems: 'center', justifyContent: 'center' },
  name: { fontFamily: 'PlayfairDisplay_700Bold', marginTop: 14, textAlign: 'center', paddingHorizontal: 4 },
  l1: { fontFamily: 'Inter_400Regular', fontSize: 13.5, lineHeight: 19, textAlign: 'center', marginTop: 10, paddingHorizontal: 6 },
  hook: { fontFamily: 'PlayfairDisplay_700Bold', lineHeight: 24, textAlign: 'center', marginTop: 6 },
  quote: { fontFamily: 'PlayfairDisplay_400Regular_Italic', fontSize: 13, lineHeight: 19, textAlign: 'center' },
  author: { fontFamily: 'Inter_500Medium', fontSize: 11, textAlign: 'center', marginTop: 6 },
  sigRow: { alignSelf: 'flex-end', flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 20 },
  sig: { fontFamily: 'PlayfairDisplay_700Bold' },
  link: { fontFamily: 'Inter_500Medium', fontSize: 12, letterSpacing: 0.5 },
});

const st = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 18, paddingTop: 10, paddingBottom: 28, maxHeight: '92%' },
  handle: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(128,128,128,0.35)', marginBottom: 10 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  title: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 20 },
  previewWrap: { alignItems: 'center', marginVertical: 14 },
  label: { fontFamily: 'Inter_500Medium', fontSize: 11, letterSpacing: 0.5, marginBottom: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  shareBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 14, paddingVertical: 13 },
  shareText: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  captureHost: { position: 'absolute', top: -10000, left: 0 },
});

export default BadgeShareSheet;

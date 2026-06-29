/**
 * ShareCardModal
 *
 * The "Create card" (Kart oluştur) bottom-sheet modal: lets the user pick
 * content (quote/lesson/reflection/hook), theme, and format (post/story/reel),
 * previews the share card, and either shares a single PNG or saves a carousel
 * of frames to the gallery.
 *
 * It is fully self-contained so it can be rendered from ANY screen (StoryDetail,
 * Use-in-Conversation, …) without navigating away — the host screen stays in
 * the background.
 *
 * Props:
 *   visible              {boolean}
 *   onClose              {function}
 *   story                {object}   localized story (title/body/quote/lesson/hook/source_book/cat)
 *   lang                 {string}   UI language
 *   localLang            {string}   content language (defaults to lang)
 *   initialContent       {string[]} e.g. ['quote'] or a preset like ['lesson']
 *   initialFormat        {string}   'post' | 'story' | 'reel'
 *   initialOverrideText  {string}   optional override for the single selected content
 *   shareSource          {string}   analytics source tag
 */
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Image,
  ActivityIndicator, Alert, Modal, Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';
import { LinearGradient } from 'expo-linear-gradient';
import * as Sharing from 'expo-sharing';
import * as Clipboard from 'expo-clipboard';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useTheme } from '../context/ThemeContext';
import { useUserData } from '../context/UserDataContext';
import { t } from '../locales/i18n';
import { ANALYTICS_EVENTS, trackEvent } from '../utils/analytics';

const { width } = Dimensions.get('window');

// Where people who see a share card can find the app. Set in
// app.json -> expo.extra.shareLink (store URL, landing page, or @handle).
const SHARE_LINK =
  Constants.expoConfig?.extra?.shareLink ??
  Constants.manifest?.extra?.shareLink ??
  '';

// Brand logo (book + star + "Albor" wordmark). Dark variant has the cream
// wordmark for dark card backgrounds; light variant has the ink wordmark.
const LOGO_LIGHT_BG = require('../../assets/spark_logo.png');
const LOGO_DARK_BG = require('../../assets/spark_logo_dark.png');

const CAROUSEL_ORDER = ['hook', 'lesson', 'quote', 'reflection'];

const ShareCardModal = ({
  visible,
  onClose,
  story,
  lang = 'tr',
  localLang,
  initialContent,
  initialFormat = 'post',
  initialOverrideText = '',
  shareSource = 'story_detail',
}) => {
  const { colors, typography, layout, isDark } = useTheme();
  const { incrementShareCount } = useUserData();
  const insets = useSafeAreaInsets();
  const cLang = localLang || lang;

  const [shareTheme, setShareTheme] = useState('dark');
  const [shareContent, setShareContent] = useState(initialContent || ['quote']);
  const [shareFormat, setShareFormat] = useState(initialFormat);
  const [shareTextOverride, setShareTextOverride] = useState(initialOverrideText);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isSavingCarousel, setIsSavingCarousel] = useState(false);

  const viewShotRef = useRef();
  const carouselRefs = useRef({});

  // Re-seed from props each time the sheet opens so presets/overrides apply.
  useEffect(() => {
    if (!visible) return;
    setShareContent(initialContent && initialContent.length ? initialContent : ['quote']);
    setShareFormat(initialFormat || 'post');
    setShareTextOverride(initialOverrideText || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  // --- Derived display fields ------------------------------------------
  const displayTitle = story?.title || '';
  const displayBody = story?.body || '';
  const displayQuote = story?.quote || '';
  const displayLesson = story?.lesson || '';
  const displaySourceBook = story?.source_book || '';
  const displayCat = t(story?.cat_display || story?.cat || '', cLang);
  const displayHook = story?.hook || '';

  // --- Share card theme configs (unified with BadgeShareSheet) ----------
  const SHARE_THEMES = [
    { id: 'dark', label: t('themeInk', lang), bg: ['#14120E', '#211C14'], text: '#F2EAD8', accent: '#E5C27A', sub: '#A6977C' },
    { id: 'light', label: t('themePaper', lang), bg: ['#F7F2E8', '#ECE4D5'], text: '#1A1208', accent: '#A86A1C', sub: '#6B5A48' },
    { id: 'gold', label: t('themeGold', lang), bg: ['#4A3A16', '#6B5320'], text: '#FFF7E6', accent: '#F0D9A0', sub: 'rgba(255,247,230,0.78)' },
    { id: 'slate', label: t('themeSlate', lang), bg: ['#29384A', '#41566E'], text: '#FFFFFF', accent: '#B8C8D8', sub: 'rgba(255,255,255,0.8)' },
    { id: 'forest', label: t('themeForest', lang), bg: ['#1C3F35', '#2C6E5A'], text: '#FFFFFF', accent: '#A8D8C5', sub: 'rgba(255,255,255,0.8)' },
    { id: 'plum', label: t('themePlum', lang), bg: ['#3E2433', '#6E3B52'], text: '#FFFFFF', accent: '#E6B8CC', sub: 'rgba(255,255,255,0.8)' },
  ];
  const currentTheme = SHARE_THEMES.find(th => th.id === shareTheme) || SHARE_THEMES[0];

  const extractContent = (markerStr) => {
    if (!displayBody) return '';
    const startIdx = displayBody.indexOf(markerStr);
    if (startIdx === -1) return '';
    const bodySegment = displayBody.substring(startIdx + markerStr.length);
    let nextMarkerIdx = bodySegment.length;
    ['##', '$$', '&&'].forEach(m => {
      const id = bodySegment.indexOf(m);
      if (id !== -1 && id < nextMarkerIdx) nextMarkerIdx = id;
    });
    return bodySegment.substring(0, nextMarkerIdx).trim();
  };

  const getShareText = (type) => {
    if (shareTextOverride && shareContent.length === 1 && shareContent[0] === type) {
      return shareTextOverride;
    }
    if (type === 'quote') {
      const ext = extractContent('##');
      return ext || displayQuote || displayBody.substring(0, 150) + '...';
    }
    if (type === 'lesson') {
      const ext = extractContent('$$');
      return ext || displayLesson || t('keyTakeaway', cLang);
    }
    if (type === 'reflection') {
      const ext = extractContent('&&');
      return ext || t('share_realize', cLang);
    }
    if (type === 'hook') return displayHook;
    return '';
  };

  const getCTAByLang = () => {
    if (cLang === 'en') {
      return [
        'Save this and tag a friend who needs this today.',
        'Follow Albor for daily actionable wisdom.',
        'Try this insight today and share your result.',
      ];
    }
    if (cLang === 'es') {
      return [
        'Guarda esto y etiqueta a alguien que lo necesite hoy.',
        'Sigue a Albor para sabiduria diaria accionable.',
        'Prueba esta idea hoy y comparte tu resultado.',
      ];
    }
    if (cLang === 'de') {
      return [
        'Speichere das und markiere jemanden, der das heute braucht.',
        'Folge Albor fur tagliche, umsetzbare Impulse.',
        'Teste diese Erkenntnis heute und teile dein Ergebnis.',
      ];
    }
    return [
      'Bunu kaydet ve bugun ihtiyaci olan birini etiketle.',
      'Her gun uygulanabilir bilgelik icin Albor\'u takip et.',
      'Bu fikri bugun dene, sonucunu paylas.',
    ];
  };

  const buildHashtags = () => {
    const catHashtag = displayCat.replace(/[^\p{L}\p{N}]/gu, '');
    const generalHashtags = cLang === 'en'
      ? '#Albor #DailyInspiration #BookWisdom #Mindset'
      : cLang === 'es'
        ? '#Albor #InspiracionDiaria #Sabiduria #Mentalidad'
        : cLang === 'de'
          ? '#Albor #TaeglicheInspiration #Buchimpulse #Mindset'
          : '#Albor #gununilhami #kitapbilgeligi #farkindalik';
    return `#${catHashtag} ${generalHashtags}`;
  };

  const buildSharePayload = () => {
    const selectedTexts = shareContent
      .map(type => {
        const text = getShareText(type);
        if (!text) return '';
        if (type === 'lesson') return `${t('share_key_takeaway', cLang)}\n${text}`;
        if (type === 'reflection') return `${t('share_reflect', cLang)}\n${text}`;
        if (type === 'hook') return `🎬 Hook\n${text}`;
        return text;
      })
      .filter(Boolean)
      .join('\n\n');

    const ctas = getCTAByLang();
    const hashtags = buildHashtags();
    const caption = `${displayTitle}\n\n${selectedTexts}\n\n${ctas[0]}\n${hashtags}`;

    const reelScript = `${displayTitle}\n\n` +
      `1) ${t('reel_label_hook', cLang)}: ${displayHook || getShareText('quote')}\n` +
      `2) ${t('reel_label_main', cLang)}: ${getShareText('lesson') || getShareText('quote')}\n` +
      `3) ${t('reel_label_question', cLang)}: ${getShareText('reflection') || t('share_realize', cLang)}\n` +
      `4) ${t('reel_label_cta', cLang)}: ${ctas[1]}\n` +
      `5) ${t('reel_label_bonus', cLang)}: ${ctas[2]}`;

    return { caption, reelScript };
  };

  const onShare = async () => {
    if (isCapturing || isSavingCarousel) return;
    setIsCapturing(true);
    try {
      const uri = await captureRef(viewShotRef, { format: 'png', quality: 1 });
      const { caption, reelScript } = buildSharePayload();
      const clipboardPayload = shareFormat === 'reel'
        ? `${caption}\n\n----- ${t('reel_script_divider', cLang)} -----\n${reelScript}`
        : caption;
      try {
        await Clipboard.setStringAsync(clipboardPayload);
        Alert.alert(
          t('share_copied_title', cLang),
          t(shareFormat === 'reel' ? 'share_copied_body' : 'share_copied_body_story', cLang),
          [{ text: t('alert_ok', cLang), style: 'default' }]
        );
      } catch (err) {
        console.warn('Clipboard copy failed', err);
      }
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: `${displayTitle} — ${t('brandText', lang)}`,
        });
        incrementShareCount?.();
        trackEvent(ANALYTICS_EVENTS.STORY_SHARED, {
          source: shareSource,
          storyId: story?.story_id,
          shareFormat,
          shareContent,
          lang: cLang,
        });
      } else {
        Alert.alert(t('alert_error', lang), t('alert_share_unavailable', lang));
      }
    } catch (error) {
      console.error('Paylaşım hatası:', error);
      Alert.alert(t('alert_error', lang), t('alert_share_error', lang));
    } finally {
      setIsCapturing(false);
    }
  };

  const getCarouselFrames = () =>
    [...shareContent].sort((a, b) => CAROUSEL_ORDER.indexOf(a) - CAROUSEL_ORDER.indexOf(b));

  const onSaveCarousel = async () => {
    if (isCapturing || isSavingCarousel) return;
    setIsSavingCarousel(true);
    try {
      const perm = await MediaLibrary.requestPermissionsAsync(true);
      if (!perm.granted) {
        Alert.alert(
          t('alert_error', lang),
          t('alert_media_permission', cLang),
          [{ text: t('alert_ok', cLang), style: 'default' }]
        );
        return;
      }
      const frames = getCarouselFrames();
      let saved = 0;
      for (const type of frames) {
        const ref = carouselRefs.current[type];
        if (!ref) continue;
        const uri = await captureRef(ref, { format: 'png', quality: 1 });
        await MediaLibrary.saveToLibraryAsync(uri);
        saved += 1;
      }
      try {
        const { caption } = buildSharePayload();
        await Clipboard.setStringAsync(caption);
      } catch (err) {
        console.warn('Clipboard copy failed', err);
      }
      Alert.alert(
        t('carousel_saved_title', cLang),
        `${saved} ${t('carousel_saved_body', cLang)}`,
        [{ text: t('alert_ok', cLang), style: 'default' }]
      );
      incrementShareCount?.();
      trackEvent(ANALYTICS_EVENTS.STORY_SHARED, {
        source: `${shareSource}_carousel`,
        storyId: story?.story_id,
        shareFormat,
        shareContent: frames,
        frameCount: saved,
        lang: cLang,
      });
    } catch (error) {
      console.error('Carousel kaydetme hatası:', error);
      Alert.alert(t('alert_error', lang), t('alert_share_error', lang));
    } finally {
      setIsSavingCarousel(false);
    }
  };

  // --- Render the share card (identical in preview & capture) -----------
  const renderShareCard = (contentTypes = shareContent) => {
    const th = currentTheme;
    const isPost = shareFormat === 'post';
    const cardW = 1080;
    const cardH = isPost ? 1080 : 1920;
    const fTitle = 68;
    const fQuote = 50;
    const fSrc = 32;
    const fFooter = 28;
    const padHorizontal = 80;
    const paddingTop = isPost ? 90 : 140;
    const paddingBottom = isPost ? 90 : 160;
    const borderW = 10;

    return (
      <View style={{ width: cardW, height: cardH, overflow: 'hidden', backgroundColor: th.bg[0], flexDirection: 'column' }}>
        <LinearGradient colors={th.bg} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[StyleSheet.absoluteFill]} />
        <View style={{ flex: 1, justifyContent: 'space-between', paddingHorizontal: padHorizontal, paddingTop, paddingBottom }}>
          {/* Header (Logo) — real brand mark, theme-aware */}
          <View style={{ alignSelf: 'flex-start', borderBottomWidth: 4, borderBottomColor: th.accent, paddingBottom: 16 }}>
            <Image
              source={th.id === 'light' ? LOGO_LIGHT_BG : LOGO_DARK_BG}
              style={{ width: 200, height: 200 }}
              resizeMode="contain"
            />
          </View>

          {/* Content zone — vertically centered */}
          <View style={{ flex: 1, justifyContent: 'center', paddingVertical: 60 }}>
            {contentTypes.map((type, index) => {
              const label = type === 'lesson' ? t('share_key_takeaway', cLang) :
                type === 'reflection' ? t('share_reflect', cLang) :
                  type === 'hook' ? '' : displayTitle;
              const textContent = getShareText(type);
              const dynTitle = contentTypes.length > 1 ? fTitle * 0.8 : fTitle;
              const dynQuote = contentTypes.length > 1 ? fQuote * 0.8 : fQuote;

              if (type === 'hook') {
                return (
                  <View key={type} style={{ marginBottom: index === contentTypes.length - 1 ? 0 : 80 }}>
                    <Text style={{ fontFamily: 'PlayfairDisplay_700Bold', fontSize: dynQuote * 1.1, color: th.text, lineHeight: dynQuote * 1.7, textAlign: 'center', letterSpacing: 1 }}>
                      {textContent}
                    </Text>
                    <View style={{ width: 120, height: 4, backgroundColor: th.accent, alignSelf: 'center', marginTop: 40, borderRadius: 2 }} />
                  </View>
                );
              }

              return (
                <View key={type} style={{ marginBottom: index === contentTypes.length - 1 ? 0 : 80 }}>
                  <Text style={{ fontFamily: 'PlayfairDisplay_700Bold', fontSize: dynTitle, color: th.text, lineHeight: dynTitle * 1.4, marginBottom: 32 }}>
                    {label}
                  </Text>
                  <View style={{ borderLeftWidth: borderW, borderLeftColor: th.accent, paddingLeft: 30, marginBottom: 20 }}>
                    <Text style={{ fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: dynQuote, color: th.sub, lineHeight: dynQuote * 1.6 }}>
                      "{textContent}"
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Footer strip — source + CTA + access link */}
          <View>
            <View style={{ height: 3, backgroundColor: th.accent, opacity: 0.45, borderRadius: 2, marginBottom: 28 }} />
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', flex: 1, marginRight: 24 }}>
                <Ionicons name="book-outline" size={fSrc + 2} color={th.sub} style={{ marginTop: 4 }} />
                <Text style={{ fontFamily: 'Inter_500Medium', fontSize: fSrc, color: th.sub, textTransform: 'uppercase', letterSpacing: 2, marginLeft: 10, flexShrink: 1 }} numberOfLines={2}>
                  {t('share_source', cLang)}{displaySourceBook}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontFamily: 'Inter_500Medium', fontSize: fSrc, color: th.accent, letterSpacing: 1 }}>
                  {t('card_cta_short', cLang)} ✦
                </Text>
                {SHARE_LINK ? (
                  <Text style={{ fontFamily: 'Inter_500Medium', fontSize: fFooter, color: th.sub, letterSpacing: 1, marginTop: 8 }}>
                    {SHARE_LINK}
                  </Text>
                ) : null}
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const styles = makeStyles({ colors, isDark, layout, typography, insets });

  return (
    <>
      <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('createCard', lang)}</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={22} color={colors.text} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSub}>{t('shareOnInstagram', lang)}</Text>

            <ScrollView showsVerticalScrollIndicator={false} style={{ flexShrink: 1, marginBottom: 16 }}>
              {/* Card preview */}
              <View style={[styles.shareCardWrapper, {
                width: width - 80,
                height: (shareFormat === 'post' ? 1080 : 1920) * ((width - 80) / 1080),
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent',
              }]}>
                <View style={{ width: 1080, height: shareFormat === 'post' ? 1080 : 1920, transform: [{ scale: (width - 80) / 1080 }] }}>
                  {renderShareCard()}
                </View>
              </View>

              {/* Content type pills */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.contentPillsRow}>
                {[
                  { id: 'quote', label: t('quote_label', lang) },
                  { id: 'lesson', label: t('lesson_pill', lang) },
                  { id: 'reflection', label: t('reflect_pill', lang) },
                  ...(displayHook ? [{ id: 'hook', label: '🎬 Hook' }] : []),
                ].map(ct => (
                  <TouchableOpacity
                    key={ct.id}
                    style={[styles.contentPill, shareContent.includes(ct.id) && styles.contentPillActive]}
                    onPress={() => {
                      if (shareFormat === 'story' || shareFormat === 'reel') {
                        setShareContent(prev => {
                          if (prev.includes(ct.id)) return prev.length > 1 ? prev.filter(id => id !== ct.id) : prev;
                          return [...prev, ct.id];
                        });
                      } else {
                        setShareContent([ct.id]);
                      }
                    }}
                  >
                    <Text style={[styles.contentPillText, shareContent.includes(ct.id) && styles.contentPillTextActive]}>
                      {ct.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Theme swatches */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.themeToggle}>
                {SHARE_THEMES.map(th => (
                  <TouchableOpacity key={th.id} onPress={() => setShareTheme(th.id)}>
                    <LinearGradient colors={th.bg} style={[styles.themeSwatch, shareTheme === th.id && styles.themeSwatchActive]} />
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Format selector */}
              <View style={styles.formatRow}>
                <TouchableOpacity
                  style={[styles.formatBtn, shareFormat === 'post' && styles.formatBtnActive]}
                  onPress={() => {
                    setShareFormat('post');
                    if (shareContent.length > 1) setShareContent([shareContent[0]]);
                  }}
                >
                  <Text style={[styles.formatBtnText, shareFormat === 'post' && styles.formatBtnTextActive]}>{t('format_post', lang)}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.formatBtn, shareFormat === 'story' && styles.formatBtnActive]}
                  onPress={() => setShareFormat('story')}
                >
                  <Text style={[styles.formatBtnText, shareFormat === 'story' && styles.formatBtnTextActive]}>{t('format_story', lang)}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.formatBtn, shareFormat === 'reel' && styles.formatBtnActive]}
                  onPress={() => setShareFormat('reel')}
                >
                  <Text style={[styles.formatBtnText, shareFormat === 'reel' && styles.formatBtnTextActive]}>{t('format_reel', lang)}</Text>
                  <View style={styles.reelBadge}>
                    <Text style={styles.reelBadgeText}>{t('reel_badge', lang)}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>

            {/* Share button */}
            <TouchableOpacity onPress={onShare} disabled={isCapturing || isSavingCarousel} activeOpacity={0.85}>
              <LinearGradient
                colors={[colors.ctaGradientStart, colors.ctaGradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.btnPrimaryGradient, (isCapturing || isSavingCarousel) && { opacity: 0.7 }]}
              >
                <View style={[styles.btnPrimary, { flexDirection: 'row', gap: 10 }]}>
                  {isCapturing && <ActivityIndicator size="small" color="#F7F3EB" />}
                  <Text style={styles.btnPrimaryText}>{t('saveAndShare', lang)}</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Carousel button */}
            {shareContent.length > 1 && (
              <TouchableOpacity
                onPress={onSaveCarousel}
                disabled={isCapturing || isSavingCarousel}
                activeOpacity={0.85}
                style={[styles.carouselBtn, (isCapturing || isSavingCarousel) && { opacity: 0.6 }]}
              >
                {isSavingCarousel
                  ? <ActivityIndicator size="small" color={colors.text} />
                  : <Ionicons name="images-outline" size={20} color={colors.text} />}
                <Text style={styles.carouselBtnText}>
                  {t('saveCarousel', lang)} ({shareContent.length})
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>

      {/* Off-screen capture targets (only while the sheet is open) */}
      {visible && (
        <>
          <View style={{ position: 'absolute', left: -9999, top: -9999 }} pointerEvents="none">
            <View ref={viewShotRef} collapsable={false}>
              {renderShareCard()}
            </View>
          </View>
          <View style={{ position: 'absolute', left: -9999, top: -9999 }} pointerEvents="none">
            {shareContent.map(type => (
              <View key={`frame-${type}`} ref={el => { carouselRefs.current[type] = el; }} collapsable={false}>
                {renderShareCard([type])}
              </View>
            ))}
          </View>
        </>
      )}
    </>
  );
};

const makeStyles = ({ colors, isDark, layout, typography, insets }) => StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: isDark ? colors.overlayDark : 'rgba(18,17,15,0.28)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: Math.max(insets.bottom, 20),
    maxHeight: '92%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  modalTitle: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 20, color: colors.text },
  modalSub: { fontFamily: 'Inter_400Regular', fontSize: 13, color: colors.textSecondary, marginBottom: 16 },
  contentPillsRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  contentPill: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
    backgroundColor: colors.backgroundDark, borderWidth: 1, borderColor: colors.border,
  },
  contentPillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  contentPillText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: colors.textSecondary },
  contentPillTextActive: { color: colors.onPrimary },
  themeToggle: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  themeSwatch: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: 'transparent' },
  themeSwatchActive: { borderColor: colors.primary },
  formatRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  formatBtn: {
    flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center',
    backgroundColor: colors.backgroundDark, borderWidth: 1, borderColor: colors.border,
  },
  formatBtnActive: {
    borderColor: colors.primary,
    backgroundColor: isDark ? 'rgba(181,83,16,0.15)' : 'rgba(181,83,16,0.08)',
  },
  formatBtnText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: colors.textSecondary },
  formatBtnTextActive: { color: colors.primary },
  reelBadge: {
    marginTop: 3, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 6,
    backgroundColor: isDark ? 'rgba(181,83,16,0.22)' : 'rgba(181,83,16,0.10)',
  },
  reelBadgeText: { fontFamily: 'Inter_500Medium', fontSize: 9, color: colors.primary, letterSpacing: 0.3 },
  btnPrimary: {
    borderRadius: layout.radius.button, height: layout.heights.buttonPrimary,
    justifyContent: 'center', alignItems: 'center', width: '100%',
  },
  btnPrimaryGradient: {
    borderRadius: layout.radius.button, height: layout.heights.buttonPrimary,
    justifyContent: 'center', alignItems: 'center', overflow: 'hidden',
  },
  btnPrimaryText: { fontFamily: 'Inter_500Medium', color: '#F7F3EB', fontSize: typography.sizes.ui + 1 },
  carouselBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 10,
    height: layout.heights.buttonPrimary, borderRadius: layout.radius.button,
    borderWidth: 1.5, borderColor: colors.border || 'rgba(0,0,0,0.12)', backgroundColor: 'transparent',
  },
  carouselBtnText: { fontFamily: 'Inter_500Medium', color: colors.text, fontSize: typography.sizes.ui },
  shareCardWrapper: {
    alignSelf: 'center', marginBottom: 14, borderRadius: 12, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 10,
  },
});

export default ShareCardModal;

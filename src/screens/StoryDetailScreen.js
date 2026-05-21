import React, { useState, useRef } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, 
  StatusBar, Animated, Dimensions, Modal, Alert, Linking, ScrollView, Image, Platform 
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import * as Sharing from 'expo-sharing';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useUserData } from '../context/UserDataContext';
import { useStories } from '../context/StoriesContext';
import { t } from '../locales/i18n';
import { getStoryByLang } from '../db/db';
import { getCategoryImage, getCategoryTheme } from '../utils/categoryImages';
import { ANALYTICS_EVENTS, trackEvent } from '../utils/analytics';
import AdOrPremiumSheet from '../components/AdOrPremiumSheet';
import { shouldShowAd, loadRewarded } from '../utils/ads';

const { width, height } = Dimensions.get('window');

const StoryDetailScreen = ({ route, navigation }) => {
  const { story } = route.params;
  const { colors, typography, layout, isDark, lang } = useTheme();
  const { isFavorite, toggleFavorite, addToHistory, isPremium, incrementShareCount, releasePendingBadge, isStorySavedForLater, toggleReadLater, isStoryCompleted, markStoryCompleted } = useUserData();
  const { stories } = useStories();
  const [fontSize, setFontSize] = useState(typography.sizes.body);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [shareTheme, setShareTheme] = useState('dark');
  const [shareContent, setShareContent] = useState(['quote']);
  const [shareFormat, setShareFormat] = useState('post');
  const [shareTextOverride, setShareTextOverride] = useState('');
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const titleEnterAnim = useRef(new Animated.Value(0)).current;
  const hasReachedBottom = useRef(false);
  const viewShotRef = useRef();
  const insets = useSafeAreaInsets();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [localLang, setLocalLang] = useState(lang);
  const [localStory, setLocalStory] = useState(story);
  const [adSheet, setAdSheet] = useState(false);
  const [isAdLoading, setIsAdLoading] = useState(false);
  const [adUnavailable, setAdUnavailable] = useState(false);

  const handleNextWithAd = () => {
    setAdUnavailable(false);
    if (shouldShowAd({ isPremium, isOnboarded: true })) {
      setAdSheet(true);
    } else {
      navigation.navigate('Paywall', { reason: 'free_limit_reached', source: 'story_detail_next' });
    }
  };

  const handleWatchAdNext = async () => {
    setIsAdLoading(true);
    trackEvent(ANALYTICS_EVENTS.AD_OR_PREMIUM_CHOICE, { source: 'story_detail_next', choice: 'ad' });
    const ad = await loadRewarded();
    setIsAdLoading(false);
    if (!ad) {
      setAdUnavailable(true);
      trackEvent(ANALYTICS_EVENTS.AD_FAILED_TO_LOAD, { source: 'story_detail_next', lang });
      return;
    }
    setAdUnavailable(false);
    setAdSheet(false);
    const { RewardedAdEventType } = require('react-native-google-mobile-ads');
    ad.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
      trackEvent(ANALYTICS_EVENTS.REWARDED_AD_COMPLETED, { source: 'story_detail_next' });
    });
    ad.show().catch(e => console.warn('[StoryDetail] rewarded show error:', e?.message));
  };

  React.useEffect(() => {
    let active = true;
    if (localLang !== lang) {
      const fetchTranslation = async () => {
        const tr = await getStoryByLang(story.story_id, localLang);
        if (active && tr) setLocalStory(old => ({ ...old, title: tr.title, body: tr.body, source_book: tr.source_book, cat_display: tr.cat_display, cat: tr.cat }));
      };
      fetchTranslation();
    } else {
      setLocalStory(story);
    }
    return () => { active = false; };
  }, [localLang, story, lang]);

  React.useEffect(() => {
    if (!route.params?.openShareModal) return;

    const preset = route.params?.sharePreset;
    const overrideText = typeof route.params?.shareOverrideText === 'string'
      ? route.params.shareOverrideText.trim()
      : '';

    if (preset) {
      setShareContent([preset]);
    }
    setShareTextOverride(overrideText);
    setShareFormat('post');
    setShareModalVisible(true);

    navigation.setParams({
      openShareModal: false,
      sharePreset: undefined,
      shareOverrideText: undefined,
      shareSource: undefined,
      shareVariantType: undefined,
    });
  }, [
    navigation,
    route.params?.openShareModal,
    route.params?.sharePreset,
    route.params?.shareOverrideText,
  ]);

  const closeShareModal = () => {
    setShareModalVisible(false);
    setShareTextOverride('');
  };

  const liked = isFavorite(story.story_id);
  const savedForLater = isStorySavedForLater(story.story_id);
  // DB already returns translated content for the active language
  const displayTitle = localStory.title || '';
  const displayBody = localStory.body || '';
  const displayQuote = localStory.quote || '';
  const displayLesson = localStory.lesson || '';
  const displaySrc = localStory.source_book || '';
  const displaySourceBook = localStory.source_book || '';
  const displayCat = t(localStory.cat_display || localStory.cat || story.cat, localLang);
  const displayHook = localStory.hook || story.hook || '';
  const categoryKey = story.parent_cat_raw || story.parent_cat || localStory.cat || story.cat;
  const categoryImage = getCategoryImage(categoryKey, isDark);
  const categoryTheme = getCategoryTheme(categoryKey, isDark);

  React.useEffect(() => {
    if (story) {
      addToHistory(story.story_id);
      Speech.stop();
      setIsSpeaking(false);
    }
    Animated.timing(titleEnterAnim, {
      toValue: 1,
      duration: 360,
      useNativeDriver: true,
    }).start();
    return () => {
      Speech.stop();
    };
  }, [story, titleEnterAnim]);

  const toggleSpeech = async () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      const cleanBody = (displayBody || '').replace(/##|\$\$|&&/g, '');
      const textToRead = `${displayTitle}. \n\n ${cleanBody}`;
      setIsSpeaking(true);
      Speech.speak(textToRead, {
        language: lang === 'en' ? 'en-US' : lang === 'es' ? 'es-ES' : lang === 'de' ? 'de-DE' : 'tr-TR',
        rate: 0.95,
        pitch: 1.0,
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    }
  };

  const handleLike = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.3, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    toggleFavorite(story.story_id);
  };

  const handleReadLater = () => {
    toggleReadLater(story.story_id);
  };

  const handleNext = () => {
    if (!isPremium) {
      trackEvent(ANALYTICS_EVENTS.FREE_LIMIT_TO_PAYWALL, {
        source: 'story_detail_next',
        storyId: story?.story_id,
        lang,
      });
      handleNextWithAd();
      return;
    }
    const currentIndex = stories.findIndex(s => s.story_id === story.story_id);
    const nextIndex = (currentIndex + 1) % stories.length;
    navigation.replace('StoryDetail', { story: stories[nextIndex] });
  };

  // --- Share card theme configs ---
  const SHARE_THEMES = [
    { id: 'dark', label: t('themeInk', lang), bg: ['#131311', '#1E1C18'], text: '#E8E0D0', accent: '#FFB783', sub: '#A89A84' },
    { id: 'light', label: t('themePaper', lang), bg: ['#F7F3EB', '#EDE8DD'], text: '#1A1208', accent: '#B55310', sub: '#6B6255' },
    { id: 'sunset', label: t('themeSun', lang), bg: ['#FF512F', '#F09819'], text: '#FFF', accent: '#FFE0C2', sub: 'rgba(255,255,255,0.8)' },
    { id: 'ocean', label: t('themeNight', lang), bg: ['#1A2980', '#26D0CE'], text: '#FFF', accent: '#B8E6FF', sub: 'rgba(255,255,255,0.8)' },
    { id: 'emerald', label: t('themeEmerald', lang), bg: ['#11998e', '#38ef7d'], text: '#FFF', accent: '#D4FFED', sub: 'rgba(255,255,255,0.8)' },
    { id: 'rose', label: t('rose_theme', lang), bg: ['#E96443', '#904E95'], text: '#FFF', accent: '#FFD6E0', sub: 'rgba(255,255,255,0.8)' },
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
      if (id !== -1 && id < nextMarkerIdx) {
        nextMarkerIdx = id;
      }
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
      return ext || displayLesson || t('keyTakeaway', localLang);
    }
    if (type === 'reflection') {
      const ext = extractContent('&&');
      return ext || t('share_realize', localLang);
    }
    if (type === 'hook') {
      return displayHook;
    }
    return '';
  };

  const getCTAByLang = () => {
    if (localLang === 'en') {
      return [
        'Save this and tag a friend who needs this today.',
        'Follow Spark for daily actionable wisdom.',
        'Try this insight today and share your result.',
      ];
    }
    if (localLang === 'es') {
      return [
        'Guarda esto y etiqueta a alguien que lo necesite hoy.',
        'Sigue a Spark para sabiduria diaria accionable.',
        'Prueba esta idea hoy y comparte tu resultado.',
      ];
    }
    if (localLang === 'de') {
      return [
        'Speichere das und markiere jemanden, der das heute braucht.',
        'Folge Spark fur tagliche, umsetzbare Impulse.',
        'Teste diese Erkenntnis heute und teile dein Ergebnis.',
      ];
    }
    return [
      'Bunu kaydet ve bugun ihtiyaci olan birini etiketle.',
      'Her gun uygulanabilir bilgelik icin Spark\'i takip et.',
      'Bu fikri bugun dene, sonucunu paylas.',
    ];
  };

  const buildHashtags = () => {
    const catHashtag = displayCat.replace(/[^\p{L}\p{N}]/gu, '');
    const generalHashtags = localLang === 'en'
      ? '#Spark #DailyInspiration #BookWisdom #Mindset'
      : localLang === 'es'
        ? '#Spark #InspiracionDiaria #Sabiduria #Mentalidad'
        : localLang === 'de'
          ? '#Spark #TaeglicheInspiration #Buchimpulse #Mindset'
          : '#Spark #gununilhami #kitapbilgeligi #farkindalik';

    return `#${catHashtag} ${generalHashtags}`;
  };

  const buildSharePayload = () => {
    const selectedTexts = shareContent
      .map(type => {
        const text = getShareText(type);
        if (!text) return '';
        if (type === 'lesson') return `${t('share_key_takeaway', localLang)}\n${text}`;
        if (type === 'reflection') return `${t('share_reflect', localLang)}\n${text}`;
        if (type === 'hook') return `🎬 Hook\n${text}`;
        return text;
      })
      .filter(Boolean)
      .join('\n\n');

    const ctas = getCTAByLang();
    const primaryCta = ctas[0];
    const secondaryCta = ctas[1];
    const actionCta = ctas[2];
    const hashtags = buildHashtags();

    const caption = `${displayTitle}\n\n${selectedTexts}\n\n${primaryCta}\n${hashtags}`;

    const reelScript = `${displayTitle}\n\n` +
      `1) Hook: ${displayHook || getShareText('quote')}\n` +
      `2) Ana fikir: ${getShareText('lesson') || getShareText('quote')}\n` +
      `3) Soru: ${getShareText('reflection') || t('share_realize', localLang)}\n` +
      `4) CTA: ${secondaryCta}\n` +
      `5) Bonus CTA: ${actionCta}`;

    return { caption, reelScript };
  };

  const onShare = async () => {
    try {
      // 1. Capture the off-screen card as PNG
      const uri = await captureRef(viewShotRef, {
        format: 'png',
        quality: 1,
      });

      // 2. Construct the text to be included as caption
      const { caption, reelScript } = buildSharePayload();
      const clipboardPayload = shareFormat === 'reel'
        ? `${caption}\n\n----- REEL SCRIPT -----\n${reelScript}`
        : caption;

      // 3. Copy caption to clipboard so user can paste it on Instagram
      try {
        await Clipboard.setStringAsync(clipboardPayload);
        Alert.alert(
          localLang === 'tr' ? 'Metin Kopyalandi' : 'Text Copied',
          localLang === 'tr'
            ? 'Aciklama metni panoya kopyalandi. Reel formatinda reel script de eklendi.'
            : 'Caption copied to clipboard. Reel format also includes a short reel script.',
          [{ text: "Tamam", style: "default" }]
        );
      } catch (err) {
        console.warn("Clipboard copy failed", err);
      }

      // 4. Open native share sheet with the image
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: `${displayTitle} — ${t('brandText', lang)}`,
        });
        incrementShareCount();
        trackEvent(ANALYTICS_EVENTS.STORY_SHARED, {
          source: 'story_detail',
          storyId: story?.story_id,
          shareFormat,
          shareContent,
          lang: localLang,
        });
      } else {
        Alert.alert(
          t('alert_error', lang),
          t('alert_share_unavailable', lang),
        );
      }
    } catch (error) {
      console.error('Paylaşım hatası:', error);
      Alert.alert(
        t('alert_error', lang),
        t('alert_share_error', lang),
      );
    }
  };

  const progressBarWidth = scrollY.interpolate({
    inputRange: [0, 500],
    outputRange: [0, width],
    extrapolate: 'clamp',
  });

  const titleEnterStyle = {
    opacity: titleEnterAnim,
    transform: [
      {
        translateY: titleEnterAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [14, 0],
        }),
      },
      {
        scale: titleEnterAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.97, 1],
        }),
      },
    ],
  };

  const styles = StyleSheet.create({
    safe: { 
      flex: 1, 
      backgroundColor: colors.background
    },
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
    modalTitle: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: 20,
      color: colors.text,
    },
    modalSub: {
      fontFamily: 'Inter_400Regular',
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 16,
    },
    // --- Content type pills ---
    contentPillsRow: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 14,
    },
    contentPill: {
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: 20,
      backgroundColor: colors.backgroundDark,
      borderWidth: 1,
      borderColor: colors.border,
    },
    contentPillActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    contentPillText: {
      fontFamily: 'Inter_500Medium',
      fontSize: 12,
      color: colors.textSecondary,
    },
    contentPillTextActive: {
      color: '#FFF',
    },
    // --- Theme swatches ---
    themeToggle: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: 14,
    },
    themeSwatch: {
      width: 36,
      height: 36,
      borderRadius: 18,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    themeSwatchActive: {
      borderColor: colors.primary,
    },
    // --- Format toggle ---
    formatRow: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 16,
    },
    formatBtn: {
      flex: 1,
      paddingVertical: 8,
      borderRadius: 10,
      alignItems: 'center',
      backgroundColor: colors.backgroundDark,
      borderWidth: 1,
      borderColor: colors.border,
    },
    formatBtnActive: {
      borderColor: colors.primary,
      backgroundColor: isDark ? 'rgba(181,83,16,0.15)' : 'rgba(181,83,16,0.08)',
    },
    formatBtnText: {
      fontFamily: 'Inter_500Medium',
      fontSize: 12,
      color: colors.textSecondary,
    },
    formatBtnTextActive: {
      color: colors.primary,
    },
    // --- Buttons ---
    btnPrimary: {
      borderRadius: layout.radius.button, 
      height: layout.heights.buttonPrimary, 
      justifyContent: 'center', 
      alignItems: 'center',
      width: '100%',
    },
    btnPrimaryGradient: {
      borderRadius: layout.radius.button,
      height: layout.heights.buttonPrimary,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    btnPrimaryText: { 
      fontFamily: 'Inter_500Medium', 
      color: '#F7F3EB', 
      fontSize: typography.sizes.ui + 1 
    },
    // --- Share card (capture target) ---
    shareCardWrapper: {
      alignSelf: 'center',
      marginBottom: 14,
      borderRadius: 12,
      overflow: 'hidden',
      // shadow
      shadowColor: '#000',
      shadowOpacity: 0.3,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 10,
    },
    readingProgressBarContainer: {
      height: 3,
      backgroundColor: colors.border,
      width: '100%',
    },
    readingProgressBar: {
      height: 3,
      backgroundColor: colors.primary,
    },
    detailHeader: { 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      paddingHorizontal: layout.padding.horizontal, 
      paddingVertical: 12 
    },
    headerPillLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? colors.backgroundDark : '#F3EFE9',
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: 20,
    },
    backBtn: { 
      fontFamily: 'Inter_500Medium', 
      fontSize: 14, 
      color: colors.text,
      marginLeft: 4,
    },
    storyHero: { 
      margin: layout.padding.horizontal, 
      borderRadius: 16, 
      overflow: 'hidden',
      marginBottom: 16, 
      borderWidth: 1, 
      borderColor: isDark ? colors.border : '#DED5C4',
      backgroundColor: isDark ? colors.backgroundDark : '#EBE2D3',
    },
    badge: { 
      paddingHorizontal: 10, 
      paddingVertical: 4, 
      borderRadius: 16, 
      backgroundColor: isDark ? colors.backgroundDark : '#EBDCCC',
      marginBottom: 8,
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      gap: 4,
    },
    badgeText: { 
      fontFamily: 'Inter_500Medium', 
      fontSize: 12, 
      color: colors.textSecondary, 
    },
    detailTitle: { 
      fontFamily: 'PlayfairDisplay_700Bold', 
      fontSize: 28, 
      color: colors.text, 
      lineHeight: 34,
      marginBottom: 8,
    },
    categoryVisualCard: {
      borderRadius: 16,
      marginTop: 4,
      marginBottom: 12,
      height: 96,
      overflow: 'hidden',
      position: 'relative',
    },
    categoryVisualTitle: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 13,
      color: '#FFFFFF',
      textAlign: 'right',
      letterSpacing: 0.3,
      position: 'absolute',
      bottom: 8,
      right: 12,
      zIndex: 2,
    },
    categoryVisualImageWrap: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: 16,
      backgroundColor: 'rgba(255,255,255,0.16)',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    categoryVisualImage: {
      width: '100%',
      height: '100%',
      opacity: 0.95,
    },
    metaItem: { 
      fontFamily: 'Inter_400Regular', 
      fontSize: 13, 
      color: colors.textSecondary,
    },
    detailBody: { 
      fontFamily: 'Inter_400Regular', 
      color: colors.text,
      marginBottom: 16,
    },
    quoteBox: { 
      borderLeftWidth: 4, 
      borderLeftColor: colors.quoteHighlight,
      backgroundColor: isDark ? colors.backgroundDark : `${colors.quoteHighlight}1A`,
      padding: 16,
      paddingLeft: 20,
      marginVertical: 12,
      borderRadius: 4,
    },
    quoteText: { 
      fontFamily: 'Inter_500Medium', 
      fontSize: typography.sizes.body + 1, 
      color: colors.text, 
      lineHeight: 28 
    },
    premiumSeparator: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 12,
    },
    separatorLine: {
      height: 1,
      backgroundColor: colors.border,
      flex: 1,
    },
    separatorIcon: {
      marginHorizontal: 16,
      color: colors.primary,
      fontSize: 16,
    },
    lessonBox: { 
      borderRadius: 16, 
      padding: 20, 
      marginBottom: 20,
      borderTopLeftRadius: 4,
      borderBottomLeftRadius: 4,
      borderLeftWidth: 5,
      borderLeftColor: isDark ? colors.primary : '#594238',
    },
    lessonLabel: { 
      fontFamily: 'Inter_500Medium', 
      fontSize: 12, 
      color: colors.text, 
      letterSpacing: 1.5, 
      textTransform: 'uppercase',
      marginBottom: 8 
    },
    lessonText: { 
      fontFamily: 'Inter_500Medium', 
      fontSize: 15, 
      color: colors.text, 
      lineHeight: 24 
    },
    reflectionBox: {
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: isDark ? colors.border : '#EBDCCA',
      shadowColor: '#D4AF37',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 2,
    },
    reflectionLabel: {
      fontFamily: 'Inter_500Medium', 
      fontSize: 11, 
      color: colors.text, 
      letterSpacing: 1.5, 
      textTransform: 'uppercase',
    },
    detailFooter: { 
      flexDirection: 'row', 
      gap: 12, 
      paddingHorizontal: layout.padding.horizontal, 
      paddingTop: 16, 
      paddingBottom: Math.max(insets.bottom + 6, 22), 
      borderTopWidth: 1, 
      borderTopColor: colors.border, 
      backgroundColor: colors.background,
      marginBottom: Platform.OS === 'android' ? 4 : 0,
    },
    btnSecondaryShare: { 
      flex: 1, 
      borderWidth: 1, 
      borderColor: colors.primary, 
      borderRadius: 12, 
      height: 48, 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: 'transparent' 
    },
    btnSecondaryShareText: { 
      fontFamily: 'Inter_500Medium', 
      fontSize: 15, 
      color: colors.text 
    },
    fontSizeControls: {
      flexDirection: 'row',
      backgroundColor: isDark ? colors.backgroundDark : '#F3EFE9',
      borderRadius: 20,
      paddingHorizontal: 8,
      paddingVertical: 4,
      alignItems: 'center',
    },
    fontSizeBtn: {
      paddingHorizontal: 8,
    },
    fontSizeBtnText: {
      fontFamily: 'Inter_500Medium',
      fontSize: 13,
      color: colors.text,
    },
    sourceSection: {
      marginTop: 24,
      padding: 16,
      borderRadius: 12,
      backgroundColor: isDark ? colors.backgroundDark : '#F7F3E8',
      borderWidth: 1,
      borderColor: colors.border,
    },
    sourceLabel: {
      fontFamily: 'Inter_500Medium',
      fontSize: 11,
      color: colors.textSecondary,
      marginBottom: 8,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    bookTitle: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: 20,
      color: colors.text,
      marginBottom: 12,
    },
    linkBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
    },
    linkBtnText: {
      fontFamily: 'Inter_500Medium',
      fontSize: 13,
      color: colors.text,
      marginLeft: 6,
    },
    fabMic: {
      position: 'absolute',
      bottom: Math.max(insets.bottom + 6, 22) + layout.heights.buttonPrimary + 16 + 20,
      right: layout.padding.horizontal,
      width: 52,
      height: 52,
      borderRadius: 26,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 16,
      elevation: 12,
      zIndex: 10,
    },
    fabMicGradient: {
      width: 52,
      height: 52,
      borderRadius: 26,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.08)',
    },
  });

  // --- Helper: Render the share card (identical in both preview & capture) ---
  const renderShareCard = () => {
    const th = currentTheme;
    const isPost = shareFormat === 'post';
    
    // Always use exact capture sizes
    const cardW = 1080;
    const cardH = isPost ? 1080 : 1920; 
    
    const fTitle = 68;
    const fQuote = 50;
    const fSrc = 32;
    const fLogo = 42;
    const fFooter = 28;
    
    const padHorizontal = 80;
    const paddingTop = isPost ? 80 : 250;
    const paddingBottom = isPost ? 80 : 300;
    const borderW = 10;

    return (
      <View style={{ width: cardW, height: cardH, overflow: 'hidden', backgroundColor: th.bg[0], flexDirection: 'column' }}>
        <LinearGradient
          colors={th.bg}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFill]}
        />
        
        {/* All Content Filtered Through a Single Centered Container */}
        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: padHorizontal, paddingTop, paddingBottom }}>
          
          {/* Header (Logo) */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 80, borderBottomWidth: 4, borderBottomColor: th.accent, paddingBottom: 16, alignSelf: 'flex-start' }}>
            <Text style={{
              fontFamily: 'PlayfairDisplay_700Bold',
              fontSize: 64, color: th.text,
              letterSpacing: 2
            }}>✦ {t('brandText', lang).replace(' ✦', '')}</Text>
          </View>

          {shareContent.map((type, index) => {
            const label = type === 'lesson' ? t('share_key_takeaway', localLang) : 
                          type === 'reflection' ? t('share_reflect', localLang) :
                          type === 'hook' ? '' :
                          displayTitle;
            const textContent = getShareText(type);
            
            // dynamically scale text if multiple are selected
            const dynTitle = shareContent.length > 1 ? fTitle * 0.8 : fTitle;
            const dynQuote = shareContent.length > 1 ? fQuote * 0.8 : fQuote;

            // Hook: büyük, cesur, tam ekran hook cümlesi
            if (type === 'hook') {
              return (
                <View key={type} style={{ marginBottom: index === shareContent.length - 1 ? 0 : 80 }}>
                  <Text style={{
                    fontFamily: 'PlayfairDisplay_700Bold',
                    fontSize: dynQuote * 1.1,
                    color: th.text,
                    lineHeight: dynQuote * 1.7,
                    textAlign: 'center',
                    letterSpacing: 1,
                  }}>
                    {textContent}
                  </Text>
                  <View style={{
                    width: 120,
                    height: 4,
                    backgroundColor: th.accent,
                    alignSelf: 'center',
                    marginTop: 40,
                    borderRadius: 2,
                  }} />
                </View>
              );
            }
            
            return (
              <View key={type} style={{ marginBottom: index === shareContent.length - 1 ? 0 : 80 }}>
                <Text style={{
                  fontFamily: 'PlayfairDisplay_700Bold',
                  fontSize: dynTitle,
                  color: th.text,
                  lineHeight: dynTitle * 1.4,
                  marginBottom: 32,
                }}>
                  {label}
                </Text>
                
                <View style={{
                  borderLeftWidth: borderW,
                  borderLeftColor: th.accent,
                  paddingLeft: 30,
                  marginBottom: 20,
                }}>
                  <Text style={{
                    fontFamily: 'PlayfairDisplay_600SemiBold',
                    fontSize: dynQuote,
                    color: th.sub,
                    lineHeight: dynQuote * 1.6,
                  }}>
                    "{textContent}"
                  </Text>
                </View>
              </View>
            );
          })}
          
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 60 }}>
            <Ionicons name="book-outline" size={fSrc + 4} color={th.sub} />
            <Text style={{
              fontFamily: 'Inter_500Medium',
              fontSize: fSrc,
              color: th.sub,
              textTransform: 'uppercase',
              letterSpacing: 2,
              marginLeft: 6,
              flexShrink: 1,
            }} numberOfLines={2}>
              {t('share_source', localLang)}{displaySourceBook}
            </Text>
          </View>

          {/* Footer */}
          <View style={{ alignItems: 'center', marginTop: 60 }}>
            <Text style={{
              fontFamily: 'Inter_400Regular',
              fontSize: fFooter, color: th.sub,
              textAlign: 'center',
            }}>
              {t('share_more', localLang)}
            </Text>
          </View>

          <View style={{ position: 'absolute', right: 42, bottom: 36 }}>
            <Text style={{
              fontFamily: 'Inter_500Medium',
              fontSize: 24,
              color: th.text,
              opacity: 0.35,
              letterSpacing: 1,
            }}>
              Spark ✦
            </Text>
          </View>

        </View>
      </View>
    );
  };

  return (
    <>
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safe}>
      {/* ===== SHARE MODAL ===== */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={shareModalVisible}
        onRequestClose={closeShareModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('createCard', lang)}</Text>
              <TouchableOpacity onPress={closeShareModal}>
                <Ionicons name="close" size={22} color={colors.text} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSub}>{t('shareOnInstagram', lang)}</Text>

            <ScrollView showsVerticalScrollIndicator={false} style={{ flexShrink: 1, marginBottom: 16 }}>
              {/* Card Preview (visible to user exactly as captured) */}
              <View style={[styles.shareCardWrapper, {
                width: width - 80,
                height: (shareFormat === 'post' ? 1080 : 1920) * ((width - 80) / 1080),
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: 'transparent'
              }]}>
                <View style={{
                  width: 1080,
                  height: shareFormat === 'post' ? 1080 : 1920,
                  transform: [{ scale: (width - 80) / 1080 }]
                }}>
                  {renderShareCard()}
                </View>
              </View>

            {/* Content type pills */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.contentPillsRow}>
              {[
                { id: 'quote', label: t('quote_label', lang), icon: 'chatbox-ellipses-outline' },
                { id: 'lesson', label: t('lesson_pill', lang), icon: 'bulb-outline' },
                { id: 'reflection', label: t('reflect_pill', lang), icon: 'help-circle-outline' },
                ...(displayHook ? [{ id: 'hook', label: '🎬 Hook', icon: 'videocam-outline' }] : []),
              ].map(ct => (
                <TouchableOpacity
                  key={ct.id}
                  style={[styles.contentPill, shareContent.includes(ct.id) && styles.contentPillActive]}
                  onPress={() => {
                    if (shareFormat === 'story' || shareFormat === 'reel') {
                      setShareContent(prev => {
                        if (prev.includes(ct.id)) {
                          return prev.length > 1 ? prev.filter(id => id !== ct.id) : prev;
                        }
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
                <TouchableOpacity
                  key={th.id}
                  onPress={() => setShareTheme(th.id)}
                >
                  <LinearGradient
                    colors={th.bg}
                    style={[styles.themeSwatch, shareTheme === th.id && styles.themeSwatchActive]}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Format selector */}
            <View style={styles.formatRow}>
              <TouchableOpacity
                style={[styles.formatBtn, shareFormat === 'post' && styles.formatBtnActive]}
                onPress={() => {
                  setShareFormat('post');
                  if (shareContent.length > 1) {
                    setShareContent([shareContent[0]]);
                  }
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
                <Text style={[styles.formatBtnText, shareFormat === 'reel' && styles.formatBtnTextActive]}>🎥 Reel (9:16)</Text>
              </TouchableOpacity>
            </View>
            </ScrollView>

            {/* Share button */}
            <TouchableOpacity onPress={onShare}>
              <LinearGradient
                colors={[colors.ctaGradientStart, colors.ctaGradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.btnPrimaryGradient}
              >
                <View style={styles.btnPrimary}>
                  <Text style={styles.btnPrimaryText}>{t('saveAndShare', lang)}</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ===== OFF-SCREEN CAPTURE TARGET ===== */}
      <View style={{ position: 'absolute', left: -9999, top: -9999 }} pointerEvents="none">
        <View ref={viewShotRef} collapsable={false}>
          {renderShareCard()}
        </View>
      </View>

      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      
      <View style={styles.readingProgressBarContainer}>
        <Animated.View style={[styles.readingProgressBar, { width: progressBarWidth }]} />
      </View>

      <View style={styles.detailHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity style={styles.headerPillLeft} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={16} color={colors.text} />
            <Text style={styles.backBtn}>{t('backBtn', lang).replace(/^[\u2190<-]+\s*/g, '')}</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
          <TouchableOpacity 
            onPress={() => {
              const langs = ['tr', 'en', 'es', 'de'];
              const nextIndex = (langs.indexOf(localLang) + 1) % langs.length;
              setLocalLang(langs[nextIndex]);
            }} 
            style={{
              paddingHorizontal: 8,
              paddingVertical: 5,
              borderRadius: 8,
              backgroundColor: isDark ? colors.backgroundDark : '#EBE2D3',
              borderWidth: 1,
              borderColor: colors.border
            }}
          >
            <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: colors.text }}>{localLang.toUpperCase()}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleSpeech}>
            <Text style={{ fontSize: 24, color: isSpeaking ? colors.primary : colors.text }}>
              {isSpeaking ? '⏸' : '▶'}
            </Text>
          </TouchableOpacity>
          <View style={styles.fontSizeControls}>
            <TouchableOpacity onPress={() => setFontSize(Math.max(12, fontSize - 1))} style={styles.fontSizeBtn}>
              <Text style={styles.fontSizeBtnText}>A-</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setFontSize(Math.min(24, fontSize + 1))} style={styles.fontSizeBtn}>
              <Text style={styles.fontSizeBtnText}>A+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              setShareTextOverride('');
              setShareModalVisible(true);
            }}
          >
            <Ionicons name="share-social" size={22} color={colors.text} />
          </TouchableOpacity>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity onPress={handleLike}>
              <Ionicons name={liked ? "heart" : "heart-outline"} size={26} color={liked ? "#BA1A1A" : colors.text} />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>

      <Animated.ScrollView 
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          {
            useNativeDriver: false,
            listener: (event) => {
              if (!hasReachedBottom.current) {
                const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
                if (contentOffset.y + layoutMeasurement.height >= contentSize.height - 60) {
                  hasReachedBottom.current = true;
                  // Completion now triggered by navigating to UseInConversation
                  releasePendingBadge();
                }
              }
            },
          }
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.storyHero}> 
          {(() => {
            if (!categoryImage.source) return null;
            return (
              <>
                <Image 
                  source={categoryImage.source} 
                  style={[StyleSheet.absoluteFill, {
                    width: '100%',
                    height: '100%',
                    opacity: isDark ? 0.22 : 0.40,
                    transform: [
                      { rotate: categoryImage.rotate },
                      { scaleX: categoryImage.flip ? -1 : 1 }
                    ]
                  }]}
                  resizeMode="cover"
                />
                <View style={[StyleSheet.absoluteFill, { backgroundColor: categoryImage.tint }]} />
              </>
            );
          })()}
          <View style={{ paddingVertical: 16, paddingHorizontal: 20 }}>
            <Animated.Text style={[styles.detailTitle, titleEnterStyle]}>{displayTitle}</Animated.Text>
            <View style={{ flexDirection: 'row', gap: 16, justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 1 }}>
                <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
                <Text style={styles.metaItem}>{story.min} {t('minLabel', localLang)}</Text>
              </View>
              <Text numberOfLines={1} style={[styles.metaItem, { color: categoryTheme.borderColor, fontFamily: 'Inter_500Medium', textAlign: 'right', flexShrink: 1 }]}>
                {displayCat}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: layout.padding.horizontal }}>
          {(() => {
            // Parse the body into segments based on ##, $$, && markers
            const rawBody = (displayBody || '').replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n');
            const segments = [];
            let remaining = rawBody;

            while (remaining.length > 0) {
              // Find the next marker
              const markers = [
                { marker: '##', type: 'highlight' },
                { marker: '$$', type: 'lesson' },
                { marker: '&&', type: 'reflection' },
              ];

              let nearestIdx = remaining.length;
              let nearestMarker = null;

              for (const m of markers) {
                const openIdx = remaining.indexOf(m.marker);
                if (openIdx !== -1 && openIdx < nearestIdx) {
                  const closeIdx = remaining.indexOf(m.marker, openIdx + m.marker.length);
                  if (closeIdx !== -1) {
                    nearestIdx = openIdx;
                    nearestMarker = { ...m, open: openIdx, close: closeIdx };
                  }
                }
              }

              if (!nearestMarker) {
                // No more markers, push remaining as plain text
                if (remaining.trim()) {
                  segments.push({ type: 'text', content: remaining });
                }
                break;
              }

              // Push text before the marker
              const before = remaining.substring(0, nearestMarker.open);
              if (before.trim()) {
                segments.push({ type: 'text', content: before });
              }

              // Extract content between markers
              const markerContent = remaining.substring(
                nearestMarker.open + nearestMarker.marker.length,
                nearestMarker.close
              );
              segments.push({ type: nearestMarker.type, content: markerContent.trim() });

              // Move past the closing marker
              remaining = remaining.substring(nearestMarker.close + nearestMarker.marker.length);
            }

            return segments.map((seg, idx) => {
              if (seg.type === 'text') {
                const trimmedText = seg.content.trim().replace(/\n{2,}/g, '\n\n');
                if (!trimmedText) return null;
                return (
                  <Text
                    key={idx}
                    style={[styles.detailBody, { fontSize, lineHeight: Math.round(fontSize * 1.55) }]}
                  >
                    {trimmedText}
                  </Text>
                );
              }

              if (seg.type === 'highlight') {
                return (
                  <View key={idx} style={[
                    styles.quoteBox,
                    {
                      borderLeftColor: categoryTheme.borderColor,
                      backgroundColor: categoryTheme.backgroundColor,
                    },
                  ]}>
                    <Text style={[styles.quoteText, { fontSize: fontSize + 2, lineHeight: (fontSize + 2) * 1.5 }]}>
                      "{seg.content}"
                    </Text>
                  </View>
                );
              }

              if (seg.type === 'lesson' || seg.type === 'reflection') {
                return null;
              }

              return null;
            });
          })()}
          {/* Source & Book section */}
          {displaySourceBook ? (
            <View style={styles.sourceSection}>
              <Text style={styles.sourceLabel}>{t('sourceExplore', lang)}</Text>
              <Text style={styles.bookTitle}>{displaySourceBook.split(' — ')[0].trim()}</Text>
              {story.author ? (
                <Text style={{
                  fontFamily: 'Inter_400Regular',
                  fontSize: 13,
                  color: colors.textSecondary,
                  marginTop: -10,
                  marginBottom: 12,
                }}>
                  ✍️ {story.author}
                </Text>
              ) : null}

              <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
                <TouchableOpacity 
                   onPress={() => Linking.openURL(`https://www.amazon.com.tr/s?k=${encodeURIComponent(displaySourceBook)}`)}
                   style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.backgroundDark, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, flex: 1, justifyContent: 'center', borderWidth: 1, borderColor: colors.border }}
                >
                  <Ionicons name="cart-outline" size={16} color={colors.text} style={{ marginRight: 6 }} />
                  <Text style={{ color: colors.text, fontFamily: 'Inter_500Medium', fontSize: 12 }}>{t('book', lang)}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                   onPress={() => Linking.openURL(`https://www.youtube.com/results?search_query=${encodeURIComponent(displaySourceBook)}`)}
                   style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.backgroundDark, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, flex: 1, justifyContent: 'center', borderWidth: 1, borderColor: colors.border }}
                >
                  <Ionicons name="logo-youtube" size={16} color="#FF0000" style={{ marginRight: 6 }} />
                  <Text style={{ color: colors.text, fontFamily: 'Inter_500Medium', fontSize: 12 }}>Youtube</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                   onPress={() => Linking.openURL(`https://www.tiktok.com/search?q=${encodeURIComponent(displaySourceBook)}`)}
                   style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.backgroundDark, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, flex: 1, justifyContent: 'center', borderWidth: 1, borderColor: colors.border }}
                >
                  <Ionicons name="logo-tiktok" size={16} color={colors.text} style={{ marginRight: 6 }} />
                  <Text style={{ color: colors.text, fontFamily: 'Inter_500Medium', fontSize: 12 }}>Tiktok</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}

          {/* ── "Sohbette Kullan" entry — removed from body, now in footer ─ */}
        </View>
        <View style={{ height: 100 }} />
      </Animated.ScrollView>

      <TouchableOpacity
        style={styles.fabMic}
        onPress={() => {
          trackEvent(ANALYTICS_EVENTS.USE_IN_CONVO_OPENED, {
            storyId: story?.story_id,
            source: 'story_detail_fab',
            lang,
          });
          if (isPremium && !isStoryCompleted(localStory.story_id)) {
            markStoryCompleted(localStory.story_id);
          }
          navigation.navigate('UseInConversation', { story: localStory });
        }}
        activeOpacity={0.82}
      >
        <LinearGradient
          colors={isDark
            ? ['rgba(229,194,122,0.92)', 'rgba(217,177,95,0.97)']
            : ['rgba(200,155,60,0.94)', 'rgba(232,211,168,0.97)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fabMicGradient}
        >
          <Ionicons name="mic" size={22} color={colors.onPrimary} />
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.detailFooter}>
        {/* PRIMARY: Sohbette Kullan — main CTA with micro-copy */}
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            onPress={() => {
              trackEvent(ANALYTICS_EVENTS.USE_IN_CONVO_OPENED, {
                storyId: story?.story_id,
                source: 'story_detail_footer',
                lang,
              });
              // Only premium users get completion; free users stay "incomplete"
              if (isPremium && !isStoryCompleted(localStory.story_id)) {
                markStoryCompleted(localStory.story_id);
              }
              navigation.navigate('UseInConversation', { story: localStory });
            }}
            accessibilityRole="button"
            accessibilityLabel={t('story_detail_use_cta', lang)}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={[colors.ctaGradientStart, colors.ctaGradientEnd, '#7A2A00']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.btnPrimaryGradient,
                {
                  height: 58,
                  borderWidth: 1,
                  borderColor: isDark ? 'rgba(255,255,255,0.14)' : 'rgba(122,42,0,0.18)',
                  shadowColor: colors.ctaGradientEnd,
                  shadowOpacity: 0.35,
                  shadowRadius: 14,
                  shadowOffset: { width: 0, height: 8 },
                  elevation: 8,
                },
              ]}
            >
              <View style={[styles.btnPrimary, { height: 58, flexDirection: 'row', gap: 8 }]}> 
                <Ionicons name="sparkles" size={18} color="#F7F3EB" />
                <Text style={[styles.btnPrimaryText, { color: '#F7F3EB', fontSize: typography.sizes.ui + 3, letterSpacing: 0.2 }]}>
                  {t('story_detail_use_cta', lang)}
                </Text>
                <Ionicons name="arrow-forward" size={17} color="#F7F3EB" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
          <Text style={{
            fontFamily: 'Inter_400Regular',
            fontSize: 12,
            color: colors.textSecondary,
            textAlign: 'center',
            marginTop: 7,
            opacity: 0.9,
          }}>
            {t('story_detail_use_cta_sub', lang)}
          </Text>
        </View>
      </View>
    </SafeAreaView>

    <AdOrPremiumSheet
      visible={adSheet}
      onClose={() => {
        trackEvent(ANALYTICS_EVENTS.AD_OR_PREMIUM_CHOICE, { source: 'story_detail_next', choice: 'dismiss' });
        setAdUnavailable(false);
        setAdSheet(false);
      }}
      onWatchAd={handleWatchAdNext}
      onGoPremium={() => {
        trackEvent(ANALYTICS_EVENTS.AD_OR_PREMIUM_CHOICE, { source: 'story_detail_next', choice: 'premium' });
        setAdSheet(false);
        navigation.navigate('Paywall', { reason: 'free_limit_reached', source: 'story_detail_next' });
      }}
      adUnavailable={adUnavailable}
      isAdLoading={isAdLoading}
      lang={lang}
    />
    </>
  );
};

export default StoryDetailScreen;

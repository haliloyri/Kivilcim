/**
 * UseInConversationScreen  (v3 — context-first layout)
 *
 * "Use in Conversation" screen. Flow follows SOHBETTE_KULLAN_ENTEGRASYON_PLANI:
 *   1. "Where will you tell it?" — context chips (meeting / 1-on-1 / family /
 *      social / self). Preselected when the screen is opened from a story's
 *      [[use]] card; picking one suggests the best-fitting length.
 *   2. Length — 3-way segmented control (One line / 30 sec / As a question)
 *      with a one-line "when to use it" hint.
 *   3. One large preview card: the text, its key contrast ("In short"),
 *      estimated speaking time, and an inline copy button.
 *   4. One-row bottom dock: "Practice" (primary) + "I used it" (toggle).
 *
 * Sharing (Instagram card / other apps / copy) lives in a bottom sheet opened
 * from the app bar's share icon, so it no longer eats the bottom of the screen.
 *
 * Premium gates: Storyteller Mode + Instagram visual card.
 * Receives: route.params.story (same shape as StoryDetailScreen),
 *           route.params.initialContext, route.params.entrySource
 */
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Share,
  Animated,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useUserData } from '../context/UserDataContext';
import { t } from '../locales/i18n';
import StorytellerOverlay from '../components/StorytellerOverlay';
import AdOrPremiumSheet from '../components/AdOrPremiumSheet';
import ShareCardModal from '../components/ShareCardModal';
import { ANALYTICS_EVENTS, trackEvent } from '../utils/analytics';
import { shouldShowAd, rewardedGate, loadRewarded, showRewarded } from '../utils/ads';
import { getCategoryTheme } from '../utils/categoryImages';
import { extractShareParts, getNarrativeText } from '../utils/storyMarkup';

// ─── helpers ────────────────────────────────────────────────────────────────

/** Marker extraction and clean body text come from the shared story markup module. */
const extractMarker = (body, marker) => {
  const parts = extractShareParts(body);
  if (marker === '##') return parts.quote;
  if (marker === '$$') return parts.lesson;
  if (marker === '&&') return parts.reflection;
  return '';
};

const cleanBodyText = (body) => getNarrativeText(body);

const normalizeHashtag = (value = '') =>
  value
    .toString()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\p{L}\p{N}]/gu, '');

const buildVariantShareMessage = ({ story, variant, lang, categoryLabel }) => {
  const body = (variant?.body || '').trim();
  const storyTitle = (story?.title || '').trim();

  const hookByLang = {
    tr: {
      PUNCHLINE: 'Bugünün en vurucu çıkarımı:',
      QUESTION: 'Bugün kendine sor:',
      THIRTY_SEC: '30 saniyede anlatım:',
      fallback: 'Bu hikayeyi sevdim:',
      engage: 'Sence bunun en kritik noktası ne?',
      tags: '#Albor #Farkındalık #KişiselGelişim #KitapNotları',
    },
    en: {
      PUNCHLINE: 'Today\'s sharpest takeaway:',
      QUESTION: 'Ask yourself this today:',
      THIRTY_SEC: 'This in 30 seconds:',
      fallback: 'This story stayed with me:',
      engage: 'What part resonates with you most?',
      tags: '#Albor #Mindset #Growth #BookNotes',
    },
    es: {
      PUNCHLINE: 'La idea mas potente de hoy:',
      QUESTION: 'Preguntate esto hoy:',
      THIRTY_SEC: 'Esto en 30 segundos:',
      fallback: 'Esta historia me impacto:',
      engage: 'Que parte te resuena mas?',
      tags: '#Albor #Mentalidad #Crecimiento #NotasDeLibros',
    },
    de: {
      PUNCHLINE: 'Die kraftigste Erkenntnis heute:',
      QUESTION: 'Stell dir heute diese Frage:',
      THIRTY_SEC: 'In 30 Sekunden:',
      fallback: 'Diese Geschichte bleibt haengen:',
      engage: 'Welcher Teil spricht dich am meisten an?',
      tags: '#Albor #Mindset #Weiterentwicklung #BuchImpulse',
    },
  };

  const copy = hookByLang[lang] || hookByLang.tr;
  const hook = copy[variant?.type] || copy.fallback;
  const categoryTag = normalizeHashtag(categoryLabel || story?.parent_cat || story?.cat || '');
  const hashtags = categoryTag ? `#${categoryTag} ${copy.tags}` : copy.tags;

  return `${hook}\n\n${body || storyTitle}\n\n${copy.engage}\n\n${hashtags}`;
};

/** Truncate a string to maxLen, breaking at word boundary */
const truncate = (str, maxLen) => {
  if (!str || str.length <= maxLen) return str;
  const cut = str.lastIndexOf(' ', maxLen);
  return str.substring(0, cut > 0 ? cut : maxLen) + '…';
};

/** Build the native-share text (safe length for most platforms) */
const buildNativeShareText = ({ story, variant, lang, categoryLabel }) => {
  const base = buildVariantShareMessage({ story, variant, lang, categoryLabel });
  return truncate(base, 280);
};

/** Map variant type → share preset name used by the share-card modal */
const mapVariantToPreset = (variant) => {
  switch (variant?.type) {
    case 'PUNCHLINE':  return 'quote';
    case 'THIRTY_SEC': return 'lesson';
    case 'QUESTION':   return 'reflection';
    default:           return 'quote';
  }
};

const getUsageVariantKey = (storyId, variantId) => `${String(storyId)}:${String(variantId)}`;

/** Average conversational pace ≈ 140 words/min → ~2.3 words/sec. */
const estimateSpeakSeconds = (text = '') => {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.round(words / 2.3));
};

/**
 * Three lengths, one axis ("how do you open it?"). The old 4th format
 * (key contrast) is no longer a separate choice — it is shown as the
 * "In short" line under the preview.
 */
const buildMicroVariants = (story, lang) => {
  const body = story.body || '';
  const quote       = extractMarker(body, '##');
  const lesson      = extractMarker(body, '$$');
  const reflection  = extractMarker(body, '&&');
  const punchline   = (story.conversation_punchline || '').trim();
  const thirtySec   = (story.conversation_thirty_sec || story.thirty_sec || '').trim();
  const question    = (story.conversation_question || '').trim();
  const clean       = cleanBodyText(body);

  const candidates = [
    {
      id: 'punchline',
      type: 'PUNCHLINE',
      title: t('mv_len_punchline', lang),
      hint: t('mv_hint_punchline', lang),
      body: punchline || lesson || quote,
    },
    {
      id: 'thirty_sec',
      type: 'THIRTY_SEC',
      title: t('mv_len_thirty', lang),
      hint: t('mv_hint_thirty', lang),
      body: thirtySec || (clean.length > 320 ? clean.substring(0, 320).trimEnd() + '…' : clean),
    },
    {
      id: 'question',
      type: 'QUESTION',
      title: t('mv_len_question', lang),
      hint: t('mv_hint_question', lang),
      body: question || reflection,
    },
  ];

  return candidates.filter(v => v.body.length > 0);
};

/** Context chips, same slugs as the story's [[use]] cards. */
const CONTEXTS = ['meeting', 'oneonone', 'family', 'social', 'self'];

/** Context → the length that fits it best (suggested when a chip is picked). */
const CONTEXT_TO_VARIANT = {
  meeting: 'thirty_sec',
  oneonone: 'question',
  family: 'punchline',
  social: 'thirty_sec',
  self: 'question',
};

/** Context slug → its display label. 'self' has no Storyteller practice context, so it uses its own key. */
const contextLabel = (context, lang) =>
  context === 'self' ? t('convoContextSelf', lang) : t(`mv_storyteller_context_${context}`, lang);

// ─── screen ─────────────────────────────────────────────────────────────────

const UseInConversationScreen = ({ route, navigation }) => {
  const { story, initialContext, entrySource } = route.params;
  const { colors, layout, isDark, lang } = useTheme();
  const { isPremium, recordVariantUsage, removeVariantUsage, variantUsage, incrementShareCount, isStoryCompleted, setBadgePresentationBlocked } = useUserData();
  const insets = useSafeAreaInsets();

  const variants = useMemo(() => buildMicroVariants(story, lang), [story, lang]);
  const keyContrast = useMemo(() => {
    const explicit = (story.conversation_key_contrast || '').trim();
    if (explicit) return explicit;
    const body = story.body || '';
    const quote = extractMarker(body, '##');
    const lesson = extractMarker(body, '$$');
    return quote && quote !== lesson ? quote : '';
  }, [story]);

  const displayCat = t(story.parent_cat || story.cat || '', lang);
  const categoryTheme = getCategoryTheme(story.parent_cat_raw || story.parent_cat || story.cat, isDark);
  const storyCompleted = isStoryCompleted(story?.story_id);

  // Track screen open
  useEffect(() => {
    trackEvent(ANALYTICS_EVENTS.USE_IN_CONVO_OPENED, {
      storyId: story?.story_id,
      source: entrySource || 'screen_mount',
      context: initialContext || undefined,
      lang,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [selectedContext, setSelectedContext] = useState(
    () => (CONTEXTS.includes(initialContext) ? initialContext : null),
  );

  // Selected length (single-select). A preselected context suggests the
  // length that fits it best.
  const [selectedId, setSelectedId] = useState(() => {
    const preferred = initialContext && CONTEXT_TO_VARIANT[initialContext];
    if (preferred && variants.some(v => v.id === preferred)) return preferred;
    return variants[0]?.id ?? null;
  });
  const selected = useMemo(
    () => variants.find(v => v.id === selectedId) || variants[0] || null,
    [variants, selectedId],
  );

  const [copyToastVisible, setCopyToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [showStorytellerFor, setShowStorytellerFor] = useState(null);
  const [shareSheetVisible, setShareSheetVisible] = useState(false);
  const [markedUsedIds, setMarkedUsedIds] = useState(() => {
    const storyId = String(story?.story_id);
    return new Set(
      (variantUsage || [])
        .filter(item => String(item.storyId) === storyId && item.action === 'mark_used')
        .map(item => item.variantKey || getUsageVariantKey(item.storyId, item.variantId))
    );
  });
  const toastAnim = React.useRef(new Animated.Value(0)).current;

  const [adSheet, setAdSheet] = React.useState(false);
  const [isAdLoading, setIsAdLoading] = React.useState(false);
  const [adUnavailable, setAdUnavailable] = React.useState(false);
  // Separate gate state for the social-share (Instagram) flow.
  const [shareGate, setShareGate] = React.useState(false);
  const [shareAdLoading, setShareAdLoading] = React.useState(false);
  const [shareAdUnavailable, setShareAdUnavailable] = React.useState(false);
  const pendingShareVariantRef = React.useRef(null);
  // Local "create card" modal — rendered on THIS screen so it overlays the
  // Use-in-Conversation screen instead of navigating to StoryDetail.
  const [shareCardVisible, setShareCardVisible] = React.useState(false);
  const [shareCardContent, setShareCardContent] = React.useState(['quote']);
  const [shareCardOverride, setShareCardOverride] = React.useState('');
  // Holds a loaded rewarded ad to show only after the sheet Modal is fully
  // dismissed — showing it while the Modal is still presented makes iOS throw
  // "already presenting another view controller" and Android freeze.
  const pendingRewardedRef = React.useRef(null);

  useEffect(() => {
    const blocked = Boolean(showStorytellerFor || shareSheetVisible || shareGate || adSheet || shareCardVisible);
    setBadgePresentationBlocked('conversation_overlay', blocked);
    return () => setBadgePresentationBlocked('conversation_overlay', false);
  }, [showStorytellerFor, shareSheetVisible, shareGate, adSheet, shareCardVisible, setBadgePresentationBlocked]);

  const flushPendingRewarded = () => {
    const p = pendingRewardedRef.current;
    if (!p) return;
    pendingRewardedRef.current = null;
    showRewarded(p.ad, { onEarned: p.onEarned, onClosed: p.onClosed });
  };

  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    setCopyToastVisible(true);
    Animated.sequence([
      Animated.timing(toastAnim, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.delay(1300),
      Animated.timing(toastAnim, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]).start(() => setCopyToastVisible(false));
  }, [toastAnim]);

  const handlePremiumTap = useCallback(() => {
    trackEvent(ANALYTICS_EVENTS.AD_OR_PREMIUM_CHOICE, {
      source: 'use_in_conversation_storyteller_gate',
      choice: 'premium',
    });
    // Close the Storyteller (Practice) overlay FIRST. It's a full-screen
    // native Modal — stacking the ad/premium sheet or the Paywall screen
    // underneath/on top of it leaves the overlay stuck and unresponsive
    // (can't be closed, buttons stop registering taps) once the second
    // modal is dismissed. Dismiss it before presenting anything else.
    setShowStorytellerFor(null);
    setTimeout(() => {
      navigation.navigate('Paywall', { source: 'use_in_conversation', reason: 'storyteller_mode' });
    }, 250);
  }, [navigation]);

  const handleWatchAdUIC = async () => {
    setIsAdLoading(true);
    trackEvent(ANALYTICS_EVENTS.AD_OR_PREMIUM_CHOICE, { source: 'use_in_conversation', choice: 'ad' });
    const ad = await loadRewarded();
    setIsAdLoading(false);
    if (!ad) {
      setAdUnavailable(true);
      trackEvent(ANALYTICS_EVENTS.AD_FAILED_TO_LOAD, { source: 'use_in_conversation', storyId: story?.story_id, lang });
      return;
    }
    setAdUnavailable(false);
    // Queue the ad and close the sheet. Shown from the Modal's onDismiss (iOS)
    // or a fallback timer (Android) — never while the Modal is presented.
    pendingRewardedRef.current = {
      ad,
      onEarned: () => trackEvent(ANALYTICS_EVENTS.REWARDED_AD_COMPLETED, { source: 'use_in_conversation' }),
    };
    setAdSheet(false);
    setTimeout(flushPendingRewarded, 600);
  };

  // --- Social-share (Instagram visual card) gate -------------------------
  // Run the premium/ad gate HERE, then open the card modal ON this screen so
  // the Use-in-Conversation screen stays in the background (no navigation).
  const openShareCard = (variant) => {
    setShareCardContent([mapVariantToPreset(variant)]);
    setShareCardOverride(variant?.body || '');
    setShareCardVisible(true);
  };

  const handleWatchAdForShare = async () => {
    const variant = pendingShareVariantRef.current;
    setShareAdLoading(true);
    trackEvent(ANALYTICS_EVENTS.AD_OR_PREMIUM_CHOICE, { source: 'use_in_conversation_share', choice: 'ad' });
    const ad = await loadRewarded();
    setShareAdLoading(false);
    if (!ad) {
      setShareAdUnavailable(true);
      trackEvent(ANALYTICS_EVENTS.AD_FAILED_TO_LOAD, { source: 'use_in_conversation_share', storyId: story?.story_id, lang });
      return;
    }
    setShareAdUnavailable(false);
    let earned = false;
    pendingRewardedRef.current = {
      ad,
      onEarned: () => {
        earned = true;
        trackEvent(ANALYTICS_EVENTS.REWARDED_AD_COMPLETED, { source: 'use_in_conversation_share' });
      },
      // Open the share card only after the ad fully closes, so nothing
      // changes on screen while the ad is showing.
      onClosed: () => { if (earned && variant) openShareCard(variant); },
    };
    setShareGate(false);
    setTimeout(flushPendingRewarded, 600);
  };

  const handleSelect = useCallback((id) => {
    setSelectedId(id);
  }, []);

  const handleSelectContext = useCallback((context) => {
    setSelectedContext(prev => {
      const next = prev === context ? null : context;
      const preferred = next && CONTEXT_TO_VARIANT[next];
      if (preferred && variants.some(v => v.id === preferred)) setSelectedId(preferred);
      return next;
    });
  }, [variants]);

  const handleCopy = useCallback(async () => {
    if (!selected) return;
    const Clipboard = require('expo-clipboard');
    await Clipboard.setStringAsync(selected.body);
    trackEvent(ANALYTICS_EVENTS.MICRO_VARIANT_COPIED, {
      storyId: story?.story_id,
      variantType: selected.type,
      variantId: selected.id,
      lang,
    });
    recordVariantUsage({
      storyId: story?.story_id,
      storyTitle: story?.title,
      storyCategory: story?.parent_cat || story?.cat || null,
      variantType: selected.type,
      variantId: selected.id,
      action: 'copy',
    });
    showToast(t('mv_copy_toast', lang));
  }, [selected, story, lang, recordVariantUsage, showToast]);

  const handleSharePlatform = useCallback(async (platform) => {
    if (!selected) return;
    const variant = selected;

    // Instagram → visual share card. Gate premium/ad HERE first so the ad
    // shows over this screen.
    if (platform === 'instagram') {
      trackEvent(ANALYTICS_EVENTS.SOCIAL_SHARE_PLATFORM, {
        platform: 'instagram',
        storyId: story?.story_id,
        variantType: variant.type,
        lang,
      });
      const gate = rewardedGate({ isPremium });
      if (gate === 'allow') {
        openShareCard(variant);
      } else {
        trackEvent(ANALYTICS_EVENTS.FREE_LIMIT_TO_PAYWALL, {
          source: 'use_in_conversation_share',
          storyId: story?.story_id,
          lang,
        });
        // Without rewarded inventory the visual card stays a paid feature.
        if (gate === 'paywall') {
          navigation.navigate('Paywall', { reason: 'image_card', source: 'use_in_conversation' });
        } else {
          pendingShareVariantRef.current = variant;
          setShareAdUnavailable(false);
          setShareGate(true);
        }
      }
      return;
    }

    const payload = buildNativeShareText({
      story,
      variant,
      lang,
      categoryLabel: displayCat,
    });

    setBadgePresentationBlocked('conversation_native_share', true);
    try {
      const result = await Share.share({
        message: payload,
        title: story?.title || t('mv_screen_title', lang),
      });
      trackEvent(ANALYTICS_EVENTS.SOCIAL_SHARE_PLATFORM, {
        platform: 'native',
        storyId: story?.story_id,
        variantType: variant.type,
        lang,
      });
      const wasDismissed = Share.dismissedAction && result?.action === Share.dismissedAction;
      if (!wasDismissed) incrementShareCount?.();
    } catch (error) {
      if (error?.message && /cancel|dismiss/i.test(error.message)) return;
      console.warn('Native share failed', error);
    } finally {
      setTimeout(() => setBadgePresentationBlocked('conversation_native_share', false), 450);
    }

    recordVariantUsage({
      storyId: story?.story_id,
      storyTitle: story?.title,
      storyCategory: story?.parent_cat || story?.cat || null,
      variantType: variant.type,
      variantId: variant.id,
      action: 'share_native',
    });
  }, [selected, story, displayCat, lang, navigation, recordVariantUsage, incrementShareCount, isPremium, setBadgePresentationBlocked]);

  /**
   * Share-sheet rows run their action only after the sheet Modal has closed —
   * presenting the native share sheet, the ad sheet or the card modal while
   * another Modal is still up freezes Android and throws on iOS.
   */
  const handleShareSheetAction = useCallback((action) => {
    setShareSheetVisible(false);
    setTimeout(() => {
      if (action === 'copy') handleCopy();
      else handleSharePlatform(action);
    }, 320);
  }, [handleCopy, handleSharePlatform]);

  const handleToggleUsed = useCallback(async () => {
    if (!selected) return;
    if (!storyCompleted) {
      showToast(t('career.application.completeFirst', lang));
      return;
    }
    const variantKey = getUsageVariantKey(story?.story_id, selected.id);
    const wasMarked = markedUsedIds.has(variantKey);

    if (!wasMarked) {
      setMarkedUsedIds(prev => new Set([...prev, variantKey]));
      const result = await recordVariantUsage({
        storyId: story?.story_id,
        storyTitle: story?.title,
        storyCategory: story?.parent_cat || story?.cat || null,
        categoryId: story?.parent_cat_id ?? null,
        variantType: selected.type,
        variantId: selected.id,
        variantKey,
        action: 'mark_used',
        context: selectedContext,
      });
      if (!result?.saved) {
        setMarkedUsedIds(prev => {
          const next = new Set(prev);
          next.delete(variantKey);
          return next;
        });
        showToast(t(result?.reason === 'quota_exceeded' ? 'career.application.limitReached' : 'career.application.syncFailed', lang));
      }
    } else {
      setMarkedUsedIds(prev => {
        const next = new Set(prev);
        next.delete(variantKey);
        return next;
      });
      await removeVariantUsage({
        storyId: story?.story_id,
        variantId: selected.id,
        variantKey,
      });
    }
  }, [markedUsedIds, selected, selectedContext, story, storyCompleted, recordVariantUsage, removeVariantUsage, showToast, lang]);

  const handleStorytellerOpen = useCallback(() => {
    if (!selected) return;
    setShowStorytellerFor(selected);
    trackEvent(ANALYTICS_EVENTS.STORYTELLER_MODE_OPENED, {
      storyId: story?.story_id,
      variantType: selected?.type,
      lang,
    });
  }, [selected, story?.story_id, lang]);

  const handleStorytellerDone = useCallback(async () => {
    if (!showStorytellerFor) return;
    if (!isStoryCompleted(story?.story_id)) {
      setShowStorytellerFor(null);
      showToast(t('career.application.completeFirst', lang));
      return;
    }
    const variant = showStorytellerFor;
    const variantKey = getUsageVariantKey(story?.story_id, variant.id);
    setMarkedUsedIds(prev => new Set([...prev, variantKey]));
    const result = await recordVariantUsage({
      storyId: story?.story_id,
      storyTitle: story?.title,
      storyCategory: story?.parent_cat || story?.cat || null,
      categoryId: story?.parent_cat_id ?? null,
      variantType: variant.type,
      variantId: variant.id,
      variantKey,
      action: 'mark_used',
      careerEventSubtype: 'practice_completed',
      context: selectedContext,
    });
    if (!result?.saved) {
      setMarkedUsedIds(prev => {
        const next = new Set(prev);
        next.delete(variantKey);
        return next;
      });
      showToast(t(result?.reason === 'quota_exceeded' ? 'career.application.limitReached' : 'career.application.syncFailed', lang));
      setShowStorytellerFor(null);
      return;
    }
    trackEvent(ANALYTICS_EVENTS.STORYTELLER_PRACTICE_COMPLETED, {
      storyId: story?.story_id,
      variantType: variant.type,
      lang,
    });
    setShowStorytellerFor(null);
  }, [showStorytellerFor, selectedContext, story, isStoryCompleted, recordVariantUsage, lang, showToast]);

  const styles = buildStyles(colors, isDark, insets);

  const isUsed = selected
    ? markedUsedIds.has(getUsageVariantKey(story?.story_id, selected.id))
    : false;

  const bodyText = selected?.body || '';
  const isLong = bodyText.length > 150;
  const speakLine = t('mv_speak_time', lang, { sec: estimateSpeakSeconds(bodyText) });
  const showEssence = Boolean(keyContrast) && keyContrast !== bodyText;

  const shareRows = [
    {
      key: 'instagram',
      icon: 'logo-instagram',
      title: t('mv_share_ig_card', lang),
      sub: t('mv_share_ig_card_sub', lang),
      premium: !isPremium,
    },
    {
      key: 'native',
      icon: 'share-outline',
      title: t('mv_share_other_apps', lang),
      sub: t('mv_share_other_sub', lang),
    },
    {
      key: 'copy',
      icon: 'copy-outline',
      title: t('mv_copy', lang),
      sub: t('mv_copy_sub', lang),
    },
  ];

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safe}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* ── AppBar: back · title · share ─────────────────────────────────── */}
      <View style={styles.appBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconBtn}
          accessibilityLabel={entrySource === 'story_use_case' ? t('convoBackToStory', lang) : t('backBtn', lang)}
          accessibilityRole="button"
        >
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </TouchableOpacity>

        <Text style={styles.appBarTitle} numberOfLines={1}>
          {t('mv_appbar_title', lang)}
        </Text>

        <TouchableOpacity
          onPress={() => setShareSheetVisible(true)}
          style={styles.iconBtn}
          accessibilityLabel={t('mv_share_sheet_title', lang)}
          accessibilityRole="button"
        >
          <Ionicons name="share-outline" size={21} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Story header (compact) ───────────────────────────────────── */}
        <View style={styles.storyHeader}>
          <Text style={[styles.categoryLabel, { color: colors.textSecondary }]} numberOfLines={1}>
            <Text style={{ color: categoryTheme.accent }}>{displayCat ? displayCat.toUpperCase() : ''}</Text>
            {story.min ? `  ·  ${story.min} ${t('minLabel', lang)}` : ''}
          </Text>
          <Text style={styles.storyTitle} numberOfLines={2}>
            {story.title}
          </Text>
        </View>

        {/* ── 1. Where? — context chips ────────────────────────────────── */}
        <Text style={styles.sectionLabel}>{t('mv_where_label', lang)}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipScroll}
          contentContainerStyle={styles.chipRow}
        >
          {CONTEXTS.map(ctx => {
            const active = selectedContext === ctx;
            return (
              <TouchableOpacity
                key={ctx}
                onPress={() => handleSelectContext(ctx)}
                activeOpacity={0.85}
                style={[styles.chip, active && styles.chipActive]}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]} numberOfLines={1}>
                  {contextLabel(ctx, lang)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── 2. Length — segmented control ────────────────────────────── */}
        <View style={styles.segment} accessibilityRole="tablist">
          {variants.map(v => {
            const active = v.id === selected?.id;
            return (
              <TouchableOpacity
                key={v.id}
                style={[styles.segmentItem, active && styles.segmentItemActive]}
                onPress={() => handleSelect(v.id)}
                activeOpacity={0.85}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                accessibilityLabel={v.title}
              >
                <Text
                  style={[styles.segmentText, active && styles.segmentTextActive]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.85}
                >
                  {v.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {selected ? <Text style={styles.hint}>{selected.hint}</Text> : null}

        {/* ── 3. Preview card ──────────────────────────────────────────── */}
        {selected && (
          <View style={styles.previewCard}>
            <View style={styles.quoteRow}>
              <View style={styles.quoteBar} />
              <Text selectable style={[styles.quoteText, isLong && styles.quoteTextLong]}>
                {bodyText}
              </Text>
            </View>

            {showEssence ? (
              <View style={styles.essenceRow}>
                <Text style={styles.essenceLabel}>{t('mv_essence_label', lang).toUpperCase()}</Text>
                <Text style={styles.essenceText}>{keyContrast}</Text>
              </View>
            ) : null}

            <View style={styles.previewFooter}>
              <View style={styles.speakRow}>
                <Ionicons name="time-outline" size={13} color={colors.textSecondary} />
                <Text style={styles.speakText}>{speakLine}</Text>
              </View>
              <TouchableOpacity
                onPress={handleCopy}
                style={styles.copyIconBtn}
                accessibilityRole="button"
                accessibilityLabel={t('mv_copy', lang)}
              >
                <Ionicons name="copy-outline" size={16} color={colors.primaryText} />
                <Text style={styles.copyIconText}>{t('mv_copy', lang)}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* ── 4. Bottom dock: Practice (primary) + I used it ──────────────── */}
      <View style={styles.dock}>
        {!storyCompleted ? (
          <View style={styles.lockedHintRow}>
            <Ionicons name="lock-closed-outline" size={12} color={colors.textSecondary} />
            <Text style={styles.lockedHint}>{t('mv_used_locked_hint', lang)}</Text>
          </View>
        ) : null}
        <View style={styles.dockRow}>
          <TouchableOpacity
            onPress={handleStorytellerOpen}
            activeOpacity={0.9}
            style={styles.dockPrimaryWrap}
            accessibilityRole="button"
            accessibilityLabel={t('mv_practice_cta', lang)}
          >
            <LinearGradient
              colors={[colors.ctaGradientEnd, colors.ctaGradientStart]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.dockPrimary}
            >
              <Ionicons name="mic-outline" size={18} color={colors.onPrimary} />
              <Text style={styles.dockPrimaryText} numberOfLines={1}>{t('mv_practice_cta', lang)}</Text>
              {!isPremium ? (
                <View style={styles.premiumDot}>
                  <Ionicons name="star" size={8} color={colors.primary} />
                </View>
              ) : null}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.dockSecondary,
              isUsed && styles.dockSecondaryActive,
              !storyCompleted && styles.dockSecondaryLocked,
            ]}
            onPress={handleToggleUsed}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityState={{ selected: isUsed }}
            accessibilityLabel={t('mv_mark_used', lang)}
          >
            <Ionicons
              name={isUsed ? 'checkmark-circle' : 'checkmark-circle-outline'}
              size={18}
              color={isUsed ? colors.success : colors.text}
            />
            <Text
              style={[styles.dockSecondaryText, isUsed && { color: colors.success }]}
              numberOfLines={1}
            >
              {t('mv_used_cta', lang)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Toast (top, so it never covers the dock) ────────────────────── */}
      {copyToastVisible && (
        <Animated.View
          style={[
            styles.copyToast,
            {
              opacity: toastAnim,
              transform: [{ translateY: toastAnim.interpolate({ inputRange: [0, 1], outputRange: [-10, 0] }) }],
            },
          ]}
          pointerEvents="none"
        >
          <Ionicons name="checkmark-circle" size={16} color={colors.success} />
          <Text style={styles.copyToastText}>{toastMsg}</Text>
        </Animated.View>
      )}

      {/* ── Share sheet ─────────────────────────────────────────────────── */}
      <Modal
        visible={shareSheetVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setShareSheetVisible(false)}
        accessibilityViewIsModal
      >
        <Pressable style={styles.sheetBackdrop} onPress={() => setShareSheetVisible(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>{t('mv_share_sheet_title', lang)}</Text>
            {shareRows.map(row => (
              <TouchableOpacity
                key={row.key}
                style={styles.sheetRow}
                onPress={() => handleShareSheetAction(row.key)}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel={row.title}
              >
                <View style={styles.sheetIcon}>
                  <Ionicons name={row.icon} size={20} color={colors.text} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sheetRowTitle}>{row.title}</Text>
                  <Text style={styles.sheetRowSub}>{row.sub}</Text>
                </View>
                {row.premium ? (
                  <View style={styles.sheetPremium}>
                    <Ionicons name="star" size={10} color={colors.onPrimary} />
                  </View>
                ) : (
                  <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
                )}
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>

      {/* ── Storyteller Overlay ──────────────────────────────────────────── */}
      <StorytellerOverlay
        visible={!!showStorytellerFor}
        story={story}
        variant={showStorytellerFor}
        initialContext={selectedContext}
        isPremium={isPremium}
        onClose={() => setShowStorytellerFor(null)}
        onDone={handleStorytellerDone}
        onPremiumTap={handlePremiumTap}
        colors={colors}
        layout={layout}
        isDark={isDark}
        lang={lang}
      />

      {/* Ad or Premium Sheet */}
      <AdOrPremiumSheet
        visible={adSheet}
        onClose={() => {
          trackEvent(ANALYTICS_EVENTS.AD_OR_PREMIUM_CHOICE, { source: 'use_in_conversation', choice: 'dismiss' });
          setAdUnavailable(false);
          setAdSheet(false);
        }}
        onDismiss={flushPendingRewarded}
        onWatchAd={handleWatchAdUIC}
        onGoPremium={() => {
          trackEvent(ANALYTICS_EVENTS.AD_OR_PREMIUM_CHOICE, { source: 'use_in_conversation', choice: 'premium' });
          setAdUnavailable(false);
          setAdSheet(false);
          navigation.navigate('Paywall', { source: 'use_in_conversation', reason: 'storyteller_mode' });
        }}
        adUnavailable={adUnavailable}
        isAdLoading={isAdLoading}
        lang={lang}
      />

      {/* Ad or Premium Sheet — social share (Instagram) gate */}
      <AdOrPremiumSheet
        visible={shareGate}
        onClose={() => {
          trackEvent(ANALYTICS_EVENTS.AD_OR_PREMIUM_CHOICE, { source: 'use_in_conversation_share', choice: 'dismiss' });
          setShareAdUnavailable(false);
          setShareGate(false);
          pendingShareVariantRef.current = null;
        }}
        onDismiss={flushPendingRewarded}
        onWatchAd={handleWatchAdForShare}
        onGoPremium={() => {
          trackEvent(ANALYTICS_EVENTS.AD_OR_PREMIUM_CHOICE, { source: 'use_in_conversation_share', choice: 'premium' });
          setShareAdUnavailable(false);
          setShareGate(false);
          pendingShareVariantRef.current = null;
          navigation.navigate('Paywall', { source: 'use_in_conversation', reason: 'image_card' });
        }}
        adUnavailable={shareAdUnavailable}
        isAdLoading={shareAdLoading}
        lang={lang}
      />

      {/* Create-card modal — overlays this screen, no navigation */}
      <ShareCardModal
        visible={shareCardVisible}
        onClose={() => setShareCardVisible(false)}
        story={story}
        lang={lang}
        localLang={lang}
        initialContent={shareCardContent}
        initialFormat="post"
        initialOverrideText={shareCardOverride}
        shareSource="use_in_conversation"
      />
    </SafeAreaView>
  );
};

// ─── styles ─────────────────────────────────────────────────────────────────

const buildStyles = (colors, isDark, insets) => {
  const HPAD = 20;
  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.background,
    },

    // AppBar
    appBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 8,
      height: 52,
    },
    iconBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
    },
    appBarTitle: {
      flex: 1,
      textAlign: 'center',
      fontFamily: 'Inter_600SemiBold',
      fontSize: 16,
      color: colors.text,
    },

    // Scroll
    scrollContent: {
      paddingHorizontal: HPAD,
      paddingBottom: 20,
    },

    // Story header
    storyHeader: {
      paddingTop: 4,
      paddingBottom: 18,
    },
    categoryLabel: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 11,
      letterSpacing: 1.4,
      marginBottom: 6,
    },
    storyTitle: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: 20,
      lineHeight: 26,
      color: colors.text,
    },

    // Section label
    sectionLabel: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 10,
    },

    // Context chips
    chipScroll: {
      marginHorizontal: -HPAD,
      flexGrow: 0,
    },
    chipRow: {
      paddingHorizontal: HPAD,
      gap: 6,
    },
    chip: {
      height: 36,
      paddingHorizontal: 11,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surfaceContainerLowest,
      alignItems: 'center',
      justifyContent: 'center',
    },
    chipActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primaryContainer,
    },
    chipText: {
      fontFamily: 'Inter_500Medium',
      fontSize: 13,
      color: colors.text,
    },
    chipTextActive: {
      fontFamily: 'Inter_600SemiBold',
      color: colors.primaryText,
    },

    // Segmented control
    segment: {
      flexDirection: 'row',
      marginTop: 18,
      padding: 3,
      borderRadius: 12,
      backgroundColor: colors.backgroundDark,
      borderWidth: 1,
      borderColor: colors.border,
    },
    segmentItem: {
      flex: 1,
      height: 36,
      borderRadius: 9,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 4,
    },
    segmentItemActive: {
      backgroundColor: isDark ? colors.primaryContainer : colors.surfaceContainerLowest,
      shadowColor: '#000',
      shadowOpacity: isDark ? 0 : 0.08,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 1 },
      elevation: isDark ? 0 : 1,
    },
    segmentText: {
      fontFamily: 'Inter_500Medium',
      fontSize: 13.5,
      color: colors.textSecondary,
    },
    segmentTextActive: {
      fontFamily: 'Inter_600SemiBold',
      color: isDark ? colors.primaryText : colors.text,
    },
    hint: {
      fontFamily: 'Inter_400Regular',
      fontSize: 12.5,
      lineHeight: 18,
      color: colors.textSecondary,
      marginTop: 8,
      marginBottom: 14,
      paddingHorizontal: 2,
    },

    // Preview card
    previewCard: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surfaceContainerLowest,
      paddingTop: 18,
      paddingHorizontal: 18,
      paddingBottom: 8,
      shadowColor: '#000',
      shadowOpacity: isDark ? 0 : 0.05,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 2,
    },
    quoteRow: {
      flexDirection: 'row',
      gap: 12,
    },
    quoteBar: {
      width: 3.5,
      borderRadius: 2,
      backgroundColor: colors.primary,
    },
    quoteText: {
      flex: 1,
      fontFamily: 'PlayfairDisplay_600SemiBold',
      fontSize: 20,
      lineHeight: 29,
      color: colors.text,
    },
    quoteTextLong: {
      fontFamily: 'Inter_400Regular',
      fontSize: 16,
      lineHeight: 26,
    },
    essenceRow: {
      marginTop: 16,
      paddingTop: 12,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
      gap: 4,
    },
    essenceLabel: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 10.5,
      letterSpacing: 1.2,
      color: colors.primaryText,
    },
    essenceText: {
      fontFamily: 'Inter_500Medium',
      fontSize: 14,
      lineHeight: 20,
      color: colors.text,
    },
    previewFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    speakRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      flexShrink: 1,
    },
    speakText: {
      fontFamily: 'Inter_400Regular',
      fontSize: 12,
      color: colors.textSecondary,
    },
    copyIconBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      minHeight: 44,
      paddingHorizontal: 8,
      marginRight: -8,
    },
    copyIconText: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 13,
      color: colors.primaryText,
    },

    // Dock
    dock: {
      paddingHorizontal: HPAD,
      paddingTop: 10,
      paddingBottom: Math.max(insets.bottom, 12) + 2,
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    lockedHintRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 5,
      marginBottom: 8,
    },
    lockedHint: {
      fontFamily: 'Inter_400Regular',
      fontSize: 12,
      color: colors.textSecondary,
    },
    dockRow: {
      flexDirection: 'row',
      gap: 10,
    },
    dockPrimaryWrap: {
      flex: 1.35,
    },
    dockPrimary: {
      height: 52,
      borderRadius: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingHorizontal: 12,
    },
    dockPrimaryText: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 16,
      color: colors.onPrimary,
      flexShrink: 1,
    },
    premiumDot: {
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: colors.onPrimary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dockSecondary: {
      flex: 1,
      height: 52,
      borderRadius: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      paddingHorizontal: 10,
      backgroundColor: colors.surfaceContainerLowest,
      borderWidth: 1,
      borderColor: colors.border,
    },
    dockSecondaryActive: {
      borderColor: colors.success,
      backgroundColor: isDark ? `${colors.success}1A` : '#EAF4EB',
    },
    dockSecondaryLocked: {
      opacity: 0.55,
    },
    dockSecondaryText: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 15,
      color: colors.text,
      flexShrink: 1,
    },

    // Share sheet
    sheetBackdrop: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0.46)',
    },
    sheet: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingHorizontal: 16,
      paddingTop: 10,
      paddingBottom: Math.max(insets.bottom + 12, 24),
    },
    sheetHandle: {
      alignSelf: 'center',
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.border,
      marginBottom: 12,
    },
    sheetTitle: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 16,
      color: colors.text,
      paddingHorizontal: 4,
      marginBottom: 8,
    },
    sheetRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      minHeight: 60,
      paddingHorizontal: 4,
    },
    sheetIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.backgroundDark,
      borderWidth: 1,
      borderColor: colors.border,
    },
    sheetRowTitle: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 15,
      color: colors.text,
    },
    sheetRowSub: {
      fontFamily: 'Inter_400Regular',
      fontSize: 12.5,
      color: colors.textSecondary,
      marginTop: 1,
    },
    sheetPremium: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },

    // Toast
    copyToast: {
      position: 'absolute',
      left: HPAD,
      right: HPAD,
      top: insets.top + 56,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 11,
      backgroundColor: isDark ? '#2B2A24' : '#EAF6EC',
      borderWidth: 1,
      borderColor: isDark ? colors.border : '#CDE6D1',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    copyToastText: {
      flex: 1,
      fontFamily: 'Inter_500Medium',
      fontSize: 12,
      color: isDark ? colors.text : '#2E5F37',
    },
  });
};

export default UseInConversationScreen;

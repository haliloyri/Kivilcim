/**
 * UseInConversationScreen  (v2 — redesign)
 *
 * "Use in Conversation" screen — redesigned around a single calm-premium flow:
 *   1. 2x2 format selector grid (Punchline / 30s / Question / Key Contrast)
 *   2. One large preview card for the selected format (quote-block styling)
 *   3. Fixed bottom action dock:
 *        · share row (Instagram first) — targeted one-tap shares
 *        · "Copy" gold primary CTA — the universal action
 *        · "Practice" + "Used" toggle — secondary
 *
 * Design language: DESIGN_NEW (single gold accent, no per-category colors,
 * Playfair headings + Inter body). All variants are free.
 * Premium gates: Storyteller Mode + Instagram visual card.
 *
 * Receives: route.params.story  (same shape as StoryDetailScreen)
 */
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  Share,
  Animated,
  Modal,
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
import { shouldShowAd, loadRewarded, showRewarded } from '../utils/ads';
import { getCategoryTheme } from '../utils/categoryImages';

// ─── helpers ────────────────────────────────────────────────────────────────

/** Extract text between the first pair of `marker` occurrences in body */
const extractMarker = (body, marker) => {
  const start = body.indexOf(marker);
  if (start === -1) return '';
  const segment = body.substring(start + marker.length);
  let end = segment.length;
  ['##', '$$', '&&'].forEach(m => {
    const idx = segment.indexOf(m);
    if (idx !== -1 && idx < end) end = idx;
  });
  return segment.substring(0, end).trim();
};

/** Strip all marker-wrapped blocks and return clean body text */
const cleanBodyText = (body) =>
  body
    .replace(/##[\s\S]*?##/g, '')
    .replace(/\$\$[\s\S]*?\$\$/g, '')
    .replace(/&&[\s\S]*?&&/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

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
      ONE_WORD: 'Tek kelime, büyük etki:',
      fallback: 'Bu hikayeyi sevdim:',
      engage: 'Sence bunun en kritik noktası ne?',
      tags: '#Albor #Farkındalık #KişiselGelişim #KitapNotları',
    },
    en: {
      PUNCHLINE: 'Today\'s sharpest takeaway:',
      QUESTION: 'Ask yourself this today:',
      THIRTY_SEC: 'This in 30 seconds:',
      ONE_WORD: 'One word, big impact:',
      fallback: 'This story stayed with me:',
      engage: 'What part resonates with you most?',
      tags: '#Albor #Mindset #Growth #BookNotes',
    },
    es: {
      PUNCHLINE: 'La idea mas potente de hoy:',
      QUESTION: 'Preguntate esto hoy:',
      THIRTY_SEC: 'Esto en 30 segundos:',
      ONE_WORD: 'Una palabra, gran impacto:',
      fallback: 'Esta historia me impacto:',
      engage: 'Que parte te resuena mas?',
      tags: '#Albor #Mentalidad #Crecimiento #NotasDeLibros',
    },
    de: {
      PUNCHLINE: 'Die kraftigste Erkenntnis heute:',
      QUESTION: 'Stell dir heute diese Frage:',
      THIRTY_SEC: 'In 30 Sekunden:',
      ONE_WORD: 'Ein Wort, grosse Wirkung:',
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

/** Map variant type → share preset name used by StoryDetailScreen's share modal */
const mapVariantToPreset = (variant) => {
  switch (variant?.type) {
    case 'PUNCHLINE':  return 'quote';
    case 'THIRTY_SEC': return 'lesson';
    case 'QUESTION':   return 'reflection';
    default:           return 'quote';
  }
};

const getUsageVariantKey = (storyId, variantId) => `${String(storyId)}:${String(variantId)}`;

const buildMicroVariants = (story, lang) => {
  const body = story.body || '';
  const quote       = extractMarker(body, '##');
  const lesson      = extractMarker(body, '$$');
  const reflection  = extractMarker(body, '&&');
  const punchline   = (story.conversation_punchline || '').trim();
  const thirtySec   = (story.conversation_thirty_sec || story.thirty_sec || '').trim();
  const question    = (story.conversation_question || '').trim();
  const keyContrast = (story.conversation_key_contrast || '').trim();
  const clean       = cleanBodyText(body);

  const candidates = [
    {
      id: 'punchline',
      type: 'PUNCHLINE',
      title: t('mv_punchline', lang),
      gridDesc: t('mv_grid_desc_punchline', lang),
      icon: 'flame-outline',
      iconActive: 'flame',
      body: punchline || lesson || quote,
      toneTag: t('mv_tone_bold', lang),
    },
    {
      id: 'thirty_sec',
      type: 'THIRTY_SEC',
      title: t('mv_thirty_sec', lang),
      gridDesc: t('mv_grid_desc_thirty', lang),
      icon: 'time-outline',
      iconActive: 'time',
      body: thirtySec || (clean.length > 320 ? clean.substring(0, 320).trimEnd() + '…' : clean),
      toneTag: t('mv_tone_story', lang),
    },
    {
      id: 'question',
      type: 'QUESTION',
      title: t('mv_question', lang),
      gridDesc: t('mv_grid_desc_question', lang),
      icon: 'chatbubble-ellipses-outline',
      iconActive: 'chatbubble-ellipses',
      body: question || reflection,
      toneTag: t('mv_tone_curious', lang),
    },
    {
      id: 'one_word',
      type: 'ONE_WORD',
      title: t('mv_one_word', lang),
      gridDesc: t('mv_grid_desc_contrast', lang),
      icon: 'key-outline',
      iconActive: 'key',
      body: keyContrast || (quote && quote !== lesson ? quote : ''),
      toneTag: t('mv_tone_minimal', lang),
    },
  ];

  return candidates.filter(v => v.body.length > 0);
};

/** Which platform a given length comfortably fits (for the char hint) */
const platformFitLabel = (len, lang) => {
  if (len <= 280) return t('mv_share_on_x', lang);
  if (len <= 500) return t('mv_share_on_threads', lang);
  return null;
};

// ─── screen ─────────────────────────────────────────────────────────────────

const UseInConversationScreen = ({ route, navigation }) => {
  const { story } = route.params;
  const { colors, layout, isDark, lang } = useTheme();
  const { isPremium, recordVariantUsage, removeVariantUsage, recordPrivateCareerApplication, variantUsage, incrementShareCount, isStoryCompleted, setBadgePresentationBlocked } = useUserData();
  const insets = useSafeAreaInsets();

  const variants = useMemo(() => buildMicroVariants(story, lang), [story, lang]);

  const displayCat = t(story.parent_cat || story.cat || '', lang);
  const categoryTheme = getCategoryTheme(story.parent_cat_raw || story.parent_cat || story.cat, isDark);

  // Track screen open
  useEffect(() => {
    trackEvent(ANALYTICS_EVENTS.USE_IN_CONVO_OPENED, {
      storyId: story?.story_id,
      source: 'screen_mount',
      lang,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Selected format (single-select)
  const [selectedId, setSelectedId] = useState(() => variants[0]?.id ?? null);
  const selected = useMemo(
    () => variants.find(v => v.id === selectedId) || variants[0] || null,
    [variants, selectedId],
  );

  const [copyToastVisible, setCopyToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [showStorytellerFor, setShowStorytellerFor] = useState(null);
  const [privatePlanVisible, setPrivatePlanVisible] = useState(false);
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
    const blocked = Boolean(showStorytellerFor || privatePlanVisible || shareGate || adSheet || shareCardVisible);
    setBadgePresentationBlocked('conversation_overlay', blocked);
    return () => setBadgePresentationBlocked('conversation_overlay', false);
  }, [showStorytellerFor, privatePlanVisible, shareGate, adSheet, shareCardVisible, setBadgePresentationBlocked]);

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

    // Instagram → visual share card on StoryDetail. Gate premium/ad HERE first
    // so the ad shows over this screen; only navigate once the gate is passed.
    if (platform === 'instagram') {
      trackEvent(ANALYTICS_EVENTS.SOCIAL_SHARE_PLATFORM, {
        platform: 'instagram',
        storyId: story?.story_id,
        variantType: variant.type,
        lang,
      });
      if (isPremium || !shouldShowAd({ isPremium, isOnboarded: true })) {
        openShareCard(variant);
      } else {
        pendingShareVariantRef.current = variant;
        setShareAdUnavailable(false);
        setShareGate(true);
        trackEvent(ANALYTICS_EVENTS.FREE_LIMIT_TO_PAYWALL, {
          source: 'use_in_conversation_share',
          storyId: story?.story_id,
          lang,
        });
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

  const handleToggleUsed = useCallback(async () => {
    if (!selected) return;
    if (!isStoryCompleted(story?.story_id)) {
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
  }, [markedUsedIds, selected, story, isStoryCompleted, recordVariantUsage, removeVariantUsage, showToast, lang]);

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
  }, [showStorytellerFor, story, isStoryCompleted, recordVariantUsage, lang, showToast]);

  const handlePrivatePlan = useCallback(async (context) => {
    setPrivatePlanVisible(false);
    const result = await recordPrivateCareerApplication({
      storyId: story?.story_id,
      categoryId: story?.parent_cat_id ?? null,
      context,
    });
    showToast(t(result?.reason === 'story_not_completed' ? 'career.privatePlan.completeFirst' : 'career.privatePlan.saved', lang));
  }, [recordPrivateCareerApplication, showToast, story, lang]);

  // AI rewrite — UI present; backend not wired yet (gentle "coming soon").
  const handleAiRewrite = useCallback(() => {
    trackEvent(ANALYTICS_EVENTS.USE_IN_CONVO_OPENED, {
      storyId: story?.story_id,
      source: 'ai_rewrite_tap',
      lang,
    });
    showToast(t('mv_ai_soon', lang));
  }, [story?.story_id, lang, showToast]);

  const styles = buildStyles(colors, isDark, insets);

  const isUsed = selected
    ? markedUsedIds.has(getUsageVariantKey(story?.story_id, selected.id))
    : false;

  const charCount = selected ? selected.body.length : 0;
  const fitLabel = platformFitLabel(charCount, lang);
  const charLine = fitLabel
    ? `${charCount} ${t('mv_chars', lang)} · ${t('mv_fits_platform', lang).replace('{{platform}}', fitLabel)}`
    : `${charCount} ${t('mv_chars', lang)}`;

  const tint = isDark ? `${colors.primary}26` : `${colors.primary}1F`;

  // share targets — Instagram (featured visual card) + one generic native share
  const shareTargets = [
    { key: 'instagram', kind: 'instagram', premium: true },
    { key: 'native', kind: 'native' },
  ];

  const renderShareGlyph = (kind) => {
    switch (kind) {
      case 'instagram':
        return <Ionicons name="logo-instagram" size={22} color={colors.text} />;
      case 'native':
        return <Ionicons name="share-social-outline" size={22} color={colors.text} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safe}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* ── AppBar ─────────────────────────────────────────────────────── */}
      <View style={styles.appBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          accessibilityLabel={t('backBtn', lang)}
          accessibilityRole="button"
        >
          <Ionicons name="chevron-back" size={18} color={colors.text} />
          <Text style={styles.backBtnText}>
            {t('backBtn', lang).replace(/^[←<\-]+\s*/g, '')}
          </Text>
        </TouchableOpacity>

        <View style={styles.appBarCenter}>
          <Text style={styles.appBarTitle} numberOfLines={1}>
            {t('mv_screen_title', lang)}
          </Text>
        </View>

        <View style={styles.appBarRightSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Story header ─────────────────────────────────────────────── */}
        <View style={styles.storyHeader}>
          <Text style={[styles.categoryLabel, { color: colors.textSecondary }]}>
            <Text style={{ color: categoryTheme.accent }}>{displayCat ? displayCat.toUpperCase() : ''}</Text>
            {story.min ? `  ·  ${story.min} ${t('minLabel', lang)}` : ''}
          </Text>
          <Text style={styles.storyTitle} numberOfLines={3}>
            {story.title}
          </Text>
        </View>

        {/* ── Format selector 2x2 grid ─────────────────────────────────── */}
        <Text style={styles.sectionLabel}>{t('mv_format_label', lang)}</Text>
        <View style={styles.grid}>
          {variants.map(v => {
            const active = v.id === selected?.id;
            return (
              <TouchableOpacity
                key={v.id}
                style={[styles.gridCard, active && styles.gridCardActive]}
                onPress={() => handleSelect(v.id)}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                accessibilityLabel={v.title}
              >
                <View
                  style={[
                    styles.gridIconCircle,
                    { backgroundColor: active ? colors.primary : tint },
                  ]}
                >
                  <Ionicons
                    name={active ? v.iconActive : v.icon}
                    size={16}
                    color={active ? colors.onPrimary : colors.primary}
                  />
                </View>
                <View style={styles.gridTextCol}>
                  <Text style={styles.gridName} numberOfLines={1}>{v.title}</Text>
                  <Text style={styles.gridDesc} numberOfLines={1}>{v.gridDesc}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Preview card ─────────────────────────────────────────────── */}
        {selected && (
          <View style={styles.previewCard}>
            <View style={styles.previewHeader}>
              <Text style={styles.previewLabel}>{selected.title.toUpperCase()}</Text>
              <TouchableOpacity
                style={[styles.aiPill, { backgroundColor: tint }]}
                onPress={handleAiRewrite}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={t('mv_ai_rewrite', lang)}
              >
                <Ionicons name="sparkles" size={12} color={colors.primary} />
                <Text style={styles.aiPillText}>{t('mv_ai_rewrite', lang)}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.quoteRow}>
              <View style={styles.quoteBar} />
              <Text
                style={[
                  styles.quoteText,
                  charCount > 150 && styles.quoteTextLong,
                ]}
              >
                {selected.body}
              </Text>
            </View>

            <Text style={styles.charLine}>{charLine}</Text>
          </View>
        )}
      </ScrollView>

      {/* ── Bottom action dock ──────────────────────────────────────────── */}
      <View style={styles.dock}>
        <Text style={styles.dockLabel}>{t('mv_share_label', lang)}</Text>

        <View style={styles.shareRow}>
          {shareTargets.map(target => (
            <TouchableOpacity
              key={target.key}
              style={styles.shareBtn}
              onPress={() => handleSharePlatform(target.kind)}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={target.kind === 'native' ? t('mv_share_native', lang) : t(`mv_share_on_${target.kind}`, lang)}
            >
              {renderShareGlyph(target.kind)}
              {target.premium && !isPremium && (
                <View style={styles.premiumBadge}>
                  <Ionicons name="star" size={9} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Primary: Copy (universal action) */}
        <TouchableOpacity
          onPress={handleCopy}
          activeOpacity={0.9}
          accessibilityRole="button"
          accessibilityLabel={t('mv_copy', lang)}
        >
          <LinearGradient
            colors={[colors.ctaGradientEnd, colors.ctaGradientStart]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.copyBtn}
          >
            <Ionicons name="copy-outline" size={18} color={colors.onPrimary} />
            <Text style={styles.copyBtnText}>{t('mv_copy', lang)}</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Secondary: Practice | Used toggle */}
        <View style={styles.secondaryRow}>
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={handleStorytellerOpen}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={t('mv_practice_short', lang)}
          >
            <Ionicons name="mic-outline" size={17} color={colors.text} />
            <Text style={styles.secondaryBtnText}>{t('mv_practice_short', lang)}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryBtn, isUsed && styles.secondaryBtnActive]}
            onPress={handleToggleUsed}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityState={{ selected: isUsed }}
            accessibilityLabel={t('mv_mark_used', lang)}
          >
            <Ionicons
              name={isUsed ? 'checkmark-circle' : 'checkmark-circle-outline'}
              size={17}
              color={isUsed ? colors.success : colors.textSecondary}
            />
            <Text
              style={[
                styles.secondaryBtnTextMuted,
                isUsed && { color: colors.success },
              ]}
            >
              {t('mv_used_short', lang)}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.privatePlanButton} onPress={() => setPrivatePlanVisible(true)} activeOpacity={0.85} accessibilityRole="button" accessibilityLabel={t('career.privatePlan.open', lang)}>
          <Ionicons name="shield-checkmark-outline" size={17} color={colors.textSecondary} />
          <Text style={styles.privatePlanText}>{t('career.privatePlan.open', lang)}</Text>
        </TouchableOpacity>
      </View>

      {/* ── Copy / info toast ───────────────────────────────────────────── */}
      {copyToastVisible && (
        <Animated.View
          style={[
            styles.copyToast,
            {
              opacity: toastAnim,
              transform: [{ translateY: toastAnim.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }],
            },
          ]}
          pointerEvents="none"
        >
          <Ionicons name="checkmark-circle" size={16} color={colors.success} />
          <Text style={styles.copyToastText}>{toastMsg}</Text>
        </Animated.View>
      )}

      {/* ── Storyteller Overlay ──────────────────────────────────────────── */}
      <StorytellerOverlay
        visible={!!showStorytellerFor}
        story={story}
        variant={showStorytellerFor}
        isPremium={isPremium}
        onClose={() => setShowStorytellerFor(null)}
        onDone={handleStorytellerDone}
        onPremiumTap={handlePremiumTap}
        colors={colors}
        layout={layout}
        isDark={isDark}
        lang={lang}
      />

      <Modal visible={privatePlanVisible} transparent animationType="fade" onRequestClose={() => setPrivatePlanVisible(false)} accessibilityViewIsModal>
        <View style={styles.privatePlanBackdrop}>
          <View style={styles.privatePlanSheet}>
            <TouchableOpacity accessibilityRole="button" accessibilityLabel={t('career.close', lang)} onPress={() => setPrivatePlanVisible(false)} style={styles.privatePlanClose}><Ionicons name="close" size={20} color={colors.text} /></TouchableOpacity>
            <Ionicons name="shield-checkmark-outline" size={27} color={colors.primary} />
            <Text selectable style={styles.privatePlanTitle}>{t('career.privatePlan.title', lang)}</Text>
            <Text selectable style={styles.privatePlanCopy}>{t('career.privatePlan.copy', lang)}</Text>
            <View style={styles.privatePlanOptions}>
              {['workStudy', 'social', 'personal'].map((context) => <TouchableOpacity key={context} accessibilityRole="button" accessibilityLabel={t(`career.privatePlan.${context}`, lang)} onPress={() => handlePrivatePlan(context)} style={styles.privatePlanOption}><Text selectable style={styles.privatePlanOptionText}>{t(`career.privatePlan.${context}`, lang)}</Text><Ionicons name="arrow-forward" size={18} color={colors.primary} /></TouchableOpacity>)}
            </View>
          </View>
        </View>
      </Modal>

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
      paddingHorizontal: HPAD,
      paddingVertical: 10,
      gap: 8,
    },
    backBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 7,
      borderRadius: 18,
      backgroundColor: colors.backgroundDark,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 2,
    },
    backBtnText: {
      fontFamily: 'Inter_500Medium',
      fontSize: 13,
      color: colors.text,
    },
    appBarCenter: {
      flex: 1,
      alignItems: 'center',
      marginRight: 34,
    },
    appBarTitle: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 14,
      color: colors.text,
      letterSpacing: 1.2,
    },
    appBarRightSpacer: {
      width: 0,
    },

    // Scroll
    scrollContent: {
      paddingHorizontal: HPAD,
      paddingBottom: 24,
    },

    // Story header
    storyHeader: {
      paddingTop: 6,
      paddingBottom: 18,
    },
    categoryLabel: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 11,
      letterSpacing: 1.4,
      marginBottom: 8,
    },
    storyTitle: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: 25,
      lineHeight: 31,
      color: colors.text,
    },

    // Section label
    sectionLabel: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 11,
      color: colors.textSecondary,
      letterSpacing: 1.4,
      marginBottom: 12,
    },

    // Grid
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    gridCard: {
      width: '48.5%',
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 11,
      paddingHorizontal: 12,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surfaceContainerLowest,
      marginBottom: 10,
      gap: 10,
    },
    gridCardActive: {
      borderColor: colors.primary,
      borderWidth: 1.5,
      backgroundColor: isDark ? `${colors.primary}1A` : '#F4ECDA',
    },
    gridIconCircle: {
      width: 30,
      height: 30,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
    },
    gridTextCol: {
      flex: 1,
    },
    gridName: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 13.5,
      color: colors.text,
    },
    gridDesc: {
      fontFamily: 'Inter_400Regular',
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 1,
    },

    // Preview card
    previewCard: {
      marginTop: 8,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surfaceContainerLowest,
      padding: 18,
      shadowColor: '#000',
      shadowOpacity: isDark ? 0 : 0.05,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 2,
    },
    previewHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 14,
    },
    previewLabel: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 11,
      color: colors.primary,
      letterSpacing: 1.2,
      flex: 1,
    },
    aiPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: 11,
      paddingVertical: 6,
      borderRadius: 15,
    },
    aiPillText: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 12,
      color: colors.primary,
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
      fontSize: 19,
      lineHeight: 28,
      color: colors.text,
    },
    quoteTextLong: {
      fontFamily: 'Inter_400Regular',
      fontSize: 15.5,
      lineHeight: 25,
    },
    charLine: {
      fontFamily: 'Inter_400Regular',
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 16,
    },

    // Dock
    dock: {
      paddingHorizontal: HPAD,
      paddingTop: 14,
      paddingBottom: Math.max(insets.bottom, 12) + 4,
      backgroundColor: colors.backgroundDark,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    dockLabel: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 11,
      color: colors.textSecondary,
      letterSpacing: 1.4,
      marginBottom: 12,
    },
    shareRow: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 14,
    },
    shareBtn: {
      width: 52,
      height: 52,
      borderRadius: 26,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceContainerLowest,
      borderWidth: 1,
      borderColor: colors.border,
    },
    premiumBadge: {
      position: 'absolute',
      top: -2,
      right: -2,
      width: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: colors.backgroundDark,
    },
    copyBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 9,
      height: 54,
      borderRadius: 16,
      shadowColor: colors.primary,
      shadowOpacity: isDark ? 0 : 0.3,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 5 },
      elevation: 3,
    },
    copyBtnText: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 17,
      color: colors.onPrimary,
    },
    secondaryRow: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 12,
    },
    secondaryBtn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      height: 46,
      borderRadius: 14,
      backgroundColor: colors.surfaceContainerLowest,
      borderWidth: 1,
      borderColor: colors.border,
    },
    secondaryBtnActive: {
      borderColor: colors.success,
      backgroundColor: isDark ? `${colors.success}1A` : '#EAF4EB',
    },
    secondaryBtnText: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 14,
      color: colors.text,
    },
    secondaryBtnTextMuted: {
      fontFamily: 'Inter_500Medium',
      fontSize: 14,
      color: colors.textSecondary,
    },
    privatePlanButton: {
      minHeight: 44,
      marginTop: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    privatePlanText: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 13,
      color: colors.textSecondary,
    },
    privatePlanBackdrop: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0.46)',
    },
    privatePlanSheet: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 26,
      borderTopRightRadius: 26,
      padding: 24,
      paddingBottom: Math.max(insets.bottom + 24, 32),
      gap: 12,
    },
    privatePlanClose: {
      position: 'absolute',
      top: 14,
      right: 16,
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
    },
    privatePlanTitle: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: 26,
      color: colors.text,
      paddingRight: 42,
    },
    privatePlanCopy: {
      fontFamily: 'Inter_400Regular',
      fontSize: 14,
      lineHeight: 20,
      color: colors.textSecondary,
    },
    privatePlanOptions: { gap: 9, marginTop: 4 },
    privatePlanOption: {
      minHeight: 52,
      borderRadius: 15,
      paddingHorizontal: 15,
      backgroundColor: colors.backgroundDark,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    privatePlanOptionText: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 15,
      color: colors.text,
    },

    // Toast
    copyToast: {
      position: 'absolute',
      left: HPAD,
      right: HPAD,
      bottom: Math.max(insets.bottom + 14, 22),
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
      fontFamily: 'Inter_500Medium',
      fontSize: 12,
      color: isDark ? colors.text : '#2E5F37',
    },
  });
};

export default UseInConversationScreen;

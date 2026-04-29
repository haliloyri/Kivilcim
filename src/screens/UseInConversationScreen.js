/**
 * UseInConversationScreen
 *
 * "Use in Conversation" screen — shows ready-made micro-variants of a story
 * (Punchline, 30-Second, Question, Key Contrast) so the user can
 * quickly copy or share the right format for any social context.
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
  LayoutAnimation,
  Platform,
  UIManager,
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
import MicroVariantCard from '../components/MicroVariantCard';
import { ANALYTICS_EVENTS, trackEvent } from '../utils/analytics';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

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
    .replace(/[\u0300-\u036f]/g, '')
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
      tags: '#Spark #Farkındalık #KişiselGelişim #KitapNotları',
    },
    en: {
      PUNCHLINE: 'Today\'s sharpest takeaway:',
      QUESTION: 'Ask yourself this today:',
      THIRTY_SEC: 'This in 30 seconds:',
      ONE_WORD: 'One word, big impact:',
      fallback: 'This story stayed with me:',
      engage: 'What part resonates with you most?',
      tags: '#Spark #Mindset #Growth #BookNotes',
    },
    es: {
      PUNCHLINE: 'La idea mas potente de hoy:',
      QUESTION: 'Preguntate esto hoy:',
      THIRTY_SEC: 'Esto en 30 segundos:',
      ONE_WORD: 'Una palabra, gran impacto:',
      fallback: 'Esta historia me impacto:',
      engage: 'Que parte te resuena mas?',
      tags: '#Spark #Mentalidad #Crecimiento #NotasDeLibros',
    },
    de: {
      PUNCHLINE: 'Die kraftigste Erkenntnis heute:',
      QUESTION: 'Stell dir heute diese Frage:',
      THIRTY_SEC: 'In 30 Sekunden:',
      ONE_WORD: 'Ein Wort, grosse Wirkung:',
      fallback: 'Diese Geschichte bleibt haengen:',
      engage: 'Welcher Teil spricht dich am meisten an?',
      tags: '#Spark #Mindset #Weiterentwicklung #BuchImpulse',
    },
  };

  const copy = hookByLang[lang] || hookByLang.tr;
  const hook = copy[variant?.type] || copy.fallback;
  const categoryTag = normalizeHashtag(categoryLabel || story?.parent_cat || story?.cat || '');
  const hashtags = categoryTag ? `#${categoryTag} ${copy.tags}` : copy.tags;

  return `${hook}\n\n${body || storyTitle}\n\n${copy.engage}\n\n${hashtags}`;
};

/**
 * Build the variant list from a story object.
 * Variants with empty body are excluded so the list is always clean.
 */
const buildMicroVariants = (story, lang) => {
  const body = story.body || '';
  const quote      = extractMarker(body, '##');
  const lesson     = extractMarker(body, '$$');
  const reflection = extractMarker(body, '&&');
  const thirtySec  = (story.thirty_sec || '').trim();
  const clean      = cleanBodyText(body);

  const candidates = [
    {
      id: 'thirty_sec',
      type: 'THIRTY_SEC',
      title: t('mv_thirty_sec', lang),
      body: thirtySec || (clean.length > 320 ? clean.substring(0, 320).trimEnd() + '…' : clean),
      defaultExpanded: false,
      toneTag: t('mv_tone_story', lang),
      contextTags: [t('mv_context_oneonone', lang), t('mv_context_meeting', lang)],
    },
    {
      id: 'punchline',
      type: 'PUNCHLINE',
      title: t('mv_punchline', lang),
      body: lesson || quote,
      defaultExpanded: true,
      toneTag: t('mv_tone_bold', lang),
      contextTags: [t('mv_context_meeting', lang), t('mv_context_social', lang)],
    },
    {
      id: 'question',
      type: 'QUESTION',
      title: t('mv_question', lang),
      body: reflection,
      defaultExpanded: false,
      toneTag: t('mv_tone_curious', lang),
      contextTags: [t('mv_context_oneonone', lang), t('mv_context_social', lang)],
    },
    {
      id: 'one_word',
      type: 'ONE_WORD',
      title: t('mv_one_word', lang),
      // Use the quote as key contrast; fall back to lesson if they differ
      body: quote && quote !== lesson ? quote : '',
      defaultExpanded: false,
      toneTag: t('mv_tone_minimal', lang),
      contextTags: [t('mv_context_meeting', lang)],
    },
  ];

  return candidates.filter(v => v.body.length > 0);
};

// ─── screen ─────────────────────────────────────────────────────────────────

const UseInConversationScreen = ({ route, navigation }) => {
  const { story } = route.params;
  const { colors, typography, layout, isDark, lang } = useTheme();
  const { isPremium, recordVariantUsage } = useUserData();
  const insets = useSafeAreaInsets();

  const variants = useMemo(
    () => buildMicroVariants(story, lang),
    [story, lang],
  );

  // Accordion open/close state
  const [expandedIds, setExpandedIds] = useState(() => {
    const init = {};
    variants.forEach(v => { init[v.id] = !!v.defaultExpanded; });
    return init;
  });

  // Track screen open as a success signal
  useEffect(() => {
    trackEvent(ANALYTICS_EVENTS.USE_IN_CONVO_OPENED, {
      storyId: story?.story_id,
      source: 'screen_mount',
      lang,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The last-touched variant is selected
  const [selectedId, setSelectedId] = useState(
    () => variants.find(v => v.defaultExpanded)?.id ?? variants[0]?.id ?? null,
  );

  // Shows copied checkmark for 2s
  const [copiedId, setCopiedId] = useState(null);
  const [copyToastVisible, setCopyToastVisible] = useState(false);
  const [ratingVariant, setRatingVariant] = useState(null);
  const [ratingValue, setRatingValue] = useState(0);
  const toastAnim = React.useRef(new Animated.Value(0)).current;

  // Variant IDs that are premium-locked (all except PUNCHLINE)
  const lockedIds = useMemo(() => {
    if (isPremium) return new Set();
    return new Set(
      variants.filter(v => v.type !== 'PUNCHLINE').map(v => v.id),
    );
  }, [variants, isPremium]);

  const handlePremiumTap = useCallback(() => {
    trackEvent(ANALYTICS_EVENTS.PAYWALL_VIEWED, {
      source: 'use_in_conversation',
      storyId: story?.story_id,
      lang,
    });
    navigation.navigate('Paywall', { source: 'use_in_conversation', reason: 'locked_variant' });
  }, [navigation, story?.story_id, lang]);

  const toggleExpanded = useCallback((id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));
    setSelectedId(id);
  }, []);

  const handleCopy = useCallback(async (variant) => {
    setSelectedId(variant.id);
    // expo-clipboard is already a dep; lazy-require avoids import order issues
    const Clipboard = require('expo-clipboard');
    await Clipboard.setStringAsync(variant.body);
    setCopiedId(variant.id);
    setTimeout(() => setCopiedId(id => (id === variant.id ? null : id)), 2000);
    trackEvent(ANALYTICS_EVENTS.MICRO_VARIANT_COPIED, {
      storyId: story?.story_id,
      variantType: variant.type,
      variantId: variant.id,
      lang,
    });
    recordVariantUsage({
      storyId: story?.story_id,
      storyTitle: story?.title,
      storyCategory: story?.parent_cat || story?.cat || null,
      variantType: variant.type,
      variantId: variant.id,
      action: 'copy',
    });
    setCopyToastVisible(true);
    Animated.sequence([
      Animated.timing(toastAnim, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.delay(1300),
      Animated.timing(toastAnim, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]).start(() => setCopyToastVisible(false));
  }, [story?.story_id, story?.title, lang, recordVariantUsage]);

  const handleShare = useCallback(async (variant) => {
    setSelectedId(variant.id);
    const payload = buildVariantShareMessage({
      story,
      variant,
      lang,
      categoryLabel: displayCat,
    });

    try {
      await Share.share({
        message: payload,
        title: story?.title || t('mv_screen_title', lang),
      });
      trackEvent(ANALYTICS_EVENTS.STORY_SHARED, {
        source: 'use_in_conversation',
        storyId: story?.story_id,
        variantType: variant.type,
        variantId: variant.id,
        lang,
      });
    } catch (error) {
      // Ignore user-cancelled share actions
      if (error?.message && /cancel|dismiss/i.test(error.message)) return;
      console.warn('Native share failed', error);
    }

    recordVariantUsage({
      storyId: story?.story_id,
      storyTitle: story?.title,
      storyCategory: story?.parent_cat || story?.cat || null,
      variantType: variant.type,
      variantId: variant.id,
      action: 'share_native',
    });
  }, [story, story?.story_id, story?.title, lang, displayCat, recordVariantUsage]);

  const openMarkUsedSurvey = useCallback((variant) => {
    setSelectedId(variant.id);
    setRatingVariant(variant);
    setRatingValue(0);
  }, []);

  const submitMarkUsedSurvey = useCallback(async () => {
    if (!ratingVariant) return;

    await recordVariantUsage({
      storyId: story?.story_id,
      storyTitle: story?.title,
      storyCategory: story?.parent_cat || story?.cat || null,
      variantType: ratingVariant.type,
      variantId: ratingVariant.id,
      action: 'mark_used',
      feedbackRating: ratingValue || null,
    });

    setRatingVariant(null);
    setRatingValue(0);
  }, [ratingVariant, ratingValue, recordVariantUsage, story?.story_id, story?.title, story?.parent_cat, story?.cat]);

  const displayCat = t(story.parent_cat || story.cat || '', lang);

  const styles = buildStyles(colors, typography, layout, isDark, insets);

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
          <Ionicons name="arrow-back" size={18} color={colors.text} />
          <Text style={styles.backBtnText}>
            {t('backBtn', lang).replace(/^[\u2190<\-]+\s*/g, '')}
          </Text>
        </TouchableOpacity>

        <View style={styles.appBarCenter}>
          <Text style={styles.appBarTitle} numberOfLines={1}>
            {t('mv_screen_title', lang)}
          </Text>
        </View>

        <View style={styles.appBarRightSpacer} />
      </View>

      {/* ── Story Header Card ──────────────────────────────────────────── */}
      <LinearGradient
        colors={
          isDark
            ? ['#1E1A14', colors.background]
            : ['#EDE5D8', colors.background]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.storyHeader}
      >
        <View style={styles.categoryRow}>
          {displayCat ? (
            <Text style={styles.categoryLabel}>{displayCat}</Text>
          ) : null}
          {story.min ? (
            <Text style={styles.durationLabel}>
              · {story.min} {t('minLabel', lang)}
            </Text>
          ) : null}
        </View>
        <Text style={styles.storyTitle} numberOfLines={3}>
          {story.title}
        </Text>
      </LinearGradient>

      {/* ── Ready-to-use banner ───────────────────────────────────────── */}
      <View style={styles.readyBanner}>
        <Ionicons name="chatbubbles" size={14} color={colors.primary} />
        <Text style={styles.readyBannerText}>{t('mv_ready_banner', lang)}</Text>
      </View>

      {/* ── Context Note (moved subtitle) ─────────────────────────────── */}
      <View style={styles.contextNote}>
        <Ionicons name="sparkles-outline" size={14} color={colors.textSecondary} />
        <Text style={styles.contextNoteText}>{t('mv_screen_sub', lang)}</Text>
      </View>

      {/* ── Variant Cards ─────────────────────────────────────────────── */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {variants.map(variant => (
          <MicroVariantCard
            key={variant.id}
            variant={variant}
            isExpanded={!!expandedIds[variant.id]}
            isSelected={variant.id === selectedId}
            isCopied={variant.id === copiedId}
            locked={lockedIds.has(variant.id)}
            onToggle={() => toggleExpanded(variant.id)}
            onCopy={() => handleCopy(variant)}
            onShare={() => handleShare(variant)}
            onMarkUsed={() => openMarkUsedSurvey(variant)}
            onPremiumTap={handlePremiumTap}
            colors={colors}
            typography={typography}
            layout={layout}
            isDark={isDark}
            lang={lang}
          />
        ))}

        <View style={{ height: insets.bottom + 32 }} />
      </ScrollView>

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
          <Ionicons name="checkmark-circle" size={16} color="#2E7D32" />
          <Text style={styles.copyToastText}>{t('mv_copy_toast', lang)}</Text>
        </Animated.View>
      )}

      <Modal
        visible={Boolean(ratingVariant)}
        transparent
        animationType="fade"
        onRequestClose={() => setRatingVariant(null)}
      >
        <View style={styles.feedbackOverlay}>
          <View style={styles.feedbackCard}>
            <Text style={styles.feedbackTitle}>{t('mv_feedback_title', lang)}</Text>
            <Text style={styles.feedbackSub}>
              {ratingVariant ? ratingVariant.title : ''}
            </Text>
            <View style={styles.feedbackStars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRatingValue(star)}
                  style={styles.feedbackStarBtn}
                >
                  <Ionicons
                    name={star <= ratingValue ? 'star' : 'star-outline'}
                    size={24}
                    color={star <= ratingValue ? '#C98A19' : colors.textSecondary}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.feedbackActions}>
              <TouchableOpacity onPress={() => setRatingVariant(null)} style={styles.feedbackSecondaryBtn}>
                <Text style={styles.feedbackSecondaryText}>{t('profileCancel', lang)}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={submitMarkUsedSurvey} style={styles.feedbackPrimaryBtn}>
                <Text style={styles.feedbackPrimaryText}>{t('mv_mark_used', lang)}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// ─── styles ─────────────────────────────────────────────────────────────────

const buildStyles = (colors, typography, layout, isDark, insets) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.background,
    },
    // AppBar
    appBar: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: layout.padding.horizontal,
      paddingVertical: 10,
      borderBottomWidth: layout.borderWidth,
      borderBottomColor: colors.border,
      gap: 8,
    },
    backBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      backgroundColor: isDark ? colors.backgroundDark : '#F0EAE0',
      gap: 4,
    },
    backBtnText: {
      fontFamily: 'Inter_500Medium',
      fontSize: 13,
      color: colors.text,
    },
    appBarCenter: {
      flex: 1,
      alignItems: 'center',
    },
    appBarTitle: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 17,
      color: colors.text,
      letterSpacing: 0.2,
    },
    appBarRightSpacer: {
      width: 34,
      height: 34,
    },
    // Story header
    storyHeader: {
      paddingHorizontal: layout.padding.horizontal,
      paddingTop: 14,
      paddingBottom: 16,
      borderBottomWidth: layout.borderWidth,
      borderBottomColor: colors.border,
    },
    categoryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
      gap: 4,
    },
    categoryLabel: {
      fontFamily: 'Inter_500Medium',
      fontSize: 11,
      color: colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 1.2,
    },
    durationLabel: {
      fontFamily: 'Inter_400Regular',
      fontSize: 11,
      color: colors.textSecondary,
    },
    storyTitle: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: 18,
      color: colors.text,
      lineHeight: 26,
    },
    // Ready-to-use banner
    readyBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: layout.padding.horizontal,
      paddingVertical: 10,
      borderBottomWidth: layout.borderWidth,
      borderBottomColor: colors.border,
      backgroundColor: isDark ? `${colors.primary}12` : `${colors.primary}0A`,
    },
    readyBannerText: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 12,
      color: colors.primary,
      letterSpacing: 0.3,
    },
    // Subtitle moved under banner with a distinct visual style
    contextNote: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 8,
      marginTop: 10,
      marginHorizontal: layout.padding.horizontal,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 12,
      borderWidth: layout.borderWidth,
      borderColor: colors.border,
      backgroundColor: isDark ? colors.card : '#F7F3EC',
    },
    contextNoteText: {
      flex: 1,
      fontFamily: 'Inter_400Regular',
      fontSize: 12,
      lineHeight: 18,
      color: colors.textSecondary,
    },
    // Scroll area
    scrollContent: {
      paddingHorizontal: layout.padding.horizontal,
      paddingTop: 18,
    },
    copyToast: {
      position: 'absolute',
      left: layout.padding.horizontal,
      right: layout.padding.horizontal,
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
    feedbackOverlay: {
      flex: 1,
      backgroundColor: isDark ? colors.overlayDark : 'rgba(18,17,15,0.25)',
      justifyContent: 'flex-end',
      padding: 16,
    },
    feedbackCard: {
      backgroundColor: colors.background,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
    },
    feedbackTitle: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: 22,
      color: colors.text,
    },
    feedbackSub: {
      fontFamily: 'Inter_400Regular',
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 4,
      marginBottom: 12,
    },
    feedbackStars: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 14,
    },
    feedbackStarBtn: {
      padding: 6,
    },
    feedbackActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 10,
      marginTop: 2,
    },
    feedbackSecondaryBtn: {
      paddingHorizontal: 10,
      paddingVertical: 8,
    },
    feedbackSecondaryText: {
      fontFamily: 'Inter_500Medium',
      fontSize: 13,
      color: colors.textSecondary,
    },
    feedbackPrimaryBtn: {
      borderRadius: 10,
      backgroundColor: colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    feedbackPrimaryText: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 13,
      color: colors.onPrimary,
    },
  });

export default UseInConversationScreen;

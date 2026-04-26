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
      variantType: variant.type,
      variantId: variant.id,
      action: 'copy',
    });
  }, [story?.story_id, story?.title, lang, recordVariantUsage]);

  const handleShare = useCallback((variant) => {
    setSelectedId(variant.id);
    const sharePreset =
      variant.type === 'QUESTION'
        ? 'reflection'
        : variant.type === 'PUNCHLINE'
          ? 'lesson'
          : 'quote';

    recordVariantUsage({
      storyId: story?.story_id,
      storyTitle: story?.title,
      variantType: variant.type,
      variantId: variant.id,
      action: 'share_open',
    });

    navigation.navigate('StoryDetail', {
      story,
      openShareModal: true,
      sharePreset,
      shareOverrideText: variant.body,
      shareSource: 'use_in_conversation',
      shareVariantType: variant.type,
    });
  }, [navigation, story, story?.story_id, story?.title, recordVariantUsage]);
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
          <Text style={styles.appBarSub} numberOfLines={1}>
            {t('mv_screen_sub', lang)}
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
      fontSize: 10,
      color: colors.primary,
      letterSpacing: 1.8,
      textTransform: 'uppercase',
    },
    appBarSub: {
      fontFamily: 'Inter_400Regular',
      fontSize: 11,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 2,
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
    // Scroll area
    scrollContent: {
      paddingHorizontal: layout.padding.horizontal,
      paddingTop: 18,
    },
  });

export default UseInConversationScreen;

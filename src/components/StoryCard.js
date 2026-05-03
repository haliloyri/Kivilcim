import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { t } from '../locales/i18n';
import { getCategoryImage, getCategoryTheme } from '../utils/categoryImages';

const { width } = Dimensions.get('window');

export const getCatIcon = (catName) => {
  if (catName === 'Tümü' || catName === 'All') return 'grid-outline';
  switch (catName) {
    case 'Finans': case 'Finance': return 'wallet-outline';
    case 'Psikoloji': case 'Psychology': return 'heart-outline';
    case 'Tarih': case 'History': return 'hourglass-outline';
    case 'Liderlik': case 'Leadership': return 'flag-outline';
    case 'Sağlık': case 'Health': return 'fitness-outline';
    case 'Bilim': case 'Science': return 'flask-outline';
    case 'Felsefe': case 'Philosophy': return 'leaf-outline';
    case 'Kişisel Gelişim': case 'Personal Growth': return 'trending-up-outline';
    case 'Verimlilik': case 'Productivity': return 'rocket-outline';
    case 'İletişim': case 'Communication': return 'chatbubbles-outline';
    case 'İş & Girişim': case 'Business': return 'briefcase-outline';
    // Parent category raw names (English DB keys) and their localized forms
    case 'Mind & Psychology': case 'Zihin ve Psikoloji': case 'Mente y Psicología': case 'Geist und Psychologie': return 'heart-outline';
    case 'Career & Success': case 'Kariyer ve Başarı': case 'Carrera y Éxito': case 'Karriere und Erfolg': return 'briefcase-outline';
    case 'Science & Future': case 'Bilim ve Gelecek': case 'Ciencia y Futuro': case 'Wissenschaft und Zukunft': return 'flask-outline';
    case 'Society & World': case 'Toplum ve Dünya': case 'Sociedad y Mundo': case 'Gesellschaft und Welt': return 'earth-outline';
    case 'Social Skills': case 'Sosyal Beceriler': case 'Habilidades Sociales': case 'Soziale Fähigkeiten': return 'chatbubbles-outline';
    default: return 'book-outline';
  }
};

const toPascalCase = (value = '') => {
  const normalized = String(value || '').trim();
  if (!normalized) return '';

  return normalized
    .split(/\s+/)
    .map((part) => {
      const lower = part.toLocaleLowerCase('tr-TR');
      return lower.charAt(0).toLocaleUpperCase('tr-TR') + lower.slice(1);
    })
    .join(' ');
};

const StoryCard = ({ story, locked, isRead, onPress, type = 'standard', hideCategory = false, supportText = null, stackIndex = 0, stackTotal = 1, onUseInConversation }) => {
  const { colors, typography, layout, lang, isDark } = useTheme();
  const isHero = type === 'hero';
  const isCompact = type === 'compact';
  const isReady = type === 'ready';
  const isPhone = width < 768;
  const isSmallPhone = width < 390;
  
  const todayStr = new Date().toISOString().split('T')[0];
  const isSaved = Boolean(
    story?.isSaved || story?.saved || story?.savedForLater || story?.isFavorite || story?.favorite || story?.bookmarked || story?.saved_for_later
  );
  const isNew = story.publishDate === todayStr;
  // DB already returns translated content for the active language
  const displayTitle = story.title || '';
  const displaySrc = story.source_book || '';
  // Always use the main category (parent_cat) for display label
  const rawDisplayCat = t(story.parent_cat || story.cat, lang) || '';
  const displayCat = toPascalCase(rawDisplayCat);
  const categoryTheme = getCategoryTheme(story.parent_cat_raw || story.parent_cat || story.cat, isDark);

  const stackRotate = isCompact ? `${Math.max(-6, Math.min(6, (stackIndex - 1) * 1.8))}deg` : '0deg';
  const stackTranslateY = isCompact ? Math.max(0, stackIndex) * 3 : 0;
  const catImg = getCategoryImage(story.parent_cat_raw || story.parent_cat || story.cat, isDark);

  const styles = StyleSheet.create({
    card: {
      backgroundColor: categoryTheme.backgroundColor,
      borderRadius: layout.radius.card,
      borderWidth: 1.5,
      borderColor: categoryTheme.borderColor,
      overflow: 'hidden',
      padding: isCompact ? 16 : 24,
      marginBottom: isCompact ? 0 : 20,
      width: isCompact ? (width - (layout.padding.horizontal * 2) - 16) / 2 : '100%',
      justifyContent: 'space-between',
      minHeight: isHero ? 240 : isCompact ? 170 : 155,
      shadowColor: colors.border,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 2,
    },
    readyCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FDF9F3',
      borderRadius: layout.radius.card,
      borderWidth: 1.5,
      borderColor: categoryTheme.borderColor,
      paddingHorizontal: isSmallPhone ? 10 : 14,
      paddingVertical: isSmallPhone ? 10 : 12,
      marginBottom: 20,
      minHeight: 136,
      gap: 10,
      maxWidth: '100%',
      shadowColor: '#7A5B43',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: isDark ? 0.2 : 0.16,
      shadowRadius: 12,
      elevation: 4,
    },
    readyLeft: {
      width: isSmallPhone ? 84 : 98,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      flexShrink: 0,
      borderRadius: 14,
      paddingVertical: 8,
      paddingHorizontal: 6,
    },
    readyCategoryLabel: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 11,
      color: categoryTheme.borderColor,
      letterSpacing: 0.2,
      textAlign: 'center',
      width: '100%',
    },
    readyImageWrapper: {
      width: '100%',
      height: isSmallPhone ? 58 : 70,
      borderRadius: 12,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDark ? colors.surfaceContainerHigh : colors.surfaceContainerLowest,
      borderWidth: 1,
      borderColor: `${categoryTheme.borderColor}80`,
    },
    readyImage: {
      width: '100%',
      height: '100%',
      opacity: 1,
    },
    readyImagePlaceholder: {
      backgroundColor: isDark ? colors.surfaceContainerHigh : colors.surfaceContainerLowest,
    },
    readyBody: {
      flex: 1,
      justifyContent: 'center',
      minWidth: 0,
      paddingLeft: 2,
    },
    readyTitle: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: 17,
      lineHeight: 22,
      color: '#4A3A2C',
      marginBottom: 6,
    },
    readyMeta: {
      fontFamily: 'Inter_400Regular',
      fontSize: 12,
      color: colors.textSecondary,
      lineHeight: 18,
    },
    readyDivider: {
      width: 1,
      alignSelf: 'stretch',
      opacity: 0.55,
      marginVertical: 4,
    },
    readyRight: {
      width: isSmallPhone ? 74 : 96,
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      height: '100%',
      flexShrink: 0,
    },
    readyStatusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 12,
    },
    readyActionBtn: {
      paddingVertical: 10,
      paddingHorizontal: isSmallPhone ? 8 : 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.primary,
      backgroundColor: isDark ? `${colors.primary}12` : `${colors.primary}14`,
      maxWidth: '100%',
    },
    readyActionText: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: isSmallPhone ? 11 : 12,
      color: colors.primary,
      textAlign: 'center',
    },
    heroCard: {
      backgroundColor: categoryTheme.strongBackgroundColor,
      borderWidth: 1.5,
    },
    lockedCard: {
      opacity: 0.6,
      backgroundColor: categoryTheme.backgroundColor,
    },
    readCard: {
      opacity: 0.5,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    badge: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 8,
      backgroundColor: isDark ? colors.background : colors.surfaceContainerLowest,
      borderWidth: 0,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      flexShrink: 1,
    },
    badgeText: {
      fontFamily: 'Inter_400Regular',
      fontSize: 12,
      color: colors.textSecondary,
      letterSpacing: 0.5,
      textTransform: 'none',
      flexShrink: 1,
    },
    cardTitle: {
      fontFamily: 'PlayfairDisplay_600SemiBold',
      fontSize: isSmallPhone ? 19 : isPhone ? 20 : 22,
      color: '#4A3A2C',
      lineHeight: isSmallPhone ? 25 : isPhone ? 26 : 28,
    },
    cardTitleHero: {
      fontSize: isSmallPhone ? 22 : isPhone ? 24 : 26,
      lineHeight: isSmallPhone ? 28 : isPhone ? 30 : 32,
    },
    cardTitleCompact: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: isSmallPhone ? 16 : isPhone ? 17 : 19,
      lineHeight: isSmallPhone ? 22 : isPhone ? 23 : 25,
    },
    cardFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 16,
    },
    supportText: {
      fontFamily: 'Inter_500Medium',
      fontSize: 12,
      lineHeight: 18,
      color: locked ? colors.primary : colors.textSecondary,
      marginTop: 8,
    },
    cardMeta: {
      fontFamily: 'Inter_400Regular',
      fontSize: 13,
      color: colors.textSecondary,
    },
    cardArrow: {
      fontSize: 18,
      color: colors.primary,
    },
    lockIcon: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    newBadge: {
      backgroundColor: colors.success,
      borderColor: colors.success,
    },
    newBadgeText: {
      color: colors.onPrimary,
    },
    surfaceOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: isDark ? 'transparent' : colors.overlaySoft,
    },
  });

  if (isReady) {
    return (
      <TouchableOpacity 
        activeOpacity={0.7} 
        onPress={onPress}
        style={[
          styles.card,
          styles.readyCard,
          locked && styles.lockedCard,
          isRead && styles.readCard,
        ]}
      >
        <View style={[styles.readyLeft, { backgroundColor: categoryTheme.strongBackgroundColor }]}>
          <Text style={styles.readyCategoryLabel}>{displayCat}</Text>
          <View style={[styles.readyImageWrapper, !catImg.source && styles.readyImagePlaceholder]}>
            {catImg.source ? (
              <Image source={catImg.source} style={styles.readyImage} resizeMode="cover" />
            ) : (
              <Ionicons name={getCatIcon(rawDisplayCat)} size={28} color={categoryTheme.accent} />
            )}
          </View>
        </View>

        <View style={[styles.readyDivider, { backgroundColor: categoryTheme.borderColor }]} />

        <View style={styles.readyBody}>
          <Text numberOfLines={3} style={styles.readyTitle}>
            {displayTitle}
          </Text>
          <Text style={styles.readyMeta} numberOfLines={1}>
            {story.min} {t('minLabel', lang)}
          </Text>
          {displaySrc ? (
            <Text style={styles.readyMeta} numberOfLines={1}>
              {displaySrc}
            </Text>
          ) : null}
        </View>

        <View style={styles.readyRight}>
          <View style={styles.readyStatusRow}>
            {isSaved && <Ionicons name="bookmark" size={18} color={colors.primary} />}
            {isRead && <Ionicons name="checkmark-circle" size={18} color={colors.primary} />}
          </View>
          {onUseInConversation && !locked ? (
            <TouchableOpacity
              onPress={onUseInConversation}
              activeOpacity={0.85}
              style={styles.readyActionBtn}
            >
              <Text style={styles.readyActionText}>{t('story_detail_use_cta', lang)}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      activeOpacity={0.7} 
      onPress={onPress}
      style={[
        styles.card, 
        isHero && styles.heroCard, 
        locked && styles.lockedCard,
        isRead && styles.readCard,
        isHero && { padding: 0, overflow: 'hidden' }, // Overlap hero card padding for image
        isCompact ? {
          transform: [{ rotate: stackRotate }, { translateY: stackTranslateY }],
          zIndex: Math.max(1, stackTotal - stackIndex),
        } : null,
      ]}
    >
      {isHero && (() => {
        if (!catImg.source) return (
          <View style={StyleSheet.absoluteFill}>
            <View style={[StyleSheet.absoluteFill, { backgroundColor: isDark ? colors.overlayDark : colors.overlaySoft }]} />
          </View>
        );
        return (
          <View style={StyleSheet.absoluteFill}>
            <Image 
              source={catImg.source} 
              style={{ 
                width: '100%', 
                height: '100%',
                opacity: isDark ? 0.22 : 1,
                transform: [
                  { rotate: catImg.rotate },
                  { scaleX: catImg.flip ? -1 : 1 }
                ]
              }}
              resizeMode="cover"
            />
            <View style={[StyleSheet.absoluteFill, { backgroundColor: catImg.tint }]} />
            <View style={[StyleSheet.absoluteFill, { backgroundColor: isDark ? colors.overlayDark : colors.overlaySoft }]} />
            <LinearGradient
              colors={isDark ? ['rgba(25,21,15,0.5)', 'rgba(18,17,15,0.1)'] : ['rgba(252,232,194,0.38)', 'rgba(244,236,220,0.08)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={{ position: 'absolute', width: 180, height: 180, borderRadius: 90, top: -30, left: -20, backgroundColor: 'rgba(255,214,138,0.22)' }} />
            <View style={{ position: 'absolute', width: 200, height: 200, borderRadius: 100, bottom: -60, right: -40, backgroundColor: 'rgba(188,108,37,0.18)' }} />
            <View style={{ position: 'absolute', width: 120, height: 120, borderRadius: 60, top: 72, right: 42, backgroundColor: 'rgba(255,246,220,0.2)' }} />
          </View>
        );
      })()}
      {!isHero && <View pointerEvents="none" style={styles.surfaceOverlay} />}

      <View style={isHero ? { padding: 24, flex: 1, justifyContent: 'space-between' } : null}>
        <View>
          <View style={[styles.cardHeader, (!hideCategory || isNew || isRead || locked) ? null : { marginBottom: 0 }]}>
            {!hideCategory && (
              <View style={isHero ? { marginBottom: -8 } : styles.badge}>
                <Text style={isHero ? [styles.badgeText, { color: colors.text, fontSize: 13, textTransform: 'none', fontFamily: 'Inter_500Medium', backgroundColor: colors.surfaceContainerLowest, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }] : styles.badgeText} numberOfLines={1}>
                  {isHero ? displayCat : displayCat}
                </Text>
              </View>
            )}
            <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center', flexShrink: 0 }}>
              {isNew && (
                <View style={[styles.badge, styles.newBadge, { paddingHorizontal: 6 }]}>
                  <Text style={[styles.badgeText, styles.newBadgeText]}>{t('newBadge', lang)}</Text>
                </View>
              )}
              {isRead && <Ionicons name="checkmark-circle" size={16} color={colors.primary} />}
              {locked && <Text style={styles.lockIcon}>🔒</Text>}
            </View>
          </View>
          <Text 
            numberOfLines={isHero ? 3 : 2} 
            style={[
              styles.cardTitle, 
              isHero && styles.cardTitleHero,
              isCompact && styles.cardTitleCompact
            ]}
          >
            {displayTitle}
          </Text>
          {supportText ? (
            <Text numberOfLines={2} style={styles.supportText}>{supportText}</Text>
          ) : null}
        </View>

        <View style={styles.cardFooter}>
          <View style={{ flexShrink: 1, paddingRight: 8 }}>
            {!isCompact && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, opacity: 0.6 }}>
                <Ionicons name="time-outline" size={10} color={colors.textSecondary} />
                <Text style={[styles.cardMeta, { color: colors.textSecondary, fontSize: 10 }]} numberOfLines={1}>
                  {story.min} {t('minLabel', lang)} • {displaySrc}
                </Text>
              </View>
            )}
          </View>
          {!isCompact && onUseInConversation && !locked && (
            <TouchableOpacity
              onPress={onUseInConversation}
              activeOpacity={0.85}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                paddingVertical: 6,
                paddingHorizontal: 10,
                borderRadius: 8,
                backgroundColor: isDark ? `${colors.primary}20` : `${colors.primary}14`,
                borderWidth: 1,
                borderColor: `${colors.primary}45`,
              }}
            >
              <Ionicons name="chatbubbles" size={12} color={colors.primary} />
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 11, color: colors.primary }}>
                {t('story_detail_use_cta', lang)}
              </Text>
            </TouchableOpacity>
          )}
          {!isCompact && !onUseInConversation && <Text style={[styles.cardArrow, isHero && { color: colors.text }]}>→</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default StoryCard;

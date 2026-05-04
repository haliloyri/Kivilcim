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
  const isVerySmallPhone = width < 360;
  
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
      alignItems: 'stretch',
      backgroundColor: isDark ? '#1F1A16' : '#F6EFE4',
      borderRadius: layout.radius.card,
      borderTopWidth: 1,
      borderRightWidth: 1,
      borderBottomWidth: 1,
      borderLeftWidth: 6,
      borderTopColor: isDark ? '#4A3E34' : '#D5C5B0',
      borderRightColor: isDark ? '#4A3E34' : '#D5C5B0',
      borderBottomColor: isDark ? '#4A3E34' : '#D5C5B0',
      borderLeftColor: categoryTheme.borderColor,
      paddingLeft: 0,
      paddingRight: isVerySmallPhone ? 12 : isSmallPhone ? 15 : 18,
      paddingVertical: 0,
      marginBottom: 20,
      minHeight: isVerySmallPhone ? 186 : isSmallPhone ? 201 : 213,
      gap: 0,
      maxWidth: '100%',
      overflow: 'hidden',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: isDark ? 0.24 : 0.2,
      shadowRadius: 12,
      elevation: 4,
    },
    readyLeft: {
      width: isVerySmallPhone ? 108 : isSmallPhone ? 126 : 147,
      alignItems: 'stretch',
      justifyContent: 'flex-start',
      flexShrink: 0,
      borderRadius: 0,
      overflow: 'hidden',
      paddingVertical: 0,
      paddingHorizontal: 0,
    },
    readyCategoryLabel: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: isVerySmallPhone ? 10 : 12,
      color: isDark ? 'rgba(246,237,225,0.85)' : 'rgba(62,47,36,0.75)',
      letterSpacing: 0.3,
      textAlign: 'center',
      borderWidth: 0,
      borderColor: 'transparent',
      borderRadius: 0,
      paddingHorizontal: isVerySmallPhone ? 4 : 6,
      paddingVertical: isVerySmallPhone ? 2 : 3,
      maxWidth: '90%',
      backgroundColor: 'transparent',
    },
    readyImageWrapper: {
      flex: 1,
      alignSelf: 'stretch',
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDark ? '#2B231D' : '#E9DDCB',
      padding: 0,
    },
    readyImage: {
      ...StyleSheet.absoluteFillObject,
      width: '100%',
      height: '100%',
      opacity: isDark ? 0.85 : 0.95,
    },
    readyImagePlaceholder: {
      backgroundColor: isDark ? colors.surfaceContainerHigh : colors.surfaceContainerLowest,
    },
    readyBody: {
      flex: 1,
      justifyContent: 'center',
      minWidth: 0,
      paddingLeft: 8,
    },
    readyTitle: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: isVerySmallPhone ? 21 : 25.5,
      lineHeight: isVerySmallPhone ? 27 : 33,
      color: isDark ? '#F6EDE1' : '#3E2F24',
      marginBottom: isVerySmallPhone ? 6 : 9,
    },
    readyMeta: {
      fontFamily: 'Inter_400Regular',
      fontSize: isVerySmallPhone ? 15 : 18,
      color: isDark ? 'rgba(246,237,225,0.74)' : 'rgba(62,47,36,0.72)',
      lineHeight: isVerySmallPhone ? 21 : 27,
    },
    readyDivider: {
      width: 1,
      alignSelf: 'stretch',
      opacity: 0.55,
      marginVertical: 0,
      marginHorizontal: isVerySmallPhone ? 6 : 8,
    },
    readyRight: {
      width: isVerySmallPhone ? 93 : isSmallPhone ? 111 : 144,
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      alignSelf: 'stretch',
      flexShrink: 0,
      paddingVertical: isVerySmallPhone ? 12 : 15,
      paddingHorizontal: isVerySmallPhone ? 6 : 8,
    },
    readyStatusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: isVerySmallPhone ? 6 : 8,
      marginBottom: isVerySmallPhone ? 8 : 12,
    },
    readyActionBtn: {
      paddingVertical: isVerySmallPhone ? 11 : 15,
      paddingHorizontal: isVerySmallPhone ? 9 : isSmallPhone ? 12 : 18,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(246,237,225,0.56)' : 'rgba(62,47,36,0.28)',
      backgroundColor: isDark ? 'rgba(246,237,225,0.08)' : 'rgba(255,255,255,0.5)',
      maxWidth: '100%',
      marginBottom: 3,
      width: '100%',
    },
    readyActionText: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: isVerySmallPhone ? 15 : isSmallPhone ? 16.5 : 18,
      color: isDark ? '#F6EDE1' : '#3E2F24',
      textAlign: 'center',
    },
    heroCard: {
      backgroundColor: categoryTheme.strongBackgroundColor,
      borderWidth: 1.5,
    },
    lockedCard: {
      opacity: 1,
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
    readyLockBadge: {
      width: isVerySmallPhone ? 24 : 28,
      height: isVerySmallPhone ? 24 : 28,
      borderRadius: isVerySmallPhone ? 12 : 14,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(246,237,225,0.42)' : 'rgba(62,47,36,0.28)',
      backgroundColor: isDark ? 'rgba(18,17,15,0.45)' : 'rgba(255,255,255,0.62)',
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
    readyContentGroup: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'stretch',
      paddingVertical: isVerySmallPhone ? 8 : isSmallPhone ? 10 : 11,
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
        <View style={styles.readyLeft}>
          <View style={[styles.readyImageWrapper, !catImg.source && styles.readyImagePlaceholder]}>
            {catImg.source ? (
              <Image source={catImg.source} style={styles.readyImage} resizeMode="cover" />
            ) : (
              <Ionicons name={getCatIcon(rawDisplayCat)} size={42} color={categoryTheme.accent} />
            )}
            <Text
              numberOfLines={1}
              style={[
                styles.readyCategoryLabel,
                {
                  color: categoryTheme.borderColor,
                },
              ]}
            >
              {displayCat}
            </Text>
            {locked ? (
              <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(10,8,6,0.52)',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Ionicons name="lock-closed" size={isVerySmallPhone ? 30 : 36} color="#F6EDE1" />
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.readyContentGroup}>
          <View style={[styles.readyDivider, { backgroundColor: categoryTheme.borderColor }]} />

          <View style={styles.readyBody}>
            <Text numberOfLines={isVerySmallPhone ? 2 : 3} style={styles.readyTitle}>
              {displayTitle}
            </Text>
            <Text style={styles.readyMeta} numberOfLines={1}>
              {story.min} {t('minLabel', lang)}
            </Text>
            {displaySrc && !isVerySmallPhone ? (
              <Text style={styles.readyMeta} numberOfLines={1}>
                {displaySrc}
              </Text>
            ) : null}
          </View>

          <View style={styles.readyRight}>
            <View style={styles.readyStatusRow}>
              {isRead && <Ionicons name="checkmark-circle" size={27} color={categoryTheme.accent} />}
              {isSaved && <Ionicons name="heart" size={27} color={categoryTheme.accent} />}
            </View>
            {onUseInConversation && !locked ? (
              <TouchableOpacity
                onPress={onUseInConversation}
                activeOpacity={0.85}
                style={[styles.readyActionBtn, { backgroundColor: categoryTheme.accent, borderColor: 'transparent' }]}
              >
                <Text numberOfLines={1} style={[styles.readyActionText, { color: '#FFFFFF' }]}>{t('story_detail_use_cta', lang)}</Text>
              </TouchableOpacity>
            ) : null}
          </View>
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
              {locked && <Ionicons name="lock-closed" size={15} color={colors.textSecondary} />}
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

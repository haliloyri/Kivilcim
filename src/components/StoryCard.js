import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { t } from '../locales/i18n';
import { getCategoryImage } from '../utils/categoryImages';

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

const StoryCard = ({ story, locked, isRead, onPress, type = 'standard', hideCategory = false, supportText = null }) => {
  const { colors, typography, layout, lang, isDark } = useTheme();
  const isHero = type === 'hero';
  const isCompact = type === 'compact';
  const isPhone = width < 768;
  const isSmallPhone = width < 390;
  
  const todayStr = new Date().toISOString().split('T')[0];
  const isNew = story.publishDate === todayStr;
  // DB already returns translated content for the active language
  const displayTitle = story.title || '';
  const displaySrc = story.source_book || '';
  // Always use the main category (parent_cat) for display label
  const rawDisplayCat = t(story.parent_cat || story.cat, lang) || '';
  const displayCat = rawDisplayCat ? rawDisplayCat.charAt(0).toUpperCase() + rawDisplayCat.slice(1).toLocaleLowerCase('tr-TR') : '';

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.backgroundDark,
      borderRadius: layout.radius.card,
      borderWidth: 1,
      borderColor: 'rgba(218, 193, 184, 0.2)',
      overflow: 'hidden',
      padding: isCompact ? 16 : 24,
      marginBottom: isCompact ? 0 : 20,
      width: isCompact ? (width - (layout.padding.horizontal * 2) - 16) / 2 : '100%',
      justifyContent: 'space-between',
      minHeight: isHero ? 220 : isCompact ? 160 : 140,
      shadowColor: '#1c1c19',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.04,
      shadowRadius: 8,
      elevation: 2,
    },
    heroCard: {
      backgroundColor: '#EBE6DC',
      borderWidth: 0,
    },
    lockedCard: {
      opacity: 0.6,
      backgroundColor: colors.backgroundDark,
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
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      backgroundColor: colors.background,
      borderWidth: 0,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      flexShrink: 1,
    },
    badgeText: {
      fontFamily: 'Inter_400Regular',
      fontSize: 11,
      color: colors.textSecondary,
      letterSpacing: 0.5,
      textTransform: 'none',
      flexShrink: 1,
    },
    cardTitle: {
      fontFamily: 'PlayfairDisplay_600SemiBold',
      fontSize: isSmallPhone ? 17 : isPhone ? 18 : 20,
      color: colors.text,
      lineHeight: isSmallPhone ? 23 : isPhone ? 24 : 26,
    },
    cardTitleHero: {
      fontSize: isSmallPhone ? 22 : isPhone ? 24 : 26,
      lineHeight: isSmallPhone ? 28 : isPhone ? 30 : 32,
    },
    cardTitleCompact: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: isSmallPhone ? 15 : isPhone ? 16 : 18,
      lineHeight: isSmallPhone ? 20 : isPhone ? 22 : 24,
    },
    cardFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 16,
    },
    supportText: {
      fontFamily: 'Inter_500Medium',
      fontSize: 11,
      lineHeight: 16,
      color: locked ? colors.primary : colors.textSecondary,
      marginTop: 8,
    },
    cardMeta: {
      fontFamily: 'Inter_400Regular',
      fontSize: 12,
      color: colors.textSecondary,
    },
    cardArrow: {
      fontSize: 16,
      color: colors.primary,
    },
    lockIcon: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    newBadge: {
      backgroundColor: colors.success,
      borderColor: colors.success,
    },
    newBadgeText: {
      color: '#FFF',
    },
    surfaceOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: isDark ? 'transparent' : colors.overlaySoft,
    },
  });

  return (
    <TouchableOpacity 
      activeOpacity={0.7} 
      onPress={onPress}
      style={[
        styles.card, 
        isHero && styles.heroCard, 
        locked && styles.lockedCard,
        isRead && styles.readCard,
        isHero && { padding: 0, overflow: 'hidden' } // Overlap hero card padding for image
      ]}
    >
      {isHero && (() => {
        const catImg = getCategoryImage(story.parent_cat_raw || story.parent_cat || story.cat, isDark);
        if (!catImg.source) return (
          <View style={StyleSheet.absoluteFill}>
            <View style={[StyleSheet.absoluteFill, { backgroundColor: isDark ? 'rgba(0,0,0,0.12)' : colors.overlaySoft }]} />
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
            <View style={[StyleSheet.absoluteFill, { backgroundColor: isDark ? 'rgba(0,0,0,0.12)' : colors.overlaySoft }]} />
          </View>
        );
      })()}
      {!isHero && <View pointerEvents="none" style={styles.surfaceOverlay} />}
      <View style={isHero ? { padding: 24, flex: 1, justifyContent: 'space-between' } : null}>
        <View>
          <View style={[styles.cardHeader, (!hideCategory || isNew || isRead || locked) ? null : { marginBottom: 0 }]}>
            {!hideCategory && (
              <View style={isHero ? { marginBottom: -8 } : styles.badge}>
                <Text style={isHero ? [styles.badgeText, { color: '#1A1A1A', fontSize: 13, textTransform: 'none', fontFamily: 'Inter_500Medium', backgroundColor: 'rgba(255,255,255,0.7)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }] : styles.badgeText} numberOfLines={1}>
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
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: isCompact ? 2 : 0 }}>
              <Ionicons name="chatbubbles-outline" size={11} color={colors.primary} />
              <Text style={[styles.cardMeta, { color: colors.primary, fontFamily: 'Inter_500Medium', fontSize: 11 }]} numberOfLines={1}>
                {t('mv_usable_badge', lang)}
              </Text>
            </View>
            {!isCompact && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2, opacity: 0.6 }}>
                <Ionicons name="time-outline" size={10} color={colors.textSecondary} />
                <Text style={[styles.cardMeta, { color: colors.textSecondary, fontSize: 10 }]} numberOfLines={1}>
                  {story.min} {t('minLabel', lang)} • {displaySrc}
                </Text>
              </View>
            )}
          </View>
          {!isCompact && <Text style={[styles.cardArrow, isHero && { color: colors.text }]}>→</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default StoryCard;

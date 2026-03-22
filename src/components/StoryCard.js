import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { t } from '../locales/i18n';

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
    default: return 'bookmark-outline';
  }
};

const StoryCard = ({ story, locked, isRead, onPress, type = 'standard', hideCategory = false }) => {
  const { colors, typography, layout, lang } = useTheme();
  const isHero = type === 'hero';
  const isCompact = type === 'compact';
  
  const todayStr = new Date().toISOString().split('T')[0];
  const isNew = story.publishDate === todayStr;
  // DB already returns translated content for the active language
  const displayTitle = story.title || '';
  const displaySrc = story.src || '';
  const displayCat = story.cat_display || t(story.cat, lang);

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.background,
      borderRadius: layout.radius.card,
      borderWidth: layout.borderWidth,
      borderColor: colors.border,
      padding: isCompact ? 16 : 20,
      marginBottom: isCompact ? 0 : 16,
      width: isCompact ? (width - (layout.padding.horizontal * 2) - 12) / 2 : '100%',
      justifyContent: 'space-between',
      minHeight: isHero ? 200 : isCompact ? 160 : 140,
    },
    heroCard: {
      backgroundColor: colors.backgroundDark,
      borderWidth: 1.5,
      borderColor: colors.primary,
    },
    lockedCard: {
      opacity: 0.7,
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
      paddingVertical: 3,
      borderRadius: 8,
      backgroundColor: colors.backgroundDark,
      borderWidth: layout.borderWidth,
      borderColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      flexShrink: 1,
    },
    badgeText: {
      fontFamily: 'DMSans_500Medium',
      fontSize: 10,
      color: colors.textSecondary,
      letterSpacing: 1,
      textTransform: 'uppercase',
      flexShrink: 1,
    },
    cardTitle: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: 18,
      color: colors.text,
      lineHeight: 24,
    },
    cardTitleHero: {
      fontSize: 24,
      lineHeight: 30,
    },
    cardTitleCompact: {
      fontSize: 15,
      lineHeight: 20,
    },
    cardFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 16,
    },
    cardMeta: {
      fontFamily: 'DMSans_400Regular',
      fontSize: 11,
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
    }
  });

  return (
    <TouchableOpacity 
      activeOpacity={0.7} 
      onPress={onPress}
      style={[
        styles.card, 
        isHero && styles.heroCard, 
        locked && styles.lockedCard,
        isRead && styles.readCard
      ]}
    >
      <View>
        <View style={styles.cardHeader}>
          {!hideCategory && (
            <View style={styles.badge}>
              <Ionicons name={getCatIcon(story.cat)} size={10} color={colors.textSecondary} />
              <Text style={styles.badgeText} numberOfLines={1}>{displayCat}</Text>
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
      </View>

      <View style={styles.cardFooter}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, flexShrink: 1, paddingRight: 8 }}>
          <Ionicons name="time-outline" size={12} color={colors.textSecondary} />
          <Text style={[styles.cardMeta, { flexShrink: 1 }]} numberOfLines={1}>{story.min} {t('minLabel', lang)} • {displaySrc}</Text>
        </View>
        {!isCompact && <Text style={styles.cardArrow}>→</Text>}
      </View>
    </TouchableOpacity>
  );
};

export default StoryCard;

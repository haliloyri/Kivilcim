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
  const displaySrc = story.source_book || '';
  const displayCat = t(story.cat_display || story.cat, lang);

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.backgroundDark,
      borderRadius: layout.radius.card,
      borderWidth: 1,
      borderColor: '#E8E3DA',
      padding: isCompact ? 16 : 24,
      marginBottom: isCompact ? 0 : 20,
      width: isCompact ? (width - (layout.padding.horizontal * 2) - 16) / 2 : '100%',
      justifyContent: 'space-between',
      minHeight: isHero ? 220 : isCompact ? 160 : 140,
      shadowColor: '#1A1A1A',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
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
      backgroundColor: '#E8E3DA',
      borderWidth: 0,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      flexShrink: 1,
    },
    badgeText: {
      fontFamily: 'Inter_500Medium',
      fontSize: 10,
      color: '#704214',
      letterSpacing: 0.5,
      textTransform: 'uppercase',
      flexShrink: 1,
    },
    cardTitle: {
      fontFamily: 'PlayfairDisplay_600SemiBold',
      fontSize: 20,
      color: colors.text,
      lineHeight: 26,
    },
    cardTitleHero: {
      fontSize: 26,
      lineHeight: 32,
    },
    cardTitleCompact: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: 18,
      lineHeight: 24,
    },
    cardFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 16,
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
            <View style={isHero ? { marginBottom: -8 } : styles.badge}>
              {!isHero && <Ionicons name={getCatIcon(story.cat)} size={10} color={'#704214'} />}
              <Text style={isHero ? [styles.badgeText, { color: '#5C5C5C', fontSize: 13, textTransform: 'none', fontFamily: 'Inter_400Regular' }] : styles.badgeText} numberOfLines={1}>
                {isHero ? 'Daily Insight' : displayCat}
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

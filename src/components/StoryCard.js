import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const StoryCard = ({ story, locked, isRead, onPress, type = 'standard' }) => {
  const { colors, typography, layout, lang } = useTheme();
  const isHero = type === 'hero';
  const isCompact = type === 'compact';
  
  const todayStr = '2026-03-16';
  const isNew = story.publishDate === todayStr;
  // Language-aware display
  const displayTitle = (lang === 'en' && story.title_en) ? story.title_en : story.title;
  const displayBody = (lang === 'en' && story.body_en) ? story.body_en : story.body;
  const displayLesson = (lang === 'en' && story.lesson_en) ? story.lesson_en : story.lesson;
  const displayQuote = (lang === 'en' && story.quote_en) ? story.quote_en : story.quote;
  const displaySrc = (lang === 'en' && story.src_en) ? story.src_en : story.src;
  const displaySourceBook = (lang === 'en' && story.source_book_en) ? story.source_book_en : story.source_book;
  const engCatMap = {
    'Finans': 'Finance',
    'Psikoloji': 'Psychology',
    'Tarih': 'History',
    'Liderlik': 'Leadership',
    'Sağlık': 'Health',
    'Bilim': 'Science',
    'Felsefe': 'Philosophy',
    'İş & Girişim': 'Business'
  };
  const displayCat = (lang === 'en' ? engCatMap[story.cat] ?? story.cat : story.cat);

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
    },
    badgeText: {
      fontFamily: 'DMSans_500Medium',
      fontSize: 10,
      color: colors.textSecondary,
      letterSpacing: 1,
      textTransform: 'uppercase',
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
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{displayCat}</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {isNew && (
              <View style={[styles.badge, styles.newBadge]}>
                <Text style={[styles.badgeText, styles.newBadgeText]}>YENİ</Text>
              </View>
            )}
            {isRead && <Text style={{ fontSize: 14 }}>✓</Text>}
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
        <Text style={styles.cardMeta}>{story.min} dk • {displaySrc}</Text>
        {!isCompact && <Text style={styles.cardArrow}>→</Text>}
      </View>
    </TouchableOpacity>
  );
};

export default StoryCard;

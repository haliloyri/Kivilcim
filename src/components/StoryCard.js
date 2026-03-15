import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const StoryCard = ({ story, locked, isRead, onPress, type = 'standard' }) => {
  const { colors, typography, layout } = useTheme();
  const isHero = type === 'hero';
  const isCompact = type === 'compact';

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.background,
      borderRadius: layout.radius.card,
      borderWidth: layout.borderWidth,
      borderColor: colors.border,
      padding: isCompact ? 16 : 20,
      marginBottom: isCompact ? 0 : 16,
      width: isCompact ? (width - 48) / 2 : '100%',
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
            <Text style={styles.badgeText}>{story.cat}</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 6 }}>
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
          {story.title}
        </Text>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.cardMeta}>{story.min} dk • {story.src}</Text>
        {!isCompact && <Text style={styles.cardArrow}>→</Text>}
      </View>
    </TouchableOpacity>
  );
};

export default StoryCard;

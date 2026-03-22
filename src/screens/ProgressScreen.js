import React, { useState } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, StyleSheet, 
  StatusBar, Platform, Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { 
  useSharedValue, useAnimatedStyle, withSpring, withSequence, withTiming 
} from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';
import { t } from '../locales/i18n';

const { width } = Dimensions.get('window');

const ProgressScreen = ({ navigation }) => {
  const { colors, typography, layout, isDark, lang } = useTheme();
  const badgeScale = useSharedValue(0);
  const badgeOpacity = useSharedValue(0);
  const [showCelebration, setShowCelebration] = useState(false);

  // Isı haritası verisi
  const heatmapData = Array.from({ length: 91 }, (_, i) => ({
    id: i,
    level: Math.floor(Math.random() * 4),
  }));

  const badges = [
    { id: 1, title: t('badge7Days', lang), sub: t('badgeStreak', lang), icon: '🔥', earned: true },
    { id: 2, title: t('badgeExplorer', lang), sub: t('badge10Stories', lang), icon: '🧭', earned: true },
    { id: 3, title: t('badgePhilosopher', lang), sub: t('badgePhilosophy5', lang), icon: '🏛️', earned: false },
    { id: 4, title: t('badgeSage', lang), sub: t('badge25Lessons', lang), icon: '📜', earned: false },
  ];

  const triggerCelebration = () => {
    setShowCelebration(true);
    badgeScale.value = 0;
    badgeOpacity.value = 1;
    badgeScale.value = withSequence(
      withSpring(1.2),
      withSpring(1)
    );
    
    setTimeout(() => {
      badgeOpacity.value = withTiming(0, { duration: 500 });
      setTimeout(() => setShowCelebration(false), 500);
    }, 2000);
  };

  const animatedBadgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
    opacity: badgeOpacity.value,
  }));

  const styles = StyleSheet.create({
    safe: { 
      flex: 1, 
      backgroundColor: colors.background, 
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 
    },
    homeHeader: { 
      paddingHorizontal: layout.padding.horizontal, 
      paddingVertical: 16 
    },
    greetName: { 
      fontFamily: 'PlayfairDisplay_700Bold', 
      fontSize: typography.sizes.headingSmall, 
      color: colors.text 
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: layout.padding.horizontal,
      marginTop: 24,
      marginBottom: 12,
    },
    sectionLabel: { 
      fontFamily: 'DMSans_500Medium', 
      fontSize: typography.sizes.badge, 
      color: colors.textSecondary, 
      letterSpacing: typography.spacing.badgeLetterSpacing, 
      textTransform: 'uppercase' 
    },
    heatmapCard: {
      backgroundColor: colors.background,
      borderWidth: layout.borderWidth,
      borderColor: colors.border,
      borderRadius: layout.radius.card,
      marginHorizontal: layout.padding.horizontal,
      padding: 16,
    },
    heatmapGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 4,
      justifyContent: 'center',
    },
    heatmapSquare: {
      width: (width - 80) / 13 - 4,
      height: (width - 80) / 13 - 4,
      borderRadius: 2,
    },
    heatmapLegend: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      marginTop: 16,
    },
    heatmapLegendText: {
      fontFamily: 'DMSans_400Regular',
      fontSize: 10,
      color: colors.textSecondary,
    },
    badgeContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      paddingHorizontal: layout.padding.horizontal,
    },
    badgeItem: {
      width: (width - (layout.padding.horizontal * 2) - 12) / 2,
      backgroundColor: colors.background,
      borderWidth: layout.borderWidth,
      borderColor: colors.border,
      borderRadius: layout.radius.card,
      padding: 16,
      alignItems: 'center',
    },
    badgeIconCircle: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.backgroundDark,
      borderWidth: 1.5,
      borderColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    badgeItemTitle: {
      fontFamily: 'PlayfairDisplay_600SemiBold',
      fontSize: 16,
      color: colors.text,
    },
    badgeItemSub: {
      fontFamily: 'DMSans_400Regular',
      fontSize: 12,
      color: colors.textSecondary,
    },
    statsRow: {
      flexDirection: 'row',
      gap: 12,
      paddingHorizontal: layout.padding.horizontal,
      marginTop: 24,
    },
    statBox: {
      flex: 1,
      backgroundColor: colors.backgroundDark,
      borderRadius: layout.radius.card,
      padding: 16,
      alignItems: 'center',
    },
    statNum: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: 24,
      color: colors.text,
    },
    statLabel: {
      fontFamily: 'DMSans_400Regular',
      fontSize: 11,
      color: colors.textSecondary,
      textTransform: 'uppercase',
    },
    celebrationOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(247, 243, 235, 0.95)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    congratsCircle: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 24,
      borderWidth: 3,
      borderColor: colors.danger,
    },
    congratsTitle: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: 32,
      color: colors.text,
      marginBottom: 8,
    },
    congratsSub: {
      fontFamily: 'DMSans_400Regular',
      fontSize: 16,
      color: colors.textSecondary,
    },
  });

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.homeHeader}>
          <Text style={styles.greetName}>{t('yourSparks', lang)}</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>{t('readingHabit', lang)}</Text>
        </View>
        <View style={styles.heatmapCard}>
          <View style={styles.heatmapGrid}>
            {heatmapData.map(item => (
              <View 
                key={item.id} 
                style={[
                  styles.heatmapSquare, 
                  { 
                    backgroundColor: item.level === 0 ? colors.backgroundDark : 
                                     item.level === 1 ? '#DBCFA7' : 
                                     item.level === 2 ? colors.primary : '#8B6A30' 
                  }
                ]} 
              />
            ))}
          </View>
          <View style={styles.heatmapLegend}>
            <Text style={styles.heatmapLegendText}>{t('less', lang)}</Text>
            <View style={[styles.heatmapSquare, { backgroundColor: colors.backgroundDark, marginHorizontal: 4 }]} />
            <View style={[styles.heatmapSquare, { backgroundColor: colors.primary, marginHorizontal: 4 }]} />
            <View style={[styles.heatmapSquare, { backgroundColor: '#8B6A30', marginHorizontal: 4 }]} />
            <Text style={styles.heatmapLegendText}>{t('more', lang)}</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>{t('achievementBadges', lang)}</Text>
          <TouchableOpacity onPress={triggerCelebration}>
            <Text style={{ fontSize: 11, color: colors.primary, fontFamily: 'DMSans_500Medium' }}>{t('testBtn', lang)}</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.badgeContainer}>
          {badges.map(badge => (
            <View key={badge.id} style={[styles.badgeItem, !badge.earned && { opacity: 0.4 }]}>
              <View style={styles.badgeIconCircle}>
                <Text style={{ fontSize: 24 }}>{badge.icon}</Text>
              </View>
              <Text style={styles.badgeItemTitle}>{badge.title}</Text>
              <Text style={styles.badgeItemSub}>{badge.sub}</Text>
            </View>
          ))}
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>42</Text>
            <Text style={styles.statLabel}>{t('statRead', lang)}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>12</Text>
            <Text style={styles.statLabel}>{t('statEarned', lang)}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>7</Text>
            <Text style={styles.statLabel}>{t('statStreak', lang)}</Text>
          </View>
        </View>
      </ScrollView>

      {showCelebration && (
        <View style={styles.celebrationOverlay} pointerEvents="none">
          <Animated.View style={[{ alignItems: 'center' }, animatedBadgeStyle]}>
            <View style={styles.congratsCircle}>
              <Text style={{ fontSize: 48 }}>🏆</Text>
            </View>
            <Text style={styles.congratsTitle}>{t('congratsTitle', lang)}</Text>
            <Text style={styles.congratsSub}>{t('congratsSub', lang)}</Text>
          </Animated.View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ProgressScreen;

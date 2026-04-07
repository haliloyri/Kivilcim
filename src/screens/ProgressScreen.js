import React, { useState, useEffect } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  StatusBar, Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { 
  useSharedValue, useAnimatedStyle, withSpring, withSequence, withTiming 
} from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';
import { useUserData } from '../context/UserDataContext';
import { t } from '../locales/i18n';
import { getReadHistory } from '../db/db';

const { width } = Dimensions.get('window');

const ProgressScreen = ({ navigation }) => {
  const { colors, layout, isDark, lang } = useTheme();
  const { streak, totalReads, earnedBadges, openBadgeModal } = useUserData();
  const badgeScale = useSharedValue(0);
  const badgeOpacity = useSharedValue(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [heatmapData, setHeatmapData] = useState([]);

  // Isı haritası verisini DB'den yükle
  useEffect(() => {
    const loadHeatmap = async () => {
      try {
        const history = await getReadHistory(91);
        const map = {};
        history.forEach(r => { map[r.day] = r.count; });
        const data = [];
        for (let i = 90; i >= 0; i--) {
          const d = new Date();
          d.setHours(0, 0, 0, 0);
          d.setDate(d.getDate() - i);
          const key = d.toISOString().split('T')[0];
          const count = map[key] || 0;
          const level = count === 0 ? 0 : count === 1 ? 1 : count <= 3 ? 2 : 3;
          data.push({ id: 90 - i, level });
        }
        setHeatmapData(data);
      } catch (e) {
        console.error('Heatmap yükleme hatası:', e);
        setHeatmapData(Array.from({ length: 91 }, (_, i) => ({ id: i, level: 0 })));
      }
    };
    loadHeatmap();
  }, [totalReads]);

  const badges = earnedBadges || [];

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
      backgroundColor: colors.background
    },
    homeHeader: { 
      paddingHorizontal: layout.padding.horizontal, 
      paddingTop: 32,
      paddingBottom: 16 
    },
    greetName: { 
      fontFamily: 'PlayfairDisplay_700Bold', 
      fontSize: 32, 
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
      fontFamily: 'Inter_500Medium', 
      fontSize: 11, 
      color: colors.textSecondary, 
      letterSpacing: 1, 
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
      fontFamily: 'Inter_400Regular',
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
      fontFamily: 'Inter_400Regular',
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
      fontFamily: 'Inter_400Regular',
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
      fontFamily: 'Inter_400Regular',
      fontSize: 16,
      color: colors.textSecondary,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    modalCard: {
      backgroundColor: colors.background,
      borderRadius: layout.radius.card,
      padding: 28,
      width: '100%',
      maxWidth: 340,
      alignItems: 'center',
      borderWidth: layout.borderWidth,
      borderColor: colors.border,
    },
    modalIconCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    modalTitle: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: 22,
      color: colors.text,
      marginBottom: 4,
      textAlign: 'center',
    },
    modalSub: {
      fontFamily: 'Inter_400Regular',
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 16,
      textAlign: 'center',
    },
    modalDesc: {
      fontFamily: 'Inter_400Regular',
      fontSize: 14,
      color: colors.text,
      textAlign: 'center',
      lineHeight: 20,
      marginBottom: 16,
    },
    modalStatusBadge: {
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: 20,
      marginBottom: 20,
    },
    modalStatusText: {
      fontFamily: 'Inter_500Medium',
      fontSize: 12,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    modalCloseBtn: {
      paddingHorizontal: 32,
      paddingVertical: 10,
      borderRadius: layout.radius.card,
      borderWidth: 1,
      borderColor: colors.border,
    },
    modalCloseText: {
      fontFamily: 'Inter_500Medium',
      fontSize: 14,
      color: colors.text,
    },
  });

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safe}>
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
            <Text style={{ fontSize: 11, color: colors.primary, fontFamily: 'Inter_500Medium' }}>{t('testBtn', lang)}</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.badgeContainer}>
          {badges.map(badge => (
            <TouchableOpacity 
              key={badge.id} 
              activeOpacity={0.7}
              onPress={() => openBadgeModal(badge)}
              style={[styles.badgeItem, !badge.earned && { opacity: 0.4 }]}
            >
              <View style={styles.badgeIconCircle}>
                <Text style={{ fontSize: 24 }}>{badge.icon}</Text>
              </View>
              <Text style={styles.badgeItemTitle}>{t(badge.titleKey, lang) || badge.titleKey}</Text>
              <Text style={styles.badgeItemSub}>{t(badge.subKey, lang) || badge.subKey}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{totalReads}</Text>
            <Text style={styles.statLabel}>{t('statRead', lang)}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{badges.filter(b => b.earned).length}</Text>
            <Text style={styles.statLabel}>{t('statEarned', lang)}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{streak}</Text>
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

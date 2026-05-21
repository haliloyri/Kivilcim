import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  StatusBar, Platform, Switch, Alert, Linking, Modal, TextInput,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import { useTheme } from '../context/ThemeContext';
import { useUserData } from '../context/UserDataContext';
import { useStories } from '../context/StoriesContext';
import { Ionicons } from '@expo/vector-icons';
import { t } from '../locales/i18n';
import CategoryPill from '../components/CategoryPill';



const ProfileScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const isSmallPhone = width < 380;
  const fz = (base) => isTablet ? base + 4 : isSmallPhone ? base - 2 : base;

  const {
    colors, typography, layout, isDark, themeMode,
    toggleTheme, lang, setLang,
    selectedCategories, toggleSelectedCategory, resetAppSettings,
  } = useTheme();

  const { parentCategories, stories } = useStories();
  const {
    clearUserData, isPremium, preferences,
    updatePreferences, userProfile, updateUserProfile,
    history, earnedBadges, totalReads, streak, longestStreak,
  } = useUserData();
  const testNotifIndex = React.useRef(0);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');

  const timeOptions = [
    { label: t('time_3min', lang), value: 3, icon: '☕' },
    { label: t('time_6min', lang), value: 6, icon: '📚' },
    { label: t('time_9min', lang), value: 9, icon: '🚀' },
  ];
  const reminderOptions = [
    { label: t('reminder_morning', lang), value: 'morning', icon: '🌅', reminderHour: 8 },
    { label: t('reminder_noon', lang), value: 'noon', icon: '☀️', reminderHour: 13 },
    { label: t('reminder_evening', lang), value: 'evening', icon: '🌙', reminderHour: 21 },
  ];

  const selectedMinutes = preferences?.time?.minutes || 6;
  const selectedReminders = preferences?.reminderWindows || [preferences?.reminderWindow || 'evening'];
  const selectedTarget = preferences?.time?.dailyStoryTarget || 2;
  const selectedReminderLabel = reminderOptions
    .filter(o => selectedReminders.includes(o.value))
    .map(o => o.label)
    .join(', ') || t('reminder_evening', lang);
  const currentThemeLabel = themeMode === 'dark' ? t('themeModeDark', lang) : t('themeModeLight', lang);
  const profileDisplayName = userProfile?.displayName || t('profileGuestName', lang);
  const profileEmail = userProfile?.email || t('profileGuestEmail', lang);
  const avatarText = (userProfile?.displayName || t('profileGuestAvatar', lang))
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
  const isGuest = !userProfile?.displayName;
  const langName = lang === 'tr' ? 'Turkish' : lang === 'en' ? 'English' : lang === 'es' ? 'Spanish' : 'German';

  const earnedBadgesList = React.useMemo(() => earnedBadges.filter(b => b.earned), [earnedBadges]);
  const lastEarned = earnedBadgesList[earnedBadgesList.length - 1];

  const recentStories = React.useMemo(() => {
    if (!history?.length || !stories?.length) return [];
    return history
      .slice(0, 3)
      .map(id => stories.find(s => String(s.story_id) === String(id)))
      .filter(Boolean);
  }, [history, stories]);

  const showStats = totalReads > 0 || streak > 0;

  const handleReadingPlanChange = async (minutes) => {
    const selected = timeOptions.find((o) => o.value === minutes);
    if (!selected) return;

    const nextTimePreference = {
      label: selected.label,
      icon: selected.icon,
      minutes,
      dailyStoryTarget: minutes === 3 ? 1 : minutes === 6 ? 2 : 3,
    };
    await updatePreferences({ time: nextTimePreference });
  };

  const handleReminderToggle = async (windowValue) => {
    const current = preferences?.reminderWindows || [preferences?.reminderWindow || 'evening'];
    let next;
    if (current.includes(windowValue)) {
      if (current.length === 1) return; // en az bir seçim zorunlu
      next = current.filter(w => w !== windowValue);
    } else {
      next = [...current, windowValue];
    }
    await updatePreferences({ reminderWindows: next });
  };

  const openPrivacyPolicy = async () => {
    const url = 'https://sparkapp.co/privacy';
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (!canOpen) {
        Alert.alert(t('alert_error', lang), t('profileExternalLinkError', lang));
        return;
      }
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert(t('alert_error', lang), t('profileExternalLinkError', lang));
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      t('profileLogoutTitle', lang),
      t('profileLogoutSub', lang),
      [
        { text: t('profileCancel', lang), style: 'cancel' },
        {
          text: t('logout', lang),
          style: 'destructive',
          onPress: async () => {
            await updateUserProfile({ displayName: null, email: null });
          },
        },
      ]
    );
  };

  const handleResetData = async () => {
    Alert.alert(
      t('profileResetDataTitle', lang),
      t('profileResetDataSub', lang),
      [
        { text: t('profileCancel', lang), style: 'cancel' },
        {
          text: t('profileResetDataCta', lang),
          style: 'destructive',
          onPress: async () => {
            await Notifications.cancelAllScheduledNotificationsAsync().catch(() => {});
            await clearUserData();
            await resetAppSettings();
          },
        },
      ]
    );
  };

  const scheduleTestNotification = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    let finalStatus = status;
    if (status !== 'granted') {
      const { status: askStatus } = await Notifications.requestPermissionsAsync();
      finalStatus = askStatus;
    }
    
    if (finalStatus !== 'granted') {
      alert(t('notif_perm_denied', lang));
      return;
    }

    const testMessages = ['notif_8', 'notif_13', 'notif_16', 'notif_21'];
    const messageKey = testMessages[testNotifIndex.current];
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: t('brandText', lang),
        body: t(messageKey, lang),
        data: { data: 'test data' },
      },
      trigger: null, // immediate
    });

    testNotifIndex.current = (testNotifIndex.current + 1) % testMessages.length;
  };

  const openEditProfileModal = () => {
    setEditName(userProfile?.displayName || '');
    setEditEmail(userProfile?.email || '');
    setShowEditProfileModal(true);
  };

  const saveProfileEdits = async () => {
    await updateUserProfile({
      displayName: editName,
      email: editEmail,
    });
    setShowEditProfileModal(false);
  };

  const s = StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    scrollContent: { paddingBottom: 120 },
    // ── Header ───────────────────────────────────────────────────────────
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: layout.padding.horizontal,
      paddingTop: 28,
      paddingBottom: 20,
      gap: 14,
    },
    avatar: {
      width: 64, height: 64, borderRadius: 32,
      backgroundColor: colors.surfaceContainerHigh,
      borderWidth: 2, borderColor: colors.primary,
      alignItems: 'center', justifyContent: 'center',
      shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15, shadowRadius: 8, elevation: 3,
    },
    avatarText: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: fz(24),
      color: colors.primary,
    },
    headerInfo: { flex: 1 },
    userName: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: fz(22),
      color: colors.text,
      lineHeight: fz(28),
    },
    userEmail: {
      fontFamily: 'Inter_400Regular',
      fontSize: fz(13),
      color: colors.textSecondary,
      marginTop: 2,
    },
    guestCta: {
      marginTop: 6,
      alignSelf: 'flex-start',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 8,
      backgroundColor: `${colors.primary}18`,
      borderWidth: 1,
      borderColor: `${colors.primary}40`,
    },
    guestCtaText: {
      fontFamily: 'Inter_500Medium',
      fontSize: 12,
      color: colors.primary,
    },
    headerEdit: {
      width: 36, height: 36, borderRadius: 18,
      backgroundColor: colors.backgroundDark,
      borderWidth: 1, borderColor: colors.border,
      alignItems: 'center', justifyContent: 'center',
    },
    premiumTag: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: layout.padding.horizontal,
      marginBottom: 4,
      gap: 5,
      alignSelf: 'flex-start',
    },
    premiumTagText: {
      fontFamily: 'Inter_500Medium',
      fontSize: 12,
      color: colors.primary,
    },
    // ── Stats ────────────────────────────────────────────────────────────
    statsCard: {
      marginHorizontal: layout.padding.horizontal,
      marginBottom: 16,
      borderRadius: layout.radius.card,
      borderWidth: 1,
      borderColor: `${colors.primary}40`,
      backgroundColor: `${colors.primary}10`,
      flexDirection: 'row',
      padding: 16,
    },
    statItem: {
      flex: 1,
      alignItems: 'center',
      gap: 4,
    },
    statDivider: {
      width: 1,
      backgroundColor: `${colors.primary}30`,
      marginVertical: 4,
    },
    statValue: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: fz(22),
      color: colors.text,
    },
    statLabel: {
      fontFamily: 'Inter_400Regular',
      fontSize: fz(11),
      color: colors.textSecondary,
      textAlign: 'center',
    },
    // ── Premium Upsell ───────────────────────────────────────────────────
    premiumCard: {
      marginHorizontal: layout.padding.horizontal,
      marginBottom: 16,
      borderRadius: layout.radius.card,
      borderWidth: 1,
      borderColor: `${colors.primary}55`,
      backgroundColor: `${colors.primary}12`,
      padding: 20,
    },
    premiumCardIntro: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 11,
      color: colors.primary,
      letterSpacing: 1,
      textTransform: 'uppercase',
      marginBottom: 6,
    },
    premiumCardTitle: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: fz(22),
      color: colors.text,
      marginBottom: 6,
    },
    premiumCardSub: {
      fontFamily: 'Inter_400Regular',
      fontSize: fz(15),
      color: colors.textSecondary,
      lineHeight: 21,
      marginBottom: 14,
    },
    premiumCardCta: {
      alignSelf: 'flex-start',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 999,
      backgroundColor: colors.primary,
    },
    premiumCardCtaText: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 13,
      color: colors.onPrimary,
      letterSpacing: 0.5,
      textTransform: 'uppercase',
    },
    // ── Section ──────────────────────────────────────────────────────────
    section: {
      marginTop: 24,
      paddingHorizontal: layout.padding.horizontal,
    },
    sectionHeadingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 14,
    },
    sectionTitle: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: fz(22),
      color: colors.text,
    },
    seeAllText: {
      fontFamily: 'Inter_500Medium',
      fontSize: 13,
      color: colors.primary,
    },
    // ── Category pills ───────────────────────────────────────────────────
    pillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    // ── Preference pills ─────────────────────────────────────────────────
    prefPill: {
      paddingHorizontal: 14, paddingVertical: 9,
      borderRadius: 20, borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.cardBackground,
      flexDirection: 'row', alignItems: 'center', gap: 6,
    },
    prefPillActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    prefPillText: {
      fontFamily: 'Inter_500Medium',
      fontSize: fz(13),
      color: colors.textSecondary,
    },
    prefPillActiveText: {
      color: colors.onPrimary,
    },
    // ── Menu ─────────────────────────────────────────────────────────────
    menuItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    menuItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    menuItemText: {
      fontFamily: 'Inter_400Regular',
      fontSize: fz(15),
      color: colors.text,
    },
    // ── Pref summary box ─────────────────────────────────────────────────
    prefSummaryBox: {
      marginTop: 14,
      backgroundColor: colors.backgroundDark,
      borderRadius: layout.radius.card,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    prefSummaryCell: {
      width: '50%',
      paddingVertical: 6,
      paddingHorizontal: 4,
    },
    prefSummaryCellLabel: {
      fontFamily: 'Inter_400Regular',
      fontSize: fz(11),
      color: colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.4,
      marginBottom: 2,
    },
    prefSummaryCellValue: {
      fontFamily: 'Inter_500Medium',
      fontSize: fz(13),
      color: colors.text,
    },
    // ── Destructive ──────────────────────────────────────────────────────
    destructiveSection: {
      marginTop: 12,
      backgroundColor: colors.backgroundDark,
      borderRadius: layout.radius.card,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    destructiveItem: {
      paddingHorizontal: 16, paddingVertical: 16,
      borderBottomWidth: 1, borderBottomColor: colors.border,
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12,
    },
    destructiveTitle: {
      fontFamily: 'Inter_500Medium',
      fontSize: fz(14),
      color: colors.danger,
      marginBottom: 2,
    },
    destructiveSub: {
      fontFamily: 'Inter_400Regular',
      fontSize: fz(12),
      color: colors.textSecondary,
      lineHeight: 17,
      flexShrink: 1,
    },
    // ── Badges ───────────────────────────────────────────────────────────
    badgesRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.backgroundDark,
      borderRadius: layout.radius.card,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 14,
      gap: 12,
    },
    badgeIconsGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
    },
    badgeEmoji: {
      fontSize: 22,
    },
    badgesInfo: { flex: 1 },
    badgesCount: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: fz(14),
      color: colors.text,
    },
    badgesSub: {
      fontFamily: 'Inter_400Regular',
      fontSize: fz(12),
      color: colors.textSecondary,
      marginTop: 2,
    },
    // ── Recent reads ─────────────────────────────────────────────────────
    recentCard: {
      width: 160,
      height: 120,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.backgroundDark,
      padding: 12,
      marginRight: 10,
      justifyContent: 'space-between',
    },
    recentCategory: {
      fontFamily: 'Inter_500Medium',
      fontSize: 11,
      color: colors.primary,
      textTransform: 'uppercase',
      letterSpacing: 0.4,
      marginBottom: 4,
    },
    recentTitle: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: fz(14),
      color: colors.text,
      lineHeight: 19,
      flex: 1,
    },
    recentMins: {
      fontFamily: 'Inter_400Regular',
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 4,
    },
    // ── Notify test ──────────────────────────────────────────────────────
    notifyTestLabel: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 12,
      color: colors.primary,
      letterSpacing: 0.5,
    },
  });

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={s.safe}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>

        {/* ── Header ── */}
        <View style={s.header}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{avatarText}</Text>
          </View>
          <View style={s.headerInfo}>
            <Text style={s.userName} numberOfLines={1}>{profileDisplayName}</Text>
            <Text style={s.userEmail} numberOfLines={1}>{profileEmail}</Text>
            {isGuest && (
              <TouchableOpacity style={s.guestCta} onPress={openEditProfileModal}>
                <Text style={s.guestCtaText}>{t('profileCompletePrompt', lang)}</Text>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={s.headerEdit} onPress={openEditProfileModal}>
            <Ionicons name="pencil" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {isPremium && (
          <View style={s.premiumTag}>
            <Ionicons name="sparkles" size={13} color={colors.primary} />
            <Text style={s.premiumTagText}>{t('premiumMember', lang)}</Text>
          </View>
        )}

        {/* ── Stats ── */}
        {showStats && (
          <TouchableOpacity style={s.statsCard} onPress={() => navigation.navigate('ProgressTab')} activeOpacity={0.82}>
            <View style={s.statItem}>
              <Text style={s.statValue}>{totalReads}</Text>
              <Text style={s.statLabel}>{t('profileStatsTotalReads', lang)}</Text>
            </View>
            <View style={s.statDivider} />
            <View style={s.statItem}>
              <Text style={s.statValue}>🔥 {streak}</Text>
              <Text style={s.statLabel}>{t('profileStatsStreak', lang)}</Text>
            </View>
            <View style={s.statDivider} />
            <View style={s.statItem}>
              <Text style={s.statValue}>{longestStreak}</Text>
              <Text style={s.statLabel}>{t('profileStatsLongest', lang)}</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* ── Premium upsell ── */}
        {!isPremium && (
          <TouchableOpacity style={s.premiumCard} onPress={() => navigation.navigate('Paywall', { source: 'profile_upsell', reason: 'profile_upgrade' })} activeOpacity={0.88}>
            <Text style={s.premiumCardIntro}>✨ PREMIUM</Text>
            <Text style={s.premiumCardTitle}>{t('profilePremiumUpsellTitle', lang)}</Text>
            <Text style={s.premiumCardSub}>{t('profilePremiumUpsellSub', lang)}</Text>
            <View style={s.premiumCardCta}>
              <Text style={s.premiumCardCtaText}>{t('profilePremiumUpsellCta', lang)}</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* ── Categories ── */}
        <View style={s.section}>
          <View style={s.sectionHeadingRow}>
            <Text style={s.sectionTitle}>{t('categories', lang)}</Text>
          </View>
          <View style={s.pillsRow}>
            {parentCategories.map(p => {
              const cat = Number(p.id);
              const isSelected = selectedCategories.includes(cat);
              return (
                <CategoryPill
                  key={cat}
                  label={p.name}
                  categoryName={p.raw_name || p.name}
                  active={isSelected}
                  isDark={isDark}
                  compact
                  onPress={() => toggleSelectedCategory(cat)}
                />
              );
            })}
          </View>
        </View>

        {/* ── Preferences ── */}
        <View style={s.section}>
          <View style={s.sectionHeadingRow}>
            <Text style={s.sectionTitle}>{t('settings', lang)}</Text>
          </View>

          {/* Reading plan */}
          <View style={[s.menuItem, { flexDirection: 'column', alignItems: 'flex-start' }]}>
            <View style={s.menuItemLeft}>
              <Ionicons name="book-outline" size={22} color={colors.textSecondary} />
              <Text style={s.menuItemText}>{t('readingPlan', lang)}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
              {timeOptions.map(option => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => handleReadingPlanChange(option.value)}
                  style={[s.prefPill, selectedMinutes === option.value && s.prefPillActive]}
                >
                  <Text style={[s.prefPillText, selectedMinutes === option.value && s.prefPillActiveText]}>{option.icon}</Text>
                  <Text style={[s.prefPillText, selectedMinutes === option.value && s.prefPillActiveText]}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Reminder */}
          <View style={[s.menuItem, { flexDirection: 'column', alignItems: 'flex-start' }]}>
            <View style={s.menuItemLeft}>
              <Ionicons name="time-outline" size={22} color={colors.textSecondary} />
              <Text style={s.menuItemText}>{t('reminderTime', lang)}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
              {reminderOptions.map(option => {
                const isSelected = selectedReminders.includes(option.value);
                return (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => handleReminderToggle(option.value)}
                    style={[s.prefPill, isSelected && s.prefPillActive]}
                  >
                    <Text style={[s.prefPillText, isSelected && s.prefPillActiveText]}>{option.icon}</Text>
                    <Text style={[s.prefPillText, isSelected && s.prefPillActiveText]}>{option.label}</Text>
                    {isSelected && <Ionicons name="checkmark" size={12} color={isSelected ? colors.onPrimary : colors.textSecondary} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Pref summary 2×2 grid */}
          <View style={s.prefSummaryBox}>
            <View style={s.prefSummaryCell}>
              <Text style={s.prefSummaryCellLabel}>{t('themeSummary', lang).split(':')[0]}</Text>
              <Text style={s.prefSummaryCellValue}>{currentThemeLabel}</Text>
            </View>
            <View style={s.prefSummaryCell}>
              <Text style={s.prefSummaryCellLabel}>{t('languageLabel', lang)}</Text>
              <Text style={s.prefSummaryCellValue}>{t(`language${langName}`, lang)}</Text>
            </View>
            <View style={s.prefSummaryCell}>
              <Text style={s.prefSummaryCellLabel}>{t('readingPlan', lang)}</Text>
              <Text style={s.prefSummaryCellValue}>{t('dailyTargetSummary', lang).replace('{{target}}', String(selectedTarget))}</Text>
            </View>
            <View style={s.prefSummaryCell}>
              <Text style={s.prefSummaryCellLabel}>{t('reminderTime', lang)}</Text>
              <Text style={s.prefSummaryCellValue}>{selectedReminderLabel}</Text>
            </View>
          </View>

          {/* Dark mode */}
          <View style={s.menuItem}>
            <View style={s.menuItemLeft}>
              <Ionicons name="sunny-outline" size={22} color={colors.textSecondary} />
              <Text style={s.menuItemText}>{t('darkMode', lang)}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textSecondary }}>{currentThemeLabel}</Text>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : isDark ? colors.primary : '#f4f3f4'}
              />
            </View>
          </View>

          {/* Notify test */}
          <TouchableOpacity style={s.menuItem} onPress={scheduleTestNotification}>
            <View style={s.menuItemLeft}>
              <Ionicons name="notifications-outline" size={22} color={colors.textSecondary} />
              <Text style={s.menuItemText}>{t('notifyTest', lang)}</Text>
            </View>
            <Text style={s.notifyTestLabel}>{t('test', lang).toUpperCase()}</Text>
          </TouchableOpacity>

          {/* Language */}
          <View style={[s.menuItem, { flexDirection: 'column', alignItems: 'flex-start', borderBottomWidth: 0 }]}>
            <View style={s.menuItemLeft}>
              <Ionicons name="globe-outline" size={22} color={colors.textSecondary} />
              <Text style={s.menuItemText}>{t('languageLabel', lang)}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
              {[
                { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
                { code: 'en', label: 'English', flag: '🇺🇸' },
                { code: 'es', label: 'Español', flag: '🇪🇸' },
                { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
              ].map(l => (
                <TouchableOpacity
                  key={l.code}
                  onPress={() => setLang(l.code)}
                  style={[s.prefPill, lang === l.code && s.prefPillActive]}
                >
                  <Text style={[s.prefPillText, lang === l.code && s.prefPillActiveText]}>{l.flag} {l.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* ── Activity ── */}
        <View style={s.section}>
          <View style={s.sectionHeadingRow}>
            <Text style={s.sectionTitle}>{t('profileActivitySection', lang)}</Text>
          </View>

          {/* Badges summary */}
          <TouchableOpacity style={s.badgesRow} onPress={() => navigation.navigate('ProgressTab')} activeOpacity={0.82}>
            <View style={s.badgeIconsGroup}>
              {earnedBadgesList.length > 0
                ? earnedBadgesList.slice(-3).map((b, i) => (
                    <Text key={b.id} style={[s.badgeEmoji, { opacity: 1 - i * 0.2 }]}>{b.icon}</Text>
                  ))
                : <Text style={s.badgeEmoji}>🏅</Text>
              }
            </View>
            <View style={s.badgesInfo}>
              <Text style={s.badgesCount}>{t('profileBadgesTitle', lang)}: {earnedBadgesList.length} / {earnedBadges.length}</Text>
              {lastEarned
                ? <Text style={s.badgesSub}>{lastEarned.icon} {lastEarned.name || lastEarned.id}</Text>
                : <Text style={s.badgesSub}>{t('profileSeeAll', lang)}</Text>
              }
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          {/* Recent reads */}
          {recentStories.length > 0 && (
            <>
              <View style={[s.sectionHeadingRow, { marginTop: 20, marginBottom: 8 }]}>
                <Text style={[s.sectionTitle, { fontSize: fz(17) }]}>{t('profileRecentTitle', lang)}</Text>
                <TouchableOpacity onPress={() => navigation.navigate('LibraryTab')}>
                  <Text style={s.seeAllText}>{t('profileSeeAll', lang)}</Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: 4 }}
              >
                {recentStories.map(story => (
                  <TouchableOpacity
                    key={story.story_id}
                    style={s.recentCard}
                    onPress={() => navigation.navigate('StoryDetail', { story })}
                    activeOpacity={0.82}
                  >
                    <Text style={s.recentCategory} numberOfLines={1}>{story.category || story.parent_category || ''}</Text>
                    <Text style={s.recentTitle} numberOfLines={3}>{story.title}</Text>
                    {story.read_time != null && (
                      <Text style={s.recentMins}>{story.read_time} dk</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          )}
        </View>

        {/* ── Account ── */}
        <View style={s.section}>
          <View style={s.sectionHeadingRow}>
            <Text style={s.sectionTitle}>{t('account', lang)}</Text>
          </View>

          <TouchableOpacity style={s.menuItem} onPress={openEditProfileModal}>
            <View style={s.menuItemLeft}>
              <Ionicons name="person-outline" size={22} color={colors.textSecondary} />
              <Text style={s.menuItemText}>{t('editInfo', lang)}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={s.menuItem} onPress={openPrivacyPolicy}>
            <View style={s.menuItemLeft}>
              <Ionicons name="shield-outline" size={22} color={colors.textSecondary} />
              <Text style={s.menuItemText}>{t('privacy', lang)}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={s.destructiveSection}>
            <TouchableOpacity style={s.destructiveItem} onPress={handleResetData}>
              <View style={{ flex: 1 }}>
                <Text style={s.destructiveTitle}>{t('profileResetDataLabel', lang)}</Text>
                <Text style={s.destructiveSub}>{t('profileResetDataHint', lang)}</Text>
              </View>
              <Ionicons name="refresh-outline" size={18} color={colors.danger} />
            </TouchableOpacity>

            <TouchableOpacity style={[s.destructiveItem, { borderBottomWidth: 0 }]} onPress={handleLogout}>
              <View style={{ flex: 1 }}>
                <Text style={s.destructiveTitle}>{t('logout', lang)}</Text>
                <Text style={s.destructiveSub}>{t('profileLogoutHint', lang)}</Text>
              </View>
              <Ionicons name="log-out-outline" size={18} color={colors.danger} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* ── Edit Profile Modal ── */}
      <Modal
        visible={showEditProfileModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEditProfileModal(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: isDark ? colors.overlayDark : 'rgba(18,17,15,0.24)',
          justifyContent: 'center',
          paddingHorizontal: layout.padding.horizontal,
        }}>
          <View style={{
            backgroundColor: colors.background,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.border,
            padding: 18,
            gap: 10,
          }}>
            <Text style={{ fontFamily: 'PlayfairDisplay_700Bold', fontSize: 22, color: colors.text }}>
              {t('editInfo', lang)}
            </Text>

            <TextInput
              value={editName}
              onChangeText={setEditName}
              placeholder={t('profileNamePlaceholder', lang)}
              placeholderTextColor={colors.textSecondary}
              style={{
                borderWidth: 1, borderColor: colors.border, borderRadius: 10,
                paddingHorizontal: 12, paddingVertical: 10,
                color: colors.text, fontFamily: 'Inter_400Regular',
                backgroundColor: colors.backgroundDark,
              }}
            />

            <TextInput
              value={editEmail}
              onChangeText={setEditEmail}
              placeholder={t('profileEmailPlaceholder', lang)}
              placeholderTextColor={colors.textSecondary}
              autoCapitalize="none"
              keyboardType="email-address"
              style={{
                borderWidth: 1, borderColor: colors.border, borderRadius: 10,
                paddingHorizontal: 12, paddingVertical: 10,
                color: colors.text, fontFamily: 'Inter_400Regular',
                backgroundColor: colors.backgroundDark,
              }}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
              <TouchableOpacity onPress={() => setShowEditProfileModal(false)} style={{ paddingHorizontal: 12, paddingVertical: 10 }}>
                <Text style={{ fontFamily: 'Inter_500Medium', color: colors.textSecondary }}>{t('profileCancel', lang)}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveProfileEdits} style={{ backgroundColor: colors.primary, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10 }}>
                <Text style={{ fontFamily: 'Inter_500Medium', color: colors.onPrimary }}>{t('profileSave', lang)}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ProfileScreen;

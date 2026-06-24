import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  StatusBar, Platform, Switch, Alert, Linking, Modal, TextInput,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
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

  const { parentCategories } = useStories();
  const {
    clearUserData, isPremium, preferences,
    updatePreferences, userProfile, updateUserProfile,
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

  const handleReadingPlanChange = async (minutes) => {
    const selected = timeOptions.find((o) => o.value === minutes);
    if (!selected) return;
    await updatePreferences({
      time: {
        label: selected.label,
        icon: selected.icon,
        minutes,
        dailyStoryTarget: minutes === 3 ? 1 : minutes === 6 ? 2 : 3,
      },
    });
  };

  const handleReminderToggle = async (windowValue) => {
    const current = preferences?.reminderWindows || [preferences?.reminderWindow || 'evening'];
    if (current.includes(windowValue) && current.length === 1) return;
    const next = current.includes(windowValue)
      ? current.filter(w => w !== windowValue)
      : [...current, windowValue];
    await updatePreferences({ reminderWindows: next });
  };

  const openPrivacyPolicy = async () => {
    const url = 'https://sparkapp.co/privacy';
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (!canOpen) { Alert.alert(t('alert_error', lang), t('profileExternalLinkError', lang)); return; }
      await Linking.openURL(url);
    } catch {
      Alert.alert(t('alert_error', lang), t('profileExternalLinkError', lang));
    }
  };

  const handleLogout = () => {
    Alert.alert(t('profileLogoutTitle', lang), t('profileLogoutSub', lang), [
      { text: t('profileCancel', lang), style: 'cancel' },
      {
        text: t('logout', lang), style: 'destructive',
        onPress: async () => { await updateUserProfile({ displayName: null, email: null }); },
      },
    ]);
  };

  const handleResetData = () => {
    Alert.alert(t('profileResetDataTitle', lang), t('profileResetDataSub', lang), [
      { text: t('profileCancel', lang), style: 'cancel' },
      {
        text: t('profileResetDataCta', lang), style: 'destructive',
        onPress: async () => {
          await Notifications.cancelAllScheduledNotificationsAsync().catch(() => {});
          await clearUserData();
          await resetAppSettings();
        },
      },
    ]);
  };

  const scheduleTestNotification = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    let finalStatus = status;
    if (status !== 'granted') {
      const { status: askStatus } = await Notifications.requestPermissionsAsync();
      finalStatus = askStatus;
    }
    if (finalStatus !== 'granted') { alert(t('notif_perm_denied', lang)); return; }
    const testMessages = ['notif_8', 'notif_13', 'notif_16', 'notif_21'];
    await Notifications.scheduleNotificationAsync({
      content: { title: t('brandText', lang), body: t(testMessages[testNotifIndex.current], lang), data: {} },
      trigger: null,
    });
    testNotifIndex.current = (testNotifIndex.current + 1) % testMessages.length;
  };

  const openEditProfileModal = () => {
    setEditName(userProfile?.displayName || '');
    setEditEmail(userProfile?.email || '');
    setShowEditProfileModal(true);
  };

  const saveProfileEdits = async () => {
    await updateUserProfile({ displayName: editName, email: editEmail });
    setShowEditProfileModal(false);
  };

  // ── Icon row helpers ──────────────────────────────────────────────────────
  const iconBg = {
    gold:   isDark ? '#3D2E0D' : '#FFF8E6',
    blue:   isDark ? '#0D2035' : '#E6F1FB',
    gray:   isDark ? '#2A2520' : '#EFE9DF',
    purple: isDark ? '#1E1A35' : '#EEEDFE',
    green:  isDark ? '#0E2410' : '#EAF3DE',
  };
  const iconColor = {
    gold:   colors.primary,
    blue:   isDark ? '#5EA8E8' : '#185FA5',
    gray:   colors.textSecondary,
    purple: isDark ? '#9B94E8' : '#534AB7',
    green:  isDark ? '#7DC882' : '#3B6D11',
  };

  const s = StyleSheet.create({
    safe:          { flex: 1, backgroundColor: colors.background },
    scrollContent: { paddingBottom: 120 },

    // ── Header ───────────────────────────────────────────────────────────
    header: {
      flexDirection: 'row', alignItems: 'flex-start',
      paddingHorizontal: layout.padding.horizontal,
      paddingTop: 28, paddingBottom: 8, gap: 14,
    },
    avatarRing: {
      width: 68, height: 68, borderRadius: 34,
      alignItems: 'center', justifyContent: 'center',
    },
    avatarInner: {
      width: 63, height: 63, borderRadius: 31.5,
      backgroundColor: colors.backgroundDark,
      alignItems: 'center', justifyContent: 'center',
    },
    avatarText: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: fz(24), color: colors.primary,
    },
    headerInfo:  { flex: 1 },
    userName: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: fz(21), color: colors.text, lineHeight: fz(27),
    },
    userEmail: {
      fontFamily: 'Inter_400Regular',
      fontSize: fz(13), color: colors.textSecondary, marginTop: 2,
    },
    memberBadge: {
      marginTop: 6, alignSelf: 'flex-start',
      flexDirection: 'row', alignItems: 'center', gap: 4,
      paddingHorizontal: 10, paddingVertical: 4,
      borderRadius: 20,
      backgroundColor: `${colors.primary}18`,
      borderWidth: 1, borderColor: `${colors.primary}40`,
    },
    memberBadgeText: {
      fontFamily: 'Inter_500Medium', fontSize: 11, color: colors.primary,
    },
    guestCta: {
      marginTop: 6, alignSelf: 'flex-start',
      paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8,
      backgroundColor: `${colors.primary}18`, borderWidth: 1, borderColor: `${colors.primary}40`,
    },
    guestCtaText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: colors.primary },
    editBtn: {
      width: 36, height: 36, borderRadius: 18,
      backgroundColor: colors.backgroundDark,
      borderWidth: 1, borderColor: colors.border,
      alignItems: 'center', justifyContent: 'center', marginTop: 4,
    },

    // ── Premium upsell ───────────────────────────────────────────────────
    premiumCard: {
      marginHorizontal: layout.padding.horizontal, marginTop: 16,
      borderRadius: layout.radius.card,
      borderWidth: 1, borderColor: `${colors.primary}55`,
      backgroundColor: `${colors.primary}12`, padding: 20,
    },
    premiumCardIntro: {
      fontFamily: 'Inter_600SemiBold', fontSize: 11, color: colors.primary,
      letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6,
    },
    premiumCardTitle: {
      fontFamily: 'PlayfairDisplay_700Bold', fontSize: fz(20), color: colors.text, marginBottom: 6,
    },
    premiumCardSub: {
      fontFamily: 'Inter_400Regular', fontSize: fz(14), color: colors.textSecondary,
      lineHeight: 20, marginBottom: 14,
    },
    premiumCardCta: {
      alignSelf: 'flex-start', paddingHorizontal: 18, paddingVertical: 9,
      borderRadius: 999, backgroundColor: colors.primary,
    },
    premiumCardCtaText: {
      fontFamily: 'Inter_600SemiBold', fontSize: 12, color: colors.onPrimary,
      letterSpacing: 0.5, textTransform: 'uppercase',
    },

    // ── Section ──────────────────────────────────────────────────────────
    section: { marginTop: 24, paddingHorizontal: layout.padding.horizontal },
    sectionHeadingRow: {
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12,
    },
    sectionTitle: {
      fontFamily: 'PlayfairDisplay_700Bold', fontSize: fz(19), color: colors.text,
    },
    sectionLink: { fontFamily: 'Inter_500Medium', fontSize: 13, color: colors.primary },
    pillsRow:    { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },

    // ── Settings card ────────────────────────────────────────────────────
    card: {
      backgroundColor: isDark ? colors.backgroundDark : '#FFFFFF',
      borderRadius: 18,
      borderWidth: 1, borderColor: colors.border,
      overflow: 'hidden',
    },
    row: {
      flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: 14, paddingVertical: 14, gap: 12,
    },
    rowDivider: { borderTopWidth: 1, borderTopColor: isDark ? colors.border : `${colors.border}CC` },
    rowIcon: {
      width: 34, height: 34, borderRadius: 10,
      alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    },
    rowContent: { flex: 1, minWidth: 0 },
    rowTitle: { fontFamily: 'Inter_500Medium', fontSize: fz(14), color: colors.text },
    rowSub:   { fontFamily: 'Inter_400Regular', fontSize: fz(12), color: colors.textSecondary, marginTop: 2 },
    rowRight: { flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 0 },
    rowVal:   { fontFamily: 'Inter_400Regular', fontSize: fz(13), color: colors.textSecondary },

    // ── Preference pills ─────────────────────────────────────────────────
    prefPill: {
      paddingHorizontal: 12, paddingVertical: 6,
      borderRadius: 20, borderWidth: 1, borderColor: colors.border,
      backgroundColor: colors.background,
      flexDirection: 'row', alignItems: 'center', gap: 5,
    },
    prefPillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    prefPillText:   { fontFamily: 'Inter_500Medium', fontSize: fz(13), color: colors.textSecondary },
    prefPillActiveText: { color: colors.onPrimary },

    // ── Expanded rows (pill groups inside row) ───────────────────────────
    expandedRow: {
      paddingHorizontal: 14, paddingBottom: 14, paddingTop: 0, gap: 8,
    },
    pillGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },

    // ── Destructive ──────────────────────────────────────────────────────
    dangerCard: {
      backgroundColor: isDark ? colors.backgroundDark : '#FFFFFF',
      borderRadius: 18, borderWidth: 1, borderColor: colors.border,
      overflow: 'hidden', marginTop: 8,
    },
    dangerRow: {
      flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: 14, paddingVertical: 14, gap: 12,
    },
    dangerTitle:   { fontFamily: 'Inter_500Medium', fontSize: fz(14) },
    dangerSub:     { fontFamily: 'Inter_400Regular', fontSize: fz(12), color: colors.textSecondary, marginTop: 2 },
  });

  const rowIconStyle = (variant) => [s.rowIcon, { backgroundColor: iconBg[variant] }];

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={s.safe}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>

        {/* ── Header ── */}
        <View style={s.header}>
          <LinearGradient
            colors={[colors.primary, '#E0B95B']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={s.avatarRing}
          >
            <View style={s.avatarInner}>
              <Text style={s.avatarText}>{avatarText}</Text>
            </View>
          </LinearGradient>

          <View style={s.headerInfo}>
            <Text style={s.userName} numberOfLines={1}>{profileDisplayName}</Text>
            <Text style={s.userEmail} numberOfLines={1}>{profileEmail}</Text>
            {isPremium ? (
              <View style={s.memberBadge}>
                <Ionicons name="sparkles" size={11} color={colors.primary} />
                <Text style={s.memberBadgeText}>{t('premiumMember', lang)}</Text>
              </View>
            ) : isGuest ? (
              <TouchableOpacity style={s.guestCta} onPress={openEditProfileModal}>
                <Text style={s.guestCtaText}>{t('profileCompletePrompt', lang)}</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          <TouchableOpacity style={s.editBtn} onPress={openEditProfileModal}>
            <Ionicons name="pencil" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* ── Premium upsell ── */}
        {!isPremium && (
          <TouchableOpacity
            style={s.premiumCard}
            onPress={() => navigation.navigate('Paywall', { source: 'profile_upsell', reason: 'profile_upgrade' })}
            activeOpacity={0.88}
          >
            <Text style={s.premiumCardIntro}>✨ PREMIUM</Text>
            <Text style={s.premiumCardTitle}>{t('profilePremiumUpsellTitle', lang)}</Text>
            <Text style={s.premiumCardSub}>{t('profilePremiumUpsellSub', lang)}</Text>
            <View style={s.premiumCardCta}>
              <Text style={s.premiumCardCtaText}>{t('profilePremiumUpsellCta', lang)}</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* ── İlgi Alanları ── */}
        <View style={s.section}>
          <View style={s.sectionHeadingRow}>
            <Text style={s.sectionTitle}>{t('categories', lang)}</Text>
          </View>
          <View style={s.pillsRow}>
            {parentCategories.map(p => {
              const cat = Number(p.id);
              return (
                <CategoryPill
                  key={cat}
                  label={p.name}
                  categoryName={p.raw_name || p.name}
                  active={selectedCategories.includes(cat)}
                  isDark={isDark}
                  compact
                  activeColor={colors.primary}
                  showIcon={false}
                  onPress={() => toggleSelectedCategory(cat)}
                />
              );
            })}
          </View>
        </View>

        {/* ── Ayarlar ── */}
        <View style={s.section}>
          <View style={s.sectionHeadingRow}>
            <Text style={s.sectionTitle}>{t('settings', lang)}</Text>
          </View>

          <View style={s.card}>

            {/* Okuma planı */}
            <View>
              <View style={s.row}>
                <View style={rowIconStyle('gold')}>
                  <Ionicons name="book-outline" size={18} color={iconColor.gold} />
                </View>
                <View style={s.rowContent}>
                  <Text style={s.rowTitle}>{t('readingPlan', lang)}</Text>
                </View>
              </View>
              <View style={[s.expandedRow]}>
                <View style={s.pillGroup}>
                  {timeOptions.map(option => (
                    <TouchableOpacity
                      key={option.value}
                      onPress={() => handleReadingPlanChange(option.value)}
                      style={[s.prefPill, selectedMinutes === option.value && s.prefPillActive]}
                    >
                      <Text style={[s.prefPillText, selectedMinutes === option.value && s.prefPillActiveText]}>
                        {option.icon} {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Hatırlatma */}
            <View style={s.rowDivider}>
              <View style={s.row}>
                <View style={rowIconStyle('gold')}>
                  <Ionicons name="notifications-outline" size={18} color={iconColor.gold} />
                </View>
                <View style={s.rowContent}>
                  <Text style={s.rowTitle}>{t('reminderTime', lang)}</Text>
                </View>
              </View>
              <View style={s.expandedRow}>
                <View style={s.pillGroup}>
                  {reminderOptions.map(option => {
                    const isSelected = selectedReminders.includes(option.value);
                    return (
                      <TouchableOpacity
                        key={option.value}
                        onPress={() => handleReminderToggle(option.value)}
                        style={[s.prefPill, isSelected && s.prefPillActive]}
                      >
                        <Text style={[s.prefPillText, isSelected && s.prefPillActiveText]}>
                          {option.icon} {option.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>

            {/* Bildirim testi */}
            <TouchableOpacity style={[s.row, s.rowDivider]} onPress={scheduleTestNotification}>
              <View style={rowIconStyle('blue')}>
                <Ionicons name="paper-plane-outline" size={18} color={iconColor.blue} />
              </View>
              <View style={s.rowContent}>
                <Text style={s.rowTitle}>{t('notifyTest', lang)}</Text>
              </View>
              <View style={s.rowRight}>
                <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 12, color: colors.primary, letterSpacing: 0.4 }}>
                  {t('test', lang).toUpperCase()}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Koyu mod */}
            <View style={[s.row, s.rowDivider]}>
              <View style={rowIconStyle('gray')}>
                <Ionicons name={isDark ? 'moon' : 'sunny-outline'} size={18} color={iconColor.gray} />
              </View>
              <View style={s.rowContent}>
                <Text style={s.rowTitle}>{t('darkMode', lang)}</Text>
                <Text style={s.rowSub}>{currentThemeLabel}</Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : isDark ? colors.primary : '#f4f3f4'}
              />
            </View>

            {/* Dil */}
            <View style={s.rowDivider}>
              <View style={s.row}>
                <View style={rowIconStyle('blue')}>
                  <Ionicons name="globe-outline" size={18} color={iconColor.blue} />
                </View>
                <View style={s.rowContent}>
                  <Text style={s.rowTitle}>{t('languageLabel', lang)}</Text>
                </View>
              </View>
              <View style={s.expandedRow}>
                <View style={s.pillGroup}>
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
                      <Text style={[s.prefPillText, lang === l.code && s.prefPillActiveText]}>
                        {l.flag} {l.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

          </View>
        </View>

        {/* ── Hesap ── */}
        <View style={s.section}>
          <View style={s.sectionHeadingRow}>
            <Text style={s.sectionTitle}>{t('account', lang)}</Text>
          </View>

          <View style={s.card}>
            <TouchableOpacity style={s.row} onPress={openEditProfileModal}>
              <View style={rowIconStyle('gray')}>
                <Ionicons name="person-outline" size={18} color={iconColor.gray} />
              </View>
              <View style={s.rowContent}>
                <Text style={s.rowTitle}>{t('editInfo', lang)}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity style={[s.row, s.rowDivider]} onPress={openPrivacyPolicy}>
              <View style={rowIconStyle('gray')}>
                <Ionicons name="shield-outline" size={18} color={iconColor.gray} />
              </View>
              <View style={s.rowContent}>
                <Text style={s.rowTitle}>{t('privacy', lang)}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Tehlikeli aksiyonlar */}
          <View style={s.dangerCard}>
            <TouchableOpacity style={s.dangerRow} onPress={handleResetData}>
              <Ionicons name="refresh-outline" size={20} color={colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={[s.dangerTitle, { color: colors.primary }]}>{t('profileResetDataLabel', lang)}</Text>
                <Text style={s.dangerSub}>{t('profileResetDataHint', lang)}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[s.dangerRow, { borderTopWidth: 1, borderTopColor: colors.border }]} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color={colors.danger} />
              <View style={{ flex: 1 }}>
                <Text style={[s.dangerTitle, { color: colors.danger }]}>{t('logout', lang)}</Text>
                <Text style={s.dangerSub}>{t('profileLogoutHint', lang)}</Text>
              </View>
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
            borderRadius: 16, borderWidth: 1, borderColor: colors.border,
            padding: 18, gap: 10,
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

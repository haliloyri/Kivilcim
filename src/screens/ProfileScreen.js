import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  StatusBar, Platform, Switch, Alert, Linking, Modal, TextInput,
  AppState,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import * as StoreReview from 'expo-store-review';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useUserData } from '../context/UserDataContext';
import { useStories } from '../context/StoriesContext';
import { useCareerPath } from '../context/CareerPathContext';
import { FEATURE_FLAGS } from '../config/featureFlags';
import { getLegalUrls, localizedHomeUrl, SUPPORT_EMAIL, SUBSCRIPTION_URLS } from '../constants/externalLinks';
import { t } from '../locales/i18n';
import CategoryPill from '../components/CategoryPill';

// Profil = kimlik + okuma ritmi + tercihler + abonelik/destek.
// İlerleme/rozetler İlerleme sekmesinde; gerçek bir hesap sistemi olmadığı
// için e-posta ve "oturumu kapat" yok. Test araçları yalnızca __DEV__ bölümünde.

const PLAN_OPTIONS = [
  { minutes: 3, target: 1 },
  { minutes: 6, target: 2 },
  { minutes: 9, target: 3 },
];
const REMINDER_OPTIONS = [
  { value: 'morning', labelKey: 'reminder_morning', icon: 'partly-sunny-outline' },
  { value: 'noon', labelKey: 'reminder_noon', icon: 'sunny-outline' },
  { value: 'evening', labelKey: 'reminder_evening', icon: 'moon-outline' },
];
const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'tr', label: 'Türkçe' },
  { code: 'es', label: 'Español' },
  { code: 'de', label: 'Deutsch' },
];
const STORY_COLLECTIONS = ['classic', 'new', 'agent', 'focus', 'conversation', 'originals', 'opus55'];
const STORY_COLLECTION_LABEL = {
  classic: 'storyCollectionClassic', new: 'storyCollectionNew', agent: 'storyCollectionAgent',
  focus: 'storyCollectionFocus', conversation: 'storyCollectionConversation', originals: 'storyCollectionOriginals',
  opus55: 'storyCollectionOpus55',
};

const ProfileScreen = ({ navigation }) => {
  const {
    colors, layout, isDark, lang, setLang,
    themeMode, themePreference, setThemePreference,
    selectedCategories, toggleSelectedCategory, resetAppSettings,
  } = useTheme();
  const { parentCategories } = useStories();
  const { career } = useCareerPath();
  const {
    clearUserData, isPremium, preferences, updatePreferences,
    userProfile, updateUserProfile, devSetPremium, restorePremium,
  } = useUserData();

  const [sheet, setSheet] = useState(null); // 'name' | 'interests' | 'language' | null
  const [editName, setEditName] = useState('');
  // null until the real OS status has been read, so the switch below doesn't
  // flicker off for a reader who has already granted permission.
  const [notifPermission, setNotifPermission] = useState(null);
  const [restoring, setRestoring] = useState(false);
  const testNotifIndex = React.useRef(0);

  // ── Derived state ────────────────────────────────────────────────────────
  const displayName = userProfile?.displayName || null;
  const isGuest = !displayName;
  const initials = (displayName || t('profileGuestAvatar', lang))
    .split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();
  const careerTitle = FEATURE_FLAGS.careerPathV1 && career?.profileTitle
    ? t(career.profileTitle, lang) : null;

  const selectedMinutes = preferences?.time?.minutes || 6;
  const remindersEnabled = preferences?.remindersEnabled !== false;
  const selectedReminders = preferences?.reminderWindows || [preferences?.reminderWindow || 'evening'];
  const selectedStoryCollections = preferences?.storyCollections?.length ? preferences.storyCollections : ['new', 'opus55'];
  const themeValue = themePreference || themeMode || 'system';
  const langLabel = (LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0]).label;
  const interestCount = selectedCategories.length;
  const interestSummary = interestCount === 0 || interestCount === parentCategories.length
    ? t('profileInterestsAll', lang)
    : t('profileInterestsCount', lang).replace('{{count}}', String(interestCount));
  const appVersion = Constants.expoConfig?.version || Constants.manifest?.version || '';

  // ── Notification permission (refresh when returning from system settings) ──
  const refreshPermission = useCallback(async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      setNotifPermission(status);
    } catch { /* noop */ }
  }, []);
  useEffect(() => {
    refreshPermission();
    const sub = AppState.addEventListener('change', (st) => { if (st === 'active') refreshPermission(); });
    return () => sub.remove();
  }, [refreshPermission]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const openUrl = async (url) => {
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert(t('alert_error', lang), t('profileExternalLinkError', lang));
    }
  };

  const handlePlanChange = async (minutes) => {
    const opt = PLAN_OPTIONS.find((o) => o.minutes === minutes);
    if (!opt || minutes === selectedMinutes) return;
    await updatePreferences({
      time: {
        label: t(`time_${minutes}min`, lang),
        minutes,
        dailyStoryTarget: opt.target,
      },
    });
  };

  const handleRemindersEnabled = async (enabled) => {
    if (enabled && notifPermission !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      setNotifPermission(status);
      if (status !== 'granted') return;
    }
    if (!enabled) {
      await Notifications.cancelAllScheduledNotificationsAsync().catch(() => {});
    }
    await updatePreferences({ remindersEnabled: enabled });
  };

  const handleReminderToggle = async (value) => {
    const isOn = selectedReminders.includes(value);
    if (isOn && selectedReminders.length === 1) {
      // Son saati kapatmak = hatırlatmaları kapatmak.
      await handleRemindersEnabled(false);
      return;
    }
    const next = isOn ? selectedReminders.filter((w) => w !== value) : [...selectedReminders, value];
    await updatePreferences({ reminderWindows: next });
  };

  const handleStoryCollectionToggle = async (id) => {
    const next = selectedStoryCollections.includes(id)
      ? selectedStoryCollections.filter((x) => x !== id)
      : [...selectedStoryCollections, id];
    if (next.length === 0) return;
    await updatePreferences({ storyCollections: next });
  };

  const openNameSheet = () => {
    setEditName(displayName || '');
    setSheet('name');
  };
  const saveName = async () => {
    await updateUserProfile({ displayName: editName.trim() || null });
    setSheet(null);
  };

  const handleRestore = async () => {
    if (restoring || !restorePremium) return;
    setRestoring(true);
    try {
      const result = await restorePremium();
      if (result?.live === false) {
        Alert.alert(t('paywallRestoreUnavailableTitle', lang), t('paywallRestoreUnavailableSub', lang));
        return;
      }
      if (!result?.success) throw new Error(result?.error || 'restore_failed');
      const restored = !!result.entitled;
      Alert.alert(
        t(restored ? 'profileRestoreSuccessTitle' : 'profileRestoreNoneTitle', lang),
        t(restored ? 'profileRestoreSuccessSub' : 'profileRestoreNoneSub', lang),
      );
    } catch {
      Alert.alert(t('alert_error', lang), t('profileRestoreError', lang));
    } finally {
      setRestoring(false);
    }
  };

  const manageSubscription = () => openUrl(Platform.OS === 'ios' ? SUBSCRIPTION_URLS.ios : SUBSCRIPTION_URLS.android);
  const rateApp = async () => {
    try {
      if (await StoreReview.hasAction()) { await StoreReview.requestReview(); return; }
      const url = StoreReview.storeUrl();
      if (url) { await openUrl(url); return; }
    } catch { /* fall through */ }
    // No store listing yet (e.g. iOS without appStoreUrl) → the website.
    await openUrl(localizedHomeUrl(lang));
  };
  const sendFeedback = () => {
    const subject = encodeURIComponent(`Albor ${appVersion} — ${t('profileFeedback', lang)}`);
    const body = encodeURIComponent(`\n\n—\n${Platform.OS} ${Platform.Version} · ${appVersion} · ${lang}`);
    openUrl(`mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`);
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
    if (status !== 'granted') finalStatus = (await Notifications.requestPermissionsAsync()).status;
    if (finalStatus !== 'granted') { Alert.alert(t('notif_perm_denied', lang)); return; }
    const keys = ['notif_8', 'notif_13', 'notif_16', 'notif_21'];
    await Notifications.scheduleNotificationAsync({
      content: { title: t('brandText', lang), body: t(keys[testNotifIndex.current], lang), data: {} },
      trigger: null,
    });
    testNotifIndex.current = (testNotifIndex.current + 1) % keys.length;
  };

  // ── Tokens (soft-minimal, B2 neutral) ────────────────────────────────────
  const neutral = isDark
    ? { bg: '#232326', border: '#34343A', text: '#B7B9BE' }
    : { bg: '#F1ECE1', border: '#E4DBCB', text: '#857E6E' };

  const s = StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    scroll: { paddingBottom: 120 },

    // Header
    header: {
      flexDirection: 'row', alignItems: 'center', gap: 14,
      paddingHorizontal: layout.padding.horizontal, paddingTop: 24, paddingBottom: 4,
    },
    avatar: {
      width: 60, height: 60, borderRadius: 30,
      backgroundColor: `${colors.primary}1F`,
      alignItems: 'center', justifyContent: 'center',
    },
    avatarText: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 22, color: colors.primaryText },
    headerInfo: { flex: 1, minWidth: 0 },
    nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    name: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 22, color: colors.text, flexShrink: 1 },
    premiumTag: {
      paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, backgroundColor: colors.primary,
    },
    premiumTagText: { fontFamily: 'Inter_500Medium', fontSize: 11, color: colors.onPrimary },
    subline: { fontFamily: 'Inter_400Regular', fontSize: 13, color: colors.textSecondary, marginTop: 3 },
    sublineAccent: { fontFamily: 'Inter_500Medium', fontSize: 13, color: colors.primaryText, marginTop: 3 },
    guestHint: { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textSecondary, marginTop: 2 },

    // Premium strip
    premiumStrip: {
      marginHorizontal: layout.padding.horizontal, marginTop: 18,
      flexDirection: 'row', alignItems: 'center', gap: 12,
      paddingHorizontal: 16, paddingVertical: 14,
      borderRadius: layout.radius.card, backgroundColor: `${colors.primary}14`,
    },
    premiumStripTitle: { fontFamily: 'Inter_500Medium', fontSize: 14, color: colors.text },
    premiumStripSub: { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textSecondary, marginTop: 2 },

    // Sections
    section: { marginTop: 26, paddingHorizontal: layout.padding.horizontal },
    sectionLabel: {
      fontFamily: 'Inter_500Medium', fontSize: 12, color: colors.textSecondary,
      letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 10, marginLeft: 4,
    },
    card: {
      backgroundColor: colors.surfaceContainerLowest, borderRadius: 18,
      borderWidth: 1, borderColor: colors.border, overflow: 'hidden',
    },
    row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 14, gap: 12 },
    divider: { borderTopWidth: 1, borderTopColor: colors.border },
    rowIcon: {
      width: 32, height: 32, borderRadius: 10, backgroundColor: neutral.bg,
      alignItems: 'center', justifyContent: 'center',
    },
    rowBody: { flex: 1, minWidth: 0 },
    rowTitle: { fontFamily: 'Inter_500Medium', fontSize: 15, color: colors.text },
    rowSub: { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textSecondary, marginTop: 2 },
    rowValue: { fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.textSecondary },
    rowRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    rowExtra: { paddingHorizontal: 14, paddingBottom: 14 },

    // Segmented control (Library pattern)
    segTrack: {
      flexDirection: 'row', backgroundColor: neutral.bg, borderRadius: 12, padding: 3, gap: 3,
    },
    seg: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 8, borderRadius: 9 },
    segActive: { backgroundColor: colors.primary },
    segTitle: { fontFamily: 'Inter_500Medium', fontSize: 13, color: neutral.text },
    segSub: { fontFamily: 'Inter_400Regular', fontSize: 11, color: neutral.text, marginTop: 1 },
    segActiveText: { color: colors.onPrimary },

    // Chips (B2)
    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: {
      flexDirection: 'row', alignItems: 'center', gap: 6,
      paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999,
      backgroundColor: neutral.bg, borderWidth: 1, borderColor: neutral.border,
    },
    chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    chipText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: neutral.text },
    chipActiveText: { color: colors.onPrimary },

    // Footer
    footer: { alignItems: 'center', marginTop: 30, gap: 10 },
    resetText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: colors.danger },
    versionText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textSecondary },

    // Bottom sheet
    overlay: { flex: 1, backgroundColor: colors.modalOverlay, justifyContent: 'flex-end' },
    sheet: {
      backgroundColor: colors.modalSurface,
      borderTopLeftRadius: 24, borderTopRightRadius: 24,
      paddingHorizontal: layout.padding.horizontal, paddingTop: 10, paddingBottom: 34,
    },
    grabber: { alignSelf: 'center', width: 36, height: 4, borderRadius: 2, backgroundColor: colors.border, marginBottom: 14 },
    sheetTitle: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 22, color: colors.text },
    sheetSub: { fontFamily: 'Inter_400Regular', fontSize: 13, color: colors.textSecondary, marginTop: 4, marginBottom: 16 },
    input: {
      borderWidth: 1, borderColor: colors.border, borderRadius: 12,
      paddingHorizontal: 14, paddingVertical: 12, fontSize: 15,
      color: colors.text, fontFamily: 'Inter_400Regular', backgroundColor: colors.backgroundDark,
    },
    sheetActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 16 },
    btnGhost: { paddingHorizontal: 14, paddingVertical: 11 },
    btnGhostText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: colors.textSecondary },
    btnPrimary: { backgroundColor: colors.primary, borderRadius: 999, paddingHorizontal: 20, paddingVertical: 11 },
    btnPrimaryText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: colors.onPrimary },
    langRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
    langText: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 16, color: colors.text },

    // Dev
    devCard: { borderStyle: 'dashed' },
  });

  // ── Small building blocks ────────────────────────────────────────────────
  const Row = ({ icon, title, sub, value, onPress, right, first, danger, chevron = !!onPress }) => {
    const Wrapper = onPress ? TouchableOpacity : View;
    return (
      <Wrapper style={[s.row, !first && s.divider]} onPress={onPress} activeOpacity={0.7}>
        {icon ? (
          <View style={s.rowIcon}>
            <Ionicons name={icon} size={17} color={danger ? colors.danger : neutral.text} />
          </View>
        ) : null}
        <View style={s.rowBody}>
          <Text style={[s.rowTitle, danger && { color: colors.danger }]}>{title}</Text>
          {sub ? <Text style={s.rowSub}>{sub}</Text> : null}
        </View>
        <View style={s.rowRight}>
          {value ? <Text style={s.rowValue} numberOfLines={1}>{value}</Text> : null}
          {right}
          {chevron && !right ? <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} /> : null}
        </View>
      </Wrapper>
    );
  };

  const Section = ({ label, children, style }) => (
    <View style={s.section}>
      {label ? <Text style={s.sectionLabel}>{label}</Text> : null}
      <View style={[s.card, style]}>{children}</View>
    </View>
  );

  const Segmented = ({ options, value, onChange }) => (
    <View style={s.segTrack}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <TouchableOpacity
            key={o.value}
            style={[s.seg, active && s.segActive]}
            onPress={() => onChange(o.value)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
          >
            <Text style={[s.segTitle, active && s.segActiveText]}>{o.title}</Text>
            {o.sub ? <Text style={[s.segSub, active && s.segActiveText]}>{o.sub}</Text> : null}
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const Chip = ({ label, icon, active, onPress }) => (
    <TouchableOpacity style={[s.chip, active && s.chipActive]} onPress={onPress}>
      {icon ? <Ionicons name={icon} size={14} color={active ? colors.onPrimary : neutral.text} /> : null}
      <Text style={[s.chipText, active && s.chipActiveText]}>{label}</Text>
    </TouchableOpacity>
  );

  const permissionDenied = notifPermission === 'denied';
  // Setup no longer asks for permission unless the reader reaches the last step,
  // so someone who skipped it sits at 'undetermined': reminders are enabled in
  // preferences but the OS will never deliver them. Show that honestly — toggling
  // the switch on from here is what asks for permission (handleRemindersEnabled).
  const permissionMissing = notifPermission === 'undetermined';
  const remindersOn = remindersEnabled && !permissionDenied && !permissionMissing;

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={s.safe}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* 1 · Kimlik */}
        <TouchableOpacity style={s.header} onPress={openNameSheet} activeOpacity={0.8}
          accessibilityRole="button" accessibilityLabel={t('profileEditName', lang)}>
          <View style={s.avatar}><Text style={s.avatarText}>{initials}</Text></View>
          <View style={s.headerInfo}>
            <View style={s.nameRow}>
              <Text style={s.name} numberOfLines={1}>{displayName || t('profileGuestName', lang)}</Text>
              {isPremium ? (
                <View style={s.premiumTag}><Text style={s.premiumTagText}>Premium</Text></View>
              ) : null}
            </View>
            {isGuest ? (
              <>
                <Text style={s.sublineAccent}>{t('profileAddName', lang)}</Text>
                <Text style={s.guestHint}>{t('profileAddNameHint', lang)}</Text>
              </>
            ) : careerTitle ? (
              <Text
                style={s.sublineAccent}
                numberOfLines={1}
                onPress={() => navigation.navigate('ProgressTab')}
              >
                {careerTitle} ›
              </Text>
            ) : null}
          </View>
        </TouchableOpacity>

        {/* 2 · Premium şeridi */}
        {!isPremium && (
          <TouchableOpacity
            style={s.premiumStrip}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Paywall', { source: 'profile_upsell', reason: 'profile_upgrade' })}
          >
            <Ionicons name="sparkles-outline" size={20} color={colors.primaryText} />
            <View style={{ flex: 1 }}>
              <Text style={s.premiumStripTitle}>{t('profilePremiumStripTitle', lang)}</Text>
              <Text style={s.premiumStripSub}>{t('profilePremiumStripSub', lang)}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.primaryText} />
          </TouchableOpacity>
        )}

        {/* 3 · Okuma ritmi */}
        <Section label={t('profileSectionRhythm', lang)}>
          <View>
            <Row first icon="flag-outline" title={t('profileDailyGoal', lang)} sub={t('profileDailyGoalSub', lang)} chevron={false} />
            <View style={s.rowExtra}>
              <Segmented
                value={selectedMinutes}
                onChange={handlePlanChange}
                options={PLAN_OPTIONS.map((o) => ({
                  value: o.minutes,
                  title: t(o.target === 1 ? 'profileGoalStoryOne' : 'profileGoalStoryMany', lang).replace('{{count}}', String(o.target)),
                  sub: t('profileGoalMinutes', lang).replace('{{min}}', String(o.minutes)),
                }))}
              />
            </View>
          </View>

          {permissionDenied ? (
            <Row
              icon="notifications-off-outline"
              title={t('profileRemindersOff', lang)}
              sub={t('profileRemindersOffSub', lang)}
              onPress={() => Linking.openSettings()}
            />
          ) : (
            <View style={s.divider}>
              <Row
                first
                icon="notifications-outline"
                title={t('profileReminders', lang)}
                sub={remindersOn ? null : t('profileRemindersDisabledSub', lang)}
                right={(
                  <Switch
                    value={remindersOn}
                    onValueChange={handleRemindersEnabled}
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : remindersOn ? colors.primary : '#f4f3f4'}
                  />
                )}
              />
              {remindersOn ? (
                <View style={[s.rowExtra, s.chipRow]}>
                  {REMINDER_OPTIONS.map((o) => (
                    <Chip
                      key={o.value}
                      icon={o.icon}
                      label={t(o.labelKey, lang)}
                      active={selectedReminders.includes(o.value)}
                      onPress={() => handleReminderToggle(o.value)}
                    />
                  ))}
                </View>
              ) : null}
            </View>
          )}
        </Section>

        {/* 4 · İçerik */}
        <Section label={t('profileSectionContent', lang)}>
          <Row first icon="compass-outline" title={t('profileInterests', lang)} value={interestSummary} onPress={() => setSheet('interests')} />
          <Row icon="globe-outline" title={t('languageLabel', lang)} value={langLabel} onPress={() => setSheet('language')} />
        </Section>

        {/* 5 · Görünüm */}
        <Section label={t('profileSectionAppearance', lang)}>
          <View style={{ padding: 14 }}>
            <Segmented
              value={themeValue}
              onChange={setThemePreference}
              options={[
                { value: 'light', title: t('themeModeLight', lang) },
                { value: 'dark', title: t('themeModeDark', lang) },
                { value: 'system', title: t('themeModeSystem', lang) },
              ]}
            />
          </View>
        </Section>

        {/* 6 · Abonelik & destek */}
        <Section label={t('profileSectionSupport', lang)}>
          {isPremium ? (
            <Row first icon="card-outline" title={t('profileManageSubscription', lang)} onPress={manageSubscription} />
          ) : (
            <Row first icon="sparkles-outline" title={t('profileGoPremium', lang)}
              onPress={() => navigation.navigate('Paywall', { source: 'profile_settings', reason: 'profile_upgrade' })} />
          )}
          <Row icon="refresh-outline" title={t('profileRestorePurchases', lang)}
            value={restoring ? t('profileRestoring', lang) : null} onPress={handleRestore} />
          {SUPPORT_EMAIL ? (
            <Row icon="mail-outline" title={t('profileFeedback', lang)} onPress={sendFeedback} />
          ) : null}
          <Row icon="star-outline" title={t('profileRateApp', lang)} onPress={rateApp} />
          <Row icon="shield-checkmark-outline" title={t('privacy', lang)} onPress={() => openUrl(getLegalUrls(lang).privacy)} />
          <Row icon="document-text-outline" title={t('profileTerms', lang)} onPress={() => openUrl(getLegalUrls(lang).terms)} />
        </Section>

        {/* 7 · Alt kısım */}
        <View style={s.footer}>
          <TouchableOpacity onPress={handleResetData} hitSlop={10}>
            <Text style={s.resetText}>{t('profileResetDataLabel', lang)}</Text>
          </TouchableOpacity>
          <Text style={s.versionText}>{`Albor ${appVersion}`}</Text>
        </View>

        {/* 8 · Geliştirici (yalnızca __DEV__) */}
        {__DEV__ && (
          <Section label="Developer" style={s.devCard}>
            <Row
              first icon="construct-outline" title="Premium"
              sub={isPremium ? 'Premium (reklam yok)' : 'Free (reklam açık)'}
              right={(
                <Switch value={isPremium} onValueChange={(v) => devSetPremium(v)}
                  trackColor={{ false: colors.border, true: colors.primary }} thumbColor="#FFFFFF" />
              )}
            />
            <View style={s.divider}>
              <Row first icon="albums-outline" title={t('storyVersionSetting', lang)} sub={t('storyVersionSettingSub', lang)} chevron={false} />
              <View style={[s.rowExtra, s.chipRow]}>
                {STORY_COLLECTIONS.map((id) => (
                  <Chip key={id} label={t(STORY_COLLECTION_LABEL[id], lang)}
                    active={selectedStoryCollections.includes(id)}
                    onPress={() => handleStoryCollectionToggle(id)} />
                ))}
              </View>
            </View>
            <Row icon="paper-plane-outline" title={t('notifyTest', lang)} onPress={scheduleTestNotification} />
          </Section>
        )}
      </ScrollView>

      {/* ── Alt paneller (tek Modal; iOS'ta iç içe Modal açma) ── */}
      <Modal
        visible={sheet !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSheet(null)}
      >
        <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={() => setSheet(null)}>
          <TouchableOpacity activeOpacity={1} style={s.sheet} onPress={() => {}}>
            <View style={s.grabber} />

            {sheet === 'name' && (
              <>
                <Text style={s.sheetTitle}>{t('profileEditName', lang)}</Text>
                <Text style={s.sheetSub}>{t('profileAddNameHint', lang)}</Text>
                <TextInput
                  value={editName}
                  onChangeText={setEditName}
                  placeholder={t('profileNamePlaceholder', lang)}
                  placeholderTextColor={colors.textSecondary}
                  autoFocus
                  maxLength={40}
                  returnKeyType="done"
                  onSubmitEditing={saveName}
                  style={s.input}
                />
                <View style={s.sheetActions}>
                  <TouchableOpacity style={s.btnGhost} onPress={() => setSheet(null)}>
                    <Text style={s.btnGhostText}>{t('profileCancel', lang)}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={s.btnPrimary} onPress={saveName}>
                    <Text style={s.btnPrimaryText}>{t('profileSave', lang)}</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {sheet === 'interests' && (
              <>
                <Text style={s.sheetTitle}>{t('profileInterests', lang)}</Text>
                <Text style={s.sheetSub}>{t('profileInterestsSub', lang)}</Text>
                <View style={s.chipRow}>
                  {parentCategories.map((p) => {
                    const id = Number(p.id);
                    return (
                      <CategoryPill
                        key={id}
                        label={p.name}
                        categoryName={p.raw_name || p.name}
                        active={selectedCategories.includes(id)}
                        isDark={isDark}
                        compact
                        showImage={false}
                        useCategoryTextColor
                        onPress={() => toggleSelectedCategory(id)}
                      />
                    );
                  })}
                </View>
                <View style={s.sheetActions}>
                  <TouchableOpacity style={s.btnPrimary} onPress={() => setSheet(null)}>
                    <Text style={s.btnPrimaryText}>{t('profileDone', lang)}</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {sheet === 'language' && (
              <>
                <Text style={[s.sheetTitle, { marginBottom: 8 }]}>{t('languageLabel', lang)}</Text>
                {LANGUAGES.map((l, i) => (
                  <TouchableOpacity
                    key={l.code}
                    style={[s.langRow, i > 0 && s.divider]}
                    onPress={() => { setLang(l.code); setSheet(null); }}
                  >
                    <Text style={s.langText}>{l.label}</Text>
                    {lang === l.code ? <Ionicons name="checkmark" size={20} color={colors.primaryText} /> : null}
                  </TouchableOpacity>
                ))}
              </>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default ProfileScreen;

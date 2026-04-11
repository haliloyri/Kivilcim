import React from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, StyleSheet, 
  StatusBar, Platform, Switch 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import { useTheme } from '../context/ThemeContext';
import { useUserData } from '../context/UserDataContext';
import { useStories } from '../context/StoriesContext';
import { Ionicons } from '@expo/vector-icons';
import { getCatIcon } from '../components/StoryCard';
import { t } from '../locales/i18n';



const ProfileScreen = ({ navigation }) => {
  const { colors, typography, layout, isDark, toggleTheme, lang, setLang, selectedCategories, toggleSelectedCategory } = useTheme();
  // Global t() function is now used directly from i18n.js
  const { categories, parentCategories } = useStories();
  const { clearUserData, isPremium, preferences, updatePreferences } = useUserData();
  const testNotifIndex = React.useRef(0);

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
  const selectedReminder = preferences?.reminderWindow || 'evening';
  const selectedTarget = preferences?.time?.dailyStoryTarget || 2;
  const selectedReminderLabel = reminderOptions.find((o) => o.value === selectedReminder)?.label || t('reminder_evening', lang);

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

  const handleReminderChange = async (windowValue, reminderHour) => {
    await updatePreferences({
      reminderWindow: windowValue,
      reminderHour,
    });
  };

  const handleLogout = async () => {
    await clearUserData();
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

  const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    header: { paddingHorizontal: layout.padding.horizontal, paddingTop: 32, paddingBottom: 24, alignItems: 'center' },
    avatar: { 
      width: 88, height: 88, borderRadius: 44, 
      backgroundColor: isDark ? '#2A2520' : '#F9F6F1', borderWidth: 2, borderColor: '#D4AF37', 
      alignItems: 'center', justifyContent: 'center', marginBottom: 16,
      shadowColor: '#C5A059', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 
    },
    avatarText: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 32, color: isDark ? colors.text : '#594238' },
    userName: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 32, color: colors.text },
    userEmail: { fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.textSecondary, marginTop: 4 },
    premiumBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#5A9CA0', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginTop: 16 },
    premiumText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: '#FFFFFF', marginLeft: 6 },
    section: { marginTop: 32, paddingHorizontal: layout.padding.horizontal },
    sectionTitle: { 
      fontFamily: 'Inter_500Medium', 
      fontSize: 11, 
      color: colors.textSecondary, 
      letterSpacing: 1, 
      textTransform: 'uppercase', 
      marginBottom: 16 
    },
    menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: colors.border },
    menuItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    menuItemText: { fontFamily: 'Inter_400Regular', fontSize: 16, color: colors.text },
    profileCategoriesSection: { marginTop: 16, paddingHorizontal: layout.padding.horizontal },
    profileCategoriesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    categoryPill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: colors.border, backgroundColor: 'transparent' },
    categoryPillText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: colors.textSecondary },
    categoryPillActive: { backgroundColor: isDark ? '#3A3020' : '#E6DEC8', borderColor: isDark ? '#6A5540' : '#E6DEC8' },
    categoryPillActiveText: { color: colors.text, fontFamily: 'Inter_500Medium' },
    prefSummaryBox: {
      marginTop: 16,
      backgroundColor: colors.backgroundDark,
      borderRadius: layout.radius.card,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 6,
    },
    prefSummaryText: {
      fontFamily: 'Inter_400Regular',
      fontSize: 13,
      color: colors.textSecondary,
    },
  });

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safe}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AY</Text>
          </View>
          <Text style={styles.userName}>Asaf Oyri</Text>
          <Text style={styles.userEmail}>asaf@example.com</Text>
          
          <TouchableOpacity 
            style={styles.premiumBadge} 
            onPress={() => !isPremium && navigation.navigate('Paywall')}
            disabled={isPremium}
          >
            <Ionicons name="sparkles" size={14} color="#FFFFFF" />
            <Text style={styles.premiumText}>
              {isPremium ? t('premiumMember', lang) : t('upgradePremium', lang)}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.profileCategoriesSection}>
          <Text style={styles.sectionTitle}>{t('categories', lang)}</Text>
          <View style={styles.profileCategoriesRow}>
            {parentCategories.map((p) => {
              const cat = p.name;
              const isSelected = selectedCategories.includes(cat);
              const onPressCat = () => toggleSelectedCategory(cat);
              return (
                <TouchableOpacity key={cat} onPress={onPressCat} style={[styles.categoryPill, isSelected && styles.categoryPillActive, { flexDirection: 'row', alignItems: 'center', gap: 6 }]}>
                  <Ionicons name={getCatIcon(cat)} size={14} color={isSelected ? colors.text : colors.textSecondary} />
                  <Text style={[styles.categoryPillText, isSelected && styles.categoryPillActiveText]}>
                    {t(cat, lang)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings', lang)}</Text>

          <View style={[styles.menuItem, { flexDirection: 'column', alignItems: 'flex-start' }] }>
            <View style={styles.menuItemLeft}>
              <Ionicons name="book-outline" size={24} color={colors.textSecondary} />
              <Text style={styles.menuItemText}>{t('readingPlan', lang)}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
              {timeOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => handleReadingPlanChange(option.value)}
                  style={[
                    styles.categoryPill,
                    selectedMinutes === option.value && styles.categoryPillActive,
                    { paddingVertical: 8, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 6 },
                  ]}
                >
                  <Text style={[styles.categoryPillText, selectedMinutes === option.value && styles.categoryPillActiveText]}>{option.icon}</Text>
                  <Text style={[styles.categoryPillText, selectedMinutes === option.value && styles.categoryPillActiveText]}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={[styles.menuItem, { flexDirection: 'column', alignItems: 'flex-start' }] }>
            <View style={styles.menuItemLeft}>
              <Ionicons name="time-outline" size={24} color={colors.textSecondary} />
              <Text style={styles.menuItemText}>{t('reminderTime', lang)}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
              {reminderOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => handleReminderChange(option.value, option.reminderHour)}
                  style={[
                    styles.categoryPill,
                    selectedReminder === option.value && styles.categoryPillActive,
                    { paddingVertical: 8, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 6 },
                  ]}
                >
                  <Text style={[styles.categoryPillText, selectedReminder === option.value && styles.categoryPillActiveText]}>{option.icon}</Text>
                  <Text style={[styles.categoryPillText, selectedReminder === option.value && styles.categoryPillActiveText]}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.prefSummaryBox}>
            <Text style={styles.prefSummaryText}>{t('dailyTargetSummary', lang).replace('{{target}}', String(selectedTarget))}</Text>
            <Text style={styles.prefSummaryText}>{t('reminderSummary', lang).replace('{{time}}', selectedReminderLabel)}</Text>
          </View>
          
          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="sunny-outline" size={24} color={colors.textSecondary} />
              <Text style={styles.menuItemText}>{t('darkMode', lang)}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textSecondary }}>iOS</Text>
              <Switch 
                value={isDark} 
                onValueChange={toggleTheme}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : isDark ? colors.primary : '#f4f3f4'}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.menuItem} onPress={scheduleTestNotification}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="notifications-outline" size={24} color={colors.textSecondary} />
              <Text style={styles.menuItemText}>{t('notifyTest', lang)}</Text>
            </View>
            <Text style={{ color: '#B55310', fontFamily: 'Inter_500Medium', letterSpacing: 0.5, fontSize: 13 }}>{t('test', lang).toUpperCase()}</Text>
          </TouchableOpacity>

          <View style={[styles.menuItem, { flexDirection: 'column', alignItems: 'flex-start', borderBottomWidth: 0 }]}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="globe-outline" size={24} color={colors.textSecondary} />
              <Text style={styles.menuItemText}>{t('languageLabel', lang)}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
              {[
                { code: 'tr', label: t('languageTurkish', lang), flag: '🇹🇷' },
                { code: 'en', label: t('languageEnglish', lang), flag: '🇺🇸' },
                { code: 'es', label: t('languageSpanish', lang), flag: '🇪🇸' },
                { code: 'de', label: t('languageGerman', lang), flag: '🇩🇪' },
              ].map((l) => (
                <TouchableOpacity 
                  key={l.code}
                  onPress={() => setLang(l.code)}
                  style={[
                    styles.categoryPill, 
                    lang === l.code && styles.categoryPillActive,
                    { paddingVertical: 8, paddingHorizontal: 12 }
                  ]}
                >
                  <Text style={[
                    styles.categoryPillText, 
                    lang === l.code && styles.categoryPillActiveText
                  ]}>
                    {l.flag} {l.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('account', lang)}</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="person-outline" size={24} color={colors.textSecondary} />
              <Text style={styles.menuItemText}>{t('editInfo', lang)}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="shield-outline" size={24} color={colors.textSecondary} />
              <Text style={styles.menuItemText}>{t('privacy', lang)}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={handleLogout}>
            <View style={styles.menuItemLeft}>
              <Text style={[styles.menuItemText, { color: '#BA1A1A' }]}>{t('logout', lang)}</Text>
            </View>

          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

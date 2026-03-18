import React from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, StyleSheet, 
  StatusBar, Platform, Switch 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import { useTheme } from '../context/ThemeContext';
import { getSelectedCategories, setSelectedCategories, toggleSelectedCategory } from '../db/db';
import { useUserData } from '../context/UserDataContext';
import { categories } from '../../data/stories';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const ProfileScreen = ({ navigation }) => {
  const { colors, typography, layout, isDark, toggleTheme, lang, setLang, selectedCategories, toggleSelectedCategory } = useTheme();
  // Simple in-file i18n for Profile screen
  const translations = {
    en: {
      settings: 'App Settings',
      darkMode: 'Dark (Ink) Mode',
      notifyTest: 'Test Notifications',
      test: 'TEST',
      languageLabel: 'Language',
      categories: 'Categories',
      languageEnglish: 'English',
      languageTurkish: 'Turkish',
      editInfo: 'Edit My Information',
      privacy: 'Privacy Policy',
      logout: 'Logout',
      account: 'Account'
    },
    tr: {
      settings: 'Uygulama Ayarları',
      darkMode: 'Mürekkep (Koyu) Mod',
      notifyTest: 'Bildirim Testi Yap',
      test: 'TEST ET',
      languageLabel: 'Dil Seçimi',
      categories: 'Kategoriler',
      languageEnglish: 'English',
      languageTurkish: 'Türkçe',
      editInfo: 'Bilgilerimi Düzenle',
      privacy: 'Gizlilik Politikası',
      logout: 'Oturumu Kapat',
      account: 'Hesap'
    }
  };
  const t = (k) => translations[lang]?.[k] ?? k;
  // Profil: takip edilen kategorileri gösterecek alan eklendi
  const PROFILE_CATEGORIES = categories;
  const { clearUserData, isPremium } = useUserData();

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
      alert('Bildirim izni verilmedi!');
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Kıvılcım ✦",
        body: 'Günün kıvılcımı hazır! Bugünün dersini keşfetmek için dokun.',
        data: { data: 'test data' },
      },
      trigger: null, // immediate
    });
  };

  const styles = StyleSheet.create({
    safe: { 
      flex: 1, 
      backgroundColor: colors.background, 
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 
    },
    header: { 
      paddingHorizontal: layout.padding.horizontal, 
      paddingVertical: 24,
      alignItems: 'center',
    },
    avatar: { 
      width: 80, 
      height: 80, 
      borderRadius: 40, 
      backgroundColor: colors.backgroundDark, 
      borderWidth: 2, 
      borderColor: colors.primary, 
      alignItems: 'center', 
      justifyContent: 'center',
      marginBottom: 16,
    },
    avatarText: { 
      fontFamily: 'PlayfairDisplay_700Bold', 
      fontSize: 32, 
      color: colors.textSecondary 
    },
    userName: { 
      fontFamily: 'PlayfairDisplay_700Bold', 
      fontSize: 24, 
      color: colors.text 
    },
    userEmail: { 
      fontFamily: 'DMSans_400Regular', 
      fontSize: 14, 
      color: colors.textSecondary,
      marginTop: 4,
    },
    premiumBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      marginTop: 16,
    },
    premiumText: {
      fontFamily: 'DMSans_500Medium',
      fontSize: 12,
      color: colors.background,
    },
    section: {
      marginTop: 32,
      paddingHorizontal: layout.padding.horizontal,
    },
    sectionTitle: {
      fontFamily: 'DMSans_500Medium',
      fontSize: typography.sizes.badge,
      color: colors.textSecondary,
      letterSpacing: 1,
      textTransform: 'uppercase',
      marginBottom: 16,
    },
    menuItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 16,
      borderBottomWidth: layout.borderWidth,
      borderBottomColor: colors.border,
    },
    menuItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    menuItemIcon: {
      fontSize: 18,
    },
    menuItemText: {
      fontFamily: 'DMSans_400Regular', 
      fontSize: 16,
      color: colors.text,
    },
    // Categories UI styles
    categoriesSection: {
      marginTop: 16,
    },
    categoriesRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    categoryPill: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.background,
    },
    categoryPillText: {
      fontFamily: 'DMSans_400Regular',
      fontSize: 12,
      color: colors.text,
    },
    categoryPillActive: {
      backgroundColor: colors.text,
    },
    categoryPillActiveText: {
      color: colors.background,
    },
    // profile category section styles (reintroduced)
    profileCategoriesSection: { marginTop: 12, paddingHorizontal: 0 },
    profileCategoriesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 16 },
  });

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AY</Text>
          </View>
          <Text style={styles.userName}>Asaf Oyri</Text>
          <Text style={styles.userEmail}>asaf@example.com</Text>
          
          <TouchableOpacity 
            style={[styles.premiumBadge, isPremium && { backgroundColor: '#10B981' }]} 
            onPress={() => !isPremium && navigation.navigate('Paywall')}
            disabled={isPremium}
          >
            <Text style={styles.premiumText}>
              {isPremium ? '✦ Sınırsız Üye' : '✦ Sınırsız\'a Geç'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.profileCategoriesSection}>
          <Text style={styles.sectionTitle}>Takip Edilen Kategoriler</Text>
          <View style={styles.profileCategoriesRow}>
            {PROFILE_CATEGORIES.map((cat) => {
              const isSelected = selectedCategories.includes(cat);
              const onPressCat = () => toggleSelectedCategory(cat);
              return (
                <TouchableOpacity key={cat} onPress={onPressCat} style={[styles.categoryPill, isSelected && styles.categoryPillActive]}>
                  <Text style={[styles.categoryPillText, isSelected && styles.categoryPillActiveText]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings')}</Text>
          
          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuItemIcon}>{isDark ? '🌙' : '☀️'}</Text>
              <Text style={styles.menuItemText}>{t('darkMode')}</Text>
            </View>
            <Switch 
              value={isDark} 
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : isDark ? colors.primary : '#f4f3f4'}
            />
          </View>

          {/* Kategoriler kaldırıldı. Profil sayfasında kategori seçim UI kaldırıldı. */}

          <TouchableOpacity style={styles.menuItem} onPress={scheduleTestNotification}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuItemIcon}>🔔</Text>
              <Text style={styles.menuItemText}>{t('notifyTest')}</Text>
            </View>
            <Text style={{ color: colors.primary, fontFamily: 'DMSans_500Medium' }}>{t('test')}</Text>
          </TouchableOpacity>

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuItemIcon}>🌐</Text>
              <Text style={styles.menuItemText}>{t('languageLabel')}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ color: colors.text }}>{lang === 'en' ? t('languageEnglish') : t('languageTurkish')}</Text>
              <Switch value={lang === 'en'} onValueChange={(v) => setLang(v ? 'en' : 'tr')} />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('account')}</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuItemIcon}>👤</Text>
              <Text style={styles.menuItemText}>Bilgilerimi Düzenle</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuItemIcon}>🛡️</Text>
              <Text style={styles.menuItemText}>Gizlilik Politikası</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={handleLogout}>
            <View style={styles.menuItemLeft}>
              <Text style={[styles.menuItemText, { color: colors.danger }]}>{t('logout')}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

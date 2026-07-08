import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, ActivityIndicator, Alert, Clipboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { t } from '../locales/i18n';
import { getCurrentUser } from '../services/supabase';

const InviteFriendsScreen = ({ navigation }) => {
  const { colors, typography, isDark, lang } = useTheme();
  const [inviteLink, setInviteLink] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLink = async () => {
      try {
        const user = await getCurrentUser();
        // If there's no user session, fallback to a generic link or "guest"
        const userId = user?.id || 'guest';
        setInviteLink(`https://kivilcim.app/invite/${userId}`);
      } catch (error) {
        setInviteLink('https://kivilcim.app/invite');
      } finally {
        setLoading(false);
      }
    };
    fetchLink();
  }, []);

  const handleCopy = () => {
    if (inviteLink) {
      // In newer RN versions, use Clipboard from @react-native-clipboard/clipboard
      // But standard 'react-native' Clipboard is deprecated but often still works,
      // or we can just rely on Share
      try {
        require('react-native').Clipboard.setString(inviteLink);
        Alert.alert(t('alert_success', lang, { defaultValue: 'Başarılı' }), 'Bağlantı kopyalandı!');
      } catch (e) {
        // Fallback
      }
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Bana katıl ve Spark'ta her gün yeni bilgiler öğren! Bu linkle üye olursan ikimiz de 1 hafta Premium kazanırız: ${inviteLink}`,
        url: inviteLink, // iOS fallback
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: 'PlayfairDisplay_700Bold' }]}>
          Arkadaşını Davet Et
        </Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="gift-outline" size={80} color={colors.primary} />
        </View>
        <Text style={[styles.title, { color: colors.text, fontFamily: 'PlayfairDisplay_700Bold' }]}>
          1 Hafta Premium Kazan
        </Text>
        <Text style={[styles.description, { color: colors.textSecondary, fontFamily: 'Inter_400Regular' }]}>
          Arkadaşlarını Spark'a davet et, bağlantınla kayıt olan her arkadaşın için ikiniz de 1 haftalık Premium kazanıp sınırları kaldırın!
        </Text>

        <View style={[styles.linkBox, { backgroundColor: isDark ? '#2A2520' : '#F5F5F5' }]}>
          {loading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Text style={[styles.linkText, { color: colors.text }]} numberOfLines={1}>
              {inviteLink}
            </Text>
          )}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={[styles.btn, { backgroundColor: isDark ? '#3D2E0D' : '#FFF8E6' }]} onPress={handleCopy}>
            <Ionicons name="copy-outline" size={20} color={colors.primary} />
            <Text style={[styles.btnText, { color: colors.primary }]}>Kopyala</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.btn, styles.shareBtn, { backgroundColor: colors.primary }]} onPress={handleShare}>
            <Ionicons name="share-social-outline" size={20} color="#000" />
            <Text style={[styles.btnText, { color: '#000' }]}>Paylaş</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  linkBox: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
  },
  linkText: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  shareBtn: {
    flex: 2,
  },
  btnText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
});

export default InviteFriendsScreen;

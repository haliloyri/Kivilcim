import React, { useState } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, StyleSheet, 
  StatusBar, Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useUserData } from '../context/UserDataContext';
import { t } from '../locales/i18n';

const PaywallScreen = ({ navigation }) => {
  const { colors, typography, layout, isDark, lang } = useTheme();
  const [plan, setPlan] = useState(1);
  const plans = [
    { name: t('planMonthly', lang), price: '49₺', per: t('perMo', lang), save: null },
    { name: t('planAnnual', lang), price: '349₺', per: t('perYr', lang), save: t('save40', lang), popular: true },
  ];
  const features = [
    t('feat1', lang),
    t('feat2', lang),
    t('feat3', lang),
    t('feat4', lang),
    t('feat5', lang),
  ];

  const { buyPremium } = useUserData();

  const handlePurchase = async () => {
    // Simulated purchase flow
    await buyPremium();
    navigation.goBack();
  };

  const styles = StyleSheet.create({
    safe: { 
      flex: 1, 
      backgroundColor: colors.background, 
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 
    },
    paywallTitle: { 
      fontFamily: 'PlayfairDisplay_700Bold', 
      fontSize: typography.sizes.headingLarge - 2, 
      color: colors.text, 
      textAlign: 'center', 
      marginBottom: 10, 
      lineHeight: 34 
    },
    paywallSub: { 
      fontFamily: 'Inter_400Regular', 
      fontSize: typography.sizes.body - 1, 
      color: colors.textSecondary, 
      textAlign: 'center', 
      lineHeight: typography.spacing.bodyLineHeight, 
      marginBottom: 30 
    },
    planCard: { 
      flex: 1, 
      borderWidth: layout.borderWidth, 
      borderColor: colors.border, 
      borderRadius: layout.radius.card, 
      padding: 16, 
      alignItems: 'center', 
      backgroundColor: colors.backgroundDark 
    },
    planCardSelected: { 
      borderWidth: 1.5, 
      borderColor: colors.primary 
    },
    popularBadge: { 
      backgroundColor: colors.danger, 
      borderRadius: 10, 
      paddingHorizontal: 8, 
      paddingVertical: 3, 
      marginBottom: 8 
    },
    popularText: { 
      fontFamily: 'Inter_500Medium', 
      fontSize: typography.sizes.badge, 
      color: '#FFFFFF' 
    },
    planName: { 
      fontFamily: 'Inter_400Regular', 
      fontSize: typography.sizes.ui, 
      color: colors.text, 
      marginBottom: 4 
    },
    planPrice: { 
      fontFamily: 'PlayfairDisplay_600SemiBold', 
      fontSize: 24, 
      color: colors.text 
    },
    planPer: { 
      fontFamily: 'Inter_400Regular', 
      fontSize: typography.sizes.badge, 
      color: colors.textSecondary 
    },
    planSave: { 
      fontFamily: 'Inter_500Medium', 
      fontSize: typography.sizes.badge, 
      color: colors.success, 
      marginTop: 4 
    },
    featureRow: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      gap: 12, 
      paddingVertical: 10, 
      borderBottomWidth: layout.borderWidth, 
      borderBottomColor: colors.border 
    },
    featCheck: { 
      width: 20, 
      height: 20, 
      borderRadius: 10, 
      backgroundColor: colors.backgroundDark, 
      borderWidth: layout.borderWidth, 
      borderColor: colors.border, 
      alignItems: 'center', 
      justifyContent: 'center' 
    },
    featText: { 
      fontFamily: 'Inter_400Regular', 
      fontSize: typography.sizes.body - 1, 
      color: colors.text, 
      flex: 1 
    },
    btnPrimary: { 
      backgroundColor: colors.primary, 
      borderRadius: layout.radius.button, 
      height: layout.heights.buttonPrimary, 
      justifyContent: 'center', 
      alignItems: 'center' 
    },
    btnPrimaryText: { 
      fontFamily: 'Inter_500Medium', 
      color: colors.text, 
      fontSize: typography.sizes.ui + 1 
    },
  });

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: Platform.OS === 'android' ? 48 : 24 }} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ alignSelf: 'flex-end', marginBottom: 8 }}>
          <Text style={{ fontSize: 22, color: colors.textSecondary }}>✕</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 44, textAlign: 'center', marginBottom: 12, color: colors.primary }}>✦</Text>
        <Text style={styles.paywallTitle}>{t('paywallTitle', lang)}</Text>
        <Text style={styles.paywallSub}>{t('paywallSub', lang)}</Text>

        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
          {plans.map((p, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.planCard, plan === i && styles.planCardSelected]}
              onPress={() => setPlan(i)}
            >
              {p.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>{t('popular', lang)}</Text>
                </View>
              )}
              {!p.popular && <View style={{ height: 22 }} />}
              <Text style={[styles.planName, plan === i && { fontFamily: 'Inter_500Medium' }]}>{p.name}</Text>
              <Text style={styles.planPrice}>{p.price}</Text>
              <Text style={styles.planPer}>{p.per}</Text>
              {p.save && <Text style={styles.planSave}>{p.save}</Text>}
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ marginBottom: 20 }}>
          {features.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={styles.featCheck}>
                <Text style={{ fontSize: 10, color: colors.success }}>✓</Text>
              </View>
              <Text style={styles.featText}>{f}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.btnPrimary} onPress={handlePurchase}>
          <Text style={styles.btnPrimaryText}>{t('subscribe', lang)}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginTop: 12, alignItems: 'center' }}>
          <Text style={{ fontSize: 12, color: colors.textSecondary, fontFamily: 'Inter_400Regular' }}>{t('restore', lang)}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PaywallScreen;

import React, { useState, useRef } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, StyleSheet, 
  StatusBar, Animated, Platform, Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useUserData } from '../context/UserDataContext';
import { categories } from '../../data/stories';

const OnboardingScreen = ({ navigation }) => {
  const { colors, typography, layout, isDark } = useTheme();
  const { saveOnboarding } = useUserData();
  const [step, setStep] = useState(0);
  const [selectedCats, setSelectedCats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(1);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const allCats = categories;
  const timeOptions = [
    { label: '3 dakika', sub: 'Günde 1 hikaye', icon: '☕' },
    { label: '5 dakika', sub: 'Günde 2 hikaye', icon: '📖' },
    { label: '10 dakika', sub: 'Günde 3+ hikaye', icon: '🚀' },
  ];

  const next = async () => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
    if (step < 3) {
      setStep(step + 1);
    } else {
      await saveOnboarding(selectedCats, timeOptions[selectedTime]);
      // State change (`isOnboarded` to true) will dynamically switch AppNavigator stacks.
    }
  };

  const toggleCat = (cat) => {
    setSelectedCats(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const styles = StyleSheet.create({
    safe: { 
      flex: 1, 
      backgroundColor: colors.background, 
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 
    },
    progressBar: { 
      height: 3, 
      backgroundColor: colors.border, 
      marginHorizontal: layout.padding.horizontal, 
      borderRadius: 1.5, 
      overflow: 'hidden', 
      marginTop: 8 
    },
    progressFill: { 
      height: '100%', 
      backgroundColor: colors.primary, 
      borderRadius: 1.5 
    },
    stepDots: { 
      flexDirection: 'row', 
      justifyContent: 'center', 
      gap: 6, 
      paddingVertical: 10 
    },
    stepDot: { 
      width: 6, 
      height: 6, 
      borderRadius: 3, 
      backgroundColor: colors.border 
    },
    stepDotActive: { 
      width: 18, 
      backgroundColor: colors.primary 
    },
    obContent: { 
      paddingHorizontal: layout.padding.horizontal, 
      paddingTop: 8, 
      flex: 1 
    },
    obArt: { 
      backgroundColor: colors.backgroundDark, 
      borderRadius: layout.radius.card, 
      padding: 20, 
      marginBottom: 24, 
      borderWidth: layout.borderWidth, 
      borderColor: colors.border 
    },
    miniCard: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      backgroundColor: colors.background, 
      borderRadius: 10, 
      padding: 10, 
      borderWidth: layout.borderWidth, 
      borderColor: colors.border 
    },
    miniDot: { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
    miniLines: { flex: 1, gap: 5 },
    miniLine: { height: 6, borderRadius: 3, backgroundColor: colors.border, opacity: 0.3 },
    obTitle: { 
      fontFamily: 'PlayfairDisplay_700Bold', 
      fontSize: typography.sizes.headingLarge, 
      color: colors.text, 
      marginBottom: 10, 
      lineHeight: 36 
    },
    obSub: { 
      fontFamily: 'DMSans_400Regular', 
      fontSize: typography.sizes.body, 
      color: colors.textSecondary, 
      lineHeight: typography.spacing.bodyLineHeight, 
      marginBottom: 20 
    },
    catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
    catTile: { 
      width: (Dimensions.get('window').width - 48) / 2 - 4, 
      borderWidth: layout.borderWidth, 
      borderColor: colors.border, 
      borderRadius: layout.radius.button, 
      padding: 14, 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      backgroundColor: colors.background 
    },
    catTileSelected: { 
      borderWidth: 1.5, 
      borderColor: colors.primary, 
      backgroundColor: colors.backgroundDark 
    },
    catTileText: { 
      fontFamily: 'DMSans_400Regular', 
      fontSize: typography.sizes.ui, 
      color: colors.text 
    },
    obHint: { 
      fontFamily: 'DMSans_400Regular', 
      fontSize: typography.sizes.ui - 1, 
      color: colors.textSecondary, 
      textAlign: 'center', 
      marginTop: 8 
    },
    timeTile: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      borderWidth: layout.borderWidth, 
      borderColor: colors.border, 
      borderRadius: layout.radius.button, 
      padding: 14, 
      marginBottom: 8, 
      backgroundColor: colors.background 
    },
    timeTileSelected: { 
      borderWidth: 1.5, 
      borderColor: colors.primary, 
      backgroundColor: colors.backgroundDark 
    },
    timeTileIcon: { fontSize: 20, marginRight: 12 },
    timeTileName: { 
      fontFamily: 'DMSans_500Medium', 
      fontSize: typography.sizes.ui + 1, 
      color: colors.text 
    },
    timeTileSub: { 
      fontFamily: 'DMSans_400Regular', 
      fontSize: typography.sizes.ui - 2, 
      color: colors.textSecondary, 
      marginTop: 2 
    },
    timeCheck: { 
      width: 20, 
      height: 20, 
      borderRadius: 10, 
      borderWidth: 1, 
      borderColor: colors.border, 
      alignItems: 'center', 
      justifyContent: 'center' 
    },
    timeCheckSelected: { 
      backgroundColor: colors.primary, 
      borderColor: colors.primary 
    },
    readyArt: { 
      backgroundColor: colors.backgroundDark, 
      borderRadius: layout.radius.card, 
      padding: 24, 
      alignItems: 'center', 
      marginBottom: 20, 
      borderWidth: layout.borderWidth, 
      borderColor: colors.border 
    },
    readyIcon: { fontSize: 44, color: colors.primary, marginBottom: 12 },
    readyStats: { flexDirection: 'row', gap: 32 },
    readyStat: { alignItems: 'center' },
    readyNum: { 
      fontFamily: 'PlayfairDisplay_600SemiBold', 
      fontSize: 28, 
      color: colors.text 
    },
    readyLabel: { 
      fontFamily: 'DMSans_400Regular', 
      fontSize: typography.sizes.ui - 2, 
      color: colors.textSecondary, 
      marginTop: 4 
    },
    selCats: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    selCatPill: { 
      backgroundColor: colors.backgroundDark, 
      borderRadius: 16, 
      paddingHorizontal: 12, 
      paddingVertical: 5, 
      borderWidth: layout.borderWidth, 
      borderColor: colors.border 
    },
    selCatText: { 
      fontFamily: 'DMSans_400Regular', 
      fontSize: typography.sizes.ui - 1, 
      color: colors.text 
    },
    obFooter: { 
      paddingHorizontal: layout.padding.horizontal, 
      paddingBottom: Platform.OS === 'android' ? 56 : 24, 
      gap: 8 
    },
    btnPrimary: { 
      backgroundColor: colors.primary, 
      borderRadius: layout.radius.button, 
      height: layout.heights.buttonPrimary, 
      justifyContent: 'center', 
      alignItems: 'center' 
    },
    btnPrimaryText: { 
      fontFamily: 'DMSans_500Medium', 
      color: colors.text, 
      fontSize: typography.sizes.ui + 1 
    },
    btnDisabled: { opacity: 0.5 },
    btnSkip: { 
      textAlign: 'center', 
      fontFamily: 'DMSans_400Regular', 
      fontSize: typography.sizes.ui - 1, 
      color: colors.textSecondary, 
      paddingVertical: 8 
    },
  });

  const steps = [
    <View style={styles.obContent} key="s0">
      <View style={styles.obArt}>
        {['#C8A96A', '#8B2E1A', '#2C4A2E'].map((c, i) => (
          <View key={i} style={[styles.miniCard, { marginBottom: i < 2 ? 10 : 0 }]}>
            <View style={[styles.miniDot, { backgroundColor: c }]} />
            <View style={styles.miniLines}>
              <View style={[styles.miniLine, { width: '70%' }]} />
              <View style={[styles.miniLine, { width: '45%' }]} />
            </View>
          </View>
        ))}
      </View>
      <Text style={styles.obTitle}>Her gün bir kıvılcım.</Text>
      <Text style={styles.obSub}>Dünyanın en etkileyici kitaplarından seçilmiş hikayeler — 3 dakikada bir fikir, bir ders, bir bakış açısı.</Text>
    </View>,

    <View style={styles.obContent} key="s1">
      <Text style={styles.obTitle}>Neleri merak ediyorsun?</Text>
      <Text style={styles.obSub}>En az 2 kategori seç.</Text>
      <View style={styles.catGrid}>
        {allCats.map(cat => {
          const sel = selectedCats.includes(cat);
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.catTile, sel && styles.catTileSelected]}
              onPress={() => toggleCat(cat)}
            >
              <Text style={[styles.catTileText, sel && { fontFamily: 'DMSans_500Medium' }]}>{cat}</Text>
              {sel && <Text style={{ fontSize: 12, color: colors.text }}>✓</Text>}
            </TouchableOpacity>
          );
        })}
      </View>
      <Text style={styles.obHint}>
        {selectedCats.length >= 2 ? `${selectedCats.length} kategori seçildi` : `En az ${2 - selectedCats.length} tane daha seç`}
      </Text>
    </View>,

    <View style={styles.obContent} key="s2">
      <Text style={styles.obTitle}>Günde kaç dakika?</Text>
      <Text style={styles.obSub}>Gerçekçi bir hedef seç.</Text>
      {timeOptions.map((t, i) => (
        <TouchableOpacity
          key={i}
          style={[styles.timeTile, selectedTime === i && styles.timeTileSelected]}
          onPress={() => setSelectedTime(i)}
        >
          <Text style={styles.timeTileIcon}>{t.icon}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.timeTileName}>{t.label}</Text>
            <Text style={styles.timeTileSub}>{t.sub}</Text>
          </View>
          <View style={[styles.timeCheck, selectedTime === i && styles.timeCheckSelected]}>
            {selectedTime === i && <Text style={{ fontSize: 10, color: colors.background }}>✓</Text>}
          </View>
        </TouchableOpacity>
      ))}
    </View>,

    <View style={styles.obContent} key="s3">
      <View style={styles.readyArt}>
        <Text style={styles.readyIcon}>✦</Text>
        <View style={styles.readyStats}>
          <View style={styles.readyStat}>
            <Text style={styles.readyNum}>{selectedCats.length || 2}</Text>
            <Text style={styles.readyLabel}>kategori</Text>
          </View>
          <View style={styles.readyStat}>
            <Text style={styles.readyNum}>20</Text>
            <Text style={styles.readyLabel}>hikaye</Text>
          </View>
          <View style={styles.readyStat}>
            <Text style={styles.readyNum}>∞</Text>
            <Text style={styles.readyLabel}>merak</Text>
          </View>
        </View>
      </View>
      <Text style={styles.obTitle}>Her şey hazır.</Text>
      <Text style={styles.obSub}>Bugün seni bekleyen hikayeler hazır. Okumaya başlayalım.</Text>
      <View style={styles.selCats}>
        {(selectedCats.length ? selectedCats : ['Finans', 'Psikoloji']).map(c => (
          <View key={c} style={styles.selCatPill}>
            <Text style={styles.selCatText}>{c}</Text>
          </View>
        ))}
      </View>
    </View>,
  ];

  const canNext = step === 1 ? selectedCats.length >= 2 : true;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(step + 1) * 25}%` }]} />
      </View>
      <View style={styles.stepDots}>
        {[0, 1, 2, 3].map(i => (
          <View key={i} style={[styles.stepDot, step === i && styles.stepDotActive]} />
        ))}
      </View>

      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          {steps[step]}
        </ScrollView>
      </Animated.View>

      <View style={styles.obFooter}>
        <TouchableOpacity
          style={[styles.btnPrimary, !canNext && styles.btnDisabled]}
          onPress={canNext ? next : null}
        >
          <Text style={styles.btnPrimaryText}>
            {step < 3 ? 'Devam et →' : 'Okumaya başla →'}
          </Text>
        </TouchableOpacity>
        {step === 0 && (
          <TouchableOpacity onPress={next}>
            <Text style={styles.btnSkip}>Hesabım var, giriş yap</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;

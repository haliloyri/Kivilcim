import React, { useState, useRef } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, 
  StatusBar, Animated, Dimensions, Platform, Modal, Share 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import { useTheme } from '../context/ThemeContext';
import { useUserData } from '../context/UserDataContext';
import { stories } from '../../data/stories';

const { width } = Dimensions.get('window');

const StoryDetailScreen = ({ route, navigation }) => {
  const { story } = route.params;
  const { colors, typography, layout, isDark } = useTheme();
  const { isFavorite, toggleFavorite, addToHistory } = useUserData();
  const [fontSize, setFontSize] = useState(typography.sizes.body);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [shareTheme, setShareTheme] = useState('light'); // light, dark, sunset, ocean, emerald
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const viewShotRef = useRef();
  const [isSpeaking, setIsSpeaking] = useState(false);

  const liked = isFavorite(story.id);

  React.useEffect(() => {
    if (story) {
      addToHistory(story.id);
      Speech.stop();
      setIsSpeaking(false);
    }
    return () => {
      Speech.stop();
    };
  }, [story]);

  const toggleSpeech = async () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      const textToRead = `${story.title}. \n\n ${story.body} \n\n ${story.quote ? story.quote : ''} \n\n Günün Dersi: ${story.lesson}`;
      setIsSpeaking(true);
      Speech.speak(textToRead, {
        language: 'tr-TR',
        rate: 0.95,
        pitch: 1.0,
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    }
  };

  const handleLike = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.3, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    toggleFavorite(story.id);
  };

  const handleNext = () => {
    const currentIndex = stories.findIndex(s => s.id === story.id);
    const nextIndex = (currentIndex + 1) % stories.length;
    // .replace prevents the stack from going infinitely deep when clicking "next" repeatedly
    navigation.replace('StoryDetail', { story: stories[nextIndex] });
  };

  const onShare = async () => {
    try {
      const uri = await captureRef(viewShotRef, {
        format: 'png',
        quality: 1,
      });
      await Share.share({
        url: Platform.OS === 'ios' ? `file://${uri}` : uri,
        message: `${story.title} - Kıvılcım Uygulamasından bir hikaye`,
      });
      setShareModalVisible(false);
    } catch (error) {
      console.error('Paylaşım hatası:', error);
    }
  };

  const progressBarWidth = scrollY.interpolate({
    inputRange: [0, 500],
    outputRange: [0, width],
    extrapolate: 'clamp',
  });

  const styles = StyleSheet.create({
    safe: { 
      flex: 1, 
      backgroundColor: colors.background, 
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 24,
      paddingBottom: Platform.OS === 'android' ? 48 : 32,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    modalTitle: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: 20,
      color: colors.text,
    },
    modalSub: {
      fontFamily: 'DMSans_400Regular',
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 24,
    },
    themeToggle: {
      flexDirection: 'row',
      gap: 16,
      marginBottom: 24,
    },
    themeOption: {
      flex: 1,
      alignItems: 'center',
      padding: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    themeOptionActive: {
      borderColor: colors.primary,
      backgroundColor: colors.backgroundDark,
    },
    themePreview: {
      width: '100%',
      height: 60,
      borderRadius: 8,
      marginBottom: 8,
      borderWidth: 0.5,
      borderColor: colors.border,
    },
    themeLabel: {
      fontFamily: 'DMSans_500Medium',
      fontSize: 13,
      color: colors.text,
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
    shareCardContainer: {
      width: 1080,
      height: 1080,
      padding: 80,
      justifyContent: 'center',
      alignItems: 'center',
    },
    shareCardLogo: {
      position: 'absolute',
      top: 60,
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: 40,
    },
    shareCardContent: {
      alignItems: 'center',
    },
    shareCardTitle: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: 72,
      textAlign: 'center',
      lineHeight: 84,
      marginBottom: 60,
    },
    shareCardQuoteBox: {
      borderLeftWidth: 8,
      paddingLeft: 40,
      marginVertical: 40,
      width: 800,
    },
    shareCardQuote: {
      fontFamily: 'PlayfairDisplay_400Regular_Italic',
      fontSize: 48,
      lineHeight: 64,
    },
    shareCardSrc: {
      fontFamily: 'DMSans_500Medium',
      fontSize: 32,
      marginTop: 40,
      textTransform: 'uppercase',
      letterSpacing: 4,
    },
    shareCardFooter: {
      position: 'absolute',
      bottom: 60,
      fontFamily: 'DMSans_400Regular',
      fontSize: 28,
      opacity: 0.8,
    },
    readingProgressBarContainer: {
      height: 3,
      backgroundColor: colors.border,
      width: '100%',
    },
    readingProgressBar: {
      height: 3,
      backgroundColor: colors.primary,
    },
    detailHeader: { 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      paddingHorizontal: layout.padding.horizontal, 
      paddingVertical: 12 
    },
    backBtn: { 
      fontFamily: 'DMSans_400Regular', 
      fontSize: typography.sizes.ui + 1, 
      color: colors.textSecondary 
    },
    storyHero: { 
      margin: layout.padding.horizontal, 
      borderRadius: layout.radius.card, 
      padding: 20, 
      marginBottom: 16, 
      borderWidth: layout.borderWidth, 
      borderColor: colors.border 
    },
    badge: { 
      paddingHorizontal: 10, 
      paddingVertical: 4, 
      borderRadius: 12, 
      backgroundColor: colors.backgroundDark, 
      borderWidth: layout.borderWidth, 
      borderColor: colors.border 
    },
    badgeText: { 
      fontFamily: 'DMSans_500Medium', 
      fontSize: typography.sizes.badge, 
      color: colors.text, 
      letterSpacing: typography.spacing.badgeLetterSpacing, 
      textTransform: 'uppercase' 
    },
    detailTitle: { 
      fontFamily: 'PlayfairDisplay_700Bold', 
      fontSize: typography.sizes.headingLarge - 4, 
      color: colors.text, 
      lineHeight: 32 
    },
    metaItem: { 
      fontFamily: 'DMSans_400Regular', 
      fontSize: typography.sizes.ui - 2, 
      color: colors.textSecondary 
    },
    detailBody: { 
      fontFamily: 'DMSans_400Regular', 
      color: colors.text 
    },
    quoteBox: { 
      borderLeftWidth: 2, 
      borderLeftColor: colors.primary, 
      paddingLeft: 16, 
      marginVertical: 24 
    },
    quoteText: { 
      fontFamily: 'PlayfairDisplay_400Regular_Italic', 
      fontSize: typography.sizes.quote, 
      color: colors.textSecondary, 
      lineHeight: 28 
    },
    premiumSeparator: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 40,
    },
    separatorLine: {
      height: 0.5,
      backgroundColor: colors.border,
      flex: 1,
    },
    separatorIcon: {
      marginHorizontal: 16,
      color: colors.primary,
      fontSize: 14,
    },
    lessonBox: { 
      backgroundColor: colors.backgroundDark, 
      borderRadius: layout.radius.card, 
      padding: 16, 
      marginTop: 24, 
      paddingLeft: 16, 
      borderLeftWidth: 3, 
      borderLeftColor: colors.primary 
    },
    lessonLabel: { 
      fontFamily: 'DMSans_500Medium', 
      fontSize: typography.sizes.badge, 
      color: colors.textSecondary, 
      letterSpacing: typography.spacing.badgeLetterSpacing, 
      marginBottom: 8 
    },
    lessonText: { 
      fontFamily: 'DMSans_400Regular', 
      fontSize: typography.sizes.ui, 
      color: colors.text, 
      lineHeight: 22 
    },
    detailFooter: { 
      flexDirection: 'row', 
      gap: 12, 
      paddingHorizontal: layout.padding.horizontal, 
      paddingTop: 12, 
      paddingBottom: Platform.OS === 'android' ? 48 : 24, 
      borderTopWidth: layout.borderWidth, 
      borderTopColor: colors.border, 
      backgroundColor: colors.background 
    },
    btnSecondaryShare: { 
      flex: 1, 
      borderWidth: layout.borderWidth, 
      borderColor: colors.primary, 
      borderRadius: layout.radius.button, 
      height: layout.heights.buttonPrimary, 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: 'transparent' 
    },
    btnSecondaryShareText: { 
      fontFamily: 'DMSans_500Medium', 
      fontSize: typography.sizes.ui, 
      color: colors.text 
    },
    fontSizeControls: {
      flexDirection: 'row',
      backgroundColor: colors.backgroundDark,
      borderRadius: 8,
      padding: 2,
    },
    fontSizeBtn: {
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    fontSizeBtnText: {
      fontFamily: 'DMSans_500Medium',
      fontSize: 12,
      color: colors.text,
    },
  });

  return (
    <SafeAreaView style={styles.safe}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={shareModalVisible}
        onRequestClose={() => setShareModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Kart Oluştur</Text>
              <TouchableOpacity onPress={() => setShareModalVisible(false)}>
                <Text style={{ fontSize: 20, color: colors.text }}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSub}>Bir tema seç ve Instagram'da paylaş.</Text>
            
            <View style={styles.themeToggle}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
                {[
                  { id: 'light', label: 'Kâğıt', color: '#F7F3EB' },
                  { id: 'dark', label: 'Mürekkep', color: '#1A1208' },
                  { id: 'sunset', label: 'Güneş', gradient: ['#FF512F', '#F09819'] },
                  { id: 'ocean', label: 'Gece', gradient: ['#1A2980', '#26D0CE'] },
                  { id: 'emerald', label: 'Zümrüt', gradient: ['#11998e', '#38ef7d'] },
                ].map((th) => (
                  <TouchableOpacity 
                    key={th.id}
                    style={[styles.themeOption, shareTheme === th.id && styles.themeOptionActive, { width: 80 }]} 
                    onPress={() => setShareTheme(th.id)}
                  >
                    {th.gradient ? (
                      <LinearGradient colors={th.gradient} style={styles.themePreview} />
                    ) : (
                      <View style={[styles.themePreview, { backgroundColor: th.color }]} />
                    )}
                    <Text style={styles.themeLabel}>{th.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <TouchableOpacity style={styles.btnPrimary} onPress={onShare}>
              <Text style={styles.btnPrimaryText}>Görüntüyü Kaydet ve Paylaş</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={{ position: 'absolute', left: -2000 }}>
        <View ref={viewShotRef} style={styles.shareCardContainer}>
          {shareTheme === 'sunset' && <LinearGradient colors={['#FF512F', '#F09819']} style={[StyleSheet.absoluteFill]} />}
          {shareTheme === 'ocean' && <LinearGradient colors={['#1A2980', '#26D0CE']} style={[StyleSheet.absoluteFill]} />}
          {shareTheme === 'emerald' && <LinearGradient colors={['#11998e', '#38ef7d']} style={[StyleSheet.absoluteFill]} />}
          {shareTheme === 'light' && <View style={[StyleSheet.absoluteFill, { backgroundColor: '#F7F3EB' }]} />}
          {shareTheme === 'dark' && <View style={[StyleSheet.absoluteFill, { backgroundColor: '#1A1208' }]} />}
          
          <Text style={[styles.shareCardLogo, { color: shareTheme === 'light' ? colors.primary : '#FFF' }]}>✦ Kıvılcım</Text>
          
          <View style={styles.shareCardContent}>
            <Text style={[
              styles.shareCardTitle, 
              { color: shareTheme === 'light' ? '#1A1208' : '#FFF' }
            ]}>
              {story.title}
            </Text>
            
            <View style={[
              styles.shareCardQuoteBox, 
              { borderLeftColor: shareTheme === 'light' ? colors.primary : '#FFF' }
            ]}>
              <Text style={[
                styles.shareCardQuote, 
                { color: shareTheme === 'light' ? '#6B6255' : 'rgba(255,255,255,0.9)' }
              ]}>
                "{story.quote || story.body.substring(0, 100) + '...'}"
              </Text>
            </View>
            
            <Text style={[
              styles.shareCardSrc, 
              { color: shareTheme === 'light' ? '#6B6255' : '#FFF' }
            ]}>
              {story.src}
            </Text>
          </View>
          
          <Text style={[
            styles.shareCardFooter, 
            { color: shareTheme === 'light' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.7)' }
          ]}>
            Daha fazlası için Kıvılcım uygulamasını indir.
          </Text>
        </View>
      </View>

      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      
      <View style={styles.readingProgressBarContainer}>
        <Animated.View style={[styles.readingProgressBar, { width: progressBarWidth }]} />
      </View>

      <View style={styles.detailHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Geri</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
          <TouchableOpacity onPress={toggleSpeech}>
            <Text style={{ fontSize: 22, color: isSpeaking ? colors.primary : colors.text }}>
              {isSpeaking ? '⏸' : '▶'}
            </Text>
          </TouchableOpacity>
          <View style={styles.fontSizeControls}>
            <TouchableOpacity onPress={() => setFontSize(Math.max(12, fontSize - 1))} style={styles.fontSizeBtn}>
              <Text style={styles.fontSizeBtnText}>A-</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setFontSize(Math.min(24, fontSize + 1))} style={styles.fontSizeBtn}>
              <Text style={styles.fontSizeBtnText}>A+</Text>
            </TouchableOpacity>
          </View>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity onPress={handleLike}>
              <Text style={{ fontSize: 22, color: colors.text }}>{liked ? '♥' : '♡'}</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>

      <Animated.ScrollView 
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <View style={[styles.storyHero, { backgroundColor: colors.backgroundDark }]}>
          <View style={[styles.badge, { alignSelf: 'flex-start', marginBottom: 12 }]}>
            <Text style={styles.badgeText}>{story.cat}</Text>
          </View>
          <Text style={styles.detailTitle}>{story.title}</Text>
          <View style={{ flexDirection: 'row', gap: 16, marginTop: 10 }}>
            <Text style={styles.metaItem}>{story.min} dk okuma</Text>
            <Text style={styles.metaItem}>{story.src}</Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: layout.padding.horizontal }}>
          <Text style={[styles.detailBody, { fontSize: fontSize, lineHeight: fontSize * 1.7 }]}>{story.body}</Text>

          {story.quote ? (
            <View style={styles.quoteBox}>
              <Text style={styles.quoteText}>"{story.quote}"</Text>
            </View>
          ) : null}

          {story.detail ? (
            <Text style={[styles.detailBody, { marginTop: 12, fontSize: fontSize, lineHeight: fontSize * 1.7 }]}>{story.detail}</Text>
          ) : null}

          <View style={styles.premiumSeparator}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorIcon}>✦</Text>
            <View style={styles.separatorLine} />
          </View>

          <View style={styles.lessonBox}>
            <Text style={styles.lessonLabel}>GÜNÜN DERSİ</Text>
            <Text style={styles.lessonText}>{story.lesson}</Text>
          </View>
        </View>
        <View style={{ height: 100 }} />
      </Animated.ScrollView>

      <View style={styles.detailFooter}>
        <TouchableOpacity style={styles.btnSecondaryShare} onPress={() => setShareModalVisible(true)}>
          <Text style={styles.btnSecondaryShareText}>Paylaş</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btnPrimary, { flex: 2 }]} onPress={handleNext}>
          <Text style={styles.btnPrimaryText}>Sonraki hikaye →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default StoryDetailScreen;

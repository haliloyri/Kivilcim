import React, { useState, useRef } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, 
  StatusBar, Animated, Dimensions, Platform, Modal, Alert, Linking, ScrollView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import * as Sharing from 'expo-sharing';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useUserData } from '../context/UserDataContext';
import { useStories } from '../context/StoriesContext';
import { getCatIcon } from '../components/StoryCard';
import { t } from '../locales/i18n';

const { width, height } = Dimensions.get('window');

const StoryDetailScreen = ({ route, navigation }) => {
  const { story } = route.params;
  const { colors, typography, layout, isDark, lang } = useTheme();
  const { isFavorite, toggleFavorite, addToHistory, isPremium } = useUserData();
  const { stories } = useStories();
  const [fontSize, setFontSize] = useState(typography.sizes.body);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [shareTheme, setShareTheme] = useState('dark');
  const [shareContent, setShareContent] = useState(['quote']);
  const [shareFormat, setShareFormat] = useState('post');
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const viewShotRef = useRef();
  const [isSpeaking, setIsSpeaking] = useState(false);

  const liked = isFavorite(story.story_id);
  // DB already returns translated content for the active language
  const displayTitle = story.title || '';
  const displayBody = story.body || '';
  const displayQuote = story.quote || '';
  const displayLesson = story.lesson || '';
  const displaySrc = story.source_book || '';
  const displaySourceBook = story.source_book || '';
  const displayCat = t(story.cat_display || story.cat, lang);

  React.useEffect(() => {
    if (story) {
      addToHistory(story.story_id);
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
      const cleanBody = (displayBody || '').replace(/##|\$\$|&&/g, '');
      const textToRead = `${displayTitle}. \n\n ${cleanBody}`;
      setIsSpeaking(true);
      Speech.speak(textToRead, {
        language: lang === 'en' ? 'en-US' : lang === 'es' ? 'es-ES' : lang === 'de' ? 'de-DE' : 'tr-TR',
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
    toggleFavorite(story.story_id);
  };

  const handleNext = () => {
    if (!isPremium) {
      navigation.navigate('Paywall');
      return;
    }
    const currentIndex = stories.findIndex(s => s.story_id === story.story_id);
    const nextIndex = (currentIndex + 1) % stories.length;
    navigation.replace('StoryDetail', { story: stories[nextIndex] });
  };

  // --- Share card theme configs ---
  const SHARE_THEMES = [
    { id: 'dark', label: t('themeInk', lang), bg: ['#131311', '#1E1C18'], text: '#E8E0D0', accent: '#FFB783', sub: '#A89A84' },
    { id: 'light', label: t('themePaper', lang), bg: ['#F7F3EB', '#EDE8DD'], text: '#1A1208', accent: '#B55310', sub: '#6B6255' },
    { id: 'sunset', label: t('themeSun', lang), bg: ['#FF512F', '#F09819'], text: '#FFF', accent: '#FFE0C2', sub: 'rgba(255,255,255,0.8)' },
    { id: 'ocean', label: t('themeNight', lang), bg: ['#1A2980', '#26D0CE'], text: '#FFF', accent: '#B8E6FF', sub: 'rgba(255,255,255,0.8)' },
    { id: 'emerald', label: t('themeEmerald', lang), bg: ['#11998e', '#38ef7d'], text: '#FFF', accent: '#D4FFED', sub: 'rgba(255,255,255,0.8)' },
    { id: 'rose', label: t('rose_theme', lang), bg: ['#E96443', '#904E95'], text: '#FFF', accent: '#FFD6E0', sub: 'rgba(255,255,255,0.8)' },
  ];

  const currentTheme = SHARE_THEMES.find(th => th.id === shareTheme) || SHARE_THEMES[0];

  const extractContent = (markerStr) => {
    if (!displayBody) return '';
    const startIdx = displayBody.indexOf(markerStr);
    if (startIdx === -1) return '';
    const bodySegment = displayBody.substring(startIdx + markerStr.length);
    let nextMarkerIdx = bodySegment.length;
    ['##', '$$', '&&'].forEach(m => {
      const id = bodySegment.indexOf(m);
      if (id !== -1 && id < nextMarkerIdx) {
        nextMarkerIdx = id;
      }
    });
    return bodySegment.substring(0, nextMarkerIdx).trim();
  };

  const getShareText = (type) => {
    if (type === 'quote') {
      const ext = extractContent('##');
      return ext || displayQuote || displayBody.substring(0, 150) + '...';
    }
    if (type === 'lesson') {
      const ext = extractContent('$$');
      return ext || displayLesson || t('keyTakeaway', lang);
    }
    if (type === 'reflection') {
      const ext = extractContent('&&');
      return ext || t('share_realize', lang);
    }
    return '';
  };

  const onShare = async () => {
    try {
      // 1. Capture the off-screen card as PNG
      const uri = await captureRef(viewShotRef, {
        format: 'png',
        quality: 1,
      });

      // 2. Construct the text to be included as caption
      const allTexts = shareContent.map(type => {
        const text = getShareText(type);
        let label = '';
        if (type === 'lesson') label = t('share_key_takeaway', lang);
        else if (type === 'reflection') label = t('share_reflect', lang);
        else label = t('quote_label', lang);
        
        return `${label}\n"${text}"`;
      }).join('\n\n');
      
      const catHashtag = displayCat.replace(/(\s+|&)/g, '');
      const generalHashtags = lang === 'en' ? '#Spark #DailyInspiration #BookRecommendation #Awareness' : 
                              lang === 'es' ? '#Spark #InspiraciónDiaria #RecomendaciónDeLibro #Conciencia' : 
                              lang === 'de' ? '#Spark #TäglicheInspiration #Buchempfehlung #Achtsamkeit' : 
                              '#Spark #gününilhamı #kitapönerisi #farkindalik';
                              
      const caption = `${displayTitle}\n\n${allTexts}\n\n#${catHashtag} ${generalHashtags}`;

      // 3. Copy caption to clipboard so user can paste it on Instagram
      try {
        await Clipboard.setStringAsync(caption);
        Alert.alert(
          lang === 'tr' ? "Metin Kopyalandı" : "Text Copied",
          lang === 'tr' 
            ? "Görseldeki metin ve etiketler panoya kopyalandı. Instagram'da paylaşırken açıklama kısmına yapıştırabilirsiniz."
            : "The text and hashtags have been copied to your clipboard. You can paste them in the caption section when sharing.",
          [{ text: "Tamam", style: "default" }]
        );
      } catch (err) {
        console.warn("Clipboard copy failed", err);
      }

      // 4. Open native share sheet with the image
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: `${displayTitle} — ${t('brandText', lang)}`,
        });
      } else {
        Alert.alert(
          t('alert_error', lang),
          t('alert_share_unavailable', lang),
        );
      }
    } catch (error) {
      console.error('Paylaşım hatası:', error);
      Alert.alert(
        t('alert_error', lang),
        t('alert_share_error', lang),
      );
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
      backgroundColor: 'rgba(0,0,0,0.7)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 20,
      paddingBottom: Platform.OS === 'android' ? 48 : 32,
      maxHeight: '92%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    modalTitle: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: 20,
      color: colors.text,
    },
    modalSub: {
      fontFamily: 'DMSans_400Regular',
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 16,
    },
    // --- Content type pills ---
    contentPillsRow: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 14,
    },
    contentPill: {
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: 20,
      backgroundColor: colors.backgroundDark,
      borderWidth: 1,
      borderColor: colors.border,
    },
    contentPillActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    contentPillText: {
      fontFamily: 'DMSans_500Medium',
      fontSize: 12,
      color: colors.textSecondary,
    },
    contentPillTextActive: {
      color: '#FFF',
    },
    // --- Theme swatches ---
    themeToggle: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: 14,
    },
    themeSwatch: {
      width: 36,
      height: 36,
      borderRadius: 18,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    themeSwatchActive: {
      borderColor: colors.primary,
    },
    // --- Format toggle ---
    formatRow: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 16,
    },
    formatBtn: {
      flex: 1,
      paddingVertical: 8,
      borderRadius: 10,
      alignItems: 'center',
      backgroundColor: colors.backgroundDark,
      borderWidth: 1,
      borderColor: colors.border,
    },
    formatBtnActive: {
      borderColor: colors.primary,
      backgroundColor: isDark ? 'rgba(181,83,16,0.15)' : 'rgba(181,83,16,0.08)',
    },
    formatBtnText: {
      fontFamily: 'DMSans_500Medium',
      fontSize: 12,
      color: colors.textSecondary,
    },
    formatBtnTextActive: {
      color: colors.primary,
    },
    // --- Buttons ---
    btnPrimary: { 
      backgroundColor: colors.primary, 
      borderRadius: layout.radius.button, 
      height: layout.heights.buttonPrimary, 
      justifyContent: 'center', 
      alignItems: 'center' 
    },
    btnPrimaryText: { 
      fontFamily: 'DMSans_500Medium', 
      color: '#F7F3EB', 
      fontSize: typography.sizes.ui + 1 
    },
    // --- Share card (capture target) ---
    shareCardWrapper: {
      alignSelf: 'center',
      marginBottom: 14,
      borderRadius: 12,
      overflow: 'hidden',
      // shadow
      shadowColor: '#000',
      shadowOpacity: 0.3,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 10,
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
      marginVertical: 12,
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
      marginTop: 0, 
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
    sourceSection: {
      marginTop: 32,
      padding: 16,
      borderRadius: 12,
      backgroundColor: colors.backgroundDark,
      borderWidth: 1,
      borderColor: colors.border,
    },
    sourceLabel: {
      fontFamily: 'DMSans_500Medium',
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 8,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    bookTitle: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: 18,
      color: colors.text,
      marginBottom: 16,
    },
    linksRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    linkBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
    },
    linkBtnText: {
      fontFamily: 'DMSans_500Medium',
      fontSize: 12,
      color: colors.text,
      marginLeft: 6,
    },
  });

  // --- Helper: Render the share card (identical in both preview & capture) ---
  const renderShareCard = () => {
    const th = currentTheme;
    const isPost = shareFormat === 'post';
    
    // Always use exact capture sizes
    const cardW = 1080;
    const cardH = isPost ? 1080 : 1920; 
    
    const fTitle = 68;
    const fQuote = 50;
    const fSrc = 32;
    const fLogo = 42;
    const fFooter = 28;
    
    const padHorizontal = 80;
    const paddingTop = isPost ? 80 : 250;
    const paddingBottom = isPost ? 80 : 300;
    const borderW = 10;

    return (
      <View style={{ width: cardW, height: cardH, overflow: 'hidden', backgroundColor: th.bg[0], flexDirection: 'column' }}>
        <LinearGradient
          colors={th.bg}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFill]}
        />
        
        {/* All Content Filtered Through a Single Centered Container */}
        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: padHorizontal, paddingTop, paddingBottom }}>
          
          {/* Header (Logo) */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 80, borderBottomWidth: 4, borderBottomColor: th.accent, paddingBottom: 16, alignSelf: 'flex-start' }}>
            <Text style={{
              fontFamily: 'PlayfairDisplay_700Bold',
              fontSize: 64, color: th.text,
              letterSpacing: 2
            }}>✦ {t('brandText', lang).replace(' ✦', '')}</Text>
          </View>

          {shareContent.map((type, index) => {
            const label = type === 'lesson' ? t('share_key_takeaway', lang) : 
                          type === 'reflection' ? t('share_reflect', lang) : 
                          displayTitle;
            const textContent = getShareText(type);
            
            // dynamically scale text if multiple are selected
            const dynTitle = shareContent.length > 1 ? fTitle * 0.8 : fTitle;
            const dynQuote = shareContent.length > 1 ? fQuote * 0.8 : fQuote;
            
            return (
              <View key={type} style={{ marginBottom: index === shareContent.length - 1 ? 0 : 80 }}>
                <Text style={{
                  fontFamily: 'PlayfairDisplay_700Bold',
                  fontSize: dynTitle,
                  color: th.text,
                  lineHeight: dynTitle * 1.4,
                  marginBottom: 32,
                }}>
                  {label}
                </Text>
                
                <View style={{
                  borderLeftWidth: borderW,
                  borderLeftColor: th.accent,
                  paddingLeft: 30,
                  marginBottom: 20,
                }}>
                  <Text style={{
                    fontFamily: 'PlayfairDisplay_600SemiBold',
                    fontSize: dynQuote,
                    color: th.sub,
                    lineHeight: dynQuote * 1.6,
                  }}>
                    "{textContent}"
                  </Text>
                </View>
              </View>
            );
          })}
          
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 60 }}>
            <Ionicons name="book-outline" size={fSrc + 4} color={th.sub} />
            <Text style={{
              fontFamily: 'DMSans_500Medium',
              fontSize: fSrc,
              color: th.sub,
              textTransform: 'uppercase',
              letterSpacing: 2,
              marginLeft: 6,
              flexShrink: 1,
            }} numberOfLines={2}>
              {t('share_source', lang)}{displaySourceBook}
            </Text>
          </View>

          {/* Footer */}
          <View style={{ alignItems: 'center', marginTop: 60 }}>
            <Text style={{
              fontFamily: 'DMSans_400Regular',
              fontSize: fFooter, color: th.sub,
              textAlign: 'center',
            }}>
              {t('share_more', lang)}
            </Text>
            <Text style={{
              fontFamily: 'DMSans_400Regular',
              fontSize: fFooter, color: th.accent,
              textAlign: 'center',
              marginTop: 12,
              letterSpacing: 1
            }}>
              #{displayCat.replace(/(\s+|&)/g, '')} {lang === 'en' ? '#Spark #DailyInspiration #BookRecommendation #Awareness' : 
                                                    lang === 'es' ? '#Spark #InspiraciónDiaria #RecomendaciónDeLibro #Conciencia' : 
                                                    lang === 'de' ? '#Spark #TäglicheInspiration #Buchempfehlung #Achtsamkeit' : 
                                                    '#Spark #gününilhamı #kitapönerisi #farkindalik'}
            </Text>
          </View>

        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* ===== SHARE MODAL ===== */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={shareModalVisible}
        onRequestClose={() => setShareModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('createCard', lang)}</Text>
              <TouchableOpacity onPress={() => setShareModalVisible(false)}>
                <Ionicons name="close" size={22} color={colors.text} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSub}>{t('shareOnInstagram', lang)}</Text>

            <ScrollView showsVerticalScrollIndicator={false} style={{ flexShrink: 1, marginBottom: 16 }}>
              {/* Card Preview (visible to user exactly as captured) */}
              <View style={[styles.shareCardWrapper, {
                width: width - 80,
                height: (shareFormat === 'post' ? 1080 : 1920) * ((width - 80) / 1080),
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: 'transparent'
              }]}>
                <View style={{
                  width: 1080,
                  height: shareFormat === 'post' ? 1080 : 1920,
                  transform: [{ scale: (width - 80) / 1080 }]
                }}>
                  {renderShareCard()}
                </View>
              </View>

            {/* Content type pills */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.contentPillsRow}>
              {[
                { id: 'quote', label: t('quote_label', lang), icon: 'chatbox-ellipses-outline' },
                { id: 'lesson', label: t('lesson_pill', lang), icon: 'bulb-outline' },
                { id: 'reflection', label: t('reflect_pill', lang), icon: 'help-circle-outline' },
              ].map(ct => (
                <TouchableOpacity
                  key={ct.id}
                  style={[styles.contentPill, shareContent.includes(ct.id) && styles.contentPillActive]}
                  onPress={() => {
                    if (shareFormat === 'story') {
                      setShareContent(prev => {
                        if (prev.includes(ct.id)) {
                          return prev.length > 1 ? prev.filter(id => id !== ct.id) : prev;
                        }
                        return [...prev, ct.id];
                      });
                    } else {
                      setShareContent([ct.id]);
                    }
                  }}
                >
                  <Text style={[styles.contentPillText, shareContent.includes(ct.id) && styles.contentPillTextActive]}>
                    {ct.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Theme swatches */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.themeToggle}>
              {SHARE_THEMES.map(th => (
                <TouchableOpacity
                  key={th.id}
                  onPress={() => setShareTheme(th.id)}
                >
                  <LinearGradient
                    colors={th.bg}
                    style={[styles.themeSwatch, shareTheme === th.id && styles.themeSwatchActive]}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Format selector */}
            <View style={styles.formatRow}>
              <TouchableOpacity
                style={[styles.formatBtn, shareFormat === 'post' && styles.formatBtnActive]}
                onPress={() => {
                  setShareFormat('post');
                  if (shareContent.length > 1) {
                    setShareContent([shareContent[0]]);
                  }
                }}
              >
                <Text style={[styles.formatBtnText, shareFormat === 'post' && styles.formatBtnTextActive]}>{t('format_post', lang)}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.formatBtn, shareFormat === 'story' && styles.formatBtnActive]}
                onPress={() => setShareFormat('story')}
              >
                <Text style={[styles.formatBtnText, shareFormat === 'story' && styles.formatBtnTextActive]}>{t('format_story', lang)}</Text>
              </TouchableOpacity>
            </View>
            </ScrollView>

            {/* Share button */}
            <TouchableOpacity style={styles.btnPrimary} onPress={onShare}>
              <Text style={styles.btnPrimaryText}>{t('saveAndShare', lang)}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ===== OFF-SCREEN CAPTURE TARGET ===== */}
      <View style={{ position: 'absolute', left: -9999, top: -9999 }} pointerEvents="none">
        <View ref={viewShotRef} collapsable={false}>
          {renderShareCard()}
        </View>
      </View>

      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      
      <View style={styles.readingProgressBarContainer}>
        <Animated.View style={[styles.readingProgressBar, { width: progressBarWidth }]} />
      </View>

      <View style={styles.detailHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>{t('backBtn', lang)}</Text>
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
          <View style={[styles.badge, { alignSelf: 'flex-start', marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 6 }]}>
            <Ionicons name={getCatIcon(story.cat)} size={12} color={colors.textSecondary} />
            <Text style={styles.badgeText}>{displayCat}</Text>
          </View>
          <Text style={styles.detailTitle}>{displayTitle}</Text>
          <View style={{ flexDirection: 'row', gap: 16, marginTop: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.metaItem}>{story.min} {t('minLabel', lang)} {t('dk_reading', lang)}</Text>
            </View>
            <Text style={styles.metaItem}>{displaySrc}</Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: layout.padding.horizontal }}>
          {(() => {
            // Parse the body into segments based on ##, $$, && markers
            const rawBody = (displayBody || '').replace(/\n{3,}/g, '\n\n');
            const segments = [];
            let remaining = rawBody;

            while (remaining.length > 0) {
              // Find the next marker
              const markers = [
                { marker: '##', type: 'highlight' },
                { marker: '$$', type: 'lesson' },
                { marker: '&&', type: 'reflection' },
              ];

              let nearestIdx = remaining.length;
              let nearestMarker = null;

              for (const m of markers) {
                const openIdx = remaining.indexOf(m.marker);
                if (openIdx !== -1 && openIdx < nearestIdx) {
                  const closeIdx = remaining.indexOf(m.marker, openIdx + m.marker.length);
                  if (closeIdx !== -1) {
                    nearestIdx = openIdx;
                    nearestMarker = { ...m, open: openIdx, close: closeIdx };
                  }
                }
              }

              if (!nearestMarker) {
                // No more markers, push remaining as plain text
                if (remaining.trim()) {
                  segments.push({ type: 'text', content: remaining });
                }
                break;
              }

              // Push text before the marker
              const before = remaining.substring(0, nearestMarker.open);
              if (before.trim()) {
                segments.push({ type: 'text', content: before });
              }

              // Extract content between markers
              const markerContent = remaining.substring(
                nearestMarker.open + nearestMarker.marker.length,
                nearestMarker.close
              );
              segments.push({ type: nearestMarker.type, content: markerContent.trim() });

              // Move past the closing marker
              remaining = remaining.substring(nearestMarker.close + nearestMarker.marker.length);
            }

            return segments.map((seg, idx) => {
              if (seg.type === 'text') {
                return (
                  <Text
                    key={idx}
                    style={[styles.detailBody, { fontSize, lineHeight: fontSize * 1.55 }]}
                  >
                    {seg.content}
                  </Text>
                );
              }

              if (seg.type === 'highlight') {
                return (
                  <View
                    key={idx}
                    style={{
                      borderLeftWidth: 3,
                      borderLeftColor: '#C8A96A',
                      backgroundColor: isDark ? 'rgba(200,169,106,0.08)' : 'rgba(200,169,106,0.1)',
                      paddingLeft: 16,
                      paddingVertical: 10,
                      marginVertical: 6,
                      borderRadius: 4,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'PlayfairDisplay_600SemiBold',
                        fontSize: fontSize + 1,
                        color: colors.text,
                        lineHeight: (fontSize + 1) * 1.6,
                      }}
                    >
                      {seg.content}
                    </Text>
                  </View>
                );
              }

              if (seg.type === 'lesson') {
                return (
                  <View key={idx}>
                    <View style={styles.premiumSeparator}>
                      <View style={styles.separatorLine} />
                      <Text style={styles.separatorIcon}>✦</Text>
                      <View style={styles.separatorLine} />
                    </View>
                    <View style={styles.lessonBox}>
                      <Text style={styles.lessonLabel}>
                        {t('keyTakeaway', lang)}
                      </Text>
                      <Text style={styles.lessonText}>{seg.content}</Text>
                    </View>
                  </View>
                );
              }

              if (seg.type === 'reflection') {
                return (
                  <View
                    key={idx}
                    style={{
                      marginTop: 10,
                      borderRadius: 16,
                      overflow: 'hidden',
                      borderWidth: 1,
                      borderColor: isDark ? 'rgba(200,169,106,0.3)' : 'rgba(200,169,106,0.4)',
                    }}
                  >
                    <LinearGradient
                      colors={isDark
                        ? ['rgba(200,169,106,0.12)', 'rgba(200,169,106,0.04)']
                        : ['rgba(200,169,106,0.15)', 'rgba(200,169,106,0.05)']}
                      style={{ padding: 16 }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <Text style={{ fontSize: 20, marginRight: 8 }}>💭</Text>
                        <Text
                          style={{
                            fontFamily: 'DMSans_500Medium',
                            fontSize: typography.sizes.badge,
                            color: '#C8A96A',
                            letterSpacing: 1,
                            textTransform: 'uppercase',
                          }}
                        >
                          {t('reflect', lang)}
                        </Text>
                      </View>
                      <Text
                        style={{
                          fontFamily: 'PlayfairDisplay_400Regular_Italic',
                          fontSize: fontSize,
                          color: colors.text,
                          lineHeight: fontSize * 1.7,
                        }}
                      >
                        {seg.content}
                      </Text>
                    </LinearGradient>
                  </View>
                );
              }

              return null;
            });
          })()}
          {/* Source & Book section */}
          {displaySourceBook ? (
            <View style={styles.sourceSection}>
              <Text style={styles.sourceLabel}>{t('sourceExplore', lang)}</Text>
              <Text style={styles.bookTitle}>{displaySourceBook.split(' — ')[0].trim()}</Text>
              {story.author ? (
                <Text style={{
                  fontFamily: 'DMSans_400Regular',
                  fontSize: 13,
                  color: colors.textSecondary,
                  marginTop: -10,
                  marginBottom: 12,
                }}>
                  ✍️ {story.author}
                </Text>
              ) : null}

              <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
                <TouchableOpacity 
                   onPress={() => Linking.openURL(`https://www.amazon.com.tr/s?k=${encodeURIComponent(displaySourceBook)}`)}
                   style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.backgroundDark, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, flex: 1, justifyContent: 'center', borderWidth: 1, borderColor: colors.border }}
                >
                  <Ionicons name="cart-outline" size={16} color={colors.text} style={{ marginRight: 6 }} />
                  <Text style={{ color: colors.text, fontFamily: 'DMSans_500Medium', fontSize: 12 }}>{t('book', lang)}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                   onPress={() => Linking.openURL(`https://www.youtube.com/results?search_query=${encodeURIComponent(displaySourceBook)}`)}
                   style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.backgroundDark, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, flex: 1, justifyContent: 'center', borderWidth: 1, borderColor: colors.border }}
                >
                  <Ionicons name="logo-youtube" size={16} color="#FF0000" style={{ marginRight: 6 }} />
                  <Text style={{ color: colors.text, fontFamily: 'DMSans_500Medium', fontSize: 12 }}>Youtube</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                   onPress={() => Linking.openURL(`https://www.tiktok.com/search?q=${encodeURIComponent(displaySourceBook)}`)}
                   style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.backgroundDark, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, flex: 1, justifyContent: 'center', borderWidth: 1, borderColor: colors.border }}
                >
                  <Ionicons name="logo-tiktok" size={16} color={colors.text} style={{ marginRight: 6 }} />
                  <Text style={{ color: colors.text, fontFamily: 'DMSans_500Medium', fontSize: 12 }}>Tiktok</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
        </View>
        <View style={{ height: 100 }} />
      </Animated.ScrollView>

      <View style={styles.detailFooter}>
        <TouchableOpacity style={styles.btnSecondaryShare} onPress={() => setShareModalVisible(true)}>
          <Text style={styles.btnSecondaryShareText}>{t('shareBtn', lang)}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btnPrimary, { flex: 2 }]} onPress={handleNext}>
          <Text style={[styles.btnPrimaryText, { color: '#F7F3EB' }]}>{t('nextStory', lang)}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default StoryDetailScreen;

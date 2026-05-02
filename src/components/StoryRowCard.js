/**
 * StoryRowCard
 * Horizontal list card for the main story feed.
 *
 * Layout  [accent strip | category panel | divider | story details | action column]
 */
import React, { useRef } from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useUserData } from '../context/UserDataContext';
import { t } from '../locales/i18n';
import { getCategoryImage, getCategoryPillTheme } from '../utils/categoryImages';

const StoryRowCard = ({
  story,
  isRead = false,
  locked = false,
  onPress,
  onUseInConversation,
}) => {
  const { colors, layout, isDark, lang } = useTheme();
  const { isFavorite, toggleFavorite, isStoryCompleted, markStoryCompleted } =
    useUserData();

  const scale = useRef(new Animated.Value(1)).current;

  const catKey = story.parent_cat_raw || story.parent_cat || story.cat;
  const pillTheme = getCategoryPillTheme(catKey, isDark);
  const catImage = getCategoryImage(catKey, isDark);

  const displayTitle = story.title || '';
  const displaySrc = story.source_book || '';
  const rawDisplayCat = t(story.parent_cat || story.cat, lang) || story.parent_cat || story.cat || '';
  const displayCat = rawDisplayCat
    ? rawDisplayCat.charAt(0).toUpperCase() + rawDisplayCat.slice(1).toLocaleLowerCase('tr-TR')
    : '';
  const displayMin = story.min || '?';

  const accentColor = pillTheme.activeBorderColor;
  const isCompleted = isStoryCompleted ? isStoryCompleted(story.story_id) : isRead;
  const isSaved = isFavorite(story.story_id);

  const cardBg = isDark ? colors.cardBackground : '#F8F6F2';

  const handlePressIn = () =>
    Animated.timing(scale, { toValue: 0.985, duration: 100, useNativeDriver: true }).start();
  const handlePressOut = () =>
    Animated.timing(scale, { toValue: 1, duration: 180, useNativeDriver: true }).start();

  return (
    <Animated.View style={[{ transform: [{ scale }] }, { opacity: locked ? 0.58 : 1 }]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={locked ? onPress : onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.card,
          {
            backgroundColor: cardBg,
            borderColor: isDark ? colors.border : 'transparent',
            shadowColor: accentColor,
          },
        ]}
      >
        {/* ── Left accent strip ── */}
        <View style={[styles.accentStrip, { backgroundColor: accentColor }]} />

        {/* ── Category panel ── */}
        <View style={styles.categoryPanel}>
          <Text
            numberOfLines={2}
            style={[styles.categoryName, { color: accentColor }]}
          >
            {displayCat}
          </Text>

          <View
            style={[
              styles.categoryImageWrap,
              { backgroundColor: `${accentColor}1A` },
            ]}
          >
            {catImage.source ? (
              <Image
                source={catImage.source}
                style={[
                  styles.categoryImage,
                  {
                    opacity: isDark ? 0.72 : 0.9,
                    transform: [
                      { rotate: catImage.rotate || '0deg' },
                      { scaleX: catImage.flip ? -1 : 1 },
                    ],
                  },
                ]}
                resizeMode="cover"
              />
            ) : (
              <Ionicons name="book-outline" size={22} color={accentColor} />
            )}
          </View>
        </View>

        {/* ── Divider ── */}
        <View
          style={[
            styles.divider,
            { backgroundColor: isDark ? colors.border : '#EBE5D5' },
          ]}
        />

        {/* ── Story details ── */}
        <View style={styles.details}>
          {/* Title */}
          <Text numberOfLines={2} style={[styles.title, { color: colors.text }]}>
            {displayTitle}
          </Text>

          {/* Source book as description */}
          {displaySrc ? (
            <Text
              numberOfLines={1}
              style={[styles.description, { color: colors.textSecondary }]}
            >
              {displaySrc}
            </Text>
          ) : null}

          {/* Meta: time + category tag */}
          <View style={styles.metaRow}>
            <View style={styles.metaTime}>
              <Ionicons name="time-outline" size={11} color="#E5B61E" />
              <Text style={[styles.metaTimeText, { color: colors.textSecondary }]}>
                {displayMin} {t('minLabel', lang)}
              </Text>
            </View>
            {displayCat ? (
              <View
                style={[
                  styles.catTag,
                  {
                    backgroundColor: isDark
                      ? colors.surfaceContainerHigh
                      : '#F0EEE8',
                  },
                ]}
              >
                <Text
                  numberOfLines={1}
                  style={[styles.catTagText, { color: colors.textSecondary }]}
                >
                  {displayCat}
                </Text>
              </View>
            ) : null}
            {locked && (
              <Text style={{ fontSize: 12, marginLeft: 4 }}>🔒</Text>
            )}
          </View>

          {/* CTA: Sohbet İçin Kullan */}
          {!locked && onUseInConversation ? (
            <TouchableOpacity
              onPress={onUseInConversation}
              activeOpacity={0.82}
              style={[
                styles.ctaButton,
                {
                  backgroundColor: isDark ? '#2E2514' : '#EDE3CE',
                },
              ]}
            >
              <Ionicons
                name="chatbubbles-outline"
                size={11}
                color={isDark ? '#D4A855' : '#5C3D0E'}
                style={{ marginRight: 4 }}
              />
              <Text
                style={[
                  styles.ctaText,
                  { color: isDark ? '#D4A855' : '#5C3D0E' },
                ]}
              >
                {t('story_detail_use_cta', lang)}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* ── Action column ── */}
        <View style={styles.actions}>
          {/* Mic */}
          <TouchableOpacity
            onPress={!locked ? onUseInConversation : null}
            activeOpacity={0.75}
            style={[
              styles.actionBtn,
              { backgroundColor: `${accentColor}1A` },
            ]}
          >
            <Ionicons name="mic-outline" size={16} color={accentColor} />
          </TouchableOpacity>

          {/* Read checkmark */}
          <TouchableOpacity
            onPress={() =>
              markStoryCompleted && markStoryCompleted(story.story_id)
            }
            activeOpacity={0.75}
            style={styles.actionItem}
          >
            <Ionicons
              name={isCompleted ? 'checkmark-circle' : 'checkmark-circle-outline'}
              size={19}
              color={isCompleted ? colors.primary : colors.textSecondary}
            />
            <Text style={[styles.actionLabel, { color: colors.textSecondary }]}>
              {t('statRead', lang) || 'Okundu'}
            </Text>
          </TouchableOpacity>

          {/* Bookmark */}
          <TouchableOpacity
            onPress={() => toggleFavorite(story.story_id)}
            activeOpacity={0.75}
            style={styles.actionItem}
          >
            <Ionicons
              name={isSaved ? 'bookmark' : 'bookmark-outline'}
              size={19}
              color={isSaved ? colors.primary : colors.textSecondary}
            />
            <Text style={[styles.actionLabel, { color: colors.textSecondary }]}>
              {t('home_profile_prompt_save', lang) || 'Kaydet'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
    minHeight: 164,
  },

  /* ── Accent strip ── */
  accentStrip: {
    width: 4,
  },

  /* ── Category panel ── */
  categoryPanel: {
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 6,
    gap: 8,
  },
  categoryName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 9,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    textAlign: 'left',
    lineHeight: 13,
  },
  categoryImageWrap: {
    width: 44,
    height: 44,
    borderRadius: 11,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },

  /* ── Divider ── */
  divider: {
    width: 1,
    marginVertical: 14,
  },

  /* ── Story details ── */
  details: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: 'space-between',
    gap: 4,
  },
  title: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 15,
    lineHeight: 21,
  },
  description: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    lineHeight: 15,
    opacity: 0.72,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  metaTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaTimeText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
  },
  catTag: {
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  catTagText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 9,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginTop: 4,
  },
  ctaText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
  },

  /* ── Action column ── */
  actions: {
    width: 50,
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionItem: {
    alignItems: 'center',
    gap: 2,
  },
  actionLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 8,
    lineHeight: 11,
  },
});

export default StoryRowCard;

import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export const BADGE_MAP = {
  first_read:      { icon: 'star',                colors: ['#E6A800', '#B38100'] },
  explorer:        { icon: 'compass',             colors: ['#0066CC', '#004B99'] },
  sage:            { icon: 'leaf',                colors: ['#7A19FF', '#5610B3'] },
  bookworm:        { icon: 'library',             colors: ['#38A169', '#246B46'] },
  streak_7:        { icon: 'flame',               colors: ['#E53E3E', '#992929'] },
  cat_variety_3:   { icon: 'map',                 colors: ['#65A89E', '#215A52'] },
  cat_variety_5:   { icon: 'earth',               colors: ['#288CB3', '#0C4A61'] },
  cat_variety_10:  { icon: 'globe',               colors: ['#1F6A99', '#0A314D'] },
  cat_master_5:    { icon: 'git-merge',           colors: ['#A0A0A0', '#4A4A4A'] },
  cat_master_10:   { icon: 'medal',               colors: ['#D4AF37', '#8C701B'] },
  cat_master_25:   { icon: 'ribbon',              colors: ['#D4AF37', '#8C701B'] },
  cat_master_50:   { icon: 'diamond',             colors: ['#00E5FF', '#007A8C'] },
  cat_master_100:  { icon: 'planet',              colors: ['#FF5E99', '#8C1C45'] },
  philosopher:     { icon: 'book',                colors: ['#605B56', '#1F1E1C'] },
  save_5:          { icon: 'bookmark',            colors: ['#FFB6C1', '#A6557F'] },
  save_10:         { icon: 'bookmarks',           colors: ['#FF69B4', '#8A1B55'] },
  save_50:         { icon: 'albums',              colors: ['#C71585', '#6B0B47'] },
  save_100:        { icon: 'archive',             colors: ['#DB7093', '#711F4A'] },
  share_1:         { icon: 'share-social',        colors: ['#87CEFA', '#3A637F'] },
  share_10:        { icon: 'share',               colors: ['#1E90FF', '#0D4880'] },
  share_20:        { icon: 'megaphone',           colors: ['#00BFFF', '#005580'] },
  share_30:        { icon: 'cellular',            colors: ['#4682B4', '#153652'] },
  share_50:        { icon: 'star',                colors: ['#C0C0FF', '#5050B0'] },
  storyteller:     { icon: 'mic',                 colors: ['#D97706', '#92400E'] },
  icebreaker:      { icon: 'chatbubble-ellipses', colors: ['#2563EB', '#1E3A8A'] },
};

const DEFAULT_COLORS = ['#D4AF37', '#8C701B'];

/**
 * Shared badge visual used on Progress screen, badge modal, and home screen.
 *
 * @param {{ id: string }} badge   - badge object (needs .id)
 * @param {boolean} earned         - whether the badge has been earned
 * @param {boolean} isDark         - dark mode flag
 * @param {number}  size           - diameter in px (default 60)
 */
const BadgeIcon = ({ badge, earned, isDark, size = 60 }) => {
  const meta = BADGE_MAP[badge?.id] || { icon: 'trophy', colors: DEFAULT_COLORS };
  const lockedColors = isDark ? ['#3A3A3A', '#1A1A1A'] : ['#E5E5E5', '#B0B0B0'];
  const lockedBorder = isDark ? '#4A4A4A' : '#CCCCCC';
  const earnedBorder = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)';
  const gradientColors = earned ? meta.colors : lockedColors;
  const iconColor = earned ? '#FFFFFF' : (isDark ? '#555555' : '#999999');

  return (
    <View style={{
      width: size, height: size, borderRadius: size / 2,
      elevation: earned ? 4 : 0,
      shadowColor: earned ? meta.colors[0] : '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3, shadowRadius: 6,
    }}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={{
          width: '100%', height: '100%', borderRadius: size / 2,
          justifyContent: 'center', alignItems: 'center',
          borderWidth: 1.5, borderColor: earned ? earnedBorder : lockedBorder,
        }}
      >
        <View style={{
          width: size - 8, height: size - 8, borderRadius: (size - 8) / 2,
          justifyContent: 'center', alignItems: 'center',
          backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)',
        }}>
          <Ionicons name={earned ? meta.icon : 'lock-closed'} size={size * 0.45} color={iconColor} />
        </View>
        {earned && (
          <LinearGradient
            colors={['rgba(255,255,255,0.45)', 'rgba(255,255,255,0.02)']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={{
              position: 'absolute',
              top: 3, left: 3, right: 3,
              height: size * 0.38,
              borderTopLeftRadius: size / 2,
              borderTopRightRadius: size / 2,
              borderBottomLeftRadius: size / 3,
              borderBottomRightRadius: size / 3,
            }}
          />
        )}
      </LinearGradient>
    </View>
  );
};

/**
 * General-purpose gradient icon — same visual language as BadgeIcon
 * but for non-badge contexts (daily reading, category, streak, etc.)
 *
 * @param {string}   ionicon  - Ionicons icon name
 * @param {string[]} colors   - gradient color pair ['#start', '#end']
 * @param {number}   size     - diameter in px (default 42)
 */
export const GradientIcon = ({ ionicon, colors: gradColors, size = 42 }) => {
  return (
    <View style={{
      width: size, height: size, borderRadius: size / 2,
      elevation: 4,
      shadowColor: gradColors[0],
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.3, shadowRadius: 5,
    }}>
      <LinearGradient
        colors={gradColors}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={{
          width: '100%', height: '100%', borderRadius: size / 2,
          justifyContent: 'center', alignItems: 'center',
          borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.15)',
        }}
      >
        <View style={{
          width: size - 8, height: size - 8, borderRadius: (size - 8) / 2,
          justifyContent: 'center', alignItems: 'center',
          backgroundColor: 'rgba(255,255,255,0.15)',
        }}>
          <Ionicons name={ionicon} size={size * 0.44} color="#FFFFFF" />
        </View>
        <LinearGradient
          colors={['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.02)']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={{
            position: 'absolute',
            top: 3, left: 3, right: 3,
            height: size * 0.38,
            borderTopLeftRadius: size / 2,
            borderTopRightRadius: size / 2,
            borderBottomLeftRadius: size / 3,
            borderBottomRightRadius: size / 3,
          }}
        />
      </LinearGradient>
    </View>
  );
};

// Preset color palettes for common action contexts
export const ACTION_ICON_COLORS = {
  reading:   ['#4776E6', '#8E54E9'],   // blue-purple
  streak:    ['#E53E3E', '#992929'],   // red (matches streak_7 badge)
  badge:     ['#D4AF37', '#8C701B'],   // gold (matches trophy)
  category:  ['#288CB3', '#0C4A61'],   // teal-blue
  complete:  ['#38A169', '#246B46'],   // green
  protected: ['#2563EB', '#1E3A8A'],   // blue
};

export default BadgeIcon;

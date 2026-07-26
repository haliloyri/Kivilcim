/**
 * Kıvılcım Yolu rütbelerinin tek görsel sözleşmesi.
 * Bitmap asset gerektirmez: aynı kimlik timeline, detay, promotion ve share
 * yüzeylerinde güvenli bir gradient + sembol fallback'i olarak çalışır.
 */
const common = { pathId: 'common', accent: '#C89B3C', light: ['#E7C46F', '#9B6926'], dark: ['#9D742B', '#4F3212'] };
const exploration = { pathId: 'exploration', accent: '#6CAED6', light: ['#477FAF', '#233C72'], dark: ['#315E88', '#152B4E'] };
const depth = { pathId: 'depth', accent: '#B29AE0', light: ['#815EAF', '#38264E'], dark: ['#5A427D', '#251B38'] };
const transfer = { pathId: 'transfer', accent: '#F2AE79', light: ['#C96E55', '#713549'], dark: ['#934B3B', '#482032'] };

export const CAREER_VISUALS = Object.freeze({
  first_spark: { ...common, icon: 'sparkles-outline', shareBackground: '#F7ECCE' },
  curious: { ...common, icon: 'telescope-outline', shareBackground: '#F1E8D8' },
  traveler: { ...common, icon: 'walk-outline', shareBackground: '#EFE3CE' },
  route_seeker: { ...exploration, icon: 'compass-outline', shareBackground: '#E8F2FA' },
  horizon_traveler: { ...exploration, icon: 'earth-outline', shareBackground: '#E3F0F8' },
  wisdom_cartographer: { ...exploration, icon: 'map-outline', shareBackground: '#DDEBF6' },
  thinker: { ...depth, icon: 'bulb-outline', shareBackground: '#F0EAF7' },
  synthesizer: { ...depth, icon: 'git-merge-outline', shareBackground: '#EAE1F4' },
  insight_curator: { ...depth, icon: 'library-outline', shareBackground: '#E4D9F0' },
  storyteller: { ...transfer, icon: 'mic-outline', shareBackground: '#FBE8DC' },
  connector: { ...transfer, icon: 'people-outline', shareBackground: '#F9E2D5' },
  spark_carrier: { ...transfer, icon: 'flame-outline', shareBackground: '#F8DCD0' },
});

const FALLBACK = Object.freeze({ ...common, icon: 'sparkles-outline', shareBackground: '#F7ECCE' });

export const getCareerVisual = (visualKey) => CAREER_VISUALS[visualKey] || FALLBACK;

export const getCareerVisualState = (visualKey, status = 'future', isDark = false) => {
  const visual = getCareerVisual(visualKey);
  if (status === 'completed') return { visual, colors: isDark ? visual.dark : visual.light, icon: visual.icon, iconColor: '#FFFFFF', opacity: 1 };
  if (status === 'current') return { visual, colors: isDark ? visual.dark : visual.light, icon: visual.icon, iconColor: '#FFFFFF', opacity: 1 };
  return { visual, colors: isDark ? ['#38383D', '#25252A'] : ['#E9E6E1', '#CBC6BF'], icon: 'lock-closed-outline', iconColor: isDark ? '#A5A3A0' : '#847D74', opacity: 1 };
};

export const CAREER_VISUAL_KEYS = Object.freeze(Object.keys(CAREER_VISUALS));

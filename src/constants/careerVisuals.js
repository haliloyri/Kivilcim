/**
 * Albor Yolu rütbelerinin tek görsel sözleşmesi.
 * Her unvanın amblem görseli (`image`) vardır; kilitli durumda gradient + kilit ikonu gösterilir.
 * Ionicons `icon` yalnızca share kartı ve yedek olarak kalır.
 */
// Yol vurgusu = DESIGN.md kategori ailesi (ortak yol marka petrolü). `accent` açık tema, `accentDark` koyu tema.
const common = { pathId: 'common', accent: '#1F5F5B', accentDark: '#7CC0B6', light: ['#3A726F', '#164442'], dark: ['#1C5652', '#10302E'], share: '#EEEBE0' };
const exploration = { pathId: 'exploration', accent: '#1F7FA8', accentDark: '#7CC3E3', light: ['#3A8EB2', '#165B79'], dark: ['#1C7297', '#104054'], share: '#E9F2F6' };
const depth = { pathId: 'depth', accent: '#5B5FB5', accentDark: '#A5A9F0', light: ['#6F72BE', '#424482'], dark: ['#5256A3', '#2E305A'], share: '#EFEFF8' };
const transfer = { pathId: 'transfer', accent: '#A5623A', accentDark: '#E0A27C', light: ['#B07552', '#77472A'], dark: ['#945834', '#52311D'], share: '#F6EFEB' };

export const CAREER_VISUALS = Object.freeze({
  first_light: { ...common, icon: 'sparkles-outline', shareBackground: common.share, image: require('../../assets/career/nodes/first_light.png') },
  curious: { ...common, icon: 'telescope-outline', shareBackground: common.share, image: require('../../assets/career/nodes/curious.png') },
  traveler: { ...common, icon: 'walk-outline', shareBackground: common.share, image: require('../../assets/career/nodes/traveler.png') },
  route_seeker: { ...exploration, icon: 'compass-outline', shareBackground: exploration.share, image: require('../../assets/career/nodes/route_seeker.png') },
  horizon_traveler: { ...exploration, icon: 'earth-outline', shareBackground: exploration.share, image: require('../../assets/career/nodes/horizon_traveler.png') },
  wisdom_cartographer: { ...exploration, icon: 'map-outline', shareBackground: exploration.share, image: require('../../assets/career/nodes/wisdom_cartographer.png') },
  thinker: { ...depth, icon: 'bulb-outline', shareBackground: depth.share, image: require('../../assets/career/nodes/thinker.png') },
  synthesizer: { ...depth, icon: 'git-merge-outline', shareBackground: depth.share, image: require('../../assets/career/nodes/synthesizer.png') },
  insight_curator: { ...depth, icon: 'library-outline', shareBackground: depth.share, image: require('../../assets/career/nodes/insight_curator.png') },
  storyteller: { ...transfer, icon: 'mic-outline', shareBackground: transfer.share, image: require('../../assets/career/nodes/storyteller.png') },
  connector: { ...transfer, icon: 'people-outline', shareBackground: transfer.share, image: require('../../assets/career/nodes/connector.png') },
  light_carrier: { ...transfer, icon: 'flame-outline', shareBackground: transfer.share, image: require('../../assets/career/nodes/light_carrier.png') },
});

/** Yol başına hero görseli (petrol marka + yol vurgusu). Bilinmeyen yol ortak görsele düşer. */
export const CAREER_HEROES = Object.freeze({
  common: require('../../assets/career/hero-common.png'),
  exploration: require('../../assets/career/hero-exploration.png'),
  depth: require('../../assets/career/hero-depth.png'),
  transfer: require('../../assets/career/hero-transfer.png'),
});
export const getCareerHero = (pathId) => CAREER_HEROES[pathId] || CAREER_HEROES.common;

const HERO_PATHS = ['common', 'exploration', 'depth', 'transfer'];
const HERO_VARIANTS = Object.freeze({
  start: require('../../assets/career/hero-start.png'),
  dark: {
    common: require('../../assets/career/hero-common-dark.png'),
    exploration: require('../../assets/career/hero-exploration-dark.png'),
    depth: require('../../assets/career/hero-depth-dark.png'),
    transfer: require('../../assets/career/hero-transfer-dark.png'),
  },
  summit: {
    common: require('../../assets/career/hero-common-summit.png'),
    exploration: require('../../assets/career/hero-exploration-summit.png'),
    depth: require('../../assets/career/hero-depth-summit.png'),
    transfer: require('../../assets/career/hero-transfer-summit.png'),
  },
});

/** Hero kartı arka planı: başlangıç / zirve / koyu tema / yol görseli. */
export const getCareerHeroImage = ({ pathId, isDark = false, summit = false, start = false } = {}) => {
  const key = HERO_PATHS.includes(pathId) ? pathId : 'common';
  if (start && !pathId) return HERO_VARIANTS.start;
  if (summit) return HERO_VARIANTS.summit[key];
  return isDark ? HERO_VARIANTS.dark[key] : CAREER_HEROES[key];
};

/** Kilitli (henüz kazanılmamış) unvan amblemleri. */
const LOCKED_IMAGES = Object.freeze({
  first_light: require('../../assets/career/nodes/first_light-locked.png'),
  curious: require('../../assets/career/nodes/curious-locked.png'),
  traveler: require('../../assets/career/nodes/traveler-locked.png'),
  route_seeker: require('../../assets/career/nodes/route_seeker-locked.png'),
  horizon_traveler: require('../../assets/career/nodes/horizon_traveler-locked.png'),
  wisdom_cartographer: require('../../assets/career/nodes/wisdom_cartographer-locked.png'),
  thinker: require('../../assets/career/nodes/thinker-locked.png'),
  synthesizer: require('../../assets/career/nodes/synthesizer-locked.png'),
  insight_curator: require('../../assets/career/nodes/insight_curator-locked.png'),
  storyteller: require('../../assets/career/nodes/storyteller-locked.png'),
  connector: require('../../assets/career/nodes/connector-locked.png'),
  light_carrier: require('../../assets/career/nodes/light_carrier-locked.png'),
});

const FALLBACK = Object.freeze({ ...common, icon: 'sparkles-outline', shareBackground: common.share, image: CAREER_VISUALS.first_light.image });

export const getCareerVisual = (visualKey) => CAREER_VISUALS[visualKey] || FALLBACK;

export const getCareerVisualState = (visualKey, status = 'future', isDark = false) => {
  const visual = getCareerVisual(visualKey);
  if (status === 'completed') return { visual, colors: isDark ? visual.dark : visual.light, icon: visual.icon, iconColor: '#FFFFFF', image: visual.image, opacity: 1 };
  if (status === 'current') return { visual, colors: isDark ? visual.dark : visual.light, icon: visual.icon, iconColor: '#FFFFFF', image: visual.image, opacity: 1 };
  return { visual, colors: isDark ? ['#38383D', '#25252A'] : ['#E9E6E1', '#CBC6BF'], icon: 'lock-closed-outline', iconColor: isDark ? '#A5A3A0' : '#847D74', image: LOCKED_IMAGES[visualKey] || LOCKED_IMAGES.first_light, opacity: 1 };
};

export const CAREER_VISUAL_KEYS = Object.freeze(Object.keys(CAREER_VISUALS));

// Badge tanımları ve kazanım kontrolü

// Helper: categoryStats objesinden türetilen değerler
const getUniqueCats = (cs) => cs && typeof cs === 'object' ? Object.keys(cs).length : 0;
const getMaxCatReads = (cs) => cs && typeof cs === 'object' ? Math.max(0, ...Object.values(cs)) : 0;
const getUniqueUsedCategories = (variantUsage = []) => {
  if (!Array.isArray(variantUsage)) return 0;
  const used = variantUsage
    .filter((item) => item?.action === 'mark_used' && item?.storyCategory)
    .map((item) => String(item.storyCategory));
  return new Set(used).size;
};
const getUsedCount = (variantUsage = []) => {
  if (!Array.isArray(variantUsage)) return 0;
  return variantUsage.filter((item) => item?.action === 'mark_used').length;
};

const BADGE_DEFINITIONS = [
  // ── Okuma Sayısı ──
  {
    id: 'first_read',
    icon: '✨',
    titleKey: 'badgeFirstRead',
    subKey: 'badgeFirstReadSub',
    descKey: 'badgeFirstReadDesc',
    check: ({ totalReads }) => totalReads >= 1,
  },
  {
    id: 'explorer',
    icon: '🧭',
    titleKey: 'badgeExplorer',
    subKey: 'badge10Stories',
    descKey: 'badgeExplorerDesc',
    check: ({ totalReads }) => totalReads >= 10,
  },
  {
    id: 'sage',
    icon: '📜',
    titleKey: 'badgeSage',
    subKey: 'badge25Lessons',
    descKey: 'badgeSageDesc',
    check: ({ totalReads, variantUsage }) => totalReads >= 25 && getUniqueUsedCategories(variantUsage) >= 3,
  },
  {
    id: 'bookworm',
    icon: '📚',
    titleKey: 'badgeBookworm',
    subKey: 'badgeBookwormSub',
    descKey: 'badgeBookwormDesc',
    check: ({ totalReads }) => totalReads >= 50,
  },

  // ── Seri (Streak) ──
  {
    id: 'streak_7',
    icon: '🔥',
    titleKey: 'badge7Days',
    subKey: 'badgeStreak',
    descKey: 'badgeStreakDesc',
    check: ({ streak, longestStreak }) => streak >= 7 || longestStreak >= 7,
  },

  // ── Kategori Çeşitliliği ──
  {
    id: 'cat_variety_3',
    icon: '🗺️',
    titleKey: 'badgeCatVariety3',
    subKey: 'badgeCatVariety3Sub',
    descKey: 'badgeCatVariety3Desc',
    check: ({ categoryStats }) => getUniqueCats(categoryStats) >= 3,
  },
  {
    id: 'cat_variety_5',
    icon: '🌍',
    titleKey: 'badgeCatVariety5',
    subKey: 'badgeCatVariety5Sub',
    descKey: 'badgeCatVariety5Desc',
    check: ({ categoryStats }) => getUniqueCats(categoryStats) >= 5,
  },
  {
    id: 'cat_variety_10',
    icon: '🌐',
    titleKey: 'badgeCatVariety10',
    subKey: 'badgeCatVariety10Sub',
    descKey: 'badgeCatVariety10Desc',
    check: ({ categoryStats }) => getUniqueCats(categoryStats) >= 10,
  },

  // ── Tek Kategoride Uzmanlık ──
  {
    id: 'cat_master_5',
    icon: '🎯',
    titleKey: 'badgeCatMaster5',
    subKey: 'badgeCatMaster5Sub',
    descKey: 'badgeCatMaster5Desc',
    check: ({ categoryStats }) => getMaxCatReads(categoryStats) >= 5,
  },
  {
    id: 'cat_master_10',
    icon: '🏅',
    titleKey: 'badgeCatMaster10',
    subKey: 'badgeCatMaster10Sub',
    descKey: 'badgeCatMaster10Desc',
    check: ({ categoryStats }) => getMaxCatReads(categoryStats) >= 10,
  },
  {
    id: 'cat_master_25',
    icon: '👑',
    titleKey: 'badgeCatMaster25',
    subKey: 'badgeCatMaster25Sub',
    descKey: 'badgeCatMaster25Desc',
    check: ({ categoryStats }) => getMaxCatReads(categoryStats) >= 25,
  },
  {
    id: 'cat_master_50',
    icon: '💎',
    titleKey: 'badgeCatMaster50',
    subKey: 'badgeCatMaster50Sub',
    descKey: 'badgeCatMaster50Desc',
    check: ({ categoryStats }) => getMaxCatReads(categoryStats) >= 50,
  },
  {
    id: 'cat_master_100',
    icon: '🌠',
    titleKey: 'badgeCatMaster100',
    subKey: 'badgeCatMaster100Sub',
    descKey: 'badgeCatMaster100Desc',
    check: ({ categoryStats }) => getMaxCatReads(categoryStats) >= 100,
  },

  // ── Felsefe Özel ──
  {
    id: 'philosopher',
    icon: '🏛️',
    titleKey: 'badgePhilosopher',
    subKey: 'badgePhilosophy5',
    descKey: 'badgePhilosopherDesc',
    check: ({ categoryStats }) => {
      if (!categoryStats || typeof categoryStats !== 'object') return false;
      const count = categoryStats['Felsefe'] || categoryStats['Philosophy'] || 0;
      return count >= 5;
    },
  },

  // ── Kaydetme (Favori) ──
  {
    id: 'save_5',
    icon: '💾',
    titleKey: 'badgeSave5',
    subKey: 'badgeSave5Sub',
    descKey: 'badgeSave5Desc',
    check: ({ favoritesCount }) => favoritesCount >= 5,
  },
  {
    id: 'save_10',
    icon: '📌',
    titleKey: 'badgeSave10',
    subKey: 'badgeSave10Sub',
    descKey: 'badgeSave10Desc',
    check: ({ favoritesCount }) => favoritesCount >= 10,
  },
  {
    id: 'save_50',
    icon: '🗄️',
    titleKey: 'badgeSave50',
    subKey: 'badgeSave50Sub',
    descKey: 'badgeSave50Desc',
    check: ({ favoritesCount }) => favoritesCount >= 50,
  },
  {
    id: 'save_100',
    icon: '🏆',
    titleKey: 'badgeSave100',
    subKey: 'badgeSave100Sub',
    descKey: 'badgeSave100Desc',
    check: ({ favoritesCount }) => favoritesCount >= 100,
  },

  // ── Paylaşım ──
  {
    id: 'share_1',
    icon: '📤',
    titleKey: 'badgeShare1',
    subKey: 'badgeShare1Sub',
    descKey: 'badgeShare1Desc',
    check: ({ shareCount }) => shareCount >= 1,
  },
  {
    id: 'share_10',
    icon: '📣',
    titleKey: 'badgeShare10',
    subKey: 'badgeShare10Sub',
    descKey: 'badgeShare10Desc',
    check: ({ shareCount }) => shareCount >= 10,
  },
  {
    id: 'share_20',
    icon: '🔗',
    titleKey: 'badgeShare20',
    subKey: 'badgeShare20Sub',
    descKey: 'badgeShare20Desc',
    check: ({ shareCount }) => shareCount >= 20,
  },
  {
    id: 'share_30',
    icon: '📡',
    titleKey: 'badgeShare30',
    subKey: 'badgeShare30Sub',
    descKey: 'badgeShare30Desc',
    check: ({ shareCount }) => shareCount >= 30,
  },
  {
    id: 'share_50',
    icon: '🌟',
    titleKey: 'badgeShare50',
    subKey: 'badgeShare50Sub',
    descKey: 'badgeShare50Desc',
    check: ({ shareCount }) => shareCount >= 50,
  },
  {
    id: 'icebreaker',
    icon: '🗣️',
    titleKey: 'badgeIcebreaker',
    subKey: 'badgeIcebreakerSub',
    descKey: 'badgeIcebreakerDesc',
    check: ({ variantUsage }) => {
      if (!Array.isArray(variantUsage)) return false;
      return variantUsage.some((item) => item?.action === 'mark_used' && item?.variantType === 'QUESTION');
    },
  },
  {
    id: 'storyteller',
    icon: '🎙️',
    titleKey: 'badgeStoryteller',
    subKey: 'badgeStorytellerSub',
    descKey: 'badgeStorytellerDesc',
    check: ({ variantUsage }) => getUsedCount(variantUsage) >= 10,
  },
];

export function checkBadges({ totalReads, streak, longestStreak, categoryStats, favoritesCount = 0, shareCount = 0, variantUsage = [] }) {
  return BADGE_DEFINITIONS.map(badge => ({
    ...badge,
    earned: badge.check({ totalReads, streak, longestStreak, categoryStats, favoritesCount, shareCount, variantUsage }),
  }));
}

export { BADGE_DEFINITIONS };

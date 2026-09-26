import { t } from '../locales/i18n';
import { getCareerVisual } from '../constants/careerVisuals';

const readerName = (name, lang) => {
  const safe = String(name || '').trim().slice(0, 30);
  return safe || t('badgeShareReaderFallback', lang);
};

/**
 * Share payload for a title (rank). The copy is the marketing: a concrete
 * number ("12 books, 34 ideas") plus a line that speaks to the viewer.
 */
export const buildRankShare = ({ titleKey, pathId = null, visualKey = null, learning = null, name, lang, earnedAt = null }) => {
  const title = t(titleKey, lang);
  const ideas = Number(learning?.ideas) || 0;
  const books = Number(learning?.books) || 0;
  const hasStats = ideas > 0 && books > 0;
  return {
    kind: 'rank',
    rankTitle: title,
    pathLabel: pathId && pathId !== 'common' ? t(`careerPath.${pathId}.title`, lang) : null,
    line: hasStats
      ? t('career.share.lineStats', lang, { name: readerName(name, lang), books, ideas, title })
      : t('career.share.line', lang, { name: readerName(name, lang), title }),
    hook: t('career.share.hook', lang, { title }),
    stats: hasStats ? [
      { value: books, label: t('career.learned.books', lang) },
      { value: ideas, label: t('career.learned.ideas', lang) },
      { value: Number(learning?.minutes) || 0, label: t('career.learned.minutes', lang) },
    ] : null,
    visualKey: visualKey || 'first_spark',
    earnedDate: earnedAt,
  };
};

/** Share payload for the weekly recap ("Haftam"). */
export const buildWeeklyShare = ({ learning, currentTitleKey = null, name, lang }) => {
  const week = learning?.week || { stories: 0, minutes: 0, books: 0 };
  return {
    kind: 'weekly',
    rankTitle: t('career.share.weekTitle', lang),
    pathLabel: null,
    subLabel: currentTitleKey ? t('career.share.currentTitle', lang, { title: t(currentTitleKey, lang) }) : null,
    line: t('career.share.weekLine', lang, { name: readerName(name, lang), stories: week.stories, books: Math.max(1, week.books || 0) }),
    hook: t('career.share.weekHook', lang),
    stats: [
      { value: week.stories, label: t('career.share.stories', lang) },
      { value: week.books || 0, label: t('career.learned.books', lang) },
      { value: week.minutes, label: t('career.learned.minutes', lang) },
    ],
    icon: 'calendar-outline',
    visualKey: 'curious',
    earnedDate: null,
  };
};

export const getShareIcon = (achievement) => achievement?.icon || getCareerVisual(achievement?.visualKey).icon;

/** Share payload for a book milestone ("10 kitap!"). */
export const buildBooksMilestoneShare = ({ count, learning, name, lang }) => ({
  kind: 'milestone',
  rankTitle: t('career.milestone.booksTitle', lang, { count }),
  pathLabel: null,
  line: t('career.share.booksLine', lang, { name: readerName(name, lang), books: Number(learning?.books) || count, ideas: Number(learning?.ideas) || 0 }),
  hook: t('career.share.booksHook', lang),
  stats: [
    { value: Number(learning?.books) || count, label: t('career.learned.books', lang) },
    { value: Number(learning?.ideas) || 0, label: t('career.learned.ideas', lang) },
    { value: Number(learning?.minutes) || 0, label: t('career.learned.minutes', lang) },
  ],
  icon: 'library-outline',
  visualKey: 'wisdom_cartographer',
  earnedDate: null,
});

import { BOOK_MILESTONES } from './careerLearning';

const categoryKey = (category) => `cat_${String(category?.rawName || category?.name || '').trim().toLowerCase()}`;

/** Every milestone the reader has reached so far, as stable ids. */
export const getReachedMilestoneIds = (summary) => {
  if (!summary) return [];
  const books = BOOK_MILESTONES.filter((target) => summary.books >= target).map((target) => `books_${target}`);
  const categories = (summary.allCategories || summary.categories || []).map(categoryKey);
  return [...books, ...categories];
};

/**
 * Reached milestones as display items for the "Öğrendiklerin" shelf, so a
 * reader can re-open a celebration later. Derived from the summary (not the
 * seen-list in storage), so it stays correct across devices and reinstalls.
 */
export const listReachedMilestones = (summary) => {
  if (!summary) return [];
  const books = BOOK_MILESTONES
    .filter((target) => summary.books >= target)
    .map((target) => ({ id: `books_${target}`, type: 'books', count: target }));
  const categories = (summary.allCategories || summary.categories || [])
    .map((category) => ({ id: categoryKey(category), type: 'category', category: category.name, categoryRaw: category.rawName }));
  return [...books, ...categories];
};

/**
 * Decides which of the newly reached milestones deserves a celebration.
 * The biggest new book milestone wins; otherwise the first new category.
 * A reader's very first category is never celebrated here because the
 * "İlk Kıvılcım" title promotion already marks that moment.
 */
export const pickMilestoneCelebration = (newIds = [], summary) => {
  if (!newIds.length || !summary) return null;
  const bookTargets = newIds
    .filter((id) => id.startsWith('books_'))
    .map((id) => Number(id.slice(6)))
    .filter(Number.isFinite)
    .sort((a, b) => b - a);
  if (bookTargets.length) return { id: `books_${bookTargets[0]}`, type: 'books', count: bookTargets[0] };
  if ((summary.ideas || 0) <= 1) return null;
  const newCategory = (summary.allCategories || []).find((category) => newIds.includes(categoryKey(category)));
  return newCategory ? { id: categoryKey(newCategory), type: 'category', category: newCategory.name, categoryRaw: newCategory.rawName } : null;
};

/**
 * Pure state step. First run only records a silent baseline so existing
 * readers are not flooded with celebrations for past progress.
 */
export const nextMilestoneState = (stored, summary) => {
  const reached = getReachedMilestoneIds(summary);
  if (!stored?.initialized) return { state: { initialized: true, seen: reached }, newIds: [] };
  const seen = new Set(stored.seen || []);
  return { state: stored, newIds: reached.filter((id) => !seen.has(id)) };
};

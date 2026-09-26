import { toLocalDay } from './localDate';

export const BOOK_MILESTONES = Object.freeze([5, 10, 25, 50, 100, 250]);

const eventStoryId = (event) => String(event?.storyId ?? event?.story_id ?? '');
const eventType = (event) => event?.creditType ?? event?.credit_type;
const eventTime = (event) => String(event?.occurredAt ?? event?.occurred_at ?? '');
const eventDay = (event) => event?.localDay ?? event?.local_day ?? toLocalDay(eventTime(event));

const mondayOf = (date) => {
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  day.setDate(day.getDate() - ((day.getDay() + 6) % 7));
  return day;
};

/**
 * "What have I learned?" projection for the İlerleme tab. Pure: it only reads
 * completed-story (H) career events and the story catalogue. Every completed
 * story counts here (no daily credit caps) because learning is not a rank rule.
 */
export const buildLearningSummary = ({ events = [], stories = [], now = new Date(), recentLimit = 3, categoryLimit = 5 } = {}) => {
  const storyById = new Map((stories || []).map((story) => [String(story?.story_id ?? story?.id ?? ''), story]));
  const firstCompletion = new Map();
  (events || [])
    .filter((event) => eventType(event) === 'H' && eventStoryId(event))
    .sort((a, b) => eventTime(a).localeCompare(eventTime(b)))
    .forEach((event) => {
      if (!firstCompletion.has(eventStoryId(event))) firstCompletion.set(eventStoryId(event), event);
    });

  const completed = [...firstCompletion.values()];
  const books = new Set();
  const categoryCounts = new Map();
  let minutes = 0;
  completed.forEach((event) => {
    const story = storyById.get(eventStoryId(event));
    if (!story) return;
    const bookKey = story.source_book_id ?? story.source_book;
    if (bookKey != null && bookKey !== '') books.add(String(bookKey));
    minutes += Math.max(1, Number(story.min) || 1);
    const name = story.parent_cat || story.cat;
    if (name) {
      const entry = categoryCounts.get(name) || { name, rawName: story.parent_cat_raw || name, count: 0 };
      entry.count += 1;
      categoryCounts.set(name, entry);
    }
  });

  const categories = [...categoryCounts.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  const recent = [...completed]
    .sort((a, b) => eventTime(b).localeCompare(eventTime(a)))
    .map((event) => storyById.get(eventStoryId(event)))
    .filter(Boolean)
    .slice(0, recentLimit)
    .map((story) => ({
      storyId: String(story.story_id ?? story.id),
      title: story.title,
      book: story.source_book || '',
      category: story.parent_cat || story.cat || '',
      categoryRaw: story.parent_cat_raw || story.parent_cat || story.cat || '',
    }));

  const nextTarget = BOOK_MILESTONES.find((target) => target > books.size) || null;
  const weekStart = toLocalDay(mondayOf(now));
  const thisWeek = completed.filter((event) => String(eventDay(event) || '') >= weekStart);
  const weekMinutes = thisWeek.reduce((sum, event) => sum + Math.max(1, Number(storyById.get(eventStoryId(event))?.min) || 1), 0);
  const weekBooks = new Set(thisWeek
    .map((event) => storyById.get(eventStoryId(event)))
    .map((story) => story?.source_book_id ?? story?.source_book)
    .filter((key) => key != null && key !== '')
    .map(String));

  return {
    ideas: completed.length,
    books: books.size,
    minutes,
    strongest: categories[0] || null,
    categories: categories.slice(0, categoryLimit),
    allCategories: categories,
    recent,
    nextBookMilestone: nextTarget ? { target: nextTarget, remaining: nextTarget - books.size } : null,
    week: { stories: thisWeek.length, minutes: weekMinutes, books: weekBooks.size },
  };
};

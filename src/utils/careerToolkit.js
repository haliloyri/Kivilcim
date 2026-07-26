const storyId = (story) => String(story?.story_id ?? story?.id ?? '');
const categoryId = (story) => String(story?.parent_cat_id ?? story?.parent_cat_raw ?? story?.parent_cat ?? story?.cat ?? '');

const stableStoryOrder = (stories) => [...(stories || [])]
  .filter((story) => storyId(story) && categoryId(story))
  .sort((a, b) => storyId(a).localeCompare(storyId(b)));

const weekSeed = (date) => {
  const local = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const startOfYear = new Date(local.getFullYear(), 0, 1);
  return (Math.floor((local - startOfYear) / 86400000) + Math.floor((startOfYear.getDay() + 6) % 7)) / 7;
};

const rotate = (items, offset) => items.length ? [...items.slice(offset), ...items.slice(0, offset)] : [];

// The free subset mirrors Home's daily rule: one readable story from up to
// three categories. The route may never surface an item outside that subset.
export const selectWeeklyRoute = ({ stories, isPremium = false, date = new Date(), count = 3 } = {}) => {
  const ordered = stableStoryOrder(stories);
  const readable = isPremium
    ? ordered
    : ordered.filter((story, index, list) => {
      const category = categoryId(story);
      return list.findIndex((candidate) => categoryId(candidate) === category) === index;
    }).slice(0, count);
  const rotated = rotate(readable, Math.floor(weekSeed(date)) % Math.max(readable.length, 1));
  const seenCategories = new Set();
  return rotated.filter((story) => {
    const category = categoryId(story);
    if (seenCategories.has(category) || seenCategories.size >= count) return false;
    seenCategories.add(category);
    return true;
  });
};

export const getStoryCategoryKey = categoryId;

// Adapter module: loads stories from stories.json
// Exposes the shape expected by the app.
// Body text may contain special markers:
//   ##text## = highlighted important sentence
//   $$text$$ = lesson / key takeaway
//   &&text&& = reflection question for the reader

const storiesJson = require('./stories.json');

// Extract all unique categories from stories
const catSet = new Set();
(Array.isArray(storiesJson) ? storiesJson : []).forEach(s => {
  if (s?.cat) catSet.add(s.cat);
});
export const categories = Array.from(catSet).sort();

const normalizeStory = (s) => {
  return {
    id: s?.id,
    cat: s?.cat ?? '',
    min: s?.min ?? 3,
    publishDate: s?.publishDate ?? '',
    title: s?.title ?? '',
    body: s?.body ?? '',
    description: s?.description ?? '',
    lesson: s?.lesson ?? '',
    quote: s?.quote ?? '',
    reflection: s?.reflection ?? '',
    src: s?.src ?? '',
    source_book: s?.source_book ?? '',
    source_book_en: s?.source_book_en ?? '',
    author: s?.author ?? '',
  };
};

export const stories = (Array.isArray(storiesJson) ? storiesJson : []).map(normalizeStory);

// Adapter module: loads stories from stories.json and books.json
// and exposes the shape expected by the app (id, cat, min, publishDate, title, body, lesson, quote, src, source_book, links).

// Use require to ensure compatibility across environments where JSON imports may vary
const storiesJson = require('./stories.json');
const booksJson = require('./books.json');

export const categories = [
  'Finans', 'Psikoloji', 'Tarih', 'Liderlik',
  'Sağlık', 'Bilim', 'Felsefe', 'İş & Girişim'
];

const normalizeStory = (s) => {
  const tr = s?.content?.tr || {};
  const en = s?.content?.en || {};
  const title = tr?.title ?? en?.title ?? '';
  const body = tr?.body ?? en?.body ?? '';
  const lesson = tr?.lesson ?? en?.lesson ?? '';
  const quote = tr?.quote ?? en?.quote ?? '';

  // Resolve source book title from books.json using sourceBookId
  const book = Array.isArray(booksJson) ? booksJson.find(b => b.id === s?.sourceBookId) : null;
  const bookTitle = book?.content?.tr?.title ?? book?.content?.en?.title ?? '';

  // Build links for UI from books.json (associated book), not from stories.json
  const linkedBook = Array.isArray(booksJson) ? booksJson.find(b => b.id === s?.sourceBookId) : null;
  const bookLinksTr = linkedBook?.links?.tr ?? {};
  const links = {
    amazon: bookLinksTr?.amazon ?? '',
    hepsiburada: bookLinksTr?.hepsiburada ?? '',
    youtube: bookLinksTr?.youtube ?? '',
    tiktok: '',
  };

  return {
    id: s?.id,
    cat: s?.cat,
    min: s?.min,
    publishDate: s?.publishDate,
    title,
    body,
    lesson,
    quote,
    src: bookTitle,
    source_book: bookTitle,
    // English variants for bilingual display (UI can prefer lang==='en')
    title_en: en?.title ?? title,
    body_en: en?.body ?? body,
    lesson_en: en?.lesson ?? lesson,
    quote_en: en?.quote ?? quote,
    src_en: book?.content?.en?.title ?? bookTitle,
    source_book_en: book?.content?.en?.title ?? bookTitle,
    links,
  };
};

export const stories = (Array.isArray(storiesJson) ? storiesJson : []).map(normalizeStory);

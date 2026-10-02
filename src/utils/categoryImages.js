/**
 * Category Image Mapping
 * Maps story categories to their respective illustration images.
 * Similar categories share the same image.
 *
 * Image groups:
 *   finance    → Finans, İş & Girişim, Pazarlama, Satış, Kariyer
 *   psychology → Psikoloji, Nörobilim, Farkındalık, Duygular, Mutluluk, Bağımlılık
 *   leadership → Liderlik, Strateji, Yönetim, Başarı, Hedefler
 *   health     → Sağlık, Alışkanlıklar
 *   growth     → Kişisel Gelişim, Motivasyon, Değişim, Dayanıklılık, İlham
 *   science    → Bilim, Teknoloji, Ürün, Gelecek
 *   philosophy → Felsefe, Düşünme, Öğrenme, Yaşam, Sosyoloji, Toplum, Topluluk
 *   communication → İletişim, İlişkiler, Müzakere
 *   productivity → Verimlilik, Girişimcilik, İş Dünyası, Tasarım, Yazarlık
 *   history    → Tarih, Güncel, Güvenlik
 *
 * Visual Logic: Since we hit the generation quota (429), we use 4 base images
 * and apply custom rotations/tints to make the 6 Parent Groups unique.
 */

export const CAT_STYLES = {
  'Mind & Psychology': { rotate: '0deg', flip: false, tint: 'rgba(26, 41, 128, 0.08)' }, // Midnight Indigo
  'Career & Success': { rotate: '0deg', flip: false, tint: 'rgba(204, 167, 48, 0.12)' }, // Golden Grain
  'Personal Growth': { rotate: '90deg', flip: true, tint: 'rgba(12, 107, 107, 0.08)' }, // Emerald Deep
  'Growth': { rotate: '90deg', flip: true, tint: 'rgba(12, 107, 107, 0.08)' }, // Emerald Deep (normalized alias)
  'Science & Future': { rotate: '180deg', flip: false, tint: 'rgba(139, 106, 48, 0.05)' }, // Bronze Earth
  'Society & World': { rotate: '270deg', flip: true, tint: 'rgba(161, 89, 22, 0.10)' }, // Terracotta
  'Social Skills': { rotate: '0deg', flip: true, tint: 'rgba(186, 26, 26, 0.05)' }, // Crimson Mist
};

// Dark mode variants — deeper, desaturated tints for better contrast on dark backgrounds
export const CAT_STYLES_DARK = {
  'Mind & Psychology': { rotate: '0deg', flip: false, tint: 'rgba(10, 20, 80, 0.55)' },
  'Career & Success': { rotate: '0deg', flip: false, tint: 'rgba(80, 60, 8, 0.55)' },
  'Personal Growth': { rotate: '90deg', flip: true, tint: 'rgba(5, 55, 55, 0.55)' },
  'Growth': { rotate: '90deg', flip: true, tint: 'rgba(5, 55, 55, 0.55)' },
  'Science & Future': { rotate: '180deg', flip: false, tint: 'rgba(55, 40, 8, 0.50)' },
  'Society & World': { rotate: '270deg', flip: true, tint: 'rgba(65, 28, 5, 0.55)' },
  'Social Skills': { rotate: '0deg', flip: true, tint: 'rgba(75, 8, 8, 0.50)' },
};

const CATEGORY_THEME_MAP = {
  // Home category palette
  // "Tümü" (All) always fills with the app's brand accent, not a per-category
  // colour — it represents the whole app, not one category.
  'Tümü': {
    // Brand default (Petrol). Screens that know the user's accent pass
    // colors.primary to CategoryPill explicitly for "All".
    accent: '#1F5F5B',
    borderColor: '#1F5F5B',
    lightSoft: '#E2EDEA',
    lightStrong: 'rgba(31, 95, 91, 0.14)',
    darkSoft: 'rgba(107, 161, 123, 0.20)',
    darkStrong: 'rgba(107, 161, 123, 0.30)',
    darkAccent: '#8CBF98',
  },
  // Palette sourced from the "Kategori Görselleri Renk Kodları" reference sheet:
  // accent = Ana Renk, borderColor = Detay/İkon (deep tone, also used for
  // per-category text), lightSoft = Arka Plan. Dark-mode fields are lighter tones of
  // the SAME hue so a category keeps its identity across themes.
  'Finance': {
    accent: '#D4A23A',
    borderColor: '#B8862B',
    lightSoft: '#FFF6E3',
    lightStrong: 'rgba(212, 162, 58, 0.14)',
    darkSoft: 'rgba(154, 106, 47, 0.20)',
    darkStrong: 'rgba(154, 106, 47, 0.30)',
    darkAccent: '#B98A55',
  },
  'Psychology': {
    accent: '#9A8AC7',
    borderColor: '#7B6AAE',
    lightSoft: '#F4EFFA',
    lightStrong: 'rgba(154, 138, 199, 0.14)',
    darkSoft: 'rgba(110, 97, 150, 0.20)',
    darkStrong: 'rgba(110, 97, 150, 0.30)',
    darkAccent: '#8E82AE',
  },
  'Leadership': {
    accent: '#6A8FBE',
    borderColor: '#4A6E97',
    lightSoft: '#EAF1FA',
    lightStrong: 'rgba(106, 143, 190, 0.14)',
    darkSoft: 'rgba(63, 90, 115, 0.20)',
    darkStrong: 'rgba(63, 90, 115, 0.30)',
    darkAccent: '#6E8198',
  },
  'Health': {
    // Warm heart-red (was teal, which clashed with the Petrol brand accent).
    accent: '#C0645A',
    borderColor: '#9A4A42',
    lightSoft: '#F8ECEA',
    lightStrong: 'rgba(192, 100, 90, 0.14)',
    darkSoft: 'rgba(192, 100, 90, 0.20)',
    darkStrong: 'rgba(192, 100, 90, 0.30)',
    darkAccent: '#D08A80',
  },
  'Growth': {
    accent: '#6BA17B',
    borderColor: '#4D7F5D',
    lightSoft: '#EAF4EA',
    lightStrong: 'rgba(107, 161, 123, 0.14)',
    darkSoft: 'rgba(91, 137, 105, 0.20)',
    darkStrong: 'rgba(91, 137, 105, 0.30)',
    darkAccent: '#90B89C',
  },
  'Science': {
    accent: '#3C9AA5',
    borderColor: '#2F7881',
    lightSoft: '#E8F3F4',
    lightStrong: 'rgba(60, 154, 165, 0.14)',
    darkSoft: 'rgba(51, 131, 140, 0.20)',
    darkStrong: 'rgba(51, 131, 140, 0.30)',
    darkAccent: '#6DB3BC',
  },
  'Philosophy': {
    accent: '#5B5F97',
    borderColor: '#474A76',
    lightSoft: '#EBECF3',
    lightStrong: 'rgba(91, 95, 151, 0.14)',
    darkSoft: 'rgba(77, 81, 128, 0.20)',
    darkStrong: 'rgba(77, 81, 128, 0.30)',
    darkAccent: '#8487B1',
  },
  'Communication': {
    accent: '#F0A46B',
    borderColor: '#C8733A',
    lightSoft: '#FFEDE1',
    lightStrong: 'rgba(240, 164, 107, 0.14)',
    darkSoft: 'rgba(196, 106, 60, 0.20)',
    darkStrong: 'rgba(196, 106, 60, 0.30)',
    darkAccent: '#D18B66',
  },
  'Productivity': {
    accent: '#9AA046',
    borderColor: '#787D37',
    lightSoft: '#F3F4E9',
    lightStrong: 'rgba(154, 160, 70, 0.14)',
    darkSoft: 'rgba(131, 136, 60, 0.20)',
    darkStrong: 'rgba(131, 136, 60, 0.30)',
    darkAccent: '#B3B874',
  },
  'History': {
    accent: '#A8674A',
    borderColor: '#83503A',
    lightSoft: '#F5EDE9',
    lightStrong: 'rgba(168, 103, 74, 0.14)',
    darkSoft: 'rgba(143, 88, 63, 0.20)',
    darkStrong: 'rgba(143, 88, 63, 0.30)',
    darkAccent: '#BE8D77',
  },
  'Business': {
    accent: '#6B7C93',
    borderColor: '#475667',
    lightSoft: '#ECEFF3',
    lightStrong: 'rgba(107, 124, 147, 0.14)',
    darkSoft: 'rgba(79, 100, 117, 0.20)',
    darkStrong: 'rgba(79, 100, 117, 0.30)',
    darkAccent: '#768799',
  },
  default: {
    accent: '#C89B3C',
    borderColor: '#D8A94B',
    lightSoft: 'rgba(200, 155, 60, 0.06)',
    lightStrong: 'rgba(200, 155, 60, 0.12)',
    darkSoft: 'rgba(229, 194, 122, 0.12)',
    darkStrong: 'rgba(229, 194, 122, 0.20)',
    darkAccent: '#E5C27A',
  },
};

const CATEGORY_PILL_FAMILY_MAP = {
  Tümü: 'all',
  All: 'all',
  Todo: 'all',
  Alle: 'all',
  all: 'all',
  'Mind & Psychology': 'psychology',
  'Zihin ve Psikoloji': 'psychology',
  'Mente y Psicología': 'psychology',
  'Geist und Psychologie': 'psychology',
  Psikoloji: 'psychology',
  Psychology: 'psychology',
  Psicología: 'psychology',
  Psychologie: 'psychology',
  'Career & Success': 'finance',
  'Kariyer ve Başarı': 'finance',
  'Carrera y Éxito': 'finance',
  'Karriere und Erfolg': 'finance',
  Finans: 'finance',
  Finance: 'finance',
  Finanzas: 'finance',
  Finanzen: 'finance',
  'Personal Growth': 'growth',
  'Kişisel Gelişim': 'growth',
  'Crecimiento Personal': 'growth',
  'Persönliches Wachstum': 'growth',
  Büyüme: 'growth',
  Growth: 'growth',
  Bilim: 'science',
  Science: 'science',
  Ciencia: 'science',
  Wissenschaft: 'science',
  'Science & Future': 'science',
  'Bilim ve Gelecek': 'science',
  'Ciencia y Futuro': 'science',
  'Wissenschaft und Zukunft': 'science',
  Liderlik: 'leadership',
  Leadership: 'leadership',
  Liderazgo: 'leadership',
  Führung: 'leadership',
  Sağlık: 'health',
  Health: 'health',
  Salud: 'health',
  Gesundheit: 'health',
  Felsefe: 'philosophy',
  Philosophy: 'philosophy',
  Filosofía: 'philosophy',
  Philosophie: 'philosophy',
  'Society & World': 'philosophy',
  'Toplum ve Dünya': 'philosophy',
  'Sociedad y Mundo': 'philosophy',
  'Gesellschaft und Welt': 'philosophy',
  İletişim: 'communication',
  Communication: 'communication',
  Comunicación: 'communication',
  Kommunikation: 'communication',
  'Social Skills': 'communication',
  'Sosyal Beceriler': 'communication',
  'Habilidades Sociales': 'communication',
  'Soziale Fähigkeiten': 'communication',
  Verimlilik: 'productivity',
  Productivity: 'productivity',
  Productividad: 'productivity',
  Produktivität: 'productivity',
  Tarih: 'history',
  History: 'history',
  Historia: 'history',
  Geschichte: 'history',
};


// Base images
const IMG_FINANCE = require('../../assets/categories/Finance.png');
const IMG_PSYCHOLOGY = require('../../assets/categories/Psychology.png');
const IMG_HISTORY = require('../../assets/categories/History.png');
const IMG_LEADERSHIP = require('../../assets/categories/Leadership.png');
const IMG_HEALTH = require('../../assets/categories/Health.png');
const IMG_SCIENCE = require('../../assets/categories/Science.png');
const IMG_PHILOSOPHY = require('../../assets/categories/Philosophy.png');
const IMG_GROWTH = require('../../assets/categories/Growth.png');
const IMG_PRODUCTIVITY = require('../../assets/categories/Productivity.png');
const IMG_COMMUNICATION = require('../../assets/categories/Communication.png');
const IMG_BUSINESS = IMG_FINANCE;

// Dark mode category images
const IMG_FINANCE_DARK = require('../../assets/categories/Finance-dark.png');
const IMG_PSYCHOLOGY_DARK = require('../../assets/categories/Psychology-dark.png');
const IMG_HISTORY_DARK = require('../../assets/categories/History-dark.png');
const IMG_LEADERSHIP_DARK = require('../../assets/categories/Leadership-dark.png');
const IMG_HEALTH_DARK = require('../../assets/categories/Health-dark.png');
const IMG_SCIENCE_DARK = require('../../assets/categories/Science-dark.png');
const IMG_PHILOSOPHY_DARK = require('../../assets/categories/Philosophy-dark.png');
const IMG_GROWTH_DARK = require('../../assets/categories/Growth-dark.png');
const IMG_PRODUCTIVITY_DARK = require('../../assets/categories/Productivity-dark.png');
const IMG_COMMUNICATION_DARK = require('../../assets/categories/Communication-dark.png');
const IMG_BUSINESS_DARK = IMG_FINANCE_DARK;

// Dark mode image mapping
const DARK_IMAGE_MAP = {
  [IMG_FINANCE]: IMG_FINANCE_DARK,
  [IMG_PSYCHOLOGY]: IMG_PSYCHOLOGY_DARK,
  [IMG_HISTORY]: IMG_HISTORY_DARK,
  [IMG_LEADERSHIP]: IMG_LEADERSHIP_DARK,
  [IMG_HEALTH]: IMG_HEALTH_DARK,
  [IMG_SCIENCE]: IMG_SCIENCE_DARK,
  [IMG_PHILOSOPHY]: IMG_PHILOSOPHY_DARK,
  [IMG_GROWTH]: IMG_GROWTH_DARK,
  [IMG_PRODUCTIVITY]: IMG_PRODUCTIVITY_DARK,
  [IMG_COMMUNICATION]: IMG_COMMUNICATION_DARK,
  [IMG_BUSINESS]: IMG_BUSINESS_DARK,
};

// Category pill icons generated for home top filter row
const PILL_ICON_ALL = null;
const PILL_ICON_FINANCE = require('../../assets/categories/pill_icons/Finance.png');
const PILL_ICON_PSYCHOLOGY = require('../../assets/categories/pill_icons/Psychology.png');
const PILL_ICON_LEADERSHIP = require('../../assets/categories/pill_icons/Leadership.png');
const PILL_ICON_HEALTH = require('../../assets/categories/pill_icons/Health.png');
const PILL_ICON_SCIENCE = require('../../assets/categories/pill_icons/Science.png');
const PILL_ICON_PHILOSOPHY = require('../../assets/categories/pill_icons/Philosophy.png');
const PILL_ICON_GROWTH = require('../../assets/categories/pill_icons/Growth.png');
const PILL_ICON_PRODUCTIVITY = require('../../assets/categories/pill_icons/Productivity.png');
const PILL_ICON_COMMUNICATION = require('../../assets/categories/pill_icons/Communication.png');
const PILL_ICON_HISTORY = require('../../assets/categories/pill_icons/History.png');
const PILL_ICON_BUSINESS = require('../../assets/categories/pill_icons/Business.png');

// Dark mode pill icon variants — same artwork, lightness-inverted so the
// line icon reads clearly against the app's dark filter-pill background.
const PILL_ICON_FINANCE_DARK = require('../../assets/categories/pill_icons/Finance-dark.png');
const PILL_ICON_PSYCHOLOGY_DARK = require('../../assets/categories/pill_icons/Psychology-dark.png');
const PILL_ICON_LEADERSHIP_DARK = require('../../assets/categories/pill_icons/Leadership-dark.png');
const PILL_ICON_HEALTH_DARK = require('../../assets/categories/pill_icons/Health-dark.png');
const PILL_ICON_SCIENCE_DARK = require('../../assets/categories/pill_icons/Science-dark.png');
const PILL_ICON_PHILOSOPHY_DARK = require('../../assets/categories/pill_icons/Philosophy-dark.png');
const PILL_ICON_GROWTH_DARK = require('../../assets/categories/pill_icons/Growth-dark.png');
const PILL_ICON_PRODUCTIVITY_DARK = require('../../assets/categories/pill_icons/Productivity-dark.png');
const PILL_ICON_COMMUNICATION_DARK = require('../../assets/categories/pill_icons/Communication-dark.png');
const PILL_ICON_HISTORY_DARK = require('../../assets/categories/pill_icons/History-dark.png');
const PILL_ICON_BUSINESS_DARK = require('../../assets/categories/pill_icons/Business-dark.png');

// Banner background artwork (soft category-tinted gradient + faint watermark).
// Used behind the home "badge journey / next step" card so it adopts the
// active category's colour. Light-mode only; dark mode falls back to a gradient.
const BANNER_DEFAULT = require('../../assets/banner/Default.png');
const BANNER_MAP = {
  finance: require('../../assets/banner/Finance.png'),
  business: require('../../assets/banner/Business.png'),
  psychology: require('../../assets/banner/Psychology.png'),
  leadership: require('../../assets/banner/Leadership.png'),
  health: require('../../assets/banner/Health.png'),
  growth: require('../../assets/banner/Growth.png'),
  science: require('../../assets/banner/Science.png'),
  philosophy: require('../../assets/banner/Philosophy.png'),
  communication: require('../../assets/banner/Communication.png'),
  productivity: require('../../assets/banner/Productivity.png'),
  history: require('../../assets/banner/History.png'),
};

const PARENT_CATEGORY_IMAGE_MAP_LIGHT = {
  'Mind & Psychology': IMG_PSYCHOLOGY,
  'Psikoloji': IMG_PSYCHOLOGY,
  'Career & Success': IMG_LEADERSHIP,
  'Finans': IMG_FINANCE,
  'Personal Growth': IMG_GROWTH,
  'Büyüme': IMG_GROWTH,
  'Verimlilik': IMG_PRODUCTIVITY,
  'Science & Future': IMG_SCIENCE,
  'Bilim': IMG_SCIENCE,
  'Sağlık': IMG_HEALTH,
  'Society & World': IMG_PHILOSOPHY,
  'Liderlik': IMG_LEADERSHIP,
  'Felsefe': IMG_PHILOSOPHY,
  'Tarih': IMG_HISTORY,
  'Social Skills': IMG_COMMUNICATION,
  'İletişim': IMG_COMMUNICATION,
  'İş & Girişim': IMG_BUSINESS,
  'Kariyer': IMG_BUSINESS,
};

const PARENT_CATEGORY_IMAGE_MAP_DARK = {
  'Mind & Psychology': IMG_PSYCHOLOGY_DARK,
  'Psikoloji': IMG_PSYCHOLOGY_DARK,
  'Career & Success': IMG_LEADERSHIP_DARK,
  'Finans': IMG_FINANCE_DARK,
  'Personal Growth': IMG_GROWTH_DARK,
  'Büyüme': IMG_GROWTH_DARK,
  'Verimlilik': IMG_PRODUCTIVITY_DARK,
  'Science & Future': IMG_SCIENCE_DARK,
  'Bilim': IMG_SCIENCE_DARK,
  'Sağlık': IMG_HEALTH_DARK,
  'Society & World': IMG_PHILOSOPHY_DARK,
  'Liderlik': IMG_LEADERSHIP_DARK,
  'Felsefe': IMG_PHILOSOPHY_DARK,
  'Tarih': IMG_HISTORY_DARK,
  'Social Skills': IMG_COMMUNICATION_DARK,
  'İletişim': IMG_COMMUNICATION_DARK,
  'İş & Girişim': IMG_BUSINESS_DARK,
  'Kariyer': IMG_BUSINESS_DARK,
};

const CATEGORY_PILL_ICON_MAP = {
  'Tümü': PILL_ICON_ALL,
  all: PILL_ICON_ALL,
  'Mind & Psychology': PILL_ICON_PSYCHOLOGY,
  'Psikoloji': PILL_ICON_PSYCHOLOGY,
  'Career & Success': PILL_ICON_FINANCE,
  'Finans': PILL_ICON_FINANCE,
  'Business': PILL_ICON_BUSINESS,
  'İş & Girişim': PILL_ICON_BUSINESS,
  'Kariyer': PILL_ICON_BUSINESS,
  'Science & Future': PILL_ICON_SCIENCE,
  'Bilim': PILL_ICON_SCIENCE,
  'Sağlık': PILL_ICON_HEALTH,
  'Society & World': PILL_ICON_PHILOSOPHY,
  'Liderlik': PILL_ICON_LEADERSHIP,
  'Felsefe': PILL_ICON_PHILOSOPHY,
  'Tarih': PILL_ICON_HISTORY,
  'Social Skills': PILL_ICON_COMMUNICATION,
  'İletişim': PILL_ICON_COMMUNICATION,
  'Personal Growth': PILL_ICON_GROWTH,
  'Büyüme': PILL_ICON_GROWTH,
  'Verimlilik': PILL_ICON_PRODUCTIVITY,
  // Bare English sub-category names — these are what Supabase actually
  // stores in `stories.parent_cat` for lang='en' (e.g. "Growth", not
  // "Personal Growth"), so they need their own entries or the pill
  // silently renders without an icon at all.
  'Finance': PILL_ICON_FINANCE,
  'Psychology': PILL_ICON_PSYCHOLOGY,
  'Leadership': PILL_ICON_LEADERSHIP,
  'Health': PILL_ICON_HEALTH,
  'Science': PILL_ICON_SCIENCE,
  'Philosophy': PILL_ICON_PHILOSOPHY,
  'Communication': PILL_ICON_COMMUNICATION,
  'Growth': PILL_ICON_GROWTH,
  'Productivity': PILL_ICON_PRODUCTIVITY,
  'History': PILL_ICON_HISTORY,
  // Same gap, German/Spanish bare category names (as stored in
  // `stories.parent_cat` for lang='de'/'es').
  'Finanzen': PILL_ICON_FINANCE,
  'Finanzas': PILL_ICON_FINANCE,
  'Psychologie': PILL_ICON_PSYCHOLOGY,
  'Psicología': PILL_ICON_PSYCHOLOGY,
  'Führung': PILL_ICON_LEADERSHIP,
  'Liderazgo': PILL_ICON_LEADERSHIP,
  'Gesundheit': PILL_ICON_HEALTH,
  'Salud': PILL_ICON_HEALTH,
  'Wachstum': PILL_ICON_GROWTH,
  'Crecimiento': PILL_ICON_GROWTH,
  'Wissenschaft': PILL_ICON_SCIENCE,
  'Ciencia': PILL_ICON_SCIENCE,
  'Philosophie': PILL_ICON_PHILOSOPHY,
  'Filosofía': PILL_ICON_PHILOSOPHY,
  'Kommunikation': PILL_ICON_COMMUNICATION,
  'Comunicación': PILL_ICON_COMMUNICATION,
  'Produktivität': PILL_ICON_PRODUCTIVITY,
  'Productividad': PILL_ICON_PRODUCTIVITY,
  'Geschichte': PILL_ICON_HISTORY,
  'Historia': PILL_ICON_HISTORY,
};

// Maps each light pill icon asset to its dark-mode counterpart, so the dark
// variant of CATEGORY_PILL_ICON_MAP can be derived instead of duplicating
// every locale key above a second time.
const PILL_ICON_LIGHT_TO_DARK = new Map([
  [PILL_ICON_FINANCE, PILL_ICON_FINANCE_DARK],
  [PILL_ICON_PSYCHOLOGY, PILL_ICON_PSYCHOLOGY_DARK],
  [PILL_ICON_LEADERSHIP, PILL_ICON_LEADERSHIP_DARK],
  [PILL_ICON_HEALTH, PILL_ICON_HEALTH_DARK],
  [PILL_ICON_SCIENCE, PILL_ICON_SCIENCE_DARK],
  [PILL_ICON_PHILOSOPHY, PILL_ICON_PHILOSOPHY_DARK],
  [PILL_ICON_GROWTH, PILL_ICON_GROWTH_DARK],
  [PILL_ICON_PRODUCTIVITY, PILL_ICON_PRODUCTIVITY_DARK],
  [PILL_ICON_COMMUNICATION, PILL_ICON_COMMUNICATION_DARK],
  [PILL_ICON_HISTORY, PILL_ICON_HISTORY_DARK],
  [PILL_ICON_BUSINESS, PILL_ICON_BUSINESS_DARK],
]);

const CATEGORY_PILL_ICON_MAP_DARK = Object.fromEntries(
  Object.entries(CATEGORY_PILL_ICON_MAP).map(([key, val]) => [key, PILL_ICON_LIGHT_TO_DARK.get(val) || val])
);

const PARENT_CATEGORY_ALIASES = {
  'All': 'Tümü',
  'Todo': 'Tümü',
  'Alle': 'Tümü',
  'Zihin ve Psikoloji': 'Mind & Psychology',
  'Mente y Psicología': 'Mind & Psychology',
  'Geist und Psychologie': 'Mind & Psychology',
  'Psikoloji': 'Psychology',
  'Kariyer ve Başarı': 'Career & Success',
  'Carrera y Éxito': 'Career & Success',
  'Karriere und Erfolg': 'Career & Success',
  'Finans': 'Finance',
  'Bilim ve Gelecek': 'Science & Future',
  'Ciencia y Futuro': 'Science & Future',
  'Wissenschaft und Zukunft': 'Science & Future',
  'Bilim': 'Science',
  'Sağlık': 'Health',
  'Toplum ve Dünya': 'Society & World',
  'Sociedad y Mundo': 'Society & World',
  'Gesellschaft und Welt': 'Society & World',
  'Liderlik': 'Leadership',
  'Felsefe': 'Philosophy',
  'Tarih': 'History',
  'Sosyal Beceriler': 'Social Skills',
  'Habilidades Sociales': 'Social Skills',
  'Soziale Fähigkeiten': 'Social Skills',
  'İletişim': 'Social Skills',
  'Crecimiento Personal': 'Personal Growth',
  'Persönliches Wachstum': 'Personal Growth',
  'Kişisel Gelişim': 'Growth',
  'Büyüme': 'Growth',
  'Verimlilik': 'Productivity',
  'İş & Girişim': 'Business',
  'Kariyer': 'Business',
};

// Strips leading emoji/symbols and collapses whitespace. Source data (Supabase
// `stories.parent_cat`) has occasionally shipped with emoji prefixes (e.g.
// "📈 Growth"), which silently broke lookups below and fell back to the
// default icon/image. Stripping defensively here keeps that from recurring
// even if the upstream data gets dirty again.
const stripDecorations = (value) =>
  String(value || '')
    .replace(/^[^\p{L}\p{N}]+/u, '')
    .replace(/[^\p{L}\p{N}]+$/u, '')
    .trim();

// Display labels may come from the database with a leading emoji or symbol.
// Keep the stored/raw key intact for lookups, and use this helper for copy.
export const cleanCategoryLabel = stripDecorations;

const normalizeLookupKey = (value) => stripDecorations(value).toLowerCase();
const CATEGORY_PILL_FAMILY_MAP_LOWER = Object.fromEntries(
  Object.entries(CATEGORY_PILL_FAMILY_MAP).map(([key, val]) => [normalizeLookupKey(key), val])
);
const CATEGORY_PILL_ICON_MAP_LOWER = Object.fromEntries(
  Object.entries(CATEGORY_PILL_ICON_MAP).map(([key, val]) => [normalizeLookupKey(key), val])
);
const CATEGORY_PILL_ICON_MAP_DARK_LOWER = Object.fromEntries(
  Object.entries(CATEGORY_PILL_ICON_MAP_DARK).map(([key, val]) => [normalizeLookupKey(key), val])
);
const PARENT_CATEGORY_ALIASES_LOWER = Object.fromEntries(
  Object.entries(PARENT_CATEGORY_ALIASES).map(([key, val]) => [normalizeLookupKey(key), val])
);

const categoryImageMap = {
  // ── Finance group ──
  'Finans': IMG_FINANCE,
  'Finance': IMG_FINANCE,
  'Finanzas': IMG_FINANCE,
  'Finanzen': IMG_FINANCE,

  // ── Business group ──
  'İş & Girişim': IMG_BUSINESS,
  'Business': IMG_BUSINESS,
  'Negocios y Emprendimiento': IMG_BUSINESS,
  'Wirtschaft & Unternehmensgründung': IMG_BUSINESS,
  'Pazarlama': IMG_BUSINESS,
  'Marketing': IMG_BUSINESS,
  'Satış': IMG_BUSINESS,
  'Sales': IMG_BUSINESS,
  'Ventas': IMG_BUSINESS,
  'Verkauf': IMG_BUSINESS,
  'Kariyer': IMG_BUSINESS,
  'Career': IMG_BUSINESS,
  'Carrera': IMG_BUSINESS,
  'Karriere': IMG_BUSINESS,

  // ── Psychology group ──
  'Psikoloji': IMG_PSYCHOLOGY,
  'Psychology': IMG_PSYCHOLOGY,
  'Psicología': IMG_PSYCHOLOGY,
  'Psychologie': IMG_PSYCHOLOGY,
  'Nörobilim': IMG_PSYCHOLOGY,
  'Neuroscience': IMG_PSYCHOLOGY,
  'Neurociencia': IMG_PSYCHOLOGY,
  'Neurowissenschaften': IMG_PSYCHOLOGY,
  'Farkındalık': IMG_PSYCHOLOGY,
  'Mindfulness': IMG_PSYCHOLOGY,
  'Atención plena': IMG_PSYCHOLOGY,
  'Achtsamkeit': IMG_PSYCHOLOGY,
  'Duygular': IMG_PSYCHOLOGY,
  'Emotions': IMG_PSYCHOLOGY,
  'Emociones': IMG_PSYCHOLOGY,
  'Emotionen': IMG_PSYCHOLOGY,
  'Mutluluk': IMG_PSYCHOLOGY,
  'Happiness': IMG_PSYCHOLOGY,
  'Felicidad': IMG_PSYCHOLOGY,
  'Glück': IMG_PSYCHOLOGY,
  'Bağımlılık': IMG_PSYCHOLOGY,
  'Addiction': IMG_PSYCHOLOGY,
  'Adicción': IMG_PSYCHOLOGY,
  'Sucht': IMG_PSYCHOLOGY,

  // ── History group ──
  'Tarih': IMG_HISTORY,
  'History': IMG_HISTORY,
  'Historia': IMG_HISTORY,
  'Geschichte': IMG_HISTORY,
  'Güncel': IMG_HISTORY,
  'Current': IMG_HISTORY,
  'Actual': IMG_HISTORY,
  'Aktuell': IMG_HISTORY,
  'Güvenlik': IMG_HISTORY,
  'Security': IMG_HISTORY,
  'Seguridad': IMG_HISTORY,
  'Sicherheit': IMG_HISTORY,

  // ── Leadership group ──
  'Liderlik': IMG_LEADERSHIP,
  'Leadership': IMG_LEADERSHIP,
  'Liderazgo': IMG_LEADERSHIP,
  'Führung': IMG_LEADERSHIP,
  'Strateji': IMG_LEADERSHIP,
  'Strategy': IMG_LEADERSHIP,
  'Estrategia': IMG_LEADERSHIP,
  'Strategie': IMG_LEADERSHIP,
  'Yönetim': IMG_LEADERSHIP,
  'Management': IMG_LEADERSHIP,
  'Gestión': IMG_LEADERSHIP,
  'Başarı': IMG_LEADERSHIP,
  'Success': IMG_LEADERSHIP,
  'Éxito': IMG_LEADERSHIP,
  'Erfolg': IMG_LEADERSHIP,
  'Hedefler': IMG_LEADERSHIP,
  'Goals': IMG_LEADERSHIP,
  'Objetivos': IMG_LEADERSHIP,
  'Ziele': IMG_LEADERSHIP,

  // ── Health group ──
  'Sağlık': IMG_HEALTH,
  'Health': IMG_HEALTH,
  'Salud': IMG_HEALTH,
  'Gesundheit': IMG_HEALTH,
  'Alışkanlıklar': IMG_HEALTH,
  'Habits': IMG_HEALTH,
  'Hábitos': IMG_HEALTH,
  'Gewohnheiten': IMG_HEALTH,

  // ── Science group ──
  'Bilim': IMG_SCIENCE,
  'Science': IMG_SCIENCE,
  'Ciencia': IMG_SCIENCE,
  'Wissenschaft': IMG_SCIENCE,
  'Teknoloji': IMG_SCIENCE,
  'Technology': IMG_SCIENCE,
  'Tecnología': IMG_SCIENCE,
  'Technologie': IMG_SCIENCE,
  'Ürün': IMG_SCIENCE,
  'Product': IMG_SCIENCE,
  'Producto': IMG_SCIENCE,
  'Produkt': IMG_SCIENCE,
  'Gelecek': IMG_SCIENCE,
  'Future': IMG_SCIENCE,
  'Futuro': IMG_SCIENCE,
  'Zukunft': IMG_SCIENCE,

  // ── Philosophy group ──
  'Felsefe': IMG_PHILOSOPHY,
  'Philosophy': IMG_PHILOSOPHY,
  'Filosofía': IMG_PHILOSOPHY,
  'Philosophie': IMG_PHILOSOPHY,
  'Düşünme': IMG_PHILOSOPHY,
  'Thinking': IMG_PHILOSOPHY,
  'Pensamiento': IMG_PHILOSOPHY,
  'Denken': IMG_PHILOSOPHY,
  'Öğrenme': IMG_PHILOSOPHY,
  'Learning': IMG_PHILOSOPHY,
  'Aprendizaje': IMG_PHILOSOPHY,
  'Lernen': IMG_PHILOSOPHY,
  'Yaşam': IMG_PHILOSOPHY,
  'Life': IMG_PHILOSOPHY,
  'Vida': IMG_PHILOSOPHY,
  'Leben': IMG_PHILOSOPHY,
  'Sosyoloji': IMG_PHILOSOPHY,
  'Sociology': IMG_PHILOSOPHY,
  'Sociología': IMG_PHILOSOPHY,
  'Soziologie': IMG_PHILOSOPHY,
  'Toplum': IMG_PHILOSOPHY,
  'Society': IMG_PHILOSOPHY,
  'Sociedad': IMG_PHILOSOPHY,
  'Gesellschaft': IMG_PHILOSOPHY,
  'Topluluk': IMG_PHILOSOPHY,
  'Community': IMG_PHILOSOPHY,
  'Comunidad': IMG_PHILOSOPHY,
  'Gemeinschaft': IMG_PHILOSOPHY,

  // ── Personal Growth group ──
  'Growth': IMG_GROWTH,
  'Kişisel Gelişim': IMG_GROWTH,
  'Personal Growth': IMG_GROWTH,
  'Crecimiento personal': IMG_GROWTH,
  'Persönliches Wachstum': IMG_GROWTH,
  'Motivasyon': IMG_GROWTH,
  'Motivation': IMG_GROWTH,
  'Değişim': IMG_GROWTH,
  'Change': IMG_GROWTH,
  'Cambio': IMG_GROWTH,
  'Veränderung': IMG_GROWTH,
  'Dayanıklılık': IMG_GROWTH,
  'Resilience': IMG_GROWTH,
  'Resiliencia': IMG_GROWTH,
  'Resilienz': IMG_GROWTH,
  'İlham': IMG_GROWTH,
  'Inspiration': IMG_GROWTH,

  // ── Productivity group ──
  'Verimlilik': IMG_PRODUCTIVITY,
  'Productivity': IMG_PRODUCTIVITY,
  'Productividad': IMG_PRODUCTIVITY,
  'Produktivität': IMG_PRODUCTIVITY,
  'Girişimcilik': IMG_PRODUCTIVITY,
  'Entrepreneurship': IMG_PRODUCTIVITY,
  'Emprendimiento': IMG_PRODUCTIVITY,
  'Unternehmertum': IMG_PRODUCTIVITY,
  'İş Dünyası': IMG_PRODUCTIVITY,
  'Wirtschaft': IMG_PRODUCTIVITY,
  'Negocios': IMG_PRODUCTIVITY,
  'Tasarım': IMG_PRODUCTIVITY,
  'Design': IMG_PRODUCTIVITY,
  'Diseño': IMG_PRODUCTIVITY,
  'Yaratıcılık': IMG_PRODUCTIVITY,
  'Creativity': IMG_PRODUCTIVITY,
  'Creatividad': IMG_PRODUCTIVITY,
  'Kreativität': IMG_PRODUCTIVITY,
  'Yazarlık': IMG_PRODUCTIVITY,
  'Writing': IMG_PRODUCTIVITY,
  'Escritura': IMG_PRODUCTIVITY,
  'Schreiben': IMG_PRODUCTIVITY,

  // ── Communication group ──
  'İletişim': IMG_COMMUNICATION,
  'Communication': IMG_COMMUNICATION,
  'Comunicación': IMG_COMMUNICATION,
  'Kommunikation': IMG_COMMUNICATION,
  'İlişkiler': IMG_COMMUNICATION,
  'Relationships': IMG_COMMUNICATION,
  'Relaciones': IMG_COMMUNICATION,
  'Beziehungen': IMG_COMMUNICATION,
  'Müzakere': IMG_COMMUNICATION,
  'Negotiation': IMG_COMMUNICATION,
  'Negociación': IMG_COMMUNICATION,
  'Verhandlung': IMG_COMMUNICATION,

  // ── English parent category names (raw DB names) ──
  'Mind & Psychology': IMG_PSYCHOLOGY,
  'Career & Success': IMG_LEADERSHIP,
  'Science & Future': IMG_SCIENCE,
  'Society & World': IMG_PHILOSOPHY,
  'Social Skills': IMG_COMMUNICATION,

  // ── All ──
  'Tümü': null,
  'All': null,
  'Todo': null,
  'Alle': null,
};

/**
 * Returns the image source and visual style for a given category name.
 * Handles both sub-categories and Parent Groups.
 * @param {string} catName - Category name
 * @param {boolean} isDark - Whether dark mode is active
 */
export const normalizeCategoryKey = (catName) => {
  const trimmed = stripDecorations(catName);
  if (!trimmed) return '';

  return (
    PARENT_CATEGORY_ALIASES[trimmed]
    || PARENT_CATEGORY_ALIASES_LOWER[normalizeLookupKey(trimmed)]
    || trimmed
  );
};

// Category text must stay readable on white cards / paper (WCAG AA 4.5:1).
// The light "Ana Renk" accents are 2–3:1 on white, so text uses the deep
// "Detay" tone, darkened further only where that still falls short.
const _lum = (hex) => {
  let h = String(hex || '').replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  if (h.length !== 6) return 0;
  const ch = (i) => {
    const v = parseInt(h.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * ch(0) + 0.7152 * ch(2) + 0.0722 * ch(4);
};
const _darken = (hex, f) => {
  const h = String(hex).replace('#', '');
  const c = (i) => Math.round(parseInt(h.slice(i, i + 2), 16) * (1 - f)).toString(16).padStart(2, '0');
  return `#${c(0)}${c(2)}${c(4)}`.toUpperCase();
};
const readableCategoryText = (hex, minRatio = 4.6) => {
  if (!hex || hex[0] !== '#' || hex.length !== 7) return hex;
  let out = hex;
  for (let i = 0; i < 12 && (1.05 / (_lum(out) + 0.05)) < minRatio; i += 1) {
    out = _darken(out, 0.08);
  }
  return out;
};

export const getCategoryTheme = (catName, isDark = false) => {
  const normalizedKey = normalizeCategoryKey(catName);
  const palette = CATEGORY_THEME_MAP[normalizedKey] || CATEGORY_THEME_MAP.default;
  return {
    key: normalizedKey,
    accent: isDark ? (palette.darkAccent || palette.accent) : palette.accent,
    borderColor: isDark ? (palette.borderColor || palette.darkAccent || palette.accent) : (palette.borderColor || palette.accent),
    backgroundColor: isDark ? palette.darkSoft : palette.lightSoft,
    strongBackgroundColor: isDark ? palette.darkStrong : palette.lightStrong,
    // Readable category label colour (use for text, not fills).
    textColor: isDark
      ? (palette.darkAccent || palette.accent)
      : readableCategoryText(palette.borderColor || palette.accent),
  };
};

export const getCategoryImage = (catName, isDark = false) => {
  if (!catName) return { source: null, rotate: '0deg', flip: false, tint: 'transparent' };

  const normalizedKey = normalizeCategoryKey(catName);
  const imageMap = isDark ? PARENT_CATEGORY_IMAGE_MAP_DARK : PARENT_CATEGORY_IMAGE_MAP_LIGHT;
  let source = imageMap[normalizedKey] ?? categoryImageMap[normalizedKey] ?? null;

  if (isDark && source) {
    source = DARK_IMAGE_MAP[source] || source;
  }

  const styleMap = isDark ? CAT_STYLES_DARK : CAT_STYLES;
  const style = styleMap[normalizedKey] || { rotate: '0deg', flip: false, tint: 'transparent' };

  return { source, ...style };
};

/**
 * Banner background for the home primary card. Returns the category-tinted
 * artwork (light mode). For "All"/unknown returns the brand-gold default.
 * @param {string} catName
 */
// Soft per-badge banner backgrounds (light tint of each badge colour).
const BADGE_BANNER_MAP = {
  first_read: require('../../assets/banner/badge/first_read.png'),
  explorer: require('../../assets/banner/badge/explorer.png'),
  sage: require('../../assets/banner/badge/sage.png'),
  bookworm: require('../../assets/banner/badge/bookworm.png'),
  streak_7: require('../../assets/banner/badge/streak_7.png'),
  cat_variety_3: require('../../assets/banner/badge/cat_variety_3.png'),
  cat_variety_5: require('../../assets/banner/badge/cat_variety_5.png'),
  cat_variety_10: require('../../assets/banner/badge/cat_variety_10.png'),
  cat_master_5: require('../../assets/banner/badge/cat_master_5.png'),
  cat_master_10: require('../../assets/banner/badge/cat_master_10.png'),
  cat_master_25: require('../../assets/banner/badge/cat_master_25.png'),
  cat_master_50: require('../../assets/banner/badge/cat_master_50.png'),
  cat_master_100: require('../../assets/banner/badge/cat_master_100.png'),
  philosopher: require('../../assets/banner/badge/philosopher.png'),
  save_5: require('../../assets/banner/badge/save_5.png'),
  save_10: require('../../assets/banner/badge/save_10.png'),
  save_50: require('../../assets/banner/badge/save_50.png'),
  save_100: require('../../assets/banner/badge/save_100.png'),
  share_1: require('../../assets/banner/badge/share_1.png'),
  share_10: require('../../assets/banner/badge/share_10.png'),
  share_20: require('../../assets/banner/badge/share_20.png'),
  share_30: require('../../assets/banner/badge/share_30.png'),
  share_50: require('../../assets/banner/badge/share_50.png'),
  storyteller: require('../../assets/banner/badge/storyteller.png'),
  icebreaker: require('../../assets/banner/badge/icebreaker.png'),
};

/** Soft banner background for a badge id (light). Falls back to the neutral paper→petrol banner. */
export const getBadgeBanner = (badgeId) => ({ source: BADGE_BANNER_MAP[badgeId] || BANNER_DEFAULT });

export const getCategoryBanner = (catName) => {
  const normalizedKey = normalizeCategoryKey(catName);
  const family =
    CATEGORY_PILL_FAMILY_MAP[normalizedKey]
    || CATEGORY_PILL_FAMILY_MAP_LOWER[normalizeLookupKey(normalizedKey)]
    || CATEGORY_PILL_FAMILY_MAP_LOWER[normalizeLookupKey(catName)]
    || null;
  return { source: BANNER_MAP[family] || BANNER_DEFAULT };
};

export const getCategoryPillImage = (catName, isDark = false) => {
  if (!catName) return { source: PILL_ICON_ALL };

  const iconMap = isDark ? CATEGORY_PILL_ICON_MAP_DARK : CATEGORY_PILL_ICON_MAP;
  const iconMapLower = isDark ? CATEGORY_PILL_ICON_MAP_DARK_LOWER : CATEGORY_PILL_ICON_MAP_LOWER;

  const normalizedKey = normalizeCategoryKey(catName);
  const source =
    iconMap[normalizedKey]
    || iconMap[String(catName || '').trim()]
    || iconMapLower[normalizeLookupKey(normalizedKey)]
    || iconMapLower[normalizeLookupKey(catName)]
    || PILL_ICON_ALL;
  return { source };
};

export default getCategoryImage;

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
  'Science & Future': { rotate: '180deg', flip: false, tint: 'rgba(139, 106, 48, 0.05)' }, // Bronze Earth
  'Society & World': { rotate: '270deg', flip: true, tint: 'rgba(161, 89, 22, 0.10)' }, // Terracotta
  'Social Skills': { rotate: '0deg', flip: true, tint: 'rgba(186, 26, 26, 0.05)' }, // Crimson Mist
};

// Dark mode variants — deeper, desaturated tints for better contrast on dark backgrounds
export const CAT_STYLES_DARK = {
  'Mind & Psychology': { rotate: '0deg', flip: false, tint: 'rgba(10, 20, 80, 0.55)' },
  'Career & Success': { rotate: '0deg', flip: false, tint: 'rgba(80, 60, 8, 0.55)' },
  'Personal Growth': { rotate: '90deg', flip: true, tint: 'rgba(5, 55, 55, 0.55)' },
  'Science & Future': { rotate: '180deg', flip: false, tint: 'rgba(55, 40, 8, 0.50)' },
  'Society & World': { rotate: '270deg', flip: true, tint: 'rgba(65, 28, 5, 0.55)' },
  'Social Skills': { rotate: '0deg', flip: true, tint: 'rgba(75, 8, 8, 0.50)' },
};

const CATEGORY_THEME_MAP = {
  // DESIGN_AI 2026 category colors
  'Mind & Psychology': {
    accent: '#5C8D67',                       // Psikoloji
    lightSoft: 'rgba(92, 141, 103, 0.08)',   // #DDEBDD equivalent
    lightStrong: 'rgba(92, 141, 103, 0.15)',
    darkSoft: 'rgba(121, 185, 138, 0.14)',   // #79B98A → #1E3A2B
    darkStrong: 'rgba(121, 185, 138, 0.22)',
    darkAccent: '#79B98A',
  },
  'Career & Success': {
    accent: '#C89B3C',                       // Finans
    lightSoft: 'rgba(200, 155, 60, 0.08)',   // #F7E7C1 equivalent
    lightStrong: 'rgba(200, 155, 60, 0.15)',
    darkSoft: 'rgba(217, 177, 95, 0.14)',    // #D9B15F → #4A3A18
    darkStrong: 'rgba(217, 177, 95, 0.22)',
    darkAccent: '#D9B15F',
  },
  'Personal Growth': {
    accent: '#8C5BD6',                       // Motivasyon
    lightSoft: 'rgba(140, 91, 214, 0.07)',   // #EADFFD equivalent
    lightStrong: 'rgba(140, 91, 214, 0.14)',
    darkSoft: 'rgba(181, 141, 255, 0.14)',   // #B58DFF → #34214D
    darkStrong: 'rgba(181, 141, 255, 0.22)',
    darkAccent: '#B58DFF',
  },
  'Science & Future': {
    accent: '#4AA89A',                       // Alışkanlık
    lightSoft: 'rgba(74, 168, 154, 0.07)',   // #D8F2EE equivalent
    lightStrong: 'rgba(74, 168, 154, 0.14)',
    darkSoft: 'rgba(99, 199, 184, 0.14)',    // #63C7B8 → #183D39
    darkStrong: 'rgba(99, 199, 184, 0.22)',
    darkAccent: '#63C7B8',
  },
  'Society & World': {
    accent: '#4E6E9E',                       // Liderlik
    lightSoft: 'rgba(78, 110, 158, 0.07)',   // #DCE6F5 equivalent
    lightStrong: 'rgba(78, 110, 158, 0.14)',
    darkSoft: 'rgba(110, 145, 200, 0.14)',   // #6E91C8 → #1D2D44
    darkStrong: 'rgba(110, 145, 200, 0.22)',
    darkAccent: '#6E91C8',
  },
  'Social Skills': {
    accent: '#D9792B',                       // İletişim
    lightSoft: 'rgba(217, 121, 43, 0.07)',   // #FCE5D3 equivalent
    lightStrong: 'rgba(217, 121, 43, 0.14)',
    darkSoft: 'rgba(242, 155, 87, 0.14)',    // #F29B57 → #4A2B16
    darkStrong: 'rgba(242, 155, 87, 0.22)',
    darkAccent: '#F29B57',
  },
  default: {
    accent: '#C89B3C',
    lightSoft: 'rgba(200, 155, 60, 0.06)',
    lightStrong: 'rgba(200, 155, 60, 0.12)',
    darkSoft: 'rgba(229, 194, 122, 0.12)',
    darkStrong: 'rgba(229, 194, 122, 0.20)',
    darkAccent: '#E5C27A',
  },
};

// Base images
const IMG_FINANCE = require('../../assets/categories/cat_finance.png');
const IMG_PSYCHOLOGY = require('../../assets/categories/cat_psychology.png');
const IMG_HISTORY = require('../../assets/categories/cat_history.png');
const IMG_LEADERSHIP = require('../../assets/categories/cat_leadership.png');
const IMG_HEALTH = require('../../assets/categories/cat_health.png');
const IMG_SCIENCE = require('../../assets/categories/cat_science.png');
const IMG_PHILOSOPHY = require('../../assets/categories/cat_philosophy.png');
const IMG_GROWTH = require('../../assets/categories/cat_growth.png');
const IMG_PRODUCTIVITY = require('../../assets/categories/cat_productivity.png');
const IMG_COMMUNICATION = require('../../assets/categories/cat_communication.png');
const IMG_BUSINESS = require('../../assets/categories/cat_business.png');

// Category pill icons generated for home top filter row
const PILL_ICON_ALL = require('../../assets/categories/pill_icons/all.png');
const PILL_ICON_FINANCE = require('../../assets/categories/pill_icons/finance.png');
const PILL_ICON_PSYCHOLOGY = require('../../assets/categories/pill_icons/psychology.png');
const PILL_ICON_LEADERSHIP = require('../../assets/categories/pill_icons/leadership.png');
const PILL_ICON_COMMUNICATION = require('../../assets/categories/pill_icons/communication.png');

const PARENT_CATEGORY_IMAGE_MAP = {
  'Mind & Psychology': IMG_PSYCHOLOGY,
  'Career & Success': IMG_LEADERSHIP,
  'Personal Growth': IMG_GROWTH,
  'Science & Future': IMG_SCIENCE,
  'Society & World': IMG_PHILOSOPHY,
  'Social Skills': IMG_COMMUNICATION,
};

const CATEGORY_PILL_ICON_MAP = {
  'Tümü': PILL_ICON_ALL,
  all: PILL_ICON_ALL,
  'Mind & Psychology': PILL_ICON_PSYCHOLOGY,
  'Career & Success': PILL_ICON_FINANCE,
  'Science & Future': PILL_ICON_LEADERSHIP,
  'Society & World': PILL_ICON_LEADERSHIP,
  'Social Skills': PILL_ICON_COMMUNICATION,
  'Personal Growth': PILL_ICON_PSYCHOLOGY,
};

const PARENT_CATEGORY_ALIASES = {
  'All': 'Tümü',
  'Todo': 'Tümü',
  'Alle': 'Tümü',
  'Zihin ve Psikoloji': 'Mind & Psychology',
  'Mente y Psicología': 'Mind & Psychology',
  'Geist und Psychologie': 'Mind & Psychology',
  'Kariyer ve Başarı': 'Career & Success',
  'Carrera y Éxito': 'Career & Success',
  'Karriere und Erfolg': 'Career & Success',
  'Bilim ve Gelecek': 'Science & Future',
  'Ciencia y Futuro': 'Science & Future',
  'Wissenschaft und Zukunft': 'Science & Future',
  'Toplum ve Dünya': 'Society & World',
  'Sociedad y Mundo': 'Society & World',
  'Gesellschaft und Welt': 'Society & World',
  'Sosyal Beceriler': 'Social Skills',
  'Habilidades Sociales': 'Social Skills',
  'Soziale Fähigkeiten': 'Social Skills',
  'Crecimiento Personal': 'Personal Growth',
  'Persönliches Wachstum': 'Personal Growth',
  'Kişisel Gelişim': 'Personal Growth',
};

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
export const normalizeCategoryKey = (catName) => PARENT_CATEGORY_ALIASES[catName] || catName;

export const getCategoryTheme = (catName, isDark = false) => {
  const normalizedKey = normalizeCategoryKey(catName);
  const palette = CATEGORY_THEME_MAP[normalizedKey] || CATEGORY_THEME_MAP.default;

  return {
    key: normalizedKey,
    accent: isDark ? (palette.darkAccent || palette.accent) : palette.accent,
    borderColor: isDark ? (palette.darkAccent || palette.accent) : palette.accent,
    backgroundColor: isDark ? palette.darkSoft : palette.lightSoft,
    strongBackgroundColor: isDark ? palette.darkStrong : palette.lightStrong,
  };
};

export const getCategoryImage = (catName, isDark = false) => {
  if (!catName) return { source: null, rotate: '0deg', flip: false, tint: 'transparent' };

  const normalizedKey = normalizeCategoryKey(catName);
  const source = PARENT_CATEGORY_IMAGE_MAP[normalizedKey] ?? categoryImageMap[normalizedKey] ?? null;
  const styleMap = isDark ? CAT_STYLES_DARK : CAT_STYLES;
  const style = styleMap[normalizedKey] || { rotate: '0deg', flip: false, tint: 'transparent' };

  return { source, ...style };
};

export const getCategoryPillIcon = (catName) => {
  if (!catName) return { source: PILL_ICON_ALL };

  const normalizedKey = normalizeCategoryKey(catName);
  const source = CATEGORY_PILL_ICON_MAP[normalizedKey] || CATEGORY_PILL_ICON_MAP[String(catName).toLowerCase()] || PILL_ICON_ALL;
  return { source };
};

export default getCategoryImage;

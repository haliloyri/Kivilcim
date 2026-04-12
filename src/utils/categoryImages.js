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
const IMG_DEFAULT = require('../../assets/categories/cat_default.png');

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
  'Tümü': IMG_DEFAULT,
  'All': IMG_DEFAULT,
  'Todo': IMG_DEFAULT,
  'Alle': IMG_DEFAULT,
};

/**
 * Returns the image source for a given category name.
 * Falls back to a default image if the category is not found.
 */
/**
 * Returns the image source and visual style for a given category name.
 * Handles both sub-categories and Parent Groups.
 */
export const getCategoryImage = (catName) => {
  if (!catName) return { source: IMG_DEFAULT, rotate: '0deg', flip: false, tint: 'transparent' };
  
  const source = categoryImageMap[catName] || IMG_DEFAULT;
  const style = CAT_STYLES[catName] || { rotate: '0deg', flip: false, tint: 'transparent' };

  return { source, ...style };
};

export default getCategoryImage;

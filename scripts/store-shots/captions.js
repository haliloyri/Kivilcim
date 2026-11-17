// App Store ekran görüntüsü başlıklarının biçim denetimi.
// CommonJS: hem Jest testi hem build.mjs (default import) kullanır.
const LANGS = ['tr', 'en', 'es', 'de'];
const FRAME_COUNT = 6;
const MAX_CHARS = 42;
const MAX_SUB_CHARS = 52;

function validateCaptions(captions) {
  const errors = [];
  for (const lang of LANGS) {
    const entry = captions && captions[lang];
    if (!entry) { errors.push(`${lang}: dil eksik`); continue; }
    const frames = Array.isArray(entry.frames) ? entry.frames : [];
    if (frames.length !== FRAME_COUNT) errors.push(`${lang}: ${FRAME_COUNT} başlık gerekli, ${frames.length} var`);
    frames.forEach((text, i) => {
      // *yıldız arası* vurgu işaretidir; uzunluğa sayılmaz, çift olmalıdır.
      const stars = typeof text === 'string' ? text.split('*').length - 1 : 0;
      if (stars % 2) errors.push(`${lang}: kare ${i + 1} başlığında kapanmamış * var`);
      const len = typeof text === 'string' ? [...text.replace(/\*/g, '')].length : 0;
      if (len < 1 || len > MAX_CHARS) errors.push(`${lang}: kare ${i + 1} başlığı ${len} karakter (1–${MAX_CHARS})`);
    });
    const subs = Array.isArray(entry.subs) ? entry.subs : [];
    if (subs.length !== FRAME_COUNT) errors.push(`${lang}: ${FRAME_COUNT} alt başlık gerekli, ${subs.length} var`);
    subs.forEach((text, i) => {
      const len = typeof text === 'string' ? [...text].length : 0;
      if (len < 1 || len > MAX_SUB_CHARS) errors.push(`${lang}: kare ${i + 1} alt başlığı ${len} karakter (1–${MAX_SUB_CHARS})`);
    });
    if (typeof entry.tagline !== 'string' || !entry.tagline.trim()) errors.push(`${lang}: tagline boş`);
    if (typeof entry.disclosure !== 'string' || !entry.disclosure.trim()) errors.push(`${lang}: disclosure boş`);
  }
  return errors;
}

module.exports = { validateCaptions, LANGS };

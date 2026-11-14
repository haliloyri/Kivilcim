// Shared label schema for offline story tagging (Öncelik 1: Reels skoru + tema etiketi).
// Single source of truth: export, model runner and evaluator all import from here.
import { resolve } from 'node:path';
import { ROOT } from '../story-pipeline/lib/store.mjs';

export const TAG_DIR = resolve(ROOT, 'staging/tagging');
export const SCHEMA_VERSION = 1;

// Reels scores, all integers 1-5.
export const SCORES = {
  fit_45s: {
    tr: '45 saniyeye sığar mı',
    rubric: [
      '1 = Ana fikir birden çok adım/kavram ister; 45 sn\'de anlam kaybolur.',
      '2 = Ancak ağır kırpmayla sığar; bağlam eksik kalır.',
      '3 = Tek ana fikir var ama giriş/bağlam 10-15 sn yer.',
      '4 = Tek fikir + tek örnek, küçük kırpmayla sığar.',
      '5 = Tek çarpıcı fikir; 30-45 sn\'de eksiksiz anlatılır.',
    ],
  },
  hook: {
    tr: 'Güçlü açılış kancası',
    rubric: [
      '1 = İlk 3 sn\'ye konacak merak/şaşırtma yok (tanım, genel giriş).',
      '2 = Konu ilginç ama açılış cümlesi düz.',
      '3 = Bir soru ya da karşıtlık var, yeniden yazınca işe yarar.',
      '4 = Şaşırtıcı iddia, rakam ya da sahne; neredeyse hazır.',
      '5 = İlk cümle tek başına kaydırmayı durdurur.',
    ],
  },
  visual: {
    tr: 'Görselleştirilebilir mi',
    rubric: [
      '1 = Tamamen soyut; ekranda sadece metin olur.',
      '2 = Soyut, bir benzetmeyle zorlanarak görselleşir.',
      '3 = Bir nesne/kişi/yer var ama hikâyenin merkezinde değil.',
      '4 = Somut sahne ya da deney; 2-3 planla anlatılır.',
      '5 = Hikâye bir sahne dizisi; sesi kapatsan da anlaşılır.',
    ],
  },
};
export const SCORE_KEYS = Object.keys(SCORES);
export const SCORE_MIN = 1;
export const SCORE_MAX = 5;

// Composite used to rank stories for the video pipeline. Computed by code, never labelled.
export const REELS_WEIGHTS = { hook: 0.4, visual: 0.3, fit_45s: 0.3 };
export const reelsScore = (row) =>
  Math.round(SCORE_KEYS.reduce((sum, k) => sum + REELS_WEIGHTS[k] * row[k], 0) * 100) / 100;

// Skill/theme taxonomy. Keys are stable ids (used by Yolum, home recommendations, search).
// One primary theme is required; up to MAX_SECONDARY secondary themes.
export const THEMES = {
  leadership: { tr: 'Liderlik', en: 'Leadership', hint: 'ekip yönetme, yetki devri, vizyon, kültür kurma', hint_en: 'leading teams, delegation, vision, culture' },
  communication: { tr: 'İletişim', en: 'Communication', hint: 'dinleme, anlatma, geri bildirim, zor konuşma', hint_en: 'listening, explaining, feedback, hard conversations' },
  influence: { tr: 'İkna ve müzakere', en: 'Influence & negotiation', hint: 'pazarlık, ikna, satış, etki', hint_en: 'negotiation, persuasion, selling' },
  relationships: { tr: 'İlişkiler ve empati', en: 'Relationships & empathy', hint: 'aile, partner, arkadaşlık, güven', hint_en: 'family, partner, friendship, trust' },
  decision_making: { tr: 'Karar verme', en: 'Decision making', hint: 'seçim, risk, önyargılar, olasılık', hint_en: 'choices, risk, biases, probability' },
  thinking: { tr: 'Düşünme ve zihinsel modeller', en: 'Thinking & mental models', hint: 'mantık, sistem düşüncesi, öğrenme', hint_en: 'logic, systems thinking, learning' },
  resilience: { tr: 'Direnç', en: 'Resilience', hint: 'zorluk, başarısızlık, toparlanma, cesaret', hint_en: 'hardship, failure, recovery, courage' },
  emotions: { tr: 'Duygular ve öz farkındalık', en: 'Emotions & self-awareness', hint: 'öfke, kaygı, stres, öz şefkat', hint_en: 'anger, anxiety, stress, self-compassion' },
  habits: { tr: 'Alışkanlık ve disiplin', en: 'Habits & discipline', hint: 'irade, rutin, davranış değişimi', hint_en: 'willpower, routines, behaviour change' },
  focus: { tr: 'Odak ve verimlilik', en: 'Focus & productivity', hint: 'derin çalışma, zaman, dikkat', hint_en: 'deep work, time, attention' },
  creativity: { tr: 'Yaratıcılık ve yenilik', en: 'Creativity & innovation', hint: 'fikir üretme, deneme, icat', hint_en: 'generating ideas, experiments, invention' },
  money_career: { tr: 'Para ve kariyer', en: 'Money & career', hint: 'finans, girişim, iş hayatı, strateji', hint_en: 'finance, startups, work life, strategy' },
  health: { tr: 'Sağlık ve beden', en: 'Health & body', hint: 'uyku, beslenme, beyin, egzersiz', hint_en: 'sleep, nutrition, brain, exercise' },
  meaning: { tr: 'Anlam ve değerler', en: 'Meaning & values', hint: 'amaç, felsefe, etik, mutluluk', hint_en: 'purpose, philosophy, ethics, happiness' },
};
export const THEME_KEYS = Object.keys(THEMES);
export const MAX_SECONDARY = 2;

/** Validates one label row ({fit_45s, hook, visual, primary_theme, secondary_themes[]}). Returns error strings. */
export function validateLabel(row) {
  const errors = [];
  for (const k of SCORE_KEYS) {
    if (!Number.isInteger(row[k]) || row[k] < SCORE_MIN || row[k] > SCORE_MAX) errors.push(`${k}=${row[k]} (1-5 olmalı)`);
  }
  if (!THEME_KEYS.includes(row.primary_theme)) errors.push(`primary_theme="${row.primary_theme}" bilinmiyor`);
  const sec = row.secondary_themes || [];
  if (sec.length > MAX_SECONDARY) errors.push(`en fazla ${MAX_SECONDARY} secondary_theme`);
  for (const t of sec) {
    if (!THEME_KEYS.includes(t)) errors.push(`secondary_theme="${t}" bilinmiyor`);
    if (t === row.primary_theme) errors.push(`secondary "${t}" primary ile aynı`);
  }
  return errors;
}

/** Normalises loose model/CSV output into a label row. */
export function normaliseLabel(raw) {
  const toInt = (v) => (v === '' || v == null ? NaN : Number.parseInt(String(v).trim(), 10));
  const secRaw = raw.secondary_themes ?? '';
  const sec = (Array.isArray(secRaw) ? secRaw : String(secRaw).split(/[;,|]/))
    .map((t) => String(t).trim().toLowerCase())
    .filter(Boolean);
  return {
    fit_45s: toInt(raw.fit_45s),
    hook: toInt(raw.hook),
    visual: toInt(raw.visual),
    primary_theme: String(raw.primary_theme ?? '').trim().toLowerCase(),
    secondary_themes: [...new Set(sec)],
  };
}

// Rough spoken-pace estimate (words per second) for the TTS voices; a hint for fit_45s, not a label.
export const WORDS_PER_SEC = { tr: 1.9, en: 2.4, es: 2.5, de: 2.1 };

// Laya (convaiinnovations/laya) is a decision model, not a chat model: it answers typed questions
// (`score` = ordinal levels, `choice` = one labelled option) with probabilities. Instructions and
// options are English and short on purpose: the option text shares a small token budget.
// The runner asks one question per forward pass so each question gets the whole budget.
export const LAYA_QUESTIONS = {
  fit_45s: {
    type: 'score',
    instructions: 'Can this story be told completely in a 45-second vertical video?',
    criteria: [
      'no, needs several steps or concepts',
      'only with heavy cuts, context lost',
      'one idea but long setup',
      'one idea and one example, small cuts',
      'yes, one striking idea, fits easily',
    ],
  },
  hook: {
    type: 'score',
    instructions: 'How strong is the opening hook for the first 3 seconds of a short video?',
    criteria: [
      'none, generic or definition opening',
      'interesting topic, flat opening',
      'a question or contrast, needs rewriting',
      'surprising claim, number or scene',
      'first sentence alone stops the scroll',
    ],
  },
  visual: {
    type: 'score',
    instructions: 'How easily can this story be shown with visuals instead of on-screen text?',
    criteria: [
      'fully abstract, text only',
      'abstract, forced metaphor',
      'an object or person, not central',
      'a concrete scene or experiment',
      'a sequence of scenes, clear without sound',
    ],
  },
  primary_theme: {
    type: 'choice',
    instructions: 'Which skill does the reader mainly build from this story?',
    criteria: Object.fromEntries(THEME_KEYS.map((k) => [k, `${THEMES[k].en}: ${THEMES[k].hint_en}`])),
  },
};

export function buildSystemPrompt() {
  const scoreBlock = SCORE_KEYS.map((k) => `### ${k} — ${SCORES[k].tr}\n${SCORES[k].rubric.join('\n')}`).join('\n\n');
  const themeBlock = THEME_KEYS.map((k) => `- ${k}: ${THEMES[k].tr} (${THEMES[k].hint})`).join('\n');
  return `Sen Albor uygulamasındaki kısa kitap hikâyelerini etiketleyen bir sınıflandırıcısın.
Her hikâye için 3 Reels skoru (1-5 tam sayı) ve tema etiketleri üret.

## Reels skorları
Hikâyeyi Instagram Reels / TikTok için 45 saniyelik dikey videoya dönüştüreceğimizi düşün.

${scoreBlock}

## Temalar
Okurun bu hikâyeden hangi beceriyi geliştireceğine göre seç. Kitabın kategorisine değil, hikâyenin dersine bak.
Tam olarak 1 primary_theme, 0-${MAX_SECONDARY} secondary_themes. Sadece bu anahtarları kullan:
${themeBlock}

## Çıktı
Sadece tek satır JSON döndür, açıklama yazma:
{"fit_45s":<1-5>,"hook":<1-5>,"visual":<1-5>,"primary_theme":"<anahtar>","secondary_themes":["<anahtar>"]}`;
}

export function buildUserPrompt(story) {
  return `Kitap: ${story.book_title} — ${story.author}
Başlık: ${story.title}
Kelime sayısı: ${story.words} (tahmini okuma ${story.est_sec} sn)
${story.opening_hook ? `Mevcut kanca: ${story.opening_hook}\n` : ''}
Metin:
${story.content}`;
}

/* ---------- CSV (semicolon by default so Turkish-locale Excel opens it in columns) ---------- */

export function toCsv(header, rows, sep = ';') {
  const esc = (v) => {
    const s = v == null ? '' : String(v);
    return /["\n\r;,]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return '﻿' + [header, ...rows.map((r) => header.map((h) => r[h]))].map((r) => r.map(esc).join(sep)).join('\n') + '\n';
}

export function parseCsv(text) {
  text = text.replace(/^﻿/, '');
  const firstLine = text.split(/\r?\n/, 1)[0];
  const sep = (firstLine.match(/;/g) || []).length >= (firstLine.match(/,/g) || []).length ? ';' : ',';
  const out = [];
  let row = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === sep) { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.some((f) => f !== '')) out.push(row);
      row = [];
    } else field += c;
  }
  if (field !== '' || row.length) { row.push(field); if (row.some((f) => f !== '')) out.push(row); }
  const [header, ...body] = out;
  return body.map((r) => Object.fromEntries(header.map((h, i) => [h.trim(), (r[i] ?? '').trim()])));
}

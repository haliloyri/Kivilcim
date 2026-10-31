// Single source of truth for P1 story length targets, banned phrases and the
// per-language prompt settings (2026-10-29).
//
// Imported by:
//   scripts/p1/validate.mjs          (word ranges, banned phrases, hard limits)
//   scripts/p1/score-models.mjs      (model comparison report)
//   scripts/p1/check-docs.mjs        (doc/prompt drift guard)
//   batch/05-submit-stories.mjs      ({LEN_*} prompt placeholders)
//   batch/08-export-agent-inputs.mjs (same placeholders, same values)
//
// RULE: never copy these numbers into a prompt or a markdown doc by hand.
// Use the placeholders and let check-docs.mjs fail when a copy drifts.

export const LANGS = ['en', 'tr', 'es', 'de'];

// Reading time: ~200 wpm, 3–5 minutes. Turkish is agglutinative, so the same
// story needs ~15% fewer words.
export const TOTAL = {
  en: [600, 1000],
  tr: [480, 800],
  es: [650, 1070],
  de: [580, 960],
};

// p1v2 = reading-page redesign (2026-10-28): EXACTLY ONE lesson + ONE question.
// These are the targets every NEW story must hit.
export const RANGES = {
  en: { open: [40, 80], story: [340, 520], lessons: [95, 140], reflect: [15, 30], use: [70, 150], pocket: [4, 20] },
  tr: { open: [32, 64], story: [270, 415], lessons: [70, 100], reflect: [15, 30], use: [56, 120], pocket: [3, 20] },
  es: { open: [43, 86], story: [365, 555], lessons: [100, 150], reflect: [15, 30], use: [75, 160], pocket: [4, 20] },
  de: { open: [38, 77], story: [325, 500], lessons: [90, 135], reflect: [15, 30], use: [67, 144], pocket: [4, 20] },
};

// legacy = entries written before the redesign (2–3 lessons, bulleted reflect).
// Only the two sections the redesign changed are listed here; validate.mjs
// picks the matching set per file, so the existing catalogue keeps passing.
export const LEGACY_RANGES = {
  en: { lessons: [100, 180], reflect: [40, 90], pocket: [4, 22] },
  tr: { lessons: [80, 145], reflect: [32, 72], pocket: [3, 18] },
  es: { lessons: [107, 193], reflect: [43, 96], pocket: [4, 24] },
  de: { lessons: [96, 173], reflect: [38, 86], pocket: [4, 22] },
};

// Hard story limits (error). Deliberately wide: a short anecdote told
// faithfully beats padding.
export const STORY_HARD = {
  en: [280, 700],
  tr: [230, 560],
  es: [300, 740],
  de: [270, 680],
};

// The story must carry the entry; everything after it is short.
export const STORY_SHARE = 0.55;

// A lesson is 3–4 full sentences (principle, everyday example, what it enables).
export const LESSON_SENTENCES = [3, 4];

// Rhythm budget: every story paragraph needs one long and one short sentence.
// score-models.mjs measures it; the prompt states it as {VOICE_LONG}/{VOICE_SHORT}.
export const VOICE = { longMin: 18, shortMax: 8 };

// Turkish: at most two semicolons in the whole entry (see story-instructions).
export const SEMICOLON_MAX = 2;

// Phrases that make text read as machine-written or padded. Case-insensitive.
export const BANNED = {
  en: [
    'delve', 'tapestry', "in today's fast-paced world", 'in today’s fast-paced world', 'it is important to note',
    "it's important to note", 'it’s important to note', 'in conclusion', 'navigate the complexities', 'a testament to',
    'unlock the power', 'embark on a journey', 'let that sink in', 'game-changer', 'at the end of the day',
    'not a mechanical recipe', 'a single case does not prove',
  ],
  tr: [
    'günümüz dünyasında', 'unutmayın ki', 'unutmamak gerekir', 'sonuç olarak', 'mekanik bir reçete',
    'tek bir karakter özelliğiyle', 'tek bir kişilik özelliğiyle', 'kahramanı taklit etmek',
  ],
  es: ['en el mundo actual', 'en conclusión', 'es importante destacar', 'cabe destacar', 'sumergirnos'],
  de: ['in der heutigen schnelllebigen welt', 'zusammenfassend lässt sich sagen', 'es ist wichtig zu beachten', 'eintauchen'],
};

// Announcer-style transitions and story-internal bookkeeping. Warning only for
// legacy entries, error for p1v2 (the redesign moved examples into the lesson).
export const SOFT_BANNED = {
  en: ['here is the catch', "here's the catch", 'then something striking happened', 'what happened next surprised'],
  tr: [],
  es: [],
  de: [],
};

// Talking about the writing instead of telling the story ("let's look at an
// example", "this example is not from the book"). In p1v2 this is an error in
// [[story]]: illustrations belong in the lesson.
export const META_IN_STORY = {
  en: ["let's look at an example", 'let us look at an example', 'this example is not from the book', 'for example, imagine'],
  tr: ['bir örnekle görelim', 'bir örneğe bakalım', 'bu örnek kitapta geçmez', 'örneğin şunu düşünün'],
  es: ['veamos un ejemplo', 'este ejemplo no aparece en el libro'],
  de: ['sehen wir uns ein beispiel an', 'dieses beispiel steht nicht im buch'],
};

// Prompt-facing settings. `len` strings are what {LEN_*} placeholders expand to.
export const LEN = ([min, max]) => `${min}–${max}`;

export const LANG_CONFIG = Object.fromEntries(LANGS.map((lang) => {
  const address = { en: '"you"', tr: '"siz"', es: '"tú"', de: '"du"' }[lang];
  const name = {
    en: 'English',
    tr: 'Turkish',
    es: 'Spanish (neutral, avoid regional slang)',
    de: 'German',
  }[lang];
  return [lang, {
    name,
    address,
    banned: BANNED[lang],
    voice: { long: VOICE.longMin, short: VOICE.shortMax },
    len: {
      open: LEN(RANGES[lang].open),
      story: LEN(RANGES[lang].story),
      lessons: LEN(RANGES[lang].lessons),
      reflect: LEN(RANGES[lang].reflect),
      use: LEN(RANGES[lang].use),
      total: LEN(TOTAL[lang]),
    },
  }];
}));

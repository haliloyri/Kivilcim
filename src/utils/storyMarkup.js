/**
 * storyMarkup.js — single source of truth for story body markup.
 *
 * Two formats are supported:
 *
 * 1. Legacy (versions 1, 2, A2, F5-F7, C1-C2, OH): paired inline markers
 *      ##highlight##  $$lesson$$  &&reflection&&  ~~before :: after~~
 *
 * 2. P1 ("podcast" format, see HIKAYE_DONUSUM_PLANI.md §3). Detected from the
 *    content itself (a `[[story]]`-style section tag on its own line), so a
 *    story can be P1 in one language and legacy in another.
 *
 *    Section tags (own line):  [[open]] [[story]] [[lessons]] [[reflect]] [[use]] [[pocket]]
 *    Blocks:
 *      $$**Title.** body$$            lesson card (numbered inside [[lessons]])
 *      &&question&&                   reflection prompt
 *      ##sentence##                   highlighted moment
 *      ~~before :: after~~            contrast
 *      %%Situation :: "line"%%        use-case card
 *      @@sentence@@                   pocket card
 *      - text                         bullet
 *      > text                         quoted line / dialogue
 *    Inline:
 *      **bold**   *italic*
 *
 * Every consumer (reader, TTS, text share, share card, use-in-conversation)
 * must go through this module so the markers never leak onto the screen.
 */

export const SECTION_KEYS = Object.freeze(['open', 'story', 'lessons', 'reflect', 'use', 'pocket']);

const SECTION_TAG_RE = /^\s*\[\[(open|story|lessons|reflect|use|pocket)\]\]\s*$/;
const P1_DETECT_RE = /^\s*\[\[(open|story|lessons|reflect|use|pocket)\]\]\s*$/m;

// Order matters only for documentation; detection is by line prefix.
const BLOCK_MARKERS = Object.freeze({
  '##': 'highlight',
  '$$': 'lesson',
  '&&': 'reflection',
  '~~': 'contrast',
  '%%': 'usecase',
  '@@': 'pocket',
});

const LEGACY_MARKERS = [
  { marker: '##', type: 'highlight' },
  { marker: '$$', type: 'lesson' },
  { marker: '&&', type: 'reflection' },
  { marker: '~~', type: 'contrast' },
];

const normalizeNewlines = (text) => String(text || '').replace(/\r\n?/g, '\n');

/** True when the body uses the P1 section format. */
export const isP1Content = (text) => P1_DETECT_RE.test(normalizeNewlines(text));

// ─── inline ────────────────────────────────────────────────────────────────

/**
 * Split a string into styled runs: **bold** and *italic*.
 * Unmatched markers are kept as literal text.
 * @returns {{text: string, bold: boolean, italic: boolean}[]}
 */
const findSingleStar = (src, from) => {
  for (let k = from; k < src.length; k += 1) {
    if (src[k] === '*' && src[k + 1] !== '*' && src[k - 1] !== '*') return k;
  }
  return -1;
};

export const parseInline = (text, base = { bold: false, italic: false }) => {
  const src = String(text || '');
  const runs = [];
  let i = 0;
  let buf = '';
  const flush = () => { if (buf) { runs.push({ text: buf, ...base }); buf = ''; } };
  while (i < src.length) {
    if (!base.bold && src.startsWith('**', i)) {
      const close = src.indexOf('**', i + 2);
      if (close > i + 2) {
        flush();
        runs.push(...parseInline(src.substring(i + 2, close), { ...base, bold: true }));
        i = close + 2;
        continue;
      }
    } else if (!base.italic && src[i] === '*' && src[i + 1] !== '*' && src[i + 1] && src[i + 1] !== ' ') {
      const close = findSingleStar(src, i + 1);
      if (close > i + 1 && src[close - 1] !== ' ') {
        flush();
        runs.push(...parseInline(src.substring(i + 1, close), { ...base, italic: true }));
        i = close + 1;
        continue;
      }
    }
    buf += src[i];
    i += 1;
  }
  flush();
  return runs;
};

/** Remove inline markup (bold/italic) and return plain text. */
export const stripInline = (text) => parseInline(text).map((r) => r.text).join('');

const stripWrappingQuotes = (text) =>
  String(text || '').trim().replace(/^["“”„«»']+/, '').replace(/["“”„«»']+$/, '').trim();

// ─── block helpers ─────────────────────────────────────────────────────────

/** "**Title.** body" → { title, body } (title may be empty). */
export const splitLesson = (content) => {
  const src = String(content || '').trim();
  if (src.startsWith('**')) {
    const close = src.indexOf('**', 2);
    if (close > 2) {
      return {
        title: src.substring(2, close).trim(),
        body: src.substring(close + 2).trim(),
      };
    }
  }
  return { title: '', body: src };
};

/** Contexts a use-case card can be tagged with (matches UseInConversationScreen). */
export const USE_CASE_CONTEXTS = Object.freeze(['meeting', 'oneonone', 'family', 'social', 'self']);

/**
 * "context:meeting | Situation :: \"line\"" → { context, label, line }
 * The "context:<slug> | " prefix is optional so older content without it
 * still parses (context comes back as '').
 */
export const splitUseCase = (content) => {
  const src = String(content || '');
  let context = '';
  let rest = src;
  const ctxMatch = /^\s*context:([a-z0-9]+)\s*\|\s*/i.exec(src);
  if (ctxMatch) {
    context = ctxMatch[1].toLowerCase();
    rest = src.slice(ctxMatch[0].length);
  }
  const idx = rest.indexOf('::');
  if (idx === -1) return { context, label: '', line: stripWrappingQuotes(rest) };
  return {
    context,
    label: rest.substring(0, idx).trim(),
    line: stripWrappingQuotes(rest.substring(idx + 2)),
  };
};

/** "before :: after" → { before, after } or null. */
export const splitContrast = (content) => {
  const parts = String(content || '').split('::').map((s) => s.trim());
  if (parts.length < 2 || !parts[0] || !parts[1]) return null;
  return { before: parts[0], after: parts.slice(1).join(' :: ') };
};

// ─── legacy parser (behaviour identical to the pre-P1 reader) ──────────────

const parseLegacy = (text) => {
  const rawBody = normalizeNewlines(text).replace(/\n{3,}/g, '\n\n');
  const segments = [];
  let remaining = rawBody;

  while (remaining.length > 0) {
    let nearest = null;
    for (const m of LEGACY_MARKERS) {
      const openIdx = remaining.indexOf(m.marker);
      if (openIdx !== -1 && (!nearest || openIdx < nearest.open)) {
        const closeIdx = remaining.indexOf(m.marker, openIdx + m.marker.length);
        if (closeIdx !== -1) nearest = { ...m, open: openIdx, close: closeIdx };
      }
    }

    if (!nearest) {
      if (remaining.trim()) segments.push({ type: 'text', content: remaining.trim().replace(/\n{2,}/g, '\n\n') });
      break;
    }

    const before = remaining.substring(0, nearest.open);
    if (before.trim()) segments.push({ type: 'text', content: before.trim().replace(/\n{2,}/g, '\n\n') });

    const content = remaining.substring(nearest.open + nearest.marker.length, nearest.close).trim();
    segments.push({ type: nearest.type, content });
    remaining = remaining.substring(nearest.close + nearest.marker.length);
  }
  return segments;
};

// ─── P1 parser ─────────────────────────────────────────────────────────────

const blockMarkerAt = (line) => {
  const trimmed = line.trimStart();
  const key = trimmed.substring(0, 2);
  return BLOCK_MARKERS[key] ? key : null;
};

const parseP1 = (text) => {
  const lines = normalizeNewlines(text).split('\n');
  const segments = [];
  let section = null;
  let paragraph = [];
  let lessonIndex = 0;

  const flushParagraph = () => {
    const joined = paragraph.join('\n').trim();
    if (joined) segments.push({ type: 'text', section, content: joined });
    paragraph = [];
  };

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) { flushParagraph(); continue; }

    const tag = SECTION_TAG_RE.exec(line);
    if (tag) {
      flushParagraph();
      section = tag[1];
      segments.push({ type: 'section', section, content: '' });
      continue;
    }

    const marker = blockMarkerAt(line);
    if (marker) {
      // Collect until the closing marker (may span lines).
      let acc = trimmed.substring(2);
      let closeIdx = acc.indexOf(marker);
      let j = i;
      while (closeIdx === -1 && j + 1 < lines.length) {
        j += 1;
        acc += `\n${lines[j]}`;
        closeIdx = acc.indexOf(marker);
      }
      if (closeIdx !== -1) {
        flushParagraph();
        const type = BLOCK_MARKERS[marker];
        const content = acc.substring(0, closeIdx).trim();
        const seg = { type, section, content };
        if (type === 'lesson') {
          lessonIndex += 1;
          Object.assign(seg, splitLesson(content), { index: lessonIndex });
        } else if (type === 'usecase') {
          Object.assign(seg, splitUseCase(content));
        } else if (type === 'contrast') {
          const c = splitContrast(content);
          if (!c) { i = j; continue; }
          Object.assign(seg, c);
        }
        segments.push(seg);
        // Text after the closing marker on the same line becomes a paragraph.
        const tail = acc.substring(closeIdx + 2).trim();
        if (tail) paragraph.push(tail);
        i = j;
        continue;
      }
      // Unclosed marker: fall through and treat the line as plain text.
    }

    if (/^\s*[-•]\s+/.test(line)) {
      flushParagraph();
      segments.push({ type: 'bullet', section, content: trimmed.replace(/^[-•]\s+/, '') });
      continue;
    }

    if (/^\s*>\s?/.test(line)) {
      flushParagraph();
      segments.push({ type: 'quote', section, content: trimmed.replace(/^>\s?/, '') });
      continue;
    }

    paragraph.push(trimmed);
  }
  flushParagraph();
  return segments;
};

// ─── public API ────────────────────────────────────────────────────────────

/**
 * Parse a story body into render segments.
 * @param {string} text
 * @returns {{format: 'p1'|'legacy', segments: object[]}}
 */
export const parseStoryMarkup = (text) => {
  if (isP1Content(text)) return { format: 'p1', segments: parseP1(text) };
  return { format: 'legacy', segments: parseLegacy(text) };
};

/**
 * Plain text for TTS and text sharing.
 * @param {string} text
 * @param {{headings?: Record<string,string>}} [opts] optional section headings to speak/print
 */
export const toPlainText = (text, { headings } = {}) => {
  const { format, segments } = parseStoryMarkup(text);
  if (format === 'legacy') {
    return normalizeNewlines(text)
      .replace(/##|\$\$|&&|~~/g, '')
      .replace(/\s*::\s*/g, ' — ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }
  const out = [];
  segments.forEach((seg) => {
    switch (seg.type) {
      case 'section':
        if (headings && headings[seg.section]) out.push(headings[seg.section]);
        break;
      case 'lesson':
        out.push([seg.title, stripInline(seg.body)].filter(Boolean).join(' '));
        break;
      case 'usecase':
        out.push([seg.label, seg.line ? `“${seg.line}”` : ''].filter(Boolean).join(': '));
        break;
      case 'contrast':
        out.push(`${seg.before} — ${seg.after}`);
        break;
      case 'bullet':
        out.push(`• ${stripInline(seg.content)}`);
        break;
      default:
        out.push(stripInline(seg.content));
    }
  });
  return out.filter((s) => s && s.trim()).join('\n\n').trim();
};

/** Plain text of the narrative only ([[story]] for P1, unmarked text for legacy). */
export const getNarrativeText = (text) => {
  const { format, segments } = parseStoryMarkup(text);
  if (format === 'legacy') {
    return normalizeNewlines(text)
      .replace(/##[\s\S]*?##/g, '')
      .replace(/\$\$[\s\S]*?\$\$/g, '')
      .replace(/&&[\s\S]*?&&/g, '')
      .replace(/~~[\s\S]*?~~/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }
  return segments
    .filter((s) => s.section === 'story' && (s.type === 'text' || s.type === 'quote'))
    .map((s) => stripInline(s.content))
    .join('\n\n')
    .trim();
};

/**
 * Pieces used by share cards and the "use in conversation" screen.
 * @returns {{quote: string, lesson: string, reflection: string, pocket: string, highlight: string}}
 */
export const extractShareParts = (text) => {
  const { segments } = parseStoryMarkup(text);
  const first = (type) => segments.find((s) => s.type === type);
  const lessonSeg = first('lesson');
  const pocket = first('pocket')?.content || '';
  const highlight = first('highlight')?.content || '';
  let lesson = '';
  if (lessonSeg) {
    lesson = lessonSeg.title !== undefined
      ? (lessonSeg.title || stripInline(lessonSeg.body))
      : stripInline(lessonSeg.content);
  }
  return {
    quote: stripInline(pocket || highlight),
    highlight: stripInline(highlight),
    pocket: stripInline(pocket),
    lesson,
    reflection: stripInline(first('reflection')?.content || ''),
  };
};

/** Word count of the rendered plain text (used for read-time metadata). */
export const countWords = (text) => {
  const plain = toPlainText(text);
  return plain ? plain.split(/\s+/).filter(Boolean).length : 0;
};

import {
  parseStoryMarkup,
  parseInline,
  isP1Content,
  toPlainText,
  getNarrativeText,
  extractShareParts,
  splitLesson,
  splitUseCase,
  countWords,
} from '../storyMarkup';

const P1_SAMPLE = [
  '[[open]]',
  'Think of someone who **annoyed you** this week.',
  '',
  '[[story]]',
  'It is a Sunday morning on the New York subway.',
  'People read quietly.',
  '> Oh, you’re right. We just came from the hospital.',
  '##The children were still yelling.##',
  '',
  '[[lessons]]',
  '$$**We see through a lens.** Covey looked at the same kids.$$',
  '$$**Nobody asked.**',
  'Everyone wrote the same story.$$',
  '',
  '[[reflect]]',
  'Go back to that person.',
  '- What story did you write about them?',
  '- How much of it do you actually know?',
  '&&Have you ever been the father on that train?&&',
  '',
  '[[use]]',
  '%%context:meeting | In a meeting, when a deadline slips :: "Before we judge, let’s talk."%%',
  '%%context:oneonone | In a one-on-one :: “Is everything okay?”%%',
  '',
  '[[pocket]]',
  '@@The kids didn’t change. Covey’s lens did.@@',
].join('\n');

describe('parseInline', () => {
  it('splits bold runs', () => {
    expect(parseInline('a **b** c')).toEqual([
      { text: 'a ', bold: false, italic: false },
      { text: 'b', bold: true, italic: false },
      { text: ' c', bold: false, italic: false },
    ]);
  });
  it('keeps an unmatched ** literally', () => {
    expect(parseInline('a ** b')).toEqual([{ text: 'a ** b', bold: false, italic: false }]);
  });
  it('parses italic and italic inside bold', () => {
    expect(parseInline('see *The Book* now')).toEqual([
      { text: 'see ', bold: false, italic: false },
      { text: 'The Book', bold: false, italic: true },
      { text: ' now', bold: false, italic: false },
    ]);
    expect(parseInline('**not *how* but why**').map((r) => [r.text, r.bold, r.italic])).toEqual([
      ['not ', true, false], ['how', true, true], [' but why', true, false],
    ]);
  });
  it('does not treat a lone asterisk or multiplication as italic', () => {
    expect(parseInline('2 * 3 = 6')).toEqual([{ text: '2 * 3 = 6', bold: false, italic: false }]);
  });
});

describe('format detection', () => {
  it('detects P1 by section tag', () => {
    expect(isP1Content(P1_SAMPLE)).toBe(true);
    expect(isP1Content('plain ##quote## text')).toBe(false);
    expect(isP1Content('inline [[story]] mention')).toBe(false);
  });
});

describe('legacy parsing', () => {
  it('matches the previous reader segments', () => {
    const body = 'Intro text.\n\n##Punch##\n\n$$Lesson$$\n\n&&Question?&&\n\n~~a :: b~~';
    const { format, segments } = parseStoryMarkup(body);
    expect(format).toBe('legacy');
    expect(segments.map((s) => s.type)).toEqual(['text', 'highlight', 'lesson', 'reflection', 'contrast']);
    expect(segments[1].content).toBe('Punch');
    expect(segments[4].content).toBe('a :: b');
  });
  it('plain text strips markers like the old TTS cleaner', () => {
    expect(toPlainText('A ##B## ~~c :: d~~')).toBe('A B c — d');
  });
});

describe('P1 parsing', () => {
  const { format, segments } = parseStoryMarkup(P1_SAMPLE);

  it('is P1', () => expect(format).toBe('p1'));

  it('emits sections in order', () => {
    expect(segments.filter((s) => s.type === 'section').map((s) => s.section))
      .toEqual(['open', 'story', 'lessons', 'reflect', 'use', 'pocket']);
  });

  it('joins consecutive plain lines into one paragraph', () => {
    const storyText = segments.filter((s) => s.section === 'story' && s.type === 'text');
    expect(storyText).toHaveLength(1);
    expect(storyText[0].content).toBe('It is a Sunday morning on the New York subway.\nPeople read quietly.');
  });

  it('parses quote and highlight lines', () => {
    expect(segments.find((s) => s.type === 'quote').content).toBe('Oh, you’re right. We just came from the hospital.');
    expect(segments.find((s) => s.type === 'highlight').content).toBe('The children were still yelling.');
  });

  it('numbers lessons and splits title/body, including multi-line blocks', () => {
    const lessons = segments.filter((s) => s.type === 'lesson');
    expect(lessons).toHaveLength(2);
    expect(lessons[0]).toMatchObject({ index: 1, title: 'We see through a lens.', body: 'Covey looked at the same kids.' });
    expect(lessons[1]).toMatchObject({ index: 2, title: 'Nobody asked.', body: 'Everyone wrote the same story.' });
  });

  it('parses bullets, reflection, use cases and pocket', () => {
    expect(segments.filter((s) => s.type === 'bullet')).toHaveLength(2);
    expect(segments.find((s) => s.type === 'reflection').content).toBe('Have you ever been the father on that train?');
    const uses = segments.filter((s) => s.type === 'usecase');
    expect(uses[0]).toMatchObject({ context: 'meeting', label: 'In a meeting, when a deadline slips', line: 'Before we judge, let’s talk.' });
    expect(uses[1]).toMatchObject({ context: 'oneonone', line: 'Is everything okay?' });
    expect(segments.find((s) => s.type === 'pocket')).toMatchObject({ section: 'pocket', content: 'The kids didn’t change. Covey’s lens did.' });
  });

  it('never leaks markers into plain text', () => {
    const plain = toPlainText(P1_SAMPLE);
    expect(plain).not.toMatch(/\[\[|\]\]|\$\$|&&|##|%%|@@|~~|\*/);
    expect(plain).toContain('annoyed you');
  });

  it('can include spoken headings', () => {
    const plain = toPlainText(P1_SAMPLE, { headings: { lessons: 'What we learn' } });
    expect(plain).toContain('What we learn');
  });

  it('narrative text is the story section only', () => {
    const narrative = getNarrativeText(P1_SAMPLE);
    expect(narrative).toContain('Sunday morning');
    expect(narrative).not.toContain('annoyed');
    expect(narrative).not.toContain('Nobody asked');
  });

  it('share parts prefer the pocket line as the quote', () => {
    expect(extractShareParts(P1_SAMPLE)).toMatchObject({
      quote: 'The kids didn’t change. Covey’s lens did.',
      lesson: 'We see through a lens.',
      reflection: 'Have you ever been the father on that train?',
    });
  });

  it('treats an unclosed marker as plain text', () => {
    const { segments: s } = parseStoryMarkup('[[story]]\n@@never closed');
    expect(s.find((x) => x.type === 'text').content).toBe('@@never closed');
  });

  it('counts words', () => {
    expect(countWords(P1_SAMPLE)).toBeGreaterThan(50);
  });
});

describe('helpers', () => {
  it('splitLesson without a bold title', () => {
    expect(splitLesson('just body')).toEqual({ title: '', body: 'just body' });
  });
  it('splitUseCase without separator', () => {
    expect(splitUseCase('"only line"')).toEqual({ context: '', label: '', line: 'only line' });
  });
  it('splitUseCase parses the context: prefix', () => {
    expect(splitUseCase('context:meeting | In a meeting :: "Say this."')).toEqual({
      context: 'meeting',
      label: 'In a meeting',
      line: 'Say this.',
    });
  });
  it('splitUseCase without a context: prefix still works (legacy P1 content)', () => {
    expect(splitUseCase('In a meeting :: "Say this."')).toEqual({
      context: '',
      label: 'In a meeting',
      line: 'Say this.',
    });
  });
});

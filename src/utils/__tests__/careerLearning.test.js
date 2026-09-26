import { buildLearningSummary } from '../careerLearning';

const stories = [
  { story_id: '1', title: 'A', source_book_id: 10, source_book: 'Book X', min: 3, parent_cat: 'Psikoloji', parent_cat_raw: 'Psychology' },
  { story_id: '2', title: 'B', source_book_id: 10, source_book: 'Book X', min: 2, parent_cat: 'Psikoloji', parent_cat_raw: 'Psychology' },
  { story_id: '3', title: 'C', source_book_id: 11, source_book: 'Book Y', min: 4, parent_cat: 'Finans', parent_cat_raw: 'Finance' },
];
const h = (storyId, occurredAt, localDay) => ({ creditType: 'H', storyId, occurredAt, localDay });

describe('learning summary', () => {
  it('counts ideas, books, minutes and the strongest area from completed stories', () => {
    const summary = buildLearningSummary({
      stories,
      now: new Date('2026-09-24T12:00:00'),
      events: [
        h('1', '2026-09-10T08:00:00.000Z', '2026-09-10'),
        h('1', '2026-09-11T08:00:00.000Z', '2026-09-11'),
        h('2', '2026-09-22T08:00:00.000Z', '2026-09-22'),
        h('3', '2026-09-24T08:00:00.000Z', '2026-09-24'),
        { creditType: 'D', storyId: '3', occurredAt: '2026-09-24T09:00:00.000Z', localDay: '2026-09-24' },
      ],
    });
    expect(summary).toMatchObject({ ideas: 3, books: 2, minutes: 9 });
    expect(summary.strongest).toMatchObject({ name: 'Psikoloji', count: 2 });
    expect(summary.recent.map((item) => item.title)).toEqual(['C', 'B', 'A']);
    expect(summary.nextBookMilestone).toEqual({ target: 5, remaining: 3 });
    expect(summary.week).toEqual({ stories: 2, minutes: 6, books: 2 });
  });

  it('returns an empty-but-safe summary for a new reader', () => {
    const summary = buildLearningSummary({ stories, events: [] });
    expect(summary).toMatchObject({ ideas: 0, books: 0, minutes: 0, strongest: null, recent: [] });
  });
});

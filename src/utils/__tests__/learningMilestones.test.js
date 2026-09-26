import { getReachedMilestoneIds, nextMilestoneState, pickMilestoneCelebration } from '../learningMilestones';

const summary = (books, ideas, cats) => ({ books, ideas, allCategories: cats.map((name) => ({ name, rawName: name, count: 1 })) });

describe('learning milestones', () => {
  it('records a silent baseline on first run', () => {
    const { state, newIds } = nextMilestoneState(null, summary(12, 30, ['Psychology', 'Finance']));
    expect(newIds).toEqual([]);
    expect(state.seen).toEqual(['books_5', 'books_10', 'cat_psychology', 'cat_finance']);
  });

  it('celebrates the biggest new book milestone first', () => {
    const stored = { initialized: true, seen: ['books_5', 'cat_psychology'] };
    const s = summary(10, 14, ['Psychology', 'Philosophy']);
    const { newIds } = nextMilestoneState(stored, s);
    expect(newIds).toEqual(['books_10', 'cat_philosophy']);
    expect(pickMilestoneCelebration(newIds, s)).toMatchObject({ type: 'books', count: 10 });
    expect(pickMilestoneCelebration(['cat_philosophy'], s)).toMatchObject({ type: 'category', category: 'Philosophy' });
  });

  it('never celebrates the very first category', () => {
    expect(pickMilestoneCelebration(['cat_psychology'], summary(1, 1, ['Psychology']))).toBeNull();
    expect(getReachedMilestoneIds(null)).toEqual([]);
  });
});

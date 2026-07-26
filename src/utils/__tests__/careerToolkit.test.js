import { selectWeeklyRoute } from '../careerToolkit';

const stories = [
  { story_id: '1', parent_cat_id: 10 },
  { story_id: '2', parent_cat_id: 10 },
  { story_id: '3', parent_cat_id: 20 },
  { story_id: '4', parent_cat_id: 30 },
  { story_id: '5', parent_cat_id: 40 },
];

describe('selectWeeklyRoute', () => {
  it('is deterministic for the same week and keeps categories unique', () => {
    const date = new Date(2026, 6, 25);
    const first = selectWeeklyRoute({ stories, isPremium: true, date });
    const second = selectWeeklyRoute({ stories, isPremium: true, date });

    expect(first.map((story) => story.story_id)).toEqual(second.map((story) => story.story_id));
    expect(new Set(first.map((story) => story.parent_cat_id)).size).toBe(first.length);
  });

  it('never returns a story outside the free three-category subset', () => {
    const route = selectWeeklyRoute({ stories, isPremium: false, date: new Date(2026, 6, 25) });

    expect(route.map((story) => story.story_id).sort()).toEqual(['1', '3', '4']);
  });
});

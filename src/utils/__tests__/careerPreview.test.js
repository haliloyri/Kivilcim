import { buildCareerPreview, CAREER_PREVIEW_SCENARIOS } from '../careerPreview';

describe('career display previews', () => {
  it('provides the five fixed display scenarios without career events', () => {
    expect(CAREER_PREVIEW_SCENARIOS.map((scenario) => scenario.id)).toEqual([
      'new_user', 'common_progress', 'path_selection', 'active_path', 'final_rank',
    ]);
    CAREER_PREVIEW_SCENARIOS.forEach((scenario) => {
      const preview = buildCareerPreview(scenario.id);
      expect(preview.rawEventCount).toBe(0);
      expect(preview.creditedEventIds).toEqual([]);
    });
  });

  it('does not mutate a preview when a second scenario is built', () => {
    const before = buildCareerPreview('new_user');
    const active = buildCareerPreview('active_path');
    expect(before.metrics.stories).toBe(0);
    expect(active.activePath).toBe('depth');
    expect(buildCareerPreview('new_user').metrics.stories).toBe(0);
  });
});

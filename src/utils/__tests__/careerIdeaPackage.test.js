import { IDEA_PACKAGE_LIMIT, updateCareerIdeaPackage } from '../careerIdeaPackage';

describe('updateCareerIdeaPackage', () => {
  it('adds and removes a story without mutating the current selection', () => {
    const added = updateCareerIdeaPackage(['1', '2'], '3');
    const removed = updateCareerIdeaPackage(added.package, '2');

    expect(added).toEqual({ changed: true, selected: true, package: ['1', '2', '3'] });
    expect(removed).toEqual({ changed: true, selected: false, package: ['1', '3'] });
  });

  it('preserves the five-story cap and rejects malformed ids', () => {
    const full = Array.from({ length: IDEA_PACKAGE_LIMIT }, (_, index) => String(index + 1));

    expect(updateCareerIdeaPackage(full, '6')).toEqual({ changed: false, reason: 'limit_reached', package: full });
    expect(updateCareerIdeaPackage([], '  ')).toEqual({ changed: false, reason: 'invalid_story', package: [] });
  });
});

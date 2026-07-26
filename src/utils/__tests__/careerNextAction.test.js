import { buildCareerViewModel } from '../careerProgress';
import { CAREER_SCENARIOS } from '../../fixtures/careerScenarios';

describe('career next action', () => {
  it('prioritizes an application requirement', () => {
    const viewModel = buildCareerViewModel(CAREER_SCENARIOS.oneRequirementMissing);
    expect(viewModel.nextAction).toMatchObject({
      type: 'advance',
      targetNodeId: 'exploration_route_seeker',
      missingRequirement: 'applications',
    });
  });

  it('returns path_complete for an earned capstone', () => {
    const viewModel = buildCareerViewModel(CAREER_SCENARIOS.completedPath);
    expect(viewModel.nextAction.type).toBe('path_complete');
    expect(viewModel.completedPathIds).toEqual(['exploration']);
  });
});

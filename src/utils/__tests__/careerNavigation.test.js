import { resolveCareerActionDestination } from '../careerNavigation';

describe('resolveCareerActionDestination', () => {
  it('keeps the daily reading path as the primary route before completion', () => {
    expect(resolveCareerActionDestination({ nextAction: { type: 'advance' }, dailyComplete: false })).toEqual({ route: 'HomeTab' });
  });

  it('uses the same destinations for Home and Yolum career actions', () => {
    expect(resolveCareerActionDestination({ nextAction: { type: 'choose_path' } })).toEqual({ route: 'CareerPathSelection' });
    expect(resolveCareerActionDestination({ nextAction: { type: 'advance' } })).toEqual({ route: 'ProgressTab' });
    expect(resolveCareerActionDestination({ nextAction: { type: 'today_complete' } })).toEqual({ route: 'ProgressTab' });
    expect(resolveCareerActionDestination({ nextAction: { type: 'path_complete' } })).toEqual({ route: 'ProgressTab' });
  });
});

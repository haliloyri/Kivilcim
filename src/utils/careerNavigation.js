export const resolveCareerActionDestination = ({ nextAction, dailyComplete = true } = {}) => {
  if (!dailyComplete) return { route: 'HomeTab' };
  if (nextAction?.type === 'choose_path') return { route: 'CareerPathSelection' };
  if (nextAction?.type === 'today_complete' || nextAction?.type === 'path_complete') return { route: 'ProgressTab' };
  // Each missing condition has one clear, reachable place to continue. The
  // destination intentionally stays in this shared utility so Home and Yolum
  // cannot disagree about what the primary action does.
  if (nextAction?.missingRequirement === 'applications') return { route: 'Search', params: { careerAction: 'application' } };
  if (nextAction?.missingRequirement === 'deepInteractions') return { route: 'Search', params: { careerAction: 'connection' } };
  if (nextAction?.missingRequirement === 'categories') return { route: 'Search', params: { careerAction: 'category' } };
  if (nextAction?.missingRequirement === 'stories') return { route: 'HomeTab', params: { careerAction: 'story' } };
  return { route: 'ProgressTab' };
};

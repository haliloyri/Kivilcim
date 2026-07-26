export const resolveCareerActionDestination = ({ nextAction, dailyComplete = true } = {}) => {
  if (!dailyComplete) return { route: 'HomeTab' };
  if (nextAction?.type === 'choose_path') return { route: 'CareerPathSelection' };
  if (nextAction?.type === 'today_complete' || nextAction?.type === 'path_complete') return { route: 'ProgressTab' };
  return { route: 'ProgressTab' };
};

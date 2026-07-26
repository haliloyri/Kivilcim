const ACTION_KEYS = {
  choose_path: ['careerAction.choosePath.title', 'careerAction.choosePath.body', 'careerAction.choosePath.cta'],
  path_complete: ['careerAction.pathComplete.title', 'careerAction.pathComplete.body', 'careerAction.pathComplete.cta'],
  today_complete: ['careerAction.todayComplete.title', 'careerAction.todayComplete.body', 'careerAction.todayComplete.cta'],
};

const missingPriority = ['applications', 'deepInteractions', 'categories', 'stories', 'activeDays'];

const makeAction = (type, node, missingRequirement = null) => {
  const [titleKey, bodyKey, ctaKey] = ACTION_KEYS[type] || ['careerAction.nextRank.title', 'careerAction.nextRank.body', 'careerAction.nextRank.cta'];
  return {
    type,
    titleKey,
    bodyKey,
    ctaKey,
    targetNodeId: node?.id || null,
    missingRequirement,
    destination: type === 'choose_path' ? 'CareerPathSelection' : type === 'path_complete' ? 'CareerPath' : 'CareerPath',
    storyId: null,
    categoryId: null,
    isAvailableOffline: true,
  };
};

export const getMissingRequirement = (node) => {
  if (!node?.requirementRows) return null;
  return missingPriority.find((type) => node.requirementRows.some((row) => row.type === type && !row.completed)) || null;
};

export const buildCareerNextAction = ({ commonNodes = [], pathNodes = [], activePath = null }) => {
  const nextCommon = commonNodes.find((node) => node.status !== 'completed');
  if (nextCommon) return makeAction('advance', nextCommon, getMissingRequirement(nextCommon));
  if (!activePath) return makeAction('choose_path');

  const nextPathNode = pathNodes.find((node) => node.status !== 'completed');
  if (!nextPathNode) return makeAction('path_complete');
  const missingRequirement = getMissingRequirement(nextPathNode);
  if (missingRequirement === 'activeDays' && nextPathNode.hasMeaningfulActivityToday) {
    return makeAction('today_complete', nextPathNode, missingRequirement);
  }
  return makeAction('advance', nextPathNode, missingRequirement);
};

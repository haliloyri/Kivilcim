import { PATH_IDS } from '../constants/careerPath';

export const CAREER_SCENARIOS = Object.freeze({
  noEvents: { metrics: {} },
  firstStoryComplete: { metrics: { stories: 1, activeDays: 1 } },
  commonPartial: { metrics: { stories: 3, categories: 2, deepInteractions: 1, activeDays: 2 }, earnedNodes: ['common_first_spark'] },
  travelerWithoutPath: { metrics: { stories: 7, categories: 3, deepInteractions: 2, applications: 1, activeDays: 5 }, earnedNodes: ['common_first_spark', 'common_curious', 'common_traveler'] },
  explorationFirst: { metrics: { stories: 12, categories: 4, deepInteractions: 3, applications: 1, activeDays: 8 }, activePath: PATH_IDS.EXPLORATION, earnedNodes: ['common_first_spark', 'common_curious', 'common_traveler'] },
  depthMiddle: { metrics: { stories: 20, categories: 4, deepInteractions: 12, applications: 2, activeDays: 18 }, activePath: PATH_IDS.DEPTH, earnedNodes: ['common_first_spark', 'common_curious', 'common_traveler', 'depth_thinker'] },
  transferCapstone: { metrics: { stories: 40, categories: 5, deepInteractions: 15, applications: 18, activeDays: 35 }, activePath: PATH_IDS.TRANSFER, earnedNodes: ['common_first_spark', 'common_curious', 'common_traveler', 'transfer_storyteller', 'transfer_connector'] },
  oneRequirementMissing: { metrics: { stories: 12, categories: 4, deepInteractions: 3, applications: 0, activeDays: 8 }, activePath: PATH_IDS.EXPLORATION, earnedNodes: ['common_first_spark', 'common_curious', 'common_traveler'] },
  multipleUnlocks: { metrics: { stories: 25, categories: 6, deepInteractions: 7, applications: 2, activeDays: 18 }, activePath: PATH_IDS.EXPLORATION, earnedNodes: ['common_first_spark', 'common_curious', 'common_traveler'] },
  completedPath: { metrics: { stories: 50, categories: 8, deepInteractions: 15, applications: 5, activeDays: 35 }, activePath: PATH_IDS.EXPLORATION, earnedNodes: ['common_first_spark', 'common_curious', 'common_traveler', 'exploration_route_seeker', 'exploration_horizon_traveler', 'exploration_wisdom_cartographer'] },
  legacyMigration: { metrics: { stories: 7, categories: 3, deepInteractions: 2, applications: 1, activeDays: 5 }, earnedNodes: ['common_first_spark'], migrationVersion: 1 },
  reducedCategoryInventory: { metrics: { stories: 12, categories: 2, deepInteractions: 3, applications: 1, activeDays: 8 }, activePath: PATH_IDS.EXPLORATION, availableCategoryCount: 2, earnedNodes: ['common_first_spark', 'common_curious', 'common_traveler'] },
  offlineCache: { metrics: { stories: 3, categories: 2, deepInteractions: 1, activeDays: 3 }, earnedNodes: ['common_first_spark'], source: 'cache', isOffline: true },
});

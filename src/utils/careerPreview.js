import { buildCareerViewModel } from './careerProgress';
import { PATH_IDS } from '../constants/careerPath';

export const CAREER_PREVIEW_SCENARIOS = Object.freeze([
  { id: 'new_user', labelKey: 'career.preview.newUser', metrics: {}, earnedNodeIds: [], activePath: null },
  { id: 'common_progress', labelKey: 'career.preview.commonProgress', metrics: { stories: 3, categories: 2, deepInteractions: 1, applications: 0, activeDays: 3 }, earnedNodeIds: ['common_first_spark'], activePath: null },
  { id: 'path_selection', labelKey: 'career.preview.pathSelection', metrics: { stories: 7, categories: 3, deepInteractions: 2, applications: 1, activeDays: 5 }, earnedNodeIds: ['common_first_spark', 'common_curious', 'common_traveler'], activePath: null },
  { id: 'active_path', labelKey: 'career.preview.activePath', metrics: { stories: 20, categories: 4, deepInteractions: 7, applications: 2, activeDays: 18 }, earnedNodeIds: ['common_first_spark', 'common_curious', 'common_traveler', 'depth_thinker'], activePath: PATH_IDS.DEPTH },
  { id: 'final_rank', labelKey: 'career.preview.finalRank', metrics: { stories: 50, categories: 8, deepInteractions: 15, applications: 5, activeDays: 35 }, earnedNodeIds: ['common_first_spark', 'common_curious', 'common_traveler', 'exploration_route_seeker', 'exploration_horizon_traveler', 'exploration_wisdom_cartographer'], activePath: PATH_IDS.EXPLORATION },
]);

export const getCareerPreviewScenario = (scenarioId) =>
  CAREER_PREVIEW_SCENARIOS.find((scenario) => scenario.id === scenarioId) || null;

/**
 * Builds a display-only path model from fixed values. It deliberately uses no
 * events and makes no provider/DB calls, so changing preview state cannot
 * award ranks, enqueue sync work, or create career analytics.
 */
export const buildCareerPreview = (scenarioId) => {
  const scenario = getCareerPreviewScenario(scenarioId);
  if (!scenario) return null;
  return buildCareerViewModel({
    metrics: scenario.metrics,
    activePath: scenario.activePath,
    earnedNodes: scenario.earnedNodeIds.map((nodeId) => ({ nodeId })),
  });
};

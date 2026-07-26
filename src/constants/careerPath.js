export const RULE_VERSION = 1;
export const COMMON_PATH_ID = 'common';
export const PATH_IDS = Object.freeze({
  EXPLORATION: 'exploration',
  DEPTH: 'depth',
  TRANSFER: 'transfer',
});

export const PATH_DEFINITIONS = Object.freeze([
  { id: PATH_IDS.EXPLORATION, titleKey: 'careerPath.exploration.title', descriptionKey: 'careerPath.exploration.description' },
  { id: PATH_IDS.DEPTH, titleKey: 'careerPath.depth.title', descriptionKey: 'careerPath.depth.description' },
  { id: PATH_IDS.TRANSFER, titleKey: 'careerPath.transfer.title', descriptionKey: 'careerPath.transfer.description' },
]);

const requirements = (stories, categories, deepInteractions, applications, activeDays) => ({
  stories,
  categories,
  deepInteractions,
  applications,
  activeDays,
});

export const CAREER_NODES = Object.freeze([
  { id: 'common_first_spark', pathId: COMMON_PATH_ID, order: 1, titleKey: 'careerNode.firstSpark.title', descriptionKey: 'careerNode.firstSpark.description', identityKey: 'careerNode.firstSpark.identity', requirements: requirements(1, 0, 0, 0, 0), unlockKey: 'careerNode.firstSpark.unlock', visualKey: 'first_spark' },
  { id: 'common_curious', pathId: COMMON_PATH_ID, order: 2, titleKey: 'careerNode.curious.title', descriptionKey: 'careerNode.curious.description', identityKey: 'careerNode.curious.identity', requirements: requirements(3, 2, 1, 0, 3), unlockKey: 'careerNode.curious.unlock', visualKey: 'curious' },
  { id: 'common_traveler', pathId: COMMON_PATH_ID, order: 3, titleKey: 'careerNode.traveler.title', descriptionKey: 'careerNode.traveler.description', identityKey: 'careerNode.traveler.identity', requirements: requirements(7, 3, 2, 1, 5), unlockKey: 'careerNode.traveler.unlock', visualKey: 'traveler' },
  { id: 'exploration_route_seeker', pathId: PATH_IDS.EXPLORATION, order: 1, titleKey: 'careerNode.routeSeeker.title', descriptionKey: 'careerNode.routeSeeker.description', identityKey: 'careerNode.routeSeeker.identity', requirements: requirements(12, 4, 3, 1, 8), unlockKey: 'careerNode.routeSeeker.unlock', visualKey: 'route_seeker' },
  { id: 'exploration_horizon_traveler', pathId: PATH_IDS.EXPLORATION, order: 2, titleKey: 'careerNode.horizonTraveler.title', descriptionKey: 'careerNode.horizonTraveler.description', identityKey: 'careerNode.horizonTraveler.identity', requirements: requirements(25, 6, 7, 2, 18), unlockKey: 'careerNode.horizonTraveler.unlock', visualKey: 'horizon_traveler' },
  { id: 'exploration_wisdom_cartographer', pathId: PATH_IDS.EXPLORATION, order: 3, titleKey: 'careerNode.wisdomCartographer.title', descriptionKey: 'careerNode.wisdomCartographer.description', identityKey: 'careerNode.wisdomCartographer.identity', requirements: requirements(50, 8, 15, 5, 35), unlockKey: 'careerNode.wisdomCartographer.unlock', visualKey: 'wisdom_cartographer' },
  { id: 'depth_thinker', pathId: PATH_IDS.DEPTH, order: 1, titleKey: 'careerNode.thinker.title', descriptionKey: 'careerNode.thinker.description', identityKey: 'careerNode.thinker.identity', requirements: requirements(10, 3, 5, 1, 8), unlockKey: 'careerNode.thinker.unlock', visualKey: 'thinker' },
  { id: 'depth_synthesizer', pathId: PATH_IDS.DEPTH, order: 2, titleKey: 'careerNode.synthesizer.title', descriptionKey: 'careerNode.synthesizer.description', identityKey: 'careerNode.synthesizer.identity', requirements: requirements(20, 4, 12, 2, 18), unlockKey: 'careerNode.synthesizer.unlock', visualKey: 'synthesizer' },
  { id: 'depth_insight_curator', pathId: PATH_IDS.DEPTH, order: 3, titleKey: 'careerNode.insightCurator.title', descriptionKey: 'careerNode.insightCurator.description', identityKey: 'careerNode.insightCurator.identity', requirements: requirements(40, 5, 25, 5, 35), unlockKey: 'careerNode.insightCurator.unlock', visualKey: 'insight_curator' },
  { id: 'transfer_storyteller', pathId: PATH_IDS.TRANSFER, order: 1, titleKey: 'careerNode.storyteller.title', descriptionKey: 'careerNode.storyteller.description', identityKey: 'careerNode.storyteller.identity', requirements: requirements(10, 3, 3, 3, 8), unlockKey: 'careerNode.storyteller.unlock', visualKey: 'storyteller' },
  { id: 'transfer_connector', pathId: PATH_IDS.TRANSFER, order: 2, titleKey: 'careerNode.connector.title', descriptionKey: 'careerNode.connector.description', identityKey: 'careerNode.connector.identity', requirements: requirements(20, 4, 7, 8, 18), unlockKey: 'careerNode.connector.unlock', visualKey: 'connector' },
  { id: 'transfer_spark_carrier', pathId: PATH_IDS.TRANSFER, order: 3, titleKey: 'careerNode.sparkCarrier.title', descriptionKey: 'careerNode.sparkCarrier.description', identityKey: 'careerNode.sparkCarrier.identity', requirements: requirements(40, 5, 15, 18, 35), unlockKey: 'careerNode.sparkCarrier.unlock', visualKey: 'spark_carrier' },
]);

const REQUIRED_FIELDS = ['id', 'pathId', 'order', 'titleKey', 'descriptionKey', 'identityKey', 'requirements', 'unlockKey', 'visualKey'];
const REQUIREMENT_KEYS = ['stories', 'categories', 'deepInteractions', 'applications', 'activeDays'];

export const validateCareerDefinitions = (nodes = CAREER_NODES) => {
  const validPathIds = new Set([COMMON_PATH_ID, ...Object.values(PATH_IDS)]);
  const ids = new Set();
  const orderByPath = new Map();

  if (!Array.isArray(nodes) || nodes.length !== 12) {
    throw new Error('[careerPath] Expected exactly 12 career nodes.');
  }

  nodes.forEach((node) => {
    REQUIRED_FIELDS.forEach((field) => {
      if (node?.[field] == null || node[field] === '') throw new Error(`[careerPath] ${node?.id || 'unknown'} is missing ${field}.`);
    });
    if (ids.has(node.id)) throw new Error(`[careerPath] Duplicate node id: ${node.id}.`);
    if (!validPathIds.has(node.pathId)) throw new Error(`[careerPath] Invalid path for ${node.id}: ${node.pathId}.`);
    if (!Number.isInteger(node.order) || node.order < 1) throw new Error(`[careerPath] Invalid order for ${node.id}.`);
    REQUIREMENT_KEYS.forEach((key) => {
      if (!Number.isInteger(node.requirements[key]) || node.requirements[key] < 0) {
        throw new Error(`[careerPath] Invalid ${key} target for ${node.id}.`);
      }
    });
    if (!REQUIREMENT_KEYS.some((key) => node.requirements[key] > 0)) throw new Error(`[careerPath] ${node.id} needs a requirement.`);
    ids.add(node.id);
    const pathOrders = orderByPath.get(node.pathId) || [];
    pathOrders.push(node.order);
    orderByPath.set(node.pathId, pathOrders);
  });

  orderByPath.forEach((orders, pathId) => {
    const sorted = [...orders].sort((a, b) => a - b);
    if (sorted.some((order, index) => order !== index + 1)) throw new Error(`[careerPath] ${pathId} node order must start at 1 and be contiguous.`);
  });
  return true;
};

validateCareerDefinitions();

export const getNodesForPath = (pathId) => CAREER_NODES.filter((node) => node.pathId === pathId).sort((a, b) => a.order - b.order);
export const getCareerNode = (nodeId) => CAREER_NODES.find((node) => node.id === nodeId) || null;

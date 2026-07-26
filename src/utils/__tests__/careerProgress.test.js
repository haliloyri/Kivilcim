import { CAREER_NODES, validateCareerDefinitions } from '../../constants/careerPath';
import { CAREER_VISUAL_KEYS, getCareerVisualState } from '../../constants/careerVisuals';
import { buildCareerViewModel, buildRequirementRows, calculateCareerMetrics, getCareerRecommendation, getEffectiveCategoryTarget } from '../careerProgress';
import { CAREER_SCENARIOS } from '../../fixtures/careerScenarios';

describe('career definitions', () => {
  it('contains the 12 stable nodes', () => {
    expect(CAREER_NODES).toHaveLength(12);
    expect(validateCareerDefinitions()).toBe(true);
  });

  it('rejects duplicate node IDs', () => {
    const duplicate = CAREER_NODES.map((node) => ({ ...node }));
    duplicate[1].id = duplicate[0].id;
    expect(() => validateCareerDefinitions(duplicate)).toThrow('Duplicate node id');
  });

  it('gives every stable node one reusable visual identity and state fallback', () => {
    expect(CAREER_VISUAL_KEYS).toHaveLength(12);
    CAREER_NODES.forEach((node) => {
      expect(CAREER_VISUAL_KEYS).toContain(node.visualKey);
      expect(getCareerVisualState(node.visualKey, 'completed', false)).toMatchObject({ icon: expect.any(String), colors: expect.any(Array) });
      expect(getCareerVisualState(node.visualKey, 'future', true)).toMatchObject({ icon: 'lock-closed-outline', colors: expect.any(Array) });
    });
  });
});

describe('career view model', () => {
  it('asks the traveler to choose a path after the common route', () => {
    const viewModel = buildCareerViewModel(CAREER_SCENARIOS.travelerWithoutPath);
    expect(viewModel.isPathSelectionDue).toBe(true);
    expect(viewModel.nextAction.type).toBe('choose_path');
    expect(viewModel.displayedTitle).toBe('careerNode.traveler.title');
    expect(viewModel.profileTitle).toBe('careerNode.traveler.title');
  });

  it('uses only the active route for the profile title', () => {
    const viewModel = buildCareerViewModel({
      metrics: {},
      activePath: 'exploration',
      earnedNodes: ['common_first_spark', 'common_curious', 'common_traveler'],
    });
    expect(viewModel.profileTitle).toBe('careerNode.traveler.title');
  });

  it('uses an effective category target when the inventory is smaller', () => {
    const node = CAREER_NODES.find((item) => item.id === 'exploration_route_seeker');
    const rows = buildRequirementRows(node, CAREER_SCENARIOS.reducedCategoryInventory.metrics, 2);
    expect(getEffectiveCategoryTarget(4, 2)).toBe(2);
    expect(rows.find((row) => row.type === 'categories')).toMatchObject({ current: 2, target: 2, completed: true });
  });

  it('keeps completed nodes completed when current thresholds would not qualify', () => {
    const viewModel = buildCareerViewModel({
      metrics: {},
      activePath: 'exploration',
      earnedNodes: ['common_first_spark', 'common_curious', 'common_traveler', 'exploration_route_seeker'],
    });
    expect(viewModel.paths.exploration[0].status).toBe('completed');
  });

  it('caps H and U by local day while preserving valid deep credits', () => {
    const events = [
      ['h-1', 'H', 'story-1', 1, '2026-07-01T08:00:00.000Z'],
      ['h-2', 'H', 'story-2', 2, '2026-07-01T08:01:00.000Z'],
      ['h-3', 'H', 'story-3', 3, '2026-07-01T08:02:00.000Z'],
      ['h-4', 'H', 'story-4', 4, '2026-07-01T08:03:00.000Z'],
      ['d-1', 'D', 'story-1', 1, '2026-07-02T08:00:00.000Z'],
      ['u-1', 'U', 'story-1', 1, '2026-07-02T08:01:00.000Z'],
      ['u-2', 'U', 'story-2', 2, '2026-07-02T08:02:00.000Z'],
      ['d-orphan', 'D', 'missing-story', 5, '2026-07-02T08:03:00.000Z'],
    ].map(([eventId, creditType, storyId, categoryId, occurredAt]) => ({ eventId, creditType, storyId, categoryId, occurredAt, localDay: occurredAt.slice(0, 10) }));
    const result = calculateCareerMetrics(events);
    expect(result.metrics).toEqual({ stories: 3, categories: 3, deepInteractions: 1, applications: 1, activeDays: 2 });
    expect(result.creditedEventIds).not.toContain('h-4');
    expect(result.creditedEventIds).not.toContain('u-2');
    expect(result.creditedEventIds).not.toContain('d-orphan');
  });

  it('returns a gentle, deterministic path suggestion without selecting it', () => {
    const recommendation = getCareerRecommendation({ stories: 8, categories: 1, deepInteractions: 5, applications: 0 });
    expect(recommendation).toMatchObject({ recommendedPath: 'depth', kind: 'suggestion' });
    expect(buildCareerViewModel({ metrics: { stories: 8, categories: 1, deepInteractions: 5 } }).activePath).toBeNull();
  });

  it('builds a view model from 2,000 events without blocking the UI budget', () => {
    const events = Array.from({ length: 2000 }, (_, index) => {
      const day = String((index % 28) + 1).padStart(2, '0');
      const type = index % 5 === 0 ? 'D' : index % 7 === 0 ? 'U' : 'H';
      return {
        eventId: `perf-${index}`,
        creditType: type,
        storyId: `story-${Math.floor(index / 2)}`,
        categoryId: index % 9,
        occurredAt: `2026-07-${day}T12:${String(index % 60).padStart(2, '0')}:00.000Z`,
        localDay: `2026-07-${day}`,
      };
    });
    const startedAt = Date.now();
    const viewModel = buildCareerViewModel({ events, activePath: 'depth' });
    expect(Date.now() - startedAt).toBeLessThan(500);
    expect(viewModel.nextAction).toBeTruthy();
  });
});

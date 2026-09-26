import { buildRankShare, buildWeeklyShare } from '../careerShare';

const learning = { ideas: 34, books: 12, minutes: 96, week: { stories: 5, minutes: 22, books: 3 } };

describe('career share copy', () => {
  it('uses real numbers and a viewer hook for a title', () => {
    const share = buildRankShare({ titleKey: 'careerNode.horizonTraveler.title', pathId: 'exploration', learning, name: 'Ayşe', lang: 'tr' });
    expect(share.line).toBe('Ayşe 12 kitaptan 34 fikir topladı ve Ufuk Gezgini oldu.');
    expect(share.hook).toBe('Sıradaki Ufuk Gezgini sen misin?');
    expect(share.pathLabel).toBe('Keşif Yolu');
    expect(share.stats.map((item) => item.value)).toEqual([12, 34, 96]);
  });

  it('falls back to a number-free line and hides the common path', () => {
    const share = buildRankShare({ titleKey: 'careerNode.firstSpark.title', pathId: 'common', learning: { ideas: 0, books: 0 }, name: '', lang: 'en' });
    expect(share.line).toBe('An Albor reader just earned a new title: First Spark.');
    expect(share.stats).toBeNull();
    expect(share.pathLabel).toBeNull();
  });

  it('builds the weekly recap', () => {
    const share = buildWeeklyShare({ learning, currentTitleKey: 'careerNode.thinker.title', name: 'Mert', lang: 'tr' });
    expect(share.line).toBe('Mert bu hafta 3 kitaptan 5 fikir öğrendi.');
    expect(share.subLabel).toBe('Unvan: Derin Düşünür');
    expect(share.stats.map((item) => item.value)).toEqual([5, 3, 22]);
  });
});

import { translations } from '../i18n';

const requiredCareerKeys = [
  'tabMyPath', 'career.title', 'career.subtitle', 'career.loading', 'career.unavailable', 'career.offline', 'career.retry',
  'career.choosePathTitle', 'career.choosePathCopy', 'career.nextStep', 'career.timeline', 'career.heroProgress.common', 'career.heroProgress.path',
  'career.requirementHelp.deepInteractions',
  'career.showConditions', 'career.hideConditions', 'career.conditionsForRank', 'career.conditionsAllRequired', 'career.conditionsSaved',
  'career.requirementHow.stories', 'career.requirementHow.categories', 'career.requirementHow.deepInteractions', 'career.requirementHow.applications', 'career.requirementHow.activeDays',
  'career.primaryAction.stories', 'career.primaryAction.categories', 'career.primaryAction.deepInteractions', 'career.primaryAction.applications', 'career.primaryAction.activeDays',
  'career.selectedPath', 'career.pathsAhead', 'career.pathsAheadCopy', 'career.rankReward',
  'career.searchGuide.category', 'career.searchGuide.connection', 'career.searchGuide.application',
  'career.preview.toggle', 'career.preview.copy', 'career.preview.activeNotice', 'career.preview.exit',
  'career.preview.newUser', 'career.preview.commonProgress', 'career.preview.pathSelection', 'career.preview.activePath', 'career.preview.finalRank',
  'career.selection.title', 'career.selection.subtitle', 'career.selection.free',
  'career.selection.recommendationTitle', 'career.selection.recommended',
  'career.selection.behaviorLabel', 'career.selection.rankPreviewLabel',
  'career.selection.choose', 'career.selection.later', 'career.selection.eligibility',
  'careerRequirement.stories', 'careerRequirement.categories', 'careerRequirement.deepInteractions',
  'careerRequirement.applications', 'careerRequirement.activeDays',
  'careerAction.choosePath.title', 'careerAction.choosePath.body', 'careerAction.choosePath.cta',
  'careerAction.pathComplete.title', 'careerAction.pathComplete.body', 'careerAction.pathComplete.cta',
  'careerAction.todayComplete.title', 'careerAction.todayComplete.body', 'careerAction.todayComplete.cta',
  'careerAction.nextRank.title', 'careerAction.nextRank.body', 'careerAction.nextRank.cta',
  'careerPath.exploration.title', 'careerPath.depth.title', 'careerPath.transfer.title',
  'careerPath.exploration.behavior', 'careerPath.exploration.toolkit',
  'careerPath.depth.behavior', 'careerPath.depth.toolkit',
  'careerPath.transfer.behavior', 'careerPath.transfer.toolkit',
  'careerRecommendation.insufficientData', 'careerRecommendation.balanced',
  'careerRecommendation.exploration', 'careerRecommendation.depth', 'careerRecommendation.transfer',
  'careerNode.firstSpark.title', 'careerNode.sparkCarrier.title',
  'career.promotion.title', 'career.promotion.body', 'career.promotion.more', 'career.promotion.continue',
  'career.capstone.title', 'career.capstone.body', 'career.capstone.periodSummary',
  'career.capstone.stay', 'career.capstone.focusAnother', 'career.capstone.profileBadge',
  'career.share.title', 'career.share.line', 'career.share.path', 'career.share.earnedDate', 'career.share.evidence', 'career.share.evidenceCount',
  'career.toolkit.open', 'career.toolkit.emptyList', 'career.toolkit.exploration.heading', 'career.toolkit.exploration.weeklyRoute', 'career.toolkit.exploration.atlasTitle', 'career.toolkit.exploration.atlasSummary', 'career.toolkit.depth.heading', 'career.toolkit.depth.synthesisTitle', 'career.toolkit.depth.synthesisQuestion', 'career.toolkit.depth.synthesisEmpty', 'career.toolkit.depth.dossierTitle', 'career.toolkit.depth.dossierSummary', 'career.toolkit.depth.dossierEmpty', 'career.toolkit.transfer.heading', 'career.toolkit.transfer.packageTitle', 'career.toolkit.transfer.packageCopy', 'career.toolkit.transfer.packageEmpty', 'career.toolkit.transfer.packageSelected', 'career.toolkit.transfer.packageAdd', 'career.toolkit.transfer.packageLimit',
  'career.toolkit.unavailableTitle', 'career.toolkit.unavailableBody',
  'career.toolkit.lockedTool', 'career.toolkit.firstTool', 'career.toolkit.secondTool', 'career.toolkit.thirdTool',
  'career.close', 'career.requirements', 'career.nodeDetailsCopy',
  'career.summary.title', 'career.summary.copy', 'career.summary.stories', 'career.summary.categories', 'career.summary.insights', 'career.summary.applications', 'career.summary.activeDays',
  'career.rhythm.title', 'career.rhythm.copy', 'career.rhythm.heatmapLabel', 'career.rhythm.less', 'career.rhythm.more',
  'career.legacy.title', 'career.legacy.copy', 'career.legacy.badgeLabel',
  'career.home.eyebrow', 'career.home.completeCopy', 'career.home.openPathCta',
  'career.profileTitleLabel',
  'career.takeaway.save', 'career.takeaway.saved',
  'career.engagement.title', 'career.engagement.copy', 'career.engagement.save', 'career.engagement.saved', 'career.engagement.voice', 'career.engagement.conversation',
  'career.privatePlan.open', 'career.privatePlan.title', 'career.privatePlan.copy', 'career.privatePlan.workStudy', 'career.privatePlan.social', 'career.privatePlan.personal', 'career.privatePlan.saved', 'career.privatePlan.completeFirst',
  'career.application.limitReached', 'career.application.syncFailed', 'career.application.completeFirst',
  'career.migration.title', 'career.migration.reads', 'career.migration.future', 'career.migration.legacy', 'career.migration.continue',
  'career.switchConfirm.title', 'career.switchConfirm.body', 'career.switchConfirm.assurance', 'career.switchConfirm.titlePreview', 'career.switchConfirm.cancel', 'career.switchConfirm.confirm',
];

describe('career path translations', () => {
  it.each(['en', 'tr', 'es', 'de'])('%s includes every visible career key', (lang) => {
    requiredCareerKeys.forEach((key) => {
      expect(translations[lang][key]).toEqual(expect.any(String));
      expect(translations[lang][key].trim()).not.toBe('');
    });
  });

  it.each(['en', 'tr', 'es', 'de'])('%s includes explanation, meaning, and reward copy for every rank', (lang) => {
    [
      'firstSpark', 'curious', 'traveler', 'routeSeeker', 'horizonTraveler', 'wisdomCartographer',
      'thinker', 'synthesizer', 'insightCurator', 'storyteller', 'connector', 'sparkCarrier',
    ].forEach((node) => {
      ['description', 'identity', 'unlock'].forEach((field) => {
        expect(translations[lang][`careerNode.${node}.${field}`]).toEqual(expect.any(String));
        expect(translations[lang][`careerNode.${node}.${field}`].trim()).not.toBe('');
      });
    });
  });

  it('keeps every defined career placeholder contract aligned across languages', () => {
    const careerKeys = Object.keys(translations.en).filter((key) => key.startsWith('career'));
    const placeholders = (value) => [...String(value).matchAll(/{{([^}]+)}}/g)].map((match) => match[1]).sort();
    careerKeys.forEach((key) => {
      const expected = placeholders(translations.en[key]);
      ['tr', 'es', 'de'].forEach((lang) => {
        expect(translations[lang][key]).toEqual(expect.any(String));
        expect(placeholders(translations[lang][key])).toEqual(expected);
      });
    });
  });
});

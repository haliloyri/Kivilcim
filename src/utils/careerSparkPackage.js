export const SPARK_PACKAGE_LIMIT = 5;

export const updateCareerSparkPackage = (currentIds, storyId, limit = SPARK_PACKAGE_LIMIT) => {
  const normalizedStoryId = String(storyId ?? '').trim();
  const current = [...new Set((currentIds || []).map((id) => String(id)).filter(Boolean))].slice(0, limit);
  if (!normalizedStoryId) return { changed: false, reason: 'invalid_story', package: current };
  if (current.includes(normalizedStoryId)) {
    return { changed: true, selected: false, package: current.filter((id) => id !== normalizedStoryId) };
  }
  if (current.length >= limit) return { changed: false, reason: 'limit_reached', package: current };
  return { changed: true, selected: true, package: [...current, normalizedStoryId] };
};

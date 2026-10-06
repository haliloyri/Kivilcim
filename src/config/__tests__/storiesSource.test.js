const loadSource = (value) => {
  const previous = process.env.EXPO_PUBLIC_STORIES_SOURCE;
  if (value === undefined) delete process.env.EXPO_PUBLIC_STORIES_SOURCE;
  else process.env.EXPO_PUBLIC_STORIES_SOURCE = value;
  jest.resetModules();
  const { STORIES_SOURCE } = require('../featureFlags');
  if (previous === undefined) delete process.env.EXPO_PUBLIC_STORIES_SOURCE;
  else process.env.EXPO_PUBLIC_STORIES_SOURCE = previous;
  return STORIES_SOURCE;
};

describe('stories source flag', () => {
  it('defaults to the Supabase catalogue sync', () => {
    expect(loadSource()).toBe('supabase');
    expect(loadSource('anything')).toBe('supabase');
  });
  it('only falls back to the bundled database when asked explicitly', () => {
    expect(loadSource('local')).toBe('local');
    expect(loadSource(' LOCAL ')).toBe('local');
  });
});

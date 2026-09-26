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
  it('defaults to the bundled local database', () => {
    expect(loadSource()).toBe('local');
    expect(loadSource('anything')).toBe('local');
  });
  it('only enables Supabase when asked explicitly', () => {
    expect(loadSource('supabase')).toBe('supabase');
    expect(loadSource(' SUPABASE ')).toBe('supabase');
  });
});

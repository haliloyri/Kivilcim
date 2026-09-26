// Build-time flags only. Keep rollout decisions in this module so screens and
// providers never need their own copies of an experiment condition.
const asBoolean = (value) => String(value).toLowerCase() === 'true';

// The visible path cannot make progress unless its underlying credits are
// captured. Keep the capture-only flag so we can collect shadow data before
// exposing Yolum, but make capture automatic whenever Yolum itself is on.
// Kıvılcım Yolu is now the only progress experience (the legacy badge screen
// was removed), so it is ON unless a build explicitly sets the value to 'false'.
const isNotExplicitlyFalse = (value) => String(value ?? '').trim().toLowerCase() !== 'false';
const careerPathV1 = isNotExplicitlyFalse(process.env.EXPO_PUBLIC_CAREER_PATH_V1);
const careerEventCaptureV1 = careerPathV1 || asBoolean(process.env.EXPO_PUBLIC_CAREER_EVENT_CAPTURE_V1);

export const FEATURE_FLAGS = Object.freeze({
  careerPathV1,
  careerEventCaptureV1,
});

export const isFeatureEnabled = (name) => FEATURE_FLAGS[name] === true;

// Where the story catalogue comes from. 'local' (default) reads only the
// bundled SQLite database; 'supabase' restores the remote refresh that
// overrides local stories. Keep 'local' until Supabase holds the P1 content.
const storiesSourceRaw = String(process.env.EXPO_PUBLIC_STORIES_SOURCE || 'local').trim().toLowerCase();
export const STORIES_SOURCE = storiesSourceRaw === 'supabase' ? 'supabase' : 'local';

// Build-time flags only. Keep rollout decisions in this module so screens and
// providers never need their own copies of an experiment condition.
const asBoolean = (value) => String(value).toLowerCase() === 'true';

export const FEATURE_FLAGS = Object.freeze({
  careerPathV1: asBoolean(process.env.EXPO_PUBLIC_CAREER_PATH_V1),
  careerEventCaptureV1: asBoolean(process.env.EXPO_PUBLIC_CAREER_EVENT_CAPTURE_V1),
});

export const isFeatureEnabled = (name) => FEATURE_FLAGS[name] === true;

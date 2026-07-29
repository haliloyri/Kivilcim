// Build-time flags only. Keep rollout decisions in this module so screens and
// providers never need their own copies of an experiment condition.
const asBoolean = (value) => String(value).toLowerCase() === 'true';

// The visible path cannot make progress unless its underlying credits are
// captured. Keep the capture-only flag so we can collect shadow data before
// exposing Yolum, but make capture automatic whenever Yolum itself is on.
const careerPathV1 = asBoolean(process.env.EXPO_PUBLIC_CAREER_PATH_V1);
const careerEventCaptureV1 = careerPathV1 || asBoolean(process.env.EXPO_PUBLIC_CAREER_EVENT_CAPTURE_V1);

export const FEATURE_FLAGS = Object.freeze({
  careerPathV1,
  careerEventCaptureV1,
});

export const isFeatureEnabled = (name) => FEATURE_FLAGS[name] === true;

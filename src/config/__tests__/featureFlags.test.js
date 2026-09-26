const loadFlags = ({ careerPathV1, careerEventCaptureV1 } = {}) => {
  const previousPath = process.env.EXPO_PUBLIC_CAREER_PATH_V1;
  const previousCapture = process.env.EXPO_PUBLIC_CAREER_EVENT_CAPTURE_V1;
  if (careerPathV1 === undefined) delete process.env.EXPO_PUBLIC_CAREER_PATH_V1;
  else process.env.EXPO_PUBLIC_CAREER_PATH_V1 = careerPathV1;
  if (careerEventCaptureV1 === undefined) delete process.env.EXPO_PUBLIC_CAREER_EVENT_CAPTURE_V1;
  else process.env.EXPO_PUBLIC_CAREER_EVENT_CAPTURE_V1 = careerEventCaptureV1;
  jest.resetModules();
  const { FEATURE_FLAGS } = require('../featureFlags');
  if (previousPath === undefined) delete process.env.EXPO_PUBLIC_CAREER_PATH_V1;
  else process.env.EXPO_PUBLIC_CAREER_PATH_V1 = previousPath;
  if (previousCapture === undefined) delete process.env.EXPO_PUBLIC_CAREER_EVENT_CAPTURE_V1;
  else process.env.EXPO_PUBLIC_CAREER_EVENT_CAPTURE_V1 = previousCapture;
  return FEATURE_FLAGS;
};

describe('career feature flags', () => {
  it('shows Kıvılcım Yolu by default and only disables it on an explicit false', () => {
    expect(loadFlags()).toEqual({ careerPathV1: true, careerEventCaptureV1: true });
    expect(loadFlags({ careerPathV1: 'FALSE', careerEventCaptureV1: 'yes' })).toEqual({ careerPathV1: false, careerEventCaptureV1: false });
  });

  it('allows shadow capture separately and always captures when Yolum is visible', () => {
    expect(loadFlags({ careerPathV1: 'false', careerEventCaptureV1: 'TRUE' })).toEqual({ careerPathV1: false, careerEventCaptureV1: true });
    expect(loadFlags({ careerPathV1: 'true' })).toEqual({ careerPathV1: true, careerEventCaptureV1: true });
  });
});

jest.mock('../../services/supabase', () => ({
  getCachedDeviceUserId: jest.fn(() => null),
}));

import { getCachedDeviceUserId } from '../../services/supabase';
import { getShareUrl, getShareLabel, normalizeShareLanguage } from '../share';

describe('normalizeShareLanguage', () => {
  it('falls back to tr for unsupported/missing languages', () => {
    expect(normalizeShareLanguage('de')).toBe('de');
    expect(normalizeShareLanguage('xx')).toBe('tr');
    expect(normalizeShareLanguage(undefined)).toBe('tr');
  });
});

describe('getShareUrl attribution params', () => {
  beforeEach(() => {
    getCachedDeviceUserId.mockReturnValue(null);
  });

  it('always tags the link with the language, even with no device/story known', () => {
    const url = getShareUrl('de');
    expect(url).toBe('https://alborapp.com/de?l=de');
  });

  it('adds the sharer device id (s) once a Supabase session is known', () => {
    getCachedDeviceUserId.mockReturnValue('device-123');
    const url = getShareUrl('en');
    expect(url).toContain('s=device-123');
    expect(url).toContain('l=en');
  });

  it('adds the story id (st) when sharing a specific story', () => {
    getCachedDeviceUserId.mockReturnValue('device-123');
    const url = getShareUrl('es', { storyId: 42 });
    expect(url).toContain('s=device-123');
    expect(url).toContain('st=42');
    expect(url).toContain('l=es');
  });

  it('omits st when no storyId is given', () => {
    const url = getShareUrl('tr', {});
    expect(url).not.toContain('st=');
  });
});

describe('getShareLabel', () => {
  it('strips the protocol and any attribution query string for display', () => {
    getCachedDeviceUserId.mockReturnValue('device-123');
    expect(getShareLabel('de')).toBe('alborapp.com/de');
  });
});

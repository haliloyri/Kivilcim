const mockCopy = jest.fn();
const mockDirCreate = jest.fn();
const mockDirDelete = jest.fn();
let mockDirExists = false;

jest.mock('expo-asset', () => ({ Asset: { fromModule: jest.fn() } }));
jest.mock('expo-file-system', () => {
  const uriOf = (part) => (typeof part === 'string' ? part : part.uri);
  return {
    Paths: { cache: { uri: 'file:///cache' } },
    Directory: class {
      constructor(...parts) { this.uri = `${parts.map(uriOf).join('/')}/`; }
      get exists() { return mockDirExists; }
      create() { mockDirCreate(); }
      delete() { mockDirDelete(); }
    },
    File: class {
      constructor(...parts) { this.uri = parts.map(uriOf).join(''); }
      copy(destination) { return mockCopy(this.uri, destination.uri); }
    },
  };
});

import { Platform } from 'react-native';
import { Asset } from 'expo-asset';
import { getNotificationAttachments, clearNotificationImageCache } from '../notificationImages';

beforeEach(() => {
  mockCopy.mockReset();
  mockCopy.mockResolvedValue();
  mockDirCreate.mockReset();
  mockDirDelete.mockReset();
  mockDirExists = false;
  Asset.fromModule.mockReset();
  Asset.fromModule.mockReturnValue({
    downloadAsync: jest.fn().mockResolvedValue({ localUri: 'file:///bundle/okuma.png' }),
  });
});
afterEach(() => { jest.restoreAllMocks(); });

test('returns [] on android and never touches the asset', async () => {
  jest.replaceProperty(Platform, 'OS', 'android');
  expect(await getNotificationAttachments('okuma')).toEqual([]);
  expect(Asset.fromModule).not.toHaveBeenCalled();
});

test('returns one png attachment on ios', async () => {
  const attachments = await getNotificationAttachments('okuma');
  expect(attachments).toHaveLength(1);
  expect(attachments[0].typeHint).toBe('public.png');
  expect(attachments[0].url.startsWith('file://')).toBe(true);
  expect(attachments[0].identifier).toBeTruthy();
  expect(mockCopy).toHaveBeenCalledWith('file:///bundle/okuma.png', attachments[0].url);
});

test('creates the cache directory when it is missing', async () => {
  await getNotificationAttachments('okuma');
  expect(mockDirCreate).toHaveBeenCalledTimes(1);
});

test('returns a different url on every call', async () => {
  const [first] = await getNotificationAttachments('okuma');
  const [second] = await getNotificationAttachments('okuma');
  expect(first.url).not.toBe(second.url);
});

test('returns [] and warns when the asset cannot be downloaded', async () => {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  Asset.fromModule.mockReturnValue({ downloadAsync: jest.fn().mockRejectedValue(new Error('no file')) });
  expect(await getNotificationAttachments('okuma')).toEqual([]);
  expect(warn).toHaveBeenCalled();
});

test('waits for the file copy to finish before returning the attachment', async () => {
  let finishCopy;
  mockCopy.mockReturnValue(new Promise((resolve) => { finishCopy = resolve; }));
  let settled = false;
  const pending = getNotificationAttachments('okuma').then((attachments) => {
    settled = true;
    return attachments;
  });
  await new Promise((resolve) => setImmediate(resolve));
  expect(settled).toBe(false);
  finishCopy();
  expect(await pending).toHaveLength(1);
});

test('returns [] and warns when the file copy fails', async () => {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  mockCopy.mockRejectedValue(new Error('disk full'));
  expect(await getNotificationAttachments('okuma')).toEqual([]);
  expect(warn).toHaveBeenCalled();
});

test('returns [] for an unknown pose', async () => {
  expect(await getNotificationAttachments('bilinmeyen')).toEqual([]);
  expect(Asset.fromModule).not.toHaveBeenCalled();
});

test('clearNotificationImageCache deletes the cache directory and never throws', () => {
  mockDirExists = true;
  clearNotificationImageCache();
  expect(mockDirDelete).toHaveBeenCalledTimes(1);

  mockDirDelete.mockImplementation(() => { throw new Error('busy'); });
  expect(() => clearNotificationImageCache()).not.toThrow();
});

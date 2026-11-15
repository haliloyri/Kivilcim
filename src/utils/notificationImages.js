import { Platform } from 'react-native';
import { Asset } from 'expo-asset';
import { Directory, File, Paths } from 'expo-file-system';

// Albi thumbnails for iOS notifications (shown on the right of the banner).
// Paper-backed 512 px PNGs, so Albi's petrol body stays readable on dark
// notification backgrounds. iOS only: Android has no per-notification image.
const POSES = {
  okuma: require('../../assets/albi/bildirim/okuma.png'),
  dark_mode: require('../../assets/albi/bildirim/dark_mode.png'),
  hedef_tamam: require('../../assets/albi/bildirim/hedef_tamam.png'),
};

const CACHE_DIR_NAME = 'albi-bildirim';
let copyCounter = 0;

const cacheDirectory = () => new Directory(Paths.cache, CACHE_DIR_NAME);

/**
 * Returns the `attachments` array for a local notification, or [] when no image
 * can be attached. Every call makes its own temp copy: iOS may move the file
 * into its attachment store, so one file cannot serve several schedules.
 * Never throws; a missing image must not stop the notification itself.
 */
export async function getNotificationAttachments(pose) {
  if (Platform.OS !== 'ios' || !Object.prototype.hasOwnProperty.call(POSES, pose)) return [];
  try {
    const { localUri } = await Asset.fromModule(POSES[pose]).downloadAsync();
    const directory = cacheDirectory();
    if (!directory.exists) directory.create();
    copyCounter += 1;
    const name = `${pose}-${Date.now()}-${copyCounter}.png`;
    const copy = new File(directory, name);
    await new File(localUri).copy(copy);
    return [{ identifier: name, url: copy.uri, typeHint: 'public.png' }];
  } catch (error) {
    console.warn('[notifications] image', error);
    return [];
  }
}

/** Deletes the temp copies before a reschedule so they do not pile up. Never throws. */
export function clearNotificationImageCache() {
  try {
    const directory = cacheDirectory();
    if (directory.exists) directory.delete();
  } catch (error) {
    // Cleanup is best effort; a stale temp file is harmless.
  }
}

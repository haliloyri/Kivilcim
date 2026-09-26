import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// StoryDetail stores a reader's own voice recordings under
// `story_audio_list_<id>` (JSON array) — older builds used `story_audio_<id>`.
const LIST_PREFIX = 'story_audio_list_';
const LEGACY_PREFIX = 'story_audio_';

export const loadRecordedStoryIds = async () => {
  const keys = await AsyncStorage.getAllKeys();
  const listKeys = keys.filter((k) => k.startsWith(LIST_PREFIX));
  const legacyKeys = keys.filter((k) => k.startsWith(LEGACY_PREFIX) && !k.startsWith(LIST_PREFIX));
  const ids = new Set();

  if (listKeys.length > 0) {
    const pairs = await AsyncStorage.multiGet(listKeys);
    pairs.forEach(([key, raw]) => {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) ids.add(key.slice(LIST_PREFIX.length));
      } catch (e) {}
    });
  }

  if (legacyKeys.length > 0) {
    const pairs = await AsyncStorage.multiGet(legacyKeys);
    pairs.forEach(([key, raw]) => {
      if (raw) ids.add(key.slice(LEGACY_PREFIX.length));
    });
  }

  return ids;
};

// Set of story ids that have at least one recording. Re-reads on screen focus
// (one getAllKeys + batched multiGet instead of a getItem per key).
export default function useRecordedStoryIds(navigation) {
  const [ids, setIds] = useState(() => new Set());

  const refresh = useCallback(async () => {
    try {
      setIds(await loadRecordedStoryIds());
    } catch (e) {
      console.warn('Failed to load recorded story ids', e);
    }
  }, []);

  useEffect(() => {
    refresh();
    if (!navigation?.addListener) return undefined;
    return navigation.addListener('focus', refresh);
  }, [navigation, refresh]);

  return ids;
}

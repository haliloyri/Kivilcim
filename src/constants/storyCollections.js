// Story collections: one per `stories.version` family. The id is what the
// "Story Collection" setting stores; the icon marks the collection on the
// story detail header and on the setting's chips, so readers can match them.
export const STORY_COLLECTIONS = [
  { id: 'classic', label: 'storyCollectionClassic', icon: 'book-outline' },
  { id: 'new', label: 'storyCollectionNew', icon: 'library-outline' },
  { id: 'agent', label: 'storyCollectionAgent', icon: 'hardware-chip-outline' },
  { id: 'focus', label: 'storyCollectionFocus', icon: 'leaf-outline' },
  { id: 'conversation', label: 'storyCollectionConversation', icon: 'chatbubbles-outline' },
  { id: 'originals', label: 'storyCollectionOriginals', icon: 'sparkles-outline' },
  { id: 'opus55', label: 'storyCollectionOpus55', icon: 'diamond-outline' },
  { id: 'opus55_2', label: 'storyCollectionOpus55_2', icon: 'prism-outline' },
  { id: 'son55', label: 'storyCollectionSon55', icon: 'musical-notes-outline' },
];

export const STORY_COLLECTION_IDS = STORY_COLLECTIONS.map((c) => c.id);
export const DEFAULT_STORY_COLLECTIONS = ['new', 'son55'];

export const getStoryCollectionId = (version) => {
  const value = String(version ?? '').trim().toUpperCase();
  if (value === '1') return 'classic';
  if (value === '2') return 'new';
  if (value === 'A2') return 'agent';
  if (/^F\d+$/.test(value)) return 'focus';
  if (/^C\d+$/.test(value)) return 'conversation';
  if (value === 'OH') return 'originals';
  if (value === 'OPUS55') return 'opus55';
  if (value === 'OPUS55-2') return 'opus55_2';
  if (value === 'SON55') return 'son55';
  return 'new';
};

export const getStoryCollection = (version) => {
  const id = getStoryCollectionId(version);
  return STORY_COLLECTIONS.find((c) => c.id === id);
};

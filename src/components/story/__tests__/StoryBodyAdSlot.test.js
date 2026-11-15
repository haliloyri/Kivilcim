jest.mock('../../../context/ThemeContext', () => ({ useTheme: () => ({ colors: require('../../../theme/theme').colors.light, isDark: false }) }));
jest.mock('@expo/vector-icons', () => ({ Ionicons: 'Icon' }));

import React from 'react';
import { Text } from 'react-native';
import TestRenderer, { act } from 'react-test-renderer';
import StoryBody from '../StoryBody';
import { translations } from '../../../locales/i18n';

let tree;
afterEach(() => { if (tree) act(() => tree.unmount()); tree = null; });

const segments = [
  { type: 'section', section: 'story', content: '' },
  { type: 'text', section: 'story', content: 'Bir' },
  { type: 'text', section: 'story', content: 'İki' },
  { type: 'section', section: 'lessons', content: '' },
  { type: 'text', section: 'lessons', content: 'Üç' },
];

const render = (props = {}) => {
  act(() => {
    tree = TestRenderer.create(<StoryBody segments={segments} fontSize={17} lang="tr" {...props} />);
  });
  return JSON.stringify(tree.toJSON());
};
const count = (haystack, needle) => haystack.split(needle).length - 1;

describe('StoryBody ad slot', () => {
  it('renders the ad slot right before the chosen section heading', () => {
    const json = render({ adSlotIndex: 3, renderAdSlot: () => <Text>AD</Text> });
    expect(count(json, '"AD"')).toBe(1);
    const lessonsHeading = translations.tr.storySectionLessons;
    expect(json.indexOf('"İki"')).toBeLessThan(json.indexOf('"AD"'));
    expect(json.indexOf('"AD"')).toBeLessThan(json.indexOf(lessonsHeading));
  });

  it('renders no ad slot when adSlotIndex is -1 or renderAdSlot is missing', () => {
    expect(count(render({ adSlotIndex: -1, renderAdSlot: () => <Text>AD</Text> }), '"AD"')).toBe(0);
    act(() => tree.unmount());
    expect(count(render({ adSlotIndex: 3 }), '"AD"')).toBe(0);
  });
});

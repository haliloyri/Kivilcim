jest.mock('../../../context/ThemeContext', () => ({ useTheme: () => ({ colors: require('../../../theme/theme').colors.light }) }));
jest.mock('react-native-safe-area-context', () => ({ useSafeAreaInsets: () => ({ top: 20, bottom: 20 }) }));
jest.mock('@expo/vector-icons', () => ({ Ionicons: 'Icon' }));

import React from 'react';
import { Modal, Pressable, Text, StyleSheet } from 'react-native';
import TestRenderer, { act } from 'react-test-renderer';
import ReaderPanels from '../ReaderPanels';
import StoryBody from '../StoryBody';
import { translations } from '../../../locales/i18n';
import { colors } from '../../../theme/theme';

let tree;
afterEach(() => { if (tree) act(() => tree.unmount()); tree = null; });
const defaults = {
  settingsVisible: true, onCloseSettings: jest.fn(), summaryVisible: false, onCloseSummary: jest.fn(),
  title: 'Örnek hikâye', summary: 'Olayların kısa anlatımı.', fontSize: 17, setFontSize: jest.fn(),
  lineSpacing: 1.55, setLineSpacing: jest.fn(), themePreference: 'light', setThemePreference: jest.fn(), lang: 'tr',
};
function mount(props = {}) { act(() => { tree = TestRenderer.create(<ReaderPanels {...defaults} {...props} />); }); }
function press(label) { act(() => tree.root.findAll(n => typeof n.props.onPress === 'function').find(n => n.props.accessibilityLabel === label).props.onPress()); }

it('lets the reader change size, spacing, and theme from one panel', () => {
  const setFontSize = jest.fn(), setLineSpacing = jest.fn(), setThemePreference = jest.fn();
  mount({ setFontSize, setLineSpacing, setThemePreference });
  press('Yazıyı büyüt');
  expect(setFontSize.mock.calls[0][0](17)).toBe(18);
  press('Geniş');
  expect(setLineSpacing).toHaveBeenCalledWith(1.8);
  press('Koyu');
  expect(setThemePreference).toHaveBeenCalledWith('dark');
});

it('disables text size controls at their limits', () => {
  mount({ fontSize: 24 });
  expect(tree.root.findAll(n => typeof n.props.onPress === 'function').find(n => n.props.accessibilityLabel === 'Yazıyı büyüt').props.disabled).toBe(true);
  act(() => tree.update(<ReaderPanels {...defaults} fontSize={12} />));
  expect(tree.root.findAll(n => typeof n.props.onPress === 'function').find(n => n.props.accessibilityLabel === 'Yazıyı küçült').props.disabled).toBe(true);
});

it('shows the short story in a separate modal and supports Android back and return to reading', () => {
  const onCloseSummary = jest.fn();
  mount({ settingsVisible: false, summaryVisible: true, onCloseSummary });
  const modal = tree.root.findAllByType(Modal).find(n => n.props.visible);
  expect(modal.findAllByType(Text).some(n => n.props.children === defaults.summary)).toBe(true);
  act(() => modal.props.onRequestClose());
  expect(onCloseSummary).toHaveBeenCalledTimes(1);
  press('Tam hikâyeyi oku');
  expect(onCloseSummary).toHaveBeenCalledTimes(2);
});

it('applies line spacing to story prose and removes the long italic opening', () => {
  const segments = [{ type: 'text', section: 'open', content: 'Giriş paragrafı.' }, { type: 'text', section: 'story', content: 'Hikâye paragrafı.' }];
  act(() => { tree = TestRenderer.create(<StoryBody segments={segments} fontSize={20} lineSpacing={1.8} categoryTheme={{ accent: '#C8733A' }} lang="tr" />); });
  const styled = tree.root.findAllByType(Text).map(n => StyleSheet.flatten(n.props.style)).filter(s => s?.lineHeight === 36);
  expect(styled).toHaveLength(2);
  expect(styled[0].fontFamily).toBe('Inter_400Regular');
  expect(styled[0].borderLeftWidth).toBe(3);
});

it.each(['tr', 'en', 'es', 'de'])('provides all reader labels in %s', lang => {
  Object.keys(translations.tr).filter(k => k.startsWith('reader') || k.startsWith('oneMinuteSummary')).forEach(k => {
    expect(translations[lang][k]).toEqual(expect.any(String));
    expect(translations[lang][k].trim()).not.toBe('');
  });
});

it.each(['light', 'dark'])('keeps reader accent text above WCAG AA contrast in %s mode', mode => {
  const luminance = hex => {
    const channels = hex.match(/[a-f\d]{2}/gi).map(c => parseInt(c, 16) / 255).map(c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
    return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
  };
  for (const background of [colors[mode].background, colors[mode].backgroundDark, mode === 'light' ? '#FFEDE1' : colors[mode].cardBackground]) {
    const values = [luminance(background), luminance(colors[mode].readerAccentText)].sort((a, b) => b - a);
    expect((values[0] + .05) / (values[1] + .05)).toBeGreaterThanOrEqual(4.5);
  }
});

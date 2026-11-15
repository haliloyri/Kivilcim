jest.mock('../Albi', () => 'Albi');

import React from 'react';
import { AccessibilityInfo, Animated } from 'react-native';
import TestRenderer, { act } from 'react-test-renderer';
import AnimatedLogo from '../AnimatedLogo';

let tree;
afterEach(() => {
  if (tree) act(() => tree.unmount());
  tree = null;
  jest.restoreAllMocks();
});

const mount = async ({ size = 200, reduceMotion = false } = {}) => {
  jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(reduceMotion);
  await act(async () => { tree = TestRenderer.create(<AnimatedLogo size={size} />); });
};

test('renders Albi with the selamlama pose at 85% of size', async () => {
  await mount({ size: 200 });
  const albi = tree.root.findByType('Albi');
  expect(albi.props.pose).toBe('selamlama');
  expect(albi.props.size).toBeCloseTo(170);
});

test('scales Albi with size', async () => {
  await mount({ size: 120 });
  expect(tree.root.findByType('Albi').props.size).toBeCloseTo(102);
});

test('keeps the root box size x size', async () => {
  await mount({ size: 200 });
  expect(tree.toJSON().props.style).toEqual({ width: 200, height: 200 });
});

test('starts no animation when reduce motion is on', async () => {
  const timing = jest.spyOn(Animated, 'timing');
  await mount({ reduceMotion: true });
  expect(timing).not.toHaveBeenCalled();
});

test('starts animations when reduce motion is off', async () => {
  const timing = jest.spyOn(Animated, 'timing');
  await mount({ reduceMotion: false });
  expect(timing).toHaveBeenCalled();
});

test('unmounting mid-animation does not throw', async () => {
  await mount();
  expect(() => act(() => tree.unmount())).not.toThrow();
  tree = null;
});

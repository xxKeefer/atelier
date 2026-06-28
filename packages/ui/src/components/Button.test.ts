import { composeStories } from '@storybook/vue3-vite';
import { render } from '@testing-library/vue';
import { expect, test } from 'vitest';
import Button from './Button.vue';
import * as stories from './Button.stories';
import { snapBoard } from '../test/snap';

const { Loading, Snapshot } = composeStories(stories);

const cursorOf = (props: Record<string, unknown>) => {
  const { container } = render(Button, { props, slots: { default: () => 'Go' } });
  return getComputedStyle(container.querySelector('button')!).cursor;
};

test('enabled button shows the pointer cursor', () => {
  expect(cursorOf({})).toBe('pointer');
});

test('loading button shows the wait cursor', () => {
  expect(cursorOf({ loading: true })).toBe('wait');
});

test('disabled button shows the not-allowed cursor', () => {
  expect(cursorOf({ disabled: true })).toBe('not-allowed');
});

// Regression: the skeleton pulse animates opacity down to .5 at its trough. If the
// disabled dimming also pins opacity to .5, the pulse has zero range and is invisible.
// Pause the animation and assert the resting opacity is full, so the pulse can move.
test('loading button is not statically dimmed, so the skeleton pulse stays visible', async () => {
  const { baseElement } = render(Loading);
  const button = baseElement.querySelector('button')!;
  button.style.animation = 'none';
  expect(getComputedStyle(button).opacity).toBe('1');
});

// AC: loading defaults to a circle-notch spinner, it overrides a consumer #left
// icon, and it still appears when there is no #left icon.
test('loading renders the default spinner, overriding any #left icon', () => {
  const { container } = render(Loading);
  // The Loading story renders two buttons: one with a #left icon, one without.
  const buttons = container.querySelectorAll('button');
  expect(buttons).toHaveLength(2);
  buttons.forEach((button) => {
    const wrapper = button.querySelector('.animate-spin');
    expect(wrapper).not.toBeNull();
    expect(wrapper!.querySelector('svg')).not.toBeNull();
  });
  // The consumer's own #left icon is replaced by the spinner while loading.
  expect(container.querySelector('[data-testid="left-icon"]')).toBeNull();
});

// The single visual snap for Button: the Snapshot story's board (every intent,
// size, variant, icon arrangement, and state on one screen). Baseline:
// __snaps__/button-snap-chromium-linux.png. Rebaseline: pnpm test:update.
test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot);
  await snapBoard('snap-board', 'button-snap');
});

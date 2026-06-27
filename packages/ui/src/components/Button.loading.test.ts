import { composeStories } from '@storybook/vue3-vite';
import { render } from '@testing-library/vue';
import { expect, test } from 'vitest';
import * as stories from './Button.stories';

const { Loading } = composeStories(stories);

// Regression: the skeleton pulse animates opacity down to .5 at its trough. If the
// disabled dimming also pins opacity to .5, the pulse has zero range and is invisible.
// Pause the animation and assert the resting opacity is full, so the pulse can move.
test('loading button is not statically dimmed, so the skeleton pulse stays visible', async () => {
  const { baseElement } = render(Loading);
  const button = baseElement.querySelector('button')!;
  button.style.animation = 'none';
  expect(getComputedStyle(button).opacity).toBe('1');
});

import { composeStories } from '@storybook/vue3-vite';
import { render } from '@testing-library/vue';
import { PhHeart } from '@phosphor-icons/vue';
import { expect, test } from 'vitest';
import Icon from './Icon.vue';
import * as stories from './Icon.stories';
import { snapBoard } from '../test/snap';

const { Snapshot } = composeStories(stories);

// Sizes bind to the type scale: lg == --text-lg (1.25rem == 20px). font-size on
// the wrapper drives the glyph, which renders at 1em.
test('size maps to the type-scale font-size', () => {
  const { container } = render(Icon, { props: { icon: PhHeart, size: 'lg' } });
  const wrapper = container.querySelector('span')!;
  expect(getComputedStyle(wrapper).fontSize).toBe('20px');
});

// Decorative by default: the wrapper is hidden and the inner glyph is hidden too,
// so the icon contributes nothing to the a11y tree.
test('is decorative by default -- aria-hidden, no role', () => {
  const { container } = render(Icon, { props: { icon: PhHeart } });
  const wrapper = container.querySelector('span')!;
  expect(wrapper).toHaveAttribute('aria-hidden', 'true');
  expect(wrapper).not.toHaveAttribute('role');
  expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
});

// A label promotes the icon to a named img.
test('a label makes the icon a meaningful img', () => {
  const { getByRole } = render(Icon, { props: { icon: PhHeart, label: 'Favourite' } });
  expect(getByRole('img', { name: 'Favourite' })).toBeInTheDocument();
});

// color paints the wrapper's currentColor; the glyph fills with it.
test('color is applied to the wrapper so the glyph inherits it', () => {
  const { container } = render(Icon, {
    props: { icon: PhHeart, color: 'rgb(255, 0, 0)' }
  });
  const wrapper = container.querySelector('span')!;
  expect(getComputedStyle(wrapper).color).toBe('rgb(255, 0, 0)');
});

// The single visual snap for Icon: the Snapshot story's board (sizes, weights,
// colour). Baseline: __snaps__/icon-snap-chromium-linux.png. Rebaseline: pnpm test:update.
test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot);
  await snapBoard('snap-board', 'icon-snap');
});

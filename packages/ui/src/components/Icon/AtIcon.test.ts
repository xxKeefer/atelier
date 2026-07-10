import { composeStories } from '@storybook/vue3-vite'
import { render, screen } from '@testing-library/vue'
import { PhHeart } from '@phosphor-icons/vue'
import { expect, test } from 'vitest'
import Icon from './AtIcon.vue'
import * as stories from './AtIcon.stories'
import { snapBoard } from '../../test/snap'

const { Snapshot } = composeStories(stories)

// Sizes bind to the type scale: lg == --text-lg (1.25rem == 20px). font-size on
// the wrapper drives the glyph, which renders at 1em. A label is passed only to
// expose the wrapper as role=img -- it doesn't affect the size styling under test.
test('size maps to the type-scale font-size', () => {
  render(Icon, { props: { icon: PhHeart, size: 'lg', label: 'sized' } })
  expect(getComputedStyle(screen.getByRole('img')).fontSize).toBe('20px')
})

// Decorative by default: with no label the icon contributes nothing to the a11y
// tree, so it exposes no img role.
test('is decorative by default -- not in the a11y tree', () => {
  render(Icon, { props: { icon: PhHeart } })
  expect(screen.queryByRole('img')).toBeNull()
})

// A label promotes the icon to a named img.
test('a label makes the icon a meaningful img', () => {
  render(Icon, { props: { icon: PhHeart, label: 'Favourite' } })
  expect(screen.getByRole('img', { name: 'Favourite' })).toBeInTheDocument()
})

// color paints the wrapper's currentColor; the glyph fills with it. As above,
// the label only exposes role=img for querying; it doesn't affect the colour.
test('color is applied to the wrapper so the glyph inherits it', () => {
  render(Icon, { props: { icon: PhHeart, color: 'rgb(255, 0, 0)', label: 'coloured' } })
  expect(getComputedStyle(screen.getByRole('img')).color).toBe('rgb(255, 0, 0)')
})

// The single visual snap for Icon: the Snapshot story's board (sizes, weights,
// colour). Baseline: __snaps__/icon-snap-chromium-linux.png. Rebaseline: pnpm test:update.
test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'icon')
})

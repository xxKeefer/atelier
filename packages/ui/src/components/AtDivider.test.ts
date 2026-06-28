import { composeStories } from '@storybook/vue3-vite'
import { render, screen } from '@testing-library/vue'
import { expect, test } from 'vitest'
import Divider from './AtDivider.vue'
import * as stories from './AtDivider.stories'
import { snapBoard } from '../test/snap'

const { Snapshot } = composeStories(stories)

// Non-decorative by default (reka's Separator default): a real separator in the
// layout, announced to assistive tech as role=separator.
test('is an announced separator by default', () => {
  render(Divider)
  expect(screen.getByRole('separator')).toBeInTheDocument()
})

// A vertical divider announces its orientation -- horizontal is the implicit
// default, so reka only emits aria-orientation when vertical.
test('vertical announces its orientation', () => {
  render(Divider, { props: { orientation: 'vertical' } })
  expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical')
})

// Decorative is pure garnish: role=none drops it from the a11y tree entirely.
test('decorative divider is hidden from the a11y tree', () => {
  render(Divider, { props: { decorative: true } })
  expect(screen.queryByRole('separator')).toBeNull()
})

// The single visual snap for Divider: the Snapshot story's board (horizontal +
// vertical in context). Baseline: __snaps__/divider-chromium-linux.png.
// Rebaseline: pnpm test:update.
test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'divider')
})

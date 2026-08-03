import { composeStories } from '@storybook/vue3-vite'
import { render, screen } from '@testing-library/vue'
import { expect, test } from 'vitest'
import Badge from './AtBadge.vue'
import * as stories from './AtBadge.stories'
import { snapBoard } from '../../test/snap'

const { Snapshot } = composeStories(stories)

test('renders default-slot content', () => {
  render(Badge, { slots: { default: () => 'New' } })
  expect(screen.getByText('New')).toBeInTheDocument()
})

// solid is the default variant.
test('defaults to the solid variant', () => {
  const { container } = render(Badge, { slots: { default: () => 'New' } })
  // eslint-disable-next-line testing-library/no-node-access
  const root = container.firstElementChild
  expect(root).toHaveStyle({ backgroundColor: 'var(--color-surface-strong)' })
})

test('faded variant uses the tinted-panel colour', () => {
  const { container } = render(Badge, {
    props: { variant: 'faded' },
    slots: { default: () => 'New' },
  })
  // eslint-disable-next-line testing-library/no-node-access
  const root = container.firstElementChild
  expect(root).toHaveStyle({ backgroundColor: 'var(--color-surface-default)' })
})

// md is the default size.
test('defaults to the md size', () => {
  const { container } = render(Badge, { slots: { default: () => 'New' } })
  // eslint-disable-next-line testing-library/no-node-access
  const root = container.firstElementChild
  expect(root?.className).toContain('text-xs')
})

// The single visual snap for Badge: the Snapshot story's board (every intent x
// variant, plus the size ladder, on one screen). Baseline:
// __snaps__/badge-chromium-linux.png. Rebaseline: pnpm test:update.
test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'badge')
})

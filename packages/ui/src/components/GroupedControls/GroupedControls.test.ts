import { composeStories } from '@storybook/vue3-vite'
import { render, screen } from '@testing-library/vue'
import { expect, test } from 'vitest'
import * as stories from './GroupedControls.stories'
import { snapBoard } from '../../test/snap'

const { Horizontal, Vertical, LiveHorizontal, Snapshot } = composeStories(stories)

// The horizontal gang renders every segment across the rest/hover/active/
// disabled ladder, each labelled by state.
test('renders every horizontal segment and its state label', () => {
  render(Horizontal)
  for (const label of ['REW', 'PLAY', 'FF', 'STOP']) {
    expect(screen.getByText(label)).toBeInTheDocument()
  }
  for (const state of ['rest', 'hover', 'active', 'disabled']) {
    expect(screen.getByText(state)).toBeInTheDocument()
  }
})

// The vertical gang renders every option segment, with one pinned to its
// hover-depressed look.
test('renders every vertical segment including the hover-depressed one', () => {
  render(Vertical)
  for (const label of ['New', 'Open', 'Save', 'Export']) {
    expect(screen.getByText(label)).toBeInTheDocument()
  }
  expect(screen.getByText('hover')).toBeInTheDocument()
})

// Elevation-aware seam ownership under real interaction: PLAY (a segment with
// an interactive neighbour on both sides) drops its own border when it might
// become the pressed/lower one, and FF restores the border it structurally
// drops by default via the peer-hover/peer-active rule, so a hovered/active
// PLAY doesn't leave FF's higher edge dropping a border it should keep.
test('an interactive middle segment can drop its own seam borders and its neighbour can restore its own', () => {
  render(LiveHorizontal)
  const play = screen.getByText('PLAY')
  const ff = screen.getByText('FF')
  expect(play.className).toContain('hover:enabled:border-r-0')
  expect(ff.className).toContain('peer-hover:border-l-[3px]')
})

// Focus ring must not be clipped by a following sibling in paint order.
test('a live segment lifts above its neighbours on focus so its ring is not clipped', () => {
  render(LiveHorizontal)
  const rew = screen.getByText('REW')
  expect(rew.className).toContain('relative')
  expect(rew.className).toContain('focus-visible:z-10')
})

// The single visual snap for GroupedControls: both gangs on one board.
// Baseline: __snaps__/grouped-controls-snap-chromium-linux.png.
// Rebaseline: pnpm test:update.
test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'grouped-controls-snap')
})

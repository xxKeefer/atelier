import { composeStories } from '@storybook/vue3-vite'
import { render, screen } from '@testing-library/vue'
import { expect, test } from 'vitest'
import * as stories from './GroupedControls.stories'
import { snapBoard } from '../../test/snap'

const { Horizontal, Vertical, Snapshot } = composeStories(stories)

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

// The single visual snap for GroupedControls: both gangs on one board.
// Baseline: __snaps__/grouped-controls-snap-chromium-linux.png.
// Rebaseline: pnpm test:update.
test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'grouped-controls-snap')
})

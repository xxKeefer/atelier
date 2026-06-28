import { composeStories } from '@storybook/vue3-vite'
import { render, screen } from '@testing-library/vue'
import { expect, test } from 'vitest'
import * as stories from './Elevation.stories'
import { snapBoard } from '../test/snap'

const { Neutral, Semantics, Snapshot } = composeStories(stories)

// The neutral foundation row renders both families: every surface-ramp step and
// every shadow-ladder rung, each labelled by its token name.
test('renders the neutral ramp steps and ladder rungs', () => {
  render(Neutral)
  for (const name of ['subtle', 'strong', 'sunk', 'half-sunk', 'half-pop', 'pop']) {
    expect(screen.getByText(name)).toBeInTheDocument()
  }
  // 'default' labels both a ramp step and a ladder rung -- assert both render.
  expect(screen.getAllByText('default')).toHaveLength(2)
})

// Every colourway renders a row, labelled by its name.
test('renders a semantic row for every colourway', () => {
  render(Semantics)
  for (const name of ['primary', 'secondary', 'danger', 'success', 'warning', 'info']) {
    expect(screen.getByText(name)).toBeInTheDocument()
  }
})

// The single visual snap for Elevation: the Snapshot story's board (ladder +
// ramp + semantics on one screen). Baseline: __snaps__/elevation-chromium-linux.png.
// Rebaseline: pnpm test:update.
test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'elevation')
})

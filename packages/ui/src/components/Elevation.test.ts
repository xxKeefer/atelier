import { composeStories } from '@storybook/vue3-vite'
import { render, screen } from '@testing-library/vue'
import { expect, test } from 'vitest'
import * as stories from './Elevation.stories'
import { snapBoard } from '../test/snap'

const { ShadowLadder, SurfaceRamp, Semantics, Snapshot } = composeStories(stories)

// Every rung of the ladder renders, labelled by its token name.
test('renders all five shadow rungs', () => {
  render(ShadowLadder)
  for (const name of ['sunk', 'half-sunk', 'default', 'half-pop', 'pop']) {
    expect(screen.getByText(name)).toBeInTheDocument()
  }
})

// Every step of the surface ramp renders, labelled by its token name.
test('renders all three surface steps', () => {
  render(SurfaceRamp)
  for (const name of ['subtle', 'default', 'strong']) {
    expect(screen.getByText(name)).toBeInTheDocument()
  }
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

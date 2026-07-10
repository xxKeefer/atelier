import { composeStories } from '@storybook/vue3-vite'
import { render, screen } from '@testing-library/vue'
import { expect, test } from 'vitest'
import * as stories from './Colour.stories'
import { snapBoard } from '../../test/snap'

const { Primitives, Status, Brand, IconsAndText, Snapshot } = composeStories(stories)

// Every colourway renders as a labelled row.
test('renders a row for every palette colourway', () => {
  render(Primitives)
  for (const name of ['neutral', 'magenta', 'violet', 'red', 'green', 'yellow', 'cyan']) {
    expect(screen.getByText(name)).toBeInTheDocument()
  }
})

// Every shade renders as a labelled column, once (shared header row, not per-swatch).
test('renders a column for every shade', () => {
  render(Primitives)
  for (const shade of [
    '50',
    '100',
    '200',
    '300',
    '400',
    '500',
    '600',
    '700',
    '800',
    '900',
    '950',
  ]) {
    expect(screen.getByText(shade)).toBeInTheDocument()
  }
})

// Every status renders as a labelled row.
test('renders a row for every semantic status', () => {
  render(Status)
  for (const name of ['danger', 'success', 'warning', 'info']) {
    expect(screen.getByText(name)).toBeInTheDocument()
  }
})

// Every surface/edge/text token renders as a labelled column (shared header row).
test('renders a column for every status token', () => {
  render(Status)
  for (const label of [
    'bg',
    'solid',
    'surface-subtle',
    'surface-strong',
    'surface-recess',
    'border',
    'border-subtle',
    'border-default',
    'border-strong',
    'edge',
    'fg',
    'on-solid',
  ]) {
    expect(screen.getByText(label)).toBeInTheDocument()
  }
})

// Every brand row renders as a labelled row.
test('renders a row for every brand', () => {
  render(Brand)
  for (const name of ['primary', 'secondary', 'neutral']) {
    expect(screen.getByText(name)).toBeInTheDocument()
  }
})

// Every surface/border/edge/fg token renders as a labelled column (shared header row).
test('renders a column for every brand token', () => {
  render(Brand)
  for (const label of [
    'surface-subtle',
    'surface-default',
    'surface-strong',
    'border-subtle',
    'border-default',
    'border-strong',
    'edge',
    'fg',
  ]) {
    expect(screen.getByText(label)).toBeInTheDocument()
  }
})

// Every icon/text example row renders with its labelled name.
test('renders a row for every icons-and-text example', () => {
  render(IconsAndText)
  for (const name of [
    'neutral surface-subtle',
    'neutral surface-default',
    'neutral surface-strong',
    'danger bg',
    'danger solid',
    'success bg',
    'success solid',
    'warning bg',
    'warning solid',
    'info bg',
    'info solid',
    'primary default',
    'secondary default',
  ]) {
    expect(screen.getByText(name)).toBeInTheDocument()
  }
})

// The single visual snap for Colour: the Snapshot story's board (primitives,
// status, brand, icons-and-text). Baseline: __snaps__/colour-snap-chromium-linux.png.
// Rebaseline: pnpm test:update.
test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'colour')
})

import { composeStories } from '@storybook/vue3-vite'
import { render, screen } from '@testing-library/vue'
import { expect, test } from 'vitest'
import * as stories from './Colour.stories'

const { Primitives, Status } = composeStories(stories)

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

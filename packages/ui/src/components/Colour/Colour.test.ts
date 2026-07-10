import { composeStories } from '@storybook/vue3-vite'
import { render, screen } from '@testing-library/vue'
import { expect, test } from 'vitest'
import * as stories from './Colour.stories'

const { Primitives } = composeStories(stories)

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

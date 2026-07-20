import { composeStories } from '@storybook/vue3-vite'
import { render, screen } from '@testing-library/vue'
import { expect, test } from 'vitest'
import Spinner from './AtSpinner.vue'
import * as stories from './AtSpinner.stories'
import { snapBoard } from '../../test/snap'

const { Snapshot } = composeStories(stories)

test('spins to signal loading, but respects reduced-motion preference', () => {
  render(Spinner)
  expect(screen.getByTestId('spinner')).toHaveClass('animate-spin', 'motion-reduce:animate-none')
})

test('primary intent (default) colours the glyph with the primary fill token', () => {
  render(Spinner)
  expect(screen.getByTestId('spinner')).toHaveStyle({ color: 'var(--color-primary-default)' })
})

test('danger intent colours the glyph with the danger status fill token', () => {
  render(Spinner, { props: { intent: 'danger' } })
  expect(screen.getByTestId('spinner')).toHaveStyle({ color: 'var(--color-danger-solid)' })
})

test('md size (default) renders at the lg icon size', () => {
  render(Spinner)
  expect(screen.getByTestId('spinner')).toHaveClass('text-lg')
})

test('sm size renders at the md icon size', () => {
  render(Spinner, { props: { size: 'sm' } })
  expect(screen.getByTestId('spinner')).toHaveClass('text-base')
})

test('lg size renders at the 2xl icon size', () => {
  render(Spinner, { props: { size: 'lg' } })
  expect(screen.getByTestId('spinner')).toHaveClass('text-2xl')
})

// No label (default): decorative, e.g. nested inside an already-announced
// parent like a loading Button -- hidden from the a11y tree.
test('is hidden from the a11y tree when no label is given', () => {
  render(Spinner)
  expect(screen.getByTestId('spinner')).toHaveAttribute('aria-hidden', 'true')
})

// A label promotes it to an accessible name for standalone use.
test('exposes an accessible name when a label is given', () => {
  render(Spinner, { props: { label: 'Loading results' } })
  expect(screen.getByRole('img', { name: 'Loading results' })).toBeInTheDocument()
})

test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'spinner')
})

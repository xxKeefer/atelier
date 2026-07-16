import { composeStories } from '@storybook/vue3-vite'
import { render, screen } from '@testing-library/vue'
import { expect, test } from 'vitest'
import ProgressBar from './AtProgressBar.vue'
import * as stories from './AtProgressBar.stories'
import { snapBoard } from '../../test/snap'

const { Snapshot } = composeStories(stories)

// role=progressbar comes from reka-ui's ProgressRoot primitive, present in
// both determinate and indeterminate states.
test('renders with role=progressbar', () => {
  render(ProgressBar, { props: { value: 50 } })
  expect(screen.getByRole('progressbar')).toBeInTheDocument()
})

// A determinate value reports its numeric position for assistive tech.
test('exposes aria-valuenow for a determinate value', () => {
  render(ProgressBar, { props: { value: 40, max: 100 } })
  expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '40')
})

// value omitted (or null) means "duration unknown" -- no numeric position to
// report, so aria-valuenow is absent rather than a misleading 0.
test('omits aria-valuenow when indeterminate', () => {
  render(ProgressBar)
  expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow')
})

test('omits aria-valuenow when value is explicitly null', () => {
  render(ProgressBar, { props: { value: null } })
  expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow')
})

// Visible label renders as text and is wired to the bar via aria-labelledby,
// so the same string serves sighted and assistive-tech users.
test('renders a visible label and associates it with the bar', () => {
  render(ProgressBar, { props: { value: 20, label: 'Uploading file' } })
  expect(screen.getByText('Uploading file')).toBeInTheDocument()
  const bar = screen.getByRole('progressbar')
  const labelId = bar.getAttribute('aria-labelledby')
  expect(labelId).toBeTruthy()
  expect(screen.getByText('Uploading file').id).toBe(labelId)
})

// ariaLabel covers the no-visible-label case -- the accessible name still
// exists even though nothing renders on screen.
test('forwards ariaLabel when no visible label is rendered', () => {
  render(ProgressBar, { props: { value: 20, ariaLabel: 'Upload progress' } })
  expect(screen.getByRole('progressbar')).toHaveAttribute('aria-label', 'Upload progress')
})

// Size is a track-height variant; each size renders a distinct height class.
test.each([
  ['sm', 'h-3'],
  ['md', 'h-4'],
  ['lg', 'h-6'],
] as const)('size=%s applies the %s track height', (size, expectedClass) => {
  render(ProgressBar, { props: { value: 50, size } })
  expect(screen.getByRole('progressbar').className).toContain(expectedClass)
})

// The single visual snap for ProgressBar: sizes and states on one board.
// Baseline: __snaps__/progressbar-chromium-linux.png. Rebaseline: pnpm test:update.
test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'progressbar')
})

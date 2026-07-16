import { composeStories } from '@storybook/vue3-vite'
import { render, screen } from '@testing-library/vue'
import { expect, test } from 'vitest'
import Skeleton from './AtSkeleton.vue'
import * as stories from './AtSkeleton.stories'
import { snapBoard } from '../../test/snap'

const { Snapshot } = composeStories(stories)

// Placeholder chrome, not content -- screen readers should skip it entirely.
test('is hidden from the a11y tree', () => {
  render(Skeleton)
  expect(screen.getByTestId('skeleton')).toHaveAttribute('aria-hidden', 'true')
})

test('rect shape (default) uses the md radius token', () => {
  render(Skeleton)
  expect(screen.getByTestId('skeleton')).toHaveClass('rounded-[var(--radius-md)]')
})

test('circle shape uses the full radius token', () => {
  render(Skeleton, { props: { shape: 'circle' } })
  expect(screen.getByTestId('skeleton')).toHaveClass('rounded-[var(--radius-full)]')
})

test('text shape uses the sm radius token', () => {
  render(Skeleton, { props: { shape: 'text' } })
  expect(screen.getByTestId('skeleton')).toHaveClass('rounded-[var(--radius-sm)]')
})

test('applies width and height from props', () => {
  render(Skeleton, { props: { width: '3rem', height: '2rem' } })
  expect(screen.getByTestId('skeleton')).toHaveStyle({ width: '3rem', height: '2rem' })
})

test('defaults height to a text-line size when not passed', () => {
  render(Skeleton)
  expect(screen.getByTestId('skeleton')).toHaveStyle({ height: '1rem' })
})

test('renders on the recessed surface token', () => {
  render(Skeleton)
  expect(screen.getByTestId('skeleton')).toHaveClass('bg-[var(--color-surface-subtle)]')
})

// The single visual snap for Skeleton: the Snapshot story's board (all three
// shapes at representative sizes). Baseline: __snaps__/skeleton-chromium-linux.png.
// Rebaseline: pnpm test:update.
test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'skeleton')
})

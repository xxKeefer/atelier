import { composeStories } from '@storybook/vue3-vite'
import { render, screen } from '@testing-library/vue'
import { PhTray } from '@phosphor-icons/vue'
import { h } from 'vue'
import { expect, test } from 'vitest'
import EmptyState from './AtEmptyState.vue'
import * as stories from './AtEmptyState.stories'
import { snapBoard } from '../../test/snap'

const { Snapshot } = composeStories(stories)

test('renders the title', () => {
  render(EmptyState, { props: { title: 'No items' } })
  expect(screen.getByTestId('empty-state-title')).toHaveTextContent('No items')
})

test('omits the description when not passed', () => {
  render(EmptyState, { props: { title: 'No items' } })
  expect(screen.queryByTestId('empty-state-description')).not.toBeInTheDocument()
})

test('renders the description when passed', () => {
  render(EmptyState, { props: { title: 'No items', description: 'Add one to get started.' } })
  expect(screen.getByTestId('empty-state-description')).toHaveTextContent('Add one to get started.')
})

test('omits the icon when not passed', () => {
  render(EmptyState, { props: { title: 'No items' } })
  expect(screen.queryByTestId('empty-state-icon')).not.toBeInTheDocument()
})

test('renders the icon when passed', () => {
  render(EmptyState, { props: { title: 'No items', icon: PhTray } })
  expect(screen.getByTestId('empty-state-icon')).toBeInTheDocument()
})

test('defaults to the md size', () => {
  render(EmptyState, { props: { title: 'No items' } })
  expect(screen.getByTestId('empty-state-title')).toHaveClass('text-base')
})

test('sm size uses the smaller title and description scale', () => {
  render(EmptyState, {
    props: { title: 'No items', description: 'Add one.', size: 'sm' },
  })
  expect(screen.getByTestId('empty-state-title')).toHaveClass('text-sm')
  expect(screen.getByTestId('empty-state-description')).toHaveClass('text-xs')
})

test('lg size uses the larger title and description scale', () => {
  render(EmptyState, {
    props: { title: 'No items', description: 'Add one.', size: 'lg' },
  })
  expect(screen.getByTestId('empty-state-title')).toHaveClass('text-lg')
  expect(screen.getByTestId('empty-state-description')).toHaveClass('text-base')
})

test('omits the actions row when the actions slot is empty', () => {
  render(EmptyState, { props: { title: 'No items' } })
  expect(screen.queryByTestId('empty-state-actions')).not.toBeInTheDocument()
})

test('renders passed-in actions slot content', () => {
  render(EmptyState, {
    props: { title: 'No items' },
    slots: { actions: () => h('button', 'Retry') },
  })
  expect(screen.getByTestId('empty-state-actions')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument()
})

// The single visual snap for EmptyState: the Snapshot story's board (every
// size, with and without icon/description/actions). Baseline:
// __snaps__/empty-state-chromium-linux.png. Rebaseline: pnpm test:update.
test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'empty-state')
})

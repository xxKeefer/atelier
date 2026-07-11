import { composeStories } from '@storybook/vue3-vite'
import { render, screen, within } from '@testing-library/vue'
import { expect, test } from 'vitest'
import { h } from 'vue'
import Alert from './AtAlert.vue'
import * as stories from './AtAlert.stories'
import { snapBoard } from '../../test/snap'

const { Snapshot } = composeStories(stories)

// The role announces the alert to assistive tech on mount, for every intent.
test('renders with role=alert', () => {
  render(Alert, { slots: { default: () => 'Something happened' } })
  expect(screen.getByRole('alert')).toHaveTextContent('Something happened')
})

// The default slot is the body message.
test('renders default-slot content in the body', () => {
  render(Alert, { slots: { default: () => 'Body message' } })
  expect(screen.getByTestId('alert-body')).toHaveTextContent('Body message')
})

// title is optional; absent, no bold heading renders.
test('omits the title when unset', () => {
  render(Alert, { slots: { default: () => 'Body' } })
  expect(screen.queryByTestId('alert-title')).toBeNull()
})

// title present renders as a bold heading above the body.
test('renders the title above the body', () => {
  render(Alert, { props: { title: 'Heads up' }, slots: { default: () => 'Body' } })
  expect(screen.getByText('Heads up')).toBeInTheDocument()
})

// Icon is shown by default -- decorative, hidden from the a11y tree, one per
// intent so it carries the role even without colour.
test('shows a decorative role icon by default', () => {
  render(Alert, { slots: { default: () => 'Body' } })
  expect(screen.getByTestId('alert-icon')).toBeInTheDocument()
})

// icon=false suppresses it entirely.
test('omits the icon when icon is false', () => {
  render(Alert, {
    props: { icon: false },
    slots: { default: () => 'Body' },
  })
  expect(screen.queryByTestId('alert-icon')).toBeNull()
})

// Actions are an optional region; absent, no actions row renders.
test('omits the actions region when the slot is unused', () => {
  render(Alert, { slots: { default: () => 'Body' } })
  expect(screen.queryByTestId('alert-actions')).toBeNull()
})

// Actions present render inside the actions region, after the body.
test('renders the actions slot', () => {
  render(Alert, {
    slots: {
      default: () => 'Body',
      actions: () => h('button', 'Retry'),
    },
  })
  const actions = screen.getByTestId('alert-actions')
  expect(within(actions).getByRole('button', { name: 'Retry' })).toBeInTheDocument()
})

// The root is full-width (block-level, no width constraint) so it fills its
// container down to mobile viewports.
test('the root is full width', () => {
  const { container } = render(Alert, { slots: { default: () => 'Body' } })
  // eslint-disable-next-line testing-library/no-node-access
  const root = container.firstElementChild
  expect(root?.className).toContain('w-full')
})

// The single visual snap for Alert: the Snapshot story's board (every intent,
// with actions, and the plain shape, on one screen). Baseline:
// __snaps__/alert-chromium-linux.png. Rebaseline: pnpm test:update.
test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'alert')
})

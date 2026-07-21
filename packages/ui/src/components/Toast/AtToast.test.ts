import { composeStories } from '@storybook/vue3-vite'
import { render, screen, within } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { expect, test } from 'vitest'
import { h } from 'vue'
import Toast from './AtToast.vue'
import * as stories from './AtToast.stories'
import { snapBoard } from '../../test/snap'

const { Snapshot } = composeStories(stories)

// role=status + aria-live=polite: announced without interrupting, unlike Alert.
test('renders with role=status', () => {
  render(Toast, { slots: { default: () => 'Saved successfully' } })
  expect(screen.getByRole('status')).toHaveTextContent('Saved successfully')
})

// The default slot is the body content.
test('renders default-slot content in the body', () => {
  render(Toast, { slots: { default: () => 'Body message' } })
  expect(screen.getByTestId('toast-body')).toHaveTextContent('Body message')
})

// Icon is shown by default -- decorative, one per intent, carries the role
// even without colour.
test('shows a decorative role icon by default', () => {
  render(Toast, { slots: { default: () => 'Body' } })
  expect(screen.getByTestId('toast-icon')).toBeInTheDocument()
})

// icon=false suppresses it entirely.
test('omits the icon when icon is false', () => {
  render(Toast, {
    props: { icon: false },
    slots: { default: () => 'Body' },
  })
  expect(screen.queryByTestId('toast-icon')).toBeNull()
})

// Close button shows by default -- the common case is a permanent toast.
test('renders a close button by default', () => {
  render(Toast, { slots: { default: () => 'Body' } })
  expect(screen.getByTestId('toast-close')).toBeInTheDocument()
})

test('clicking the close button emits close', async () => {
  const view = render(Toast, { slots: { default: () => 'Body' } })
  await userEvent.click(screen.getByTestId('toast-close'))
  expect(view.emitted().close).toHaveLength(1)
})

// showClose is driven from outside -- a wrapper (AtToastProvider) suppresses
// it for toasts it's auto-dismissing on a timer. AtToast owns no timing.
test('omits the close button when showClose is false', () => {
  render(Toast, { props: { showClose: false }, slots: { default: () => 'Body' } })
  expect(screen.queryByTestId('toast-close')).toBeNull()
})

// Actions are an optional region; absent, no actions row renders.
test('omits the actions region when the slot is unused', () => {
  render(Toast, { slots: { default: () => 'Body' } })
  expect(screen.queryByTestId('toast-actions')).toBeNull()
})

// Actions present render inside the actions region, after the body.
test('renders the actions slot', () => {
  render(Toast, {
    slots: {
      default: () => 'Body',
      actions: () => h('button', 'Undo'),
    },
  })
  const actions = screen.getByTestId('toast-actions')
  expect(within(actions).getByRole('button', { name: 'Undo' })).toBeInTheDocument()
})

// Reduced motion: the entry animation is a transition-in stilled by
// motion-reduce, same convention as Spinner/Skeleton's animate-* classes.
test('stills its entry animation under prefers-reduced-motion', () => {
  render(Toast, { slots: { default: () => 'Body' } })
  expect(screen.getByRole('status')).toHaveClass('motion-reduce:transition-none')
})

// The single visual snap for Toast: the Snapshot story's board (every
// intent, plus the plain and composed shapes). Baseline:
// __snaps__/toast-chromium-linux.png. Rebaseline: pnpm test:update.
test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'toast')
})

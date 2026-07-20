import { composeStories } from '@storybook/vue3-vite'
import { render, screen } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { expect, test, vi } from 'vitest'
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

// No timeout -- a close button is the only way to dismiss.
test('renders a close button when no timeout is given', () => {
  render(Toast, { slots: { default: () => 'Body' } })
  expect(screen.getByTestId('toast-close')).toBeInTheDocument()
})

test('clicking the close button emits close', async () => {
  const view = render(Toast, { slots: { default: () => 'Body' } })
  await userEvent.click(screen.getByTestId('toast-close'))
  expect(view.emitted().close).toHaveLength(1)
})

// A timeout suppresses the close button -- the toast dismisses itself.
test('omits the close button when a timeout is given', () => {
  render(Toast, { props: { timeout: 3000 }, slots: { default: () => 'Body' } })
  expect(screen.queryByTestId('toast-close')).toBeNull()
})

test('emits close after the timeout elapses', async () => {
  vi.useFakeTimers()
  const view = render(Toast, { props: { timeout: 3000 }, slots: { default: () => 'Body' } })
  await vi.advanceTimersByTimeAsync(3000)
  expect(view.emitted().close).toHaveLength(1)
  vi.useRealTimers()
})

// Focus inside the toast pauses the timeout; it resumes once focus leaves.
// A real focusable descendant (e.g. a future action button) is needed to
// exercise this -- the toast root itself isn't focusable.
test('pauses the timeout while focus is inside the toast', async () => {
  vi.useFakeTimers()
  const view = render(Toast, {
    props: { timeout: 3000 },
    slots: { default: () => h('button', 'Action') },
  })
  const action = screen.getByRole('button', { name: 'Action' })
  action.focus()
  await vi.advanceTimersByTimeAsync(3000)
  expect(view.emitted().close).toBeUndefined()

  action.blur()
  await vi.advanceTimersByTimeAsync(3000)
  expect(view.emitted().close).toHaveLength(1)
  vi.useRealTimers()
})

// The single visual snap for Toast: the Snapshot story's board (every
// intent, plus the plain and composed shapes). Baseline:
// __snaps__/toast-chromium-linux.png. Rebaseline: pnpm test:update.
test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'toast')
})

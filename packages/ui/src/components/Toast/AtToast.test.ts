import { composeStories } from '@storybook/vue3-vite'
import { render, screen } from '@testing-library/vue'
import { expect, test } from 'vitest'
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

// The single visual snap for Toast: the Snapshot story's board (every
// intent, plus the plain and composed shapes). Baseline:
// __snaps__/toast-chromium-linux.png. Rebaseline: pnpm test:update.
test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'toast')
})

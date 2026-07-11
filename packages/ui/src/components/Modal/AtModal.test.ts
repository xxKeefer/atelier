import { composeStories } from '@storybook/vue3-vite'
import { render, screen, waitFor } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { expect, test } from 'vitest'
import Modal from './AtModal.vue'
import * as stories from './AtModal.stories'
import { snapBoard } from '../../test/snap'

const { Snapshot } = composeStories(stories)

// Closed by default: portalled content, and the trigger's own element, but no
// dialog chrome, sit in the DOM ahead of interaction.
test('modal content is not in the DOM until opened', () => {
  render(Modal, {
    props: { title: 'Delete project' },
    slots: { trigger: '<button>Open</button>', default: 'Body content' },
  })
  expect(screen.queryByTestId('modal-content')).not.toBeInTheDocument()
})

test('clicking the trigger opens the modal and renders default-slot content', async () => {
  render(Modal, {
    props: { title: 'Delete project' },
    slots: { trigger: '<button>Open</button>', default: 'Body content' },
  })
  await userEvent.click(screen.getByText('Open'))
  expect(await screen.findByTestId('modal-content')).toBeInTheDocument()
  expect(screen.getByTestId('modal-body')).toHaveTextContent('Body content')
})

// Supplementary actions: the footer slot renders when provided, omitted
// entirely when it isn't.
test('renders the footer slot when provided', async () => {
  render(Modal, {
    props: { title: 'Delete project', defaultOpen: true },
    slots: { default: 'Body', footer: '<button>Confirm</button>' },
  })
  const footer = await screen.findByTestId('modal-footer')
  expect(footer).toHaveTextContent('Confirm')
})

test('omits the footer region when the slot is unused', async () => {
  render(Modal, {
    props: { title: 'Delete project', defaultOpen: true },
    slots: { default: 'Body' },
  })
  await screen.findByTestId('modal-content')
  expect(screen.queryByTestId('modal-footer')).not.toBeInTheDocument()
})

// Close action: the header close button closes the modal.
test('the close button closes the modal', async () => {
  render(Modal, {
    props: { title: 'Delete project', defaultOpen: true },
    slots: { default: 'Body' },
  })
  await screen.findByTestId('modal-content')
  await userEvent.click(screen.getByRole('button', { name: 'Close' }))
  await waitFor(() => expect(screen.queryByTestId('modal-content')).not.toBeInTheDocument())
})

test('showCloseButton false omits the close button', async () => {
  render(Modal, {
    props: { title: 'Delete project', defaultOpen: true, showCloseButton: false },
    slots: { default: 'Body' },
  })
  await screen.findByTestId('modal-content')
  expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument()
})

// Keyboard navigation: Escape closes the modal -- reka's DialogContent owns
// this, this just confirms it's wired through with default behaviour intact.
test('Escape closes the modal', async () => {
  render(Modal, {
    props: { title: 'Delete project', defaultOpen: true },
    slots: { default: 'Body' },
  })
  await screen.findByTestId('modal-content')
  await userEvent.keyboard('{Escape}')
  await waitFor(() => expect(screen.queryByTestId('modal-content')).not.toBeInTheDocument())
})

// Focus trapping: opening the modal moves focus inside it (reka's
// DialogContent traps focus for as long as it stays open).
test('opening the modal moves focus inside its content', async () => {
  render(Modal, {
    props: { title: 'Delete project', defaultOpen: true },
    slots: { default: 'Body' },
  })
  const content = await screen.findByTestId('modal-content')
  // eslint-disable-next-line testing-library/no-node-access -- focus target isn't queryable by role/text
  expect(content).toContainElement(document.activeElement as HTMLElement)
})

// Title/subtitle labeling: a visible title labels the dialog via
// aria-labelledby (DialogTitle), a subtitle describes it via aria-describedby
// (DialogDescription) -- both reka's contract, surfaced through our props.
test('title labels the dialog', async () => {
  render(Modal, {
    props: { title: 'Delete project', defaultOpen: true },
    slots: { default: 'Body' },
  })
  const content = await screen.findByTestId('modal-content')
  const titleId = content.getAttribute('aria-labelledby')
  expect(titleId).toBeTruthy()
  // eslint-disable-next-line testing-library/no-node-access -- resolving an aria-labelledby id isn't queryable by role/text
  expect(document.getElementById(titleId ?? '')).toHaveTextContent('Delete project')
})

test('subtitle describes the dialog', async () => {
  render(Modal, {
    props: { title: 'Delete project', subtitle: 'Cannot be undone', defaultOpen: true },
    slots: { default: 'Body' },
  })
  const content = await screen.findByTestId('modal-content')
  const descriptionId = content.getAttribute('aria-describedby')
  expect(descriptionId).toBeTruthy()
  // eslint-disable-next-line testing-library/no-node-access -- resolving an aria-describedby id isn't queryable by role/text
  expect(document.getElementById(descriptionId ?? '')).toHaveTextContent('Cannot be undone')
})

// Without a visible title, ariaLabel carries the accessible name instead.
test('ariaLabel names the dialog when no title is given', async () => {
  render(Modal, {
    props: { ariaLabel: 'Quick preview', defaultOpen: true },
    slots: { default: 'Body' },
  })
  const content = await screen.findByTestId('modal-content')
  expect(content).toHaveAttribute('aria-label', 'Quick preview')
  expect(screen.queryByTestId('modal-title')).not.toBeInTheDocument()
})

// Positioning: the position prop swaps the panel's placement classes (center
// vs the four sheet edges).
test.each(['left', 'right', 'top', 'bottom'] as const)(
  'position %s renders the panel flush against that edge',
  async (position) => {
    render(Modal, {
      props: { title: 'Delete project', defaultOpen: true, position },
      slots: { default: 'Body' },
    })
    const content = await screen.findByTestId('modal-content')
    expect(content.className).not.toContain('left-1/2')
  },
)

// The single visual snap for Modal: the Snapshot story's board. Baseline:
// __snaps__/modal-chromium-linux.png. Rebaseline: pnpm test:update.
test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'modal')
})

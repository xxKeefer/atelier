import { composeStories } from '@storybook/vue3-vite'
import { render, screen } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { expect, test } from 'vitest'
import Popover from './AtPopover.vue'
import * as stories from './AtPopover.stories'
import { snapBoard } from '../../test/snap'

const { Snapshot } = composeStories(stories)

// The popover is portalled and only mounts once open -- closed by default,
// no content sitting in the DOM ahead of interaction.
test('popover content is not in the DOM until triggered', () => {
  render(Popover, {
    slots: {
      trigger: '<button type="button">Open</button>',
      default: 'Content',
    },
  })
  expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument()
})

// Clicking the trigger reveals the content (reka-ui's Popover renders it
// with role="dialog"); clicking the trigger again closes it.
test('clicking the trigger opens and closes the popover', async () => {
  render(Popover, {
    slots: {
      trigger: '<button type="button">Open</button>',
      default: 'Content',
    },
  })
  const trigger = screen.getByRole('button', { name: 'Open' })

  await userEvent.click(trigger)
  expect(await screen.findByTestId('popover-content')).toHaveTextContent('Content')

  await userEvent.click(trigger)
  expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument()
})

// Keyboard: Tab focuses the trigger without opening it (unlike AtTooltip,
// a popover's content is dense/interactive and only click/Enter/Space
// should summon it) -- confirms no hand-rolled focus-open leaked in from
// AtDropdown's pattern.
test('tabbing to the trigger does not open the popover', async () => {
  render(Popover, {
    slots: {
      trigger: '<button type="button">Open</button>',
      default: 'Content',
    },
  })
  await userEvent.tab()
  expect(screen.getByRole('button', { name: 'Open' })).toHaveFocus()
  expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument()
})

// Escape closes the content and returns focus to the trigger -- reka-ui's
// Popover primitives give this for free; this confirms it still holds
// through our wrapper rather than hand-rolling it.
test('pressing Escape closes the popover and returns focus to the trigger', async () => {
  render(Popover, {
    slots: {
      trigger: '<button type="button">Open</button>',
      default: 'Content',
    },
  })
  const trigger = screen.getByRole('button', { name: 'Open' })

  await userEvent.click(trigger)
  expect(await screen.findByTestId('popover-content')).toBeInTheDocument()

  await userEvent.keyboard('{Escape}')
  expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument()
  expect(trigger).toHaveFocus()
})

// Clicking outside the popover closes it -- reka-ui's DismissableLayer
// handles this natively (non-modal Popover, unlike AtDropdown, needs no
// hand-rolled hover-close to match).
test('clicking outside closes the popover', async () => {
  render(Popover, {
    slots: {
      trigger: '<button type="button">Open</button>',
      default: 'Content',
    },
  })
  const trigger = screen.getByRole('button', { name: 'Open' })

  await userEvent.click(trigger)
  expect(await screen.findByTestId('popover-content')).toBeInTheDocument()

  await userEvent.click(document.body)
  expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument()
})

// Positioning: the requested side comes through to the rendered content as
// reka's data-side hook, confirming the prop is wired to the primitive.
test('side prop sets the preferred placement', async () => {
  render(Popover, {
    props: { side: 'right' },
    slots: {
      trigger: '<button type="button">Open</button>',
      default: 'Content',
    },
  })
  await userEvent.click(screen.getByRole('button', { name: 'Open' }))
  expect(await screen.findByTestId('popover-content')).toHaveAttribute('data-side', 'right')
})

// Positioning: same for align, confirming it reaches the primitive too.
test('align prop sets the preferred alignment', async () => {
  render(Popover, {
    props: { align: 'start' },
    slots: {
      trigger: '<button type="button">Open</button>',
      default: 'Content',
    },
  })
  await userEvent.click(screen.getByRole('button', { name: 'Open' }))
  expect(await screen.findByTestId('popover-content')).toHaveAttribute('data-align', 'start')
})

// The single visual snap for Popover: the Snapshot story's board. Baseline:
// __snaps__/popover-chromium-linux.png. Rebaseline: pnpm test:update.
test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'popover')
})

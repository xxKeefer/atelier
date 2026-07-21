import { composeStories } from '@storybook/vue3-vite'
import { render, screen } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { expect, test } from 'vitest'
import Dropdown from './AtDropdown.vue'
import * as stories from './AtDropdown.stories'
import { snapBoard } from '../../test/snap'

const { Snapshot } = composeStories(stories)

// Clicking the trigger reveals the content (reka-ui's DropdownMenu renders it
// with role="menu"); clicking the trigger again closes it.
test('clicking the trigger opens and closes the dropdown', async () => {
  render(Dropdown, {
    slots: {
      trigger: '<button type="button">Open</button>',
      default: '<div>Content</div>',
    },
  })
  const trigger = screen.getByRole('button', { name: 'Open' })

  await userEvent.click(trigger)
  expect(screen.getByRole('menu')).toBeInTheDocument()

  await userEvent.click(trigger)
  expect(screen.queryByRole('menu')).not.toBeInTheDocument()
})

// Hovering the trigger opens the dropdown -- reka-ui's DropdownMenu has no
// built-in hover support (confirmed by reading its source: trigger only
// reacts to click/Enter/Space/ArrowDown), so this is hand-rolled. The open is
// deliberately delayed (mirrors AtTooltip's hover delay) so a real click's
// own incidental mouseenter doesn't race its click-toggle -- so this waits
// for the delay to elapse via findByRole rather than asserting immediately.
test('hovering the trigger opens the dropdown', async () => {
  render(Dropdown, {
    slots: {
      trigger: '<button type="button">Open</button>',
      default: '<div>Content</div>',
    },
  })
  const trigger = screen.getByRole('button', { name: 'Open' })

  await userEvent.hover(trigger)
  expect(await screen.findByRole('menu')).toBeInTheDocument()
})

// Focusing the trigger via keyboard (Tab) opens the dropdown -- same
// hover-parity requirement as above, applied to keyboard users. Tabbing in
// (rather than a programmatic .focus()) is what actually satisfies
// :focus-visible, which the component uses to tell keyboard focus apart from
// the incidental focus a mouse click also produces (see AtDropdown.vue).
test('tabbing to the trigger opens the dropdown', async () => {
  render(Dropdown, {
    slots: {
      trigger: '<button type="button">Open</button>',
      default: '<div>Content</div>',
    },
  })
  await userEvent.tab()
  expect(screen.getByRole('menu')).toBeInTheDocument()
})

// Escape closes the content and returns focus to the trigger -- reka-ui's
// DropdownMenu gives this for free; this confirms it still holds through our
// wrapper rather than hand-rolling it.
test('pressing Escape closes the dropdown and returns focus to the trigger', async () => {
  render(Dropdown, {
    slots: {
      trigger: '<button type="button">Open</button>',
      default: '<div>Content</div>',
    },
  })
  const trigger = screen.getByRole('button', { name: 'Open' })

  await userEvent.click(trigger)
  expect(screen.getByRole('menu')).toBeInTheDocument()

  await userEvent.keyboard('{Escape}')
  expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  expect(trigger).toHaveFocus()
})

// The single visual snap for Dropdown: the Snapshot story's board. Baseline:
// __snaps__/dropdown-chromium-linux.png. Rebaseline: pnpm test:update.
test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'dropdown')
})

import { composeStories } from '@storybook/vue3-vite'
import { render, screen } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { expect, test } from 'vitest'
import { h } from 'vue'
import Dropdown from './AtDropdown.vue'
import DropdownItem from './AtDropdownItem.vue'
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
  expect(await screen.findByRole('menu')).toBeInTheDocument()

  await userEvent.click(trigger)
  expect(screen.queryByRole('menu')).not.toBeInTheDocument()
})

// Focusing the trigger via keyboard (Tab) opens the dropdown. Tabbing in
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
  expect(await screen.findByRole('menu')).toBeInTheDocument()
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
  expect(await screen.findByRole('menu')).toBeInTheDocument()

  await userEvent.keyboard('{Escape}')
  expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  expect(trigger).toHaveFocus()
})

// Opening via keyboard (Tab, which our hand-rolled focus-open opens
// immediately) moves focus onto the first item: reka-ui's MenuContent only
// auto-focuses the first item on a keyboard-driven open (MenuContentImpl.vue's
// `entry-focus` handler skips it otherwise), and Tab satisfies that. Uses real
// AtDropdownItems since reka-ui's roving-focus collection only tracks its own
// MenuItem-registered children.
test('opening the dropdown via keyboard moves focus onto the first item', async () => {
  render(Dropdown, {
    slots: {
      trigger: () => h('button', { type: 'button' }, 'Open'),
      default: () => [h(DropdownItem, {}, () => 'First'), h(DropdownItem, {}, () => 'Second')],
    },
  })

  await userEvent.tab()
  await expect.element(screen.getByText('First')).toHaveFocus()
})

// Tabbing away from the content closes it: reka-ui's MenuContent swallows Tab
// while focus is inside (MenuContentImpl.vue's handleKeyDown, by design), so
// without this Tab-close, focus would be stuck inside a menu that never
// releases it.
test('tabbing away from the content closes the dropdown', async () => {
  render(Dropdown, {
    slots: {
      trigger: () => h('button', { type: 'button' }, 'Open'),
      default: () => [h(DropdownItem, {}, () => 'First'), h(DropdownItem, {}, () => 'Second')],
    },
  })
  const trigger = screen.getByRole('button', { name: 'Open' })

  await userEvent.click(trigger)
  expect(await screen.findByRole('menu')).toBeInTheDocument()

  await userEvent.tab()
  expect(screen.queryByRole('menu')).not.toBeInTheDocument()
})

// The single visual snap for Dropdown: the Snapshot story's board. Baseline:
// __snaps__/dropdown-chromium-linux.png. Rebaseline: pnpm test:update.
test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'dropdown')
})

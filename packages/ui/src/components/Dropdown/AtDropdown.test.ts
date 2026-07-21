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

// Opening the dropdown via keyboard (Tab onto the trigger, which our
// hand-rolled focus-open opens immediately -- see AtDropdown.vue) moves focus
// onto its first item. reka-ui's MenuContent only auto-focuses the first item
// when the open was keyboard-driven (confirmed by reading
// MenuContentImpl.vue: its `entry-focus` handler calls `event.preventDefault()`
// unless `rootContext.isUsingKeyboardRef` is true, deliberately not yanking
// focus for a mouse-click open) -- Tab itself is a keyboard event, so that
// condition is already satisfied by the time the dropdown opens. Uses real
// AtDropdownItems, not plain divs, since reka-ui's roving-focus collection
// only tracks items registered through its own MenuItem component.
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

// Tabbing away from the dropdown's content closes it -- this is the
// "keyboard navigation" AC's separate close action. reka-ui's MenuContent
// itself swallows the Tab keydown while focus is inside (by design, menus
// aren't Tab-navigated internally -- see MenuContentImpl.vue's handleKeyDown),
// so without AtDropdown closing on Tab itself, focus would be stuck inside a
// menu that never releases it.
test('tabbing away from the content closes the dropdown', async () => {
  render(Dropdown, {
    slots: {
      trigger: () => h('button', { type: 'button' }, 'Open'),
      default: () => [h(DropdownItem, {}, () => 'First'), h(DropdownItem, {}, () => 'Second')],
    },
  })
  const trigger = screen.getByRole('button', { name: 'Open' })

  await userEvent.click(trigger)
  expect(screen.getByRole('menu')).toBeInTheDocument()

  await userEvent.tab()
  expect(screen.queryByRole('menu')).not.toBeInTheDocument()
})

// The single visual snap for Dropdown: the Snapshot story's board. Baseline:
// __snaps__/dropdown-chromium-linux.png. Rebaseline: pnpm test:update.
test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'dropdown')
})

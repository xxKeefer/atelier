import { composeStories } from '@storybook/vue3-vite'
import { render, screen, within } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { expect, test } from 'vitest'
import { h } from 'vue'
import Listbox from './AtListbox.vue'
import ListboxGroup from './AtListboxGroup.vue'
import ListboxGroupLabel from './AtListboxGroupLabel.vue'
import ListboxItem from './AtListboxItem.vue'
import * as stories from './AtListbox.stories'
import { snapBoard } from '../../test/snap'

const { Snapshot } = composeStories(stories)

const fruitItems = () => [
  h(ListboxItem, { value: 'apple' }, () => 'Apple'),
  h(ListboxItem, { value: 'banana' }, () => 'Banana'),
  h(ListboxItem, { value: 'cherry' }, () => 'Cherry'),
]

// role="listbox"/"option" and aria-selected come free from reka-ui's Listbox
// primitives -- this confirms that holds through our wrapper rather than
// hand-adding them.
test('exposes listbox/option roles with aria-selected reflecting the selection', async () => {
  render(Listbox, {
    props: { modelValue: 'banana' },
    attrs: { 'aria-label': 'Fruit' },
    slots: { default: fruitItems },
  })
  expect(await screen.findByRole('listbox', { name: 'Fruit' })).toBeInTheDocument()
  const apple = screen.getByRole('option', { name: 'Apple' })
  const banana = screen.getByRole('option', { name: 'Banana' })
  expect(apple).toHaveAttribute('aria-selected', 'false')
  expect(banana).toHaveAttribute('aria-selected', 'true')
})

// Clicking an item selects it, replacing whatever was previously selected --
// single-select, not toggle-accumulate.
test('clicking an item emits its value and replaces the previous selection', async () => {
  const view = render(Listbox, {
    props: { modelValue: 'apple' },
    attrs: { 'aria-label': 'Fruit' },
    slots: { default: fruitItems },
  })

  await userEvent.click(screen.getByRole('option', { name: 'Banana' }))
  expect(view.emitted()['update:modelValue']?.at(-1)).toEqual(['banana'])
})

// Arrow keys move the highlighted item; Home/End jump to first/last. Free
// from reka-ui's ListboxContent -- this confirms it holds through our wrapper.
test('arrow keys move focus between items, Home/End jump to the ends', async () => {
  render(Listbox, {
    attrs: { 'aria-label': 'Fruit' },
    slots: { default: fruitItems },
  })

  // Tabbing in lands on the roving-tabindex target: the first item, already
  // highlighted on mount.
  await userEvent.tab()
  await expect.element(screen.getByRole('option', { name: 'Apple' })).toHaveFocus()

  await userEvent.keyboard('{ArrowDown}')
  await expect.element(screen.getByRole('option', { name: 'Banana' })).toHaveFocus()

  await userEvent.keyboard('{End}')
  await expect.element(screen.getByRole('option', { name: 'Cherry' })).toHaveFocus()

  await userEvent.keyboard('{Home}')
  await expect.element(screen.getByRole('option', { name: 'Apple' })).toHaveFocus()
})

// Enter selects the highlighted item.
test('pressing Enter selects the highlighted item', async () => {
  const view = render(Listbox, {
    attrs: { 'aria-label': 'Fruit' },
    slots: { default: fruitItems },
  })

  // Tabbing in lands on the first item, already highlighted on mount.
  await userEvent.tab()
  await userEvent.keyboard('{Enter}')
  expect(view.emitted()['update:modelValue']?.at(-1)).toEqual(['apple'])
})

// Space also selects the highlighted item.
test('pressing Space selects the highlighted item', async () => {
  const view = render(Listbox, {
    attrs: { 'aria-label': 'Fruit' },
    slots: { default: fruitItems },
  })

  // Tabbing in lands on the first item, already highlighted on mount.
  await userEvent.tab()
  await userEvent.keyboard(' ')
  expect(view.emitted()['update:modelValue']?.at(-1)).toEqual(['apple'])
})

// A disabled item is excluded from keyboard navigation and cannot be
// selected -- reka-ui's Listbox collection filters it out for free.
test('a disabled item is skipped by keyboard navigation and cannot be selected', async () => {
  const view = render(Listbox, {
    attrs: { 'aria-label': 'Fruit' },
    slots: {
      default: () => [
        h(ListboxItem, { value: 'apple' }, () => 'Apple'),
        h(ListboxItem, { value: 'banana', disabled: true }, () => 'Banana'),
        h(ListboxItem, { value: 'cherry' }, () => 'Cherry'),
      ],
    },
  })

  // Tabbing in lands on Apple, already highlighted on mount; one ArrowDown
  // skips the disabled Banana entirely, landing straight on Cherry.
  await userEvent.tab()
  await userEvent.keyboard('{ArrowDown}')
  await expect.element(screen.getByRole('option', { name: 'Cherry' })).toHaveFocus()

  await userEvent.click(screen.getByRole('option', { name: 'Banana' }))
  expect(view.emitted()['update:modelValue']).toBeUndefined()
})

// Multi mode: modelValue is an array, and selecting an item toggles its
// membership instead of replacing the previous selection.
test('in multiple mode, clicking an item toggles its membership in the array', async () => {
  const view = render(Listbox, {
    props: { multiple: true, modelValue: ['apple'] },
    attrs: { 'aria-label': 'Fruit' },
    slots: { default: fruitItems },
  })

  await userEvent.click(screen.getByRole('option', { name: 'Banana' }))
  expect(view.emitted()['update:modelValue']?.at(-1)).toEqual([['apple', 'banana']])
})

// Toggling an already-selected item off, rather than replacing the array.
test('in multiple mode, clicking a selected item removes it from the array', async () => {
  const view = render(Listbox, {
    props: { multiple: true, modelValue: ['apple', 'banana'] },
    attrs: { 'aria-label': 'Fruit' },
    slots: { default: fruitItems },
  })

  await userEvent.click(screen.getByRole('option', { name: 'Apple' }))
  expect(view.emitted()['update:modelValue']?.at(-1)).toEqual([['banana']])
})

// Multi mode's selected items each get an explicit checkmark indicator, on
// top of Phase 1's pinned-rung chrome.
test('in multiple mode, selected items show a checkmark indicator', () => {
  render(Listbox, {
    props: { multiple: true, modelValue: ['apple'] },
    attrs: { 'aria-label': 'Fruit' },
    slots: { default: fruitItems },
  })

  const apple = screen.getByRole('option', { name: 'Apple' })
  const banana = screen.getByRole('option', { name: 'Banana' })
  expect(within(apple).getByTestId('listbox-item-indicator')).toBeInTheDocument()
  expect(within(banana).queryByTestId('listbox-item-indicator')).not.toBeInTheDocument()
})

// Single mode never renders the indicator -- Phase 1's pinned-rung chrome
// alone still carries the selected state.
test('in single mode, selected items do not show the checkmark indicator', () => {
  render(Listbox, {
    props: { modelValue: 'apple' },
    attrs: { 'aria-label': 'Fruit' },
    slots: { default: fruitItems },
  })

  const apple = screen.getByRole('option', { name: 'Apple' })
  expect(within(apple).queryByTestId('listbox-item-indicator')).not.toBeInTheDocument()
})

// Arrow/Home/End navigation continue to work identically in multi mode.
test('arrow/Home/End keyboard navigation still works in multiple mode', async () => {
  render(Listbox, {
    props: { multiple: true },
    attrs: { 'aria-label': 'Fruit' },
    slots: { default: fruitItems },
  })

  await userEvent.tab()
  await expect.element(screen.getByRole('option', { name: 'Apple' })).toHaveFocus()

  await userEvent.keyboard('{ArrowDown}')
  await expect.element(screen.getByRole('option', { name: 'Banana' })).toHaveFocus()

  await userEvent.keyboard('{End}')
  await expect.element(screen.getByRole('option', { name: 'Cherry' })).toHaveFocus()

  await userEvent.keyboard('{Home}')
  await expect.element(screen.getByRole('option', { name: 'Apple' })).toHaveFocus()
})

// Enter/Space still toggle-select the highlighted item in multi mode --
// against an empty selection, toggling adds the item.
test('pressing Enter or Space toggle-selects the highlighted item in multiple mode', async () => {
  const view = render(Listbox, {
    props: { multiple: true },
    attrs: { 'aria-label': 'Fruit' },
    slots: { default: fruitItems },
  })

  await userEvent.tab()
  await userEvent.keyboard('{Enter}')
  expect(view.emitted()['update:modelValue']?.at(-1)).toEqual([['apple']])

  await userEvent.keyboard(' ')
  expect(view.emitted()['update:modelValue']?.at(-1)).toEqual([[]])
})

// Groups organise items under a labelled heading, exposed as role="group"
// with an accessible name from AtListboxGroupLabel -- confirmed free from
// reka-ui rather than hand-added.
test('a group exposes role=group labelled by its AtListboxGroupLabel', () => {
  render(Listbox, {
    attrs: { 'aria-label': 'Produce' },
    slots: {
      default: () =>
        h(
          ListboxGroup,
          {},
          {
            label: () => h(ListboxGroupLabel, {}, () => 'Fruit'),
            default: () => [h(ListboxItem, { value: 'apple' }, () => 'Apple')],
          },
        ),
    },
  })
  expect(screen.getByRole('group', { name: 'Fruit' })).toBeInTheDocument()
})

// Zero items renders the static empty-state row in place of the list.
test('renders a static empty-state row when there are no items', () => {
  render(Listbox, { attrs: { 'aria-label': 'Fruit' } })
  expect(screen.getByTestId('listbox-empty')).toBeInTheDocument()
  expect(screen.getByText('No results')).toBeInTheDocument()
  expect(screen.queryByRole('option')).not.toBeInTheDocument()
})

// The single visual snap for Listbox: the Snapshot story's board. Baseline:
// __snaps__/listbox-chromium-linux.png. Rebaseline: pnpm test:update.
test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'listbox')
})

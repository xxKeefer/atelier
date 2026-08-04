import { composeStories } from '@storybook/vue3-vite'
import { render, screen } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { defineComponent, h, type PropType } from 'vue'
import { expect, test } from 'vitest'
import Combobox from './AtCombobox.vue'
import * as stories from './AtCombobox.stories'
import { snapBoard } from '../../test/snap'

// A sibling focusable element to tab/click to, so blur's relatedTarget is
// populated -- reka-ui's blur handler no-ops without one (see ComboboxInput's
// handleBlur), which the bare component under test alone can't exercise.
const WithSibling = defineComponent({
  props: {
    options: { type: Array as PropType<{ value: string; label: string }[]>, required: true },
  },
  setup: (props) => () =>
    h('div', [
      h(Combobox, { options: props.options, 'aria-label': 'Fruit' }),
      h('button', 'Elsewhere'),
    ]),
})

const { Snapshot } = composeStories(stories)

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]

test('renders a text input trigger', () => {
  render(Combobox, { props: { options }, attrs: { 'aria-label': 'Fruit' } })
  expect(screen.getByRole('combobox', { name: 'Fruit' })).toBeInTheDocument()
})

// Typing filters the option list by label substring via reka-ui's built-in
// filter (ignoreFilter left false).
test('typing filters the option list', async () => {
  render(Combobox, { props: { options }, attrs: { 'aria-label': 'Fruit' } })
  const input = screen.getByRole('combobox', { name: 'Fruit' })
  await userEvent.click(input)
  await userEvent.type(input, 'ban')
  expect(await screen.findByRole('option', { name: 'Banana' })).toBeInTheDocument()
  expect(screen.queryByRole('option', { name: 'Apple' })).not.toBeInTheDocument()
})

// Picking an option emits the option's value, and the input display switches
// to that option's label.
test('selecting an option sets modelValue and displays its label', async () => {
  const view = render(Combobox, { props: { options }, attrs: { 'aria-label': 'Fruit' } })
  const input = screen.getByRole('combobox', { name: 'Fruit' })
  await userEvent.click(input)
  await userEvent.click(await screen.findByRole('option', { name: 'Banana' }))
  expect(view.emitted()['update:modelValue']?.at(-1)).toEqual(['banana'])
  expect(await screen.findByDisplayValue('Banana')).toBeInTheDocument()
})

// Strict selection: typed text that doesn't match anything, left unselected
// on blur, reverts the input display back to the last valid selection's
// label -- never commits raw typed text as the value.
test('typing unmatched text then blurring reverts to the last valid selection', async () => {
  render(WithSibling, { props: { options } })
  const input = screen.getByRole('combobox', { name: 'Fruit' })
  await userEvent.click(input)
  await userEvent.click(await screen.findByRole('option', { name: 'Banana' }))
  await screen.findByDisplayValue('Banana')
  await userEvent.type(input, 'zzz')
  await userEvent.click(screen.getByRole('button', { name: 'Elsewhere' }))
  expect(input).toHaveValue('Banana')
})

// Strict selection with nothing previously selected: unmatched typed text
// reverts to empty on blur, since there is no last valid selection.
test('typing unmatched text with no prior selection reverts to empty on blur', async () => {
  render(WithSibling, { props: { options } })
  const input = screen.getByRole('combobox', { name: 'Fruit' })
  await userEvent.click(input)
  await userEvent.type(input, 'zzz')
  await userEvent.click(screen.getByRole('button', { name: 'Elsewhere' }))
  expect(input).toHaveValue('')
})

// When the typed filter matches zero options, a static "No results" row
// renders in the options menu.
test('shows a no-match row when the filter matches zero options', async () => {
  render(Combobox, { props: { options }, attrs: { 'aria-label': 'Fruit' } })
  const input = screen.getByRole('combobox', { name: 'Fruit' })
  await userEvent.click(input)
  await userEvent.type(input, 'zzz')
  expect(await screen.findByText('No results')).toBeInTheDocument()
})

// Display-only placeholder text shows in the input when no value is selected.
test('shows placeholder text when no value is selected', () => {
  render(Combobox, {
    props: { options, placeholder: 'Pick a fruit' },
    attrs: { 'aria-label': 'Fruit' },
  })
  expect(screen.getByPlaceholderText('Pick a fruit')).toBeInTheDocument()
})

// Clicking a visible label focuses/opens the combobox -- reka-ui's trigger
// reacts to pointerdown, not the native label-for click-forwarding.
test('clicking the label opens the combobox', async () => {
  render(Combobox, { props: { options, label: 'Fruit' } })
  await userEvent.click(screen.getByText('Fruit'))
  expect(await screen.findByRole('option', { name: 'Banana' })).toBeInTheDocument()
})

// The single visual snap for Combobox: the Snapshot story's board. Baseline:
// __snaps__/combobox-chromium-linux.png. Rebaseline: pnpm test:update.
test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'combobox')
})

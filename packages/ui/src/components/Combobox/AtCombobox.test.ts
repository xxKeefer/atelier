import { composeStories } from '@storybook/vue3-vite'
import { render, screen } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { defineComponent, h, type PropType, ref } from 'vue'
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

// The clear button is gated on the component's own modelValue prop, not
// reka-ui's internal (passive-mode) selection state -- exercising it needs a
// real v-model round trip, unlike the other tests above which only assert on
// emitted events or the DOM input's own display text.
const WithModel = defineComponent({
  props: {
    options: { type: Array as PropType<{ value: string; label: string }[]>, required: true },
  },
  setup: (props) => {
    const value = ref('')
    return () =>
      h(Combobox, {
        options: props.options,
        'aria-label': 'Fruit',
        modelValue: value.value,
        'onUpdate:modelValue': (v: string) => (value.value = v),
      })
  },
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

// With no visible label, the accessible name falls through from a forwarded
// aria-label so the field still announces its purpose.
test('a bare field takes its accessible name from a forwarded aria-label', () => {
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

// The clear (X) affordance only shows once a value is selected.
test('does not show a clear button when no value is selected', () => {
  render(Combobox, { props: { options }, attrs: { 'aria-label': 'Fruit' } })
  expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument()
})

test('shows a clear button once a value is selected', async () => {
  render(WithModel, { props: { options } })
  const input = screen.getByRole('combobox', { name: 'Fruit' })
  await userEvent.click(input)
  await userEvent.click(await screen.findByRole('option', { name: 'Banana' }))
  expect(await screen.findByRole('button', { name: 'Clear' })).toBeInTheDocument()
})

// Clicking clear resets modelValue and the displayed text, closes the menu,
// and does not leave a clear button behind (nothing selected any more).
test('clicking clear resets modelValue and the input display', async () => {
  render(WithModel, { props: { options } })
  const input = screen.getByRole('combobox', { name: 'Fruit' })
  await userEvent.click(input)
  await userEvent.click(await screen.findByRole('option', { name: 'Banana' }))
  await userEvent.click(await screen.findByRole('button', { name: 'Clear' }))
  expect(input).toHaveValue('')
  expect(screen.queryByRole('option', { name: 'Banana' })).not.toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument()
})

// Help text renders in the reserved message line below the field.
test('renders help text in the message line when present', () => {
  render(Combobox, { props: { options, label: 'Fruit', help: 'Pick your favourite' } })
  expect(screen.getByText('Pick your favourite')).toBeInTheDocument()
})

// Error takes the message line's place over help when both are set.
test('error text displaces help text in the message line', () => {
  render(Combobox, {
    props: { options, label: 'Fruit', help: 'Pick your favourite', error: 'Pick a fruit' },
  })
  expect(screen.queryByText('Pick your favourite')).not.toBeInTheDocument()
  expect(screen.getByText('Pick a fruit')).toBeInTheDocument()
})

// Error text renders in place of the reserved message line, coloured by the
// danger status token.
test('renders error text in the danger colour when present', () => {
  render(Combobox, { props: { options, label: 'Fruit', error: 'Pick a fruit' } })
  const msg = screen.getByText('Pick a fruit')
  expect(msg.className).toContain('text-danger-fg')
})

// The trigger's border re-colours to the danger border token when an error
// is present -- the same border treatment AtSelect's trigger takes.
test('the trigger takes a danger border when an error is present', () => {
  render(Combobox, { props: { options, label: 'Fruit', error: 'Pick a fruit' } })
  const input = screen.getByRole('combobox', { name: 'Fruit' })
  expect(input.className).toContain('border-danger-border-default')
})

// An additional warning icon renders alongside the input when an error is
// present, for better accessibility alongside the error message.
test('renders an error icon when an error is present', () => {
  render(Combobox, { props: { options, label: 'Fruit', error: 'Pick a fruit' } })
  expect(screen.getByTestId('combobox-error-icon')).toBeInTheDocument()
})

// Disabled goes through reka-ui's disabled prop: the input is a genuinely
// inert element (the browser itself refuses pointer interaction on it), and
// its value drops out of the submitted form values.
test('a disabled combobox is inert', () => {
  render(Combobox, { props: { options, label: 'Fruit', disabled: true } })
  const input = screen.getByRole('combobox', { name: 'Fruit' })
  expect(input).toBeDisabled()
})

// The clear button is gated on disabled, same as typing/opening -- a
// disabled combobox never exposes the clear affordance, even with a
// selection already made.
test('a disabled combobox with a selection does not show a clear button', () => {
  render(Combobox, { props: { options, label: 'Fruit', modelValue: 'banana', disabled: true } })
  expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument()
})

// Clicking a disabled field's label must not open the menu -- mirrors
// AtSelect's disabled label-click guard.
// Playwright treats a label associated with a disabled control as itself
// non-actionable, same as the browser's own behaviour -- force the click
// through to exercise the component's own onLabelClick guard underneath.
test('clicking the label of a disabled combobox does not open the menu', async () => {
  render(Combobox, { props: { options, label: 'Fruit', disabled: true } })
  await userEvent.click(screen.getByText('Fruit'), { force: true })
  expect(screen.queryByRole('option', { name: 'Banana' })).not.toBeInTheDocument()
})

// The #icon slot renders a consumer-supplied icon at the trigger's start, to
// communicate the field's purpose.
test('renders slotted icon content at the start of the trigger', () => {
  render(Combobox, {
    props: { label: 'Fruit', options },
    slots: { icon: '<span data-testid="my-icon">*</span>' },
  })
  expect(screen.getByTestId('my-icon')).toBeInTheDocument()
})

// The #prefix slot renders consumer-supplied content flanking the trigger's
// start, e.g. a country flag ahead of a country code field.
test('renders slotted prefix content before the trigger', () => {
  render(Combobox, {
    props: { label: 'Fruit', options },
    slots: { prefix: '<span data-testid="my-prefix">$</span>' },
  })
  expect(screen.getByTestId('my-prefix')).toBeInTheDocument()
})

// The #suffix slot renders consumer-supplied content flanking the trigger's
// end, e.g. a unit label.
test('renders slotted suffix content after the trigger', () => {
  render(Combobox, {
    props: { label: 'Fruit', options },
    slots: { suffix: '<span data-testid="my-suffix">USD</span>' },
  })
  expect(screen.getByTestId('my-suffix')).toBeInTheDocument()
})

// Arrow-down opens the menu from closed and highlights the first option.
test('arrow down opens the menu and highlights the first option', async () => {
  render(Combobox, { props: { options }, attrs: { 'aria-label': 'Fruit' } })
  const input = screen.getByRole('combobox', { name: 'Fruit' })
  await userEvent.click(input)
  await userEvent.keyboard('{Escape}')
  await userEvent.keyboard('{ArrowDown}')
  const option = await screen.findByRole('option', { name: 'Apple' })
  expect(option).toHaveAttribute('data-highlighted')
})

// Arrow keys move the highlight between options while the menu stays open.
// Opening the menu already highlights the first option (Apple), so one
// ArrowDown moves the highlight on to the next one.
test('arrow down moves the highlight to the next option', async () => {
  render(Combobox, { props: { options }, attrs: { 'aria-label': 'Fruit' } })
  const input = screen.getByRole('combobox', { name: 'Fruit' })
  await userEvent.click(input)
  await screen.findByRole('option', { name: 'Apple' })
  await userEvent.keyboard('{ArrowDown}')
  const option = await screen.findByRole('option', { name: 'Banana' })
  expect(option).toHaveAttribute('data-highlighted')
})

// Enter selects the highlighted option, same as clicking it.
test('enter selects the highlighted option', async () => {
  const view = render(Combobox, { props: { options }, attrs: { 'aria-label': 'Fruit' } })
  const input = screen.getByRole('combobox', { name: 'Fruit' })
  await userEvent.click(input)
  await screen.findByRole('option', { name: 'Apple' })
  await userEvent.keyboard('{ArrowDown}')
  await userEvent.keyboard('{Enter}')
  expect(view.emitted()['update:modelValue']?.at(-1)).toEqual(['banana'])
  expect(await screen.findByDisplayValue('Banana')).toBeInTheDocument()
})

// Escape closes the menu.
test('escape closes the menu', async () => {
  render(Combobox, { props: { options }, attrs: { 'aria-label': 'Fruit' } })
  const input = screen.getByRole('combobox', { name: 'Fruit' })
  await userEvent.click(input)
  await screen.findByRole('option', { name: 'Apple' })
  await userEvent.keyboard('{Escape}')
  expect(screen.queryByRole('option', { name: 'Apple' })).not.toBeInTheDocument()
})

// Strict selection via keyboard: unmatched typed text reverts on Escape, same
// as the blur-revert AC above.
test('escape reverts unmatched typed text to the last valid selection', async () => {
  render(Combobox, { props: { options }, attrs: { 'aria-label': 'Fruit' } })
  const input = screen.getByRole('combobox', { name: 'Fruit' })
  await userEvent.click(input)
  await userEvent.click(await screen.findByRole('option', { name: 'Banana' }))
  await screen.findByDisplayValue('Banana')
  await userEvent.type(input, 'zzz')
  await userEvent.keyboard('{Escape}')
  await screen.findByDisplayValue('Banana')
})

// The single visual snap for Combobox: the Snapshot story's board. Baseline:
// __snaps__/combobox-chromium-linux.png. Rebaseline: pnpm test:update.
test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'combobox')
})

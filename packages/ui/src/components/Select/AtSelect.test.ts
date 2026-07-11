import { composeStories } from '@storybook/vue3-vite'
import { render, screen } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { expect, test } from 'vitest'
import Select from './AtSelect.vue'
import * as stories from './AtSelect.stories'
import { snapBoard } from '../../test/snap'

const { Snapshot } = composeStories(stories)

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]

// The trigger is a real combobox bound to v-model: picking an option emits
// the option's value.
test('emits update:modelValue when an option is picked', async () => {
  const view = render(Select, { props: { label: 'Fruit', options } })
  await userEvent.click(screen.getByRole('combobox', { name: 'Fruit' }))
  await userEvent.click(screen.getByRole('option', { name: 'Banana' }))
  expect(view.emitted()['update:modelValue']?.at(-1)).toEqual(['banana'])
})

// A visible label is tied to the trigger by id, so clicking the label opens
// the dropdown -- the native label-for association activates the trigger.
test('clicking the label opens the dropdown', async () => {
  render(Select, { props: { label: 'Fruit', options } })
  await userEvent.click(screen.getByText('Fruit'))
  expect(screen.getByRole('listbox')).toBeInTheDocument()
})

// With no value selected, the trigger shows the placeholder text.
test('shows the placeholder when no value is selected', () => {
  render(Select, { props: { label: 'Fruit', options, placeholder: 'Choose a fruit' } })
  expect(screen.getByText('Choose a fruit')).toBeInTheDocument()
})

// Disabled goes through reka-ui's disabled prop: the trigger is a genuinely
// inert element (the browser itself refuses pointer interaction on it), and
// its value drops out of the submitted form values.
test('a disabled select is inert', () => {
  render(Select, { props: { label: 'Fruit', options, disabled: true } })
  const trigger = screen.getByRole('combobox', { name: 'Fruit' })
  expect(trigger).toBeDisabled()
})

// The trigger sits at the low surface -- the same shallow-recess idiom as a
// checked checkbox/radio.
test('the trigger recesses at the low surface', () => {
  render(Select, { props: { label: 'Fruit', options } })
  const trigger = screen.getByRole('combobox', { name: 'Fruit' })
  expect(trigger.className).toContain('shadow-low')
})

// Help text renders in the reserved message line below the field.
test('renders help text in the message line when present', () => {
  render(Select, { props: { label: 'Fruit', options, help: 'Pick your favourite' } })
  expect(screen.getByText('Pick your favourite')).toBeInTheDocument()
})

// Error takes the message line's place over help when both are set.
test('error text displaces help text in the message line', () => {
  render(Select, {
    props: { label: 'Fruit', options, help: 'Pick your favourite', error: 'Pick a fruit' },
  })
  expect(screen.queryByText('Pick your favourite')).not.toBeInTheDocument()
  expect(screen.getByText('Pick a fruit')).toBeInTheDocument()
})

// Error text renders in place of the reserved message line, coloured by the
// danger status token.
test('renders error text in the danger colour when present', () => {
  render(Select, { props: { label: 'Fruit', options, error: 'Pick a fruit' } })
  const msg = screen.getByText('Pick a fruit')
  expect(msg.className).toContain('text-danger-fg')
})

// The trigger's own recess rim re-colours to the danger border token when an
// error is present -- the same border treatment, not a switch to a flat variant.
test('the trigger recesses with a danger border when an error is present', () => {
  render(Select, { props: { label: 'Fruit', options, error: 'Pick a fruit' } })
  const trigger = screen.getByRole('combobox', { name: 'Fruit' })
  expect(trigger.className).toContain('border-danger-border-default')
})

// An additional warning icon renders in the trigger when an error is present,
// for better accessibility alongside the error message.
test('renders an error icon in the trigger when an error is present', () => {
  render(Select, { props: { label: 'Fruit', options, error: 'Pick a fruit' } })
  expect(screen.getByTestId('select-error-icon')).toBeInTheDocument()
})

// The #icon slot renders a consumer-supplied icon at the trigger's start, to
// communicate the field's purpose.
test('renders slotted icon content at the start of the trigger', () => {
  render(Select, {
    props: { label: 'Fruit', options },
    slots: { icon: '<span data-testid="my-icon">*</span>' },
  })
  expect(screen.getByTestId('my-icon')).toBeInTheDocument()
})

// The single visual snap for Select: the Snapshot story's board. Baseline:
// __snaps__/select-chromium-linux.png. Rebaseline: pnpm test:update.
test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'select')
})

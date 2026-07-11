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

// The single visual snap for Select: the Snapshot story's board. Baseline:
// __snaps__/select-chromium-linux.png. Rebaseline: pnpm test:update.
test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'select')
})

import { composeStories } from '@storybook/vue3-vite'
import { render, screen } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { expect, test } from 'vitest'
import { defineComponent } from 'vue'
import Radio from './AtRadio.vue'
import RadioGroup from './AtRadioGroup.vue'
import * as stories from './AtRadio.stories'
import { snapBoard } from '../../test/snap'

const { Snapshot } = composeStories(stories)

const TwoRadioGroup = defineComponent({
  components: { RadioGroup, Radio },
  props: { modelValue: { type: String, default: undefined }, disabled: Boolean },
  emits: ['update:modelValue'],
  template: `
    <RadioGroup :modelValue="modelValue" :disabled="disabled" @update:modelValue="$emit('update:modelValue', $event)">
      <Radio value="a" label="Apple" />
      <Radio value="b" label="Banana" />
    </RadioGroup>
  `,
})

// Clicking an unchecked radio selects it, emitting its value.
test('emits update:modelValue with the clicked value', async () => {
  const view = render(TwoRadioGroup, { props: { modelValue: 'a' } })
  await userEvent.click(screen.getByText('Banana'))
  expect(view.emitted()['update:modelValue']?.at(-1)).toEqual(['b'])
})

// Arrow keys move focus and select -- reka-ui's roving focus group, native
// radio keyboard behaviour.
test('selects via the keyboard (ArrowDown)', async () => {
  const view = render(TwoRadioGroup, { props: { modelValue: 'a' } })
  screen.getByRole('radio', { name: 'Apple' }).focus()
  await userEvent.keyboard('[ArrowDown]')
  expect(view.emitted()['update:modelValue']?.at(-1)).toEqual(['b'])
})

// A visible label is tied to the field by id: clicking it selects the radio,
// the native <label for> association.
test('clicking the label selects the radio', async () => {
  const view = render(TwoRadioGroup, { props: { modelValue: 'a' } })
  await userEvent.click(screen.getByText('Banana'))
  expect(view.emitted()['update:modelValue']?.at(-1)).toEqual(['b'])
})

// With no visible label, the accessible name falls through from a forwarded
// aria-label so the field still announces its purpose.
test('a bare radio takes its accessible name from a forwarded aria-label', () => {
  render({
    components: { RadioGroup, Radio },
    template: `<RadioGroup><Radio value="a" aria-label="Select row" /></RadioGroup>`,
  })
  expect(screen.getByRole('radio', { name: 'Select row' })).toBeInTheDocument()
})

// aria-checked reflects the selected value via reka-ui's group context.
test('reports checked and unchecked via aria-checked', async () => {
  const view = render(TwoRadioGroup, { props: { modelValue: 'a' } })
  expect(screen.getByRole('radio', { name: 'Apple' })).toHaveAttribute('aria-checked', 'true')
  expect(screen.getByRole('radio', { name: 'Banana' })).toHaveAttribute('aria-checked', 'false')

  await view.rerender({ modelValue: 'b' })
  expect(screen.getByRole('radio', { name: 'Apple' })).toHaveAttribute('aria-checked', 'false')
  expect(screen.getByRole('radio', { name: 'Banana' })).toHaveAttribute('aria-checked', 'true')
})

// Disabled marks the radio with the native disabled attribute: the browser
// itself blocks user interaction, and a disabled control is excluded from
// form submission.
test('disabled locks the state via the native disabled attribute', () => {
  render(TwoRadioGroup, { props: { modelValue: 'a', disabled: true } })
  const radio = screen.getByRole('radio', { name: 'Apple' })
  expect(radio).toBeDisabled()
  expect(radio).toHaveAttribute('aria-checked', 'true')
})

test('disabled radio shows the not-allowed cursor', () => {
  render(TwoRadioGroup, { props: { disabled: true } })
  expect(getComputedStyle(screen.getByRole('radio', { name: 'Apple' })).cursor).toBe('not-allowed')
})

// Error text renders under the label, coloured by the danger status token.
test('renders error text under the label in the danger colour', () => {
  render({
    components: { RadioGroup, Radio },
    template: `<RadioGroup><Radio value="a" label="Option" error="You must choose an option to continue" /></RadioGroup>`,
  })
  const msg = screen.getByText('You must choose an option to continue')
  expect(msg.className).toContain('text-danger-fg')
})

// The single visual snap for Radio: the Snapshot story's board. Baseline:
// __snaps__/radio-chromium-linux.png. Rebaseline: pnpm test:update.
test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'radio')
})

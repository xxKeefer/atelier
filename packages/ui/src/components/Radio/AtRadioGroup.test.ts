import { composeStories } from '@storybook/vue3-vite'
import { render, screen } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { expect, test } from 'vitest'
import { defineComponent } from 'vue'
import RadioGroup from './AtRadioGroup.vue'
import Radio from './AtRadio.vue'
import * as stories from './AtRadioGroup.stories'
import { snapBoard } from '../../test/snap'

const { Snapshot } = composeStories(stories)

const ThreeRadioGroup = defineComponent({
  components: { RadioGroup, Radio },
  props: { modelValue: { type: String, default: undefined }, disabled: Boolean },
  emits: ['update:modelValue'],
  template: `
    <RadioGroup :modelValue="modelValue" :disabled="disabled" @update:modelValue="$emit('update:modelValue', $event)">
      <Radio value="a" label="Apple" />
      <Radio value="b" label="Banana" />
      <Radio value="c" label="Cherry" />
    </RadioGroup>
  `,
})

// Clicking an unselected radio selects it and emits its value.
test('emits update:modelValue with the clicked value', async () => {
  const view = render(ThreeRadioGroup, { props: { modelValue: 'a' } })
  await userEvent.click(screen.getByText('Banana'))
  expect(view.emitted()['update:modelValue']?.at(-1)).toEqual(['b'])
})

// disabled on the group reaches every child radio via reka-ui's group context.
test('disabling the group disables every child radio', () => {
  render(ThreeRadioGroup, { props: { disabled: true } })
  for (const radio of screen.getAllByRole('radio')) {
    expect(radio).toBeDisabled()
  }
})

// An optional group label renders as a heading above the radios.
test('renders an optional group label', () => {
  render(RadioGroup, { props: { label: 'Favourite fruit' } })
  expect(screen.getByRole('heading', { name: 'Favourite fruit' })).toBeInTheDocument()
})

// Arrow keys move focus between radios -- reka-ui's roving focus group.
test('moves focus to the next radio on ArrowDown', async () => {
  render(ThreeRadioGroup)
  const radios = screen.getAllByRole('radio')
  radios[0]?.focus()
  await userEvent.keyboard('[ArrowDown]')
  expect(radios[1]).toHaveFocus()
})

// A pre-selected value renders its dot via group context, even though
// AtRadio never receives its own selected state -- the group drives it.
test('a pre-selected value renders as checked via group context', () => {
  render(ThreeRadioGroup, { props: { modelValue: 'a' } })
  expect(screen.getAllByRole('radio')[0]).toHaveAttribute('aria-checked', 'true')
})

// The single visual snap for RadioGroup: the Snapshot story's board.
// Baseline: __snaps__/radio-group-chromium-linux.png. Rebaseline: pnpm test:update.
test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'radio-group')
})

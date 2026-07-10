import { composeStories } from '@storybook/vue3-vite'
import { render, screen } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { expect, test } from 'vitest'
import { defineComponent } from 'vue'
import CheckboxGroup from './AtCheckboxGroup.vue'
import Checkbox from './AtCheckbox.vue'
import * as stories from './AtCheckboxGroup.stories'
import { snapBoard } from '../../test/snap'

const { Snapshot } = composeStories(stories)

const ThreeCheckboxGroup = defineComponent({
  components: { CheckboxGroup, Checkbox },
  props: { modelValue: { type: Array, default: () => [] }, disabled: Boolean },
  emits: ['update:modelValue'],
  template: `
    <CheckboxGroup :modelValue="modelValue" :disabled="disabled" @update:modelValue="$emit('update:modelValue', $event)">
      <Checkbox value="a" label="Apple" />
      <Checkbox value="b" label="Banana" />
      <Checkbox value="c" label="Cherry" />
    </CheckboxGroup>
  `,
})

// Clicking an unchecked box adds its value to the group's array.
test('emits update:modelValue with the value appended when an unchecked box is clicked', async () => {
  const view = render(ThreeCheckboxGroup, { props: { modelValue: ['a'] } })
  await userEvent.click(screen.getByText('Banana'))
  expect(view.emitted()['update:modelValue']?.at(-1)).toEqual([['a', 'b']])
})

// Clicking a checked box removes its value from the array.
test('emits update:modelValue with the value removed when a checked box is clicked', async () => {
  const view = render(ThreeCheckboxGroup, { props: { modelValue: ['a', 'b'] } })
  await userEvent.click(screen.getByText('Apple'))
  expect(view.emitted()['update:modelValue']?.at(-1)).toEqual([['b']])
})

// disabled on the group reaches every child checkbox via reka-ui's group context.
test('disabling the group disables every child checkbox', () => {
  render(ThreeCheckboxGroup, { props: { disabled: true } })
  for (const box of screen.getAllByRole('checkbox')) {
    expect(box).toBeDisabled()
  }
})

// An optional group label renders as a heading above the checkboxes.
test('renders an optional group label', () => {
  render(CheckboxGroup, { props: { label: 'Favourite fruits' } })
  expect(screen.getByRole('heading', { name: 'Favourite fruits' })).toBeInTheDocument()
})

// Arrow keys move focus between checkboxes -- reka-ui's roving focus group.
test('moves focus to the next checkbox on ArrowDown', async () => {
  render(ThreeCheckboxGroup)
  const boxes = screen.getAllByRole('checkbox')
  boxes[0]?.focus()
  await userEvent.keyboard('[ArrowDown]')
  expect(boxes[1]).toHaveFocus()
})

// A pre-checked value shows its checkmark, even though AtCheckbox never
// received its own modelValue prop -- the group context drives its state.
test('a pre-selected value renders its checkmark via group context', () => {
  render(ThreeCheckboxGroup, { props: { modelValue: ['a'] } })
  expect(screen.getAllByRole('checkbox')[0]).toHaveAttribute('aria-checked', 'true')
})

// The single visual snap for CheckboxGroup: the Snapshot story's board.
// Baseline: __snaps__/checkbox-group-chromium-linux.png. Rebaseline: pnpm test:update.
test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'checkbox-group')
})

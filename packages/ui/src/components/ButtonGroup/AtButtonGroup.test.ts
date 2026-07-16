import { composeStories } from '@storybook/vue3-vite'
import { render, screen } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { expect, test } from 'vitest'
import { defineComponent } from 'vue'
import ButtonGroup from './AtButtonGroup.vue'
import ButtonGroupItem from './AtButtonGroupItem.vue'
import * as stories from './AtButtonGroup.stories'
import { snapBoard } from '../../test/snap'

const { Snapshot } = composeStories(stories)

const ThreeButtonGroup = defineComponent({
  components: { ButtonGroup, ButtonGroupItem },
  props: { modelValue: { type: String, default: undefined }, disabled: Boolean },
  emits: ['update:modelValue'],
  template: `
    <ButtonGroup :modelValue="modelValue" :disabled="disabled" @update:modelValue="$emit('update:modelValue', $event)">
      <ButtonGroupItem value="a">Apple</ButtonGroupItem>
      <ButtonGroupItem value="b">Banana</ButtonGroupItem>
      <ButtonGroupItem value="c">Cherry</ButtonGroupItem>
    </ButtonGroup>
  `,
})

// Clicking an unselected segment selects it and emits its value.
test('emits update:modelValue with the clicked value', async () => {
  const view = render(ThreeButtonGroup, { props: { modelValue: 'a' } })
  await userEvent.click(screen.getByText('Banana'))
  expect(view.emitted()['update:modelValue']?.at(-1)).toEqual(['b'])
})

// disabled on the group reaches every child segment via reka-ui's group context.
test('disabling the group disables every child segment', () => {
  render(ThreeButtonGroup, { props: { disabled: true } })
  for (const item of screen.getAllByRole('radio')) {
    expect(item).toBeDisabled()
  }
})

// An optional group label renders as a heading above the segments.
test('renders an optional group label', () => {
  render(ButtonGroup, { props: { label: 'Alignment' } })
  expect(screen.getByRole('heading', { name: 'Alignment' })).toBeInTheDocument()
})

// Arrow keys move focus between segments -- reka-ui's roving focus group.
test('moves focus to the next segment on ArrowRight', async () => {
  render(ThreeButtonGroup)
  const items = screen.getAllByRole('radio')
  items[0]?.focus()
  await userEvent.keyboard('[ArrowRight]')
  expect(items[1]).toHaveFocus()
})

// A pre-selected value renders as checked via group context.
test('a pre-selected value renders as checked via aria-checked', () => {
  render(ThreeButtonGroup, { props: { modelValue: 'a' } })
  expect(screen.getAllByRole('radio')[0]).toHaveAttribute('aria-checked', 'true')
})

// Error text renders under the group, coloured by the danger status token.
test('renders group-level error text in the danger colour', () => {
  render(ButtonGroup, { props: { error: 'You must choose an option to continue' } })
  const msg = screen.getByText('You must choose an option to continue')
  expect(msg.className).toContain('text-danger-fg')
})

// The single visual snap for ButtonGroup: the Snapshot story's board.
// Baseline: __snaps__/button-group-chromium-linux.png. Rebaseline: pnpm test:update.
test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'button-group')
})

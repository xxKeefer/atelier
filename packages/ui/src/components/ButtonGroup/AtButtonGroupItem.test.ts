import { composeStories } from '@storybook/vue3-vite'
import { render, screen } from '@testing-library/vue'
import { expect, test } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import ButtonGroup from './AtButtonGroup.vue'
import ButtonGroupItem from './AtButtonGroupItem.vue'
import * as stories from './AtButtonGroupItem.stories'
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

// aria-checked reflects the selected value via reka-ui's group context.
test('reports checked and unchecked via aria-checked', async () => {
  const view = render(ThreeButtonGroup, { props: { modelValue: 'a' } })
  expect(screen.getByRole('radio', { name: 'Apple' })).toHaveAttribute('aria-checked', 'true')
  expect(screen.getByRole('radio', { name: 'Banana' })).toHaveAttribute('aria-checked', 'false')

  await view.rerender({ modelValue: 'b' })
  expect(screen.getByRole('radio', { name: 'Apple' })).toHaveAttribute('aria-checked', 'false')
  expect(screen.getByRole('radio', { name: 'Banana' })).toHaveAttribute('aria-checked', 'true')
})

// Disabled marks the segment with the native disabled attribute.
test('disabled locks the state via the native disabled attribute', () => {
  render(ThreeButtonGroup, { props: { modelValue: 'a', disabled: true } })
  const item = screen.getByRole('radio', { name: 'Apple' })
  expect(item).toBeDisabled()
  expect(item).toHaveAttribute('aria-checked', 'true')
})

test('disabled segment shows the not-allowed cursor', () => {
  render(ThreeButtonGroup, { props: { disabled: true } })
  expect(getComputedStyle(screen.getByRole('radio', { name: 'Apple' })).cursor).toBe('not-allowed')
})

// Positional rounding and border-as-seam ownership are now pure CSS (see
// AtButtonGroupItem.vue), keyed off :first-child/:last-child and sibling
// combinators rather than JS-computed per-item classes. Assert the rendered
// computed style/geometry the browser actually produces, not class strings.
test('first segment rounds its left side, later segments do not', async () => {
  render(ThreeButtonGroup)
  await nextTick()
  const [first, second] = screen.getAllByRole('radio')
  expect(getComputedStyle(first as Element).borderTopLeftRadius).not.toBe('0px')
  expect(getComputedStyle(second as Element).borderTopLeftRadius).toBe('0px')
})

test('last segment rounds its right side, earlier segments do not', async () => {
  render(ThreeButtonGroup)
  await nextTick()
  const items = screen.getAllByRole('radio')
  const last = items.at(-1)
  expect(getComputedStyle(last as Element).borderTopRightRadius).not.toBe('0px')
  expect(getComputedStyle(items[0] as Element).borderTopRightRadius).toBe('0px')
})

test('every segment but the first drops its left border when nothing is checked', async () => {
  render(ThreeButtonGroup)
  await nextTick()
  const [first, second, third] = screen.getAllByRole('radio')
  expect(getComputedStyle(first as Element).borderLeftWidth).not.toBe('0px')
  expect(getComputedStyle(second as Element).borderLeftWidth).toBe('0px')
  expect(getComputedStyle(third as Element).borderLeftWidth).toBe('0px')
})

// Elevation-aware seam ownership: a checked (pressed/lower) segment must not
// let its own border win a seam against an unchecked (higher) neighbour --
// the higher neighbour keeps its border, the checked segment drops its own
// border on that side instead. Bug: previously the border-drop was purely
// positional ("every segment but the first drops left"), so checking the
// middle segment left its unchecked right neighbour dropping a border it
// should have kept.
test('a checked middle segment drops its own border, not its unchecked neighbours', async () => {
  render(ThreeButtonGroup, { props: { modelValue: 'b' } })
  await nextTick()
  const [, second, third] = screen.getAllByRole('radio')
  // Apple (unchecked, higher) keeps its right border -- Banana (checked,
  // lower) drops its own left border, same as the tied default.
  expect(getComputedStyle(second as Element).borderLeftWidth).toBe('0px')
  // Cherry (unchecked, higher) must keep its left border -- Banana (checked,
  // lower) must drop its own right border instead of Cherry dropping left.
  expect(getComputedStyle(third as Element).borderLeftWidth).not.toBe('0px')
  expect(getComputedStyle(second as Element).borderRightWidth).toBe('0px')
})

// The general N>2 case: a checked segment that is NOT adjacent to the last
// segment must not leak its seam-restore rule past its immediate neighbour.
// (An earlier draft used Tailwind's `peer` general-sibling selector, which
// would incorrectly restore every later segment's left border, not just the
// checked segment's immediate right neighbour.)
test('a checked segment does not leak its seam restore past its immediate neighbour', async () => {
  // Bare object literal, not defineComponent -- avoids vue/one-component-per-file,
  // which only fires on defineComponent-wrapped definitions.
  const FourButtonGroup = {
    components: { ButtonGroup, ButtonGroupItem },
    props: { modelValue: { type: String, default: undefined } },
    template: `
      <ButtonGroup :modelValue="modelValue">
        <ButtonGroupItem value="a">Apple</ButtonGroupItem>
        <ButtonGroupItem value="b">Banana</ButtonGroupItem>
        <ButtonGroupItem value="c">Cherry</ButtonGroupItem>
        <ButtonGroupItem value="d">Date</ButtonGroupItem>
      </ButtonGroup>
    `,
  }
  render(FourButtonGroup, { props: { modelValue: 'a' } })
  await nextTick()
  const [, second, third, fourth] = screen.getAllByRole('radio')
  // Banana (immediate right neighbour of checked Apple) restores its border.
  expect(getComputedStyle(second as Element).borderLeftWidth).not.toBe('0px')
  // Cherry and Date are not adjacent to Apple -- they keep the structural default.
  expect(getComputedStyle(third as Element).borderLeftWidth).toBe('0px')
  expect(getComputedStyle(fourth as Element).borderLeftWidth).toBe('0px')
})

// The focus ring must paint above a following sibling, not be clipped by it.
test('a focused segment lifts above its neighbours so its focus ring is not clipped', () => {
  render(ThreeButtonGroup)
  const middle = screen.getByRole('radio', { name: 'Banana' })
  expect(middle.className).toContain('focus-visible:z-10')
  expect(middle.className).toContain('relative')
})

// The single visual snap for ButtonGroupItem: the Snapshot story's board.
// Baseline: __snaps__/button-group-item-chromium-linux.png. Rebaseline: pnpm test:update.
test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'button-group-item')
})

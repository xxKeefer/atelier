import { composeStories } from '@storybook/vue3-vite'
import { render, screen } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { expect, test } from 'vitest'
import { nextTick } from 'vue'
import Checkbox from './AtCheckbox.vue'
import * as stories from './AtCheckbox.stories'
import { snapBoard } from '../../test/snap'

const { Snapshot } = composeStories(stories)

// Clicking the box toggles between false and true, emitting the new value.
test('emits update:modelValue when clicked', async () => {
  const view = render(Checkbox, { props: { label: 'Subscribe', modelValue: false } })
  await userEvent.click(screen.getByRole('checkbox'))
  expect(view.emitted()['update:modelValue']?.at(-1)).toEqual([true])
})

// Space toggles the box -- native button behaviour via reka-ui's CheckboxRoot,
// not a hand-rolled key handler.
test('toggles via the keyboard (Space)', async () => {
  const view = render(Checkbox, { props: { label: 'Subscribe', modelValue: false } })
  screen.getByRole('checkbox').focus()
  await userEvent.keyboard('[Space]')
  expect(view.emitted()['update:modelValue']?.at(-1)).toEqual([true])
})

// A visible label is tied to the field by id: clicking it toggles the box, the
// native <label for> association.
test('clicking the label toggles the checkbox', async () => {
  const view = render(Checkbox, { props: { label: 'Subscribe', modelValue: false } })
  await userEvent.click(screen.getByText('Subscribe'))
  expect(view.emitted()['update:modelValue']?.at(-1)).toEqual([true])
})

// With no visible label, the accessible name falls through from a forwarded
// aria-label so the field still announces its purpose.
test('a bare checkbox takes its accessible name from a forwarded aria-label', () => {
  render(Checkbox, { attrs: { 'aria-label': 'Select row' } })
  expect(screen.getByRole('checkbox', { name: 'Select row' })).toBeInTheDocument()
})

// aria-checked reflects true/false/indeterminate via reka-ui's mixed state.
test('reports checked, unchecked, and indeterminate via aria-checked', async () => {
  const view = render(Checkbox, { props: { modelValue: false } })
  expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'false')

  await view.rerender({ modelValue: true })
  await nextTick()
  expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true')

  await view.rerender({ modelValue: 'indeterminate' })
  await nextTick()
  expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'mixed')
})

// Disabled marks the box with the native disabled attribute: the browser
// itself blocks user interaction (Playwright's actionability check refuses to
// click it), and a disabled control is excluded from form submission.
test('disabled locks the state via the native disabled attribute', () => {
  render(Checkbox, { props: { label: 'Subscribe', modelValue: true, disabled: true } })
  const box = screen.getByRole('checkbox')
  expect(box).toBeDisabled()
  expect(box).toHaveAttribute('aria-checked', 'true')
})

test('disabled checkbox shows the not-allowed cursor', () => {
  render(Checkbox, { props: { label: 'Subscribe', disabled: true } })
  expect(getComputedStyle(screen.getByRole('checkbox')).cursor).toBe('not-allowed')
})

// Error text renders under the label, coloured by the danger status token.
test('renders error text under the label in the danger colour', () => {
  render(Checkbox, { props: { label: 'Accept terms', error: 'You must accept the terms' } })
  const msg = screen.getByText('You must accept the terms')
  expect(msg.className).toContain('text-danger-fg')
})

// The single visual snap for Checkbox: the Snapshot story's board. Baseline:
// __snaps__/checkbox-chromium-linux.png. Rebaseline: pnpm test:update.
test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'checkbox')
})

import { composeStories } from '@storybook/vue3-vite'
import { render, screen } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { expect, test } from 'vitest'
import Switch from './AtSwitch.vue'
import * as stories from './AtSwitch.stories'
import { snapBoard } from '../../test/snap'

const { Snapshot } = composeStories(stories)

// Clicking the track toggles between false and true, emitting the new value.
test('emits update:modelValue when clicked', async () => {
  const view = render(Switch, { props: { label: 'Enable notifications', modelValue: false } })
  await userEvent.click(screen.getByRole('switch'))
  expect(view.emitted()['update:modelValue']?.at(-1)).toEqual([true])
})

// Space toggles the switch -- native button behaviour via reka-ui's
// SwitchRoot, not a hand-rolled key handler.
test('toggles via the keyboard (Space)', async () => {
  const view = render(Switch, { props: { label: 'Enable notifications', modelValue: false } })
  screen.getByRole('switch').focus()
  await userEvent.keyboard('[Space]')
  expect(view.emitted()['update:modelValue']?.at(-1)).toEqual([true])
})

// A visible label is tied to the field by id: clicking it toggles the switch,
// the native <label for> association.
test('clicking the label toggles the switch', async () => {
  const view = render(Switch, { props: { label: 'Enable notifications', modelValue: false } })
  await userEvent.click(screen.getByText('Enable notifications'))
  expect(view.emitted()['update:modelValue']?.at(-1)).toEqual([true])
})

// With no visible label, the accessible name falls through from a forwarded
// aria-label so the field still announces its purpose.
test('a bare switch takes its accessible name from a forwarded aria-label', () => {
  render(Switch, { attrs: { 'aria-label': 'Enable notifications' } })
  expect(screen.getByRole('switch', { name: 'Enable notifications' })).toBeInTheDocument()
})

// aria-checked reflects true/false -- no indeterminate state for Switch.
test('reports checked and unchecked via aria-checked', async () => {
  const view = render(Switch, { props: { modelValue: false } })
  expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false')

  await view.rerender({ modelValue: true })
  expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
})

// Disabled marks the switch with the native disabled attribute: the browser
// itself blocks user interaction, and a disabled control is excluded from
// form submission.
test('disabled locks the state via the native disabled attribute', () => {
  render(Switch, { props: { label: 'Enable notifications', modelValue: true, disabled: true } })
  const toggle = screen.getByRole('switch')
  expect(toggle).toBeDisabled()
  expect(toggle).toHaveAttribute('aria-checked', 'true')
})

test('disabled switch shows the not-allowed cursor', () => {
  render(Switch, { props: { label: 'Enable notifications', disabled: true } })
  expect(getComputedStyle(screen.getByRole('switch')).cursor).toBe('not-allowed')
})

// The single visual snap for Switch: the Snapshot story's board. Baseline:
// __snaps__/switch-chromium-linux.png. Rebaseline: pnpm test:update.
test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'switch')
})

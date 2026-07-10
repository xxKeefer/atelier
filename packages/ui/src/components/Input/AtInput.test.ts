import { composeStories } from '@storybook/vue3-vite'
import { render, screen } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { expect, test } from 'vitest'
import Input from './AtInput.vue'
import * as stories from './AtInput.stories'
import { snapBoard } from '../../test/snap'

const { Snapshot } = composeStories(stories)

// The field is a real text input bound to v-model: typing emits the updated
// string so a parent can track the value.
test('emits update:modelValue as the user types', async () => {
  const view = render(Input, { props: { label: 'Name' } })
  await userEvent.type(screen.getByRole('textbox'), 'hi')
  // One emit per keystroke; the last carries the full value.
  expect(view.emitted()['update:modelValue']?.at(-1)).toEqual(['hi'])
})

// A visible label is tied to the field by id, so clicking the label moves focus
// into the input -- the native <label for> association, not a fragile wrapper.
test('clicking the label focuses the field', async () => {
  render(Input, { props: { label: 'Email' } })
  const field = screen.getByRole('textbox', { name: 'Email' })
  await userEvent.click(screen.getByText('Email'))
  expect(field).toHaveFocus()
})

// With no visible label, the accessible name falls through from a forwarded
// aria-label so the field still announces its purpose.
test('a bare field takes its accessible name from a forwarded aria-label', () => {
  render(Input, { attrs: { 'aria-label': 'Search' } })
  expect(screen.getByRole('textbox', { name: 'Search' })).toBeInTheDocument()
})

// The placeholder shows when empty and is distinct from the label (never a
// substitute for it).
test('renders a placeholder without standing in for the label', () => {
  render(Input, { props: { label: 'City', placeholder: 'e.g. Brisbane' } })
  const field = screen.getByRole('textbox', { name: 'City' })
  expect(field).toHaveAttribute('placeholder', 'e.g. Brisbane')
})

// The recessed "bucket": the field carries the inset depth var the disabled
// slice will later halve, rather than the button's extruded bottom edge.
test('the field recesses with an inset depth, not an extruded edge', () => {
  render(Input, { props: { label: 'Name' } })
  const field = screen.getByRole('textbox')
  expect(field.className).toContain('[--at-input-depth:5px]')
  expect(field.className).toContain('shadow-[inset')
})

// Help text renders below the field on the normal surface, not inside the
// recess.
test('renders help text below the field', () => {
  render(Input, { props: { label: 'Password', help: 'At least 8 characters' } })
  expect(screen.getByText('At least 8 characters')).toBeInTheDocument()
})

// Error text renders in place of help, coloured by the danger status token.
test('renders error text in the danger colour when present', () => {
  render(Input, { props: { label: 'Email', error: 'Invalid address' } })
  const msg = screen.getByText('Invalid address')
  expect(msg.className).toContain('text-danger-fg')
})

// A messaged field (label/help/error in use) reserves a fixed line of space for
// the message so toggling it never shifts the layout.
test('reserves a message line when the field carries a label', () => {
  render(Input, { props: { label: 'Name' } })
  expect(screen.getByTestId('input-message')).toBeInTheDocument()
})

// A bare field (no label, help, or error -- e.g. a filter-bar search) stays
// compact: no label and no reserved message line.
test('a bare field reserves no label or message space', () => {
  render(Input, { attrs: { 'aria-label': 'Filter' } })
  expect(screen.queryByTestId('input-message')).toBeNull()
})

// The single visual snap for Input: the Snapshot story's board. Baseline:
// __snaps__/input-chromium-linux.png. Rebaseline: pnpm test:update.
test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'input')
})

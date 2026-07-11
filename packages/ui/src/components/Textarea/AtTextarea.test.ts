import { composeStories } from '@storybook/vue3-vite'
import { render, screen } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { expect, test } from 'vitest'
import Textarea from './AtTextarea.vue'
import * as stories from './AtTextarea.stories'
import { snapBoard } from '../../test/snap'

const { Snapshot } = composeStories(stories)

// The field is a real textarea bound to v-model: typing emits the updated
// string so a parent can track the value.
test('emits update:modelValue as the user types', async () => {
  const view = render(Textarea, { props: { label: 'Bio' } })
  await userEvent.type(screen.getByRole('textbox'), 'hi')
  // One emit per keystroke; the last carries the full value.
  expect(view.emitted()['update:modelValue']?.at(-1)).toEqual(['hi'])
})

// A visible label is tied to the field by id, so clicking the label moves
// focus into the textarea -- the native <label for> association.
test('clicking the label focuses the field', async () => {
  render(Textarea, { props: { label: 'Bio' } })
  const field = screen.getByRole('textbox', { name: 'Bio' })
  await userEvent.click(screen.getByText('Bio'))
  expect(field).toHaveFocus()
})

// With no visible label, the accessible name falls through from a forwarded
// aria-label so the field still announces its purpose.
test('a bare field takes its accessible name from a forwarded aria-label', () => {
  render(Textarea, { attrs: { 'aria-label': 'Comments' } })
  expect(screen.getByRole('textbox', { name: 'Comments' })).toBeInTheDocument()
})

// The placeholder shows when empty and is distinct from the label.
test('renders a placeholder without standing in for the label', () => {
  render(Textarea, { props: { label: 'Bio', placeholder: 'Tell us about yourself' } })
  const field = screen.getByRole('textbox', { name: 'Bio' })
  expect(field).toHaveAttribute('placeholder', 'Tell us about yourself')
})

// The recessed "bucket": the field carries the elevation ladder's deep-recess
// token, the same hard-edge inset rung every other recessed surface uses.
test('the field recesses with the deep-recess shadow token, not an extruded edge', () => {
  render(Textarea, { props: { label: 'Bio' } })
  const field = screen.getByRole('textbox')
  expect(field.className).toContain('shadow-lower')
  expect(field.className).not.toMatch(/shadow-\[/)
})

// Disabled goes through the native attribute (via $attrs fallthrough) so the
// browser handles inertness and excludes the value from submission.
test('a disabled field is inert with a half-depth recess', () => {
  render(Textarea, { props: { label: 'Bio' }, attrs: { disabled: true } })
  const field = screen.getByRole('textbox')
  expect(field).toBeDisabled()
  expect(field.className).toContain('disabled:shadow-low')
})

// Help text renders below the field on the normal surface, not inside the
// recess.
test('renders help text below the field', () => {
  render(Textarea, { props: { label: 'Bio', help: 'Max 200 characters' } })
  expect(screen.getByText('Max 200 characters')).toBeInTheDocument()
})

// Error text renders in place of help, coloured by the danger status token.
test('renders error text in the danger colour when present', () => {
  render(Textarea, { props: { label: 'Bio', error: 'Bio is required' } })
  const msg = screen.getByText('Bio is required')
  expect(msg.className).toContain('text-danger-fg')
})

// An error shifts the whole recess onto the danger colourway's recessed
// rungs -- surface, rim, and shadow together.
test('the field recesses onto the danger colourway when an error is present', () => {
  render(Textarea, { props: { label: 'Bio', error: 'Bio is required' } })
  const field = screen.getByRole('textbox')
  expect(field.className).toContain('bg-danger-surface-recess')
  expect(field.className).toContain('border-danger-border-default')
  expect(field.className).toContain('shadow-danger-lower')
})

// A messaged field (label/help/error in use) reserves a fixed line of space
// for the message so toggling it never shifts the layout.
test('reserves a message line when the field carries a label', () => {
  render(Textarea, { props: { label: 'Bio' } })
  expect(screen.getByTestId('textarea-message')).toBeInTheDocument()
})

// A bare field (no label, help, or error) stays compact: no reserved message
// line.
test('a bare field reserves no label or message space', () => {
  render(Textarea, { attrs: { 'aria-label': 'Comments' } })
  expect(screen.queryByTestId('textarea-message')).toBeNull()
})

// Defaults to 3 rows.
test('defaults to 3 rows', () => {
  render(Textarea, { attrs: { 'aria-label': 'Comments' } })
  expect(screen.getByRole('textbox')).toHaveAttribute('rows', '3')
})

// A consumer-supplied rows prop overrides the default.
test('lets a consumer override the row count', () => {
  render(Textarea, { attrs: { 'aria-label': 'Comments' }, props: { rows: 6 } })
  expect(screen.getByRole('textbox')).toHaveAttribute('rows', '6')
})

// The single visual snap for Textarea: the Snapshot story's board. Baseline:
// __snaps__/textarea-chromium-linux.png. Rebaseline: pnpm test:update.
test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'textarea')
})

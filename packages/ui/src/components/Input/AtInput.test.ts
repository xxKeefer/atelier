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

// The recessed "bucket": the field carries the elevation ladder's deep-recess
// token, the same hard-edge inset rung every other recessed surface uses --
// not the button's extruded bottom edge.
test('the field recesses with the deep-recess shadow token, not an extruded edge', () => {
  render(Input, { props: { label: 'Name' } })
  const field = screen.getByRole('textbox')
  expect(field.className).toContain('shadow-lower')
  expect(field.className).not.toMatch(/shadow-\[/)
})

// Disabled goes through the native attribute (via $attrs fallthrough) so the
// browser handles inertness and excludes the value from submission -- no prop
// needed. Depth halves to the shallow-recess rung.
test('a disabled field is inert with a half-depth recess', () => {
  render(Input, { props: { label: 'Name' }, attrs: { disabled: true } })
  const field = screen.getByRole('textbox')
  expect(field).toBeDisabled()
  expect(field.className).toContain('disabled:shadow-low')
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

// An error shifts the whole recess onto the danger colourway's recessed
// rungs -- surface, rim, and shadow together, the same recess idiom Elevation
// uses for its danger tiles, not just a recoloured border.
test('the field recesses onto the danger colourway when an error is present', () => {
  render(Input, { props: { label: 'Email', error: 'Invalid address' } })
  const field = screen.getByRole('textbox')
  expect(field.className).toContain('bg-danger-surface-recess')
  expect(field.className).toContain('border-danger-border-default')
  expect(field.className).toContain('shadow-danger-lower')
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

// The #icon slot renders a consumer-supplied icon inside the recess, at the
// field's start.
test('renders slotted icon content inside the field', () => {
  render(Input, {
    attrs: { 'aria-label': 'Search' },
    slots: { icon: '<span data-testid="my-icon">*</span>' },
  })
  expect(screen.getByTestId('my-icon')).toBeInTheDocument()
})

// With no #icon slot passed, no icon-area padding is added -- the field's
// default padding stands, so an ordinary field's layout is untouched.
test('adds no icon padding when the icon slot is unused', () => {
  render(Input, { attrs: { 'aria-label': 'Filter' } })
  const field = screen.getByRole('textbox')
  expect(field.className).not.toMatch(/pl-(8|9|10|11|12)\b/)
})

// The #prefix/#suffix slots render flanking boxes beside the input, each its
// own half-depth recess (not the input's own full-depth bucket).
test('renders slotted prefix content beside the field', () => {
  render(Input, {
    attrs: { 'aria-label': 'Amount' },
    slots: { prefix: '<span data-testid="my-prefix">$</span>' },
  })
  expect(screen.getByTestId('my-prefix')).toBeInTheDocument()
  expect(screen.getByTestId('input-prefix').className).toContain('shadow-low')
})

test('renders slotted suffix content beside the field', () => {
  render(Input, {
    attrs: { 'aria-label': 'Weight' },
    slots: { suffix: '<span data-testid="my-suffix">kg</span>' },
  })
  expect(screen.getByTestId('my-suffix')).toBeInTheDocument()
  expect(screen.getByTestId('input-suffix').className).toContain('shadow-low')
})

// With no #prefix/#suffix slots passed, no flanking box renders at all.
test('renders no prefix or suffix box when the slots are unused', () => {
  render(Input, { attrs: { 'aria-label': 'Filter' } })
  expect(screen.queryByTestId('input-prefix')).toBeNull()
  expect(screen.queryByTestId('input-suffix')).toBeNull()
})

// The field and its prefix/suffix gang into one flush assembly: no gap
// between segments, and only the outer ends of the run round -- the joins
// where segments meet stay square on both sides.
test('gangs the field flush against its prefix and suffix with square inner joins', () => {
  render(Input, {
    attrs: { 'aria-label': 'Amount' },
    slots: { prefix: '<span>$</span>', suffix: '<span>USD</span>' },
  })
  const field = screen.getByRole('textbox')
  const prefix = screen.getByTestId('input-prefix')
  const suffix = screen.getByTestId('input-suffix')

  expect(prefix.parentElement?.className).not.toMatch(/\bgap-\d/)
  expect(prefix.className).toContain('rounded-l-md')
  expect(prefix.className).not.toMatch(/rounded-r|rounded-md\b/)
  expect(field.className).not.toMatch(/rounded-l-md|rounded-r-md|rounded-md\b/)
  expect(suffix.className).toContain('rounded-r-md')
  expect(suffix.className).not.toMatch(/rounded-l|rounded-md\b/)
})

// A bare field with no prefix/suffix keeps both its own outer corners
// rounded -- the flush-assembly geometry only squares off joins that
// actually exist.
test('a field with no prefix or suffix rounds both its own corners', () => {
  render(Input, { attrs: { 'aria-label': 'Filter' } })
  const field = screen.getByRole('textbox')
  expect(field.className).toContain('rounded-l-md')
  expect(field.className).toContain('rounded-r-md')
})

// The single visual snap for Input: the Snapshot story's board. Baseline:
// __snaps__/input-chromium-linux.png. Rebaseline: pnpm test:update.
test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'input')
})

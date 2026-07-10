import { composeStories } from '@storybook/vue3-vite'
import { render, screen, within } from '@testing-library/vue'
import { expect, test } from 'vitest'
import { h } from 'vue'
import Button from './AtButton.vue'
import * as stories from './AtButton.stories'
import { snapBoard } from '../../test/snap'

const { Loading, Snapshot } = composeStories(stories)

// A textless icon for the slot tests: an svg contributes no text content, so
// toHaveTextContent assertions read only the label.
const icon = (testid: string) => h('svg', { 'data-testid': testid, viewBox: '0 0 24 24' })

const cursorOf = (props: Record<string, unknown>) => {
  render(Button, { props, slots: { default: () => 'Go' } })
  return getComputedStyle(screen.getByRole('button')).cursor
}

test('enabled button shows the pointer cursor', () => {
  expect(cursorOf({})).toBe('pointer')
})

test('loading button shows the wait cursor', () => {
  expect(cursorOf({ loading: true })).toBe('wait')
})

test('disabled button shows the not-allowed cursor', () => {
  expect(cursorOf({ disabled: true })).toBe('not-allowed')
})

// Regression: the skeleton pulse animates opacity down to .5 at its trough. If the
// disabled dimming also pins opacity to .5, the pulse has zero range and is invisible.
// Pause the animation and assert the resting opacity is full, so the pulse can move.
test('loading button is not statically dimmed, so the skeleton pulse stays visible', () => {
  render(Loading)
  const button = screen.getAllByRole('button')[0]
  if (!button) throw new Error('no button')
  button.style.animation = 'none'
  expect(getComputedStyle(button).opacity).toBe('1')
})

// AC: loading defaults to a circle-notch spinner, it overrides a consumer #left
// icon, and it still appears when there is no #left icon.
test('loading renders the default spinner, overriding any #left icon', () => {
  render(Loading)
  // The Loading story renders two buttons: one with a #left icon, one without.
  const buttons = screen.getAllByRole('button')
  expect(buttons).toHaveLength(2)
  buttons.forEach((button) => {
    // loading implies disabled: the button is inert.
    expect(button).toBeDisabled()
    // The default circle-notch spinner renders in place of #left.
    expect(within(button).getByTestId('spinner')).toBeInTheDocument()
  })
  // The consumer's own #left icon is replaced by the spinner while loading.
  expect(screen.queryByTestId('left-icon')).toBeNull()
})

// #left renders before the label; #right after. The slot content is the button's
// first/last element child respectively, preserving icon DOM order.
test('a #left icon precedes the label as the first child', () => {
  render(Button, {
    slots: { left: () => icon('left-icon'), default: () => 'Save' },
  })
  const button = screen.getByRole('button')
  expect(button).toHaveTextContent('Save')
  // Ordinal position has no Testing Library query; assert child order directly.
  // eslint-disable-next-line testing-library/no-node-access
  expect(button.firstElementChild).toBe(screen.getByTestId('left-icon'))
})

test('a #right icon follows the label as the last child', () => {
  render(Button, {
    slots: { default: () => 'Next', right: () => icon('right-icon') },
  })
  const button = screen.getByRole('button')
  expect(button).toHaveTextContent('Next')
  // Ordinal position has no Testing Library query; assert child order directly.
  // eslint-disable-next-line testing-library/no-node-access
  expect(button.lastElementChild).toBe(screen.getByTestId('right-icon'))
})

// Icon-only: no text label, so the accessible name comes from aria-label.
test('an icon-only button takes its name from aria-label and has no text', () => {
  render(Button, {
    attrs: { 'aria-label': 'Add to favourites' },
    slots: { left: () => icon('only-icon') },
  })
  const button = screen.getByRole('button', { name: 'Add to favourites' })
  expect(screen.getByTestId('only-icon')).toBeInTheDocument()
  expect(button).toHaveTextContent('')
})

// An href resolves the root to an <a> (role=link); it always opens in a new tab,
// guarded against reverse-tabnabbing.
test('href renders an anchor that opens safely in a new tab', () => {
  render(Button, {
    props: { href: 'https://example.com' },
    slots: { default: () => 'Visit site' },
  })
  const link = screen.getByRole('link', { name: 'Visit site' })
  expect(link).toHaveAttribute('href', 'https://example.com')
  expect(link).toHaveAttribute('target', '_blank')
  expect(link).toHaveAttribute('rel', 'noopener noreferrer')
})

// A disabled link is inert: the href is dropped (so it isn't navigable, which
// also strips the link role), aria-disabled announces it, pointer-events-none
// blocks the cursor.
test('a disabled link is inert: aria-disabled, no href, pointer-events blocked', () => {
  render(Button, {
    props: { href: 'https://example.com', disabled: true },
    slots: { default: () => 'Visit site' },
  })
  // Disabled drops the href, so there's no link role -- query by the text the
  // anchor owns instead.
  const anchor = screen.getByText('Visit site')
  expect(anchor.tagName).toBe('A')
  expect(anchor).toHaveAttribute('aria-disabled', 'true')
  expect(anchor).not.toHaveAttribute('href')
  expect(anchor.className).toContain('pointer-events-none')
})

// The single visual snap for Button: the Snapshot story's board (every intent,
// size, variant, icon arrangement, and state on one screen). Baseline:
// __snaps__/button-snap-chromium-linux.png. Rebaseline: pnpm test:update.
test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'button')
})

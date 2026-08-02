import { composeStories } from '@storybook/vue3-vite'
import { render, screen } from '@testing-library/vue'
import { expect, test } from 'vitest'
import { h } from 'vue'
import Link from './AtLink.vue'
import * as stories from './AtLink.stories'
import { snapBoard } from '../../test/snap'

const { Snapshot } = composeStories(stories)

// A textless icon for the slot tests: an svg contributes no text content, so
// toHaveTextContent assertions read only the label.
const icon = (testid: string) => h('svg', { 'data-testid': testid, viewBox: '0 0 24 24' })

test('an href resolves the root to an anchor with a link role', () => {
  render(Link, { props: { href: 'https://example.com' }, slots: { default: () => 'Visit site' } })
  const link = screen.getByRole('link', { name: 'Visit site' })
  expect(link).toHaveAttribute('href', 'https://example.com')
})

// Unlike Button, Link never forces target=_blank -- in-app navigation is the
// common case, so it stays untouched unless the consumer passes it through.
test('does not force target=_blank', () => {
  render(Link, { props: { href: 'https://example.com' }, slots: { default: () => 'Visit site' } })
  expect(screen.getByRole('link')).not.toHaveAttribute('target')
})

// Dropping href resolves to a button (role=button), the same tag resolution
// AtButton uses -- so Link still works as an interactive trigger without an
// href to navigate to.
test('no href resolves the root to a button with a button role', () => {
  render(Link, { slots: { default: () => 'Trigger action' } })
  expect(screen.getByRole('button', { name: 'Trigger action' })).toBeInTheDocument()
})

// A disabled link is inert: the href is dropped (so it isn't navigable, which
// also strips the link role), aria-disabled announces it, pointer-events-none
// blocks the cursor.
test('a disabled link is inert: aria-disabled, no href, pointer-events blocked', () => {
  render(Link, {
    props: { href: 'https://example.com', disabled: true },
    slots: { default: () => 'Visit site' },
  })
  const anchor = screen.getByText('Visit site')
  expect(anchor.tagName).toBe('A')
  expect(anchor).toHaveAttribute('aria-disabled', 'true')
  expect(anchor).not.toHaveAttribute('href')
  expect(anchor.className).toContain('pointer-events-none')
})

test('a disabled button-role link carries the native disabled attribute', () => {
  render(Link, { props: { disabled: true }, slots: { default: () => 'Trigger action' } })
  expect(screen.getByRole('button')).toBeDisabled()
})

// inherit (the default) sets no colour class, so the link picks up its
// parent's text colour via Tailwind's `a { color: inherit }` preflight reset.
test('inherit intent applies no colour class', () => {
  render(Link, { slots: { default: () => 'Visit site' } })
  expect(screen.getByText('Visit site').className).not.toMatch(/text-\[/)
})

test('a named intent paints from that intent token', () => {
  render(Link, { props: { intent: 'danger' }, slots: { default: () => 'Delete account' } })
  expect(screen.getByText('Delete account').className).toContain('text-[var(--color-danger-fg)]')
})

// #left renders before the label; #right after -- mirrors AtButton's slot
// contract so an icon reads as leading or trailing the text.
test('a #left icon precedes the label', () => {
  render(Link, {
    props: { href: 'https://example.com' },
    slots: { left: () => icon('left-icon'), default: () => 'Back' },
  })
  const link = screen.getByRole('link')
  expect(link).toHaveTextContent('Back')
  expect(screen.getByTestId('left-icon')).toBeInTheDocument()
})

test('a #right icon follows the label', () => {
  render(Link, {
    props: { href: 'https://example.com' },
    slots: { default: () => 'Continue', right: () => icon('right-icon') },
  })
  const link = screen.getByRole('link')
  expect(link).toHaveTextContent('Continue')
  expect(screen.getByTestId('right-icon')).toBeInTheDocument()
})

// No font-size/weight/leading utility and no inline-flex/inline-block display
// on the root -- both are what let the label inherit surrounding typography
// and wrap across lines like ordinary text instead of holding itself together
// as one atomic box.
test('the root sets no font or block-display utility', () => {
  render(Link, { props: { href: 'https://example.com' }, slots: { default: () => 'Visit site' } })
  const className = screen.getByRole('link').className
  expect(className).not.toMatch(
    /\b(?:text-(?:xs|sm|base|lg|xl)|font-(?:body|heading|bold)|inline-flex|inline-block)\b/,
  )
})

// The single visual snap for Link: the Snapshot story's board (every intent,
// icon arrangement, state, and paragraph context on one screen). Baseline:
// __snaps__/link-chromium-linux.png. Rebaseline: pnpm test:update.
test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'link')
})

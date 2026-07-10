import { composeStories } from '@storybook/vue3-vite'
import { render, screen, within } from '@testing-library/vue'
import { expect, test } from 'vitest'
import { h } from 'vue'
import Card from './AtCard.vue'
import * as stories from './AtCard.stories'
import { snapBoard } from '../../test/snap'

const { Snapshot } = composeStories(stories)

// The default slot is the flexible content area: whatever it's handed renders in
// the body region.
test('renders default-slot content in the body', () => {
  render(Card, { slots: { default: () => 'Body content' } })
  expect(screen.getByTestId('card-body')).toHaveTextContent('Body content')
})

// Header and footer are optional regions; absent slots render no region at all,
// so there are no stray dividers.
test('omits the header and footer regions when their slots are unused', () => {
  render(Card, { slots: { default: () => 'Body' } })
  expect(screen.queryByTestId('card-header')).toBeNull()
  expect(screen.queryByTestId('card-footer')).toBeNull()
  expect(screen.queryAllByRole('separator')).toHaveLength(0)
})

// Header present: its content renders and a divider parts it from the body.
test('renders the header slot with a divider below it', () => {
  render(Card, {
    slots: { header: () => 'Title', default: () => 'Body' },
  })
  expect(screen.getByTestId('card-header')).toHaveTextContent('Title')
  expect(screen.getAllByRole('separator')).toHaveLength(1)
})

// Footer present: its content renders and a divider parts it from the body.
test('renders the footer slot with a divider above it', () => {
  render(Card, {
    slots: { footer: () => 'Actions', default: () => 'Body' },
  })
  expect(screen.getByTestId('card-footer')).toHaveTextContent('Actions')
  expect(screen.getAllByRole('separator')).toHaveLength(1)
})

// Header and footer together: a divider on each side of the body.
test('renders a divider for each of the header and footer', () => {
  render(Card, {
    slots: { header: () => 'Title', footer: () => 'Actions', default: () => 'Body' },
  })
  expect(screen.getAllByRole('separator')).toHaveLength(2)
})

// The dissecting dividers match the card's border colour (border-default), not
// the divider's lighter default (border-strong), so they read as part of the
// card's frame.
test('internal dividers match the card border colour', () => {
  render(Card, {
    slots: { header: () => 'Title', footer: () => 'Actions', default: () => 'Body' },
  })
  screen.getAllByRole('separator').forEach((divider) => {
    expect(divider.className).toContain('bg-border-default')
  })
})

// A tappable card extrudes like a default button: a chunky hard bottom edge that
// presses flush on click, rather than the quieter static-card shadow.
test('interactive cards carry the button-style extruded shadow', () => {
  render(Card, {
    props: { href: 'https://example.com' },
    slots: { default: () => 'Tappable' },
  })
  const link = screen.getByRole('link', { name: 'Tappable' })
  expect(link.className).toContain('active:translate-y-[6px]')
  expect(link.className).not.toContain('shadow-[var(--shadow-raised)]')
})

// A static card rests at high on the elevation ladder, not the extruded button mechanic.
test('static cards keep the quiet system shadow', () => {
  const { container } = render(Card, { slots: { default: () => 'Static' } })
  // eslint-disable-next-line testing-library/no-node-access
  const root = container.firstElementChild
  expect(root?.className).toContain('shadow-high')
})

// The header composes actions: a close icon button at its right edge lives
// inside the header region alongside the title.
test('the header region composes a trailing action alongside its content', () => {
  render(Card, {
    slots: {
      header: () => [h('span', 'Title'), h('button', { 'aria-label': 'Close' }, 'x')],
      default: () => 'Body',
    },
  })
  const header = screen.getByTestId('card-header')
  expect(within(header).getByRole('button', { name: 'Close' })).toBeInTheDocument()
})

// An href makes the whole card a single tappable action: it renders as an
// anchor carrying the href.
test('href renders the card as an anchor', () => {
  render(Card, {
    props: { href: 'https://example.com' },
    slots: { default: () => 'Tappable' },
  })
  const link = screen.getByRole('link', { name: 'Tappable' })
  expect(link).toHaveAttribute('href', 'https://example.com')
})

// Without an href the root is a plain div, not an interactive element.
test('renders a non-interactive div by default', () => {
  render(Card, { slots: { default: () => 'Static' } })
  expect(screen.queryByRole('link')).toBeNull()
})

// An external href (absolute URL) opens in a new tab, guarded against
// reverse-tabnabbing.
test('an external href opens in a new tab with a rel guard', () => {
  render(Card, {
    props: { href: 'https://example.com' },
    slots: { default: () => 'External' },
  })
  const link = screen.getByRole('link', { name: 'External' })
  expect(link).toHaveAttribute('target', '_blank')
  expect(link).toHaveAttribute('rel', 'noopener noreferrer')
})

// An internal href (relative path) navigates in place -- no new tab.
test('an internal href stays in the same tab', () => {
  render(Card, {
    props: { href: '/settings' },
    slots: { default: () => 'Internal' },
  })
  const link = screen.getByRole('link', { name: 'Internal' })
  expect(link).not.toHaveAttribute('target')
})

// Top media (the default) renders the slot but no side-media wrapper.
test('places media on top by default', () => {
  render(Card, {
    slots: { media: () => h('img', { 'data-testid': 'media', alt: '' }), default: () => 'Body' },
  })
  expect(screen.getByTestId('media')).toBeInTheDocument()
  expect(screen.queryByTestId('card-media-side')).toBeNull()
})

// Side placement wraps the media beside the content column.
test('places media to the side when mediaPosition is left or right', () => {
  render(Card, {
    props: { mediaPosition: 'left' },
    slots: { media: () => h('img', { 'data-testid': 'media', alt: '' }), default: () => 'Body' },
  })
  const side = screen.getByTestId('card-media-side')
  expect(within(side).getByTestId('media')).toBeInTheDocument()
})

// The single visual snap for Card: the Snapshot story's board (every shape on
// one screen). Baseline: __snaps__/card-chromium-linux.png. Rebaseline:
// pnpm test:update.
test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'card')
})

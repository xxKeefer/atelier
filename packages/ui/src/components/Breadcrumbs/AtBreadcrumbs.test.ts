import { composeStories } from '@storybook/vue3-vite'
import { render, screen, within } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { expect, test } from 'vitest'
import { PhHouse } from '@phosphor-icons/vue'
import Breadcrumbs from './AtBreadcrumbs.vue'
import BreadcrumbItem from './AtBreadcrumbItem.vue'
import * as stories from './AtBreadcrumbs.stories'
import { snapBoard } from '../../test/snap'

const { Snapshot } = composeStories(stories)

test('renders a nav landmark labelled Breadcrumb', () => {
  render(Breadcrumbs, { slots: { default: '<li></li>' } })
  expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument()
})

test('non-current items render as links', () => {
  render(Breadcrumbs, {
    global: { components: { BreadcrumbItem } },
    slots: { default: '<BreadcrumbItem href="/">Home</BreadcrumbItem>' },
  })
  expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
})

test('current item renders as non-interactive text marked aria-current', () => {
  render(Breadcrumbs, {
    global: { components: { BreadcrumbItem } },
    slots: { default: '<BreadcrumbItem current>Profile</BreadcrumbItem>' },
  })
  expect(screen.queryByRole('link', { name: 'Profile' })).toBeNull()
  expect(screen.getByText('Profile')).toHaveAttribute('aria-current', 'page')
})

test('disabled item is not navigable', () => {
  render(Breadcrumbs, {
    global: { components: { BreadcrumbItem } },
    slots: { default: '<BreadcrumbItem href="/archived" disabled>Archived</BreadcrumbItem>' },
  })
  const link = screen.getByText('Archived')
  expect(link).not.toHaveAttribute('href')
  expect(link).toHaveAttribute('aria-disabled', 'true')
})

test('item icon is opt-in per item, not automatic', () => {
  render(BreadcrumbItem, { props: { href: '/', icon: PhHouse }, slots: { default: 'Home' } })
  // The icon rides in AtLink's #left slot; ordinal position has no Testing
  // Library query, so assert child presence directly.
  const link = screen.getByRole('link', { name: 'Home' })
  // eslint-disable-next-line testing-library/no-node-access
  expect(link.firstElementChild).toBeTruthy()
})

test('an item without an icon prop has no leading icon', () => {
  render(BreadcrumbItem, { props: { href: '/' }, slots: { default: 'Home' } })
  const link = screen.getByRole('link', { name: 'Home' })
  // eslint-disable-next-line testing-library/no-node-access
  expect(link.firstElementChild).toBeNull()
})

// The default separator (caret) renders once per item after the first --
// n items produce n-1 visible separators plus one hidden on the first.
test('default separator does not precede the first item', () => {
  render(Breadcrumbs, {
    global: { components: { BreadcrumbItem } },
    slots: {
      default: `
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem current>Profile</BreadcrumbItem>
      `,
    },
  })
  const items = screen.getAllByRole('listitem')
  expect(items).toHaveLength(2)
  const [firstItem, secondItem] = items as [HTMLElement, HTMLElement]
  const firstSeparator = within(firstItem).getByTestId('breadcrumb-separator')
  const secondSeparator = within(secondItem).getByTestId('breadcrumb-separator')
  expect(getComputedStyle(firstSeparator).display).toBe('none')
  expect(getComputedStyle(secondSeparator).display).not.toBe('none')
})

test('under maxItems, no items collapse', () => {
  render(Breadcrumbs, {
    props: { maxItems: 5 },
    global: { components: { BreadcrumbItem } },
    slots: {
      default: `
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/settings">Settings</BreadcrumbItem>
        <BreadcrumbItem current>Profile</BreadcrumbItem>
      `,
    },
  })
  expect(screen.getAllByRole('listitem')).toHaveLength(3)
  expect(screen.queryByTestId('breadcrumb-overflow-trigger')).toBeNull()
})

test('over maxItems, middle items collapse behind an overflow trigger', () => {
  render(Breadcrumbs, {
    props: { maxItems: 3 },
    global: { components: { BreadcrumbItem } },
    slots: {
      default: `
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/a">A</BreadcrumbItem>
        <BreadcrumbItem href="/a/b">B</BreadcrumbItem>
        <BreadcrumbItem href="/a/b/c">C</BreadcrumbItem>
        <BreadcrumbItem current>Profile</BreadcrumbItem>
      `,
    },
  })
  // first item + overflow trigger + (maxItems - 1) trailing items.
  expect(screen.getAllByRole('listitem')).toHaveLength(4)
  expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'C' })).toBeInTheDocument()
  expect(screen.getByText('Profile')).toHaveAttribute('aria-current', 'page')
  expect(screen.queryByRole('link', { name: 'A' })).toBeNull()
  expect(screen.queryByRole('link', { name: 'B' })).toBeNull()
})

test('the overflow trigger opens a menu revealing the hidden items', async () => {
  render(Breadcrumbs, {
    props: { maxItems: 3 },
    global: { components: { BreadcrumbItem } },
    slots: {
      default: `
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/a">A</BreadcrumbItem>
        <BreadcrumbItem href="/a/b">B</BreadcrumbItem>
        <BreadcrumbItem href="/a/b/c">C</BreadcrumbItem>
        <BreadcrumbItem current>Profile</BreadcrumbItem>
      `,
    },
  })
  await userEvent.click(screen.getByTestId('breadcrumb-overflow-trigger'))
  expect(await screen.findByRole('menuitem', { name: 'A' })).toBeInTheDocument()
  expect(screen.getByRole('menuitem', { name: 'B' })).toBeInTheDocument()
})

test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'breadcrumbs')
})

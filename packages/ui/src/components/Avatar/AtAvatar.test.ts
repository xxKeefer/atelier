import { composeStories } from '@storybook/vue3-vite'
import { render, screen } from '@testing-library/vue'
import { expect, test } from 'vitest'
import { nextTick } from 'vue'
import Avatar from './AtAvatar.vue'
import * as stories from './AtAvatar.stories'
import { snapBoard } from '../../test/snap'

const { Snapshot } = composeStories(stories)

test('renders the image when src is given', () => {
  render(Avatar, { props: { src: '/photo.jpg', alt: 'Jane Smith' } })
  expect(screen.getByRole('img', { name: 'Jane Smith' })).toHaveAttribute('src', '/photo.jpg')
})

test('falls back to initials when the image fails to load', async () => {
  render(Avatar, { props: { src: '/broken.jpg', alt: '', initials: 'JS' } })
  const img = screen.getByRole('img', { hidden: true })
  img.dispatchEvent(new Event('error'))
  await nextTick()
  expect(screen.getByText('JS')).toBeInTheDocument()
})

test('falls back to initials when there is no src', () => {
  render(Avatar, { props: { initials: 'AT' } })
  expect(screen.getByText('AT')).toBeInTheDocument()
})

test('falls back to a decorative glyph when there is no src or initials', () => {
  render(Avatar, {})
  expect(screen.queryByRole('img')).not.toBeInTheDocument()
})

test('a glyph fallback with a label is announced as a named img', () => {
  render(Avatar, { props: { label: 'Unknown user' } })
  expect(screen.getByRole('img', { name: 'Unknown user' })).toBeInTheDocument()
})

test('retries the image when src changes after a previous failure', async () => {
  const view = render(Avatar, { props: { src: '/broken.jpg', alt: '', initials: 'JS' } })
  screen.getByRole('img', { hidden: true }).dispatchEvent(new Event('error'))
  await nextTick()
  expect(screen.getByText('JS')).toBeInTheDocument()

  await view.rerender({ src: '/photo.jpg', alt: '', initials: 'JS' })
  expect(screen.getByRole('img', { hidden: true })).toHaveAttribute('src', '/photo.jpg')
})

// The single visual snap for Avatar: sizes, shapes, and fallback states together.
// Baseline: __snaps__/avatar-chromium-linux.png. Rebaseline: pnpm test:update.
test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'avatar')
})

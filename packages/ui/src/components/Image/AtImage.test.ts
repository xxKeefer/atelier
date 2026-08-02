import { composeStories } from '@storybook/vue3-vite'
import { render, screen } from '@testing-library/vue'
import { expect, test } from 'vitest'
import { nextTick } from 'vue'
import Image from './AtImage.vue'
import * as stories from './AtImage.stories'
import { snapBoard } from '../../test/snap'

const { Snapshot } = composeStories(stories)

test('renders the src and alt text', () => {
  render(Image, { props: { src: '/photo.jpg', alt: 'A mountain at sunrise' } })
  const img = screen.getByRole('img', { name: 'A mountain at sunrise' })
  expect(img).toHaveAttribute('src', '/photo.jpg')
})

test('an empty alt gives the image no accessible name', () => {
  render(Image, { props: { src: '/photo.jpg', alt: '' } })
  expect(screen.getByRole('img', { name: '' })).toHaveAttribute('alt', '')
})

test('numeric width/height render as pixel dimensions', () => {
  render(Image, { props: { src: '/photo.jpg', alt: 'A mountain', width: 80, height: 60 } })
  const img = screen.getByRole('img')
  expect(img).toHaveStyle({ width: '80px', height: '60px' })
})

test('aspectRatio without width/height fills the parent width and derives height', () => {
  render(Image, { props: { src: '/photo.jpg', alt: 'A mountain', aspectRatio: '16/9' } })
  const img = screen.getByRole('img')
  expect(img).toHaveStyle({ width: '100%', aspectRatio: '16/9' })
})

test('renders a fallback when src is missing', () => {
  render(Image, { props: { alt: 'A mountain' } })
  expect(screen.getByRole('img', { name: 'A mountain' }).tagName).toBe('DIV')
})

test('renders a fallback when the image fails to load', async () => {
  render(Image, { props: { src: '/broken.jpg', alt: 'A mountain' } })
  const img = screen.getByRole('img', { name: 'A mountain' })
  expect(img.tagName).toBe('IMG')
  img.dispatchEvent(new Event('error'))
  await nextTick()
  expect(screen.getByRole('img', { name: 'A mountain' }).tagName).toBe('DIV')
})

test('does not render a fallback for a successfully loaded image', () => {
  render(Image, { props: { src: '/photo.jpg', alt: 'A mountain' } })
  expect(screen.getByRole('img', { name: 'A mountain' }).tagName).toBe('IMG')
})

// The single visual snap for Image: fixed-size and aspect-ratio boards together.
// Baseline: __snaps__/image-chromium-linux.png. Rebaseline: pnpm test:update.
test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'image')
})

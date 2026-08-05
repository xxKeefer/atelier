import { composeStories } from '@storybook/vue3-vite'
import { render, screen } from '@testing-library/vue'
import { expect, test, vi } from 'vitest'
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

// `alt` has no default, so Vue's compiled prop options mark it required and
// warn in dev if a caller skips it -- there is no runtime way to tell an
// omitted alt apart from an intentionally decorative "" one, so this warning
// is the only enforcement point for "non-decorative images need alt text".
test('a missing alt warns in dev', () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
  render(Image, { props: { src: '/photo.jpg' } as never })
  expect(warn.mock.calls[0]?.[0]).toContain('Missing required prop: "alt"')
  warn.mockRestore()
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

test('srcset forwards to the underlying img for density-based asset selection', () => {
  render(Image, {
    props: {
      src: '/photo.jpg',
      srcset: '/photo.jpg 1x, /photo-2x.jpg 2x',
      alt: 'A mountain',
    },
  })
  const img = screen.getByRole('img', { name: 'A mountain' })
  expect(img).toHaveAttribute('srcset', '/photo.jpg 1x, /photo-2x.jpg 2x')
})

test('does not render a fallback for a successfully loaded image', () => {
  render(Image, { props: { src: '/photo.jpg', alt: 'A mountain' } })
  expect(screen.getByRole('img', { name: 'A mountain' }).tagName).toBe('IMG')
})

const svgDataUri = (body: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg">${body}</svg>`)}`

test('inlines SVG markup instead of rendering it via an <img>', async () => {
  render(Image, { props: { src: svgDataUri('<circle r="4" />'), alt: 'A circle' } })
  const host = screen.getByRole('img', { name: 'A circle' })
  expect(host.tagName).toBe('DIV')
  await vi.waitFor(() => {
    // eslint-disable-next-line testing-library/no-node-access -- asserting the fetched SVG markup was inlined isn't expressible via role/text queries
    expect(host.querySelector('svg')).toBeTruthy()
  })
})

test('detects SVG by a .svg path extension, not just the data-URI MIME', async () => {
  render(Image, { props: { src: '/icon.svg', alt: 'An icon' } })
  const host = await screen.findByRole('img', { name: 'An icon' })
  expect(host.tagName).toBe('DIV')
})

test('ignores srcset on the inline-SVG path', async () => {
  render(Image, {
    props: {
      src: svgDataUri('<circle r="4" />'),
      srcset: `${svgDataUri('<circle r="8" />')} 2x`,
      alt: 'A circle',
    },
  })
  const host = await screen.findByRole('img', { name: 'A circle' })
  // eslint-disable-next-line testing-library/no-node-access -- asserting the absence of a forwarded srcset attribute isn't expressible via role/text queries
  expect(host.querySelector('[srcset]')).toBeNull()
})

test('strips scripts and event-handler attributes from fetched SVG markup', async () => {
  render(Image, {
    props: {
      src: svgDataUri(
        '<script>window.pwned = true</script><circle r="4" onclick="window.pwned = true" />',
      ),
      alt: 'A circle',
    },
  })
  const host = screen.getByRole('img', { name: 'A circle' })
  await vi.waitFor(() => {
    // eslint-disable-next-line testing-library/no-node-access -- asserting sanitized SVG markup isn't expressible via role/text queries
    expect(host.querySelector('circle')).toBeTruthy()
  })
  // eslint-disable-next-line testing-library/no-node-access -- asserting sanitized SVG markup isn't expressible via role/text queries
  expect(host.querySelector('script')).toBeNull()
  // eslint-disable-next-line testing-library/no-node-access -- asserting sanitized SVG markup isn't expressible via role/text queries
  expect(host.querySelector('circle')?.getAttribute('onclick')).toBeNull()
})

test('renders a fallback when the SVG fails to parse', async () => {
  // Unclosed tag makes this invalid XML, so DOMParser reports a parsererror.
  render(Image, { props: { src: svgDataUri('<circle r="4"'), alt: 'A circle' } })
  await vi.waitFor(() => {
    expect(screen.getByRole('img', { name: 'A circle' })).toHaveClass('border-thick')
  })
})

// The single visual snap for Image: fixed-size and aspect-ratio boards together.
// Baseline: __snaps__/image-chromium-linux.png. Rebaseline: pnpm test:update.
test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'image')
})

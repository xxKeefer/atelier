import { composeStories } from '@storybook/vue3-vite'
import { render, screen } from '@testing-library/vue'
import { expect, test } from 'vitest'
import ScrollArea from './AtScrollArea.vue'
import * as stories from './AtScrollArea.stories'
import { snapBoard } from '../../test/snap'

const { Snapshot } = composeStories(stories)

// reka-ui's ScrollAreaViewport wraps the slot content -- confirm it renders
// through, not just the surrounding scrollbar chrome.
test('renders slot content inside the viewport', () => {
  render(ScrollArea, {
    slots: { default: '<p>Scrollable content</p>' },
  })
  expect(screen.getByText('Scrollable content')).toBeInTheDocument()
})

// reka-ui only mounts a scrollbar once its axis actually overflows the
// viewport, tracked via ResizeObserver -- a fixed-size box with oversize
// content in both axes makes both orientations overflow on demand. type
// "always" skips the hover/scroll interaction type="hover" (the default)
// would otherwise need simulated to mount the scrollbar at all.
const overflowingContent = '<div style="width: 800px; height: 800px">Overflowing content</div>'

// orientation="vertical" (the default) mounts only the vertical scrollbar.
test('defaults to a vertical-only scrollbar', () => {
  render(ScrollArea, {
    props: { type: 'always', style: 'width: 96px; height: 96px' },
    slots: { default: overflowingContent },
  })
  expect(screen.getByTestId('scrollarea-scrollbar-vertical')).toBeInTheDocument()
  expect(screen.queryByTestId('scrollarea-scrollbar-horizontal')).not.toBeInTheDocument()
})

// orientation="horizontal" swaps to the horizontal scrollbar only.
test('orientation="horizontal" mounts only the horizontal scrollbar', () => {
  render(ScrollArea, {
    props: { orientation: 'horizontal', type: 'always', style: 'width: 96px; height: 96px' },
    slots: { default: overflowingContent },
  })
  expect(screen.queryByTestId('scrollarea-scrollbar-vertical')).not.toBeInTheDocument()
  expect(screen.getByTestId('scrollarea-scrollbar-horizontal')).toBeInTheDocument()
})

// orientation="both" mounts both scrollbars plus the corner reka-ui renders
// to avoid the thumbs overlapping in the shared corner.
test('orientation="both" mounts both scrollbars', () => {
  render(ScrollArea, {
    props: { orientation: 'both', type: 'always', style: 'width: 96px; height: 96px' },
    slots: { default: overflowingContent },
  })
  expect(screen.getByTestId('scrollarea-scrollbar-vertical')).toBeInTheDocument()
  expect(screen.getByTestId('scrollarea-scrollbar-horizontal')).toBeInTheDocument()
})

// type="always" keeps the thumb's data-state="visible" without scroll/hover
// interaction -- the mode every other assertion here doesn't need to simulate.
test('type="always" renders the thumb as visible without interaction', () => {
  render(ScrollArea, {
    props: { type: 'always' },
    slots: { default: '<div style="height: 2000px">Tall content</div>' },
  })
  expect(screen.getByTestId('scrollarea-thumb-vertical')).toHaveAttribute('data-state', 'visible')
})

// The single visual snap for ScrollArea: the Snapshot story's board.
// Baseline: __snaps__/scroll-area-chromium-linux.png. Rebaseline: pnpm test:update.
test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'scroll-area')
})

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
// defaults to "always", so no hover/scroll interaction needs simulating to
// mount the scrollbar.
const overflowingContent = '<div style="width: 800px; height: 800px">Overflowing content</div>'

// orientation="vertical" (the default) mounts only the vertical scrollbar.
test('defaults to a vertical-only scrollbar', () => {
  render(ScrollArea, {
    props: { style: 'width: 96px; height: 96px' },
    slots: { default: overflowingContent },
  })
  expect(screen.getByTestId('scrollarea-scrollbar-vertical')).toBeInTheDocument()
  expect(screen.queryByTestId('scrollarea-scrollbar-horizontal')).not.toBeInTheDocument()
})

// orientation="horizontal" swaps to the horizontal scrollbar only.
test('orientation="horizontal" mounts only the horizontal scrollbar', () => {
  render(ScrollArea, {
    props: { orientation: 'horizontal', style: 'width: 96px; height: 96px' },
    slots: { default: overflowingContent },
  })
  expect(screen.queryByTestId('scrollarea-scrollbar-vertical')).not.toBeInTheDocument()
  expect(screen.getByTestId('scrollarea-scrollbar-horizontal')).toBeInTheDocument()
})

// orientation="both" mounts both scrollbars plus the corner reka-ui renders
// to avoid the thumbs overlapping in the shared corner.
test('orientation="both" mounts both scrollbars', () => {
  render(ScrollArea, {
    props: { orientation: 'both', style: 'width: 96px; height: 96px' },
    slots: { default: overflowingContent },
  })
  expect(screen.getByTestId('scrollarea-scrollbar-vertical')).toBeInTheDocument()
  expect(screen.getByTestId('scrollarea-scrollbar-horizontal')).toBeInTheDocument()
})

// The default type ("always") keeps the thumb's data-state="visible" without
// scroll/hover interaction -- a scrollable pane must always signal that it's
// scrollable, not just on hover.
test('defaults to the thumb visible without interaction', () => {
  render(ScrollArea, {
    slots: { default: '<div style="height: 2000px">Tall content</div>' },
  })
  expect(screen.getByTestId('scrollarea-thumb-vertical')).toHaveAttribute('data-state', 'visible')
})

// type="hover" is still available for a consumer that explicitly wants the
// native overlay-scrollbar behaviour instead of the always-visible default --
// reka-ui unmounts the scrollbar entirely (not just visually hides it) until
// a pointer enters the scroll area.
test('type="hover" omits the thumb until hover/scroll interaction', () => {
  render(ScrollArea, {
    props: { type: 'hover' },
    slots: { default: '<div style="height: 2000px">Tall content</div>' },
  })
  expect(screen.queryByTestId('scrollarea-thumb-vertical')).not.toBeInTheDocument()
})

// The single visual snap for ScrollArea: the Snapshot story's board.
// Baseline: __snaps__/scroll-area-chromium-linux.png. Rebaseline: pnpm test:update.
test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'scroll-area')
})

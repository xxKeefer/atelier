import { composeStories } from '@storybook/vue3-vite'
import { render, screen } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { expect, test } from 'vitest'
import Tooltip from './AtTooltip.vue'
import * as stories from './AtTooltip.stories'
import { snapBoard } from '../../test/snap'

const { Snapshot } = composeStories(stories)

// The tooltip is portalled and only mounts once open -- closed by default, no
// content sitting in the DOM ahead of interaction.
test('tooltip content is not in the DOM until triggered', () => {
  render(Tooltip, {
    props: { text: 'More info', delay: 0 },
    slots: { default: '<button>Hover me</button>' },
  })
  expect(screen.queryByTestId('tooltip-content')).not.toBeInTheDocument()
})

test('hovering the trigger reveals the tooltip text', async () => {
  render(Tooltip, {
    props: { text: 'More info', delay: 0 },
    slots: { default: '<button>Hover me</button>' },
  })
  await userEvent.hover(screen.getByText('Hover me'))
  expect(await screen.findByTestId('tooltip-content')).toHaveTextContent('More info')
})

// Timeout: a non-zero delay holds the tooltip closed while the pointer is
// still moving through the trigger, so brief hovers don't flash it open.
test('a delay holds the tooltip closed until it elapses', async () => {
  render(Tooltip, {
    props: { text: 'More info', delay: 200 },
    slots: { default: '<button>Hover me</button>' },
  })
  await userEvent.hover(screen.getByText('Hover me'))
  expect(screen.queryByTestId('tooltip-content')).not.toBeInTheDocument()
  expect(await screen.findByTestId('tooltip-content', {}, { timeout: 1000 })).toBeInTheDocument()
})

// Keyboard support: focusing the trigger (not just hovering it) opens the
// tooltip -- reka's TooltipTrigger owns this via :focus-visible.
test('focusing the trigger reveals the tooltip', async () => {
  render(Tooltip, {
    props: { text: 'More info', delay: 0 },
    slots: { default: '<button>Hover me</button>' },
  })
  await userEvent.tab()
  expect(await screen.findByTestId('tooltip-content')).toHaveTextContent('More info')
})

// Positioning: the requested side comes through to the rendered content as
// reka's data-side hook, confirming the prop is wired to the primitive.
test('side prop sets the preferred placement', async () => {
  render(Tooltip, {
    props: { text: 'More info', delay: 0, side: 'right' },
    slots: { default: '<button>Hover me</button>' },
  })
  await userEvent.hover(screen.getByText('Hover me'))
  expect(await screen.findByTestId('tooltip-content')).toHaveAttribute('data-side', 'right')
})

test('disabled prevents the tooltip from opening', async () => {
  render(Tooltip, {
    props: { text: 'More info', delay: 0, disabled: true },
    slots: { default: '<button>Hover me</button>' },
  })
  await userEvent.hover(screen.getByText('Hover me'))
  await new Promise((resolve) => setTimeout(resolve, 50))
  expect(screen.queryByTestId('tooltip-content')).not.toBeInTheDocument()
})

// The single visual snap for Tooltip: the Snapshot story's board. Baseline:
// __snaps__/tooltip-chromium-linux.png. Rebaseline: pnpm test:update.
test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'tooltip')
})

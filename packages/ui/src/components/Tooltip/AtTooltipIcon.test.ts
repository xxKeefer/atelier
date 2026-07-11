import { composeStories } from '@storybook/vue3-vite'
import { render, screen } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { expect, test } from 'vitest'
import TooltipIcon from './AtTooltipIcon.vue'
import * as stories from './AtTooltipIcon.stories'
import { snapBoard } from '../../test/snap'

const { Snapshot } = composeStories(stories)

test('hovering the warning variant reveals the tooltip text with a warning icon trigger', async () => {
  render(TooltipIcon, { props: { variant: 'warning', text: 'Careful', delay: 0 } })
  expect(screen.getByRole('img', { name: 'Warning' })).toBeInTheDocument()
  await userEvent.hover(screen.getByRole('img', { name: 'Warning' }))
  expect(await screen.findByTestId('tooltip-content')).toHaveTextContent('Careful')
})

test('info variant renders an info icon trigger', () => {
  render(TooltipIcon, { props: { variant: 'info', text: 'FYI', delay: 0 } })
  expect(screen.getByRole('img', { name: 'Information' })).toBeInTheDocument()
})

test('question variant renders a question icon trigger', () => {
  render(TooltipIcon, { props: { variant: 'question', text: 'Why?', delay: 0 } })
  expect(screen.getByRole('img', { name: 'Question' })).toBeInTheDocument()
})

test('side defaults to left', () => {
  // Asserted against the component's own prop default rather than reka's
  // rendered data-side: reka's avoidCollisions can flip the preferred side
  // when the test viewport has no room on that edge, which isn't what this
  // prop test is checking (that's AtTooltip's positioning behaviour, already
  // covered there).
  expect(TooltipIcon.props?.side).toMatchObject({ default: 'left' })
})

test('side prop overrides the left default', async () => {
  render(TooltipIcon, { props: { variant: 'info', text: 'FYI', delay: 0, side: 'bottom' } })
  await userEvent.hover(screen.getByRole('img', { name: 'Information' }))
  expect(await screen.findByTestId('tooltip-content')).toHaveAttribute('data-side', 'bottom')
})

// The single visual snap for TooltipIcon: the Snapshot story's board.
// Baseline: __snaps__/tooltip-icon-chromium-linux.png. Rebaseline: pnpm test:update.
test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'tooltip-icon')
})

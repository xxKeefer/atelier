import { composeStories } from '@storybook/vue3-vite'
import { render, screen } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { expect, test } from 'vitest'
import Pagination from './AtPagination.vue'
import * as stories from './AtPagination.stories'
import { snapBoard } from '../../test/snap'
import { getPaginationRange, ELLIPSIS } from './usePaginationRange'

const { Snapshot } = composeStories(stories)

// -- Range calculation (usePaginationRange) --------------------------------

test('renders every page with no ellipsis when the total fits the window', () => {
  expect(getPaginationRange(2, 4, 1, 1)).toEqual([1, 2, 3, 4])
})

test('start of range: right ellipsis only', () => {
  expect(getPaginationRange(1, 20, 1, 1)).toEqual([1, 2, ELLIPSIS, 20])
})

test('middle of range: ellipsis on both sides', () => {
  expect(getPaginationRange(10, 20, 1, 1)).toEqual([1, ELLIPSIS, 9, 10, 11, ELLIPSIS, 20])
})

test('end of range: left ellipsis only', () => {
  expect(getPaginationRange(20, 20, 1, 1)).toEqual([1, ELLIPSIS, 19, 20])
})

// A gap of exactly one hidden page is filled with that page, not an ellipsis
// that could only ever have hidden one page.
test('a single-page gap is filled with the page number, not an ellipsis', () => {
  expect(getPaginationRange(4, 20, 1, 1)).toEqual([1, 2, 3, 4, 5, ELLIPSIS, 20])
})

test('wider sibling/boundary counts widen the window', () => {
  expect(getPaginationRange(10, 20, 2, 2)).toEqual([
    1,
    2,
    ELLIPSIS,
    8,
    9,
    10,
    11,
    12,
    ELLIPSIS,
    19,
    20,
  ])
})

test('empty totalPages returns an empty range', () => {
  expect(getPaginationRange(1, 0, 1, 1)).toEqual([])
})

// -- Component behaviour -----------------------------------------------------

test('the current page is highlighted and non-interactive', () => {
  render(Pagination, { props: { modelValue: 10, totalPages: 20 } })
  const current = screen.getByText('10', { selector: '[aria-current="page"]' })
  expect(current).toBeInTheDocument()
  // Non-interactive: not a button, so it can't be clicked or focused as a control.
  expect(current.tagName).not.toBe('BUTTON')
})

test('clicking another page emits update:modelValue with that page', async () => {
  const view = render(Pagination, { props: { modelValue: 10, totalPages: 20 } })
  const pageButtons = screen.getAllByTestId('pagination-page')
  const nine = pageButtons.find((el) => el.textContent === '9')
  if (!nine) throw new Error('page 9 not found')
  await userEvent.click(nine)
  expect(view.emitted()['update:modelValue']).toEqual([[9]])
})

test('clicking next/previous emits the adjacent page', async () => {
  const view = render(Pagination, { props: { modelValue: 10, totalPages: 20 } })
  await userEvent.click(screen.getByTestId('pagination-next'))
  await userEvent.click(screen.getByTestId('pagination-prev'))
  expect(view.emitted()['update:modelValue']).toEqual([[11], [9]])
})

test('previous is disabled on the first page', () => {
  render(Pagination, { props: { modelValue: 1, totalPages: 20 } })
  expect(screen.getByTestId('pagination-prev')).toBeDisabled()
  expect(screen.getByTestId('pagination-next')).toBeEnabled()
})

test('next is disabled on the last page', () => {
  render(Pagination, { props: { modelValue: 20, totalPages: 20 } })
  expect(screen.getByTestId('pagination-next')).toBeDisabled()
  expect(screen.getByTestId('pagination-prev')).toBeEnabled()
})

test('clicking the first/last boundary page jumps directly there', async () => {
  const view = render(Pagination, { props: { modelValue: 10, totalPages: 20 } })
  const pageButtons = screen.getAllByTestId('pagination-page')
  const last = pageButtons.find((el) => el.textContent === '20')
  if (!last) throw new Error('last page button not found')
  await userEvent.click(last)
  expect(view.emitted()['update:modelValue']).toEqual([[20]])
})

test('ellipsis markers render on both sides in the middle of a long range', () => {
  render(Pagination, { props: { modelValue: 10, totalPages: 20 } })
  expect(screen.getAllByTestId('pagination-ellipsis')).toHaveLength(2)
})

test('no ellipsis renders when the total page count fits the window', () => {
  render(Pagination, { props: { modelValue: 2, totalPages: 4 } })
  expect(screen.queryByTestId('pagination-ellipsis')).toBeNull()
})

// -- Items-per-page selector -------------------------------------------------

test('the page-size selector does not render when no options are supplied', () => {
  render(Pagination, { props: { modelValue: 2, totalPages: 4 } })
  expect(screen.queryByTestId('pagination-page-size')).toBeNull()
})

test('the page-size selector renders when options are supplied', () => {
  render(Pagination, {
    props: { modelValue: 2, totalPages: 4, pageSize: 10, pageSizeOptions: [10, 25, 50] },
  })
  expect(screen.getByTestId('pagination-page-size')).toBeInTheDocument()
})

test('selecting a page size emits update:pageSize with the chosen value', async () => {
  const view = render(Pagination, {
    props: { modelValue: 2, totalPages: 4, pageSize: 10, pageSizeOptions: [10, 25, 50] },
  })
  await userEvent.click(screen.getByTestId('pagination-page-size'))
  await userEvent.click(screen.getByText('25'))
  expect(view.emitted()['update:pageSize']).toEqual([[25]])
})

// -- Indeterminate mode (unknown totalPages) ---------------------------------

test('indeterminate mode renders the current page with no page buttons or ellipsis', () => {
  render(Pagination, { props: { modelValue: 3 } })
  const current = screen.getByText('3', { selector: '[aria-current="page"]' })
  expect(current).toBeInTheDocument()
  expect(current.tagName).not.toBe('BUTTON')
  expect(screen.queryByTestId('pagination-ellipsis')).toBeNull()
  expect(screen.getAllByTestId('pagination-page')).toHaveLength(1)
})

test('indeterminate mode: previous is disabled on the first page, next follows hasNextPage', () => {
  render(Pagination, { props: { modelValue: 1, hasNextPage: true } })
  expect(screen.getByTestId('pagination-prev')).toBeDisabled()
  expect(screen.getByTestId('pagination-next')).toBeEnabled()
})

test('indeterminate mode: next is disabled when hasNextPage is false', () => {
  render(Pagination, { props: { modelValue: 3, hasNextPage: false } })
  expect(screen.getByTestId('pagination-next')).toBeDisabled()
})

test('indeterminate mode: clicking next/previous emits the adjacent page', async () => {
  const view = render(Pagination, { props: { modelValue: 3, hasNextPage: true } })
  await userEvent.click(screen.getByTestId('pagination-next'))
  await userEvent.click(screen.getByTestId('pagination-prev'))
  expect(view.emitted()['update:modelValue']).toEqual([[4], [2]])
})

// The single visual snap for Pagination: the Snapshot story's board (every
// range shape -- no window, start, middle, end, widened window -- on one
// screen). Baseline: __snaps__/pagination-chromium-linux.png. Rebaseline:
// pnpm test:update.
test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'pagination')
})

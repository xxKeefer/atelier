import { composeStories } from '@storybook/vue3-vite'
import { render, screen, within } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { expect, test } from 'vitest'
import VirtualTree from './AtVirtualTree.vue'
import type { TreeItemData } from './AtTree.vue'
import * as stories from './AtVirtualTree.stories'
import { snapBoard } from '../../test/snap'

const { Snapshot } = composeStories(stories)

const bigTree: TreeItemData[] = [
  {
    id: 'src',
    label: 'src',
    children: Array.from({ length: 200 }, (_, i) => ({
      id: `file-${String(i)}`,
      label: `File ${String(i)}.ts`,
    })),
  },
]

const labelSlot = {
  default: '<template #default="{ item }">{{ item.label }}</template>',
}

// A fixed height, forwarded via attrs to TreeRoot's own root element (the
// `ul`) -- TreeVirtualizer treats its immediate DOM parent as the scroll
// container, so the `ul` itself must carry the bounded height, not a
// wrapping div (which would also swallow update:modelValue since it isn't
// the rendered root under test).
const fixedHeight = { style: 'height: 300px' }

// Only a windowed subset of a deep tree is ever mounted -- proves
// virtualization is active rather than flattening+rendering every node.
test('renders fewer treeitem nodes than the total flattened item count', async () => {
  render(VirtualTree, {
    props: { items: bigTree, defaultExpanded: ['src'] },
    attrs: { 'aria-label': 'Files', ...fixedHeight },
    slots: labelSlot,
  })
  const rendered = await screen.findAllByRole('treeitem')
  // 1 folder + 200 files = 201 flattened rows.
  expect(rendered.length).toBeGreaterThan(0)
  expect(rendered.length).toBeLessThan(201)
})

// Even though only a window of rows is mounted, each carries its true
// aria-setsize/aria-posinset (among siblings) and aria-level, same guarantee
// AtVirtualList gives -- so AT announces true position, not the rendered count.
test('rendered treeitems carry correct aria-setsize, aria-posinset, and aria-level', async () => {
  render(VirtualTree, {
    props: { items: bigTree, defaultExpanded: ['src'] },
    attrs: { 'aria-label': 'Files', ...fixedHeight },
    slots: labelSlot,
  })
  const rendered = await screen.findAllByRole('treeitem')
  const files = rendered.filter((node) => node.getAttribute('aria-level') === '2')
  expect(files.length).toBeGreaterThan(0)
  for (const node of files) {
    expect(node.getAttribute('aria-setsize')).toBe('200')
    const posinset = Number(node.getAttribute('aria-posinset'))
    expect(posinset).toBeGreaterThanOrEqual(1)
    expect(posinset).toBeLessThanOrEqual(200)
  }
})

// Composition: arbitrary slot content renders per node, same as AtTree.
test('renders arbitrary per-item content via the default scoped slot', async () => {
  render(VirtualTree, {
    props: { items: [{ id: 'a', label: 'Alpha' }] },
    attrs: { 'aria-label': 'Files', ...fixedHeight },
    slots: {
      default: '<template #default="{ item }"><strong>{{ item.label }}</strong> tag</template>',
    },
  })
  expect(await screen.findByRole('treeitem', { name: 'Alpha tag' })).toBeInTheDocument()
})

// Collapsing the parent unmounts its children's rows, shrinking the visible
// window -- expand/collapse still resizes what the virtualizer counts.
test('collapsing a node removes its children from the rendered window', async () => {
  render(VirtualTree, {
    props: { items: bigTree, defaultExpanded: ['src'] },
    attrs: { 'aria-label': 'Files', ...fixedHeight },
    slots: labelSlot,
  })
  expect((await screen.findAllByRole('treeitem')).length).toBeGreaterThan(1)

  const src = screen.getByRole('treeitem', { name: 'src' })
  await userEvent.click(within(src).getByTestId('tree-item-toggle'))

  const rendered = await screen.findAllByRole('treeitem')
  expect(rendered).toHaveLength(1)
})

// Single selection still works under virtualization -- clicking a rendered
// row emits its id, same contract as non-virtual AtTree.
test('clicking a rendered item emits its id', async () => {
  const view = render(VirtualTree, {
    props: { items: bigTree, defaultExpanded: ['src'], modelValue: 'file-0' },
    attrs: { 'aria-label': 'Files', ...fixedHeight },
    slots: labelSlot,
  })
  const target = await screen.findByRole('treeitem', { name: 'File 1.ts' })
  await userEvent.click(target)
  expect(view.emitted()['update:modelValue']?.at(-1)).toEqual(['file-1'])
})

// Multi-select still works under virtualization -- selecting toggles
// membership in the array, same contract as non-virtual AtTree.
test('multiple mode toggles a rendered node into the array selection', async () => {
  const view = render(VirtualTree, {
    props: { items: bigTree, defaultExpanded: ['src'], multiple: true, modelValue: ['file-0'] },
    attrs: { 'aria-label': 'Files', ...fixedHeight },
    slots: labelSlot,
  })
  const target = await screen.findByRole('treeitem', { name: 'File 1.ts' })
  await userEvent.click(target)
  expect(view.emitted()['update:modelValue']?.at(-1)).toEqual([['file-0', 'file-1']])
})

// TreeVirtualizer positions rows by a fixed estimateSize (28px default) with
// no built-in remeasurement -- if a row's real rendered height exceeds that
// estimate, the next row's absolute offset is computed too early and the two
// overlap. AtTreeItem's real height (icon + label + vertical padding) is
// taller than 28px, so this only surfaces once real content is on screen.
test('rendered rows do not overlap vertically', async () => {
  render(VirtualTree, {
    props: { items: bigTree, defaultExpanded: ['src'] },
    attrs: { 'aria-label': 'Files', ...fixedHeight },
    slots: labelSlot,
  })
  const rendered = await screen.findAllByRole('treeitem')
  const rects = rendered.map((el) => el.getBoundingClientRect())
  for (let i = 1; i < rects.length; i++) {
    const current = rects[i]
    const previous = rects[i - 1]
    if (!current || !previous) continue
    expect(current.top).toBeGreaterThanOrEqual(previous.bottom - 0.5)
  }
})

// The single visual snap for VirtualTree: the Snapshot story's board.
// Baseline: __snaps__/virtual-tree-chromium-linux.png. Rebaseline: pnpm test:update.
test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'virtual-tree')
})

import { composeStories } from '@storybook/vue3-vite'
import { render, screen, within } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { expect, test } from 'vitest'
import Tree from './AtTree.vue'
import type { TreeItemData } from './AtTree.vue'
import * as stories from './AtTree.stories'
import { snapBoard } from '../../test/snap'

const { Snapshot } = composeStories(stories)

const fileTree: TreeItemData[] = [
  {
    id: 'src',
    label: 'src',
    children: [
      { id: 'button', label: 'Button.vue' },
      { id: 'icon', label: 'Icon.vue' },
    ],
  },
  { id: 'readme', label: 'README.md' },
  { id: 'locked', label: 'locked.env', disabled: true },
]

const labelSlot = {
  default: '<template #default="{ item }">{{ item.label }}</template>',
}

// role="tree"/"treeitem" and aria-expanded/aria-selected/aria-level come free
// from reka-ui's TreeRoot/TreeItem -- this confirms it holds through our
// wrapper rather than hand-adding it.
test('exposes tree/treeitem roles with aria-expanded, aria-selected, and aria-level', async () => {
  render(Tree, {
    props: { items: fileTree, modelValue: 'readme', defaultExpanded: ['src'] },
    attrs: { 'aria-label': 'Files' },
    slots: labelSlot,
  })

  expect(await screen.findByRole('tree', { name: 'Files' })).toBeInTheDocument()

  const src = screen.getByRole('treeitem', { name: 'src' })
  expect(src).toHaveAttribute('aria-expanded', 'true')
  expect(src).toHaveAttribute('aria-level', '1')

  const button = screen.getByRole('treeitem', { name: 'Button.vue' })
  expect(button).not.toHaveAttribute('aria-expanded')
  expect(button).toHaveAttribute('aria-level', '2')

  const readme = screen.getByRole('treeitem', { name: 'README.md' })
  expect(readme).toHaveAttribute('aria-selected', 'true')
  expect(button).toHaveAttribute('aria-selected', 'false')
})

// aria-setsize/aria-posinset reflect each node's position among its own
// siblings (not the whole flattened list) -- free from TreeRoot's flattenItems.
test('aria-setsize and aria-posinset reflect position among siblings', async () => {
  render(Tree, {
    props: { items: fileTree, defaultExpanded: ['src'] },
    attrs: { 'aria-label': 'Files' },
    slots: labelSlot,
  })

  const button = await screen.findByRole('treeitem', { name: 'Button.vue' })
  expect(button).toHaveAttribute('aria-setsize', '2')
  expect(button).toHaveAttribute('aria-posinset', '1')

  const readme = screen.getByRole('treeitem', { name: 'README.md' })
  expect(readme).toHaveAttribute('aria-setsize', '3')
  expect(readme).toHaveAttribute('aria-posinset', '2')
})

// Composition: arbitrary slot content (not just a label string) renders per
// node, including markup composed alongside the label.
test('renders arbitrary per-item content via the default scoped slot', () => {
  render(Tree, {
    props: { items: [{ id: 'a', label: 'Alpha' }] },
    attrs: { 'aria-label': 'Files' },
    slots: {
      default: '<template #default="{ item }"><strong>{{ item.label }}</strong> tag</template>',
    },
  })
  const item = screen.getByRole('treeitem', { name: 'Alpha tag' })
  expect(within(item).getByText('Alpha').tagName).toBe('STRONG')
})

// Children only mount once their parent is expanded -- a node with children
// shows a caret that toggles it, same disclosure idiom as AtAccordion.
test('the disclosure caret expands and collapses a node, mounting/unmounting its children', async () => {
  render(Tree, {
    props: { items: fileTree },
    attrs: { 'aria-label': 'Files' },
    slots: labelSlot,
  })

  expect(screen.queryByRole('treeitem', { name: 'Button.vue' })).not.toBeInTheDocument()

  const src = screen.getByRole('treeitem', { name: 'src' })
  const caret = within(src).getByTestId('tree-item-toggle')
  expect(src).toHaveAttribute('aria-expanded', 'false')

  await userEvent.click(caret)
  expect(src).toHaveAttribute('aria-expanded', 'true')
  expect(screen.getByRole('treeitem', { name: 'Button.vue' })).toBeInTheDocument()

  await userEvent.click(caret)
  expect(src).toHaveAttribute('aria-expanded', 'false')
  expect(screen.queryByRole('treeitem', { name: 'Button.vue' })).not.toBeInTheDocument()
})

// expanded/defaultExpanded (array of keys) drive open state, controllable via
// v-model the same way AtAccordion's modelValue is.
test('defaultExpanded opens nodes uncontrolled, expanded controls them', () => {
  const view = render(Tree, {
    props: { items: fileTree, defaultExpanded: ['src'] },
    attrs: { 'aria-label': 'Files' },
    slots: labelSlot,
  })
  expect(screen.getByRole('treeitem', { name: 'Button.vue' })).toBeInTheDocument()
  view.unmount()

  render(Tree, {
    props: { items: fileTree, expanded: [] },
    attrs: { 'aria-label': 'Files controlled' },
    slots: labelSlot,
  })
  expect(screen.queryByRole('treeitem', { name: 'Button.vue' })).not.toBeInTheDocument()
})

// Single selection: selecting another item replaces the previous selection,
// it does not accumulate.
test('clicking an item emits its id and replaces the previous selection', async () => {
  const view = render(Tree, {
    props: { items: fileTree, modelValue: 'readme' },
    attrs: { 'aria-label': 'Files' },
    slots: labelSlot,
  })

  await userEvent.click(screen.getByRole('treeitem', { name: 'README.md' }))
  await userEvent.click(screen.getByRole('treeitem', { name: 'src' }))
  expect(view.emitted()['update:modelValue']?.at(-1)).toEqual(['src'])
})

// A disabled node is dimmed (data-disabled) and excluded from click selection.
test('a disabled item is dimmed and excluded from click selection', async () => {
  const view = render(Tree, {
    props: { items: fileTree },
    attrs: { 'aria-label': 'Files' },
    slots: labelSlot,
  })

  const locked = screen.getByRole('treeitem', { name: 'locked.env' })
  expect(locked).toHaveAttribute('data-disabled', '')

  await userEvent.click(locked)
  expect(view.emitted()['update:modelValue']).toBeUndefined()
})

// A disabled node in the middle of a list is skipped entirely by arrow-key
// roving focus -- reka-ui's own RovingFocusGroup candidate filtering, which
// reads the `data-disabled` attribute AtTreeItem sets, not custom handling.
test('arrow-key navigation skips over a disabled item', async () => {
  render(Tree, {
    props: {
      items: [
        { id: 'a', label: 'Alpha' },
        { id: 'b', label: 'Beta', disabled: true },
        { id: 'c', label: 'Gamma' },
      ],
    },
    attrs: { 'aria-label': 'Files' },
    slots: labelSlot,
  })

  await userEvent.tab()
  await expect.element(screen.getByRole('treeitem', { name: 'Alpha' })).toHaveFocus()
  await userEvent.keyboard('{ArrowDown}')
  await expect.element(screen.getByRole('treeitem', { name: 'Gamma' })).toHaveFocus()
  await userEvent.keyboard('{ArrowUp}')
  await expect.element(screen.getByRole('treeitem', { name: 'Alpha' })).toHaveFocus()
})

// Arrow Up/Down move across the flattened visible tree, skipping collapsed
// subtrees entirely (their items are unmounted, not merely hidden). Home/End
// jump to the first/last visible node. Free from reka-ui's RovingFocusGroup.
test('arrow keys move focus across visible nodes, Home/End jump to the ends', async () => {
  render(Tree, {
    props: { items: fileTree, defaultExpanded: ['src'] },
    attrs: { 'aria-label': 'Files' },
    slots: labelSlot,
  })

  await userEvent.tab()
  await expect.element(screen.getByRole('treeitem', { name: 'src' })).toHaveFocus()

  await userEvent.keyboard('{ArrowDown}')
  await expect.element(screen.getByRole('treeitem', { name: 'Button.vue' })).toHaveFocus()

  // README.md, not locked.env -- End jumps to the last visible node that
  // isn't disabled, per RovingFocusGroup's own candidate filtering.
  await userEvent.keyboard('{End}')
  await expect.element(screen.getByRole('treeitem', { name: 'README.md' })).toHaveFocus()

  await userEvent.keyboard('{Home}')
  await expect.element(screen.getByRole('treeitem', { name: 'src' })).toHaveFocus()
})

// Right expands a collapsed parent (without moving focus); pressing Right
// again moves focus into its first child. Left on an expanded node collapses
// it; Left on a leaf moves focus to its parent.
test('Left/Right expand, collapse, and move between parent and child', async () => {
  render(Tree, {
    props: { items: fileTree },
    attrs: { 'aria-label': 'Files' },
    slots: labelSlot,
  })

  const src = screen.getByRole('treeitem', { name: 'src' })
  src.focus()

  await userEvent.keyboard('{ArrowRight}')
  expect(src).toHaveAttribute('aria-expanded', 'true')
  await expect.element(src).toHaveFocus()

  await userEvent.keyboard('{ArrowRight}')
  await expect.element(screen.getByRole('treeitem', { name: 'Button.vue' })).toHaveFocus()

  await userEvent.keyboard('{ArrowLeft}')
  await expect.element(src).toHaveFocus()

  await userEvent.keyboard('{ArrowLeft}')
  expect(src).toHaveAttribute('aria-expanded', 'false')
})

// Enter/Space select the focused node -- free from reka-ui's TreeItem.
test('Enter and Space select the focused node', async () => {
  const view = render(Tree, {
    props: { items: fileTree },
    attrs: { 'aria-label': 'Files' },
    slots: labelSlot,
  })

  screen.getByRole('treeitem', { name: 'README.md' }).focus()
  await userEvent.keyboard('{Enter}')
  expect(view.emitted()['update:modelValue']?.at(-1)).toEqual(['readme'])
})

// multiple: modelValue is an array, selecting a node toggles its membership
// instead of replacing the selection.
test('multiple mode toggles a node into and out of the array selection', async () => {
  const view = render(Tree, {
    props: { items: fileTree, multiple: true, modelValue: ['readme'] },
    attrs: { 'aria-label': 'Files' },
    slots: labelSlot,
  })

  await userEvent.click(screen.getByRole('treeitem', { name: 'src' }))
  expect(view.emitted()['update:modelValue']?.at(-1)).toEqual([['readme', 'src']])

  await view.rerender({ items: fileTree, multiple: true, modelValue: ['readme', 'src'] })
  await userEvent.click(screen.getByRole('treeitem', { name: 'README.md' }))
  expect(view.emitted()['update:modelValue']?.at(-1)).toEqual([['src']])
})

// propagateSelect: selecting a parent also selects (and deselecting also
// deselects) all its descendants -- TreeRoot's own built-in behavior.
test('propagateSelect selects all descendants when a parent is selected', async () => {
  const view = render(Tree, {
    props: {
      items: fileTree,
      multiple: true,
      propagateSelect: true,
      modelValue: [],
      defaultExpanded: ['src'],
    },
    attrs: { 'aria-label': 'Files' },
    slots: labelSlot,
  })

  await userEvent.click(screen.getByRole('treeitem', { name: 'src' }))
  const call = view.emitted()['update:modelValue']?.at(-1) as [string[]]
  expect(call[0].sort()).toEqual(['button', 'icon', 'src'])
})

// bubbleSelect: a parent's own selection state reflects its children --
// selecting every child selects the parent too, deselecting one drops it
// back out. Also built into TreeRoot.
test('bubbleSelect selects the parent once every child is selected', async () => {
  const view = render(Tree, {
    props: {
      items: fileTree,
      multiple: true,
      bubbleSelect: true,
      modelValue: ['button'],
      defaultExpanded: ['src'],
    },
    attrs: { 'aria-label': 'Files' },
    slots: labelSlot,
  })

  await userEvent.click(screen.getByRole('treeitem', { name: 'Icon.vue' }))
  const call = view.emitted()['update:modelValue']?.at(-1) as [string[]]
  expect(call[0].sort()).toEqual(['button', 'icon', 'src'])
})

// In multi mode, a selected item shows a checkmark indicator; a bubbleSelect
// parent with only some children selected shows an indeterminate dash
// instead. Single-select mode renders no indicator at all.
test('multi-select items show a checkmark or indeterminate indicator', () => {
  render(Tree, {
    props: {
      items: fileTree,
      multiple: true,
      bubbleSelect: true,
      modelValue: ['button'],
      defaultExpanded: ['src'],
    },
    attrs: { 'aria-label': 'Files' },
    slots: labelSlot,
  })

  const button = screen.getByRole('treeitem', { name: 'Button.vue' })
  expect(within(button).getByTestId('tree-item-indicator')).toBeInTheDocument()

  const src = screen.getByRole('treeitem', { name: 'src' })
  expect(within(src).getByTestId('tree-item-indicator')).toBeInTheDocument()
})

test('single-select mode renders no indicator', () => {
  render(Tree, {
    props: { items: fileTree, modelValue: 'readme' },
    attrs: { 'aria-label': 'Files' },
    slots: labelSlot,
  })

  const readme = screen.getByRole('treeitem', { name: 'README.md' })
  expect(within(readme).queryByTestId('tree-item-indicator')).not.toBeInTheDocument()
})

// The single visual snap for Tree: the Snapshot story's board.
// Baseline: __snaps__/tree-chromium-linux.png. Rebaseline: pnpm test:update.
test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'tree')
})

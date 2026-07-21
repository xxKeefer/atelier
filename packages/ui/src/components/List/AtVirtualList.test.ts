import { composeStories } from '@storybook/vue3-vite'
import { render, screen } from '@testing-library/vue'
import { expect, test } from 'vitest'
import { defineComponent } from 'vue'
import VirtualList from './AtVirtualList.vue'
import * as stories from './AtVirtualList.stories'
import { snapBoard } from '../../test/snap'

const { Snapshot } = composeStories(stories)

const items = Array.from({ length: 1000 }, (_, i) => `Item ${String(i)}`)

const FixedHeightList = defineComponent({
  components: { VirtualList },
  props: { items: { type: Array, default: () => items } },
  template: `
    <div style="height: 300px">
      <VirtualList :items="items" #default="{ item }">{{ item }}</VirtualList>
    </div>
  `,
})

// Only a windowed subset of a long list is ever mounted in the DOM -- proves
// virtualization is active rather than rendering all 1000 items up front.
test('renders fewer listitem nodes than the total item count for a long list', async () => {
  render(FixedHeightList)
  const rendered = await screen.findAllByRole('listitem')
  expect(rendered.length).toBeGreaterThan(0)
  expect(rendered.length).toBeLessThan(items.length)
})

// Even though only a window of items is mounted, each rendered listitem
// carries its true position and the true total, so AT announces "item N of
// 1000" correctly rather than "item N of <rendered count>".
test('rendered listitems carry the true total count and their true index', async () => {
  render(FixedHeightList)
  const rendered = await screen.findAllByRole('listitem')
  for (const node of rendered) {
    expect(node.getAttribute('aria-setsize')).toBe(String(items.length))
    const posinset = Number(node.getAttribute('aria-posinset'))
    expect(posinset).toBeGreaterThanOrEqual(1)
    expect(posinset).toBeLessThanOrEqual(items.length)
    expect(node.textContent).toBe(`Item ${String(posinset - 1)}`)
  }
})

// The scoped slot receives the raw item and index, so consumers can render
// arbitrary content per item (mirrors AtList's content-composition AC).
test('passes arbitrary slot content per item via the scoped item/index slot', async () => {
  const Glyph = defineComponent({ template: `<span data-testid="glyph" />` })
  const CustomItemList = defineComponent({
    components: { VirtualList, Glyph },
    template: `
      <div style="height: 300px">
        <VirtualList :items="['Apple', 'Banana']" #default="{ item, index }">
          <Glyph /> {{ index }}: {{ item }}
        </VirtualList>
      </div>
    `,
  })
  render(CustomItemList)
  expect(await screen.findAllByTestId('glyph')).toHaveLength(2)
  expect(screen.getByText('0: Apple', { exact: false })).toBeInTheDocument()
  expect(screen.getByText('1: Banana', { exact: false })).toBeInTheDocument()
})

// The single visual snap for VirtualList: the Snapshot story's board.
// Baseline: __snaps__/virtual-list-chromium-linux.png. Rebaseline: pnpm test:update.
test('Snapshot matches the visual board baseline', async () => {
  render(Snapshot)
  await snapBoard('snap-board', 'virtual-list')
})

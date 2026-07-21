import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { defineComponent } from 'vue'
import VirtualList from './AtVirtualList.vue'

const items = Array.from({ length: 1000 }, (_, i) => `Row ${String(i + 1)}`)

const meta = {
  title: 'Components/VirtualList',
  component: VirtualList,
  // Fail the Vitest run on any axe violation, not just warn.
  parameters: { a11y: { test: 'error' } },
  args: { items, estimateSize: 40, overscan: 5 },
} satisfies Meta<typeof VirtualList>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => ({
    components: { VirtualList },
    setup: () => ({ args }),
    template: `
      <div style="height: 320px">
        <VirtualList v-bind="args" #default="{ item }">{{ item }}</VirtualList>
      </div>
    `,
  }),
}

const SnapshotView = defineComponent({
  components: { VirtualList },
  setup: () => ({ items }),
  template: `
    <div class="flex w-max flex-col gap-3 bg-bg-default p-6" data-testid="snap-board">
      <h2 class="font-heading font-bold text-fg-default text-lg">1000 rows, windowed</h2>
      <div style="height: 320px; width: 320px">
        <VirtualList :items="items" #default="{ item }">{{ item }}</VirtualList>
      </div>
    </div>
  `,
})

export const Snapshot: Story = {
  render: () => ({ components: { SnapshotView }, template: `<SnapshotView />` }),
}

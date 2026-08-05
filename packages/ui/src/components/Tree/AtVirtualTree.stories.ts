import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PhFile, PhFolder } from '@phosphor-icons/vue'
import { defineComponent } from 'vue'
import Icon from '../Icon/AtIcon.vue'
import VirtualTree from './AtVirtualTree.vue'
import type { TreeItemData } from './AtTree.vue'

// 20 folders x 50 files -- big enough that only a window of rows is ever
// mounted, proving virtualization is active rather than rendering everything.
const bigTree: TreeItemData[] = Array.from({ length: 20 }, (_, folderIndex) => ({
  id: `folder-${String(folderIndex)}`,
  label: `Folder ${String(folderIndex)}`,
  children: Array.from({ length: 50 }, (_, fileIndex) => ({
    id: `folder-${String(folderIndex)}-file-${String(fileIndex)}`,
    label: `File ${String(fileIndex)}.ts`,
  })),
}))

const meta = {
  title: 'Data Display/VirtualTree',
  component: VirtualTree,
  // Fail the Vitest run on any axe violation, not just warn.
  parameters: { a11y: { test: 'error' } },
  args: { items: bigTree },
} satisfies Meta<typeof VirtualTree>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => ({
    components: { VirtualTree, Icon },
    setup: () => ({ args, PhFile, PhFolder }),
    template: `
      <div style="height: 320px">
        <VirtualTree v-bind="args" :default-expanded="['folder-0']">
          <template #default="{ item, hasChildren }">
            <Icon :icon="hasChildren ? PhFolder : PhFile" size="sm" />
            {{ item.label }}
          </template>
        </VirtualTree>
      </div>
    `,
  }),
}

// Multiple selection with propagateSelect + bubbleSelect, same as AtTree's
// MultiSelect story, confirming virtualization doesn't regress either.
export const MultiSelect: Story = {
  render: (args) => ({
    components: { VirtualTree, Icon },
    setup: () => ({ args, PhFile, PhFolder }),
    template: `
      <div style="height: 320px">
        <VirtualTree
          v-bind="args"
          multiple
          propagate-select
          bubble-select
          :default-expanded="['folder-0']"
          :model-value="['folder-0-file-0']"
        >
          <template #default="{ item, hasChildren }">
            <Icon :icon="hasChildren ? PhFolder : PhFile" size="sm" />
            {{ item.label }}
          </template>
        </VirtualTree>
      </div>
    `,
  }),
}

const SnapshotView = defineComponent({
  components: { VirtualTree, Icon },
  setup: () => ({ bigTree, PhFile, PhFolder }),
  template: `
    <div class="flex w-max flex-col gap-3 bg-bg-default p-6" data-testid="snap-board">
      <h2 class="font-heading text-lg font-bold text-fg-default">1000 rows, windowed</h2>
      <div style="height: 320px; width: 320px">
        <VirtualTree :items="bigTree" :default-expanded="['folder-0']">
          <template #default="{ item, hasChildren }">
            <Icon :icon="hasChildren ? PhFolder : PhFile" size="sm" />
            {{ item.label }}
          </template>
        </VirtualTree>
      </div>
    </div>
  `,
})

export const Snapshot: Story = {
  render: () => ({ components: { SnapshotView }, template: `<SnapshotView />` }),
}

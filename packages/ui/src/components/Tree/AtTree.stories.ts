import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PhFile, PhFolder } from '@phosphor-icons/vue'
import { defineComponent } from 'vue'
import Icon from '../Icon/AtIcon.vue'
import Tree from './AtTree.vue'
import type { TreeItemData } from './AtTree.vue'

const fileTree: TreeItemData[] = [
  {
    id: 'src',
    label: 'src',
    children: [
      {
        id: 'components',
        label: 'components',
        children: [
          { id: 'button', label: 'Button.vue' },
          { id: 'icon', label: 'Icon.vue' },
        ],
      },
      { id: 'index', label: 'index.ts' },
    ],
  },
  {
    id: 'docs',
    label: 'docs',
    children: [{ id: 'readme', label: 'README.md' }],
  },
  { id: 'package', label: 'package.json' },
  { id: 'locked', label: 'locked.env', disabled: true },
]

const meta = {
  title: 'Components/Tree',
  component: Tree,
  // Fail the Vitest run on any axe violation, not just warn.
  parameters: { a11y: { test: 'error' } },
  args: { items: fileTree },
} satisfies Meta<typeof Tree>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => ({
    components: { Tree, Icon },
    setup: () => ({ args, PhFile, PhFolder }),
    template: `
      <Tree v-bind="args" :default-expanded="['src']">
        <template #default="{ item, hasChildren }">
          <Icon :icon="hasChildren ? PhFolder : PhFile" size="sm" />
          {{ item.label }}
        </template>
      </Tree>
    `,
  }),
}

// A disabled node (`locked.env`) is dimmed, excluded from selection, and
// skipped by keyboard navigation while its siblings stay reachable.
export const DisabledItem: Story = {
  render: (args) => ({
    components: { Tree, Icon },
    setup: () => ({ args, PhFile, PhFolder }),
    template: `
      <Tree v-bind="args">
        <template #default="{ item, hasChildren }">
          <Icon :icon="hasChildren ? PhFolder : PhFile" size="sm" />
          {{ item.label }}
        </template>
      </Tree>
    `,
  }),
}

// The visual board: a collapsed tree, one with nested nodes expanded and a
// selection, and a disabled-item row -- one screen, one screenshot.
const SnapshotView = defineComponent({
  components: { Tree, Icon },
  setup: () => ({ fileTree, PhFile, PhFolder }),
  template: `
    <div class="flex w-max flex-col gap-8 bg-bg-default p-6" data-testid="snap-board">
      <section class="flex w-72 flex-col gap-3">
        <h2 class="font-heading text-lg font-bold text-fg-default">Collapsed</h2>
        <Tree :items="fileTree">
          <template #default="{ item, hasChildren }">
            <Icon :icon="hasChildren ? PhFolder : PhFile" size="sm" />
            {{ item.label }}
          </template>
        </Tree>
      </section>

      <section class="flex w-72 flex-col gap-3">
        <h2 class="font-heading text-lg font-bold text-fg-default">Expanded, with a selection</h2>
        <Tree :items="fileTree" :default-expanded="['src', 'components']" model-value="button">
          <template #default="{ item, hasChildren }">
            <Icon :icon="hasChildren ? PhFolder : PhFile" size="sm" />
            {{ item.label }}
          </template>
        </Tree>
      </section>
    </div>
  `,
})

export const Snapshot: Story = {
  render: () => ({ components: { SnapshotView }, template: `<SnapshotView />` }),
}

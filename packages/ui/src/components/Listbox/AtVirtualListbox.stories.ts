import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { defineComponent } from 'vue'
import VirtualListbox from './AtVirtualListbox.vue'

const options = Array.from({ length: 1000 }, (_, i) => `Option ${String(i + 1)}`)

const meta = {
  title: 'Forms/VirtualListbox',
  component: VirtualListbox,
  // Fail the Vitest run on any axe violation, not just warn.
  parameters: { a11y: { test: 'error' } },
  args: { options, estimateSize: 40, overscan: 5 },
} satisfies Meta<typeof VirtualListbox>

export default meta
type Story = StoryObj<typeof meta>

// A large option set, windowed -- only a subset of rows is ever mounted in
// the DOM. Sizing is the caller's concern: a fixed-height wrapper becomes
// the scroll container, same precedent as AtVirtualList.
export const Playground: Story = {
  render: (args) => ({
    components: { VirtualListbox },
    setup: () => ({ args }),
    template: `
      <div style="height: 320px">
        <VirtualListbox v-bind="args" aria-label="Options" #option="{ option }">{{ option }}</VirtualListbox>
      </div>
    `,
  }),
}

// Multi-select behaves identically to AtListbox's own multi mode: modelValue
// is an array, selecting toggles membership, selected rows show a checkmark.
export const Multiple: Story = {
  render: (args) => ({
    components: { VirtualListbox },
    setup: () => ({ args }),
    template: `
      <div style="height: 320px">
        <VirtualListbox v-bind="args" multiple :model-value="['Option 2', 'Option 3']" aria-label="Options" #option="{ option }">{{ option }}</VirtualListbox>
      </div>
    `,
  }),
}

// Zero options: the same static empty-state row AtListbox uses in place of
// the list.
export const Empty: Story = {
  render: () => ({
    components: { VirtualListbox },
    template: `
      <div style="height: 320px">
        <VirtualListbox :options="[]" aria-label="Options" #option="{ option }">{{ option }}</VirtualListbox>
      </div>
    `,
  }),
}

const SnapshotView = defineComponent({
  components: { VirtualListbox },
  setup: () => ({ options }),
  template: `
    <div class="flex w-max flex-col gap-3 bg-bg-default p-6" data-testid="snap-board">
      <h2 class="font-heading font-bold text-fg-default text-lg">1000 options, windowed</h2>
      <div class="flex flex-wrap items-start gap-6">
        <div style="height: 320px; width: 240px">
          <VirtualListbox :options="options" model-value="Option 3" aria-label="Options" #option="{ option }">{{ option }}</VirtualListbox>
        </div>
        <div style="height: 320px; width: 240px">
          <VirtualListbox
            :options="options"
            multiple
            :model-value="['Option 2', 'Option 4']"
            aria-label="Options (multi)"
            #option="{ option }"
          >{{ option }}</VirtualListbox>
        </div>
      </div>
    </div>
  `,
})

export const Snapshot: Story = {
  render: () => ({ components: { SnapshotView }, template: `<SnapshotView />` }),
}

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { defineComponent } from 'vue'
import ScrollArea from './AtScrollArea.vue'

const orientations = ['vertical', 'horizontal', 'both'] as const
const types = ['auto', 'always', 'scroll', 'hover'] as const

const meta = {
  title: 'Data Display/ScrollArea',
  component: ScrollArea,
  // Fail the Vitest run on any axe violation, not just warn.
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    orientation: { control: 'select', options: orientations },
    type: { control: 'select', options: types },
  },
  args: { orientation: 'vertical', type: 'always' },
} satisfies Meta<typeof ScrollArea>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => ({
    components: { ScrollArea },
    setup: () => ({ args }),
    template: `
      <ScrollArea v-bind="args" class="h-48 w-64 rounded-md border-[3px] border-solid border-[color:var(--color-border-default)]">
        <div class="flex flex-col gap-2 p-4 font-body text-fg-default">
          <p v-for="n in 20" :key="n">Line {{ n }} of scrollable content.</p>
        </div>
      </ScrollArea>
    `,
  }),
}

export const Horizontal: Story = {
  args: { orientation: 'horizontal' },
  render: (args) => ({
    components: { ScrollArea },
    setup: () => ({ args }),
    template: `
      <ScrollArea v-bind="args" class="h-24 w-64 rounded-md border-[3px] border-solid border-[color:var(--color-border-default)]">
        <div class="flex w-max gap-2 p-4 font-body text-fg-default">
          <span v-for="n in 20" :key="n" class="w-24 shrink-0">Card {{ n }}</span>
        </div>
      </ScrollArea>
    `,
  }),
}

export const Both: Story = {
  args: { orientation: 'both' },
  render: (args) => ({
    components: { ScrollArea },
    setup: () => ({ args }),
    template: `
      <ScrollArea v-bind="args" class="h-48 w-64 rounded-md border-[3px] border-solid border-[color:var(--color-border-default)]">
        <div class="flex w-[600px] flex-col gap-2 p-4 font-body text-fg-default">
          <p v-for="n in 20" :key="n">Line {{ n }} of wide, tall scrollable content.</p>
        </div>
      </ScrollArea>
    `,
  }),
}

// type defaults to "always", so thumbs are visible without hover/scroll
// interaction -- the snap board's screenshot catches them without simulating
// user input.
const SnapshotView = defineComponent({
  components: { ScrollArea },
  template: `
    <div class="flex w-max flex-col gap-8 bg-bg-default p-6" data-testid="snap-board">
      <section class="flex w-64 flex-col gap-3">
        <h2 class="font-heading text-lg font-bold text-fg-default">Vertical</h2>
        <ScrollArea orientation="vertical" class="h-32 w-64 rounded-md border-[3px] border-solid border-[color:var(--color-border-default)]">
          <div class="flex flex-col gap-2 p-4 font-body text-fg-default">
            <p v-for="n in 20" :key="n">Line {{ n }}</p>
          </div>
        </ScrollArea>
      </section>

      <section class="flex w-64 flex-col gap-3">
        <h2 class="font-heading text-lg font-bold text-fg-default">Horizontal</h2>
        <ScrollArea orientation="horizontal" class="h-20 w-64 rounded-md border-[3px] border-solid border-[color:var(--color-border-default)]">
          <div class="flex w-max gap-2 p-4 font-body text-fg-default">
            <span v-for="n in 20" :key="n" class="w-24 shrink-0">Card {{ n }}</span>
          </div>
        </ScrollArea>
      </section>

      <section class="flex w-64 flex-col gap-3">
        <h2 class="font-heading text-lg font-bold text-fg-default">Both</h2>
        <ScrollArea orientation="both" class="h-32 w-64 rounded-md border-[3px] border-solid border-[color:var(--color-border-default)]">
          <div class="flex w-[400px] flex-col gap-2 p-4 font-body text-fg-default">
            <p v-for="n in 20" :key="n">Line {{ n }}</p>
          </div>
        </ScrollArea>
      </section>
    </div>
  `,
})

export const Snapshot: Story = {
  render: () => ({ components: { SnapshotView }, template: `<SnapshotView />` }),
}

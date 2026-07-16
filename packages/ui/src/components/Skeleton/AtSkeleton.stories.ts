import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Skeleton from './AtSkeleton.vue'

const shapes = ['rect', 'circle', 'text'] as const

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  // Fail the Vitest run on any axe violation, not just warn.
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    shape: { control: 'select', options: shapes },
    width: { control: 'text' },
    height: { control: 'text' },
  },
  args: { shape: 'rect', width: '12rem', height: '2rem' },
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => ({
    components: { Skeleton },
    setup: () => ({ args }),
    template: `<Skeleton v-bind="args" />`,
  }),
}

// The board every shape is matched against real component/text footprints so
// the layout doesn't shift once real content lands.
export const Snapshot: Story = {
  render: () => ({
    components: { Skeleton },
    template: `
      <div class="flex w-max flex-col gap-8 bg-bg-default p-6 text-fg-default" data-testid="snap-board">
        <section class="flex flex-col gap-2">
          <h2 class="font-heading font-bold text-lg">Text lines</h2>
          <div class="flex w-64 flex-col gap-2">
            <Skeleton shape="text" width="100%" height="0.875rem" />
            <Skeleton shape="text" width="100%" height="0.875rem" />
            <Skeleton shape="text" width="60%" height="0.875rem" />
          </div>
        </section>
        <section class="flex flex-col gap-2">
          <h2 class="font-heading font-bold text-lg">Avatar (circle)</h2>
          <Skeleton shape="circle" width="3rem" height="3rem" />
        </section>
        <section class="flex flex-col gap-2">
          <h2 class="font-heading font-bold text-lg">Card (rect)</h2>
          <Skeleton shape="rect" width="16rem" height="8rem" />
        </section>
      </div>
    `,
  }),
}

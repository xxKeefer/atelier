import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Skeleton from './AtSkeleton.vue'
import { CompositionView } from './views/CompositionView'

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

// Skeletons don't have to 1:1 map every element of the eventual UI -- a few
// simple shapes stacked together approximate a real layout closely enough.
export const Composition: Story = {
  render: () => ({
    components: { CompositionView },
    template: `<CompositionView />`,
  }),
}

// The board every shape is matched against real component/text footprints so
// the layout doesn't shift once real content lands.
export const Snapshot: Story = {
  render: () => ({
    components: { CompositionView },
    template: `
      <div class="flex w-max flex-col gap-8 bg-bg-default p-6 text-fg-default" data-testid="snap-board">
        <CompositionView />
      </div>
    `,
  }),
}

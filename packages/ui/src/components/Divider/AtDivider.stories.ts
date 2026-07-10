import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Divider from './AtDivider.vue'
import { HorizontalView } from './views/HorizontalView'
import { VerticalView } from './views/VerticalView'
import { ColorsView } from './views/ColorsView'

const orientations = ['horizontal', 'vertical'] as const

const meta = {
  title: 'Components/Divider',
  component: Divider,
  // Fail the Vitest run on any axe violation, not just warn.
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    orientation: { control: 'select', options: orientations },
    decorative: { control: 'boolean' },
  },
  args: { orientation: 'horizontal', decorative: false },
} satisfies Meta<typeof Divider>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => ({
    components: { Divider },
    setup: () => ({ args }),
    template: `
      <div class="flex w-64 flex-col gap-4 text-fg-default">
        <span class="font-body text-base">Above</span>
        <Divider v-bind="args" />
        <span class="font-body text-base">Below</span>
      </div>
    `,
  }),
}

export const Horizontal: Story = {
  render: () => ({ components: { HorizontalView }, template: `<HorizontalView />` }),
}

export const Vertical: Story = {
  render: () => ({ components: { VerticalView }, template: `<VerticalView />` }),
}

export const Colors: Story = {
  render: () => ({ components: { ColorsView }, template: `<ColorsView />` }),
}

// Decorative: pure visual garnish, hidden from assistive tech (role=none).
export const Decorative: Story = {
  render: () => ({
    components: { Divider },
    template: `
      <div class="flex w-64 flex-col gap-4 text-fg-default">
        <span class="font-body text-base">Garnish, not structure</span>
        <Divider decorative />
      </div>
    `,
  }),
}

// The visual board: horizontal and vertical dividers in context on one screen.
// This is the story the snapshot test snaps.
export const Snapshot: Story = {
  render: () => ({
    components: { HorizontalView, VerticalView, ColorsView },
    template: `
      <div class="flex w-max flex-col gap-8 bg-bg-default p-6 text-fg-default" data-testid="snap-board">
        <section class="flex flex-col gap-2">
          <h2 class="font-heading font-bold text-lg">Horizontal</h2>
          <HorizontalView />
        </section>
        <section class="flex flex-col gap-2">
          <h2 class="font-heading font-bold text-lg">Vertical</h2>
          <VerticalView />
        </section>
        <section class="flex flex-col gap-3">
          <h2 class="font-heading font-bold text-lg">Colours</h2>
          <ColorsView />
        </section>
      </div>
    `,
  }),
}

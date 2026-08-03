import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PhCheckSquare } from '@phosphor-icons/vue'
import Badge from './AtBadge.vue'
import { VariantsView } from './views/VariantsView'
import { SizesView } from './views/SizesView'
import { IconView } from './views/IconView'
import { intents, variants, sizes } from './views/shared'

const meta = {
  title: 'Components/Badge',
  component: Badge,
  // Fail the Vitest run on any axe violation, not just warn.
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    intent: { control: 'select', options: intents },
    variant: { control: 'select', options: variants },
    size: { control: 'select', options: sizes },
  },
  args: { intent: 'neutral', variant: 'solid', size: 'md' },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => ({
    components: { Badge },
    setup: () => ({ args }),
    template: `<Badge v-bind="args">Badge</Badge>`,
  }),
}

export const Variants: Story = {
  render: () => ({ components: { VariantsView }, template: `<VariantsView />` }),
}

export const Sizes: Story = {
  render: () => ({ components: { SizesView }, template: `<SizesView />` }),
}

export const WithIcon: Story = {
  render: (args) => ({
    components: { Badge },
    setup: () => ({ args, icon: PhCheckSquare }),
    template: `<Badge v-bind="args" :icon="icon">Badge</Badge>`,
  }),
}

// The visual board: every intent x variant, the size ladder, and the icon
// ladder, on one screen.
export const Snapshot: Story = {
  render: () => ({
    components: { VariantsView, SizesView, IconView },
    template: `
      <div class="flex w-max flex-col gap-6 bg-bg-default p-6" data-testid="snap-board">
        <VariantsView />
        <SizesView />
        <IconView />
      </div>
    `,
  }),
}

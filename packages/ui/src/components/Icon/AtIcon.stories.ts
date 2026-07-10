import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PhHeart } from '@phosphor-icons/vue'
import Icon from './AtIcon.vue'
import { SizesView, sizes } from './views/SizesView'
import { WeightsView, weights } from './views/WeightsView'
import { ColorsView } from './views/ColorsView'
import { SemanticView } from './views/SemanticView'

const meta = {
  title: 'Components/Icon',
  component: Icon,
  // Fail the Vitest run on any axe violation, not just warn.
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    size: { control: 'select', options: sizes },
    weight: { control: 'select', options: weights },
    color: { control: 'text' },
    label: { control: 'text' },
  },
  args: { icon: PhHeart, size: 'md', weight: 'regular' },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => ({
    components: { Icon },
    setup: () => ({ args }),
    template: '<Icon v-bind="args" />',
  }),
}

export const Sizes: Story = {
  render: () => ({ components: { SizesView }, template: `<SizesView />` }),
}

export const Weights: Story = {
  render: () => ({ components: { WeightsView }, template: `<WeightsView />` }),
}

export const Colors: Story = {
  render: () => ({ components: { ColorsView }, template: `<ColorsView />` }),
}

// Decorative by default: hidden from the a11y tree, no accessible name.
export const Decorative: Story = {
  render: (args) => ({
    components: { Icon },
    setup: () => ({ args }),
    template: `
      <div class="flex items-center gap-2 text-fg-default">
        <Icon v-bind="args" />
        <span class="font-body text-base">no label: hidden from screen readers (aria-hidden)</span>
      </div>
    `,
  }),
}

// A label promotes the icon to a meaningful img with that accessible name.
export const Labeled: Story = {
  args: { label: 'Favourite', icon: PhHeart },
  render: (args) => ({
    components: { Icon },
    setup: () => ({ args }),
    template: `
      <div class="flex items-center gap-2 text-fg-default">
        <Icon v-bind="args" />
        <span class="font-body text-base">with a label: announced as an img named "{{ args.label }}"</span>
      </div>
    `,
  }),
}

export const Semantic: Story = {
  render: () => ({
    components: { SemanticView },
    template: `<div class="bg-bg-default p-6"><SemanticView /></div>`,
  }),
}

// The visual board: sizes, weights, colour, and the semantic convention on one
// screen in a labelled grid. This is the story the snapshot test snaps.
export const Snapshot: Story = {
  render: () => ({
    components: { SizesView, WeightsView, ColorsView, SemanticView },
    template: `
      <div class="flex w-max flex-col gap-8 bg-bg-default p-6 text-fg-default" data-testid="snap-board">
        <section class="flex flex-col gap-2">
          <h2 class="font-heading font-bold text-lg">Sizes</h2>
          <SizesView />
        </section>
        <section class="flex flex-col gap-2">
          <h2 class="font-heading font-bold text-lg">Weights</h2>
          <WeightsView />
        </section>
        <section class="flex flex-col gap-2">
          <h2 class="font-heading font-bold text-lg">Colours</h2>
          <ColorsView />
        </section>
        <SemanticView />
      </div>
    `,
  }),
}

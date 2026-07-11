import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PhHeart, PhInfo, PhQuestion, PhWarning } from '@phosphor-icons/vue'
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

// Detailed guidance for picking a tooltip-trigger icon in AtTooltipIcon. The
// "warning" variant ships PhWarning, standing in for the classic "!" trigger.
const tooltipTriggers = [
  {
    icon: PhQuestion,
    name: 'Question',
    guidance:
      'Use when the user is about to take an action that might trigger a "...but why?" or ' +
      '"...what does this mean?" People do not like not knowing -- it makes them feel a bit ' +
      'daft. A question-mark trigger says "you are not alone, lots of folks ask about this," ' +
      'which disarms the user and makes them more likely to hover for the answer.',
  },
  {
    icon: PhInfo,
    name: 'Info',
    guidance:
      'Best for an extra bit of insight that is not critical but still good to know. ' +
      'Experienced users sail past it; new users get the context they need to remove ' +
      'friction. The info icon has a strong identity as "the place to go when you want to ' +
      'know something," and its positive association with knowledge means it can be used ' +
      'fairly liberally.',
  },
  {
    icon: PhWarning,
    name: 'Warning',
    guidance:
      'Use when there is something about a field or action the user should know before ' +
      'moving forward, but that most are probably already aware of -- so spelling it out in ' +
      'the UI would add unwanted cognitive load, yet it should not be missed either. A ' +
      'warning trigger sets the right tone of importance, and works best when used sparingly ' +
      'relative to the other two triggers.',
  },
] as const

export const TooltipTriggers: Story = {
  render: () => ({
    components: { Icon },
    setup: () => ({ tooltipTriggers }),
    template: `
      <div class="flex max-w-prose flex-col gap-6 bg-bg-default p-6 text-fg-default">
        <div v-for="trigger in tooltipTriggers" :key="trigger.name" class="flex gap-3">
          <Icon :icon="trigger.icon" size="xl" :label="trigger.name" />
          <div class="flex flex-col gap-1">
            <h3 class="font-heading font-bold text-base">{{ trigger.name }}</h3>
            <p class="font-body text-fg-subtle text-sm">{{ trigger.guidance }}</p>
          </div>
        </div>
      </div>
    `,
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

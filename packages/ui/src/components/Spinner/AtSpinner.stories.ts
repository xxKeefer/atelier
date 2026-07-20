import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Spinner from './AtSpinner.vue'

const intents = ['primary', 'secondary', 'neutral', 'danger', 'success', 'warning', 'info'] as const
const sizes = ['sm', 'md', 'lg'] as const

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  // Fail the Vitest run on any axe violation, not just warn.
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    intent: { control: 'select', options: intents },
    size: { control: 'select', options: sizes },
    label: { control: 'text' },
  },
  args: { intent: 'primary', size: 'md' },
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => ({
    components: { Spinner },
    setup: () => ({ args }),
    template: `<Spinner v-bind="args" />`,
  }),
}

export const Sizes: Story = {
  render: () => ({
    components: { Spinner },
    setup: () => ({ sizes }),
    template: `
      <div class="flex items-end gap-4 text-fg-default">
        <div v-for="size in sizes" :key="size" class="flex flex-col items-center gap-1">
          <Spinner :size="size" />
          <span class="font-body text-fg-subtle text-xs">{{ size }}</span>
        </div>
      </div>
    `,
  }),
}

export const Colors: Story = {
  render: () => ({
    components: { Spinner },
    setup: () => ({ intents }),
    template: `
      <div class="flex flex-wrap gap-4">
        <div v-for="intent in intents" :key="intent" class="flex flex-col items-center gap-1">
          <Spinner :intent="intent" />
          <span class="font-body text-fg-subtle text-xs">{{ intent }}</span>
        </div>
      </div>
    `,
  }),
}

// Decorative by default: hidden from the a11y tree, no accessible name -- the
// common case, e.g. nested inside a loading Button that already announces its
// own busy state.
export const Decorative: Story = {
  render: () => ({
    components: { Spinner },
    template: `
      <div class="flex items-center gap-2 text-fg-default">
        <Spinner />
        <span class="font-body text-base">no label: hidden from screen readers (aria-hidden)</span>
      </div>
    `,
  }),
}

// A label promotes the spinner to an accessible name -- for standalone use,
// e.g. a bare spinner replacing a panel's content while it loads.
export const Labeled: Story = {
  args: { label: 'Loading results' },
  render: (args) => ({
    components: { Spinner },
    setup: () => ({ args }),
    template: `
      <div class="flex items-center gap-2 text-fg-default">
        <Spinner v-bind="args" />
        <span class="font-body text-base">with a label: announced as an img named "{{ args.label }}"</span>
      </div>
    `,
  }),
}

// The visual board: every intent x size on one screen in a labelled grid.
export const Snapshot: Story = {
  render: () => ({
    components: { Spinner },
    setup: () => ({ intents, sizes }),
    template: `
      <div class="flex w-max flex-col gap-6 bg-bg-default p-6 text-fg-default" data-testid="snap-board">
        <div v-for="intent in intents" :key="intent" class="flex items-center gap-6">
          <span class="font-body text-fg-subtle w-20 text-xs">{{ intent }}</span>
          <Spinner v-for="size in sizes" :key="size" :intent="intent" :size="size" />
        </div>
      </div>
    `,
  }),
}

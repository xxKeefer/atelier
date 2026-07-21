import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Popover from './AtPopover.vue'
import Button from '../Button/AtButton.vue'
import Input from '../Input/AtInput.vue'

const sides = ['top', 'right', 'bottom', 'left'] as const
const aligns = ['start', 'center', 'end'] as const

const meta = {
  title: 'Components/Popover',
  component: Popover,
  // Fail the Vitest run on any axe violation, not just warn.
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    side: { control: 'select', options: sides },
    align: { control: 'select', options: aligns },
    sideOffset: { control: 'number' },
    defaultOpen: { control: 'boolean' },
  },
  args: { side: 'bottom', align: 'center', sideOffset: 8, defaultOpen: false },
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

// A popover is denser than a tooltip: arbitrary markup, not a one-line hint.
export const Playground: Story = {
  render: (args) => ({
    components: { Popover, Button, Input },
    setup: () => ({ args }),
    template: `
      <div class="flex min-h-32 items-center justify-center">
        <Popover v-bind="args">
          <template #trigger><Button>Open popover</Button></template>
          <div class="flex w-64 flex-col gap-2">
            <h3 class="font-heading font-bold text-sm">Quick edit</h3>
            <Input placeholder="Name" />
          </div>
        </Popover>
      </div>
    `,
  }),
}

// One popover per side, open on load so all four render at once for visual
// comparison of the positioning/arrow direction.
export const Sides: Story = {
  render: () => ({
    components: { Popover, Button },
    setup: () => ({ sides }),
    template: `
      <div class="flex gap-8 p-12">
        <Popover v-for="side in sides" :key="side" :side="side" :default-open="true">
          <template #trigger><Button>{{ side }}</Button></template>
          {{ side }}
        </Popover>
      </div>
    `,
  }),
}

// Dismissal: Escape closes the popover and returns focus to the trigger --
// reka-ui's own Popover primitives handle this natively.
export const Dismissal: Story = {
  args: { defaultOpen: false },
  render: (args) => ({
    components: { Popover, Button },
    setup: () => ({ args }),
    template: `
      <div class="flex min-h-32 items-center justify-center">
        <Popover v-bind="args">
          <template #trigger><Button>Open, then press Escape</Button></template>
          Press Escape to dismiss.
        </Popover>
      </div>
    `,
  }),
}

// The visual board: one open popover per side, laid out in a 2x2 grid so
// each popover's content opens into its own row/column gap rather than over
// a neighbouring trigger. Mirrors AtTooltip's Snapshot layout.
const gridSides = ['right', 'bottom', 'top', 'left'] as const

export const Snapshot: Story = {
  render: () => ({
    components: { Popover, Button },
    setup: () => ({ gridSides }),
    template: `
      <div
        class="flex w-max flex-col gap-2 bg-surface-default p-16 text-fg-default"
        data-testid="snap-board"
      >
        <h2 class="font-heading font-bold text-lg">Sides</h2>
        <div class="grid grid-cols-2 gap-x-32 gap-y-24 mt-8">
          <Popover
            v-for="side in gridSides"
            :key="side"
            :side="side"
            :default-open="true"
          >
            <template #trigger><Button>{{ side }}</Button></template>
            {{ side }}
          </Popover>
        </div>
      </div>
    `,
  }),
}

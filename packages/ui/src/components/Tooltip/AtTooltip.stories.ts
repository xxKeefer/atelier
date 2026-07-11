import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Tooltip from './AtTooltip.vue'
import Button from '../Button/AtButton.vue'

const sides = ['top', 'right', 'bottom', 'left'] as const

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  // Fail the Vitest run on any axe violation, not just warn.
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    text: { control: 'text' },
    side: { control: 'select', options: sides },
    delay: { control: 'number' },
    disabled: { control: 'boolean' },
    defaultOpen: { control: 'boolean' },
  },
  args: { text: 'A helpful tip', side: 'top', delay: 700, disabled: false, defaultOpen: false },
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => ({
    components: { Tooltip, Button },
    setup: () => ({ args }),
    template: `
      <div class="flex min-h-32 items-center justify-center">
        <Tooltip v-bind="args">
          <Button>Hover or focus me</Button>
        </Tooltip>
      </div>
    `,
  }),
}

// One tooltip per side, open on load (delay 0) so all four render at once for
// visual comparison of the positioning/arrow direction.
export const Sides: Story = {
  render: () => ({
    components: { Tooltip, Button },
    setup: () => ({ sides }),
    template: `
      <div class="flex gap-8 p-12">
        <Tooltip v-for="side in sides" :key="side" :text="side" :side="side" :delay="0">
          <Button>{{ side }}</Button>
        </Tooltip>
      </div>
    `,
  }),
}

// Timeout: brief hovers don't flash the tooltip open -- only a sustained
// hover past the delay opens it.
export const DelayedOpen: Story = {
  args: { text: 'Waited 700ms for this', delay: 700 },
  render: (args) => ({
    components: { Tooltip, Button },
    setup: () => ({ args }),
    template: `
      <div class="flex min-h-32 items-center justify-center">
        <Tooltip v-bind="args">
          <Button>Hover and hold</Button>
        </Tooltip>
      </div>
    `,
  }),
}

// Keyboard support: tabbing to the trigger opens the tooltip the same as a
// sustained hover would.
export const KeyboardFocus: Story = {
  args: { text: 'Reachable via Tab', delay: 0 },
  render: (args) => ({
    components: { Tooltip, Button },
    setup: () => ({ args }),
    template: `
      <div class="flex min-h-32 items-center justify-center">
        <Tooltip v-bind="args">
          <Button>Tab to me</Button>
        </Tooltip>
      </div>
    `,
  }),
}

// The visual board: one open tooltip per side, laid out in a 2x2 grid so
// each tooltip's content opens into its own row/column gap rather than over
// a neighbouring trigger. Clockwise from top-left: right, bottom, left, top
// (top lands under right -- CSS grid auto-placement fills row-major, so this
// order is what produces that layout).
const gridSides = ['right', 'bottom', 'top', 'left'] as const

export const Snapshot: Story = {
  render: () => ({
    components: { Tooltip, Button },
    setup: () => ({ gridSides }),
    template: `
      <div
        class="flex w-max flex-col gap-2 bg-surface-default p-16 text-fg-default"
        data-testid="snap-board"
      >
        <h2 class="font-heading font-bold text-lg">Sides</h2>
        <div class="grid grid-cols-2 gap-x-32 gap-y-24 mt-8">
          <Tooltip
            v-for="side in gridSides"
            :key="side"
            :text="side"
            :side="side"
            :default-open="true"
          >
            <Button>{{ side }}</Button>
          </Tooltip>
        </div>
      </div>
    `,
  }),
}

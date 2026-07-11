import type { Meta, StoryObj } from '@storybook/vue3-vite'
import TooltipIcon from './AtTooltipIcon.vue'

const variants = ['warning', 'info', 'question'] as const
const sides = ['top', 'right', 'bottom', 'left'] as const

const meta = {
  title: 'Components/TooltipIcon',
  component: TooltipIcon,
  // Fail the Vitest run on any axe violation, not just warn.
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    variant: { control: 'select', options: variants },
    text: { control: 'text' },
    side: { control: 'select', options: sides },
    delay: { control: 'number' },
    disabled: { control: 'boolean' },
    defaultOpen: { control: 'boolean' },
  },
  args: { variant: 'info', text: 'A helpful tip', side: 'left', delay: 700, disabled: false },
} satisfies Meta<typeof TooltipIcon>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => ({
    components: { TooltipIcon },
    setup: () => ({ args }),
    template: `
      <div class="flex min-h-32 items-center justify-center">
        <TooltipIcon v-bind="args" />
      </div>
    `,
  }),
}

// One trigger per variant, open on load (delay 0) so all three render at once
// for visual comparison of the glyph each variant picks.
export const Variants: Story = {
  render: () => ({
    components: { TooltipIcon },
    setup: () => ({ variants }),
    template: `
      <div class="flex gap-8 p-12">
        <TooltipIcon
          v-for="variant in variants"
          :key="variant"
          :variant="variant"
          :text="variant"
          :delay="0"
        />
      </div>
    `,
  }),
}

// The visual board: one open tooltip per variant, laid out with room for the
// content to render without clipping. This is the story the snapshot test
// snaps.
export const Snapshot: Story = {
  render: () => ({
    components: { TooltipIcon },
    setup: () => ({ variants }),
    template: `
      <div
        class="flex w-max flex-col gap-2 bg-surface-default p-16 text-fg-default"
        data-testid="snap-board"
      >
        <h2 class="font-heading font-bold text-lg">Variants</h2>
        <div class="flex gap-32 mt-8 pl-32">
          <TooltipIcon
            v-for="variant in variants"
            :key="variant"
            :variant="variant"
            :text="variant"
            :default-open="true"
          />
        </div>
      </div>
    `,
  }),
}

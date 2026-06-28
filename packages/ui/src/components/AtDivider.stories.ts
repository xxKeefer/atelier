import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Divider from './AtDivider.vue'

const orientations = ['horizontal', 'vertical'] as const

// Any bg-* utility on the fallthrough class recolours the rule. Every palette
// family a divider reaches for, each at its subtle / default / strong step. The
// token families aren't symmetric, so each maps to the closest low/mid/high it
// actually ships: border has the literal trio; brand runs subtle -> default ->
// active; status runs bg (tint) -> border -> solid (vivid).
const ramps = [
  {
    name: 'border',
    subtle: 'bg-border-subtle',
    default: 'bg-border-default',
    strong: 'bg-border-strong',
  },
  {
    name: 'primary',
    subtle: 'bg-brand-primary-subtle',
    default: 'bg-brand-primary-default',
    strong: 'bg-brand-primary-active',
  },
  {
    name: 'secondary',
    subtle: 'bg-brand-secondary-subtle',
    default: 'bg-brand-secondary-default',
    strong: 'bg-brand-secondary-active',
  },
  {
    name: 'danger',
    subtle: 'bg-status-danger-bg',
    default: 'bg-status-danger-border',
    strong: 'bg-status-danger-solid',
  },
  {
    name: 'success',
    subtle: 'bg-status-success-bg',
    default: 'bg-status-success-border',
    strong: 'bg-status-success-solid',
  },
  {
    name: 'warning',
    subtle: 'bg-status-warning-bg',
    default: 'bg-status-warning-border',
    strong: 'bg-status-warning-solid',
  },
  {
    name: 'info',
    subtle: 'bg-status-info-bg',
    default: 'bg-status-info-border',
    strong: 'bg-status-info-solid',
  },
] as const

const steps = ['subtle', 'default', 'strong'] as const

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

// Horizontal: a full-width rule parting stacked content.
export const Horizontal: Story = {
  render: () => ({
    components: { Divider },
    template: `
      <div class="flex w-64 flex-col gap-4 text-fg-default">
        <p class="font-body text-base">First block of content.</p>
        <Divider />
        <p class="font-body text-base">Second block of content.</p>
      </div>
    `,
  }),
}

// Vertical: a self-stretching rule between inline items. The flex parent supplies
// the height the rule stretches to.
export const Vertical: Story = {
  render: () => ({
    components: { Divider },
    template: `
      <div class="flex h-8 items-center gap-4 text-fg-default">
        <span class="font-body text-base">Home</span>
        <Divider orientation="vertical" />
        <span class="font-body text-base">Docs</span>
        <Divider orientation="vertical" />
        <span class="font-body text-base">About</span>
      </div>
    `,
  }),
}

// Colour by Tailwind class: the rule defaults to the strong border, but any
// bg-* utility on the fallthrough class recolours it -- the border ramp
// (subtle/default/strong) plus the focus pink for emphasis.
export const Colors: Story = {
  render: () => ({
    components: { Divider },
    setup: () => ({ ramps, steps }),
    template: `
      <div class="flex w-72 flex-col gap-5 text-fg-default">
        <div v-for="ramp in ramps" :key="ramp.name" class="flex flex-col gap-2">
          <span class="font-body font-bold text-sm">{{ ramp.name }}</span>
          <div v-for="step in steps" :key="step" class="flex flex-col gap-1">
            <span class="font-body text-fg-subtle text-xs">{{ step }}</span>
            <Divider :class="ramp[step]" />
          </div>
        </div>
      </div>
    `,
  }),
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
    components: { Divider },
    setup: () => ({ ramps, steps }),
    template: `
      <div class="flex w-max flex-col gap-8 bg-bg-default p-6 text-fg-default" data-testid="snap-board">
        <section class="flex flex-col gap-2">
          <h2 class="font-heading font-bold text-lg">Horizontal</h2>
          <div class="flex w-64 flex-col gap-4">
            <p class="font-body text-base">First block of content.</p>
            <Divider />
            <p class="font-body text-base">Second block of content.</p>
          </div>
        </section>
        <section class="flex flex-col gap-2">
          <h2 class="font-heading font-bold text-lg">Vertical</h2>
          <div class="flex h-8 items-center gap-4">
            <span class="font-body text-base">Home</span>
            <Divider orientation="vertical" />
            <span class="font-body text-base">Docs</span>
            <Divider orientation="vertical" />
            <span class="font-body text-base">About</span>
          </div>
        </section>
        <section class="flex flex-col gap-3">
          <h2 class="font-heading font-bold text-lg">Colours</h2>
          <div class="grid grid-cols-[auto_repeat(3,16rem)] items-center gap-x-4 gap-y-2">
            <span></span>
            <span v-for="step in steps" :key="step" class="font-body text-fg-subtle text-xs">{{ step }}</span>
            <template v-for="ramp in ramps" :key="ramp.name">
              <span class="font-body font-bold text-sm">{{ ramp.name }}</span>
              <Divider v-for="step in steps" :key="step" :class="ramp[step]" />
            </template>
          </div>
        </section>
      </div>
    `,
  }),
}

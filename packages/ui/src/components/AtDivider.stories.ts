import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { defineComponent } from 'vue'
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
    subtle: 'bg-primary-subtle',
    default: 'bg-primary-default',
    strong: 'bg-primary-active',
  },
  {
    name: 'secondary',
    subtle: 'bg-secondary-subtle',
    default: 'bg-secondary-default',
    strong: 'bg-secondary-active',
  },
  {
    name: 'danger',
    subtle: 'bg-danger-bg',
    default: 'bg-danger-border',
    strong: 'bg-danger-solid',
  },
  {
    name: 'success',
    subtle: 'bg-success-bg',
    default: 'bg-success-border',
    strong: 'bg-success-solid',
  },
  {
    name: 'warning',
    subtle: 'bg-warning-bg',
    default: 'bg-warning-border',
    strong: 'bg-warning-solid',
  },
  {
    name: 'info',
    subtle: 'bg-info-bg',
    default: 'bg-info-border',
    strong: 'bg-info-solid',
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

// Shared view fragments. Each block is authored once here and reused by both its
// standalone story and the Snapshot board, so the snapped image can never drift
// from the live story.

// Horizontal: a full-width rule parting stacked content.
const HorizontalView = defineComponent({
  components: { Divider },
  template: `
    <div class="flex w-64 flex-col gap-4 text-fg-default">
      <p class="font-body text-base">First block of content.</p>
      <Divider />
      <p class="font-body text-base">Second block of content.</p>
    </div>
  `,
})

// Vertical: a self-stretching rule between inline items. The flex parent supplies
// the height the rule stretches to.
const VerticalView = defineComponent({
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
})

// Colour by Tailwind class: the rule defaults to the strong border, but any
// bg-* utility on the fallthrough class recolours it -- the border ramp
// (subtle/default/strong) plus the focus pink for emphasis.
const ColorsView = defineComponent({
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
})

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

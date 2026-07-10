import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Card from './AtCard.vue'
import { BasicView } from './views/BasicView'
import { HeaderAndFooterView } from './views/HeaderAndFooterView'
import { FooterSummaryView } from './views/FooterSummaryView'
import { MediaTopView } from './views/MediaTopView'
import { MediaSideView } from './views/MediaSideView'
import { InteractiveView } from './views/InteractiveView'

const mediaPositions = ['top', 'left', 'right'] as const

const meta = {
  title: 'Components/Card',
  component: Card,
  // Fail the Vitest run on any axe violation, not just warn.
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    href: { control: 'text' },
    mediaPosition: { control: 'select', options: mediaPositions },
  },
  args: { mediaPosition: 'top' },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => ({
    components: { Card },
    setup: () => ({ args }),
    template: `
      <Card v-bind="args" class="w-80">
        <p class="text-base">A flexible content area that takes any markup, including other components.</p>
      </Card>
    `,
  }),
}

export const Basic: Story = {
  render: () => ({ components: { BasicView }, template: `<BasicView />` }),
}

export const HeaderAndFooter: Story = {
  render: () => ({ components: { HeaderAndFooterView }, template: `<HeaderAndFooterView />` }),
}

export const FooterSummary: Story = {
  render: () => ({ components: { FooterSummaryView }, template: `<FooterSummaryView />` }),
}

export const MediaTop: Story = {
  render: () => ({ components: { MediaTopView }, template: `<MediaTopView />` }),
}

export const MediaSide: Story = {
  render: () => ({ components: { MediaSideView }, template: `<MediaSideView />` }),
}

export const Interactive: Story = {
  render: () => ({ components: { InteractiveView }, template: `<InteractiveView />` }),
}

// Multiple cards grouped as a list of content sections.
export const CardList: Story = {
  render: () => ({
    components: { Card },
    template: `
      <div class="flex w-80 flex-col gap-4">
        <Card v-for="n in 3" :key="n">
          <h3 class="font-heading text-base font-bold">Section {{ n }}</h3>
          <p class="mt-1 text-sm text-fg-muted">One of several stacked cards.</p>
        </Card>
      </div>
    `,
  }),
}

// Semantic colouring by fallthrough class: a tinted background plus the matching
// semantic border recolour the card without any colour prop -- the same
// recolour-by-utility pattern the Divider uses. The default light text sits on
// each dark tint. Not part of the snapshot board.
const semantics = [
  { name: 'Primary', class: 'bg-primary-subtle border-primary-default' },
  { name: 'Secondary', class: 'bg-secondary-subtle border-secondary-default' },
  { name: 'Danger', class: 'bg-danger-bg border-danger-border' },
  { name: 'Success', class: 'bg-success-bg border-success-border' },
  { name: 'Warning', class: 'bg-warning-bg border-warning-border' },
  { name: 'Info', class: 'bg-info-bg border-info-border' },
] as const

export const SemanticColors: Story = {
  render: () => ({
    components: { Card },
    setup: () => ({ semantics }),
    template: `
      <div class="grid grid-cols-2 gap-4">
        <Card v-for="s in semantics" :key="s.name" :class="s.class" class="w-72">
          <h3 class="font-heading text-lg font-bold">{{ s.name }}</h3>
          <p class="mt-2 text-base text-fg-muted">A card tinted to its semantic colour.</p>
        </Card>
      </div>
    `,
  }),
}

// The visual board: every shape on one screen. This is the story the snapshot
// test snaps. Baseline: __snaps__/card-chromium-linux.png.
export const Snapshot: Story = {
  render: () => ({
    components: {
      BasicView,
      HeaderAndFooterView,
      InteractiveView,
      MediaTopView,
      MediaSideView,
      FooterSummaryView,
    },
    template: `
      <div class="flex w-max items-start gap-6 bg-bg-default p-6" data-testid="snap-board">
        <div class="flex flex-col gap-6">
          <BasicView />
          <HeaderAndFooterView />
          <InteractiveView />
        </div>
        <div class="flex flex-col gap-6">
          <MediaTopView />
          <MediaSideView />
          <FooterSummaryView />
        </div>
      </div>
    `,
  }),
}

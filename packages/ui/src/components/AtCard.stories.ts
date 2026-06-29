import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PhX } from '@phosphor-icons/vue'
import Card from './AtCard.vue'
import Button from './AtButton.vue'
import Divider from './AtDivider.vue'
import Icon from './AtIcon.vue'

const mediaPositions = ['top', 'left', 'right'] as const

// A stand-in media block: a flat coloured panel standing in for an image so the
// stories carry no asset dependency. Full-bleed on top, fixed-width on the side.
const mediaTop = `<div class="h-32 w-full bg-secondary-default"></div>`
const mediaSide = `<div class="w-32 bg-secondary-default"></div>`

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

// Body only: the simplest card -- a bordered surface holding arbitrary content.
export const Basic: Story = {
  render: () => ({
    components: { Card },
    template: `
      <Card class="w-80">
        <h3 class="font-heading text-lg font-bold">Card title</h3>
        <p class="mt-2 text-base text-fg-muted">Supporting copy describing the subject this card groups.</p>
      </Card>
    `,
  }),
}

// Header + footer: each parted from the body by a flush divider. The header
// composes a title with a close icon button at its right edge; the footer
// composes trailing action buttons.
export const HeaderAndFooter: Story = {
  render: () => ({
    components: { Card, Button, Icon },
    setup: () => ({ PhX }),
    template: `
      <Card class="w-80">
        <template #header>
          <h3 class="font-heading text-lg font-bold">Settings</h3>
          <Button intent="neutral" variant="flat" size="sm" aria-label="Close">
            <template #left><Icon :icon="PhX" /></template>
          </Button>
        </template>
        <p class="text-base text-fg-muted">The body sits between the two dividers.</p>
        <template #footer>
          <div class="flex w-full justify-end gap-2">
            <Button intent="neutral" size="sm">Cancel</Button>
            <Button intent="primary" size="sm">Save</Button>
          </div>
        </template>
      </Card>
    `,
  }),
}

// A footer carrying a summary instead of actions -- the slot is flexible enough
// for either, or both.
export const FooterSummary: Story = {
  render: () => ({
    components: { Card },
    template: `
      <Card class="w-80">
        <h3 class="font-heading text-lg font-bold">Invoice #1024</h3>
        <p class="mt-2 text-base text-fg-muted">3 line items.</p>
        <template #footer>
          <span class="text-sm text-fg-subtle">Updated today</span>
          <span class="font-bold">$420.00</span>
        </template>
      </Card>
    `,
  }),
}

// Full-bleed media band on top, clipped to the card radius.
export const MediaTop: Story = {
  render: () => ({
    components: { Card },
    template: `
      <Card class="w-80">
        <template #media>${mediaTop}</template>
        <h3 class="font-heading text-lg font-bold">With media</h3>
        <p class="mt-2 text-base text-fg-muted">A full-width media area sits above the content.</p>
      </Card>
    `,
  }),
}

// Media flush to one side of the content column.
export const MediaSide: Story = {
  render: () => ({
    components: { Card },
    template: `
      <Card class="w-96" media-position="left">
        <template #media>${mediaSide}</template>
        <h3 class="font-heading text-lg font-bold">Side media</h3>
        <p class="mt-2 text-base text-fg-muted">The media sits beside the content instead of above it.</p>
      </Card>
    `,
  }),
}

// The whole card is one tappable action: an anchor with the lift/press
// affordance. No nested links or buttons in this shape.
export const Interactive: Story = {
  render: () => ({
    components: { Card },
    template: `
      <Card href="https://example.com" class="w-80">
        <h3 class="font-heading text-lg font-bold">Tappable card</h3>
        <p class="mt-2 text-base text-fg-muted">The entire card navigates on click.</p>
      </Card>
    `,
  }),
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
    components: { Card, Button, Divider, Icon },
    setup: () => ({ mediaTop, mediaSide, PhX }),
    template: `
      <div class="flex w-max items-start gap-6 bg-bg-default p-6" data-testid="snap-board">
        <div class="flex flex-col gap-6">
          <Card class="w-80">
            <h3 class="font-heading text-lg font-bold">Basic</h3>
            <p class="mt-2 text-base text-fg-muted">Body-only card.</p>
          </Card>
          <Card class="w-80">
            <template #header>
              <h3 class="font-heading text-lg font-bold">Settings</h3>
              <Button intent="neutral" variant="flat" size="sm" aria-label="Close">
                <template #left><Icon :icon="PhX" /></template>
              </Button>
            </template>
            <p class="text-base text-fg-muted">Header, body, footer.</p>
            <template #footer>
              <div class="flex w-full justify-end gap-2">
                <Button intent="neutral" size="sm">Cancel</Button>
                <Button intent="primary" size="sm">Save</Button>
              </div>
            </template>
          </Card>
          <Card href="https://example.com" class="w-80">
            <h3 class="font-heading text-lg font-bold">Tappable</h3>
            <p class="mt-2 text-base text-fg-muted">Whole card is an action.</p>
          </Card>
        </div>
        <div class="flex flex-col gap-6">
          <Card class="w-80">
            <template #media><div class="h-32 w-full bg-secondary-default"></div></template>
            <h3 class="font-heading text-lg font-bold">Media top</h3>
            <p class="mt-2 text-base text-fg-muted">Full-bleed band.</p>
          </Card>
          <Card class="w-96" media-position="left">
            <template #media><div class="w-32 bg-secondary-default"></div></template>
            <h3 class="font-heading text-lg font-bold">Media side</h3>
            <p class="mt-2 text-base text-fg-muted">Beside the content.</p>
          </Card>
          <Card class="w-80">
            <h3 class="font-heading text-lg font-bold">Invoice #1024</h3>
            <p class="mt-2 text-base text-fg-muted">3 line items.</p>
            <template #footer>
              <span class="text-sm text-fg-subtle">Updated today</span>
              <span class="font-bold">$420.00</span>
            </template>
          </Card>
        </div>
      </div>
    `,
  }),
}

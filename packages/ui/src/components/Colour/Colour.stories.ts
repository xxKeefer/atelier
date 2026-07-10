import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PrimitivesView } from './views/PrimitivesView'
import { StatusView } from './views/StatusView'
import { BrandView } from './views/BrandView'
import { IconsAndTextView } from './views/IconsAndTextView'

// The colour model has no component -- like Elevation, it's a token-layer
// foundation. This story renders the tier-1 palette itself: every colourway as a
// row, every shade (50-950) as a column, so the raw ramp can be eyeballed and snapped.
const meta = {
  title: 'Foundations/Colour',
  parameters: { a11y: { test: 'error' } },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Primitives: Story = {
  render: () => ({
    components: { PrimitivesView },
    template: `<PrimitivesView />`,
  }),
}

// Tier-2 semantic statuses: every status as a row, every surface/edge/text token
// as a column. Fill tokens (bg, solid, surface-*) swatch as filled boxes; border
// tokens (border, border-*, edge) swatch as outline-only boxes so the rim itself is
// what's demonstrated; fg/on-solid swatch as sample text (on-solid over its solid fill).
export const Status: Story = {
  render: () => ({
    components: { StatusView },
    template: `<StatusView />`,
  }),
}

// The three brand rows: primary, secondary, neutral, columned by surface ramp +
// border tiers + edge + fg. Neutral has no edge token (no lit fill to shadow), so
// that cell renders empty rather than a fake substitute -- see data.ts for why.
export const Brand: Story = {
  render: () => ({
    components: { BrandView },
    template: `<BrandView />`,
  }),
}

// Icon/text usage examples: an icon and a text sample coloured to match the
// surface underneath, using only the fg/on-solid pairings already validated
// (contrast.test.ts) by the Status/Brand stories above.
export const IconsAndText: Story = {
  render: () => ({
    components: { IconsAndTextView },
    template: `<IconsAndTextView />`,
  }),
}

// The visual board: every colour story stacked on one screen, each from the same
// shared view as its standalone story. This is the story the snapshot test snaps.
export const Snapshot: Story = {
  render: () => ({
    components: { PrimitivesView, StatusView, BrandView, IconsAndTextView },
    template: `
      <div class="flex w-max flex-col gap-8 bg-bg-default p-6 text-fg-default" data-testid="snap-board">
        <section class="flex flex-col gap-3">
          <h2 class="font-heading font-bold text-lg">Primitives</h2>
          <PrimitivesView />
        </section>
        <section class="flex flex-col gap-3">
          <h2 class="font-heading font-bold text-lg">Status</h2>
          <StatusView />
        </section>
        <section class="flex flex-col gap-3">
          <h2 class="font-heading font-bold text-lg">Brand</h2>
          <BrandView />
        </section>
        <section class="flex flex-col gap-3">
          <h2 class="font-heading font-bold text-lg">Icons and Text</h2>
          <IconsAndTextView />
        </section>
      </div>
    `,
  }),
}

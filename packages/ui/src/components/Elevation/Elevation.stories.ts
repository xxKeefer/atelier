import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { NeutralView } from './views/NeutralView'
import { SemanticsView } from './views/SemanticsView'

// The elevation model has no component -- it's a token-layer foundation. These
// stories render the two families that compose skeuomorphic depth so they can be
// eyeballed and snapped: the shadow ladder and the surface ramp.

// Hover animations: a tile rests at one rung and transitions one level on hover.
// The grid runs every colourway (neutral, then the semantics) down the rows; the
// columns are the eight transitions, sink first (higher down to lower) then lift (lower
// up to higher). Two rules make the skeuomorphism read:
//   1. Surface AND border tier by rung, mirroring the Semantics ladder: the recess
//      group (lower / low / flat) sits on the colourway's recess plane with its dimmer
//      lit rim (border-default); the lifts (high / higher) rise to the solid fill with
//      the brighter rim (border-strong). Both transition on hover in lockstep with the
//      shadow, so a tile that sinks from a lift into the recess group drops its plane
//      and rim too, not just the shadow -- the same depth read as Semantics, animated.
//   2. Lifted rungs translate up by the shadow's drop distance, in lockstep with
//      the hard bottom-edge shadow. The translate consumes the generated
//      translate-y-lift-* utilities (from --spacing-lift-*, the spacing namespace
//      Tailwind translate reads), whose values equal the matching shadow's edge
//      height -- high pairs with lift-half, higher with lift-full -- so the two
//      can never drift. The element rises while the shadow's outer edge stays pinned
//      to the baseline, so it extrudes from the plane instead of the plane falling away.
// Class strings are spelled out in full -- Tailwind only scans literals, so the
// `hover:` surface / border / shadow / translate utilities must all appear verbatim.
const sinkLabels = ['higher -> high', 'high -> flat', 'flat -> low', 'low -> lower'] as const
const liftLabels = ['lower -> low', 'low -> flat', 'flat -> high', 'high -> higher'] as const

const animationGrid = [
  {
    name: 'neutral',
    sink: [
      'bg-surface-strong border-border-strong shadow-higher -translate-y-lift-full hover:bg-surface-strong hover:border-border-strong hover:shadow-high hover:-translate-y-lift-half',
      'bg-surface-strong border-border-strong shadow-high -translate-y-lift-half hover:bg-surface-default hover:border-border-default hover:shadow-flat hover:translate-y-0',
      'bg-surface-default border-border-default shadow-flat hover:bg-surface-default hover:border-border-default hover:shadow-low',
      'bg-surface-default border-border-default shadow-low hover:bg-surface-default hover:border-border-default hover:shadow-lower',
    ],
    lift: [
      'bg-surface-default border-border-default shadow-lower hover:bg-surface-default hover:border-border-default hover:shadow-low',
      'bg-surface-default border-border-default shadow-low hover:bg-surface-default hover:border-border-default hover:shadow-flat',
      'bg-surface-default border-border-default shadow-flat hover:bg-surface-strong hover:border-border-strong hover:shadow-high hover:-translate-y-lift-half',
      'bg-surface-strong border-border-strong shadow-high -translate-y-lift-half hover:bg-surface-strong hover:border-border-strong hover:shadow-higher hover:-translate-y-lift-full',
    ],
  },
  {
    name: 'primary',
    sink: [
      'bg-primary-default border-primary-border-strong shadow-primary-higher -translate-y-lift-full hover:bg-primary-default hover:border-primary-border-strong hover:shadow-primary-high hover:-translate-y-lift-half',
      'bg-primary-default border-primary-border-strong shadow-primary-high -translate-y-lift-half hover:bg-primary-surface-recess hover:border-primary-border-default hover:shadow-flat hover:translate-y-0',
      'bg-primary-surface-recess border-primary-border-default shadow-flat hover:bg-primary-surface-recess hover:border-primary-border-default hover:shadow-primary-low',
      'bg-primary-surface-recess border-primary-border-default shadow-primary-low hover:bg-primary-surface-recess hover:border-primary-border-default hover:shadow-primary-lower',
    ],
    lift: [
      'bg-primary-surface-recess border-primary-border-default shadow-primary-lower hover:bg-primary-surface-recess hover:border-primary-border-default hover:shadow-primary-low',
      'bg-primary-surface-recess border-primary-border-default shadow-primary-low hover:bg-primary-surface-recess hover:border-primary-border-default hover:shadow-flat',
      'bg-primary-surface-recess border-primary-border-default shadow-flat hover:bg-primary-default hover:border-primary-border-strong hover:shadow-primary-high hover:-translate-y-lift-half',
      'bg-primary-default border-primary-border-strong shadow-primary-high -translate-y-lift-half hover:bg-primary-default hover:border-primary-border-strong hover:shadow-primary-higher hover:-translate-y-lift-full',
    ],
  },
  {
    name: 'secondary',
    sink: [
      'bg-secondary-default border-secondary-border-strong shadow-secondary-higher -translate-y-lift-full hover:bg-secondary-default hover:border-secondary-border-strong hover:shadow-secondary-high hover:-translate-y-lift-half',
      'bg-secondary-default border-secondary-border-strong shadow-secondary-high -translate-y-lift-half hover:bg-secondary-surface-recess hover:border-secondary-border-default hover:shadow-flat hover:translate-y-0',
      'bg-secondary-surface-recess border-secondary-border-default shadow-flat hover:bg-secondary-surface-recess hover:border-secondary-border-default hover:shadow-secondary-low',
      'bg-secondary-surface-recess border-secondary-border-default shadow-secondary-low hover:bg-secondary-surface-recess hover:border-secondary-border-default hover:shadow-secondary-lower',
    ],
    lift: [
      'bg-secondary-surface-recess border-secondary-border-default shadow-secondary-lower hover:bg-secondary-surface-recess hover:border-secondary-border-default hover:shadow-secondary-low',
      'bg-secondary-surface-recess border-secondary-border-default shadow-secondary-low hover:bg-secondary-surface-recess hover:border-secondary-border-default hover:shadow-flat',
      'bg-secondary-surface-recess border-secondary-border-default shadow-flat hover:bg-secondary-default hover:border-secondary-border-strong hover:shadow-secondary-high hover:-translate-y-lift-half',
      'bg-secondary-default border-secondary-border-strong shadow-secondary-high -translate-y-lift-half hover:bg-secondary-default hover:border-secondary-border-strong hover:shadow-secondary-higher hover:-translate-y-lift-full',
    ],
  },
  {
    name: 'danger',
    sink: [
      'bg-danger-solid border-danger-border-strong shadow-danger-higher -translate-y-lift-full hover:bg-danger-solid hover:border-danger-border-strong hover:shadow-danger-high hover:-translate-y-lift-half',
      'bg-danger-solid border-danger-border-strong shadow-danger-high -translate-y-lift-half hover:bg-danger-surface-recess hover:border-danger-border-default hover:shadow-flat hover:translate-y-0',
      'bg-danger-surface-recess border-danger-border-default shadow-flat hover:bg-danger-surface-recess hover:border-danger-border-default hover:shadow-danger-low',
      'bg-danger-surface-recess border-danger-border-default shadow-danger-low hover:bg-danger-surface-recess hover:border-danger-border-default hover:shadow-danger-lower',
    ],
    lift: [
      'bg-danger-surface-recess border-danger-border-default shadow-danger-lower hover:bg-danger-surface-recess hover:border-danger-border-default hover:shadow-danger-low',
      'bg-danger-surface-recess border-danger-border-default shadow-danger-low hover:bg-danger-surface-recess hover:border-danger-border-default hover:shadow-flat',
      'bg-danger-surface-recess border-danger-border-default shadow-flat hover:bg-danger-solid hover:border-danger-border-strong hover:shadow-danger-high hover:-translate-y-lift-half',
      'bg-danger-solid border-danger-border-strong shadow-danger-high -translate-y-lift-half hover:bg-danger-solid hover:border-danger-border-strong hover:shadow-danger-higher hover:-translate-y-lift-full',
    ],
  },
  {
    name: 'success',
    sink: [
      'bg-success-solid border-success-border-strong shadow-success-higher -translate-y-lift-full hover:bg-success-solid hover:border-success-border-strong hover:shadow-success-high hover:-translate-y-lift-half',
      'bg-success-solid border-success-border-strong shadow-success-high -translate-y-lift-half hover:bg-success-surface-recess hover:border-success-border-default hover:shadow-flat hover:translate-y-0',
      'bg-success-surface-recess border-success-border-default shadow-flat hover:bg-success-surface-recess hover:border-success-border-default hover:shadow-success-low',
      'bg-success-surface-recess border-success-border-default shadow-success-low hover:bg-success-surface-recess hover:border-success-border-default hover:shadow-success-lower',
    ],
    lift: [
      'bg-success-surface-recess border-success-border-default shadow-success-lower hover:bg-success-surface-recess hover:border-success-border-default hover:shadow-success-low',
      'bg-success-surface-recess border-success-border-default shadow-success-low hover:bg-success-surface-recess hover:border-success-border-default hover:shadow-flat',
      'bg-success-surface-recess border-success-border-default shadow-flat hover:bg-success-solid hover:border-success-border-strong hover:shadow-success-high hover:-translate-y-lift-half',
      'bg-success-solid border-success-border-strong shadow-success-high -translate-y-lift-half hover:bg-success-solid hover:border-success-border-strong hover:shadow-success-higher hover:-translate-y-lift-full',
    ],
  },
  {
    name: 'warning',
    sink: [
      'bg-warning-solid border-warning-border-strong shadow-warning-higher -translate-y-lift-full hover:bg-warning-solid hover:border-warning-border-strong hover:shadow-warning-high hover:-translate-y-lift-half',
      'bg-warning-solid border-warning-border-strong shadow-warning-high -translate-y-lift-half hover:bg-warning-surface-recess hover:border-warning-border-default hover:shadow-flat hover:translate-y-0',
      'bg-warning-surface-recess border-warning-border-default shadow-flat hover:bg-warning-surface-recess hover:border-warning-border-default hover:shadow-warning-low',
      'bg-warning-surface-recess border-warning-border-default shadow-warning-low hover:bg-warning-surface-recess hover:border-warning-border-default hover:shadow-warning-lower',
    ],
    lift: [
      'bg-warning-surface-recess border-warning-border-default shadow-warning-lower hover:bg-warning-surface-recess hover:border-warning-border-default hover:shadow-warning-low',
      'bg-warning-surface-recess border-warning-border-default shadow-warning-low hover:bg-warning-surface-recess hover:border-warning-border-default hover:shadow-flat',
      'bg-warning-surface-recess border-warning-border-default shadow-flat hover:bg-warning-solid hover:border-warning-border-strong hover:shadow-warning-high hover:-translate-y-lift-half',
      'bg-warning-solid border-warning-border-strong shadow-warning-high -translate-y-lift-half hover:bg-warning-solid hover:border-warning-border-strong hover:shadow-warning-higher hover:-translate-y-lift-full',
    ],
  },
  {
    name: 'info',
    sink: [
      'bg-info-solid border-info-border-strong shadow-info-higher -translate-y-lift-full hover:bg-info-solid hover:border-info-border-strong hover:shadow-info-high hover:-translate-y-lift-half',
      'bg-info-solid border-info-border-strong shadow-info-high -translate-y-lift-half hover:bg-info-surface-recess hover:border-info-border-default hover:shadow-flat hover:translate-y-0',
      'bg-info-surface-recess border-info-border-default shadow-flat hover:bg-info-surface-recess hover:border-info-border-default hover:shadow-info-low',
      'bg-info-surface-recess border-info-border-default shadow-info-low hover:bg-info-surface-recess hover:border-info-border-default hover:shadow-info-lower',
    ],
    lift: [
      'bg-info-surface-recess border-info-border-default shadow-info-lower hover:bg-info-surface-recess hover:border-info-border-default hover:shadow-info-low',
      'bg-info-surface-recess border-info-border-default shadow-info-low hover:bg-info-surface-recess hover:border-info-border-default hover:shadow-flat',
      'bg-info-surface-recess border-info-border-default shadow-flat hover:bg-info-solid hover:border-info-border-strong hover:shadow-info-high hover:-translate-y-lift-half',
      'bg-info-solid border-info-border-strong shadow-info-high -translate-y-lift-half hover:bg-info-solid hover:border-info-border-strong hover:shadow-info-higher hover:-translate-y-lift-full',
    ],
  },
] as const

const meta = {
  title: 'Foundations/Elevation',
  // No backing component -- fail the Vitest run on any axe violation regardless.
  parameters: { a11y: { test: 'error' } },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// The neutral foundation: surface ramp + shadow ladder in the semantics row layout.
export const Neutral: Story = {
  render: () => ({
    components: { NeutralView },
    template: `<NeutralView />`,
  }),
}

// Hover each tile to play its elevation transition. Rows are the colourways
// (neutral, then the semantics); columns are the eight transitions, sink first
// (drop one rung) then lift (rise one rung). Not snapped -- hover state can't be
// captured statically.
export const Animations: Story = {
  render: () => ({
    setup: () => ({ animationGrid, sinkLabels, liftLabels }),
    template: `
      <div class="flex w-max flex-col gap-4 text-fg-default">
        <div class="flex items-end gap-4">
          <span class="w-20 shrink-0"></span>
          <div class="flex gap-8">
            <div class="flex flex-col gap-1">
              <span class="font-heading font-bold text-sm">Sink on hover</span>
              <div class="flex gap-4">
                <span v-for="l in sinkLabels" :key="l" class="w-28 text-center font-mono text-fg-subtle text-xs">{{ l }}</span>
              </div>
            </div>
            <div class="flex flex-col gap-1">
              <span class="font-heading font-bold text-sm">Lift on hover</span>
              <div class="flex gap-4">
                <span v-for="l in liftLabels" :key="l" class="w-28 text-center font-mono text-fg-subtle text-xs">{{ l }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-for="row in animationGrid" :key="row.name" class="flex items-center gap-4">
          <span class="w-20 shrink-0 font-mono text-sm">{{ row.name }}</span>
          <div class="flex gap-8">
            <div class="flex gap-4">
              <div v-for="(c, i) in row.sink" :key="i" class="h-20 w-28 cursor-pointer rounded-lg border transition-all duration-200 ease-out" :class="c"></div>
            </div>
            <div class="flex gap-4">
              <div v-for="(c, i) in row.lift" :key="i" class="h-20 w-28 cursor-pointer rounded-lg border transition-all duration-200 ease-out" :class="c"></div>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
}

// One row per semantic colourway: its surface ramp (subtle / default / strong,
// mirroring the neutral ramp) beside its shadow ladder. Reads down the column to
// compare how each colourway lifts/sinks.
export const Semantics: Story = {
  render: () => ({
    components: { SemanticsView },
    template: `<SemanticsView />`,
  }),
}

// The visual board: the neutral foundation row, then the per-colourway semantic
// rows on one screen -- each from the same shared view as its standalone story.
// This is the story the snapshot test snaps.
export const Snapshot: Story = {
  render: () => ({
    components: { NeutralView, SemanticsView },
    template: `
      <div class="flex w-max flex-col gap-8 bg-bg-default p-6 text-fg-default" data-testid="snap-board">
        <section class="flex flex-col gap-3">
          <h2 class="font-heading font-bold text-lg">Neutral</h2>
          <NeutralView />
        </section>
        <section class="flex flex-col gap-3">
          <h2 class="font-heading font-bold text-lg">Semantics</h2>
          <SemanticsView />
        </section>
      </div>
    `,
  }),
}

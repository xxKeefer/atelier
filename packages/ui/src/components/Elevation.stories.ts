import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { defineComponent } from 'vue'

// The elevation model has no component -- it's a token-layer foundation. These
// stories render the two families that compose skeuomorphic depth so they can be
// eyeballed and snapped: the shadow ladder and the surface ramp.

// The symmetric shadow ladder, hard-edged (no blur). Below default = a solid
// inset band at the top recessing to the subtle tone (lower); above = a solid
// neutral-border block dropped below (higher). default is flat. Each maps to a
// shadow-* utility off the token of the same name.
// surface is held constant at the resting plane (default) across all rungs so the
// ladder isolates the shadow variable -- you read the depth, not the plane colour.
// The 1:1 rung->surface pairing is shown separately in the surface ramp below.
// Neutral recesses use border-default (700) not border-subtle (800): subtle equals
// the surface-default plane these tiles sit on, so it reads invisible. 700 contrasts
// the 800 plane while staying lighter than the strong (600) edge on the lifts.
const shadows = [
  {
    name: 'sunk',
    shadow: 'shadow-sunk',
    surface: 'bg-surface-default',
    border: 'border-border-default',
  },
  {
    name: 'half-sunk',
    shadow: 'shadow-half-sunk',
    surface: 'bg-surface-default',
    border: 'border-border-default',
  },
  {
    name: 'default',
    shadow: 'shadow-default',
    surface: 'bg-surface-default',
    border: 'border-border-default',
  },
  {
    name: 'half-pop',
    shadow: 'shadow-half-pop',
    surface: 'bg-surface-strong',
    border: 'border-border-strong',
  },
  {
    name: 'pop',
    shadow: 'shadow-pop',
    surface: 'bg-surface-strong',
    border: 'border-border-strong',
  },
] as const

// The surface ramp: three planes the elevation rungs sit on. recesses use subtle
// (900), the resting rung default (800), lifts strong (700). edge is NOT a plane --
// it's a separator added only when an elevated element's surface matches the flat
// ground it sits on (e.g. a default-plane element on a default-plane ground), so it
// doesn't belong in the ramp. Every colourway mirrors this three-plane shape.
const surfaces = [
  { name: 'subtle', class: 'bg-surface-subtle', note: '900 -- recessed plane' },
  { name: 'default', class: 'bg-surface-default', note: '800 -- resting plane' },
  { name: 'strong', class: 'bg-surface-strong', note: '700 -- lifted plane' },
] as const

// The semantic colourways. The surface ramp mirrors the neutral ramp's shape:
// subtle (900) / default (solid 500) / strong (700) tinted planes -- the resting
// swatch shows the vivid solid fill. Each ladder tile carries a per-rung surface,
// border, and shadow:
//   - recesses (sunk / half-sunk): the {c}.600 plane (palette var), a SUBTLE border,
//     and an inset shadow whose recess tone is {c}.800 (see shadow tokens).
//   - resting (default): the solid fill, a SUBTLE border (same as the recesses --
//     it sits at rest, not lifted), and a flat shadow.
//   - lifts (half-pop / pop): the solid fill, a STRONG border, and the lifting
//     bright-edge shadow.
// Border tiers and shadows are the per-colourway tokens; only the {c}.600 recess
// plane has no semantic token, so it reaches the palette var directly.
// Tailwind only scans literals -- every utility is spelled out in full below.
const colourways = [
  {
    name: 'primary',
    surface: 'bg-brand-primary-default',
    ramp: [
      { label: 'subtle', class: 'bg-brand-primary-surface-subtle' },
      { label: 'default', class: 'bg-brand-primary-default' },
      { label: 'strong', class: 'bg-brand-primary-surface-strong' },
    ],
    ladder: [
      {
        name: 'sunk',
        class: 'shadow-primary-sunk',
        surface: 'bg-[var(--palette-magenta-600)]',
        border: 'border-[var(--palette-magenta-500)]',
      },
      {
        name: 'half-sunk',
        class: 'shadow-primary-half-sunk',
        surface: 'bg-[var(--palette-magenta-600)]',
        border: 'border-[var(--palette-magenta-500)]',
      },
      { name: 'default', class: 'shadow-default', border: 'border-brand-primary-border-subtle' },
      {
        name: 'half-pop',
        class: 'shadow-primary-half-pop',
        border: 'border-brand-primary-border-strong',
      },
      { name: 'pop', class: 'shadow-primary-pop', border: 'border-brand-primary-border-strong' },
    ],
  },
  {
    name: 'secondary',
    surface: 'bg-brand-secondary-default',
    ramp: [
      { label: 'subtle', class: 'bg-brand-secondary-surface-subtle' },
      { label: 'default', class: 'bg-brand-secondary-default' },
      { label: 'strong', class: 'bg-brand-secondary-surface-strong' },
    ],
    ladder: [
      {
        name: 'sunk',
        class: 'shadow-secondary-sunk',
        surface: 'bg-[var(--palette-violet-600)]',
        border: 'border-[var(--palette-violet-500)]',
      },
      {
        name: 'half-sunk',
        class: 'shadow-secondary-half-sunk',
        surface: 'bg-[var(--palette-violet-600)]',
        border: 'border-[var(--palette-violet-500)]',
      },
      { name: 'default', class: 'shadow-default', border: 'border-brand-secondary-border-subtle' },
      {
        name: 'half-pop',
        class: 'shadow-secondary-half-pop',
        border: 'border-brand-secondary-border-strong',
      },
      {
        name: 'pop',
        class: 'shadow-secondary-pop',
        border: 'border-brand-secondary-border-strong',
      },
    ],
  },
  {
    name: 'danger',
    surface: 'bg-status-danger-solid',
    ramp: [
      { label: 'subtle', class: 'bg-status-danger-surface-subtle' },
      { label: 'default', class: 'bg-status-danger-solid' },
      { label: 'strong', class: 'bg-status-danger-surface-strong' },
    ],
    ladder: [
      {
        name: 'sunk',
        class: 'shadow-danger-sunk',
        surface: 'bg-[var(--palette-red-600)]',
        border: 'border-[var(--palette-red-500)]',
      },
      {
        name: 'half-sunk',
        class: 'shadow-danger-half-sunk',
        surface: 'bg-[var(--palette-red-600)]',
        border: 'border-[var(--palette-red-500)]',
      },
      { name: 'default', class: 'shadow-default', border: 'border-status-danger-border-subtle' },
      {
        name: 'half-pop',
        class: 'shadow-danger-half-pop',
        border: 'border-status-danger-border-strong',
      },
      { name: 'pop', class: 'shadow-danger-pop', border: 'border-status-danger-border-strong' },
    ],
  },
  {
    name: 'success',
    surface: 'bg-status-success-solid',
    ramp: [
      { label: 'subtle', class: 'bg-status-success-surface-subtle' },
      { label: 'default', class: 'bg-status-success-solid' },
      { label: 'strong', class: 'bg-status-success-surface-strong' },
    ],
    ladder: [
      {
        name: 'sunk',
        class: 'shadow-success-sunk',
        surface: 'bg-[var(--palette-green-600)]',
        border: 'border-[var(--palette-green-500)]',
      },
      {
        name: 'half-sunk',
        class: 'shadow-success-half-sunk',
        surface: 'bg-[var(--palette-green-600)]',
        border: 'border-[var(--palette-green-500)]',
      },
      { name: 'default', class: 'shadow-default', border: 'border-status-success-border-subtle' },
      {
        name: 'half-pop',
        class: 'shadow-success-half-pop',
        border: 'border-status-success-border-strong',
      },
      { name: 'pop', class: 'shadow-success-pop', border: 'border-status-success-border-strong' },
    ],
  },
  {
    name: 'warning',
    surface: 'bg-status-warning-solid',
    ramp: [
      { label: 'subtle', class: 'bg-status-warning-surface-subtle' },
      { label: 'default', class: 'bg-status-warning-solid' },
      { label: 'strong', class: 'bg-status-warning-surface-strong' },
    ],
    ladder: [
      {
        name: 'sunk',
        class: 'shadow-warning-sunk',
        surface: 'bg-[var(--palette-yellow-600)]',
        border: 'border-[var(--palette-yellow-500)]',
      },
      {
        name: 'half-sunk',
        class: 'shadow-warning-half-sunk',
        surface: 'bg-[var(--palette-yellow-600)]',
        border: 'border-[var(--palette-yellow-500)]',
      },
      { name: 'default', class: 'shadow-default', border: 'border-status-warning-border-subtle' },
      {
        name: 'half-pop',
        class: 'shadow-warning-half-pop',
        border: 'border-status-warning-border-strong',
      },
      { name: 'pop', class: 'shadow-warning-pop', border: 'border-status-warning-border-strong' },
    ],
  },
  {
    name: 'info',
    surface: 'bg-status-info-solid',
    ramp: [
      { label: 'subtle', class: 'bg-status-info-surface-subtle' },
      { label: 'default', class: 'bg-status-info-solid' },
      { label: 'strong', class: 'bg-status-info-surface-strong' },
    ],
    ladder: [
      {
        name: 'sunk',
        class: 'shadow-info-sunk',
        surface: 'bg-[var(--palette-cyan-600)]',
        border: 'border-[var(--palette-cyan-500)]',
      },
      {
        name: 'half-sunk',
        class: 'shadow-info-half-sunk',
        surface: 'bg-[var(--palette-cyan-600)]',
        border: 'border-[var(--palette-cyan-500)]',
      },
      { name: 'default', class: 'shadow-default', border: 'border-status-info-border-subtle' },
      {
        name: 'half-pop',
        class: 'shadow-info-half-pop',
        border: 'border-status-info-border-strong',
      },
      { name: 'pop', class: 'shadow-info-pop', border: 'border-status-info-border-strong' },
    ],
  },
] as const

// Hover animations: a tile rests at one rung and transitions one level on hover.
// The grid runs every colourway (neutral, then the semantics) down the rows; the
// columns are the eight transitions, sink first (pop down to sunk) then lift (sunk
// up to pop). Two rules make the skeuomorphism read:
//   1. Surface stays the colourway's resting fill -- only the shadow changes, so you
//      read depth, not plane colour. Each row's shadow tokens carry that colourway's
//      tint (shadow-primary-*, shadow-danger-*, ...); the default rung is the shared
//      flat shadow-default in every row.
//   2. Lifted rungs translate up by the shadow's drop distance, in lockstep with
//      the hard bottom-edge shadow. The translate consumes the generated
//      translate-y-lift-* utilities (from --spacing-lift-*, the spacing namespace
//      Tailwind translate reads), whose values equal the matching shadow's edge
//      height -- half-pop pairs with lift-half, pop with lift-full -- so the two
//      can never drift. The element rises while the shadow's outer edge stays pinned
//      to the baseline, so it extrudes from the plane instead of the plane falling away.
// Class strings are spelled out in full -- Tailwind only scans literals, so the
// `hover:` utilities must appear verbatim.
const sinkLabels = [
  'pop -> half-pop',
  'half-pop -> default',
  'default -> half-sunk',
  'half-sunk -> sunk',
] as const
const liftLabels = [
  'sunk -> half-sunk',
  'half-sunk -> default',
  'default -> half-pop',
  'half-pop -> pop',
] as const

const animationGrid = [
  {
    name: 'neutral',
    surface: 'bg-surface-default',
    sink: [
      'shadow-pop -translate-y-lift-full hover:shadow-half-pop hover:-translate-y-lift-half',
      'shadow-half-pop -translate-y-lift-half hover:shadow-default hover:translate-y-0',
      'shadow-default hover:shadow-half-sunk',
      'shadow-half-sunk hover:shadow-sunk',
    ],
    lift: [
      'shadow-sunk hover:shadow-half-sunk',
      'shadow-half-sunk hover:shadow-default',
      'shadow-default hover:shadow-half-pop hover:-translate-y-lift-half',
      'shadow-half-pop -translate-y-lift-half hover:shadow-pop hover:-translate-y-lift-full',
    ],
  },
  {
    name: 'primary',
    surface: 'bg-brand-primary-default',
    sink: [
      'shadow-primary-pop -translate-y-lift-full hover:shadow-primary-half-pop hover:-translate-y-lift-half',
      'shadow-primary-half-pop -translate-y-lift-half hover:shadow-default hover:translate-y-0',
      'shadow-default hover:shadow-primary-half-sunk',
      'shadow-primary-half-sunk hover:shadow-primary-sunk',
    ],
    lift: [
      'shadow-primary-sunk hover:shadow-primary-half-sunk',
      'shadow-primary-half-sunk hover:shadow-default',
      'shadow-default hover:shadow-primary-half-pop hover:-translate-y-lift-half',
      'shadow-primary-half-pop -translate-y-lift-half hover:shadow-primary-pop hover:-translate-y-lift-full',
    ],
  },
  {
    name: 'secondary',
    surface: 'bg-brand-secondary-default',
    sink: [
      'shadow-secondary-pop -translate-y-lift-full hover:shadow-secondary-half-pop hover:-translate-y-lift-half',
      'shadow-secondary-half-pop -translate-y-lift-half hover:shadow-default hover:translate-y-0',
      'shadow-default hover:shadow-secondary-half-sunk',
      'shadow-secondary-half-sunk hover:shadow-secondary-sunk',
    ],
    lift: [
      'shadow-secondary-sunk hover:shadow-secondary-half-sunk',
      'shadow-secondary-half-sunk hover:shadow-default',
      'shadow-default hover:shadow-secondary-half-pop hover:-translate-y-lift-half',
      'shadow-secondary-half-pop -translate-y-lift-half hover:shadow-secondary-pop hover:-translate-y-lift-full',
    ],
  },
  {
    name: 'danger',
    surface: 'bg-status-danger-solid',
    sink: [
      'shadow-danger-pop -translate-y-lift-full hover:shadow-danger-half-pop hover:-translate-y-lift-half',
      'shadow-danger-half-pop -translate-y-lift-half hover:shadow-default hover:translate-y-0',
      'shadow-default hover:shadow-danger-half-sunk',
      'shadow-danger-half-sunk hover:shadow-danger-sunk',
    ],
    lift: [
      'shadow-danger-sunk hover:shadow-danger-half-sunk',
      'shadow-danger-half-sunk hover:shadow-default',
      'shadow-default hover:shadow-danger-half-pop hover:-translate-y-lift-half',
      'shadow-danger-half-pop -translate-y-lift-half hover:shadow-danger-pop hover:-translate-y-lift-full',
    ],
  },
  {
    name: 'success',
    surface: 'bg-status-success-solid',
    sink: [
      'shadow-success-pop -translate-y-lift-full hover:shadow-success-half-pop hover:-translate-y-lift-half',
      'shadow-success-half-pop -translate-y-lift-half hover:shadow-default hover:translate-y-0',
      'shadow-default hover:shadow-success-half-sunk',
      'shadow-success-half-sunk hover:shadow-success-sunk',
    ],
    lift: [
      'shadow-success-sunk hover:shadow-success-half-sunk',
      'shadow-success-half-sunk hover:shadow-default',
      'shadow-default hover:shadow-success-half-pop hover:-translate-y-lift-half',
      'shadow-success-half-pop -translate-y-lift-half hover:shadow-success-pop hover:-translate-y-lift-full',
    ],
  },
  {
    name: 'warning',
    surface: 'bg-status-warning-solid',
    sink: [
      'shadow-warning-pop -translate-y-lift-full hover:shadow-warning-half-pop hover:-translate-y-lift-half',
      'shadow-warning-half-pop -translate-y-lift-half hover:shadow-default hover:translate-y-0',
      'shadow-default hover:shadow-warning-half-sunk',
      'shadow-warning-half-sunk hover:shadow-warning-sunk',
    ],
    lift: [
      'shadow-warning-sunk hover:shadow-warning-half-sunk',
      'shadow-warning-half-sunk hover:shadow-default',
      'shadow-default hover:shadow-warning-half-pop hover:-translate-y-lift-half',
      'shadow-warning-half-pop -translate-y-lift-half hover:shadow-warning-pop hover:-translate-y-lift-full',
    ],
  },
  {
    name: 'info',
    surface: 'bg-status-info-solid',
    sink: [
      'shadow-info-pop -translate-y-lift-full hover:shadow-info-half-pop hover:-translate-y-lift-half',
      'shadow-info-half-pop -translate-y-lift-half hover:shadow-default hover:translate-y-0',
      'shadow-default hover:shadow-info-half-sunk',
      'shadow-info-half-sunk hover:shadow-info-sunk',
    ],
    lift: [
      'shadow-info-sunk hover:shadow-info-half-sunk',
      'shadow-info-half-sunk hover:shadow-default',
      'shadow-default hover:shadow-info-half-pop hover:-translate-y-lift-half',
      'shadow-info-half-pop -translate-y-lift-half hover:shadow-info-pop hover:-translate-y-lift-full',
    ],
  },
] as const

// Shared view fragments. Each block is authored once here and reused by both its
// standalone story and the Snapshot board, so the snapped image can never drift from
// the live story. Data lives module-level; each view pulls it in via setup.

// The neutral foundation, in the same row layout as the semantics: the surface
// ramp beside the shadow ladder. Borders are tiered by rung in every colourway:
// the recesses (sunk / half-sunk) take a subtle border, the resting and lifted
// rungs (default / half-pop / pop) a strong one. The neutral lifts also climb the
// surface ramp -- half-pop / pop sit on the strong plane (700).
const NeutralView = defineComponent({
  setup: () => ({ surfaces, shadows }),
  template: `
    <div class="flex w-max flex-col gap-6 text-fg-default">
      <p class="max-w-prose font-body text-fg-muted text-sm">
        Borders are tiered by rung: the recesses and resting rung (sunk / half-sunk /
        default) take a lighter border, only the lifts (half-pop / pop) a strong one --
        in each colourway's own border hue. The neutral lifts also rise up the surface
        ramp: half-pop and pop sit on the strong plane (700).
      </p>
      <div class="flex items-start gap-10">
        <span class="w-20 shrink-0 self-center font-mono text-sm">neutral</span>
        <div class="flex flex-col gap-2">
          <span class="font-body text-fg-subtle text-xs">surface ramp</span>
          <div class="flex items-end gap-3">
            <div v-for="s in surfaces" :key="s.name" class="flex flex-col items-center gap-2">
              <div class="h-14 w-14 rounded-md border border-border-default" :class="s.class"></div>
              <span class="font-body text-fg-subtle text-xs">{{ s.name }}</span>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <span class="font-body text-fg-subtle text-xs">shadow ladder</span>
          <div class="flex items-end gap-3">
            <div v-for="s in shadows" :key="s.name" class="flex flex-col items-center gap-2">
              <div class="grid h-14 w-20 place-items-center rounded-md border" :class="[s.surface, s.border, s.shadow]">
                <span class="font-mono text-xs">{{ s.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})

// One row per semantic colourway: its surface ramp beside its (fully coloured)
// shadow ladder.
const SemanticsView = defineComponent({
  setup: () => ({ colourways }),
  template: `
    <div class="flex w-max flex-col gap-6 text-fg-default">
      <p class="max-w-prose font-body text-fg-muted text-sm">
        Each colourway carries the same tiered borders as the neutral ladder: a subtle
        border on sunk / half-sunk / default, a strong border on the lifts (half-pop /
        pop) -- in the colourway's own border hue. Rung names are read off the neutral
        row above; the columns align.
      </p>
      <div v-for="cw in colourways" :key="cw.name" class="flex items-start gap-10">
        <span class="w-20 shrink-0 self-center font-mono text-sm">{{ cw.name }}</span>
        <div class="flex flex-col gap-2">
          <span class="font-body text-fg-subtle text-xs">surface ramp</span>
          <div class="flex items-end gap-3">
            <div v-for="t in cw.ramp" :key="t.label" class="flex flex-col items-center gap-2">
              <div class="h-14 w-14 rounded-md border border-border-default" :class="t.class"></div>
              <span class="font-body text-fg-subtle text-xs">{{ t.label }}</span>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <span class="font-body text-fg-subtle text-xs">shadow ladder</span>
          <div class="flex items-end gap-3">
            <div v-for="r in cw.ladder" :key="r.name" class="flex flex-col items-center gap-2">
              <div class="grid h-14 w-20 place-items-center rounded-md border" :class="[r.surface || cw.surface, r.border, r.class]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})

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
              <div v-for="(c, i) in row.sink" :key="i" class="h-20 w-28 cursor-pointer rounded-lg border border-border-default transition-all duration-200 ease-out" :class="[row.surface, c]"></div>
            </div>
            <div class="flex gap-4">
              <div v-for="(c, i) in row.lift" :key="i" class="h-20 w-28 cursor-pointer rounded-lg border border-border-default transition-all duration-200 ease-out" :class="[row.surface, c]"></div>
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

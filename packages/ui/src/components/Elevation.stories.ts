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
const shadows = [
  {
    name: 'sunk',
    shadow: 'shadow-sunk',
    surface: 'bg-surface-default',
    note: 'lowest -- recessed, inset',
  },
  {
    name: 'half-sunk',
    shadow: 'shadow-half-sunk',
    surface: 'bg-surface-default',
    note: 'lower -- shallow recess',
  },
  {
    name: 'default',
    shadow: 'shadow-default',
    surface: 'bg-surface-default',
    note: 'flat -- no elevation',
  },
  {
    name: 'half-pop',
    shadow: 'shadow-half-pop',
    surface: 'bg-surface-default',
    note: 'higher -- gentle lift',
  },
  {
    name: 'pop',
    shadow: 'shadow-pop',
    surface: 'bg-surface-default',
    note: 'highest -- hard bottom edge',
  },
] as const

// The surface ramp: three planes the elevation rungs sit on. recesses use subtle
// (900), the resting rung default (800), lifts strong (700).
const surfaces = [
  { name: 'subtle', class: 'bg-surface-subtle', note: '900 -- recessed plane' },
  { name: 'default', class: 'bg-surface-default', note: '800 -- resting plane' },
  { name: 'strong', class: 'bg-surface-strong', note: '700 -- lifted plane' },
] as const

// The semantic colourways. The surface ramp shows the three tokens that tint a
// colourway's surfaces, ordered light->dark->vivid: subtle (tinted bg), edge (the
// dark skeuomorphic side), solid (the vivid fill). Each ladder tile is fully
// coloured: it sits on the colourway's 900 plane with an 800 (edge) border, and the
// shadow is the per-colourway --shadow-<cw>-* token. Depth reads from a light/dark
// split exactly like the neutral ladder -- recesses (sunk/half-sunk) inset the dark
// 950 tone, lifts (half-pop/pop) drop the bright 600 tone -- so the well looks deep
// and the popped edge looks lit. The plane/border use the palette 900/800 vars
// directly (uniform across colourways; the semantic surface tokens stop at
// subtle/bg, which for status is 950 -- too dark to host a 950 recess).
// Tailwind only scans literals -- every utility is spelled out in full below.
const colourways = [
  {
    name: 'primary',
    surface: 'bg-[var(--palette-magenta-900)]',
    border: 'border-[var(--palette-magenta-800)]',
    ramp: [
      { label: 'subtle', class: 'bg-brand-primary-subtle' },
      { label: 'edge', class: 'bg-brand-primary-edge' },
      { label: 'solid', class: 'bg-brand-primary-default' },
    ],
    ladder: [
      { name: 'sunk', class: 'shadow-primary-sunk' },
      { name: 'half-sunk', class: 'shadow-primary-half-sunk' },
      { name: 'default', class: 'shadow-default' },
      { name: 'half-pop', class: 'shadow-primary-half-pop' },
      { name: 'pop', class: 'shadow-primary-pop' },
    ],
  },
  {
    name: 'secondary',
    surface: 'bg-[var(--palette-violet-900)]',
    border: 'border-[var(--palette-violet-800)]',
    ramp: [
      { label: 'subtle', class: 'bg-brand-secondary-subtle' },
      { label: 'edge', class: 'bg-brand-secondary-edge' },
      { label: 'solid', class: 'bg-brand-secondary-default' },
    ],
    ladder: [
      { name: 'sunk', class: 'shadow-secondary-sunk' },
      { name: 'half-sunk', class: 'shadow-secondary-half-sunk' },
      { name: 'default', class: 'shadow-default' },
      { name: 'half-pop', class: 'shadow-secondary-half-pop' },
      { name: 'pop', class: 'shadow-secondary-pop' },
    ],
  },
  {
    name: 'danger',
    surface: 'bg-[var(--palette-red-900)]',
    border: 'border-[var(--palette-red-800)]',
    ramp: [
      { label: 'subtle', class: 'bg-status-danger-bg' },
      { label: 'edge', class: 'bg-status-danger-edge' },
      { label: 'solid', class: 'bg-status-danger-solid' },
    ],
    ladder: [
      { name: 'sunk', class: 'shadow-danger-sunk' },
      { name: 'half-sunk', class: 'shadow-danger-half-sunk' },
      { name: 'default', class: 'shadow-default' },
      { name: 'half-pop', class: 'shadow-danger-half-pop' },
      { name: 'pop', class: 'shadow-danger-pop' },
    ],
  },
  {
    name: 'success',
    surface: 'bg-[var(--palette-green-900)]',
    border: 'border-[var(--palette-green-800)]',
    ramp: [
      { label: 'subtle', class: 'bg-status-success-bg' },
      { label: 'edge', class: 'bg-status-success-edge' },
      { label: 'solid', class: 'bg-status-success-solid' },
    ],
    ladder: [
      { name: 'sunk', class: 'shadow-success-sunk' },
      { name: 'half-sunk', class: 'shadow-success-half-sunk' },
      { name: 'default', class: 'shadow-default' },
      { name: 'half-pop', class: 'shadow-success-half-pop' },
      { name: 'pop', class: 'shadow-success-pop' },
    ],
  },
  {
    name: 'warning',
    surface: 'bg-[var(--palette-yellow-900)]',
    border: 'border-[var(--palette-yellow-800)]',
    ramp: [
      { label: 'subtle', class: 'bg-status-warning-bg' },
      { label: 'edge', class: 'bg-status-warning-edge' },
      { label: 'solid', class: 'bg-status-warning-solid' },
    ],
    ladder: [
      { name: 'sunk', class: 'shadow-warning-sunk' },
      { name: 'half-sunk', class: 'shadow-warning-half-sunk' },
      { name: 'default', class: 'shadow-default' },
      { name: 'half-pop', class: 'shadow-warning-half-pop' },
      { name: 'pop', class: 'shadow-warning-pop' },
    ],
  },
  {
    name: 'info',
    surface: 'bg-[var(--palette-cyan-900)]',
    border: 'border-[var(--palette-cyan-800)]',
    ramp: [
      { label: 'subtle', class: 'bg-status-info-bg' },
      { label: 'edge', class: 'bg-status-info-edge' },
      { label: 'solid', class: 'bg-status-info-solid' },
    ],
    ladder: [
      { name: 'sunk', class: 'shadow-info-sunk' },
      { name: 'half-sunk', class: 'shadow-info-half-sunk' },
      { name: 'default', class: 'shadow-default' },
      { name: 'half-pop', class: 'shadow-info-half-pop' },
      { name: 'pop', class: 'shadow-info-pop' },
    ],
  },
] as const

// Hover animations: a tile rests at one rung and transitions one level on hover.
// The lift row climbs (sunk->half-sunk, half-sunk->default, ...); the sink row
// drops (pop->half-pop, half-pop->default, ...). Two rules make the skeuomorphism
// read:
//   1. Surface is always bg-surface-default -- only the shadow changes.
//   2. Lifted rungs translate up by the shadow's drop distance, in lockstep with
//      the hard bottom-edge shadow. The translate consumes the generated
//      translate-y-lift-* utilities (from --spacing-lift-*, the spacing namespace
//      Tailwind translate reads), whose values equal the matching shadow's edge
//      height -- half-pop pairs with lift-half, pop with lift-full -- so the two
//      can never drift. The element rises while the shadow's outer edge stays pinned
//      to the baseline, so it extrudes from the plane instead of the plane falling away.
// Class strings are spelled out in full -- Tailwind only scans literals, so the
// `hover:` utilities must appear verbatim.
const lift = [
  {
    label: 'sunk -> half-sunk',
    class: 'shadow-sunk hover:shadow-half-sunk',
  },
  {
    label: 'half-sunk -> default',
    class: 'shadow-half-sunk hover:shadow-default',
  },
  {
    label: 'default -> half-pop',
    class: 'shadow-default hover:shadow-half-pop hover:-translate-y-lift-half',
  },
  {
    label: 'half-pop -> pop',
    class: 'shadow-half-pop -translate-y-lift-half hover:shadow-pop hover:-translate-y-lift-full',
  },
] as const

const sink = [
  {
    label: 'pop -> half-pop',
    class: 'shadow-pop -translate-y-lift-full hover:shadow-half-pop hover:-translate-y-lift-half',
  },
  {
    label: 'half-pop -> default',
    class: 'shadow-half-pop -translate-y-lift-half hover:shadow-default hover:translate-y-0',
  },
  {
    label: 'default -> half-sunk',
    class: 'shadow-default hover:shadow-half-sunk',
  },
  {
    label: 'half-sunk -> sunk',
    class: 'shadow-half-sunk hover:shadow-sunk',
  },
] as const

// Shared view fragments. Each block is authored once here and reused by both its
// standalone story and the Snapshot board, so the snapped image can never drift from
// the live story. Data lives module-level; each view pulls it in via setup.

// The shadow ladder: five tiles on the resting surface, each carrying one rung.
const ShadowLadderView = defineComponent({
  setup: () => ({ shadows }),
  template: `
    <div class="flex w-max items-end gap-6 text-fg-default">
      <div v-for="s in shadows" :key="s.name" class="flex flex-col items-center gap-3">
        <div class="grid h-24 w-32 place-items-center rounded-lg border border-border-default" :class="[s.shadow, s.surface]">
          <span class="font-mono text-sm">{{ s.name }}</span>
        </div>
        <span class="font-body text-fg-subtle text-xs">{{ s.note }}</span>
      </div>
    </div>
  `,
})

// The surface ramp: the three background planes side by side, each labelled.
const SurfaceRampView = defineComponent({
  setup: () => ({ surfaces }),
  template: `
    <div class="flex w-max gap-6 text-fg-default">
      <div v-for="s in surfaces" :key="s.name" class="flex flex-col items-center gap-3">
        <div class="grid h-24 w-32 place-items-center rounded-lg border border-border-default" :class="s.class">
          <span class="font-mono text-sm">{{ s.name }}</span>
        </div>
        <span class="font-body text-fg-subtle text-xs">{{ s.note }}</span>
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
              <div class="grid h-14 w-20 place-items-center rounded-md border" :class="[cw.surface, cw.border, r.class]">
                <span class="font-mono text-xs">{{ r.name }}</span>
              </div>
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

export const ShadowLadder: Story = {
  render: () => ({
    components: { ShadowLadderView },
    template: `<ShadowLadderView />`,
  }),
}

export const SurfaceRamp: Story = {
  render: () => ({
    components: { SurfaceRampView },
    template: `<SurfaceRampView />`,
  }),
}

// Hover each tile to play its elevation transition: the lift row rises one rung,
// the sink row drops one. Not snapped -- hover state can't be captured statically.
export const Animations: Story = {
  render: () => ({
    setup: () => ({ lift, sink }),
    template: `
      <div class="flex w-max flex-col gap-8 text-fg-default">
        <section class="flex flex-col gap-3">
          <h2 class="font-heading font-bold text-lg">Lift on hover</h2>
          <div class="flex w-max items-end gap-6">
            <div v-for="t in lift" :key="t.label" class="flex flex-col items-center gap-3">
              <div class="grid h-24 w-36 cursor-pointer place-items-center rounded-lg border border-border-default bg-surface-default transition-all duration-200 ease-out" :class="t.class">
                <span class="font-mono text-sm">{{ t.label }}</span>
              </div>
            </div>
          </div>
        </section>
        <section class="flex flex-col gap-3">
          <h2 class="font-heading font-bold text-lg">Sink on hover</h2>
          <div class="flex w-max items-end gap-6">
            <div v-for="t in sink" :key="t.label" class="flex flex-col items-center gap-3">
              <div class="grid h-24 w-36 cursor-pointer place-items-center rounded-lg border border-border-default bg-surface-default transition-all duration-200 ease-out" :class="t.class">
                <span class="font-mono text-sm">{{ t.label }}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    `,
  }),
}

// One row per semantic colourway: its surface ramp (subtle / edge / solid) beside
// its shadow ladder. Reads down the column to compare how each colourway lifts/sinks.
export const Semantics: Story = {
  render: () => ({
    components: { SemanticsView },
    template: `<SemanticsView />`,
  }),
}

// The visual board: the neutral ladder, the neutral ramp, then the per-colourway
// semantic rows on one screen -- each from the same shared view as its standalone
// story. This is the story the snapshot test snaps.
export const Snapshot: Story = {
  render: () => ({
    components: { ShadowLadderView, SurfaceRampView, SemanticsView },
    template: `
      <div class="flex w-max flex-col gap-8 bg-bg-default p-6 text-fg-default" data-testid="snap-board">
        <section class="flex flex-col gap-3">
          <h2 class="font-heading font-bold text-lg">Shadow ladder</h2>
          <ShadowLadderView />
        </section>
        <section class="flex flex-col gap-3">
          <h2 class="font-heading font-bold text-lg">Surface ramp</h2>
          <SurfaceRampView />
        </section>
        <section class="flex flex-col gap-3">
          <h2 class="font-heading font-bold text-lg">Semantics</h2>
          <SemanticsView />
        </section>
      </div>
    `,
  }),
}

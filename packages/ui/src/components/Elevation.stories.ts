import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { defineComponent } from 'vue'

// The elevation model has no component -- it's a token-layer foundation. These
// stories render the two families that compose skeuomorphic depth so they can be
// eyeballed and snapped: the shadow ladder and the surface ramp.

// The symmetric shadow ladder, hard-edged (no blur). Below flat = a solid
// inset band at the top recessing to the subtle tone (lower); above = a solid
// neutral-border block dropped below (higher). flat is the resting no-op rung. Each maps to a
// shadow-* utility off the token of the same name.
// surface is held constant at the resting plane (default) across all rungs so the
// ladder isolates the shadow variable -- you read the depth, not the plane colour.
// The 1:1 rung->surface pairing is shown separately in the surface ramp below.
// Neutral recesses use border-default (700) not border-subtle (800): subtle equals
// the surface-default plane these tiles sit on, so it reads invisible. 700 contrasts
// the 800 plane while staying lighter than the strong (600) edge on the lifts.
const shadows = [
  {
    name: 'lower',
    shadow: 'shadow-lower',
    surface: 'bg-surface-default',
    border: 'border-border-default',
  },
  {
    name: 'low',
    shadow: 'shadow-low',
    surface: 'bg-surface-default',
    border: 'border-border-default',
  },
  {
    name: 'flat',
    shadow: 'shadow-flat',
    surface: 'bg-surface-default',
    border: 'border-border-default',
  },
  {
    name: 'high',
    shadow: 'shadow-high',
    surface: 'bg-surface-strong',
    border: 'border-border-strong',
  },
  {
    name: 'higher',
    shadow: 'shadow-higher',
    surface: 'bg-surface-strong',
    border: 'border-border-strong',
  },
] as const

// The lifted rungs (high / higher) must translate up by their shadow's drop height
// so the shadow's bottom edge lands on the flat baseline, not below it -- otherwise a
// lifted tile reads as physically lower, not popped. Mirrors the Animations grid, where
// the resting lifts carry the same translate. Recesses and flat sit flush (no translate).
const liftFor = (name: string): string =>
  name === 'high' ? '-translate-y-lift-half' : name === 'higher' ? '-translate-y-lift-full' : ''

// The surface ramp: three planes the elevation rungs sit on. recesses use subtle
// (900), the resting rung flat (800), lifts strong (700). edge is NOT a plane --
// it's a separator added only when an elevated element's surface matches the flat
// ground it sits on (e.g. a default-plane element on a default-plane ground), so it
// doesn't belong in the ramp. Every colourway mirrors this three-plane shape.
const surfaces = [
  { name: 'subtle', class: 'bg-surface-subtle', note: '900 -- recessed plane' },
  { name: 'default', class: 'bg-surface-default', note: '800 -- resting plane' },
  { name: 'strong', class: 'bg-surface-strong', note: '700 -- lifted plane' },
] as const

// The semantic colourways mirror the neutral ladder rung-for-rung. The neutral
// ladder groups lower / low / flat onto ONE surface (default, 800) with ONE rim
// (border-default, 700), and lifts high / higher onto a brighter surface (strong,
// 700) with a brighter rim (border-strong, 600). Both rims are lighter than their
// fill -- a lit highlight, dimmer on the flat group, brighter on the lifts. The
// colour ladder carries that exact two-tier shape, hue-matched:
//   - lower / low / flat: the SHARED {c}.600 plane (surface-recess), the DIMMER
//     lit rim (border-default, {c}.500 -- one step lighter than the plane). lower /
//     low add their inset shadow; flat is the resting no-op.
//   - high / higher: the brighter solid fill ({c}.500, secondary .400), the
//     BRIGHTER lit rim (border-strong, {c}.400, secondary .300 -- one step lighter
//     than the solid), and the bright-edge lifting shadow.
// Border tiers and shadows are the per-colourway tokens; the {c}.600 shared plane
// is reached via the surface-recess token.
// Tailwind only scans literals -- every utility is spelled out in full below.
const colourways = [
  {
    name: 'primary',
    surface: 'bg-primary-default',
    ramp: [
      { label: 'subtle', class: 'bg-primary-surface-subtle' },
      { label: 'default', class: 'bg-primary-default' },
      { label: 'strong', class: 'bg-primary-surface-strong' },
    ],
    ladder: [
      {
        name: 'lower',
        class: 'shadow-primary-lower',
        surface: 'bg-primary-surface-recess',
        border: 'border-primary-border-default',
      },
      {
        name: 'low',
        class: 'shadow-primary-low',
        surface: 'bg-primary-surface-recess',
        border: 'border-primary-border-default',
      },
      {
        name: 'flat',
        class: 'shadow-flat',
        surface: 'bg-primary-surface-recess',
        border: 'border-primary-border-default',
      },
      {
        name: 'high',
        class: 'shadow-primary-high',
        border: 'border-primary-border-strong',
      },
      {
        name: 'higher',
        class: 'shadow-primary-higher',
        border: 'border-primary-border-strong',
      },
    ],
  },
  {
    name: 'secondary',
    surface: 'bg-secondary-default',
    ramp: [
      { label: 'subtle', class: 'bg-secondary-surface-subtle' },
      { label: 'default', class: 'bg-secondary-default' },
      { label: 'strong', class: 'bg-secondary-surface-strong' },
    ],
    ladder: [
      {
        name: 'lower',
        class: 'shadow-secondary-lower',
        surface: 'bg-secondary-surface-recess',
        border: 'border-secondary-border-default',
      },
      {
        name: 'low',
        class: 'shadow-secondary-low',
        surface: 'bg-secondary-surface-recess',
        border: 'border-secondary-border-default',
      },
      {
        name: 'flat',
        class: 'shadow-flat',
        surface: 'bg-secondary-surface-recess',
        border: 'border-secondary-border-default',
      },
      {
        name: 'high',
        class: 'shadow-secondary-high',
        border: 'border-secondary-border-strong',
      },
      {
        name: 'higher',
        class: 'shadow-secondary-higher',
        border: 'border-secondary-border-strong',
      },
    ],
  },
  {
    name: 'danger',
    surface: 'bg-danger-solid',
    ramp: [
      { label: 'subtle', class: 'bg-danger-surface-subtle' },
      { label: 'default', class: 'bg-danger-solid' },
      { label: 'strong', class: 'bg-danger-surface-strong' },
    ],
    ladder: [
      {
        name: 'lower',
        class: 'shadow-danger-lower',
        surface: 'bg-danger-surface-recess',
        border: 'border-danger-border-default',
      },
      {
        name: 'low',
        class: 'shadow-danger-low',
        surface: 'bg-danger-surface-recess',
        border: 'border-danger-border-default',
      },
      {
        name: 'flat',
        class: 'shadow-flat',
        surface: 'bg-danger-surface-recess',
        border: 'border-danger-border-default',
      },
      {
        name: 'high',
        class: 'shadow-danger-high',
        border: 'border-danger-border-strong',
      },
      {
        name: 'higher',
        class: 'shadow-danger-higher',
        border: 'border-danger-border-strong',
      },
    ],
  },
  {
    name: 'success',
    surface: 'bg-success-solid',
    ramp: [
      { label: 'subtle', class: 'bg-success-surface-subtle' },
      { label: 'default', class: 'bg-success-solid' },
      { label: 'strong', class: 'bg-success-surface-strong' },
    ],
    ladder: [
      {
        name: 'lower',
        class: 'shadow-success-lower',
        surface: 'bg-success-surface-recess',
        border: 'border-success-border-default',
      },
      {
        name: 'low',
        class: 'shadow-success-low',
        surface: 'bg-success-surface-recess',
        border: 'border-success-border-default',
      },
      {
        name: 'flat',
        class: 'shadow-flat',
        surface: 'bg-success-surface-recess',
        border: 'border-success-border-default',
      },
      {
        name: 'high',
        class: 'shadow-success-high',
        border: 'border-success-border-strong',
      },
      {
        name: 'higher',
        class: 'shadow-success-higher',
        border: 'border-success-border-strong',
      },
    ],
  },
  {
    name: 'warning',
    surface: 'bg-warning-solid',
    ramp: [
      { label: 'subtle', class: 'bg-warning-surface-subtle' },
      { label: 'default', class: 'bg-warning-solid' },
      { label: 'strong', class: 'bg-warning-surface-strong' },
    ],
    ladder: [
      {
        name: 'lower',
        class: 'shadow-warning-lower',
        surface: 'bg-warning-surface-recess',
        border: 'border-warning-border-default',
      },
      {
        name: 'low',
        class: 'shadow-warning-low',
        surface: 'bg-warning-surface-recess',
        border: 'border-warning-border-default',
      },
      {
        name: 'flat',
        class: 'shadow-flat',
        surface: 'bg-warning-surface-recess',
        border: 'border-warning-border-default',
      },
      {
        name: 'high',
        class: 'shadow-warning-high',
        border: 'border-warning-border-strong',
      },
      {
        name: 'higher',
        class: 'shadow-warning-higher',
        border: 'border-warning-border-strong',
      },
    ],
  },
  {
    name: 'info',
    surface: 'bg-info-solid',
    ramp: [
      { label: 'subtle', class: 'bg-info-surface-subtle' },
      { label: 'default', class: 'bg-info-solid' },
      { label: 'strong', class: 'bg-info-surface-strong' },
    ],
    ladder: [
      {
        name: 'lower',
        class: 'shadow-info-lower',
        surface: 'bg-info-surface-recess',
        border: 'border-info-border-default',
      },
      {
        name: 'low',
        class: 'shadow-info-low',
        surface: 'bg-info-surface-recess',
        border: 'border-info-border-default',
      },
      {
        name: 'flat',
        class: 'shadow-flat',
        surface: 'bg-info-surface-recess',
        border: 'border-info-border-default',
      },
      {
        name: 'high',
        class: 'shadow-info-high',
        border: 'border-info-border-strong',
      },
      { name: 'higher', class: 'shadow-info-higher', border: 'border-info-border-strong' },
    ],
  },
] as const

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

// Shared view fragments. Each block is authored once here and reused by both its
// standalone story and the Snapshot board, so the snapped image can never drift from
// the live story. Data lives module-level; each view pulls it in via setup.

// The neutral foundation, in the same row layout as the semantics: the surface
// ramp beside the shadow ladder. Borders are tiered by rung in every colourway:
// the recesses (lower / low) take a subtle border, the resting and lifted
// rungs (flat / high / higher) a strong one. The neutral lifts also climb the
// surface ramp -- high / higher sit on the strong plane (700).
const NeutralView = defineComponent({
  setup: () => ({ surfaces, shadows, liftFor }),
  template: `
    <div class="flex w-max flex-col gap-6 text-fg-default">
      <p class="max-w-prose font-body text-fg-muted text-sm">
        Borders are tiered by rung: the recesses and resting rung (lower / low /
        flat) take a lighter border, only the lifts (high / higher) a strong one --
        in each colourway's own border hue. The neutral lifts also rise up the surface
        ramp: high and higher sit on the strong plane (700).
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
              <div class="grid h-14 w-20 place-items-center rounded-md border" :class="[s.surface, s.border, s.shadow, liftFor(s.name)]">
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
  setup: () => ({ colourways, liftFor }),
  template: `
    <div class="flex w-max flex-col gap-6 text-fg-default">
      <p class="max-w-prose font-body text-fg-muted text-sm">
        Each colourway mirrors the neutral ladder, hue-matched: lower / low / flat share
        one plane and a dimmer lit rim; high / higher rise to the brighter solid fill and
        a brighter lit rim. Both rims sit one step lighter than their fill, exactly as the
        neutral row does. Rung names are read off the neutral row above; the columns align.
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
              <div class="grid h-14 w-20 place-items-center rounded-md border" :class="[r.surface || cw.surface, r.border, r.class, liftFor(r.name)]"></div>
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

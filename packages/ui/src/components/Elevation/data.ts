// The elevation model has no component -- it's a token-layer foundation. These
// stories render the two families that compose skeuomorphic depth so they can be
// eyeballed and snapped: the shadow ladder and the surface ramp. This module holds
// the shared data + accessor the views pull from.

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
export const shadows = [
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
export const liftFor = (name: string): string =>
  name === 'high' ? '-translate-y-lift-half' : name === 'higher' ? '-translate-y-lift-full' : ''

// The surface ramp: three planes the elevation rungs sit on. recesses use subtle
// (900), the resting rung flat (800), lifts strong (700). edge is NOT a plane --
// it's a separator added only when an elevated element's surface matches the flat
// ground it sits on (e.g. a default-plane element on a default-plane ground), so it
// doesn't belong in the ramp. Every colourway mirrors this three-plane shape.
export const surfaces = [
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
export const colourways = [
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

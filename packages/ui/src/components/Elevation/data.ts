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
export const colourwayNames = [
  'primary',
  'secondary',
  'danger',
  'success',
  'warning',
  'info',
] as const
export type ColourwayName = (typeof colourwayNames)[number]

// primary/secondary's resting fill is a `default` step; the four status colourways
// (danger/success/warning/info) use `solid` instead -- both name the same rung, the
// key just differs per token group.
const fillStep: Record<ColourwayName, 'default' | 'solid'> = {
  primary: 'default',
  secondary: 'default',
  danger: 'solid',
  success: 'solid',
  warning: 'solid',
  info: 'solid',
}

const colourway = (name: ColourwayName) => {
  const fill = `bg-${name}-${fillStep[name]}`
  const recess = `bg-${name}-surface-recess`
  const rim = `border-${name}-border-default`
  return {
    name,
    surface: fill,
    ramp: [
      { label: 'subtle', class: `bg-${name}-surface-subtle` },
      { label: 'default', class: fill },
      { label: 'strong', class: `bg-${name}-surface-strong` },
    ],
    ladder: [
      { name: 'lower', class: `shadow-${name}-lower`, surface: recess, border: rim },
      { name: 'low', class: `shadow-${name}-low`, surface: recess, border: rim },
      { name: 'flat', class: 'shadow-flat', surface: recess, border: rim },
      { name: 'high', class: `shadow-${name}-high`, border: `border-${name}-border-strong` },
      { name: 'higher', class: `shadow-${name}-higher`, border: `border-${name}-border-strong` },
    ],
  }
}

export const colourways = colourwayNames.map(colourway)

// Tailwind only scans literals in source text -- the template above builds classes
// via `${name}` interpolation, which it can't resolve. This block is never
// evaluated; it exists purely so every generated class also appears as a literal
// string for the scanner to pick up. Keep in sync with `colourway()` above.
// prettier-ignore
const _tailwindScanSafelist = [
  'bg-primary-surface-subtle', 'bg-primary-default', 'bg-primary-surface-strong', 'bg-primary-surface-recess', 'border-primary-border-default', 'border-primary-border-strong', 'shadow-primary-lower', 'shadow-primary-low', 'shadow-primary-high', 'shadow-primary-higher',
  'bg-secondary-surface-subtle', 'bg-secondary-default', 'bg-secondary-surface-strong', 'bg-secondary-surface-recess', 'border-secondary-border-default', 'border-secondary-border-strong', 'shadow-secondary-lower', 'shadow-secondary-low', 'shadow-secondary-high', 'shadow-secondary-higher',
  'bg-danger-surface-subtle', 'bg-danger-solid', 'bg-danger-surface-strong', 'bg-danger-surface-recess', 'border-danger-border-default', 'border-danger-border-strong', 'shadow-danger-lower', 'shadow-danger-low', 'shadow-danger-high', 'shadow-danger-higher',
  'bg-success-surface-subtle', 'bg-success-solid', 'bg-success-surface-strong', 'bg-success-surface-recess', 'border-success-border-default', 'border-success-border-strong', 'shadow-success-lower', 'shadow-success-low', 'shadow-success-high', 'shadow-success-higher',
  'bg-warning-surface-subtle', 'bg-warning-solid', 'bg-warning-surface-strong', 'bg-warning-surface-recess', 'border-warning-border-default', 'border-warning-border-strong', 'shadow-warning-lower', 'shadow-warning-low', 'shadow-warning-high', 'shadow-warning-higher',
  'bg-info-surface-subtle', 'bg-info-solid', 'bg-info-surface-strong', 'bg-info-surface-recess', 'border-info-border-default', 'border-info-border-strong', 'shadow-info-lower', 'shadow-info-low', 'shadow-info-high', 'shadow-info-higher',
]
void _tailwindScanSafelist

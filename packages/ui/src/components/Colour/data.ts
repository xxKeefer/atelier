import tokens from '@atelier/tokens'

// The palette is private to the token layer (src/test/no-palette-vars.test.ts)
// -- no --palette-* class exists. This story is the one legitimate exception:
// it reaches resolved hex values via @atelier/tokens' JS build and paints
// swatches with inline style, so no --palette- var ever appears in source.
export const shadeNames = Object.keys(
  tokens.palette.neutral,
) as (keyof typeof tokens.palette.neutral)[]

export const colourways = Object.entries(tokens.palette).map(([name, shades]) => ({
  name,
  shades: Object.entries(shades as Record<string, { $value: string }>).map(([shade, token]) => ({
    shade,
    value: token.$value,
  })),
}))

// The four semantic statuses share tier-2 tokens (color-semantic.json) with
// working Tailwind classes, unlike the palette primitives above -- no
// palette-var workaround needed. Every utility is spelled out per status (as
// in Elevation/data.ts) since Tailwind only scans literal class strings.
export const statusColumnLabels = [
  'bg',
  'solid',
  'surface-subtle',
  'surface-strong',
  'surface-recess',
  'border',
  'border-subtle',
  'border-default',
  'border-strong',
  'edge',
  'fg',
  'on-solid',
] as const

// Brand rows share statuses' tier-2 shape minus solid/bg/on-solid: brand's
// default fill IS the surface-default plane. Neutral has no `edge` token
// (edge is a lit fill's shadowed side, and neutral has no lit fill) -- that
// cell renders empty (kind: 'none'), a documented asymmetry, not a bug.
export const brandColumnLabels = [
  'surface-subtle',
  'surface-default',
  'surface-strong',
  'border-subtle',
  'border-default',
  'border-strong',
  'edge',
  'fg',
] as const

export const brands = [
  {
    name: 'primary',
    columns: [
      { label: 'surface-subtle', kind: 'fill', class: 'bg-primary-surface-subtle' },
      { label: 'surface-default', kind: 'fill', class: 'bg-primary-default' },
      { label: 'surface-strong', kind: 'fill', class: 'bg-primary-surface-strong' },
      { label: 'border-subtle', kind: 'border', class: 'border-primary-border-subtle' },
      { label: 'border-default', kind: 'border', class: 'border-primary-border-default' },
      { label: 'border-strong', kind: 'border', class: 'border-primary-border-strong' },
      { label: 'edge', kind: 'border', class: 'border-primary-edge' },
      { label: 'fg', kind: 'text', class: 'bg-primary-default text-primary-fg' },
    ],
  },
  {
    name: 'secondary',
    columns: [
      { label: 'surface-subtle', kind: 'fill', class: 'bg-secondary-surface-subtle' },
      { label: 'surface-default', kind: 'fill', class: 'bg-secondary-default' },
      { label: 'surface-strong', kind: 'fill', class: 'bg-secondary-surface-strong' },
      { label: 'border-subtle', kind: 'border', class: 'border-secondary-border-subtle' },
      { label: 'border-default', kind: 'border', class: 'border-secondary-border-default' },
      { label: 'border-strong', kind: 'border', class: 'border-secondary-border-strong' },
      { label: 'edge', kind: 'border', class: 'border-secondary-edge' },
      { label: 'fg', kind: 'text', class: 'bg-secondary-default text-secondary-fg' },
    ],
  },
  {
    name: 'neutral',
    columns: [
      { label: 'surface-subtle', kind: 'fill', class: 'bg-surface-subtle' },
      { label: 'surface-default', kind: 'fill', class: 'bg-surface-default' },
      { label: 'surface-strong', kind: 'fill', class: 'bg-surface-strong' },
      { label: 'border-subtle', kind: 'border', class: 'border-border-subtle' },
      { label: 'border-default', kind: 'border', class: 'border-border-default' },
      { label: 'border-strong', kind: 'border', class: 'border-border-strong' },
      { label: 'edge', kind: 'none', class: null },
      { label: 'fg', kind: 'text', class: 'text-fg-default' },
    ],
  },
] as const

// Icon/text usage examples: an icon and a text sample coloured to match, laid over
// the surface they're meant to sit on. Reuses only the fg/on-solid pairings already
// validated by src/test/contrast.test.ts in Status/Brand above -- e.g. brand rows
// stop at their `default` fill + `fg`, since surface-subtle/strong + fg was never
// contrast-checked there.
export const iconsAndText = [
  { name: 'neutral surface-subtle', bg: 'bg-surface-subtle', tone: 'text-fg-default' },
  { name: 'neutral surface-default', bg: 'bg-surface-default', tone: 'text-fg-default' },
  { name: 'neutral surface-strong', bg: 'bg-surface-strong', tone: 'text-fg-default' },
  { name: 'danger bg', bg: 'bg-danger-bg', tone: 'text-danger-fg' },
  { name: 'danger solid', bg: 'bg-danger-solid', tone: 'text-danger-on-solid' },
  { name: 'success bg', bg: 'bg-success-bg', tone: 'text-success-fg' },
  { name: 'success solid', bg: 'bg-success-solid', tone: 'text-success-on-solid' },
  { name: 'warning bg', bg: 'bg-warning-bg', tone: 'text-warning-fg' },
  { name: 'warning solid', bg: 'bg-warning-solid', tone: 'text-warning-on-solid' },
  { name: 'info bg', bg: 'bg-info-bg', tone: 'text-info-fg' },
  { name: 'info solid', bg: 'bg-info-solid', tone: 'text-info-on-solid' },
  { name: 'primary default', bg: 'bg-primary-default', tone: 'text-primary-fg' },
  { name: 'secondary default', bg: 'bg-secondary-default', tone: 'text-secondary-fg' },
] as const

export const statuses = [
  {
    name: 'danger',
    columns: [
      { label: 'bg', kind: 'fill', class: 'bg-danger-bg' },
      { label: 'solid', kind: 'fill', class: 'bg-danger-solid' },
      { label: 'surface-subtle', kind: 'fill', class: 'bg-danger-surface-subtle' },
      { label: 'surface-strong', kind: 'fill', class: 'bg-danger-surface-strong' },
      { label: 'surface-recess', kind: 'fill', class: 'bg-danger-surface-recess' },
      { label: 'border', kind: 'border', class: 'border-danger-border' },
      { label: 'border-subtle', kind: 'border', class: 'border-danger-border-subtle' },
      { label: 'border-default', kind: 'border', class: 'border-danger-border-default' },
      { label: 'border-strong', kind: 'border', class: 'border-danger-border-strong' },
      { label: 'edge', kind: 'border', class: 'border-danger-edge' },
      { label: 'fg', kind: 'text', class: 'text-danger-fg' },
      { label: 'on-solid', kind: 'text', class: 'bg-danger-solid text-danger-on-solid' },
    ],
  },
  {
    name: 'success',
    columns: [
      { label: 'bg', kind: 'fill', class: 'bg-success-bg' },
      { label: 'solid', kind: 'fill', class: 'bg-success-solid' },
      { label: 'surface-subtle', kind: 'fill', class: 'bg-success-surface-subtle' },
      { label: 'surface-strong', kind: 'fill', class: 'bg-success-surface-strong' },
      { label: 'surface-recess', kind: 'fill', class: 'bg-success-surface-recess' },
      { label: 'border', kind: 'border', class: 'border-success-border' },
      { label: 'border-subtle', kind: 'border', class: 'border-success-border-subtle' },
      { label: 'border-default', kind: 'border', class: 'border-success-border-default' },
      { label: 'border-strong', kind: 'border', class: 'border-success-border-strong' },
      { label: 'edge', kind: 'border', class: 'border-success-edge' },
      { label: 'fg', kind: 'text', class: 'text-success-fg' },
      { label: 'on-solid', kind: 'text', class: 'bg-success-solid text-success-on-solid' },
    ],
  },
  {
    name: 'warning',
    columns: [
      { label: 'bg', kind: 'fill', class: 'bg-warning-bg' },
      { label: 'solid', kind: 'fill', class: 'bg-warning-solid' },
      { label: 'surface-subtle', kind: 'fill', class: 'bg-warning-surface-subtle' },
      { label: 'surface-strong', kind: 'fill', class: 'bg-warning-surface-strong' },
      { label: 'surface-recess', kind: 'fill', class: 'bg-warning-surface-recess' },
      { label: 'border', kind: 'border', class: 'border-warning-border' },
      { label: 'border-subtle', kind: 'border', class: 'border-warning-border-subtle' },
      { label: 'border-default', kind: 'border', class: 'border-warning-border-default' },
      { label: 'border-strong', kind: 'border', class: 'border-warning-border-strong' },
      { label: 'edge', kind: 'border', class: 'border-warning-edge' },
      { label: 'fg', kind: 'text', class: 'text-warning-fg' },
      { label: 'on-solid', kind: 'text', class: 'bg-warning-solid text-warning-on-solid' },
    ],
  },
  {
    name: 'info',
    columns: [
      { label: 'bg', kind: 'fill', class: 'bg-info-bg' },
      { label: 'solid', kind: 'fill', class: 'bg-info-solid' },
      { label: 'surface-subtle', kind: 'fill', class: 'bg-info-surface-subtle' },
      { label: 'surface-strong', kind: 'fill', class: 'bg-info-surface-strong' },
      { label: 'surface-recess', kind: 'fill', class: 'bg-info-surface-recess' },
      { label: 'border', kind: 'border', class: 'border-info-border' },
      { label: 'border-subtle', kind: 'border', class: 'border-info-border-subtle' },
      { label: 'border-default', kind: 'border', class: 'border-info-border-default' },
      { label: 'border-strong', kind: 'border', class: 'border-info-border-strong' },
      { label: 'edge', kind: 'border', class: 'border-info-edge' },
      { label: 'fg', kind: 'text', class: 'text-info-fg' },
      { label: 'on-solid', kind: 'text', class: 'bg-info-solid text-info-on-solid' },
    ],
  },
] as const

import tokens from '@atelier/tokens'

// The palette is private to the token layer -- components/stories may not consume
// --palette-* CSS vars (see src/test/no-palette-vars.test.ts), and Tailwind only
// generates utilities off the --color-* namespace, so no bg-palette-* class exists
// either. This story is the one legitimate exception: it exists to show the raw
// palette itself. It reaches the resolved hex values through @atelier/tokens' JS
// build instead of the CSS layer, and paints swatches via inline style -- so no
// --palette- var reference (class, arbitrary value, or var()) ever appears in source.
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

// The four semantic statuses, each carrying the same fixed set of tier-2 tokens
// (see packages/tokens/src/color-semantic.json). Unlike the palette primitives above,
// these already have working Tailwind classes off --color-{status}-{key} -- no
// palette-var workaround needed, swatches use real utility classes.
//
// Tailwind only scans literal class strings, so (as in Elevation/data.ts) every
// utility below is spelled out in full per status rather than built from a template.
// bg/solid/surface-* are fills; border/border-* + edge are rims (rendered as
// outline-only swatches); fg/on-solid are text colours (rendered as sample text,
// not a swatch).
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

// The three brand rows: primary and secondary carry the same tier-2 shape as the
// statuses above (surface ramp + border tiers + edge + fg), minus a `solid`/`bg`/
// `on-solid` split -- brand's `default` fill IS the surface-default plane, there's
// no separate solid/bg distinction. Neutral has no such `color.neutral` object in
// color-semantic.json -- its equivalent keys are spread across the top-level
// `color.bg`/`color.surface`/`color.border`/`color.fg` groups, and it has no `edge`
// token at all (edge is "skeuomorphic shadowed side of a lit fill" -- neutral has no
// lit fill to shadow). That cell renders empty (kind: 'none') rather than faking a
// substitute -- a documented asymmetry, not a bug.
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

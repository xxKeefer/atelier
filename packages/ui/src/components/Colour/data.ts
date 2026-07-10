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

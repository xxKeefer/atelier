import tokens from '@atelier/tokens'

export interface ColorTokenEntry {
  /** Dot path within color-semantic.json, e.g. "primary.hover". */
  path: string
  /** Top-level family, e.g. "primary". Used to group controls. */
  family: string
  /** CSS custom property this token compiles to, e.g. "--color-primary-hover". */
  cssVar: string
  /** Resolved value from the token build (aliases already flattened). */
  value: string
  description?: string
}

// input[type=color] only accepts 6-digit hex -- color.bg.scrim resolves to an
// 8-digit hex with alpha (#0a0a0fcc), the one non-opaque token in this family.
// Swatch/picker use the opaque prefix; the real value stays in `value` for display.
const HEX_RE = /^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/

export function toPickerHex(value: string): string {
  return HEX_RE.test(value) ? value.slice(0, 7) : '#000000'
}

interface RawToken {
  $value?: unknown
  $description?: string
  path?: string[]
  [key: string]: unknown
}

type RawTokenNode = RawToken | null

function isLeaf(node: RawToken): node is RawToken & { $value: string; path: string[] } {
  return typeof node.$value === 'string' && Array.isArray(node.path)
}

function flatten(node: Record<string, RawTokenNode>, family: string): ColorTokenEntry[] {
  const entries: ColorTokenEntry[] = []
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('$') || value === null || typeof value !== 'object') continue
    if (isLeaf(value)) {
      entries.push({
        path: value.path.slice(1).join('.'),
        family,
        cssVar: `--${value.path.join('-')}`,
        value: value.$value,
        description: value.$description,
      })
    } else {
      entries.push(...flatten(value as Record<string, RawTokenNode>, family))
    }
  }
  return entries
}

/** Every leaf color-semantic token, flattened for one-control-per-token generation. */
export const colorTokenEntries: ColorTokenEntry[] = Object.entries(tokens.color)
  .filter(([key]) => !key.startsWith('$'))
  .flatMap(([family, node]) => flatten(node as Record<string, RawTokenNode>, family))

/** colorTokenEntries grouped by top-level family, in source order. */
export const colorTokenFamilies: { family: string; entries: ColorTokenEntry[] }[] = Object.entries(
  tokens.color,
)
  .filter(([key]) => !key.startsWith('$'))
  .map(([family]) => ({
    family,
    entries: colorTokenEntries.filter((entry) => entry.family === family),
  }))

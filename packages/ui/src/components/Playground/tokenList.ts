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

// input[type=color] can only ever emit an opaque 6-digit hex, so writing its
// value straight back into the override map would silently drop alpha on the
// one token that has it. Re-append the original value's alpha byte (if any)
// so editing color.bg.scrim's RGB doesn't also flatten it to fully opaque.
export function withPreservedAlpha(originalValue: string, pickerValue: string): string {
  const alpha =
    HEX_RE.test(originalValue) && originalValue.length === 9 ? originalValue.slice(7) : ''
  return pickerValue + alpha
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

// Family-level $description isn't carried on ColorTokenEntry (it's a group
// property, not a leaf one) -- color-semantic.json only sets it on the
// top-level "color" node and the "surface" family, so a small literal lookup
// beats threading a new field through flatten() for two values.
const FAMILY_DESCRIPTIONS: Record<string, string> = {
  surface: 'Element surface ramp: the three planes the elevation ladder draws from.',
}

const ROOT_DESCRIPTION =
  'Tier-2 semantic roles, dark-first; all values reference the tier-1 palette.'

interface DtcgLeaf {
  $value: string
  $description?: string
}
interface DtcgNode {
  $description?: string
  [key: string]: DtcgLeaf | DtcgNode | string | undefined
}

/**
 * Inverse of flatten(): rebuilds color-semantic.json's nested DTCG shape from
 * the playground's flat cssVar -> value override map. Overrides are already
 * fully-resolved values (no aliases), so exported leaves carry literal colors
 * rather than the source file's `{palette.*}` alias strings -- expected, not
 * a bug, since resolving back to an alias isn't reversible in general.
 */
export function buildColorSemanticJson(
  overrides: Record<string, string>,
  entries: ColorTokenEntry[] = colorTokenEntries,
): { $schema: string; color: DtcgNode } {
  const color: DtcgNode = { $type: 'color', $description: ROOT_DESCRIPTION }

  for (const entry of entries) {
    if (!(entry.family in color)) {
      const familyNode: DtcgNode = {}
      if (FAMILY_DESCRIPTIONS[entry.family])
        familyNode.$description = FAMILY_DESCRIPTIONS[entry.family]
      color[entry.family] = familyNode
    }
    const familyNode = color[entry.family] as DtcgNode

    // entry.path is the dot path from the family down (e.g. "primary.hover",
    // "surface.subtle") -- its first segment is always the family name itself,
    // already used as the outer key, so drop it before walking the rest.
    const segments = entry.path.split('.').slice(1)
    const leafKey = segments.at(-1) ?? entry.path
    let node = familyNode
    for (const segment of segments.slice(0, -1)) {
      if (!(segment in node)) node[segment] = {}
      node = node[segment] as DtcgNode
    }

    const leaf: DtcgLeaf = { $value: overrides[entry.cssVar] ?? entry.value }
    if (entry.description) leaf.$description = entry.description
    node[leafKey] = leaf
  }

  return { $schema: 'https://tr.designtokens.org/format/', color }
}

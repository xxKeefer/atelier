import tokens from '@atelier/tokens'
import colorSemanticSource from '../../../../tokens/src/color-semantic.json'
import paletteRawSource from '../../../../tokens/src/palette.json'

export interface PaletteStepEntry {
  family: string
  step: string
  cssVar: string
  value: string
}

export const paletteStepEntries: PaletteStepEntry[] = Object.entries(tokens.palette).flatMap(
  ([family, steps]) =>
    Object.entries(steps as Record<string, { $value: string }>).map(([step, token]) => ({
      family,
      step,
      cssVar: `--palette-${family}-${step}`,
      value: token.$value,
    })),
)

export const paletteFamilies: { family: string; entries: PaletteStepEntry[] }[] = Object.keys(
  tokens.palette,
).map((family) => ({
  family,
  entries: paletteStepEntries.filter((entry) => entry.family === family),
}))

interface RawSemanticNode {
  $value?: unknown
  path?: string[]
  [key: string]: unknown
}

const ALIAS_RE = /^\{palette\.(\w+)\.(\d+)\}$/

// Every color-semantic.json leaf aliases exactly one palette step (no
// composition/math in the source) -- so a palette step's cssVar maps to the
// set of --color-* cssVars that go stale when that step's hex changes.
function collectAliases(
  node: Record<string, RawSemanticNode | string | undefined>,
  segments: string[],
  map: Map<string, string[]>,
) {
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('$') || typeof value !== 'object') continue
    const path = [...segments, key]
    if (typeof value.$value === 'string') {
      const match = ALIAS_RE.exec(value.$value)
      const [, aliasFamily, aliasStep] = match ?? []
      if (aliasFamily && aliasStep) {
        const paletteCssVar = `--palette-${aliasFamily}-${aliasStep}`
        const colorCssVar = `--color-${path.join('-')}`
        const existing = map.get(paletteCssVar)
        if (existing) existing.push(colorCssVar)
        else map.set(paletteCssVar, [colorCssVar])
      }
    } else {
      collectAliases(value as Record<string, RawSemanticNode | string | undefined>, path, map)
    }
  }
}

/** paletteCssVar (e.g. "--palette-magenta-500") -> every --color-* cssVar aliasing it. */
export const paletteAliasMap: Record<string, string[]> = (() => {
  const map = new Map<string, string[]>()
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion -- vue-tsc sees the JSON import's literal $type/$description string fields and needs the unknown hop; eslint's isolated type info does not.
  collectAliases(colorSemanticSource.color as unknown as Record<string, RawSemanticNode>, [], map)
  return Object.fromEntries(map)
})()

interface DtcgLeaf {
  $value: string
}
interface DtcgFamilyNode {
  $type: 'color'
  $description?: string
  [step: string]: DtcgLeaf | string | undefined
}

/**
 * Inverse of the flatten() that produces paletteStepEntries: rebuilds
 * palette.json's DTCG shape (family -> numeric step -> { $value }) from the
 * playground's flat cssVar -> hex override map. Flatter than
 * buildColorSemanticJson's target shape -- no dot-path walking, a family
 * node's children are always leaves. Family $description strings are read
 * from the raw source (paletteRawSource, imported above) rather than a
 * literal lookup table, same reasoning as paletteAliasMap: they can't drift
 * out of sync with the real file.
 */
export function buildPaletteJson(
  overrides: Record<string, string>,
  entries: PaletteStepEntry[] = paletteStepEntries,
): { $schema: string; $description: string; palette: Record<string, DtcgFamilyNode> } {
  const palette: Record<string, DtcgFamilyNode> = {}

  for (const entry of entries) {
    let familyNode = palette[entry.family]
    if (!familyNode) {
      const sourceFamily = (paletteRawSource.palette as Record<string, { $description?: string }>)[
        entry.family
      ]
      familyNode = { $type: 'color', $description: sourceFamily?.$description }
      palette[entry.family] = familyNode
    }
    familyNode[entry.step] = { $value: overrides[entry.cssVar] ?? entry.value }
  }

  return {
    $schema: paletteRawSource.$schema,
    $description: paletteRawSource.$description,
    palette,
  }
}

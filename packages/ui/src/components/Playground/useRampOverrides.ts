import { reactive } from 'vue'
import { hexToOklch, oklchToHex } from './colorSpace'
import { paletteAliasMap, paletteFamilies, type PaletteStepEntry } from './paletteList'
import { colorTokenEntries } from './tokenList'
import { useTokenOverrides } from './useTokenOverrides'

export interface RampTransform {
  lightness: number // additive offset applied to each step's OKLCH L, e.g. +0.05
  chroma: number // multiplicative scale applied to each step's OKLCH C, 1 = unchanged
  hue: number // additive offset applied to each step's OKLCH H, wraps 0-360
}

const IDENTITY: RampTransform = { lightness: 0, chroma: 1, hue: 0 }

function applyTransform(baseHex: string, transform: RampTransform): string {
  const { l, c, h } = hexToOklch(baseHex)
  const hue = Number.isNaN(h) ? 0 : h
  return oklchToHex({
    l: Math.max(0, Math.min(1, l + transform.lightness)),
    c: Math.max(0, c * transform.chroma),
    h: (((hue + transform.hue) % 360) + 360) % 360,
  })
}

// Ramp-level palette editing (lightness/chroma/hue-shift per hue family) layered
// on top of phase 1's token overrides. A family's 11 steps are recomputed from
// palette.json's original hex each time its transform changes -- never from the
// previous output -- so sliders stay reversible and don't compound rounding
// error from the hex<->OKLCH round trip on every drag.
export function useRampOverrides() {
  const tokenOverrides = useTokenOverrides()

  const transforms = reactive<Record<string, RampTransform>>(
    Object.fromEntries(paletteFamilies.map((f) => [f.family, { ...IDENTITY }])),
  )

  const paletteOverrides = reactive<Record<string, string>>(
    Object.fromEntries(paletteFamilies.flatMap((f) => f.entries).map((e) => [e.cssVar, e.value])),
  )

  function stepsFor(family: string): PaletteStepEntry[] {
    return paletteFamilies.find((f) => f.family === family)?.entries ?? []
  }

  function applyFamily(family: string) {
    const transform = transforms[family] ?? IDENTITY
    for (const step of stepsFor(family)) {
      const nextHex = applyTransform(step.value, transform)
      paletteOverrides[step.cssVar] = nextHex

      const aliasedColorVars = paletteAliasMap[step.cssVar] ?? []
      for (const colorCssVar of aliasedColorVars) {
        tokenOverrides.overrides[colorCssVar] = nextHex
      }
    }
  }

  function setTransform(family: string, patch: Partial<RampTransform>) {
    transforms[family] = { ...(transforms[family] ?? IDENTITY), ...patch }
    applyFamily(family)
  }

  function resetFamily(family: string) {
    transforms[family] = { ...IDENTITY }
    for (const step of stepsFor(family)) {
      paletteOverrides[step.cssVar] = step.value
      const aliasedColorVars = paletteAliasMap[step.cssVar] ?? []
      for (const colorCssVar of aliasedColorVars) {
        const original = colorTokenEntries.find((e) => e.cssVar === colorCssVar)?.value
        if (original !== undefined) tokenOverrides.overrides[colorCssVar] = original
      }
    }
  }

  return {
    transforms,
    paletteOverrides,
    colorOverrides: tokenOverrides.overrides,
    setFromPicker: tokenOverrides.setFromPicker,
    setTransform,
    resetFamily,
  }
}

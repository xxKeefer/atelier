import { expect, test } from 'vitest'
import paletteRawSource from '../../../../tokens/src/palette.json'
import {
  buildPaletteJson,
  paletteAliasMap,
  paletteFamilies,
  paletteStepEntries,
} from './paletteList'

test('flattens every palette.json step across all families', () => {
  expect(paletteStepEntries.length).toBe(7 * 11) // 7 hues, 11 steps each
  for (const entry of paletteStepEntries) {
    expect(entry.cssVar).toBe(`--palette-${entry.family}-${entry.step}`)
    expect(entry.value).toMatch(/^#[0-9a-fA-F]{6}$/)
  }
})

test('groups palette entries by family with none dropped', () => {
  const total = paletteFamilies.reduce((sum, group) => sum + group.entries.length, 0)
  expect(total).toBe(paletteStepEntries.length)
  expect(paletteFamilies.map((f) => f.family).sort()).toEqual(
    ['neutral', 'magenta', 'violet', 'red', 'green', 'yellow', 'cyan'].sort(),
  )
})

test('maps a palette step to every semantic token aliasing it', () => {
  // primary.default, primary.border-default, and secondary.text? -- verify
  // the known magenta.500 aliases from color-semantic.json's source.
  const aliases = paletteAliasMap['--palette-magenta-500']
  expect(aliases).toBeDefined()
  expect(aliases).toContain('--color-border-focus')
  expect(aliases).toContain('--color-primary-default')
  expect(aliases).toContain('--color-primary-border-default')
})

test('every alias target is a real cssVar with the --color- prefix', () => {
  for (const targets of Object.values(paletteAliasMap)) {
    for (const cssVar of targets) expect(cssVar).toMatch(/^--color-/)
  }
})

test('every alias source key is a real --palette- cssVar', () => {
  const validKeys = new Set(paletteStepEntries.map((e) => e.cssVar))
  for (const key of Object.keys(paletteAliasMap)) expect(validKeys.has(key)).toBe(true)
})

test('buildPaletteJson reconstructs palette.json exactly from identity overrides', () => {
  const overrides = Object.fromEntries(paletteStepEntries.map((e) => [e.cssVar, e.value]))
  const result = buildPaletteJson(overrides)
  expect(result).toEqual(paletteRawSource)
})

test('buildPaletteJson reflects overridden values, not the originals', () => {
  const overrides = Object.fromEntries(paletteStepEntries.map((e) => [e.cssVar, e.value]))
  overrides['--palette-magenta-500'] = '#abcdef'
  const result = buildPaletteJson(overrides)
  const magenta = result.palette.magenta
  if (!magenta) throw new Error('expected magenta family in result')
  expect(magenta['500']).toEqual({ $value: '#abcdef' })
  // untouched steps/families are unaffected
  expect(magenta['600']).toEqual({ $value: overrides['--palette-magenta-600'] })
  expect(result.palette.neutral?.$description).toBe(paletteRawSource.palette.neutral.$description)
})

test('buildPaletteJson emits every family and every step, no drops', () => {
  const overrides = Object.fromEntries(paletteStepEntries.map((e) => [e.cssVar, e.value]))
  const result = buildPaletteJson(overrides)
  expect(Object.keys(result.palette).sort()).toEqual(paletteFamilies.map((f) => f.family).sort())

  let stepCount = 0
  for (const family of Object.values(result.palette)) {
    for (const key of Object.keys(family)) {
      if (!key.startsWith('$')) stepCount++
    }
  }
  expect(stepCount).toBe(paletteStepEntries.length)
})

test('buildPaletteJson output round-trips through JSON.stringify/parse', () => {
  const overrides = Object.fromEntries(paletteStepEntries.map((e) => [e.cssVar, e.value]))
  const result = buildPaletteJson(overrides)
  const parsed = JSON.parse(JSON.stringify(result))
  expect(parsed).toEqual(result)
})

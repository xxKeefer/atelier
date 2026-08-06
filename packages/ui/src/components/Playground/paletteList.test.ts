import { expect, test } from 'vitest'
import { paletteAliasMap, paletteFamilies, paletteStepEntries } from './paletteList'

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

import { expect, test } from 'vitest'
import {
  buildColorSemanticJson,
  colorTokenEntries,
  colorTokenFamilies,
  type ColorTokenEntry,
  toPickerHex,
  withPreservedAlpha,
} from './tokenList'

function findEntry(cssVar: string): ColorTokenEntry {
  const entry = colorTokenEntries.find((e) => e.cssVar === cssVar)
  if (!entry) throw new Error(`no colorTokenEntries entry for ${cssVar}`)
  return entry
}

test('flattens every color-semantic.json leaf token', () => {
  expect(colorTokenEntries.length).toBeGreaterThan(50)
  for (const entry of colorTokenEntries) {
    expect(entry.cssVar).toMatch(/^--color-/)
    expect(entry.value).toMatch(/^#[0-9a-fA-F]{6,8}$|^rgba?\(/)
    expect(entry.path.length).toBeGreaterThan(0)
  }
})

test('groups entries by top-level family with none dropped', () => {
  const total = colorTokenFamilies.reduce((sum, group) => sum + group.entries.length, 0)
  expect(total).toBe(colorTokenEntries.length)
  for (const group of colorTokenFamilies) {
    expect(group.entries.length).toBeGreaterThan(0)
    for (const entry of group.entries) expect(entry.family).toBe(group.family)
  }
})

test('picker hex is always a valid 6-digit color, even for alpha values', () => {
  expect(toPickerHex('#0a0a0fcc')).toBe('#0a0a0f')
  expect(toPickerHex('#ff2e97')).toBe('#ff2e97')
  expect(toPickerHex('rgba(10, 10, 15, 0.8)')).toBe('#000000')
})

test('preserves the original alpha byte on write-back from an opaque picker value', () => {
  expect(withPreservedAlpha('#0a0a0fcc', '#123456')).toBe('#123456cc')
  expect(withPreservedAlpha('#ff2e97', '#123456')).toBe('#123456')
})

test('buildColorSemanticJson reconstructs the source DTCG shape from a flat override map', () => {
  const overrides = Object.fromEntries(colorTokenEntries.map((e) => [e.cssVar, e.value]))
  const result = buildColorSemanticJson(overrides)

  expect(result.$schema).toBe('https://tr.designtokens.org/format/')
  expect(result.color.$type).toBe('color')
  expect(result.color.$description).toMatch(/Tier-2 semantic roles/)

  // shallow leaf, no description in source
  const primaryHover = findEntry('--color-primary-hover')
  const primaryNode = result.color.primary as Record<string, { $value: string }>
  expect(primaryNode.hover).toEqual({ $value: primaryHover.value })

  // nested leaf with a description, under a family that itself has $description
  const surfaceSubtle = findEntry('--color-surface-subtle')
  expect((result.color.surface as Record<string, unknown>).$description).toMatch(/surface ramp/)
  expect((result.color.surface as Record<string, unknown>).subtle).toEqual({
    $value: surfaceSubtle.value,
    $description: surfaceSubtle.description,
  })

  // a family with no $description of its own
  expect((result.color.link as Record<string, unknown>).$description).toBeUndefined()
})

test('buildColorSemanticJson reflects overridden values, not the originals', () => {
  const overrides = Object.fromEntries(colorTokenEntries.map((e) => [e.cssVar, e.value]))
  overrides['--color-primary-hover'] = '#abcdef'
  const result = buildColorSemanticJson(overrides)
  expect((result.color.primary as Record<string, unknown>).hover).toEqual({ $value: '#abcdef' })
})

test('buildColorSemanticJson emits every family and every leaf, no drops', () => {
  const overrides = Object.fromEntries(colorTokenEntries.map((e) => [e.cssVar, e.value]))
  const result = buildColorSemanticJson(overrides)
  const families = Object.keys(result.color).filter((k) => !k.startsWith('$'))
  expect(families.sort()).toEqual(colorTokenFamilies.map((f) => f.family).sort())

  let leafCount = 0
  const countLeaves = (node: Record<string, unknown>) => {
    for (const [key, value] of Object.entries(node)) {
      if (key.startsWith('$') || typeof value !== 'object' || value === null) continue
      if ('$value' in value) leafCount++
      else countLeaves(value as Record<string, unknown>)
    }
  }
  countLeaves(result.color)
  expect(leafCount).toBe(colorTokenEntries.length)
})

test('buildColorSemanticJson output round-trips through JSON.stringify/parse', () => {
  const overrides = Object.fromEntries(colorTokenEntries.map((e) => [e.cssVar, e.value]))
  const result = buildColorSemanticJson(overrides)
  expect(() => JSON.parse(JSON.stringify(result))).not.toThrow()
  const parsed = JSON.parse(JSON.stringify(result))
  expect(parsed).toEqual(result)
})

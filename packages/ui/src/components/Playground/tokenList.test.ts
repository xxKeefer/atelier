import { expect, test } from 'vitest'
import { colorTokenEntries, colorTokenFamilies, toPickerHex, withPreservedAlpha } from './tokenList'

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

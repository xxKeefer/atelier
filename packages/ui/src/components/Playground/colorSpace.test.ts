import { expect, test } from 'vitest'
import { hexToOklch, oklchToHex } from './colorSpace'

test('hexToOklch parses lightness, chroma, hue from a chromatic hex', () => {
  const { l, c, h } = hexToOklch('#ff2e97')
  expect(l).toBeGreaterThan(0)
  expect(l).toBeLessThan(1)
  expect(c).toBeGreaterThan(0)
  expect(h).toBeGreaterThanOrEqual(0)
  expect(h).toBeLessThan(360)
})

test('hexToOklch on a neutral hex yields near-zero chroma', () => {
  const { c } = hexToOklch('#808080')
  expect(c).toBeLessThan(0.01)
})

test('oklchToHex round-trips a palette hex within +/-1 per channel', () => {
  const original = '#ff2e97'
  const roundTripped = oklchToHex(hexToOklch(original))
  const toRgb = (hex: string) =>
    [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as [number, number, number]
  const [r1, g1, b1] = toRgb(original)
  const [r2, g2, b2] = toRgb(roundTripped)
  expect(Math.abs(r1 - r2)).toBeLessThanOrEqual(1)
  expect(Math.abs(g1 - g2)).toBeLessThanOrEqual(1)
  expect(Math.abs(b1 - b2)).toBeLessThanOrEqual(1)
})

test('oklchToHex clamps out-of-gamut values to a valid 6-digit hex', () => {
  const hex = oklchToHex({ l: 0.7, c: 0.5, h: 30 })
  expect(hex).toMatch(/^#[0-9a-f]{6}$/)
})

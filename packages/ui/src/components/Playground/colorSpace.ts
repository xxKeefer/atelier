// No color-math dependency in the repo (see packages/tokens, packages/ui
// package.json) -- Chromium natively parses/serializes oklch() (CSS Color 4),
// so a detached element's computed style round-trips hex <-> OKLCH without
// pulling in culori or similar. Requires a real browser (vitest "visual"
// project / Storybook), not jsdom.
let probeEl: HTMLDivElement | null = null

function probe(): HTMLDivElement {
  if (!probeEl) {
    probeEl = document.createElement('div')
    probeEl.style.display = 'none'
    document.body.appendChild(probeEl)
  }
  return probeEl
}

export interface Oklch {
  l: number // 0-1
  c: number // 0-~0.4
  h: number // 0-360, NaN for achromatic (chroma ~0)
}

const OKLCH_RE = /oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+|none)/

export function hexToOklch(hex: string): Oklch {
  const el = probe()
  el.style.color = hex
  el.style.color = `oklch(from ${getComputedStyle(el).color} l c h)`
  const match = OKLCH_RE.exec(getComputedStyle(el).color)
  if (!match) throw new Error(`could not parse oklch from computed color for ${hex}`)
  return {
    l: Number(match[1]),
    c: Number(match[2]),
    h: match[3] === 'none' ? NaN : Number(match[3]),
  }
}

export function oklchToHex(oklch: Oklch): string {
  const el = probe()
  const h = Number.isNaN(oklch.h) ? 0 : oklch.h
  // getComputedStyle echoes back whatever color space the value was set in
  // (Chromium keeps oklch() as oklch()) -- round through srgb explicitly to
  // force an rgb() serialization we can parse, rather than assuming one.
  el.style.color = `color(from oklch(${String(oklch.l)} ${String(oklch.c)} ${String(h)}) srgb r g b)`
  const rgb = getComputedStyle(el).color
  // Out-of-gamut oklch inputs (e.g. from ramp sliders pushed to extremes)
  // serialize with negative or >1 components here -- clamp at the byte step
  // below rather than rejecting, so callers get a valid hex, not an error.
  const match = /color\(srgb (-?[\d.]+) (-?[\d.]+) (-?[\d.]+)/.exec(rgb)
  if (!match)
    throw new Error(
      `could not parse srgb from computed color for oklch(${String(oklch.l)} ${String(oklch.c)} ${String(h)})`,
    )
  const bytes = match
    .slice(1, 4)
    .map((v) => Math.max(0, Math.min(255, Math.round(Number(v) * 255))))
  return `#${bytes.map((v) => v.toString(16).padStart(2, '0')).join('')}`
}

// Deterministic WCAG AA contrast checker. Computes ratios from composited
// computed colors rather than leaning on axe's color-contrast rule, which hedges
// to "needs review" (and so escapes a violations-gated a11y test) whenever it
// can't resolve a background. We resolve it: walk the ancestor chain compositing
// alpha until opaque. The only case left undecidable is a background-image /
// gradient in the stack -- that needs pixel sampling, so we report it for review
// rather than guess (no false pass, no false fail).

type RGBA = [number, number, number, number]

function parse(s: string): RGBA {
  if (s === 'transparent' || s === '') return [0, 0, 0, 0]
  const m = s.match(/[\d.]+/g)?.map(Number)
  if (!m || m.length < 3) throw new Error(`unparseable color: ${s}`)
  const [r, g, b] = m
  if (r === undefined || g === undefined || b === undefined)
    throw new Error(`unparseable color: ${s}`)
  return [r, g, b, m[3] ?? 1]
}

// src (with alpha) over an opaque dst.
function over(src: RGBA, dst: RGBA): RGBA {
  const a = src[3]
  return [
    src[0] * a + dst[0] * (1 - a),
    src[1] * a + dst[1] * (1 - a),
    src[2] * a + dst[2] * (1 - a),
    1,
  ]
}

function hasImage(node: Element): boolean {
  const bi = getComputedStyle(node).backgroundImage
  return bi !== 'none' && bi !== ''
}

// The opaque colour behind `el`, or null if a background-image/gradient makes it
// undecidable from CSS alone.
function effectiveBg(el: Element): RGBA | null {
  const layers: RGBA[] = []
  let node: Element | null = el
  while (node) {
    if (hasImage(node)) return null
    const c = parse(getComputedStyle(node).backgroundColor)
    if (c[3] > 0) layers.push(c)
    if (c[3] === 1) break
    node = node.parentElement
  }
  // Bottom-most opaque layer, or the white canvas as the final backstop.
  const bottom = layers[layers.length - 1]
  let base: RGBA = bottom?.[3] === 1 ? (layers.pop(), bottom) : [255, 255, 255, 1]
  for (let i = layers.length - 1; i >= 0; i--) {
    const layer = layers[i]
    if (!layer) throw new Error('missing layer')
    base = over(layer, base)
  }
  return base
}

function lum([r, g, b]: RGBA): number {
  const f = (c: number) => {
    c /= 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}

function ratio(fg: RGBA, bg: RGBA): number {
  const a = lum(fg) + 0.05
  const b = lum(bg) + 0.05
  return Math.max(a, b) / Math.min(a, b)
}

// WCAG large text: >=24px, or >=18.66px bold. Else normal.
function requiredRatio(cs: CSSStyleDeclaration): number {
  const px = parseFloat(cs.fontSize)
  const bold = parseInt(cs.fontWeight, 10) >= 700
  const large = px >= 24 || (bold && px >= 18.66)
  return large ? 3 : 4.5
}

const rgb = (c: RGBA) => `rgb(${c.slice(0, 3).map(Math.round).join(', ')})`

export interface ContrastFinding {
  text: string
  fg: string
  bg: string
  ratio: number
  required: number
}

export interface ContrastResult {
  failures: ContrastFinding[]
  undecidable: string[]
}

export function findContrastFailures(root: ParentNode = document.body): ContrastResult {
  const failures: ContrastFinding[] = []
  const undecidable: string[] = []
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  let node: Node | null
  while ((node = walker.nextNode())) {
    const text = node.textContent?.replace(/\s+/g, ' ').trim()
    if (!text) continue
    const el = node.parentElement
    if (!el) continue
    const cs = getComputedStyle(el)
    if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) continue
    const bg = effectiveBg(el)
    if (!bg) {
      undecidable.push(text)
      continue
    }
    const fg = over(parse(cs.color), bg)
    const r = ratio(fg, bg)
    const required = requiredRatio(cs)
    if (r < required) {
      failures.push({ text, fg: cs.color, bg: rgb(bg), ratio: Number(r.toFixed(2)), required })
    }
  }
  return { failures, undecidable }
}

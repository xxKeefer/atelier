// GroupedControls has no component -- a token-layer foundation (mirrors
// Elevation/Colour) proving the "gang" rule (zero gap, square inner joins,
// outer-ends-only rounding, border-as-seam) already used ad hoc in
// AtInput/AtSelect's icon/prefix/field/suffix row, generalized to a
// horizontal extruded run (button-group) and a vertical recessed run
// (select-option-list).

// Horizontal gang: a row of individually extruded keycaps, each pinned to a
// different rest/hover/active/disabled rung so all four read at once (mirrors
// Elevation's ladder tiles). Only the outer-left/outer-right segments round.
// Border-as-seam: since this ladder's elevation is monotonically decreasing
// left-to-right (REW > PLAY > FF > STOP), the higher neighbour is always to
// the left, so every segment but the first drops its left border and the
// previous segment's right border draws the seam.
export const horizontalSegments = [
  {
    label: 'REW',
    state: 'rest',
    class: 'shadow-higher -translate-y-lift-full bg-surface-strong border-border-strong',
    position: 'rounded-l-md',
  },
  {
    label: 'PLAY',
    state: 'hover',
    class: 'shadow-high -translate-y-lift-half bg-surface-strong border-border-strong',
    position: 'border-l-0',
  },
  {
    label: 'FF',
    state: 'active',
    class: 'shadow-low translate-y-0 bg-surface-default border-border-default',
    position: 'border-l-0',
  },
  {
    label: 'STOP',
    state: 'disabled',
    class: 'shadow-flat translate-y-0 bg-surface-default border-border-default opacity-50',
    position: 'border-l-0 rounded-r-md',
  },
] as const

// Vertical gang: a stack of select-option-shaped segments. Rest is flush
// (shadow-flat); one segment is pinned to hover-depressed (inset shadow-low +
// bg-surface-subtle). The tone shift is load-bearing: every shadow rung is
// offsetX 0, so in a vertical gang the light axis runs parallel to the seams
// -- an inset shadow alone would land on the shared border and read as "a
// line", not "sunk". The surface-tone swap gives a light-direction-
// independent depression cue instead.
// Rounding: only the stack's outer ends round. Border-as-seam: every segment
// but the last drops its bottom border, so the next segment's top border
// draws the seam.
export const verticalSegments = [
  {
    label: 'New',
    state: 'rest',
    class: 'shadow-flat bg-surface-default border-border-default',
    position: 'rounded-t-md border-b-0',
  },
  {
    label: 'Open',
    state: 'hover',
    class: 'shadow-low bg-surface-subtle border-border-default',
    position: 'border-b-0',
  },
  {
    label: 'Save',
    state: 'rest',
    class: 'shadow-flat bg-surface-default border-border-default',
    position: 'border-b-0',
  },
  {
    label: 'Export',
    state: 'rest',
    class: 'shadow-flat bg-surface-default border-border-default',
    position: 'rounded-b-md',
  },
] as const

// Live variants: rounding stays purely positional, but border-drop is not,
// unlike the pinned ladders above -- their fixed monotonic elevation (REW >
// PLAY > FF > STOP) lets "every segment but the first drops left" work, but
// under real :hover/:active any segment can become the lower one, including
// mid-run. The elevation-aware rule (same "highest edge wins" as a checked
// AtButtonGroupItem) needs pure CSS since there's no JS state to key off:
// each segment drops its OWN border on the side it might sink
// (`hover:enabled:border-r-0`), and its following sibling restores the
// border it structurally drops by default via Tailwind's `peer`/
// `peer-hover:` (general-sibling, forward-looking only -- exactly the
// direction needed). STOP is excluded: it's permanently disabled, not part
// of the live ladder.
// Vertical segments share one live rest->hover mechanic and don't have this
// problem: only one row is ever hover-depressed, so the pinned
// rounding/border-drop never needs to react to which one it is.
export const liveHorizontalSegments = [
  {
    label: 'REW',
    position: 'rounded-l-md',
    seam: 'peer hover:enabled:border-r-0 active:enabled:border-r-0',
  },
  {
    label: 'PLAY',
    position: 'border-l-0',
    seam: 'peer peer-hover:border-l-[3px] peer-active:border-l-[3px] hover:enabled:border-r-0 active:enabled:border-r-0',
  },
  {
    label: 'FF',
    position: 'border-l-0',
    seam: 'peer-hover:border-l-[3px] peer-active:border-l-[3px]',
  },
  { label: 'STOP', position: 'border-l-0 rounded-r-md', seam: '', disabled: true },
] as const

export const liveVerticalSegments = [
  { label: 'New', position: 'rounded-t-md border-b-0' },
  { label: 'Open', position: 'border-b-0' },
  { label: 'Save', position: 'border-b-0' },
  { label: 'Export', position: 'rounded-b-md' },
] as const

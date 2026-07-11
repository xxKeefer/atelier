// GroupedControls has no component -- it's a token-layer foundation, mirroring
// Elevation/Colour. It proves the "gang" rule (zero gap, square inner joins,
// outer-ends-only rounding, border-as-seam) already implemented ad hoc in
// AtInput/AtSelect's icon/prefix/field/suffix row, generalized to two shapes:
// a horizontal run of extruded segments (button-group) and a vertical run of
// recessed segments (select-option-list). This module holds the shared data
// the views render.

// Horizontal gang: a row of individually extruded keycaps, cassette-deck
// transport style. Each segment is pinned to a different point on the
// rest/hover/active/disabled ladder so all four read at once in a static
// snapshot -- mirrors Elevation's ladder tiles, which show rungs the same way
// rather than relying on live :hover/:active pseudo-state.
// Rounding: only the run's outer-left (first) and outer-right (last) segments
// round on their outward side; every other side is square. Border-as-seam:
// every segment but the last drops its right border, so the next segment's
// left border draws the one line at the seam instead of two borders stacking.
export const horizontalSegments = [
  {
    label: 'REW',
    state: 'rest',
    class: 'shadow-higher -translate-y-lift-full bg-surface-strong border-border-strong',
    position: 'rounded-l-md border-r-0',
  },
  {
    label: 'PLAY',
    state: 'hover',
    class: 'shadow-high -translate-y-lift-half bg-surface-strong border-border-strong',
    position: 'border-r-0',
  },
  {
    label: 'FF',
    state: 'active',
    class: 'shadow-low translate-y-0 bg-surface-default border-border-default',
    position: 'border-r-0',
  },
  {
    label: 'STOP',
    state: 'disabled',
    class: 'shadow-flat translate-y-0 bg-surface-default border-border-default opacity-50',
    position: 'rounded-r-md',
  },
] as const

// Vertical gang: a stack of select-option-shaped segments. Rest is flush
// (shadow-flat, matching AtSelect's current item look); one segment is pinned
// to the hover-depressed look -- an *inset* shadow-low, the same rung
// AtInput's recessed field uses. Inset box-shadows paint inside their own
// element's border box, so the depression doesn't bleed onto a neighbouring
// segment -- no seam-interruption token needed, unlike an extruded vertical
// gang would require.
// Rounding: only the stack's outer-top (first) and outer-bottom (last)
// segments round. Border-as-seam: every segment but the last drops its bottom
// border, so the next segment's top border draws the seam.
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
    class: 'shadow-low bg-surface-default border-border-default',
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

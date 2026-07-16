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
// the higher-elevation segment's border wins each seam, not simply "the
// segment to the right." This ladder is a monotonically decreasing elevation
// run (REW > PLAY > FF > STOP), so the higher neighbour is always the one to
// the left -- every segment but the first drops its left border, so the
// previous (higher) segment's right border draws the one line at the seam
// instead of two borders stacking.
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
// (shadow-flat, matching AtSelect's current item look); one segment is pinned
// to the hover-depressed look -- inset shadow-low paired with a bg-surface-subtle
// tone shift. The tone shift is load-bearing here, not decorative: every shadow
// rung is offsetX 0 (straight top-down light, see shadow.json), so the light
// axis runs parallel to a vertical gang's seams instead of perpendicular to them
// like it does in the horizontal gang -- a depressed segment's inset shadow
// (a dark band at its own top inner edge) lands right on the border it already
// shares with its neighbour above, so shadow alone reads as "there's a line
// here", not "this one sank". The surface-tone swap gives a light-direction-
// independent cue to carry the depression instead. Inset box-shadows still
// paint inside their own element's border box regardless, so no seam-
// interruption token is needed either way.
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

// Live variants: rounding is still purely positional (outer ends only, never
// depends on transient state) -- but border-drop is NOT, unlike the pinned
// ladders above. The pinned ladders get away with "every segment but the
// first drops its left border" only because their rest/hover/active/disabled
// assignment is a fixed, monotonically-decreasing-left-to-right elevation
// (REW > PLAY > FF > STOP), so the higher neighbour is always the one on the
// left. Under real interaction any of REW/PLAY/FF can become the lower
// (pressed) one via :hover/:active, and it can land in the middle of the run
// -- e.g. hovering PLAY makes it lower than both REW (left) *and* FF (right).
// The elevation-aware rule (same "highest edge wins" principle a checked
// AtButtonGroupItem uses, see ButtonGroup/AtButtonGroupItem.vue) is: at each
// seam, the higher segment always keeps its border; the lower one drops the
// border on that side. Expressed here in pure CSS since there's no JS state to
// key off -- each segment drops its OWN border on the side it might sink
// (`hover:enabled:border-r-0`/`active:enabled:border-r-0` on REW and PLAY,
// the two segments with a following interactive neighbour), and each
// following segment restores the border it structurally drops by default
// when its *preceding* sibling is the one pressed, via Tailwind's `peer`/
// `peer-hover:`/`peer-active:` (a plain CSS general-sibling selector under
// the hood, `.peer:hover ~ &`, which only looks forward -- exactly the
// direction we need for "restore my left border when the segment before me
// sinks"). STOP is excluded: it's permanently disabled/dimmed
// (shadow-flat, opacity-50), not part of the live rest/hover/active ladder,
// so its border-seam mismatch against a hovered FF is far less perceptible
// and not worth the extra peer wiring.
// Vertical segments share one live rest->hover mechanic (shadow-flat -> inset
// shadow-low + surface-subtle tone shift, per the "shadow alone doesn't
// read" finding above) and don't have this problem: only one row is ever
// hover-depressed in the vertical live view, so the pinned rounding/
// border-drop-per-position never needs to react to which one it is.
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

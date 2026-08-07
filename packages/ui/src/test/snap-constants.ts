// Shared snap-board width for Snapshot stories wide enough to need a fixed
// width (form-control boards with dropdowns/popovers). Set via inline style,
// not a `w-[960px]` class -- Tailwind only generates arbitrary-value
// utilities it finds as literal text, so an interpolated class here would
// silently fail to generate the CSS.
//
// Split from snap.ts: that file imports `vitest/browser`, which throws when
// evaluated outside Vitest's browser runner. Stories files load in Storybook's
// own Vite server, so they need this constant free of that import.
export const SNAP_BOARD_WIDTH = 960

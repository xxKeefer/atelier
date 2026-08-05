import { page } from 'vitest/browser'
import { expect } from 'vitest'
import { freezeMotion } from './freeze-motion'

// Shared snap-board width for Snapshot stories wide enough to need a fixed
// width (form-control boards with dropdowns/popovers). Set via inline style,
// not a `w-[960px]` class -- Tailwind only generates arbitrary-value
// utilities it finds as literal text, so an interpolated class here would
// silently fail to generate the CSS.
export const SNAP_BOARD_WIDTH = 960

// Snap a board element at 1:1, sized to the board itself. The test viewport is a
// fixed-size iframe: a board taller than it gets scroll-clipped, a board far
// smaller wastes the frame. Resizing the viewport to the board before capture
// keeps every snap full and tight, whatever the board's dimensions -- no
// hard-coded per-component sizes. We screenshot the element, not the page, so
// the surrounding decorator padding never enters the image.
export async function snapBoard(testId: string, name: string): Promise<void> {
  freezeMotion()
  // Bundled faces must be ready or font-display: swap snaps a fallback and flakes.
  await document.fonts.ready
  const board = page.getByTestId(testId)
  const rect = board.element().getBoundingClientRect()
  // Fit the viewport to the board's far edge (it sits inside the decorator's
  // padding, so use right/bottom, not width/height), plus a small margin.
  await page.viewport(Math.ceil(rect.right) + 8, Math.ceil(rect.bottom) + 8)
  await expect.element(board).toMatchScreenshot(name, {
    comparatorOptions: { allowedMismatchedPixelRatio: 0.01 },
  })
}

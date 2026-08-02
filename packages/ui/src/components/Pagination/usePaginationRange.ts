// Pure range-calculation for AtPagination's page window. Split out from the
// component (mirrors Toast/useToast.ts colocation) so the windowing math --
// the fiddly part, with several boundary cases -- can be unit tested directly
// without mounting the component.

export const ELLIPSIS = 'ellipsis' as const

export type PaginationItem = number | typeof ELLIPSIS

// currentPage is 1-indexed, clamped to [1, totalPages] by the caller.
// siblingCount: pages shown on each side of currentPage.
// boundaryCount: pages always pinned at the very start/end.
//
// An ellipsis only replaces a gap when it would hide more than one page --
// a gap of exactly one page is filled with that page itself rather than a
// dot that could have just been a numeral (a common convention, e.g. MUI's
// Pagination).
export function getPaginationRange(
  currentPage: number,
  totalPages: number,
  siblingCount: number,
  boundaryCount: number,
): PaginationItem[] {
  if (totalPages <= 0) return []

  // Every page fits without a window: no ellipsis needed at all.
  const totalWindowSlots = boundaryCount * 2 + siblingCount * 2 + 3
  if (totalPages <= totalWindowSlots) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const startBoundary = Array.from({ length: boundaryCount }, (_, i) => i + 1)
  const endBoundary = Array.from(
    { length: boundaryCount },
    (_, i) => totalPages - boundaryCount + 1 + i,
  )

  const siblingStart = Math.max(currentPage - siblingCount, boundaryCount + 1)
  const siblingEnd = Math.min(currentPage + siblingCount, totalPages - boundaryCount)
  const siblings = Array.from({ length: siblingEnd - siblingStart + 1 }, (_, i) => siblingStart + i)

  const items: PaginationItem[] = [...startBoundary]

  // Left gap: fill with the single hidden page, or an ellipsis if more than one.
  const leftGapStart = boundaryCount + 1
  const leftGapEnd = siblingStart - 1
  if (leftGapEnd - leftGapStart + 1 === 1) {
    items.push(leftGapStart)
  } else if (leftGapEnd - leftGapStart + 1 > 1) {
    items.push(ELLIPSIS)
  }

  items.push(...siblings)

  // Right gap: same rule, mirrored.
  const rightGapStart = siblingEnd + 1
  const rightGapEnd = totalPages - boundaryCount
  if (rightGapEnd - rightGapStart + 1 === 1) {
    items.push(rightGapStart)
  } else if (rightGapEnd - rightGapStart + 1 > 1) {
    items.push(ELLIPSIS)
  }

  items.push(...endBoundary)

  return items
}

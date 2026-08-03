// Pure range-calculation for AtBreadcrumbs' overflow-collapse window. Split
// out from the component (mirrors Pagination/usePaginationRange.ts) so the
// windowing math -- which items stay visible vs. collapse behind the
// overflow trigger -- can be unit tested directly without mounting the
// component or dealing with vnodes.

export const COLLAPSED = 'collapsed' as const

export type BreadcrumbSlot = number | typeof COLLAPSED

// itemCount: total number of breadcrumb items.
// maxItems: the most items that may render before collapsing; undefined or
// a count at/under maxItems means no collapsing at all.
//
// When collapsing, the shape is always: first item, a single collapsed slot
// standing in for everything hidden, then the trailing (maxItems - 1) items
// -- there is no single-item-gap special case like Pagination's ellipsis,
// since a lone hidden crumb still reads better as a menu than as a bare
// label sitting where the trigger would go.
export function getBreadcrumbRange(
  itemCount: number,
  maxItems: number | undefined,
): BreadcrumbSlot[] {
  if (itemCount <= 0) return []

  const all = Array.from({ length: itemCount }, (_, i) => i)
  if (!maxItems || itemCount <= maxItems) return all

  const tailCount = maxItems - 1
  const tailStart = itemCount - tailCount
  return [0, COLLAPSED, ...all.slice(tailStart)]
}

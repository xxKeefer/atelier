<script setup lang="ts">
import { PopoverArrow, PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui'

type Side = 'top' | 'right' | 'bottom' | 'left'
type Align = 'start' | 'center' | 'end'

withDefaults(
  defineProps<{
    side?: Side
    align?: Align
    sideOffset?: number
    // Mounts already open, bypassing a trigger click -- for the Snapshot
    // board and stories that show the content without simulating one.
    defaultOpen?: boolean
    // Renders the content in place instead of teleporting to the document
    // body -- for the Snapshot board, so a `defaultOpen` instance's
    // popper-positioned content stays scoped to the board.
    disableTeleport?: boolean
  }>(),
  {
    side: 'bottom',
    align: 'center',
    sideOffset: 8,
    defaultOpen: false,
    disableTeleport: false,
  },
)
</script>

<template>
  <!-- PopoverTrigger as-child projects the slot's own element as the
       trigger, same as AtTooltip. reka-ui's Popover is click-triggered and
       already non-modal by default, with Escape, click-outside, and
       return-to-trigger focus handled by its own DismissableLayer/FocusScope
       -- no hand-rolled hover/focus-trap machinery needed here, unlike
       AtDropdown. -->
  <PopoverRoot :default-open="defaultOpen">
    <PopoverTrigger as-child>
      <slot name="trigger" />
    </PopoverTrigger>
    <PopoverPortal :disabled="disableTeleport">
      <PopoverContent
        :side="side"
        :align="align"
        :side-offset="sideOffset"
        data-testid="popover-content"
        class="z-50 rounded-md bg-surface-default p-4 font-body text-fg-default [filter:drop-shadow(0_1px_0_var(--color-border-default))_drop-shadow(0_-1px_0_var(--color-border-default))_drop-shadow(1px_0_0_var(--color-border-default))_drop-shadow(-1px_0_0_var(--color-border-default))_drop-shadow(0.7px_0.7px_0_var(--color-border-default))_drop-shadow(0.7px_-0.7px_0_var(--color-border-default))_drop-shadow(-0.7px_0.7px_0_var(--color-border-default))_drop-shadow(-0.7px_-0.7px_0_var(--color-border-default))]"
      >
        <slot />
        <!-- Same drop-shadow silhouette trick as AtTooltip's TooltipArrow --
             a plain `border` only outlines the content box's own rect, so it
             cuts across the arrow's base where the two shapes meet. Tracing
             box+arrow as one silhouette wraps the border continuously around
             the point. 1px weight, same as AtTooltip -- the flat surface's
             actual 3px border (AtSelect/AtDropdownItem) reads fine as a real
             `border` on a static box, but rendered through 8 stacked
             drop-shadow copies it compounded into a heavy, glowing outline
             that overpowered a floating popover. 8 offset directions (not
             AtTooltip's 4) -- 4 cardinal-only offsets left a visible notch at
             the arrow's tip, where its two edges meet at an angle no cardinal
             shift covers; the 4 added diagonals (offset 1/sqrt(2), same
             radial distance) round that corner out without thickening the
             line. -->
        <PopoverArrow class="fill-surface-default" />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>

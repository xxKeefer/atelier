<script setup lang="ts">
import { RadioGroupItem } from 'reka-ui'
import { pressGroupLadder } from '../../constants/pressGroupLadder'

defineProps<{
  value: string
}>()

defineOptions({ inheritAttrs: false })

const base =
  'relative inline-flex h-10 items-center justify-center border-[3px] border-solid px-4 font-body font-bold text-sm text-fg-default ' +
  'transition-[transform,box-shadow,filter] transition-press ' +
  'cursor-pointer disabled:cursor-not-allowed disabled:transition-none ' +
  // z-10 so the focus outline isn't painted over by a later (rightward)
  // sibling, which otherwise sits on top in normal paint order.
  'focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus'

// The gang mechanic (GroupedControls' liveHorizontalSegments): rest sits
// popped at `higher`, hover presses halfway to `high`, checked reads like the
// ladder's `active` rung (`low`, flush) and stays there -- the depressed look
// IS the checked indicator, driven off reka-ui's data-state, not real :active.
// pressGroupLadder() composes the shared press-group-higher/-high/-low
// utilities (packages/tokens/src/utilities.css), which already match both
// this component's unchecked/checked data-state values and AtTabsTrigger's
// inactive/active ones in the same rung.
const neutral = pressGroupLadder()

// Rounding and border-as-seam ownership are pure CSS, keyed off DOM position
// and reka-ui's `data-state`, not JS-tracked sibling registration. reka-ui's
// RadioGroupItem renders as a real DOM sibling with no wrapper, so
// :first-child/:last-child and sibling combinators apply directly to it.
//
// Only the run's outer ends round outward.
// Structural default: every segment but the first cedes its left border to
// its left neighbour (nothing checked yet reads correctly this way already).
// Elevation-aware override: a checked segment is lower (pressed) than an
// unchecked neighbour, so it cedes its OWN border on both seams it touches --
// `data-[state=checked]:...:border-r-0` drops its right border (unless it's
// the last segment, which owns the run's outer right edge), and its left
// border is already ceded by the structural default above (single-select, so
// at most one segment is ever checked). The segment to its right must then
// restore the border its structural default dropped, since its usual "left
// neighbour is higher" assumption no longer holds -- `[[data-state=checked]+&]`
// is a plain CSS adjacent-sibling selector (not Tailwind's `peer`, which uses
// a general-sibling `~` and would incorrectly match every later segment, not
// just the immediate neighbour).
const classes =
  base +
  ' ' +
  neutral +
  ' ' +
  '[&:first-child]:rounded-l-md [&:last-child]:rounded-r-md ' +
  '[&:not(:first-child)]:border-l-0 ' +
  'data-[state=checked]:[&:not(:last-child)]:border-r-0 ' +
  '[[data-state=checked]+&]:border-l-[3px]'
</script>

<template>
  <RadioGroupItem :value="value" :class="classes" v-bind="$attrs">
    <slot />
  </RadioGroupItem>
</template>

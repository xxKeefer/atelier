<script setup lang="ts">
import { RadioGroupItem } from 'reka-ui'
import { pressGroupLadder } from '../../constants/pressGroupLadder'

defineProps<{
  value: string
}>()

defineOptions({ inheritAttrs: false })

const base =
  'relative inline-flex h-10 items-center justify-center border-[3px] border-solid px-4 font-body font-bold text-sm text-fg-default ' +
  'transition-shape-press ' +
  'cursor-pointer disabled:cursor-not-allowed disabled:transition-none ' +
  // z-10 so the focus outline isn't painted over by a later (rightward)
  // sibling, which otherwise sits on top in normal paint order.
  'focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus'

// The gang mechanic (GroupedControls' liveHorizontalSegments): checked reads
// like the ladder's flush `active` rung, driven off reka-ui's data-state, not
// real :active. pressGroupLadder() composes the shared press-group utilities,
// matching this component's and AtTabsTrigger's state values to the same rung.
const neutral = pressGroupLadder()

// Border-as-seam ownership is pure CSS off DOM position + reka-ui's
// data-state (no JS sibling tracking): every segment but the first cedes its
// left border to its neighbour by default. A checked (pressed/lower) segment
// cedes its OWN border on both seams instead; the segment to its right must
// then restore the left border it ceded by default, since its "neighbour is
// higher" assumption no longer holds. `[[data-state=checked]+&]` is a plain
// adjacent-sibling selector -- Tailwind's `peer` uses general-sibling `~` and
// would match every later segment, not just the immediate one.
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

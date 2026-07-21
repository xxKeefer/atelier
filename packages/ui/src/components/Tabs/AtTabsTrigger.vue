<script setup lang="ts">
import { TabsTrigger } from 'reka-ui'

defineProps<{
  value: string
  disabled?: boolean
}>()

defineOptions({ inheritAttrs: false })

const base =
  'relative inline-flex h-10 items-center justify-center gap-1.5 border-[3px] border-solid px-4 font-body font-bold text-sm text-fg-default ' +
  'transition-[transform,box-shadow,filter] duration-[120ms] ease-[ease] motion-reduce:transition-none ' +
  'cursor-pointer disabled:cursor-not-allowed disabled:transition-none ' +
  // z-10 so the focus outline isn't painted over by a later (rightward)
  // sibling, which otherwise sits on top in normal paint order.
  'focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus'

// Same gang mechanic as AtButtonGroupItem (see its comments for the full
// rationale), re-keyed off reka-ui Tabs' data-state values: "active"/
// "inactive" instead of RadioGroup's "checked"/"unchecked". Rest sits popped
// at `higher`, hover presses halfway to `high`, active reads like the
// ladder's pressed rung (`low`, flush) and stays there -- the depressed look
// IS the selected indicator.
const neutral =
  'data-[state=inactive]:enabled:shadow-higher data-[state=inactive]:enabled:-translate-y-lift-full data-[state=inactive]:enabled:bg-surface-strong data-[state=inactive]:enabled:border-border-strong ' +
  'hover:enabled:data-[state=inactive]:shadow-high hover:enabled:data-[state=inactive]:-translate-y-lift-half hover:enabled:data-[state=inactive]:brightness-[1.08] ' +
  'data-[state=active]:enabled:shadow-low data-[state=active]:enabled:translate-y-0 data-[state=active]:enabled:bg-surface-default data-[state=active]:enabled:border-border-default ' +
  'disabled:opacity-50 disabled:shadow-flat disabled:translate-y-0'

// Same border-as-seam ownership as AtButtonGroupItem: only the run's outer
// ends round outward, every segment but the first cedes its left border to
// its left neighbour, and an active segment (lower/pressed) cedes its own
// border on both seams it touches so its unpressed neighbour's border reads
// as the visible seam instead of doubling up.
const classes =
  base +
  ' ' +
  neutral +
  ' ' +
  '[&:first-child]:rounded-l-md [&:last-child]:rounded-r-md ' +
  '[&:not(:first-child)]:border-l-0 ' +
  'data-[state=active]:[&:not(:last-child)]:border-r-0 ' +
  '[[data-state=active]+&]:border-l-[3px]'
</script>

<template>
  <TabsTrigger :value="value" :disabled="disabled" :class="classes" v-bind="$attrs">
    <slot name="left" />
    <slot />
    <slot name="right" />
  </TabsTrigger>
</template>

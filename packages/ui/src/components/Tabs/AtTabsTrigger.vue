<script setup lang="ts">
import { TabsTrigger } from 'reka-ui'
import { computed, inject } from 'vue'
import { pressGroupLadder } from '../../constants/pressGroupLadder'
import { TABS_VARIANT_KEY } from './AtTabs.vue'

defineProps<{
  value: string
  disabled?: boolean
}>()

defineOptions({ inheritAttrs: false })

const injectedVariant = inject(TABS_VARIANT_KEY)
const variant = computed(() => injectedVariant?.value ?? 'default')

const base =
  'relative inline-flex h-10 items-center justify-center gap-1.5 border-[3px] border-solid px-4 font-body font-bold text-sm ' +
  'transition-[transform,box-shadow,filter,color] transition-press ' +
  'cursor-pointer disabled:cursor-not-allowed disabled:transition-none ' +
  // z-10 so the focus outline isn't painted over by a later (rightward)
  // sibling, which otherwise sits on top in normal paint order.
  'focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus'

// Same gang mechanic as AtButtonGroupItem (see its comments for the full
// rationale), re-keyed off reka-ui Tabs' data-state values: "active"/
// "inactive" instead of RadioGroup's "checked"/"unchecked". Rest sits popped
// at `higher`, hover presses halfway to `high`, active reads like the
// ladder's pressed rung (`low`, flush) and stays there -- the depressed look
// IS the selected indicator. pressGroupLadder() composes the shared
// press-group-higher/-high/-low utilities, which already match both this
// component's inactive/active data-state values and AtButtonGroupItem's
// unchecked/checked ones in the same rung.
const neutral = 'text-fg-default ' + pressGroupLadder()

// Same border-as-seam ownership as AtButtonGroupItem: only the run's outer
// ends round outward, every segment but the first cedes its left border to
// its left neighbour, and an active segment (lower/pressed) cedes its own
// border on both seams it touches so its unpressed neighbour's border reads
// as the visible seam instead of doubling up.
const defaultVariant =
  neutral +
  ' ' +
  '[&:first-child]:rounded-l-md [&:last-child]:rounded-r-md ' +
  '[&:not(:first-child)]:border-l-0 ' +
  'data-[state=active]:[&:not(:last-child)]:border-r-0 ' +
  '[[data-state=active]+&]:border-l-[3px]'

// Flat: no segment shell, just label colour against the shared underline
// AtTabsList paints below the row. Keeps the transparent 3px border so the
// row's height matches the Default variant's trigger height exactly.
const flatVariant =
  'border-transparent bg-transparent shadow-none translate-y-0 ' +
  'data-[state=inactive]:enabled:text-fg-muted data-[state=active]:enabled:text-fg-default ' +
  'hover:enabled:data-[state=inactive]:text-fg-default ' +
  'disabled:opacity-50'

const classes = computed(() => `${base} ${variant.value === 'flat' ? flatVariant : defaultVariant}`)
</script>

<template>
  <TabsTrigger :value="value" :disabled="disabled" :class="classes" v-bind="$attrs">
    <slot name="left" />
    <slot />
    <slot name="right" />
  </TabsTrigger>
</template>

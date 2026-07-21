<script setup lang="ts">
import { DropdownMenuItem } from 'reka-ui'

withDefaults(defineProps<{ disabled?: boolean }>(), { disabled: false })

// The vertical GroupedControls gang (Foundations/GroupedControls > Vertical,
// same shape as AtSelect's option list): flush zero-gap stack, border-as-seam
// -- only the stack's outer-top/outer-bottom ends round, and every item but
// the last drops its bottom border so the next item's top border draws the
// seam instead of doubling the line. `first:`/`last:` read the item's actual
// position among its DOM siblings, so any number of items composes correctly
// without index/length bookkeeping.
const item =
  'flex cursor-pointer items-center px-4 py-2 font-body text-base text-fg-default outline-none ' +
  'border-[3px] border-solid border-border-default bg-surface-default shadow-flat border-b-0 ' +
  'first:rounded-t-md last:rounded-b-md last:border-b-[3px] ' +
  'data-[highlighted]:bg-surface-subtle data-[highlighted]:shadow-low ' +
  'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50'
</script>

<template>
  <DropdownMenuItem :class="item" :disabled="disabled">
    <slot />
  </DropdownMenuItem>
</template>

<script setup lang="ts">
import { ListboxItem } from 'reka-ui'

withDefaults(defineProps<{ value: string; disabled?: boolean }>(), { disabled: false })

// The vertical GroupedControls gang (same shape as AtDropdownItem/AtSelect's
// option list): flush zero-gap stack, border-as-seam. `first:`/`last:` key
// off actual DOM position among this item's own siblings -- correct for a
// flat item run, or for an AtListboxGroup's own item wrapper (see that
// component), since both scope the pseudo-classes to a parent that holds
// only items. A bare item run interleaved directly with AtListboxGroup
// siblings at the top level isn't guaranteed a fully continuous seam at
// that boundary -- an accepted simplification for Phase 1.
//
// Selected reads as its own primary-tinted, pinned rung (not just the
// neutral highlight rung) so it stays legible whether or not the item also
// happens to be highlighted -- ordered after the highlight rule so it wins
// when both data attributes are present.
const item =
  'flex cursor-pointer items-center px-4 py-2 font-body text-base text-fg-default outline-none ' +
  'border-[3px] border-solid border-border-default bg-surface-default shadow-flat border-b-0 ' +
  'first:rounded-t-md last:rounded-b-md last:border-b-[3px] ' +
  'data-[highlighted]:bg-surface-subtle data-[highlighted]:shadow-low ' +
  'data-[state=checked]:border-primary-border-default data-[state=checked]:bg-primary-surface-recess data-[state=checked]:shadow-primary-low ' +
  'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50'
</script>

<template>
  <ListboxItem :value="value" :disabled="disabled" :class="item">
    <slot />
  </ListboxItem>
</template>

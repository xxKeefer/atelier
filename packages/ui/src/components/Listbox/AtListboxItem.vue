<script setup lang="ts">
import { PhCheck } from '@phosphor-icons/vue'
import { ListboxItem, ListboxItemIndicator } from 'reka-ui'
import { computed, inject, onUnmounted, watchEffect } from 'vue'
import Icon from '../Icon/AtIcon.vue'
import { LISTBOX_FILTER_KEY, LISTBOX_MATCH_STATE_KEY, LISTBOX_MULTIPLE_KEY } from './AtListbox.vue'

const props = withDefaults(
  defineProps<{
    value: string
    disabled?: boolean
    // Text an ancestor AtListboxFilter matches against (case-insensitive
    // substring). Items render arbitrary slotted content (text + icons +
    // nested components per Phase 1), so this can't be inferred from the
    // slot itself -- mirrors reka-ui's own textValue-style props elsewhere
    // (e.g. Select's SelectItemText) rather than inventing a new mechanism.
    // An item with no label is always considered a match, since there's
    // nothing to compare the filter text against.
    label?: string
  }>(),
  { disabled: false, label: undefined },
)

// Multi mode gets an explicit checkmark on top of Phase 1's pinned-rung
// chrome -- with several rows selected at once, the rung alone doesn't read
// as clearly as it does for a single selected row.
const injectedMultiple = inject(LISTBOX_MULTIPLE_KEY)
const multiple = computed(() => injectedMultiple?.value ?? false)

// Filtering unmounts non-matching items outright (v-if below) rather than
// hiding them -- this removes them from reka-ui's own keyboard-nav
// collection for free, same as a disabled item, without needing a second
// data-attribute-based exclusion mechanism.
const filterText = inject(LISTBOX_FILTER_KEY)
const matchState = inject(LISTBOX_MATCH_STATE_KEY)
const matches = computed(() => {
  if (!filterText?.value) return true
  if (!props.label) return true
  return props.label.toLowerCase().includes(filterText.value.toLowerCase())
})

if (matchState) {
  const id = Symbol('listbox-item')
  watchEffect(() => {
    matchState.set(id, matches.value)
  })
  onUnmounted(() => {
    matchState.delete(id)
  })
}

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
  // w-full matters for AtVirtualListbox: reka-ui's ListboxVirtualizer
  // absolutely-positions each item (no width set), so without an explicit
  // width it shrinks to its own content instead of filling the row -- a
  // flex-col AtListbox already stretches children by default and is
  // unaffected by the extra class.
  'flex w-full cursor-pointer items-center justify-between gap-2 px-4 py-2 font-body text-base text-fg-default outline-none ' +
  'border-[3px] border-solid border-border-default bg-surface-default shadow-flat border-b-0 ' +
  'first:rounded-t-md last:rounded-b-md last:border-b-[3px] ' +
  'data-[highlighted]:bg-surface-subtle data-[highlighted]:shadow-low ' +
  'data-[state=checked]:border-primary-border-default data-[state=checked]:bg-primary-surface-recess data-[state=checked]:shadow-primary-low ' +
  // opacity-50 blends fg-default text down to a 4.28:1 ratio against this
  // row's own bg -- just under WCAG AA's 4.5:1. 60 is the lowest step that
  // clears it (~5.48:1) while still reading as visually dimmed.
  'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60'
</script>

<template>
  <ListboxItem v-if="matches" :value="value" :disabled="disabled" :class="item">
    <slot />
    <ListboxItemIndicator
      v-if="multiple"
      data-testid="listbox-item-indicator"
      class="flex shrink-0 items-center text-primary-fg"
    >
      <Icon :icon="PhCheck" size="sm" />
    </ListboxItemIndicator>
  </ListboxItem>
</template>

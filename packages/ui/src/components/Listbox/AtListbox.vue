<script lang="ts">
import type { ComputedRef, InjectionKey, Ref } from 'vue'

// AtListboxItem reads multi-select mode off this instead of a prop drilled
// through arbitrary slotted composition (items can sit under AtListboxGroup,
// not just directly under AtListbox).
export const LISTBOX_MULTIPLE_KEY: InjectionKey<ComputedRef<boolean>> = Symbol('listbox-multiple')

// The current filter text, owned by AtListbox and written to by
// AtListboxFilter (slotted in via #filter) so items -- arbitrarily nested
// under AtListboxGroup -- can read it without a prop drilled through the
// composition, same rationale as LISTBOX_MULTIPLE_KEY.
export const LISTBOX_FILTER_KEY: InjectionKey<Ref<string>> = Symbol('listbox-filter')

// Each AtListboxItem reports whether it currently matches the filter here,
// keyed by its own identity, so AtListbox can tell "structurally empty" (no
// items at all, hasItems below) apart from "items exist but none match the
// filter" (every registered entry is false) without inspecting rendered DOM.
export const LISTBOX_MATCH_STATE_KEY: InjectionKey<Map<symbol, boolean>> =
  Symbol('listbox-match-state')
</script>

<script setup lang="ts">
import { ListboxContent, ListboxRoot } from 'reka-ui'
import { Comment, Text, computed, provide, reactive, ref, useSlots } from 'vue'

const props = withDefaults(
  defineProps<{
    // v-model: a single value normally, or an array of values when `multiple`.
    modelValue?: string | string[]
    // Toggles reka-ui's ListboxRoot `multiple` -- selecting an item then
    // toggles its membership in the array instead of replacing the selection.
    multiple?: boolean
    // Row shown in place of the slot when it renders no items.
    emptyMessage?: string
  }>(),
  {
    modelValue: undefined,
    multiple: false,
    emptyMessage: 'No results',
  },
)

const emit = defineEmits<{ 'update:modelValue': [value: string | string[]] }>()

defineOptions({ inheritAttrs: false })

const modelValue = computed({
  get: () => props.modelValue,
  set: (v: string | string[]) => {
    emit('update:modelValue', v)
  },
})

provide(
  LISTBOX_MULTIPLE_KEY,
  computed(() => props.multiple),
)

const filterText = ref('')
const matchState = reactive(new Map<symbol, boolean>())
provide(LISTBOX_FILTER_KEY, filterText)
provide(LISTBOX_MATCH_STATE_KEY, matchState)

// Filtering is orthogonal to the structural hasItems check below: items stay
// mounted-but-nonmatching removes them from the slot's own vnode list (each
// AtListboxItem v-ifs itself away), so this can't be inferred from vnode
// inspection the way structural emptiness is -- it needs the items' own
// self-reported match state instead. A filter with nothing registered yet
// (no items in this list at all) isn't a "no matches" case -- that's already
// covered by hasItems / emptyMessage below.
const noMatches = computed(
  () => filterText.value !== '' && matchState.size > 0 && ![...matchState.values()].some(Boolean),
)

// Slotted composition means AtListbox never sees an items array to check the
// length of -- detect emptiness from the slot's own rendered output instead,
// ignoring the Comment/whitespace-Text vnodes Vue emits for a v-if-false or
// v-for-over-nothing so those don't count as "an item".
const slots = useSlots()
// gap-2 only when a filter is actually slotted in -- an unused #filter slot
// costs nothing, same rationale as useFieldAffordances' icon/prefix/suffix
// detection elsewhere in this package.
const root = computed(() => ['flex flex-col', slots.filter && 'gap-2'])
const hasItems = computed(() => {
  const rendered = slots.default?.() ?? []
  const children = Array.isArray(rendered) ? rendered : [rendered]
  return children.some((vnode) => {
    if (vnode.type === Comment) return false
    if (vnode.type === Text && (typeof vnode.children !== 'string' || !vnode.children.trim()))
      return false
    return true
  })
})

// Flat, no elevation -- mirrors AtDropdown/AtSelect's menu content: the list
// sits on the surface, it doesn't float above it. No gap here -- bare items
// need to stay flush for their border-as-seam treatment; AtListboxGroup
// supplies its own spacing from a preceding sibling instead.
const content = 'flex flex-col bg-surface-default'

// Same rest chrome as a normal row (recessed/flat, not a distinct design),
// just non-interactive and alone, so it rounds on every corner.
const emptyRow =
  'flex items-center rounded-md px-4 py-2 font-body text-base text-fg-subtle ' +
  'border-thick bg-surface-default shadow-flat'
</script>

<template>
  <ListboxRoot v-model="modelValue" :multiple="multiple" :class="root">
    <slot name="filter" />
    <ListboxContent :class="content" v-bind="$attrs">
      <template v-if="hasItems">
        <slot />
        <div
          v-if="noMatches"
          role="option"
          aria-disabled="true"
          :class="emptyRow"
          data-testid="listbox-empty"
        >
          {{ emptyMessage }}
        </div>
      </template>
      <div v-else role="option" aria-disabled="true" :class="emptyRow" data-testid="listbox-empty">
        {{ emptyMessage }}
      </div>
    </ListboxContent>
  </ListboxRoot>
</template>

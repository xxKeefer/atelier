<script setup lang="ts">
import { ListboxContent, ListboxRoot } from 'reka-ui'
import { Comment, Text, computed, useSlots } from 'vue'

const props = withDefaults(
  defineProps<{
    // v-model: the selected item's value. Single-select only in Phase 1 --
    // reka-ui's ListboxRoot `multiple` stays unset (falsy) here.
    modelValue?: string
    // Row shown in place of the slot when it renders no items.
    emptyMessage?: string
  }>(),
  {
    modelValue: undefined,
    emptyMessage: 'No results',
  },
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

defineOptions({ inheritAttrs: false })

const modelValue = computed({
  get: () => props.modelValue,
  set: (v: string) => {
    emit('update:modelValue', v)
  },
})

// Slotted composition means AtListbox never sees an items array to check the
// length of -- detect emptiness from the slot's own rendered output instead,
// ignoring the Comment/whitespace-Text vnodes Vue emits for a v-if-false or
// v-for-over-nothing so those don't count as "an item".
const slots = useSlots()
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
  'border-[3px] border-solid border-border-default bg-surface-default shadow-flat'
</script>

<template>
  <ListboxRoot v-model="modelValue">
    <ListboxContent :class="content" v-bind="$attrs">
      <template v-if="hasItems">
        <slot />
      </template>
      <div v-else :class="emptyRow" data-testid="listbox-empty">{{ emptyMessage }}</div>
    </ListboxContent>
  </ListboxRoot>
</template>

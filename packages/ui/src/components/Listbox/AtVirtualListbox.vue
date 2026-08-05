<script setup lang="ts">
import { ListboxContent, ListboxRoot, ListboxVirtualizer } from 'reka-ui'
import { computed, provide } from 'vue'
import ListboxItem from './AtListboxItem.vue'
import { LISTBOX_MULTIPLE_KEY } from './AtListbox.vue'

// reka-ui's ListboxVirtualizer needs the full option set up front to compute
// scroll offsets -- incompatible with AtListbox's arbitrary-slotted-children
// composition (Phase 1-3), which has no items array to hand it. Ships as a
// sibling component rather than a `virtual` mode on AtListbox, same
// AtVirtualList-alongside-AtList precedent, rather than forcing one
// component to support two incompatible composition models.
//
// ListboxVirtualizer's own `options` prop is a flat array -- no grouping
// concept exists at that layer (confirmed by reading its source), so grouped
// virtualisation is out of scope here, per the AC's own descope allowance.
const props = withDefaults(
  defineProps<{
    options: string[]
    // v-model: a single value normally, or an array of values when `multiple`.
    modelValue?: string | string[]
    multiple?: boolean
    emptyMessage?: string
    estimateSize?: number
    overscan?: number
  }>(),
  {
    modelValue: undefined,
    multiple: false,
    emptyMessage: 'No results',
    estimateSize: 40,
    overscan: 5,
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

// Flat, no elevation -- matches AtListbox's own content chrome. h-full +
// overflow-y-auto so this fills a caller-supplied fixed-height wrapper
// (AtVirtualList's own precedent -- sizing is the caller's concern, not a
// height prop here) and becomes the scroll container ListboxVirtualizer
// measures against (it targets its own DOM parent, which is this element).
const content = 'flex h-full flex-col overflow-y-auto bg-surface-default'

const emptyRow =
  'flex items-center rounded-md px-4 py-2 font-body text-base text-fg-subtle ' +
  'border-thick bg-surface-default shadow-flat'
</script>

<template>
  <ListboxRoot v-model="modelValue" :multiple="multiple" class="flex h-full flex-col">
    <ListboxContent :class="content" v-bind="$attrs">
      <template v-if="options.length">
        <ListboxVirtualizer :options="options" :estimate-size="estimateSize" :overscan="overscan">
          <template #default="{ option, virtualItem }">
            <ListboxItem :value="option">
              <slot name="option" :option="option" :index="virtualItem.index" />
            </ListboxItem>
          </template>
        </ListboxVirtualizer>
      </template>
      <div v-else :class="emptyRow" data-testid="listbox-empty">{{ emptyMessage }}</div>
    </ListboxContent>
  </ListboxRoot>
</template>

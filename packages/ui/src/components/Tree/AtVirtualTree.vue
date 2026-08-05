<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import type { FlattenedItem } from 'reka-ui'
import { TreeRoot, TreeVirtualizer } from 'reka-ui'
import { computed, provide, toRef } from 'vue'
import TreeItem from './AtTreeItem.vue'
import { TREE_MULTIPLE_KEY } from './AtTree.vue'
import type { TreeItemData } from './useTreeSelection'
import { useTreeSelection } from './useTreeSelection'

const props = withDefaults(
  defineProps<{
    items: TreeItemData[]
    // v-model: the selected item's id, or an array of ids when `multiple`.
    modelValue?: string | string[]
    multiple?: boolean
    propagateSelect?: boolean
    bubbleSelect?: boolean
    // v-model: ids of the currently expanded nodes.
    expanded?: string[]
    defaultExpanded?: string[]
    // Estimated row height in px, and off-screen rows kept mounted either
    // side of the viewport -- forwarded straight to TreeVirtualizer, which
    // falls back to its own defaults (28 / 12) when left unset.
    estimateSize?: number
    overscan?: number
  }>(),
  {
    modelValue: undefined,
    multiple: false,
    propagateSelect: false,
    bubbleSelect: false,
    expanded: undefined,
    defaultExpanded: () => [],
    estimateSize: undefined,
    overscan: undefined,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string | string[] | undefined]
  'update:expanded': [value: string[]]
}>()

provide(
  TREE_MULTIPLE_KEY,
  computed(() => props.multiple),
)

const { getKey, getChildren, selectedItem, toModelValue } = useTreeSelection(
  toRef(props, 'items'),
  toRef(props, 'modelValue'),
  toRef(props, 'multiple'),
)

// TreeVirtualizer isn't generic over T (it reads rootContext via
// injectTreeRootContext(), typed `Record<string, any>`) -- the runtime value
// is a real TreeItemData, only the slot's type is loose.
function asTreeItem(item: FlattenedItem<Record<string, unknown>>) {
  return item as FlattenedItem<TreeItemData>
}

// TreeVirtualizer positions rows by a fixed estimateSize with no built-in
// remeasurement -- a row's real height (icon + label + padding, and whatever
// arbitrary content a consumer's slot renders) is whatever the estimate
// guessed it'd be. measureElement (tanstack-virtual's own API for this,
// keyed off the `data-index` TreeVirtualizer already stamps on each cloned
// row) reports each row's true rendered height back, correcting subsequent
// rows' offsets instead of guessing one fixed number that never fits every
// consumer's content. Typed structurally (not against `Virtualizer` from
// '@tanstack/vue-virtual') because reka-ui and this package can resolve to
// different installed copies of '@tanstack/virtual-core' in the pnpm store,
// and its `Virtualizer` class has private fields that make two same-shaped
// instances from different copies nominally incompatible under vue-tsc.
function measureRow(
  virtualizer: { measureElement: (node: Element) => void },
  el: Element | ComponentPublicInstance | null,
) {
  if (!el) return
  virtualizer.measureElement('$el' in el ? (el.$el as Element) : el)
}
</script>

<template>
  <TreeRoot
    :items="items"
    :get-key="getKey"
    :get-children="getChildren"
    :model-value="selectedItem"
    :multiple="multiple"
    :propagate-select="propagateSelect"
    :bubble-select="bubbleSelect"
    :expanded="expanded"
    :default-expanded="defaultExpanded"
    class="size-full overflow-y-auto"
    @update:model-value="(value) => emit('update:modelValue', toModelValue(value))"
    @update:expanded="(value) => emit('update:expanded', value)"
  >
    <TreeVirtualizer
      v-slot="{ item: flat, virtualizer }"
      :estimate-size="estimateSize"
      :overscan="overscan"
    >
      <TreeItem
        :ref="(el) => measureRow(virtualizer, el)"
        v-bind="asTreeItem(flat).bind"
        :has-children="flat.hasChildren"
      >
        <template #default="scope">
          <slot v-bind="scope" />
        </template>
      </TreeItem>
    </TreeVirtualizer>
  </TreeRoot>
</template>

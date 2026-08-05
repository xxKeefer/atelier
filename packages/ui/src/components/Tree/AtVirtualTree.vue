<script setup lang="ts">
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
    <TreeVirtualizer v-slot="{ item: flat }" :estimate-size="estimateSize" :overscan="overscan">
      <TreeItem v-bind="asTreeItem(flat).bind" :has-children="flat.hasChildren">
        <template #default="scope">
          <slot v-bind="scope" />
        </template>
      </TreeItem>
    </TreeVirtualizer>
  </TreeRoot>
</template>

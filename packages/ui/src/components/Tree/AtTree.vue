<script lang="ts">
export interface TreeItemData {
  id: string
  children?: TreeItemData[]
  disabled?: boolean
  [key: string]: unknown
}
</script>

<script setup lang="ts">
import { TreeRoot } from 'reka-ui'
import { computed } from 'vue'
import TreeItem from './AtTreeItem.vue'

const props = withDefaults(
  defineProps<{
    items: TreeItemData[]
    // v-model: the selected item's id.
    modelValue?: string
    // v-model: ids of the currently expanded nodes.
    expanded?: string[]
    defaultExpanded?: string[]
  }>(),
  { modelValue: undefined, expanded: undefined, defaultExpanded: () => [] },
)

const emit = defineEmits<{
  'update:modelValue': [value: string | undefined]
  'update:expanded': [value: string[]]
}>()

const getKey = (item: TreeItemData) => item.id
const getChildren = (item: TreeItemData) => item.children

// TreeRoot's own v-model operates on the full item object (its `value` prop
// is the object, `getKey` is only used internally for aria/comparison) --
// AtTree exposes a plain id instead, matching AtListbox/AtAccordion's
// string-based v-model convention, so this translates both ways.
function findItem(nodes: TreeItemData[], id: string): TreeItemData | undefined {
  for (const node of nodes) {
    if (node.id === id) return node
    const found = node.children && findItem(node.children, id)
    if (found) return found
  }
  return undefined
}

const selectedItem = computed(() =>
  props.modelValue ? findItem(props.items, props.modelValue) : undefined,
)
</script>

<template>
  <TreeRoot
    v-slot="{ flattenItems }"
    :items="items"
    :get-key="getKey"
    :get-children="getChildren"
    :model-value="selectedItem"
    :expanded="expanded"
    :default-expanded="defaultExpanded"
    class="flex flex-col"
    @update:model-value="(value) => emit('update:modelValue', value ? getKey(value) : undefined)"
    @update:expanded="(value) => emit('update:expanded', value)"
  >
    <TreeItem
      v-for="flat in flattenItems"
      :key="flat._id"
      v-bind="flat.bind"
      :has-children="flat.hasChildren"
    >
      <template #default="scope">
        <slot v-bind="scope" />
      </template>
    </TreeItem>
  </TreeRoot>
</template>

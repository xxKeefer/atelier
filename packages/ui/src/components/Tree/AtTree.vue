<script lang="ts">
import type { ComputedRef, InjectionKey } from 'vue'

export interface TreeItemData {
  id: string
  children?: TreeItemData[]
  disabled?: boolean
  [key: string]: unknown
}

// AtTreeItem reads multi-select mode off this instead of a prop, since it's
// only ever rendered from AtTree's own flattenItems loop, matching
// AtListboxItem's LISTBOX_MULTIPLE_KEY precedent for the same shape of problem.
export const TREE_MULTIPLE_KEY: InjectionKey<ComputedRef<boolean>> = Symbol('tree-multiple')
</script>

<script setup lang="ts">
import { TreeRoot } from 'reka-ui'
import { computed, provide } from 'vue'
import TreeItem from './AtTreeItem.vue'

const props = withDefaults(
  defineProps<{
    items: TreeItemData[]
    // v-model: the selected item's id, or an array of ids when `multiple`.
    modelValue?: string | string[]
    // Toggles TreeRoot's `multiple` -- selecting a node then toggles its
    // membership in the array instead of replacing the selection.
    multiple?: boolean
    // When true, selecting a parent also selects all its descendants --
    // built into TreeRoot itself, this only forwards the prop.
    propagateSelect?: boolean
    // When true, a parent's selection reflects its children (fully selected,
    // unselected, or indeterminate when some but not all are selected) --
    // also built into TreeRoot; AtTreeItem reads the indeterminate signal
    // straight off TreeItem's own slot scope rather than recomputing it.
    bubbleSelect?: boolean
    // v-model: ids of the currently expanded nodes.
    expanded?: string[]
    defaultExpanded?: string[]
  }>(),
  {
    modelValue: undefined,
    multiple: false,
    propagateSelect: false,
    bubbleSelect: false,
    expanded: undefined,
    defaultExpanded: () => [],
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

const getKey = (item: TreeItemData) => item.id
const getChildren = (item: TreeItemData) => item.children

// TreeRoot's own v-model operates on the full item object(s) (its `value`
// prop is the object, `getKey` is only used internally for aria/comparison)
// -- AtTree exposes plain id(s) instead, matching AtListbox/AtAccordion's
// string-based v-model convention, so this translates both ways.
function findItem(nodes: TreeItemData[], id: string): TreeItemData | undefined {
  for (const node of nodes) {
    if (node.id === id) return node
    const found = node.children && findItem(node.children, id)
    if (found) return found
  }
  return undefined
}

const selectedItem = computed(() => {
  if (props.multiple) {
    const ids = Array.isArray(props.modelValue) ? props.modelValue : []
    return ids
      .map((id) => findItem(props.items, id))
      .filter((item): item is TreeItemData => item !== undefined)
  }
  return typeof props.modelValue === 'string' ? findItem(props.items, props.modelValue) : undefined
})

function toModelValue(
  value: TreeItemData | TreeItemData[] | undefined,
): string | string[] | undefined {
  if (Array.isArray(value)) return value.map(getKey)
  return value ? getKey(value) : undefined
}
</script>

<template>
  <TreeRoot
    v-slot="{ flattenItems }"
    :items="items"
    :get-key="getKey"
    :get-children="getChildren"
    :model-value="selectedItem"
    :multiple="multiple"
    :propagate-select="propagateSelect"
    :bubble-select="bubbleSelect"
    :expanded="expanded"
    :default-expanded="defaultExpanded"
    class="flex flex-col"
    @update:model-value="(value) => emit('update:modelValue', toModelValue(value))"
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

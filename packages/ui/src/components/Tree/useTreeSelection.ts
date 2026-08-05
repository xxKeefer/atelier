import type { Ref } from 'vue'
import { computed } from 'vue'

export interface TreeItemData {
  id: string
  children?: TreeItemData[]
  disabled?: boolean
  [key: string]: unknown
}

// Shared by AtTree and AtVirtualTree: both translate TreeRoot's own
// object-based v-model to/from AtTree's public id-based one (matching
// AtListbox/AtAccordion's string-based v-model convention).
export function useTreeSelection(
  items: Ref<TreeItemData[]>,
  modelValue: Ref<string | string[] | undefined>,
  multiple: Ref<boolean>,
) {
  const getKey = (item: TreeItemData) => item.id
  const getChildren = (item: TreeItemData) => item.children

  function findItem(nodes: TreeItemData[], id: string): TreeItemData | undefined {
    for (const node of nodes) {
      if (node.id === id) return node
      const found = node.children && findItem(node.children, id)
      if (found) return found
    }
    return undefined
  }

  const selectedItem = computed(() => {
    if (multiple.value) {
      const ids = Array.isArray(modelValue.value) ? modelValue.value : []
      return ids
        .map((id) => findItem(items.value, id))
        .filter((item): item is TreeItemData => item !== undefined)
    }
    return typeof modelValue.value === 'string'
      ? findItem(items.value, modelValue.value)
      : undefined
  })

  function toModelValue(
    value: TreeItemData | TreeItemData[] | undefined,
  ): string | string[] | undefined {
    if (Array.isArray(value)) return value.map(getKey)
    return value ? getKey(value) : undefined
  }

  return { getKey, getChildren, selectedItem, toModelValue }
}

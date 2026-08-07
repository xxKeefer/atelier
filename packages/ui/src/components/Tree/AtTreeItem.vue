<script setup lang="ts">
import { PhCaretDown, PhCheck, PhMinus } from '@phosphor-icons/vue'
import { TreeItem } from 'reka-ui'
import { computed, inject } from 'vue'
import Icon from '../Icon/AtIcon.vue'
import { TREE_MULTIPLE_KEY } from './AtTree.vue'
import type { TreeItemData } from './AtTree.vue'

const props = defineProps<{
  value: TreeItemData
  level: number
  hasChildren: boolean
}>()

// Multi mode gets an explicit checkmark (or a dash when a bubbleSelect
// parent is only partially selected) on top of the pinned-rung chrome --
// same rationale as AtListboxItem's own indicator.
const injectedMultiple = inject(TREE_MULTIPLE_KEY)
const multiple = computed(() => injectedMultiple?.value ?? false)

// reka-ui's TreeItem has no built-in disabled concept. `select`/`toggle` are
// cancelable custom events it emits before acting on them (checks
// `event.defaultPrevented`) -- preventing both here blocks click-driven
// selection/expansion. Keyboard-nav exclusion is handled separately below via
// `data-disabled`, which RovingFocusGroup's own candidate filtering reads.
function guardDisabled(event: Event) {
  if (props.value.disabled) event.preventDefault()
}

const indent = computed(() => `calc(var(--spacing-6) * ${String(props.level - 1)})`)

// Accent-rail treatment (won a 3-way aesthetic prototype against a
// vertical-gang boxed-row style borrowed from AtListboxItem, which read as a
// listbox rather than a tree). No row border/shadow at all -- hierarchy reads
// via indentation, selection via a left accent bar instead of a full box.
// Tree has no `data-highlighted` attribute (that's a Listbox/Menu concept) --
// roving focus lands real DOM focus on the active row, so focus-visible is
// the highlight equivalent here. `data-selected` is set by reka-ui's
// TreeItem itself.
const row =
  'flex cursor-pointer items-center gap-1.5 rounded-r-md border-l-[3px] border-transparent py-1.5 pr-3 ' +
  'font-body text-base text-fg-default outline-none hover:bg-surface-subtle ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus ' +
  'data-[selected]:border-primary-default data-[selected]:bg-primary-surface-recess ' +
  'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50'
</script>

<template>
  <TreeItem
    v-slot="{ isExpanded, isSelected, isIndeterminate, handleToggle }"
    :value="value"
    :level="level"
    :data-disabled="value.disabled ? '' : undefined"
    :class="row"
    :style="{ paddingLeft: indent }"
    @select="
      (event) => {
        guardDisabled(event)
      }
    "
    @toggle="
      (event) => {
        guardDisabled(event)
      }
    "
  >
    <button
      v-if="hasChildren"
      type="button"
      data-testid="tree-item-toggle"
      class="flex shrink-0 items-center text-fg-subtle disabled:cursor-not-allowed"
      :disabled="value.disabled"
      @click.stop="handleToggle"
    >
      <Icon
        :icon="PhCaretDown"
        weight="fill"
        size="sm"
        class="transition-transform"
        :class="isExpanded && 'rotate-180'"
      />
    </button>
    <span v-else class="inline-block w-4 shrink-0" aria-hidden="true" />
    <slot
      :item="value"
      :level="level"
      :has-children="hasChildren"
      :is-expanded="isExpanded"
      :is-selected="isSelected"
      :is-indeterminate="isIndeterminate"
    />
    <span
      v-if="multiple"
      data-testid="tree-item-indicator"
      class="ml-auto flex shrink-0 items-center text-primary-fg-recess"
    >
      <Icon v-if="isIndeterminate" :icon="PhMinus" size="sm" />
      <Icon v-else-if="isSelected" :icon="PhCheck" size="sm" />
    </span>
  </TreeItem>
</template>

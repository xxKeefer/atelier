<script lang="ts">
import type { Component, InjectionKey } from 'vue'

// AtBreadcrumbItem reads the separator off this instead of a prop drilled
// through the ol/slot boundary -- items are slotted children, not direct
// props recipients of AtBreadcrumbs.
export const BREADCRUMB_SEPARATOR_KEY: InjectionKey<Component> = Symbol('breadcrumb-separator')
</script>

<script setup lang="ts">
import { PhCaretRight } from '@phosphor-icons/vue'
import { provide } from 'vue'

const props = withDefaults(defineProps<{ separator?: Component }>(), {
  separator: () => PhCaretRight,
})

provide(BREADCRUMB_SEPARATOR_KEY, props.separator)
</script>

<template>
  <nav aria-label="Breadcrumb">
    <ol class="flex flex-wrap items-center gap-1.5 font-body text-sm">
      <slot />
    </ol>
  </nav>
</template>

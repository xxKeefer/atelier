<script setup lang="ts">
import { useVirtualizer } from '@tanstack/vue-virtual'
import { computed, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    items: unknown[]
    estimateSize?: number
    overscan?: number
  }>(),
  {
    estimateSize: 40,
    overscan: 5,
  },
)

const scrollParent = ref<HTMLElement | null>(null)

const virtualizer = useVirtualizer(
  computed(() => ({
    count: props.items.length,
    getScrollElement: () => scrollParent.value,
    estimateSize: () => props.estimateSize,
    overscan: props.overscan,
  })),
)

const virtualItems = computed(() => virtualizer.value.getVirtualItems())
</script>

<template>
  <div ref="scrollParent" class="max-h-full overflow-auto">
    <ul
      role="list"
      class="relative w-full list-none pl-0"
      :style="{ height: `${virtualizer.getTotalSize()}px` }"
    >
      <li
        v-for="virtualItem in virtualItems"
        :key="String(virtualItem.key)"
        role="listitem"
        :aria-setsize="items.length"
        :aria-posinset="virtualItem.index + 1"
        class="absolute top-0 left-0 w-full text-fg-default font-body"
        :style="{ transform: `translateY(${virtualItem.start}px)` }"
      >
        <slot :item="items[virtualItem.index]" :index="virtualItem.index" />
      </li>
    </ul>
  </div>
</template>

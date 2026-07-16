<script setup lang="ts">
import { computed } from 'vue'

type Shape = 'rect' | 'circle' | 'text'

const props = withDefaults(
  defineProps<{
    shape?: Shape
    // CSS length, e.g. '2rem' or '100%'. No default -- pass the footprint of
    // whatever real content this is standing in for.
    width?: string
    // CSS length. Defaults to one text-line's height so an unconfigured
    // skeleton still renders visibly.
    height?: string
  }>(),
  { shape: 'rect', width: undefined, height: '1rem' },
)

const radiusClass = computed(() => {
  switch (props.shape) {
    case 'circle':
      return 'rounded-[var(--radius-full)]'
    case 'text':
      return 'rounded-[var(--radius-sm)]'
    default:
      return 'rounded-[var(--radius-md)]'
  }
})

const style = computed(() => ({ width: props.width, height: props.height }))
</script>

<template>
  <div
    aria-hidden="true"
    data-testid="skeleton"
    class="bg-[var(--color-surface-subtle)]"
    :class="radiusClass"
    :style="style"
  />
</template>

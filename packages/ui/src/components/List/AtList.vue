<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{ variant?: 'bulleted' | 'numbered' | 'plain' }>(), {
  variant: 'bulleted',
})

const tag = computed(() => (props.variant === 'numbered' ? 'ol' : 'ul'))

const listStyleClass = computed(() => {
  if (props.variant === 'numbered') return 'list-decimal pl-5'
  if (props.variant === 'plain') return 'list-none pl-0'
  return 'list-disc pl-5'
})
</script>

<template>
  <component :is="tag" :class="['flex flex-col gap-1 font-body text-fg-default', listStyleClass]">
    <slot />
  </component>
</template>

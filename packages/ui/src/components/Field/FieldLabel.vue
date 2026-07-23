<script setup lang="ts">
import type { Size } from '../../composables/useFieldChrome'
import { labelSizes } from '../../composables/useFieldChrome'

defineProps<{
  fieldId: string
  size: Size
}>()

defineEmits<{ click: [] }>()
</script>

<template>
  <label
    :for="fieldId"
    class="font-body font-bold text-fg-muted"
    :class="labelSizes[size]"
    @click="$emit('click')"
  >
    <slot />
  </label>
</template>

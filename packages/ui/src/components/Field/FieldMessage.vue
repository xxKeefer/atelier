<script setup lang="ts">
defineProps<{
  testid: string
  error?: string
  help?: string
}>()
</script>

<template>
  <p
    :data-testid="testid"
    class="min-h-[1lh] text-xs"
    :class="error ? 'text-danger-fg' : 'text-fg-subtle'"
  >
    {{ error || help }}
  </p>
</template>

<script setup lang="ts">
import { TabsContent } from 'reka-ui'

defineProps<{
  value: string
}>()
</script>

<template>
  <TabsContent
    :value="value"
    class="text-fg-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus"
  >
    <slot />
  </TabsContent>
</template>

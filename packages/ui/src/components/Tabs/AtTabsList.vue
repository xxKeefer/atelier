<script setup lang="ts">
import { TabsList } from 'reka-ui'

withDefaults(
  defineProps<{
    // Stretches triggers to share the list's width equally (each trigger gets
    // flex-1) instead of sizing to its own content.
    fullWidth?: boolean
  }>(),
  { fullWidth: false },
)
</script>

<template>
  <!-- fullWidth stretches every trigger to share the list's width equally.
       reka-ui's TabsTrigger renders as the bare <button> element with no
       wrapper, so the list can reach its children directly via a descendant
       selector -- same technique AtTabsTrigger itself uses for its
       border-as-seam rules. basis-0 forces an equal split of the row
       regardless of each trigger's own content width. -->
  <TabsList
    class="flex items-stretch"
    :class="fullWidth ? 'w-full [&>button]:flex-1 [&>button]:basis-0' : 'w-max'"
  >
    <slot />
  </TabsList>
</template>

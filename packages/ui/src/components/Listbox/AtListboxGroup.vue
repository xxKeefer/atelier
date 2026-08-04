<script setup lang="ts">
import { ListboxGroup } from 'reka-ui'
</script>

<template>
  <!-- The gap from a preceding sibling (bare item or another group) lives
       here, not on AtListbox's shared container -- that container has no
       gap of its own, so bare items stay flush for their border-as-seam
       treatment. `first:` drops it when the group opens the list. -->
  <ListboxGroup class="mt-4 flex flex-col gap-1 first:mt-0">
    <slot name="label" />
    <!-- A dedicated wrapper around the item run: keeps AtListboxItem's
         first:/last: corner rounding scoped to its own sibling items,
         rather than tripping over the label sharing this same parent. -->
    <div class="flex flex-col">
      <slot />
    </div>
  </ListboxGroup>
</template>

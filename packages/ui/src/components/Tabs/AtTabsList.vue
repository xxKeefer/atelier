<script setup lang="ts">
import { TabsIndicator, TabsList } from 'reka-ui'
import { computed, inject } from 'vue'
import { TABS_VARIANT_KEY } from './AtTabs.vue'

withDefaults(
  defineProps<{
    // Stretches triggers to share the list's width equally (each trigger gets
    // flex-1) instead of sizing to its own content.
    fullWidth?: boolean
  }>(),
  { fullWidth: false },
)

const injectedVariant = inject(TABS_VARIANT_KEY)
const variant = computed(() => injectedVariant?.value ?? 'default')
</script>

<template>
  <!-- fullWidth stretches every trigger to share the list's width equally.
       reka-ui's TabsTrigger renders as the bare <button> element with no
       wrapper, so the list can reach its children directly via a descendant
       selector -- same technique AtTabsTrigger itself uses for its
       border-as-seam rules. basis-0 forces an equal split of the row
       regardless of each trigger's own content width.

       Flat draws one shared baseline under the whole row instead of each
       trigger's own border, then floats TabsIndicator on top of it -- reka-ui
       measures the active trigger's offset/width itself (see TabsIndicator.js)
       and exposes it as --reka-tabs-indicator-position/-size on the element,
       so the underline only needs to read those vars, not remeasure anything. -->
  <TabsList
    class="relative flex items-stretch"
    :class="[
      fullWidth ? 'w-full [&>button]:flex-1 [&>button]:basis-0' : 'w-max',
      variant === 'flat'
        ? 'border-b-[3px] border-solid border-[color:var(--color-border-default)]'
        : '',
    ]"
  >
    <slot />
    <TabsIndicator
      v-if="variant === 'flat'"
      class="absolute bottom-0 h-[3px] w-[var(--reka-tabs-indicator-size)] translate-x-[var(--reka-tabs-indicator-position)] bg-[color:var(--color-primary-default)] transition-[transform,width] duration-[120ms] ease-[ease] motion-reduce:transition-none"
    />
  </TabsList>
</template>

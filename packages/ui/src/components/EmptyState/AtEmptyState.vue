<script setup lang="ts">
import { computed, useSlots, type Component } from 'vue'
import type { Size } from '../../composables/useFieldChrome'
import Icon from '../Icon/AtIcon.vue'

withDefaults(
  defineProps<{
    title: string
    description?: string
    // A phosphor icon component, e.g. `PhTray`. Passed straight through to
    // AtIcon's icon prop, same convention as AtBadge.
    icon?: Component
    size?: Size
  }>(),
  { description: undefined, icon: undefined, size: 'md' },
)

const slots = useSlots()
const hasActions = computed(() => slots.actions !== undefined)

// Bigger than AtBadge's icon scale -- here the icon is the block's visual
// anchor, not a small accent beside a label.
const iconSizes: Record<Size, 'lg' | 'xl' | '2xl'> = { sm: 'lg', md: 'xl', lg: '2xl' }
const titleSizes: Record<Size, string> = { sm: 'text-sm', md: 'text-base', lg: 'text-lg' }
const descriptionSizes: Record<Size, string> = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' }
const gaps: Record<Size, string> = { sm: 'gap-2', md: 'gap-3', lg: 'gap-4' }
</script>

<template>
  <!-- No background/border here by design -- this drops into whatever
       container (Card, page section, table body) the consumer already has,
       so baking in panel chrome would double it up. -->
  <div class="flex flex-col items-center text-center font-body" :class="gaps[size]">
    <Icon v-if="icon" data-testid="empty-state-icon" :icon="icon" :size="iconSizes[size]" />
    <p data-testid="empty-state-title" class="font-bold text-fg-default" :class="titleSizes[size]">
      {{ title }}
    </p>
    <p
      v-if="description"
      data-testid="empty-state-description"
      class="text-fg-subtle"
      :class="descriptionSizes[size]"
    >
      {{ description }}
    </p>
    <div v-if="hasActions" data-testid="empty-state-actions" class="mt-1 flex items-center gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { PhCircleNotch } from '@phosphor-icons/vue'
import { computed } from 'vue'
import { type Intent, intentSpinnerColors } from '../../constants/intents'
import Icon from '../Icon/AtIcon.vue'

type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    intent?: Intent
    size?: Size
    // Accessible name for standalone use (e.g. a bare spinner replacing a
    // panel's content while it loads). Omit when nested inside something that
    // already announces its own busy state (a loading Button, a Skeleton) --
    // the spinner then stays decorative.
    label?: string
  }>(),
  { intent: 'primary', size: 'md', label: undefined },
)

// One step up from AtIcon's own scale so a "sm" spinner still reads at a
// glance -- a spinner is the sole content of its area, not text-adjacent.
const iconSizes: Record<Size, 'md' | 'lg' | '2xl'> = {
  sm: 'md',
  md: 'lg',
  lg: '2xl',
}

const color = computed(() => intentSpinnerColors[props.intent])
const iconSize = computed(() => iconSizes[props.size])
</script>

<template>
  <Icon
    :icon="PhCircleNotch"
    :size="iconSize"
    :color="color"
    :label="label"
    data-testid="spinner"
    class="animate-spin motion-reduce:animate-none"
  />
</template>

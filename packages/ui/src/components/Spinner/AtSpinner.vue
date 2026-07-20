<script setup lang="ts">
import { PhCircleNotch } from '@phosphor-icons/vue'
import { computed } from 'vue'
import Icon from '../Icon/AtIcon.vue'

type Intent = 'primary' | 'secondary' | 'neutral' | 'danger' | 'success' | 'warning' | 'info'
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

// Same status-fill tokens Button's solid variant uses for its background,
// reused here as a foreground glyph colour since the spinner has no chip of
// its own to sit on.
const intentColors: Record<Intent, string> = {
  primary: 'var(--color-primary-default)',
  secondary: 'var(--color-secondary-default)',
  neutral: 'var(--color-fg-default)',
  danger: 'var(--color-danger-solid)',
  success: 'var(--color-success-solid)',
  warning: 'var(--color-warning-solid)',
  info: 'var(--color-info-solid)',
}

// One step up from AtIcon's own scale so a "sm" spinner still reads at a
// glance -- a spinner is the sole content of its area, not text-adjacent.
const iconSizes: Record<Size, 'md' | 'lg' | '2xl'> = {
  sm: 'md',
  md: 'lg',
  lg: '2xl',
}

const color = computed(() => intentColors[props.intent])
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

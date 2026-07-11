<script setup lang="ts">
import { computed } from 'vue'
import { PhInfo, PhQuestion, PhWarning } from '@phosphor-icons/vue'
import AtTooltip from './AtTooltip.vue'
import AtIcon from '../Icon/AtIcon.vue'

type Variant = 'warning' | 'info' | 'question'
type Side = 'top' | 'right' | 'bottom' | 'left'

const props = withDefaults(
  defineProps<{
    variant: Variant
    text: string
    side?: Side
    delay?: number
    disabled?: boolean
    defaultOpen?: boolean
  }>(),
  { side: 'left', delay: 700, disabled: false, defaultOpen: false },
)

// Icon carries the variant's meaning; label backs the accessible name since
// the icon is the tooltip's sole (otherwise decorative) trigger content.
const variants: Record<Variant, { icon: typeof PhWarning; label: string }> = {
  warning: { icon: PhWarning, label: 'Warning' },
  info: { icon: PhInfo, label: 'Information' },
  question: { icon: PhQuestion, label: 'Question' },
}

const variantConfig = computed(() => variants[props.variant])
</script>

<template>
  <AtTooltip
    :text="text"
    :side="side"
    :delay="delay"
    :disabled="disabled"
    :default-open="defaultOpen"
  >
    <AtIcon :icon="variantConfig.icon" :label="variantConfig.label" weight="fill" />
  </AtTooltip>
</template>

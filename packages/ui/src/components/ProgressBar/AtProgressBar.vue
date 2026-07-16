<script setup lang="ts">
import { ProgressIndicator, ProgressRoot } from 'reka-ui'
import { computed, useId } from 'vue'

type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    // Determinate value 0..max. Omit (or leave undefined/null) for indeterminate --
    // shown until the caller knows a value or hits an error, per the task's
    // "duration can't be determined" case.
    value?: number | null
    max?: number
    size?: Size
    // Visible label above the bar. Tied to the root via aria-labelledby so the
    // same text serves sighted and assistive-tech users.
    label?: string
    // Accessible name for when no visible label is rendered -- forwarded as
    // aria-label so screen readers still announce what the bar tracks.
    ariaLabel?: string
  }>(),
  {
    value: undefined,
    max: 100,
    size: 'md',
    label: undefined,
    ariaLabel: undefined,
  },
)

const autoId = useId()
const labelId = computed(() => (props.label ? `${autoId}-label` : undefined))

const indeterminate = computed(() => props.value === undefined || props.value === null)

const percent = computed(() => {
  const value = props.value
  if (value === undefined || value === null) return 0
  return Math.min(100, Math.max(0, (value / props.max) * 100))
})

// Border is a fixed 3px regardless of size (Input/Card convention), so each
// rung needs enough total height to leave a visible fill strip inside it.
const track: Record<Size, string> = {
  sm: 'h-3',
  md: 'h-4',
  lg: 'h-6',
}

// Square corners (rounded-md, matching Card/Input), recessed into a shadow-low
// well like Switch's track -- the empty portion reads as a carved-out channel.
const trackClasses = computed(
  () =>
    `relative w-full overflow-hidden rounded-md border-[3px] border-solid border-border-default bg-surface-default shadow-low ${track[props.size]}`,
)

// Indeterminate: no known value, so the fill can't track progress -- a full-width
// pulse (Tailwind's built-in animate-pulse, same primitive Button's loading state
// uses) signals "busy" without implying a false position.
const fillClasses = computed(() =>
  indeterminate.value
    ? 'h-full w-full bg-primary-default animate-pulse motion-reduce:animate-none'
    : 'h-full bg-primary-default transition-[width] duration-[120ms] ease-[ease]',
)
</script>

<template>
  <div class="flex w-full flex-col gap-1.5">
    <label v-if="label" :id="labelId" class="font-body text-sm text-fg-default">{{ label }}</label>
    <ProgressRoot
      :model-value="indeterminate ? null : value"
      :max="max"
      :aria-label="ariaLabel"
      :aria-labelledby="labelId"
      :class="trackClasses"
    >
      <ProgressIndicator
        :class="fillClasses"
        :style="indeterminate ? undefined : { width: `${percent}%` }"
      />
    </ProgressRoot>
  </div>
</template>

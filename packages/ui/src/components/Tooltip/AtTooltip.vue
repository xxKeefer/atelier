<script setup lang="ts">
import {
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from 'reka-ui'

type Side = 'top' | 'right' | 'bottom' | 'left'

withDefaults(
  defineProps<{
    text: string
    side?: Side
    // Hover-open delay in ms -- reka's own default (700) already reads as a
    // brief pause, kept as the default here rather than re-deciding it.
    delay?: number
    disabled?: boolean
    // Mounts already open, bypassing hover/focus. For static contexts (the
    // Snapshot board) rather than real interaction.
    defaultOpen?: boolean
  }>(),
  { side: 'top', delay: 700, disabled: false, defaultOpen: false },
)
</script>

<template>
  <!-- TooltipTrigger as-child projects the slot's own element as the trigger,
       so it keeps its native semantics (button, link, etc) instead of being
       wrapped in an extra span. avoidCollisions (reka default: true) flips the
       side when `side` would overflow the viewport. -->
  <TooltipProvider :delay-duration="delay">
    <TooltipRoot :disabled="disabled" :default-open="defaultOpen">
      <TooltipTrigger as-child>
        <slot />
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          :side="side"
          :side-offset="6"
          data-testid="tooltip-content"
          class="z-50 rounded-md bg-surface-strong px-3 py-1.5 font-body text-sm text-fg-default shadow-higher"
        >
          {{ text }}
          <TooltipArrow class="fill-surface-strong" />
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>

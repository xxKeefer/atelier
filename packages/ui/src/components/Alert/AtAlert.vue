<script setup lang="ts">
import { PhCheckCircle, PhInfo, PhWarning, PhXCircle } from '@phosphor-icons/vue'
import { computed, useSlots, type Component } from 'vue'
import Icon from '../Icon/AtIcon.vue'

type Intent = 'info' | 'success' | 'warning' | 'danger'

withDefaults(
  defineProps<{
    intent?: Intent
    // Rendered bold above the body. A single text prop, not a slot -- Alert's
    // title is always short, unlike Card's header region which composes
    // arbitrary markup.
    title?: string
    // false suppresses the role icon entirely; omitted/true shows the
    // intent's default glyph. Icon is never a slot -- the icon-to-role
    // mapping is the point (colourblind-safe hint), a consumer swapping it
    // would defeat that.
    icon?: boolean
  }>(),
  { intent: 'info', title: undefined, icon: true },
)

const slots = useSlots()
const hasActions = computed(() => slots.actions !== undefined)

const intentIcons: Record<Intent, Component> = {
  info: PhInfo,
  success: PhCheckCircle,
  warning: PhWarning,
  danger: PhXCircle,
}

// Tinted banner: bg + border + fg from the status colour group's canvas-tint
// shape (not the solid-fill shape Button uses -- Alert sits on the page as a
// tinted panel, not a filled control).
const intentVars: Record<Intent, Record<'--alert-bg' | '--alert-border' | '--alert-fg', string>> = {
  info: {
    '--alert-bg': 'var(--color-info-bg)',
    '--alert-border': 'var(--color-info-border)',
    '--alert-fg': 'var(--color-info-fg)',
  },
  success: {
    '--alert-bg': 'var(--color-success-bg)',
    '--alert-border': 'var(--color-success-border)',
    '--alert-fg': 'var(--color-success-fg)',
  },
  warning: {
    '--alert-bg': 'var(--color-warning-bg)',
    '--alert-border': 'var(--color-warning-border)',
    '--alert-fg': 'var(--color-warning-fg)',
  },
  danger: {
    '--alert-bg': 'var(--color-danger-bg)',
    '--alert-border': 'var(--color-danger-border)',
    '--alert-fg': 'var(--color-danger-fg)',
  },
}

const classes =
  'w-full flex items-start gap-3 rounded-md border-[3px] border-solid p-4 font-body ' +
  'bg-[var(--alert-bg)] border-[color:var(--alert-border)] text-[var(--alert-fg)]'
</script>

<template>
  <!-- role=alert: an interruption pattern by nature (all four intents), so
       assistive tech announces it on mount without a separate live/status
       prop. -->
  <div role="alert" :class="classes" :style="intentVars[intent]">
    <Icon
      v-if="icon"
      data-testid="alert-icon"
      :icon="intentIcons[intent]"
      size="lg"
      class="shrink-0"
    />
    <div class="flex min-w-0 flex-1 flex-col gap-1">
      <p v-if="title" data-testid="alert-title" class="font-bold">{{ title }}</p>
      <div data-testid="alert-body" class="text-sm">
        <slot />
      </div>
      <div v-if="hasActions" data-testid="alert-actions" class="mt-2 flex items-center gap-2">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

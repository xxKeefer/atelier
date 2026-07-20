<script setup lang="ts">
import { PhCheckSquare, PhInfo, PhWarning, PhWarningDiamond } from '@phosphor-icons/vue'
import type { Component } from 'vue'
import Icon from '../Icon/AtIcon.vue'

type Intent = 'info' | 'success' | 'warning' | 'danger'

withDefaults(
  defineProps<{
    intent?: Intent
    // false suppresses the role icon entirely; omitted/true shows the
    // intent's default glyph, same colourblind-safe hint as Alert.
    icon?: boolean
  }>(),
  { intent: 'info', icon: true },
)

const intentIcons: Record<Intent, Component> = {
  info: PhInfo,
  success: PhCheckSquare,
  warning: PhWarning,
  danger: PhWarningDiamond,
}

// Tinted card: same canvas-tint shape as Alert's status colour group.
const intentVars: Record<Intent, Record<'--toast-bg' | '--toast-border' | '--toast-fg', string>> = {
  info: {
    '--toast-bg': 'var(--color-info-bg)',
    '--toast-border': 'var(--color-info-border)',
    '--toast-fg': 'var(--color-info-fg)',
  },
  success: {
    '--toast-bg': 'var(--color-success-bg)',
    '--toast-border': 'var(--color-success-border)',
    '--toast-fg': 'var(--color-success-fg)',
  },
  warning: {
    '--toast-bg': 'var(--color-warning-bg)',
    '--toast-border': 'var(--color-warning-border)',
    '--toast-fg': 'var(--color-warning-fg)',
  },
  danger: {
    '--toast-bg': 'var(--color-danger-bg)',
    '--toast-border': 'var(--color-danger-border)',
    '--toast-fg': 'var(--color-danger-fg)',
  },
}

const classes =
  'flex w-full max-w-sm items-start gap-3 rounded-md border-[3px] border-solid p-4 font-body shadow-md ' +
  'bg-[var(--toast-bg)] border-[color:var(--toast-border)] text-[var(--toast-fg)]'
</script>

<template>
  <!-- role=status + aria-live=polite: a non-interrupting notification,
       announced without stealing focus -- unlike Alert's role=alert. -->
  <div role="status" aria-live="polite" :class="classes" :style="intentVars[intent]">
    <Icon
      v-if="icon"
      data-testid="toast-icon"
      :icon="intentIcons[intent]"
      size="lg"
      class="shrink-0"
    />
    <div data-testid="toast-body" class="min-w-0 flex-1 text-sm">
      <slot />
    </div>
  </div>
</template>

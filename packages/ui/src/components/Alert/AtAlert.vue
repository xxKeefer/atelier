<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { INTENT_ICONS, STATUS_INTENT_TOKENS, type StatusIntent } from '../../constants/intents'
import Icon from '../Icon/AtIcon.vue'

const props = withDefaults(
  defineProps<{
    intent?: StatusIntent
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

// Tinted banner: bg + border + fg from the status colour group's canvas-tint
// shape (not the solid-fill shape Button uses -- Alert sits on the page as a
// tinted panel, not a filled control).
const intentVars = computed(() => {
  const tokens = STATUS_INTENT_TOKENS[props.intent]
  return {
    '--alert-bg': tokens.bg,
    '--alert-border': tokens.border,
    '--alert-fg': tokens.fg,
  }
})

const classes =
  'w-full flex items-start gap-3 rounded-md border-[3px] border-solid p-4 font-body ' +
  'bg-[var(--alert-bg)] border-[color:var(--alert-border)] text-[var(--alert-fg)]'
</script>

<template>
  <!-- role=alert: an interruption pattern by nature (all four intents), so
       assistive tech announces it on mount without a separate live/status
       prop. -->
  <div role="alert" :class="classes" :style="intentVars">
    <Icon
      v-if="icon"
      data-testid="alert-icon"
      :icon="INTENT_ICONS[intent]"
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

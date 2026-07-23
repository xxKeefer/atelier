<script setup lang="ts">
import { PhX } from '@phosphor-icons/vue'
import { computed, useSlots } from 'vue'
import { INTENT_ICONS, STATUS_INTENT_TOKENS, type StatusIntent } from '../../constants/intents'
import Icon from '../Icon/AtIcon.vue'
import Button from '../Button/AtButton.vue'

const props = withDefaults(
  defineProps<{
    intent?: StatusIntent
    // false suppresses the role icon entirely; omitted/true shows the
    // intent's default glyph, same colourblind-safe hint as Alert.
    icon?: boolean
    // Whether to render the close button. Driven from outside -- a toast
    // wrapper (e.g. AtToastProvider) decides this based on whether it gave
    // the toast an auto-dismiss timeout; AtToast itself owns no timing.
    showClose?: boolean
  }>(),
  { intent: 'neutral', icon: true, showClose: true },
)

const emit = defineEmits<{ close: [] }>()

const slots = useSlots()
const hasActions = computed(() => slots.actions !== undefined)

// Tinted card: same canvas-tint shape as Alert's status colour group.
const intentVars = computed(() => {
  const tokens = STATUS_INTENT_TOKENS[props.intent]
  return {
    '--toast-bg': tokens.bg,
    '--toast-border': tokens.border,
    '--toast-fg': tokens.fg,
  }
})

const classes =
  'flex w-full max-w-sm items-start gap-3 rounded-md border-[3px] border-solid p-4 font-body shadow-md ' +
  'bg-[var(--toast-bg)] border-[color:var(--toast-border)] text-[var(--toast-fg)] ' +
  // Entry animation via @starting-style -- runs once on first paint after
  // mount, no JS/Transition wrapper needed. motion-reduce stills it per AC.
  'transition-[opacity,transform] duration-slow ease-out motion-reduce:transition-none ' +
  'starting:opacity-0 starting:-translate-y-1'
</script>

<template>
  <!-- role=status + aria-live=polite: a non-interrupting notification,
       announced without stealing focus -- unlike Alert's role=alert. -->
  <div role="status" aria-live="polite" :class="classes" :style="intentVars">
    <Icon
      v-if="icon"
      data-testid="toast-icon"
      :icon="INTENT_ICONS[intent]"
      size="lg"
      class="shrink-0"
    />
    <div data-testid="toast-body" class="min-w-0 flex-1 text-sm">
      <slot />
    </div>
    <div v-if="hasActions" data-testid="toast-actions" class="flex shrink-0 items-center gap-2">
      <slot name="actions" />
    </div>
    <Button
      v-if="showClose"
      data-testid="toast-close"
      variant="flat"
      :intent="intent"
      size="sm"
      aria-label="Close"
      class="shrink-0"
      @click="emit('close')"
    >
      <Icon :icon="PhX" size="sm" />
    </Button>
  </div>
</template>

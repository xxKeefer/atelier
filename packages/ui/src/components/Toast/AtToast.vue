<script setup lang="ts">
import { PhCheckSquare, PhInfo, PhWarning, PhWarningDiamond, PhX } from '@phosphor-icons/vue'
import { computed, onBeforeUnmount, onMounted, useSlots, useTemplateRef, type Component } from 'vue'
import Icon from '../Icon/AtIcon.vue'
import Button from '../Button/AtButton.vue'

type Intent = 'info' | 'success' | 'warning' | 'danger'

const props = withDefaults(
  defineProps<{
    intent?: Intent
    // false suppresses the role icon entirely; omitted/true shows the
    // intent's default glyph, same colourblind-safe hint as Alert.
    icon?: boolean
    // Auto-dismiss delay in ms. Omitted -- no auto-dismiss, and a close
    // button renders instead, per AC ("long enough timeout... if there is
    // no timeout, provide a button to close").
    timeout?: number
  }>(),
  { intent: 'info', icon: true, timeout: undefined },
)

const emit = defineEmits<{ close: [] }>()

const slots = useSlots()
const hasActions = computed(() => slots.actions !== undefined)

const rootRef = useTemplateRef<HTMLElement>('root')
let timer: ReturnType<typeof setTimeout> | undefined

function startTimer() {
  if (props.timeout === undefined) return
  timer = setTimeout(() => {
    emit('close')
  }, props.timeout)
}
function stopTimer() {
  clearTimeout(timer)
}

onMounted(startTimer)
onBeforeUnmount(stopTimer)

// Focus anywhere inside the toast (e.g. a future action button) pauses the
// timeout so it can't dismiss out from under an in-progress interaction;
// focus leaving the toast entirely resumes it.
function onFocusIn() {
  stopTimer()
}
function onFocusOut(event: FocusEvent) {
  if (rootRef.value?.contains(event.relatedTarget as Node | null)) return
  startTimer()
}

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
  'bg-[var(--toast-bg)] border-[color:var(--toast-border)] text-[var(--toast-fg)] ' +
  // Entry animation via @starting-style -- runs once on first paint after
  // mount, no JS/Transition wrapper needed. motion-reduce stills it per AC.
  'transition-[opacity,transform] duration-slow ease-out motion-reduce:transition-none ' +
  'starting:opacity-0 starting:-translate-y-1'
</script>

<template>
  <!-- role=status + aria-live=polite: a non-interrupting notification,
       announced without stealing focus -- unlike Alert's role=alert. -->
  <div
    ref="root"
    role="status"
    aria-live="polite"
    :class="classes"
    :style="intentVars[intent]"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
  >
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
    <div v-if="hasActions" data-testid="toast-actions" class="flex shrink-0 items-center gap-2">
      <slot name="actions" />
    </div>
    <Button
      v-if="timeout === undefined"
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

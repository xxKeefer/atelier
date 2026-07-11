<script setup lang="ts">
import { SwitchRoot, SwitchThumb } from 'reka-ui'
import { computed, useId } from 'vue'

const props = withDefaults(
  defineProps<{
    // v-model: on/off, no intermediate state (unlike Checkbox).
    modelValue?: boolean
    // Optional visible label, tied to the field by id so clicking it toggles the
    // switch. Omit it for a bare switch and forward an aria-label instead.
    label?: string
    disabled?: boolean
    name?: string
    value?: string
    id?: string
  }>(),
  {
    modelValue: false,
    label: undefined,
    disabled: false,
    name: undefined,
    value: undefined,
    id: undefined,
  },
)

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

// aria-label/aria-describedby etc fall through to the SwitchRoot button, not
// the wrapper, so the accessible name and form wiring land on the real control.
defineOptions({ inheritAttrs: false })

const autoId = useId()
const fieldId = computed(() => props.id ?? autoId)

const modelValue = computed({
  get: () => props.modelValue,
  set: (v: boolean) => {
    emit('update:modelValue', v)
  },
})

// Track: fixed pill, always resting at the recessed `low` well the thumb slides
// in (shadow.json: "low ... switch track" -- a single rung, not a ladder like
// Checkbox, since the track itself never lifts). Colourway keyed by reka-ui's
// data-state: neutral off, primary on.
const track =
  'relative inline-flex h-6 w-11 shrink-0 items-center rounded-md border-[3px] border-solid px-1 shadow-low ' +
  'transition-colors duration-[120ms] ease-[ease] motion-reduce:transition-none ' +
  'cursor-pointer disabled:cursor-not-allowed disabled:transition-none ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus ' +
  'data-[state=unchecked]:enabled:bg-surface-strong data-[state=unchecked]:enabled:border-border-strong ' +
  'data-[state=checked]:enabled:bg-primary-surface-strong data-[state=checked]:enabled:border-primary-border-default ' +
  'disabled:opacity-50 ' +
  'disabled:data-[state=unchecked]:bg-surface-strong disabled:data-[state=unchecked]:border-border-strong ' +
  'disabled:data-[state=checked]:bg-primary-surface-strong disabled:data-[state=checked]:border-primary-border-default'

// Thumb: raised at `high` (shadow.json: "high ... switch thumb"), popped off
// the track's recessed floor by lift-half -- same rest-at-lift/shadow-below
// mechanic as Button's default variant, so the hard-edge shadow reads as a
// real gap under the thumb instead of a flush-mounted flat square. Slides
// from the track's left to right edge as data-state flips.
const thumb =
  'inline-block h-4 w-4 rounded-sm border-2 border-solid border-border-default bg-fg-default shadow-high -translate-y-lift-half ' +
  'transition-transform duration-[120ms] ease-[ease] motion-reduce:transition-none ' +
  'data-[state=unchecked]:translate-x-0 data-[state=checked]:translate-x-5'
</script>

<template>
  <div class="flex items-center gap-2">
    <SwitchRoot
      :id="fieldId"
      v-model="modelValue"
      :disabled="disabled"
      :name="name"
      :value="value"
      :class="track"
      v-bind="$attrs"
    >
      <SwitchThumb :class="thumb" />
    </SwitchRoot>

    <label
      v-if="label"
      :for="fieldId"
      class="font-body text-base text-fg-default"
      :class="disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'"
    >
      {{ label }}
    </label>
  </div>
</template>

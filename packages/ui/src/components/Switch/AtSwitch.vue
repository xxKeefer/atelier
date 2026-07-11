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
// Checkbox, since the track itself never lifts). A recess pairs with the
// *recessed* colourway, not the raised one -- mirrors Checkbox's own checked
// (shadow-low) state, which pairs bg-surface-default/border-border-default
// neutral, and its danger checked state, which pairs bg-danger-surface-recess
// -- so primary uses bg-primary-surface-recess here, not surface-strong.
const track =
  'relative inline-flex h-6 w-11 shrink-0 items-center rounded-md border-[3px] border-solid px-1 shadow-low ' +
  'transition-colors duration-[120ms] ease-[ease] motion-reduce:transition-none ' +
  'cursor-pointer disabled:cursor-not-allowed disabled:transition-none ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus ' +
  'data-[state=unchecked]:enabled:bg-surface-default data-[state=unchecked]:enabled:border-border-default ' +
  'data-[state=checked]:enabled:bg-primary-surface-recess data-[state=checked]:enabled:border-primary-border-default data-[state=checked]:enabled:shadow-primary-low ' +
  'disabled:opacity-50 ' +
  'disabled:data-[state=unchecked]:bg-surface-default disabled:data-[state=unchecked]:border-border-default ' +
  'disabled:data-[state=checked]:bg-primary-surface-recess disabled:data-[state=checked]:border-primary-border-default disabled:data-[state=checked]:shadow-primary-low'

// Thumb: sits at the raised `higher` rung -- shadow.json's most prominent
// lift, the same rung Button's resting default variant uses -- pressed up out
// of the track's recess by lift-full so the hard-edge shadow reads as a real
// gap, not a flush square. Fill uses the *raised* token per state (surface
// -strong neutral, primary.default on) -- shadow.json pairs `higher` with
// surface.strong, and Button's own primary fill is --color-primary-default --
// never the track's own recess fill, or the cast shadow (same rung's colour)
// has nothing to contrast against and disappears into the surface beneath.
const thumb =
  'inline-block h-4 w-4 rounded-sm border-2 border-solid -translate-y-lift-full ' +
  'transition-transform duration-[120ms] ease-[ease] motion-reduce:transition-none ' +
  'data-[state=unchecked]:translate-x-0 data-[state=checked]:translate-x-5 ' +
  'data-[state=unchecked]:bg-surface-strong data-[state=unchecked]:border-border-strong data-[state=unchecked]:shadow-higher ' +
  'data-[state=checked]:bg-primary-default data-[state=checked]:border-primary-border-strong data-[state=checked]:shadow-primary-higher'
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

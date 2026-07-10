<script setup lang="ts">
import { PhCheck, PhMinus } from '@phosphor-icons/vue'
import { CheckboxIndicator, CheckboxRoot } from 'reka-ui'
import { computed, useId } from 'vue'
import Icon from '../Icon/AtIcon.vue'

type CheckedState = boolean | 'indeterminate'

const props = withDefaults(
  defineProps<{
    // v-model: false/true, or 'indeterminate' when only some children are selected.
    modelValue?: CheckedState
    // Optional visible label, tied to the field by id so clicking it toggles the
    // box. Omit it for a bare checkbox and forward an aria-label instead.
    label?: string
    // Error text under the label, coloured danger. Swaps the box to the danger
    // colourway too.
    error?: string
    disabled?: boolean
    name?: string
    value?: string
    id?: string
  }>(),
  {
    modelValue: false,
    label: undefined,
    error: undefined,
    disabled: false,
    name: undefined,
    value: undefined,
    id: undefined,
  },
)

const emit = defineEmits<{ 'update:modelValue': [value: CheckedState] }>()

// aria-label/aria-describedby etc fall through to the CheckboxRoot button, not
// the wrapper, so the accessible name and form wiring land on the real control.
defineOptions({ inheritAttrs: false })

const autoId = useId()
const fieldId = computed(() => props.id ?? autoId)

const modelValue = computed({
  get: () => props.modelValue,
  set: (v: CheckedState) => {
    emit('update:modelValue', v)
  },
})

// The box: fixed size, square, on the same skeuomorphic ladder as Button.
// Unchecked rests popped at `high` (a hovered button's height); hovering it
// flattens to `flat`; checked depresses into the inset `low` recess; indeterminate
// sits at `flat` with a border, like a flat-variant button. disabled freezes
// whatever rung the state is naturally at and dims it -- it never transitions.
const base =
  'relative inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md ' +
  'border-[3px] border-solid text-fg-default ' +
  'transition-[transform,box-shadow] duration-[120ms] ease-[ease] motion-reduce:transition-none ' +
  'cursor-pointer disabled:cursor-not-allowed disabled:transition-none ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus'

// Neutral colourway, keyed by reka-ui's data-state (unchecked/checked/indeterminate).
const neutral =
  'data-[state=unchecked]:enabled:-translate-y-lift-half data-[state=unchecked]:enabled:bg-surface-strong data-[state=unchecked]:enabled:border-border-strong data-[state=unchecked]:enabled:shadow-high ' +
  'hover:enabled:data-[state=unchecked]:translate-y-0 hover:enabled:data-[state=unchecked]:bg-surface-default hover:enabled:data-[state=unchecked]:border-border-default hover:enabled:data-[state=unchecked]:shadow-flat ' +
  'data-[state=checked]:enabled:translate-y-0 data-[state=checked]:enabled:bg-surface-default data-[state=checked]:enabled:border-border-default data-[state=checked]:enabled:shadow-low ' +
  'data-[state=indeterminate]:enabled:translate-y-0 data-[state=indeterminate]:enabled:bg-surface-default data-[state=indeterminate]:enabled:border-border-default data-[state=indeterminate]:enabled:shadow-flat ' +
  'disabled:opacity-50 ' +
  'disabled:data-[state=unchecked]:-translate-y-lift-half disabled:data-[state=unchecked]:bg-surface-strong disabled:data-[state=unchecked]:border-border-strong disabled:data-[state=unchecked]:shadow-high ' +
  'disabled:data-[state=checked]:translate-y-0 disabled:data-[state=checked]:bg-surface-default disabled:data-[state=checked]:border-border-default disabled:data-[state=checked]:shadow-low ' +
  'disabled:data-[state=indeterminate]:translate-y-0 disabled:data-[state=indeterminate]:bg-surface-default disabled:data-[state=indeterminate]:border-border-default disabled:data-[state=indeterminate]:shadow-flat'

// Error colourway: same mechanic, danger-tinted ladder + a danger border on the
// indeterminate/flat rung so the error reads even with no depth cue.
const danger =
  'data-[state=unchecked]:enabled:-translate-y-lift-half data-[state=unchecked]:enabled:bg-danger-surface-strong data-[state=unchecked]:enabled:border-danger-border-strong data-[state=unchecked]:enabled:shadow-danger-high ' +
  'hover:enabled:data-[state=unchecked]:translate-y-0 hover:enabled:data-[state=unchecked]:bg-danger-surface-recess hover:enabled:data-[state=unchecked]:border-danger-border-default hover:enabled:data-[state=unchecked]:shadow-flat ' +
  'data-[state=checked]:enabled:translate-y-0 data-[state=checked]:enabled:bg-danger-surface-recess data-[state=checked]:enabled:border-danger-border-default data-[state=checked]:enabled:shadow-danger-low ' +
  'data-[state=indeterminate]:enabled:translate-y-0 data-[state=indeterminate]:enabled:bg-danger-surface-recess data-[state=indeterminate]:enabled:border-danger-border-default data-[state=indeterminate]:enabled:shadow-flat ' +
  'disabled:opacity-50 ' +
  'disabled:data-[state=unchecked]:-translate-y-lift-half disabled:data-[state=unchecked]:bg-danger-surface-strong disabled:data-[state=unchecked]:border-danger-border-strong disabled:data-[state=unchecked]:shadow-danger-high ' +
  'disabled:data-[state=checked]:translate-y-0 disabled:data-[state=checked]:bg-danger-surface-recess disabled:data-[state=checked]:border-danger-border-default disabled:data-[state=checked]:shadow-danger-low ' +
  'disabled:data-[state=indeterminate]:translate-y-0 disabled:data-[state=indeterminate]:bg-danger-surface-recess disabled:data-[state=indeterminate]:border-danger-border-default disabled:data-[state=indeterminate]:shadow-flat'

const boxClasses = computed(() => [base, props.error ? danger : neutral])
</script>

<template>
  <div class="flex flex-col gap-1">
    <div class="flex items-center gap-2">
      <CheckboxRoot
        :id="fieldId"
        v-model="modelValue"
        :disabled="disabled"
        :name="name"
        :value="value"
        :class="boxClasses"
        v-bind="$attrs"
      >
        <CheckboxIndicator force-mount class="flex items-center justify-center">
          <Icon v-if="modelValue === true" :icon="PhCheck" size="sm" />
          <Icon v-else-if="modelValue === 'indeterminate'" :icon="PhMinus" size="sm" />
        </CheckboxIndicator>
      </CheckboxRoot>

      <label
        v-if="label"
        :for="fieldId"
        class="font-body text-base text-fg-default"
        :class="disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'"
      >
        {{ label }}
      </label>
    </div>

    <p v-if="error" data-testid="checkbox-error" class="pl-8 text-xs text-danger-fg">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { RadioGroupIndicator, RadioGroupItem } from 'reka-ui'
import { computed, useId } from 'vue'
import { checkedStateLadder } from '../../constants/checkedState'

const props = withDefaults(
  defineProps<{
    // The value this radio represents within its parent AtRadioGroup.
    value: string
    // Optional visible label, tied to the field by id so clicking it selects
    // the radio. Omit it for a bare radio and forward an aria-label instead.
    label?: string
    // Error text under the label, coloured danger. Swaps the button to the
    // danger colourway too.
    error?: string
    disabled?: boolean
    id?: string
  }>(),
  {
    label: undefined,
    error: undefined,
    disabled: false,
    id: undefined,
  },
)

// aria-label/aria-describedby etc fall through to the RadioGroupItem button,
// not the wrapper, so the accessible name and form wiring land on the real control.
defineOptions({ inheritAttrs: false })

const autoId = useId()
const fieldId = computed(() => props.id ?? autoId)

// The button: fixed size, circular, on the same skeuomorphic ladder as
// Checkbox/Button. Unchecked rests popped at `high` (a hovered button's
// height); hovering it flattens to `flat`; checked depresses into the inset
// `low` recess. disabled freezes whatever rung the state is naturally at and
// dims it -- it never transitions.
const base =
  'relative inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full ' +
  'border-[3px] border-solid text-fg-default ' +
  'transition-[transform,box-shadow] duration-[120ms] ease-[ease] motion-reduce:transition-none ' +
  'cursor-pointer disabled:cursor-not-allowed disabled:transition-none ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus'

// Neutral/danger colourways, keyed by reka-ui's data-state
// (unchecked/checked). Shared with AtCheckbox; Radio has no indeterminate state.
const neutral = checkedStateLadder('neutral', ['unchecked', 'checked'])
const danger = checkedStateLadder('danger', ['unchecked', 'checked'])

const buttonClasses = computed(() => [base, props.error ? danger : neutral])
</script>

<template>
  <div class="flex flex-col gap-1">
    <div class="flex items-center gap-2">
      <RadioGroupItem
        :id="fieldId"
        v-slot="{ checked }"
        :value="value"
        :disabled="disabled"
        :class="buttonClasses"
        v-bind="$attrs"
      >
        <RadioGroupIndicator force-mount class="flex items-center justify-center">
          <span v-if="checked" class="h-2.5 w-2.5 rounded-full bg-current" />
        </RadioGroupIndicator>
      </RadioGroupItem>

      <label
        v-if="label"
        :for="fieldId"
        class="font-body text-base text-fg-default"
        :class="disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'"
      >
        {{ label }}
      </label>
    </div>

    <p v-if="error" data-testid="radio-error" class="pl-8 text-xs text-danger-fg">
      {{ error }}
    </p>
  </div>
</template>

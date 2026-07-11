<script setup lang="ts">
import { computed, useId } from 'vue'

type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    // v-model: the multi-line string value.
    modelValue?: string
    // Optional visible label. When given, it's tied to the field by id so
    // clicking it focuses the field. Omit it for a bare field and forward an
    // aria-label instead for the accessible name.
    label?: string
    // Help text under the field, on the normal surface (not inside the recess).
    help?: string
    // Error text. Takes the message line's place when present, coloured danger.
    error?: string
    placeholder?: string
    size?: Size
    rows?: number
    // A consumer-supplied id wins (to point an external label or
    // aria-describedby at the field); otherwise one is minted.
    id?: string
  }>(),
  {
    modelValue: '',
    label: undefined,
    help: undefined,
    error: undefined,
    placeholder: undefined,
    size: 'md',
    rows: 3,
    id: undefined,
  },
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

// Native attrs (aria-label, name, rows/cols, ...) fall through to the
// <textarea>, not the wrapper, so the accessible name and form wiring land on
// the real control.
defineOptions({ inheritAttrs: false })

const autoId = useId()
const fieldId = computed(() => props.id ?? autoId)

// "Messaged" mode: the field carries a label and/or a help/error line. In this
// mode the field reserves a fixed line of space below for the message so
// toggling it never shifts the layout. A bare field stays vertically compact,
// reserving nothing.
const messaged = computed(() => [props.label, props.help, props.error].some(Boolean))

const onInput = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLTextAreaElement).value)
}

// The recess -- same deep-recess rung (shadow-lower) as AtInput's bucket, the
// hard-edge zero-blur inset shadow every recessed surface in the system uses.
// Disabled drops to shadow-low, the shallow-recess rung. Unlike AtInput,
// there's no prefix/suffix to gang against, so the field keeps its own full
// rounding.
const base =
  'w-full font-body text-fg-default ' +
  'bg-surface-default placeholder:text-fg-subtle ' +
  'border-[3px] border-solid border-border-default ' +
  'shadow-lower disabled:shadow-low ' +
  'transition-[box-shadow,border-color,background-color] duration-[120ms] ease-[ease] motion-reduce:transition-none ' +
  'disabled:cursor-not-allowed disabled:opacity-50 ' +
  'focus:outline-2 focus:outline-offset-2 focus:outline-border-focus ' +
  'rounded-md'

// An error shifts the whole recess onto the danger colourway's own recessed
// rungs -- surface, rim, and shadow together -- same idiom as AtInput.
const errorClasses = 'bg-danger-surface-recess border-danger-border-default shadow-danger-lower'

// Field padding mirrors AtInput's size scale.
const sizes: Record<Size, string> = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-base px-4 py-2',
  lg: 'text-lg px-6 py-3',
}

// The label rides one step below the field's text size, muted, on the surface.
const labelSizes: Record<Size, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <!-- Label on the normal surface, tied to the field by id: clicking it
         focuses the field. -->
    <label
      v-if="label"
      :for="fieldId"
      class="font-body font-bold text-fg-muted"
      :class="labelSizes[size]"
    >
      {{ label }}
    </label>

    <textarea
      :id="fieldId"
      :value="modelValue"
      :placeholder="placeholder"
      :rows="rows"
      :class="[base, sizes[size], error && errorClasses]"
      v-bind="$attrs"
      @input="onInput"
    />

    <!-- The reserved message line: present only in messaged mode, with a
         minimum of one line of height so swapping error <-> help <-> nothing
         never shifts the layout. Error displaces help when both are set. -->
    <p
      v-if="messaged"
      data-testid="textarea-message"
      class="min-h-[1lh] text-xs"
      :class="error ? 'text-danger-fg' : 'text-fg-subtle'"
    >
      {{ error || help }}
    </p>
  </div>
</template>

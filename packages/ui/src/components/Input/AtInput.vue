<script setup lang="ts">
import { computed, useId, useSlots } from 'vue'

type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    // v-model: the single-line string value.
    modelValue?: string
    // Optional visible label. When given, it's tied to the field by id so
    // clicking it focuses the input. Omit it for a bare field (e.g. a search box
    // in a filter bar) and forward an aria-label instead for the accessible name.
    label?: string
    // Help text under the field, on the normal surface (not inside the recess).
    help?: string
    // Error text. Takes the message line's place when present, coloured danger.
    error?: string
    placeholder?: string
    size?: Size
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
    id: undefined,
  },
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

// Native attrs (aria-label, name, type, autocomplete, ...) fall through to the
// <input>, not the wrapper, so the accessible name and form wiring land on the
// real control.
defineOptions({ inheritAttrs: false })

const autoId = useId()
const fieldId = computed(() => props.id ?? autoId)

// "Messaged" mode: the field carries a label and/or a help/error line. In this
// mode the field reserves a fixed line of space below for the message so toggling
// it never shifts the layout (the message swaps in place). A bare field -- no
// label, help, or error -- stays vertically compact, reserving nothing.
const messaged = computed(() => [props.label, props.help, props.error].some(Boolean))

// The #icon slot is optional -- a consumer drops in an AtIcon to mark the
// field's purpose. Detected via useSlots (mirrors AtButton's iconOnly check)
// so an unused slot costs the field nothing: no extra padding, no positioning
// context beyond what's already there.
const slots = useSlots()
const hasIcon = computed(() => !!slots.icon)

const onInput = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}

// The recess -- the inverse of the button's extruded bottom edge. The field is a
// bucket sunk into the page: the deepest surface colour (bg-canvas) reads as a
// hole punched into whatever it sits on, and a layered inset shadow casts the
// walls of the depression. Depth lives in --at-input-depth; disabled halves it
// (a shallower bucket), mirroring the button's own half-depressed disabled
// geometry -- same depth idiom, not the flat variant's plain border. The
// placeholder, being centred text, sits in the deepest part of the bucket. Focus
// swaps to the system pink ring, matching the button.
const base =
  'w-full font-body rounded-md text-fg-default ' +
  'bg-[var(--color-bg-canvas)] placeholder:text-fg-subtle ' +
  'border-[3px] border-solid border-[color:var(--color-border-default)] ' +
  '[--at-input-depth:5px] disabled:[--at-input-depth:2.5px] ' +
  'shadow-[inset_0_var(--at-input-depth)_6px_-1px_rgba(0,0,0,0.55),inset_0_2px_3px_0_rgba(0,0,0,0.4)] ' +
  'transition-[box-shadow,border-color] duration-[120ms] ease-[ease] motion-reduce:transition-none ' +
  'disabled:cursor-not-allowed disabled:opacity-50 ' +
  'focus:outline-2 focus:outline-offset-2 focus:outline-border-focus'

// The error state re-colours the recess's rim, matching the flat/recessed rung
// of the danger colourway (border-danger-border-default, same token Elevation
// uses for its recessed danger rungs) rather than the button's solid-fill edge
// token -- the bucket stays a border treatment, not an extruded one.
const errorClasses = 'border-danger-border-default'

// Field padding mirrors the button size scale (button gap doesn't apply here).
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

// The icon sits inside the recess at the field's start, inset by the same
// amount as the field's own horizontal padding so it lines up with where text
// would otherwise begin.
const iconInsets: Record<Size, string> = {
  sm: 'pl-3',
  md: 'pl-4',
  lg: 'pl-6',
}

// When an icon is present the field's own left padding grows to clear the
// icon plus a gap, rather than sitting under it.
const iconPadding: Record<Size, string> = {
  sm: 'pl-8',
  md: 'pl-10',
  lg: 'pl-12',
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <!-- Label on the normal surface, tied to the field by id: clicking it focuses
         the input. -->
    <label
      v-if="label"
      :for="fieldId"
      class="font-body font-bold text-fg-muted"
      :class="labelSizes[size]"
    >
      {{ label }}
    </label>

    <div class="relative">
      <!-- Decorative-by-default (AtIcon owns its own aria-hidden/label); this
           span only positions it and keeps clicks passing through to the
           input. -->
      <span
        v-if="hasIcon"
        class="pointer-events-none absolute inset-y-0 left-0 flex items-center text-fg-subtle"
        :class="iconInsets[size]"
      >
        <slot name="icon" />
      </span>

      <input
        :id="fieldId"
        :value="modelValue"
        :placeholder="placeholder"
        type="text"
        :class="[base, sizes[size], hasIcon && iconPadding[size], error && errorClasses]"
        v-bind="$attrs"
        @input="onInput"
      />
    </div>

    <!-- The reserved message line: present only in messaged mode, with a minimum
         of one line of height so swapping error <-> help <-> nothing never shifts
         the layout. Error displaces help when both are set. -->
    <p
      v-if="messaged"
      data-testid="input-message"
      class="min-h-[1lh] text-xs"
      :class="error ? 'text-danger-fg' : 'text-fg-subtle'"
    >
      {{ error || help }}
    </p>
  </div>
</template>

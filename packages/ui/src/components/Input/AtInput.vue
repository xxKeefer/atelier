<script setup lang="ts">
import { computed, useSlots } from 'vue'
import type { Size } from '../../composables/useFieldChrome'
import { useFieldChrome } from '../../composables/useFieldChrome'
import FieldLabel from '../Field/FieldLabel.vue'
import FieldMessage from '../Field/FieldMessage.vue'

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

const { fieldId, messaged } = useFieldChrome(props)

// The #icon slot is optional -- a consumer drops in an AtIcon to mark the
// field's purpose. Detected via useSlots (mirrors AtButton's iconOnly check)
// so an unused slot costs the field nothing: no extra padding, no positioning
// context beyond what's already there.
const slots = useSlots()
const hasIcon = computed(() => !!slots.icon)
const hasPrefix = computed(() => !!slots.prefix)
const hasSuffix = computed(() => !!slots.suffix)

const onInput = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}

// The recess -- the inverse of the button's extruded bottom edge. The field
// sits on the elevation ladder's deep-recess rung (shadow-lower: the same
// hard-edge, zero-blur inset shadow every other recessed surface in the
// system uses -- Elevation's recess tiles, Checkbox/Radio's checked state),
// not a hand-rolled blurred shadow. That hard edge is what reads as a real
// depression instead of a soft bordered box. Disabled drops to shadow-low,
// the ladder's shallow-recess rung -- a shallower bucket, mirroring the
// button's own half-depressed disabled geometry, same depth idiom as before
// but off the real rungs instead of a custom depth var. The placeholder,
// being centred text, sits in the deepest part of the bucket. Focus swaps to
// the system pink ring, matching the button.
const base =
  'w-full font-body text-fg-default ' +
  'bg-surface-default placeholder:text-fg-subtle ' +
  'border-[3px] border-solid border-border-default ' +
  'shadow-lower disabled:shadow-low ' +
  'transition-[box-shadow,border-color,background-color] transition-press ' +
  'disabled:cursor-not-allowed disabled:opacity-50 ' +
  'focus:outline-2 focus:outline-offset-2 focus:outline-border-focus'

// The field and its prefix/suffix gang into one flush assembly -- like a
// cassette deck's transport-button row, each segment butted zero-gap against
// its neighbour, the seam itself (border + shadow) doing the separating
// instead of a visible gap. Only the outer ends of the whole run are
// rounded; a join between two segments is always square on both sides that
// touch. The field rounds whichever of its own ends has no flanking segment.
const fieldRounding = computed(() => [
  !hasPrefix.value && 'rounded-l-md',
  !hasSuffix.value && 'rounded-r-md',
])

// An error shifts the whole recess onto the danger colourway's own recessed
// rungs -- surface, rim, and shadow together (bg-danger-surface-recess,
// border-danger-border-default, shadow-danger-lower), the same trio Elevation
// pairs for its danger tiles -- rather than only recolouring the border. The
// bucket stays a recess, just danger-tinted top to bottom.
const errorClasses = 'bg-danger-surface-recess border-danger-border-default shadow-danger-lower'

// Field padding mirrors the button size scale (button gap doesn't apply here).
const sizes: Record<Size, string> = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-base px-4 py-2',
  lg: 'text-lg px-6 py-3',
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

// A prefix/suffix box: bordered frame on the ladder's flat rung (shadow-flat,
// pairs with surface.default per the token's own doc) rather than the
// field's own deep recess -- a flush, unrecessed tab flanking the bucket
// that actually receives input, mirroring how AtButton's flat variant reads
// next to its default extruded one. Only its outer edge rounds (prefix:
// left, suffix: right); the edge butted against the field carries no border
// at all -- the field's own border is the seam, so the two segments don't
// stack into a double-width line where they touch.
const prefixSuffixClasses =
  'flex items-center justify-center font-body text-fg-subtle ' +
  'bg-surface-default border-[3px] border-solid border-border-default shadow-flat'
</script>

<template>
  <div class="flex flex-col gap-1">
    <!-- Label on the normal surface, tied to the field by id: clicking it focuses
         the input. -->
    <FieldLabel v-if="label" :field-id="fieldId" :size="size">{{ label }}</FieldLabel>

    <div class="flex items-stretch">
      <!-- Prefix: a shallower recess flanking the field, e.g. a currency
           symbol or unit. Ganged flush against the field -- only its outer
           (left) edge rounds. -->
      <span
        v-if="hasPrefix"
        data-testid="input-prefix"
        :class="[prefixSuffixClasses, sizes[size], 'rounded-l-md border-r-0']"
      >
        <slot name="prefix" />
      </span>

      <div class="relative flex-1">
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
          :class="[
            base,
            fieldRounding,
            sizes[size],
            hasIcon && iconPadding[size],
            error && errorClasses,
          ]"
          v-bind="$attrs"
          @input="onInput"
        />
      </div>

      <!-- Suffix: a shallower recess flanking the field, e.g. a unit or
           payment provider mark. Ganged flush against the field -- only its
           outer (right) edge rounds. -->
      <span
        v-if="hasSuffix"
        data-testid="input-suffix"
        :class="[prefixSuffixClasses, sizes[size], 'rounded-r-md border-l-0']"
      >
        <slot name="suffix" />
      </span>
    </div>

    <!-- The reserved message line: present only in messaged mode, with a minimum
         of one line of height so swapping error <-> help <-> nothing never shifts
         the layout. Error displaces help when both are set. -->
    <FieldMessage v-if="messaged" testid="input-message" :error="error" :help="help" />
  </div>
</template>

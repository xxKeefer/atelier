<script setup lang="ts">
import type { Size } from '../../composables/useFieldChrome'
import { ListboxFilter } from 'reka-ui'
import { computed, inject, watch } from 'vue'
import { FIELD_SIZES } from '../../constants/fieldSizes'
import { LISTBOX_FILTER_KEY } from './AtListbox.vue'

const props = withDefaults(
  defineProps<{ modelValue?: string; placeholder?: string; size?: Size }>(),
  { modelValue: '', placeholder: undefined, size: 'md' },
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

defineOptions({ inheritAttrs: false })

// Controlled the same way AtInput is -- modelValue/update:modelValue, no
// internal state. reka-ui's ListboxFilter has its own composition-safe
// (IME) v-model support, so this proxies straight into it rather than
// hand-rolling an @input listener.
const modelValue = computed({
  get: () => props.modelValue,
  set: (v: string) => {
    emit('update:modelValue', v)
  },
})

// Separately mirrored into AtListbox's shared filter ref (write-only from
// here) so AtListboxItem, arbitrarily nested under AtListboxGroup, can read
// the current filter text without it being drilled through the composition
// as a prop.
const injectedFilter = inject(LISTBOX_FILTER_KEY)
watch(
  () => props.modelValue,
  (v) => {
    if (injectedFilter) {
      injectedFilter.value = v
    }
  },
  { immediate: true },
)

// Same recess treatment as AtInput's field -- shares the token vocabulary,
// not the component, since AtListboxFilter has no label/help/error chrome
// (AtListbox is a bare widget, not a form field).
const base =
  'w-full font-body text-fg-default ' +
  'bg-surface-default placeholder:text-fg-subtle ' +
  'border-thick rounded-md ' +
  'shadow-lower disabled:shadow-low ' +
  'transition-[box-shadow,border-color,background-color] transition-press ' +
  'disabled:cursor-not-allowed disabled:opacity-50 ' +
  'focus:outline-2 focus:outline-offset-2 focus:outline-border-focus'
</script>

<template>
  <ListboxFilter
    v-model="modelValue"
    :placeholder="placeholder"
    :class="[base, FIELD_SIZES[size]]"
    v-bind="$attrs"
  />
</template>

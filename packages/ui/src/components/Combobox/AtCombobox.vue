<script setup lang="ts">
import {
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxPortal,
  ComboboxRoot,
  ComboboxViewport,
} from 'reka-ui'
import { computed, ref } from 'vue'
import type { Size } from '../../composables/useFieldChrome'
import { useFieldChrome } from '../../composables/useFieldChrome'
import { FIELD_SIZES } from '../../constants/fieldSizes'
import FieldLabel from '../Field/FieldLabel.vue'

const props = withDefaults(
  defineProps<{
    // v-model: the selected option's value. Strictly one of `options` --
    // unmatched typed text never commits, see ComboboxInput's
    // resetSearchTermOnBlur below.
    modelValue?: string
    options: { value: string; label: string }[]
    // Optional visible label, tied to the input by id so clicking it opens
    // the combobox. Omit it for a bare field and forward an aria-label instead.
    label?: string
    placeholder?: string
    size?: Size
    id?: string
  }>(),
  {
    modelValue: undefined,
    label: undefined,
    placeholder: undefined,
    size: 'md',
    id: undefined,
  },
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

defineOptions({ inheritAttrs: false })

const { fieldId } = useFieldChrome(props)

const modelValue = computed({
  get: () => props.modelValue,
  set: (v: string) => {
    emit('update:modelValue', v)
  },
})

const open = ref(false)

// ComboboxInput opens on pointerdown via open-on-click, not the native
// label-for click-forwarding a <label> gives an <input> -- same gotcha
// AtSelect's onLabelClick solves, see its comment.
const onLabelClick = () => {
  open.value = true
}

// The whole trigger run is the popper's reference -- mirrors AtSelect, kept
// for parity even though this slice has no prefix/suffix/icon flanking it yet.
const groupEl = ref<HTMLElement>()

// Same low-recess trigger rung as AtSelect's SelectTrigger, applied to a real
// <input> instead of a button.
const triggerClasses = FIELD_SIZES

const trigger =
  'w-full font-body text-fg-default bg-surface-default border-[3px] border-solid ' +
  'border-border-default shadow-low rounded-md ' +
  'disabled:cursor-not-allowed disabled:opacity-50 ' +
  'placeholder:text-fg-subtle ' +
  'focus:outline-none focus-visible:outline-none'

// Mirrors AtSelect's options menu: the GroupedControls vertical gang, each
// row bordered and rounding only at the stack's outer ends.
const content = 'overflow-hidden rounded-md bg-surface-default'

const item =
  'flex cursor-pointer items-center px-4 py-2 font-body text-base text-fg-default outline-none ' +
  'border-[3px] border-solid border-border-default bg-surface-default shadow-flat ' +
  'data-[highlighted]:bg-surface-subtle data-[highlighted]:shadow-low ' +
  'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50'

const itemPosition = (index: number, length: number) => [
  index === 0 && 'rounded-t-md',
  index === length - 1 ? 'rounded-b-md' : 'border-b-0',
]

const displayValue = (value: unknown) =>
  props.options.find((option) => option.value === value)?.label ?? ''
</script>

<template>
  <div class="flex flex-col gap-1">
    <FieldLabel v-if="label" :field-id="fieldId" :size="size" @click="onLabelClick">{{
      label
    }}</FieldLabel>

    <div ref="groupEl" class="flex items-stretch rounded-md">
      <ComboboxRoot v-model="modelValue" v-model:open="open" class="flex-1" open-on-click>
        <ComboboxInput
          :id="fieldId"
          :display-value="displayValue"
          :placeholder="placeholder"
          :class="[trigger, triggerClasses[size]]"
          v-bind="$attrs"
        />

        <ComboboxPortal>
          <ComboboxContent
            :class="content"
            :reference="groupEl"
            position="popper"
            align="end"
            :side-offset="4"
          >
            <ComboboxViewport>
              <ComboboxItem
                v-for="(option, index) in options"
                :key="option.value"
                :value="option.value"
                :text-value="option.label"
                :class="[item, itemPosition(index, options.length)]"
              >
                {{ option.label }}
              </ComboboxItem>

              <ComboboxEmpty :class="[item, 'rounded-md cursor-default']">
                No results
              </ComboboxEmpty>
            </ComboboxViewport>
          </ComboboxContent>
        </ComboboxPortal>
      </ComboboxRoot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PhX } from '@phosphor-icons/vue'
import {
  ComboboxCancel,
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
import Icon from '../Icon/AtIcon.vue'

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

// ComboboxCancel (reka-ui) already resets the internal search term and
// input display -- we only need to clear our own v-model on top of it.
const onClear = () => {
  modelValue.value = ''
}

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

// The clear button occupies the same right-side slot AtSelect's caret sits
// in -- reserve room in the input's own padding so typed text never runs
// under it.
const clearPadding: Record<Size, string> = {
  sm: 'pr-8',
  md: 'pr-9',
  lg: 'pr-10',
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <FieldLabel v-if="label" :field-id="fieldId" :size="size" @click="onLabelClick">{{
      label
    }}</FieldLabel>

    <div ref="groupEl" class="flex items-stretch rounded-md">
      <ComboboxRoot v-model="modelValue" v-model:open="open" class="relative flex-1" open-on-click>
        <ComboboxInput
          :id="fieldId"
          :display-value="displayValue"
          :placeholder="placeholder"
          :class="[trigger, triggerClasses[size], modelValue && clearPadding[size]]"
          v-bind="$attrs"
        />

        <ComboboxCancel
          v-if="modelValue"
          data-testid="combobox-clear"
          aria-label="Clear"
          class="absolute inset-y-0 right-0 flex items-center px-3 text-fg-subtle outline-none hover:opacity-75 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus"
          @click="onClear"
        >
          <Icon :icon="PhX" size="sm" />
        </ComboboxCancel>

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

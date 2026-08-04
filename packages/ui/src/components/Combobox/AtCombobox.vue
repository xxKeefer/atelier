<script setup lang="ts">
import { PhWarningCircle, PhX } from '@phosphor-icons/vue'
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
import FieldMessage from '../Field/FieldMessage.vue'
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
    // Help text under the field, on the normal surface. Error displaces it
    // when both are set.
    help?: string
    // Error text. Takes the message line's place when present, coloured danger,
    // and adds a warning icon in the trigger.
    error?: string
    placeholder?: string
    size?: Size
    disabled?: boolean
    id?: string
  }>(),
  {
    modelValue: undefined,
    label: undefined,
    help: undefined,
    error: undefined,
    placeholder: undefined,
    size: 'md',
    disabled: false,
    id: undefined,
  },
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

defineOptions({ inheritAttrs: false })

const { fieldId, messaged } = useFieldChrome(props)

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
  if (!props.disabled) open.value = true
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

// Mirrors AtSelect's errorClasses: the recess rim re-colours to the danger
// border token, same border treatment as the trigger's default rim.
const errorClasses = 'border-danger-border-default'

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

// The clear button and/or error icon occupy the same right-side slot
// AtSelect's caret sits in -- reserve room in the input's own padding so
// typed text never runs under them. Two icons (error + clear, both showing
// at once) need more room than one.
const rightIconPadding: Record<Size, string> = {
  sm: 'pr-8',
  md: 'pr-9',
  lg: 'pr-10',
}

const rightIconPaddingDouble: Record<Size, string> = {
  sm: 'pr-14',
  md: 'pr-16',
  lg: 'pr-18',
}

const showClear = computed(() => Boolean(modelValue.value) && !props.disabled)

const rightPadding = computed(() => {
  const iconCount = (props.error ? 1 : 0) + (showClear.value ? 1 : 0)
  if (iconCount === 2) return rightIconPaddingDouble[props.size]
  if (iconCount === 1) return rightIconPadding[props.size]
  return ''
})
</script>

<template>
  <div class="flex flex-col gap-1">
    <FieldLabel v-if="label" :field-id="fieldId" :size="size" @click="onLabelClick">{{
      label
    }}</FieldLabel>

    <div ref="groupEl" class="flex items-stretch rounded-md">
      <ComboboxRoot
        v-model="modelValue"
        v-model:open="open"
        class="relative flex-1"
        open-on-click
        :disabled="disabled"
      >
        <ComboboxInput
          :id="fieldId"
          :display-value="displayValue"
          :placeholder="placeholder"
          :disabled="disabled"
          :class="[trigger, triggerClasses[size], rightPadding, error && errorClasses]"
          v-bind="$attrs"
        />

        <span
          v-if="error || showClear"
          class="absolute inset-y-0 right-0 flex items-center gap-1 px-3"
        >
          <span v-if="error" data-testid="combobox-error-icon" class="text-danger-fg">
            <Icon :icon="PhWarningCircle" size="sm" />
          </span>

          <ComboboxCancel
            v-if="showClear"
            data-testid="combobox-clear"
            aria-label="Clear"
            class="flex items-center text-fg-subtle outline-none hover:opacity-75 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus"
            @click="onClear"
          >
            <Icon :icon="PhX" size="sm" />
          </ComboboxCancel>
        </span>

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

    <!-- The reserved message line: present only in messaged mode (label,
         help, or error set), with a minimum of one line of height so
         swapping error <-> help <-> nothing never shifts the layout. Error
         displaces help when both are set. -->
    <FieldMessage v-if="messaged" testid="combobox-message" :error="error" :help="help" />
  </div>
</template>

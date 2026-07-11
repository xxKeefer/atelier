<script setup lang="ts">
import { PhCaretDown, PhWarningCircle } from '@phosphor-icons/vue'
import {
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'reka-ui'
import { computed, ref, useId } from 'vue'
import Icon from '../Icon/AtIcon.vue'

type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    // v-model: the selected option's value.
    modelValue?: string
    options: { value: string; label: string }[]
    // Optional visible label, tied to the trigger by id so clicking it opens
    // the dropdown. Omit it for a bare select and forward an aria-label instead.
    label?: string
    // Help text under the field, on the normal surface. Error displaces it
    // when both are set.
    help?: string
    // Error text. Takes the message line's place when present, coloured danger,
    // and adds a warning icon in the trigger alongside the chevron.
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

const autoId = useId()
const fieldId = computed(() => props.id ?? autoId)

const modelValue = computed({
  get: () => props.modelValue,
  set: (v: string) => {
    emit('update:modelValue', v)
  },
})

// reka-ui's trigger opens on pointerdown, not click -- the native label-for
// click-forwarding a <label> gives a <button> fires "click" only, so it never
// reaches the trigger's open handler. Open explicitly instead.
const open = ref(false)
const onLabelClick = () => {
  if (!props.disabled) open.value = true
}

// The trigger sits at the low surface, the same shallow-recess rung a checked
// checkbox/radio depresses into -- the field reads as already-settled, not an
// empty bucket like AtInput's deeper recess.
const triggerClasses: Record<Size, string> = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-base px-4 py-2',
  lg: 'text-lg px-6 py-3',
}

const trigger =
  'flex w-full items-center justify-between gap-2 font-body rounded-md text-fg-default ' +
  'bg-surface-default border-[3px] border-solid border-border-default shadow-low ' +
  'disabled:cursor-not-allowed disabled:opacity-50 ' +
  'data-[placeholder]:text-fg-subtle ' +
  'focus:outline-2 focus:outline-offset-2 focus:outline-border-focus'

// Mirrors AtInput's errorClasses: the recess rim re-colours to the danger
// border token, same border treatment as the trigger's default rim.
const errorClasses = 'border-danger-border-default'

// "Messaged" mode: the field carries a label, help, and/or an error line,
// reserving a fixed line of space below so the message swaps in place
// without shifting the layout. Mirrors AtInput's `messaged`.
const messaged = computed(() => [props.label, props.help, props.error].some(Boolean))

const labelSizes: Record<Size, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
}

// The options menu is recessed at the same low surface as the trigger, with
// a divider splitting each option -- a menu carved into the page, not a
// floating card.
const content =
  'overflow-hidden rounded-md bg-surface-default border-[3px] border-solid border-border-default shadow-low'

const item =
  'flex cursor-pointer items-center px-4 py-2 font-body text-base text-fg-default outline-none ' +
  'data-[highlighted]:bg-surface-strong data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50'
</script>

<template>
  <div class="flex flex-col gap-1">
    <label
      v-if="label"
      :for="fieldId"
      class="font-body font-bold text-fg-muted"
      :class="labelSizes[size]"
      @click="onLabelClick"
    >
      {{ label }}
    </label>

    <SelectRoot v-model="modelValue" v-model:open="open" :disabled="disabled">
      <SelectTrigger
        :id="fieldId"
        :class="[trigger, triggerClasses[size], error && errorClasses]"
        v-bind="$attrs"
      >
        <SelectValue :placeholder="placeholder" />
        <span v-if="error" data-testid="select-error-icon" class="text-danger-fg">
          <Icon :icon="PhWarningCircle" size="sm" />
        </span>
        <SelectIcon>
          <Icon :icon="PhCaretDown" size="sm" />
        </SelectIcon>
      </SelectTrigger>

      <SelectPortal>
        <SelectContent :class="content" position="popper" :side-offset="4">
          <SelectViewport class="p-1">
            <template v-for="(option, index) in options" :key="option.value">
              <SelectSeparator v-if="index > 0" class="my-1 h-[3px] bg-border-default" />
              <SelectItem :value="option.value" :class="item">
                <SelectItemText>{{ option.label }}</SelectItemText>
              </SelectItem>
            </template>
          </SelectViewport>
        </SelectContent>
      </SelectPortal>
    </SelectRoot>

    <!-- The reserved message line: present only in messaged mode (label,
         help, or error set), with a minimum of one line of height so
         swapping error <-> help <-> nothing never shifts the layout. Error
         displaces help when both are set. -->
    <p
      v-if="messaged"
      data-testid="select-message"
      class="min-h-[1lh] text-xs"
      :class="error ? 'text-danger-fg' : 'text-fg-subtle'"
    >
      {{ error || help }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { PhCaretDown } from '@phosphor-icons/vue'
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
    placeholder?: string
    size?: Size
    disabled?: boolean
    id?: string
  }>(),
  {
    modelValue: undefined,
    label: undefined,
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
      <SelectTrigger :id="fieldId" :class="[trigger, triggerClasses[size]]" v-bind="$attrs">
        <SelectValue :placeholder="placeholder" />
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
  </div>
</template>

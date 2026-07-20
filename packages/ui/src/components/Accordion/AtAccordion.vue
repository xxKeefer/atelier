<script setup lang="ts">
import { AccordionRoot } from 'reka-ui'

type Type = 'single' | 'multiple'

withDefaults(
  defineProps<{
    type?: Type
    // Single-type only: clicking the open item's trigger closes it again,
    // leaving none open. Ignored for multiple (each item toggles independently).
    collapsible?: boolean
    disabled?: boolean
    modelValue?: string | string[]
  }>(),
  { type: 'single', collapsible: true, disabled: false, modelValue: undefined },
)

const emit = defineEmits<{ 'update:modelValue': [value: string | string[] | undefined] }>()
</script>

<template>
  <!-- Bordered panel, one shared box for every item; AtAccordionItem draws the
       seams between items as its own bottom border, Card-style. -->
  <AccordionRoot
    :type="type"
    :collapsible="collapsible"
    :disabled="disabled"
    :model-value="modelValue"
    class="flex w-full flex-col overflow-hidden rounded-md border-[3px] border-solid border-[color:var(--color-border-default)] bg-surface-default font-body"
    @update:model-value="(value) => emit('update:modelValue', value)"
  >
    <slot />
  </AccordionRoot>
</template>

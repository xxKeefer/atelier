<script setup lang="ts">
import { RadioGroupRoot } from 'reka-ui'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    label?: string
    disabled?: boolean
    name?: string
  }>(),
  {
    modelValue: undefined,
    label: undefined,
    disabled: false,
    name: undefined,
  },
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const modelValue = computed({
  get: () => props.modelValue,
  set: (v: string) => {
    emit('update:modelValue', v)
  },
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <h3 v-if="label" class="font-body text-base text-fg-default">{{ label }}</h3>
    <RadioGroupRoot
      v-model="modelValue"
      :disabled="disabled"
      :name="name"
      class="flex flex-col gap-2"
    >
      <slot />
    </RadioGroupRoot>
  </div>
</template>

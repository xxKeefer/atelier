<script setup lang="ts">
import { CheckboxGroupRoot } from 'reka-ui'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string[]
    label?: string
    disabled?: boolean
  }>(),
  {
    modelValue: () => [],
    label: undefined,
    disabled: false,
  },
)

const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()

const modelValue = computed({
  get: () => props.modelValue,
  set: (v: string[]) => {
    emit('update:modelValue', v)
  },
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <h3 v-if="label" class="font-body text-base text-fg-default">{{ label }}</h3>
    <CheckboxGroupRoot v-model="modelValue" :disabled="disabled" class="flex flex-col gap-2">
      <slot />
    </CheckboxGroupRoot>
  </div>
</template>

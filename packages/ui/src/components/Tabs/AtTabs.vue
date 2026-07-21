<script setup lang="ts">
import { TabsRoot } from 'reka-ui'
import { computed } from 'vue'

// variant is stubbed to 'default' only -- the Flat/underlined look is a
// future step (see the Tabs task doc). Accepting the prop now means
// AtTabsList/AtTabsTrigger don't need a breaking prop addition later.
type Variant = 'default'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    defaultValue?: string
    variant?: Variant
    orientation?: 'horizontal' | 'vertical'
  }>(),
  {
    modelValue: undefined,
    defaultValue: undefined,
    variant: 'default',
    orientation: 'horizontal',
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
  <TabsRoot
    v-model="modelValue"
    :default-value="defaultValue"
    :orientation="orientation"
    class="flex flex-col gap-3"
  >
    <slot />
  </TabsRoot>
</template>

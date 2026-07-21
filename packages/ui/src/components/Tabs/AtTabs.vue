<script lang="ts">
import type { ComputedRef, InjectionKey } from 'vue'

export type TabsVariant = 'default' | 'flat'

// AtTabsList/AtTabsTrigger read the active variant off this instead of a
// prop drilled through every intermediate slot -- they're siblings-of-a-
// slot under TabsRoot, not direct children of AtTabs.
export const TABS_VARIANT_KEY: InjectionKey<ComputedRef<TabsVariant>> = Symbol('tabs-variant')
</script>

<script setup lang="ts">
import { TabsRoot } from 'reka-ui'
import { computed, provide } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    defaultValue?: string
    variant?: TabsVariant
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

provide(
  TABS_VARIANT_KEY,
  computed(() => props.variant),
)
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

<script setup lang="ts">
import { computed, type Component } from 'vue'
import AtAvatar from './AtAvatar.vue'

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type Shape = 'circle' | 'square'

interface GroupAvatar {
  src?: string
  alt?: string
  initials?: string
  icon?: Component
  label?: string
}

const props = withDefaults(
  defineProps<{
    avatars: GroupAvatar[]
    // Avatars beyond this count collapse into a single "+N" overflow avatar.
    // Omit to render every avatar with no cap.
    max?: number
    size?: Size
    shape?: Shape
    label?: string
  }>(),
  {
    max: undefined,
    size: 'md',
    shape: 'circle',
    label: undefined,
  },
)

// Negative margin scales with the avatar box so the overlap reads
// proportionally at every size instead of a fixed pixel offset.
const overlap: Record<Size, string> = {
  xs: '-ml-2',
  sm: '-ml-2.5',
  md: '-ml-3',
  lg: '-ml-3.5',
  xl: '-ml-4',
}

const visible = computed(() =>
  props.max !== undefined ? props.avatars.slice(0, props.max) : props.avatars,
)
const overflowCount = computed(() =>
  props.max !== undefined ? Math.max(props.avatars.length - props.max, 0) : 0,
)
</script>

<template>
  <div class="flex" role="group" :aria-label="label">
    <AtAvatar
      v-for="(avatar, index) in visible"
      :key="index"
      v-bind="avatar"
      :size="size"
      :shape="shape"
      :class="[index > 0 && overlap[size], 'ring-2 ring-[var(--color-surface-default)]']"
      :style="{ zIndex: visible.length - index }"
    />
    <AtAvatar
      v-if="overflowCount > 0"
      :initials="`+${overflowCount}`"
      :size="size"
      :shape="shape"
      :class="[overlap[size], 'ring-2 ring-[var(--color-surface-default)]']"
      :style="{ zIndex: 0 }"
    />
  </div>
</template>

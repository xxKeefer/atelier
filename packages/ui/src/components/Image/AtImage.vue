<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    src: string
    // Pass "" for a purely decorative image -- an empty alt hides it from
    // assistive tech instead of falling back to the filename.
    alt: string
    width?: number | string
    height?: number | string
    // e.g. "16/9" or 1.78. With no explicit width/height, the image scales to
    // its parent's width and derives height from this ratio (CSS aspect-ratio).
    aspectRatio?: number | string
  }>(),
  { width: undefined, height: undefined, aspectRatio: undefined },
)

const toDimension = (value: number | string) =>
  typeof value === 'number' ? `${value.toString()}px` : value

const style = computed(() => ({
  width:
    props.width !== undefined
      ? toDimension(props.width)
      : props.aspectRatio !== undefined
        ? '100%'
        : undefined,
  height: props.height !== undefined ? toDimension(props.height) : undefined,
  aspectRatio: props.aspectRatio !== undefined ? String(props.aspectRatio) : undefined,
}))
</script>

<template>
  <img :src="src" :alt="alt" class="block object-cover" :style="style" />
</template>

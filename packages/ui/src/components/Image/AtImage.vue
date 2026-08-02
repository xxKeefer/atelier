<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { PhImageBroken } from '@phosphor-icons/vue'
import AtIcon from '../Icon/AtIcon.vue'

const props = withDefaults(
  defineProps<{
    src?: string
    // Pass "" for a purely decorative image -- an empty alt hides it from
    // assistive tech instead of falling back to the filename.
    alt: string
    width?: number | string
    height?: number | string
    // e.g. "16/9" or 1.78. With no explicit width/height, the image scales to
    // its parent's width and derives height from this ratio (CSS aspect-ratio).
    aspectRatio?: number | string
    // Native srcset density descriptors, e.g. "photo.jpg 1x, photo-2x.jpg 2x".
    // Forwarded as-is to the underlying <img> -- the browser picks the asset.
    srcset?: string
  }>(),
  {
    src: undefined,
    width: undefined,
    height: undefined,
    aspectRatio: undefined,
    srcset: undefined,
  },
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

const failed = ref(false)
watch(
  () => props.src,
  () => (failed.value = false),
)
const showFallback = computed(() => !props.src || failed.value)
</script>

<template>
  <img
    v-if="!showFallback"
    :src="src"
    :srcset="srcset"
    :alt="alt"
    class="block object-cover"
    :style="style"
    @error="failed = true"
  />
  <div
    v-else
    class="flex items-center justify-center border-[3px] border-solid border-border-default bg-surface-subtle text-fg-subtle"
    :style="style"
    role="img"
    :aria-label="alt || undefined"
  >
    <AtIcon :icon="PhImageBroken" size="lg" />
  </div>
</template>

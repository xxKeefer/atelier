<script setup lang="ts">
import { computed, ref, watch, type Component } from 'vue'
import { PhUser } from '@phosphor-icons/vue'
import AtIcon from '../Icon/AtIcon.vue'

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type Shape = 'circle' | 'square'

const props = withDefaults(
  defineProps<{
    src?: string
    // Pass "" for a purely decorative image -- an empty alt hides it from
    // assistive tech instead of falling back to the filename.
    alt?: string
    // Fallback text shown when there is no image (or it failed to load).
    // Callers pass already-derived initials -- deriving them from a name is
    // presentation logic that belongs one level up, not in this primitive.
    initials?: string
    // Fallback glyph when there are no initials either.
    icon?: Component
    size?: Size
    shape?: Shape
    // Accessible name for a fallback (icon or initials) that stands in for a
    // person/entity with no visible name nearby. Omit when the avatar sits
    // beside its own text label -- that label already names it.
    label?: string
  }>(),
  {
    src: undefined,
    alt: '',
    initials: undefined,
    icon: () => PhUser,
    size: 'md',
    shape: 'circle',
    label: undefined,
  },
)

const sizes: Record<Size, { box: string; text: string; icon: 'sm' | 'md' | 'lg' | 'xl' | '2xl' }> =
  {
    xs: { box: 'size-6', text: 'text-[10px]', icon: 'sm' },
    sm: { box: 'size-8', text: 'text-xs', icon: 'md' },
    md: { box: 'size-10', text: 'text-sm', icon: 'lg' },
    lg: { box: 'size-12', text: 'text-base', icon: 'xl' },
    xl: { box: 'size-16', text: 'text-lg', icon: '2xl' },
  }

const shapes: Record<Shape, string> = {
  circle: 'rounded-full',
  square: 'rounded-md',
}

const failed = ref(false)
watch(
  () => props.src,
  () => (failed.value = false),
)

const showImage = computed(() => !!props.src && !failed.value)
const showInitials = computed(() => !showImage.value && !!props.initials)

// Mirrors AtIcon: a visible-text fallback (initials) already carries its own
// accessible name, so `label` only promotes the glyph-only fallback to a
// named `img`. An image fallback keeps `alt`'s own semantics.
const a11y = computed(() => {
  if (showImage.value || showInitials.value) return {}
  return props.label !== undefined
    ? { role: 'img', 'aria-label': props.label }
    : { 'aria-hidden': true }
})
</script>

<template>
  <span
    class="inline-flex shrink-0 items-center justify-center overflow-hidden bg-[var(--color-secondary-default)] text-[var(--color-secondary-fg)]"
    :class="[sizes[size].box, shapes[shape]]"
    v-bind="a11y"
  >
    <img
      v-if="showImage"
      :src="src"
      :alt="alt"
      class="size-full object-cover"
      @error="failed = true"
    />
    <span v-else-if="showInitials" class="font-body font-bold" :class="sizes[size].text">
      {{ initials }}
    </span>
    <AtIcon v-else :icon="icon" :size="sizes[size].icon" />
  </span>
</template>

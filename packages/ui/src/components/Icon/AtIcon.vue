<script setup lang="ts">
import { computed, type Component } from 'vue'

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
type Weight = 'regular' | 'fill'

const props = withDefaults(
  defineProps<{
    // A phosphor icon component, e.g. `PhHeart` from @phosphor-icons/vue. Passed
    // as the component (not a name) so consumers import only the glyphs they use.
    icon: Component
    size?: Size
    weight?: Weight
    // A CSS colour -- pass a token var (e.g. var(--color-danger-solid)) to
    // paint the glyph, or omit to inherit the parent's currentColor.
    color?: string
    // Omit for the common case: the icon is decorative and hidden from the a11y
    // tree. Pass a label only when the icon carries meaning on its own.
    label?: string
  }>(),
  { size: 'md', weight: 'regular', color: undefined, label: undefined },
)

// Sizes map onto the type scale so an icon lines up with the text beside it.
// font-size drives the glyph: phosphor renders width/height at 1em, so it scales
// off the wrapper's font-size rather than a hardcoded pixel value.
const sizes: Record<Size, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
}

// Decorative by default: aria-hidden, no accessible name -- an icon next to a
// text label is noise to a screen reader. A label promotes it to an img with
// that name. Interactivity is never the icon's job; a Button or Link owns that.
const a11y = computed(() =>
  props.label !== undefined ? { role: 'img', 'aria-label': props.label } : { 'aria-hidden': true },
)
</script>

<template>
  <!-- color sets the wrapper's currentColor; the glyph fills with currentColor,
       so it inherits. The inner svg is always aria-hidden -- the wrapper owns the
       semantics (hidden, or named via label). -->
  <span
    class="inline-flex leading-none"
    :class="sizes[size]"
    :style="color ? { color } : undefined"
    v-bind="a11y"
  >
    <component :is="icon" :weight="weight" aria-hidden="true" />
  </span>
</template>

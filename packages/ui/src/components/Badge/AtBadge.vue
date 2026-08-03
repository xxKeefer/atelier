<script setup lang="ts">
import { PhX } from '@phosphor-icons/vue'
import { Comment, computed, useSlots, type Component } from 'vue'
import {
  BADGE_SOLID_TOKENS,
  STATUS_INTENT_TOKENS,
  type StatusIntent,
} from '../../constants/intents'
import Icon from '../Icon/AtIcon.vue'

type Variant = 'solid' | 'faded'
type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    intent?: StatusIntent
    variant?: Variant
    size?: Size
    // A phosphor icon component, e.g. `PhCheck`. Unlike Alert's icon, this
    // isn't tied to intent -- a Badge's role comes from its colour, the icon
    // just illustrates the label, so any glyph is valid.
    icon?: Component
    // Renders a trailing remove button that emits `dismiss` -- the badge
    // stays presentational, the consumer owns removing it from whatever list
    // renders the badges.
    dismissible?: boolean
  }>(),
  { intent: 'neutral', variant: 'solid', size: 'md', icon: undefined, dismissible: false },
)

const emit = defineEmits<{ dismiss: [] }>()

// solid draws from Button's per-intent fill tokens (the same chip colour a
// solid Button would use); faded draws from Alert's tinted-panel tokens (a
// toned-down background for contexts that shouldn't compete for attention).
const badgeVars = computed(() => {
  if (props.variant === 'faded') {
    const tokens = STATUS_INTENT_TOKENS[props.intent]
    return { '--badge-bg': tokens.bg, '--badge-fg': tokens.fg }
  }
  const tokens = BADGE_SOLID_TOKENS[props.intent]
  return { '--badge-bg': tokens.bg, '--badge-fg': tokens.fg }
})

const sizes: Record<Size, string> = {
  sm: 'text-xs px-1.5 py-0.5 gap-1',
  md: 'text-xs px-2 py-1 gap-1',
  lg: 'text-sm px-2.5 py-1 gap-1.5',
}

// Content-less badges (no label, icon-only) use even padding on every side
// instead of the label-shaped px/py above -- paired with aspect-square below,
// that forces a circle instead of the oval a wide/short pill produces.
const emptySizes: Record<Size, string> = {
  sm: 'text-xs p-1',
  md: 'text-xs p-1.5',
  lg: 'text-sm p-2',
}

// Bumped a step above what sm/md's text-xs would pair with (AtIcon's 'xs' is
// too small to stay recognisable at this scale) -- same call Breadcrumbs made
// bumping its item icons to md (commit f44e5c6).
const iconSizes: Record<Size, 'sm' | 'md'> = { sm: 'sm', md: 'sm', lg: 'md' }

const slots = useSlots()

// A slot fn can return whitespace-only text vnodes or a lone v-if comment
// placeholder rather than an empty array, so a plain length check isn't
// enough -- filter those out to tell a genuinely empty slot from real content.
const hasLabel = computed(() =>
  (slots.default?.() ?? []).some((vnode) => {
    if (vnode.type === Comment) return false
    if (typeof vnode.children === 'string') return vnode.children.trim().length > 0
    return true
  }),
)

const classes = computed(() => [
  'inline-flex items-center justify-center rounded-full font-body font-bold ' +
    'bg-[var(--badge-bg)] text-[var(--badge-fg)]',
  hasLabel.value ? sizes[props.size] : [emptySizes[props.size], 'aspect-square'],
])
</script>

<template>
  <span :class="classes" :style="badgeVars">
    <Icon v-if="icon" data-testid="badge-icon" :icon="icon" :size="iconSizes[size]" />
    <slot />
    <button
      v-if="dismissible"
      type="button"
      data-testid="badge-dismiss"
      aria-label="Remove"
      class="inline-flex items-center justify-center rounded-full hover:opacity-75 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus"
      @click="emit('dismiss')"
    >
      <Icon :icon="PhX" :size="iconSizes[size]" />
    </button>
  </span>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'
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
  }>(),
  { intent: 'neutral', variant: 'solid', size: 'md', icon: undefined },
)

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

// Bumped a step above what sm/md's text-xs would pair with (AtIcon's 'xs' is
// too small to stay recognisable at this scale) -- same call Breadcrumbs made
// bumping its item icons to md (commit f44e5c6).
const iconSizes: Record<Size, 'sm' | 'md'> = { sm: 'sm', md: 'sm', lg: 'md' }

const classes = computed(() => [
  'inline-flex items-center justify-center rounded-full font-body font-bold ' +
    'bg-[var(--badge-bg)] text-[var(--badge-fg)]',
  sizes[props.size],
])
</script>

<template>
  <span :class="classes" :style="badgeVars">
    <Icon v-if="icon" data-testid="badge-icon" :icon="icon" :size="iconSizes[size]" />
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Intent } from '../../constants/intents'

type LinkIntent = Intent | 'inherit'

const props = withDefaults(
  defineProps<{
    intent?: LinkIntent
    href?: string
    disabled?: boolean
  }>(),
  {
    intent: 'inherit',
    href: undefined,
    disabled: false,
  },
)

// An href resolves the root to an <a> (role=link); otherwise a <button>
// (role=button), same resolution AtButton uses. Unlike Button, a link never
// forces target=_blank -- in-app navigation is the common case here, and a
// consumer can still pass target/rel through as plain fallthrough attrs.
const tag = computed(() => (props.href !== undefined ? 'a' : 'button'))

// An <a> has no native disabled attribute: drop the href so it isn't
// navigable (which also strips the link role) and announce via
// aria-disabled. A <button> uses its native disabled.
const rootProps = computed(() =>
  props.href !== undefined
    ? {
        href: props.disabled ? undefined : props.href,
        'aria-disabled': props.disabled || undefined,
      }
    : { type: 'button', disabled: props.disabled },
)

// inherit (the default) sets no colour class: Tailwind's preflight already
// resets `a { color: inherit }`. Every other value paints from that intent's
// status/brand text token. primary uses a dedicated "text" token, not
// "default": the fill token is tuned for solid buttons and fails AA contrast
// as standalone text; secondary's "default" already clears AA, so needs no
// equivalent.
const intentColors: Record<Intent, string> = {
  primary: 'text-[var(--color-primary-text)]',
  secondary: 'text-[var(--color-secondary-default)]',
  neutral: 'text-[var(--color-fg-default)]',
  danger: 'text-[var(--color-danger-fg)]',
  success: 'text-[var(--color-success-fg)]',
  warning: 'text-[var(--color-warning-fg)]',
  info: 'text-[var(--color-info-fg)]',
}

// No display utility here (no inline-flex/inline-block): the root stays a
// plain inline element so a long label -- with or without an icon slot --
// wraps mid-run like ordinary text instead of being held together as one
// atomic box. No font-size/weight/leading utility either, so it inherits the
// surrounding paragraph's typography rather than imposing its own.
const classes = computed(() => [
  'underline underline-offset-2 decoration-1 hover:decoration-2',
  'motion-reduce:transition-none transition-[text-decoration-thickness]',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus',
  props.intent !== 'inherit' && intentColors[props.intent],
  props.disabled && 'opacity-50 pointer-events-none cursor-not-allowed',
])
</script>

<template>
  <!-- Root resolves to <a> when an href is passed, else <button>; rootProps
       carries the per-element attrs. #left/#right mirror AtButton's icon
       slots -- an icon communicates the link's purpose but never stands in
       for the text label, so there is no icon-only mode here. -->
  <component :is="tag" v-bind="rootProps" :class="classes">
    <span v-if="$slots.left" class="me-1 inline-flex align-text-bottom"><slot name="left" /></span
    ><slot /><span v-if="$slots.right" class="ms-1 inline-flex align-text-bottom"
      ><slot name="right"
    /></span>
  </component>
</template>

<script setup lang="ts">
import { PhCircleNotch } from '@phosphor-icons/vue'
import { Comment, computed, useSlots } from 'vue'
import { type Intent, intentButtonVars } from '../../constants/intents'
import Icon from '../Icon/AtIcon.vue'

type Variant = 'default' | 'flat'
type Size = 'sm' | 'md' | 'lg' | 'xl'

const props = withDefaults(
  defineProps<{
    intent?: Intent
    variant?: Variant
    size?: Size
    type?: 'button' | 'submit' | 'reset'
    href?: string
    disabled?: boolean
    loading?: boolean
  }>(),
  {
    intent: 'primary',
    variant: 'default',
    size: 'md',
    type: 'button',
    href: undefined,
    disabled: false,
    loading: false,
  },
)

// loading is an inert state: the button can't be clicked, so it folds into the
// disabled attribute (and inherits the disabled styling). The skeleton-style
// pulse on top signals "busy" rather than "off". motion-reduce stills it.
const isDisabled = computed(() => props.disabled || props.loading)

// An href resolves the root to an <a> (role=link); otherwise a <button>
// (role=button). The role falls out of the element choice, no aria-role needed.
const tag = computed(() => (props.href !== undefined ? 'a' : 'button'))

// Per-element root attributes. A <button> carries native type + disabled. An
// <a> has neither: it always opens in a new tab (target=_blank + rel guards
// reverse-tabnabbing); when inert it drops the href (so it isn't navigable) and
// announces via aria-disabled; pointer-events-none (added to classes) blocks the
// cursor.
const rootProps = computed(() =>
  props.href !== undefined
    ? {
        href: isDisabled.value ? undefined : props.href,
        target: '_blank',
        rel: 'noopener noreferrer',
        'aria-disabled': isDisabled.value || undefined,
      }
    : { type: props.type, disabled: isDisabled.value },
)

// One mutually-exclusive cursor (stacked cursor utilities have unreliable order):
// busy while loading, blocked while disabled, actionable otherwise.
const cursor = computed(() =>
  props.loading ? 'cursor-wait' : props.disabled ? 'cursor-not-allowed' : 'cursor-pointer',
)

const slots = useSlots()
// Icon-only when nothing renders in the default slot. The named icon slots
// (#left/#right) don't count as a label, so a button with only an icon trips
// the square padding + leans on aria-label for its accessible name.
const iconOnly = computed(() => {
  const nodes = slots.default?.()
  if (!nodes) return true
  return nodes.every((n) => n.children === null || n.children === '' || n.type === Comment)
})

// Only filter (brightness) transitions. Tailwind's box-shadow (--tw-shadow)
// can't tween, so it always snaps; tweening the lift translate on its own
// would desync from the snapping shadow. Geometry snaps as one, glow eases.
const base =
  'inline-flex items-center justify-center font-body font-bold rounded-md select-none ' +
  'bg-[var(--btn-bg)] text-[var(--btn-fg)] ' +
  'transition-[filter] transition-press ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus'

// sm alone uses leading-none: AtIcon's wrapper is already line-height:1, so
// only sm's icon-only/text pair needs the font's line-height dropped to match
// height. Other tiers keep their inherited mismatch.
const sizes: Record<Size, string> = {
  sm: 'text-sm leading-none px-3 py-1.5 gap-1.5',
  md: 'text-sm px-3 py-1.5 gap-1.5',
  lg: 'text-base px-4 py-2 gap-2',
  xl: 'text-lg px-6 py-3 gap-2',
}

const iconOnlySizes: Record<Size, string> = {
  sm: 'text-sm p-1.5 gap-1.5',
  md: 'text-sm p-1.5 gap-1.5',
  lg: 'text-base p-2 gap-2',
  xl: 'text-lg p-3 gap-2',
}

// default rides the elevation lift tokens: rest sits at `higher` (lift-full),
// hover presses to `high` (lift-half), active drops flush onto the inset `low`,
// so translate-up tracks shadow-down and the press reads as a key sinking in.
// Coloured edge is per-intent (intentShadows below); flat uses a plain border.
const variants: Record<Variant, string> = {
  default:
    '-translate-y-lift-full ' +
    'hover:enabled:-translate-y-lift-half hover:enabled:brightness-[1.08] ' +
    'active:enabled:translate-y-0 active:enabled:brightness-95 ' +
    'disabled:translate-y-0 disabled:shadow-flat',
  flat:
    'border-[3px] border-solid border-[color:var(--btn-edge)] ' +
    'hover:enabled:brightness-[1.08] ' +
    'active:enabled:translate-y-lift-half active:enabled:brightness-95',
}

// The default variant's coloured edge ladder, per intent. Rest = `higher` (4px
// edge), hover = `high` (2px), active = the inset `low` recess. Tailwind only
// scans literals, so every utility is spelled out. neutral takes the plain
// neutral ladder; the rest take their colourway's hue-matched edge.
const intentShadows: Record<Intent, string> = {
  primary:
    'shadow-primary-higher hover:enabled:shadow-primary-high active:enabled:shadow-primary-low',
  secondary:
    'shadow-secondary-higher hover:enabled:shadow-secondary-high active:enabled:shadow-secondary-low',
  neutral: 'shadow-higher hover:enabled:shadow-high active:enabled:shadow-low',
  danger: 'shadow-danger-higher hover:enabled:shadow-danger-high active:enabled:shadow-danger-low',
  success:
    'shadow-success-higher hover:enabled:shadow-success-high active:enabled:shadow-success-low',
  warning:
    'shadow-warning-higher hover:enabled:shadow-warning-high active:enabled:shadow-warning-low',
  info: 'shadow-info-higher hover:enabled:shadow-info-high active:enabled:shadow-info-low',
}

const classes = computed(() => [
  base,
  cursor.value,
  iconOnly.value ? iconOnlySizes[props.size] : sizes[props.size],
  variants[props.variant],
  // The default variant's edge is intent-coloured, so it can't live in the
  // shared variant string -- pull the per-intent shadow ladder here.
  props.variant === 'default' && intentShadows[props.intent],
  // Static dim for an explicitly-disabled button. Skipped while loading: the
  // skeleton pulse already dips opacity to .5 at its trough, and dimming to .5
  // statically would pin it there -- killing the pulse's visible range.
  props.disabled && !props.loading && 'opacity-50',
  props.loading && 'animate-pulse motion-reduce:animate-none',
  // Link path only: a button uses its native disabled to go inert; an anchor
  // needs pointer-events killed since aria-disabled is advisory, not enforced.
  props.href !== undefined && isDisabled.value && 'pointer-events-none',
])
</script>

<template>
  <!-- Root resolves to <a> when an href is passed, else <button>; rootProps
       carries the per-element attrs. aria-label (and any other native attr)
       falls through. It is required for icon-only buttons so they still
       announce; axe enforces it. -->
  <component :is="tag" v-bind="rootProps" :class="classes" :style="intentButtonVars[intent]">
    <!-- While loading a default circle-notch spinner replaces the #left slot
         (overriding any consumer icon); otherwise the slot renders untouched,
         preserving icon DOM order. -->
    <span
      v-if="loading"
      data-testid="spinner"
      class="inline-flex animate-spin motion-reduce:animate-none"
    >
      <Icon :icon="PhCircleNotch" />
    </span>
    <slot v-else name="left" />
    <slot />
    <slot name="right" />
  </component>
</template>
